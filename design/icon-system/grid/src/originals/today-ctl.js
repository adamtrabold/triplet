// today's controls, rendered from origin/main's index.html (the inventory's renders date from 10-13; the + and the
// account changed since). Each button's box, at 6x, with its own surface behind it.
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/la-trip-map/.claude/worktrees/agent-ad1f8b885ed7ed704', V = ROOT + '/design/gesture-harness/vendor';
const html = fs.readFileSync(process.argv[2], 'utf8'), outDir = process.argv[3];
const stub = fs.readFileSync(ROOT + '/design/gesture-harness/stub.js', 'utf8');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 6, hasTouch: true, isMobile: true });
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
  const meta = {};
  const shot = async (sel, name, pad = 2) => {
    const bb = await p.locator(sel).first().boundingBox(); if (!bb) { console.log('missing', sel); return; }
    const clip = { x: bb.x - pad, y: bb.y - pad, width: bb.width + 2 * pad, height: bb.height + 2 * pad };
    await p.screenshot({ path: `${outDir}/${name}.png`, clip }); meta[name] = { w: +clip.width.toFixed(2), h: +clip.height.toFixed(2) };
  };
  for (const [sel, nm] of [['#floatingAddBtn', 'ctl-add'], ['#accountBtn', 'ctl-account'], ['#sortBtn', 'ctl-sort'], ['#toggleFiltersBtn', 'ctl-filters'], ['#centerMeBtn', 'ctl-locate'], ['#collapseTab', 'ctl-collapse']]) await shot(sel, nm);
  await shot('#titleBtn svg', 'ctl-title-chev', 3);
  await p.locator('#floatingAddBtn').click(); await p.waitForTimeout(900);
  await shot('#addCancel', 'ctl-add-open', 0);
  fs.writeFileSync(outDir + '/meta.json', JSON.stringify(meta, null, 1)); console.log(meta);
  await b.close();
})();
