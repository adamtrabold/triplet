"""The canvas section "The mix: roots that carry the brand" (board Grid7NewIcons), from the mix in clean curves (svg/mix/curves/)
and the approved six. python3 -I src/mix-board.py <board.dc.html in> <board.dc.html out>
Replaces the section from "The mix: roots that carry the brand" (or, on the v248 board, the B tests) up to "The first proposal"."""
import json, os, re, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUR = os.path.join(HERE, 'svg/mix/curves')
cons = json.load(open(os.path.join(HERE, 'svg/g7/construction.json')))
comp = json.load(open(os.path.join(CUR, 'compare.json')))
NAVY = '#12293F'; GREY = '#5A564C'; RULE_C = '#D8CEBA'

def mixd(k): return re.search(r' d="([^"]+)"', open(os.path.join(CUR, f'{k}.svg')).read()).group(1)
def jit(k):
    p = os.path.join(CUR, f'jitter-{k}.json')
    return json.load(open(p)) if os.path.exists(p) else None
def svg(d, px, label, vb='0 0 24 24'):
    return (f'<svg width="{px}" height="{px}" viewBox="{vb}" role="img" aria-label="{label}" style="display:block">'
            f'<path fill="{NAVY}" fill-rule="evenodd" d="{d}"/></svg>')
def tile(d, px, label, cap=None, vb='5 5 14 14'):
    c = f'<div style="font-size:14px;color:{GREY};margin-top:4px">{cap}</div>' if cap else ''
    return f'<div style="display:flex;flex-direction:column;align-items:center">{svg(d, px, label, vb)}{c}</div>'
def h2(kick, title):
    return (f'<div style="border-top:1px solid {RULE_C};margin-top:28px;padding-top:20px"><div style="font-size:15px;letter-spacing:.1em;'
            f'font-weight:700;color:{GREY};text-transform:uppercase;margin:0 0 4px">{kick}</div><h2 style="margin:0 0 12px;font-size:28px;'
            f'line-height:1.15;color:{NAVY}">{title}</h2></div>')
def h3(t): return f'<h3 style="margin:18px 0 8px;font-size:21px;line-height:1.2;color:{NAVY}">{t}</h3>'
def p(t): return f'<p style="margin:0 0 12px;font-size:19px;line-height:1.45">{t}</p>'
def ul(items): return '<ul style="margin:0 0 12px;padding-left:22px;font-size:19px;line-height:1.45">' + ''.join(f'<li style="margin:0 0 6px">{i}</li>' for i in items) + '</ul>'
def grid(rows): return ('<div style="display:grid;grid-template-columns:110px 1fr;gap:6px 14px;font-size:18px;line-height:1.4;margin:6px 0 14px">' +
                        ''.join(f'<div style="font-weight:700;color:{NAVY}">{a}</div><div>{b}</div>' for a, b in rows) + '</div>')
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

def jtext(k):
    j = jit(k)
    if not j: return 'jitter: not run'
    return f"jitter {j['N']} nudges: moves at most {j['maxFar']:.3f}px, {'holds' if j['pass'] else 'FAILS'}"

out = []
out.append(h2('Round 3 · 10-26 · prototype, outside the engine', 'The mix: roots that carry the brand'))
out.append(p('An icon is only a list of root calls. Each root says what it is (a mass, a slab, a post, a loop), and so how thick it is. '
             'Holes, notches and capitals are roots too. One rule then answers every corner from the roots that meet there, with one set of '
             'numbers for every icon. The engine\'s own round solver draws the curves. Nothing is touched by hand per icon.'))
out.append(h3('The six, rebuilt from root calls only'))
out.append(p('Top: the six you approved. Below: the same six from root calls alone, in clean curves. At 24 and at 72.'))
out.append(strip('Approved 24', appr, 24)); out.append(strip('Mix 24', mix, 24))
out.append(strip('Approved 72', appr, 72)); out.append(strip('Mix 72', mix, 72))
rows = []
for k, n in SIX:
    c = comp[k]; dev = c['approved_only'] + c['mix_only']; ink = (c['ink'] / c['ink_approved'] - 1) * 100
    rows.append((n, f'{dev:.2f} px² differ · ink {ink:+.1f}% · {jtext(k)}'))
out.append(grid(rows))
out.append(p('They come back exactly. At every corner the rule asks for the round the approved drawing has, and the curves come '
             'from the same solver. The star\'s weight is back on the approved one. At 27px a unit, approved against mix overlaid, nothing differs that the eye can find. '
             'The fair, kink and shoulder checks are clean on all six.'))
out.append(h3('At your zoom'))
out.append(f'<div style="display:flex;gap:16px;margin:4px 0 12px;flex-wrap:wrap">'
           f'{tile(mixd("bar"), 216, "Coupe from root calls", "coupe: the stem\'s leaned flares", "6 6 12 12")}'
           f'{tile(mixd("museum"), 216, "Museum from root calls", "museum: the capitals", "6 6 12 12")}'
           f'{tile(mixd("nature"), 216, "Tree from root calls", "tree: notches and tips", "6 6 12 12")}</div>')
