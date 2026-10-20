// Phase 4 (the map's city badge) test/stills support, on the gesture harness's page (stub.js
// fixture, vendored Leaflet + Archivo, flat tiles, no network).
//   open(browser, opts): every fixture city SHOWN (the harness hides all but one by default), the
//     fixture plan available ('gh.plans'), and the five cities trimmed to different tallies so the
//     badges' counts read apart (stub rows trimmed too, so a refetch keeps them).
//   view(page, center, zoom): an instant setView, then the moveend sync settles.
//   mapState(page, city): what the map layer holds for that city right now.
const lib = require('../../gesture-harness/lib.js');
const W = ms => new Promise(r => setTimeout(r, ms));
const KEEP = { la: 9, reykjavik: 21, copenhagen: 21, malmo: 12, stockholm: 17 };   // pins kept per city (+ its 2 shapes)

async function open(browser, opts = {}) {
  const o = await lib.openProto(browser, { ...opts, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1', ...(opts.storage || {}) } });
  await o.page.evaluate(keep => {
    const n = {};
    const ok = r => { n[r.city] = (n[r.city] || 0) + 1; return n[r.city] <= (keep[r.city] ?? 99); };
    window.__ROWS.splice(0, window.__ROWS.length, ...window.__ROWS.filter(ok));
    const ids = new Set(window.__ROWS.map(r => r.id));
    locations = locations.filter(l => ids.has(l.id));
    hiddenCities.clear(); persistHiddenCities();
    updateUI();
  }, KEEP);
  await W(300);
  return o;
}
async function view(page, center, zoom) {
  await page.evaluate(([c, z]) => map.setView(c, z, { animate: false }), [center, zoom]);
  await W(350);
}
function mapState(page, city) {
  return page.evaluate(city => {
    const pins = [...markersById.values()].filter(e => e.loc.city === city).length;
    const clusters = [...clusterMarkersById.keys()].filter(id => id.replace(/^p?cluster:\*?/, '').split(',').some(x => (locations.find(l => l.id === x) || {}).city === city)).length;
    const shapes = [...neighborhoodLayersById.keys()].filter(id => (neighborhoodShapes.find(n => n.id === id) || {}).city === city).length;
    const b = document.querySelector(`[data-city-badge="${city}"]`);
    return { zoom: map.getZoom(), pins, clusters, shapes, badge: b ? b.textContent : null };
  }, city);
}
module.exports = { lib, open, view, mapState, W, KEEP };
