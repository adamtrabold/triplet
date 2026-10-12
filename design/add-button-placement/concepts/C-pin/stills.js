// Concept C (pencilled pin) -- OWNER STILLS (visual designer, turn 9).
// Renders this folder's index.html copy (systems' structure) + visual.inc.html (the look), injected in memory.
// Neither the real index.html nor systems' files are touched. Reykjavík, stub data, 3x, 1170 wide.
// Run: node stills.js   (ONLY=<name-prefix>)   then: node ../compose-stills.js B
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const COPY = path.join(__dirname, 'index.html'), OUT = path.join(__dirname, 'stills');
const LOOK = fs.readFileSync(path.join(__dirname, 'visual.inc.html'), 'utf8');
fs.mkdirSync(OUT, { recursive: true });
const withLook = extra => h => { const i = h.lastIndexOf('</body>'); h = h.slice(0, i) + LOOK + '\n' + h.slice(i); return extra ? extra(h) : h; };
const TAB = h => h.replace('</head>', '<style>:root{--chrome-bottom:100px!important}</style></head>');
const PICK = { lat: 64.1417, lon: -21.9266, name: 'Hallgrímskirkja, Hallgrímstorg 1, Miðborg, Reykjavík, 101, Iceland',
  ad: { tourism: 'attraction', house_number: '1', road: 'Hallgrímstorg', suburb: 'Miðborg', city: 'Reykjavík', postcode: '101', country: 'Iceland', country_code: 'is' } };
const RESULTS = [PICK, { lat: 64.1466, lon: -21.9426, name: 'Hallgrímskirkja bus stop, Skólavörðustígur, Reykjavík, Iceland', ad: { city: 'Reykjavík', country_code: 'is' } },
  { lat: 64.135, lon: -21.89, name: 'Hallgríms Bistro, Laugavegur 120, Reykjavík, Iceland', ad: { city: 'Reykjavík', country_code: 'is' } },
  { lat: 65.68, lon: -18.09, name: 'Hallgrímskirkja, Akureyri, Iceland', ad: { town: 'Akureyri', country_code: 'is' } }];
const showResults = (page, typed) => page.evaluate(({ R, typed }) => {
  const n = document.getElementById('nameInput'); n.value = typed; const ac = document.getElementById('addressAutocomplete');
  ac.innerHTML = R.map(r => `<div class="autocomplete-item" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.name}" data-address-details='${JSON.stringify(r.ad)}'>${r.name}</div>`).join('');
  ac.querySelectorAll('.autocomplete-item').forEach(i => { i.onclick = () => selectAddress(i); }); ac.classList.add('show');
}, { R: RESULTS, typed });
const pick = async page => { await showResults(page, 'Hallgr'); await page.click('.autocomplete-item'); await page.waitForTimeout(500); };
// drawn stand-ins for platform chrome (labelled as drawn in the captions)
const fakeKb = (page, kbH) => page.evaluate(kbH => { window.__fakeVV = { height: innerHeight - kbH, offsetTop: 0 }; window.__conceptKb();
  const k = document.createElement('div'); k.id = 'fakeKb'; k.style.cssText = `position:fixed;left:0;right:0;bottom:0;height:${kbH}px;z-index:3000;background:#CED2D9;font:600 13px -apple-system,system-ui,sans-serif;color:#6b7280;text-align:center;padding-top:18px;box-sizing:border-box`; k.textContent = 'iOS keyboard (drawn stand-in)'; document.body.appendChild(k); }, kbH);
const fakeToolbar = page => page.evaluate(() => { const t = document.createElement('div'); t.id = 'fakeToolbar'; t.style.height = '100px'; t.textContent = 'Safari toolbar (drawn stand-in)'; document.body.appendChild(t); });
const tapPin = async page => { await page.click('#pencilPin'); await page.waitForTimeout(900); };
const placed = async page => { await tapPin(page); await pick(page); await page.selectOption('#categoryInput', 'attraction'); await page.waitForTimeout(400); };
const openTag = async page => {
  const cards = await page.$$('#locationsList .location-card[data-id]'); let p = cards[1];
  for (const c of cards) if (await c.evaluate(e => !!e.querySelector('[class*="star"]') && e.classList.contains('visited'))) { p = c; break; }
  await p.click(); await page.waitForTimeout(1700); };
