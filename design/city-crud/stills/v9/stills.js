// City CRUD v9: a swipe triggers the departure-board flip (owner: "The departure board is interesting.
// What if all that was triggered by a swipe or something"). R (pick): swipe a city's row in the title
// menu sideways; the row itself flaps over to REMOVE (and the city's signpost with it when on screen).
// S: flick the signpost board itself, on the map. Finger, swipe and flip drawn.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v9/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
const FADE = `window.__fade = picked => document.querySelectorAll('.sp-board').forEach(b => {
  if (b.dataset.cityBadge === picked) return;
  b.style.color = 'var(--ink-2)'; b.querySelector('.sp-shadow').style.display = 'none';
  const l = b.querySelector('.sp-line'); l.style.stroke = 'var(--ink-2)'; l.style.strokeDasharray = '3 2.5'; });`;
async function setup(page, ll, z, menu) {
  await page.evaluate(([FADE, ll, z]) => { eval(FADE); CC.unhideAll(); goToCity('malmo'); map.setView(ll, z, { animate: false }); toggleSheetCollapsed(); }, [FADE, ll, z]); await W(1500);
  await page.evaluate(() => map.invalidateSize()); await W(3000);
  await page.evaluate(() => window.__fade('malmo'));
  if (menu) { await P.tap(page, '#titleBtn'); await W(400); await page.evaluate(() => window.__fade('malmo')); }
}
const ROW = `document.querySelector('#titleMenu .menu-row[data-go="stockholm"]')`;
// a finger: the soft touch ring + a dashed trail behind it (dx, dy = where the swipe came from)
const FINGER = (fx, fy, dx, dy) => `(() => { const x = ${fx}, y = ${fy};
  const len = Math.hypot(${dx}, ${dy}), ang = Math.atan2(${dy}, ${dx}) * 180 / Math.PI;
  document.body.insertAdjacentHTML('beforeend', '<div style="position:fixed;z-index:99001;pointer-events:none;left:' + x + 'px;top:' + (y - 1) + 'px;width:' + len + 'px;height:0;border-top:3px dashed #12293F;transform-origin:0 50%;transform:rotate(' + ang + 'deg)"></div>'
    + '<div style="position:fixed;z-index:99002;pointer-events:none;left:' + (x - 22) + 'px;top:' + (y - 22) + 'px;width:44px;height:44px;border-radius:50%;background:rgba(18,41,63,.14);box-shadow:inset 0 0 0 1.5px rgba(18,41,63,.4)"></div>'); })()`;
// the row as a split-flap: k = 0..1 how far the flap has fallen (1 = the navy back shows REMOVE STOCKHOLM)
const FLAP = k => `(() => { const r = ${ROW}; r.style.position = 'relative'; r.style.overflow = 'hidden';
  const e = r.querySelector('.menu-end'); if (e) e.style.visibility = 'hidden';
  const back = '<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--navy);color:var(--paper);font-family:var(--font-ui);font-stretch:75%;font-weight:700;font-size:13px;letter-spacing:.12em;text-transform:uppercase">Remove Stockholm</span>';
  if (${k} >= 1) { r.insertAdjacentHTML('beforeend', back); return; }
  // mid-flap: the top half's flap swings down (the back's top half shows above, the front's flap below the hinge)
  r.insertAdjacentHTML('beforeend', '<span style="position:absolute;left:0;right:0;top:0;height:50%;overflow:hidden">' + back.replace('inset:0', 'left:0;right:0;top:0;height:200%') + '</span>'
    + '<span style="position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(18,41,63,.35)"></span>'); })()`;
const BOARD = (k, flipped) => `(() => { const b = document.querySelector('.sp-board[data-city-badge="stockholm"]'); if (!b) return;
  b.style.transformOrigin = '50% 50%'; b.style.transform = 'scaleY(${k})';
  ${flipped ? `b.querySelector('.sp-fill').style.fill = 'var(--navy)'; b.querySelector('.sp-line').style.stroke = 'var(--navy)'; b.querySelector('.sp-line').style.strokeDasharray = 'none';
    b.querySelector('.sp-shadow').style.display = ''; b.style.color = 'var(--paper)'; b.querySelector('.sp-lab').innerHTML = 'Remove'; b.querySelector('.sp-lab').style.width = '100%'; b.querySelector('.sp-lab').style.justifyContent = 'center';` : ''} })()`;
