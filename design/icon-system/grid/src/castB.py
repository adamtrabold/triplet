"""Approach B prototype: one casting rule on the filled shape (outside the engine).

Owner (10-26): "And b is good to test"; "Holes should be based on proportional root shapes that also ensure the
not hole area is correct"; "the brand should be built into the root calls".

An icon is ONLY root calls: ink roots (joined where they overlap, cut apart where a gap is drawn) and hole roots
(proportional shapes, subtracted last). No per-icon treatment. Then one rule, the same constants for every icon:

  1. thickness: the local thickness of every point (the widest disc inside the ink that covers it);
  2. inside corners fill in by a radius that grows with the thickness contrast nearby
     (thin meets thick -> a flare; equal parts -> the small base round), never closing a gap;
  3. outside corners round by a radius that grows with the part's thickness (thin parts and tips round less);
  0. holes: the hole roots are cut out FIRST, so the rule reads the real walls and rounds a hole's corners
     like any other inside corner.

The constants were set once by eye on the coupe (the one icon whose flares are its character) and then frozen.
Output: traced outlines (polygons, not final curves) in svg/castB/, plus a JSON summary.

  python3 -I src/castB.py            (from design/icon-system/grid)
"""
import json, os, sys
import numpy as np
from scipy import ndimage as ndi
from skimage import measure, morphology
sys.path.insert(0, os.path.dirname(__file__))
from castlib import G, N, raster_path, edt, trace, png

RULE = dict(
    base_in=0.15,     # every inside corner at least this round (owner: "all points of meeting at minimum a little bit rounded")
    flare=float(os.environ.get('CAST_FLARE', 0.5)),       # extra inside radius per unit of thickness contrast nearby
    max_in=1.0,       # an inside fill never larger than this
    window=1.0,       # how far "nearby" reaches for the contrast (units)
    gap_keep=0.45,    # an inside fill never more than this share of the local gap width (gaps stay open)
    out_share=0.30,   # outside radius = this share of the thickness of the part behind the outline point
    settle=0.50,      # ...and no outside corner loses more than this much ink at its point (ink settles a set amount),
                      # so a sharp tip rounds less than a square corner: r <= settle * sin(a) / (1 - sin(a)), a = half the angle
    out_min=0.075, out_max=0.6,
    gap_read=0.4,     # a space's width is read this far off (the widest disc within it, same space)
    steady=0.35,      # a part is steady where its thickness changes by less than this per unit along it
    junction=0.6,     # thickness is read after a minimum filter this wide, so the fat spot where two parts cross isn't a "thick part"
)
LEVELS = np.round(np.arange(0.075, 1.2001, 0.075), 4)
DEBUG = {}
MIN_SPECK = 0.05   # raster specks smaller than this (unit^2) are noise from the root rasteriser, not ink

def local_thickness(mask, cap=4.0):
    """Widest inscribed disc covering each pixel (units). 0 outside."""
    d = edt(mask)
    T = np.zeros(mask.shape, np.float32)
    tol = 1.0 / G   # a disc covers the boundary pixels it touches
    dm = d.max()
    radii = np.concatenate([np.arange(0.025, 1.0, 0.025), np.arange(1.0, dm + 0.1, 0.1)])
    for r in radii:          # every disc, however big (a big disc must still cover the far edge); values capped
        pts = d >= r   # every centre a disc of radius r fits at: their union is the opening by r
        if not pts.any(): break
        cov = (ndi.distance_transform_edt(~pts) / G <= r + tol) & mask
        T[cov] = min(2 * r, cap)
    return T

def near_ink(field, mask):
    """Extend a field defined on ink pixels to every pixel (value of the nearest ink pixel)."""
    _, (iy, ix) = ndi.distance_transform_edt(~mask, return_indices=True)
    return field[iy, ix]

def signed(mask):
    return edt(~mask) - edt(mask)

def interp_levels(sdfs, rmap):
    """Per pixel, linear blend of the level SDFs at radius rmap (continuous, so radii change without steps)."""
    idx = np.clip(np.searchsorted(LEVELS, rmap) - 1, 0, len(LEVELS) - 2)
    lo, hi = LEVELS[idx], LEVELS[idx + 1]
    w = np.clip((rmap - lo) / (hi - lo), 0, 1)
    S = np.stack(sdfs)
    a = np.take_along_axis(S, idx[None], 0)[0]
    b = np.take_along_axis(S, (idx + 1)[None], 0)[0]
    return a * (1 - w) + b * w

