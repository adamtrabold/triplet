// Round 11b: does TAG_SHEET_GAP 90 keep 3 list rows at 664 with a place's tag open, and does the short upright (36x58) clear the tag?
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const CON = path.join(__dirname, '..'), real = fs.readFileSync('/home/user/triplet/index.html', 'utf8'), rd = f => fs.readFileSync(path.join(CON, f), 'utf8');
const inj = (h, incs, attrs) => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + incs.join('\n') + '\n' + h.slice(i)).replace('<html lang="en"', `<html lang="en" ${attrs}`); };
(async () => {
  const b = await L.launch(); const out = {};
  for (const gap of [48, 78, 88, 90, 93, 105]) for (const vp of [[390, 664], [375, 667], [320, 568], [390, 844]]) for (const name of ['Bæjarins Beztu', 'Brauð & Co, the cinnamon bakery on Frakkastígur']) {
    const f = path.join(__dirname, '_g.html');
    fs.writeFileSync(f, inj(real.replace('const TAG_SHEET_GAP = 48;', `const TAG_SHEET_GAP = ${gap};`), [rd('blank-tag-form/blank.inc.html'), rd('C-tag-r10/t.inc.html')], 'data-k="T" data-tv="orange" data-tw="104" data-tp="p6" data-trot="up"'));
    const { ctx, page } = await L.open(b, { html: f, vp, dsf: 1 });
    await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(800);
    const id = await page.evaluate(n => locations.find(l => l.name === n && l.city === 'reykjavik').id, name);
    await page.click(`#locationsList .location-card[data-id="${id}"]`); await page.waitForTimeout(1900);
    const m = await page.evaluate(() => { const r = q => { const e = document.querySelector(q); if (!e) return null; const b = e.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(v => +v.toFixed(1)); };
      return { tag: r('.tag-popup .tag-body'), sheet: Math.round(document.getElementById('locations').getBoundingClientRect().top), tb: r('#tb') }; });
    m.rows = await L.rowsVisible(page);
    m.clear = m.tag && m.tb ? +(m.tb[1] - m.tag[3]).toFixed(1) : null;
    out[`${gap}|${vp.join('x')}|${name.slice(0, 12)}`] = m; await ctx.close(); fs.unlinkSync(f);
  }
  fs.writeFileSync(path.join(__dirname, 'gap-check.json'), JSON.stringify(out, null, 1));
  for (const [k, v] of Object.entries(out)) console.log(k, 'rows', v.rows, 'sheet', v.sheet, 'tagFoot', v.tag && v.tag[3], 'btn', v.tb, 'btnTop-tagFoot', v.clear);
  await b.close();
})();
