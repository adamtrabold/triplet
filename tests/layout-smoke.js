const L = require('./lib'); const FILE = L.FILE;
(async () => { const b = await L.launch(); let fails = 0;
  const ok = (n, c, v) => { if (!c) fails++; console.log((c ? 'PASS ' : 'FAIL ') + n + ' ' + JSON.stringify(v)); };
  for (const mode of ['plain', 'standalone', 'tab-emulated']) {
    const fresh = async () => { const o = await L.openProto(b, { dsf: 1, file: FILE });
      if (mode === 'standalone') { await o.cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 62, bottom: 34, left: 0, right: 0 } }); }
      if (mode === 'tab-emulated') await o.page.evaluate(() => { document.documentElement.style.setProperty('--chrome-bottom', '100px'); });
      await o.page.waitForTimeout(400); await o.page.evaluate(() => map.invalidateSize()); return o; };
    const st = (page, i) => page.evaluate(i => { const l = locations[i]; return { starred: !!l.starred, visited: !!l.visited, nav: __nav.length, del: __del.length, scrollY }; }, i);
    { const { ctx, page, cdp } = await fresh(); const r = await L.rowRect(page, 0); const y = r.y + r.h / 2;
      await L.T(cdp, 'touchStart', 150, y); await page.waitForTimeout(60); await L.T(cdp, 'touchEnd', 0, 0); await page.waitForTimeout(300);
      const s = await st(page, 0); ok(`${mode} list tap navigates`, s.nav === 1 && s.del === 0, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const r = await L.rowRect(page, 0); const y = r.y + r.h / 2; const s0 = await st(page, 0);
      await L.drag(page, cdp, L.line(170, y, 250, y, 16)); await page.waitForTimeout(900);
      const s = await st(page, 0); ok(`${mode} star swipe commits`, s.starred !== s0.starred && s.nav === 0 && s.del === 0 && s.scrollY === 0, { s0, s }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const idx = await page.evaluate(() => locations.findIndex(l => !l.visited)); const r = await L.rowRect(page, idx); const y = r.y + r.h / 2;
      await L.drag(page, cdp, L.line(r.x + r.w - 30, y, r.x + r.w - 140, y, 12)); await page.waitForTimeout(900);
      const s = await st(page, idx); ok(`${mode} visit swipe commits (row ${idx}), no delete`, s.visited && s.nav === 0 && s.del === 0 && s.scrollY === 0, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const r = await L.rowRect(page, 1); const y = r.y + r.h / 2;
      await L.drag(page, cdp, L.line(200, y + 60, 205, y - 120, 14)); await page.waitForTimeout(700);
      const v = await page.evaluate(() => ({ list: document.getElementById('locationsList').scrollTop, scrollY, nav: __nav.length, starred: locations.map(l => !!l.starred).join() }));
      ok(`${mode} vertical list scroll works, page doesn't scroll`, v.list > 50 && v.scrollY === 0 && v.nav === 0, v); await ctx.close(); }
  }
  await b.close(); console.log(fails ? 'FAILS ' + fails : 'ALL PASS'); })();
