// THE BLIND TEST BUILD: the two blind icons (src/picks-blind.js) through the engine exactly as construction.js builds the
// row (Step 4: class at the fitted size, the solved fit to the cut x 11/12, rounds by kind, mirror, centre by rule 16),
// then the checks (fair-check, join-check) and the measures. Writes svg/blind/*.svg and svg/blind/blind.json.
//   TOOLS=<dir with node_modules/paper, clipper-lib> node blind.js
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js');
const { HUMAN } = require('./laws7.js');
const { measure } = require('./optics.js');
const { PROP } = require('./proportions.js');
const { bed, person } = require('./picks-blind.js');
const fair = require('./fair-check.js'), jc = require('./join-check.js');
const r3 = v => Math.round(v * 3) / 3, r4 = v => Math.round(v * 4) / 4;

// the engine's settings, as the spec's Step 4 and rule 14 give them (the same as construction.js's row)
const EASE = 2.3;
const JOIN10 = { ease: EASE, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth', tipKeep: 'crest', tipLand: true, tipPow: 1, tipSoft: PROP.transition.tipSoft, noReverse: true, maxPieces: 2, arcEase: true, arcRamp: 0.3, flareLean: PROP.transition.flareLean };
const LAW = HUMAN({ flare: 0.5, mass: 0.6, end: 0.3, tipShare: 0.0877 });   // rule 14: flares 1/2, mass 0.6, ends 0.3, tips 0.0877
// the classes' cuts (master grid): the coin's area; x 11/12 (rule 13); a lone apex passes by 1/2 (none here)
const T_ = v => Math.round(v * 3) / 3;
const KEY = { SQUARE: [T_(Math.sqrt(Math.PI * 36)), T_(Math.sqrt(Math.PI * 36))], WIDE: [12, T_(Math.PI * 36 / 12)], TALL: [T_(Math.PI * 36 / 12), 12] };
const FK = 11 / 12;
const opticalY = m => m.box.cy - 0.5 * Math.max(0, m.box.cy - m.cy);
const lawWhy = c => {
  if (c.hole) return c.angle <= 105 ? 'counter corner' : 'counter, wide';
  if (!c.convex && c.angle >= 75 && c.angle <= 105 && Math.min(c.lin, c.lout) >= 1.5) return 'flare';
  if (c.convex && c.angle >= 75 && c.angle <= 105) return Math.min(c.lin, c.lout) <= 2 ? 'line end' : 'mass corner';
  if (c.convex && c.angle < 75) return 'tip';
  if (!c.convex) return c.angle <= 105 ? 'join / notch' : 'wide inside';
  return 'wide outside';
};
const primOut = (q, dx = 0, dy = 0) => ({ t: q.t, root: q.root || null, name: q.name || null, cut: !!q.cut, cap: q.cap ? { ...q.cap, cx: q.cap.cx + dx, cy: q.cap.cy + dy } : null });
function dedupe(laws) { const out = []; for (const l of laws) { const k = l.pt.map(v => v.toFixed(3)).join(','); const i = out.findIndex(x => x.k === k); if (i >= 0) out[i] = { ...l, k }; else out.push({ ...l, k }); } return out; }

// the shaped pipeline (construction.js shaped(), for a drawing function dr(s))
function shaped(id, draw, symmetric) {
  const opts = { law: LAW, tightHoles: true, ease: EASE, join: JOIN10 }, fast = { ...opts, join: { ...JOIN10, fair: false } };
  const apex = 0, dr = s => draw(s);
  const fitTo = c => { const kw_ = KEY[c][0] * FK, bh_ = (KEY[c][1] + apex) * FK; let s_ = 12; for (let k = 0; k < 4; k++) { const b = measure(E.build(dr(s_), fast).d).box; s_ *= Math.min(kw_ / (b.x1 - b.x0), bh_ / (b.y1 - b.y0)); } return s_; };
  // rule 12: the class nearest the drawing's own width to height, read at its fitted size (each class's fit tried)
  const tries = ['WIDE', 'SQUARE', 'TALL'].map(c => { const b = measure(E.build(dr(fitTo(c)), fast).d).box, a = (b.x1 - b.x0) / (b.y1 - b.y0); return { c, a, d: Math.abs(Math.log(a / (KEY[c][0] / (KEY[c][1] + apex)))) }; });
  const cls = tries.reduce((b, x) => x.d < b.d ? x : b).c, kw = KEY[cls][0] * FK, bh = (KEY[cls][1] + apex) * FK;
  let s = 12;
  for (let k = 0; k < 6; k++) { const b = measure(E.build(dr(s), k < 4 ? fast : opts).d).box; s *= Math.min(kw / (b.x1 - b.x0), bh / (b.y1 - b.y0)); }
  { const fits = s_ => { const b = measure(E.build(dr(s_), fast).d).box; return { ok: b.x1 - b.x0 <= kw + 1e-3 && b.y1 - b.y0 <= bh + 1e-3, touch: Math.abs(b.x1 - b.x0 - kw) < 5e-3 || Math.abs(b.y1 - b.y0 - bh) < 5e-3 }; };
    const f0 = fits(s); if (!(f0.ok && f0.touch)) { let lo = f0.ok ? s : s * 0.9, hi = f0.ok ? s * 1.1 : s; for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (fits(m).ok) lo = m; else hi = m; } s = lo; } }
  const ox = (24 - s) / 2, oy = r3((24 - s) / 2), prims0 = dr(s), m = measure(E.build(E.xform(prims0, 1, 0, 0, ox, oy), opts).d);
  const tx = r4(12 - (m.box.cx + m.cx) / 2), sym = symmetric ? ox + tx + s / 2 : undefined, ty = oy + 12 - opticalY(m);
  const prims = E.xform(prims0, 1, 0, 0, ox + tx, ty);
  const laws = [];
  const law = c => { const r = LAW(c); laws.push({ pt: c.pt, convex: c.convex, hole: !!c.hole, angle: c.angle, lin: c.lin, lout: c.lout, r, why: lawWhy(c) }); return r; };
  const d = E.build(prims, { ...opts, law, sym }).d;
  const b = measure(d).box;
  return { id, cls, tries, cut: [kw, bh], s, unit: s / 12, ox, oy, tx, ty, sym, mPre: m, mFin: measure(d), finished: [b.x1 - b.x0, b.y1 - b.y0],
    prims: prims.map(q => primOut(q, ox + tx, ty)), parts: E.parts(prims).map(p => p.d), sharp: E.build(prims).d, d, laws: dedupe(laws) };
}