const S = {
  '1-rest-C':        { vp: [390, 844] },
  '2a-tap-664':      { vp: [390, 664], q: '?play' },
  '2b-search-664':   { vp: [390, 664], q: '?play', run: async p => { await tapPin(p); await showResults(p, 'Hallgr'); await fakeKb(p, 336); await p.waitForTimeout(300); } },
  '2c-placed-664':   { vp: [390, 664], q: '?play', run: placed },
  '2d-done-664':     { vp: [390, 664], q: '?play', run: async p => { await placed(p); await p.click('#submitBtn'); await p.waitForTimeout(3800); } },
  '2c-placed-844':   { vp: [390, 844], q: '?play', run: placed },
  '2d-done-844':     { vp: [390, 844], q: '?play', run: async p => { await placed(p); await p.click('#submitBtn'); await p.waitForTimeout(3800); } },
  '3-tag-open':      { vp: [390, 844], run: openTag },
  '5-320-copenhagen': { vp: [320, 568], city: 'copenhagen' },
  '5b-320-placed':   { vp: [320, 568], q: '?play', run: placed },
  '6a-starred-664':  { vp: [390, 664], q: '?play', run: async p => { await placed(p); await p.click('#starInput'); await p.waitForTimeout(400); } },
  '6b-district-664': { vp: [390, 664], q: '?play', run: async p => { await placed(p); await p.selectOption('#categoryInput', 'district'); await p.waitForTimeout(500); } },
  '7-collapsed-homescreen': { vp: [390, 844], inset: true, run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(700); } },
  'desktop-rest':    { vp: [1280, 800], desk: true },
  'desktop-placed':  { vp: [1280, 800], desk: true, q: '?play', run: placed },
  'pending-tag-664': { vp: [390, 664], run: openTag },
  'pending-filters-664': { vp: [390, 664], run: async p => { await p.click('#toggleFiltersBtn'); await p.waitForTimeout(700); } },
  'st-pin-rest':    { vp: [390, 844], crop: '#pencilPin' },
  'st-pin-pressed': { vp: [390, 844], crop: '#pencilPin', run: p => p.evaluate(() => { const s = document.createElement('style'); s.textContent = '#pencilPin .mini-tag-face{fill:var(--brand-orange-deep)}#pencilPin .mini-tag-word{fill:var(--paper)}'; document.head.appendChild(s); }) },
  'st-pin-1x':      { vp: [390, 844], dsf: 1, crop: '#pencilPin' },
};
(async () => {
  const b = await L.launch(); const out = {};
  for (const [name, s] of Object.entries(S).filter(([n]) => !process.env.ONLY || n.startsWith(process.env.ONLY))) {
    const { ctx, page, errs } = await L.open(b, { html: COPY, ...s, patch: withLook(s.patch) });
    await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
    if (s.run) await s.run(page);
    await page.waitForTimeout(300);
    const m = { pin: await L.box(page, '#pencilPin'), bar: await L.box(page, '#pinBar'), blank: await L.box(page, '#blankTag'), submit: await L.box(page, '#submitBtn'), submitHit: await L.hit(page, '#submitBtn'), starHit: await L.hit(page, '#starInput'), catHit: await L.hit(page, '#categoryInput'), after: await page.evaluate(() => window.__cAfter || null),
      form: await L.box(page, '#controls'), rows: await L.rowsVisible(page), tag: await L.box(page, '.tag-popup'), header: await L.box(page, '#locationsHeader'), errs };
    out[name] = m; console.log(name, JSON.stringify(m));
    const clip = s.crop ? await page.evaluate(q => { const r = document.querySelector(q).getBoundingClientRect(); return { x: Math.max(0, r.left - 150), y: r.top - 70, width: Math.min(innerWidth - Math.max(0, r.left - 150), 240), height: r.height + 110 }; }, s.crop) : undefined;
    await page.screenshot({ path: `${OUT}/${name}-${s.desk || s.dsf === 1 ? 1 : 3}x.png`, ...(clip ? { clip } : {}) });
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, `measure${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`), JSON.stringify(out, null, 1));
  await b.close();
})();
