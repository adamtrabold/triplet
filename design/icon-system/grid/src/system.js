// THE SYSTEM. The one place every decision lives: the decision points (SETTINGS), the sizes, the general rules, each icon's
// declaration, the build, the checks. THE-SYSTEM.md and the board are written from this file, so they can't drift from it.
//
// The geometry kernel is the working system that drew v264, unchanged (system-v264.js proves it regenerates v264 exactly):
// engine.js (union and cuts, the corner law, continuous-curvature fairing, tip landing, flares, mirror), picks7.js + proportions.js
// (roots and proportions), laws7.js (the round table), joins.js (the capital), construction.js (class fit, centring), mix-curves.js
// (roots by kind). This file only sets that kernel from the decision points and adds the rules decided since.
//
//   node system.js build <18|24|12> [ids]   one size per process (the kernel reads its thicknesses when it loads)
//   node system.js check                     every automatic check on every built size; exit 1 on any failure
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
    ['Rules, not drawings', 'Every decision changes the system; icons change only because the system did. No geometry outside an icon\'s declaration; no hand-placed points.', '10-27'],
    ['Flexible, not specific', 'Rules are general: no rule names one icon. An icon is a short declaration of its roots, how they relate, joined or cut; the system supplies the rest.', '10-26'],
    ['The grid is the brand', 'The grid and the drawing method are specific to Triplet; how other systems size icons does not apply.', '10-20'],
  ] },
  { g: 'Sizes and the grid', items: [
    ['Master size', '18, drawn 1:1 in the 24px ring (the glyph about 10-11px across). 24 and 12 are their own variants with detail adjusted for the size, never a scaled copy.', '10-27'],
    ['Where each size ships', '18 in the 24 ring on pins and list rows; 24 in the 32 ring on the selected pin; 12 bare on filter chips.', '10-27'],
    ['The grid', 'One iPhone pixel, 1/3px. The system writes each size for the iPhone directly; there is no refit pass for any device.', '10-27'],
    ['Snap priority', 'Silhouette first: an outer edge goes to a whole px when one is within 1/4px, else the nearest iPhone pixel. Then the outer side of each stroke (its width kept). Inner edges, counters, curves, diagonals, points and rounds stay as drawn. Landing never costs curvature: the roots land on the grid before any corner is rounded, so every round and join is built on landed roots; a curved root is never stretched, only scaled evenly to the size the grid gives its straight sides.', '10-27'],
    ['Centring', 'A centred part is exactly centred: an even count of iPhone pixels about the icon\'s centre. Vertical centring is optical, per icon.', '10-27'],
    ['Sharpness', 'As sharp as possible: core dimensions and core line landings are never fuzzy.', '10-26'],
    ['Scale and weight', 'Settled once for the set at the grid level: every icon the same optical size and weight; never negotiated icon by icon.', '10-20'],
    ['The box', 'An icon is fitted to its class box (wide, square, tall) and never grows past its v264 size: each outer edge at most one iPhone pixel further out; a rule that needs room takes it from the icon\'s own proportions.', '10-27'],
  ] },
  { g: 'Weight', items: [
    ['Stroke', 'A stroke is 1 1/2px at 18 (2 at 24, 1 at 12). Monoweight: an inner edge follows its outer edge.', '10-26'],
    ['Stroke at 18 on the grid', '1 1/2px, its outer side on the grid and its inner side half an iPhone pixel soft (1 1/3 was sharper both sides but read lighter than the set\'s weight).', '10-27', 'designer'],
    ['Parts that are not strokes', 'Sized by eye to read at the stroke\'s weight; never under 1 1/4 at 18 (smaller sizes set their own minimum). Posts, columns, stems, trunks and tines: 1 1/3 at 18, 1 2/3 at 24, 1 at 12 (whole iPhone pixels).', '10-27'],
    ['Solids are shapes', 'A solid part (slab, cap, mass) is a shape, not a line: it reads by its shape, and a thin slab is never thinner at its ends than its middle.', '10-26'],
    ['Same role, same width', 'Parts with the same role share one width. A comb (parts with slots cut between them) is one role: parts and slots one width, the size\'s part width if it fits its root, else the narrowest the size allows, else one part fewer.', '10-27'],
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
    ['Rows', 'A row of repeated parts reads as its count of distinct parts. Its parts at the part width; its gaps equal, at least the counter minimum, on the grid when the row then still fits its root\'s span, else filling the span exactly (how it looks wins); where the count can\'t meet that, one part fewer (never below two).', '10-27'],
    ['Protrusions', 'A feature that has to read by sticking out (an edge, a step, a lip) clears a minimum visible protrusion: one whole pixel past what it sticks out from at 18 (1 1/3 at 24, 1 at 12), after the join\'s round.', '10-27'],
    ['No narrow passages', 'No passage that vanishes at small sizes.', '10-19'],
    ['Handles', 'A handle takes its rule from the root shape it is (a cup\'s ear is a loop around its counter).', '10-26'],
    ['When rules meet', 'Continuous curvature first, then minimum widths, then same-role widths, then protrusions, then the grid, then the box (which may give way by up to one part).', '10-27', 'designer'],
  ] },
  { g: 'Tooling and curvature', items: [
    ['Machined', 'Every round and join is what a cutting tool would leave, by how the part would really be machined smooth.', '10-26'],
    ['Chamfer under an overhang', 'A post under a slab that runs past it meets it with a bevel (a chamfer, its edges broken); the bevel holds at every size.', '10-26'],
    ['Fillet into a face', 'A post into a face (curved or flat) meets it with a fillet: a flare, never an ink trap.', '10-26'],
    ['Tips', 'A point sharper than 75 degrees is broken, not milled; its round scales with its edge.', '10-21'],
    ['Every meeting rounded', 'Every meeting point is at least slightly round, some more; the radius varies with how the angle meets. One join pattern per corner type across all icons.', '10-22'],
    ['Inner corners', 'Tight inner corners are rounded less than outer corners; inner joins are never over-rounded.', '10-21'],
    ['Whole curves', 'A curved edge is drawn whole from one circle or ellipse, never one arc per point.', '10-23'],
    ['Continuous curvature', 'Joins are smooth and architectural: curvature is continuous through a join, with no humps or wobbles at the join or on the line leaving it.', '10-23'],
    ['Counters follow', 'A counter\'s curve follows the outside curve it sits in.', '10-22'],
    ['Humanist line', 'Loosened, humanist curves; restrained flares; every joint and flare architecturally sound.', '10-21'],
    ['The cutter rack', 'open', '10-26', null, ['Build three cutters (1/8, 1/4, 1/2px) into the corner law (rounds move at most 0.04px)', 'Keep today\'s round table']],
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
    ['Shopping', 'open', '10-26', null, ['None of the proposed icons work; the bag may be one step too common']],
    ['Museum at 18', 'Four columns, three counters, by the row rule; at 12 three columns (detail removed). Three columns at 18 read as two windows in a bank.', '10-27', 'designer'],
  ] },
];

