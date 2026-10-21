// g7aj: the EVEN-CURVE CHECK (owner on v205's coupe: "this line on the left and right is waht looks wrong -- it looks
// too straight compared to the rest of the shape"). Every curve DRAWN in the tuned row (not the law's corner rounds,
// which ease out of their lines by design), as picks7 draws it, in the 12-unit box: its least curvature as a share of
// its peak. Low = part of the curve runs nearly straight. S = it changes direction. Numbers mirror picks7.js
// (VESSEL_SIDE, COUPE_B, the dome, saucerFlip, the tree's droop, the cup's bottom); keep them in step.
// usage: TOOLS=<dir with node_modules/paper> node src/curve-even.js
'use strict';
const { VESSEL_SIDE } = require('./picks7.js');
function even(P) {
  let mn = 1e9, mx = 0; const sg = new Set();
  for (let q = 0; q <= 100; q++) {
    const t = q / 100, cub = P.length === 4;
    const d1 = [0, 1].map(k => cub ? 3 * (1 - t) ** 2 * (P[1][k] - P[0][k]) + 6 * t * (1 - t) * (P[2][k] - P[1][k]) + 3 * t * t * (P[3][k] - P[2][k]) : 2 * (1 - t) * (P[1][k] - P[0][k]) + 2 * t * (P[2][k] - P[1][k]));
    const d2 = [0, 1].map(k => cub ? 6 * (1 - t) * (P[2][k] - 2 * P[1][k] + P[0][k]) + 6 * t * (P[3][k] - 2 * P[2][k] + P[1][k]) : 2 * (P[2][k] - 2 * P[1][k] + P[0][k]));
    const cr = d1[0] * d2[1] - d1[1] * d2[0], kk = Math.abs(cr) / Math.hypot(...d1) ** 3; mn = Math.min(mn, kk); mx = Math.max(mx, kk); sg.add(cr > 0);
  }
  return `${Math.round(100 * mn / mx)}%${sg.size > 1 ? ' S' : ''}`;
}
const bd = 5.5, fh = 1.5 * 12 / 11, sh = 1.5, s = 11, V = VESSEL_SIDE;
const rows = [
  ['coupe side, H3 (bk 0.35, bx 0.5)', [[0.25, 0], [0.25, 0.35 * bd], [0.5, bd], [6, bd]]],
  [`coupe side, the vessel rule (bk ${V.bk}, bx ${V.bx})`, [[0.25, 0], [0.25 + V.lean, V.bk * bd], [V.bx, bd], [6, bd]]],
  ['cup bottom (a straight wall into one curve)', [[8.25, 4.667], [8.25, 6.833], [7, 8], [4.875, 8]]],
  ['tree tier underside (droop)', [[4.66, 0], [2.1, -0.75], [0, -0.75]]],
  ['saucer underside (H3 dome, flipped)', [[0, 0], [0, 0.8 * sh], [0.3 * s, sh], [0.5 * s, sh]]],
  ['coupe foot top (H3 dome)', [[2, 0], [2, -0.8 * fh], [3.9, -fh], [6, -fh]]],
];
for (const [nm, P] of rows) console.log(nm.padEnd(46), 'least curvature', even(P), 'of its peak');
