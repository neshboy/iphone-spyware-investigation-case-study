import glob
import os
from PIL import Image, ImageChops

FIG_DIR = os.path.join(os.path.dirname(__file__), "figures")
PAD = 20

for path in glob.glob(os.path.join(FIG_DIR, "fig*.png")):
    im = Image.open(path).convert("RGB")
    bg = Image.new("RGB", im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg)
    bbox = diff.getbbox()
    if not bbox:
        print("skip (blank):", path)
        continue
    left, top, right, bottom = bbox
    left = max(0, left - PAD)
    top = max(0, top - PAD)
    right = min(im.width, right + PAD)
    bottom = min(im.height, bottom + PAD)
    cropped = im.crop((left, top, right, bottom))
    cropped.save(path)
    print(os.path.basename(path), "->", cropped.size)
