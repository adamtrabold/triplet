// g7ba: the spec's round table (PROP.rounds) against the laws the six were built with, corner by corner, so the spec and the
// engine can't disagree silently. Every combination of convex / concave / hole, angle 10-170 by 1 degree, edges 0.3-8px.
//   node rounds-check.js   -> prints "rounds: table = engine (N corners)" or the first mismatches; exit 1 on a mismatch
'use strict';
const { LAWS7, HUMAN, fromTable, fromTableHard } = require('./laws7.js');
const { PROP } = require('./proportions.js');
const shapedEngine = HUMAN({ flare: 0.5, mass: 0.6, end: 0.3, tipShare: 0.0877 });   // construction.js / blind.js before g7ba
const lineEngine = c => (c.convex && c.angle < 75) ? Math.min(LAWS7.joint(c), 0.0877 * Math.min(c.lin, c.lout)) : LAWS7.joint(c);   // construction.js starTipLaw, unscaled
// g7bb: the blended table (fromTable) equals the hard one everywhere off its ramps (beyond the square band by under 3 degrees, past
// endEdge by under 1/4px, below flareEdge by under 1/4px); here the hard table is what the old laws are compared with
const S = fromTableHard(PROP.rounds.shaped), L = fromTableHard(PROP.rounds.line), SB = fromTable(PROP.rounds.shaped), LB = fromTable(PROP.rounds.line);
const onRamp = c => { const e = Math.min(c.lin, c.lout); return (c.angle > 105 && c.angle < 108) || (c.angle < 75 && c.angle > 72) || (e > 2 && e < 2.25) || (e >= 1.25 && e < 1.5); };
let n = 0; const bad = [];
const edges = [0.3, 0.5, 0.75, 1, 1.25, 1.49, 1.5, 1.51, 1.75, 2, 2.01, 2.5, 3, 4, 6, 8];
for (const convex of [true, false]) for (const hole of [false, true]) for (let a = 10; a <= 170; a += 1) for (const lin of edges) for (const lout of edges) {
  const c = { convex, hole, angle: a, lin, lout }; n++;
  if (S(c) !== shapedEngine(c)) bad.push(['shaped', c, S(c), shapedEngine(c)]);
  if (L(c) !== lineEngine(c)) bad.push(['line', c, L(c), lineEngine(c)]);
}
// the angle bands' edges exactly
for (const a of [74.999, 75, 105, 105.001]) for (const convex of [true, false]) for (const hole of [false, true]) { const c = { convex, hole, angle: a, lin: 3, lout: 3 }; n++; if (S(c) !== shapedEngine(c)) bad.push(['shaped', c]); if (L(c) !== lineEngine(c)) bad.push(['line', c]); }
// the blend: off the ramps it is the table exactly; across them it is continuous (no step over 0.005px for a 0.01 degree or 0.001px move)
let nb = 0, maxStep = 0;
for (const convex of [true, false]) for (const hole of [false, true]) for (let a = 10; a <= 170; a += 0.25) for (const lin of edges) for (const lout of edges) {
  const c = { convex, hole, angle: a, lin, lout }; nb++;
  if (!onRamp(c)) { if (SB(c) !== S(c)) bad.push(['blend shaped', c, SB(c), S(c)]); if (LB(c) !== L(c)) bad.push(['blend line', c, LB(c), L(c)]); }
}
for (const convex of [true, false]) for (const hole of [false, true]) for (const lout of [1, 3, 8]) for (const law of [SB, LB]) {
  let prev = null; for (let a = 60; a <= 120; a += 0.01) { const r = law({ convex, hole, angle: a, lin: 3, lout }); if (prev != null) maxStep = Math.max(maxStep, Math.abs(r - prev)); prev = r; }
  prev = null; for (let e = 0.5; e <= 3; e += 0.001) { const r = law({ convex, hole, angle: 90, lin: e, lout: 8 }); if (prev != null) maxStep = Math.max(maxStep, Math.abs(r - prev)); prev = r; }
}
if (maxStep > 0.005) bad.push(['blend step', maxStep]);
if (bad.length) { console.log('rounds: MISMATCH', bad.length, JSON.stringify(bad.slice(0, 5))); process.exit(1); }
console.log(`rounds: table = engine (${n} corners, both columns); blended table = table off its ramps (${nb} corners), largest step across a ramp ${maxStep.toFixed(4)}px`);
