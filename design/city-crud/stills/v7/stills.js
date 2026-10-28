// City CRUD v7: the hold on a city row in the title menu REVEALS a Remove control, with whimsy.
// A (recommended): the row tears off a claim stub (coat check / the Hanging Tag's stub).
// B: a rubber stamp inks "REMOVE?" onto the row (library due-date stamp).
// Plus the picked-city list with no section header and tappable faded signposts.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v7/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };

// every frame with a city picked: the other boards in the eye's hidden voice, but still a solid,
// tappable sign (opaque paper face, dashed --ink-2 rule, no navy shadow)
const FADE = `window.__fade = picked => document.querySelectorAll('.sp-board').forEach(b => {
  if (b.dataset.cityBadge === picked) return;
  b.style.color = 'var(--ink-2)';
  b.querySelector('.sp-shadow').style.display = 'none';
  const l = b.querySelector('.sp-line'); l.style.stroke = 'var(--ink-2)'; l.style.strokeDasharray = '3 2.5';
});`;
const CSS = `
  .cc-stubrow { position: relative; overflow: visible !important; }
  .cc-perf { position: absolute; top: 4px; bottom: 4px; width: 0; border-left: 1.5px dashed var(--ink-2); }
  .cc-stub { position: absolute; top: 3px; bottom: 3px; right: -4px; width: 104px; display: flex; align-items: center; justify-content: center; gap: 6px;
    background: var(--paper-raised); color: var(--navy); border-left: 1.5px dashed var(--hair);
    font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 12px; letter-spacing: .1em;
    box-shadow: 0 1px 1.5px var(--tag-shadow-contact), 0 3px 6px var(--tag-shadow-lift); transform-origin: 0 50%; z-index: 5; font-size: 13px; }
  .cc-stub::before, .cc-stub::after { content: ''; position: absolute; left: -6px; width: 10px; height: 10px; border-radius: 50%; background: var(--paper-raised); }
  .cc-stub::before { top: -5px; } .cc-stub::after { bottom: -5px; }
  .cc-rstamp { position: absolute; right: 16px; top: 50%; transform: translateY(-50%) rotate(-6deg); padding: 3px 8px; border: 2px solid currentColor; border-radius: 4px;
    color: rgba(var(--brand-orange-deep-rgb), .88); font-family: var(--font-ui); font-stretch: 75%; font-weight: 700; font-size: 13px; letter-spacing: .1em; text-transform: uppercase;
    -webkit-mask-image: var(--tex-stamp); mask-image: var(--tex-stamp); -webkit-mask-size: 90px 90px; mask-size: 90px 90px; }
`;

async function menuWithMalmo(page) {
  await page.evaluate(([FADE, CSS]) => { eval(FADE); const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    CC.unhideAll(); goToCity('malmo'); map.setView([57, 5], 3, { animate: false }); toggleSheetCollapsed(); }, [FADE, CSS]); await W(1500);
  await page.evaluate(() => map.invalidateSize()); await W(3000);
  await page.evaluate(() => window.__fade('malmo'));
  await P.tap(page, '#titleBtn'); await W(400);
  await page.evaluate(() => { window.__fade('malmo'); const m = document.getElementById('titleMenu'); m.style.overflow = 'visible'; });
}
const ROW = `document.querySelector('#titleMenu .menu-row[data-go="stockholm"]')`;
// the stub's states: perforation drawn to `perf` (0..1), torn (bool), stub text
const STUB = (perf, torn) => `(() => { const row = ${ROW}; row.classList.add('cc-stubrow');
  const end = row.querySelector('.menu-end'); if (end) end.style.visibility = 'hidden';
  const x = row.offsetWidth - 104;
  row.insertAdjacentHTML('beforeend', '<span class="cc-perf" style="left:' + x + 'px;bottom:auto;height:' + Math.round(${perf} * 32) + 'px"></span>');
  ${torn ? `row.insertAdjacentHTML('beforeend', '<span class="cc-stub" style="transform: translate(8px, -9px) rotate(-5deg)">Remove</span>');` : `row.style.background = 'linear-gradient(90deg, var(--paper-pressed) ' + Math.round(${perf} * 100) + '%, transparent ' + Math.round(${perf} * 100) + '%)';`}
})()`;

