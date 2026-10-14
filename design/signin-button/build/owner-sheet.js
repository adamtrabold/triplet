// Composes owner-sheet-3x.png (390 CSS px wide, 3x) from the build stills (run stills.js first).
//   node design/signin-button/build/owner-sheet.js
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const D = __dirname, V = path.resolve(__dirname, '../../gesture-harness/vendor');
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(D, n + '-3x.png')).toString('base64');
// A 3x still shown at 1:1 CSS px; `crop` (CSS px of the source) via a clipping box.
const pic = (n, crop, cap, scale = 1) => {
  const [x, y, w, h] = crop;
  return `<figure><div class="pic" style="width:${w * scale}px;height:${h * scale}px"><img src="${img(n)}" style="width:${scale}px;transform-origin:0 0;transform:translate(${-x * scale}px,${-y * scale}px)" onload="this.style.width=(this.naturalWidth/3*${scale})+'px'"></div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
};
// corner crops are 190x96 CSS (x 200..390 of the screen); the badge sits at 66..116 x, 16..66 y in them
const BADGE = [59, 9, 64, 64];
const CORNER = [40, 0, 150, 84];
const html = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo">
<style>
  body { margin: 0; width: 390px; background: #F2EBDD; color: #1A1A18; font-family: Archivo, sans-serif; }
  .wrap { padding: 20px 16px 24px; }
  h1 { font-size: 18px; line-height: 22px; font-stretch: 75%; text-transform: uppercase; letter-spacing: .06em; color: #12293F; margin: 0 0 6px; }
  h2 { font-size: 13px; line-height: 16px; font-stretch: 75%; text-transform: uppercase; letter-spacing: .08em; color: #12293F; margin: 22px 0 6px; }
  p { font-size: 13px; line-height: 18px; margin: 0 0 8px; color: #5A564C; }
  .row { display: flex; gap: 5px; flex-wrap: wrap; }
  figure { margin: 0; }
  .pic { overflow: hidden; position: relative; border-radius: 2px; }
  .pic img { position: absolute; left: 0; top: 0; }
  figcaption { font-size: 11px; line-height: 14px; color: #5A564C; margin-top: 3px; text-align: center; }
  .note { font-size: 12px; line-height: 16px; color: #5A564C; border-top: 1px solid #D8CEBA; padding-top: 10px; margin-top: 22px; }
</style>
<div class="wrap">
<h1>Sign-in badge, built</h1>
<p>The real app on a phone (390px), at real size unless marked.</p>
<h2>Signed out, top-right corner</h2>
<div class="row">${pic('signed-out-rest', CORNER, 'At rest')}${pic('signed-out-pressed', CORNER, 'Pressed')}</div>
<h2>Signing in: after the reload, about 1/4 s after the list appears</h2>
<div class="row">${pic('arrival-0-hold', BADGE, 'Hold')}${pic('arrival-60ms', BADGE, '0.06s')}${pic('arrival-130ms', BADGE, '0.13s')}${pic('arrival-250ms', BADGE, '0.25s')}${pic('arrival-end-signed-in', BADGE, 'Signed in')}</div>
<h2>Signing out: after the menu closes, then the reload</h2>
<div class="row">${pic('signout-0ms', BADGE, '0s')}${pic('signout-150ms', BADGE, '0.15s')}${pic('signout-300ms', BADGE, '0.3s')}${pic('signout-450ms', BADGE, '0.45s')}${pic('signout-end-playground', BADGE, 'Signed out')}</div>
<h2>New: the keyboard focus ring (keyboard only)</h2>
<div class="row">${pic('signed-out-focus', CORNER, 'Signed out')}${pic('signed-in-focus', CORNER, 'Signed in')}</div>
<h2>The sign-in sheet (shown at half size)</h2>
<div class="row">${pic('sheet-rest', [14, 200, 362, 400], 'At rest', 0.48)}${pic('sheet-busy', [14, 200, 362, 400], 'Signing in', 0.48)}${pic('sheet-error-wrong', [14, 200, 362, 400], 'Wrong password', 0.48)}</div>
<h2>Signed in: the menu</h2>
<div class="row">${pic('signed-in-dropdown', [0, 0, 340, 200], 'Sign out, renamed from Logout')}</div>
<div class="note">The map is blank only in our test setup (it can't load map tiles); on your phone the badge sits on the real map.</div>
</div>`;
(async () => {
  const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  const page = await b.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 3 });
  await page.route('**/*', r => { const u = r.request().url();
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(V + '/archivo.css') });
    if (u.includes('fonts.gstatic.com')) { const f = V + '/' + u.split('/').pop(); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); }
    return r.continue(); });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(D, 'owner-sheet-3x.png'), fullPage: true });
  await b.close(); console.log('owner-sheet-3x.png');
})();
