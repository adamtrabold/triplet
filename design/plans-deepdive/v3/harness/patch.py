#!/usr/bin/env python3
"""Plans v3 prototype = the BUILT index.html (phase 1, commit ba0865c) + these edits.

    python3 patch.py <built index.html> <out.html>

Every edit is an exact, single-occurrence string replacement (the script fails loudly if
the build drifts), so the frames are the real page with only the v3 changes. Runtime knobs
for the option frames (window.__V3 before load): num = 'ring' (picked) | 'tile';
next = 'double-word' (picked) | 'fill' | 'double' | 'word' | 'navy' (the phase-1 look).
"""
import sys

src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
EDITS = []
def edit(old, new, name):
    EDITS.append((old, new, name))

# ---------------------------------------------------------------------------- CSS
edit("""    #filtersPanel:not(.plans-side) #planLedger,
    #filtersPanel.plans-side #cityFilters,
    #filtersPanel.plans-side #filters { display: none; }""",
"""    /* v3: the filters are identical on both sides. Only the plan row is Plans-only. */
    #filtersPanel:not(.plans-side) #planLedger { display: none; }""", 'panel parity')

edit("""    /* Plans: Plan order is the only order, so there's no sort. */
    body.plan-view #sortBtn { display: none; }
""", """    /* v3: Plans keeps the sort; it orders the places below the rule (stops keep plan order). */
""", 'sort visible in plans')

edit("""    /* Map: a stop's number replaces its glyph inside the same ring. */""",
"""    /* ---- v3 (design/plans-deepdive/v3) ---------------------------------------
       A stop row is a Places row with two swaps: its number takes the glyph's
       place in the SAME leading ring (as on the map), and its trailing X
       removes it from the plan. An other-place row swaps the X for a +. */
    .row-badge.row-num { position: relative; border-radius: 3px; }
    body.plan-view .row-badge.row-num { cursor: grab; touch-action: pan-y; }
    .row-num-n {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;
      font-family: var(--font-ui); font-stretch: 85%; font-weight: 700; font-size: 12px; line-height: 1; font-variant-numeric: tabular-nums;
    }
    .row-num.fill .row-num-n { color: var(--paper); }
    .location-card.highlighted .row-num.fill .row-num-n { color: var(--figure-deep); }
    .row-num:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--navy); }
    /* option T2: a small quiet tile in the leading slot */
    .row-tile {
      width: 22px; height: 22px; box-sizing: border-box; display: flex; align-items: center; justify-content: center;
      border: 1px solid var(--ink-2); border-radius: 3px; color: var(--ink-2);
      font-family: var(--font-ui); font-stretch: 85%; font-weight: 700; font-size: 12px; line-height: 1; font-variant-numeric: tabular-nums;
    }
    .location-card.highlighted .row-tile { color: var(--paper); border-color: var(--paper); }
    /* + shares the X's slot, size and ink: both say "in or out of this list". */
    /* 44px targets: the 28px number and the 28px +/X each reach 8px past their box. */
    .plan-add, .plan-x { position: relative; }
    .plan-add::before, .plan-x::before, body.plan-view .row-badge.row-num::before { content: ''; position: absolute; inset: -8px; }
    /* The plan's end: Places' own group divider (2px --hair), then everything else the filters match. */
    .plan-rule { height: 0; border-top: 1px solid var(--hair); }
    .plan-list-note {
      padding: var(--s4) var(--gutter); border-bottom: 1px solid var(--hair); text-align: center;
      color: var(--ink-2); font-size: 12px; line-height: 16px; font-style: italic;
    }
    /* Reorder: hold the number 400ms, then drag. The row lifts; the others make room. */
    .location-card.plan-lifted { position: relative; z-index: 5; background: var(--paper-raised); box-shadow: 0 0 0 1px var(--hair), 0 3px 0 var(--hair); }   /* r11: lifted on paper, no navy box */
    .location-card.plan-shift { transition: transform 0.15s ease; }
    @media (prefers-reduced-motion: reduce) { .location-card.plan-shift { transition: none; } }
    /* The collapsed plan row: the ledger's current row, with a chevron. */
    .plan-chev { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: var(--navy); pointer-events: none; }
    .plan-chev svg { width: 16px; height: 16px; display: block; }
    .plan-opt.plan-cur .plan-pick { grid-column: auto; padding-right: 0; }
    /* The slip: removed / added, with Undo, for 6s. */
    #planSlip { position: fixed; z-index: 2600; display: flex; align-items: center; height: 32px; max-width: calc(100vw - 32px); padding: 0 0 0 var(--s3);
      background: var(--paper-raised); border: 1px solid var(--hair); border-radius: 3px; color: var(--navy);   /* r11: a chip's hairline, not the menu's navy box */
      font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 11px; line-height: 12px; letter-spacing: 0.08em; }
    #planSlip[hidden] { display: none; }
    /* r9: docked on the rule's caption line: the rule's own box, square, no shadow; the Undo
       target stays 44px tall via its ::before without reaching the next row's + (hit area). */
    #planSlip.on-rule { max-width: none; box-sizing: border-box; border-radius: 0; box-shadow: none; border-width: 1px 0; padding-left: var(--gutter); }
    #planSlip.on-rule .slip-text, #planSlip.on-header .slip-text { flex: 1; }
    #planSlip.on-rule button { height: 100%; margin-left: var(--s3); padding: 0 var(--gutter) 0 var(--s3); }
    #planSlip.on-rule button::before { top: -8px; bottom: -4px; }
    #planSlip.on-header { box-sizing: border-box; max-width: none; }
    #planSlip.on-header.wide { letter-spacing: 0.04em; padding-left: 8px; }   /* r10: the one-time hint on one line at 390px */
    #planSlip.on-header.wide button { margin-left: 8px; padding: 0 10px; }
    #planSlip .slip-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
    #planSlip button { all: unset; flex-shrink: 0; height: 32px; margin-left: var(--s3); padding: 0 var(--s3); display: flex; align-items: center; border-left: 1px solid var(--hair); cursor: pointer; position: relative; text-decoration: underline; text-underline-offset: 3px; }
    #planSlip button::before { content: ''; position: absolute; left: 0; right: 0; top: -6px; bottom: -6px; }

    /* Map: a stop's number replaces its glyph inside the same ring. */""", 'v3 css')

# ---------------------------------------------------------------------------- filters: both views
edit("""    function visibleLocations() {
      // Plans: the plan's stops, whole -- the city and category filters don't apply.
      if (inPlanView()) return planMarks().rows.filter(r => r.loc).map(r => r.loc);
      return locations.filter(loc =>
        filters.categories[loc.category] &&
        (filters.city === null || loc.city === filters.city));
    }""",
"""    // v3: the filters apply in BOTH views. Plans adds the open plan's stops,
    // whole and whatever the filters say (the chips choose what you can add;
    // they never hide your plan).
    function visibleLocations() {
      const match = locations.filter(loc =>
        filters.categories[loc.category] &&
        (filters.city === null || loc.city === filters.city));
      if (!inPlanView()) return match;
      const stops = planMarks().rows.filter(r => r.loc).map(r => r.loc);
      const inPlan = new Set(stops.map(l => l.id));
      return stops.concat(match.filter(l => !inPlan.has(l.id)));
    }""", 'visibleLocations')

edit("""    function visibleNeighborhoodShapes() {
      if (inPlanView()) return planMarks().rows.filter(r => r.nb).map(r => r.nb);
      return neighborhoodShapes.filter(nb => {
        if (!filters.categories[nb.type]) return false;   // same category filter chips as pins
        if (!isAllCities() && nb.city !== activeCity) return false;
        return true;
      });
    }""",
"""    function visibleNeighborhoodShapes() {
      const match = neighborhoodShapes.filter(nb => {
        if (!filters.categories[nb.type]) return false;   // same category filter chips as pins
        if (!isAllCities() && nb.city !== activeCity) return false;
        return true;
      });
      if (!inPlanView()) return match;
      const stops = planMarks().rows.filter(r => r.nb).map(r => r.nb);
      const inPlan = new Set(stops.map(n => n.id));
      return stops.concat(match.filter(n => !inPlan.has(n.id)));
    }""", 'visibleNeighborhoodShapes')

edit("""      if (inPlanView()) return visibleNeighborhoodShapes();
      const zoom = map.getZoom();
      return visibleNeighborhoodShapes().filter(nb => zoom >= neighborhoodMinZoom(nb));""",
"""      const zoom = map.getZoom(), pm = planMarks();
      return visibleNeighborhoodShapes().filter(nb => pm.byShape.has(nb.id) || zoom >= neighborhoodMinZoom(nb));""", 'mapVisibleNeighborhoodShapes')

edit("""    function mapVisibleLocations() {
      const visible = visibleLocations();
      if (!map || map.getZoom() >= SOLO_MIN_ZOOM) return { solo: visible, clusters: [] };
""",
"""    function mapVisibleLocations() {
      const all = visibleLocations();
      if (!map || map.getZoom() >= SOLO_MIN_ZOOM) return { solo: all, clusters: [] };
      // v3: a stop is never absorbed into a cluster -- it keeps its number at every zoom.
      const pm = planMarks();
      const pinned = all.filter(l => pm.byLoc.has(l.id));
      const visible = pinned.length ? all.filter(l => !pm.byLoc.has(l.id)) : all;
""", 'mapVisibleLocations head')
edit("""        clusters.push({ id, lat, lng, count: members.length, starred });
      });
      return { solo, clusters };""",
"""        clusters.push({ id, lat, lng, count: members.length, starred });
      });
      return { solo: pinned.concat(solo), clusters };""", 'mapVisibleLocations tail')

# ---------------------------------------------------------------------------- map numbers
edit("""    const Z_PLAN_NEXT = 560, Z_PLAN_STOP = 550;""",
"""    // v3: stops are never clustered, so they sit ABOVE clusters (a count must not bury a stop).
    const Z_PLAN_NEXT = 760, Z_PLAN_STOP = 750;""", 'z ladder')

edit("""      const stop = showGlyph ? planMarks().byLoc.get(loc.id) : null;
      if (stop) return planNumberIcon(loc.category, markerKind(loc), ink, stop, size, highlighted, loc.starred);""",
"""      // v3: numbers at EVERY zoom, always at the near size (a number needs the room).
      const stop = planMarks().byLoc.get(loc.id);
      if (stop) return planNumberIcon(loc.category, markerKind(loc), ink, stop, MARKER_SIZE_NEAR + (highlighted ? MARKER_HI_DELTA : 0), highlighted, loc.starred);""", 'markerIcon stop')

edit("""    function planNumberIcon(category, kind, ink, r, size, highlighted, starred) {
      const next = r.next && !highlighted;
      const fill = highlighted ? ink : next ? '#12293F' : '#F2EBDD';   // --navy / --paper (SVG attributes can't take tokens)
      const fg = highlighted || next ? '#F2EBDD' : ink;
      const badge = badgeHtml(category, kind, size, { ink, fill, mark: fg, rim: highlighted ? 2.5 : 2, glyph: false });
      const star = starred ? markerStarHtml(size) : '';
      const html = `<div class="${highlighted ? 'highlighted-marker' : ''}" style="position:relative;width:${size}px;height:${size}px;line-height:0;">${badge}<span class="pin-num" style="color:${fg}">${r.n}</span>${star}</div>`;
      return L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
    }""",
"""    const V3 = Object.assign({}, window.__V3 || {});   // option-frame knobs (map: 'plan-only' for owner-12's option b)
    // r7: a stop on the map is its ordinary Places pin (same ring, same glyph) plus a numbered
    // TAG -- r11: one neutral style for every stop: a small square paper tile ruled 1px --ink-2 with an
    // --ink-2 numeral (numbers are grey, one state). The tag alone marks a stop (no heavier rim, no ring: they didn't read at 1x
    // and the ring covered neighbours). applyPlanMap() moves each tag to a free corner and merges
    // the tags of stops whose pins overlap ("2–3").
    function planNumberIcon(category, kind, ink, r, size, highlighted, starred) {
      // r18 (owner: "change the icon to the number like we used to do"): a stop that is its own pin
      // shows its NUMBER in place of the category glyph -- same ring (its category ink), same size,
      // same paper field; the numeral is grey (--ink-2), the one number style. Selected: the ring
      // fills with its ink and the numeral turns paper, as a selected Places pin does.
      const badge = badgeHtml(category, kind, size, { ink, fill: highlighted ? ink : '#F2EBDD', mark: ink, rim: highlighted ? 2.5 : 2, glyph: false });
      const star = starred ? markerStarHtml(size) : '';
      const html = `<div class="plan-stop${highlighted ? ' highlighted-marker' : ''}" data-n="${r.n}" style="position:relative;width:${size}px;height:${size}px;line-height:0;"><div style="position:absolute;left:0;top:0">${badge}</div><span class="pin-n${r.n > 9 ? ' two' : ''}${highlighted ? ' on' : ''}">${r.n}</span>${star}</div>`;
      return L.divIcon({ html, className: 'plan-stop-icon', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
    }""", 'planNumberIcon')

