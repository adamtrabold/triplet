// THE SYSTEM. The one place every decision lives: the decision points (SETTINGS), the sizes, the general rules, each icon's
// declaration (DECL: data, the only per-icon input), the build, the checks. THE-SYSTEM.md and the board are written from this file.
//
// An icon is made by system-make.js from its declaration alone: the kinds of root (what a vessel, a loop, a cap, a slab, a post, a
// gable, tiers, a row, a comb, a head, a blade is), how each root meets the one above it (cut, into, held, notch, tangent), the
// layout (the spine top to bottom; columns side by side), then the class fit, optical centring, the roots landed on the iPhone grid,
// the corner law with the cutter rack, continuous-curvature fairing and the mirror. Nothing in the build or the checks names an icon.
//
//   node system.js build <18|24|12> [ids]   one size per process
//   node system.js check                     every automatic check on every built size; exit 1 on any failure (blocks publishing)
//   node system.js spec                      writes grid/THE-SYSTEM.md
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'svg', 'system');

// ---------------------------------------------------------------------------------------------------------------------------
// THE DECISION POINTS. Each: what is decided, its current setting, when it was set. status: 'set' or 'open' (with the choices).
// by: 'designer' marks a setting the designer made where it was asked for; it stays the owner's to change.
const SETTINGS = [
  { g: 'Purpose', items: [
    ['One set, one system', 'One harmonious, complete set and the rules that make every future icon right first time. The first six are a test of the system; a wrong icon is a finding about the system.', '10-21'],
    ['What it covers', 'Place icons, app and control icons, and the Home Screen icon.', '10-16'],
    ['Rules, not drawings', 'Every decision changes the system; icons change only because the system did. An icon\'s declaration is its only input; no hand-placed points.', '10-27'],
    ['Flexible, not specific', 'Rules are general: no rule names one icon. An icon is a short declaration of its roots, how they relate, joined or cut; the system supplies the rest.', '10-26'],
    ['How it looks wins', 'What it looks like matters more than the letter of a rule.', '10-27'],
    ['The grid is the brand', 'The grid and the drawing method are specific to Triplet; how other systems size icons does not apply.', '10-20'],
  ] },
  { g: 'Sizes and the grid', items: [
    ['Master size', '18, drawn 1:1 in the 24px ring (the glyph about 10-11px across). 24 and 12 are their own variants with detail adjusted for the size, never a scaled copy.', '10-27'],
    ['Where each size ships', '18 in the 24 ring on pins and list rows; 24 in the 32 ring on the selected pin; 12 bare on filter chips.', '10-27'],
    ['The grid', 'One iPhone pixel, 1/3px. The system writes each size for the iPhone directly; there is no refit pass for any device.', '10-27'],
    ['Snap priority', 'Silhouette first: an outer edge goes to a whole px when one is within 1/4px, else the nearest iPhone pixel. Then the outer side of each stroke (its width kept). Inner edges, counters, curves, diagonals, points and rounds stay as drawn; but a point or curve drawn level with an outer edge goes to the line that edge landed on (its other end stays landed). The roots land on the grid before any corner is rounded, so every round and join is built on landed roots; otherwise a curved root is never stretched, only scaled evenly.', '10-29'],
    ['Centring', 'A centred part is exactly centred: an even count of iPhone pixels about the icon\'s centre. Vertical centring is optical, per icon.', '10-27'],
    ['Centred under a part', 'A part centred under another takes its parity, one iPhone pixel wider when they differ, so it stays exactly centred.', '10-28', 'designer'],
    ['What carries the read', 'A size keeps the 18\'s proportions, changing them only where the icon needs it to read. The test: a plain part (a post to the bottom: a handle, a grip) against the parts it holds, which carry the read (tines and head; a blade beside them follows). Where the size\'s fixed widths have made it longer against them than at 18 by more than an eighth, it gives height back until the 18\'s proportion returns. A post showing a share of its root, or a stroke, keeps its proportion already.', '10-29', 'designer'],
    ['Sharpness', 'As sharp as possible: core dimensions and core line landings are never fuzzy.', '10-26'],
    ['Scale and weight', 'Settled once for the set at the grid level: every icon the same optical size and weight; never negotiated icon by icon.', '10-20'],
    ['Shapes in a diamond', 'A shape (Neighbourhood, Street) sits in a diamond badge, so its class box is a diamond of the coin\'s area: the drawing is fitted by how far its ink reaches across the diamond, not by its width and height.', '10-30', 'designer'],
    ['The box', 'An icon is fitted to its class box (wide, square, tall) by the sides that scale, and never grows past its v264 size: each outer edge at most one iPhone pixel past where v264\'s lands on the grid. A rule that needs room takes it from the icon\'s own proportions; the box never gives way.', '10-27'],
  ] },
  { g: 'Weight', items: [
    ['Stroke', 'A stroke is 1 1/2px at 18 (2 at 24, 1 at 12). Monoweight: an inner edge follows its outer edge.', '10-26'],
    ['Stroke at 18 on the grid', '1 1/2px, its outer side on the grid and its inner side half an iPhone pixel soft (1 1/3 was sharper both sides but read lighter than the set\'s weight).', '10-27', 'designer'],
    ['Parts that are not strokes', 'Sized by eye to read at the stroke\'s weight. Posts, columns, stems, trunks and tines: 1 1/3 at 18, 1 2/3 at 24, 1 at 12 (whole iPhone pixels). Never under 1 1/4 at 18.', '10-27'],
    ['Thinnest part at 12', 'A row\'s or a comb\'s parts (and a comb\'s slots, which share their width) may thin to 2/3px (two iPhone pixels) at 12 to keep the count; nothing else goes under 1px.', '10-28', 'designer'],
    ['Solids are shapes', 'A solid part (slab, cap, mass) is a shape, not a line: it reads by its shape, and a thin slab is never thinner at its ends than its middle.', '10-26'],
    ['Same role, same width', 'Parts with the same role share one width. A comb (parts with slots cut between them) is one role: parts and slots one width.', '10-27'],
    ['The ring', '1 1/3px at 24 (4 iPhone pixels): whole pixels and a step lighter than the glyph\'s stroke.', '10-27', 'designer'],
  ] },
  { g: 'Construction', items: [
    ['Roots', 'Every part comes from a simple root shape (vessel, slab, post, loop, gable, cap, ellipse, circle); roots join or are cut apart to make the glyph.', '10-23'],
    ['Proportions', 'Roots are proportionally related to each other and to the grid: every ratio a simple fraction of its parent root; every thickness a fraction of the line.', '10-24'],
    ['Aligned roots', 'The same kind of part uses the same root in every icon; bases are not mixed at random.', '10-20'],
    ['Brand in the roots', 'An icon looks like the system through the decisions that made it: which roots, how they relate, joined or cut.', '10-26'],
    ['Few points', 'Minimal bezier points, perfect architecture.', '10-16'],
    ['Holes', 'A hole is its own proportional root shape that also makes the solid around it right, never a stroke offset.', '10-26'],
    ['Counters and gaps', 'Aim for whole pixels (1 or 2 at 18), but how it looks wins over the rule. At 12 a counter under 1px closes and the part goes solid.', '10-27'],
    ['Inner bands', 'A gap or band inside a form is no thicker than the stroke, and a fill it contains reads full.', '10-27'],
    ['Rows', 'A row of repeated parts reads as its count of distinct parts. Parts at the part width, gaps equal and at least the counter minimum: on the grid when the row then fits inside its root\'s span (exactly, under a slab that holds it: the overhang is the chamfer\'s), else filling the span exactly. If the gaps can\'t reach the minimum, the parts thin to the size\'s thinnest; only then one part fewer (never below two).', '10-27'],
    ['Combs', 'A comb keeps its count first, as a row does: across the room its box leaves, parts and slots one width, the part width if they fit, else thinner a grid step at a time to the size\'s thinnest; only then one part fewer (never below two).', '10-28'],
    ['Comb depth', 'A cut into a curved part stops where that part starts to turn, and never runs down into the curve, so the part keeps its mass: a comb\'s slots cut on into the curved root they run into, following its curve (Cuts follow the curve), until that curve moved in has turned a quarter of a right angle (22.5 degrees, half the chamfer\'s). There the cut is a floor and runs flat, on the nearest iPhone pixel line, never leaving less than a line under it.', '10-28', 'designer'],
    ['Protrusions', 'A feature that has to read by sticking out (an edge, a step, a lip) clears a minimum visible protrusion: one whole pixel past what it sticks out from at 18 (1 1/3 at 24, 1 at 12), after the join\'s round.', '10-27'],
    ['No narrow passages', 'No passage that vanishes at small sizes.', '10-19'],
    ['Handles', 'A handle takes its rule from the root shape it is (a cup\'s ear is a loop around its counter).', '10-26'],
    ['A handle on a face', 'A loop on a top face stands on it as a half circle, its feet a share of the face apart. A loop that runs on behind a face shows through it: past a band of the line, its legs go on into the face as slots of the loop\'s own width, ending round.', '10-30', 'designer'],
    ['When rules meet', 'Continuous curvature first, then minimum widths, then same-role widths, then protrusions, then the grid. The box always holds.', '10-27', 'designer'],
  ] },
  { g: 'Tooling and curvature', items: [
    ['Machined', 'Every round and join is what a cutting tool would leave, by how the part would really be machined smooth.', '10-26'],
    ['The cutter rack', 'Three cutters, 1/8, 1/4 and 1/2px. Every round is the one nearest what the corner asks: a post into a face the 1/2; a mass\'s corners the 1/2; a slab\'s or post\'s own corners the 1/4; tight inner corners and every cut the 1/8. A cutter too big for the corner\'s edges steps down.', '10-26'],
    ['Chamfer under an overhang', 'A post under a slab that runs past it meets it with a bevel (a chamfer, its edges broken); the bevel holds at every size: the slab runs a third of a line past the post and its face drops a third of a line, at every size, on the landed roots.', '10-26'],
    ['Chamfer angle', '45 degrees: the cut rises as far as it runs, half above the post and half into it (a steeper cut turns under 30 degrees at its edges and reads as a knee). At 18 the third of a line lands at 2/3px.', '10-28', 'designer'],
    ['The rack at 24 and 12', 'The cutters are set at 18 and scale with the drawing at 24 and 12, so every size is the same icon.', '10-28', 'designer'],
    ['Fillet into a face', 'A post into a face (curved or flat) meets it with a fillet: a flare, never an ink trap.', '10-26'],
    ['Points', 'A point sharper than 75 degrees is broken, not milled, and is one of two kinds, told by its sides. An apex (its two sides mirror each other: a gable\'s or tier\'s top, a star\'s points) reads by its crest, the radius at its nose on screen: a fifth of the line at every size (0.3px at 18), however its sides arrive; straight sides meeting a round leave a smaller crest than curved sides easing in, so its round grows until the crest reads a fifth of a line (within a tenth), as far as continuous curvature allows. A tip (its sides differ: a tier\'s eave, a blade\'s tip) keeps the tip rule: its round scales with its edge, so it stays sharp.', '10-28'],
    ['Every meeting rounded', 'Every meeting point is at least slightly round, some more; the radius varies with how the angle meets. One join pattern per corner type across all icons.', '10-22'],
    ['Inner corners', 'Tight inner corners are rounded less than outer corners; inner joins are never over-rounded.', '10-21'],
    ['Whole curves', 'A curved edge is drawn whole from one circle or ellipse, never one arc per point.', '10-23'],
    ['Continuous curvature', 'Joins are smooth and architectural: curvature is continuous through a join, with no humps or wobbles at the join or on the line leaving it.', '10-23'],
    ['Counters follow', 'A counter\'s curve follows the outside curve it sits in.', '10-22'],
    ['Cuts follow the curve', 'Where a slot or a counter is cut into a curved part, its inner edges follow the outer curve, moved in by the wall, so the wall left round it is one even thickness: the wall is the width of the part it continues (a comb\'s outer tine runs on round its head as one band). A curve moved in to no rounder than a line is not followed (it would kink: curvature first); the cut stays square (the fork at 12).', '10-28'],
    ['Humanist line', 'Loosened, humanist curves; restrained flares; every joint and flare architecturally sound.', '10-21'],
  ] },
  { g: 'Brand', items: [
    ['Direction', 'Built and constructed; clarity first; whimsy wanted; craft matters most; warmth from subtle rounding and other sources; hand-made is never ruled out.', '10-15'],
    ['Three filters', 'Plain (as straightforward as the signs and tags it comes from); made by a tool; left of centre (personality from what we draw, not how).', '10-26'],
    ['Ring and alone', 'Place icons are solid in a stroked ring and also work on their own.', '10-16'],
    ['Never', 'Ink traps; swoops, brackets and other cheeky signatures; a rounded or sagging building base; an arched lintel; pill-shaped column counters; a fully rounded cup base or trunk; intense flares; a deep, stout coupe bowl.', '10-26'],
    ['Outline or solid', 'open', '10-25', null, ['A tap fills it: outline when off (star, visited); a category: solid; a control: open strokes', 'Something else']],
    ['Novelty', 'open', '10-15', null, ['Built is novel enough beside the app\'s vintage-travel theme', 'Push it further']],
  ] },
  { g: 'Line marks', items: [
    ['Star and +', 'Not decided. One drawing per mark everywhere it appears, shown bare at its app size, never in a ring; exactly centred; the same visual weight as the set.', '10-27'],
    ['Star', 'The v264 star at the row\'s 18px box (one star for the row and the tag); its outline 1 1/3px.', '10-27', 'designer'],
    ['+', 'The v264 + at 14px across in the 60px button, centred on a whole px, its stroke 2px (6 iPhone pixels, so both sides land); same whole-pixel width and height.', '10-27', 'designer'],
  ] },
  { g: 'Subjects (each the test of the rules)', items: [
    ['Categories', '11 pins (Restaurant, Café, Bar, Venue, Museum, Landmark, Attraction, Park, Nature, Shopping, Hotel) plus Neighbourhood and Street. Visited does not change.', '10-16'],
    ['Subjects', 'Café cup and saucer; Bar a coupe on a long stem, its bowl shallow and wider at the bottom; Museum a column front, flat base, separated gable; Nature a conifer, indented branches with light swoops; Restaurant fork and knife; Landmark the Nordic loop; Attraction a Ferris wheel; Park a bench; Venue a curtain; Hotel a bed; Neighbourhood city blocks; Street a walker.', '10-21'],
    ['Museum columns', 'Three counters (four columns): two columns read as a bank.', '10-27'],
    ['Shopping', 'A bag. The subject stays; the job is execution: the handle rule, counters and roots make it read as a bag, not a padlock or a fuel can.', '10-30'],
  ] },
];

