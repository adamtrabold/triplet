#!/usr/bin/env python3
"""The "Brand signatures" board (Grid concepts page), round 3 (2026-10-26, after director turn 175 + addenda 1-3 and his
five comments on v258).

Owner, on v258: "the bracket looks really awkward -- i don't like it. i'd prefer to use an apple-like methodology where
the roundedness matches how something would actually be machined to be smooth."; "bevel is *way* better than proposed
version... how do we square these logics."; "no this is bad... a building can't have a rounded base it will look like
it's wobbling."; "no i hate this too . what about the sides?"; "i can't see what the new icon would look like".

The approved six and the fork, bed and bag drafts are copied from the live Now board, never redrawn. Proposals (museum
sides, two bags) are drawn here by hand from root shapes and the machined rule: hand-built, not engine output.
Generic sets: Material Symbols Rounded fill (Apache 2.0), Phosphor fill (MIT), Lucide (ISC), from their npm packages.

  python3 -I src/signatures-board.py <live Grid7Now.dc.html> <generic svg dir> <out dir>
    <generic svg dir> holds mat/, pho/, lucide/ (see GENERIC below).
"""
import math, os, re, sys

NOW, GEN, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(OUT, exist_ok=True)
PREVIEW_H = 2081

NAVY, ORANGE, DEEP, GREY, RULE, PAPER, TILE, INK = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#F2EBDD', '#1A1A18'
MOSS = '#547326'
W = 1600
FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">'

s = open(NOW, encoding='utf-8').read()
D = {}
for svg_ in re.findall(r'<svg width="72"[^>]*>.*?</svg>', s, re.S):
    D[re.search(r'aria-label="([^"]+)"', svg_).group(1)] = re.search(r' d="([^"]+)"', svg_).group(1)
assert len(D) == 9, D.keys()


def f(v): return f'{v:.3f}'.rstrip('0').rstrip('.')
def svg(inner, px, vb='0 0 24 24'): return f'<svg width="{px}" height="{px}" viewBox="{vb}" aria-hidden="true" style="display:block">{inner}</svg>'
def solid(d, fill=NAVY): return f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/>'


# ------------------------------------------------------------------ the machined rule: three cutters
FINE, MED, BROAD = 0.15, 0.3, 0.6           # px at the 24 badge; each double the last; broad = 2/5 line


def rpoly(pts):
    """A closed outline through pts = [(x, y, r)]: r is the cutter at that corner (0 = a point on a curve). Each round is
    laid as a curvature ramp: a cubic whose handles run 1.5x the radius along each edge (Apple's continuous-corner
    proportion), so the curve eases out of the straight instead of a circle meeting a line."""
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
        cosang = max(-1, min(1, ua[0] * ub[0] + ua[1] * ub[1]))
        ang = math.acos(cosang)
        t = r / math.tan(ang / 2) if ang > 1e-3 else 0      # tangent length of a circular round of radius r
        t = min(t * 1.5, la * 0.48, lb * 0.48)             # the ramp runs 1.5x further along each edge
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


def arc(x0, y0, x1, y1, bulge, n=16, r_end=0):
    """Points along one shallow ellipse arc from (x0,y0) to (x1,y1), bulging 'bulge' to the left of the direction of
    travel (negative = right), as a quarter-sine profile (an ellipse slice). Ends excluded."""
    dx, dy = x1 - x0, y1 - y0
    L = math.hypot(dx, dy); nx, ny = -dy / L, dx / L
    return [(x0 + dx * i / n + nx * bulge * math.sqrt(max(0, 1 - (2 * i / n - 1) ** 2)),
             y0 + dy * i / n + ny * bulge * math.sqrt(max(0, 1 - (2 * i / n - 1) ** 2)), 0) for i in range(1, n)]


def ell_pts(cx, cy, rx, ry, a0, a1, n=28):
    return [(cx + rx * math.cos(a0 + (a1 - a0) * i / n), cy + ry * math.sin(a0 + (a1 - a0) * i / n), 0) for i in range(n + 1)]


