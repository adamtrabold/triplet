// "The grid" board: drawn from svg/back/build.json and check.json and the true-size images in stills/back/board. "Before" is the
// last board's build (v277). Plain directives only.
//   node src/back-board.js <out.dc.html> [blobs.json]   blobs.json maps each image to its uploaded url (the canvas); without it
//   the images are embedded (for the local phone stills)
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CK = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'check.json'), 'utf8'));
const OUT = process.argv[2], BLOB = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], 'utf8')) : null;
const NAVY = '#12293F', DEEP = '#A8400C', ORANGE = '#EE7434', GREY = '#5A564C', RULE = '#D8CEBA', PAPER = '#FAF5EA';
const W = 1200, SC = 1.25, BEFORE = 'v277';   // images are made for a 1.25x still: one image pixel per still pixel
const img = (f, alt) => { const p = path.join(ROOT, 'stills', 'back', 'board', f), b = fs.readFileSync(p), w = b.readUInt32BE(16), h = b.readUInt32BE(20);
  return `<img src="${BLOB ? BLOB[f] : `data:image/png;base64,${b.toString('base64')}`}" alt="${alt}" width="${Math.round(w / SC)}" height="${Math.round(h / SC)}" style="display:block;image-rendering:pixelated">`; };
const T = (s, o = {}) => `<p style="margin:${o.m || '0 0 8px'};font-size:${o.size || 17}px;line-height:1.4;color:${o.color || '#1A1A18'}">${s}</p>`;
const H2 = (n, s) => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${GREY};text-transform:uppercase;margin:22px 0 8px">${n} · ${s}</div>`;
const lab = (s, c = GREY) => `<div style="font-size:14px;font-weight:700;color:${c}">${s}</div>`;
const pair = (k, alt, labels = true) => labels ? `<div style="display:grid;grid-template-columns:44px auto;gap:6px 12px;align-items:center;justify-content:start">
${lab(BEFORE)}${img(`before-${k}.png`, `${alt}, ${BEFORE}`)}${lab('Now', NAVY)}${img(`after-${k}.png`, `${alt}, now`)}</div>` : `<div style="display:grid;gap:6px">${img(`before-${k}.png`, `${alt}, ${BEFORE}`)}${img(`after-${k}.png`, `${alt}, now`)}</div>`;

// the rules, as directives
const RULES = [
  ['The grid is one iPhone pixel, ⅓px.', 'Each icon is built for the size it ships at, so it lands there by construction.'],
  ['The silhouette first.', 'Outer edges to a whole px when one is within ¼px (sharp on both screens), else the nearest iPhone pixel.'],
  ['Two outer sides: one lands fully.', 'The side that reaches a whole px, else the longer one; the width places the other.'],
  ['Then the stroke.', 'A stroke\'s outer side lands and its width is kept. Inner edges, counters and cut-outs stay as drawn.'],
  ['Centred stays centred.', 'A centred part takes an even count of iPhone pixels at every size, so both sides land; the centre never moves.'],
  ['Curves, diagonals, points and rounds are never snapped.', 'They ride on the edges either side.'],
  ['Each size is its own standard.', 'At 18 (the app\'s badge) and 12 (the chip) every width is whole iPhone pixels. Counters at least 1px (⅔px at 12).'],
  ['Weight by eye.', 'Strokes 1½px. Posts, stems and columns take the width that reads right: 1¼ or 1½. The ring: 1¼px at 24, 1½px on the app\'s badge.'],
];
const rules = RULES.map(([a, b], i) => `<div style="display:grid;grid-template-columns:26px 1fr;gap:6px;padding:6px 0;border-top:1px solid ${RULE}"><div style="font-size:19px;font-weight:700;color:${ORANGE}">${i + 1}</div><div style="font-size:17px;line-height:1.35"><b style="color:${NAVY}">${a}</b> <span style="color:${GREY}">${b}</span></div></div>`).join('');

