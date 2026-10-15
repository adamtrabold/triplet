// Page-side code for the Round 4 Card File variants (v3: after the CD and UX reviews). Injected into the REAL app
// (index.html, unmodified, in the gesture harness) by render.js after a place is set up. Reuses the app's tokens,
// glyph sprite, seal badge, row lead, row stamp and check path. render.js splices round 1's stand-in basemap in at BASEMAP.
// One family, the app's own (Archivo). No typewriter face (owner: "the typewriter font is unnecessary.").
//
// Carried:  rolo = Rolodex    (the card tips forward in a fixed-height drawer; one tappable card edge behind it,
//                              the cards after it stay live rows in front)
//           out  = Dealt Out  (the card leaves the file and is laid on the map under its pin; the file keeps a slot)
// Stand-Up (`up/`) was not carried; its stills are history and are not re-rendered by this file.
(() => {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ic = (id, cls = '') => `<svg class="k-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#g-${id}"/></svg>`;
  const rowStamp = (id, tilt) => `<span class="row-stamp" style="--stamp-tilt:${tilt == null ? stampTilt(String(id)) : tilt}deg" aria-hidden="true"><span class="row-stamp-ring">${stampCheckSvg()}<span class="row-stamp-word">Visited</span></span></span>`;
  const STICKER_INK = '#3A4C5B', CREAM = '#F2EBDD';   // the shipped visited pin sticker (STICKER.INK / STICKER.FACE)
  const chevDown = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const TRAY = '#E2D9C7';        // the file's tray: one step below --paper-filed so filed (visited) cards still lift off it
  const DRAWER = 452;            // Rolodex: one fixed drawer height for every place (UX: the map edge and header never move per place)

  const CSS = `
  .leaflet-tile-pane { visibility: hidden; }
  .k-base { position: absolute; inset: 0; z-index: 0; pointer-events: none; filter: sepia(0.3) saturate(0.75) contrast(0.96) hue-rotate(-6deg); }
  .k-base svg { width: 100%; height: 100%; display: block; }
  .k { font-family: var(--font-ui); color: var(--ink); -webkit-font-smoothing: antialiased; text-align: left; }
  .k-ic { width: 16px; height: 16px; display: block; flex: none; }

  /* ---------- THE FILE (before any tap). The list sits in a tray (${TRAY}); each row is the top of an index card
     standing in it, 10px in from the tray's walls, round-topped. No rules anywhere: a card's edge is the soft shadow it
     casts on the card behind, plus the 1px light catching its top edge (the owner's allowed 1px definition edge). */
  body.F-files #locationsList { background: ${TRAY}; padding: 6px 0 10px; box-shadow: inset 8px 0 8px -8px rgba(26,26,24,.18), inset -8px 0 8px -8px rgba(26,26,24,.18); }
  body.F-files .location-card { margin: 0 10px; padding-left: 6px; padding-right: 6px; border-bottom: 0; border-radius: 7px 7px 0 0;
    background: var(--paper-raised); position: relative;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.75), 0 -1px 0 rgba(90,86,76,.12), 0 -7px 10px -6px rgba(26,26,24,.26); }
  body.F-files .location-card.is-visited { background: var(--paper-filed); }
  body.F-files .location-card.group-end { border-bottom: 0; }
  body.F-files .plan-rule { margin-top: 8px; background: transparent; }
  body.F-files .location-card.highlighted:not(.F-slot) { background: var(--paper-raised); }
  body.F-files .location-card.highlighted.is-visited:not(.F-slot) { background: var(--paper-filed); }
  body.F-files .location-card.highlighted:not(.F-slot) h3 { color: var(--ink); }
  body.F-files .location-card.highlighted:not(.F-slot) .row-meta { color: var(--ink-2); }
  body.F-files .location-card.highlighted:not(.F-slot) .row-badge { color: var(--row-ink); --badge-field: var(--paper); }
  body.F-files .location-card.highlighted:not(.F-slot) .row-n { color: var(--ink-2); }
  body.F-files .location-card.highlighted:not(.F-slot) .row-stamp { color: inherit; }
  body.F-files .location-card.highlighted:not(.F-slot) .row-star, body.F-files .location-card.highlighted:not(.F-slot) .delete-btn { color: var(--ink-2); border-color: currentColor; }

  /* ---------- the card face (shared) ---------- */
  .F-wrap { position: absolute; z-index: 1003; filter: drop-shadow(0 -1px 0 rgba(90,86,76,.10)) drop-shadow(0 -2px 10px rgba(26,26,24,.12)); }
  .F-card { position: relative; background: var(--paper-raised); border-radius: 7px 7px 0 0; }
  .F-card.filed { background: var(--paper-filed); }
  .F-head { display: grid; grid-template-columns: var(--F-lead, 28px) 1fr 44px; column-gap: var(--gap); padding: 14px 0 0 6px; align-items: start; }
  .F-lead { height: 24px; display: flex; align-items: center; }
  .F-lead .row-lead { display: flex; align-items: center; gap: var(--gap); }
  .F-name { font-size: 18px; line-height: 24px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink); }
  .F-addr { margin-top: 2px; font-size: 12px; line-height: 16px; color: var(--ink-2); }
  .F-back { width: 44px; height: 44px; margin-top: -10px; display: flex; align-items: center; justify-content: center; color: var(--ink-2); }
  .F-body { padding: 0 var(--s4) 0 calc(6px + var(--F-lead, 28px) + var(--gap)); }
  .F-note { margin-top: var(--s3); font-size: 14px; line-height: 20px; color: var(--ink); white-space: pre-line; }
  /* the foot: three controls, one 24px (--s6) gap between their hit boxes; Visited is the shipped row stamp once visited */
  .F-acts { display: flex; align-items: center; gap: var(--s6); margin-top: var(--s1); min-height: 44px; padding-bottom: 4px; }
  .k-btn { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0; border: 0; background: none; font-family: var(--font-ui);
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 11px; line-height: 12px; letter-spacing: .1em; color: var(--ink);
           text-decoration: none; white-space: nowrap; cursor: pointer; }
  .k-btn.dir { color: var(--figure-deep); }
  .k-ring { width: 14px; height: 14px; margin: 1px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px currentColor; flex: none; }
  .F-stampbtn { position: relative; height: 44px; display: inline-flex; align-items: center; }
  .F-stampbtn .row-stamp { margin: 0; }
  .k-so .k-btn.star, .k-so .k-btn.vis, .k-so .F-stampbtn { opacity: var(--state-off-alpha); }
  /* the index tab: the card's sorting key = its type (the stop number lives on the card's lead only) */
  .F-tab { position: absolute; top: -21px; height: 22px; padding: 0 14px; background: inherit; display: flex; align-items: center; gap: 6px;
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .12em; color: var(--ink-2); white-space: nowrap;
           clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 100%, 0 100%); border-radius: 4px 4px 0 0; }
  .F-card.filed .F-tab { background: var(--paper-filed); }
  .F-tab .row-stamp-check { width: 10px; height: 10px; display: block; }

  /* ---------- ROLODEX: a fixed drawer ---------- */
  .R-body { position: relative; flex: 1; min-height: 0; overflow: hidden; background: ${TRAY}; box-shadow: inset 0 6px 8px -6px rgba(26,26,24,.20); }
  .R-edge { position: relative; height: 34px; margin: 10px 10px 0; padding: 0 6px; background: var(--paper-raised); border-radius: 7px 7px 0 0;
            box-shadow: inset 0 1px 0 rgba(255,255,255,.75), 0 -1px 0 rgba(90,86,76,.12), 0 -7px 10px -6px rgba(26,26,24,.26);
            display: flex; align-items: flex-start; padding-top: 7px; gap: var(--gap); }
  .R-edge.filed { background: var(--paper-filed); }
  .R-edge .n { width: var(--col-glyph); text-align: center; flex: none; font: 700 12px/16px var(--font-ui); color: var(--ink-2); }
  .R-edge .nm { max-width: calc(100% - 170px); font-size: 13px; line-height: 16px; font-weight: 600; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .R-blank { height: 22px; }
  .R-card { margin: 0 10px; position: relative; z-index: 2; }
  .R-card .F-card { filter: drop-shadow(0 -1px 0 rgba(90,86,76,.12)) drop-shadow(0 -4px 6px rgba(26,26,24,.14)); }
  .R-rows { position: relative; z-index: 1; }

  /* ---------- DEALT OUT ---------- */
  .O-card { border-radius: 7px; }
  .O-card .F-tab.inked { background: ${STICKER_INK}; color: ${CREAM}; }
  /* the slot left in the file: the neighbours close up to a narrow slot (tray floor in shadow), not an empty row */
  body.F-files .location-card.F-gap { min-height: 0; height: 22px; padding-top: 0; padding-bottom: 0; background: transparent; box-shadow: inset 0 5px 6px -4px rgba(26,26,24,.30); overflow: hidden; }
  body.F-files .location-card.F-gap > * { visibility: hidden; }

  /* annotation layer for motion frames (not UI) */
  .k-anno { position: absolute; left: 0; right: 0; height: 0; border-top: 1px dashed #C2187A; z-index: 5000; pointer-events: none; }
  .k-anno span { position: absolute; left: 4px; top: -15px; font: 700 10px/13px var(--font-ui); color: #C2187A; background: rgba(255,255,255,.92); padding: 0 4px; white-space: nowrap; }
  .k-tap { position: absolute; z-index: 5001; width: 40px; height: 40px; border: 2px solid #C2187A; border-radius: 50%; background: rgba(194,24,122,.12); pointer-events: none; }
  .k-hit { position: absolute; z-index: 5001; border: 1.5px dashed #C2187A; border-radius: 3px; pointer-events: none; }
  `;

  // ---------------------------------------------------------------- data
  const cleanName = n => String(n).replace(/\s*\(approx\.\)\s*/i, '');
  function place(state) {
    if (state === 'shape') {
      const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district');
      return { ...shapeRowItem(s), shape: s, ink: s.color || categoryInk(s.type), kind: 'diamond', stop: planStopLine('shape', s.id), category: 'district' };
    }
    const l = locations.find(x => x.id === window.__placeId);
    return { ...l, ink: categoryInk(l.category), kind: markerKind(l), stop: planStopLine('loc', l.id) };
  }
  // the tab carries the type only (CD: the stop number was said twice)
  const tabText = P => [P.shape ? 'district' : P.category, /\(approx\.\)/i.test(P.name) ? 'approx. placement' : ''].filter(Boolean).join(' · ');
  // Owner (2026-10-05): store a proper short address, "#1 since there's a directions button": "street number ·
  // neighbourhood", built from stored parts, never cut by length. Hand-derived here per fixture place from its stored
  // OSM string: no place-name repeat, no postcode, municipality or country.
  const SHORT_ADDR = {
    'VEGA Copenhagen': 'Rejsbygade · Humleby',            // the stored OSM string has no house number; same form as Hanging Tag
    'Aurora Reykjavík': 'Fiskislóð 53 · Örfirisey',
    'Swedish Museum of Performing Arts Scenkonstmuseet': 'Sibyllegatan 2 · Östermalm',
  };
  const shortAddr = P => P.address ? (SHORT_ADDR[P.name] || '') : '';
  const dirBtn = () => `<a class="k-btn dir" href="#">${ic('compass')}Directions</a>`;
  const starBtn = P => `<button class="k-btn star">${ic(P.starred ? 'star' : 'star-open')}${P.starred ? 'Starred' : 'Star'}</button>`;
  const visCtl = (P, stampMode) => P.visited ? `<span class="F-stampbtn" ${stampMode || ''}>${rowStamp(P.id)}</span>` : `<button class="k-btn vis"><span class="k-ring"></span>Mark visited</button>`;

  // ---------------------------------------------------------------- list / map helpers
  const mapRect = () => document.getElementById('map').getBoundingClientRect();
  function anchorLatLng(P) { if (P.shape) { const a = shapeAnchor(P.shape) || [P.lat, P.lng]; return L.latLng(a[0], a[1]); } return L.latLng(P.lat, P.lng); }
  function pinScreen(P) { const p = map.latLngToContainerPoint(anchorLatLng(P)); const r = mapRect(); return { x: r.left + p.x, y: r.top + p.y }; }
  function movePinTo(P, x, y) { const s = pinScreen(P); map.panBy([s.x - x, s.y - y], { animate: false }); }
  function select(P) { try { setHighlighted(P.shape ? shapeKey(P.shape.id) : P.id); } catch (e) {} }
  function anno(y, label) { const a = document.createElement('div'); a.className = 'k-anno'; a.style.top = y + 'px'; a.innerHTML = `<span>${label}</span>`; document.body.appendChild(a); }
  function tapAt(x, y) { const t = document.createElement('div'); t.className = 'k-tap'; t.style.left = (x - 20) + 'px'; t.style.top = (y - 20) + 'px'; document.body.appendChild(t); }
  function hitBox(r) { const b = document.createElement('div'); b.className = 'k-hit'; Object.assign(b.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }); document.body.appendChild(b); }
  const rowSel = P => P.shape ? `#locationsList [data-shape-id="${P.shape.id}"]` : `#locationsList .location-card[data-id="${P.id}"]`;
  // The list is never re-scrolled to stage the card (UX: put back must return the list exactly as left). Only if the
  // row is off-screen (opened from its pin) does Dealt Out leave it there: the slot is then simply off-screen.
  const theRow = P => document.querySelector(rowSel(P));
  function leadHtml(row, P) {
    const lead = row && (row.querySelector('.row-lead') || row.querySelector('.row-badge'));
    if (lead) { const c = lead.cloneNode(true); c.querySelectorAll('[role],[tabindex]').forEach(e => { e.removeAttribute('role'); e.removeAttribute('tabindex'); }); return c.outerHTML; }
    return `<div class="row-badge" style="color:${P.ink}">${badgeHtml(P.category, P.kind, 24, { ink: P.ink, fill: '#F2EBDD', mark: P.ink })}</div>`;
  }
  const isPlanRow = row => !!(row && row.querySelector('.row-lead'));
  const leadW = row => isPlanRow(row) ? 'calc(var(--col-glyph) * 2 + var(--gap))' : 'var(--col-glyph)';

  function face(P, row, opts = {}) {
    const a = shortAddr(P);
    return `<div class="F-tab ${opts.tabCls || ''}" style="${opts.tabStyle || 'left:10px'}">${opts.tabCheck ? stampCheckSvg() : ''}${esc(tabText(P))}</div>
      <div class="F-head" style="--F-lead:${leadW(row)}"><div class="F-lead">${leadHtml(row, P)}</div>
        <div style="min-width:0"><div class="F-name">${esc(cleanName(P.name))}</div>${a ? `<div class="F-addr">${esc(a)}</div>` : ''}</div>
        <span class="F-back" aria-label="Put back">${chevDown}</span></div>
      <div class="F-body" style="--F-lead:${leadW(row)}">${P.notes ? `<div class="F-note">${esc(P.notes)}</div>` : ''}
        <div class="F-acts" style="${P.notes ? '' : 'margin-top:var(--s2);'}${isPlanRow(row) ? 'margin-left:calc(-1 * (var(--col-glyph) + var(--gap)))' : ''}">${dirBtn()}${starBtn(P)}${visCtl(P)}</div></div>`;
  }
  function measure(html, cls, w) {
    const d = document.createElement('div'); d.className = 'k F-card ' + cls; d.style.cssText = `position:absolute;left:-2000px;top:0;width:${w}px`; d.innerHTML = html;
    document.body.appendChild(d); const h = d.getBoundingClientRect().height; d.remove(); return Math.ceil(h);
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const SHEET_TOP = 544;
  // the stamp coming down (visited moment, frame 2): the shipped stamp, big and faint, mid-strike
  function stampMid(card, P) { const s = card.querySelector('.F-stampbtn .row-stamp'); if (s) { s.style.transform = `rotate(${stampTilt(String(P.id))}deg) scale(1.7)`; s.style.opacity = '.35'; } }

  /*BASEMAP*/

  const C = {};

  // ======================================================== ROLODEX
  // The list sheet is the drawer: its header stays where it is and stays live. Tapping a card (or its pin) opens the
  // drawer ONCE to a fixed height (the same for every place, so the map edge and the header never move between
  // places) and the card tips forward to face you. Behind it: ONE card edge, the card before it (in Plans its stop
  // number and name), a real 44px target that swaps to that card. In front: the cards after it, as the live rows they
  // are. Visited: the shipped row stamp, in the foot's Visited slot; it comes down with the stamp motion.
  // modes: file | pull1 | pull2 | peek | back1 | closed | vm1 | vm2 | swap
  C.rolo = (P, mode) => {
    document.body.classList.add('F-files');
    const row0 = theRow(P);
    if (mode === 'file' || mode === 'closed') {
      movePinTo(P, 195, 280);
      const r = row0.getBoundingClientRect();
      if (mode === 'file') { tapAt(r.left + r.width * .5, r.top + r.height / 2); anno(SHEET_TOP - 4, 'the list is a card drawer: each row the top of a card in a tray'); }
      if (mode === 'closed') anno(SHEET_TOP - 4, 'put back: the card tips back; the drawer closes; the list exactly as it was left');
      return ['#locations'];
    }
    select(P);
    if (mode === 'vm2') P.visited = true;
    const list = document.getElementById('locationsList');
    const kids = [...list.children];
    const all = kids.filter(e => e.classList.contains('location-card'));
    const i = all.indexOf(row0), prev = all[i - 1];
    const html = face(P, row0, { tabStyle: 'right:10px' });
    const W2 = 390 - 20, H = measure(html, '', W2);
    const t = { pull1: .3, pull2: .75, back1: .4 }[mode] ?? 1;
    const sheet = document.getElementById('locations');
    list.style.display = 'none';
    sheet.style.height = Math.round(lerp(300, DRAWER, t)) + 'px'; sheet.style.boxShadow = '0 -1px 0 var(--hair)';
    document.getElementById('mainContent').style.height = (844 - Math.round(lerp(300, DRAWER, t))) + 'px'; map.invalidateSize({ pan: false });
    const body = document.createElement('div'); body.className = 'k R-body';
    let edgeHtml = '<div class="R-blank"></div>';
    if (prev) {
      const n = prev.querySelector('.row-n');
      edgeHtml = `<div class="R-edge ${prev.classList.contains('is-visited') ? 'filed' : ''}">${n ? `<span class="n">${esc(n.textContent)}</span>` : ''}<span class="nm">${esc(prev.querySelector('h3').textContent)}</span></div>`;
    }
    // the cards in front: the real rows after this one, cloned as they are (live)
    const after = kids.slice(kids.indexOf(row0) + 1).map(e => e.outerHTML).join('');
    body.innerHTML = `${edgeHtml}<div class="R-card"><div class="k F-card ${P.visited && mode !== 'vm2' ? 'filed' : ''}">${html}</div></div><div class="R-rows" id="R-rows">${after}</div>`;
    sheet.appendChild(body);
    body.querySelectorAll('.R-rows .location-card').forEach(e => e.classList.remove('highlighted'));
    const card = body.querySelector('.F-card');
    if (t < 1) { card.style.transformOrigin = '50% 100%'; card.style.transform = `perspective(700px) rotateX(${(1 - t) * 40}deg)`; }
    const mapH = 844 - Math.round(lerp(300, DRAWER, t));
    movePinTo(P, 195, Math.round(lerp(280, Math.min(250, mapH / 2 + 20), t)));
    const top = sheet.getBoundingClientRect().top;
    if (mode === 'pull1') anno(top - 4, 'the drawer opens (once, to one fixed height); the card tips forward');
    if (mode === 'pull2') anno(top - 4, 'one card stands behind it; the cards after it stay in front, live');
    if (mode === 'back1') anno(top - 4, 'put back (⌄ or tap the map): it tips back into its place');
    if (mode === 'peek' && window.__frameName === 'hits') {
      const e = body.querySelector('.R-edge'); if (e) { const r = e.getBoundingClientRect(); hitBox({ left: r.left, top: r.top - 10, width: r.width, height: 44 }); }
      anno(top - 4, 'dashed: the edge behind is a 44px target (opens that card)');
    }
    if (mode === 'swap') {
      const nx = body.querySelector('.R-rows .location-card'); const r = nx.getBoundingClientRect(); tapAt(r.left + r.width * .5, r.top + r.height / 2);
      anno(top - 4, 'one tap on a live row (or its pin) swaps: this card goes back, that one tips up');
    }
    if (mode === 'vm1') { const b = card.querySelector('.k-btn.vis').getBoundingClientRect(); tapAt(b.left + 40, b.top + b.height / 2); }
    if (mode === 'vm2') { stampMid(card, P); anno(top - 4, 'Mark visited: the row’s stamp comes down in its slot; the paper is filed'); }
    return ['#locations'];
  };

  // ======================================================== DEALT OUT
  // Tapping pulls the card out of the file and lays it on the map under its pin. Its index tab (its type) points up
  // at the pin; for a district, at the district's label point (shapeAnchor), the point its diamond marker uses.
  // The file closes up around a narrow slot where the card goes back; the list is not scrolled and stays live.
  // Visited: the card keeps its paper (filed, like the row); the TAB is inked in the visited pin sticker's colours
  // (dark ink, cream check) — the small part of the card that meets the pin — and the foot carries the row stamp.
  // modes: file | pull1 | pull2 | peek | back1 | closed | vm1 | vm2 | swap
  C.out = (P, mode) => {
    document.body.classList.add('F-files');
    const row = theRow(P);
    const r0 = row.getBoundingClientRect();
    if (mode === 'file' || mode === 'closed') {
      movePinTo(P, 195, 280);
      if (mode === 'file') { tapAt(r0.left + r0.width * .5, r0.top + r0.height / 2); anno(SHEET_TOP - 4, 'the list is a card file: each row the top of a card in a tray'); }
      if (mode === 'closed') anno(SHEET_TOP - 4, 'put back (⌄, the slot or the map): it slides into its slot; the list as left');
      return ['#locations'];
    }
    select(P);
    if (mode !== 'pull1') { row.classList.add('F-gap', 'F-slot'); }
    row.classList.remove('highlighted');
    const W2 = 358;
    if (mode === 'vm2') P.visited = true;
    const inked = P.visited;
    const html = face(P, row, { tabStyle: 'left:10px', tabCls: inked ? 'inked' : '', tabCheck: inked });
    const H = measure(html, 'O-card', W2);
    const t = { pull1: .3, pull2: .78, back1: .4 }[mode] ?? 1;
    // the pin may never go under the top controls: past that, the card would scroll inside (not reached by any real row)
    const cardTop = SHEET_TOP - 14 - H, pinY = Math.max(110, cardTop - 22 - 18);
    movePinTo(P, 120, pinY);
    const s = pinScreen(P);
    const fx = 16, fy = pinY + 22 + 18;
    const x = Math.round(lerp(r0.left, fx, t)), y = Math.round(lerp(r0.top, fy, t));
    const wrap = document.createElement('div'); wrap.className = 'F-wrap';
    wrap.style.cssText = `left:${x}px;top:${y}px;width:${W2}px;transform:rotate(${lerp(-3, -0.6, t)}deg);transform-origin:30% 0`;
    wrap.innerHTML = `<div class="k F-card O-card ${P.visited && mode !== 'vm2' ? 'filed' : ''}" style="height:${H}px">${html}</div>`;
    document.body.appendChild(wrap);
    const card = wrap.querySelector('.F-card');
    const tab = card.querySelector('.F-tab'); const tw = tab.getBoundingClientRect().width;
    tab.style.left = Math.max(10, Math.min(W2 - tw - 10, s.x - fx - tw / 2)) + 'px';
    if (mode === 'pull1') anno(y - 30, 'pulled out of the file');
    if (mode === 'pull2') anno(y - 30, 'laid under its pin, the tab pointing at it; the file closes to a slot');
    if (mode === 'back1') anno(y - 30, 'put back: it slides back into its slot');
    if (mode === 'swap') {
      const nx = row.nextElementSibling && row.nextElementSibling.classList.contains('location-card') ? row.nextElementSibling : document.querySelectorAll('#locationsList .location-card:not(.F-gap)')[0];
      const r = nx.getBoundingClientRect(); tapAt(r.left + r.width * .5, r.top + r.height / 2);
      anno(SHEET_TOP + 1, 'one tap on a live row (or a pin) swaps: this card slides home, that one deals out');
    }
    if (mode === 'vm1') { const b = card.querySelector('.k-btn.vis').getBoundingClientRect(); tapAt(b.left + 40, b.top + b.height / 2); }
    if (mode === 'vm2') { stampMid(card, P); anno(y - 30, 'Mark visited: the stamp comes down; the tab inks like the pin’s sticker'); }
    return ['body'];
  };

  window.K = {
    css() { if (!document.getElementById('k-css')) { const s = document.createElement('style'); s.id = 'k-css'; s.textContent = CSS; document.head.appendChild(s); } },
    show(concept, state, mode) { this.css(); basemap(); if (mode === 'signedout') { document.body.classList.add('k-so'); mode = 'peek'; } if (mode === 'hits') { window.__frameName = 'hits'; mode = 'peek'; } const P = place(state); return C[concept](P, mode || 'peek'); },
  };
})();
