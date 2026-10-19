// Round g7: batch 1 REDRAWN to the owner's craft bar (owner, 10-19: "none of these are yet at the craft
// level i need the icons to be at -- the sizes of various parts of many of these are not yet optically
// pleasing, the rounding at various intersections feels wrong ... some of the choices inside of the icons
// don't make sense ... poor optical alignment inside of the badge ... none have the same optical weight").
// Owner: "i want them all to be focusing on best practices and principles for icon design".
// Each drawing names the principles it uses. Coordinates: the 12px box, y down (TOP 0, BASE 12);
// positions scale with s (12 = 2px of air, 12.75 = 1.5px); line widths do not.
// The box is the drawing box. WHERE the drawing sits in the badge is set by its optical centre
// (src/boards7.js, place()), not by the box: optical centring.
'use strict';
const { R, C, P, B, O, A, D, cut } = require('./engine.js');
const W = 1.5;      // a line, upright or diagonal (decided by the owner)
const WH = 4 / 3;   // a horizontal line, 1.333px: CONTRAST COMPENSATION (a horizontal reads heavier than
                    // an upright of the same width, so it is drawn about 10% thinner, as in type design)
                    // and PIXEL FITTING (4/3px is exactly 4 device pixels on a 3x phone, so a horizontal
                    // whose top sits on the 1/3px lattice has both edges crisp). Horizontal edges are
                    // placed on the 1/3px lattice; see boards7.js place().
const T = v => Math.round(v * 3) / 3;   // to the 1/3px lattice
const CUT = 1;      // a cut between touching parts
const f = v => +v.toFixed(3);

