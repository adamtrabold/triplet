// Plans harness: the real index.html (PAGE, default this checkout's) with the plans-aware
// Supabase double (../list-ordering/build/stub.js rows + ./stub-malmo.js + ./stub.js), local
// Leaflet/fonts from VENDOR (leaflet.js, leaflet.css, archivo.css, *.woff2), flat tiles.
// open(browser, { plans, stops, missing, failWrites, writeDelay, signedOut, storage, dsf, w, h, reduced, init })
const { launch } = require('../list-ordering/build/harness');
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const PAGE = process.env.PAGE || path.resolve(__dirname, '../../index.html');
const VENDOR = process.env.VENDOR;
if (!VENDOR) { console.error('VENDOR=<dir with leaflet.js, leaflet.css, archivo.css, *.woff2> is required'); process.exit(2); }
function png1(r, g, b) {
  const crc = (buf) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    let x = 0xffffffff; for (const v of buf) x = t[(x ^ v) & 0xff] ^ (x >>> 8); return (x ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(1, 0); ihdr.writeUInt32BE(1, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.from([0, r, g, b]))), chunk('IEND', Buffer.alloc(0))]);
}
const TILE = png1(0xE8, 0xE4, 0xDA);
const STUB = ['../list-ordering/build/stub.js', 'stub-malmo.js', 'stub.js'].map(f => fs.readFileSync(path.join(__dirname, f), 'utf8')).join('\n');

async function open(browser, { dsf = 1, w = 390, h = 844, storage = {}, plans = [], stops = [], missing = false, offline = false, failWrites = false, writeDelay = 0,
  signedOut = false, visited = null, reduced = false, init = null, touch = true, city = 'copenhagen', wait = 900 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, hasTouch: touch, isMobile: touch, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errors = [], consoleErrors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith('https://triplet.test/')) return route.fulfill({ contentType: 'text/html', body: fs.readFileSync(PAGE, 'utf8') });
    if (u.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(VENDOR + '/leaflet.js') });
    if (u.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(VENDOR + '/leaflet.css') });
    if (u.includes('supabase')) return route.fulfill({ contentType: 'application/javascript', body: STUB });
    if (u.includes('fonts.googleapis.com')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(VENDOR + '/archivo.css') });
    if (u.includes('fonts.gstatic.com')) return route.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(VENDOR + '/' + u.split('/').pop()) });
    if (u.includes('tile.openstreetmap')) return route.fulfill({ contentType: 'image/png', body: TILE });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(([st, city, cfg]) => {
    Object.assign(window, cfg);
    try { if (!sessionStorage.getItem('__seeded')) { sessionStorage.setItem('__seeded', '1');
      localStorage.setItem('triplet.citySelection', city); for (const [k, v] of Object.entries(st)) localStorage.setItem(k, v); } } catch (e) {}
  }, [storage, city, { __PLANS: plans, __STOPS: stops, __PLANS_MISSING: missing, __PLANS_OFFLINE: offline, __FAIL_WRITES: failWrites, __WRITE_DELAY: writeDelay, __SIGNED_OUT: signedOut, __VISITED: visited }]);
  if (init) await page.addInitScript(init);
  await page.goto('https://triplet.test/index.html');
  await page.waitForTimeout(wait);
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page, errors, consoleErrors };
}

// Fixtures: real Copenhagen rows from the list-ordering stub (ids are its short keys).
const P = (id, name, t) => ({ id, name, created_at: `2026-09-2${t}T10:00:00Z` });
const S = (id, plan, loc, shape, position) => ({ id, plan_id: plan, location_id: loc, shape_id: shape, position });
const FIX = {
  plans: [P('p-nor', 'Nørrebro afternoon', 1), P('p-mc', 'Malmö + Copenhagen day', 2), P('p-tiv', 'Tivoli tonight', 3),
    P('p-long', 'Last full day before we fly home from Kastrup', 4), P('p-empty', 'Rainy day', 5)],
  stops: [
    // Nørrebro afternoon: 6 stops -- a visited pin, an area pin, a starred pin, an area, the district shape, the approx pin
    S('s1', 'p-nor', 'mir', null, 1), S('s2', 'p-nor', 'jae', null, 2), S('s3', 'p-nor', 'cof', null, 3),
    S('s4', 'p-nor', 'ass', null, 4), S('s5', 'p-nor', null, 9001, 5), S('s6', 'p-nor', 'bla', null, 6),
    // spans two cities
    S('s7', 'p-mc', 'lil', null, 1), S('s8', 'p-mc', 'tiv', null, 2), S('s9', 'p-mc', 'nyh', null, 3),
    S('s10', 'p-tiv', 'tiv', null, 1),
    S('s11', 'p-long', 'ref', null, 1), S('s12', 'p-long', 'kfb', null, 2), S('s13', 'p-long', 'mot', null, 3), S('s14', 'p-long', null, 9002, 4)
  ]
};
// With visited: ['mir'], NEXT on Nørrebro afternoon is stop 2.
module.exports = { open, launch, FIX };
