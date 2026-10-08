// "Never grey" for filter-drawn ink (round 7): the ink colour is no longer a CSS colour, so check the
// pixels. For each frame of a strip set, the Visited segment's pixels that are visibly ink (oklch L
// at least 0.04 below the paper's) are classed by chroma; a pixel is "grey" if C < 0.02 (the paper
// itself is ~0.02 at hue ~85, navy ink ~0.05 at 249). Reports, per frame, ink pixels and the grey share.
//   node design/popup-hierarchy/unvisit/greycheck.js dry3 dry2 dryB
const path = require('path'), fs = require('fs');
const { launch } = require('../../gesture-harness/lib');
(async () => {
  const keys = process.argv.slice(2), b = await launch(), page = await (await b.newContext()).newPage(), out = {};
  for (const k of keys) {
    const dir = path.join(__dirname, 'stills', 'r2', k);
    for (const f of fs.readdirSync(dir).filter(f => /ms@3x\.png$/.test(f)).sort()) {
      const b64 = fs.readFileSync(path.join(dir, f)).toString('base64');
      const r = await page.evaluate(async b64 => {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const x0 = Math.round(img.width * 0.68), w = img.width - x0 - 12, d = x.getImageData(x0, 30, w, img.height - 60).data;
        const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
        const ok = (R, G, B) => { const r = lin(R), g = lin(G), bb = lin(B);
          const l = Math.cbrt(.4122214708 * r + .5363355807 * g + .0514459929 * bb), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * bb), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * bb);
          const L = .2104542553 * l + .793617785 * m - .0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, Bb = .0259040371 * l + .7827717662 * m - .808675766 * s;
          return [L, Math.hypot(A, Bb)]; };
        const P = ok(d[0], d[1], d[2]); let ink = 0, grey = 0;
        for (let i = 0; i < d.length; i += 4) { const [L, C] = ok(d[i], d[i + 1], d[i + 2]); if (L < P[0] - 0.04) { ink++; if (C < 0.02) grey++; } }
        return { ink, grey, share: ink ? +(grey / ink).toFixed(3) : 0 };
      }, b64);
      (out[k] = out[k] || {})[f.replace('@3x.png', '')] = r;
    }
    console.log(k, JSON.stringify(out[k]));
  }
  fs.writeFileSync(path.join(__dirname, 'greycheck.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
