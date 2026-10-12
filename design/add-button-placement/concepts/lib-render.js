// Shared render harness for concept prototypes (B striker, C pin): serves a COPY of index.html
// (the concept folder's own index.html) with the gesture-harness Supabase stub. The real index.html is never touched.
// open(browser, { html, vp:[w,h], q:'?play', desk:false, inset:false, js:'' }) -> { ctx, page, errs }
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const H = '/home/user/la-trip-map/design/gesture-harness';
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const SIGNOUT = `;(function(){const cc=window.supabase.createClient;window.supabase.createClient=function(){const c=cc.apply(this,arguments);
if(location.search.includes('signin')){c.auth.getSession=async()=>({data:{session:null}});c.auth.onAuthStateChange=()=>({data:{subscription:{unsubscribe(){}}}});}return c}})();`;
// Home Screen launch on a notched iPhone: safe-area insets hard-coded (Chromium has no notch).
function withInset(html) {
  return html.replace(/env\(safe-area-inset-bottom(, *0px)?\)/g, '34px').replace(/env\(safe-area-inset-top(, *0px)?\)/g, '47px')
    .replace('<html lang="en">', '<html lang="en" class="standalone" style="--chrome-top-inset:47px">');
}
async function launch() { return chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` }); }
async function open(b, s) {
  let html = fs.readFileSync(s.html, 'utf8');
  if (s.inset) html = withInset(html);
  if (s.patch) html = s.patch(html);
  const ctx = await b.newContext({ viewport: { width: s.vp[0], height: s.vp[1] }, deviceScaleFactor: s.desk ? 1 : (s.dsf || 3), hasTouch: !s.desk, isMobile: !s.desk });
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
const box = (page, q) => page.evaluate(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left, r.top, r.right, r.bottom].map(Math.round) : 'hidden'; }, q);
const hit = (page, q) => page.evaluate(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); if (!r.width) return null; const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return t ? (t === e || e.contains(t) ? 'self' : (t.id || t.className || t.tagName)) : null; }, q);
// rows wholly visible inside the list viewport (and above the screen bottom)
const rowsVisible = page => page.evaluate(() => { const l = document.getElementById('locationsList'); if (!l || !l.offsetHeight) return 0; const lr = l.getBoundingClientRect(); const bottom = Math.min(lr.bottom, innerHeight - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--strip-h')) || 0));
  return [...l.querySelectorAll('.location-card[data-id]')].filter(c => { const r = c.getBoundingClientRect(); return r.top >= lr.top - 1 && r.bottom <= bottom + 1; }).length; });
module.exports = { launch, open, box, hit, rowsVisible, fs };
