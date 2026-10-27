// THE GRID (10-27). One pixel grid, explicit, that every icon is drawn on, and the rules that put each kind of part on it.
// The spec in words is grid/THE-GRID.md; this file is its one source of truth in code. Owner, verbatim:
//   "Why is there no grid!!! This whole fucking exercise has been about creating a system and grid!! For days!"
//   "We talked about doing the counters 1 or 2 px I am so tired of this back and forth. I need a grid and visual system that
//    creates coherent icons based on our rules"
//   "I want them to be as sharp as possible and strokes to be 1.5px. If it's not a strike it doesn't have to be 1.5px! Just has
//    to read the right weight"   ("strike" = stroke)
//
// THE GRID: 1px cells (a whole CSS px is the only position sharp at 2x AND 3x), a 24 x 24 frame, the centre on the line x = 12,
// y = 12 (a grid line, not a cell, so a centred part is even px wide). Two kinds of ink:
//   SHAPES (every solid part of a badge icon: slab, post, column, stem, trunk, wall, loop, body): every edge on a grid line.
//          The least thickness is 2 (SOLID): the first whole px not thinner than the 1 1/2 stroke ("nothing should go that thin").
//   STROKES (line marks only: the +, the star's outline): 1 1/2px, one edge on a grid line and the other on the half line
//          (sharp at 2x; at 3x the half edge is soft by half a device px: the price of 1 1/2, his to keep).
// Spaces: a GAP between two parts is 1; a COUNTER inside one part is what its root's proportion leaves, whole, 1 or 2.
// Sizes: each icon fits its CLASS BOX (whole px, from the approved six); a point (an apex, a tip) may pass it by 1/2.
//
//   node src/the-grid.js [names]   -> svg/the-grid/<name>.svg, svg/the-grid/build.json   (about 1 min an icon, the star ~8)
'use strict';
const fs = require('fs'), path = require('path');
process.env.TOOLS = process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/tools';
const E = require('./engine.js');
const { ELL_ARC, CAP } = require('./picks7.js');
const { heldSlab } = require('./joins.js');
const { PROP } = require('./proportions.js');
const { measure } = require('./optics.js');

// ---- THE GRID, as numbers. Every other number in an icon is a whole multiple of UNIT or one of these.
const GRID = {
  unit: 1,            // one cell = one CSS px: whole px are the only positions sharp on the 5K (2x) and the iPhone (3x)
  box: 24,            // the frame; drawn and shown 1:1 (a 24 box shown at 18px puts nothing on the grid)
  centre: 12,         // the centre lines x = 12, y = 12 are grid LINES: a part centred on one is even px wide
  ring: 1.5, live: 16, coin: 12,   // the badge: ring a stroke, outer edge on the frame; live circle d16 (4..20); coin d12 (6..18)
  solid: 2,           // SOLID: every solid part's thickness (slab, post, column, stem, trunk, wall, loop): the first whole px >= 1 1/2
  gap: 1,             // GAP: the space between two parts (a cut, an opening between columns, the coupe's band): 1
  counter: [1, 2],    // COUNTER: a hole inside one part (the ear's): what the root's proportion leaves, whole, 1 or 2 across
  counterLong: 2,     // ... and at least 2 along it: a 1 x 1 hole reads as a dot, a 1 x 2 slot reads as a hole
  stroke: 1.5,        // STROKE: line marks only (the +, the star's outline): one edge on a line, the other on the half line
  over: 1,            // OVERHANG / PROTRUSION: anything that reads by sticking out does so by a whole px, at least 1
  bevel: 0.5,         // a capital's drop and its post's flare: one curve (no straight edge), so it needs no line
  apex: 0.5,          // a POINT (apex, tip) may pass its class box by 1/2: a point carries less ink than an edge
  classes: {          // the class boxes, whole px, from the approved six (w x h): the size limit of every icon in the class
    square: { w: 10, h: 10 },   // coupe 9.78 x 8.67, museum 9.78 x 9.62 (cut 9.78 square) -> 10: the nearest even (centred)
    wide: { w: 11, h: 9 },      // cup 10.77 x 8.50 (cut 11 x 8.56) -> 11 x 9 (asymmetric: any whole width)
    tall: { w: 8, h: 11 },      // tree 6.98 x 11.46 (cut 8.56 x 11 + apex 1/2) -> 8 x 11 + apex
    mark: { h: 12, span: 13.5 },// line marks, 1:1 in their slot: the star 12 tall (round 8: one star), the + 13 1/2 across (approved 13.2)
  },
  vessel: PROP.ellipse.vessel,  // every vessel's ellipse 4/5 as tall as wide (kept)
  capEnd: PROP.cap.end,         // a cap's ends at half its crown (kept): a 2px cap ends at 1px, all on lines
};
const S = GRID.solid, G = GRID.gap, C = GRID.centre;

