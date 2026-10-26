#!/usr/bin/env python3
"""Writes the canvas board "Sharp at 2x and 3x" (Grid7Sharp.dc.html), round 7 (canvas v267+): the director's five fixes on v266
(jam turn 182). Round 6's script is kept as src/pixel-shapes-board-r6.py. Images: stills/pixel-shapes/r7/ (this round) and
stills/pixel-shapes/ (round 6, reused: the knife and the app shots), uploaded to the canvas's asset store (BLOB).
  python3 -I src/pixel-shapes-board.py <out.dc.html> [height]   (also writes <out>.local.html with local images, to measure)"""
import os, sys
OUT, H = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 2400
HERE = os.path.dirname(os.path.abspath(__file__))
NAVY, ORANGE, DEEP, GREY, RULE, PAPER, INK = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#1A1A18'
BLOB = {}   # filled after upload (key -> asset id)
BLOB_FILE = os.path.join(HERE, 'pixel-shapes-board-blobs.json')
if os.path.exists(BLOB_FILE):
    import json
    BLOB = json.load(open(BLOB_FILE))
S6 = os.path.abspath(os.path.join(HERE, '..', 'stills', 'pixel-shapes'))
S7 = S6 + '/r7'
R6 = {'knife-72', 'knife-pix-2x', 'knife-pix-3x', 'ctx-row-before-3x', 'ctx-row-after-3x', 'ctx-tag-open-before-3x', 'ctx-tag-open-after-3x'}

def img(k, alt, w, local, pix=True):
    src = f'file://{S6 if k in R6 else S7}/{k}.png' if local else f'/_blob/{BLOB[k]}'
    return f'<img src="{src}" alt="{alt}" width="{w}" style="display:block;{"image-rendering:pixelated;" if pix else ""}">'
def label(t, top=26):
    return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 10px">{t}</div>'
def p(t, size=19, color=INK, mb=8, w=600):
    return f'<p style="margin:0 0 {mb}px;font-size:{size}px;line-height:1.4;color:{color};font-weight:{400 if w == 600 else w}">{t}</p>'
def bullets(items, size=16):
    return f'<div style="display:grid;grid-template-columns:20px 1fr;gap:5px 8px;font-size:{size}px;line-height:1.4">' + ''.join(f'<div style="color:{ORANGE};font-weight:700">•</div><div>{t}</div>' for t in items) + '</div>'
def cap(t):
    return f'<div style="font-size:15px;color:{GREY};margin:4px 0 0;line-height:1.4">{t}</div>'
def head(t):
    return f'<div style="font-size:14px;font-weight:700;color:{NAVY}">{t}</div>'

