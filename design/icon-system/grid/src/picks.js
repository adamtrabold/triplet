// The 13 picks as SKELETONS (simple-shape builds), one set per grid concept.
// Not drawings: enough parts to judge how each grid sizes, places and joins.
// Units: CSS px at the size each set is built for (1 unit = 1 screen px).
'use strict';
const { R, C, P, B, O, A, S, cut, pen } = require('./engine.js');

const NAMES = [
  ['restaurant', 'Restaurant', 'fork and knife'],
  ['cafe', 'Café', 'cup and saucer'],
  ['bar', 'Bar', 'coupe'],
  ['venue', 'Venue', 'curtain'],
  ['museum', 'Museum', 'column front'],
  ['landmark', 'Landmark', '⌘ loop'],
  ['attraction', 'Attraction', 'Ferris wheel'],
  ['park', 'Park', 'park bench'],
  ['nature', 'Nature', 'conifer'],
  ['shopping', 'Shopping', 'bag'],
  ['hotel', 'Hotel', 'bed'],
  ['neighbourhood', 'Neighbourhood', 'city blocks'],
  ['street', 'Street', 'walker'],
];

// ⌘: four full loops tangent to the four lines of a central square.
// a = half the square (centreline), rho = loop radius (centreline), w = member.
function cmd(cx, cy, a, rho, w, o = {}) {
  const k = a + rho, out = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) out.push(O(cx + sx * k, cy + sy * k, rho, w, o));
  out.push(B([cx - a, cy - k], [cx - a, cy + k], w, o), B([cx + a, cy - k], [cx + a, cy + k], w, o));
  out.push(B([cx - k, cy - a], [cx + k, cy - a], w, o), B([cx - k, cy + a], [cx + k, cy + a], w, o));
  return out;
}

// ---------------------------------------------------------------------------
// A · PIXEL PLATE: the 24 badge's own pixels. Centre 12,12. Live circle Ø16 (r 8),
// points may reach r 8.5. Straight edges on whole px. Orthogonals, 45°, arcs.
const A24 = {
  restaurant: [
    R(5, 7, 2, 4), R(8, 7, 2, 4), R(11, 7, 2, 4), R(5, 10, 8, 3), R(8, 13, 2, 6),   // fork: three 2px tines
    R(15, 9, 3, 4), C(15, 9, 3), cut(R(12, 5, 3, 8)), R(15, 13, 2, 6),           // knife: blade with a round back
  ],
  cafe: [R(6, 7, 8, 7), O(15, 10, 2, 2), R(5, 15, 14, 2)],
  bar: [C(12, 2.875, 8.125), cut(R(-20, -20, 64, 27)), R(11, 10, 2, 7), R(8, 17, 8, 2)],
  venue: [R(6, 6, 12, 2), S(6, 9, 5.5, 0, 90), S(18, 9, 5.5, 90, 180), R(6, 9, 2, 9), R(16, 9, 2, 9)],
  museum: [P([4, 9], [12, 5], [20, 9]), R(6, 10, 2, 6), R(11, 10, 2, 6), R(16, 10, 2, 6), R(6, 16, 12, 2)],
  landmark: cmd(12, 12, 1.75, 1.75, 2),
  attraction: [O(12, 10, 5, 2), R(11, 5.5, 2, 9), R(7.5, 9, 9, 2), P([9, 15], [15, 15], [17, 19], [7, 19])],
  park: [R(5, 7, 14, 2), R(5, 10, 14, 2), R(7, 7, 2, 6), R(15, 7, 2, 6), R(4, 13, 16, 2), R(6, 15, 2, 3), R(16, 15, 2, 3)],
  nature: [P([12, 4], [16, 8], [8, 8]), P([12, 6], [17, 11], [7, 11]), P([12, 9], [18, 15], [6, 15]), R(11, 15, 2, 4)],
  shopping: [P([7, 9], [17, 9], [18, 18], [6, 18]), A(12, 9, 2.5, 2, 180, 360)],
  hotel: [R(5, 8, 2, 9), R(7, 12, 12, 3), R(8, 9, 4, 2), R(17, 15, 2, 2)],
  neighbourhood: [R(6, 6, 5, 5), R(13, 6, 5, 5), R(6, 13, 5, 5), R(13, 13, 5, 5)],
  street: [C(13, 6, 2), B([12.5, 8.5], [11.5, 13.5], 3), B([12.5, 9.5], [15, 12], 2), B([12.5, 9.5], [9.5, 12], 2),
    B([11.5, 13], [8.5, 18.5], 2), B([11.5, 13], [14, 15.5], 2), B([14, 14.8], [14, 18.5], 2)],
};

