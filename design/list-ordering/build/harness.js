// Harness: the real index.html (from REPO, default: this worktree) + stubbed Supabase
// (stub.js) + local Leaflet/fonts (VENDOR dir: leaflet.js, leaflet.css, archivo.css,
// *.woff2), blank tiles. No network.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const REPO = process.env.REPO || path.resolve(__dirname, '../../..');
const VENDOR = process.env.VENDOR;
function png1(r, g, b) {
  const crc = (buf) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    let x = 0xffffffff; for (const v of buf) x = t[(x ^ v) & 0xff] ^ (x >>> 8); return (x ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(1, 0); ihdr.writeUInt32BE(1, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.from([0, r, g, b]))), chunk('IEND', Buffer.alloc(0))]);
}
const TILE = png1(0xE8, 0xE4, 0xDA);
const launch = () => chromium.launch({ executablePath: '/opt/pw-browsers/' + fs.readdirSync('/opt/pw-browsers').find(d => d.startsWith('chromium-')) + '/chrome-linux/chrome' });
// opts: dsf, w, h, storage {k:v} (localStorage before load), geo {latitude, longitude} (grants permission),
// init (extra init script fn), reduced
async function open(browser, { dsf = 1, w = 390, h = 844, storage = {}, geo = null, init = null, reduced = false, touch = true, clock = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, hasTouch: touch, isMobile: touch,
    reducedMotion: reduced ? 'reduce' : 'no-preference', ...(geo ? { geolocation: geo, permissions: ['geolocation'] } : {}) });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith('https://triplet.test/')) return route.fulfill({ contentType: 'text/html', body: fs.readFileSync(path.join(REPO, 'index.html'), 'utf8') });
    if (u.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(VENDOR + '/leaflet.js') });
    if (u.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(VENDOR + '/leaflet.css') });
    if (u.includes('supabase')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(__dirname + '/stub.js') });
    if (u.includes('fonts.googleapis.com')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(VENDOR + '/archivo.css') });
    if (u.includes('fonts.gstatic.com')) return route.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(VENDOR + '/' + u.split('/').pop()) });
    if (u.includes('tile.openstreetmap')) return route.fulfill({ contentType: 'image/png', body: TILE });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(st => { try { if (!sessionStorage.getItem('__seeded')) { sessionStorage.setItem('__seeded', '1');
    localStorage.setItem('triplet.citySelection', 'copenhagen'); for (const [k, v] of Object.entries(st)) localStorage.setItem(k, v); } } catch (e) {} }, storage);
  if (init) await page.addInitScript(init);
  if (clock) await page.clock.install();
  await page.goto('https://triplet.test/index.html');
  await page.waitForTimeout(900);
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page, errors };
}
module.exports = { open, launch };
