#!/usr/bin/env python3
"""The "Brand signatures" board (Grid concepts page), 2026-10-26.

Owner: "come up with 1-3 core brand visual signatures that we can apply as a filter on decisions (e.g. we need one
element X one element Y)." Nothing is redrawn: the nine icon paths are copied from the live Now board; this script only
lays marks over them (a swoop line, a flare ring, a press ring) and draws the abstract do/don't diagrams.

  python3 -I src/signatures-board.py <live Grid7Now.dc.html> <out dir>   -> <out dir>/Grid7Signatures.dc.html
Then measure the root div in Chromium and set the frame height (and $preview) to it.
"""
import json, os, re, sys

NOW, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

NAVY, ORANGE, DEEP, GREY, RULE, PAPER, TILE, INK = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#F2EBDD', '#1A1A18'
MOSS = '#547326'
W = 1600
FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">'

# ------------------------------------------------------------------ icon paths, copied from the live Now board (72px row)
s = open(NOW, encoding='utf-8').read()
ICON = {}
for svg in re.findall(r'<svg width="72"[^>]*>.*?</svg>', s, re.S):
    name = re.search(r'aria-label="([^"]+)"', svg).group(1)
    ICON[name] = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S).group(1)
assert len(ICON) == 9, ICON.keys()


def quad(x0, y0, xm, ym, x1, y1):
    """A quadratic through (x0,y0), (xm,ym) at t=1/2, and (x1,y1)."""
    cx, cy = 2 * xm - (x0 + x1) / 2, 2 * ym - (y0 + y1) / 2
    return f'M{x0},{y0} Q{cx:.3f},{cy:.3f} {x1},{y1}'


# Marks in the icons' own 24-unit space, read off 50px-a-unit crops of the live drawings. Each sits just outside the
# feature it names so the drawing stays visible. swoop: the lead swoop; flare: rings; press: one example corner.
MARKS = {
    'Café':       dict(swoop=[quad(6.7, 16.2, 12, 16.95, 17.3, 16.2)], flare=[(13.55, 12.85)], press=[(8.25, 8.2)]),
    'Bar':        dict(swoop=['M6.6,9.1 C6.7,11.3 8.6,12.75 10.9,13.2'], flare=[(11.35, 13.05), (12.65, 15.15)], press=[(7.45, 8.35)]),
    'Museum':     dict(swoop=[], flare=[(7.45, 12.45), (16.55, 15.55)], press=[(12, 7.3)]),
    'Nature':     dict(swoop=[quad(10.75, 12.15, 9.45, 14.05, 8.0, 15.05)], flare=[(11.45, 15.75)], press=[(12, 6.35)]),
    'Star':       dict(swoop=[], flare=[], press=[(12, 4.35)]),
    'Add':        dict(swoop=[], flare=[], press=[(12, 6.25)]),
    'Restaurant': dict(swoop=['M14.45,6.25 C15.95,6.9 16.65,9.4 16.75,12.0'], flare=[(11.05, 12.55), (15.45, 12.65)], press=[(8.05, 6.75)]),
    'Hotel':      dict(swoop=[quad(8.75, 9.25, 11.15, 7.95, 13.65, 9.25)], flare=[(8.1, 11.3), (16.5, 14.75)], press=[(7.15, 8.2)]),
    'Shopping':   dict(swoop=[], flare=[], press=[(8.2, 16.6)]),
}
SW = 0.34   # swoop line width, units


def marked(name, px=150, marks=True):
    m = MARKS[name]
    g = ''
    if marks:
        for d in m['swoop']:
            g += f'<path d="{d}" fill="none" stroke="{ORANGE}" stroke-width="{SW}" stroke-linecap="round"/>'
        for x, y in m['flare']:
            g += f'<circle cx="{x}" cy="{y}" r="0.68" fill="none" stroke="{DEEP}" stroke-width="0.17"/>'
        for x, y in m['press']:
            g += f'<circle cx="{x}" cy="{y}" r="0.62" fill="none" stroke="{MOSS}" stroke-width="0.15" stroke-dasharray="0.28 0.2"/>'
    return f'<svg width="{px}" height="{px}" viewBox="3.4 3.4 17.2 17.2" aria-hidden="true" style="display:block">{ICON[name]}{g}</svg>'


