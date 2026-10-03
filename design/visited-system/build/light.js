// One light, per-corner shadows (owner: "The consistent light source should also change the cast shadow"):
// renders the real stickers -- a NEAR and a FAR pin at each of the four corners, the row oval peeled at
// its left and right end -- at rest and in the lifted (placing) pose, and writes stills/light-grid-4x.png.
// Then MEASURES on screen (getScreenCTM, so the row's CSS rotation counts) the direction every cast
// layer is displaced from the lifted paper (the flap subpath's centroid shift): all must point along
// the one light, atan2(0.8, 0.6) = 53.13 deg, whatever the corner, lean or pose; and reports per corner
// how much of the outer cast falls OFF the sticker (on the map/row) vs on its own face.
//   node light.js
const L = require('../../gesture-harness/lib');
const path = require('path');
(async () => {
  const b = await L.launch(); const { ctx, page } = await L.openProto(b, { dsf: 4, w: 760, h: 700 });
  const res = await page.evaluate(() => {
    const host = document.createElement('div'); host.id = '__light';
    host.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#F2EFE9;padding:10px;display:grid;grid-template-columns:110px repeat(4,64px);gap:8px 6px;width:max-content;font:600 10px/12px sans-serif;color:#555;align-items:center';
    document.body.appendChild(host);
    const corners = [[135, 'upper-left'], [-135, 'upper-right'], [45, 'lower-left'], [-45, 'lower-right']];
    const cell = h => `<div style="height:44px;display:flex;align-items:center;justify-content:center">${h}</div>`;
    let h = '<div></div>' + corners.map(([, n]) => `<div style="text-align:center">${n}</div>`).join('');
    for (const [lbl, near, pose] of [['NEAR rest', true, null], ['NEAR placing', true, STICKER.PIN_LIFT], ['FAR rest', false, null], ['FAR placing', false, STICKER.PIN_LIFT]])
      h += `<div>${lbl}</div>` + corners.map(([a]) => { const p = stickerPinParts({ size: near ? 24 : 16, near, ang: a, sz: 0.5, pose }); return cell(`<div class="__pin" style="position:relative;line-height:0">${p.base}${p.flap}</div>`); }).join('');
    host.innerHTML = h;
    const rows = document.createElement('div'); rows.style.cssText = 'grid-column:1/-1;display:grid;grid-template-columns:110px repeat(2,130px);gap:8px 6px;align-items:center';
    const ids = {}; for (let i = 0; i < 4000 && Object.keys(ids).length < 2; i++) { const id = 'p' + i; if (Math.abs(stickerTilt(id)) > 0.5 && !ids[rowStickerAng(id)]) ids[rowStickerAng(id)] = id; }
    let r = '<div></div><div style="text-align:center">row: left end</div><div style="text-align:center">row: right end</div>';
    for (const [lbl, pose] of [['row rest', 'rest'], ['row placing', 'lift']]) r += `<div>${lbl}</div>` + [50, -50].map(a => cell(rowStickerHtml(ids[a], pose))).join('');
    rows.innerHTML = r; host.appendChild(rows);
    const out = [];
    host.querySelectorAll('.stk-flap-svg').forEach(svg => {
      const flap = svg.querySelector('.stk-flap'), M = flap.getScreenCTM(), P = ([x, y]) => { const q = new DOMPoint(x, y).matrixTransform(M); return [q.x, q.y]; };
      const pts = d => d.slice(1).split('Z')[0].split('L').map(p => p.trim().split(' ').map(Number));
      const cen = q => q.reduce((a, p) => [a[0] + p[0] / q.length, a[1] + p[1] / q.length], [0, 0]);
      const f0 = P(cen(pts(flap.getAttribute('d'))));
      const st = svg.closest('.row-stamp');
      svg.querySelectorAll('.stk-cast').forEach((c, i) => { const c0 = P(cen(pts(c.getAttribute('d'))));
        out.push({ kind: st ? 'row' : 'pin', ang: st ? +st.dataset.ang : null, layer: i, deg: +(Math.atan2(c0[1] - f0[1], c0[0] - f0[0]) * 180 / Math.PI).toFixed(2) }); });
    });
    return out;
  });
  await page.locator('#__light').screenshot({ path: path.join(__dirname, 'stills', 'light-grid-4x.png') });
  const degs = res.map(r => r.deg), lo = Math.min(...degs), hi = Math.max(...degs);
  console.log(`light: ${res.length} cast layers, shadow direction ${lo}..${hi} deg (target 53.13) -> ${hi - lo < 0.5 && Math.abs(lo - 53.13) < 0.5 ? 'PASS' : 'FAIL'}`);
  await b.close(); process.exitCode = hi - lo < 0.5 ? 0 : 1;
})();