# ------------------------------------------------------------------ proposals
def museum_sides():
    """The approved museum (gable separated, beam, plinth flat, square openings, four columns) with its outer columns'
    faces swelling as one shallow ellipse arc (entasis, 1/6 line out at mid-height), and the capitals as the bevel he
    prefers: a chamfer across the overhang, its edges broken by the fine cutter."""
    x0, x1 = 7.1, 16.9
    gable = rpoly([(7.1, 8.95, FINE), (12, 7.25, MED), (16.9, 8.95, FINE), (16.9, 10.0, MED), (7.1, 10.0, MED)])
    beam_y0, beam_y1, pl_y0, pl_y1 = 11.0, 12.0, 16.0, 16.85
    bx = 7.53                                   # column face (the approved overhang, 0.43)
    sw = 0.25                                   # the swell
    pts = [(x0, beam_y0, MED), (x1, beam_y0, MED), (x1, beam_y1, FINE)]
    pts += [(24 - bx, 12.7, FINE)] + [(24 - x, y, 0) for x, y, _ in arc(bx, 12.7, bx, 15.3, -sw)] + [(24 - bx, 15.3, FINE)]
    pts += [(x1, pl_y0, FINE), (x1, pl_y1, MED), (x0, pl_y1, MED), (x0, pl_y0, FINE)]
    pts += [(bx, 15.3, FINE)] + list(reversed(arc(bx, 12.7, bx, 15.3, -sw))) + [(bx, 12.7, FINE)]
    pts += [(x0, beam_y1, FINE)]
    holes = []
    s_ = (16.47 - 7.53 - 4 * 1.25) / 3
    for i in range(3):
        sx = 7.53 + 1.25 + i * (1.25 + s_)
        holes.append(rpoly([(sx, 12.45, FINE), (sx + s_, 12.45, FINE), (sx + s_, 15.4, FINE), (sx, 15.4, FINE)]))
    return [gable, rpoly(pts)], holes


RING = dict(a=3.1, b=3.1 * 4 / 5, wall=1.5)


def bag(kind):
    """Bags from the ring (whole ellipse 4/5, wall one line, centre on the body's edge). The ring lies level (its long
    axis along the bag's top), so it reads as a carried handle, not a kettlebell's grip. Sides bow out a little (a full
    bag: the swing on the sides); the base is flat."""
    a, b, w = RING['a'], RING['b'], RING['wall']
    if kind == 'tote':
        top, l0, r0, l1, r1, base, bow = 10.6, 7.7, 16.3, 8.6, 15.4, 16.9, 0.3
        hem = None
    else:   # paper: taller, narrower, a folded hem as one cut
        top, l0, r0, l1, r1, base, bow = 10.0, 8.3, 15.7, 8.6, 15.4, 17.2, 0.2
        hem = 11.35
    ring = ell_pts(12, top, a, b, math.pi, 2 * math.pi)                     # upper half, level
    pts = [(l0, top, BROAD), (12 - a, top, MED)] + ring[1:-1] + [(12 + a, top, MED), (r0, top, BROAD)]
    pts += arc(r0, top, r1, base, -bow) + [(r1, base, BROAD), (l1, base, BROAD)] + arc(l1, base, l0, top, -bow)
    holes = [rpoly([(12 - (a - w), top + 0.01, FINE)] + ell_pts(12, top + 0.01, a - w, b - w, math.pi, 2 * math.pi)[1:-1] + [(12 + (a - w), top + 0.01, FINE)])]
    if hem:
        holes.append(rpoly([(l0 + 0.55, hem, FINE), (r0 - 0.55, hem, FINE), (r0 - 0.57, hem + 0.6, FINE), (l0 + 0.57, hem + 0.6, FINE)]))
    return [rpoly(pts)], holes


def compose(parts, holes, uid):
    if not holes:
        return ''.join(f'<path fill="{NAVY}" d="{p}"/>' for p in parts)
    m = (f'<mask id="{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>'
         + ''.join(f'<path d="{h}" fill="#000"/>' for h in holes) + '</mask>')
    return f'<defs>{m}</defs><g mask="url(#{uid})">' + ''.join(f'<path fill="{NAVY}" d="{p}"/>' for p in parts) + '</g>'


