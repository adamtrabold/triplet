// Render every board in <dir> in Chromium at its width and record its real content height (the frame height to set).
//   node measure.js <project dir> <heights.json> [shots dir]
// The canvas's support.js isn't loaded; these boards are static markup, so the root div's height is what the canvas shows.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [dir, outJson, shots] = process.argv.slice(2);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.dc.html')).sort();
  const b = await chromium.launch();
  const res = {};
  for (const f of files) {
    const p = await b.newPage({ viewport: { width: 1800, height: 1000 } });
    await p.goto('file://' + path.resolve(dir, f));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const root = document.querySelector('x-dc > div');
      const rc = root.getBoundingClientRect();
      const fonts = [...document.fonts].filter(x => x.status === 'loaded').map(x => x.family);
      // anything poking out past the root's right edge?
      let over = 0;
      root.querySelectorAll('*').forEach(e => { const q = e.getBoundingClientRect(); if (q.width && q.right > rc.right + 0.5) over++; });
      return { w: Math.round(rc.width), h: Math.ceil(rc.height), archivo: fonts.includes('Archivo'), over };
    });
    res[f] = r;
    console.log(f, JSON.stringify(r));
    if (shots) await p.screenshot({ path: path.join(shots, f.replace('.dc.html', '.png')), fullPage: true });
    await p.close();
  }
  await b.close();
  fs.writeFileSync(outJson, JSON.stringify(res, null, 1));
})();
