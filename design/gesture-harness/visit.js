// VISIT SUITE -- `vtest.js` of the gate. Re-implements design/swipe-visit/vtest.js
// (the committed p7 version: 49 cases full + 46 reduced = 95) on this harness, against
// the real index.html. Same case list and numbering. Cases whose behaviour was
// superseded after p7 assert the CURRENT code and are tagged:
//   [p8]       VISIT_POP peak 1.10x / dip 0.97 (was 1.2x / 0.95); popup Mark Visited
//              now also replays on the row.
//   [1ec21c2]  "Visit-swipe text now slides + FLIPs like the Pencil Star" (main,
//              2026-09-28, after p8; with 141dc42 badge slides, a74d390 printed star
//              slides, 8eaf8a3 stamp-to-X gap 12->4px). The --vs-edge/--vs-a mask wipe
//              is gone, so V14/V15/V18/V23 measure the slide instead of the wipe:
//              V14 text = the slid h3/meta glyphs; V15 = the documented "final
//              truncation lands on the press frame" read from the h3 itself; V18 = p7's
//              press/lift-frame rule OR the star's FLIP rule (flip.js judge); V23 =
//              text-side writes are transforms (+ the --sg-fade-a var) only.
//   [sticker]  The visited STICKER (2026-10-02, design/visited-system/; docs/shipped.md "Visited
//              sticker") replaced the dotted-track stamp and its ink bleed. Cases about the bleed /
//              the navy ghost re-assert the same intent on the sticker, thresholds unchanged:
//              V13 the pre-commit cue (hover: lifted, still, monotonic), V14 the same 4px text
//              clearance measured against the 72x24 oval with the carry's veil (the row field that
//              covers the name's tail under the sticker -- the role p7's mask wipe had), V17 the
//              press (1.12 -> 0.97 -> 1), V20b / V22 the un-visit peel (opacity only, ink held).
// Known failures on origin/main 9a53d71 (real, not harness): see README "Findings".
// p8's own vtest (113 cases) was never committed; its 18 extra cases are not known.
// FILE=<index.html> OUT=<json> node visit.js
const L = require('./lib'); const fs = require('fs'); const path = require('path');
const { rec, finish } = L.recorder('visit');
const W = L.W;
// A deliberate release short of 56 must not be a flick (>=32px content at >=0.5px/ms visits by design).
// The lost harness awaited every CDP touch event (~35-50ms each), so its "50px then release" ran at
// ~0.15px/ms; at a true 16ms cadence the same 50px is 0.52px/ms -- a flick. SLOW keeps these cases what
// their names say: 33ms/step, ~0.25px/ms.
const SLOW = 33;
const SHOTS = process.env.SHOTS || path.join(require('os').tmpdir(), 'gesture-harness-shots'); fs.mkdirSync(SHOTS, { recursive: true });
async function geo(page, idx) { await L.rowRect(page, idx); await W(120); return page.evaluate(i => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[i]; const r = el.getBoundingClientRect(), x = el.querySelector('.delete-btn').getBoundingClientRect();
  return { y: r.y + r.height / 2, xc: x.x + x.width / 2, xl: x.x, mid: r.x + r.width / 2, id: el.dataset.id }; }, idx); }
const st = (page, id) => page.evaluate(id => { const l = locations.find(x => x.id === id); const el = document.querySelector(`.location-card[data-id="${id}"]`);
  return { visited: l.visited, starred: l.starred, field: el.classList.contains('is-visited'), stamps: el.querySelectorAll('.row-stamp').length, carry: el.querySelectorAll('.vs-carry').length,
    live: el.classList.contains('vs-live'), xhide: el.classList.contains('vs-xhide'), del: __del.length, nav: __nav.length, held: starHeld.size, star: !!el.querySelector('.row-star') }; }, id);
const left = (g, dist, n, dy = 0) => L.line(g.xc, g.y, g.xc - dist, g.y + dy, n);
const imgDiff = (page, a, b) => page.evaluate(async ([a, b]) => { const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + s; });
  const [ia, ib] = await Promise.all([load(a), load(b)]); const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height; const x = c.getContext('2d');
  x.drawImage(ia, 0, 0); const da = x.getImageData(0, 0, c.width, c.height).data; x.clearRect(0, 0, c.width, c.height); x.drawImage(ib, 0, 0); const db = x.getImageData(0, 0, c.width, c.height).data;
  let n = 0, mx = 0; for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])); mx = Math.max(mx, d); if (d > 2) n++; } return { px: da.length / 4, differing: n, max: mx }; }, [a.toString('base64'), b.toString('base64')]);
