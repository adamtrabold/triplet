// One light (owner: "Light source should have consistent placement regardless of flap"): renders the
// real row stickers and map stickers for many place ids (every lean x every corner x sizes), and MEASURES on
// screen (getScreenCTM, so the row's CSS rotation counts) the direction each flap's cast shadow is displaced
// at its tip. Every one must point the same way: atan2(0.8, 0.6) = 53.13 deg, down-right. Also writes a
// grid still: stills/light-grid-4x.png.
//   node light.js
const L = require('../../gesture-harness/lib');
const path = require('path');
(async () => {
  const b = await L.launch(); const { ctx, page } = await L.openProto(b, { dsf: 4, w: 760, h: 700 });
  const res = await page.evaluate(() => {
    const host = document.createElement('div'); host.id = '__light';
    host.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#F2EFE9;padding:10px;display:grid;grid-template-columns:repeat(6,112px);gap:10px 6px;width:max-content';
    document.body.appendChild(host);
    const seen = new Set(), ids = [];
    for (let i = 0; i < 4000 && ids.length < 24; i++) { const id = 'p' + i, k = stickerTilt(id) + '|' + rowStickerAng(id); if (!seen.has(k)) { seen.add(k); ids.push(id); } }   // every lean x end
    const pinIds = []; const ps = new Set();
    for (let i = 0; i < 4000 && pinIds.length < 8; i++) { const id = 'q' + i, a = stickerCorner(id, false); if (!ps.has(a)) { ps.add(a); pinIds.push(id); } }
    ids.forEach(id => { const c = document.createElement('div'); c.style.cssText = 'height:34px;display:flex;align-items:center;justify-content:center'; c.innerHTML = rowStickerHtml(id); host.appendChild(c); });
    pinIds.forEach(id => [true, false].forEach(near => { const c = document.createElement('div'); c.style.cssText = 'height:34px;display:flex;align-items:center;justify-content:center';
      const p = stickerPinParts({ size: near ? 24 : 16, near, ang: stickerCorner(id, false), sz: stickerSize(id) });
      c.innerHTML = `<div style="position:relative;line-height:0">${p.base}${p.flap}</div>`; host.appendChild(c); }));
    const out = [];
    host.querySelectorAll('.stk-flap-svg').forEach(svg => {
      const flap = svg.querySelector('.stk-flap'), cast = svg.querySelector('.stk-cast-2');
      const pts = d => d.slice(1, -1).split('L').map(p => p.trim().split(' ').map(Number));
      const fp = pts(flap.getAttribute('d')), cp = pts(cast.getAttribute('d'));
      let best = 0, k = 0; fp.forEach((p, i) => { const dd = Math.hypot(cp[i][0] - p[0], cp[i][1] - p[1]); if (dd > best) { best = dd; k = i; } });
      const M = cast.getScreenCTM(), P = (x, y) => { const q = new DOMPoint(x, y).matrixTransform(M); return [q.x, q.y]; };
      const a = P(...fp[k]), z = P(...cp[k]);
      const st = svg.closest('.row-stamp');
      out.push({ kind: st ? 'row' : 'pin', tilt: st ? +st.dataset.tilt : 0, ang: st ? +st.dataset.ang : null, deg: +(Math.atan2(z[1] - a[1], z[0] - a[0]) * 180 / Math.PI).toFixed(2) });
    });
    return out;
  });
  await page.locator('#__light').screenshot({ path: path.join(__dirname, 'stills', 'light-grid-4x.png') });
  const degs = res.map(r => r.deg), lo = Math.min(...degs), hi = Math.max(...degs);
  console.log(JSON.stringify(res.map(r => `${r.kind} tilt ${r.tilt} ang ${r.ang}: ${r.deg}`)));
  console.log(`light: ${res.length} stickers, shadow direction ${lo}..${hi} deg (target 53.13) -> ${hi - lo < 0.5 && Math.abs(lo - 53.13) < 0.5 ? 'PASS' : 'FAIL'}`);
  await b.close(); process.exitCode = hi - lo < 0.5 ? 0 : 1;
})();
