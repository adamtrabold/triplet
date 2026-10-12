// Concept B (striker strip) -- OWNER STILLS (visual designer, turn 9).
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
  const k = document.createElement('div'); k.id = 'fakeKb'; k.style.height = kbH + 'px'; k.textContent = 'iOS keyboard (drawn stand-in)'; document.body.appendChild(k); }, kbH);
const fakeToolbar = page => page.evaluate(() => { const t = document.createElement('div'); t.id = 'fakeToolbar'; t.style.height = '100px'; t.textContent = 'Safari toolbar (drawn stand-in)'; document.body.appendChild(t); });
const tapStrip = async page => { await page.click('#strip .go'); await page.waitForTimeout(800); };
const openTag = async page => {   // the starred + visited fixture place (as the stub's still 3)
  const cards = await page.$$('#locationsList .location-card[data-id]'); let p = cards[1];
  for (const c of cards) if (await c.evaluate(e => !!e.querySelector('[class*="star"]') && e.classList.contains('visited'))) { p = c; break; }
  await p.click(); await page.waitForTimeout(1700); };

const S = {
  '1-rest-B':        { vp: [390, 844] },
  '2a-tap-664':      { vp: [390, 664], q: '?play' },
  '2b-blank-664':    { vp: [390, 664], q: '?play', run: tapStrip },
  '2c-ready-664':    { vp: [390, 664], q: '?play', run: async p => { await tapStrip(p); await pick(p); } },
  '2d-done-664':     { vp: [390, 664], q: '?play', run: async p => { await tapStrip(p); await pick(p); await p.click('#strip .go'); await p.waitForTimeout(1400); } },
  '3-tag-open':      { vp: [390, 844], run: openTag },
  '3b-tag-form':     { vp: [390, 844], q: '?play', run: async p => { await openTag(p); await tapStrip(p); await pick(p); } },
  '5-320-copenhagen': { vp: [320, 568], city: 'copenhagen' },
  '6-keyboard-notes': { vp: [390, 844], inset: true, q: '?play', run: async p => { await tapStrip(p); await pick(p);
      await p.focus('#notesInput'); await p.fill('#notesInput', 'Go up the tower at golden hour'); await fakeKb(p, 336);
      await p.evaluate(() => { const c = document.getElementById('controls'), n = document.getElementById('notesInput'); c.scrollTop = n.offsetTop - 140; }); await p.waitForTimeout(300); } },
  '7-collapsed-homescreen': { vp: [390, 844], inset: true, run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(700); } },
  '8-safari-tab':    { vp: [390, 764], patch: TAB, run: fakeToolbar },
  '9-filters-then-add': { vp: [390, 844], q: '?play', run: async p => { await p.click('#toggleFiltersBtn'); await p.waitForTimeout(600); await tapStrip(p); } },
  'desktop-rest':    { vp: [1280, 800], desk: true },
  // states, cropped to the strip (rest / pressed / blank / ready / adding)
  'st-rest':    { vp: [390, 664], q: '?play', crop: true },
  'st-pressed': { vp: [390, 664], q: '?play', crop: true, run: p => p.evaluate(() => document.querySelector('#strip .go').classList.add('press')) },
  'st-blank':   { vp: [390, 664], q: '?play', crop: true, run: tapStrip },
  'st-ready':   { vp: [390, 664], q: '?play', crop: true, run: async p => { await tapStrip(p); await pick(p); } },
  'st-adding':  { vp: [390, 664], q: '?play', crop: true, run: async p => { await tapStrip(p); await pick(p);
      await p.evaluate(() => { const s = document.getElementById('submitBtn'); s.disabled = true; s.textContent = 'Adding...'; }); await p.waitForTimeout(200); } },
};
(async () => {
  const b = await L.launch(); const out = {};
  for (const [name, s] of Object.entries(S).filter(([n]) => !process.env.ONLY || n.startsWith(process.env.ONLY))) {
    const { ctx, page, errs } = await L.open(b, { html: COPY, ...s, patch: withLook(s.patch) });
    await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
    if (s.run) await s.run(page);
    await page.waitForTimeout(300);
    const m = { strip: await L.box(page, '#strip'), look: await page.evaluate(() => document.getElementById('strip').dataset.look), label: await page.evaluate(() => document.querySelector('#strip .go').textContent),
      form: await L.box(page, '#controls'), rows: await L.rowsVisible(page), tag: await L.box(page, '.tag-popup'), header: await L.box(page, '#locationsHeader'), errs };
    out[name] = m; console.log(name, JSON.stringify(m));
    const clip = s.crop ? await page.evaluate(() => { const r = document.getElementById('strip').getBoundingClientRect(); return { x: 0, y: r.top - 70, width: innerWidth, height: r.height + 70 }; }) : undefined;
    await page.screenshot({ path: `${OUT}/${name}-${s.desk ? 1 : 3}x.png`, ...(clip ? { clip } : {}) });
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, `measure${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`), JSON.stringify(out, null, 1));
  await b.close();
})();