// ---------------------------------------------------------------------------------------------------------------------------
// THE SIZES. k: how the size's px relate to the master's (the drawing frame is 24 units; a size shows that frame at 24 k px).
// Widths are px AT THAT SIZE (whole iPhone pixels where the grid allows); in the frame's units they are px / k.
const SIZES = {
  18: { k: 1, frame: 24, stroke: 1.5, part: 4 / 3, min: 1.25, gap: 1, band: 1, counter: 1, protrude: 1, close: false },
  24: { k: 4 / 3, frame: 32, stroke: 2, part: 5 / 3, min: 5 / 3, gap: 4 / 3, band: 4 / 3, counter: 4 / 3, protrude: 4 / 3, close: false },
  12: { k: 2 / 3, frame: 16, stroke: 1, part: 1, min: 2 / 3, gap: 1, band: 1, counter: 1, protrude: 1, close: true },
};
// WHAT CARRIES THE READ: a size keeps the master's proportion of a plain part (a post to the bottom: a handle, a grip) to what it
// holds; only when the size has drifted it more than READ_DRIFT toward the plain part does the plain part give height back
const READ_DRIFT = 1 / 8;
const IPX = 1 / 3;
const RING = { 18: 4 / 3, 24: 5 / 3 };   // the ring's width in px: the 24 ring (around the 18) and the 32 ring (around the 24)
// a line mark is one drawing, landed in its own app box (the class sets it): the star in the row's 18px box, the + at 14px across
const MARK = { outline: { frame: 18, std: { stroke: 4, centred: 4, counter: 3 } }, open: { frame: 28, std: { stroke: 6, centred: 6, counter: 3 } } };

