// Turn 36 (concepts): the LIFTED pin (V2-lifted) on a real render, for squint.py-style mass vs the account badge.
// Real 202 pin positions, Reykjavik, 390x844 @1x. Object: disc D (+2 paper halo, 1.5 deep-orange rim, navy +), a 1.6px navy
// string S long under it to a ground point, and a soft ground ellipse (18%). Foot (ground point) 20 above the list, ink 19.9 from the left.
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const REAL = '/home/user/triplet/index.html', TMP = path.join(__dirname, '_main.html'), OUT = path.join(__dirname, 'frames');
fs.writeFileSync(TMP, fs.readFileSync(REAL, 'utf8'));
const CAT = { re: 'restaurant', sh: 'shopping', ca: 'cafe', ar: 'area', at: 'attraction', ba: 'bar', na: 'nature', di: 'district' };
const CITY = { co: 'copenhagen', la: 'la', ma: 'malmo', re: 'reykjavik', st: 'stockholm' };
const rows = fs.readFileSync(path.join(__dirname, '../pass-a-check/real-pins.txt'), 'utf8').trim().split(';').map((s, i) => { const [c, la, ln, k] = s.trim().split(' ');
  return { id: 'r' + i, name: 'Place ' + i, address: '1 Street', category: CAT[k.replace('*', '')], lat: +la, lng: +ln, notes: null, visited: false, starred: k.endsWith('*'), city: CITY[c], created_at: '2026-09-01T00:00:00Z' }; });
const JS = `;window.__ROWS = ${JSON.stringify(rows)}; window.__SHAPES = [];`;
const VARIANTS = ['FLOAT60', 'none'];
(async () => {
  const b = await L.launch(); const out = {};
  for (const [vp, dsf] of [[[390, 844], 1], [[390, 844], 3], [[320, 568], 1]]) {
    const { ctx, page } = await L.open(b, { html: TMP, vp, js: JS, dsf });
    await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(900);
    for (const v of VARIANTS) {
      await page.evaluate(v => { const old = document.getElementById('lp'); if (old) old.remove(); if (v === 'none') return;
        const S = document.getElementById('locations').getBoundingClientRect().top, foot = S - 20, d = document.createElement('div'); d.id = 'lp';
        if (v.startsWith('FLOAT')) {   // R7's Float: 60px orange badge on the account's scalloped die, navy +, bottom-left (box 15.2, foot 20 above the list)
          const a = document.getElementById('accountBtn'), m = getComputedStyle(a).webkitMaskImage || getComputedStyle(a).maskImage;
          d.style.cssText = `position:fixed;z-index:1500;left:15.2px;top:${foot - 60}px;width:60px;height:60px;display:flex;align-items:center;justify-content:center;background:#EE7434;-webkit-mask-image:${m};-webkit-mask-size:100% 100%;mask-image:${m};mask-size:100% 100%`;
          d.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19" stroke="#1F2F4A" stroke-width="3" stroke-linecap="round"/></svg>';
        } else if (v.startsWith('FAB')) { const D = +v.slice(3);   // stock Material FAB: 56 disc, elevation-6 shadow, white +
          d.style.cssText = `position:fixed;z-index:1500;left:16px;top:${foot - D}px;width:${D}px;height:${D}px;border-radius:50%;background:#EE7434;box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)`;
          d.innerHTML = `<svg width="${D}" height="${D}"><path d="M${D / 2 - 7} ${D / 2}H${D / 2 + 7}M${D / 2} ${D / 2 - 7}V${D / 2 + 7}" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>`;
        } else { const D = +v.slice(1), H = 2, STR = 22, W = D + 2 * H, c = W / 2, g = D * 23 / 32, sw = 3.6 * g / 24, a = g / 2 - sw / 2 - g * 0.12;
          const tot = W + STR + 4;
          d.style.cssText = `position:fixed;z-index:1500;left:${19.9 - H}px;top:${foot - tot + 4}px;width:${W}px;height:${tot}px`;
          d.innerHTML = `<svg width="${W}" height="${tot}" style="overflow:visible">
            <ellipse cx="${c}" cy="${W + STR}" rx="7" ry="2.2" fill="rgba(31,47,74,.18)"/>
            <line x1="${c}" y1="${W - 2}" x2="${c}" y2="${W + STR}" stroke="#1F2F4A" stroke-width="1.6" stroke-linecap="round"/>
            <g style="filter:drop-shadow(0 6px 5px rgba(0,0,0,.12))"><circle cx="${c}" cy="${c}" r="${c}" fill="#F2EBDD"/><circle cx="${c}" cy="${c}" r="${D / 2 - 0.75}" fill="#EE7434" stroke="#A8400C" stroke-width="1.5"/>
            <path d="M${c - a} ${c}H${c + a}M${c} ${c - a}V${c + a}" stroke="#1F2F4A" stroke-width="${sw}" stroke-linecap="round"/></g></svg>`; }
        document.body.appendChild(d); }, v);
      await page.waitForTimeout(150);
      const tag = `${vp.join('x')}@${dsf}`;
      await page.screenshot({ path: path.join(OUT, `float-${tag}-${v}.png`) });
      if (v !== 'none') out[`${tag}|${v}`] = await page.evaluate(() => { const r = document.getElementById('lp').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(x => +x.toFixed(1)); });
    }
    out[`${vp.join('x')}@${dsf}|acct`] = await page.evaluate(() => { const r = document.getElementById('accountBtn').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, 'float.json'), JSON.stringify(out, null, 1)); await b.close(); fs.unlinkSync(TMP);
})();
