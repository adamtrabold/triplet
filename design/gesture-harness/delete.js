// DELETE-TAP SLOP SUITE -- "Delete fires only on a near-still tap (DELETE_TAP_SLOP 4px)"
// (CLAUDE.md gate; docs/shipped.md swipe-visit "Delete safety": "only a near-still tap on
// the X deletes -- DELETE_TAP_SLOP 4px between down and up (read from touchend); a touch
// that moves 4px+ does nothing (no delete, no navigate) ... UX sweep: 0-3px delete;
// 4/5/6/8/12/20/40/90px never do"). The UX sweep, rebuilt:
//   touch, from the X's centre: 0,1,2,3px must delete (confirm() reached) and
//   4,5,6,8,12,20,40,90px must not, each moved LEFT, RIGHT, UP, DOWN and diagonally;
//   none of them may navigate; mouse: 0-3px click deletes, 4/8px drag does not;
//   keyboard Enter deletes. Both motion modes. visit.js D1-D10 cover the X in
//   combination with strokes.
// FILE=<index.html> OUT=<json> node delete.js
const { launch, openProto, T, rowRect, W, recorder } = require('./lib');
const { rec, finish } = recorder('delete');
// diag is a 3-4-5 direction so whole-pixel distances stay whole: Chromium rounds touch points to
// integers, so a 0.7071 diagonal "4px" lands at (3,3)->4.2 or (2,2)->2.8 -- not a 4px move. It is
// skipped at 4px, where (2.4,3.2) rounds to 3.6px.
const DIRS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1], diag: [-0.6, -0.8] };
// OUT-AND-BACK (gated since fix-d7; was a probe): out 4-12px and back to the start before lifting.
// Chromium (like Android Chrome) suppresses touchmoves inside its ~15px touch slop when touchstart
// isn't consumed, but still sends touch pointermoves; the X's travel (max displacement, not end
// displacement) reads those too, so none of these may delete. iOS sends every touchmove; unverified.
const PROBE = [4, 6, 8, 12];
(async () => {
  const b = await launch(); const probes = {};
  for (const reduced of [false, true]) { const mode = reduced ? 'reduced' : 'full';
    const { ctx, page, cdp } = await openProto(b, { reduced });
    const x = async () => { await rowRect(page, 4); await W(60); return page.evaluate(() => { const r = document.querySelectorAll('#locationsList .location-card[data-id]')[4].querySelector('.delete-btn').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); };
    const reset = () => page.evaluate(() => { const id = __rowIds()[4]; setLocationFlag(id, 'visited', false); setLocationFlag(id, 'starred', false); __del.length = 0; __nav.length = 0; map.closePopup(); });
    const res = [];
    const runs = [];
    for (const dist of [0, 1, 2, 3, 4, 5, 6, 8, 12, 20, 40, 90]) for (const [dn, v] of Object.entries(dist ? DIRS : { still: [0, 0] })) if (!(dn === 'diag' && dist === 4)) runs.push([dist, dn, v, false]);
    for (const dist of PROBE) runs.push([dist, 'out-and-back', [-1, 0], true]);
    const probe = [];
    for (const [dist, dn, [ux, uy], back] of runs) {
      await reset(); await W(500); const p = await x();
      await T(cdp, 'touchStart', p.x, p.y); await W(40);
      if (dist) { const steps = Math.max(2, Math.ceil(dist / 6)); for (let k = 1; k <= steps; k++) { await T(cdp, 'touchMove', p.x + ux * dist * k / steps, p.y + uy * dist * k / steps); await W(16); }
        if (back) { for (let k = steps - 1; k >= 0; k--) { await T(cdp, 'touchMove', p.x + ux * dist * k / steps, p.y + uy * dist * k / steps); await W(16); } } }
      await W(30); await T(cdp, 'touchEnd'); await W(dist >= 40 ? 1000 : 300);
      const o = await page.evaluate(() => ({ del: __del.length, nav: __nav.length })); const want = dist < 4;
      if (back) { probe.push({ dist, ...o }); continue; }
      res.push({ dist, dn, ...o, ok: (want ? o.del === 1 : o.del === 0) && o.nav === 0 });
    }
    probes[mode] = probe;
    rec(mode, `touch out-and-back ${PROBE.join('/')}px (back to the start before lifting): never deletes, never navigates -> ${probe.map(p => `${p.dist}px ${p.del ? 'DELETES' : 'no delete'}`).join(', ')}`, probe.every(p => !p.del && !p.nav), probe);
    const bad = res.filter(r => !r.ok);
    for (const d of [0, 1, 2, 3, 4, 5, 6, 8, 12, 20, 40, 90]) { const rs = res.filter(r => r.dist === d); const ok = rs.every(r => r.ok);
      rec(mode, `touch ${d}px (${rs.map(r => r.dn).join('/')}): ${d < 4 ? 'deletes' : 'never deletes'}, never navigates -> deletes ${rs.map(r => r.del).join(',')}`, ok, rs.filter(r => !r.ok)); }
    // mouse
    for (const d of [0, 3, 4, 8]) { await reset(); await W(400); const p = await x(); await page.mouse.move(p.x, p.y); await page.mouse.down(); if (d) await page.mouse.move(p.x - d, p.y, { steps: 2 }); await page.mouse.up(); await W(300);
      const o = await page.evaluate(() => ({ del: __del.length, nav: __nav.length })); rec(mode, `mouse ${d}px: ${d < 4 ? 'deletes' : 'no delete'}`, (d < 4 ? o.del === 1 : o.del === 0) && !o.nav, o); }
    { await reset(); await W(300); await x(); await page.evaluate(() => document.querySelectorAll('#locationsList .location-card[data-id]')[4].querySelector('.delete-btn').focus()); await page.keyboard.press('Enter'); await W(200);
      const o = await page.evaluate(() => ({ del: __del.length, nav: __nav.length })); rec(mode, 'keyboard Enter on the X deletes', o.del === 1 && !o.nav, o); }
    await ctx.close();
  }
  const ok = finish({ probeOutAndBack: probes }); await b.close(); process.exitCode = ok ? 0 : 1;
})();
