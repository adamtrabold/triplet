// Un-visit, ROUND 2: filmstrips + measurements of the REAL tag with one option's CSS (options.js).
//   node design/popup-hierarchy/unvisit/render-r2.js [option ...]
// Per option:
//   stills/r2/<opt>-strip.png            stub, 3x, 390-wide phone (stamp scale 1.1), labelled frames
//   stills/r2/<opt>-strip-s100.png       the same on a 320 phone (288 tag, stamp 1.0)
//   stills/r2/<opt>-strip-s085.png       the same on a 272 phone (240 tag, stamp 0.85)
//   stills/r2/<opt>-tag1x.png            the WHOLE busiest tag (VEGA: band, address, long note) at true 1x, key frames side by side
//   stills/r2/reduced-strip.png          reduced motion (lift's CSS; all share it)
//   r2-frames.json                       per frame: stamp box vs its segment (overflow px), stamp colour (oklch) + opacity,
//                                        the words' ink alpha -- the crossing check, the never-grey check, the stays-inside check
// Frames are stepped with the Web Animations API (all animations paused, currentTime set).
const path = require('path'), fs = require('fs'), os = require('os'), { execFileSync } = require('child_process');
const { launch, openProto, W, FILE } = require('../../gesture-harness/lib');
const OPT = require('./options');
const OUT = path.join(__dirname, 'stills', 'r2');
const BASE = fs.readFileSync(path.join(__dirname, '../round1/concepts.js'), 'utf8').match(/  function basemap\(\) \{[\s\S]*?\n  \}\n/)[0];
const BASEMAP = `(() => { const st = document.createElement('style'); st.textContent = '.k-base{position:absolute;inset:0;z-index:0;pointer-events:none;filter:sepia(.3) saturate(.75) contrast(.96) hue-rotate(-6deg)}.k-base svg{width:100%;height:100%;display:block}.leaflet-tile-pane{opacity:0}'; document.head.appendChild(st);
${BASE} basemap(); })();`;
const VEGA = { name: 'VEGA Copenhagen', category: 'bar', short_address: 'Rejsbygade · Vesterbro',
  notes: "Store VEGA, Lille VEGA, Ideal Bar — the city's premier venue. Sat Sept 26: María José Llergo (Lille VEGA), Lake Street Dive w/ Røverdatter (Store VEGA, waitlisted), KARLA w/ Asger Falgren (Ideal Bar)." };
const TIMES = {
  shipped: [0, 40, 90, 140, 200, 260],
  lift: [0, 84, 130, 210, 280, 320, 380],
  dry: [0, 84, 160, 240, 280, 320, 380],
  strike: [0, 60, 130, 200, 300, 340, 400],
  dryA: [0, 100, 200, 300, 360, 410, 450, 490, 580],
  dryB: [0, 100, 180, 240, 300, 360, 420, 480, 580],
  erase: [0, 80, 160, 240, 320, 400, 480, 560, 620, 740],
  dry3: [0, 100, 160, 200, 240, 280, 320, 360, 400, 440, 480, 580],
  dry2: [0, 120, 180, 220, 250, 280, 320, 360, 420, 480, 580],
  blot: [0, 120, 180, 220, 250, 280, 320, 360, 420, 480, 580],
};
const KEY1X = { shipped: [0, 90, 200, 260], lift: [84, 210, 280, 380], dry: [84, 200, 280, 380], strike: [130, 240, 310, 400], erase: [160, 320, 480, 740], dryA: [200, 360, 450, 580], dryB: [180, 300, 420, 580], blot: [200, 260, 320, 580], dry2: [220, 280, 360, 580], dry3: [200, 280, 360, 580] };
const SCALES = [['', 390], ['-s100', 320], ['-s085', 272]];

const copyFor = key => {
  const src = fs.readFileSync(FILE, 'utf8'), css = OPT[key].css;
  const f = path.join(os.tmpdir(), `unvisit2-${key}.html`);
  fs.writeFileSync(f, css ? src.replace('</head>', `<style id="unvisit-option">${css}</style>\n${OPT[key].strokes ? OPT.ERASE_JS : ''}${OPT[key].blot ? OPT.BLOT_JS : ''}${OPT[key].dry3 ? OPT.DRY3_JS : ''}${OPT.SYNC_JS}\n</head>`) : src);
  return f;
};

