#!/usr/bin/env python3
"""Sync placeholder CMS defaults from lib → backend registries."""
from __future__ import annotations

from pathlib import Path
import re
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    src = (ROOT / 'lib/cms/static-pages.ts').read_text()
    if "from './registry'" in src and "from './registry.js'" not in src:
        src = src.replace("from './registry'", "from './registry.js'")
    (ROOT / 'backend/src/cms/static-pages.ts').write_text(src)
    print('synced static-pages')

    lib = (ROOT / 'lib/cms/registry.ts').read_text()
    back = (ROOT / 'backend/src/cms/registry.ts').read_text()

    def extract_const(name: str) -> Optional[str]:
        m = re.search(rf'const {name}[^=]*=\s*(\[[\s\S]*?\]|\{{[\s\S]*?\}})\s*', lib)
        return m.group(1) if m else None

    for name in ('HOME_TESTIMONIALS_DEFAULT', 'EVENTS_HIGHLIGHTS_TESTIMONIAL_DEFAULT'):
        body = extract_const(name)
        if not body:
            print('missing in lib', name)
            continue
        if name not in back:
            print('backend has no const', name)
            continue
        back2, n = re.subn(
            rf'(const {name}[^=]*=\s*)(\[[\s\S]*?\]|\{{[\s\S]*?\}})(\s*)',
            rf'\g<1>{body}\3',
            back,
            count=1,
        )
        print(f'updated const {name}' if n else f'failed replace {name}')
        back = back2

    for key in ('about.timeline', 'programs.testimonials'):
        pat = rf"'{re.escape(key)}':\s*\{{[\s\S]*?defaultBody:\s*JSON\.stringify\(([\s\S]*?),\s*null,\s*2,\s*\),"
        m_lib = re.search(pat, lib)
        m_back = re.search(pat, back)
        if m_lib and m_back:
            back = back[: m_back.start(1)] + m_lib.group(1) + back[m_back.end(1) :]
            print(f'synced {key}')
        else:
            print(f'{key} sync failed', bool(m_lib), bool(m_back))

    (ROOT / 'backend/src/cms/registry.ts').write_text(back)
    print('backend registry written')


if __name__ == '__main__':
    main()
