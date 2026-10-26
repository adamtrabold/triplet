#!/usr/bin/env python3
"""Writes the canvas board "Sharp at 2x and 3x" (Grid7Sharp.dc.html), round 8 (canvas v270+): the owner's answer to v269
(museum with a 1px minimum counter; the coupe's drink; the + by eye beside every icon, centred; one star). Round 7's script is
kept as src/pixel-shapes-board-r7.py (its asset ids in pixel-shapes-board-blobs-r7.json). Images: stills/pixel-shapes/r8/.
  python3 -I src/pixel-shapes-board.py <out.dc.html> [height]   (also writes <out>.local.html with local images, to measure)"""
import os, sys, json
OUT, H = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 2400
HERE = os.path.dirname(os.path.abspath(__file__))
NAVY, ORANGE, DEEP, GREY, RULE, PAPER, INK = '#12293F', '#EE7434', '#A8400C', '#5A564C', '#D8CEBA', '#FAF5EA', '#1A1A18'
BLOB_FILE = os.path.join(HERE, 'pixel-shapes-board-blobs.json')
BLOB = json.load(open(BLOB_FILE)) if os.path.exists(BLOB_FILE) else {}
S8 = os.path.abspath(os.path.join(HERE, '..', 'stills', 'pixel-shapes', 'r8'))

def img(k, alt, w, local, pix=False):
    src = f'file://{S8}/{k}.png' if local else f'/_blob/{BLOB[k]}'
    return f'<img src="{src}" alt="{alt}" width="{w}" style="display:block;{"image-rendering:pixelated;" if pix else ""}">'
def label(t, top=24):
    return f'<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:{GREY};text-transform:uppercase;margin:{top}px 0 8px">{t}</div>'
def p(t, size=16, color=INK, mb=8):
    return f'<p style="margin:0 0 {mb}px;font-size:{size}px;line-height:1.4;color:{color}">{t}</p>'
def bullets(items, size=15):
    return f'<div style="display:grid;grid-template-columns:20px 1fr;gap:4px 8px;font-size:{size}px;line-height:1.4">' + ''.join(f'<div style="color:{ORANGE};font-weight:700">•</div><div>{t}</div>' for t in items) + '</div>'
def cap(t):
    return f'<div style="font-size:14px;color:{GREY};margin:4px 0 0;line-height:1.4">{t}</div>'
def head(t, size=14):
    return f'<div style="font-size:{size}px;font-weight:700;color:{NAVY}">{t}</div>'
def heads(names, w, gap=0, pad=0):
    return f'<div style="display:grid;grid-template-columns:repeat({len(names)},{w}px);gap:0 {gap}px;padding-left:{pad}px;margin:2px 0">' + ''.join(head(n, 13) for n in names) + '</div>'

