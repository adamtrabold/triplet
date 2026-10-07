// Shape pins (round 6): a map pin type for districts and streets. Page-side; injected into the real
// app (index.html, unmodified) after round 3's helpers (K2) and round 5's tag (TAG3).
// Three variants:
//   blaze   — TRAIL BLAZE: the list's own shape badge (a diamond) as a pin, the trail-marker diamond
//             nailed to a tree (Pacific Crest Trail blaze, design/inspo/project/yosemite-trail-scrapbook).
//             Visited: the same dark sticker, cut as a diamond, one vertex peeled.
//   tie     — TIE-ON TAG: the pin is a miniature of the Hanging Tag it opens (the tag's clipped-corner
//             silhouette, a punched eyelet), hung at the shape's point and swinging a few degrees.
//             Visited: the round dark sticker is stuck on the little tag, as hotel labels were on cases.
//   pennant — STAKED PENNANT: a small swallowtail pennant planted in the district / on the street
//             (park pennants, surveyor's flags). Visited: the pennant is coloured in, cream check.
(() => {
  const PAPER = '#F2EBDD';
  const inkOf = nb => nb.color || categoryInk(nb.type);
  const key = nb => shapeKey(nb.id);
  const hash = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
  const glyph = (cat, x, y, s, color) => `<svg x="${(x - s / 2).toFixed(2)}" y="${(y - s / 2).toFixed(2)}" width="${s}" height="${s}" viewBox="0 0 24 24" style="color:${color}"><use href="#g-${cat}"/></svg>`;
  const num = (n, x, y, size, color) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" style="font-family:var(--font-ui);font-stretch:85%;font-weight:700;font-size:${size}px;font-variant-numeric:tabular-nums" fill="${color}">${n}</text>`;
  const check = (x, y, s, color) => `<svg x="${(x - s / 2).toFixed(2)}" y="${(y - s / 2).toFixed(2)}" width="${s}" height="${s}" viewBox="0 0 24 24"><path d="${STICKER_CHECK.near.d}" fill="${color}"/></svg>`;
  // the map star (markerStarHtml's glyph and halo) centred at x, y
  const star = (x, y, s = 12) => `<svg class="marker-star" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" style="position:absolute;left:${(x - s / 2).toFixed(2)}px;top:${(y - s / 2).toFixed(2)}px;overflow:visible">` +
    `<use class="marker-star-halo" href="#g-star" stroke-width="${(3 * 24 / s).toFixed(2)}" stroke-linejoin="round"/><use class="marker-star-ink" href="#g-star"/></svg>`;
  let uid = 0;

  // ---------------------------------------------------------------- A  TRAIL BLAZE
  // A diamond sticker: the shipped fold (stickerFold supports 'diamond'), dark face, cream check (or number),
  // one VERTEX peeled (left, right or top; never the bottom tip, where a tag's string ties).
  function diamondSticker(S, k, hi, n, starred) {
    const angs = starred ? [90] : [90, -90, 180], ang = angs[hash(k + '#v') % angs.length] + ((hash(k + '#a') % 21) - 10);   // a starred one peels at the left, clear of the star
    const fh = 0.6 + (0.5 - stickerSize(k)) * 0.16;
    const g = stickerFold('diamond', S, S, S / 2 - 1, S / 2 - 1, ang, fh, STICKER.FOLD_L);
    const id = 'spd' + (uid++), c = S / 2;
    let base = stickerCurlDefs(id + 'c', g) + `<path d="${g.bodyD}" fill="${STICKER.INK}" filter="url(#stk-lift)"/><path d="${g.bodyD}" fill="url(#${id}c)"/>`;
    if (hi) { const r = c - 4; base += stickerPrintSvg(g, `<polygon points="${c},${c - r} ${c + r},${c} ${c},${c + r} ${c - r},${c}" fill="none" stroke="${STICKER.HI_RING}" stroke-width="1.3" stroke-linejoin="round"/>`, id + 'r'); }
    base += stickerPrintSvg(g, n ? num(n, c, c + 0.5, 12, STICKER.FACE) : check(c, c, hi ? 11 : 9, STICKER.FACE), id + 'p');
    return base + stickerFlapMarkup(g, STICKER.PIN_BACK, false, id + 'f', hi);
  }
  function blaze(nb, o) {
    const S = o.hi ? 34 : 26, c = S / 2, ink = inkOf(nb), rim = o.hi ? 2.5 : 2, h = rim / 2;
    let svg;
    if (o.visited) svg = diamondSticker(S, key(nb), o.hi, o.n, o.starred);
    else {
      const fill = o.hi ? ink : PAPER, mark = o.hi ? PAPER : ink;
      svg = `<polygon points="${c},${h} ${S - h},${c} ${c},${S - h} ${h},${c}" fill="${fill}" stroke="${ink}" stroke-width="${rim}" stroke-linejoin="round"/>` +
        (o.n ? num(o.n, c, c + 0.5, 12, o.hi ? PAPER : 'var(--ink-2)') : glyph(nb.type, c, c, o.hi ? 17 : 13, mark));
    }
    // star on the upper-right edge's midpoint, a step out
    const st = o.starred ? star(c + c * 0.5 + 2, c - c * 0.5 - 2, o.hi ? 14 : 12) : '';
    return { w: S, h: S, ax: c, ay: c, tie: [c, S - 1], html: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" style="display:block;overflow:visible">${svg}</svg>${st}` };
  }

  // ---------------------------------------------------------------- B  TIE-ON TAG
  // The Hanging Tag's own silhouette in miniature (corners clipped at the top, the eyelet punched through),
  // hung from its eyelet at the shape's point. A per-shape swing of a few degrees, like the stamps' lean.
  function tie(nb, o) {
    const k = o.hi ? 1.3 : 1, W = 20 * k, H = 26 * k, cc = 5.5 * k, ex = W / 2, ey = 6 * k, er = 2.1 * k;
    const ink = inkOf(nb), rim = o.hi ? 2.5 : 2, h = rim / 2, id = 'spt' + (uid++);
    const swing = o.hi ? 0 : ((hash(key(nb) + '#sw') % 13) - 6) * 1.1;   // -6.6 .. +6.6 deg; open, it hangs plumb above its tag
    const d = `M${cc},${h} H${W - cc} L${W - h},${cc} V${H - h} H${h} V${cc} Z`;
    const fill = o.hi ? ink : PAPER, mark = o.hi ? PAPER : ink, gy = ey + (H - ey) / 2 + 1.5 * k;
    let svg = `<defs><mask id="${id}m"><rect x="-4" y="-4" width="${W + 8}" height="${H + 8}" fill="#fff"/><circle cx="${ex}" cy="${ey}" r="${er}" fill="#000"/></mask>` +
      `<filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx=".4" dy=".8" stdDeviation=".7" flood-color="#1A1A18" flood-opacity=".16"/></filter></defs>` +
      `<g mask="url(#${id}m)" filter="url(#${id}s)"><path d="${d}" fill="${fill}" stroke="${ink}" stroke-width="${rim}" stroke-linejoin="round"/></g>`;
    let extra = '';
    if (o.visited) {   // the shipped round sticker, stuck on the little tag over its glyph
      const ss = o.hi ? 22 : 17, sp = stickerPinParts({ size: ss, near: true, hi: o.hi, check: !o.n, ang: stickerCorner(key(nb), o.starred), sz: stickerSize(key(nb)) });
      extra = `<div style="position:absolute;left:${(ex - ss / 2).toFixed(2)}px;top:${(gy - ss / 2).toFixed(2)}px;width:${ss}px;height:${ss}px">${sp.base}${o.n ? `<svg style="position:absolute;left:0;top:0" width="${ss}" height="${ss}">${num(o.n, ss / 2, ss / 2 + 0.5, 11, STICKER.FACE)}</svg>` : ''}${sp.flap}</div>`;
    } else svg += o.n ? num(o.n, ex, gy + 0.5, o.hi ? 15 : 12, o.hi ? PAPER : 'var(--ink-2)') : glyph(nb.type, ex, gy, o.hi ? 16 : 13, mark);
    const st = o.starred ? star(W - 1, cc - 2.5, o.hi ? 14 : 12) : '';
    return { w: W, h: H, ax: ex, ay: ey, tie: [ex, ey], swing,
      html: `<div style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform:rotate(${swing}deg);transform-origin:${ex}px ${ey}px"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;overflow:visible">${svg}</svg>${extra}${st}</div>` };
  }

  // ---------------------------------------------------------------- C  STAKED PENNANT
  // A swallowtail pennant on a short staff, planted at the shape's point (the staff's foot is the point).
  function pennant(nb, o) {
    const k = o.hi ? 1.3 : 1, P = 27 * k, fw = 21 * k, fhh = 15 * k, notch = 4.5 * k, ink = inkOf(nb), rim = o.hi ? 2 : 1.6;
    const id = 'spp' + (uid++), x0 = 1.5, W = x0 + fw + 2, H = P + 2;
    const vis = o.visited, fill = vis ? STICKER.INK : (o.hi ? ink : PAPER), edge = vis ? STICKER.INK : ink;
    const d = `M${x0},${rim / 2} H${x0 + fw} L${x0 + fw - notch},${fhh / 2} L${x0 + fw},${fhh} H${x0} Z`;
    const gx = x0 + (fw - notch) / 2 + 0.5, gy = fhh / 2;
    let svg = `<defs><filter id="${id}s" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx=".4" dy=".8" stdDeviation=".6" flood-color="#1A1A18" flood-opacity=".16"/></filter>` +
      `<filter id="${id}b"><feGaussianBlur stdDeviation=".8"/></filter></defs>` +
      `<ellipse cx="${x0 + 1}" cy="${P}" rx="${2.6 * k}" ry="${1 * k}" fill="#1A1A18" fill-opacity=".22" filter="url(#${id}b)"/>` +
      `<line x1="${x0}" y1="${P}" x2="${x0}" y2="0" stroke="#5A564C" stroke-width="${1.6 * k}" stroke-linecap="round"/>` +
      `<path d="${d}" fill="${fill}" stroke="${edge}" stroke-width="${rim}" stroke-linejoin="round" filter="url(#${id}s)"/>`;
    if (vis) svg += o.n ? num(o.n, gx, gy + 0.5, o.hi ? 13 : 11, STICKER.FACE) : check(gx, gy, o.hi ? 11 : 9, STICKER.FACE);
    else svg += o.n ? num(o.n, gx, gy + 0.5, o.hi ? 13 : 11, o.hi ? PAPER : 'var(--ink-2)') : glyph(nb.type, gx, gy, o.hi ? 14 : 11.5, o.hi ? PAPER : ink);
    if (o.hi && vis) svg += `<path d="M${x0 + 2.2},${2.2} H${x0 + fw - 2.6} L${x0 + fw - notch - 2},${fhh / 2} L${x0 + fw - 2.6},${fhh - 2.2} H${x0 + 2.2} Z" fill="none" stroke="${STICKER.HI_RING}" stroke-width="1.2" stroke-linejoin="round"/>`;
    const st = o.starred ? star(x0 + fw + 1, 0, o.hi ? 14 : 12) : '';
    return { w: W, h: H, ax: x0, ay: P, tie: [x0, P], html: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;overflow:visible">${svg}</svg>${st}` };
  }

  const V = { blaze, tie, pennant };

  // The district's label point: the interior point farthest from its edges (a pole of inaccessibility),
  // so a concave or C-shaped district never puts its pin outside itself. A street: halfway along it.
  function labelPoint(nb) {
    const g = nb.geometry, kx = Math.cos(g[0][0] * Math.PI / 180);
    const P = g.map(([la, ln]) => [ln * kx, la]);
    const inside = (x, y) => { let r = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) r = !r; } return r; };
    const dseg = (x, y, [x1, y1], [x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - x1 - t * dx, y - y1 - t * dy); };
    const dist = (x, y) => Math.min(...P.map((p, i) => dseg(x, y, p, P[(i + 1) % P.length])));
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    let best = null, bd = -1, x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    for (let pass = 0; pass < 3; pass++) {
      const nx = 30, sx = (x1 - x0) / nx, sy = (y1 - y0) / nx;
      for (let i = 0; i <= nx; i++) for (let j = 0; j <= nx; j++) { const x = x0 + i * sx, y = y0 + j * sy; if (!inside(x, y)) continue; const dd = dist(x, y); if (dd > bd) { bd = dd; best = [x, y]; } }
      x0 = best[0] - sx * 2; x1 = best[0] + sx * 2; y0 = best[1] - sy * 2; y1 = best[1] + sy * 2;
    }
    return [best[1], best[0] / kx];
  }
  const shapeAnchor0 = window.shapeAnchor;
  window.shapeAnchor = nb => (nb.type === 'district' && nb.geometry && nb.geometry.length > 2) ? labelPoint(nb) : shapeAnchor0(nb);

  // The app's own interim marks for a shape (its map star, its visited sticker, a plan stop's numbered
  // diamond) give way to the pin, which carries all of them.
  function quietShipped() {
    if (!window.__spq) { map.off('zoomend', window.syncPlanShapeMarkers); window.__spq = 1; }
    shapeStarMarkersById.forEach(m => map.removeLayer(m)); shapeStarMarkersById.clear();
    shapeVisitMarkersById.forEach(e => map.removeLayer(e.marker)); shapeVisitMarkersById.clear();
    planShapeMarkers.forEach(e => map.removeLayer(e.marker)); planShapeMarkers.clear();
    window.syncShapeStars = () => {}; window.syncPlanShapeMarkers = () => {};
  }

  const pins = new Map();
  // Place a pin for every shape whose layer is on the map. opts: { sel: shape id }
  function sync(variant, { sel = null } = {}) {
    pins.forEach(m => map.removeLayer(m)); pins.clear(); quietShipped();
    const pm = planMarks();
    neighborhoodLayersById.forEach((layer, id) => {
      const nb = neighborhoodShapes.find(n => n.id === id); if (!nb) return;
      const r = pm.byShape.get(id);
      const p = V[variant](nb, { hi: id === sel, starred: !!nb.starred, visited: !!nb.visited, n: r ? r.n : 0 });
      const at = shapeAnchor(nb);
      const icon = L.divIcon({ className: '', html: `<div class="sp-pin" data-shape="${id}" style="position:relative;width:${p.w}px;height:${p.h}px;line-height:0">${p.html}</div>`, iconSize: [p.w, p.h], iconAnchor: [p.ax, p.ay] });
      const m = L.marker(at, { icon, zIndexOffset: id === sel ? Z_HIGHLIGHTED : r ? Z_PLAN_STOP - r.n : nb.starred ? Z_PIN_STARRED : 0,   /* the pins' own ladder */ keyboard: false }).addTo(map);
      m._sp = p; pins.set(id, m);
    });
  }
  // screen point of a pin's tie (where a tag's string starts)
  function tiePoint(id) {
    const m = pins.get(id), p = m._sp, el = m._icon.getBoundingClientRect();
    if (p.swing) { const a = p.swing * Math.PI / 180; return { x: el.left + p.tie[0], y: el.top + p.tie[1] }; }
    return { x: el.left + p.tie[0], y: el.top + p.tie[1] };
  }

  // ---------------------------------------------------------------- the states board
  // One row per type (district, street, and a place pin for reference), one column per state.
  function board(variant) {
    const cols = [['Unvisited', {}], ['Starred', { starred: true }], ['Visited', { visited: true }], ['Visited + starred', { visited: true, starred: true }], ['Open', { hi: true }]];
    const D = { id: 9001, type: 'district', color: null }, S = { id: 9002, type: 'street', color: null };
    const el = document.createElement('div'); el.className = 'sp-board';
    const cw = 56;
    let h = `<div class="sp-bh">${{ blaze: 'Trail blaze', tie: 'Tie-on tag', pennant: 'Staked pennant' }[variant]}: states</div><div class="sp-grid">`;
    h += `<div></div>` + cols.map(([t]) => `<div class="sp-ch">${t}</div>`).join('');
    const rows = [['District', D], ['Street', S], ['Place (shipped)', null], ['Plan stop', D]];
    rows.forEach(([lab, nb], ri) => {
      h += `<div class="sp-rh">${lab}</div>`;
      cols.forEach(([, o], ci) => {
        let pin;
        if (!nb) {   // a shipped place pin for reference
          const l = { id: 'ref' + ci, category: 'cafe', name: 'x', starred: !!o.starred, visited: !!o.visited };
          const sz = o.hi ? 32 : 24;
          const sp = l.visited ? stickerPinParts({ size: sz, near: true, hi: !!o.hi, ang: stickerCorner(l.id, l.starred), sz: stickerSize(l.id) }) : null;
          const badge = sp ? sp.base + sp.flap : badgeHtml('cafe', 'circle', sz, { ink: categoryInk('cafe'), fill: o.hi ? categoryInk('cafe') : PAPER, mark: o.hi ? PAPER : categoryInk('cafe'), rim: o.hi ? 2.5 : 2 });
          const stH = l.starred ? (sp ? stickerStarHtml(sz) : markerStarHtml(sz)) : '';
          pin = { w: sz, h: sz, ax: sz / 2, ay: sz / 2, html: badge + stH };
        } else pin = V[variant](ri === 3 ? { ...nb, id: 9003 } : nb, { ...o, n: ri === 3 ? 2 : 0 });
        const ctx = nb ? (nb.type === 'street'
          ? `<svg class="sp-ctx" width="${cw}" height="70"><path d="M-4 50 C 14 44, 38 28, 62 18" fill="none" stroke="${categoryInk('street')}" stroke-opacity=".9" stroke-width="6" stroke-dasharray="2 8" stroke-linecap="round"/></svg>`
          : `<svg class="sp-ctx" width="${cw}" height="70"><path d="M5 8 L52 4 L53 62 L4 66 Z" fill="${categoryInk('district')}" fill-opacity=".12" stroke="${categoryInk('district')}" stroke-opacity=".9" stroke-width="2.5" stroke-dasharray="6 4"/></svg>`) : '';
        const px = cw / 2, py = pin.ay > pin.h * 0.7 ? 54 : (nb && nb.type === 'street' ? 35 : 38);   // a pennant stands on its foot
        h += `<div class="sp-cell"><div class="sp-clip">${ctx}</div><div style="position:absolute;left:${px - pin.ax}px;top:${py - pin.ay}px;width:${pin.w}px;height:${pin.h}px;line-height:0;z-index:1">${pin.html}</div>${o.hi && nb ? `<svg class="sp-ctx" width="${cw}" height="70" style="z-index:0"><line x1="${px - pin.ax + (pin.tie ? pin.tie[0] : 0)}" y1="${py - pin.ay + (pin.tie ? pin.tie[1] : 0)}" x2="${px - pin.ax + (pin.tie ? pin.tie[0] : 0)}" y2="70" stroke="#7A6A55" stroke-width="1.5"/></svg>` : ''}</div>`;
      });
    });
    h += `</div><div class="sp-note">Signed out: the same marks. A pin carries no control; the tag's Star and Mark visited go to their off state.</div>`;
    el.innerHTML = h; document.body.appendChild(el);
    return ['.sp-board'];
  }

  const CSS = `
  .sp-board { position: absolute; z-index: 1200; left: 12px; right: 12px; top: 92px; padding: 14px 10px 14px; background: var(--paper-raised, #FAF5EA); border-radius: 6px;
              box-shadow: 0 1px 2px rgba(26,26,24,.10), 0 4px 12px rgba(26,26,24,.08); font-family: var(--font-ui); color: var(--ink); }
  .sp-bh { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 12px; letter-spacing: .12em; margin: 0 4px 10px; }
  .sp-grid { display: grid; grid-template-columns: 44px repeat(5, 60px); row-gap: 6px; }
  .sp-ch { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 8px; line-height: 10px; letter-spacing: .1em; color: var(--ink-2); text-align: center; align-self: end; padding-bottom: 4px; }
  .sp-rh { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 8px; line-height: 10px; letter-spacing: .08em; color: var(--ink-2); align-self: center; }
  .sp-cell { position: relative; height: 70px; width: 56px; overflow: visible; background: #EEE7D8; border-radius: 3px; margin: 0 2px; }
  .sp-ctx { position: absolute; left: 0; top: 0; }
  .sp-clip { position: absolute; inset: 0; overflow: hidden; border-radius: 3px; }
  .sp-note { margin: 12px 4px 0; font-size: 12px; line-height: 16px; color: var(--ink-2); }
  `;
  function css() { if (!document.getElementById('sp-css')) { const s = document.createElement('style'); s.id = 'sp-css'; s.textContent = CSS; document.head.appendChild(s); } }

  window.SP = { V, sync, tiePoint, labelPoint, quietShipped, board, css, pins };
})();
