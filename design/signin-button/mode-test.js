// Signed out (no stored session) -> playground; stored session -> real. Playground writes never reach the client;
// Sign in: the playground's badge opens the sheet directly (no menu), a good sign-in stores a session and reloads into real mode.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'); const path = require('path'); const H = path.resolve(__dirname, '../gesture-harness');
const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
const KEY = 'sb-jgvckilmltimabfdvaly-auth-token';
// Stub variant: no stored session unless a sign-in happened; counts writes; sign-in stores the key.
const stub = fs.readFileSync(H + '/stub.js', 'utf8').replace(/try \{ localStorage\.setItem\('sb-[^']+', '\{\}'\); \} catch \(e\) \{\}/, '') + `;(function(){const cc=window.supabase.createClient;window.__realWrites=[];
window.supabase.createClient=function(){const c=cc.apply(this,arguments);const f=c.from.bind(c);
c.from=t=>{const b=f(t);['insert','update','upsert','delete'].forEach(m=>{const o=b[m];b[m]=function(){window.__realWrites.push(t+'.'+m);return o.apply(this,arguments)}});return b};
const signedIn=!!localStorage.getItem('${KEY}');const user={email:'adamtrabold@gmail.com'};
c.auth.getSession=async()=>({data:{session:signedIn?{user}:null}});
c.auth.onAuthStateChange=(cb)=>{setTimeout(()=>cb('INITIAL_SESSION',signedIn?{user}:null),0);window.__authCb=cb;return{data:{subscription:{unsubscribe(){}}}}};
c.auth.signInWithPassword=async()=>{localStorage.setItem('${KEY}','{}');return{data:{user},error:null}};
c.auth.signOut=async()=>{localStorage.removeItem('${KEY}');setTimeout(()=>window.__authCb&&window.__authCb('SIGNED_OUT',null),0);return{error:null}};
return c}})();`;
(async () => {
  const b = await chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  const html = fs.readFileSync(process.env.FILE || path.resolve(__dirname, '../../index.html'), 'utf8');
  await page.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: html });
    if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/vendor/leaflet.js') });
    if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/leaflet.css') });
    if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: stub });
    return r.fulfill({ status: 404, body: '' }); });
  const ready = () => page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length > 5, null, { timeout: 15000 }).then(() => page.waitForTimeout(400));
  await page.goto('https://triplet.test/index.html'); await ready();
  let r = await page.evaluate(async () => { const id = locations.find(l => !l.starred).id; await toggleLocationFlag(id, 'starred');
    return { mode: PLAYGROUND, user: currentUser && currentUser.email, starredLocal: locations.find(l => l.id === id).starred, starredServer: __ROWS.find(l => l.id === id).starred, writes: __realWrites.slice(), badge: accountBtn.getAttribute('aria-label') }; });
  console.log('signed-out', JSON.stringify(r));
  await page.click('#accountBtn');   // the sign-in badge: straight to the sheet
  console.log('modal open', await page.evaluate(() => document.getElementById('authModal').classList.contains('show')));
  await page.fill('#authEmailInput', 'a@b.c'); await page.fill('#authPasswordInput', 'x');
  await Promise.all([page.waitForNavigation(), page.click('#loginBtn')]); await ready();
  await page.waitForFunction(() => accountBadge === 'account');   // the arrival's Strike has landed
  r = await page.evaluate(async () => { const id = locations.find(l => !l.starred).id; await toggleLocationFlag(id, 'starred');
    return { mode: PLAYGROUND, user: currentUser && currentUser.email, writes: __realWrites.slice(), badge: accountBtn.getAttribute('aria-label') }; });
  console.log('signed-in', JSON.stringify(r));
  await page.click('#accountBtn');
  await Promise.all([page.waitForNavigation(), page.click('#dropdownLogoutBtn')]); await ready();
  console.log('after sign out', JSON.stringify(await page.evaluate(() => ({ mode: PLAYGROUND, user: currentUser && currentUser.email }))));
  await page.goto('https://triplet.test/index.html?play'); await ready();
  console.log('?play while signed out', await page.evaluate(() => PLAYGROUND));
  console.log('errors', errs); await b.close();
})();
