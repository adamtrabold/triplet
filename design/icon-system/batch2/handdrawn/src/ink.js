// ink.js <svgDir>...: ink area (px² at 18 in the 24 box) of every icon, by counting pixels at 10x.
const fs = require('fs'); const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' }); const p = await b.newPage();
  const items = []; for (const dir of process.argv.slice(2)) for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) items.push([f, fs.readFileSync(dir + '/' + f, 'utf8').match(/ d="([^"]+)"/)[1]]);
  const out = await p.evaluate(items => items.map(([n, d]) => { const c = document.createElement('canvas'); c.width = c.height = 240; const x = c.getContext('2d'); x.scale(10, 10); x.fill(new Path2D(d), 'evenodd');
    const a = x.getImageData(0, 0, 240, 240).data; let s = 0; for (let i = 3; i < a.length; i += 4) s += a[i] / 255; return n.padEnd(20) + (s / 100).toFixed(1); }), items);
  console.log(out.join('\n')); await b.close();
})();
