// Page-side code for the Round 3 popup concepts. Injected into the REAL app
// (index.html, unmodified, in the gesture harness) by render.js after a place
// is set up. Reuses the app's tokens, glyph sprite, seal badge, row stamp and
// check path. render.js splices round 1's stand-in basemap in at BASEMAP.
(() => {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ic = (id, cls = '') => `<svg class="k-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#g-${id}"/></svg>`;
  const rowStamp = (id, tilt) => `<span class="row-stamp" style="--stamp-tilt:${tilt == null ? stampTilt(String(id)) : tilt}deg" aria-hidden="true"><span class="row-stamp-ring">${stampCheckSvg()}<span class="row-stamp-word">Visited</span></span></span>`;
  const TYPEFACE_TYPED = `'Liberation Mono', 'Courier New', monospace`;   // STAND-IN for a typewriter webfont (e.g. Courier Prime); flagged in the README

  const CSS = `
  .leaflet-tile-pane { visibility: hidden; }
  .k-base { position: absolute; inset: 0; z-index: 0; pointer-events: none; filter: sepia(0.3) saturate(0.75) contrast(0.96) hue-rotate(-6deg); }
  .k-base svg { width: 100%; height: 100%; display: block; }
  .k { font-family: var(--font-ui); color: var(--ink); -webkit-font-smoothing: antialiased; text-align: left; }
  .k-ic { width: 16px; height: 16px; display: block; flex: none; }

  /* ---- shared type voices (one family: Archivo, its width axis does the talking) ---- */
  .k-meta { display: flex; align-items: center; gap: 6px; font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .12em; color: var(--ink-2); white-space: nowrap; overflow: hidden; }
  .k-meta svg { flex: none; }
  .k-notes { font-size: 14px; line-height: 20px; color: var(--ink); white-space: pre-line; }
  .k-more { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; letter-spacing: .12em; color: var(--ink-2); white-space: nowrap; }
  .k-addr1 { display: flex; align-items: center; gap: var(--s1); min-height: 24px; }
  .k-addr1 .t { flex: 1; min-width: 0; font-size: 12px; line-height: 16px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .k-addr1 .chev { font: 400 16px/16px var(--font-ui); color: var(--ink-2); }
  .k-addr { font-size: 12px; line-height: 16px; color: var(--ink-2); }

  /* ---- ONE action row, measured: icon 16 + 6 + word; 16px between actions; all three the same mass ---- */
  .k-acts { display: flex; align-items: center; gap: var(--s4); }
  .k-btn { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0; border: 0; background: none; font-family: var(--font-ui);
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 11px; line-height: 12px; letter-spacing: .1em; color: var(--ink);
           text-decoration: none; white-space: nowrap; cursor: pointer; }
  .k-btn.dir { color: var(--figure-deep); }
  .k-btn.vis.on { color: color-mix(in srgb, var(--navy) 82%, transparent); }
  .k-btn .row-stamp-check { width: 16px; height: 16px; display: block; }
  .k-ring { width: 14px; height: 14px; margin: 1px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px currentColor; flex: none; }
  /* signed out (owner: "actions should be visible but disabled"): edit actions at the state system's off alpha; Directions stays live */
  .k-so .k-btn.star, .k-so .k-btn.vis, .k-so .S-band, .k-so .P-markhint, .k-so .P-mark { opacity: var(--state-off-alpha); }
  .k-x { position: absolute; top: 0; right: 0; width: 44px; height: 44px; font: 400 22px/44px var(--font-ui); color: var(--ink-2); text-align: center; }

  /* annotation layer for motion frames (not UI) */
  .k-anno { position: absolute; left: 0; right: 0; height: 0; border-top: 1px dashed #C2187A; z-index: 5000; pointer-events: none; }
  .k-anno span { position: absolute; left: 1px; top: -14px; font: 700 9px/12px var(--font-ui); color: #C2187A; background: rgba(255,255,255,.9); padding: 0 3px; white-space: nowrap; }
  .k-tap { position: absolute; z-index: 5001; width: 40px; height: 40px; border: 2px solid #C2187A; border-radius: 50%; background: rgba(194,24,122,.12); pointer-events: none; }

  .k-layer { position: absolute; z-index: 1100; pointer-events: none; }
  .k-bg { position: absolute; left: 0; top: 0; overflow: visible; z-index: 0; pointer-events: none; }
  .k-pincopy { position: absolute; z-index: 1300; line-height: 0; pointer-events: none; }

  /* ===== 1 LUGGAGE LABEL (the list sheet becomes the hotel label) ===== */
  /* finalist fixes: the sheet sizes to its content (max 300) and stays bottom-anchored, so the buttons keep one y
     and a short place gets a short label instead of slack; the band hugs the lockup; the seal is centred on it. */
  .L-sheet { position: absolute; left: 0; right: 0; bottom: 0; max-height: 300px; background: var(--paper); z-index: 1001; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 -1px 0 var(--hair); }
  .L-band { position: relative; flex: none; background: var(--figure-deep); color: var(--paper); padding: var(--s4) 44px var(--s3) var(--gutter); display: grid; grid-template-columns: 40px 1fr; column-gap: var(--s3); align-items: center; }
  .L-band .seal { width: 40px; height: 40px; }
  .L-band .seal svg { display: block; }
  .L-band > div { min-width: 0; }
  .L-name { font-stretch: 62%; font-weight: 700; text-transform: uppercase; font-size: 30px; line-height: 29px; letter-spacing: .015em; color: var(--paper); }
  .L-sub { margin-top: 6px; font-stretch: 75%; font-weight: 700; text-transform: uppercase; font-size: 10px; line-height: 12px; letter-spacing: .32em; color: var(--paper-warm); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .L-band .x { color: var(--paper); width: 44px; height: 44px; font: 400 24px/44px var(--font-ui); text-align: center; position: absolute; right: 0; top: 4px; }
  .L-cut { height: 10px; flex: none; background: var(--figure-deep); clip-path: polygon(0 0, 100% 0, 50% 100%); }
  .L-body { flex: 0 1 auto; min-height: 0; overflow: hidden; padding: var(--s2) var(--gutter) 0 calc(var(--gutter) + 40px + var(--s3)); }
  .L-body .k-addr1 { margin-top: var(--s1); }
  .L-acts { flex: none; padding: var(--s1) var(--gutter) 0 calc(var(--gutter) + 40px + var(--s3)); }
  .L-acts .k-btn.dir { color: var(--ink); }   /* the band owns the colour */
  .L-pm { position: absolute; right: 52px; bottom: -14px; z-index: 3; color: var(--paper); }
  .L-pm .row-stamp { display: block; color: var(--paper); transform: rotate(-9deg); }

  /* ===== 2 HANGING TAG (a string tag tied to the pin) ===== */
  .T { position: absolute; z-index: 1100; width: 316px; }
  .T-in { position: relative; padding: 40px var(--s4) 0; }
  .T-name { font-stretch: 62%; font-weight: 700; font-size: 26px; line-height: 28px; letter-spacing: 0; color: var(--ink); padding-right: 32px; }
  .T .k-meta { margin-top: var(--s1); }
  .T .k-notes { margin-top: var(--s2); }
  .T .k-acts { margin-top: var(--s1); }
  .T-stub { position: relative; padding: 0 var(--s4); height: 40px; display: flex; align-items: center; }
  .T-stub .k-addr1 { flex: 1; min-width: 0; }
  .T .k-x { top: 26px; right: 4px; }
  .T-scroll { margin-top: var(--s2); max-height: 220px; overflow: hidden; -webkit-mask-image: linear-gradient(#000 80%, transparent); mask-image: linear-gradient(#000 80%, transparent); }
  .T-scroll .k-notes { margin-top: 0; }
  .T-scroll .k-addr { margin-top: var(--s2); }
  .T-turn { min-height: 28px; display: flex; align-items: center; }
  .T-hit { position: absolute; z-index: 5001; border: 1.5px dashed #C2187A; border-radius: 3px; pointer-events: none; }

  /* ===== 3 CARD FILE (the row is pulled up out of the ledger like an index card) ===== */
  .F-card { position: absolute; left: 0; right: 0; z-index: 1003; background: var(--paper-raised); box-shadow: 0 -1px 0 rgba(90,86,76,.10), 0 -6px 14px rgba(26,26,24,.07); display: flex; flex-direction: column; }
  .F-head { display: grid; grid-template-columns: var(--col-glyph) 1fr 44px; column-gap: var(--s3); padding: var(--s3) 0 0 var(--gutter); }
  .F-head .num { grid-column: 1; grid-row: 1; height: 24px; display: flex; align-items: center; justify-content: center; font: 700 13px/1 var(--font-ui); color: var(--ink-2); }
  .F-head .row-badge { grid-column: 1; grid-row: 1; height: 24px; align-self: start; }
  .F-name { grid-column: 2; grid-row: 1; font-size: 18px; line-height: 24px; font-weight: 600; color: var(--ink); }
  .F-head .k-meta { grid-column: 2; grid-row: 2; margin-top: 2px; }
  .F-head .x { grid-column: 3; grid-row: 1 / span 2; align-self: start; width: 44px; height: 44px; margin-top: -10px; display: flex; align-items: center; justify-content: center; color: var(--ink-2); }
  .F-head .x svg { width: 16px; height: 16px; }
  .F-head { padding-bottom: var(--s2); border-bottom: 1px solid color-mix(in srgb, var(--figure-deep) 70%, transparent); }
  .F-body { flex: 1; min-height: 0; overflow: hidden; padding: 0 var(--gutter) 0 calc(var(--gutter) + var(--col-glyph) + var(--s3));
            background: repeating-linear-gradient(to bottom, transparent 0 23px, color-mix(in srgb, var(--hair) 80%, transparent) 23px 24px); background-position: 0 4px; }
  .F-body .k-notes { font-family: ${TYPEFACE_TYPED}; font-size: 13px; line-height: 24px; padding-top: 6px; letter-spacing: -0.01em; }
  .F-body .k-more { font-family: var(--font-ui); }
  .F-acts { flex: none; padding: 0 var(--gutter) 0 calc(var(--gutter) + var(--col-glyph) + var(--s3)); }
  /* the index tab: only when there is a long tail (full address / rest of a long note) behind the card */
  .F-tab { position: absolute; left: var(--gutter); top: -28px; height: 28px; padding: 0 var(--s3); background: var(--paper-raised); display: flex; align-items: center; gap: 6px;
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; letter-spacing: .12em; color: var(--ink-2);
           clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 100%, 0 100%); }
  .F-tabhit { position: absolute; right: var(--s6); top: -28px; width: 120px; height: 44px; }
  .F-ghost { position: absolute; left: 0; right: 0; height: 56px; z-index: 1002; background: var(--paper); box-shadow: inset 0 3px 6px rgba(26,26,24,.10); }

  /* ===== 4 PASSPORT STAMP (the card is an entry stamp; Mark Visited inks it) ===== */
  .S-pop .leaflet-popup-content-wrapper { padding: 0; border-radius: 2px; background: var(--paper-raised); box-shadow: 0 1px 2px rgba(26,26,24,.10), 0 4px 14px rgba(26,26,24,.08); }
  .S-pop .leaflet-popup-tip { background: var(--paper-raised); box-shadow: none; }
  .S-pop .leaflet-popup-content { margin: 0; }
  .S-pop a.leaflet-popup-close-button { width: 44px; height: 44px; font: 400 22px/44px var(--font-ui); top: 0; right: 0; text-align: center; color: var(--ink-2); }
  .S { padding: var(--s3) var(--s3) 0; width: 316px; }
  .S-stamp { position: relative; margin: 4px 30px 0 0; padding: 12px 14px 0; transform: rotate(var(--tilt, 0deg)); transform-origin: 50% 60%; }
  .S-stamp .k-bg { z-index: 0; }
  .S-stamp > :not(svg) { position: relative; z-index: 1; }
  .S-top { display: flex; align-items: center; justify-content: center; gap: 6px; font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .16em; color: var(--ink-2); white-space: nowrap; }
  .S-name { margin-top: 4px; text-align: center; font-stretch: 62%; text-transform: uppercase; font-weight: 700; font-size: 24px; line-height: 25px; letter-spacing: .03em; color: var(--ink); }
  .S-band { margin-top: 8px; height: 40px; display: flex; align-items: center; justify-content: center; gap: 6px; font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 12px; letter-spacing: .22em; color: var(--ink-2); }
  .S-band .row-stamp-check { width: 16px; height: 16px; }
  .S.on .S-top, .S.on .S-band { color: color-mix(in srgb, var(--navy) 82%, transparent); }
  .S-body { margin-top: var(--s3); }
  .S .k-acts { margin-top: var(--s1); }

  /* ===== 5 POSTCARD (the list sheet becomes the back of a postcard) ===== */
  /* finalist fixes: content-sized (max 300, bottom-anchored: buttons keep one y); a close × instead of a "‹ list"
     back link; a postage stamp that reads at 1x; the address flows across the ruled lines instead of comma pieces. */
  .P-sheet { position: absolute; left: 0; right: 0; bottom: 0; max-height: 300px; background: var(--paper-raised); z-index: 1001; display: flex; flex-direction: column; box-shadow: 0 -1px 0 var(--hair); }
  .P-x { position: absolute; right: 0; top: 0; width: 44px; height: 44px; font: 400 24px/44px var(--font-ui); color: var(--ink-2); text-align: center; z-index: 4; }
  .P-card { position: relative; padding: var(--s4) var(--gutter) 0; display: grid; grid-template-columns: 1fr 1px 120px; grid-template-rows: auto 1fr; column-gap: var(--s3); }
  .P-head { grid-column: 1; grid-row: 1; }
  .P-name { font-stretch: 112%; font-weight: 700; font-size: 20px; line-height: 24px; letter-spacing: -0.01em; color: var(--ink); }
  .P-head .k-meta { margin-top: var(--s1); }
  .P-msg { grid-column: 1; grid-row: 2; margin-top: var(--s3); overflow: hidden; }
  .P-rule { grid-column: 2; grid-row: 1 / span 2; background: var(--hair); margin: 2px 0 var(--s2); }
  .P-right { grid-column: 3; grid-row: 1 / span 2; position: relative; padding-bottom: var(--s2); }
  .P-stamp { position: relative; width: 64px; height: 76px; }
  .P-stamp .seal { position: absolute; left: 12px; top: 18px; }
  .P-mark { position: absolute; left: -6px; top: 48px; z-index: 2; }
  .P-mark .row-stamp { display: block; transform: rotate(-14deg); transform-origin: 50% 50%; }
  .P-markhint { margin-top: var(--s2); height: 20px; font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--ink); display: flex; align-items: center; gap: 6px; }
  .P-markgap { height: 28px; }
  .P-addr { margin-top: var(--s2); font-size: 11px; line-height: 22px; color: var(--ink-2); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
            background: repeating-linear-gradient(to bottom, transparent 0 21px, var(--hair) 21px 22px); }
  .P-acts { flex: none; padding: 0 var(--gutter); }
  .P-tgt { position: absolute; z-index: 5001; border: 1.5px dashed #C2187A; border-radius: 3px; pointer-events: none; }

  /* ===== 6 PINNED NOTE (the pin is the pushpin; the note is typed field notes on a scrap) ===== */
  .N { position: absolute; z-index: 1100; width: 358px; transform: rotate(var(--tilt, -0.8deg)); transform-origin: 26px 26px; }
  .N-in { position: relative; padding: var(--s3) var(--s3) 0 calc(var(--s3) + var(--col-glyph) + var(--s3)); }
  .N-name { font-size: 18px; line-height: 24px; font-weight: 700; font-stretch: 75%; color: var(--ink); padding-right: 32px; }
  .N .k-meta { margin-top: 2px; }
  .N-note { margin-top: var(--s2); font-size: 14px; line-height: 20px; color: var(--ink); white-space: pre-line; }
  .N-note.fold { max-height: calc(20px * 4); overflow: hidden; -webkit-mask-image: linear-gradient(#000 70%, transparent); mask-image: linear-gradient(#000 70%, transparent); }
  .N-more { display: flex; align-items: center; gap: 6px; min-height: 28px; }
  .N .k-acts { margin-top: 0; }
  `;

  // ---------------------------------------------------------------- data
  function place(state) {
    let P;
    if (state.startsWith('shape')) {
      const s = neighborhoodShapes.find(x => x.city === 'reykjavik' && x.type === 'district');
      P = { ...shapeRowItem(s), shape: s, ink: s.color || categoryInk(s.type), kind: 'diamond', stop: planStopLine('shape', s.id), category: 'district' };
    } else {
      const l = locations.find(x => x.id === window.__placeId);
      P = { ...l, ink: categoryInk(l.category), kind: markerKind(l), stop: planStopLine('loc', l.id) };
    }
    return P;
  }
  const seal = (P, size, opts = {}) => `<span class="seal" style="display:block;width:${size}px;height:${size}px;line-height:0">${badgeHtml(P.category, P.kind, size, { ink: P.ink, fill: opts.fill || '#F2EBDD', mark: P.ink, rim: opts.rim || 2 })}</span>`;
  const typeWord = P => P.category === 'district' && P.shape ? 'district' : P.category;
  const meta = (P, withSeal = false) => `<div class="k-meta">${withSeal ? badgeHtml(P.category, P.kind, 14, { ink: P.ink, fill: '#F2EBDD', mark: P.ink, rim: 1.5 }) : ''}<span>${esc(typeWord(P))}${P.stop ? ` · ${esc(P.stop)}` : ''}</span></div>`;
  const dirBtn = () => `<a class="k-btn dir" href="#">${ic('compass')}Directions</a>`;
  const starBtn = P => `<button class="k-btn star">${ic(P.starred ? 'star' : 'star-open')}${P.starred ? 'Starred' : 'Star'}</button>`;
  const visBtn = P => P.visited ? `<button class="k-btn vis on">${stampCheckSvg()}Visited</button>` : `<button class="k-btn vis"><span class="k-ring"></span>Mark visited</button>`;
  const acts = (P, o = {}) => `<div class="k-acts">${dirBtn()}${starBtn(P)}${o.noVis ? '' : visBtn(P)}</div>`;
  const notesH = (P, cls = 'k-notes') => P.notes ? `<div class="${cls}">${esc(P.notes)}</div>` : '';
  const addr1 = P => P.address ? `<div class="k-addr1"><span class="t">${esc(P.address)}</span><span class="chev">›</span></div>` : '';

  // Peek: a typical note shows WHOLE (owner: notes tier 1). Only past `whole` lines does it cut at a word to `lines` + "…" + label.
  function peekInto(el, P, { lines = 3, whole = 4, lh = 20, label = 'More' } = {}) {
    if (!P.notes) { el.remove(); return false; }
    const src = P.notes.replace(/\s*\n+\s*/g, ' ');
    el.style.whiteSpace = 'normal';
    el.innerHTML = esc(src);
    if (el.getBoundingClientRect().height <= whole * lh + 2) { el.innerHTML = esc(P.notes); el.style.whiteSpace = ''; return false; }
    const words = src.split(' '), max = lines * lh + 2, more = ` <span class="k-more">${label}</span>`;
    const cut = n => esc(words.slice(0, n).join(' ').replace(/[,;:.—-]+$/, '')) + '…' + more;
    let lo = 0, hi = words.length;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; el.innerHTML = cut(mid); if (el.getBoundingClientRect().height <= max) lo = mid; else hi = mid - 1; }
    el.innerHTML = cut(lo);
    return true;
  }

  // ---------------------------------------------------------------- map helpers
  const mapRect = () => document.getElementById('map').getBoundingClientRect();
  function anchorLatLng(P) { if (P.shape) { const a = shapeAnchor(P.shape) || [P.lat, P.lng]; return L.latLng(a[0], a[1]); } return L.latLng(P.lat, P.lng); }
  function pinScreen(P) { const p = map.latLngToContainerPoint(anchorLatLng(P)); const r = mapRect(); return { x: r.left + p.x, y: r.top + p.y }; }
  function movePinTo(P, x, y) { const s = pinScreen(P); map.panBy([s.x - x, s.y - y], { animate: false }); }
  function layerFor(P) { return P.shape ? neighborhoodLayersById.get(P.shape.id) : markersById.get(P.id).marker; }
  function select(P) { try { setHighlighted(P.shape ? shapeKey(P.shape.id) : P.id); } catch (e) {} }
  function anno(y, label) { const a = document.createElement('div'); a.className = 'k-anno'; a.style.top = y + 'px'; a.innerHTML = `<span>${label}</span>`; document.body.appendChild(a); }
  function tapAt(x, y) { const t = document.createElement('div'); t.className = 'k-tap'; t.style.left = (x - 20) + 'px'; t.style.top = (y - 20) + 'px'; document.body.appendChild(t); }
  const actsY = el => { const e = el.querySelector('.k-acts'); const r = e.getBoundingClientRect(); return Math.round(r.top + r.height / 2); };
  // The pin re-drawn above an overlay that sits on it (the map pin itself is unchanged: this is a copy of its DOM).
  function pinOnTop(P) {
    const s = pinScreen(P);
    const d = document.createElement('div'); d.className = 'k-pincopy';
    if (P.shape) { d.innerHTML = badgeHtml('district', 'diamond', 28, { ink: P.ink, fill: '#F2EBDD', mark: P.ink, rim: 2 }); d.style.left = (s.x - 14) + 'px'; d.style.top = (s.y - 14) + 'px'; }
    else { const icon = markersById.get(P.id).marker._icon; const r = icon.getBoundingClientRect(); d.innerHTML = icon.innerHTML; d.style.left = r.left + 'px'; d.style.top = r.top + 'px'; d.style.width = r.width + 'px'; d.style.height = r.height + 'px'; }
    document.body.appendChild(d); return d;
  }
  // Draw a measured SVG shape behind an element (paper die-cuts, stamp frames)
  function bg(el, w, h, svgInner, pad = 12) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'k-bg'); s.setAttribute('width', w + pad * 2); s.setAttribute('height', h + pad * 2);
    s.setAttribute('viewBox', `${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`); s.style.left = -pad + 'px'; s.style.top = -pad + 'px';
    s.innerHTML = svgInner; el.prepend(s); return s;
  }
  const SHADOW = `<filter id="kshadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#1A1A18" flood-opacity=".10"/><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#1A1A18" flood-opacity=".08"/></filter>`;

  /*BASEMAP*/

  const C = {};

  // ======================================================== 1 LUGGAGE LABEL
  // The list sheet becomes the place's hotel label: a figure-deep band (the only colour on screen) carrying the
  // pin's own seal as the label's emblem and the name as label lettering (condensed caps, always; 2 lines max,
  // shrinking to fit). The sheet sizes to its content (max 300) and stays bottom-anchored, so the buttons keep one y.
  // "(approx.)" leaves the name for the meta line. modes: peek | f1 | f2 | f3 | closed | postmark (optional hybrid)
  const cleanName = n => String(n).replace(/\s*\(approx\.\)\s*/i, '');
  const metaText = P => [typeWord(P), /\(approx\.\)/i.test(P.name) ? 'approx. placement' : '', P.stop].filter(Boolean).join(' · ');
  function sheetSwap(el) {   // the place sheet replaces the list sheet; the OSM credit sits on its top edge
    document.getElementById('locations').style.visibility = 'hidden';
    growMap(el.getBoundingClientRect().height);
  }
  // the map meets the top of whatever sheet is showing (the app sizes #mainContent to the sheet the same way)
  function growMap(sheetH) {
    const mc = document.getElementById('mainContent'); mc.style.height = (844 - sheetH) + 'px';
    map.invalidateSize({ pan: false });
  }
  C.label = (P, mode) => {
    select(P);
    movePinTo(P, 195, 280);
    if (mode === 'f1') { const s = pinScreen(P); tapAt(s.x, s.y); return ['body']; }
    const el = document.createElement('div'); el.className = 'k L-sheet';
    const pm = mode === 'postmark';
    el.innerHTML = `<div class="L-band">${seal(P, 40, { rim: 2.5 })}<div><div class="L-name">${esc(cleanName(P.name))}</div><div class="L-sub">${esc(metaText(P))}</div></div><span class="x">×</span>${pm && P.visited ? `<div class="L-pm">${rowStamp(P.id, -9)}</div>` : ''}</div>
      <div class="L-cut"></div>
      <div class="L-body"><div class="k-notes pk"></div>${addr1(P)}</div>
      <div class="L-acts">${acts(P, { noVis: pm })}</div>`;
    document.body.appendChild(el);
    // lettering: 30px condensed caps; shrinks (min 18) until it fits in 2 lines
    { const nm = el.querySelector('.L-name'); let fs = 30;
      const lines = () => Math.round(nm.getBoundingClientRect().height / (fs * 0.97));
      while (fs > 18 && (lines() > 2 || nm.scrollWidth > nm.clientWidth + 1)) { fs -= 1; nm.style.fontSize = fs + 'px'; nm.style.lineHeight = (fs * 0.97) + 'px'; } }
    peekInto(el.querySelector('.pk'), P, { lines: 5, whole: 6 });
    if (!P.notes && !P.address) el.querySelector('.L-body').remove();
    sheetSwap(el);
    if (mode === 'f2') {
      el.style.transform = 'translateY(120px)';
      const sl = el.querySelector('.L-band .seal').getBoundingClientRect(), s = pinScreen(P);
      const fly = document.createElement('div'); fly.className = 'k k-layer'; fly.innerHTML = seal(P, 40, { rim: 2.5 });
      const fx = (s.x + sl.left + 20) / 2 - 20 - 30, fy = (s.y + sl.top + 20) / 2 - 20 + 10;
      fly.style.left = fx + 'px'; fly.style.top = fy + 'px'; fly.style.transform = 'scale(1.35) rotate(-8deg)'; fly.style.filter = 'drop-shadow(0 3px 4px rgba(26,26,24,.18))';
      el.querySelector('.L-band .seal').style.visibility = 'hidden';
      document.body.appendChild(fly);
      anno(sl.top + 120 - 4, 'label rising; the seal lifts off the pin');
    }
    if (mode === 'f3') { const sl = el.querySelector('.L-band .seal'); sl.style.transform = 'scale(1.12)'; anno(el.getBoundingClientRect().top - 6, 'the seal lands as the label’s emblem (grow, settle)'); }
    if (window.__anno && mode === 'peek' && window.__frameName) { const y = actsY(el); anno(y, `buttons y ${y}`); }
    return ['.L-sheet'];
  };

  // ======================================================== 2 HANGING TAG
  // A string tag tied to the pin: the pin is the knot, the string replaces the tip, the tag hangs BELOW the pin.
  // Both top corners chamfered about the eyelet; a perforated stub holds the address. A note shows whole to 4 lines;
  // past that TURN OVER: the back has the whole note (scrolls, fades at its foot) AND the buttons, so acting after a
  // long note is still one tap. While the tag is open the list lowers to its header (the app's own collapsed state):
  // the tag gets the map, and the orange selected row is off screen. Close restores the sheet.
  // modes: peek | back | f1 | f2 (swing 6deg, settled hit boxes drawn) | f3 | f-flip
  C.tag = (P, mode) => {
    select(P);
    document.getElementById('locations').classList.add('collapsed'); growMap(60);
    movePinTo(P, 195, 112);
    if (mode === 'f1') { const s = pinScreen(P); tapAt(s.x, s.y); return ['body']; }
    const s = pinScreen(P);
    const t = document.createElement('div'); t.className = 'k T';
    const back = mode === 'back';
    t.innerHTML = back
      ? `<div class="T-in"><span class="k-x">×</span><div class="T-name">${esc(P.name)}</div>${meta(P, true)}<div class="T-scroll">${notesH(P)}${P.address ? `<div class="k-addr">${esc(P.address)}</div>` : ''}</div><div class="T-turn"><span class="k-more">Turn back ↺</span></div>${acts(P)}</div><div style="height:8px"></div>`
      : `<div class="T-in"><span class="k-x">×</span><div class="T-name">${esc(P.name)}</div>${meta(P, true)}<div class="k-notes pk"></div>${acts(P)}</div>${P.address ? `<div class="T-stub">${addr1(P)}</div>` : '<div style="height:8px"></div>'}`;
    document.body.appendChild(t);
    if (!back) peekInto(t.querySelector('.pk'), P, { lines: 4, whole: 4, label: 'Turn over ↻' });
    const top = s.y + 28;
    t.style.left = (s.x - 158) + 'px'; t.style.top = top + 'px';
    const w = 316, h = t.getBoundingClientRect().height, c = 28;
    const stubY = P.address && !back ? h - 40 : null;
    const d = `M${c},0 H${w - c} L${w},${c} V${h} H0 V${c} Z`;
    const hole = `M158,18 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 Z`;
    const notches = stubY ? `M0,${stubY - 5} a5,5 0 0,1 0,10 Z M${w},${stubY - 5} a5,5 0 0,0 0,10 Z` : '';
    const svg = `<defs>${SHADOW}</defs><path d="${d} ${hole}" fill-rule="evenodd" fill="var(--paper-raised)" filter="url(#kshadow)"/>`
      + (stubY ? `<path d="${notches}" fill="#E3DCCB"/><line x1="10" x2="${w - 10}" y1="${stubY}" y2="${stubY}" stroke="var(--hair)" stroke-width="1.5" stroke-dasharray="4 3"/>` : '')
      + `<circle cx="158" cy="18" r="8.5" fill="none" stroke="${P.ink}" stroke-width="3" opacity=".9"/>`;
    bg(t, w, h, svg, 16);
    t.querySelectorAll(':scope > div').forEach(x => { x.style.position = 'relative'; x.style.zIndex = 1; });
    // settled hit boxes (UX: targets sit where they will be from the first frame of the swing)
    const hits = mode === 'f2' ? [...t.querySelectorAll('.k-btn, .k-x')].map(b => b.getBoundingClientRect()) : [];
    const str = document.createElement('div'); str.className = 'k-layer';
    str.style.left = '0'; str.style.top = '0'; str.style.width = '390px'; str.style.height = '844px'; str.style.zIndex = 1101;
    const ex = s.x, ey = top + 18;
    str.innerHTML = `<svg width="390" height="844"><path d="M${s.x},${s.y + 12} C${s.x - 6},${s.y + 22} ${ex - 4},${ey - 14} ${ex},${ey - 6}" fill="none" stroke="#7A6A55" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    document.body.appendChild(str);
    let ang = mode === 'f2' ? 6 : mode === 'f3' ? -2 : 0;
    t.style.transformOrigin = '158px 18px';
    t.style.transform = `rotate(${ang}deg)` + (mode === 'f-flip' ? ' perspective(900px) rotateY(68deg)' : '');
    if (ang) str.querySelector('path').setAttribute('d', `M${s.x},${s.y + 12} L${ex},${ey - 6}`);
    hits.forEach(r => { const b = document.createElement('div'); b.className = 'T-hit'; Object.assign(b.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }); document.body.appendChild(b); });
    if (mode === 'f2') anno(top + h + 22, 'drops and swings, 300ms total; dashed = live tap targets, already settled');
    if (mode === 'f3') anno(top + h + 22, 'swings back, settles');
    if (mode === 'f-flip') anno(top + h * 0.5, 'Turn over: the tag turns on its string');
    return ['.T'];
  };

  // ======================================================== 3 CARD FILE
  // The list is a card file. Tapping a place pulls ITS row up out of the file as an index card, in its own slot
  // (Plans order and the stop number stay), and it stands up over the rows below, filling the sheet to the foot.
  // Note before buttons; the buttons sit at the card's foot at one y. A tab on the card's top edge appears only
  // when something is behind it (the long tail: rest of a long note, the full address) — the round-1 side tab, as an index tab.
  // modes: peek | f1 tap row | f2 pulling | f3 standing | closed
  C.file = (P, mode) => {
    select(P);
    movePinTo(P, 195, 280);
    const list = document.getElementById('locationsList');
    const sel = P.shape ? `#locationsList [data-shape-id="${P.shape.id}"]` : `#locationsList .location-card[data-id="${P.id}"]`;
    let row = document.querySelector(sel);
    // the list scrolls so the row's slot is the first one under the header (the slot above scrolls away, order kept)
    const sc = list.closest('#locations') ? (list.scrollHeight > list.clientHeight ? list : list.parentElement) : list;
    const listTop = list.getBoundingClientRect().top;
    if (row) { const dy = row.getBoundingClientRect().top - listTop; sc.scrollTop += dy; }
    if (mode === 'f1') { row.classList.remove('highlighted'); const r = row.getBoundingClientRect(); tapAt(r.left + r.width * .45, r.top + r.height / 2); return ['#locations']; }
    row = document.querySelector(sel);
    const r = row.getBoundingClientRect();
    const stopN = (P.stop || '').match(/Stop (\d+)/);
    const badge = (() => { const b = row.querySelector('.row-badge'); if (b) { const c = b.cloneNode(true); c.style.color = P.ink; return c.outerHTML; } return `<div class="row-badge">${badgeHtml(P.category, P.kind, 24, { ink: P.ink, fill: '#F2EBDD', mark: P.ink })}</div>`; })();
    const card = document.createElement('div'); card.className = 'k F-card';
    const xIcon = `<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;   // "put it back" (a down-into-the-file chevron), not the rows' delete ×
    card.innerHTML = `<div class="F-head">${stopN ? `<span class="num">${stopN[1]}</span>` : badge}<div class="F-name">${esc(P.name)}</div>${meta(P, !!stopN)}<span class="x">${xIcon.replace('M6 15l6-6 6 6', 'M6 9l6 6 6-6')}</span></div>
      <div class="F-body"><div class="k-notes pk"></div></div><div class="F-acts">${acts(P)}</div>`;
    document.body.appendChild(card);
    const folded = peekInto(card.querySelector('.pk'), P, { lines: 6, whole: 7, lh: 24, label: '' });
    const tail = folded || P.address;
    if (tail) { card.insertAdjacentHTML('afterbegin', `<div class="F-tab">${folded ? 'Rest of note' : 'Address'} ›</div>`); }
    // it stands up out of the file: the card's top is the sheet's top (the file's front edge); its tab sticks up over the map
    const sheetTop = document.getElementById('locations').getBoundingClientRect().top;
    let top = sheetTop;
    if (mode === 'f2') top = Math.round((r.top + sheetTop) / 2) + 10;
    card.style.top = top + 'px'; card.style.height = '300px';
    if (mode === 'f2') { const g = document.createElement('div'); g.className = 'F-ghost'; g.style.top = (r.top) + 'px'; g.style.zIndex = 1002; document.body.appendChild(g); card.style.transform = 'rotate(-1.5deg)'; card.style.transformOrigin = '0 0'; anno(top - 4, 'pulled up out of its slot in the file'); }
    if (mode === 'f3') anno(top - 30, 'it stands up out of the file; its tab only when something is behind it');
    if (window.__anno && mode === 'peek' && window.__frameName) { const y = actsY(card); anno(y, `buttons y ${y}`); }
    return ['#locations'];
  };

  // ======================================================== 4 PASSPORT STAMP
  // The card is an entry stamp at the pin. Not visited: the stamp is a printed ghost frame waiting for ink and its
  // foot band is the Mark Visited button. Visited: the frame is inked navy, set at the place's stamp tilt, and the
  // band reads VISITED. The stamp is the visited control, so the action row is only Directions + Star.
  // modes: peek | f1 (ghost) | f2 (stamp coming down, big) | f3 (lands, ink bleeds) | f4 settled
  C.stamp = (P, mode) => {
    select(P);
    map.closePopup();
    const layer = layerFor(P), pp = layer.getPopup();
    Object.assign(pp.options, { autoPan: false, minWidth: 316, maxWidth: 316, className: 'S-pop' });
    movePinTo(P, 195, 480);
    const vis = mode === 'f1' ? false : (mode === 'f2' || mode === 'f3' || mode === 'f4') ? true : !!P.visited;
    const tilt = vis ? Math.max(-3, Math.min(3, stampTilt(String(P.id)) * 0.6)) : 0;
    const html = `<div class="k S ${vis ? 'on' : ''}"><div class="S-stamp" style="--tilt:${tilt}deg">
        <div class="S-top">${badgeHtml(P.category, P.kind, 16, { ink: vis ? 'currentColor' : P.ink, fill: '#F2EBDD', mark: vis ? 'currentColor' : P.ink, rim: 1.5 })}<span>${esc(typeWord(P))}${P.stop ? ` · ${esc(P.stop)}` : ''}</span></div>
        <div class="S-name">${esc(P.name)}</div>
        <div class="S-band">${vis ? stampCheckSvg() + 'Visited' : '<span class="k-ring"></span>Mark visited'}</div></div>
      <div class="S-body"><div class="k-notes pk"></div>${addr1(P)}</div>${acts(P, { noVis: true })}</div>`;
    layer.openPopup(P.shape ? anchorLatLng(P) : undefined);
    pp.setContent(html); pp.update();
    const k = document.querySelector('.S');
    peekInto(k.querySelector('.pk'), P, { lines: 3, whole: 4 });
    if (!P.notes) { const a = k.querySelector('.k-addr1'); if (a) a.style.marginTop = '-4px'; }
    const st = k.querySelector('.S-stamp');
    const w = st.offsetWidth, h = st.offsetHeight, band = k.querySelector('.S-band').offsetTop;
    const ch = 10;
    const oct = (i) => `M${ch + i},${i} H${w - ch - i} L${w - i},${ch + i} V${h - ch - i} L${w - ch - i},${h - i} H${ch + i} L${i},${h - ch - i} V${ch + i} Z`;
    const ink = 'color-mix(in srgb, var(--navy) 82%, transparent)';
    const svg = vis
      ? `<defs><filter id="bleed"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="${mode === 'f3' ? 2.2 : 1.1}"/></filter></defs><g filter="url(#bleed)"><path d="${oct(0.75)}" fill="none" stroke="${ink}" stroke-width="2"/><path d="${oct(5)}" fill="none" stroke="${ink}" stroke-width="1.3" stroke-dasharray="0 3.6" stroke-linecap="round"/><line x1="12" x2="${w - 12}" y1="${band}" y2="${band}" stroke="${ink}" stroke-width="1.3"/></g>`
      : `<path d="${oct(0.75)}" fill="none" stroke="var(--hair)" stroke-width="1.5" stroke-dasharray="5 4"/><line x1="12" x2="${w - 12}" y1="${band}" y2="${band}" stroke="var(--hair)" stroke-width="1.2" stroke-dasharray="5 4"/>`;
    bg(st, w, h, svg, 6);
    { pp._updateLayout(); pp._updatePosition(); }
    const r = document.querySelector('.leaflet-popup').getBoundingClientRect();
    if (r.top < 84) map.panBy([0, -(84 - r.top)], { animate: false });
    if (mode === 'f1') { const b = k.querySelector('.S-band').getBoundingClientRect(); tapAt(b.left + b.width / 2, b.top + b.height / 2); }
    if (mode === 'f2') { st.style.transform = `rotate(${tilt - 4}deg) scale(1.14)`; st.style.opacity = '.55'; st.style.filter = 'blur(.4px)'; anno(st.getBoundingClientRect().top - 4, 'the stamp comes down (grow)'); }
    if (mode === 'f3') { st.style.transform = `rotate(${tilt}deg) scale(.96)`; anno(st.getBoundingClientRect().top - 4, 'lands (shrink), ink bleeds in'); }
    if (mode === 'f4') anno(st.getBoundingClientRect().top - 4, 'settled: the same stamp as the list row');
    return ['.leaflet-popup'];
  };

  // ======================================================== 5 POSTCARD
  // The list sheet becomes the back of a postcard. Left: the message (your note). Right: the postage stamp (the pin's
  // own seal on a perforated stamp), Mark Visited under it, and the address flowing across ruled address lines.
  // Visited is the postmark: the row stamp struck across the stamp, with Passport Stamp's stamp-down motion.
  // Content-sized (max 300), bottom-anchored. A close ×, not a back link (no iOS back-swipe invitation).
  // modes: peek | f1 | f2 | pm1..pm4 (postmark strike) | targets
  C.post = (P, mode) => {
    select(P);
    movePinTo(P, 195, 280);
    if (mode === 'f1') { const s = pinScreen(P); tapAt(s.x, s.y); return ['body']; }
    const pmMode = /^pm[2-4]$/.test(mode);
    const vis = pmMode ? true : (mode === 'pm1' ? false : !!P.visited);
    const el = document.createElement('div'); el.className = 'k P-sheet';
    el.innerHTML = `<span class="P-x">×</span><div class="P-card">
        <div class="P-head"><div class="P-name">${esc(P.name)}</div>${meta(P)}</div>
        <div class="P-msg"><div class="k-notes pk"></div></div>
        <div class="P-rule"></div>
        <div class="P-right">
          <div class="P-stamp"></div>
          ${vis ? `<div class="P-mark">${rowStamp(P.id, -14)}</div><div class="P-markgap"></div>` : `<div class="P-markhint"><span class="k-ring"></span>Mark visited</div>`}
          ${P.address ? `<div class="P-addr">${esc(P.address)}</div>` : ''}
        </div>
      </div>
      <div class="P-acts">${acts(P, { noVis: true })}</div>`;
    document.body.appendChild(el);
    if (!P.notes && !P.address) el.querySelector('.P-rule').style.visibility = 'hidden';
    // the postage stamp: white stamp paper with a scalloped perforated edge and a soft shadow, a field tinted with
    // the category ink, and the pin's seal at 40px
    const ps = el.querySelector('.P-stamp'); const W2 = 64, H2 = 76, r = 2.6, step = 7;
    let perf = ''; for (let x = step / 2 + 0.5; x < W2; x += step) perf += `<circle cx="${x}" cy="0" r="${r}"/><circle cx="${x}" cy="${H2}" r="${r}"/>`;
    for (let y = step / 2 + 0.5; y < H2; y += step) perf += `<circle cx="0" cy="${y}" r="${r}"/><circle cx="${W2}" cy="${y}" r="${r}"/>`;
    ps.innerHTML = `<svg width="${W2 + 16}" height="${H2 + 16}" viewBox="-8 -8 ${W2 + 16} ${H2 + 16}" style="position:absolute;left:-8px;top:-8px"><defs>${SHADOW}<mask id="perf"><rect x="-8" y="-8" width="${W2 + 16}" height="${H2 + 16}" fill="#fff"/><g fill="#000">${perf}</g></mask></defs>`
      + `<g filter="url(#kshadow)"><rect x="0" y="0" width="${W2}" height="${H2}" fill="#FFFDF8" mask="url(#perf)"/></g>`
      + `<rect x="6" y="6" width="${W2 - 12}" height="${H2 - 12}" fill="${P.ink}" fill-opacity=".14" stroke="${P.ink}" stroke-width="1.25"/></svg>${seal(P, 40)}`;
    peekInto(el.querySelector('.pk'), P, { lines: 6, whole: 7 });
    sheetSwap(el);
    const mk = el.querySelector('.P-mark .row-stamp');
    if (mode === 'f2') {
      const sp = ps.getBoundingClientRect(), s = pinScreen(P);
      ps.querySelector('.seal').style.visibility = 'hidden';
      const fly = document.createElement('div'); fly.className = 'k k-layer'; fly.innerHTML = seal(P, 40);
      fly.style.left = ((s.x + sp.left + 32) / 2 - 20 + 40) + 'px'; fly.style.top = ((s.y + sp.top + 38) / 2 - 20) + 'px'; fly.style.transform = 'scale(1.3) rotate(10deg)'; fly.style.filter = 'drop-shadow(0 3px 4px rgba(26,26,24,.18))';
      document.body.appendChild(fly); el.style.transform = 'translateY(70px)';
      anno(sp.top + 70 - 4, 'the pin’s seal flies to the stamp corner');
    }
    const mr = () => el.querySelector('.P-right').getBoundingClientRect();
    if (mode === 'pm1') { const h = el.querySelector('.P-markhint').getBoundingClientRect(), r2 = mr(); tapAt(h.left + 40, h.top + 10);
      const b = document.createElement('div'); b.className = 'P-tgt'; Object.assign(b.style, { left: r2.left + 'px', top: (ps.getBoundingClientRect().top - 4) + 'px', width: r2.width + 'px', height: (h.bottom - ps.getBoundingClientRect().top + 8) + 'px' }); document.body.appendChild(b);
      anno(r2.top - 4, 'tap target: stamp + Mark visited (never the address)'); }
    if (mode === 'pm2') { mk.style.transform = 'rotate(-20deg) scale(1.5)'; mk.style.opacity = '.35'; mk.style.filter = 'blur(.6px)'; anno(mr().top - 4, 'the postmark comes down (grow, faint)'); }
    if (mode === 'pm3') { mk.style.transform = 'rotate(-14deg) scale(.94)'; mk.style.filter = 'blur(.35px)'; anno(mr().top - 4, 'lands (shrink), ink bleeds in'); }
    if (mode === 'pm4') anno(mr().top - 4, 'settled: the same stamp as the list row');
    return ['.P-sheet'];
  };

  // ======================================================== 6 PINNED NOTE
  // The pin is a pushpin holding your field note to the map. The scrap's top-left corner sits under the pin, so the
  // pin itself is the card's leading mark (it lives in the card's glyph column). The note is typed (field notes).
  // A long note fades under a folded corner; it scrolls inside, so the buttons never move.
  // modes: peek | f1 tap | f2 (the scrap slides out from under the pin) | f3 settled | open (scrolled)
  C.note = (P, mode) => {
    select(P);
    movePinTo(P, 46, 152);
    if (mode === 'f1') { const s = pinScreen(P); tapAt(s.x, s.y); return ['body']; }
    const s = pinScreen(P);
    const n = document.createElement('div'); n.className = 'k N';
    n.innerHTML = `<div class="N-in"><div class="N-name">${esc(P.name)}</div>${meta(P, !!P.stop || !!P.shape)}${P.notes ? `<div class="N-note">${esc(P.notes)}</div>` : ''}<div class="N-tail"></div>${acts(P)}</div><div style="height:4px"></div>`;
    document.body.appendChild(n);
    const note = n.querySelector('.N-note');
    let folded = false;
    if (note && note.getBoundingClientRect().height > 20 * 5 + 2) { folded = true; if (mode !== 'open') note.classList.add('fold'); }
    const tail = n.querySelector('.N-tail');
    if (folded && mode !== 'open') tail.outerHTML = `<div class="N-more"><span class="k-more">More ⌄</span></div>`;
    else if (P.address) tail.outerHTML = `<div style="margin-top:4px">${addr1(P)}</div>`;
    else tail.remove();
    if (mode === 'open') { note.style.maxHeight = (20 * 5) + 'px'; note.style.overflow = 'hidden'; note.scrollTop = 0; note.style.webkitMaskImage = 'linear-gradient(transparent, #000 14px, #000 85%, transparent)';
      note.innerHTML = esc(P.notes).split('\n').join('\n'); note.style.transform = ''; const inner = document.createElement('div'); inner.innerHTML = note.innerHTML; note.innerHTML = ''; note.appendChild(inner); inner.style.marginTop = '-60px'; }
    n.style.left = (s.x - 26) + 'px'; n.style.top = (s.y - 26) + 'px';
    const w = 358, h = n.getBoundingClientRect().height;
    const fold = 18;
    const d = folded && mode !== 'open' ? `M0,0 H${w} V${h - fold} L${w - fold},${h} H0 Z` : `M0,0 H${w} V${h} H0 Z`;
    let svg = `<defs>${SHADOW}</defs><path d="${d}" fill="var(--paper-raised)" filter="url(#kshadow)"/>`;
    if (folded && mode !== 'open') svg += `<path d="M${w},${h - fold} L${w - fold},${h - fold} L${w - fold},${h} Z" fill="#E6DECD"/>`;
    bg(n, w, h, svg, 16);
    n.querySelectorAll(':scope > div').forEach(x => { x.style.position = 'relative'; x.style.zIndex = 1; });
    const tilt = mode === 'f2' ? -5 : -0.8;
    n.style.setProperty('--tilt', tilt + 'deg');
    if (mode === 'f2') { n.style.clipPath = `polygon(0 0, 100% 0, 100% 46%, 0 46%)`; n.style.transform = `rotate(${tilt}deg) translate(-40px,-30px) scale(.86)`; anno(s.y + 120, 'the note slides out from under the pin'); }
    if (mode === 'f3') anno(s.y + 140, 'settled, pinned at its corner');
    pinOnTop(P);
    if (mode === 'open') anno(note.getBoundingClientRect().top + 50, 'More: the note scrolls inside; buttons stay');
    return ['.N', '.k-pincopy'];
  };

  function close() {
    document.querySelectorAll('.k:not(.k-base), .k-anno, .k-tap, .k-layer, .k-pincopy').forEach(e => e.remove());
    map.closePopup();
    try { setHighlighted(null); } catch (e) {}
    const loc = document.getElementById('locations'); loc.style.visibility = ''; loc.classList.remove('collapsed');
    document.getElementById('mainContent').style.height = ''; map.invalidateSize({ pan: false });
    const l = document.getElementById('locationsList'); [l, l.parentElement].forEach(e => { e.scrollTop = 0; });   // the list as left
  }

  window.K = {
    css() { if (!document.getElementById('k-css')) { const s = document.createElement('style'); s.id = 'k-css'; s.textContent = CSS; document.head.appendChild(s); } },
    show(concept, state, mode) { this.css(); basemap(); if (mode === 'signedout') { document.body.classList.add('k-so'); mode = 'peek'; } const P = place(state); return C[concept](P, mode || 'peek'); },
    closed(concept, state) { this.css(); basemap(); const P = place(state); C[concept](P, 'peek'); close(); movePinTo(P, 195, 280); return ['body']; },
  };
})();
