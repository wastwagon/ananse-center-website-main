#!/usr/bin/env node
/**
 * Patch Postgres ContentBlock rows that still hold legacy arts-and-culture CMS copy.
 *
 * Run from repo root (requires DATABASE_URL — use backend/.env or docker network URL):
 *
 *   cd backend && npx tsx src/scripts/patch-leadership-content.ts
 *
 * Docker dev backend (recommended when ananse-backend-dev is running):
 *
 *   docker exec ananse-backend-dev npx tsx src/scripts/patch-leadership-content.ts
 *
 * The script only overwrites rows whose body still matches known legacy markers;
 * customized leadership copy is left unchanged.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const backendDir = path.join(root, 'backend')

const result = spawnSync('npx', ['tsx', 'src/scripts/patch-leadership-content.ts'], {
  cwd: backendDir,
  stdio: 'inherit',
  env: process.env,
})

process.exit(result.status ?? 1)
