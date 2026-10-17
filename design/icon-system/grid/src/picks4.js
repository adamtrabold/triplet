// Round g4: the 13 as PARAMETRIC skeletons on grid A, built for any stroke width w (px).
// Coordinates are in the 12px box (0..12): the badge places it at 6..18, the chip uses it as is.
// Guides in box units: TOP 0, SHOULDER 4, MIDDLE 6, BASE 12.
// DETAIL RULE: every repeated part (tines, columns, spokes, slats, tiers, blocks, scallops) is as
// many as fit at that width with the gap rule kept; finer strokes therefore carry more detail.
// GAP RULE: a cut is 0.6w (at least 0.6px); a space between separate parts is w (at least 1px).
'use strict';
const { R, C, P, B, O, A, S, cut } = require('./engine.js');

const cutW = w => Math.max(0.6, 0.6 * w);
const space = w => Math.max(1, w);
const most = (opts, fits) => { for (const n of opts) if (fits(n)) return n; return opts[opts.length - 1]; };

function cmd(cx, cy, a, rho, w) {
  const k = a + rho, out = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) out.push(O(cx + sx * k, cy + sy * k, rho, w));
  out.push(B([cx - a, cy - k], [cx - a, cy + k], w), B([cx + a, cy - k], [cx + a, cy + k], w));
  out.push(B([cx - k, cy - a], [cx + k, cy - a], w), B([cx - k, cy + a], [cx + k, cy + a], w));
  return out;
}