// ---------------------------------------------------------------------------------------------------------------------------
// THE GENERAL RULES (each names no icon; all widths in one unit)
// A ROW: n parts and the equal gaps between them, across the span its root sets. In order: parts at the part width, gaps on the
// grid (a whole count of grid steps, at least the counter minimum), the row centred on the grid and inside the span by at most one
// grid step a side (exactly the span under a held slab: the overhang is the chamfer's); else equal gaps filling the span exactly. Neither: the parts thin, a grid step at a time, to the size's thinnest.
// Only then one part fewer (never below two).
// COUNT FIRST (rows and combs alike): the widths a part may take, widest first: the part width, then a grid step at a time down
// to the size's thinnest. Every width is tried before a part is lost.
function thinning(w, wMin, grid) {
  const widths = []; for (let wv = w; wv >= wMin - 1e-9; wv -= grid) widths.push(wv); if (widths[widths.length - 1] > wMin + 1e-9) widths.push(wMin);
  return widths;
}
function row({ span, w, wMin, n, min, grid, exact = false }) {   // exact: the row spans its root's span exactly (the overhang is the chamfer's)
  const widths = thinning(w, wMin, grid);
  for (let m = n; m >= 2; m--) for (const wv of widths) {
    for (let j = Math.ceil((min - 1e-9) / grid); ; j++) {
      const g = j * grid, tot = m * wv + (m - 1) * g; if (tot > span + 1e-9) break;
      const q = tot / (2 * grid); if (Math.abs(q - Math.round(q)) < 1e-6 && span - tot <= (exact ? 1e-6 : 2 * grid + 1e-9)) return { n: m, w: wv, gap: g, span: tot, grid: true };
    }
    const g = (span - m * wv) / (m - 1); if (g >= min - 1e-9) return { n: m, w: wv, gap: g, span, grid: false };
  }
  return { n: 2, w: wMin, gap: span - 2 * wMin, span, grid: false };
}
// A COMB: parts and the slots cut between them are one role, so one width, across the room its box leaves. Count first, as a row:
// the part width if it fits; else thinner, a grid step at a time, to the size's thinnest (parts and slots together); only then one
// part fewer (never below two).
function comb({ n, w, wMin, span, grid }) {
  const widths = thinning(w, wMin, grid);
  for (let m = n; m >= 2; m--) {
    const k = 2 * m - 1;
    for (const wv of widths) if (k * wv <= span + 1e-9) return { n: m, w: wv, slot: wv, span: k * wv, thinned: wv < w - 1e-9 };
  }
  return { n: 2, w: wMin, slot: wMin, span: 3 * wMin };
}

