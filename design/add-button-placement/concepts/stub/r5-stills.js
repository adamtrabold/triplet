// A. Claim-check stub, ROUND 5 stills (visual designer). The real index.html is READ (never written) and r5.inc.html
// is injected in memory. Reykjavík, stub data. Run: node r5-stills.js (ONLY=<prefix>, A=<variant list for the study>)
const L = require('../lib-render.js'); const chromeCheck = require('../chrome-check.js'); const fs = require('fs'); const path = require('path');
const REAL = '/home/user/la-trip-map/index.html', OUT = path.join(__dirname, 'r5'), INC = fs.readFileSync(path.join(__dirname, 'r5.inc.html'), 'utf8');
fs.mkdirSync(OUT, { recursive: true });
const withLook = v => h => { const i = h.lastIndexOf('</body>'); h = h.slice(0, i) + INC + '\n' + h.slice(i); return h.replace('<html lang="en"', `<html lang="en" data-a="${v}"`); };
const crop1x = { x: 150, y: 400, width: 240, height: 240 };   // the SAME window in A, C and the baseline   // the + area at 390x844, 1x
const S = {};
for (const v of (process.env.A || 'wave,ticket,postage,r3').split(',')) {
  S[`study-${v}-1x`] = { v, vp: [390, 844], dsf: 1, clip: crop1x };
  S[`study-${v}-3x`] = { v, vp: [390, 844], clip: crop1x };
}
Object.assign(S, {
  'rest':        { v: 'ticket', vp: [390, 844] },
  'pressed':     { v: 'ticket', vp: [390, 844], run: p => p.evaluate(() => document.getElementById('nb').classList.add('press')) },
  'open-844':    { v: 'ticket', vp: [390, 844], q: '?play', run: async p => { await p.click('#nb'); await p.waitForTimeout(900); } },
  'cph320':      { v: 'ticket', vp: [320, 568], city: 'copenhagen' },
  'tag':         { v: 'ticket', vp: [390, 844], run: async p => { const id = await p.evaluate(() => (locations.find(l => l.starred && l.visited && document.querySelector(`#locationsList .location-card[data-id="${l.id}"]`)) || {}).id); await p.click(`#locationsList .location-card[data-id="${id}"]`); await p.waitForTimeout(1900); } },
  'collapsed':   { v: 'ticket', vp: [390, 844], inset: true, run: async p => { await p.click('#collapseBtn'); await p.waitForTimeout(700); } },
});
(async () => {
  const b = await L.launch(); const out = {};
  for (const [name, s] of Object.entries(S).filter(([n]) => !process.env.ONLY || n.startsWith(process.env.ONLY))) {
    const { ctx, page, errs } = await L.open(b, { html: REAL, ...s, patch: withLook(s.v) });
    await page.evaluate(c => { setActiveCity(c); }, s.city || 'reykjavik'); await page.waitForTimeout(900);
    await page.evaluate(() => window.fitTitle && window.fitTitle());
    if (s.run) await s.run(page);
    await page.waitForTimeout(300);
    out[name] = { nb: await L.box(page, '#nb'), nbHit: await L.hit(page, '#nb'), submit: await L.box(page, '#submitBtn'), submitHit: await L.hit(page, '#submitBtn'), errs, clash: await chromeCheck(page),
      title: await page.evaluate(() => document.querySelector('#locationsHeader h2').className + ' | ' + document.querySelector('#locationsHeader h2').textContent) };
    console.log(name, JSON.stringify(out[name]));
    await page.screenshot({ path: path.join(OUT, `${name}${name.endsWith('x') ? '' : '-3x'}.png`), ...(s.clip ? { clip: s.clip } : {}) });
    await ctx.close();
  }
  fs.writeFileSync(path.join(OUT, `measure${process.env.ONLY ? '-' + process.env.ONLY : ''}.json`), JSON.stringify(out, null, 1));
  await b.close();
})();
