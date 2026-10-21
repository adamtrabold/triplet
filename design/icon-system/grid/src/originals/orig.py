# Today's icons, from the inventory's 12x renders, cut to what the board needs and stored at 6x as PNG data URIs
import json, base64, io, sys
from PIL import Image
IS = '/home/user/la-trip-map/.claude/worktrees/agent-ad1f8b885ed7ed704/design/icon-system/'
INV, OUT = IS + 'inventory-png/', IS + 'grid/svg/g7/originals.json'
meta = json.load(open(INV + 'meta.json'))
S = 6
def uri(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True); return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()
res = {}
# the row badges: one strip of 11, cut at the gaps
row = Image.open(INV + 'badges-row.png').convert('RGB'); W, H = row.size
bg = row.getpixel((2, 2))
cols = [any(sum(abs(a - b) for a, b in zip(row.getpixel((x, y)), bg)) > 60 for y in range(0, H, 2)) for x in range(W)]
runs, x = [], 0
while x < W:
    if cols[x]:
        s = x
        while x < W and cols[x]: x += 1
        runs.append((s, x))
    else: x += 1
print('runs', len(runs), runs, file=sys.stderr)
names = ['restaurant', 'cafe', 'bar', 'attraction', 'nature', 'shopping', 'area', 'hotel', 'other', 'district', 'street']
k = W / meta['badges-row']['w']   # 12
for nm, (a, b) in zip(names, runs):
    c = (a + b) / 2; half = 15 * k     # a 30px cell round each badge (the diamonds are 28-30)
    box = (int(c - half), int(H / 2 - half), int(c + half), int(H / 2 + half))
    im = row.crop(box).resize((30 * S, 30 * S), Image.LANCZOS)
    res['badge-' + nm] = {'w': 30, 'h': 30, 'uri': uri(im)}
for key in ['ctl-add', 'ctl-add-open', 'ctl-account', 'ctl-sort', 'ctl-filters', 'ctl-locate', 'tag-x', 'tag-directions', 'empty-compass', 'sort-check', 'plan-plus', 'plan-more', 'plan-chev', 'ctl-zoom', 'g-star', 'g-star-open', 'ctl-collapse', 'ctl-delete', 'plan-x', 'plan-add']:
    m = meta[key]; im = Image.open(INV + key + '.png').convert('RGB')
    res[key] = {'w': m['w'], 'h': m['h'], 'uri': uri(im.resize((round(m['w'] * S), round(m['h'] * S)), Image.LANCZOS))}
# controls rendered from origin/main today (k/today-ctl.js, 6x): these replace the 10-13 inventory's renders
NOW = S0 = '/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/today-now/'
nm = json.load(open(NOW + 'meta.json'))
for key, m in nm.items():
    im = Image.open(NOW + key + '.png').convert('RGB')
    res[key] = {'w': m['w'], 'h': m['h'], 'uri': uri(im), 'now': True}
ati = Image.open('/home/user/la-trip-map/.claude/worktrees/agent-ad1f8b885ed7ed704/apple-touch-icon.png').convert('RGB')
res['home'] = {'w': 60, 'h': 60, 'uri': uri(ati.resize((360, 360), Image.LANCZOS))}
# each render's own background (the surface it sits on in the app), for the board's tiles
for k, v in res.items():
    im = Image.open(io.BytesIO(base64.b64decode(v['uri'].split(',')[1]))).convert('RGB')
    v['bg'] = '#%02X%02X%02X' % im.getpixel((1, 1))
print({k: v['bg'] for k, v in res.items()})
json.dump(res, open(OUT, 'w'))
print('bytes', sum(len(v['uri']) for v in res.values()))
