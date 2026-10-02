// Contact sheet at 1x: rows = models, 4 frames each, captions under.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const out = process.argv[2] || __dirname + '/sheet.png';
const D = JSON.parse(fs.readFileSync(__dirname + '/captions.json', 'utf8'));
const img = s => 'data:image/png;base64,' + fs.readFileSync(__dirname + '/f-' + s + '.png').toString('base64');
const html = `<!doctype html><html><head><style>
@font-face { font-family: A; src: url('file://${__dirname}/../fonts/') }
body { margin: 0; background: #E9E1D1; font-family: Archivo, Arial, sans-serif; color: #1A1A18; padding: 24px; width: ${4 * 390 + 3 * 24}px; }
h1 { font: 800 22px/28px Arial; letter-spacing: .06em; text-transform: uppercase; margin: 0 0 4px; color: #12293F; }
p.sub { margin: 0 0 18px; font: 13px/18px Arial; color: #5A564C; }
.model { margin-bottom: 28px; }
.model h2 { font: 800 17px/22px Arial; letter-spacing: .05em; text-transform: uppercase; margin: 0 0 2px; color: #12293F; }
.model .why { font: 13px/18px Arial; color: #5A564C; margin: 0 0 10px; }
.row { display: flex; gap: 24px; }
.f { width: 390px; }
.f img { display: block; width: 390px; height: 844px; outline: 1px solid #C9BFA9; }
.f .c { font: 12px/16px Arial; margin-top: 6px; color: #1A1A18; min-height: 32px; }
.f .c b { color: #12293F; letter-spacing: .04em; text-transform: uppercase; font-size: 11px; }
.pick { color: #A8400C; }
</style></head><body>
<h1>Plans deep dive · three models</h1>
<p class="sub">Real index.html (origin/main ca7e330) + Copenhagen stub, 390 x 844 at 1x, no map tiles in the sandbox. Concept frames: static states, not working code.</p>
${D.map(m => `<div class="model"><h2>${m.title}</h2><div class="why">${m.why}</div><div class="row">${m.frames.map(([s, c]) => `<div class="f"><img src="${img(s)}"><div class="c">${c}</div></div>`).join('')}</div></div>`).join('')}
</body></html>`;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 4 * 390 + 3 * 24 + 48, height: 800 }, deviceScaleFactor: 1 });
  await p.setContent(html); await p.waitForTimeout(300);
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
