"""Star colour candidates vs the app's palette: contrast (WCAG) on every ground, and colour distance (CIEDE2000)
to every category colour, every city's --figure / --figure-deep, visited navy and cluster. Writes contrast.json.
   python3 design/popup-hierarchy/round7/star-colour/contrast.py"""
import json, math, os
CAND = {'Pink ink (lead)': '#C0306E', 'Plum magenta (round 7 A)': '#A3266F', 'rejected: leaf green': '#4E7A0E', 'rejected: carmine': '#B4233C', 'rejected: ultramarine': '#3B3FA6'}
GROUNDS = {'paper': '#F2EBDD', 'paper-raised (tag, map halo face)': '#FAF5EA', 'paper-filed (visited row / filed tag)': '#E7DFD0', 'paper-pressed': '#DCD3C3'}
CATS = {'restaurant': '#AC5019', 'cafe': '#6E4C22', 'bar': '#3D5A7A', 'attraction': '#A68018', 'nature': '#1E3A2B', 'shopping': '#8A7AA8',
        'area': '#2B3F52', 'hotel': '#2E2433', 'other': '#4F5450', 'district': '#328177', 'street': '#5E2C17'}
CITY = {'reykjavik': ('#EE7434', '#A8400C'), 'copenhagen': ('#E2705C', '#B23A2C'), 'malmo': ('#E0A22E', '#8A5A0E'),
        'stockholm': ('#D98A2B', '#995610'), 'la': ('#E8674F', '#AE3A29')}
OTHER = {'visited stamp / sticker ink': '#3A4C5B', 'navy': '#12293F', 'ink (today’s star)': '#1A1A18'}
def rgb(h): h = h.lstrip('#'); return [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
def lin(c): return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
def lum(h): r, g, b = map(lin, rgb(h)); return .2126 * r + .7152 * g + .0722 * b
def cr(a, b): la, lb = lum(a), lum(b); return (max(la, lb) + .05) / (min(la, lb) + .05)
def lab(h):
    r, g, b = map(lin, rgb(h))
    x = (r * .4124 + g * .3576 + b * .1805) / .95047; y = r * .2126 + g * .7152 + b * .0722; z = (r * .0193 + g * .1192 + b * .9505) / 1.08883
    f = lambda t: t ** (1 / 3) if t > .008856 else 7.787 * t + 16 / 116
    return 116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))
def de2000(c1, c2):
    L1, a1, b1 = lab(c1); L2, a2, b2 = lab(c2)
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2); Cb = (C1 + C2) / 2
    G = .5 * (1 - math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7))); a1p, a2p = a1 * (1 + G), a2 * (1 + G)
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1 = math.degrees(math.atan2(b1, a1p)) % 360; h2 = math.degrees(math.atan2(b2, a2p)) % 360
    dL, dC = L2 - L1, C2p - C1p
    dh = h2 - h1; dh = dh - 360 if dh > 180 else dh + 360 if dh < -180 else dh
    dH = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dh / 2))
    Lb, Cbp = (L1 + L2) / 2, (C1p + C2p) / 2
    hb = (h1 + h2 + 360) / 2 if abs(h1 - h2) > 180 else (h1 + h2) / 2
    T = 1 - .17 * math.cos(math.radians(hb - 30)) + .24 * math.cos(math.radians(2 * hb)) + .32 * math.cos(math.radians(3 * hb + 6)) - .2 * math.cos(math.radians(4 * hb - 63))
    SL = 1 + .015 * (Lb - 50) ** 2 / math.sqrt(20 + (Lb - 50) ** 2); SC = 1 + .045 * Cbp; SH = 1 + .015 * Cbp * T
    RT = -2 * math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) * math.sin(math.radians(60 * math.exp(-((hb - 275) / 25) ** 2)))
    return math.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH))
out = {}
for n, c in CAND.items():
    o = {'hex': c, 'contrast': {g: round(cr(c, v), 2) for g, v in GROUNDS.items()}}
    o['contrast'].update({f'{k} highlighted row (--figure-deep)': round(cr(c, v[1]), 2) for k, v in CITY.items()})
    d = {k: round(de2000(c, v), 1) for k, v in CATS.items()}
    d.update({f'{k} --figure': round(de2000(c, v[0]), 1) for k, v in CITY.items()})
    d.update({f'{k} --figure-deep (cluster/selected)': round(de2000(c, v[1]), 1) for k, v in CITY.items()})
    d.update({k: round(de2000(c, v), 1) for k, v in OTHER.items()})
    o['deltaE2000'] = d; o['nearest'] = sorted(d.items(), key=lambda x: x[1])[:3]
    out[n] = o
json.dump(out, open(os.path.join(os.path.dirname(__file__), 'contrast.json'), 'w'), indent=1, ensure_ascii=False)
for n, o in out.items():
    print(n, o['hex'], 'min ground', min(v for k, v in o['contrast'].items() if 'highlighted' not in k), 'nearest', o['nearest'])
