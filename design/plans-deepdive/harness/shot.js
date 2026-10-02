// Harness: real index.html + stubbed Supabase + local Leaflet/fonts, optional injected prototype.
// usage: node shot.js <out.png> [state] [dsf]   env PROTO=path/to/proto.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const SP = path.resolve(__dirname, '..');
const REPO = process.env.REPO;
function png1(r, g, b) { // 1x1 PNG
  const crc = (buf) => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    let x = 0xffffffff; for (const v of buf) x = t[(x ^ v) & 0xff] ^ (x >>> 8); return (x ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(1, 0); ihdr.writeUInt32BE(1, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.from([0, r, g, b]))), chunk('IEND', Buffer.alloc(0))]);
}
const TILE = png1(0xE8, 0xE4, 0xDA);
async function open(browser, { dsf = 2, state = '', w = 390, h = 844, noProto = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  await page.route('**/*', async (route) => {
    const u = route.request().url();
    if (u.startsWith('http://triplet.test/')) {
      let html = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');
      return route.fulfill({ contentType: 'text/html', body: html });
    }
    if (u.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(SP + '/package/dist/leaflet.js') });
    if (u.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(SP + '/package/dist/leaflet.css') });
    if (u.includes('supabase')) return route.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(__dirname + '/stub.js') });
    if (u.includes('fonts.googleapis.com')) return route.fulfill({ contentType: 'text/css', body: fs.readFileSync(SP + '/fonts/archivo.css') });
    if (u.includes('fonts.gstatic.com')) return route.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(SP + '/fonts/' + u.split('/').pop()) });
    if (u.includes('tile.openstreetmap')) return route.fulfill({ contentType: 'image/png', body: TILE });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(() => { try { localStorage.setItem('triplet.citySelection', 'copenhagen'); } catch (e) {} });
  await page.goto('http://triplet.test/index.html');
  await page.waitForTimeout(900);
  if (process.env.PROTO && !noProto) {
    await page.addScriptTag({ content: fs.readFileSync(process.env.PROTO, 'utf8') });
    await page.waitForTimeout(100);
    if (state) await page.evaluate(s => window.__proto && window.__proto(s), state);
    await page.waitForTimeout(state === 'popup' ? 2200 : 700);
  }
  return { ctx, page };
}
module.exports = { open };
if (require.main === module) (async () => {
  const [out, state = '', dsf = '2'] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const { page } = await open(b, { dsf: +dsf, state });
  await page.screenshot({ path: out });
  await b.close();
})();
