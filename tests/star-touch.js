// Round-2 behaviour suite: r1's cases + UX's (swallowed taps, diagonal matrix, flick-unstar, press delay, teach, popup rub, shape give).
const { launch, openProto, T, drag, line, rowRect, ROWS } = require('./lib'); const fs = require('fs');
const FILE = undefined; // openProto defaults to lib.FILE (PROTO env or ../index.html)
const state = (page) => page.evaluate(() => ({
  starred: locations.map(l => !!l.starred), nav: __nav.map(n => n[0]), del: __del.slice(),
  live: document.querySelectorAll('.sg-star').length, tf: [...document.querySelectorAll('#locationsList h3')].map(h => h.style.transform),
  heights: [...document.querySelectorAll('#locationsList .location-card')].map(c => c.getBoundingClientRect().height),
  printed: [...document.querySelectorAll('#locationsList .location-card')].map(c => !!c.querySelector('.row-star')), gesture: starGesture }));
const same = (s) => s.starred.join() === ROWS.map(r => r.starred).join();
(async () => {
  const b = await launch(); const results = [];
  for (const reduced of [false, true]) {
    const mode = reduced ? 'reduced' : 'full';
    const fresh = async (o = {}) => openProto(b, { reduced, dsf: 1, ...(FILE ? { file: FILE } : {}), ...o });
    const rec = (name, pass, detail) => { results.push({ mode, name, pass, detail }); console.log(mode.padEnd(8), pass ? 'PASS' : 'FAIL', name, pass ? '' : JSON.stringify(detail).slice(0, 600)); };
    const Y = async (page, i) => { const r = await rowRect(page, i); return r.y + r.h / 2; };
    // --- r1 cases
    { const { ctx, page, cdp, errors } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(170, y, 250, y, 16)); await page.waitForTimeout(800); const s = await state(page);
      rec('star: drag right 80px', s.starred[0] && s.printed[0] && !s.nav.length && !s.live && s.tf[0] === '' && s.heights.every(h => h === 56) && !errors.length, { s, errors }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 1);
      await drag(page, cdp, line(170, y, 250, y, 16)); await page.waitForTimeout(800); const s = await state(page);
      rec('unstar: same stroke on starred row', !s.starred[1] && !s.printed[1] && !s.nav.length && !s.live, s); await ctx.close(); }
    for (const d of [30, 60]) { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(170, y, 170 + d, y, 8)); await page.waitForTimeout(800); const s = await state(page);
      rec(`cancel: ${d}px finger then release`, same(s) && !s.nav.length && !s.live && s.tf[0] === '' && s.gesture === null, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, [...line(170, y, 250, y, 12), ...line(250, y, 190, y, 10).slice(1)]); await page.waitForTimeout(800); const s = await state(page);
      rec('cancel: past detent, back to 20px', same(s) && !s.live && !s.nav.length, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 1);
      await drag(page, cdp, [...line(170, y, 250, y, 12), ...line(250, y, 190, y, 10).slice(1)]); await page.waitForTimeout(800); const s = await state(page);
      rec('unstar cancel: past detent, back off -> still starred, printed', same(s) && s.printed[1] && !s.live, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 2);
      const st0 = await page.evaluate(() => document.getElementById('locationsList').scrollTop);
      await drag(page, cdp, line(200, y, 204, y - 150, 15)); await page.waitForTimeout(700); const s = await state(page);
      const st1 = await page.evaluate(() => document.getElementById('locationsList').scrollTop);
      rec('vertical scroll scrolls, never stars', st1 > st0 + 50 && same(s) && !s.nav.length && !s.live, { st0, st1 }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await T(cdp, 'touchStart', 200, y); await page.waitForTimeout(60); await T(cdp, 'touchEnd'); await page.waitForTimeout(100);
      const d = await page.evaluate(() => ({ nav: __nav, te: __te })); const delay = d.nav.length ? d.nav[0][1] - d.te[d.te.length - 1] : null;
      rec('tap navigates; touchend->highlightMarker < 16ms', d.nav.length === 1 && delay < 16, { delay }); results[results.length - 1].delayMs = delay; await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(200, y, 206, y + 2, 3)); await page.waitForTimeout(100); const s = await state(page);
      rec('sloppy 6px tap navigates', s.nav.length === 1 && same(s), s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(12, y, 110, y, 16)); await page.waitForTimeout(400); const s = await state(page);
      rec('start at x=12 never arms', same(s) && !s.live, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const d = await page.evaluate(() => { const r = document.querySelectorAll('#locationsList .delete-btn')[0].getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await drag(page, cdp, line(d.x, d.y, d.x - 90, d.y, 12)); await page.waitForTimeout(300); let s = await state(page); const a = !s.del.length && same(s) && !s.live;
      await drag(page, cdp, line(d.x - 120, d.y, d.x + 5, d.y, 12)); await page.waitForTimeout(800); s = await state(page);
      rec('drag from delete: nothing; drag ending on delete: stars, never deletes', a && !s.del.length && s.starred[0], s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(170, y, 216, y, 5), { stepMs: 8, synthTs: true }); await page.waitForTimeout(800); const s = await state(page);
      rec('flick 46px in 40ms STARS', s.starred[0] && !s.nav.length, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 1);
      await drag(page, cdp, line(170, y, 225, y, 5), { stepMs: 8, synthTs: true }); await page.waitForTimeout(800); const s = await state(page);
      rec('S5: flick 55px/40ms on a starred row does NOT unstar', s.starred[1] && s.printed[1] && !s.live, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(170, y, 250, y, 16), { end: 'touchCancel' }); await page.waitForTimeout(800); const s = await state(page);
      rec('touchcancel past detent reverts', same(s) && !s.live && s.tf[0] === '' && s.gesture === null, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(250, y, 150, y, 16)); await page.waitForTimeout(400); const s = await state(page);
      rec('drag LEFT is inert', same(s) && !s.live && !s.nav.length && s.gesture === null, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 1); let hs = [];
      await drag(page, cdp, line(170, y, 290, y, 12), { onStep: async () => { hs.push(...(await state(page)).heights); } }); await page.waitForTimeout(800);
      rec('rows 56.00px at every drag step', hs.every(h => h === 56), { uniq: [...new Set(hs)] }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 2);
      await drag(page, cdp, line(200, y, 200, y - 60, 6)); await page.waitForTimeout(600);
      const y3 = await Y(page, 3); await T(cdp, 'touchStart', 200, y3); await page.waitForTimeout(50); await T(cdp, 'touchEnd'); await page.waitForTimeout(100); const s = await state(page);
      rec('scroll, settle, tap: navigates', s.nav.length === 1, s); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 2);
      await drag(page, cdp, line(160, y, 220, y - 100, 12)); await page.waitForTimeout(600); const s = await state(page);
      rec('diagonal 60x/100y never stars', same(s) && !s.live && !s.nav.length, s); await ctx.close(); }
    // (R2-S1 now lives in flip6.js: frame-by-frame, with a negative control)
    // --- clearance: no graphite while the name is < 3px clear of the sketch
    for (const nm of ['Café Pascal', 'Järntorget', 'Ítalía']) { const { ctx, page } = await fresh();
      const r = await page.evaluate((nm) => { locations[0] = { ...locations[0], name: nm }; updateUI(); const el = document.querySelectorAll('#locationsList .location-card')[0];
        const m = mountPencilStar(el, locations[0]); const g = { ...m, starred: false, off: 0, armed: false, forward: true }; const pen = m.svg.querySelector('.sg-pencil').getBoundingClientRect();
        let minGap = 1e9, firstDrawn = null;
        for (let raw = 0; raw <= 56; raw += 0.5) { setSlip(g, raw); g.ps.draw(raw); const drawn = [...m.svg.querySelectorAll('.sg-rev')].some(l => parseFloat(l.getAttribute('stroke-dashoffset')) < parseFloat(l.dataset.l) - 0.01);
          if (drawn) { if (firstDrawn === null) firstDrawn = raw; minGap = Math.min(minGap, textLeft(m.h3) - pen.right); } }
        releaseStarRow(el, g, true); return { s0: m.strokes[0], firstDrawn, minGap: +minGap.toFixed(2) }; }, nm);
      rec(`clearance "${nm}": first graphite at content ${r.firstDrawn}, min gap ${r.minGap}px (>=3)`, r.minGap >= 3, r); await ctx.close(); }
    // --- honest rub-out: ghost present at 55, gone + dust exactly at 56; ghost never grainy-orange
    { const { ctx, page } = await fresh();
      const r = await page.evaluate(() => { const el = document.querySelectorAll('#locationsList .location-card')[1]; const m = mountPencilStar(el, locations[1]); const out = {};
        for (const raw of [5, 9, 10, 12, 44, 50, 55, 55.9, 56]) { m.ps.rub(raw); const gh = m.svg.querySelector('.sg-ghost'), inkg = m.svg.querySelector('.sg-inkg'), inkp = m.svg.querySelector('.sg-inkp');
          out[raw] = { ghost: +gh.getAttribute('opacity'), grain: +(inkg.style.opacity || 0), fill: inkp.style.fill }; }
        return out; });
      const noGrainBeforeGraphite = [5, 9].every(k => r[k].grain === 0) && r[10].grain === 0;
      rec('honest rub: ghost 0.25 held at 44-55.9, 0 at 56; no grain until 100% graphite', r[44].ghost === 0.25 && r[55.9].ghost === 0.25 && r[56].ghost === 0 && noGrainBeforeGraphite && r[12].grain > 0, r); await ctx.close(); }
    // --- S1 swallowed taps
    for (const [label, rowIdx, wait] of [['other row 0ms', 2, 0], ['other row 60ms', 2, 60], ['other row 150ms', 2, 150], ['same row 60ms', 0, 60], ['same row 150ms', 0, 150]]) {
      const { ctx, page, cdp } = await fresh(); const y = await Y(page, 0);
      await drag(page, cdp, line(170, y, 250, y, 16)); if (wait) await page.waitForTimeout(wait);
      const yy = await Y(page, rowIdx); await T(cdp, 'touchStart', 200, yy); await page.waitForTimeout(40); await T(cdp, 'touchEnd'); await page.waitForTimeout(500); const s = await state(page);
      rec(`S1: star, then tap ${label}: navigates`, s.nav.length === 1 && s.starred[0], s); await ctx.close(); }
    { const { ctx, page } = await fresh(); const y = await Y(page, 0);
      await page.mouse.move(170, y); await page.mouse.down(); for (let d = 4; d <= 80; d += 4) await page.mouse.move(170 + d, y); await page.mouse.up(); await page.waitForTimeout(60);
      const n0 = await page.evaluate(() => __nav.length); await page.mouse.click(200, await Y(page, 2)); await page.waitForTimeout(100);
      await page.mouse.click(200, await Y(page, 0)); await page.waitForTimeout(100); const s = await state(page);
      rec('S1 mouse: drag-star eats only its own click; next clicks navigate', n0 === 0 && s.nav.length === 2 && s.starred[0], { n0, s }); await ctx.close(); }
    // --- S3 diagonal matrix (100px drags up-right at angle from horizontal)
    for (const deg of [20, 25, 30, 33, 36, 40, 45, 50]) {
      let mainScroll = 0;
      { const m = await openProto(b, { reduced, dsf: 1, file: require('./lib').FILE }); const y = await Y(m.page, 3); const s0 = await m.page.evaluate(() => document.getElementById('locationsList').scrollTop);
        const a = deg * Math.PI / 180; await drag(m.page, m.cdp, line(150, y, 150 + 100 * Math.cos(a), y - 100 * Math.sin(a), 20), { stepMs: 10 }); await m.page.waitForTimeout(700);
        mainScroll = (await m.page.evaluate(() => document.getElementById('locationsList').scrollTop)) - s0; await m.ctx.close(); }
      const { ctx, page, cdp } = await fresh(); const y = await Y(page, 3); const st0 = await page.evaluate(() => document.getElementById('locationsList').scrollTop);
      const a = deg * Math.PI / 180; await drag(page, cdp, line(150, y, 150 + 100 * Math.cos(a), y - 100 * Math.sin(a), 20), { stepMs: 10 }); await page.waitForTimeout(700);
      const st1 = await page.evaluate(() => document.getElementById('locationsList').scrollTop); const s = await state(page);
      const scrolled = st1 - st0, starred = s.starred[3] !== ROWS[3].starred;
      // <=33deg: a star stroke (no scroll). >=36deg: never a star, and it scrolls at least as far as main does (Chromium's own scroll rails give main 0 at 36deg).
      const ok = deg <= 33 ? (starred && scrolled === 0) : (!starred && (mainScroll === 0 ? scrolled === 0 : scrolled >= mainScroll - 12));
      rec(`S3: ${deg}deg 100px drag -> ${starred ? 'star' : 'no star'}, scroll ${Math.round(scrolled)}px (main ${Math.round(mainScroll)}px)`, ok, { scrolled, starred, mainScroll }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const y = await Y(page, 3); const st0 = await page.evaluate(() => document.getElementById('locationsList').scrollTop);
      await drag(page, cdp, [...line(150, y, 162, y, 3), ...line(162, y, 164, y - 150, 15).slice(1)], { stepMs: 10 }); await page.waitForTimeout(700);
      const st1 = await page.evaluate(() => document.getElementById('locationsList').scrollTop); const s = await state(page);
      rec(`S3: 12px sideways then 150px up -> no star (scroll ${Math.round(st1 - st0)}px)`, same(s) && !s.live, { scrolled: st1 - st0 }); results[results.length - 1].scrolled = st1 - st0; await ctx.close(); }
    // --- S2 press delay (MutationObserver timings)
    { const r = await require('./s2')(b, reduced);
      rec(`S2: no press during a stroke; quick tap presses on release for ${r.quickDuration}ms; a still hold presses at ${Math.round(r.holdPressAt)}ms`, !r.strokePressed && r.quickOnAfterRelease !== null && r.quickOnAfterRelease < 16 && r.quickDuration >= 90 && r.holdPressAt >= 78 && r.holdPressAt < 140, r); }
    // --- S4 (p8 revision) popup -> row star replay: every time, both ways (replaces the 2-per-device teaching cap)
    { const { ctx, page } = await fresh();
      const r = await page.evaluate(async () => { let reads = 0; const gi = Storage.prototype.getItem; Storage.prototype.getItem = function (k) { if (k === 'triplet.pencilStarTaught') reads++; return gi.call(this, k); };
        const loc = locations[0], el = cardsById.get(loc.id).el; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI(); markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 300));
        const out = []; const o = ssReplay; let plays = 0; ssReplay = id => { const v = o(id); if (v) plays++; return v; };
        for (let k = 0; k < 4; k++) { const was = locations[0].starred, p0 = plays; document.querySelector('.leaflet-popup .popup-star').click(); await new Promise(r => setTimeout(r, 40));
          const held = starHeld.has(loc.id), live = !!el.querySelector('.sg-star'); await new Promise(r => setTimeout(r, 1100));
          out.push({ was, now: locations[0].starred, played: plays > p0, held, live, printed: !!el.querySelector('.row-main > .row-star'), liveAfter: !!el.querySelector('.sg-star, .sg-crumb'), heldAfter: starHeld.size }); }
        return { out, reads }; });
      const full = r.out.every((x, k) => x.now === !x.was && x.printed === x.now && !x.liveAfter && !x.heldAfter) && r.reads === 0;
      rec(reduced ? 'S4 (p8r, reduced): popup star/unstar x4 -> no replay, the state lands every time; teaching key never read' : 'S4 (p8r): popup star/unstar x4 -> the row replays EVERY time, both ways (pencil+ink / rub+dust); held while playing; ends in the right state; teaching key never read',
        full && r.out.every(x => reduced ? (!x.played && !x.live) : (x.played && x.held && x.live)), r); await ctx.close(); }
    { const { ctx, page } = await fresh();
      const r = await page.evaluate(async () => { const i = 7, loc = locations[i]; document.getElementById('locationsList').scrollTop = 0; const el = cardsById.get(loc.id).el, lr = document.getElementById('locationsList').getBoundingClientRect(), rr = el.getBoundingClientRect();
        const off = rr.top >= lr.bottom || rr.bottom <= lr.top; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI(); markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 300));
        const o = ssReplay; let played = null; ssReplay = id => (played = o(id)); document.querySelector('.leaflet-popup .popup-star').click(); await new Promise(r => setTimeout(r, 400));
        return { off, played, starred: locations[i].starred, printed: !!el.querySelector('.row-main > .row-star'), live: !!el.querySelector('.sg-star') }; });
      rec('S4 (p8r): row off screen -> no replay, the star just lands', r.off && r.played === false && r.starred && r.printed && !r.live, r); await ctx.close(); }
    // --- popup
    { const { ctx, page, errors } = await fresh();
      const out = await page.evaluate(async () => { const loc = locations[0]; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 100)); updateUI();
        markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 50));
        document.querySelector('.leaflet-popup .popup-star').click(); await new Promise(r => setTimeout(r, 30));
        const a = { starred: locations[0].starred, play: !!document.querySelector('.leaflet-popup .sgp.sgp-in'), pencil: !!document.querySelector('.leaflet-popup .sg-pencil, .leaflet-popup .sg-rev') };
        updateUI(); markersById.get(loc.id).marker.setPopupContent(buildPopupHtml(locations[0])); a.replay = !!document.querySelector('.leaflet-popup .sgp.sgp-in');
        document.querySelector('.leaflet-popup .popup-star').click(); await new Promise(r => setTimeout(r, 30)); a.out = !!document.querySelector('.leaflet-popup .sgp.sgp-out'); a.dust = !!document.querySelector('.leaflet-popup .sg-crumb, .leaflet-popup .sg-smudge');
        await new Promise(r => setTimeout(r, 400)); const f = document.querySelector('.leaflet-popup .sgp-fill');
        a.unstarred = !locations[0].starred; a.hollow = !!document.querySelector('.leaflet-popup .popup-star use[href="#g-star-open"]') && (!f || +getComputedStyle(f).opacity === 0);
        updateUI(); markersById.get(loc.id).marker.setPopupContent(buildPopupHtml(locations[0])); a.outReplay = !!document.querySelector('.leaflet-popup .sgp.sgp-out'); return a; }).catch(e => ({ err: e.message }));
      rec('popup (p8): 1 tap fades + pops the star once, no pencil (no replay); unstar fades off with the lift to hollow, no rub/dust (no replay)', out.starred && out.play && !out.pencil && !out.replay && out.out && !out.dust && out.unstarred && out.hollow && !out.outReplay && !errors.length, { out, errors }); await ctx.close(); }
    // --- N3 shape give
    { const { ctx, page, cdp } = await fresh();
      await page.evaluate(() => { syncShapeCards = window.__realSync || syncShapeCards; });
      const has = await page.evaluate(() => document.querySelectorAll('#locationsList .location-card[data-shape-id]').length);
      if (has) { const r = await page.evaluate(() => { const e = document.querySelector('#locationsList .location-card[data-shape-id]'); const L = document.getElementById('locationsList'); L.scrollTop = L.scrollHeight; const q = e.getBoundingClientRect(); return { y: q.y + q.height / 2 }; /* scroll the list itself: scrollIntoView() also scrolls ancestors under the absolute sheet layout */ });
        let maxT = 0; await drag(page, cdp, line(170, r.y, 260, r.y, 15), { onStep: async () => { const t = await page.evaluate(() => { const m = document.querySelector('#locationsList .location-card[data-shape-id] .row-main').style.transform; return parseFloat((m || '').slice(11)) || 0; }); maxT = Math.max(maxT, t); } });
        await page.waitForTimeout(300); const end = await page.evaluate(() => document.querySelector('#locationsList .location-card[data-shape-id] .row-main').style.transform);
        rec('N3: shape row stroke gives <=6px and springs back', maxT > 0 && maxT <= 6 && !end, { maxT, end }); }
      else rec('N3: shape row present', false, {}); await ctx.close(); }
  }
  fs.writeFileSync(require('./lib').outPath('star-touch.json'), JSON.stringify(results, null, 1));
  console.log(results.filter(r => r.pass).length + '/' + results.length); await b.close(); process.exitCode = results.every(r => r.pass) ? 0 : 1;
})();
