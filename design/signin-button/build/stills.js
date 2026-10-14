// Build stills for the sign-in badge: every state the handoff names, in the real index.html
// (signin-lib.js stub, offline: no map tiles). Writes <state>-<1x|3x>.png next to this file.
//   node design/signin-button/build/stills.js     (FILE=... for another build, OUT=... for another dir)
const path = require('path');
const L = require('../signin-lib.js');
const OUT = process.env.OUT || __dirname;
const URL = 'https://triplet.test/index.html';
const CROP = w => ({ x: w - 190, y: 0, width: 190, height: 96 });   // the top-right corner: badge + +

(async () => {
  const b = await L.launch();
  for (const dsf of [1, 3]) {
    const tag = `${dsf}x`;
    const open = async (w, h, signedIn, extra = {}) => {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, ...extra });
      const page = await ctx.newPage();
      if (signedIn) await page.addInitScript(`localStorage.setItem('${L.KEY}','{}')`);
      await L.route(page); await page.goto(URL); await L.ready(page);
      if (signedIn) await page.waitForFunction(() => accountBadge === 'account');
      return page;
    };
    const shot = (page, name, clip) => page.screenshot({ path: path.join(OUT, `${name}-${tag}.png`), ...(clip ? { clip } : {}) });
    const frame = () => new Promise(r => setTimeout(r, 60));

    // ---- signed out, 390 ----
    let page = await open(390, 844, false);
    await shot(page, 'signed-out-rest', CROP(390));
    await shot(page, 'signed-out-screen');
    const bb = await page.locator('#accountBtn').boundingBox();
    await page.mouse.move(bb.x + 25, bb.y + 25); await page.mouse.down(); await frame();
    await shot(page, 'signed-out-pressed', CROP(390));
    await page.mouse.move(bb.x - 200, bb.y + 400); await page.mouse.up();   // slide off: cancels
    await page.focus('#floatingAddBtn'); await page.keyboard.press('Shift+Tab');
    for (let i = 0; i < 60 && await page.evaluate(() => document.activeElement.id) !== 'accountBtn'; i++) await page.keyboard.press('Tab');
    await frame(); await shot(page, 'signed-out-focus', CROP(390));
    // the sheet: rest, busy, error
    await page.keyboard.press('Enter'); await frame();
    await shot(page, 'sheet-rest');
    await page.fill('#authEmailInput', 'you@example.com'); await page.fill('#authPasswordInput', 'xxxxxxxxxx');
    await page.evaluate(() => { window.__signinMode = 'wrong'; window.__signinDelay = 2000; });
    await page.click('#loginBtn'); await frame();
    await shot(page, 'sheet-busy');
    await page.waitForFunction(() => !loginInFlight); await frame();
    await shot(page, 'sheet-error-wrong');
    await page.evaluate(() => { window.__signinMode = 'offline'; window.__signinDelay = 50; });
    await page.fill('#authPasswordInput', 'xxxxxxxxxx'); await page.click('#loginBtn');
    await page.waitForFunction(() => !loginInFlight && authError.textContent.startsWith('Can')); await frame();
    await shot(page, 'sheet-error-offline');
    // sign in for real -> arrival frames (the Strike paused at the handoff's keys)
    await page.evaluate(() => { window.__signinMode = 'ok'; window.__signinDelay = 100; });
    await Promise.all([page.waitForNavigation(), page.click('#loginBtn')]);
    await page.waitForFunction(() => accountBadge === 'signin' && !PLAYGROUND && badgeMotion && badgeMotion.kind === 'hold');
    await frame(); await shot(page, 'arrival-0-hold', CROP(390));
    await page.waitForFunction(() => badgeMotion && badgeMotion.kind === 'strike', null, { polling: 'raf', timeout: 10000 });
    await page.evaluate(() => badgeMotion.anim.pause());
    for (const ms of [60, 130, 250, 340]) {
      await page.evaluate(t => { badgeMotion.anim.currentTime = t; }, ms); await frame();
      await shot(page, `arrival-${ms}ms`, CROP(390));
    }
    await page.evaluate(() => badgeMotion.anim.play());
    await page.waitForFunction(() => !badgeMotion && accountBadge === 'account'); await frame();
    await shot(page, 'arrival-end-signed-in', CROP(390));
    await shot(page, 'signed-in-screen');
    await page.click('#accountBtn'); await frame();
    await shot(page, 'signed-in-dropdown', { x: 390 - 340, y: 0, width: 340, height: 230 });
    await page.evaluate(() => { window.__signoutDelay = 1500; });
    await page.click('#dropdownLogoutBtn'); await frame();
    await shot(page, 'signing-out', { x: 390 - 340, y: 0, width: 340, height: 230 });
    await page.waitForFunction(() => badgeMotion && badgeMotion.kind === 'dry', null, { polling: 'raf', timeout: 10000 });
    await page.evaluate(() => badgeMotion.anim.pause());
    for (const ms of [0, 150, 300, 450, 530]) {
      await page.evaluate(t => { badgeMotion.anim.currentTime = t; }, ms); await frame();
      await shot(page, `signout-${ms}ms`, CROP(390));
    }
    await Promise.all([page.waitForNavigation(), page.evaluate(() => badgeMotion.anim.play())]);
    await L.ready(page); await frame();
    await shot(page, 'signout-end-playground', CROP(390));
    await page.context().close();

    // signed in, keyboard focus ring
    page = await open(390, 844, true);
    await page.focus('#floatingAddBtn'); await page.keyboard.press('Shift+Tab');
    for (let i = 0; i < 60 && await page.evaluate(() => document.activeElement.id) !== 'accountBtn'; i++) await page.keyboard.press('Tab');
    await frame(); await shot(page, 'signed-in-focus', CROP(390));
    await page.context().close();

    // 320px and desktop, both states
    for (const [w, h, name] of [[320, 640, '320'], [1280, 800, 'desktop']]) {
      for (const signedIn of [false, true]) {
        page = await open(w, h, signedIn);
        await shot(page, `${name}-${signedIn ? 'signed-in' : 'signed-out'}`);
        if (!signedIn && name === '320') { await page.click('#accountBtn'); await frame(); await shot(page, '320-sheet'); }
        if (signedIn && name === '320') { await page.click('#accountBtn'); await frame(); await shot(page, '320-dropdown'); }
        await page.context().close();
      }
    }
    console.log('stills', tag, 'done');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
