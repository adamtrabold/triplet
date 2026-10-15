// Contact sheet at true 1x (and a 2x copy for reading). FONT_DIR as in concept-2.
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
  const p = await (await browser.newContext({ deviceScaleFactor: scale, viewport: { width: 1800, height: 1600 } })).newPage();
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ contentType: 'text/css', body: fs.readFileSync(path.join(FONT_DIR, 'archivo.css'), 'utf8') }));
  await p.route('https://fonts.gstatic.com/**', r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(path.join(FONT_DIR, path.basename(new URL(r.request().url()).pathname))) }));
  await p.goto('file://' + path.join(here, 'round3.html')); await p.evaluate(() => document.fonts.ready);
  return p;
}
for (const [s, out] of [[1, 'contact-sheet-1x.png'], [2, 'contact-sheet-2x.png']]) {
  const p = await page(s); await p.locator('.sheet').screenshot({ path: path.join(here, out) }); console.log('wrote', out);
  if (s !== 1) continue;
  console.log(JSON.stringify(await p.evaluate(() => {
    const R = e => e.getBoundingClientRect();
    const out = [];
    for (const strip of document.querySelectorAll('.strip')) {
      const hd = strip.querySelector('.locationsHeader'), h2 = hd.querySelector('h2'), hr = R(hd);
      const probe = h2.cloneNode(true); probe.style.cssText = 'position:absolute;visibility:hidden;flex:none;width:auto'; hd.appendChild(probe);
      const need = probe.getBoundingClientRect().width; probe.remove();
      const row = { h2: h2.textContent, header_h: hr.height, h2_avail: +R(h2).width.toFixed(1), h2_need: +need.toFixed(1), truncates: need > R(h2).width + 0.5 };
      const sb = hd.querySelector('.sortBtn');
      if (sb) {
        const a = getComputedStyle(sb, '::after'), b = R(sb), f = R(hd.querySelector('.toggleFiltersBtn')), c = R(hd.querySelector('.collapseBtn'));
        row.sort_hit = [b.width + 12, b.height + 24]; row.gap_to_filters_visual = f.left - b.right; row.sort_zone_right = b.right + 6; row.filters_zone_left = f.left - 6;
        row.gap_h2_to_sort = b.left - R(h2).right; row.sort_left_minus_collapse_right = b.left - c.right;
      }
      out.push(row);
    }
    return out;
  }), null, 0));
}
await browser.close();