def badge(inner, px):
    """As the app draws a place: 24px circle, rim 2, field #F2EBDD; the drawings are in px at the 24px badge (rule 1),
    so they sit in it unscaled."""
    g = inner
    return svg(f'<circle cx="12" cy="12" r="11" fill="{TILE}" stroke="{NAVY}" stroke-width="2"/>{g}', px)


# ------------------------------------------------------------------ generic sets
GENERIC = {
    'Material': dict(cup='mat/local_cafe.svg', glass='mat/wine_bar.svg', museum='mat/account_balance.svg', tree='mat/park.svg', fork='mat/restaurant.svg', bag='mat/shopping_bag.svg'),
    'Phosphor': dict(cup='pho/coffee.svg', glass='pho/wine.svg', museum='pho/bank.svg', tree='pho/tree-evergreen.svg', fork='pho/fork-knife.svg', bag='pho/shopping-bag.svg'),
    'Lucide': dict(cup='lucide/coffee.svg', glass='lucide/wine.svg', museum='lucide/landmark.svg', tree='lucide/tree-pine.svg', fork='lucide/utensils.svg', bag='lucide/shopping-bag.svg'),
}
OURS = dict(cup='Café', glass='Bar', museum='Museum', tree='Nature', fork='Restaurant', bag='Shopping')
COLS = ['cup', 'glass', 'museum', 'tree', 'fork', 'bag']
# verdicts per cell: (squashed curves, machined joins); '-' = nothing to test. Read off the drawings at 8x.
VERDICT = {
    'Ours':     dict(cup='yy', glass='yy', museum='-y', tree='yy', fork='yy', bag='nn'),
    'Material': dict(cup='nn', glass='nn', museum='-n', tree='-n', fork='nn', bag='nn'),
    'Phosphor': dict(cup='nn', glass='nn', museum='-n', tree='-n', fork='nn', bag='nn'),
    'Lucide':   dict(cup='nn', glass='nn', museum='-n', tree='nn', fork='nn', bag='nn'),
}


def generic(path):
    t = open(os.path.join(GEN, path)).read()
    vb = re.search(r'viewBox="([^"]+)"', t).group(1)
    body = re.sub(r'<!--.*?-->', '', re.search(r'<svg[^>]*>(.*)</svg>', t, re.S).group(1), flags=re.S)
    if 'stroke-width' in t[:800]:
        return svg(f'<g fill="none" stroke="{NAVY}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{body}</g>', 50, vb)
    return svg(f'<g fill="{NAVY}">{body}</g>', 50, vb)


def mark(v):
    c = {'y': (MOSS, 'yes'), 'n': (DEEP, 'no'), '-': (GREY, '–')}
    return ' '.join(f'<span style="color:{c[x][0]};font-weight:700">{c[x][1]}</span>' for x in v)


def gen_table():
    head = ''.join(f'<th style="font-size:14px;font-weight:700;color:{GREY};text-transform:uppercase;letter-spacing:.06em;padding:0 4px 6px">{c}</th>' for c in COLS)
    rows = ''
    for name in ['Ours', 'Material', 'Phosphor', 'Lucide']:
        cells = ''
        for c in COLS:
            ic = svg(solid(D[OURS[c]]), 50, '3.4 3.4 17.2 17.2') if name == 'Ours' else generic(GENERIC[name][c])
            cells += (f'<td style="padding:4px 6px;text-align:center;vertical-align:top"><div style="display:inline-block;background:#fff;border:1px solid {RULE};padding:3px">{ic}</div>'
                      f'<div style="font-size:14px;margin-top:2px">{mark(VERDICT[name][c])}</div></td>')
        rows += f'<tr><td style="font-size:16px;font-weight:700;color:{NAVY};padding-right:8px">{name}</td>{cells}</tr>'
    return f'<table style="border-collapse:collapse"><tr><th></th>{head}</tr>{rows}</table>'


# ------------------------------------------------------------------ joins with ghost cutters (approved drawings, unchanged)
def ghost(cx, cy, r, c=ORANGE):
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{c}" stroke-width="0.035" stroke-dasharray="0.09 0.06"/>'
            f'<circle cx="{cx}" cy="{cy}" r="0.04" fill="{c}"/>')


