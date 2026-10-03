// 3x stills for the stamp return (owner, 2026-10-03: rows take the stamp back, keeping the check and VISITED; map pins are
// the DARK sticker with a CREAM check). Real markerIcon() / planNumberIcon() / shapeVisitIcon() / renderCard() output.
//   node stamp-return.js -> stills/stamp-return-{rows,pins,plan-stop,shape-row}-3x.png
const L = require('../../gesture-harness/lib'); const path = require('path'), fs = require('fs'), cp = require('child_process');
const { BASEMAP } = require('./basemap');
const OUT = path.join(__dirname, 'stills');
const join = (files, out) => cp.execFileSync('python3', ['-c', `
import sys
from PIL import Image
ims=[Image.open(p).convert('RGB') for p in sys.argv[2:]]
w=max(i.width for i in ims); h=sum(i.height for i in ims)+8*(len(ims)-1)
S=Image.new('RGB',(w,h),'#FFFFFF'); y=0
for i in ims: S.paste(i,(0,y)); y+=i.height+8
S.save(sys.argv[1])`, out, ...files]);
(async () => {
  const b = await L.launch(); const { page } = await L.openProto(b, { dsf: 3, w: 700, h: 560 });
  const T = fs.mkdtempSync(path.join(require('os').tmpdir(), 'sr-'));
  // ---- rows: visited rows (a pin row, a starred one, a long name) and a shape row, at the list's own width
  const rows = await page.evaluate(() => [...document.querySelectorAll('#locationsList .location-card.is-visited')].map(e => ({ id: e.dataset.id, meta: e.querySelector('.row-meta').textContent, name: e.querySelector('h3').textContent })));
  console.log(JSON.stringify(rows));
  const shot = async (idx, name) => { const el = (await page.$$('#locationsList .location-card.is-visited'))[idx]; await el.scrollIntoViewIfNeeded(); await L.W(120); const r = await el.boundingBox(); const f = path.join(T, name + '.png'); await page.screenshot({ path: f, clip: { x: r.x, y: r.y, width: r.width, height: r.height } }); return f; };
  const rowFiles = [];
  for (const [i] of rows.entries()) rowFiles.push(await shot(i, 'row-' + i));
  join(rowFiles, path.join(OUT, 'stamp-return-rows-3x.png'));
  const sh = rows.find(r => /district|street/i.test(r.meta));
  if (sh) fs.copyFileSync(rowFiles[rows.indexOf(sh)], path.join(OUT, 'stamp-return-shape-row-3x.png'));
  // ---- pins on the stand-in map: near / far / selected / approx / starred, every category
  const cats = await page.evaluate(() => Object.keys(CATEGORY_COLORS).filter(c => c !== 'district' && c !== 'street'));
  const W = cats.length * 38 + 20;
  const build = (rowsSrc, h) => page.evaluate(([bg, cats, rowsSrc, h, W]) => {
    const old = document.getElementById('__all'); if (old) old.remove();
    const host = document.createElement('div'); host.id = '__all';
    host.style.cssText = `position:fixed;left:0;top:0;z-index:99999;width:${W}px;height:${h}px;overflow:hidden;isolation:isolate`;
    const base = document.createElement('div'); base.style.cssText = 'position:absolute;left:-60px;top:-140px;z-index:-1;filter:' + getComputedStyle(document.querySelector('.leaflet-tile-pane')).filter; base.innerHTML = bg; host.appendChild(base);
    rowsSrc.map(s => new Function('c', 'return ' + s)).forEach((fn, ri) => cats.forEach((c, ci) => { const d = document.createElement('div'); d.style.cssText = `position:absolute;left:${30 + ci * 38}px;top:${28 + ri * 44}px;transform:translate(-50%,-50%)`; d.innerHTML = fn(c); host.appendChild(d); }));
    document.body.appendChild(host);
  }, [BASEMAP(900, 560, false), cats, rowsSrc, h, W]);
  const pin = (v, hi, st) => `markerIcon({ id: 'a-' + c, category: c, name: 'x', lat: 0, lng: 0, visited: ${v}, starred: ${!!st} }, ${hi}).options.html`;
  await page.evaluate(() => { document.getElementById('locations').classList.add('collapsed'); map.setView(map.getCenter(), 16, { animate: false }); }); await L.W(400);
  await build([pin(false, false), pin(true, false), pin(true, false, true), pin(true, true), pin(true, true, true)], 5 * 44 + 10); await L.W(200);
  const near = path.join(T, 'near.png'); await page.screenshot({ path: near, clip: { x: 0, y: 0, width: W, height: 5 * 44 + 10 } });
  await page.evaluate(() => map.setView(map.getCenter(), 10, { animate: false })); await L.W(400);
  await build([pin(false, false), pin(true, false), pin(true, true)], 3 * 44 + 10); await L.W(200);
  const far = path.join(T, 'far.png'); await page.screenshot({ path: far, clip: { x: 0, y: 0, width: W, height: 3 * 44 + 10 } });
  // approx pins (a district-category pin with the " (approx.)" label shares the pin look) + plan stops + shape stickers
  await page.evaluate(() => map.setView(map.getCenter(), 16, { animate: false })); await L.W(400);
  const stop = (kind, v, hi, st) => `planNumberIcon(c, '${kind}', categoryInk(c), { n: 3, loc: { id: 'a-' + c } }, MARKER_SIZE_NEAR + (${hi} ? MARKER_HI_DELTA : 0), ${hi}, ${st}, ${v}).options.html`;
  await build([`markerIcon({ id: 'a-' + c, category: 'district', name: 'X (approx.)', lat: 0, lng: 0, visited: true }, false).options.html`, stop('circle', false, false, false), stop('circle', true, false, false), stop('circle', true, true, false), stop('diamond', true, false, true),
    "shapeVisitIcon({ id: 'a-' + c, color: '#c33', type: 'district', starred: false }).options.html"], 6 * 44 + 10); await L.W(200);
  const mix = path.join(T, 'mix.png'); await page.screenshot({ path: mix, clip: { x: 0, y: 0, width: W, height: 6 * 44 + 10 } });
  join([near, far], path.join(OUT, 'stamp-return-pins-3x.png'));
  fs.copyFileSync(mix, path.join(OUT, 'stamp-return-plan-stop-3x.png'));
  await b.close();
})();
