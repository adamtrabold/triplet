// Page-side code for the Round 4 Card File variants. Injected into the REAL app (index.html, unmodified, in the
// gesture harness) by render.js after a place is set up. Reuses the app's tokens, glyph sprite, seal badge, row lead,
// row stamp and check path. render.js splices round 1's stand-in basemap in at BASEMAP.
// One family, the app's own (Archivo). No typewriter face (owner, 2026-10-05: "the typewriter font is unnecessary.").
//
// Variants:  up   = Stand-Up   (the row is the top of a tall card; pulling it up shows the face; the file stays live below)
//            rolo = Rolodex    (the card tips forward and fills the drawer; the cards before/after stay as edges)
//            out  = Dealt Out  (the card leaves the file and is laid on the map at its pin; the file keeps its gap)
(() => {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ic = (id, cls = '') => `<svg class="k-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#g-${id}"/></svg>`;
  const rowStamp = (id, tilt) => `<span class="row-stamp" style="--stamp-tilt:${tilt == null ? stampTilt(String(id)) : tilt}deg" aria-hidden="true"><span class="row-stamp-ring">${stampCheckSvg()}<span class="row-stamp-word">Visited</span></span></span>`;
  const STICKER_INK = '#3A4C5B', CREAM = '#F2EBDD';   // the shipped visited pin sticker (STICKER.INK / STICKER.FACE)
  const chevDown = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const CSS = `
  .leaflet-tile-pane { visibility: hidden; }
  .k-base { position: absolute; inset: 0; z-index: 0; pointer-events: none; filter: sepia(0.3) saturate(0.75) contrast(0.96) hue-rotate(-6deg); }
  .k-base svg { width: 100%; height: 100%; display: block; }
  .k { font-family: var(--font-ui); color: var(--ink); -webkit-font-smoothing: antialiased; text-align: left; }
  .k-ic { width: 16px; height: 16px; display: block; flex: none; }

  /* ---------- THE FILE: the list, before any tap. Each row is the visible top of an index card standing in a tray.
     No rules: a card's edge is the soft shadow it casts on the card behind it (owner: "edges are shadows, not hard
     lines"); the tray (--paper) shows 6px either side. Visited cards keep the shipped filed paper (--paper-filed). */
  body.F-files #locationsList { padding-bottom: 8px; }
  body.F-files .location-card { margin: 0 6px; padding-left: 10px; padding-right: 10px; border-bottom: 0; border-radius: 5px 5px 0 0;
    background: var(--paper-raised); position: relative;
    box-shadow: 0 -1px 0 rgba(90,86,76,.10), 0 -5px 7px -4px rgba(26,26,24,.16); }
  body.F-files .location-card.is-visited { background: var(--paper-filed); }
  body.F-files .location-card.group-end { border-bottom: 0; }
  body.F-files .plan-rule { margin-top: 6px; }
  body.F-files .location-card.highlighted:not(.F-slot) { background: var(--paper-raised); }
  body.F-files .location-card.highlighted:not(.F-slot) h3 { color: var(--ink); }
  body.F-files .location-card.highlighted:not(.F-slot) .row-meta { color: var(--ink-2); }

  /* ---------- the card face (shared by all three) ---------- */
  .F-wrap { position: absolute; z-index: 1003; filter: drop-shadow(0 -1px 0 rgba(90,86,76,.10)) drop-shadow(0 -2px 10px rgba(26,26,24,.10)); }
  .F-clip { position: absolute; left: 0; right: 0; overflow: hidden; z-index: 1003; }
  .F-card { position: relative; background: var(--paper-raised); border-radius: 5px 5px 0 0; }
  .F-card.filed { background: var(--paper-filed); }
  .F-head { display: grid; grid-template-columns: var(--F-lead, 28px) 1fr 44px; column-gap: var(--gap); padding: 14px 0 0 10px; align-items: start; }
  .F-lead { padding-top: 0; height: 24px; display: flex; align-items: center; }
  .F-lead .row-lead { display: flex; align-items: center; gap: var(--gap); }
  .F-name { font-size: 18px; line-height: 24px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink); }
  .F-addr { margin-top: 2px; display: flex; align-items: center; gap: 4px; min-width: 0; }
  .F-addr .t { min-width: 0; font-size: 12px; line-height: 16px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .F-addr .chev { font: 400 14px/16px var(--font-ui); color: var(--ink-2); }
  .F-addr.open .t { white-space: normal; }
  .F-back { width: 44px; height: 44px; margin-top: -10px; display: flex; align-items: center; justify-content: center; color: var(--ink-2); }
  .F-body { padding: 0 var(--s4) 0 calc(10px + var(--F-lead, 28px) + var(--gap)); }
  .F-note { margin-top: var(--s3); font-size: 14px; line-height: 20px; color: var(--ink); white-space: pre-line; }
  .F-acts { display: flex; align-items: center; gap: var(--s4); margin-top: var(--s1); min-height: 44px; padding-bottom: 2px; }
  .k-btn { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0; border: 0; background: none; font-family: var(--font-ui);
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 11px; line-height: 12px; letter-spacing: .1em; color: var(--ink);
           text-decoration: none; white-space: nowrap; cursor: pointer; }
  .k-btn.dir { color: var(--figure-deep); }
  .k-btn.vis.on { color: color-mix(in srgb, var(--navy) 82%, transparent); }
  .k-btn .row-stamp-check { width: 16px; height: 16px; display: block; }
  .k-ring { width: 14px; height: 14px; margin: 1px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px currentColor; flex: none; }
  .k-so .k-btn.star, .k-so .k-btn.vis, .k-so .F-stampbtn { opacity: var(--state-off-alpha); }
  /* the index tab: the card's sorting key = its type (and its stop) */
  .F-tab { position: absolute; top: -22px; height: 23px; padding: 0 14px; background: inherit; display: flex; align-items: center; gap: 6px;
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .12em; color: var(--ink-2); white-space: nowrap;
           clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 100%, 0 100%); border-radius: 4px 4px 0 0; }
  .F-card.filed .F-tab { background: var(--paper-filed); }

  /* ---------- 1 STAND-UP: visited = the row's own stamp, struck in the foot as the Visited control ---------- */
  .U-stampbtn { position: relative; width: 84px; height: 44px; display: flex; align-items: center; justify-content: center; }
  .U-stampbtn .row-stamp { margin: 0; }

  /* ---------- 2 ROLODEX ---------- */
  .R-sheet { position: absolute; left: 0; right: 0; bottom: 0; background: var(--paper); z-index: 1002; box-shadow: 0 -1px 0 var(--hair); }
  .R-head { height: 56px; }
  .R-edge { position: relative; height: 18px; margin: 0 6px; padding: 0 10px; background: var(--paper-raised); border-radius: 5px 5px 0 0;
            box-shadow: 0 -1px 0 rgba(90,86,76,.10), 0 -5px 7px -4px rgba(26,26,24,.16); display: flex; align-items: center; gap: 8px; overflow: hidden; }
  .R-edge.filed { background: var(--paper-filed); }
  .R-edge .n { width: 28px; text-align: center; flex: none; font: 700 10px/12px var(--font-ui); color: var(--ink-2); }
  .R-edge .nm { max-width: calc(100% - 190px); font-size: 11px; line-height: 14px; font-weight: 600; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .R-edge .notch { position: absolute; top: -1px; width: 34px; height: 11px; border-radius: 0 0 17px 17px; background: var(--paper); box-shadow: inset 0 2px 3px rgba(26,26,24,.22); }
  .R-card { margin: 0 6px; }
  .R-notch { position: absolute; top: -1px; width: 34px; height: 18px; border-radius: 0 0 17px 17px; background: var(--paper); box-shadow: inset 0 3px 4px rgba(26,26,24,.26); z-index: 2; }
  .R-notch.on-map { background: transparent; }
  .R-chad { position: absolute; width: 34px; height: 17px; border-radius: 0 0 17px 17px; background: var(--paper-raised); box-shadow: 0 1px 2px rgba(26,26,24,.25); z-index: 1100; }

  /* ---------- 3 DEALT OUT ---------- */
  .O-card { border-radius: 5px; }
  .O-card.inked { background: ${STICKER_INK}; color: ${CREAM}; }
  .O-card.inked .F-name, .O-card.inked .F-note { color: ${CREAM}; }
  .O-card.inked .F-addr .t, .O-card.inked .F-addr .chev, .O-card.inked .F-back { color: color-mix(in srgb, ${CREAM} 72%, transparent); }
  .O-card.inked .F-tab { background: ${STICKER_INK}; color: color-mix(in srgb, ${CREAM} 80%, transparent); }
  .O-card.inked .k-btn { color: ${CREAM}; }
  .O-card.inked .k-btn.dir { color: #F4A274; }
  .O-card.inked .row-badge { color: ${CREAM} !important; --badge-field: transparent; }
  .O-card.inked .row-n { color: color-mix(in srgb, ${CREAM} 72%, transparent); }
  body.F-files .location-card.F-gap { background: transparent; box-shadow: inset 0 3px 6px -2px rgba(26,26,24,.20); }
  body.F-files .location-card.F-gap > * { visibility: hidden; }
  body.F-files .location-card.F-gap .row-lead { visibility: visible; opacity: .45; }
  body.F-files .location-card.F-gap .row-lead .row-badge { visibility: hidden; }
  .O-ink { position: absolute; inset: 0; border-radius: 5px; background: ${STICKER_INK}; z-index: 0; pointer-events: none; }

  /* annotation layer for motion frames (not UI) */
  .k-anno { position: absolute; left: 0; right: 0; height: 0; border-top: 1px dashed #C2187A; z-index: 5000; pointer-events: none; }
  .k-anno span { position: absolute; left: 4px; top: -15px; font: 700 10px/13px var(--font-ui); color: #C2187A; background: rgba(255,255,255,.92); padding: 0 4px; white-space: nowrap; }
  .k-tap { position: absolute; z-index: 5001; width: 40px; height: 40px; border: 2px solid #C2187A; border-radius: 50%; background: rgba(194,24,122,.12); pointer-events: none; }
  .k-arrow { position: absolute; z-index: 5001; width: 0; border-left: 2px dashed #C2187A; pointer-events: none; }
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
  const tabText = P => [P.shape ? 'district' : P.category, /\(approx\.\)/i.test(P.name) ? 'approx. placement' : '', P.stop].filter(Boolean).join(' · ');
  // The address at a glance: street + number and the neighbourhood, from the OSM string (full string one tap away).
  function shortAddr(P) {
    if (!P.address) return '';
    let parts = P.address.split(',').map(s => s.trim()).filter(Boolean);
    const nm = cleanName(P.name).toLowerCase();
    if (parts.length > 2 && (nm.includes(parts[0].toLowerCase()) || parts[0].toLowerCase().includes(nm.split(' ')[0]))) parts.shift();
    if (/^\d+[a-z]?$/i.test(parts[0]) && parts[1]) parts = [parts[1] + ' ' + parts[0], ...parts.slice(2)];
    return parts.slice(0, 2).join(', ');
  }
  const dirBtn = () => `<a class="k-btn dir" href="#">${ic('compass')}Directions</a>`;
  const starBtn = P => `<button class="k-btn star">${ic(P.starred ? 'star' : 'star-open')}${P.starred ? 'Starred' : 'Star'}</button>`;
  const visBtn = P => P.visited ? `<button class="k-btn vis on">${stampCheckSvg()}Visited</button>` : `<button class="k-btn vis"><span class="k-ring"></span>Mark visited</button>`;

  // ---------------------------------------------------------------- list / map helpers
  const mapRect = () => document.getElementById('map').getBoundingClientRect();
  function anchorLatLng(P) { if (P.shape) { const a = shapeAnchor(P.shape) || [P.lat, P.lng]; return L.latLng(a[0], a[1]); } return L.latLng(P.lat, P.lng); }
  function pinScreen(P) { const p = map.latLngToContainerPoint(anchorLatLng(P)); const r = mapRect(); return { x: r.left + p.x, y: r.top + p.y }; }
  function movePinTo(P, x, y) { const s = pinScreen(P); map.panBy([s.x - x, s.y - y], { animate: false }); }
  function select(P) { try { setHighlighted(P.shape ? shapeKey(P.shape.id) : P.id); } catch (e) {} }
  function anno(y, label) { const a = document.createElement('div'); a.className = 'k-anno'; a.style.top = y + 'px'; a.innerHTML = `<span>${label}</span>`; document.body.appendChild(a); }
  function tapAt(x, y) { const t = document.createElement('div'); t.className = 'k-tap'; t.style.left = (x - 20) + 'px'; t.style.top = (y - 20) + 'px'; document.body.appendChild(t); }
  const rowSel = P => P.shape ? `#locationsList [data-shape-id="${P.shape.id}"]` : `#locationsList .location-card[data-id="${P.id}"]`;
  // The list scrolls so the row's slot is the first one under the header (the slots above scroll away; order kept).
  function slotRow(P, scroll = true) {
    const list = document.getElementById('locationsList');
    let row = document.querySelector(rowSel(P));
    if (scroll && row) { const dy = row.getBoundingClientRect().top - list.getBoundingClientRect().top; list.scrollTop += dy - 0; }
    return document.querySelector(rowSel(P));
  }
  function leadHtml(row, P) {
    const lead = row && (row.querySelector('.row-lead') || row.querySelector('.row-badge'));
    if (lead) { const c = lead.cloneNode(true); c.querySelectorAll('[role],[tabindex]').forEach(e => { e.removeAttribute('role'); e.removeAttribute('tabindex'); }); return c.outerHTML; }
    return `<div class="row-badge" style="color:${P.ink}">${badgeHtml(P.category, P.kind, 24, { ink: P.ink, fill: '#F2EBDD', mark: P.ink })}</div>`;
  }
  const leadW = row => row && row.querySelector('.row-lead') ? 'calc(var(--col-glyph) * 2 + var(--gap))' : 'var(--col-glyph)';

  // The face. opts.vis: 'btn' (a Visited button) | 'stamp' (the row stamp as the Visited control) ; opts.addrOpen
  function face(P, row, opts = {}) {
    const a = shortAddr(P);
    const addr = P.address ? `<div class="F-addr ${opts.addrOpen ? 'open' : ''}"><span class="t">${esc(opts.addrOpen ? P.address : a)}</span>${opts.addrOpen ? '' : '<span class="chev">›</span>'}</div>` : '';
    const visCtl = opts.vis === 'stamp'
      ? (P.visited ? `<span class="U-stampbtn F-stampbtn">${rowStamp(P.id)}</span>` : visBtn(P))
      : visBtn(P);
    return `<div class="F-tab" style="left:${opts.tabX == null ? 10 : opts.tabX}px">${esc(tabText(P))}</div>
      <div class="F-head" style="--F-lead:${leadW(row)}"><div class="F-lead">${leadHtml(row, P)}</div>
        <div style="min-width:0"><div class="F-name">${esc(cleanName(P.name))}</div>${addr}</div>
        <span class="F-back" aria-label="Put back">${chevDown}</span></div>
      <div class="F-body" style="--F-lead:${leadW(row)}">${P.notes ? `<div class="F-note">${esc(P.notes)}</div>` : ''}
        <div class="F-acts" style="${P.notes ? '' : 'margin-top:var(--s2);'}${row && row.querySelector('.row-lead') ? 'margin-left:calc(-1 * (var(--col-glyph) + var(--gap)))' : ''}">${dirBtn()}${starBtn(P)}${visCtl}</div></div>`;
  }
  // Measure a face at full width without placing it.
  function measure(html, cls, w) {
    const d = document.createElement('div'); d.className = 'k F-card ' + cls; d.style.cssText = `position:absolute;left:-2000px;top:0;width:${w}px`; d.innerHTML = html;
    document.body.appendChild(d); const h = d.getBoundingClientRect().height; d.remove(); return Math.ceil(h);
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const SHEET_TOP = 544;

  /*BASEMAP*/

  const C = {};

  // ======================================================== 1 STAND-UP
  // A row IS the top of a tall index card; the rest of the card stands hidden behind the cards in front of it.
  // Tapping pulls the card straight up out of its slot: the face appears from behind the next card. The card's foot
  // never leaves its slot (it ends where the next card starts), so the cards in front, and the rest of the list, stay
  // put and live. The card covers the header and the cards behind it, and the map above.
  // Visited: the row's own stamp, struck in the card's foot as the Visited control; the paper steps to the row's filed tone.
  // modes: file (tap) | pull1 | pull2 | peek | addr | back1 | closed | vm1 (tap Mark visited) | vm2 (stamp coming down)
  C.up = (P, mode) => {
    document.body.classList.add('F-files');
    const row = slotRow(P);
    const r = row.getBoundingClientRect();
    if (mode === 'file' || mode === 'closed') {
      movePinTo(P, 195, 280);
      if (mode === 'file') { tapAt(r.left + r.width * .5, r.top + r.height / 2); anno(r.top - 2, 'each row is the top of an index card standing in the file'); }
      if (mode === 'closed') anno(r.top - 2, 'put back: the card drops into its slot; the list as left');
      return ['#locations'];
    }
    select(P);
    const vm = mode === 'vm1' || mode === 'vm2';
    if (mode === 'vm2') P.visited = true;
    const html = face(P, row, { vis: 'stamp', addrOpen: mode === 'addr' });
    const W2 = r.width, H = measure(html, '', W2);
    const slotBottom = r.bottom;
    const t = { pull1: .35, pull2: .8, back1: .45 }[mode] ?? 1;
    const lift = (H - r.height) * t;
    const top = Math.round(r.top - lift);
    const clip = document.createElement('div'); clip.className = 'F-wrap';
    clip.style.cssText = `left:${r.left}px;width:${W2}px;top:${top - 30}px;height:${slotBottom - top + 30}px;overflow:hidden;`;
    clip.innerHTML = `<div class="k F-card ${P.visited && mode !== 'vm2' ? 'filed' : ''}" style="position:absolute;left:0;right:0;top:30px;height:${H}px">${html}</div>`;
    document.body.appendChild(clip);
    const card = clip.querySelector('.F-card');
    // the pin sits clear above the card
    const finalTop = r.top - (H - r.height);
    movePinTo(P, 195, Math.round(lerp(280, Math.max(110, Math.min(240, (finalTop - 24) / 2 + 40)), Math.min(1, t))));
    if (mode === 'pull1') anno(top - 30, 'pulled up: the face slides out from behind the card in front');
    if (mode === 'pull2') anno(slotBottom + 1, 'its foot stays in its slot; the cards in front, and the list, stay live');
    if (mode === 'back1') anno(top - 30, 'put back (⌄ or tap the map): it slides back down behind the card in front');
    if (mode === 'addr') anno(top - 30, 'tap the address: the full address, in place (the card grows up; buttons stay)');
    if (mode === 'vm1') { const b = card.querySelector('.k-btn.vis').getBoundingClientRect(); tapAt(b.left + 40, b.top + b.height / 2); }
    if (mode === 'vm2') {
      const s = card.querySelector('.U-stampbtn .row-stamp');
      s.style.transform = `rotate(${stampTilt(String(P.id))}deg) scale(1.7)`; s.style.opacity = '.35';
      anno(top - 30, 'the row’s stamp comes down in its place; the paper is filed');
    }
    return ['#locations', '.F-wrap'];
  };

  // ======================================================== 2 ROLODEX
  // The drawer (the list sheet) keeps its header. Tapping a card tips it forward to face you and it fills the drawer;
  // the cards before it stand behind as edges above it, the cards after it as edges below, in list order (Plans:
  // numbered). The drawer grows to fit the card; the map gives way. Visited: an edge notch punched in the card's top
  // edge, the edge-notched (McBee) card-file mark; every visited card in the file shows its notch in the same place.
  // modes: file | pull1 | pull2 | peek | back1 | closed | vm1 | vm2
  C.rolo = (P, mode) => {
    document.body.classList.add('F-files');
    const row0 = slotRow(P, false);
    const all = [...document.querySelectorAll('#locationsList .location-card')];
    const i = all.indexOf(row0);
    if (mode === 'file' || mode === 'closed') {
      slotRow(P, mode !== 'closed' ? true : true);
      const r = row0.getBoundingClientRect();
      movePinTo(P, 195, 280);
      if (mode === 'file') { tapAt(r.left + r.width * .5, r.top + r.height / 2); anno(r.top - 2, 'the list is the drawer of a card file; each row a card'); }
      if (mode === 'closed') anno(r.top - 2, 'put back: the card tips back into its place; the list as left');
      return ['#locations'];
    }
    select(P);
    if (mode === 'vm2') P.visited = true;
    const html = face(P, row0, { vis: 'btn' });
    const W2 = 390 - 12, H = measure(html, '', W2);
    const before = all.slice(Math.max(0, i - 2), i), after = all.slice(i + 1, i + 3);
    const edge = (rw) => {
      const n = rw.querySelector('.row-n'); const nm = rw.querySelector('h3').textContent; const vis = rw.classList.contains('is-visited');
      return `<div class="R-edge ${vis ? 'filed' : ''}">${n ? `<span class="n">${esc(n.textContent)}</span>` : '<span class="n"></span>'}<span class="nm">${esc(nm)}</span>${vis ? '<span class="notch" style="right:NOTCHR"></span>' : ''}</div>`;
    };
    const t = { pull1: .3, pull2: .75, back1: .4 }[mode] ?? 1;
    // the drawer is the real list sheet (its header stays, live); the rows fold away into the card and its edges
    const sheet = document.getElementById('locations');
    document.getElementById('locationsList').style.display = 'none';
    const bodyH = 18 * before.length + H + 18 * after.length + 10;
    const inner = document.createElement('div'); inner.className = 'k R-body';
    inner.innerHTML = `${before.map(edge).join('')}<div class="R-card"><div class="k F-card ${P.visited && mode !== 'vm2' ? 'filed' : ''}" style="height:${H}px">${html}</div></div>${after.map(edge).join('')}`;
    sheet.appendChild(inner);
    const card = sheet.querySelector('.F-card');
    // the tab sits on the card edge; in Rolodex the edges above carry the tab space: draw the tab inside the card's top edge row
    card.querySelector('.F-tab').style.cssText += ';top:-18px;height:19px;left:auto;right:12px';
    // notch position: above the Visited button's x (the punch is the visit)
    const vb = card.querySelector('.k-btn.vis'); const notchX = W2 - 150;   // one notch column for the whole file, above the put-back chevron
    sheet.querySelectorAll('.R-edge .notch').forEach(nn => { nn.style.right = ''; nn.style.left = notchX + 'px'; });
    if (P.visited && mode !== 'vm1') card.insertAdjacentHTML('afterbegin', `<span class="R-notch" style="left:${notchX}px"></span>`);
    // sizing: the drawer is its content (header + edges + card), the map meets its top
    const full = 56 + bodyH;
    const rowH = 300;
    const h = Math.round(lerp(rowH, full, t));
    sheet.style.height = h + 'px'; sheet.style.overflow = 'hidden'; sheet.style.boxShadow = '0 -1px 0 var(--hair)';
    document.getElementById('mainContent').style.height = (844 - h) + 'px'; map.invalidateSize({ pan: false });
    if (t < 1) {
      // mid-motion: the card tips (rotateX about its foot) and the rest of the list folds into edges
      card.style.transformOrigin = '50% 100%'; card.style.transform = `perspective(700px) rotateX(${(1 - t) * 38}deg)`;
    }
    const pinY = Math.max(100, Math.min(280, (844 - full) / 2 + 10));
    movePinTo(P, 195, Math.round(lerp(280, pinY, t)));
    const ct = card.getBoundingClientRect();
    if (mode === 'pull1') anno(844 - h - 4, 'the card tips forward; the drawer opens to fit it');
    if (mode === 'pull2') anno(844 - h - 4, 'the cards before it stand behind as edges, the cards after it in front');
    if (mode === 'back1') anno(844 - h - 4, 'put back (⌄ or tap the map): it tips back; the edges open into rows');
    if (mode === 'vm1') { const b = vb.getBoundingClientRect(); tapAt(b.left + 40, b.top + b.height / 2); }
    if (mode === 'vm2') {
      const chad = document.createElement('div'); chad.className = 'R-chad'; chad.style.left = (ct.left + notchX + 30) + 'px'; chad.style.top = (ct.top + 20) + 'px'; chad.style.transform = 'rotate(32deg)';
      document.body.appendChild(chad); anno(844 - h - 4, 'Mark visited punches the notch (the chad drops); the paper is filed');
    }
    return ['#locations'];
  };

  // ======================================================== 3 DEALT OUT
  // Tapping pulls the card all the way out of the file and lays it on the map under its pin. The card's index tab
  // (its type) points at the pin. The file keeps the card's gap, numbered in Plans: the gap is where it goes back,
  // and the whole list stays visible and live. Visited: the card is inked in the visited pin sticker's colours
  // (dark ink, cream type, cream check), so the open card and its pin say "visited" the same way.
  // modes: file | pull1 | pull2 | peek | back1 | closed | vm1 | vm2
  C.out = (P, mode) => {
    document.body.classList.add('F-files');
    const row = slotRow(P);
    const r = row.getBoundingClientRect();
    if (mode === 'file' || mode === 'closed') {
      movePinTo(P, 195, 280);
      if (mode === 'file') { tapAt(r.left + r.width * .5, r.top + r.height / 2); anno(r.top - 2, 'the list is a card file; tap a card (or its pin)'); }
      if (mode === 'closed') anno(r.top - 2, 'put back (⌄, tap the gap, or tap the map): the card slides back into its gap');
      return ['#locations'];
    }
    select(P);
    row.classList.add('F-gap', 'F-slot'); row.classList.remove('highlighted');
    const W2 = 358;
    if (mode === 'vm2') P.visited = true;
    const html = face(P, row, { vis: 'btn', tabX: 0 });
    const H = measure(html, 'O-card', W2);
    const t = { pull1: .3, pull2: .78, back1: .4 }[mode] ?? 1;
    // final: pin above the card, tab touching it; card bottom 12px above the file
    const cardTop = SHEET_TOP - 14 - H;
    const pinY = cardTop - 22 - 18;
    movePinTo(P, 120, Math.max(96, pinY));
    const s = pinScreen(P);
    const fx = 16, fy = Math.max(96, pinY) + 22 + 18;
    const x = Math.round(lerp(r.left, fx, t)), y = Math.round(lerp(r.top, fy, t));
    const wrap = document.createElement('div'); wrap.className = 'F-wrap';
    const inked = P.visited && mode !== 'vm2';
    wrap.style.cssText = `left:${x}px;top:${y}px;width:${W2}px;transform:rotate(${lerp(-3, -0.6, t)}deg);transform-origin:30% 0`;
    wrap.innerHTML = `<div class="k F-card O-card ${inked ? 'inked' : ''}" style="height:${H}px">${html}</div>`;
    document.body.appendChild(wrap);
    const card = wrap.querySelector('.F-card');
    // the tab points at the pin
    const tab = card.querySelector('.F-tab'); const tw = tab.getBoundingClientRect().width;
    tab.style.left = Math.max(10, Math.min(W2 - tw - 10, s.x - fx - tw / 2)) + 'px';
    if (mode === 'pull1') anno(y - 30, 'pulled out of the file; its gap stays (Plans: numbered)');
    if (mode === 'pull2') anno(y - 30, 'laid on the map under its pin; the tab points at the pin');
    if (mode === 'back1') anno(y - 30, 'put back: it slides back into its gap');
    if (mode === 'vm1') { const b = card.querySelector('.k-btn.vis').getBoundingClientRect(); tapAt(b.left + 40, b.top + b.height / 2); }
    if (mode === 'vm2') {
      const b = card.querySelector('.k-btn.vis'), bx = b.offsetLeft + 8, by = b.offsetTop + 22 + card.querySelector('.F-body').offsetTop;
      const copy = card.cloneNode(true); copy.classList.add('inked'); copy.style.cssText += `;position:absolute;left:0;top:0;width:100%;clip-path:circle(190px at ${bx}px ${by}px)`;
      copy.querySelector('.k-btn.vis').outerHTML = `<button class="k-btn vis on">${stampCheckSvg()}Visited</button>`;
      wrap.appendChild(copy);
      anno(SHEET_TOP + 1, 'Mark visited: the sticker ink floods out from the button; the card is inked like its pin');
    }
    return ['body'];
  };

  window.K = {
    css() { if (!document.getElementById('k-css')) { const s = document.createElement('style'); s.id = 'k-css'; s.textContent = CSS; document.head.appendChild(s); } },
    show(concept, state, mode) { this.css(); basemap(); if (mode === 'signedout') { document.body.classList.add('k-so'); mode = 'peek'; } const P = place(state); return C[concept](P, mode || 'peek'); },
  };
})();
