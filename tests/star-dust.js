// Round 6: frames in which any eraser speck (opacity > 0.05) overlaps the row's h3 or meta box, and lift -> name moving.
const { launch, openProto } = require('./lib'); const fs = require('fs');
const FILE = require('./lib').FILE;
const DRIVER = fs.readFileSync(__dirname + '/star-driver.js', 'utf8').match(/const DRIVER = `([\s\S]*?)`;/)[1];
const PROBE = `window.__probe = (idx) => { const el = document.querySelectorAll('#locationsList .location-card')[idx]; window.__plog = []; let run = true;
  const tick = () => { if (!run) return; const h = el.querySelector('h3'), m = el.querySelector('.row-meta'); const hr = h.getBoundingClientRect(), mr = m.getBoundingClientRect();
    let hits = 0; el.querySelectorAll('.sg-crumb').forEach(c => { if (parseFloat(getComputedStyle(c).opacity) <= 0.05) return; const r = c.getBoundingClientRect();
      const ov = b => r.right > b.left && r.left < b.right && r.bottom > b.top && r.top < b.bottom; if (ov(hr) || ov(mr)) hits++; });
    window.__plog.push({ t: performance.now(), hx: hr.left, hits, crumbs: el.querySelectorAll('.sg-crumb').length }); requestAnimationFrame(tick); };
  requestAnimationFrame(tick); return () => { run = false; }; };`;
(async () => {
  const b = await launch(); const rows = []; let total = 0, worstLift = 0;
  const cities = ['reykjavik', 'copenhagen', 'malmo', 'stockholm', 'la'];
  const cfgs = [];
  for (const reduced of [false, true]) for (const city of cities) for (const hi of [false, true]) for (const [nm, name] of [['long', null], ['short', 'Kaffibarinn']]) for (const visited of [true, false])
    cfgs.push({ reduced, city, hi, nm, name, visited, speed: 0.6, action: 'unstar' });
  for (const city of cities) for (const hi of [false, true]) cfgs.push({ reduced: false, city, hi, nm: 'long', name: null, visited: true, speed: 1.2, action: 'unstar' });
  for (const city of cities) for (const hi of [false, true]) cfgs.push({ reduced: false, city, hi, nm: 'short', name: null, visited: false, speed: 0.6, action: 'star' });
  for (const c of cfgs) {
    const idx = c.action === 'unstar' ? 1 : 0;
    const { ctx, page } = await openProto(b, { dsf: 1, file: FILE, city: c.city, hi: c.hi ? idx : -1, reduced: c.reduced });
    await page.evaluate(({ c, idx }) => { applyCityPalette(c.city); if (c.name) locations[idx] = { ...locations[idx], name: c.name }; locations[idx] = { ...locations[idx], visited: c.visited }; updateUI(); }, { c, idx });
    await page.addScriptTag({ content: DRIVER + PROBE });
    const r = await page.evaluate(async ({ idx, sp }) => { const stop = __probe(idx); const t0 = performance.now(); const { endT } = await __swipe(idx, sp, 100, { tail: 900 }); stop();
      const lift = t0 + endT; const after = __plog.filter(f => f.t >= lift);
      let moveAt = null; for (let i = 1; i < after.length; i++) if (Math.abs(after[i].hx - after[i - 1].hx) > 0.1 && after[i].hx < after[i - 1].hx) { moveAt = after[i].t - lift; break; }
      return { hitFrames: __plog.filter(f => f.hits > 0).length, dustFrames: __plog.filter(f => f.crumbs > 0).length, liftToMoveMs: moveAt === null ? null : Math.round(moveAt), starred: locations[idx].starred }; }, { idx, sp: c.speed });
    total += r.hitFrames; if (r.liftToMoveMs !== null) worstLift = Math.max(worstLift, r.liftToMoveMs);
    rows.push({ ...c, ...r }); await ctx.close();
  }
  const sum = { runs: rows.length, totalSpeckOverTextFrames: total, worstLiftToMoveMs: worstLift, unstarsCorrect: rows.filter(r => r.action === 'unstar').every(r => !r.starred), starsCorrect: rows.filter(r => r.action === 'star').every(r => r.starred) };
  console.log(JSON.stringify(sum)); rows.filter(r => r.hitFrames).forEach(r => console.log('HIT', JSON.stringify(r)));
  fs.writeFileSync(require('./lib').outPath('star-dust.json'), JSON.stringify({ sum, rows }, null, 1)); await b.close();
  const ok = sum.totalSpeckOverTextFrames === 0 && sum.unstarsCorrect && sum.starsCorrect && sum.worstLiftToMoveMs <= 150; console.log(ok ? 'ALL PASS (0 dust-over-text frames, lift->move <=150ms)' : 'FAIL'); process.exitCode = ok ? 0 : 1;
})();
