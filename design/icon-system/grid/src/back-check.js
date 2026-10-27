// THE CHECK (information, not a goal): for each icon and size, which edges land on a device pixel, by kind, on the iPhone (3x) and
// the 5K (2x), the last board's build (svg/back/v277.json) beside the build now; the silhouette (every edge facing outside) on its
// own; and the ink against the last board.
//   node src/back-check.js            -> a table; svg/back/check.json
'use strict';
const fs = require('fs'), path = require('path'), OS = require('./one-side.js');
const { findEdges } = require('./pixel-fit.js');
const ROOT = path.join(__dirname, '..'), B = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'build.json'), 'utf8'));
const B4 = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'v277.json'), 'utf8'));
const KINDS = ['outer', 'outer (free post)', 'stroke side', 'centred', 'inner'];
const tally = rows => { const t = {}; for (const r of rows) { const k = r.kind === 'inner (lands)' ? 'inner' : r.kind; t[k] = t[k] || [0, 0]; t[k][0]++; if (r.lands) t[k][1]++; } return t; };
const fmt = t => KINDS.filter(k => t[k]).map(k => `${k} ${t[k][1]}/${t[k][0]}`).join(', ');
// the silhouette: every straight edge or big curve extreme whose empty side is outside the icon; [edges, landing at 3x, at 2x]
function sil(d, size) {
  const E = findEdges(d), out = OS.outside(d), r = [0, 0, 0];
  for (const ax of ['x', 'y']) for (const e of E[ax]) {
    const mid = (e.lo + e.hi) / 2, side = -e.ink * 0.2, p = ax === 'y' ? [mid, e.pos + side] : [e.pos + side, mid];
    if (!out(p[0], p[1])) continue; r[0]++;
    [3, 2].forEach((dpr, i) => { const v = e.pos * size / 24 * dpr; if (Math.abs(v - Math.round(v)) < 0.05) r[i + 1]++; });
  }
  return r;
}
const out = {};
for (const [n, r] of Object.entries(B)) for (const [size, s] of Object.entries(r.sizes)) {
  const b = B4[n].sizes[size], row = {};
  for (const dpr of [3, 2]) {
    row[`before${dpr}`] = tally(OS.report(b.d, +size, dpr, b.sym ?? r.sym, r.symY));
    row[`after${dpr}`] = tally(OS.report(s.d, +size, dpr, s.sym ?? r.sym, r.symY));
  }
  row.sil = { before: sil(b.d, +size), after: sil(s.d, +size) };
  row.ink = { before: b.ink, now: s.ink, pct: +((s.ink / b.ink - 1) * 100).toFixed(1) };
  row.maxMove = s.maxMove; row.opened = s.opened;
  out[`${n}-${size}`] = row;
  const f = a => `${a[1]}/${a[0]} iPhone, ${a[2]}/${a[0]} 5K`;
  console.log(`${n} ${size}  silhouette now ${f(row.sil.after)} (was ${f(row.sil.before)})  |  iPhone: ${fmt(row.after3)}  |  ink ${row.ink.pct}%  move ${s.maxMove}`);
}
fs.writeFileSync(path.join(ROOT, 'svg', 'back', 'check.json'), JSON.stringify(out, null, 1));
