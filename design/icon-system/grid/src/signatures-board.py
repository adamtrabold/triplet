#!/usr/bin/env python3
"""The "Brand signatures" board (Grid concepts page), round 2 (2026-10-26, after director turn 173 and his three comments).

Owner: "come up with 1-3 core brand visual signatures that we can apply as a filter on decisions". Then, on v256:
"this is a really awkwardly shaped flare. all joints should feel architecturally sound"; "there is probably a creative
place to add swoops to all objects."; and on handles: "what's the underlying shape that a handle is that we can make a
good rule about".

The approved six and the fork and knife are copied from the live Now board, never redrawn. The museum and bag
proposals and the bracket diagrams are drawn here by hand from root shapes (proposals, not engine output).

  python3 -I src/signatures-board.py <live Grid7Now.dc.html> <out dir>   -> <out dir>/Grid7Signatures.dc.html
Then measure the root div in Chromium and set the frame height and $preview (PREVIEW_H below) to it.
"""
import math, os, re, sys

NOW, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
PREVIEW_H = 2394

NAVY, ORANGE, DEEP, GREY, RULE, PAPER, TILE, INK = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#F2EBDD', '#1A1A18'
MOSS = '#547326'
W = 1600
FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">'

# ------------------------------------------------------------------ icon paths, copied from the live Now board (72px row)
s = open(NOW, encoding='utf-8').read()
D = {}
for svg in re.findall(r'<svg width="72"[^>]*>.*?</svg>', s, re.S):
    name = re.search(r'aria-label="([^"]+)"', svg).group(1)
    D[name] = re.search(r' d="([^"]+)"', svg).group(1)
assert len(D) == 9, D.keys()


def solid(d, fill=NAVY):
    return f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/>'


def shadow(d, fill=NAVY):
    """Every subpath filled on its own: the cuts close, only the silhouette is left."""
    return ''.join(f'<path fill="{fill}" d="M{p.strip()}"/>' for p in d.split('M') if p.strip())


def svg(inner, px, vb='0 0 24 24', bg=None):
    style = f'display:block;background:{bg}' if bg else 'display:block'
    return f'<svg width="{px}" height="{px}" viewBox="{vb}" aria-hidden="true" style="{style}">{inner}</svg>'


# ------------------------------------------------------------------ geometry helpers for the proposals (24-unit space)
K = 0.5523


def f(v): return f'{v:.3f}'.rstrip('0').rstrip('.')


def bracket(px, py, dx, dy, run, rise):
    """The bracket: one quarter ellipse filling the concave corner at (px,py). The heavier face runs along x (dx = the
    side the bracket runs out to), the lighter part's face along y (dy = the side it rises up). Tangent to both."""
    x1, y2 = px + dx * run, py + dy * rise
    return (f'M{f(px)},{f(py)} L{f(x1)},{f(py)} C{f(px + dx * run * (1 - K))},{f(py)} {f(px)},{f(py + dy * rise * (1 - K))} '
            f'{f(px)},{f(y2)} Z')


def rrect(x0, y0, x1, y1, r):
    return (f'M{f(x0 + r)},{f(y0)} H{f(x1 - r)} Q{f(x1)},{f(y0)} {f(x1)},{f(y0 + r)} V{f(y1 - r)} Q{f(x1)},{f(y1)} {f(x1 - r)},{f(y1)} '
            f'H{f(x0 + r)} Q{f(x0)},{f(y1)} {f(x0)},{f(y1 - r)} V{f(y0 + r)} Q{f(x0)},{f(y0)} {f(x0 + r)},{f(y0)} Z')


def arc_pts(x0, x1, yend, ymid, n=40):
    """A shallow ellipse arc (one root) from (x0,yend) to (x1,yend) through (mid, ymid): y = yend + (ymid-yend)*sqrt(1-t^2)
    scaled so the ends meet the chord at the ellipse's flat cut (a cap)."""
    cx, a = (x0 + x1) / 2, (x1 - x0) / 2
    A = a * 1.155                     # the cap's 7/6 (2/sqrt3) cut: the arc is the crown of a wider ellipse
    B = (ymid - yend) / (1 - math.sqrt(1 - (a / A) ** 2))
    pts = []
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        t = (x - cx) / A
        pts.append((x, ymid - B + B * math.sqrt(1 - t * t)))
    return pts


