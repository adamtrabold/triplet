// clipcheck + list-over-x hit tests + style fingerprint + 3x crop still.
// usage: node check.js <repo> <outdir> [onlyTag]
const path = require('path');
const LIB = path.resolve(process.argv[2], 'design/gesture-harness/lib.js');
const OUT = process.argv[3];
const ONLY = process.argv[4];
const { launch, openProto, W } = require(LIB);
const fake = Array.from({ length: 10 }, (_, i) => ({
  lat: String(64.14 + i * 0.001), lon: String(-21.94 + i * 0.001),
  display_name: `Kaffihús Number ${i + 1}, Laugavegur ${10 + i}, Miðborg, Reykjavík, Capital Region, 101, Iceland`,
  address: { road: 'Laugavegur', house_number: String(10 + i), city: 'Reykjavík', country: 'Iceland' },
}));
async function run(browser, { w, h, dsf, tag }) {
  const { page, ctx } = await openProto(browser, { w, h, dsf });
  await page.route('**nominatim.openstreetmap.org/**', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(fake) }));
  await page.click('#floatingAddBtn');
  await page.waitForFunction(() => document.getElementById('addForm').classList.contains('show'));
  await W(600);
  await page.click('#nameInput');
  await page.type('#nameInput', 'Kaffi', { delay: 40 });
  await page.waitForSelector('#addressAutocomplete .autocomplete-item', { timeout: 8000 });
  await W(400);
  const res = await page.evaluate(() => {
    const dd = document.getElementById('addressAutocomplete');
    const x = document.getElementById('floatingAddBtn');
    const r = el => { const b = el.getBoundingClientRect(); return { top: +b.top.toFixed(2), bottom: +b.bottom.toFixed(2), left: +b.left.toFixed(2), right: +b.right.toFixed(2) }; };
    const box = r(dd), xb = r(x);
    const name = el => !el ? null : dd.contains(el) ? 'list' : (el === x || x.contains(el)) ? 'x' : (el.id ? '#' + el.id : el.tagName.toLowerCase());
    const hit = (px, py) => ({ at: [Math.round(px), Math.round(py)], hit: name(document.elementFromPoint(px, py)) });
    const ov = { top: Math.max(box.top, xb.top), bottom: Math.min(box.bottom, xb.bottom), left: Math.max(box.left, xb.left), right: Math.min(box.right, xb.right) };
    const overlaps = ov.top < ov.bottom && ov.left < ov.right;
    const tests = {};
    if (overlaps) {
      tests.overlapCenter = hit((ov.left + ov.right) / 2, (ov.top + ov.bottom) / 2);
      tests.overlapCorner = hit(ov.left + 2, ov.bottom - 2);
    }
    const xc = { x: (xb.left + xb.right) / 2, y: (xb.top + xb.bottom) / 2 };
    tests.xCentre = hit(xc.x, xc.y);
    if (box.left > xb.left + 6) tests.xLeftOfList = hit(xb.left + (box.left - xb.left) / 2 + 2, xc.y);
    if (box.bottom < xb.bottom - 6) tests.xBelowList = hit(xc.x, box.bottom + (xb.bottom - box.bottom) / 2);
    const it = dd.querySelector('.autocomplete-item'); const cs = getComputedStyle(it); const ds = getComputedStyle(dd);
    const style = ['fontFamily','fontSize','lineHeight','color','letterSpacing','textTransform','fontWeight','textAlign','whiteSpace'].map(k => cs[k]).join(' | ') + ' || ' + ['backgroundColor','borderTop','borderLeft','borderBottom','borderRadius','maxHeight','width','boxSizing'].map(k => ds[k]).join(' | ');
    const bh = document.elementFromPoint(box.left + 20, box.bottom - 3);
    return { viewport: [innerWidth, innerHeight], dropdown: box, x: xb, overlaps, tests, items: dd.querySelectorAll('.autocomplete-item').length,
      scrollH: dd.scrollHeight, clientH: dd.clientHeight, acRoom: dd.style.getPropertyValue('--ac-room'), bottomHitInside: !!(bh && dd.contains(bh)), style };
  });
  await page.screenshot({ path: path.join(OUT, `ac-${tag}.png`) });
  if (dsf === 3) {
    const y0 = Math.max(0, Math.floor(res.dropdown.bottom - 200));
    await page.screenshot({ path: path.join(OUT, `ac-${tag}-crop.png`), clip: { x: 0, y: y0, width: w, height: Math.min(h, Math.ceil(res.x.bottom + 30)) - y0 } });
  }
  let tapRes = null;
  const t = res.tests.overlapCenter && res.tests.overlapCenter.at;
  if (t) { await page.mouse.click(t[0], t[1]); await W(250); tapRes = await page.evaluate(() => ({ name: document.getElementById('nameInput').value, listOpen: document.getElementById('addressAutocomplete').classList.contains('show'), formOpen: document.getElementById('addForm').classList.contains('show') })); }
  await ctx.close();
  return { tag, ...res, tapInOverlap: tapRes };
}
(async () => {
  const browser = await launch();
  const out = [];
  let vs = [{ w: 390, h: 844, dsf: 1, tag: '390x844' }, { w: 390, h: 664, dsf: 1, tag: '390x664-short' }, { w: 1280, h: 800, dsf: 1, tag: 'desktop-1280x800' }, { w: 320, h: 568, dsf: 1, tag: '320x568' }, { w: 390, h: 844, dsf: 3, tag: '390x844-3x' }];
  if (ONLY) vs = vs.filter(v => v.tag === ONLY);
  for (const v of vs) { try { out.push(await run(browser, v)); } catch (e) { out.push({ tag: v.tag, error: e.message }); } }
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
})();
