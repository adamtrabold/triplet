// Round 7 quick check: A as the Hanging Tag cut (stub/r6.inc.html data-a="tagcut") vs admission, in the header box on
// today's main: title, hit area at the chamfers/eyelet, and the gap from the locate icon's ink to the cut side, 320/375/390.
const L = require('../lib-render.js'); const fs = require('fs'); const path = require('path');
const real = fs.readFileSync('/home/user/la-trip-map/index.html', 'utf8'), rd = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
(async () => { const b = await L.launch(); const out = {};
  for (const v of ['admit', 'tagcut']) for (const [vp, city] of [[[320, 568], 'copenhagen'], [[375, 667], 'copenhagen'], [[390, 844], 'copenhagen']]) {
    const f = path.join(__dirname, '.A.html'); const i = real.lastIndexOf('</body>');
    fs.writeFileSync(f, (real.slice(0, i) + rd('stub/r5.inc.html') + rd('stub/r6.inc.html') + real.slice(i)).replace('<html lang="en"', `<html lang="en" data-a="${v}"`));
    const { ctx, page } = await L.open(b, { html: f, vp, dsf: 3 });
    await page.evaluate(c => setActiveCity(c), city); await page.waitForTimeout(700); await page.evaluate(() => window.fitTitle && window.fitTitle()); await page.waitForTimeout(300);
    out[`${v}@${vp[0]}`] = await page.evaluate(() => { const nb = document.getElementById('nb'), r = nb.getBoundingClientRect(), h = document.querySelector('#locationsHeader h2');
      const loc = document.getElementById('centerMeBtn'), ls = loc.querySelector('svg').getBoundingClientRect(), lb = loc.getBoundingClientRect();
      const at = (x, y) => { const e = document.elementFromPoint(x, y); return e && (nb.contains(e) ? 'self' : (e.id || e.className)); };
      return { nb: [r.left, r.top, r.right, r.bottom].map(Math.round), title: h.textContent, titleW: Math.round(h.getBoundingClientRect().width), ellipsized: (h.querySelector('.n') || h).scrollWidth > (h.querySelector('.n') || h).clientWidth + 1,
        locateBox: [lb.left, lb.right].map(v => +v.toFixed(1)), locateSvg: [ls.left, ls.right].map(v => +v.toFixed(1)), svgToCut: +(r.left - ls.right).toFixed(1), svgToCutAtCorner: +(r.left + 14 - ls.right).toFixed(1),
        locateBoxOverNb: lb.right > r.left + 0.5, hitChamferCorner: at(r.left + 2, r.top + 2), hitEyelet: at(r.left + 9.5, (r.top + r.bottom) / 2), hitLocateEdge: at(lb.right - 2, (lb.top + lb.bottom) / 2) }; });
    await page.screenshot({ path: path.join(__dirname, `frames/A-${v}-${vp[0]}-3x.png`), clip: { x: 0, y: vp[1] - 300 - 10, width: vp[0], height: 80 } });
    await ctx.close(); fs.unlinkSync(f); }
  console.log(JSON.stringify(out, null, 1)); fs.writeFileSync(path.join(__dirname, 'measure-A.json'), JSON.stringify(out, null, 1)); await b.close(); })();
