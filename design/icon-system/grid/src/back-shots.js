// BACK TO THE DRAWINGS: true-size renders. Each row at 1:1 on the app's paper, at 3x (iPhone) and 2x (the 5K), one PNG per row,
// one device pixel per pixel (shown enlarged, pixelated, on the board and the stills).
//   node src/back-shots.js <out dir>   -> <out>/<row>-<dpr>x.png
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.join(__dirname, '..'), OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const B = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'build.json'), 'utf8'));
const NAVY = '#12293F', PAPER = '#F2EBDD', ORANGE = '#EE7434', CREAM = '#FAF5EA';
const BADGE = ['cafe', 'bar', 'museum', 'nature', 'restaurant'], ALL = [...BADGE, 'star', 'plus'];
const P = (d, col = NAVY) => `<path fill="${col}" fill-rule="evenodd" d="${d}"/>`;
// the v264 marks were drawn in a 24 box shown at their slot: the star at 20, the + at 26.4
const beforeScale = { star: 20 / 24, plus: 1.1 };
function cell(n, set, size) {
  const r = B[n], d = set === 'before' ? r.before : r.sizes[size].d, ring = BADGE.includes(n);
  if (size === 24) {
    const s = set === 'before' ? (beforeScale[n] || 1) : 1, w = 24 * s, o = (24 - w) / 2;
    return `<div style="width:24px;height:24px;position:relative;flex:none">${ring ? `<svg width="24" height="24" viewBox="0 0 24 24" style="position:absolute;left:0;top:0"><circle cx="12" cy="12" r="11.25" fill="none" stroke="${NAVY}" stroke-width="1.5"/></svg>` : ''}<svg width="${w}" height="${w}" viewBox="0 0 24 24" style="position:absolute;left:${o}px;top:${o}px">${P(d)}</svg></div>`;
  }
  if (size === 18) // the app's badge: 26 across, a 2px rim, the glyph's 24 box shown at 18
    return `<div style="width:26px;height:26px;position:relative;flex:none"><svg width="26" height="26" viewBox="0 0 26 26" style="position:absolute;left:0;top:0"><circle cx="13" cy="13" r="12" fill="${PAPER}" stroke="${NAVY}" stroke-width="2"/></svg><svg width="18" height="18" viewBox="0 0 24 24" style="position:absolute;left:4px;top:4px">${P(d)}</svg></div>`;
  return `<div style="width:12px;height:12px;position:relative;flex:none"><svg width="12" height="12" viewBox="0 0 24 24" style="position:absolute;left:0;top:0">${P(d)}</svg></div>`;
}
// the + in its button (the app's 60px orange disc, cream mark), its centre on the mark's centre
function button(set) {
  const r = B.plus, d = set === 'before' ? r.before : r.sizes[24].d, s = set === 'before' ? 1.1 : 1, w = 24 * s;
  const c = set === 'before' ? 12 : 12 + 1 / 12, bx = 30 - c * s;   // place the frame so the mark's centre is the disc's centre
  return `<div style="width:60px;height:60px;position:relative;flex:none"><svg width="60" height="60" viewBox="0 0 60 60" style="position:absolute;left:0;top:0"><circle cx="30" cy="30" r="30" fill="${ORANGE}"/></svg><svg width="${w}" height="${w}" viewBox="0 0 24 24" style="position:absolute;left:${bx}px;top:${bx}px">${P(d, CREAM)}</svg></div>`;
}
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  for (const dpr of [3, 2]) {
    const p = await b.newPage({ viewport: { width: 500, height: 100 }, deviceScaleFactor: dpr });
    const rows = {};
    for (const set of ['before', 'after']) {
      rows[`${set}-24`] = ALL.map(n => cell(n, set, 24)).join('');
      rows[`${set}-18`] = BADGE.map(n => cell(n, set, 18)).join('');
      rows[`${set}-12`] = BADGE.map(n => cell(n, set, 12)).join('');
      rows[`${set}-button`] = button(set);
    }
    for (const [k, html] of Object.entries(rows)) {
      const gap = /-(18|12)$/.test(k) ? 2 : 6;
      await p.setContent(`<body style="margin:0;background:${PAPER}"><div id="r" style="display:flex;align-items:center;gap:${gap}px;padding:3px;width:max-content">${html}</div></body>`);
      await (await p.$('#r')).screenshot({ path: path.join(OUT, `${k}-${dpr}x.png`) });
    }
    await p.close();
  }
  await b.close(); console.log('shots', OUT);
})().catch(e => { console.error(e); process.exit(1); });
