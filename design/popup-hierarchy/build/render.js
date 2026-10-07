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

const variant = (style = 'band', keyline = false) => {
  const src = fs.readFileSync(FILE, 'utf8');
  let out = src.replace(/const TAG_STAR_STYLE = '[a-z]+';/, `const TAG_STAR_STYLE = '${style}';`).replace(/const TAG_REVERSED_STAR_KEYLINE = (true|false);/, `const TAG_REVERSED_STAR_KEYLINE = ${keyline};`);
  if (!/const TAG_STAR_STYLE = '[a-z]+';/.test(src)) throw new Error('dial not found');
  const f = path.join(os.tmpdir(), `tag-${style}-${keyline}.html`); fs.writeFileSync(f, out); return f;
};

// Place text on fixture ids: VEGA, Aurora, Værnedamsvej and Perlan are real rows (Supabase sample, 2026-10-05; short
// addresses from docs/shipped.md "Short address" examples or the round-4 rule); the Malmö note is stand-in text.
const PLACES = {
  aurora: { name: 'Aurora Reykjavík', category: 'attraction', short_address: 'Fiskislóð 53 · Örfirisey',
    notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.' },
  moderna: { name: 'Moderna Museet Malmö', category: 'attraction', short_address: 'Stora Nygatan 2-4 · Old Town',
    notes: 'Free entry to the collection; the old electricity works with the orange perforated-steel extension. Café on the ground floor.' },
  vega: { name: 'VEGA Copenhagen', category: 'bar', short_address: 'Rejsbygade · Vesterbro',
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

// early2 (owner 2026-10-07: paper texture, smaller stamp, band default; the list lowers only as far as a tag needs)
for (const [city, place, id] of [['reykjavik', 'aurora', 'rey07'], ['malmo', 'moderna', 'mal07']])
  for (const [st, s, v, so] of [['starred', 1, 0, 0], ['both', 1, 1, 0], ['visited', 0, 1, 0], ['signedout', 1, 1, 1]])
    J.push([`early2/${city}-band-${st}`, { group: 'early2', city, place, id, starred: !!s, visited: !!v, signedOut: !!so, slip: !!so }]);
J.push(['early2/tallest-approx-844', { group: 'early2', place: 'approx', id: 'rey15', starred: true, visited: true, phone: true }]);
J.push(['early2/tallest-approx-664', { group: 'early2', place: 'approx', id: 'rey15', starred: true, visited: true, phone: true, h: 664 }]);

// Final set (the build brief): one row per state.
const F = (name, o) => J.push([`final/${name}`, { group: 'final', city: 'reykjavik', ...o }]);
F('busiest-vega', { place: 'vega', id: 'rey01', starred: true, visited: true, plan: true, select: true });
F('typical', { place: 'aurora', id: 'rey07', starred: false, visited: false });
F('long-note-approx', { place: 'approx', id: 'rey15', starred: false, visited: false });
F('name-only', { place: 'perlan', id: 'rey13', starred: false, visited: false });
F('district-open', { shape: 'district', label: 'Grandi (Old Harbour district)' });
F('street-open', { shape: 'street', label: 'Laugavegur' });
F('signedout', { place: 'aurora', id: 'rey07', starred: true, visited: false, signedOut: true });
F('signedout-slip', { place: 'aurora', id: 'rey07', starred: true, visited: false, signedOut: true, slip: true });
F('visited-motion', { place: 'aurora', id: 'rey07', starred: true, visited: false, motion: 'visit' });
F('pop-out', { place: 'aurora', id: 'rey07', starred: true, visited: false, motion: 'pop' });
F('list-copenhagen', { city: 'copenhagen', list: true });
F('list-stockholm', { city: 'stockholm', list: true });
F('map-z14', { map: 14 });
F('map-z11', { map: 11 });

async function setup(b, o) {
  const file = variant(o.style || 'band', !!o.keyline);
  const storage = o.plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {};
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced: !o.motion, city: o.city || 'reykjavik', file, storage, h: o.h || 844 });
  await page.evaluate(BASEMAP);
  if (o.plan) { await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(600); }
  return { ctx, page, errors };
}

async function openTag(page, o) {
  await page.evaluate(async ([id, d]) => { const r = window.__ROWS.find(x => x.id === id); Object.assign(r, d); await refetchLocations(); }, [o.id, { ...PLACES[o.place], starred: o.starred, visited: o.visited }]);
  await W(200);
  if (o.signedOut) await page.evaluate(() => { currentUser = null; updateAuthUI(); });
  await page.evaluate(([id, sel, no]) => { const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], 16, { animate: false }); if (sel) setHighlighted(id); syncMarkerGlyphZoom(); if (!no) markersById.get(id).marker.openPopup(); }, [o.id, !!o.select, !!o.noOpen]);
  await W(700);
  if (o.noOpen) return;
  if (o.slip) { const q = await page.evaluate(() => { const r = document.querySelector('.leaflet-popup .popup-star-tap').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); await page.touchscreen.tap(q.x, q.y); await W(300); }
}