// ---------------------------------------------------------------------------------------------------------------------------
// THE DECLARATIONS: data, the only per-icon input. spine: the roots top to bottom; each names its kind, its size as a share of a
// parent (w of 'of', else of the box), and how it meets the root above it (join). The board and THE-SYSTEM.md print them from here.
//   joins: cut (rests on it, a cut apart) · into (a post into a face: a fillet) · held (posts under a slab that runs past them: the
//   chamfer) · the loop meets its vessel's wall in one tangent curve; tiers notch into each other.
const DECL = {
  cafe: { name: 'Café', cls: 'wide', spine: [
    { id: 'cup', kind: 'vessel', w: 5 / 9, of: 'saucer', deep: 1 },
    { id: 'ear', kind: 'loop', of: 'cup', at: 'right', h: 4 / 5 },
    { id: 'saucer', kind: 'cap', w: 1, face: 'down', join: 'cut' },
  ] },
  bar: { name: 'Bar', cls: 'square', spine: [
    { id: 'bowl', kind: 'vessel', w: 1, rimCut: 1 / 5, band: true },
    { id: 'stem', kind: 'post', join: 'into', show: 1 / 2, showOf: 'bowl' },
    { id: 'foot', kind: 'cap', w: 4 / 5, of: 'bowl', measure: 'ellipse', face: 'up', join: 'into' },
  ] },
  museum: { name: 'Museum', cls: 'square', spine: [
    { id: 'roof', kind: 'gable', of: 'beam', pitch: 1 / 3, ends: 4 / 5 },
    { id: 'beam', kind: 'slab', w: 1, join: 'cut' },
    { id: 'columns', kind: 'row', n: 4, h: 1 / 3, join: 'held' },
    { id: 'plinth', kind: 'slab', of: 'beam', join: 'held' },
  ] },
  nature: { name: 'Nature', cls: 'tall', spine: [
    { id: 'tiers', kind: 'tiers', w: 1, heights: [4.83, 3, 3.33], widths: [2.8, 4.1, 5.3], notch: 3 / 5 },
    { id: 'trunk', kind: 'post', join: 'into', show: 'stroke' },
  ] },
  restaurant: { name: 'Restaurant', cls: 'tall', spine: [
    { side: [
      [{ id: 'tines', kind: 'comb', n: 3, h: 1 / 4 }, { id: 'head', kind: 'head', join: 'into' }, { id: 'handle', kind: 'post', join: 'into' }],
      [{ id: 'blade', kind: 'blade' }, { id: 'grip', kind: 'post', join: 'into' }],
    ], join: 'cut' },
  ] },
  park: { name: 'Park', cls: 'wide', spine: [
    { id: 'back', kind: 'slab', w: 1 },
    { id: 'rails', kind: 'row', n: 2, h: 1 / 6, join: 'held' },
    { id: 'seat', kind: 'slab', of: 'back', join: 'held' },
    { id: 'legs', kind: 'row', n: 2, h: 1 / 4, join: 'held' },
  ] },
  landmark: { name: 'Landmark', cls: 'square', spine: [
    { id: 'loops', kind: 'knot', w: 1, square: 1 / 3, loop: 'square' },
  ] },
  attraction: { name: 'Attraction', cls: 'square', spine: [
    { id: 'rim', kind: 'ring', w: 1 },
    { id: 'spokes', kind: 'spokes', of: 'rim', n: 3, turn: 30 },
    { id: 'legs', kind: 'splay', of: 'rim', lean: 30, past: 1 / 6 },
  ] },
  venue: { name: 'Venue', cls: 'square', spine: [
    { id: 'rail', kind: 'slab', w: 1 },
    { id: 'drapes', kind: 'drape', tie: 3 / 5, join: 'cut' },
  ] },
  hotel: { name: 'Hotel', cls: 'wide', spine: [
    { id: 'pillow', kind: 'block', w: 1 / 3, of: 'mattress', at: 'left', deep: 1 / 2 },
    { id: 'mattress', kind: 'slab', w: 1, lines: 2, join: 'cut' },
    { id: 'foot', kind: 'post', of: 'mattress', at: 'right', h: 1 / 5, join: 'into' },
    { id: 'head', kind: 'post', of: 'mattress', at: 'left', rise: true, join: 'into' },
  ] },
  shopping: { name: 'Shopping', cls: 'tall', spine: [
    { id: 'body', kind: 'block', w: 1, deep: 1 },
    { id: 'handle', kind: 'loop', of: 'body', at: 'top', span: 2 / 3, rise: 0, into: 1 / 4 },
  ] },
  neighbourhood: { name: 'Neighbourhood', shape: true, cls: 'diamond', spine: [
    { id: 'blocks', kind: 'blocks', w: 1, cols: 3, rows: 3, turn: 45 },
  ] },
  street: { name: 'Street', shape: true, cls: 'diamond', spine: [
    { id: 'head', kind: 'disc', w: 1 / 4 },
    { id: 'body', kind: 'post', lean: 12, show: 1 / 3, join: 'cut' },
    { id: 'legs', kind: 'splay', of: 'body', from: 1, lean: 25, to: 'bottom' },
  ] },
  star: { name: 'Star', cls: 'outline', spine: [{ id: 'star', kind: 'star', points: 5, ri: 0.47 }] },
  plus: { name: '+', cls: 'open', spine: [{ id: 'arms', kind: 'cross' }] },
};
const ORDER = ['cafe', 'bar', 'museum', 'nature', 'restaurant', 'park', 'landmark', 'attraction', 'venue', 'hotel', 'shopping', 'neighbourhood', 'street', 'star', 'plus'];
const NEW = ['landmark', 'attraction', 'venue', 'hotel', 'shopping', 'neighbourhood', 'street'];   // 10-30: one shot from the system