def true24(name):
    return f'<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style="display:block">{ICON[name]}</svg>'


# ------------------------------------------------------------------ small type helpers
def kicker(t): return f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">{t}</div>'
def label(t, top=28): return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 12px">{t}</div>'
def p(t, size=19, color=INK, m='0 0 8px'): return f'<p style="margin:{m};font-size:{size}px;line-height:1.4;color:{color}">{t}</p>'


YES = f'<span style="color:{MOSS};font-weight:700">yes</span>'
NO = f'<span style="color:{DEEP};font-weight:700">no</span>'
NA = f'<span style="color:{GREY}">mark</span>'

# ------------------------------------------------------------------ the do / don't diagrams (abstract parts, not icons)
# Drawn at 22px a unit (a unit = 1px of the 24px badge), the scale of the Rules board's joins figure.
U = 22


def diag(body, w, h, vb):
    return f'<svg width="{w*U}" height="{h*U}" viewBox="{vb}" aria-hidden="true" style="display:block">{body}</svg>'


F = f'fill="{NAVY}"'
DIAG = {
    # swoop: a slab whose underside is one shallow ellipse (the saucer's way) / a half circle / a ruler-only box
    'swoop_do':   diag(f'<path {F} d="M0.6,0 H9.4 Q10,0 10,0.6 V1.1 A7.2 1.5 0 0 1 0,1.1 V0.6 Q0,0 0.6,0 Z"/>', 4.6, 1.5, '0 -0.3 10 3.3'),
    'swoop_no1':  diag(f'<path {F} d="M0.6,0 H9.4 Q10,0 10,0.6 V1.1 A5 5 0 0 1 0,1.1 V0.6 Q0,0 0.6,0 Z"/>', 3.0, 1.9, '-0.3 -0.3 10.6 6.6'),
    'swoop_no2':  diag(f'<path {F} d="M0.6,0 H9.4 Q10,0 10,0.6 V2.0 Q10,2.6 9.4,2.6 H0.6 Q0,2.6 0,2.0 V0.6 Q0,0 0.6,0 Z"/>', 4.6, 1.5, '0 -0.3 10 3.3'),
    # flare: a post (5/6 line) into a slab, flaring 1/3 line on a concave curve / a square T / an ink-trap notch
    'flare_do':   diag(f'<path {F} d="M0,0 H7 V1.5 H4.45 C4.0,1.5 3.85,1.85 3.85,2.45 V5 H3.15 V2.45 C3.15,1.85 3.0,1.5 2.55,1.5 H0 Z"/>', 3.2, 2.3, '0 0 7 5'),
    'flare_no1':  diag(f'<path {F} d="M0,0 H7 V1.5 H3.85 V5 H3.15 V1.5 H0 Z"/>', 3.2, 2.3, '0 0 7 5'),
    'flare_no2':  diag(f'<path {F} d="M0,0 H7 V1.5 H4.3 L3.85,1.05 V5 H3.15 V1.05 L2.7,1.5 H0 Z"/>', 3.2, 2.3, '0 0 7 5'),
    # press: outside soft, inside tighter / knife-sharp / every corner the same full round
    'press_do':   diag(f'<path {F} d="M0.6,0 H1.9 Q2.5,0 2.5,0.6 V3.35 Q2.5,3.5 2.65,3.5 H5.4 Q6,3.5 6,4.1 V4.4 Q6,5 5.4,5 H0.6 Q0,5 0,4.4 V0.6 Q0,0 0.6,0 Z"/>', 2.9, 2.3, '-0.3 -0.3 6.6 5.6'),
    'press_no1':  diag(f'<path {F} d="M0,0 H2.5 V3.5 H6 V5 H0 Z"/>', 2.9, 2.3, '-0.3 -0.3 6.6 5.6'),
    'press_no2':  diag(f'<path {F} d="M1.25,0 A1.25 1.25 0 0 1 2.5,1.25 V2.75 A0.75 0.75 0 0 0 3.25,3.5 H5.25 A0.75 0.75 0 0 1 5.25,5 H0.75 A0.75 0.75 0 0 1 0,4.25 V1.25 A1.25 1.25 0 0 1 1.25,0 Z"/>', 2.9, 2.3, '-0.3 -0.3 6.6 5.6'),
}