def poly(pts):
    return 'M' + ' L'.join(f'{f(x)},{f(y)}' for x, y in pts) + ' Z'


def ellipse_half(cx, cy, a, b, up=True, n=48):
    """Half an ellipse (b vertical half-axis), above (up) the line y=cy, as a closed polygon with its chord."""
    pts = [(cx + b * math.cos(math.pi * i / n) * 1.0 if False else cx + a * math.cos(math.pi * i / n),
            cy - (b if up else -b) * math.sin(math.pi * i / n)) for i in range(n + 1)]
    return poly(pts)


# ------------------------------------------------------------------ proposals
RUN, RISE = 2 / 5, 1 / 2            # the bracket, as shares of the lighter part's width


def museum(variant):
    """The approved museum's proportions; capitals as brackets; variant 'lintel' (the beam arches, the gable rides it on
    one even cut) or 'plinth' (the plinth's underside is a cap). Openings stay square; the gable stays separated."""
    col, x0, x1 = 1.2, 7.1, 16.9
    run, rise = RUN * col, RISE * col
    bx0, bx1 = 7.9, 16.1                       # column block: the beam overhangs by run + its corner round
    out, holes = [], []
    if variant == 'lintel':
        g = arc_pts(x0, x1, 9.85, 9.3)
        gable = [(x0, 8.95), (x0 + 0.25, 8.72), (11.75, 7.25), (12.25, 7.25), (x1 - 0.25, 8.72), (x1, 8.95)] + list(reversed(g))
        out.append(poly(gable))
        b = arc_pts(x0, x1, 10.85, 10.3)
        out.append(poly(b + [(x1, 11.75), (x1 - 0.25, 12.0), (x0 + 0.25, 12.0), (x0, 11.75)]))
        plinth = rrect(x0, 15.85, x1, 16.85, 0.3)
        out.append(plinth)
    else:
        gable = [(x0, 8.95), (x0 + 0.25, 8.72), (11.75, 7.25), (12.25, 7.25), (x1 - 0.25, 8.72), (x1, 8.95), (x1, 9.7),
                 (x1 - 0.3, 10.0), (x0 + 0.3, 10.0), (x0, 9.7)]
        out.append(poly(gable))
        out.append(rrect(x0, 11.0, x1, 12.0, 0.3))
        p = arc_pts(x0, x1, 16.45, 17.0)
        out.append(poly([(x0, 16.15), (x0 + 0.3, 15.85), (x1 - 0.3, 15.85), (x1, 16.15)] + list(reversed(p))))
    out.append(f'M{bx0},11.9 H{bx1} V15.95 H{bx0} Z')
    s_ = (bx1 - bx0 - 4 * col) / 3
    for i in range(3):
        sx = bx0 + col + i * (col + s_)
        holes.append(rrect(sx, 12.45, sx + s_, 15.4, 0.15))
    out += [bracket(bx0, 12.0, -1, 1, run, rise), bracket(bx1, 12.0, 1, 1, run, rise),
            bracket(bx0, 15.85, -1, -1, run, rise), bracket(bx1, 15.85, 1, -1, run, rise)]
    return out, holes


RING = dict(a=3.1, b=3.1 * 4 / 5, wall=1.5)   # the handle's root: a whole ellipse 4/5, wall one line, sized to a hand


