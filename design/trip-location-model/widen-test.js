// Stubbed-fetch checks for widen-on-miss search (index.html), headless Chromium.
// usage: LIBS=/dir node widen-test.js /abs/path/index.html
// LIBS must hold the CDN libs unpacked from `npm pack leaflet@1.9.4
// @supabase/supabase-js@2.39.3` (lf/package/..., sb/package/...), since the
// sandbox can't reach unpkg/jsdelivr. Nominatim is stubbed in-page.
const { chromium } = require(process.env.PLAYWRIGHT || '/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const SP = process.env.LIBS || __dirname;
const FILE = process.argv[2];
let pass = 0, total = 0;
const ok = (name, cond, info) => { total++; if (cond) pass++; console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${info !== undefined ? ' ' + JSON.stringify(info) : ''}`); };

(async () => {
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const ctx = await b.newContext();
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith('file://')) return route.continue();
    if (u.includes('leaflet@1.9.4/dist/leaflet.js')) return route.fulfill({ body: fs.readFileSync(SP + '/lf/package/dist/leaflet.js'), contentType: 'application/javascript' });
    if (u.includes('leaflet@1.9.4/dist/leaflet.css')) return route.fulfill({ body: fs.readFileSync(SP + '/lf/package/dist/leaflet.css'), contentType: 'text/css' });
    if (u.includes('supabase-js')) return route.fulfill({ body: fs.readFileSync(SP + '/sb/package/dist/umd/supabase.js'), contentType: 'application/javascript' });
    if (u.includes('supabase.co')) return route.fulfill({ status: 200, body: '[]', contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } });
    return route.abort();
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + FILE);
  await page.waitForFunction(() => typeof map !== 'undefined' && typeof nominatimWithFallback === 'function');
  await page.waitForTimeout(500);

  // In-page Nominatim stub: records every /search request (start time + params);
  // window.__plan(url, n) -> { body, delay } decides each response.
  await page.evaluate(() => {
    const real = window.fetch;
    window.__calls = [];
    window.fetch = (url, init) => {
      const s = String(url);
      if (!s.includes('nominatim.openstreetmap.org')) return real(url, init);
      const params = Object.fromEntries(new URL(s).searchParams);
      const n = window.__calls.length;
      window.__calls.push({ t: performance.now(), params });
      const { body, delay = 0, fail } = window.__plan(s, n, params);
      return new Promise((resolve, reject) => setTimeout(() => fail ? reject(Object.assign(new Error('timeout'), { name: 'TimeoutError' })) : resolve(new Response(JSON.stringify(body), { status: 200 })), delay));
    };
    window.__hit = (name, lat = 59.86, lon = 17.63) => ({ display_name: `${name}, Uppsala, Sverige`, lat: String(lat), lon: String(lon), address: { town: 'Uppsala', country_code: 'se', country: 'Sverige' } });
  });
  const reset = (planSrc) => page.evaluate(src => { window.__calls = []; window.__plan = eval(src); }, planSrc);
  const calls = () => page.evaluate(() => window.__calls);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Put the map on Stockholm (a known city) for the viewport-driven scope.
  await page.evaluate(() => { map.setView(CITIES.stockholm.center, 12, { animate: false }); userOverrodeCity = false; });

  // --- A1: scoped hit -> exactly one request, today's params, no widening
  await reset(`(u, n) => ({ body: [__hit('Vasamuseet', 59.328, 18.091)] })`);
  let r = await page.evaluate(() => nominatimWithFallback('Vasamuseet', currentSearchCityConfig(), { limit: 10, addressdetails: true }));
  let c = await calls();
  ok('A1 scoped hit: 1 request, results returned', c.length === 1 && r.length === 1, { n: c.length });
  ok('A1b scoped request unchanged: suffix in q, countrycodes=se, viewbox, not bounded',
    c[0].params.q === 'Vasamuseet, Stockholm' && c[0].params.countrycodes === 'se' && c[0].params.viewbox === '17.850,59.250,18.220,59.420' && !('bounded' in c[0].params), c[0].params);

  // --- A2: scoped miss -> one widened request, >=1000ms after the first, no suffix/countrycodes/bounded, same viewbox
  await reset(`(u, n) => ({ body: n === 0 ? [] : [__hit('Uppsala domkyrka')] })`);
  r = await page.evaluate(() => nominatimWithFallback('Uppsala domkyrka', currentSearchCityConfig(), { limit: 10, addressdetails: true }));
  c = await calls();
  ok('A2 scoped miss: exactly 2 requests, widened results returned', c.length === 2 && r && r.length === 1, { n: c.length });
  ok('A2b widened params: bare q, no countrycodes, same viewbox, no bounded',
    c[1] && c[1].params.q === 'Uppsala domkyrka' && !('countrycodes' in c[1].params) && c[1].params.viewbox === '17.850,59.250,18.220,59.420' && !('bounded' in c[1].params), c[1] && c[1].params);
  ok('A2c spacing: second request >= 1000ms after the first', c[1] && c[1].t - c[0].t >= 1000, { gapMs: c[1] && +(c[1].t - c[0].t).toFixed(1) });

  // --- A3: widened also misses -> 2 requests, empty result, no third
  await reset(`(u, n) => ({ body: [] })`);
  r = await page.evaluate(() => nominatimWithFallback('zzqq', currentSearchCityConfig(), { limit: 10 }));
  await sleep(1300);
  c = await calls();
  ok('A3 double miss: exactly 2 requests, empty array', c.length === 2 && Array.isArray(r) && r.length === 0, { n: c.length });

  // --- A4: scoped request errors (timeout) -> error propagates, no widening
  await reset(`(u, n) => ({ fail: true })`);
  r = await page.evaluate(() => nominatimWithFallback('x', currentSearchCityConfig(), {}).then(() => 'resolved', e => e.name));
  await sleep(1300);
  c = await calls();
  ok('A4 scoped error: rejects, no widened request', r === 'TimeoutError' && c.length === 1, { r, n: c.length });

  // --- A5: unknown-region cfg (bounded viewport) miss -> widened drops bounded, keeps viewbox
  await reset(`(u, n) => ({ body: n === 0 ? [] : [__hit('X')] })`);
  await page.evaluate(() => nominatimWithFallback('X', { viewbox: '1,2,3,4', bounded: true }, {}));
  c = await calls();
  ok('A5 bounded fallback cfg: widened = viewbox bias only (bounded dropped)', c.length === 2 && c[0].params.bounded === '1' && !('bounded' in c[1].params) && c[1].params.viewbox === '1,2,3,4', c.map(x => x.params));

  // --- A6: nothing to widen (no suffix/countrycodes/bounded) -> single request
  await reset(`(u, n) => ({ body: [] })`);
  await page.evaluate(() => nominatimWithFallback('X', { viewbox: '1,2,3,4' }, {}));
  await sleep(1200);
  c = await calls();
  ok('A6 already-unscoped cfg: no second request', c.length === 1, { n: c.length });

  // --- B1: autocomplete, scoped hit renders as today (1 request)
  const typeAndSearch = (q) => page.evaluate(q => { const i = document.getElementById('nameInput'); i.value = q; return searchAddress(q); }, q);
  const rows = () => page.evaluate(() => [...document.querySelectorAll('#addressAutocomplete .autocomplete-item')].map(e => e.textContent));
  const status = () => page.evaluate(() => (document.querySelector('#addressAutocomplete .autocomplete-loading') || {}).textContent || null);
  await reset(`(u, n) => ({ body: [__hit('Vasamuseet', 59.328, 18.091), __hit('Vasaparken', 59.34, 18.04)] })`);
  await typeAndSearch('Vasa');
  c = await calls();
  ok('B1 local autocomplete unchanged: 1 request, 2 rows', c.length === 1 && (await rows()).length === 2, { n: c.length, rows: await rows() });

  // --- B2: autocomplete miss -> widened rows render like normal rows (no divider)
  await reset(`(u, n) => ({ body: n === 0 ? [] : [__hit('Uppsala domkyrka'), __hit('Domkyrkoplan')] })`);
  await typeAndSearch('Uppsala domkyrka');
  const html = await page.evaluate(() => document.getElementById('addressAutocomplete').innerHTML);
  c = await calls();
  ok('B2 autocomplete miss: widened rows rendered, same markup, no divider', c.length === 2 && (await rows()).length === 2 && !/divider|farther/i.test(html), { n: c.length, rows: await rows() });

  // --- B3: stale during the spacing wait -> widened request never sent, nothing rendered from it
  await reset(`(u, n) => ({ body: [] })`);
  const p3 = typeAndSearch('Uppsal');
  await sleep(300);
  await page.evaluate(() => { document.getElementById('nameInput').value = 'Uppsala'; });   // user keeps typing (debounce not fired yet)
  await p3; await sleep(200);
  c = await calls();
  ok('B3 typed more during the wait: widened request not sent', c.length === 1, { n: c.length });

  // --- B4: widened response arrives AFTER a newer search started -> dropped
  await reset(`(u, n, p) => p.q.startsWith('Uppsala domkyrka') ? { body: [__hit('NEW')] } : (n === 0 ? { body: [] } : { body: [__hit('OLD-WIDENED')], delay: 800 })`);
  const p4 = typeAndSearch('Uppsala dom');
  await sleep(1300);                 // widened request for 'Uppsala dom' is now in flight (800ms)
  const inflight = (await calls()).length;
  await typeAndSearch('Uppsala domkyrka');   // newer search: scoped hit, renders NEW
  await p4; await sleep(100);
  const rws = await rows();
  ok('B4 late widened response dropped; newer results stay', inflight === 2 && rws.length === 1 && rws[0].startsWith('NEW'), { inflight, rows: rws });

  // --- B5: a stale widened response never overwrites a picked place / hidden list
  await reset(`(u, n) => n === 0 ? { body: [] } : { body: [__hit('LATE')], delay: 600 }`);
  const p5 = typeAndSearch('Gamla');
  await sleep(1200);
  await page.evaluate(() => { document.getElementById('nameInput').value = 'Gamla stan'; hideAutocomplete(); });   // e.g. selectAddress() set the name
  await p5;
  ok('B5 widened response after the name changed: not rendered', (await rows()).length === 0 && !(await page.evaluate(() => document.getElementById('addressAutocomplete').classList.contains('show'))), { rows: await rows() });

  // --- C1: typed-address submit path (geocode) widens on miss
  await reset(`(u, n) => ({ body: n === 0 ? [] : [__hit('Storgatan 1, Uppsala')] })`);
  r = await page.evaluate(() => geocode('Storgatan 1, Uppsala'));
  c = await calls();
  ok('C1 geocode(): miss -> widened coords returned', c.length === 2 && r && Math.abs(r.lat - 59.86) < 1e-6 && !('countrycodes' in c[1].params), { n: c.length, r });

  // --- C2: district outline search widens on miss
  await reset(`(u, n) => ({ body: n === 0 ? [] : [{ lat: '59.86', lon: '17.63', geojson: { type: 'Polygon', coordinates: [[[17.6, 59.8], [17.7, 59.8], [17.7, 59.9], [17.6, 59.8]]] } }] })`);
  r = await page.evaluate(() => nominatimPolygon('Fjärdingen', cityConfig('stockholm')));
  c = await calls();
  ok('C2 nominatimPolygon(): miss -> widened polygon ([lat,lng])', c.length === 2 && r && r[0][0] === 59.8 && r[0][1] === 17.6 && c[1].params.polygon_geojson === '1' && !('countrycodes' in c[1].params), { n: c.length, first: r && r[0] });

  // --- C3: approximate-point Nominatim step widens on miss (Overpass untouched)
  await reset(`(u, n) => ({ body: n === 0 ? [] : [__hit('Fjärdingen')] })`);
  r = await page.evaluate(() => findApproximatePoint('Fjärdingen', cityConfig('stockholm')));
  c = await calls();
  ok('C3 findApproximatePoint(): point search widens on miss', c.length === 2 && r && r.tier === 'point search', { n: c.length, r });

  // --- C4: deriveNewCityConfig's settlement lookup is NOT widened (country-scoped by design)
  await reset(`(u, n) => ({ body: [] })`);
  await page.evaluate(() => deriveNewCityConfig({ town: 'Uppsala', country_code: 'se', country: 'Sverige' }, 59.86, 17.63));
  await sleep(1200);
  c = await calls();
  ok('C4 deriveNewCityConfig(): still one country-scoped request', c.length === 1 && c[0].params.countrycodes === 'se', { n: c.length });

  ok('no page errors', errors.length === 0, errors);
  console.log(`\n${pass}/${total} passed`);
  await b.close();
  process.exit(pass === total ? 0 : 1);
})();
