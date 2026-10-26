#!/usr/bin/env python3
"""Writes the canvas board "Sharp at 2x and 3x" (Grid7Sharp.dc.html), round 4: placement only (src/placement.js), after the
owner: "lets just keep the line weight and stuff where it was and just opimize point placement as possible."
  python3 src/placement-board.py <out.dc.html> [height]   (also writes <out>.local.html with local images, to measure)"""
import json, os, sys
OUT, H = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 1400
HERE = os.path.dirname(os.path.abspath(__file__))
M = json.load(open(os.path.join(HERE, '..', 'svg', 'placement', 'measure.json')))
NAVY, ORANGE, DEEP, GREY, RULE, PAPER, INK = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#1A1A18'
IDS = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus']
NAMES = {'cafe': 'Café', 'bar': 'Bar', 'museum': 'Museum', 'nature': 'Nature', 'star': 'Star', 'plus': 'Add'}
sp = lambda s: dict(zip(IDS, s.split()))
BLOB = {  # glyph crops (css 4..20): before = the round-1 crops, after = round 4; badges at 3x for true size
    'b2': sp('984fd7d2ddd1c913af70680f995bfaad d9aeb2e2a40b38f40d213efa24b82ade d4395852d8f950be141a71cef5491025 8f94d5f86b80db26dda08c91d95f9bdf e78ec5c63b3f599da9d3cc34c46d160a 3bd19137fd133edf2dca279d4bd1b7c9'),
    'b3': sp('ab352860495141ec6792b9e9bff8bfb7 f526ec282be16a04fc1c3d548584cbbd 47e29a770a032c7d2d1fbb98b68743e4 59e46b5f446e0520e258e767d4d94766 9bed9d1732ea8b96589806ca40a142d4 54361b7b5d4082a8aacdd3efabf64da5'),
    'a2': sp('39b2a84c4bc22d8c9186e786f949ef51 3baa97f8b6280ea81abc32a2e5ae69e9 78504effc4fc07bc192bbd16a7cc905b e09cca394164dc146b59332a95093ef4 9bbf3f0423d4e9581d42aa9083a58b27 e6302a959ffe6c7385e4b38e48aad2cf'),
    'a3': sp('3f0d38b1dae49416e1af5c57920175a6 7477f7d88762377989ca49cfd62f2a23 a8ffcfa7e411ec5a45ef98021ebbff6d 275d0469dd87088358d4622d819dc1b6 5bbfbf24d2c2d2ae574bd70259aa3a62 596b2775bd3f2955b5dbb6a99d14635c'),
    'tb': sp('29fd6900d89965f1becc77d18579d969 5067db01522ddbd6ef59216d692f8160 515ae9899fac8504e8c0a60566717bf5 3d8e609b2f0c9a7e39448100de698ead 6a4bd1aed76102d691e6292bd67b1002 f14eaa0a6faed4f5bb28a689108141c0'),
    'ta': sp('ec41c79387f5540164447edc6087271d 27e9537215086a928e60e49042483218 5eed1629c5826927de5ac181db55b4f8 6263f8024e06c1c6ed7eb13e92ac4db0 50b3a6eb17702fd6f725f027d5959aa9 0a2c7cb7caf5f8d3c8197e45bbbf5ecd'),
}
G = os.path.abspath(os.path.join(HERE, '..', 'stills'))
LOCAL = {'b2': 'pixelfit/crop/{i}-before-2x.png', 'b3': 'pixelfit/crop/{i}-before-3x.png', 'a2': 'placement/raw/{i}-after-2x-glyph.png',
         'a3': 'placement/raw/{i}-after-3x-glyph.png', 'tb': 'wholegrid/raw/now-{i}-3x.png', 'ta': 'placement/raw/{i}-after-3x.png'}

def img(bid, alt, w):
    return f'<img src="/_blob/{bid}" alt="{alt}" width="{w}" height="{w}" style="display:block;image-rendering:pixelated">'
def label(t, top=26):
    return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 10px">{t}</div>'
def p(t, size=19, color=INK, mb=8):
    return f'<p style="margin:0 0 {mb}px;font-size:{size}px;line-height:1.4;color:{color}">{t}</p>'

tb = sum(r['before']['s2'] + r['before']['s3'] for r in M.values()); ta = sum(r['after']['s2'] + r['after']['s3'] for r in M.values())
n = 2 * sum(r['edges'] for r in M.values())
b2 = sum(r['before']['s2'] for r in M.values()); a2 = sum(r['after']['s2'] for r in M.values())
b3 = sum(r['before']['s3'] for r in M.values()); a3 = sum(r['after']['s3'] for r in M.values())
mv = max(r['maxMovePx'] for r in M.values())

