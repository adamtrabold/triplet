#!/usr/bin/env python3
"""Write canvas.json for the 10-26 simplification from the LIVE index (read right before publishing), the measured heights
and build.py's archive list. Sets each frame's h (and each file's $preview) to its rendered content height.

  python3 layout.py <live canvas.json> <out root>      (reads <out root>/heights.json and slices.json)
"""
import json, os, re, sys

live, OUT = sys.argv[1], sys.argv[2]
c = json.load(open(live, encoding='utf-8'))
H = json.load(open(os.path.join(OUT, 'heights.json')))
S = json.load(open(os.path.join(OUT, 'slices.json')))
PROJ = os.path.join(OUT, 'project')
GAP, ROW_GAP, TITLE = 80, 120, 300
OWNER = '"canvases are too long not everything is showing. do we really need this much content? simplify my view to only important information and concise breakdowns"'

# owner hand edits are never touched: any note that is not a title1 we wrote, any board titled Artboard
for k, n in c['notes'].items():
    if n.get('kind') != 'title1': print('keeping owner note', k)

MOVED = ['Grid7Between.dc.html', 'Grid7NewIcons.dc.html', 'Grid7Construction.dc.html', 'Grid7Originals.dc.html']
for f in MOVED:
    assert c['boards'][f]['page'] == 'grid', f
    del c['boards'][f]
    c['order'].remove(f)


def fix_preview(f, w, h):
    p = os.path.join(PROJ, f)
    s = open(p, encoding='utf-8').read()
    s2 = re.sub(r'"\$preview":\{"width":\d+,"height":\d+\}', f'"$preview":{{"width":{w},"height":{h}}}', s)
    assert s2.count('"$preview"') == 1
    open(p, 'w', encoding='utf-8').write(s2)


def place(row, y, page):
    x = 0
    for f, title in row:
        w, h = H[f]['w'], H[f]['h']
        assert h <= 8000, (f, h)
        b = c['boards'].get(f, {})
        b.update({'x': x, 'y': y, 'w': w, 'h': h, 'page': page, 'title': title})
        c['boards'][f] = b
        if f not in c['order']: c['order'].append(f)
        fix_preview(f, w, h)
        x += w + GAP
    return x - GAP, y + max(H[f]['h'] for f, _ in row)


# the live page: two rows
row1 = [('Grid7Start.dc.html', 'Start here'), ('Grid7Now.dc.html', 'Now: where the icons stand')]
row2 = [('Grid7Master.dc.html', 'The master grid'), ('Grid7Rules.dc.html', 'Rules')]
w1, bottom1 = place(row1, TITLE, 'grid')
y2 = bottom1 + ROW_GAP
w2, _ = place(row2, y2 + TITLE, 'grid')
c['notes']['gridRow1'].update({'x': 0, 'y': 0, 'maxW': w1, 'text': '1 · Waiting on you: the questions, and where the icons stand'})
c['notes']['gridRow2'].update({'x': 0, 'y': y2, 'maxW': w2, 'text': '2 · Decided: the master grid and the rules'})

# the archive: one new row below everything already there
arch_bottom = max(b['y'] + b['h'] for b in c['boards'].values() if b.get('page') == 'archive')
arch_bottom = max([arch_bottom] + [n['y'] + 100 for n in c['notes'].values() if n.get('page') == 'archive'])
ay = (arch_bottom + 400 + 99) // 100 * 100
wa, _ = place([tuple(a) for a in S['archive']], ay + TITLE, 'archive')
c['notes']['archiveG7beSimplify'] = {'kind': 'title1', 'page': 'archive', 'x': 0, 'y': ay, 'w': 240, 'maxW': wa,
                                    'text': f'Before the 10-26 simplification · v251 · moved off the Grid concepts page (owner: {OWNER})'}

# nothing we placed overlaps anything (older archive rows have overlaps of their own; left as they are)
for page in ('grid', 'archive'):
    bs = [(k, b) for k, b in c['boards'].items() if b.get('page') == page]
    mine = {f for f, _ in row1 + row2} | {a[0] for a in S['archive']}
    for i, (ka, a) in enumerate(bs):
        for kb, b in bs[i + 1:]:
            if (ka in mine or kb in mine) and a['x'] < b['x'] + b['w'] and b['x'] < a['x'] + a['w'] and a['y'] < b['y'] + b['h'] and b['y'] < a['y'] + a['h']:
                raise SystemExit(f'overlap {ka} {kb}')

json.dump(c, open(os.path.join(PROJ, 'canvas.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('grid rows:', row1, row2, 'row2 y', y2, '; archive row y', ay, 'width', wa)
for f, _ in row1 + row2: print(f, c['boards'][f])
