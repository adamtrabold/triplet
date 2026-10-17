// Round g6, batch 1: the first DRAWN icons at 1.5px on grid A (owner: "Weight wise 1.5 but these
// icons are far from there drawing wise"; "Let's do a few at a time— we will need to pressure test
// the grid as it's being made").
// Each drawing is a function of the box size s (12 = 2px of air inside the 1.5px ring; 12.75 = 1.5px
// of air). Positions scale with s; every line stays W = 1.5. Coordinates: the box, 0..s, y down.
// Guides in a 12 box: TOP 0, SHOULDER 4, MIDDLE 6, BASE 12.
'use strict';
const { R, C, P, B, O, A, D, cut } = require('./engine.js');
const W = 1.5;          // the line, decided
const CUT = 1;          // a cut between touching parts (batch 1: 1px, on the 0.25px lattice; 0.9 never was)
const f = v => +v.toFixed(3);

const DRAW = {
  // Café: a low, wide cup (the matchbook cup), its handle an ear, on a saucer with a lifted rim.
  cafe(s = 12) {
    const u = s / 12, X = v => f(v * u);
    const top = 1.5, bot = 8;                                   // cup: 6.5 tall
    const cup = D(`M${X(0.5)} ${X(top)}H${X(9.5)}V${X(3.5)}C${X(9.5)} ${X(6.2)} ${X(7.6)} ${X(bot)} ${X(5)} ${X(bot)}C${X(2.4)} ${X(bot)} ${X(0.5)} ${X(6.2)} ${X(0.5)} ${X(3.5)}Z`);
    // the ear: a half ring hung on the cup's shoulder, centreline r 1.9 (its counter opens 2.3px)
    const ear = A(X(9.25), X(4.25), 1.9 * u, W, -90, 90);
    const st = bot + CUT;                                        // saucer top
    const saucer = D(`M${X(0)} ${X(st)}H${X(12)}C${X(11.6)} ${X(st + 1.2)} ${X(10.9)} ${X(st + W)} ${X(10.25)} ${X(st + W)}H${X(1.75)}C${X(1.1)} ${X(st + W)} ${X(0.4)} ${X(st + 1.2)} ${X(0)} ${X(st)}Z`);
    return [cup, ear, saucer];
  },
  // Bar: a coupe, the bowl a full shallow curve, a long stem, a domed foot.
  bar(s = 12) {
    const u = s / 12, X = v => f(v * u), c = s / 2;
    const bowl = D(`M${X(0.5)} ${X(0)}H${X(11.5)}C${X(11.5)} ${X(2.85)} ${X(9.1)} ${X(4.5)} ${X(6)} ${X(4.5)}C${X(2.9)} ${X(4.5)} ${X(0.5)} ${X(2.85)} ${X(0.5)} ${X(0)}Z`);
    const stem = R(c - W / 2, X(4), W, X(10.6) - X(4));
    const foot = D(`M${X(2.25)} ${X(12)}C${X(2.25)} ${X(10.9)} ${X(4)} ${X(10.5)} ${X(6)} ${X(10.5)}C${X(8)} ${X(10.5)} ${X(9.75)} ${X(10.9)} ${X(9.75)} ${X(12)}Z`);
    return [bowl, stem, foot];
  },
  // Museum: a column front. Pediment, beam, four columns, a plinth; the spaces between columns = W.
  museum(s = 12) {
    const u = s / 12, X = v => f(v * u);
    const out = [P([X(0), X(3)], [X(6), 0], [X(12), X(3)])];       // pediment, rise 3 over 6
    const bt = X(3) + CUT;                                         // beam top
    out.push(R(X(0.75), bt, X(10.5), W));                          // beam (entablature)
    const n = 4, span = X(10.5), gap = (span - n * W) / (n - 1), x0 = X(0.75);
    for (let i = 0; i < n; i++) out.push(R(x0 + i * (W + gap), bt + W - 0.01, W, s - W - (bt + W) + 0.02));
    out.push(R(0, s - W, s, W));                                   // plinth on BASE
    return out;
  },
  // Nature: a conifer of four tiers, each branch drooping to its tip; the trunk on BASE.
  nature(s = 12) {
    const u = s / 12, X = v => f(v * u), c = s / 2;
    const tiers = [[0, 3.5, 2.5], [2.25, 6, 3.5], [4.5, 8.5, 4.5], [6.75, 10.75, 5.75]]; // [tip y, base y at the tips, half width]
    const out = [];
    for (const [ty, by, hw] of tiers) {
      const mid = by - 0.75;                                      // the branch line lifts at the trunk: droop
      out.push(D(`M${f(c)} ${X(ty)}L${f(c + X(hw))} ${X(by)}Q${f(c + X(hw * 0.45))} ${X(mid)} ${f(c)} ${X(mid)}Q${f(c - X(hw * 0.45))} ${X(mid)} ${f(c - X(hw))} ${X(by)}Z`));
    }
    out.push(R(c - W / 2, X(9.5), W, s - X(9.5)));                 // trunk
    return out;
  },
};

// ---- two UI icons, drawn as outlines in their own 24 viewBox, then shown at their app sizes ----
// The +: two bars, the crossing filleted by the corner law (as the place glyphs' joins are).
function plus(px = 26.4) {
  const k = 24 / px, w = W * k;                                  // w = 1.5 screen px at px size
  return [R(12 - w / 2, 5, w, 14), R(5, 12 - w / 2, 14, w)];
}
// The Star (the one outline): a five-point star 1.5px wide at 20px.
function star(px = 20) {
  const k = 24 / px, w = W * k, cx = 12, cy = 12.6, Rc = 9.6, ri = Rc * 0.47;   // centreline star
  const cl = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? ri : Rc, a = -Math.PI / 2 + i * Math.PI / 5; cl.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return [P(...offset(cl, -w / 2)), cut(P(...offset(cl, w / 2)))];  // outer edge, inner edge: the line is w wide
}
// a closed polygon with each edge moved d along its left normal (screen coords), corners re-intersected
function offset(pts, d) {
  const n = pts.length, lines = [];
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); lines.push([[a[0] - dy / L * d, a[1] + dx / L * d], [dx, dy]]); }
  const out = [];
  for (let i = 0; i < n; i++) { const [p, e1] = lines[(i - 1 + n) % n], [q, e2] = lines[i]; const den = e1[0] * e2[1] - e1[1] * e2[0], t = ((q[0] - p[0]) * e2[1] - (q[1] - p[1]) * e2[0]) / den; out.push([p[0] + e1[0] * t, p[1] + e1[1] * t]); }
  return out;
}

const BATCH = [['cafe', 'Café'], ['bar', 'Bar'], ['museum', 'Museum'], ['nature', 'Nature']];
module.exports = { W, CUT, DRAW, plus, star, BATCH };
