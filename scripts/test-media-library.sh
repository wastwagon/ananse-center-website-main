#!/usr/bin/env bash
# End-to-end checks: media library upload/serve + YouTube videos unchanged.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

env_get() {
  local key="$1" default="$2"
  if [[ -f .env ]]; then
    local val
    val=$(grep -E "^${key}=" .env 2>/dev/null | head -1 | cut -d= -f2- | sed 's/^["'\'']//;s/["'\'']$//')
    if [[ -n "$val" ]]; then
      echo "$val"
      return
    fi
  fi
  echo "$default"
}

API="$(env_get NEXT_PUBLIC_API_URL http://localhost:4035)"
WEB="$(env_get NEXT_PUBLIC_SITE_URL http://localhost:3035)"
ADMIN_EMAIL="$(env_get ADMIN_EMAIL admin@anansecenter.org)"
ADMIN_PASSWORD="$(env_get ADMIN_PASSWORD change_me_admin_password)"

PASS=0
FAIL=0

ok() { echo "  ✓ $1"; PASS=$((PASS + 1)); }
bad() { echo "  ✗ $1"; FAIL=$((FAIL + 1)); }

echo "=== Media library test ==="
echo "API: $API"
echo "Web: $WEB"
echo ""

# 1. Health
if curl -fsS "$API/api/v1/health" | grep -q '"ok":true'; then
  ok "API health"
else
  bad "API health"
  exit 1
fi

# 2. Admin login
LOGIN=$(curl -fsS -X POST "$API/api/v1/admin/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || true)
if [[ -z "$TOKEN" ]]; then
  TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('accessToken','') or d.get('data',{}).get('token',''))" 2>/dev/null || true)
fi
# Fastify admin may return token at top level — inspect response
if [[ -z "$TOKEN" ]]; then
  TOKEN=$(echo "$LOGIN" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('token') or d.get('accessToken') or (d.get('data') or {}).get('token') or '')
" 2>/dev/null || true)
fi

if [[ -n "$TOKEN" ]]; then
  ok "Admin login"
else
  # Try cookie-based admin proxy on Next instead
  echo "  (direct API login response keys: $(echo "$LOGIN" | python3 -c 'import sys,json; print(list(json.load(sys.stdin).keys()))' 2>/dev/null || echo unknown))"
  bad "Admin login — no token in response"
fi

AUTH_HEADER=()
if [[ -n "$TOKEN" ]]; then
  AUTH_HEADER=(-H "Authorization: Bearer $TOKEN")
fi

# 3. Upload test PNG (1x1)
TEST_FILE="$ROOT/scripts/fixtures/test-pixel.png"
mkdir -p "$(dirname "$TEST_FILE")"
python3 -c "
import base64, pathlib
b = base64.b64decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
)
pathlib.Path('$TEST_FILE').write_bytes(b)
"

UPLOAD=$(curl -fsS -X POST "$API/api/v1/admin/media" \
  "${AUTH_HEADER[@]}" \
  -F "file=@$TEST_FILE;type=image/png" 2>/dev/null || echo '{}')

MEDIA_ID=$(echo "$UPLOAD" | python3 -c "import sys,json; d=json.load(sys.stdin); print((d.get('data') or {}).get('id',''))" 2>/dev/null || true)

if [[ -z "$MEDIA_ID" ]]; then
  # Fallback: Next admin proxy
  UPLOAD=$(curl -fsS -c /tmp/ananse-admin-cookies.txt -b /tmp/ananse-admin-cookies.txt \
    -X POST "$WEB/api/admin/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" 2>/dev/null || true)
  UPLOAD=$(curl -fsS -b /tmp/ananse-admin-cookies.txt \
    -X POST "$WEB/api/admin/media" \
    -F "file=@$TEST_FILE;type=image/png" 2>/dev/null || echo '{}')
  MEDIA_ID=$(echo "$UPLOAD" | python3 -c "import sys,json; d=json.load(sys.stdin); print((d.get('data') or {}).get('id',''))" 2>/dev/null || true)
fi

if [[ -n "$MEDIA_ID" ]]; then
  ok "Upload media asset ($MEDIA_ID)"
else
  bad "Upload media asset"
  echo "    Response: $UPLOAD"
fi

