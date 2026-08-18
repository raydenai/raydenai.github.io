#!/usr/bin/env python3
"""Clean an AI-generated transparent cut-out portrait.

Fixes the two defects the corpus research flagged as the most commonly visible
photographic flaw on personal brand sites (visible fringing / green halo):

1. Green spill: pixels where the chroma-key colour bled into hair edges.
   Detected on hue, then neutralised by pulling the green channel down to the
   mean of red and blue while preserving luminance.
2. Halo alpha: semi-transparent pixels that still carry key colour. Their alpha
   is remapped with a steeper curve so soft hair edges stay soft but the
   1-3px contaminated rim disappears.

Usage: python3 scripts/clean-cutout.py <in.png> [out.png]
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image


def clean(path_in: Path, path_out: Path) -> None:
    im = Image.open(path_in).convert("RGBA")
    arr = np.array(im).astype(np.float32)
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]

    # --- 1. despill -------------------------------------------------------
    rb_mean = (r + b) / 2.0
    spill = np.clip(g - rb_mean, 0, None)            # how much green excess
    # Only treat pixels where green genuinely dominates both other channels.
    mask = (g > r + 8) & (g > b + 8)
    strength = np.where(mask, 1.0, 0.0)
    g_fixed = g - spill * strength
    # Preserve perceived luminance so hair does not go muddy.
    lum_before = 0.2126 * r + 0.7152 * g + 0.0722 * b
    lum_after = 0.2126 * r + 0.7152 * g_fixed + 0.0722 * b
    ratio = np.where(lum_after > 1, lum_before / np.maximum(lum_after, 1), 1.0)
    ratio = np.clip(ratio, 1.0, 1.35)
    r = np.clip(r * ratio, 0, 255)
    g = np.clip(g_fixed * ratio, 0, 255)
    b = np.clip(b * ratio, 0, 255)

    # --- 2. alpha edge tightening ----------------------------------------
    an = a / 255.0
    # Steepen the ramp: kill the faint outer halo, keep genuine soft edges.
    an = np.clip((an - 0.16) / (1.0 - 0.16), 0, 1)
    an = an ** 1.12
    # Any remaining greenish semi-transparent pixel is halo, not subject.
    halo = mask & (a < 235)
    an = np.where(halo, an * 0.28, an)
    a = an * 255.0

    out = np.stack([r, g, b, a], axis=-1).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(path_out)

    # Report
    px = np.array(Image.open(path_out).convert("RGBA"))
    gg = px[..., 1].astype(int)
    rr = px[..., 0].astype(int)
    bb = px[..., 2].astype(int)
    aa = px[..., 3]
    visible = aa > 8
    remaining = int(np.sum(visible & (gg > rr + 22) & (gg > bb + 22)))
    print(f"{path_in.name} -> {path_out.name}")
    print(f"  visible px: {int(visible.sum()):,}   residual green px: {remaining:,}")


if __name__ == "__main__":
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else src
    clean(src, dst)
