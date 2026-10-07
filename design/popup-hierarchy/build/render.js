// Hanging Tag + orange star: stills of the REAL built index.html (no mock code) in the gesture
// harness (lib.js: stub Supabase, vendored Leaflet + Archivo, blank tiles), with round 1's
// stand-in basemap under the map. Real fixture rows are patched with real place text.
//   node design/popup-hierarchy/build/render.js [group|name ...]     (groups: early, final)
// FILE=<index.html> to shoot another copy. Variants of the two dials (TAG_STAR_STYLE,
// TAG_REVERSED_STAR_KEYLINE) are shot from scratch copies with the constant rewritten.
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const { launch, openProto, W, FILE } = require('../../gesture-harness/lib');
const OUT = path.join(__dirname, 'stills');
const BASE = fs.readFileSync(path.join(__dirname, '../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const BASEMAP = `(() => { const st = document.createElement('style'); st.textContent = '.k-base{position:absolute;inset:0;z-index:0;pointer-events:none;filter:sepia(.3) saturate(.75) contrast(.96) hue-rotate(-6deg)}.k-base svg{width:100%;height:100%;display:block}.leaflet-tile-pane{opacity:0}'; document.head.appendChild(st);
${BASE} basemap(); })();`;

const variant = (style, keyline) => {
  const src = fs.readFileSync(FILE, 'utf8');
  let out = src.replace(/const TAG_STAR_STYLE = '[a-z]+';/, `const TAG_STAR_STYLE = '${style}';`).replace(/const TAG_REVERSED_STAR_KEYLINE = (true|false);/, `const TAG_REVERSED_STAR_KEYLINE = ${keyline};`);
  if (style !== 'segment' && out === src) throw new Error('dial not found');
  const f = path.join(os.tmpdir(), `tag-${style}-${keyline}.html`); fs.writeFileSync(f, out); return f;
};

// Real place text (Supabase, read-only, 2026-10-05 sample) on fixture ids.
const PLACES = {
  aurora: { name: 'Aurora Reykjavík', category: 'attraction', short_address: 'Fiskislóð 53 · Örfirisey',
    notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.' },
  moderna: { name: 'Moderna Museet Malmö', category: 'attraction', short_address: 'Ystadvägen 44 · Davidshall',
    notes: 'Free entry to the collection; the old electricity works with the orange perforated-steel extension. Café on the ground floor.' },
  vega: { name: 'VEGA Copenhagen', category: 'bar', short_address: 'Rejsbygade · Humleby',
    notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar)." },
  approx: { name: 'Værnedamsvej (approx.)', category: 'district', short_address: null,
    notes: "Copenhagen's most charming market street; Granola (retro coffee lounge/backyard café), Le Gourmand (French deli/cheese & charcuterie), Helges Ost (cheesemonger), Falernum (natural wine bar with tapas), Café Viggo (French bistro), Dora (design/vintage homewares)\n\nApproximate placement -- OSM has no boundary/way for this district; resolved via point search." },
  perlan: { name: 'Perlan', category: 'attraction', short_address: null, notes: null },
};

// [name, { city, place, id, starred, visited, style, keyline, signedOut, slip, plan, kind, frames }]
const J = [];
const early = (city, place, id) => {
  for (const style of ['segment', 'band', 'both']) for (const [st, s, v, so] of [['starred', 1, 0, 0], ['visited', 0, 1, 0], ['both', 1, 1, 0], ['signedout', 1, 1, 1]])
    J.push([`early/${city}-${style}-${st}`, { group: 'early', city, place, id, starred: !!s, visited: !!v, style, signedOut: !!so, slip: !!so }]);
  J.push([`early/${city}-segment-starred-keyline`, { group: 'early', city, place, id, starred: true, visited: false, style: 'segment', keyline: true }]);
};
early('reykjavik', 'aurora', 'rey07'); early('malmo', 'moderna', 'mal07');

async function setup(b, o) {
  const file = variant(o.style || 'segment', !!o.keyline);
  const storage = o.plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {};
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced: true, city: o.city || 'reykjavik', file, storage });
  await page.evaluate(BASEMAP);
  if (o.plan) { await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(600); }
  return { ctx, page, errors };
}

async function openTag(page, o) {
  await page.evaluate(async ([id, d]) => { const r = window.__ROWS.find(x => x.id === id); Object.assign(r, d); await refetchLocations(); }, [o.id, { ...PLACES[o.place], starred: o.starred, visited: o.visited }]);
  await W(200);
  if (o.signedOut) await page.evaluate(() => { currentUser = null; updateAuthUI(); });
  await page.evaluate(([id, sel]) => { const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], 16, { animate: false }); if (sel) setHighlighted(id); syncMarkerGlyphZoom(); markersById.get(id).marker.openPopup(); }, [o.id, !!o.select]);
  await W(700);
  if (o.slip) { const q = await page.evaluate(() => { const r = document.querySelector('.leaflet-popup .popup-star-tap').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); await page.touchscreen.tap(q.x, q.y); await W(300); }
}

async function shoot(page, name) {
  await page.evaluate(() => document.fonts.ready);
  const box = await page.evaluate(() => { const c = document.querySelector('.leaflet-popup.tag-popup'); if (!c) return null; const r = c.getBoundingClientRect(); const s = c.querySelector('.tag-slip'); const b = s && s.textContent ? s.getBoundingClientRect().bottom : r.bottom; return { x0: r.left, y0: r.top, x1: r.right, y1: b }; });
  const f = n => path.join(OUT, `${name}-${n}`);
  fs.mkdirSync(path.dirname(f('x')), { recursive: true });
  await page.screenshot({ path: f('phone@3x.png') });
  execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
  fs.unlinkSync(f('phone@3x.png'));
  if (box) { const clip = { x: Math.max(0, box.x0 - 16), y: Math.max(0, box.y0 - 30) }; clip.width = Math.min(390, box.x1 + 16) - clip.x; clip.height = Math.min(844, box.y1 + 16) - clip.y;
    await page.screenshot({ path: f('crop@3x.png'), clip }); }
}

(async () => {
  const only = process.argv.slice(2);
  const b = await launch();
  for (const [name, o] of J) {
    if (only.length && !only.includes(name) && !only.includes(o.group)) continue;
    const { ctx, page, errors } = await setup(b, o);
    try { await openTag(page, o); await shoot(page, name); }
    catch (e) { console.log('FAIL', name, e.message); }
    console.log(name, errors.length ? errors : '');
    await ctx.close();
  }
  await b.close();
})();