// ---- THE RULES, as functions. An icon calls these; it never types a position.
const EPS = 1e-9;
const whole = v => Math.floor(v + 0.5 + EPS);                         // a proportion to the grid: nearest whole px
const even = v => 2 * Math.round(v / 2 - EPS);                         // a centred width: nearest even px (a tie goes down: the limit)
const onLine = v => Math.abs(v - Math.round(v)) < 1e-6;
const must = (ok, msg) => { if (!ok) throw new Error(`THE GRID: ${msg}`); };
// a part centred on the centre line: even px, so both edges land on lines
const centred = (w, c = C) => { must(onLine(w / 2), `a centred part must be even px (${w})`); return [c - w / 2, c + w / 2]; };
// a centred row of n equal parts: the part or the space on the centre line is even. 2px parts: an odd count takes 1px gaps
// (the middle PART sits on the centre), an even count takes 2px gaps (the middle GAP sits on it)
function row(n, part = S) { const gap = n % 2 ? G : 2, w = n * part + (n - 1) * gap, [x0] = centred(w); return { gap, w, xs: [...Array(n)].map((_, i) => x0 + i * (part + gap)) }; }
// a counter: what the root leaves once its walls are taken, whole, 1 or 2 (else the root's proportion is wrong for the grid)
function counter(outer, walls = 2 * S) { const c = outer - walls; must(c >= GRID.counter[0] && c <= GRID.counter[1] && onLine(c), `counter ${c} not 1 or 2`); return c; }
// a stack of heights must fit its class box; a point may pass by the apex
const fits = (h, cls, point = 0) => must(h <= GRID.classes[cls].h + Math.min(point, GRID.apex) + 1e-6, `height ${h} over the ${cls} box ${GRID.classes[cls].h}`);
// the cap rule: a slab cut by one ellipse, its ends at capEnd of its crown: the ellipse is 1/sqrt(1 - e^2) of the slab's width
const capOver = (h, end) => 1 / Math.sqrt(1 - (end / h) ** 2);

const K = 0.5523, f = v => +v.toFixed(4);
const ink = (kind, prim, t = kind === 'mass' ? 2 * GRID.stroke : S) => ({ kind, t, prim });   // a mass's corners round as before (t/5 of 3)
const arcD = (P, dx = 0) => `C${f(P[1][0] + dx)} ${f(P[1][1])} ${f(P[2][0] + dx)} ${f(P[2][1])} ${f(P[3][0] + dx)} ${f(P[3][1])}`;
const move = (icon, dx, dy) => { const prims = E.xform([...icon.roots.map(r => r.prim), ...icon.cuts], 1, 0, 0, dx, dy); icon.roots = icon.roots.map((r, i) => ({ ...r, prim: prims[i] })); icon.cuts = prims.slice(icon.roots.length); if (icon.sym != null) icon.sym += dx; return icon; };
// OPTICAL PLACEMENT, on the grid: an icon moves only by whole px. Up/down: to its optical centre (the box centre pulled half way
// toward the ink centre when the ink sits low; the engine's opticalY); left/right: a symmetric icon stays on the centre line, an
// asymmetric one goes to the whole px that puts its optical centre (box and ink centres averaged) nearest the centre line
function place(icon) {
  const m = measure(E.build([...icon.roots.map(r => r.prim), ...icon.cuts]).d), b = m.box;
  const oy = b.cy - 0.5 * Math.max(0, b.cy - m.cy), ox = (b.cx + m.cx) / 2;
  const dy = Math.round(C - oy), dx = icon.sym != null ? 0 : Math.round(C - ox);
  return move(icon, dx, dy);
}

// ---- THE SIX, from the grid. Every number below is a GRID value, a whole px, or a proportion taken to the grid by whole()/even().

