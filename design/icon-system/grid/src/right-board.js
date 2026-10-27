// "The grid" board, right-size round: every icon is its real SVG, inline, at the size the app shows it, drawn by the viewer's
// own screen. v280 beside now. A larger view is the same SVG scaled as vector, labelled. No images.
//   node src/right-board.js <out.dc.html>
'use strict';
const fs = require('fs'), path = require('path');
const C = require('./right-cells.js');
const ROOT = path.join(__dirname, '..');
const GREY_SHARE = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'right', 'grey.json'), 'utf8'));
const OUT = process.argv[2];
const NAVY = '#12293F', DEEP = '#A8400C', ORANGE = '#EE7434', GREY = '#5A564C', RULE = '#D8CEBA', PAPER = '#FAF5EA', FIELD = '#F2EBDD';
const H2 = (n, s) => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${GREY};text-transform:uppercase;margin:26px 0 10px">${n} · ${s}</div>`;
const T = (s, o = {}) => `<p style="margin:${o.m || '0 0 8px'};font-size:${o.size || 17}px;line-height:1.4;color:${o.color || '#1A1A18'}">${s}</p>`;
const lab = (s, c = GREY) => `<div style="font-size:14px;font-weight:700;color:${c};width:52px;flex:none">${s}</div>`;
const row = (set, inner, gap = 14) => `<div style="display:flex;align-items:center;gap:12px">${lab(set === 'v280' ? 'v280' : 'Now', set === 'v280' ? GREY : NAVY)}<div style="display:flex;align-items:center;gap:${gap}px;padding:10px 12px;background:${FIELD}">${inner}</div></div>`;
const block = (title, sub, rowsHtml) => `<div><div style="font-size:15px;font-weight:700;color:${NAVY}">${title}</div><div style="font-size:14px;color:${GREY};margin:2px 0 8px">${sub}</div><div style="display:grid;gap:8px">${rowsHtml}</div></div>`;
// a list row as the app lays it: badge, then the place's name (and the star before the name when starred)
const listRow = (set, n, name, starred) => `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:${FIELD};width:300px">${C.badge(set, n, 18)}${starred ? C.star(set) : ''}<div style="font-size:15px;font-weight:600;color:${NAVY}">${name}</div></div>`;

const gs = (lab, set) => { const g = GREY_SHARE[lab][set]; return `${g.iPhone}% · ${g['5K']}%`; };
const SIZES = [
  ['18', 'Pins and list rows', 'the glyph\'s 18 box in a 24px badge; the icon 10–11px across', '1⅓ (4 iPhone px)', 'badge rim 1⅓', gs('18 badge', 'v280'), gs('18 badge', 'now')],
  ['24', 'The selected pin', 'the 24 box in a 32px badge, ink field', '2 (6 iPhone px); counters open to 1⅓', 'rim 2', gs('24 selected', 'v280'), gs('24 selected', 'now')],
  ['12', 'Filter chips', 'the 12 box, no ring', '1 (3 iPhone px); the coupe\'s band closes', 'none', gs('12 chip', 'v280'), gs('12 chip', 'now')],
  ['star', 'Starred row, the tag', 'one 18 box, bare, 12 tall', 'outline 1⅓', 'never a ring', gs('star 18', 'v280'), gs('star 18', 'now')],
  ['+', 'The add button', 'drawn 1:1 in the 60px button, 14 across', '2 (6 iPhone px)', 'never a ring', gs('+ button', 'v280'), gs('+ button', 'now')],
];
const th = s => `<div style="font-size:13px;font-weight:700;color:${GREY};text-transform:uppercase;letter-spacing:.06em;padding:6px 0">${s}</div>`;
const td = (s, b) => `<div style="font-size:15px;line-height:1.35;padding:7px 0;border-top:1px solid ${RULE};${b ? `font-weight:700;color:${NAVY}` : ''}">${s}</div>`;
const sizeTable = `<div style="display:grid;grid-template-columns:60px 190px 300px 230px 120px 1fr;column-gap:14px">${['Size', 'Where', 'Box', 'Strokes and posts', 'Ring', 'Grey: v280 → now'].map(th).join('')}${SIZES.map(r => [td(r[0], 1), td(r[1]), td(r[2]), td(r[3]), td(r[4]), td(`${r[5]} → <b style="color:${NAVY}">${r[6]}</b>`)].join('')).join('')}</div>`;

