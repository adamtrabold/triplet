// The three grid concepts: frame, sizes, vocabulary and corner law, as data + code.
// Every number here is ours (the team's), not the owner's.
'use strict';
const E = require('./engine.js');
const { A24, C24, X12, B24, NAMES } = require('./picks.js');

// ---- corner laws (radii in screen px at the size being drawn) -------------------------
// Each receives one corner of the joined outline:
//   convex  - the ink is on the inside of the turn (an outside corner)
//   angle   - the corner's angle on the inside of the turn (ink side if convex, air side if not)
//   lin/lout - the lengths of the two edges that meet there
const LAWS = {
  // A · JOINERY: the radius follows the JOINT, like a joiner's or a type drawer's corner.
  joinery(c) {
    if (c.convex) {
      if (c.angle < 75) return 0.4;                        // a tip: keep the point
      if (c.angle > 105) return 1.25;                      // an obtuse shoulder: eased
      if (Math.min(c.lin, c.lout) <= 2.6) return 0.5;      // the end of a 2px member: a cut end, just softened
      return 1.0;                                          // the outside corner of a mass
    }
    if (c.angle < 75) return 0.3;                          // a narrow notch: kept open
    return 0.6;                                            // where two members join: a fillet
  },
  // B · EVEN WEAR: every outside corner loses the same 0.22px from its sharp point, every
  // inside corner fills the same 0.3px. So tips stay sharp, right angles soften, obtuse ones
  // go round. r = e / (1/sin(angle/2) - 1).
  wear(c) {
    const f = 1 / Math.sin((c.angle * Math.PI / 180) / 2) - 1;
    if (c.convex) return Math.min(1.8, Math.max(0.15, 0.22 / f));
    return Math.min(1.5, Math.max(0.2, 0.3 / f));
  },
  // C · PRESS: ink pressed onto paper. Outside corners squeeze round a little (0.35px);
  // inside corners fill (0.9px), as ink pools where two edges meet. One pair of radii;
  // the angle changes what you SEE (tips blunt, narrow notches fill).
  press(c) { return c.convex ? 0.35 : 0.9; },
};

const SIZES = [
  { key: 'badge24', label: '24 row badge / near pin', px: 24 },
  { key: 'sel32', label: '32 selected pin', px: 32 },
  { key: 'chip12', label: '12 filter chip', px: 12 },
];