const G4 = {
  restaurant(w) {
    const c = cutW(w), sp = space(w);
    const bw = Math.max(2.2, w + 1.2);
    const n = most([5, 4, 3, 2], n => n * w + (n - 1) * c + sp + bw <= 12 && n * w + (n - 1) * c <= 7);
    const fw = n * w + (n - 1) * c, total = fw + sp + bw, x0 = (12 - total) / 2;
    const out = [];
    for (let i = 0; i < n; i++) out.push(R(x0 + i * (w + c), 0, w, 4));
    const hh = Math.max(1.2, 1.2 * w), fc = x0 + fw / 2;
    out.push(R(x0, 4 - 0.01, fw, hh), P([x0, 4 + hh - 0.01], [x0 + fw, 4 + hh - 0.01], [fc + w / 2, 4 + hh + 1.5], [fc - w / 2, 4 + hh + 1.5]), R(fc - w / 2, 4 + hh + 1.4, w, 12 - (4 + hh + 1.4)));
    const kx = x0 + fw + sp;
    out.push(S(kx, bw, bw, -90, 0), R(kx, bw - 0.01, bw, 6.5 - bw), R(kx, 6.4, w, 5.6));
    return out;
  },
  cafe(w) {
    const c = cutW(w), out = [];
    const sh = w, cupB = 12 - sh - c;
    out.push(R(0, 12 - sh, 12, sh));                          // saucer
    out.push(R(0.5, 3, 7.5, cupB - 3 - 1.5), S(4.25, cupB - 1.5, 3.75, 0, 180)); // cup: body + round bottom
    const r = 1.4 + w / 2; out.push(O(8 + r - w / 2, 3 + r + 0.3, r, w)); // handle
    if (w <= 1.5) out.push(cut(R(0.5, 3 + Math.max(0.9, w), 7.5, c))); // rim band
    return out;
  },
  bar(w) {
    const c = cutW(w), out = [];
    out.push(C(6, -1.78, 5.78), cut(R(-20, -20, 64, 20)));     // bowl, rim on TOP, 4 deep
    out.push(R(6 - w / 2, 3.5, w, 12 - w - 3.5), R(2.5, 12 - w, 7, w));
    if (w <= 1.5) out.push(cut(R(-1, Math.max(0.9, w), 14, c)));  // the drink line
    return out;
  },
  venue(w) {
    const c = cutW(w), out = [], vh = Math.max(1.5, 1.2 * w);
    out.push(R(0, 0, 12, vh));
    const n = most([6, 5, 4, 3, 0], n => n === 0 || 12 / (2 * n) >= w * 0.9);
    let y0 = vh + c;
    if (n && w <= 1.75) { const r = 12 / (2 * n); for (let i = 0; i < n; i++) out.push(S(r + 2 * i * r, vh - 0.01, r, 0, 180)); y0 = vh + 12 / (2 * n) + c; }
    const dr = 5.5, dw = Math.max(w, 1.4);
    out.push(S(0, y0, dr, 0, 90), S(12, y0, dr, 90, 180), R(0, y0, dw, 12 - y0), R(12 - dw, y0, dw, 12 - y0));
    return out;
  },
  museum(w) {
    const c = cutW(w), out = [];
    out.push(P([0, 3], [6, 0], [12, 3]));
    let y = 3 + c;
    if (w <= 1.5) { out.push(R(0.5, y, 11, w)); y += w + c; }        // architrave
    const steps = w <= 1.25 ? 2 : 1, baseH = steps * w + (steps - 1) * c;
    const gc = Math.max(1.2, 1.4 * w);
    const n = most([7, 6, 5, 4, 3], n => n * w + (n - 1) * gc <= 10.5);
    const cw = n * w + (n - 1) * gc, x0 = 6 - cw / 2;
    for (let i = 0; i < n; i++) out.push(R(x0 + i * (w + gc), y, w, 12 - baseH - y + 0.01));
    out.push(R(0, 12 - w, 12, w));
    if (steps === 2) out.push(R(1, 12 - 2 * w - c, 10, w));
    return out;
  },
  landmark(w) { const rho = (6 - w / 2) / 2.9; return cmd(6, 6, rho * 0.9, rho, w); },
  attraction(w) {
    const out = [], Rr = 4.5 - w / 2, cy = 4.5;
    out.push(O(6, cy, Rr, w));
    const n = most([12, 10, 8, 6, 4], n => (2 * Math.PI * (Rr - w / 2)) / n >= 2.2 * w + 0.6);
    for (let i = 0; i < n / 2; i++) { const a = (i * 360 / n) * Math.PI / 180, dx = Math.cos(a) * Rr, dy = Math.sin(a) * Rr; out.push(B([6 - dx, cy - dy], [6 + dx, cy + dy], w)); }
    out.push(C(6, cy, Math.max(0.8, w * 0.9)));
    out.push(P([6 - 1.2, 8.6], [6 + 1.2, 8.6], [9, 12], [3, 12]));
    return out;
  },
  park(w) {
    const c = cutW(w), out = [], sh = Math.max(1.1, 1.1 * w);
    const n = most([4, 3, 2], n => n * sh + (n - 1) * c <= 5);
    for (let i = 0; i < n; i++) out.push(R(0.5, i * (sh + c), 11, sh));
    const seatY = n * (sh + c) + 0.2, seatH = Math.max(1.2, 1.2 * w);
    out.push(R(1.5, 0, w, seatY + 0.01), R(10.5 - w, 0, w, seatY + 0.01));
    out.push(R(0, seatY, 12, seatH));
    out.push(R(1.5, seatY + seatH - 0.01, w, 12 - seatY - seatH + 0.01), R(10.5 - w, seatY + seatH - 0.01, w, 12 - seatY - seatH + 0.01));
    return out;
  },
  nature(w) {
    const out = [], th = Math.max(1.5, 1.2 * w), tw = Math.max(1.2, w), H = 12 - th + 0.3;
    const n = w <= 1.1 ? 5 : w <= 1.6 ? 4 : 3, d = H / (n + 1);
    for (let i = 0; i < n; i++) { const top = i * d, base = top + 2 * d, hw = 2.2 + 3.8 * i / (n - 1); out.push(P([6, top], [6 + hw, base], [6 - hw, base])); }
    out.push(R(6 - tw / 2, H - 0.3, tw, th));
    return out;
  },
  shopping(w) {
    const c = cutW(w), out = [];
    out.push(P([1, 4], [11, 4], [12, 12], [0, 12]), A(6, 4, 3 - w / 2, w, 180, 360));
    if (w <= 1.5) out.push(cut(R(0, 4 + Math.max(1, 1.3 * w), 12, c)));
    return out;
  },
  hotel(w) {
    const c = cutW(w), out = [], mh = Math.max(2.2, 2 * w), ph = Math.max(1.2, w);
    out.push(R(0, 2, w, 10));
    const my = 12 - Math.max(1.6, 1.4 * w) - mh;
    out.push(R(w - 0.01, my, 12 - w + 0.01, mh));
    out.push(R(w + c, my - c - ph, 4, ph));
    out.push(R(12 - w, my + mh - 0.01, w, 12 - my - mh + 0.01));
    if (w <= 1.5) out.push(cut(R(6.5, my, c, mh)));                      // the blanket's fold
    return out;
  },
  neighbourhood(w) {
    const g = Math.max(1, w), n = most([4, 3, 2], n => (12 - (n - 1) * g) / n >= 2.2 * w);
    const b = (12 - (n - 1) * g) / n, out = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) out.push(R(i * (b + g), j * (b + g), b, b));
    return out;
  },
  street(w) {
    const r = 0.7 + 0.5 * w, hx = 7, hy = r;
    return [C(hx, hy, r), B([6.5, 2 * r + 0.6], [5.6, 7.2], w * 1.15), B([6.4, 2 * r + 1.4], [9, 6.2], w), B([6.4, 2 * r + 1.4], [3.6, 5.8], w),
      B([5.6, 7], [3, 12.6], w), B([5.6, 7], [8, 9.2], w), B([8, 8.8], [8, 12.6], w), cut(R(-20, 12, 64, 20))];
  },
};

