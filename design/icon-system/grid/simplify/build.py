#!/usr/bin/env python3
"""The 10-26 simplification of the Grid concepts page (owner: "canvases are too long not everything is showing. do we
really need this much content? simplify my view to only important information and concise breakdowns").

Nothing is redrawn: every icon path is copied from the live boards (the approved six from Grid7NewIcons' "Approved 24" row,
the fork and knife, bed and bag from its "Three new icons" row). The joins figure and the rounds table move from the master
grid to the Rules board as they are. Superseded boards are copied to the Archive page whole or, where a board is taller than
a canvas frame can be (8000px), sliced at its own section boundaries so every part can be seen.

  python3 build.py <live project dir> <out root>     -> <out root>/project/*.dc.html, <out root>/slices.json
Then measure (measure.js) and write canvas.json (layout.py).
"""
import json, os, re, sys
from html.parser import HTMLParser

LIVE, OUT = sys.argv[1], sys.argv[2]
PROJ = os.path.join(OUT, 'project')
os.makedirs(PROJ, exist_ok=True)
read = lambda n: open(os.path.join(LIVE, n), encoding='utf-8').read()

NAVY, ORANGE, DEEP, GREY, RULE, PAPER, TILE, INK = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#F2EBDD', '#1A1A18'
FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">'


def page(title, width, body, height=1000):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
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
<div style="width:{width}px;box-sizing:border-box;padding:36px 32px 40px;background:{PAPER};font-family:Archivo,Arial,sans-serif;color:{INK}">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{width},"height":{height}}}}}'>
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''


def kicker(t): return f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">{t}</div>'
def h1(t): return f'<h1 style="margin:6px 0 16px;font-size:38px;line-height:1.1;color:{NAVY}">{t}</h1>'
def label(t, top=24): return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 8px">{t}</div>'


# ---------------------------------------------------------------- icon paths, copied from the live board
NEW = read('Grid7NewIcons.dc.html')
SVG_RE = r'<svg width="24"[^>]*aria-label="([^"]+)"[^>]*><path fill="#12293F" fill-rule="evenodd" d="([^"]+)"/></svg>'


def row_after(marker):
    out = {}
    for m in re.finditer(SVG_RE, NEW[NEW.index(marker):]):
        if m.group(1) in out: break
        out[m.group(1)] = m.group(2)
    return out


SIX = row_after('>Approved 24<')
NEW3 = row_after('Three new icons, beside the six')
ICONS = [(k, SIX[k], None) for k in ['Café', 'Bar', 'Museum', 'Nature', 'Star', 'Add']] + \
        [('Restaurant', NEW3['Restaurant'], None), ('Hotel', NEW3['Hotel'], None), ('Shopping', NEW3['Shopping'], 'unsolved')]
ALL = {k: d for k, d, _ in ICONS}


def icon(d, size, name, view='0 0 24 24', hidden=False):
    a = 'aria-hidden="true"' if hidden else f'role="img" aria-label="{name}"'
    return f'<svg width="{size}" height="{size}" viewBox="{view}" {a} style="display:block"><path fill="{NAVY}" fill-rule="evenodd" d="{d}"/></svg>'


# ---------------------------------------------------------------- Start here
START_QS = [
    ('The brand now lives in eight kinds of root (post, slab, mass, loop, hole, notch, capital, tip), each bringing its own joins. '
     'Is that the direction before we build it into the engine?', 'Now board: the eight roots'),
    ("How do you picture Triplet's shopping icon? Any reference?", 'Now board: the bag is unsolved'),
    ('Still open from before: does the star feel balanced with the + (14.1px against 13.2px), and does the + still feel a bit light? '
     "Is the coupe's clear band right at half a line (3/4px)?",
     'Archive: Between, sections 0c and 0'),
    ('Neighbourhood and Street are an area and a line on the map, not a thing. Our proposal: open, drawn in the open line inside '
     'their diamond. Yes, or another way?', 'Rules board: rule 15'),
]
STAND = [
    'The six are approved. The master grid and the rules they are built by are decided (row 2).',
    'Now: how new icons get made. In a prototype outside the engine, the brand lives in eight kinds of root. The six come back '
    'exactly; the fork and knife and the bed read as family; the bag is unsolved.',
    'Everything older is on the Archive page, in the row "Before the 10-26 simplification".',
]


