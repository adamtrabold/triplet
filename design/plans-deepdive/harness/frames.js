const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { open } = require('./shot.js');
const states = process.argv.slice(2).length ? process.argv.slice(2) : ['A1','A2','A3','A4','B1','B2','B3','B4','C1','C2','C3','C4'];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const s of states) {
    const { ctx, page } = await open(b, { dsf: 1, state: s });
    await page.waitForTimeout(s === 'C2' ? 2200 : 600);
    await page.screenshot({ path: __dirname + '/f-' + s + '.png' });
    await ctx.close();
  }
  await b.close();
})();