JOINS = [
    ('Museum', (6.75, 11.6, 1.6), ghost(7.29, 11.85, FINE) + ghost(7.38, 12.85, FINE), 'museum capital', 'chamfer across the step, edges broken by the fine cutter', True),
    ('Bar', (10.2, 12.2, 1.6), ghost(10.78, 13.25, BROAD), 'bar: stem into bowl', 'broad fillet into a curved face', True),
    ('Restaurant', (8.75, 11.5, 1.6), ghost(9.15, 12.5, BROAD), 'fork neck', 'broad fillet into a curved face', True),
    ('Nature', (10.25, 14.9, 1.6), ghost(10.95, 15.87, 0.42), 'tree trunk', '0.42 today: snaps to broad (the tier droops)', False),
    ('Hotel', (15.6, 13.8, 1.6), ghost(16.12, 14.72, 0.38), 'bed leg', '0.38 today: snaps to medium (a flat face)', False),
]


def join_cell(k, vb, g, title, note, ok):
    x, y, w = vb
    return (f'<div style="width:150px"><div style="background:#fff;border:1px solid {RULE}">{svg(solid(D[k]) + g, 148, f"{x} {y} {w} {w}")}</div>'
            f'<div style="font-size:15px;font-weight:700;color:{NAVY};margin-top:4px">{title}</div>'
            f'<div style="font-size:14px;line-height:1.3;color:{MOSS if ok else DEEP}">{note}</div></div>')


tools = ''.join(f'<div style="display:flex;flex-direction:column;align-items:center;gap:4px">{svg(f"<circle cx=\"12\" cy=\"12\" r=\"{r * 10}\" fill=\"none\" stroke=\"{ORANGE}\" stroke-width=\"0.35\" stroke-dasharray=\"0.9 0.6\"/>", 64, "0 0 24 24")}'
                f'<div style="font-size:15px;font-weight:700;color:{NAVY}">{n} {r}</div><div style="font-size:14px;color:{GREY};text-align:center;width:120px">{u}</div></div>'
                for n, r, u in [('fine', FINE, 'inside corners; breaks a chamfer\'s edges'), ('medium', MED, 'line ends, tips, a post into a flat face'), ('broad', BROAD, 'mass corners, a post into a curved face')])


# ------------------------------------------------------------------ the finished row
mp, mh = museum_sides()
tp, th = bag('tote')
pp, ph = bag('paper')
MUSEUM_NEW = compose(mp, mh, 'mn')
TOTE = compose(tp, th, 'bt')
PAPER_ = compose(pp, ph, 'bp')


def fin_cell(inner, uid_inner, title, note, approved=True):
    big = badge(inner, 96)
    small = badge(inner.replace(f'id="{uid_inner}"', f'id="{uid_inner}s"').replace(f'url(#{uid_inner})', f'url(#{uid_inner}s)'), 24) if uid_inner else badge(inner, 24)
    return (f'<div style="display:flex;flex-direction:column;align-items:center;width:132px">{big}'
            f'<div style="margin-top:6px">{small}</div>'
            f'<div style="font-size:15px;font-weight:700;color:{NAVY if approved else DEEP};margin-top:4px;text-align:center">{title}</div>'
            f'<div style="font-size:14px;line-height:1.3;color:{GREY};text-align:center">{note}</div></div>')


row = ''.join(fin_cell(solid(D[k]), None, n, 'approved') for k, n in [('Café', 'Café'), ('Bar', 'Bar'), ('Museum', 'Museum'), ('Nature', 'Nature')])
row += f'<div style="width:2px;align-self:stretch;background:{RULE}"></div>'
row += fin_cell(MUSEUM_NEW, 'mn', 'Museum, sides', 'proposal: the outer columns swell; capitals stay the bevel', False)
row += fin_cell(TOTE, 'bt', 'Bag A, tote', 'proposal: level ring, sides bow, flat base', False)
row += fin_cell(PAPER_, 'bp', 'Bag B, paper', 'proposal: taller, a folded hem cut', False)


def constr(parts, holes, uid, extra):
    return f'<div style="background:#fff;border:1px solid {RULE}">{svg(compose(parts, holes, uid) + extra, 150, "5 5 14 14")}</div>'


