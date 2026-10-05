// Renders the CURRENT map popup (index.html, unmodified) in the gesture harness's
// stubbed page (design/gesture-harness/lib.js: stub Supabase, vendored Leaflet/Archivo,
// blank tiles), with REAL rows' text (queried read-only from Supabase 2026-10-05)
// patched into fixture rows. Writes PNGs to ./current and measurements to ./current/metrics.json.
//   node design/popup-hierarchy/render.js
const path = require('path'), fs = require('fs');
const { launch, openProto, W } = require('../gesture-harness/lib');
const OUT = path.join(__dirname, 'current');

const VEGA = { name: 'VEGA Copenhagen', category: 'bar',
  address: 'Vega, Rejsbygade, Humleby, Den Gule By, Vesterbro, Copenhagen, Copenhagen Municipality, Capital Region of Denmark, 1674, Denmark',
  notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar).",
  starred: true, visited: true };
const AURORA = { name: 'Aurora Reykjavík', category: 'attraction',
  address: 'Aurora Reykjavik Northern Lights Center, 53, Fiskislóð, Örfirisey, Vesturbær, Reykjavik, Capital Region, 101, Iceland',
  notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.',
  starred: false, visited: false };
const LONGNAME = { name: 'Swedish Museum of Performing Arts Scenkonstmuseet', category: 'attraction',
  address: '2, Sibyllegatan, Östermalm, Norra innerstadens stadsdelsområde, Stockholm, Stockholm Municipality, Stockholm County, 102 41, Sweden',
  notes: 'Instrument history, hands-on, kid-friendly.', starred: true, visited: false };
const BARE = { name: 'Perlan', category: 'attraction', address: null, notes: null, starred: false, visited: false };
const SHORTADDR = { name: 'Brain dead fabrications', category: 'shopping', address: '3819 W Sunset Blvd', notes: null, starred: false, visited: false };
const APPROX = { name: 'Værnedamsvej (approx.)', category: 'district', address: null,
  notes: "Copenhagen's most charming market street; Granola (retro coffee lounge/backyard café), Le Gourmand (French deli/cheese & charcuterie), Helges Ost (cheesemonger), Falernum (natural wine bar with tapas), Café Viggo (French bistro), Dora (design/vintage homewares)\n\nApproximate placement -- OSM has no boundary/way for this district; resolved via point search.",
  starred: false, visited: false };

const CASES = [
  // key, fixture id, data, plan view?
  ['busiest', 'rey05', VEGA, true],     // rey05 is Stop 2 of 3 in the stub plan
  ['typical', 'rey07', AURORA, false],
  ['longname', 'rey09', LONGNAME, false],
  ['shortaddr', 'rey11', SHORTADDR, false],
  ['bare', 'rey13', BARE, false],
  ['approx', 'rey15', APPROX, false],
  ['shape', 'shape', { label: 'Grandi (Old Harbour creative district)' }, false],
];

const MEASURE = () => {
  const pop = document.querySelector('.leaflet-popup'); if (!pop) return null;
  const w = pop.querySelector('.leaflet-popup-content-wrapper').getBoundingClientRect();
  const R = (sel) => { const e = pop.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    return { x: +(r.x - w.x).toFixed(1), y: +(r.y - w.y).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), fs: cs.fontSize, fw: cs.fontWeight, color: cs.color }; };
  // rendered ink boxes via Range (glyphs, not the 44px tap boxes)
  const ink = (sel) => { const e = pop.querySelector(sel); if (!e) return null; const rg = document.createRange(); rg.selectNodeContents(e); const r = rg.getBoundingClientRect();
    return { top: +(r.top - w.y).toFixed(1), bottom: +(r.bottom - w.y).toFixed(1), left: +(r.left - w.x).toFixed(1), right: +(r.right - w.x).toFixed(1) }; };
  const mapR = document.getElementById('map').getBoundingClientRect();
  const mc = document.getElementById('mainContent').getBoundingClientRect();
  return { wrapper: { x: w.x, y: w.y, w: w.width, h: w.height }, viewport: { w: innerWidth, h: innerHeight }, map: { top: mapR.top, h: mapR.height },
    sheetTop: mc.top,
    star: R('.popup-star'), title: R('.popup-title'), addr: R('.popup-addr'), notes: R('.popup-notes'), dir: R('.popup-directions'), cat: R('.popup-cat'), visited: R('.popup-visited'), close: R('.leaflet-popup-close-button'),
    ink: { star: ink('.popup-star'), title: ink('.popup-title'), addr: ink('.popup-addr'), notes: ink('.popup-notes'), dir: ink('.popup-directions'), cat: ink('.popup-cat'), visited: ink('.popup-visited') },
    titleLines: Math.round(pop.querySelector('.popup-title').getBoundingClientRect().height / 20),
    addrLines: pop.querySelector('.popup-addr') ? Math.round(pop.querySelector('.popup-addr').getBoundingClientRect().height / 16) : 0,
    notesLines: pop.querySelector('.popup-notes') ? Math.round(pop.querySelector('.popup-notes').getBoundingClientRect().height / 16) : 0 };
};

(async () => {
  const b = await launch(); const metrics = {};
  for (const dsf of [1, 3]) {
    for (const [key, id, data, plan] of CASES) {
      const { ctx, page, errors } = await openProto(b, { dsf, reduced: true, storage: plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {} });
      if (plan) { await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(600); }
      if (id === 'shape') {
        await page.evaluate(async (d) => { const s = window.__SHAPES.find(x => x.city === 'reykjavik' && x.type === 'district'); Object.assign(s, d); await refetchNeighborhoodShapes(); }, data);
        await W(300);
        await page.evaluate(() => { const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district'); const g = s.geometry;
          map.setView([g.reduce((a, p) => a + p[0], 0) / g.length, g.reduce((a, p) => a + p[1], 0) / g.length], 16, { animate: false }); });
        await W(600);
        await page.evaluate(() => { const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district'); neighborhoodLayersById.get(s.id).openPopup(); });
      } else {
        await page.evaluate(async ([id, d]) => { const r = window.__ROWS.find(x => x.id === id); Object.assign(r, d); await refetchLocations(); }, [id, data]);
        await W(300);
        await page.evaluate((id) => { const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], 16, { animate: false }); }, id);
        await W(600);
        await page.evaluate((id) => markersById.get(id).marker.openPopup(), id);
      }
      await W(900);
      const m = await page.evaluate(MEASURE);
      if (!m) { console.log('NO POPUP', key, errors); await ctx.close(); continue; }
      if (dsf === 1) metrics[key] = m;
      const pad = 10, wr = m.wrapper, x0 = Math.max(0, wr.x - pad), y0 = Math.max(0, wr.y - pad);
      await page.screenshot({ path: path.join(OUT, `popup-${key}@${dsf}x.png`), clip: { x: x0, y: y0, width: Math.min(390 - x0, wr.w + 2 * pad), height: wr.h + 2 * pad + 14 } });
      await page.screenshot({ path: path.join(OUT, `phone-${key}@${dsf}x.png`) });
      console.log(dsf, key, JSON.stringify({ x: wr.x, w: wr.w, h: wr.h, y: wr.y, t: m.titleLines, a: m.addrLines, n: m.notesLines, sheetTop: m.sheetTop }), errors.length ? errors : '');
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'metrics.json'), JSON.stringify(metrics, null, 1));
  await b.close();
})();
