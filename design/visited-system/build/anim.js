// The place animation, frame by frame from the REAL DOM (owner: "I don't think I see the whole place
// animation"): headless Chromium at 3x, the page's one timeline clock (sgNow) and requestAnimationFrame
// replaced by a stepped clock, every Web Animation / CSS transition paused and advanced with it -- so each
// frame is the app's own code at an exact time, not a screen recording. Writes to stills/:
//   animation-pin.gif (+ .png APNG)  a map pin turned visited through the app (toggleLocationFlag ->
//                                    syncMarkers -> placeStickerPin), 50 fps, looped with a pause
//   animation-pin-slow.gif           the same at 0.25x
//   animation-row.gif (+ .png APNG)  the row's visit swipe (real touch events): hover, press, settle
//   animation-row-slow.gif           the same at 0.25x
//   animation-four.gif               four pins (four corners, flap sizes) placed together
//   filmstrip.png                    one pin, 10 numbered frames from arrival (0ms) to rest (200ms)
//   node anim.js        (python3 + Pillow encode the GIFs)
const L = require('../../gesture-harness/lib');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { BASEMAP, paintBase } = require('./basemap');
const OUT = path.join(__dirname, 'stills'), TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'stk-anim-'));
const FRAME = 20;   // ms per GIF frame (browsers clamp shorter delays)
const clock = page => page.evaluate(() => {
  window.__t = performance.now(); window.__raf = [];
  sgNow = () => window.__t;
  window.requestAnimationFrame = cb => { window.__raf.push(cb); return window.__raf.length; };
  window.__step = ms => {
    window.__t += ms; const q = window.__raf; window.__raf = []; q.forEach(cb => cb(window.__t));
    document.getAnimations().forEach(a => { if (a.__ct == null) { a.pause(); a.__ct = 0; } a.__ct += ms; a.currentTime = a.__ct; });
  };
});
const step = (page, ms) => page.evaluate(ms => window.__step(ms), ms);
// frames: [{ png, ms }] -> gif (and apng)
function encode(name, frames, { apng = false } = {}) {
  const dir = path.join(TMP, name); fs.mkdirSync(dir, { recursive: true });
  frames.forEach((f, i) => fs.writeFileSync(path.join(dir, `${String(i).padStart(4, '0')}.png`), f.png));
  fs.writeFileSync(path.join(dir, 'ms.json'), JSON.stringify(frames.map(f => f.ms)));
  execFileSync('python3', ['-c', `
import json, glob, os, sys
from PIL import Image
d = sys.argv[1]; ms = json.load(open(os.path.join(d, 'ms.json')))
ims = [Image.open(p).convert('RGB') for p in sorted(glob.glob(os.path.join(d, '*.png')))]
pal = ims[len(ims) // 2].quantize(colors=255, method=Image.Quantize.MEDIANCUT)   # one palette from a mid frame: no shimmer
q = [im.quantize(palette=pal, dither=Image.Dither.FLOYDSTEINBERG) for im in ims]
q[0].save(sys.argv[2], save_all=True, append_images=q[1:], duration=ms, loop=0, optimize=False, disposal=1)
if sys.argv[3] == '1': ims[0].save(sys.argv[2][:-4] + '.png', save_all=True, append_images=ims[1:], duration=ms, loop=0)
`, dir, path.join(OUT, name + '.gif'), apng ? '1' : '0']);
  const kb = f => (fs.statSync(f).size / 1024).toFixed(0) + 'KB';
  console.log(name, frames.length, 'frames', kb(path.join(OUT, name + '.gif')), apng ? kb(path.join(OUT, name + '.png')) : '');
}

