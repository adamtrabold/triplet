// "The grid" board, back to the drawings (10-27): drawn from svg/back/build.json and check.json and the true-size images in
// stills/back/board. Plain directives only.
//   node src/back-board.js <out.dc.html> [blobs.json]   blobs.json maps each image to its uploaded url (the canvas); without it
//   the images are embedded (for the local phone stills)
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), B = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'build.json'), 'utf8'));
const CK = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'check.json'), 'utf8'));
const OUT = process.argv[2], BLOB = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : null;
const NAVY = '#12293F', DEEP = '#A8400C', ORANGE = '#EE7434', GREY = '#5A564C', RULE = '#D8CEBA', PAPER = '#FAF5EA', FIELD = '#F2EBDD';
const W = 1200, SC = 1.25;   // images are made for a 1.25x still: one image pixel per still pixel
const img = (f, alt) => { const p = path.join(ROOT, 'stills', 'back', 'board', f), b = fs.readFileSync(p), w = b.readUInt32BE(16), h = b.readUInt32BE(20);
  return `<img src="${BLOB ? BLOB[f] : `data:image/png;base64,${b.toString('base64')}`}" alt="${alt}" width="${Math.round(w / SC)}" height="${Math.round(h / SC)}" style="display:block;image-rendering:pixelated">`; };
const T = (s, o = {}) => `<p style="margin:${o.m || '0 0 8px'};font-size:${o.size || 17}px;line-height:1.4;color:${o.color || '#1A1A18'}">${s}</p>`;
const H2 = (n, s) => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${GREY};text-transform:uppercase;margin:22px 0 8px">${n} · ${s}</div>`;
const pair = (k, alt, lab = true) => lab ? `<div style="display:grid;grid-template-columns:44px 1fr;gap:6px 12px;align-items:center">
<div style="font-size:14px;font-weight:700;color:${GREY}">v264</div>${img(`before-${k}.png`, `${alt}, v264`)}
<div style="font-size:14px;font-weight:700;color:${NAVY}">Now</div>${img(`after-${k}.png`, `${alt}, now`)}</div>` : `<div style="display:grid;gap:6px">${img(`before-${k}.png`, `${alt}, v264`)}${img(`after-${k}.png`, `${alt}, now`)}</div>`;

// the rules, as directives
const RULES = [
  ['The grid is one iPhone pixel, ⅓px.', 'Each icon is built for the size it ships at, so it lands there by construction.'],
  ['Outer edges on the grid.', 'Straight outer edges and big curves\' extremes, to the nearest iPhone pixel: at most half a pixel (⅙px at 24).'],
  ['One side of every stroke on the grid: the outer side.', 'Strokes stay 1½px at 24. The inner side falls where the width puts it.'],
  ['Inner edges, counters and cut-outs follow the drawing.', 'Counters at least 1px (⅔px at 12). A short one opens by moving the stroke, never the mass; at 12 it closes.'],
  ['Centred stays centred. Curves, diagonals, points and rounds are never snapped.', 'They ride on the edges either side.'],
  ['Each size is its own standard.', 'At 18 (the app\'s badge) and 12 (the chip) every width is whole iPhone pixels: stroke 1px and ⅔px, other parts rounded.'],
];
const rules = RULES.map(([a, b], i) => `<div style="display:grid;grid-template-columns:26px 1fr;gap:6px;padding:6px 0;border-top:1px solid ${RULE}"><div style="font-size:19px;font-weight:700;color:${ORANGE}">${i + 1}</div><div style="font-size:17px;line-height:1.35"><b style="color:${NAVY}">${a}</b> <span style="color:${GREY}">${b}</span></div></div>`).join('');

// what changed, per icon
const pct = k => { const v = CK[k].ink.pct; return `${v > 0 ? '+' : ''}${v}%`; };
const CHANGED = [
  ['Café', 'The drawing as approved. Landed only.', pct('cafe-24')],
  ['Coupe', 'The band opens ¾ → 1px by lifting the rim ¼px; the drink stays 2½. At 12 the band closes: a full glass.', pct('bar-24')],
  ['Museum', 'Three 2px columns, two 1.4px openings (were four columns, ¾px openings): columns outweigh openings, as v264\'s temple did. Same box, slabs, roof and capitals.', pct('museum-24')],
  ['Tree', 'Unchanged. Landed.', pct('nature-24')],
  ['Fork and knife', 'Gaps between the tines 1px (were ¾). The knife\'s edge 1¼px past its handle (was ¾).', pct('restaurant-24')],
  ['Star', 'One drawing, 12px tall, in the row and on the tag. Bare, never in a ring.', pct('star-24')],
  ['+', 'Strokes 1½px (were 1⅔), arms equal, 13½ across. Dead centre in its button.', pct('plus-24')],
];
const changed = `<table style="border-collapse:collapse;width:100%;font-size:16px;line-height:1.35">${CHANGED.map(([a, b, c]) => `<tr style="border-top:1px solid ${RULE}"><td style="padding:7px 12px 7px 0;font-weight:700;color:${NAVY};white-space:nowrap;vertical-align:top">${a}</td><td style="padding:7px 12px 7px 0">${b}</td><td style="padding:7px 0;color:${GREY};white-space:nowrap;vertical-align:top;text-align:right">ink ${c}</td></tr>`).join('')}</table>`;

