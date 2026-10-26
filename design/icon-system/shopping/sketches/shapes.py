"""Shopping jam turn 2 sketches (product designer, visual), 2026-10-26.

Turn 1's five directions (A-E) and this turn's own (F-H), drawn as finished icons from the system's roots, on the
whole-pixel rules of grid/pixel-fit.md round 6/7: slabs 2px, the line 1.5 with one edge whole, counters whole and >= 2px,
gaps whole and >= 1px, protrusion >= 1px, symmetric icons on the badge's centre line (x = 12). Rounds from the rack
(E8 / E4 / E2 = 1/8, 1/4, 1/2 px): 1/2 on a mass's corners, 1/4 on a slab or post, 1/8 on a cut; tips keep the tip rule.
Coordinates are px in the 24 badge, drawn 1:1 (rule 1).

Each function returns (parts, holes) as SVG path strings; hand-built, not engine output. Reuses rpoly/ell/compose from
grid/src/shop_shapes.py (continuous-curvature rounds).
"""
import math, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'grid', 'src'))
from shop_shapes import rpoly, ell, rot, E8, E4, E2, LINE  # noqa: E402


def rect(x0, y0, x1, y1, r):
    if isinstance(r, (int, float)): r = (r, r, r, r)       # tl, tr, br, bl
    return [(x0, y0, r[0]), (x1, y0, r[1]), (x1, y1, r[2]), (x0, y1, r[3])]


def ring(cx, cy, a, b, w=LINE, n=64):
    """A handle: a ring (a whole ellipse, wall one line). Returns (outer, inner)."""
    return ell(cx, cy, a, b, 0, 2 * math.pi, n)[:-1], ell(cx, cy, a - w, b - w, 0, 2 * math.pi, n)[:-1]


def ring_above(cx, cy, a, b, ycut, w=LINE, sink=0.4, n=48):
    """The part of a handle ring that shows above the mouth at ycut (the body hides the rest): one closed band, sunk
    `sink` into the body so the join is a real overlap."""
    yb = ycut + sink
    def ang(rb):
        return math.asin(max(-1, min(1, (yb - cy) / rb)))
    ao, ai = ang(b), ang(b - w)
    outer = ell(cx, cy, a, b, math.pi - ao, 2 * math.pi + ao, n)
    inner = ell(cx, cy, a - w, b - w, 2 * math.pi + ai, math.pi - ai, n)
    return outer + inner


def stadium(x0, y0, x1, y1, n=16):
    """A slot: a slab with full round ends (the die's punch)."""
    r = (y1 - y0) / 2
    cyy = y0 + r
    return (ell(x1 - r, cyy, r, r, -math.pi / 2, math.pi / 2, n) + ell(x0 + r, cyy, r, r, math.pi / 2, 3 * math.pi / 2, n))


# ------------------------------------------------------------------ A. the specific bag (gusseted shop bag)
def bag_gusset():
    """A paper shop bag, 10 x 6 (x 7..17, y 11..17), the side gussets one V cut at each top corner (2 wide, 1.5 deep: the
    fold where the side panel tucks in). The handle a ring 4/5 (7.5 x 6, wall the line), its centre 1px above the bag's
    mouth, so the bag hides a third of it (the cup's ear is the same ring, hidden by the cup by a different share)."""
    body = [(7, 11, E8), (8, 12.5, E8), (9, 11, E8), (15, 11, E8), (16, 12.5, E8), (17, 11, E8),
            (17, 17, E2), (7, 17, E2)]
    return [rpoly(body), rpoly(ring_above(12, 10, 3.75, 3.0, 11))], []


