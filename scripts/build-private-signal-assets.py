#!/usr/bin/env python3
"""Build responsive web derivatives for the Private Signal premium photo chapter."""
from pathlib import Path
from PIL import Image

SRC = Path('assets/photo-masters/private-signal')
OUT = Path('public/images')
ASSETS = {
    'private-signal-hero-master.jpg': ('private-signal-hero', 'wide', 0.74),
    'private-signal-working-master.jpg': ('private-signal-working', 'wide', None),
    'private-signal-close-master.jpg': ('private-signal-close', 'portrait', None),
    'private-signal-artifact-master.jpg': ('private-signal-artifact', 'wide', None),
}
WIDTHS = {'wide': [1920, 1280, 960], 'portrait': [1200, 900, 600]}


def width_resize(image: Image.Image, width: int) -> Image.Image:
    if image.width <= width:
        return image.copy()
    return image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)


def mobile_crop(image: Image.Image, focus_x: float) -> Image.Image:
    aspect = 4 / 5
    crop_width = min(image.width, round(image.height * aspect))
    crop_height = round(crop_width / aspect)
    center_x = round(image.width * focus_x)
    left = max(0, min(image.width - crop_width, center_x - crop_width // 2))
    top = max(0, round((image.height - crop_height) * 0.18))
    return image.crop((left, top, left + crop_width, top + crop_height))


def save_webp(image: Image.Image, path: Path) -> None:
    image.convert('RGB').save(path, 'WEBP', quality=84, method=6)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    produced = []
    for source, (name, role, focus_x) in ASSETS.items():
        image = Image.open(SRC / source).convert('RGB')
        for index, width in enumerate(WIDTHS[role]):
            suffix = '' if index == 0 else f'@{width}'
            target = OUT / f'{name}{suffix}.webp'
            save_webp(width_resize(image, width), target)
            produced.append(target)
        if focus_x is not None:
            target = OUT / f'{name}-mobile.webp'
            save_webp(width_resize(mobile_crop(image, focus_x), 800), target)
            produced.append(target)
    total = sum(path.stat().st_size for path in produced)
    for path in produced:
        print(f'{path.name:<38} {path.stat().st_size / 1024:7.1f} KB')
    print(f'{len(produced)} files / {total / 1024 / 1024:.2f} MB')


if __name__ == '__main__':
    main()