// CAFÉ (wide): a cup (a body, square, its bottom one vessel ellipse) with an ear (a loop round its counter) on a saucer (a cap).
function cafe() {
  const cls = GRID.classes.wide;
  const saucerW = cls.w;                                   // the saucer is the widest root: the class width, 11
  const cupW = whole(saucerW / PROP.cup.saucer);           // the saucer is 9/5 of the cup: 6.11 -> 6
  const depth = cupW * PROP.cup.depth;                     // the cup is square: 6
  // the ear is 4/5 of the cup's depth (4.8 -> 5); its outside a half circle after the shortest straight run that puts its far
  // extreme on a line. Its counter is what the walls leave; if that counter is under 1 x 2 (it reads as a dot), the ear grows a px
  let earH = whole(PROP.cup.ear * depth), hole, R_, ri, run;
  for (;; earH++) {
    hole = counter(Math.min(earH, 2 * S + GRID.counter[1])); R_ = earH / 2; ri = hole / 2; run = Math.ceil(R_) - R_;
    if (earH - 2 * S === hole && Math.max(hole, run + ri) >= GRID.counterLong) break;   // 5: 1 x 1, a dot -> 6: 2 x 1
  }
  const H = depth + G + S; fits(H, 'wide');                // cup, the gap, the saucer's crown: 9
  const top = 0, l = 0, r = l + cupW, mid = (l + r) / 2, rx = cupW / 2, ry = GRID.vessel * rx, bot = top + depth, cy = bot - ry;
  const cup = ink('mass', E.D(`M${l} ${top}H${r}V${f(cy)}${arcD(ELL_ARC(mid, cy, rx, ry, 0, Math.PI / 2))}${arcD(ELL_ARC(mid, cy, rx, ry, Math.PI / 2, Math.PI))}Z`));
  const ex = r + run, eR = ex + R_, eb = top + earH, ecy = top + R_;
  const ear = ink('loop', E.D(`M${r - 1} ${top}H${ex}C${f(ex + R_ * K)} ${top} ${eR} ${f(ecy - R_ * K)} ${eR} ${ecy}C${eR} ${f(ecy + R_ * K)} ${f(ex + R_ * K)} ${eb} ${ex} ${eb}H${r - 1}Z`));
  const it = top + S, ib = eb - S;   // the counter: the ear's own shape made smaller (centre kept), its straight run into the cup's wall
  const cut = E.cut(E.D(`M${r - 0.01} ${it}H${ex}C${f(ex + ri * K)} ${it} ${ex + ri} ${f(ecy - ri * K)} ${ex + ri} ${ecy}C${ex + ri} ${f(ecy + ri * K)} ${f(ex + ri * K)} ${ib} ${ex} ${ib}H${r - 0.01}Z`));
  // PLACED BY WEIGHT (kept): the cup and ear sit with their ink centre over the saucer's centre, to the nearest whole px
  const mc = measure(E.build([cup.prim, ear.prim, cut]).d), sx = whole(mc.cx - saucerW / 2);
  const saucer = ink('slab', CAP(sx, sx + saucerW, bot + G, S, { root: 'ellipse', ry: 1, over: capOver(S, GRID.capEnd * S) }, false));
  return place({ roots: [cup, ear, saucer], cuts: [cut], meta: { cls: 'wide', w: saucerW, h: H, cupW, depth, earH, hole, gap: G, saucerCrown: S, saucerEnds: GRID.capEnd * S } });
}

// BAR: the coupe (square). One vessel ellipse (the widest root), the rim cutting it; under the rim the band (a gap: rim | drink);
// a stem (a post) and a foot (a cap).
function bar() {
  const cls = GRID.classes.square, rx = cls.w / 2, ry = GRID.vessel * rx;                   // 5 x 4: the ellipse's extremes on lines
  const rise = whole(PROP.coupe.rimCut * 2 * ry);           // the rim cuts the ellipse 1/5 of its height above its centre: 1.6 -> 2
  const depth = rise + ry;                                  // 6
  const drink = depth - S - G; must(drink >= 2.5, 'the drink is under the approved 2 1/2');   // rim 2, band 1: drink 3
  const footW = even(2 * rx * PROP.coupe.foot / capOver(S, GRID.capEnd * S));   // the foot's ellipse 4/5 of the bowl's: 6.93 -> 6
  const stem = cls.h - depth - S; must(stem >= S, 'the stem shows less than a solid');      // what the box leaves: 2
  const top = 0, cy = top + rise;
  const ang = y => Math.asin((y - cy) / ry), P_ = (a0, a1) => ELL_ARC(C, cy, rx, ry, a0, a1);
  const a0 = ang(top), mR = (a0 + Math.PI / 2) / 2, mL = Math.PI - mR, rimX = rx * Math.cos(a0);
  const bowl = ink('mass', E.D(`M${f(C - rimX)} ${top}H${f(C + rimX)}${arcD(P_(a0, mR))}${arcD(P_(mR, Math.PI / 2))}${arcD(P_(Math.PI / 2, mL))}${arcD(P_(mL, Math.PI - a0))}Z`));
  // the band: the bowl's own side between the band's lines, moved in by the wall (S): the counter follows the outside
  const bT = top + S, bB = bT + G, t0 = ang(bT), t1 = ang(bB), R0 = P_(t0, t1), Lp = ELL_ARC(C, cy, rx, ry, Math.PI - t1, Math.PI - t0);
  const band = E.cut(E.D(`M${f(R0[0][0] - S)} ${f(R0[0][1])}${arcD(R0, -S)}H${f(Lp[0][0] + S)}${arcD(Lp, S)}Z`));
  const bb = top + depth, ft = bb + stem, [s0] = centred(S), [f0, f1] = centred(footW);
  const post = ink('post', E.R(s0, bb - 0.5, S, ft - bb + 1));
  const foot = ink('slab', CAP(f0, f1, ft + S, S, { root: 'ellipse', ry: 1, over: capOver(S, GRID.capEnd * S) }, true));
  return place({ roots: [bowl, post, foot], cuts: [band], sym: C, meta: { cls: 'square', w: 2 * rx, h: depth + stem + S, bowl: [2 * rx, depth], rim: S, band: G, drink, stem, stemW: S, footW, footCrown: S } });
}

