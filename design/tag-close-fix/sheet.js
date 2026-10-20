// Contact sheet for the owner (phone-readable): before | after, the tag cropped from the 3x stills.
//   node design/tag-close-fix/sheet.js   (after stills.js has written raw/before and raw/after)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const RAW = path.join(__dirname, 'raw');
const ROWS = [['390', '1-short', 'Short name'], ['390', '2-two-line', 'Two-line name'], ['390', '3-starred', 'Starred (orange band)'], ['390', '4-busiest', 'Busiest: starred, visited, plan stop, note'], ['375', '4-busiest', 'Busiest on a small phone (375x667)']];
const img = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
(async () => {
  const cell = (w, n, side) => `<div class="c"><div class="k">${side}</div><div class="crop"><img src="${img(path.join(RAW, side, `${w}-3x-${n}.png`))}"></div></div>`;
  const html = `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 32px; background: #F2EBDD; font: 600 30px/1.3 system-ui, sans-serif; color: #1A1A18; width: 1100px; }
    h1 { font-size: 44px; margin: 0 0 8px; } p.s { margin: 0 0 32px; font-weight: 400; color: #5A564C; }
    h2 { font-size: 32px; margin: 36px 0 12px; }
    .r { display: flex; gap: 20px; } .c { flex: 1; } .k { font-size: 24px; text-transform: uppercase; letter-spacing: .1em; color: #5A564C; margin-bottom: 6px; }
    .crop { height: 520px; overflow: hidden; border-radius: 8px; position: relative; background: #fff; }
    .crop img { position: absolute; width: 1170px; left: -45px; top: -175px; transform: scale(.5); transform-origin: 0 0; }
  </style><h1>Tag close x: before / after</h1><p class="s">The x now lives in the tag's top-right corner, level with the string hole. City sits 4px closer to the name.</p>`
    + ROWS.map(([w, n, t]) => `<h2>${t}</h2><div class="r">${cell(w, n, 'before')}${cell(w, n, 'after')}</div>`).join('');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1164, height: 800 } });
  await p.setContent(html); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(__dirname, 'contact-sheet.png'), fullPage: true });
  await b.close();
})();
