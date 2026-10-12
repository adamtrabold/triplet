// Concept C (pencilled pin) -- systems pass: rough structural frames + measurements in the real app.
// Builds ./index.html = a COPY of the real index.html with concept.inc.html injected before </body>, then renders it.
// Run: node render.js   (ONLY=<prefix>)   Output: frames/*.png + measure.json
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const REAL = '/home/user/la-trip-map/index.html', COPY = path.join(__dirname, 'index.html'), OUT = path.join(__dirname, 'frames');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(COPY, fs.readFileSync(REAL, 'utf8').replace('</body>', fs.readFileSync(path.join(__dirname, 'concept.inc.html'), 'utf8') + '\n</body>'));
const PICK = { lat: 64.1417, lon: -21.9266, name: 'Hallgrímskirkja, Hallgrímstorg 1, Miðborg, Reykjavík, 101, Iceland',
  ad: { tourism: 'attraction', house_number: '1', road: 'Hallgrímstorg', suburb: 'Miðborg', city: 'Reykjavík', postcode: '101', country: 'Iceland', country_code: 'is' } };
const RESULTS = [PICK, { lat: 64.1466, lon: -21.9426, name: 'Hallgrímskirkja bus stop, Skólavörðustígur, Reykjavík, Iceland', ad: { city: 'Reykjavík', country_code: 'is' } },
  { lat: 64.135, lon: -21.89, name: 'Hallgríms Bistro, Laugavegur 120, Reykjavík, Iceland', ad: { city: 'Reykjavík', country_code: 'is' } },
  { lat: 65.68, lon: -18.09, name: 'Hallgrímskirkja, Akureyri, Iceland', ad: { town: 'Akureyri', country_code: 'is' } }];
const showResults = (page, typed) => page.evaluate(({ R, typed }) => {
  document.getElementById('nameInput').value = typed; const ac = document.getElementById('addressAutocomplete');
  ac.innerHTML = R.map(r => `<div class="autocomplete-item" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.name}" data-address-details='${JSON.stringify(r.ad)}'>${r.name}</div>`).join('');
  ac.querySelectorAll('.autocomplete-item').forEach(i => { i.onclick = () => selectAddress(i); }); ac.classList.add('show');
}, { R: RESULTS, typed });
const fakeKb = (page, kbH) => page.evaluate(kbH => { window.__fakeVV = { height: innerHeight - kbH, offsetTop: 0 }; window.__conceptKb();
  const k = document.createElement('div'); k.id = 'fakeKb'; k.style.cssText = `position:fixed;left:0;right:0;bottom:0;height:${kbH}px;z-index:3000;background:#CED2D9;font:600 13px -apple-system,system-ui,sans-serif;color:#6b7280;text-align:center;padding-top:18px;box-sizing:border-box`;
  k.textContent = `iOS keyboard (drawn, ${kbH}pt)`; document.body.appendChild(k); }, kbH);
