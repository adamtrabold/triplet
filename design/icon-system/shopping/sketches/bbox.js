// Measures the outline box and ink area of every path in an SVG-paths JSON ({name: d}).
//   node bbox.js <paths.json>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const P = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await chromium.launch();
  const pg = await b.newPage();
  await pg.setContent('<svg id="s" width="240" height="240" viewBox="0 0 24 24"></svg>');
  const out = await pg.evaluate(async (P) => {
    const s = document.getElementById('s');
    const res = {};
    for (const [k, d] of Object.entries(P)) {
      s.innerHTML = `<path fill="#000" fill-rule="evenodd" d="${d}"/>`;
      const bb = s.firstChild.getBBox();
      // ink area by rasterising at 20px/unit
      const c = document.createElement('canvas'); c.width = c.height = 480;
      const x = c.getContext('2d'); x.scale(20, 20); x.fill(new Path2D(d), 'evenodd');
      const px = x.getImageData(0, 0, 480, 480).data; let a = 0;
      for (let i = 3; i < px.length; i += 4) a += px[i] / 255;
      res[k] = { x: +bb.x.toFixed(2), y: +bb.y.toFixed(2), w: +bb.width.toFixed(2), h: +bb.height.toFixed(2), ink: +(a / 400).toFixed(1) };
    }
    return res;
  }, P);
  for (const [k, v] of Object.entries(out)) console.log(k.padEnd(14), JSON.stringify(v));
  await b.close();
})();
