#!/usr/bin/env python3
"""Writes the canvas board "Sharp at 2x and 3x" (Grid7Sharp.dc.html), round 3, after the owner's comment on the fitting pass:
"no i want the base grid to make great icons without extrawork". The options are whole-pixel grids (src/whole-grid.js);
images are canvas assets uploaded from stills/wholegrid/raw (their /_blob ids below).
  python3 src/pixel-fit-board.py <out.dc.html> [height]   (also writes <out>.local.html with local images, to measure)"""
import os, sys
OUT, H = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 1600
NAVY, ORANGE, DEEP, GREY, RULE, PAPER, INK = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#1A1A18'
IDS = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus']
NAMES = {'cafe': 'Café', 'bar': 'Bar', 'museum': 'Museum', 'nature': 'Nature', 'star': 'Star', 'plus': 'Add'}
BLOB = {
    ('A', 3): 'b3d81b18d45ec0e78e6e6c6213f5b49d 0964c64957bb93c5d75df47b5340859d eabf4fd9f3011faaf63816ffcbb7207a 0311a1d93a50ecc4adfc7125001356a4 ae1cfc32265c3893c3c6eb729d6bea61 76cca26bd640fabaf3ce32316f3c1b0e',
    ('A', 2): '2138be26ecaa835b34034201c35004d2 4c63b06716ad8bee7d87978273c06c47 fac23ea837c7061c544f07430b7ac56c 55e2048cf120f8916da671cab6be3d15 786ae346fa784691904cdfc15602b604 37fee4bdadf2005715045326d3b1dbfa',
    ('B', 3): '65844668088d5c8ee00bb0fd9bf2dbaa 9c76dc8e822791b0c40bcddde43eb971 7b1b3ab318639565da959059be81d345 bf80ab276a9c09391de6be1b306b623f 31bb7a4149b8fc079b7829c9fa53856b 66421a2095688ee776a09cce50d2a03a',
    ('B', 2): '92d73c82f500fea2264949fc61fee579 28073cb144c102aca09b594575fb38c6 38e0beba0d7768f17814aeee4135e3fa bfc08cbd156cecdd126e17db3e31c971 844f7f8f8e8dd62c58d683fe35ccf7cd fc139291b149d1509edc7cee7dd63052',
    ('C', 3): 'ff304c815900d03964a1c2ee6b568baf 73fb270a78eb505b2e329f8edcef7439 0ae2dd808a254e00af8b27768f2bb593 167cbb62ce47680663bd451acb1181bd 3f04e4e67b082c28aef7c31f1f0ae984 5a3835049420f268407c07acbfb91d0d',
    ('C', 2): 'a124d36c0ff024024668ed4e0d242714 17144e935e5c7590e9b74fe8d117cdaa 6fb415348ad222e6ee2dc7da023ede52 505f51469d00d889bf32cf9776037fba 7c84fae712a3fe883e3d5ef5573f8c33 14f564441e83dcdef4045f841d06ea66',
    ('now', 3): '29fd6900d89965f1becc77d18579d969 5067db01522ddbd6ef59216d692f8160 515ae9899fac8504e8c0a60566717bf5 3d8e609b2f0c9a7e39448100de698ead 6a4bd1aed76102d691e6292bd67b1002 f14eaa0a6faed4f5bb28a689108141c0',
}
BLOB = {k: dict(zip(IDS, v.split())) for k, v in BLOB.items()}

def img(bid, alt, w):
    return f'<img src="/_blob/{bid}" alt="{alt}" width="{w}" height="{w}" style="display:block;image-rendering:pixelated">'
def label(t, top=26):
    return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 10px">{t}</div>'
def p(t, size=19, color=INK, mb=8):
    return f'<p style="margin:0 0 {mb}px;font-size:{size}px;line-height:1.4;color:{color}">{t}</p>'

b = f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">Icon grid · device pixels</div>'
b += f'<h1 style="margin:6px 0 16px;font-size:38px;line-height:1.1;color:{NAVY}">Sharp at 2x and 3x</h1>'
b += p('You want the grid itself to make sharp icons, with no extra work. The arithmetic: your 5K draws 2 device pixels per px and an iPhone 3, so a position is sharp on both only if it is a whole px. ½px is sharp on the 5K only, ⅓px on the iPhone only.')