def cast_component(C, H=None):
    R = RULE
    T = local_thickness(C)
    k = max(1, int(R['window'] * G))
    Tin = np.where(C, T, 0)
    j = max(1, int(R['junction'] * G / 2))
    Tj = np.where(C, ndi.minimum_filter(np.where(C, T, 99), size=2 * j + 1), 0)
    tmax = ndi.maximum_filter(np.where(C, np.minimum(Tj, T), 0), size=2 * k + 1)
    # the thin side is a PART (thickness steady along it), not a taper running out to a tip: a tree tier's droop
    # thins to nothing, and must not count as "thin meets thick"
    Ts = ndi.gaussian_filter(np.where(C, T, 0), 0.15 * G)
    gyy, gxx = np.gradient(Ts)
    steady = C & (np.hypot(gyy, gxx) * G < R['steady'])
    tmin = ndi.minimum_filter(np.where(steady, T, 99), size=2 * k + 1)
    contrast = np.where(C, np.clip(tmax - tmin, 0, None), 0)
    rin = np.clip(R['base_in'] + R['flare'] * contrast, R['base_in'], R['max_in'])
    rin = ndi.gaussian_filter(np.where(C, rin, 0), 0.3 * G) / np.maximum(ndi.gaussian_filter(C.astype(float), 0.3 * G), 1e-6)
    rin = near_ink(np.where(C, rin, 0), C)
    # gaps stay open: the local width of the space, capped (open space counts as wide)
    space = ~C
    W = local_thickness(space, cap=4.0)
    # a space is read by its width a little way off, inside the same space (a corner of open space is open space;
    # a slot between two posts is a slot; a hole is its own space)
    lab, n = measure.label(space, connectivity=1, return_num=True)
    kw = max(1, int(R["gap_read"] * G))
    Wr = np.zeros_like(W)
    for i in range(1, n + 1):
        m = lab == i
        Wr[m] = ndi.maximum_filter(np.where(m, W, 0), size=2 * kw + 1)[m]
    W = Wr
    # ...but the base round always applies: a space under 2 x base_in (0.3) is a sliver, not a gap (the family's
    # narrowest gap is the 1px cut), so a sharp wedge where two roots overlap fills to its base round
    rin = np.maximum(R['base_in'], np.minimum(rin, R['gap_keep'] * W))
    # a hole root keeps its shape: inside it, only the base round (owner: holes are proportional root shapes)
    if H is not None:
        rin = np.where(H, R['base_in'], rin)
    rin = np.clip(rin, LEVELS[0], LEVELS[-1])
    # 2. inside fills: closing at each level, blended per pixel
    dout = edt(~C)
    clos = []
    for r in LEVELS:
        dil = dout <= r
        clos.append(signed(edt(dil) > r))
    filled = C | (interp_levels(clos, rin) < 0)
    DEBUG.update(C=C, filled=filled, rin=rin)
    # 3. outside rounds: opening at each level, blended per pixel by the thickness there
    # 3. outside rounds: an opening whose radius varies along the outline (outline_radius), blended between
    #    levels so the radius changes without steps
    T2 = local_thickness(filled)
    rout = outline_radius(filled, T2, R)
    rout = np.clip(rout, R['out_min'], R['out_max'])
    rout = near_ink(np.where(filled, rout, 0), filled)
    rout = ndi.gaussian_filter(rout, 0.1 * G)   # no jumps between neighbouring outline points
    rout = np.clip(rout, LEVELS[0], LEVELS[-1])
    din = edt(filled)
    opens = []
    for r in LEVELS:
        ero = din > r
        opens.append(signed(edt(~ero) <= r))
    res = interp_levels(opens, rout) < 0
    DEBUG.update(rout=rout, filled2=filled)
    lab, n = measure.label(res, connectivity=1, return_num=True)
    if n > 1:   # a tip's last raster pixels can survive as a speck past the round: keep only real pieces
        sizes = ndi.sum(res, lab, range(1, n + 1))
        res = np.isin(lab, [i + 1 for i, z in enumerate(sizes) if z >= 0.25 * G * G])
    return res