# 4. Serve from API
if [[ -n "$MEDIA_ID" ]]; then
  API_STATUS=$(curl -s -o /tmp/ananse-media.bin -w "%{http_code}" "$API/api/v1/media/file/$MEDIA_ID")
  API_CT=$(curl -sI "$API/api/v1/media/file/$MEDIA_ID" | grep -i content-type | tr -d '\r')
  if [[ "$API_STATUS" == "200" ]] && echo "$API_CT" | grep -qi 'image/png'; then
    ok "API serves file (HTTP $API_STATUS, image/png)"
  else
    bad "API serves file (HTTP $API_STATUS, $API_CT)"
  fi

  # 5. Serve from Next proxy
  WEB_STATUS=$(curl -s -o /tmp/ananse-media-web.bin -w "%{http_code}" "$WEB/api/media/file/$MEDIA_ID")
  if [[ "$WEB_STATUS" == "200" ]] && cmp -s /tmp/ananse-media.bin /tmp/ananse-media-web.bin 2>/dev/null; then
    ok "Next proxy serves same bytes (HTTP $WEB_STATUS)"
  elif [[ "$WEB_STATUS" == "200" ]]; then
    ok "Next proxy serves file (HTTP $WEB_STATUS)"
  else
    bad "Next proxy serves file (HTTP $WEB_STATUS)"
  fi
fi

# 6. Attach cover to first event
if [[ -n "$MEDIA_ID" ]] && [[ ${#AUTH_HEADER[@]} -gt 0 ]]; then
  EVENTS=$(curl -fsS "$API/api/v1/admin/events" "${AUTH_HEADER[@]}")
  EVENT_ID=$(echo "$EVENTS" | python3 -c "import sys,json; d=json.load(sys.stdin); print((d.get('data') or [{}])[0].get('id',''))")
  if [[ -n "$EVENT_ID" ]]; then
    PATCH=$(curl -fsS -X PATCH "$API/api/v1/admin/events/$EVENT_ID" \
      "${AUTH_HEADER[@]}" \
      -H "Content-Type: application/json" \
      -d "{\"coverMediaId\":\"$MEDIA_ID\"}")
    COVER=$(echo "$PATCH" | python3 -c "import sys,json; print((json.load(sys.stdin).get('data') or {}).get('coverMediaId',''))")
    if [[ "$COVER" == "$MEDIA_ID" ]]; then
      ok "Event coverMediaId saved"
    else
      bad "Event coverMediaId saved"
    fi

    PUBLIC=$(curl -fsS "$API/api/v1/events")
    HAS_COVER=$(echo "$PUBLIC" | python3 -c "
import sys, json
mid = '$MEDIA_ID'
for e in json.load(sys.stdin).get('data', []):
    if e.get('coverImageUrl') == f'/api/media/file/{mid}':
        print('yes')
        break
" 2>/dev/null || true)
    if [[ "$HAS_COVER" == "yes" ]]; then
      ok "Public events API returns coverImageUrl from media library"
    else
      bad "Public events API coverImageUrl"
    fi
  fi
fi

# 7. Videos page — YouTube only, no media library URLs
VIDEOS_HTML=$(curl -fsS "$WEB/videos" 2>/dev/null || echo '')
YT_COUNT=$(echo "$VIDEOS_HTML" | grep -o 'youtube.com/embed' | wc -l | tr -d ' ')
MEDIA_ON_VIDEOS=$(echo "$VIDEOS_HTML" | grep -c '/api/media/file' || true)

if [[ "$YT_COUNT" -ge 1 ]]; then
  ok "Videos page embeds YouTube ($YT_COUNT embed URLs found)"
else
  bad "Videos page should embed YouTube"
fi

if [[ "$MEDIA_ON_VIDEOS" -eq 0 ]]; then
  ok "Videos page has no /api/media/file URLs (YouTube only)"
else
  bad "Videos page incorrectly uses media library ($MEDIA_ON_VIDEOS hits)"
fi

# 8. CMS registry default videos are YouTube
REGISTRY_YT=$(grep -c 'youtube.com/embed' "$ROOT/lib/cms/registry.ts" || true)
if [[ "$REGISTRY_YT" -ge 8 ]]; then
  ok "CMS registry video defaults use YouTube embed ($REGISTRY_YT entries)"
else
  bad "CMS registry video defaults"
fi

REGISTRY_MEDIA=$(grep 'videos.items' -A 20 "$ROOT/lib/cms/registry.ts" | grep -c '/api/media/file' || true)
if [[ "$REGISTRY_MEDIA" -eq 0 ]]; then
  ok "CMS videos.items defaults do not reference media library"
else
  bad "CMS videos.items references media library"
fi

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[[ "$FAIL" -eq 0 ]]
