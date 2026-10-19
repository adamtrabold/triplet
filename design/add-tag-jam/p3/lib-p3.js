// Phase 3 test/stills support, on top of ../p2/lib-p2.js (the stub page + search fixtures):
//   - install(page): records city writes (window.__upd: [table, payload, [col, val]]) and city
//     deletes (window.__del); window.__failUpdate = table fails the next update there,
//     window.__slowFail / window.__slowOk make it settle after 400ms (failing / succeeding);
//     Nominatim /reverse answers `reverse.next` (an address object) or nothing.
//   - realRows(page): three Reykjavík fixture rows become real places from the live DB (read
//     2026-10-19): Gunnuhver (outside Reykjavík's box, with details), Sundhöllin (inside),
//     Reykjanesviti (outside, no address details -- one of the 59).
//   - openTag(page, key): the list's row tap (the map flies, the tag opens).
const { W } = require('../p2/lib-p2.js');
const reverse = { next: null };

async function install(page) {
  await page.route('https://nominatim.openstreetmap.org/reverse**', route =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(reverse.next ? { address: reverse.next } : {}) }));
  await page.evaluate(() => {
    window.__upd = []; window.__del = []; window.__failUpdate = null; window.__slowFail = null; window.__slowOk = null;
    const prev = supabaseClient.from.bind(supabaseClient);
    supabaseClient.from = t => {
      const bb = prev(t);
      if (t === 'cities') { const d = bb.delete; bb.delete = function () { window.__del.push(['cities']); return d.apply(bb, arguments); }; return bb; }
      if (!['locations', 'neighborhood_shapes'].includes(t)) return bb;
      const up = bb.update;
      bb.update = o => {
        const fail = window.__failUpdate === t || window.__slowFail === t, slow = window.__slowFail === t || window.__slowOk === t;
        if (window.__failUpdate === t) window.__failUpdate = null;
        if (window.__slowFail === t) window.__slowFail = null;
        if (window.__slowOk === t) window.__slowOk = null;
        return { eq(k, v) {
          if (!fail) { window.__upd.push([t, JSON.parse(JSON.stringify(o)), [k, v]]); up.call(bb, o); bb.eq(k, v); }
          return { then(ok, bad) { return new Promise(r => setTimeout(r, slow ? 400 : 0)).then(() => ({ data: null, error: fail ? { message: 'stub failure', code: 'X' } : null })).then(ok, bad); } };
        } };
      };
      return bb;
    };
  });
}

const REAL = {
  rey15: { name: 'Gunnuhver - fumarole', category: 'nature', lat: 63.8194447, lng: -22.6841797, address: 'Gunnuhver, Vitabraut, Reykjanesbær, Iceland', notes: null,
    short_address: 'Vitabraut · Reykjanesbær', address_details: { road: 'Vitabraut', town: 'Reykjanesbær', country: 'Iceland', country_code: 'is' } },
  rey16: { name: 'Sundhöllin', category: 'attraction', lat: 64.14167, lng: -21.92972, address: 'Sundhöll Reykjavíkur, Barónsstígur 45A, Reykjavík, Iceland', notes: null,
    short_address: 'Barónsstígur 45A · Miðborg', address_details: { road: 'Barónsstígur', house_number: '45A', suburb: 'Miðborg', city: 'Reykjavík', country: 'Iceland', country_code: 'is' } },
  rey17: { name: 'Reykjanesviti', category: 'attraction', lat: 63.8156125, lng: -22.7043669, address: null, notes: null, short_address: null, address_details: null },
};
async function realRows(page, extra = {}) {
  await page.evaluate(real => {
    for (const [id, patch] of Object.entries(real)) {
      window.__ROWS.forEach(r => { if (r.id === id) Object.assign(r, patch); });
      locations = locations.map(l => l.id === id ? { ...l, ...patch } : l);
    }
    updateUI();
  }, { ...REAL, ...extra });
  await W(300);
}
async function openTag(page, key) {
  await page.evaluate(() => { if (tagOpenNow()) map.closePopup(); });
  await W(400);
  await page.evaluate(k => { const en = rowEntry(k); en.el.scrollIntoView({ block: 'center' }); en.el.click(); }, key);
  await W(1800);
}
module.exports = { install, reverse, realRows, openTag, REAL };