# ------------------------------------------------------------------ B. the hanging shop sign
def blade_sign(oval=False):
    """The old-town blade sign: a wall plate (a post), an arm (the line) out from it, two hangers (posts) and the board
    (a mass), hung from the arm. Asymmetric on purpose: the only icon that stands off a wall."""
    plate = rect(6, 6, 7.5, 11, (E4, 0, E4, E4))
    arm = rect(6, 7, 18, 8.5, (0, E4, E4, 0))
    if oval:
        bx, by, a, b = 13, 13, 4, 3
        board = ell(bx, by, a, b, 0, 2 * math.pi, 64)[:-1]
        h0, h1 = 10.25, 10.4
    else:
        board = rect(9, 11, 17, 16, E2)
        h0 = h1 = 11.2
    hang = [rect(10.5, 8.4, 12, h0, 0), rect(14, 8.4, 15.5, h1, 0)]
    return [rpoly(plate), rpoly(arm), rpoly(board)] + [rpoly(h) for h in hang], []


# ------------------------------------------------------------------ C. the coin purse (kiss-lock)
def purse():
    """The frame purse: a 2px slab frame (x 7..17), the body a half ellipse hung from it (8 wide, 4 deep: the frame
    overhangs it 1px a side, the minimum protrusion), two bead clasps (r 1.25) meeting on the centre line."""
    frame = rect(7, 10, 17, 12, E4)
    body = [(16, 11.9, 0)] + ell(12, 11.9, 4, 4.1, 0, math.pi, 40)[1:-1] + [(8, 11.9, 0)]
    beads = [ell(10.75, 9, 1.25, 1.25, 0, 2 * math.pi, 32)[:-1], ell(13.25, 9, 1.25, 1.25, 0, 2 * math.pi, 32)[:-1]]
    return [rpoly(frame), rpoly(body)] + [rpoly(b) for b in beads], []


# ------------------------------------------------------------------ D. the string bag
def string_bag():
    """The net bag: body a half ellipse (10 wide, 6 deep) shaped by what's in it; the mesh three diamond cuts (2.5
    across, the line between); the handle the same ring as A."""
    body = [(17, 11, 0)] + ell(12, 11, 5, 6, 0, math.pi, 48)[1:-1] + [(7, 11, 0)]
    def dia(cx, cy, d=1.3):
        return [(cx, cy - d, E8), (cx + d, cy, E8), (cx, cy + d, E8), (cx - d, cy, E8)]
    holes = [dia(9.8, 13.4), dia(14.2, 13.4), dia(12, 15.4, 1.1)]
    return [rpoly(body), rpoly(ring_above(12, 10, 3.75, 3.0, 11))], [rpoly(h) for h in holes]


# ------------------------------------------------------------------ E. goods on the counter
def counter():
    """The stall: a 2px counter slab with three goods, one of each root kind and a 1px gap between: a jar (mass, with a
    2px lid), a box (slab), a round."""
    top = rect(6, 15, 18, 17, E4)
    jar = rect(7, 11, 10, 15.2, (E2, E2, 0, 0))
    lid = rect(7.5, 9, 9.5, 11.2, E4)
    box = rect(11, 12, 14, 15.2, (E4, E4, 0, 0))
    rnd = ell(16.5, 13.6, 1.5, 1.5, 0, 2 * math.pi, 32)[:-1]
    return [rpoly(p) for p in (top, jar, lid, box, rnd)], []


# ------------------------------------------------------------------ F. the record-shop bag (die-cut handle)
def die_cut(outline=False):
    """The LP bag of a record or design shop: no handle added, the handle is a hole the die punched (a stadium 4 x 2,
    whole px), under a 2px band. One root and one hole. Solid: 8 x 9. Outline: the walls the line, the band holds the
    slot (2px above it, the line under it); walls the line, outer edges whole."""
    if not outline:
        body = rect(8, 8, 16, 17, E2)
        return [rpoly(body)], [rpoly([(x, y, 0) for x, y, _ in stadium(10, 10, 14, 12)])]
    body = rect(7, 7, 17, 17, E2)
    slot = [(x, y, 0) for x, y, _ in stadium(10, 9, 14, 11)]
    inner = rect(8.5, 12.5, 15.5, 15.5, E4)
    return [rpoly(body)], [rpoly(slot), rpoly(inner)]


