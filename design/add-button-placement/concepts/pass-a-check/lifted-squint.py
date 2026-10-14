# Mass vs account for the lifted pin on the real render (frames from lifted.js). Same method as squint.py.
import json, numpy as np
from PIL import Image
from squint import weight
p = json.load(open('lifted.json'))
for tag in ('390x844@1', '320x568@1'):
    base = Image.open(f'frames/lifted-{tag}-none.png'); ac = p[f'{tag}|acct']
    arr = np.asarray(base.convert('RGB')).copy(); x0, y0, x1, y1 = [int(v) for v in ac]
    ring = np.concatenate([arr[y1 + 4:y1 + 10, x0:x1].reshape(-1, 3), arr[y0:y1, x0 - 10:x0 - 4].reshape(-1, 3)])
    arr[y0 - 2:y1 + 4, x0 - 2:x1 + 2] = np.median(ring, 0); noacct = Image.fromarray(arr)
    for s in (4, 8):
        A = weight(base, noacct, ac, s)[0]
        row = [f"{v} {weight(Image.open(f'frames/lifted-{tag}-{v}.png'), base, p[f'{tag}|{v}'], s)[0] / A:.2f}x" for v in ('L44', 'L48', 'L52', 'FAB56')]
        print(tag, f'sigma {s}:', ', '.join(row))