const CONCEPTS = [
  {
    id: 'A', key: 'pixel', name: 'Pixel plate', law: 'joinery', set: A24, small: X12,
    line: 'One grid square = one screen pixel at the size it shows. A separate drawing for each size.',
    rules: [
      'Canvas: the 24px badge itself. Ring 2, then 2px of air, then a live circle Ø16. Points may reach Ø17.',
      'Keylines inside the live circle: circle Ø16, square 12, upright 10×14, wide 14×10.',
      'Straight edges sit on whole pixels; symmetric parts use even widths so they centre on 12.',
      'Shapes: rectangles, circles and arcs, 45° diagonals; other slopes as whole-pixel steps (1:2, 2:3).',
      'Every line is 2px. A solid is never thinner than 2px; a cut or gap is never less than 1px.',
      'Sizes: a 24 drawing (row badge, near pin and, at 1:1, the selected pin) and a 12 drawing (chip).',
      'Corners by joint: the end of a line 0.5, the outside of a mass 1.0, a tip 0.4, an obtuse shoulder 1.25, a join 0.6, a narrow notch 0.3.',
    ],
    precedent: 'Material (24 canvas, 20 live, keyline shapes), IBM (whole-pixel coordinates), Fluent (a drawing per size).',
    costs: ['Two drawings per icon: 26 to draw and keep in step.', 'The selected pin shows the 24 drawing at 1:1, so the glyph does not grow when the pin does; the extra room is field.', 'With 45° as the only free diagonal, the walker and the wheel\'s stand come out angular.'],
  },
  {
    id: 'B', key: 'seal', name: 'Seal', law: 'wear', set: B24, small: null,
    line: 'A round grid in the badge, one drawing for every size, and a pen that stays 2px.',
    rules: [
      'Canvas: the 24px badge. Ring 2, then 1.5px of air, then a live circle Ø17. Points may reach Ø18: the picture fills the seal, as on a coin or a stamp.',
      'Keylines are polar: rings at r 3, 5.5 and 8.5 round the centre, and rays every 15°.',
      'Curves share the badge\'s centre where they can (the coupe\'s bowl, the bag\'s handle, the wheel).',
      'Two kinds of part: masses, which scale; and lines, which are centre-lines drawn with a 2.00px pen at every size.',
      'Sizes: ONE drawing. The selected pin enlarges it 1.41x, the chip shrinks it to 0.71x; the pen stays 2px, so the chip gets bolder, and parts marked "detail" drop out below 0.8x.',
      'Corners by angle, even wear: every outside corner loses 0.22px from its point, every inside corner fills 0.3px. Tips stay sharp, right angles soften, obtuse corners go round.',
    ],
    precedent: 'SF Symbols (one design, interpolated; margins per weight), coin and seal engraving (the device fills the field), monoline type (a skeleton plus a pen).',
    costs: ['13 drawings, one per icon, and the selected pin grows with them.', 'The chip is the badge drawing at 0.71x with a 2px pen: the wheel loses its spokes, the column front drops to two columns, the cup\'s handle closes.', 'The glyph sits 1.5px from the ring, not 2: fuller, and closer to the rim.'],
  },
  {
    id: 'C', key: 'press', name: 'Press kit', law: 'press', set: C24, small: X12,
    line: 'The 2px line is the grid square. Glyphs are built from a kit of module parts, smallest size first.',
    rules: [
      'Module = 2px, the line. The 24 badge is 12 modules: ring 1, air 1, a live circle 8 modules across.',
      'The 12 chip is 6 × 6 modules and is drawn FIRST; the 24 adds parts to it, never a different idea.',
      'The kit: bars and blocks in whole modules, discs, halves and quarters of whole-module radius, slopes of 1:1 and 1:2. A part may sit on the half module (1px) so it centres or keeps a 1px gap.',
      'Every line is one module (2px); a solid is at least one module; a cut is at least half a module (1px).',
      'Sizes: a 12 drawing and a 24 drawing (the selected pin shows the 24 at 1:1).',
      'Corners by press: outside corners squeeze 0.35px round, inside corners fill 0.9px. One pair of radii; the angle changes what you see.',
    ],
    precedent: 'Wood type and printers\' rule (a kit of parts on a body), Aicher\'s Munich 1972 grid (orthogonals and diagonals), cartographic minimum dimensions (design for the smallest size first).',
    costs: ['Two drawings per icon, and the 12 leads: the 24 may add parts, never a different idea.', 'The coarsest grid: fewest curves (245 for the 13) and the chunkiest parts.', 'Pressed corners fill small openings: the wheel\'s four openings come out as round holes.'],
  },
];

// Build one pick for one concept at one size. Returns { d, far, curves, info, frame }
function glyph(con, id, size) {
  const law = LAWS[con.law], info = [];
  let prims, centre;
  if (con.id === 'B') {
    const base = B24[id];
    if (size === 'badge24' || size === 'alone24') { prims = base; centre = [12, 12]; }
    if (size === 'sel32') { prims = E.xform(base, 12 / 8.5, 12, 12, 16, 16); centre = [16, 16]; }
    if (size === 'chip12') { prims = E.xform(base.filter(q => !q.detail), 6 / 8.5, 12, 12, 6, 6); centre = [6, 6]; }
  } else {
    if (size === 'badge24' || size === 'alone24') { prims = con.set[id]; centre = [12, 12]; }
    if (size === 'sel32') { prims = E.xform(con.set[id], 1, 12, 12, 16, 16); centre = [16, 16]; }
    if (size === 'chip12') { prims = con.small[id]; centre = [6, 6]; }
  }
  const r = E.build(prims, { law, info, centre });
  return { ...r, curves: E.countCurves(r.d), info };
}

module.exports = { LAWS, SIZES, CONCEPTS, NAMES, glyph };
