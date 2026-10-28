// City CRUD v4 (owner on v3: "there should Be the ability to create a city without a stop. I think
// there should be a remove city but it shouldn't be a front and center control"). Frames on the BUILT
// index.html (v2 build, 908dd0c) + ../../proto/design-layer.js for the new states, then the sheets.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v4/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
const DC = [38.9, -77.04];   // the map where you'd plan a Philadelphia trip from
const FOUND = [   // the built search's own result voice (design/city-crud/build/stills), distances from DC
  { name: 'Philadelphia', where: 'City · Pennsylvania, United States · ≈ 200 km away' },
  { name: 'Philadelphia', where: 'Village · New York, United States · ≈ 590 km away' },
  { name: 'Philadelphia', where: 'Village · Tennessee, United States · ≈ 750 km away' },
  { name: 'Philadelphia', where: 'Town · Mississippi, United States · ≈ 1,280 km away' },
];
async function titleMenuOverMap(page, ll, z) {
  await page.evaluate(([ll, z]) => { CC.unhideAll(); map.setView(ll, z, { animate: false }); toggleSheetCollapsed(); }, [ll, z]); await W(1500);
  await page.evaluate(() => map.invalidateSize()); await W(3000);
  await P.tap(page, '#titleBtn'); await W(400);
}
const TO = `window.__to = el => { const list = document.getElementById('locationsList'); if (!list.querySelector('.cc-pad')) list.insertAdjacentHTML('beforeend', '<div class="cc-pad" style="height:600px"></div>'); list.scrollTop += el.getBoundingClientRect().top - list.getBoundingClientRect().top; };`;
// the hidden header's quiet Remove… (only on a hidden city's header, before its closed eye)
const REMOVE_BTN = `const h = cityHeads.get('stockholm').el; h.style.gridTemplateColumns = '1fr auto var(--col-glyph)';
  h.querySelector('.sec-eye').insertAdjacentHTML('beforebegin', '<button type="button" class="plan-act" style="align-self:end;height:32px;padding:0 var(--s2);margin-bottom:0;color:var(--ink-2)">Remove…</button>');`;

const FRAMES = {
  // ---- making a city with no stop ----
  async 'N1-new-city'(page) {
    await titleMenuOverMap(page, DC, 6);
    await page.evaluate(() => CC.titleMenuNewCity());
  },
  async 'N2-find-in-the-menu'(page) {
    await titleMenuOverMap(page, DC, 6);
    await page.evaluate(FOUND => {
      const m = document.getElementById('titleMenu');
      CC.grow(m, () => {
        const kind = m.querySelector('.menu-row[data-kind]');
        kind.insertAdjacentHTML('beforebegin', `<div class="menu-find" role="presentation">${CC.ICO.plus}<input type="search" class="menu-find-in" value="Philadelphia" aria-label="Find a city"></div><div class="menu-find-res">${findCityRowsHtml(FOUND)}</div>`);
        m.classList.add('is-finding');
      }, false);
      m.style.width = 'calc(100vw - 32px)'; m.style.maxWidth = 'none';
      m.scrollTop = m.querySelector('.menu-find').offsetTop;
      const i = m.querySelector('.menu-find-in'); i.focus(); i.setSelectionRange(12, 12);
    }, FOUND);
  },
  async 'N3-an-empty-city'(page) {
    await page.evaluate(() => { CC.seedPhilly(false); CC.unhideAll(); setActiveCity('philadelphia'); }); await W(1800);
    await page.evaluate(() => {
      const list = document.getElementById('locationsList');
      list.insertAdjacentHTML('afterbegin', `<div class="sec-head is-first"><h3 class="sec-title"><button type="button" class="sec-name"><span class="h-name">Philadelphia</span><span class="tally">0</span></button></h3><button type="button" class="sec-eye">${eyeSvg(false, '--paper')}</button></div>`
        + '<div class="cc-note">Nothing here yet. Tap + to add a place; it\'s yours until you remove it.</div>');
      list.querySelectorAll('.sec-head.is-first').forEach((h, i) => { if (i > 0) h.classList.remove('is-first'); });
      list.scrollTop = 0;
      const t = document.querySelector('#titleBtn .title-text'); if (t) t.innerHTML = '<span class="h-name">Philadelphia</span><span class="tally">0</span>';
    });
  },
  // ---- Remove city: behind the eye ----
  async 'R1-remove-behind-the-eye'(page) {
    await page.evaluate(TO => { eval(TO); hiddenCities.clear(); hiddenCities.add('stockholm'); persistHiddenCities(); goToCity('malmo'); }, TO); await W(1500);
    await page.evaluate(src => { eval(src); window.__to(cityHeads.get('stockholm').el); }, `${TO} ${REMOVE_BTN}`); await W(300);
  },
  async 'R2-what-happens-to-its-places'(page) {
    await page.evaluate(TO => { eval(TO); hiddenCities.clear(); hiddenCities.add('stockholm'); persistHiddenCities(); goToCity('malmo'); }, TO); await W(1500);
    await page.evaluate(src => {
      eval(src);
      const h = cityHeads.get('stockholm').el;
      h.insertAdjacentHTML('afterend', '<div class="cc-expand" style="padding:var(--s2) var(--gutter);background:var(--paper-raised)"><div class="cc-q" style="font-weight:600">Remove Stockholm from your cities?</div>'
        + `<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Move its 23 places to</span><button type="button" class="route-city" style="margin-left:0"><span class="route-city-name">Malmö</span>${CC.ICO.chev}</button></div>`
        + '<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Remove the 23 places too</span></div>'
        + '<div class="cc-help" style="margin-top:4px">The nearest city is ≈ 520 km away, so nothing is picked for you.</div>'
        + '<div class="cc-acts" style="margin-top:var(--s2)"><span class="cc-btn">Cancel</span><span class="cc-btn" style="color:var(--ink-2);box-shadow:inset 0 0 0 1px var(--hair)">Remove</span></div></div>');
      window.__to(h);
    }, `${TO} ${REMOVE_BTN}`); await W(300);
  },
};

const SHEETS = [
  ['1-new-city', '1 · Make a city before any place: New city in the title menu', [
    ['N1-new-city', 'New city', 'Places side of the title menu, as Plans has "New plan".'],
    ['N2-find-in-the-menu', 'Find it', 'The row becomes the same Find a city line the city menus have: real cities only, nearest first.'],
    ['N3-an-empty-city', 'An empty city, kept', 'You land in Philadelphia with nothing in it yet. A city you made stays until you remove it.'],
  ]],
  ['2-remove-city', '2 · Remove city lives behind the eye', [
    ['R1-remove-behind-the-eye', 'Hide first, then Remove…', 'Only a hidden city\'s header offers Remove…, quiet, beside its closed eye.'],
    ['R2-what-happens-to-its-places', 'What happens to its places', 'Move them to a city, or remove them too. Malmö is far, so nothing is preselected and Remove waits for a choice.'],
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
  const FW = 320;
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
