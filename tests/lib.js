const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const REPO = path.join(__dirname, '..'), LOOP = path.join(__dirname, 'vendor'), V = LOOP;
const fontCss = fs.readFileSync(path.join(LOOP, 'archivo.css'), 'utf8');
async function route(ctx) {
  await ctx.route('**/*', r => {
    const u = r.request().url();
    if (u.startsWith('file:')) return r.continue();
    if (u.includes('leaflet@1.9.4/dist/leaflet.js')) return r.fulfill({ path: path.join(V, 'leaflet.js'), contentType: 'application/javascript' });
    if (u.includes('leaflet@1.9.4/dist/leaflet.css')) return r.fulfill({ path: path.join(V, 'leaflet.css'), contentType: 'text/css' });
    if (u.includes('supabase-js@2.39.3')) return r.fulfill({ path: path.join(V, 'supabase.js'), contentType: 'application/javascript' });
    if (u.startsWith('https://fonts.googleapis.com/css2')) return r.fulfill({ body: fontCss, contentType: 'text/css' });
    if (u.includes('k3kQo8UDI-1M0wlSfdnoLg')) return r.fulfill({ path: path.join(LOOP, 'archivo-latin.woff2'), contentType: 'font/woff2' });
    if (u.includes('k3kQo8UDI-1M0wlSfdfoLnnA')) return r.fulfill({ path: path.join(LOOP, 'archivo-latinext.woff2'), contentType: 'font/woff2' });
    return r.abort();
  });
}
// Tested file: PROTO=<path> (absolute or relative to CWD) else the repo's index.html.
const FILE = process.env.PROTO ? path.resolve(process.env.PROTO) : path.join(REPO, 'index.html');
// "main" baseline for the scripts that compare against a reference build: BASE=<path>, defaults to the tested file itself.
const BASE_FILE = process.env.BASE ? path.resolve(process.env.BASE) : FILE;
// Results: OUT=<path> (relative to CWD) else tests/out/<name> (gitignored).
function outPath(name) { if (process.env.OUT) return path.resolve(process.env.OUT); fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true }); return path.join(__dirname, 'out', name); }
function chromePath() {
  if (process.env.CHROMIUM) return process.env.CHROMIUM;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try { const d = fs.readdirSync(root).filter(x => /^chromium-\d+$/.test(x)).sort().pop(); if (d) return path.join(root, d, 'chrome-linux', 'chrome'); } catch (_) {}
  return undefined;
}
function launch() { return chromium.launch({ executablePath: chromePath() }); }
const ROWS = [
  { id: '3f1c9a2e-7b4d-4e0a-9c1f-2a6b8d0e4f11', name: 'Café Pascal', category: 'cafe', city: 'stockholm', visited: false, lat: 59.34, lng: 18.05 },
  { id: '5e7f9a1b-3c5d-4e7f-a1b3-c5d7e9f1a3b5', name: 'Swedish Museum of Performing Arts Scenkonstmuseet', category: 'attraction', city: 'stockholm', visited: true, lat: 59.336, lng: 18.078 },
  { id: 'c2e4a6b8-d0f2-4a4c-8e6f-0b2d4f6a8c0e', name: 'Stockholm Public Library Stadsbiblioteket', category: 'attraction', city: 'stockholm', visited: true, lat: 59.343, lng: 18.054 },
  { id: '9b1d3f5a-7c9e-4b1d-a3f5-7c9e1b3d5f7a', name: 'The Handknitting Association of Iceland', category: 'shopping', city: 'reykjavik', visited: true, lat: 64.146, lng: -21.93 },
  { id: '1a3c5e7f-9b1d-4f3a-b5c7-e9f1a3c5e7b9', name: 'Mother restaurant Copenhagen', category: 'restaurant', city: 'copenhagen', visited: true, lat: 55.667, lng: 12.56 },
  { id: '7f9b1d3e-5a7c-4e9b-81d3-f5a7c9e1b3d5', name: 'Hafnarhús Reykjavik Art Museum', category: 'attraction', city: 'reykjavik', visited: false, lat: 64.15, lng: -21.94 },
  { id: 'a8d2e4f6-1b3c-4d5e-8f70-9a1b2c3d4e5f', name: 'Fotografiska', category: 'attraction', city: 'stockholm', visited: true, lat: 59.318, lng: 18.085 },
  { id: 'b0c2d4e6-f8a0-4b2c-9d4e-6f8a0b2c4d6e', name: 'Malmö Saluhall', category: 'restaurant', city: 'malmo', visited: false, lat: 55.61, lng: 13.0 },
  { id: 'e4f6a8b0-c2d4-4f6a-8b0c-2d4e6f8a0b2c', name: 'Kaffibarinn', category: 'bar', city: 'reykjavik', visited: false, lat: 64.147, lng: -21.93 },
];
const SHAPES = [{ id: 901, label: 'Skólavörðustígur', type: 'street', city: 'reykjavik', geometry: [[64.145, -21.93], [64.144, -21.926]] }];
const HI = 2, PRESSED = 3;
async function open(browser, css, opts, { city = 'stockholm', rows = ROWS, shapes = SHAPES, hi = HI, pressed = PRESSED, file = FILE } = {}) {
  const ctx = await browser.newContext(opts); await route(ctx);
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + file); await page.waitForTimeout(800);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(({ css, city, rows, shapes, hi, pressed }) => {
    if (css) { const s = document.createElement('style'); s.id = 'dir'; s.textContent = css; document.head.appendChild(s); }
    applyCityPalette(city);
    locations = rows; highlightedId = hi >= 0 ? rows[hi].id : null;
    syncLocationCards(rows); syncShapeCards(shapes, rows.length);
    const cards = document.querySelectorAll('#locationsList .location-card');
    if (pressed >= 0) cards[pressed].classList.add('active');
    document.getElementById('locationsEmpty').style.display = 'none';
    document.querySelector('#locationsHeader h2').textContent = `${CITIES[city].label} list (${rows.length + shapes.length})`;
    document.getElementById('filters') && (document.getElementById('filters').style.display = 'none');
  }, { css, city, rows, shapes, hi, pressed });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(150);
  return { ctx, page, errors };
}


