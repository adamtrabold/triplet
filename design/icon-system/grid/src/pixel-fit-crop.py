#!/usr/bin/env python3
"""Glyph-region crops (css 4..20 of the 24 badge) of the raw glyph-only pixel-fit renders, at their device-pixel size, for the board
(shown there with nearest-neighbour scaling: 2x crops 32px x6, 3x crops 48px x4, both 192px).
  python3 src/pixel-fit-crop.py  -> stills/pixelfit/crop/<id>-<before|after>-<dpr>x.png"""
import os
from PIL import Image
ROOT = os.path.join(os.path.dirname(__file__), '..')
RAW, OUT = os.path.join(ROOT, 'stills', 'pixelfit', 'raw'), os.path.join(ROOT, 'stills', 'pixelfit', 'crop')
os.makedirs(OUT, exist_ok=True)
for i in ('cafe', 'bar', 'museum', 'nature', 'star', 'plus'):
    for st in ('before', 'after'):
        for dpr in (2, 3):
            im = Image.open(os.path.join(RAW, f'{i}-{st}-{dpr}x-glyph.png')).convert('RGB')   # glyph only: the ring would show at the crop's corners
            im.crop((4 * dpr, 4 * dpr, 20 * dpr, 20 * dpr)).save(os.path.join(OUT, f'{i}-{st}-{dpr}x.png'), optimize=True)
print('ok')