def bag():
    """The bag built from the ring: the ring's long axis points out of the body (up), its centre on the body's top edge,
    so half shows; its hole = the ring's ellipse with both radii shortened by the wall; brackets where it carries the
    body. The body is a mass whose underside is a cap (its swing: a full bag sags)."""
    a, b, w = RING['a'], RING['b'], RING['wall']
    top, cx = 9.6, 12.0
    out, holes = [], []
    # ring (long axis vertical: half-height a above the edge, half-width b)
    out.append(f'M{f(cx - b)},{f(top)} A{f(b)} {f(a)} 0 1 1 {f(cx + b)},{f(top)} A{f(b)} {f(a)} 0 1 1 {f(cx - b)},{f(top)} Z')
    holes.append(ellipse_half(cx, top + 0.01, b - w, a - w))
    # body: top 7.9..16.1, sides in to 8.45/15.55, underside a cap
    cap = arc_pts(8.45, 15.55, 16.15, 16.95)
    r = [(7.9 + 0.6 * (1 - math.cos(t * math.pi / 2)), top + 0.6 * (1 - math.sin(t * math.pi / 2))) for t in [i / 8 for i in range(9)]]
    body = [(16.1 - (x - 7.9), y) for x, y in reversed(r)][::-1]
    body = list(reversed([(16.1 - (x - 7.9), y) for x, y in r])) + [(15.62, 15.75), (15.55, 16.15)] + list(reversed(cap))[1:-1] + \
           [(8.45, 16.15), (8.38, 15.75)] + r
    out.append(poly(body))
    run, rise = RUN * w, RISE * w
    out += [bracket(cx - b, top, -1, -1, run, rise), bracket(cx + b, top, 1, -1, run, rise)]
    return out, holes


def compose(parts, holes, px, vb='0 0 24 24', fill=NAVY, uid='m'):
    if holes:
        mask = (f'<mask id="{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>'
                + ''.join(f'<path d="{h}" fill="#000"/>' for h in holes) + '</mask>')
        body = f'<defs>{mask}</defs><g mask="url(#{uid})">' + ''.join(f'<path fill="{fill}" stroke="{fill}" stroke-width="0.03" d="{p}"/>' for p in parts) + '</g>'
    else:
        body = ''.join(f'<path fill="{fill}" stroke="{fill}" stroke-width="0.03" d="{p}"/>' for p in parts)
    return svg(body, px, vb)


# ------------------------------------------------------------------ marks
def swing_mark(d): return f'<path d="{d}" fill="none" stroke="{ORANGE}" stroke-width="0.42" stroke-linecap="round"/>'
def ring_mark(cx, cy, r=0.75, c=DEEP): return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{c}" stroke-width="0.2"/>'


def quad(x0, y0, xm, ym, x1, y1):
    cx, cy = 2 * xm - (x0 + x1) / 2, 2 * ym - (y0 + y1) / 2
    return f'M{x0},{y0} Q{cx:.3f},{cy:.3f} {x1},{y1}'


SWING = {
    'Café': quad(6.7, 16.25, 12, 17.0, 17.3, 16.25),
    'Bar': 'M6.55,9.1 C6.65,11.35 8.6,12.8 10.9,13.25',
    'Nature': quad(10.7, 12.1, 9.4, 14.0, 7.95, 15.05),
    'Restaurant': 'M14.5,6.2 C16.0,6.85 16.7,9.4 16.8,12.0',
    'Hotel': quad(8.7, 9.2, 11.15, 7.85, 13.7, 9.2),
}

# ------------------------------------------------------------------ type helpers
def kicker(t): return f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">{t}</div>'
def label(t, top=30): return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 12px">{t}</div>'
def p(t, size=18, color=INK, m='0 0 8px'): return f'<p style="margin:{m};font-size:{size}px;line-height:1.4;color:{color}">{t}</p>'
def cap(t, c=GREY): return f'<div style="font-size:15px;line-height:1.3;color:{c};margin-top:6px;text-align:center">{t}</div>'
def tile(inner, pad=6): return f'<div style="background:#fff;border:1px solid {RULE};padding:{pad}px">{inner}</div>'


ORDER = [('Café', 'Café'), ('Bar', 'Bar'), ('Museum', 'Museum'), ('Nature', 'Nature'), ('Star', 'Star'), ('Add', 'The +'),
         ('Restaurant', 'Fork'), ('Hotel', 'Bed'), ('Shopping', 'Bag')]

