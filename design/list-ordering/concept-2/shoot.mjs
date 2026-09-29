// Screenshots concept.html at 390px frames. Fonts served locally
// (sandbox Chromium can't reach Google Fonts through the proxy).
// Usage: FONT_DIR=/path/with/archivo.css+woff2 node shoot.mjs
import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = process.env.FONT_DIR;
const exe = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium-'))[0];
const browser = await chromium.launch({ executablePath: `/opt/pw-browsers/${exe}/chrome-linux/chrome` });

async function page(scale) {
  const ctx = await browser.newContext({ deviceScaleFactor: scale, viewport: { width: 2600, height: 1400 } });
  const p = await ctx.newPage();
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css',
    body: fs.readFileSync(path.join(FONT_DIR, 'archivo.css'), 'utf8') }));
  await p.route('https://fonts.gstatic.com/**', r => r.fulfill({ contentType: 'font/woff2',
    body: fs.readFileSync(path.join(FONT_DIR, path.basename(new URL(r.request().url()).pathname))) }));
  return p;
}
const url = v => 'file://' + path.join(here, 'concept.html') + '?view=' + v;
async function shoot(p, v, out, sel = '.board') {
  await p.goto(url(v)); await p.evaluate(() => document.fonts.ready);
  await p.locator(sel).first().screenshot({ path: path.join(here, out) });
  console.log('wrote', out);
}
const p2 = await page(2);
for (const [v, out] of [['A', 'A.png'], ['B', 'B.png'], ['C', 'C.png'], ['D', 'D.png'], ['film', 'filmstrip.png'],
  ['pick', 'pick-A-byline.png'], ['Cwide', 'C-tag-long-city.png'], ['compare', 'compare-A-B-D.png'], ['collapsed', 'pick-A-collapsed.png']]) await shoot(p2, v, out);
const p3 = await page(3);
await shoot(p3, 'flip', 'pick-A-flip-3x.png');
await shoot(p3, 'flipReduced', 'pick-A-flip-reduced-3x.png');
await shoot(p3, 'states', 'pick-A-states-3x.png');
await shoot(p3, 'labels', 'pick-A-labels-3x.png');

// measurements: hit zone by hit-testing, header height, list viewport
await p2.goto(url('pick')); await p2.evaluate(() => document.fonts.ready);
const m = await p2.evaluate(() => {
  const ph = document.querySelector('.dirA');
  const hdr = ph.querySelector('.locationsHeader').getBoundingClientRect();
  const h2 = ph.querySelector('h2');
  const rng = document.createRange(); rng.selectNodeContents(h2); const tr = rng.getBoundingClientRect();
  const isBy = (x, y) => !!document.elementFromPoint(x, y)?.closest('.byline');
  // scan the header for the byline's hit region
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (let y = Math.floor(hdr.top); y <= hdr.bottom; y += 0.5) for (let x = hdr.left; x <= hdr.right; x += 1)
    if (isBy(x, y)) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  // any point over the name's text box that hits the byline?
  let nameHits = 0, nameProbes = 0;
  const lt = h2.getBoundingClientRect().top; for (let y = lt + 2; y < lt + 18; y += 1) for (let x = tr.left; x <= tr.right; x += 2) { nameProbes++; if (isBy(x, y)) nameHits++; }
  const btn = (s) => ph.querySelector(s).getBoundingClientRect();
  return {
    header_px: hdr.height, zone_px: { w: maxX - minX + 1, h: maxY - minY + 0.5, top_from_header: minY - hdr.top },
    name_line_top_from_header: tr.top - hdr.top, name_probes_hitting_byline: `${nameHits}/${nameProbes} (name ink box: line top+2 .. +18)`,
    collapse_right: btn('.collapseBtn').right - hdr.left, zone_left: minX - hdr.left, filters_left: btn('.toggleFiltersBtn').left - hdr.left, zone_right: maxX - hdr.left,
    list_viewport_px: ph.querySelector('.locationsList').getBoundingClientRect().height,
  };
});
console.log(JSON.stringify(m, null, 1));
// real-time flip, sampled per rAF
await p2.goto(url('live')); await p2.evaluate(() => document.fonts.ready);
console.log('live flip', JSON.stringify(await p2.evaluate(() => window.flipLive())));
// byline legibility crops
const p4 = await page(4); await shoot(p4, 'pick', 'pick-A-header-4x.png', '.dirA .locationsHeader');
const p1 = await page(1); await shoot(p1, 'pick', 'pick-A-header-1x.png', '.dirA .locationsHeader');
await browser.close();
