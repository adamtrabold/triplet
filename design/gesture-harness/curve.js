// CURVE SUITE -- `curve8.js` of the gate (docs/shipped.md Pencil Star rounds 7-8,
// design/pencil-star/r8-design.md section 1). The STAR_POP spin-stamp ink landing,
// measured in-page per rAF at 60Hz in real time: frames at >= 1.3x and frames at
// <= 0.97 from the ink landing to rest, plus the peak and the rest state.
//   row (plain), row (highlighted): real CDP star strokes (0.6px/ms, 100px)
//   popup: a click on the popup star (CSS @keyframes sgpPress), 700ms after the tag opens (its pan + pop-out, ~550ms, are done)
// Rule (r8): row >= 11 frames >= 1.3x and >= 3 <= 0.97; popup >= 8 and >= 3.
// Frame-phase jitter: docs/shipped.md swipe-visit gates accept "row 11 frames >= 1.3x
// in 9/10 runs (main also shows an occasional 10)". Gate: per kind, >= 9 of RUNS runs
// meet the >=1.3x count, every run meets the <=0.97 count, peak within 0.01 of the
// table's peak (1.4), and the ink rests at scale 1, rotation 0.
// RUNS=10 FILE=<index.html> OUT=<json> node curve.js
const { launch, openProto, drag, line, rowRect, W, recorder } = require('./lib');
const { rec, finish } = recorder('curve');
const RUNS = +(process.env.RUNS || 10);
const SAMPLER = () => { window.__curve = (find) => { const out = []; let run = true; const t0 = performance.now();
  const tick = () => { if (!run) return; const ink = find(); if (ink) { const m = new DOMMatrix(getComputedStyle(ink).transform); const an = ink.getAnimations()[0]; out.push({ t: performance.now() - t0, sc: Math.hypot(m.a, m.b), rot: Math.atan2(m.b, m.a) * 180 / Math.PI, ct: an && an.currentTime !== null ? +Number(an.currentTime).toFixed(1) : null }); } requestAnimationFrame(tick); };
  requestAnimationFrame(tick); return () => { run = false; return out; }; }; };
function measure(f) {
  const i = f.findIndex(x => Math.abs(x.sc - 1) > 1e-3 || Math.abs(x.rot) > 1e-3);   // the landing: first transformed frame
  const a = i < 0 ? [] : f.slice(i); const peak = a.length ? Math.max(...a.map(x => x.sc)) : 0;
  const tPeak = a.length ? a.find(x => x.sc === peak).t - a[0].t : null;
  // phase: the animation's own currentTime at the sampled frames (STAR_POP's >=1.3x window is 31.4-199.9ms, 10.11 frames at 60Hz:
  // an 11th frame fits only if the samples' phase puts one in the 1.8ms slack)
  const hiCt = a.filter(x => x.sc >= 1.3).map(x => x.ct);
  return { hi: a.filter(x => x.sc >= 1.3).length, lo: a.filter(x => x.sc <= 0.97).length, peak: +peak.toFixed(4), tPeak: tPeak && Math.round(tPeak), frames: a.length, hiCt: hiCt.length ? [hiCt[0], hiCt[hiCt.length - 1]] : null };
}
(async () => {
  const b = await launch(); const sum = {};
  for (const kind of ['row', 'row highlighted', 'popup']) { sum[kind] = [];
    for (let k = 0; k < RUNS; k++) {
      const { ctx, page, cdp } = await openProto(b, {}); await page.evaluate(SAMPLER);
      let f, rest;
      if (kind !== 'popup') {
        const id = await page.evaluate(hl => { const id = __rowIds()[0]; if (hl) setHighlighted(id); return id; }, kind.includes('highlighted'));
        const q = await rowRect(page, 0); const y = q.y + q.h / 2;
        await page.evaluate(id => { window.__cstop = __curve(() => { const s = document.querySelector(`.location-card[data-id="${id}"] .sg-star.inked .sg-ink`) || document.querySelector(`.location-card[data-id="${id}"] .sg-star .sg-ink`); return s && s.closest('.inked') ? s : null; }); }, id);
        await drag(page, cdp, line(170, y, 270, y, 10), { stepMs: 16.7 }); await W(1100);
        f = await page.evaluate(() => __cstop());
      } else {
        await page.evaluate(async () => { const id = __rowIds()[0]; const loc = locations.find(l => l.id === id); map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 100)); updateUI();
          markersById.get(id).marker.openPopup(); await new Promise(r => setTimeout(r, 700)); });
        await page.evaluate(() => { window.__cstop = __curve(() => document.querySelector('.leaflet-popup .sgp-in .sg-ink')); document.querySelector('.leaflet-popup .popup-star').click(); });
        await W(900); f = await page.evaluate(() => __cstop());
      }
      const m = measure(f); rest = f[f.length - 1] || { sc: 0, rot: 99 }; m.rest = { sc: +rest.sc.toFixed(4), rot: +rest.rot.toFixed(3) };
      sum[kind].push(m); console.log(`${kind.padEnd(16)} run ${k + 1}: ${m.hi} frames >=1.3x, ${m.lo} <=0.97, peak ${m.peak} at ${m.tPeak}ms, >=1.3x at currentTime ${m.hiCt && m.hiCt.join('..')}ms, rest ${m.rest.sc}/${m.rest.rot}deg`);
      await ctx.close();
    }
  }
  const need = { row: 11, 'row highlighted': 11, popup: 8 };
  for (const [kind, ms] of Object.entries(sum)) {
    const meets = ms.filter(m => m.hi >= need[kind]).length, dips = ms.every(m => m.lo >= 3), peaks = ms.every(m => Math.abs(m.peak - 1.4) <= 0.01), rests = ms.every(m => Math.abs(m.rest.sc - 1) < 1e-3 && Math.abs(m.rest.rot) < 0.01);
    const his = ms.map(m => m.hi), los = ms.map(m => m.lo);
    rec('full', `${kind}: >=1.3x frames ${his.join(',')} (>= ${need[kind]} in ${meets}/${ms.length}; need >= ${Math.ceil(0.9 * ms.length)}), <=0.97 frames ${los.join(',')} (>= 3 every run), peak 1.4, rest 1/0deg`,
      meets >= Math.ceil(0.9 * ms.length) && dips && peaks && rests, { his, los, peaks: ms.map(m => m.peak), rests: ms.map(m => m.rest) });
  }
  const best = k => { const ms = sum[k]; const mh = Math.min(...ms.map(m => m.hi)), mx = Math.max(...ms.map(m => m.hi)); return `${mh === mx ? mh : mh + '-' + mx}/${Math.min(...ms.map(m => m.lo))}`; };
  console.log(`curve8 row ${best('row')}, highlighted ${best('row highlighted')}, popup ${best('popup')} (frames >=1.3x / min frames <=0.97)`);
  const ok = finish({ summary: { row: best('row'), highlighted: best('row highlighted'), popup: best('popup') }, runs: sum }); await b.close(); process.exitCode = ok ? 0 : 1;
})();
