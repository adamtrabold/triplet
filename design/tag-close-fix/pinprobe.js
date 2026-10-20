// The pin is the close: functional probe. Prints PASS/FAIL per case and "pinprobe p/n".
//   node design/tag-close-fix/pinprobe.js [index.html]
// A pin tap closes its tag (plain, plan stop); a district's dot tap closes its tag, its target 44px;
// a tap 20px from the pin's centre (inside the 44 target, outside the 32 pin) closes; the tag's Close
// button is visually hidden but takes keyboard focus (then shows, 44x44) and closes; Esc closes.
const path = require('path');
const P = require('../add-tag-jam/p2/lib-p2.js');
const S = require('../add-tag-jam/p3/lib-p3.js');
const W = P.W;
(async () => {
  const file = path.resolve(process.argv[2] || path.join(__dirname, '../../index.html'));
  const b = await P.lib.launch();
  const o = await P.openP2(b, { file, storage: { 'gh.plans': '1', 'triplet.reorderHint': '1' } });
  const page = o.page;
  let pass = 0, n = 0;
  const ok = (name, c, d) => { n++; if (c) pass++; console.log(`${c ? 'PASS' : 'FAIL'} ${name}${c ? '' : ' ' + JSON.stringify(d)}`); };
  await S.install(page); await S.realRows(page);
  const tapAt = async (x, y) => { await page.touchscreen.tap(x, y); await W(700); };
  const pinC = k => page.evaluate(k => { const r = markersById.get(k).marker.getElement().getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, k);
  // A. pin tap
  await S.openTag(page, 'rey16');
  let c = await pinC('rey16'); await tapAt(c[0], c[1]);
  ok('A1 a tap on the open tag\'s pin closes it', await page.evaluate(() => !tagOpenNow()));
  await S.openTag(page, 'rey16');
  c = await pinC('rey16'); await tapAt(c[0] + 20, c[1]);
  ok('A2 a tap 20px right of the pin\'s centre (the 44 target, outside the 32 pin) closes it', await page.evaluate(() => !tagOpenNow()));
  // B. district dot
  const sid = await page.evaluate(() => { const nb = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district'); return nb && 'shape:' + nb.id; });
  await S.openTag(page, sid);
  const dot = await page.evaluate(() => { const d = document.querySelector('#map .tag-dot'); if (!d) return null; const r = d.getBoundingClientRect(), a = getComputedStyle(d, '::after'); return { w: r.width, h: r.height, x: r.left + r.width / 2, y: r.top + r.height / 2, disc: a.width }; });
  ok('B1 a district\'s dot is the 28px close disc with a 44px target', dot && dot.w === 44 && dot.h === 44 && dot.disc === '28px', dot);
  await tapAt(dot.x + 18, dot.y);
  ok('B2 a tap on the dot (18px off centre) closes the district\'s tag', await page.evaluate(() => !tagOpenNow()));
  // C. keyboard
  await S.openTag(page, 'rey16');
  await page.evaluate(() => document.querySelector('.leaflet-popup .tag').focus());
  await page.keyboard.press('Tab'); await W(150);
  const k = await page.evaluate(() => { const x = document.querySelector('.leaflet-popup .tag-x'), r = x.getBoundingClientRect(); return { focused: document.activeElement === x, w: r.width, h: r.height }; });
  ok('C1 Tab from the tag lands on Close, which shows at 44x44', k.focused && k.w === 44 && k.h === 44, k);
  await page.keyboard.press('Enter'); await W(500);
  ok('C2 Enter on Close closes the tag', await page.evaluate(() => !tagOpenNow()));
  await S.openTag(page, 'rey16');
  await page.keyboard.press('Escape'); await W(500);
  ok('C3 Esc closes the tag', await page.evaluate(() => !tagOpenNow()));
  ok('D1 closed: no pin shows the close disc', await page.evaluate(() => !document.getElementById('map').classList.contains('tag-is-open') && ![...document.querySelectorAll('#map .highlighted-marker')].some(m => getComputedStyle(m, '::after').content !== 'none' && getComputedStyle(m, '::after').width === '28px')));
  ok('D2 no page errors', !o.errors.length, o.errors);
  console.log(`pinprobe ${pass}/${n}`);
  await b.close();
})();
