// Shared page setup for the sign-in badge checks (signin-test.js, stills.js): the real index.html
// served offline with the gesture-harness stub, plus an auth stub where the mode follows the stored
// session (no key = the playground, as in the real app) and sign-in outcomes are scripted.
//   window.__signinMode (set with page.addInitScript or evaluate before the submit):
//     'ok' (default) | 'wrong' | 'offline' | 'busy429' | 'other' | 'storage' (success, key not kept) | 'hang' (never answers)
//   window.__signinCalls: signInWithPassword calls in this page.
//   window.__signoutMode: 'ok' (default) | 'error' | 'hang'
//   window.__expired (init script): a stored key whose session doesn't confirm (signed-out real mode)
// FILE (env) = the index.html under test (default: this checkout's).
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const H = path.resolve(__dirname, '../gesture-harness');
const FILE = process.env.FILE || path.resolve(__dirname, '../../index.html');
const KEY = 'sb-jgvckilmltimabfdvaly-auth-token';
const STUB = fs.readFileSync(H + '/stub.js', 'utf8').replace(/try \{ localStorage\.setItem\('sb-[^']+', '\{\}'\); \} catch \(e\) \{\}/, '') + `;(function(){
const cc=window.supabase.createClient;window.__signinCalls=0;window.__realWrites=[];
window.supabase.createClient=function(){const c=cc.apply(this,arguments);const f=c.from.bind(c);
c.from=t=>{const b=f(t);['insert','update','upsert','delete'].forEach(m=>{const o=b[m];b[m]=function(){window.__realWrites.push(t+'.'+m);return o.apply(this,arguments)}});return b};
let signedIn=false;try{signedIn=!!localStorage.getItem('${KEY}')&&!window.__expired}catch(e){}
const user={email:'adamtrabold@gmail.com'};const cbs=[];
c.auth.getSession=async()=>({data:{session:signedIn?{user}:null}});
c.auth.onAuthStateChange=(cb)=>{cbs.push(cb);setTimeout(()=>cb('INITIAL_SESSION',signedIn?{user}:null),0);return{data:{subscription:{unsubscribe(){}}}}};
const emit=(ev,s)=>setTimeout(()=>cbs.forEach(cb=>cb(ev,s)),0);
c.auth.signInWithPassword=async()=>{window.__signinCalls++;const m=window.__signinMode||'ok';await new Promise(r=>setTimeout(r,window.__signinDelay||300));
 if(m==='hang')return new Promise(()=>{});
 if(m==='wrong')return{data:{},error:{name:'AuthApiError',status:400,code:'invalid_credentials',message:'Invalid login credentials'}};
 if(m==='offline')return{data:{},error:{name:'AuthRetryableFetchError',status:0,message:'Failed to fetch'}};
 if(m==='busy429')return{data:{},error:{name:'AuthApiError',status:429,message:'Request rate limit reached'}};
 if(m==='other')return{data:{},error:{name:'AuthApiError',status:500,message:'Database error querying schema'}};
 if(m!=='storage')localStorage.setItem('${KEY}','{}');
 emit('SIGNED_IN',{user});return{data:{user,session:{user}},error:null}};
c.auth.signOut=async()=>{const m=window.__signoutMode||'ok';await new Promise(r=>setTimeout(r,window.__signoutDelay||200));
 if(m==='hang')return new Promise(()=>{});
 if(m==='error')return{error:{message:'network'}};
 localStorage.removeItem('${KEY}');emit('SIGNED_OUT',null);return{error:null}};
return c}})();`;

async function launch() {
  const d = fs.readdirSync('/opt/pw-browsers').filter(x => /^chromium-\d+$/.test(x)).sort().pop();
  return chromium.launch({ executablePath: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
}
async function route(page) {
  const html = fs.readFileSync(FILE, 'utf8');
  await page.route('**/*', r => { const u = r.request().url();
    if (u.startsWith('https://triplet.test/')) return r.fulfill({ contentType: 'text/html', body: html });
    if (u.includes('leaflet.js')) return r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(H + '/vendor/leaflet.js') });
    if (u.includes('leaflet.css')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/leaflet.css') });
    if (u.includes('supabase')) return r.fulfill({ contentType: 'application/javascript', body: STUB });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ contentType: 'text/css', body: fs.readFileSync(H + '/vendor/archivo.css') });
    if (u.includes('fonts.gstatic.com')) { const f = H + '/vendor/' + u.split('/').pop(); return fs.existsSync(f) ? r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.fulfill({ status: 404, body: '' }); }
    return r.fulfill({ status: 404, body: '' }); });
}
// Records the badge's life from the first script on: every content change of #accountBtn
// (ink layers = Strike/dry-up frames), its labels, and when it first shows.
const RECORDER = `(() => { window.__badge = { frames: 0, ink: 0, labels: [], shown: null, t0: performance.now() };
  new MutationObserver(ms => { for (const m of ms) { const b = m.target; if (b.id !== 'accountBtn') continue;
      if (m.type === 'childList') { __badge.frames++; if (b.querySelector('clipPath')) __badge.ink++; }
      if (m.type === 'attributes' && m.attributeName === 'aria-label') __badge.labels.push(b.getAttribute('aria-label'));
      if (m.type === 'attributes' && m.attributeName === 'class' && b.classList.contains('show') && __badge.shown == null) __badge.shown = performance.now() - __badge.t0;
    } }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-label', 'class'] }); })();`;
async function ready(page) {
  await page.waitForFunction(() => document.querySelectorAll('#locationsList .location-card[data-id]').length > 5, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}
module.exports = { launch, route, ready, RECORDER, KEY, FILE, H };