# ------------------------------------------------------------------ G. the holed coin (krone)
def krone():
    """Numismatics: the Danish krone, a coin with a hole. A disc 10 across with a 2px hole on centre; one root, one
    hole. Expected kill: a washer, a record, a donut."""
    disc = ell(12, 12, 5, 5, 0, 2 * math.pi, 64)[:-1]
    hole = ell(12, 12, 1, 1, 0, 2 * math.pi, 24)[:-1]
    return [rpoly(disc)], [rpoly(hole)]


# ------------------------------------------------------------------ H. the market paper bag (the tool's serrated edge)
def serrated(fold=False):
    """Simple subtraction: the bag with its handle taken away. A market or bakery paper bag, 8 wide x 8 tall, its mouth
    the bag machine's serrated knife: four teeth, 2px pitch, 1px deep (the minimum protrusion), points broken. The tool's
    mark is the subject. Fold: the mouth turned over once, a 1px cut (a whole gap) 3px below the teeth."""
    pts = [(8, 10, 0)]
    for k in range(4):
        x = 8 + 2 * k
        pts += [(x + 1, 9, E8), (x + 2, 10, E8 if k < 3 else 0)]
    pts += [(16, 17, E2), (8, 17, E2)]
    holes = []
    if fold:
        holes.append(rpoly([(7.9, 12, 0), (16.1, 12, 0), (16.1, 13, 0), (7.9, 13, 0)]))
    return [rpoly(pts)], holes


# ------------------------------------------------------------------ push round (after looking at the first sheet)
def die_cut_tote(gusset=False, top=(8, 16), y0=8):
    """F pushed: the bag's own flare (wider at the foot, 1px a side, as a gusseted bag stands) with the die-cut handle.
    The handle is its counter: the same finger-hole the cup's ear holds (2px tall), cut through the body under a 2px
    band. Gusset: a V cut at each top corner (1.5 wide, 1.5 deep)."""
    xl, xr = top
    if gusset:
        body = [(xl, y0, E8), (xl + 0.75, y0 + 1.5, E8), (xl + 1.5, y0, E8), (xr - 1.5, y0, E8), (xr - 0.75, y0 + 1.5, E8),
                (xr, y0, E8), (17, 17, E2), (7, 17, E2)]
    else:
        body = [(xl, y0, E2), (xr, y0, E2), (17, 17, E2), (7, 17, E2)]
    slot = [(x, y, 0) for x, y, _ in stadium(10, y0 + 2, 14, y0 + 4)]
    return [rpoly(body)], [rpoly(slot)]


def blade_clean():
    """B pushed: no wall plate; the arm (the line) runs from the badge's left like a bracket out of a wall, with a
    brace under it (a post at 45 degrees into the arm and the wall stub); the board (mass) on two short hangers."""
    wall = rect(6, 6.5, 7.5, 12, (E4, 0, 0, E4))
    arm = rect(6, 7, 17.5, 8.5, (0, E4, E4, 0))
    brace = [(7.4, 10.9, 0), (10.9, 8.4, 0), (12.6, 8.4, 0), (7.4, 12.1, 0)]
    board = rect(10, 11, 17, 16, E2)
    hang = [rect(11, 8.4, 12.5, 11.2, 0), rect(14.5, 8.4, 16, 11.2, 0)]
    return [rpoly(q) for q in (wall, arm, brace, board)] + [rpoly(h) for h in hang], []


CONCEPTS = [
    ('A', 'Gusseted shop bag', 'turn 1 A', bag_gusset),
    ('B1', 'Blade sign, board', 'turn 1 B', blade_sign),
    ('B2', 'Blade sign, oval', 'turn 1 B', lambda: blade_sign(True)),
    ('C', 'Kiss-lock purse', 'turn 1 C', purse),
    ('D', 'String bag', 'turn 1 D', string_bag),
    ('E', 'Goods on the counter', 'turn 1 E', counter),
    ('F1', 'Die-cut LP bag', 'new', die_cut),
    ('F2', 'Die-cut LP bag, outline', 'new', lambda: die_cut(True)),
    ('G', 'Holed coin (krone)', 'new', krone),
    ('H1', 'Serrated paper bag', 'new', serrated),
    ('H2', 'Serrated bag, folded', 'new', lambda: serrated(True)),
    ('F3', 'Die-cut tote, flared', 'push F', die_cut_tote),
    ('F4', 'Die-cut tote, gusset', 'push F+A', lambda: die_cut_tote(True)),
    ('F5', 'Die-cut tote, lighter', 'push F', lambda: die_cut_tote(False, (8.5, 15.5), 9)),
    ('B3', 'Blade sign, braced', 'push B', blade_clean),
]


