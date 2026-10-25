// g7bc BLIND TEST, ROUND 2 (director: "build two new icons blind from the board ... Run them through the checks, put them in the
// row, and you judge. If they land first time, it's a 10. If not, the rule that failed gets fixed."). Two icons drawn from the
// Construction board's spec alone (its rules 1-20, the table, the steps) and the code it names; nothing from the six's history.
// Every value is a PROP value (src/proportions.js: PROP.bag, PROP.heart, and the shared ones); every choice the spec doesn't make
// is written down in blind-test-2.md as "spec gap: <what>, I chose <what>, because <why>".
//
//   SHOPPING, a carrier bag. A category (it names what a place is), so SHAPED (rule 15, line 2: "If it names what a place is
//     (a category, in the badge ring), it is shaped, a solid mass").
//     roots   the body: a rectangle, a MASS (it is the thing: drawn one line thick it would not name a bag; rule 5), the widest
//             root (1); 4/5 as tall as it is wide.
//             the handle: a LOOP, a half circle and two straight arms, a line thick (1 1/2px); its outside 3/5 of the body's
//             width; its counter a circle on the same centre, a line less (rule 7), running straight for half a line into the
//             body's top wall before it turns (rule 7: "a counter that runs into a wall runs straight for 1/2 line first").
//     joins   the handle into the body: no kind of the five (spec gap 2); the engine's law answers by angle and edge.
//             the body's foot: it sits on the ground with no base (a mass with no posts: none of base's cases; spec gap 4).
//     place   symmetric about its axis, mirrored (rule 13).
//
//   FAVOURITE, a heart. A tap fills it, so OUTLINE, the same shape solid when on (rule 15, line 1: "If a tap fills it (a state
//     that toggles: the star, visited), it is an outline, the same shape solid when on").
//     roots   a square turned 45 degrees and two circles, each as wide as the square's side (1), centred on the midpoints of its
//             two upper sides: each circle runs into the square's lower sides tangent (rule 6), and the two meet at the square's
//             top corner, the cleft.
//     counter rule 7 per root: each root the same shape on the same centre less a wall (circle in circle, the square less a
//             wall on each side; spec gap 1 says why this is the reading, and what it costs).
//     size    by its outside to the outline cut (rule 15): the cut nearest its width to height (Square), 14.07px across at its
//             slot; drawn in its own 24 box at the slot (20px, the row star's: spec gap 6), the line 1 1/2px on screen.
'use strict';
const path = require('path'), fs = require('fs');
const E = require('./engine.js'), P7 = require('./picks7.js');
const { fromTable, scaled } = require('./laws7.js');
const { measure } = require('./optics.js');
const { PROP } = require('./proportions.js');
const { W, ELL_ARC } = P7;
const f = v => +v.toFixed(3);

