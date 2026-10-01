// TOUCH SUITE -- the "84" of the star gate "84 + 8 (+ N8-a)".
// A re-implementation of design/pencil-star/test6.js (42 cases x 2 motion modes = 84)
// on this harness, run against the real index.html. Case-for-case the same list as
// test6.js; where p8 / swipe-visit superseded a behaviour, the case asserts the
// CURRENT spec (docs/shipped.md) and says so in its name ("[p8]", "[visit]"):
//   - "drag LEFT is inert" -> drag left never stars (left is now the visit stroke)
//   - S4 teach x2 (maybeTeachStar, removed in p8) -> popup->row star replay, every
//     time, both ways (ssReplay) + off-screen row: no replay
//   - popup "pencil draw / rub" -> p8 popup: fade + pop once / fade + lift to hollow
//   - S3's "main" reference -> the same page with the row gesture detached (the
//     scroller alone), since main now IS the gesture build
// Also runs N8-a (mouse click on the popup star keeps focus on the button; touch
// leaves it on body) and reports it separately: it is the "(+ N8-a)".
// FILE=<index.html> OUT=<json> node touch.js
const { launch, openProto, T, drag, line, rowRect, ROWS, W, recorder } = require('./lib');
const { rec, finish, results } = recorder('touch');
const state = (page) => page.evaluate(() => { const ids = __rowIds(), cards = ids.map(id => document.querySelector(`.location-card[data-id="${id}"]`));
  return { starred: ids.map(id => !!locations.find(l => l.id === id).starred), visited: ids.map(id => !!locations.find(l => l.id === id).visited), nav: __nav.map(n => n[0]), del: __del.slice(),
    live: document.querySelectorAll('.sg-star').length, tf: cards.map(c => c.querySelector('h3').style.transform),
    heights: [...document.querySelectorAll('#locationsList .location-card')].map(c => c.getBoundingClientRect().height),
    printed: cards.map(c => !!c.querySelector('.row-star')), gesture: starGesture, held: starHeld.size }; });
