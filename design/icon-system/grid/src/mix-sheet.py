"""Look sheets for the mix prototype (src/mix.py). python3 -I src/mix-sheet.py
Writes svg/mix/sheet-six.png (approved | mix | overlay, 24/72/288px), sheet-new.png, row-1x.png / row-3x.png (the six approved
then the three new, at 24 and 72), and over-<name>.png (8x overlay: navy both, orange approved only, blue mix only)."""
import os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__))
from castlib import N, G, raster_path, downsample
spec = importlib.util.spec_from_file_location('mix', os.path.join(os.path.dirname(__file__), 'mix.py'))
M = importlib.util.module_from_spec(spec); spec.loader.exec_module(M)
OUT = os.path.join(M.HERE, 'svg/mix')
PAPER = np.array([250, 245, 234.]); INK = np.array([18, 41, 63.])

def tile(mask, px):
    a = downsample(mask, px)
    return Image.fromarray((PAPER * (1 - a[..., None]) + INK * a[..., None]).astype(np.uint8))

def load(k): return np.unpackbits(np.load(os.path.join(OUT, f'{k}.npy')))[:N * N].reshape(N, N).astype(bool)

def overlay(a, b, px):
    im = np.full((N, N, 3), 250, np.uint8)
    im[a & b] = (18, 41, 63); im[a & ~b] = (238, 116, 52); im[b & ~a] = (60, 140, 220)
    return Image.fromarray(im).resize((px, px), Image.BOX)

def sheet(names, fname, big=288):
    allr = {**M.six(), **M.new()}
    W = 20 + 3 * (24 + 16 + 72 + 16 + big + 24); H = 20 + len(names) * (big + 36)
    im = Image.new('RGB', (W, H), (250, 245, 234)); dr = ImageDraw.Draw(im); y = 24
    for k in names:
        m = load(k); x = 20
        cols = []
        if allr[k].get('approved'):
            a = raster_path(allr[k]['approved']); cols = [('approved', a), ('mix', m)]
        else:
            cols = [('mix', m)]
        for lab, mm in cols:
            dr.text((x, y - 14), f'{k} {lab}', fill=(90, 86, 76))
            im.paste(tile(mm, 24), (x, y)); x += 40
            im.paste(tile(mm, 72), (x, y)); x += 88
            im.paste(tile(mm, big), (x, y)); x += big + 24
        if len(cols) == 2:
            dr.text((x, y - 14), f'{k} overlay', fill=(90, 86, 76))
            im.paste(overlay(cols[0][1], m, big), (x + 128, y))
        y += big + 36
    im.save(os.path.join(OUT, fname))

def row():
    allr = M.six()
    masks = [raster_path(allr[k]['approved']) for k in ('cafe', 'bar', 'museum', 'nature', 'star', 'plus')]
    masks += [load(k) for k in ('cafe', 'bar', 'museum', 'nature', 'star', 'plus')]
    masks += [load(k) for k in ('restaurant', 'bag', 'bed')]
    for sc in (1, 3):
        rows = []
        for px in (24, 72):
            for grp in (masks[:6], masks[6:12] + masks[12:]):
                tiles = []
                for m in grp:
                    a = downsample(m, px * sc)
                    tiles.append(PAPER * (1 - a[..., None]) + INK * a[..., None])
                    tiles.append(np.tile(PAPER, (px * sc, 8 * sc, 1)))
                rows.append(np.concatenate(tiles, 1))
        w = max(r.shape[1] for r in rows)
        im = np.concatenate([np.pad(r, ((4 * sc, 4 * sc), (0, w - r.shape[1]), (0, 0)), constant_values=250) for r in rows], 0)
        Image.fromarray(im.astype(np.uint8)).save(os.path.join(OUT, f'row-{sc}x.png'))

if __name__ == '__main__':
    sheet(['cafe', 'bar', 'museum', 'nature', 'star', 'plus'], 'sheet-six.png')
    sheet(['restaurant', 'bag', 'bed'], 'sheet-new.png')
    row()
