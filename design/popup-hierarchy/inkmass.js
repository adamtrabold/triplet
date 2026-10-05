// Visual-weight evidence: "ink mass" per popup element, measured on the 3x renders.
// mass = sum over the element's ink box of max(0, paperLum - pixelLum) / paperLum (1 = a fully black pixel),
// in 1x-pixel units (divided by 9). Also reports mean darkness and whether the element carries chroma.
//   node design/popup-hierarchy/inkmass.js   (after render.js)
const path = require('path'), fs = require('fs');
const { launch } = require('../gesture-harness/lib');
const DIR = path.join(__dirname, 'current');
const M = require('./current/metrics.json');
(async () => {
  const b = await launch(); const page = await (await b.newContext()).newPage(); const out = {};
  for (const key of Object.keys(M)) {
    const png = fs.readFileSync(path.join(DIR, `popup-${key}@3x.png`)).toString('base64');
    const m = M[key], ox = Math.min(10, m.wrapper.x), oy = Math.min(10, m.wrapper.y);
    const boxes = {};
    for (const [k, i] of Object.entries(m.ink)) if (i) boxes[k] = { x: (i.left + ox) * 3, y: (i.top + oy) * 3, w: (i.right - i.left) * 3, h: (i.bottom - i.top) * 3 };
    out[key] = await page.evaluate(async ([png, boxes]) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + png; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const lum = (r, gg, bb) => 0.2126 * r + 0.7152 * gg + 0.0722 * bb;
      const P = g.getImageData(60, 60, 1, 1).data; const paper = lum(P[0], P[1], P[2]);
      const res = {};
      for (const [k, bx] of Object.entries(boxes)) {
        const d = g.getImageData(Math.round(bx.x), Math.round(bx.y), Math.max(1, Math.round(bx.w)), Math.max(1, Math.round(bx.h))).data; let mass = 0, chroma = 0;
        for (let i = 0; i < d.length; i += 4) { const L = lum(d[i], d[i + 1], d[i + 2]); const v = Math.max(0, paper - L) / paper; mass += v; if (v > 0.15 && Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) > 60) chroma++; }
        res[k] = { mass: +(mass / 9).toFixed(0), area: +(bx.w * bx.h / 9).toFixed(0), chromaPx: Math.round(chroma / 9) };
      }
      return res;
    }, [png, boxes]);
  }
  fs.writeFileSync(path.join(DIR, 'inkmass.json'), JSON.stringify(out, null, 1));
  for (const [k, v] of Object.entries(out)) console.log(k, Object.entries(v).map(([e, x]) => `${e}:${x.mass}${x.chromaPx ? '(c' + x.chromaPx + ')' : ''}`).join(' '));
  await b.close();
})();
