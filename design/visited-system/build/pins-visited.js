// A 3x still of VISITED pins across every category: cream sticker, neutral ink, no category colour (owner: "on the
// map should match the visited sticker in the row"). Rows (near): unvisited twin, visited, visited+starred, selected,
// plan stop, shape sticker; then far zoom unvisited / visited.
//   node pins-visited.js -> stills/pins-visited-all-categories-3x.png
const L = require('../../gesture-harness/lib'); const path = require('path'), fs = require('fs');
const { BASEMAP } = require('./basemap');
(async () => {
  const b = await L.launch(); const { page } = await L.openProto(b, { dsf: 3, w: 700, h: 420 });
  const cats = await page.evaluate(() => Object.keys(CATEGORY_COLORS).filter(c => c !== 'district' && c !== 'street'));
  const W = cats.length * 38 + 20;
  const build = (bg, rowsSrc, h) => page.evaluate(([bg, cats, rowsSrc, h, W]) => {
    const old = document.getElementById('__all'); if (old) old.remove();
    const host = document.createElement('div'); host.id = '__all';
    host.style.cssText = `position:fixed;left:0;top:0;z-index:99999;width:${W}px;height:${h}px;overflow:hidden;isolation:isolate`;
    const base = document.createElement('div'); base.style.cssText = 'position:absolute;left:-60px;top:-140px;z-index:-1;filter:' + getComputedStyle(document.querySelector('.leaflet-tile-pane')).filter; base.innerHTML = bg; host.appendChild(base);
    const rows = rowsSrc.map(s => new Function('c', 'return ' + s));
    rows.forEach((fn, ri) => cats.forEach((c, ci) => { const d = document.createElement('div'); d.style.cssText = `position:absolute;left:${30 + ci * 38}px;top:${28 + ri * 44}px;transform:translate(-50%,-50%)`; d.innerHTML = fn(c); host.appendChild(d); }));
    document.body.appendChild(host);
  }, [bg, cats, rowsSrc, h, W]);
  const pin = (v, hi, st) => `markerIcon({ id: 'a-' + c, category: c, name: 'x', lat: 0, lng: 0, visited: ${v}, starred: ${!!st} }, ${hi}).options.html`;
  await page.evaluate(() => map.setView(map.getCenter(), 16, { animate: false })); await L.W(300);
  await build(BASEMAP(900, 420, false), [pin(false, false), pin(true, false), pin(true, false, true), pin(true, true),
    "planNumberIcon(c, 'circle', categoryInk(c), { n: 3, loc: { id: 'a-' + c } }, MARKER_SIZE_NEAR, false, false, true).options.html",
    "shapeVisitIcon({ id: 'a-' + c, color: '#c33', type: 'district', starred: false }).options.html"], 280);
  await L.W(200);
  const png1 = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: 280 } });
  await page.evaluate(() => map.setView(map.getCenter(), 10, { animate: false })); await L.W(300);
  await build(BASEMAP(900, 420, false), [pin(false, false), pin(true, false), pin(true, true)], 140);
  await L.W(200);
  const png2 = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: 140 } });
  const T = path.join(require('os').tmpdir(), 'pv'); fs.mkdirSync(T, { recursive: true });
  fs.writeFileSync(T + '/a.png', png1); fs.writeFileSync(T + '/b.png', png2);
  require('child_process').execFileSync('python3', ['-c', `
import sys
from PIL import Image
a=Image.open(sys.argv[1]).convert('RGB'); b=Image.open(sys.argv[2]).convert('RGB')
S=Image.new('RGB',(a.width,a.height+b.height+12),'#FFFFFF'); S.paste(a,(0,0)); S.paste(b,(0,a.height+12)); S.save(sys.argv[3])`, T + '/a.png', T + '/b.png', path.join(__dirname, 'stills/pins-visited-all-categories-3x.png')]);
  console.log(cats.length, 'categories'); await b.close();
})();
