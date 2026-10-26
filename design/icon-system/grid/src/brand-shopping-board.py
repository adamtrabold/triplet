#!/usr/bin/env python3
"""The "Brand and Shopping" board (Grid concepts page), round 4 (2026-10-26). Replaces "Brand signatures" (v260, archived).

Owner, on v260 (verbatim): "some of these are too cheeky. i do think the prior straightforwardness is part of the allure
considering the source inspiration. i dont think the swoop is working. i do think i like the machined rules a lot -- and
maybe that is stronger than defining the rounds by a shape.. it's by underlying method of creation. i think all of these
things together speak to the brand. the bag i think is conceptually the problem -- the way we have added personality is by
icon choice -- the bar coupe is one of the specifically good ones. whereas other systems used a simple wine glass or
something, we went slightly left-of-center. i think the shopping bag works, but it may be one step too common?"
And, on the posts measuring 1.24-1.25px: "ok yeah i must be viewing these too big then -- nothing should go that thin."

Three parts: the brand in his terms (three filters), the machined rule (the rack of three cutters, shown on the real joins
of the six with the cutter drawn as a ghost; posts to the line, before/after), and five Shopping concepts drawn finished.

  python3 -I src/brand-shopping-board.py <live Grid7Now.dc.html> <out dir>
    reads svg/g7/construction.json (the six's corners, as approved) and svg/post-line/*.json|svg (the rebuilds with posts
    at the line: bar, nature, museum from construction.js; restaurant from mix-curves.js; hotel = the bed via mix-curves.js
    with its headboard and leg at the line, outer edges kept).
"""
import json, math, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import shop_shapes as S

NOW, OUT = sys.argv[1], sys.argv[2]
HERE = os.path.join(os.path.dirname(__file__), '..')
os.makedirs(OUT, exist_ok=True)

NAVY, ORANGE, DEEP, GREY, RULE, PAPER, TILE, INK, MOSS = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#F2EBDD', '#1A1A18', '#547326'
W = 1600
FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">'

s = open(NOW, encoding='utf-8').read()
D = {}
for svg_ in re.findall(r'<svg width="72"[^>]*>.*?</svg>', s, re.S):
    D[re.search(r'aria-label="([^"]+)"', svg_).group(1)] = re.search(r' d="([^"]+)"', svg_).group(1)
CONS = json.load(open(os.path.join(HERE, 'svg/g7/construction.json')))
PL = os.path.join(HERE, 'svg/post-line')
AFTER = {k: json.load(open(os.path.join(PL, f'{k}.json'))) if os.path.exists(os.path.join(PL, f'{k}.json')) else CONS[k]
         for k in ('bar', 'nature', 'museum')}   # (a missing rebuild falls back to the approved drawing: layout drafts only)
def svgd(p): return re.search(r' d="([^"]+)"', open(p).read()).group(1)
AFTER_D = {'Bar': AFTER['bar']['d'], 'Nature': AFTER['nature']['d'], 'Museum': AFTER['museum']['d'],
           'Restaurant': svgd(os.path.join(PL, 'restaurant.svg')), 'Hotel': svgd(os.path.join(PL, 'hotel.svg'))}


def f(v): return f'{v:.3f}'.rstrip('0').rstrip('.')
def svg(inner, px, vb='0 0 24 24', label=None):
    a = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    return f'<svg width="{px}" height="{px}" viewBox="{vb}" {a} style="display:block">{inner}</svg>'
def solid(d, fill=NAVY): return f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/>'
def badge(inner, px, label=None):
    return svg(f'<circle cx="12" cy="12" r="11" fill="{TILE}" stroke="{NAVY}" stroke-width="2"/>{inner}', px, label=label)


# ------------------------------------------------------------------ the rack, and what it does to the six
RACK = [(S.E8, '⅛'), (S.E4, '¼'), (S.E2, '½')]
def cutter(r):
    """The rack's cutter for a round today: the nearest of ⅛, ¼, ½ on a doubling scale."""
    return min(RACK, key=lambda t: abs(math.log(r / t[0])))
def move(r0, r1, ang):
    """How far the outline moves at the corner when its round changes from r0 to r1 (circular rounds, corner angle ang)."""
    return abs(r1 - r0) * (1 / math.sin(math.radians(ang) / 2) - 1)

