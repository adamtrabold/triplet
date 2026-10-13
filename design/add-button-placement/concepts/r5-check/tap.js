// Quick: does C's round-5 resting pin still drive the add flow (playground + signed out), and A's ticket at 320?
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const C = path.join(__dirname, '../C-pin'), A = path.join(__dirname, '../stub');
const inj = (h, files, attr) => { const i = h.lastIndexOf('</body>'); return (h.slice(0, i) + files.map(f => fs.readFileSync(f, 'utf8')).join('\n') + h.slice(i)).replace('<html lang="en"', `<html lang="en" ${attr}`); };
(async () => { const b = await L.launch(); const out = {};
  for (const [n, s] of Object.entries({ C_play: { q: '?play' }, C_signin: { q: '?signin' }, C_play_320: { q: '?play', vp: [320, 568] } })) {
    const { ctx, page } = await L.open(b, { html: C + '/index.html', vp: s.vp || [390, 844], dsf: 1, q: s.q, patch: h => inj(h, [C + '/visual.inc.html', C + '/visual-r5.inc.html'], 'data-c="ring"') });
    await page.click('#pencilPin'); await page.waitForTimeout(900);
    out[n] = await page.evaluate(() => ({ adding: document.body.classList.contains('pinadd'), auth: document.getElementById('authModal').classList.contains('show'), focus: document.activeElement && document.activeElement.id }));
    await ctx.close(); }
  for (const vp of [[320, 568], [375, 667]]) {
    const { ctx, page } = await L.open(b, { html: '/home/user/la-trip-map/index.html', vp, dsf: 1, q: '?play', patch: h => inj(h, [A + '/r5.inc.html'], 'data-a="ticket"') });
    await page.click('#nb'); await page.waitForTimeout(900);
    out['A_' + vp[0]] = { nb: await L.box(page, '#nb'), submit: await L.box(page, '#submitBtn'), submitHit: await L.hit(page, '#submitBtn') };
    await ctx.close(); }
  console.log(JSON.stringify(out)); fs.writeFileSync(path.join(__dirname, 'measure-tap.json'), JSON.stringify(out, null, 1)); await b.close(); })();
