// Supabase stub for the gesture harness: a signed-in owner session and a fixed
// fixture, the same 21 places (+ a district and a street) in each of the five
// seed cities, so every suite can address rows by LIST INDEX (A-Z order, the
// default sort) in any city. Writes (update().eq()) patch the fixture, so the
// refetch after a toggle returns the state already on screen, as the real
// server does. Served in place of the supabase-js CDN script by lib.js.
(function () {
  // [name, category, starred, visited] -- list order (A-Z) is asserted by lib.js at load.
  //   0 short, plain              -> star/visit cases, clearance renames
  //   1 LONG, starred + visited   -> unstar (long), un-visit with star kept
  //   2 LONG, visited             -> star on a long visited row, un-visit cases
  //   5 LONG, plain               -> long-name visit cases (truncation, ink-vs-text)
  const T = [
    ['Bæjarins Beztu', 'restaurant', false, false],
    ['Brauð & Co, the cinnamon bakery on Frakkastígur', 'cafe', true, true],
    ['Café Loki opposite Hallgrímskirkja church', 'cafe', false, true],
    ['Grandi Mathöll food hall', 'restaurant', false, false],
    ['Hallgrímskirkja', 'attraction', false, false],
    ['Harpa Concert Hall and Conference Centre', 'attraction', false, false],
    ['Hlemmur Mathöll', 'restaurant', false, false],
    ['Kaffi Vínyl', 'cafe', false, false],
    ['Kolaportið flea market', 'shopping', false, false],
    ['Laugardalslaug', 'nature', false, false],
    ['Mál og menning bookshop', 'shopping', true, false],
    ['Nauthólsvík geothermal beach', 'nature', false, false],
    ['Perlan', 'attraction', false, true],
    ['Reykjavík Roasters', 'cafe', false, false],
    ['Sandholt bakery', 'cafe', false, false],
    ['Sky Lagoon', 'nature', false, false],
    ['Sundhöllin', 'nature', false, false],
    ['Tjörnin pond', 'area', false, false],
    ['Valdís ice cream', 'cafe', false, false],
    ['Whales of Iceland', 'attraction', false, false],
    ['Þrír Frakkar', 'bar', false, false],
  ];
  const C = { reykjavik: [64.1466, -21.9426], copenhagen: [55.6761, 12.5683], malmo: [55.6050, 13.0038], stockholm: [59.3293, 18.0686], la: [34.0522, -118.2437] };
  const rows = [], shapes = []; let sid = 1;
  for (const [city, [la, ln]] of Object.entries(C)) {
    T.forEach(([name, category, starred, visited], i) => {
      // a loose 7x3 grid ~250-600m apart: several pins share a cluster at the
      // city's start zoom, all are solo at SOLO_MIN_ZOOM (popup-open needs both)
      const r = Math.floor(i / 7), c = i % 7;
      rows.push({ id: `${city.slice(0, 3)}${String(i).padStart(2, '0')}`, name, address: `${10 + i} Testgata, ${city}`, category,
        lat: +(la + (r - 1) * 0.0042 + (c % 2) * 0.0011).toFixed(6), lng: +(ln + (c - 3) * 0.0071).toFixed(6),
        notes: i % 3 ? null : 'Fixture note.', visited, starred, city, created_at: new Date(Date.UTC(2026, 8, 1, 0, i)).toISOString() });
    });
    shapes.push({ id: sid++, city, type: 'district', label: 'Fixture District', color: null, note: null, min_zoom: 15,
      geometry: [[la + 0.010, ln - 0.012], [la + 0.014, ln - 0.012], [la + 0.014, ln - 0.004], [la + 0.010, ln - 0.004]] });
    shapes.push({ id: sid++, city, type: 'street', label: 'Fixture Street', color: null, note: null, min_zoom: null,
      geometry: [[la - 0.012, ln + 0.004], [la - 0.0125, ln + 0.012]] });
  }
  window.__ROWS = rows; window.__SHAPES = shapes;
  // Plans (plans.js only, opted in with localStorage 'gh.plans'): one plan whose stops are the
  // Reykjavík rows 0, 5 and 1 (short plain, long plain, long starred + visited), in a small
  // in-memory plans / plan_stops store that applies the page's writes, so a refetch after a
  // write returns what is on screen. Every other suite sees no plans, as before.
  let ghPlans = false; try { ghPlans = localStorage.getItem('gh.plans') === '1'; } catch (e) {}
  const PT = window.__PT = { plans: ghPlans ? [{ id: 'gh-p', name: 'Gate plan', created_at: '2026-09-01T00:00:00Z' }] : [],
    plan_stops: ghPlans ? ['rey00', 'rey05', 'rey01'].map((l, i) => ({ id: 'gs' + i, plan_id: 'gh-p', location_id: l, shape_id: null, position: i + 1 })) : [] };
  const qPlan = (table) => {
    let op = 'select', payload = null; const f = [];
    const hit = r => f.every(([k, v]) => r[k] === v);
    const run = () => {
      const t = PT[table];
      if (op === 'insert') (Array.isArray(payload) ? payload : [payload]).forEach(r => t.push({ ...r }));
      else if (op === 'upsert') (Array.isArray(payload) ? payload : [payload]).forEach(r => { const o = t.find(x => x.id === r.id); if (o) Object.assign(o, r); else t.push({ ...r }); });
      else if (op === 'update') t.filter(hit).forEach(r => Object.assign(r, payload));
      else if (op === 'delete') { PT[table] = t.filter(r => !hit(r)); if (table === 'plans') PT.plan_stops = PT.plan_stops.filter(s => PT.plans.some(p => p.id === s.plan_id)); }
      return { data: op === 'select' ? PT[table].filter(hit).map(r => ({ ...r })) : null, error: null };
    };
    const b = { select() { return b; }, order() { return b; }, in() { return b; }, eq(k, v) { f.push([k, v]); return b; },
      insert(r) { op = 'insert'; payload = r; return b; }, update(o) { op = 'update'; payload = o; return b; }, upsert(r) { op = 'upsert'; payload = r; return b; },
      delete() { op = 'delete'; return b; }, then(ok, bad) { return Promise.resolve(run()).then(ok, bad); } };
    return b;
  };
  const q = (table) => {
    if (table === 'plans' || table === 'plan_stops') return qPlan(table);
    const res = () => ({ data: table === 'locations' ? window.__ROWS.map(r => ({ ...r })) : table === 'neighborhood_shapes' ? window.__SHAPES.map(r => ({ ...r })) : [], error: null });
    let patch = null;
    const b = { select() { return b; }, order() { return b; }, in() { return b; }, limit() { return b; }, single() { return b; }, upsert() { return b; },
      eq(k, v) { if (patch) window.__ROWS.forEach(r => { if (r[k] === v) Object.assign(r, patch); }); return b; },
      update(o) { patch = o; return b; }, insert() { return b; }, delete() { return b; },
      then(ok, bad) { return Promise.resolve(res()).then(ok, bad); } };
    return b;
  };
  const session = { user: { email: 'adamtrabold@gmail.com' } };
  window.supabase = { createClient() { return {
    from: q,
    auth: { getSession: async () => ({ data: { session } }), onAuthStateChange(cb) { setTimeout(() => cb('INITIAL_SESSION', session), 0); return { data: { subscription: { unsubscribe() {} } } }; },
      signInWithPassword: async () => ({ data: {}, error: null }), signOut: async () => ({}) } }; } };
})();
