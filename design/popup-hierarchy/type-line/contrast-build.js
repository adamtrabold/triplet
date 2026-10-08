// BUILD (type-stamp): the same measurement on the built index.html, on every stamped entry (.tag-stamp: TYPE's word,
// PLAN's two numbers; the printed "Stop"/"of" are hidden while measuring so they never count as core). The
// restaurant row is forced to "Stop 12 of 14" through the same stills-only planMark hook as build/render.js.
// Writes contrast-build.json.
// D Rubber stamp: effective contrast of the TEXTURED ink, measured in the rendered page.
// For each stamped value: shoot it as rendered, then again with the mask and ink spread switched
// off (same box, same tilt). Pixels that are solid ink in the unmasked shot are the glyph core;
// the same pixels in the textured shot are what the eye gets. Reports, against the tag paper:
//   flat     -- unmasked core colour (= --ink-2 on --paper-raised)
//   mean     -- the textured core's mean colour (the stroke as read)
//   p10      -- the 10th-percentile (lightest 10%) of textured core pixels
// at dsf 1 (the 1x still) and dsf 3 (the phone). Writes contrast.json.
//   node design/popup-hierarchy/type-line/contrast.js
const path = require('path'), fs = require('fs'), os = require('os');
const { launch, openProto, W, FILE } = require('../../gesture-harness/lib');
const V = require('./variants-r2');

const lum = ([r, g, b]) => { const f = c => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };

function copy(key) {
  let src = fs.readFileSync(FILE, 'utf8');
  src = src.replace('    function stampTilt(id) {', V.TILT_JS + '    function stampTilt(id) {')
    .replace('<span class="tag-val popup-cat">', '<span class="tag-val popup-cat" style="--type-tilt:${typeTilt(loc.id)}deg">')
    .replace('<span class="tag-lab">Plan</span><span class="tag-val">', '<span class="tag-lab">Plan</span><span class="tag-val" style="--plan-tilt:${typeTilt(loc.id, 1)}deg">')
    .replace('</head>', `<style>${V[key].css}</style>\n</head>`);
  const f = path.join(os.tmpdir(), `contrast-${key}.html`); fs.writeFileSync(f, src); return f;
}

async function decode(page, buf) {
  return page.evaluate(async b64 => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0); return Array.from(x.getImageData(0, 0, c.width, c.height).data);
  }, buf.toString('base64'));
}

function hooked() {
  const SRC = "function planMark(kind, id) { const pm = planMarks(); return (kind === 'loc' ? pm.byLoc : pm.byShape).get(id) || null; }";
  const src = fs.readFileSync(FILE, 'utf8'); if (!src.includes(SRC)) throw new Error('planMark not found');
  const f = path.join(os.tmpdir(), 'contrast-build.html');
  fs.writeFileSync(f, src.replace(SRC, "function planMark(kind, id) { const pm = planMarks(); const r = (kind === 'loc' ? pm.byLoc : pm.byShape).get(id) || null; return r && window.__STOP ? { ...r, ...window.__STOP } : r; }"));
  return f;
}
(async () => {
  const b = await launch(); const out = {};
  for (const key of ['build']) for (const dsf of [1, 3]) {
    const { ctx, page } = await openProto(b, { dsf, reduced: true, file: hooked(), storage: { 'gh.plans': '1', 'triplet.reorderHint': '1' } });
    await page.waitForFunction(() => typeof plans !== 'undefined' && plans.length === 1, null, { timeout: 10000 });
    await page.evaluate(() => setListView('plans')); await W(500);
    for (const [cat, id] of [['bar', 'rey01'], ['restaurant', 'rey00']]) {
      await page.evaluate(s => { window.__STOP = s; }, cat === 'restaurant' ? { n: 12, m: 14 } : null);
      await page.evaluate(async ([id, cat]) => { const r = window.__ROWS.find(x => x.id === id); r.category = cat; await refetchLocations(); }, [id, cat]);
      await page.evaluate(id => { const l = locations.find(x => x.id === id); map.setView([l.lat, l.lng], 16, { animate: false }); markersById.get(id).marker.openPopup(); }, id);
      await W(800); await page.evaluate(() => document.fonts.ready);
      const vals = await page.$$eval('.tag-popup .tag-stamp', els => els.map((e, i) => { e.dataset.k = i; return e.textContent; }));
      await page.evaluate(() => { const st = document.createElement('style'); st.id = 'hidePrint'; st.textContent = '.tag-popup .tag-plan { color: transparent !important; }'; document.head.appendChild(st); });
      for (const [i, text] of vals.entries()) {
        const sel = `.tag-popup .tag-stamp[data-k="${i}"]`;
        const r = await page.$eval(sel, e => { const r = e.getBoundingClientRect(); return { x: Math.floor(r.x) - 2, y: Math.floor(r.y) - 2, width: Math.ceil(r.width) + 4, height: Math.ceil(r.height) + 4 }; });
        const A = await decode(page, await page.screenshot({ clip: r }));
        await page.$eval(sel, e => { e.style.mask = 'none'; e.style.webkitMask = 'none'; e.style.textShadow = 'none'; });
        await W(50);
        const B = await decode(page, await page.screenshot({ clip: r }));
        await page.$eval(sel, e => { e.style.mask = ''; e.style.webkitMask = ''; e.style.textShadow = ''; });
        const paper = [B[0], B[1], B[2]];
        const core = [], flat = [];
        for (let p = 0; p < B.length; p += 4) { const px = [B[p], B[p + 1], B[p + 2]]; if (cr(px, paper) >= 5.5) { flat.push(px); core.push([A[p], A[p + 1], A[p + 2]]); } }
        const mean = a => [0, 1, 2].map(k => a.reduce((s, x) => s + x[k], 0) / a.length);
        const crs = core.map(px => cr(px, paper)).sort((x, y) => x - y);
        const label = `${key} dsf${dsf} ${cat} ${i ? 'plan' : 'type'} "${text}"`;
        out[label] = { corePx: core.length, flat: +cr(mean(flat), paper).toFixed(2), mean: +cr(mean(core), paper).toFixed(2), p10: +crs[Math.floor(crs.length * .1)].toFixed(2), median: +crs[Math.floor(crs.length * .5)].toFixed(2) };
        console.log(label.padEnd(34), JSON.stringify(out[label]));
      }
      await page.evaluate(() => document.getElementById('hidePrint').remove());
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, 'contrast-build.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
