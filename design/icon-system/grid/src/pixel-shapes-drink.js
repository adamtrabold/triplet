// node drink.js all.json names : per coupe, runs of ink down x=12 and x=11 (rim, band, drink), in px
const { chromium } = require('/opt/node22/lib/node_modules/playwright'), fs = require('fs');
const P = JSON.parse(fs.readFileSync(process.argv[2])), K = process.argv[3].split(',');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const p = await b.newPage();
  for (const k of K) {
    const r = await p.evaluate(d => {
      const ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg'), pa = document.createElementNS(ns, 'path');
      pa.setAttribute('d', d); pa.setAttribute('fill-rule', 'evenodd'); s.appendChild(pa); document.body.appendChild(s);
      const out = {};
      for (const x of [12, 11]) {
        const runs = []; let on = false, y0 = 0;
        for (let y = 4; y <= 21; y += 0.005) {
          const pt = s.createSVGPoint(); pt.x = x; pt.y = y; const i = pa.isPointInFill(pt);
          if (i && !on) { on = true; y0 = y; } if (!i && on) { on = false; runs.push([+y0.toFixed(2), +y.toFixed(2)]); }
        }
        out[x] = runs;
      }
      s.remove(); return out;
    }, P[k]);
    const a = r[11];
    console.log(k, 'x11 runs', JSON.stringify(a), 'rim', (a[0][1] - a[0][0]).toFixed(2), 'band', (a[1][0] - a[0][1]).toFixed(2), 'drink at x11 (+0.08 to centre)', (a[1][1] - a[1][0]).toFixed(2));
  }
  await b.close();
})();
