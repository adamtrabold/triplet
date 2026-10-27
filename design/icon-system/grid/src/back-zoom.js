// BACK TO THE DRAWINGS: the outlines drawn large (vector, 8 units a px), v264 above the new build, with the iPhone's pixel grid
// (1/3 px) faint beneath, to judge joins and curves by eye.   node src/back-zoom.js <out.png> [names]
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.join(__dirname, '..'), B = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'build.json'), 'utf8'));
const OUT = process.argv[2], names = process.argv.slice(3).length ? process.argv.slice(3) : ['cafe', 'bar', 'museum', 'nature', 'restaurant'];
const Z = 12, NAVY = '#12293F', PAPER = '#F2EBDD';
let grid = ''; for (let i = 0; i <= 72; i++) { const v = i / 3, c = i % 3 ? '#E4DACA' : '#C9BCA6'; grid += `<line x1="${v}" y1="0" x2="${v}" y2="24" stroke="${c}" stroke-width="0.02"/><line x1="0" y1="${v}" x2="24" y2="${v}" stroke="${c}" stroke-width="0.02"/>`; }
const cell = d => `<svg width="${16 * Z}" height="${16 * Z}" viewBox="4 4 16 16" style="background:${PAPER}">${grid}<path fill="${NAVY}" fill-rule="evenodd" d="${d}"/></svg>`;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' }), p = await b.newPage({ viewport: { width: 1200, height: 600 } });
  const row = k => `<div style="display:flex;gap:8px">${names.map(n => cell(k === 'before' ? B[n].before : B[n].sizes[24].d)).join('')}</div>`;
  await p.setContent(`<body style="margin:0;background:#fff"><div id="r" style="display:flex;flex-direction:column;gap:8px;padding:8px;width:max-content">${row('before')}${row('after')}</div></body>`);
  await (await p.$('#r')).screenshot({ path: OUT }); await b.close();
})();