def start():
    b = kicker('Grid concepts') + h1('Start here')
    b += label('Where things stand', 4)
    b += ''.join(f'<p style="margin:0 0 8px;font-size:19px;line-height:1.4">{t}</p>' for t in STAND)
    b += label('Waiting on you', 22)
    for i, (q, where) in enumerate(START_QS, 1):
        b += (f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:12px 0;border-top:1px solid {RULE}">'
              f'<div style="font-size:24px;font-weight:700;color:{ORANGE}">{i}</div><div>'
              f'<div style="font-size:20px;line-height:1.35;color:{NAVY};font-weight:600">{q}</div>'
              f'<div style="font-size:16px;color:{GREY};margin-top:4px">{where}</div></div></div>')
    return page('Start here', 760, b)


# ---------------------------------------------------------------- Now
# One crop per root kind: a viewBox into an existing drawing (nothing drawn), on the 24 grid.
ROOTS = [
    ('Mass', 'Café', '7.2 7.2 8 8', 'The thing itself (cup, tier, blade, mattress): 2 lines thick (3px).'),
    ('Slab', 'Café', '6.2 13.4 11.6 4.4', 'Carries or caps (beam, saucer, foot, roof): 1 line (1 1/2px).'),
    ('Post', 'Bar', '9.5 12.2 5 5', 'Holds up (stem, column, trunk, leg): 5/6 line; flares half a pixel into what it holds.'),
    ('Loop', 'Café', '12.3 6.9 5 5', "A band round a counter (the cup's ear, a bag's handle): 5/6 line."),
    ('Hole', 'Star', '3.6 3.6 16.8 16.8', "A proportional shape cut from a root (the star's middle, the coupe's band)."),
    ('Notch', 'Nature', '8.4 7.8 7.2 7.2', 'Where a tier sits in the one below: only the small round, so it never fills.'),
    ('Capital', 'Museum', '6.2 9.8 5 5', "A post holding a slab past its end: the slab's end drops into a quarter ellipse."),
    ('Tip', 'Nature', '9.9 5.5 4.2 4.2', 'A point goes soft by a share of its shorter edge (the tree, the star).'),
]
PROVEN = [
    ('Proven', 'The six come back from root calls alone, exactly (at most 0.03px² differ at 24); the fair, kink, shoulder and jitter checks are clean.'),
    ('Proven', 'The fork and knife and the bed got the family\'s flares from their roots; nobody drew them. Checks clean.'),
    ('Not yet', 'The bag: at 24 it is a dark block with a loop, near a padlock, and its handle feet fail the fair check. It needs a better idea, not a better rule.'),
    ('Not yet', 'Matching the engine on the six is the test passing, not proof it generalises; the fork and the bed are the first evidence. Weight is still judged by eye.'),
    ('Not yet', 'All of this is a prototype outside the engine. The engine and the six are unchanged.'),
]


