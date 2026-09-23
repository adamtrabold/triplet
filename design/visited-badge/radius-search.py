"""Derivation of the visited stamp's track path (index.html, .row-stamp --stamp-track).

Ring outer edge = CSS ellipse 32 x 12 (ring box 64x24 at inset 4px in the 72x32
stamp, border-radius:50%). The ideal track is the ring's parallel curve at a
constant 3.25px offset (dot centre to ring edge). Neither a concentric ellipse
nor CSS border-radius:50% is a parallel curve; this searches for the CSS-style
rounded rect (px radii on a 72x32 box, 1.5px border => midline inset 0.75)
whose midline stays closest to that constant offset, then prints the
resulting SVG path and its length.

Run: python3 radius-search.py
Result (2026-09-23): radii 34.5px / 15.5px -> midline arcs 33.75 x 14.75,
analytic gap 3.250-3.358 (spread 0.108px) vs 0.307px for the 50% ellipse.
Path length 166.27 analytic; Chromium getTotalLength() = 166.29 (the value used).
"""
import math

RX, RY = 32.0, 12.0           # ring outer edge semi-axes
W, H, INSET = 72, 32, 0.75    # stamp box; midline of a 1.5px border

EDGE = [(RX * math.cos(2 * math.pi * i / 4000), RY * math.sin(2 * math.pi * i / 4000)) for i in range(4000)]

def dist(p):
    return min(math.hypot(p[0] - x, p[1] - y) for x, y in EDGE)

def midline(rx, ry):
    hw, hh, ax, ay = W / 2 - INSET, H / 2 - INSET, rx - INSET, ry - INSET
    pts = [(hw - ax + ax * math.cos(t), hh - ay + ay * math.sin(t))
           for t in (math.pi / 2 * i / 23 for i in range(24))]
    if hw - ax > 0.01: pts += [((hw - ax) * i / 6, hh) for i in range(6)]
    if hh - ay > 0.01: pts += [(hw, (hh - ay) * i / 6) for i in range(6)]
    return pts

results = []
for rx in (x * 0.5 for x in range(40, 73)):
    for ry in (y * 0.25 for y in range(40, 65)):
        g = [dist(p) for p in midline(rx, ry)]
        results.append((max(g) - min(g), rx, ry, min(g), max(g)))
results.sort()
spread, rx, ry, lo, hi = results[0]
print(f"best radii {rx}px / {ry}px: gap {lo:.3f}-{hi:.3f}, spread {spread:.3f}px")

ax, ay = rx - INSET, ry - INSET
sx, sy = W - 2 * rx, H - 2 * ry   # straight runs
x0, y0 = W / 2 - sx / 2, INSET
print("path:", f"M36 .75H{W/2+sx/2:g}A{ax:g} {ay:g} 0 0 1 {W-INSET:g} {H/2-sy/2:g}V{H/2+sy/2:g}"
      f"A{ax:g} {ay:g} 0 0 1 {W/2+sx/2:g} {H-INSET:g}H{W/2-sx/2:g}A{ax:g} {ay:g} 0 0 1 {INSET:g} {H/2+sy/2:g}"
      f"V{H/2-sy/2:g}A{ax:g} {ay:g} 0 0 1 {W/2-sx/2:g} {INSET:g}Z")
n = 200000
q = sum(math.hypot(ax * (math.cos(math.pi / 2 * (i + 1) / n) - math.cos(math.pi / 2 * i / n)),
                   ay * (math.sin(math.pi / 2 * (i + 1) / n) - math.sin(math.pi / 2 * i / n))) for i in range(n))
L = 4 * q + 2 * sx + 2 * sy
print(f"length {L:.2f}; dots 84 -> period {L/84:.4f}; 1x 32 dashes -> period {L/32:.3f}")
