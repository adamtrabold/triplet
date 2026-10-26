"""The six (approved) beside the B-built new icons, at 24 and 72px, 1x and 3x. Writes svg/castB/row-<scale>x.png."""
import os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from castlib import N, raster_path, downsample
import importlib.util
spec = importlib.util.spec_from_file_location('castB', os.path.join(os.path.dirname(__file__), 'castB.py'))
B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)
OUT = os.path.join(B.HERE, 'svg/castB')
six = B.six_roots()
masks = [raster_path(six[k]['approved']) for k in ('cafe', 'bar', 'museum', 'nature', 'star', 'plus')]
for k in ('restaurant', 'bag', 'bed'):
    masks.append(np.unpackbits(np.load(os.path.join(OUT, f'{k}.npy')))[:N * N].reshape(N, N).astype(bool))
paper = np.array([250, 245, 234.]); ink = np.array([18, 41, 63.])
for sc in (1, 3):
    rows = []
    for px in (24, 72):
        tiles = []
        for m in masks:
            a = downsample(m, px * sc)
            tiles.append(paper * (1 - a[..., None]) + ink * a[..., None])
            tiles.append(np.tile(paper, (px * sc, 8 * sc, 1)))
        rows.append(np.concatenate(tiles, 1))
    w = max(r.shape[1] for r in rows)
    im = np.concatenate([np.pad(r, ((4 * sc, 4 * sc), (0, w - r.shape[1]), (0, 0)), constant_values=250) for r in rows], 0)
    Image.fromarray(im.astype(np.uint8)).save(os.path.join(OUT, f'row-{sc}x.png'))
