// City CRUD build test support, on top of the phase 2 / 3 libs (the gesture harness's stub page,
// the phase 2 search fixtures, phase 3's update / delete recorders and /reverse stub):
//   - this folder's fixtures/ (real Nominatim answers, fetch-fixtures.sh) answer first: a place
//     search by its q, a Find a city search (featureType=city) by q + "__city"; anything else falls
//     through to the phase 2 fixtures;
//   - plan_stops inserts are recorded in window.__ins (as lib-p2 records places and cities), and
//     window.__failNext = 'plan_stops' makes the next one fail.
// Plans: open with storage { 'gh.plans': '1' } for the stub's "Gate plan" (gh-p: rey00, rey05, rey01).
const path = require('path'), fs = require('fs');
const P = require('../../add-tag-jam/p2/lib-p2.js');
const P3 = require('../../add-tag-jam/p3/lib-p3.js');
const FX = path.join(__dirname, 'fixtures');
const { W } = P;

async function open(browser, opts = {}) {
  const o = await P.openP2(browser, opts);
  const { page } = o;
  await P3.install(page);
  await page.route('https://nominatim.openstreetmap.org/search**', route => {
    const u = new URL(route.request().url());
    if (u.searchParams.get('bounded') === '1') return route.fallback();
    let q = (u.searchParams.get('q') || '').trim().replace(/ /g, '_');
    if (u.searchParams.get('featureType') === 'city') q += '__city';
    const f = path.join(FX, `${q}.json`);
    if (!fs.existsSync(f)) return route.fallback();
    o.requests.push(route.request().url());
    return route.fulfill({ contentType: 'application/json', body: fs.readFileSync(f, 'utf8') });
  });
  await page.evaluate(() => {
    // city-crud v2b: places by id (update().in() / delete().in(), recorded in __upd / __pdel), and a
    // cities table answer (window.__CITIES_TABLE, rows as the DB holds them) for fetchCities()
    window.__pdel = [];
    const prev0 = supabaseClient.from.bind(supabaseClient);
    supabaseClient.from = t => {
      const b = prev0(t);
      const ok = () => ({ then(res) { return Promise.resolve({ data: null, error: null }).then(res); } });
      const fail = () => ({ then(res) { return Promise.resolve({ data: null, error: { message: 'stub failure', code: 'X' } }).then(res); } });
      if (t === 'cities' && window.__CITIES_TABLE) {
        b.select = () => ({ then(res) { return Promise.resolve({ data: window.__CITIES_TABLE.map(r => ({ ...r })), error: null }).then(res); } });
        const ins = b.insert;
        b.insert = r => { const out = ins(r); (Array.isArray(r) ? r : [r]).forEach(x => { if (!window.__CITIES_TABLE.some(y => y.id === x.id)) window.__CITIES_TABLE.push({ ...x }); }); return out; };
        b.delete = () => ({ eq(k, v) { window.__del.push(['cities', v]); if (window.__failNext === 'cities-delete') { window.__failNext = null; return fail(); } window.__CITIES_TABLE = window.__CITIES_TABLE.filter(r => r[k] !== v); return ok(); } });
        return b;
      }
      if (!['locations', 'neighborhood_shapes'].includes(t)) return b;
      const store = () => t === 'locations' ? window.__ROWS : window.__SHAPES;
      const up = b.update;
      b.update = o => {
        const u = up(o);
        return { eq: (k, v) => u.eq(k, v), in(k, ids) {
          if (window.__failNext === t + '-update') { window.__failNext = null; return fail(); }
          window.__upd.push([t, JSON.parse(JSON.stringify(o)), [k, ids.slice()]]);
          store().forEach(r => { if (ids.map(String).includes(String(r[k]))) Object.assign(r, o); });
          return ok(); } };
      };
      b.delete = () => ({ in(k, ids) {
        if (window.__failNext === t + '-delete') { window.__failNext = null; return fail(); }
        window.__pdel.push([t, ids.slice()]);
        const keep = store().filter(r => !ids.map(String).includes(String(r[k])));
        if (t === 'locations') window.__ROWS = keep; else window.__SHAPES = keep;
        return ok(); }, eq(k, v) { return this.in(k, [v]); } });
      return b;
    };
  });
  await page.evaluate(() => {
    const prev = supabaseClient.from.bind(supabaseClient);
    supabaseClient.from = t => {
      const b = prev(t);
      if (t !== 'plan_stops') return b;
      const ins = b.insert;
      b.insert = r => {
        if (window.__failNext === 'plan_stops') { window.__failNext = null; return { then(ok) { return Promise.resolve({ data: null, error: { message: 'stub failure', code: 'X' } }).then(ok); } }; }
        window.__ins.push(['plan_stops', JSON.parse(JSON.stringify(Array.isArray(r) ? r : [r]))]);
        return ins.call(b, r);
      };
      return b;
    };
  });
  return o;
}
// type into ADDRESS as a person would (focus, input events), then let the 1s debounce fire
async function typeAddr(page, text) {
  await page.evaluate(t => { hideAutocomplete(); const i = document.getElementById('addrInput'); i.focus(); i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); }, text);
  await page.waitForFunction(() => { const r = document.getElementById('addResults'); return !r.hidden && r.textContent && !/Searching/.test(r.textContent); }, null, { timeout: 6000 });
  await W(150);
}
// type into an open city menu's Find a city line, then wait for its results (or its note)
async function findCity(page, menuId, text) {
  await page.evaluate(([m, t]) => { const i = document.querySelector(`#${m} .menu-find-in`); i.focus(); i.value = t; i.dispatchEvent(new Event('input', { bubbles: true })); }, [menuId, text]);
  await page.waitForFunction(m => { const r = document.querySelector(`#${m} .menu-find-res`); return r && r.textContent && !/Searching/.test(r.textContent); }, menuId, { timeout: 6000 });
  await W(150);
}
module.exports = { open, typeAddr, findCity, P, P3, W };