MOVES = {}
for k, v in CONS.items():
    worst = (0, None)
    for c in v['corners']:
        if c.get('r') is None or c['angle'] < 75:      # tips and the notches between them keep the tip rule
            continue
        r1, _ = cutter(c['r'])
        m = move(c['r'], r1, c['angle'])
        if m > worst[0]: worst = (m, c)
    MOVES[k] = worst
WORST = max(MOVES.values(), key=lambda t: t[0])


def corner_near(corners, x, y):
    return min(corners, key=lambda c: (c['P0'][0] - x) ** 2 + (c['P0'][1] - y) ** 2)


def ghost(c, r, col=ORANGE):
    """The cutter, drawn where it sits in the corner: tangent to both edges."""
    P = c['P0']; A = (c['pA'][0] - P[0], c['pA'][1] - P[1]); B = (c['pB'][0] - P[0], c['pB'][1] - P[1])
    la, lb = math.hypot(*A), math.hypot(*B)
    bx, by = A[0] / la + B[0] / lb, A[1] / la + B[1] / lb; lbis = math.hypot(bx, by); bx, by = bx / lbis, by / lbis
    dist = r / math.sin(math.radians(c['angle']) / 2)
    cx, cy = P[0] + bx * dist, P[1] + by * dist
    return (f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{r}" fill="none" stroke="{col}" stroke-width="0.04" stroke-dasharray="0.1 0.07"/>'
            f'<circle cx="{f(cx)}" cy="{f(cy)}" r="0.045" fill="{col}"/>')


# the real joins of the six (posts at the line where the icon has posts), each with its cutter
J = []
def join(title, d, corners, x, y, kind, note):
    c = corner_near(corners, x, y)
    r1, frac = (S.E4, '¼') if kind == 'chamfer' else cutter(c['r'])
    if kind == 'chamfer':      # the engine cuts the capital as one span from the beam's end to the column: the chamfer line
        (ax, ay), (bx, by) = c['pA'], c['pB']
        g = f'<path d="M{f(ax)},{f(ay)} L{f(bx)},{f(by)}" stroke="{ORANGE}" stroke-width="0.05" stroke-dasharray="0.12 0.08" fill="none"/>'
        g += f'<circle cx="{f(ax)}" cy="{f(ay)}" r="0.05" fill="{ORANGE}"/><circle cx="{f(bx)}" cy="{f(by)}" r="0.05" fill="{ORANGE}"/>'
    else:
        g = ghost(c, r1)
    J.append((title, d, (c['P0'][0] - 1.5, c['P0'][1] - 1.5), g, f'{note} · {frac}' if kind != 'tip' else note))

cc, bc, mc, nc = CONS['cafe']['corners'], AFTER['bar']['corners'], AFTER['museum']['corners'], AFTER['nature']['corners']
J_ = [
    ('Café: ear into cup', D['Café'], cc, 13.53, 12.71, 'fillet', 'fillet'),
    ('Café: the cup\'s corner', D['Café'], cc, 7.94, 7.93, 'corner', 'a mass\'s corner'),
    ('Bar: stem into bowl', AFTER_D['Bar'], bc, 12.75, 12.75, 'fillet', 'post into a face'),
    ('Bar: stem onto foot', AFTER_D['Bar'], bc, 12.75, 15.27, 'fillet', 'post into a face'),
    ('Museum: the capital', AFTER_D['Museum'], mc, 16.89, 11.98, 'chamfer', 'the chamfer, breaks'),
    ('Museum: an opening', AFTER_D['Museum'], mc, 13.9, 12.48, 'corner', 'a cut\'s corner'),
    ('Tree: trunk into tier', AFTER_D['Nature'], nc, 12.75, 15.45, 'fillet', 'post into a face'),
    ('+: the crossing', D['Add'], CONS['plus']['corners'], 12.76, 12.76, 'corner', 'inside corner'),
]
for t, d, cs, x, y, k, n in J_:
    join(t, d, cs, x, y, k, n)


def join_cell(title, d, xy, g, note):
    x, y = xy
    return (f'<div style="width:156px"><div style="background:#fff;border:1px solid {RULE}">{svg(solid(d) + g, 154, f"{f(x)} {f(y)} 3 3")}</div>'
            f'<div style="font-size:15px;font-weight:700;color:{NAVY};margin-top:4px;line-height:1.25">{title}</div>'
            f'<div style="font-size:14px;line-height:1.3;color:{GREY}">{note}</div></div>')


# ------------------------------------------------------------------ type helpers
def kicker(t): return f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">{t}</div>'
def label(t, top=30): return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 12px">{t}</div>'
def p(t, size=17, color=INK, m='0 0 8px'): return f'<p style="margin:{m};font-size:{size}px;line-height:1.4;color:{color}">{t}</p>'