b += label('What that means for the grid', 18)
rules = [
    'Every straight edge sits on a whole px, so the line and every part are whole px. <b>1½px can\'t be sharp on both.</b> Your "Weight wise 1.5" can be kept as a proportion (the line is 1/16 of the badge), not as 1½px.',
    'The lattice is 1px, not ⅓px. Halves, quarters and eighths of the coin come out whole; thirds and sixths round to the nearest px. A post can\'t be ⅚ of the line, so posts become the line.',
    'Optical centring moves in whole px. A symmetric icon centres exactly when its middle stem is an even width (2px is).',
    'An icon shows only at the size it is drawn (or 2x, 3x that). 18 and 23 can\'t reuse the 24 drawing, so the selected pin grows its ring, not the icon. The 12px chip needs its own drawing.',
    'Curves, diagonals and tips (the star, the roof, the tree) can\'t be whole on any grid. The rule holds for straight edges only.',
]
b += f'<div style="display:grid;grid-template-columns:22px 1fr;gap:6px 8px;font-size:18px;line-height:1.4">'
for t in rules:
    b += f'<div style="color:{ORANGE};font-weight:700">•</div><div>{t}</div>'
b += '</div>'

b += label('The grids that keep your rule', 26)
b += p('Each row is one grid. Big: one block per iPhone device pixel. Small: the 5K\'s pixels, then true size. These are previews: the approved six moved onto each grid once, not yet redrawn. The star keeps its drawn line.', 16, GREY, 12)
opts = [
    ('now', 'Today: 1½px line on a ⅓px lattice', 24, 'For comparison. 40 of 50 straight edges are soft on an iPhone, 41 on the 5K.'),
    ('A', 'A · 24px badge, 2px line', 24, 'Sharp on both screens. A third heavier than the line you chose, and holes shrink (the cup\'s ear closes). Posts drop to 1px.'),
    ('B', 'B · 32px badge, 2px line', 32, 'Sharp on both screens. The same proportion as your 1½px in 24, just a third bigger: badges are 32 in rows and on the map, and the selected pin is 40.'),
    ('C', 'C · 24px badge, 1px line', 24, 'Sharp on both screens. A third lighter; the + loses 38% of its ink.'),
]
for key, title, size, note in opts:
    b += f'<div style="padding:14px 0;border-top:1px solid {RULE}"><div style="font-size:20px;font-weight:700;color:{NAVY};margin-bottom:8px">{title}</div>'
    b += '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">' + ''.join(img(BLOB[(key, 3)][i], f'{NAMES[i]}, {title}, iPhone pixels', size * 3) for i in IDS) + '</div>'
    if (key, 2) in BLOB:
        b += '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;margin-top:8px">' + ''.join(img(BLOB[(key, 2)][i], f'{NAMES[i]}, {title}, 5K pixels', size * 2) for i in IDS)
        b += '<div style="width:16px"></div>' + ''.join(img(BLOB[(key, 3)][i], f'{NAMES[i]}, {title}, true size', size) for i in IDS) + '</div>'
    b += f'<div style="font-size:17px;line-height:1.4;margin-top:8px">{note}</div></div>'

b += label('Recommended: B', 24)
b += p('B is the only grid whose straight edges are sharp on both screens and that keeps the weight you picked: the line is 1/16 of the badge, as now. It costs size, not weight: badges grow from 24 to 32px. One construction per badge size (32, and 16 for the chip with a 1px line, the same proportion) and no per-screen work.')

b += label('Waiting on you', 22)
b += (f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:12px 0;border-top:1px solid {RULE}"><div style="font-size:24px;font-weight:700;color:{ORANGE}">1</div>'
      f'<div style="font-size:20px;line-height:1.35;color:{NAVY};font-weight:600">B (32px badge, 2px line, your proportion), or A (heavier at 24) or C (lighter at 24)?</div></div>')

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
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'stills', 'wholegrid', 'raw'))
local = page
for (o, d), m in BLOB.items():
    for i, bid in m.items():
        local = local.replace(f'/_blob/{bid}', f'file://{G}/{o}-{i}-{d}x.png')
open(OUT.replace('.dc.html', '.local.html'), 'w').write(local)
print(OUT, H)
