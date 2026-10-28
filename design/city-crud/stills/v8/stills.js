// City CRUD v8: the reveal after holding a city row in the title menu, from real random draws
// (concepts/v8-draws.md). Three drawn: D the departure board (the city's own signpost flips to one
// word), I the iris (everything but the held row closes down), F under your finger.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v8/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
const FADE = `window.__fade = picked => document.querySelectorAll('.sp-board').forEach(b => {
  if (b.dataset.cityBadge === picked) return;
  b.style.color = 'var(--ink-2)'; b.querySelector('.sp-shadow').style.display = 'none';
  const l = b.querySelector('.sp-line'); l.style.stroke = 'var(--ink-2)'; l.style.strokeDasharray = '3 2.5'; });`;
async function menuWithMalmo(page) {
  await page.evaluate(FADE => { eval(FADE); CC.unhideAll(); goToCity('malmo'); map.setView([57, 5], 3, { animate: false }); toggleSheetCollapsed(); }, FADE); await W(1500);
  await page.evaluate(() => map.invalidateSize()); await W(3000);
  await P.tap(page, '#titleBtn'); await W(400);
  await page.evaluate(() => window.__fade('malmo'));
}
const ROW = `document.querySelector('#titleMenu .menu-row[data-go="stockholm"]')`;
const PRESS = `(() => { const r = ${ROW}; r.style.background = 'var(--paper-pressed)'; const e = r.querySelector('.menu-end'); if (e) e.style.visibility = 'hidden'; return r; })()`;
// D: the Stockholm board, mid-flip (k = vertical scale) or flipped to its navy back with one word
const BOARD = (k, flipped) => `(() => { const b = document.querySelector('.sp-board[data-city-badge="stockholm"]');
  b.style.transformOrigin = '50% 50%'; b.style.transform = 'scaleY(${k})';
  ${flipped ? `b.querySelector('.sp-fill').style.fill = 'var(--navy)'; b.querySelector('.sp-line').style.stroke = 'var(--navy)'; b.querySelector('.sp-line').style.strokeDasharray = 'none';
    b.querySelector('.sp-shadow').style.display = ''; b.style.color = 'var(--paper)';
    b.querySelector('.sp-lab').innerHTML = 'Remove'; b.querySelector('.sp-lab').style.width = '100%'; b.querySelector('.sp-lab').style.justifyContent = 'center';` : ''}
})()`;
const CONFIRM = `(() => { const m = document.getElementById('titleMenu'), row = ${ROW};
  CC.grow(m, () => { row.insertAdjacentHTML('afterend', '<div class="cc-expand" style="background:var(--paper-raised)"><div class="cc-q" style="font-weight:600">Remove Stockholm from your cities?</div>'
    + '<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Move its 23 places to</span><span class="route-city" style="margin-left:0"><span class="route-city-name">Pick</span>' + CC.ICO.chev + '</span></div>'
    + '<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Remove them too</span></div>'
    + '<div class="cc-acts" style="margin-top:var(--s2)"><span class="cc-btn">Cancel</span><span class="cc-btn" style="color:var(--ink-2);box-shadow:inset 0 0 0 1px var(--hair)">Remove</span></div></div>'); }, false);
  m.scrollTop = 0; })()`;
// I: everything but the held row goes under the navy at 55%, the row alone stays lit
const IRIS = (a, word) => `(() => { const r = ${PRESS}; const b = r.getBoundingClientRect();
  document.body.insertAdjacentHTML('beforeend', '<div style="position:fixed;z-index:3000;pointer-events:none;left:' + b.left + 'px;top:' + b.top + 'px;width:' + b.width + 'px;height:' + b.height + 'px;box-shadow:0 0 0 2000px rgba(18,41,63,${a})"></div>');
  ${word ? `r.style.position = 'relative'; r.style.zIndex = '3001'; r.insertAdjacentHTML('beforeend', '<span style="position:absolute;right:10px;top:50%;transform:translateY(-50%);padding:6px 12px;border-radius:3px;background:var(--navy);color:var(--paper);font-family:var(--font-ui);font-stretch:75%;font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase">Remove</span>');` : ''}
})()`;
// F: a paper chip with one word rises to the fingertip (the touch point marked by a soft ring)
const FINGER = (risen) => `(() => { const r = ${PRESS}; const b = r.getBoundingClientRect(); const x = b.left + b.width * 0.58, y = b.top + b.height / 2;
  document.body.insertAdjacentHTML('beforeend', '<div style="position:fixed;z-index:3000;pointer-events:none;left:' + (x - 22) + 'px;top:' + (y - 22) + 'px;width:44px;height:44px;border-radius:50%;background:rgba(18,41,63,.12);box-shadow:inset 0 0 0 1.5px rgba(18,41,63,.35)"></div>');
  ${risen ? `document.body.insertAdjacentHTML('beforeend', '<div style="position:fixed;z-index:3001;left:' + (x - 52) + 'px;top:' + (y - 74) + 'px;width:104px;height:40px;display:flex;align-items:center;justify-content:center;background:var(--paper-raised);color:var(--navy);border:1px solid var(--navy);box-shadow:3px 3px 0 var(--navy);font-family:var(--font-ui);font-stretch:75%;font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase">Remove</div>');` : ''}
})()`;

