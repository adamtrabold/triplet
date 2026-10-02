// Plans deep-dive: concept frames for three models, injected into the real index.html (stub data).
// Not production code. __proto('A1'..'C4') sets up one frame.
(function () {
  const css = `
  /* ---- the switch: one joined track, equal halves, the ON half is the state system's navy tile ---- */
  .seg { display: flex; margin: var(--s3) var(--gutter); height: 36px; border: 1px solid var(--navy); border-radius: 3px; background: var(--paper-raised); overflow: hidden; }
  .seg button { flex: 1 1 0; position: relative; border: none; margin: 0; padding: 0; background: transparent; color: var(--navy);
    font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; font-size: 12px; line-height: 16px; letter-spacing: .08em; font-weight: 700; cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--navy); }
  .seg button::before { content: ''; position: absolute; left: 0; right: 0; top: -4px; bottom: -4px; }
  .seg button[aria-checked="true"] { background: var(--state-on-bg); color: var(--state-on-fg); }
  .seg-wrap { border-bottom: 1px solid var(--hair); }

  /* ---- ledger rows inside the panel (the sort menu's motif, full width) ---- */
  .pcap { height: 24px; display: flex; align-items: center; padding: 0 var(--gutter); border-bottom: 1px solid var(--hair);
    font: 700 10px/12px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .12em; color: var(--ink-2); }
  .popt { display: grid; grid-template-columns: 16px 1fr auto; align-items: center; column-gap: var(--s2); width: 100%; height: 44px; padding: 0 var(--gutter);
    background: transparent; border: none; border-bottom: 1px solid var(--hair); text-align: left;
    font: 700 13px/16px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .05em; color: var(--navy); }
  .popt .n { font-size: 11px; letter-spacing: .08em; color: var(--ink-2); font-weight: 600; }
  .popt svg { width: 16px; height: 16px; }
  .popt.new { color: var(--ink-2); }

  /* ---- row slots ---- */
  .slot { width: 44px; height: 44px; margin: -10px -8px -10px 0; border: none; background: none; padding: 0; display: flex; align-items: center; justify-content: center; color: var(--navy); }
  .slot .tile { width: 26px; height: 26px; box-sizing: border-box; border-radius: 3px; display: flex; align-items: center; justify-content: center;
    font: 700 13px/1 var(--font-ui); font-stretch: 80%; font-variant-numeric: tabular-nums; }
  .slot .tile.off { border: 1px solid var(--hair); background: var(--paper-raised); color: var(--navy); }
  .slot .tile.on { background: var(--state-on-bg); color: var(--state-on-fg); }
  .slot svg { width: 16px; height: 16px; }
  .grip svg { width: 20px; height: 20px; color: var(--ink-2); }
  .location-card { position: relative; }
  .lnum { position: absolute; left: 0; width: 16px; top: 50%; transform: translateY(-50%); text-align: center;
    font: 700 11px/1 var(--font-ui); font-stretch: 80%; font-variant-numeric: tabular-nums; color: var(--navy); pointer-events: none; }
  .location-card.is-visited .lnum { color: var(--ink-2); }
  .row-meta .nx { color: var(--navy); font-weight: 800; }
  .rule { height: 32px; display: flex; align-items: flex-end; padding: 0 var(--gutter) 6px; border-bottom: 1px solid var(--navy); box-sizing: border-box;
    font: 700 10px/12px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .12em; color: var(--ink-2); background: var(--paper); }
  .backrow { height: 44px; display: flex; align-items: center; gap: 6px; padding: 0 var(--gutter); border-bottom: 1px solid var(--hair);
    font: 700 11px/12px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .1em; color: var(--navy); }
  .location-card.lifted { z-index: 5; background: var(--paper-raised); box-shadow: 0 6px 16px rgba(18,41,63,.22), 0 0 0 1px var(--navy); transform: translateY(-30px) scale(1.01); }
  .dropgap { height: 56px; box-sizing: border-box; border: 1px dashed var(--navy); border-left: none; border-right: none; background: var(--paper-pressed); }
  .plan-row { display: grid; grid-template-columns: 1fr auto; align-items: center; height: 56px; padding: 0 var(--gutter) 0 56px; border-bottom: 1px solid var(--hair); position: relative; }
  .plan-row h3 { margin: 0; font: 600 16px/20px var(--font-ui); color: var(--ink); }
  .plan-row .m { font: 700 10px/14px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-2); }
  .plan-row .ic { position: absolute; left: 16px; top: 16px; width: 24px; height: 24px; color: var(--navy); }
  .plan-row .chev { color: var(--ink-2); font-size: 18px; }
  .plan-row.new h3 { color: var(--ink-2); font-weight: 600; }

  /* ---- popup "Add to plan" (model C) ---- */
  .popup-plan { display: flex; align-items: center; gap: 8px; min-height: 44px; margin-top: 2px; border-top: 1px solid var(--hair);
    font: 700 12px/16px var(--font-ui); font-stretch: 75%; text-transform: uppercase; letter-spacing: .08em; color: var(--navy); }
  .popup-plan svg { width: 18px; height: 18px; }
  .popup-plan .n { margin-left: auto; color: var(--ink-2); font-weight: 600; }
  #planSlip { position: fixed; z-index: 2600; width: 230px; background: var(--paper-raised); border: 1px solid var(--navy); border-radius: 2px; box-shadow: 2px 2px 0 var(--navy); }
  #planSlip .pcap { padding-left: 36px; border-bottom-color: var(--navy); }
  #planSlip .popt { padding: 0 var(--s3); height: 40px; }

  /* ---- map stop tags ---- */
  .stop-tag { width: 17px; height: 17px; border-radius: 50%; box-sizing: border-box; background: var(--paper); border: 1.5px solid var(--navy); color: var(--navy);
    display: flex; align-items: center; justify-content: center; font: 700 10px/1 var(--font-ui); font-stretch: 85%; font-variant-numeric: tabular-nums; box-shadow: 0 0 0 1.5px var(--paper); }
  .stop-tag.next { background: var(--navy); color: var(--paper); }
  .stop-tag.done { border-color: var(--ink-2); color: var(--ink-2); background: var(--paper-filed); }
  .caption-hide .leaflet-control-attribution { visibility: hidden; }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const I = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 12.5l5.5 5.5L20.5 6" fill="none" stroke="currentColor" stroke-width="2.25"/></svg>',
    grip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M5 8h14M5 12h14M5 16h14"/></svg>',
    route: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"/></svg>',
  };
  const PLAN = ['mir', 'jae', 'cof', 'ass', 'rav'];
  const byId = id => locations.find(l => l.id === id);
  const list = document.getElementById('locationsList');
  const panel = document.getElementById('filtersPanel');
  const h2 = document.querySelector('#locationsHeader h2');
  const card = id => list.querySelector(`.location-card[data-id="${id}"]`);
  const setTitle = t => { h2.textContent = t; };

  function seg(left, right, on) {
    const w = document.createElement('div'); w.className = 'seg-wrap';
    w.innerHTML = `<div class="seg" role="radiogroup" aria-label="List"><button role="radio" aria-checked="${on === 0}">${left}</button><button role="radio" aria-checked="${on === 1}">${right}</button></div>`;
    return w;
  }
  function openPanel() { document.getElementById('toggleFiltersBtn').click(); }
  function planLedger(cap) {
    const d = document.createElement('div');
    d.innerHTML = `<div class="pcap">${cap}</div>
      <button class="popt">${I.check}<span>Nørrebro afternoon</span><span class="n">5 stops</span></button>
      <button class="popt"><span></span><span>Rainy day</span><span class="n">3 stops</span></button>
      <button class="popt new"><span style="display:flex">${I.plus}</span><span>New plan</span><span></span></button>`;
    return d;
  }
  // Put the cards for ids in order at the top of the list; hide the rest unless keepRest.
  function orderList(ids, keepRest) {
    const cards = [...list.querySelectorAll('.location-card')];
    ids.slice().reverse().forEach(id => { const c = card(id); if (c) list.prepend(c); });
    if (!keepRest) cards.forEach(c => { if (!ids.includes(c.dataset.id)) c.style.display = 'none'; });
  }
  function numberRows(ids, nextId) {
    ids.forEach((id, i) => {
      const c = card(id); if (!c) return;
      const n = document.createElement('span'); n.className = 'lnum'; n.textContent = i + 1; c.appendChild(n);
      if (id === nextId) { const m = c.querySelector('.row-meta'); m.insertAdjacentHTML('afterbegin', '<span class="nx">NEXT</span> &middot; '); }
    });
  }
  function slot(id, html, cls = 'slot') {
    const c = card(id); if (!c) return;
    const x = c.querySelector('.delete-btn'); if (x) x.remove();
    const b = document.createElement('button'); b.className = cls; b.innerHTML = html;
    c.querySelector('.location-actions').appendChild(b);
  }
  function markVisited(id) { const l = byId(id); l.visited = true; }
  function view(lat, lng, z) { map.setView([lat, lng], z, { animate: false }); }
  function tags(ids, { onlyStops = false, next = null } = {}) {
    setTimeout(() => {
      if (onlyStops) markersById.forEach((m, id) => { if (!ids.includes(id) && m.marker._icon) m.marker._icon.style.display = 'none'; });
      ids.forEach((id, i) => {
        const l = byId(id);
        const cls = l.visited ? 'done' : id === next ? 'next' : '';
        L.marker([l.lat, l.lng], { interactive: false, zIndexOffset: 5000,
          icon: L.divIcon({ className: '', html: `<div class="stop-tag ${cls}">${i + 1}</div>`, iconSize: [17, 17], iconAnchor: [22, 22] }) }).addTo(map);
      });
    }, 350);
  }
  function hideShapes() { /* shapes stay as the app draws them */ }

  window.__proto = function (s) {
    const m = s[0], f = +s[1];
    if (f === 3 || (m === 'B' && f === 4) || (m !== 'B' && f === 4)) { markVisited('mir'); }
    updateUI();
    const panelOpen = f === 1;
    map.fitBounds(L.latLngBounds(PLAN.map(id => [byId(id).lat, byId(id).lng])), { paddingTopLeft: [40, 90], paddingBottomRight: [40, panelOpen ? 280 : 40], maxZoom: 16, animate: false });
    const planView = (m === 'A' && f >= 3) || m === 'B' || (m === 'C' && f !== 2);
    if (planView) document.getElementById('sortBtn').style.display = 'none';

    if (m === 'A') {
      if (f === 1 || f === 2) {
        // Places list is the builder: every row's slot shows its stop number (in) or + (not in)
        PLAN.forEach((id, i) => {});
        const inPlan = f === 1 ? PLAN : PLAN.slice(0, 3);
        [...list.querySelectorAll('.location-card')].forEach(c => {
          const i = inPlan.indexOf(c.dataset.id);
          slot(c.dataset.id, i >= 0 ? `<span class="tile on">${i + 1}</span>` : `<span class="tile off">${I.plus}</span>`);
        });
        setTitle('Copenhagen list (28)');
        tags(inPlan, {});
        if (f === 1) {
          openPanel();
          const pick = document.createElement('div');
          pick.innerHTML = `<button class="popt" style="grid-template-columns:auto 1fr auto"><span class="n" style="font-weight:700">Adding to</span><span>Nørrebro afternoon</span><span class="n">▾</span></button>`;
          panel.prepend(pick); panel.prepend(seg('Places', 'Plan', 0));
          document.getElementById('filters').style.display = 'none';
        } else {
          const j = card('jae'); setTimeout(() => { list.scrollTop = j.offsetTop - list.firstElementChild.offsetTop - 112; }, 50);
          // show the Nørrebro rows at the top of an A–Z list: scroll to "Assistens" region naturally (A–Z)
        }
      } else {
        orderList(PLAN); numberRows(PLAN, 'jae');
        PLAN.forEach(id => slot(id, I.grip, 'slot grip'));
        setTitle('Nørrebro afternoon (5)');
        tags(PLAN, { onlyStops: true, next: 'jae' });
        if (f === 4) { lift('ass', 1); }
      }
    }

    if (m === 'B') {
      if (f === 1) {
        openPanel();
        document.getElementById('cityFilters').style.display = 'none';
        document.getElementById('filters').style.display = 'none';
        panel.prepend(planLedger('Plans'));
        panel.prepend(seg('Places', 'Plans', 1));
      }
      {
        const stops = f <= 2 ? PLAN.slice(0, 2) : PLAN;
        orderList(stops, true); numberRows(stops, f <= 2 ? null : 'jae');
        stops.forEach(id => slot(id, I.grip, 'slot grip'));
        [...list.querySelectorAll('.location-card')].forEach(c => { if (!stops.includes(c.dataset.id)) slot(c.dataset.id, `<span class="tile off">${I.plus}</span>`); });
        const rule = document.createElement('div'); rule.className = 'rule';
        rule.textContent = `Everything else in Copenhagen list · ${28 - stops.length}`;
        card(stops[stops.length - 1]).after(rule);
        setTitle(`Nørrebro afternoon (${stops.length})`);
        tags(stops, { next: f <= 2 ? null : 'jae' });
        if (f === 4) lift('rav', 2);
      }
    }

    if (m === 'C') {
      if (f === 1) {
        openPanel();
        document.getElementById('cityFilters').style.display = 'none';
        document.getElementById('filters').style.display = 'none';
        panel.prepend(seg('Places', 'Plans', 1));
        [...list.querySelectorAll('.location-card')].forEach(c => c.style.display = 'none');
        list.insertAdjacentHTML('afterbegin', `
          <div class="plan-row"><span class="ic">${I.route}</span><div><h3>Nørrebro afternoon</h3><div class="m">5 stops · Copenhagen</div></div><span class="chev">›</span></div>
          <div class="plan-row"><span class="ic">${I.route}</span><div><h3>Rainy day</h3><div class="m">3 stops · Copenhagen</div></div><span class="chev">›</span></div>
          <div class="plan-row new"><span class="ic" style="color:var(--ink-2)">${I.plus}</span><div><h3>New plan</h3></div><span></span></div>`);
        setTitle('Plans (2)');
      } else if (f === 2) {
        setTitle('Copenhagen list (28)');
        // open the real popup via the real list-tap path, then add the plan line + slip
        card('ass').click();
        setTimeout(() => {
          const pop = document.querySelector('.leaflet-popup-content > div');
          if (pop) pop.insertAdjacentHTML('beforeend', `<button class="popup-plan" style="width:100%;background:none;border:none;border-top:1px solid var(--hair);padding:0">${I.route}<span>Add to plan</span><span class="n">In 1</span></button>`);
          const b = document.querySelector('.popup-plan'); if (!b) return;
          const r = b.getBoundingClientRect();
          const slip = document.createElement('div'); slip.id = 'planSlip';
          slip.innerHTML = `<div class="pcap">Add to plan</div>
            <button class="popt">${I.check}<span>Nørrebro afternoon</span><span class="n">4</span></button>
            <button class="popt"><span></span><span>Rainy day</span><span class="n"></span></button>
            <button class="popt new" style="border-bottom:none"><span style="display:flex">${I.plus}</span><span>New plan</span><span></span></button>`;
          document.body.appendChild(slip);
          slip.style.left = Math.min(r.left + 20, 390 - 240) + 'px';
          slip.style.top = (r.bottom + 4) + 'px';
        }, 1600);
      } else {
        orderList(PLAN); numberRows(PLAN, 'jae');
        PLAN.forEach(id => slot(id, I.grip, 'slot grip'));
        list.insertAdjacentHTML('afterbegin', `<div class="backrow"><span style="font-size:15px;line-height:1">‹</span>All plans</div>`);
        setTitle('Nørrebro afternoon (5)');
        tags(PLAN, { onlyStops: true, next: 'jae' });
        if (f === 4) lift('ass', 1);
      }
    }
  };
  // Drag in progress: row `id` lifted and hovering over slot `to` (0-based) with a gap there.
  function lift(id, to) {
    const c = card(id);
    const visible = [...list.children].filter(e => e.style.display !== 'none' && e.classList.contains('location-card') && e !== c);
    const target = visible[to];
    target.before(c);
    c.classList.add('lifted');
    c.style.transform = 'translateY(-8px) scale(1.02)';
  }
})();
