const { open, launch, ROWS, SHAPES } = require('./lib');
(async () => { const b = await launch(); const out = {};
  for (const w of [375, 390]) { const { ctx, page } = await open(b, '', { viewport: { width: w, height: 900 }, deviceScaleFactor: 3 }, {});
    out['heights@' + w] = await page.evaluate(() => [...new Set([...document.querySelectorAll('#locationsList .location-card')].map(c => c.getBoundingClientRect().height))]);
    if (w === 390) out.toggle = await page.evaluate(() => { const l = locations[0]; const el = () => document.querySelector(`[data-id="${l.id}"]`);
      const a = el().classList.contains('is-visited'); locations = locations.map(x => x.id === l.id ? { ...x, visited: true } : x); syncLocationCards(locations);
      const b = el().classList.contains('is-visited'); locations = locations.map(x => x.id === l.id ? { ...x, visited: false } : x); syncLocationCards(locations);
      return { before: a, afterMarkVisited: b, afterUnmark: el().classList.contains('is-visited'), shapeRowsWithClass: document.querySelectorAll('[data-shape-id].is-visited').length }; });
    // real listeners: tap on a visited row's stamp navigates; delete tap deletes
    if (w === 390) { await page.evaluate(() => { document.querySelectorAll('.location-card.active').forEach(e => e.classList.remove('active')); window.__n = 0; window.__d = 0; highlightMarker = () => __n++; confirmDelete = () => __d++; });
      const c = page.locator('#locationsList .location-card.is-visited').first(); await c.locator('.row-stamp').click({ force: true }); await c.locator('.delete-btn').click();
      out.clicks = await page.evaluate(() => ({ navs: __n, deletes: __d })); }
    await ctx.close(); }
  await b.close(); console.log(JSON.stringify(out));
  const ok = out['heights@375'].join() === '56' && out['heights@390'].join() === '56' && out.toggle.before === false && out.toggle.afterMarkVisited === true && out.toggle.afterUnmark === false && out.toggle.shapeRowsWithClass === 0 && out.clicks.navs === 1 && out.clicks.deletes === 1;
  console.log(ok ? 'ALL PASS' : 'FAIL'); process.exitCode = ok ? 0 : 1; })();
