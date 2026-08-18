#!/usr/bin/env python3
"""
Remove green-screen spill from an alpha cut-out portrait.

Chroma-keyed cut-outs keep a thin green halo around hair and shoulders. Against
a dark hero background that halo reads as a cheap composite, which undermines
exactly the premium impression the hero block exists to create.

Strategy: where green dominates both other channels, pull green down toward the
max of red and blue (standard despill), and reduce alpha on pixels that are
mostly spill so the edge feathers into the background instead of glowing.
"""

import sys
from PIL import Image


def despill(path: str, strength: float = 1.0) -> None:
    image = Image.open(path).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    changed = 0

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue

            limit = max(r, b)
            if g > limit:
                excess = g - limit
                # Only treat genuine spill, not natural green in the image.
                if excess > 6:
                    new_g = int(g - excess * strength)
                    # Heavily spilled, semi-transparent pixels are halo: fade them.
                    new_a = a
                    if a < 250 and excess > 22:
                        new_a = max(0, int(a * 0.55))
                    pixels[x, y] = (r, new_g, b, new_a)
                    changed += 1

    image.save(path, optimize=True)
    print(f"{path}: despilled {changed} pixels")


if __name__ == "__main__":
    targets = sys.argv[1:] or ["public/images/portrait-hero.png"]
    for target in targets:
        despill(target)