const DRAW = {
  // CAFÉ. A cup about 1.15 x as wide as deep, on a saucer as wide as the whole glyph. Counters that
  // survive (owner: "why does the coffee cup handle cut off on the bottom - it creates a narrow passage"):
  // see below.
  cafe(s = 12) {
    // g7 fix (director, C3): the handle is a D-shaped EAR joined to the cup wall over its height, its
    // counter 2.25 x 2px (g7b: opened to lighten the cup), bounded by the straight wall on one side (closed: no passage). The wall runs
    // straight down past the counter, then the bowl turns under. Arms 4/3px (horizontals), back 1.5px.
    const u = s / 12, X = v => f(v * u), K = 0.5523;
    const top = T(1.333), wall = T(4.667), bot = T(7.667), l = 1.5, r = 8.25, mid = (l + r) / 2;
    const cup = D(`M${X(l)} ${X(top)}H${X(r)}V${X(wall)}C${X(r)} ${X(6.5)} ${X(6.75)} ${X(bot)} ${X(mid)} ${X(bot)}C${X(2.75)} ${X(bot)} ${X(l)} ${X(6.5)} ${X(l)} ${X(wall)}Z`);
    const eb = top + 14 / 3, R = (eb - top) / 2, ex = 12 - R;                    // ear: outer 4.67 tall, its back a half circle
    const ear = D(`M${X(7.5)} ${X(top)}H${X(ex)}C${X(ex + R * K)} ${X(top)} ${X(12)} ${X(top + R - R * K)} ${X(12)} ${X(top + R)}C${X(12)} ${X(top + R + R * K)} ${X(ex + R * K)} ${X(eb)} ${X(ex)} ${X(eb)}H${X(7.5)}Z`);
    const ct = top + WH, cb = eb - WH, cr = (cb - ct) / 2, cx = 12 - W - cr;      // counter, its back a half circle
    const counter = cut(D(`M${X(r)} ${X(ct)}H${X(cx)}C${X(cx + cr * K)} ${X(ct)} ${X(12 - W)} ${X(ct + cr - cr * K)} ${X(12 - W)} ${X(ct + cr)}C${X(12 - W)} ${X(ct + cr + cr * K)} ${X(cx + cr * K)} ${X(cb)} ${X(cx)} ${X(cb)}H${X(r)}Z`));
    const st = bot + CUT;                                             // saucer top
    const saucer = D(`M${X(0)} ${X(st)}H${X(12)}C${X(11.55)} ${X(st + 1.05)} ${X(10.9)} ${X(st + WH)} ${X(10.1)} ${X(st + WH)}H${X(1.9)}C${X(1.1)} ${X(st + WH)} ${X(0.45)} ${X(st + 1.05)} ${X(0)} ${X(st)}Z`);
    return [cup, ear, saucer, counter];
  },
  // The g7 cup with the RING handle, kept to show beside the ear (director's fix 1).
  cafeRing(s = 12) {
    const u = s / 12, X = v => f(v * u);
    const top = 2, bot = T(7.333), l = 0.5, r = 8, mid = (l + r) / 2;
    const cup = D(`M${X(l)} ${X(top)}H${X(r)}C${X(r)} ${X(5.5)} ${X(6.5)} ${X(bot)} ${X(mid)} ${X(bot)}C${X(2)} ${X(bot)} ${X(l)} ${X(5.5)} ${X(l)} ${X(top)}Z`);
    const ring = O(X(9.6), X(4.4), 1.65 * u, W);
    const st = bot + CUT;
    const saucer = D(`M${X(0)} ${X(st)}H${X(12)}C${X(11.55)} ${X(st + 1.05)} ${X(10.9)} ${X(st + WH)} ${X(10.1)} ${X(st + WH)}H${X(1.9)}C${X(1.1)} ${X(st + WH)} ${X(0.45)} ${X(st + 1.05)} ${X(0)} ${X(st)}Z`);
    return [cup, ring, saucer];
  },
  // BAR. Proportion: bowl 11 wide and 4.5 deep (a coupe is shallow), foot 8 wide (about 70% of the bowl),
  // stem one upright line. Joins: the stem flows into bowl and foot through the corner law.
  bar(s = 12) {
    const u = s / 12, X = v => f(v * u), c = s / 2;
    const bd = T(4.667);
    const bowl = D(`M${X(0.5)} ${X(0)}H${X(11.5)}C${X(11.5)} ${X(2.8)} ${X(9)} ${X(bd)} ${X(6)} ${X(bd)}C${X(3)} ${X(bd)} ${X(0.5)} ${X(2.8)} ${X(0.5)} ${X(0)}Z`);
    const stem = R(c - W / 2, X(bd - 0.5), W, X(10.9) - X(bd - 0.5));
    const ft = T(10);
    const foot = D(`M${X(2)} ${X(12)}C${X(2)} ${X(10.9)} ${X(3.9)} ${X(ft)} ${X(6)} ${X(ft)}C${X(8.1)} ${X(ft)} ${X(10)} ${X(10.9)} ${X(10)} ${X(12)}Z`);
    return [bowl, stem, foot];
  },
  // MUSEUM. Proportion: a low pediment (rises 2.67 in 6, about 24 degrees, as classical pediments do), a
  // plinth that overhangs the columns by 0.5, four columns with spaces equal to the line. (Three columns
  // were tried in g7 and read as a box with two doors.) Counters: the spaces between the columns are
  // plain upright slots (no pills, owner's example).
  museum(s = 12) {
    // g7b fix (director, C2/C3/C4): between g7 and g7b. The pediment sits ON a thin beam (joined, no cut),
    // the four columns hang from the beam and stand on the plinth, so every gap is a closed 1.5px slot
    // (no gap under the line). Weight set to meet the coupe and the tree in the blurred row: low pediment,
    // three-quarter-height columns (the museum is drawn shorter than the box).
    const u = s / 12, X = v => f(v * u);
    const pb = T(4), bd = WH;
    // pediment and beam as one outline (a pentagon), so no coincident corners go through the boolean
    const out = [P([X(0.25), X(pb) + bd], [X(0.25), X(pb)], [X(6), X(T(1.667))], [X(11.75), X(pb)], [X(11.75), X(pb) + bd])];
    const ct = X(pb) + bd;                                            // column tops
    const n = 4, span = X(10.5), gap = (span - n * W) / (n - 1), x0 = X(0.75);
    for (let i = 0; i < n; i++) out.push(R(x0 + i * (W + gap), ct - 0.01, W, s - WH - ct + 0.02));
    out.push(R(X(0.25), s - WH, X(11.5), WH));                         // plinth on BASE: a horizontal
    return out;
  },
  // NATURE. Three tiers (g6 fix 3), each branch one curve drooping to its tip. Overshoot: the pointed
  // top rises 0.5 above TOP. Proportion: tiers widen by equal steps; the trunk shows 1.5 x 1.5.
  nature(s = 12) {
    const u = s / 12, X = v => f(v * u), c = s / 2;
    const tiers = [[-0.5, 4.25, 3.1], [2.6, 7.6, 4.5], [5.75, 10.75, 5.8]];
    const out = [];
    for (const [ty, by, hw] of tiers) {
      const mid = by - 0.65;
      out.push(D(`M${f(c)} ${X(ty)}L${f(c + X(hw))} ${X(by)}Q${f(c + X(hw * 0.45))} ${X(mid)} ${f(c)} ${X(mid)}Q${f(c - X(hw * 0.45))} ${X(mid)} ${f(c - X(hw))} ${X(by)}Z`));
    }
    out.push(R(c - W / 2, X(9.5), W, s - X(9.5)));
    return out;
  },
};

// ---- the two UI icons, each in its own 24 viewBox, shown at its app size ----
function plus(px = 26.4) {
  const k = 24 / px, w = W * k, wh = WH * k;                          // upright 1.5px, horizontal 1.4px
  return [R(12 - w / 2, 5, w, 14), R(5, 12 - wh / 2, 14, wh)];
}
function star(px = 20) {
  const k = 24 / px, w = W * k, cx = 12, cy = 12.6, Rc = 9.6, ri = Rc * 0.47;
  const cl = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? ri : Rc, a = -Math.PI / 2 + i * Math.PI / 5; cl.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return [P(...offset(cl, -w / 2)), cut(P(...offset(cl, w / 2)))];
}
function offset(pts, d) {
  const n = pts.length, lines = [];
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); lines.push([[a[0] - dy / L * d, a[1] + dx / L * d], [dx, dy]]); }
  const out = [];
  for (let i = 0; i < n; i++) { const [p, e1] = lines[(i - 1 + n) % n], [q, e2] = lines[i]; const den = e1[0] * e2[1] - e1[1] * e2[0], t = ((q[0] - p[0]) * e2[1] - (q[1] - p[1]) * e2[0]) / den; out.push([p[0] + e1[0] * t, p[1] + e1[1] * t]); }
  return out;
}

const BATCH = [['cafe', 'Café'], ['bar', 'Bar'], ['museum', 'Museum'], ['nature', 'Nature']];
module.exports = { W, WH, CUT, DRAW, plus, star, BATCH };
