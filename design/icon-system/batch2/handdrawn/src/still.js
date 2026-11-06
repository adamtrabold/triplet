// still.js <out.png> <title> <key[:label]>... — a small still of chosen drawings from icons.js:
// at 18 in the ring at true size (3x screenshot), then 6x. Keys may be variants ('attraction@rimPlus').
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const HERE = __dirname;
const PAPER = process.env.PAPER || '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/pj/node_modules/paper/dist/paper-core.js';
const INK = { landmark: '#4889A8', attraction: '#547326', venue: '#AF4B82', hotel: '#2E2433', shopping: '#8A7AA8', park: '#3F925B', neighbourhood: '#328177', street: '#5E2C17' };
const [out, title, ...keys] = process.argv.slice(2);
const badge = (d, k, sc) => { const I = INK[k], rw = 4 / 3; return `<svg width="${24 * sc}" height="${24 * sc}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="${12 - rw / 2}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}"/><path fill="${I}" fill-rule="evenodd" d="${d}"/></svg>`; };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  const pg = await b.newPage(); await pg.setContent('<html></html>');
  await pg.addScriptTag({ path: PAPER }); await pg.addScriptTag({ path: path.join(HERE, 'lib.js') }); await pg.addScriptTag({ path: path.join(HERE, 'icons.js') });
  const D = await pg.evaluate(() => window.ICONS);
  const items = keys.map(s => { const [k, l] = s.split(':'); return { k, l: l || k, base: k.split('@')[0] }; });
  const h = `<!doctype html><meta charset="utf-8"><body style="margin:20px;background:#FAF5EA;font:16px -apple-system,Helvetica,Arial,sans-serif;color:#12293F;display:inline-block">
<div style="font-size:20px;font-weight:600;margin-bottom:12px">${title}</div>
<div style="display:flex;gap:40px">${items.map(i => `<div style="display:flex;flex-direction:column;align-items:center;gap:10px">
<div style="background:#E9E2D0;border-radius:8px;padding:10px 14px">${badge(D[i.k], i.base, 1)}</div>${badge(D[i.k], i.base, 6)}<span>${i.l}</span></div>`).join('')}</div></body>`;
  const p = await b.newPage({ deviceScaleFactor: 3 }); await p.setContent(h);
  await (await p.$('body')).screenshot({ path: path.resolve(out) }); await b.close();
})();
