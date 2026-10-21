// Today's controls, rendered from the app on main (the inventory's renders date from 10-13; the +, the account,
// the list tab, the menus and the add tag changed since). Each icon's box at 6x, with its own surface behind it.
// Run from anywhere:
//   git show origin/main:index.html > <tmp>/main.html
//   node design/icon-system/grid/src/originals/today-ctl.js <tmp>/main.html <outDir>
// then python3 design/icon-system/grid/src/originals/orig.py <outDir>
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.resolve(__dirname, '../../../../..'), V = ROOT + '/design/gesture-harness/vendor';
const html = fs.readFileSync(process.argv[2], 'utf8'), outDir = process.argv[3];
fs.mkdirSync(outDir, { recursive: true });
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
  await p.addInitScript(() => { try { localStorage.setItem('triplet.citySelection', 'reykjavik'); localStorage.setItem('gh.plans', '1'); } catch (e) {} });
  await p.goto('https://triplet.test/index.html');
  await p.waitForTimeout(2500); await p.evaluate(() => document.fonts.ready);
  const meta = {};
  const shot = async (sel, name, pad = 2) => {
    await p.locator(sel).first().scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
    const bb = await p.locator(sel).first().boundingBox(); if (!bb || bb.y < 0 || bb.y + bb.height > 844) { console.log('missing or off screen', sel); return; }
    const clip = { x: bb.x - pad, y: bb.y - pad, width: bb.width + 2 * pad, height: bb.height + 2 * pad };
    await p.screenshot({ path: `${outDir}/${name}.png`, clip }); meta[name] = { w: +clip.width.toFixed(2), h: +clip.height.toFixed(2) };
  };
  // tag the first svg under `scope` whose markup contains `needle`, so it can be shot alone
  const mark = (scope, needle, id) => p.evaluate(([s, n, i]) => { const el = [...document.querySelectorAll(s + ' svg')].find(v => v.outerHTML.includes(n) && v.getBoundingClientRect().width > 0); if (el) el.id = i; return !!el; }, [scope, needle, id]);
  for (const [sel, nm] of [['#floatingAddBtn', 'ctl-add'], ['#accountBtn', 'ctl-account'], ['#sortBtn', 'ctl-sort'], ['#toggleFiltersBtn', 'ctl-filters'], ['#centerMeBtn', 'ctl-locate'], ['#collapseTab', 'ctl-collapse']]) await shot(sel, nm);
  await shot('#titleBtn svg', 'ctl-title-chev', 3);
  // the title menu: places side (ring, tick, right chevron, eye), then the plans side (route, New plan +)
  await p.locator('#titleBtn').click(); await p.waitForTimeout(500);
  if (await mark('#titleMenu', 'r="8"', 'oc-ring')) await shot('#oc-ring', 'menu-ring', 3);
  if (await mark('#titleMenu', 'M3 7.75', 'oc-check')) await shot('#oc-check', 'menu-check', 3);
  if (await mark('#titleMenu', 'M6 3.5', 'oc-chev')) await shot('#oc-chev', 'menu-chev', 3);
  if (await mark('#titleMenu', 'r="2.6"', 'oc-route')) await shot('#oc-route', 'menu-route', 3);
  await p.locator('#titleMenu [data-kind="plans"]').first().click().catch(() => console.log('no plans row'));
  await p.waitForTimeout(500);
  if (await mark('#titleMenu', 'M12 5v14', 'oc-plus')) await shot('#oc-plus', 'menu-plus', 3);
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  // a section header's eye (All places shows one section per city)
  if (await mark('body', 'M2 12s3.6', 'oc-eye')) await shot('#oc-eye', 'sec-eye', 3); else console.log('no eye on screen');
  // the sort menu's tick
  await p.locator('#sortBtn').click(); await p.waitForTimeout(400);
  await shot('.sort-opt[aria-checked="true"] .sort-check', 'sort-check', 3);
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  // the add tag's x (the Float badge hides while the tag is open, so its own x never shows)
  await p.locator('#floatingAddBtn').click(); await p.waitForTimeout(900);
  await shot('#addCancel', 'ctl-add-open', 0);
  fs.writeFileSync(outDir + '/meta.json', JSON.stringify(meta, null, 1)); console.log(meta);
  await b.close();
})();