// ---------------------------------------------------------------------------------------------------------------------------
// THE SIZES. k: how the size's px relate to the master's (the kernel draws in the 24 frame; a size shows that frame at 24 k px).
// Widths are px AT THAT SIZE (whole iPhone pixels where the grid allows), so in the kernel's frame units they are px / k.
const SIZES = {
  18: { k: 1, frame: 24, stroke: 1.5, part: 4 / 3, min: 1.25, gap: 1, band: 1, counter: 1, protrude: 1, close: false },
  24: { k: 4 / 3, frame: 32, stroke: 2, part: 5 / 3, min: 5 / 3, gap: 4 / 3, band: 4 / 3, counter: 4 / 3, protrude: 4 / 3, close: false },
  12: { k: 2 / 3, frame: 16, stroke: 1, part: 1, min: 1, gap: 1, band: 1, counter: 1, protrude: 1, close: true },
};
const IPX = 1 / 3, toIpx = v => Math.round(v / IPX);
const RING = { 18: 4 / 3, 24: 5 / 3 };   // the ring's width in px: the 24 ring (around the 18) and the 32 ring (around the 24)

// ---------------------------------------------------------------------------------------------------------------------------
// THE GENERAL RULES (each names no icon)
// A ROW: n parts of one width and the gaps between them, across the span its root sets. In order of preference:
//   1. parts at the size's part width, gaps equal on the iPhone grid (at least the counter minimum), the row centred on a whole
//      px, each end within one iPhone pixel of the root's (the box);
//   2. the same parts with equal gaps that fill the root's span exactly, off the grid if they must (how it looks wins);
//   3. one part fewer (never below two).
// A part that can't sit centred on the grid takes one more iPhone pixel (all of them: one role).
function row({ span, w, n, min, grid }) {
  for (let m = n; m >= 2; m--) {
    for (const wv of [w, w + grid]) {
      const raw = (span - m * wv) / (m - 1);
      for (let j = Math.ceil((min - 1e-9) / grid); j * grid <= raw + grid + 1e-9; j++) {
        const g = j * grid, tot = m * wv + (m - 1) * g, q = tot / (2 * grid);
        if (Math.abs(q - Math.round(q)) < 1e-6 && Math.abs(tot - span) <= 2 * grid + 1e-9) return { n: m, w: wv, gap: g, span: tot, grid: true };
      }
    }
    const g = (span - m * w) / (m - 1);
    if (g >= min - 1e-9) return { n: m, w, gap: g, span, grid: false };
  }
  return { n: 2, w, gap: span - 2 * w, span, grid: false };
}
// A COMB: parts and the slots cut between them are one role, so one width. The size's part width if the comb fits its root's span
// (each end within one iPhone pixel); else the narrowest width the size allows, if that fits; else one part fewer (never below two).
function comb({ n, w, wMin, span, grid }) {
  for (let m = n; m >= 2; m--) {
    const k = 2 * m - 1;
    if (k * w <= span + 2 * grid + 1e-9) return { n: m, w, slot: w, span: k * w };
    const wf = Math.max(wMin, span / k);
    if (k * wf <= span + 2 * grid + 1e-9) return { n: m, w: wf, slot: wf, span: k * wf };
  }
  return { n: 2, w: wMin, slot: wMin, span: 3 * wMin };
}
// a protrusion: past what it sticks out from by the size's minimum
const protrusion = (base, Z) => base + Z.protrude;

