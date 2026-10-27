# grey share from right-grey.js's renders: python3 -I src/right-grey.py <raw.json> [out.json]
import json, sys, base64, io
from PIL import Image
R = json.load(open(sys.argv[1])); T = {}
for r in R:
    im = Image.open(io.BytesIO(base64.b64decode(r['buf']))).convert('L')
    cov = [1 - v / 255 for v in im.tobytes()]
    k = (r['lab'], r['set'], r['dpr']); g, i = T.get(k, (0, 0))
    T[k] = (g + sum(1 for c in cov if 0.02 < c < 0.98), i + sum(1 for c in cov if c > 0.02))
out = {}
for (lab, st, dpr), (g, i) in T.items():
    out.setdefault(lab, {}).setdefault(st, {})['iPhone' if dpr == 3 else '5K'] = round(100 * g / i)
for lab, v in out.items(): print(f'{lab:18}', '  '.join(f"{st}: iPhone {x['iPhone']}% 5K {x['5K']}%" for st, x in v.items()))
if len(sys.argv) > 2: json.dump(out, open(sys.argv[2], 'w'), indent=1)
