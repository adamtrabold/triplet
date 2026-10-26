// Real Chromium crops of the six, before and after the pixel fit, at 24px in the badge, at 2x and 3x (deviceScaleFactor), one
// PNG per crop at its device-pixel size (48 or 72 px square), plus a fuzz measure read from those pixels.
//   NODE_PATH=<global node_modules with playwright> node src/pixel-fit-crops.js
//   -> stills/pixelfit/raw/<id>-<before|after>-<dpr>x.png, stills/pixelfit/fuzz.json
// Fuzz: of the pixels the glyph touches (any ink at all, the ring excluded), the share that are neither ink nor paper
// (between 10% and 90% ink): a crisp edge has none; an edge half a pixel off has a full row of them.
'use strict';
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const pf = require('./pixel-fit.js');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'stills', 'pixelfit', 'raw');
fs.mkdirSync(OUT, { recursive: true });
const now = fs.readFileSync(path.join(ROOT, 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8');
const SIX = {};
for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!SIX[m[1]]) SIX[m[1]] = m[2];
const ID = { 'Café': 'cafe', Bar: 'bar', Museum: 'museum', Nature: 'nature', Star: 'star', Add: 'plus' };
const NAVY = '#12293F', PAPER = '#F2EBDD';
// the badge ring (the master grid: ring 1 1/2px, outer edge on the badge's edge); after the fit its width is the fitted line
const ring = (dpr, fitted, tie = 'rank') => { const w = fitted ? pf.devW(1.5, dpr, tie) / dpr : 1.5; return `<circle cx="12" cy="12" r="${12 - w / 2}" fill="none" stroke="${NAVY}" stroke-width="${w}"/>`; };
const svg = (d, dpr, fitted, withRing, tie) => `<svg width="24" height="24" viewBox="0 0 24 24" style="display:block">${withRing ? ring(dpr, fitted, tie) : ''}<path fill="${NAVY}" fill-rule="evenodd" d="${d}"/></svg>`;

(async () => {
  const b = await chromium.launch(), fuzz = {};
  for (const dpr of [2, 3]) {
    const p = await b.newPage({ viewport: { width: 400, height: 200 }, deviceScaleFactor: dpr });
    for (const [name, id] of Object.entries(ID)) {
      for (const state of dpr === 3 ? ['before', 'after', 'after-down'] : ['before', 'after']) {   // after-down: the 3x line at 4 device px (1 1/3px), the alternative
        const tie = state === 'after-down' ? 'down' : 'rank', d = state === 'before' ? SIX[name] : pf.fit(SIX[name], { size: 24, dpr, tie }).d;
        for (const withRing of [true, false]) {
          await p.setContent(`<body style="margin:0;background:${PAPER}"><div id="t" style="width:24px;height:24px;position:absolute;left:8px;top:8px">${svg(d, dpr, state !== 'before', withRing, tie)}</div></body>`);
          const file = path.join(OUT, `${id}-${state}-${dpr}x${withRing ? '' : '-glyph'}.png`);
          await p.screenshot({ path: file, clip: { x: 8, y: 8, width: 24, height: 24 } });
          if (!withRing) {
            // coverage per pixel from the red channel: paper 0xF2 -> navy 0x12
            const px = await p.evaluate(async src => {
              const img = new Image(); img.src = src; await img.decode();
              const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
              return Array.from(g.getImageData(0, 0, c.width, c.height).data.filter((v, i) => i % 4 === 0));
            }, 'data:image/png;base64,' + fs.readFileSync(file).toString('base64'));
            const cov = px.map(r => Math.max(0, Math.min(1, (0xF2 - r) / (0xF2 - 0x12))));
            const touched = cov.filter(c => c > 0.02).length, grey = cov.filter(c => c > 0.1 && c < 0.9).length;
            (fuzz[id] = fuzz[id] || {})[`${state}-${dpr}x`] = { touched, grey, share: +(grey / touched).toFixed(3) };
          }
        }
      }
    }
    await p.close();
  }
  await b.close();
  fs.writeFileSync(path.join(ROOT, 'stills', 'pixelfit', 'fuzz.json'), JSON.stringify(fuzz, null, 1));
  for (const [id, f] of Object.entries(fuzz)) console.log(id, ['2x', '3x'].map(x => `${x} grey ${(f['before-' + x].share * 100).toFixed(0)}% -> ${(f['after-' + x].share * 100).toFixed(0)}%`).join('  '));
})();