// ---------------------------------------------------------------------------------------------------------------------------
// THE DECLARATIONS. roots, how they relate, joined or cut; the kernel's root call and the rules it takes. Nothing else.
const DECL = {
  cafe: { cls: 'wide', roots: 'vessel (the cup, as deep as wide) + loop (the ear, 4/5 of the depth) | rests on | cap (the saucer, 1 4/5 of the cup)', joins: 'cup into ear: one tangent curve; cup on saucer: cut', kernel: 'cafe' },
  bar: { cls: 'square', roots: 'vessel (the bowl, an ellipse 4/5 as tall as wide, cut 1/5 above its centre) + post (the stem, half the bowl\'s depth) + cap (the foot, 4/5 of the bowl) - band (inner band under the rim)', joins: 'stem into bowl and foot: fillets', kernel: 'bar' },
  museum: { cls: 'wide', roots: 'gable (pitch 1/3) | rests on | slab (the beam) + row of posts (the columns, 1/3 of the colonnade tall) + slab (the plinth)', joins: 'columns under the overhanging beam and plinth: chamfers (the capital); gable on beam: cut', kernel: 'museum', rows: { posts: 4 } },
  nature: { cls: 'tall', roots: 'three gables stacked (the tiers, notched 3/5 of the tier above) + post (the trunk)', joins: 'tiers into each other: notches; trunk into the bottom tier: fillet; tips broken', kernel: 'nature' },
  restaurant: { cls: 'tall', roots: 'comb of 3 posts (the tines) into a cap (the head, a half ellipse) + post (the handle) | cut | edge (the blade, a quarter ellipse) + post (the knife\'s handle)', joins: 'tines into head and head into handle: fillets; blade into handle: fillet', kernel: 'restaurant', rows: { tines: 3 }, protrudes: ['blade'] },
  star: { cls: 'line mark', roots: 'star (five points, inner radius 0.47) - star (the counter, the same star smaller)', joins: 'tips broken; valleys rounded wide', kernel: 'star' },
  plus: { cls: 'line mark', roots: 'two posts crossed (the arms, equal)', joins: 'the crossing: a small round', kernel: 'plus' },
};
const ORDER = ['cafe', 'bar', 'museum', 'nature', 'restaurant', 'star', 'plus'];

