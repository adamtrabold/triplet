// Round 8: the landing curve at REAL timing (rAF, 60Hz), row and popup: frames >=1.3x, frames <=0.97x, peak/undershoot/rest times, clearance.
const { launch, openProto } = require('./lib'); const fs = require('fs');
const FILE = require('./lib').FILE;
const DRIVER = fs.readFileSync(__dirname + '/star-driver.js', 'utf8').match(/const DRIVER = `([\s\S]*?)`;/)[1];
const SAMPLER = `window.__sample = (getInk, getText) => { const L = []; let t0 = null, run = true;
  const tick = now => { if (!run) return; const ink = getInk(); if (ink) { if (t0 === null) t0 = now; const m = new DOMMatrix(getComputedStyle(ink).transform === 'none' ? undefined : getComputedStyle(ink).transform);
      const sc = Math.hypot(m.a, m.b), rot = Math.atan2(m.b, m.a) * 180 / Math.PI; const r = ink.querySelector ? (ink.querySelector('.sg-inkp') || ink).getBoundingClientRect() : ink.getBoundingClientRect(); const tx = getText();
      L.push({ t: Math.round(now - t0), sc: +sc.toFixed(3), rot: +rot.toFixed(1), gapName: tx ? +(tx.nameL - r.right).toFixed(2) : null, gapBadge: tx && tx.badgeR !== null ? +(r.left - tx.badgeR).toFixed(2) : null }); }
    requestAnimationFrame(tick); };
  requestAnimationFrame(tick); return () => { run = false; return L; }; };`;
const summarize = L => { const peak = L.reduce((a, b) => b.sc > a.sc ? b : a, L[0]); const under = L.reduce((a, b) => b.sc < a.sc ? b : a, L[0]);
  const rest = L.find((f, i) => i > L.indexOf(under) && Math.abs(f.sc - 1) < 0.002 && Math.abs(f.rot) < 0.2);
  return { framesAtOrAbove1_3: L.filter(f => f.sc >= 1.3).length, framesAtOrBelow0_97: L.filter(f => f.sc <= 0.97).length, peak: [peak.sc, peak.t + 'ms'], undershoot: [under.sc, under.t + 'ms'], restAt: rest ? rest.t + 'ms' : null,
    minGapName: Math.min(...L.map(f => f.gapName).filter(v => v !== null)), minGapBadge: Math.min(...L.map(f => f.gapBadge).filter(v => v !== null)) }; };
(async () => { const b = await launch(); const out = {};
  for (const hi of [-1, 0]) { const { ctx, page } = await openProto(b, { dsf: 1, file: FILE, hi }); await page.addScriptTag({ content: DRIVER + SAMPLER });
    const L = await page.evaluate(async () => { const el = document.querySelectorAll('#locationsList .location-card')[0];
      const stop = __sample(() => { const s = el.querySelector('.sg-star.inked .sg-ink'); return s; }, () => { const h = el.querySelector('h3'); const tn = [...h.childNodes].find(x => x.nodeType === 3 && x.nodeValue.trim()); const rg = document.createRange(); rg.setStart(tn, 0); rg.setEnd(tn, 1);
        return { nameL: Math.min(rg.getBoundingClientRect().left, el.querySelector('.row-meta').getBoundingClientRect().left), badgeR: el.querySelector('.row-badge').getBoundingClientRect().right }; });
      await __swipe(0, 0.6, 100, { tail: 900 }); return stop(); });
    out[`row${hi === 0 ? ' highlighted' : ''}`] = summarize(L);  if (hi < 0) out.rowFrames = L; await ctx.close(); }
  { const { ctx, page } = await openProto(b, { dsf: 1, file: FILE }); await page.addScriptTag({ content: SAMPLER });
    const L = await page.evaluate(async () => { const loc = locations[0]; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI();
      markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 500));
      let started = false; const stop = __sample(() => { const s = document.querySelector('.leaflet-popup .sgp .sg-ink'); if (!s) return null; if (!started && parseFloat(getComputedStyle(s).opacity) < 0.5) return null; started = true; return s; },
        () => { const tt = document.querySelector('.leaflet-popup .popup-title'); const rg = document.createRange(); rg.setStart(tt.firstChild, 0); rg.setEnd(tt.firstChild, 1); return { nameL: rg.getBoundingClientRect().left, badgeR: null }; });
      document.querySelector('.leaflet-popup .popup-star').click(); await new Promise(r => setTimeout(r, 1000)); return stop(); });
    out.popup = summarize(L); out.popupFrames = L; await ctx.close(); }
  const chk = (n, v, min, minDip) => { const ok = v.framesAtOrAbove1_3 >= min && v.framesAtOrBelow0_97 >= minDip; console.log((ok ? 'PASS ' : 'FAIL ') + n + ' frames>=1.3x:' + v.framesAtOrAbove1_3 + ' (need ' + min + (min === 10 ? ', 11 nominal' : '') + ') frames<=0.97x:' + v.framesAtOrBelow0_97 + ' (need ' + minDip + ') peak ' + v.peak + ' rest ' + v.restAt + ' minGapName ' + v.minGapName); return ok; };
  const okAll = [chk('row', out.row, 10, 3), chk('row highlighted', out['row highlighted'], 10, 3), chk('popup', out.popup, 8, 3)].every(Boolean);  // highlighted/row: 10 tolerated, frame-phase jitter (see CLAUDE.md)
  console.log(okAll ? 'ALL PASS' : 'SOME FAILED'); fs.writeFileSync(require('./lib').outPath('star-curve.json'), JSON.stringify(out, null, 1)); await b.close(); process.exitCode = okAll ? 0 : 1; })();
