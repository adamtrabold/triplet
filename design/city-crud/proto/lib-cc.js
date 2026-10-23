// City CRUD design prototype support (design only; never the product). Opens the real index.html in the
// gesture harness (stub Supabase, vendored Leaflet + Archivo, flat tiles) via the phase 2 lib, serves the
// Philadelphia-roadtrip Nominatim fixtures in ./fixtures (real answers fetched 2026-10-23), and injects
// ./design-layer.js: the mock states drawn with the app's own classes and tokens.
//   node design/city-crud/stills/stills.js
const path = require('path'), fs = require('fs');
const P = require('../../add-tag-jam/p2/lib-p2.js');
const FX = path.join(__dirname, 'fixtures');
const W = P.W;
const TILES = process.env.CC_TILES || '/tmp/claude-0/-home-user-triplet/93db611f-01c4-59bd-abb2-1bd1be23b367/scratchpad/tiles';
fs.mkdirSync(TILES, { recursive: true });
async function open(browser, opts = {}) {
  const o = await P.openP2(browser, { dsf: 3, w: 390, h: 844, ...opts });
  const { page } = o;
  await page.route('https://nominatim.openstreetmap.org/search**', route => {
    const u = new URL(route.request().url());
    const q = (u.searchParams.get('q') || '').trim().replace(/ /g, '_');
    const f = path.join(FX, `${q}.json`);
    if (u.searchParams.get('bounded') !== '1' && fs.existsSync(f)) return route.fulfill({ contentType: 'application/json', body: fs.readFileSync(f, 'utf8') });
    return route.fallback();
  });
  await page.route('https://nominatim.openstreetmap.org/reverse**', route => route.fulfill({ contentType: 'application/json', body: '{}' }));
  // real OSM tiles (cached on disk, one polite fetch each) so the geography reads in the stills
  await page.route(/tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/, async route => {
    const m = route.request().url().match(/\/(\d+)\/(\d+)\/(\d+)\.png/);
    const f = path.join(TILES, `${m[1]}-${m[2]}-${m[3]}.png`);
    if (!fs.existsSync(f)) {
      try { const r = await fetch(`https://tile.openstreetmap.org/${m[1]}/${m[2]}/${m[3]}.png`, { headers: { 'User-Agent': 'triplet-design-stills/1.0' } }); if (r.ok) fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); } catch (e) {}
    }
    return fs.existsSync(f) ? route.fulfill({ contentType: 'image/png', body: fs.readFileSync(f) }) : route.fallback();
  });
  await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, 'design-layer.js'), 'utf8') });
  await W(200);
  return o;
}
module.exports = { open, P, W };