const BASE = ROWS;
const ROWS_S = BASE.map((r, i) => ({ ...r, starred: i === 1 || i === 4 || i === 8 }));
async function openProto(browser, { reduced = false, file = FILE, city = 'stockholm', dsf = 3, width = 390, hi = -1, video = null } = {}) {
  const opts = { viewport: { width, height: 844 }, deviceScaleFactor: dsf, hasTouch: true, isMobile: true, reducedMotion: reduced ? 'reduce' : 'no-preference' };
  if (video) opts.recordVideo = video;
  const r = await open(browser, null, opts, { city, rows: ROWS_S, shapes: SHAPES, hi, pressed: -1, file });
  await r.page.evaluate(() => {
    currentUser = { id: 'u', email: 'adam@example' };
    supabaseClient.from = () => ({ update: () => ({ eq: async () => { await new Promise(r => setTimeout(r, 120)); return { error: null }; } }) });
    refetchLocations = async () => {};
    visibleLocations = () => locations; syncShapeCards = () => {};
    updateUI();
    window.__nav = []; window.__del = []; window.__te = [];
    window.__realHM = highlightMarker; highlightMarker = (id) => { __nav.push([id, performance.now()]); };
    confirmDelete = (id) => { __del.push(id); };
    document.addEventListener('touchend', () => __te.push(performance.now()), true);
    try { localStorage.setItem('triplet.pencilStarTaught', '9'); } catch (_) {}
  });
  const cdp = await r.ctx.newCDPSession(r.page);
  return { ...r, cdp };
}
const T = (cdp, type, x, y, ts) => cdp.send('Input.dispatchTouchEvent', { type, ...(ts ? { timestamp: ts } : {}), touchPoints: (type === 'touchEnd' || type === 'touchCancel') ? [] : [{ x, y, id: 1, radiusX: 8, radiusY: 8, force: 1 }] });
async function drag(page, cdp, pts, { stepMs = 16, end = 'touchEnd', hold = 0, onStep, synthTs = false } = {}) {
  const t0 = Date.now() / 1000; const ts = i => synthTs ? t0 + i * stepMs / 1000 : undefined;
  await T(cdp, 'touchStart', pts[0][0], pts[0][1], ts(0));
  for (let i = 1; i < pts.length; i++) { await page.waitForTimeout(stepMs); await T(cdp, 'touchMove', pts[i][0], pts[i][1], ts(i)); if (onStep) await onStep(i, pts[i]); }
  if (hold) await page.waitForTimeout(hold);
  await T(cdp, end, 0, 0, ts(pts.length));
}
function line(x0, y0, x1, y1, n) { const a = []; for (let i = 0; i <= n; i++) a.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); return a; }
async function rowRect(page, idx) { return page.evaluate(i => { const r = document.querySelectorAll('#locationsList .location-card')[i].getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, idx); }
module.exports = { open, launch, openProto, T, drag, line, rowRect, ROWS: ROWS_S, BASE_ROWS: ROWS, SHAPES, HI, PRESSED, FILE, BASE_FILE, outPath };
