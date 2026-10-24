// g7av THE CONSTRUCTION (owner on v230: "I want to see a diagram now that overlays the shapes used to make these shapes on
// top of them, a construction diagram"). Rebuilds the shown row (boards7 R2B, "Rules from the coupe and tree, the foot by
// the plate rule") exactly as boards7's fitPlace / starOutline / plus do, and records every step the engine takes: the
// class and its cut, the size, the root shapes (after the size and the place), the counters as offsets, every corner's
// kind and round (engine.js join.cornerLog), the mirror axis and the optical centring. Each glyph's finished outline is
// checked byte for byte against the row's svg (svg/g7/between), so the diagram is the code's own construction.
//   node construction.js            -> svg/g7/construction.json   (about 3 min)
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js'), P7 = require('./picks7.js');
const { LAWS7, HUMAN, scaled } = require('./laws7.js');
const { measure } = require('./optics.js');
const { DRAW, KEY, CLASS, W, plus, star } = P7;
const r3 = v => Math.round(v * 3) / 3, r4 = v => Math.round(v * 4) / 4;

// ---- the R2B row, copied from boards7.js (values, not references, so this runs in minutes, not 45)
const EASE = 2.3;
const JOIN10 = { ease: EASE, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth', tipKeep: 'crest', tipLand: true, tipPow: 1, tipSoft: require('./proportions.js').PROP.transition.tipSoft, noReverse: true, maxPieces: 2, arcEase: true, arcRamp: 0.3, flareLean: require('./proportions.js').PROP.transition.flareLean };
const COUPE_B = { bd: 5.5, bk: 0.35, bx: 0.5, fb: 10.333, bandH: 7 / 6, bandSide: 'shift' };
const STRUCT = { gb: 4, ap: 0.5, gEnd: 1.2 }, JOINS = { cap: { flare: 0.5 }, foot: { over: 0.5, flare: 0.5 } };
// g7aw: THE CAP RULE (a base with a curved side is a slab cut by one ellipse: 7/6 of its width, its full height), on the
// coupe's foot and the cup's plate (picks7 CAP); a copy of boards7's CAP_RULE
const CAP_RULE = { root: 'ellipse', ry: 1, over: 7 / 6 };
const VESSEL_ROOT = { bowlRoot: 7 / 8, bowlWide: true, bowlSplit: 'even', cupRoot: { over: 1, ry: 2 / 5 } };   // a copy of boards7's
// g7az THE PROPORTIONS (src/proportions.js, the one table): the shown row is now R2B drawn from PROP (boards7 R3, "The proportions"):
// the cap's ends at half its height, every vessel's ellipse 4/5, the cup, coupe and museum by their ratios, thicknesses in lines
const { PROP, capOver } = require('./proportions.js'), LN = k => +(k * W).toFixed(10), CAP_P = { root: 'ellipse', ry: 1, over: capOver(PROP.cap.end) };
const O = { droop: 0.5, bow: -0.2, dome: true, ...COUPE_B, ...P7.VESSEL_SIDE, post: 1.25, starTip: 0.0877, plate: 0.5, colW: 1.25, struct: { ...STRUCT, ...JOINS }, bandH: 5 / 6, dome: 0.5, cap: CAP_RULE, capPlate: CAP_RULE, ...VESSEL_ROOT,
  prop: PROP, cap: CAP_P, capPlate: CAP_P, post: LN(PROP.line.post), colW: LN(PROP.line.post), droop: PROP.line.droop, bow: PROP.line.bow };
const HUMAN_V = { flare: 0.5, mass: 0.6, end: 0.3, tipShare: 0.0877 };
const LAW = HUMAN(HUMAN_V), FK = 11 / 12;
const opticalY = m => m.box.cy - 0.5 * Math.max(0, m.box.cy - m.cy);
const shiftD = (d, dy) => { let k = 0; return d.replace(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g, t => { if (/[MLCZ]/.test(t)) { k = 0; return t; } const v = (k++ % 2) ? +(+t + dy).toFixed(5) : +t; return `${v}`; }).replace(/([0-9])(-)/g, '$1 $2'); };
const LINEW = 5 / 3, OUTLINE_HOLE = 2.5;
const starHoleRc = (lw = W, holeLines = OUTLINE_HOLE) => (holeLines * lw / 2 + (lw / 2) / Math.sin(3 * Math.PI / 10)) / P7.STAR.ri;
const starTipLaw = tip => scaled(c => (c.convex && c.angle < 75) ? Math.min(LAWS7.joint(c), tip * Math.min(c.lin, c.lout)) : LAWS7.joint(c), 24 / 20);

// the law, logged: every call the corner pass makes, with what the law answered and which branch of HUMAN answered it
const lawWhy = c => {
  if (c.hole) return c.angle <= 105 ? 'counter corner (join round)' : 'counter, wide';
  if (!c.convex && c.angle >= 75 && c.angle <= 105 && Math.min(c.lin, c.lout) >= 1.5) return 'flare';
  if (c.convex && c.angle >= 75 && c.angle <= 105) return Math.min(c.lin, c.lout) <= 2 ? 'cut end' : 'mass corner';
  if (c.convex && c.angle < 75) return 'tip (share of edge)';
  if (!c.convex) return c.angle <= 105 ? 'join / notch' : 'wide inside';
  return 'obtuse outside';
};

function classByProportion(id, draw, opts, apex, cls0) {
  if (!['WIDE', 'SQUARE', 'TALL'].includes(cls0)) return { cls: cls0 };
  const b = measure(E.build(draw(), opts).d).box, a = (b.x1 - b.x0) / (b.y1 - b.y0);
  let best = cls0, bd = 1e9;
  for (const c of ['WIDE', 'SQUARE', 'TALL']) { const d = Math.abs(Math.log(a / (KEY[c][0] / (KEY[c][1] + apex)))); if (d < bd) { bd = d; best = c; } }
  return { cls: best, ratio: a, from: cls0 };
}
const svgD = f => fs.readFileSync(path.join(__dirname, '../svg/g7/between', f), 'utf8').match(/ d="([^"]+)"/)[1];
const primOut = (q, dx = 0, dy = 0) => { const o = { t: q.t, root: q.root || null, also: q.also || null, cut: !!q.cut, fill: !!q.fill };
  if (q.cap) o.cap = { ...q.cap, cx: q.cap.cx + dx, cy: q.cap.cy + dy };   // g7aw: a cap's root ellipse, placed
  if (q.ratio) o.ratio = q.ratio; if (q.t === 'E') { o.w = q.w; o.mirror = q.mirror; o.of = E.parts(q.of).map(p => p.d); o.clip = q.clip ? E.parts([q.clip])[0].d : null; } return o; };

