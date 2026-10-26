"""Shared raster helpers for the B prototype (castB.py) and C's fingerprint (fingerprint.py).

Outside the engine: nothing here is used by engine.js, picks7.js or the six's builds.
Everything works on a 24x24-unit glyph (1 unit = 1px at 24) rasterised at G grid px per unit.
Needs numpy, scipy, scikit-image, Pillow.
"""
import re, math
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from skimage import measure

G = 48            # grid px per unit: 24px -> /48, 72px -> /16
N = 24 * G

# ---------- SVG path -> polygons (subpaths) ----------
_tok = re.compile(r'[MmLlHhVvCcSsQqZz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?')

def parse_path(d, steps=24):
    toks = _tok.findall(d)
    i, cmd = 0, None
    x = y = sx = sy = 0.0
    lcx = lcy = None
    subs, cur = [], []
    def num():
        nonlocal i
        v = float(toks[i]); i += 1; return v
    while i < len(toks):
        t = toks[i]
        if re.match(r'[A-Za-z]', t):
            cmd = t; i += 1
            if cmd in 'Zz':
                if cur: subs.append(cur); cur = []
                x, y = sx, sy
                continue
        rel = cmd.islower(); c = cmd.upper()
        if c == 'M':
            nx, ny = num(), num()
            if rel: nx += x; ny += y
            if cur: subs.append(cur)
            cur = [(nx, ny)]; x, y = sx, sy = nx, ny
            cmd = 'l' if rel else 'L'
        elif c == 'L':
            nx, ny = num(), num()
            if rel: nx += x; ny += y
            cur.append((nx, ny)); x, y = nx, ny
        elif c == 'H':
            nx = num(); nx = nx + x if rel else nx
            cur.append((nx, y)); x = nx
        elif c == 'V':
            ny = num(); ny = ny + y if rel else ny
            cur.append((x, ny)); y = ny
        elif c in 'CS':
            if c == 'C':
                x1, y1 = num(), num()
                if rel: x1 += x; y1 += y
            else:
                x1, y1 = (2 * x - lcx, 2 * y - lcy) if lcx is not None else (x, y)
            x2, y2, nx, ny = num(), num(), num(), num()
            if rel: x2 += x; y2 += y; nx += x; ny += y
            for k in range(1, steps + 1):
                s = k / steps; u = 1 - s
                cur.append((u**3*x + 3*u*u*s*x1 + 3*u*s*s*x2 + s**3*nx, u**3*y + 3*u*u*s*y1 + 3*u*s*s*y2 + s**3*ny))
            lcx, lcy = x2, y2; x, y = nx, ny
            continue
        elif c == 'Q':
            x1, y1, nx, ny = num(), num(), num(), num()
            if rel: x1 += x; y1 += y; nx += x; ny += y
            for k in range(1, steps + 1):
                s = k / steps; u = 1 - s
                cur.append((u*u*x + 2*u*s*x1 + s*s*nx, u*u*y + 2*u*s*y1 + s*s*ny))
            x, y = nx, ny
        else:
            raise ValueError('unsupported ' + cmd)
        lcx = lcy = None
    if cur: subs.append(cur)
    return subs

def raster_polys(subs, n=N, g=G):
    """Even-odd fill of subpaths -> bool mask (row = y)."""
    m = np.zeros((n, n), bool)
    for s in subs:
        if len(s) < 3: continue
        im = Image.new('1', (n, n), 0)
        ImageDraw.Draw(im).polygon([(px * g, py * g) for px, py in s], fill=1)
        m ^= np.array(im, bool)
    return m

def raster_path(d):
    return raster_polys(parse_path(d))

# ---------- distance helpers (units) ----------
def edt(mask):
    return ndi.distance_transform_edt(mask) / G

def sdf(mask):
    """Signed distance in units, negative inside."""
    return edt(~mask) - edt(mask)

def disk(r_units):
    r = max(1, int(round(r_units * G)))
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    return xx * xx + yy * yy <= r * r

# ---------- outline out ----------
def trace(mask, tol=0.2):
    """Mask -> SVG path data in units (subpixel contour of a smoothed field)."""
    f = ndi.gaussian_filter(mask.astype(float), 0.7)
    cs = measure.find_contours(np.pad(f, 1), 0.5)
    parts = []
    for c in cs:
        c = measure.approximate_polygon(c, tol)
        if len(c) < 4: continue
        pts = [((p[1] - 1) / G, (p[0] - 1) / G) for p in c]
        parts.append('M' + 'L'.join(f'{a:.3f} {b:.3f}' for a, b in pts) + 'Z')
    return ''.join(parts)

def downsample(mask, px):
    """Area-average to px x px (the icon at px, 24 units across)."""
    if N % px:
        im = Image.fromarray((mask * 255).astype(np.uint8)).resize((px, px), Image.BOX)
        return np.asarray(im, float) / 255
    k = N // px
    return mask.reshape(px, k, px, k).mean(axis=(1, 3))

def png(mask, px, path, ink=(18, 41, 63), paper=(250, 245, 234)):
    a = downsample(mask, px)
    im = np.zeros((px, px, 3))
    for c in range(3):
        im[..., c] = paper[c] * (1 - a) + ink[c] * a
    Image.fromarray(im.astype(np.uint8)).save(path)
