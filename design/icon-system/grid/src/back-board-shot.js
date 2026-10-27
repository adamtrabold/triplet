// Measure a .dc.html board in Chromium and shoot it as phone stills (1500 wide, cut into pieces about 2000 tall).
//   node src/back-board-shot.js <board.dc.html> <still prefix>   -> prints the board's height; <prefix>-1.png ...
'use strict';
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const [f, pre] = process.argv.slice(2), html = fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<\/?helmet>/g, '');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const p = await b.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 1.25 });
  await p.setContent(html, { waitUntil: 'networkidle' });
  const el = await p.$('x-dc > div'), box = await el.boundingBox();
  console.log('height', Math.ceil(box.height));
  if (pre) { const H = Math.ceil(box.height), n = Math.ceil(H / 1600);
    for (let i = 0; i < n; i++) { const y = Math.round(i * H / n); await p.screenshot({ path: `${pre}-${i + 1}.png`, fullPage: true, clip: { x: 0, y, width: 1200, height: Math.round((i + 1) * H / n) - y } }); } }
  await b.close();
})();
