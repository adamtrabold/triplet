// Contact sheet for the owner (phone-readable): today | x moved down | pin-as-close, the tag cropped
// from the 3x stills.
//   node design/tag-close-fix/sheet.js   (after stills.js has written raw/before, raw/after, raw/pin)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const RAW = path.join(__dirname, 'raw');
const SIDES = [['before', 'Today'], ['after', 'A. x in the corner'], ['pin', 'B. pin is the x']];
const ROWS = [['390', '1-short', 'Short name'], ['390', '3-starred', 'Starred'], ['390', '4-busiest', 'Busiest: starred, visited, plan stop, note'], ['375', '4-busiest', 'Busiest, small phone (375x667)']];
const img = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
(async () => {
  const cell = (w, n, [dir, label]) => `<div class="c"><div class="k">${label}</div><div class="crop"><img src="${img(path.join(RAW, dir, `${w}-3x-${n}.png`))}"></div></div>`;
  const html = `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 24px; background: #F2EBDD; font: 600 30px/1.3 system-ui, sans-serif; color: #1A1A18; width: 1116px; }
    h1 { font-size: 44px; margin: 0 0 6px; } p.s { margin: 0 0 20px; font-weight: 400; font-size: 26px; color: #5A564C; }
    h2 { font-size: 30px; margin: 28px 0 10px; }
    .r { display: flex; gap: 12px; } .c { flex: 1; min-width: 0; } .k { font-size: 22px; letter-spacing: .02em; color: #5A564C; margin-bottom: 6px; }
    .crop { height: 470px; overflow: hidden; border-radius: 8px; position: relative; background: #fff; }
    .crop img { position: absolute; width: 1170px; left: -26px; top: -48px; transform: scale(.36); transform-origin: 0 0; }
  </style><h1>Closing the tag: three ways</h1><p class="s">A: the x moved down into the tag's top-right corner. B: no x on the tag; the pin it hangs from shows an x and closes it.</p>`
    + ROWS.map(([w, n, t]) => `<h2>${t}</h2><div class="r">${SIDES.map(s => cell(w, n, s)).join('')}</div>`).join('');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1164, height: 800 } });
  await p.setContent(html); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(__dirname, 'contact-sheet.png'), fullPage: true });
  await b.close();
})();
