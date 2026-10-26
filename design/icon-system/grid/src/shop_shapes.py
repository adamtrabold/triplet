"""Shopping concepts, round 4 (2026-10-26): five left-of-centre subjects, drawn as finished icons from the existing roots
(mass, slab, post, loop, hole, capital/chamfer, tip) and the machined rule (the rack: an eighth, a quarter and a half px;
continuous-curvature rounds; chamfer under an overhang, the half fillet where a post meets a face).

Hand-built here, not engine output. Coordinates are px at the 24px badge (the drawings sit in it unscaled, rule 1).
Each concept returns (parts, holes): parts are filled outlines, holes are cut out of them.

    from shop_shapes import CONCEPTS, rpoly, compose
"""
import math

E8, E4, E2 = 0.125, 0.25, 0.5          # the rack: an eighth, a quarter, a half (px at 24); each double the last
LINE = 1.5
T = dict(mass=2 * LINE, slab=LINE, post=LINE, loop=LINE)   # owner 10-26: no ink thinner than the line


def f(v): return f'{v:.3f}'.rstrip('0').rstrip('.')


def rpoly(pts):
    """A closed outline through pts = [(x, y, r)]: r is the cutter at that corner (0 = a plain point, e.g. on a curve).
    Each round is a continuous-curvature ramp: one cubic whose ends sit 1.5x the circular tangent length back along each
    edge (Apple's continuous corner), so the curve eases out of the straight instead of a circle meeting a line."""
    n = len(pts)
    out = []
    for i in range(n):
        x, y, r = pts[i]
        if r <= 0:
            out.append(('L', (x, y)))
            continue
        px, py, _ = pts[i - 1]
        nx, ny, _ = pts[(i + 1) % n]
        a = (px - x, py - y); b = (nx - x, ny - y)
        la, lb = math.hypot(*a), math.hypot(*b)
        ua, ub = (a[0] / la, a[1] / la), (b[0] / lb, b[1] / lb)
        ang = math.acos(max(-1, min(1, ua[0] * ub[0] + ua[1] * ub[1])))
        t = r / math.tan(ang / 2) if ang > 1e-3 else 0
        t = min(t * 1.5, la * 0.48, lb * 0.48)
        p1 = (x + ua[0] * t, y + ua[1] * t); p2 = (x + ub[0] * t, y + ub[1] * t)
        c1 = (x + ua[0] * t * 0.25, y + ua[1] * t * 0.25); c2 = (x + ub[0] * t * 0.25, y + ub[1] * t * 0.25)
        out.append(('R', p1, c1, c2, p2))
    d = ''
    for k, seg in enumerate(out):
        if seg[0] == 'L':
            d += ('M' if k == 0 else 'L') + f'{f(seg[1][0])},{f(seg[1][1])} '
        else:
            _, p1, c1, c2, p2 = seg
            d += ('M' if k == 0 else 'L') + f'{f(p1[0])},{f(p1[1])} C{f(c1[0])},{f(c1[1])} {f(c2[0])},{f(c2[1])} {f(p2[0])},{f(p2[1])} '
    return d + 'Z'


def ell(cx, cy, rx, ry, a0, a1, n=40):
    """Points on an ellipse from angle a0 to a1 (radians, y down), ends included, r = 0 (curve points)."""
    return [(cx + rx * math.cos(a0 + (a1 - a0) * i / n), cy + ry * math.sin(a0 + (a1 - a0) * i / n), 0) for i in range(n + 1)]


def rot(pts, cx, cy, deg):
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    return [(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c, r) for x, y, r in pts]


def compose(parts, holes, uid, fill='#12293F'):
    if not holes:
        return ''.join(f'<path fill="{fill}" d="{p}"/>' for p in parts)
    m = (f'<mask id="{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>'
         + ''.join(f'<path d="{h}" fill="#000"/>' for h in holes) + '</mask>')
    return f'<defs>{m}</defs><g mask="url(#{uid})">' + ''.join(f'<path fill="{fill}" d="{p}"/>' for p in parts) + '</g>'


# Every ink part is at least the line (1.5px) across (owner 10-26: "nothing should go that thin"). The cuts here are 3/4px;
# the owner's v262 notes make counters shapes ("nothing should be this small"): the pixel round sets them.

