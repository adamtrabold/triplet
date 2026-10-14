// Pass A (jam turn 33): geometry of today's main, for V2/V3/docked-tag numbers. Reads the real index.html only.
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const REAL = '/home/user/triplet/index.html', TMP = path.join(__dirname, '_main.html');
fs.writeFileSync(TMP, fs.readFileSync(REAL, 'utf8'));
const VPS = [[390, 844], [390, 664], [375, 667], [320, 568]];
(async () => {
  const b = await L.launch(); const out = {};
  for (const vp of VPS) {
    const { ctx, page } = await L.open(b, { html: TMP, vp });
    const g = await page.evaluate(() => {
      const bx = e => { if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)) : null; };
      return { acct: bx(document.getElementById('accountBtn')), plus: bx(document.getElementById('floatingAddBtn')), zoom: bx(document.querySelector('.leaflet-control-zoom')),
        credit: bx(document.querySelector('.leaflet-control-attribution')), sheet: bx(document.getElementById('locations')), header: bx(document.getElementById('locationsHeader')),
        markers: [...document.querySelectorAll('.leaflet-marker-icon')].map(bx).filter(Boolean) };
    });
    // open a tag from the first row
    await page.click('#locationsList .location-card[data-id] ', { position: { x: 120, y: 20 } }); await page.waitForTimeout(1600);
    g.tag = await page.evaluate(() => {
      const bx = e => { if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)) : null; };
      const q = s => document.querySelector('.tag-popup ' + s);
      const sel = [...document.querySelectorAll('.leaflet-marker-icon')].map(m => ({ m, r: m.getBoundingClientRect() })).sort((a, b) => b.r.width - a.r.width)[0];
      return { body: bx(q('.tag-body')), in: bx(q('.tag-in')), name: bx(q('.tag-name')), addr: bx(q('.tag-addr')), fields: bx(q('.tag-fields')), notes: bx(q('.tag-notes')),
        stub: bx(q('.tag-stub')), band: bx(q('.tag-band')), string: bx(q('.tag-string')), patch: bx(q('.tag-patch')), pin: sel && bx(sel.m), pinHtml: sel && sel.m.outerHTML.slice(0, 1500),
        sheetTop: +document.getElementById('locations').getBoundingClientRect().top.toFixed(1) };
    });
    out[vp.join('x')] = g; await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, 'geo.json'), JSON.stringify(out, null, 1)); await b.close(); fs.unlinkSync(TMP);
})();
