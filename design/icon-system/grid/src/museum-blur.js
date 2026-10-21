// g7ab: museum options for "belongs at 24px": fitted like the set, blurred darkness against the between cup, coupe, tree
// usage: TOOLS=<dir with node_modules/paper> node src/museum-blur.js <outdir> && python3 -I src/museum-blur.py <outdir>
const G = __dirname + '/';
const E = require(G + 'engine.js'), P7 = require(G + 'picks7.js');
const { LAWS7, HUMAN } = require(G + 'laws7.js'), { measure } = require(G + 'optics.js');
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const r3 = v => Math.round(v * 3) / 3, r4 = v => Math.round(v * 4) / 4;
const LAW = HUMAN({ flare: 0.75, mass: 0.6, end: 0.3 });
function fit(id, o, law = LAW, ease = 2.3, fk = 11 / 12) {
  const [cls, apex] = P7.CLASS[id], [kw0, kh0] = P7.KEY[cls], kw = kw0 * fk, kh = (kh0 + apex) * fk, opts = { law, tightHoles: true, ease };
  const dr = s => P7.DRAW[id](s, { style: 'mono', ...o });
  let s = 12; for (let k = 0; k < 6; k++) { const b = measure(E.build(dr(s), opts).d).box; s *= Math.min(kw / (b.x1 - b.x0), kh / (b.y1 - b.y0)); }
  const ox = (24 - s) / 2, oy = r3((24 - s) / 2), m = measure(E.build(E.xform(dr(s), 1, 0, 0, ox, oy), opts).d);
  const tx = r4(12 - (m.box.cx + m.cx) / 2), ty = r3(12 - (m.box.cy + m.cy) / 2);
  return E.build(E.xform(dr(s), 1, 0, 0, ox + tx, oy + ty), { ...opts, sym: id === 'cafe' ? undefined : ox + tx + s / 2 }).d;
}
const BASE = { droop: 0.5, bow: -0.2, dome: 0.5 };
const A = { bd: 6.75, bk: 0.35, bx: 0.5, fb: 11, bandH: 7 / 6, bandSide: 'shift' };
const V = JSON.parse(process.env.VARS || '[]');
const glyphs = [['cafe', fit('cafe', BASE)], ['coupe', fit('bar', { ...BASE, ...A })], ['tree', fit('nature', BASE)], ['museum H2', fit('museum', {}, LAWS7.joint, 2.3)], ['museum v199', fit('museum', { ...BASE, capital: 0.5, roofBow: -0.1 })], ['museum v203 (3 columns)', fit('museum', { ...BASE, capital: 0.5, roofBow: -0.1, cols: 3 })], ['museum between (no beam)', fit('museum', { ...BASE, capital: 0.5, roofBow: -0.1, beam: 0 })]];
for (const [nm, o] of V) glyphs.push([nm, fit('museum', { ...BASE, ...o })]);
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
(async () => {
  let h = '<body style="margin:0;background:#fff">', vis = '<body style="margin:0;background:#FAF5EA;font:12px Arial">';
  glyphs.forEach(([nm, d], i) => {
    h += `<div id="g${i}" style="width:96px;height:96px;display:inline-block;filter:blur(6px)"><svg width="96" height="96" viewBox="0 0 24 24"><path d="${d}" fill="#000"/></svg></div>`;
    vis += `<span style="display:inline-block;text-align:center;margin:4px;width:150px"><svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="#F2EBDD" stroke="#12293F" stroke-width="1.5"/><path d="${d}" fill="#12293F"/></svg> <svg width="72" height="72" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="#F2EBDD" stroke="#12293F" stroke-width="1.5"/><path d="${d}" fill="#12293F"/></svg><br><svg width="128" height="128" viewBox="4 4 16 16" style="background:#F2EBDD"><path d="${d}" fill="#12293F"/></svg><br>${nm}</span>`;
  });
  fs.writeFileSync(out + '/b.html', h + '</body>'); fs.writeFileSync(out + '/vis.html', vis + '</body>');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); const p = await b.newPage({ viewport: { width: 1400, height: 300 } });
  await p.goto('file://' + out + '/b.html'); await p.waitForTimeout(300);
  for (let i = 0; i < glyphs.length; i++) await (await p.$('#g' + i)).screenshot({ path: `${out}/g${i}.png` });
  const q = await b.newPage({ viewport: { width: 1400, height: 300 }, deviceScaleFactor: 2 }); await q.goto('file://' + out + '/vis.html'); await q.screenshot({ path: out + '/vis.png', fullPage: true });
  await b.close();
  fs.writeFileSync(out + '/names.json', JSON.stringify(glyphs.map(g => g[0])));
})();
