// Quick look: node smoke.js out.png [dsf] [openMenu]
const { open, launch } = require('./harness');
(async () => {
  const [out, dsf = '1', menu = ''] = process.argv.slice(2);
  const b = await launch(); const { page, errors } = await open(b, { dsf: +dsf });
  if (menu) { await page.tap('#sortBtn'); await page.waitForTimeout(300); }
  await page.screenshot({ path: out });
  console.log(JSON.stringify({ errors, order: await page.evaluate(() => [...document.querySelectorAll('#locationsList .location-card')].slice(0, 6).map(e => e.querySelector('h3').textContent)) }));
  await b.close();
})();
