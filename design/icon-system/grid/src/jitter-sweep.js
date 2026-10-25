// g7bb THE CUTOFFS, SWEPT: for each hard cutoff the engine had, a simple shape whose corner walks across it in small steps, built
// by the engine as it is now (blended) and, if OLD=<dir with the previous engine.js and laws7.js> is given, by the old one. Reports
// the largest jump of the outline between two neighbouring steps: a cutoff that still switches shows as a jump far larger than the
// step itself moves anything.
//   node jitter-sweep.js            (OLD=<dir> to compare with the previous engine)
'use strict';
const path = require('path');
const { apart } = require('./jitter-check.js');
const { PROP } = require('./proportions.js');
const JOIN10 = { ease: 2.3, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth', tipKeep: 'crest', tipLand: true, tipPow: 1, tipSoft: PROP.transition.tipSoft, noReverse: true, maxPieces: 2, arcEase: true, arcRamp: 0.3, flareLean: PROP.transition.flareLean };
const engines = [['now', require('./engine.js'), require('./laws7.js').fromTable]];
if (process.env.OLD) engines.push(['old', require(path.join(process.env.OLD, 'engine.js')), require(path.join(process.env.OLD, 'laws7.js')).fromTable]);
const rad = d => d * Math.PI / 180;
// each: [name, the cutoff, steps, shape(t) -> prims]
const SWEEPS = [
  // a slab whose height (its corners' shorter edge) crosses 3: a line end below, a mass corner above (and the table's end vs mass at 2)
  ['line end vs mass corner (edge 3)', 3, [2.9, 2.95, 2.99, 3.01, 3.05, 3.1, 3.15, 3.2, 3.25, 3.3], (E, t) => [E.R(6, 12 - t / 2, 12, t)]],
  ['table: end vs mass (edge 2)', 2, [1.9, 1.95, 1.99, 2.01, 2.05, 2.1, 2.2, 2.25, 2.3], (E, t) => [E.R(6, 12 - t / 2, 12, t)]],
  // a trapezoid whose base corners cross 105 degrees (square band vs wide)
  ['table: square vs wide (105 deg)', 105, [104, 104.5, 104.99, 105.01, 105.5, 106, 107, 108, 109], (E, a) => { const h = 6, dx = h / Math.tan(rad(180 - a)); return [E.P([6, 15], [18, 15], [18 - dx, 9], [6 + dx, 9])]; }],
  // a triangle whose apex crosses 75 degrees (tip vs square band; the tip's crest and landing)
  ['tip vs corner (75 deg)', 75, [73, 74, 74.99, 75.01, 75.5, 76, 77, 78, 79], (E, a) => { const h = 8, w = h * Math.tan(rad(a / 2)); return [E.P([12 - w, 16], [12 + w, 16], [12, 8])]; }],
  // a post under a slab whose overhang (the flare corner's shorter edge) crosses 1.5 (flare vs join)
  ['table: flare vs join (edge 1.5)', 1.5, [1.2, 1.25, 1.3, 1.4, 1.49, 1.51, 1.6], (E, o) => [E.R(12 - 0.75 - o, 9, 1.5 + 2 * o, 1.5), E.R(11.25, 10.5, 1.5, 5)]],
];
for (const [name, cut, ts, shape] of SWEEPS) {
  for (const [en, E, fromTable] of engines) {
    const LAW = fromTable(PROP.rounds.shaped), opts = { law: LAW, tightHoles: true, ease: 2.3, join: JOIN10 };
    const ds = ts.map(t => E.build(shape(E, t), opts).d);
    const jumps = ts.slice(1).map((t, i) => ({ from: ts[i], to: t, m: apart(ds[i], ds[i + 1]).m }));
    const big = jumps.reduce((a, b) => b.m > a.m ? b : a);
    console.log(`${name.padEnd(36)} ${en}: largest step ${big.m.toFixed(4)} (${big.from} -> ${big.to}); steps ${jumps.map(j => j.m.toFixed(3)).join(' ')}`);
  }
}
