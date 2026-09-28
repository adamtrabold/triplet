// p8 revision: the real-tap haptic label on EVERY mark toggle -- popup star, popup Mark Visited, add-form STAR.
// Per target and path (ios / android / ios-reduced): a CDP touch tap -> exactly 1 switch toggle (iOS) or 1 vibrate with the right rhythm (Android),
// 1 action, 0 label/switch clicks reaching document, focus never on the switch, state flips; keyboard (Space/Enter) -> action but 0 ticks;
// N8-a: a MOUSE click leaves focus on the (re-rendered) button; a11y tree (CDP): no checkbox/switch anywhere, names/states unchanged. env PROTO (abs), OUT (abs).
const { launch, openProto } = require('./lib'); const fs = require('fs');
const TARGETS = { star: ['.leaflet-popup .popup-star-tap', '.leaflet-popup .popup-star'], visited: ['.leaflet-popup .popup-visited-tap', '.leaflet-popup .popup-visited'], formStar: ['#addForm .form-star-tap', '#starInput'] };
(async () => { const b = await launch(); const out = {};
  for (const path of ['ios', 'android', 'ios-reduced']) {
    const { ctx, page } = await openProto(b, { dsf: 1, file: require('./lib').FILE, reduced: path === 'ios-reduced' }); const cdp = await ctx.newCDPSession(page);
    await page.evaluate(path => { window.__ev = { vib: [], sw: 0, docClicks: 0, onSwitch: 0, toggles: 0 };
      if (path === 'android') Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: p => { __ev.vib.push(JSON.stringify(p)); return true; } });
      else Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: undefined });
      document.addEventListener('change', e => { if (e.target.matches('input[switch]')) __ev.sw++; }, true);
      const cnt = e => { if (e.target.closest && (e.target.closest('.popup-star-tap, .popup-visited-tap, .form-star-tap') || e.target.matches('input[switch]'))) __ev.docClicks++; };
      document.addEventListener('click', cnt, true); document.addEventListener('click', cnt, false);
      const o = toggleLocationFlag; toggleLocationFlag = (...a) => { __ev.toggles++; return o(...a); };
      const f0 = setAddFormStarred; setAddFormStarred = on => { __ev.toggles++; return f0(on); };
      (function f() { if (document.activeElement && document.activeElement.matches('input[switch]')) __ev.onSwitch++; requestAnimationFrame(f); })(); }, path);
    const openPop = () => page.evaluate(async () => { const loc = locations[0]; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI(); markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 400)); });
    const openForm = () => page.evaluate(async () => { map.closePopup(); document.getElementById('floatingAddBtn').click(); await new Promise(r => setTimeout(r, 300)); });
    const state = (k) => page.evaluate(sel => { const e = document.querySelector(sel); return e && e.getAttribute('aria-pressed'); }, TARGETS[k][1]);
    const reset = () => page.evaluate(() => { __ev.vib = []; __ev.sw = 0; __ev.docClicks = 0; __ev.toggles = 0; });
    const tap = async (x, y) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await page.waitForTimeout(40); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(1100); };
    const res = {};
    for (const k of Object.keys(TARGETS)) { if (k === 'formStar') await openForm(); else await openPop();
      const geo = await page.evaluate(([t, bsel]) => { const a = document.querySelector(t).getBoundingClientRect(), bb = document.querySelector(bsel).getBoundingClientRect(); const x = a.x + a.width / 2, y = a.y + a.height / 2;
        const hit = document.elementFromPoint(x, y); return { x, y, label: [a.x, a.y, a.width, a.height].map(v => +v.toFixed(2)), button: [bb.x, bb.y, bb.width, bb.height].map(v => +v.toFixed(2)), hitIsLabel: hit === document.querySelector(t), labelAriaHidden: document.querySelector(t).getAttribute('aria-hidden'), labelFor: document.querySelector(t).htmlFor }; }, TARGETS[k]);
      const r = { geo };
      for (const step of ['on', 'off']) { await reset(); const before = await state(k);
        const p = await page.evaluate(([t]) => { const a = document.querySelector(t).getBoundingClientRect(); return [a.x + a.width / 2, a.y + a.height / 2]; }, TARGETS[k]);
        await tap(p[0], p[1]); const ev = await page.evaluate(() => ({ ...__ev, active: document.activeElement.tagName + '.' + document.activeElement.className }));
        r[step] = { ...ev, before, after: await state(k) }; }
      // keyboard: focus the button, Space then Enter -> two actions, no tick
      await reset(); await page.evaluate(sel => document.querySelector(sel).focus(), TARGETS[k][1]); await page.keyboard.press('Space'); await page.waitForTimeout(900);
      await page.evaluate(sel => { const e = document.querySelector(sel); if (e) e.focus(); }, TARGETS[k][1]); await page.keyboard.press('Enter'); await page.waitForTimeout(900);
      r.keyboard = await page.evaluate(() => ({ sw: __ev.sw, vib: __ev.vib.length, toggles: __ev.toggles, docClicks: __ev.docClicks }));
      // N8-a mouse
      await reset(); const p = await page.evaluate(([t]) => { const a = document.querySelector(t).getBoundingClientRect(); return [a.x + a.width / 2, a.y + a.height / 2]; }, TARGETS[k]);
      await page.mouse.click(p[0], p[1]); await page.waitForTimeout(900);
      r.n8a = await page.evaluate(sel => ({ activeIsButton: document.activeElement === document.querySelector(sel), toggles: __ev.toggles, sw: __ev.sw }), TARGETS[k][1]);
      res[k] = r; }
    // a11y tree over the whole page (popup open + add form open)
    await openPop(); await page.evaluate(() => { document.getElementById('addForm').classList.add('show'); document.getElementById('controls').classList.add('show'); });
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const role = n => n.role && n.role.value, name = n => n.name && n.name.value, prop = (n, p) => { const x = (n.properties || []).find(q => q.name === p); return x && x.value.value; };
    res.ax = { checkboxesOrSwitches: nodes.filter(n => !n.ignored && ['checkbox', 'switch'].includes(role(n))).length,
      labelsExposed: nodes.filter(n => !n.ignored && role(n) === 'LabelText').length,
      buttons: nodes.filter(n => !n.ignored && role(n) === 'button' && ['Star', 'Visited', 'Mark Visited'].includes(name(n))).map(n => name(n) + '/' + prop(n, 'pressed')) };
    res.onSwitchFramesTotal = await page.evaluate(() => __ev.onSwitch);
    out[path] = res; await ctx.close(); }
  console.log(JSON.stringify(out, null, 1)); fs.writeFileSync(require('./lib').outPath('haptic-tap.json'), JSON.stringify(out, null, 1));
  const bad = []; for (const [path, r] of Object.entries(out)) { for (const k of ['star', 'visited', 'formStar']) { const x = r[k];
      for (const st of ['on', 'off']) { const s = x[st]; if (s.toggles !== 1 || s.docClicks !== 0 || s.onSwitch !== 0 || s.before === s.after) bad.push(`${path}/${k}/${st}`); if ((path === 'android') !== (s.vib.length === 1)) bad.push(`${path}/${k}/${st}/vib`); }
      if (x.keyboard.sw !== 0 || x.keyboard.vib !== 0 || x.keyboard.docClicks !== 0) bad.push(`${path}/${k}/keyboard`); if (!x.n8a.activeIsButton || x.n8a.toggles !== 1) bad.push(`${path}/${k}/n8a`); }
    if (r.ax.checkboxesOrSwitches !== 0 || r.onSwitchFramesTotal !== 0) bad.push(`${path}/ax`); }
  console.log(bad.length ? 'FAIL ' + bad.join(' | ') : 'ALL PASS'); await b.close(); process.exitCode = bad.length ? 1 : 0; })();
