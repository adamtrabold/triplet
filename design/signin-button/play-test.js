const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const H = '/home/user/la-trip-map/design/gesture-harness';
const fsdir = require('fs').readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const WRAP = `;(function(){const cc=window.supabase.createClient;window.__realWrites=[];window.__realOpts=[];
window.supabase.createClient=function(u,k,o){window.__realOpts.push(o||null);const c=cc.apply(this,arguments);const f=c.from.bind(c);
c.from=t=>{const b=f(t);['insert','update','upsert','delete'].forEach(m=>{const o=b[m];b[m]=function(){window.__realWrites.push(t+'.'+m);return o.apply(this,arguments)}});return b};return c}})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: `/opt/pw-browsers/${fsdir}/chrome-linux/chrome` });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  const html = fs.readFileSync(process.env.FILE || '/home/user/la-trip-map/index.html', 'utf8');
  await page.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: html });
    if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/vendor/leaflet.js') });
    if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/leaflet.css') });
    if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/stub.js', 'utf8') + WRAP });
    return r.fulfill({ status: 404, body: '' }); });
  const load = async q => { await page.goto('https://triplet.test/index.html' + q); await page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length > 5, null, { timeout: 15000 }); await new Promise(r => setTimeout(r, 400)); };
  await load('?play');
  const r = await page.evaluate(async () => {
    const out = {}; out.user = currentUser && currentUser.email; out.opts = __realOpts;
    const id = locations.find(l => !l.starred).id; const n0 = locations.length;
    await toggleLocationFlag(id, 'starred'); out.starredLocal = locations.find(l => l.id === id).starred;
    out.starredServer = __ROWS.find(l => l.id === id).starred;
    const del = locations.find(l => l.id !== id).id; await deleteLocation(del); out.deleted = !locations.some(l => l.id === del);
    await addLocation({ name: 'Playground test', address: 'x', category: 'restaurant', lat: 64.14, lng: -21.94, notes: '', city: locations[0].city });
    out.added = locations.some(l => l.name === 'Playground test'); out.count = [n0, locations.length, __ROWS.length];
    const sh = neighborhoodShapes[0]; if (sh) { await toggleLocationFlag('shape:' + sh.id, 'visited'); out.shapeVisited = [neighborhoodShapes.find(s => s.id === sh.id).visited, __SHAPES.find(s => s.id === sh.id).visited]; }
    await new Promise(r => setTimeout(r, 1000));   // a poll tick must not revert the edits
    out.afterPoll = [locations.find(l => l.id === id).starred, locations.length];
    const pid = await createPlan('Test plan'); out.plan = [!!pid, plans.length, __PT.plans.length]; out.realWrites = __realWrites; return out; });
  console.log('PLAY', JSON.stringify(r));
  await load('?play'); console.log('RELOAD fresh', await page.evaluate(() => [locations.some(l => l.name === 'Playground test'), locations.length]));
  await load(''); console.log('NORMAL', await page.evaluate(() => [currentUser && currentUser.email, __realOpts]));
  console.log('ERRORS', errs); await browser.close();
})();
