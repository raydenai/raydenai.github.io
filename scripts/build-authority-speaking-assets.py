from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public' / 'images'
MASTER = ROOT / 'assets' / 'photo-masters' / 'authority-speaking'
MASTER.mkdir(parents=True, exist_ok=True)

ASSETS = {
    'authority-speaking-hero': ('authority-speaking-hero-master.jpg', 1920),
    'authority-speaking-work': ('authority-speaking-work-master.jpg', 1600),
    'authority-speaking-stage': ('authority-speaking-stage-master.jpg', 1920),
    'authority-speaking-close': ('authority-speaking-close-master.jpg', 1200),
}

for name, (master_name, max_width) in ASSETS.items():
    public_master = PUBLIC / master_name
    master_path = MASTER / master_name
    if public_master.exists() and not master_path.exists():
        public_master.replace(master_path)
    if not master_path.exists():
        raise FileNotFoundError(master_path)
    image = Image.open(master_path).convert('RGB')
    if image.width > max_width:
        height = round(image.height * max_width / image.width)
        image = image.resize((max_width, height), Image.Resampling.LANCZOS)
    output = PUBLIC / f'{name}.webp'
    image.save(output, 'WEBP', quality=84, method=6)
    print(f'{output.name}: {image.width}x{image.height}')
