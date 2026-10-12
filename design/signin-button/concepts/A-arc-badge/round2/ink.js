const { chromium } = require('/opt/node22/lib/node_modules/playwright'); const fs = require('fs');
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
(async () => { const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  const p = await b.newPage({ viewport: { width: 500, height: 500 } });
  for (const v of process.argv[2].split(',')) { await p.goto('file://' + __dirname + '/ink.html?v=' + v); await p.waitForFunction(() => document.title === 'ready'); await p.waitForTimeout(200);
    await p.screenshot({ path: `/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/ink-${v}.png`, clip: { x: 0, y: 0, width: 500, height: 500 } }); }
  await b.close(); })();
