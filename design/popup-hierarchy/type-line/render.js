// Type-line concepts: stills of the REAL index.html with only the tag's field line restyled.
// Each variant is a scratch copy of index.html with one <style> block appended before </head>
// that overrides .tag-fields / .tag-f / .tag-lab / .tag-val (markup untouched).
// Same harness, fixture text and stand-in basemap as ../build/render.js.
//   node design/popup-hierarchy/type-line/render.js [variant|state ...]
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const { launch, openProto, W, FILE } = require('../../gesture-harness/lib');
const OUT = path.join(__dirname, 'stills');
const VARIANTS = require('./variants');
const BASE = fs.readFileSync(path.join(__dirname, '../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const BASEMAP = `(() => { const st = document.createElement('style'); st.textContent = '.k-base{position:absolute;inset:0;z-index:0;pointer-events:none;filter:sepia(.3) saturate(.75) contrast(.96) hue-rotate(-6deg)}.k-base svg{width:100%;height:100%;display:block}.leaflet-tile-pane{opacity:0}'; document.head.appendChild(st);
${BASE} basemap(); })();`;

const PLACES = {
  aurora: { name: 'Aurora Reykjavík', category: 'attraction', short_address: 'Fiskislóð 53 · Örfirisey',
    notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.' },
  vega: { name: 'VEGA Copenhagen', category: 'bar', short_address: 'Rejsbygade · Vesterbro',
    notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar)." },
};
const STATES = {
  busiest: { place: 'vega', id: 'rey01', starred: true, visited: true, plan: true, select: true },
  typical: { place: 'aurora', id: 'rey07', starred: false, visited: false },
  district: { shape: 'district', label: 'Grandi (Old Harbour district)' },
  signedout: { place: 'aurora', id: 'rey07', starred: true, visited: false, signedOut: true },
};

const copyFor = (key) => {
  const css = VARIANTS[key].css;
  const src = fs.readFileSync(FILE, 'utf8');
  const f = path.join(os.tmpdir(), `typeline-${key}.html`);
  fs.writeFileSync(f, css ? src.replace('</head>', `<style id="type-line-variant">${css}</style>\n</head>`) : src);
  return f;
};

async function setup(b, file, o) {
  const storage = o.plan ? { 'gh.plans': '1', 'triplet.reorderHint': '1' } : {};
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced: true, city: 'reykjavik', file, storage, h: 844 });
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
}
async function openShape(page, o) {
  await page.evaluate(async ([t, label]) => { const s = window.__SHAPES.find(x => x.city === 'reykjavik' && x.type === t); s.label = label; s.starred = false; s.visited = false; await refetchNeighborhoodShapes(); }, [o.shape, o.label]);
  await W(300);
  await page.evaluate(t => { const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === t); map.setView(shapeAnchor(s), 16, { animate: false }); syncNeighborhoodLayers(); neighborhoodLayersById.get(s.id).openPopup(); }, o.shape);
  await W(800);
}
async function shoot(page, name) {
  await page.evaluate(() => document.fonts.ready);
  const box = await page.evaluate(() => { const c = document.querySelector('.leaflet-popup.tag-popup'); if (!c) return null; const r = c.getBoundingClientRect(); return { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom }; });
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
  for (const key of Object.keys(VARIANTS)) {
    const file = copyFor(key);
    for (const [st, o] of Object.entries(STATES)) {
      if (only.length && !only.includes(key) && !only.includes(st)) continue;
      const { ctx, page, errors } = await setup(b, file, o);
      try { if (o.shape) await openShape(page, o); else await openTag(page, o); await shoot(page, `${key}/${st}`); }
      catch (e) { console.log('FAIL', key, st, e.message); }
      console.log(key, st, errors.length ? errors : '');
      await ctx.close();
    }
  }
  await b.close();
  // contact sheets: the four 1x phone stills side by side, per variant (same pixels, for review)
  for (const key of Object.keys(VARIANTS)) {
    const ins = Object.keys(STATES).map(s => path.join(OUT, key, `${s}-phone@1x.png`)).filter(fs.existsSync);
    if (ins.length) execFileSync('convert', [...ins, '+append', path.join(OUT, `${key}-sheet@1x.png`)]);
  }
})();
