// The sign-in badge's rules (design/signin-button/handoff.md, "checks that cover this"), in the real
// index.html with an auth stub (signin-lib.js). Prints PASS/FAIL per check and a summary last line.
//   node design/signin-button/signin-test.js        (FILE=path/to/index.html to test another build)
const L = require('./signin-lib.js');
const URL = 'https://triplet.test/index.html';
const results = [];
const check = (name, ok, info) => { results.push([name, !!ok]); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info !== undefined ? '  ' + JSON.stringify(info) : ''}`); };
const state = page => page.evaluate(() => ({ pg: PLAYGROUND, badge: accountBadge, label: accountBtn.getAttribute('aria-label'),
  popup: accountBtn.getAttribute('aria-haspopup'), expanded: accountBtn.getAttribute('aria-expanded'), rec: window.__badge,
  hop: (() => { try { return sessionStorage.getItem('triplet.authHop'); } catch (e) { return 'x'; } })() }));

(async () => {
  const b = await L.launch();
  const newPage = async (opts = {}, init) => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, ...opts });
    const page = await ctx.newPage(); page.__errs = []; page.on('pageerror', e => page.__errs.push(e.message));
    await page.addInitScript(L.RECORDER); if (init) await page.addInitScript(init);
    await L.route(page); return page;
  };
  const signIn = async (page, email = 'a@b.c', pw = 'pw') => { await page.click('#accountBtn'); await page.fill('#authEmailInput', email); await page.fill('#authPasswordInput', pw); };

  // 1. The playground: the badge from the first paint, Sign in, a tap opens the sheet (no dropdown).
  let page = await newPage();
  await page.goto(URL); await L.ready(page);
  let s = await state(page);
  check('playground: sign-in badge, labelled, no dropdown role', s.pg && s.badge === 'signin' && s.label === 'Sign in' && s.popup === 'dialog' && s.expanded === null, s);
  await page.click('#accountBtn');
  s = await page.evaluate(() => ({ modal: authModal.classList.contains('show'), dropdown: accountDropdown.classList.contains('show'), focus: document.activeElement.id,
    line: authModalLine.textContent, hidden: authModalLine.hidden, sec: cancelAuthBtn.textContent, title: authModalTitle.textContent, role: authModalContent.getAttribute('role') }));
  check('tap opens the sheet (playground form), focus on Email', s.modal && !s.dropdown && s.focus === 'authEmailInput' && s.sec === 'Keep playing' && /won’t be kept/.test(s.line) && s.title === 'Sign in' && s.role === 'dialog', s);
  // Tab stays inside
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab');
  check('Tab stays inside the sheet', await page.evaluate(() => authModalContent.contains(document.activeElement)));
  await page.keyboard.press('Escape');
  s = await page.evaluate(() => ({ modal: authModal.classList.contains('show'), focus: document.activeElement.id }));
  check('Esc closes the sheet, focus back on the badge', !s.modal && s.focus === 'accountBtn', s);
  // empty fields
  await page.click('#accountBtn'); await page.click('#loginBtn');
  s = await page.evaluate(() => ({ err: authError.textContent, focus: document.activeElement.id, calls: __signinCalls }));
  check('empty fields: message, focus on the empty field, no request', s.err === 'Enter your email and password.' && s.focus === 'authEmailInput' && s.calls === 0, s);
  // wrong password + double submit + busy look
  await page.evaluate(() => { window.__signinMode = 'wrong'; window.__signinDelay = 600; });
  await page.fill('#authEmailInput', 'me@x.y'); await page.fill('#authPasswordInput', 'nope');
  await page.click('#loginBtn'); await page.evaluate(() => loginBtn.click());   // a double tap (the second on a disabled button)
  await page.keyboard.press('Enter');
  s = await page.evaluate(() => ({ txt: loginBtn.textContent, dis: loginBtn.disabled, sec: cancelAuthBtn.disabled, ro: authEmailInput.readOnly && authPasswordInput.readOnly, busy: authModalContent.classList.contains('busy'), op: getComputedStyle(loginBtn).opacity }));
  check('busy: "Signing in…", both buttons off, fields read-only, --state-off-alpha', s.txt === 'Signing in…' && s.dis && s.sec && s.ro && s.busy && s.op === '0.4', s);
  await page.keyboard.press('Escape'); await page.mouse.click(195, 60);   // Esc and the scrim do nothing while busy
  check('busy: Esc and the scrim do nothing', await page.evaluate(() => authModal.classList.contains('show')));
  await page.waitForTimeout(800);
  s = await page.evaluate(() => ({ calls: __signinCalls, err: authError.textContent, email: authEmailInput.value, pw: authPasswordInput.value, focus: document.activeElement.id, txt: loginBtn.textContent, live: authError.getAttribute('aria-live') }));
  check('double submit sends one request', s.calls === 1, s);
  check('wrong password: plain message, email kept, password cleared and focused', s.err === 'That email and password don’t match.' && s.email === 'me@x.y' && s.pw === '' && s.focus === 'authPasswordInput' && s.txt === 'Sign in' && s.live === 'polite', s);
  for (const [mode, msg] of [['offline', 'Can’t reach the sign-in server. Check your connection.'], ['busy429', 'Too many tries. Wait a minute, then try again.'], ['other', 'Sign-in didn’t work. Try again.']]) {
    await page.evaluate(m => { window.__signinMode = m; window.__signinDelay = 50; }, mode);
    await page.fill('#authPasswordInput', 'pw'); await page.click('#loginBtn'); await page.waitForTimeout(250);
    s = await page.evaluate(() => ({ err: authError.textContent, email: authEmailInput.value, pw: authPasswordInput.value, hop: sessionStorage.getItem('triplet.authHop') }));
    check(`${mode}: message, both fields kept, no marker left`, s.err === msg && s.email === 'me@x.y' && s.pw === 'pw' && s.hop === null, s);
  }
  // storage blocked: success but the key isn't kept -> message, no reload
  await page.evaluate(() => { window.__signinMode = 'storage'; window.__navMark = 1; });
  await page.click('#loginBtn'); await page.waitForTimeout(800);
  s = await page.evaluate(() => ({ still: window.__navMark === 1, err: authError.textContent, pg: PLAYGROUND, hop: sessionStorage.getItem('triplet.authHop') }));
  check('storage blocked: the message, no reload loop', s.still && /isn’t letting Triplet keep you signed in/.test(s.err) && s.hop === null, s);
  await page.click('#cancelAuthBtn');
  check('Keep playing closes, fields cleared', await page.evaluate(() => !authModal.classList.contains('show') && !authEmailInput.value));

  // 2. Sign in from the playground with a tag open -> reload -> the Strike once, the view and the tag back.
  const tagId = await page.evaluate(() => { const id = document.querySelectorAll('#locationsList .location-card[data-id]')[4].getAttribute('data-id'); highlightMarker(id); return id; });
  await page.waitForTimeout(1500);
  const before = await page.evaluate(() => ({ tag: openTagKey(), z: map.getZoom(), c: map.getCenter() }));
  await page.evaluate(() => { window.__signinMode = 'ok'; window.__signinDelay = 300; });
  await signIn(page);
  await Promise.all([page.waitForNavigation(), page.click('#loginBtn')]);
  await L.ready(page); await page.waitForTimeout(1200);
  s = await state(page);
  const after = await page.evaluate(() => ({ tag: openTagKey(), z: map.getZoom(), c: map.getCenter() }));
  check('sign in -> real mode, the Strike played once, ends "Account"', !s.pg && s.badge === 'account' && s.label === 'Account' && s.rec.ink > 5 && s.rec.labels.filter(l => l === 'Account').length === 1, { ink: s.rec.ink, labels: s.rec.labels });
  check('the hop marker is removed at boot', s.hop === null, s.hop);
  check('land where you were: centre, zoom, open tag', before.tag === tagId && after.tag === tagId && after.z === before.z && Math.abs(after.c.lat - before.c.lat) < 1e-3 && Math.abs(after.c.lng - before.c.lng) < 1e-3, { before, after });
  check('no page errors (sign-in)', !page.__errs.length, page.__errs);
  // 3. a plain reload: no Strike
  await page.reload(); await L.ready(page); await page.waitForTimeout(800);
  s = await state(page);
  check('reload: no Strike, account badge', s.badge === 'account' && s.rec.ink === 0, { ink: s.rec.ink, labels: s.rec.labels });
  // the real mode badge is hidden until auth confirms (never the paper badge first)
  check('reload: the slot never showed the sign-in badge', !s.rec.labels.includes('Sign in'), s.rec.labels);
  // 4. Sign out: "Signing out..." keeps the dropdown open, then the dry-up, then the playground.
  await page.evaluate(id => { window.__signoutDelay = 400; highlightMarker(id); }, tagId); await page.waitForTimeout(1500);   // a reload doesn't keep the tag: open it again
  await page.click('#accountBtn');
  check('signed in: aria-expanded follows the dropdown', await page.evaluate(() => accountBtn.getAttribute('aria-expanded') === 'true' && accountBtn.getAttribute('aria-haspopup') === 'true'));
  await page.click('#dropdownLogoutBtn'); await page.waitForTimeout(100);
  await page.evaluate(() => document.body.click()); await page.waitForTimeout(50);   // a tap elsewhere
  s = await page.evaluate(() => ({ txt: dropdownLogoutBtn.textContent, dis: dropdownLogoutBtn.disabled, open: accountDropdown.classList.contains('show'), active: accountBtn.classList.contains('active') }));
  check('signing out: dropdown stays open, "Signing out…" disabled, badge open', s.txt === 'Signing out…' && s.dis && s.open && s.active, s);
  const t0 = Date.now();
  await page.waitForNavigation(); const dt = Date.now() - t0;
  await L.ready(page);
  s = await state(page);
  check('sign out -> the dry-up then the playground (~690ms after success)', s.pg && s.badge === 'signin' && dt > 600, { dt, badge: s.badge });
  check('after sign out the tag is reopened in the playground', await page.evaluate(() => openTagKey()) === tagId);
  await page.close();

  // 5. sign-out error: stays signed in, item back, banner
  page = await newPage({}, `localStorage.setItem('${L.KEY}','{}')`);
  await page.goto(URL); await L.ready(page);
  await page.evaluate(() => { window.__signoutMode = 'error'; });
  await page.click('#accountBtn'); await page.click('#dropdownLogoutBtn'); await page.waitForTimeout(500);
  s = await page.evaluate(() => ({ txt: dropdownLogoutBtn.textContent, dis: dropdownLogoutBtn.disabled, open: accountDropdown.classList.contains('show'), banner: errorText.textContent, user: !!currentUser }));
  check('sign-out error: still signed in, "Sign out" back, dropdown open, banner', s.txt === 'Sign out' && !s.dis && s.open && s.banner === 'Couldn’t sign out. Try again.' && s.user, s);
  // a SIGNED_OUT this tab didn't start reloads at once (no dry-up)
  await page.evaluate(() => { window.__signoutMode = 'ok'; window.__signoutDelay = 0; });
  const t1 = Date.now();
  await Promise.all([page.waitForNavigation(), page.evaluate(() => realSupabaseClient.auth.signOut())]);
  check('a sign-out from elsewhere reloads at once', Date.now() - t1 < 500, Date.now() - t1);
  await page.close();

  // 6. Reduce Motion: no Strike, signed in; no dry-up
  page = await newPage({ reducedMotion: 'reduce' });
  await page.goto(URL); await L.ready(page);
  await signIn(page);
  await Promise.all([page.waitForNavigation(), page.click('#loginBtn')]);
  await L.ready(page); await page.waitForTimeout(800);
  s = await state(page);
  check('Reduce Motion: no Strike, signed in', s.badge === 'account' && s.rec.ink === 0, { ink: s.rec.ink });
  await page.click('#accountBtn');
  await Promise.all([page.waitForNavigation(), page.click('#dropdownLogoutBtn')]);
  s = await state(page);
  check('Reduce Motion: sign out without the dry-up', s.pg, s);
  await page.close();

  // 7. Another tab's sign-in: this playground reloads with no marker -> no Strike
  page = await newPage();
  await page.goto(URL); await L.ready(page);
  await Promise.all([page.waitForNavigation(), page.evaluate(() => realSupabaseClient.auth.signInWithPassword({}))]);
  await L.ready(page); await page.waitForTimeout(800);
  s = await state(page);
  check('another tab signed in: real mode, no Strike', !s.pg && s.badge === 'account' && s.rec.ink === 0, { ink: s.rec.ink });
  await page.close();

  // 8. A tap during the arrival finishes it at once and opens the dropdown
  page = await newPage();
  await page.goto(URL); await L.ready(page);
  await signIn(page);
  await Promise.all([page.waitForNavigation(), page.click('#loginBtn')]);
  await page.waitForFunction(() => accountBadge === 'signin' && !PLAYGROUND && badgeMotion);
  await page.click('#accountBtn');
  s = await page.evaluate(() => ({ badge: accountBadge, open: accountDropdown.classList.contains('show'), motion: !!badgeMotion, label: accountBtn.getAttribute('aria-label') }));
  check('tap during the arrival: signed in at once, dropdown open', s.badge === 'account' && s.open && !s.motion && s.label === 'Account', s);
  await page.close();

  // 9. Signed-out real mode (session didn't confirm): the badge, the sheet without the line, in-place Strike
  page = await newPage({}, `localStorage.setItem('${L.KEY}','{}'); window.__expired = true;`);
  await page.goto(URL); await L.ready(page);
  s = await state(page);
  check('signed-out real mode: the sign-in badge', !s.pg && s.badge === 'signin', s);
  await page.click('#accountBtn');
  s = await page.evaluate(() => ({ hidden: authModalLine.hidden, sec: cancelAuthBtn.textContent }));
  check('real-app sheet from the badge: no line, Cancel', s.hidden && s.sec === 'Cancel', s);
  await page.fill('#authEmailInput', 'a@b.c'); await page.fill('#authPasswordInput', 'pw'); await page.click('#loginBtn');
  await page.waitForTimeout(1200);
  s = await state(page);
  check('in place: no reload, sheet closed, the Strike, Account', s.badge === 'account' && s.rec.ink > 5 && await page.evaluate(() => !authModal.classList.contains('show') && currentUser && currentUser.email === 'adamtrabold@gmail.com'), { ink: s.rec.ink });
  // What the slot actually shows (not just the recorded state): the account glyph, no Strike frame left.
  const look = p => p.evaluate(() => { const svg = accountBtn.querySelector('svg'), cs = getComputedStyle(accountBtn);
    return { glyph: !!svg && svg.getAttribute('viewBox') === '0 0 24 24' && !!svg.querySelector('circle'), clip: !!accountBtn.querySelector('clipPath'),
      signinCls: accountBtn.classList.contains('signin'), mask: (cs.maskImage || cs.webkitMaskImage) !== 'none', bg: cs.backgroundColor, label: accountBtn.getAttribute('aria-label'),
      transform: cs.transform }; });
  const isAccount = l => l.glyph && !l.clip && !l.signinCls && l.mask && l.label === 'Account';
  let lk = await look(page);
  check('in place: the slot shows the account badge (glyph, no ink frame, mask on)', isAccount(lk) && lk.bg === 'rgb(18, 41, 63)', lk);
  await page.click('#accountBtn'); await page.waitForTimeout(250);
  lk = await look(page);
  check('in place: the dropdown opens with the orange open look', isAccount(lk) && lk.bg === 'rgb(238, 116, 52)' && await page.evaluate(() => accountDropdown.classList.contains('show') && accountBtn.getAttribute('aria-expanded') === 'true'), lk);
  check('no page errors', !page.__errs.length, page.__errs);
  await page.close();

  // 9b. A tap during the in-place Strike: signed in at once, the account badge, the dropdown open.
  page = await newPage({}, `localStorage.setItem('${L.KEY}','{}'); window.__expired = true;`);
  await page.goto(URL); await L.ready(page);
  await page.click('#accountBtn');
  await page.fill('#authEmailInput', 'a@b.c'); await page.fill('#authPasswordInput', 'pw'); await page.click('#loginBtn');
  await page.waitForFunction(() => badgeMotion && badgeMotion.kind === 'strike' && badgeMotion.anim.currentTime > 60, null, { polling: 'raf', timeout: 5000 });
  await page.evaluate(() => accountBtn.click());
  await page.waitForTimeout(250);
  lk = await look(page);
  check('tap during the in-place Strike: account badge, orange, dropdown open, no scale left', isAccount(lk) && lk.bg === 'rgb(238, 116, 52)' && lk.transform === 'none' && await page.evaluate(() => !badgeMotion && accountDropdown.classList.contains('show')), lk);
  check('no page errors (9b)', !page.__errs.length, page.__errs);
  await page.close();

  // 9c. The hop view restores a tag whose pin is clustered at the saved zoom (the normal open path steps in)
  page = await newPage({}, `localStorage.setItem('${L.KEY}','{}')`);
  await page.goto(URL); await L.ready(page);
  s = await page.evaluate(async () => {
    const id = document.querySelectorAll('#locationsList .location-card[data-id]')[4].getAttribute('data-id'), loc = locations.find(l => l.id === id);
    restoreHopView({ lat: loc.lat, lng: loc.lng, zoom: 11, tag: id, at: null });
    await new Promise(r => setTimeout(r, 1500));
    return { id, tag: openTagKey(), zoom: map.getZoom() };
  });
  check('restore: a pin with a neighbour within a cluster cell at the saved zoom reopens, stepped in to SOLO_MIN_ZOOM', s.tag === s.id && s.zoom >= 14, s);
  // 9d. ... and a pin that is on its own at zoom 13 keeps zoom 13 (land on the same spot)
  s = await page.evaluate(async () => {
    map.closePopup();
    let pick = null;
    // a pin with no other listed place within one cluster cell at zoom 13 (so no pan can cluster it)
    const cell = clusterCellPxForZoom(13), P = l => map.project([l.lat, l.lng], 13);
    for (const loc of visibleLocations()) {
      const p = P(loc);
      if (!visibleLocations().some(o => o.id !== loc.id && Math.abs(P(o).x - p.x) < cell && Math.abs(P(o).y - p.y) < cell)) { pick = loc; break; }
    }
    if (!pick) return { none: true };
    map.setView([0, 0], 3, { animate: false });
    restoreHopView({ lat: pick.lat, lng: pick.lng, zoom: 13, tag: pick.id, at: null });
    await new Promise(r => setTimeout(r, 1500));
    return { id: pick.id, tag: openTagKey(), zoom: map.getZoom() };
  });
  check('restore: a pin solo at zoom 13 keeps zoom 13 and its tag opens', !s.none && s.tag === s.id && s.zoom === 13, s);
  await page.close();

  // 10. Keyboard focus ring follows the scallop, both states
  page = await newPage();
  await page.goto(URL); await L.ready(page);
  await page.focus('#floatingAddBtn'); await page.keyboard.press('Shift+Tab');
  let tries = 0; while (await page.evaluate(() => document.activeElement.id) !== 'accountBtn' && tries++ < 60) await page.keyboard.press('Tab');
  s = await page.evaluate(() => ({ ring: getComputedStyle(accountFocus).display, r1: accountFocus.getBoundingClientRect().right, r2: accountBtn.getBoundingClientRect().right }));
  check('focus-visible: #accountFocus shows over the badge', s.ring === 'block' && Math.abs(s.r1 - s.r2) < 0.5, s);
  await page.keyboard.press('Enter');
  check('Enter opens the sheet', await page.evaluate(() => authModal.classList.contains('show')));
  await page.close();

  await b.close();
  const fails = results.filter(r => !r[1]);
  console.log(`signin-test: ${results.length - fails.length}/${results.length} pass${fails.length ? ' -- FAIL: ' + fails.map(f => f[0]).join('; ') : ''}`);
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
