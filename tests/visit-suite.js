// Swipe-LEFT visit stamp: visit cases + delete-safety cases, both motion modes. env PROTO (path), OUT.
const L = require('./lib'); const fs = require('fs');
const FILE = L.FILE;
const VAR = 'W';
const results = []; let pass = 0, total = 0;
const ok = (mode, name, cond, info) => { total++; if (cond) pass++; results.push({ mode, name, pass: !!cond, info }); console.log(`${mode.padEnd(8)} ${cond ? 'PASS' : 'FAIL'} ${name} ${info ? JSON.stringify(info) : ''}`); };
const W = ms => new Promise(r => setTimeout(r, ms));
async function geo(page, idx) { await page.evaluate(i => { const el = document.querySelectorAll('#locationsList .location-card')[i]; const l = document.getElementById('locationsList'); const r = el.getBoundingClientRect(), lr = l.getBoundingClientRect(); if (r.top < lr.top || r.bottom > lr.bottom - 4) l.scrollTop += r.top - lr.top - 60; }, idx); await W(120); return page.evaluate(i => { const el = document.querySelectorAll('#locationsList .location-card')[i]; const r = el.getBoundingClientRect(), x = el.querySelector('.delete-btn').getBoundingClientRect();
  return { y: r.y + r.height / 2, xc: x.x + x.width / 2, xl: x.x, mid: r.x + r.width / 2, id: el.dataset.id }; }, idx); }
const st = (page, id) => page.evaluate(id => { const l = locations.find(x => x.id === id); const el = document.querySelector(`.location-card[data-id="${id}"]`);
  return { visited: l.visited, starred: l.starred, field: el.classList.contains('is-visited'), stamps: el.querySelectorAll('.row-stamp').length, carry: el.querySelectorAll('.vs-carry').length,
    live: el.classList.contains('vs-live') || el.classList.contains('vs-settle'), xhide: el.classList.contains('vs-xhide'), del: __del.length, nav: __nav.length, held: starHeld.size, star: !!el.querySelector('.row-star') }; }, id);
