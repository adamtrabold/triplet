// Renders sheet.html to contact-sheet.png (2x) and contact-sheet-1x.png.
//   NODE_PATH=/opt/node-tools/node_modules node shoot.js [t2|t5]   (t5 also prints net ink and shoots 3x)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const set = process.argv[2] || 't2';
  const sfx = set === 't2' ? '' : '-' + set;
  for (const [dsf, name] of [[2, `contact-sheet${sfx}.png`], [1, `contact-sheet${sfx}-1x.png`], [3, `contact-sheet${sfx}-3x.png`]]) {
    if (set === 't2' && dsf === 3) continue;
    const pg = await b.newPage({ viewport: { width: 1056, height: 800 }, deviceScaleFactor: dsf });
    await pg.goto('file://' + path.join(__dirname, `sheet${sfx}.html`));
    await pg.waitForTimeout(900);
    if (sfx && dsf === 1) console.log(JSON.stringify(await pg.evaluate(() => window.INK)));
    await pg.locator('.page').screenshot({ path: path.join(__dirname, name) });
    await pg.close();
  }
  await b.close();
})();