# ================================================================== concepts round (jam turn 5): K, B1a, B1b, J
# Built to concepts/*.md (systems, turn 4). What carries is the line; what is carried is the mass. A link is a ring
# (counter 2, wall the line, so 5 across); a handle is its counter; a fold is a cut.

def bracket(x_end, y0=7.5, stub_h=5):
    """The wall stub and arm as one L of line (1.5): stub x 4.5..6 (inner edge whole), arm y0..y0+1.5 (underside on
    whole px when y0 is a half), the inside corner the 1/2 fillet (a post into a face), outer corners 1/4."""
    y1 = y0 + LINE
    return [(4.5, y0, E4), (x_end, y0, E4), (x_end, y1, E4), (6, y1, E2), (6, y0 + stub_h, E4), (4.5, y0 + stub_h, E4)]


def link(cx, cy):
    """A link: a ring, counter 2 (whole px when cx, cy are whole), wall the line."""
    return ell(cx, cy, 2.5, 2.5, 0, 2 * math.pi, 48)[:-1], ell(cx, cy, 1, 1, 0, 2 * math.pi, 32)[:-1]


def sign_one():
    """B1a: one ring, centred on an 8 x 5 board (x 9..17, y 12..17); the ring's top wall runs into the arm, its bottom
    1/2px behind the board, so what shows is the 2px hole between them."""
    o, i = link(13, 10)
    board = rect(9, 12, 17, 17, E2)
    return [rpoly(bracket(17)), rpoly(o), rpoly(board)], [rpoly(i)]


def sign_two():
    """B1b: two rings 6 apart (x 9 and 15, holes on whole px), a wide low board 12 x 4 (x 6..18, y 12..16)."""
    o1, i1 = link(9, 10); o2, i2 = link(15, 10)
    board = rect(6, 12, 18, 16, E2)
    return [rpoly(bracket(18)), rpoly(o1), rpoly(o2), rpoly(board)], [rpoly(i1), rpoly(i2)]


def flared_bag(top, foot, y0, y1, slot, crease=None, rt=E4):
    """A flared slab (the bag), foot corners 1/2, top corners 1/4; the handle a stadium counter; an optional crease cut
    (a fold is a cut: 1px, across the full width)."""
    (tx0, tx1), (fx0, fx1) = top, foot
    body = [(tx0, y0, rt), (tx1, y0, rt), (fx1, y1, E2), (fx0, y1, E2)]
    holes = [rpoly([(x, y, 0) for x, y, _ in stadium(*slot)])]
    if crease is not None:
        holes.append(rpoly([(fx0 - 1, crease, 0), (fx1 + 1, crease, 0), (fx1 + 1, crease + 1, 0), (fx0 - 1, crease + 1, 0)]))
    return [rpoly(body)], holes


def fold_bag(even=False):
    """K: the folded paper bag. Spec 7:9, 10 tall (y 7..17), slot 3 x 2 under a 2px band (y 9..11), crease y 14..15
    leaving the 2px block bottom. even=True: 8:10 with a 4 x 2 slot, every level and upright edge whole."""
    if even:
        return flared_bag((8, 16), (7, 17), 7, 17, (10, 9, 14, 11), 14)
    return flared_bag((8.5, 15.5), (7.5, 16.5), 7, 17, (10.5, 9, 13.5, 11), 14)