def now():
    w, pad = 860, 32
    b = kicker('Grid concepts · now · v251, 10-26') + h1('Where the icons stand')
    b += (f'<p style="margin:0 0 6px;font-size:19px;line-height:1.4">The six you approved, then the three new icons built from root '
          f'calls only. Same drawings at both sizes.</p>')

    def row(size, labels):
        cells = ''
        for i, (k, d, flag) in enumerate(ICONS):
            if i == 6:
                cells += f'<div style="width:1px;align-self:stretch;background:{RULE}"></div>'
            lab = ''
            if labels:
                name = {'Add': 'The +', 'Restaurant': 'Fork and knife', 'Hotel': 'Bed', 'Shopping': 'Bag'}.get(k, k)
                lab = f'<div style="font-size:13px;line-height:1.2;color:{GREY};margin-top:6px;text-align:center">{name}</div>'
                if flag:
                    lab += f'<div style="font-size:13px;font-weight:700;color:{DEEP};text-align:center">{flag}</div>'
            cells += (f'<div style="flex:1;display:flex;flex-direction:column;align-items:center">'
                      f'<div style="height:{size}px;display:flex;align-items:center">{icon(d, size, k)}</div>{lab}</div>')
        return cells

    b += label('24px, true size', 18)
    b += f'<div style="display:flex;gap:6px;align-items:flex-start;padding:10px 0">{row(24, False)}</div>'
    b += label('72px', 12)
    b += f'<div style="display:flex;gap:6px;align-items:flex-start;padding:6px 0">{row(72, True)}</div>'
    b += f'<div style="font-size:14px;color:{GREY};margin:6px 0 0">Left of the line: approved. Right: new, from root calls only.</div>'

    b += label('The eight kinds of root', 26)
    b += f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 22px">'
    for name, src, view, line in ROOTS:
        b += (f'<div style="display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:center">'
              f'<div style="background:{TILE};width:64px;height:64px">{icon(ALL[src], 64, name, view, hidden=True)}</div>'
              f'<div style="font-size:16px;line-height:1.35"><b style="color:{NAVY}">{name}.</b> {line}</div></div>')
    b += '</div>'
    b += f'<div style="font-size:14px;color:{GREY};margin:8px 0 0">Each picture is a close-up of one of the drawings above.</div>'

    b += label('What is proven, what isn\'t', 26)
    for tag, t in PROVEN:
        col = NAVY if tag == 'Proven' else DEEP
        b += (f'<div style="display:grid;grid-template-columns:84px 1fr;gap:8px;padding:7px 0;border-top:1px solid {RULE};font-size:17px;line-height:1.4">'
              f'<div style="font-weight:700;color:{col}">{tag}</div><div>{t}</div></div>')
    return page('Now', w, b)


# ---------------------------------------------------------------- master grid (trimmed) and Rules
MASTER = read('Grid7Master.dc.html')
SEC = '<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:#5A564C;text-transform:uppercase;margin:40px 0 14px">'
j0, j1 = MASTER.index(SEC + 'The joins'), MASTER.index(SEC + 'The line')
s0 = MASTER.index(SEC + 'Stacked')
s1 = MASTER.index('</p>', s0) + 4
JOINS_ROUNDS = MASTER[j0:j1]
master = MASTER[:j0] + MASTER[j1:s0] + MASTER[s1:]
old_intro = 'The full spec, with every rule and the steps, is at the top of Construction, beside this board.'
assert old_intro in master
master = master.replace(old_intro, 'The rules, the joins and the rounds are on the Rules board beside this one.')

