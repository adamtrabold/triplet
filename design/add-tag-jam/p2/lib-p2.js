// Phase 2 (the add tag) test/stills support: the gesture harness's page (stub.js fixture, vendored
// Leaflet + Archivo, flat tiles) plus
//   - live-search FIXTURES: real Nominatim responses (fetched 2026-10-17 from the sandbox, where
//     Nominatim answers 200) served for /search by the query's q, and /lookup by osm_ids;
//   - a write recorder: inserts into locations / neighborhood_shapes / cities are captured in
//     window.__ins and applied to the stub's rows (so the refetch after ADD returns the new place);
//     window.__failNext = 'locations' | 'cities' | 'neighborhood_shapes' makes the next insert there fail.
const path = require('path'), fs = require('fs');
const lib = require('../../gesture-harness/lib.js');
const FX = path.join(__dirname, 'fixtures');
const W = ms => new Promise(r => setTimeout(r, ms));

function fixtureFor(url) {
  const u = new URL(url);
  if (u.pathname.startsWith('/lookup')) {
    const f = path.join(FX, `lookup_${u.searchParams.get('osm_ids')}.json`);
    return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '[]';
  }
  if (u.pathname.startsWith('/reverse')) return '{}';
  const q = (u.searchParams.get('q') || '').trim().replace(/ /g, '_');
  const f = path.join(FX, `${q}.json`);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '[]';
}

async function openP2(browser, opts = {}) {
  const o = await lib.openProto(browser, opts);
  const { page } = o;
  o.requests = [];
  await page.route('https://nominatim.openstreetmap.org/**', route => {
    o.requests.push(route.request().url());
    return route.fulfill({ contentType: 'application/json', body: fixtureFor(route.request().url()) });
  });
  await page.evaluate(() => {
    window.__ins = []; window.__failNext = null;
    const orig = supabaseClient.from.bind(supabaseClient);
    let nid = 1, sid = 900;
    supabaseClient.from = t => {
      const b = orig(t);
      if (!['locations', 'neighborhood_shapes', 'cities'].includes(t)) return b;
      b.insert = r => {
        const rows = Array.isArray(r) ? r : [r];
        if (window.__failNext === t) { window.__failNext = null; return { then(ok) { return Promise.resolve({ data: null, error: { message: 'stub failure', code: 'X' } }).then(ok); } }; }
        window.__ins.push([t, JSON.parse(JSON.stringify(rows))]);
        if (t === 'locations') rows.forEach(x => window.__ROWS.push({ id: 'new' + (nid++), created_at: new Date().toISOString(), visited: false, starred: false, notes: null, ...x }));
        if (t === 'neighborhood_shapes') rows.forEach(x => window.__SHAPES.push({ id: sid++, min_zoom: null, visited: false, starred: false, ...x }));
        return { then(ok) { return Promise.resolve({ data: null, error: null }).then(ok); } };
      };
      return b;
    };
  });
  return o;
}
// type into NAME as a person would (input events), then let the 1s debounce fire
async function typeName(page, text) {
  await page.evaluate(t => { hideAutocomplete(); const i = document.getElementById('nameInput'); i.focus(); i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); }, text);
  await page.waitForFunction(() => { const r = document.getElementById('addResults'); return !r.hidden && r.textContent && !/Searching/.test(r.textContent); }, null, { timeout: 6000 });
  await W(150);
}
async function pick(page, i = 0) {
  await page.evaluate(i => document.querySelectorAll('#addResults .add-res')[i].click(), i);
  await W(500);
}
async function openAdd(page) {
  await page.evaluate(() => document.getElementById('floatingAddBtn').click());
  await W(700);
}
async function tap(page, sel) {
  const r = await page.evaluate(sel => { const b = document.querySelector(sel).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel);
  await page.touchscreen.tap(r.x, r.y); await W(350);
}
module.exports = { lib, openP2, typeName, pick, openAdd, tap, W };
