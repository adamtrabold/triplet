// BUILD grey check (greycheck.js's rule against a FIXED paper, --paper-raised, so the reference pixel can't move the
// threshold), on the build's filmstrip frames and the round-7 mock for comparison. Prints per frame: ink px / grey px / share.
//   node design/popup-hierarchy/unvisit/greycheck-build.js dry3 build390 build320 build256
// Same rule as greycheck.js (ink = L at least .04 below paper; grey = C < .02), but the region is the
// Visited segment's interior only (x 68%..93%, y 15%..85%), so map pixels past the stub never count.
const path = require('path'), fs = require('fs');
const { launch } = require('../../gesture-harness/lib');
const D = path.join(__dirname, 'stills', 'r2') + '/';
(async () => {
  const b = await launch(), page = await (await b.newContext()).newPage();
  for (const k of process.argv.slice(2)) {
    const res = [];
    for (const f of fs.readdirSync(D + k).filter(f => /ms@3x\.png$/.test(f)).sort()) {
      const r = await page.evaluate(async b64 => {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const x0 = Math.round(img.width * .68), x1 = Math.round(img.width * .93), y0 = Math.round(img.height * .15), y1 = Math.round(img.height * .85);
        const d = x.getImageData(x0, y0, x1 - x0, y1 - y0).data;
        const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
        const ok = (R, G, B) => { const r = lin(R), g = lin(G), bb = lin(B);
          const l = Math.cbrt(.4122214708 * r + .5363355807 * g + .0514459929 * bb), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * bb), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * bb);
          const L = .2104542553 * l + .793617785 * m - .0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, Bb = .0259040371 * l + .7827717662 * m - .808675766 * s;
          return [L, Math.hypot(A, Bb)]; };
        const P = ok(250, 245, 234); let ink = 0, grey = 0;   /* --paper-raised, the tag stock */
        for (let i = 0; i < d.length; i += 4) { const [L, C] = ok(d[i], d[i + 1], d[i + 2]); if (L < P[0] - 0.04) { ink++; if (C < 0.02) grey++; } }
        return { ink, grey, share: ink ? +(grey / ink).toFixed(2) : 0 };
      }, fs.readFileSync(D + k + '/' + f).toString('base64'));
      res.push(f.replace('@3x.png', '') + ' ' + r.ink + '/' + r.grey + ' ' + r.share);
    }
    console.log(k + ': ' + res.join(' | '));
  }
  await b.close();
})();
