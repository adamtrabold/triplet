// Probe: the top controls' visible tops (the zoom control's box, the account badge's scallop ink),
// at rest and with the city-removed banner up. Run:
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/build/probe-top.js [index.html]
const path = require('path');
const L = require('./lib-cc.js');
const { W } = L;
const file = path.resolve(process.argv[2] || path.join(__dirname, '../../../index.html'));
(async () => {
  const b = await L.P.lib.launch();
  for (const [w, h, touch] of [[390, 844, true], [375, 667, true], [1280, 800, false]]) {
    const o = await L.open(b, { file, w, h, touch });
    const m = () => o.page.evaluate(() => {
      const z = document.querySelector('.leaflet-control-zoom').getBoundingClientRect(), a = document.getElementById('accountBtn').getBoundingClientRect();
      // the scallop's ink starts 3.90 of 50 below the box's top (SCALLOP polygon's least y)
      const ban = document.getElementById('cityBanner'), br = ban && !ban.hidden ? ban.getBoundingClientRect() : null;
      return { zoomTop: +z.top.toFixed(2), zoomBottom: +z.bottom.toFixed(2), badgeBox: +a.top.toFixed(2), badgeInk: +(a.top + a.height * 3.90 / 50).toFixed(2), badgeBottom: +a.bottom.toFixed(2), ban: br && { top: br.top, bottom: br.bottom, left: br.left, right: br.right, w: br.width } };
    });
    console.log(w, 'rest', JSON.stringify(await m()));
    await o.page.evaluate(() => rmCommit('copenhagen', 'malmo')); await W(800);
    console.log(w, 'banner', JSON.stringify(await m()), await o.page.evaluate(() => [document.body.className, document.querySelector('#cityBanner').textContent]));
    await o.page.evaluate(() => hideCityBanner()); await W(600);
    console.log(w, 'after', JSON.stringify(await m()), o.errors);
    await o.page.close(); await o.page.context().close();
  }
  await b.close();
})();
