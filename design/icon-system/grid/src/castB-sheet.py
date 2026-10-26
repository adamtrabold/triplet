"""Look sheet for the B prototype: approved vs cast, at 24, 72 and 288px (1x). Writes svg/castB/sheet-<name>.png."""
import os, sys, json
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__))
from castlib import N, G, raster_path, downsample
import importlib.util
spec = importlib.util.spec_from_file_location('castB', os.path.join(os.path.dirname(__file__), 'castB.py'))
B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)
HERE = B.HERE; OUT = os.path.join(HERE, 'svg/castB')

def tile(mask, px):
    a = downsample(mask, px)
    paper = np.array([250, 245, 234.]); ink = np.array([18, 41, 63.])
    return Image.fromarray((paper * (1 - a[..., None]) + ink * a[..., None]).astype(np.uint8))

def load_cast(k):
    return np.unpackbits(np.load(os.path.join(OUT, f'{k}.npy')))[:N * N].reshape(N, N).astype(bool)

def sheet(names, fname, big=288):
    allr = {**B.six_roots(), **B.new_roots()}
    rows = []
    for k in names:
        v = allr[k]
        ms = []
        if v['approved']: ms.append(('approved', raster_path(v['approved'])))
        ms.append(('B', load_cast(k)))
        rows.append((k, ms))
    W = 20 + 2 * (24 + 20 + 72 + 20 + big + 30); H = 20 + len(rows) * (big + 40)
    im = Image.new('RGB', (W, H), (250, 245, 234)); dr = ImageDraw.Draw(im)
    y = 20
    for k, ms in rows:
        x = 20
        for lab, m in ms:
            dr.text((x, y - 14), f'{k} {lab}', fill=(90, 86, 76))
            im.paste(tile(m, 24), (x, y)); x += 44
            im.paste(tile(m, 72), (x, y)); x += 92
            im.paste(tile(m, big), (x, y)); x += big + 30
        y += big + 40
    im.save(os.path.join(OUT, fname))

if __name__ == '__main__':
    sheet(sys.argv[2:], sys.argv[1])
