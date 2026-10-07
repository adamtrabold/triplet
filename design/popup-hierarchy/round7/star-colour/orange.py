"""The orange star: ΔE2000 vs every category / city accent / visited ink, contrast on the papers, and the star-on-orange
segment (paper or navy on the orange field). Writes orange.json.   python3 design/popup-hierarchy/round7/star-colour/orange.py"""
import json, os
src = open(os.path.join(os.path.dirname(__file__), 'contrast.py')).read().split("out = {}")[0]
ns = {}; exec(src, ns)
de, cr, CATS, CITY, OTHER, GROUNDS = ns['de2000'], ns['cr'], ns['CATS'], ns['CITY'], ns['OTHER'], ns['GROUNDS']
NAVY, PAPER, RAISED = '#12293F', '#F2EBDD', '#FAF5EA'
out = {}
# O1: each city's own --figure-deep (the per-city accent)
for city, (f, fd) in CITY.items():
    d = {k: round(de(fd, v), 1) for k, v in CATS.items()}
    d.update({f'{k} --figure-deep': round(de(fd, v[1]), 1) for k, v in CITY.items() if k != city})
    d['own city --figure-deep (cluster/selected)'] = 0.0
    out[f'O1 per-city accent: {city} {fd}'] = {'contrast_min_paper': round(min(cr(fd, g) for g in GROUNDS.values()), 2), 'nearest': sorted(d.items(), key=lambda x: x[1])[:3],
        'segment: paper star on it': round(cr(PAPER, fd), 2), 'segment: navy star on it': round(cr(NAVY, fd), 2)}
# O2: one fixed brand orange (the darkest orange that still reads as orange and clears 3:1 on pressed paper)
AMBER = '#B85C00'
d = {k: round(de(AMBER, v), 1) for k, v in CATS.items()}
d.update({f'{k} --figure-deep': round(de(AMBER, v[1]), 1) for k, v in CITY.items()}); d.update({f'{k} --figure': round(de(AMBER, v[0]), 1) for k, v in CITY.items()})
out[f'O2 fixed amber {AMBER}'] = {'contrast_min_paper': round(min(cr(AMBER, g) for g in GROUNDS.values()), 2), 'nearest': sorted(d.items(), key=lambda x: x[1])[:4],
    'segment: paper star on it': round(cr(PAPER, AMBER), 2), 'segment: navy star on it': round(cr(NAVY, AMBER), 2)}
json.dump(out, open(os.path.join(os.path.dirname(__file__), 'orange.json'), 'w'), indent=1, ensure_ascii=False)
for k, v in out.items(): print(k, v)