def outline_radius(mask, T, R, step=0.05, w=0.5, reach=1.2, probe=1.0):
    """Per pixel, the outside radius, read from the nearest outline point: the smaller of
    (a) out_share x the thickness of the part behind that point (the most a ray straight in finds, up to `probe`
        units, so a corner reads its whole part and a thin tine reads only itself), and
    (b) the settle limit for the corner's angle (the outline's turn over +-w units)."""
    settle = R['settle']
    from scipy.spatial import cKDTree
    f = ndi.gaussian_filter(mask.astype(float), 0.7)
    lim = np.full(mask.shape, 9.0, np.float32)
    P, V = [], []
    for c in measure.find_contours(np.pad(f, 1), 0.5):
        c = c - 1
        seg = np.hypot(*np.diff(c, axis=0).T); L = np.concatenate([[0], np.cumsum(seg)])
        if L[-1] < 4 * w * G: continue
        t = np.arange(0, L[-1], step * G)
        q = np.stack([np.interp(t, L, c[:, 0]), np.interp(t, L, c[:, 1])], 1)
        k = int(round(w / step)); n = len(q)
        a = q[(np.arange(n) - k) % n]; b = q[(np.arange(n) + k) % n]
        v1 = q - a; v2 = b - q
        turn = np.abs(np.arctan2(v1[:, 0] * v2[:, 1] - v1[:, 1] * v2[:, 0], (v1 * v2).sum(1)))
        half = np.clip((np.pi - turn) / 2, 0.05, np.pi / 2 - 1e-3)
        sa = np.sin(half)
        r = settle * sa / np.maximum(1 - sa, 1e-3)
        # a point takes the tightest limit within `reach` along the outline, so a long taper behind a tip
        # (a tree tier's droop) is held to the tip's small round and can't be cut off
        kr = int(round(reach / step))
        r = ndi.minimum_filter1d(r, 2 * kr + 1, mode='wrap')
        # the part behind each point: march inward along the normal (the gradient of the smoothed shape)
        gy, gx = np.gradient(f)
        qi = np.clip(np.round(q).astype(int), 0, np.array(mask.shape) - 1)
        nv = np.stack([gy[qi[:, 0], qi[:, 1]], gx[qi[:, 0], qi[:, 1]]], 1)
        nv /= np.maximum(np.hypot(nv[:, 0], nv[:, 1]), 1e-9)[:, None]
        tpart = np.zeros(n)
        alive = np.ones(n, bool)
        for dd in np.arange(0.05, probe + 1e-9, 0.05):
            pp = np.round(q + nv * dd * G).astype(int)
            pp = np.clip(pp, 0, np.array(mask.shape) - 1)
            inside = mask[pp[:, 0], pp[:, 1]]
            alive &= inside | (dd < 0.1)
            tpart = np.where(alive & inside, np.maximum(tpart, T[pp[:, 0], pp[:, 1]]), tpart)
        r = np.minimum(r, R['out_share'] * tpart)
        P.append(q); V.append(r)
    if not P: return lim
    P = np.concatenate(P); V = np.concatenate(V)
    ys, xs = np.nonzero(mask)
    _, idx = cKDTree(P).query(np.stack([ys, xs], 1))
    lim[ys, xs] = V[idx]
    return lim

def crop_box(mask, pad):
    ys, xs = np.where(mask)
    return max(0, ys.min() - pad), min(N, ys.max() + pad + 1), max(0, xs.min() - pad), min(N, xs.max() + pad + 1)

def cast(ink_paths, hole_paths=()):
    J = np.zeros((N, N), bool)
    for d in ink_paths: J |= raster_path(d)
    # holes are roots too: cut them out first, so the rule reads the real walls (and rounds the hole's corners itself)
    Hm = np.zeros_like(J)
    for d in hole_paths: Hm |= raster_path(d)
    J &= ~Hm
    lab, n = measure.label(J, connectivity=1, return_num=True)
    out = np.zeros_like(J)
    pad = int(2.5 * G)
    for i in range(1, n + 1):
        C = lab == i
        if C.sum() < MIN_SPECK * G * G: continue
        y0, y1, x0, x1 = crop_box(C, pad)
        out[y0:y1, x0:x1] |= cast_component(C[y0:y1, x0:x1], Hm[y0:y1, x0:x1])
    return out, J

# ---------- the icons, as root calls only ----------
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def load(p): return json.load(open(os.path.join(HERE, p)))

def rect(x0, y0, x1, y1): return f'M{x0},{y0}H{x1}V{y1}H{x0}Z'
def half_ellipse_down(cx, cy, rx, ry, n=48):
    import math
    pts = [(cx + rx * math.cos(math.pi * k / n), cy + ry * math.sin(math.pi * k / n)) for k in range(n + 1)]
    return 'M' + 'L'.join(f'{x:.4f},{y:.4f}' for x, y in pts) + 'Z'

