// Corner laws, g7 (batch 1 redrawn). Owner on g6: "the rounding at various intersections feels wrong
// (some places too broad roujnding, some too tight)".
// Principle (join and corner treatment by angle, and by the size of what meets): a radius depends on
// the corner's angle AND on the parts that meet there. FIT: no round is larger than 0.2 x the shorter
// edge at the corner, so a 1.5px slot or line end gets at most 0.3px (no pill shapes), while a large
// join (a stem into a bowl) can take the law's full radius. Radii in screen px at the size drawn.
'use strict';
const fit = (c, r) => Math.min(r, 0.2 * Math.min(c.lin, c.lout));
// JOINS: where a line meets or crosses another part at about a right angle (a concave corner of
// 75-105 degrees), the join meets SQUARE: no round, no notch. A round there fills the corner and adds
// ink (g6/g7: "too broad rounding"); g7c thinned it with an ink trap, which the owner turned down on
// 2026-10-19: "i do not want ink traps... no reason for that on digital imo". A square join adds the
// least ink a join can without cutting into the line. Same for all three laws.
const SQUARE = 0;
const TRAP = { trap: [0.25, 0.25] };   // g7c only, kept to draw the archived before; no law returns it
const join = c => !c.convex && c.angle >= 75 && c.angle <= 105;
// scale a law's answer (a radius or a trap) for an icon drawn in its own viewBox
const scaled = (law, k) => c => { const r = law(c); return r && r.trap ? { trap: r.trap.map(v => v * k) } : r * k; };
const LAWS7 = {
  // By joint: the softness is in the joins; cut ends and tips stay crisp
  // g7f (director, turn 39; owner: "slight rounding of interior and exterior corners to add a vintage
  // softness"): an acute tip (under 75 degrees) and an acute notch each take a SLIGHT round, on the order
  // of the law's other slight values, so tips read softened, not needle-sharp, and notches are never bare
  joint: c => join(c) ? SQUARE : fit(c, c.convex
    ? (c.angle < 75 ? 0.3 : c.angle > 105 ? 0.7 : Math.min(c.lin, c.lout) <= 2 ? 0.3 : 0.45)
    : (c.angle < 75 ? 0.25 : 0.6)),
  // Even wear: every outside corner worn the same depth (0.28px); inside corners barely touched
  wear: c => { if (join(c)) return SQUARE; const f = 1 / Math.sin((c.angle * Math.PI / 180) / 2) - 1; return fit(c, c.convex ? Math.min(1.8, Math.max(0.15, 0.28 / f)) : Math.min(0.45, Math.max(0.12, 0.06 / f))); },
  // Pressed: ink pools inside corners; outside edges stay sharp
  press: c => join(c) ? SQUARE : fit(c, c.convex ? 0.22 : (c.angle < 75 ? 0.45 : 0.9)),
};
const LAW_NAMES = { joint: 'By joint', wear: 'Even wear', press: 'Pressed' };
module.exports = { LAWS7, LAW_NAMES, fit, scaled, TRAP };