RULES = [
    ('Units', 'px: pixels at the 24px badge. line: 1 1/2px; thicknesses are in lines. unit: 1/12 of the drawing box (0.85 to 1.02px after the fit). Proportions have no unit.'),
    ('Roots', 'Every piece is one whole root: circle, ellipse, rectangle (slab, mass or post), triangle (gable), regular star, straight line. An edge you can\'t name that way is the one to fix. A whole ellipse is at least 2/3 as tall as wide; flatter is a cap.'),
    ('Connect and cut', 'Roots join into one outline or are cut apart; the kind of join decides (rule 4), never the icon. Cuts: a counter, a cap, the resting cut (2/3 line, 1px).'),
    ('The joins, five kinds (figure below)', 'Holds: a post flares a step (1/3 line, 0.5px) into what it holds, on open faces. Overhang: a slab on 2+ posts passes the outer ones by 1/3 post and drops a step: the capital. A mass on legs takes holds only. Rests: a loose part is cut free, one even cut. Base: one support, a cap; 2+ posts, a slab; legs to the ground, none. Free: a post ends square; a living mass hangs to a tip.'),
    ('Slab or mass', 'Carries or caps: a slab, 1 line, never scaled. Is the thing: a mass, sized by ratio, at least 2 lines (3px). Test: still the thing at one line thick? Then it\'s a slab.'),
    ('Curves belong to roots', 'No end draws its own arc. An ellipse meets a parallel straight edge at its widest point, tangent. A cap: a slab or mass cut by one ellipse its full height, the ends at half height.'),
    ('A counter is a root', 'The same shape smaller on the same centre, a spacing\'s gap, or a root moved. Running into a wall, it goes straight for 1/2 line (3/4px) first.'),
    ('One series', 'Every chosen proportion is halves, thirds, quarters, fifths or sixths (or 1 and one of them), and names its parent.'),
    ('Shapes are fractions of a root', 'The widest root is 1 (the fit makes it the cut); every other root is a fraction of it or of its own parent.'),
    ('Thickness from the line; edges on the lattice', 'The line (1 1/2px) never scales; open marks 1 2/3px. First edges on the 1/3px lattice. A part\'s thickness is exact; a space is a minimum, out to the next lattice line.'),
    ('Vessels', 'A vessel\'s curved side is one ellipse, 4/5 as tall as wide.'),
    ('Stacked', 'Tiers take the tree: heights 4.83 : 3 : 3.33, half widths 2.8 : 4.1 : 5.3, each notch 3/5 of the tier above\'s half width; living tiers droop 1/2 line and sweep 1/5. Four or more tiers: no rule yet.'),
    ('Placed by weight', 'A part on one part: its ink centre over that part. On one and against another: against it, across the same cut. Symmetric icons are mirrored.'),
    ('One resting part, one cut', 'At most one part per icon is cut free, at 2/3 line (1px) on every face it touches.'),
    ('Class by job, then size', 'Filled by a tap (star, visited): outline, solid when on. Names a place: shaped, solid. Does something (add, close, filters): open, 1 2/3px strokes, may carry small solid parts. Only shows a state (the visited check): solid. Neighbourhood and Street: waiting on you. Size: shaped, the nearest cut; open, its outside at 13.2px; outline, its outside, Square 14.07px; counters at least 2 lines.'),
    ('The fit', 'Positions scale, thicknesses never, until the outline meets the cut × 11/12. Cuts: Wide 11 × 8.56px, Square 9.78px, Tall 8.56 × 11.46px.'),
    ('Rounds: one table, the engine\'s (below)', 'Picked by the corner\'s kind, never chosen per icon.'),
    ('Transitions', 'At a flare into a reverse curve the round runs 1 3/4 as far along the curve. A tip round over 1/6px goes soft.'),
    ('Centred by eye, by rule', 'Across: half-way between box centre and ink centre, to 1/4px. Down: box centre, pulled down by half the ink\'s rise.'),
    ('Checked', 'Fair check clean; jitter holds (50 rebuilds nudged 0.02px move 0.05px or less); counters at least 2 lines; seen at 12, 24 and 72px beside the six.'),
]


def rules():
    b = (f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">Icon grid · the rules</div>'
         f'<h1 style="margin:6px 0 10px;font-size:38px;line-height:1.1;color:{NAVY}">Rules</h1>'
         f'<p style="margin:0 0 6px;font-size:19px;line-height:1.45;max-width:1400px">What the engine draws by today, in short. The full spec, '
         f'with the reasons, the table, the steps and each of the six built step by step, is on the Archive page (Construction). '
         f'The eight roots on the Now board are on trial, not yet rules.</p>')
    b += SEC + 'Every rule, in one list</div>'
    b += '<div style="column-count:2;column-gap:48px">'
    for i, (t, x) in enumerate(RULES, 1):
        b += (f'<div style="display:grid;grid-template-columns:30px 1fr;gap:10px;font-size:17px;line-height:1.4;break-inside:avoid;margin:0 0 12px">'
              f'<div style="width:26px;height:26px;border-radius:13px;background:{ORANGE};color:#fff;font-size:14px;font-weight:700;'
              f'display:flex;align-items:center;justify-content:center">{i}</div>'
              f'<div><b style="color:{NAVY}">{t}.</b> {x}</div></div>')
    b += '</div>'
    b += JOINS_ROUNDS
    html = page('Rules', 1600, b)
    return html.replace('padding:36px 32px 40px', 'padding:56px 64px 64px')


# ---------------------------------------------------------------- archive slices
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


