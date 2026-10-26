"""The A+B mix prototype: roots that carry the brand (outside the engine; engine.js, picks7.js and the six untouched).

SUPERSEDED (turn 170) by src/mix-curves.js: the same root calls in clean curves through the engine's round solver. This raster
version (canvas v249) is kept for the record; its "fifth of the thickness difference" inside rule and the 4/3 loop are retired.

Director (jam turn 167): "the mix is the path": notches and holes are roots, cut out after the rule runs, never filled; the
capital is a root of its own, placed whenever a post holds a slab; each root states its own thickness.
Owner (10-26): "Holes should be based on proportional root shapes that also ensure the not hole area is correct"; "the brand
should be built into the root calls".

An icon is ONLY root calls (ROOTS below). Each ink root states its kind and so its thickness (t, in units = px at 24); a few
kinds carry one family behaviour of their own (a post flares into what it holds; a tier's and a star's tips go soft by a share
of their edge). Cut roots (holes, notches, the capital's cove) are proportional shapes, cut after the rule, never filled.
The rule (one set of numbers, every icon):
  1. inside corners where roots meet close by r = BASE + (t_thick - t_thin) / 5 (declared thicknesses, not measured), at
     least POST_FLARE where a post meets another root; never more than 0.45 of the gap there; only BASE inside a closed counter;
  2. the cut roots come out, each with its own corners rounded (BASE, or a tip round);
  3. outside corners open by r = t / 5 of the root behind them, never losing more than SETTLE of ink at a corner's point;
  4. declared tips open by their own round, min(TIP, TIP_SHARE x the shorter edge) (the engine's tip law, the same numbers).

  python3 -I src/mix.py [names...]        (from design/icon-system/grid)   -> svg/mix/<name>.svg, .npy, summary.json
"""
import json, math, os, sys
import numpy as np
from scipy import ndimage as ndi
from skimage import measure
sys.path.insert(0, os.path.dirname(__file__))
from castlib import G, N, raster_path, raster_polys, parse_path, edt, trace, png

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINE = 1.5
# ---- THICKNESS BY KIND (units; the root states it, the rule reads it)
T = dict(
    mass=2 * LINE,      # a block that IS the thing (cup body, bowl, tier, mattress, bag body): PROP.block.massMin, 2 lines
    slab=LINE,          # a block that carries or caps (beam, plinth, saucer, foot, roof): 1 line
    post=5 / 6 * LINE,  # a post that holds something up (stem, column, trunk, leg, headboard): PROP.line.post
    loop=4 / 3,         # a band round a counter (the cup's ear, a bag's handle): the horizontal line
)
RULE = dict(base=0.15, k_in=1 / 5, post_flare=0.5, max_in=1.0, window=0.8, gap_keep=0.45, gap_read=1.0,
            k_out=1 / 5, settle=0.5, out_min=0.075, out_max=0.6, tip=0.35, tip_share=0.0877, trim=1.4, ease=float(os.environ.get('MIX_EASE', 1.6)), reach=0.9, handle=0.55)
LEVELS = np.round(np.arange(0.075, 1.2001, 0.075), 4)

# ---------- root calls ----------
def rect(x0, y0, x1, y1): return f'M{x0},{y0}H{x1}V{y1}H{x0}Z'
def poly(pts): return 'M' + 'L'.join(f'{x:.4f},{y:.4f}' for x, y in pts) + 'Z'
def ink(kind, d, t=None, tips=(), flare=None):
    return dict(kind=kind, d=d, t=T[kind] if t is None else t, tips=list(tips), flare=flare)
def hole(d, tips=(), tip_r=None):
    return dict(d=d, tips=list(tips), tip_r=tip_r)

def capital(post_x0, post_x1, slab_end, under, step, side, down=True):
    """CAPITAL (turn 167: "the capital is its own root ... whenever a post holds a slab"): where an outer post holds a slab that
    runs past it, a block from the post's outer face to the slab's end, a step either side of the slab's face, less a cove: a
    quarter ellipse centred on the slab's end a step past its face, rx = the overhang, ry = two steps. The slab's end drops a step
    and the post's face runs into the cove tangent: one curve, by construction. Returns (ink block, cut cove)."""
    face = post_x1 if side > 0 else post_x0
    xa, xb = sorted((face, slab_end))
    sg = 1 if down else -1
    ya, yb = sorted((under - sg * step, under + sg * step))
    blk = ink('slab', rect(xa, ya, xb, yb))
    cx, cy, rx, ry = slab_end, under + sg * step, abs(slab_end - face), 2 * step
    pts = [(cx + rx * math.cos(a) * -side, cy - sg * ry * math.sin(a)) for a in np.linspace(0, math.pi / 2, 40)]
    o = (cx + side * 0.05, cy + sg * 0.05)   # the centre a hair outside the block, so the cut leaves no sliver
    cove = dict(d=poly([o] + pts), tip_r=0)   # its corners are the block's: no round of its own
    return blk, cove

