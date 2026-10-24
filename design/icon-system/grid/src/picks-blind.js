// THE BLIND TEST (director: "build two new icons blind from the board, one shaped (a bed or building) and one outline ...
// Run them through the checks, put them in the row, and you judge. If they land first time, it's a 10. If not, the rule
// that failed gets fixed."). Two icons drawn from the Construction board's spec ("The spec: draw a new icon from this")
// and nothing else: every value is read from src/proportions.js (PROP.bed, PROP.person, PROP.line), every round, fit,
// class and centre is the engine's. Report: design/icon-system/grid/blind-test.md.
//
// Coordinates as picks7: the 12-unit box scaled by s (u = s / 12), y down, px for thicknesses (never scaled).
'use strict';
const { R, C, D, I, cut } = require('./engine.js');
const { PROP, LINE } = require('./proportions.js');
const T = v => Math.round(v * 3) / 3;            // the 1/3px lattice (Step 3)
const Tup = v => Math.ceil(v * 3 - 1e-6) / 3;     // the first lattice line at or past v (spec gap 3)
const f = v => +v.toFixed(5);
// one cubic per quarter of an ellipse (y down), as SVG path data: from parametric angle a to b
const arc = (cx, cy, rx, ry, a, b) => {
  const P = t => [cx + rx * Math.cos(t), cy + ry * Math.sin(t)], Dv = t => [-rx * Math.sin(t), ry * Math.cos(t)], k = 4 / 3 * Math.tan((b - a) / 4);
  const p0 = P(a), p3 = P(b), d0 = Dv(a), d3 = Dv(b);
  return `C${f(p0[0] + k * d0[0])} ${f(p0[1] + k * d0[1])} ${f(p3[0] - k * d3[0])} ${f(p3[1] - k * d3[1])} ${f(p3[0])} ${f(p3[1])}`;
};
const H = Math.PI / 2;
const ellipse = (cx, cy, rx, ry) => `M${f(cx + rx)} ${f(cy)}${arc(cx, cy, rx, ry, 0, H)}${arc(cx, cy, rx, ry, H, 2 * H)}${arc(cx, cy, rx, ry, 2 * H, 3 * H)}${arc(cx, cy, rx, ry, 3 * H, 4 * H)}Z`;
// the top half of an ellipse, closed by its centre line (y down: the top is angles PI..2PI)
const topHalf = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}${arc(cx, cy, rx, ry, 2 * H, 3 * H)}${arc(cx, cy, rx, ry, 3 * H, 4 * H)}Z`;

// ---- HOTEL: A BED (shaped, solid in the stroked circle). Side view, the head at the left.
// Roots (Step 1): the MATTRESS, a rectangle, the widest root (1); the HEADBOARD, a post (5/6 line) at the head end running
// from its top to the floor (it is the head's leg); the FOOT LEG, a post at the foot end under the mattress; the PILLOW,
// one ellipse resting on the mattress across the cut.
// o.rule11: 'strict' (rule 11 as written: a part that rests on another sits with its ink centre over the other's centre,
// so the pillow is centred over the mattress) or 'against' (the proposed scope fix: a part that rests against a second
// part sits against it across the same cut). The blind result is 'strict'.
function bed(s = 12, o = {}) {
  const P = PROP.bed, L = PROP.line, u = s / 12;
  const mw = 12 * u;                              // the mattress: the widest root, across the box (Step 3)
  const post = L.post * LINE, cutW = L.cut * LINE, leg = LINE;   // thicknesses in px: a post, the cut, a leg shows one line
  const rise = P.rise * mw, mh = P.mattress * mw;
  const yT = T(rise), yB = T(yT + mh), yF = Tup(yB + leg);       // mattress top and bottom on the lattice; the floor too
  const pw = P.pillow * mw, ph = (o.pillowH ?? P.pillowH) * pw;   // o.pillowH: the proposed fix (blind-test.md), shown beside the blind result
  const pcy = yT - cutW - ph / 2;
  const pcx = o.rule11 === 'against' ? post + cutW + pw / 2 : mw / 2;
  return [
    R(0, yT, mw, yB - yT, { root: 'RECT', name: 'mattress' }),
    R(0, 0, post, yF, { root: 'POST', name: 'headboard' }),
    R(mw - post, yB - 0.01, post, yF - yB + 0.01, { root: 'POST', name: 'foot leg' }),
    D(ellipse(pcx, pcy, pw / 2, ph / 2), { root: 'ELLIPSE', name: 'pillow', cap: { cx: pcx, cy: pcy, rx: pw / 2, ry: ph / 2 } }),
  ];
}

// ---- ACCOUNT: A PERSON (outline mark, like the star). Head and shoulders, in its own 24 box at its app slot (24px: the
// account button's glyph). Roots: the SHOULDERS, the top half of one ellipse closed by a flat base, the widest root (1);
// the HEAD, a circle, resting on the shoulders across the cut. Counters (rule 5): the same root on the same centre less a
// wall (the ellipse less a wall on each axis, and its base raised a wall). Size (rule 12, Outline): sized by its counter,
// 2 1/2 lines across; with two counters the SMALLEST across sets the size (spec gap 6): the shoulders' counter, measured
// up the axis, from its base to its crown.
function person(slot = 24) {
  const P = PROP.person, L = PROP.line, k = 24 / slot, w = LINE * k, cutW = L.cut * LINE * k;
  const across = L.outlineCounter * w;            // 2 1/2 lines
  // the shoulders' counter, up the axis: (ry - w) - w = ry - 2w, with ry = shoulders x rx
  const rx = (across + 2 * w) / P.shoulders, ry = P.shoulders * rx, Rh = P.head * rx;   // head diameter = 1/2 the shoulders' width
  const total = ry + cutW + 2 * Rh, cx = 12;
  const yb = T(12 + total / 2), hy = yb - ry - cutW - Rh;   // the base on the lattice; drawn about the box centre, centred later by rule
  const sh = { cx, cy: yb, rx, ry }, ct = { cx, cy: yb, rx: rx - w, ry: ry - w };
  return [
    D(topHalf(cx, yb, rx, ry), { root: 'ELLIPSE', name: 'shoulders', cap: sh }),
    cut(I(D(ellipse(cx, yb, rx - w, ry - w)), R(cx - rx, yb - ry, 2 * rx, ry - w), { root: 'ELLIPSE', name: 'shoulders counter', cap: ct })),
    C(cx, hy, Rh, { root: 'CIRCLE', name: 'head' }),
    cut(C(cx, hy, Rh - w, { root: 'CIRCLE', name: 'head counter' })),
  ];
}

module.exports = { bed, person };
