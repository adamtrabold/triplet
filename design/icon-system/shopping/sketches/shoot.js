// Renders sheet.html to contact-sheet.png (2x) and contact-sheet-1x.png.
//   NODE_PATH=/opt/node-tools/node_modules node shoot.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [dsf, name] of [[2, 'contact-sheet.png'], [1, 'contact-sheet-1x.png']]) {
    const pg = await b.newPage({ viewport: { width: 1056, height: 800 }, deviceScaleFactor: dsf });
    await pg.goto('file://' + path.join(__dirname, 'sheet.html'));
    await pg.waitForTimeout(600);
    await pg.locator('.page').screenshot({ path: path.join(__dirname, name) });
    await pg.close();
  }
  await b.close();
})();