def notch(tip, centre, depth):
    """NOTCH (owner: "holes ... proportional root shapes"): a stacked tier's notch is the triangle from its tip to the centre of
    its underside to the point `depth` under the tip; whatever of it is space stays space (cut after the rule, never filled)."""
    return dict(d=poly([tip, centre, (tip[0], tip[1] + depth)]), notch=True, tips=[], tip_r=None)

# ---------- the rule ----------
def signed(mask): return edt(~mask) - edt(mask)

def interp_levels(sdfs, rmap):
    idx = np.clip(np.searchsorted(LEVELS, rmap) - 1, 0, len(LEVELS) - 2)
    lo, hi = LEVELS[idx], LEVELS[idx + 1]
    w = np.clip((rmap - lo) / (hi - lo), 0, 1)
    S = np.stack(sdfs)
    a = np.take_along_axis(S, idx[None], 0)[0]; b = np.take_along_axis(S, (idx + 1)[None], 0)[0]
    return a * (1 - w) + b * w

def opening(mask, r):
    if r <= 0: return mask
    return edt(~(edt(mask) > r)) <= r

def tip_points(d, inside=None):
    """The sharp corners of a root path (turn under 75 degrees inside): candidate tips."""
    out = []
    for s in parse_path(d, steps=24):
        s = [p for i, p in enumerate(s) if i == 0 or math.dist(p, s[i - 1]) > 1e-6]
        if math.dist(s[0], s[-1]) < 1e-6: s = s[:-1]
        n = len(s)
        for i in range(n):
            a, p, b = s[i - 1], s[i], s[(i + 1) % n]
            v1, v2 = (a[0] - p[0], a[1] - p[1]), (b[0] - p[0], b[1] - p[1])
            ang = math.degrees(math.acos(max(-1, min(1, (v1[0] * v2[0] + v1[1] * v2[1]) / (math.hypot(*v1) * math.hypot(*v2))))))
            if ang < 75:
                # edge lengths: walk each way while the outline keeps within 25 degrees of its first heading (a curved edge counts whole)
                def walk(dirn):
                    L, j, h0 = 0, i, None
                    while True:
                        q0, q1 = s[j % n], s[(j + dirn) % n]
                        h = math.atan2(q1[1] - q0[1], q1[0] - q0[0])
                        if h0 is None: h0 = h
                        if abs((h - h0 + math.pi) % (2 * math.pi) - math.pi) > math.radians(35) or L > 12: return L
                        if inside is not None and inside(q1): return L + math.dist(q0, q1) * 0.5   # the edge ends where another root covers it
                        L += math.dist(q0, q1); j += dirn
                out.append((p, ang, min(walk(1), walk(-1)), s, i))
    return out

def node_flags(d, steps=24):
    """Which points of parse_path(d, steps) are the path's own nodes (ends of its commands)."""
    from castlib import _tok
    import re as _re
    flags, cmd, toks, i = [], None, _tok.findall(d), 0
    need = dict(M=2, L=2, H=1, V=1, C=6, S=4, Q=4)
    while i < len(toks):
        t = toks[i]
        if _re.match(r'[A-Za-z]', t):
            cmd = t; i += 1
            if cmd in 'Zz': continue
        c = cmd.upper(); i += need[c]
        if c == 'M': flags.append(True); cmd = 'l' if cmd.islower() else 'L'
        elif c in 'LHV': flags.append(True)
        else: flags += [False] * (steps - 1) + [True]
    return flags

