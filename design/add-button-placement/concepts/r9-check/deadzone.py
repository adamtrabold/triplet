# z14 dead-zone odds: for random map centres over each city's pins, how often does a corner object cover >= 1 real pin?
# Web Mercator at z14, 390x664 Safari, list up (map 390x364). Pins drawn 24px (MARKER_SIZE_NEAR). Seeded, 4000 centres per city.
import math, random
pins = [s.strip().split() for s in open('../pass-a-check/real-pins.txt').read().strip().split(';')]
def px(lat, lng, z=14):
    s = 256 * 2 ** z; x = (lng + 180) / 360 * s; y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * s
    return x, y
W, H = 390, 364
OBJ = {'C pin+tag 100x125': (19.9, H - 145, 119.9, H - 20), 'Float 60x60': (15.2, H - 80, 75.2, H - 20), 'P lifted 52x78 (ref)': (17.9, H - 94, 69.9, H - 16)}
random.seed(7)
for city in ['re', 'co', 'st', 'ma', 'la']:
    P = [px(float(a), float(b)) for c, a, b, k in pins if c == city]
    xs, ys = [p[0] for p in P], [p[1] for p in P]
    cs = [(random.uniform(min(xs), max(xs)), random.uniform(min(ys), max(ys))) for _ in range(4000)]
    row = []
    for name, (x0, y0, x1, y1) in OBJ.items():
        hit = 0
        for cx, cy in cs:
            ox, oy = cx - W / 2, cy - H / 2
            if any(x0 - 12 < px_ - ox < x1 + 12 and y0 - 12 < py_ - oy < y1 + 12 for px_, py_ in P): hit += 1
        row.append(f'{name}: {hit / len(cs):.0%}')
    print(city, len(P), ' | '.join(row))