// A FUTURE-ICON TEST: not one of the 13. "Library" built only from the written rules
// (stands on BASE; repeated parts as many as fit; cut and space rules; details only at w <= 1.5).
function library(w) {
  const c = cutW(w), sp = space(w), out = [];
  out.push(R(0, 12 - w, 12, w));                                       // the shelf, on BASE
  const bw = Math.max(1.6, 1.5 * w);                                   // a book is 1.5 lines wide
  const n = most([7, 6, 5, 4, 3], n => n * bw + (n - 1) * c + sp + 2.5 <= 12);
  const heights = [8, 10, 7, 11, 9, 8, 10];                            // spines reach between SHOULDER and TOP
  let x = 0;
  for (let i = 0; i < n; i++) { const h = heights[i]; out.push(R(x, 12 - w - h, bw, h + 0.01)); if (w <= 1.5) out.push(cut(R(x, 12 - w - h / 2, bw, c))); x += bw + c; }
  const lx = x - c + sp;                                               // one book leaning at 45°, against the last
  out.push(P([lx, 12 - w], [lx + bw * 1.41, 12 - w], [lx + bw * 1.41 + 5.2, 12 - w - 5.2], [lx + 5.2, 12 - w - 5.2]));
  out.push(cut(R(12, -20, 20, 40)));
  return out;
}
// what each width buys: the counts the detail rule chose
function details(w) {
  const c = cutW(w), sp = space(w);
  const bw = Math.max(2.2, w + 1.2);
  const tines = most([5, 4, 3, 2], n => n * w + (n - 1) * c + sp + bw <= 12 && n * w + (n - 1) * c <= 7);
  const gc = Math.max(1.2, 1.4 * w), columns = most([7, 6, 5, 4, 3], n => n * w + (n - 1) * gc <= 10.5);
  const Rr = 4.5 - w / 2, spokes = most([12, 10, 8, 6, 4], n => (2 * Math.PI * (Rr - w / 2)) / n >= 2.2 * w + 0.6);
  const sh = Math.max(1.1, 1.1 * w), slats = most([4, 3, 2], n => n * sh + (n - 1) * c <= 5);
  const tiers = w <= 1.1 ? 5 : w <= 1.6 ? 4 : 3;
  const g = Math.max(1, w), blocks = most([4, 3, 2], n => (12 - (n - 1) * g) / n >= 2.2 * w);
  return { tines, columns, spokes, slats, tiers, blocks, small: w <= 1.5, scallops: w <= 1.75 };
}

module.exports = { G4, library, details };
