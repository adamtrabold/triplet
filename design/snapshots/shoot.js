// Renders the app as it was at a git commit and saves a phone-size screenshot.
// usage: node design/snapshots/shoot.js <commit> <out.png> [signedout] [w] [h] [dsf]
// Uses the gesture-harness fixture data (stub.js); sandbox has no tiles, so the map is blank paper.
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.resolve(__dirname, '../..'), V = ROOT + '/design/gesture-harness/vendor';
const [commit, out, mode = '', w = '390', h = '844', dsf = '3'] = process.argv.slice(2);
const html = execSync(`git -C ${ROOT} show ${commit}:index.html`, { maxBuffer: 1 << 26 }).toString();
let stub = fs.readFileSync(ROOT + '/design/gesture-harness/stub.js', 'utf8');
if (mode === 'signedout') stub = stub.replace(/localStorage\.setItem\('sb-[^']*-auth-token'[^;]*;/g, '');
(async () => {
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dsf, hasTouch: +w < 900, isMobile: +w < 900 });
  const p = await ctx.newPage();
  await p.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: html });
    if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(V + '/leaflet.js') });
    if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(V + '/leaflet.css') });
    if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: stub });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(V + '/archivo.css') });
    if (u.includes('fonts.gstatic.com')) { const f = V + '/' + u.split('/').pop(); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); }
    return r.fulfill({ status: 404, body: '' }); });
  await p.addInitScript(() => { try { localStorage.setItem('triplet.citySelection', 'reykjavik'); } catch (e) {} });
  await p.goto('https://triplet.test/index.html');
  await p.waitForTimeout(2500); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out });
  await b.close(); console.log('saved', out);
})();
