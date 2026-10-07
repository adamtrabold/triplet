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
  // stills-only hook: window.__STOP overrides the plan line (the long "Stop 12 of 14" case)
  const STOP_SRC = 'return r ? `Stop ${r.n} of ${r.m}` : \'\';';
  if (!out.includes(STOP_SRC)) throw new Error('planStopLine not found');
  out = out.replace(STOP_SRC, 'return r ? (window.__STOP || `Stop ${r.n} of ${r.m}`) : \'\';');
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
  baejarins: { name: 'Bæjarins Beztu', category: 'restaurant', short_address: 'Tryggvagata 1 · Miðborg',
    notes: 'The hot-dog stand. Order "eina með öllu" (one with everything). Open late; queue moves fast.' },
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
// Shot twice, Reykjavík and Copenhagen: with one brand orange the two must be identical in colour.
for (const [city, pre] of [['reykjavik', 'rey'], ['copenhagen', 'cop']]) {
  const F = (name, o) => J.push([`final/${city}/${name}`, { group: 'final', city, ...o }]);
  F('busiest-vega', { place: 'vega', id: pre + '01', starred: true, visited: true, plan: city === 'reykjavik', select: true });
  F('typical', { place: 'aurora', id: pre + '07', starred: false, visited: false });
  F('long-note-approx', { place: 'approx', id: pre + '15', starred: false, visited: false, phone: true });
  F('long-note-approx-664', { place: 'approx', id: pre + '15', starred: true, visited: true, phone: true, h: 664, select: true });
  F('name-only', { place: 'perlan', id: pre + '13', starred: false, visited: false });
  F('district-open', { shape: 'district', label: 'Grandi (Old Harbour district)' });
  F('street-open', { shape: 'street', label: 'Laugavegur' });
  F('signedout', { place: 'aurora', id: pre + '07', starred: true, visited: false, signedOut: true });
  F('signedout-slip', { place: 'aurora', id: pre + '07', starred: true, visited: false, signedOut: true, slip: true });
  F('visited-motion', { place: 'aurora', id: pre + '07', starred: true, visited: false, motion: 'visit' });
  F('pop-out', { place: 'aurora', id: pre + '07', starred: true, visited: false, motion: 'pop' });
  F('list', { list: true });
  F('list-scrolled', { list: true, scrolled: true });
  F('map-z14', { map: 14 });
  F('map-z11', { map: 11 });
}
J.push(['final/stockholm/list', { group: 'final', city: 'stockholm', list: true }]);

// Type line: RUBBER STAMP build (branch type-stamp; design/popup-hierarchy/type-line/ round 2, D, both
// stamped), written to design/popup-hierarchy/type-line/stills/build/.
{
  const F = (name, o) => J.push([`typestamp/${name}`, { group: 'typestamp', city: 'reykjavik', ...o }]);
  F('busiest-vega', { place: 'vega', id: 'rey01', starred: true, visited: true, plan: true, select: true });
  F('typical', { place: 'aurora', id: 'rey07', starred: false, visited: false });
  F('district', { shape: 'district', label: 'Grandi (Old Harbour district)' });
  F('long-narrow-240', { place: 'baejarins', id: 'rey00', starred: false, visited: true, plan: true, select: true, stop: 'Stop 12 of 14', w: 256 });
  F('long-narrow-288', { place: 'baejarins', id: 'rey00', starred: false, visited: true, plan: true, select: true, stop: 'Stop 12 of 14', w: 320 });
  F('long-316', { place: 'baejarins', id: 'rey00', starred: false, visited: true, plan: true, select: true, stop: 'Stop 12 of 14' });
  F('signedout', { place: 'aurora', id: 'rey07', starred: true, visited: false, signedOut: true });
}

// Follow-ups (2026-10-07, Impeccable C1/C3/A2/A6; docs/shipped.md "Hanging Tag + orange star"), written to
// design/popup-hierarchy/followups/stills/: no pencil circle, wrapped stub labels on the 240px tag (a 256px
// screen) vs the normal 316px one, a map-tapped pin's row scrolled into view, keyboard focus on the tag.
{
  const F = (name, o) => J.push([`followups/${name}`, { group: 'followups', city: 'reykjavik', ...o }]);
  F('busiest-vega', { place: 'vega', id: 'rey01', starred: true, visited: true, plan: true, select: true });
  F('starred', { place: 'aurora', id: 'rey07', starred: true, visited: false });
  F('narrow-240-starred', { place: 'aurora', id: 'rey07', starred: true, visited: false, w: 256 });
  F('narrow-240-both', { place: 'aurora', id: 'rey07', starred: true, visited: true, w: 256 });
  F('narrow-240-plain', { place: 'aurora', id: 'rey07', starred: false, visited: false, w: 256 });
  F('normal-316-starred', { place: 'aurora', id: 'rey07', starred: true, visited: false });
  F('normal-316-both', { place: 'aurora', id: 'rey07', starred: true, visited: true });
  F('se-288-both', { place: 'aurora', id: 'rey07', starred: true, visited: true, w: 320 });
  F('maptap-row-in-view', { id: 'late', maptap: true });
  F('maptap-row-in-view-664', { id: 'late', maptap: true, h: 664 });
  F('keyboard-focus', { place: 'aurora', id: 'rey07', starred: false, visited: false, kbd: true });
  F('keyboard-focus-starred', { place: 'aurora', id: 'rey07', starred: true, visited: false, kbd: true });
}

