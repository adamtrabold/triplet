// Un-visit transition concepts: filmstrips of the REAL tag (scratch copy of index.html + one
// option's CSS, options.js), in the gesture harness with ../build/render.js's stand-in basemap.
// Opens Aurora's tag visited (and starred, the band on), taps Visited, pauses every animation and
// steps them to exact times (Web Animations API), shooting a 3x crop of the stub per frame; then
// stacks the frames into a labelled filmstrip.
//   node design/popup-hierarchy/unvisit/render.js [option ...]
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const { launch, openProto, W, FILE } = require('../../gesture-harness/lib');
const OPT = require('./options');
const OUT = path.join(__dirname, 'stills');
const BASE = fs.readFileSync(path.join(__dirname, '../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const BASEMAP = `(() => { const st = document.createElement('style'); st.textContent = '.k-base{position:absolute;inset:0;z-index:0;pointer-events:none;filter:sepia(.3) saturate(.75) contrast(.96) hue-rotate(-6deg)}.k-base svg{width:100%;height:100%;display:block}.leaflet-tile-pane{opacity:0}'; document.head.appendChild(st);
${BASE} basemap(); })();`;
const AURORA = { name: 'Aurora Reykjavík', category: 'attraction', short_address: 'Fiskislóð 53 · Örfirisey',
  notes: 'Indoor Northern Lights exhibit, rainy-day/kid option. Grandi harbor — not to be confused with unrelated businesses that also use "Aurora" in their name.' };
const TIMES = {
  shipped: [0, 40, 90, 140, 200, 260],
  lift: [0, 60, 130, 190, 250, 380],
  dry: [0, 80, 160, 240, 310, 420],
  rub: [0, 90, 170, 240, 310, 440],
  strike: [0, 50, 110, 200, 290, 420],
};
const REDUCED_TIMES = [0, 50, 100, 200];

const copyFor = key => {
  const src = fs.readFileSync(FILE, 'utf8'), css = OPT[key].css;
  const f = path.join(os.tmpdir(), `unvisit-${key}.html`);
  fs.writeFileSync(f, css ? src.replace('</head>', `<style id="unvisit-option">${css}</style>\n</head>`) : src);
  return f;
};

async function strip(b, key, times, reduced, name) {
  const { ctx, page, errors } = await openProto(b, { dsf: 3, reduced, city: 'reykjavik', file: copyFor(key), h: 844 });
  await page.evaluate(BASEMAP);
  await page.evaluate(async d => { const r = window.__ROWS.find(x => x.id === 'rey07'); Object.assign(r, d); await refetchLocations(); }, { ...AURORA, starred: true, visited: true });
  await W(200);
  await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 16, { animate: false }); syncMarkerGlyphZoom(); markersById.get('rey07').marker.openPopup(); });
  await W(900);
  const clip = await page.evaluate(() => { const s = document.querySelector('.tag-popup .tag-stub').getBoundingClientRect(); return { x: s.left - 12, y: s.top - 8, width: s.width + 24, height: s.height + 16 }; });
  fs.mkdirSync(path.join(OUT, name), { recursive: true });
  const before = path.join(OUT, name, 'before@3x.png');
  await page.screenshot({ path: before, clip });
  await page.evaluate(() => document.querySelector('.tag-popup .popup-visited').click());
  await W(20);
  await page.evaluate(() => document.getAnimations().forEach(a => { try { a.pause(); } catch (_) {} }));
  const files = [before];
  for (const t of times) {
    const has = await page.evaluate(t => { document.getAnimations().forEach(a => { try { a.pause(); a.currentTime = t; } catch (_) {} }); return !!document.querySelector('.tag-popup .tag-stamp-out'); }, t);
    await W(60);
    const f = path.join(OUT, name, `${String(t).padStart(3, '0')}ms@3x.png`);
    await page.screenshot({ path: f, clip }); files.push(f);
    if (!has && t === 0 && key !== 'shipped' && !reduced) console.log('  (no .tag-stamp-out at t=0!)');
  }
  // labelled filmstrip: each frame with its time on the left, stacked
  const labs = ['before', ...times.map(t => `${t} ms`)];
  const rows = files.map((f, i) => { const o = f.replace('@3x.png', '-lab.png');
    execFileSync('convert', [f, '-gravity', 'West', '-background', '#F2EBDD', '-splice', '150x0', '-font', 'DejaVu-Sans', '-pointsize', '30', '-fill', '#5A564C', '-annotate', '+18+0', labs[i], o]); return o; });
  execFileSync('convert', [...rows, '-background', '#F2EBDD', '-splice', '0x10', '-append', path.join(OUT, `${name}-strip.png`)]);
  rows.forEach(f => fs.unlinkSync(f));
  console.log(name, errors.length ? errors : '');
  await ctx.close();
}

(async () => {
  const only = process.argv.slice(2);
  const b = await launch();
  for (const key of Object.keys(TIMES)) if (!only.length || only.includes(key)) await strip(b, key, TIMES[key], false, key);
  if (!only.length || only.includes('reduced')) await strip(b, 'lift', REDUCED_TIMES, true, 'reduced');
  await b.close();
})();
