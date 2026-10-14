import json, sys, numpy as np
sys.path.insert(0, '../pass-a-check')
from PIL import Image
from squint import weight
T = sys.argv[1] if len(sys.argv) > 1 else ''
d = json.load(open(f'{T}c-check.json'))
bad = {k: v for k, v in d['fit'].items() if v['under'] or v['near6'] or v['creditGap'] < 4}
print('fit scenes', len(d['fit']), 'issues:'); [print(' ', k, v['under'], v['near6'], v['creditGap'], v['box']) for k, v in bad.items()]
for vp in ['390x844', '390x664', '375x667', '320x568']:
    s = d['fit'][f'{vp}|reykjavik|up']; print(vp, 'box', s['box'], 'creditGap', s['creditGap'])
ac = d['frames']['acct']
for v in sorted({k.rsplit('-', 1)[0] for k in d['frames'] if k != 'acct'}):
    for view in ('fit', 'z14'):
        base = Image.open(f'frames/{T}{v}-{view}-none.png'); arr = np.asarray(base.convert('RGB')).copy(); x0, y0, x1, y1 = [int(t) for t in ac]
        ring = np.concatenate([arr[y1 + 4:y1 + 10, x0:x1].reshape(-1, 3), arr[y0:y1, x0 - 10:x0 - 4].reshape(-1, 3)])
        arr[y0 - 2:y1 + 4, x0 - 2:x1 + 2] = np.median(ring, 0); noacct = Image.fromarray(arr)
        r = [weight(Image.open(f'frames/{T}{v}-{view}.png'), base, d['frames'][f'{v}-{view}']['box'], s)[0] / weight(base, noacct, ac, s)[0] for s in (4, 8)]
        print(v, view, 'mass vs account', [round(x, 2) for x in r], 'pins under', d['frames'][f'{v}-{view}']['under'], 'box', d['frames'][f'{v}-{view}']['box'])
