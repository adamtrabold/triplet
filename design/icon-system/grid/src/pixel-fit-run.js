// Runs the pixel fit on the approved six (paths copied from the live Now board, simplify/boards/Grid7Now.dc.html) and
// measures before and after.  node src/pixel-fit-run.js [tie=up|down]
//   -> svg/pixelfit/<icon>-<size>@<dpr>x.svg (fitted), svg/pixelfit/measure.json, a table on stdout
// Checks run on every fitted outline: fair-check, join-check (the kink check), and a jitter run of the fit itself (the input
// nudged by up to 0.02px, 30 times: does any fitted edge land somewhere else?).
'use strict';
const fs = require('fs'), path = require('path');
const pf = require('./pixel-fit.js'), fair = require('./fair-check.js'), join = require('./join-check.js');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'svg', 'pixelfit');
const tie = process.argv[2] || 'rank';
fs.mkdirSync(OUT, { recursive: true });

const now = fs.readFileSync(path.join(ROOT, 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8');
const SIX = {};
for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!SIX[m[1]]) SIX[m[1]] = m[2];
const NAMES = ['Café', 'Bar', 'Museum', 'Nature', 'Star', 'Add'];
const ID = { 'Café': 'cafe', Bar: 'bar', Museum: 'museum', Nature: 'nature', Star: 'star', Add: 'plus' };
const SIZES = [12, 18, 23, 24, 72], DPRS = [2, 3], OFF = 0.1;   // an edge more than 1/10 device px off a whole pixel is soft

const stat = (d, size, dpr) => {
  const core = pf.edges(d, size, dpr);
  const soft = core.filter(e => e.off > OFF);
  return { n: core.length, soft: soft.length, mean: core.reduce((s, e) => s + e.off, 0) / Math.max(1, core.length), worst: soft.sort((a, b) => b.off - a.off) };
};

// jitter: nudge the whole input (translate) and its scale by up to 0.02px; the fitted edges should be the same set
function nudge(d, dx, dy, ds) { return d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (m, a, b) => `${(12 + (+a - 12) * (1 + ds) + dx).toFixed(7)} ${(12 + (+b - 12) * (1 + ds) + dy).toFixed(7)}`); }
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;
const sig = r => [...r.x.pts.map(p => 'x' + p.n.toFixed(3)), ...r.y.pts.map(p => 'y' + p.n.toFixed(3))].join(',');
// the shape alone: each axis's fitted edges relative to its first, in device px (a flip that only moves the whole glyph by whole
// device pixels keeps this)
const shape = (r, k) => ['x', 'y'].map(a => r[a].pts.map(p => Math.round((p.n - r[a].pts[0].n) * k)).join(' ')).join('|');

const res = { tie, sizes: SIZES, dprs: DPRS, icons: {} };
const rows = [];
for (const n of NAMES) {
  const d = SIX[n], c0 = pf.centroid(d), out = res.icons[n] = {};
  for (const size of SIZES) for (const dpr of DPRS) {
    const before = stat(d, size, dpr), F = pf.fit(d, { size, dpr, tie }), after = stat(F.d, size, dpr), c1 = pf.centroid(F.d);
    const fa = fair.check(F.d), jo = join.check(F.d);
    let flips = 0, shapeFlips = 0; const base = sig(F), baseShape = shape(F, F.k);
    for (let t = 0; t < 30; t++) { const G = pf.fit(nudge(d, 0.02 * rnd(), 0.02 * rnd(), 0.02 / 12 * rnd()), { size, dpr, tie }); if (sig(G) !== base) flips++; if (shape(G, G.k) !== baseShape) shapeFlips++; }
    const key = `${size}@${dpr}x`;
    out[key] = {
      before: { n: before.n, soft: before.soft, mean: +before.mean.toFixed(3) }, after: { n: after.n, soft: after.soft, mean: +after.mean.toFixed(3) },
      maxMovePx: +(F.maxMove).toFixed(3), maxMoveDev: +(F.maxMove * F.k).toFixed(2),
      centreShiftPx: +Math.hypot(c1.cx - c0.cx, c1.cy - c0.cy).toFixed(3), areaChange: +((c1.area / c0.area - 1) * 100).toFixed(1),
      stems: [...F.x.stems.map(s => ({ ax: 'x', w: +s.w.toFixed(3), dev: s.W })), ...F.y.stems.map(s => ({ ax: 'y', w: +s.w.toFixed(3), dev: s.W }))],
      worst: before.worst.slice(0, 4).map(e => ({ ax: e.ax, pos: +e.pos.toFixed(3), role: e.role, off: +e.off.toFixed(2) })),
      fair: fa.length, join: jo.length, jitterFlips: flips, jitterShapeFlips: shapeFlips,
    };
    fs.writeFileSync(path.join(OUT, `${ID[n]}-${size}@${dpr}x.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${F.d}"/></svg>\n`);
    rows.push([n, key, before.n, before.soft, before.mean.toFixed(2), after.soft, after.mean.toFixed(2), (F.maxMove * F.k).toFixed(2), out[key].centreShiftPx, out[key].areaChange, fa.length, jo.length, flips, shapeFlips].join('\t'));
  }
}
fs.writeFileSync(path.join(OUT, `measure-${tie}.json`), JSON.stringify(res, null, 1));
console.log(['icon', 'at', 'edges', 'soft', 'mean', 'soft after', 'mean after', 'max move dev', 'centre px', 'area %', 'fair', 'join', 'jitter flips/30', 'shape flips/30'].join('\t'));
console.log(rows.join('\n'));
