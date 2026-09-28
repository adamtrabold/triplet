// N5-a: frame-by-frame proof that no visible glyph changes on a STILL frame (replaces flip5.js).
// Per rAF frame on the stroked row: h3 identity/text/clientWidth ("signature"), the name's measured screen x
// (first glyph, getBoundingClientRect via Range -- not the transform string), and the truncation edge vs the mask fade.
// Asserts (motion): every signature swap is >= 3 motion frames before the last motion frame; any truncation-edge change
// happens with old and new edges at/past the mask's fade start; the name moves on >= 3 frames after the swap.
// Asserts (reduced): the swap IS the landing -- the name is displaced before it and still (at its final x) from it on.
// A negative control (swap re-timed to happen at rest) must FAIL.
const { launch, openProto } = require('./lib'); const fs = require('fs');
const FILE = require('./lib').FILE;
const DRIVER = fs.readFileSync(__dirname + '/star-driver.js', 'utf8').match(/const DRIVER = `([\s\S]*?)`;/)[1];
const LOG = `window.__flog = (idx) => { const el = document.querySelectorAll('#locationsList .location-card')[idx]; const ids = new WeakMap(); let n = 0; const L = []; let run = true;
  const tick = () => { if (!run) return; const h = el.querySelector('h3'); if (!ids.has(h)) ids.set(h, ++n);
    const tn = [...h.childNodes].find(x => x.nodeType === 3 && x.nodeValue.trim()); let x = null; if (tn) { const r = document.createRange(); r.setStart(tn, 0); r.setEnd(tn, 1); x = r.getBoundingClientRect().left; }
    const hr = h.getBoundingClientRect(), mr = el.querySelector('.row-main').getBoundingClientRect();
    const edge = hr.left + Math.min(h.scrollWidth, h.clientWidth) * (hr.width / (h.offsetWidth || 1));
    L.push({ t: performance.now(), sig: ids.get(h) + '|' + h.textContent + '|' + h.clientWidth, x, edge, fade: mr.right - 8, live: el.classList.contains('sg-live') }); requestAnimationFrame(tick); };
  requestAnimationFrame(tick); return () => { run = false; return L; }; };`;
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
  const b = await launch(); const out = {};
  const cases = [['star long visited', 2, null], ['unstar long', 1, null], ['star short', 0, null], ['unstar short', 1, 'Kaffibarinn']];
  for (const control of [false, true]) for (const reduced of (control ? [false] : [false, true])) for (const [lbl, idx, rn] of cases) {
    const { ctx, page } = await openProto(b, { dsf: 1, file: FILE, reduced });
    await page.evaluate(rn => { if (rn) { locations[1] = { ...locations[1], name: rn }; updateUI(); } }, rn);
    if (control) await page.evaluate(() => { // NEGATIVE CONTROL: slide the old row home, then swap glyphs AT REST
      flipToFinal = (el, g, ns, ms, done) => { const o = g.off || 0, m = g.metaOff || 0; runTimeline(ms, t => setSlip(g, o * (1 - easeOut(t)), m * (1 - easeOut(t))), () => { const loc = locations.find(l => l.id === g.id); renderCard(el, { ...loc, starred: ns }); const e = cardsById.get(g.id); if (e) e.signature = cardSignature({ ...loc, starred: ns }); g.h3 = el.querySelector('h3'); g.meta = el.querySelector('.row-meta'); g.main = el.querySelector('.row-main'); setTimeout(done, 120); }); }; });
    await page.addScriptTag({ content: DRIVER + LOG });
    const L = await page.evaluate(async idx => { const stop = __flog(idx); await __swipe(idx, 0.6, 100, { tail: 900 }); return stop(); }, idx);
    out[`${control ? 'CONTROL (swap at rest) ' : ''}${reduced ? 'reduced' : 'full'} · ${lbl}`] = judge(L, reduced); await ctx.close();
  }
  for (const [k, v] of Object.entries(out)) console.log(v.pass ? 'PASS' : 'FAIL', k, v.pass ? `swaps ${v.swaps} lastMove ${v.lastMove}` : JSON.stringify(v.fails));
  fs.writeFileSync(require('./lib').outPath('star-flip.json'), JSON.stringify(out, null, 1)); await b.close();
  const real = Object.entries(out).filter(([k]) => !k.startsWith('CONTROL')), ctl = Object.entries(out).filter(([k]) => k.startsWith('CONTROL'));
  const ok = real.length === 8 && real.every(([, v]) => v.pass) && ctl.length === 4 && ctl.every(([, v]) => !v.pass);
  console.log(ok ? 'ALL PASS (8/8 real cases pass; 4/4 controls fail as designed)' : 'FAIL'); process.exitCode = ok ? 0 : 1;
})();