# ---- signature 1: the shadow
shadow_row = ''.join(
    f'<div style="display:flex;flex-direction:column;align-items:center;gap:6px">'
    f'{tile(svg(shadow(D[k]), 60, "3.4 3.4 17.2 17.2"), 4)}'
    f'<div style="display:flex;gap:8px;align-items:center">{svg(shadow(D[k]), 24)}{svg(shadow(D[k]), 12)}</div>'
    f'<div style="font-size:15px;color:{DEEP if k == "Shopping" else GREY};font-weight:{700 if k == "Shopping" else 400}">{n}{" ✗" if k == "Shopping" else ""}</div></div>'
    for k, n in ORDER)

# ---- signature 1: weight
def rest_mark(x0, x1, y): return f'<path d="M{x0},{y} H{x1}" stroke="{MOSS}" stroke-width="0.34" stroke-linecap="round" stroke-dasharray="0.01 0.62"/>'


WEIGHT = {   # where each object's weight goes, read off the live drawings: rests (a cut under a loose part), carried (a
             # bracket where a lighter part holds a heavier one), gives (a sag or droop)
    'Café': (rest_mark(9.2, 14.6, 14.45) + swing_mark(SWING['Café']), 'rests, gives'),
    'Bar': (rest_mark(9.4, 14.6, 9.97) + ring_mark(11.3, 13.0) + ring_mark(12.7, 15.2), 'drink rests; carried'),
    'Museum': (rest_mark(7.8, 16.2, 10.5) + ring_mark(7.4, 12.4), 'gable rests; carried'),
    'Nature': (swing_mark(SWING['Nature']) + ring_mark(11.45, 15.75), 'gives; carried'),
    'Star': ('', 'a mark: weightless'),
    'Add': ('', 'a mark: weightless'),
    'Restaurant': (ring_mark(11.05, 12.55) + ring_mark(15.45, 12.65), 'carried'),
    'Hotel': (rest_mark(9.4, 13.1, 11.15) + ring_mark(16.5, 14.75), 'pillow rests; carried'),
    'Shopping': ('', 'nothing: it stands on a ledge'),
}


def weight_cell(k):
    m, note = WEIGHT[k]
    bad = k == 'Shopping'
    return (f'<div style="display:flex;flex-direction:column;align-items:center;width:100px">'
            f'{tile(svg(solid(D[k]) + m, 86, "3.4 3.4 17.2 17.2"), 3)}'
            f'<div style="font-size:15px;color:{DEEP if bad else GREY};margin-top:4px;text-align:center;line-height:1.3">{note}</div></div>')


weight_row = ''.join(weight_cell(k) for k, _ in ORDER)
weight_legend = (f'<div style="display:flex;gap:22px;font-size:15px;color:{GREY};margin-top:10px">'
                 f'<span><svg width="30" height="10" viewBox="0 0 3 1"><path d="M0.3,0.5 H2.7" stroke="{MOSS}" stroke-width="0.34" stroke-linecap="round" stroke-dasharray="0.01 0.62"/></svg> rests</span>'
                 f'<span><svg width="14" height="14" viewBox="0 0 2 2"><circle cx="1" cy="1" r="0.75" fill="none" stroke="{DEEP}" stroke-width="0.2"/></svg> carried</span>'
                 f'<span><svg width="30" height="10" viewBox="0 0 3 1"><path d="M0.3,0.3 Q1.5,1 2.7,0.3" fill="none" stroke="{ORANGE}" stroke-width="0.3" stroke-linecap="round"/></svg> gives</span></div>')


def sig_card(name, test, his, reads, out, visual):
    row = lambda k, v: (f'<div style="display:grid;grid-template-columns:120px 1fr;gap:12px;margin-top:8px">'
                        f'<div style="font-size:14px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;padding-top:2px">{k}</div>'
                        f'<div style="font-size:17px;line-height:1.4">{v}</div></div>')
    return (f'<div style="border-top:4px solid {ORANGE};padding-top:12px;margin-top:22px">'
            f'<div style="display:grid;grid-template-columns:520px 1fr;gap:36px;align-items:start">'
            f'<div><div style="font-size:30px;font-weight:700;color:{NAVY}">{name}</div>'
            f'<div style="font-size:20px;line-height:1.35;color:{NAVY};font-weight:600;margin-top:6px">{test}</div>'
            + row('From', his) + row('Reads at', reads) + row('Rules out', out) +
            f'</div><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px">{visual}</div></div></div>')


