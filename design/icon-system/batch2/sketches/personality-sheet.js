// personality-sheet.js <out.png> <svgDir> <title> [subtitle] : a contact sheet for one personality approach. Every glyph a system
// build: the approved set from grid/svg/system/18, the eight from <svgDir> (batch2/personality/svg/<A|B|C>/18, or the canvas v295
// builds when <svgDir> is "v295"). Row 1: the eight at 18 in their badges (diamond for shapes) beside the approved set, true size;
// row 2: the same at 6x; row 3 (the base row): canvas v295's eight, for the before. Inks as set; screenshot at 3x (phone-readable).
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SYS = path.join(__dirname, '../../grid/svg/system/18'), CON = path.join(__dirname, '../concepts/svg/18');
const rdf = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1] : null;
const INK = { cafe: '#6E4C22', bar: '#3D5A7A', museum: '#523875', nature: '#1E3A2B', restaurant: '#7A2436', landmark: '#4889A8', attraction: '#547326', venue: '#AF4B82', hotel: '#2E2433', shopping: '#8A7AA8', park: '#3F925B', neighbourhood: '#328177', street: '#5E2C17' };
// the eight on canvas v295 (their concept ids) and where each one's build lives
const EIGHT = [['landmark', 'lm-camera', 'camera'], ['attraction', 'at-wheel4', 'Ferris wheel'], ['venue', 'venue', 'curtain'], ['hotel', 'ht-nofoot', 'bed'],
  ['shopping', 'sh-bag3', 'bag'], ['park', 'pk-picnic2', 'picnic table'], ['neighbourhood', 'nb-kvarter', 'houses'], ['street', 'st-walker', 'walker']];
const v295 = id => rdf(path.join(CON, `${id}.svg`)) || rdf(path.join(SYS, `${id}.svg`));
const APPR = ['cafe', 'bar', 'museum', 'nature', 'restaurant'];
const dia = k => k === 'neighbourhood' || k === 'street';
function badge(d, k, sc = 1) {
  const rw = 4 / 3, c = 12, I = INK[k], px = 24 * sc;
  const shell = dia(k) ? `<polygon points="${c},${rw / 2} ${24 - rw / 2},${c} ${c},${24 - rw / 2} ${rw / 2},${c}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}" stroke-linejoin="round"/>`
    : `<circle cx="${c}" cy="${c}" r="${c - rw / 2}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}"/>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24">${shell}${d ? `<path fill="${I}" fill-rule="evenodd" d="${d}"/>` : '<text x="12" y="14" font-size="5" text-anchor="middle" fill="#a00">missing</text>'}</svg>`;
}
const [out, dir, title, sub = ''] = process.argv.slice(2);
const mine = id => dir === 'v295' ? v295(id) : rdf(path.join(dir, `${id}.svg`));
const css = `body{margin:20px;background:#FAF5EA;font:15px/1.3 -apple-system,Helvetica,Arial,sans-serif;color:#12293F;width:1330px}
h1{font-size:24px;margin:0 0 4px} .sub{color:#5A564C;margin:0 0 14px;max-width:1100px} h2{font-size:16px;margin:18px 0 8px}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap} .gap{width:22px} .big{display:flex;gap:14px;flex-wrap:wrap}
.cell{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:13px;color:#5A564C}
.strip{background:#E9E2D0;border-radius:8px;padding:10px 12px;display:inline-flex;gap:8px;align-items:center}`;
const appr18 = APPR.map(a => badge(rdf(path.join(SYS, `${a}.svg`)), a)).join('');
let h = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><h1>${title}</h1><div class="sub">${sub}</div>`;
h += `<h2>At 18 in the 24 badge, true size: the eight · the approved five</h2><div class="strip">${EIGHT.map(([k, id]) => badge(mine(id), k)).join('')}<span class="gap"></span>${appr18}</div>`;
// a row of pins, mixed, as on the map (the eight and the approved five interleaved)
const MIXED = [...EIGHT.map(([k, id]) => [k, mine(id)]), ...APPR.map(a => [a, rdf(path.join(SYS, `${a}.svg`))])];
const ORDER = [0, 8, 1, 9, 2, 10, 3, 11, 4, 12, 5, 6, 7];
h += `<h2>A row of pins at 18, mixed with the approved set</h2><div class="strip">${[0, 5, 9].map(o => ORDER.map(i => MIXED[(i + o) % MIXED.length]).map(([k, d]) => badge(d, k)).join('')).join('')}</div>`;
if (dir !== 'v295') h += `<h2>Before (canvas v295), same size</h2><div class="strip">${EIGHT.map(([k, id]) => badge(v295(id), k)).join('')}<span class="gap"></span>${appr18}</div>`;
h += `<h2>The 18 at 6x, beside the approved five</h2><div class="big">${EIGHT.map(([k, id, n]) => `<div class="cell">${badge(mine(id), k, 6)}<span>${n}</span></div>`).join('')}</div>
<div class="big" style="margin-top:10px">${APPR.map(a => `<div class="cell">${badge(rdf(path.join(SYS, `${a}.svg`)), a, 6)}<span>${a} (approved)</span></div>`).join('')}</div></body></html>`;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const tmp = out.replace(/\.png$/, '.html'); fs.writeFileSync(tmp, h);
  const p = await b.newPage({ viewport: { width: 1370, height: 800 }, deviceScaleFactor: process.env.DSF ? +process.env.DSF : 2 });
  await p.goto('file://' + tmp); await p.screenshot({ path: out, fullPage: true }); fs.unlinkSync(tmp); await b.close();
})();