const left = (g, dist, n, dy = 0) => L.line(g.xc, g.y, g.xc - dist, g.y + dy, n);
(async () => { const b = await L.launch();
  for (const reduced of [false, true]) { const mode = reduced ? 'reduced' : 'full';
    const fresh = async () => { const o = await L.openProto(b, { dsf: 1, file: FILE, reduced }); await o.page.evaluate(() => { window.__vib = []; Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: p => { __vib.push(JSON.stringify(p)); return true; } }); }); return o; };
    // ---- VISIT CASES ----
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      await L.drag(page, cdp, left(g, 110, 12)); await W(700); const s = await st(page, g.id);
      ok(mode, 'V1 left stroke from the X visits: stamp in flow, field on, X back, 0 deletes/navs', s.visited && s.field && s.stamps === 1 && !s.carry && !s.live && !s.xhide && !s.del && !s.nav && !s.held, s);
      const vib = await page.evaluate(() => __vib); ok(mode, 'V1b haptic: one ink tick on the press', vib.length === 1 && vib[0] === '10', vib);
      await L.drag(page, cdp, left(g, 110, 12)); await W(700); const s2 = await st(page, g.id);
      ok(mode, 'V2 same stroke on the visited row un-visits: stamp gone, field off, 0 deletes', !s2.visited && !s2.field && !s2.stamps && !s2.del && !s2.nav && !s2.live, s2);
      const vib2 = await page.evaluate(() => __vib); ok(mode, 'V2b haptic: erase double tick on the lift', vib2.length === 2 && vib2[1] === '[6,45,6]', vib2);
      await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      await L.drag(page, cdp, left(g, 50, 6)); await W(500); const s = await st(page, g.id);
      ok(mode, 'V3 released before 56: nothing inked, stamp gone, X back, row clean', !s.visited && !s.field && !s.carry && !s.stamps && !s.xhide && !s.live && !s.del && !s.nav, s);
      await L.drag(page, cdp, [...left(g, 100, 10), ...L.line(g.xc - 100, g.y, g.xc - 30, g.y, 6)]); await W(500); const s2 = await st(page, g.id);
      ok(mode, 'V4 press then back off below 52: lifts again, nothing visited', !s2.visited && !s2.field && !s2.carry && !s2.live, s2);
      await L.drag(page, cdp, left(g, 58, 3), { stepMs: 16, synthTs: true }); await W(700); const s3 = await st(page, g.id);
      ok(mode, 'V5 quick flick (~48px content, 1.2px/ms) visits', s3.visited && s3.field && s3.stamps === 1 && !s3.live, s3);
      await L.drag(page, cdp, left(g, 58, 3), { stepMs: 16, synthTs: true }); await W(600); const s4 = await st(page, g.id);
      ok(mode, 'V6 the same flick on a visited row does NOT un-visit', s4.visited && s4.stamps === 1 && !s4.live, s4);
      await ctx.close(); }
    // V7: a pressed impression never moves (overtravel to 150px), + V8 hand-off identical to the rendered stamp
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0); const rects = [];
      await L.drag(page, cdp, left(g, 150, 18), { hold: 350, onStep: async (i) => { if (i >= 9) rects.push(await page.evaluate(() => { const s = document.querySelector('.vs-carry'); if (!s) return null; const r = s.getBoundingClientRect();
        return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, w: r.width, pressed: !s.classList.contains('vs-open') }; })); } });
      const pr = rects.filter(r => r && r.pressed); const dx = Math.max(...pr.map(r => r.cx)) - Math.min(...pr.map(r => r.cx)), dy = Math.max(...pr.map(r => r.cy)) - Math.min(...pr.map(r => r.cy));
      ok(mode, 'V7 pressed impression never moves on overtravel to 150px (centre drift)', pr.length >= 6 && dx < 0.01 && dy < 0.6, { frames: pr.length, dx: +dx.toFixed(3), dy: +dy.toFixed(3) });
      await ctx.close(); }
    if (!reduced) { const { ctx, page, cdp } = await L.openProto(b, { dsf: 3, file: FILE }); const g = await geo(page, 0); let shotA;
      const clip = await page.evaluate(() => { const x = document.querySelectorAll('#locationsList .location-card')[0].querySelector('.delete-btn').getBoundingClientRect(); return { x: x.x - 90, y: x.y - 14, width: 82, height: 56 }; });
      await L.drag(page, cdp, left(g, 110, 12), { hold: 500, onStep: async (i) => { if (i === 12) { await W(420); shotA = await page.screenshot({ clip }); } } }); await W(800);
      const shotB = await page.screenshot({ clip });
      const diff = await page.evaluate(async ([a, b]) => { const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
        const [ia, ib] = await Promise.all([load(a), load(b)]); const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height; const x = c.getContext('2d');
        x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, c.width, c.height).data; x.clearRect(0, 0, c.width, c.height); x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, c.width, c.height).data;
        let n = 0, mx = 0; for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])); mx = Math.max(mx, d); if (d > 2) n++; } return { px: da.length / 4, differing: n, max: mx }; }, [shotA.toString('base64'), shotB.toString('base64')]);
      fs.writeFileSync(L.outPath('v8-A.png'), shotA); fs.writeFileSync(L.outPath('v8-B.png'), shotB);
      ok(mode, 'V8 hand-off: pressed stamp == rendered stamp (3x, per-place tilt kept)', diff.differing === 0, diff);
      await ctx.close(); }
    // V9 starred + visited row: both marks coexist; visit & star gestures on the same row
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 1);
      await L.drag(page, cdp, left(g, 110, 12)); await W(700); const s = await st(page, g.id);
      ok(mode, 'V9 starred+visited row: left stroke un-visits, star kept', !s.visited && s.starred && s.star && !s.stamps && !s.live, s);
      await L.drag(page, cdp, left(g, 110, 12)); await W(700); const s2 = await st(page, g.id);
      ok(mode, 'V9b ...and visits again, star kept', s2.visited && s2.starred && s2.star && s2.stamps === 1, s2);
      await L.drag(page, cdp, L.line(g.mid - 100, g.y, g.mid + 10, g.y, 12)); await W(1400); const s3 = await st(page, g.id);
      ok(mode, 'V9c right stroke on the same row unstars; stamp + field kept', s3.visited && !s3.starred && !s3.star && s3.stamps === 1 && s3.field, s3);
      await L.drag(page, cdp, L.line(g.mid - 100, g.y, g.mid + 10, g.y, 12)); await W(1400); await L.drag(page, cdp, left(g, 110, 12)); await W(700); const s4 = await st(page, g.id);
      ok(mode, 'V9d star, then un-visit: star kept, stamp gone', !s4.visited && s4.starred && s4.star && !s4.stamps, s4);
      await ctx.close(); }
    // V10 rapid strokes: visit row 0, then immediately row 5 -> both land (fast-forward)
    { const { ctx, page, cdp } = await fresh(); const a = await geo(page, 5), c = await geo(page, 7);
      await L.drag(page, cdp, left(a, 110, 8)); await L.drag(page, cdp, left(c, 110, 8)); await W(800); const sa = await st(page, a.id), sc = await st(page, c.id);
      ok(mode, 'V10 two quick visit strokes: both land, nothing stuck', sa.visited && sc.visited && sa.stamps === 1 && sc.stamps === 1 && !sa.live && !sc.live && !sc.held, { sa, sc });
      await L.drag(page, cdp, left(a, 110, 8)); await L.drag(page, cdp, L.line(c.mid - 100, c.y, c.mid + 10, c.y, 8)); await W(1400); const sa2 = await st(page, a.id), sc2 = await st(page, c.id);
      ok(mode, 'V10b un-visit then an immediate star stroke on another row: both land', !sa2.visited && sc2.starred && !sa2.live && !sa2.held, { sa2, sc2 });
      await ctx.close(); }
    // V11 tap right after a visit stroke navigates; V12 tap delay unchanged
    { const { ctx, page, cdp } = await fresh(); const a = await geo(page, 5), c = await geo(page, 6);
      await L.drag(page, cdp, left(a, 110, 8)); await L.T(cdp, 'touchStart', c.mid, c.y); await W(40); await L.T(cdp, 'touchEnd'); await W(300);
      const n = await page.evaluate(() => __nav.map(x => x[0])); ok(mode, 'V11 tap on another row right after a visit stroke navigates', n.length === 1 && n[0] === c.id, n);
      const d = await page.evaluate(() => __nav[0][1] - __te[__te.length - 1]); ok(mode, 'V12 tap delay: 0ms added (touchend -> navigate)', d < 8, { ms: +d.toFixed(2) });
      await ctx.close(); }
    // V13 before the commit NOTHING moves: the stamp sits at its slot, tilt, scale 1; only the track, swept by travel; ring hidden
    // V14 text never under the stamp's ink (analytic ellipse of the ring/track, incl. the pop), long name
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 5); const samp = [];
      await page.evaluate(() => { const el = document.querySelectorAll('#locationsList .location-card')[5]; window.__vf = []; let run = true;
        const tick = () => { if (!run) return; const s = el.querySelector('.vs-carry'); if (s) { const m = new DOMMatrix(getComputedStyle(s).transform), sr = s.getBoundingClientRect(), main = el.querySelector('.row-main'), mr = main.getBoundingClientRect();
          const edge = parseFloat(main.style.getPropertyValue('--vs-edge')), a = parseFloat(main.style.getPropertyValue('--vs-a')); const textVisRight = mr.left + (isNaN(a) || a > 0.01 || isNaN(edge) ? mr.width : edge);
          const cx = sr.x + sr.width / 2, hw = Math.sqrt((36 * m.a) ** 2 + (16 * m.c) ** 2);
          __vf.push({ scale: Math.hypot(m.a, m.b), rot: Math.atan2(m.b, m.a) * 180 / Math.PI, cx: +cx.toFixed(3), cy: +(sr.y + sr.height / 2).toFixed(3), sweep: parseFloat(s.style.getPropertyValue('--vs-sweep') || 0), q: s.__vsQ, coreS: (() => { const rv = s.querySelector('.vs-rv-core'); return rv ? new DOMMatrix(getComputedStyle(rv).transform).a : 0; })(),
            coreFilter: (() => { const c = s.querySelector('.vs-rv-core .vs-copy'); return c ? getComputedStyle(c).filter : 'none'; })(),
            haloBlur: (() => { const c = s.querySelector('.vs-rv-halo .vs-copy'); return c ? getComputedStyle(c).filter : ''; })(),
            coreInk: (() => { const c = s.querySelector('.vs-rv-core .vs-copy'); return c ? getComputedStyle(c).color : ''; })(),
            op: parseFloat(s.style.opacity || 1), swept: s.classList.contains('vs-open'),
            ring: getComputedStyle(s.firstElementChild).visibility, track: getComputedStyle(s, '::before').visibility, word: getComputedStyle(s.querySelector('.row-stamp-word')).visibility, gap: (cx - hw) - textVisRight }); } requestAnimationFrame(tick); }; requestAnimationFrame(tick); window.__vstop = () => { run = false; }; });
      await L.drag(page, cdp, left(g, 110, 22), { hold: 450 });
      const f = await page.evaluate(() => { __vstop(); return __vf; }); const tilt = await page.evaluate(id => stampTilt(id), g.id);
      const pre = f.filter(x => x.swept), cxs = f.map(x => x.cx), cys = f.map(x => x.cy);
      const still = pre.every(x => Math.abs(x.scale - 1) < 1e-3 && Math.abs(x.rot - tilt) < 0.01);
      const vis = pre.filter(x => x.op > 0.01);
      const cr = await page.evaluate(cols => { const lum = c => { const d = document.createElement('div'); d.style.color = c; document.body.appendChild(d); const v = getComputedStyle(d).color; d.remove(); const n = v.match(/[\d.]+/g).map(Number); const rgb = v.startsWith('color(srgb') ? n.slice(0, 3) : v.startsWith('oklch') ? null : n.slice(0, 3).map(x => x / 255);
          if (!rgb) { const cv = document.createElement('canvas').getContext('2d'); cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); const px = cv.getImageData(0, 0, 1, 1).data; return lumRgb([px[0] / 255, px[1] / 255, px[2] / 255]); } return lumRgb(rgb); };
        const lumRgb = rgb => { const L = rgb.map(x => x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)); return 0.2126 * L[0] + 0.7152 * L[1] + 0.0722 * L[2]; };
        const bg = lum(getComputedStyle(document.documentElement).getPropertyValue('--paper').trim()); return cols.map(c => { const l = lum(c); return (Math.max(l, bg) + 0.05) / (Math.min(l, bg) + 0.05); }); }, [...new Set(vis.map(x => x.coreInk))]);
      const soft = vis.every(x => x.coreFilter === 'none' && x.haloBlur === 'blur(1.4px)' && x.coreS * 18.2 < 32);   // the reveal's half-width never reaches the ring's end
      const blotFirst = vis.filter(x => x.q !== undefined && x.q < 0.24).every(x => x.coreS <= 0.1001);          // the core stays inside the blot until ~18px
      let mono = true; for (let i = 1; i < vis.length; i++) if (vis[i].coreS < vis[i - 1].coreS - 1e-4) mono = false;
      const drift = Math.max(Math.max(...cxs) - Math.min(...cxs), Math.max(...cys) - Math.min(...cys));
      ok(mode, 'V13 before the commit the ink BLEEDS: stamp never moves; the core stays inside the blot until ~18px; core crisp (no filter), halo blur constant 1.4px; the reveal never reaches the ring ends; spread monotonic; pre-commit ink <= 3:1',
        vis.length >= 5 && still && soft && blotFirst && mono && drift < 0.01 && Math.max(...cr) <= 3.0, { visibleFrames: vis.length, coreScale: [vis[0] && +vis[0].coreS.toFixed(3), vis.length && +vis[vis.length - 1].coreS.toFixed(3)], maxContrast: +Math.max(...cr).toFixed(2), centreDrift: +drift.toFixed(3) });
      const minGap = Math.min(...f.filter(x => !x.swept || x.sweep > 0).map(x => x.gap));
      ok(mode, 'V14 ink never over text: visible text >= 4px clear of the stamp\'s ink ellipse on every frame (incl. the pop peak)', minGap >= 4, { frames: f.length, minGap: +minGap.toFixed(2) });
      await W(500); await ctx.close(); }
    // V15 letters never change at full ink across the final swap (visit + un-visit, long name, 3x)
    if (!reduced) for (const [idx, what] of [[5, 'visit'], [2, 'un-visit']]) { const { ctx, page, cdp } = await L.openProto(b, { dsf: 3, file: FILE }); const g = await geo(page, idx); let A, clip;
      await L.drag(page, cdp, left(g, 110, 12), { hold: 400, onStep: async (i) => { if (i === 12) { await W(380); clip = await page.evaluate(i => { const el = document.querySelectorAll('#locationsList .location-card')[i], m = el.querySelector('.row-main'), r = m.getBoundingClientRect();
        const e = parseFloat(m.style.getPropertyValue('--vs-edge')); const a = parseFloat(m.style.getPropertyValue('--vs-a')); const right = r.left + (a > 0.99 ? r.width : e - 20); return { x: r.left, y: r.top, width: Math.floor(right - r.left) - 1, height: r.height }; }, idx); A = await page.screenshot({ clip }); } } });
      await W(900); const B = await page.screenshot({ clip });
      const diff = await page.evaluate(async ([a, b]) => { const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
        const [ia, ib] = await Promise.all([load(a), load(b)]); const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height; const x = c.getContext('2d');
        x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, c.width, c.height).data; x.clearRect(0, 0, c.width, c.height); x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, c.width, c.height).data;
        let n = 0; for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])); if (d > 2) n++; } return { px: da.length / 4, differing: n }; }, [A.toString('base64'), B.toString('base64')]);
      ok(mode, `V15 ${what}: every letter at full ink before release is pixel-identical after the final layout`, diff.differing === 0, { ...diff, clipW: clip.width });
      await ctx.close(); }
    // V18: glyphs/ellipsis change only on the press/lift frame (visit) or under the sweep (un-visit). Long names.
    for (const [idx, what, pts] of [[5, 'visit', g => left(g, 110, 22)], [5, 'press then back off', g => [...left(g, 110, 14), ...L.line(g.xc - 110, g.y, g.xc - 40, g.y, 8)]], [2, 'un-visit', g => left(g, 110, 22)]]) {
      const { ctx, page, cdp } = await fresh(); const g = await geo(page, idx);
      await page.evaluate(i => { const el = document.querySelectorAll('#locationsList .location-card')[i]; window.__gf = []; let prev = null, run = true;
        const tick = () => { if (!run) return; const h3 = el.querySelector('h3'), c = el.querySelector('.vs-carry'); const w = h3.getBoundingClientRect().width;
          const pressed = !!c && !c.classList.contains('vs-open'); const settle = el.classList.contains('vs-settle'); const lifted = el.classList.contains('vs-live') && !el.classList.contains('is-visited') && !c;
          __gf.push({ w: +w.toFixed(2), pressed, settle, vis: el.classList.contains('is-visited') }); requestAnimationFrame(tick); }; requestAnimationFrame(tick); window.__gstop = () => { run = false; }; }, idx);
      await L.drag(page, cdp, pts(g)); await W(700); const f = await page.evaluate(() => { __gstop(); return __gf; });
      let bad = 0, changes = 0; for (let i = 1; i < f.length; i++) if (f[i].w !== f[i - 1].w) { changes++; const ok2 = f[i].pressed !== f[i - 1].pressed || f[i].vis !== f[i - 1].vis || f[i].settle || f[i - 1].settle; if (!ok2) bad++; }
      ok(mode, `V18 ${what}: truncation changes only on the press/lift frame or under the sweep (0 still-frame changes)`, bad === 0, { changes, stillFrameChanges: bad }); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      await page.evaluate(() => { const el = document.querySelectorAll('#locationsList .location-card')[0]; window.__xf = []; let run = true;
        const tick = () => { if (!run) return; const c = el.querySelector('.vs-carry'), x = el.querySelector('.delete-btn'); if (c && x) { const xo = parseFloat(getComputedStyle(x).opacity); __xf.push({ xo, over: c.getBoundingClientRect().right - x.getBoundingClientRect().left }); } requestAnimationFrame(tick); };
        requestAnimationFrame(tick); window.__xstop = () => { run = false; }; });
      await L.drag(page, cdp, left(g, 110, 12)); await W(600); const f = await page.evaluate(() => { __xstop(); return __xf; });
      const both = f.filter(x => x.xo > 0.01); const worst = both.length ? Math.max(...both.map(x => x.over)) : -99;
      ok(mode, 'V19 the stamp (incl. its pop peak) never reaches the X while the X is visible', worst <= 0, { framesXVisible: both.length, worstOverlapPx: +worst.toFixed(2) }); await ctx.close(); }
    // V16 popup Mark Visited: the non-gesture path; row tint + stamp in sync
    { const { ctx, page } = await fresh(); const r = await page.evaluate(async () => { const loc = locations[0]; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI();
        markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 300)); document.querySelector('.leaflet-popup .popup-visited').click(); await new Promise(r => setTimeout(r, 900));
        const el = document.querySelector(`.location-card[data-id="${loc.id}"]`); return { visited: loc.visited || locations[0].visited, field: el.classList.contains('is-visited'), stamps: el.querySelectorAll('.row-stamp').length }; });
      ok(mode, 'V16 popup Mark Visited still visits; row field + stamp in sync', r.visited && r.field && r.stamps === 1, r); await ctx.close(); }
    // V17 the stamp's pop at real timing: >= 6 frames within 0.05 of the 1.2x peak, >= 3 at <= 0.97, peak <= 1.2, rests at the place's tilt
    //      (reduced: no pop -- scale 1 on every frame after the press)
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      await page.evaluate(() => { window.__f = []; const tick = () => { const s = document.querySelectorAll('#locationsList .location-card')[0].querySelector('.row-stamp'); if (s) { const m = new DOMMatrix(getComputedStyle(s).transform); __f.push({ t: performance.now(), sc: Math.hypot(m.a, m.b), rot: Math.atan2(m.b, m.a) * 180 / Math.PI, sw: s.classList.contains('vs-open') }); } if (__f.length < 600) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
      await L.drag(page, cdp, left(g, 110, 12), { hold: 500 }); await W(200);
      const f = await page.evaluate(() => __f); const tilt = await page.evaluate(id => stampTilt(id), g.id); const i = f.findIndex(x => !x.sw); const after = f.slice(i);
      const peak = Math.max(...after.map(x => x.sc)), nearPeak = after.filter(x => x.sc >= 1.07).length, under = after.filter(x => x.sc <= 0.985).length, rest = after[after.length - 1];
      ok(mode, reduced ? 'V17 (reduced) the press appears: no pop, scale 1 and the place\'s tilt on every frame' : 'V17 pop at real timing (p8: peak 1.10): >= 6 frames >= 1.07x, >= 2 frames <= 0.985, peak <= 1.10, rests at the place\'s tilt',
        reduced ? after.every(x => Math.abs(x.sc - 1) < 1e-3 && Math.abs(x.rot - tilt) < 0.01) : (nearPeak >= 6 && under >= 2 && peak <= 1.1001 && Math.abs(rest.rot - tilt) < 0.01 && Math.abs(rest.sc - 1) < 1e-3),
        { nearPeak, under, peak: +peak.toFixed(4), restRot: +rest.rot.toFixed(3), tilt });
      await ctx.close(); }
    // V20 un-visit: the star's erase pop at the lock (1.12x, no twist); none under reduced motion. V21 cancel: nothing left behind.
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 2);
      await page.evaluate(() => { window.__u = []; const el = document.querySelectorAll('#locationsList .location-card')[2]; const tick = () => { const s = el.querySelector('.row-stamp'); if (s) { const m = new DOMMatrix(getComputedStyle(s).transform); __u.push({ sc: Math.hypot(m.a, m.b), rot: Math.atan2(m.b, m.a) * 180 / Math.PI }); } if (__u.length < 300) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
      await L.drag(page, cdp, left(g, 40, 6), { onStep: async i => { if (i === 3) globalThis.__ringVis = await page.evaluate(() => getComputedStyle(document.querySelectorAll('#locationsList .location-card')[2].querySelector('.row-stamp-ring')).visibility); } }); await W(500); const u = await page.evaluate(() => __u); const tilt = await page.evaluate(id => stampTilt(id), g.id); const s1 = await st(page, g.id);
      const peak = Math.max(...u.map(x => x.sc)), twist = Math.max(...u.map(x => Math.abs(x.rot - tilt)));
      ok(mode, reduced ? 'V20 (reduced) un-visit lift: no pop' : 'V20 un-visit lifts with the star\'s erase pop: peak 1.12x, no twist', reduced ? peak < 1.001 : (Math.abs(peak - 1.12) < 0.01 && twist < 0.01), { peak: +peak.toFixed(4), twist: +twist.toFixed(3) });
      ok(mode, 'V20b un-visit: ring + word stay visible while the stamp thins (only the track sweeps out)', globalThis.__ringVis === 'visible', { ring: globalThis.__ringVis });
      ok(mode, 'V21 un-visit let go at 40px: still visited, stamp back at full ink, track whole, row clean', s1.visited && s1.field && s1.stamps === 1 && !s1.live, s1);
      const g0 = await geo(page, 0); await L.drag(page, cdp, left(g0, 50, 6)); await W(500); const s0 = await st(page, g0.id);
      const sw = await page.evaluate(() => document.querySelectorAll('.vs-open').length);
      ok(mode, 'V21b visit let go at 40px: nothing inked, no stamp or partial track left, X back', !s0.visited && !s0.stamps && !s0.carry && !s0.live && !s0.xhide && sw === 0, { ...s0, sweeps: sw });
      await ctx.close(); }
    // V22 (P3-N1) un-visit ghost: light navy at full opacity, oklch chroma >= 0.04 on every frame until it's gone
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 2);
      await page.evaluate(() => { window.__gc = []; const el = document.querySelectorAll('#locationsList .location-card')[2]; let run = true;
        const lin = c => (c /= 255) <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        const okc = ([r, g2, b]) => { const o = okc0([r, g2, b]); return o; }; const okc0 = ([r, g2, b]) => { [r, g2, b] = [r, g2, b].map(lin); let l = 0.4122214708 * r + 0.5363325363 * g2 + 0.0514459929 * b, m = 0.2119034982 * r + 0.6806995451 * g2 + 0.1073969566 * b, q = 0.0883024619 * r + 0.2817188376 * g2 + 0.6299787005 * b; [l, m, q] = [l, m, q].map(Math.cbrt);
          const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * q, bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * q; return { L: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * q, C: Math.hypot(a, bb), h: (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360 }; };
        const bg = () => getComputedStyle(el).backgroundColor.match(/[\d.]+/g).map(Number);
        const tick = () => { if (!run) return; const s = el.querySelector('.row-stamp'); if (s && el.classList.contains('vs-live')) { const cs = getComputedStyle(s); const v = cs.color; const n = v.match(/[\d.]+/g).map(Number);
          let rgb, a; if (v.startsWith('color(srgb')) { rgb = n.slice(0, 3).map(x => x * 255); a = n.length > 3 ? n[3] : 1; } else if (v.startsWith('oklch')) { a = 1; rgb = null; __gc.push({ L: n[0], C: n[1], h: n[2], op: parseFloat(cs.opacity) }); } else { rgb = n.slice(0, 3); a = n.length > 3 ? n[3] : 1; }
          if (rgb) { const b = bg(), o = parseFloat(cs.opacity) * a; const comp = rgb.map((x, i) => o * x + (1 - o) * b[i]); const c = okc(comp); __gc.push({ L: c.L, C: c.C, h: c.h, op: parseFloat(cs.opacity) }); } }
          requestAnimationFrame(tick); }; requestAnimationFrame(tick); window.__gstop2 = () => { run = false; }; });
      await L.drag(page, cdp, left(g, 110, 22)); await W(600); const all = await page.evaluate(() => { __gstop2(); return __gc.filter(x => x.op > 0.01); });
      let lMono = true; for (let i = 1; i < all.length; i++) if (all[i].L < all[i - 1].L - 1e-3) lMono = false;   // P5-S2: never darker
      const f = all;
      const minC = Math.min(...f.map(x => x.C)), hues = f.map(x => x.h);
      ok(mode, 'V22 (P3-N1 + P5-S2) un-visit ghost starts AT the resting ink (L 0.401) and only pales: L never drops on any frame, chroma never below the rest (>= 0.033), hue held', f.length >= 5 && minC >= 0.033 && lMono && Math.abs(all[0].L - 0.401) < 0.01, { restL: all[0] && +all[0].L.toFixed(3), lastL: +all[all.length - 1].L.toFixed(3), lMonotonic: lMono, frames: f.length, minChroma: +minC.toFixed(4), hue: [+Math.min(...hues).toFixed(1), +Math.max(...hues).toFixed(1)] });
      await ctx.close(); }
    // V23 (P6-N1) no repaint-driving writes mid-drag: between the lock and the press, the stamp's subtree sees 0 class changes,
    //      and every inline style write is a transform or an opacity (compositor-only)
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 5);
      await page.evaluate(() => { window.__mo = { cls: 0, other: [], writes: 0, mainWrites: 0 }; const list = document.getElementById('locationsList');
        document.addEventListener('touchend', () => { __mo.up = true; }, true); const mo = new MutationObserver(ms => ms.forEach(m => { if (__mo.up) return; const t = m.target; if (t.classList && t.classList.contains('row-main') && m.attributeName === 'style' && t.closest('.vs-live')) __mo.mainWrites++; const st = t.closest && t.closest('.vs-carry'); if (!st || !st.classList.contains('vs-open')) return;
          if (m.attributeName === 'class' && t !== st) __mo.cls++;
          if (m.attributeName === 'class' && t === st && !String(m.oldValue).includes('vs-open') === false && st.className !== m.oldValue) __mo.cls++;
          if (m.attributeName === 'style') { __mo.writes++; const props = [...t.style].filter(k => !/^(transform|opacity)$/.test(k) && !/^--vs-ink-|^--stamp-tilt$/.test(k)); if (props.length) __mo.other.push(props.join(',')); } }));
        mo.observe(list, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class', 'style'] }); window.__mostop = () => mo.disconnect(); });
      await L.drag(page, cdp, left(g, 60, 20)); await W(400); const m = await page.evaluate(() => { __mostop(); return __mo; });
      ok(mode, 'V23 (P6-N1) mid-drag, the bleed only writes transforms and opacities (0 class changes, 0 other style properties), and the name feather is only written while it pulls in (0..6px)', m.cls === 0 && m.other.length === 0 && m.writes > 10 && m.mainWrites <= 8, { classChanges: m.cls, otherProps: [...new Set(m.other)].slice(0, 5), styleWrites: m.writes, featherWrites: m.mainWrites });
      await ctx.close(); }
    // V24-V29: popup Mark Visited / Unmark replays the stamp on the on-screen list row
    const pop = async (page, idx) => page.evaluate(async i => { const loc = locations[i]; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI();
      markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 300)); }, idx);
    const watch = (page, idx) => page.evaluate(i => { const el = document.querySelectorAll('#locationsList .location-card')[i]; window.__rp = { f: [], vib: 0 };
      Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: () => { __rp.vib++; return true; } });
      let run = true; const tick = () => { if (!run) return; const s = el.querySelector('.row-stamp'), h3 = el.querySelector('h3'); let sc = 1, rot = null;
        if (s) { const m = new DOMMatrix(getComputedStyle(s).transform); sc = Math.hypot(m.a, m.b); rot = Math.atan2(m.b, m.a) * 180 / Math.PI; }
        __rp.f.push({ sc, rot, open: !!(s && s.classList.contains('vs-open')), live: el.classList.contains('vs-live') || el.classList.contains('vs-settle'), vis: el.classList.contains('is-visited'), settle: el.classList.contains('vs-settle'), w: +h3.getBoundingClientRect().width.toFixed(2) });
        requestAnimationFrame(tick); }; requestAnimationFrame(tick); window.__rpstop = () => { run = false; return __rp; }; }, idx);
    const clickVisited = page => page.evaluate(() => document.querySelector('.leaflet-popup .popup-visited').click());
    const glyphBad = f => { let bad = 0; for (let i = 1; i < f.length; i++) if (f[i].w !== f[i - 1].w && !(f[i].vis !== f[i - 1].vis || f[i].open !== f[i - 1].open || f[i].settle || f[i - 1].settle)) bad++; return bad; };
    { const { ctx, page } = await fresh(); const g = await geo(page, 5); await pop(page, 5); await geo(page, 5); await watch(page, 5);
      await clickVisited(page); await W(150); await page.evaluate(() => updateUI()); await W(700);   // a re-render mid-replay must not cut it short or replay it
      const f = await page.evaluate(() => __rpstop()); const s = await st(page, g.id);
      const openF = f.f.filter(x => x.open).length, peak = Math.max(...f.f.map(x => x.sc)); let presses = 0; for (let i = 1; i < f.f.length; i++) if (f.f[i].vis && !f.f[i - 1].vis) presses++;
      ok(mode, reduced ? 'V24 (reduced) popup Mark Visited: the state lands with no replay (no bleed, no scale/rotate)' : 'V24 popup Mark Visited replays on the row: bleed, then ONE press (field on the press frame) + the pop, survives a re-render mid-replay',
        s.visited && s.field && s.stamps === 1 && !s.live && !s.held && (reduced ? (openF === 0 && peak < 1.001) : (openF >= 5 && presses === 1 && peak > 1.08 && peak <= 1.1001)), { openFrames: openF, presses, peak: +peak.toFixed(3), vib: f.vib, ...s });
      ok(mode, 'V25 replay (visit) glyph rule: truncation changes only on the press frame or under the sweep; no haptic added', glyphBad(f.f) === 0 && f.vib === 0, { stillFrameChanges: glyphBad(f.f), vib: f.vib });
      await watch(page, 5); await clickVisited(page); await W(900); const u = await page.evaluate(() => __rpstop()); const s2 = await st(page, g.id);
      const upeak = Math.max(...u.f.map(x => x.sc)), twist = Math.max(...u.f.filter(x => x.rot !== null).map(x => Math.abs(x.rot - u.f.find(y => y.rot !== null).rot)));
      ok(mode, reduced ? 'V26 (reduced) popup Unmark: the state lands, no lift' : 'V26 popup Unmark replays the erase lift (1.12x, no twist) and pale-out on the row, then the reveal; glyphs only under the sweep',
        !s2.visited && !s2.field && !s2.stamps && !s2.live && !s2.held && glyphBad(u.f) === 0 && (reduced ? upeak < 1.001 : (Math.abs(upeak - 1.12) < 0.01 && twist < 0.01)), { peak: +upeak.toFixed(3), twist: +twist.toFixed(3), stillFrameChanges: glyphBad(u.f), ...s2 });
      await ctx.close(); }
    { const { ctx, page } = await fresh(); const g = await geo(page, 5); await pop(page, 5);
      await page.evaluate(() => { const l = document.getElementById('locationsList'); l.scrollTop = 0; }); await W(100);
      const off = await page.evaluate(i => { const el = document.querySelectorAll('#locationsList .location-card')[i], lr = document.getElementById('locationsList').getBoundingClientRect(), r = el.getBoundingClientRect(); return r.top >= lr.bottom || r.bottom <= lr.top; }, 5);
      await watch(page, 5); await clickVisited(page); await W(600); const f = await page.evaluate(() => __rpstop()); const s = await st(page, g.id);
      ok(mode, 'V27 row off screen: no replay (never live), the state just lands', off && s.visited && s.stamps === 1 && f.f.every(x => !x.live), { offScreen: off, liveFrames: f.f.filter(x => x.live).length, ...s });
      await ctx.close(); }
    { const { ctx, page } = await fresh(); const g = await geo(page, 5); await pop(page, 5); await geo(page, 5);
      for (const gap of [60, 90, 40]) { await clickVisited(page); await W(gap); }                                     // visit, unmark, visit -- fast
      await W(900); const s = await st(page, g.id); const leftovers = await page.evaluate(() => document.querySelectorAll('.vs-carry, .vs-open, .vs-live, .vs-settle, .vs-reserve').length);
      ok(mode, 'V28 rapid popup toggles (visit, unmark, visit within ~200ms): last wins, no stuck half-state', s.visited && s.field && s.stamps === 1 && !s.live && !s.held && leftovers === 0, { leftovers, ...s });
      await ctx.close(); }
    // V30-V32 (p8r): the popup STAR replays on the row both ways, with the visit replay's rules
    const clickStar = page => page.evaluate(() => document.querySelector('.leaflet-popup .popup-star').click());
    const sst = (page, id) => page.evaluate(id => { const l = locations.find(x => x.id === id), el = document.querySelector(`.location-card[data-id="${id}"]`); const h = el.querySelector('h3');
      return { starred: l.starred, printed: !!el.querySelector('.row-main > .row-star'), live: !!el.querySelector('.sg-star, .sg-crumb'), held: starHeld.size, sgLive: el.classList.contains('sg-live'), tx: h.style.transform || '', metaTx: el.querySelector('.row-meta').style.transform || '' }; }, id);
    { const { ctx, page } = await fresh(); const g = await geo(page, 5); await pop(page, 5); await geo(page, 5);
      const cnt = () => page.evaluate(() => { window.__ssn = 0; window.__ssf = 0; if (!window.__ssw) { window.__ssw = 1; const o = ssReplay; ssReplay = id => { const v = o(id); if (v) __ssn++; return v; }; }   /* wrap once */
        const el = document.querySelectorAll('#locationsList .location-card')[5]; let run = true; (function f() { if (!run) return; if (el.querySelector('.sg-star')) __ssf++; requestAnimationFrame(f); })(); window.__ssstop = () => { run = false; return { n: __ssn, f: __ssf }; }; });
      await cnt(); await clickStar(page); await W(200); await page.evaluate(() => { updateUI(); const l = locations[5]; markersById.get(l.id).marker.setPopupContent(buildPopupHtml(l)); }); await W(900);
      const a = await page.evaluate(() => __ssstop()); const s = await sst(page, g.id);
      ok(mode, reduced ? 'V30 (reduced) popup star: no replay on the row, the star just lands; a re-render changes nothing' : 'V30 popup star replays pencil+ink on the row ONCE, survives a re-render mid-replay (no cut, no second play), ends printed and clean',
        s.starred && s.printed && !s.live && !s.held && !s.sgLive && !s.tx && !s.metaTx && (reduced ? (a.n === 0 && a.f === 0) : (a.n === 1 && a.f >= 30)), { plays: a.n, liveFrames: a.f, ...s });
      await cnt(); await clickStar(page); await W(1100); const u = await page.evaluate(() => __ssstop()); const s2 = await sst(page, g.id);
      ok(mode, reduced ? 'V31 (reduced) popup unstar: no replay, the star just goes' : 'V31 popup unstar replays the rub + dust on the row, ends unstarred and clean',
        !s2.starred && !s2.printed && !s2.live && !s2.held && !s2.sgLive && !s2.tx && (reduced ? (u.n === 0 && u.f === 0) : (u.n === 1 && u.f >= 20)), { plays: u.n, liveFrames: u.f, ...s2 });
      await ctx.close(); }
    { const { ctx, page } = await fresh(); const g = await geo(page, 5); await pop(page, 5); await geo(page, 5);
      for (const gap of [60, 90, 40]) { await clickStar(page); await W(gap); }                                     // star, unstar, star -- fast
      await W(1200); const s = await sst(page, g.id);
      ok(mode, 'V32 rapid popup star toggles (star, unstar, star within ~200ms): last wins, no stuck half-state, no leftover overlay/dust/offset', s.starred && s.printed && !s.live && !s.held && !s.sgLive && !s.tx && !s.metaTx, s);
      await clickStar(page); await W(30); await clickVisited(page); await W(1300); const s2 = await sst(page, g.id); const v2 = await st(page, g.id);
      ok(mode, 'V32b popup unstar then Mark Visited on the same row within 30ms: both land, row clean', !s2.starred && !s2.printed && v2.visited && v2.field && v2.stamps === 1 && !s2.live && !s2.held && !v2.live && !s2.tx, { ...s2, visited: v2.visited, field: v2.field, stamps: v2.stamps });
      await ctx.close(); }
    // ---- DELETE SAFETY ----
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      const tapMove = async (dx) => { await L.T(cdp, 'touchStart', g.xc, g.y); await W(30); if (dx) { await L.T(cdp, 'touchMove', g.xc - dx / 2, g.y); await W(16); await L.T(cdp, 'touchMove', g.xc - dx, g.y); await W(30); } await L.T(cdp, 'touchEnd'); await W(250); return page.evaluate(() => __del.length); };
      let d = await tapMove(0); ok(mode, 'D1 still tap on the X deletes (confirm)', d === 1, { del: d });
      d = await tapMove(3); ok(mode, 'D2 tap with 3px of movement still deletes', d === 2, { del: d });
      for (const dist of [4, 6, 8, 12, 20, 40]) { const before = d; d = await tapMove(dist); const s = await st(page, g.id); ok(mode, `D3 hesitant ${dist}px left stroke from the X: no delete`, d === before && !s.visited, { del: d - before }); }
      { const before = d; await L.drag(page, cdp, L.line(g.xc - 10, g.y, g.xc + 5, g.y, 4)); await W(300); d = await page.evaluate(() => __del.length); const s = await st(page, g.id);
        ok(mode, 'D4 right stroke from the X: no delete, no star', d === before && !s.starred, { del: d - before }); }
      { const before = d; await L.drag(page, cdp, L.line(g.xc, g.y, g.xc, g.y - 60, 8)); await W(300); d = await page.evaluate(() => __del.length); ok(mode, 'D5 vertical drag from the X: no delete', d === before, { del: d - before }); }
      { const before = d; await L.drag(page, cdp, left(g, 110, 12)); await W(700); d = await page.evaluate(() => __del.length); ok(mode, 'D6 full visit stroke from the X: no delete', d === before, { del: d - before }); }
      // D7: taps on the X right after a stroke: never deletes while it's faded; deletes once it's back
      { const before = d; await L.drag(page, cdp, left(g, 110, 12)); await L.T(cdp, 'touchStart', g.xc, g.y); await W(30); await L.T(cdp, 'touchEnd'); await W(50);
        const d0 = await page.evaluate(() => __del.length); await W(800); await L.T(cdp, 'touchStart', g.xc, g.y); await W(30); await L.T(cdp, 'touchEnd'); await W(200); d = await page.evaluate(() => __del.length);
        ok(mode, 'D7 X tap at ~0ms after a stroke does not delete; once the X is back it does', d0 === before && d === before + 1, { at0: d0 - before, later: d - before }); }
      // D8 mouse: an 8px drag from the X doesn't delete; a still click does. D9 keyboard Enter on the X deletes.
      { const before = d; await page.mouse.move(g.xc, g.y); await page.mouse.down(); await page.mouse.move(g.xc - 8, g.y, { steps: 3 }); await page.mouse.up(); await W(200); const m1 = await page.evaluate(() => __del.length);
        await page.mouse.click(g.xc, g.y); await W(200); const m2 = await page.evaluate(() => __del.length);
        ok(mode, 'D8 mouse: 8px drag from the X no delete; still click deletes', m1 === before && m2 === before + 1, { drag: m1 - before, click: m2 - before }); d = m2; }
      { const before = d; await page.evaluate(() => document.querySelectorAll('#locationsList .location-card')[0].querySelector('.delete-btn').focus()); await page.keyboard.press('Enter'); await W(200); d = await page.evaluate(() => __del.length);
        ok(mode, 'D9 keyboard Enter on the X deletes', d === before + 1, { del: d - before }); }
      await ctx.close(); }
    // D10: Safari forward-swipe edge: a stroke starting within 24px of the right edge is inert
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0); await L.drag(page, cdp, L.line(372, g.y, 260, g.y, 12)); await W(500); const s = await st(page, g.id);
      ok(mode, 'D10 stroke from x=372 (inside EDGE 24) is inert: no visit, no delete', !s.visited && !s.del && !s.live, s); await ctx.close(); }
  }
  process.exitCode = pass === total ? 0 : 1; console.log(`${pass}/${total}`); fs.writeFileSync(L.outPath('visit-suite.json'), JSON.stringify(results, null, 1)); await b.close(); })();