// ---------------------------------------------------------------------------
// C · PRESS KIT: module = 2px (the line). Badge = 12 modules; ring 1, air 1, live circle
// r 4 modules. Every part is a whole module or a half (cuts only); slopes 1:1 and 1:2;
// curves are quarter or half circles of whole-module radius. Built at 12 FIRST.
// Units below are px (module x 2) so they share the engine.
const C24 = {
  restaurant: [R(6, 6, 2, 6), R(10, 6, 2, 6), R(6, 10, 6, 2), cut(R(8, 6, 2, 4)), R(8, 10, 2, 8),
    R(14, 8, 4, 4), C(16, 8, 2), cut(R(14, 4, 2, 4)), R(14, 12, 2, 6)],
  cafe: [R(6, 8, 7, 6), O(14, 11, 2, 2), R(6, 15, 12, 2)],
  bar: [C(12, 6, 6), cut(R(-20, -20, 64, 26)), R(11, 11, 2, 5), R(8, 16, 8, 2)],
  venue: [R(6, 6, 12, 2), S(6, 10, 5, 0, 90), S(18, 10, 5, 90, 180), R(6, 10, 2, 8), R(16, 10, 2, 8)],
  museum: [P([4, 10], [12, 6], [20, 10]), R(6, 12, 2, 4), R(11, 12, 2, 4), R(16, 12, 2, 4), R(6, 16, 12, 2)],
  landmark: cmd(12, 12, 2, 1.5, 2),
  attraction: [O(12, 10, 4, 2), R(11, 6, 2, 8), R(8, 9, 8, 2), P([10, 14], [14, 14], [16, 18], [8, 18])],
  park: [R(6, 6, 12, 2), R(6, 9, 12, 2), R(4, 12, 16, 2), R(6, 6, 2, 6), R(16, 6, 2, 6), R(6, 14, 2, 4), R(16, 14, 2, 4)],
  nature: [P([12, 4], [16, 12], [8, 12]), P([12, 8], [18, 16], [6, 16]), R(11, 16, 2, 2)],
  shopping: [P([7, 10], [17, 10], [18, 18], [6, 18]), A(12, 10, 3, 2, 180, 360)],
  hotel: [R(5, 7, 2, 10), R(7, 11, 12, 4), R(8, 8, 4, 2), R(17, 15, 2, 2)],
  neighbourhood: [R(6, 6, 4, 4), R(12, 6, 6, 4), R(6, 12, 4, 6), R(12, 12, 6, 6)],
  street: [C(13, 6, 2), B([12.5, 9], [11.5, 14], 2), B([12.5, 10], [15, 12.5], 2), B([12.5, 10], [10, 12.5], 2),
    B([11.5, 13.5], [9, 18], 2), B([11.5, 13.5], [14, 15.5], 2), B([14, 15], [14, 18], 2)],
};
// tidy: drop zero-size placeholders
for (const k in C24) C24[k] = C24[k].filter(q => !(q.t === 'R' && (q.w < 0.1 || q.h < 0.1)));

// ---------------------------------------------------------------------------
// The 12px chip, the floor every grid meets: 6 x 6 modules of the 2px line, no padding.
// A draws this as its 12 master; C draws it FIRST and builds the 24 up from it.
const X12 = {
  restaurant: [R(1, 0, 2, 4), R(4, 0, 2, 4), R(1, 3, 5, 2), R(2.5, 5, 2, 7), R(8, 3, 3, 4), C(9, 3, 2), cut(R(6, 0, 3, 7)), R(9, 7, 2, 5)],
  cafe: [R(1, 2, 7, 6), O(8.5, 4.5, 1.5, 1.5), R(0, 9, 12, 2)],
  bar: [C(6, -2, 7.4), cut(R(-20, -20, 60, 21)), R(5, 5, 2, 4), R(2, 9, 8, 2)],
  venue: [R(0, 0, 12, 2), S(1, 3, 4.5, 0, 90), S(11, 3, 4.5, 90, 180), R(1, 3, 2, 9), R(9, 3, 2, 9)],
  museum: [P([0, 3], [6, 0], [12, 3]), R(1, 4, 2, 5), R(5, 4, 2, 5), R(9, 4, 2, 5), R(0, 9, 12, 2)],
  landmark: cmd(6, 6, 1.5, 1.5, 1.5),
  attraction: [O(6, 4.5, 3.5, 2), R(5.25, 2, 1.5, 5), R(3.5, 3.75, 5, 1.5), P([4.5, 8], [7.5, 8], [9, 12], [3, 12])],
  park: [R(1, 1, 10, 2), R(0, 5, 12, 2), R(1, 1, 2, 4), R(9, 1, 2, 4), R(1, 7, 2, 4), R(9, 7, 2, 4)],
  nature: [P([6, 0], [10, 6], [2, 6]), P([6, 3], [11.5, 10], [0.5, 10]), R(5, 10, 2, 2)],
  shopping: [P([2, 4], [10, 4], [11, 12], [1, 12]), A(6, 4, 2, 2, 180, 360)],
  hotel: [R(0, 2, 2, 9), R(2, 6, 10, 3), R(3, 3, 3, 2), R(10, 9, 2, 2)],
  neighbourhood: [R(0, 0, 5, 5), R(7, 0, 5, 5), R(0, 7, 5, 5), R(7, 7, 5, 5)],
  street: [C(7, 1.5, 1.5), B([6.5, 3.5], [5.5, 7], 2), B([6.5, 4.5], [9, 6.5], 1.5), B([6.5, 4.5], [4, 6.5], 1.5),
    B([5.5, 6.5], [3, 12], 2), B([5.5, 6.5], [8, 9], 2), B([8, 8.3], [8, 12], 2)],
};

