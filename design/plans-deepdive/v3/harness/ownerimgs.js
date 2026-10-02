// Owner images: the @3x frames (1170px wide = a phone screen at its own resolution), one or
// two per image, with the caption built in at a phone-readable size (42px at 3x = 14pt).
//   node ownerimgs.js   -> ../owner-images/*.png   (run after frames.js)
const fs = require('fs'), path = require('path');
const { launch } = require('../../../list-ordering/build/harness');
const FR = path.join(__dirname, '../frames'), OUT = path.join(__dirname, '../owner-images');
fs.mkdirSync(OUT, { recursive: true });
const PHASE1 = process.env.PHASE1_STILLS;   // optional: dir with the build's 03-following@3x.png for the "before"
const M = JSON.parse(fs.readFileSync(path.join(__dirname, '../measure.json'), 'utf8'));
const img = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const I = [
  ['01-same-filters-both-views', 'The filter panel is identical in Places and Plans, and the same height: every city, every category. The plan picker sits beside the switch.', [['PLACES', '01-places-panel@3x.png'], ['PLANS', '02-plans-panel@3x.png']]],
  ['02-pick-rename-delete', 'Tap the picker: every plan, with ⋯ on each to rename or delete it, even one you are not viewing.', [['PICK', '17-plan-menu@3x.png'], ['⋯ ON ANOTHER PLAN', '17b-plan-more-other@3x.png']]],
  ['03-following', 'Following: stops on top. Each stop’s plain grey number sits on the left column’s centre line, where the chevron and the icons of normal rows sit. Its place icon moves one column over, and that shift marks a stop. One number style, no NEXT. A visited stop looks like any visited place. × removes a stop.', [['', '03-plans-list@3x.png']]],
  ['04-filter-to-add', 'Building: pick Cafe. The line says where the plan ends and what is below it (“Add from Copenhagen · cafe (1)”). + adds a place; × removes a stop (both grey, the X’s ink). The map shows the stops and the places you can add; zoomed this far out, a place is a bare ring (as in Places), and its row names it.', [['', '05-filter-cafe@3x.png']]],
  ['05-added', 'Tap +: it becomes stop 7 on the list and the map, with Undo.', [['', '06-added@3x.png']]],
  ['06-city-still-plans', 'Picking Malmö keeps you in Plans: the stops stay on top, Malmö’s places are below the line and the map shows them.', [['', '07-city-malmo@3x.png']]],
  ['07-chips-never-hide-stops', 'Cafe off: café stops 1 and 3 stay. Chips choose what you can add; they never hide your plan.', [['', '09-filter-excludes-stops@3x.png']]],
  ['08-remove-undo', '× on a stop removes it from the plan (the place stays). Undo for 6 seconds.', [['', '13-removed@3x.png']]],
  ['09-long-reorder', 'Reorder: hold the number, drag. Near the top or bottom edge the list scrolls for you: stop 7 to stop 1 with the panel open.', [['HOLDING AT THE EDGE', '32-reorder-long-drag@3x.png'], ['DROPPED: NOW STOP 1', '33-reorder-long-dropped@3x.png']]],
  ['10-map-route-first', 'The map in Plans works like Places: same pins, same red count clusters, same zoom-in on tap. A stop is its usual pin plus a small grey numbered tag, the same for every stop. Each tag stays touching its pin and moves to a free spot, so it never hides a cluster’s count or sits under a button. With the sheet down, the map shows every stop.', [['FOLLOWING (SHEET DOWN)', '34-collapsed-following-map@3x.png'], ['ZOOMED OUT', '22-map-z13-clusters@3x.png']]],
  ['10b-map-zoomed-far-out', 'Zoomed far out, stops stay at their real spots; stops on top of each other share one tag (“1–6”). Places clusters stay on top and readable, exactly as in Places. The cost: zoomed out, the red discs cover some stop pins (their tags stay readable). While you build, the map can open this far out (z8–z10) when the plan and the places to add are spread; zoom in a step, or close the panel, to clear it.', [['ZOOMED OUT (Z11)', '23-map-z11@3x.png'], ['ALL CITIES', '08-all-cities@3x.png']]],
  ['10c-tapped-place', 'Tap a place: it is highlighted exactly as in Places (bigger, filled). It draws just under the stops, so a stop’s number is never covered.', [['', '37-new-place-below-rule@3x.png']]],
  ['12-one-question-map', 'ONE QUESTION: while you follow a plan (sheet down), should the map show every place your filters match, as in Places (left), or only the plan’s stops (right)? We recommend LEFT: one rule everywhere, and you can add places as you walk. (Right would need the app to guess when you are “just following”.)', [['(A) AS NOW — RECOMMENDED', '34-collapsed-following-map@3x.png'], ['(B) PLAN ONLY', '38-map-option-b-plan-only@3x.png']]],
  ['13-no-plans-new-place', 'No plans yet: the empty list offers New plan. A place you add through the add form appears below the line, ready to add to the plan.', [['NO PLANS', '18b-no-plans-closed@3x.png'], ['NEW PLACE → BELOW THE LINE', '37-new-place-below-rule@3x.png']]],
  ['14-delete-place-in-plan', 'Pictured: after deleting a place that was stop 1, the plan closes up (1–5, no gap). Not pictured: the delete confirm is the phone’s own dialog, and it now adds “It is a stop in “Nørrebro afternoon”; it will leave that plan too.”', [['', '39-place-deleted-renumbered@3x.png']]],
];
const optRow = (tag, file, m) => `<div class="opt"><div class="cap">${tag}</div><img src="${img(path.join(FR, file))}"><div class="num">${m}</div></div>`;
const f = (k) => M[k];
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 1170, height: 800 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const css = `<style>body{margin:0;background:#F2EBDD;font-family:Archivo,Helvetica,Arial,sans-serif;color:#1A1A18}
    .cap{padding:36px 48px 28px;font-size:42px;line-height:54px;font-weight:600;border-bottom:3px solid #12293F}
    .row{display:flex;gap:18px;padding:18px;background:#E7DFD0}.row>div{flex:1}.row img{width:100%;display:block;border:1px solid #12293F}
    .lab{font-size:30px;font-weight:700;letter-spacing:.08em;padding:0 0 10px;color:#12293F}
    .opt{border-top:3px solid #12293F;background:#F2EBDD}.opt .cap{font-size:34px;line-height:44px;padding:22px 36px;border:none}.opt img{width:100%;display:block}.opt .num{font-size:30px;line-height:40px;padding:12px 36px 22px;color:#5A564C}</style>`;
  for (const [name, cap, shots] of I) {
    const two = shots.length > 1;
    const html = `${css}<div class="cap">${cap}</div>${two ? `<div class="row">${shots.map(([l, s]) => `<div><div class="lab">${l}</div><img src="${img(path.join(FR, s))}"></div>`).join('')}</div>`
      : `<img style="width:1170px;display:block" src="${img(path.join(FR, shots[0][1]))}">`}`;
    await page.setViewportSize({ width: 1170, height: 100 });
    await page.setContent(html); await page.evaluate(() => document.fonts.ready); await new Promise(r => setTimeout(r, 200));
    const h = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewportSize({ width: 1170, height: h });
    await page.screenshot({ path: path.join(OUT, `owner-${name}.png`), fullPage: true });
  }
  // r11: stop rows on Places' grid -- Places and Plans side by side, same rows band, measured left edges.
  const ed = JSON.parse(fs.readFileSync(path.join(__dirname, '../measure.json'), 'utf8'))['r11 edges'] || {};
  const ink = JSON.parse(fs.readFileSync(path.join(__dirname, '../ink.json'), 'utf8'))['3x'];
  const inkX = ink.letters.round;   // where round capitals' ink starts (css px); the stop rings land here
  const vline = (x, colr, dash) => `<div style="position:absolute;top:0;bottom:0;left:calc(${x / 390 * 100}% - 0.5px);width:0;border-left:1.5px ${dash ? 'dashed' : 'solid'} ${colr};opacity:.75"></div>`;
  const ring = ink.stopIcons.find(x => x.kind === 'ring'), dia = ink.stopIcons.find(x => x.kind === 'diamond');
  // 4x zoom of the icon / text edge: frame 05's rows crop (3x, css y 544..844) -> x 40..130 css, y 690..800 css
  const zoom = (f, y0) => `<div style="position:relative;width:360px;height:700px;overflow:hidden;background:url(${img(path.join(FR, f))}) no-repeat;background-size:1560px auto;background-position:-160px -${(y0 - 544) * 4}px;border:1px solid #12293F">` +
    `<div style="position:absolute;top:0;bottom:0;left:${(inkX - 40) * 4}px;border-left:2px dashed #2D6FC2;opacity:.85"></div></div>`;
  const html = `${css}<div class="cap">Lined up by the ink, not the box. Red: the centre line of the left column (chevron, stop numbers, Places icons). Blue dashed: where the Places names’ letters actually start. Every stop icon’s ring now starts on that blue line. The district diamond’s point reaches 0.4px past it, as the points of A and T do.</div>` +
    `<div class="row">${[['PLACES', '40-places-rows-rows@3x.png'], ['PLANS', '05-filter-cafe-rows@3x.png'], ['PLANS · 10+ STOPS', '41-twelve-stops-rows@3x.png']].map(([l, f]) => `<div><div class="lab">${l}</div><div style="position:relative"><img src="${img(path.join(FR, f))}">${vline(30, '#C2452D')}${vline(inkX, '#2D6FC2', true)}</div></div>`).join('')}</div>` +
    `<div class="row"><div><div class="lab">×4: STOP ICONS ABOVE, A PLACES NAME (HART) BELOW</div>${zoom('05-filter-cafe-rows@3x.png', 640)}</div><div><div class="lab">×4: THE STOPS ABOVE</div>${zoom('03-plans-list-rows@3x.png', 600)}</div></div>` +
    `<div class="opt"><div class="num">Measured from the pixels at 3x (css px): Places names’ ink starts at ${ink.letters.stem} (H, K, R…), ${ink.letters.round} (C, G, O, S), ${ink.letters.point} (A, T). Stop ring ink ${ring.iconInk} (was 58.01, 1.3px right of the names), diamond tip ${dia.iconInk} (was 58.00).</div></div>`;
  await page.setViewportSize({ width: 1170, height: 800 });
  await page.setContent(html); await page.evaluate(() => document.fonts.ready);
  await page.setViewportSize({ width: 1170, height: await page.evaluate(() => document.body.scrollHeight) });
  await page.screenshot({ path: path.join(OUT, 'owner-11-rows-on-places-grid.png'), fullPage: true });
  await b.close();
  console.log('owner images:', fs.readdirSync(OUT).length);
})();
