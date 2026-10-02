// SHAPE-ROWS SUITE -- owner, 2026-10-02: "Every category should have the same information
// and capabilities." A district / street row is a pin's row (createCard/renderCard on its
// shapeRowItem(), keyed 'shape:<id>'), so it must pass the pin rows' cases. This runs the
// touch / vtest / delete-slop / rows / popup cases on the Reykjavik fixture's two shapes
// (stub.js: "Fixture District" plain, "Fixture Street" starred + visited), both motion
// modes, real-timing CDP touch:
//   star: right stroke stars the plain district (printed star, server patched), the same
//     stroke unstars the starred street; a 30px release cancels; a flick stars; a flick
//     never unstars (S5); touchcancel reverts
//   visit: left stroke from the X visits (stamp, field, X back); the same stroke un-visits;
//     a slow 40px release cancels
//   tap: navigates (focusShape), touchend -> focusShape < 16ms; a sloppy 6px tap too;
//     a vertical stroke scrolls and never marks
//   rows 56.00px on every rAF frame of star / unstar / visit / un-visit on shape rows
//   delete: the X deletes on 0-3px, never on 4/6/12/40px (left, right, up), nor on a
//     6px out-and-back; mouse 0px deletes, 8px not; keyboard Enter deletes; D7 an X tap
//     right after an un-visit stroke never deletes
//   popup: pin layout (star, title, Get Directions to a point on the shape, type line,
//     Mark Visited); its star and Mark Visited toggle the shape and replay on the row;
//     a starred shape carries the map star, unstarring removes it
//   writes: an RLS refusal rolls the shape back and says who can edit; the poll brings
//     the other phone's change; Starred / What's left order the shape block
// FILE=<index.html> OUT=<json> node shapes.js
const { launch, openProto, T, drag, line, W, recorder } = require('./lib');
const { rec, finish } = recorder('shapes');
(async () => {
  const b = await launch();
  for (const reduced of [false, true]) { const mode = reduced ? 'reduced' : 'full';
    const r = (name, pass, detail) => rec(mode, name, pass, detail);
    const fresh = async () => {
      const o = await openProto(b, { reduced });
      await o.page.evaluate(() => { const fs = focusShape; focusShape = function (id) { __nav.push(['shape:' + id, performance.now()]); return fs.apply(this, arguments); }; });
      o.D = await o.page.evaluate(() => neighborhoodShapes.find(n => n.city === activeCity && n.type === 'district').id);
      o.S = await o.page.evaluate(() => neighborhoodShapes.find(n => n.city === activeCity && n.type === 'street').id);
      return o;
    };
    const geo = (page, sid) => page.evaluate(sid => { const el = document.querySelector(`#locationsList .location-card[data-shape-id="${sid}"]`), l = document.getElementById('locationsList');
      const r0 = el.getBoundingClientRect(), lr = l.getBoundingClientRect(); if (r0.top < lr.top || r0.bottom > lr.bottom - 4) l.scrollTop += r0.top - lr.top - 60;
      const q = el.getBoundingClientRect(), x = el.querySelector('.delete-btn').getBoundingClientRect(); return { y: q.y + q.height / 2, xc: x.x + x.width / 2, yc: x.y + x.height / 2 }; }, sid);
    const st = (page, sid) => page.evaluate(sid => { const nb = neighborhoodShapes.find(n => n.id === sid), srv = __SHAPES.find(n => n.id === sid), el = document.querySelector(`#locationsList .location-card[data-shape-id="${sid}"]`);
      return { starred: !!nb.starred, visited: !!nb.visited, srvStarred: !!srv.starred, srvVisited: !!srv.visited, printed: !!el.querySelector('.row-star'), field: el.classList.contains('is-visited'),
        stamps: el.querySelectorAll('.row-stamp').length, carry: el.querySelectorAll('.vs-carry').length, live: document.querySelectorAll('.sg-star').length, vslive: el.classList.contains('vs-live'),
        xhide: el.classList.contains('vs-xhide'), tf: el.querySelector('h3').style.transform, nav: __nav.length, del: __del.slice(), held: starHeld.size, diamond: !!el.querySelector('.row-badge polygon'),
        meta: el.querySelector('.row-meta').textContent }; }, sid);
    const settle = reduced ? 700 : 1300;

    // --- star (touch.js's cases on a shape row)
    { const { ctx, page, cdp, errors, D } = await fresh(); const g = await geo(page, D);
      await drag(page, cdp, line(170, g.y, 250, g.y, 16)); await W(settle); const s = await st(page, D);
      r('star: right stroke 80px stars the district (printed star, server patched), no nav', s.starred && s.srvStarred && s.printed && !s.nav && !s.live && s.tf === '' && !s.held && s.diamond && !errors.length, { s, errors }); await ctx.close(); }
    { const { ctx, page, cdp, S } = await fresh(); const g = await geo(page, S);
      await drag(page, cdp, line(170, g.y, 250, g.y, 16)); await W(settle); const s = await st(page, S);
      r('unstar: the same stroke on the starred street unstars it', !s.starred && !s.srvStarred && !s.printed && !s.nav && !s.live, s); await ctx.close(); }
    { const { ctx, page, cdp, D } = await fresh(); const g = await geo(page, D);
      await drag(page, cdp, line(170, g.y, 200, g.y, 8), { stepMs: 33 }); await W(800); const s = await st(page, D);
      r('cancel: 30px then release leaves it unstarred', !s.starred && !s.printed && !s.live && s.tf === '' && !s.nav, s); await ctx.close(); }
    { const { ctx, page, cdp, D } = await fresh(); const g = await geo(page, D);
      await drag(page, cdp, line(170, g.y, 216, g.y, 5), { stepMs: 8, synthTs: true }); await W(settle); const s = await st(page, D);
      r('flick 46px in 40ms stars', s.starred && !s.nav, s); await ctx.close(); }
    { const { ctx, page, cdp, S } = await fresh(); const g = await geo(page, S);
      await drag(page, cdp, line(170, g.y, 225, g.y, 5), { stepMs: 8, synthTs: true }); await W(settle); const s = await st(page, S);
      r('S5: a flick never unstars', s.starred && s.printed && !s.live, s); await ctx.close(); }
    { const { ctx, page, cdp, D } = await fresh(); const g = await geo(page, D);
      await drag(page, cdp, line(170, g.y, 250, g.y, 16), { end: 'touchCancel' }); await W(800); const s = await st(page, D);
      r('touchcancel past the detent reverts', !s.starred && !s.live && s.tf === '', s); await ctx.close(); }

    // --- visit (vtest's V1 / un-visit / cancel on a shape row)
    { const { ctx, page, cdp, D } = await fresh(); const g = await geo(page, D);
      await drag(page, cdp, line(g.xc, g.y, g.xc - 110, g.y, 12)); await W(900); const s = await st(page, D);
      r('visit: left stroke from the X visits (stamp in flow, field, X back), no delete / nav', s.visited && s.srvVisited && s.field && s.stamps === 1 && !s.carry && !s.vslive && !s.xhide && !s.del.length && !s.nav && !s.held, s); await ctx.close(); }
    { const { ctx, page, cdp, S } = await fresh(); const g = await geo(page, S);
      await drag(page, cdp, line(g.xc, g.y, g.xc - 110, g.y, 12)); await W(900); const s = await st(page, S);
      r('un-visit: the same stroke on the visited street clears it (no stamp, no field), star kept', !s.visited && !s.srvVisited && !s.field && !s.stamps && s.starred && s.printed && !s.del.length, s); await ctx.close(); }
    { const { ctx, page, cdp, D } = await fresh(); const g = await geo(page, D);
      await drag(page, cdp, line(g.xc - 20, g.y, g.xc - 60, g.y, 8), { stepMs: 33 }); await W(900); const s = await st(page, D);
      r('visit cancel: a slow 40px release leaves it unvisited', !s.visited && !s.stamps && !s.vslive, s); await ctx.close(); }

    // --- tap / scroll
    { const { ctx, page, cdp, D } = await fresh(); const g = await geo(page, D);
      await T(cdp, 'touchStart', 200, g.y); await W(60); await T(cdp, 'touchEnd'); await W(100);
      const d = await page.evaluate(() => ({ nav: __nav, te: __te })); const delay = d.nav.length ? d.nav[0][1] - d.te[d.te.length - 1] : null;
      r(`tap navigates (focusShape); touchend->focusShape < 16ms (${delay === null ? '-' : delay.toFixed(1)}ms)`, d.nav.length === 1 && d.nav[0][0] === 'shape:' + D && delay < 16, { delay, nav: d.nav }); await ctx.close(); }
    { const { ctx, page, cdp, D } = await fresh(); const g = await geo(page, D);
      await drag(page, cdp, line(200, g.y, 206, g.y + 2, 3)); await W(100); const s = await st(page, D);
      r('sloppy 6px tap navigates, marks nothing', s.nav === 1 && !s.starred && !s.visited, s); await ctx.close(); }
    { const { ctx, page, cdp, D } = await fresh(); await page.evaluate(() => { document.getElementById('locationsList').scrollTop = 0; }); await W(100);
      const y = await page.evaluate(sid => { const el = document.querySelector(`#locationsList .location-card[data-shape-id="${sid}"]`), l = document.getElementById('locationsList');
        l.scrollTop = l.scrollHeight; const q = el.getBoundingClientRect(); return q.y + q.height / 2; }, D);
      const st0 = await page.evaluate(() => document.getElementById('locationsList').scrollTop);
      await drag(page, cdp, line(200, y, 204, y + 150, 15)); await W(700); const s = await st(page, D); const st1 = await page.evaluate(() => document.getElementById('locationsList').scrollTop);
      r('vertical stroke on a shape row scrolls, never marks or navigates', st1 < st0 - 50 && !s.starred && !s.visited && !s.nav && !s.live, { st0, st1, s }); await ctx.close(); }

    // --- rows 56.00px on every frame of the four strokes on the two shape rows
    { const { ctx, page, cdp, D, S } = await fresh();
      await page.evaluate(() => { window.__hs = new Set(); let run = true; const tick = () => { if (!run) return; document.querySelectorAll('#locationsList .location-card').forEach(c => __hs.add(c.getBoundingClientRect().height)); requestAnimationFrame(tick); }; requestAnimationFrame(tick); window.__hstop = () => { run = false; return [...__hs]; }; });
      for (const [sid, dir] of [[D, 1], [S, 1], [D, -1], [S, -1]]) { const g = await geo(page, sid); const x0 = dir > 0 ? 170 : g.xc;
        await drag(page, cdp, line(x0, g.y, x0 + dir * 110, g.y, 12)); await W(1100); }
      const hs = await page.evaluate(() => __hstop()); const s = [await st(page, D), await st(page, S)];
      r(`rows 56.00px on every frame of star / unstar / visit / un-visit on shape rows: ${hs.map(h => h.toFixed(2)).join(',')}`, hs.length === 1 && hs[0] === 56 && s[0].starred && s[0].visited && !s[1].starred && !s[1].visited, { hs, s }); await ctx.close(); }

    // --- delete safety on the shape X (delete.js's sweep, shortened) + D7
    { const { ctx, page, cdp, D } = await fresh(); const out = [];
      const reset = () => page.evaluate(sid => { setLocationFlag(shapeKey(sid), 'visited', false); setLocationFlag(shapeKey(sid), 'starred', false); __del.length = 0; __nav.length = 0; map.closePopup(); }, D);
      const runs = [[0, [0, 0]], [1, [-1, 0]], [3, [-1, 0]], [3, [0, -1]]].map(x => [...x, false]).concat([4, 6, 12, 40].flatMap(dd => [[dd, [-1, 0], false], [dd, [1, 0], false], [dd, [0, -1], false]])).concat([[6, [-1, 0], true]]);
      for (const [dist, [ux, uy], back] of runs) {
        await reset(); await W(400); const g = await geo(page, D);
        await T(cdp, 'touchStart', g.xc, g.yc); await W(40);
        if (dist) { const n = Math.max(2, Math.ceil(dist / 6)); for (let k = 1; k <= n; k++) { await T(cdp, 'touchMove', g.xc + ux * dist * k / n, g.yc + uy * dist * k / n); await W(16); }
          if (back) for (let k = n - 1; k >= 0; k--) { await T(cdp, 'touchMove', g.xc + ux * dist * k / n, g.yc + uy * dist * k / n); await W(16); } }
        await W(30); await T(cdp, 'touchEnd'); await W(dist >= 40 ? 1000 : 300);
        const o = await page.evaluate(() => ({ del: __del.slice(), nav: __nav.length })); const want = dist < 4 && !back;
        out.push({ dist, dir: back ? 'out-and-back' : `${ux},${uy}`, del: o.del.length, nav: o.nav, ok: (want ? o.del.length === 1 && o.del[0] === 'shape:' + D : !o.del.length) && !o.nav });
      }
      r(`touch on the shape X: 0-3px deletes, 4/6/12/40px (left/right/up) and a 6px out-and-back never; never navigates`, out.every(x => x.ok), out.filter(x => !x.ok));
      const m = [];
      for (const dd of [0, 8]) { await reset(); await W(300); const g = await geo(page, D); await page.mouse.move(g.xc, g.yc); await page.mouse.down(); if (dd) await page.mouse.move(g.xc - dd, g.yc, { steps: 2 }); await page.mouse.up(); await W(300);
        m.push(await page.evaluate(() => __del.length)); }
      await reset(); await W(300); await geo(page, D); await page.evaluate(sid => document.querySelector(`#locationsList .location-card[data-shape-id="${sid}"] .delete-btn`).focus(), D); await page.keyboard.press('Enter'); await W(200);
      const k = await page.evaluate(() => __del.length);
      r('mouse: a still click deletes, an 8px drag does not; keyboard Enter deletes', m[0] === 1 && m[1] === 0 && k === 1, { m, k });
      await reset(); await W(300); await page.evaluate(sid => setLocationFlag(shapeKey(sid), 'visited', true), D); await W(300); const g = await geo(page, D);
      await drag(page, cdp, line(g.xc, g.y, g.xc - 110, g.y, 12)); await T(cdp, 'touchStart', g.xc, g.yc); await W(30); await T(cdp, 'touchEnd'); await W(50);
      const d0 = await page.evaluate(() => __del.length); await W(900); await T(cdp, 'touchStart', g.xc, g.yc); await W(30); await T(cdp, 'touchEnd'); await W(200); const d1 = await page.evaluate(() => __del.length);
      r('D7: an X tap right after an un-visit stroke never deletes; once the X is back it does', d0 === 0 && d1 === 1, { d0, d1 });
      await ctx.close(); }

    // --- popup: the pin popup, its star / Mark Visited, the row replay, the map star
    { const { ctx, page, D, S, errors } = await fresh();
      await page.evaluate(sid => focusShape(sid), S); await W(reduced ? 500 : 1500);
      const p0 = await page.evaluate(sid => { const pop = document.querySelector('.leaflet-popup'); if (!pop) return null; const a = pop.querySelector('.popup-directions'); const nb = neighborhoodShapes.find(n => n.id === sid);
        const [la, ln] = (a.getAttribute('href').match(/daddr=([-\d.]+),([-\d.]+)/) || []).slice(1).map(Number), g = nb.geometry;
        const cross = (p, q) => (q[0] - p[0]) * (ln - p[1]) - (q[1] - p[1]) * (la - p[0]);
        const onLine = g.slice(1).some((q, i) => Math.abs(cross(g[i], q)) < 1e-9 && Math.min(g[i][0], q[0]) - 1e-9 <= la && la <= Math.max(g[i][0], q[0]) + 1e-9);
        const sm = shapeStarMarkersById.get(sid);
        return { title: pop.querySelector('.popup-title').textContent, star: pop.querySelector('.popup-star').getAttribute('aria-pressed'), visited: pop.querySelector('.popup-visited').getAttribute('aria-pressed'),
          cat: pop.querySelector('.popup-cat').textContent.trim(), onLine, starMarker: !!(sm && map.hasLayer(sm)), starAt: sm ? sm.getLatLng().distanceTo([la, ln]) : null }; }, S);
      r('street popup = the pin popup: title, star on, Visited on, Get Directions to a point on the street (the map star sits there), type line', !!p0 && p0.title === 'Fixture Street' && p0.star === 'true' && p0.visited === 'true' && p0.cat === 'street' && p0.onLine && p0.starMarker && p0.starAt < 0.5, p0);
      await page.evaluate(sid => focusShape(sid), D); await W(reduced ? 500 : 1500);
      const ins = await page.evaluate(sid => { const a = document.querySelector('.leaflet-popup .popup-directions'); const [la, ln] = a.getAttribute('href').match(/daddr=([-\d.]+),([-\d.]+)/).slice(1).map(Number);
        const lay = neighborhoodLayersById.get(sid); return { inside: lay.getBounds().contains([la, ln]), title: document.querySelector('.leaflet-popup .popup-title').textContent, star: !!shapeStarMarkersById.get(sid) }; }, D);
      r('district popup: Get Directions to a point inside the district; no map star while unstarred', ins.inside && ins.title === 'Fixture District' && !ins.star, ins);
      // the popup star: toggles the shape, replays on its row (full motion), the map star appears; Mark Visited the same
      await page.evaluate(() => document.getElementById('locationsList').scrollTop = 1e6); await W(200);
      const tapIn = async sel => { const q = await page.evaluate(sel => { const e = document.querySelector(`.leaflet-popup ${sel}`).getBoundingClientRect(); return { x: e.x + e.width / 2, y: e.y + e.height / 2 }; }, sel); await page.touchscreen.tap(q.x, q.y); };
      await tapIn('.popup-star-tap'); await W(60); const held = await page.evaluate(sid => starHeld.has(shapeKey(sid)), D); await W(1400);
      const a = await st(page, D); const a2 = await page.evaluate(sid => ({ pressed: document.querySelector('.leaflet-popup .popup-star').getAttribute('aria-pressed'), star: !!(shapeStarMarkersById.get(sid) && map.hasLayer(shapeStarMarkersById.get(sid))) }), D);
      r(`popup star: stars the district${reduced ? '' : ', replays on its row'}, the popup re-renders pressed, the map star appears`, a.starred && a.srvStarred && a.printed && (reduced ? !held : held) && a2.pressed === 'true' && a2.star && !a.live, { a, a2, held });
      await tapIn('.popup-visited-tap'); await W(60); const held2 = await page.evaluate(sid => starHeld.has(shapeKey(sid)), D); await W(1200);
      const v = await st(page, D); const v2 = await page.evaluate(() => document.querySelector('.leaflet-popup .popup-visited').getAttribute('aria-pressed'));
      r(`popup Mark Visited: visits the district${reduced ? '' : ', replays the stamp on its row'}, the popup re-renders Visited`, v.visited && v.srvVisited && v.field && v.stamps === 1 && (reduced ? !held2 : held2) && v2 === 'true', { v, v2, held2 });
      await tapIn('.popup-star-tap'); await W(1500); const u = await page.evaluate(sid => ({ starred: neighborhoodShapes.find(n => n.id === sid).starred, star: !!shapeStarMarkersById.get(sid) }), D);
      r('popup unstar clears it and removes the map star', !u.starred && !u.star, u);
      r('no page errors', !errors.length, errors);
      await ctx.close(); }

    // --- writes: RLS rollback + banner; the poll; the sort menu's Starred / What's left
    { const { ctx, page, D, S } = await fresh();
      const rb = await page.evaluate(async sid => { const real = supabaseClient.from.bind(supabaseClient); let mid = null;
        supabaseClient.from = t => { const q = real(t); if (t !== 'neighborhood_shapes') return q; q.update = () => ({ eq: () => { mid = neighborhoodShapes.find(n => n.id === sid).starred; return Promise.resolve({ error: { message: 'new row violates row-level security policy', code: '42501' } }); } }); return q; };
        await toggleLocationFlag(shapeKey(sid), 'starred'); supabaseClient.from = real;
        await new Promise(r => setTimeout(r, 200));
        return { mid, after: neighborhoodShapes.find(n => n.id === sid).starred, srv: __SHAPES.find(n => n.id === sid).starred, banner: document.getElementById('error').textContent.trim(), printed: !!document.querySelector(`.location-card[data-shape-id="${sid}"] .row-star`) }; }, D);
      r('an RLS refusal: the optimistic star rolls back; the banner says who can edit', rb.mid === true && rb.after === false && !rb.srv && !rb.printed && /Only Adam and Erica can edit places/.test(rb.banner), rb);
      const pl = await page.evaluate(async sid => { __SHAPES.find(n => n.id === sid).visited = true; pollTick(); await new Promise(r => setTimeout(r, 400));
        const el = document.querySelector(`.location-card[data-shape-id="${sid}"]`); return { visited: neighborhoodShapes.find(n => n.id === sid).visited, field: el.classList.contains('is-visited'), stamp: !!el.querySelector('.row-stamp') }; }, D);
      r('the poll brings the other phone\'s change: the district shows visited', pl.visited && pl.field && pl.stamp, pl);
      const so = await page.evaluate(async () => { const ord = () => [...document.querySelectorAll('#locationsList .location-card[data-shape-id]')].map(e => e.querySelector('h3').textContent);
        const o = {}; for (const m of ['starred', 'left', 'az']) { setSortMode(m, { announce: false, persist: false }); await new Promise(r => setTimeout(r, 50)); o[m] = ord(); }
        const sm = document.getElementById('sortMenu'); renderSortMenu(); o.menu = [...sm.querySelectorAll('.sort-opt')].map(e => e.dataset.sort); return o; });
      // district: visited (poll), unstarred; street: visited + starred
      r('Starred puts the starred street first, What\'s left the not-starred district first (both visited); A-Z back', so.starred.join() === 'Fixture Street,Fixture District' && so.left.join() === 'Fixture Street,Fixture District' && so.az.join() === 'Fixture District,Fixture Street', so);
      await ctx.close(); }
  }
  const ok = finish(); await b.close(); process.exitCode = ok ? 0 : 1;
})();