// ---------------------------------------------------------------------------------------------------------------------------
// THE BUILD (one size per process)
function setKernel(size) {
  const Z = SIZES[size], k = Z.k, line = 1.5;
  const { PROP } = require('./proportions.js');
  PROP.line.post = Z.part / k / line;   // posts, columns, stems, trunks: the size's part width
  PROP.line.band = Z.band / k / line;   // an inner band: the size's band (no thicker than the stroke)
  PROP.line.cut = Z.gap / k / line;     // a cut between resting parts: the size's gap
  return { Z, PROP };
}
function restaurantDecl(Z) {
  const E = require('./engine.js'), M = require('./mix-curves.js'), u = 1 / Z.k, K = 0.5523;
  const top = 6.5, bot = 17.5, w = Z.part * u, cutW = Z.gap * u;
  // the comb across the head's root span (the head is three lines and two half-line slots wide), the blade past its handle
  const C = comb({ n: DECL.restaurant.rows.tines, w, wMin: Z.min * u, span: 3 * 1.5 + 2 * 0.75, grid: IPX * u }), fw = C.span, kw = protrusion(w, { protrude: Z.protrude * u });
  const x0 = 12 - (fw + cutW + kw) / 2, fcx = x0 + fw / 2, hc = top + 3.0, roots = [];
  for (let i = 0; i < C.n; i++) roots.push(M.ink('post', E.R(x0 + i * 2 * C.w, top, C.w, hc - 0.1 - top)));
  // a line running into an ellipse at its widest point: the ellipse's bend there (rx / ry^2) stays under the fair limit (0.35), so
  // the join reads as one line; 1.05 as tall as wide where that already holds
  { const rx = fw / 2, ry = Math.max(1.05 * rx, Math.sqrt(rx / 0.33)); roots.push(M.ink('mass', E.D(`M${fcx - rx} ${hc - 0.3}V${hc}C${fcx - rx} ${hc + ry * K} ${fcx - rx * K} ${hc + ry} ${fcx} ${hc + ry}C${fcx + rx * K} ${hc + ry} ${fcx + rx} ${hc + ry * K} ${fcx + rx} ${hc}V${hc - 0.3}Z`))); }
  { const hb = hc + Math.max(1.05 * fw / 2, Math.sqrt(fw / 2 / 0.33)) - 0.4; roots.push(M.ink('post', E.R(fcx - w / 2, hb, w, bot - hb))); }
  const ks = x0 + fw + cutW, ke = top + 6, ry = ke - top;
  roots.push(M.ink('mass', E.D(`M${ks} ${top}C${ks + kw * K} ${top} ${ks + kw} ${ke - ry * K} ${ks + kw} ${ke}H${ks}Z`)));
  roots.push(M.ink('post', E.R(ks, ke - 0.2, w, bot - ke + 0.2)));
  return { icon: { roots, cuts: [] }, meta: { tines: C.n, tine: C.w * Z.k, slot: C.slot * Z.k, blade: kw * Z.k, protrude: (kw - w) * Z.k, x0, fw, ks, kw } };
}
function build(size, ids) {
  const { Z } = setKernel(size), u = 1 / Z.k;
  const all = {};
  const SL = require('./system-land.js');
  global.SYSTEM_PRIMS = (prims, sym) => { const out = SL.landPrims(prims, sym, { size: Z.frame, std: { stroke: null, counter: 0 } }); if (process.env.DUMP) fs.writeFileSync(process.env.DUMP, JSON.stringify({ prims: require('./engine.js').parts(prims), out })); return out; };
  for (const id of ids) {
    const t0 = Date.now(); let d, sym = 12, meta = {};
    if (id === 'restaurant') {
      const M = require('./mix-curves.js'), R = restaurantDecl(Z);
      M.ICONS.__sys = () => R.icon; d = M.buildIcon('__sys').d; sym = null; meta = R.meta;
    } else if (id === 'star' || id === 'plus') {
      d = require('./construction.js').mark(id).d;
    } else {
      if (id === 'museum') {
        // the row rule on the colonnade, live inside the kernel's layout: the span its beam sets, posts at the part width
        meta = {};
        global.SYSTEM_O = { cols: (span, w, over) => { const R = row({ span, w, n: DECL.museum.rows.posts, min: Z.counter * u, grid: IPX * u });
          const n = process.env.ROW_N ? +process.env.ROW_N : R.n, Q0 = n === R.n ? R : row({ span, w, n, min: Z.counter * u, grid: IPX * u });
          // the overhang past the outer column is a protrusion: on the grid it rounds up, never down (rounded down it reads as a knee)
          const Q = { ...Q0, over: Math.ceil(over / (IPX * u) - 1e-6) * IPX * u };
          Object.assign(meta, { cols: Q.n, onGrid: Q.grid, overPx: +(Q.over * Z.k).toFixed(3), ruleCols: R.n, gapPx: +(Q.gap * Z.k).toFixed(3), spanPx: +(Q.span * Z.k).toFixed(3), rootSpanPx: +(span * Z.k).toFixed(3) }); return Q; } };
      }
      const C = require('./construction.js');
      // a row sets its width in px, so the class fit would rescale everything else to chase it: a row icon keeps the size the
      // system fits it to with the row as its root drew it (the first, plain build), and only the row changes
      if (id === 'museum') { const keep = global.SYSTEM_O; global.SYSTEM_O = {}; const f = C.shaped(id); global.SYSTEM_O = keep; d = C.shaped(id, { fit: { s: f.s, classFrom: f.classFrom } }).d; }
      else d = C.shaped(id).d;
      global.SYSTEM_O = {};
      if (id === 'cafe') sym = null;
    }
    // widths are the size's own (set in the kernel above), so the landing keeps every width and only places edges
    const L = landAt(size, id, d, sym, meta);
    all[id] = { size, d: L.d, drawn: d, sym, meta, maxMove: L.maxMove, opened: L.opened, s: (Date.now() - t0) / 1000 };
    write(size, id, all[id]);
    console.log(size, id, `${all[id].s.toFixed(0)}s`, JSON.stringify(meta));
  }
}
function landAt(size, id, d, sym, meta) {
  const Z = SIZES[size], OS = require('./one-side.js');
    // line marks are one drawing each, landed at their own app size: the star in the row's 18px box, the + at 14px across (28 frame)
    const MARK = { star: { frame: 18, std: { stroke: 4, centred: 4, counter: 3 } }, plus: { frame: 28, std: { stroke: 6, centred: 6, counter: 3 } } };
    // shaped icons: the roots were landed before the corner law (system-land.js landPrims), so the outline is final; at 12 a
    // counter under the minimum closes. Line marks: one drawing each, landed at their own app size.
    const L = MARK[id] ? require('./one-side.js').land(d, { size: MARK[id].frame, sym, std: MARK[id].std }) : { d, maxMove: 0, opened: [] };
    if (Z.close && !MARK[id]) { const c = require('./system-land.js').closeSmall(d, Z.counter / Z.k); L.d = c.d; L.opened = c.closed; }
    L.how = MARK[id] ? 'outline' : Z.close ? 'roots; small counters closed' : 'roots';
    if (MARK[id]) meta.frame = MARK[id].frame;
    meta.landing = L.how;
  return L;
}
function write(size, id, B) {
  const dir = path.join(OUT, String(size)), V = process.env.VARIANT || '', f = (B.meta && B.meta.frame) || SIZES[size].frame;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}${V}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${f}" height="${f}"><path fill-rule="evenodd" d="${B.d}"/></svg>\n`);
  fs.writeFileSync(path.join(dir, `${id}${V}.json`), JSON.stringify(B));
}
// re-land what the kernel drew (no rebuild): when only a landing setting changed
function reland(size, ids) {
  for (const id of ids) { const f = path.join(OUT, String(size), `${id}${process.env.VARIANT || ''}.json`); if (!fs.existsSync(f)) continue;
    const B = JSON.parse(fs.readFileSync(f, 'utf8')), L = landAt(size, id, B.drawn, B.sym, B.meta); write(size, id, { ...B, d: L.d, maxMove: L.maxMove, opened: L.opened }); console.log('landed', size, id); }
}

module.exports = { SETTINGS, SIZES, DECL, ORDER, RING, row, comb, protrusion, OUT };
if (require.main === module) {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === 'build') build(+a, b ? b.split(',') : ORDER);
  else if (cmd === 'land') reland(+a, b ? b.split(',') : ORDER);
  else if (cmd === 'check') process.exitCode = require('./system-check.js').run() ? 0 : 1;
  else if (cmd === 'spec') require('./system-spec.js').write();
  else console.log('node system.js build <18|24|12> [ids] | check | spec');
}