const FRAMES = {
  async 'A1-hold-perforates'(page) { await menuWithMalmo(page); await page.evaluate(s => eval(s), STUB(0.5, false)); },
  async 'A2-perforated'(page) { await menuWithMalmo(page); await page.evaluate(s => eval(s), STUB(1, false)); },
  async 'A3-stub-tears-off'(page) { await menuWithMalmo(page); await page.evaluate(s => eval(s), STUB(1, true)); },
  async 'A4-tap-the-stub'(page) {
    await menuWithMalmo(page);
    await page.evaluate(r => {
      const m = document.getElementById('titleMenu'), row = eval(r);
      CC.grow(m, () => {
        row.style.background = 'var(--paper-pressed)';
        row.insertAdjacentHTML('afterend', '<div class="cc-expand" style="background:var(--paper-raised)"><div class="cc-q" style="font-weight:600">Remove Stockholm from your cities?</div>'
          + `<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Move its 23 places to</span><span class="route-city" style="margin-left:0"><span class="route-city-name">Pick</span>${CC.ICO.chev}</span></div>`
          + '<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Remove them too</span></div>'
          + '<div class="cc-acts" style="margin-top:var(--s2)"><span class="cc-btn">Cancel</span><span class="cc-btn" style="color:var(--ink-2);box-shadow:inset 0 0 0 1px var(--hair)">Remove</span></div></div>');
      }, false);
      m.scrollTop = 0; window.__fade('malmo');
    }, ROW);
  },
  async 'B1-stamp-inks'(page) {
    await menuWithMalmo(page);
    await page.evaluate(r => { const row = eval(r); row.style.position = 'relative'; row.style.background = 'var(--paper-pressed)'; const e = row.querySelector('.menu-end'); if (e) e.style.visibility = 'hidden';
      row.insertAdjacentHTML('beforeend', '<span class="cc-rstamp" style="opacity:.45;transform:translateY(-50%) rotate(-6deg) scale(1.12)">Remove?</span>'); }, ROW);
  },
  async 'B2-stamped'(page) {
    await menuWithMalmo(page);
    await page.evaluate(r => { const row = eval(r); row.style.position = 'relative'; const e = row.querySelector('.menu-end'); if (e) e.style.visibility = 'hidden';
      row.insertAdjacentHTML('beforeend', '<span class="cc-rstamp">Remove?</span>'); }, ROW);
  },
  async 'L1-picked-city-list'(page) {
    await page.evaluate(FADE => { eval(FADE); CC.unhideAll(); goToCity('malmo'); map.setView([60, 0], 3, { animate: false }); }, FADE); await W(3500);
    await page.evaluate(() => {
      [...document.getElementById('locationsList').children].forEach(r => { if (r.classList.contains('sec-head') || !/MALMÖ/i.test(r.textContent)) r.remove(); });
      document.getElementById('locationsList').scrollTop = 0;
      window.__fade('malmo');
      // a faded board pressed: the shipped --state-press face, as any sign tapped
      const b = [...document.querySelectorAll('.sp-board')].find(x => x.dataset.cityBadge === 'stockholm');
      if (b) b.querySelector('.sp-fill').style.fill = 'var(--state-press)';
    });
  },
};

const SHEETS = [
  ['1-A-claim-stub', '1 · Recommended: hold a city, it tears off a claim stub that says Remove', [
    ['A1-hold-perforates', 'Hold', 'A perforation punches down the row\'s end, hole by hole, as the hold runs.'],
    ['A2-perforated', 'Perforated', 'The line is done; the row is fully pressed.'],
    ['A3-stub-tears-off', 'The stub tears off', 'Let go: the end of the row comes away as a claim stub reading REMOVE, a little askew.'],
    ['A4-tap-the-stub', 'Tap the stub', 'Only then the confirm opens. Tap anywhere else and the stub tucks back.'],
  ]],
  ['2-B-due-date-stamp', '2 · Alternative: hold a city, a rubber stamp inks REMOVE? on it', [
    ['B1-stamp-inks', 'Hold', 'A stamp comes down on the row, the ink bleeding in (the visited stamp\'s motion).'],
    ['B2-stamped', 'Stamped', 'REMOVE? in deep orange ink. Tap it for the confirm; it dries up if you don\'t.'],
  ]],
  ['3-picked-city', '3 · A city picked: no repeated header, other signposts faded but tappable', [
    ['L1-picked-city-list', 'Malmö picked', 'The list starts with Malmö\'s first place: no header (the title says Malmö). Stockholm\'s faded board is being tapped.'],
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
