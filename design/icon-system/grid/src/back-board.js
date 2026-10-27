// "The grid" board: every icon is its real SVG, inline, at its true CSS size, drawn by the viewer's own screen. A larger view is
// the same SVG scaled as vector. "Before" is the last board's build (svg/back/v277.json). Plain directives only. No images.
//   node src/back-board.js <out.dc.html>
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', f), 'utf8'));
const B = { before: J('v277.json'), after: J('build.json') }, CK = J('check.json');
const OUT = process.argv[2];
const NAVY = '#12293F', DEEP = '#A8400C', ORANGE = '#EE7434', GREY = '#5A564C', RULE = '#D8CEBA', PAPER = '#FAF5EA', FIELD = '#F2EBDD', CREAM = '#FAF5EA';
const W = 1200, BEFORE = 'v277', GLYPHS = ['cafe', 'bar', 'museum', 'nature', 'restaurant'];
const NAME = { cafe: 'café', bar: 'coupe', museum: 'museum', nature: 'tree', restaurant: 'fork and knife' };
const RING = { before: { 24: 1.5, 18: 2 }, after: { 24: 1.25, 18: 1.5 } };   // the ring around a 24 glyph; the app's 26px badge rim
const T = (s, o = {}) => `<p style="margin:${o.m || '0 0 8px'};font-size:${o.size || 17}px;line-height:1.4;color:${o.color || '#1A1A18'}">${s}</p>`;
const H2 = (n, s) => `<div style="font-size:15px;letter-spacing:.1em;font-weight:700;color:${GREY};text-transform:uppercase;margin:22px 0 8px">${n} · ${s}</div>`;
const d = (set, n, size) => B[set][n].sizes[size].d;
const P = (dd, col = NAVY) => `<path fill="${col}" fill-rule="evenodd" d="${dd}"/>`;
// one icon at a given CSS size: the 24 box scaled to s (true size when s is the size it ships at)
const glyph24 = (set, n, s = 24) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" role="img" aria-label="${NAME[n] || n} at 24, ${set === 'before' ? BEFORE : 'now'}" style="display:block;flex:none"><circle cx="12" cy="12" r="${12 - RING[set][24] / 2}" fill="none" stroke="${NAVY}" stroke-width="${RING[set][24]}"/>${P(d(set, n, 24))}</svg>`;
const badge18 = (set, n) => `<svg width="26" height="26" viewBox="0 0 26 26" role="img" aria-label="${NAME[n]} badge at 18, ${set === 'before' ? BEFORE : 'now'}" style="display:block;flex:none"><circle cx="13" cy="13" r="${13 - RING[set][18] / 2}" fill="${FIELD}" stroke="${NAVY}" stroke-width="${RING[set][18]}"/><svg x="4" y="4" width="18" height="18" viewBox="0 0 24 24">${P(d(set, n, 18))}</svg></svg>`;
const chip12 = (set, n) => `<svg width="12" height="12" viewBox="0 0 24 24" role="img" aria-label="${NAME[n]} chip at 12, ${set === 'before' ? BEFORE : 'now'}" style="display:block;flex:none">${P(d(set, n, 12))}</svg>`;
const star = set => `<svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="star, ${set === 'before' ? BEFORE : 'now'}" style="display:block;flex:none">${P(d(set, 'star', 24))}</svg>`;
// the + in its button: the app's 60px orange disc, the mark's centre on the disc's centre
const button = set => { const c = 12 + 1 / 12, o = 30 - c; return `<svg width="60" height="60" viewBox="0 0 60 60" role="img" aria-label="the + in its button, ${set === 'before' ? BEFORE : 'now'}" style="display:block;flex:none"><circle cx="30" cy="30" r="30" fill="${ORANGE}"/><svg x="${o}" y="${o}" width="24" height="24" viewBox="0 0 24 24">${P(d(set, 'plus', 24), CREAM)}</svg></svg>`; };
const lab = (s, c = GREY) => `<div style="font-size:14px;font-weight:700;color:${c};width:44px;flex:none">${s}</div>`;
const row = (set, inner, gap = 14) => `<div style="display:flex;align-items:center;gap:12px">${lab(set === 'before' ? BEFORE : 'Now', set === 'before' ? GREY : NAVY)}<div style="display:flex;align-items:center;gap:${gap}px;padding:8px 10px;background:${FIELD}">${inner}</div></div>`;
const cap = s => `<div style="font-size:13px;color:${GREY};margin-top:4px">${s}</div>`;
const block = (title, rowsHtml) => `<div><div style="font-size:14px;font-weight:700;color:${NAVY};margin-bottom:6px">${title}</div><div style="display:grid;gap:6px">${rowsHtml}</div></div>`;

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

