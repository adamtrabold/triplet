// Grid concepts g1: shared code for the phone stills (grids-g1.html) and the canvas boards (gen-grid.js).
// Each pick is a SKELETON: its construction primitives in a 20x20 "live space" (y down).
// A grid concept maps live space onto its own canvas and snaps to its own unit.
// Skeletons are blocks, not drawings: they show how a grid places and sizes parts.
(function (G) {
  const r = (x, y, w, h) => ({ t: 'r', x, y, w, h });
  const c = (x, y, rr) => ({ t: 'c', x, y, r: rr });
  const p = (...pts) => ({ t: 'p', pts });
  const b = (x1, y1, x2, y2, w) => ({ t: 'b', x1, y1, x2, y2, w });
  const ring = (x, y, rr, w) => ({ t: 'o', x, y, r: rr, w }); // a ring (line), for the wheel rim and the loop

  // The 13 picks (owner, 2026-10-16), as primitives
  G.PICKS = [
    ['restaurant', 'Fork and knife', [r(3, 2, 1.5, 6), r(5.75, 2, 1.5, 6), r(8.5, 2, 1.5, 6), r(3, 7, 7, 2), r(5.5, 9, 2, 9), r(12.5, 2, 4, 9), r(13.5, 11, 2, 7)]],
    ['cafe', 'Cup and saucer', [r(2, 5, 12, 8), r(14, 6, 4, 5), r(1, 15, 17, 2)]],
    ['bar', 'Coupe', [r(1, 3, 18, 5), r(9, 8, 2, 8), r(5, 16, 10, 2)]],
    ['venue', 'Curtain', [r(1, 1, 18, 3), r(2, 4, 6, 15), r(12, 4, 6, 15)]],
    ['museum', 'Column front', [p([1, 6], [10, 1], [19, 6]), r(3, 8, 2, 8), r(9, 8, 2, 8), r(15, 8, 2, 8), r(1, 17, 18, 2)]],
    ['landmark', 'The ⌘ loop', [r(7, 7, 6, 6), ring(5, 5, 3, 2), ring(15, 5, 3, 2), ring(5, 15, 3, 2), ring(15, 15, 3, 2)]],
    ['attraction', 'Ferris wheel', [ring(10, 8, 7, 2), c(10, 8, 1.5), b(10, 8, 5, 19, 2), b(10, 8, 15, 19, 2), r(3, 18, 14, 2)]],
    ['park', 'Park bench', [r(2, 3, 16, 2), r(2, 7, 16, 2), r(1, 11, 18, 2.5), r(3, 13.5, 2, 5.5), r(15, 13.5, 2, 5.5)]],
    ['nature', 'Conifer', [p([10, 1], [15, 7], [5, 7]), p([10, 5], [17, 12], [3, 12]), p([10, 9], [18, 16], [2, 16]), r(9, 16, 2, 3)]],
    ['shopping', 'Bag', [r(3, 7, 14, 12), r(6, 2, 2, 5), r(12, 2, 2, 5), r(6, 2, 8, 2)]],
    ['hotel', 'Bed', [r(1, 3, 2, 16), r(3, 11, 16, 4), r(4, 7, 5, 4), r(17, 15, 2, 4)]],
    ['neighbourhood', 'City blocks', [r(2, 2, 7, 7), r(11, 2, 7, 7), r(2, 11, 7, 7), r(11, 11, 7, 7)]],
    ['street', 'Walker', [c(11, 3, 2.2), b(11, 6.5, 9.8, 12, 3), b(9.8, 12, 7, 19, 2.6), b(9.8, 12, 13, 15, 2.6), b(13, 15, 13, 19, 2.6), b(10.8, 8, 7.5, 11, 2.2), b(11, 8, 14.5, 10.5, 2.2)]],
  ];

  // ---------- the grid concepts
  // each: id, name, unit (px per snap step, in canvas units), sizes: {render px: {canvas, pad, live, off}}, line, cut, radius
  const sz = (canvas, pad) => ({ canvas, pad, live: canvas - 2 * pad });
  G.CONCEPTS = [
    {
      id: 'A', key: 'keyline', name: 'Keyline 24',
      kind: 'The convention: one master, scaled',
      master: 24, sizes: { 24: sz(24, 2), 18: sz(24, 2), 12: sz(24, 2) }, scaled: true, snap: 1,
      keylines: ['circle', 'square', 'portrait', 'landscape'],
    },
    {
      id: 'B', key: 'pixel', name: 'Real-size masters',
      kind: 'One grid per size, 1 unit = 1 screen px',
      master: 18, sizes: { 24: sz(24, 2), 18: sz(18, 1), 12: sz(12, 0) }, snap: 1,
      keylines: ['circle', 'square', 'portrait', 'landscape'],
    },
    {
      id: 'C', key: 'module', name: 'The line is the module',
      kind: 'Everything is counted in 2px lines',
      master: 18, sizes: { 24: sz(24, 2), 18: sz(18, 1), 12: sz(12, 0) }, snap: 2, module: 2,
      keylines: ['square'],
    },
    {
      id: 'D', key: 'circle', name: 'The badge is the frame',
      kind: 'A round grid, fitted by weight',
      master: 24, sizes: { 24: sz(24, 4), 18: sz(24, 4), 12: sz(24, 4) }, scaled: true, snap: 0.5, polar: true,
      keylines: ['rings', 'diagonals', 'optical'],
    },
    {
      id: 'E', key: 'smallest', name: 'Smallest first',
      kind: 'Drawn at 12px, then enlarged',
      master: 12, sizes: { 12: sz(12, 0), 18: sz(18, 1), 24: sz(24, 2) }, snap: 1, minimums: true,
      keylines: ['square'],
    },
  ];

  // ---------- mapping and snapping
  const sn = (v, s) => Math.round(v / s) * s;
  const snMin = (v, s, min) => Math.max(min, sn(v, s));
  function bbox(prims) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    const add = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
    prims.forEach(q => {
      if (q.t === 'r') { add(q.x, q.y); add(q.x + q.w, q.y + q.h); }
      else if (q.t === 'c' || q.t === 'o') { add(q.x - q.r, q.y - q.r); add(q.x + q.r, q.y + q.r); }
      else if (q.t === 'p') q.pts.forEach(([x, y]) => add(x, y));
      else if (q.t === 'b') { add(q.x1, q.y1); add(q.x2, q.y2); }
    });
    return { x0, y0, x1, y1 };
  }
  // map a skeleton into a concept's canvas at a render size; returns primitives in canvas units
  G.place = function (con, prims, size) {
    const s = con.sizes[size];
    let k, ox, oy, snap = con.snap, minW = con.module || (con.minimums ? 2 : 1);
    if (con.polar) {
      // fit by the farthest point from the live circle's centre (12, 11.5: optical centre 0.5 above)
      const cx = 12, cy = 11.5, R = 8; // live circle Ø16 inside the 24 badge (rim 2, air 2)
      const bb = bbox(prims), mx = (bb.x0 + bb.x1) / 2, my = (bb.y0 + bb.y1) / 2;
      let far = 0;
      const pts = [];
      prims.forEach(q => {
        if (q.t === 'r') pts.push([q.x, q.y], [q.x + q.w, q.y], [q.x, q.y + q.h], [q.x + q.w, q.y + q.h]);
        else if (q.t === 'c' || q.t === 'o') for (let i = 0; i < 16; i++) { const a = i / 16 * 2 * Math.PI; pts.push([q.x + q.r * Math.cos(a), q.y + q.r * Math.sin(a)]); }
        else if (q.t === 'p') pts.push(...q.pts);
        else pts.push([q.x1, q.y1], [q.x2, q.y2]);
      });
      pts.forEach(([x, y]) => far = Math.max(far, Math.hypot(x - mx, y - my)));
      k = R / far; ox = cx - mx * k; oy = cy - my * k; minW = 1;
    } else if (con.id === 'E' && size !== 12) {
      // enlarge the 12px layout; lines stay 2px (re-drawn, not scaled)
      const m = G.place(con, prims, 12), f = size / 12, pad = s.pad, kk = (size - 2 * pad) / 12;
      return m.map(q => {
        const T = v => sn(pad + v * kk, 1);
        if (q.t === 'r') { const keep = Math.min(q.w, q.h) <= 2; const w = keep && q.w <= 2 ? 2 : sn(q.w * kk, 1), h = keep && q.h <= 2 ? 2 : sn(q.h * kk, 1); return { t: 'r', x: T(q.x), y: T(q.y), w, h }; }
        if (q.t === 'c') return { t: 'c', x: T(q.x), y: T(q.y), r: sn(q.r * kk, 0.5) };
        if (q.t === 'o') return { t: 'o', x: T(q.x), y: T(q.y), r: sn(q.r * kk, 0.5), w: 2 };
        if (q.t === 'p') return { t: 'p', pts: q.pts.map(([x, y]) => [T(x), T(y)]) };
        return { t: 'b', x1: T(q.x1), y1: T(q.y1), x2: T(q.x2), y2: T(q.y2), w: 2 };
      });
    } else {
      k = s.live / 20; ox = oy = s.pad;
    }
    const X = v => sn(ox + v * k, snap), Y = v => sn(oy + v * k, snap);
    const lineW = con.scaled ? null : 2; // real-size grids: a line is 2px
    return prims.map(q => {
      if (q.t === 'r') { const x = X(q.x), y = Y(q.y); return { t: 'r', x, y, w: snMin(q.w * k, snap, minW), h: snMin(q.h * k, snap, minW) }; }
      if (q.t === 'c') return { t: 'c', x: X(q.x), y: Y(q.y), r: Math.max(minW / 2, sn(q.r * k, snap / 2)) };
      if (q.t === 'o') return { t: 'o', x: X(q.x), y: Y(q.y), r: sn(q.r * k, snap / 2), w: lineW || q.w * k };
      if (q.t === 'p') return { t: 'p', pts: q.pts.map(([x, y]) => [X(x), Y(y)]) };
      return { t: 'b', x1: X(q.x1), y1: Y(q.y1), x2: X(q.x2), y2: Y(q.y2), w: lineW ? Math.max(2, sn(q.w * k, snap)) : q.w * k };
    });
  };

  // ---------- drawing
  const svgPrims = (prims, mode, sw) => prims.map(q => {
    const fill = mode === 'fill' ? 'currentColor' : 'none', st = mode === 'fill' ? 'none' : 'currentColor';
    const a = mode === 'fill' ? '' : ` stroke="${st}" stroke-width="${sw}" vector-effect="non-scaling-stroke"`;
    if (q.t === 'r') return `<rect x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" fill="${fill}"${a}/>`;
    if (q.t === 'c') return `<circle cx="${q.x}" cy="${q.y}" r="${q.r}" fill="${fill}"${a}/>`;
    if (q.t === 'p') return `<path d="M${q.pts.map(v => v.join(' ')).join('L')}Z" fill="${fill}"${a}/>`;
    if (q.t === 'o') return mode === 'fill'
      ? `<circle cx="${q.x}" cy="${q.y}" r="${q.r}" fill="none" stroke="currentColor" stroke-width="${q.w}"/>`
      : `<circle cx="${q.x}" cy="${q.y}" r="${q.r - q.w / 2}" fill="none"${a}/><circle cx="${q.x}" cy="${q.y}" r="${q.r + q.w / 2}" fill="none"${a}/>`;
    return mode === 'fill'
      ? `<path d="M${q.x1} ${q.y1}L${q.x2} ${q.y2}" stroke="currentColor" stroke-width="${q.w}" stroke-linecap="butt" fill="none"/>`
      : `<path d="M${q.x1} ${q.y1}L${q.x2} ${q.y2}" stroke="currentColor" stroke-width="${sw}" vector-effect="non-scaling-stroke" fill="none"/><path d="M${q.x1} ${q.y1}L${q.x2} ${q.y2}" stroke="currentColor" stroke-opacity=".18" stroke-width="${q.w}" stroke-linecap="butt" fill="none"/>`;
  }).join('');

  const COL = { paper: '#FAF5EA', field: '#F2EBDD', hair: '#E2D8C4', hair2: '#CDBFA4', pad: 'rgba(238,116,52,.10)', key: '#EE7434', ink: '#12293F', mod: '#B9AB8E' };
  G.COL = COL;

  // the empty grid at a magnification; px = screen px per canvas unit
  G.gridSVG = function (con, size, px, inner = '') {
    const s = con.sizes[size], N = s.canvas, W = N * px;
    let g = `<rect width="${N}" height="${N}" fill="${COL.paper}"/>`;
    // padding band
    if (!con.polar && s.pad) g += `<path fill-rule="evenodd" fill="${COL.pad}" d="M0 0H${N}V${N}H0ZM${s.pad} ${s.pad}V${N - s.pad}H${N - s.pad}V${s.pad}Z"/>`;
    // unit lines
    const step = con.scaled ? 1 : 1;
    for (let i = 0; i <= N; i += step) {
      const strong = con.module ? ((i - (s.pad % 2)) % 2 === 0) : false;
      const col = strong ? COL.mod : COL.hair, w = strong ? 1.2 : .6;
      g += `<path d="M${i} 0V${N}M0 ${i}H${N}" stroke="${col}" stroke-width="${w}" vector-effect="non-scaling-stroke"/>`;
    }
    const kl = `stroke="${COL.key}" stroke-width="1.2" fill="none" vector-effect="non-scaling-stroke"`;
    if (con.polar) {
      g += `<circle cx="12" cy="12" r="11" fill="none" stroke="${COL.hair2}" stroke-width="2"/>`; // the badge rim (optional)
      g += `<circle cx="12" cy="11.5" r="8" ${kl}/><circle cx="12" cy="11.5" r="5" ${kl} stroke-dasharray="1 1"/>`;
      g += `<path d="M6.34 5.84L17.66 17.16M17.66 5.84L6.34 17.16" ${kl} stroke-dasharray="1 1"/>`;
      g += `<path d="M3.5 11.5H20.5" ${kl} stroke-dasharray=".5 .5"/><path d="M3.5 12H20.5" stroke="${COL.hair2}" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray=".5 .5"/>`;
    } else {
      const L = s.live, o = s.pad, cx = N / 2;
      if (con.keylines.includes('circle')) g += `<circle cx="${cx}" cy="${cx}" r="${L / 2}" ${kl}/>`;
      if (con.keylines.includes('square')) { const q = con.keylines.length === 1 ? L : L - 2; g += `<rect x="${cx - q / 2}" y="${cx - q / 2}" width="${q}" height="${q}" ${kl}/>`; }
      if (con.keylines.includes('portrait')) { const w = L - 4; g += `<rect x="${cx - w / 2}" y="${o}" width="${w}" height="${L}" ${kl} stroke-dasharray="1.5 1"/>`; }
      if (con.keylines.includes('landscape')) { const h = L - 4; g += `<rect x="${o}" y="${cx - h / 2}" width="${L}" height="${h}" ${kl} stroke-dasharray="1.5 1"/>`; }
    }
    return `<svg aria-hidden="true" viewBox="0 0 ${N} ${N}" width="${W}" height="${W}" style="display:block;flex:none;color:${COL.ink}">${g}${inner}</svg>`;
  };
  // a skeleton on its grid, magnified
  G.skelOnGrid = (con, prims, size, px) => G.gridSVG(con, size, px, `<g style="color:${COL.ink}">${svgPrims(G.place(con, prims, size), 'line', 1.4)}</g>`);
  // a skeleton at real size, filled as blocks; circle: draw the optional stroked circle (badge)
  G.skelReal = function (con, prims, size, ink, circle) {
    const s = con.sizes[size], N = s.canvas, m = G.place(con, prims, size);
    if (circle) {
      // the 24px badge: rim 2, glyph = the 18px master (or, for D, the badge canvas itself)
      const inner = con.polar ? svgPrims(m, 'fill') : `<g transform="translate(${(24 - 18) / 2} ${(24 - 18) / 2}) scale(${18 / con.sizes[18].canvas})">${svgPrims(G.place(con, prims, 18), 'fill')}</g>`;
      return `<svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" style="display:block;flex:none;color:${ink}"><circle cx="12" cy="12" r="11" fill="${COL.field}" stroke="currentColor" stroke-width="2"/>${inner}</svg>`;
    }
    return `<svg aria-hidden="true" viewBox="0 0 ${N} ${N}" width="${size}" height="${size}" style="display:block;flex:none;color:${ink}">${svgPrims(m, 'fill')}</svg>`;
  };
})(typeof window !== 'undefined' ? (window.GRID = {}) : (globalThis.GRID = {}));