def land_tips(d, others, scale=1):
    R = RULE
    s = parse_path(d, steps=24)[0]; fl = node_flags(d)[:len(s)]
    if math.dist(s[0], s[-1]) < 1e-6: s, fl = s[:-1], fl[:-1]
    s = [list(p) for p in s]; n = len(s)
    inside = lambda q: others[min(N - 1, max(0, int(q[1] * G))), min(N - 1, max(0, int(q[0] * G)))]
    tips = [t for t in tip_points(poly(s), inside) if fl[t[4]] and not inside(t[0])]
    for (p0, ang, edge, _, i) in tips:
        P = tuple(s[i])
        tr = min(R['tip'] * scale, R['tip_share'] * edge)
        dd = min(R['ease'] * R['trim'] * tr / math.tan(math.radians(ang) / 2), R['reach'] * edge)
        cut = eased_tip([tuple(q) for q in s], i, dd, R['handle'])
        # the eased round's point: its curve's middle (the cubic at t = 1/2 is the last 24-th point list's middle)
        Tm = cut[-12]
        u = (P[0] - Tm[0], P[1] - Tm[1]); L = math.hypot(*u) or 1
        back = tr / math.sin(math.radians(ang) / 2) - tr
        Q = (Tm[0] + u[0] / L * back, Tm[1] + u[1] / L * back)
        for dirn in (1, -1):   # re-aim each edge about its other node
            j = i
            while True:
                j = (j + dirn) % n
                if fl[j] or j == i: break
            O = tuple(s[j]); pv = complex(P[0] - O[0], P[1] - O[1]); qv = complex(Q[0] - O[0], Q[1] - O[1])
            if abs(pv) < 1e-9: continue
            q = qv / pv
            k = i
            while k != j:
                z = complex(s[k][0] - O[0], s[k][1] - O[1]) * q
                if k != i: s[k] = [O[0] + z.real, O[1] + z.imag]
                k = (k + dirn) % n
        s[i] = [Q[0], Q[1]]
    return poly([tuple(p) for p in s])

def eased_tip(s, i, dd, h):
    """The ink an eased round takes off a tip: from the point dd back along each edge (arc length on the root's outline), the
    region between the outline and one cubic whose handles run h of the way from each end toward the point."""
    n = len(s)
    def along(dirn):
        L, j, path = 0.0, i, [s[i]]
        while True:
            q0, q1 = s[j % n], s[(j + dirn) % n]; seg = math.dist(q0, q1)
            if L + seg >= dd:
                t = (dd - L) / seg; e = (q0[0] + (q1[0] - q0[0]) * t, q0[1] + (q1[1] - q0[1]) * t)
                path.append(e); return path, e
            L += seg; j += dirn; path.append(q1)
    pa, A = along(1); pb, B = along(-1)
    P = s[i]
    ca = (A[0] + (P[0] - A[0]) * h, A[1] + (P[1] - A[1]) * h); cb = (B[0] + (P[0] - B[0]) * h, B[1] + (P[1] - B[1]) * h)
    curve = []
    for k in range(1, 24):
        t = k / 24; u = 1 - t
        curve.append((u**3 * A[0] + 3*u*u*t * ca[0] + 3*u*t*t * cb[0] + t**3 * B[0], u**3 * A[1] + 3*u*u*t * ca[1] + 3*u*t*t * cb[1] + t**3 * B[1]))
    return list(reversed(pa)) + pb[1:] + list(reversed(curve))