SIG1 = sig_card(
    'The shadow',
    'Fill every cut. Does the side-on silhouette alone still name the thing, like a sign symbol seen from the road?',
    '"travel signs": dead side-on, one solid, detail only as cuts.',
    '12px: it is the chip-size test (true size under each).',
    'Three-quarter and top views; lines drawn inside a solid; silhouettes that need their cuts. Today\'s bag: its shadow is a padlock\'s.',
    shadow_row)

SIG2 = sig_card(
    'Weight',
    'Can you point to where its weight goes? Every object shows it at least once: it rests on something across a one-line cut, it is carried on a bracket, or it gives (sags, droops). Marks weigh nothing.',
    'Not your words; what they share. The cup set down on its saucer, the gable lowered onto its beam, the stem carrying the bowl, branches heavy at the tips: tactility and whimsy as weight you can see.',
    '24px: the cuts and the droop. At 12 the shadow carries the icon.',
    'Floating objects; parts glued flat with no cut, bracket or give; a mark with a ground. Today\'s bag: its handle stands on a ledge.',
    f'<div><div style="display:flex;justify-content:space-between;gap:4px">{weight_row}</div>{weight_legend}</div>')

# ---- the givens: bracket rule
U = 20
def diag(body, w, h, vb): return f'<svg width="{w*U}" height="{h*U}" viewBox="{vb}" aria-hidden="true" style="display:block">{body}</svg>'


post = 1.25
br_do = (f'<path fill="{NAVY}" d="{rrect(0, 0, 7, 1.5, 0.3)}"/><path fill="{NAVY}" d="M2.875,1.4 H4.125 V5.2 H2.875 Z"/>'
         f'<path fill="{NAVY}" d="{bracket(2.875, 1.5, -1, 1, RUN*post, RISE*post)}"/><path fill="{NAVY}" d="{bracket(4.125, 1.5, 1, 1, RUN*post, RISE*post)}"/>')
br_drip = (f'<path fill="{NAVY}" d="{rrect(0, 0, 7, 1.5, 0.3)}"/><path fill="{NAVY}" d="M2.875,1.4 H4.125 V5.2 H2.875 Z"/>'
           f'<path fill="{NAVY}" d="{bracket(2.875, 1.5, -1, 1, 1.15, 0.7)}"/><path fill="{NAVY}" d="{bracket(4.125, 1.5, 1, 1, 1.15, 0.7)}"/>')
br_bevel = (f'<path fill="{NAVY}" d="{rrect(0, 0, 7, 1.5, 0.3)}"/><path fill="{NAVY}" d="M2.875,1.4 H4.125 V5.2 H2.875 Z"/>'
            f'<path fill="{NAVY}" d="M2.875,1.5 L2.375,1.5 L2.875,2.3 Z M4.125,1.5 L4.625,1.5 L4.125,2.3 Z"/>')
br_round = (f'<path fill="{NAVY}" d="{rrect(0, 0, 7, 1.5, 0.3)}"/><path fill="{NAVY}" d="M2.875,1.4 H4.125 V5.2 H2.875 Z"/>'
            f'<path fill="{NAVY}" d="{bracket(2.875, 1.5, -1, 1, 0.3, 0.3)}"/><path fill="{NAVY}" d="{bracket(4.125, 1.5, 1, 1, 0.3, 0.3)}"/>')


def dd(svg_, word, cap_, ok):
    return (f'<div style="display:flex;flex-direction:column;gap:4px"><div>{svg_}</div>'
            f'<div style="font-size:15px;font-weight:700;color:{MOSS if ok else DEEP}">{word}</div>'
            f'<div style="font-size:15px;line-height:1.3;color:{GREY}">{cap_}</div></div>')


dodont = (f'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;background:{TILE};padding:14px 16px">'
          + dd(diag(br_do, 7, 5.2, '0 0 7 5.2'), 'Do', 'a bracket: run 2/5, rise 1/2 of the post', True)
          + dd(diag(br_drip, 7, 5.2, '0 0 7 5.2'), 'Not', 'a drip: wider than tall', False)
          + dd(diag(br_bevel, 7, 5.2, '0 0 7 5.2'), 'Not', 'a bevel: a pinch', False)
          + dd(diag(br_round, 7, 5.2, '0 0 7 5.2'), 'Not', 'a plain round', False) + '</div>')