// MUSEUM (square): a gable resting on a beam (a gap between), three columns holding the beam, on a plinth. Beam and plinth pass
// the outer columns by OVER, with the capital (the slab's drop and the column's flare as one curve, the bevel).
function museum() {
  const cls = GRID.classes.square;
  const cols = row(3);                                       // three 2px columns, 1px openings: 8 wide, the middle column on 11..13
  const width = cols.w + 2 * GRID.over; must(width <= cls.w, `museum ${width} wider than its box`);   // + 1 each side: 10
  const colH = whole(PROP.museum.columns * cols.w);          // columns 1/3 of the colonnade: 2.67 -> 3
  const gEnd = whole(PROP.line.gableEnd * GRID.stroke);      // the gable's upright ends: 4/5 of a line, 1.2 -> 1
  const stack = S + colH + S + G + gEnd;                     // plinth, columns, beam, the gap, the ends: 9
  const pitch = PROP.museum.pitch * width / 2;               // the roof rises 1/3 of its run: 1.67 ...
  const rise = Math.min(pitch, cls.h + GRID.apex - stack);   // ... held by the box: the apex (a point) may pass it by 1/2: 1.5
  fits(stack + rise, 'square', rise);
  const [bL, bR] = centred(width), base = 0, plT = base - S, ct = plT - colH, bt = ct - S, gb = bt - G, ap = gb - gEnd - rise;
  const xa = cols.xs[0], xb = cols.xs[2] + S;
  const roots = [ink('slab', E.P([bL, gb], [bL, gb - gEnd], [C, ap], [bR, gb - gEnd], [bR, gb]))];
  const held = (yFar, yNear) => heldSlab({ x0: bL, x1: bR, yFar, yNear, left: { x: xa, w: S, over: GRID.over }, right: { x: xb, w: S, over: GRID.over }, dp: GRID.bevel, fr: GRID.bevel, k: PROP.joins.k });
  roots.push(ink('slab', held(bt, ct)), ink('slab', held(base, plT)));
  for (const x of cols.xs) roots.push(ink('post', E.R(x, ct - 0.01, S, colH + 0.02)));
  return place({ roots, cuts: [], sym: C, meta: { cls: 'square', w: width, h: stack + rise, body: stack + 1 - 1, cols: 3, colW: S, opening: cols.gap, colH, slabs: S, gap: G, gEnd, rise, over: GRID.over } });
}

// NATURE: the tree (tall). A FIXED POINT (owner: "the between tree is perfect"): its three tiers are the approved roots, untouched;
// the grid sets only the trunk (a post: SOLID, centred, 11..13) and the tree's place (whole px, so the trunk's foot is on a line).
function nature(o = {}) {
  const v = require('../svg/g7/construction.json').nature;
  // the trunk shows a whole length (approved 2.29 -> 2) from the bottom tier's underside, whose lowest point beside the trunk
  // (a curve's extreme) lands on a line: o.settle is how far that extreme sat off its line in the first build (build() settles it)
  const foot0 = 17.72836, foot = Math.round(foot0), dy = foot - foot0 + (o.settle || 0), trunkTop = 14.72836 + dy, [t0] = centred(S);
  // the tiers move as one drawing (the paths are relative after M)
  const shift = d => d.replace(/^M(-?[\d.]+),(-?[\d.]+)/, (q, x, y) => `M${x},${(+y + dy).toFixed(5)}`);
  const roots = v.parts.filter((d, i) => v.prims[i].root !== 'POST').map(d => ink('mass', E.D(shift(d)), 2 * GRID.stroke));
  roots.push(ink('post', E.R(t0, trunkTop, S, foot - trunkTop)));   // the trunk: SOLID, centred 11..13, its foot on a line
  return place({ roots, cuts: [], sym: C, meta: { cls: 'tall', trunk: S, fixed: 'tiers (approved)' } });
}

