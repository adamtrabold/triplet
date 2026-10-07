// Type-line concepts, ROUND 2 (A Ledger + D Rubber stamp, after the UX and CD reviews): stills of the REAL index.html with only the tag's field line restyled.
// Each variant is a scratch copy of index.html with one <style> block appended before </head>
// that overrides .tag-fields / .tag-f / .tag-lab / .tag-val (markup untouched).
// Same harness, fixture text and stand-in basemap as ../build/render.js.
//   node design/popup-hierarchy/type-line/render.js [variant|state ...]
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const { launch, openProto, W, FILE } = require('../../gesture-harness/lib');
const OUT = path.join(__dirname, 'stills', 'r2');
const VARIANTS = require('./variants-r2');
const BASE = fs.readFileSync(path.join(__dirname, '../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const BASEMAP = `(() => { const st = document.createElement('style'); st.textContent = '.k-base{position:absolute;inset:0;z-index:0;pointer-events:none;filter:sepia(.3) saturate(.75) contrast(.96) hue-rotate(-6deg)}.k-base svg{width:100%;height:100%;display:block}.leaflet-tile-pane{opacity:0}'; document.head.appendChild(st);
${BASE} basemap(); })();`;

const PLACES = {
  aurora: { name: 'Aurora Reykjavík', category: 'attraction', short_address: 'Fiskislóð 53 · Örfirisey',
    notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.' },
  baejarins: { name: 'Bæjarins Beztu', category: 'restaurant', short_address: 'Tryggvagata 1 · Miðborg',
    notes: 'The hot-dog stand. Order "eina með öllu" (one with everything). Open late; queue moves fast.' },
  vega: { name: 'VEGA Copenhagen', category: 'bar', short_address: 'Rejsbygade · Vesterbro',
    notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar)." },
};
const STATES = {
  busiest: { place: 'vega', id: 'rey01', starred: true, visited: true, plan: true, select: true },
  typical: { place: 'aurora', id: 'rey07', starred: false, visited: false },
  district: { shape: 'district', label: 'Grandi (Old Harbour district)' },
  long: { place: 'baejarins', id: 'rey00', starred: false, visited: true, plan: true, select: true, stop: 'Stop 12 of 14' },
  'long-narrow': { place: 'baejarins', id: 'rey00', starred: false, visited: true, plan: true, select: true, stop: 'Stop 12 of 14', w: 320 },
  signedout: { place: 'aurora', id: 'rey07', starred: true, visited: false, signedOut: true },
};

const copyFor = (key) => {
  const { css, tilt } = VARIANTS[key];
  let src = fs.readFileSync(FILE, 'utf8');
  // fixture hook (stills only): window.__STOP overrides the plan line, for the long case
  const STOP_SRC = 'return r ? `Stop ${r.n} of ${r.m}` : \'\';';
  if (!src.includes(STOP_SRC)) throw new Error('planStopLine not found');
  src = src.replace(STOP_SRC, 'return r ? (window.__STOP || `Stop ${r.n} of ${r.m}`) : \'\';');
  if (tilt) {
    const a = src.length;
    src = src.replace('    function stampTilt(id) {', VARIANTS.TILT_JS + '    function stampTilt(id) {')
      .replace('<span class="tag-val popup-cat">', '<span class="tag-val popup-cat" style="--type-tilt:${typeTilt(loc.id)}deg">')
      .replace('<span class="tag-lab">Plan</span><span class="tag-val">', '<span class="tag-lab">Plan</span><span class="tag-val" style="--plan-tilt:${typeTilt(loc.id, 1)}deg">');
    if ((src.match(/typeTilt\(/g) || []).length !== 3) throw new Error('tilt patch failed');
  }
  const f = path.join(os.tmpdir(), `typeline-${key}.html`);
  fs.writeFileSync(f, css ? src.replace('</head>', `<style id="type-line-variant">${css}</style>\n</head>`) : src);
  return f;
};

async function setup(b, file, o) {
  const storage = o.plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {};
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced: true, city: 'reykjavik', file, storage, h: 844, w: o.w || 390 });
  await page.evaluate(BASEMAP);
  if (o.stop) await page.evaluate(s => { window.__STOP = s; }, o.stop);
  if (o.plan) { await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 }); await page.evaluate(() => setListView('plans')); await W(600); }
  return { ctx, page, errors };
}
async function openTag(page, o) {
  await page.evaluate(async ([id, d]) => { const r = window.__ROWS.find(x => x.id === id); Object.assign(r, d); await refetchLocations(); }, [o.id, { ...PLACES[o.place], starred: o.starred, visited: o.visited }]);
  await W(200);
  if (o.signedOut) await page.evaluate(() => { currentUser = null; updateAuthUI(); });
  await page.evaluate(([id, sel]) => { const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], 16, { animate: false }); if (sel) setHighlighted(id); syncMarkerGlyphZoom(); markersById.get(id).marker.openPopup(); }, [o.id, !!o.select]);
  await W(700);
}
async function openShape(page, o) {
  await page.evaluate(async ([t, label]) => { const s = window.__SHAPES.find(x => x.city === 'reykjavik' && x.type === t); s.label = label; s.starred = false; s.visited = false; await refetchNeighborhoodShapes(); }, [o.shape, o.label]);
  await W(300);
  await page.evaluate(t => { const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === t); map.setView(shapeAnchor(s), 16, { animate: false }); syncNeighborhoodLayers(); neighborhoodLayersById.get(s.id).openPopup(); }, o.shape);
  await W(800);
}
async function shoot(page, name, w = 390) {
  await page.evaluate(() => document.fonts.ready);
  const box = await page.evaluate(() => { const c = document.querySelector('.leaflet-popup.tag-popup'); if (!c) return null; const r = c.getBoundingClientRect(); return { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom }; });
  const f = n => path.join(OUT, `${name}-${n}`);
  fs.mkdirSync(path.dirname(f('x')), { recursive: true });
  await page.screenshot({ path: f('phone@3x.png') });
  execFileSync('convert', [f('phone@3x.png'), '-filter', 'Box', '-resize', `${w}x844`, f('phone@1x.png')]);
  fs.unlinkSync(f('phone@3x.png'));
  if (box) { const clip = { x: Math.max(0, box.x0 - 16), y: Math.max(0, box.y0 - 30) }; clip.width = Math.min(w, box.x1 + 16) - clip.x; clip.height = Math.min(844, box.y1 + 16) - clip.y;
    await page.screenshot({ path: f('crop@3x.png'), clip });
    // the field line alone, with the note's last line above and the stub labels below, for the owner page
    const fl = await page.evaluate(() => { const t = document.querySelector('.tag-popup .tag-fields').getBoundingClientRect(), b = document.querySelector('.tag-popup .tag-body').getBoundingClientRect(); return { x: b.left, y: t.top - 26, width: b.width, height: t.height + 26 + 70 }; });
    await page.screenshot({ path: f('line@3x.png'), clip: fl }); }
}

(async () => {
  const only = process.argv.slice(2);
  const b = await launch();
  for (const key of Object.keys(VARIANTS).filter(k => k !== 'TILT_JS')) {
    const file = copyFor(key);
    for (const [st, o] of Object.entries(STATES)) {
      if (only.length && !only.includes(key) && !only.includes(st)) continue;
      const { ctx, page, errors } = await setup(b, file, o);
      try { if (o.shape) await openShape(page, o); else await openTag(page, o); await shoot(page, `${key}/${st}`, o.w || 390); }
      catch (e) { console.log('FAIL', key, st, e.message); }
      console.log(key, st, errors.length ? errors : '');
      await ctx.close();
    }
  }
  await b.close();
  // contact sheets: the four 1x phone stills side by side, per variant (same pixels, for review)
  for (const key of Object.keys(VARIANTS).filter(k => k !== 'TILT_JS')) {
    const ins = Object.keys(STATES).map(s => path.join(OUT, key, `${s}-phone@1x.png`)).filter(fs.existsSync);
    if (ins.length) execFileSync('convert', [...ins, '+append', path.join(OUT, `${key}-sheet@1x.png`)]);
  }
})();