// a declaration in words, written from its data (so the words can't drift from what builds)
const FR = v => { const T = [[1 / 6, '1/6'], [1 / 5, '1/5'], [1 / 4, '1/4'], [1 / 3, '1/3'], [2 / 5, '2/5'], [1 / 2, '1/2'], [3 / 5, '3/5'], [2 / 3, '2/3'], [3 / 4, '3/4'], [4 / 5, '4/5'], [5 / 9, '5/9'], [5 / 6, '5/6'], [1, 'all']]; const m = T.find(([x]) => Math.abs(v - x) < 1e-6); return m ? m[1] : String(+v.toFixed(2)); };
function say(r) {
  if (r.side) return r.side.map(sp => sp.map(say).join(', ')).join(' | cut | ');
  const wt = (r.w == null || r.w === 1) ? (r.of ? `as wide as the ${r.of}` : 'the box\'s full width') : `${FR(r.w)} of the ${r.of || 'box'}`, J = { cut: 'rests on the part above, a cut apart: ', into: 'into the part above: ', held: 'held under the part above (chamfer): ' }[r.join] || '';
  const K = {
    vessel: () => `${r.id}: a vessel ${wt}${r.w != null && r.w !== 1 ? ' wide' : ''}, ${r.deep != null ? `as deep as ${r.deep === 1 ? 'it is wide' : FR(r.deep) + ' of its width'}` : `its rim cutting the ellipse ${FR(r.rimCut)} above its centre`}${r.band ? ', a band under the rim' : ''}`,
    loop: () => r.at === 'top' ? `${r.id}: a loop on the ${r.of}'s top, ${FR(r.span)} of its width, its back a half circle${r.rise ? ` on legs ${FR(r.rise)} of a line tall` : ' on the face'}${r.into ? `, showing through it as slots ${FR(r.into)} of its depth` : ''}` : `${r.id}: a loop on the ${r.of}'s ${r.at} wall, ${FR(r.h)} of its depth`,
    cap: () => `${r.id}: a cap ${wt}${r.measure === 'ellipse' ? ' (its ellipse)' : ''}, curve ${r.face === 'up' ? 'on top' : 'underneath'}`,
    slab: () => `${r.id}: a slab ${wt}${r.lines > 1 ? `, ${r.lines} lines thick` : ''}`,
    block: () => `${r.id}: a block ${wt}${r.w != null && r.w !== 1 ? ' wide' : ''}, ${(r.deep ?? 1) === 1 ? "as deep as it is wide" : `as deep as ${FR(r.deep)} of its width`}${r.at ? `, at the ${r.of}'s ${r.at} end` : ''}`,
    ring: () => `${r.id}: a ring ${wt}`,
    disc: () => `${r.id}: a disc ${wt}`,
    spokes: () => `${r.id}: ${r.n} posts crossed through the ${r.of}'s centre, wall to wall${r.turn ? `, turned ${r.turn} degrees` : ''}`,
    splay: () => `${r.id}: two posts from the ${r.of}'s ${r.from == null ? 'centre' : r.from === 1 ? 'foot' : FR(r.from) + ' down'}, ${r.lean} degrees off upright each way, ${r.to === 'bottom' ? 'to the bottom' : r.past != null ? `${FR(r.past)} of its height past it` : `${FR(r.reach)} of the height long`}`,
    knot: () => `${r.id}: a square ${FR(r.square)} of the span, each side running on into a ${r.loop === 'square' ? 'square ' : ''}loop round its corner`,
    drape: () => `${r.id}: two drapes a cut apart, each a quarter ellipse to ${FR(r.tie)} of the height, then a post to the bottom`,
    blocks: () => `${r.id}: ${r.cols} by ${r.rows} blocks a cut apart${r.turn ? `, turned ${r.turn} degrees` : ''}`,
    gable: () => `${r.id}: a gable over the ${r.of}, pitch ${FR(r.pitch)}, ends ${FR(r.ends)} of a line`,
    row: () => `${r.id}: a row of ${r.n} posts, ${FR(r.h)} of the row's span tall`,
    tiers: () => `${r.id}: ${r.heights.length} gables stacked, the bottom ${wt}, heights ${r.heights.join(' : ')}, widths ${r.widths.join(' : ')}, notched ${FR(r.notch)}`,
    post: () => r.at ? `${r.id}: a post at the ${r.of}'s ${r.at} end${r.rise ? ', a line over the top' : ''}, ${r.h != null ? `${FR(r.h)} of its width below it` : 'to the bottom'}` : r.lean != null ? `${r.id}: a post leaning ${r.lean} degrees, ${FR(r.show)} of the height` : `${r.id}: a post${r.show === 'stroke' ? ' showing a stroke' : r.show != null ? ` showing ${FR(r.show)} of the ${r.showOf}'s depth` : ' to the bottom'}`,
    comb: () => `${r.id}: a comb of ${r.n}, ${FR(r.h)} of the height`,
    head: () => `${r.id}: a half ellipse under it`,
    blade: () => `${r.id}: a blade (a quarter ellipse) past its handle`,
    star: () => `${r.id}: a star of ${r.points} points (inner radius ${r.ri}), its counter the star moved in`,
    cross: () => `${r.id}: two equal posts crossed`,
  };
  return J + K[r.kind]();
}
const words = decl => decl.spine.map(say).join('; ');

