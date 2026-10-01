// FLIP SUITE -- the "+ 8" of the star gate "84 + 8 (+ N8-a)". Re-implements
// design/pencil-star/flip6.js (N5-a) on this harness: frame-by-frame proof that no
// visible glyph changes on a STILL frame. Per rAF on the stroked row it logs the h3
// signature (node identity | text | clientWidth), the name's MEASURED screen x (a
// Range on the first glyph) and the truncation edge vs the mask's fade start.
//   motion:  every signature swap is >= 3 motion frames before the last motion
//            frame, the name moves on >= 3 frames after it, and any truncation-edge
//            change has both edges at/past the fade start.
//   reduced: the swap IS the landing (displaced before, still at its final x after).
// 4 rows x 2 modes = 8 cases, plus a NEGATIVE CONTROL (flipToFinal re-timed to swap
// at rest) that must FAIL all 4 -- otherwise the suite can't see the defect.
// The stroke is a real-time CDP touch swipe at 0.6px/ms over 100px (the doc's
// "natural swipe"), replacing r5-metrics.js's in-page __swipe driver (never committed).
// FILE=<index.html> OUT=<json> node flip.js
const { launch, openProto, drag, line, rowRect, W, recorder } = require('./lib');
const { rec, finish } = recorder('flip');
const LOG = () => { window.__flog = (idx) => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[idx]; const ids = new WeakMap(); let n = 0; const L = []; let run = true;
  const tick = () => { if (!run) return; const h = el.querySelector('h3'); if (!ids.has(h)) ids.set(h, ++n);
    const tn = [...h.childNodes].find(x => x.nodeType === 3 && x.nodeValue.trim()); let x = null; if (tn) { const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, 1); x = r.getBoundingClientRect().left; }
    const hr = h.getBoundingClientRect(), mr = el.querySelector('.row-main').getBoundingClientRect();
    const edge = hr.left + Math.min(h.scrollWidth, h.clientWidth) * (hr.width / (h.offsetWidth || 1));
    L.push({ t: performance.now(), sig: ids.get(h) + '|' + h.textContent + '|' + h.clientWidth, x, edge, fade: mr.right - 8, live: el.classList.contains('sg-live') }); requestAnimationFrame(tick); };
  requestAnimationFrame(tick); return () => { run = false; return L; }; }; };
function judge(L, reduced) {
  const moving = L.map((f, i) => i > 0 && f.x !== null && L[i - 1].x !== null && Math.abs(f.x - L[i - 1].x) > 0.05);
  const swaps = L.map((f, i) => i > 0 && f.sig !== L[i - 1].sig ? i : -1).filter(i => i >= 0);
  const lastMove = moving.lastIndexOf(true);
  const fails = [];
  if (!swaps.length) fails.push('no swap');
  for (const s of swaps) {
    const before = L[s - 1], after = L[s];
    if (Math.abs(after.edge - before.edge) > 0.5 && !(before.edge >= before.fade - 0.5 && after.edge >= after.fade - 0.5)) fails.push(`swap@${s}: truncation edge changed inside the clear text (edges ${before.edge.toFixed(1)} -> ${after.edge.toFixed(1)}, fade ${after.fade.toFixed(1)})`);
    if (!reduced) {
      const movesAfter = moving.slice(s + 1).filter(Boolean).length;
      if (s > lastMove - 3) fails.push(`swap@${s} within the last 3 motion frames (last motion ${lastMove})`);
      if (movesAfter < 3) fails.push(`only ${movesAfter} motion frames after swap@${s}`);
    } else {
      const xs = L.slice(s).map(f => f.x); const still = xs.every(v => Math.abs(v - xs[xs.length - 1]) < 0.05);
      const displacedBefore = Math.abs(L[s - 1].x - xs[xs.length - 1]) > 1;
      if (!still) fails.push(`reduced: name moves after the landing swap@${s}`);
      if (!displacedBefore) fails.push(`reduced: swap@${s} is not the landing frame`);
    }
  }
  return { pass: !fails.length, fails, swaps, lastMove, frames: L.length };
}
(async () => {
  const b = await launch(); let controlFails = 0, controlRuns = 0;
  const cases = [['star long visited', 2, null], ['unstar long', 1, null], ['star short', 0, null], ['unstar short', 1, 'Kaffibarinn']];
  for (const control of [false, true]) for (const reduced of (control ? [false] : [false, true])) for (const [lbl, idx, rn] of cases) {
    const { ctx, page, cdp } = await openProto(b, { reduced });
    await page.evaluate(rn => { if (rn) { const id = __rowIds()[1]; locations = locations.map(l => l.id === id ? { ...l, name: rn } : l); updateUI(); } }, rn);
    if (control) await page.evaluate(() => { // NEGATIVE CONTROL: slide the old row home, then swap glyphs AT REST
      flipToFinal = (el, g, ns, ms, done) => { const o = g.off || 0, m = g.metaOff || 0; runTimeline(ms, t => setSlip(g, o * (1 - easeOut(t)), m * (1 - easeOut(t))), () => { const loc = locations.find(l => l.id === g.id); renderCard(el, { ...loc, starred: ns }); const e = cardsById.get(g.id); if (e) e.signature = cardSignature({ ...loc, starred: ns }); g.h3 = el.querySelector('h3'); g.meta = el.querySelector('.row-meta'); g.main = el.querySelector('.row-main'); setTimeout(done, 120); }); }; });
    await page.evaluate(LOG);
    const q = await rowRect(page, idx); const y = q.y + q.h / 2;
    await page.evaluate(idx => { window.__stop = __flog(idx); }, idx);
    await drag(page, cdp, line(170, y, 270, y, 10), { stepMs: 16.7 });   // 100px at 0.6px/ms
    await W(900);
    const L = await page.evaluate(() => __stop());
    const j = judge(L, reduced); const name = `${control ? 'CONTROL (swap at rest) ' : ''}${lbl}`;
    if (control) { controlRuns++; if (!j.pass) controlFails++; console.log(`control  ${j.pass ? 'PASSED (bad: the suite cannot see an at-rest swap)' : 'fails as designed'} ${lbl} ${JSON.stringify(j.fails)}`); }
    else rec(reduced ? 'reduced' : 'full', `${name}: swaps ${j.swaps} lastMove ${j.lastMove}`, j.pass, j.fails);
    await ctx.close();
  }
  console.log(`flip control fails ${controlFails}/${controlRuns}`);
  const ok = finish({ control: { fails: controlFails, runs: controlRuns } }); await b.close();
  process.exitCode = ok && controlFails === controlRuns ? 0 : 1;
})();
