// Un-visit, round 2: two real-time checks per option, in the real page (Aurora, its row on screen).
//  1. SYNC: tap Visited on the open tag; every animation frame, read the row stamp's scale (vsReplay's
//     erase pop, inline transform) and the tag's leaving stamp's scale (relative to its resting
//     scale). Reports the first frame each leaves 1.0, and both curves frame by frame.
//  2. RE-TAP: tap, then tap again 150ms later. After 40ms: no leaving copy left, the stamp-in is
//     playing, aria-pressed is "true" again. (The leaving copy has pointer-events:none as shipped.)
//   node design/popup-hierarchy/unvisit/sync.js   -> sync.json
const path = require('path'), fs = require('fs'), os = require('os');
const { launch, openProto, W, FILE } = require('../../gesture-harness/lib');
const OPT = require('./options');
const copyFor = key => { const f = path.join(os.tmpdir(), `unvisit-sync-${key}.html`); fs.writeFileSync(f, fs.readFileSync(FILE, 'utf8').replace('</head>', `<style>${OPT[key].css}</style>\n${OPT[key].strokes ? OPT.ERASE_JS : ''}${OPT[key].blot ? OPT.BLOT_JS : ''}${OPT[key].dry3 ? OPT.DRY3_JS : ''}${process.env.NOSYNC ? '' : OPT.SYNC_JS}\n</head>`)); return f; };

async function open(b, key) {
  const { ctx, page } = await openProto(b, { dsf: 1, file: copyFor(key) });
  await page.evaluate(async () => { const r = window.__ROWS.find(x => x.id === 'rey07'); r.visited = true; await refetchLocations(); });
  await W(200);
  await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 16, { animate: false }); setHighlighted('rey07'); markersById.get('rey07').marker.openPopup(); });
  await W(1000);
  // bring Aurora's row into the list's view (the replay only plays on an on-screen row)
  await page.evaluate(() => { const l = document.getElementById('locationsList'), r = document.querySelector('.location-card[data-id="rey07"]');
    l.scrollTop += r.getBoundingClientRect().top - l.getBoundingClientRect().top - 40; l.dispatchEvent(new Event('scroll')); });
  await W(300);
  return { ctx, page };
}

(async () => {
  const b = await launch(); const out = {};
  for (const key of (process.env.KEYS || 'lift,dry,strike,erase').split(',')) {
    let { ctx, page } = await open(b, key);
    const onScreen = await page.evaluate(() => { const el = document.querySelector('.location-card[data-id="rey07"]'), l = document.getElementById('locationsList'); if (!el) return false; const r = el.getBoundingClientRect(), lr = l.getBoundingClientRect(); return r.bottom > lr.top && r.top < lr.bottom; });
    const frames = await page.evaluate(() => new Promise(res => {
      const S = 1.1, rows = [];
      const read = () => {
        const rs = document.querySelector('.location-card[data-id="rey07"] .row-stamp');
        const m = rs && rs.style.transform.match(/scale\(([\d.]+)\)/);
        const ts = document.querySelector('.tag-popup .tag-stamp-out');
        let tsc = null; if (ts) { const mm = getComputedStyle(ts).transform.match(/matrix\(([^)]+)\)/); if (mm) { const [a, b2] = mm[1].split(',').map(Number); tsc = Math.hypot(a, b2) / S; } }
        rows.push({ t: +(performance.now() - t0).toFixed(1), row: m ? +(+m[1]).toFixed(4) : 1, tag: tsc === null ? null : +tsc.toFixed(4) });
      };
      document.querySelector('.tag-popup .popup-visited').click();
      const t0 = performance.now(); let n = 0;
      const step = () => { read(); if (++n < 24) requestAnimationFrame(step); else res(rows); };
      requestAnimationFrame(step);
    }));
    const first = k => { const i = frames.findIndex(f => f[k] !== null && Math.abs(f[k] - 1) > 0.002); return i < 0 ? null : i; };
    await ctx.close();
    ({ ctx, page } = await open(b, key));
    const retap = await page.evaluate(() => new Promise(res => {
      document.querySelector('.tag-popup .popup-visited').click();
      setTimeout(() => {
        const btn = document.querySelector('.tag-popup .popup-visited'); const pe = getComputedStyle(document.querySelector('.tag-popup .tag-stamp-out') || btn).pointerEvents;
        btn.click();
        setTimeout(() => res({ leavingCopyPointerEvents: pe, leftoverLeavingCopies: document.querySelectorAll('.tag-popup .tag-stamp-out').length,
          stampInPlaying: !!document.querySelector('.tag-popup .row-stamp.tag-stamp-in'), ariaPressed: document.querySelector('.tag-popup .popup-visited').getAttribute('aria-pressed') }), 40);
      }, 150);
    }));
    await ctx.close();
    out[key] = { rowOnScreen: onScreen, firstMovingFrame: { row: first('row'), tag: first('tag') }, frames, retap };
    console.log(key, 'row on screen', onScreen, 'first moving frame row/tag', first('row'), first('tag'), 'retap', JSON.stringify(retap));
    console.log('   ', frames.slice(0, 10).map(f => `${f.t}ms r${f.row} t${f.tag}`).join(' | '));
  }
  fs.writeFileSync(path.join(__dirname, process.env.NOSYNC ? 'sync-nosync.json' : 'sync.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
