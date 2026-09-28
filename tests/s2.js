const { launch, openProto, T, rowRect } = require('./lib');
module.exports = async function s2(b, reduced) {
  const { ctx, page, cdp } = await openProto(b, { reduced, dsf: 1 });
  await page.evaluate(() => { window.__cl = []; document.querySelectorAll('#locationsList .location-card').forEach((el, i) => new MutationObserver(() => __cl.push([i, Math.round(performance.now()), el.classList.contains('active')])).observe(el, { attributes: true, attributeFilter: ['class'] })); });
  const y0 = (await rowRect(page, 0)).y + 28, y1 = (await rowRect(page, 1)).y + 28, y2 = (await rowRect(page, 2)).y + 28;
  // stroke: 20px within the first event, then on
  await T(cdp, 'touchStart', 150, y0); await T(cdp, 'touchMove', 170, y0); for (let d = 24; d <= 90; d += 6) await T(cdp, 'touchMove', 150 + d, y0); await T(cdp, 'touchEnd');
  await page.waitForTimeout(500);
  const strokePressed = (await page.evaluate(() => __cl)).some(([i, , a]) => i === 0 && a);
  // quick tap on row 2: press appears on release and clears ~100ms later
  await page.evaluate(() => { __cl = []; window.__tu = 0; document.addEventListener('touchend', () => __tu = performance.now(), { capture: true, once: true }); });
  await T(cdp, 'touchStart', 200, y2); await page.waitForTimeout(40); await T(cdp, 'touchEnd'); await page.waitForTimeout(300);
  const q = await page.evaluate(() => ({ cl: __cl.filter(c => c[0] === 2), tu: __tu }));
  const on = q.cl.find(c => c[2]), off = q.cl.find(c => !c[2] && on && c[1] >= on[1]);
  // hold on row 1: press after ~80ms
  await page.evaluate(() => { __cl = []; window.__ts = performance.now(); });
  await T(cdp, 'touchStart', 200, y1); await page.waitForTimeout(200); const h = await page.evaluate(() => ({ cl: __cl.filter(c => c[0] === 1), ts: __ts })); await T(cdp, 'touchEnd');
  const hOn = h.cl.find(c => c[2]);
  await ctx.close();
  return { strokePressed, quickOnAfterRelease: on ? on[1] - q.tu : null, quickDuration: on && off ? off[1] - on[1] : null, holdPressAt: hOn ? hOn[1] - h.ts : null };
};
if (require.main === module) (async () => { const b = await launch(); console.log(await module.exports(b, false)); await b.close(); })();
