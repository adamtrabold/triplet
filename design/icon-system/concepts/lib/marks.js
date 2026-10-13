/* Icon-system concepts: shared drawing library (visual designer).
   Used by concepts/grammar/*.html and concepts/<b|c|d>/*.html. Sketch code,
   not app code: index.html is never touched. Every mark is SVG drawn at the
   size it renders in the app.

   TM.install()            inject the sprite (today glyphs o-*, new glyphs n-*,
                           Line l-*, Inked i-*) once per page
   TM.pin(model, o)        model: 'today' | 'B' | 'C' | 'D'
                           o: {cat, size 24|16, visited, starred, selected,
                               approx, num, seed}
   TM.cluster(style, o)    style: 'today' | 'orange' | 'ink'
   TM.basemap(frame)       stand-in OSM-Carto basemap for the fixture frames
   TM.phone(model, moment, fixture, opts)   a full 390x844 screen (string) */
window.TM_OPT_DEFAULT = window.TM_OPT_DEFAULT || {"restaurant": 1.16, "cafe": 0.84, "bar": 1, "attraction": 1.005, "nature": 0.987, "shopping": 0.84, "area": 0.846, "hotel": 0.926, "other": 1.041, "district": 1.005, "street": 1.051}; // measured by measure.html -> opt-measure.json (2026-10-13)
(function () {
  const INK = { restaurant: '#7A2436', cafe: '#6E4C22', bar: '#3D5A7A', attraction: '#547326', nature: '#1E3A2B', shopping: '#8A7AA8', area: '#2B3F52', hotel: '#2E2433', other: '#4F5450', district: '#328177', street: '#5E2C17' };
  const EDGE = 'rgba(112,84,46,.34)';   // C: the disc's warm 1px edge
  const C = { paper: '#F2EBDD', raised: '#FAF5EA', hair: '#D8CEBA', ink: '#1A1A18', ink2: '#5A564C', navy: '#12293F', or: '#EE7434', ord: '#A8400C', stk: '#3A4C5B', stkD: '#52636F', cream: '#F4ECD8', tile: '#F2EFE9' };
  const STAR = 'M10.81 2.74A1.3 1.3 0 0 1 13.19 2.74L15.45 7.81A0.6 0.6 0 0 0 15.93 8.17L21.46 8.75A1.3 1.3 0 0 1 22.19 11.01L18.06 14.73A0.6 0.6 0 0 0 17.88 15.30L19.03 20.73A1.3 1.3 0 0 1 17.11 22.12L12.30 19.35A0.6 0.6 0 0 0 11.70 19.35L6.89 22.12A1.3 1.3 0 0 1 4.97 20.73L6.12 15.30A0.6 0.6 0 0 0 5.94 14.73L1.81 11.01A1.3 1.3 0 0 1 2.54 8.75L8.07 8.17A0.6 0.6 0 0 0 8.55 7.81Z';
  const CHECK_I = 'M0.75 12.09Q0.05 12.80 0.75 13.51L8.90 21.66Q9.61 22.36 10.28 21.62L23.28 7.33Q23.95 6.59 23.21 5.92L20.03 3.02Q19.29 2.35 18.62 3.09L10.06 12.50Q9.39 13.24 8.68 12.53L5.21 9.05Q4.50 8.35 3.79 9.05Z';
  // Optical-area normalisation of the NEW glyphs (measured on grammar sheet 2:
  // ink coverage of the 24 box; each glyph scaled about its centre toward the
  // set's median coverage, clamped). Filled by measure step; 1 = unscaled.
  const OPT = window.TM_OPT || window.TM_OPT_DEFAULT || { restaurant: 1, cafe: 1, bar: 1, attraction: 1, nature: 1, shopping: 1, area: 1, hotel: 1, other: 1, district: 1, street: 1 };

  const TODAY_G = {
    restaurant: '<path fill="currentColor" d="M6 2h2v7h1V2h2v7h1V2h2v8a3 3 0 0 1-2 2.83V22h-4v-9.17A3 3 0 0 1 6 10V2z"/>',
    cafe: '<path fill="currentColor" d="M3 4h13v7a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V4z"/><path fill="currentColor" d="M17 6h2a3 3 0 0 1 0 6h-2V6z"/><path fill="currentColor" d="M2 19h16v2H2z"/>',
    bar: '<path fill="currentColor" d="M3 3h18l-8 9v7h4v2H7v-2h4v-7L3 3z"/>',
    attraction: '<path fill="currentColor" d="M12 2l3 6v11H9V8l3-6z"/><path fill="currentColor" d="M7 20h10v2H7z"/>',
    nature: '<path fill="currentColor" d="M12 2l4 6h-2.5l3 5H14l3.5 6h-11L10 13H7.5l3-5H8l4-6z"/><path fill="currentColor" d="M11 18h2v4h-2z"/>',
    shopping: '<path fill="currentColor" d="M12 1a4 4 0 0 0-4 4v2h2V5a2 2 0 0 1 4 0v2h2V5a4 4 0 0 0-4-4z"/><path fill="currentColor" d="M4 7h16l-1.5 15h-13L4 7z"/>',
    area: '<path fill="currentColor" d="M3 4h18v2H3zM3 18h18v2H3zM3 4h2v16H3zM19 4h2v16h-2z"/><path fill="currentColor" d="M8.5 18l6-12h2l-6 12h-2zM13.5 18l5-10v4l-3 6h-2z"/>',
    hotel: '<path fill="currentColor" d="M2 6h3v7h9a5 5 0 0 1 5 5v3h-3v-2H5v2H2V6z"/><circle fill="currentColor" cx="8.5" cy="9.5" r="2.5"/>',
    other: '<circle fill="currentColor" cx="12" cy="12" r="5"/>',
    district: '<path fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="6 4" d="M4 5h16v14H4z"/>',
    street: '<path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 8" d="M3 18C7 6 17 18 21 6"/>'
  };
  // NEW Printed glyphs: 24 grid, 20 live area, corners r~1, solid.
  const NEW_G = {
    restaurant: '<path d="M7.6 3.6a.9.9 0 0 1 1.8 0V9h1.3V3.6a.9.9 0 0 1 1.8 0V9h1.3V3.6a.9.9 0 0 1 1.8 0V10a3.4 3.4 0 0 1-2.4 3.25V20.4a1.1 1.1 0 0 1-1.1 1.1h-1.4a1.1 1.1 0 0 1-1.1-1.1v-7.15A3.4 3.4 0 0 1 7.6 10Z"/>',
    cafe: '<path fill-rule="evenodd" d="M4.5 6.2a1 1 0 0 1 1-1h10.6a1 1 0 0 1 1 1V8h1a3.4 3.4 0 0 1 0 6.8h-1.3A5.3 5.3 0 0 1 11.6 17.6h-2.2A5 5 0 0 1 4.5 12.6ZM17.1 9.9v3h.9a1.5 1.5 0 0 0 0-3Z"/><rect x="3.5" y="19" width="15" height="2" rx="1"/>',
    bar: '<path stroke="currentColor" stroke-width="1" stroke-linejoin="round" d="M4.6 4.2h14.8l-6.3 7.4v7.1h3.2v1.6H7.7v-1.6h3.2v-7.1Z"/>',
    attraction: '<path stroke="currentColor" stroke-width="1" stroke-linejoin="round" d="M12 3l3.1 5.4v9.8H8.9V8.4Z"/><rect x="5.8" y="19" width="12.4" height="2.4" rx="1"/>',
    nature: '<path stroke="currentColor" stroke-width="1" stroke-linejoin="round" d="M12 2.8l4 5.6h-2.3l3 4.8h-2.4l3.4 5.4H6.3l3.4-5.4H7.3l3-4.8H8Z"/><rect x="10.9" y="17.5" width="2.2" height="4" rx=".8"/>',
    shopping: '<path d="M8.6 8.6V6.6a3.4 3.4 0 0 1 6.8 0v2h-1.9v-2a1.5 1.5 0 0 0-3 0v2Z"/><path stroke="currentColor" stroke-width="1" stroke-linejoin="round" d="M5.4 8.6h13.2l-1.2 11.6H6.6Z"/>',
    area: '<path fill-rule="evenodd" d="M5.6 4.5h12.8a1.6 1.6 0 0 1 1.6 1.6v11.8a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17.9V6.1a1.6 1.6 0 0 1 1.6-1.6ZM5.6 14.6L10.2 6.1h2.3L5.6 18.2ZM9.4 17.9L15.6 6.1h2.3L11.7 17.9ZM14.8 17.9L18.4 11.1v3.9l-1.5 2.9Z"/>',
    hotel: '<path stroke="currentColor" stroke-width="1" stroke-linejoin="round" d="M3.4 6.6h2.4v6.8h8.6a4.6 4.6 0 0 1 4.6 4.6v2.4h-2.4v-1.8H5.8v1.8H3.4Z"/><circle cx="9.3" cy="10" r="2.3"/>',
    other: '<rect x="6.4" y="3" width="2.3" height="18.4" rx="1.1"/><path stroke="currentColor" stroke-width="1" stroke-linejoin="round" d="M8.6 4.4h9.4l-2.6 3.9 2.6 3.9H8.6Z"/>',
    // district: four corner brackets (a surveyed parcel), drawn as solid L shapes
    district: '<path d="M3.5 5a1.5 1.5 0 0 1 1.5-1.5h4.6v2.8H6.3v3.3H3.5ZM20.5 5a1.5 1.5 0 0 0-1.5-1.5h-4.6v2.8h3.3v3.3h2.8ZM3.5 19a1.5 1.5 0 0 0 1.5 1.5h4.6v-2.8H6.3v-3.3H3.5ZM20.5 19a1.5 1.5 0 0 1-1.5 1.5h-4.6v-2.8h3.3v-3.3h2.8Z"/><rect x="9.6" y="9.6" width="4.8" height="4.8" rx="1"/>',
    street: '<path fill="none" stroke="currentColor" stroke-width="5.2" stroke-linecap="round" d="M4.2 19.3C8 9 16 15 19.8 4.7"/><path fill="none" stroke="var(--knock,#F2EBDD)" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="2.2 2.6" d="M4.2 19.3C8 9 16 15 19.8 4.7"/>'
  };
  const LINE = {
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    plus: '<path d="M12 5.2v13.6M5.2 12h13.6"/>',
    minus: '<path d="M5.2 12h13.6"/>',
    check: '<path d="M5 12.6l4.6 4.6L19 7.6"/>',
    chev: '<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>',
    sort: '<path d="M8 19.5V4.8M4.6 8.2L8 4.8l3.4 3.4M16 4.5v14.7M12.6 15.8l3.4 3.4 3.4-3.4"/>',
    filters: '<path d="M4 7h3.7M12.3 7H20M4 12h8.7M17.3 12H20M4 17h1.7M10.3 17H20"/><circle cx="10" cy="7" r="2.3"/><circle cx="15" cy="12" r="2.3"/><circle cx="8" cy="17" r="2.3"/>',
    locate: '<circle cx="12" cy="12" r="6.4"/><path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3"/><circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none"/>',
    more: '<g fill="currentColor" stroke="none"><circle cx="5.6" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.4" cy="12" r="1.7"/></g>',
    compass: '<circle cx="12" cy="12" r="8.8"/><path d="M15.6 8.4l-2.2 5-5 2.2 2.2-5Z" fill="currentColor" stroke-width="1.2"/>',
    account: '<circle cx="12" cy="8.4" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    star: `<path stroke-linejoin="round" transform="translate(12 12) scale(.86) translate(-12 -12.4)" d="${STAR}"/>`
  };

  const APPROX = () => window.TM_APPROX || 'long';   // 'long' = 3 long segments (steer 1), 'dash' = sheet-2 dashes
  let uidN = 0; const uid = p => p + (uidN++);
  function install() {
    if (document.getElementById('tm-sprite')) return;
    let s = '<svg id="tm-sprite" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>';
    for (const k in TODAY_G) s += `<symbol id="o-${k}" viewBox="0 0 24 24">${TODAY_G[k]}</symbol>`;
    for (const k in NEW_G) { const f = OPT[k] || 1; s += `<symbol id="n-${k}" viewBox="0 0 24 24"><g fill="currentColor" transform="translate(12 12) scale(${f}) translate(-12 -12)">${NEW_G[k]}</g></symbol>`; s += `<symbol id="n0-${k}" viewBox="0 0 24 24"><g fill="currentColor">${NEW_G[k]}</g></symbol>`; }
    for (const k in LINE) s += `<symbol id="l-${k}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" style="stroke-width:var(--sw,2)" stroke-linecap="round" stroke-linejoin="round">${LINE[k]}</g></symbol>`;
    s += `<symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="${STAR}"/></symbol>`;
    s += `<symbol id="i-check" viewBox="0 0 24 24"><path fill="currentColor" d="${CHECK_I}"/></symbol>`;
    s += '</defs></svg>';
    document.body.insertAdjacentHTML('afterbegin', s);
  }
  const use = (id, px, color, extra = '') => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" style="color:${color};display:inline-block;vertical-align:middle;${extra}" aria-hidden="true"><use href="#${id}"/></svg>`;
  // glyph placed inside a 24 box at size g (24-unit coords)
  const gIn = (id, g, color, extraT = '') => `<g transform="translate(12 12)${extraT} scale(${g / 24}) translate(-12 -12)" style="color:${color}"><use href="#${id}"/></g>`;
  function mix(a, b, t) { const p = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v * (1 - t) + B[i] * t).toString(16).padStart(2, '0')).join(''); }
  // CIELAB (D65) helpers, for B's reprint inks: every category's visited ink
  // goes to ONE target lightness, hue kept, chroma clamped into sRGB.
  const lin = c => { c /= 255; return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
  const gam = c => { c = c <= .0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - .055; return Math.round(Math.max(0, Math.min(1, c)) * 255); };
  function hex2lab(h) { const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(h.substr(i, 2), 16))); const X = (r * .4124 + g * .3576 + b * .1805) / .95047, Y = r * .2126 + g * .7152 + b * .0722, Z = (r * .0193 + g * .1192 + b * .9505) / 1.08883; const f = t => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))]; }
  function lab2rgb(L, a, b) { const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200; const fi = t => t * t * t > .008856 ? t * t * t : (t - 16 / 116) / 7.787; const X = fi(fx) * .95047, Y = fi(fy), Z = fi(fz) * 1.08883; const r = X * 3.2406 - Y * 1.5372 - Z * .4986, g = -X * .9689 + Y * 1.8758 + Z * .0415, bb = X * .0557 - Y * .2040 + Z * 1.0570; return [r, g, bb]; }
  function lch2hex(L, C, H) { let lo = 0, hi = C; const inG = c => lab2rgb(L, c * Math.cos(H), c * Math.sin(H)).every(v => v >= -.001 && v <= 1.001); if (inG(C)) lo = C; else { for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; inG(m) ? lo = m : hi = m; } } const [r, g, b] = lab2rgb(L, lo * Math.cos(H), lo * Math.sin(H)); return '#' + [r, g, b].map(v => gam(v).toString(16).padStart(2, '0')).join(''); }
  const REPRINT_L = 62;   // B: visited lightness (L*). Paper is ~93.
  function reprint(h, L = REPRINT_L) { const [l, a, b] = hex2lab(h); return lch2hex(Math.max(l, L), Math.hypot(a, b), Math.atan2(b, a)); }
  function relLum(h) { const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(h.substr(i, 2), 16))); return .2126 * r + .7152 * g + .0722 * b; }
  function contrast(a, b) { const x = relLum(a), y = relLum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
  function hash(n) { let x = (n * 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13; return (x >>> 0) / 4294967295; }
  const TILT = 6; // C: seeded tilt range, degrees (director: may need to come down from 6)
  const tiltOf = seed => ((hash(seed || 1) * 2 - 1) * TILT).toFixed(2);

  // star with a TRUE cut-out: returns {mask, star}. cx,cy,size in 24-units.
  function rimStar(cx, cy, size, color, gap = 1.6) {
    const id = uid('rs'); const s = size / 24;
    const t = `translate(${cx - size / 2} ${cy - size / 2}) scale(${s})`;
    const mask = `<mask id="${id}" maskUnits="userSpaceOnUse" x="-12" y="-12" width="48" height="48"><rect x="-12" y="-12" width="48" height="48" fill="#fff"/><path transform="${t}" d="${STAR}" fill="#000" stroke="#000" stroke-width="${gap * 2 / s}" stroke-linejoin="round"/></mask>`;
    const star = `<path transform="${t}" d="${STAR}" fill="${color}"/>`;
    return { id, mask, star };
  }

  // ---------- pins ----------
  function pin(model, o) {
    const cat = o.cat, k = INK[cat], far = (o.size || 24) < 20, size = o.size || 24;
    const v = !!o.visited, st = !!o.starred, sel = !!o.selected;
    let defs = '', body = '', top = '', S = size, box = 24;
    if (model === 'today') {
      if (sel && !v) { S = 32; body = `<circle cx="12" cy="12" r="10.9" fill="${k}" stroke="${k}" stroke-width="1.9"/>` + gIn('o-' + cat, 17.25, C.paper); }
      else if (v) {
        const f = uid('f'); defs += `<filter id="${f}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx=".35" dy=".7" stdDeviation=".6" flood-color="#000" flood-opacity=".32"/></filter>`;
        if (sel) S = 32;
        body = `<g filter="url(#${f})"><path d="M12 1a11 11 0 1 1-10.2 6.9L8.5 4A11 11 0 0 1 12 1z" fill="${C.stk}"/><path d="M1.8 7.9L8.5 4 3.2 3.6z" fill="#6a7a87"/></g>` + gIn('i-check', far ? 9.3 : 9, C.cream) + (sel ? `<circle cx="12" cy="12" r="8.6" fill="none" stroke="${C.cream}" stroke-width="1"/>` : '');
      } else {
        const sw = far ? 3 : 2;
        body = `<circle cx="12" cy="12" r="${11 - sw / 2}" fill="${C.paper}" stroke="${k}" stroke-width="${sw}" ${o.approx ? 'stroke-dasharray="3 3"' : ''}/>` + (far ? '' : (o.num ? numTxt(o.num) : gIn('o-' + cat, 18, k)));
      }
      if (st) { const ss = far ? 15 : (S === 32 ? 12 : 12); top = `<g transform="translate(${v ? 14.5 : 13.5} ${v ? -4.5 : -3.5}) scale(.5)"><path d="${STAR}" fill="${C.or}" stroke="${C.paper}" stroke-width="5" stroke-linejoin="round" paint-order="stroke"/><path d="${STAR}" fill="${C.or}" stroke="${v ? 'none' : C.ord}" stroke-width="1.5" stroke-linejoin="round"/></g>`; }
      return svgWrap(S, defs, body + top);
    }
    // ---- concepts share: shell, rim star with true cut-out, selection replaces rim ----
    const sw = far ? 3 : 2;
    const rimCol = sel ? C.navy : k;
    const rimW = sel ? (far ? 3.4 : 2.5) : sw;
    const shell = (col, w, fill = C.paper, dash = '') => `<circle cx="12" cy="12" r="${11 - w / 2}" fill="${fill}" stroke="${col}" stroke-width="${w}" ${dash}/>`;
    const dash = o.approx ? (APPROX() === 'dash' ? 'stroke-dasharray="3.2 2.6"' : `stroke-dasharray="${(2 * Math.PI * (11 - sw / 2) / 3 - (far ? 4.2 : 3.4)).toFixed(2)} ${far ? 4.2 : 3.4}" stroke-dashoffset="${(far ? -2 : -1.2)}"`) : '';
    let star = null;
    if (model === 'C' && v) {
      // C (was C-prime): the printed RIM comes off; the paper disc stays with one warm
      // 1px low-alpha outer edge (shadow definition, not a ring); your glyph is inked on it, tilted.
      const tilt = tiltOf(o.seed);
      const edge = `stroke="${EDGE}" stroke-width="${far ? 1.5 : 1}"`;
      const disc = `<circle cx="12" cy="12" r="${far ? 10.6 : 10.9}" fill="${C.paper}" ${sel ? `stroke="${C.navy}" stroke-width="${rimW}"` : edge}/>`;
      if (far) body = disc + (o.farDot ? `<circle cx="12" cy="12" r="3.9" fill="${k}"/>` : gIn('n-' + cat, 12.5, k, ` rotate(${tilt})`));
      else body = disc + (o.num ? `<g transform="rotate(${tilt} 12 12)">${numTxt(o.num)}</g>` : gIn('n-' + cat, 16, k, ` rotate(${tilt})`));
      if (st) star = rimStar(12, 1.4, far ? 11 : 9, C.or, 1.3);
    } else if (model === 'B' && v) {
      const t = reprint(k), offs = far ? '' : ' translate(.8 .6)';
      body = shell(sel ? C.navy : t, sel ? rimW : (far ? 2.4 : 1.6), C.paper, dash) + (far ? '' : (o.num ? numTxt(o.num, mix(C.ink2, C.paper, .45), .8) : gIn('n-' + cat, 16, t, offs)));
      if (st) star = rimStar(12, 1.2, far ? 12 : 9.5, reprint(C.or, 72));
    } else if (model === 'D' && v) {
      // sticker, re-weighted: o.dSize px (near), face one value step lighter, the peel kept
      body = sticker(o, far, size);
      if (sel) body = body.replace(new RegExp(C.stkD, 'g'), C.navy);
      if (st) { const dp = (o.dSize || 16) / size * 24; star = rimStar(12 + dp * .3, 12 - dp * .5, far ? 10 : 8, C.or, 1.2); }
    } else {
      // open (all concepts), or selected
      body = shell(rimCol, rimW, C.paper, sel ? '' : dash) + (far ? '' : (o.num ? numTxt(o.num) : gIn('n-' + cat, 16, k)));
      if (st) star = rimStar(12, 1.2, far ? 12 : 10, C.or);
    }
    if (star) { defs += star.mask; body = `<g mask="url(#${star.id})">${body}</g>` + star.star; }
    return svgWrap(S, defs, body);
  }
  // D's sticker: a round sticker with a real peel (flap curled back showing its pale underside,
  // a soft contact shadow under the lifted edge). o.dSize = sticker diameter in CSS px.
  function sticker(o, far, size) {
    const d = far ? Math.min(o.dSize || 16, 11) : (o.dSize || 16), sc = d / 22, k = uid('sk');
    const tilt = ((hash(o.seed || 1) * 2 - 1) * 8).toFixed(1), corner = Math.floor(hash((o.seed || 1) + 99) * 4) * 90 + 200;
    const face = o.glyphFace ? gIn('n-' + o.cat, 11.5, C.cream) : gIn('i-check', 9.5, C.cream);
    // geometry in a 24 box, radius 11; the flap cuts a chord near the lower-left and folds over it
    const showFace = !(far || d < 13);
    return `<g transform="translate(12 12) scale(${(sc * 24 / size * (size / 24)).toFixed(3)}) rotate(${corner + +tilt}) translate(-12 -12)">
      <defs><filter id="${k}f" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx=".3" dy=".6" stdDeviation=".55" flood-color="#000" flood-opacity=".24"/></filter>
      <clipPath id="${k}c"><path d="M-2 -2H26V26H-2Z M3.2 18.6L9.8 22.4L-2 26Z"/></clipPath></defs>
      <g filter="url(#${k}f)"><path d="M12 1A11 11 0 0 1 22.9 12A11 11 0 0 1 10.2 22.85L3.1 18.45A11 11 0 0 1 12 1Z" fill="${C.stkD}"/></g>
      <path d="M3.1 18.45L10.2 22.85Q8.6 16.6 3.1 18.45Z" fill="#C9CFD4"/>
      <path d="M3.1 18.45Q8.6 16.6 10.2 22.85" fill="none" stroke="rgba(0,0,0,.18)" stroke-width=".5"/>
      <g transform="rotate(${-(corner + +tilt)} 12 12)">${showFace ? face : ''}</g></g>`;
  }
  const numTxt = (n, col = C.ink2, op = 1) => `<text x="12" y="16.4" text-anchor="middle" font-size="${n > 9 ? 10.5 : 12.5}" font-weight="700" fill="${col}" opacity="${op}" font-family="Archivo,Arial">${n}</text>`;
  const svgWrap = (S, defs, body) => `<svg width="${S}" height="${S}" viewBox="0 0 24 24" overflow="visible" style="overflow:visible;display:block"><defs>${defs}</defs>${body}</svg>`;

  // ---------- clusters ----------
  function cluster(style, o) {
    const n = o.n, w = n > 9 ? 24 : 22;
    let b;
    if (style === 'today') b = `<circle cx="12" cy="12" r="11" fill="${C.ord}" stroke="${C.paper}" stroke-width="2"/><text x="12" y="15.6" text-anchor="middle" font-size="10" font-weight="700" fill="${C.paper}" font-family="Archivo,Arial">${n}</text>`;
    else {
      const col = style === 'orange' ? C.or : C.ink2, txt = style === 'orange' ? C.ord : C.ink;
      const recede = o.allVisited ? .5 : 0;
      const rc = mix(col, C.paper, recede), tc = mix(txt, C.paper, recede);
      b = `<circle cx="14.6" cy="9.4" r="9" fill="${C.paper}" stroke="${mix(rc, C.paper, .35)}" stroke-width="1.2"/><circle cx="12" cy="12" r="10" fill="${C.paper}" stroke="${rc}" stroke-width="2"/><text x="12" y="15.7" text-anchor="middle" font-size="10.5" font-weight="700" fill="${tc}" font-family="Archivo,Arial">${n}</text>`;
    }
    let defs = '';
    if (o.openStar) { const s = rimStar(style === 'today' ? 20 : 12, style === 'today' ? 3 : 1.2, 10, C.or); if (style === 'today') { b += `<g transform="translate(15 -3) scale(.45)"><path d="${STAR}" fill="${C.or}" stroke="${C.paper}" stroke-width="5" paint-order="stroke"/></g>`; } else { defs = s.mask; b = `<g mask="url(#${s.id})">${b}</g>${s.star}`; } }
    return svgWrap(w, defs, b);
  }

  // ---------- stand-in basemap (OSM-Carto colours) for the near frame ----------
  function basemap(w = 390, h = 545) {
    let r = 7; const rnd = () => { r = (r * 16807) % 2147483647; return r / 2147483647; };
    let s = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="position:absolute;left:0;top:0"><rect width="${w}" height="${h}" fill="#F2EFE9"/>`;
    // building blocks
    for (let i = 0; i < 230; i++) { const x = rnd() * w, y = 110 + rnd() * (h - 110), bw = 7 + rnd() * 16, bh = 6 + rnd() * 12; s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="#D9D0C9" stroke="#C4B6AB" stroke-width=".5" transform="rotate(${(rnd() * 16 - 8).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }
    // park (Hljómskálagarður) + small green
    s += `<path d="M22 372 L128 380 L140 470 L36 484 Z" fill="#C8FACC" stroke="#B4E2B8" stroke-width=".8"/><path d="M300 120 L340 150 L320 175 L292 150Z" fill="#C8FACC"/><path d="M330 410 L384 404 L388 470 L338 476Z" fill="#CDEBB0"/>`;
    // pond (Tjörnin)
    s += `<ellipse cx="54" cy="322" rx="26" ry="44" fill="#AAD3DF" transform="rotate(8 54 322)"/>`;
    // roads: residential grid (white with casing)
    const road = (d, wdt, fill, casing) => `<path d="${d}" fill="none" stroke="${casing}" stroke-width="${wdt + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${wdt}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const res = ['M120 240 L360 210', 'M140 330 L390 300', 'M150 250 L176 420', 'M200 250 L222 420', 'M262 240 L290 470', 'M320 230 L350 420', 'M0 260 L130 250', 'M0 360 L150 350', 'M60 140 L90 260', 'M150 380 L390 360', 'M0 500 L390 520', 'M180 460 L250 545', 'M330 300 L390 400'];
    res.forEach(d => s += road(d, 4, '#FFFFFF', '#D6CFC2'));
    s += road('M150 292 L390 266', 5.5, '#F7FABF', '#C9CC9A');            // Laugavegur (secondary)
    s += road('M196 300 L258 386', 5.5, '#F7FABF', '#C9CC9A');            // Skólavörðustígur
    s += road('M128 196 L112 334', 5.5, '#F7FABF', '#C9CC9A');            // Lækjargata
    s += road('M0 196 L210 205 L390 236', 7.5, '#FCD6A4', '#D9A46A');     // primary, under pin 1
    s += road('M0 404 L200 425 L390 452', 8.5, '#F9B29C', '#D98A72');     // trunk (Hringbraut), under pin 14
    // sea (drawn after roads so the coast is clean)
    s += `<path d="M0 0 H390 V206 L332 212 L300 216 L262 190 L222 164 L192 142 L150 126 L112 129 L84 98 L44 86 L0 92 Z" fill="#AAD3DF"/>`;
    s += `<rect x="30" y="66" width="6" height="34" fill="#E8E2D8"/><rect x="58" y="60" width="5" height="40" fill="#E8E2D8"/><rect x="98" y="88" width="30" height="5" fill="#E8E2D8"/>`;
    // OSM-style POI icons (brown/grey, upright, ~14px): near pins 2, 8, 6
    const poi = (x, y, kind) => {
      const col = kind === 'museum' ? '#734A08' : '#C77400';
      const g = kind === 'cup' ? `<path d="M3 4h7v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z M10 5h1.2a1.6 1.6 0 0 1 0 3.2H10" fill="${col}" stroke="${col}" stroke-width=".8"/><rect x="2.5" y="12" width="9" height="1.2" fill="${col}"/>`
        : kind === 'fork' ? `<path d="M4 2v5a1.6 1.6 0 0 0 1.2 1.5V13h1.4V8.5A1.6 1.6 0 0 0 7.8 7V2h-.9v4H6.4V2h-.8v4h-.6V2Z M9.5 2c1.6 0 2.4 2.2 2.4 4.8H10.6V13H9.4Z" fill="${col}"/>`
        : `<path d="M7 1.5L13 5H1Z M2 6h10v.9H2Z M2.6 7.6h1.3v4H2.6Z M6.35 7.6h1.3v4H6.35Z M10.1 7.6h1.3v4h-1.3Z M1.5 12.2h11v1.2h-11Z" fill="${col}"/>`;
      return `<g transform="translate(${x} ${y})">${g}</g>`;
    };
    s += poi(256, 318, 'cup') + poi(196, 286, 'fork') + poi(200, 160, 'museum') + poi(150, 236, 'cup') + poi(300, 370, 'fork');
    // labels
    const lab = (x, y, t, rot = 0, it = false, col = '#6B6B6B') => `<text x="${x}" y="${y}" font-size="8.5" fill="${col}" font-family="Arial" ${it ? 'font-style="italic"' : ''} transform="rotate(${rot} ${x} ${y})" stroke="#F2EFE9" stroke-width="2.4" paint-order="stroke">${t}</text>`;
    s += lab(300, 262, 'Laugavegur', -6) + lab(214, 344, 'Skólavörðustígur', 54) + lab(18, 202, 'Mýrargata', 2) + lab(250, 444, 'Hringbraut', 7) + lab(120, 60, 'Faxaflói', 0, true, '#4A7FA0') + lab(36, 330, 'Tjörnin', 0, true, '#4A7FA0');
    s += `<g><rect x="6" y="${h - 22}" width="174" height="15" fill="rgba(255,255,255,.82)"/><text x="11" y="${h - 11}" font-size="9" font-weight="700" fill="#A8400C" font-family="Arial">STAND-IN BASEMAP, NOT REAL OSM TILES</text></g>`;
    return s + '</svg>';
  }

  // ---------- phone chrome ----------
  function seal(px, bg, glyphHtml) {
    let d = ''; const N = 13, R = 25, A = 1.7;
    for (let i = 0; i <= 260; i++) { const t = i / 260 * Math.PI * 2, rr = R - A + A * Math.cos(N * t); d += (i ? 'L' : 'M') + (25 + rr * Math.cos(t)).toFixed(2) + ' ' + (25 + rr * Math.sin(t)).toFixed(2); }
    return `<div style="position:relative;width:${px}px;height:${px}px"><svg width="${px}" height="${px}" viewBox="0 0 50 50" style="position:absolute;inset:0"><path d="${d}Z" fill="${bg}"/></svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${glyphHtml}</div></div>`;
  }
  function stampHtml(scale = 1, onNavy = false, alpha = .82) {
    const col = onNavy ? 'rgba(242,235,221,.92)' : `rgba(18,41,63,${alpha})`;
    return `<span style="display:inline-flex;align-items:center;justify-content:center;gap:4px;width:${66 * scale}px;height:${28 * scale}px;border:2px solid ${col};border-radius:50%;outline:1.5px dotted ${col};outline-offset:2px;color:${col};font:700 ${10 * scale}px/1 Archivo,Arial;letter-spacing:.08em;transform:rotate(-3deg)">${use('i-check', 8 * scale, col)}VISITED</span>`;
  }
  function row(model, p, st, opts = {}) {
    const k = INK[p.category], v = st.visited, s = st.starred, sel = opts.selected;
    const bg = sel ? C.navy : (v ? '#E9E1D2' : '#F3EADB');
    const fg = sel ? C.paper : C.ink, fg2 = sel ? 'rgba(242,235,221,.75)' : C.ink2;
    let badge;
    const shapeCat = p.category === 'district' || p.category === 'street';
    if (model === 'today') {
      badge = shapeCat ? `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 1.6L22.4 12L12 22.4L1.6 12Z" fill="${C.paper}" stroke="${k}" stroke-width="2"/>${gIn('o-' + p.category, 12, k)}</svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${sel ? C.navy : C.paper}" stroke="${sel ? C.paper : k}" stroke-width="2"/>${gIn('o-' + p.category, 18, sel ? C.paper : k)}</svg>`;
    } else if (model === 'C' && v && !shapeCat) {
      const tilt = tiltOf(p.id);
      badge = `<svg width="24" height="24" viewBox="0 0 24 24" overflow="visible">${gIn('n-' + p.category, 17, sel ? C.paper : k, ` rotate(${tilt})`)}</svg>`;
    } else if (model === 'B' && v) {
      const t = mix(k, C.paper, .52);
      badge = `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.2" fill="${C.paper}" stroke="${t}" stroke-width="1.6"/>${gIn('n-' + p.category, 16, t, ' translate(.8 .6)')}</svg>`;
    } else {
      badge = shapeCat ? `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 1.6L22.4 12L12 22.4L1.6 12Z" fill="${C.paper}" stroke="${sel ? C.paper : k}" stroke-width="2" stroke-linejoin="round"/>${gIn('n-' + p.category, 11, k)}</svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${sel ? C.navy : C.paper}" stroke="${sel ? C.paper : k}" stroke-width="2"/>${gIn('n-' + p.category, 16, sel ? C.paper : k)}</svg>`;
    }
    const star = s ? (model === 'today' ? `<svg width="18" height="18" viewBox="0 0 24 24" style="flex:none"><path d="${STAR}" fill="${C.or}" stroke="${sel ? 'none' : C.ord}" stroke-width="1.6" stroke-linejoin="round"/></svg>` : use('i-star', 17, C.or, 'flex:none')) : '';
    const meta = (p.category === 'attraction' ? 'ATTRACTION' : p.category.toUpperCase()) + ' · REYKJAVÍK';
    const x = model === 'today' ? `<span style="font:400 15px/1 Arial;color:${fg2}">×</span>` : use('l-x', 14, fg2);
    const stampW = v ? (opts.stamp === 'struck' ? `<span style="font:700 10px/1 Archivo,Arial;letter-spacing:.1em;color:rgba(18,41,63,.6);border-bottom:1.5px solid rgba(18,41,63,.45);padding-bottom:2px;transform:rotate(-3deg);display:inline-flex;gap:3px;align-items:center">${use('i-check', 8, 'rgba(18,41,63,.6)')}VISITED</span>` : stampHtml(1, sel)) : '';
    return `<div style="height:56px;box-sizing:border-box;display:flex;align-items:center;gap:10px;padding:0 14px 0 12px;background:${bg};border-top:1px solid ${C.hair}">
      <div style="width:28px;display:flex;justify-content:center;flex:none">${badge}</div>
      <div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;font:600 17px/1.15 Archivo,Arial;color:${fg};white-space:nowrap;overflow:hidden">${star}<span style="overflow:hidden;text-overflow:ellipsis">${p.label}</span></div>
      <div style="font:700 10.5px/1 Archivo,Arial;letter-spacing:.13em;color:${fg2};margin-top:5px">${meta}</div></div>
      ${stampW}<div style="width:20px;display:flex;justify-content:center;flex:none">${x}</div></div>`;
  }
  function phone(model, moment, fx, opts = {}) {
    const vis = new Set(fx.moments[moment]);
    const W = 390, MH = 545;
    let pins = '';
    const places = fx.places.filter(p => p.pos.near);
    // draw order: visited first (under), then open; starred last
    const ordered = places.slice().sort((a, b) => (vis.has(b.id) - vis.has(a.id)) || (a.starred - b.starred) || (a.pos.near[1] - b.pos.near[1]));
    for (const p of ordered) {
      const [x, y] = p.pos.near;
      const svg = pin(model, { cat: p.category, size: 24, visited: vis.has(p.id), starred: p.starred, approx: p.approx, seed: p.id, selected: opts.selected === p.id, pad: opts.pad });
      pins += `<div style="position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%)">${svg}</div>`;
    }
    const today = model === 'today';
    const zoom = today
      ? `<div style="position:absolute;left:10px;top:10px;width:32px;height:62px;border:2px solid rgba(0,0,0,.2);border-radius:4px;background:#fff;display:flex;flex-direction:column;font:700 22px/30px 'Lucida Console',monospace;text-align:center;color:#000"><span style="height:30px;border-bottom:1px solid #ccc">+</span><span>−</span></div>`
      : `<div style="position:absolute;left:10px;top:10px;width:34px;border:1px solid ${C.hair};border-radius:4px;background:${C.raised};display:flex;flex-direction:column;align-items:center"><span style="height:32px;display:flex;align-items:center">${use('l-plus', 18, C.navy)}</span><span style="height:1px;width:100%;background:${C.hair}"></span><span style="height:32px;display:flex;align-items:center">${use('l-minus', 18, C.navy)}</span></div>`;
    const acc = today ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.or}" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>` : use('l-account', 24, C.or);
    const plus = today ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.or}" stroke-width="2.5" stroke-linecap="round"><path d="M12 4v16M4 12h16"/></svg>` : use('l-plus', 24, C.or, '--sw:2.5');
    const seals = `<div style="position:absolute;right:14px;top:12px;display:flex;gap:12px">${seal(50, C.navy, acc)}${seal(50, C.navy, plus)}</div>`;
    const attrib = `<div style="position:absolute;right:0;bottom:0;background:rgba(255,255,255,.8);font:400 10px/14px Arial;padding:1px 5px;color:#333"><span style="color:#0078A8">Leaflet</span> | © OpenStreetMap contributors</div>`;
    const ink = C.navy;
    const hdrIcons = today
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="2"><path d="M7 4v15M17 20V5"/><path d="M3 8l4-4 4 4z" fill="${ink}"/><path d="M13 16l4 4 4-4z" fill="${ink}"/></svg><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="9" cy="6" r="2" fill="${ink}"/><circle cx="15" cy="12" r="2" fill="${ink}"/><circle cx="7" cy="18" r="2" fill="${ink}"/></svg><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/></svg>`
      : `${use('l-sort', 20, ink)}${use('l-filters', 20, ink)}${use('l-locate', 20, ink)}`;
    const collapse = today ? `<span style="font:400 14px/1 Arial;color:${ink}">▼</span>` : use('l-chev', 20, ink);
    const header = `<div style="height:58px;display:flex;align-items:center;gap:14px;padding:0 16px 0 18px;background:#F0E7D8;border-top:1px solid ${C.hair}">${collapse}<span style="flex:1;font:700 16px/1 Archivo,Arial;font-stretch:87.5%;letter-spacing:.1em;color:${ink};padding-left:6px;white-space:nowrap">REYKJAVÍK LIST (27)</span><span style="display:flex;gap:22px;align-items:center">${hdrIcons}</span></div>`;
    const rowIds = opts.rows || [1, 2, 3, 8, 14];
    const rows = rowIds.map(id => { const p = fx.places.find(q => q.id === id); return row(model, p, { visited: vis.has(id), starred: p.starred }, { selected: opts.selected === id, stamp: opts.stamp }); }).join('');
    return `<div class="phone" style="position:relative;width:${W}px;height:844px;overflow:hidden;background:${C.paper};font-family:Archivo,Arial">
      <div style="position:absolute;left:0;top:0;width:${W}px;height:${MH}px;overflow:hidden">${basemap(W, MH)}${pins}${zoom}${seals}${attrib}</div>
      <div style="position:absolute;left:0;top:${MH}px;width:${W}px">${header}${rows}</div></div>`;
  }

  window.TM = { reprint, contrast, hex2lab, sticker, EDGE, INK, C, STAR, install, use, gIn, mix, hash, pin, cluster, basemap, phone, row, seal, stampHtml, rimStar, TODAY_G, NEW_G, LINE, TILT };
})();
