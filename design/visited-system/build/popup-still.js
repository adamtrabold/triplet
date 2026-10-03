// A 3x still of a map popup (hairline --hair edge, tip included). node popup-still.js -> stills/popup-hair-3x.png
const L = require('../../gesture-harness/lib'); const path = require('path');
(async () => {
  const b = await L.launch(); const { page } = await L.openProto(b, { dsf: 3, w: 700, h: 420 });
  await page.evaluate(() => document.getElementById('locations').classList.add('collapsed')); await L.W(200);
  const id = await page.evaluate(() => { const l = locations.filter(l => l.city === 'reykjavik')[0]; map.setView([l.lat, l.lng], 16, { animate: false }); return l.id; });
  await L.W(600);
  await page.evaluate(id => { const e = markersById.get(id); e.marker.openPopup(); }, id); await L.W(600);
  const r = await page.evaluate(() => { const p = document.querySelector('.leaflet-popup').getBoundingClientRect(); return { x: Math.max(0, p.x - 12), y: Math.max(0, p.y - 12), width: p.width + 24, height: p.height + 24 }; });
  await page.screenshot({ path: path.join(__dirname, 'stills/popup-hair-3x.png'), clip: r });
  console.log(await page.evaluate(() => getComputedStyle(document.querySelector('.leaflet-popup-content-wrapper')).borderTopColor + ' / ' + getComputedStyle(document.querySelector('.leaflet-popup-tip')).borderTopColor));
  await b.close();
})();