// colour string -> oklch [L, C, H]
function oklch(str) {
  let m;
  if ((m = str.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/))) { let L = +m[1]; if (L > 1.5) L /= 100; return [L, +m[2], +m[3]]; }
  if ((m = str.match(/oklab\(([\d.]+)%?\s+(-?[\d.]+)\s+(-?[\d.]+)/))) { let L = +m[1]; if (L > 1.5) L /= 100; const a = +m[2], b = +m[3]; return [L, Math.hypot(a, b), (Math.atan2(b, a) * 180 / Math.PI + 360) % 360]; }
  let rgb;
  if ((m = str.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/))) rgb = [+m[1] / 255, +m[2] / 255, +m[3] / 255];
  else if ((m = str.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/))) rgb = [+m[1], +m[2], +m[3]];
  else return null;
  const lin = c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; const [r, g, b] = rgb.map(lin);
  const l = Math.cbrt(.4122214708 * r + .5363355807 * g + .0514459929 * b), mm = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  const L = .2104542553 * l + .793617785 * mm - .0040720468 * s, A = 1.9779984951 * l - 2.428592205 * mm + .4505937099 * s, B = .0259040371 * l + .7827717662 * mm - .808675766 * s;
  return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360];
}
const alphaOf = str => { const m = str.match(/\/\s*([\d.]+)(%?)\s*\)/) || str.match(/rgba\([^)]*,\s*([\d.]+)\)/); if (str === 'transparent' || /rgba\(0, 0, 0, 0\)/.test(str)) return 0; return m ? (m[2] === '%' ? +m[1] / 100 : +m[1]) : 1; };

async function openVega(b, key, { w = 390, dsf = 3, reduced = false } = {}) {
  const { ctx, page, errors } = await openProto(b, { dsf, reduced, city: 'reykjavik', file: copyFor(key), w, h: 844 });
  await page.evaluate(BASEMAP);
  await page.evaluate(async d => { const r = window.__ROWS.find(x => x.id === 'rey01'); Object.assign(r, d); await refetchLocations(); }, { ...VEGA, starred: true, visited: true });
  await W(200);
  await page.evaluate(() => { const l = locations.find(x => x.id === 'rey01'); map.setView([l.lat, l.lng], 16, { animate: false }); syncMarkerGlyphZoom(); markersById.get('rey01').marker.openPopup(); });
  await W(900);
  return { ctx, page, errors };
}
const tapAndPause = async page => {
  await page.evaluate(() => document.querySelector('.tag-popup .popup-visited').click());
  await W(20);
  await page.evaluate(() => document.getAnimations().forEach(a => { try { a.pause(); } catch (_) {} }));
};
const seek = (page, t) => page.evaluate(t => { document.getAnimations().forEach(a => { try { a.pause(); a.currentTime = t; } catch (_) {} }); }, t);
const measure = page => page.evaluate(() => {
  const s = document.querySelector('.tag-popup .tag-stamp-out'), slot = document.querySelector('.tag-popup .tag-slot.vis'), seg = document.querySelector('.tag-popup .popup-visited');
  const sr = slot.getBoundingClientRect(), stub = document.querySelector('.tag-popup .tag-stub').getBoundingClientRect();
  const o = { words: getComputedStyle(seg).color };
  if (s) { const r = s.getBoundingClientRect(), cs = getComputedStyle(s);
    o.stamp = { color: cs.color, opacity: +cs.opacity, overL: +(sr.left - r.left).toFixed(1), overR: +(r.right - sr.right).toFixed(1), overT: +(stub.top - r.top).toFixed(1), overB: +(r.bottom - stub.bottom).toFixed(1) }; }
  return o;
});

