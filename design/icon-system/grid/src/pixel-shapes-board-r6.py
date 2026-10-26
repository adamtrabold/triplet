#!/usr/bin/env python3
"""Writes the canvas board "Sharp at 2x and 3x" (Grid7Sharp.dc.html), round 6: parts as shapes (src/pixel-shapes.js), after the
owner's five marks on v262 and his two notes on v264. Images: stills/pixel-shapes/ (uploaded to the canvas's asset store; BLOB).
  python3 -I src/pixel-shapes-board.py <out.dc.html> [height]   (also writes <out>.local.html with local images, to measure)"""
import os, sys
OUT, H = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 2400
HERE = os.path.dirname(os.path.abspath(__file__))
NAVY, ORANGE, DEEP, GREY, RULE, PAPER, INK = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#1A1A18'
BLOB = {
    'pix-before-2x': '2e5182f2718d4a95071d9125f9ba41b3', 'pix-after-2x': 'd472c67039caf8c02430eafb768d79be',
    'pix-before-3x': 'fd4e93b5354e645ed9894d25e5bd6b9c', 'pix-after-3x': '1b6aa8d287e2ecbaa0d0d8f132a9b4e0',
    'true-before': 'c22e272ebe1f4d814915fd6b6490609e', 'true-after': '5ac6c0d7cf78855336e01de37908da70',
    'museum-72': '5992883c8977c75c5abdb40474586bee', 'museum-24': 'c6b4f2a850f776049846051adfa39389',
    'coupe-72': '1efe28b7dc85d88182ce8c325dcb2889', 'coupe-24': '1ddc9d4ef28cd50019dccefb37c153e4',
    'knife-72': '23d32e118228458c3a78828eedd23e01', 'knife-pix-2x': 'b295ebb3ef5ac8cece8b4de011e2441c', 'knife-pix-3x': 'bf61301355f666608a62aff9b2402f24',
    'ctx-row-before-3x': '3a1802655944a5906740f11df09172aa', 'ctx-row-after-3x': '2332f26a01b32a85ac62d7c66f79db1f',
    'ctx-tag-starred-before-3x': 'cb95d970b36fca01f5710507ad46e077', 'ctx-tag-starred-after-3x': 'a16be33209ee27709306be016eacc96d',
    'ctx-tag-open-before-3x': 'bbd4607d9e429e2509df94f073718637', 'ctx-tag-open-after-3x': '2415281bffa72076ac19c1848602ff20',
    'ctx-plus-before-3x': '0341f6126fb59c5c0619f4d9eaa8e134', 'ctx-plus-after-3x': 'd5d8bf689724dbadfa9ecc9b57e5c352',
    'ctx-pix-2x': '92aa396eb9242f2b5cb02b2c769a1259', 'ctx-pix-3x': '3f2634cfac95dc092bfafa5738d29082',
}
LOCAL = os.path.abspath(os.path.join(HERE, '..', 'stills', 'pixel-shapes'))

def img(k, alt, w, local, pix=True):
    src = f'file://{LOCAL}/{k}.png' if local else f'/_blob/{BLOB[k]}'
    return f'<img src="{src}" alt="{alt}" width="{w}" style="display:block;{"image-rendering:pixelated;" if pix else ""}">'
def label(t, top=26):
    return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 10px">{t}</div>'
def p(t, size=19, color=INK, mb=8):
    return f'<p style="margin:0 0 {mb}px;font-size:{size}px;line-height:1.4;color:{color}">{t}</p>'
def bullets(items, size=17):
    return f'<div style="display:grid;grid-template-columns:20px 1fr;gap:5px 8px;font-size:{size}px;line-height:1.4">' + ''.join(f'<div style="color:{ORANGE};font-weight:700">•</div><div>{t}</div>' for t in items) + '</div>'
def cap(t):
    return f'<div style="font-size:15px;color:{GREY};margin:4px 0 0">{t}</div>'

def heads(cols, w):
    return f'<div style="display:grid;grid-template-columns:repeat({len(cols)},{w}px);font-size:14px;font-weight:700;color:{NAVY};margin-top:4px">' + ''.join(f'<div>{c}</div>' for c in cols) + '</div>'

