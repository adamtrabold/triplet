// Round 7 (M1): edge = soft shadow (no hard line), row sticker says VISITED. Stills, before/after crops, truncation count.
// Run: NODE_PATH=/opt/node22/lib/node_modules node sticker7.js <archivo.woff2> [names.txt]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = __dirname, url = 'file://' + path.join(dir, 'mockup.html');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FONT = process.argv[2], NAMES = process.argv[3];
const O = f => path.join(dir, 'sticker', f);

(async () => {
  fs.mkdirSync(path.join(dir, 'sticker'), { recursive: true });
  const b = await chromium.launch({ executablePath: exe });
  const mk = async (dpr, w = 390, h = 760) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
    if (FONT) {
      await p.route(/fonts\.googleapis\.com/, r => r.fulfill({ contentType: 'text/css', body:
        `@font-face{font-family:'Archivo';font-style:normal;font-weight:400 700;font-stretch:62% 125%;src:url(https://fonts.gstatic.com/archivo.woff2) format('woff2');}` }));
      await p.route(/fonts\.gstatic\.com/, r => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(FONT) }));
    }
    return p;
  };
  const go = async (p, q, sel, out) => { await p.goto(`${url}?${q}`); await p.evaluate(() => document.fonts.ready); await p.locator(sel).first().screenshot({ path: out }); };
  for (const dpr of [1, 3]) {
    const p = await mk(dpr);
    await go(p, 'sys=M1&view=list', '#app', O(`M1-list-${dpr}x.png`));
    await go(p, 'sys=M1&tier=near', '.phone', O(`M1-near-${dpr}x.png`));
    await go(p, 'sys=M1&tier=far', '.phone', O(`M1-far-${dpr}x.png`));
    await p.setViewportSize({ width: 520, height: 760 });
    await go(p, 'sys=M1&view=crop', '#app > div', O(`M1-crop-${dpr}x.png`));
    await go(p, 'sys=M1&view=verify', '#app > div', O(`M1-verify-${dpr}x.png`));
    await go(p, 'sys=M1&view=verify&old=1', '#app > div', O(`M1-verify-old-${dpr}x.png`));
    await go(p, 'sys=M1&view=overlap', '#app > div', O(`M1-overlap-${dpr}x.png`));
    await p.setViewportSize({ width: 390, height: 760 });
    await go(p, 'sys=M1&view=list', '.list', O(`row-word-${dpr}x.png`));
    await go(p, 'sys=M1&view=list&legacyrow=1', '.list', O(`row-noword-${dpr}x.png`));
    await p.setViewportSize({ width: 520, height: 760 });
    for (let k = 0; k < 4; k++) await go(p, `sys=M1&view=m1key&k=${k}`, '#app > div', O(`M1-key-${k + 1}-${dpr}x.png`));
    await p.close();
  }
  { const p4 = await mk(4, 520, 300); await go(p4, 'sys=M1&view=endscmp', '#app > div', O('check-vs-glyph-ends-4x.png')); await p4.close(); }
  const img = f => 'data:image/png;base64,' + fs.readFileSync(O(f)).toString('base64');
  const page = async (html, out, w = 1250) => {
    const f = O('tmp-' + path.basename(out) + '.html'); fs.writeFileSync(f, html);
    const c = await b.newPage({ viewport: { width: w, height: 800 }, deviceScaleFactor: 1 });
    await c.goto('file://' + f);
    await c.locator('.wrap').screenshot({ path: out });
    await c.close(); fs.rmSync(f);
  };
  const css = `body{margin:0;background:#1d1d1b;font:600 13px/1.3 -apple-system,Segoe UI,Roboto,sans-serif;color:#F2EBDD}.wrap{padding:14px;width:max-content}.t{font-size:15px;margin:0 0 8px}.t small{display:block;font-weight:400;color:#bdb5a6;font-size:12px}img{display:block}.row{display:flex;gap:18px;align-items:flex-start;margin-bottom:14px}.c{font-weight:400;color:#bdb5a6;font-size:12px;margin:0 0 4px}`;
  // 1x contact sheet
  await page(`<!doctype html><meta charset=utf-8><style>${css}.g{display:grid;grid-template-columns:390px 390px 390px;gap:14px}</style><div class=wrap>
    <div class=t>Visited sticker, round 7 · true 1x · list | map NEAR | map FAR (75% visited)<small>Edge is a soft shadow, no hard line. Row sticker says VISITED. Map pins keep the check only. Basemap is a STAND-IN.</small></div>
    <div class=g><img src="${img('M1-list-1x.png')}"><img src="${img('M1-near-1x.png')}"><img src="${img('M1-far-1x.png')}"></div></div>`, path.join(dir, 'sticker-contact-1x.png'));
  // edge before/after (pins + ovals)
  await page(`<!doctype html><meta charset=utf-8><style>${css}</style><div class=wrap>
    <div class=t>Edge: hard line vs soft shadow<small>3x. Top: before (round 7 shadow). Bottom: after (natural warm shadow).</small></div>
    <p class=c>BEFORE · round 7: black shadow, hard crease</p><img src="${img('M1-verify-old-3x.png')}" style="width:872px">
    <p class=c>AFTER · warm, low-opacity, long falloff</p><img src="${img('M1-verify-3x.png')}" style="width:872px"></div>`, path.join(dir, 'sticker-edge-before-after-3x.png'), 940);
  await page(`<!doctype html><meta charset=utf-8><style>${css}</style><div class=wrap>
    <div class=t>Edge at true 1x (actual pixels)</div>
    <p class=c>BEFORE</p><img src="${img('M1-verify-old-1x.png')}"><p class=c>AFTER</p><img src="${img('M1-verify-1x.png')}"></div>`, path.join(dir, 'sticker-edge-before-after-1x.png'), 560);
  // row sticker without / with word
  await page(`<!doctype html><meta charset=utf-8><style>${css}</style><div class=wrap>
    <div class=t>Row sticker: padding before vs after<small>3x crops of the same rows. Padding = 12px (--s3), as filter chips.</small></div>
    <p class=c>BEFORE · round 7: 68x24, 11px pad</p><img src="${img('row-noword-3x.png')}" style="width:780px">
    <p class=c>AFTER · 72x24, 12px (--s3) pad each side</p><img src="${img('row-word-3x.png')}" style="width:780px"></div>`, path.join(dir, 'sticker-row-word-before-after-3x.png'), 840);
  await page(`<!doctype html><meta charset=utf-8><style>${css}</style><div class=wrap>
    <div class=t>Row sticker at true 1x</div><div class=row><div><p class=c>BEFORE · 68 wide</p><img src="${img('row-noword-1x.png')}"></div><div><p class=c>AFTER · 72 wide</p><img src="${img('row-word-1x.png')}"></div></div></div>`, path.join(dir, 'sticker-row-word-before-after-1x.png'), 840);
  // keyframes
  await page(`<!doctype html><meta charset=utf-8><style>${css}</style><div class=wrap><div class=t>Visit swipe = placing the sticker (M1), 3x keyframes</div>${[1,2,3,4].map(i => `<img src="${img(`M1-key-${i}-3x.png`)}" style="margin-bottom:8px">`).join('')}</div>`, path.join(dir, 'sticker-keyframes-3x.png'), 1400);

  // truncation count: real names (193 in locations), worst case = every row visited, at 390px
  if (NAMES) {
    const rows = fs.readFileSync(NAMES, 'utf8').trim().split('\n').map(l => { const [name, st, vis] = l.split('|'); return { name, starred: st === '1', visited: vis === '1' }; });
    const out = { total: rows.length, visitedNow: rows.filter(r => r.visited).length };
    const variants = { 'no stamp (unvisited row)': ['sys=ref', false], 'shipped dotted stamp 72x32': ['sys=ref', true], 'M1 check-only oval 48x24': ['sys=M1&lab=check', true], 'M1 word-only oval 64x24': ['sys=M1&lab=word', true], 'M1 round 7 check + VISITED 68x24 (11px pad)': ['sys=M1&legacyrow=1', true], 'M1 check + VISITED oval 72x24 (12px pad)': ['sys=M1&lab=both', true] };
    const p = await mk(1);
    for (const [label, [q, vis]] of Object.entries(variants)) {
      await p.goto(`${url}?${q}&view=list`); await p.evaluate(() => document.fonts.ready);
      const res = await p.evaluate(({ rows, vis }) => {
        const host = document.createElement('div'); host.className = 'list'; host.style.cssText = 'width:390px;position:absolute;left:0;top:0';
        document.body.appendChild(host);
        const sysNow2 = new URLSearchParams(location.search).get('sys');
        let all = 0, vOnly = 0, starAll = 0;
        for (const r of rows) {
          const el = document.createElement('div'); el.className = 'location-card' + (r.starred ? ' is-starred' : '') + (vis ? ' is-visited' : '');
          el.innerHTML = rowHtml({ id: r.name, name: r.name, category: 'attraction', visited: vis, starred: r.starred }, sysNow2).replace(/^\s*<div[^>]*>/, '').replace(/<\/div>\s*$/, '');
          host.appendChild(el);
          const h3 = el.querySelector('h3'), tr = h3.scrollWidth > h3.clientWidth + 0.5;
          if (tr) { all++; if (r.visited) vOnly++; }
        }
        host.remove(); return { all, vOnly };
      }, { rows, vis });
      out[label] = { truncatingOfAll: res.all, truncatingOfTheVisitedNow: res.vOnly };
    }
    await p.close();
    fs.writeFileSync(O('row-truncation.json'), JSON.stringify(out, null, 1));
    console.log(JSON.stringify(out, null, 1));
  }
  await b.close();
})();
