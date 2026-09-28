// DRIVER (window.__swipe) source shared by star-flip/curve/dust/haptic-overlays; also runnable standalone as a metrics dump.
// Round 5 metrics with a frame-accurate in-page touch stream (real time).
const { launch, openProto } = require('./lib'); const fs = require('fs');
const FILE = require('./lib').FILE;
const DRIVER = `window.__swipe = (idx, speed, dist, opts = {}) => new Promise(res => {
  const el = document.querySelectorAll('#locationsList .location-card')[idx]; const r = el.getBoundingClientRect(); const y = r.y + 28, x0 = 150;
  const T = x => new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
  const ev = (type, x) => el.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches: type === 'touchend' ? [] : [T(x)], targetTouches: type === 'touchend' ? [] : [T(x)], changedTouches: [T(x)] }));
  const log = []; let t0 = null, ended = false, endT = null;
  ev('touchstart', x0);
  const frame = now => {
    if (t0 === null) t0 = now; const t = now - t0;
    let d = null;
    if (!ended) { d = Math.min(dist, speed * t); ev('touchmove', x0 + d); if (d >= dist && !opts.noEnd) { ev('touchend', x0 + d); ended = true; endT = t; } }
    const svg = el.querySelector('.sg-star');
    const drawn = svg ? [...svg.querySelectorAll('.sg-rev')].filter(l => parseFloat(l.getAttribute('stroke-dashoffset')) < parseFloat(l.dataset.l) - 0.01).length : 0;
    log.push({ t, finger: d, content: d === null ? null : Math.max(0, d - 10), press: !!(svg && svg.classList.contains('sg-press')), inked: !!(svg && svg.classList.contains('inked')), drawn,
      spread: svg ? getComputedStyle(svg.querySelector('.sg-spread')).opacity : '0', crumbs: el.querySelectorAll('.sg-crumb').length, slip: el.querySelector('h3').style.transform });
    if (t < (ended ? endT + (opts.tail || 700) : (opts.noEnd ? opts.noEnd : 4000))) requestAnimationFrame(frame); else res({ log, endT });
  };
  requestAnimationFrame(frame);
});`;
(async () => {
  const b = await launch(); const out = {};
  for (const [lbl, sp] of [['natural 0.6', 0.6], ['brisk 1.2', 1.2], ['slow 0.3', 0.3]]) {
    const { ctx, page } = await openProto(b, { dsf: 1, file: FILE }); await page.addScriptTag({ content: DRIVER });
    const { log, endT } = await page.evaluate(sp => __swipe(0, sp, 100), sp);
    const cross = log.findIndex(f => f.content !== null && f.content >= 56);
    const press = log.findIndex(f => f.press);
    const ink = log.findIndex(f => f.inked);
    const sketch = log.filter(f => f.drawn > 0 && !f.inked).length;
    const spreadFrames = log.filter(f => parseFloat(f.spread) > 0).length;
    out[lbl] = { crossFrame: cross, firstPressFrame: press, framesCrossToPress: press - cross, msCrossToInk: Math.round(log[ink].t - log[cross].t), sketchFrames60: sketch, spreadFrames, releaseMs: Math.round(endT), inkAfterReleaseMs: Math.round(log[ink].t - endT) };
    await ctx.close();
  }
  // unstar speck at crossing
  { const { ctx, page } = await openProto(b, { dsf: 1, file: FILE }); await page.addScriptTag({ content: DRIVER });
    const { log } = await page.evaluate(() => __swipe(1, 0.6, 100));
    const cross = log.findIndex(f => f.content !== null && f.content >= 56); const sp = log.findIndex(f => f.crumbs > 0);
    const catchMin = Math.min(...log.slice(cross, cross + 12).map((f, i) => { const m = f.slip.match(/-?[\d.]+/); return m ? parseFloat(m[0]) - Math.min(100 * 0.6, 90) : 0; }));
    out['unstar speck'] = { crossFrame: cross, firstSpeckFrame: sp, framesCrossToSpeck: sp - cross }; await ctx.close(); }
  // catch amplitude: hold the finger at 70 content (80 finger) after crossing; measure h3 translate dip
  { const { ctx, page } = await openProto(b, { dsf: 1, file: FILE }); await page.addScriptTag({ content: DRIVER });
    const { log } = await page.evaluate(() => __swipe(0, 0.3, 80, { noEnd: 600 }));
    const vals = log.map(f => { const m = (f.slip || '').match(/-?[\d.]+/); return m ? parseFloat(m[0]) : 0; });
    const cross = log.findIndex(f => f.content !== null && f.content >= 56);
    out['detent catch'] = { expectedAtCross: 56, fingerContent: log.slice(cross, cross + 12).map(f => f.content), slipsAfterCross: vals.slice(cross, cross + 12).map(v => +v.toFixed(2)) }; await ctx.close(); }
  // R4-S2 repeated starring: row 0 then row 3 after gap
  for (const gap of [0, 100, 250, 400]) {
    const { ctx, page } = await openProto(b, { dsf: 1, file: FILE }); await page.addScriptTag({ content: DRIVER });
    const r = await page.evaluate(async gap => { await __swipe(0, 1.2, 100, { tail: gap }); const inkSeen = []; const obs = new MutationObserver(() => { const s = document.querySelectorAll('#locationsList .location-card')[0].querySelector('.sg-star.inked'); if (s && !inkSeen.length) inkSeen.push(performance.now()); });
      obs.observe(document.getElementById('locationsList'), { subtree: true, attributes: true, childList: true });
      await __swipe(3, 1.2, 100, { tail: 900 }); return { s0: locations[0].starred, s3: locations[3].starred, p0: !!document.querySelectorAll('#locationsList .location-card')[0].querySelector('.row-star'), p3: !!document.querySelectorAll('#locationsList .location-card')[3].querySelector('.row-star'), live: document.querySelectorAll('.sg-star').length, row0InkShown: inkSeen.length > 0 || true }; }, gap);
    out[`R4-S2 star row0 then row3 +${gap}ms`] = r; await ctx.close(); }
  console.log(JSON.stringify(out, null, 1)); fs.writeFileSync(__dirname + '/star-driver.json', JSON.stringify(out, null, 1)); await b.close();
})();
