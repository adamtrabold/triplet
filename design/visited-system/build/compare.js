// Before/after sheets for the owner: the approved colour-wash build (stills-wash/) vs the cream +
// neutral revision (stills/), same real-page renders. node compare.js -> stills/before-after-*.png
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const D = __dirname, img = (dir, f) => 'data:image/png;base64,' + fs.readFileSync(path.join(D, dir, f)).toString('base64');
(async () => {
  const exe = '/opt/pw-browsers/' + fs.readdirSync('/opt/pw-browsers').find(d => d.startsWith('chromium-')) + '/chrome-linux/chrome';
  const b = await chromium.launch({ executablePath: exe });
  const css = 'body{margin:0;background:#1d1d1b;font:600 15px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#F2EBDD}.w{padding:14px;width:max-content}p{margin:12px 0 6px}img{display:block}';
  for (const [name, files, scale] of [['specimen', ['pins-specimen-1x.png'], 1], ['specimen-3x', ['pins-specimen-3x.png'], 0.5], ['rows-3x', ['rows-pins-3x.png', 'rows-shapes-3x.png'], 0.5]]) {
    const one = (dir) => files.map(f => `<img src="${img(dir, f)}" style="zoom:${scale}">`).join('');
    const html = `<!doctype html><meta charset=utf-8><style>${css}</style><div class=w><p>BEFORE · approved colour wash</p>${one('stills-wash')}<p>AFTER · cream + one neutral (owner revision)</p>${one('stills')}</div>`;
    const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
    await p.setContent(html); await p.locator('.w').screenshot({ path: path.join(D, 'stills', `before-after-${name}.png`) }); await p.close();
  }
  await b.close();
})();