# ------------------------------------------------------------------ 1. the brand, in his terms
BRAND = [
    ('Plain', 'Straightforward forms, as plain as the road signs and tags they come from. Nothing cheeky.'),
    ('Made by a tool', 'Every round and join is what a cutter would leave (the machined rule, below). The method makes the shape.'),
    ('Left of centre', 'Personality comes from what we choose to draw: the coupe, not a wine glass.'),
]
brand = ''.join(f'<div style="border-top:4px solid {ORANGE};padding-top:10px"><div style="font-size:26px;font-weight:700;color:{NAVY}">{i + 1} · {t}</div>'
                f'<div style="font-size:18px;line-height:1.4;color:{INK};margin-top:6px">{x}</div></div>' for i, (t, x) in enumerate(BRAND))
BRAND_H = (label('The brand, in your words', 18)
           + f'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px">{brand}</div>'
           + p('A new icon passes all three. Dropped: the swoop and the cheeky proposals (the museum\'s swelling sides, both bags).', 16, GREY, '12px 0 0'))

# ------------------------------------------------------------------ 2. the machined rule
mx, mc_ = WORST
RULE_TXT = (p('<b>The rack: three cutters</b>, an eighth, a quarter and a half px, each double the last. Every round is one of them. (Last round\'s 0.15 / 0.3 / 0.6 would have moved the trunk, stem and fork neck; they measure 0.5, so the half keeps them. The trunk was 0.5, not 0.42 as last round\'s board said.)', 17)
            + p('<b>Continuous curvature.</b> Every round ramps in from the straight, never a circle meeting a line (the engine\'s fairing already does this).', 17)
            + p('<b>Which cutter, by join.</b> A post under an overhang: a <b>chamfer</b>, its edges broken by the quarter (the museum\'s bevel). A post into a face: the <b>half</b> fillet (stem, trunk, fork neck). A part\'s own corners: the half on a mass, the quarter on a slab or post, the eighth on anything thinner and on every cut. Points sharper than 75° (tips, and the notches between them) keep today\'s tip rule: a point is broken, not milled.', 17)
            + p('<b>Nothing thinner than the line</b> (your note today): posts and loops go from 1¼ to 1½px.', 17)
            + p(f'<b>On the six:</b> his tree keeps its trunk exactly; every other round moves at most {mx:.2f}px at 24 (the {"cup\'s top corner" if mc_ and mc_["r"] == 0.6 else "largest change"}). Not redrawn yet: below, the posts are rebuilt, the rounds are today\'s.', 16, GREY))
joins = ''.join(join_cell(*j) for j in J)
RULE_H = (label('The machined rule, ready', 34)
          + f'<div style="display:grid;grid-template-columns:600px 1fr;gap:36px;align-items:start"><div>{RULE_TXT}</div>'
          + f'<div><div style="display:grid;grid-template-columns:repeat(4,156px);gap:14px 16px">{joins}</div>'
          + p('Real joins at 50px a unit (3 x 3 px of the 24px icon), the cutter that cuts each drawn as a dashed ghost. Bar, museum and tree are the rebuilds with posts at the line.', 15, GREY, '10px 0 0') + '</div></div>')

# ------------------------------------------------------------------ 3. posts at the line, before / after
PAIRS = [('Bar', 'Coupe'), ('Nature', 'Tree'), ('Museum', 'Museum'), ('Restaurant', 'Fork and knife'), ('Hotel', 'Bed')]
def pair(k, n):
    def cell(d, cap):
        return (f'<div style="display:flex;flex-direction:column;align-items:center;gap:6px">{badge(solid(d), 96, f"{n}, {cap}")}{badge(solid(d), 24)}'
                f'<div style="font-size:14px;color:{GREY}">{cap}</div></div>')
    return (f'<div><div style="font-size:16px;font-weight:700;color:{NAVY};margin-bottom:6px;text-align:center">{n}</div>'
            f'<div style="display:flex;gap:8px">{cell(D[k], "1¼ today")}{cell(AFTER_D[k], "1½")}</div></div>')
POSTS_H = (label('Posts at the line: before and after, at 72 and 24', 34)
           + f'<div style="display:flex;justify-content:space-between">{"".join(pair(k, n) for k, n in PAIRS)}</div>'
           + p('Rebuilt by the engine (the six) and the mix (fork, bed) with posts at 1½px; nothing else changed. The coupe and the tree read a touch heavier, as expected. <b>Flags:</b> FLAGS_HERE', 16, INK, '14px 0 0'))