const pct = k => { const v = CK[k].ink.pct; return `ink ${v > 0 ? '+' : ''}${v}%`; };
const CHANGED = [
  ['Café', 'Silhouette landed first.', pct('cafe-24')],
  ['Coupe', 'Stem 1¼px (was 1½); centred, it is 1⅓ at 24 so both sides land.', pct('bar-24')],
  ['Museum', 'Columns 1½px (were 2), openings 1.9: an even colonnade. Plinth bottom now sharp on the 5K.', pct('museum-24')],
  ['Tree', 'Trunk 1¼px (was 1½); 1⅓ at 24, centred.', pct('nature-24')],
  ['Fork and knife', 'Tines, neck and handle 1¼px (were 1½).', pct('restaurant-24')],
  ['Star and +', 'Unchanged and not yet decided. Shown bare at their size in the app.', ''],
  ['Ring', '1¼px at 24 (was 1½); the app\'s badge rim 1½px (was 2): one weight with the lighter glyphs.', ''],
];
const changed = `<table style="border-collapse:collapse;width:100%;font-size:16px;line-height:1.35">${CHANGED.map(([a, b, c]) => `<tr style="border-top:1px solid ${RULE}"><td style="padding:7px 12px 7px 0;font-weight:700;color:${NAVY};white-space:nowrap;vertical-align:top">${a}</td><td style="padding:7px 12px 7px 0">${b}</td><td style="padding:7px 0;color:${GREY};white-space:nowrap;vertical-align:top;text-align:right">${c}</td></tr>`).join('')}</table>`;

const silSum = (size, set) => { const t = [0, 0, 0]; for (const [k, r] of Object.entries(CK)) if (k.endsWith(`-${size}`) && !/^(star|plus)/.test(k)) r.sil[set].forEach((v, i) => { t[i] += v; }); return t; };
const silTable = `<table style="border-collapse:collapse;font-size:16px;line-height:1.3"><tr style="color:${GREY};font-weight:700"><td style="padding:4px 24px 4px 0">Size</td><td style="padding:4px 24px">iPhone ${BEFORE}</td><td style="padding:4px 24px">iPhone now</td><td style="padding:4px 24px">5K ${BEFORE}</td><td style="padding:4px 0 4px 24px">5K now</td></tr>${[24, 18, 12].map(s => { const b = silSum(s, 'before'), a = silSum(s, 'after');
  return `<tr style="border-top:1px solid ${RULE}"><td style="padding:4px 24px 4px 0;color:${NAVY};font-weight:600">${s}px</td><td style="padding:4px 24px">${b[1]} of ${b[0]}</td><td style="padding:4px 24px;font-weight:700">${a[1]} of ${a[0]}</td><td style="padding:4px 24px">${b[2]} of ${b[0]}</td><td style="padding:4px 0 4px 24px;font-weight:700">${a[2]} of ${a[0]}</td></tr>`; }).join('')}</table>`;

const sets = ['before', 'after'];
const trueSize = `<div style="display:flex;flex-wrap:wrap;gap:22px 40px;align-items:start">
${block('The set at 24, in its ring', sets.map(s => row(s, GLYPHS.map(n => glyph24(s, n)).join(''))).join(''))}
${block('The badge at 18 (26px, in the app)', sets.map(s => row(s, GLYPHS.map(n => badge18(s, n)).join(''), 8)).join(''))}
${block('The chip at 12', sets.map(s => row(s, GLYPHS.map(n => chip12(s, n)).join(''), 10)).join(''))}
${block('The star, bare in its 24 slot: row and tag', sets.map(s => row(s, `${star(s)}<span style="font-size:15px;color:${GREY}">row</span><span style="display:flex;align-items:center;gap:6px;padding:4px 6px;background:${PAPER};border:1px solid ${RULE}">${star(s)}<span style="font-size:15px;color:${GREY}">tag</span></span>`)).join(''))}
${block('The + in its button', `<div style="display:flex;gap:16px;align-items:end">${sets.map(s => `<div>${button(s)}${cap(s === 'before' ? BEFORE : 'Now')}</div>`).join('')}</div>`)}
</div>`;
const big = `<div style="display:grid;gap:10px">${sets.map(s => `<div style="display:flex;align-items:center;gap:12px">${lab(s === 'before' ? BEFORE : 'Now', s === 'before' ? GREY : NAVY)}<div style="display:flex;gap:18px">${GLYPHS.map(n => glyph24(s, n, 72)).join('')}</div></div>`).join('')}</div>`;

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
<div style="width:${W}px;box-sizing:border-box;padding:22px 36px 10px;background:${PAPER};font-family:Archivo,Arial,sans-serif;color:#1A1A18">
<div style="font-size:15px;letter-spacing:.12em;font-weight:700;color:${DEEP};text-transform:uppercase">Icon grid</div>
<h1 style="margin:6px 0 10px;font-size:40px;line-height:1.1;color:${NAVY}">The grid</h1>
${T(`The v264 drawings, built for the iPhone. <b>The silhouette lands first, sharpest on both screens.</b> Lighter posts and ring.`, { size: 20 })}
${H2(1, 'The rules')}
${rules}
${H2(2, 'True size, drawn by your screen')}
${T(`The real icons at the size they ship, ${BEFORE} above, now below. Judge them at 100% zoom.`, { size: 15, color: GREY })}
${trueSize}
${H2(3, 'Larger: the same 24 drawings scaled to 72, as vector')}
${big}
${H2(4, `What changed from ${BEFORE}`)}
${changed}
${H2(5, 'Silhouette edges that land, five badge glyphs')}
${silTable}
${T('A whole px lands on both screens. At 18 and 12 an edge more than ¼px from one stays on the iPhone pixel: the shape wins.', { size: 15, color: GREY, m: '8px 0 0' })}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${W},"height":${process.env.BOARD_H || 2000}}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`;
fs.writeFileSync(OUT, html);
console.log('board', OUT, html.length);
