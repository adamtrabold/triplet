// THE GRID: true-size renders (10-27). Each icon at 1:1 in its 24 frame, the badge icons in their ring, the line marks bare, on
// the app's paper, at 2x (the 5K) and 3x (iPhone); saved one device pixel per pixel, to be shown enlarged, pixelated.
//   node src/the-grid-shots.js <out dir>   -> <out>/<set>-<dpr>x.png (a row of the six), <out>/<set>-<name>-<dpr>x.png
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.join(__dirname, '..'), OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const NAVY = '#12293F', PAPER = '#F2EBDD';
const grid = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'the-grid', 'build.json'), 'utf8'));
const now = fs.readFileSync(path.join(ROOT, 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8'), A = {};
for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!A[m[1]]) A[m[1]] = m[2];
const ORDER = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus'];
const SETS = {
  approved: { cafe: A['Café'], bar: A.Bar, museum: A.Museum, nature: A.Nature, star: A.Star, plus: A.Add, starScale: 20 / 24, plusScale: 1.1 },
  grid: Object.fromEntries(ORDER.map(n => [n, grid[n].d])),
};
SETS.grid.starScale = 1; SETS.grid.plusScale = 1;
const cell = (set, n) => {
  const d = SETS[set][n], ring = !['star', 'plus'].includes(n);
  // the approved line marks were drawn in a 24 box shown at their slot (the star at 20, the + at 26.4): shown so here, centred
  const s = n === 'star' ? SETS[set].starScale : n === 'plus' ? SETS[set].plusScale : 1, w = 24 * s, o = (24 - w) / 2;
  return `<div style="width:24px;height:24px;position:relative;flex:none"><svg width="24" height="24" viewBox="0 0 24 24" style="position:absolute;left:0;top:0">${ring ? `<circle cx="12" cy="12" r="11.25" fill="none" stroke="${NAVY}" stroke-width="1.5"/>` : ''}</svg>` +
    `<svg width="${w}" height="${w}" viewBox="0 0 24 24" style="position:absolute;left:${o}px;top:${o}px"><path fill="${NAVY}" fill-rule="evenodd" d="${d}"/></svg></div>`;
};
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  for (const dpr of [2, 3]) {
    const p = await b.newPage({ viewport: { width: 400, height: 60 }, deviceScaleFactor: dpr });
    for (const set of Object.keys(SETS)) {
      await p.setContent(`<body style="margin:0;background:${PAPER}"><div id="r" style="display:flex;gap:4px;padding:2px;width:max-content">${ORDER.map(n => cell(set, n)).join('')}</div></body>`);
      const r = await p.$('#r'); await r.screenshot({ path: path.join(OUT, `${set}-${dpr}x.png`) });
    }
    await p.close();
  }
  await b.close(); console.log('shots', OUT);
})().catch(e => { console.error(e); process.exit(1); });
