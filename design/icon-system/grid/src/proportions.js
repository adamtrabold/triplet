// g7az THE PROPORTIONS (owner, 10-24: "Yeah let's try for a ten also it's be best if the underlying shapes were proportionally
// related to each other and the grid so they weren't just random."). ONE source of truth: picks7 (o.prop), boards7, construction.js
// and the Construction board all read this table.
//
// THE SERIES: every proportion in an icon is a simple fraction in halves, thirds, quarters, fifths or sixths (denominator 6 or
// less: the marks of a ruler folded in 2, 3, 4, 5 and 6), or a whole number and one of those (1 3/4, 1 4/5, 2 1/2). Twelve
// marks between 0 and 1. Why this one: it is what the six already nearly follow, measured root by root (scratch meas.js, 38
// measures): the post 5/6 of the line, the cut 2/3, the flares 1/3, the gable's ends 4/5, the cup square, its ear 4/5 of its
// depth, its bottom's ellipse 4/5 as tall as wide, the columns 1/3 of the colonnade. Within 2%, halves-to-sixths hold 19 of
// the 38 as measured; powers of one ratio hold far fewer (the golden section 2, root 2 6, 3/4 4). Most of the rest snap once
// the ratio is taken to the right parent (below); the few that don't are marked WON'T SNAP. Precedent: proportions from small
// whole numbers, as in Alberti's and Palladio's harmonic ratios and Bringhurst's page proportions (The Elements of Typographic
// Style, ch. 8). Stated plainly: the series is dense, so it proves nothing by itself; what makes it a system is that each ratio
// names its parent, and that the values set by eye now follow from it.
//
// EACH RATIO NAMES ITS PARENT, one of two kinds:
//   SHAPES (sizes and places of roots) are fractions of another root: the icon's widest root is 1 (the class fit makes it
//          the cut's width, so a ratio to the box would mean nothing), every other root is a fraction of the widest or of
//          the root it belongs to.
//   THICKNESSES (lines, posts, cuts, gaps, steps, overhangs, counters across) are fractions of THE LINE, 1 1/2px. They are
//          px, so they never scale with the class fit: a 1px cut is a 1px cut in every icon.
//
// AND TWO RULES OF TRANSITION, which are not proportions of shapes but how one shape hands over to the next (the round's lean
// at a flare, when a tip goes soft). They live in engine.js; their values are here.
'use strict';
const SERIES = [1 / 6, 1 / 5, 1 / 4, 1 / 3, 2 / 5, 1 / 2, 3 / 5, 2 / 3, 3 / 4, 4 / 5, 5 / 6, 1];
const LINE = 1.5;   // px at the 24 badge (owner: 1.5px; monoweight)