# ------------------------------------------------------------------ 1. the swing tag
def tag():
    """A shop's swing tag, luggage-tag proportions (the inspo's tags): a slab with its hanging end cut by two chamfers,
    an eyelet (an ellipse 4/5) and its string, one closed loop of line (a ring, as the cup's ear) threaded through the
    eyelet. It hangs from the string at a slant, the string up, so it reads as hanging, not a label lying flat."""
    x0, x1, y0, y1 = 8.4, 17.6, 9.4, 14.9           # body 9.2 x 5.5
    ch = 2.0                                          # the chamfers that make the hanging end
    my = (y0 + y1) / 2
    body = [(x0 + ch, y0, E4), (x1, y0, E2), (x1, y1, E2), (x0 + ch, y1, E4), (x0, my + 0.6, E4), (x0, my - 0.6, E4)]
    ex, ey = x0 + 2.35, my
    eye = ell(ex, ey, 0.85, 0.85 * 4 / 5, 0, 2 * math.pi, 32)[:-1]
    w = LINE                                          # the string is ink: one line
    sx, sy, a, b = ex - 2.45, ey, 2.6, 2.6 * 4 / 5
    ring = ell(sx, sy, a, b, 0, 2 * math.pi, 56)[:-1]
    ringh = ell(sx, sy, a - w, b - w, 0, 2 * math.pi, 40)[:-1]
    C = (13.0, 12.15, 38)
    P = [rot(body, *C), rot(ring, *C)]; H = [rot(eye, *C), rot(ringh, *C)]
    xs = [x for q in P for x, _, _ in q]; ys = [y for q in P for _, y, _ in q]
    dx, dy = 12 - (min(xs) + max(xs)) / 2, 12 - (min(ys) + max(ys)) / 2      # centred in the badge by its box
    mv = lambda q: [(x + dx, y + dy, r) for x, y, r in q]
    return [rpoly(mv(q)) for q in P], [rpoly(mv(q)) for q in H]


# ------------------------------------------------------------------ 2. the market basket
def basket():
    """A market basket: a shallow mass, wider at the rim, flat base; a rim slab (one line) overhanging it, the step under
    the rim a chamfer (as the museum's capital); one weave slot; the handle a ring (whole ellipse 4/5, wall one line),
    its centre on the rim so half shows."""
    rim_y0, rim_y1 = 11.7, 13.2
    bx0, bx1, base = 7.7, 16.3, 17.55
    tx0, tx1 = 6.6, 17.4
    rim = [(tx0, rim_y0, E4), (tx1, rim_y0, E4), (tx1, rim_y1, E8), (tx1 - 0.55, rim_y1 + 0.55, E8),
           (bx1 + 0.05, rim_y1 + 0.55, 0), (bx1 - 0.3, base, E2), (bx0 + 0.3, base, E2), (bx0 - 0.05, rim_y1 + 0.55, 0),
           (tx0 + 0.55, rim_y1 + 0.55, E8), (tx0, rim_y1, E8)]
    a = 4.0; b = a * 4 / 5; w = LINE
    cx, cy = 12, rim_y0 + 0.02
    handle = ell(cx, cy, a, b, math.pi, 2 * math.pi, 48) + ell(cx, cy, a - w, b - w, 2 * math.pi, math.pi, 48)
    y = (rim_y1 + 0.55 + base) / 2
    slot = [(bx0 + 1.6, y - 0.375, E8), (bx1 - 1.6, y - 0.375, E8), (bx1 - 1.6, y + 0.375, E8), (bx0 + 1.6, y + 0.375, E8)]
    return [rpoly(rim), rpoly(handle)], [rpoly(slot)]


# ------------------------------------------------------------------ 3. the awning
def awning():
    """A shopfront: the striped awning over the window. The awning a slab sloping out, its lower edge three scallops
    (each the lower half of an ellipse, flatter than 4/5), the stripes two cuts that part it into three panels; the
    front below a mass with a door and a window cut in it, standing flat."""
    top, eave = 7.4, 10.2
    xl0, xr0, xl1, xr1 = 8.2, 15.8, 6.6, 17.4
    pw = (xr1 - xl1) / 3
    pts = [(xl0, top, E4), (xr0, top, E4), (xr1, eave, E8)]
    for i in range(3):
        cx = xr1 - pw * (i + 0.5)
        pts += ell(cx, eave, pw / 2, pw / 2 * 0.62, 0, math.pi, 24)[1:-1]
        if i < 2:
            pts.append((xr1 - pw * (i + 1), eave, 0))
    pts.append((xl1, eave, E8))
    stripes = []
    for i in (1, 2):
        xt = xl0 + (xr0 - xl0) * i / 3; xb = xl1 + pw * i
        stripes.append([(xt - 0.3, top - 0.05, 0), (xt + 0.3, top - 0.05, 0), (xb + 0.375, eave + 0.3, 0), (xb - 0.375, eave + 0.3, 0)])
    fy0, fy1 = 12.0, 16.95
    front = [(7.4, fy0, E8), (16.6, fy0, E8), (16.6, fy1, E4), (7.4, fy1, E4)]
    door = [(8.9, fy0 + 1.5, E8), (10.9, fy0 + 1.5, E8), (10.9, fy1 + 0.01, 0), (8.9, fy1 + 0.01, 0)]
    win = [(12.4, fy0 + 1.5, E8), (15.1, fy0 + 1.5, E8), (15.1, fy1 - 1.5, E8), (12.4, fy1 - 1.5, E8)]
    return [rpoly(pts), rpoly(front)], [rpoly(s) for s in stripes] + [rpoly(door), rpoly(win)]


