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
