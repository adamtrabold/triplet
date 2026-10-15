// Re-shoot: node design/add-button-placement/build/stills.js index.html design/add-button-placement/build   (ONLY=<prefix> for one frame)
// node stills.js <index.html> <outdir> -- the build's stills, 3x (1170 wide at 390), one per state the handoff names.
const L = require('./lib.js'); const path = require('path'); const fs = require('fs');
const { execFileSync } = require('child_process');
const HTML = process.argv[2], OUT = process.argv[3];
fs.mkdirSync(OUT, { recursive: true });
const starTag = async p => { const id = await p.evaluate(() => (locations.find(l => l.starred && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || {}).id); await p.click(`#locationsList .location-card[data-id="${id}"] .row-main`); await p.waitForTimeout(1900); };
const bbox = p => p.evaluate(() => { const r = document.getElementById('floatingAddBtn').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
const S = [
  ['01-rest-390x844', {}],
  ['02-rest-390x664-safari-tab', { vp: [390, 664] }],
  ['03-rest-375x667', { vp: [375, 667] }],
  ['04-rest-320x568-no-leaflet-prefix', { vp: [320, 568], city: 'reykjavik' }],
  ['05-list-collapsed-home-screen', { inset: true, pre: 'collapse' }],
  ['06-tag-open-390x844', { pre: 'tag' }],
  ['07-tag-open-390x664', { vp: [390, 664], pre: 'tag' }],
  ['08-tag-open-320x568', { vp: [320, 568], city: 'reykjavik', pre: 'tag' }],
  ['09-filters-open-covers-badge', { pre: 'filters' }],
  ['10-form-open-390x844', { tap: true }],
  ['11-form-open-390x664', { vp: [390, 664], tap: true }],
  ['12-form-open-320x568', { vp: [320, 568], city: 'reykjavik', tap: true }],
  ['13-form-open-320x568-scrolled', { vp: [320, 568], city: 'reykjavik', tap: true, tall: true }],
  ['14-form-open-from-collapsed-home-screen', { inset: true, pre: 'collapse', tap: true }],
  ['15-stale-sign-in-tap', { q: '?signin', tap: true }],
  ['16-desktop-rest-1280x800', { vp: [1280, 800], desk: true }],
  ['17-desktop-form-open-1280x800', { vp: [1280, 800], desk: true, tap: true }],
];
(async () => {
  const b = await L.launch();
  for (const [n, s] of S) { if (process.env.ONLY && !n.startsWith(process.env.ONLY)) continue;
    const { ctx, page, errs } = await L.open(b, { html: HTML, vp: s.vp || [390, 844], inset: s.inset, desk: s.desk, q: s.q });
    await page.evaluate(c => setActiveCity(c), s.city || 'reykjavik'); await page.waitForTimeout(900);
    if (s.pre === 'collapse') { await page.click('#collapseBtn'); await page.waitForTimeout(700); }
    if (s.pre === 'filters') { await page.click('#toggleFiltersBtn'); await page.waitForTimeout(700); }
    if (s.pre === 'tag') await starTag(page);
    if (s.tap) { await page.click('#floatingAddBtn'); await page.waitForTimeout(1100); }
    if (s.tall) { await page.evaluate(() => { document.getElementById('newCityConfirm').style.display = ''; document.getElementById('newCityConfirmText').textContent = 'Looks like this is in Lund. Add Lund as a new city?'; }); await page.waitForTimeout(200);
      await page.evaluate(() => { const c = document.getElementById('controls'); c.scrollTop = 150; }); await page.waitForTimeout(300); }
    await page.screenshot({ path: path.join(OUT, n + '.png') });
    if (errs.length) console.log(n, 'ERRS', errs);
    console.log(n, 'ok');
    await ctx.close();
  }
  if (process.env.ONLY) { await b.close(); return; }
  // The states, close up at 3x: rest, pressed, open, open + pressed, keyboard focus -- next to the account badge.
  const crops = [];
  for (const [n, how] of [['rest', ''], ['pressed', 'press'], ['open', 'open'], ['open-pressed', 'openpress'], ['focus', 'focus']]) {
    const { ctx, page } = await L.open(b, { html: HTML, vp: [390, 844] });
    await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(900);
    if (how.startsWith('open')) { await page.click('#floatingAddBtn'); await page.waitForTimeout(1100); }
    const r = await bbox(page);
    if (how.endsWith('press')) { await page.mouse.move((r[0] + r[2]) / 2, (r[1] + r[3]) / 2); await page.mouse.down(); await page.waitForTimeout(300); }
    if (how === 'focus') { await page.keyboard.press('Tab'); await page.evaluate(() => document.getElementById('floatingAddBtn').focus()); await page.waitForTimeout(200); }
    const f = path.join(OUT, `_state-${n}.png`);
    await page.screenshot({ path: f, clip: { x: r[0] - 10, y: r[1] - 10, width: 80, height: 80 } });
    crops.push([n, f]);
    if (how === 'rest') await page.screenshot({ path: path.join(OUT, '_state-account.png'), clip: (await page.evaluate(() => { const a = document.getElementById('accountBtn').getBoundingClientRect(); return { x: a.left - 15, y: a.top - 15, width: 80, height: 80 }; })) });
    if (how.endsWith('press')) await page.mouse.up();
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, '_crops.json'), JSON.stringify(crops));
})();