// flip.js's judge, for V18
const FLOG = () => { window.__flog = (idx) => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[idx]; const ids = new WeakMap(); let n = 0; const Lg = []; let run = true;
  const tick = () => { if (!run) return; const h = el.querySelector('h3'); if (!ids.has(h)) ids.set(h, ++n);
    const tn = [...h.childNodes].find(x => x.nodeType === 3 && x.nodeValue.trim()); let x = null; if (tn) { const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, 1); x = r.getBoundingClientRect().left; }
    Lg.push({ sig: ids.get(h) + '|' + h.textContent + '|' + h.clientWidth, x, vis: el.classList.contains('is-visited') }); requestAnimationFrame(tick); };
  requestAnimationFrame(tick); return () => { run = false; return Lg; }; }; };
function flipJudge(Lg, reduced) {
  const moving = Lg.map((f, i) => i > 0 && f.x !== null && Lg[i - 1].x !== null && Math.abs(f.x - Lg[i - 1].x) > 0.05);
  const swaps = Lg.map((f, i) => i > 0 && f.sig !== Lg[i - 1].sig ? i : -1).filter(i => i >= 0); const lastMove = moving.lastIndexOf(true); const fails = [];
  for (const s of swaps) { if (Lg[s].vis !== Lg[s - 1].vis) continue;   // on the press/lift frame itself (p7 rule; reduced un-visit lands here by design)
    if (!reduced) { if (s > lastMove - 3) fails.push(`swap@${s} within the last 3 motion frames (last ${lastMove})`); if (moving.slice(s + 1).filter(Boolean).length < 3) fails.push(`<3 motion frames after swap@${s}`); }
    else { const xs = Lg.slice(s).map(f => f.x); if (!xs.every(v => Math.abs(v - xs[xs.length - 1]) < 0.05)) fails.push(`reduced: moves after swap@${s}`); } }
  return { fails, swaps: swaps.length, lastMove };
}
(async () => { const b = await L.launch();
  for (const reduced of [false, true]) { const mode = reduced ? 'reduced' : 'full';
    const ok = (name, cond, info) => rec(mode, name, cond, info);
    const fresh = async (o = {}) => { const r = await L.openProto(b, { reduced, ...o }); await r.page.evaluate(() => { window.__vib = []; Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: p => { __vib.push(JSON.stringify(p)); return true; } }); }); return r; };
    // ---- VISIT CASES ----
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      await L.drag(page, cdp, left(g, 110, 12)); await W(900); const s = await st(page, g.id);
      ok('V1 left stroke from the X visits: stamp in flow, field on, X back, 0 deletes/navs', s.visited && s.field && s.stamps === 1 && !s.carry && !s.live && !s.xhide && !s.del && !s.nav && !s.held, s);
      const vib = await page.evaluate(() => __vib); ok('V1b haptic: one ink tick on the press', vib.length === 1 && vib[0] === '10', vib);
      await L.drag(page, cdp, left(g, 110, 12)); await W(900); const s2 = await st(page, g.id);
      ok('V2 same stroke on the visited row un-visits: stamp gone, field off, 0 deletes', !s2.visited && !s2.field && !s2.stamps && !s2.del && !s2.nav && !s2.live, s2);
      const vib2 = await page.evaluate(() => __vib); ok('V2b haptic: erase double tick on the lift', vib2.length === 2 && vib2[1] === '[6,45,6]', vib2);
      await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      await L.drag(page, cdp, left(g, 50, 6), { stepMs: SLOW }); await W(600); const s = await st(page, g.id);
      ok('V3 released before 56: nothing inked, stamp gone, X back, row clean', !s.visited && !s.field && !s.carry && !s.stamps && !s.xhide && !s.live && !s.del && !s.nav, s);
      await L.drag(page, cdp, [...left(g, 100, 10), ...L.line(g.xc - 100, g.y, g.xc - 30, g.y, 6)], { stepMs: SLOW }); await W(600); const s2 = await st(page, g.id);
      ok('V4 press then back off below 52: lifts again, nothing visited', !s2.visited && !s2.field && !s2.carry && !s2.live, s2);
      await L.drag(page, cdp, left(g, 58, 3), { stepMs: 16, synthTs: true }); await W(900); const s3 = await st(page, g.id);
      ok('V5 quick flick (~48px content, 1.2px/ms) visits', s3.visited && s3.field && s3.stamps === 1 && !s3.live, s3);
      await L.drag(page, cdp, left(g, 58, 3), { stepMs: 16, synthTs: true }); await W(700); const s4 = await st(page, g.id);
      ok('V6 the same flick on a visited row does NOT un-visit', s4.visited && s4.stamps === 1 && !s4.live, s4);
      await ctx.close(); }
    // V7: a pressed impression never moves (overtravel to 150px)
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0); const rects = [];
      await L.drag(page, cdp, left(g, 150, 18), { hold: 350, onStep: async (i) => { if (i >= 9) rects.push(await page.evaluate(() => { const s = document.querySelector('.vs-carry'); if (!s) return null; const r = s.getBoundingClientRect();
        return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, w: r.width, pressed: !s.classList.contains('vs-open') }; })); } });
      await W(700); const pr = rects.filter(r => r && r.pressed); const dx = pr.length ? Math.max(...pr.map(r => r.cx)) - Math.min(...pr.map(r => r.cx)) : 99, dy = pr.length ? Math.max(...pr.map(r => r.cy)) - Math.min(...pr.map(r => r.cy)) : 99;
      ok('V7 pressed impression never moves on overtravel to 150px (centre drift)', pr.length >= 6 && dx < 0.01 && dy < 0.6, { frames: pr.length, dx: +dx.toFixed(3), dy: +dy.toFixed(3) });
      await ctx.close(); }
    // V8 hand-off: the pressed stamp (held, pop done) is pixel-identical to the rendered stamp, 3x
    if (!reduced) { const { ctx, page, cdp } = await L.openProto(b, { dsf: 3 }); const g = await geo(page, 0); let shotA, clip;
      await L.drag(page, cdp, left(g, 110, 12), { hold: 500, onStep: async (i) => { if (i === 12) { await W(420);
        clip = await page.evaluate(() => { const r = document.querySelector('.vs-carry').getBoundingClientRect(); return { x: Math.floor(r.x) - 1, y: Math.floor(r.y) - 1, width: Math.ceil(r.width) + 2, height: Math.ceil(r.height) + 2 }; });
        shotA = await page.screenshot({ clip }); } } }); await W(900);
      const shotB = await page.screenshot({ clip }); const diff = await imgDiff(page, shotA, shotB);
      fs.writeFileSync(SHOTS + '/v8-A.png', shotA); fs.writeFileSync(SHOTS + '/v8-B.png', shotB);
      ok('V8 hand-off: pressed stamp == rendered stamp (3x, per-place tilt kept)', diff.differing === 0, { ...diff, clip });
      await ctx.close(); }
    // V9 starred + visited row: both marks coexist; visit & star gestures on the same row
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 1);
      await L.drag(page, cdp, left(g, 110, 12)); await W(900); const s = await st(page, g.id);
      ok('V9 starred+visited row: left stroke un-visits, star kept', !s.visited && s.starred && s.star && !s.stamps && !s.live, s);
      await L.drag(page, cdp, left(g, 110, 12)); await W(900); const s2 = await st(page, g.id);
      ok('V9b ...and visits again, star kept', s2.visited && s2.starred && s2.star && s2.stamps === 1, s2);
      await L.drag(page, cdp, L.line(g.mid - 100, g.y, g.mid + 10, g.y, 12)); await W(1400); const s3 = await st(page, g.id);
      ok('V9c right stroke on the same row unstars; stamp + field kept', s3.visited && !s3.starred && !s3.star && s3.stamps === 1 && s3.field, s3);
      await L.drag(page, cdp, L.line(g.mid - 100, g.y, g.mid + 10, g.y, 12)); await W(1400); await L.drag(page, cdp, left(g, 110, 12)); await W(900); const s4 = await st(page, g.id);
      ok('V9d star, then un-visit: star kept, stamp gone', !s4.visited && s4.starred && s4.star && !s4.stamps, s4);
      await ctx.close(); }
    // V10 rapid strokes on two rows -> both land (fast-forward)
    { const { ctx, page, cdp } = await fresh(); const a = await geo(page, 5), c = await geo(page, 6);
      await L.drag(page, cdp, left(a, 110, 8)); await L.drag(page, cdp, left(c, 110, 8)); await W(1000); const sa = await st(page, a.id), sc = await st(page, c.id);
      ok('V10 two quick visit strokes: both land, nothing stuck', sa.visited && sc.visited && sa.stamps === 1 && sc.stamps === 1 && !sa.live && !sc.live && !sc.held, { sa, sc });
      await L.drag(page, cdp, left(a, 110, 8)); await L.drag(page, cdp, L.line(c.mid - 100, c.y, c.mid + 10, c.y, 8)); await W(1400); const sa2 = await st(page, a.id), sc2 = await st(page, c.id);
      ok('V10b un-visit then an immediate star stroke on another row: both land', !sa2.visited && sc2.starred && !sa2.live && !sa2.held, { sa2, sc2 });
      await ctx.close(); }
    // V11 tap right after a visit stroke navigates; V12 tap delay unchanged
    { const { ctx, page, cdp } = await fresh(); const a = await geo(page, 5), c = await geo(page, 6);
      await L.drag(page, cdp, left(a, 110, 8)); await L.T(cdp, 'touchStart', c.mid, c.y); await W(40); await L.T(cdp, 'touchEnd'); await W(300);
      const n = await page.evaluate(() => __nav.map(x => x[0])); ok('V11 tap on another row right after a visit stroke navigates', n.length === 1 && n[0] === c.id, n);
      const d = await page.evaluate(() => __nav.length ? __nav[0][1] - __te[__te.length - 1] : null); ok(`V12 tap delay: 0ms added (touchend -> navigate ${d === null ? '-' : d.toFixed(1)}ms)`, d !== null && d < 8, { ms: d });
      await ctx.close(); }
    // V13 [sticker] before the commit the sticker HOVERS; V14 the name is never seen within 4px of it
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 5);
      await page.evaluate(() => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[5]; window.__vf = []; let run = true;
        const liftD = rowStickerFold(...ROW_STICKER_POSE.lift).flapD;
        const tick = () => { if (!run) return; const s = el.querySelector('.vs-carry'); if (s) { const m = new DOMMatrix(getComputedStyle(s).transform), sr = s.getBoundingClientRect();
          // visible text = the slid h3 / meta glyphs, capped by their (ellipsis) box and by the veil's opaque start
          const vr = e => { const rg = document.createRange(); rg.selectNodeContents(e); return Math.min(rg.getBoundingClientRect().right, e.getBoundingClientRect().right); };
          const veil = s.querySelector('.vs-veil'), base = s.querySelector('.stk-base'), sc = Math.hypot(m.a, m.b);
          const veilOpaque = veil ? veil.getBoundingClientRect().left + 8 * sc : Infinity;
          const textVisRight = Math.min(Math.max(vr(el.querySelector('h3')), vr(el.querySelector('.row-meta'))), veilOpaque);
          __vf.push({ scale: sc, rot: Math.atan2(m.b, m.a) * 180 / Math.PI, cx: +(sr.x + sr.width / 2).toFixed(3), cy: +(sr.y + sr.height / 2).toFixed(3), q: s.__vsQ,
            op: parseFloat(getComputedStyle(s).opacity), swept: s.classList.contains('vs-open'), shadow: getComputedStyle(base).filter, lifted: s.querySelector('.stk-flap').getAttribute('d') === liftD,
            gap: base.getBoundingClientRect().left - textVisRight }); } requestAnimationFrame(tick); }; requestAnimationFrame(tick); window.__vstop = () => { run = false; }; });
      await L.drag(page, cdp, left(g, 110, 22), { hold: 450 });
      const f = await page.evaluate(() => { __vstop(); return __vf; }); const tilt = await page.evaluate(id => stickerTilt(id), g.id);
      const pre = f.filter(x => x.swept), vis = pre.filter(x => x.op > 0.01), cxs = f.map(x => x.cx), cys = f.map(x => x.cy);
      const H = await page.evaluate(() => VISIT_HOVER.SCALE);
      const tilted = pre.every(x => Math.abs(x.rot - tilt) < 0.01);
      const scaled = reduced ? pre.every(x => Math.abs(x.scale - 1) < 1e-3) : pre.every(x => x.scale >= H[0] - 1e-3 && x.scale <= H[1] + 1e-3);
      let mono = true; for (let i = 1; i < pre.length; i++) if (pre[i].scale < pre[i - 1].scale - 1e-4 || pre[i].op < pre[i - 1].op - 1e-4) mono = false;
      const lifted = vis.every(x => x.lifted && /drop-shadow/.test(x.shadow));
      const drift = Math.max(Math.max(...cxs) - Math.min(...cxs), Math.max(...cys) - Math.min(...cys));
      ok(`V13 [sticker] before the commit the sticker HOVERS in its slot: never moves (drift ${drift.toFixed(3)}), the place's half lean, ${reduced ? 'scale 1' : `scale ${H[0]}..${H[1]}`}, scale + opacity monotonic, lifted (shadow + curled flap) on every visible frame`,
        vis.length >= 5 && tilted && scaled && mono && lifted && drift < 0.01, { visibleFrames: vis.length, tilted, scaled, mono, lifted, centreDrift: +drift.toFixed(3) });
      const inked = f.filter(x => !x.swept || x.op > 0.01), minGap = inked.length ? Math.min(...inked.map(x => x.gap)) : 99; const worst = inked.find(x => x.gap === minGap);
      ok(`V14 [sticker] the name is never seen near the sticker: the slid name/meta glyphs (as the veil leaves them) stay >= 4px clear of the 72x24 oval on every visible frame, incl. the press (min ${minGap.toFixed(2)}px)`, minGap >= 4, { inkedFrames: inked.length, minGap: +minGap.toFixed(2), at: worst && { pressed: !worst.swept, scale: +worst.scale.toFixed(3) } });
      await W(500); await ctx.close(); }
    // V15 (shipped.md, swipe-visit "Press at 56, one frame": "the final truncation lands" on the press frame, "letters never
    //      change on a still frame"): the h3 the eye reads while the finger HOLDS the press (pop done) is already the final
    //      layout -- same text, same width -- so nothing re-truncates after release. Long name, 3x. (p7's V15 compared pixels
    //      of the text region; under [1ec21c2] the text slides, so the h3's own text/width is compared instead.)
    if (!reduced) for (const [idx, what] of [[5, 'visit'], [2, 'un-visit']]) { const { ctx, page, cdp } = await L.openProto(b, { dsf: 3 }); const g = await geo(page, idx); let A;
      const sig = () => page.evaluate(i => { const h = document.querySelectorAll('#locationsList .location-card[data-id]')[i].querySelector('h3'); return { text: h.textContent, w: h.clientWidth }; }, idx);
      await L.drag(page, cdp, left(g, 110, 12), { hold: 400, onStep: async (i) => { if (i === 12) { await W(380); A = await sig(); } } });
      await W(900); const B = await sig();
      ok(`V15 ${what}: the held press already shows the final truncation (h3 width held ${A.w}px, at rest ${B.w}px)`, A.w === B.w && A.text === B.text, { held: A, rest: B });
      await ctx.close(); }
    // V18 [1ec21c2] glyphs change only while the name moves, >= 3 motion frames before rest (the star's FLIP rule); a cancel changes none
    for (const [idx, what, pts, cancel] of [[5, 'visit', g => left(g, 110, 22), false], [5, 'press then back off', g => [...left(g, 110, 14), ...L.line(g.xc - 110, g.y, g.xc - 40, g.y, 8)], true], [2, 'un-visit', g => left(g, 110, 22), false]]) {
      const { ctx, page, cdp } = await fresh(); const g = await geo(page, idx); await page.evaluate(FLOG);
      await page.evaluate(i => { window.__fstop = __flog(i); }, idx);
      await L.drag(page, cdp, pts(g)); await W(900); const Lg = await page.evaluate(() => __fstop()); const j = flipJudge(Lg, reduced);
      const pass = cancel ? j.swaps === 0 : (j.swaps >= 1 && !j.fails.length);
      ok(`V18 [1ec21c2] ${what}: ${cancel ? 'no glyph change at all' : 'glyph changes only on the press/lift frame or while the name moves, >= 3 motion frames before rest'} (swaps ${j.swaps})`, pass, j); await ctx.close(); }
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      await page.evaluate(() => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[0]; window.__xf = []; let run = true;
        const tick = () => { if (!run) return; const c = el.querySelector('.vs-carry') || el.querySelector('.row-stamp'), x = el.querySelector('.delete-btn'); if (c && x) { const xo = parseFloat(getComputedStyle(x).opacity); __xf.push({ xo, over: c.getBoundingClientRect().right - x.getBoundingClientRect().left }); } requestAnimationFrame(tick); };
        requestAnimationFrame(tick); window.__xstop = () => { run = false; }; });
      await L.drag(page, cdp, left(g, 110, 12)); await W(800); const f = await page.evaluate(() => { __xstop(); return __xf; });
      const both = f.filter(x => x.xo > 0.01); const worst = both.length ? Math.max(...both.map(x => x.over)) : -99;
      ok('V19 the stamp (incl. its pop peak) never reaches the X while the X is visible', worst <= 0, { framesXVisible: both.length, worstOverlapPx: +worst.toFixed(2) }); await ctx.close(); }
    // V16 [p8] popup Mark Visited: the non-gesture path; row tint + stamp in sync (now also replays on the row)
    { const { ctx, page } = await fresh(); const r = await page.evaluate(async () => { const id = __rowIds()[0]; const loc = locations.find(l => l.id === id); map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI();
        markersById.get(id).marker.openPopup(); await new Promise(r => setTimeout(r, 300)); document.querySelector('.leaflet-popup .popup-visited').click(); await new Promise(r => setTimeout(r, 1000));
        const el = document.querySelector(`.location-card[data-id="${id}"]`); return { visited: locations.find(l => l.id === id).visited, field: el.classList.contains('is-visited'), stamps: el.querySelectorAll('.row-stamp').length, live: el.classList.contains('vs-live'), held: starHeld.size }; });
      ok('V16 [p8] popup Mark Visited still visits; row field + stamp in sync', r.visited && r.field && r.stamps === 1 && !r.live && !r.held, r); await ctx.close(); }
    // V17 [sticker] the press at real timing: pressed down from the hover (<= 1.12x) to 0.97x (>= 2 frames <= 0.985),
    //      then settles to scale 1 at the place's lean; reduced: no press dip, scale 1 and the lean on every frame after the press.
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      const H = await page.evaluate(() => VISIT_HOVER.SCALE[1]);
      await page.evaluate(() => { window.__f = []; const tick = () => { const s = document.querySelectorAll('#locationsList .location-card[data-id]')[0].querySelector('.row-stamp'); if (s) { const m = new DOMMatrix(getComputedStyle(s).transform); __f.push({ t: performance.now(), sc: Math.hypot(m.a, m.b), rot: Math.atan2(m.b, m.a) * 180 / Math.PI, sw: s.classList.contains('vs-open') }); } if (__f.length < 600) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
      await L.drag(page, cdp, left(g, 110, 12), { hold: 500 }); await W(200);
      const f = await page.evaluate(() => __f); const tilt = await page.evaluate(id => stickerTilt(id), g.id); const i = f.findIndex(x => !x.sw); const after = f.slice(i);
      const peak = Math.max(...after.map(x => x.sc)), under = after.filter(x => x.sc <= 0.985).length, rest = after[after.length - 1];
      ok(reduced ? 'V17 (reduced) the placed sticker appears: no press, scale 1 and the place\'s lean on every frame' : `V17 [sticker] press at real timing: ${under} frames <= 0.985 (>=2), peak ${peak.toFixed(4)} <= ${H} (the hover), rests at scale 1 and the place's lean`,
        reduced ? after.every(x => Math.abs(x.sc - 1) < 1e-3 && Math.abs(x.rot - tilt) < 0.01) : (under >= 2 && peak <= H + 1e-4 && Math.abs(rest.rot - tilt) < 0.01 && Math.abs(rest.sc - 1) < 1e-3),
        { under, peak: +peak.toFixed(4), restRot: +rest.rot.toFixed(3), tilt });
      await ctx.close(); }
    // V20 un-visit: the star's erase pop at the lock (1.12x, no twist); none under reduced motion. V21 cancel: nothing left behind.
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 2); let ringVis;
      await page.evaluate(() => { window.__u = []; const el = document.querySelectorAll('#locationsList .location-card[data-id]')[2]; const tick = () => { const s = el.querySelector('.row-stamp'); if (s) { const m = new DOMMatrix(getComputedStyle(s).transform); __u.push({ sc: Math.hypot(m.a, m.b), rot: Math.atan2(m.b, m.a) * 180 / Math.PI }); } if (__u.length < 300) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
      await L.drag(page, cdp, left(g, 40, 6), { onStep: async i => { if (i === 3) ringVis = await page.evaluate(() => { const s = document.querySelectorAll('#locationsList .location-card[data-id]')[2].querySelector('.row-stamp'); return getComputedStyle(s.querySelector('.row-sticker-label')).visibility === 'visible' && parseFloat(getComputedStyle(s).opacity) > 0.5 ? 'visible' : 'hidden'; }); } }); await W(600);
      const u = await page.evaluate(() => __u); const tilt = await page.evaluate(id => stickerTilt(id), g.id); const s1 = await st(page, g.id);
      const peak = Math.max(...u.map(x => x.sc)), twist = Math.max(...u.map(x => Math.abs(x.rot - tilt)));
      ok(reduced ? 'V20 (reduced) un-visit lift: no pop' : 'V20 un-visit lifts with the star\'s erase pop: peak 1.12x, no twist', reduced ? peak < 1.001 : (Math.abs(peak - 1.12) < 0.01 && twist < 0.01), { peak: +peak.toFixed(4), twist: +twist.toFixed(3) });
      ok('V20b [sticker] un-visit: check + word stay visible while the sticker peels (opacity > 0.5 mid-stroke)', ringVis === 'visible', { label: ringVis });
      ok('V21 un-visit let go at 40px: still visited, stamp back at full ink, track whole, row clean', s1.visited && s1.field && s1.stamps === 1 && !s1.live, s1);
      const g0 = await geo(page, 0); await L.drag(page, cdp, left(g0, 50, 6), { stepMs: SLOW }); await W(600); const s0 = await st(page, g0.id);
      const sw = await page.evaluate(() => document.querySelectorAll('.vs-open').length);
      ok('V21b visit let go at 40px: nothing inked, no stamp or partial track left, X back', !s0.visited && !s0.stamps && !s0.carry && !s0.live && !s0.xhide && sw === 0, { ...s0, sweeps: sw });
      await ctx.close(); }
    // V22 [sticker] (P3-N1 intent: the un-visit never shifts the mark's ink) the peel: the sticker starts at full
    //      opacity (sampled from the resting sticker before the stroke, so the first frame is never missed) and only
    //      fades (monotonic), its ink (label colour) held on every frame
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 2);
      await page.evaluate(() => { window.__gc = []; const el = document.querySelectorAll('#locationsList .location-card[data-id]')[2]; let run = true;
        const tick = () => { if (!run) return; const s = el.querySelector('.row-stamp'); if (s) __gc.push({ op: parseFloat(getComputedStyle(s).opacity), ink: getComputedStyle(s.querySelector('.row-sticker-label')).color });
          requestAnimationFrame(tick); }; requestAnimationFrame(tick); window.__gstop2 = () => { run = false; }; });
      await L.drag(page, cdp, left(g, 110, 22)); await W(700); const all = await page.evaluate(() => { __gstop2(); return __gc.filter(x => x.op > 0.01); });
      let mono = true; for (let i = 1; i < all.length; i++) if (all[i].op > all[i - 1].op + 1e-3) mono = false;
      const inks = [...new Set(all.map(x => x.ink))];
      ok('V22 [sticker] un-visit peel: starts at full opacity and only fades (monotonic), the ink held on every frame', all.length >= 5 && mono && Math.abs(all[0].op - 1) < 1e-3 && inks.length === 1, { frames: all.length, first: all[0] && all[0].op, last: all.length && all[all.length - 1].op, mono, inks });
      await ctx.close(); }
    // V23 (P6-N1) no repaint-driving writes mid-drag: the stamp's subtree sees 0 class changes and only transform/opacity writes;
    //      [1ec21c2] the slid text (h3, meta, badge, printed star, row-main) is written only as transforms (+ --sg-fade-a)
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 5);
      await page.evaluate(() => { window.__mo = { cls: 0, other: [], writes: 0, textOther: [] }; const list = document.getElementById('locationsList');
        document.addEventListener('touchend', () => { __mo.up = true; }, true); const mo = new MutationObserver(ms => ms.forEach(m => { if (__mo.up) return; const t = m.target;
          if (m.attributeName === 'style' && t.closest && t.closest('.vs-live') && !t.closest('.vs-carry') && t.matches('h3, .row-meta, .row-badge, .row-star, .row-main')) { const was = new Map((m.oldValue || '').split(';').map(d => d.split(':').map(v => v && v.trim())).filter(d => d[0]));
            const props = [...t.style].filter(k => !/^(transform|--sg-fade-a)$/.test(k) && (was.get(k) || '') !== t.style.getPropertyValue(k).trim()); if (props.length) __mo.textOther.push(props.join(',')); }
          const st = t.closest && t.closest('.vs-carry'); if (!st || !st.classList.contains('vs-open')) return;
          if (m.attributeName === 'class' && t !== st) __mo.cls++;
          if (m.attributeName === 'style') { __mo.writes++; const props = [...t.style].filter(k => !/^(transform|opacity)$/.test(k) && !/^--vs-ink-|^--stamp-tilt$/.test(k)); if (props.length) __mo.other.push(props.join(',')); } }));
        mo.observe(list, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class', 'style'] }); window.__mostop = () => mo.disconnect(); });
      await L.drag(page, cdp, left(g, 60, 20)); await W(500); const m = await page.evaluate(() => { __mostop(); return __mo; });
      ok('V23 (P6-N1) mid-drag, the hovering sticker only writes transforms and opacities (0 class changes, 0 other style properties); [1ec21c2] the slid text only transforms', m.cls === 0 && m.other.length === 0 && m.writes > 10 && m.textOther.length === 0, { classChanges: m.cls, otherProps: [...new Set(m.other)].slice(0, 5), styleWrites: m.writes, textOther: [...new Set(m.textOther)].slice(0, 5) });
      await ctx.close(); }
    // ---- DELETE SAFETY ----
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0);
      const tapMove = async (dx) => { await L.T(cdp, 'touchStart', g.xc, g.y); await W(30); if (dx) { await L.T(cdp, 'touchMove', g.xc - dx / 2, g.y); await W(16); await L.T(cdp, 'touchMove', g.xc - dx, g.y); await W(30); } await L.T(cdp, 'touchEnd'); await W(250); return page.evaluate(() => __del.length); };
      let d = await tapMove(0); ok('D1 still tap on the X deletes (confirm)', d === 1, { del: d });
      d = await tapMove(3); ok('D2 tap with 3px of movement still deletes', d === 2, { del: d });
      for (const dist of [4, 6, 8, 12, 20, 40]) { const before = d; d = await tapMove(dist); await W(500); const s = await st(page, g.id); ok(`D3 hesitant ${dist}px left stroke from the X: no delete`, d === before && !s.visited, { del: d - before, visited: s.visited }); }
      { const before = d; await L.drag(page, cdp, L.line(g.xc - 10, g.y, g.xc + 5, g.y, 4)); await W(300); d = await page.evaluate(() => __del.length); const s = await st(page, g.id);
        ok('D4 right stroke from the X: no delete, no star', d === before && !s.starred, { del: d - before }); }
      { const before = d; await L.drag(page, cdp, L.line(g.xc, g.y, g.xc, g.y - 60, 8)); await W(300); const g2 = await geo(page, 0); Object.assign(g, g2); d = await page.evaluate(() => __del.length); ok('D5 vertical drag from the X: no delete', d === before, { del: d - before }); }
      { const before = d; await L.drag(page, cdp, left(g, 110, 12)); await W(900); d = await page.evaluate(() => __del.length); ok('D6 full visit stroke from the X: no delete', d === before, { del: d - before }); }
      // D7: taps on the X right after a stroke: never deletes while it's faded; deletes once it's back
      { const before = d; await L.drag(page, cdp, left(g, 110, 12)); await L.T(cdp, 'touchStart', g.xc, g.y); await W(30); await L.T(cdp, 'touchEnd'); await W(50);
        const d0 = await page.evaluate(() => __del.length); await W(900); await L.T(cdp, 'touchStart', g.xc, g.y); await W(30); await L.T(cdp, 'touchEnd'); await W(200); d = await page.evaluate(() => __del.length);
        ok('D7 X tap at ~0ms after a stroke does not delete; once the X is back it does', d0 === before && d === before + 1, { at0: d0 - before, later: d - before }); }
      // D8 mouse: an 8px drag from the X doesn't delete; a still click does. D9 keyboard Enter on the X deletes.
      { const before = d; await page.mouse.move(g.xc, g.y); await page.mouse.down(); await page.mouse.move(g.xc - 8, g.y, { steps: 3 }); await page.mouse.up(); await W(200); const m1 = await page.evaluate(() => __del.length);
        await page.mouse.click(g.xc, g.y); await W(200); const m2 = await page.evaluate(() => __del.length);
        ok('D8 mouse: 8px drag from the X no delete; still click deletes', m1 === before && m2 === before + 1, { drag: m1 - before, click: m2 - before }); d = m2; }
      { const before = d; await page.evaluate(() => document.querySelectorAll('#locationsList .location-card[data-id]')[0].querySelector('.delete-btn').focus()); await page.keyboard.press('Enter'); await W(200); d = await page.evaluate(() => __del.length);
        ok('D9 keyboard Enter on the X deletes', d === before + 1, { del: d - before }); }
      await ctx.close(); }
    // D10: Safari forward-swipe edge: a stroke starting within 24px of the right edge is inert
    { const { ctx, page, cdp } = await fresh(); const g = await geo(page, 0); await L.drag(page, cdp, L.line(372, g.y, 260, g.y, 12)); await W(600); const s = await st(page, g.id);
      ok('D10 stroke from x=372 (inside EDGE 24) is inert: no visit, no delete', !s.visited && !s.del && !s.live, s); await ctx.close(); }
  }
  const okAll = finish(); await b.close(); process.exitCode = okAll ? 0 : 1; })();
