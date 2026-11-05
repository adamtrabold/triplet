// personality-sizes.js <out.png> [A=D] : the landed D icons at every size. Per icon: 18 in the 24 ring, 24 in the 32 ring, 12 bare
// (a chip), at true size, then each at 6x; the approved five the same way for reference. Set inks; screenshot at 3x.
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SYS = s => path.join(__dirname, '../../grid/svg/system', String(s)), A = process.argv[3] || 'D', MINE = s => path.join(__dirname, '../personality/svg', A, String(s));
const rdf = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1] : null;
const INK = { cafe: '#6E4C22', bar: '#3D5A7A', museum: '#523875', nature: '#1E3A2B', restaurant: '#7A2436', landmark: '#4889A8', hotel: '#2E2433', park: '#3F925B', neighbourhood: '#328177', street: '#5E2C17' };
const FIVE = [['landmark', 'lm-camera', 'Camera'], ['hotel', 'ht-nofoot', 'Bed'], ['park', 'pk-picnic2', 'Picnic table'], ['neighbourhood', 'nb-kvarter', 'Houses'], ['street', 'st-walker', 'Walker']];
const APPR = [['cafe', 'cafe', 'Café'], ['bar', 'bar', 'Coupe'], ['museum', 'museum', 'Museum'], ['nature', 'nature', 'Tree'], ['restaurant', 'restaurant', 'Fork and knife']];
const dia = k => k === 'neighbourhood' || k === 'street';
// a badge: ring px 24 (around the 18) or 32 (around the 24), its rim 4/3 or 5/3; the glyph drawn in the ring's 24 frame; sc: zoom
function badge(d, ring, k, sc = 1) {
  const rw = ring === 32 ? 5 / 3 : 4 / 3, c = ring / 2, I = INK[k], px = ring * sc;
  const shell = dia(k) ? `<polygon points="${c},${rw / 2} ${ring - rw / 2},${c} ${c},${ring - rw / 2} ${rw / 2},${c}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}" stroke-linejoin="round"/>`
    : `<circle cx="${c}" cy="${c}" r="${c - rw / 2}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}"/>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 ${ring} ${ring}">${shell}${d ? `<svg width="${ring}" height="${ring}" viewBox="0 0 24 24"><path fill="${I}" fill-rule="evenodd" d="${d}"/></svg>` : `<text x="${c}" y="${c + 2}" font-size="5" text-anchor="middle" fill="#a00">missing</text>`}</svg>`;
}
const bare = (d, k, sc = 1) => d ? `<svg width="${16 * sc}" height="${16 * sc}" viewBox="0 0 24 24"><path fill="${INK[k]}" fill-rule="evenodd" d="${d}"/></svg>` : '<span style="color:#a00;font-size:12px">missing</span>';
const css = `body{margin:20px;background:#FAF5EA;font:15px/1.3 -apple-system,Helvetica,Arial,sans-serif;color:#12293F;width:1500px}
h1{font-size:24px;margin:0 0 4px} .sub{color:#5A564C;margin:0 0 14px} h2{font-size:16px;margin:16px 0 6px}
.row{display:flex;gap:28px;align-items:flex-end;flex-wrap:wrap} .cell{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:13px;color:#5A564C}
.strip{background:#E9E2D0;border-radius:8px;padding:10px 14px;display:inline-flex;gap:10px;align-items:center}
.chip{display:inline-flex;gap:5px;align-items:center;border:1px solid #d9cfba;border-radius:14px;padding:4px 10px;font-size:13px;background:#fff8ec}`;
const set = (L, src) => L.map(([k, id, n]) => [k, n, rdf(path.join(src(18), `${id}.svg`)), rdf(path.join(src(24), `${id}.svg`)), rdf(path.join(src(12), `${id}.svg`))]);
const five = set(FIVE, MINE), appr = set(APPR, SYS);
const trueRow = L => `<div class="strip">${L.map(([k, , a]) => badge(a, 24, k)).join('')}<span style="width:14px"></span>${L.map(([k, , , b]) => badge(b, 32, k)).join('')}<span style="width:14px"></span>${L.map(([k, n, , , c]) => `<span class="chip">${bare(c, k)}${n}</span>`).join('')}</div>`;
let h = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><h1>The landed five (personality ${A}) at every size</h1>
<div class="sub">Each built by the system: 18 in the 24 ring (list rows, pins), 24 in the 32 ring (the selected pin), 12 bare (filter chips). True size, then 6x.</div>
<h2>True size: 18 · 24 · 12 (the five, then the approved five)</h2>${trueRow(five)}<div style="height:8px"></div>${trueRow(appr)}`;
for (const [title, L] of [['The five at 6x: 18 · 24 · 12', five], ['The approved five at 6x, for reference', appr]]) {
  h += `<h2>${title}</h2><div class="row">`;
  for (const [k, n, a, b, c] of L) h += `<div class="cell"><div style="display:flex;gap:10px;align-items:flex-end">${badge(a, 24, k, 6)}${badge(b, 32, k, 6)}${bare(c, k, 6)}</div><span>${n}: 18 · 24 · 12</span></div>`;
  h += `</div>`;
}
h += `</body></html>`;
(async () => {
  const out = process.argv[2], b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const tmp = out.replace(/\.png$/, '.html'); fs.writeFileSync(tmp, h);
  const p = await b.newPage({ viewport: { width: 1540, height: 800 }, deviceScaleFactor: process.env.DSF ? +process.env.DSF : 2 });
  await p.goto('file://' + tmp); await p.screenshot({ path: out, fullPage: true }); fs.unlinkSync(tmp); await b.close();
})();