function shaped(id) {
  const opts = { law: LAW, tightHoles: true, ease: EASE, join: JOIN10 }, fast = { ...opts, join: { ...JOIN10, fair: false } };
  const [cls0, apex] = CLASS[id], dr = (s, x = {}) => DRAW[id](s, { style: 'mono', ...O, ...x });
  // g7az: the class by the drawing's proportion at its fitted size (px parts don't scale, so at 12 a drawing reads squatter than shown)
  const fitTo = c => { const kw_ = KEY[c][0] * FK, bh_ = (KEY[c][1] + apex) * FK; let s_ = 12; for (let k = 0; k < 4; k++) { const b = measure(E.build(dr(s_), fast).d).box; s_ *= Math.min(kw_ / (b.x1 - b.x0), bh_ / (b.y1 - b.y0)); } return s_; };
  const cb = classByProportion(id, () => dr(['WIDE', 'SQUARE', 'TALL'].includes(cls0) ? fitTo(cls0) : 12), fast, apex, cls0), cls = cb.cls, kw = KEY[cls][0] * FK, bh = (KEY[cls][1] + apex) * FK;
  let s = 12; const sizes = [s];
  for (let k = 0; k < 6; k++) { const b = measure(E.build(dr(s), k < 4 ? fast : opts).d).box; s *= Math.min(kw / (b.x1 - b.x0), bh / (b.y1 - b.y0)); sizes.push(s); }
  // g7az THE FIT AS A SOLVE: if the passes stop short of the cut on both sides (a lattice step in the way: the cup at v237), the
  // largest size that fits, by halving
  { const fits = s_ => { const b = measure(E.build(dr(s_), fast).d).box; return { ok: b.x1 - b.x0 <= kw + 1e-3 && b.y1 - b.y0 <= bh + 1e-3, touch: Math.abs(b.x1 - b.x0 - kw) < 5e-3 || Math.abs(b.y1 - b.y0 - bh) < 5e-3 }; };
    const f0 = fits(s); if (!(f0.ok && f0.touch)) { let lo = f0.ok ? s : s * 0.9, hi = f0.ok ? s * 1.1 : s; for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (fits(m).ok) lo = m; else hi = m; } s = lo; sizes.push(s); } }
  const ox = (24 - s) / 2, oy = r3((24 - s) / 2), prims0 = dr(s), m = measure(E.build(E.xform(prims0, 1, 0, 0, ox, oy), opts).d);
  const tx = r4(12 - (m.box.cx + m.cx) / 2), sym = id !== 'cafe' ? ox + tx + s / 2 : undefined, ty = oy + 12 - opticalY(m);
  const prims = E.xform(prims0, 1, 0, 0, ox + tx, ty);
  const laws = [], cornerLog = [];
  const law = c => { const r = LAW(c); laws.push({ pt: c.pt, convex: c.convex, hole: !!c.hole, angle: c.angle, lin: c.lin, lout: c.lout, r, why: lawWhy(c) }); return r; };
  const d = E.build(prims, { ...opts, law, join: { ...JOIN10, cornerLog, flareLog: [], arcLog: [] }, sym }).d;
  const raw = E.build(prims, { ...opts, join: JOIN10 }).d;   // before the mirror, for the record
  const sharp = E.build(prims).d;                           // the union, before the corner law
  const mFin = measure(d);
  return { id, cls, classFrom: cb, apex, key: KEY[cls], fk: FK, cut: [kw, bh], s, sizes, ox, oy, tx, ty, sym, mPre: m, mFin, opticalY: opticalY(m),
    prims: prims.map(q => primOut(q, ox + tx, ty)), parts: E.parts(prims).map(p => p.d), sharp, raw, d, laws: dedupe(laws), corners: cornerLog };
}
// the corner pass runs several times per build (tip landing probes); keep each corner once, the last answer
function dedupe(laws) { const out = []; for (const l of laws) { const k = l.pt.map(v => v.toFixed(3)).join(','); const i = out.findIndex(x => x.k === k); if (i >= 0) out[i] = { ...l, k }; else out.push({ ...l, k }); } return out; }

