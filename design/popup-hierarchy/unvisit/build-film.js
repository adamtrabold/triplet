// BUILD filmstrips of the shipped un-visit (dry up by thickness + the snap), from the real index.html.
//   node design/popup-hierarchy/unvisit/build-film.js
// Tag: a visited place's tag open, Visited tapped (un-visit) -- the leaving copy's dryClock is paused and
// seeked frame by frame (the filter reads that clock, so the frames are exact), at the three stamp sizes
// (390 -> 1.1x, 320 -> 1.0x, 256 -> 0.85x). Frames: stills/r2/build<w>/<ms>ms@3x.png (the stub, for
// greycheck.js) and stills/build/tag-<w>-film.png. Row: the same dry on a list row's stamp at its own
// 72x32 size (the popup->row replay adds .dry-out to it; here it is added directly so the clock can be
// held -- the replay's lift at 450ms is timer-driven): stills/build/row-film.png.
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const { launch, openProto, W } = require('../../gesture-harness/lib');
const T = [0, 60, 120, 180, 240, 300, 360, 400, 420, 440, 460, 500, 540];
const OUT = path.join(__dirname, 'stills', 'build');
fs.mkdirSync(OUT, { recursive: true });
const seek = (page, sel, t) => page.evaluate(([sel, t]) => {
  document.querySelectorAll(sel).forEach(e => e.getAnimations({ subtree: false }).forEach(a => { a.pause(); a.currentTime = t; }));
  const seg = document.querySelector('.tag-popup .popup-visited.uv-leaving'); if (seg) seg.getAnimations().forEach(a => { a.pause(); a.currentTime = t; });
}, [sel, t]);
(async () => {
  const b = await launch();
  for (const w of [390, 320, 256]) {
    const { ctx, page } = await openProto(b, { w, dsf: 3 });
    const id = await page.evaluate(async () => { const l = locations.find(x => x.visited); map.setView([l.lat, l.lng], 16, { animate: false }); syncMarkerGlyphZoom(); markersById.get(l.id).marker.openPopup(); await new Promise(r => setTimeout(r, 900)); return l.id; });
    await page.evaluate(() => document.querySelector('.tag-popup .popup-visited').click());
    await page.waitForFunction(() => document.querySelector('.tag-popup .tag-stamp-out.dry-out'), null, { timeout: 3000 });
    const dir = path.join(__dirname, 'stills', 'r2', 'build' + w); fs.mkdirSync(dir, { recursive: true });
    const frames = [];
    for (const t of T) {
      await seek(page, '.tag-popup .tag-stamp-out', t); await W(80);
      const r = await page.evaluate(() => { const s = document.querySelector('.tag-popup .tag-stub').getBoundingClientRect(); return { x: s.x, y: s.y - 6, width: s.width, height: s.height + 12 }; });
      const f = path.join(dir, `${String(t).padStart(3, '0')}ms@3x.png`); await page.screenshot({ path: f, clip: r }); frames.push(f);
    }
    // cleanup check: let it finish -> no filter left
    await page.evaluate(() => document.querySelectorAll('.tag-popup .tag-stamp-out').forEach(e => e.getAnimations().forEach(a => a.finish())));
    await W(200);
    const left = await page.evaluate(() => ({ filters: document.querySelectorAll('filter[id^="dry-"]').length, styled: [...document.querySelectorAll('.dry-out')].filter(e => e.style.filter).length }));
    console.log('tag', w, 'after finish', JSON.stringify(left));
    // the Visited segment of each frame (the stub's right third), labelled with its time, side by side
    execFileSync('convert', [...frames.flatMap((f, i) => ['(', f, '-gravity', 'east', '-crop', '36%x100%+0+0', '+repage', '-gravity', 'south', '-background', 'white', '-splice', '0x42',
      '-pointsize', '30', '-fill', '#5A564C', '-annotate', '+0+4', `${T[i]}ms`, ')']), '+append', path.join(OUT, `tag-${w}-film.png`)]);
    await ctx.close();
  }
  // re-tap at 150ms: the stamp-in plays, no leftovers
  { const { ctx, page } = await openProto(b, { w: 390 });
    await page.evaluate(async () => { const l = locations.find(x => x.visited); map.setView([l.lat, l.lng], 16, { animate: false }); syncMarkerGlyphZoom(); markersById.get(l.id).marker.openPopup(); await new Promise(r => setTimeout(r, 900)); });
    await page.evaluate(() => document.querySelector('.tag-popup .popup-visited').click()); await W(150);
    await page.evaluate(() => document.querySelector('.tag-popup .popup-visited').click()); await W(120);
    console.log('re-tap', JSON.stringify(await page.evaluate(() => ({ leaving: document.querySelectorAll('.tag-popup .tag-stamp-out').length, stampIn: !!document.querySelector('.tag-popup .row-stamp.tag-stamp-in'),
      pressed: document.querySelector('.tag-popup .popup-visited').getAttribute('aria-pressed') }))));
    await W(800); console.log('re-tap filters left', await page.evaluate(() => document.querySelectorAll('filter[id^="dry-"]').length));
    await ctx.close(); }
  // row
  { const { ctx, page } = await openProto(b, { w: 390, dsf: 3 });
    const rid = await page.evaluate(() => { const el = [...document.querySelectorAll('#locationsList .location-card.is-visited')].find(e => !e.classList.contains('highlighted')); el.querySelector('.row-stamp').classList.add('dry-out'); return el.dataset.id; });
    const frames = [];
    for (const t of T) {
      await seek(page, `.location-card[data-id="${rid}"] .row-stamp`, t); await W(80);
      const r = await page.evaluate(id => { const s = document.querySelector(`.location-card[data-id="${id}"]`).getBoundingClientRect(); return { x: s.x + s.width - 140, y: s.y, width: 140, height: s.height }; }, rid);
      const f = path.join(OUT, `row-${String(t).padStart(3, '0')}ms@3x.png`); await page.screenshot({ path: f, clip: r }); frames.push(f);
    }
    execFileSync('convert', [...frames, '+append', path.join(OUT, 'row-film.png')]);
    frames.forEach(f => fs.unlinkSync(f));
    await ctx.close(); }
  await b.close();
})();
