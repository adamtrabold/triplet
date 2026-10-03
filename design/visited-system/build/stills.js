// Visited sticker, BUILT: stills of the real index.html (headless Chromium, the gesture harness's
// stub + vendored Leaflet/Archivo; the sandbox has no tiles, so map stills paint a STAND-IN basemap
// into the tile pane (the stamp-first mockup's SVG city: blocks, white roads, a park, water, POI dots),
// under the app's own tile re-tone filter). Compare with the approved stills one folder up
// (../stamp-first/: sticker/M1-crop-3x.png, sticker-contact-1x.png, sticker-keyframes-3x.png).
//   FILE=<index.html> node stills.js      -> ./stills/*.png
// Every pin/row here is drawn by the page's own markerIcon() / planNumberIcon() / renderCard().
const L = require('../../gesture-harness/lib');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'stills'); fs.mkdirSync(OUT, { recursive: true });
const W = L.W;
const shot = async (page, name, clip) => { await page.screenshot({ path: path.join(OUT, name), clip }); };
const { BASEMAP, paintBase } = require('./basemap');   // the stand-in basemap (shared with anim.js)
const boxOf = (page, sel) => page.evaluate(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) }; }, sel);

// A specimen sheet of real markers: rows = NEAR / FAR / NEAR on white road / FAR on white road / selected,
// columns = category x {to do, visited}; then starred and approx, and plan stops (to do / visited, a
// pin stop, a district diamond stop, two digits, selected). Built in-page from the real functions.
const SPECIMEN = () => {
  const host = document.createElement('div'); host.id = '__spec';
  host.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#F2EFE9;padding:10px;font:600 10px/12px -apple-system,Segoe UI,Roboto,sans-serif;color:#555;width:max-content';
  const cats = ['restaurant', 'attraction', 'nature', 'hotel', 'cafe', 'shopping'];
  const glyphZoom = on => { const z = map.getZoom; map.getZoom = () => on ? 16 : 11; return () => { map.getZoom = z; }; };
  const pin = (loc, near, hi = false) => { const undo = glyphZoom(near); const h = markerIcon(loc, hi).options.html; undo(); return h; };
  const cell = (inner, bg) => `<div style="width:40px;height:38px;display:flex;align-items:center;justify-content:center;${bg ? 'background:' + bg : ''}">${inner}</div>`;
  let h = `<div style="display:grid;grid-template-columns:120px repeat(${(cats.length + 2) * 2},40px);gap:4px 2px;align-items:center"><div></div>` +
    [...cats, 'approx.', 'starred'].map(c => `<div style="grid-column:span 2;text-align:center">${c}</div>`).join('') + '<div></div>' +
    [...cats, 'a', 's'].map(() => '<div style="text-align:center">to do</div><div style="text-align:center">visited</div>').join('');
  const set = [...cats.map(c => ({ category: c, name: 'x' })), { category: 'district', name: 'X (approx.)' }, { category: 'nature', name: 'x', starred: true }];
  for (const [lbl, near, bg, hi] of [['NEAR (z>=12)', true, '', false], ['FAR (z<12)', false, '', false], ['NEAR on white road', true, '#FFFFFF', false], ['FAR on white road', false, '#FFFFFF', false], ['selected NEAR', true, '', true], ['selected FAR', false, '', true]])
    h += `<div>${lbl}</div>` + set.map(l => [false, true].map(v => cell(pin({ id: 'spec-' + l.category, lat: 0, lng: 0, ...l, visited: v }, near, hi), bg)).join('')).join('');
  h += '</div>';
  const stop = (n, kind, cat, v, hi, starred) => planNumberIcon(cat, kind, kind === 'diamond' ? '#328177' : categoryInk(cat), { n, m: 12 }, MARKER_SIZE_NEAR + (hi ? MARKER_HI_DELTA : 0), hi, starred, v).options.html;
  h += `<div style="margin-top:10px">Plans stop pins: to do | visited (pin 3, approx 5, district 7, starred 9, two digits 12, selected 4)</div><div style="display:flex;gap:6px;align-items:center;margin-top:4px">` +
    [[3, 'circle', 'restaurant', false, false], [5, 'dashed', 'attraction', false, false], [7, 'diamond', 'district', false, false], [9, 'circle', 'cafe', false, true], [12, 'circle', 'bar', false, false], [4, 'circle', 'restaurant', true, false]]
      .map(([n, k, c, hi, st]) => cell(stop(n, k, c, false, hi, st)) + cell(stop(n, k, c, true, hi, st)) + '<span style="width:10px"></span>').join('') + '</div>';
  host.innerHTML = h; document.body.appendChild(host);
};

