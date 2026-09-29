// Screenshots concept.html at 390px frames, 2x. Fonts served locally
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
  const ctx = await browser.newContext({ deviceScaleFactor: scale, viewport: { width: 1800, height: 1400 } });
  const p = await ctx.newPage();
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css',
    body: fs.readFileSync(path.join(FONT_DIR, 'archivo.css'), 'utf8').replace(/https:\/\/fonts\.gstatic\.com\/[^)]*\//g, 'https://fonts.gstatic.com/') }));
  await p.route('https://fonts.gstatic.com/**', r => r.fulfill({ contentType: 'font/woff2',
    body: fs.readFileSync(path.join(FONT_DIR, path.basename(new URL(r.request().url()).pathname))) }));
  return p;
}
const url = v => 'file://' + path.join(here, 'concept.html') + '?view=' + v;
const p = await page(2);
for (const v of ['A', 'B', 'C', 'D', 'film', 'pick', 'Cwide']) {
  await p.goto(url(v)); await p.evaluate(() => document.fonts.ready);
  const out = { film: 'filmstrip.png', pick: 'pick-A-byline.png', Cwide: 'C-tag-long-city.png' }[v] || `${v}.png`;
  await p.locator('.board').screenshot({ path: path.join(here, out) });
  console.log('wrote', out);
}
// measurements
await p.goto(url('film')); await p.evaluate(() => document.fonts.ready);
const m = await p.evaluate(() => {
  const r = e => { const b = e.getBoundingClientRect(); return [Math.round(b.width * 100) / 100, Math.round(b.height * 100) / 100]; };
  const out = {};
  const A = document.querySelector('.dirA .byline');
  out.A_hit = r(A); const aft = getComputedStyle(A, '::after');
  out.A_hit_after = [aft.width, aft.height];
  out.A_header = r(document.querySelector('.dirA .locationsHeader'));
  out.A_h2 = r(document.querySelector('.dirA h2'));
  out.B_tab = [...document.querySelectorAll('.dirB .tab')].map(t => [r(t), getComputedStyle(t, '::after').height]);
  const tag = document.querySelector('.dirC .tag'); out.C_tag = r(tag); out.C_tag_after = [getComputedStyle(tag, '::after').width, getComputedStyle(tag, '::after').height];
  out.C_h2 = r(document.querySelector('.dirC h2'));
  out.D_rubric = r(document.querySelector('.dirD .rubric'));
  out.list_viewport = r(document.querySelector('.dirA .locationsList'));
  // natural width of worst-case h2 texts in the h2 voice
  const probe = document.createElement('h2'); const h = document.querySelector('.dirA h2');
  probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;'; h.parentNode.appendChild(probe);
  probe.style.flex = 'none';
  out.h2_natural = {};
  for (const t of ['Reykjavík list (8)', 'Copenhagen list (38)', 'All cities list (120)', 'Stockholm list (38)']) { probe.textContent = t; out.h2_natural[t] = probe.getBoundingClientRect().width; }
  probe.remove();
  return out;
});
console.log(JSON.stringify(m, null, 1));
// 4x crop of the pick's header, for byline/fist legibility
const p4 = await page(4);
await p4.goto(url('pick')); await p4.evaluate(() => document.fonts.ready);
await p4.locator('.dirA .locationsHeader').first().screenshot({ path: path.join(here, 'pick-A-header-4x.png') });
const p1 = await page(1);
await p1.goto(url('pick')); await p1.evaluate(() => document.fonts.ready);
await p1.locator('.dirA .locationsHeader').first().screenshot({ path: path.join(here, 'pick-A-header-1x.png') });
await browser.close();
