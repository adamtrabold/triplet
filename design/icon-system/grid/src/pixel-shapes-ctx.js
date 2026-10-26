// node ctx.js glyphs.json outdir : the star (row + tag) and the + (its button) in the real app, before / after, at 2x and 3x
const lib = require('/home/user/la-trip-map/.claude/worktrees/agent-a41042147b05d84d6/design/gesture-harness/lib.js');
const { chromium } = require('/opt/node22/lib/node_modules/playwright'), fs = require('fs'), path = require('path');
const G = JSON.parse(fs.readFileSync(process.argv[2])), OUT = process.argv[3]; fs.mkdirSync(OUT, { recursive: true });
const solid = d => d.split(/(?=M)/)[0];   // the outer contour only: the star filled (starred)
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const info = {};
  for (const dsf of [2, 3]) for (const st of Object.keys(G)) {
    const { page, ctx } = await lib.openProto(b, { dsf, touch: false });
    const g = G[st];
    const r = await page.evaluate(([g, st, solidStar]) => {
      const out = {};
      const card = document.querySelector('.location-card.is-starred');
      const rs = card.querySelector('.row-star');
      // the row star (starred: solid), drawn 1:1 in a 24 frame centred on its 18px slot; after: the slot on a whole px
      const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('class', rs.getAttribute('class')); svg.setAttribute('viewBox', (st !== 'before') ? '3 3 18 18' : '0 0 24 24'); svg.setAttribute('aria-hidden', 'true'); svg.style.overflow = 'visible';
      svg.innerHTML = `<path fill="currentColor" d="${solidStar}"/>`;
      rs.replaceWith(svg);
      if ((st !== 'before')) { const y = svg.getBoundingClientRect().top; svg.style.marginTop = `${-9 + (Math.round(y) - y)}px`; }
      out.rowStar = svg.getBoundingClientRect().toJSON(); out.card = card.getBoundingClientRect().toJSON();
      // the + (its 24 box): before, the board's drawing shown at 26.4; after, 1:1 and the button on a whole px
      const btn = document.getElementById('floatingAddBtn'), ps = btn.querySelector('svg');
      const s2 = document.createElementNS(ns, 'svg'); s2.setAttribute('viewBox', '0 0 24 24'); s2.setAttribute('width', (st !== 'before') ? '24' : '26.4'); s2.setAttribute('height', (st !== 'before') ? '24' : '26.4');
      s2.innerHTML = `<path fill="currentColor" fill-rule="evenodd" d="${g.plus}"/>`; ps.replaceWith(s2);
      if ((st !== 'before')) { btn.style.transition = 'none'; btn.style.transform = 'none'; const bx = btn.getBoundingClientRect(), pr = btn.offsetParent.getBoundingClientRect(); btn.style.left = `${Math.round(bx.left) - pr.left}px`; btn.style.top = `${Math.round(bx.top) - pr.top}px`; btn.style.bottom = 'auto'; }
      out.btn = btn.getBoundingClientRect().toJSON(); out.plus = s2.getBoundingClientRect().toJSON();
      return out;
    }, [g, st, solid(g.star)]);
    // open the starred row's tag, and an unstarred one's
    for (const which of ['starred', 'open']) {
      await page.evaluate(w => { document.querySelector('.leaflet-popup-close-button')?.click(); }, which);
      const card = which === 'starred' ? '.location-card.is-starred' : '.location-card:not(.is-starred)';
      await page.evaluate(sel => { const c = document.querySelector(sel); highlightMarker(+c.dataset.id || c.dataset.id); }, card);
      await page.waitForSelector('.leaflet-popup .tag-star', { timeout: 8000 }); await page.waitForTimeout(900);
      const t = await page.evaluate(([d, which, st]) => {
        const ts = document.querySelector('.leaflet-popup .tag-star'), ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('class', ts.getAttribute('class')); svg.setAttribute('viewBox', (st !== 'before') ? '2 2 20 20' : '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = `<path fill="currentColor" fill-rule="evenodd" d="${d}"/>`; ts.replaceWith(svg);
        if ((st !== 'before')) { const r = svg.getBoundingClientRect(); svg.style.transform = `translate(${Math.round(r.left) - r.left}px, ${Math.round(r.top) - r.top}px)`; }
        const seg = svg.closest('.tag-stub') || svg.closest('.tag-seg');
        return { star: svg.getBoundingClientRect().toJSON(), stub: seg.getBoundingClientRect().toJSON() };
      }, [which === 'starred' ? solid(g.tagstar || g.star) : (g.tagstar || g.star), which, st]);
      info[`${st}-${dsf}-tag-${which}`] = t;
      const c = t.stub; await page.screenshot({ path: path.join(OUT, `tag-${which}-${st}-${dsf}x.png`), clip: { x: Math.floor(c.left), y: Math.floor(c.top), width: Math.ceil(c.width), height: Math.ceil(c.height) } });
      await page.screenshot({ path: path.join(OUT, `tagstar-${which}-${st}-${dsf}x.png`), clip: { x: Math.floor(t.star.left) - 4, y: Math.floor(t.star.top) - 4, width: 28, height: 28 } });
    }
    await page.evaluate(() => document.querySelector('.leaflet-popup-close-button')?.click());
    await page.waitForTimeout(500);
    const c = r.card; await page.screenshot({ path: path.join(OUT, `row-${st}-${dsf}x.png`), clip: { x: 0, y: c.top, width: 300, height: c.height } });
    await page.screenshot({ path: path.join(OUT, `rowstar-${st}-${dsf}x.png`), clip: { x: Math.floor(r.rowStar.left) - 2, y: Math.floor(r.rowStar.top) - 2, width: 22, height: 22 } });
    const bb = r.btn; await page.screenshot({ path: path.join(OUT, `plus-${st}-${dsf}x.png`), clip: { x: Math.floor(bb.left) - 4, y: Math.floor(bb.top) - 4, width: 68, height: 68 } });
    await page.screenshot({ path: path.join(OUT, `plusglyph-${st}-${dsf}x.png`), clip: { x: Math.floor(r.plus.left) - 1, y: Math.floor(r.plus.top) - 1, width: 28, height: 28 } });
    info[`${st}-${dsf}`] = r;
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, 'info.json'), JSON.stringify(info, null, 1));
  await b.close(); console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
