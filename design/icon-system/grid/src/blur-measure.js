// Blurred darkness (equal optical weight, change 11): node src/blur-measure.js <outdir>, then python3 -I src/blur-measure.py <outdir>.
// g7i: measures the glyphs exactly as shipped (svg/g7/joint-air2/, written by boards7.js), so the size
// rule's fit is in the measure. The Star and the + are measured too, each at its app scale, centred in
// the same Ø16 live circle (the + at its Float badge step, 26.4/24). 4x, with a 1.5px (1x) blur.
const path = require('path'), fs = require('fs');
const G = __dirname;
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const out = path.resolve(process.argv[2]); fs.mkdirSync(out, { recursive: true });
const SV = process.env.SVGDIR || path.join(G, '..', 'svg', 'g7', 'joint-air2');
const pathOf = f => [...fs.readFileSync(path.join(SV, f), 'utf8').matchAll(/<path[^>]* d="([^"]+)"/g)].map(m => m[1]);
const refs = [];
for (const rel of ['material-symbols-rounded/local_cafe-fill.svg', 'material-symbols-rounded/local_bar-fill.svg', 'material-symbols-rounded/account_balance-fill.svg', 'material-symbols-rounded/park-fill.svg']) {
  const src = fs.readFileSync(path.join(G, '..', 'reference', rel), 'utf8'); refs.push({ vb: src.match(/viewBox="([^"]+)"/)[1], d: [...src.matchAll(/ d="([^"]+)"/g)].map(m => m[1]) });
}
const IDS = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus'];
(async () => {
  let h = '<body style="margin:0;background:#fff">';
  const cell = (id, inner) => `<div id="${id}" style="width:96px;height:96px;display:inline-block;filter:blur(6px)"><svg width="96" height="96" viewBox="0 0 24 24">${inner}</svg></div>`;
  for (const id of ['cafe', 'bar', 'museum', 'nature']) h += cell(id, pathOf(`${id}-24.svg`).map(d => `<path d="${d}" fill="#000"/>`).join(''));
  for (const [id, px] of [['star', 20], ['plus', 26.4]]) { const k = px / 24, t = 12 - 12 * k; h += cell(id, `<g transform="translate(${t} ${t}) scale(${k})">${pathOf(`${id}-${px}.svg`).map(d => `<path d="${d}" fill="#000"/>`).join('')}</g>`); }
  refs.forEach((r, i) => { const [x, y, w] = r.vb.split(/\s+/).map(Number), k = 12 / (w * 20 / 24), live = w * 2 / 24; h += cell('ref' + i, `<g transform="translate(6 6) scale(${k}) translate(${-x - live} ${-y - live})">${r.d.map(d => `<path d="${d}"/>`).join('')}</g>`); });
  fs.writeFileSync(out + '/b.html', h + '</body>');
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 200 } });
  await p.goto('file://' + out + '/b.html'); await p.waitForTimeout(300);
  for (const id of [...IDS, 'ref0', 'ref1', 'ref2', 'ref3']) await (await p.$('#' + id)).screenshot({ path: `${out}/${id}.png` });
  await b.close();
})();