edit("""      if (inPlanView() && map.getZoom() >= GLYPH_MIN_ZOOM) {
        planMarks().rows.forEach(r => {""",
"""      if (inPlanView()) {   // v3: every zoom
        planMarks().rows.forEach(r => {""", 'shape markers every zoom')

# ---------------------------------------------------------------------------- rows
edit("""    function planTileHtml(r) {""",
"""    // r13/r14 (owner: "Number should be to the left of the icon ... moving the icon over";
    // "should be a centered vertical line for all the left column things (chevron, number, icon)"):
    // a STOP row's number takes the glyph column itself -- centred on the app's left axis, x=30,
    // the centre of the header chevron and of every Places icon -- and its Places badge moves one
    // column over, to the text column's edge (x=56, the header title's edge); its text follows at
    // x=96. Places rows below the divider stay plain Places rows (icon centred on x=30, text 56).
    // The number is ONE grey state (r11). It is the drag handle (hold 400ms) and the keyboard's
    // reorder control.
    function numSpan(r, label) {
      const aria = `Stop ${r.n} of ${r.m}, ${escapeAttr(label)}. Hold and drag, or use the arrow keys (Home / End for first / last), to move it.`;
      return `<span class="row-n" role="button" tabindex="0" aria-label="${aria}">${r.n}</span>`;
    }
    function planLead(stop, category, kind, ink, label) {
      const badge = `<div class="row-badge" style="--row-ink:${ink}">${badgeHtml(category, kind, 24)}</div>`;
      // r15: the stop's icon is placed by its INK, not its box (data-kind picks the optical offset)
      return stop && inPlanView() && activePlan() ? `<div class="row-lead">${numSpan(stop, label)}${badge.replace('<div class="row-badge"', `<div class="row-badge" data-kind="${kind}"`)}</div>` : badge;
    }
    function rowActionHtml(stop, label) {
      if (!inPlanView()) return '<button class="delete-btn" aria-label="Delete">&times;</button>';
      const p = activePlan();
      if (!p) return '';
      if (stop) return `<button class="delete-btn plan-x" aria-label="Remove ${escapeAttr(label)} from ${escapeAttr(p.name)}">&times;</button>`;
      return `<button class="delete-btn plan-add" aria-label="Add ${escapeAttr(label)} to ${escapeAttr(p.name)}">+</button>`;
    }

    function planTileHtml(r) {""", 'row helpers')

edit("""      return [loc.name, loc.address, loc.category, loc.visited, loc.starred, distanceLabel(loc), planMarkKey('loc', loc.id)].join('|');""",
"""      return [loc.name, loc.address, loc.category, loc.visited, loc.starred, distanceLabel(loc), planMarkKey('loc', loc.id), listView, inPlanView() ? activePlanId : ''].join('|');""", 'cardSignature')

edit("""      return [nb.label, nb.type, nb.color, planMarkKey('shape', nb.id)].join('|');""",
"""      return [nb.label, nb.type, nb.color, planMarkKey('shape', nb.id), listView, inPlanView() ? activePlanId : ''].join('|');""", 'shapeCardSignature')

edit("""        <div class="row-badge" style="--row-ink:${ink}">${badgeHtml(loc.category, markerKind(loc), 24)}</div>
        <div class="row-main">${loc.starred ? '<svg class="row-star" viewBox="0 0 24 24" aria-hidden="true"><use href="#g-star"/></svg>' : ''}
          <h3>${escapeHtml(loc.name)}</h3>
          <div class="row-meta">${dist ? `<span class="row-dist">${escapeHtml(dist)}</span> &middot; ` : ''}${escapeHtml(loc.category)}${city ? ' &middot; ' + escapeHtml(city) : ''}<span class="sr-only">${loc.starred ? ', starred' : ''}${loc.visited ? ', visited' : ', not visited yet'}</span></div>
        </div>
        <div class="location-actions">
          ${stamp}${stop ? planTileHtml(stop) : '<button class="delete-btn" aria-label="Delete">&times;</button>'}
        </div>""",
"""        ${planLead(stop, loc.category, markerKind(loc), ink, loc.name)}
        <div class="row-main">${loc.starred ? '<svg class="row-star" viewBox="0 0 24 24" aria-hidden="true"><use href="#g-star"/></svg>' : ''}
          <h3>${escapeHtml(loc.name)}</h3>
          <div class="row-meta">${dist ? `<span class="row-dist">${escapeHtml(dist)}</span> &middot; ` : ''}${escapeHtml(loc.category)}${city ? ' &middot; ' + escapeHtml(city) : ''}<span class="sr-only">${loc.starred ? ', starred' : ''}${loc.visited ? ', visited' : ', not visited yet'}</span></div>
        </div>
        <div class="location-actions">
          ${stamp}${rowActionHtml(stop, loc.name)}
        </div>""", 'renderCard')
edit("""      const stop = planMarks().byLoc.get(loc.id);   // Plans: the stop tile takes the X's slot (the X is Places-only)""",
"""      const stop = planMarks().byLoc.get(loc.id);   // v3: Plans: the numeral leads; the X removes from the plan
      el.classList.toggle('plan-num-row', inPlanView() && !!activePlan() && !!stop);   // r13: number, then icon""", 'renderCard stop')
edit("""      const stop = planMarks().byShape.get(nb.id);""",
"""      const stop = planMarks().byShape.get(nb.id);
      el.classList.toggle('plan-num-row', inPlanView() && !!activePlan() && !!stop);""", 'r6 shape lead row')
edit("""        <div class="row-badge" style="--row-ink:${ink}">${badgeHtml(nb.type, 'diamond', 24)}</div>
        <div class="row-main">
          <h3>${escapeHtml(nb.label)}</h3>
          <div class="row-meta">${escapeHtml(nb.type)}${city ? ' &middot; ' + escapeHtml(city) : ''}</div>
        </div>
        <div class="location-actions">
          ${stop ? planTileHtml(stop) : '<button class="delete-btn" aria-label="Delete">&times;</button>'}
        </div>""",
"""        ${planLead(stop, nb.type, 'diamond', ink, nb.label)}
        <div class="row-main">
          <h3>${escapeHtml(nb.label)}</h3>
          <div class="row-meta">${escapeHtml(nb.type)}${city ? ' &middot; ' + escapeHtml(city) : ''}</div>
        </div>
        <div class="location-actions">
          ${rowActionHtml(stop, nb.label)}
        </div>""", 'renderShapeCard')

edit("""        if (e.target.closest('.delete-btn')) {
          if (e.detail !== 0 && xTravel >= DELETE_TAP_SLOP) return;   // a stroke, not a tap: never deletes
          if (current) confirmDelete(current.id, current.name);
          return;
        }""",
"""        // v3: + / X in Plans share the delete X's near-still-tap rule.
        const pa = e.target.closest('.plan-add, .plan-x');
        if (pa) {
          if (e.detail !== 0 && xTravel >= DELETE_TAP_SLOP) return;
          planRowAct(pa.classList.contains('plan-add') ? 'add' : 'remove', { locationId: id }, current ? current.name : '');
          return;
        }
        if (e.target.closest('.delete-btn')) {
          if (e.detail !== 0 && xTravel >= DELETE_TAP_SLOP) return;   // a stroke, not a tap: never deletes
          if (current) confirmDelete(current.id, current.name);
          return;
        }""", 'createCard click')
edit("""      attachStarGesture(el);
      return el;""", """      attachStopDrag(el);   // v3: registered first, so an armed drag can keep the star/visit gesture out
      attachStarGesture(el);
      return el;""", 'createCard drag')
edit("""        if (e.target.closest('.delete-btn')) {
          if (current) confirmDeleteShape(current.id, current.label);
          return;
        }""",
"""        const pa = e.target.closest('.plan-add, .plan-x');
        if (pa) { planRowAct(pa.classList.contains('plan-add') ? 'add' : 'remove', { shapeId: id }, current ? current.label : ''); return; }
        if (e.target.closest('.delete-btn')) {
          if (current) confirmDeleteShape(current.id, current.label);
          return;
        }""", 'createShapeCard click')
edit("""      attachShapeGive(el);
      return el;""", """      attachStopDrag(el);
      attachShapeGive(el);
      return el;""", 'createShapeCard drag')

# ---------------------------------------------------------------------------- the Plans list
edit("""    function syncPlanCards(rows) {
      const list = document.getElementById('locationsList');
      const want = [];
      const seenLoc = new Set(), seenShape = new Set();
      if (activePlan()) want.push(planEditRow);
      else if (planEditRow.parentNode) planEditRow.remove();
      rows.forEach(r => {""",
"""    // v3: the Plans list = the plan's stops (all, in order) / a 2px rule / every
    // place and shape the filters match that is not a stop, in the sort's order.
    const planRule = document.createElement('div');
    planRule.className = 'plan-rule'; planRule.setAttribute('role', 'separator');
    const planStopsNote = document.createElement('div'); planStopsNote.className = 'plan-list-note';
    planStopsNote.textContent = 'No stops yet. Tap + on a place below.';
    const planOthersNote = document.createElement('div'); planOthersNote.className = 'plan-list-note';
    function planOthers() {
      const pm = planMarks();
      const locs = visibleLocations().filter(l => !pm.byLoc.has(l.id));
      const shapes = visibleNeighborhoodShapes().filter(n => !pm.byShape.has(n.id));
      return { locs: heldOrder(locs) || sortLocations(locs), shapes: sortShapes(shapes) };
    }
    function othersNoteText() {
      const any = locations.some(l => filters.categories[l.category] && (filters.city === null || l.city === filters.city)) ||
        neighborhoodShapes.some(n => filters.categories[n.type] && (isAllCities() || n.city === activeCity));
      return any ? 'Every place these filters match is in this plan.' : 'No places match these filters.';
    }
    function syncPlanCards(rows) {
      const list = document.getElementById('locationsList');
      const want = [];
      const seenLoc = new Set(), seenShape = new Set();
      if (planEditRow.parentNode) planEditRow.remove();
      const open = !!activePlan();
      const others = open ? planOthers() : { locs: [], shapes: [] };
      const seq = rows.slice();
      if (open) {
        if (!rows.length) want.push(planStopsNote); else if (planStopsNote.parentNode) planStopsNote.remove();
        seq.push({ rule: true });
        others.locs.forEach(loc => seq.push({ loc }));
        others.shapes.forEach(nb => seq.push({ nb }));
        if (!others.locs.length && !others.shapes.length) { planOthersNote.textContent = othersNoteText(); seq.push({ note: true }); }
        else if (planOthersNote.parentNode) planOthersNote.remove();
      } else { [planRule, planStopsNote, planOthersNote].forEach(n => { if (n.parentNode) n.remove(); }); }
      let prevCat = null;
      seq.forEach((r, i) => {
        if (r.rule) { want.push(planRule); return; }
        if (r.note) { want.push(planOthersNote); return; }""", 'syncPlanCards head')
edit("""          entry.el.classList.toggle('highlighted', loc.id === highlightedId);
          entry.el.classList.remove('group-end');
          want.push(entry.el);""",
"""          entry.el.classList.toggle('highlighted', loc.id === highlightedId);
          entry.el.classList.toggle('is-stop', !!r.stop);
          const nx = seq[i + 1];
          entry.el.classList.toggle('group-end', !r.stop && sortMode === 'category' && !!(nx && nx.loc) && nx.loc.category !== loc.category);
          want.push(entry.el);""", 'syncPlanCards loc')
