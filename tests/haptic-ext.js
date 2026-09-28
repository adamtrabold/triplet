// p8r: real finger taps on the NEW tap labels (popup Mark Visited, add-form STAR) + the popup star, with the account dropdown and
// address autocomplete open: 0 label/switch clicks at document/window, 0 frames of focus on the switch, overlays as on main (direct tap).
const { openProto } = require('./lib');
module.exports = async (b, out) => { out.ext = {};
  for (const [tag, file] of [['main', require('./lib').BASE_FILE], ['proto', require('./lib').FILE]]) for (const k of ['star', 'visited', 'formStar']) {
    const { ctx, page } = await openProto(b, { dsf: 1, file }); const cdp = await ctx.newCDPSession(page);
    await page.evaluate(() => { Object.defineProperty(Navigator.prototype, 'vibrate', { configurable: true, value: undefined }); window.__h = { doc: 0, win: 0, onSw: 0, sw: 0 };
      const isOurs = t => t.closest && (t.closest('.popup-star-tap, .popup-visited-tap, .form-star-tap') || (t.matches && t.matches('input[switch]')) || (t.closest('label') && t.closest('label').querySelector('input[switch]')));
      document.addEventListener('click', e => { if (isOurs(e.target)) __h.doc++; }, true); document.addEventListener('click', e => { if (isOurs(e.target)) __h.doc++; }); window.addEventListener('click', e => { if (isOurs(e.target)) __h.win++; });
      document.addEventListener('change', e => { if (e.target.matches('input[switch]')) __h.sw++; }, true);
      (function f() { if (document.activeElement && document.activeElement.matches('input[switch]')) __h.onSw++; requestAnimationFrame(f); })(); });
    const sel = await page.evaluate(async k => { if (k === 'formStar') { document.getElementById('floatingAddBtn').click(); await new Promise(r => setTimeout(r, 300)); }
      else { const loc = locations[0]; map.setView([loc.lat, loc.lng], 16, { animate: false }); await new Promise(r => setTimeout(r, 150)); updateUI(); markersById.get(loc.id).marker.openPopup(); await new Promise(r => setTimeout(r, 400)); }
      const dd = document.getElementById('accountDropdown'), ac = document.getElementById('addressAutocomplete'); dd.classList.add('show'); ac.innerHTML = '<div class="autocomplete-item">x</div>'; ac.classList.add('show');
      const t = { star: ['.leaflet-popup .popup-star-tap', '.leaflet-popup .popup-star'], visited: ['.leaflet-popup .popup-visited-tap', '.leaflet-popup .popup-visited'], formStar: ['#addForm .form-star-tap', '#starInput'] }[k];
      const e = document.querySelector(t[0]) || document.querySelector(t[1]); const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, t[1]]; }, k);
    const before = await page.evaluate(s => document.querySelector(s).getAttribute('aria-pressed'), sel[2]);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: sel[0], y: sel[1] }] }); await page.waitForTimeout(40); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(900);
    out.ext[tag + ' ' + k] = await page.evaluate(([s, before]) => ({ toggled: document.querySelector(s).getAttribute('aria-pressed') !== before, dropdownOpen: document.getElementById('accountDropdown').classList.contains('show'), autocompleteOpen: document.getElementById('addressAutocomplete').classList.contains('show'), docClicks: __h.doc, winClicks: __h.win, switchFlips: __h.sw, onSwitchFrames: __h.onSw, active: document.activeElement.tagName }), [sel[2], before]);
    await ctx.close(); } };