def cast(roots, holes=(), cuts=(), debug=None):
    R = RULE
    masks = [raster_path(r['d']) for r in roots]
    # 0. tips land: a root with tips is re-drawn so each tip ends where its eased round's point was, its edges re-aimed (the
    #    engine's tip landing, as a property of the root's own outline)
    for i, r in enumerate(roots):
        if not r.get('land'): continue
        others = np.zeros((N, N), bool)
        for j, m in enumerate(masks):
            if j != i: others |= m
        r['d'] = land_tips(r['d'], others, r.get('tip_scale', 1))
        masks[i] = raster_path(r['d'])
    J = np.zeros((N, N), bool)
    for m in masks: J |= m
    Hm = np.zeros_like(J)
    for h in holes: Hm |= raster_path(h['d'])
    J &= ~Hm
    space = ~J
    # declared thickness field (ink) and the thinnest / thickest root near each space pixel
    tf = np.zeros((N, N), np.float32)
    for r, m in zip(roots, masks): tf = np.maximum(tf, np.where(m, r['t'], 0))
    near = [edt(~m) <= R['window'] for m in masks]
    tmax = np.zeros((N, N), np.float32); tmin = np.full((N, N), 99, np.float32); cnt = np.zeros((N, N), np.int16)
    postnear = np.zeros((N, N), bool); othernear = np.zeros((N, N), bool)
    # a root's "different neighbour": two roots count as meeting only if they are different roots
    for r, nm in zip(roots, near):
        tmax = np.where(nm, np.maximum(tmax, r['t']), tmax); tmin = np.where(nm, np.minimum(tmin, r['t']), tmin); cnt += nm
    for i, (r, nm) in enumerate(zip(roots, near)):
        if r['kind'] == 'post':
            other = np.zeros_like(nm)
            for j, nm2 in enumerate(near):
                if j != i and roots[j]['kind'] != 'post': other |= nm2
            postnear |= nm & other
    contrast = np.where(cnt >= 2, tmax - tmin, 0)
    rin = R['base'] + R['k_in'] * contrast
    rin = np.where(postnear, np.maximum(rin, R['post_flare']), rin)
    rin = np.clip(rin, R['base'], R['max_in'])
    # gaps stay open: the width of the space, read a little way off inside the same space
    lab, n = measure.label(space, connectivity=1, return_num=True)
    W = 2 * edt(space)
    kw = max(1, int(R['gap_read'] * G))
    Wr = np.zeros_like(W)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    closed = np.zeros_like(J)
    for i in range(1, n + 1):
        m = lab == i
        Wr[m] = ndi.maximum_filter(np.where(m, W, 0), size=2 * kw + 1)[m]
        if i not in border: closed |= m
    rin = np.maximum(R['base'], np.minimum(rin, R['gap_keep'] * Wr))
    rin = np.where(closed | Hm, R['base'], rin)        # a closed counter or a hole root: only the base round
    rin = ndi.gaussian_filter(rin, 0.15 * G)
    rin = np.clip(rin, LEVELS[0], LEVELS[-1])
    dout = edt(~J)
    clos = [signed(edt(dout <= r) > r) for r in LEVELS]
    filled = J | (interp_levels(clos, rin) < 0)
    # 2. cut roots come out after the rule: notches (only what was space), the capital's coves; each with its own round
    for c in cuts:
        cm = raster_path(c['d'])
        if c.get('notch'): cm &= space
        cm = opening(cm, R['base']) if c.get('tip_r') is None else cm
        filled &= ~cm
    for h in holes:   # a hole root keeps its shape: re-cut it rounded by its own round (BASE, or its tips' round)
        hm = raster_path(h['d'])
        r = h['tip_r'] if h.get('tip_r') is not None else R['base']
        filled &= ~opening(hm, r)
    # 3. outside rounds: t / 5 of the root behind, held to the settle limit by the corner's angle
    tf2 = ndi.grey_dilation(tf, size=3)
    tf2 = np.where(filled, np.maximum(tf2, ndi.grey_dilation(tf2, footprint=np.ones((int(0.4 * G),) * 2))), 0)
    rout = outline_radius(filled, tf2)
    rout = np.clip(rout, R['out_min'], R['out_max'])
    _, (iy, ix) = ndi.distance_transform_edt(~filled, return_indices=True)
    rout = np.where(filled, rout, 0)[iy, ix]
    rout = ndi.gaussian_filter(rout, 0.1 * G)
    din = edt(filled)
    opens = [signed(edt(~(din > r)) <= r) for r in LEVELS]
    res = interp_levels(opens, np.clip(rout, LEVELS[0], LEVELS[-1])) < 0
    # 4. declared tips: each opens by its own round, within reach of its point
    yy, xx = np.mgrid[0:N, 0:N]
    for i, r in enumerate(roots):
        if not r['tips']: continue
        others = np.zeros_like(J)
        for j, m in enumerate(masks):
            if j != i: others |= m
        inside = lambda q: others[min(N - 1, max(0, int(q[1] * G))), min(N - 1, max(0, int(q[0] * G)))]
        for (p, ang, edge, poly_, ti) in tip_points(r['d'], inside):
            if others[int(p[1] * G), int(p[0] * G)]: continue      # a tip buried in another root is no tip
            # the short round the landed tip ends on: the tip law, min(TIP, TIP_SHARE x the shorter visible edge)
            tr = min(R['tip'] * r.get('tip_scale', 1), R['tip_share'] * edge)
            reach = tr / math.sin(math.radians(ang) / 2) + 3 * tr + 0.4
            disc = (xx - p[0] * G) ** 2 + (yy - p[1] * G) ** 2 <= (reach * G) ** 2
            res = np.where(disc, res & opening(res, tr), res)
    lab, n = measure.label(res, connectivity=1, return_num=True)
    if n > 1:
        sizes = ndi.sum(res, lab, range(1, n + 1))
        res = np.isin(lab, [i + 1 for i, z in enumerate(sizes) if z >= 0.25 * G * G])
    if debug is not None: debug.update(J=J, filled=filled, rin=rin, rout=rout)
    return res, J