// ---------------------------------------------------------------------------------------------------------------------------
// THE BUILD (one size per process)
let paperOK = null;
// the icon's v264 size, the box it never grows past, as the grid lands it at this size (v264's edges were never on the grid:
// each goes to its nearest iPhone pixel, as any drawing's would), in frame units
function v264Box(id, size) {
  const f = path.join(OUT, 'v264', `${id}.svg`); if (!fs.existsSync(f)) return null;
  const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js')); if (!paperOK) { paper.setup(new paper.Size(100, 100)); paperOK = 1; }
  const it = new paper.CompoundPath(fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1]), b = it.bounds; it.remove();
  const q = 3 * SIZES[size].k, lo = v => Math.round(v * q - 1e-6) / q, hi = v => Math.round(v * q + 1e-6) / q;   // a tie goes outward
  const x0 = lo(b.x), x1 = hi(b.x + b.width), y0 = lo(b.y), y1 = hi(b.y + b.height);
  return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0 };
}
function build(size, ids) {
  const Z = SIZES[size], Mk = require('./system-make.js'), SL = require('./system-land.js'), OS = require('./one-side.js');
  for (const id of ids) {
    const decl = DECL[id], line = MARK[decl.cls], t0 = Date.now();
    if (line && size !== 18) continue;   // a line mark is one drawing, at its app size
    let d, sym, meta;
    if (line) {
      const R = Mk.mark(decl, { land: line }), L = OS.land(R.d, { size: line.frame, sym: R.sym, std: line.std });
      d = L.d; sym = R.sym; meta = { ...R.meta, frame: line.frame, landing: 'outline' }; var drawn = R.d;
    } else {
      // the master's proportions (the 18 as built), for What carries the read
      const mf = path.join(OUT, '18', `${id}.json`), master = size !== 18 && fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')).meta.read || null : null;
      if (size !== 18 && !fs.existsSync(mf)) console.error(`${id}: build the 18 first (the master's proportions)`);
      const R = Mk.make(decl, { ...Z, master, drift: READ_DRIFT }, module.exports, { v264: v264Box(id, size), land: (prims, s_) => SL.landPrims(prims, s_, { size: Z.frame, std: { stroke: null, counter: 0 } }) });
      d = R.d; sym = R.sym; meta = { ...R.meta, landing: 'roots' }; drawn = R.d;
      if (Z.close) { const c = SL.closeSmall(d, Z.counter / Z.k); d = c.d; meta.closed = c.closed; meta.landing = 'roots; small counters closed'; }
    }
    const B = { size, d, drawn, sym, meta, s: (Date.now() - t0) / 1000 };
    write(size, id, B);
    console.log(size, id, `${B.s.toFixed(0)}s`, JSON.stringify(meta));
  }
}
function write(size, id, B) {
  const dir = path.join(OUT, String(size)), V = process.env.VARIANT || '', f = (B.meta && B.meta.frame) || SIZES[size].frame;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}${V}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${f}" height="${f}"><path fill-rule="evenodd" d="${B.d}"/></svg>\n`);
  fs.writeFileSync(path.join(dir, `${id}${V}.json`), JSON.stringify(B));
}

module.exports = { SETTINGS, SIZES, DECL, ORDER, NEW, RING, MARK, IPX, row, comb, words, say, OUT, v264Box };
if (require.main === module) {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === 'build') build(+a, b ? b.split(',') : ORDER);
  else if (cmd === 'check') process.exitCode = require('./system-check.js').run() ? 0 : 1;
  else if (cmd === 'spec') require('./system-spec.js').write();
  else console.log('node system.js build <18|24|12> [ids] | check | spec');
}
