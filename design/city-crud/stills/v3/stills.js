// City CRUD v3: replacing "Delete city" (owner: "Idk about delete city though — brainstorm better
// options"). Frames for the recommended option (A: a city lives only while it holds a place) and one
// alternative (C: pack a trip away), then the sheets.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/v3/stills.js [prefix|sheets]
const path = require('path'), fs = require('fs');
const { open, P, W } = require('../../proto/lib-cc.js');
const OUT = path.join(__dirname, 'raw');
fs.mkdirSync(OUT, { recursive: true });
const STORAGE = { 'gh.plans': '1', 'triplet.reorderHint': '1' };
const SEEDS = ['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm'];
const TOWNSHIP = () => {
  CITIES.eastmarl = { label: 'East Marlborough Township', center: [39.866, -75.655], zoom: 12, viewbox: '-75.75,39.83,-75.60,39.91' };
  locations = locations.map(l => l.id === 'phl03' ? { ...l, city: 'eastmarl' } : l); window.__ROWS.forEach(r => { if (r.id === 'phl03') r.city = 'eastmarl'; });
};
const SETUP = `(() => { CC.seedPhilly(true, ['phl01', 'phl02', 'phl03']); (${TOWNSHIP})(); CC.hideOnly(${JSON.stringify(SEEDS)}); })`;
async function openTagOf(page, id) {
  await page.evaluate(id => { const en = rowEntry(id); en.el.scrollIntoView({ block: 'center' }); en.el.click(); }, id); await W(2000);
}
// scroll the list so a node sits at its top (with room below to scroll into)
const TO = `window.__to = el => { const list = document.getElementById('locationsList'); if (!list.querySelector('.cc-pad')) list.insertAdjacentHTML('beforeend', '<div class="cc-pad" style="height:600px"></div>'); list.scrollTop += el.getBoundingClientRect().top - list.getBoundingClientRect().top; };`;
// the drying header: the un-visit's dry-up ink, part way (paper showing through the ink by texture)
const DRY = 'opacity:.5;-webkit-mask-image:var(--tex-stamp);mask-image:var(--tex-stamp);-webkit-mask-size:70px 70px;mask-size:70px 70px;';

