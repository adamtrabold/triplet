// Pass-A jam sketches (visual, turn 34). node render.js -> *-3x.png. Sketches, not stills.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs');const d=fs.readdirSync('/opt/pw-browsers').filter(x=>/^chromium-\d+$/.test(x)).sort().pop();
(async()=>{const b=await chromium.launch({executablePath:`/opt/pw-browsers/${d}/chrome-linux/chrome`,args:['--allow-file-access-from-files']});
for(const f of fs.readdirSync(__dirname).filter(x=>x.endsWith('.html'))){
 const p=await (await b.newContext({viewport:{width:390,height:700},deviceScaleFactor:3})).newPage();
 await p.goto('file://'+__dirname+'/'+f);await p.waitForTimeout(300);
 for(const el of await p.$$('[data-shot]')){await el.screenshot({path:__dirname+'/'+(await el.getAttribute('data-shot'))+'-3x.png'})}
 for(const id of ['s1','s2']){const el=await p.$('#'+id);if(el)await el.screenshot({path:__dirname+'/'+f.replace('.html','')+'-'+id+'-3x.png'})}
}await b.close()})();