JOINS = [('Bar', 10.2, 12.1, 2.6, 'bar: stem into bowl', True), ('Bar', 10.2, 14.3, 2.6, 'bar: stem into foot', True),
         ('Restaurant', 8.8, 11.5, 2.6, 'fork: neck', True), ('Nature', 10.1, 14.7, 2.6, 'tree: trunk (0.1 short)', True),
         ('Museum', 6.6, 11.5, 2.6, 'museum: a bevel', False), ('Hotel', 15.4, 13.7, 2.6, 'bed: a plain round', False)]
joins = ''.join(f'<div style="display:flex;flex-direction:column;align-items:center">{tile(svg(solid(D[k]), 108, f"{x} {y} {w} {w}"), 0)}'
                f'<div style="font-size:15px;line-height:1.3;color:{MOSS if ok else DEEP};margin-top:4px;text-align:center;width:112px">{c}</div></div>'
                for k, x, y, w, c, ok in JOINS)
mp, mh = museum('lintel')
joins += (f'<div style="display:flex;flex-direction:column;align-items:center">{tile(compose(mp, mh, 108, "6.6 11.5 2.6 2.6", uid="mj"), 0)}'
          f'<div style="font-size:15px;line-height:1.3;color:{MOSS};margin-top:4px;text-align:center;width:112px">museum, proposed</div></div>')

GIVENS = (label('Givens, not signatures: what every joint and corner does', 34)
          + f'<div style="display:grid;grid-template-columns:520px 1fr;gap:36px;align-items:start">'
          f'<div><div style="font-size:26px;font-weight:700;color:{NAVY}">The bracket (was "the flare")</div>'
          + p('Where a lighter part carries a heavier one, it lands on one quarter ellipse tangent to both: run 2/5, rise 1/2 of the lighter part (0.5 by 0.63 on a 1.25 post), taller than wide, in every icon; on a curved face, measured along it. Only in a concave corner that carries load: never a convex corner, a straight side, equal parts or a mark. An overhang passes the post by the run plus its corner, so the bracket lands on flat.', 17, INK, '6px 0 8px')
          + p('<b>The press</b> stays the rounds table (rule 17): every corner soft, outside rounder than inside.', 17)
          + p('A given, not a signature: half a pixel at 24 on 1x; it reads at 72 and on 2x/3x.', 17, GREY)
          + f'</div><div>{dodont}<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">{joins}</div>'
          + p('The real joins at 40px a unit. The bar and the fork already are brackets; the tree is 0.1 short; the museum\'s outer capitals (a bevel) and the bed (plain rounds) are not.', 15, GREY, '8px 0 0')
          + '</div></div>')

# ---- every object swings: museum + bag proposals
m1p, m1h = museum('lintel')
m2p, m2h = museum('plinth')
bp, bh = bag()


def prop_cell(parts, holes, title, note, uid, mark=''):
    big = compose(parts, holes, 124, '3.4 3.4 17.2 17.2', uid=uid + 'b')
    if mark:
        big = big.replace('</svg>', mark + '</svg>')
    return (f'<div style="display:flex;flex-direction:column;align-items:center;width:170px">{tile(big, 4)}'
            f'<div style="display:flex;gap:8px;align-items:center;margin-top:6px">{compose(parts, holes, 24, uid=uid + "t")}{compose(parts, holes, 12, uid=uid + "s")}</div>'
            f'<div style="font-size:17px;font-weight:700;color:{NAVY};margin-top:4px">{title}</div>'
            f'<div style="font-size:15px;line-height:1.3;color:{GREY};text-align:center">{note}</div></div>')


def now_cell(k, title, note):
    return (f'<div style="display:flex;flex-direction:column;align-items:center;width:150px">{tile(svg(solid(D[k]), 124, "3.4 3.4 17.2 17.2"), 4)}'
            f'<div style="display:flex;gap:8px;align-items:center;margin-top:6px">{svg(solid(D[k]), 24)}{svg(solid(D[k]), 12)}</div>'
            f'<div style="font-size:17px;font-weight:700;color:{GREY};margin-top:4px">{title}</div>'
            f'<div style="font-size:15px;line-height:1.3;color:{GREY};text-align:center">{note}</div></div>')