// the outline pipeline (construction.js mark('star'): drawn in its own 24 box at its slot, moved by the optical rule)
const shiftD = (d, dy) => { let k = 0; return d.replace(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/g, t => { if (/[MLCZ]/.test(t)) { k = 0; return t; } const v = (k++ % 2) ? +(+t + dy).toFixed(5) : +t; return `${v}`; }).replace(/([0-9])(-)/g, '$1 $2'); };
function outline(id, prims, slot) {
  const laws = [];
  const law = c => { const r = LAW(c); laws.push({ pt: c.pt, convex: c.convex, hole: !!c.hole, angle: c.angle, lin: c.lin, lout: c.lout, r, why: lawWhy(c) }); return r; };
  const d0 = E.build(prims, { law, ease: EASE, tightHoles: true, join: JOIN10, sym: 12 }).d, m = measure(d0), dy = 12 - opticalY(m), d = shiftD(d0, dy);
  const b = measure(d).box;
  return { id, cls: 'OUTLINE', slot, dy, mPre: m, mFin: measure(d), finished: [b.x1 - b.x0, b.y1 - b.y0], prims: prims.map(q => primOut(q, 0, dy)), parts: E.parts(E.xform(prims, 1, 0, 0, 0, dy)).map(p => p.d), sharp: E.build(E.xform(prims, 1, 0, 0, 0, dy)).d, d, laws: dedupe(laws).map(l => ({ ...l, pt: [l.pt[0], l.pt[1] + dy] })) };
}

const out = path.join(__dirname, '../svg/blind'); fs.mkdirSync(out, { recursive: true });
const only = process.argv[2] ? process.argv[2].split(',') : ['bed', 'bedAgainst', 'bedFixed', 'person'];
// bed: the blind result (rule 11 as written, pillow 1/2); bedAgainst: rule 11 scoped only; bedFixed: rule 11 scoped and the
// whole-ellipse rule (no flatter than 2/3), the two fixes proposed in blind-test.md
const BEDS = { bed: { rule11: 'strict' }, bedAgainst: { rule11: 'against' }, bedFixed: { rule11: 'against', pillowH: 2 / 3 } };
const jf = path.join(out, 'blind.json'), all = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, 'utf8')) : {};
for (const id of only) {
  const t0 = Date.now();
  const g = id === 'person' ? outline(id, person(24), 24) : shaped(id, s => bed(s, BEDS[id]), false);
  g.fair = fair.check(g.d); g.join = jc.check(g.d); g.curves = E.countCurves(g.d);
  all[id] = g;
  fs.writeFileSync(path.join(out, `${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${g.d}"/></svg>\n`);
  console.log(id, g.cls, g.s ? `s ${g.s.toFixed(3)}` : `slot ${g.slot}`, 'finished', g.finished.map(v => v.toFixed(2)).join(' x '), 'curves', g.curves, 'fair', g.fair.length, JSON.stringify(g.fair.map(x => x.kind)), 'join', g.join.length, `${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
fs.writeFileSync(jf, JSON.stringify(all));
