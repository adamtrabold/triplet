# Pass A footprints vs real pins + credit. Reads probe.json, writes footprints.json, prints a summary.
import json
d = json.load(open('probe.json'))
def ov(a, b, m=0):
    return min(a[2], b[2]) - max(a[0], b[0]) > -m and min(a[3], b[3]) - max(a[1], b[1]) > -m
def foot(kind, S, W):
    if kind.startswith('V2-'):
        D = int(kind[3:]); return [[17.9, S - 20 - D - 2, 19.9 + D + 2, S - 18]]
    _, wt, h = kind.split('-'); h = int(h); wt = (W - 32) if wt == 'full' else int(wt)
    cx = 16 + wt / 2
    return [[16, S - h, 16 + wt, S], [cx - 16, S - h - 60, cx + 16, S - h - 28], [cx - 1, S - h - 28, cx + 1, S - h + 18]]
KINDS = ['V2-40', 'V2-48', 'V2-56', 'V3-120-44', 'V3-120-64', 'V3-160-44', 'V3-160-64', 'V3-full-44', 'V3-full-64']
res = {}
for key, s in d['scenes'].items():
    vp, city, state, *pre = key.split('|'); W = int(vp.split('x')[0]); S = s['sheet'][1]
    for k in KINDS:
        f = foot(k, S, W)
        under = sum(any(ov(p, m) for p in f) for m in s['markers'])
        near = sum(any(ov(p, m, 6) for p in f) for m in s['markers']) - under
        cr = s['credit']; credit = any(ov(p, cr) for p in f) if cr else None
        top = min(p[1] for p in f)
        res.setdefault(k, {})[key] = dict(under=under, near=near, credit=credit, top=round(top, 1), markers=len(s['markers']), sheet=S, creditBox=cr)
json.dump(res, open('footprints.json', 'w'), indent=1)
for k in KINDS:
    r = res[k]; tot = sum(v['under'] for v in r.values() if 'noprefix' not in v and True)
    print(f"\n{k}")
    for vp in ['390x844', '390x664', '375x667', '320x568']:
        up = [f"{key.split('|')[1][:3]}:{v['under']}{'+'+str(v['near']) if v['near'] else ''}" for key, v in r.items() if key.startswith(vp) and key.endswith('|up')]
        co = sum(v['under'] for key, v in r.items() if key.startswith(vp) and key.endswith('collapsed'))
        cp = [v['credit'] for key, v in r.items() if key.startswith(vp) and key.endswith('|up')][0]
        cn = [v['credit'] for key, v in r.items() if key.startswith(vp) and key.endswith('noprefix')][0]
        print(f"  {vp} up pins under(+near6): {' '.join(up)} | collapsed total under: {co} | credit hit prefix/noprefix: {cp}/{cn} | top y {[v['top'] for key, v in r.items() if key.startswith(vp) and key.endswith('|up')][0]}")
