// City CRUD v5: picking a city in the title menu filters the list and the map to that city (owner:
// "Why would Stockholm be shown if Malmö is selected" ... "yeah that's weird"). Frames on the built
// index.html + the design layer (other cities' sections and pins taken out to show the filter), then sheets.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v5/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
const ALL = ['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm'];
// one city: every other city is out of the list and the map (hidden, then their greyed headers dropped)
const ONLY = id => `(() => { CC.hideOnly(${JSON.stringify(ALL)}.filter(c => c !== '${id}')); goToCity('${id}'); })`;
const DROP_OTHERS = `document.querySelectorAll('#locationsList .sec-head.is-hidden').forEach(h => h.remove());
  const f = document.querySelector('#locationsList .sec-head'); if (f) f.classList.add('is-first');
  document.querySelectorAll('#locationsList .sec-head .sec-eye').forEach(e => e.style.visibility = 'hidden');`;
const FOOT = id => `(() => { const list = document.getElementById('locationsList');
  list.insertAdjacentHTML('beforeend', '<div class="plan-foot cc-cityfoot" role="group"><button type="button" class="plan-act" style="color:var(--ink-2)">Remove ${id}…</button></div>');
  return list.querySelector('.cc-cityfoot'); })()`;

const FRAMES = {
  async 'F1-malmo-only'(page) {
    await page.evaluate(s => eval(s)(), ONLY('malmo')); await W(1500);
    await page.evaluate(s => eval(s), DROP_OTHERS); await W(300);
  },
  async 'F2-all-places'(page) {
    await page.evaluate(() => { hiddenCities.clear(); hiddenCities.add('stockholm'); persistHiddenCities(); goToCity(ALL_CITIES); map.setView([57, 5], 3, { animate: false }); }); await W(2500);
    await page.evaluate(() => { const list = document.getElementById('locationsList'); const h = cityHeads.get('stockholm').el; list.scrollTop += h.getBoundingClientRect().top - list.getBoundingClientRect().top - 120; }); await W(300);
  },
  async 'F3-remove-at-the-foot'(page) {
    await page.evaluate(s => eval(s)(), ONLY('malmo')); await W(1500);
    await page.evaluate(([d, f]) => { eval(d); const foot = eval(f); const list = document.getElementById('locationsList');
      list.insertAdjacentHTML('beforeend', '<div style="height:40px"></div>'); list.scrollTop = list.scrollHeight; }, [DROP_OTHERS, FOOT('Malmö')]); await W(300);
  },
  async 'F4-remove-confirm'(page) {
    await page.evaluate(s => eval(s)(), ONLY('malmo')); await W(1500);
    await page.evaluate(([d, f]) => { eval(d); const foot = eval(f);
      foot.outerHTML = '<div class="cc-expand" style="padding:var(--s2) var(--gutter);background:var(--paper-raised)"><div class="cc-q" style="font-weight:600">Remove Malmö from your cities?</div>'
        + `<div class="cc-choice"><span class="cc-radio on"></span><span class="cc-lab">Move its 23 places to</span><button type="button" class="route-city" style="margin-left:0"><span class="route-city-name">Copenhagen</span>${CC.ICO.chev}</button></div>`
        + '<div class="cc-choice"><span class="cc-radio"></span><span class="cc-lab">Remove the 23 places too</span></div>'
        + '<div class="cc-help" style="margin-top:4px">Copenhagen is ≈ 30 km away, so it\'s picked for you.</div>'
        + '<div class="cc-acts" style="margin-top:var(--s2)"><span class="cc-btn">Cancel</span><span class="cc-btn go">Remove</span></div></div>';
      const list = document.getElementById('locationsList'); list.insertAdjacentHTML('beforeend', '<div style="height:400px"></div>');
      const c = list.querySelector('.cc-expand'); list.scrollTop += c.getBoundingClientRect().top - list.getBoundingClientRect().top - 60; }, [DROP_OTHERS, FOOT('Malmö')]); await W(300);
  },
};

const SHEETS = [
  ['1-a-city-means-that-city', '1 · Picking a city shows that city (list and map)', [
    ['F1-malmo-only', 'Malmö', 'Title menu → Malmö: the list is Malmö\'s places only, and the map draws only Malmö\'s pins.'],
    ['F2-all-places', 'All places', 'Every city in sections, as today. The eye hides a city from All places: Stockholm is greyed and folded, and has no signpost.'],
  ]],
  ['2-remove-city', '2 · Remove city: at the foot of the city\'s own list', [
    ['F3-remove-at-the-foot', 'After the last place', 'Scrolled to the end of Malmö: one quiet "Remove Malmö…", nothing else.'],
    ['F4-remove-confirm', 'What happens to its places', 'Copenhagen is within reach, so moving there is picked. Or remove the places too.'],
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
