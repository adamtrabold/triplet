// D. Eyelet -- ONE keep-or-kill frame (visual designer, turn 9; director turn 7).
// Builds ./index.html = a COPY of the real index.html with the eyelet injected; renders it. Real index.html untouched.
// + as the grommet at the centre of the sheet's top edge. Frame: 390x844, a starred tag open (the tag-gap test),
// list up (the drag-handle test). Run: node render.js
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const REAL = '/home/user/la-trip-map/index.html', COPY = path.join(__dirname, 'index.html');
const INC = `<style id="conceptD">
  #floatingAddBtn{display:none!important} #accountBtn{right:var(--s4)!important}
  /* the grommet: a 44px brand-orange disc straddling the sheet's top edge, its paper ring = the tag's grommet ring */
  #eyelet{position:absolute;left:50%;top:-22px;width:44px;height:44px;margin-left:-22px;z-index:5;border:0;padding:0;border-radius:50%;cursor:pointer;
    background:radial-gradient(circle at 50% 50%, var(--brand-orange) 15px, var(--paper) 15.5px, var(--paper) 18px, var(--brand-orange) 18.5px);
    color:var(--navy);display:flex;align-items:center;justify-content:center;
    filter:drop-shadow(0 0 .5px rgba(107,74,40,.5)) drop-shadow(0 1px 1px rgba(26,26,24,.12))}
  #eyelet svg{width:18px;height:18px}
</style>
<script>(function(){const e=document.createElement('button');e.id='eyelet';e.setAttribute('aria-label','Add a place');
 e.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
 document.getElementById('locations').appendChild(e);})();</script>`;
const h = fs.readFileSync(REAL, 'utf8'); const i = h.lastIndexOf('</body>');
fs.writeFileSync(COPY, h.slice(0, i) + INC + '\n' + h.slice(i));
(async () => {
  const b = await L.launch();
  for (const [n, tag] of [['D-eyelet-tag-open', true], ['D-eyelet-rest', false]]) {
    const { ctx, page } = await L.open(b, { html: COPY, vp: [390, 844] });
    await page.evaluate(() => setActiveCity('reykjavik')); await page.waitForTimeout(900);
    if (tag) { const cards = await page.$$('#locationsList .location-card[data-id]'); let p = cards[1];
      for (const c of cards) if (await c.evaluate(e => !!e.querySelector('[class*="star"]') && e.classList.contains('visited'))) { p = c; break; }
      await p.click(); await page.waitForTimeout(1700); }
    console.log(n, JSON.stringify({ eyelet: await L.box(page, '#eyelet'), hit: await L.hit(page, '#eyelet'), tag: await L.box(page, '.tag-popup'), header: await L.box(page, '#locationsHeader'), title: await L.box(page, '#locationsHeader h2') }));
    await page.screenshot({ path: path.join(__dirname, n + '-3x.png') }); await ctx.close();
  }
  await b.close();
})();
