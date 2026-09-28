const { open, launch } = require('./lib'); const { ROWS } = require('./data'); const { FILE: REPO_FILE, outPath } = require('./lib'); const fs = require('fs');
const EXTRA = [{ id: 'x1', name: 'Brauð & Co', category: 'cafe', city: 'reykjavik', visited: true, starred: false, lat: 64.14595, lng: -21.9302 },
  { id: 'x2', name: 'Hallgrímskirkja', category: 'attraction', city: 'reykjavik', visited: false, starred: false, lat: 64.1417, lng: -21.9266 }];
const PINS = ROWS.filter(r => r.city === 'reykjavik').concat(EXTRA);
const SHAPES = [
  { id: 901, label: 'Skólavörðustígur', type: 'street', city: 'reykjavik', color: null, note: null, min_zoom: null, geometry: [[64.1455, -21.9305], [64.1440, -21.9275], [64.1425, -21.9262]] },
  { id: 902, label: 'Þingholt', type: 'district', city: 'reykjavik', color: null, note: null, min_zoom: 15, geometry: [[64.1470, -21.9400], [64.1470, -21.9230], [64.1380, -21.9230], [64.1380, -21.9400]] },
];
const HAND = '9b1d3f5a-7c9e-4b1d-a3f5-7c9e1b3d5f7a', HAF = '7f9b1d3e-5a7c-4e9b-81d3-f5a7c9e1b3d5', KAFFI = 'e4f6a8b0-c2d4-4f6a-8b0c-2d4e6f8a0b2c';
const SCEN = [
  ['pin clustered at start (z12)', 12, [{ pin: HAND }], 'The Handknitting'],
  ['pin already solo & on screen (z15)', 15, [{ pin: KAFFI }], 'Kaffibarinn', [64.1488, -21.9245]],
  ['pin already exactly in view (tap twice)', 15, [{ pin: KAFFI }, { wait: 1200 }, { pin: KAFFI }], 'Kaffibarinn'],
  ['street shape, start below min zoom (z11)', 11, [{ shape: 901 }], 'Skólavörðustígur'],
  ['district that FITS below its min zoom (fit z<15)', 12, [{ shape: 902 }], 'Þingholt'],
  ['rapid taps: pin, pin, shape (last wins)', 12, [{ pin: HAND }, { wait: 120 }, { pin: HAF }, { wait: 120 }, { shape: 901 }], 'Skólavörðustígur'],
  ['rapid taps: shape, pin (last wins)', 11, [{ shape: 902 }, { wait: 150 }, { pin: HAF }], 'Hafnarhús'],
  ['S1: list tap, then direct tap on a solo map pin', 12, [{ pin: HAND }, { wait: 150 }, { mapPin: 'x2' }], 'Hallgrímskirkja'],
  ['S1: list tap, then tap a cluster badge', 12, [{ pin: HAND }, { wait: 150 }, { zoomOutIfNeeded: true }, { mapCluster: true }], null],
  ['S1: list tap, then wheel over the map', 12, [{ pin: HAND }, { wait: 150 }, { wheel: true }], null],
];
const FILES = { app: REPO_FILE };
const out = {};
(async () => { const b = await launch();
 for (const motion of ['no-preference', 'reduce']) for (const [ver, file] of Object.entries(FILES)) for (const [name, z, steps, expect, c0] of SCEN) {
  const { ctx, page } = await open(b, '', { viewport: { width: 390, height: 844 }, reducedMotion: motion }, { file, rows: ROWS, shapes: [], hi: -1, pressed: -1, city: 'reykjavik' });
  await page.evaluate(({ pins, shapes, z, c0 }) => { document.getElementById('error').style.display = 'none';
    locations = pins; neighborhoodShapes = shapes; filters.city = 'reykjavik'; activeCity = 'reykjavik'; highlightedId = null;
    map.setView(c0 || [64.1462, -21.932], z, { animate: false }); updateUI();
    window.__opens = []; const t0 = performance.now();
    map.on('popupopen', (e) => __opens.push({ t: Math.round(performance.now() - t0), txt: e.popup.getContent().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40) })); }, { pins: PINS, shapes: SHAPES, z, c0 });
  const startClustered = await page.evaluate(() => [...clusterMarkersById.keys()]);
  for (const s of steps) {
    if (s.wait) { await page.waitForTimeout(s.wait); continue; }
    if (s.zoomOutIfNeeded) { // reduced motion: the list tap already landed at z14 where nothing clusters -- the user zooms back out
      if (await page.evaluate(() => clusterMarkersById.size === 0)) { await page.mouse.move(195, 430); await page.mouse.wheel(0, 600); await page.waitForTimeout(900); }
      continue; }
    if (s.mapPin || s.mapCluster || s.wheel) {
      const pt = await page.evaluate((s) => { let el;
        if (s.mapPin) el = markersById.get(s.mapPin) && markersById.get(s.mapPin).marker.getElement();
        if (s.mapCluster) { const c = [...clusterMarkersById.values()][0]; el = c && c.getElement(); }
        if (s.wheel) return [195, 430];
        if (!el) return null; const q = el.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; }, s);
      await page.evaluate((s) => __opens.push({ tap: s.mapPin || (s.mapCluster ? 'cluster' : 'wheel'), t: 0 }), s);
      if (!pt) { await page.evaluate(() => __opens.push({ t: 0, txt: 'NO-TARGET' })); continue; }
      if (s.wheel) { await page.mouse.move(pt[0], pt[1]); await page.mouse.wheel(0, 300); } else await page.mouse.click(pt[0], pt[1]);
      continue; }
    await page.evaluate((s) => { __opens.push({ tap: s.pin || s.shape, t: 0 }); const el = s.pin ? document.querySelector(`#locationsList [data-id="${s.pin}"]`) : document.querySelector(`#locationsList [data-shape-id="${s.shape}"]`); el.click(); }, s);
  }
  await page.waitForTimeout(1600);
  const r = await page.evaluate(() => { const p = document.querySelector('.leaflet-popup-content'); return { pendingNull: typeof pendingPopupOpen === 'undefined' ? 'n/a' : pendingPopupOpen === null, openNow: p ? p.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) : null, zoom: map.getZoom(), opens: __opens, popupsInDom: document.querySelectorAll('.leaflet-popup').length }; });
  // pass = the last-tapped item's popup is the one open, exactly one popup exists, and NO other item's popup opened after the last tap
  const lastTap = r.opens.map(o => !!o.tap).lastIndexOf(true);
  const afterLast = r.opens.slice(lastTap + 1).filter(o => !o.tap);
  r.pass = expect === null
    ? r.pendingNull === true && afterLast.length === 0 && !r.opens.some(o => o.txt === 'NO-TARGET')
    : !!(r.openNow && r.openNow.includes(expect)) && r.popupsInDom === 1 && afterLast.length >= 1 && afterLast.every(o => o.txt.includes(expect)) && r.pendingNull !== false;
  r.opens = r.opens.map(o => o.tap ? 'TAP' : o.t + ':' + o.txt.slice(0, 18));
  out[`${motion} | ${ver} | ${name}`] = { ...r, startClusters: startClustered.length };
  await ctx.close(); }
 await b.close(); fs.writeFileSync(outPath('popup-open.json'), JSON.stringify(out, null, 1));
 for (const [k, v] of Object.entries(out)) console.log(v.pass ? 'PASS' : 'FAIL', k, '| open:', v.openNow, '| z', v.zoom, '| opens', JSON.stringify(v.opens));
 const np = Object.values(out).filter(v => v.pass).length; console.log(np + '/' + Object.keys(out).length + (np === 20 ? ' ALL PASS' : ' FAIL')); process.exitCode = np === 20 && Object.keys(out).length === 20 ? 0 : 1; })();
