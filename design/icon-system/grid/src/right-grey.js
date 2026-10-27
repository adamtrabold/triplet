// GREY SHARE: the real SVGs rendered at the size they ship, on the iPhone (3x) and the 5K (2x), black on white, the glyph alone
// (no ring). grey share = device pixels with ink between 2% and 98% / device pixels with ink over 2%.
//   node src/right-grey.js <raw.json>, then python3 -I src/right-grey.py <raw.json>  -> the table, svg/right/grey.json
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.join(__dirname, '..');
const NOW = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'right', 'build.json'), 'utf8'));
const V280 = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'build.json'), 'utf8'));
const V277 = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'back', 'v277.json'), 'utf8'));
const BADGE = ['cafe', 'bar', 'museum', 'nature', 'restaurant'];
const cell = (box, vb, d) => `<svg width="${box}" height="${box}" viewBox="${vb}" style="display:block"><path fill="#000" fill-rule="evenodd" d="${d}"/></svg>`;
// what is measured: [label, set, box px, list of [name, viewBox, d]]
const old = (B, s, box) => BADGE.map(n => [n, '0 0 24 24', B[n].sizes[s].d]);
const CASES = [
  ['18 badge', 'v280', 18, old(V280, 18)], ['18 badge', 'now', 18, BADGE.map(n => [n, '0 0 18 18', NOW[n].sizes[18].d])],
  ['24 selected', 'v280', 24, old(V280, 24)], ['24 selected', 'now', 24, BADGE.map(n => [n, '0 0 24 24', NOW[n].sizes[24].d])],
  ['12 chip', 'v280', 12, old(V280, 12)], ['12 chip', 'now', 12, BADGE.map(n => [n, '0 0 12 12', NOW[n].sizes[12].d])],
  ['star 18', 'v280', 18, [['star', '3 3 18 18', V280.star.sizes[24].d]]], ['star 18', 'now', 18, [['star', '0 0 18 18', NOW.star.sizes[18].d]]],
  ['+ button', 'v280', 24, [['plus', '0 0 24 24', V280.plus.sizes[24].d]]], ['+ button', 'now', 60, [['plus', '0 0 60 60', NOW.plus.sizes[60].d]]],
  ['24 (v280 board)', 'v277', 24, old(V277, 24)], ['24 (v280 board)', 'v280', 24, old(V280, 24)],
];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' }), res = [];
  for (const dpr of [3, 2]) {
    const p = await b.newPage({ viewport: { width: 200, height: 200 }, deviceScaleFactor: dpr });
    for (const [lab, set, box, items] of CASES) {
      for (const [n, vb, d] of items) {
        await p.setContent(`<body style="margin:0;background:#fff"><div id="c" style="width:${box}px;height:${box}px">${cell(box, vb, d)}</div></body>`);
        const buf = await (await p.$('#c')).screenshot();
        res.push({ dpr, lab, set, n, buf: buf.toString('base64') });
      }
    }
    await p.close();
  }
  await b.close();
  fs.writeFileSync(process.argv[2], JSON.stringify(res));
  console.log('rendered', res.length);
})().catch(e => { console.error(e); process.exit(1); });
