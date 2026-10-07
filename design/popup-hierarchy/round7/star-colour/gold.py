"""Gold star + category recolour study (owner, 2026-10-07: "We can change the color of the category types that clash.
Orange/yellow makes more sense to use on a star"). Measures ΔE2000 star↔category, category↔category (before / after),
star↔city accents (cluster / selected), and contrast on the papers. Writes gold.json.
   python3 design/popup-hierarchy/round7/star-colour/gold.py"""
import json, os, itertools
src = open(os.path.join(os.path.dirname(__file__), 'contrast.py')).read().split("out = {}")[0]
ns = {}; exec(src, ns)
de, cr, CATS, CITY, OTHER, GROUNDS = ns['de2000'], ns['cr'], ns['CATS'], ns['CITY'], ns['OTHER'], ns['GROUNDS']
STAR = '#F2B807'     # star gold: the tags' yellow ink, inside a 1px dark-amber keyline (#8A5A0E = Malmö --figure-deep, existing palette)
KEY = '#8A5A0E'
AFTER = dict(CATS)
AFTER.update({
    'restaurant': '#7A2436',   # was #AC5019 burnt orange -> wine (claret #972068 read as the rejected pink; CD gold check)
    'attraction': '#547326',   # was #A68018 gold (clashes with the gold star, ΔE ~10) -> moss green (park-poster foliage)
})
def stats(cats):
    pairs = sorted(((round(de(a, b), 1), f'{n1}–{n2}') for (n1, a), (n2, b) in itertools.combinations(cats.items(), 2)))
    return pairs[:5]
out = {'star': STAR,
  'star fill contrast (fill only)': {g: round(cr(STAR, v), 2) for g, v in GROUNDS.items()},
  'star keyline (amber #8A5A0E) contrast on papers': {g: round(cr(KEY, v), 2) for g, v in GROUNDS.items()},
  'gold fill vs its amber keyline': round(cr(STAR, KEY), 2),
  'restaurant wine vs Copenhagen fd / street / old pink star / claret': [round(de('#7A2436', x), 1) for x in ('#B23A2C', '#5E2C17', '#C0306E', '#972068')],
  'star vs categories BEFORE (nearest)': sorted(((round(de(STAR, v), 1), k) for k, v in CATS.items()))[:4],
  'star vs categories AFTER (nearest)': sorted(((round(de(STAR, v), 1), k) for k, v in AFTER.items()))[:4],
  'star vs city --figure-deep (cluster / selected)': {k: round(de(STAR, v[1]), 1) for k, v in CITY.items()},
  'star vs city --figure': {k: round(de(STAR, v[0]), 1) for k, v in CITY.items()},
  'star vs visited ink / navy': {k: round(de(STAR, v), 1) for k, v in OTHER.items()},
  'category pairs BEFORE (closest 5)': stats(CATS), 'category pairs AFTER (closest 5)': stats(AFTER),
  'changed categories, contrast on --paper': {k: round(cr(AFTER[k], '#F2EBDD'), 2) for k in ['restaurant', 'attraction']},
  'changed categories vs city --figure-deep (nearest)': {k: sorted(((round(de(AFTER[k], v[1]), 1), c) for c, v in CITY.items()))[0] for k in ['restaurant', 'attraction']},
  'after': AFTER}
json.dump(out, open(os.path.join(os.path.dirname(__file__), 'gold.json'), 'w'), indent=1, ensure_ascii=False)
for k, v in out.items():
    if k != 'after': print(k, v)
