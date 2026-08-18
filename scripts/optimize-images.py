#!/usr/bin/env python3
"""
Convert demo photography to WebP and keep PNG only where transparency is needed.

The source corpus routinely shipped 2-6MB of unoptimised hero JPEGs; this step is
what keeps a media-heavy personal brand page inside a sane byte budget.
"""

import os
import sys
from PIL import Image

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")

# Files that must keep an alpha channel (cut-outs, signature, mockups).
KEEP_PNG = {"portrait-hero.png", "signature.png", "leadmagnet.png"}


def main() -> int:
    total_before = 0
    total_after = 0

    for name in sorted(os.listdir(IMAGES_DIR)):
        if not name.endswith(".png"):
            continue

        path = os.path.join(IMAGES_DIR, name)
        before = os.path.getsize(path)
        total_before += before
        image = Image.open(path)

        if name in KEEP_PNG:
            # Quantise the alpha PNG rather than converting it.
            out_path = path
            image.save(out_path, optimize=True)
            after = os.path.getsize(out_path)
        else:
            out_path = path.replace(".png", ".webp")
            image.convert("RGB").save(out_path, "WEBP", quality=82, method=6)
            after = os.path.getsize(out_path)
            os.remove(path)

        total_after += after
        print(f"{name:24} {before // 1024:>6} KB -> {after // 1024:>6} KB  {os.path.basename(out_path)}")

    print(f"\nTotal: {total_before // 1024} KB -> {total_after // 1024} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