ring_ghost = (f'<ellipse cx="12" cy="10.6" rx="{RING["a"]}" ry="{f(RING["b"])}" fill="none" stroke="{ORANGE}" stroke-width="0.07" stroke-dasharray="0.25 0.18"/>'
              f'<ellipse cx="12" cy="10.6" rx="{RING["a"] - 1.5}" ry="{f(RING["b"] - 1.5)}" fill="none" stroke="{ORANGE}" stroke-width="0.07" stroke-dasharray="0.25 0.18"/>')
side_ghost = (f'<path d="M7.53,12.7 L7.53,15.3 M16.47,12.7 L16.47,15.3" stroke="{ORANGE}" stroke-width="0.07" stroke-dasharray="0.25 0.18"/>'
              + ghost(7.38, 12.85, FINE) + ghost(7.38, 15.15, FINE))
CONSTR = (f'<div style="display:flex;gap:14px;align-items:flex-start">'
          + f'<div>{constr(mp, mh, "mc", side_ghost)}<div style="font-size:14px;color:{GREY};width:150px;margin-top:4px">museum: straight face ghosted; the swell is 1/6 line; fine cutters on the bevel</div></div>'
          + f'<div>{constr(tp, th, "tc", ring_ghost)}<div style="font-size:14px;color:{GREY};width:150px;margin-top:4px">bag: the ring, level, centre on the top edge; medium fillets where it carries</div></div>'
          + '</div>')

# ------------------------------------------------------------------ type helpers and layout
def kicker(t): return f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">{t}</div>'
def label(t, top=30): return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 12px">{t}</div>'
def p(t, size=17, color=INK, m='0 0 8px'): return f'<p style="margin:{m};font-size:{size}px;line-height:1.4;color:{color}">{t}</p>'


SIG = (f'<div style="border-top:4px solid {ORANGE};padding-top:12px;margin-top:20px;display:grid;grid-template-columns:560px 1fr;gap:36px;align-items:start">'
       f'<div><div style="font-size:30px;font-weight:700;color:{NAVY}">Weight</div>'
       + p('Triplet\'s objects are heavy things, set down and carried. Two yes/no tests show it:', 18, INK, '6px 0 10px')
       + f'<div style="font-size:20px;line-height:1.35;color:{NAVY};font-weight:600">1 · Squashed. No curve is a circle: every curve is cut from an ellipse 4/5 or flatter, as if a round had settled under weight.</div>'
       + f'<div style="font-size:20px;line-height:1.35;color:{NAVY};font-weight:600;margin-top:8px">2 · Machined where it carries. Wherever one part holds another, the join is cut by a tool (a chamfer across a step, or a fillet), never a plain corner.</div>'
       + p('Passes all six (the museum and the star and + have no curves, so test 1 is empty for them). Fails Material, Phosphor and Lucide on every object we could test (right). Apple\'s SF Symbols can\'t be redistributed, so not shown; by eye they fail both on the cup and the wine glass (round bowls, plain stems).', 16, GREY, '10px 0 6px')
       + p('<b>Reads at</b> 24 and 72: a flattened bowl and a cut join show at 24 on 2x/3x. At 12 the shadow (a given) carries the icon.', 16)
       + p('Today\'s bag fails both: its handle is nearly a circle (0.94) and stands on a ledge, so nothing carries.', 16, DEEP)
       + f'</div><div>{gen_table()}<div style="font-size:14px;color:{GREY};margin-top:6px">Each cell: squashed curves, machined joins. – = nothing to test.</div></div></div>')

JOIN = (label('The machined rule (replaces the bracket)', 32)
        + f'<div style="display:grid;grid-template-columns:560px 1fr;gap:36px;align-items:start"><div>'
        + p('<b>Three cutters</b>, each double the last; every round is the radius of the tool that cut it. Outside rounder than inside; never more than 1/5 of the shorter edge (the rounds table, re-derived).', 17)
        + p('<b>Continuous curvature.</b> Every round ramps in from the straight (Apple\'s continuous corner: the curve starts 1.5x the radius back along each edge), never a circle meeting a line. The engine\'s fairing already does this; it becomes the rule for every round.', 17)
        + p('<b>Thin into thick, by join type.</b> A post under an overhang: a <b>chamfer</b> across the step, its two edges broken by the fine cutter (the museum\'s bevel you prefer). A post into a curved face: the <b>broad</b> fillet (the bar\'s stem, the fork\'s neck, as approved). A post into a flat face: the <b>medium</b> fillet (the bed). No added flare shapes.', 17)
        + f'<div style="display:flex;gap:18px;margin-top:10px">{tools}</div>'
        + f'</div><div><div style="display:flex;gap:12px;flex-wrap:wrap">{"".join(join_cell(*j) for j in JOINS)}</div>'
        + p('Approved joins at 50px a unit, unchanged, with the cutter that would cut each drawn as a ghost. The bevel, the bar and the fork already come out of the rule; the tree and the bed snap to the nearest cutter.', 15, GREY, '8px 0 0')
        + '</div></div>')

