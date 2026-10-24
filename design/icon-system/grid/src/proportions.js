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
  // ---- g7ba BLIND TEST, ROUND 1: THE RULES THAT FIX IT (director, turn 156: "the spec says how to build roots, but not what makes
  // our icons ours"). Every value below is read by the code (picks7 structMuseum and joins.js, laws7 fromTable, blind.js) and by the
  // spec on the Construction board (proportions-board.js), so the spec and the engine can't disagree.
  //
  // THE JOINS (gap 1: the family's character, by the kind of join, so a new part type gets it by rule). Every place two roots
  // meet is one of five kinds; the kind, not the icon, decides the treatment. The evidence is the six:
  //   HOLDS   a post carries a mass, or stands on a base: it FLARES a step into it (the engine's flare round, 1/2px; leaned where
  //           the mass is curved), on every face open to the outside; a face into a closed counter stays tight.
  //           [coupe stem into bowl and foot; tree trunk into the bottom tier; museum columns into beam and plinth]
  //   OVERHANG a slab or mass that runs past its last post passes it by 1/3 of a post; past the post its face toward the post
  //           drops a step, and the post's flare and the drop are ONE curve (the capital). A mass that ends ON a post that runs
  //           on past it (a headboard, a wall) has no overhang: HOLDS on both faces.   [museum beam and plinth]
  //   RESTS   a part that lies on (or leans against) another and is not fixed to it is CUT FREE, the cut on every face it
  //           touches; its face toward the support follows the support (flat on flat), so the cut is even.
  //           [the gable on the beam; the cup on its saucer]
  //   BASE    what meets the ground or the table. Under ONE support it is a CAP (ellipse on top under a post: the coupe's foot;
  //           underneath under a thing that sits: the saucer). Under TWO OR MORE posts it is a SLAB, with HOLDS and OVERHANG at
  //           its outer posts (the plinth). Posts that reach the ground themselves (legs, a trunk) have no base.
  //   FREE    an end that meets nothing: a post or line ends square with the line-end round, nothing added (the trunk's foot,
  //           the + arms); a mass hanging in the air ends in a tip if it is living (the tiers, drooping), square by OVERHANG if
  //           it is built (the beam; eaves were tried and turned down: "no this is awful").
  // A soft part with a curved top that rests on something (a cushion, a loaf) is a CAP too, ellipse on top, flat on its support:
  // a curved side is always a cap or a vessel, never a free flat ellipse (see ellipse.wholeMin).
  joins: {
    kinds: ['holds', 'overhang', 'rests', 'base', 'free'],
    flare: 1 / 3,       // HOLDS: the flare, in lines (1/2px): the engine's flare round (rounds.shaped.flare is this in px)
    over: 1 / 3,        // OVERHANG: past the last post by 1/3 of a post (museum.over is this)
    drop: 1 / 3,        // OVERHANG: the face toward the post drops a step past it, in lines (1/2px)
    k: 1 / 2,           // OVERHANG: the capital curve's handle, as a share of the overhang (the museum's)
    restingParts: 1,    // RESTS: at most ONE part per icon is cut free; it is cut on every face it touches, one cut (gap 6)
  },
  // SLAB OR MASS (gap 4): a horizontal block that carries or caps something (a beam, a plinth, a saucer, a foot, a shelf, a table
  // top) is a SLAB: one line thick, never scaled. A block that IS the thing (the cup's body, a mattress, a suitcase, a book) is a
  // MASS: a shape, sized by its ratio to the widest root. Test: if it still names the thing drawn one line thick, it's a slab.
  block: { slab: 1, massMin: 2 },   // a slab is 1 line; a mass is at least 2 lines tall (3px), or it reads as a slab
  // THE LATTICE AND THICKNESSES (gap 5): the 1/3px lattice places a part's first edge. A thickness that is a PART (a line, post,
  // slab, wall) is exact, and its far edge may sit off the lattice (the beam's underside). A thickness that is a SPACE or a SHOWN
  // LENGTH (a cut, a gap, how much of a post shows) is a minimum: the next part starts on the first lattice line at least that far
  // away (the cup's saucer: a cut of 1px or a little more; a post that shows one line shows 1 2/3px).
  lattice: 1 / 3,
  // ROUNDS, ONE TABLE (gap 3): the engine's law, in px on screen, never chosen per icon. laws7.fromTable builds the law from this,
  // and construction.js / blind.js use it (the six rebuild byte for byte). Two columns: SHAPED marks (solid, in the badge) and LINE
  // marks (outline and open: the star, the person, the +), which have no masses to flare, so no flares and lighter mass corners.
  //   angles: concave or convex; 'square' = 75-105 degrees; under 75 a tip; over 105 wide. holeTight: a counter's corners take
  //   join (square) or wideIn, whatever their turn (shaped); line marks round a counter's corners like any corner (the star's
  //   counter is the star made smaller: its tips are tips)
  rounds: {
    shaped: { tip: 0.35, tipShare: 0.0877, end: 0.3, endEdge: 2, mass: 0.6, wideOut: 0.7, flare: 0.5, flareEdge: 1.5, flareFit: 0.45, join: 0.15, wideIn: 0.3, fit: 0.2, holeTight: true },
    line: { tip: 0.35, tipShare: 0.0877, end: 0.3, endEdge: 2, mass: 0.45, wideOut: 0.7, flare: null, join: 0.15, wideIn: 0.3, fit: 0.2, holeTight: false },
  },
  // OUTLINE MARKS (gap 2): every outline mark is the same size: SIZED BY ITS OUTSIDE to the OUTLINE CUT, the class cuts (Wide,
  // Square, Tall, as for shaped icons) scaled to the star, the first outline mark: its Square cut is the star's width on screen,
  // 14.07px. Drawn in its own 24 box at whatever slot the app shows it (20px row star, 24px account button), the line 1 1/2px ON
  // SCREEN; the slot only sets the box's scale. Its counters are CHECKED, not the sizer: each closed counter at least 2 lines (3px)
  // across. If one falls short, change a proportion from the series, never the size. (The star's own counter is 2 1/2 lines: its
  // shape, one counter. Two counters stacked at 2 1/2 lines need 14.5px of height, over the cut, so 2 1/2 can't be the floor.)
  outline: { square: 14.07, counterMin: 2 },
  // A WHOLE ELLIPSE (the bed's pillow failed TAIL at 1/2): an ellipse drawn whole is at least 2/3 as tall as it is wide; flatter is a
  // cap (a slab cut by an ellipse) or a rectangle the law rounds.
  ellipseWhole: { min: 2 / 3 },
  // PLACED BY WEIGHT, SCOPED (rule 11; the pillow sat mid-mattress, "a loaf on a bench"): a part resting on ONE other part alone sits
  // with its ink centre over that part's centre (the cup on its saucer). A part resting on one part AND against another sits
  // against it, across the same cut (a pillow against the headboard).
  // ---- the re-run under the fixed spec (not blind: a check of the rules), src/picks-blind.js bed2 / person2
  bed2: {
    mattress: 1 / 4,    // a MASS (it is the thing), 1/4 as tall as wide; the widest root
    rise: 1 / 3,        // the headboard, a post, stands 1/3 of the mattress's width above it (HOLDS both faces: it runs on past)
    pillow: 2 / 5,      // the pillow, a CAP resting (RESTS: flat on the mattress, its end against the headboard), 2/5 of the mattress
                        // (1/3 read as a crumb at 24; a cap no taller than its width: at 2/3 the ends turn under 30 degrees, KINK)
    pillowH: 1 / 2,     // its height 1/2 its width (a cap: the ellipse its full height, its ends cut at half its height)
    // the foot leg holds the mattress up: OVERHANG at the foot (1/3 post past it, the underside drops a step, one curve); the legs reach
    // the floor (no base), showing at least one line (the lattice rule: 1 2/3px); FREE ends
  },
  person2: {
    // OUTLINE mark, sized by its outside to the outline cut; counters checked at 2 lines
    head: 1 / 2,        // the head (a circle) is 1/2 as wide as the shoulders
    shoulders: 1,       // the shoulders: the top half of a CIRCLE (4/5 left the shoulders' counter 2.6px at the outline cut)
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
