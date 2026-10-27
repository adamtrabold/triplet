// director's own render: approved vs grid, at 24 (dpr 2, 3, enlarged pixelated) and 72 (vector)
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/la-trip-map/.claude/worktrees/agent-a8d1c5f867ad4dbc6/design/icon-system/grid';
const OUT = '/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/dir';
const NAVY = '#12293F', PAPER = '#F2EBDD';
const grid = JSON.parse(fs.readFileSync(path.join(ROOT, 'svg', 'the-grid', 'build.json'), 'utf8'));
const now = fs.readFileSync(path.join(ROOT, 'simplify', 'boards', 'Grid7Now.dc.html'), 'utf8'), A = {};
for (const m of now.matchAll(/<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-label="([^"]+)"[^>]*><path fill="[^"]+" fill-rule="evenodd" d="([^"]+)"\/>/g)) if (!A[m[1]]) A[m[1]] = m[2];
const ORDER = ['cafe', 'bar', 'museum', 'nature', 'star', 'plus'];
const SETS = {
  approved: { cafe: A['Café'], bar: A.Bar, museum: A.Museum, nature: A.Nature, star: A.Star, plus: A.Add, s: { star: 20 / 24, plus: 1.1 } },
  grid: { ...Object.fromEntries(ORDER.map(n => [n, grid[n].d])), s: { star: 1, plus: 1 } },
};
const cell = (set, n, k) => {
  const d = SETS[set][n], ring = !['star', 'plus'].includes(n);
  const s = SETS[set].s[n] || 1, w = 24 * s * k, o = (24 * k - w) / 2;
  return `<div style="width:${24 * k}px;height:${24 * k}px;position:relative;flex:none"><svg width="${24 * k}" height="${24 * k}" viewBox="0 0 24 24" style="position:absolute;left:0;top:0">${ring ? `<circle cx="12" cy="12" r="11.25" fill="none" stroke="${NAVY}" stroke-width="1.5"/>` : ''}</svg>` +
    `<svg width="${w}" height="${w}" viewBox="0 0 24 24" style="position:absolute;left:${o}px;top:${o}px"><path fill="${NAVY}" fill-rule="evenodd" d="${d}"/></svg></div>`;
};
const row = (set, k) => `<div style="display:flex;gap:${4 * k}px;padding:${2 * k}px;width:max-content">${ORDER.map(n => cell(set, n, k)).join('')}</div>`;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  for (const dpr of [2, 3]) {
    const p = await b.newPage({ viewport: { width: 400, height: 120 }, deviceScaleFactor: dpr });
    await p.setContent(`<body style="margin:0;background:${PAPER}"><div id="r">${row('approved', 1)}${row('grid', 1)}</div></body>`);
    await (await p.$('#r')).screenshot({ path: `${OUT}/r24-${dpr}x.png` });
    await p.close();
  }
  const p = await b.newPage({ viewport: { width: 1400, height: 400 }, deviceScaleFactor: 1 });
  await p.setContent(`<body style="margin:0;background:${PAPER}"><div id="r">${row('approved', 3)}${row('grid', 3)}</div></body>`);
  await (await p.$('#r')).screenshot({ path: `${OUT}/r72.png` });
  await b.close();
})();
