// PLAN-ROWS SUITE -- the row gestures on a Plans stop row (docs/shipped.md "Plans (v3
// build)"; add-tag-jam phase 1). A stop row is a Places row with three deliberate changes: the
// grey number as its lead in place of the icon, under a leg (city) header, hold-to-drag on the number
// (STOP_HOLD_MS 400ms, STOP_HOLD_SLOP 4px), and × / + in the delete ×'s slot (remove from
// / add to the plan, DELETE_TAP_SLOP). Nothing else may change: until the hold arms, a
// touch on the number is the row's. Real-timing CDP touch, both motion modes:
//   tap the text / tap the number -> navigates (popup), nothing lifts
//   right stroke on the text -> Pencil Star toggles; the number stays
//   left stroke from × -> visit toggles; the stop stays in the plan (× never removes on a stroke)
//   quick vertical stroke from the number -> the list scrolls; no lift, no navigate, no move
//   300ms rest on the number, then a vertical stroke -> scrolls (the hold had not armed)
//   hold the number 450ms, drag one row down -> the stop moves one place; no navigate, no star/visit
//   × from its centre: 0/2/3px release removes; 4/6/12/40px never (left, the visit direction)
//   + from its centre: 0/3px adds; 4/12px never
//   a held stop dragged across a leg header, near the top and near the foot (auto-scroll): headers move
//     with the rows, the drop lands where the preview's gap was
//   rows 56.00px, stop rows and Places rows below the rule alike
//   a visited + starred street as a stop: stamp, field and star as a pin stop; un-visit from its ×; × removes it
// Fixture: stub.js's one plan (opted in with localStorage gh.plans): Reykjavík rows 0, 5, 1.
// FILE=<index.html> OUT=<json> node plans.js
const { launch, openProto, T, drag, line, W, recorder } = require('./lib');
const { rec, finish } = recorder('plans');
const STOPS = 'rey00,rey05,rey01';
(async () => {
  const b = await launch();
  for (const reduced of [false, true]) { const mode = reduced ? 'reduced' : 'full';
    const { ctx, page, cdp, errors } = await openProto(b, { reduced, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1' } });
    await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 });
    await page.evaluate(() => choosePlan('gh-p')); await W(800);   // the plan picked in the title menu (Plans no longer auto-opens plans[0])
    const order = () => page.evaluate(() => stopsOf('gh-p').map(s => s.location_id).join());
    const flags = id => page.evaluate(id => { const l = locations.find(x => x.id === id); return { starred: !!l.starred, visited: !!l.visited }; }, id);
    const box = (id, sel) => page.evaluate(([id, sel]) => { const row = document.querySelector(`#locationsList .location-card[data-id="${id}"]`), l = document.getElementById('locationsList');
      const r0 = row.getBoundingClientRect(), lr = l.getBoundingClientRect(); if (r0.top < lr.top || r0.bottom > lr.bottom - 4) l.scrollTop += r0.top - lr.top - 60;
      const r = (sel ? row.querySelector(sel) : row).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, l: r.x, w: r.width }; }, [id, sel]);
    const reset = async () => { await page.evaluate(() => { map.closePopup(); setHighlighted(null); __nav.length = 0; __del.length = 0; const l = document.getElementById('locationsList'); l.scrollTop = 0; }); await W(400); };
    const state = () => page.evaluate(() => ({ nav: __nav.length, del: __del.length, lifted: !!document.querySelector('.plan-lifted'), scroll: document.getElementById('locationsList').scrollTop,
      popup: !!document.querySelector('.leaflet-popup') }));
    const tap = async p => { await T(cdp, 'touchStart', p.x, p.y); await W(60); await T(cdp, 'touchEnd'); };

    // taps
    await reset(); let p = await box('rey05', '.row-main'); await tap(p); await W(reduced ? 600 : 1800);
    let s = await state(); rec(mode, 'tap on a stop row\'s text navigates and opens its popup', s.nav === 1 && s.popup && !s.lifted, s);
    await reset(); p = await box('rey05', '.row-n'); await tap(p); await W(reduced ? 600 : 1800);
    s = await state(); rec(mode, 'tap on the number (before the hold arms) is the row\'s tap: navigates, nothing lifts', s.nav === 1 && s.popup && !s.lifted && (await order()) === STOPS, s);

    // star (right) and visit (left from ×)
    await reset(); let f0 = await flags('rey05'); p = await box('rey05', '.row-main');
    await drag(page, cdp, line(p.l + 10, p.y, p.l + 120, p.y, 12)); await W(1600);
    let f1 = await flags('rey05'); s = await state();
    rec(mode, 'right stroke on a stop row toggles the Pencil Star; the number stays; no navigate', f1.starred !== f0.starred && !s.nav && (await page.evaluate(() => document.querySelector('.location-card[data-id="rey05"] .row-n').textContent)) === '2', { f0, f1, s });
    await page.evaluate(() => setLocationFlag('rey05', 'starred', false)); await reset();
    f0 = await flags('rey00'); p = await box('rey00', '.plan-x');
    await drag(page, cdp, line(p.x, p.y, p.x - 110, p.y, 12)); await W(1600);
    f1 = await flags('rey00'); s = await state();
    rec(mode, 'left stroke from × toggles visited; the stop stays in the plan; no navigate', f1.visited !== f0.visited && (await order()) === STOPS && !s.nav, { f0, f1, s, order: await order() });
    await page.evaluate(() => setLocationFlag('rey00', 'visited', false)); await W(300);

    // scroll vs hold (the list must be scrollable: the panel is closed, the fixture has 21+ rows)
    await reset(); p = await box('rey01', '.row-n');
    await drag(page, cdp, line(p.x, p.y + 30, p.x, p.y - 90, 8)); await W(500);
    s = await state(); rec(mode, 'quick vertical stroke from a number scrolls the list; no lift, no navigate, no move', s.scroll > 0 && !s.lifted && !s.nav && (await order()) === STOPS, s);
    await reset(); p = await box('rey01', '.row-n');
    await T(cdp, 'touchStart', p.x, p.y); await W(300);
    for (let k = 1; k <= 8; k++) { await T(cdp, 'touchMove', p.x, p.y - 12 * k); await W(16); }
    const mid = await state(); await T(cdp, 'touchEnd'); await W(500);
    s = await state(); rec(mode, '300ms rest on a number then a vertical stroke scrolls (the 400ms hold never armed)', s.scroll > 0 && !mid.lifted && !s.nav && (await order()) === STOPS, { mid, s });
    await reset(); p = await box('rey00', '.row-n'); f0 = await flags('rey00');
    await T(cdp, 'touchStart', p.x, p.y); await W(450);
    const armed = await state();
    for (let k = 1; k <= 8; k++) { await T(cdp, 'touchMove', p.x, p.y + 7 * k); await W(20); }
    const h = await page.evaluate(() => document.querySelector('.plan-lifted') ? document.querySelector('.plan-lifted').getBoundingClientRect().height : null);
    await T(cdp, 'touchEnd'); await W(700);
    s = await state(); f1 = await flags('rey00');
    rec(mode, 'hold the number 450ms, drag one row down: lifts (56px), moves the stop one place; no navigate, no star/visit', armed.lifted && h === 56 && (await order()) === 'rey05,rey00,rey01' && !s.nav && f1.starred === f0.starred && f1.visited === f0.visited, { armed, h, s, order: await order(), f0, f1 });
    await page.evaluate(() => reorderStop('gs0', 0)); await W(400);

    // × and + slop
    const xs = [];
    for (const d of [0, 2, 3, 4, 6, 12, 40]) {
      await reset(); p = await box('rey05', '.plan-x');
      await T(cdp, 'touchStart', p.x, p.y); await W(40);
      if (d) { const n = Math.max(2, Math.ceil(d / 6)); for (let k = 1; k <= n; k++) { await T(cdp, 'touchMove', p.x - d * k / n, p.y); await W(16); } }
      await W(30); await T(cdp, 'touchEnd'); await W(d >= 40 ? 1200 : 500);
      const o = await order(), removed = o === 'rey00,rey01';
      xs.push({ d, removed, nav: (await state()).nav });
      if (removed) { await page.evaluate(() => { const b = document.querySelector('#planSlip button'); if (b) b.click(); }); await W(500); }
      await page.evaluate(() => setLocationFlag('rey05', 'visited', false)); await W(200);   // a long left stroke is the visit swipe
    }
    rec(mode, `× (remove from the plan): ${xs.map(x => `${x.d}px ${x.removed ? 'removes' : 'no'}`).join(', ')}; never navigates; Undo restores`,
      xs.every(x => (x.d < 4) === x.removed && !x.nav) && (await order()) === STOPS, xs);
    const ps = [];
    for (const d of [0, 3, 4, 12]) {
      await reset(); p = await box('rey07', '.plan-add');
      await T(cdp, 'touchStart', p.x, p.y); await W(40);
      if (d) { const n = Math.max(2, Math.ceil(d / 6)); for (let k = 1; k <= n; k++) { await T(cdp, 'touchMove', p.x - d * k / n, p.y); await W(16); } }
      await W(30); await T(cdp, 'touchEnd'); await W(500);
      const added = (await order()) === STOPS + ',rey07';
      ps.push({ d, added, nav: (await state()).nav });
      if (added) { await page.evaluate(() => { const b = document.querySelector('#planSlip button'); if (b) b.click(); }); await W(500); }
      await page.evaluate(() => setLocationFlag('rey07', 'visited', false)); await W(200);
    }
    rec(mode, `+ (add to the plan): ${ps.map(x => `${x.d}px ${x.added ? 'adds' : 'no'}`).join(', ')}; never navigates`, ps.every(x => (x.d < 4) === x.added && !x.nav) && (await order()) === STOPS, ps);

    // the slip (critics-final P1): it sits on the rule's SETTLED place -- after + it never covers the new stop's
    // name, after × never a row's + or × -- sampled during the 150ms slide and over its 6s life
    const slipHits = () => page.evaluate(() => { const sl = document.getElementById('planSlip'); if (!sl || sl.hidden || getComputedStyle(sl).visibility === 'hidden') return { shown: false };
      const a = sl.getBoundingClientRect(), hit = el => { const q = el.getBoundingClientRect(); return q.height && a.left < q.right && q.left < a.right && a.top < q.bottom - 0.5 && q.top + 0.5 < a.bottom; };
      const lr = document.getElementById('locationsList').getBoundingClientRect();
      const ctl = [...document.querySelectorAll('#locationsList .plan-add, #locationsList .plan-x')].filter(el => { const q = el.getBoundingClientRect(); return q.top >= lr.top && q.bottom <= lr.bottom; });
      const nm = [...document.querySelectorAll('#locationsList .location-card')].filter(c => c.querySelector('.plan-x')).map(c => c.querySelector('h3')).filter(Boolean);   // every stop's name, the new one too
      return { shown: true, onRule: sl.classList.contains('on-rule'), top: Math.round(a.top), rule: Math.round(document.querySelector('.plan-rule').getBoundingClientRect().top), on: ctl.filter(hit).map(el => el.closest('.location-card').dataset.id + (el.classList.contains('plan-add') ? ':+' : ':×')).concat(nm.filter(hit).map(h => h.closest('.location-card').dataset.id + ':name')) }; });
    const samples = async () => { const out = []; let t = 0; for (const at of [40, 110, 260, 1000, 3000]) { await W(at - t); t = at; out.push({ at, ...(await slipHits()) }); } return out; };
    // + on the first place below the rule, with the rule in view (the critic's case: the slip covered the new stop's name)
    await reset(); const firstAdd = await page.evaluate(() => document.querySelector('#locationsList .plan-add').closest('.location-card').dataset.id);
    p = await box(firstAdd, '.plan-add'); await tap(p);
    const sa = await samples();
    await page.evaluate(() => { const b = document.querySelector('#planSlip button'); if (b) b.click(); }); await W(600);
    await reset(); p = await box('rey05', '.plan-x'); await tap(p);
    const sx = await samples();
    await page.evaluate(() => { const b = document.querySelector('#planSlip button'); if (b) b.click(); }); await W(600);
    rec(mode, 'the Added / Removed slip never covers the new stop\'s name or a row\'s + / × (during the slide and over its 6s); shown from the settled rule on (it waits out the 150ms slide)',
      sa.concat(sx).every(x => (x.shown || x.at < 200) && (!x.shown || !x.on.length && (!x.onRule || Math.abs(x.top - x.rule) <= 1))) && (await order()) === STOPS, { sa, sx });
    // the add slip's news never goes to the ellipsis: a long name truncates, " as stop n" stays whole
    await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); window.__nm = l.name; l.name = 'Café Loki opposite Hallgrímskirkja church on the hill'; updateUI(); }); await W(300);
    await reset(); p = await box('rey07', '.plan-add'); await tap(p); await W(400);
    const tr = await page.evaluate(() => { const tx = document.querySelector('#planSlip .slip-text'), fx = [...tx.querySelectorAll('.slip-fix')], nm = tx.querySelector('.slip-name'), r = tx.getBoundingClientRect();
      return { text: tx.textContent, suffix: fx.length ? fx[fx.length - 1].textContent : null, suffixIn: fx.every(f => { const q = f.getBoundingClientRect(); return q.right <= r.right + 0.5 && f.scrollWidth <= f.clientWidth + 0.5; }), nameCut: nm.scrollWidth > nm.clientWidth }; });
    await page.evaluate(() => { const b = document.querySelector('#planSlip button'); if (b) b.click(); }); await W(500);
    await page.evaluate(() => { locations.find(x => x.id === 'rey07').name = window.__nm; updateUI(); }); await W(300);
    rec(mode, 'a long name: "Added … as stop 4" truncates the name only; the stop number always shows', /as stop 4$/i.test(tr.text) && / as stop 4/.test(tr.suffix || '') && tr.suffixIn && tr.nameCut && (await order()) === STOPS, tr);

    // a district/street stop (2026-10-02, shapes visit and star like pins): stub.js's Reykjavik street is visited
    // + starred; added from below the rule, its stop row shows them as a pin stop does; a left stroke from its ×
    // un-visits it and it stays a stop; × removes it (back to the fixture's three stops)
    const sid = await page.evaluate(() => neighborhoodShapes.find(n => n.city === activeCity && n.type === 'street').id);
    const sbox = sel => page.evaluate(([sid, sel]) => { const row = document.querySelector(`#locationsList .location-card[data-shape-id="${sid}"]`), l = document.getElementById('locationsList');
      const r0 = row.getBoundingClientRect(), lr = l.getBoundingClientRect(); if (r0.top < lr.top || r0.bottom > lr.bottom - 4) l.scrollTop += r0.top - lr.top - 60;
      const r = row.querySelector(sel).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, [sid, sel]);
    const shapeStop = () => page.evaluate(sid => { const e = document.querySelector(`#locationsList .location-card[data-shape-id="${sid}"]`), n = e.querySelector('.row-n'), nb = neighborhoodShapes.find(x => x.id === sid);
      return { stop: e.classList.contains('is-stop'), n: n && n.textContent, visited: !!nb.visited, field: e.classList.contains('is-visited'), stamp: !!e.querySelector('.row-stamp'), star: !!e.querySelector('.row-star'),
        sr: e.querySelector('.row-meta .sr-only').textContent, h: e.getBoundingClientRect().height, line: planStopLine('shape', sid), stops: stopsOf('gh-p').length }; }, sid);
    await reset(); p = await sbox('.plan-add'); await tap(p); await W(800);
    const ss = await shapeStop();
    rec(mode, 'a visited + starred street added as stop 4: its stop row shows the stamp, the visited field and the star like a pin stop (56px)', ss.stop && ss.n === '4' && ss.visited && ss.field && ss.stamp && ss.star && /visited/.test(ss.sr) && !/not visited/.test(ss.sr) && ss.h === 56 && ss.line === 'Stop 4 of 4', ss);
    await reset(); p = await sbox('.plan-x'); await drag(page, cdp, line(p.x, p.y, p.x - 110, p.y, 12)); await W(1600);
    const su = await shapeStop(); s = await state();
    rec(mode, 'left stroke from the street stop\'s × un-visits it; it stays stop 4; no navigate', su.stop && su.n === '4' && !su.visited && !su.field && !su.stamp && su.star && su.stops === 4 && !s.nav && !s.del, { su, s });
    await page.evaluate(sid => setLocationFlag(shapeKey(sid), 'visited', true), sid); await W(300);
    await reset(); p = await sbox('.plan-x'); await tap(p); await W(800);
    rec(mode, '× on the street stop removes it (the plan is back to its three stops)', (await order()) === STOPS && (await page.evaluate(() => stopsOf('gh-p').length)) === 3, await order());

    // drag across a leg header (add-tag-jam phase 1): the plan gets a Copenhagen stop between Reykjavík ones
    // (legs Reykjavík | Copenhagen | Reykjavík); a held stop dragged across a header: every header moves with the
    // rows (no row ever covers a header), and the drop lands exactly where the preview's gap was -- near the
    // list's top, and near its foot with the edge auto-scroll running.
    const cid = await page.evaluate(async () => { await addStop('gh-p', { locationId: 'cop00' }); const s = stopsOf('gh-p').find(x => x.location_id === 'cop00'); await reorderStop(s.id, 1); return s.id; }); await W(600);
    const LEGS = 'rey00,cop00,rey05,rey01';
    const legState = () => page.evaluate(() => {
      const list = document.getElementById('locationsList'), lr = list.getBoundingClientRect(), lifted = document.querySelector('.plan-lifted');
      const nodes = [...list.children].filter(e => e.matches('.sec-head, .location-card.is-stop') && e !== lifted).map(e => ({ e, r: e.getBoundingClientRect(), head: e.matches('.sec-head') }));
      let cover = 0;
      nodes.forEach(a => nodes.forEach(b => { if (a !== b && a.head && !b.head && a.r.top < b.r.bottom - 1 && b.r.top < a.r.bottom - 1) cover++; }));
      // the preview's slot: the other stops (as drawn now) whose middle is above the lifted row's middle
      const lm = lifted ? (lifted.getBoundingClientRect().top + lifted.getBoundingClientRect().bottom) / 2 : null;
      const slot = lifted ? nodes.filter(n => !n.head && (n.r.top + n.r.bottom) / 2 < lm).length : null;
      return { cover, slot, lifted: !!lifted, legs: document.querySelectorAll('#locationsList .sec-head.is-leg').length, lt: lr.top, lb: Math.min(lr.bottom, innerHeight) };
    });
    const legDrag = async (id, dy, foot) => {
      await page.evaluate(() => { map.closePopup(); setHighlighted(null); document.getElementById('locationsList').scrollTop = 0; }); await W(300);
      if (foot) await page.evaluate(id => { const l = document.getElementById('locationsList'), r = document.querySelector(`.location-card[data-id="${id}"]`).getBoundingClientRect(), lr = l.getBoundingClientRect();
        l.scrollTop += r.bottom - (Math.min(lr.bottom, innerHeight) - 20); }, id), await W(300);
      const q = await page.evaluate(id => { const r = document.querySelector(`.location-card[data-id="${id}"] .row-n`).getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, id);
      await T(cdp, 'touchStart', q.x, q.y); await W(470);
      const mids = [];
      for (let k = 1; k <= 14; k++) { await T(cdp, 'touchMove', q.x, q.y + dy * k / 14); await W(24); if (k % 5 === 0) mids.push(await legState()); }
      await W(foot ? 400 : 150);
      const pre = await legState(); mids.push(pre);
      await T(cdp, 'touchEnd'); await W(900);
      const ord = (await order()).split(',');
      return { pre, mids, ord, at: ord.indexOf(id), legs: (await legState()).legs };
    };
    // near the top: Reykjavík's first stop down ~1.5 rows, across the Copenhagen header
    let d = await legDrag('rey00', 112, false);
    rec(mode, 'drag across a leg header (near the top): headers move with the rows (no row covers a header), the drop lands where the preview showed', d.mids.every(m => m.lifted && m.cover === 0) && d.at === d.pre.slot && d.at >= 1, d);
    await page.evaluate(([cid]) => { const s = stopsOf('gh-p'); const r0 = s.find(x => x.location_id === 'rey00'); return reorderStop(r0.id, 0).then(() => { const c = stopsOf('gh-p').find(x => x.id === cid); return reorderStop(cid, 1); }); }, [cid]); await W(600);
    const back1 = await order();
    // near the foot: the last stop up across a header, from the list's bottom edge (auto-scroll can run)
    d = await legDrag('rey01', -150, true);
    rec(mode, 'drag up across a leg header (from the list\'s foot): no row covers a header; the drop lands where the preview showed', back1 === LEGS && d.mids.every(m => m.lifted && m.cover === 0) && d.at === d.pre.slot && d.at <= 1, { back1, d });
    await page.evaluate(([cid]) => { const ids = ['rey00', 'cop00', 'rey05', 'rey01']; let p = Promise.resolve(); ids.forEach((loc, i) => { p = p.then(() => reorderStop(stopsOf('gh-p').find(t => t.location_id === loc).id, i)); }); return p; }, [cid]); await W(600);
    const back2 = await order();
    d = await legDrag('rey00', 112, true);
    rec(mode, 'drag down across a leg header at the list\'s foot (the edge auto-scroll runs): no row covers a header; the drop lands where the preview showed', back2 === LEGS && d.mids.every(m => m.lifted && m.cover === 0) && d.at === d.pre.slot && d.at >= 1, { back2, d });
    // back to the fixture's three stops
    await page.evaluate(async cid => { await removeStop(cid); const s = stopsOf('gh-p'); const ids = ['rey00', 'rey05', 'rey01']; for (let i = 0; i < ids.length; i++) { const x = stopsOf('gh-p').find(t => t.location_id === ids[i]); await reorderStop(x.id, i); } hidePlanSlip(); }, cid); await W(600);
    rec(mode, 'the plan is back to its three stops', (await order()) === STOPS, await order());
    const hs = await page.evaluate(() => [...new Set([...document.querySelectorAll('#locationsList .location-card')].map(e => e.getBoundingClientRect().height.toFixed(2)))]);
    rec(mode, 'rows 56.00px (stop rows and the rows below the rule)', hs.length === 1 && hs[0] === '56.00', hs);
    rec(mode, 'no page errors', !errors.length, errors);
    await ctx.close();
  }
  const ok = finish(); await b.close(); process.exitCode = ok ? 0 : 1;
})();
