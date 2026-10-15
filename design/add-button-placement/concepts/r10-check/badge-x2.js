// The picked Float badge (X2 right panel = stills.js nativeBadge 'rest2': 24 fine lobes, brand orange on --tex-flood,
// 26.4px navy +, on-screen stroke 2.00px), measured vs the account on the REAL 202 pins, 390x844 @1x, Reykjavik opening fit and z14.
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const real = fs.readFileSync('/home/user/triplet/index.html', 'utf8'), TMP = path.join(__dirname, '_x2.html'); fs.writeFileSync(TMP, real);
const PTS = fs.readFileSync(path.join(__dirname, 'fine60.txt'), 'utf8').trim();
const CAT = { re: 'restaurant', sh: 'shopping', ca: 'cafe', ar: 'area', at: 'attraction', ba: 'bar', na: 'nature', di: 'district' };
const CITY = { co: 'copenhagen', la: 'la', ma: 'malmo', re: 'reykjavik', st: 'stockholm' };
const rows = fs.readFileSync(path.join(__dirname, '../pass-a-check/real-pins.txt'), 'utf8').trim().split(';').map((s, i) => { const [c, la, ln, k] = s.trim().split(' ');
  return { id: 'r' + i, name: 'Place ' + i, address: '1 Street', category: CAT[k.replace('*', '')], lat: +la, lng: +ln, notes: null, visited: false, starred: k.endsWith('*'), city: CITY[c], created_at: '2026-09-01T00:00:00Z' }; });
const JS = `;window.__ROWS = ${JSON.stringify(rows)}; window.__SHAPES = [];`;
const OUT = path.join(__dirname, 'frames'); fs.mkdirSync(OUT, { recursive: true });
const draw = (p, st) => p.evaluate(([pts, st]) => { let f = document.getElementById('fb'); if (st === 'none') { if (f) f.remove(); return null; }
  const si = st === 'standin', a = document.getElementById('accountBtn'), am = getComputedStyle(a).webkitMaskImage || getComputedStyle(a).maskImage;
  const m = si ? am : `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'><polygon fill='white' points='${pts}'/></svg>`)}")`;
  if (!f) { f = document.createElement('div'); f.id = 'fb'; document.body.appendChild(f); }
  const sw = st === 'rest2' ? (2 * 24 / 26.4).toFixed(3) : 3;
  f.style.cssText = `position:fixed;z-index:1500;left:15.2px;width:60px;height:60px;display:flex;align-items:center;justify-content:center;${si ? 'background:var(--brand-orange)' : 'background-color:var(--brand-orange);background-image:var(--tex-flood);background-size:160px 160px;background-position:-23px -71px'};-webkit-mask-image:${m};-webkit-mask-size:100% 100%;mask-image:${m};mask-size:100% 100%`;
  f.innerHTML = `<svg width="${si ? 30 : 26.4}" height="${si ? 30 : 26.4}" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" stroke-width="${sw}" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  const S = document.getElementById('locations').getBoundingClientRect().top; f.style.top = (S - 15.2 - 60) + 'px';
  const r = f.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; }, [PTS, st]);
(async () => {
  const b = await L.launch(); const out = {};
  for (const view of ['fit', 'z14']) {
    const { ctx, page } = await L.open(b, { html: TMP, vp: [390, 844], js: JS, dsf: 1 });
    await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(900);
    if (view === 'z14') { await page.evaluate(() => map.setView([64.1460, -21.9380], 14, { animate: false })); await page.waitForTimeout(900); }
    out.acct = await page.evaluate(() => { const r = document.getElementById('accountBtn').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
    for (const st of ['none', 'rest2', 'rest', 'standin']) { const bx = await draw(page, st); await page.waitForTimeout(200); await page.screenshot({ path: path.join(OUT, `x2-${view}-${st}.png`) }); if (bx) out[`${view}|${st}`] = bx; }
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, 'badge-x2.json'), JSON.stringify(out, null, 1)); fs.unlinkSync(TMP); await b.close();
})();
