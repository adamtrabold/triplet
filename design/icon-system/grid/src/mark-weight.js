// MARK WEIGHT (g7ar; owner on v223, the row at 1x: "im also not sure the weight is perfect yet on the plus and star...
// plus *might* feel a bit light (can't exactly tell because...) the star feels heavy"; earlier: "the + and star do feel
// slightly lighter than the others", "the as they are is too light but the heavier marks are way too heavy", "The middle
// weight option is close but still too heavy optically" (1.75px), "the star also seems way heavier than the others").
// A line mark (open or outline class: only lines, no mass) used to take one line width, 1 2/3px (g7r). The same line
// reads at different weights in different marks: the star's five walls stand close around a small hole, so at reading
// size they merge into one dark shape; the +'s two bars stand alone. This measures what the eye sums: each mark drawn at
// its true size, blurred 1.5px (src/blur-measure.js's blur), and the darkness of its darker fifth (p80) read.
// THE RULE (LINE MARKS BY DARKNESS): every line mark's line is solved so that its p80 equals ONE target, T, for the set;
// a future line mark gets its line from the same solve, so it comes out matched. T itself is the one open value.
// node src/mark-weight.js [T ...]  -> prints each mark's darkness now, and the line that meets each T; writes
// svg/g7/between/mark-weight.json { now: {plus, star}, targets: { T: { plus: lw, star: lw, dark: {plus, star} } } }
'use strict';
const fs = require('fs'), path = require('path');
const E = require('./engine.js'), P7 = require('./picks7.js');
const { LAWS7, scaled } = require('./laws7.js');
const { measure } = require('./optics.js');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const LINEW = 5 / 3, EASE = 2.3, JOIN8 = { ease: EASE, trim: 1.4, ends2: 1.5, fair: true, hillKeep: 'depth' }, starTip = 0.0877;
const T = n => Math.round(n * 3) / 3, KEY_OPEN = 12;
// the + and the star exactly as the R2 row builds them (boards7: plus(26.4, USC.plus, lw); starAt, its points as far as the +'s arms)
const PLUS_SPAN = (() => { const b = measure(E.build(P7.plus(26.4, KEY_OPEN / 14, LINEW), { law: scaled(LAWS7.joint, 24 / 26.4) }).d).box; return (b.x1 - b.x0) * 26.4 / 24; })();
const plusD = lw => E.build(P7.plus(26.4, KEY_OPEN / 14, lw), { law: scaled(LAWS7.joint, 24 / 26.4), ease: EASE, join: JOIN8 }).d;
const starLaw = scaled(c => (c.convex && c.angle < 75) ? Math.min(LAWS7.joint(c), starTip * Math.min(c.lin, c.lout)) : LAWS7.joint(c), 24 / 20);
const starD = lw => { let lo = 0.3, hi = 1.2, d; for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; d = E.build(P7.star(20, m, lw), { law: starLaw, ease: EASE, tightHoles: true, join: { ...JOIN8, fair: false } }).d; const b = measure(d).box; if ((b.x1 - b.x0) * 20 / 24 > PLUS_SPAN) hi = m; else lo = m; } return E.build(P7.star(20, (lo + hi) / 2, lw), { law: starLaw, ease: EASE, tightHoles: true, join: JOIN8 }).d; };
async function dark(page, d, px) {
  const S = Math.round(px * 4), svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 24 24"><path d="${d}" fill="#000"/></svg>`;
  return page.evaluate(async ([src, S]) => {
    const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src); await img.decode();
    const c = document.createElement('canvas'); c.width = c.height = S + 40; const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, S + 40, S + 40); x.filter = 'blur(6px)'; x.drawImage(img, 20, 20, S, S);
    const dd = x.getImageData(0, 0, S + 40, S + 40).data, v = []; for (let i = 0; i < dd.length; i += 4) { const k = 1 - dd[i] / 255; if (k > 0.02) v.push(k); }
    v.sort((a, b) => a - b); return 100 * v[Math.floor(v.length * 0.8)];
  }, [svg, S]);
}
module.exports = { plusD, starD, LINEW };
if (require.main === module) (async () => {
  const targets = process.argv.slice(2).map(Number); if (!targets.length) targets.push(46);
  const b = await chromium.launch(); const page = await b.newPage(); await page.setContent('<body></body>');
  const now = { plus: await dark(page, plusD(LINEW), 26.4), star: await dark(page, starD(LINEW), 20) };
  console.log('now (1 2/3px):', now);
  const solve = async (mk, px, Tv) => { let lo = 0.9, hi = 2.6; for (let k = 0; k < 14; k++) { const m = (lo + hi) / 2, v = await dark(page, mk(m), px); if (v < Tv) lo = m; else hi = m; } const lw = (lo + hi) / 2; return { lw: +lw.toFixed(3), dark: +(await dark(page, mk(lw), px)).toFixed(1) }; };
  const out = { now, targets: {} };
  for (const Tv of targets) { const p = await solve(plusD, 26.4, Tv), s = await solve(starD, 20, Tv); out.targets[Tv] = { plus: p.lw, star: s.lw, dark: { plus: p.dark, star: s.dark } }; console.log('T', Tv, '+', p, 'star', s); }
  await b.close();
  fs.writeFileSync(path.join(__dirname, '../svg/g7/between/mark-weight.json'), JSON.stringify(out, null, 1));
})();