async function setup(b, o) {
  const file = variant(o.style || 'band', !!o.keyline);
  const storage = o.plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {};
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced: !o.motion, city: o.city || 'reykjavik', file, storage, w: o.w || 390, h: o.h || 844 });
  await page.evaluate(BASEMAP);
  if (o.stop) await page.evaluate(s => { window.__STOP = s; }, o.stop);
  if (o.plan) { await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(600); }
  return { ctx, page, errors };
}

async function openTag(page, o) {
  if (o.place) await page.evaluate(async ([id, d]) => { const r = window.__ROWS.find(x => x.id === id); Object.assign(r, d); await refetchLocations(); }, [o.id, { ...PLACES[o.place], starred: o.starred, visited: o.visited }]);
  await W(200);
  if (o.signedOut) await page.evaluate(() => { currentUser = null; updateAuthUI(); });
  // Modality: a real open follows a finger tap, so the tag's programmatic focus is NOT :focus-visible;
  // a scripted open with no input at all would be (Chromium), and would show the keyboard-focus look.
  if (o.kbd) await page.keyboard.press('Tab');   // keyboard: the tag's focus on open is :focus-visible
  else await page.touchscreen.tap(2, 300);       // the map's left edge: nothing there to hit
  if (o.maptap) {   // a finger tap on the pin ON THE MAP, the list scrolled to its top (the row starts out of view)
    const q = await page.evaluate(id => { document.getElementById('locationsList').scrollTop = 0; if (id === 'late') id = __rowIds()[__rowIds().length - 3]; const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], 16, { animate: false }); syncMarkerGlyphZoom();
      const p = map.latLngToContainerPoint([l.lat, l.lng]), r = map.getContainer().getBoundingClientRect(); return { x: r.left + p.x, y: r.top + p.y }; }, o.id);
    await W(400); await page.touchscreen.tap(q.x, q.y); await W(900); return;
  }
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
  if (o.scrolled) await page.evaluate(pre => { const l = document.getElementById('locationsList'), r = document.querySelector(`.location-card[data-id="${pre}03"]`);
    l.scrollTop += r.getBoundingClientRect().top - l.getBoundingClientRect().top + 24; l.dispatchEvent(new Event('scroll')); }, pre);   // the navy row half under the header
  await W(500); await shoot(page, name, { full: true });
}
async function mapShot(page, o, name) {
  const c = o.city; await page.evaluate(async ([S, V, c]) => { window.__ROWS.forEach(x => { if (x.city === c) { const n = x.id.slice(3); x.starred = S.includes(n); x.visited = V.includes(n); } }); await refetchLocations(); }, [STAR, VIS, c]);
  await W(300);
  await page.evaluate(([z, c]) => { const k = CITIES[c]; map.setView(k.center, z, { animate: false }); }, [o.map, o.city]);
  await W(800); await shoot(page, name, { full: true });
}
async function shapeShot(page, o, name) {
  await page.evaluate(async ([t, label, c]) => { const s = window.__SHAPES.find(x => x.city === c && x.type === t); s.label = label; s.starred = false; s.visited = false; await refetchNeighborhoodShapes(); }, [o.shape, o.label, o.city]);
  await W(300);
  await page.evaluate(([t, c]) => { const s = neighborhoodShapes.find(x => x.city === c && x.type === t); map.setView(shapeAnchor(s), 16, { animate: false }); syncNeighborhoodLayers(); neighborhoodLayersById.get(s.id).openPopup(); }, [o.shape, o.city]);
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
  const f = n => name.startsWith('followups/') ? path.join(__dirname, '../followups/stills', `${name.slice(10)}-${n}`)
    : name.startsWith('typestamp/') ? path.join(__dirname, '../type-line/stills/build', `${name.slice(10)}-${n}`) : path.join(OUT, `${name}-${n}`);
  fs.mkdirSync(path.dirname(f('x')), { recursive: true });
  await page.screenshot({ path: f('phone@3x.png') });
  const vp = page.viewportSize();
  execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', `${vp.width}x${vp.height}`, f('phone@1x.png')]);
  if (!name.startsWith('followups/') || !full) fs.unlinkSync(f('phone@3x.png'));   // follow-ups keep the full 3x of their whole-phone shots
  if (box && !full) { const clip = { x: Math.max(0, box.x0 - 16), y: Math.max(0, box.y0 - 30) }; clip.width = Math.min(vp.width, box.x1 + 16) - clip.x; clip.height = Math.min(vp.height, box.y1 + 16) - clip.y;
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
        await page.waitForFunction(() => document.querySelector('.tag-popup.tag-pop'), null, { timeout: 3000, polling: 'raf' });
        await page.evaluate(() => { clearTimeout(tagPopTimer); document.getAnimations().forEach(a => a.pause()); });   // hold the pop where it is; frames() scrubs it
        await frames(page, name, [20, 60, 120, 165, 230, 280]);
      }
      else { await openTag(page, o); await shoot(page, name, { full: !!o.phone || !!o.maptap }); }
    }
    catch (e) { console.log('FAIL', name, e.message); }
    console.log(name, errors.length ? errors : '');
    await ctx.close();
  }
  await b.close();
})();
