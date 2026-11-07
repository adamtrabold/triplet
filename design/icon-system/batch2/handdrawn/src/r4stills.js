// r4stills.js <out.png> — round-4 options for the owner: per icon, the options at 18 in their badges beside the
// approved five (true size), at 12 bare as on a chip (the 18 drawing at 2/3, not a drawn 12), and at 6x.
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const HERE = __dirname, SYS = path.join(HERE, '../../../grid/svg/system/18');
const PAPER = process.env.PAPER || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/pj/node_modules/paper/dist/paper-core.js';
const INK = { cafe: '#6E4C22', bar: '#3D5A7A', museum: '#523875', nature: '#1E3A2B', restaurant: '#7A2436', landmark: '#4889A8', attraction: '#547326', venue: '#AF4B82', hotel: '#2E2433', shopping: '#8A7AA8', park: '#3F925B', neighbourhood: '#328177', street: '#5E2C17' };
const dia = k => k === 'neighbourhood' || k === 'street';
const badge = (d, k, sc) => { const I = INK[k], rw = 4 / 3, c = 12;
  const shell = dia(k) ? `<polygon points="${c},${rw / 2} ${24 - rw / 2},${c} ${c},${24 - rw / 2} ${rw / 2},${c}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}" stroke-linejoin="round"/>` : `<circle cx="12" cy="12" r="${12 - rw / 2}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}"/>`;
  return `<svg width="${24 * sc}" height="${24 * sc}" viewBox="0 0 24 24">${shell}<path fill="${I}" fill-rule="evenodd" d="${d}"/></svg>`; };
const chip = (d, k) => `<svg width="16" height="16" viewBox="0 0 24 24"><path fill="${INK[k]}" fill-rule="evenodd" d="${d}"/></svg>`;
const rdf = f => fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1];
const SECTIONS = [
  ['landmark', 'Camera: vintage, not digital', [['landmark', 'Round 3 (compact)'], ['landmark@r4-rangefinder', 'A. Rangefinder'], ['landmark@r4-tlr', 'B. Twin-lens box'], ['landmark@r4-slr', 'C. Film SLR']]],
  ['venue', 'Curtain: read as a curtain', [['venue', 'Round 3'], ['venue@r4-swags', 'A. Swagged valance'], ['venue@r4-pleats', 'B. Pleats, finials'], ['venue@r4-swagpleats', 'C. Swags and pleats']]],
  ['neighbourhood', 'Houses: one house', [['neighbourhood', 'Round 3 (two)'], ['neighbourhood@r4-fence', 'A. Fence to one side'], ['neighbourhood@r4-chimney', 'B. Chimney, door'], ['neighbourhood@r4-frontfence', 'C. Fence in front']]],
  ['shopping', 'Bag: the og cues, this set\'s finish', [['shopping', 'Round 3 (kettlebell)'], ['shopping@r4-og', 'A. The og U'], ['shopping@r4-square', 'B. Square handle'], ['shopping@r4-folds', 'C. U and folds']]],
  ['attraction', 'Ferris wheel', [['attraction', 'Crossed (current)'], ['attraction@rimPlus', 'Upright (current)'], ['attraction@r4-finespokes', 'A. Fine spokes only'], ['attraction@r4-spokes', 'B. Fine spokes, hung cabins'], ['attraction@r4-cabins', 'C. Hung cabins only']]],
  ['street', 'Walker', [['street', 'Current (arm fix)'], ['street@r4-munich', 'A. Square-cut'], ['street@r4-flare', 'B. Flared limbs'], ['street@r4-bighead', 'C. Big head, short stride']]],
];
const css = `body{margin:0;padding:24px;width:712px;background:#FAF5EA;font:17px/1.35 -apple-system,Helvetica,Arial,sans-serif;color:#12293F}
h1{font-size:26px;margin:0 0 4px} h2{font-size:20px;margin:26px 0 8px;border-top:1px solid #DDD3BF;padding-top:16px} .sub{color:#5A564C;margin:0 0 6px}
.strip{background:#E9E2D0;border-radius:10px;padding:8px 12px;display:inline-flex;gap:8px;align-items:center;margin:0 8px 8px 0}
.lab{font-size:13px;color:#5A564C;margin:0 0 4px}
.big{display:flex;flex-wrap:wrap;gap:14px 0;justify-content:flex-start} .cell{width:178px;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:14px;color:#3D3A33;text-align:center} .gap{width:14px}`;
(async () => {
  const out = path.resolve(process.argv[2]);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const pg = await b.newPage(); await pg.setContent('<html></html>');
  for (const f of [PAPER, path.join(HERE, 'lib.js'), path.join(HERE, 'icons.js'), path.join(HERE, 'r4.js')]) await pg.addScriptTag({ path: f });
  const D = await pg.evaluate(() => window.ICONS);
  const APPR = ['cafe', 'bar', 'museum', 'nature', 'restaurant'], A = Object.fromEntries(APPR.map(a => [a, rdf(path.join(SYS, `${a}.svg`))]));
  let h = `<h1>Round 4: options</h1><div class="sub">Each icon drawn at 18 in its badge, shown at true size beside the approved five, at 12 bare as on a filter chip (the 18 drawing scaled; a drawn 12 comes after you pick), and at 6x. The current version is first in each row.</div>`;
  for (const [k, title, opts] of SECTIONS) {
    const miss = opts.filter(([key]) => !D[key]); if (miss.length) throw new Error('missing ' + miss.map(m => m[0]));
    h += `<h2>${title}</h2><div class="lab">True size, then the approved five</div><div class="strip">${opts.map(([key]) => badge(D[key], k, 1)).join('')}<span class="gap"></span>${APPR.map(a => badge(A[a], a, 1)).join('')}</div>
<div class="lab">At 12, bare (chip)</div><div class="strip">${opts.map(([key]) => chip(D[key], k)).join('<span style="width:10px"></span>')}<span class="gap"></span>${APPR.map(a => chip(A[a], a)).join('<span style="width:10px"></span>')}</div>
<div class="big">${opts.map(([key, n]) => `<div class="cell">${badge(D[key], k, 6)}<span>${n}</span></div>`).join('')}</div>`;
  }
  const p = await b.newPage({ viewport: { width: 760, height: 800 }, deviceScaleFactor: 2 });
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>${css}</style><body>${h}</body>`);
  await p.screenshot({ path: out, fullPage: true }); await b.close();
})();