def outline_radius(mask, tf, step=0.05, w=0.5, reach=1.2):
    """Per pixel: the smaller of t/5 (t declared, of the root behind the nearest outline point) and the settle limit."""
    from scipy.spatial import cKDTree
    R = RULE
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
        r = R['settle'] * sa / np.maximum(1 - sa, 1e-3)
        r = ndi.minimum_filter1d(r, 2 * int(round(reach / step)) + 1, mode='wrap')
        qi = np.clip(np.round(q).astype(int), 0, np.array(mask.shape) - 1)
        tt = tf[qi[:, 0], qi[:, 1]]
        r = np.minimum(r, R['k_out'] * np.where(tt > 0, tt, T['post']))
        P.append(q); V.append(r)
    if not P: return lim
    P = np.concatenate(P); V = np.concatenate(V)
    ys, xs = np.nonzero(mask)
    _, idx = cKDTree(P).query(np.stack([ys, xs], 1))
    lim[ys, xs] = V[idx]
    return lim

# ---------- the icons, as root calls ----------
def load(p): return json.load(open(os.path.join(HERE, p)))
def shift(d, dy): return ''.join('M' + 'L'.join(f'{x:.4f},{y + dy:.4f}' for x, y in sp) + 'Z' for sp in parse_path(d))

def with_tips(r, scale=1, land=False):
    r['tips'] = tip_points(r['d']); r['tip_scale'] = scale; r['land'] = land; return r

def six():
    c = load('svg/g7/construction.json')
    out = {}
    # CAFÉ: a VESSEL (mass), a LOOP ear, a CAP saucer (a slab cut by one ellipse), the ear's counter a hole root
    p = c['cafe']['parts']
    out['cafe'] = dict(roots=[ink('mass', p[0]), ink('loop', p[1]), ink('slab', p[2])], holes=[hole(p[3])], cuts=[], approved=c['cafe']['d'])
    # COUPE: a VESSEL bowl (mass), a POST stem, a CAP foot (slab), the band a hole root
    p = c['bar']['parts']
    out['bar'] = dict(roots=[ink('mass', p[0]), ink('post', p[1]), ink('slab', p[2])], holes=[hole(p[3])], cuts=[], approved=c['bar']['d'])
    # MUSEUM: a GABLE roof resting on the beam (cut free), a SLAB beam and plinth, four POSTS; the CAPITAL call at each outer post
    beam = (7.11056, 16.88856); bt, bu = 10.976, 12.476; pt, pb = 15.31, 16.81
    xs = (7.52767, 10.09256, 12.65744, 15.22233); pw = 1.25; step = 0.5
    roots = [ink('slab', 'M7.111,9.97633v-1.2l4.889,-1.62933l4.889,1.62933v1.2z'),
             ink('slab', rect(beam[0], bt, beam[1], bu)), ink('slab', rect(beam[0], pt, beam[1], pb))]
    roots += [ink('post', rect(x, bu - 0.01, x + pw, pt + 0.01)) for x in xs]
    cuts = []
    for (x0, x1, end, side) in ((xs[0], xs[0] + pw, beam[0], -1), (xs[3], xs[3] + pw, beam[1], 1)):
        for under, down in ((bu, True), (pt, False)):
            blk, cove = capital(x0, x1, end, under, step, side, down)
            roots.append(blk); cuts.append(cove)
    out['museum'] = dict(roots=roots, holes=[], cuts=cuts, approved=c['museum']['d'])
    # TREE: three TIERS (masses that end in tips: the gable with droop and sweep), a POST trunk; a NOTCH under each upper tier
    p = c['nature']['parts']
    tiers = [with_tips(ink('mass', d), land=True) for d in p[:3]]
    cuts = []
    for d in p[:2]:
        pts = parse_path(d)[0]
        apex = pts[0]; xr = max(pts, key=lambda q: q[0]); xl = min(pts, key=lambda q: q[0])
        under = [q for q in pts if abs(q[0] - apex[0]) < 0.05 and q[1] > apex[1] + 1][0]
        for tip in (xr, xl): cuts.append(notch(tip, under, 2.5))
    out['nature'] = dict(roots=tiers + [ink('post', p[3])], holes=[], cuts=cuts, approved=c['nature']['d'])
    # STAR: an OUTLINE line mark: the star root less the star root made smaller (a hole); tips soft by edge (line marks at 24/20)
    v = c['star']; dy = v['dy']
    st = with_tips(ink('slab', shift(v['parts'][0], dy), t=v['lw']), scale=24 / 20)
    hd = shift(v['parts'][1], dy)
    hp = tip_points(hd)
    out['star'] = dict(roots=[st], holes=[hole(hd, tip_r=min(RULE['tip'] * 1.2, RULE['tip_share'] * min(t_[2] for t_ in hp)))], cuts=[], approved=v['d'])
    # PLUS: two lines (open mark)
    v = c['plus']
    out['plus'] = dict(roots=[ink('slab', d, t=v['lw']) for d in v['parts']], holes=[], cuts=[], approved=v['d'])
    return out