// ---- the bag, in the 12-unit box (y down); positions scale with s, thicknesses (px) never do
function bag(s = 12, o = {}) {
  const pb = (o.prop || PROP).bag, ln = (o.prop || PROP).line, u = s / 12, X = v => f(v * u);
  const lat = v => Math.ceil(v * 3 - 1e-6) / 3;                    // the first lattice line at least that far (rule 10)
  const bw = 12, cx = 6;                                           // the body: the widest root, across the box
  const Ro = pb.handle * bw / 2;                                   // the handle's outside radius (units)
  const yc = Ro;                                                   // the handle's centre: its top on the box's top (0)
  const slot = ln.slot * W;                                        // its arms: half a line (px, a shown length: a minimum)
  const yt = lat(yc * u + slot);                                   // the body's top, the first lattice line past the arms (px)
  const bh = pb.body * bw;                                         // the body's height (units: a mass, a ratio of its width)
  const ro = Ro * u, ri = ro - W, xc = X(cx), ycp = yc * u;        // px
  const q = p => `${f(p[0])} ${f(p[1])}`, arc = (r, a, b) => { const P = ELL_ARC(xc, ycp, r, r, a, b); return `C${q(P[1])} ${q(P[2])} ${q(P[3])}`; };
  // the LOOP: a half circle on two arms; its arms run 0.01 into the body so the union closes (a hairline, inside the ink)
  const loop = E.D(`M${f(xc - ro)} ${f(yt + 0.01)}V${f(ycp)}${arc(ro, Math.PI, 1.5 * Math.PI)}${arc(ro, 1.5 * Math.PI, 2 * Math.PI)}V${f(yt + 0.01)}Z`, { root: 'LOOP', circle: { cx: xc, cy: ycp, r: ro } });
  // its counter: the circle on the same centre a line less, running straight into the body's top wall (it stops on the wall)
  const hole = E.cut(E.D(`M${f(xc - ri)} ${f(yt)}V${f(ycp)}${arc(ri, Math.PI, 1.5 * Math.PI)}${arc(ri, 1.5 * Math.PI, 2 * Math.PI)}V${f(yt)}Z`, { root: 'CIRCLE', also: 'SLOT', circle: { cx: xc, cy: ycp, r: ri } }));
  const body = E.R(0, yt, X(bw), f(bh * u), { root: 'MASS' });
  return [body, loop, hole];
}

// ---- the heart, in its own 24 box shown at `slot` px; a = the square's side (box units)
function heartPrims(a, cy = 12, slot = 20, on = false) {
  const k = 24 / slot, w = W * k, cx = 12, h = a / Math.SQRT2;    // h: centre to a corner of the turned square
  const sq = (half) => E.P([cx, cy - half], [cx + half, cy], [cx, cy + half], [cx - half, cy]);   // top, right, bottom, left
  const m1 = [cx - h / 2, cy - h / 2], m2 = [cx + h / 2, cy - h / 2], r = a / 2;   // the circles, on the upper sides' midpoints
  const out = [{ ...sq(h), root: 'SQUARE (turned 45)' }, { ...E.C(m1[0], m1[1], r), root: 'CIRCLE' }, { ...E.C(m2[0], m2[1], r), root: 'CIRCLE' }];
  if (on) return out;
  // rule 7, per root: the square less a wall on each side (same centre), each circle a wall less (same centre)
  const hi = (a - 2 * w) / Math.SQRT2;
  out.push({ ...E.cut(sq(hi)), root: 'SQUARE (counter)' }, { ...E.cut(E.C(m1[0], m1[1], r - w)), root: 'CIRCLE (counter)' }, { ...E.cut(E.C(m2[0], m2[1], r - w)), root: 'CIRCLE (counter)' });
  return out;
}
// the outside's width is the circles' (1/2 + 1/(2 sqrt 2) + ... ): exactly a (1 + 1/sqrt2); solved anyway, on the finished outline
const HEART_W = a => a * (1 + Math.SQRT1_2);

