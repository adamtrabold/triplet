// r19: the cluster's stop tag -- square (r18) vs solid grey circle/pill vs paper ring/pill (stop-pin style).
// Same states (22, 31, 41), 1:1 at 3x around the knot, then the 1x phone view.  node r19sheet.js -> ../r19-tag-shape.png
const fs = require('fs'), path = require('path');
const FR = path.join(__dirname, '../frames');
const { launch } = require('../../../list-ordering/build/harness');
const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(FR, f)).toString('base64');
// centre each crop on the cluster that carries stops (from frames.json)
const F = JSON.parse(fs.readFileSync(path.join(FR, 'frames.json'), 'utf8'));
const focus = {};
for (const [k, n] of [['22', '22-map-z13-clusters'], ['31', '31-all-visited-shape-last'], ['41', '41-twelve-stops']]) {
  const ms = F[n].markers.filter(m => m.clusterStops && m.onMap); const m = ms[0] || F[n].markers.find(x => x.onMap);
  focus[k] = [Math.max(0, Math.min(390 - 119, m.x - 60)), Math.max(0, m.y - 55)];
}
const states = [['22', '22-map-z13-clusters'], ['31', '31-all-visited-shape-last'], ['41', '41-twelve-stops']];
const opts = [['SQUARE (r18)', (n, k) => `T-square-${k}@3x.png`, (n, k) => `T-square-${k}.png`], ['SOLID GREY CIRCLE', (n, k) => `T-solid-${k}@3x.png`, (n, k) => `T-solid-${k}.png`], ['GREY RING, like a stop pin', (n, k) => `T-ring-${k}@3x.png`, (n, k) => `T-ring-${k}.png`]];
(async () => {
  const b = await launch();
  const page = await (await b.newContext({ viewport: { width: 1170, height: 800 } })).newPage();
  const crop3 = (f, k) => `<div style="height:330px;overflow:hidden;border:2px solid #12293F;background:url(${img(f)}) no-repeat;background-size:1170px auto;background-position:-${focus[k][0] * 3}px -${focus[k][1] * 3}px"></div>`;
  const crop1 = (f, k) => `<div style="height:110px;overflow:hidden;border:1px solid #12293F;background:url(${img(f)}) no-repeat;background-size:390px auto;background-position:-${focus[k][0]}px -${focus[k][1]}px;image-rendering:pixelated"></div>`;
  const rows = states.map(([k, n]) => `<div class="lab">${k}</div><div class="row">${opts.map(([l, f3, f1]) => `<div><div class="k">${l}</div>${crop3(f3(n, k), k)}<div class="k1">at 1x</div>${crop1(f1(n, k), k)}</div>`).join('')}</div>`).join('');
  const html = `<style>body{margin:0;background:#F2EBDD;font-family:Archivo,Helvetica,sans-serif;color:#1A1A18}.cap{padding:26px 30px;font-size:32px;line-height:42px;font-weight:600;border-bottom:3px solid #12293F}
    .lab{font-size:28px;font-weight:700;padding:20px 30px 6px;color:#12293F}.k{font-size:20px;font-weight:800;letter-spacing:.06em;color:#12293F;padding:0 0 6px}.k1{font-size:16px;color:#5A564C;padding:6px 0 4px}
    .row{display:flex;gap:18px;padding:0 30px 8px}.row>div{width:358px}</style>
    <div class="cap">The grey stop number next to a red cluster: square (r18), solid grey circle, or grey ring like a stop pin. The pick: the ring (now the default).</div>${rows}`;
  await page.setContent(html); await page.evaluate(() => document.fonts.ready);
  await page.setViewportSize({ width: 1170, height: await page.evaluate(() => document.body.scrollHeight) });
  await page.screenshot({ path: path.join(__dirname, '../r19-tag-shape.png'), fullPage: true });
  await b.close(); console.log('ok');
})();
