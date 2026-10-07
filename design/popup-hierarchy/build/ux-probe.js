// UX lane-2 probe of the Hanging Tag build: drives the REAL index.html in the gesture
// harness (stub Supabase, blank tiles) with real-timing touch and prints measurements.
//   node design/popup-hierarchy/build/ux-probe.js            (writes ux-probe.json next to it)
const path = require('path'), fs = require('fs');
const { launch, openProto, T, drag, line, W } = require('../../gesture-harness/lib');
const out = {};
const log = (k, v) => { out[k] = v; console.log(k.padEnd(34), JSON.stringify(v)); };

const S = () => ({
  open: !!document.querySelector('.leaflet-popup.tag-popup'),
  title: (document.querySelector('.tag-popup .tag-name') || {}).textContent || null,
  hl: highlightedId, zoom: map.getZoom(),
  lower: document.documentElement.style.getPropertyValue('--sheet-lower') || '0',
  listTop: Math.round(document.getElementById('locations').getBoundingClientRect().top),
  scroll: document.getElementById('locationsList').scrollTop,
  focus: document.activeElement ? (document.activeElement.className || document.activeElement.tagName) + '' : null,
  wait: !!document.querySelector('.tag-popup.tag-wait'),
  scrolls: !!document.querySelector('.tag-in.scrolls'),
  dot: !!document.querySelector('.tag-dot'),
  slip: (document.querySelector('.tag-slip') || {}).textContent || '',
  auth: document.getElementById('authModal').classList.contains('show'),
});
const rects = () => {
  const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
  const all = s => [...document.querySelectorAll(s)].map(e => { const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; });
  const tag = document.querySelector('.tag-popup .tag-body'), mapR = map.getContainer().getBoundingClientRect();
  return { tag: r('.tag-popup .tag-body'), segs: all('.tag-popup .tag-seg'), taps: all('.tag-popup .popup-star-tap, .tag-popup .popup-visited-tap'), x: r('.tag-popup .tag-x'),
    slipBtn: r('.tag-slip button'), mapBottom: Math.round(mapR.bottom), tagFootGap: tag ? Math.round(mapR.bottom - tag.getBoundingClientRect().bottom) : null };
};
const tapAt = async (cdp, x, y) => { await T(cdp, 'touchStart', x, y); await W(60); await T(cdp, 'touchEnd'); };
async function tapRow(page, cdp, sel) {
  await page.evaluate(sel => { const e = document.querySelector(sel); const l = document.getElementById('locationsList'); const er = e.getBoundingClientRect(), lr = l.getBoundingClientRect();
    if (er.top < lr.top + 40 || er.bottom > lr.bottom - 8) l.scrollTop += er.top - lr.top - 60; }, sel);
  await W(150);
  const p = await page.evaluate(sel => { const b = document.querySelector(sel + ' .row-main').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel);
  await tapAt(cdp, p.x, p.y);
}
const center = (r) => ({ x: r[0] + r[2] / 2, y: r[1] + r[3] / 2 });

(async () => {
  const b = await launch();
  // ---------- A: 390x844, signed in, full motion ----------
  {
    const { page, cdp, ctx, errors } = await openProto(b, {});
    // approx pin fixture
    await page.evaluate(async () => { const r = window.__ROWS.find(x => x.id === 'rey15'); Object.assign(r, { name: 'Værnedamsvej (approx.)', category: 'district',
      notes: "Copenhagen's most charming market street; Granola (retro coffee lounge/backyard café), Le Gourmand (French deli/cheese & charcuterie), Helges Ost (cheesemonger), Falernum (natural wine bar with tapas), Café Viggo (French bistro), Dora (design/vintage homewares)\n\nApproximate placement -- OSM has no boundary/way for this district; resolved via point search." }); await refetchLocations(); });
    await W(400);
    const before = await page.evaluate(S);
    log('A0 before', before);
    // A1 pin via list
    let t0 = Date.now(); await tapRow(page, cdp, '.location-card[data-id="rey05"]'); await W(2000);
    log('A1 pin list-tap', await page.evaluate(S)); log('A1 rects', await page.evaluate(rects));
    // A2 swap: tap another visible marker
    const other = await page.evaluate(() => { const mapR = map.getContainer().getBoundingClientRect(); const tag = document.querySelector('.tag-popup .tag-body').getBoundingClientRect(); const listTop = document.getElementById('locations').getBoundingClientRect().top;
      for (const [id, en] of markersById) { if (id === highlightedId || !map.hasLayer(en.marker)) continue; const el = en.marker.getElement(); if (!el) continue; const r = el.getBoundingClientRect(); const c = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        const inTag = c.x > tag.left - 10 && c.x < tag.right + 10 && c.y > tag.top - 60 && c.y < tag.bottom + 10; if (!inTag && c.y > 90 && c.y < listTop - 10 && c.x > 30 && c.x < mapR.right - 30) return { id, name: en.loc.name, ...c }; } return null; });
    log('A2 swap target', other);
    if (other) { await tapAt(cdp, other.x, other.y); await W(1500); log('A2 after ONE tap', await page.evaluate(S)); }
    // A3 nothing moves on star / visited tap
    let R0 = await page.evaluate(rects);
    const starC = center(R0.segs[1]); await tapAt(cdp, starC.x, starC.y); await W(800);
    let R1 = await page.evaluate(rects); log('A3 star tap', { before: R0.tag, after: R1.tag, segsBefore: R0.segs, segsAfter: R1.segs, s: await page.evaluate(S) });
    const visC = center(R1.segs[2]); await tapAt(cdp, visC.x, visC.y); await W(1000);
    let R2 = await page.evaluate(rects); log('A3 visited tap', { after: R2.tag, segsAfter: R2.segs, s: await page.evaluate(S) });
    // A4 drag on tag must not pan map
    const c0 = await page.evaluate(() => map.getCenter()); const tg = R2.tag; await drag(page, cdp, line(tg[0] + 150, tg[1] + 120, tg[0] + 60, tg[1] + 40, 10)); await W(400);
    const c1 = await page.evaluate(() => map.getCenter()); log('A4 drag on tag: map moved?', { moved: Math.abs(c0.lat - c1.lat) + Math.abs(c0.lng - c1.lng) > 1e-7, open: (await page.evaluate(S)).open });
    // A5 close via x
    const x = center(R2.x); await tapAt(cdp, x[0] === undefined ? x.x : x.x, x.y); await W(600);
    log('A5 after x', await page.evaluate(S));
    // A6 district, street, approx via list
    for (const [k, sel] of [['district', '.location-card[data-shape-id]'], ['approx', '.location-card[data-id="rey15"]']]) {
      await tapRow(page, cdp, sel); await W(2200); log('A6 ' + k, await page.evaluate(S)); await page.evaluate(() => map.closePopup()); await W(500);
    }
    const streetSel = await page.evaluate(() => { const els = [...document.querySelectorAll('.location-card[data-shape-id]')]; const e = els.find(e => /Street/.test(e.textContent)); return e ? `.location-card[data-shape-id="${e.getAttribute('data-shape-id')}"]` : null; });
    if (streetSel) { await tapRow(page, cdp, streetSel); await W(2200); log('A6 street', await page.evaluate(S)); await page.evaluate(() => map.closePopup()); await W(500); }
    // A7 arrival: place already on screen at zoom>=14 -> how fast does it open?
    await page.evaluate(() => { const l = locations.find(x => x.id === 'rey09'); map.setView([l.lat, l.lng], 15, { animate: false }); }); await W(500);
    t0 = Date.now(); await tapRow(page, cdp, '.location-card[data-id="rey09"]');
    let opened = 0; for (let i = 0; i < 40; i++) { if ((await page.evaluate(S)).open) { opened = Date.now() - t0; break; } await W(50); }
    log('A7 on-screen arrival open ms', opened);
    await page.evaluate(() => map.closePopup()); await W(500);
    // A8 place hidden under the list sheet but inside the map container?
    const geo = await page.evaluate(() => ({ map: map.getContainer().getBoundingClientRect().bottom, list: document.getElementById('locations').getBoundingClientRect().top }));
    log('A8 map container bottom vs list top', geo);
    // A9 Esc closes
    await tapRow(page, cdp, '.location-card[data-id="rey00"]'); await W(2000); await page.keyboard.press('Escape'); await W(500); log('A9 Esc', await page.evaluate(S));
    // A10 Impeccable-flagged labels: computed sizes
    await tapRow(page, cdp, '.location-card[data-id="rey00"]'); await W(2000);
    log('A10 label sizes', await page.evaluate(() => [...document.querySelectorAll('.tag-popup .tag-seg, .tag-popup .tag-lab, .tag-popup .tag-val, .tag-popup .tag-addr')].map(e => [e.className, getComputedStyle(e).fontSize, getComputedStyle(e).fontWeight, getComputedStyle(e).color, e.textContent.trim().slice(0, 20)])));
    await page.screenshot({ path: path.join(__dirname, 'ux-probe-A.png') });
    log('A errors', errors);
    await ctx.close();
  }
  // ---------- B: 390x664, tallest tag, scroll restore ----------
  {
    const { page, cdp, ctx, errors } = await openProto(b, { h: 664 });
    await page.evaluate(async () => { const r = window.__ROWS.find(x => x.id === 'rey15'); Object.assign(r, { name: 'Værnedamsvej (approx.)', category: 'district',
      notes: "Copenhagen's most charming market street; Granola (retro coffee lounge/backyard café), Le Gourmand (French deli/cheese & charcuterie), Helges Ost (cheesemonger), Falernum (natural wine bar with tapas), Café Viggo (French bistro), Dora (design/vintage homewares)\n\nApproximate placement -- OSM has no boundary/way for this district; resolved via point search." }); await refetchLocations(); });
    await W(300);
    await page.evaluate(() => { document.getElementById('locationsList').scrollTop = 300; }); await W(200);
    const b0 = await page.evaluate(S); log('B0 before (scroll 300)', b0);
    const vis = await page.evaluate(() => { const l = document.getElementById('locationsList').getBoundingClientRect(); const e = [...document.querySelectorAll('.location-card[data-id]')].find(e => { const r = e.getBoundingClientRect(); return r.top > l.top + 10 && r.bottom < l.bottom - 10; }); return e && e.dataset.id; });
    // open the tallest via map (no list scroll) then via list
    await page.evaluate(() => { const l = locations.find(x => x.id === 'rey15'); map.setView([l.lat, l.lng], 15, { animate: false }); }); await W(400);
    const pin = await page.evaluate(() => { const r = markersById.get('rey15').marker.getElement().getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await tapAt(cdp, pin.x, pin.y); await W(1500);
    log('B1 tallest via pin', await page.evaluate(S)); log('B1 rects', await page.evaluate(rects));
    log('B1 list visible px', await page.evaluate(() => { const l = document.getElementById('locations').getBoundingClientRect(); return Math.round(innerHeight - l.top); }));
    await page.screenshot({ path: path.join(__dirname, 'ux-probe-B1.png') });
    await page.evaluate(() => map.closePopup()); await W(500);
    log('B2 after close', await page.evaluate(S));
    if (vis) { await page.evaluate(() => { document.getElementById('locationsList').scrollTop = 300; }); await W(150); const s0 = (await page.evaluate(S)).scroll;
      const p = await page.evaluate(id => { const b = document.querySelector(`.location-card[data-id="${id}"] .row-main`).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, vis);
      await tapAt(cdp, p.x, p.y); await W(2200); log('B3 visible row tap', await page.evaluate(S));
      await page.evaluate(() => map.closePopup()); await W(500); log('B3 after close (scroll was ' + s0 + ')', await page.evaluate(S)); }
    // collapsed list stays collapsed
    await page.evaluate(() => document.getElementById('collapseBtn').click()); await W(600);
    const c = await page.evaluate(S); log('B4 collapsed before', c);
    await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 15, { animate: false }); }); await W(400);
    const pin2 = await page.evaluate(() => { const r = markersById.get('rey07').marker.getElement().getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await tapAt(cdp, pin2.x, pin2.y); await W(1500); log('B4 tag with collapsed list', await page.evaluate(S));
    await page.evaluate(() => map.closePopup()); await W(500); log('B4 after close', { ...(await page.evaluate(S)), collapsed: await page.evaluate(() => document.getElementById('locations').classList.contains('collapsed')) });
    log('B errors', errors);
    await ctx.close();
  }
  // ---------- C: signed out ----------
  {
    const { page, cdp, ctx, errors } = await openProto(b, {});
    await page.evaluate(() => { currentUser = null; updateAuthUI(); }); await W(300);
    await page.evaluate(() => { const l = locations.find(x => x.id === 'rey07'); map.setView([l.lat, l.lng], 15, { animate: false }); }); await W(400);
    const pin = await page.evaluate(() => { const r = markersById.get('rey07').marker.getElement().getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await tapAt(cdp, pin.x, pin.y); await W(1500);
    const r0 = await page.evaluate(rects);
    log('C1 signed-out names', await page.evaluate(() => [...document.querySelectorAll('.tag-popup .tag-seg')].map(e => [e.getAttribute('aria-label') || e.textContent.trim(), e.getAttribute('aria-disabled')])));
    await tapAt(cdp, center(r0.segs[1]).x, center(r0.segs[1]).y); await W(500);
    const r1 = await page.evaluate(rects); log('C2 slip after greyed star tap', { s: await page.evaluate(S), tagBefore: r0.tag, tagAfter: r1.tag, slipBtn: r1.slipBtn, slipRole: await page.evaluate(() => { const s = document.querySelector('.tag-slip'); return s && [s.getAttribute('role'), s.getAttribute('aria-live')]; }) });
    await page.screenshot({ path: path.join(__dirname, 'ux-probe-C2.png') });
    // tap on another pin while slip is shown: must only dismiss
    const other = await page.evaluate(() => { const tag = document.querySelector('.tag-popup .tag-body').getBoundingClientRect(); const listTop = document.getElementById('locations').getBoundingClientRect().top;
      for (const [id, en] of markersById) { if (id === 'rey07' || !map.hasLayer(en.marker)) continue; const r = en.marker.getElement().getBoundingClientRect(); const c = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        if ((c.x < tag.left - 10 || c.x > tag.right + 10 || c.y > tag.bottom + 60) && c.y > 90 && c.y < listTop - 10 && c.x > 30 && c.x < 360) return { id, ...c }; } return null; });
    if (other) { await tapAt(cdp, other.x, other.y); await W(800); log('C3 tap other pin while slip shows', { s: await page.evaluate(S), other }); }
    // slip -> sign in
    await tapAt(cdp, center(r0.segs[2]).x, center(r0.segs[2]).y); await W(400);
    const r3 = await page.evaluate(rects); if (r3.slipBtn) { await tapAt(cdp, center(r3.slipBtn).x, center(r3.slipBtn).y); await W(600); }
    log('C4 SIGN IN tapped', await page.evaluate(S));
    // directions live?
    log('C5 directions', await page.evaluate(() => { const a = document.querySelector('.tag-popup .popup-directions'); return a && [a.getAttribute('href'), a.getAttribute('aria-disabled')]; }));
    log('C errors', errors);
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, 'ux-probe.json'), JSON.stringify(out, null, 1));
  await b.close();
})();
