// Round 8 haptic: R7-S1 (focus never left on the hidden switch), R7-S2 (0 document-level clicks per tick;
// account dropdown + address autocomplete stay open across a real star and erase), reduced motion still ticks.
const { launch, openProto } = require('./lib'); const fs = require('fs');
const FILE = require('./lib').FILE;
const DRIVER = fs.readFileSync(__dirname + '/star-driver.js', 'utf8').match(/const DRIVER = `([\s\S]*?)`;/)[1];
const IOS = `Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: undefined });
  window.__docClicks = 0; window.__sw = 0; document.addEventListener('change', e => { if (e.target.matches('input[switch]')) __sw++; }, true);
  const cnt = e => { if (e.target.closest && e.target.closest('label') && e.target.closest('label').querySelector('input[switch]')) __docClicks++; };
  document.addEventListener('click', cnt, true); document.addEventListener('click', cnt, false); window.addEventListener('click', cnt, false);`;
(async () => { const b = await launch(); const out = {};
  // 1. focus starting points (iOS path)
  { const { ctx, page } = await openProto(b, { dsf: 1, file: FILE }); await page.addScriptTag({ content: IOS });
    out.focus = await page.evaluate(async () => {
      const res = {}; const inp = () => document.querySelector('body > label input[switch]');
      const watch = () => { let bad = 0, run = true; const f = () => { if (!run) return; if (inp() && document.activeElement === inp()) bad++; requestAnimationFrame(f); }; f(); return () => { run = false; return bad; }; };
      const probe = async (name, focusFn) => { focusFn(); const want = document.activeElement; const d0 = __docClicks, s0 = __sw; const stop = watch();
        starHaptic('ink'); const a1 = document.activeElement; await new Promise(r => setTimeout(r, 40)); starHaptic('erase'); const a2 = document.activeElement; await new Promise(r => setTimeout(r, 150));
        res[name] = { start: want.tagName + (want.className ? '.' + String(want.className).split(' ')[0] : ''), onSwitchAfterTick: a1 === inp() || a2 === inp() || document.activeElement === inp(), onSwitchFrames: stop(),
          focusRestored: document.activeElement === want, docClicksPer3Ticks: __docClicks - d0, switchFlipsPer3Ticks: __sw - s0 }; };
      await probe('fromBody', () => { document.activeElement && document.activeElement.blur(); });
      await probe('fromRow', () => document.querySelector('#locationsList .location-card .delete-btn').focus());
      const loc = locations[0]; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI(); markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 400));
      await probe('fromPopupStar', () => document.querySelector('.leaflet-popup .popup-star').focus());
      return res; });
    await ctx.close(); }
  // 2. open overlays survive a real star + erase stroke (iOS path)
  { const { ctx, page } = await openProto(b, { dsf: 1, file: FILE }); await page.addScriptTag({ content: DRIVER + IOS });
    out.overlays = await page.evaluate(async () => { const clicks = []; 
      const dd = document.getElementById('accountDropdown'), ac = document.getElementById('addressAutocomplete');
      dd.classList.add('show'); ac.innerHTML = '<div class="autocomplete-item">x</div>'; ac.classList.add('show');
      const d0 = __docClicks; await __swipe(0, 0.6, 100, { tail: 700 }); const afterStar = { dropdown: dd.classList.contains('show'), autocomplete: ac.classList.contains('show') };
      await __swipe(0, 0.6, 100, { tail: 900 }); const afterErase = { dropdown: dd.classList.contains('show'), autocomplete: ac.classList.contains('show') };
      const inp = document.querySelector('body > label input[switch]');
      return { afterStar, afterErase, docLevelSwitchClicks: __docClicks - d0, switchExists: !!inp, starred0: locations[0].starred }; });
    await ctx.close(); }
  // 3. reduced motion: still ticks (Android + iOS paths)
  for (const path of ['android', 'ios']) { const { ctx, page } = await openProto(b, { dsf: 1, file: FILE, reduced: true }); await page.addScriptTag({ content: DRIVER });
    out['reduced_' + path] = await page.evaluate(async path => { const calls = [];
      if (path === 'android') Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: p => { calls.push(JSON.stringify(p)); return true; } });
      else { Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: undefined }); HTMLInputElement.prototype.__c = HTMLInputElement.prototype.click;
        document.addEventListener('change', e => { if (e.target.matches('input[switch]')) calls.push('switch'); }, true); }
      await __swipe(0, 0.6, 100, { tail: 700 }); const star = calls.splice(0); await __swipe(0, 0.6, 100, { tail: 900 });
      return { reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, star, erase: calls }; }, path);
    await ctx.close(); }
  console.log(JSON.stringify(out, null, 1)); await require('./haptic-ext')(b, out); fs.writeFileSync(require('./lib').outPath('haptic-overlays.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out.ext, null, 1));
  const f = Object.values(out.focus), bad = [];
  if (!f.every(x => !x.onSwitchAfterTick && x.onSwitchFrames === 0 && x.focusRestored && x.docClicksPer3Ticks === 0 && x.switchFlipsPer3Ticks === 3)) bad.push('focus');
  const o = out.overlays; if (!(o.afterStar.dropdown && o.afterStar.autocomplete && o.afterErase.dropdown && o.afterErase.autocomplete && o.docLevelSwitchClicks === 0 && o.switchExists)) bad.push('overlays');
  if (JSON.stringify(out.reduced_android) !== JSON.stringify({ reducedMotion: true, star: ['10'], erase: ['[6,45,6]'] }) || !out.reduced_ios.reducedMotion || out.reduced_ios.star.length !== 1 || out.reduced_ios.erase.length !== 2) bad.push('reduced haptics');
  console.log(bad.length ? 'FAIL ' + bad.join(' | ') : 'ALL PASS'); await b.close(); process.exitCode = bad.length ? 1 : 0; })();
