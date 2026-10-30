// City CRUD v10 (owner: "the swipe should follow standard convention and bring in/reveal from the left rather than the top"; "The signpost can still flip over alongside the swipe"): swipe a city row LEFT, the REMOVE board slides in over its right end with the finger (trailing reveal). Was v9: a swipe triggers the departure-board flip (owner: "The departure board is interesting.
// What if all that was triggered by a swipe or something"). R (pick): swipe a city's row in the title
// menu sideways; the row itself flaps over to REMOVE (and the city's signpost with it when on screen).
// S: flick the signpost board itself, on the map. Finger, swipe and flip drawn.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v10/stills.js [prefix|sheets]
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


// the board slides in over the row's right end; w = how much of it shows (0..132)
const REVEAL = w => `(() => { const r = ${ROW}; r.style.position = 'relative'; r.style.overflow = 'hidden';
  const e = r.querySelector('.menu-end'); if (e) e.style.visibility = 'hidden';
  r.insertAdjacentHTML('beforeend', '<span style="position:absolute;top:4px;bottom:4px;right:0;width:${w}px;overflow:hidden;filter:drop-shadow(-2px 1px 2px rgba(26,26,24,.12))">'
    + '<span style="position:absolute;top:0;bottom:0;left:0;width:132px;display:flex;align-items:center;justify-content:center;padding-left:12px;box-sizing:border-box;background:var(--navy);color:var(--paper);clip-path:polygon(12px 0,100% 0,100% 100%,12px 100%,0 50%);font-family:var(--font-ui);font-stretch:75%;font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Remove</span></span>'); })()`;
const FRAMES = {
  async 'V1-mid-swipe'(page) {
    await setup(page, MALMO, 11, true);
    const [l, t, w, h] = await page.evaluate(s => eval(s), rowPt);
    await page.evaluate(([f, k]) => { eval(k); eval(f); }, [FINGER(l + w - 70, t + h / 2, 64, 0), REVEAL(60)]);
  },
  async 'V2-settled-open'(page) {
    await setup(page, MALMO, 11, true);
    await page.evaluate(k => eval(k), REVEAL(132));
  },
  async 'V3-sign-turns-too'(page) {
    await setup(page, EUROPE, 3, true);
    await page.evaluate(([k, b]) => { eval(k); eval(b); }, [REVEAL(132), BOARD(1, true)]);
  },
  async 'V4-tap-for-the-confirm'(page) {
    await setup(page, EUROPE, 3, true);
    await page.evaluate(([k, c, b]) => { eval(c); window.__fade('malmo'); eval(k); eval(b); }, [REVEAL(132), CONFIRM, BOARD(1, true)]);
  },
};

const SHEETS = [
  ['1-R-swipe-reveal', '1 · Swipe a city\'s row left: its REMOVE board slides in from the right', [
    ['V1-mid-swipe', 'Mid-swipe', 'Zoomed into Malmö. Dragging Stockholm\'s row left, the board\'s point slides in under your finger.'],
    ['V2-settled-open', 'Past halfway, it settles', 'The board sits open over the row\'s end; the name stays put so you see which city.'],
    ['V3-sign-turns-too', 'Zoomed out', 'Stockholm\'s signpost turns over to REMOVE at the same moment.'],
    ['V4-tap-for-the-confirm', 'Tap the board', 'The confirm opens. Swipe right or tap elsewhere instead and the board slides away.'],
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