out.append(ul([
    '<b>On v249 I showed traced pixels,</b> and the museum\'s capitals had small bumps on the post faces. The board said "gets its capitals back"; at your zoom that wasn\'t true. In clean curves the bumps are gone, and the capital matches the approved one.',
    '<b>The capital</b> is a root of its own. Wherever an outer post holds a slab that runs past it, the call adds it: the slab\'s end drops half a pixel into a quarter ellipse that runs into the post\'s face. Any colonnade gets the same capital from the same call.',
    '<b>The tree:</b> its tiers are masses. Two masses meeting get only the small round, so the notches stay open. Each tip goes soft by a share of its edge.',
    '<b>The coupe:</b> its stem is a post, and a post carries its own flare. The engine leans it as on the approved coupe.',
]))
out.append(h3('Three new icons, beside the six'))
out.append(strip('24', mix + new, 24)); out.append(strip('72', mix[:3] + new, 72))
out.append(ul([
    '<b>Restaurant</b> (fork and knife): the tines and the knife\'s handle are posts, the fork\'s head and the blade are masses. The family\'s flares '
    f'appear where they meet, and nobody drew them. Fair check clean; {jtext("restaurant")}.',
    f'<b>Hotel</b> (the bed): the round-1 bed\'s roots with their kinds stated; the headboard and leg flare into the mattress. Clean; {jtext("bed")}.',
    '<b>Shopping</b> (the bag): <b>not solved.</b> Body wider at the top, a wide arch handle, a rim band. At 72 it reads as a basket; at 24 it is '
    'still a dark block with a loop, near the padlock. Its handle feet also fail the fair check. It needs a better idea for the bag, not a better rule.',
]))
out.append(h3('The root calls'))
out.append(grid([
    ('Mass', 'the thing itself (cup, bowl, tier, blade, mattress, bag): 2 lines thick (3px). Square corners round by a fifth of that.'),
    ('Slab', 'carries or caps (beam, plinth, saucer, foot, roof): 1 line. Corners round by a fifth of a line.'),
    ('Post', 'holds something up (stem, column, trunk, tine, leg, handle): 5/6 of a line. It flares half a pixel into whatever it holds or stands on.'),
    ('Loop', 'a band around a counter (a bag\'s handle, the cup\'s ear): 5/6 of a line, a post bent round its counter. The cup\'s ear is still drawn at 4/3px (the horizontal line\'s compensation), because the six stay as approved. Drawn at 5/6 it would be 1/12px thinner.'),
    ('Hole', 'a proportional shape cut from a root (the cup\'s ear, the coupe\'s band, the star\'s middle, the bag\'s rim). Its corners keep the small round.'),
    ('Notch', 'where a tier sits in the one below: two masses meeting, so only the small round. It never fills.'),
    ('Capital', 'whenever a post holds a slab past its end: the slab\'s end drops a step (half a pixel) into a quarter ellipse to the post.'),
    ('Tip', 'a point goes soft by a share of its shorter edge, and lands where its soft end was: the tree\'s tiers, the star\'s points.'),
    ('The rule', 'inside, 0.15px, or 0.3 for a wide corner; a post\'s flare where a post meets another kind. Outside, a fifth of the root\'s thickness, 0.7 for a wide corner. Never more than a fifth of the shorter edge (a flare 0.45).'),
]))
out.append(h3('What changed from v249'))
out.append(ul([
    'Clean curves instead of traced pixels.',
    'One rule went. In v249, two roots meeting rounded by a fifth of their difference in thickness. In curves, that asked for a flare under the cup\'s ear, which the approved cup doesn\'t have, and the line broke there. Every flare in the six is a post\'s, so the post now carries it.',
    'Wide corners (over 105°) take the engine\'s wide rounds, or a near-straight corner reads as a kink (the museum\'s roof apex).',
]))
out.append(h3('Not yet true'))
out.append(ul([
    'On the six the rule gives the same answers as the engine\'s corner table. That is the test passing, not yet proof it generalises: the fork and the bed are the first evidence.',
    'Weight is still judged by eye, not by a rule.',
]))
SECTION = ''.join(out)

if __name__ == '__main__':
    src = open(sys.argv[1]).read()
    if 'The mix: roots that carry the brand' in src:
        t1 = src.rfind('<div style="border-top:1px solid #D8CEBA', 0, src.index('The mix: roots that carry the brand'))
    else:
        t1 = src.rfind('<div style="border-top:1px solid #D8CEBA', 0, src.index('Test 1: the six rebuilt'))
    fp = src.rfind('<div style="border-top:1px solid #D8CEBA', 0, src.index('The first proposal (v247)'))
    out_s = src[:t1] + SECTION + src[fp:]
    out_s = out_s.replace('Grid concepts · B tested outside the engine', 'Grid concepts · the mix, prototyped outside the engine')
    open(sys.argv[2], 'w').write(out_s)
    print('section', len(SECTION), 'board', len(src), '->', len(out_s))
