// Plans test stub, loaded AFTER design/list-ordering/build/stub.js (its __ROWS/__SHAPES:
// real Copenhagen rows + two shapes). Replaces window.supabase with an in-memory PostgREST
// double that implements the calls index.html makes: select / order / eq / insert / update /
// delete / upsert, thenable like supabase-js. Knobs (set in an init script before load):
//   __PLANS_MISSING  plans/plan_stops reads fail like a missing table (PGRST205)
//   __FAIL_WRITES    every plans/plan_stops write fails with an RLS error
//   __WRITE_DELAY    ms before a write settles (default 0)
//   __SIGNED_OUT     no session
//   __PLANS / __STOPS  seed rows; __VISITED: ids of the visited pins (replaces the stub's own)
// Every call is logged to window.__calls as { table, op, payload, filters }.
(function () {
  window.__calls = [];
  // Real shapes have bigint ids (neighborhood_shapes.id), so the plan fixtures use numeric ones:
  // the concept harness's two Nørrebro stand-ins. Plus the approximate pin case.
  window.__SHAPES = [
    { id: 9001, city: 'copenhagen', type: 'district', label: 'Elmegade quarter', color: null, note: null, min_zoom: null,
      geometry: [[55.6912, 12.5552], [55.6904, 12.5602], [55.6884, 12.5596], [55.6889, 12.5548]] },
    { id: 9002, city: 'copenhagen', type: 'street', label: 'Guldbergsgade', color: null, note: null, min_zoom: null,
      geometry: [[55.6906, 12.5539], [55.6918, 12.5553], [55.6931, 12.5569], [55.6944, 12.5584]] }
  ];
  window.__ROWS.push({ id: 'bla', name: 'Blågårds Plads (approx.)', address: 'Blågårdsgade, Nørrebro, Copenhagen', category: 'area', lat: 55.68655, lng: 12.55655,
    notes: 'Approximate: Nominatim point search.', visited: false, starred: false, city: 'copenhagen' });
  if (window.__VISITED) window.__ROWS.forEach(r => { r.visited = window.__VISITED.includes(r.id); });
  const db = window.__db = {
    locations: window.__ROWS,
    neighborhood_shapes: window.__SHAPES,
    plans: (window.__PLANS || []).map(r => ({ ...r })),
    plan_stops: (window.__STOPS || []).map(r => ({ ...r }))
  };
  const isPlanTable = t => t === 'plans' || t === 'plan_stops';
  const missing = { code: 'PGRST205', message: "Could not find the table 'public.plans' in the schema cache" };
  const rls = { code: '42501', message: 'new row violates row-level security policy for table' };
  function q(table) {
    let op = 'select', payload = null, filters = [], orderBy = null;
    const b = {
      select() { return b; },
      order(col, o) { orderBy = [col, !o || o.ascending !== false]; return b; },
      eq(k, v) { filters.push([k, v]); return b; },
      in(k, vs) { filters.push([k, vs, 'in']); return b; },
      insert(rows) { op = 'insert'; payload = rows; return b; },
      update(o) { op = 'update'; payload = o; return b; },
      upsert(rows) { op = 'upsert'; payload = rows; return b; },
      delete() { op = 'delete'; return b; },
      then(ok, bad) { return run().then(ok, bad); }
    };
    const match = r => filters.every(([k, v, how]) => how === 'in' ? v.includes(r[k]) : r[k] === v);
    async function run() {
      window.__calls.push({ table, op, payload: payload && JSON.parse(JSON.stringify(payload)), filters: filters.slice() });
      if (op !== 'select' && window.__WRITE_DELAY) await new Promise(r => setTimeout(r, window.__WRITE_DELAY));
      if (isPlanTable(table)) {
        if (window.__PLANS_MISSING) return { data: null, error: missing };
        if (op !== 'select' && window.__FAIL_WRITES) return { data: null, error: rls };
      }
      const rows = db[table] || (db[table] = []);
      if (op === 'select') {
        let out = rows.filter(match).map(r => ({ ...r }));
        if (orderBy) out.sort((a, b) => (a[orderBy[0]] < b[orderBy[0]] ? -1 : a[orderBy[0]] > b[orderBy[0]] ? 1 : 0) * (orderBy[1] ? 1 : -1));
        return { data: out, error: null };
      }
      if (op === 'insert') {
        (Array.isArray(payload) ? payload : [payload]).forEach(r => rows.push({ created_at: new Date().toISOString(), ...r }));
        return { data: null, error: null };
      }
      if (op === 'upsert') {
        (Array.isArray(payload) ? payload : [payload]).forEach(r => { const i = rows.findIndex(x => x.id === r.id); if (i >= 0) Object.assign(rows[i], r); else rows.push({ ...r }); });
        return { data: null, error: null };
      }
      if (op === 'update') { rows.filter(match).forEach(r => Object.assign(r, payload)); return { data: null, error: null }; }
      if (op === 'delete') {
        const gone = rows.filter(match);
        db[table] = rows.filter(r => !match(r));
        if (table === 'plans') db.plan_stops = db.plan_stops.filter(s => !gone.some(p => p.id === s.plan_id));   // ON DELETE CASCADE
        if (table === 'locations') db.plan_stops = db.plan_stops.filter(s => !gone.some(l => l.id === s.location_id));
        if (table === 'neighborhood_shapes') db.plan_stops = db.plan_stops.filter(s => !gone.some(n => n.id === s.shape_id));
        if (table === 'locations') window.__ROWS = db.locations;
        return { data: null, error: null };
      }
      return { data: null, error: null };
    }
    return b;
  }
  const session = window.__SIGNED_OUT ? null : { user: { email: 'adamtrabold@gmail.com' } };
  window.supabase = { createClient() { return {
    from: q,
    auth: { getSession: async () => ({ data: { session } }), onAuthStateChange(cb) { setTimeout(() => cb('INITIAL_SESSION', session), 0); return { data: { subscription: { unsubscribe() {} } } }; },
      signInWithPassword: async () => ({ data: {}, error: null }), signOut: async () => ({}) } }; } };
})();