// ---- the engine's finishing, as construction.js does it for the six (values copied: construction.js exports only its builders)
const EASE = 2.3;
const JOIN10 = { ease: EASE, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth', tipKeep: 'crest', tipLand: true, tipPow: 1, tipSoft: PROP.transition.tipSoft, noReverse: true, maxPieces: 2, arcEase: true, arcRamp: 0.3, flareLean: PROP.transition.flareLean };
const LINE_LAW = fromTable(PROP.rounds.line);
const opticalY = m => m.box.cy - 0.5 * Math.max(0, m.box.cy - m.cy);
const shiftD = (d, dy) => { let k = 0; return d.replace(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g, t => { if (/[MLCZ]/.test(t)) { k = 0; return t; } const v = (k++ % 2) ? (+t + dy).toFixed(7).replace(/\.?0+$/, "").replace(/^-0$/, "0") : t; return v; }).replace(/([0-9])(-)/g, '$1 $2'); };

// the bag goes through construction.js's own shaped() (the six's pipeline: class by proportion, the fit as a solve, clearSteps,
// centring, the shaped law, the mirror): registered as a DRAW entry, its starting class one of the three (the engine re-picks it)
P7.DRAW.bag = (s, o) => bag(s, o);
P7.CLASS.bag = ['SQUARE', 0];
let CON = null; const con = () => CON || (CON = require('./construction.js'));
const bagBuild = (J = {}) => con().shaped('bag', J);

// the heart as construction.js builds the star (mark()): its own 24 box at the slot, the line law scaled to the box, the optical
// centre by rule 19 (symmetric, so across it is already centred)
function heartBuild(J = {}, on = false, slot = 20) {
  const k = 24 / slot, cut = PROP.outline.square * k;              // the outline cut, Square: 14.07px on screen (rule 15)
  let a = E.placeSize(cut / (1 + Math.SQRT1_2) * (1 + (J.ds || 0) / 14));
  const law = scaled(LINE_LAW, k), laws = [], cornerLog = [];
  const lawL = c => { const r = law(c); laws.push({ pt: c.pt, convex: c.convex, hole: !!c.hole, angle: c.angle, lin: c.lin, lout: c.lout, r }); return r; };
  let prims = heartPrims(a, 12, slot, on);
  if (J.dx || J.dy) prims = E.xform(prims, 1, 0, 0, J.dx || 0, 0);
  const d0 = E.build(prims, { law: lawL, ease: EASE, tightHoles: true, join: { ...JOIN10, cornerLog, flareLog: [], arcLog: [] } }).d, m = measure(d0);   // no sym: as the star (construction.js mark()); a nudged heart crashed engine symD, m = measure(d0);
  const dy = (J.law1000 !== false ? E.placeOffset : v => v)(12 - opticalY(m)) + (J.dy || 0);
  const d = shiftD(d0, dy);
  if (J.fit) return { id: on ? 'heart-on' : 'heart', d };
  return { id: on ? 'heart-on' : 'heart', cls: 'OUTLINE', outlineClass: 'SQUARE', slot, a, k, dy, mPre: m, mFin: measure(d), prims: prims.map(q => ({ t: q.t, root: q.root, cut: !!q.cut, pts: q.pts, cx: q.cx, cy: q.cy, r: q.r })),
    parts: E.parts(prims).map(p => p.d), sharp: E.build(prims).d, d, laws, corners: cornerLog };
}

module.exports = { bag, heartPrims, heartBuild, bagBuild, HEART_W, JITTER: { bag: J => bagBuild({ ...J, fit: J.fit || fitBag() }), heart: J => heartBuild({ ...J, fit: true }), 'heart-on': J => heartBuild({ ...J, fit: true }, true) } };
// the bag's approved fit (size and class), from its own build, so a jitter rebuild nudges the approved drawing
let FIT = null;
function fitBag() { if (FIT) return FIT; const p = path.join(__dirname, '../svg/blind2/construction.json'); const j = JSON.parse(fs.readFileSync(p, 'utf8')); return (FIT = { s: j.bag.s, classFrom: j.bag.classFrom }); }

if (require.main === module) {
  const outD = path.join(__dirname, '../svg/blind2'); fs.mkdirSync(outD, { recursive: true });
  const all = {};
  const t0 = Date.now(); all.bag = bagBuild(); console.log('bag', all.bag.cls, 's', all.bag.s.toFixed(4), `${((Date.now() - t0) / 1000).toFixed(0)}s`);
  all.heart = heartBuild(); all['heart-on'] = heartBuild({}, true); console.log('heart a', all.heart.a);
  fs.writeFileSync(path.join(outD, 'construction.json'), JSON.stringify(all));
  for (const id of ['bag', 'heart', 'heart-on']) fs.writeFileSync(path.join(outD, id + '.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${all[id].d}"/></svg>\n`);
  for (const id of ['bag', 'heart', 'heart-on']) { const m = all[id].mFin; console.log(id, 'box', (m.box.x1 - m.box.x0).toFixed(3), 'x', (m.box.y1 - m.box.y0).toFixed(3), 'units of 24'); }
}