const FRAMES = {
  async 'D1-hold-the-board-turns'(page) { await menuWithMalmo(page); await page.evaluate(([p, b]) => { eval(p); eval(b); }, [PRESS, BOARD(0.25, false)]); },
  async 'D2-one-word'(page) { await menuWithMalmo(page); await page.evaluate(([p, b]) => { eval(p); eval(b); }, [PRESS, BOARD(1, true)]); },
  async 'D3-tap-the-board'(page) { await menuWithMalmo(page); await page.evaluate(([p, b, c]) => { eval(p); eval(c); window.__fade('malmo'); eval(b); }, [PRESS, BOARD(1, true), CONFIRM]); },
  async 'I1-iris-closes'(page) { await menuWithMalmo(page); await page.evaluate(s => eval(s), IRIS(0.22, false)); },
  async 'I2-only-the-city'(page) { await menuWithMalmo(page); await page.evaluate(s => eval(s), IRIS(0.55, true)); },
  async 'F1-hold'(page) { await menuWithMalmo(page); await page.evaluate(s => eval(s), FINGER(false)); },
  async 'F2-it-comes-to-you'(page) { await menuWithMalmo(page); await page.evaluate(s => eval(s), FINGER(true)); },
};

const SHEETS = [
  ['1-D-departure-board', '1 · Pick: the city\'s own signpost flips over to one word', [
    ['D1-hold-the-board-turns', 'Hold Stockholm', 'Up on the map, Stockholm\'s board starts to turn over, like a departure board.'],
    ['D2-one-word', 'REMOVE', 'Its back is navy with one word. The row stays pressed; nothing else moves.'],
    ['D3-tap-the-board', 'Tap the board', 'The confirm opens in the menu. Tap anywhere else instead and the board turns back.'],
  ]],
  ['2-I-iris', '2 · Runner-up: everything else goes dark', [
    ['I1-iris-closes', 'Hold', 'The map and the other rows sink under navy, slowly.'],
    ['I2-only-the-city', 'Only Stockholm', 'The held row alone stays lit, with a REMOVE button at its end. Tap it for the confirm.'],
  ]],
  ['3-F-under-your-finger', '3 · Also drawn: the button comes to your finger', [
    ['F1-hold', 'Hold', 'The row stays still; a soft ring marks your fingertip.'],
    ['F2-it-comes-to-you', 'REMOVE rises', 'A paper chip rises just above your finger. Slide up onto it and let go to open the confirm.'],
  ]],
];

(async () => {
  const only = process.argv[2] || '';
  const b = await P.lib.launch();
  if (only !== 'sheets') for (const [name, fn] of Object.entries(FRAMES)) {
    if (only && !name.startsWith(only)) continue;
    const o = await open(b, { storage: STORAGE });
    try { await fn(o.page); await W(600); await o.page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name, o.errors.length ? o.errors : ''); }
    catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); }
    await o.page.context().close();
  }
  const FW = 340;
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, frames] of SHEETS) {
    if (!frames.every(([f]) => fs.existsSync(path.join(OUT, f + '.png')))) continue;
    const cells = frames.map(([f, h, c]) => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f + '.png')).toString('base64')}"><figcaption><b>${h}</b><span>${c}</span></figcaption></figure>`).join('');
    const w = Math.max(frames.length * FW + (frames.length + 1) * 20, 760);
    await page.setViewportSize({ width: w, height: 600 });
    await page.setContent(`<!doctype html><html><head><style>
      body { margin: 0; padding: 20px; background: #F2EBDD; font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #12293F; width: ${w - 40}px; }
      h1 { font-size: 22px; line-height: 28px; margin: 0 0 16px; }
      .row { display: flex; gap: 20px; align-items: flex-start; }
      figure { margin: 0; width: ${FW}px; }
      img { width: ${FW}px; display: block; border: 1px solid #D8CEBA; border-radius: 6px; }
      figcaption { margin-top: 10px; font-size: 16px; line-height: 21px; color: #3a3a36; }
      figcaption b { display: block; font-size: 18px; line-height: 23px; color: #12293F; margin-bottom: 2px; }
    </style></head><body><h1>${title}</h1><div class="row">${cells}</div></body></html>`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, file + '.png'), fullPage: true });
    console.log('sheet', file);
  }
  await b.close();
})();
