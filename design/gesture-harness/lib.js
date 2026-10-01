// Gesture harness core: loads an index.html (FILE env, default: the repo's own)
// in headless Chromium with the Supabase stub (stub.js), vendored Leaflet +
// Archivo (vendor/), blank tiles and no network; instruments navigation,
// delete and touchend; and synthesises touch input through CDP
// Input.dispatchTouchEvent at real timing.
//
// Replaces the never-committed design/pencil-star/lib.js, s2.js, r5-metrics.js
// and design/star2/lib.js (see README.md). Chromium only: this is emulated
// touch, not iOS.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), zlib = require('zlib');

const FILE = path.resolve(process.env.FILE || path.join(__dirname, '../../index.html'));
const VENDOR = path.join(__dirname, 'vendor');
const W = ms => new Promise(r => setTimeout(r, ms));

function png1(r, g, b) {
  const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  const crc = buf => { let x = 0xffffffff; for (const v of buf) x = t[(x ^ v) & 0xff] ^ (x >>> 8); return (x ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(1, 0); ihdr.writeUInt32BE(1, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.from([0, r, g, b]))), chunk('IEND', Buffer.alloc(0))]);
}
const TILE = png1(0xE8, 0xE4, 0xDA);

const chromeExe = () => {
  if (process.env.CHROME) return process.env.CHROME;
  const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
  return `/opt/pw-browsers/${d}/chrome-linux/chrome`;
};
const launch = () => chromium.launch({ executablePath: chromeExe() });

// The fixture's A-Z list, as the stub defines it ([starred, visited] per index).
const ROWS = [[0, 0], [1, 1], [0, 1], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [1, 0], [0, 0], [0, 1], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
  .map(([s, v]) => ({ starred: !!s, visited: !!v }));

// Instrumentation (after load): __nav [id, t] per highlightMarker(), __del ids per
// confirmDelete() (stubbed: no dialog, nothing deleted), __te touchend times.
const INSTRUMENT = () => {
  window.__nav = []; window.__del = []; window.__te = [];
  const hm = highlightMarker;
  highlightMarker = function (id) { __nav.push([id, performance.now()]); return hm.apply(this, arguments); };
  confirmDelete = function (id) { __del.push(id); };
  confirmDeleteShape = function (id) { __del.push('shape:' + id); };
  document.addEventListener('touchend', () => __te.push(performance.now()), true);
  // rename a place in the page AND in the stub's server rows (a refetch would otherwise revert it
  // and re-render the row mid-test); returns its new A-Z index
  window.__rename = (id, name) => { window.__ROWS.forEach(r => { if (r.id === id) r.name = name; }); locations = locations.map(l => l.id === id ? { ...l, name } : l); updateUI(); return __rowIds().indexOf(id); };
  window.__rowIds = () => [...document.querySelectorAll('#locationsList .location-card[data-id]')].map(e => e.dataset.id);
};

// opts: reduced, dsf, w, h, city, touch, file, storage {k:v}
async function openProto(browser, { reduced = false, dsf = 1, w = 390, h = 844, city = 'reykjavik', touch = true, file = FILE, storage = {} } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, hasTouch: touch, isMobile: touch,
    reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const html = fs.readFileSync(file, 'utf8');
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith('https://triplet.test/')) return route.fulfill({ contentType: 'text/html', body: html });
    if (u.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(VENDOR + '/leaflet.js') });
    if (u.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(VENDOR + '/leaflet.css') });
    if (u.includes('supabase')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(__dirname + '/stub.js') });
    if (u.includes('fonts.googleapis.com')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(VENDOR + '/archivo.css') });
    if (u.includes('fonts.gstatic.com')) { const f = VENDOR + '/' + u.split('/').pop(); return fs.existsSync(f) ? route.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : route.fulfill({ status: 404, body: '' }); }
    if (u.includes('tile.openstreetmap')) return route.fulfill({ contentType: 'image/png', body: TILE });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(([c, st]) => { try { if (!sessionStorage.getItem('__seeded')) { sessionStorage.setItem('__seeded', '1'); localStorage.clear();
    localStorage.setItem('triplet.citySelection', c); for (const [k, v] of Object.entries(st)) localStorage.setItem(k, v); } } catch (e) {} }, [city, storage]);
  await page.goto('https://triplet.test/index.html');
  await page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length >= 21, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await W(250);
  await page.evaluate(INSTRUMENT);
  const order = await page.evaluate(() => __rowIds().map(id => { const l = locations.find(x => x.id === id); return [!!l.starred, !!l.visited]; }));
  if (order.length !== ROWS.length || order.some(([s, v], i) => s !== ROWS[i].starred || v !== ROWS[i].visited)) throw new Error('fixture order mismatch: ' + JSON.stringify(order));
  const cdp = await ctx.newCDPSession(page);
  return { ctx, page, cdp, errors };
}

