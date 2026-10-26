#!/usr/bin/env python3
"""Phone-readable sheet of the pixel-fit crops: per icon, before / after at 2x and 3x, each device pixel shown as a block
(nearest-neighbour, 2x crops x6 and 3x crops x4, so both are 288px), with the true-size crops beside them.
  python3 src/pixel-fit-sheet.py   -> stills/pixelfit/sheet.png (from stills/pixelfit/raw/, written by pixel-fit-crops.js)"""
import os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.join(os.path.dirname(__file__), '..')
RAW = os.path.join(ROOT, 'stills', 'pixelfit', 'raw')
IDS = [('cafe', 'Café'), ('bar', 'Bar'), ('museum', 'Museum'), ('nature', 'Nature'), ('star', 'Star'), ('plus', 'Add')]
PAPER, INK, GREY = (250, 245, 234), (18, 41, 63), (90, 86, 76)
try:
    F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
    FS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
except OSError:
    F = FS = ImageFont.load_default()
CELL, GAP, LEFT, TOP = 288, 18, 150, 70
cols = [('before', 2, '2x before'), ('after', 2, '2x after'), ('before', 3, '3x before'), ('after', 3, '3x after')]
W = LEFT + len(cols) * (CELL + GAP)
H = TOP + len(IDS) * (CELL + GAP)
im = Image.new('RGB', (W, H), PAPER)
dr = ImageDraw.Draw(im)
for c, (_, _, t) in enumerate(cols):
    dr.text((LEFT + c * (CELL + GAP), 24), t, font=F, fill=INK)
for r, (i, name) in enumerate(IDS):
    y = TOP + r * (CELL + GAP)
    dr.text((10, y + 10), name, font=F, fill=INK)
    for c, (st, dpr, _) in enumerate(cols):
        src = Image.open(os.path.join(RAW, f'{i}-{st}-{dpr}x.png')).convert('RGB')
        big = src.resize((CELL, CELL), Image.NEAREST)
        x = LEFT + c * (CELL + GAP)
        im.paste(big, (x, y))
    # true size (each crop at its own device-pixel size): 2x before / after, then 3x before / after
    for k, dpr in enumerate((2, 3)):
        for j, st in enumerate(('before', 'after')):
            src = Image.open(os.path.join(RAW, f'{i}-{st}-{dpr}x.png')).convert('RGB')
            im.paste(src, (10 + j * (src.width + 6), y + 56 + k * 90))
out = os.path.join(ROOT, 'stills', 'pixelfit', 'sheet.png')
im.save(out)
print(out, im.size)