class Kids(HTMLParser):
    """Byte offsets of the board root's top-level children."""
    def __init__(self, src):
        super().__init__(convert_charrefs=False)
        self.src, self.depth, self.kids, self.root = src, 0, [], None
        self.lines = [0]
        for ln in src.split('\n'): self.lines.append(self.lines[-1] + len(ln) + 1)

    def off(self):
        l, c = self.getpos(); return self.lines[l - 1] + c

    def handle_starttag(self, tag, attrs):
        if tag in VOID: return
        if self.root is None and tag == 'div' and self.inxdc:
            self.root = self.off(); self.depth = 1; return
        if self.root is not None and self.depth >= 1:
            if self.depth == 1: self.kids.append([self.off(), None])
            self.depth += 1

    def handle_startendtag(self, tag, attrs):
        if self.root is not None and self.depth == 1:
            a = self.off(); self.kids.append([a, a + len(self.get_starttag_text())])

    def handle_endtag(self, tag):
        if tag in VOID or self.root is None or self.depth < 1: return
        self.depth -= 1
        if self.depth == 1: self.kids[-1][1] = self.src.index('>', self.off()) + 1
        elif self.depth == 0: self.rootend = self.off()

    inxdc = False


def kids_of(src):
    k = Kids(src)
    k.inxdc = True
    xdc = src.index('</helmet>') + len('</helmet>')
    k.lines = [0]
    body = src[xdc:]
    for ln in body.split('\n'): k.lines.append(k.lines[-1] + len(ln) + 1)
    k.src = body
    k.feed(body)
    return xdc, k


def slices(name, groups):
    """groups: list of (first, last) child indices. Returns list of (html, label)."""
    src = read(name)
    xdc, k = kids_of(src)
    body = k.src
    root_open_end = body.index('>', k.root) + 1
    head, root_open = src[:xdc] + body[:k.root], body[k.root:root_open_end]
    tail = body[k.rootend:]
    out = []
    for a, z in groups:
        part = body[k.kids[a][0]:k.kids[z][1]]
        out.append(head + root_open + '\n' + part + '\n' + tail)
    return out, len(k.kids)


written = {}


def put(name, html):
    open(os.path.join(PROJ, name), 'w', encoding='utf-8').write(html)
    written[name] = len(html)


put('Grid7Start.dc.html', start())
put('Grid7Now.dc.html', now())
put('Grid7Rules.dc.html', rules())
put('Grid7Master.dc.html', master)

# archive: whole copies of the boards that fit a frame, slices of the ones that don't
ARCH = []   # (file, title, source)
put('Archive-G7be-Start.dc.html', read('Grid7Start.dc.html')); ARCH.append(('Archive-G7be-Start.dc.html', 'Start here (v251, before the 10-26 simplification)'))
put('Archive-G7be-Master.dc.html', MASTER); ARCH.append(('Archive-G7be-Master.dc.html', 'The master grid (v251, before it was trimmed: joins and rounds now on Rules)'))
put('Archive-G7be-Originals.dc.html', read('Grid7Originals.dc.html')); ARCH.append(('Archive-G7be-Originals.dc.html', 'Every icon: original and newest (v251)'))
SLICES = {
    'Grid7NewIcons.dc.html': ('NewIcons', 'How the system makes new icons (v251)', [((0, 32), 'the answers and the mix, round 3'), ((33, None), 'the first proposal (v247), A, B and C')]),
    'Grid7Between.dc.html': ('Between', 'Between H2 and H3 (v251)', [((0, 10), 'blind test, round 2'), ((11, 35), 'blind test, round 1'), ((36, 55), 'section 0, proportions'), ((56, None), 'sections 0c and 1')]),
    'Grid7Construction.dc.html': ('Construction', 'Construction (v251)', [((0, 4), 'the spec'), ((5, 10), 'drawing sheet, roots, rounds, café, bar'), ((11, None), 'museum, nature, star, plus')]),
}
for src, (stem, title, groups) in SLICES.items():
    _, n = slices(src, [(0, 0)])
    gs = [(a, n - 1 if z is None else z) for (a, z), _ in groups]
    assert gs[0][0] == 0 and gs[-1][1] == n - 1 and all(gs[i][1] + 1 == gs[i + 1][0] for i in range(len(gs) - 1)), (src, gs, n)
    htmls, _ = slices(src, gs)
    for i, (h, (_, lab)) in enumerate(zip(htmls, groups), 1):
        f = f'Archive-G7be-{stem}{i}.dc.html'
        put(f, h); ARCH.append((f, f'{title} · {i} of {len(groups)}: {lab}'))

json.dump({'written': written, 'archive': ARCH}, open(os.path.join(OUT, 'slices.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps(written, indent=1))