edit("""          if (signature !== entry.signature) { renderShapeCard(entry.el, nb); entry.signature = signature; }
          want.push(entry.el);""",
"""          if (signature !== entry.signature) { renderShapeCard(entry.el, nb); entry.signature = signature; }
          entry.el.classList.toggle('is-stop', !!r.stop);
          want.push(entry.el);""", 'syncPlanCards shape')

edit("""      const visible = planMode ? visibleLocations() : (() => { const v = visibleLocations(); return heldOrder(v) || sortLocations(v); })();
      const visibleShapes = planMode ? visibleNeighborhoodShapes() : sortShapes(visibleNeighborhoodShapes());""",
"""      const visible = (() => { const v = visibleLocations(); return planMode ? v : (heldOrder(v) || sortLocations(v)); })();
      const visibleShapes = planMode ? visibleNeighborhoodShapes() : sortShapes(visibleNeighborhoodShapes());""", 'updateUI visible')
edit("""      emptyState.style.display = (visible.length + visibleShapes.length) === 0 ? 'block' : 'none';""",
"""      emptyState.style.display = (planMode ? !activePlan() : (visible.length + visibleShapes.length) === 0) ? 'block' : 'none';""", 'updateUI empty')

edit("""      if (sortMode !== 'nearest' || !sortFix || inPlanView()) return '';   // Plans has no sort, so no Nearest meta""",
"""      if (sortMode !== 'nearest' || !sortFix) return '';   // v3: Plans sorts its other places too""", 'distance in plans')

# ---------------------------------------------------------------------------- chips in Plans: land on the rule
edit("""      // Preserving scroll across a poll tick is the point of the reconciler;
      // preserving it across a city switch strands the user mid-list.
      document.getElementById('locationsList').scrollTop = 0;
    }""",
"""      // Preserving scroll across a poll tick is the point of the reconciler;
      // preserving it across a city switch strands the user mid-list.
      document.getElementById('locationsList').scrollTop = 0;
      if (inPlanView()) { showPlanRule(); if (opts.frame !== false && activePlan()) frameActivePlan({ animate: false }); }   // r8: the building fit (stops + what the filters match)   // v3: in Plans a filter change lands on what it changed; the map frames what you can add from
    }
    // v3: after a filter change in Plans, the list scrolls so the rule sits at
    // the top of the list (the stops are one flick up). Nothing moves in Places.
    function showPlanRule() {
      const list = document.getElementById('locationsList');
      const rule = list.querySelector('.plan-rule');
      if (!rule || !planMarks().rows.length) return;
      list.scrollTop = rule.offsetTop - list.offsetTop;
    }""", 'city chip scroll')
edit("""          filters.categories[cat] = !filters.categories[cat];
          const btn = document.getElementById(`filter-${cat}`);
          if (filters.categories[cat]) {
            btn.classList.remove('inactive');
          } else {
            btn.classList.add('inactive');
          }
          updateUI();""",
"""          filters.categories[cat] = !filters.categories[cat];
          const btn = document.getElementById(`filter-${cat}`);
          if (filters.categories[cat]) {
            btn.classList.remove('inactive');
          } else {
            btn.classList.add('inactive');
          }
          updateUI();
          if (inPlanView()) { showPlanRule(); if (activePlan()) frameActivePlan({ animate: false }); }""", 'category chip scroll')

# ---------------------------------------------------------------------------- the panel: plan row (disclosure)
edit("""      const sig = JSON.stringify([listView, plansAvailable, activePlanId, planPanel.mode, plans.map(p => [p.id, p.name]), counts]);""",
"""      const sig = JSON.stringify([listView, plansAvailable, activePlanId, planPanel.mode, planPanel.open, plans.map(p => [p.id, p.name]), counts]);""", 'ledger sig')
edit("""      ledger.innerHTML = plans.map((p, i) => {""",
"""      // v3: collapsed, the ledger is ONE row -- the open plan (the list's subject),
      // its count and a chevron; tap it to see every plan. Picking one collapses it.
      const cur = activePlan();
      if (cur && !planPanel.open && !planPanel.mode) {
        const n = counts[plans.indexOf(cur)], ct = `${n} ${n === 1 ? 'stop' : 'stops'}`;
        ledger.innerHTML = `<div class="plan-opt plan-cur"><button type="button" class="plan-pick" data-act="expand" aria-current="true" aria-expanded="false" aria-label="Plan: ${escapeAttr(cur.name)}, ${ct}. Show all plans">` +
          `${PLAN_SVG.check}<span class="plan-name">${escapeHtml(cur.name)}</span><span class="plan-count">${ct}</span></button>` +
          `<span class="plan-chev" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" stroke-width="2.25"/></svg></span></div>`;
        return;
      }
      ledger.innerHTML = plans.map((p, i) => {""", 'ledger collapsed')
edit("""        if (act === 'cancel') setPlanPanelMode(null);""",
"""        if (act === 'expand') { planPanel.open = true; renderPlanPanel(); return; }
        if (act === 'cancel') setPlanPanelMode(null);""", 'ledger expand')
edit("""      planPanel = { mode: null, draft: '' };
      if (!same) { setHighlighted(null); if (map) map.closePopup(); }""",
"""      planPanel = { mode: null, draft: '', open: false };   // v3: picking collapses the plan row
      if (!same) { setHighlighted(null); if (map) map.closePopup(); }""", 'choose collapses')

# ---------------------------------------------------------------------------- add / remove / reorder + slip
edit("""    // ---- view -------------------------------------------------------------
    // Frame a plan's stops.""",
"""    // ---- v3: row actions, the slip, reorder --------------------------------
    const PLAN_SLIP_MS = 6000;
    const planSlip = document.createElement('div');
    planSlip.id = 'planSlip'; planSlip.hidden = true; planSlip.setAttribute('role', 'status'); planSlip.setAttribute('aria-live', 'polite');
    planSlip.innerHTML = '<span class="slip-text"></span><button type="button">Undo</button>';
    let planSlipUndo = null, planSlipTimer = 0;
    function placePlanSlip() {
      // r9: the slip is about the plan's edge, so it sits ON the rule: it covers the rule's
      // caption line ("ADD FROM ..."), exactly its box, for 6s. If the rule is scrolled out of
      // the list, it sits on the list header over the plan's name (left of the buttons).
      // Never over the map (the stops' tags), the chips, a stop row or the next row's +.
      if (planSlip.hidden) return;
      const list = document.getElementById('locationsList'), lr = list.getBoundingClientRect();
      const hdr = document.getElementById('locationsHeader').getBoundingClientRect();
      const visTop = Math.max(lr.top, hdr.bottom), visBot = Math.min(lr.bottom, innerHeight);
      const rule = list.querySelector('.plan-rule'), rr = rule && rule.getBoundingClientRect();
      planSlip.style.right = 'auto'; planSlip.style.bottom = 'auto';
      if (rr && rr.height && rr.top >= visTop - 1 && rr.bottom <= visBot + 1) {
        planSlip.classList.add('on-rule'); planSlip.classList.remove('on-header');
        Object.assign(planSlip.style, { left: `${rr.left}px`, width: `${rr.width}px`, top: `${rr.top}px`, height: `${rr.height}px` });
      } else {
        // over the plan's name; if the text needs more room (the one-time drag hint), it also covers
        // the collapse chevron and the sort button for its 6s -- never the filter toggle or locate.
        const title = document.querySelector('#locationsHeader h2'), tr = title.getBoundingClientRect();
        const leftOf = id => { const b = document.getElementById(id); return b && b.offsetWidth ? b.getBoundingClientRect().left : Infinity; };
        const narrowR = Math.min(leftOf('sortBtn'), leftOf('toggleFiltersBtn'), hdr.right - 16) - 8;
        planSlip.classList.add('on-header'); planSlip.classList.remove('on-rule', 'wide');
        const set = (l, r) => Object.assign(planSlip.style, { left: `${l}px`, width: `${Math.max(120, r - l)}px`, top: `${hdr.top + (hdr.height - 32) / 2}px`, height: '32px' });
        set(tr.left, narrowR);
        const tx = planSlip.querySelector('.slip-text');
        if (tx.scrollWidth > tx.clientWidth + 0.5) { planSlip.classList.add('wide'); set(hdr.left + 16, Math.min(leftOf('toggleFiltersBtn'), hdr.right - 16) - 8); }
      }
    }
    // r9: it rides the list (re-placed on scroll and resize while it shows)
    document.getElementById('locationsList').addEventListener('scroll', () => placePlanSlip(), { passive: true });
    addEventListener('resize', () => placePlanSlip());
    function showPlanSlip(text, undo) {
      if (!planSlip.parentNode) {
        document.body.appendChild(planSlip);
        planSlip.querySelector('button').addEventListener('click', async () => { const u = planSlipUndo; hidePlanSlip(); if (u) await u(); });
      }
      planSlip.querySelector('.slip-text').textContent = text;
      planSlipUndo = undo; planSlip.hidden = false; placePlanSlip(); requestAnimationFrame(() => placePlanSlip());   // r9: again once the list has re-rendered
      clearTimeout(planSlipTimer); planSlipTimer = setTimeout(hidePlanSlip, PLAN_SLIP_MS);
    }
    function hidePlanSlip() { clearTimeout(planSlipTimer); planSlip.hidden = true; planSlipUndo = null; }
    async function restoreStop(s) {   // Undo of a remove: the same row, back at its old position
      return planWrite('restore the stop',
        () => { if (!planStops.some(t => t.id === s.id)) planStops = planStops.concat([s]); },
        () => { planStops = planStops.filter(t => t.id !== s.id); },
        () => supabaseClient.from('plan_stops').insert([s]));
    }
    async function planRowAct(act, target, label) {
      const p = activePlan();
      if (!p) return;
      if (act === 'add') {
        const id = await addStop(p.id, target);
        if (id) {
          const n = stopsOf(p.id).length;
          // r7: the one-time hint for the drag (a plan now has something to reorder)
          let hint = '';
          try { if (n >= 2 && !localStorage.getItem('triplet.reorderHint')) { localStorage.setItem('triplet.reorderHint', '1'); hint = 'y'; } } catch (e) {}
          showPlanSlip(hint ? `Stop ${n} added · hold a number to move` : `Added ${label} as stop ${n}`, () => removeStop(id));
          // r8: keep the new stop in view -- pan the least that brings it inside the safe box.
          const r = planMarks().rows.find(x => x.stop.id === id);
          const ll = r && (r.loc ? L.latLng(r.loc.lat, r.loc.lng) : shapeCentroid(r.nb) && L.latLng(shapeCentroid(r.nb)));
          if (ll && map) {
            const pn = document.getElementById('filtersPanel'), bx = planSafeBox(pn.classList.contains('visible') ? pn.offsetHeight : 0), p = map.latLngToContainerPoint(ll);
            const dx = p.x < bx.l ? p.x - bx.l : p.x > bx.r ? p.x - bx.r : 0, dy = p.y < bx.t ? p.y - bx.t : p.y > bx.b ? p.y - bx.b : 0;
            if (dx || dy) {
              // r10: if the map is still where the app put it, re-fit the same view WITH the new stop
              // (so the route doesn't slide off the other side); if you moved it, pan the least.
              if (lastPlanFit && planFitView() === lastPlanFit.view) frameActivePlan({ animate: false });   // every stop, the new one included
              else map.panBy([dx, dy], { animate: !prefersReducedMotion() });
            }
          }
        }
        return;
      }
      const r = planMarks().rows.find(x => target.locationId != null ? x.loc && x.loc.id === target.locationId : x.nb && x.nb.id === Number(target.shapeId));
      if (!r) return;
      const s = r.stop;
      if (await removeStop(s.id)) showPlanSlip(`Removed ${label}`, () => restoreStop(s));
    }
    function stopRowFor(el) {
      const id = el.getAttribute('data-id'), sid = el.getAttribute('data-shape-id');
      return planMarks().rows.find(x => id != null ? x.loc && x.loc.id === id : x.nb && x.nb.id === Number(sid)) || null;
    }
    // Reorder: HOLD the number still for 400ms (4px slop), then drag. Before it
    // arms, the touch is the row's: a stroke scrolls, stars or visits exactly as
    // in Places, and a tap flies. Once armed, this handler (registered before the
    // star gesture) keeps the stroke. Keyboard: arrow keys on the focused number.
    const STOP_HOLD_MS = 400, STOP_HOLD_SLOP = 4, STOP_EDGE = 48;   // r12 (UX): 400ms, clear of a scroll's settle
    function attachStopDrag(el) {
      let timer = 0, start = null, armed = false, rows = null, from = -1, to = -1, lastY = 0, scroll0 = 0, raf = 0, baseTop = 0;
      const list = () => document.getElementById('locationsList');
      const onHandle = t => inPlanView() && el.classList.contains('is-stop') && t && t.closest && t.closest('.row-n, .row-badge');
      // Long moves: within STOP_EDGE px of the list's top or bottom edge the list
      // scrolls under the lifted row (up to 12px a frame, faster nearer the edge),
      // so stop 7 can reach stop 1 even with the panel open and 4 rows showing.
      const autoScroll = () => {
        raf = 0;
        if (!armed) return;
        const lr = list().getBoundingClientRect(), top = lr.top, bottom = Math.min(lr.bottom, innerHeight);
        const v = lastY < top + STOP_EDGE ? -Math.ceil(12 * (top + STOP_EDGE - lastY) / STOP_EDGE)
          : lastY > bottom - STOP_EDGE ? Math.ceil(12 * (lastY - bottom + STOP_EDGE) / STOP_EDGE) : 0;
        if (v) { const before = list().scrollTop; list().scrollTop += v; if (list().scrollTop !== before) move(lastY); }
        raf = requestAnimationFrame(autoScroll);
      };
      const arm = () => {
        armed = true; el.classList.remove('active'); el.classList.add('plan-lifted');
        rows = [...document.querySelectorAll('#locationsList > .location-card.is-stop')]; from = to = rows.indexOf(el);
        scroll0 = list().scrollTop; baseTop = el.getBoundingClientRect().top; lastY = start[1]; raf = requestAnimationFrame(autoScroll);
      };
      const move = y => {
        lastY = y;
        // The lifted row stays inside the list's box (clear of the header): its screen top
        // follows the finger, clamped to [list top, list bottom - row height].
        const lr = list().getBoundingClientRect(), h = el.offsetHeight;
        const fy = Math.max(lr.top - baseTop, Math.min(Math.min(lr.bottom, innerHeight) - h - baseTop, y - start[1]));
        const dy = fy + (list().scrollTop - scroll0);
        el.style.transform = `translateY(${dy}px)`;
        to = Math.max(0, Math.min(rows.length - 1, from + Math.round(dy / h)));
        rows.forEach((row, i) => {
          if (row === el) return;
          const sh = from < to && i > from && i <= to ? -h : from > to && i < from && i >= to ? h : 0;
          row.classList.add('plan-shift'); row.style.transform = sh ? `translateY(${sh}px)` : '';
        });
      };
      const end = commit => {
        clearTimeout(timer); timer = 0; start = null;
        if (!armed) return;
        armed = false; cancelAnimationFrame(raf); raf = 0; el.classList.remove('plan-lifted'); el.style.transform = '';
        rows.forEach(row => { row.style.transform = ''; row.classList.remove('plan-shift'); });
        const r = stopRowFor(el);
        if (commit && r && to !== from) reorderStop(r.stop.id, to);
      };
      const begin = (x, y) => { start = [x, y]; clearTimeout(timer); timer = setTimeout(() => { timer = 0; arm(); }, STOP_HOLD_MS); };
      el.addEventListener('touchstart', e => { if (e.touches.length !== 1 || !onHandle(e.target)) return; begin(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
      el.addEventListener('touchmove', e => {
        if (!start) return;
        const t = e.touches[0];
        if (!armed) { if (Math.hypot(t.clientX - start[0], t.clientY - start[1]) > STOP_HOLD_SLOP) { clearTimeout(timer); timer = 0; start = null; } return; }
        if (e.cancelable) e.preventDefault(); e.stopImmediatePropagation(); move(t.clientY);
      }, { passive: false });
      el.addEventListener('touchend', e => { if (armed) { if (e.cancelable) e.preventDefault(); e.stopImmediatePropagation(); } end(true); });
      el.addEventListener('touchcancel', () => end(false));
      el.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button === 0 && onHandle(e.target)) begin(e.clientX, e.clientY); });
      window.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse' || !start) return;
        if (!armed) { if (Math.hypot(e.clientX - start[0], e.clientY - start[1]) > STOP_HOLD_SLOP) { clearTimeout(timer); timer = 0; start = null; } return; }
        move(e.clientY);
      });
      window.addEventListener('pointerup', e => { if (e.pointerType === 'mouse' && start) { const was = armed; end(true); if (was) el.__eatClick = true; } });
      el.addEventListener('click', e => { if (el.__eatClick) { el.__eatClick = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true);
      el.addEventListener('keydown', e => {
        if (!onHandle(e.target)) return;
        if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault(); e.stopPropagation();
        const r = stopRowFor(el);
        // Arrow = one place; Home / End = straight to first / last (the long move without dragging).
        const to = e.key === 'Home' ? 0 : e.key === 'End' ? r.m - 1 : r.n - 1 + (e.key === 'ArrowUp' ? -1 : 1);
        if (r) reorderStop(r.stop.id, to).then(() => { const b = el.querySelector('.row-n'); if (b) b.focus(); });
      });
    }

    // ---- view -------------------------------------------------------------
    // Frame a plan's stops.""", 'v3 actions')

