// City CRUD v6: how Remove city is reached (owner: semi-hidden, no visible button, "needs more
// exploration"), and the other cities' signposts when one city is picked ("maybe they should look
// hidden in some way"). Built index.html + the design layer.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v6/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };

async function menuOverMap(page, ll, z, pick) {
  await page.evaluate(([ll, z, pick]) => { CC.unhideAll(); if (pick) goToCity(pick); map.setView(ll, z, { animate: false }); toggleSheetCollapsed(); }, [ll, z, pick]); await W(1500);
  await page.evaluate(() => map.invalidateSize()); await W(3000);
  await P.tap(page, '#titleBtn'); await W(400);
}
const rowOf = id => `document.querySelector('#titleMenu .menu-row[data-go="${id}"]')`;

const FRAMES = {
  // ---- recommended: hold a city in the title menu ----
  async 'M1-hold-a-city'(page) {
    await menuOverMap(page, [57, 5], 3, 'malmo');
    await page.evaluate(r => {
      const row = eval(r);
      // the hold: the pressed tone fills the row from the left as the 500ms hold runs (here ~70%)
      row.style.background = 'linear-gradient(90deg, var(--paper-pressed) 70%, transparent 70%)';
      row.insertAdjacentHTML('beforeend', '<span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-stretch:75%;font-weight:700;color:var(--ink-2)">Hold…</span>');
      const end = row.querySelector('.menu-end'); if (end) end.style.visibility = 'hidden';
    }, rowOf('stockholm'));
  },
  async 'M2-remove-in-the-menu'(page) {
    await menuOverMap(page, [57, 5], 3, 'malmo');
    await page.evaluate(r => {
      const m = document.getElementById('titleMenu'), row = eval(r);
      CC.grow(m, () => {
        row.style.background = 'var(--paper-pressed)';
        row.insertAdjacentHTML('afterend', '<div class="cc-expand" style="background:var(--paper-raised)"><div class="cc-q" style="font-weight:600">Remove Stockholm from your cities?</div>'
          + `<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Move its 23 places to</span><span class="route-city" style="margin-left:0"><span class="route-city-name">Pick</span>${CC.ICO.chev}</span></div>`
          + '<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Remove them too</span></div>'
          + '<div class="cc-acts" style="margin-top:var(--s2)"><span class="cc-btn">Cancel</span><span class="cc-btn" style="color:var(--ink-2);box-shadow:inset 0 0 0 1px var(--hair)">Remove</span></div></div>');
      }, false);
      m.scrollTop = 0;
    }, rowOf('stockholm'));
  },
  // ---- the other cities' signposts, one city picked ----
  async 'S1-faded-signposts'(page) {
    await page.evaluate(() => { CC.unhideAll(); goToCity('malmo'); map.setView([60, 0], 3, { animate: false }); }); await W(3500);
    await page.evaluate(() => {
      // the list: Malmö only (v5's filter, simulated)
      document.querySelectorAll('#locationsList .sec-head').forEach(h => { if (h.dataset.city !== 'malmo') h.remove(); else { h.classList.add('is-first'); h.querySelector('.sec-eye').style.visibility = 'hidden'; } });
      [...document.getElementById('locationsList').children].forEach(r => { if (!/MALMÖ/i.test(r.textContent)) r.remove(); });
      document.getElementById('locationsList').scrollTop = 0;
      // the other cities' boards print in the eye's hidden voice: ink-2 label, hair rule, no navy shadow
      document.querySelectorAll('.sp-board').forEach(b => {
        if (b.dataset.cityBadge === 'malmo') return;
        b.style.color = 'var(--ink-2)';
        b.querySelector('.sp-shadow').style.display = 'none';
        b.querySelector('.sp-line').style.stroke = 'var(--ink-2)';
        b.querySelector('.sp-line').style.strokeDasharray = '3 2.5';
        b.querySelector('.sp-fill').style.fill = 'color-mix(in srgb, var(--paper-raised) 80%, transparent)';
      });
    });
  },
};

const SHEETS = [
  ['1-hold-a-city-in-the-menu', '1 · Recommended: hold a city in the title menu to remove it', [
    ['M1-hold-a-city', 'Hold', 'The title menu lists every city in both views. Holding Stockholm\'s row fills it, "Hold…", then it opens.'],
    ['M2-remove-in-the-menu', 'Remove, right there', 'The confirm opens under the row: move its places to a city you pick, or remove them too. Remove waits for a choice.'],
  ]],
  ['2-other-signposts', '2 · One city picked, zoomed out: the other signposts look hidden', [
    ['S1-faded-signposts', 'Malmö picked', 'Malmö\'s board is as today. The others print in the eye\'s hidden voice: grey, a dashed rule, no shadow. A tap picks that city.'],
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
  const FW = 360;
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
