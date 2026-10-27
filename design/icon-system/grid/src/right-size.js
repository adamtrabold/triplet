// RIGHT SIZE (10-27). Every icon drawn at the size it ships, 1:1 in CSS px, on that size's own iPhone grid (1/3 px).
//   18 (the master): the place glyph in its 24px badge (pins and rows). Drawing units = the badge's CSS px; the glyph's 18 box is
//      the badge's 3..21. Strokes and posts 1 1/3 (4 iPhone px), counters at least 1.
//   24: the selected pin, the glyph's 24 box in its 32 badge. The 18 drawing x 4/3 with detail added; strokes 2 (6 iPhone px).
//   12: the filter chip. The 18 drawing x 2/3 with detail removed (short counters close); strokes 1 (3 iPhone px).
//   star: 18 box, bare (row and tag). +: in its 60px button, 1:1.
// Landing is one-side.js (silhouette first, then one side of each stroke, centred parts even) with each size's own widths.
//   node src/right-size.js [names]  -> svg/right/<name>-<size>.svg (viewBox 0 0 size size), svg/right/build.json
'use strict';
const fs = require('fs'), path = require('path');
process.env.TOOLS = process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/tools';
const E = require('./engine.js'), MC = require('./mix-curves.js'), OS = require('./one-side.js');
const { parse } = require('./join-check.js');
const ROOT = path.join(__dirname, '..');
const V280 = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'build.json'), 'utf8'));
const { ink, capital } = MC;
const env = (k, v) => process.env[k] != null ? +process.env[k] : v;

// THE SIZES. frame = the badge's px the drawing's 24 units map to; box = the glyph's own box; off = where the box sits in the frame.
// std: stroke / centred / counter in iPhone px at that size; solidMin: no part thinner than this (iPhone px).
const SIZES = {
  18: { frame: 24, box: 18, std: { stroke: env('S18', 4), centred: env('C18', 4), counter: 3, solidMin: 4 } },
  24: { frame: 32, box: 24, std: { stroke: env('S24', 6), centred: env('C24', 6), counter: 4, solidMin: 5 } },
  12: { frame: 16, box: 12, std: { stroke: env('S12', 3), centred: env('C12', 4), counter: 3, solidMin: 3, close: true } },
};

// Every icon is the v264 drawing (the same roots, joins, rounds and bevels; svg/post-line, svg/placement), fitted to each size's
// grid. Where v264's own numbers fall off the grid, the parts are set on it from the same root calls (museum, fork); the rest are
// landed from the v264 outline by one-side.js.

// THE MUSEUM (v264): columns under a beam and plinth whose ends drop into the outer columns (the bevel: capital()), a pediment.
// A row of equal parts: columns and openings share one width. 18 and 24: four columns, three openings; 12: three and two (less
// detail). Numbers per size in that size's CSS px (frame = the badge), converted to drawing units.
const MUS = {
  18: { n: 4, w: 4 / 3, over: 2 / 3, step: 0.5, c: 12, peak: 7 + 2 / 3, eave: 9 + 1 / 3, base: 10 + 1 / 3, bt: 11 + 1 / 3, bu: 12 + 2 / 3, pt: 15 + 2 / 3, pb: 17 },
  24: { n: 4, w: 2, over: 2 / 3, step: 2 / 3, c: 16, peak: 5 + 2 / 3, eave: 8, base: 9 + 1 / 3, bt: 10 + 2 / 3, bu: 12 + 2 / 3, pt: 16 + 2 / 3, pb: 18 + 2 / 3 },
  12: { n: 3, w: 4 / 3, over: 1 / 3, step: 1 / 3, c: 8, peak: 5 + 1 / 3, eave: 6 + 1 / 3, base: 7, bt: 7 + 2 / 3, bu: 8 + 2 / 3, pt: 10 + 2 / 3, pb: 11 + 2 / 3 },
};
function museumV(J) {
  const M = MUS[J.size], u = 24 / SIZES[J.size].frame, U = v => v * u;   // css px -> units
  const span = (2 * M.n - 1) * M.w, b0 = M.c - span / 2 - M.over, b1 = M.c + span / 2 + M.over;
  const xs = Array.from({ length: M.n }, (_, i) => M.c - span / 2 + 2 * i * M.w);
  const roots = [ink('slab', E.D(`M${U(b0)},${U(M.base)}V${U(M.eave)}L${U(M.c)},${U(M.peak)}L${U(b1)},${U(M.eave)}V${U(M.base)}Z`)),
    ink('slab', E.R(U(b0), U(M.bt), U(b1 - b0), U(M.bu - M.bt))), ink('slab', E.R(U(b0), U(M.pt), U(b1 - b0), U(M.pb - M.pt))),
    ...xs.map(x => ink('post', E.R(U(x), U(M.bu) - 0.01, U(M.w), U(M.pt - M.bu) + 0.02)))];
  const cuts = [];
  for (const [face, end, side] of [[xs[0], b0, -1], [xs[M.n - 1] + M.w, b1, 1]])
    for (const [under, down] of [[M.bu, true], [M.pt, false]]) { const [bb, c] = capital(U(face), U(end), U(under), U(M.step), side, down); roots.push(bb); cuts.push(c.cutPrim); }
  return { roots, cuts, sym: U(M.c) };
}
MC.ICONS.museumV = museumV;