function stripImg(files, labs, out) {
  const rows = files.map((f, i) => { const o = f.replace(/\.png$/, '-lab.png');
    execFileSync('convert', [f, '-gravity', 'West', '-background', '#F2EBDD', '-splice', '150x0', '-font', 'DejaVu-Sans', '-pointsize', '30', '-fill', '#5A564C', '-annotate', '+18+0', labs[i], o]); return o; });
  execFileSync('convert', [...rows, '-background', '#F2EBDD', '-splice', '0x10', '-append', out]);
  rows.forEach(f => fs.unlinkSync(f));
}

async function stubStrip(b, key, suffix, w, times, reduced, name, J) {
  const { ctx, page, errors } = await openVega(b, key, { w, reduced });
  const clip = await page.evaluate(() => { const s = document.querySelector('.tag-popup .tag-stub').getBoundingClientRect(); return { x: s.left - 12, y: s.top - 8, width: s.width + 24, height: s.height + 16 }; });
  const dir = path.join(OUT, name + suffix); fs.mkdirSync(dir, { recursive: true });
  const files = [path.join(dir, 'before@3x.png')]; await page.screenshot({ path: files[0], clip });
  await tapAndPause(page);
  for (const t of times) {
    await seek(page, t); await W(50);
    const f = path.join(dir, `${String(t).padStart(3, '0')}ms@3x.png`); await page.screenshot({ path: f, clip }); files.push(f);
    const m = await measure(page);
    if (m.stamp) m.stamp.oklch = (oklch(m.stamp.color) || []).map(x => +x.toFixed(3));
    m.wordsAlpha = alphaOf(m.words);
    (J[name + suffix] = J[name + suffix] || {})[t] = m;
  }
  stripImg(files, ['before', ...times.map(t => `${t} ms`)], path.join(OUT, `${name}-strip${suffix}.png`));
  console.log(name + suffix, errors.length ? errors : '');
  await ctx.close();
}

async function tag1x(b, key) {
  const { ctx, page } = await openVega(b, key, { dsf: 1 });
  const clip = await page.evaluate(() => { const r = document.querySelector('.tag-popup .tag-body').getBoundingClientRect(); return { x: r.left - 8, y: r.top - 8, width: r.width + 16, height: r.height + 16 }; });
  const dir = path.join(OUT, key + '-tag1x'); fs.mkdirSync(dir, { recursive: true });
  const files = [path.join(dir, 'before@1x.png')]; await page.screenshot({ path: files[0], clip });
  await tapAndPause(page);
  for (const t of KEY1X[key]) { await seek(page, t); await W(50); const f = path.join(dir, `${String(t).padStart(3, '0')}ms@1x.png`); await page.screenshot({ path: f, clip }); files.push(f); }
  const labs = ['before', ...KEY1X[key].map(t => `${t} ms`)];
  const cols = files.map((f, i) => { const o = f.replace(/\.png$/, '-lab.png');
    execFileSync('convert', [f, '-gravity', 'North', '-background', '#F2EBDD', '-splice', '0x22', '-font', 'DejaVu-Sans', '-pointsize', '13', '-fill', '#5A564C', '-annotate', '+0+4', labs[i], o]); return o; });
  execFileSync('convert', [...cols, '-background', '#F2EBDD', '-splice', '6x0', '+append', path.join(OUT, `${key}-tag1x.png`)]);
  cols.forEach(f => fs.unlinkSync(f));
  await ctx.close();
}

(async () => {
  const only = process.argv.slice(2);
  const b = await launch(); const J = {};
  fs.mkdirSync(OUT, { recursive: true });
  for (const key of Object.keys(TIMES)) {
    if (only.length && !only.includes(key)) continue;
    for (const [suf, w] of SCALES) await stubStrip(b, key, suf, w, TIMES[key], false, key, J);
    await tag1x(b, key);
  }
  if (!only.length || only.includes('reduced')) await stubStrip(b, 'lift', '', 390, [0, 40, 80, 120, 160], true, 'reduced', J);
  await b.close();
  const jf = path.join(__dirname, 'r2-frames.json');
  const prev = fs.existsSync(jf) ? JSON.parse(fs.readFileSync(jf, 'utf8')) : {};
  fs.writeFileSync(jf, JSON.stringify({ ...prev, ...J }, null, 1));
})();
