"""The canvas section "The mix: roots that carry the brand" (board Grid7NewIcons), from svg/mix/ and the approved six.
python3 -I src/mix-board.py <board.dc.html in> <board.dc.html out>
Replaces the B-test section (from "Test 1" up to "The first proposal") with the mix section; the rest of the board is kept."""
import json, os, re, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIX = os.path.join(HERE, 'svg/mix')
cons = json.load(open(os.path.join(HERE, 'svg/g7/construction.json')))
summ = json.load(open(os.path.join(MIX, 'summary.json')))
NAVY = '#12293F'; GREY = '#5A564C'; RULE_C = '#D8CEBA'
APPR_INK = {'cafe': 56.87, 'bar': 45.14, 'museum': 63.12, 'nature': 34.52, 'star': 84.14, 'plus': 34.56}

def mixd(k): return re.search(r' d="([^"]+)"', open(os.path.join(MIX, f'{k}.svg')).read()).group(1)
def svg(d, px, label, vb='0 0 24 24'):
    return (f'<svg width="{px}" height="{px}" viewBox="{vb}" role="img" aria-label="{label}" style="display:block">'
            f'<path fill="{NAVY}" fill-rule="evenodd" d="{d}"/></svg>')
def tile(d, px, label, cap=None):
    c = f'<div style="font-size:14px;color:{GREY};margin-top:4px">{cap}</div>' if cap else ''
    return f'<div style="display:flex;flex-direction:column;align-items:center">{svg(d, px, label, "5 5 14 14")}{c}</div>'
def h2(kick, title):
    return (f'<div style="border-top:1px solid {RULE_C};margin-top:28px;padding-top:20px"><div style="font-size:15px;letter-spacing:.1em;'
            f'font-weight:700;color:{GREY};text-transform:uppercase;margin:0 0 4px">{kick}</div><h2 style="margin:0 0 12px;font-size:28px;'
            f'line-height:1.15;color:{NAVY}">{title}</h2></div>')
def h3(t): return f'<h3 style="margin:18px 0 8px;font-size:21px;line-height:1.2;color:{NAVY}">{t}</h3>'
def p(t): return f'<p style="margin:0 0 12px;font-size:19px;line-height:1.45">{t}</p>'
def ul(items): return '<ul style="margin:0 0 12px;padding-left:22px;font-size:19px;line-height:1.45">' + ''.join(f'<li style="margin:0 0 6px">{i}</li>' for i in items) + '</ul>'
def strip(label, ds, px):
    cw = 72 if len(ds) <= 6 else 52
    cells = ''.join(f'<div style="width:{cw}px;display:flex;justify-content:center">{svg(d, px, n)}</div>' for n, d in ds)
    return (f'<div style="display:grid;grid-template-columns:110px 1fr;align-items:center;gap:10px;margin:0 0 8px">'
            f'<div style="font-size:16px;font-weight:700;color:{GREY}">{label}</div><div style="display:flex;gap:14px;align-items:center">{cells}</div></div>')

SIX = [('cafe', 'Café'), ('bar', 'Bar'), ('museum', 'Museum'), ('nature', 'Nature'), ('star', 'Star'), ('plus', 'Add')]
NEW = [('restaurant', 'Restaurant'), ('bag', 'Shopping'), ('bed', 'Hotel')]
appr = [(n, cons[k]['d']) for k, n in SIX]
mix = [(n, mixd(k)) for k, n in SIX]
new = [(n, mixd(k)) for k, n in NEW]

out = []
out.append(h2('Round 3 · 10-26 · prototype, outside the engine', 'The mix: roots that carry the brand'))
out.append(p('The director\'s call after the B test: keep B\'s one rule, but let the roots carry what it couldn\'t guess. '
             'An icon is now only a list of root calls. Each root says what it is (a mass, a slab, a post, a loop) and so how thick it is. '
             'Holes and notches are roots too, cut out after the rule, never filled. The rule then rounds every join from those '
             'thicknesses, with one set of numbers for every icon. Nothing is touched by hand per icon.'))
out.append(h3('The six, rebuilt from root calls only'))
out.append(p('Top: the six you approved. Below: the same six from root calls alone. At 24 and at 72.'))
out.append(strip('Approved 24', appr, 24)); out.append(strip('Mix 24', mix, 24))
out.append(strip('Approved 72', appr, 72)); out.append(strip('Mix 72', mix, 72))
rows = []
for k, n in SIX:
    s = summ[k]; dev = s['approved_only'] + s['mix_only']; ink = (s['ink_px2'] / APPR_INK[k] - 1) * 100
    rows.append(f'<div style="font-weight:700;color:{NAVY}">{n}</div><div>{dev:.2f} px² differ (at 24) · ink {ink:+.1f}%</div>')
out.append(f'<div style="display:grid;grid-template-columns:110px 1fr;gap:6px 14px;font-size:18px;line-height:1.4;margin:6px 0 14px">{"".join(rows)}</div>')
out.append(p('All six come back by eye at 24 and 72. The star is a hair heavier (its outline sits about 1/25 px outside); the coupe\'s '
             'flares are a touch less leaned. Under B, the museum differed by 4.8 px² and the tree by 8.3.'))