def hung_bag(small=False):
    """J: the sign that hangs the bag. Bracket arm y 6.5..8; two drops (posts at the line, 1px showing) over the bag's
    top corners; the bag a flared slab with its handle hole clean (held, never threaded). small: the bag 6:8 x 7."""
    if small:
        y0, top, foot, slot = 10, (9.5, 15.5), (8.5, 16.5), (11, 12, 14, 14)
    else:
        y0, top, foot, slot = 9, (9, 16), (8, 17), (11, 11, 14, 13)
    arm = bracket(17, 6.5, 4)
    drops = [rect(top[0], 7.9, top[0] + LINE, y0 + 0.3, 0), rect(top[1] - LINE, 7.9, top[1], y0 + 0.3, 0)]
    parts, holes = flared_bag(top, foot, y0, 17, slot)
    return [rpoly(arm)] + [rpoly(d) for d in drops] + parts, holes


ROUND5 = [
    ('K', 'The fold (7:9, slot 3)', 'concept K', fold_bag),
    ('K2', 'The fold, even (8:10, slot 4)', 'K reshaped', lambda: fold_bag(True)),
    ('B1a', 'Blade sign, one ring', 'concept B1', sign_one),
    ('B1b', 'Blade sign, two rings', 'concept B1', sign_two),
    ('J', 'Sign hangs the bag', 'concept J', hung_bag),
    ('J2', 'Sign hangs the bag, small', 'J lightened', lambda: hung_bag(True)),
    ('K3', 'The fold, light (6:8 x 9)', 'K lightened', lambda: flared_bag((9, 15), (8, 16), 8, 17, (10.5, 10, 13.5, 12), 14)),
    ('B1c', 'Blade sign, one ring, low board', 'B1a lightened', lambda: sign_low()),
]


def sign_low():
    """B1a with the board 8 x 4 (y 12..16): 8px2 lighter."""
    o, i = link(13, 10)
    return [rpoly(bracket(17)), rpoly(o), rpoly(rect(9, 12, 17, 16, E2))], [rpoly(i)]


# ================================================================== round 2: the plain bag (concepts/bag-plain.md)
# A handle is the hole the grip goes through: a counter 2 deep, as long as the grip; walled by the line where free,
# closed by the body where attached. No hole in the body; flared slab, flat top, foot 1 wider a side.

def bag_body(tx0, tx1, fx0, fx1, y0, y1=17):
    return [(tx0, y0, E4), (tx1, y0, E4), (fx1, y1, E2), (fx0, y1, E2)]


def arch(cx0, cx1, top_y, base_y, sink=0.4, n=20):
    """A round-topped handle: the counter is the upper half of a stadium cx0..cx1, 2 deep (top_y+1.5 .. base_y), its lower
    side closed by the body at base_y; the wall the line around it. Returns (wall, counter)."""
    cy = top_y + LINE + 1                      # the counter's round ends: radius 1, centred 1 below its top
    ri, ro = 1.0, 1.0 + LINE
    def upper(x0, x1, r):                      # left end up and over to the right end, at height cy
        return (ell(x0 + r, cy, r, r, math.pi, 1.5 * math.pi, n) + ell(x1 - r, cy, r, r, 1.5 * math.pi, 2 * math.pi, n))
    ox0, ox1 = cx0 - LINE, cx1 + LINE
    wall = upper(ox0, ox1, ro) + [(ox1, base_y + sink, 0), (ox0, base_y + sink, 0)]
    counter = upper(cx0, cx1, ri) + [(cx1, base_y, 0), (cx0, base_y, 0)]
    return wall, counter


def square_handle(cx0, cx1, top_y, base_y, sink=0.4):
    """Three posts at the line around a slab counter (cx0..cx1, 2 deep); outer corners 1/4, counter corners 1/8."""
    ox0, ox1 = cx0 - LINE, cx1 + LINE
    wall = [(ox0, top_y, E4), (ox1, top_y, E4), (ox1, base_y + sink, 0), (ox0, base_y + sink, 0)]
    counter = [(cx0, top_y + LINE, E8), (cx1, top_y + LINE, E8), (cx1, base_y, 0), (cx0, base_y, 0)]
    return wall, counter