// drawn large on the iPhone grid
let grid = ''; for (let i = 12; i <= 60; i++) { const v = i / 3, c = i % 3 ? '#E8DFD0' : '#CDBFA8'; grid += `<line x1="${v}" y1="4" x2="${v}" y2="20" stroke="${c}" stroke-width="0.025"/><line x1="4" y1="${v}" x2="20" y2="${v}" stroke="${c}" stroke-width="0.025"/>`; }
const big = d => `<svg width="112" height="112" viewBox="4 4 16 16" style="display:block;background:${FIELD}">${grid}<path fill="${NAVY}" fill-rule="evenodd" d="${d}"/></svg>`;
const BIG = ['cafe', 'bar', 'museum', 'nature', 'restaurant'];
const bigRows = `<div style="display:grid;grid-template-columns:44px repeat(5,112px);gap:8px 12px;align-items:center">
<div style="font-size:14px;font-weight:700;color:${GREY}">v264</div>${BIG.map(n => big(B[n].before)).join('')}
<div style="font-size:14px;font-weight:700;color:${NAVY}">Now</div>${BIG.map(n => big(B[n].sizes[24].d)).join('')}</div>`;

// the check, summed over the badge icons and marks at 24
const sum = (size, set) => { const t = {}; for (const [k, r] of Object.entries(CK)) { if (!k.endsWith(`-${size}`)) continue; for (const [kk, v] of Object.entries(r[set])) { t[kk] = t[kk] || [0, 0]; t[kk][0] += v[0]; t[kk][1] += v[1]; } } return t; };
const KIND = [['outer', 'Outer edges'], ['outer (free post)', 'Free posts (one side each)'], ['stroke side', 'Stroke inner sides'], ['centred', 'Centred parts'], ['inner', 'Inner edges']];
const cellOf = (t, k) => t[k] ? `${t[k][1]} of ${t[k][0]}` : '·';
const checkTable = size => { const a3 = sum(size, 'after3'), b3 = sum(size, 'before3'), a2 = sum(size, 'after2');
  return `<table style="border-collapse:collapse;width:100%;font-size:15px;line-height:1.3"><tr style="color:${GREY};font-weight:700"><td style="padding:4px 8px 4px 0">${size}px</td><td style="padding:4px 8px">iPhone now</td><td style="padding:4px 8px">iPhone v264</td><td style="padding:4px 0 4px 8px">5K now</td></tr>${KIND.map(([k, l]) => `<tr style="border-top:1px solid ${RULE}"><td style="padding:4px 8px 4px 0;color:${NAVY};font-weight:600">${l}</td><td style="padding:4px 8px;font-weight:700">${cellOf(a3, k)}</td><td style="padding:4px 8px">${cellOf(b3, k)}</td><td style="padding:4px 0 4px 8px">${cellOf(a2, k)}</td></tr>`).join('')}</table>`; };

const html = `<!doctype html>
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
<div style="width:${W}px;box-sizing:border-box;padding:22px 36px 6px;background:${PAPER};font-family:Archivo,Arial,sans-serif;color:#1A1A18">
<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:${DEEP};text-transform:uppercase">Icon grid · back to the drawings</div>
<h1 style="margin:6px 0 10px;font-size:40px;line-height:1.1;color:${NAVY}">The grid</h1>
${T(`The v264 drawings, built for the iPhone. <b>One side of every stroke on its pixels, outer edges on its pixels, everything else as drawn.</b> One answer per icon.`, { size: 20 })}
${H2(1, 'The rules')}
${rules}
${H2(2, 'iPhone, true size')}
${T('One block per iPhone pixel. v264 above, now below.', { size: 15, color: GREY })}
${pair('24-3x', 'the set at 24 on an iPhone')}
${H2(3, 'In the app: the badge at 18 and the chip at 12')}
<div style="display:flex;gap:16px;align-items:start">${pair('18-3x', 'the badge glyph at 18 on an iPhone')}${pair('12-3x', 'the chip glyph at 12 on an iPhone', false)}</div>
${H2(4, 'The + in its button, and the 5K')}
<div style="display:flex;gap:24px;align-items:start"><div><div style="display:flex;gap:8px">${img('before-button-3x.png', 'the + in its button, v264')}${img('after-button-3x.png', 'the + in its button, now')}</div>${T('iPhone. Left v264, right now.', { size: 15, color: GREY, m: '6px 0 0' })}</div><div>${pair('24-2x', 'the set at 24 on the 5K')}${T('The 5K is a check, not the target: it lands where its ½px meets the ⅓px grid, about as sharp as v264.', { size: 15, color: GREY, m: '6px 0 0' })}</div></div>
${H2(5, 'What changed from v264')}
${changed}
${H2(6, 'Drawn large, on the iPhone grid (dark lines every px, light every iPhone pixel)')}
${bigRows}
${H2(7, 'Which edges land (information, not the goal)')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">${checkTable(24)}${checkTable(18)}</div>
${T('Stroke inner sides at 24 sit ½ an iPhone pixel off by design (1½px is 4½ iPhone pixels). The star has no straight edge; it is landed by its height.', { size: 15, color: GREY, m: '8px 0 0' })}
${H2(8, 'Retired')}
${T('Whole-pixel parts everywhere, the box limits and the give order (v266 to v274). Kept from them: counters at least 1px, the knife\'s edge, one star.', { size: 16 })}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W},"height":${process.env.BOARD_H || 2300}}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`;
fs.writeFileSync(OUT, html);
console.log('board', OUT, html.length);
