// Quick look: open Plans with the fixture and write a few PNGs to OUT (default /tmp/plans-smoke).
const { open, launch, FIX } = require('./harness');
const fs = require('fs');
const OUT = process.env.OUT || '/tmp/plans-smoke';
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await launch();
  const { page, errors, consoleErrors } = await open(b, { plans: FIX.plans, stops: FIX.stops, visited: ['mir'] });
  await page.screenshot({ path: OUT + '/0-places.png' });
  await page.click('#toggleFiltersBtn'); await page.waitForTimeout(400);
  await page.click('#listSwitch [data-view="plans"]'); await page.waitForTimeout(900);
  await page.screenshot({ path: OUT + '/1-plans-panel.png' });
  await page.click('#toggleFiltersBtn'); await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + '/2-following.png' });
  console.log(JSON.stringify({ errors, consoleErrors, h2: await page.textContent('#locationsHeader h2') }));
  await b.close();
})();
