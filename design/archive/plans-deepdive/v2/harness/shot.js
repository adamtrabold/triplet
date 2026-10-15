// Harness: real index.html + stubbed Supabase + local Leaflet/fonts, map tiles replaced by a flat stand-in.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const SP = process.env.ASSETS || path.resolve(__dirname, '..');   // holds package/dist/leaflet.* and fonts/
const REPO = process.env.REPO;
function png1(r, g, b) {
  const crc = (buf) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    let x = 0xffffffff; for (const v of buf) x = t[(x ^ v) & 0xff] ^ (x >>> 8); return (x ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(1, 0); ihdr.writeUInt32BE(1, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.from([0, r, g, b]))), chunk('IEND', Buffer.alloc(0))]);
}
const TILE = png1(0xE8, 0xE4, 0xDA);
async function open(browser, { dsf = 1, w = 390, h = 844, signedOut = false, geo = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, hasTouch: w < 900, isMobile: w < 900 });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  page.on('dialog', d => d.dismiss());
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith('http://triplet.test/')) return route.fulfill({ contentType: 'text/html', body: fs.readFileSync(path.join(REPO, 'index.html'), 'utf8') });
    if (u.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(SP + '/package/dist/leaflet.js') });
    if (u.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(SP + '/package/dist/leaflet.css') });
    if (u.includes('supabase')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(__dirname + '/stub.js') });
    if (u.includes('fonts.googleapis.com')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(SP + '/fonts/archivo.css') });
    if (u.includes('fonts.gstatic.com')) return route.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(SP + '/fonts/' + u.split('/').pop()) });
    if (u.includes('tile.openstreetmap')) return route.fulfill({ contentType: 'image/png', body: TILE });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(([so, g]) => {
    try { localStorage.setItem('triplet.citySelection', 'copenhagen'); } catch (e) {}
    if (so) window.__SIGNED_OUT = true;
    if (g) {   // a fixed position standing in for the phone's GPS
      const pos = { coords: { latitude: g.latitude, longitude: g.longitude, accuracy: 10 }, timestamp: Date.now() };
      const geo = { getCurrentPosition: (ok) => setTimeout(() => ok(pos), 50), watchPosition: (ok) => { setTimeout(() => ok(pos), 50); return 1; }, clearWatch() {} };
      Object.defineProperty(navigator, 'geolocation', { value: geo, configurable: true });
    }
  }, [signedOut, geo]);
  await page.goto('http://triplet.test/index.html');
  await page.waitForTimeout(900);
  await page.addScriptTag({ content: fs.readFileSync(__dirname + '/proto.js', 'utf8') });
  await page.waitForTimeout(100);
  return { ctx, page };
}
module.exports = { open };
