// The sticker's drag-grow -> place hand-off, per frame from the REAL DOM (owner: "now there's a pop between the grow
// animation and the flap animation... it should be one fluid randomized animation"). Stepped clock (as anim.js) at 3x;
// every frame records scale, travel offset and flap (fh, L) of the sticker, then reports the largest frame-to-frame
// jump. Scenes: row swipe (to the press and hold, release, un-press), a map pin placed. env MS (step ms, default 4).
//   node fluid.js [label]    -> prints JSON to stdout
const L = require('../../gesture-harness/lib');
const MS = +(process.env.MS || 4);
const clock = page => page.evaluate(() => {
  window.__t = performance.now(); window.__raf = []; sgNow = () => window.__t;
  window.requestAnimationFrame = cb => { window.__raf.push(cb); return window.__raf.length; };
  window.__step = ms => { window.__t += ms; const q = window.__raf; window.__raf = []; q.forEach(cb => cb(window.__t));
    document.getAnimations().forEach(a => { if (a.__ct == null) { a.pause(); a.__ct = 0; } a.__ct += ms; a.currentTime = a.__ct; }); };
  window.__rec = null; window.__pose = null;
  const pr = window.poseRowSticker; window.poseRowSticker = (st, fh, l) => { window.__pose = [fh, l]; return pr(st, fh, l); };
  const pp = window.stickerPinParts; window.stickerPinParts = o => { window.__pose = o.pose ? [o.pose[0], o.pose[1]] : [0, 0.94]; return pp(o); };
});
const stepP = (page, ms) => page.evaluate(ms => window.__step(ms), ms);
const sample = (page, sel) => page.evaluate(sel => { const s = sel === 'PIN' ? markersById.get(window.__pid).marker.getElement().querySelector('.stk-pin') : document.querySelector(sel); if (!s) return null; const m = new DOMMatrix(getComputedStyle(s).transform);
  return { t: window.__t, sc: Math.hypot(m.a, m.b), x: m.e, y: m.f, fh: (window.__pose || (window.__pose = typeof vsRowStartPose === 'function' ? vsRowStartPose(s) : ROW_STICKER_POSE.lift))[0], L: window.__pose[1], op: +getComputedStyle(s).opacity }; }, sel);
function jumps(fr) { const o = { sc: 0, pos: 0, fh: 0, L: 0 }, at = {}; for (let i = 1; i < fr.length; i++) { const a = fr[i - 1], b = fr[i]; if (!a || !b) continue;
  const d = { sc: Math.abs(b.sc - a.sc), pos: Math.hypot(b.x - a.x, b.y - a.y), fh: Math.abs(b.fh - a.fh), L: Math.abs(b.L - a.L) };
  for (const k in o) if (d[k] > o[k]) { o[k] = d[k]; at[k] = i; } } return { max: o, at }; }
(async () => {
  const b = await L.launch(), out = {};
  { // row: drag 70px over 280ms in MS steps, hold, release
    const { ctx, page, cdp } = await L.openProto(b, { dsf: 3 }); await L.rowRect(page, 0); await L.W(150);
    const g = await page.evaluate(() => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[0]; const r = el.getBoundingClientRect(), x = el.querySelector('.delete-btn').getBoundingClientRect(); return { y: r.y + r.height / 2, xc: x.x + x.width / 2 }; });
    await clock(page); const fr = [], N = Math.round(280 / MS), SEL = '.row-stamp.vs-carry';
    await L.T(cdp, 'touchStart', g.xc, g.y); await stepP(page, MS);
    for (let i = 1; i <= N; i++) { await L.T(cdp, 'touchMove', g.xc - 70 * i / N, g.y); await stepP(page, MS); fr.push(await sample(page, SEL)); }
    for (let i = 0; i < Math.round(700 / MS); i++) { await stepP(page, MS); fr.push(await sample(page, SEL)); }
    out.row = { frames: fr.length, ...jumps(fr), trace: fr.filter((f, i) => i % Math.round(20 / MS) === 0).map(f => f && [+f.sc.toFixed(3), +f.x.toFixed(2), +f.y.toFixed(2), +f.fh.toFixed(3), +f.L.toFixed(3)]) };
    await ctx.close(); }
  { // row un-press: travel to 62px, back to 40px (below 52), then forward again
    const { ctx, page, cdp } = await L.openProto(b, { dsf: 3 }); await L.rowRect(page, 0); await L.W(150);
    const g = await page.evaluate(() => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[0]; const r = el.getBoundingClientRect(), x = el.querySelector('.delete-btn').getBoundingClientRect(); return { y: r.y + r.height / 2, xc: x.x + x.width / 2 }; });
    await clock(page); const fr = [], SEL = '.row-stamp.vs-carry';
    const path = []; for (let x = 0; x <= 70; x += 1.5) path.push(x); for (let x = 70; x >= 44; x -= 1.5) path.push(x); for (let x = 44; x <= 70; x += 1.5) path.push(x);
    await L.T(cdp, 'touchStart', g.xc, g.y); await stepP(page, MS);
    for (const x of path) { await L.T(cdp, 'touchMove', g.xc - x, g.y); await stepP(page, MS); fr.push(await sample(page, SEL)); }
    for (let i = 0; i < Math.round(700 / MS); i++) { await stepP(page, MS); fr.push(await sample(page, SEL)); }
    out.unpress = { frames: fr.length, ...jumps(fr) }; await ctx.close(); }
  { // pin: the app's own visited toggle
    const { ctx, page } = await L.openProto(b, { dsf: 3 }); await page.evaluate(() => document.getElementById('locations').classList.add('collapsed')); await L.W(200);
    const id = await page.evaluate(() => { const l = locations.filter(l => !l.visited && l.city === 'reykjavik' && !l.starred && Math.abs(stickerCorner(l.id, l.starred) - 45) < 8)[0]; map.setView([l.lat, l.lng], 16, { animate: false }); return l.id; });
    await L.W(700); await clock(page);
    await page.evaluate(id => { window.__pid = id; toggleLocationFlag(id, 'visited'); }, id);
    const fr = []; for (let i = 0; i < Math.round(760 / MS); i++) { fr.push(await sample(page, 'PIN')); await stepP(page, MS); }
    fr.unshift({ ...fr[0], sc: 1, x: 0, y: 0 });   // the to-do badge it replaces
    out.pin = { frames: fr.length, ...jumps(fr), first: fr[0] && [fr[0].sc, fr[0].x, fr[0].y, fr[0].fh, fr[0].L] }; await ctx.close(); }
  console.log(JSON.stringify(out, null, 1)); await b.close();
})();
