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

// THE MUSEUM: three columns under open ends. The beam and plinth run a full px past the outer columns, so every column stands
// free under its slab and reads as a column, not a wall; openings (2) wider than the columns (1 1/3). Roof as v264 (18 deg).
function museumOpen(J = {}) {
  const pw = 4 / 3, b0 = 7, b1 = 17, over = J.over ?? 1;
  const roofB = 10, eave = 1, rise = 5 / 3, bt = 11, bu = 12 + 1 / 3, pt = 15 + 2 / 3, pb = 17;
  const xs = [b0 + over, 12 - pw / 2, b1 - over - pw];
  const roots = [ink('slab', E.D(`M${b0},${roofB}v${-eave}l5,${-rise} 5,${rise}v${eave}z`)),
    ink('slab', E.R(b0, bt, b1 - b0, bu - bt)), ink('slab', E.R(b0, pt, b1 - b0, pb - pt)),
    ...xs.map(x => ink('post', E.R(x, bu - 0.01, pw, pt - bu + 0.02)))];
  const cuts = [];
  if (J.caps) for (const [face, end, side] of [[xs[0], b0, -1], [xs[2] + pw, b1, 1]])   // 24: the capitals (detail added)
    for (const [under, down] of [[bu, true], [pt, false]]) { const [bb, c] = capital(face, end, under, 0.5, side, down); roots.push(bb); cuts.push(c.cutPrim); }
  return { roots, cuts, sym: 12 };
}
MC.ICONS.museumOpen = museumOpen;

// the set: the v264 drawings as built for v280 (svg/back/build.json 'drawn'), the museum redrawn; per size the drawing to land
const D = n => V280[n].drawn;
const SET = {
  cafe: { sym: null, d: () => D('cafe') },
  bar: { sym: 12, d: () => D('bar') },
  museum: { sym: 12, d: s => MC.buildIcon('museumOpen', { caps: s === 24 && !!env('CAPS', 0) }).d },
  nature: { sym: 12, d: () => D('nature') },
  restaurant: { sym: null, d: () => D('restaurant') },
};

// ---- path transform (units -> the box's CSS px)
function xformD(d, k, t) {
  const f = v => +(v * k - t).toFixed(5), p = q => `${f(q[0])} ${f(q[1])}`;
  return parse(d).map(segs => 'M' + p(segs[0].P[0]) + segs.map(s => s.k === 'L' ? 'L' + p(s.P[3]) : 'C' + p(s.P[1]) + ' ' + p(s.P[2]) + ' ' + p(s.P[3])).join('') + 'Z').join('');
}
function build(n, size) {
  const Z = SIZES[size], d0 = SET[n].d(size), sym = SET[n].sym;
  const L = OS.land(d0, { size: Z.frame, sym, std: Z.std });
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
