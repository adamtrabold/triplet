// A (ticket) on today's main: does the playground tap add; does the tag-cut route change the box, the title or the hit area?
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const real = fs.readFileSync('/home/user/la-trip-map/index.html', 'utf8'), rd = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const PLAY = "try { localStorage.removeItem('sb-jgvckilmltimabfdvaly-auth-token'); } catch (e) {}";
(async () => { const b = await L.launch(); const out = {};
  for (const v of ['admit', 'tagcut']) for (const [vp, city] of [[[390, 844], 'reykjavik'], [[320, 568], 'copenhagen']]) for (const mode of ['play', 'stale']) {
    const f = path.join(__dirname, '.A.html'); const i = real.lastIndexOf('</body>');
    fs.writeFileSync(f, (real.slice(0, i) + rd('stub/r5.inc.html') + rd('stub/r6.inc.html') + real.slice(i)).replace('<html lang="en"', `<html lang="en" data-a="${v}"`));
    const { ctx, page } = await L.open(b, { html: f, vp, dsf: 1, ...(mode === 'play' ? { js: PLAY } : { q: '?signin' }) });
    await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(700); await page.evaluate(() => window.fitTitle && window.fitTitle()); await page.waitForTimeout(100);
    const m = await page.evaluate(() => { const nb = document.getElementById('nb'), r = nb.getBoundingClientRect(), h = document.querySelector('#locationsHeader h2');
      const at = (x, y) => { const e = document.elementFromPoint(x, y); return e && (nb.contains(e) ? 'self' : (e.id || e.className)); };
      return { box: [r.left, r.top, r.right, r.bottom].map(Math.round), title: h.textContent, titleW: Math.round(h.getBoundingClientRect().width), ell: (h.querySelector('.n') || h).scrollWidth > (h.querySelector('.n') || h).clientWidth + 1,
        hitCutCorner: at(r.left + 2, r.top + 2), hitEyelet: at(r.left + 9.5, (r.top + r.bottom) / 2), hitCentre: at((r.left + r.right) / 2, (r.top + r.bottom) / 2) }; });
    await page.click('#nb'); await page.waitForTimeout(1000);
    m.after = await page.evaluate(() => ({ form: document.getElementById('addForm').classList.contains('show'), auth: document.getElementById('authModal').classList.contains('show'), acct: document.getElementById('dropdownLogoutBtn').textContent }));
    out[`${v}@${vp[0]}:${mode}`] = m; await ctx.close(); fs.unlinkSync(f); }
  console.log(JSON.stringify(out, null, 1)); fs.writeFileSync(path.join(__dirname, 'measure-A.json'), JSON.stringify(out, null, 1)); await b.close(); })();