# ------------------------------------------------------------------ 4. the parcel
def parcel():
    """A parcel from the shop, tied with string: a mass, the string two cuts that cross (it reads as string by its gap),
    the knot two leaves (each an ellipse 4/5 or flatter, solid: a loop with a hole would go under the line) on the lid."""
    x0, x1, y0, y1 = 7.2, 16.8, 11.2, 17.1
    box = [(x0, y0, E4), (x1, y0, E4), (x1, y1, E4), (x0, y1, E4)]
    c = 0.75
    sv = [(12 - c / 2, y0 - 0.01, 0), (12 + c / 2, y0 - 0.01, 0), (12 + c / 2, y1 + 0.01, 0), (12 - c / 2, y1 + 0.01, 0)]
    hy = 13.75
    sh = [(x0 - 0.01, hy, 0), (x1 + 0.01, hy, 0), (x1 + 0.01, hy + c, 0), (x0 - 0.01, hy + c, 0)]
    parts = [rpoly(box)]
    for sgn in (-1, 1):
        cx, cy = 12 + sgn * 1.7, 9.3
        leaf = ell(cx, cy, 1.85, 1.85 * 3 / 5, 0, 2 * math.pi, 40)[:-1]
        parts.append(rpoly(rot(leaf, cx, cy, sgn * -22)))
    return parts, [rpoly(sv), rpoly(sh)]


# ------------------------------------------------------------------ 5. the till
def till():
    """The shop till, an old register: a drawer slab with the body standing on it (the step a chamfer, as the museum's
    capital), the body a mass with a raked keyboard (the front cut back at a slant, the key row one cut along it), and the sale
    flag on a post on top (the part that pops up at every sale); the post meets the body and the flag with the half
    fillet."""
    dy0, dy1 = 15.4, 16.95
    drawer = [(6.8, dy0, E8), (17.2, dy0, E8), (17.2, dy1, E4), (6.8, dy1, E4)]
    by0, by1 = 11.2, 14.4
    pl, pr, fy0, fy1 = 13.25, 14.75, 7.05, 9.6
    body = [(7.9, 12.95, E8), (11.0, by0, E4), (pl, by0, E2), (pl, fy1, E2), (11.9, fy1, E4), (11.9, fy0, E4), (17.1, fy0, E4),
            (17.1, fy1, E4), (pr, fy1, E2), (pr, by0, E2), (16.1, by0, E2), (16.1, by1, E8), (16.65, by1 + 0.55, 0),
            (16.65, dy0 - 0.45, 0), (7.35, dy0 - 0.45, 0), (7.35, by1 + 0.55, 0), (7.9, by1, E8)]
    p0, p1 = (7.9, 12.95), (11.0, by0)                # the rake
    L = math.hypot(p1[0] - p0[0], p1[1] - p0[1]); u = ((p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L); n = (-u[1], u[0])
    if n[1] < 0: n = (-n[0], -n[1])                  # into the body
    t0, t1, d0, d1 = 0.75, L - 0.35, LINE, LINE + 0.75  # the key row: a cut along the rake, one line in from it
    q = [(p0[0] + u[0] * t + n[0] * d, p0[1] + u[1] * t + n[1] * d) for t, d in ((t0, d0), (t1, d0), (t1, d1), (t0, d1))]
    keys = [[(x, y, E8) for x, y in q]]
    return [rpoly(drawer), rpoly(body)], [rpoly(k) for k in keys]


CONCEPTS = [
    ('tag', tag), ('basket', basket), ('awning', awning), ('parcel', parcel), ('till', till),
]
