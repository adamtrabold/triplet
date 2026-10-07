// UX lane-2 probe, part 2: one-tap swap (signed in and out), keyboard focus in/out, Esc,
// selection state on pin tap vs list tap.   node design/popup-hierarchy/build/ux-probe2.js
const path = require('path');
const { launch, openProto, T, W } = require('../../gesture-harness/lib');
const tapAt = async (cdp, x, y) => { await T(cdp, 'touchStart', x, y); await W(60); await T(cdp, 'touchEnd'); };
const S = () => ({ open: !!document.querySelector('.leaflet-popup.tag-popup'), title: (document.querySelector('.tag-popup .tag-name') || {}).textContent || null, hl: highlightedId,
  rowHl: [...document.querySelectorAll('.location-card.highlighted')].map(e => e.dataset.id), lower: document.documentElement.style.getPropertyValue('--sheet-lower') || '0',
  focus: document.activeElement ? (document.activeElement.className || document.activeElement.tagName) + '' : null, slip: (document.querySelector('.tag-slip') || {}).textContent || '' });
const freePin = (exclude) => {
  const tagEl = document.querySelector('.tag-popup .tag-body'); const tag = tagEl ? tagEl.getBoundingClientRect() : { left: 0, right: 0, top: 0, bottom: 0 };
  const listTop = document.getElementById('locations').getBoundingClientRect().top;
  for (const [id, en] of markersById) { if (id === exclude || !map.hasLayer(en.marker)) continue; const el = en.marker.getElement(); if (!el) continue; const r = el.getBoundingClientRect(); const c = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    const inTag = c.x > tag.left - 14 && c.x < tag.right + 14 && c.y > tag.top - 60 && c.y < tag.bottom + 14; if (!inTag && c.y > 100 && c.y < listTop - 14 && c.x > 30 && c.x < 360) return { id, name: en.loc.name, ...c }; }
  return null;
};
(async () => {
  const b = await launch();
  for (const signedIn of [true, false]) {
    const { page, cdp, ctx, errors } = await openProto(b, {});
    if (!signedIn) { await page.evaluate(() => { currentUser = null; updateAuthUI(); }); await W(300); }
    await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 14, { animate: false }); }); await W(500);
    const pin = await page.evaluate(() => { const r = markersById.get('rey07').marker.getElement().getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await tapAt(cdp, pin.x, pin.y); await W(1400);
    const tag = signedIn ? 'in' : 'out';
    console.log(tag, 'pin tap', JSON.stringify(await page.evaluate(S)));
    const other = await page.evaluate(freePin, 'rey07');
    console.log(tag, 'other', JSON.stringify(other));
    if (other) {
      await tapAt(cdp, other.x, other.y); await W(1400);
      console.log(tag, 'after ONE tap on other pin', JSON.stringify(await page.evaluate(S)));
      await page.screenshot({ path: path.join(__dirname, `ux-probe2-swap-${tag}.png`) });
      await page.evaluate(() => map.closePopup()); await W(400);
      console.log(tag, 'after close', JSON.stringify(await page.evaluate(S)));
    }
    if (signedIn) {
      // list tap then pin tap: does selection follow?
      const row = await page.evaluate(() => { const b = document.querySelector('.location-card[data-id="rey00"] .row-main').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
      await tapAt(cdp, row.x, row.y); await W(2200);
      console.log('list tap rey00', JSON.stringify(await page.evaluate(S)));
      const o2 = await page.evaluate(freePin, 'rey00');
      if (o2) { await tapAt(cdp, o2.x, o2.y); await W(1400); console.log('then pin tap', o2.name, JSON.stringify(await page.evaluate(S))); }
      await page.evaluate(() => map.closePopup()); await W(400);
      // keyboard: focus a row, Enter, then Esc
      await page.evaluate(() => { const e = document.querySelector('.location-card[data-id="rey02"] .row-main') || document.querySelector('.location-card[data-id="rey02"]'); e.setAttribute('tabindex', e.getAttribute('tabindex') || '0'); e.focus(); });
      const f0 = await page.evaluate(() => document.activeElement.className);
      await page.keyboard.press('Enter'); await W(2200);
      console.log('kbd Enter on row (focus was ' + f0 + ')', JSON.stringify(await page.evaluate(S)));
      await page.keyboard.press('Escape'); await W(500);
      console.log('kbd Esc', JSON.stringify(await page.evaluate(S)));
      await page.evaluate(() => { const c = document.querySelector('.tag-popup .tag-x'); if (c) c.focus(); }); await page.keyboard.press('Enter'); await W(500);
      console.log('kbd Enter on x', JSON.stringify(await page.evaluate(S)));
      // tab order inside tag
      await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 14, { animate: false }); markersById.get('rey07').marker.openPopup(); }); await W(1400);
      const order = []; for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent || '').trim().slice(0, 24))); }
      console.log('Tab order from tag', JSON.stringify(order));
    }
    console.log(tag, 'errors', JSON.stringify(errors));
    await ctx.close();
  }
  await b.close();
})();