// One touch event. touchEnd/touchCancel carry no points.
async function T(cdp, type, x, y, ts) {
  const p = { type, touchPoints: type === 'touchEnd' || type === 'touchCancel' ? [] : [{ x, y, radiusX: 1, radiusY: 1, force: 1, id: 0 }] };
  if (ts !== undefined) p.timestamp = ts;
  await cdp.send('Input.dispatchTouchEvent', p);
}

// A touch drag through pts at real timing: touchStart at pts[0], one touchMove per
// later point every stepMs (scheduled from the start time, not accumulated), an
// optional hold, then touchEnd (or opts.end = 'touchCancel'). synthTs stamps each
// event with its ideal time, so the page's e.timeStamp velocity is exact even if
// the CDP round-trip jitters. onStep(i) runs after move i is delivered.
// Events are sent WITHOUT awaiting each ack (CDP keeps them in order): an awaited
// dispatchTouchEvent waits for the renderer's ack, ~35-50ms per touchmove here,
// which stretched a 16ms cadence 2-3x (a 160ms stroke took ~450ms, and the
// first visible move landed after the 80ms press delay). Fire-and-forget keeps
// the scheduled cadence (measured: 16-17ms between delivered moves).
// Chromium (isMobile) holds touchmoves back inside its ~15px touch slop, as on
// Android; iOS Safari does not -- one of the emulation's limits.
async function drag(page, cdp, pts, { stepMs = 16, synthTs = false, hold = 0, end = 'touchEnd', onStep = null } = {}) {
  const t0 = Date.now(), s0 = t0 / 1000, sent = [];
  const ts = i => synthTs ? s0 + i * stepMs / 1000 : undefined;
  sent.push(T(cdp, 'touchStart', pts[0].x, pts[0].y, ts(0)));
  for (let i = 1; i < pts.length; i++) {
    const due = t0 + i * stepMs - Date.now(); if (due > 0) await W(due);
    const p = T(cdp, 'touchMove', pts[i].x, pts[i].y, ts(i)); sent.push(p);
    if (onStep) { await p; await onStep(i); }
  }
  if (hold) await W(hold); else { const due = t0 + pts.length * stepMs - Date.now(); if (due > 0) await W(due); }
  sent.push(T(cdp, end, 0, 0, synthTs ? s0 + pts.length * stepMs / 1000 : undefined));
  await Promise.all(sent);
}
const line = (x0, y0, x1, y1, n) => Array.from({ length: n + 1 }, (_, i) => ({ x: x0 + (x1 - x0) * i / n, y: y0 + (y1 - y0) * i / n }));

// Row i's rect after scrolling it fully into the list's view if needed.
async function rowRect(page, i) {
  await page.evaluate(i => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[i]; const l = document.getElementById('locationsList');
    const r = el.getBoundingClientRect(), lr = l.getBoundingClientRect(); if (r.top < lr.top || r.bottom > lr.bottom - 4) l.scrollTop += r.top - lr.top - 60; }, i);
  return page.evaluate(i => { const r = document.querySelectorAll('#locationsList .location-card[data-id]')[i].getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, i);
}

// Result bookkeeping shared by every suite: prints PASS/FAIL lines, a final
// "<pass>/<total>" line, and writes OUT (json) if set.
function recorder(suite) {
  const results = [];
  const rec = (mode, name, pass, detail) => { results.push({ mode, name, pass: !!pass, detail });
    console.log(`${String(mode).padEnd(8)} ${pass ? 'PASS' : 'FAIL'} ${name}${pass ? '' : ' ' + JSON.stringify(detail === undefined ? null : detail).slice(0, 700)}`); };
  const finish = (extra = {}) => { const p = results.filter(r => r.pass).length;
    if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify({ suite, file: FILE, pass: p, total: results.length, ...extra, results }, null, 1));
    console.log(`${suite} ${p}/${results.length}`); return p === results.length; };
  return { rec, finish, results };
}

module.exports = { launch, openProto, T, drag, line, rowRect, ROWS, W, FILE, recorder };
