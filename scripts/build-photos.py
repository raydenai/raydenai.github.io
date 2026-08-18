#!/usr/bin/env python3
"""AURA photo pipeline.

Turns the master photo set in public/images/photos/ into the web-ready asset
set the blocks consume. Implements the delivery rules from the photography
research: every hero frame ships a desktop composition AND a mobile-safe crop,
cut-outs keep alpha, everything else becomes WebP.

Rules per shot role (see docs/PHOTOGRAPHY_PLAYBOOK.md):
  cutout   -> alpha PNG, quantised, plus 2x/1x widths
  wide     -> WebP at 1920/1280/960
  portrait -> WebP at 1200/900/600
  avatar   -> WebP square at 256/128
  mockup   -> alpha PNG or WebP at 1200/800

Usage: python3 scripts/build-photos.py
"""

from pathlib import Path

from PIL import Image

SRC = Path("assets/photo-masters")
OUT = Path("public/images")

# shot file -> (role, output basename)
MANIFEST = {
    "02-hero-cutout.png":        ("cutout", "portrait-hero"),
    "03-hero-insitu.png":        ("wide", "portrait-hero-insitu"),
    "04-story-environmental.png": ("wide", "portrait-story"),
    "05-stage-wide.png":         ("wide", "stage-wide"),
    "06-stage-tight.png":        ("wide", "stage-tight"),
    "07-working-candid.png":     ("wide", "workshop"),
    "08-seated-editorial.png":   ("portrait", "portrait-seated"),
    "09-detail-texture.png":     ("wide", "texture-dark"),
    "book-cover.png":            ("mockup-alpha", "book-cover"),
    "leadmagnet.png":            ("mockup", "leadmagnet"),
    "avatar-1.png":              ("avatar", "avatar-1"),
    "avatar-2.png":              ("avatar", "avatar-2"),
    "avatar-3.png":              ("avatar", "avatar-3"),
    "avatar-4.png":              ("avatar", "avatar-4"),
}

WIDTHS = {
    "wide": [1920, 1280, 960],
    "portrait": [1200, 900, 600],
    "cutout": [1200, 800],
    "mockup": [1200, 800],
    "mockup-alpha": [900, 600],
    "avatar": [256, 128],
}

# Mobile-safe crop: for hero shots the desktop frame places the subject in a
# side third, which collapses badly on phones. Crop toward the subject.
MOBILE_CROPS = {
    # basename: (focus_x fraction of width, target aspect w/h)
    "portrait-hero-insitu": (0.72, 4 / 5),
    "stage-tight": (0.42, 4 / 5),
    "portrait-story": (0.60, 4 / 5),
}


def save_webp(im: Image.Image, path: Path, quality: int = 84) -> None:
    im.convert("RGB").save(path, "WEBP", quality=quality, method=6)


def save_png(im: Image.Image, path: Path) -> None:
    """Save an alpha PNG, quantised to keep cut-outs light.

    Cut-out portraits are the heaviest asset on a personal brand site because
    they cannot be JPEG/WebP-flattened. Quantising the RGB payload to an
    adaptive 256-colour palette while preserving the alpha channel typically
    cuts 60-75% of the weight with no visible difference against a dark
    surface, which is where these are always composited.
    """
    if im.mode != "RGBA":
        im.save(path, "PNG", optimize=True)
        return
    alpha = im.getchannel("A")
    rgb = im.convert("RGB").quantize(colors=190, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    out.save(path, "PNG", optimize=True)


def resize_to_width(im: Image.Image, width: int) -> Image.Image:
    if im.width <= width:
        return im.copy()
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS)


def mobile_crop(im: Image.Image, focus_x: float, aspect: float) -> Image.Image:
    """Crop to `aspect` (w/h) keeping the subject at focus_x centred."""
    target_w = min(im.width, round(im.height * aspect))
    target_h = round(target_w / aspect)
    if target_h > im.height:
        target_h = im.height
        target_w = round(target_h * aspect)
    cx = im.width * focus_x
    left = round(max(0, min(im.width - target_w, cx - target_w / 2)))
    top = round(max(0, (im.height - target_h) * 0.25))  # favour headroom
    return im.crop((left, top, left + target_w, top + target_h))


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"missing {SRC}")
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    written = []

    for fname, (role, base) in MANIFEST.items():
        p = SRC / fname
        if not p.exists():
            print(f"  SKIP (missing) {fname}")
            continue
        im = Image.open(p)
        alpha = role in ("cutout", "mockup-alpha") and im.mode == "RGBA"
        if not alpha:
            im = im.convert("RGB")

        widths = WIDTHS[role]
        for i, w in enumerate(widths):
            r = resize_to_width(im, w)
            suffix = "" if i == 0 else f"@{w}"
            if alpha:
                out = OUT / f"{base}{suffix}.png"
                save_png(r, out)
            else:
                out = OUT / f"{base}{suffix}.webp"
                save_webp(r, out)
            size = out.stat().st_size
            total += size
            written.append((out.name, size))

        # mobile-safe crop
        if base in MOBILE_CROPS:
            fx, aspect = MOBILE_CROPS[base]
            m = mobile_crop(im, fx, aspect)
            m = resize_to_width(m, 800)
            out = OUT / f"{base}-mobile.webp"
            save_webp(m, out)
            size = out.stat().st_size
            total += size
            written.append((out.name, size))

    for name, size in sorted(written):
        print(f"  {name:<34} {size/1024:>8.1f} KB")
    print(f"\n{len(written)} files, {total/1024/1024:.2f} MB total")


if __name__ == "__main__":
    main()
