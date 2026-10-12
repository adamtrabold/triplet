// Concept B (striker strip) -- systems pass: rough structural frames + measurements in the real app.
// Builds ./index.html = a COPY of the real index.html with concept.inc.html injected before </body>, then renders it.
// Run: node render.js   (ONLY=<prefix>)   Output: frames/*.png (3x, 1x desktop) + measure.json
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const REAL = '/home/user/la-trip-map/index.html', COPY = path.join(__dirname, 'index.html'), OUT = path.join(__dirname, 'frames');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(COPY, fs.readFileSync(REAL, 'utf8').replace('</body>', fs.readFileSync(path.join(__dirname, 'concept.inc.html'), 'utf8') + '\n</body>'));

const TAB = h => h.replace('</head>', '<style>:root{--chrome-bottom:100px!important}</style></head>');   // Safari tab: the sheet runs under a ~100px toolbar
const PICK = { lat: 64.1417, lon: -21.9266, name: 'Hallgrímskirkja, Hallgrímstorg 1, Miðborg, Reykjavík, 101, Iceland',
  ad: { tourism: 'attraction', house_number: '1', road: 'Hallgrímstorg', suburb: 'Miðborg', city: 'Reykjavík', postcode: '101', country: 'Iceland', country_code: 'is' } };
const RESULTS = [PICK, { lat: 64.1466, lon: -21.9426, name: 'Hallgrímskirkja bus stop, Skólavörðustígur, Reykjavík, Iceland', ad: { city: 'Reykjavík', country_code: 'is' } },
  { lat: 64.135, lon: -21.89, name: 'Hallgríms Bistro, Laugavegur 120, Reykjavík, Iceland', ad: { city: 'Reykjavík', country_code: 'is' } },
  { lat: 65.68, lon: -18.09, name: 'Hallgrímskirkja, Akureyri, Iceland', ad: { town: 'Akureyri', country_code: 'is' } }];
// Nominatim is blocked in the sandbox: put stand-in results into the app's own dropdown, wired to its own selectAddress()
const showResults = (page, typed) => page.evaluate(({ R, typed }) => {
  const n = document.getElementById('nameInput'); n.value = typed;
  const ac = document.getElementById('addressAutocomplete');
  ac.innerHTML = R.map(r => `<div class="autocomplete-item" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.name}" data-address-details='${JSON.stringify(r.ad)}'>${r.name}</div>`).join('');
  ac.querySelectorAll('.autocomplete-item').forEach(i => { i.onclick = () => selectAddress(i); }); ac.classList.add('show');
}, { R: RESULTS, typed });
const fakeKb = (page, kbH, label) => page.evaluate(({ kbH, label }) => {
  window.__fakeVV = { height: innerHeight - kbH, offsetTop: 0 }; window.__conceptKb();
  const k = document.createElement('div'); k.id = 'fakeKb'; k.style.height = kbH + 'px'; k.textContent = label; document.body.appendChild(k);
}, { kbH, label });
const fakeToolbar = page => page.evaluate(() => { const t = document.createElement('div'); t.id = 'fakeToolbar'; t.style.height = '100px'; t.textContent = 'Safari toolbar (drawn stand-in, ~100px = --chrome-bottom)'; document.body.appendChild(t); });