function mark(id) {
  const laws = [], cornerLog = [];
  if (id === 'star') {
    const rc = starHoleRc(W) * 24 / 20 / 9.6, prims = star(20, rc, W, 'root'), base = starTipLaw(O.starTip);
    const law = c => { const r = base(c); laws.push({ pt: c.pt, convex: c.convex, hole: !!c.hole, angle: c.angle, lin: c.lin, lout: c.lout, r, why: c.hole ? 'counter corner' : c.convex ? 'tip (share of edge)' : 'wide inside (valley)' }); return r; };
    const d0 = E.build(prims, { law, ease: EASE, tightHoles: true, join: { ...JOIN10, cornerLog, flareLog: [], arcLog: [] } }).d, m = measure(d0), dy = 12 - opticalY(m);
    return { id, cls: 'OUTLINE', slot: 20, sc: rc, Rc: 9.6 * rc, ri: 9.6 * rc * P7.STAR.ri, centre: [12, 12 + 0.6 * rc], lw: W * 24 / 20, holeLines: OUTLINE_HOLE, dy, mPre: m, mFin: measure(shiftD(d0, dy)),
      prims: prims.map(q => primOut(q)), parts: E.parts(prims).map(p => p.d), sharp: E.build(prims).d, d0, d: shiftD(d0, dy), laws: dedupe(laws), corners: cornerLog };
  }
  const sc = KEY.OPEN[0] / 14, prims = plus(26.4, sc, LINEW), base = scaled(LAWS7.joint, 24 / 26.4);
  const law = c => { const r = base(c); laws.push({ pt: c.pt, convex: c.convex, hole: !!c.hole, angle: c.angle, lin: c.lin, lout: c.lout, r, why: c.convex ? 'cut end' : 'join' }); return r; };
  const d0 = E.build(prims, { law, ease: EASE, join: { ...JOIN10, cornerLog, flareLog: [], arcLog: [] } }).d, m = measure(d0), dy = 12 - opticalY(m);
  return { id, cls: 'OPEN', slot: 26.4, sc, L: 14 * sc, lw: LINEW * 24 / 26.4, dy, mPre: m, mFin: measure(shiftD(d0, dy)),
    prims: prims.map(q => primOut(q)), parts: E.parts(prims).map(p => p.d), sharp: E.build(prims).d, d0, d: shiftD(d0, dy), laws: dedupe(laws), corners: cornerLog };
}

const FILES = { cafe: 'cafe-r3.svg', bar: 'bar-r3.svg', museum: 'museum-r3.svg', nature: 'nature-r3.svg', star: 'star-r3.svg', plus: 'plus-r3.svg' };   // g7az: the proportions row (boards7 R3)
const only = process.argv[2] ? process.argv[2].split(',') : Object.keys(FILES);
const outF = path.join(__dirname, '../svg/g7/construction.json');
const all = fs.existsSync(outF) ? JSON.parse(fs.readFileSync(outF, 'utf8')) : {};
for (const id of only) {
  const t0 = Date.now(), g = id === 'star' || id === 'plus' ? mark(id) : shaped(id), shown = svgD(FILES[id]);
  g.same = g.d === shown;
  all[id] = g;
  console.log(id, g.same ? 'IDENTICAL to the row svg' : 'DIFFERS from the row svg', `${((Date.now() - t0) / 1000).toFixed(0)}s`, 'corners', g.corners.length);
  fs.writeFileSync(outF, JSON.stringify(all));
}
