// Pass A (jam turn 33) probe, on today's main with the REAL 202 pin positions (from Supabase, real-pins.txt; names dropped).
// 1) every marker box per city x viewport x list up/collapsed -> footprint tests for V2 (blank pin) and V3 (pocket)  2) credit boxes
// 3) V2 squint frames (screenshots for squint.py)  4) result-row heights at the tag's content width.  Run: node probe.js
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const REAL = '/home/user/triplet/index.html', TMP = path.join(__dirname, '_main.html'), OUT = path.join(__dirname, 'frames');
fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(TMP, fs.readFileSync(REAL, 'utf8'));
const CAT = { re: 'restaurant', sh: 'shopping', ca: 'cafe', ar: 'area', at: 'attraction', ba: 'bar', na: 'nature', di: 'district' };
const CITY = { co: 'copenhagen', la: 'la', ma: 'malmo', re: 'reykjavik', st: 'stockholm' };
const rows = fs.readFileSync(path.join(__dirname, 'real-pins.txt'), 'utf8').trim().split(';').map((s, i) => { const [c, la, ln, k] = s.trim().split(' ');
  return { id: 'r' + i, name: 'Place ' + String(i).padStart(3, '0'), address: '1 Street', category: CAT[k.replace('*', '')], lat: +la, lng: +ln, notes: null, visited: false, starred: k.endsWith('*'), city: CITY[c], created_at: '2026-09-01T00:00:00Z' }; });
const JS = `;window.__ROWS = ${JSON.stringify(rows)}; window.__SHAPES = [];`;
const VPS = [[390, 844], [390, 664], [375, 667], [320, 568]];
const BX = `var bx = e => { if (!e) return null; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return null; const r = e.getBoundingClientRect(); return r.width ? [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)) : null; };`;
(async () => {
  const b = await L.launch(); const out = { scenes: {}, rowsH: null };
  for (const vp of VPS) for (const pre of ['', 'noprefix']) {
    const { ctx, page } = await L.open(b, { html: TMP, vp, js: JS, dsf: 1 });
    if (pre) await page.evaluate(() => map.attributionControl.setPrefix(false));
    for (const city of Object.values(CITY)) for (const col of [false, true]) {
      if (pre && col) continue;
      await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(900);
      const collapsed = await page.evaluate(() => document.getElementById('locations').classList.contains('collapsed'));
      if (collapsed !== col) { await page.click('#collapseBtn'); await page.waitForTimeout(700); }
      const s = await page.evaluate(BX + `(() => ({ sheet: bx(document.getElementById('locations')), credit: bx(document.querySelector('.leaflet-control-attribution')),
        zoom: bx(document.querySelector('.leaflet-control-zoom')), acct: bx(document.getElementById('accountBtn')),
        markers: [...document.querySelectorAll('.leaflet-marker-icon')].map(bx).filter(Boolean) }))()`);
      out.scenes[`${vp.join('x')}|${city}|${col ? 'collapsed' : 'up'}${pre ? '|' + pre : ''}`] = s;
    }
    await ctx.close();
  }
  // V2 squint frames: Reykjavik 390x844 at 1x, candidate discs bottom-left (one per frame, nothing else changed)
  { const { ctx, page } = await L.open(b, { html: TMP, vp: [390, 844], js: JS, dsf: 1 });
    await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(900);
    for (const D of [0, 32, 40, 44, 48, 52, 56, 60]) {
      await page.evaluate(D => { document.getElementById('v2') && document.getElementById('v2').remove(); if (!D) return;
        const top = document.getElementById('locations').getBoundingClientRect().top, g = D * 23 / 32, sw = 3.6 * g / 24, halo = 2;
        const d = document.createElement('div'); d.id = 'v2';
        d.style.cssText = `position:fixed;z-index:1500;left:${19.9 - halo}px;top:${top - 20 - D - halo}px;width:${D + 2 * halo}px;height:${D + 2 * halo}px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.18)) drop-shadow(0 3px 4px rgba(0,0,0,.12))`;
        const c = (D + 2 * halo) / 2, a = g / 2 - sw / 2 - g * 0.12;
        d.innerHTML = `<svg width="${D + 2 * halo}" height="${D + 2 * halo}"><circle cx="${c}" cy="${c}" r="${c}" fill="#F2EBDD"/><circle cx="${c}" cy="${c}" r="${D / 2}" fill="#EE7434"/>
          <path d="M${c - a} ${c}H${c + a}M${c} ${c - a}V${c + a}" stroke="#1F2F4A" stroke-width="${sw}" stroke-linecap="round"/></svg>`;
        document.body.appendChild(d); }, D);
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(OUT, `v2-${D}.png`) });
      if (D) out['v2box' + D] = await page.evaluate(BX + 'bx(document.getElementById("v2"))');
    }
    out.acct844 = await page.evaluate(BX + 'bx(document.getElementById("accountBtn"))'); out.navyNow = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--navy'));
    // result rows at the tag's content width (316 - 2x16 = 284): today's .autocomplete-item, real-shaped Nominatim display names
    out.rowsH = await page.evaluate(() => { const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:0;top:0;width:284px;background:#fff;z-index:9999';
      const names = ['Hallgrímskirkja, Hallgrímstorg 1, Miðborg, Reykjavík, 101, Iceland', 'Harpa, Austurbakki 2, Miðborg, Reykjavík, 101, Iceland', 'Perlan, Varmahlíð 1, Hlíðar, Reykjavík, 105, Iceland', 'Sky Lagoon, Vesturvör 44-48, Kópavogur, 200, Iceland', 'Bæjarins Beztu Pylsur, Tryggvagata 1, Miðborg, Reykjavík, 101, Iceland'];
      host.innerHTML = names.map(n => `<div class="autocomplete-item">${n}</div>`).join(''); document.body.appendChild(host);
      const r = [...host.children].map(e => +e.getBoundingClientRect().height.toFixed(1)); host.remove(); return r; });
    await ctx.close(); }
  fs.writeFileSync(path.join(__dirname, 'probe.json'), JSON.stringify(out)); await b.close(); fs.unlinkSync(TMP);
})();
