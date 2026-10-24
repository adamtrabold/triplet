// g7ba: the spec's round table (PROP.rounds) against the laws the six were built with, corner by corner, so the spec and the
// engine can't disagree silently. Every combination of convex / concave / hole, angle 10-170 by 1 degree, edges 0.3-8px.
//   node rounds-check.js   -> prints "rounds: table = engine (N corners)" or the first mismatches; exit 1 on a mismatch
'use strict';
const { LAWS7, HUMAN, fromTable } = require('./laws7.js');
const { PROP } = require('./proportions.js');
const shapedEngine = HUMAN({ flare: 0.5, mass: 0.6, end: 0.3, tipShare: 0.0877 });   // construction.js / blind.js before g7ba
const lineEngine = c => (c.convex && c.angle < 75) ? Math.min(LAWS7.joint(c), 0.0877 * Math.min(c.lin, c.lout)) : LAWS7.joint(c);   // construction.js starTipLaw, unscaled
const S = fromTable(PROP.rounds.shaped), L = fromTable(PROP.rounds.line);
let n = 0; const bad = [];
const edges = [0.3, 0.5, 0.75, 1, 1.25, 1.49, 1.5, 1.51, 1.75, 2, 2.01, 2.5, 3, 4, 6, 8];
for (const convex of [true, false]) for (const hole of [false, true]) for (let a = 10; a <= 170; a += 1) for (const lin of edges) for (const lout of edges) {
  const c = { convex, hole, angle: a, lin, lout }; n++;
  if (S(c) !== shapedEngine(c)) bad.push(['shaped', c, S(c), shapedEngine(c)]);
  if (L(c) !== lineEngine(c)) bad.push(['line', c, L(c), lineEngine(c)]);
}
// the angle bands' edges exactly
for (const a of [74.999, 75, 105, 105.001]) for (const convex of [true, false]) for (const hole of [false, true]) { const c = { convex, hole, angle: a, lin: 3, lout: 3 }; n++; if (S(c) !== shapedEngine(c)) bad.push(['shaped', c]); if (L(c) !== lineEngine(c)) bad.push(['line', c]); }
if (bad.length) { console.log('rounds: MISMATCH', bad.length, JSON.stringify(bad.slice(0, 5))); process.exit(1); }
console.log(`rounds: table = engine (${n} corners, both columns)`);
