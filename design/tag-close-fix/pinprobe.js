// Probe: what tapping a place's pin does while its tag is open (today), and the pin's tap box.
//   node design/tag-close-fix/pinprobe.js [index.html] [pin]
const path = require('path');
const P = require('../add-tag-jam/p2/lib-p2.js');
const S = require('../add-tag-jam/p3/lib-p3.js');
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
  const b = await P.lib.launch();
  const o = await P.openP2(b, { file, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1' } });
  const page = o.page;
  await S.install(page); await S.realRows(page);
  if (process.argv[3] === 'pin') await page.evaluate(() => document.documentElement.classList.add('tag-close-pin'));
  for (const key of ['rey16', 'rey15']) {
    await S.openTag(page, key);
    const box = await page.evaluate(k => { const m = markersById.get(k).marker.getElement(), r = m.getBoundingClientRect(), bf = getComputedStyle(m, '::before'); return { hitInset: bf.content !== 'none' ? bf.top : 'none', cornerX: (() => { const x = document.querySelector('.leaflet-popup .tag-x').getBoundingClientRect(); return x.width + 'x' + x.height; })(), open: openTagKey(), x: r.left, y: r.top, w: r.width, h: r.height, cls: m.className, html: m.innerHTML.slice(0, 160) }; }, key);
    console.log('pin box', JSON.stringify(box));
    await P.tap(page, `.leaflet-marker-icon.__probe`).catch(() => {});
    await page.evaluate(k => markersById.get(k).marker.getElement().classList.add('__probe'), key);
    await P.tap(page, '.__probe');
    await W(700);
    console.log('after pin tap: open =', await page.evaluate(() => openTagKey()), 'selected =', await page.evaluate(() => highlightedId));
    await page.evaluate(k => markersById.get(k).marker.getElement().classList.remove('__probe'), key);
  }
  // a shape: what does its tag hang from?
  const sh = await page.evaluate(() => { const nb = neighborhoodShapes[0]; return nb ? { id: nb.id, type: nb.type } : null; });
  console.log('shape', JSON.stringify(sh));
  if (o.errors.length) console.log('page errors', o.errors);
  await b.close();
})();