// ---------------------------------------------------------------------------
// B · SEAL: ONE master, drawn in the 24 badge, bigger and closer to the rim (live r 8.5,
// points to r 9). Polar: arcs concentric where they can be, radial members, angles in
// 15° steps. Members marked pen() are centrelines drawn with the 2.00px pen at every
// size; everything else is a mass that scales. detail:true parts drop below 0.8x.
const D = { detail: true };
const B24 = {
  restaurant: [pen(B([6.5, 6], [6.5, 10], 2)), pen(B([9, 6], [9, 10], 2, D)), pen(B([11.5, 6], [11.5, 10], 2)), P([5.5, 9.5], [12.5, 9.5], [10, 13], [8, 13]), pen(B([9, 12], [9, 19.5], 2)),
    S(15, 8.5, 3.5, -90, 90), R(15, 8.5, 3.5, 4), pen(B([16, 12], [16, 19.5], 2))],
  cafe: [R(5, 7, 10, 4), C(10, 11, 5), cut(R(-20, 16, 64, 30)), O(15.5, 10, 2.5, 2), pen(B([4, 17.5], [20, 17.5], 2))],
  bar: [C(12, 3.41, 8.09), cut(R(-20, -20, 64, 27)), pen(B([12, 11], [12, 18], 2)), R(7.5, 18, 9, 2)],
  venue: [R(5.5, 5.5, 13, 2.5), S(5.5, 9, 6, 0, 90), S(18.5, 9, 6, 90, 180), R(5.5, 9, 2.5, 9), R(16, 9, 2.5, 9)],
  museum: [P([3.5, 9.5], [12, 4.5], [20.5, 9.5]), pen(B([7, 10.5], [7, 16.5], 2)), pen(B([10.33, 10.5], [10.33, 16.5], 2, D)), pen(B([13.67, 10.5], [13.67, 16.5], 2, D)), pen(B([17, 10.5], [17, 16.5], 2)), R(6, 16.5, 12, 2)],
  landmark: cmd(12, 12, 1.75, 2.25, 2).map(pen),
  attraction: [pen(O(12, 10.5, 6.25, 2)), C(12, 10.5, 1.75), ...[0, 60, 120].map(a => pen(B([12 + 6.25 * Math.cos(a * Math.PI / 180), 10.5 + 6.25 * Math.sin(a * Math.PI / 180)], [12 - 6.25 * Math.cos(a * Math.PI / 180), 10.5 - 6.25 * Math.sin(a * Math.PI / 180)], 2, D))),
    P([9.5, 16], [14.5, 16], [16.5, 19.5], [7.5, 19.5])],
  park: [R(5.5, 6.5, 13, 2.5), R(5.5, 10, 13, 2, D), R(4, 13, 16, 2.5), pen(B([7, 6.5], [7, 18.5], 2)), pen(B([17, 6.5], [17, 18.5], 2))],
  nature: [P([12, 3], [15.75, 9.5], [8.25, 9.5]), P([12, 6], [16.9, 14.5], [7.1, 14.5]), P([12, 10], [18, 18], [6, 18]), pen(B([12, 17], [12, 21], 2))],
  shopping: [P([6.5, 9], [17.5, 9], [18.5, 18.5], [5.5, 18.5]), pen(A(12, 9, 3, 2, 180, 360))],
  hotel: [pen(B([6, 7], [6, 17], 2)), R(7, 12, 13, 4), R(8, 9, 5, 2.5), pen(B([17.5, 15], [17.5, 17.5], 2))],
  neighbourhood: [R(5.5, 5.5, 5.5, 5.5), R(13, 5.5, 5.5, 5.5), R(5.5, 13, 5.5, 5.5), R(13, 13, 5.5, 5.5)],
  street: [C(13, 5.25, 2), B([12.75, 7.75], [11.5, 13.5], 3.5), pen(B([12.5, 9], [15.5, 12.5], 2)), pen(B([12.5, 9], [9, 12], 2)),
    pen(B([11.5, 13], [8.5, 19.5], 2)), pen(B([11.5, 13], [14.5, 16], 2)), pen(B([14.5, 15.3], [14.5, 19.5], 2))],
};

module.exports = { NAMES, A24, C24, X12, B24, cmd };