const PROP = {
  // ---- thicknesses, in lines (x 1.5px)
  line: {
    post: 5 / 6,          // a post that holds a mass up (stem, column, trunk): 1 1/4px
    cut: 2 / 3,           // between parts that rest on each other: 1px
    band: 1 / 2,          // a clear gap between two walls (the coupe's band): 3/4px (was 5/6px: 5/9 of a line, no mark)
    step: 1 / 3,          // every small step: a flare, a slab end's drop: 1/2px
    gableEnd: 4 / 5,      // a gable's upright ends: 1.2px
    apex: 1 / 3,          // a lone apex passes the cut by a step: 1/2px
    droop: 1 / 2,         // a tier's underside lifts by half a line toward the trunk
    bow: -1 / 5,          // a tier's sides sweep in a fifth of a line
    outlineCounter: 5 / 2,// an outline mark's counter, valley to valley across the centre: 2 1/2 lines
    slot: 1 / 2,          // a counter that runs into a wall runs straight for half a line before it turns (the cup's ear)
  },
  // ---- shapes
  ellipse: { vessel: 4 / 5 },   // every vessel's ellipse (the coupe's bowl, the cup's bottom) is 4/5 as tall as it is wide
  cap: { end: 1 / 2 },          // a cap (a slab cut by one ellipse, its full height): the slab's ends cut the ellipse at half its
                                // height; so the ellipse is 1/sqrt(1 - (1/2)^2) = 2/sqrt3 (1.155) of the slab's width (was 7/6 by eye)
  cup: {
    saucer: 9 / 5,      // the saucer (the widest root) is 1 4/5 of the cup's width
    depth: 1,           // the cup is as deep as it is wide (square)
    ear: 4 / 5,         // the ear is 4/5 of the cup's depth, a half circle at its back; its counter a circle on its centre, a line in
    balance: true,      // placed by weight: the cup and ear sit with their ink centre over the saucer's centre (a cup at rest)
  },
  coupe: {
    // the bowl's ellipse is the widest root (its width the glass's) and 4/5 as tall as wide (ellipse.vessel)
    rimCut: 1 / 5,      // the rim line cuts the ellipse 1/5 of its height above its centre: bowl depth = 6/5 of the ellipse's height
    stem: 1 / 2,        // the stem shows half the bowl's depth between bowl and foot
    foot: 4 / 5,        // the foot's ellipse is 4/5 as wide as the bowl's (so it is as wide as the bowl's is tall)
  },
  museum: {
    // the beam (and plinth) is the widest root; the colonnade is the beam less an overhang each side
    over: 1 / 3,        // the beam and the plinth pass the outer columns by 1/3 of a post (a thickness: px, never scaled)
    pitch: 1 / 3,       // the roof rises 1/3 of its run (from the top of its ends to the apex)
    columns: 1 / 3,     // the columns stand 1/3 of the colonnade's width tall (to the 1/3px lattice)
  },
  tree: {
    widths: [2.8, 4.1, 5.3],     // WON'T SNAP: the tiers' half widths, tip to bottom (v123's, the bottom the class's width); the
                                 // nearest series, equal steps 2 : 3 : 4, narrows the tip tier 0.13px at 24 and reads as a spire (tried)
    heights: [4.83, 3, 3.33],    // WON'T SNAP: the tiers' shown heights are the v123 rhythm the owner chose ("i like the
                                 // proportions now"); the nearest series values move the middle tier 0.2px at 24 (stated on the board)
    notch: 3 / 5,                // a notch is 3/5 of the half width of the tier above it
  },
  // ---- blind test (src/picks-blind.js): two icons drawn from the Construction board's spec alone
  bed: {
    // the mattress is the widest root (1); the headboard a post (line.post) at its head end, running to the floor
    mattress: 1 / 4,    // the mattress is 1/4 as tall as it is wide
    rise: 1 / 3,        // the headboard stands 1/3 of the mattress's width above the mattress
    pillow: 1 / 3,      // the pillow (an ellipse) is 1/3 of the mattress's width
    pillowH: 1 / 2,     // and 1/2 as tall as it is wide
    // the legs (posts) show one line under the mattress (reusing the tree trunk's rule); the pillow rests on the mattress
    // across the cut (line.cut)
  },
  person: {
    // OUTLINE mark. The shoulders' ellipse is the widest root (1); sized by its smallest counter, 2 1/2 lines across
    head: 1 / 2,        // the head (a circle) is 1/2 as wide as the shoulders
    shoulders: 4 / 5,   // the shoulders: the top half of one ellipse 4/5 as tall as it is wide (the vessel value, reused)
    // the head rests on the shoulders across the cut (line.cut); every counter is its root less a wall (rule 5)
  },
  star: {
    ri: 0.47,           // WON'T SNAP: the points' slenderness (inner radius / outer), a shape choice; 1/2 would fatten the points
                        // (inner radius +6%; not drawn)
  },
  // ---- rules of transition (engine.js), not proportions of shapes
  transition: {
    flareLean: 7 / 4,   // at a flare (a line into a gentle curve bending the other way) the round runs 1 3/4 as far along the
                        // curve as along the line: between 1 1/2 (a shelf left) and 2 (the line's half collapses)
    tipSoft: 6,         // a tip goes soft when its crest's radius is over 1/6px (1/9 of a line): its crest bends k^2/6, not k
  },
};
// the cap's over (ellipse width / slab width) from where the slab's ends cut it
const capOver = (end = PROP.cap.end) => 1 / Math.sqrt(1 - end * end);
// nearest series value (for the audit)
const nearest = v => { const w = Math.floor(v + 1e-9), t = v - w; const q = [0, ...SERIES].reduce((b, x) => Math.abs(x - t) < Math.abs(b - t) ? x : b); return w + q; };
module.exports = { SERIES, LINE, PROP, capOver, nearest };
