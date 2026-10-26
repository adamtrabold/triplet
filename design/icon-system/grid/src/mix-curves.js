// THE MIX IN CLEAN CURVES (director, turn 169: "Run the root calls through the engine's round solver ... The museum and the coupe
// must match approved at 27px a unit"). Outside the real system: engine.js is used as a library (its union, corner pass, fairing,
// tip landing, leaned flares and mirror), unchanged; picks7.js and the six are not touched.
//
// An icon is ONLY root calls (as in src/mix.py): each root states its kind, so its thickness. The casting rule becomes the law the
// engine's corner pass asks at every corner, answered from the roots that meet there, not from the corner's angle and edge alone:
//   inside   BASE; POST_FLARE where a post meets another kind of root (a post carries its own flare);
//            BASE inside a counter or hole; a wide inside corner (over 105 degrees) starts from WIDE_IN instead of BASE;
//   outside  t / 5 of the root there; a wide corner (over 105) WIDE_OUT; a tip (under 75) min(TIP, TIP_SHARE x its shorter edge);
//   every round at most FIT of its shorter edge (a flare FLARE_FIT), the engine's limits.
// Line marks (star, +) are drawn in a 24 box shown at their slot: thickness and radii are px on screen, times 24 / slot.
//   TOOLS=<dir with node_modules/paper> node mix-curves.js [names]      -> svg/mix/curves/<name>.svg, curves.json
'use strict';
const fs = require('fs'), path = require('path');
process.env.TOOLS = process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/683036fd-0c2e-5f0d-b9a0-04ae75779edf/scratchpad/tools';
const E = require('./engine.js');
const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js'));
const { PROP } = require('./proportions.js');
const HERE = path.join(__dirname, '..');
const cons = require('../svg/g7/construction.json');
const LINE = 1.5;
// THICKNESS BY KIND, px at 24 (fractions of the line)
const T = { mass: 2 * LINE, slab: LINE, post: LINE, loop: LINE };   // a loop is a post bent round its counter; owner 10-26: no ink thinner than the line (post and loop were 5/6)
const RULE = { base: 0.15, wideIn: 0.3, wideOut: 0.7, k: 1 / 5, postFlare: 0.5, tip: 0.35, tipShare: 0.0877, fit: 0.2, flareFit: 0.45 };
const JOIN10 = { ease: 2.3, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth', tipKeep: 'crest', tipLand: true, tipPow: 1, tipSoft: PROP.transition.tipSoft, noReverse: true, maxPieces: 2, arcEase: true, arcRamp: 0.3, flareLean: PROP.transition.flareLean };

const ink = (kind, prim, t) => ({ kind, t: t ?? T[kind], prim });
const rectD = (x0, y0, x1, y1) => `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
const K = 0.5523;

// ---- the root calls
// CAPITAL: where an outer post holds a slab running past it: a block a step either side of the slab's face, from the post's outer
// face to the slab's end, less a quarter ellipse centred on the slab's end a step past its face (rx the overhang, ry two steps).
function capital(face, end, under, step, side, down) {
  const sg = down ? 1 : -1, xa = Math.min(face, end), xb = Math.max(face, end);
  const blk = ink('slab', E.R(xa, Math.min(under - sg * step, under + sg * step), xb - xa, 2 * step));
  const cx = end, cy = under + sg * step, rx = Math.abs(end - face), ry = 2 * step, px = cx - side * rx, py = cy - sg * ry;
  // quarter ellipse from the post face (px, cy) to the slab end (cx, py), centre (cx, cy), padded past the block on its open sides
  const o = 0.3;
  const d = `M${px} ${cy}C${px} ${cy - sg * ry * K} ${cx - side * rx * K} ${py} ${cx} ${py}L${cx + side * o} ${py}L${cx + side * o} ${cy + sg * o}L${px} ${cy + sg * o}Z`;
  return [blk, { cutPrim: E.cut(E.D(d)) }];
}
function museum() {
  const beam = [7.11056, 16.88856], bt = 10.976, bu = 12.476, pt = 15.31, pb = 16.81, xs = [7.52767, 10.09256, 12.65744, 15.22233], pw = 1.25, step = 0.5;
  const roots = [ink('slab', E.D('M7.111,9.97633v-1.2l4.889,-1.62933l4.889,1.62933v1.2z')),
    ink('slab', E.R(beam[0], bt, beam[1] - beam[0], bu - bt)), ink('slab', E.R(beam[0], pt, beam[1] - beam[0], pb - pt)),
    ...xs.map(x => ink('post', E.R(x, bu - 0.01, pw, pt - bu + 0.02)))];
  const cuts = [];
  for (const [face, end, side] of [[xs[0], beam[0], -1], [xs[3] + pw, beam[1], 1]])
    for (const [under, down] of [[bu, true], [pt, false]]) { const [b, c] = capital(face, end, under, step, side, down); roots.push(b); cuts.push(c.cutPrim); }
  return { roots, cuts, sym: cons.museum.sym };
}
const fromCons = (id, kinds, opts = {}) => {
  const v = cons[id], roots = [], cuts = [];
  v.parts.forEach((d, i) => { if (v.prims[i].cut) cuts.push(E.cut(E.D(d))); else roots.push(ink(kinds[roots.length], E.D(d), opts.t)); });
  return { roots, cuts, sym: v.sym, ...opts };
};

function halfEllipseDown(cx, cy, rx, ry) { return `M${cx - rx} ${cy}C${cx - rx} ${cy + ry * K} ${cx - rx * K} ${cy + ry} ${cx} ${cy + ry}C${cx + rx * K} ${cy + ry} ${cx + rx} ${cy + ry * K} ${cx + rx} ${cy}Z`; }
function restaurant() {
  const post = T.post, band = LINE / 2, cutW = 2 / 3 * LINE, top = 6.5, bot = 17.5, fw = 3 * post + 2 * band, kw = LINE * 1.5;
  const x0 = 12 - (fw + cutW + kw) / 2, fcx = x0 + fw / 2, hc = top + 3.0, roots = [];
  for (let i = 0; i < 3; i++) { const x = x0 + i * (post + band); roots.push(ink('post', E.R(x, top, post, hc - 0.1 - top))); }
  // the head: the tines' span with upright sides into the lower half of one ellipse. Its height: the line runs into the ellipse at
  // its widest point, so the ellipse's bend there (rx / ry^2) must stay under the fair check's jump limit (0.35): ry = rx (a half circle)
  // leaves 0.38, so the head is a half ellipse 1.05 as tall as wide
  { const rx = fw / 2, ry = 1.05 * rx; roots.push(ink('mass', E.D(`M${fcx - rx} ${hc - 0.3}V${hc}C${fcx - rx} ${hc + ry * K} ${fcx - rx * K} ${hc + ry} ${fcx} ${hc + ry}C${fcx + rx * K} ${hc + ry} ${fcx + rx} ${hc + ry * K} ${fcx + rx} ${hc}V${hc - 0.3}Z`))); }
  { const hb = hc + 1.05 * fw / 2 - 0.4; roots.push(ink('post', E.R(fcx - post / 2, hb, post, bot - hb))); }
  const ks = x0 + fw + cutW, ke = top + 6, ry = ke - top;   // the blade: straight spine, its edge a quarter ellipse (cap rule upright)
  roots.push(ink('mass', E.D(`M${ks} ${top}C${ks + kw * K} ${top} ${ks + kw} ${ke - ry * K} ${ks + kw} ${ke}H${ks}Z`)));
  roots.push(ink('post', E.R(ks, ke - 0.2, post, bot - ke + 0.2)));
  return { roots, cuts: [] };
}
function bag() {
  const w0 = 8.4, w1 = w0 * 5 / 6, h = 0.8 * w0, rxo = 4 / 5 * w0 / 2, ryo = 2 / 3 * rxo, lw = T.loop;
  const top = 12 - (h + ryo + LINE / 2) / 2 + ryo + LINE / 2, bot = top + h, cy = top - LINE / 2;
  const body = ink('mass', E.P([12 - w0 / 2, top], [12 + w0 / 2, top], [12 + w1 / 2, bot], [12 - w1 / 2, bot]));
  const ri = rxo - lw, rj = ryo - lw;
  const handle = ink('loop', E.D(`M${12 - rxo} ${top + 0.3}V${cy}C${12 - rxo} ${cy - ryo * K} ${12 - rxo * K} ${cy - ryo} 12 ${cy - ryo}C${12 + rxo * K} ${cy - ryo} ${12 + rxo} ${cy - ryo * K} ${12 + rxo} ${cy}V${top + 0.3}H${12 + ri}V${cy}C${12 + ri} ${cy - rj * K} ${12 + ri * K} ${cy - rj} 12 ${cy - rj}C${12 - ri * K} ${cy - rj} ${12 - ri} ${cy - rj * K} ${12 - ri} ${cy}V${top + 0.3}Z`));
  const by0 = top + LINE, by1 = by0 + LINE / 2, xl = y => 12 - w0 / 2 + (w0 - w1) / 2 * (y - top) / h, xr = y => 24 - xl(y);
  const band = E.cut(E.P([xl(by0) + LINE, by0], [xr(by0) - LINE, by0], [xr(by1) - LINE, by1], [xl(by1) + LINE, by1]));
  return { roots: [body, handle], cuts: [band], sym: 12 };
}
function bed() {
  const b = require('../svg/blind/blind.json').bed2, p = b.parts;
  return { roots: [ink('mass', E.D(p[0])), ink('post', E.D(p[1])), ink('post', E.D(p[2])), ink('mass', E.D(p[3]))], cuts: [] };
}
const ICONS = {
  cafe: () => fromCons('cafe', ['mass', 'loop', 'slab']),
  bar: () => fromCons('bar', ['mass', 'post', 'slab']),
  museum,
  nature: () => fromCons('nature', ['mass', 'mass', 'mass', 'post']),
  star: (J = {}) => { const v = cons.star, [o, h] = E.xform([E.D(v.parts[0]), E.cut(E.D(v.parts[1]))], 1, 0, 0, J.dx || 0, v.dy + (J.dy || 0)); return { roots: [ink('slab', o, LINE)], cuts: [h], line: 24 / 20, selfShift: true }; },
  plus: () => { const v = cons.plus; return { roots: v.parts.map(d => ink('slab', E.D(d), 5 / 3)), cuts: [], line: 24 / 26.4, loose: true }; },
  restaurant, bag, bed,
};

// ---- the law, from the roots that meet at a corner
function lawFor(icon, log) {
  const k = icon.line || 1, items = icon.roots.map(r => { const it = new paper.CompoundPath(E.parts([r.prim])[0].d); return { r, it }; });
  const near = pt => { const P = new paper.Point(pt[0], pt[1]); return items.filter(({ it }) => it.contains(P) || it.getNearestPoint(P).getDistance(P) < 0.06).map(x => x.r); };
  return c => {
    const e = Math.min(c.lin, c.lout), here = near(c.pt), ts = here.map(r => r.t * (icon.line ? 1 : 1));
    let r, why;
    if (c.convex && !(c.hole && !icon.line)) {
      if (c.angle < 75) { r = Math.min(RULE.tip, RULE.tipShare * e / k); why = 'tip'; }
      else if (c.angle > 105) { r = Math.min(RULE.wideOut, RULE.fit * e / k); why = 'outside, wide'; }
      else { r = Math.min(RULE.k * Math.max(...(ts.length ? ts : [T.post])), RULE.fit * e / k); why = 'outside t/5'; }
    } else {
      const base = c.angle > 105 ? RULE.wideIn : RULE.base;
      if (c.hole) { r = Math.min(base, RULE.fit * e / k); why = 'counter'; }
      else {
        r = base; why = 'base';
        if (here.some(x => x.kind === 'post') && here.some(x => x.kind !== 'post')) { r = Math.max(r, RULE.postFlare); why = 'post flare'; }
        r = Math.min(r, (why === 'post flare' ? RULE.flareFit : RULE.fit) * e / k);
      }
    }
    if (log) log.push({ pt: c.pt.map(v => +v.toFixed(3)), convex: c.convex, hole: !!c.hole, angle: +c.angle.toFixed(1), kinds: here.map(x => x.kind), r: +(r * k).toFixed(3), why });
    return r * k;
  };
}
function buildIcon(name, J = {}) {
  const icon = ICONS[name](J);
  let prims = [...icon.roots.map(r => r.prim), ...icon.cuts];
  if (!icon.selfShift && (J.dx || J.dy)) { prims = E.xform(prims, 1, 0, 0, J.dx || 0, J.dy || 0); icon.roots = icon.roots.map((r, i) => ({ ...r, prim: prims[i] })); }
  const log = [];
  const sym = icon.sym != null ? icon.sym + (J.dx || 0) : undefined;
  const d = E.build(prims, { law: lawFor(icon, log), tightHoles: icon.loose ? false : true, ease: 2.3, join: { ...JOIN10 }, sym }).d;
  return { d, log, sym };
}
module.exports = { buildIcon, ICONS, T, RULE };
if (require.main === module) {
  const out = path.join(HERE, 'svg/mix/curves'); fs.mkdirSync(out, { recursive: true });
  const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ICONS);
  const sumF = path.join(out, 'curves.json'), sum = fs.existsSync(sumF) ? JSON.parse(fs.readFileSync(sumF, 'utf8')) : {};
  for (const n of names) {
    const t0 = Date.now(); const { d, log } = buildIcon(n);
    fs.writeFileSync(path.join(out, `${n}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${d}"/></svg>`);
    sum[n] = { curves: E.countCurves ? E.countCurves(d) : null, corners: log.length, law: log };
    console.log(n, `${((Date.now() - t0) / 1000).toFixed(0)}s`, 'curves', sum[n].curves, 'corners', log.length);
  }
  fs.writeFileSync(sumF, JSON.stringify(sum, null, 1));
}