def dodont(do, nos):
    cell = lambda svg, cap, ok: (f'<div style="display:flex;flex-direction:column;align-items:flex-start;gap:6px">'
                                 f'<div style="height:56px;display:flex;align-items:center">{svg}</div>'
                                 f'<div style="font-size:15px;line-height:1.3;color:{MOSS if ok else DEEP};font-weight:700">{"Do" if ok else "Not"}</div>'
                                 f'<div style="font-size:15px;line-height:1.3;color:{GREY}">{cap}</div></div>')
    return (f'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;background:{TILE};padding:14px 16px;margin-top:14px">'
            + cell(DIAG[do[0]], do[1], True) + ''.join(cell(DIAG[k], c, False) for k, c in nos) + '</div>')


SIGS = [
    dict(name='The swoop', mark=f'<svg width="44" height="14" viewBox="0 0 44 14"><path d="M3,4 Q22,15 41,4" fill="none" stroke="{ORANGE}" stroke-width="3.4" stroke-linecap="round"/></svg>',
         test='Does one side of a solid part bend as one shallow ellipse arc you could pull with a curve template?',
         his='"the light swoops in the tree branches"; "the joy of movement"',
         built='A side of a mass or slab declared as one ellipse, flatter than a circle (4/5 or flatter; a cap\'s 7/6 cut), spanning at least half the drawing. Rules 6, 11; the tier\'s droop and sweep (rule 12).',
         out='All-ruler drawings; half circles; curves that are only corner rounds; loops and holes standing in for it (the bag\'s handle is an arch, not a swoop).',
         dd=dodont(('swoop_do', 'one shallow arc'), [('swoop_no1', 'a half circle'), ('swoop_no2', 'ruler only')])),
    dict(name='The flare', mark=f'<svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" fill="none" stroke="{DEEP}" stroke-width="2.4"/></svg>',
         test='Where a thin part meets a heavier one, does its edge swell into it on a concave curve, like ink squeezed at the joint?',
         his='"the flares"; "something screened or pressed"',
         built='The holds join (a post flares 1/3 line, 0.5px, on open faces), the capital, the leaned flare into a curve (rule 4, rule 18; rounds table: flare 0.5). Places only.',
         out='Square T and L joints; ink-trap notches; flares on outside edges or on line marks; flares bigger than 1/3 line.',
         dd=dodont(('flare_do', 'swells 1/3 line'), [('flare_no1', 'square joint'), ('flare_no2', 'ink trap')])),
    dict(name='The press', mark=f'<svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" fill="none" stroke="{MOSS}" stroke-width="2.2" stroke-dasharray="3.4 2.4"/></svg>',
         test='Is every corner pressed soft, outside rounder than inside, with no knife point and no pill end?',
         his='"slight rounding of interior and exterior corners ... allude to something screened or pressed"',
         built='The rounds table (rule 17): mass corner 0.6, line end 0.3, tip 0.35 or less, inside join 0.15, never more than 1/5 of the shorter edge. Every icon, marks too.',
         out='Sharp corners; one radius everywhere; round caps and pill ends; corners rounded so far the root shape is lost.',
         dd=dodont(('press_do', 'outside soft, inside tight'), [('press_no1', 'knife sharp'), ('press_no2', 'one big radius')])),
]


def sig_col(sg):
    row = lambda k, v: (f'<div style="margin-top:12px"><div style="font-size:14px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase">{k}</div>'
                        f'<div style="font-size:17px;line-height:1.4;margin-top:3px">{v}</div></div>')
    return (f'<div style="border-top:4px solid {ORANGE};padding-top:14px">'
            f'<div style="display:flex;align-items:center;gap:12px">{sg["mark"]}<div style="font-size:30px;font-weight:700;color:{NAVY}">{sg["name"]}</div></div>'
            f'<div style="font-size:20px;line-height:1.35;color:{NAVY};font-weight:600;margin-top:10px">{sg["test"]}</div>'
            + row('His words', sg['his']) + row('Built by', sg['built']) + row('Rules out', sg['out']) + sg['dd'] + '</div>')


