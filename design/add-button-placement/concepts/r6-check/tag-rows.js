// Rows left with a tag open: today's main (TAG_SHEET_GAP 48) vs the Float at 78 / 88, at 320, 375, 664, 844. Copenhagen + Reykjavik.
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const REAL = '/home/user/la-trip-map/index.html'; const real = fs.readFileSync(REAL, 'utf8');
const gapCopy = g => { const f = path.join(__dirname, `.gap${g}.html`); fs.writeFileSync(f, real.replace('const TAG_SHEET_GAP = 48;', `const TAG_SHEET_GAP = ${g};`)); return f; };
(async () => { const b = await L.launch(); const out = {};
  for (const g of [48, 78, 88]) { const html = gapCopy(g);
    for (const [vp, city] of [[[320, 568], 'copenhagen'], [[375, 667], 'reykjavik'], [[390, 664], 'reykjavik'], [[390, 844], 'reykjavik']]) {
      const { ctx, page } = await L.open(b, { html, vp, dsf: 1 });
      await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(900);
      const id = await page.evaluate(() => (locations.find(l => l.starred && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || {}).id);
      const r0 = await L.rowsVisible(page);
      await page.click(`#locationsList .location-card[data-id="${id}"]`); await page.waitForTimeout(1900);
      out[`${g}@${vp.join('x')}`] = { rowsBefore: r0, rows: await L.rowsVisible(page), lower: await page.evaluate(() => document.documentElement.style.getPropertyValue('--sheet-lower')),
        tagFoot: await page.evaluate(() => { const t = document.querySelector('.tag-popup .tag-body') || document.querySelector('.tag-popup'); return t && Math.round(t.getBoundingClientRect().bottom); }) };
      await ctx.close(); }
    fs.unlinkSync(html); }
  console.log(JSON.stringify(out, null, 1)); fs.writeFileSync(path.join(__dirname, 'measure-tagrows.json'), JSON.stringify(out, null, 1)); await b.close(); })();