lintel_mark = swing_mark('M7.3,10.35 Q12,9.25 16.7,10.35')
plinth_mark = swing_mark('M7.4,17.25 Q12,17.95 16.6,17.25')
bag_mark = swing_mark('M8.6,17.0 Q12,17.85 15.4,17.0')
SWINGS = ''

# ---- the handle's root
a, b, w = RING['a'], RING['b'], RING['wall']
cup_ring = (f'<ellipse cx="13.95" cy="10.4" rx="{a}" ry="{f(b)}" fill="none" stroke="{ORANGE}" stroke-width="0.12" stroke-dasharray="0.35 0.25"/>'
            f'<ellipse cx="13.95" cy="10.4" rx="{a - w}" ry="{f(b - w)}" fill="none" stroke="{ORANGE}" stroke-width="0.12" stroke-dasharray="0.35 0.25"/>')
bag_ring = (f'<ellipse cx="12" cy="9.6" rx="{f(b)}" ry="{a}" fill="none" stroke="{ORANGE}" stroke-width="0.12" stroke-dasharray="0.35 0.25"/>'
            f'<ellipse cx="12" cy="9.6" rx="{f(b - w)}" ry="{a - w}" fill="none" stroke="{ORANGE}" stroke-width="0.12" stroke-dasharray="0.35 0.25"/>')
ring_alone = svg(f'<ellipse cx="12" cy="12" rx="{a}" ry="{f(b)}" fill="{NAVY}"/><ellipse cx="12" cy="12" rx="{a - w}" ry="{f(b - w)}" fill="#fff"/>'
                 f'<line x1="12" y1="7.5" x2="12" y2="16.5" stroke="{ORANGE}" stroke-width="0.12" stroke-dasharray="0.35 0.25"/>', 124, '6 6 12 12')
cup_big = svg(solid(D['Café']) + cup_ring, 124, '3.4 3.4 17.2 17.2')
bag_big = compose(bp, bh, 124, '3.4 3.4 17.2 17.2', uid='hb').replace('</svg>', bag_ring + '</svg>')


def hcell(big, small, title, note):
    return (f'<div style="display:flex;flex-direction:column;align-items:center;width:170px">{tile(big, 4)}'
            f'<div style="display:flex;gap:8px;align-items:center;margin-top:6px">{small}</div>'
            f'<div style="font-size:17px;font-weight:700;color:{NAVY};margin-top:4px">{title}</div>'
            f'<div style="font-size:15px;line-height:1.3;color:{GREY};text-align:center">{note}</div></div>')


HANDLE = (label('Rule work underneath: a swing for every object, and what a handle is (proposals)', 34)
          + f'<div style="display:flex;justify-content:space-between;align-items:flex-start">'
          + now_cell('Museum', 'Museum now', 'approved; no swing')
          + prop_cell(m1p, m1h, 'A · lintel arches', 'the beam swells; the gable rides it on one even cut', 'ml', lintel_mark)
          + prop_cell(m2p, m2h, 'B · plinth sags', 'the base is a cap, like the saucer', 'mp', plinth_mark)
          + f'<div style="width:2px;align-self:stretch;background:{RULE}"></div>'
          + now_cell('Shopping', 'Bag now', 'the team\'s blind test')
          + hcell(bag_big.replace('</svg>', bag_mark + '</svg>'), f'{compose(bp, bh, 24, uid="ht")}{compose(bp, bh, 12, uid="hs")}', 'Bag from the ring', 'handle = the ring; the full bag sags')
          + f'<div style="width:2px;align-self:stretch;background:{RULE}"></div>'
          + hcell(ring_alone, '', 'The ring', 'the handle\'s root')
          + hcell(cup_big, f'{svg(solid(D["Café"]), 24)}{svg(solid(D["Café"]), 12)}', 'Cup (approved)', 'already the ring, within 0.1px')
          + '</div>'
          + f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;margin-top:12px">'
          + '<div>' + p('<b>A swing for every object</b> ("there is probably a creative place to add swoops to all objects"). Kept: the separated gable, square openings, four columns. Not used: the beam shed, a tent roof, pills. We think A: a lintel is how a building carries weight; B risks every building reading as a boat.', 16) + '</div>'
          + f'<div><div style="font-size:19px;line-height:1.35;font-weight:700;color:{NAVY}">A handle is a ring: one whole ellipse (short axis 4/5 of the long), its hole the same ellipse with both radii shortened by one line, so the wall is one line all round.</div>'
          + p('Half-buried: centre on the body\'s edge, long axis out, so half shows. One size, sized to a hand. A cup tips, so the side, top on the rim; a bag hangs, so the top. Where it carries, brackets. The bag\'s old arch was a stilted arch on a ledge.', 16, INK, '6px 0 0') + '</div></div>')