# overlapping stops (zoomed out): NEXT on top, then lower numbers above higher ones
edit("""            zIndexOffset: r.next ? Z_PLAN_NEXT : Z_PLAN_STOP,""",
"""            zIndexOffset: Z_PLAN_STOP - r.n,""", 'shape z by number')
edit("""        : stop ? (stop.next ? Z_PLAN_NEXT : Z_PLAN_STOP)""",
"""        : stop ? Z_PLAN_STOP - stop.n""", 'pin z by number')
# the sort menu says what it sorts in Plans
edit("""      menu.innerHTML = '<div class="sort-cap" aria-hidden="true">Sort by</div>' + SORT_MODES.map(m => {""",
"""      menu.innerHTML = `<div class="sort-cap" aria-hidden="true">${inPlanView() ? 'Sort places not in the plan' : 'Sort by'}</div>` + SORT_MODES.map(m => {""", 'sort cap')
# Plans with no open plan (none yet / tables missing): the list is empty, so the map is too, and
# there is nothing to sort.
edit("""      document.body.classList.toggle('plan-view', planMode);""",
"""      document.body.classList.toggle('plan-view', planMode);
      document.body.classList.toggle('plan-none', planMode && !activePlan());""", 'plan-none class')
edit("""    /* v3: Plans keeps the sort; it orders the places below the rule (stops keep plan order). */
""", """    /* v3: Plans keeps the sort; it orders the places below the rule (stops keep plan order). */
    body.plan-none #sortBtn { display: none; }
""", 'sort hidden without plan')
edit("""      if (!inPlanView()) return match;
      const stops = planMarks().rows.filter(r => r.loc).map(r => r.loc);""",
"""      if (!inPlanView()) return match;
      if (!activePlan()) return [];
      const stops = planMarks().rows.filter(r => r.loc).map(r => r.loc);""", 'no plan: no pins')
edit("""      if (!inPlanView()) return match;
      const stops = planMarks().rows.filter(r => r.nb).map(r => r.nb);""",
"""      if (!inPlanView()) return match;
      if (!activePlan()) return [];
      const stops = planMarks().rows.filter(r => r.nb).map(r => r.nb);""", 'no plan: no shapes')

# Places: the Plans-only rule and notes leave the list (the index-based reconcilers own it)
edit("""        if (planEditRow.parentNode) planEditRow.remove();   // the index-based reconcilers own the list from row 0""",
"""        [planEditRow, planRule, planStopsNote, planOthersNote].forEach(n => { if (n.parentNode) n.remove(); });   // the index-based reconcilers own the list from row 0""", 'places drops plan rows')

# NEXT (v3 rule). Progress is measured by visited PINS (a district/street has no visited state):
# NEXT = the first stop after the furthest visited pin that is an unvisited pin or a shape;
# if nothing is left after it, the earliest skipped (unvisited) pin; NO NEXT once every pin
# stop is visited (the plan is done -- a trailing shape never stays NEXT forever), and none in
# a plan with no pin stops (nothing can mark progress).
edit("""      const next = rows.findIndex((r, i) => r.loc ? !r.loc.visited : i > lastVisited);""",
"""      const next = -1;   // r11: no NEXT (owner: "Next isn't necessary"); see the round-11 edit below""", 'NEXT rule')

# the 'Edit stops' row is gone in v3: syncPlanCards never adds it (kept defined, unused)

