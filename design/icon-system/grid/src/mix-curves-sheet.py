"""The mix in clean curves (src/mix-curves.js) against the approved six: areas, ink, and look sheets at 24, 72 and his zoom
(27px a unit). python3 -I src/mix-curves-sheet.py  -> svg/mix/curves/compare.json, zoom-<name>.png, row-1x.png, row-3x.png"""
import json, os, re, sys
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__))
from castlib import N, G, raster_path, downsample, parse_path, raster_polys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, 'svg/mix/curves')
cons = json.load(open(os.path.join(HERE, 'svg/g7/construction.json')))
PAPER = np.array([250, 245, 234.]); INK = np.array([18, 41, 63.])
SIX = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus']; NEW = ['restaurant', 'bag', 'bed']
def d_of(k): return re.search(r' d="([^"]+)"', open(os.path.join(OUT, f'{k}.svg')).read()).group(1)

def render(d, px):
    """Vector raster at px across the 24 box, 4x supersampled."""
    ss = 4; n = px * ss; im = Image.new('L', (n, n), 0); dr = ImageDraw.Draw(im)
    acc = np.zeros((n, n), bool)
    for s in parse_path(d, steps=32):
        t = Image.new('1', (n, n), 0); ImageDraw.Draw(t).polygon([(x * n / 24, y * n / 24) for x, y in s], fill=1); acc ^= np.array(t, bool)
    a = acc.reshape(px, ss, px, ss).mean(axis=(1, 3))
    return a

def tile(a): return Image.fromarray((PAPER * (1 - a[..., None]) + INK * a[..., None]).astype(np.uint8))

if __name__ == '__main__':
    comp = {}
    for k in SIX:
        a = raster_path(cons[k]['d']); m = raster_path(d_of(k))
        comp[k] = dict(approved_only=round(float((a & ~m).sum()) / G / G, 3), mix_only=round(float((m & ~a).sum()) / G / G, 3),
                       ink=round(float(m.sum()) / G / G, 2), ink_approved=round(float(a.sum()) / G / G, 2))
        print(k, comp[k])
        # his zoom: 27px a unit; approved | mix | overlay (orange approved only, blue mix only)
        z = 27 * 24
        A = render(cons[k]['d'], z); M = render(d_of(k), z)
        ov = np.full((z, z, 3), 250.)
        both = np.minimum(A, M); ov = ov * (1 - both[..., None]) + INK * both[..., None]
        ao = np.clip(A - M, 0, 1); mo = np.clip(M - A, 0, 1)
        ov = ov * (1 - ao[..., None]) + np.array([238, 116, 52.]) * ao[..., None]
        ov = ov * (1 - mo[..., None]) + np.array([60, 140, 220.]) * mo[..., None]
        ys, xs = np.where(np.maximum(A, M) > 0.02); y0, y1, x0, x1 = max(0, ys.min() - 20), ys.max() + 20, max(0, xs.min() - 20), xs.max() + 20
        row = np.concatenate([np.asarray(tile(A))[y0:y1, x0:x1], np.full((y1 - y0, 20, 3), 250, np.uint8), np.asarray(tile(M))[y0:y1, x0:x1],
                              np.full((y1 - y0, 20, 3), 250, np.uint8), ov[y0:y1, x0:x1].astype(np.uint8)], 1)
        Image.fromarray(row).save(os.path.join(OUT, f'zoom-{k}.png'))
    for k in NEW:
        comp[k] = dict(ink=round(float(raster_path(d_of(k)).sum()) / G / G, 2))
    json.dump(comp, open(os.path.join(OUT, 'compare.json'), 'w'), indent=1)
    for sc in (1, 3):
        rows = []
        for px in (24, 72):
            for ds in ([cons[k]['d'] for k in SIX], [d_of(k) for k in SIX + NEW]):
                tl = []
                for d in ds:
                    tl.append(PAPER * (1 - render(d, px * sc)[..., None]) + INK * render(d, px * sc)[..., None]); tl.append(np.tile(PAPER, (px * sc, 8 * sc, 1)))
                rows.append(np.concatenate(tl, 1))
        w = max(r.shape[1] for r in rows)
        im = np.concatenate([np.pad(r, ((4 * sc, 4 * sc), (0, w - r.shape[1]), (0, 0)), constant_values=250) for r in rows], 0)
        Image.fromarray(im.astype(np.uint8)).save(os.path.join(OUT, f'row-{sc}x.png'))
