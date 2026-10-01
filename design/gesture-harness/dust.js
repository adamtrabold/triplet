// DUST SUITE -- "0 dust-over-text frames" (docs/shipped.md Pencil Star rounds 4-6:
// "Rule: dust may never overlap text -- 0 frames, guarded by the dust detector";
// design/pencil-star/r6-design.md, dust6.js). Every rAF frame at 60Hz, in real time,
// counts any eraser speck (.sg-crumb) with opacity > 0.05 whose box overlaps the
// stroked row's h3 or meta box. Also measures lift -> name moving (rule <= 150ms;
// r6 measured <= 117ms) on full-motion unstars released before the rub finished.
// Coverage (r6's matrix, rebuilt): unstar long / short / unvisited rows, natural
// (0.6px/ms) and brisk (1.5px/ms) swipes, all 5 cities, normal + highlighted rows,
// both motion modes; star strokes (no dust); the popup->row unstar replay.
// Gate: 0 frames over text across every run, every unstar leaves the row unstarred.
// FILE=<index.html> OUT=<json> node dust.js
const { launch, openProto, drag, line, rowRect, W, recorder } = require('./lib');
const { rec, finish } = recorder('dust');
const DET = () => { window.__dust = (idx) => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[idx]; let run = true; const out = { frames: 0, over: 0, specks: 0, firstMove: null, x0: null };
  const ov = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const tick = () => { if (!run) return; out.frames++; const h = el.querySelector('h3'), m = el.querySelector('.row-meta'); const hb = h.getBoundingClientRect(), mb = m.getBoundingClientRect();
    const cs = [...el.querySelectorAll('.sg-crumb')].filter(c => parseFloat(getComputedStyle(c).opacity) > 0.05); if (cs.length) out.specks++;
    if (cs.some(c => { const b = c.getBoundingClientRect(); return ov(b, hb) || ov(b, mb); })) out.over++;
    const tn = [...h.childNodes].find(x => x.nodeType === 3 && x.nodeValue.trim()); if (tn && window.__liftT && out.firstMove === null) { const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, 1); const x = r.getBoundingClientRect().left;
      if (out.x0 === null) out.x0 = x; else if (x < out.x0 - 0.3) out.firstMove = performance.now() - __liftT; }
    requestAnimationFrame(tick); };
  requestAnimationFrame(tick); return () => { run = false; return out; }; };
  document.addEventListener('touchend', () => { window.__liftT = performance.now(); }, true); };
(async () => {
  const b = await launch(); let totalOver = 0, runs = 0, worstLift = 0; const lifts = [];
  for (const reduced of [false, true]) for (const city of ['reykjavik', 'copenhagen', 'malmo', 'stockholm', 'la']) for (const hl of [false, true]) {
    const mode = reduced ? 'reduced' : 'full';
    const { ctx, page, cdp, errors } = await openProto(b, { reduced, city }); await page.evaluate(DET);
    const ids = await page.evaluate(() => __rowIds());
    const kinds = reduced ? [['unstar long', 1, 0.6]] : [['unstar long', 1, 0.6], ['unstar short', 1, 0.6, 'Kaffibarinn'], ['unstar unvisited', 10, 0.6], ['unstar long brisk', 1, 1.5], ['star (no dust)', 0, 0.6]];
    for (const [lbl, idx0, v, rn] of kinds) {
      // a rename re-sorts the A-Z list: address the row by id from here on
      const idx = await page.evaluate(([id, rn, hl, star]) => { if (rn) __rename(id, rn); setLocationFlag(id, 'starred', star); if (hl) setHighlighted(id); else setHighlighted(null); updateUI(); return __rowIds().indexOf(id); }, [ids[idx0], rn || null, hl, !lbl.startsWith('star')]);
      await W(200); const q = await rowRect(page, idx); const y = q.y + q.h / 2;
      await page.evaluate(i => { window.__liftT = 0; window.__dstop = __dust(i); }, idx);
      const n = Math.max(4, Math.round(100 / (v * 16)));   // 100px at v px/ms, 16ms steps
      await drag(page, cdp, line(170, y, 270, y, n)); await W(900);
      const o = await page.evaluate(() => __dstop()); const starred = await page.evaluate(id => !!locations.find(l => l.id === id).starred, ids[idx0]);
      const want = lbl.startsWith('star'); runs++; totalOver += o.over;
      const unstarLift = !reduced && !want && o.firstMove !== null; if (unstarLift) { lifts.push(o.firstMove); worstLift = Math.max(worstLift, o.firstMove); }
      rec(mode, `${city}${hl ? ' highlighted' : ''} ${lbl}: ${o.over} speck-over-text frames of ${o.frames} (${o.specks} with dust)${unstarLift ? `, lift->name moving ${Math.round(o.firstMove)}ms` : ''}`,
        o.over === 0 && starred === want && (!unstarLift || o.firstMove <= 150) && (reduced || want || o.specks > 0) && !errors.length, { o, starred, errors });
    }
    if (!reduced && !hl) { // popup -> row unstar replay (ssReplay: rub + dust + FLIP home)
      const id = ids[1]; await page.evaluate(id => { setLocationFlag(id, 'starred', true); setHighlighted(null); }, id); await W(200); const ri = await page.evaluate(id => __rowIds().indexOf(id), id); await rowRect(page, ri);
      await page.evaluate(i => { window.__dstop = __dust(i); }, ri); await page.evaluate(id => { ssReplay(id); setLocationFlag(id, 'starred', false); }, id); await W(1200);
      const o = await page.evaluate(() => __dstop()); runs++; totalOver += o.over;
      rec(mode, `${city} popup->row unstar replay: ${o.over} speck-over-text frames of ${o.frames} (${o.specks} with dust)`, o.over === 0 && o.specks > 0, o);
    }
    await ctx.close();
  }
  console.log(`dust ${totalOver} speck-over-text frames in ${runs} runs; lift->name moving max ${Math.round(worstLift)}ms (${lifts.length} unstars)`);
  const ok = finish({ overFrames: totalOver, runs, worstLiftMs: worstLift }); await b.close(); process.exitCode = ok && totalOver === 0 ? 0 : 1;
})();
