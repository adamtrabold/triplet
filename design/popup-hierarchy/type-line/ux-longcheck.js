// UX check: long category + long plan line per type-line variant, in the real page.
// Injects each variant's CSS, sets the field values to "restaurant" + "Stop 12 of 14",
// and measures the field line's height, wrap and the tag's height.
//   node design/popup-hierarchy/type-line/ux-longcheck.js
const path = require('path'), fs = require('fs');
const { launch, openProto, W } = require('../../gesture-harness/lib');
const V = require('./variants');
(async () => {
  const b = await launch(); const { page } = await openProto(b, { dsf: 3 });
  await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 14, { animate: false }); markersById.get('rey07').marker.openPopup(); });
  await W(1400);
  const res = {};
  for (const [name, v] of Object.entries(V)) {
    const r = await page.evaluate(([css, name]) => {
      let st = document.getElementById('__v'); if (!st) { st = document.createElement('style'); st.id = '__v'; document.head.appendChild(st); } st.textContent = css;
      const f = document.querySelector('.tag-popup .tag-fields');
      if (!f.querySelector('.__plan')) { const p = document.createElement('span'); p.className = 'tag-f __plan'; p.innerHTML = '<span class="tag-lab">Plan</span><span class="tag-val">Stop 12 of 14</span>'; f.appendChild(p); }
      f.querySelector('.popup-cat').textContent = 'restaurant';
      const fr = f.getBoundingClientRect(), fs = [...f.querySelectorAll('.tag-f')].map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
      const vals = [...f.querySelectorAll('.tag-val')].map(e => ({ text: e.textContent, clipped: e.scrollWidth > e.clientWidth + 1, fs: getComputedStyle(e).fontSize }));
      const tag = document.querySelector('.tag-popup .tag-body').getBoundingClientRect();
      return { fieldsH: Math.round(fr.height), fieldsW: Math.round(fr.width), wrapped: new Set(fs.map(x => x[1])).size > 1, fs, vals, tagH: Math.round(tag.height) };
    }, [v.css, name]);
    await W(100);
    const el = await page.$('.tag-popup .tag-body');
    await el.screenshot({ path: path.join(__dirname, 'stills', `ux-long-${name}@3x.png`) });
    res[name] = r; console.log(name.padEnd(8), JSON.stringify(r));
  }
  fs.writeFileSync(path.join(__dirname, 'ux-longcheck.json'), JSON.stringify(res, null, 1));
  await b.close();
})();