// A busy list: most rows starred and/or visited, one starred row selected (navy). The sheet is
// raised to 600px for the still only (the real sheet is 300px) so the owner sees many rows.
const STAR = ['00', '01', '02', '03', '05', '06', '08', '10', '12', '15'], VIS = ['01', '02', '04', '05', '12', '15'];
async function listShot(page, o, name) {
  const pre = o.city.slice(0, 3);
  await page.evaluate(async ([pre, S, V]) => { window.__ROWS.forEach(x => { if (x.city.startsWith(pre)) { const n = x.id.slice(3); x.starred = S.includes(n); x.visited = V.includes(n); } }); await refetchLocations(); }, [pre, STAR, VIS]);
  await W(300);
  await page.evaluate(pre => { document.getElementById('locations').style.height = '600px'; document.getElementById('mainContent').style.height = '244px'; map.invalidateSize({ pan: false }); setHighlighted(pre + '03'); }, pre);
  await W(500); await shoot(page, name, { full: true });
}
async function mapShot(page, o, name) {
  await page.evaluate(async ([S, V]) => { window.__ROWS.forEach(x => { if (x.city === 'reykjavik') { const n = x.id.slice(3); x.starred = S.includes(n); x.visited = V.includes(n); } }); await refetchLocations(); }, [STAR, VIS]);
  await W(300);
  await page.evaluate(z => { const c = CITIES.reykjavik; map.setView(c.center, z, { animate: false }); }, o.map);
  await W(800); await shoot(page, name, { full: true });
}
async function shapeShot(page, o, name) {
  await page.evaluate(async ([t, label]) => { const s = window.__SHAPES.find(x => x.city === 'reykjavik' && x.type === t); s.label = label; s.starred = false; s.visited = false; await refetchNeighborhoodShapes(); }, [o.shape, o.label]);
  await W(300);
  await page.evaluate(t => { const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === t); map.setView(shapeAnchor(s), 16, { animate: false }); syncNeighborhoodLayers(); neighborhoodLayersById.get(s.id).openPopup(); }, o.shape);
  await W(800); await shoot(page, name);
}
// Motion frames: the real CSS animations, paused at exact times (Web Animations API).
async function frames(page, name, times, start) {
  for (const t of times) {
    await page.evaluate(t => document.getAnimations().forEach(a => { try { a.pause(); a.currentTime = t; } catch (_) {} }), t);
    await W(60); await shoot(page, `${name}-${String(t).padStart(3, '0')}ms`);
  }
}

async function shoot(page, name, { full = false } = {}) {
  await page.evaluate(() => document.fonts.ready);
  const box = await page.evaluate(() => { const c = document.querySelector('.leaflet-popup.tag-popup'); if (!c) return null; const r = c.getBoundingClientRect(); const s = c.querySelector('.tag-slip'); const b = s && s.textContent ? s.getBoundingClientRect().bottom : r.bottom; return { x0: r.left, y0: r.top, x1: r.right, y1: b }; });
  const f = n => path.join(OUT, `${name}-${n}`);
  fs.mkdirSync(path.dirname(f('x')), { recursive: true });
  await page.screenshot({ path: f('phone@3x.png') });
  execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', '390x844', f('phone@1x.png')]);
  fs.unlinkSync(f('phone@3x.png'));
  if (box && !full) { const clip = { x: Math.max(0, box.x0 - 16), y: Math.max(0, box.y0 - 30) }; clip.width = Math.min(390, box.x1 + 16) - clip.x; clip.height = Math.min(844, box.y1 + 16) - clip.y;
    await page.screenshot({ path: f('crop@3x.png'), clip }); }
}

(async () => {
  const only = process.argv.slice(2);
  const b = await launch();
  for (const [name, o] of J) {
    if (only.length && !only.includes(name) && !only.includes(o.group)) continue;
    const { ctx, page, errors } = await setup(b, o);
    try {
      if (o.list) await listShot(page, o, name);
      else if (o.map) await mapShot(page, o, name);
      else if (o.shape) await shapeShot(page, o, name);
      else if (o.motion === 'visit') {
        await openTag(page, o);
        await page.evaluate(() => document.querySelector('.tag-popup .popup-visited').click()); await W(30);
        await frames(page, name, [0, 80, 160, 260, 340, 420]);
      } else if (o.motion === 'pop') {
        await openTag(page, { ...o, noOpen: true });
        await shoot(page, `${name}-0-tap`, { full: true });
        await page.evaluate(id => { markersById.get(id).marker.openPopup(); }, o.id);
        await W(120); await shoot(page, `${name}-1-pan`, { full: true });
        await page.waitForFunction(() => document.querySelector('.tag-popup.tag-pop'), null, { timeout: 3000 });
        await frames(page, name, [0, 60, 120, 165, 230, 280]);
      }
      else { await openTag(page, o); await shoot(page, name, { full: !!o.phone }); }
    }
    catch (e) { console.log('FAIL', name, e.message); }
    console.log(name, errors.length ? errors : '');
    await ctx.close();
  }
  await b.close();
})();