// THE FORK AND KNIFE (v264): three tines over a bowl into a neck; a knife whose blade curves out past its handle. A row of equal
// parts: tines and the gaps between them share one width (the neck and the knife's handle take it too).
const FORK = {
  18: { w: 4 / 3, cut: 2 / 3, kw: 8 / 3, x0: 7, top: 6 + 2 / 3, bot: 17 + 1 / 3, tine: 3, ry: 2.75, blade: 6 },
  24: { w: 5 / 3, cut: 1, kw: 10 / 3, x0: 9 + 2 / 3, top: 9, bot: 23, tine: 4, ry: 3 + 2 / 3, blade: 8 },
  12: { w: 1, cut: 2 / 3, kw: 5 / 3, x0: 4 + 1 / 3, top: 4 + 1 / 3, bot: 11 + 2 / 3, tine: 2, ry: 11 / 6, blade: 4 },
};
function restaurantV(J) {
  const F = FORK[J.size], u = 24 / SIZES[J.size].frame, U = v => v * u, K = 0.5523;
  const w = U(F.w), x0 = U(F.x0), top = U(F.top), bot = U(F.bot), fw = 5 * w, fcx = x0 + fw / 2, hc = top + U(F.tine), roots = [];
  for (let i = 0; i < 3; i++) roots.push(ink('post', E.R(x0 + 2 * i * w, top, w, hc - 0.1 - top)));
  { const rx = fw / 2, ry = U(F.ry); roots.push(ink('mass', E.D(`M${fcx - rx} ${hc - 0.3}V${hc}C${fcx - rx} ${hc + ry * K} ${fcx - rx * K} ${hc + ry} ${fcx} ${hc + ry}C${fcx + rx * K} ${hc + ry} ${fcx + rx} ${hc + ry * K} ${fcx + rx} ${hc}V${hc - 0.3}Z`)));
    const hb = hc + ry - 0.4; roots.push(ink('post', E.R(fcx - w / 2, hb, w, bot - hb))); }
  const ks = x0 + fw + U(F.cut), kw = U(F.kw), ke = top + U(F.blade), ry = ke - top;
  roots.push(ink('mass', E.D(`M${ks} ${top}C${ks + kw * K} ${top} ${ks + kw} ${ke - ry * K} ${ks + kw} ${ke}H${ks}Z`)));
  roots.push(ink('post', E.R(ks, ke - 0.2, w, bot - ke + 0.2)));
  return { roots, cuts: [] };
}
MC.ICONS.restaurantV = restaurantV;

