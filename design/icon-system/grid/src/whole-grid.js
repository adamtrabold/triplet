// WHOLE-PIXEL GRID OPTIONS (10-26; owner on the pixel-fit board: "no i want the base grid to make great icons without
// extrawork"). No per-size or per-screen pass: the grid itself must put every core edge on a whole device pixel at 2x
// (his 5K) and 3x (iPhone). A position is whole at both only if it is a whole CSS pixel (x*2 and x*3 both whole <=> x whole),
// so: every core edge on a whole px, every line and part a whole number of px, each glyph shown only at 1:1 (or a whole
// multiple) of the size it is drawn at.
//
// The options are previews: the approved six moved ONCE, at design time, onto a 1px grid (pixel-fit.js run at density 1,
// where it is a snap to whole px, not a per-screen pass), standing in for redraws on the new grid. Then rendered at 2x and
// 3x and measured.
//   A  24 badge, 2px line   (line : badge 1/12, a third heavier than the approved 1/16)
//   B  32 badge, 2px line   (1/16: the approved proportion; everything 4/3 bigger; posts = the line)
//   C  24 badge, 1px line   (1/24: a third lighter)
//   NODE_PATH=<playwright> node src/whole-grid.js  -> svg/wholegrid/<opt>-<icon>.svg, stills/wholegrid/raw/*.png, measure.json
'use strict';
const fs = require('fs'), path = require('path');
const pf = require('./pixel-fit.js'), fair = require('./fair-check.js'), join = require('./join-check.js');
const ROOT = path.join(__dirname, '..');
const now = fs.readFileSync(path.join(ROOT, 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8');
const SIX = {};
for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!SIX[m[1]]) SIX[m[1]] = m[2];
const ID = { 'Café': 'cafe', Bar: 'bar', Museum: 'museum', Nature: 'nature', Star: 'star', Add: 'plus' };
const scale = (d, s) => d.replace(/-?\d*\.?\d+(?:e-?\d+)?/g, v => (+v * s).toFixed(5));
// the 1.5px line read as the option's line: tokens are scaled so the line token lands where the option wants it
const OPTS = {
  A: { badge: 24, s: 1, line: 2, tie: 'up', label: '24 badge, 2px line' },
  B: { badge: 32, s: 4 / 3, line: 2, tie: 'up', label: '32 badge, 2px line' },
  C: { badge: 24, s: 1, line: 1, tie: 'down', label: '24 badge, 1px line' },
};
const out = {}, SV = path.join(ROOT, 'svg', 'wholegrid'), RAW = path.join(ROOT, 'stills', 'wholegrid', 'raw');
fs.mkdirSync(SV, { recursive: true }); fs.mkdirSync(RAW, { recursive: true });
for (const [o, O] of Object.entries(OPTS)) {
  out[o] = {};
  for (const [n, id] of Object.entries(ID)) {
    const d0 = scale(SIX[n], O.s);
    // density 1, unit = 1 css px: a snap onto the whole-px grid (size 24 with dpr 1 means k = 1)
    const F = pf.fit(d0, { size: 24, dpr: 1, tie: O.tie });
    const soft = dpr => pf.edges(F.d, 24, dpr).filter(e => e.off > 0.1).length;
    out[o][id] = { d: F.d, soft2: soft(2), soft3: soft(3), edges: pf.edges(F.d, 24, 2).length, fair: fair.check(F.d).length, join: join.check(F.d).length,
      area: +((pf.centroid(F.d).area / pf.centroid(d0).area - 1) * 100).toFixed(1), stems: [...F.x.stems, ...F.y.stems].map(s => s.W) };
    fs.writeFileSync(path.join(SV, `${o}-${id}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${O.badge}" height="${O.badge}" viewBox="0 0 ${O.badge} ${O.badge}"><path fill-rule="evenodd" d="${F.d}"/></svg>\n`);
  }
}
// the approved six as they are (1.5px line on the 1/3px lattice), for comparison
out.now = {}; for (const [n, id] of Object.entries(ID)) out.now[id] = { d: SIX[n], soft2: pf.edges(SIX[n], 24, 2).filter(e => e.off > 0.1).length, soft3: pf.edges(SIX[n], 24, 3).filter(e => e.off > 0.1).length, edges: pf.edges(SIX[n], 24, 2).length };
fs.writeFileSync(path.join(SV, 'measure.json'), JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Object.fromEntries(Object.entries(v).map(([i, r]) => [i, { ...r, d: undefined }]))])), null, 1));
for (const [o, v] of Object.entries(out)) console.log(o, Object.entries(v).map(([i, r]) => `${i} soft ${r.soft2}/${r.soft3} of ${r.edges}${r.fair !== undefined ? ` fair ${r.fair} join ${r.join} area ${r.area}% widths ${[...new Set(r.stems)].join(',')}` : ''}`).join(' | '));

// renders: each option's badge (ring = the line, outer edge on the badge edge) at 2x and 3x, at 1:1
(async () => {
  const { chromium } = require('playwright'), b = await chromium.launch();
  const NAVY = '#12293F', PAPER = '#F2EBDD';
  const all = { ...OPTS, now: { badge: 24, line: 1.5 } };
  for (const dpr of [2, 3]) {
    const p = await b.newPage({ viewport: { width: 200, height: 200 }, deviceScaleFactor: dpr });
    for (const [o, O] of Object.entries(all)) for (const id of Object.values(ID)) {
      const B = O.badge, w = O.line;
      await p.setContent(`<body style="margin:0;background:${PAPER}"><svg style="position:absolute;left:8px;top:8px" width="${B}" height="${B}" viewBox="0 0 ${B} ${B}"><circle cx="${B / 2}" cy="${B / 2}" r="${B / 2 - w / 2}" fill="none" stroke="${NAVY}" stroke-width="${w}"/><path fill="${NAVY}" fill-rule="evenodd" d="${out[o][id].d}"/></svg></body>`);
      await p.screenshot({ path: path.join(RAW, `${o}-${id}-${dpr}x.png`), clip: { x: 8, y: 8, width: B, height: B } });
    }
    await p.close();
  }
  await b.close();
  fs.writeFileSync(path.join(SV, 'paths.json'), JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Object.fromEntries(Object.entries(v).map(([i, r]) => [i, r.d]))]))));
  console.log('rendered');
})();
