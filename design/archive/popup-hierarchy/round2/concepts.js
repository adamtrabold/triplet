// Page-side code for the Round 2 popup concepts. Injected into the REAL app
// (index.html, unmodified, in the gesture harness) by render.js after a
// place is set up. Reuses the app's tokens, glyph sprite, row badge (copied
// from the list row's DOM), row stamp and check path. render.js splices the
// stand-in basemap (round1, unchanged) in at the BASEMAP marker.
(() => {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ic = (id, cls = '') => `<svg class="k-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#g-${id}"/></svg>`;
  const stamp = id => `<span class="row-stamp" style="--stamp-tilt:${stampTilt(String(id))}deg" aria-hidden="true"><span class="row-stamp-ring">${stampCheckSvg()}<span class="row-stamp-word">Visited</span></span></span>`;

  const CSS = `
  .leaflet-tile-pane { visibility: hidden; }
  .k-base { position: absolute; inset: 0; z-index: 0; pointer-events: none; filter: sepia(0.3) saturate(0.75) contrast(0.96) hue-rotate(-6deg); }
  .k-base svg { width: 100%; height: 100%; display: block; }

  .k { font-family: var(--font-ui); color: var(--ink); -webkit-font-smoothing: antialiased; text-align: left; }
  .k .row-badge { flex: none; }
  .k-eye { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .k-name { font-size: 18px; line-height: 24px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink); }
  .k-notes { font-size: 14px; line-height: 20px; color: var(--ink); white-space: pre-line; }
  .k-addr { font-size: 12px; line-height: 16px; color: var(--ink-2); }
  .k-ic { width: 16px; height: 16px; display: block; flex: none; }
  .k-more { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; letter-spacing: .1em; color: var(--ink-2); white-space: nowrap; }
  .k-peek { display: block; }
  .k-addr1 { display: flex; align-items: center; gap: var(--s1); min-height: 24px; margin-top: var(--s1); }
  .k-addr1 .t { flex: 1; min-width: 0; font-size: 12px; line-height: 16px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .k-addr1 .chev { font: 400 16px/16px var(--font-ui); color: var(--ink-2); }
  .k-maplabel { position: absolute; z-index: 700; pointer-events: none; font: 600 13px/20px var(--font-ui); color: var(--ink); white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis;
                text-shadow: 0 0 2px var(--paper), 0 0 2px var(--paper), 0 0 3px var(--paper), 0 0 4px var(--paper), 0 0 6px var(--paper); }

  /* ONE action row everywhere: icon + 6px + word for all three (S2). Fixed slots (U3). */
  .k-acts { display: flex; align-items: center; justify-content: space-between; }
  .k-acts .k-right { display: flex; align-items: center; gap: var(--s3); }
  .k-btn { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0; border: 0; background: none; font-family: var(--font-ui);
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--ink-2);
           text-decoration: none; white-space: nowrap; cursor: pointer; }
  .leaflet-container a.k-btn.dir, .k-btn.dir { color: var(--figure-deep); }
  .k-btn.on { color: var(--ink); }
  .k-slot-star { width: 72px; }
  .k-slot-vis { width: 88px; justify-content: flex-end; }
  .k-ring { width: 14px; height: 14px; margin: 1px; border-radius: 50%; box-shadow: inset 0 0 0 1.33px currentColor; flex: none; }
  .k-btn .row-stamp { margin-right: 0; }
  .k-x { position: absolute; top: 0; right: 0; width: 44px; height: 44px; font: 400 22px/44px var(--font-ui); color: var(--ink-2); text-align: center; }

  /* annotation layer for motion frames (not UI) */
  .k-anno { position: absolute; left: 0; right: 0; height: 0; border-top: 1px dashed #C2187A; z-index: 5000; pointer-events: none; }
  .k-anno span { position: absolute; left: 1px; top: -26px; width: 30px; font: 700 8px/10px var(--font-ui); color: #C2187A; background: rgba(255,255,255,.9); padding: 1px 2px; }

  /* Leaflet chassis for the popup concepts: label stock (--paper-raised) and a soft shadow instead of a hairline box */
  .k-pop .leaflet-popup-content-wrapper { padding: 0; border-radius: 2px; background: var(--paper-raised); border: 1px solid rgba(90,86,76,.18);
      box-shadow: 0 1px 2px rgba(26,26,24,.10), 0 4px 14px rgba(26,26,24,.07); }
  .k-pop .leaflet-popup-tip { background: var(--paper-raised); border: 1px solid rgba(90,86,76,.18); box-shadow: none; }
  .k-pop .leaflet-popup-content { margin: 0; }
  .k-pop a.leaflet-popup-close-button { width: 44px; height: 44px; font: 400 22px/44px var(--font-ui); top: 0; right: 0; text-align: center; }

  /* ===== A Folded Note (popup; the pin is the icon) ===== */
  .cA { padding: var(--s3) var(--s3) 0; }
  .cA .hd { padding-right: var(--s8); }
  .hd .k-eye { margin-top: 2px; }
  .cA .scroll { overflow-y: auto; }
  .cA .k-peek, .cA .k-notes { margin-top: var(--s2); }
  .cA .k-addr { margin-top: var(--s2); }
  .cA .k-acts { margin-top: var(--s1); }

  /* ===== B Place Sheet, fixed height ===== */
  .cBsheet { position: absolute; left: 0; right: 0; bottom: 0; height: calc(300px + var(--chrome-bottom)); background: var(--paper); z-index: 1001; display: flex; flex-direction: column;
             padding-bottom: var(--sheet-under); box-shadow: 0 -1px 0 var(--hair); }
  .k-shd { display: grid; grid-template-columns: var(--col-glyph) 1fr 44px; column-gap: var(--s3); padding: var(--s3) 0 0 var(--gutter); flex: none; }
  .k-shd .k-name { grid-column: 2; grid-row: 1; }
  .k-shd .row-badge { grid-column: 1; grid-row: 1; height: 24px; align-self: start; }   /* the badge sits on the FIRST name line (S3) */
  .k-shd .k-eye { grid-column: 2; grid-row: 2; margin-top: 2px; }
  .k-shd .x { grid-column: 3; grid-row: 1 / span 2; align-self: start; width: 44px; height: 44px; margin-top: -4px; font: 400 22px/44px var(--font-ui); color: var(--ink-2); text-align: center; }
  .cBsheet .bd { flex: 1; overflow-y: auto; padding: var(--s2) var(--gutter) var(--s3) calc(var(--gutter) + var(--col-glyph) + var(--s3)); }
  .cBsheet .k-addr { margin-top: var(--s2); }
  .cBsheet .bd.scrolled { -webkit-mask-image: linear-gradient(transparent, #000 16px); mask-image: linear-gradient(transparent, #000 16px); }
  .k-sacts { flex: none; padding: 0 var(--gutter) var(--s2) calc(var(--gutter) + 6px); }   /* compass centred on the 28px column */
  .cBsheet.signed-out .k-right { display: none; }

  /* ===== C Fold + Dock ===== */
  .cCdock { position: absolute; left: var(--s2); right: var(--s2); bottom: calc(300px + 22px); z-index: 900; background: var(--paper-raised); border: 1px solid rgba(90,86,76,.18); border-radius: 2px;
            box-shadow: 0 1px 2px rgba(26,26,24,.10), 0 4px 14px rgba(26,26,24,.07); display: flex; flex-direction: column; }
  .cCdock .k-shd { padding-left: var(--s3); }
  .cCdock .bd { overflow-y: auto; padding: 0 var(--s3) 0 calc(var(--s3) + var(--col-glyph) + var(--s3)); }
  .cCdock .k-peek, .cCdock .k-notes { margin-top: var(--s1); }
  .cCdock .k-addr { margin-top: var(--s2); }
  .cCdock .k-sacts { padding: 0 var(--s3) 0 calc(var(--s3) + 6px); }
  /* the credit keeps a band of its own under the dock */
  .k-dockcredit .leaflet-control-attribution { margin-bottom: 0 !important; }

  /* ===== D Pinned Entry ===== */
  .cDcard { background: var(--paper-raised); box-shadow: 0 1px 0 var(--hair), 0 3px 8px rgba(26,26,24,.06); position: relative; z-index: 2; flex: none; display: flex; flex-direction: column; }
  .cDcard .k-sacts { padding: 0 var(--gutter) 0 calc(var(--gutter) + 6px); }
  .cDcard .bd { padding: 0 var(--gutter) var(--s3) calc(var(--gutter) + var(--col-glyph) + var(--s3)); overflow-y: auto; }
  .cDcard .k-addr { margin-top: var(--s2); }
  .cDcard.open { flex: 1; min-height: 0; }

  /* ===== E Glance -> Read ===== */
  .cE { padding: var(--s3) var(--s3) 0; }
  .cE .hd { padding-right: var(--s8); }
  .cE .teaser { display: flex; align-items: center; gap: var(--s1); margin-top: var(--s1); min-height: 24px; }
  .cE .teaser .t { flex: 1; min-width: 0; font-size: 14px; line-height: 20px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cE .teaser .chev { font: 400 18px/20px var(--font-ui); color: var(--ink-2); }
  .cE .k-peek { margin-top: var(--s2); }
  .cE .k-acts { margin-top: var(--s1); }
  `;

  // ---------------------------------------------------------------- data
  function rowBadgeFor(P) {
    const sel = P.shapeId != null ? `#locationsList [data-shape-id="${P.shapeId}"] .row-badge` : `#locationsList .location-card[data-id="${P.id}"] .row-badge`;
    const el = document.querySelector(sel);
    if (el) { const c = el.cloneNode(true); c.removeAttribute('data-kind'); return c.outerHTML; }
    return `<div class="row-badge" style="--row-ink:${P.ink}">${badgeHtml(P.category, P.kind, 24)}</div>`;
  }
  function place(state) {
    let P;
    if (state.startsWith('shape')) {
      const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district');
      P = { ...shapeRowItem(s), shape: s, ink: s.color || categoryInk(s.type), kind: 'diamond', stop: planStopLine('shape', s.id) };
    } else {
      const l = locations.find(x => x.id === window.__placeId);
      P = { ...l, ink: categoryInk(l.category), kind: markerKind(l), stop: planStopLine('loc', l.id) };
    }
    P.badge = rowBadgeFor(P);
    return P;
  }

  // ---------------------------------------------------------------- parts
  const eyebrow = P => `<div class="k-eye">${esc(P.category)}${P.stop ? ` · ${esc(P.stop)}` : ''}</div>`;
  const nameH = P => `<div class="k-name">${esc(P.name)}</div>`;
  const dirBtn = () => `<a class="k-btn dir" href="#" aria-label="Get directions">${ic('compass')}Get Directions</a>`;
  // ONE star per surface (S1): the control is the mark. Filled + STARRED = starred.
  const starBtn = P => `<button class="k-btn k-slot-star ${P.starred ? 'on' : ''}" aria-pressed="${!!P.starred}">${ic(P.starred ? 'star' : 'star-open')}${P.starred ? 'Starred' : 'Star'}</button>`;
  const visBtn = P => P.visited ? `<button class="k-btn k-slot-vis on" aria-pressed="true" aria-label="Visited">${stamp(P.id)}</button>`
    : `<button class="k-btn k-slot-vis" aria-pressed="false"><span class="k-ring"></span>Mark visited</button>`;
  const acts = P => `<div class="k-acts">${dirBtn()}<div class="k-right">${starBtn(P)}${visBtn(P)}</div></div>`;
  const notesH = P => P.notes ? `<div class="k-notes">${esc(P.notes)}</div>` : '';
  const addrH = P => P.address ? `<div class="k-addr">${esc(P.address)}</div>` : '';
  const addr1 = P => P.address ? `<div class="k-addr1"><span class="t">${esc(P.address)}</span><span class="chev">›</span></div>` : '';
  // the pin link when the detail is away from the pin: the name printed by the pin, no box (donor from round-1 Dock)
  function mapLabel(P) {
    const s = pinScreen(P); const l = document.createElement('div'); l.className = 'k k-maplabel'; l.textContent = P.name; document.body.appendChild(l);
    const w = l.getBoundingClientRect().width;
    let x = s.x + 22, y = s.y - 10;                               // right of the pin
    if (P.shape) x = s.x - w / 2;
    else if (x + w > 382) { x = s.x - 22 - w; if (x < 8) { x = Math.max(8, Math.min(382 - w, s.x - w / 2)); y = s.y + 18; } }   // else left, else under it
    l.style.left = x + 'px'; l.style.top = y + 'px';
  }
  const sheetHead = (P, x = true) => `<div class="k-shd">${nameH(P)}${P.badge}${eyebrow(P)}${x ? '<span class="x">×</span>' : ''}</div>`;

  // Peek: the note (else the address) cut at a WORD to n lines, "…", then MORE in the neutral control voice.
  // The whole peek block is the More target (>= 44px with its margin). Returns '' when there is nothing more.
  function peekInto(el, P) {
    const src = (P.notes || P.address || '').replace(/\s*\n+\s*/g, ' ');
    if (!src) { el.remove(); return; }
    const lines = P.notes ? 3 : 1, hidden = !!(P.notes && P.address);
    el.className = (P.notes ? 'k-notes' : 'k-addr') + ' k-peek';
    el.style.whiteSpace = 'normal';
    const max = lines * (P.notes ? 20 : 16) + 2, whole = P.notes ? 4 * 20 + 2 : max;
    const more = ` <span class="k-more">${P.notes ? 'More' : 'Full address'}</span>`;
    const fits = h => { el.innerHTML = h; return el.getBoundingClientRect().height <= max; };
    // notes are tier 1 (owner): a typical note (90% are <= 109 chars, ~3 lines) is shown WHOLE; only a note over 4 lines folds
    el.innerHTML = esc(src); if (el.getBoundingClientRect().height <= whole) { if (hidden) el.innerHTML += ' <span class="k-more">Full address</span>'; return; }
    const words = src.split(' ');
    let lo = 0, hi = words.length;
    const cut = n => esc(words.slice(0, n).join(' ').replace(/[,;:.—-]+$/, '')) + '…' + more;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (fits(cut(mid))) lo = mid; else hi = mid - 1; }
    el.innerHTML = cut(lo);
  }

  // ---------------------------------------------------------------- map helpers
  const mapRect = () => document.getElementById('map').getBoundingClientRect();
  function anchorLatLng(P) { if (P.shape) { const a = shapeAnchor(P.shape) || [P.lat, P.lng]; return L.latLng(a[0], a[1]); } return L.latLng(P.lat, P.lng); }
  function pinScreen(P) { const p = map.latLngToContainerPoint(anchorLatLng(P)); const r = mapRect(); return { x: r.left + p.x, y: r.top + p.y }; }
  function movePinTo(P, x, y) { const s = pinScreen(P); map.panBy([s.x - x, s.y - y], { animate: false }); }
  function layerFor(P) { return P.shape ? neighborhoodLayersById.get(P.shape.id) : markersById.get(P.id).marker; }
  function select(P) { try { setHighlighted(P.shape ? shapeKey(P.shape.id) : P.id); } catch (e) {} }
  function anno(y, label) { const a = document.createElement('div'); a.className = 'k-anno'; a.style.top = y + 'px'; a.innerHTML = `<span>${label}</span>`; document.body.appendChild(a); }
  const actsY = sel => { const e = document.querySelector(sel + ' .k-acts'); const r = e.getBoundingClientRect(); return Math.round(r.top + r.height / 2); };

  function openPopup(P, html, width, cls, pinY) {
    map.closePopup();
    const layer = layerFor(P);
    const pp = layer.getPopup();
    Object.assign(pp.options, { autoPan: false, minWidth: width, maxWidth: width, className: 'k-pop ' + cls });
    if (pinY) movePinTo(P, 195, pinY);
    layer.openPopup(P.shape ? anchorLatLng(P) : undefined);
    pp.setContent(html); pp.update();
    return pp;
  }
  // One open-time autopan: the card clears the top controls (84) and the pin clears the sheet. Nothing pans after that.
  function settle(P) {
    const r = document.querySelector('.leaflet-popup').getBoundingClientRect(), s = pinScreen(P);
    let dy = 0; if (r.top < 84) dy = 84 - r.top; if (s.y + dy > 520) dy = 520 - s.y;
    map.panBy([0, -dy], { animate: false });
  }

  /*BASEMAP*/

  const C = {};

  // A. FOLDED NOTE -- popup at the pin; peek -> unfolds UPWARD; the action row never moves (no autopan after open).
  //    st: peek | open | mid | high (open with the pin high: the card caps at the top controls and scrolls inside)
  C.fold = (P, mode) => {
    select(P);
    const body = `<div class="scroll"><div class="pk"></div></div>`;
    const html = `<div class="k cA"><div class="hd">${nameH(P)}${eyebrow(P)}</div>${body}${acts(P)}</div>`;
    openPopup(P, html, 316, '', mode === 'high' ? 250 : 470);   // open pans the pin to ONE spot low in the map strip: room to unfold upward, and the action row's y is the same for every place
    const pk = document.querySelector('.cA .pk');
    peekInto(pk, P);
    document.querySelector('.leaflet-popup')._k = 1;
    const y0 = actsY('.cA');
    if (mode === 'open' || mode === 'mid' || mode === 'high') {
      const sc = document.querySelector('.cA .scroll');
      const pk2 = document.querySelector('.cA .pk'); if (pk2) pk2.remove();
      sc.innerHTML = `${notesH(P)}${addrH(P)}<div class="k-btn" style="min-height:40px">Less</div>`;
      const pinTop = pinScreen(P).y;
      const cardFixed = document.querySelector('.cA').getBoundingClientRect().height - sc.getBoundingClientRect().height;
      const room = pinTop - 30 - 84 - cardFixed;   // tip + pin head, top controls
      sc.style.maxHeight = Math.max(60, room) + 'px';
      if (mode === 'mid') sc.style.maxHeight = Math.round(Math.min(room, sc.scrollHeight) * 0.45) + 'px', sc.style.overflow = 'hidden';
      { const pp = layerFor(P).getPopup(); pp._updateLayout(); pp._updatePosition(); }   // re-layout without re-rendering the content
    }
    const y1 = actsY('.cA');
    if (window.__anno) anno(y1, `row y ${y1}`);
    return ['.leaflet-popup'];
  };

  // B. PLACE SHEET, FIXED HEIGHT -- the place takes the list sheet's exact box; actions pinned at its foot.
  C.sheet = (P, mode) => {
    select(P);
    map.closePopup();
    const el = document.createElement('div'); el.className = 'k cBsheet' + (mode === 'signedout' ? ' signed-out' : '');
    el.innerHTML = `${sheetHead(P)}<div class="bd">${notesH(P)}${mode === 'addr' ? addrH(P) : addr1(P)}</div><div class="k-sacts">${acts(P)}</div>`;
    if (mode === 'directions') el.querySelector('.k-btn.dir').lastChild.textContent = 'Directions';
    document.body.appendChild(el);
    movePinTo(P, 195, 300); mapLabel(P);
    if (mode === 'scrolled') { const b = el.querySelector('.bd'); b.scrollTop = b.scrollHeight; b.classList.add('scrolled'); }
    if (window.__anno) { const y = actsY('.cBsheet'); anno(y, `row y ${y}`); }
    return ['.cBsheet'];
  };

  // C. FOLD + DOCK -- detached card docked above the sheet (the credit keeps its band below it); More raises it upward.
  C.dock = (P, mode) => {
    select(P);
    map.closePopup();
    document.body.classList.add('k-dockcredit');
    const d = document.createElement('div'); d.className = 'k cCdock';
    d.innerHTML = `${sheetHead(P)}<div class="bd"><div class="pk"></div></div><div class="k-sacts">${acts(P)}</div>`;
    document.body.appendChild(d);
    peekInto(d.querySelector('.pk'), P);
    const y0 = actsY('.cCdock');
    if (mode === 'open') {
      const bd = d.querySelector('.bd'); bd.innerHTML = `${notesH(P)}${addrH(P)}<div class="k-btn" style="min-height:40px">Less</div>`;
      const fixed = d.getBoundingClientRect().height - bd.getBoundingClientRect().height;
      bd.style.maxHeight = (544 - 22 - 84 - fixed) + 'px';
    }
    const top = d.getBoundingClientRect().top;
    movePinTo(P, 195, Math.max(120, Math.min(300, top - 60)));   // autopan keeps the pin above the dock
    const y1 = actsY('.cCdock');
    if (window.__anno) anno(y1, `row y ${y1}`);
    return ['.cCdock'];
  };

  // D. PINNED ENTRY -- the row lifts out of the list and becomes the card at the top of the list sheet.
  //    The sheet keeps its 300px; the rest of the list scrolls below; the row itself is hidden (no duplicate).
  C.pin = (P, mode) => {
    map.closePopup();
    select(P);   // one selected state: the pin highlights; the row itself is lifted into the card
    const sel = P.shape ? `#locationsList [data-shape-id="${P.shape.id}"]` : `#locationsList .location-card[data-id="${P.id}"]`;
    const row = document.querySelector(sel);
    const card = document.createElement('div'); card.className = 'k cDcard' + (mode === 'open' ? ' open' : '');
    card.innerHTML = `${sheetHead(P)}<div class="k-sacts">${acts(P)}</div><div class="bd"><div class="pk"></div></div>`;
    const list = document.getElementById('locationsList');
    list.parentNode.insertBefore(card, list);
    if (row) row.style.display = 'none';
    if (mode === 'open') { card.querySelector('.bd').innerHTML = `${notesH(P)}${addrH(P)}<div class="k-btn" style="min-height:40px">Less</div>`; list.style.display = 'none'; }
    else { peekInto(card.querySelector('.pk'), P); const pk = card.querySelector('.k-peek'); if (pk && P.notes) pk.innerHTML = pk.innerHTML.replace(/ <span class="k-more">Full address<\/span>/, ''); if (P.notes || P.address) card.querySelector('.bd').insertAdjacentHTML('beforeend', P.notes ? addr1(P) : ''); if (!P.notes && P.address) { const k = card.querySelector('.k-peek'); if (k) k.remove(); card.querySelector('.bd').insertAdjacentHTML('beforeend', addr1(P)); } }
    // the selected pin on the map, in the pin's own language
    movePinTo(P, 195, 290); mapLabel(P);
    if (window.__anno) { const y = actsY('.cDcard'); anno(y, `row y ${y}`); }
    return ['#locations'];
  };

  // E. GLANCE -> READ -- a small glance card at the pin; reading is a deliberate step into the fixed sheet (B).
  C.glance = (P, mode) => {
    if (mode === 'read') return C.sheet(P, 'read');
    select(P);
    const html = `<div class="k cE"><div class="hd">${nameH(P)}${eyebrow(P)}</div><div class="pk"></div>${acts(P)}</div>`;
    openPopup(P, html, 316, '', 470);
    const pk = document.querySelector('.cE .pk'); peekInto(pk, P);
    if (pk.isConnected) { pk.innerHTML = pk.innerHTML.replace(/<span class="k-more">[^<]*<\/span>/, '<span class="k-more">Read ›</span>'); }
    { const pp = layerFor(P).getPopup(); pp._updateLayout(); pp._updatePosition(); }
    return ['.leaflet-popup'];
  };

  function close() {
    document.querySelectorAll('.k:not(.k-base), .k-anno').forEach(e => e.remove());
    document.querySelectorAll('#locationsList .location-card').forEach(r => { r.style.display = ''; });
    document.getElementById('locationsList').style.display = '';
    map.closePopup();
    try { setHighlighted(null); } catch (e) {}
    markersById.forEach(m => m.marker.setIcon(markerIcon(m.loc, false)));
  }
  function tapRow(P) {
    const row = document.querySelector(P.shape ? `#locationsList [data-shape-id="${P.shape.id}"]` : `#locationsList .location-card[data-id="${P.id}"]`);
    row.classList.add('active');
    const r = row.getBoundingClientRect(); const t = document.createElement('div'); t.className = 'k-anno';
    t.style.cssText = `left:${r.left + r.width * 0.45 - 18}px;top:${r.top + r.height / 2 - 18}px;width:36px;height:36px;border:2px solid #C2187A;border-radius:50%;background:rgba(194,24,122,.15);right:auto`;
    document.body.appendChild(t);
  }
  function tapPin(P) {
    const s = pinScreen(P); const t = document.createElement('div'); t.className = 'k-anno';
    t.style.cssText = `left:${s.x - 20}px;top:${s.y - 20}px;width:40px;height:40px;border:2px solid #C2187A;border-radius:50%;background:rgba(194,24,122,.12);right:auto`;
    document.body.appendChild(t);
  }

  window.K = {
    css() { if (!document.getElementById('k-css')) { const s = document.createElement('style'); s.id = 'k-css'; s.textContent = CSS; document.head.appendChild(s); } },
    show(concept, state, mode) { this.css(); basemap(); const P = place(state); return C[concept](P, mode || 'peek'); },
    // frames: 'list' (nothing open, optional tap mark), 'closed' (open then close: the list as left)
    frame(concept, state, kind) { this.css(); basemap(); const P = place(state);
      if (kind === 'list-row') { movePinTo(P, 195, 300); tapRow(P); return ['#locations']; }
      if (kind === 'list-pin') { movePinTo(P, 195, 300); tapPin(P); return ['#locations']; }
      if (kind === 'closed') { C[concept](P, 'peek'); close(); movePinTo(P, 195, 300); return ['#locations']; }
    },
  };
})();
