// Stills for the CD at 1x, 3x and ~4x crops. OUT=<dir> VENDOR=<dir> node stills.js
const { open, launch } = require('./harness');
const path = require('path');
const OUT = process.env.OUT || path.join(__dirname, 'stills');
require('fs').mkdirSync(OUT, { recursive: true });
const W = ms => new Promise(r => setTimeout(r, ms));
const JAEGER = { latitude: 55.6925, longitude: 12.5445 };
const tapBtn = async page => { const r = await page.evaluate(() => { const b = document.getElementById('sortBtn').getBoundingClientRect(); return { x: b.x + 16, y: b.y + 16 }; }); await page.touchscreen.tap(r.x, r.y); await W(350); };
const clipOf = (page, sel, pad = 0) => page.evaluate(([sel, pad]) => { const b = document.querySelector(sel).getBoundingClientRect(); return { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + pad * 2, height: b.height + pad * 2 }; }, [sel, pad]);
const union = (a, b) => { const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y); return { x, y, width: Math.max(a.x + a.width, b.x + b.width) - x, height: Math.max(a.y + a.height, b.y + b.height) - y }; };
(async () => {
  const b = await launch();
  for (const dsf of [1, 3]) {
    const s = `@${dsf}x`;
    { const { ctx, page } = await open(b, { dsf });
      await page.screenshot({ path: `${OUT}/phone-rest${s}.png` });
      await page.screenshot({ path: `${OUT}/header-rest${s}.png`, clip: await clipOf(page, '#locationsHeader') });
      await tapBtn(page);
      await page.screenshot({ path: `${OUT}/phone-menu${s}.png` });
      await page.screenshot({ path: `${OUT}/menu${s}.png`, clip: union(await clipOf(page, '#sortMenu', 10), await clipOf(page, '#locationsHeader')) });
      await page.tap('.sort-opt[data-sort="category"]').catch(async () => { await page.evaluate(() => document.querySelector('.sort-opt[data-sort="category"]').click()); }); await W(400);
      await page.screenshot({ path: `${OUT}/phone-category${s}.png` });
      await page.screenshot({ path: `${OUT}/header-mark${s}.png`, clip: await clipOf(page, '#locationsHeader') });
      await page.addStyleTag({ content: '#sortBtn.not-default .sort-mark{display:none}' });
      await page.screenshot({ path: `${OUT}/header-nomark${s}.png`, clip: await clipOf(page, '#locationsHeader') });
      await ctx.close(); }
    { const { ctx, page } = await open(b, { dsf, geo: JAEGER });
      await tapBtn(page); await page.evaluate(() => document.querySelector('.sort-opt[data-sort="nearest"]').click()); await W(700);
      await page.screenshot({ path: `${OUT}/phone-nearest${s}.png` });
      await ctx.close(); }
    { const { ctx, page } = await open(b, { dsf, init: () => { navigator.geolocation.watchPosition = (ok, err) => { setTimeout(() => err({ code: 1 }), 60); return 1; }; } });
      await tapBtn(page); await page.evaluate(() => document.querySelector('.sort-opt[data-sort="nearest"]').click()); await W(500);
      await page.screenshot({ path: `${OUT}/phone-nearest-denied${s}.png` });
      await tapBtn(page);
      await page.screenshot({ path: `${OUT}/menu-nearest-off${s}.png`, clip: union(await clipOf(page, '#sortMenu', 10), await clipOf(page, '#locationsHeader')) });
      await ctx.close(); }
    { const { ctx, page } = await open(b, { dsf });
      await page.tap('#collapseBtn'); await W(600); await tapBtn(page);
      await page.screenshot({ path: `${OUT}/phone-collapsed-menu${s}.png` });
      await ctx.close(); }
  }
  { const { ctx, page } = await open(b, { dsf: 4 });
    await page.screenshot({ path: `${OUT}/crop-icons@4x.png`, clip: await page.evaluate(() => { const a = document.getElementById('sortBtn').getBoundingClientRect(), c = document.getElementById('centerMeBtn').getBoundingClientRect(); return { x: a.x - 8, y: a.y - 8, width: c.right - a.x + 16, height: a.height + 16 }; }) });
    await tapBtn(page);
    await page.screenshot({ path: `${OUT}/crop-menu-top@4x.png`, clip: await page.evaluate(() => { const m = document.getElementById('sortMenu').getBoundingClientRect(); return { x: m.x - 6, y: m.y - 6, width: m.width + 12, height: 100 }; }) });
    await ctx.close(); }
  { const { ctx, page } = await open(b, { dsf: 2, w: 1280, h: 800, touch: false });
    await page.click('#sortBtn'); await W(350);
    await page.screenshot({ path: `${OUT}/desktop-menu@2x.png`, clip: { x: 0, y: 0, width: 520, height: 420 } });
    await ctx.close(); }
  await b.close(); console.log('ok');
})();