CANDS = [('Weight', 'kept', 'tailoring and kites (how a piece hangs and lands), and "look at the order": things are built from the ground up'),
         ('The shadow', 'kept', 'inverting the brief: what a road sign keeps when everything else is taken away'),
         ('The seam', 'cut', 'tailoring: every object pieced with one cut. The tree has none.'),
         ('The landing', 'cut', 'kites, "disconnected events": one part hovers just before it settles. Lovely, but the tree and the fork have none; it lives on inside weight (rests).'),
         ('The stack', 'cut', '"the order in which you do things": built ground-up in layers. The fork isn\'t a stack, and it says less than weight.'),
         ('Blown', 'cut', 'glassblowing: every mass swells from inside. Untrue of the museum.'),
         ('No circles', 'cut', 'your note on the blocks, kept as a possibility: it lives inside the swing and the ring; alone, the museum, tree, star and + have nothing to test.')]
CONSIDERED = (label('How we got here: generated, then cut', 32)
              + p('Moves: threw away the set you had already named (swoop, flare, press); a real random draw (kite making, sailing knots, glassblowing, tailoring; Oblique Strategies "Imagine the piece as a set of disconnected events", "Look at the order in which you do things"; constraint "must be a verb"); inverting travel signs.', 16, GREY, '0 0 8px')
              + ''.join(f'<div style="display:grid;grid-template-columns:150px 60px 1fr;gap:12px;padding:5px 0;border-top:1px solid {RULE};font-size:16px;line-height:1.35">'
                        f'<b style="color:{NAVY}">{n}</b><span style="color:{MOSS if v == "kept" else DEEP};font-weight:700">{v}</span><span>{c}</span></div>' for n, v, c in CANDS)
              )

QS = ['Weight and the shadow as the two signatures, with the bracket and the press as givens underneath: is that the filter?',
      'For the museum, A (the lintel arches) or B (the plinth sags)? Does the bag built from the ring read as a bag?',
      'The ring gives every handle one size (sized to a hand). Yes, or should a handle scale with its object?']
qhtml = ''.join(f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:9px 0;border-top:1px solid {RULE}">'
                f'<div style="font-size:24px;font-weight:700;color:{ORANGE}">{i + 1}</div><div style="font-size:19px;line-height:1.4;color:{NAVY}">{q}</div></div>'
                for i, q in enumerate(QS))

body = (kicker('Grid concepts · Brand signatures · round 2 · 10-26')
        + f'<h1 style="margin:6px 0 12px;font-size:38px;line-height:1.1;color:{NAVY}">Brand signatures</h1>'
        + f'<div style="font-size:28px;line-height:1.3;color:{NAVY};font-weight:700">Every object shows its <span style="color:{ORANGE}">weight</span>, and its <span style="color:{DEEP}">shadow</span> names it.</div>'
        + p('Two yes/no tests. Both pass all six approved icons as drawn (the star and + by weighing nothing) and read at true size; the bracket, the swing and the ring are rules underneath.', 18, INK, '8px 0 0')
        + SIG2 + SIG1 + GIVENS + SWINGS + HANDLE + CONSIDERED + label('Waiting on you', 30) + qhtml)

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
