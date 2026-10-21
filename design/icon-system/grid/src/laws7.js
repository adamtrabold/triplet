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
// g7h (owner, 10-20, on v99): "that whole thing comes together more when all points of meeting are at
// minimum a little bit rounded (and more rounded in other places" and "i do think tight interior corners
// should be less rounded than exterior corners". So a join is no longer square: it takes the law's
// smallest round, JOIN (0.15px). That is a fill, the opposite of a trap, and it adds under 0.01px2 of
// ink per join, so the joins don't thicken. The name SQUARE is kept for the callers.
const JOIN = 0.15;
const SQUARE = JOIN;
const TRAP = { trap: [0.25, 0.25] };   // g7c only, kept to draw the archived before; no law returns it
const join = c => !c.convex && c.angle >= 75 && c.angle <= 105;
// scale a law's answer (a radius or a trap) for an icon drawn in its own viewBox
const scaled = (law, k) => c => { const r = law(c); return r && r.trap ? { trap: r.trap.map(v => v * k) } : r * k; };
const LAWS7 = {
  // By joint: the softness is in the joins; cut ends and tips stay crisp
  // g7f (director, turn 39; owner: "slight rounding of interior and exterior corners to add a vintage
  // softness"): an acute tip (under 75 degrees) and an acute notch each take a SLIGHT round, on the order
  // of the law's other slight values, so tips read softened, not needle-sharp, and notches are never bare
  // g7h (owner, above): every meeting point takes at least a slight round, and a TIGHT INTERIOR corner
  // (a join, a counter or slot corner, a sharp notch: concave, 105 degrees or less) takes JOIN, well
  // under the exterior values, so the notches read tighter than the tips (the tree was 0.25 against
  // 0.3). Exterior acute tips move up to 0.35, cut ends stay 0.3, mass corners 0.45, obtuse 0.7. A WIDE
  // interior corner (over 105, e.g. the Star's shoulders) drops from 0.6 to 0.3, so no inside corner is
  // rounder than the outside points next to it.
  joint: c => fit(c, c.convex
    ? (c.angle < 75 ? 0.35 : c.angle > 105 ? 0.7 : Math.min(c.lin, c.lout) <= 2 ? 0.3 : 0.45)
    : (c.angle <= 105 ? JOIN : 0.3)),
  // Even wear: every outside corner worn the same depth (0.28px); inside corners barely touched
  wear: c => { if (join(c)) return SQUARE; const f = 1 / Math.sin((c.angle * Math.PI / 180) / 2) - 1; return fit(c, c.convex ? Math.min(1.8, Math.max(0.15, 0.28 / f)) : Math.min(0.45, Math.max(0.12, 0.06 / f))); },
  // Pressed: ink pools inside corners; outside edges stay sharp
  press: c => join(c) ? SQUARE : fit(c, c.convex ? 0.22 : (c.angle < 75 ? 0.45 : 0.9)),
};
const LAW_NAMES = { joint: 'By joint', wear: 'Even wear', press: 'Pressed' };
// g7t EXPLORATION (owner on v134: "i still find myself pining for that original shape. i think it's the fact
// that it feels more delicate. that more humanistic approach to curves gives it a handmade feel that i think
// calls back to the physicality of making vintage work"): HUMAN(h) is the joint law with FLARES. Where a
// post meets a mass at about a right angle (a JOIN: concave, 75-105 degrees, both edges at least a line
// long), the corner flares with a round of h.flare, as a stem is pulled out of the glass or a trunk grows
// into its branches; it may take up to 0.45 of the shorter edge (FIT is 0.2), so a flare can read. Counter
// and slot corners (h.hole) and sharp notches stay tight (JOIN): the inside of a counter is never flared.
// Outside mass corners take h.mass, cut ends h.end. Everything else is the joint law.
const HUMAN = h => c => {
  if (c.hole) return fit(c, c.angle <= 105 ? JOIN : 0.3);
  if (!c.convex && c.angle >= 75 && c.angle <= 105 && Math.min(c.lin, c.lout) >= 1.5) return Math.min(h.flare, 0.45 * Math.min(c.lin, c.lout));
  if (c.convex && c.angle >= 75 && c.angle <= 105) return fit(c, Math.min(c.lin, c.lout) <= 2 ? h.end : h.mass);
  // g7ae (owner: "top two sections' tree branch ends feel more rounded than bottom one"): h.tipShare, an acute tip's
  // round as a share of its shorter edge (0.35 at most), so a small tier's tip is as round, for its size, as a big one's
  if (h.tipShare && c.convex && c.angle < 75) return Math.min(LAWS7.joint(c), h.tipShare * Math.min(c.lin, c.lout));
  return LAWS7.joint(c);
};
module.exports = { LAWS7, LAW_NAMES, fit, scaled, TRAP, JOIN, HUMAN };
