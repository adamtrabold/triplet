"""Text contrast on the tag-colour papers (WCAG). The tints are --star (#A3266F) mixed 12% into the paper they sit on.
   python3 design/popup-hierarchy/round7/tag-colour/contrast.py"""
def rgb(h): h = h.lstrip('#'); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
def hexs(c): return '#' + ''.join(f'{round(v):02X}' for v in c)
def mix(a, b, t): A, B = rgb(a), rgb(b); return hexs([A[i] * t + B[i] * (1 - t) for i in range(3)])
def lin(c): c /= 255; return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
def lum(h): r, g, b = map(lin, rgb(h)); return .2126 * r + .7152 * g + .0722 * b
def cr(a, b): la, lb = lum(a), lum(b); return (max(la, lb) + .05) / (min(la, lb) + .05)
STAR, RAISED, FILED = '#A3266F', '#FAF5EA', '#E7DFD0'
P = {'--paper-raised': RAISED, '--paper-filed': FILED, '--paper-starred (12% star on raised)': mix(STAR, RAISED, .12), '--paper-starred-filed (12% star on filed)': mix(STAR, FILED, .12)}
T = {'--ink': '#1A1A18', '--ink-2': '#5A564C', '--star': STAR, 'stamp ink (#3A4C5B)': '#3A4C5B', 'Directions (--ink)': '#1A1A18'}
for pn, pv in P.items():
    print(f'{pn} {pv}: ' + ', '.join(f'{tn} {cr(tv, pv):.2f}' for tn, tv in T.items()))
print(f'band --star {STAR}: --paper text {cr("#F2EBDD", STAR):.2f}, --paper-raised {cr(RAISED, STAR):.2f}')