def icon_card(name, label_, s1, s2, s3, note=''):
    tick = lambda k, v: f'<div style="display:flex;justify-content:space-between;font-size:16px;line-height:1.5"><span style="color:{GREY}">{k}</span>{v}</div>'
    return (f'<div style="display:flex;flex-direction:column;align-items:center">'
            f'<div style="background:#fff;border:1px solid {RULE}">{marked(name)}</div>'
            f'<div style="display:flex;align-items:center;gap:8px;margin-top:8px"><div style="background:#fff;padding:2px">{true24(name)}</div>'
            f'<div style="font-size:18px;font-weight:600;color:{NAVY}">{label_}</div></div>'
            f'<div style="width:140px;margin-top:6px">{tick("swoop", s1)}{tick("flare", s2)}{tick("press", s3)}</div>'
            + (f'<div style="width:150px;font-size:15px;line-height:1.35;color:{GREY};margin-top:6px;text-align:center">{note}</div>' if note else '')
            + '</div>')


legend = (f'<div style="display:flex;gap:28px;align-items:center;font-size:16px;color:{GREY};margin:0 0 14px">'
          f'<span style="display:flex;gap:8px;align-items:center">{SIGS[0]["mark"]} swoop</span>'
          f'<span style="display:flex;gap:8px;align-items:center">{SIGS[1]["mark"]} flare</span>'
          f'<span style="display:flex;gap:8px;align-items:center">{SIGS[2]["mark"]} press (one example corner; every corner has it)</span></div>')

six = ''.join([
    icon_card('Café', 'Café', YES, YES, YES, 'saucer\'s underside; cup leans into ear'),
    icon_card('Bar', 'Bar', YES, YES, YES, 'the bowl; stem flares both ends'),
    icon_card('Museum', 'Museum', NO, YES, YES, 'capitals flare; no swoop (question 1)'),
    icon_card('Nature', 'Nature', YES, YES, YES, 'tiers sweep and droop; trunk flares'),
    icon_card('Star', 'Star', NA, NA, YES, 'a mark: soft tips'),
    icon_card('Add', 'The +', NA, NA, YES, 'a mark: line ends'),
])
new = ''.join([
    icon_card('Restaurant', 'Fork and knife', YES, YES, YES, 'knife\'s back; both flare into handles'),
    icon_card('Hotel', 'Bed', YES, YES, YES, 'pillow\'s dome; headboard, leg flare'),
    icon_card('Shopping', 'Bag', NO, NO, YES, 'an arch on a block: reads as a padlock'),
])


def alt_row(letter, name, cue, rows, verdict):
    cells = ''.join(f'<td style="padding:6px 8px;text-align:center;border-top:1px solid {RULE}">{v}</td>' for v in rows)
    return (f'<tr><td style="padding:10px 12px 10px 0;border-top:1px solid {RULE};vertical-align:top;width:430px">'
            f'<div style="font-size:20px;font-weight:700;color:{NAVY}">{letter} · {name}</div>'
            f'<div style="font-size:16px;line-height:1.4;color:{INK};margin-top:4px">{cue}</div>'
            f'<div style="font-size:16px;line-height:1.4;color:{DEEP};margin-top:4px">{verdict}</div></td>{cells}</tr>')