# ============================================================================ ROUND 3
edit("""      return { solo: pinned.concat(solo), clusters };""",
"""      return { solo: pinned.concat(solo), clusters };""", 'r3 plan clusters hook (r6: none)')
edit("""    function mapVisibleLocations() {""",
"""    // ---- r6: THE PLANS MAP (the owner: "I don't like using a different approach for clustered
    // places"). Places' clustering, pins and highlight are used unchanged. The only difference
    // is the stops: never absorbed into a cluster, drawn at their true location, above every
    // cluster and pin (the ladder at applyMarkerStacking). Overlapping stops overlap like pins:
    // lower numbers on top.
    // r7 tag layout (after every sync / move). Stops whose PINS overlap (< STOP_OVERLAP px) keep
    // their pins at their true spots and share ONE tag on the top pin (the lowest
    // number), labelled with every number in it ("2–3"). Each tag takes the first corner
    // (upper-left, upper-right, lower-right, lower-left) that touches no Places cluster, no
    // other stop's pin and no tag already placed, so a cluster's count and every stop number
    // stay visible. Clusters draw above stops (as they draw above every pin in Places).
    const STOP_OVERLAP = 22;
    // r8: the map's own chrome, in container px -- the zoom control, the account and add
    // buttons, the attribution -- and the safe box inside it (above the open filter panel).
    function planChrome() {
      const mb = document.getElementById('map').getBoundingClientRect();
      return [document.querySelector('.leaflet-control-zoom'), document.getElementById('accountBtn'), document.getElementById('floatingAddBtn'), document.querySelector('.leaflet-control-attribution')]
        .filter(el => el && el.getBoundingClientRect().width).map(el => { const r = el.getBoundingClientRect(); return { x1: r.left - mb.left - 4, y1: r.top - mb.top - 4, x2: r.right - mb.left + 4, y2: r.bottom - mb.top + 4 }; });
    }
    function planSafeBox(under) {
      const sz = map.getSize(), ch = planChrome();
      const topBand = Math.max(16, ...ch.filter(c => c.y1 < 120).map(c => c.y2 + 16));   // below the controls along the top
      const bottom = Math.min(sz.y - under, ...ch.filter(c => c.y1 > sz.y / 2 && c.y1 < sz.y - under).map(c => c.y1)) - 24;   // a cluster disc's radius + 4
      return { l: 24, r: sz.x - 24, t: topBand, b: bottom };
    }
    function applyPlanMap() {
      if (!map || !inPlanView() || !activePlan()) return;
      syncPlanShapeMarkers();   // r17: a district/street stop's mark follows its clustering at this zoom
      const pm = planMarks();
      const stops = pm.rows.map(r => {
        const e = r.loc ? markersById.get(r.loc.id) : planShapeMarkers.get(r.nb.id);
        const el = e && e.marker.getElement();
        return el ? { r, e, el, p: map.latLngToContainerPoint(e.marker.getLatLng()) } : null;
      }).filter(Boolean);
      const parent = stops.map((_, i) => i), find = i => parent[i] === i ? i : (parent[i] = find(parent[i]));
      for (let i = 0; i < stops.length; i++) for (let j = i + 1; j < stops.length; j++) if (stops[i].p.distanceTo(stops[j].p) < STOP_OVERLAP) parent[find(i)] = find(j);
      const groups = new Map();
      stops.forEach((q, i) => { const g = find(i); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(q); });
      // r17 (owner: "Stop clusters should function the same as a normal cluster and if the stops are
      // inside of a cluster the squared number thing is fine near the red cluster number"): stops
      // cluster exactly like any pin. A cluster that holds stops carries ONE grey tag with their
      // numbers at its shoulder (clusterStopTags below); stops outside clusters keep pin + tag.
      const clusters = [...clusterMarkersById.values()].map(m => map.latLngToContainerPoint(m.getLatLng()));
      // a stop drawn as its own mark (a district/street, which never clusters) whose pin lies under a
      // cluster disc joins that cluster's tag instead -- its own tag would be hidden under the disc
      const absorbed = new Map();   // stop -> cluster id
      const cR = (CLUSTER_BADGE_PX - 2) / 2;
      stops.forEach(q => { for (const [id, m] of clusterMarkersById) if (map.latLngToContainerPoint(m.getLatLng()).distanceTo(q.p) < cR + 6) { absorbed.set(q, id); break; } });
      const stopEls = new Set(stops.map(q => q.el));
      const mbr = document.getElementById('map').getBoundingClientRect();
      const others = [...document.querySelectorAll('#map .leaflet-marker-icon')].filter(el => !el.querySelector('.plan-stop'))
        .map(el => { const r = el.getBoundingClientRect(); return { el, p: L.point(r.left + r.width / 2 - mbr.left, r.top + r.height / 2 - mbr.top) }; })
        .filter(o => o.p.x > -20 && o.p.y > -20 && o.p.x < mbr.width + 20 && o.p.y < mbr.height + 20);
      const placed = [], msz = map.getSize(), chrome = planChrome();
      // r9: the bottom of the map you can SEE (the open panel and the list sheet lie over the map)
      const visBottom = (() => { const mt = document.getElementById('map').getBoundingClientRect().top, pn = document.getElementById('filtersPanel'), lt = document.getElementById('locations').getBoundingClientRect().top;
        return Math.min(msz.y, lt - mt, pn.classList.contains('visible') ? pn.getBoundingClientRect().top - mt : Infinity); })();
      const hitsRect = (a, b) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;
      const rectCircle = (rc, p, r) => { const nx = Math.max(rc.x1, Math.min(p.x, rc.x2)), ny = Math.max(rc.y1, Math.min(p.y, rc.y2)); return Math.hypot(p.x - nx, p.y - ny) < r; };
      stops.forEach(q => q.e.marker.setZIndexOffset(Z_PLAN_STOP - q.r.n));   // r18: lower numbers on top; no tag on a single pin
      clusterStopTags(placed, chrome, msz, visBottom, hitsRect, rectCircle, absorbed);
    }
    // r17: a cluster that holds stops shows ONE grey tag with their numbers at the disc's shoulder.
    // The label lists up to 3 runs ("2", "1–3", "2,5", "2,5,7"); beyond that it reads "first…last"
    // (e.g. "2…9"). The tag sits outside the disc, touching it at 45 degrees -- upper-left,
    // upper-right (unless the cluster carries the star there), lower-right, lower-left, the first that is
    // on screen, clear of the controls, other discs and other tags -- so it never covers the count.
    const CLUSTER_TAG_MAX_RUNS = 3;
    function clusterStopLabel(ns) {
      const runs = rangeLabel(ns).split(',');
      return runs.length <= CLUSTER_TAG_MAX_RUNS ? runs.join(',') : `${ns[0]}…${ns[ns.length - 1]}`;
    }
    function clusterStopTags(placed, chrome, msz, visBottom, hitsRect, rectCircle, absorbed) {
      const pm = planMarks();
      const discs = [...clusterMarkersById.entries()].map(([id, m]) => ({ id, m, p: map.latLngToContainerPoint(m.getLatLng()), r: (CLUSTER_BADGE_PX - 2) / 2 }));
      const ctagsPlaced = [];
      discs.forEach(d => applyMarkerStacking(d.m, false, d.id.includes(':*'), true));   // reset the tag bump; re-applied below
      discs.forEach(d => {
        const el = d.m.getElement(); if (!el) return;
        const box = el.firstElementChild; if (!box) return;
        box.querySelectorAll('.cluster-stops').forEach(t => t.remove());
        const ids = d.id.replace(/^p?cluster:\*?/, '').split(',');
        const ns = ids.map(id => id.startsWith('shape:') ? pm.byShape.get(Number(id.slice(6))) : (pm.byLoc.get(id) || pm.byLoc.get(Number(id)))).filter(Boolean).map(r => r.n)
          .concat([...absorbed.entries()].filter(([, cid]) => cid === d.id).map(([q]) => q.r.n)).sort((a, b) => a - b);
        if (!ns.length) return;
        const t = document.createElement('div');
        t.className = 'stop-tag cluster-stops' + (V3.ctag ? ' shape-' + V3.ctag : ''); t.textContent = clusterStopLabel(ns);   // r19 option knob
        t.setAttribute('aria-hidden', 'true');
        box.appendChild(t);
        // r18 (owner: "much closer if not touching the cluster number"): the tag sits FLUSH beside the
        // count -- 2px from its digits, vertically centred on them -- on the right (the left when the
        // star rides the disc's upper-right, or the right runs off screen). It covers part of the red
        // disc, never a digit.
        const place = () => {   // r20: a closure, so a tag that grows by a merge is placed again at its new width
        const w = t.offsetWidth || 14, h = t.offsetHeight || 14, starred = d.id.includes(':*');
        const txt = el.querySelector('svg text'), tb = txt.getBoundingClientRect(), bb = box.getBoundingClientRect();
        const tl = tb.left - bb.left, tr = tb.right - bb.left, tcy = tb.top - bb.top + tb.height / 2;
        const tcx = (tl + tr) / 2, ttop = tb.top - bb.top, tbot = tb.bottom - bb.top;
        const right = [tr + 2, tcy - h / 2], left = [tl - 2 - w, tcy - h / 2], above = [tcx - w / 2, ttop - 2 - h], below = [tcx - w / 2, tbot + 2];
        const toMap = ([x, y]) => ({ x1: d.p.x - d.r + x, y1: d.p.y - d.r + y, x2: d.p.x - d.r + x + w, y2: d.p.y - d.r + y + h });
        // the least-bad flush spot: over another cluster's count digits is worst, then off screen, a control, another tag
        const bad = sp => { const rc = toMap(sp); return 1000 * otherCounts.filter(o => hitsRect(rc, o)).length
          + (rc.x1 < 2 || rc.x2 > msz.x - 2 || rc.y1 < 2 || rc.y2 > visBottom - 2 ? 500 : 0)
          + 300 * chrome.filter(o => hitsRect(rc, { x1: o.x1 + 4, y1: o.y1 + 4, x2: o.x2 - 4, y2: o.y2 - 4 })).length
          + 100 * placed.filter(o => hitsRect(rc, o)).length; };
        const mbr0 = document.getElementById('map').getBoundingClientRect();
        const otherCounts = discs.filter(o => o !== d && o.m.getElement()).map(o => { const r = o.m.getElement().querySelector('svg text').getBoundingClientRect(); return { x1: r.left - mbr0.left - 1, y1: r.top - mbr0.top - 1, x2: r.right - mbr0.left + 1, y2: r.bottom - mbr0.top + 1 }; });
        const order = starred ? [left, right, below, above] : [right, left, above, below];
        const best = order.reduce((m, sp) => bad(sp) < bad(m) ? sp : m, order[0]);
        if (bad(best) >= 1000) t.dataset.forced = '1'; else delete t.dataset.forced;   // every flush spot is over another count: a knot of overlapping clusters (Places draws them overlapping too)
        t.style.left = `${best[0]}px`; t.style.top = `${best[1]}px`;
        return toMap(best);
        };
        const rcB = place();
        // r20: never tag-on-tag. If even the best flush spot lands on another cluster's tag, the two merge:
        // this cluster's stop numbers join that tag ("1,5" + "2,4" -> "1–2,4–5"), so every number stays readable.
        const host = ctagsPlaced.find(o => hitsRect(rcB, o.rc));
        const regrow = o => { const i = placed.indexOf(o.rc); if (i >= 0) placed.splice(i, 1); o.rc = o.place(); placed.push(o.rc); };
        if (host) { host.ns = host.ns.concat(ns).sort((a, b) => a - b); host.t.textContent = clusterStopLabel(host.ns); t.remove(); regrow(host); return; }
        ctagsPlaced.push({ t, ns, rc: rcB, d, place, regrow });
        d.m.setZIndexOffset(Z_PLAN_CLUSTER + 1000);   // a tag-bearing cluster draws above its neighbours, so no disc hides its tag
        placed.push(rcB);
      });
      // r20: a tag that ends up under ANOTHER tag-bearing disc (drawn above it) merges into that disc's tag
      const zOf = o => +(o.d.m.getElement() && o.d.m.getElement().style.zIndex) || 0;
      ctagsPlaced.forEach(o => {
        if (o.dead) return;
        const top = ctagsPlaced.find(q => q !== o && !q.dead && zOf(q) > zOf(o) && rectCircle(o.rc, q.d.p, q.d.r));
        if (top) { top.ns = top.ns.concat(o.ns).sort((a, b) => a - b); top.t.textContent = clusterStopLabel(top.ns); o.t.remove(); o.dead = true; top.regrow(top); }
      });
    }
    function rangeLabel(ns) {
      const out = []; let i = 0;
      while (i < ns.length) { let j = i; while (j + 1 < ns.length && ns[j + 1] === ns[j] + 1) j++; out.push(j > i ? `${ns[i]}–${ns[j]}` : `${ns[i]}`); i = j + 1; }
      return out.join(',');
    }
    function mapVisibleLocations() {""", 'r4 map fns')
edit("""        clusters.push({ id, lat, lng, count: members.length, starred });""",
"""        clusters.push({ id, lat, lng, count: members.length, starred, memberIds: members.map(m => m.id) });""", 'r4 cluster member ids')
edit("""    map.on('moveend', syncMarkerGlyphZoom);""",
"""    map.on('moveend', syncMarkerGlyphZoom);
    map.on('moveend', applyPlanMap);   // r4: after the markers are synced""", 'r4 apply on move')
edit("""      syncNeighborhoodLayers();
      syncPlanShapeMarkers();""",
"""      syncNeighborhoodLayers();
      syncPlanShapeMarkers();
      applyPlanMap();
      if (typeof placePlanSlip === 'function') placePlanSlip();   // r9: the rule may have moved""", 'r4 apply on update')
edit("""      if (!map || map.getZoom() >= SOLO_MIN_ZOOM) return { solo: all, clusters: [] };""",
"""      if (!map || map.getZoom() >= SOLO_MIN_ZOOM) return { solo: all, clusters: [] };""", 'r4 high zoom hook (r6: none)')
edit("""        marker.on('click', () => focusMap([cluster.lat, cluster.lng], { atLeast: SOLO_MIN_ZOOM }, { animate: true }));""",
"""        // r4: a Plans group zooms to where its places really are, and at >= SOLO_MIN_ZOOM two steps further (they separate).
        marker.on('click', () => focusMap([cluster.zlat ?? cluster.lat, cluster.zlng ?? cluster.lng], { atLeast: cluster.zlat != null ? Math.min(19, Math.max(SOLO_MIN_ZOOM, map.getZoom() + 2)) : SOLO_MIN_ZOOM }, { animate: true }));""", 'r4 group zoom target')
edit("""        const marker = L.marker([cluster.lat, cluster.lng], { icon: clusterMarkerIcon(cluster.count, cluster.starred) }).addTo(map);""",
"""        const marker = L.marker([cluster.lat, cluster.lng], { icon: clusterMarkerIcon(cluster.count, cluster.starred, cluster.members) }).addTo(map);""", 'r4 group members')
# a highlighted non-stop place draws BELOW the stops (never covers a stop's number)
edit("""        highlighted ? Z_HIGHLIGHTED
        : cluster ? (starred ? Z_CLUSTER_STARRED : Z_CLUSTER)""",
"""        highlighted ? (!cluster && inPlanView() && activePlan() ? (stop ? Z_PLAN_HI_STOP : Z_PLAN_PICKED) : Z_HIGHLIGHTED)
        : cluster ? (starred ? Z_CLUSTER_STARRED : Z_CLUSTER)""", 'r3 picked under stops')