def board(local):
    b = f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">Icon grid · device pixels · parts as shapes</div>'
    b += f'<h1 style="margin:6px 0 12px;font-size:38px;line-height:1.1;color:{NAVY}">Sharp at 2x and 3x</h1>'
    b += p('Your marks, built into the grid: slabs and counters are shapes on whole pixels; the line stays 1½px; no fitting pass. Judge the six by eye in the rows; the counts are ours.', 18)
    b += f'<div style="border-left:4px solid {ORANGE};padding:6px 0 6px 14px;margin:6px 0 4px">' + p('<b>Why an iPhone still shows 21 soft edges:</b> the 1½px line you kept is 4½ iPhone pixels, so one side of each line is ⅙px soft. Sharp would mean a 2px line or a per-screen pass; you turned down both.', 17, NAVY, 4) + p('Soft straight edges in the six (as the questions below lean): 5K 35 → 5, iPhone 47 → 21. Fork and knife 13 / 18 → 2 / 5.', 16, GREY, 0) + '</div>'

    b += label('The rules', 18)
    b += bullets([
        '<b>Shapes are whole pixels.</b> A slab (beam, plinth, saucer, foot) is 2px; its flat edges and lowest point land whole.',
        '<b>The line stays 1½px</b> (posts, walls, rims, stems): one edge whole, the other on a half pixel.',
        '<b>Counters are whole pixels, at least 2px</b>; gaps at least 1px. <b>One exception</b> (coupe C), from your 10-21 words: a band under a rim "equal to the thickness of the stroke", 1½px. Your latest, on v264, asked the other way: "maybe they could go up to 2px?" (A, B).',
        '<b>No ink under 1½px,</b> but a cap\'s ends, where its curve runs out (1px: the cap rule, kept).',
        '<b>What must stick out sticks out at least 1px</b> (the knife\'s edge, now 1px past its handle, as on v266; a lip). <b>A bevel is not a protrusion:</b> the museum\'s ½px overhang is all curve, column into slab (your "bevel of the plinth ends into the columns"), so it stays ½px, its ends on a half pixel.',
        '<b>Symmetric icons sit on the centre line, or ¼px off it</b> when a 1½px part is centred, so that part keeps one whole edge like every other line (museum B¼, the + at 1½).',
        '<b>The star and the + are drawn 1:1 where they live,</b> sized by their neighbours, never in a ring.',
    ], 15)

    b += label('The six at 24, one block per device pixel', 18)
    hd = lambda names: f'<div style="display:grid;grid-template-columns:repeat(5,1fr);font-size:13px;font-weight:700;color:{NAVY}">' + ''.join(f'<div>{n}</div>' for n in names) + '</div>'
    b += f'<div style="display:grid;grid-template-columns:70px 400px 400px;gap:6px 16px;align-items:center"><div></div>' + head('Before (as approved, posts at the line)') + head('Now (as the questions lean)') + '<div></div>' + hd(['Café', 'Coupe', 'Museum', 'Nature', 'Restaurant']) + hd(['Café', 'Coupe C', 'Museum B¼', 'Nature', 'Restaurant'])
    for t, d in [('5K', '2x'), ('iPhone', '3x')]:
        b += f'<div style="font-size:15px;font-weight:700;color:{NAVY}">{t}</div>' + img(f'pix-before-{d}', f'{t}, before', 400, local) + img(f'pix-after-{d}', f'{t}, now', 400, local)
    b += '</div>'
    b += cap('Visible: saucer, beam and plinth 2px shapes; ear and openings 2px; three columns; the coupe\'s band 1½ (was ¾); tines 1px apart.')

    b += label('The museum in the six', 18)
    b += p('Your question: four 1½px columns with 2px openings make it 13px wide (was 9.8); to keep its size it drops a column. Only the museum changes between rows (coupe C in each). At 24, true size:', 15)
    rows = [('was_museum', 'Approved', 'four columns, 9.8 wide × 9.6 tall; openings under 1px.'),
            ('museumA', 'A', 'four columns, 13 × 12.3, ink +60%: the biggest of the set; it crowds its ring. 0 / 10 soft.'),
            ('museumB4', 'B¼', 'three columns, 9.5 × 11.7, ink +13%: as narrow as approved, but 2px taller (4px columns, 2px slabs). Sits ¼px right. 0 / 6.'),
            ('museumC', 'C', 'three columns at 2px, 11 × 12, ink +38%: the posts read a third heavier than the line. 0 / 6.')]
    b += f'<div style="display:grid;grid-template-columns:84px 168px 1fr;gap:6px 14px;align-items:center">'
    for k, n, t in rows:
        b += f'<div style="font-size:17px;font-weight:700;color:{NAVY}">{n}</div>' + img(f'row-{k}-3x', f'the six with museum {n}, true size', 168, local, False) + f'<div style="font-size:14px;line-height:1.35">{t}</div>'
    b += '</div>'
    b += p('At 72, drawn at 72:', 15, INK, 4)
    b += f'<div style="display:grid;grid-template-columns:408px 408px;gap:4px 28px">'
    for k, n, _ in rows:
        b += '<div>' + head(n) + img(f'row72-{k}-2x', f'the six with museum {n} at 72', 408, local, False) + '</div>'
    b += '</div>'
    b += cap('We lean B¼ (an opinion): it sits at the set\'s size and weight, posts at the line; it is taller than approved. B (the same drawing centred) is dropped: it was B¼, only softer (12 / 12).')

    b += label('The coupe at a 2px band', 18)
    b += p('<b>What changed in every option:</b> the rim now cuts the bowl\'s ellipse ¼ of its height above the centre (was ⅕), so the bowl is 5px deep (was 4.8) and its bottom lands whole. With a 2px band, 2½px of drink needs a 6px bowl: wider (B), or deeper, which you ruled out ("the shorter bowl i think is necessary").', 15)
    b += f'<div style="display:grid;grid-template-columns:350px 1fr;gap:0 18px;align-items:start">'
    b += '<div>' + img('coupe-72', 'coupe approved, A, B, C at 72px', 340, local, False) + f'<div style="display:grid;grid-template-columns:repeat(4,84px);padding-left:8px;margin:2px 0">' + ''.join(head(c) for c in ['Approved', 'A', 'B', 'C']) + '</div>' + img('coupe-24', 'coupe options at 24px', 292, local, False) + '</div>'
    tr = lambda cells, bold=False: ''.join(f'<div style="padding:4px 0;border-top:1px solid {RULE};font-size:14px;{"font-weight:700;color:" + NAVY if bold else ""}">{c}</div>' for c in cells)
    b += f'<div><div style="display:grid;grid-template-columns:110px repeat(4,1fr);gap:0 8px">' + tr(['', 'Approved', 'A', 'B', 'C'], True)
    b += tr(['<b>Drink</b>', '2½', '1½', '2½', '2']) + tr(['Band', '¾', '2', '2', '1½']) + tr(['Bowl', '10 × 4.8', '10 × 5', '12 × 6', '10 × 5']) + tr(['Ink', '45.5', '42.4', '59.4', '45.1']) + tr(['Soft 5K / iPhone', '11 / 10', '2 / 4', '2 / 4', '2 / 3']) + '</div>'
    b += cap('<b>C has ½px less drink than approved</b> (2 against 2½), in the same glass. B keeps the drink, in a bigger glass (ink +30%). A has much less (1½). We lean C (an opinion); if the band must be 2px, B.') + '</div></div>'

    # the knife's section (v266/v267) is on the archived boards; unchanged since v266, in one line in the rules

    b += label('The star and the +, where they live', 18)
    b += p('<b>In the app the star was already about this size; our boards drew it 16px tall in a ring.</b> It is now 11px in the row (the name\'s capital height; was 12.1) and 13 on the Hanging Tag (its neighbours\'; was 13.4).', 15)
    b += p('<b>The +: which weight?</b> 14px across, ends whole. 2px: a third heavier than the line you kept (ink +26%), sharp everywhere. 1½px: your weight, set ¼px off the arms\' centre; one side soft on an iPhone like every line, the arms ½px unequal (6½, 6).', 15, INK, 6)
    b += f'<div style="display:grid;grid-template-columns:270px 270px 76px 76px 76px;gap:4px 10px;align-items:center">' + head('Row star, before') + head('Row star, now') + head('+ before') + head('2px') + head('1½, ¼ off')
    b += img('ctx-row-before-3x', 'row before', 270, local, False) + img('ctx-row-after-3x', 'row now', 270, local, False)
    b += img('plus-btn-before-3x', '+ before', 68, local, False) + img('plus-btn-after-3x', '+ at 2px', 68, local, False) + img('plus-btn-after15-3x', '+ at 1½px', 68, local, False) + '</div>'
    b += f'<div style="display:flex;gap:14px;margin-top:6px;align-items:center">' + img('plus-pix-2x', '+ on the 5K: before, 2px, 1½px', 239, local) + img('plus-pix-3x', '+ on an iPhone: before, 2px, 1½px', 239, local)
    b += '<div style="font-size:14px;color:#5A564C;line-height:1.35">In the app at true size; the + per device pixel, 5K then iPhone, each before / 2px / 1½. Soft: 6 / 8, 0 / 0, 0 / 4. The button and the row star\'s box move onto whole pixels (CSS).</div></div>'

    b += label('What still can\'t land', 18)
    b += p('The 1½px line on an iPhone (one side ⅙px soft); the coupe\'s stem and the trunk on the centre line (the ¼px rule would soften their feet instead); the capitals\' steps and bevels\' ends on half pixels; curves, diagonals, tips. Shopping is its own round.', 15)

    b += label('Waiting on you', 18)
    for i, q in enumerate(['Museum, in the row: A (four columns, 13 wide), B¼ (three columns, the approved width, 2px taller) or C (three columns, 2px posts)?',
                           'Coupe: C (band at the line, same glass, ½px less drink than approved), B (2px band, drink kept, a bigger glass) or A (2px band, much less drink)?',
                           'The +: 2px, or your 1½px set ¼px off centre?',
                           'Do the star (11 in the row, 13 on the tag) and the + sit right in their places?'], 1):
        b += f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:6px 0;border-top:1px solid {RULE}"><div style="font-size:22px;font-weight:700;color:{ORANGE}">{i}</div><div style="font-size:18px;line-height:1.35;color:{NAVY};font-weight:600">{q}</div></div>'
    return f'<div style="width:940px;box-sizing:border-box;padding:30px 32px 16px;background:{PAPER};font-family:Archivo,Arial,sans-serif;color:{INK}">' + b + '</div>'

HEAD = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Sharp at 2x and 3x</title>\n<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">\n<style>\nbody{margin:0}\n</style>\n</helmet>\n'
TAIL = '\n</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'{"$preview":{"width":940,"height":%d}}\'>\nclass Component extends DCLogic {\nrenderVals() { return {}; }\n}\n</script>\n</body>\n</html>\n'
if BLOB:
    open(OUT, 'w').write(HEAD + board(False) + TAIL % H)
open(OUT + '.local.html', 'w').write('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap"><style>body{margin:0}</style></head><body>' + board(True) + '</body></html>')
print('wrote', OUT, 'blobs' if BLOB else 'local only')