# ------------------------------------------------------------------ 4. Shopping, left of centre
SHOP = {
    'tag': ('Swing tag', 'The price tag on its string. Blind read: a price or luggage tag, plainly; kin to the app\'s Hanging Tag.'),
    'basket': ('Market basket', 'Blind read: a cooler, lunchbox or bucket, not a basket.'),
    'awning': ('Shop awning', 'Blind read: a storefront, clearly, but the generic answer (Material\'s).'),
    'parcel': ('Tied parcel', 'Blind read: a gift, not shopping.'),
    'till': ('Till', 'Blind read: a lump at 24 (a stapler or a scale); a register only at 72.'),
}
REC = ('tag',)
six = ''.join(f'<div style="display:flex;flex-direction:column;align-items:center;gap:6px">{badge(solid(D[k]), 72, k)}{badge(solid(D[k]), 24)}</div>'
              for k in ['Café', 'Bar', 'Museum', 'Nature', 'Star', 'Add'])
def concept(key):
    parts, holes = dict(S.CONCEPTS)[key]()
    t, why = SHOP[key]
    big = badge(S.compose(parts, holes, f'{key}A'), 96, f'Shopping: {t}')
    sm = badge(S.compose(parts, holes, f'{key}B'), 24)
    rec = key in REC
    return (f'<div style="display:flex;flex-direction:column;align-items:center;width:190px">{big}<div style="margin-top:6px">{sm}</div>'
            f'<div style="font-size:17px;font-weight:700;color:{DEEP if rec else NAVY};margin-top:6px;text-align:center">{t}{" · recommended" if rec else ""}</div>'
            f'<div style="font-size:15px;line-height:1.35;color:{GREY};text-align:center">{why}</div></div>')
SHOP_H = (label('Shopping, left of centre: five subjects, drawn finished, beside the six', 34)
          + f'<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:16px">{six}<div style="font-size:15px;color:{GREY};align-self:center;margin-left:8px">the six, approved, for scale</div></div>'
          + f'<div style="display:flex;justify-content:space-between;align-items:flex-start">{"".join(concept(k) for k, _ in S.CONCEPTS)}</div>'
          + p('<b>Recommended: the swing tag.</b> Plain, left of centre (a tag, not a bag), and it rhymes with the inspo\'s luggage tags and the app\'s own Hanging Tag. The till is the coupe\'s move in spirit, but it fails at 24. Blind read at 24 and 72 by the design director, labels cropped off; one more by someone who hasn\'t seen the board is still owed. All five use the existing roots (mass, slab, post, loop, cut, chamfer) and the rack; no ink under the line. Picked from a real random draw (awning, parcel, weighing pan, till roll, string bag, basket; knots, botany), hand-built, not engine output.', 16, INK, '14px 0 0'))

QS = ['The brand as three filters (plain, made by a tool, left of centre): is that it?',
      'The machined rule with the rack ⅛ / ¼ / ½ (your tree kept exactly): build it into the engine?',
      'Shopping: the swing tag, once someone who hasn\'t seen this board has read it blind at 24?']
qhtml = ''.join(f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:8px 0;border-top:1px solid {RULE}">'
                f'<div style="font-size:24px;font-weight:700;color:{ORANGE}">{i + 1}</div><div style="font-size:19px;line-height:1.4;color:{NAVY}">{q}</div></div>'
                for i, q in enumerate(QS))

body = (kicker('Grid concepts · Brand and Shopping · round 4 · 10-26')
        + f'<h1 style="margin:6px 0 4px;font-size:38px;line-height:1.1;color:{NAVY}">Brand and Shopping</h1>'
        + BRAND_H + RULE_H + POSTS_H + SHOP_H + label('Waiting on you', 30) + qhtml)


def page(h):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Brand and Shopping</title>
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
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{W},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''


FLAGS = os.environ.get('FLAGS', '[to be filled]')
body = body.replace('FLAGS_HERE', FLAGS)
H = int(os.environ.get('PREVIEW_H', '2400'))
open(os.path.join(OUT, 'Grid7Signatures.dc.html'), 'w', encoding='utf-8').write(page(H))
print('wrote', os.path.join(OUT, 'Grid7Signatures.dc.html'), 'moves', {k: round(v[0], 3) for k, v in MOVES.items()})
