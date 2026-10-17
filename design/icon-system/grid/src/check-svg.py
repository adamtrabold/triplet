"""Source checks for the drawn icons (g6 on). Run: python3 check-svg.py <svg dir>
1. Slivers: any straight run shorter than 0.2px (the director's g2 must-do), or a zero-length curve.
2. Symmetry: for icons drawn symmetric about the vertical centre, every point (on-curve and handle)
   must have a mirror twin within 0.01px. Icons that are asymmetric by design are listed and skipped.
"""
import re, sys, glob, os, math

ASYMMETRIC = {'cafe'}          # the cup's ear is on one side, by design
TOL = 0.01

def parse(d):
    toks = re.findall(r'[MLCZ]|-?\d*\.?\d+', d)
    i, cur, start, pts, tiny = 0, None, None, [], []
    while i < len(toks):
        t = toks[i]
        if t == 'M':
            cur = (float(toks[i + 1]), float(toks[i + 2])); start = cur; pts.append(cur); i += 3
        elif t == 'L':
            p = (float(toks[i + 1]), float(toks[i + 2]))
            if math.dist(cur, p) < 0.2: tiny.append(round(math.dist(cur, p), 3))
            cur = p; pts.append(p); i += 3
        elif t == 'C':
            c = [float(x) for x in toks[i + 1:i + 7]]
            if math.dist(cur, (c[4], c[5])) < 0.01: tiny.append('zero-length curve')
            pts += [(c[0], c[1]), (c[2], c[3]), (c[4], c[5])]; cur = (c[4], c[5]); i += 7
        elif t == 'Z':
            cur = start; i += 1
        else:
            i += 1
    return pts, tiny

root = sys.argv[1]
nsl = nfail = nsym = 0
for f in sorted(glob.glob(os.path.join(root, '**', '*.svg'), recursive=True)):
    src = open(f).read()
    vb = float(re.search(r'viewBox="0 0 ([\d.]+)', src).group(1))
    pts, tiny = [], []
    for d in re.findall(r' d="([^"]+)"', src):
        p, t = parse(d); pts += p; tiny += t
    rel = os.path.relpath(f, root)
    if tiny:
        nsl += len(tiny); print('SLIVER', rel, tiny)
    icon = os.path.basename(f).split('-')[0]
    if icon in ASYMMETRIC:
        continue
    nsym += 1
    worst = max(min(math.dist((vb - x, y), q) for q in pts) for (x, y) in pts)
    if worst > TOL:
        nfail += 1; print('ASYMMETRIC', rel, round(worst, 3))
print(f'slivers: {nsl} · symmetry: {nsym - nfail}/{nsym} files mirror within {TOL}px (skipped by design: {", ".join(sorted(ASYMMETRIC))})')
