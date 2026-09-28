// Popup -> row STAR replay, both directions: per-frame dust-over-text, glyph rule (changes only while the name moves, >=3 motion frames after), ink pop frames, timings. env PROTO, OUT.
const L = require('./lib'); const fs = require('fs'); const W = ms => new Promise(r => setTimeout(r, ms));
(async () => { const b = await L.launch(); const res = []; let dust = 0, glyphBad = 0;
  for (const city of ['reykjavik', 'copenhagen', 'malmo', 'stockholm']) for (const hi of [false, true]) for (const [nm, name] of [['long', 'Swedish Museum of Performing Arts Scenkonstmuseet'], ['short', 'Kaffibarinn']]) for (const visited of [false, true]) {
    const idx = 2; const { ctx, page } = await L.openProto(b, { dsf: 1, file: L.FILE, city, hi: hi ? idx : -1 });
    const r = await page.evaluate(async ([idx, name, visited, city]) => { applyCityPalette(city); locations[idx] = { ...locations[idx], name, visited, starred: false }; updateUI();
      const loc = locations[idx]; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI(); markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 300));
      const el = cardsById.get(loc.id).el; const out = {};
      for (const dir of ['star', 'unstar']) { const f = []; let run = true;
        const tick = () => { if (!run) return; const h = el.querySelector('h3'), m = el.querySelector('.row-meta'); const hr = h.getBoundingClientRect(), mr = m.getBoundingClientRect();
          let hits = 0; el.querySelectorAll('.sg-crumb').forEach(c => { if (parseFloat(getComputedStyle(c).opacity) <= 0.05) return; const r = c.getBoundingClientRect(); const ov = b => r.right > b.left && r.left < b.right && r.bottom > b.top && r.top < b.bottom; if (ov(hr) || ov(mr)) hits++; });
          const ink = el.querySelector('.sg-star .sg-ink'); let sc = null, ssc = null; const sv = el.querySelector('.sg-star'); if (sv) { const m2 = new DOMMatrix(getComputedStyle(sv).transform); ssc = Math.hypot(m2.a, m2.b); } if (ink) { const mm = new DOMMatrix(getComputedStyle(ink).transform); sc = Math.hypot(mm.a, mm.b); }
          const tx = (new DOMMatrix(getComputedStyle(h).transform)).e;
          f.push({ t: performance.now(), hits, tx: +tx.toFixed(2), printed: !!el.querySelector('.row-main > .row-star:not(.sg-star)'), txt: h.textContent, hw: +h.getBoundingClientRect().width.toFixed(1), live: !!el.querySelector('.sg-star'), sc, ssc, crumbs: el.querySelectorAll('.sg-crumb').length });
          requestAnimationFrame(tick); };
        requestAnimationFrame(tick); await new Promise(r => setTimeout(r, 50));
        const t0 = performance.now(); document.querySelector('.leaflet-popup .popup-star').click(); await new Promise(r => setTimeout(r, 1200)); run = false;
        const ff = f.filter(x => x.t >= t0); let bad = 0, changes = 0;
        for (let i = 1; i < ff.length; i++) if (ff[i].printed !== ff[i - 1].printed || ff[i].hw !== ff[i - 1].hw) { changes++; const moving = ff.slice(i, i + 4).filter(x => Math.abs(x.tx) > 0.05).length; if (moving < 4) bad++; }
        const liveF = ff.filter(x => x.live), last = liveF.length ? liveF[liveF.length - 1].t - t0 : 0, firstCrumb = ff.find(x => x.crumbs > 0), rest = [...ff].reverse().find((x, i, a) => i + 1 < a.length && Math.abs(a[i + 1].tx) > 0.05);
        const pk = Math.max(...ff.filter(x => x.sc).map(x => x.sc));
        out[dir] = { dustFrames: ff.reduce((a, x) => a + x.hits, 0), glyphChanges: changes, glyphAtRest: bad, liveMs: Math.round(last), popPeak: +pk.toFixed(3), framesGe13: ff.filter(x => x.sc >= 1.3).length, liftPeak: +Math.max(1, ...ff.filter(x => x.ssc).map(x => x.ssc)).toFixed(3), liftFramesGe105: ff.filter(x => x.ssc >= 1.05).length,
          dustAtMs: firstCrumb ? Math.round(firstCrumb.t - t0) : null, restMs: rest ? Math.round(rest.t - t0) : null, starredEnd: locations[idx].starred, printedEnd: ff[ff.length - 1].printed, maxTx: Math.max(...ff.map(x => Math.abs(x.tx))) }; }
      return out; }, [idx, name, visited, city]);
    dust += r.star.dustFrames + r.unstar.dustFrames; glyphBad += r.star.glyphAtRest + r.unstar.glyphAtRest; res.push({ city, hi, nm, visited, ...r }); console.log(city, hi, nm, visited, JSON.stringify(r)); await ctx.close(); }
  const sum = { cases: res.length * 2, dustOverTextFrames: dust, glyphChangesAtRest: glyphBad, allEndCorrect: res.every(x => x.star.starredEnd && x.star.printedEnd && !x.unstar.starredEnd && !x.unstar.printedEnd) };
  console.log('SUMMARY', JSON.stringify(sum)); fs.writeFileSync(L.outPath('replay.json'), JSON.stringify({ sum, res }, null, 1)); 
  const okR = sum.cases === 64 && sum.dustOverTextFrames === 0 && sum.glyphChangesAtRest === 0 && sum.allEndCorrect; console.log(okR ? 'ALL PASS (64 replays)' : 'FAIL'); await b.close(); process.exitCode = okR ? 0 : 1; })();
