"""Approach C's judge, tested: a measured fingerprint of the six, and a score for any icon against it.

Outside the engine. Every icon is rasterised at 48 grid px per unit (24px slot) and measured:
  ink      darkness: inked area, px^2 at 24 (only compared within its class: shaped / line marks)
  sharp    corners left sharp (radius under 0.1 unit with a turn over 30 deg)
  conc     median radius of the inside corners (turn over 30 deg)
  conv     median radius of the outside corners (turn over 30 deg)
  wobble   small bumps: short runs (under 0.6 unit) that turn the wrong way between two runs that turn the other
  joins    character at the joins: share of inside corners rounded 0.3 or more (the flares)
  contrast thick against thin: 90th / 10th percentile of steady local thickness
The family band for each feature is the six's range, widened by 15% of that range (a floor per feature). An icon's
score is the sum over features of how far outside the band it falls, in band widths. 0 = inside every band.

  python3 -I src/fingerprint.py      (from design/icon-system/grid)  -> svg/castB/fingerprint.json
"""
import json, os, sys, random
import numpy as np
from scipy import ndimage as ndi
from skimage import measure
sys.path.insert(0, os.path.dirname(__file__))
from castlib import G, N, raster_path, parse_path
import importlib.util
spec = importlib.util.spec_from_file_location('castB', os.path.join(os.path.dirname(__file__), 'castB.py'))
B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)
HERE = B.HERE

def svg_d(path):
    import re
    s = open(os.path.join(HERE, path)).read()
    return ' '.join(re.findall(r'\sd="([^"]+)"', s))

def corners(mask, step=0.025):
    """Corner runs on the outline: (turn deg, radius units, convex?) and the wobble count."""
    f = ndi.gaussian_filter(mask.astype(float), 0.7)
    runs, wob = [], 0
    for c in measure.find_contours(np.pad(f, 1), 0.5):
        seg = np.hypot(*np.diff(c, axis=0).T); L = np.concatenate([[0], np.cumsum(seg)])
        if L[-1] < 1.0 * G: continue
        t = np.arange(0, L[-1], step * G)
        q = np.stack([np.interp(t, L, c[:, 0]), np.interp(t, L, c[:, 1])], 1)
        ang = np.unwrap(np.arctan2(np.diff(q[:, 0], append=q[:1, 0]), np.diff(q[:, 1], append=q[:1, 1])))
        k = np.diff(ang, append=ang[:1] + (ang[-1] - ang[0]) * 0)  # turn per step
        k = (k + np.pi) % (2 * np.pi) - np.pi
        k = ndi.uniform_filter1d(k, 3, mode='wrap')
        orient = np.sign(k.sum()) or 1.0          # which way the outline winds
        kap = k / step * orient                   # >0 convex (turns with the winding)
        # runs of strong curvature (radius under 1.5 units)
        strong = np.abs(kap) > 1 / 1.5
        lab, n = ndi.label(strong)
        for i in range(1, n + 1):
            idx = np.where(lab == i)[0]
            turn = abs(kap[idx].sum() * step)
            if np.degrees(turn) < 30: continue
            radius = len(idx) * step / turn
            runs.append((float(np.degrees(turn)), float(radius), bool(kap[idx].sum() > 0)))
        # wobble: a short wrong-way run (5-30 deg) between longer same-way runs
        sgn = np.sign(np.where(np.abs(kap) > 0.05, kap, 0))
        lab2, n2 = ndi.label(sgn != 0)
        prev = None
        segs = []
        for i in range(1, n2 + 1):
            idx = np.where(lab2 == i)[0]
            s = np.sign(kap[idx].sum()); tt = abs(np.degrees(kap[idx].sum() * step)); ln = len(idx) * step
            segs.append((s, tt, ln))
        for a, b, cc in zip(segs, segs[1:], segs[2:]):
            if b[0] != a[0] and cc[0] == a[0] and b[2] < 0.6 and 5 < b[1] < 30 and a[1] > 5 and cc[1] > 5:
                wob += 1
    return runs, wob

def features(mask):
    runs, wob = corners(mask)
    conc = [r for t, r, cv in runs if not cv]; conv = [r for t, r, cv in runs if cv]
    T = B.local_thickness(mask)
    Ts = ndi.gaussian_filter(np.where(mask, T, 0), 0.15 * G)
    gy, gx = np.gradient(Ts)
    steady = mask & (np.hypot(gy, gx) * G < 0.35) & (T > 0)
    tv = T[steady]
    return dict(
        ink=round(float(mask.sum()) / G / G, 2),
        sharp=int(sum(1 for t, r, cv in runs if r < 0.1)),
        conc=round(float(np.median(conc)), 3) if conc else 0.0,
        conv=round(float(np.median(conv)), 3) if conv else 0.0,
        wobble=int(wob),
        joins=round(float(np.mean([r >= 0.3 for r in conc])), 3) if conc else 0.0,
        contrast=round(float(np.percentile(tv, 90) / max(np.percentile(tv, 10), 0.05)), 2) if tv.size else 1.0,
    )