def plain_p1():
    """P1, the ear turned up: body top 6 / foot 8, y 10..17; counter 3 x 2 (y 8..10) under a line arch (outer 9..15)."""
    w, c = arch(10.5, 13.5, 6.5, 10)
    return [rpoly(bag_body(9, 15, 8, 16, 10)), rpoly(w)], [rpoly(c)]


def plain_p2():
    """P2, the square handle: as P1, the handle three posts round a square-ended counter 3 x 2."""
    w, c = square_handle(10.5, 13.5, 6.5, 10)
    return [rpoly(bag_body(9, 15, 8, 16, 10)), rpoly(w)], [rpoly(c)]


def plain_p3():
    """P3, the cuffed paper bag: body top 7 / foot 9, y 10..17, the cuff cut off by a 1px gap at y 12..13; counter 4 x 2
    under a line arch (outer 8.5..15.5) standing on the cuff."""
    w, c = arch(10, 14, 6.5, 10)
    cut = [(6, 12, 0), (18, 12, 0), (18, 13, 0), (6, 13, 0)]
    return [rpoly(bag_body(8.5, 15.5, 7.5, 16.5, 10)), rpoly(w)], [rpoly(c), rpoly(cut)]


def plain_p4():
    """P4 (visual reshape of P1): the handle inset from the body's corners so it is a handle, not a dome. Counter 3 x 2
    (x 10.5..13.5), arch outer 9..15 on a top 8 wide (x 8..16), foot 10 (7..17), body 6 tall (y 11..17)."""
    w, c = arch(10.5, 13.5, 7.5, 11)
    return [rpoly(bag_body(8, 16, 7, 17, 11)), rpoly(w)], [rpoly(c)]


def plain_p5():
    """P5 (visual reshape): P4 lightened to the museum: top 7 (8.5..15.5), foot 9, 6 tall; arch outer 9..15, inset 1/2."""
    w, c = arch(10.5, 13.5, 7.5, 11)
    return [rpoly(bag_body(8.5, 15.5, 7.5, 16.5, 11)), rpoly(w)], [rpoly(c)]


ROUND2 = [
    ('P1', 'The ear, turned up', 'bag-plain P1', plain_p1),
    ('P2', 'The square handle', 'bag-plain P2', plain_p2),
    ('P3', 'The cuffed paper bag', 'bag-plain P3', plain_p3),
    ('P4', 'Handle inset, wider bag', 'visual reshape', plain_p4),
    ('P5', 'Handle inset, lighter', 'visual reshape', plain_p5),
    ('P6', 'Straight bag, open handle', 'visual reshape', lambda: plain_open(8, 16)),
    ('P7', 'Straight bag, open handle, light', 'visual reshape', lambda: plain_open(8.5, 15.5)),
    ('P8', 'Wide low handle', 'visual reshape', lambda: plain_wide()),
]


def plain_wide():
    """P8 (visual): the hand-wide handle the rule allows at its long end: counter 5 x 2 (x 9.5..14.5, y 10..12), arch outer
    8..16 on a top 8 wide, foot 9 (7.5..16.5), body 5 tall (y 12..17)."""
    w, c = arch(9.5, 14.5, 8.5, 12)
    return [rpoly(bag_body(8, 16, 7.5, 16.5, 12)), rpoly(w)], [rpoly(c)]


def plain_open(x0, x1):
    """P6/P7 (visual): what made P1-P5 kettlebells is a flared mass under a small, solid-looking knob. So: straight sides
    (no flare), and a handle whose counter is 3 x 3 (deeper than the rule's 2, so the hole reads before the wall), arch
    outer 6 wide (x 9..15), inset from the body's corners. Body y 11..17."""
    cy_top = 6.5
    w, c = arch(10.5, 13.5, cy_top, 11)
    # the counter 3 deep: arch() makes it base - (top + 1.5) = 3 here (11 - 8)
    body = [(x0, 11, E4), (x1, 11, E4), (x1, 17, E2), (x0, 17, E2)]
    return [rpoly(body), rpoly(w)], [rpoly(c)]