def board(local):
    b = f'<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:{DEEP};text-transform:uppercase">Icon grid · device pixels · round 8, your v269 answers</div>'
    b += f'<h1 style="margin:6px 0 10px;font-size:38px;line-height:1.1;color:{NAVY}">Sharp at 2x and 3x</h1>'
    b += p('Your four answers, built: the museum with a 1px minimum counter; a coupe that reads full; the + judged by eye beside every icon, always centred; one star, the same in the row and on the tag. Judge by eye; the counts are ours.', 17)
    b += f'<div style="border-left:4px solid {ORANGE};padding:4px 0 4px 14px;margin:4px 0">' + p('<b>The trade you kept:</b> the 1½px line is 4½ iPhone pixels, so one side of each line is ⅙px soft there. Soft straight edges in the set as it leans (museum D, coupe E, the + at 2): 5K 35 → 5, iPhone 47 → 15.', 15, NAVY, 0) + '</div>'

    # 1. the + beside every icon
    b += label('1 · The + beside every icon (always centred)', 18)
    b += p('The set at 24, true size: café, coupe, museum, tree, fork and knife, the star, then the +, and the same + in its button. All three strokes sit dead centre, arms equal. Pick by weight, not pixels.', 15)
    rows = [('was', 'before', 'Before (1⅔, drawn at 26.4)', 'set24-was-3x'), ('p15', 'p15', '1½ (the line)', 'set24-p15-3x'), ('p175', 'p175', '1¾', 'set24-p175-3x'), ('p2', 'p2', '2', 'set24-p2-3x')]
    notes = {'was': 'ink 41; 6 / 8 soft', 'p15': 'ink 39.6; reads lighter than the glyphs, like the ring; 8 / 8 soft', 'p175': 'ink 45.8; 8 / 8 soft', 'p2': 'ink 51.9; sharp everywhere (0 / 0). We lean 2: on the orange it carries the weight of the filled glyphs'}
    b += f'<div style="display:grid;grid-template-columns:150px 244px 68px 1fr;gap:6px 14px;align-items:center">'
    for k, btn, n, im in rows:
        b += head(n, 15) + img(im, f'the set with the + {n}, true size', 244, local) + img(f'plus-{btn}-3x', f'the + {n} in its button', 68, local) + f'<div style="font-size:14px;line-height:1.35">{notes[k]}</div>'
    b += '</div>'
    b += p('At 72, drawn at 72: the set as it leans, then the + at 1½, 1¾ and 2.', 15, INK, 4)
    b += img('set72', 'the set at 72 with the three + strokes', 760, local)
    b += heads(['', '', '', '', '', '', '1½', '1¾', '2'], 84, 0, 0)

    # 2. the star
    b += label('2 · One star', 18)
    b += p('<b>One drawing, 12px tall, everywhere:</b> the row (starred), the tag starred, the tag not starred. Before, the row\'s was 12.1 and the tag\'s 13.4 (v269 had 11 and 13: two stars). 12 sits between the name\'s capitals (11) and the tag\'s icons (13). The orange keyline on the tag is the app\'s starred style.', 15)
    b += f'<div style="display:grid;grid-template-columns:290px 280px 278px;gap:4px 14px;align-items:center">' + head('Row (starred)') + head('Tag, starred') + head('Tag, not starred')
    b += img('row-p2-3x', 'row with the one star', 290, local) + img('tag-starred-p2-3x', 'tag starred with the one star', 280, local) + img('tag-open-p2-3x', 'tag unstarred with the one star', 278, local) + '</div>'
    b += cap('In the app at true size (iPhone). The tag crops are its stub.')

    # 3. the museum
    b += label('3 · The museum, 1px minimum counter', 18)
    b += p('<b>Which one you meant:</b> "that icon" isn\'t named. We read it as the approved one (the most balanced in v269\'s rows), whose three counters were under 1px. <b>D</b> keeps its four columns and widens it just enough for 1px openings: 4 × 1½ + 3 × 1 = 9, plus the ½px bevel each side = <b>10 wide</b> (was 9.8). If you meant three columns: <b>E</b>, three columns at the approved height, 2px openings (what 9½ wide gives).', 15)
    b += f'<div style="display:grid;grid-template-columns:360px 1fr;gap:0 18px;align-items:start"><div>' + img('museum72', 'museums at 72', 352, local) + heads(['Approved', 'D', 'E', 'B¼ (v269)'], 88, 0, 6) + '</div>'
    b += '<div style="display:grid;grid-template-columns:76px 176px;gap:4px 10px;align-items:center">'
    for k, n in [('was_museum', 'Approved'), ('museumD', 'D'), ('museumE', 'E')]:
        b += head(n) + img(f'row-{k}-3x', f'the set with museum {n}', 176, local)
    b += '</div></div>'
    b += cap('<b>D</b>: 10 × 10.8, ink +19%, columns 3px tall (⅓ of the colonnade), slabs 2px; 0 / 4 soft. The middle opening sits on the centre line at 1px, so its edges are half pixels (sharp on the 5K, soft on an iPhone). <b>E</b>: 9.5 × 10.7, ink +6%; its middle column centred at 1½px is soft on both screens (12 / 12). B¼ is withdrawn: it sat ¼px off centre.')

    # 4. the coupe
    b += label('4 · The coupe, full', 18)
    b += p('A, B and C read empty because the band ate the drink (2px, or 1½). With counters at 1px (your v269 minimum, and your 10-21 "equal to the thickness of the stroke. or maybe even a little thinner"), the band is 1px, a little thinner than the rim. <b>D</b> is the same glass: drink 2½, as approved. <b>E</b> raises the rim ½px (bowl 5½ deep, same width and stem): drink 3, the fullest yet.', 15)
    b += f'<div style="display:grid;grid-template-columns:360px 1fr;gap:0 18px;align-items:start"><div>' + img('coupe72', 'coupes at 72', 352, local) + heads(['Approved', 'C (v269)', 'D', 'E'], 88, 0, 6) + img('coupe24', 'coupes at 24', 160, local) + '</div>'
    tr = lambda cells, bold=False: ''.join(f'<div style="padding:3px 0;border-top:1px solid {RULE};font-size:14px;{"font-weight:700;color:" + NAVY if bold else ""}">{c}</div>' for c in cells)
    b += f'<div><div style="display:grid;grid-template-columns:104px repeat(4,1fr);gap:0 8px">' + tr(['', 'Approved', 'C', 'D', 'E'], True)
    b += tr(['<b>Drink</b>', '2½', '2', '2½', '<b>3</b>']) + tr(['Band', '¾', '1½', '1', '1']) + tr(['Bowl', '10 × 4.8', '10 × 5', '10 × 5', '10 × 5½']) + tr(['Ink', '45.5', '45.1', '48.1', '52.7']) + tr(['Soft 5K / iPhone', '11 / 10', '2 / 3', '2 / 4', '2 / 3']) + '</div>'
    b += cap('We lean E (an opinion): you asked for more drink than "coupe after" eight times. Its bowl is ½px deeper; you ruled out the much deeper bowl ("the shorter bowl i think is necessary"), so D is there if ½px is too far.') + '</div></div>'

    # 5. pixels
    b += label('The set at 24, one block per device pixel (before / as it leans)', 18)
    b += f'<div style="display:grid;grid-template-columns:60px 400px 400px;gap:6px 12px;align-items:center"><div></div>' + head('Before') + head('Now: café, coupe E, museum D, tree, fork and knife')
    for t, d in [('5K', '2x'), ('iPhone', '3x')]:
        b += head(t, 15) + img(f'pix-was-{d}', f'{t}, before', 400, local, True) + img(f'pix-now-{d}', f'{t}, now', 400, local, True)
    b += '</div>'

    b += label('The rules, as they now stand', 18)
    b += bullets([
        '<b>Shapes are whole pixels.</b> A slab (beam, plinth, saucer, foot) is 2px; its flat edges and lowest point land whole.',
        '<b>The line stays 1½px</b> (posts, walls, rims, stems): one edge whole, the other on a half pixel.',
        '<b>Counters and gaps are whole pixels, at least 1px</b> (your v269 "1px minimum counter space"; was "at least 2", with coupe C as an exception: both gone). A counter is what the drawing\'s proportions give, rounded to a whole pixel.',
        '<b>No ink under 1½px,</b> but a cap\'s ends (1px, the cap rule). <b>What must stick out sticks out at least 1px</b> (the knife\'s edge); a bevel is not a protrusion (the museum\'s ½px).',
        '<b>Symmetric icons sit exactly on the centre line, never off it</b> ("off center is not acceptable"). A 1½px part on the centre goes soft instead. The ¼px rule is withdrawn (B¼, the ¼-off +).',
        '<b>Line marks are drawn 1:1 where they live, one drawing per mark</b> (one star, 12px, row and tag), their stroke set by eye against the whole set, not by pixel count ("actual pixel is irrelevant").',
    ], 15)

    b += label('What still can\'t land', 18)
    b += p('The 1½px line on an iPhone (one side ⅙px soft); the 1px middle opening of museum D on an iPhone; the coupe\'s stem and the trunk on the centre line; the capitals\' steps and the bevels\' ends at 3x; curves, diagonals and tips. Shopping is its own round.', 15)

    b += label('Waiting on you', 18)
    for i, q in enumerate(['Museum: D (four columns as approved, 1px openings, 10 wide) or E (three columns, the approved height)?',
                           'Coupe: E (drink 3, rim ½px higher) or D (drink 2½, the same glass)?',
                           'The +, centred: which reads the same weight as the set, 1½, 1¾ or 2?',
                           'The star: one star, 12px, in the row and on the tag. Right size?'], 1):
        b += f'<div style="display:grid;grid-template-columns:32px 1fr;gap:10px;padding:6px 0;border-top:1px solid {RULE}"><div style="font-size:22px;font-weight:700;color:{ORANGE}">{i}</div><div style="font-size:18px;line-height:1.35;color:{NAVY};font-weight:600">{q}</div></div>'
    return f'<div style="width:940px;box-sizing:border-box;padding:24px 32px 10px;background:{PAPER};font-family:Archivo,Arial,sans-serif;color:{INK}">' + b + '</div>'

HEAD = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Sharp at 2x and 3x</title>\n<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">\n<style>\nbody{margin:0}\n</style>\n</helmet>\n'
TAIL = '\n</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'{"$preview":{"width":940,"height":%d}}\'>\nclass Component extends DCLogic {\nrenderVals() { return {}; }\n}\n</script>\n</body>\n</html>\n'
if BLOB:
    open(OUT, 'w').write(HEAD + board(False) + TAIL % H)
open(OUT + '.local.html', 'w').write('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&display=swap"><style>body{margin:0}</style></head><body>' + board(True) + '</body></html>')
print('wrote', OUT, 'blobs' if BLOB else 'local only')