edit("""    const Z_PLAN_NEXT = 760, Z_PLAN_STOP = 750;""",
"""    // r4, the Plans ladder. Leaflet's z-index = the marker's screen y + this offset, so the steps
    // are 5000 apart (more than any screen is tall) or a lower mark further down would win:
    //   selected stop 30000 > stop 20000-n > the tapped place 15000
    //   > starred group 700 > group 600 > starred place 500 > place 0.
    const Z_PLAN_HI_STOP = 35000, Z_PLAN_CLUSTER = 30000, Z_PLAN_NEXT = 25000, Z_PLAN_STOP = 20000, Z_PLAN_PICKED = 15000;
    // r7/r17 ladder: selected stop 35000 > Places clusters 30000 (they beat every pin, as in Places;
    //   a cluster that holds stops carries their tag) > stop 20000-n > the tapped place 15000 > places.""", 'r3 z picked')

# ============================================================================ ROUND 2 (CD 8/10 + UX)
# R1 panel: the plan picker shares the switch's row (same 61px band), so the panel is the SAME
# height in both views. Picking / managing plans happens in a slip that drops from the picker,
# over the chips (no layout change). ⋯ on EVERY plan: rename or delete one without opening it.
edit("""Plans</button></div></div>
    <div id="planLedger" aria-label="Plans"></div>""",
"""Plans</button></div><div id="planPick"></div></div>
    <div id="planLedger" role="group" aria-label="Plans" hidden></div>""", 'r2 panel html')
edit("""    /* v3: the filters are identical on both sides. Only the plan row is Plans-only. */
    #filtersPanel:not(.plans-side) #planLedger { display: none; }""",
"""    /* v3 r2: the panel is identical on both sides, picker included. */""", 'r2 no side rule')
edit("""    /* Map: a stop's number replaces its glyph inside the same ring. */""",
"""    /* r7: the switch row added 61px; the panel grows by the 33px it would otherwise scroll, so
       every chip shows unscrolled in both views (the map above the open panel is 33px shorter). */
    #filtersPanel { max-height: calc(40vh + 33px); }
    /* ---- r14: ONE left axis, x = 30 (gutter 16 + half the 28px glyph column) -----------------
       The header chevron, every Places icon and every stop number are centred on it. A stop row
       is [number in the glyph column][--gap][its icon in a second glyph column][--gap][text]:
       number centred at 30, icon 56-84 (its left edge on the header title's edge), text x=96.
       A starred stop keeps Places' star slot at the head of its text (name x=122). Rows below
       the divider are plain Places rows: icon centred at 30, text 56. */
    body.plan-view .location-card.plan-num-row { grid-template-columns: calc(var(--col-glyph) * 2 + var(--gap)) 1fr auto; }
    .row-lead { display: flex; align-items: center; gap: var(--gap); }
    /* r15 (owner: "make sure the icon in the plans list is visually left aligned with the text in
       the normal list ... may not follow mathematical number"): measured on the rendered pixels
       (harness/ink.js), a 24px badge centred in its 28px column puts its ring's ink 2px inside the
       box (x=58), while a Places name's ink starts at ~56.7 (the letters' side-bearing). So a stop's
       icon is pulled left by its INK: a ring's (and the dotted approx. ring's) left edge lands on the
       names' ink edge; the district diamond's tip overshoots it by 1px, because a point carries
       too little ink to read as reaching an edge it only touches (optical overshoot). */
    .row-lead .row-badge { transform: translateX(-1.33px); }   /* a transform, so the sub-pixel shift is not snapped to whole px */
    .row-lead .row-badge[data-kind="diamond"] { transform: translateX(-1.83px); }
    .row-n { position: relative; flex: 0 0 var(--col-glyph); width: var(--col-glyph); height: 16px; text-align: center;
      font-family: var(--font-ui); font-weight: 600; font-size: 13px; line-height: 16px;
      font-variant-numeric: tabular-nums; color: var(--ink-2); cursor: grab; touch-action: pan-y; -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }
    .row-n::before { content: ''; position: absolute; left: -16px; right: 0; top: -14px; bottom: -14px; }   /* 44 x 44: the screen edge to the glyph column's edge */
    .location-card.highlighted .row-n { color: var(--paper); }
    .row-n:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--navy); border-radius: 2px; }

    /* ---- v3 round 2 ------------------------------------------------------------ */
    .seg-wrap { display: flex; align-items: center; gap: var(--s2); }
    .seg { flex: 0 0 176px; }
    #planPick { flex: 1 1 auto; min-width: 0; }
    .plan-picker {
      position: relative; display: flex; align-items: center; gap: var(--s1); width: 100%; height: 36px; margin: 0; padding: 0 var(--s1) 0 var(--s3);
      border: 1px solid var(--hair); border-radius: 3px; background: var(--paper-raised); color: var(--ink); cursor: pointer; -webkit-tap-highlight-color: transparent;   /* r11: a city chip's hairline */
      font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 12px; line-height: 16px; letter-spacing: 0.06em;
    }
    .plan-picker::before { content: ''; position: absolute; left: 0; right: 0; top: -5px; bottom: -5px; }   /* 46px target */
    .plan-picker .plan-name { flex: 1 1 auto; text-align: left; font-size: 12px; }
    .plan-picker svg { width: 16px; height: 16px; flex-shrink: 0; display: block; }
    #filtersPanel:not(.plans-side) .plan-picker { color: var(--ink-2); }   /* Places: the plan Plans would open, quiet */
    /* r11: the switch speaks the city chips' language: hairline halves, the ON half a solid navy tile. */
    .seg button { border-color: var(--hair); }
    .seg button[aria-checked="true"] { border-color: var(--state-on-bg); }
    .plan-picker:active { background: var(--state-press); }
    /* r3: open = the pressed tone with the chevron turned up. Named exception to the state
       system's "open = navy tile": beside the solid PLANS half, navy read as a third segment. */
    .plan-picker[aria-expanded="true"] { background: var(--state-press); }
    .plan-picker[aria-expanded="true"] svg { transform: rotate(180deg); }
    .plan-picker[aria-disabled="true"] { opacity: var(--state-off-alpha); cursor: default; }
    .plan-picker:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--paper), inset 0 0 0 4px var(--navy); }
    #filtersPanel { position: absolute; }
    #planLedger { position: absolute; left: var(--gutter); right: var(--gutter); top: 54px; z-index: 5; max-height: 270px; overflow-y: auto;
      background: var(--paper-raised); border: 1px solid var(--hair); border-radius: 3px; box-shadow: 0 2px 0 var(--hair); }   /* r11: hairline, not the navy box */
    #planLedger[hidden] { display: none; }
    #planLedger .plan-pick { padding-left: var(--s3); }
    #planLedger .plan-opt.plan-form { padding-left: var(--s3); }
    /* + is the build action: a navy-ruled tile (the chips' and switch's container language);
       X stays a bare grey glyph. Different shape, tone and container. */
    /* r7: + is a bare navy glyph, the X's size and weight class -- navy (the X is grey) marks it as the build action. */
    .location-actions .plan-add { width: 28px; height: 28px; color: var(--ink-2);   /* r12 (CD): grey, the X's ink -- the glyph (+ vs ×) says which */ font-size: 20px; font-weight: 400; line-height: 1; border-radius: 3px; }
    .location-actions .plan-add:active { background: var(--state-press); }
    .location-card.highlighted .plan-add { color: var(--paper); }
    /* r7: the stop tag on the map */
    .leaflet-marker-icon.plan-stop-icon, .plan-stop-icon .plan-stop { pointer-events: none; }
    .stop-tag.cluster-stops { pointer-events: auto; cursor: pointer; z-index: 3; }   /* r20: above the cluster's star -- a star never sits on a stop number */
    /* r19 options for the cluster's stop tag (V3.ctag): a solid grey disc/pill, or a paper ring/pill drawn like a stop pin */
    .stop-tag.cluster-stops.shape-solid { height: 16px; min-width: 16px; line-height: 14px; border-radius: 8px; background: var(--ink-2); border-color: var(--ink-2); color: var(--paper); padding: 0 4px; }
    .stop-tag.cluster-stops.shape-ring { height: 16px; min-width: 16px; line-height: 13px; border-radius: 8px; border-width: 1.5px; padding: 0 3px; }
    /* r19 PICK: the stop tag beside a cluster is drawn like a stop pin -- a paper field in a grey ring,
       grey numeral; a circle for one number, a pill for "2–4" / "1,5–6". A solid grey disc read as a
       second cluster; the ring reads as "these stops", in the same family as the numbered stop pins. */
    .stop-tag.cluster-stops:not(.shape-solid):not(.shape-square) { height: 16px; min-width: 16px; line-height: 13px; border-radius: 8px; border-width: 1.5px; padding: 0 3px; }
    /* r18: a single stop pin carries its number in place of the glyph -- grey, the one number style */
    .plan-stop .pin-n { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;
      font-family: var(--font-ui); font-stretch: 85%; font-weight: 700; font-size: 13px; line-height: 1; font-variant-numeric: tabular-nums; color: var(--ink-2); }
    .plan-stop .pin-n.two { font-size: 12px; letter-spacing: -0.02em; }
    .plan-stop .pin-n.on { color: var(--paper); }   /* r17: part of the cluster -- a tap zooms in, like the disc */
    .plan-stop-icon .plan-stop > * { pointer-events: auto; }
    .stop-tag { position: absolute; z-index: 2; height: 14px; min-width: 14px; padding: 0 2px; box-sizing: border-box; border: 1px solid var(--ink-2); border-radius: 3px;
      background: var(--paper); color: var(--ink-2); font-family: var(--font-ui); font-stretch: 85%; font-weight: 700; font-size: 10px; line-height: 11px; text-align: center; white-space: nowrap; pointer-events: none; }
    /* r11: the plan ends at Places' group divider -- the last stop's 1px --hair rule plus this 1px =
       the 2px --hair a category change draws in Places -- and a one-line caption naming what's below. */
    .plan-rule { height: auto; box-sizing: border-box; min-height: 26px; padding: 7px var(--gutter) 5px; border-top: 1px solid var(--hair); border-bottom: 1px solid var(--hair);
      background: var(--paper); font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: 0.12em;
      color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* Header: "<plan> (6)" -- the stop count in ink-2, the grammar of Places' "<city> list (32)". */
    body.plan-view #locationsHeader h2 { display: flex; min-width: 0; cursor: pointer; }
    #locationsHeader .h-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
    #locationsHeader .h-count { flex-shrink: 0; color: var(--ink-2); white-space: nowrap; }
    .plan-empty-new { display: block; margin: var(--s4) auto 0; height: 36px; padding: 0 var(--s4); border: 1.5px solid var(--navy); border-radius: 3px;
      background: var(--paper-raised); color: var(--navy); cursor: pointer; font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 12px; letter-spacing: 0.08em; font-style: normal; }
    .plan-empty-new:active { background: var(--state-press); }

    /* Map: a stop's number replaces its glyph inside the same ring. */""", 'r2 css')