FLOOR = dict(ink=4.0, sharp=1.0, conc=0.05, conv=0.08, wobble=1.0, joins=0.1, contrast=0.3)

def nudge(d, rng, amt=0.02):
    sc = 1 + rng.uniform(-amt, amt) / 12; dx = rng.uniform(-amt, amt); dy = rng.uniform(-amt, amt)
    return ''.join('M' + 'L'.join(f'{(x - 12) * sc + 12 + dx:.4f},{(y - 12) * sc + 12 + dy:.4f}' for x, y in s) + 'Z'
                   for s in parse_path(d))

def main():
    out = {}
    six = B.six_roots()
    CLASS = dict(cafe='shaped', bar='shaped', museum='shaped', nature='shaped', star='line', plus='line')
    items = []
    for k, v in six.items():
        items.append((f'{k} (approved)', raster_path(v['approved']), CLASS[k], 'six'))
    rng = random.Random(7)
    for k, v in six.items():
        for j in range(3):
            items.append((f'{k} nudged {j + 1}', raster_path(nudge(v['approved'], rng)), CLASS[k], 'nudged'))
    blind = [('bed, round 1 blind', 'svg/blind/bed.svg', 'shaped'), ('bed, round 1 fixed', 'svg/blind/bedFixed.svg', 'shaped'),
             ('bed2 (re-run)', 'svg/blind/bed2.svg', 'shaped'), ('bed2 with overhang', 'svg/blind/bed2o.svg', 'shaped'),
             ('person, round 1 blind', 'svg/blind/person.svg', 'line'), ('person2 (outline)', 'svg/blind/person2.svg', 'line'),
             ('person3 (open)', 'svg/blind/person3.svg', 'line'),
             ('bag, round 2 blind', 'svg/blind2/bag.svg', 'shaped'), ('heart, round 2 blind', 'svg/blind2/heart.svg', 'line'),
             ('heart on, round 2 blind', 'svg/blind2/heart-on.svg', 'line')]
    for name, p, cl in blind:
        items.append((name, raster_path(svg_d(p)), cl, 'blind'))
    for k in ('restaurant', 'bag', 'bed', 'cafe', 'bar', 'museum', 'nature', 'star', 'plus'):
        m = np.unpackbits(np.load(os.path.join(HERE, f'svg/castB/{k}.npy')))[:N * N].reshape(N, N).astype(bool)
        items.append((f'{k} (B)', m, CLASS.get(k, 'shaped'), 'B'))
    F = {}
    for name, m, cl, grp in items:
        F[name] = dict(features(m), cls=cl, group=grp)
        print(name, F[name], flush=True)
    fam = [F[n] for n, _, _, g in items if g == 'six']
    band = {}
    for f in FLOOR:
        if f == 'ink':
            for cl in ('shaped', 'line'):
                vals = [x['ink'] for x in fam if x['cls'] == cl]
                lo, hi = min(vals), max(vals); w = max(hi - lo, FLOOR[f])
                band[f'ink:{cl}'] = (lo - 0.15 * w, hi + 0.15 * w, w)
        else:
            vals = [x[f] for x in fam]; lo, hi = min(vals), max(vals); w = max(hi - lo, FLOOR[f])
            band[f] = (lo - 0.15 * w, hi + 0.15 * w, w)
    for name in F:
        x = F[name]; sc = {}
        for f in FLOOR:
            lo, hi, w = band[f'ink:{x["cls"]}'] if f == 'ink' else band[f]
            v = x[f]; d = max(0, lo - v, v - hi) / w
            if d > 0: sc[f] = round(d, 2)
        x['off'] = sc; x['score'] = round(sum(sc.values()), 2)
    out = dict(band={k: [round(a, 3), round(b, 3)] for k, (a, b, _) in band.items()}, icons=F)
    json.dump(out, open(os.path.join(HERE, 'svg/castB/fingerprint.json'), 'w'), indent=1)
    for name in sorted(F, key=lambda n: F[n]['score']):
        print(f'{F[name]["score"]:6.2f}  {name:28s} {F[name]["off"]}')

if __name__ == '__main__':
    main()
