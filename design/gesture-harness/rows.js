// ROWS SUITE -- "rows 56.00px" (docs/shipped.md: Pencil Star "Rows 56.00px throughout",
// swipe-visit, list ordering geometry). Every list row (pin and shape cards) must be
// exactly 56.00px tall:
//   at rest: plain, starred, visited, starred+visited, highlighted and shape rows,
//            all 5 cities, at 1x and 3x;
//   in motion: on EVERY rAF frame of star / unstar / visit / un-visit strokes (and the
//            settle/FLIP after them), for every row in the list, both motion modes.
// Prints the set of heights seen; gate: only 56.
// FILE=<index.html> OUT=<json> node rows.js
const { launch, openProto, drag, line, rowRect, W, recorder } = require('./lib');
const { rec, finish } = recorder('rows');
(async () => {
  const b = await launch(); const all = new Set();
  for (const dsf of [1, 3]) for (const city of ['reykjavik', 'copenhagen', 'malmo', 'stockholm', 'la']) {
    const { ctx, page } = await openProto(b, { dsf, city });
    const h = await page.evaluate(() => { setHighlighted(__rowIds()[3]); return [...document.querySelectorAll('#locationsList .location-card')].map(c => ({ h: c.getBoundingClientRect().height, kind: c.dataset.shapeId ? 'shape' : (c.classList.contains('highlighted') ? 'highlighted ' : '') + (c.classList.contains('is-starred') ? 'starred ' : '') + (c.classList.contains('is-visited') ? 'visited' : 'plain') })); });
    h.forEach(x => all.add(x.h)); const kinds = [...new Set(h.map(x => x.kind.trim()))];
    rec(`${dsf}x`, `${city} at rest: ${h.length} rows (${kinds.join(', ')}) -> heights ${[...new Set(h.map(x => x.h))].join(',')}`, h.every(x => x.h === 56) && h.some(x => x.kind === 'shape'), h.filter(x => x.h !== 56));
    await ctx.close();
  }
  for (const reduced of [false, true]) {
    const { ctx, page, cdp } = await openProto(b, { reduced });
    await page.evaluate(() => { window.__hs = new Set(); let run = true; const tick = () => { if (!run) return; document.querySelectorAll('#locationsList .location-card').forEach(c => __hs.add(c.getBoundingClientRect().height)); requestAnimationFrame(tick); }; requestAnimationFrame(tick); window.__hstop = () => { run = false; return [...__hs]; }; });
    const strokes = [['star', 0, 1], ['unstar', 1, 1], ['visit', 3, -1], ['un-visit', 2, -1], ['star (cancel)', 4, 1], ['visit (cancel)', 4, -1]];
    for (const [lbl, i, dir] of strokes) { const q = await rowRect(page, i); const y = q.y + q.h / 2; const x0 = dir > 0 ? 170 : 340; const d = lbl.includes('cancel') ? 50 : 110;
      await drag(page, cdp, line(x0, y, x0 + dir * d, y, lbl.includes('cancel') ? 8 : 12), { stepMs: lbl.includes('cancel') ? 33 : 16 }); await W(1100); }
    const hs = await page.evaluate(() => __hstop()); hs.forEach(x => all.add(x));
    rec(reduced ? 'reduced' : 'full', `every frame of star/unstar/visit/un-visit strokes (+ cancels), every row: heights ${hs.join(',')}`, hs.length === 1 && hs[0] === 56, hs);
    await ctx.close();
  }
  console.log(`rows ${[...all].map(h => h.toFixed(2)).join(',')}px`);
  const ok = finish({ heights: [...all] }); await b.close(); process.exitCode = ok ? 0 : 1;
})();