block_start = "    // ---- the panel: switch + plan ledger"
block_end_fn = "    function initPlans() {"
R2_PANEL = r"""    // ---- the panel: switch + plan picker (v3 r2) ----------------------------
    // The picker sits in the switch's row, in BOTH views (the panel is identical and the
    // same height); its slip lists every plan (✓ = open, count, ⋯ = rename/delete THAT plan)
    // and New plan. Picking a plan opens it in Plans and closes the slip; the panel stays.
    let planLedgerSig = null;
    const PLAN_CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" stroke-width="2.25"/></svg>';
    function renderPlanPanel() {
      const panel = document.getElementById('filtersPanel');
      panel.classList.toggle('plans-side', inPlanView());
      document.querySelectorAll('#listSwitch [role="radio"]').forEach(b => {
        const on = b.dataset.view === listView;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      const pick = document.getElementById('planPick'), ledger = document.getElementById('planLedger');
      const counts = plans.map(p => stopCount(p.id));
      const open = plansAvailable === true && (!!planPanel.open || planPanel.mode === 'creating');
      const sig = JSON.stringify([listView, plansAvailable, activePlanId, planPanel.mode, open, planPanel.target, plans.map(p => [p.id, p.name]), counts]);
      if (sig === planLedgerSig) return;
      planLedgerSig = sig;
      const hadFocus = panel.contains(document.activeElement) ? document.activeElement : null;
      const focusKey = hadFocus && (hadFocus.dataset.plan || hadFocus.dataset.more || hadFocus.dataset.act || (hadFocus.tagName === 'INPUT' ? 'input' : null));
      const cur = activePlan();
      const label = plansAvailable === false ? 'Not available yet' : plansAvailable === null ? 'Loading…' : cur ? cur.name : plans.length ? 'Pick a plan' : 'New plan';
      const act = plansAvailable !== true ? 'none' : plans.length ? 'toggle' : 'new';
      pick.innerHTML = `<button type="button" class="plan-picker" data-act="${act}" aria-haspopup="true" aria-expanded="${open}"${act === 'none' ? ' aria-disabled="true"' : ''} aria-label="Plan: ${escapeAttr(label)}">` +
        `${act === 'new' ? PLAN_SVG.plus : ''}<span class="plan-name">${escapeHtml(label)}</span>${act === 'toggle' ? PLAN_CHEV : ''}</button>`;
      ledger.hidden = !open;
      if (!open) { ledger.innerHTML = ''; return; }
      const form = (lbl, a) => `<div class="plan-opt plan-form"><input type="text" maxlength="${PLAN_NAME_MAX}" enterkeyhint="done" autocomplete="off" aria-label="${lbl}" placeholder="Plan name" value="${escapeAttr(planPanel.draft)}">` +
        `<button type="button" class="plan-act" data-act="cancel">Cancel</button><button type="button" class="plan-act primary" data-act="${a}">${a === 'create' ? 'Create' : 'Save'}</button></div>`;
      ledger.innerHTML = plans.map((p, i) => {
        const tgt = p.id === planPanel.target;
        if (tgt && planPanel.mode === 'renaming') return form('Plan name', 'save');
        if (tgt && planPanel.mode === 'acting') {
          return `<div class="plan-opt plan-form" role="group" aria-label="${escapeAttr(p.name)}"><button type="button" class="plan-act primary" data-act="rename">Rename</button>` +
            `<button type="button" class="plan-act danger" data-act="delete">Delete plan</button><span class="plan-spacer"></span><button type="button" class="plan-act" data-act="cancel">Cancel</button></div>`;
        }
        const n = counts[i], ct = `${n} ${n === 1 ? 'stop' : 'stops'}`;
        return `<div class="plan-opt"><button type="button" class="plan-pick" data-plan="${escapeAttr(p.id)}" aria-current="${p.id === activePlanId}" aria-label="${escapeAttr(p.name)}, ${ct}">` +
          `${PLAN_SVG.check}<span class="plan-name">${escapeHtml(p.name)}</span><span class="plan-count">${ct}</span></button>` +
          `<button type="button" class="plan-more" data-act="more" data-more="${escapeAttr(p.id)}" aria-label="Rename or delete ${escapeAttr(p.name)}">${PLAN_SVG.more}</button></div>`;
      }).join('') + (planPanel.mode === 'creating' ? form('New plan name', 'create')
        : `<div class="plan-opt"><button type="button" class="plan-pick plan-new" data-act="new">${PLAN_SVG.plus}<span class="plan-name">New plan</span><span></span></button></div>`);
      const input = ledger.querySelector('input');
      if (input && (focusKey === 'input' || planPanel.focusInput)) {
        planPanel.focusInput = false;
        input.focus({ preventScroll: true });
        input.setSelectionRange(input.value.length, input.value.length);
      } else if (focusKey) {
        const again = panel.querySelector(`[data-plan="${CSS.escape(focusKey)}"], [data-more="${CSS.escape(focusKey)}"], [data-act="${CSS.escape(focusKey)}"]`);
        if (again) again.focus({ preventScroll: true });
      }
    }
    function setPlanPanel(next) { planPanel = { mode: null, draft: '', open: true, ...next }; renderPlanPanel(); }
    async function submitPlanForm() {
      const name = cleanPlanName(planPanel.draft);
      if (!name) { const i = document.querySelector('#planLedger input'); if (i) i.focus(); return; }
      if (planPanel.mode === 'creating') {
        setPlanPanel({ open: false });
        const id = await createPlan(name);
        if (id) choosePlan(id);
      } else if (planPanel.mode === 'renaming') {
        const id = planPanel.target;
        setPlanPanel({});
        await renamePlan(id, name);
      }
    }
    async function openNewPlan() {   // from the picker, the slip, or the empty list's button
      if (!await requireAuth()) return;
      const panel = document.getElementById('filtersPanel');
      if (!panel.classList.contains('visible')) document.getElementById('toggleFiltersBtn').click();
      setPlanPanel({ mode: 'creating', focusInput: true });
    }
    function initPlans() {
      const sw = document.getElementById('listSwitch');
      sw.addEventListener('click', e => { const b = e.target.closest('[role="radio"]'); if (b) setListView(b.dataset.view); });
      sw.addEventListener('keydown', e => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault();
        const v = e.key === 'Home' ? 'places' : e.key === 'End' ? 'plans' : (listView === 'places' ? 'plans' : 'places');
        setListView(v);
        sw.querySelector(`[data-view="${v}"]`).focus();
      });
      const ledger = document.getElementById('planLedger');
      ledger.addEventListener('input', e => { if (e.target.tagName === 'INPUT') planPanel.draft = e.target.value; });
      ledger.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setPlanPanel(e.target.tagName === 'INPUT' ? {} : { open: false }); return; }
        if (e.target.tagName === 'INPUT' && e.key === 'Enter') { e.preventDefault(); submitPlanForm(); }
      });
      const onClick = async e => {
        const pick = e.target.closest('[data-plan]');
        if (pick) { choosePlan(pick.dataset.plan); return; }
        const b = e.target.closest('[data-act]');
        if (!b) return;
        const act = b.dataset.act, tp = plans.find(p => p.id === planPanel.target);
        if (act === 'none') return;
        if (act === 'toggle') setPlanPanel({ open: !(planPanel.open || planPanel.mode) });
        else if (act === 'cancel') setPlanPanel({});
        else if (act === 'create' || act === 'save') submitPlanForm();
        else if (act === 'new') openNewPlan();
        else if (act === 'more') setPlanPanel({ mode: 'acting', target: b.dataset.more });
        else if (act === 'rename' && tp) { if (await requireAuth()) setPlanPanel({ mode: 'renaming', draft: tp.name, target: tp.id, focusInput: true }); else setPlanPanel({}); }
        else if (act === 'delete' && tp) {
          if (!await requireAuth()) { setPlanPanel({}); return; }
          setPlanPanel({});
          // Plain words, the phone's own dialog (the app's other deletes do the same). Any plan,
          // open or not: deleting another plan never changes what you're looking at.
          if (confirm(`Delete “${tp.name}”? Its places stay in your list.`)) await deletePlan(tp.id);
        }
      };
      ledger.addEventListener('click', onClick);
      document.getElementById('planPick').addEventListener('click', onClick);
      // The slip closes with the panel.
      document.getElementById('toggleFiltersBtn').addEventListener('click', () => setTimeout(() => {
        if (!document.getElementById('filtersPanel').classList.contains('visible') && (planPanel.open || planPanel.mode)) setPlanPanel({ open: false });
      }, 0));
      // Back to the stops from anywhere in a long list: tap the plan's name
      // (the iOS "tap the title to go to the top" convention). No new control.
      document.querySelector('#locationsHeader h2').addEventListener('click', () => {
        if (!inPlanView()) return;
        document.getElementById('locationsList').scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      });
      planEmptyBtn.addEventListener('click', openNewPlan);
    }
"""
EDITS.append(('__BLOCK__', R2_PANEL, 'r2 panel block'))

edit("""      planPanel = { mode: null, draft: '', open: false };   // v3: picking collapses the plan row""",
"""      planPanel = { mode: null, draft: '', open: false };   // v3: picking closes the plan slip""", 'r2 choose comment')

# R4 header "<plan> · n stops"
edit("""      document.querySelector('#locationsHeader h2').textContent = planMode
        ? (activePlan() ? activePlan().name : 'Plans')
        : `${activeCityLabel()} list (${visible.length + visibleShapes.length})`;""",
"""      const h2 = document.querySelector('#locationsHeader h2');
      if (planMode && activePlan()) {
        // Just the name: a count here cost 2 characters of fit (18-char names truncated). Places'
        // title always reads "<city> list (N)", so a plan named "Copenhagen" still differs.
        h2.innerHTML = `<span class="h-name">${escapeHtml(activePlan().name)}</span>`;
      } else h2.textContent = planMode ? 'Plans' : `${activeCityLabel()} list (${visible.length + visibleShapes.length})`;""", 'r2 header')

# R3 rule caption; empty-list action
edit("""    const planOthersNote = document.createElement('div'); planOthersNote.className = 'plan-list-note';""",
"""    const planOthersNote = document.createElement('div'); planOthersNote.className = 'plan-list-note';
    const planEmptyBtn = document.createElement('button'); planEmptyBtn.type = 'button'; planEmptyBtn.className = 'plan-empty-new'; planEmptyBtn.textContent = 'New plan';
    // "Add from Copenhagen · cafe (1)": where the plan ends, and what the filters put below it.
    function ruleCaption(n) {
      const all = Object.keys(CATEGORY_COLORS), on = all.filter(c => filters.categories[c]);
      const cats = on.length === all.length ? '' : !on.length ? ' · no categories' : on.length <= 2 ? ' · ' + on.join(', ') : ` · ${on.length} categories`;
      return `Add from ${activeCityLabel()}${cats} (${n})`;
    }
    function frameOthers() {   // a city chip in Plans frames what you can add from, above the open panel
      const o = planOthers();
      const pts = o.locs.map(l => [l.lat, l.lng]).concat(...o.shapes.map(n => n.geometry || []));
      if (!pts.length || !map) return;
      const panel = document.getElementById('filtersPanel');
      const under = panel.classList.contains('visible') ? panel.offsetHeight : 0;
      map.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [40, 96], paddingBottomRight: [40, 40 + under], maxZoom: 15, animate: !prefersReducedMotion() });
    }""", 'r2 rule helpers')
edit("""      let prevCat = null;
      seq.forEach((r, i) => {""",
"""      planRule.textContent = ruleCaption(others.locs.length + others.shapes.length);
      seq.forEach((r, i) => {""", 'r2 rule caption')
edit("""      emptyState.lastChild.textContent = emptyText(planMode);""",
"""      const emptyText_ = [...emptyState.childNodes].find(n => n.nodeType === 3);
      if (emptyText_) emptyText_.textContent = emptyText(planMode);
      // No plans yet: the empty list offers the one next step (sign-in first if needed).
      const wantNew = planMode && plansAvailable === true && !plans.length;
      if (wantNew && !planEmptyBtn.parentNode) emptyState.appendChild(planEmptyBtn);
      else if (!wantNew && planEmptyBtn.parentNode) planEmptyBtn.remove();""", 'r2 empty action')

# R2 map: other places muted in Plans, clusters without counts, 'plan only' option (G6 b)
edit("""      const stop = planMarks().byLoc.get(loc.id);
      if (stop) return planNumberIcon(""",
"""      const stop = planMarks().byLoc.get(loc.id);
      // r6: every place that isn't a stop is its ordinary Places pin (the owner: "the same approach").
      if (stop) return planNumberIcon(""", 'r2 muted pins')
edit("""        const signature = markerSignature(loc) + '|' + planMarkKey('loc', loc.id);   // plan number / NEXT re-icons + re-labels the popup""",
"""        const signature = markerSignature(loc) + '|' + planMarkKey('loc', loc.id) + '|' + (inPlanView() && activePlan() ? 'p' : '');   // plan number / NEXT / muted re-icons""", 'r2 marker sig')
edit("""        const id = 'cluster:' + (starred ? '*' : '') + members.map(m => m.id).sort().join(',');""",
"""        const id = (inPlanView() && activePlan() ? 'pcluster:' : 'cluster:') + (starred ? '*' : '') + members.map(m => m.id).sort().join(',');""", 'r2 cluster id')
edit("""    function clusterMarkerIcon(count, starred) {""",
"""    // r6: Places' clusters, unchanged, in Plans too (red disc, paper count, tap zooms in).
    function clusterMarkerIcon(count, starred, members) {""", 'r2 muted clusters')
