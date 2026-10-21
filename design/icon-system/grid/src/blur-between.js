// g7ae: blurred darkness of the between set exactly as drawn (svg/g7/between/*.svg): the darkness inside the Ø16 live
// circle after a 1.5px blur (6px at 4x), mean and the darkest fifth. Writes svg/g7/between/blur.json, which the board
// reads. usage: node src/blur-between.js   (after boards7.js has written the svgs; run boards7.js again to show them)
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dir = path.join(__dirname, '../svg/g7/between');
const files = fs.readdirSync(dir).filter(f => /^(cafe|bar|nature|museum)/.test(f) && f.endsWith('.svg'));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 200, height: 200 } });
  await p.setContent('<body></body>');
  const out = {};
  for (const f of files) {
    const svg = fs.readFileSync(path.join(dir, f), 'utf8').replace('<svg ', '<svg width="96" height="96" ');
    out[f.replace('.svg', '')] = await p.evaluate(async src => {
      const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src); await img.decode();
      const c = document.createElement('canvas'); c.width = c.height = 96; const x = c.getContext('2d');
      x.fillStyle = '#fff'; x.fillRect(0, 0, 96, 96); x.filter = 'blur(6px)'; x.drawImage(img, 0, 0, 96, 96);
      const d = x.getImageData(0, 0, 96, 96).data, v = [];
      for (let yy = 0; yy < 96; yy++) for (let xx = 0; xx < 96; xx++) if ((xx - 48) ** 2 + (yy - 48) ** 2 <= 32 ** 2) v.push(1 - d[(yy * 96 + xx) * 4] / 255);
      v.sort((a, c_) => a - c_); const top = v.slice(Math.floor(v.length * 0.8));
      return { mean: +(100 * v.reduce((a, c_) => a + c_, 0) / v.length).toFixed(1), core: +(100 * top.reduce((a, c_) => a + c_, 0) / top.length).toFixed(1) };
    }, svg);
  }
  await b.close();
  fs.writeFileSync(path.join(dir, 'blur.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out));
})();