def fit_to(ink, holes, appr):
    """Scale and move root paths so their box matches the approved outline's box (the star's and +'s parts are
    stored before their final scale). Uniform scale, from the larger side."""
    from castlib import parse_path
    def box(ds):
        pts = [p for d in ds for s in parse_path(d) for p in s]
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        return min(xs), min(ys), max(xs), max(ys)
    a = box(ink); b = box([appr])
    sc = max(b[2] - b[0], b[3] - b[1]) / max(a[2] - a[0], a[3] - a[1])
    cxa, cya = (a[0] + a[2]) / 2, (a[1] + a[3]) / 2; cxb, cyb = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
    def tf(d):
        out = []
        for s in parse_path(d):
            out.append('M' + 'L'.join(f'{(x - cxa) * sc + cxb:.4f},{(y - cya) * sc + cyb:.4f}' for x, y in s) + 'Z')
        return ''.join(out)
    return [tf(d) for d in ink], [tf(d) for d in holes]

def shift(ds, dy):
    from castlib import parse_path
    return [''.join('M' + 'L'.join(f'{x:.4f},{y + dy:.4f}' for x, y in sp) + 'Z' for sp in parse_path(d)) for d in ds]

def six_roots():
    c = load('svg/g7/construction.json')
    out = {}
    for k, v in c.items():
        ink = [q for p, q in zip(v['prims'], v['parts']) if not p['cut']]
        holes = [q for p, q in zip(v['prims'], v['parts']) if p['cut']]
        note = ''
        if k == 'museum':
            # root calls only: the beam and plinth as plain slabs (the capital's drop is hand code in the approved part);
            # posts run from the beam's underside to the plinth's top.
            ink = [ink[0], rect(7.11056, 10.976, 16.88856, 11.976), rect(7.11056, 15.81, 16.88856, 16.81)]
            for x in (7.52767, 10.09256, 12.65744, 15.22233):
                ink.append(rect(x, 11.9, x + 1.25, 15.88))
            note = 'beam and plinth as plain slabs (the capital drop removed: it was drawn into the part)'
        appr = v.get('d') or v.get('raw')
        if k in ('star', 'plus'):
            # the line marks' parts are stored before their optical shift dy (d = d0 moved down by dy)
            ink, holes = shift(ink, v.get('dy', 0)), shift(holes, v.get('dy', 0))
        out[k] = dict(ink=ink, holes=holes, approved=appr, note=note)
    return out

def new_roots():
    b2 = load('svg/blind2/construction.json')['bag']
    bag_ink = [q for p, q in zip(b2['prims'], b2['parts']) if not p.get('cut')]
    bag_holes = [q for p, q in zip(b2['prims'], b2['parts']) if p.get('cut')]
    bed = load('svg/blind/blind.json')['bed2']
    bed_ink = bed['parts']
    # Restaurant: today's subject (a fork), as root calls on the scale. Head width W = 5.5 (TALL, the tree's height).
    # tines: 3 posts, each 2/11 W (1.0), gaps the post's 1.25; head: the lower half of an ellipse, ry 4/5 rx;
    # handle: a post 3/11 W (1.5), free end square.
    W = 5.5; x0 = 12 - W / 2; tine = 1.0; gap = (W - 3 * tine) / 2
    fork = [rect(x0 + i * (tine + gap), 5.0, x0 + i * (tine + gap) + tine, 10.2) for i in range(3)]
    fork.append(half_ellipse_down(12, 10.0, W / 2, 0.8 * W / 2))
    fork.append(rect(12 - 0.75, 11.6, 12 + 0.75, 17.73))
    return {
        'restaurant': dict(ink=fork, holes=[], approved=None, note='new: a fork from root calls (tines, a cap head, a handle)'),
        'bag': dict(ink=bag_ink, holes=bag_holes, approved=b2['d'], note='round 2\'s roots, unchanged'),
        'bed': dict(ink=bed_ink, holes=[], approved=bed['d'], note='bed2\'s roots, unchanged'),
    }

if __name__ == '__main__':
    outdir = os.path.join(HERE, 'svg/castB'); os.makedirs(outdir, exist_ok=True)
    only = sys.argv[1:]
    summary = {'rule': RULE}
    for group in (six_roots(), new_roots()):
        for k, v in group.items():
            if only and k not in only: continue
            m, J = cast(v['ink'], v['holes'])
            np.save(os.path.join(outdir, f'{k}.npy'), np.packbits(m))
            d = trace(m)
            open(os.path.join(outdir, f'{k}.svg'), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="{d}"/></svg>')
            for px in (24, 72): png(m, px, os.path.join(outdir, f'{k}-{px}.png'))
            summary[k] = dict(note=v['note'], ink_px2=round(float(m.sum()) / G / G, 2), roots=len(v['ink']), holes=len(v['holes']))
            print(k, summary[k], flush=True)
    p = os.path.join(outdir, 'summary.json')
    old = json.load(open(p)) if os.path.exists(p) else {}
    old.update(summary); json.dump(old, open(p, 'w'), indent=1)