edit("""      const pinned = all.filter(l => pm.byLoc.has(l.id));
      const visible = pinned.length ? all.filter(l => !pm.byLoc.has(l.id)) : all;""",
"""      const pinned = [];   // r17: stops cluster exactly like any pin (owner)
      let visible = all;
      if (V3.map === 'plan-only' && inPlanView() && activePlan()) visible = visible.filter(l => pm.byLoc.has(l.id) || l.id === highlightedId);   // option (b)
      // r17: a district/street STOP clusters too, at its centroid (its plan mark is a pin like any
      // other); a clustered one hides its own mark and the cluster counts and tags it
      if (inPlanView() && activePlan()) visible = visible.concat(pm.rows.filter(r => r.nb && shapeCentroid(r.nb)).map(r => { const c = shapeCentroid(r.nb); return { id: 'shape:' + r.nb.id, lat: c[0], lng: c[1], starred: false, planShape: r.nb.id }; }));""", 'r2 plan-only map')
edit("""      if (!map || map.getZoom() >= SOLO_MIN_ZOOM) return { solo: all, clusters: [] };""",
"""      if (V3.map === 'plan-only' && inPlanView() && activePlan()) { const pm0 = planMarks(); if (!map || map.getZoom() >= SOLO_MIN_ZOOM) { clusteredShapeIds = new Set(); return { solo: all.filter(l => pm0.byLoc.has(l.id) || l.id === highlightedId), clusters: [] }; } }
      if (!map || map.getZoom() >= SOLO_MIN_ZOOM) return { solo: all, clusters: [] };""", 'r2 plan-only map z14')

# G3: the Places delete confirm names the plans a place is in
edit("""    window.confirmDelete = (id, name) => {
      if (confirm(`Delete ${name}?`)) {
        deleteLocation(id);
      }
    };
    window.confirmDeleteShape = (id, label) => {
      if (confirm(`Delete ${label}?`)) {
        deleteNeighborhoodShape(id);
      }
    };""",
"""    // v3: deleting a place that is a stop says so (the plan would otherwise renumber silently).
    function inPlansNote(match) {
      const inPlans = plans.filter(p => planStops.some(s => s.plan_id === p.id && match(s)));
      if (!inPlans.length) return '';
      return `\\nIt is a stop in ${inPlans.map(p => `“${p.name}”`).join(', ')}; it will leave ${inPlans.length > 1 ? 'those plans' : 'that plan'} too.`;
    }
    window.confirmDelete = (id, name) => {
      if (confirm(`Delete ${name}?${inPlansNote(s => s.location_id === id)}`)) {
        deleteLocation(id);
      }
    };
    window.confirmDeleteShape = (id, label) => {
      if (confirm(`Delete ${label}?${inPlansNote(s => s.shape_id === Number(id))}`)) {
        deleteNeighborhoodShape(id);
      }
    };""", 'r2 delete copy')

edit("""        : cluster ? (starred ? Z_CLUSTER_STARRED : Z_CLUSTER)
        : stop ? Z_PLAN_STOP - stop.n""",
"""        : cluster ? (inPlanView() && activePlan() ? Z_PLAN_CLUSTER + (starred ? 100 : 0) : starred ? Z_CLUSTER_STARRED : Z_CLUSTER)   // r7: as in Places, clusters beat every pin -- stops included
        : stop ? Z_PLAN_STOP - stop.n""", 'r7 clusters above stops')

edit("""      map.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [40, 96], paddingBottomRight: [40, 40 + under], maxZoom: 16, animate });
      record();                              // no move needed: the view is already final
      if (animate) map.once('moveend', record);   // animated: the view it lands on""",
"""      // r8: the default view has two jobs.
      //  BUILDING (filter panel open): fit the stops AND every place the filters match, into the
      //    safe map box above the panel (clear of the zoom control, the round buttons and the
      //    attribution). No zooming for close pairs.
      //  FOLLOWING (panel closed): fit every stop (r11: there is no NEXT to favour). Stops whose
      //    pins overlap share one tag; one close pair never sets the zoom.
      const box = planSafeBox(under), sz = map.getSize();
      const pad = { paddingTopLeft: [box.l, box.t], paddingBottomRight: [sz.x - box.r, sz.y - box.b], animate: false };
      const rows = planMarks().rows;
      const llOf = r => r.loc ? L.latLng(r.loc.lat, r.loc.lng) : (shapeCentroid(r.nb) && L.latLng(shapeCentroid(r.nb)));
      const stopLL = rows.map(llOf).filter(Boolean);
      const fit = (lls, maxZoom) => lls.length === 1 ? map.setView(lls[0], Math.max(map.getZoom(), 15), { animate: false }) : map.fitBounds(L.latLngBounds(lls), { ...pad, maxZoom });
      const overlaps = lls => { const ps = lls.map(ll => map.latLngToContainerPoint(ll)); return ps.some((p, i) => ps.some((q, j) => i < j && p.distanceTo(q) < 30)); };
      if (under) {
        const o = planOthers();
        const cand = o.locs.map(l => L.latLng(l.lat, l.lng)).concat(o.shapes.map(n => shapeCentroid(n)).filter(Boolean).map(c => L.latLng(c)));
        fit(stopLL.concat(cand), 16);
      } else {
        // r12 (UX): FOLLOWING = the stops in the selected city chip -- the chip is the "which leg am I
        // on" control. With ALL CITIES, or when that city has no stops, every stop. Overlapping
        // stops share one tag ("2–3").
        const inCity = filters.city === null ? [] : rows.filter(r => (r.loc ? r.loc.city : r.nb.city) === filters.city).map(llOf).filter(Boolean);
        fit(inCity.length ? inCity : stopLL, 16);
      }
      record();""", 'r7 edit 0')
edit("""      if (!plans.length) return 'No plans yet.';""",
"""      if (!plans.length) return 'No plans yet. A plan’s stops show here and on the map.';""", 'r7 edit 1')

# ---------------------------------------------------------------------------- round 9
# r9.1: the map follows the panel both ways -- unless you moved it yourself.
edit("""      if (!filtersPanel.classList.contains('visible')) reframeAfterPanel();
    };""", """      reframeAfterPanel();   // r9: opening re-fits too (building), not only closing
      if (typeof placePlanSlip === 'function') placePlanSlip();   // r9: the list moved under the slip
    };""", 'r9 reframe on open')
edit("""    function reframeAfterPanel() {
      if (!inPlanView() || !lastPlanFit || !lastPlanFit.under) return;
      if (planFitView() !== lastPlanFit.view) { lastPlanFit = null; return; }
      frameActivePlan();
    }""", """    // r9: the panel changes the map's job (building vs following), so opening AND closing it
    // re-fit -- while the map is still where the app last put it (a fit, or the pan after +).
    // Once you have moved the map yourself it stays yours: closing leaves it alone (you only
    // gain room); opening keeps your zoom and pans the least that lifts the stops you had on
    // screen out from under the panel (zooming out only if they can't fit in the strip).
    const planMapUnmoved = () => !!lastPlanFit && planFitView() === lastPlanFit.view;
    function reframeAfterPanel() {
      if (!inPlanView() || !activePlan() || !map) return;
      if (planMapUnmoved()) { frameActivePlan({ animate: false }); return; }
      lastPlanFit = null;
      const pn = document.getElementById('filtersPanel');
      if (!pn.classList.contains('visible')) return;
      const box = planSafeBox(pn.offsetHeight), full = planSafeBox(0);
      const pts = planMarks().rows.map(r => r.loc ? L.latLng(r.loc.lat, r.loc.lng) : (shapeCentroid(r.nb) && L.latLng(shapeCentroid(r.nb)))).filter(Boolean);
      const seen = pts.filter(ll => { const p = map.latLngToContainerPoint(ll); return p.x >= full.l && p.x <= full.r && p.y >= full.t && p.y <= full.b; });
      if (!seen.length) return;   // you had panned away from the plan: nothing of it to keep
      const ps = seen.map(ll => map.latLngToContainerPoint(ll));
      const x1 = Math.min(...ps.map(p => p.x)), x2 = Math.max(...ps.map(p => p.x)), y1 = Math.min(...ps.map(p => p.y)), y2 = Math.max(...ps.map(p => p.y));
      if (x2 - x1 <= box.r - box.l && y2 - y1 <= box.b - box.t) {
        const dx = x1 < box.l ? x1 - box.l : x2 > box.r ? x2 - box.r : 0, dy = y1 < box.t ? y1 - box.t : y2 > box.b ? y2 - box.b : 0;
        if (dx || dy) map.panBy([dx, dy], { animate: false });
      } else {
        const sz = map.getSize();
        map.fitBounds(L.latLngBounds(seen), { paddingTopLeft: [box.l, box.t], paddingBottomRight: [sz.x - box.r, sz.y - box.b], maxZoom: map.getZoom(), animate: false });
      }
    }""", 'r9 reframe fn')
edit("""    function closeFiltersPanel() {
      document.getElementById('filtersPanel').classList.remove('visible');
      document.getElementById('toggleFiltersBtn').classList.remove('active');
    }""", """    function closeFiltersPanel() {
      const was = document.getElementById('filtersPanel').classList.contains('visible');
      document.getElementById('filtersPanel').classList.remove('visible');
      document.getElementById('toggleFiltersBtn').classList.remove('active');
      if (was && typeof reframeAfterPanel === 'function') reframeAfterPanel();   // r9: same rule as the button
    }""", 'r9 closeFiltersPanel reframes')

# ---------------------------------------------------------------------------- round 11
edit("""      let lastVisited = -1;
      rows.forEach((r, i) => { if (r.loc && r.loc.visited) lastVisited = i; });
      const next = -1;   // r11: no NEXT (owner: "Next isn't necessary"); see the round-11 edit below
      rows.forEach((r, i) => { r.n = i + 1; r.m = rows.length; r.next = i === next; });""",
"""      rows.forEach((r, i) => { r.n = i + 1; r.m = rows.length; });   // r11: numbers only -- no NEXT""", 'r11 no NEXT')

# ---------------------------------------------------------------------------- round 17
edit("""      return { solo: pinned.concat(solo), clusters };
    }""", """      clusteredShapeIds = new Set(clusters.flatMap(c => c.memberIds.filter(id => String(id).startsWith('shape:')).map(id => Number(String(id).slice(6)))));
      return { solo: pinned.concat(solo).filter(l => !l.planShape), clusters };
    }
    let clusteredShapeIds = new Set();   // r17: district/street stops currently inside a cluster""", 'r17 shapes cluster')
edit("""      if (!map || map.getZoom() >= SOLO_MIN_ZOOM) return { solo: all, clusters: [] };
      // v3: a stop is never absorbed""", """      if (!map || map.getZoom() >= SOLO_MIN_ZOOM) { clusteredShapeIds = new Set(); return { solo: all, clusters: [] }; }
      // v3 (r17: superseded -- stops cluster like any pin): a stop is never absorbed""", 'r17 shapes unclustered at z14')
edit("""          if (!r.nb) return;
          const c = shapeCentroid(r.nb);""", """          if (!r.nb) return;
          if (clusteredShapeIds.has(r.nb.id)) return;   // r17: inside a cluster -- the cluster counts and tags it
          const c = shapeCentroid(r.nb);""", 'r17 clustered shape has no mark')

# ---------------------------------------------------------------------------- apply
for old, new, name in EDITS:
    if old == '__BLOCK__':   # replace the panel code: from its banner to the end of initPlans()
        a = s.index(block_start); b = s.index('\n    }\n', s.index(block_end_fn)) + len('\n    }\n')
        if s.count(block_start) != 1 or s.count(block_end_fn) != 1: sys.exit(f'patch.py: "{name}" markers not unique')
        s = s[:a] + new + s[b:]
        continue
    n = s.count(old)
    if n != 1:
        sys.exit(f'patch.py: "{name}" matched {n} times (expected 1); the build has drifted')
    s = s.replace(old, new)
open(out, 'w', encoding='utf-8').write(s)
print(f'patch.py: {len(EDITS)} edits applied -> {out}')