out.append(h3('The tree comes back'))
out.append(f'<div style="display:flex;gap:28px;margin:4px 0 12px">{tile(cons["nature"]["d"], 192, "Tree approved", "approved")}{tile(mixd("nature"), 192, "Tree from root calls", "from root calls")}</div>')
out.append(ul([
    'Under B the tree was ruined: the notches filled and the tips stayed spiky, a jagged blob at 72. B guessed thickness from the '
    'drawing, and a tier thinning to its tip read as "thin meets thick", so it flared into the notch.',
    'Now each tier says it is a mass. Two masses meeting get only the small base round, so the notch stays open. Each notch is also its own root '
    '(the triangle from a tier\'s tip to the middle of its underside), cut out after the rule, so it can never fill.',
    'The tips: a tier\'s tip lands short and soft, its two edges re-aimed to it, by a share of its edge (the engine\'s tip rule, the same numbers). That\'s why the top tier\'s tips are finer than the bottom\'s.',
]))
out.append(h3('The museum gets its capitals back'))
out.append(f'<div style="display:flex;gap:28px;margin:4px 0 12px">{tile(cons["museum"]["d"], 192, "Museum approved", "approved")}{tile(mixd("museum"), 192, "Museum from root calls", "from root calls")}</div>')
out.append(p('The capital is a root of its own. Wherever an outer post holds a slab that runs past it, the call adds it: '
             'the slab\'s end drops half a pixel, and a quarter ellipse runs from it into the post\'s face, one curve. '
             'Any colonnade gets the same capital from the same call. The spaces between the columns are closed counters, so they keep tight corners.'))
out.append(h3('Three new icons, beside the six'))
out.append(strip('24', mix + new, 24)); out.append(strip('72', mix[:3] + new, 72))
out.append(ul([
    '<b>Restaurant</b> (fork and knife): the tines and the knife\'s handle are posts, the fork\'s head and the blade are masses. The family\'s flares '
    'appear where they meet, and nobody drew them.',
    '<b>Hotel</b> (the bed): the round-1 bed\'s roots, with their kinds stated. The headboard and leg flare into the mattress.',
    '<b>Shopping</b> (the bag): new root calls. The body is wider at the top, the handle is a wide arch running straight into it, and a band '
    'hole marks the folded rim. It reads as a bag at 72, closer to a basket. <b>At 24 it is still a dark block with a loop, near the padlock.</b> '
    'Not solved: it needs a better idea for the bag, not a better rule.',
]))
out.append(h3('The root calls'))
voc = [
    ('Mass', 'the thing itself (cup, bowl, tier, blade, mattress, bag): 2 lines thick (3px). Its corners round by a fifth of that.'),
    ('Slab', 'carries or caps (beam, plinth, saucer, foot, roof): 1 line. Corners round by a fifth of a line.'),
    ('Post', 'holds something up (stem, column, trunk, tine, leg, handle): 5/6 of a line. It flares half a pixel into whatever it holds or stands on.'),
    ('Loop', 'a band around a counter (the cup\'s ear, a bag\'s handle): 4/3px.'),
    ('Hole', 'a proportional shape cut from a root (the cup\'s ear, the coupe\'s band, the star\'s middle, the bag\'s rim). It keeps its shape, with only the base round.'),
    ('Notch', 'where a tier sits in the one below: a triangle from the tier\'s tip, cut after the rule. Whatever was space stays space.'),
    ('Capital', 'whenever a post holds a slab past its end: the slab\'s end drops a step (half a pixel) into a quarter ellipse to the post.'),
    ('Tip', 'a living mass (a tier) ends in a soft tip, landed short by a share of its edge. A line mark\'s point (the star) gets the plain tip round.'),
    ('The rule', 'where roots meet, the inside round is 0.15px plus a fifth of their difference in thickness, never more than 0.45 of the gap there. Outside, a fifth of the root\'s thickness.'),
]
out.append('<div style="display:grid;grid-template-columns:110px 1fr;gap:6px 14px;font-size:18px;line-height:1.4;margin:6px 0 14px">' +
           ''.join(f'<div style="font-weight:700;color:{NAVY}">{a}</div><div>{b}</div>' for a, b in voc) + '</div>')
out.append(h3('Not yet true'))
out.append(ul([
    'This is a prototype on pixels: the outlines are traced, not the engine\'s few clean curves. If you like the direction, it gets built into the engine next.',
    'The tip landing was set by eye on the tree. The star came back without it, so here it belongs to tiers alone.',
    'Weight is still judged by eye, not by a rule.',
]))
SECTION = ''.join(out)

if __name__ == '__main__':
    src = open(sys.argv[1]).read()
    a = src.index('<div style="border-top:1px solid #D8CEBA;margin-top:28px;padding-top:20px"><div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:#5A564C;text-transform:uppercase;margin:0 0 4px">', src.index('Your answers, and what they change'))
    # the B tests start at the section holding "Test 1"; the concept ("The first proposal") follows the tests
    t1 = src.rfind('<div style="border-top:1px solid #D8CEBA', 0, src.index('Test 1: the six rebuilt'))
    fp = src.rfind('<div style="border-top:1px solid #D8CEBA', 0, src.index('The first proposal (v247)'))
    out_s = src[:t1] + SECTION + src[fp:]
    out_s = out_s.replace('Grid concepts · B tested outside the engine', 'Grid concepts · the mix, prototyped outside the engine')
    open(sys.argv[2], 'w').write(out_s)
    print('section', len(SECTION), 'board', len(src), '->', len(out_s))
