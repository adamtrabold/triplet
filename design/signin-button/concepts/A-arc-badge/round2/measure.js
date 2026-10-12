const { chromium } = require('/opt/node22/lib/node_modules/playwright'); const fs = require('fs');
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
(async () => { const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  const p = await b.newPage(); await p.goto('file://' + __dirname + '/measure.html');
  for (const v of (process.argv[2] || '2').split(',')) console.log(v, JSON.stringify(await p.evaluate(v => measure(v), v)));
  await b.close(); })();