def half_ellipse_down(cx, cy, rx, ry, n=48):
    return poly([(cx + rx * math.cos(math.pi * k / n), cy + ry * math.sin(math.pi * k / n)) for k in range(n + 1)])
def ellipse_arc_poly(cx, cy, rx, ry, a0, a1, n=48):
    return [(cx + rx * math.cos(a), cy + ry * math.sin(a)) for a in np.linspace(a0, a1, n)]

def new():
    out = {}
    # RESTAURANT: fork and knife, side by side (the t4 pick). Roots: the fork's three tine POSTS into a CAP head (the vessel's
    # half ellipse, 4/5), its handle a POST; the knife a MASS blade (a slab cut by one ellipse on its spine side, the cap rule
    # turned upright) on a POST handle. Fork head width W = 4.5; tines 1, gaps by the cut (1px) ... set from the line.
    out['restaurant'] = restaurant()
    out['bag'] = bag()
    out['bed'] = bed()
    return out

def restaurant():
    """RESTAURANT: a fork and a knife side by side (the t4 pick), fitted to the TALL class (8 1/2 x 11 at 24).
    Root calls only:
      fork  three tines, POSTS (5/6 line), the spaces between them the band (1/2 line); a head, the VESSEL's half ellipse
            (4/5 as tall as wide, the coupe's and the cup's) as wide as the tines; a handle, a POST, from the head down;
      knife a blade, a MASS: straight spine, its edge one ellipse arc (the cap rule stood upright), 1 1/2 lines wide;
            a handle, a POST under the spine side, so the blade's shoulder is a post holding a mass;
      the two rest a cut (2/3 line) apart. The rule gives every join; nothing is drawn per join."""
    post, band, cut = T['post'], LINE / 2, 2 / 3 * LINE
    top, bot = 6.5, 17.5
    fw = 3 * post + 2 * band; kw = LINE * 1.5
    x0 = 12 - (fw + cut + kw) / 2
    fcx = x0 + fw / 2
    roots = []
    hc = top + 3.3                                   # the head's ellipse centre: the tines show 3.3 above it
    for i in range(3):
        x = x0 + i * (post + band); roots.append(ink('post', rect(x, top, x + post, hc + 0.2)))
    roots.append(ink('mass', half_ellipse_down(fcx, hc, fw / 2, 0.8 * fw / 2)))
    roots.append(ink('post', rect(fcx - post / 2, hc + 0.8 * fw / 2 - 0.4, fcx + post / 2, bot)))
    ks = x0 + fw + cut                               # the knife's spine
    ke = top + 6.0                                   # the blade's foot
    blade = [(ks, top)] + ellipse_arc_poly(ks, ke, kw, ke - top, -math.pi / 2, 0)[1:] + [(ks + kw, ke), (ks, ke)]
    roots.append(ink('mass', poly(blade)))
    roots.append(ink('post', rect(ks, ke - 0.2, ks + post, bot)))
    return dict(roots=roots, holes=[], cuts=[], approved=None, note='fork and knife from root calls')

