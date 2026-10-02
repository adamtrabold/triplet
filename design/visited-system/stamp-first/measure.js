// Contrast of the coloured-in pin (flat ground #F2EFE9, stand-in; real tiles vary).
// Run: NODE_PATH=/opt/node22/lib/node_modules node measure.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file://' + path.join(__dirname, 'mockup.html') + '?view=list&sys=X');
  const r = await p.evaluate(() => {
    const lum = h => { const c = [1,3,5].map(i => { const v = parseInt(h.slice(i,i+2),16)/255; return v <= 0.03928 ? v/12.92 : ((v+0.055)/1.055)**2.4; }); return .2126*c[0]+.7152*c[1]+.0722*c[2]; };
    const cr = (a,b) => { const x = lum(a), y = lum(b); return +((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2); };
    return Object.keys(CATEGORY_COLORS).map(c => ({ cat: c, washNear: pinWash(c,'near'), washFar: pinWash(c,'far'),
      glyphOnWash_v1: cr(glyphInk(c), pinWash(c,'near')), toneNear: toneInk(c,'near'), toneOnWash_combined: cr(toneInk(c,'near'), pinWash(c,'near')), washNearOnMap: cr(pinWash(c,'near'),'#F2EFE9'),
      washFarOnMap: cr(pinWash(c,'far'),'#F2EFE9'), edgeFarOnMap: cr(edgeInk(c),'#F2EFE9'), shippedRimOnMap: cr(CATEGORY_COLORS[c],'#F2EFE9') }));
  });
  console.table(r);
  await b.close();
})();