// what changed, per icon
const pct = k => { const v = CK[k].ink.pct; return `ink ${v > 0 ? '+' : ''}${v}%`; };
const CHANGED = [
  ['Café', 'Silhouette landed first.', pct('cafe-24')],
  ['Coupe', 'Stem 1¼px (was 1½); centred, it is 1⅓ at 24 so both sides land.', pct('bar-24')],
  ['Museum', 'Columns 1½px (were 2), openings 1.9: an even colonnade. Plinth bottom now sharp on the 5K.', pct('museum-24')],
  ['Tree', 'Trunk 1¼px (was 1½); 1⅓ at 24, centred.', pct('nature-24')],
  ['Fork and knife', 'Tines, neck and handle 1¼px (were 1½).', pct('restaurant-24')],
  ['Star and +', 'Unchanged and not yet decided. Shown bare at their size in the app: the star in its 24 slot, the + in its button.', ''],
  ['Ring', '1¼px at 24 (was 1½); the app\'s badge rim 1½px (was 2): one weight with the lighter glyphs.', ''],
];
const changed = `<table style="border-collapse:collapse;width:100%;font-size:16px;line-height:1.35">${CHANGED.map(([a, b, c]) => `<tr style="border-top:1px solid ${RULE}"><td style="padding:7px 12px 7px 0;font-weight:700;color:${NAVY};white-space:nowrap;vertical-align:top">${a}</td><td style="padding:7px 12px 7px 0">${b}</td><td style="padding:7px 0;color:${GREY};white-space:nowrap;vertical-align:top;text-align:right">${c}</td></tr>`).join('')}</table>`;

// the silhouette landing, summed over the five badge glyphs
const silSum = (size, set) => { const t = [0, 0, 0]; for (const [k, r] of Object.entries(CK)) if (k.endsWith(`-${size}`) && !/^(star|plus)/.test(k)) r.sil[set].forEach((v, i) => { t[i] += v; }); return t; };
const silTable = `<table style="border-collapse:collapse;font-size:16px;line-height:1.3"><tr style="color:${GREY};font-weight:700"><td style="padding:4px 24px 4px 0">Size</td><td style="padding:4px 24px">iPhone ${BEFORE}</td><td style="padding:4px 24px">iPhone now</td><td style="padding:4px 24px">5K ${BEFORE}</td><td style="padding:4px 0 4px 24px">5K now</td></tr>${[24, 18, 12].map(s => { const b = silSum(s, 'before'), a = silSum(s, 'after');
  return `<tr style="border-top:1px solid ${RULE}"><td style="padding:4px 24px 4px 0;color:${NAVY};font-weight:600">${s}px</td><td style="padding:4px 24px">${b[1]} of ${b[0]}</td><td style="padding:4px 24px;font-weight:700">${a[1]} of ${a[0]}</td><td style="padding:4px 24px">${b[2]} of ${b[0]}</td><td style="padding:4px 0 4px 24px;font-weight:700">${a[2]} of ${a[0]}</td></tr>`; }).join('')}</table>`;

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
<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:${DEEP};text-transform:uppercase">Icon grid</div>
<h1 style="margin:6px 0 10px;font-size:40px;line-height:1.1;color:${NAVY}">The grid</h1>
${T(`The v264 drawings, built for the iPhone. <b>The silhouette lands first, sharpest on both screens.</b> Lighter posts and ring.`, { size: 20 })}
${H2(1, 'The rules')}
${rules}
${H2(2, 'iPhone, true size')}
${T(`One block per iPhone pixel. ${BEFORE} above, now below.`, { size: 15, color: GREY })}
${pair('24-3x', 'the set at 24 on an iPhone')}
${H2(3, 'In the app, iPhone: the badge at 18, the chip at 12, the + in its button')}
<div style="display:flex;gap:22px;align-items:start">${pair('18-3x', 'the badge at 18 on an iPhone')}<div style="display:grid;gap:6px">${pair('12-3x', 'the chip at 12 on an iPhone', false)}${img('after-button-3x.png', 'the + in its button, now')}</div></div>
${H2(4, 'The 5K, same size: 24, the badge and the chip')}
${pair('24-2x', 'the set at 24 on the 5K')}
<div style="display:flex;gap:22px;align-items:start;margin-top:10px">${pair('18-2x', 'the badge at 18 on the 5K')}${pair('12-2x', 'the chip at 12 on the 5K', false)}</div>
${H2(5, `What changed from ${BEFORE}`)}
${changed}
${H2(6, 'Silhouette edges that land, five badge glyphs')}
${silTable}
${T('A whole px lands on both screens. At 18 and 12 an edge more than ¼px from one stays on the iPhone pixel: the shape wins.', { size: 15, color: GREY, m: '8px 0 0' })}
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