const RULES = [
  ['Draw each icon at the size it ships, 1:1.', '18 is the master. 24 and 12 are drawn from it on their own grid: detail added at 24, removed at 12.'],
  ['The grid is one iPhone pixel, ⅓px.', 'Every width is a whole number of iPhone pixels at the size it is drawn.'],
  ['The silhouette first.', 'Outer edges to a whole px when one is within ¼px (sharp on both screens), else the nearest iPhone pixel. Then one side of each stroke.'],
  ['Centred stays centred.', 'A centred part is an even count of iPhone pixels, so both sides land.'],
  ['Curves, diagonals and points are never snapped.', 'They ride on the edges either side.'],
];
const rules = RULES.map(([a, b], i) => `<div style="display:grid;grid-template-columns:26px 1fr;gap:6px;padding:6px 0;border-top:1px solid ${RULE}"><div style="font-size:19px;font-weight:700;color:${ORANGE}">${i + 1}</div><div style="font-size:17px;line-height:1.35"><b style="color:${NAVY}">${a}</b> <span style="color:${GREY}">${b}</span></div></div>`).join('');

const B = C.BADGE;
let h = `<div style="width:1200px;box-sizing:border-box;padding:22px 36px 30px;background:${PAPER};font-family:Archivo,Arial,sans-serif;color:#1A1A18">
<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:${DEEP};text-transform:uppercase">Icon grid</div>
<h1 style="margin:6px 0 10px;font-size:40px;line-height:1.1;color:${NAVY}">The grid</h1>
${T('<b>Every icon drawn at the size the app shows it.</b> 18 is the master: the badge on every pin and row. One drawing per size, each on its own pixel grid. Everything below is the real SVG at its true size, v280 above, now below.', { size: 20 })}
${H2(1, 'At 18, in the 24px badge: pins and rows')}
<div style="display:grid;gap:8px">${row('v280', B.map(n => C.badge('v280', n, 18)).join(''))}${row('now', B.map(n => C.badge('now', n, 18)).join(''))}</div>
${T('Strokes, posts and the ring are all 1⅓px (4 iPhone pixels): the nearest whole-pixel width to 1½. The icon is 10–11px across in its badge, the size you approved on the boards. v280\'s 18 is what the app would show from the 24 drawing scaled down.', { m: '10px 0 0', color: GREY })}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:14px">
${block('In a list row', 'The badge beside the name, as the row lays it out', `${listRow('v280', 'museum', 'Kunstmuseum')}${listRow('now', 'museum', 'Kunstmuseum')}`)}
${block('The museum', 'Three columns under open ends', `<div style="display:flex;gap:16px;align-items:center">${C.badge('now', 'museum', 18)}${C.chip('now', 'museum')}${C.badge('now', 'museum', 24)}</div><div style="font-size:15px;line-height:1.4;color:${GREY}">The beam and plinth run 1px past the outer columns, so all three stand free and read as columns, not walls with windows. Openings 2px, wider than the 1⅓ columns.</div>`)}
</div>
${H2(2, 'At 24 (selected pin), 12 (chips), the star and the +')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
${block('24 · the selected pin', 'The 24 box in its 32px badge, ink field. Strokes 2px; the coupe\'s band opens to 1⅓.', row('v280', B.map(n => C.badge('v280', n, 24)).join(''), 10) + row('now', B.map(n => C.badge('now', n, 24)).join(''), 10))}
${block('12 · the filter chips', 'The 12 box, no ring. Strokes 1px; the coupe\'s band closes (a full glass).', row('v280', B.map(n => C.chip('v280', n)).join(''), 18) + row('now', B.map(n => C.chip('now', n)).join(''), 18))}
${block('The star · 18, bare', 'One drawing for the row and the tag, 12 tall, top and feet on whole px. Not decided.', row('v280', C.star('v280')) + row('now', C.star('now')))}
${block('The + · in its 60px button', 'Drawn 1:1, centred on the button, 14 across, 2px strokes. Not decided.', `<div style="display:flex;gap:16px">${row('v280', C.plus('v280'))}${row('now', C.plus('now'))}</div>`)}
</div>
${H2(3, 'Larger view: the same SVGs scaled ×5 as vector, not the size they ship')}
<div style="display:flex;gap:30px;align-items:center;padding:14px 12px;background:${FIELD}">${B.map(n => C.badge('now', n, 18, 5)).join('')}</div>
<div style="display:flex;gap:44px;align-items:center;padding:14px 12px;background:${FIELD};margin-top:8px">${B.map(n => C.chip('now', n, 5)).join('')}${C.star('now', 5)}</div>
${H2(4, 'The sizes')}
${sizeTable}
${T('Grey = device pixels that are neither paper nor ink, as a share of the icon, iPhone · 5K. Measured from these SVGs, glyph only.', { m: '8px 0 0', size: 14, color: GREY })}
${H2(5, 'The rules')}
${rules}
</div>`;
const shell = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The grid</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">
<style>
body{margin:0}
</style>
</helmet>
${h}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1200,"height":${+(process.env.BOARD_H || 1830)}}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`;
fs.writeFileSync(OUT, shell);
if (process.env.LOCAL) fs.writeFileSync(process.env.LOCAL, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap"><style>body{margin:0}</style></head><body>${h}</body></html>`);
console.log('board', OUT);