(async () => {
  const b = await L.launch();
  for (const dsf of [1, 3]) {
    // --- rows: pins + shapes, visited / starred / both, focus row ---
    { const { ctx, page } = await L.openProto(b, { dsf });
      await page.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = 0; });
      await W(200);
      const r = await page.evaluate(() => { const rows = [...document.querySelectorAll('#locationsList .location-card[data-id]')].slice(0, 3); const a = rows[0].getBoundingClientRect(), z = rows[2].getBoundingClientRect(); return { x: 0, y: Math.floor(a.y), width: 390, height: Math.ceil(z.bottom - a.y) }; });
      await shot(page, `rows-pins-${dsf}x.png`, r);
      // shapes: the street (starred + visited) and the district visited (both rows)
      await page.evaluate(async () => { const d = neighborhoodShapes.find(n => n.type === 'district' && n.city === 'reykjavik'); await toggleLocationFlag(shapeKey(d.id), 'visited'); });
      await W(600);
      const sr = await page.evaluate(() => { const rows = [...document.querySelectorAll('#locationsList .location-card[data-shape-id]')]; rows[0].scrollIntoView({ block: 'center' }); return null; }); await W(300);
      const sb = await page.evaluate(() => { const rows = [...document.querySelectorAll('#locationsList .location-card[data-shape-id]')]; const a = rows[0].getBoundingClientRect(), z = rows[rows.length - 1].getBoundingClientRect(); return { x: 0, y: Math.floor(a.y), width: 390, height: Math.ceil(z.bottom - a.y) }; });
      await shot(page, `rows-shapes-${dsf}x.png`, sb);
      // focus (highlighted) visited row
      await page.evaluate(() => { document.querySelectorAll('#locationsList .location-card[data-id]')[2].classList.add('highlighted'); }); await W(300);
      await page.locator('.location-card.highlighted').screenshot({ path: path.join(OUT, `row-focus-${dsf}x.png`) });
      await ctx.close(); }
    // --- marker specimen ---
    { const { ctx, page } = await L.openProto(b, { dsf, w: 900, h: 700 });
      await page.evaluate(SPECIMEN); await W(300);
      await shot(page, `pins-specimen-${dsf}x.png`, await boxOf(page, '#__spec'));
      // the same cells over the stand-in map (re-toned as the app tones tiles): visited vs to-do side by side
      await page.evaluate(([html]) => { const h = document.getElementById('__spec'); h.style.background = 'transparent'; h.querySelectorAll('div[style*="background:#FFFFFF"]').forEach(c => c.style.background = 'transparent');
        const bg = document.createElement('div'); bg.style.cssText = 'position:absolute;inset:0;z-index:-1;overflow:hidden;filter:' + getComputedStyle(document.querySelector('.leaflet-tile-pane')).filter; bg.innerHTML = html;
        h.style.isolation = 'isolate'; h.prepend(bg); }, [BASEMAP(900, 700, false)]); await W(200);
      await shot(page, `pins-specimen-on-map-${dsf}x.png`, await boxOf(page, '#__spec'));
      await ctx.close(); }
    // --- the real map: NEAR (z15), FAR (z11, clusters with visited members), a visited shape ---
    { const { ctx, page } = await L.openProto(b, { dsf });
      await page.evaluate(() => { document.getElementById('locations').classList.add('collapsed'); }); await W(200);
      // 75% visited (every place but each 4th), in the page only: is a visited pin obviously not a to-do pin?
      await page.evaluate(() => { locations = locations.map((l, i) => ({ ...l, visited: i % 4 !== 0 })); updateUI(); }); await W(300);
      for (const [name, z] of [['map-near-z14-75pct', 14], ['map-z12-near-75pct', 12], ['map-z11-far-75pct', 11], ['map-z13-clusters', 13], ['map-z10-clusters', 10]]) {
        await page.evaluate(z => { map.setView([64.1466, -21.9426], z, { animate: false }); }, z); await W(700);
        await paintBase(page, z < 14); await W(150);
        await shot(page, `${name}-${dsf}x.png`, { x: 0, y: 0, width: 390, height: 520 });
      }
      // visited shapes: visit the district too, frame both at z16
      await page.evaluate(async () => { const d = neighborhoodShapes.find(n => n.type === 'district' && n.city === 'reykjavik'); await toggleLocationFlag(shapeKey(d.id), 'visited'); }); await W(500);
      for (const t of ['district', 'street']) {
        await page.evaluate(t => { const nb = neighborhoodShapes.find(n => n.type === t && n.city === 'reykjavik'); map.setView(shapeAnchor(nb), 16, { animate: false }); }, t); await W(700);
        await paintBase(page, false); await W(150);
        await shot(page, `map-shape-${t}-visited-${dsf}x.png`, { x: 95, y: 160, width: 200, height: 200 });
      }
      await ctx.close(); }
    // --- Plans: a visited stop on the map + the stop rows ---
    { const { ctx, page } = await L.openProto(b, { dsf, storage: { 'gh.plans': '1' } });
      const ok = await page.evaluate(async () => { if (typeof setListView !== 'function') return false; setListView('plans'); await new Promise(r => setTimeout(r, 400)); return true; }).catch(() => false);
      if (ok) {
        await W(600);
        const lb = await page.evaluate(() => { const rows = [...document.querySelectorAll('#locationsList .location-card.plan-num-row')]; if (!rows.length) return null; const a = rows[0].getBoundingClientRect(), z = rows[rows.length - 1].getBoundingClientRect(); return { x: 0, y: Math.floor(a.y), width: 390, height: Math.ceil(z.bottom - a.y) }; });
        if (lb) await shot(page, `plans-rows-${dsf}x.png`, lb);
        await page.evaluate(() => { document.getElementById('locations').classList.add('collapsed'); const r = planMarks().rows; const ll = r.map(x => x.loc ? [x.loc.lat, x.loc.lng] : shapeCentroid(x.nb)); map.fitBounds(ll, { padding: [60, 60], maxZoom: 15 }); }); await W(900);
        await paintBase(page, false); await W(150);
        await shot(page, `plans-map-${dsf}x.png`, { x: 0, y: 0, width: 390, height: 520 });
      }
      await ctx.close(); }
  }
  // --- visit swipe keyframes at 3x: 1 lifted (40px hover), 2 pressed centre with the flap still up, 3 the flap settling, 4 rest ---
  { const { ctx, page, cdp } = await L.openProto(b, { dsf: 3 });
    const g = await (async () => { await L.rowRect(page, 0); await W(120); return page.evaluate(() => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[0]; const r = el.getBoundingClientRect(), x = el.querySelector('.delete-btn').getBoundingClientRect(); return { y: r.y + r.height / 2, xc: x.x + x.width / 2, top: Math.floor(r.y), h: Math.ceil(r.height) }; }); })();
    const clip = { x: 0, y: g.top - 2, width: 390, height: g.h + 4 };
    const frames = [];
    // 50px finger = 40px content (hover), then 66 = 56 (press), then hold
    await L.drag(page, (cdp), L.line(g.xc, g.y, g.xc - 50, g.y, 6), { hold: 0, end: 'touchCancel', onStep: async i => { if (i === 6) { await W(60); frames.push(await page.screenshot({ clip })); } } }).catch(() => {});
    await W(800);
    // the press, on a stepped clock (sgNow, the page's one timeline clock): 35% in (face nearly flat, flap still up),
    // 65% in (face flat, flap relaxing), then the real clock again for the rest
    await page.evaluate(() => { window.__real = () => performance.now(); window.__clk = null; sgNow = () => (window.__clk != null ? window.__clk : __real()); });
    await L.drag(page, cdp, L.line(g.xc, g.y, g.xc - 66, g.y, 8), { hold: 700, onStep: async i => { if (i === 8) {
      const base = await page.evaluate(() => (window.__clk = __real()));
      for (const u of [0.35, 0.65]) { await page.evaluate(t => { window.__clk = t; }, base + u * 200); await W(80); frames.push(await page.screenshot({ clip })); }
      await page.evaluate(() => { window.__clk = null; }); } } });
    await W(900); frames.push(await page.screenshot({ clip }));
    frames.forEach((f, i) => fs.writeFileSync(path.join(OUT, `keyframe-${i + 1}-3x.png`), f));
    await ctx.close(); }
  await b.close();
  console.log('stills ->', OUT);
})();
