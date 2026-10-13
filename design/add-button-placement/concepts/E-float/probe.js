// Probe today's real geometry (read-only on the real index.html): axes the floated badge can align to.
const L = require('../lib-render.js');
(async () => {
  const b = await L.launch();
  for (const vp of [[390, 844], [320, 568], [390, 664]]) {
    const { ctx, page } = await L.open(b, { html: '/home/user/la-trip-map/index.html', vp, dsf: 1 });
    const m = await page.evaluate(() => {
      const R = e => { if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)); };
      const card = document.querySelectorAll('#locationsList .location-card[data-id]')[1];
      const ink = el => { // ink box of an svg/text inside el
        const s = el && (el.querySelector('svg') || el); return R(s); };
      return { sheet: R(document.getElementById('locations')), header: R(document.getElementById('locationsHeader')),
        h2: R(document.querySelector('#locationsHeader h2')), collapse: R(document.getElementById('collapseBtn')),
        sort: R(document.getElementById('sortBtn')), filt: R(document.getElementById('toggleFiltersBtn')), locate: R(document.querySelector('#locationsHeader button:last-of-type')),
        card: R(card), badge: R(card.querySelector('.row-badge')), badgeSvg: R(card.querySelector('.row-badge svg')), del: R(card.querySelector('.delete-btn')),
        h3: R(card.querySelector('h3')), zoom: R(document.querySelector('.leaflet-control-zoom')), attr: R(document.querySelector('.leaflet-control-attribution')),
        add: R(document.getElementById('floatingAddBtn')), addSvg: R(document.querySelector('#floatingAddBtn svg')), acct: R(document.getElementById('accountBtn')),
        s: ['--s1','--s2','--s3','--s4','--s6','--gutter','--col-action','--gap'].map(v => v + '=' + getComputedStyle(document.documentElement).getPropertyValue(v).trim()) };
    });
    // delete x glyph ink: render text range
    m.delInk = await page.evaluate(() => { const d = document.querySelectorAll('#locationsList .delete-btn')[1]; const rg = document.createRange(); rg.selectNodeContents(d); const r = rg.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(v => +v.toFixed(1)); });
    console.log(vp.join('x'), JSON.stringify(m, null, 0));
    await ctx.close();
  }
  await b.close();
})();
