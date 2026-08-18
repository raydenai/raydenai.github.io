#!/usr/bin/env python3
"""Verify every image referenced in content exists and has correct dimensions.

Two of the six photographic failure modes found in the research corpus are
mechanically preventable: wrong/missing assets and declared dimensions that do
not match the file (which causes layout shift). This script prevents both, and
optionally repairs the declared width/height in place with --fix.

Usage:
  python3 scripts/verify-images.py          # report only
  python3 scripts/verify-images.py --fix    # rewrite wrong width/height
"""

import json
import re
import sys
from pathlib import Path

from PIL import Image

CONTENT = Path("src/content")
PUBLIC = Path("public")

SRC_RE = re.compile(r'"src":\s*"(/images/[^"]+)"')


def dims(rel: str):
    p = PUBLIC / rel.lstrip("/")
    if not p.exists():
        return None
    if p.suffix.lower() == ".svg":
        return "svg"
    with Image.open(p) as im:
        return im.size


def walk(node, path, out):
    """Collect (json_path, src, declared_w, declared_h) for every image object."""
    if isinstance(node, dict):
        if isinstance(node.get("src"), str) and node["src"].startswith("/images/"):
            out.append((path, node["src"], node.get("width"), node.get("height"), node))
        for k, v in node.items():
            walk(v, f"{path}.{k}", out)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, f"{path}[{i}]", out)


def main() -> int:
    fix = "--fix" in sys.argv
    missing, wrong, ok = [], [], 0
    changed_files = []

    for p in sorted(CONTENT.rglob("*.json")):
        data = json.loads(p.read_text())
        refs = []
        walk(data, p.name, refs)
        dirty = False
        for jp, src, dw, dh, node in refs:
            d = dims(src)
            if d is None:
                missing.append((p.name, jp, src))
                continue
            if d == "svg":
                ok += 1
                continue
            aw, ah = d
            if dw != aw or dh != ah:
                wrong.append((p.name, jp, src, f"{dw}x{dh}", f"{aw}x{ah}"))
                if fix:
                    node["width"] = aw
                    node["height"] = ah
                    dirty = True
            else:
                ok += 1
        if dirty:
            p.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
            changed_files.append(p.name)

    print(f"correct: {ok}")
    if missing:
        print(f"\nMISSING FILES ({len(missing)}):")
        for f, jp, src in missing:
            print(f"  {f:<22} {src}   at {jp}")
    if wrong:
        label = "REPAIRED" if fix else "WRONG DIMENSIONS"
        print(f"\n{label} ({len(wrong)}):")
        for f, jp, src, declared, actual in wrong:
            print(f"  {f:<22} {src:<34} declared {declared:>11} -> actual {actual}")
    if changed_files:
        print(f"\nrewrote: {', '.join(changed_files)}")

    return 1 if missing else 0


if __name__ == "__main__":
    raise SystemExit(main())
