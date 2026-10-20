// Contact sheet for the owner (phone-readable): the pin is the close, as built. Five tags at 390x844,
// then the closing disc at 3x for 390 and 375, from raw/pin (stills.js).
//   node design/tag-close-fix/sheet.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const RAW = path.join(__dirname, 'raw/pin');
const pos = JSON.parse(fs.readFileSync(path.join(RAW, 'pos.json'), 'utf8'));
const SCENES = [['1-plain', 'Plain'], ['2-starred', 'Starred'], ['3-visited', 'Visited'], ['4-stop', 'Plan stop'], ['5-district', 'District']];
const img = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
(async () => {
  // full phone, cropped to the tag area (3x source shown at ~0.6 of 1x)
  const phone = (w, n) => `<div class="ph"><img src="${img(path.join(RAW, `${w}-${n}.png`))}" style="width:${w * 0.62}px"></div>`;
  // the disc at 3x: a 64x64 css-px window round the disc centre, drawn at 3x source pixels 1:1 scaled to 150px
  const crop = (w, n) => { const p = pos[`${w}-${n}`]; const S = 150 / 64;
    return `<div class="cr"><img src="${img(path.join(RAW, `${w}-${n}.png`))}" style="width:${w * S}px;left:${-(p.cx - 32) * S}px;top:${-(p.cy - 32) * S}px"></div>`; };
  const html = `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 24px; background: #F2EBDD; font: 600 26px/1.3 system-ui, sans-serif; color: #1A1A18; width: 1116px; }
    h1 { font-size: 42px; margin: 0 0 6px; } p.s { margin: 0 0 18px; font-weight: 400; font-size: 24px; color: #5A564C; }
    h2 { font-size: 28px; margin: 24px 0 10px; }
    .r { display: flex; gap: 10px; } .c { flex: 1; min-width: 0; } .k { font-size: 21px; color: #5A564C; margin-bottom: 4px; }
    .ph { height: 330px; overflow: hidden; border-radius: 8px; } .ph img { display: block; margin-left: -6px; }
    .cr { position: relative; width: 150px; height: 150px; overflow: hidden; border-radius: 8px; } .cr img { position: absolute; max-width: none; }
  </style><h1>The pin is the close</h1><p class="s">While a tag is open, its pin (or a district's dot) turns into a pale orange disc with an orange x. Tap it to close.</p>
  <h2>390 wide</h2><div class="r">${SCENES.map(([n, t]) => `<div class="c"><div class="k">${t}</div>${phone(390, n)}</div>`).join('')}</div>
  <h2>375 x 667</h2><div class="r">${SCENES.map(([n, t]) => `<div class="c"><div class="k">${t}</div>${phone(375, n)}</div>`).join('')}</div>
  <h2>The close, up close (3x)</h2><div class="r">${SCENES.map(([n, t]) => `<div class="c"><div class="k">${t}</div>${crop(390, n)}</div>`).join('')}</div>
  <div class="r" style="margin-top:10px">${SCENES.map(([n]) => `<div class="c"><div class="k">375</div>${crop(375, n)}</div>`).join('')}</div>`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1164, height: 800 } });
  await p.setContent(html); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(__dirname, 'contact-sheet.png'), fullPage: true });
  await b.close();
})();
