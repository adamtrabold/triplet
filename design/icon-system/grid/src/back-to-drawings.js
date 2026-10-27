// BACK TO THE DRAWINGS (10-27). The set as drawn on v264, built by the engine, then landed on the iPhone's pixels at each size it
// ships (one-side.js: one side of every stroke on the grid, outer edges on the grid, inner edges by the drawing).
// Drawings: the café as approved; the coupe, tree with posts at the line (svg/post-line); the museum with three columns at the
// line (redrawn from the v264 museum's own numbers: same slabs, roof, capitals, overhang and size); the fork and knife with 1px
// gaps and the knife's edge out past its handle by 1 1/4; the star as one drawing, 12 tall; the + in 1 1/2 strokes.
//   node src/back-to-drawings.js [names]   -> svg/back/<name>-<size>.svg, svg/back/build.json   (REUSE=1: land the stored drawings again)
'use strict';
const fs = require('fs'), path = require('path');
process.env.TOOLS = process.env.TOOLS || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/tools';
const E = require('./engine.js'), MC = require('./mix-curves.js'), OS = require('./one-side.js');
const { PROP } = require('./proportions.js'), { fromTable } = require('./laws7.js');
const ROOT = path.join(__dirname, '..'), rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8').match(/ d="([^"]+)"/)[1];
const now = fs.readFileSync(path.join(ROOT, 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8'), A = {};
for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!A[m[1]]) A[m[1]] = m[2];
const { ink, capital, LINE } = MC;

// THE MUSEUM, three columns. The v264 museum's numbers (beam 7.111..16.889, roof, gap 1, beam and plinth 1 1/2, columns 1 1/2 from
// beam to plinth, overhang 1/2) with the middle column on the centre and the outer columns where v264's outer ones stood: two
// openings of 2.14. Same box (9.78 x 9.62).
function museum3() {
  const beam = [7.111, 16.889], bt = 10.976, bu = 12.476, pt = 15.31, pb = 16.81, pw = LINE, over = 0.5, step = 0.5;
  const xs = [beam[0] + over, 12 - pw / 2, beam[1] - over - pw];
  const roots = [ink('slab', E.D('M7.111,9.97633v-1.2l4.889,-1.62933l4.889,1.62933v1.2z')),
    ink('slab', E.R(beam[0], bt, beam[1] - beam[0], bu - bt)), ink('slab', E.R(beam[0], pt, beam[1] - beam[0], pb - pt)),
    ...xs.map(x => ink('post', E.R(x, bu - 0.01, pw, pt - bu + 0.02)))];
  const cuts = [];
  for (const [face, end, side] of [[xs[0], beam[0], -1], [xs[2] + pw, beam[1], 1]])
    for (const [under, down] of [[bu, true], [pt, false]]) { const [b, c] = capital(face, end, under, step, side, down); roots.push(b); cuts.push(c.cutPrim); }
  return { roots, cuts, sym: 12 };
}
// THE FORK AND KNIFE: v264's drawing; the tines' gaps a counter's minimum (1, were 3/4); the knife's edge 1 1/4 past its handle
// (was 3/4: the join's round ate most of it)
function restaurant2() {
  const post = LINE, band = 1, cutW = 2 / 3 * LINE, top = 6.5, bot = 17.5, fw = 3 * post + 2 * band, kw = post + 1.25, K = 0.5523;
  const x0 = 12 - (fw + cutW + kw) / 2, fcx = x0 + fw / 2, hc = top + 3.0, roots = [];
  for (let i = 0; i < 3; i++) { const x = x0 + i * (post + band); roots.push(ink('post', E.R(x, top, post, hc - 0.1 - top))); }
  { const rx = fw / 2, ry = 1.05 * rx; roots.push(ink('mass', E.D(`M${fcx - rx} ${hc - 0.3}V${hc}C${fcx - rx} ${hc + ry * K} ${fcx - rx * K} ${hc + ry} ${fcx} ${hc + ry}C${fcx + rx * K} ${hc + ry} ${fcx + rx} ${hc + ry * K} ${fcx + rx} ${hc}V${hc - 0.3}Z`))); }
  { const hb = hc + 1.05 * fw / 2 - 0.4; roots.push(ink('post', E.R(fcx - post / 2, hb, post, bot - hb))); }
  const ks = x0 + fw + cutW, ke = top + 6, ry = ke - top;
  roots.push(ink('mass', E.D(`M${ks} ${top}C${ks + kw * K} ${top} ${ks + kw} ${ke - ry * K} ${ks + kw} ${ke}H${ks}Z`)));
  roots.push(ink('post', E.R(ks, ke - 0.2, post, bot - ke + 0.2)));
  return { roots, cuts: [] };
}
MC.ICONS.museum3 = museum3; MC.ICONS.restaurant2 = restaurant2;

// THE +: two 1 1/2 strokes, arms equal, 13 1/2 across. Its centre sits 1/12 px past the frame's centre (12 1/12), so one side of each
// stroke and one end of each arm land on an iPhone pixel; the button's centre is put on the mark's centre, so it is dead centre
// in its circle (a circle has no straight edge to show where it sits).
const LINE_LAW = fromTable(PROP.rounds.line);
const JOIN10 = { ease: 2.3, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth', tipKeep: 'crest', tipLand: true, tipPow: 1, tipSoft: PROP.transition.tipSoft, noReverse: true, maxPieces: 2, arcEase: true, arcRamp: 0.3, flareLean: PROP.transition.flareLean };
const PLUS = { stroke: 1.5, span: 13.5, centre: 12 + 1 / 12 };
function plus() { const c = PLUS.centre, s = PLUS.span, w = PLUS.stroke, a = c - s / 2, b = c - w / 2; return E.build([E.R(b, a, w, s), E.R(a, b, s, w)], { law: LINE_LAW, ease: 2.3, join: JOIN10 }).d; }

// the set: [drawing, x symmetry, sizes]
const SET = {
  cafe: () => [A['Café'], null, [24, 18, 12]],
  bar: () => [rd('svg/post-line/bar.svg'), 12, [24, 18, 12]],
  museum: () => [MC.buildIcon('museum3').d, 12, [24, 18, 12]],
  nature: () => [rd('svg/post-line/nature.svg'), 12, [24, 18, 12]],
  restaurant: () => [MC.buildIcon('restaurant2').d, null, [24, 18, 12]],
  star: () => [rd('svg/the-grid/star.svg'), 12, [24]],
  plus: () => [plus(), PLUS.centre, [24], PLUS.centre],
};
// before = v264 as shown
const BEFORE = { cafe: 'svg/placement/cafe.svg', bar: 'svg/post-line/bar.svg', museum: 'svg/post-line/museum.svg', nature: 'svg/post-line/nature.svg', restaurant: 'svg/post-line/restaurant.svg', star: 'svg/placement/star.svg', plus: 'svg/placement/plus.svg' };
module.exports = { SET, BEFORE, PLUS };
if (require.main === module) {
  const out = path.join(ROOT, 'svg', 'back'); fs.mkdirSync(out, { recursive: true });
  const jf = path.join(out, 'build.json'), all = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, 'utf8')) : {};
  const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SET);
  for (const n of names) {
    const t0 = Date.now(), [d0, sym, sizes, symY] = process.env.REUSE && all[n] ? [all[n].drawn, all[n].sym, Object.keys(all[n].sizes).map(Number), all[n].symY ?? undefined] : SET[n](), d = d0, rec = { drawn: d, sym, symY: symY ?? null, inkDrawn: +OS.ink(d).toFixed(1), before: rd(BEFORE[n]), inkBefore: +OS.ink(rd(BEFORE[n])).toFixed(1), sizes: {} };
    for (const size of sizes) {
      const L = OS.land(d, { size, sym, symY: symY ?? null });
      rec.sizes[size] = { d: L.d, maxMove: +L.maxMove.toFixed(3), opened: L.opened, ink: +OS.ink(L.d).toFixed(1), check: { 3: OS.report(L.d, size, 3, sym, symY ?? null), 2: OS.report(L.d, size, 2, sym, symY ?? null) } };
      fs.writeFileSync(path.join(out, `${n}-${size}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${L.d}"/></svg>\n`);
    }
    all[n] = rec; fs.writeFileSync(jf, JSON.stringify(all));
    console.log(n, `${((Date.now() - t0) / 1000).toFixed(0)}s`, 'ink v264', rec.inkBefore, 'drawn', rec.inkDrawn, Object.entries(rec.sizes).map(([s, r]) => `${s}: ink ${r.ink} move ${r.maxMove} opened ${r.opened.length}`).join(' | '));
  }
}