const CONFIRM = `(() => { const m = document.getElementById('titleMenu'), row = ${ROW};
  CC.grow(m, () => { row.insertAdjacentHTML('afterend', '<div class="cc-expand" style="background:var(--paper-raised)"><div class="cc-q" style="font-weight:600">Remove Stockholm from your cities?</div>'
    + '<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Move its 23 places to</span><span class="route-city" style="margin-left:0"><span class="route-city-name">Pick</span>' + CC.ICO.chev + '</span></div>'
    + '<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Remove them too</span></div>'
    + '<div class="cc-acts" style="margin-top:var(--s2)"><span class="cc-btn">Cancel</span><span class="cc-btn" style="color:var(--ink-2);box-shadow:inset 0 0 0 1px var(--hair)">Remove</span></div></div>'); }, false);
  m.scrollTop = 0; })()`;
const rowPt = `(() => { const b = ${ROW}.getBoundingClientRect(); return [b.left, b.top, b.width, b.height]; })()`;
const MALMO = [55.6, 13.0], EUROPE = [57, 5];

const FRAMES = {
  async 'R1-swipe-the-row'(page) {
    await setup(page, MALMO, 11, true);
    const [l, t, w, h] = await page.evaluate(s => eval(s), rowPt);
    await page.evaluate(([f]) => { const r = document.querySelector('#titleMenu .menu-row[data-go="stockholm"]'); r.style.background = 'var(--paper-pressed)'; eval(f); }, [FINGER(l + w * 0.38, t + h / 2, w * 0.5, 0)]);
  },
  async 'R2-it-flaps-over'(page) {
    await setup(page, MALMO, 11, true);
    await page.evaluate(k => eval(k), FLAP(1));
  },
  async 'R3-zoomed-out-the-sign-too'(page) {
    await setup(page, EUROPE, 3, true);
    await page.evaluate(([k, b]) => { eval(k); eval(b); }, [FLAP(1), BOARD(1, true)]);
  },
  async 'R4-tap-for-the-confirm'(page) {
    await setup(page, EUROPE, 3, true);
    await page.evaluate(([k, c, b]) => { eval(c); window.__fade('malmo'); eval(k); eval(b); }, [FLAP(1), CONFIRM, BOARD(1, true)]);
  },
  async 'S1-flick-the-board'(page) {
    await setup(page, EUROPE, 3, false);
    const p = await page.evaluate(() => { const r = document.querySelector('.sp-board[data-city-badge="stockholm"]').getBoundingClientRect(); return [r.left + r.width * 0.6, r.top + r.height / 2]; });
    await page.evaluate(([f, b]) => { eval(b); eval(f); }, [FINGER(p[0], p[1], 0, 70), BOARD(0.3, false)]);
  },
  async 'S2-board-shows-remove'(page) {
    await setup(page, EUROPE, 3, false);
    await page.evaluate(b => eval(b), BOARD(1, true));
  },
};

const SHEETS = [
  ['1-R-swipe-the-row', '1 · Pick: swipe a city\'s row in the title menu; the row flaps over like a departure board', [
    ['R1-swipe-the-row', 'Swipe left', 'Zoomed into Malmö. Swipe Stockholm\'s row to the left (the dashed line is the path of your finger).'],
    ['R2-it-flaps-over', 'REMOVE STOCKHOLM', 'The row is the board now: navy, one line. Works at any zoom; no signpost needed.'],
    ['R3-zoomed-out-the-sign-too', 'Zoomed out', 'When Stockholm\'s signpost is on the map, it turns over with the row.'],
    ['R4-tap-for-the-confirm', 'Tap it', 'Tapping the flipped row opens the confirm. Swipe back or tap elsewhere and it flaps back.'],
  ]],
  ['2-S-flick-the-board', '2 · Alternative: flick the signpost itself, on the map', [
    ['S1-flick-the-board', 'Flick up', 'Zoomed out, an upward flick on Stockholm\'s board starts it turning over.'],
    ['S2-board-shows-remove', 'REMOVE', 'Tap the board for the confirm. Only possible while the signposts show (zoom 8 or less).'],
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
  const FW = 330;
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