HEAD = ['Café', 'Bar', 'Museum', 'Nature', 'Star', 'The +', 'Fork', 'Bed', 'Bag']
heads = ''.join(f'<th style="font-size:14px;font-weight:700;color:{GREY};padding:4px 8px;text-transform:uppercase;letter-spacing:.06em">{h}</th>' for h in HEAD)
both = lambda a, b: f'{a} {b}'
alts = (f'<table style="border-collapse:collapse;width:100%;font-size:17px"><tr><th></th>{heads}</tr>'
        + alt_row('A', 'Swoop · flare · press (recommended)',
                  'What you see: one pulled curve, one squeezed joint, every corner pressed.',
                  [both(YES, YES), both(YES, YES), both(NO, YES), both(YES, YES), NA, NA, both(YES, YES), both(YES, YES), both(NO, NO)],
                  'Passes five of six places, and fails exactly the two you objected to (the museum on v147, the bag now).')
        + alt_row('B', 'Three tools: compass · brush · knife',
                  'How it was made: every curve from a whole circle or ellipse; every join lands with a flare or lifts to a soft tip; one knife cut lets the paper in (a lifted part or a hole).',
                  [YES, YES, YES, NO, YES, NO, NO, YES, f'{YES}*'],
                  '*The bag passes compass and knife and still reads as a padlock: it tests the making, not the look. Too easy to pass.')
        + alt_row('C', 'Signpost: stands · lifts',
                  'Composition and play: every place stands on a level ground edge, like a sign symbol; one part floats free on a paper gap (the cup off its saucer, the gable off its beam, the pillow).',
                  [both(YES, YES), both(YES, NO), both(YES, YES), both(YES, NO), NA, NA, both(NO, NO), both(YES, YES), both(YES, NO)],
                  'The lift is the most whimsical cue we have, but this set would ask you to change the coupe, the tree and the fork.')
        + '</table>'
        + p('Cells: A and C give one answer per signature, in order. B is one answer for all three tools. "mark" = the star and the +, which only carry the press.', 15, GREY, '8px 0 0')
        + p('<b>Also weighed: "ellipses, never circles"</b> (your note on the blocks). Not its own signature: the museum, tree, star and + have no curves to test, and the bag passes it (its handle is an ellipse) yet reads as a padlock. It already lives inside the swoop, which must be flatter than a circle.', 17, INK, '12px 0 0'))

qs = [
    'The museum has flares and press but no swoop. The filter agrees with what you said on v147 ("completely out of place"). Should buildings be the one kind exempt from the swoop, or should the museum earn one? We have not changed it.',
    'Is "every place icon has one swoop and one flare; every icon is pressed" the filter? If yes, it becomes a check the engine runs on every new icon (a declared ellipse side, a holds or capital join, the rounds table).',
    'The lift (one part floating on a paper gap, set C) is allowed today by rule 14 but not asked for. Keep it as an optional flourish, or promote it to a fourth signature?',
]
qhtml = ''.join(f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:10px 0;border-top:1px solid {RULE}">'
                f'<div style="font-size:24px;font-weight:700;color:{ORANGE}">{i+1}</div><div style="font-size:19px;line-height:1.4;color:{NAVY}">{q}</div></div>'
                for i, q in enumerate(qs))

body = (kicker('Grid concepts · Brand signatures · 10-26')
        + f'<h1 style="margin:6px 0 14px;font-size:38px;line-height:1.1;color:{NAVY}">Brand signatures</h1>'
        + f'<div style="font-size:28px;line-height:1.3;color:{NAVY};font-weight:700;margin:0 0 10px">Every place icon has <span style="color:{ORANGE}">one swoop</span> and <span style="color:{DEEP}">one flare</span>. Every icon is <span style="color:{MOSS}">pressed</span>.</div>'
        + p('A yes/no filter for any icon decision. Swoop = the joy of movement; flare and press = the tactility of print and tools. Travel-sign clarity is the bar each one must clear, not a fourth cue: a swoop or flare that doesn\'t read on a solid silhouette at 24px is drawn wrong. Marks (star, +, controls) carry the press only, so they stay plain beside the places.', 19, INK, '0 0 4px')
        + f'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:36px;margin-top:22px">{"".join(sig_col(s) for s in SIGS)}</div>'
        + label('The six (approved, unchanged) and three new icons, marked', 34) + legend
        + f'<div style="display:flex;justify-content:space-between;align-items:flex-start">{six}<div style="width:2px;align-self:stretch;background:{RULE}"></div>{new}</div>'
        + p('<b>The filter predicts the blind tests.</b> The fork and knife and the bed pass and read as family; the bag fails swoop and flare and reads as a padlock. What its next designer must find (not a drawing): one solid side drawn as a swoop, and a handle that flares into the body instead of standing on it.', 18, INK, '18px 0 0')
        + label('Three sets considered', 30) + alts
        + label('Waiting on you', 30) + qhtml)

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
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{W},"height":2184}}}}'>
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''
open(os.path.join(OUT, 'Grid7Signatures.dc.html'), 'w', encoding='utf-8').write(html)
print('wrote', os.path.join(OUT, 'Grid7Signatures.dc.html'), len(html))
