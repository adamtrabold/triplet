// local look sheet: node src/right-sheet.js <out.html> [scale]   (true size rows, then the same SVGs scaled as vector)
'use strict';
const fs = require('fs');
const C = require('./right-cells.js');
const sc = +(process.argv[3] || 1);
const row = (lab, html, gap = 8) => `<div style="display:flex;align-items:center;gap:12px;margin:6px 0"><div style="width:110px;font:11px sans-serif">${lab}</div><div style="display:flex;align-items:center;gap:${gap}px">${html}</div></div>`;
let h = `<body style="margin:0;padding:8px;background:${C.PAPER}">`;
for (const set of ['v280', 'now']) {
  h += row(`${set} 18`, C.BADGE.map(n => C.badge(set, n, 18)).join('') + C.star(set));
  h += row(`${set} 24 sel`, C.BADGE.map(n => C.badge(set, n, 24)).join(''));
  h += row(`${set} 12`, C.BADGE.map(n => C.chip(set, n)).join(''));
  h += row(`${set} +`, C.plus(set));
}
for (const set of ['v280', 'now']) {
  h += row(`${set} 18 x${sc}`, C.BADGE.map(n => C.badge(set, n, 18, sc)).join('') + C.star(set, sc), 8 * sc);
  h += row(`${set} 12 x${sc}`, C.BADGE.map(n => C.chip(set, n, sc)).join(''), 8 * sc);
}
fs.writeFileSync(process.argv[2], h + '</body>');