def bag():
    """SHOPPING: the bag, new root calls (director: "a tapered body, a wider handle, a band hole"; the round-2 bag, a square
    block under a centred ring, is a padlock's outline). Fitted to the SQUARE class.
      body   a MASS, a trapezoid WIDER AT THE TOP (a tote opens upward; wider at the foot it read as a kettlebell), 4/5 as tall
             as its top is wide, its foot 5/6 of its top;
      handle a LOOP (4/3), the top half of a circle 2/3 of the body's top wide, its feet running straight into the body, no
             legs (a shackle is a tall U on legs, about half its block's width); its counter clears 2 lines (3px);
      rim    a HOLE root, the coupe's band (1/2 line), across the body one line under its top and one line in from each side:
             the folded rim, which lightens the block as the coupe's band does."""
    w0 = 8.4; w1 = w0 * 5 / 6; h = 0.8 * w0
    rxo = 4 / 5 * w0 / 2; ryo = 2 / 3 * rxo; lw = 4 / 3
    top = 12 - (h + ryo + LINE / 2) / 2 + ryo + LINE / 2; bot = top + h
    x0t, x1t, x0b, x1b = 12 - w0 / 2, 12 + w0 / 2, 12 - w1 / 2, 12 + w1 / 2
    body = ink('mass', poly([(x0t, top), (x1t, top), (x1b, bot), (x0b, bot)]))
    cy = top - LINE / 2   # the counter runs straight half a line (PROP.line.slot, the cup ear's rule) before it turns
    outer = ellipse_arc_poly(12, cy, rxo, ryo, math.pi, 2 * math.pi)
    inner = ellipse_arc_poly(12, cy, rxo - lw, ryo - lw, 2 * math.pi, math.pi)
    handle = ink('loop', poly(outer + [(12 + rxo, top + 0.3), (12 + rxo - lw, top + 0.3)] + inner + [(12 - rxo + lw, top + 0.3), (12 - rxo, top + 0.3)]))
    by0, by1 = top + LINE, top + LINE + LINE / 2
    def xl(y): return x0t + (x0b - x0t) * (y - top) / (bot - top)
    def xr(y): return x1t + (x1b - x1t) * (y - top) / (bot - top)
    band = hole(poly([(xl(by0) + LINE, by0), (xr(by0) - LINE, by0), (xr(by1) - LINE, by1), (xl(by1) + LINE, by1)]))
    return dict(roots=[body, handle], holes=[band], cuts=[], approved=load('svg/blind2/construction.json')['bag']['d'],
                note='new root calls: body wider at the top, flat strap handle, rim band')

def bed():
    b = load('svg/blind/blind.json')['bed2']
    p = b['parts']
    return dict(roots=[ink('mass', p[0]), ink('post', p[1]), ink('post', p[2]), ink('mass', p[3])], holes=[], cuts=[],
                approved=b['d'], note="bed2's roots, kinds declared (mattress and pillow masses, headboard and leg posts)")

def mask_of(d): return raster_path(d)

if __name__ == '__main__':
    outdir = os.path.join(HERE, 'svg/mix'); os.makedirs(outdir, exist_ok=True)
    only = sys.argv[1:]
    p = os.path.join(outdir, 'summary.json')
    summary = json.load(open(p)) if os.path.exists(p) else {}
    summary['rule'] = RULE; summary['thickness'] = T
    for group in (six(), new()):
        for k, v in group.items():
            if only and k not in only: continue
            m, J = cast(v['roots'], v['holes'], v['cuts'])
            np.save(os.path.join(outdir, f'{k}.npy'), np.packbits(m))
            open(os.path.join(outdir, f'{k}.svg'), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="{trace(m)}"/></svg>')
            s = dict(ink_px2=round(float(m.sum()) / G / G, 2), roots=len(v['roots']), holes=len(v['holes']), cuts=len(v['cuts']))
            if v.get('approved'):
                a = raster_path(v['approved'])
                s['approved_only'] = round(float((a & ~m).sum()) / G / G, 2); s['mix_only'] = round(float((m & ~a).sum()) / G / G, 2)
            summary[k] = s
            print(k, s, flush=True)
    json.dump(summary, open(p, 'w'), indent=1)
