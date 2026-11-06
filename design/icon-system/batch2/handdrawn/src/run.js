// run.js [out.png] — draws icons.js with lib.js in Chromium (paper.js), writes ../18/<name>.svg,
// and a sheet: the eight beside the approved five at app size (18 in the 24 ring / diamond),
// a mixed row of pins, and 6x. DSF env sets the device scale (default 3).
// PAPER env: path to paper-core.js 0.12.18 (npm i paper@0.12.18).
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const HERE = __dirname, OUT18 = path.join(HERE, '../18'), SYS = path.join(HERE, '../../../grid/svg/system/18');
const PAPER = process.env.PAPER || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/pj/node_modules/paper/dist/paper-core.js';
const INK = { cafe: '#6E4C22', bar: '#3D5A7A', museum: '#523875', nature: '#1E3A2B', restaurant: '#7A2436', landmark: '#4889A8', attraction: '#547326', venue: '#AF4B82', hotel: '#2E2433', shopping: '#8A7AA8', park: '#3F925B', neighbourhood: '#328177', street: '#5E2C17' };
const EIGHT = [['landmark', 'camera'], ['attraction', 'Ferris wheel'], ['venue', 'curtain'], ['hotel', 'bed'], ['shopping', 'bag'], ['park', 'picnic table'], ['neighbourhood', 'houses'], ['street', 'walker']];
const APPR = ['cafe', 'bar', 'museum', 'nature', 'restaurant'];
const rdf = f => fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1];
const dia = k => k === 'neighbourhood' || k === 'street';
function badge(d, k, sc = 1, bare = false) {
  const rw = 4 / 3, c = 12, I = INK[k], px = 24 * sc;
  const shell = bare ? '' : dia(k) ? `<polygon points="${c},${rw / 2} ${24 - rw / 2},${c} ${c},${24 - rw / 2} ${rw / 2},${c}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}" stroke-linejoin="round"/>`
    : `<circle cx="${c}" cy="${c}" r="${c - rw / 2}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}"/>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24">${shell}<path fill="${I}" fill-rule="evenodd" d="${d}"/></svg>`;
}
(async () => {
  const out = path.resolve(process.argv[2] || path.join(HERE, '../sheet.png'));
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const pg = await b.newPage();
  await pg.setContent('<html><body></body></html>');
  await pg.addScriptTag({ path: PAPER }); await pg.addScriptTag({ path: path.join(HERE, 'lib.js') }); await pg.addScriptTag({ path: path.join(HERE, 'icons.js') });
  const D = await pg.evaluate(() => window.ICONS);
  fs.mkdirSync(OUT18, { recursive: true });
  for (const [k, d] of Object.entries(D)) if (!k.includes('@')) fs.writeFileSync(path.join(OUT18, `${k}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="${d}"/></svg>\n`);
  const A = Object.fromEntries(APPR.map(a => [a, rdf(path.join(SYS, `${a}.svg`))]));
  const mine = k => D[k] || '';
  const css = `body{margin:20px;background:#FAF5EA;font:15px/1.3 -apple-system,Helvetica,Arial,sans-serif;color:#12293F;width:1330px}
h1{font-size:24px;margin:0 0 4px} .sub{color:#5A564C;margin:0 0 14px;max-width:1150px} h2{font-size:16px;margin:18px 0 8px}
.big{display:flex;gap:14px;flex-wrap:wrap} .gap{width:22px;display:inline-block}
.cell{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:13px;color:#5A564C}
.strip{background:#E9E2D0;border-radius:8px;padding:10px 12px;display:inline-flex;gap:8px;align-items:center}`;
  const ap = A_ => APPR.map(a => badge(A[a], a)).join('');
  let h = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><h1>Batch 2, drawn by hand</h1><div class="sub">The eight at 18 (the master) in the 24 ring, Neighbourhood and Street in the diamond, beside the approved five. Drawn first; the system follows.</div>`;
  h += `<h2>App size: the eight · the approved five</h2><div class="strip">${EIGHT.map(([k]) => badge(mine(k), k)).join('')}<span class="gap"></span>${ap()}</div>`;
  const MIX = [...EIGHT.map(([k]) => [k, mine(k)]), ...APPR.map(a => [a, A[a]])], ORDER = [0, 8, 1, 9, 2, 10, 3, 11, 4, 12, 5, 6, 7];
  h += `<h2>A mixed row of pins, app size</h2><div class="strip">${[0, 5, 9].map(o => ORDER.map(i => MIX[(i + o) % MIX.length]).map(([k, d]) => badge(d, k)).join('')).join('')}</div>`;
  h += `<h2>Bare (no ring), app size, ink on paper</h2><div class="strip">${EIGHT.map(([k]) => badge(mine(k), k, 1, true)).join('')}<span class="gap"></span>${APPR.map(a => badge(A[a], a, 1, true)).join('')}</div>`;
  const V = Object.keys(D).filter(k => k.includes('@'));
  if (V.length) h += `<h2>Variants, app size and 6x</h2><div class="strip vstrip">${V.map(k => badge(D[k], k.split('@')[0])).join('')}<span class="gap"></span>${ap()}</div><div class="big vbig">${V.map(k => `<div class="cell">${badge(D[k], k.split('@')[0], 5)}<span>${k}</span></div>`).join('')}</div>`;
  h += `<h2>6x, the eight</h2><div class="big">${EIGHT.map(([k, n]) => `<div class="cell">${badge(mine(k), k, 6)}<span>${n}</span></div>`).join('')}</div>`;
  h += `<h2>6x, the approved five</h2><div class="big">${APPR.map(a => `<div class="cell">${badge(A[a], a, 6)}<span>${a}</span></div>`).join('')}</div></body></html>`;
  const tmp = out.replace(/\.png$/, '.html'); fs.writeFileSync(tmp, h);
  const p = await b.newPage({ viewport: { width: 1370, height: 800 }, deviceScaleFactor: process.env.DSF ? +process.env.DSF : 3 });
  await p.goto('file://' + tmp); await p.screenshot({ path: out, fullPage: true }); fs.unlinkSync(tmp);
  // a close crop for judging at true size: the app-size strips only
  if (process.env.CROP) { const el = await p.$$('.strip'); await el[0].screenshot({ path: out.replace(/\.png$/, '-strip.png') });
    const bg = await p.$$('.big:not(.vbig)'); await bg[0].screenshot({ path: out.replace(/\.png$/, '-6x.png') });
    const vs = await p.$('.vstrip'); if (vs) { await vs.screenshot({ path: out.replace(/\.png$/, '-vstrip.png') }); await (await p.$('.vbig')).screenshot({ path: out.replace(/\.png$/, '-vbig.png') }); } }
  await b.close();
})();
