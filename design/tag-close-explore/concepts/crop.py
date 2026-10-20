# 3x crops of each still's close mark: python3 crop.py <rawdir> <outdir> [halfsize_css=40] [keys...]
import json, sys, os
from PIL import Image
raw, out = sys.argv[1], sys.argv[2]
half = int(sys.argv[3]) if len(sys.argv) > 3 else 40
keys = sys.argv[4:]
os.makedirs(out, exist_ok=True)
pts = json.load(open(os.path.join(raw, 'points.json')))
for k, p in pts.items():
    if keys and not any(k.startswith(x) for x in keys): continue
    if not p: continue
    im = Image.open(os.path.join(raw, k + '.png'))
    x, y = round(p['x'] * 3), round(p['y'] * 3)
    h = half * 3
    im.crop((x - h, y - h, x + h, y + h)).save(os.path.join(out, k + '.png'))