// ---- LINE MARKS (strokes, 1:1 in their slot; never in a ring)
const { fromTable } = require('./laws7.js');
const LINE_LAW = fromTable(PROP.rounds.line), SHAPED_LAW = fromTable(PROP.rounds.shaped), EASE = 2.3;
const JOIN10 = { ease: EASE, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth', tipKeep: 'crest', tipLand: true, tipPow: 1, tipSoft: PROP.transition.tipSoft, noReverse: true, maxPieces: 2, arcEase: true, arcRamp: 0.3, flareLean: PROP.transition.flareLean };
// THE +: two strokes. A 1 1/2 stroke centred on its own crossing has its centre on a QUARTER line (k + 1/4): then each edge is on a
// line or a half line (11 1/2 | 13). Its arms span 13 1/2 so their ends are a line and a half line too (5 1/2 | 19). The mark's frame
// is placed in its button so this centre is the button's centre (the button is a circle: ¼px of it shows nowhere)
function plus() {
  const c = C + 0.25, s = GRID.classes.mark.span, w = GRID.stroke, a = c - s / 2, b = c - w / 2;
  const d = E.build([E.R(b, a, w, s), E.R(a, b, s, w)], { law: LINE_LAW, ease: EASE, join: JOIN10 }).d;
  return { d, meta: { cls: 'mark', stroke: w, span: s, centre: [c, c], note: 'its frame centre (12¼, 12¼) is the button centre' } };
}
// THE STAR: the approved star (STAR.ri, its counter the star made smaller by the stroke), 12 tall, its top tip on a line
function star() { const r = require('./pixel-shapes.js').starMark({ h: GRID.classes.mark.h }); return { d: r.d, meta: { cls: 'mark', stroke: GRID.stroke, h: +r.h.toFixed(3), w: +r.w.toFixed(3) } }; }

const ICONS = { cafe, bar, museum, nature };
const MARKS = { plus, star };
function build(name) {
  if (MARKS[name]) return MARKS[name]();
  // the engine's own law, the one the approved six were built by (PROP.rounds.shaped, construction.js): rounds by the corner, not the icon
  const make = o => { const icon = ICONS[name](o), prims = [...icon.roots.map(r => r.prim), ...icon.cuts];
    return { d: E.build(prims, { law: SHAPED_LAW, tightHoles: true, ease: EASE, join: JOIN10, sym: icon.sym }).d, meta: icon.meta }; };
  let r = make({});
  if (name === 'nature') {   // the tiers are a fixed drawing, so where its curve's extreme lands is measured, then moved to the line below
    const { findEdges } = require('./pixel-fit.js'), ex = findEdges(r.d).y.filter(e => e.kind === 'round' && !onLine(e.pos));
    if (ex.length) { const p = ex[0].pos, settle = Math.ceil(p) - p; r = make({ settle }); r.meta.settle = +settle.toFixed(4); }
  }
  return r;
}
module.exports = { GRID, whole, even, centred, row, counter, fits, place, build, ICONS, MARKS };
if (require.main === module) {
  const out = process.env.OUT || path.join(__dirname, '..', 'svg', 'the-grid');
  fs.mkdirSync(out, { recursive: true });
  const jf = path.join(out, 'build.json'), all = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, 'utf8')) : {};
  const names = process.argv.slice(2).length ? process.argv.slice(2) : [...Object.keys(ICONS), ...Object.keys(MARKS)];
  for (const n of names) {
    const t0 = Date.now(), r = build(n), m = measure(r.d);
    all[n] = { d: r.d, meta: r.meta, box: m.box, ink: +m.area.toFixed(1) };
    fs.writeFileSync(path.join(out, `${n}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${r.d}"/></svg>\n`);
    fs.writeFileSync(jf, JSON.stringify(all, null, 1));
    console.log(n, `${((Date.now() - t0) / 1000).toFixed(0)}s`, 'box', ['x0', 'y0', 'x1', 'y1'].map(k => m.box[k].toFixed(3)).join(' '), 'ink', m.area.toFixed(1), JSON.stringify(r.meta));
  }
}