FIN = (label('Finished, in the badge, at 72 and true size 24 (proposals in orange type)', 32)
       + f'<div style="display:flex;justify-content:space-between;align-items:flex-start">{row}</div>'
       + f'<div style="display:grid;grid-template-columns:1fr 340px;gap:36px;margin-top:16px;align-items:start"><div>'
       + p('<b>The museum\'s swing is on the sides</b> ("what about the sides?"): the outer columns swell as one shallow ellipse arc, the way a Greek column swells (entasis). Base flat and grounded, gable separated, openings square; not the v220 foot sweep (it swells in the middle, not out at the foot), not a rounded base or lintel.', 16)
       + p('<b>The bag:</b> the ring now lies level along the top, so it reads as a carried handle, not a kettlebell\'s grip; the sides bow a little (a full bag) and the base is flat. A blind "what is this?" read still has to be done by someone who hasn\'t seen it.', 16)
       + p('Hand-built from root shapes and the three cutters, not engine output.', 15, GREY)
       + f'</div>{CONSTR}</div>')

GIVENS = (label('Givens (the bar every icon clears, not signatures)', 30)
          + p('<b>The shadow:</b> fill every cut and the side-on silhouette still names it (the 12px test). <b>The press:</b> the three cutters above. <b>A handle is a ring:</b> one whole ellipse 4/5, its hole the same ellipse shortened by one line, centre on the body\'s edge; the cup\'s ear already is it.', 16))

HOW = (label('How we got here', 28)
       + p('A real random draw (saddlery, enamel signs, signwriting, carousel carving; kites, tailoring, knots before) and the director\'s test: a signature must fail Material, Phosphor and Lucide. Only two things separated us from them at 24px: the shape of the curves and how parts join. Weight is the idea behind both; your "only ellipses no circles" note turned out to be one of its two tests.', 16))

QS = ['Weight, shown by two tests (squashed curves; machined where it carries): is that the signature?',
      'The museum\'s sides: does the swell read as part of the building, or would you push it further or drop it?',
      'Bag A (tote) or B (paper)? Or neither yet?']
qhtml = ''.join(f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:8px 0;border-top:1px solid {RULE}">'
                f'<div style="font-size:24px;font-weight:700;color:{ORANGE}">{i + 1}</div><div style="font-size:19px;line-height:1.4;color:{NAVY}">{q}</div></div>'
                for i, q in enumerate(QS))

body = (kicker('Grid concepts · Brand signatures · round 3 · 10-26')
        + f'<h1 style="margin:6px 0 12px;font-size:38px;line-height:1.1;color:{NAVY}">Brand signatures</h1>'
        + f'<div style="font-size:28px;line-height:1.3;color:{NAVY};font-weight:700">One signature: <span style="color:{ORANGE}">weight</span>. Curves have settled; joins are machined where they carry.</div>'
        + SIG + JOIN + FIN + GIVENS + HOW + label('Waiting on you', 26) + qhtml)

html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Brand signatures</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONT}
<style>
body{{margin:0}}
</style>
</helmet>
<div style="width:{W}px;box-sizing:border-box;padding:36px 40px 40px;background:{PAPER};font-family:Archivo,Arial,sans-serif;color:{INK}">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{W},"height":{PREVIEW_H}}}}}'>
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''
open(os.path.join(OUT, 'Grid7Signatures.dc.html'), 'w', encoding='utf-8').write(html)
print('wrote', os.path.join(OUT, 'Grid7Signatures.dc.html'), len(html))
