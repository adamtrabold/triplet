// THE CHECK (information, not a goal): for each icon and size, which core edges land on a device pixel, by kind, on the iPhone
// (3x) and the 5K (2x), v264 beside the new build; and the ink against v264.
//   node src/back-check.js            -> a table; svg/back/check.json
'use strict';
const fs = require('fs'), path = require('path'), OS = require('./one-side.js');
const ROOT = path.join(__dirname, '..'), B = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'build.json'), 'utf8'));
const KINDS = ['outer', 'outer (free post)', 'stroke side', 'centred', 'inner'];
const tally = rows => { const t = {}; for (const r of rows) { const k = r.kind === 'inner (lands)' ? 'inner' : r.kind; t[k] = t[k] || [0, 0]; t[k][0]++; if (r.lands) t[k][1]++; } return t; };
const fmt = t => KINDS.filter(k => t[k]).map(k => `${k} ${t[k][1]}/${t[k][0]}`).join(', ');
const out = {};
for (const [n, r] of Object.entries(B)) for (const [size, s] of Object.entries(r.sizes)) {
  const row = {};
  for (const dpr of [3, 2]) {
    row[`before${dpr}`] = tally(OS.report(r.before, +size, dpr, r.sym, r.symY));
    row[`after${dpr}`] = tally(OS.report(s.d, +size, dpr, s.sym ?? r.sym, r.symY));
  }
  const sc = { star: (20 / 24) ** 2, plus: 1.1 ** 2 }[n] || 1, ib = +(r.inkBefore * sc).toFixed(1);   // v264's marks were shown at their slot (star 20, + 26.4)
  row.ink = { v264: ib, now: s.ink, pct: +((s.ink / ib - 1) * 100).toFixed(1) };
  row.maxMove = s.maxMove; row.opened = s.opened;
  out[`${n}-${size}`] = row;
  console.log(`${n} ${size}  iPhone: ${fmt(row.after3)}  |  5K: ${fmt(row.after2)}  |  v264 iPhone: ${fmt(row.before3)}  |  ink ${row.ink.pct}%  move ${s.maxMove}`);
}
fs.writeFileSync(path.join(ROOT, 'svg', 'back', 'check.json'), JSON.stringify(out, null, 1));
