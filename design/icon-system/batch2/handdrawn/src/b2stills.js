// b2stills.js <outDir> — phone-readable stills (~1500px wide) for the owner:
// b2-nines.png: the five 9s at 18 in their badges beside the approved five, true size and 6x, plus a mixed row of pins;
// b2-bag.png: the round-3 bag and the taller-arch bag, true size and 6x.
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const HERE = __dirname, SYS = path.join(HERE, '../../../grid/svg/system/18');
const PAPER = process.env.PAPER || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/pj/node_modules/paper/dist/paper-core.js';
const INK = { cafe: '#6E4C22', bar: '#3D5A7A', museum: '#523875', nature: '#1E3A2B', restaurant: '#7A2436', landmark: '#4889A8', attraction: '#547326', venue: '#AF4B82', hotel: '#2E2433', shopping: '#8A7AA8', park: '#3F925B', neighbourhood: '#328177', street: '#5E2C17' };
const dia = k => k === 'neighbourhood' || k === 'street';
const badge = (d, k, sc) => { const I = INK[k], rw = 4 / 3, c = 12;
  const shell = dia(k) ? `<polygon points="${c},${rw / 2} ${24 - rw / 2},${c} ${c},${24 - rw / 2} ${rw / 2},${c}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}" stroke-linejoin="round"/>` : `<circle cx="12" cy="12" r="${12 - rw / 2}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}"/>`;
  return `<svg width="${24 * sc}" height="${24 * sc}" viewBox="0 0 24 24">${shell}<path fill="${I}" fill-rule="evenodd" d="${d}"/></svg>`; };
const rdf = f => fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1];
const css = `body{margin:0;padding:24px;width:712px;background:#FAF5EA;font:17px/1.35 -apple-system,Helvetica,Arial,sans-serif;color:#12293F}
h1{font-size:24px;margin:0 0 4px} h2{font-size:17px;margin:20px 0 8px} .sub{color:#5A564C;margin:0 0 6px}
.strip{background:#E9E2D0;border-radius:10px;padding:10px 12px;display:inline-flex;flex-wrap:wrap;gap:8px;align-items:center}
.big{display:flex;gap:0;justify-content:space-between} .cell{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:14px;color:#5A564C} .gap{width:18px}`;
(async () => {
  const outDir = path.resolve(process.argv[2]);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const pg = await b.newPage(); await pg.setContent('<html></html>');
  await pg.addScriptTag({ path: PAPER }); await pg.addScriptTag({ path: path.join(HERE, 'lib.js') }); await pg.addScriptTag({ path: path.join(HERE, 'icons.js') });
  const D = await pg.evaluate(() => window.ICONS);
  const NINE = [['landmark', 'camera'], ['venue', 'curtain'], ['hotel', 'bed'], ['park', 'picnic table'], ['neighbourhood', 'houses']];
  const APPR = [['cafe', 'café'], ['bar', 'coupe'], ['museum', 'museum'], ['nature', 'tree'], ['restaurant', 'fork and knife']];
  const A = Object.fromEntries(APPR.map(([a]) => [a, rdf(path.join(SYS, `${a}.svg`))]));
  const shoot = async (html, file) => { const p = await b.newPage({ viewport: { width: 760, height: 600 }, deviceScaleFactor: 2 });
    await p.setContent(`<!doctype html><meta charset="utf-8"><style>${css}</style><body>${html}</body>`); await p.screenshot({ path: path.join(outDir, file), fullPage: true }); await p.close(); };
  const mix = []; for (let i = 0; i < 5; i++) mix.push([NINE[i][0], D[NINE[i][0]]], [APPR[i][0], A[APPR[i][0]]]);
  await shoot(`<h1>Batch 2: the five 9s</h1><div class="sub">Drawn by hand at 18 in their badges, beside the approved five.</div>
<h2>True size: the five 9s · the approved five</h2><div class="strip">${NINE.map(([k]) => badge(D[k], k, 1)).join('')}<span class="gap"></span>${APPR.map(([a]) => badge(A[a], a, 1)).join('')}</div>
<h2>A mixed row of pins, true size</h2><div class="strip">${[...mix, ...mix.slice(3), ...mix.slice(0, 3)].map(([k, d]) => badge(d, k, 1)).join('')}</div>
<h2>6x: the five 9s</h2><div class="big">${NINE.map(([k, n]) => `<div class="cell">${badge(D[k], k, 5.6)}<span>${n}</span></div>`).join('')}</div>
<h2>6x: the approved five</h2><div class="big">${APPR.map(([a, n]) => `<div class="cell">${badge(A[a], a, 5.6)}<span>${n}</span></div>`).join('')}</div>`, 'b2-nines.png');
  const BAGS = [['shopping', 'Round 3: low, wide handle (2/5 of its span)'], ['shopping@tallarch', 'Taller arch (about 3/4 of its span)']];
  await shoot(`<h1>Shopping: the bag</h1><div class="sub">The system caps a handle at 2/5 of its span. The taller arch breaks that cap and is a drawing only, for you to compare.</div>
<h2>True size, beside the approved five</h2>${BAGS.map(([k, n]) => `<div style="margin-bottom:8px"><div class="strip">${badge(D[k], 'shopping', 1)}<span class="gap"></span>${APPR.map(([a]) => badge(A[a], a, 1)).join('')}</div> <span style="font-size:14px;color:#5A564C">${n}</span></div>`).join('')}
<h2>6x</h2><div class="big" style="justify-content:space-around">${BAGS.map(([k, n]) => `<div class="cell" style="max-width:300px;text-align:center">${badge(D[k], 'shopping', 6)}<span>${n}</span></div>`).join('')}</div>`, 'b2-bag.png');
  await b.close();
})();
