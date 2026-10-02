// r17: the owner's rule ("stop clusters should function the same as a normal cluster ... the squared
// number thing is fine near the red cluster number"), build stills (NOW) beside the prototype (NEW RULE),
// map only, big enough to read on a phone.  BUILD=<build worktree> node r17sheet.js -> ../r18-map-numbers.png
const fs = require('fs'), path = require('path');
const BUILD = process.env.BUILD;
const FR = path.join(__dirname, '../frames');
const { launch } = require('../../../list-ordering/build/harness');
const img = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const pairs = [
  ['22', 'Zoom 13', '22-map-z13-clusters@3x.png', 'A grey number tag beside every stop pin; stop 3 is hidden under a red “3”.', 'Stops 1, 2 and 4 show their number IN the pin. Stop 3 is counted in the red “4”, and its grey “3” sits right against it.'],
  ['31', 'A plan opening', '31-all-visited-shape-last@3x.png', 'Stop 4 (a street) is buried under red discs.', 'Stop 4 is counted in the red “4”, and its grey “4” sits right against it.'],
  ['41', 'A 12-stop plan opening', '41-twelve-stops@3x.png', 'Stops 8–11 sit under red discs, tags floating nearby.', 'Stop 8 shows its number in the pin; each red disc holding stops has its grey numbers right against it.'],
  ['27', 'A plan opening', '27-long-name@3x.png', 'The same as 31.', 'The same rule.'],
  ['17', 'The plan menu open', '17-plan-menu@3x.png', 'A knot of stop pins tagged “1–6”.', 'The stops are counted in the red discs; their grey numbers (“2–4”, “1,5–6”) sit right against them.'],
];
(async () => {
  const b = await launch();
  const page = await (await b.newContext({ viewport: { width: 1170, height: 800 } })).newPage();
  // 1:1 at 3x (each panel shows ~179 x 187 css px around the plan), so a phone reader sees the numbers
  const focus = { '22': [20, 70], '31': [10, 140], '41': [30, 150], '27': [10, 140], '17': [100, 0] };
  const crop = (src, n) => `<div style="height:560px;overflow:hidden;border:2px solid #12293F;background:url(${src}) no-repeat;background-size:1170px auto;background-position:-${focus[n][0] * 3}px -${focus[n][1] * 3}px"></div>`;
  const rows = pairs.filter(([, , f]) => fs.existsSync(path.join(BUILD, 'design/plans-build/stills', f)) && fs.existsSync(path.join(FR, f))).map(([n, lab, f, was, now]) =>
    `<div class="lab">${n} · ${lab}</div><div class="row"><div><div class="k">NOW</div>${crop(img(path.join(BUILD, 'design/plans-build/stills', f)), n)}<div class="t">${was}</div></div>` +
    `<div><div class="k">NEW RULE</div>${crop(img(path.join(FR, f)), n)}<div class="t">${now}</div></div></div>`).join('');
  const html = `<style>body{margin:0;background:#F2EBDD;font-family:Archivo,Helvetica,sans-serif;color:#1A1A18}.cap{padding:30px 36px;font-size:36px;line-height:46px;font-weight:600;border-bottom:3px solid #12293F}
    .lab{font-size:30px;font-weight:700;padding:26px 36px 8px;color:#12293F}.k{font-size:24px;font-weight:800;letter-spacing:.08em;color:#12293F;padding:0 0 8px}.t{font-size:26px;line-height:34px;padding:10px 0 0;color:#2a2a26}
    .row{display:flex;gap:26px;padding:0 36px 10px}.row>div{width:536px}</style>
    <div class="cap">Your rule: a stop on its own shows its number in place of its icon. Stops inside a red cluster are counted in it, and their grey number sits right against the red number. Left: today’s build. Right: your rule.</div>${rows}`;
  await page.setContent(html); await page.evaluate(() => document.fonts.ready);
  await page.setViewportSize({ width: 1170, height: await page.evaluate(() => document.body.scrollHeight) });
  await page.screenshot({ path: path.join(__dirname, '../r18-map-numbers.png'), fullPage: true });
  await b.close(); console.log('ok');
})();
