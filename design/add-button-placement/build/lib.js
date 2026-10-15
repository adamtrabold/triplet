// Render harness: serves an index.html with the gesture-harness Supabase stub (same as concepts/lib-render.js, paths fixed).
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const H = require('path').join(__dirname, '../../gesture-harness');
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const SIGNOUT = `;(function(){const cc=window.supabase.createClient;window.supabase.createClient=function(){const c=cc.apply(this,arguments);
if(location.search.includes('signin')){c.auth.getSession=async()=>({data:{session:null}});c.auth.onAuthStateChange=()=>({data:{subscription:{unsubscribe(){}}}});}return c}})();`;
function withInset(html) {
  return html.replace(/env\(safe-area-inset-bottom(, *0px)?\)/g, '34px').replace(/env\(safe-area-inset-top(, *0px)?\)/g, '47px')
    .replace('<html lang="en">', '<html lang="en" class="standalone" style="--chrome-top-inset:47px">');
}
async function launch() { return chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` }); }
async function open(b, s) {
  let html = fs.readFileSync(s.html, 'utf8');
  if (s.inset) html = withInset(html);
  const ctx = await b.newContext({ viewport: { width: s.vp[0], height: s.vp[1] }, deviceScaleFactor: s.dsf || (s.desk ? 1 : 3), hasTouch: !s.desk, isMobile: !s.desk, reducedMotion: s.reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: html });
    if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/vendor/leaflet.js') });
    if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/leaflet.css') });
    if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/stub.js', 'utf8') + SIGNOUT + (s.js || '') });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/archivo.css') });
    if (u.includes('fonts.gstatic.com')) { const f = H + '/vendor/' + u.split('/').pop(); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); }
    return r.fulfill({ status: 404, body: '' }); });
  await page.goto('https://triplet.test/index.html' + (s.q || ''));
  await page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length > 5);
  await page.evaluate(() => document.fonts.ready);
  if (await page.evaluate(() => document.getElementById('authModal').classList.contains('show'))) { await page.click('#cancelAuthBtn'); await page.waitForTimeout(300); }
  await page.waitForTimeout(400);
  return { ctx, page, errs };
}
module.exports = { launch, open };