b = f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">Icon grid · device pixels</div>'
b += f'<h1 style="margin:6px 0 16px;font-size:38px;line-height:1.1;color:{NAVY}">Sharp at 2x and 3x</h1>'
b += p(f'Line weights, posts, badge, ring, sizes and proportions stay as approved. Only placement moves, once, in the drawings themselves: each icon and its straight edges sit where the most edges land whole on both your 5K and an iPhone. Nothing moves more than {mv:.2f}px.')
b += p(f'Soft straight edges: 5K {b2} → {a2}, iPhone {b3} → {a3} (of {n // 2} on each).', 19, NAVY)

b += label('All six at 24px, one block per device pixel')
rows = [('5K, approved', 'b2'), ('5K, placed', 'a2'), ('iPhone, approved', 'b3'), ('iPhone, placed', 'a3')]
b += '<div style="display:grid;grid-template-columns:140px repeat(6,96px);gap:8px 10px;align-items:center">'
for t, k in rows:
    b += f'<div style="font-size:16px;font-weight:700;color:{NAVY}">{t}</div>' + ''.join(img(BLOB[k][i], f'{NAMES[i]}, {t}', 96) for i in IDS)
b += f'<div style="font-size:16px;font-weight:700;color:{NAVY}">True size, approved / placed</div><div style="grid-column:span 6;display:flex;gap:8px;align-items:center">'
b += ''.join(img(BLOB['tb'][i], f'{NAMES[i]}, approved, true size', 24) for i in IDS) + '<div style="width:24px"></div>'
b += ''.join(img(BLOB['ta'][i], f'{NAMES[i]}, placed, true size', 24) for i in IDS) + '</div></div>'
FAV = {'cafe': 'favours the 5K (all sharp there)', 'bar': 'both alike (moved 1/16px up)', 'museum': 'favours the iPhone',
       'nature': 'favours the iPhone (moved ¼px down)', 'plus': 'favours the 5K (moved ¼px up, its arm sharp there)'}
b += '<div style="display:grid;grid-template-columns:96px 150px 1fr;gap:4px 12px;font-size:16px;line-height:1.35;margin-top:10px">'
b += f'<div style="color:{GREY};font-weight:700">Icon</div><div style="color:{GREY};font-weight:700">Soft, 5K / iPhone</div><div style="color:{GREY};font-weight:700">Sharpening</div>'
for i in IDS:
    if not M[i]['edges']: continue
    r = M[i]
    b += f'<div style="font-weight:600;color:{NAVY}">{NAMES[i]}</div><div>{r["before"]["s2"]}/{r["before"]["s3"]} → {r["after"]["s2"]}/{r["after"]["s3"]}</div><div>{FAV[i]}</div>'
b += f'<div style="font-weight:600;color:{NAVY}">Star</div><div>–</div><div>no straight edges</div></div>'
b += p('Vertical centring stays optical, per icon: each move was checked by eye at 72px and true size, and none reads off-centre.', 16, GREY, 0)

b += label("What placement can't fix (with your weights)", 24)
cant = [
    'A 1½px line is 4½ iPhone pixels: one edge can be sharp, never both. On the 5K both can be.',
    'A 1¼px post is 2½ pixels on the 5K and 3¾ on an iPhone: one edge sharp on both, the other on neither.',
    'A stem centred across the badge (the + upright, the coupe\'s stem, the trunk) can\'t put either edge on a whole px without leaving the centre line, so those edges stay soft; only up-and-down moves help them.',
    'The ring\'s inner edge, and every curve, diagonal and tip, as before.',
]
b += '<div style="display:grid;grid-template-columns:22px 1fr;gap:6px 8px;font-size:18px;line-height:1.4">' + ''.join(f'<div style="color:{ORANGE};font-weight:700">•</div><div>{t}</div>' for t in cant) + '</div>'
b += p('The whole-pixel grids (A, B, C) are on the Archive page.', 16, GREY, 0)

b += label('Waiting on you', 22)
b += (f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:12px 0;border-top:1px solid {RULE}"><div style="font-size:24px;font-weight:700;color:{ORANGE}">1</div>'
      f'<div style="font-size:20px;line-height:1.35;color:{NAVY};font-weight:600">Do the placed six look the same as the approved six to you? If so, they become the six.</div></div>')

page = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Sharp at 2x and 3x</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">
<style>
body{{margin:0}}
</style>
</helmet>
<div style="width:940px;box-sizing:border-box;padding:36px 32px 40px;background:{PAPER};font-family:Archivo,Arial,sans-serif;color:{INK}">
{b}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":940,"height":{H}}}}}'>
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
'''
open(OUT, 'w').write(page)
local = page
for k, m in BLOB.items():
    for i, bid in m.items():
        local = local.replace(f'/_blob/{bid}', 'file://' + G + '/' + LOCAL[k].format(i=i))
open(OUT.replace('.dc.html', '.local.html'), 'w').write(local)
print(OUT, H)