const S = {
  today_664:   { html: REAL, vp: [390, 664] },                                   // row-count baseline
  rest_844:    { vp: [390, 844] },
  rest_664:    { vp: [390, 664] },
  collapsed_safe: { vp: [390, 844], inset: true, pre: 'collapse' },               // Home Screen, 34px inset: band + strip stacking
  tab_664:     { vp: [390, 764], patch: TAB, toolbar: true },                     // Safari tab: strip directly above the toolbar
  open_664:    { vp: [390, 664], q: '?play', tap: true },                         // form risen, strip = "Pick a place first", x
  results_664: { vp: [390, 664], q: '?play', tap: true, results: true },          // results drop inside the form's own scroll
  picked_664:  { vp: [390, 664], q: '?play', tap: true, pick: true },             // strip = "Add Hallgrímskirkja"
  done_664:    { vp: [390, 664], q: '?play', tap: true, pick: true, submit: true },// tap the strip again: added, form closed
  kb_844:      { vp: [390, 844], inset: true, q: '?play', tap: true, results: true, kb: 336 },  // Home Screen + keyboard
  kb_664:      { vp: [390, 664], q: '?play', tap: true, results: true, kb: 336 },              // Safari-tab height + keyboard (worst case)
  tag_844:     { vp: [390, 844], pre: 'tag' },
  tagform_844: { vp: [390, 844], q: '?play', pre: 'tag', tap: true },             // tag stays visible above the risen form?
  filters_844: { vp: [390, 844], q: '?play', pre: 'filters', tap: true },
  cph_320:     { vp: [320, 568], city: 'copenhagen' },
  cph_320_open: { vp: [320, 568], city: 'copenhagen', q: '?play', tap: true, pick: true },
  signedout_tap: { vp: [390, 844], q: '?signin', tap: true },
  desktop_rest: { vp: [1280, 800], desk: true },
  desktop_open: { vp: [1280, 800], desk: true, q: '?play', tap: true, pick: true },
};
(async () => {
  const b = await L.launch(); const out = {};
  for (const [name, s] of Object.entries(S).filter(([n]) => !process.env.ONLY || n.startsWith(process.env.ONLY))) {
    const { ctx, page, errs } = await L.open(b, { html: s.html || COPY, ...s });
    if (s.city) { await page.evaluate(c => setActiveCity(c), s.city); await page.waitForTimeout(900); }
    if (s.pre === 'collapse') { await page.click('#collapseBtn'); await page.waitForTimeout(600); }
    if (s.pre === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(600); }
    if (s.pre === 'tag') { const c = await page.$$('#locationsList .location-card[data-id]'); await c[1].click(); await page.waitForTimeout(1700); }
    if (s.toolbar) await fakeToolbar(page);
    const m = { rows: await L.rowsVisible(page), map: await L.box(page, '#map'), sheet: await L.box(page, '#locations'), header: await L.box(page, '#locationsHeader'), strip: await L.box(page, '#strip'), attr: await L.box(page, '.leaflet-control-attribution') };
    if (s.tap) {
      await page.click(s.html ? '#floatingAddBtn' : '#strip .go'); await page.waitForTimeout(700);
      m.formOpen = await page.evaluate(() => document.getElementById('addForm').classList.contains('show'));
      m.authModal = await page.evaluate(() => document.getElementById('authModal').classList.contains('show'));
      m.panelOpen = await page.evaluate(() => document.getElementById('filtersPanel').classList.contains('visible'));
      if (s.results) { await page.focus('#nameInput').catch(() => {}); await showResults(page, 'Hallgr'); await page.waitForTimeout(200); }
      if (s.kb) await fakeKb(page, s.kb, `iOS keyboard (drawn, ${s.kb}pt)`);
      if (s.pick) { await showResults(page, 'Hallgr'); await page.click('.autocomplete-item'); await page.waitForTimeout(400); }
      await page.waitForTimeout(300);
      m.form = await L.box(page, '#controls'); m.stripOpen = await L.box(page, '#strip'); m.stripLabel = await page.evaluate(() => document.querySelector('#strip .go').textContent);
      m.stripDisabled = await page.evaluate(() => document.querySelector('#strip .go').getAttribute('aria-disabled'));
      m.goHit = await L.hit(page, '#strip .go'); m.xHit = await L.hit(page, '#strip .x');
      m.search = await L.box(page, '#nameInput'); m.searchHit = await L.hit(page, '#nameInput');
      m.results = await L.box(page, '#addressAutocomplete'); m.acct = await L.box(page, '#accountBtn');
      m.tag = await L.box(page, '.tag-popup');
      m.attrOpen = await L.box(page, '.leaflet-control-attribution');
      if (s.submit) {
        const before = await page.evaluate(() => locations.length);
        await page.click('#strip .go'); await page.waitForTimeout(1200);
        m.added = (await page.evaluate(() => locations.length)) - before;
        m.formAfter = await page.evaluate(() => document.getElementById('addForm').classList.contains('show'));
        m.stripLabelAfter = await page.evaluate(() => document.querySelector('#strip .go').textContent);
      }
    }
    m.errs = errs; out[name] = m; console.log(name, JSON.stringify(m));
    await page.screenshot({ path: `${OUT}/${name}-${s.desk ? 1 : 3}x.png` });
    if (name === 'open_664') {   // cancel: x, then reopen keeps the draft
      await showResults(page, 'Hallgr'); await page.click('.autocomplete-item'); await page.waitForTimeout(200);
      await page.click('#strip .x'); await page.waitForTimeout(400);
      const c = { formOpen: await page.evaluate(() => document.getElementById('addForm').classList.contains('show')), label: await page.evaluate(() => document.querySelector('#strip .go').textContent), rows: await L.rowsVisible(page) };
      await page.click('#strip .go'); await page.waitForTimeout(400);
      c.reopenedDraft = await page.evaluate(() => document.getElementById('nameInput').value); c.reopenLabel = await page.evaluate(() => document.querySelector('#strip .go').textContent);
      out.cancel_664 = c; console.log('cancel_664', JSON.stringify(c));
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, `measure${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`), JSON.stringify(out, null, 1));
  await b.close();
})();
