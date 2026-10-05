// Page-side code for the Round 1 popup concepts. Injected into the REAL app
// (index.html, unmodified, loaded in the gesture harness by render.js) after
// a place is set up. It reuses the app's own tokens (--paper, --ink, --s*,
// --figure-deep, --navy ...), its glyph sprite (#g-*), its row badge
// (copied from the list row, so map / list / card share one icon treatment),
// its row stamp (.row-stamp) and its check path. Nothing here edits the app.
(() => {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ic = (id, cls = '') => `<svg class="k-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#g-${id}"/></svg>`;
  const checkIc = (cls = '') => `<svg class="k-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${STICKER_CHECK.row.d}" fill="currentColor"/></svg>`;
  const stamp = id => `<span class="row-stamp" style="--stamp-tilt:${stampTilt(String(id))}deg" aria-hidden="true"><span class="row-stamp-ring">${stampCheckSvg()}<span class="row-stamp-word">Visited</span></span></span>`;

  // ---------------------------------------------------------------- CSS
  const CSS = `
  /* stand-in basemap (tiles are blocked in the sandbox): same re-tone filter as .leaflet-tile-pane */
  .leaflet-tile-pane { visibility: hidden; }
  .k-base { position: absolute; inset: 0; z-index: 0; pointer-events: none; filter: sepia(0.3) saturate(0.75) contrast(0.96) hue-rotate(-6deg); }
  .k-base svg { width: 100%; height: 100%; display: block; }

  .k { font-family: var(--font-ui); color: var(--ink); -webkit-font-smoothing: antialiased; text-align: left; }
  .k .row-badge { flex: none; }
  .k-eye { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .k-name { font-size: 18px; line-height: 24px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink); }
  .k-ic.k-mstar { width: 16px; height: 16px; display: inline-block; vertical-align: -2px; margin-right: var(--s1); color: var(--ink); }
  .k-notes { font-size: 14px; line-height: 20px; color: var(--ink); white-space: pre-line; }
  .k-addr { font-size: 12px; line-height: 16px; color: var(--ink-2); }
  .k-lab { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--ink-2); }
  .k-ic { width: 16px; height: 16px; display: block; flex: none; }

  /* the text button: the shipped Get Directions / Mark Visited voice, 44px target */
  .k-btn { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0; border: 0; background: none; font-family: var(--font-ui);
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--ink-2);
           text-decoration: none; white-space: nowrap; cursor: pointer; }
  .leaflet-container a.k-btn.dir, .k-btn.dir { color: var(--figure-deep); }
  .k-btn.on { color: var(--ink); }
  .k-ring { width: 14px; height: 14px; margin: 1px; border-radius: 50%; box-shadow: inset 0 0 0 1.33px currentColor; flex: none; }
  .k-btn .row-stamp { margin: 0 -2px; }
  .k-acts { display: flex; align-items: center; justify-content: space-between; }
  .k-acts .k-right { display: flex; align-items: center; gap: var(--s4); }

  /* Leaflet popup chassis for the popup concepts */
  .k-pop .leaflet-popup-content-wrapper { padding: 0; border-radius: 2px; }
  .k-pop .leaflet-popup-content { margin: 0; }
  .k-pop a.leaflet-popup-close-button { width: 44px; height: 44px; font: 400 22px/44px var(--font-ui); top: 0; right: 0; text-align: center; }
  .k-pop.k-quiet .leaflet-popup-content-wrapper, .k-pop.k-quiet .leaflet-popup-tip { box-shadow: none; }
  .k-pop.k-lift .leaflet-popup-content-wrapper { box-shadow: 0 1px 2px rgba(26,26,24,.10), 0 6px 16px rgba(26,26,24,.08); }

  /* ===== 1 Quiet Fix ===== */
  .c1 { padding: var(--s3) var(--s3) 0; }
  .c1 .hd { display: grid; grid-template-columns: var(--col-glyph) 1fr; column-gap: var(--s3); align-items: center; padding-right: var(--s6); }
  .c1 .bd { margin-left: calc(var(--col-glyph) + var(--s3)); }
  .c1 .k-notes { margin-top: var(--s2); }
  .c1 .k-addr { margin-top: var(--s2); }
  .c1 .k-acts { margin-top: var(--s1); }
  .c1 .k-btn.dir { padding-left: 6px; }       /* compass centred on the 28px glyph column */
  .c1 .k-btn.dir .k-ic { margin-right: 12px; }  /* word starts on the content column (28 + 12) */

  /* ===== 2 Folded Note ===== */
  .c2 { padding: var(--s3) var(--s3) 0; }
  .c2 .hd { display: grid; grid-template-columns: var(--col-glyph) 1fr; column-gap: var(--s3); align-items: center; padding-right: var(--s6); }
  .c2 .bd { margin-left: calc(var(--col-glyph) + var(--s3)); }
  .c2 .fold { position: relative; margin-top: var(--s2); }
  .c2 .fold .k-notes { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .c2 .fold .more { position: absolute; right: 0; bottom: 0; padding-left: var(--s8); background: linear-gradient(90deg, transparent, var(--paper) 40%); }
  .c2 .fold .more span { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 20px; letter-spacing: .1em; color: var(--figure-deep); }
  .c2.open .fold .k-notes { display: block; }
  .c2 .k-lab { margin-top: var(--s3); }
  .c2 .k-addr { margin-top: var(--s1); }
  .c2 .less { display: block; margin-top: var(--s2); font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--figure-deep); }
  .c2 .k-acts { margin-top: var(--s1); }
  .c2 .k-btn.dir { padding-left: 6px; }
  .c2 .k-btn.dir .k-ic { margin-right: 12px; }

  /* ===== 3 Place Sheet ===== */
  .c3sheet { position: absolute; left: 0; right: 0; bottom: 0; background: var(--paper); z-index: 1001; display: flex; flex-direction: column;
             box-shadow: 0 -1px 0 var(--hair), 0 -4px 12px rgba(26,26,24,.06); }
  .c3sheet .hd { display: grid; grid-template-columns: var(--col-glyph) 1fr 44px; column-gap: var(--s3); align-items: center; min-height: 60px;
                 padding: var(--s2) 0 var(--s2) var(--gutter); border-bottom: 1px solid var(--hair); }
  .c3sheet .hd .k-name { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .c3sheet.tall .hd .k-name { white-space: normal; }
  .c3sheet .x { width: 44px; height: 44px; border: 0; background: none; font: 400 22px/44px var(--font-ui); color: var(--ink-2); }
  .c3sheet .strip { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--hair); }
  .c3sheet .strip .k-btn { justify-content: center; min-height: 52px; gap: 6px; }
  .c3sheet .strip .k-btn .k-ic { width: 18px; height: 18px; }
  .c3sheet .strip .k-btn .k-ring { width: 16px; height: 16px; }
  .c3sheet .bd { padding: var(--s3) var(--gutter) var(--s4) calc(var(--gutter) + var(--col-glyph) + var(--s3)); overflow: hidden; flex: 1; }
  .c3sheet:not(.tall) .k-notes { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .c3sheet .strip:last-child { border-bottom: 0; padding-bottom: var(--s4); }
  .c3sheet .k-addr { margin-top: var(--s3); }
  .c3sheet .k-lab { margin-top: var(--s4); }
  .c3sheet .k-lab + .k-addr { margin-top: var(--s1); }
  .c3sheet .grab { position: absolute; top: 6px; left: 50%; width: 36px; height: 4px; margin-left: -18px; border-radius: 2px; background: var(--hair); }

  /* ===== 4 Row Unfolds ===== */
  .c4flag { position: absolute; z-index: 700; transform: translate(-50%, -100%); pointer-events: none; }
  .c4flag .t { background: var(--paper); border: 1px solid var(--hair); border-radius: 2px; padding: 6px var(--s2); font: 600 13px/16px var(--font-ui); color: var(--ink); white-space: nowrap; max-width: 220px; overflow: hidden; text-overflow: ellipsis;
               box-shadow: 0 1px 2px rgba(26,26,24,.10); }
  .c4flag .tip { width: 8px; height: 8px; background: var(--paper); border-right: 1px solid var(--hair); border-bottom: 1px solid var(--hair); transform: rotate(45deg); margin: -5px auto 0; }
  .c4unfold { background: var(--paper); border-bottom: 1px solid var(--hair); padding: var(--s2) var(--gutter) 0 var(--c4x, 56px); }
  .c4unfold .k-notes { padding-top: var(--s1); }
  .c4unfold .k-addr { margin-top: var(--s2); }
  .c4unfold .k-acts { justify-content: flex-start; gap: var(--s6); margin-top: var(--s1); }
  .c4unfold .k-acts .k-btn.dir { margin-left: -22px; }   /* compass hangs in the gutter so the word starts on the text column */

  /* ===== 5 Side Tab ===== */
  .c5 { padding: var(--s3) var(--s3) 0; position: relative; }
  .c5 .hd { display: grid; grid-template-columns: var(--col-glyph) 1fr; column-gap: var(--s3); align-items: center; padding-right: var(--s6); }
  .c5 .k-acts { margin-top: var(--s1); }
  .c5 .k-btn.dir { padding-left: 6px; }
  .c5 .k-btn.dir .k-ic { margin-right: 12px; }
  .c5 .k-right { gap: var(--s2) !important; }
  .c5 .ibtn { width: 44px; justify-content: center; }
  .c5 .ibtn .k-ic { width: 18px; height: 18px; }
  .c5tab { position: absolute; top: var(--s3); right: -25px; width: 24px; height: 76px; background: var(--paper); border: 1px solid var(--hair); border-left: 0; border-radius: 0 2px 2px 0;
           display: flex; align-items: center; justify-content: center; }
  .c5tab span { writing-mode: vertical-rl; font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; letter-spacing: .14em; color: var(--ink-2); }
  .c5drawer { position: absolute; top: 76px; bottom: 300px; right: 0; width: 318px; z-index: 900; background: var(--paper); border: 1px solid var(--hair); border-right: 0; border-radius: 2px 0 0 2px;
              box-shadow: -2px 0 12px rgba(26,26,24,.08); display: flex; flex-direction: column; }
  .c5drawer .in { padding: var(--s3) var(--gutter) 0 var(--s3); overflow: hidden; }
  .c5drawer .hd { display: grid; grid-template-columns: var(--col-glyph) 1fr; column-gap: var(--s3); align-items: center; padding-right: var(--s6); }
  .c5drawer .bd { margin-left: calc(var(--col-glyph) + var(--s3)); }
  .c5drawer .k-notes { margin-top: var(--s3); }
  .c5drawer .k-lab { margin-top: var(--s4); }
  .c5drawer .k-addr { margin-top: var(--s1); }
  .c5drawer .k-acts { margin-top: var(--s1); }
  .c5drawer .k-btn.dir { padding-left: 6px; }
  .c5drawer .k-btn.dir .k-ic { margin-right: 12px; }
  .c5drawer .x { position: absolute; top: 0; right: 0; width: 44px; height: 44px; font: 400 22px/44px var(--font-ui); color: var(--ink-2); text-align: center; }
  .c5drawer .c5tab { left: -25px; right: auto; border: 1px solid var(--hair); border-right: 0; border-radius: 2px 0 0 2px; top: var(--s3); }

  /* ===== 6 Map Label + Dock ===== */
  .c6label { position: absolute; z-index: 700; pointer-events: none; max-width: 190px;
             text-shadow: 0 0 2px var(--paper), 0 0 2px var(--paper), 0 0 3px var(--paper), 0 0 4px var(--paper), 0 0 6px var(--paper); }
  .c6label .k-name { font-size: 15px; line-height: 20px; }
  .c6label .k-mstar { width: 14px; height: 14px; }
  .c6dock { position: absolute; left: var(--s2); right: var(--s2); bottom: calc(300px + var(--s2)); z-index: 900; background: var(--paper); border: 1px solid var(--hair); border-radius: 2px;
            box-shadow: 0 1px 2px rgba(26,26,24,.10), 0 6px 16px rgba(26,26,24,.08); padding: var(--s3) var(--s3) 0 var(--s4); }
  .c6dock .x { position: absolute; top: 0; right: 0; width: 44px; height: 44px; font: 400 22px/44px var(--font-ui); color: var(--ink-2); text-align: center; }
  .c6dock .k-notes { padding-right: var(--s8); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .c6dock.open .k-notes { display: block; }
  .c6dock .k-lab { margin-top: var(--s3); }
  .c6dock .k-addr { margin-top: var(--s1); }
  .c6dock .k-acts { margin-top: var(--s1); }
  .c6dock .handle { position: absolute; top: -1px; left: 50%; width: 36px; height: 4px; margin: 6px 0 0 -18px; border-radius: 2px; background: var(--hair); }
  .c6dock.solo { padding-top: 0; }

  /* ===== 7 Action Rail ===== */
  .c7 { display: grid; grid-template-columns: 1fr 64px; }
  .c7 .main { padding: var(--s3) var(--s3) var(--s3) var(--s3); min-width: 0; }
  .c7 .hd { display: grid; grid-template-columns: var(--col-glyph) 1fr; column-gap: var(--s3); align-items: center; }
  .c7 .bd { margin-left: calc(var(--col-glyph) + var(--s3)); }
  .c7 .k-notes { margin-top: var(--s2); }
  .c7 .where { margin-top: var(--s2); }
  .c7 .where .k-addr { color: var(--ink-2); }
  .c7 .where .exp { margin-top: var(--s1); font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--ink-2); white-space: nowrap; }
  .c7 .rail { background: var(--paper-filed); display: flex; flex-direction: column; padding-top: 40px; }
  .c7 .rail .k-btn { flex-direction: column; gap: 4px; min-height: 56px; justify-content: center; font-size: 9px; line-height: 10px; letter-spacing: .08em; }
  .c7 .rail .k-btn .k-ic { width: 20px; height: 20px; }
  .c7 .rail .k-ring { width: 18px; height: 18px; }
  .c7 .rail .vis-on { width: 20px; height: 20px; border-radius: 50%; background: #3A4C5B; color: #FAF5EA;   /* the map sticker: STICKER.INK face, STICKER.FACE check */ display: flex; align-items: center; justify-content: center; }
  .c7 .rail .vis-on .k-ic { width: 11px; height: 11px; }
  .c7 .rail .k-btn.on.vis { color: #3A4C5B; }

  /* ===== 8 Luggage Label ===== */
  .c8 .band { background: var(--figure-deep); color: var(--paper); padding: var(--s3) var(--s8) var(--s3) var(--s3); display: grid; grid-template-columns: 32px 1fr; column-gap: var(--s3); align-items: center; }
  .c8 .band .seal { width: 32px; height: 32px; }
  .c8 .band .k-eye { color: var(--paper-warm); }
  .c8 .band .nm { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 22px; line-height: 24px; letter-spacing: .03em; color: var(--paper); }
  .c8 .band .k-mstar { color: var(--paper); width: 16px; height: 16px; vertical-align: 0; }
  .c8 .body { padding: var(--s3) var(--s3) 0 calc(var(--s3) + 32px + var(--s3)); position: relative; }
  .c8 .k-addr { margin-top: var(--s2); }
  .c8 .k-acts { margin-top: var(--s1); margin-left: calc(-32px - var(--s3)); }
  .c8 .k-btn.dir { padding-left: 8px; }
  .c8 .k-btn.dir .k-ic { margin-right: 8px; }
  .c8 .stampon { position: absolute; right: var(--s2); top: -18px; }
  .c8 .stampon .row-stamp { color: var(--navy); }
  .k-pop.k-lug a.leaflet-popup-close-button { color: var(--paper) !important; }
  .k-pop.k-lug .leaflet-popup-content-wrapper { border-color: var(--figure-deep); }
  `;

  // ---------------------------------------------------------------- data
  const PLACE = {
    busiest: { locality: 'Vesterbro, Copenhagen', street: 'Rejsbygade · Vesterbro' },
  };

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
      const it = shapeRowItem(s);
      P = { ...it, shape: s, ink: s.color || categoryInk(s.type), kind: 'diamond', stop: planStopLine('shape', s.id) };
    } else {
      const id = window.__placeId;
      const l = locations.find(x => x.id === id);
      P = { ...l, ink: categoryInk(l.category), kind: markerKind(l), stop: planStopLine('loc', l.id) };
    }
    P.badge = rowBadgeFor(P);
    Object.assign(P, PLACE[state.replace(/-.*/, '')] || {});
    return P;
  }

  // ---------------------------------------------------------------- shared parts
  const eyebrow = P => `<div class="k-eye">${esc(P.category)}${P.stop ? ` · ${esc(P.stop)}` : ''}</div>`;
  const nameH = (P, cls = 'k-name') => `<div class="${cls}">${P.starred ? ic('star', 'k-mstar') : ''}${esc(P.name)}</div>`;
  const head = P => `<div class="hd">${P.badge}<div>${eyebrow(P)}${nameH(P)}</div></div>`;
  const dirBtn = (label = 'Directions') => `<a class="k-btn dir" href="#">${ic('compass')}${label}</a>`;
  const starBtn = (P, icon = false) => icon
    ? `<button class="k-btn ibtn ${P.starred ? 'on' : ''}" aria-label="Star">${ic(P.starred ? 'star' : 'star-open')}</button>`
    : `<button class="k-btn ${P.starred ? 'on' : ''}">${ic(P.starred ? 'star' : 'star-open')}${P.starred ? 'Starred' : 'Star'}</button>`;
  const visBtn = P => P.visited ? `<button class="k-btn on" aria-label="Visited">${stamp(P.id)}</button>` : `<button class="k-btn"><span class="k-ring"></span>Mark visited</button>`;
  const acts = (P, o = {}) => `<div class="k-acts">${dirBtn(o.dirLabel)}<div class="k-right">${starBtn(P, o.iconStar)}${visBtn(P)}</div></div>`;
  const notes = P => P.notes ? `<div class="k-notes">${esc(P.notes)}</div>` : '';
  const addr = P => P.address ? `<div class="k-addr">${esc(P.address)}</div>` : '';

  // ---------------------------------------------------------------- map helpers
  const mapRect = () => document.getElementById('map').getBoundingClientRect();
  function anchorLatLng(P) { if (P.shape) { const a = shapeAnchor(P.shape) || [P.lat, P.lng]; return L.latLng(a[0], a[1]); } return L.latLng(P.lat, P.lng); }
  function pinScreen(P) { const p = map.latLngToContainerPoint(anchorLatLng(P)); const r = mapRect(); return { x: r.left + p.x, y: r.top + p.y }; }
  function movePinTo(P, x, y) { const s = pinScreen(P); map.panBy([s.x - x, s.y - y], { animate: false }); }
  function layerFor(P) { return P.shape ? neighborhoodLayersById.get(P.shape.id) : markersById.get(P.id).marker; }
  function select(P) { try { setHighlighted(P.shape ? shapeKey(P.shape.id) : P.id); } catch (e) {} }

  function openPopup(P, html, width, cls) {
    map.closePopup();
    const layer = layerFor(P);
    const pp = layer.getPopup();
    Object.assign(pp.options, { autoPan: false, minWidth: width, maxWidth: width, className: 'k-pop ' + cls });
    if (pp._container) pp._container.className = pp._container.className.replace(/\bk-pop[^]*$/, '') + ' k-pop ' + cls;
    layer.openPopup(P.shape ? anchorLatLng(P) : undefined);
    pp.setContent(html); pp.update();
    // keep the popup clear of the top controls and the sheet
    const r = document.querySelector('.leaflet-popup').getBoundingClientRect();
    const s = pinScreen(P);
    let dy = 0; if (r.top < 84) dy = 84 - r.top;
    if (s.y + dy > 520) dy = 520 - s.y;
    map.panBy([0, -dy], { animate: false });
    return '.leaflet-popup';
  }

  // ---------------------------------------------------------------- basemap
  function basemap() {
    if (document.querySelector('.k-base')) return;
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const W = 390, H = 844;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><rect width="${W}" height="${H}" fill="#F0ECE3"/>`;
    // harbour water, upper left + a park
    s += `<path d="M0 0H170C150 40 120 60 96 96C70 132 40 150 0 160Z" fill="#AAD3DF"/>`;
    s += `<path d="M262 330L346 318L360 396L276 412Z" fill="#CDE6B8"/>`;
    s += `<g transform="rotate(-14 195 300)">`;
    // building blocks between a loose grid
    const xs = [-80, -10, 52, 118, 176, 240, 300, 366, 430], ys = [-60, 20, 92, 160, 236, 300, 372, 444, 520, 600, 680, 760, 840];
    for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
      const x0 = xs[i] + 7, x1 = xs[i + 1] - 7, y0 = ys[j] + 7, y1 = ys[j + 1] - 7;
      const n = 1 + Math.floor(rnd() * 3);
      for (let k = 0; k < n; k++) {
        const bx = x0 + (x1 - x0) * k / n + 2, bw = (x1 - x0) / n - 4;
        s += `<rect x="${bx.toFixed(1)}" y="${(y0 + 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${(y1 - y0 - 4 - rnd() * 10).toFixed(1)}" fill="#E0D8CD" stroke="#D3C9BB" stroke-width=".6"/>`;
      }
    }
    for (const x of xs) s += `<line x1="${x}" y1="-200" x2="${x}" y2="1100" stroke="#D9D1C4" stroke-width="9"/><line x1="${x}" y1="-200" x2="${x}" y2="1100" stroke="#FFFFFF" stroke-width="7"/>`;
    for (const y of ys) s += `<line x1="-200" y1="${y}" x2="700" y2="${y}" stroke="#D9D1C4" stroke-width="9"/><line x1="-200" y1="${y}" x2="700" y2="${y}" stroke="#FFFFFF" stroke-width="7"/>`;
    s += `<line x1="-200" y1="236" x2="700" y2="236" stroke="#E8C98F" stroke-width="13"/><line x1="-200" y1="236" x2="700" y2="236" stroke="#F8E3B5" stroke-width="11"/>`;
    s += `</g>`;
    s += `<path d="M-20 470C80 430 160 470 240 440S360 380 420 400" fill="none" stroke="#D9D1C4" stroke-width="10"/><path d="M-20 470C80 430 160 470 240 440S360 380 420 400" fill="none" stroke="#fff" stroke-width="8"/>`;
    const lab = (x, y, a, t) => `<text x="${x}" y="${y}" transform="rotate(${a} ${x} ${y})" font-family="Archivo, sans-serif" font-size="9" fill="#857C70" letter-spacing=".3">${t}</text>`;
    s += lab(30, 300, -14, 'Hverfisgata') + lab(214, 196, 76, 'Frakkastígur') + lab(250, 268, -14, 'Laugavegur') + lab(96, 520, -14, 'Grettisgata') + lab(30, 120, -40, 'Gamla höfnin');
    s += `</svg>`;
    const d = document.createElement('div'); d.className = 'k-base'; d.innerHTML = s;
    document.getElementById('map').prepend(d);
  }

  // ---------------------------------------------------------------- concepts
  const C = {};

  // 1. QUIET FIX -- same popup, hierarchy + spacing only.
  C.quiet = (P, st) => {
    const html = `<div class="k c1">${head(P)}<div class="bd">${notes(P)}${addr(P)}</div>${acts(P)}</div>`;
    return openPopup(P, html, 300, 'k-quiet');
  };

  // 2. FOLDED NOTE -- peek (2 lines of notes, no address) -> unfolds upward in place.
  C.fold = (P, st) => {
    const open = st.endsWith('-x');
    const hasMore = P.notes || P.address;
    const body = !hasMore ? '' : open
      ? `<div class="fold">${notes(P)}</div>${P.address ? `<div class="k-lab">Address</div>${addr(P)}` : ''}<span class="less">Less</span>`
      : `<div class="fold">${P.notes ? notes(P) : `<div class="k-notes" style="color:var(--ink-2)">${esc(P.street || '')}</div>`}<div class="more"><span>More</span></div></div>`;
    const html = `<div class="k c2 ${open ? 'open' : ''}">${head(P)}<div class="bd">${body}</div>${acts(P)}</div>`;
    return openPopup(P, html, 300, 'k-quiet');
  };

  // 3. PLACE SHEET -- the place takes the list sheet's slot; the map stays clear.
  C.sheet = (P, st) => {
    const tall = st.endsWith('-x');
    map.closePopup(); select(P);
    document.getElementById('locations').style.visibility = 'hidden';
    const h = tall ? 600 : 300;
    const el = document.createElement('div'); el.className = 'k c3sheet' + (tall ? ' tall' : ''); el.style.maxHeight = h + 'px';
    el.innerHTML = `${P.notes || P.address ? '<span class="grab"></span>' : ''}<div class="hd">${P.badge}<div style="min-width:0">${eyebrow(P)}${nameH(P)}</div><button class="x" aria-label="Close">×</button></div>
      <div class="strip">${dirBtn()}${starBtn(P)}${P.visited ? `<button class="k-btn on">${stamp(P.id)}</button>` : `<button class="k-btn"><span class="k-ring"></span>Mark visited</button>`}</div>
      ${P.notes || P.address ? `<div class="bd">${notes(P)}${tall && P.address ? `<div class="k-lab">Address</div>${addr(P)}` : ''}</div>` : ''}`;
    document.body.appendChild(el);
    const top = el.getBoundingClientRect().top;
    document.getElementById('mainContent').style.height = top + 'px'; map.invalidateSize({ pan: false });   // the map meets the place sheet, as it meets the list sheet
    movePinTo(P, 195, Math.max(150, (top + 76) / 2));
    return '.c3sheet';
  };

  // 4. ROW UNFOLDS -- the list row is the card; the map keeps a name flag.
  C.row = (P, st) => {
    map.closePopup(); select(P);
    const loc = document.getElementById('locations'); loc.style.height = '480px';
    movePinTo(P, 195, 210);
    const sel = P.shape ? `#locationsList [data-shape-id="${P.shape.id}"]` : `#locationsList .location-card[data-id="${P.id}"]`;
    const row = document.querySelector(sel);
    row.classList.add('highlighted');
    const h3 = row.querySelector('h3').getBoundingClientRect(), rr = row.getBoundingClientRect();
    const u = document.createElement('div'); u.className = 'k c4unfold';
    u.style.setProperty('--c4x', (h3.left - rr.left) + 'px');
    u.innerHTML = `${notes(P)}${addr(P)}<div class="k-acts">${dirBtn()}${starBtn(P)}${visBtn(P)}</div>`;
    row.after(u);
    const list = document.getElementById('locationsList');
    list.scrollTop += row.getBoundingClientRect().top - list.getBoundingClientRect().top;
    const s = pinScreen(P);
    const f = document.createElement('div'); f.className = 'k c4flag';
    f.style.left = s.x + 'px'; f.style.top = (s.y - (P.shape ? 4 : 20)) + 'px';
    f.innerHTML = `<div class="t">${esc(P.name)}</div><div class="tip"></div>`;
    document.body.appendChild(f);
    return ['.c4flag', '#locations'];
  };

  // 5. SIDE TAB -- glance + actions on the map; notes/address behind a tab that opens a side drawer.
  C.tab = (P, st) => {
    const open = st.endsWith('-x');
    const more = P.notes || P.address;
    if (!open) {
      const html = `<div class="k c5">${head(P)}<div class="k-acts">${dirBtn()}<div class="k-right">${starBtn(P, true)}${visBtn(P)}</div></div>${more ? `<div class="c5tab"><span>Notes</span></div>` : ''}</div>`;
      const s = openPopup(P, html, 268, 'k-quiet');
      map.panBy([12, 0], { animate: false });
      return s;
    }
    map.closePopup(); select(P);
    movePinTo(P, 36, 300);
    const el = document.createElement('div'); el.className = 'k c5drawer';
    el.innerHTML = `<div class="c5tab"><span>Close</span></div><span class="x">×</span><div class="in">${head(P)}<div class="bd">${notes(P)}${P.address ? `<div class="k-lab">Address</div>${addr(P)}` : ''}</div>${acts(P)}</div>`;
    document.body.appendChild(el);
    return '.c5drawer';
  };

  // 6. MAP LABEL + DOCK -- tier 1 printed on the map beside the pin; tiers 2-4 in a card docked over the sheet.
  C.dock = (P, st) => {
    const open = st.endsWith('-x');
    map.closePopup(); select(P);
    const d = document.createElement('div'); d.className = 'k c6dock' + (open ? ' open' : '') + (P.notes ? '' : ' solo');
    d.innerHTML = `${P.notes ? '<span class="handle"></span>' : ''}<span class="x">×</span>${P.notes ? notes(P) : ''}${open && P.address ? `<div class="k-lab">Address</div>${addr(P)}` : ''}${acts(P)}`;
    if (!P.notes) d.querySelector('.x').remove();
    document.body.appendChild(d);
    const dockTop = d.getBoundingClientRect().top;
    movePinTo(P, 120, Math.min(300, (dockTop + 84) / 2));
    const s = pinScreen(P);
    const lab = document.createElement('div'); lab.className = 'k c6label';
    lab.innerHTML = `${eyebrow(P)}${nameH(P)}`;
    document.body.appendChild(lab);
    const lr = lab.getBoundingClientRect();
    lab.style.left = (s.x + (P.shape ? -lr.width / 2 : 26)) + 'px'; lab.style.top = (s.y - lr.height / 2 - (P.shape ? 0 : 0)) + 'px';
    if (!P.notes) { d.style.paddingRight = '56px'; const x = document.createElement('span'); x.className = 'x'; x.textContent = '×'; x.style.top = '0'; d.appendChild(x); }
    return ['.c6dock', '.c6label'];
  };

  // 7. ACTION RAIL -- content column + a right rail of the three actions; address shrinks to "where".
  C.rail = (P, st) => {
    const open = st.endsWith('-x');
    const where = P.address ? (open ? `<div class="k-lab" style="margin-top:var(--s3)">Address</div><div class="k-addr" style="margin-top:var(--s1)">${esc(P.address)}</div>`
      : `<div class="where"><div class="k-addr">${esc(P.street)}</div><div class="exp">Full address ›</div></div>`) : '';
    const vis = P.visited ? `<button class="k-btn on vis"><span class="vis-on">${checkIc()}</span>Visited</button>` : `<button class="k-btn"><span class="k-ring"></span>Visit</button>`;
    const html = `<div class="k c7"><div class="main">${head(P)}<div class="bd">${notes(P)}${where}</div></div>
      <div class="rail"><a class="k-btn dir" href="#">${ic('compass')}Go</a>${P.starred ? `<button class="k-btn on">${ic('star')}Starred</button>` : `<button class="k-btn">${ic('star-open')}Star</button>`}${vis}</div></div>`;
    return openPopup(P, html, 312, 'k-quiet');
  };

  // 8. LUGGAGE LABEL (wildcard) -- the selected place is a hotel label: band, seal, stamp.
  C.lug = (P, st) => {
    const seal = `<svg class="seal" viewBox="0 0 32 32">${badgeHtml(P.category, P.kind, 32, { ink: P.ink, fill: '#F2EBDD', mark: P.ink }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`;
    const html = `<div class="k c8"><div class="band">${seal}<div><div class="k-eye">${esc(P.category)}${P.stop ? ` · ${esc(P.stop)}` : ''}</div><div class="nm">${P.starred ? ic('star', 'k-mstar') : ''}${esc(P.name)}</div></div></div>
      <div class="body">${notes(P)}${addr(P)}${acts(P)}</div></div>`;
    return openPopup(P, html, 296, 'k-lift k-lug');
  };

  window.K = {
    css() { if (!document.getElementById('k-css')) { const s = document.createElement('style'); s.id = 'k-css'; s.textContent = CSS; document.head.appendChild(s); } },
    show(concept, state) { this.css(); basemap(); const P = place(state); return C[concept](P, state); },
    place,
  };
})();