const S = {
  rest_844: { vp: [390, 844] }, rest_664: { vp: [390, 664] },
  collapsed_safe: { vp: [390, 844], inset: true, pre: 'collapse' },
  tag_844: { vp: [390, 844], pre: 'tag' },                      // the pin vs the tag's 48px gap
  tag_664: { vp: [390, 664], pre: 'tag' },
  filters_844: { vp: [390, 844], pre: 'filters' },
  filters_664: { vp: [390, 664], pre: 'filters' },
  cph_320: { vp: [320, 568], city: 'copenhagen' },
  search_664: { vp: [390, 664], q: '?play', tap: true, results: true, kb: 336 },   // keyboard up, results grow upward
  search_844: { vp: [390, 844], inset: true, q: '?play', tap: true, results: true, kb: 336 },
  placed_844: { vp: [390, 844], q: '?play', tap: true, pick: true },
  placed_664: { vp: [390, 664], q: '?play', tap: true, pick: true },
  placed_320: { vp: [320, 568], q: '?play', tap: true, pick: true },
  shape_664: { vp: [390, 664], q: '?play', tap: true, pick: true, shape: 'district' },
  done_664: { vp: [390, 664], q: '?play', tap: true, pick: true, submit: true },
  canceltag_844: { vp: [390, 844], q: '?play', pre: 'tag', tap: true, pick: true, cancel: true },
  signedout_tap: { vp: [390, 844], q: '?signin', tap: true },
  desktop_rest: { vp: [1280, 800], desk: true },
  desktop_placed: { vp: [1280, 800], desk: true, q: '?play', tap: true, pick: true },
};
(async () => {
  const b = await L.launch(); const out = {};
  for (const [name, s] of Object.entries(S).filter(([n]) => !process.env.ONLY || n.startsWith(process.env.ONLY))) {
    const { ctx, page, errs } = await L.open(b, { html: COPY, ...s });
    if (s.city) { await page.evaluate(c => setActiveCity(c), s.city); await page.waitForTimeout(900); }
    if (s.pre === 'collapse') { await page.click('#collapseBtn'); await page.waitForTimeout(600); }
    if (s.pre === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(600); }
    if (s.pre === 'tag') { const c = await page.$$('#locationsList .location-card[data-id]'); await c[1].click(); await page.waitForTimeout(1700); }
    const m = { rows: await L.rowsVisible(page), map: await L.box(page, '#map'), header: await L.box(page, '#locationsHeader'), pin: await L.box(page, '#pencilPin'), pinHit: await L.hit(page, '#pencilPin'), attr: await L.box(page, '.leaflet-control-attribution'), tagBefore: await L.box(page, '.tag-popup') };
    if (s.pre === 'tag') m.tagKey = await page.evaluate(() => openTagKey());
    if (s.tap) {
      const centerBefore = await page.evaluate(() => [map.getCenter().lat, map.getCenter().lng, map.getZoom()]);
      await page.click('#pencilPin'); await page.waitForTimeout(800);
      m.authModal = await page.evaluate(() => document.getElementById('authModal').classList.contains('show'));
      m.adding = await page.evaluate(() => document.body.classList.contains('pinadd'));
      m.focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
      m.bar = await L.box(page, '#pinBar'); m.xHit = await L.hit(page, '#pinBar .pin-x');
      if (s.results) { await showResults(page, 'Hallgr'); if (s.kb) await fakeKb(page, s.kb); await page.waitForTimeout(200); m.barKb = await L.box(page, '#pinBar'); m.results = await L.box(page, '#addressAutocomplete'); }
      if (s.pick) { await showResults(page, 'Hallgr'); await page.click('.autocomplete-item'); await page.waitForTimeout(600);
        if (s.shape) { await page.selectOption('#categoryInput', s.shape); await page.evaluate(() => { const r = document.getElementById('addressAutocomplete').closest('.autocomplete-item'); }); await page.waitForTimeout(200); }
        m.c = await page.evaluate(() => window.__cMeasure); m.tag = await L.box(page, '#blankTag'); m.submit = await L.box(page, '#submitBtn'); m.submitHit = await L.hit(page, '#submitBtn');
        m.category = await L.box(page, '#categoryInput'); m.categoryHit = await L.hit(page, '#categoryInput'); m.notesHit = await L.hit(page, '#notesInput');
        m.marker = await L.box(page, '.pencil-marker'); m.barAfterPick = await L.box(page, '#pinBar'); m.acct = await L.box(page, '#accountBtn'); }
      if (s.submit) { const n0 = await page.evaluate(() => locations.length); await page.click('#submitBtn'); await page.waitForTimeout(2200);
        m.added = (await page.evaluate(() => locations.length)) - n0; m.addingAfter = await page.evaluate(() => document.body.classList.contains('pinadd'));
        await page.waitForTimeout(1500); m.cAfter = await page.evaluate(() => window.__cAfter); m.tagAfter = await L.box(page, '.tag-popup'); m.tagAfterName = await page.evaluate(() => { const t = document.querySelector('.tag-popup'); return t && t.innerText.split('\n')[0]; });
        m.listCollapsedAfter = await page.evaluate(() => document.getElementById('locations').classList.contains('collapsed')); }
      if (s.cancel) { await page.screenshot({ path: `${OUT}/${name}-before-cancel-3x.png` }); await page.click('#pinBar .pin-x'); await page.waitForTimeout(2000);
        m.afterCancel = { adding: await page.evaluate(() => document.body.classList.contains('pinadd')), tagKey: await page.evaluate(() => openTagKey()), listCollapsed: await page.evaluate(() => document.getElementById('locations').classList.contains('collapsed')),
          view: await page.evaluate(() => [map.getCenter().lat, map.getCenter().lng, map.getZoom()]), viewBefore: centerBefore, nameDraft: await page.evaluate(() => document.getElementById('nameInput').value) }; }
    }
    m.errs = errs; out[name] = m; console.log(name, JSON.stringify(m));
    await page.screenshot({ path: `${OUT}/${name}-${s.desk ? 1 : 3}x.png` });
    await ctx.close();
  }
  // collisions: real pins under the resting blank pin, every city, list up and collapsed
  out.collisions = {};
  for (const city of ['la', 'reykjavik', 'copenhagen', 'malmo', 'stockholm']) for (const col of [false, true]) {
    const { ctx, page } = await L.open(b, { html: COPY, vp: [390, 844], dsf: 1 });
    await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(900);
    if (col) { await page.click('#collapseBtn'); await page.waitForTimeout(600); }
    out.collisions[city + (col ? '_collapsed' : '')] = await page.evaluate(() => { const p = document.getElementById('pencilPin').getBoundingClientRect();
      const ms = [...document.querySelectorAll('.leaflet-marker-icon, .leaflet-interactive')].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > p.left && r.left < p.right && r.bottom > p.top && r.top < p.bottom; });
      return { under: ms.length, total: document.querySelectorAll('.leaflet-marker-icon').length }; });
    await ctx.close();
  }
  console.log('collisions', JSON.stringify(out.collisions));
  fs.writeFileSync(path.join(__dirname, `measure${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`), JSON.stringify(out, null, 1));
  await b.close();
})();
