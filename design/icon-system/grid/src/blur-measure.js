// Blurred darkness (equal optical weight, change 11): node src/blur-measure.js <outdir>, then python3 -I src/blur-measure.py <outdir>.
// Renders each batch glyph and the Material references at 4x with a 1.5px (1x) blur; PNGs per glyph.
const path = require('path'), fs = require('fs');
const G = __dirname;
const E = require(G + '/engine.js');
const { DRAW, BATCH } = require(G + '/picks7.js');
const { LAWS7 } = require(G + '/laws7.js');
const { measure } = require(G + '/optics.js');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const r3 = v => Math.round(v * 3) / 3, r4 = v => Math.round(v * 4) / 4;
const out = path.resolve(process.argv[2]); fs.mkdirSync(out, { recursive: true });
const refs = [];
for (const rel of ['material-symbols-rounded/local_cafe-fill.svg', 'material-symbols-rounded/local_bar-fill.svg', 'material-symbols-rounded/account_balance-fill.svg', 'material-symbols-rounded/park-fill.svg']) {
  const src = fs.readFileSync(path.join(G, '..', 'reference', rel), 'utf8'); refs.push({ vb: src.match(/viewBox="([^"]+)"/)[1], d: [...src.matchAll(/ d="([^"]+)"/g)].map(m => m[1]) });
}
(async () => {
  let h = '<body style="margin:0;background:#fff">';
  for (const [id] of BATCH) {
    const prims = DRAW[id](12), raw = E.build(E.xform(prims, 1, 0, 0, 6, 6), { law: LAWS7.joint });
    const m = measure(raw.d);
    const d = E.build(E.xform(prims, 1, 0, 0, 6 + r4(12 - (m.box.cx + m.cx) / 2), 6 + r3(12 - (m.box.cy + m.cy) / 2)), { law: LAWS7.joint }).d;
    h += `<div id="${id}" style="width:96px;height:96px;display:inline-block;filter:blur(6px)"><svg width="96" height="96" viewBox="0 0 24 24"><path d="${d}" fill="#000"/></svg></div>`;
  }
  refs.forEach((r, i) => { const [x, y, w] = r.vb.split(/\s+/).map(Number), k = 12 / (w * 20 / 24), live = w * 2 / 24; h += `<div id="ref${i}" style="width:96px;height:96px;display:inline-block;filter:blur(6px)"><svg width="96" height="96" viewBox="0 0 24 24"><g transform="translate(6 6) scale(${k}) translate(${-x - live} ${-y - live})">${r.d.map(d => `<path d="${d}"/>`).join('')}</g></svg></div>`; });
  fs.writeFileSync(out + '/b.html', h + '</body>');
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 200 } });
  await p.goto('file://' + out + '/b.html'); await p.waitForTimeout(300);
  for (const id of [...BATCH.map(x => x[0]), 'ref0', 'ref1', 'ref2', 'ref3']) await (await p.$('#' + id)).screenshot({ path: `${out}/${id}.png` });
  await b.close();
})();