// the set. d(size) = the drawing for that size (units); std = per-size overrides of the size's standard; keep: no width standard
// (the parts are already set on the grid, equal where they must be)
const V264 = n => V280[n].before;
const SET = {
  cafe: { sym: null, d: () => V264('cafe') },
  // the coupe's band stays thin under the rim, over a deep drink (v264): its counter minimum is 2/3px at 18 and 12, 1px at 24
  bar: { sym: 12, d: () => V264('bar'), std: { 18: { counter: 2 }, 24: { counter: 3 }, 12: { counter: 2, close: false } } },
  museum: { sym: 12, keep: true, d: s => MC.buildIcon('museumV', { size: s }).d },
  nature: { sym: 12, d: () => V264('nature') },
  restaurant: { sym: null, keep: true, d: s => MC.buildIcon('restaurantV', { size: s }).d },
};

// ---- path transform (units -> the box's CSS px)
function xformD(d, k, t) {
  const f = v => +(v * k - t).toFixed(5), p = q => `${f(q[0])} ${f(q[1])}`;
  return parse(d).map(segs => 'M' + p(segs[0].P[0]) + segs.map(s => s.k === 'L' ? 'L' + p(s.P[3]) : 'C' + p(s.P[1]) + ' ' + p(s.P[2]) + ' ' + p(s.P[3])).join('') + 'Z').join('');
}
function build(n, size) {
  const Z = SIZES[size], d0 = SET[n].d(size), sym = SET[n].sym;
  const std = SET[n].keep ? { counter: 0 } : { ...Z.std, ...((SET[n].std || {})[size] || {}) };
  const L = OS.land(d0, { size: Z.frame, sym, std });
  const k = Z.frame / 24, t = (Z.frame - Z.box) / 2;
  return { d: xformD(L.d, k, t), units: L.d, maxMove: +L.maxMove.toFixed(3), opened: L.opened };
}

// THE STAR: one drawing, 18 box, bare (row and tag): the star at its own size (12 tall), 1:1, centred on the box's 9, 9; its
// outline 1 1/3 (4 iPhone px).
function star() {
  const L = OS.land(V280.star.drawn, { size: 24, sym: 12, std: { stroke: env('SST', 4), centred: 4, counter: 3, solidMin: 4 } });
  return { d: xformD(L.d, 1, 3), units: L.d };
}
// THE +: drawn 1:1 in its 60px button, centre 30 (a whole px). Two strokes, an even count of iPhone px, so both sides land; arms
// equal and a whole px long; ends square with a 1/3 round (the machined corner).
function plus() {
  const w = env('PW', 2), span = env('PSPAN', 14), c = 30, a = c - span / 2, b = c - w / 2, r = 1 / 3;
  const paper = require(path.join(process.env.TOOLS, 'node_modules/paper/dist/paper-core.js')); paper.setup(new paper.Size(60, 60));
  const R = (x, y, W, H) => new paper.Path.Rectangle({ point: [x, y], size: [W, H], radius: r });
  const u = R(b, a, w, span).unite(R(a, b, span, w));
  return { d: u.pathData, w, span };
}

module.exports = { SIZES, SET, build, star, plus, xformD };
if (require.main === module) {
  const out = path.join(ROOT, 'svg', 'right'); fs.mkdirSync(out, { recursive: true });
  const jf = path.join(out, 'build.json'), all = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, 'utf8')) : {};
  const names = process.argv.slice(2).length ? process.argv.slice(2) : [...Object.keys(SET), 'star', 'plus'];
  const svg = (s, d) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><path fill-rule="evenodd" d="${d}"/></svg>\n`;
  for (const n of names) {
    const t0 = Date.now();
    if (n === 'star') { const r = star(); all.star = { sizes: { 18: r } }; fs.writeFileSync(path.join(out, 'star-18.svg'), svg(18, r.d)); }
    else if (n === 'plus') { const r = plus(); all.plus = { sizes: { 60: r } }; fs.writeFileSync(path.join(out, 'plus-60.svg'), svg(60, r.d)); }
    else {
      all[n] = { sizes: {} };
      for (const size of [18, 24, 12]) { const r = build(n, size); all[n].sizes[size] = r; fs.writeFileSync(path.join(out, `${n}-${size}.svg`), svg(size, r.d)); }
    }
    fs.writeFileSync(jf, JSON.stringify(all));
    console.log(n, `${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
}
