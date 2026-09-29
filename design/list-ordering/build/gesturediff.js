// Differential row-gesture check: the same gestures (by place id) against REPO's index.html.
// Prints one JSON line of outcomes; run once with REPO=<base checkout> and once on this branch, compare.
// (The tracked suites test6/flip6/vtest need design/pencil-star/lib.js, s2.js, r5-metrics.js and
// design/star2/lib.js, which were never committed; this is the stand-in.)
const { open, launch } = require('./harness');
const W = ms => new Promise(r => setTimeout(r, ms));
async function pt(page, id, sel) { await page.evaluate(id => document.querySelector(`.location-card[data-id="${id}"]`).scrollIntoView({ block: 'center' }), id); await W(150);
  return page.evaluate(([id, sel]) => { const b = document.querySelector(`.location-card[data-id="${id}"] ${sel}`).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, l: b.x }; }, [id, sel]); }
async function drag(page, pts, hold = 0) { const c = await page.context().newCDPSession(page);
  await c.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pts[0]] });
  for (const p of pts.slice(1)) { await c.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [p] }); await W(16); }
  if (hold) await W(hold);
  await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
const line = (x0, y, x1, n) => Array.from({ length: n + 1 }, (_, i) => ({ x: x0 + (x1 - x0) * i / n, y }));
const st = (page, id) => page.evaluate(id => { const l = locations.find(x => x.id === id), el = document.querySelector(`.location-card[data-id="${id}"]`);
  return l ? { s: !!l.starred, v: !!l.visited, star: !!el.querySelector('.row-star'), stamp: el.querySelectorAll('.row-stamp').length, live: el.className.includes('-live'), held: starHeld.size, h: el.getBoundingClientRect().height } : 'gone'; }, id);
(async () => {
  const b = await launch(); const out = {};
  for (const reduced of [false, true]) { const R = reduced ? 'r' : 'f';
    const run = async (name, fn) => { const { ctx, page, errors } = await open(b, { reduced }); await page.evaluate(() => { window.__conf = 0; window.confirm = () => { __conf++; return false; }; });
      try { out[`${R}:${name}`] = { ...(await fn(page)), err: errors.length }; } catch (e) { out[`${R}:${name}`] = { threw: e.message.slice(0, 80) }; } await ctx.close(); };
    await run('star', async p => { const q = await pt(p, 'mir', '.row-main'); await drag(p, line(q.l + 10, q.y, q.l + 120, 12)); await W(1400); return await st(p, 'mir'); });
    await run('unstar', async p => { const q = await pt(p, 'cof', '.row-main'); await drag(p, line(q.l + 10, q.y, q.l + 120, 12)); await W(1600); return await st(p, 'cof'); });
    await run('star-cancel40', async p => { const q = await pt(p, 'mir', '.row-main'); await drag(p, line(q.l + 10, q.y, q.l + 50, 6)); await W(900); return await st(p, 'mir'); });
    await run('visit', async p => { const q = await pt(p, 'mir', '.delete-btn'); await drag(p, line(q.x, q.y, q.x - 110, 12)); await W(1400); return { ...(await st(p, 'mir')), conf: await p.evaluate(() => __conf) }; });
    await run('unvisit', async p => { const q = await pt(p, 'ref', '.delete-btn'); await drag(p, line(q.x, q.y, q.x - 110, 12)); await W(1400); return { ...(await st(p, 'ref')), conf: await p.evaluate(() => __conf) }; });
    await run('visit-cancel50', async p => { const q = await pt(p, 'mir', '.delete-btn'); await drag(p, line(q.x, q.y, q.x - 50, 6)); await W(900); return { ...(await st(p, 'mir')), conf: await p.evaluate(() => __conf) }; });
    await run('x-nudge8', async p => { const q = await pt(p, 'mir', '.delete-btn'); await drag(p, line(q.x, q.y, q.x - 8, 2)); await W(500); return { conf: await p.evaluate(() => __conf) }; });
    await run('x-tap', async p => { const q = await pt(p, 'mir', '.delete-btn'); await p.touchscreen.tap(q.x, q.y); await W(500); return { conf: await p.evaluate(() => __conf) }; });
    await run('row-tap', async p => { const q = await pt(p, 'tiv', '.row-main'); await p.touchscreen.tap(q.x, q.y); await W(1800);
      return await p.evaluate(() => ({ z: map.getZoom() >= 14, pop: (document.querySelector('.leaflet-popup .popup-title') || {}).textContent })); });
    await run('two-quick-strokes', async p => { const a = await pt(p, 'mir', '.delete-btn'); await drag(p, line(a.x, a.y, a.x - 110, 8)); const c = await pt(p, 'tor', '.row-main'); await drag(p, line(c.l + 10, c.y, c.l + 120, 8)); await W(1600); return { a: await st(p, 'mir'), c: await st(p, 'tor') }; });
    await run('rows56', async p => ({ all56: await p.evaluate(() => [...document.querySelectorAll('.location-card')].every(e => e.getBoundingClientRect().height === 56)) }));
  }
  console.log(JSON.stringify(out)); await b.close();
})();