// (a) a map pin, through the app's own visited toggle; slow = 0.25x. Returns the per-frame PNGs too.
async function pinScene(b, slow) {
  const { ctx, page } = await L.openProto(b, { dsf: 3 });
  await page.evaluate(() => document.getElementById('locations').classList.add('collapsed')); await L.W(200);
  const id = await page.evaluate(() => {
    // a to-do place whose sticker peels at the default lower left, mid flap size, at z16 in Reykjavik
    const c = locations.filter(l => !l.visited && l.city === 'reykjavik' && !l.starred && Math.abs(stickerCorner(l.id, l.starred) - 45) < 8);
    const l = c.sort((a, z) => Math.abs(stickerSize(a.id) - 0.5) - Math.abs(stickerSize(z.id) - 0.5))[0];
    map.setView([l.lat, l.lng], 16, { animate: false }); return l.id;
  });
  await L.W(700); await paintBase(page, false); await L.W(200);
  const c = await page.evaluate(id => { const p = map.latLngToContainerPoint(markersById.get(id).marker.getLatLng()); return [p.x, p.y]; }, id);
  const clip = { x: Math.round(c[0] - 40), y: Math.round(c[1] - 30), width: 80, height: 60 };
  await clock(page);
  const shots = [], dt = slow ? FRAME / 4 : FRAME, n = Math.ceil(260 / dt);
  shots.push({ png: await page.screenshot({ clip }), ms: 900 });                        // the to-do pin, a pause
  await page.evaluate(id => { toggleLocationFlag(id, 'visited'); }, id);               // the app's own path
  for (let i = 0; i < 6 && !(await page.evaluate(id => !!document.querySelector('.stk-pin'), id)); i++) await L.W(50);
  for (let i = 0; i <= n; i++) { shots.push({ png: await page.screenshot({ clip }), ms: FRAME }); await step(page, dt); }
  shots[shots.length - 1].ms = 1400;                                                    // at rest, a pause
  await ctx.close(); return shots;
}
// (c) the row: a real visit swipe (touch events), finger held through the press, then lifted.
async function rowScene(b, slow) {
  const { ctx, page, cdp } = await L.openProto(b, { dsf: 3 });
  await L.rowRect(page, 0); await L.W(150);
  const g = await page.evaluate(() => { const el = document.querySelectorAll('#locationsList .location-card[data-id]')[0]; const r = el.getBoundingClientRect(), x = el.querySelector('.delete-btn').getBoundingClientRect(); return { y: r.y + r.height / 2, xc: x.x + x.width / 2, top: Math.floor(r.y), h: Math.ceil(r.height) }; });
  const clip = { x: 150, y: g.top - 6, width: 240, height: g.h + 12 };
  await clock(page);
  const shots = [], dt = slow ? FRAME / 4 : FRAME, k = slow ? 4 : 1;
  shots.push({ png: await page.screenshot({ clip }), ms: 700 });
  await L.T(cdp, 'touchStart', g.xc, g.y); await step(page, dt);
  // the finger travels 70px over ~280ms (4 px per 16ms, the harness's pace), then holds
  const travel = 70, frames = Math.round(280 / dt);
  for (let i = 1; i <= frames; i++) { await L.T(cdp, 'touchMove', g.xc - travel * i / frames, g.y); await step(page, dt); shots.push({ png: await page.screenshot({ clip }), ms: FRAME }); }
  for (let i = 0; i < 16 * k; i++) { await step(page, dt); shots.push({ png: await page.screenshot({ clip }), ms: FRAME }); }
  await L.T(cdp, 'touchEnd', 0, 0);
  for (let i = 0; i < 20 * k; i++) { await step(page, dt); await L.W(4); shots.push({ png: await page.screenshot({ clip }), ms: FRAME }); }
  shots[shots.length - 1].ms = 1400;
  await ctx.close(); return shots;
}
// (d) four pins on the stand-in map, four corners and flap sizes, placed together (markerIcon + placeStickerPin).
async function fourScene(b) {
  const { ctx, page } = await L.openProto(b, { dsf: 3, w: 600, h: 400 });
  await page.evaluate(([bg]) => {
    const host = document.createElement('div'); host.id = '__four';
    host.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;width:220px;height:70px;overflow:hidden;isolation:isolate';
    const base = document.createElement('div'); base.style.cssText = 'position:absolute;left:-60px;top:-140px;z-index:-1;filter:' + getComputedStyle(document.querySelector('.leaflet-tile-pane')).filter; base.innerHTML = bg; host.appendChild(base);
    const want = [135, -135, 45, -45], ids = []; const sizes = [0.1, 0.9, 0.5, 0.3];
    for (const [k, a] of want.entries()) { let best = null; for (let i = 0; i < 6000; i++) { const id = 'four-' + i; if (Math.abs(((stickerCorner(id, false) - a + 540) % 360) - 180) > 8) continue; if (!best || Math.abs(stickerSize(id) - sizes[k]) < Math.abs(stickerSize(best) - sizes[k])) best = id; } ids.push(best); }
    window.__fourIds = ids;
    ids.forEach((id, i) => { const d = document.createElement('div'); d.className = '__pin'; d.style.cssText = `position:absolute;left:${22 + i * 48}px;top:23px`; d.dataset.id = id;
      d.innerHTML = markerIcon({ id, category: 'restaurant', name: 'x', lat: 0, lng: 0, visited: false }, false).options.html; host.appendChild(d); });
    document.body.appendChild(host);
  }, [BASEMAP(600, 400, false)]);
  await L.W(200); await clock(page);
  const clip = await page.evaluate(() => { const r = document.getElementById('__four').getBoundingClientRect(); return { x: 0, y: 0, width: Math.ceil(r.width), height: Math.ceil(r.height) }; });
  const shots = [{ png: await page.screenshot({ clip }), ms: 900 }];
  await page.evaluate(() => document.querySelectorAll('#__four .__pin').forEach(d => { d.innerHTML = markerIcon({ id: d.dataset.id, category: 'restaurant', name: 'x', lat: 0, lng: 0, visited: true }, false).options.html; placeStickerPin(d); }));
  for (let i = 0; i <= 13; i++) { shots.push({ png: await page.screenshot({ clip }), ms: FRAME }); await step(page, FRAME); }
  shots[shots.length - 1].ms = 1400;
  await ctx.close(); return shots;
}
(async () => {
  const b = await L.launch();
  const pin = await pinScene(b, false); encode('animation-pin', pin, { apng: true });
  // filmstrip: the press, 10 frames 20ms apart (frame 0 = the pin as it arrives), numbered
  const fdir = path.join(TMP, 'film'); fs.mkdirSync(fdir, { recursive: true });
  const FT = [0, 20, 40, 60, 80, 100, 120, 140, 160, 200];   // ms after the press began (pin[1] is 0ms)
  FT.forEach((t, i) => fs.writeFileSync(path.join(fdir, `${i}.png`), pin[1 + t / FRAME].png));
  execFileSync('python3', ['-c', `
import sys, os
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1]; ims = [Image.open(os.path.join(d, f'{i}.png')).convert('RGB') for i in range(10)]
w, h = ims[0].size; pad = 36; S = Image.new('RGB', (w * 5 + 6 * 4, (h + pad) * 2 + 6), '#FFFFFF'); dr = ImageDraw.Draw(S)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except Exception: font = ImageFont.load_default()
for i, im in enumerate(ims):
    x = (i % 5) * (w + 6); y = (i // 5) * (h + pad + 6); S.paste(im, (x, y + pad)); dr.text((x + 6, y + 6), f'{i}  ({[0,20,40,60,80,100,120,140,160,200][i]} ms)', fill='#333333', font=font)
S.save(sys.argv[2])
`, fdir, path.join(OUT, 'filmstrip.png')]);
  encode('animation-pin-slow', await pinScene(b, true));
  encode('animation-row', await rowScene(b, false), { apng: true });
  encode('animation-row-slow', await rowScene(b, true));
  encode('animation-four', await fourScene(b));
  await b.close(); fs.rmSync(TMP, { recursive: true, force: true });
  console.log('animations ->', OUT);
})();
