const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const H = '/home/user/la-trip-map/design/gesture-harness'; const OUT = process.env.OUT;
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
// signed-out stub for ?signin loads
const WRAP = `;(function(){const cc=window.supabase.createClient;window.supabase.createClient=function(){const c=cc.apply(this,arguments);
if(location.search.includes('signin')){c.auth.getSession=async()=>({data:{session:null}});c.auth.onAuthStateChange=()=>({data:{subscription:{unsubscribe(){}}}});}return c}})();`;
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  for (const dsf of [1, 3]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: dsf, hasTouch: true, isMobile: true });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    const html = fs.readFileSync('/home/user/la-trip-map/index.html', 'utf8');
    await page.route('**/*', r => { const u = r.request().url();
      if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: html });
      if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/vendor/leaflet.js') });
      if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/leaflet.css') });
      if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/stub.js', 'utf8') + WRAP });
      if (u.includes('fonts.googleapis.com')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/archivo.css') });
      if (u.includes('fonts.gstatic.com')) { const f = H + '/vendor/' + u.split('/').pop(); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); }
      return r.fulfill({ status: 404, body: '' }); });
    await page.goto('https://triplet.test/index.html?play');
    await page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length > 5);
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
    await page.click('#accountBtn'); await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/play-menu-${dsf}x.png` });
    if (dsf === 1) {
      await Promise.all([page.waitForURL(/signin|index\.html$/), page.click('#dropdownLogoutBtn')]);
      await page.waitForTimeout(800);
      console.log('after Sign in:', page.url(), 'modal:', await page.evaluate(() => document.getElementById('authModal').classList.contains('show')));
      await page.screenshot({ path: `${OUT}/play-signin-modal-1x.png` });
    }
    console.log(dsf, 'errors', errs); await ctx.close();
  }
  await b.close();
})();