const FRAMES = {
  // ---- A: a city lives only while it holds a place ----
  async 'A1-move-the-last-place'(page) {
    await page.evaluate(s => { eval(s)(); goToCity('eastmarl'); }, SETUP); await W(1500);
    await openTagOf(page, 'phl03');
    await P.tap(page, '.leaflet-popup .tag-city');
  },
  async 'A2-it-dries-up'(page) {
    await page.evaluate(s => { eval(s)(); goToCity('philadelphia'); }, SETUP); await W(1500);
    await page.evaluate(() => { locations = locations.map(l => l.id === 'phl03' ? { ...l, city: 'philadelphia' } : l); window.__ROWS.forEach(r => { if (r.id === 'phl03') r.city = 'philadelphia'; }); updateUI(); }); await W(600);
    await openTagOf(page, 'phl03');
    await page.evaluate(([TO, DRY]) => {
      eval(TO);
      const last = rowEntry('phl01').el;
      last.insertAdjacentHTML('afterend', `<div class="sec-head" style="${DRY}"><h3 class="sec-title"><span class="sec-name"><span class="h-name">East Marlborough Township</span><span class="tally">0</span></span></h3><span class="sec-eye">${eyeSvg(false, '--paper')}</span></div>`);
      window.__to(rowEntry('phl02').el);
    }, [TO, DRY]);
  },
  async 'A3-gone-everywhere'(page) {
    await page.evaluate(s => { eval(s)(); }, SETUP); await W(300);
    await page.evaluate(() => { locations = locations.map(l => l.id === 'phl03' ? { ...l, city: 'philadelphia' } : l); window.__ROWS.forEach(r => { if (r.id === 'phl03') r.city = 'philadelphia'; }); delete CITIES.eastmarl; CC.unhideAll(); goToCity('philadelphia'); map.setView([39.95, -75.16], 10, { animate: false }); toggleSheetCollapsed(); }); await W(1500);
    await page.evaluate(() => map.invalidateSize()); await W(2500);
    await P.tap(page, '#titleBtn'); await W(400);
  },
  async 'A4-done-with-a-trip'(page) {
    await page.evaluate(s => { eval(s)(); }, SETUP); await W(300);
    await page.evaluate(TO => { eval(TO); hiddenCities.clear(); hiddenCities.add('stockholm'); persistHiddenCities(); goToCity('philadelphia'); }, TO); await W(1500);
    await page.evaluate(() => window.__to(cityHeads.get('stockholm').el)); await W(300);
  },
  // ---- C: pack a trip away ----
  async 'C1-pack-away'(page) {
    await page.evaluate(TO => { eval(TO); CC.hideOnly(['la', 'reykjavik', 'copenhagen', 'malmo']); goToCity('stockholm'); }, TO); await W(1500);
    await page.evaluate(() => {
      const head = cityHeads.get('stockholm').el; let n = head.nextElementSibling, last = head;
      while (n && !n.classList.contains('sec-head') && !n.classList.contains('cc-pad')) { if (n.matches('.location-card, .shape-card, [data-id]')) last = n; n = n.nextElementSibling; }
      last.insertAdjacentHTML('afterend', '<div class="plan-foot" role="group"><button type="button" class="plan-act">Pack away…</button></div>');
      const list = document.getElementById('locationsList'); list.scrollTop = list.scrollHeight;
      const foot = list.querySelector('.plan-foot'); list.scrollTop += foot.getBoundingClientRect().bottom - list.getBoundingClientRect().bottom + 120;
    });
  },
  async 'C2-packed-away'(page) {
    await page.evaluate(() => { CC.hideOnly(['stockholm']); map.setView([59.33, 18.07], 11, { animate: false }); toggleSheetCollapsed(); }); await W(1500);
    await page.evaluate(() => map.invalidateSize()); await W(2500);
    await P.tap(page, '#titleBtn'); await W(400);
    await page.evaluate(() => {
      const m = document.getElementById('titleMenu');
      CC.grow(m, () => {
        [...m.querySelectorAll('.menu-row')].forEach(r => { if (/stockholm/i.test(r.textContent)) r.remove(); });
        const kind = m.querySelector('.menu-row[data-kind]');
        kind.insertAdjacentHTML('beforebegin', '<button type="button" class="menu-row"><svg class="menu-ico is-quiet" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16v11H4zM3 5h18v3H3zM10 12h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg><span class="menu-lab" style="color:var(--ink-2)">Packed away<span class="tally" style="margin-left:6px">1</span></span><span class="menu-gap"></span>'
          + '<svg class="menu-end" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5l4.5 4.5L6 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>');
      }, false);
    });
  },
};

const SHEETS = [
  ['1-A-cities-come-and-go', '1 · Recommended: a city exists only while it holds a place (no Delete city)', [
    ['A1-move-the-last-place', 'Move its last place out', 'Longwood Gardens is the only place in East Marlborough Township. Its city menu: pick Philadelphia.'],
    ['A2-it-dries-up', 'The city dries up', 'Longwood is now in Philadelphia. The empty township\'s header fades out with the un-visit\'s dry-up ink.'],
    ['A3-gone-everywhere', 'Gone everywhere', 'Nothing left to delete: the title menu no longer lists East Marlborough Township.'],
    ['A4-done-with-a-trip', 'Done with a trip?', 'Hide it with the eye (shipped): Stockholm is greyed and folded, its places and stamps kept.'],
  ]],
  ['2-C-pack-a-trip-away', '2 · Alternative: pack a finished trip away', [
    ['C1-pack-away', 'Pack away…', 'Under the city you\'ve gone to: put the whole trip away, places, stars and stamps kept.'],
    ['C2-packed-away', 'Packed away', 'Stockholm leaves the list, map and menus; it waits under "Packed away 1" in the title menu.'],
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
  const FW = 300;
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, frames] of SHEETS) {
    if (!frames.every(([f]) => fs.existsSync(path.join(OUT, f + '.png')))) continue;
    const cells = frames.map(([f, h, c]) => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, f + '.png')).toString('base64')}"><figcaption><b>${h}</b><span>${c}</span></figcaption></figure>`).join('');
    const w = frames.length * FW + (frames.length + 1) * 20;
    await page.setViewportSize({ width: Math.max(w, 700), height: 600 });
    await page.setContent(`<!doctype html><html><head><style>
      body { margin: 0; padding: 20px; background: #F2EBDD; font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #12293F; width: ${Math.max(w, 700) - 40}px; }
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
