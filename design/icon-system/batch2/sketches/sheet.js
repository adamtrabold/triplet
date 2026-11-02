// sheet.js <out.png> : the batch 2 contact sheet. Every glyph is a system build (approved set and one-shot controls from
// grid/svg/system/18, sketches from batch2/sketches/svg/18), shown at 18 in the 24 ring (the diamond for shapes) at true size,
// and the same badge 4x for reading. Category inks as set (categories-design-calls.md + CATEGORY_COLORS).
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { SK } = require('./sketch.js');
const SYS = path.join(__dirname, '../../grid/svg/system/18'), SKD = path.join(__dirname, 'svg/18');
const rd = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1] : null;
const INK = { cafe: '#6E4C22', bar: '#3D5A7A', museum: '#523875', nature: '#1E3A2B', restaurant: '#7A2436', landmark: '#4889A8', attraction: '#547326', venue: '#AF4B82', hotel: '#2E2433', shopping: '#8A7AA8', park: '#3F925B', neighbourhood: '#328177', street: '#5E2C17', star: '#EE7434' };
const RW = 4 / 3;
function badge(d, px, ink, diamond) {
  const sc = px / 24, rw = RW;
  const shell = diamond ? `<polygon points="12,${rw / 2} ${24 - rw / 2},12 12,${24 - rw / 2} ${rw / 2},12" fill="#F2EBDD" stroke="${ink}" stroke-width="${rw}" stroke-linejoin="round"/>`
    : `<circle cx="12" cy="12" r="${12 - rw / 2}" fill="#F2EBDD" stroke="${ink}" stroke-width="${rw}"/>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24">${shell}${d ? `<path fill="${ink}" fill-rule="evenodd" d="${d}"/>` : `<text x="12" y="14" font-size="4" text-anchor="middle" fill="#a00">missing</text>`}</svg>`;
}
const cell = (label, d, ink, diamond, tag = '') => `<div class="c"><div class="b">${badge(d, 24, ink, diamond)}${badge(d, 96, ink, diamond)}</div><div class="l">${tag ? `<b>${tag}</b> ` : ''}${label}</div></div>`;
const ROWS = [
  ['landmark', 'Landmark', ['lm-obelisk', 'lm-needle', 'lm-viewer']],
  ['attraction', 'Attraction', ['at-wheel4', 'at-bigtop']],
  ['venue', 'Venue', ['vn-stage', 'vn-spot']],
  ['hotel', 'Hotel', ['ht-nofoot', 'ht-board']],
  ['shopping', 'Shopping', ['sh-tote', 'sh-carrier']],
  ['park', 'Park', ['pk-picnic', 'pk-lawn']],
  ['neighbourhood', 'Neighborhood', ['nb-square', 'nb-four']],
  ['street', 'Street', ['st-corridor', 'st-lamp']],
];
let html = `<!doctype html><html><head><style>
body{margin:24px;background:#FAF5EA;font:15px/1.3 -apple-system,Helvetica,Arial,sans-serif;color:#12293F;width:1150px}
h1{font-size:24px;margin:0 0 4px} h2{font-size:18px;margin:22px 0 8px} .sub{color:#5A564C;margin-bottom:14px}
.r{display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start} .c{width:200px} .b{display:flex;gap:14px;align-items:center}
.l{margin-top:6px;font-size:14px} .ap{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.set{background:#fff8ec;border:1px solid #e3d8c3;border-radius:8px;padding:10px 12px;margin-bottom:6px}
</style></head><body><h1>Icons batch 2: contact sheet 1 (jam turn 2, visual)</h1>
<div class="sub">Every glyph built by the system from a declaration. Left of each pair: true size (18 in the 24 ring; diamond for shapes). Right: the same, 4x. "now" = the 10-30 one-shot, the control.</div>`;
const appr = ['cafe', 'bar', 'museum', 'nature', 'restaurant'];
const strip = (px) => appr.map(id => badge(rd(path.join(SYS, `${id}.svg`)), px, INK[id])).join('');
html += `<div class="set"><b>Approved set</b><div class="ap">${strip(24)}<span style="width:20px"></span>${strip(48)}</div></div>`;
for (const [key, name, ids] of ROWS) {
  const dia = key === 'neighbourhood' || key === 'street', ink = INK[key];
  html += `<h2>${name}</h2><div class="r">${cell('now (one-shot)', rd(path.join(SYS, `${key}.svg`)), ink, dia)}`;
  for (const id of ids) html += cell(SK[id].name.replace(/^[^:]+: /, ''), rd(path.join(SKD, `${id}.svg`)), ink, dia, id);
  // beside the set at true size
  html += `<div class="c" style="width:auto"><div class="ap" style="margin-top:4px">${appr.slice(0, 3).map(a => badge(rd(path.join(SYS, `${a}.svg`)), 24, INK[a])).join('')}${ids.map(id => badge(rd(path.join(SKD, `${id}.svg`)), 24, ink, dia)).join('')}</div><div class="l">beside the set, true size</div></div>`;
  html += `</div>`;
}
html += `</body></html>`;
const out = process.argv[2], tmp = out.replace(/\.png$/, '.html'); fs.writeFileSync(tmp, html);
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const p = await b.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: +(process.env.DSF || 2) });
  await p.goto('file://' + tmp); await p.screenshot({ path: out, fullPage: true }); await b.close();
})();