const same = (s) => s.starred.join() === ROWS.map(r => r.starred).join();
const scrollTop = page => page.evaluate(() => document.getElementById('locationsList').scrollTop);
const n8 = [];
(async () => {
  const b = await launch();
  for (const reduced of [false, true]) {
    const mode = reduced ? 'reduced' : 'full';
    const fresh = async (o = {}) => openProto(b, { reduced, ...o });
    const r = (name, pass, detail) => rec(mode, name, pass, detail);
    const Y = async (page, i) => { const q = await rowRect(page, i); return q.y + q.h / 2; };
    // --- r1 cases
    { const { ctx, page, cdp, errors } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(170, y, 250, y, 16)); await W(1000); const s = await state(page);
      r('star: drag right 80px', s.starred[0] && s.printed[0] && !s.nav.length && !s.live && s.tf[0] === '' && s.heights.every(h => h === 56) && !errors.length, { s, errors }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 1);
      await drag(page, cdp, line(170, y, 250, y, 16)); await W(1000); const s = await state(page);
      r('unstar: same stroke on starred row', !s.starred[1] && !s.printed[1] && !s.nav.length && !s.live, s); await ctx.close(); }
    for (const d of [30, 60]) { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(170, y, 170 + d, y, 8)); await W(800); const s = await state(page);
      r(`cancel: ${d}px finger then release`, same(s) && !s.nav.length && !s.live && s.tf[0] === '' && s.gesture === null, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, [...line(170, y, 250, y, 12), ...line(250, y, 190, y, 10).slice(1)]); await W(800); const s = await state(page);
      r('cancel: past detent, back to 20px', same(s) && !s.live && !s.nav.length, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 1);
      await drag(page, cdp, [...line(170, y, 250, y, 12), ...line(250, y, 190, y, 10).slice(1)]); await W(800); const s = await state(page);
      r('unstar cancel: past detent, back off -> still starred, printed', same(s) && s.printed[1] && !s.live, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 2); const st0 = await scrollTop(page);
      await drag(page, cdp, line(200, y, 204, y - 150, 15)); await W(700); const s = await state(page); const st1 = await scrollTop(page);
      r('vertical scroll scrolls, never stars', st1 > st0 + 50 && same(s) && !s.nav.length && !s.live, { st0, st1 }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await T(cdp, 'touchStart', 200, y); await W(60); await T(cdp, 'touchEnd'); await W(100);
      const d = await page.evaluate(() => ({ nav: __nav, te: __te })); const delay = d.nav.length ? d.nav[0][1] - d.te[d.te.length - 1] : null;
      r(`tap navigates; touchend->highlightMarker < 16ms (${delay === null ? '-' : delay.toFixed(1)}ms)`, d.nav.length === 1 && delay < 16, { delay }); results[results.length - 1].delayMs = delay; await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(200, y, 206, y + 2, 3)); await W(100); const s = await state(page);
      r('sloppy 6px tap navigates', s.nav.length === 1 && same(s), s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(12, y, 110, y, 16)); await W(400); const s = await state(page);
      r('start at x=12 never arms', same(s) && !s.live, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); await rowRect(page, 0); const d = await page.evaluate(() => { const q = document.querySelectorAll('#locationsList .delete-btn')[0].getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; });
      await drag(page, cdp, line(d.x, d.y, d.x - 90, d.y, 12)); await W(900); let s = await state(page); const a = !s.del.length && same(s) && !s.live;
      await drag(page, cdp, line(d.x - 120, d.y, d.x + 5, d.y, 12)); await W(1000); s = await state(page);
      r('drag from delete: no delete, no star [visit: it visits]; drag ending on delete: stars, never deletes', a && !s.del.length && s.starred[0], s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(170, y, 216, y, 5), { stepMs: 8, synthTs: true }); await W(1000); const s = await state(page);
      r('flick 46px in 40ms STARS', s.starred[0] && !s.nav.length, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 1);
      await drag(page, cdp, line(170, y, 225, y, 5), { stepMs: 8, synthTs: true }); await W(1000); const s = await state(page);
      r('S5: flick 55px/40ms on a starred row does NOT unstar', s.starred[1] && s.printed[1] && !s.live, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(170, y, 250, y, 16), { end: 'touchCancel' }); await W(800); const s = await state(page);
      r('touchcancel past detent reverts', same(s) && !s.live && s.tf[0] === '' && s.gesture === null, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(250, y, 150, y, 16)); await W(900); const s = await state(page);
      r('[visit] drag LEFT never stars (it is the visit stroke): no pencil, no nav', same(s) && !s.live && !s.nav.length && s.gesture === null, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 1); const hs = [];
      await drag(page, cdp, line(170, y, 290, y, 12), { onStep: async () => { hs.push(...(await state(page)).heights); } }); await W(800);
      r('rows 56.00px at every drag step', hs.length > 0 && hs.every(h => h === 56), { uniq: [...new Set(hs)] }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 2);
      await drag(page, cdp, line(200, y, 200, y - 60, 6)); await W(600);
      const y3 = await page.evaluate(() => { const q = document.querySelectorAll('#locationsList .location-card[data-id]')[3].getBoundingClientRect(); return q.y + q.height / 2; });
      await T(cdp, 'touchStart', 200, y3); await W(50); await T(cdp, 'touchEnd'); await W(100); const s = await state(page);
      r('scroll, settle, tap: navigates', s.nav.length === 1, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 2);
      await drag(page, cdp, line(160, y, 220, y - 100, 12)); await W(600); const s = await state(page);
      r('diagonal 60x/100y never stars', same(s) && !s.live && !s.nav.length, s); await ctx.close(); }
    // --- clearance: no graphite while the name is < 3px clear of the sketch
    for (const nm of ['Café Pascal', 'Järntorget', 'Ítalía']) { const { ctx, page } = await fresh();
      const q = await page.evaluate((nm) => { const id = __rowIds()[0]; locations = locations.map(l => l.id === id ? { ...l, name: nm } : l); updateUI();
        const loc = locations.find(l => l.id === id); const el = document.querySelector(`.location-card[data-id="${id}"]`);
        const m = mountPencilStar(el, loc); const g = { ...m, id, starred: false, off: 0, armed: false, forward: true }; const pen = m.svg.querySelector('.sg-pencil').getBoundingClientRect();
        let minGap = 1e9, firstDrawn = null;
        for (let raw = 0; raw <= 56; raw += 0.5) { setSlip(g, raw); g.ps.draw(raw); const drawn = [...m.svg.querySelectorAll('.sg-rev')].some(l => parseFloat(l.getAttribute('stroke-dashoffset')) < parseFloat(l.dataset.l) - 0.01);
          if (drawn) { if (firstDrawn === null) firstDrawn = raw; minGap = Math.min(minGap, textLeft(m.h3) - pen.right); } }
        releaseStarRow(el, g, true); return { s0: m.strokes[0], firstDrawn, minGap: +minGap.toFixed(2) }; }, nm);
      r(`clearance "${nm}": first graphite at content ${q.firstDrawn}, min gap ${q.minGap}px (>=3)`, q.firstDrawn !== null && q.minGap >= 3, q); await ctx.close(); }
    // --- honest rub-out: ghost present at 55, gone exactly at 56; no grain until 100% graphite
    { const { ctx, page } = await fresh();
      const q = await page.evaluate(() => { const id = __rowIds()[1]; const el = document.querySelector(`.location-card[data-id="${id}"]`); const m = mountPencilStar(el, locations.find(l => l.id === id)); const out = {};
        for (const raw of [5, 9, 10, 12, 44, 50, 55, 55.9, 56]) { m.ps.rub(raw); const gh = m.svg.querySelector('.sg-ghost'), inkg = m.svg.querySelector('.sg-inkg');
          out[raw] = { ghost: +gh.getAttribute('opacity'), grain: +(inkg.style.opacity || 0) }; }
        return out; });
      const noGrain = [5, 9, 10].every(k => q[k].grain === 0);
      r('honest rub: ghost 0.25 held at 44-55.9, 0 at 56; no grain until 100% graphite', q[44].ghost === 0.25 && q[55.9].ghost === 0.25 && q[56].ghost === 0 && noGrain && q[12].grain > 0, q); await ctx.close(); }
    // --- S1 swallowed taps
    for (const [label, rowIdx, wait] of [['other row 0ms', 2, 0], ['other row 60ms', 2, 60], ['other row 150ms', 2, 150], ['same row 60ms', 0, 60], ['same row 150ms', 0, 150]]) {
      const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0); const yy = await Y(page, rowIdx);
      await drag(page, cdp, line(170, y, 250, y, 16)); if (wait) await W(wait);
      await T(cdp, 'touchStart', 200, yy); await W(40); await T(cdp, 'touchEnd'); await W(700); const s = await state(page);
      r(`S1: star, then tap ${label}: navigates`, s.nav.length === 1 && s.starred[0], s); await ctx.close(); }
    { const { ctx, page } = await fresh(); const y = await Y(page, 0), y2 = await Y(page, 2);
      await page.mouse.move(170, y); await page.mouse.down(); for (let d = 4; d <= 80; d += 4) await page.mouse.move(170 + d, y); await page.mouse.up(); await W(60);
      const n0 = await page.evaluate(() => __nav.length); await page.mouse.click(200, y2); await W(100);
      await page.mouse.click(200, y); await W(100); const s = await state(page);
      r('S1 mouse: drag-star eats only its own click; next clicks navigate', n0 === 0 && s.nav.length === 2 && s.starred[0], { n0, s }); await ctx.close(); }
    // --- S3 diagonal matrix (100px drags up-right at angle from horizontal), vs the scroller alone
    for (const deg of [20, 25, 30, 33, 36, 40, 45, 50]) {
      const a = deg * Math.PI / 180; let baseScroll = 0;
      { const m = await fresh(); await m.page.evaluate(() => { attachStarGesture = () => {}; cardsById.forEach(e => e.el.remove()); cardsById.clear(); updateUI(); });
        const y = await Y(m.page, 3); const s0 = await scrollTop(m.page);
        await drag(m.page, m.cdp, line(150, y, 150 + 100 * Math.cos(a), y - 100 * Math.sin(a), 20), { stepMs: 10 }); await W(700);
        baseScroll = (await scrollTop(m.page)) - s0; await m.ctx.close(); }
      const { ctx, page, cdp } = await fresh(); const y = await Y(page, 3); const st0 = await scrollTop(page);
      await drag(page, cdp, line(150, y, 150 + 100 * Math.cos(a), y - 100 * Math.sin(a), 20), { stepMs: 10 }); await W(900);
      const s = await state(page); const scrolled = (await scrollTop(page)) - st0, starred = s.starred[3] !== ROWS[3].starred;
      // <=33deg: a star stroke (no scroll). >=36deg: never a star, and it scrolls at least as far as the bare scroller does.
      const ok = deg <= 33 ? (starred && scrolled === 0) : (!starred && (baseScroll === 0 ? scrolled === 0 : scrolled >= baseScroll - 12));
      r(`S3: ${deg}deg 100px drag -> ${starred ? 'star' : 'no star'}, scroll ${Math.round(scrolled)}px (scroller alone ${Math.round(baseScroll)}px)`, ok, { scrolled, starred, baseScroll }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 3); const st0 = await scrollTop(page);
      await drag(page, cdp, [...line(150, y, 162, y, 3), ...line(162, y, 164, y - 150, 15).slice(1)], { stepMs: 10 }); await W(700);
      const scrolled = (await scrollTop(page)) - st0; const s = await state(page);
      r(`S3: 12px sideways then 150px up -> no star (scroll ${Math.round(scrolled)}px)`, same(s) && !s.live, { scrolled }); await ctx.close(); }
    // --- S2 press delay (MutationObserver on the row's class)
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0), y2 = await Y(page, 2);
      await page.evaluate(() => { window.__pr = []; document.querySelectorAll('#locationsList .location-card[data-id]').forEach((el, i) => new MutationObserver(() => __pr.push([i, el.classList.contains('active'), performance.now()])).observe(el, { attributes: true, attributeFilter: ['class'] }));
        window.__tt = []; for (const t of ['touchstart', 'touchend']) document.addEventListener(t, () => __tt.push([t, performance.now()]), true); });
      await drag(page, cdp, line(170, y, 250, y, 16)); await W(1200);
      const strokePressed = await page.evaluate(() => __pr.some(p => p[0] === 0 && p[1]));
      await page.evaluate(() => { __pr.length = 0; __tt.length = 0; }); await T(cdp, 'touchStart', 200, y2); await W(40); await T(cdp, 'touchEnd'); await W(300);
      const q1 = await page.evaluate(() => { const te = __tt.find(t => t[0] === 'touchend')[1]; const on = __pr.find(p => p[0] === 2 && p[1]), off = __pr.find(p => p[0] === 2 && !p[1] && on && p[2] > on[2]);
        return { quickOnAfterRelease: on ? on[2] - te : null, quickDuration: on && off ? off[2] - on[2] : null }; });
      await page.evaluate(() => { __pr.length = 0; __tt.length = 0; }); await T(cdp, 'touchStart', 200, y2); await W(250);
      const q2 = await page.evaluate(() => { const ts = __tt.find(t => t[0] === 'touchstart')[1]; const on = __pr.find(p => p[0] === 2 && p[1]); return { holdPressAt: on ? on[2] - ts : null }; }); await T(cdp, 'touchEnd'); await W(200);
      const q = { strokePressed, ...q1, ...q2 };
      r(`S2: no press during a stroke; quick tap presses on release for ${q.quickDuration && Math.round(q.quickDuration)}ms; a still hold presses at ${q.holdPressAt && Math.round(q.holdPressAt)}ms`,
        !q.strokePressed && q.quickOnAfterRelease !== null && q.quickOnAfterRelease < 16 && q.quickDuration >= 90 && q.holdPressAt >= 78 && q.holdPressAt < 140, q); await ctx.close(); }
    // --- [p8] popup -> row star replay (replaces S4 teach): every time, both ways; reduced motion = state lands
    { const { ctx, page } = await fresh();
      const q = await page.evaluate(async (reduced) => { const out = [];
        for (const i of [0, 2]) { const id = __rowIds()[i]; const el = () => document.querySelector(`.location-card[data-id="${id}"]`);
          for (const pass of [1, 2]) { const was = !!locations.find(l => l.id === id).starred; const played = ssReplay(id); const held = starHeld.has(id); const live = !!el().querySelector('.sg-star');
            setLocationFlag(id, 'starred', !was); await new Promise(r => setTimeout(r, reduced ? 200 : 1300));
            out.push({ i, pass, played, held, live, now: !!locations.find(l => l.id === id).starred, printed: !!el().querySelector('.row-star'), liveAfter: !!document.querySelector('.sg-star'), heldAfter: starHeld.size }); } }
        return out; }, reduced);
      const okp = q.every(x => (reduced ? (!x.played && !x.held && !x.live) : (x.played && x.held && x.live)) && x.printed === x.now && !x.liveAfter && !x.heldAfter) && q[0].now && !q[1].now;
      r(`[p8] popup star replays on the on-screen row every time, both ways (no cap); holds render until done${reduced ? ' (reduced: no replay, state lands)' : ''}`, okp, q); await ctx.close(); }
    { const { ctx, page } = await fresh();
      const q = await page.evaluate(() => { const id = __rowIds()[7]; const played = ssReplay(id); const live = !!document.querySelector('.sg-star'); setLocationFlag(id, 'starred', true);
        return { played, live, printed: !!document.querySelector(`.location-card[data-id="${id}"] .row-star`) }; });
      r('[p8] popup star on an off-screen row: no replay, the state just lands', !q.played && !q.live && q.printed, q); await ctx.close(); }
    // --- [p8] popup: star = fill fades in + spin-stamp pop, once (no replay on re-render); unstar = fade + lift to hollow
    { const { ctx, page, errors } = await fresh();
      const out = await page.evaluate(async () => { const id = __rowIds()[0]; const loc = locations.find(l => l.id === id); map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 100)); updateUI();
        markersById.get(id).marker.openPopup(); await new Promise(r => setTimeout(r, 50));
        document.querySelector('.leaflet-popup .popup-star').click(); await new Promise(r => setTimeout(r, 30));
        const a = { starred: locations.find(l => l.id === id).starred, play: !!document.querySelector('.leaflet-popup .sgp.sgp-in'), drawn: !!document.querySelector('.leaflet-popup .sg-pencil') };
        updateUI(); markersById.get(id).marker.setPopupContent(buildPopupHtml(locations.find(l => l.id === id))); a.replay = !!document.querySelector('.leaflet-popup .sgp.sgp-in');
        await new Promise(r => setTimeout(r, 1300));
        document.querySelector('.leaflet-popup .popup-star').click(); await new Promise(r => setTimeout(r, 30)); a.out = !!document.querySelector('.leaflet-popup .sgp.sgp-out');
        await new Promise(r => setTimeout(r, 1200));
        a.unstarred = !locations.find(l => l.id === id).starred; a.hollow = !!document.querySelector('.leaflet-popup .popup-star use[href="#g-star-open"]'); return a; }).catch(e => ({ err: e.message }));
      r('[p8] popup: 1 tap fades + pops the ink once (no pencil, no replay on re-render); unstar fades off to hollow', out.starred && out.play && !out.drawn && !out.replay && out.out && out.unstarred && out.hollow && !errors.length, { out, errors }); await ctx.close(); }
    // --- N3 shape give
    { const { ctx, page, cdp } = await fresh();
      const has = await page.evaluate(() => document.querySelectorAll('#locationsList .location-card[data-shape-id]').length);
      if (has) { const q = await page.evaluate(() => { const e = document.querySelector('#locationsList .location-card[data-shape-id]'); const l = document.getElementById('locationsList'); l.scrollTop += e.getBoundingClientRect().top - l.getBoundingClientRect().top - 60; const b = e.getBoundingClientRect(); return { y: b.y + b.height / 2 }; });
        await W(150); let maxT = 0;
        await drag(page, cdp, line(170, q.y, 260, q.y, 15), { onStep: async () => { const t = await page.evaluate(() => { const m = document.querySelector('#locationsList .location-card[data-shape-id] .row-main').style.transform; return parseFloat((m || '').slice(11)) || 0; }); maxT = Math.max(maxT, t); } });
        await W(400); const end = await page.evaluate(() => document.querySelector('#locationsList .location-card[data-shape-id] .row-main').style.transform);
        r('N3: shape row stroke gives <=6px and springs back', maxT > 0 && maxT <= 6 && !end, { maxT, end }); }
      else r('N3: shape row present', false, {}); await ctx.close(); }
    // --- N8-a (reported separately): mouse click on the popup star keeps focus on the star button; a touch tap leaves body
    for (const how of ['mouse', 'touch']) { const { ctx, page } = await fresh();
      const c = await page.evaluate(async () => { const id = __rowIds()[0]; const loc = locations.find(l => l.id === id); map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 100)); updateUI();
        markersById.get(id).marker.openPopup(); await new Promise(r => setTimeout(r, 400)); const b = document.querySelector('.leaflet-popup .popup-star-tap').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, id }; });
      if (how === 'mouse') await page.mouse.click(c.x, c.y); else await page.touchscreen.tap(c.x, c.y);
      await W(500);
      const f = await page.evaluate(id => ({ starred: !!locations.find(l => l.id === id).starred, active: document.activeElement === document.body ? 'body' : (document.activeElement.className || document.activeElement.tagName), isStar: !!(document.activeElement.matches && document.activeElement.matches('.leaflet-popup .popup-star')) }), c.id);
      const pass = f.starred && (how === 'mouse' ? f.isStar : f.active === 'body');
      n8.push({ mode, how, pass, f }); console.log(`${mode.padEnd(8)} ${pass ? 'PASS' : 'FAIL'} N8-a ${how} click on the popup star -> focus ${f.active}${pass ? '' : ' ' + JSON.stringify(f)}`); await ctx.close(); }
  }
  const n8ok = n8.every(x => x.pass);
  console.log(`N8-a ${n8.filter(x => x.pass).length}/${n8.length}`);
  finish({ n8a: { pass: n8ok, runs: n8 } }); await b.close();
  process.exitCode = results.every(x => x.pass) && n8ok ? 0 : 1;
})();
