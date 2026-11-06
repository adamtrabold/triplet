// bbox.js <svgDir>: ink bounds of every icon (x0 y0 x1 y1 w h, px in the 24 box).
const fs = require('fs'); const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' }); const p = await b.newPage();
  const dir = process.argv[2]; let h = '';
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) { const d = fs.readFileSync(dir + '/' + f, 'utf8').match(/ d="([^"]+)"/)[1]; h += `<svg id="${f}" viewBox="0 0 24 24"><path d="${d}"/></svg>`; }
  await p.setContent(h);
  console.log(await p.evaluate(() => [...document.querySelectorAll('svg')].map(s => { const b = s.querySelector('path').getBBox(); return s.id.padEnd(20) + [b.x, b.y, b.x + b.width, b.y + b.height, b.width, b.height].map(v => v.toFixed(2)).join(' '); }).join('\n')));
  await b.close();
})();
