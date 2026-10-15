// PLANS v2 concept prototype -- injected into the real index.html (stub data). Not production code.
// Model: "Places | Plans". Places is today's app, untouched. Plans lists ONE plan's stops (pins and
// districts/streets) in plan order. Adding happens in an explicit "Add to <plan>" mode that lists
// every place (the Places list, same filters and sort) with a +/number tile per row, entered from the
// plan's last row ("Add places") or straight after creating a plan; the header's Done leaves it.
(function () {
  const css = `
  /* ---- the switch: ONE joined track, equal halves; ON half = the state system's navy tile ---- */
  .seg-wrap { padding: var(--s3) var(--gutter); border-bottom: 1px solid var(--hair); }
  .seg { display: flex; height: 36px; border: 1px solid var(--navy); border-radius: 3px; background: var(--paper-raised); overflow: hidden; }
  .seg button { flex: 1 1 0; position: relative; border: none; margin: 0; padding: 0; background: transparent; color: var(--navy); cursor: pointer;
    font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; font-size: 12px; line-height: 16px; letter-spacing: .08em; font-weight: 700; }
  .seg button + button { border-left: 1px solid var(--navy); }
  .seg button::before { content: ''; position: absolute; left: 0; right: 0; top: -5px; bottom: -5px; }
  .seg button:active:not([aria-checked="true"]) { background: var(--state-press); }
  .seg button[aria-checked="true"] { background: var(--state-on-bg); color: var(--state-on-fg); }

  /* ---- plan ledger (Plans side of the panel only): 44px rows, the sort menu's row motif ---- */
  #planLedger { border-bottom: 1px solid var(--hair); }
  #filtersPanel:not(.plans-side) #planLedger { display: none; }
  .plan-opt { display: grid; grid-template-columns: 16px minmax(0, 1fr) auto 44px; align-items: center; column-gap: var(--s2); height: 45px; box-sizing: border-box; padding: 0 4px 0 var(--gutter);
    border-bottom: 1px solid var(--hair); position: relative; }
  .plan-opt:last-child { border-bottom: none; }
  .plan-opt .pick { all: unset; position: absolute; inset: 0; cursor: pointer; }
  .plan-opt .pick:active { background: var(--state-press); }
  .plan-opt .nm { font: 700 13px/16px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .05em; color: var(--navy);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
  .plan-opt .ct { font: 600 11px/12px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-2); pointer-events: none; }
  .plan-opt .ck { width: 16px; height: 16px; visibility: hidden; color: var(--navy); pointer-events: none; }
  .plan-opt[aria-checked="true"] .ck { visibility: visible; }
  .plan-opt .more { position: relative; z-index: 1; width: 44px; height: 44px; border: none; background: none; color: var(--navy); display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .plan-opt .more svg { width: 18px; height: 18px; }
  .plan-opt .more.open { background: var(--state-on-bg); color: var(--state-on-fg); }
  .plan-opt.new .nm { color: var(--ink-2); }
  .plan-opt.new .ck { visibility: visible; color: var(--ink-2); }
  .plan-opt.editing { grid-template-columns: minmax(0, 1fr) auto auto; column-gap: 0; padding-left: var(--gutter); background: var(--paper-raised); }
  .plan-opt.editing input { font: 400 16px/20px var(--font-ui); color: var(--ink); border: none; border-bottom: 1px solid var(--navy); background: transparent; padding: 4px 0; min-width: 0; outline: none; border-radius: 0; }
  .plan-opt.editing .act { all: unset; height: 44px; padding: 0 12px; display: flex; align-items: center; cursor: pointer;
    font: 700 12px/16px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .08em; color: var(--ink-2); }
  .plan-opt.editing .act.primary { color: var(--navy); }

  /* ---- plan slip (the ⋯ on the current plan): the sort menu's slip ---- */
  #planSlip { position: fixed; z-index: 2600; width: 180px; background: var(--paper-raised); border: 1px solid var(--navy); border-radius: 2px; box-shadow: 2px 2px 0 var(--navy); }
  #planSlip[hidden] { display: none; }
  #planSlip button { display: block; width: 100%; height: 44px; padding: 0 var(--s3); text-align: left; background: none; border: none; border-bottom: 1px solid var(--hair); cursor: pointer;
    font: 700 13px/16px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .05em; color: var(--navy); }
  #planSlip button:last-child { border-bottom: none; }
  #planSlip button:active { background: var(--state-press); }

  /* ---- header in Add mode: Done takes the TRAILING slot (iOS convention); it replaces locate, collapse stays ---- */
  /* Done: an ink-only WORD in the trailing slot -- says "you are in a mode" (a ✓ already means "selected plan"
     in the panel; solid navy means NEXT). Same 32px row, no added header height. */
  #doneBtn { display: none; flex-shrink: 0; height: 32px; padding: 0 6px; margin: 0 -6px 0 0; position: relative; border: none; border-radius: 3px; cursor: pointer; align-items: center; justify-content: center;
    background: transparent; color: var(--navy); font: 700 13px/16px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .08em; }
  #doneBtn::before { content: ''; position: absolute; left: -2px; right: -2px; top: -6px; bottom: -6px; }
  #doneBtn:active { background: var(--state-press); }
  body.plan-adding.edit-x #sortBtn { display: none; }   /* X: the stops lead, the rest is A–Z; ⇅ has no job */
  #filtersPanel.editing .seg-wrap, #filtersPanel.editing #planLedger { display: none; }   /* Edit: the panel is only the Places filters -- it can't flip you out of editing */
  body.plan-adding #doneBtn { display: flex; }
  /* Done = the state system's ON tile (navy, paper text, 3px), its ON-pressed step, keyboard ring as the sort menu */
  #doneBtn:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--paper), 0 0 0 4px var(--navy); }
  #locationsHeader h2 .tn { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
  #locationsHeader h2 .ts { flex: none; white-space: pre; }
  /* a stop tile under the finger says what releasing will do: its number becomes − (pale pressed tile) */
  .rowslot.pressing .tile { background: var(--state-press); color: var(--navy); }
  .rowslot.pressing .tile .n { display: none; }
  .rowslot .tile .minus { display: none; font-size: 18px; line-height: 1; }
  .rowslot.pressing .tile .minus { display: block; }
  body.plan-adding #centerMeBtn { display: none; }
  /* plan ledger inline actions (the ⋯ of the current plan) */
  .plan-opt.acting { grid-template-columns: auto auto 1fr auto; }
  .plan-opt.acting .act.danger { color: var(--figure-deep); }

  /* ---- rows: stop number leads the name (same 15px line, navy, tabular); right slot = grip / tile ---- */
  .stopno { display: inline-block; min-width: 1.1em; margin-right: 6px; color: var(--navy); font-weight: 700; font-variant-numeric: tabular-nums; }
  .location-card.highlighted .stopno { color: var(--paper); }
  .rowslot { width: 44px; height: 44px; margin: -10px -8px -10px 0; border: none; background: none; padding: 0; display: flex; align-items: center; justify-content: center; color: var(--navy); cursor: pointer; position: relative; }
  .rowslot.grip { color: var(--ink-2); touch-action: pan-y; cursor: grab; }   /* hold-to-arm: a moving stroke scrolls */
  .rowslot.passive { cursor: inherit; pointer-events: none; }
  body.view-plans .location-card .row-stamp { transform: scale(.78); transform-origin: right center; margin-left: -16px; opacity: .8; }
  .rowslot .tile.line { border: 1px solid var(--navy); background: var(--paper-raised); color: var(--navy); }   /* Plans: the plain stop tile */
  .rowslot .tile.instop { border: 2px solid var(--navy); background: rgba(18, 41, 63, 0.12); color: var(--navy); }   /* Edit: "in this plan" -- heavier ink + tint, never solid (solid = NEXT) */
  body.plan-adding .location-card.in-plan { box-shadow: inset 3px 0 0 rgba(18, 41, 63, 0.55); }   /* Edit: a quiet leading-edge mark on a stop's row */
  .edit-rule { height: 0; border-top: 2px solid var(--navy); }   /* Option X: the line between the plan's stops and everything else (no label) */
  .location-card.highlighted .rowslot .tile.line { border-color: var(--paper); color: var(--paper); }
  body.plan-view #sortBtn { display: none; }   /* Plans: Plan order is the only order */
  .pin-num { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; line-height: 1; font: 700 12px/1 var(--font-ui); font-stretch: 85%; font-variant-numeric: tabular-nums; pointer-events: none; }   /* Plans: the app's own VISITED stamp, smaller + muted (the shared mark; no second visited language) */
  #filtersPanel.plan-view #cityFilters, #filtersPanel.plan-view #filters { display: none; }   /* Plans: the chips don't apply, so they aren't shown (Places and Edit show them) */
  .popup-remove { all: unset; position: relative; margin-left: 8px; cursor: pointer; color: var(--figure-deep); text-decoration: underline; text-underline-offset: 3px;
    font: 700 11px/14px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .08em; }
  .popup-remove::before { content: ''; position: absolute; left: -8px; right: -8px; top: -15px; bottom: -15px; }
  .rowslot.grip svg { width: 20px; height: 20px; }
  .location-card.highlighted .rowslot { color: var(--paper); }
  .rowslot .tile { width: 28px; height: 28px; box-sizing: border-box; border-radius: 3px; display: flex; align-items: center; justify-content: center;
    font: 700 14px/1 var(--font-ui); font-stretch: 80%; font-variant-numeric: tabular-nums; }
  .rowslot .tile.off { border: 1px solid var(--navy); background: var(--paper-raised); color: var(--navy); }
  .rowslot .tile.off svg { width: 16px; height: 16px; }
  .rowslot .tile.on { background: var(--state-on-bg); color: var(--state-on-fg); }
  .rowslot:active .tile.off { background: var(--state-press); }
  .rowslot:active .tile.on { background: var(--state-on-press); }
  .location-card.highlighted .rowslot .tile.on { background: var(--paper); color: var(--navy); }
  .view-plans .location-card { transition: transform 150ms ease, background 0.12s ease; }
  .location-card.dragging { position: relative; z-index: 5; background: var(--paper-raised); box-shadow: 0 8px 18px rgba(18,41,63,.25), 0 0 0 1px var(--navy); transition: none; }
  /* the plan's last row: an action row, same 56px ledger row, + in the badge column */
  .add-row { display: grid; grid-template-columns: var(--col-glyph) 1fr; column-gap: var(--gap); align-items: center; min-height: 56px; padding: var(--s2) var(--gutter); box-sizing: border-box;
    border-bottom: 1px solid var(--hair); background: var(--paper); cursor: pointer; color: var(--navy);
    font: 700 13px/16px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .06em; }
  .add-row svg { width: 20px; height: 20px; justify-self: center; }
  .add-row:active { background: var(--state-press); }
  .pstop { color: var(--ink-2); }
  #planUndo { position: fixed; z-index: 2600; display: flex; align-items: center; gap: 12px; height: 32px; padding: 0 0 0 var(--s3); background: var(--paper-raised); border: 1px solid var(--navy); border-radius: 2px; box-shadow: 2px 2px 0 var(--navy);
    font: 700 11px/14px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .08em; color: var(--navy); white-space: nowrap; }
  #planUndo[hidden] { display: none; }
  #planUndo button { all: unset; height: 32px; padding: 0 var(--s3); display: flex; align-items: center; border-left: 1px solid var(--hair); cursor: pointer; position: relative; text-decoration: underline; text-underline-offset: 3px; }
  #planUndo button::before { content: ''; position: absolute; left: 0; right: 0; top: -6px; bottom: -6px; }
  /* stand-in for the native confirm() (headless can't capture the OS dialog) */
  #nativeConfirm { position: fixed; inset: 0; z-index: 5000; background: rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; }
  #nativeConfirm .box { width: 270px; background: rgba(242,242,242,.97); border-radius: 14px; text-align: center; overflow: hidden; }
  #nativeConfirm .t { padding: 18px 16px 16px; font-size: 15px; line-height: 20px; color: #000; }
  #nativeConfirm .b { display: flex; border-top: 0.5px solid #c8c7cc; }
  #nativeConfirm .b span { flex: 1; height: 44px; line-height: 44px; font-size: 17px; color: #007aff; }
  #nativeConfirm .b span + span { border-left: 0.5px solid #c8c7cc; font-weight: 600; }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const SVG = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 12.5l5.5 5.5L20.5 6" fill="none" stroke="currentColor" stroke-width="2.25"/></svg>',
    grip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M5 8h14M5 12h14M5 16h14"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 20l4.5-1 10-10-3.5-3.5-10 10z"/><path d="M13.5 7l3.5 3.5"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>',
  };

  // ---- state (would be `plans` + `plan_stops` in Supabase, same RLS as locations: public read, two-email writes) ----
  const P = window.__plans = { view: 'places', plans: [], activeId: null, adding: false, editSort: null, placesSort: null, editLayout: 'X', mapNumbers: true, creating: false, renaming: false };
  const locById = id => locations.find(l => l.id === id);
  const shapeById = id => neighborhoodShapes.find(s => s.id === id);
  const active = () => P.plans.find(p => p.id === P.activeId) || null;
  const idx = (p, k, id) => p ? p.stops.findIndex(s => s.k === k && s.id === id) : -1;
  const inPlanView = () => P.view === 'plans' && !P.adding;
  const stopLatLng = s => { if (s.k === 'loc') { const l = locById(s.id); return l && [l.lat, l.lng]; } const nb = shapeById(s.id); return nb && shapeCentroid(nb); };
  const esc = s => escapeHtml(String(s));

  // ---- the list sets: Plans = the plan's stops that match the filters (the list rule holds in both views) ----
  const origVL = visibleLocations, origVS = visibleNeighborhoodShapes, origSortL = sortLocations, origSortS = sortShapes, origUpdateUI = updateUI;
  // Plans ignores the city and category filters: a plan always shows the WHOLE plan (the chips show unavailable).
  window.visibleLocations = () => { if (!inPlanView()) return origVL(); const p = active(); return p ? locations.filter(l => idx(p, 'loc', l.id) >= 0) : []; };
  window.visibleNeighborhoodShapes = () => { if (!inPlanView()) return origVS(); const p = active(); return p ? neighborhoodShapes.filter(n => idx(p, 'shape', n.id) >= 0) : []; };
  // Plans: always plan order. Edit mode: its own sort (default Plan order = the plan's stops first, then the rest).
  const planFirst = (arr, k) => { const p = active(); const st = arr.filter(x => idx(p, k, x.id) >= 0).sort((a, b) => idx(p, k, a.id) - idx(p, k, b.id)); return [st, arr.filter(x => idx(p, k, x.id) < 0)]; };
  window.sortLocations = locs => { if (inPlanView()) return planFirst(locs, 'loc')[0];
    if (P.adding && (P.editSort === 'plan' || P.editLayout === 'X')) { const [st, rest] = planFirst(locs, 'loc'); return st.concat(origSortL(rest)); } return origSortL(locs); };
  window.sortShapes = sh => { if (inPlanView()) return planFirst(sh, 'shape')[0];
    if (P.adding && (P.editSort === 'plan' || P.editLayout === 'X')) { const [st, rest] = planFirst(sh, 'shape'); return st.concat(origSortS(rest)); } return origSortS(sh); };

  // A shape that is a stop draws at any zoom while its plan is open (the zoom gate exists to thin
  // Places; a plan's own stops are never clutter). Other shapes keep the gate.
  const origMVS = mapVisibleNeighborhoodShapes;
  window.mapVisibleNeighborhoodShapes = () => { const v = origMVS(); const p = active(); if (P.view !== 'plans' || !p) return v;
    const extra = visibleNeighborhoodShapes().filter(n => idx(p, 'shape', n.id) >= 0 && !v.includes(n)); return v.concat(extra); };

  const list = document.getElementById('locationsList');
  const header = document.getElementById('locationsHeader');
  const h2 = header.querySelector('h2');
  const panel = document.getElementById('filtersPanel');

  // ---- header Done (Add mode only): trailing slot, where locate sits ----
  const doneBtn = document.createElement('button'); doneBtn.id = 'doneBtn'; doneBtn.textContent = 'Done'; doneBtn.setAttribute('aria-label', 'Done editing');
  document.getElementById('centerMeBtn').after(doneBtn);
  doneBtn.onclick = () => leaveEdit();

  // proposed copy for the app's sign-in (was "…add, edit, or delete locations…")
  const authP = [...document.querySelectorAll('#authModal p')].find(e => /locations/.test(e.textContent));
  if (authP) authP.textContent = 'You need to log in to make changes. Anyone can view places and plans without logging in.';

  // ---- Undo: TEMPORARY. The slip lives UNDO_MS after the last removal or undo; within that window it is
  // multi-level ("2 removed · Undo", each Undo restores the latest). It survives Done/Edit (same plan) and
  // docks above the header wherever it is (open, collapsed, rail). Leaving the plan (Places, another plan)
  // or the window running out ends it: the slip slides away, the removals stand.
  const UNDO_MS = 6000;
  const undo = document.createElement('div'); undo.id = 'planUndo'; undo.hidden = true; undo.setAttribute('role', 'status'); undo.setAttribute('aria-live', 'polite'); document.body.appendChild(undo);
  let undoStack = [], undoPlan = null, undoTimer = 0;
  function endUndo() { clearTimeout(undoTimer); undoStack = []; undoPlan = null; drawUndo(); }
  function armUndo() { clearTimeout(undoTimer); undoTimer = setTimeout(endUndo, UNDO_MS); }
  function drawUndo() {
    const p = active();
    const on = !!p && P.view === 'plans' && undoPlan === p.id && undoStack.length > 0;
    undo.hidden = !on; document.body.classList.toggle('sort-noting', on);
    if (!on) return;
    const last = undoStack[undoStack.length - 1];
    undo.innerHTML = `<span>${undoStack.length > 1 ? `${undoStack.length} removed` : `Removed ${esc(last.name)}`}</span><button type="button">Undo</button>`;
    undo.querySelector('button').onclick = () => { const e = undoStack.pop(); p.stops.splice(Math.min(e.at, p.stops.length), 0, e.stop); if (undoStack.length) armUndo(); else clearTimeout(undoTimer); updateUI(); };
    placeUndo();
  }
  function placeUndo() { if (undo.hidden) return; const band = header.getBoundingClientRect(); undo.style.top = (band.top - undo.offsetHeight - 2) + 'px'; undo.style.left = ''; undo.style.right = (innerWidth - band.right + 16) + 'px'; }
  document.getElementById('locations').addEventListener('transitionend', placeUndo);
  const showUndo = (name, data) => { const p = active(); if (undoPlan !== p.id) undoStack = []; undoPlan = p.id; undoStack.push({ ...data, name }); armUndo(); };
  P.endUndo = endUndo; P.UNDO_MS = UNDO_MS;

  function cardFor(el) { return el.dataset.id ? { k: 'loc', id: el.dataset.id } : { k: 'shape', id: Number(el.dataset.shapeId) }; }
  function nameOf(s) { return s.k === 'loc' ? locById(s.id).name : shapeById(s.id).label; }
  async function writeGate() { return await requireAuth(); }   // the app's own gate: signed out opens sign-in
  const live = document.createElement('div'); live.className = 'sr-only'; live.setAttribute('aria-live', 'polite'); document.body.appendChild(live);

  // Edit-mode tile: acts only on a near-still tap (DELETE_TAP_SLOP) and never reaches the row.
  function stillTap(btn, fn) {
    let d = null, travel = 0;
    ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousedown'].forEach(t => btn.addEventListener(t, e => e.stopPropagation(), { passive: true }));   // the row never sees a stroke that starts here
    btn.addEventListener('pointerdown', e => { e.stopPropagation(); d = [e.clientX, e.clientY]; travel = 0; btn.classList.add('pressing'); });
    btn.addEventListener('pointermove', e => { if (d) { travel = Math.max(travel, Math.hypot(e.clientX - d[0], e.clientY - d[1])); if (travel >= DELETE_TAP_SLOP) btn.classList.remove('pressing'); } });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => btn.addEventListener(t, () => setTimeout(() => btn.classList.remove('pressing'), 0)));
    btn.addEventListener('click', e => { e.stopPropagation(); if (e.detail && travel >= DELETE_TAP_SLOP) return; fn(); });
  }
  function removeStop(p, s) { const j = idx(p, s.k, s.id); if (j < 0) return; const [stop] = p.stops.splice(j, 1); showUndo(nameOf(s), { at: j, stop }); updateUI(); }
  P.removeStop = (k, id) => removeStop(active(), { k, id });

  // ---- the grip (EDIT MODE ONLY, Plan order): HOLD TO ARM. touch-action: pan-y, so a stroke that starts
  // on the grip and moves before HOLD_MS is an ordinary list scroll. Held still for HOLD_MS it arms: from
  // then on its touchmoves are preventDefault-ed and drag the row among the STOP rows. The row never sees
  // grip touches (no swipe, no tap-to-fly). Mouse drags at once. Keyboard: ArrowUp / ArrowDown.
  const HOLD_MS = 250, ARM_SLOP = 6;
  const stopRows = p => [...list.querySelectorAll('.location-card')].filter(r => r.offsetParent && (s => idx(p, s.k, s.id) >= 0)(cardFor(r)));
  function attachGrip(g, card, p) {
    let t0 = null, armed = false, timer = 0, rows = null, from = -1, to = -1, h = 56;
    const begin = () => { armed = true; rows = stopRows(p); from = to = rows.indexOf(card); h = card.offsetHeight; card.classList.add('dragging'); };
    const drag = y => { const dy = y - t0[1]; card.style.transform = `translateY(${dy}px)`;
      to = Math.max(0, Math.min(rows.length - 1, from + Math.round(dy / h)));
      rows.forEach((r, k) => { if (r === card) return; const sh = (from < to && k > from && k <= to) ? -h : (from > to && k < from && k >= to) ? h : 0; r.style.transform = sh ? `translateY(${sh}px)` : ''; }); };
    const drop = () => { clearTimeout(timer); if (!armed) { t0 = null; return; } armed = false; t0 = null;
      rows.forEach(r => { r.style.transform = ''; }); card.classList.remove('dragging');
      if (to !== from) moveStop(p, rows.map(cardFor), from, to); P.lastDrop = { from, to }; updateUI(); };
    g.addEventListener('touchstart', e => { e.stopPropagation(); if (!currentUser) return; const t = e.touches[0]; t0 = [t.clientX, t.clientY]; timer = setTimeout(begin, HOLD_MS); }, { passive: true });
    g.addEventListener('touchmove', e => { e.stopPropagation(); const t = e.touches[0]; if (!t0) return;
      if (!armed) { if (Math.hypot(t.clientX - t0[0], t.clientY - t0[1]) > ARM_SLOP) { clearTimeout(timer); t0 = null; } return; }   // moved first: a scroll, never a drag
      e.preventDefault(); drag(t.clientY); }, { passive: false });
    g.addEventListener('touchend', e => { e.stopPropagation(); drop(); });
    g.addEventListener('touchcancel', e => { e.stopPropagation(); drop(); });
    g.addEventListener('mousedown', e => e.stopPropagation());
    g.addEventListener('click', e => { e.stopPropagation(); if (!currentUser) requireAuth(); });
    g.addEventListener('pointerdown', e => { e.stopPropagation(); if (e.pointerType !== 'mouse' || !currentUser) return; try { g.setPointerCapture(e.pointerId); } catch (_) {}
      t0 = [e.clientX, e.clientY]; begin();
      const mv = ev => drag(ev.clientY), up = () => { g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); drop(); };
      g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); });
    g.addEventListener('keydown', e => { if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return; e.preventDefault();
      const r = stopRows(p), f = r.indexOf(card), tt = f + (e.key === 'ArrowUp' ? -1 : 1);
      if (tt < 0 || tt >= r.length) return; moveStop(p, r.map(cardFor), f, tt); updateUI();
      const s = cardFor(card); live.textContent = `${nameOf(s)}, stop ${idx(p, s.k, s.id) + 1} of ${p.stops.length}`;
      const again = list.querySelector(s.k === 'loc' ? `[data-id="${s.id}"] .grip` : `[data-shape-id="${s.id}"] .grip`); if (again) again.focus(); });
  }
  function moveStop(p, keys, from, to) { const mv = keys[from], tg = keys[to];
    const [stop] = p.stops.splice(idx(p, mv.k, mv.id), 1); const ti = idx(p, tg.k, tg.id); p.stops.splice(from < to ? ti + 1 : ti, 0, stop); }

  // NEXT = the stop after the last visited pin in plan order (stop 1 if none): shapes, which have no
  // visited state, are passed once anything after them is visited.
  function nextIndex(p) { let last = -1; p.stops.forEach((s, i) => { if (s.k === 'loc' && locById(s.id)?.visited) last = i; }); return last + 1 < p.stops.length ? last + 1 : -1; }
  P.nextIndex = () => { const p = active(); return p ? nextIndex(p) : -1; };
  const editPlanOrder = () => P.adding && (P.editSort === 'plan' || P.editLayout === 'X');

  function decorate() {
    const p = active();
    document.body.classList.toggle('plan-adding', P.adding);
    document.body.classList.toggle('view-plans', P.view === 'plans');
    document.body.classList.toggle('plan-view', inPlanView());
    document.body.classList.toggle('edit-x', P.adding && P.editLayout === 'X');
    const cards = [...list.querySelectorAll('.location-card')];
    // Title = whatever the list is: "<City> list (N)" (Places, the app's), the plan's name (Plans, and
    // Edit mode -- Done in the trailing slot says it's being edited). No count on a plan.
    if (P.view === 'plans') h2.textContent = p ? p.name : 'Plans';
    list.querySelectorAll('.add-row').forEach(e => e.remove());
    const nx = p ? nextIndex(p) : -1;
    cards.forEach(c => {
      const s = cardFor(c);
      c.querySelectorAll('.rowslot').forEach(e => e.remove());
      const x = c.querySelector('.delete-btn');
      if (!P.adding) c.classList.remove('in-plan');
      if (P.view === 'places' || !p) { if (x) x.style.display = ''; return; }
      if (x) x.style.display = 'none';
      const acts = c.querySelector('.location-actions');
      const i = idx(p, s.k, s.id);
      const visited = s.k === 'loc' && !!locById(s.id).visited;
      if (inPlanView()) {
        // Plans is READ-ONLY for following: an outline number tile (information), filled only on NEXT.
        const t = document.createElement('span'); t.className = 'rowslot passive';
        t.innerHTML = `<span class="tile ${i === nx ? 'on next' : 'line'}" role="img" aria-label="Stop ${i + 1}${i === nx ? ', next' : ''}${visited ? ', visited' : ''}">${i + 1}</span>`;
        acts.appendChild(t);
        return;
      }
      // Edit mode: one outline tile. + adds; a number (the stop) takes it out (− while pressed); the grip reorders (Plan order only).
      const tile = document.createElement('button'); tile.className = 'rowslot';
      c.classList.toggle('in-plan', i >= 0);
      if (i >= 0) { tile.innerHTML = `<span class="tile instop"><span class="n">${i + 1}</span><span class="minus" aria-hidden="true">&minus;</span></span>`; tile.setAttribute('aria-label', `Stop ${i + 1}: ${nameOf(s)}. Remove from ${p.name}`); }
      else { tile.innerHTML = `<span class="tile off">${SVG.plus}</span>`; tile.setAttribute('aria-label', `Add ${nameOf(s)} to ${p.name}`); }
      tile.setAttribute('aria-pressed', String(i >= 0));
      stillTap(tile, async () => { if (!(await writeGate())) return; if (idx(p, s.k, s.id) >= 0) removeStop(p, s); else { p.stops.push(s); updateUI(); } });
      acts.appendChild(tile);
      if (i >= 0 && editPlanOrder() && p.stops.length > 1) {
        const g = document.createElement('button'); g.className = 'rowslot grip'; g.innerHTML = SVG.grip;
        g.setAttribute('aria-label', `Reorder ${nameOf(s)}, stop ${i + 1} of ${p.stops.length}. Hold and drag, or use the up and down arrow keys.`);
        attachGrip(g, c, p); acts.appendChild(g);
      }
    });
    // Plan order puts the plan's stops first (pins and shapes interleaved by position), then everything
    // else in the list's own order. Every row is a place; this is a sort key, like Starred.
    if (p && (inPlanView() || editPlanOrder())) {
      const empty = document.getElementById('locationsEmpty');
      const inP = c => { const s = cardFor(c); return idx(p, s.k, s.id); };
      const stops = cards.filter(c => inP(c) >= 0).sort((a, b) => inP(a) - inP(b)), rest = cards.filter(c => inP(c) < 0);
      stops.concat(rest).forEach(c => list.insertBefore(c, empty));
    }
    list.querySelectorAll('.edit-rule').forEach(e => e.remove());
    if (p && P.adding && P.editLayout === 'X') { const st = cards.filter(c => (s => idx(p, s.k, s.id))(cardFor(c)) >= 0); const r = document.createElement('div'); r.className = 'edit-rule'; r.setAttribute('role', 'separator');
      if (st.length) st.sort((a, b) => (s => idx(p, s.k, s.id))(cardFor(a)) - (s => idx(p, s.k, s.id))(cardFor(b)))[st.length - 1].after(r); else list.insertBefore(r, list.firstChild); }
    // "Edit stops": an ACTION row (like the empty state), not a place -- exempt from tap-to-fly.
    if (inPlanView() && p) {
      const r = document.createElement('div'); r.className = 'add-row'; r.setAttribute('role', 'button'); r.tabIndex = 0;
      r.innerHTML = `${SVG.pencil}<span>Edit stops</span>`;
      r.onclick = async () => { if (!(await writeGate())) return; enterEdit(); };
      list.insertBefore(r, list.firstChild);
    }
    const empty = document.getElementById('locationsEmpty');
    if (P.view === 'plans' && !p) { empty.style.display = 'block'; empty.lastChild.textContent = 'No plans yet.'; }
    else if (inPlanView() && p && !cards.length) { empty.style.display = 'block'; empty.lastChild.textContent = 'No stops yet.'; }
    else if (empty.lastChild.nodeType === 3) empty.lastChild.textContent = 'Nothing here yet.';
    // shape stops: their popup names the stop (information only)
    neighborhoodLayersById.forEach((layer, id) => {
      const nb = shapeById(id); const i = idx(p, 'shape', id);
      layer.setPopupContent(`<strong>${esc(nb.label)}</strong>${P.view === 'plans' && i >= 0 ? `<span class="pstop"> &middot; Stop ${i + 1} of ${p.stops.length}</span>` : ''}${nb.note ? `<p>${esc(nb.note)}</p>` : ''}`);
    });
    // map pins: the stop number replaces the category glyph (decided: on). Shape stops: a numbered diamond.
    markersById.forEach((m, id) => { m.marker.setIcon(markerIcon(m.loc, id === highlightedId));
      const stop = p && P.view === 'plans' && idx(p, 'loc', id) >= 0;
      m.marker.setZIndexOffset(id === highlightedId ? Z_HIGHLIGHTED : stop ? Z_HIGHLIGHTED - 1 : (m.loc.starred ? Z_PIN_STARRED : 0)); });   // a stop pin sits above any place pin it overlaps
    drawShapeNumbers();
    drawPanel();
    drawUndo();
  }
  window.updateUI = function () { origUpdateUI(); decorate(); };
  // Edit opens in the Places list's CURRENT sort. Choosing a sort in Edit is session-only: it never writes
  // Places' persisted sort, and Places' order is restored on Done / leaving.
  function enterEdit() { P.adding = true; P.placesSort = sortMode; P.editSort = sortMode; updateUI(); }
  function leaveEdit() { P.adding = false; if (P.placesSort && sortMode !== P.placesSort) setSortMode(P.placesSort, { announce: false, persist: false }); else updateUI(); list.scrollTop = 0; }   // back to the top: Edit stops + NEXT in view
  P.leaveEdit = leaveEdit;
  P.enterEdit = enterEdit;

  // ---- popup: "· Stop n of m" joins the category line (information only; no controls) ----
  const origPopup = buildPopupHtml;
  window.buildPopupHtml = function (loc) {
    let h = origPopup(loc); const p = active(); const i = idx(p, 'loc', loc.id);
    if (P.view === 'plans' && i >= 0) { const k = h.indexOf('class="popup-cat"'); const e = h.indexOf('</div>', k); h = h.slice(0, e) + `<span class="pstop">&middot; Stop ${i + 1} of ${p.stops.length}</span>` + h.slice(e); }
    return h;
  };

  // ---- map numbers (owner option, P.mapNumbers): in Plans, a stop pin shows its number INSTEAD of the
  // category glyph -- the same ring, no added badge or dot. Solo pins only (>= GLYPH_MIN_ZOOM); clusters
  // below SOLO_MIN_ZOOM keep their own count; the star keeps its corner.
  const origMarkerIcon = markerIcon;
  window.markerIcon = function (loc, highlighted) {
    const p = active(), i = idx(p, 'loc', loc.id);
    if (!P.mapNumbers || P.view !== 'plans' || i < 0 || !map || map.getZoom() < GLYPH_MIN_ZOOM) return origMarkerIcon(loc, highlighted);
    const size = MARKER_SIZE_NEAR + (highlighted ? MARKER_HI_DELTA : 0), ink = categoryInk(loc.category);
    const next = inPlanView() && i === nextIndex(p) && !highlighted;   // NEXT: navy fill, paper numeral -- the list's filled tile
    const fill = highlighted ? ink : next ? '#12293F' : '#F2EBDD', fg = highlighted || next ? '#F2EBDD' : ink;
    const badge = badgeHtml(loc.category, markerKind(loc), size, { ink, fill, mark: fg, rim: highlighted ? 2.5 : 2, glyph: false });
    const num = `<span class="pin-num${next ? ' pin-next' : ''}" style="color:${fg}">${i + 1}</span>`;
    const star = loc.starred ? markerStarHtml(size) : '';
    return L.divIcon({ html: `<div class="${highlighted ? 'highlighted-marker' : ''}" style="position:relative;width:${size}px;height:${size}px;line-height:0;">${badge}${num}${star}</div>`, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
  };

  // A shape stop has no pin, so its number sits in the list's own shape badge -- a diamond ring in the
  // shape's ink -- at the shape's centroid: one mark per stop, like a pin. Same zoom gate as pin numbers
  // (>= GLYPH_MIN_ZOOM); tap = the shape's own tap-to-fly + popup.
  const shapeNums = L.layerGroup();
  function drawShapeNumbers() {
    shapeNums.clearLayers(); if (!map) return; if (!map.hasLayer(shapeNums)) shapeNums.addTo(map);
    const p = active(); if (!P.mapNumbers || P.view !== 'plans' || !p || map.getZoom() < GLYPH_MIN_ZOOM) return; const nx = inPlanView() ? nextIndex(p) : -1;
    p.stops.forEach((st, i) => { if (st.k !== 'shape') return; const nb = shapeById(st.id); if (!nb) return; const c = shapeCentroid(nb); if (!c) return;
      const size = MARKER_SIZE_NEAR, ink = nb.color || categoryInk(nb.type);
      const next = i === nx, fill = next ? '#12293F' : '#F2EBDD', fg = next ? '#F2EBDD' : ink;
      const html = `<div class="shape-num-mk" style="position:relative;width:${size}px;height:${size}px;line-height:0;">${badgeHtml(nb.type, 'diamond', size, { ink, fill, mark: fg, rim: 2, glyph: false })}<span class="pin-num${next ? ' pin-next' : ''}" style="color:${fg}">${i + 1}</span></div>`;
      L.marker(c, { icon: L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] }), zIndexOffset: Z_HIGHLIGHTED - 1, keyboard: false })
        .on('click', () => focusShape(st.id)).addTo(shapeNums); });
  }
  map.on('zoomend', drawShapeNumbers);

  // ---- sort: hidden in Plans (Plan order is the only order). Edit mode keeps ⇅ (it is the Places list),
  // with "Plan order" (stops first, draggable) as its default + the same six. ----
  const origRS = renderSortMenu;
  window.renderSortMenu = function () {
    origRS();
    if (!P.adding || P.editLayout === 'X') { if (P.adding) document.getElementById('sortMenu').querySelectorAll('.sort-opt').forEach(o => o.setAttribute('aria-checked', String(o.dataset.sort === sortMode))); return; }
    const menu = document.getElementById('sortMenu');
    menu.querySelectorAll('.sort-opt').forEach(o => o.setAttribute('aria-checked', String(o.dataset.sort === P.editSort)));
    const first = menu.querySelector('.sort-opt');
    const po = first.cloneNode(true); po.dataset.sort = 'plan'; po.querySelector('span').textContent = 'Plan order'; po.setAttribute('aria-checked', String(P.editSort === 'plan'));
    const why = po.querySelector('.sort-why'); if (why) why.textContent = '';
    first.before(po);
  };
  P.setEditSort = m => { P.editSort = m; if (m !== 'plan' && m !== sortMode) setSortMode(m, { announce: false, persist: false }); else updateUI(); };
  // In Edit, the ⇅ menu is Edit's own: intercept before the app's handler (which would persist the choice).
  document.getElementById('sortMenu').addEventListener('click', e => { if (!P.adding) return; const o = e.target.closest('.sort-opt'); if (!o) return;
    e.stopPropagation(); closeSortMenu(); P.setEditSort(o.dataset.sort); }, true);

  // ---- the panel: switch, then (Plans side) the plan ledger; city + category chips always follow ----
  const segWrap = document.createElement('div'); segWrap.className = 'seg-wrap';
  const ledger = document.createElement('div'); ledger.id = 'planLedger'; ledger.setAttribute('role', 'radiogroup'); ledger.setAttribute('aria-label', 'Plan');
  panel.prepend(ledger); panel.prepend(segWrap);
  function drawPanel() {
    panel.classList.toggle('plans-side', P.view === 'plans');
    panel.classList.toggle('plan-view', inPlanView());
    panel.classList.toggle('editing', P.adding);
    segWrap.innerHTML = `<div class="seg" role="radiogroup" aria-label="List"><button role="radio" data-v="places" aria-checked="${P.view === 'places'}">Places</button><button role="radio" data-v="plans" aria-checked="${P.view === 'plans'}">Plans</button></div>`;
    segWrap.querySelectorAll('button').forEach(b => b.onclick = () => { P.view = b.dataset.v; P.acting = false;
      if (P.view === 'places') { if (P.adding) leaveEdit(); endUndo(); }   // the city was never changed by the plan
      if (P.view === 'plans' && !P.activeId && P.plans[0]) P.activeId = P.plans[0].id; updateUI(); });
    ledger.innerHTML = P.plans.map(p => {
      if (P.acting && p.id === P.activeId) return `<div class="plan-opt editing acting"><button class="act primary" data-a="rename">Rename</button><button class="act danger" data-a="delete">Delete plan</button><span></span><button class="act" data-a="cancel">Cancel</button></div>`;
      if (P.renaming && p.id === P.activeId) return `<div class="plan-opt editing"><input value="${esc(p.name)}" aria-label="Plan name"><button class="act" data-a="cancel">Cancel</button><button class="act primary" data-a="save">Save</button></div>`;
      return `<div class="plan-opt" role="radio" aria-checked="${p.id === P.activeId}"><button class="pick" data-id="${p.id}" aria-label="${esc(p.name)}, ${p.stops.length} stops"></button>${SVG.check.replace('<svg', '<svg class="ck"')}<span class="nm">${esc(p.name)}</span><span class="ct">${p.stops.length} ${p.stops.length === 1 ? 'stop' : 'stops'}</span>${p.id === P.activeId ? `<button class="more" aria-label="Plan actions" aria-haspopup="menu">${SVG.more}</button>` : '<span></span>'}</div>`;
    }).join('') + (P.creating
      ? `<div class="plan-opt editing"><input placeholder="Plan name" value="${esc(P.creating === true ? '' : P.creating)}" aria-label="New plan name"><button class="act" data-a="cancel">Cancel</button><button class="act primary" data-a="create">Create</button></div>`
      : `<div class="plan-opt new"><button class="pick" data-new="1" aria-label="New plan"></button>${SVG.plus.replace('<svg', '<svg class="ck"')}<span class="nm">New plan</span><span></span><span></span></div>`);
    ledger.querySelectorAll('.pick[data-id]').forEach(b => b.onclick = () => choosePlan(b.dataset.id));
    const nb = ledger.querySelector('.pick[data-new]'); if (nb) nb.onclick = async () => { if (!(await writeGate())) return; P.creating = true; drawPanel(); ledger.querySelector('input').focus(); };
    const more = ledger.querySelector('.more'); if (more) more.onclick = () => { P.acting = true; drawPanel(); };
    ledger.querySelectorAll('.act').forEach(a => a.onclick = async () => {
      const inp = ledger.querySelector('input'); const v = inp ? inp.value.trim() : '';
      if (a.dataset.a === 'cancel') { P.creating = false; P.renaming = false; P.acting = false; drawPanel(); return; }
      if (a.dataset.a === 'rename') { P.acting = false; if (!(await writeGate())) return; P.renaming = true; drawPanel(); return; }
      if (a.dataset.a === 'delete') { P.acting = false; if (!(await writeGate())) return; const p = active();
        if (confirm(`Delete “${p.name}”? Its places stay in your list.`)) { P.plans = P.plans.filter(q => q !== p); P.activeId = P.plans[0] ? P.plans[0].id : null; }
        updateUI(); return; }
      if (a.dataset.a === 'create' && v) { const p = { id: 'p' + Date.now(), name: v, stops: [] }; P.plans.push(p); P.activeId = p.id; P.creating = false; P.view = 'plans'; closeFiltersPanel(); enterEdit(); }
      if (a.dataset.a === 'save' && v) { active().name = v; P.renaming = false; updateUI(); }
    });
  }
  function choosePlan(id) {
    P.activeId = id; P.view = 'plans'; P.renaming = false;
    const p = active();
    const cities = [...new Set(p.stops.map(s => s.k === 'loc' ? locById(s.id).city : shapeById(s.id).city))];

    // choosing a plan goes to it: the city chip follows the plan (one city, or All cities if it spans)
    if (id !== undoPlan) endUndo();   // leaving a plan ends its Undo window
    const pts = p.stops.map(stopLatLng).filter(Boolean);
    if (pts.length) map.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [40, 90], paddingBottomRight: [40, 40 + (panel.classList.contains("visible") && innerWidth < 900 ? panel.offsetHeight : 0)], maxZoom: 16, animate: false });
    updateUI();
  }
  P.choosePlan = choosePlan;
  P.openActions = () => { P.acting = true; drawPanel(); };
  // a city chip tapped by hand while in a plan is the user's choice: exit keeps it

  P.nativeConfirm = text => { const d = document.createElement('div'); d.id = 'nativeConfirm'; d.innerHTML = `<div class="box"><div class="t">${esc(text)}</div><div class="b"><span>Cancel</span><span>OK</span></div></div>`; document.body.appendChild(d); };
  updateUI();
})();