def board(local):
    b = f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">Icon grid · device pixels · parts as shapes</div>'
    b += f'<h1 style="margin:6px 0 12px;font-size:38px;line-height:1.1;color:{NAVY}">Sharp at 2x and 3x</h1>'
    b += p('Your marks, built into the grid: slabs and counters are shapes on whole pixels, and the star and the + are drawn where they live. The line stays 1½px. The engine builds it from the rules; no fitting pass.', 18)
    b += p('Soft straight edges in the six: 5K 35 → 5, iPhone 47 → 22 (of 64). Fork and knife: 13 / 18 → 2 / 5.', 18, NAVY)

    b += label('The rules', 14)
    b += bullets([
        '<b>Shapes are whole pixels.</b> A slab (beam, plinth, saucer, foot) is 2px, the first whole pixel not thinner than the line; its flat edges and a curve\'s flat side and lowest point land whole.',
        '<b>The line stays 1½px</b> (posts, walls, rims, stems): one edge whole, the other on a half pixel.',
        '<b>Counters are whole pixels, at least 2px</b> (openings, the coupe\'s band, the cup\'s ear). Gaps between parts: whole, at least 1px.',
        '<b>No ink under 1½px.</b> Only a cap\'s ends, where its curve runs out, reach 1px (half its 2px middle: the cap rule, kept).',
        '<b>What must stick out sticks out at least 1px</b> (the knife\'s edge, a step, a lip): the join\'s ½px round eats the first ½px.',
        '<b>Symmetric icons stay on the centre line;</b> a part centred on it lands whole only at an even width.',
        '<b>The star and the + are drawn 1:1 where they live,</b> sized by what sits beside them, never in a ring.',
    ], 16)

    b += label('At 24px, one block per device pixel', 20)
    b += f'<div style="display:grid;grid-template-columns:130px 560px;gap:6px 12px;align-items:center">'
    b += '<div></div>' + f'<div style="display:grid;grid-template-columns:repeat(5,96px);gap:20px;font-size:14px;font-weight:700;color:{NAVY}">' + ''.join(f'<div>{n}</div>' for n in ['Café', 'Bar (A)', 'Museum (A)', 'Nature', 'Restaurant']) + '</div>'
    for t, k in [('5K, before', 'pix-before-2x'), ('5K, now', 'pix-after-2x'), ('iPhone, before', 'pix-before-3x'), ('iPhone, now', 'pix-after-3x')]:
        b += f'<div style="font-size:15px;font-weight:700;color:{NAVY}">{t}</div>' + img(k, t, 560, local)
    b += f'<div style="font-size:15px;font-weight:700;color:{NAVY}">True size, before / now</div><div style="display:flex;gap:24px;align-items:center">' + img('true-before', 'before, true size', 168, local, False) + img('true-after', 'now, true size', 168, local, False) + '</div></div>'
    b += cap('Before: the latest of each (café as placed on v262; the rest with posts at the line). What you can see: the saucer a 2px shape with 1px ends (was 1½, ¾ ends); the cup\'s ear opening 2px (was 1½); the museum\'s openings 2px (0.93) with beam and plinth 2px (1½); the coupe\'s band 2px (¾); the fork\'s tines 1px apart (¾). The tree is unchanged.')

    col = 'display:grid;grid-template-columns:1fr 1fr;gap:0 28px'
    b += f'<div style="{col}">'
    b += '<div>' + label('Your question: the museum\'s width', 22)
    b += p('Yes, it follows. Four 1½px columns and three 2px openings are 12px; with the beam\'s ½px past each side, 13px (was 9.8), and taller by the same rules. To keep its size it drops a column.', 15)
    b += img('museum-72', 'museum: approved, A, B, C at 72px', 340, local, False) + '<div style="padding-left:8px">' + heads(['Approved', 'A', 'B', 'C'], 84) + '</div>' + img('museum-24', 'museum options at 24px', 292, local, False)
    b += bullets(['<b>A</b> four columns: sharp on the 5K (0 soft, iPhone 10); the biggest of the six, 13 × 12.4, ink +60%.',
                  '<b>B</b> three columns, same size (ink +13%): its middle column sits on the centre line and can\'t land (12 / 12).',
                  '<b>C</b> three, posts 2px: every edge whole but the ½px capital steps (0 / 6); ink +38%.'], 15)
    b += p('We lean A: it is the building you described; its cost is size.', 15, GREY) + '</div>'
    b += '<div>' + label('The coupe at a 2px band', 22)
    b += p('The bowl is one ellipse 4/5 as tall as wide, so a 2px band under a 1½px rim leaves less room for the drink.', 15)
    b += img('coupe-72', 'coupe: approved, A, B, C at 72px', 340, local, False) + '<div style="padding-left:8px">' + heads(['Approved', 'A', 'B', 'C'], 84) + '</div>' + img('coupe-24', 'coupe options at 24px', 292, local, False)
    b += bullets(['<b>A</b> same glass: drink 1½px at its deepest (was about 2½). 2 / 4 soft.',
                  '<b>B</b> drink kept at 2½: the glass grows to 12 wide, 6 deep. 2 / 4.',
                  '<b>C</b> band 1½px, your "the empty part should be equal to the thickness of the stroke". Drink 2. 2 / 3.'], 15) + '</div></div>'

    b += label('The knife\'s edge, by rule', 22)
    b += f'<div style="display:flex;gap:20px;align-items:center">' + img('knife-72', 'fork and knife, before and now, 72px', 256, local, False) + img('knife-pix-2x', '5K pixels, before and now', 130, local) + img('knife-pix-3x', 'iPhone pixels, before and now', 130, local) + '</div>'
    b += p('The join where the blade meets the handle takes a ½px round, so a ¾px step showed ¼px, under one 5K pixel. At 1px, ½px of straight step survives: a full pixel on the 5K, 1½ on an iPhone. Before / now at 72, on the 5K, on an iPhone.', 15)

    b += label('The star and the +, where they live', 22)
    b += bullets(['<b>Row:</b> the star is the name\'s capital height, 11px tall (the old rule gave 12.1 here; the boards showed it 16 tall).',
                  '<b>Hanging Tag:</b> 13px tall, the size of the compass and the check beside it (the old rule gave 13.4: it already fit).',
                  '<b>+ button:</b> 1:1, 14px across, 2px stroke: every end and edge whole (was 13.2 across, 1⅔ stroke, soft 6 / 8; now 0 / 0). A touch bolder.'], 15)
    b += f'<div style="display:grid;grid-template-columns:300px 300px 160px;gap:8px 14px;align-items:center;margin-top:8px">'
    b += f'<div style="font-size:14px;font-weight:700;color:{NAVY}">Before</div><div style="font-size:14px;font-weight:700;color:{NAVY}">Now</div><div style="font-size:14px;font-weight:700;color:{NAVY}">+ before / now</div>'
    b += img('ctx-row-before-3x', 'row before', 300, local, False) + img('ctx-row-after-3x', 'row now', 300, local, False)
    b += '<div style="display:flex;gap:10px">' + img('ctx-plus-before-3x', '+ before', 68, local, False) + img('ctx-plus-after-3x', '+ now', 68, local, False) + '</div>'
    b += img('ctx-tag-open-before-3x', 'tag before', 300, local, False) + img('ctx-tag-open-after-3x', 'tag now', 300, local, False) + '<div></div></div>'
    b += cap('True size on a phone (shot at 3x). Below, per device pixel (5K, then iPhone): row star, tag star, +, each before / now.')
    b += f'<div style="display:flex;gap:16px;margin-top:6px">' + img('ctx-pix-2x', 'star and + on the 5K', 430, local) + img('ctx-pix-3x', 'star and + on an iPhone', 430, local) + '</div>'
    b += cap('Shipping note (CSS, not drawing): the row star\'s box sits on a half pixel today and the + button 0.22px off; the "now" shots put both on whole pixels.')

    b += label('What still can\'t land', 22)
    b += bullets(['The 1½px line is 3 pixels on the 5K (sharp) and 4½ on an iPhone: one side stays half a pixel soft. Most of the iPhone\'s 22.',
                  'A 1½px stem on the centre line (coupe\'s stem, trunk) sits at 11.25–12.75: soft on both. At 2px it lands, but heavier than the line.',
                  'The capitals\' ½px steps (soft on an iPhone); curves, diagonals and tips, as before. Shopping is open for its own round.'], 15)

    b += label('Waiting on you', 22)
    for i, q in enumerate(['Museum: A (four columns, bigger), B (three, same size) or C (three, 2px posts)?',
                           'Coupe: A (2px band, less drink), B (bigger glass) or C (band at 1½)?',
                           'Do the star (11 in the row, 13 on the tag) and the + (14 across, 2px) sit right in their places?'], 1):
        b += f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:9px 0;border-top:1px solid {RULE}"><div style="font-size:22px;font-weight:700;color:{ORANGE}">{i}</div><div style="font-size:18px;line-height:1.35;color:{NAVY};font-weight:600">{q}</div></div>'
    return f'<div style="width:940px;box-sizing:border-box;padding:32px 32px 24px;background:{PAPER};font-family:Archivo,Arial,sans-serif;color:{INK}">' + b + '</div>'

HEAD = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Sharp at 2x and 3x</title>\n<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">\n<style>\nbody{margin:0}\n</style>\n</helmet>\n'
TAIL = '\n</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'{"$preview":{"width":940,"height":%d}}\'>\nclass Component extends DCLogic {\nrenderVals() { return {}; }\n}\n</script>\n</body>\n</html>\n'
open(OUT, 'w').write(HEAD + board(False) + TAIL % H)
open(OUT + '.local.html', 'w').write('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap"><style>body{margin:0}</style></head><body>' + board(True) + '</body></html>')
print('wrote', OUT)
