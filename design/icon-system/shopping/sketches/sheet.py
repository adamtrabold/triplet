#!/usr/bin/env python3
"""Contact sheet for Shopping jam turn 2: every sketch at 72 and at 24 in the badge (1:1, the system's rule 1), at 18 in
the 24 ring (how index.html draws a glyph today), 12 bare (the filter chip), and in a street of pins beside the six.

    python3 -I sheet.py            -> sheet.html, paths.json (next to this file)
then  NODE_PATH=/opt/node-tools/node_modules node shoot.js   -> contact-sheet.png (2x), contact-sheet-1x.png
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import shapes as S  # noqa: E402

NAVY, PAPER, TILE, LAV, GREY, ORANGE = '#12293F', '#FAF5EA', '#F2EBDD', '#8A7AA8', '#5A564C', '#EE7434'
SIX = json.load(open(os.path.join(HERE, 'six.json')))
SIX_ORDER = [('cafe', 'Café'), ('bar', 'Bar'), ('museum', 'Museum'), ('nature', 'Nature')]

uid = [0]
def glyph(parts, holes, fill):
    uid[0] += 1
    m = f'm{uid[0]}'
    if not holes:
        return ''.join(f'<path fill="{fill}" d="{p}"/>' for p in parts)
    return (f'<defs><mask id="{m}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>'
            + ''.join(f'<path d="{h}" fill="#000"/>' for h in holes) + f'</mask></defs><g mask="url(#{m})">'
            + ''.join(f'<path fill="{fill}" d="{p}"/>' for p in parts) + '</g>')

def badge(inner, px, ink=NAVY, field=TILE, scale=1.0):
    g = inner if scale == 1 else f'<g transform="translate(12 12) scale({scale}) translate(-12 -12)">{inner}</g>'
    return (f'<svg width="{px}" height="{px}" viewBox="0 0 24 24" style="display:block">'
            f'<circle cx="12" cy="12" r="11" fill="{field}" stroke="{ink}" stroke-width="2"/>{g}</svg>')

def bare(inner, px):
    return f'<svg width="{px}" height="{px}" viewBox="0 0 24 24" style="display:block">{inner}</svg>'

def six_glyph(k, fill): return f'<path fill="{fill}" fill-rule="evenodd" d="{SIX[k]}"/>'

SET = sys.argv[1] if len(sys.argv) > 1 else 't2'
LIST = {'t2': S.CONCEPTS, 't5': S.ROUND5, 'r2': S.ROUND2}[SET]
SUFFIX = '' if SET == 't2' else '-' + SET
paths = {}
cards = []
for code, name, src, fn in LIST:
    parts, holes = fn()
    paths[code] = ' '.join(parts)   # (ink measured without holes for the box; see notes for real ink)
    nv = glyph(parts, holes, NAVY)
    street = ''.join(f'<div>{badge(six_glyph(k, NAVY), 24)}</div>' for k, _ in SIX_ORDER[:2]) + f'<div>{badge(glyph(parts, holes, NAVY), 24)}</div>' + \
        ''.join(f'<div>{badge(six_glyph(k, NAVY), 24)}</div>' for k, _ in SIX_ORDER[2:]) + f'<div>{badge(glyph(parts, holes, NAVY), 24)}</div>'
    lav = (f'<div>{badge(glyph(parts, holes, LAV), 24, ink=LAV, scale=0.75)}</div>'
           f'<div>{badge(glyph(parts, holes, LAV), 24, ink=LAV, scale=0.75)}</div>'
           f'<div>{badge(glyph(parts, holes, TILE), 24, ink=LAV, field=LAV, scale=1)}</div>')
    cards.append(f'''<div class="card"><div class="hd"><b>{code}</b> {name}<span>{src}</span></div><div class="ink" data-g="{code}"></div>
<div class="row"><div>{badge(nv, 72)}</div><div class="col"><div class="sz">{badge(nv, 24)}<i>24</i></div>
<div class="sz">{badge(nv, 24, scale=0.75)}<i>18 in ring</i></div><div class="sz">{bare(nv, 12)}<i>12</i></div></div></div>
<div class="strip">{street}</div><div class="strip">{lav}</div></div>''')

sixrow = ''.join(f'<div class="sz">{badge(six_glyph(k, NAVY), 24)}<i>{n}</i></div>' for k, n in SIX_ORDER)
html = f'''<!doctype html><html><head><meta charset="utf-8"><title>Shopping sketches</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap">
<style>body{{margin:0;background:{PAPER};font:13px/1.35 Archivo,sans-serif;color:{NAVY}}}
.page{{width:1000px;padding:28px}} h1{{font-size:22px;margin:0 0 4px}} p{{margin:0 0 14px;color:{GREY}}}
.six{{display:flex;gap:16px;margin-bottom:18px;align-items:flex-end}}
.grid{{display:grid;grid-template-columns:repeat({4 if SET == 't2' else 3},1fr);gap:14px}}
.card{{background:#fff8;border:1px solid #D8CEBA;padding:10px}} .hd{{margin-bottom:8px}} .hd span{{float:right;color:{GREY};font-size:11px}}
.row{{display:flex;gap:12px;align-items:center}} .col{{display:flex;flex-direction:column;gap:6px}}
.sz{{display:flex;align-items:center;gap:6px}} .sz i{{font-style:normal;font-size:10px;color:{GREY}}}
.strip{{display:flex;gap:4px;margin-top:8px}} .ink{{font-size:11px;color:{GREY};margin:-4px 0 8px}}</style></head><body><div class="page">
<h1>Shopping, jam turn { {'t2': '2: sketches', 't5': '5: the concepts drawn', 'r2': '9: the plain bag'}[SET] }</h1>
<p>Each card: 72; 24 in the badge (drawn 1:1); 18 in the 24 ring (how the app draws glyphs today); 12 bare (chip). Strip 1: a street at 24 beside Café, Bar, Museum, Nature. Strip 2: lavender as in the app (18 in ring, x2) and selected (reversed).</p>
<div class="six">{sixrow}</div><div class="grid">{''.join(cards)}</div></div></body></html>'''
# net ink, holes subtracted, measured in the page (rasterised at 20px a unit, alpha summed), against Café and Museum
G = {code: glyph(*fn(), '#000') for code, _, _, fn in LIST}
G.update({n: six_glyph(k, '#000') for k, n in SIX_ORDER})
script = '<script>const G=' + json.dumps(G) + ''';
(async()=>{const out={};for(const[k,inner]of Object.entries(G)){const img=new Image();
img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 24 24">'+inner+'</svg>');
await img.decode();const c=document.createElement('canvas');c.width=c.height=480;const x=c.getContext('2d');x.drawImage(img,0,0);
const d=x.getImageData(0,0,480,480).data;let a=0;for(let i=3;i<d.length;i+=4)a+=d[i]/255;out[k]=a/400;}
for(const el of document.querySelectorAll('.ink')){const v=out[el.dataset.g];
el.textContent=`net ink ${v.toFixed(1)} px\u00b2 \u00b7 Caf\u00e9 ${out['Caf\u00e9'].toFixed(1)} (${(100*v/out['Caf\u00e9']).toFixed(0)}%) \u00b7 Museum ${out['Museum'].toFixed(1)} (${(100*v/out['Museum']).toFixed(0)}%)`;}
document.title='measured';window.INK=out;})();</script>'''
html = html.replace('</body>', script + '</body>') if SET != 't2' else html
open(os.path.join(HERE, f'sheet{SUFFIX}.html'), 'w').write(html)
json.dump(paths, open(os.path.join(HERE, f'paths{SUFFIX}.json'), 'w'))
print('ok', len(cards))
