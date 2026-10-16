// Round g2: ONE frame (the team's call) and the two choices the owner can see.
//   Frame: a separate drawing per size. 24 badge and 32 selected pin on the pixel grid
//   (1 unit = 1 screen px); the 12 chip on the 2px module (6 x 6 modules).
//   Choice 1: the corner law (by joint, even wear, pressed).
//   Choice 2: fullness in the circle (live Ø16 = 2px of air, or Ø17 = 1.5px).
// Every number here is the team's, not the owner's.
'use strict';
const E = require('./engine.js');
const { A24, X12, NAMES } = require('./picks.js');

// ---- corner laws, radii in screen px at the size drawn -------------------------------------
// Each puts the softness in a DIFFERENT place, so they differ in kind, not by tenths:
//   by joint   - in the joins (strokes grow into each other); cut ends and outer edges stay crisp
//   even wear  - on the outer silhouette (every outside corner worn the same depth); joins stay tight
//   pressed    - in the inside corners (ink pools where edges meet); outside edges stay sharp
const LAWS = {
  joint(c) {
    if (c.convex) {
      if (c.angle < 75) return 0.3;                       // a tip stays a point
      if (c.angle > 105) return 1.0;                      // an obtuse shoulder is eased
      if (Math.min(c.lin, c.lout) <= 2.6) return 0.35;    // the cut end of a line: crisp
      return 0.6;                                         // the outside corner of a mass
    }
    if (c.angle < 75) return 0.3;                         // a narrow notch stays open
    return 1.1;                                           // a join: a full fillet
  },
  wear(c) {
    const f = 1 / Math.sin((c.angle * Math.PI / 180) / 2) - 1;
    if (c.convex) return Math.min(2.5, Math.max(0.2, 0.38 / f));   // every outside corner worn 0.38px deep
    return Math.min(0.6, Math.max(0.15, 0.08 / f));                 // inside corners barely touched
  },
  press(c) { return c.convex ? 0.3 : (c.angle < 75 ? 0.6 : 1.5); }, // outside 0.3; inside, ink pools 1.5 (0.6 in a narrow notch, which still fills deepest)
};
const LAW_INFO = {
  joint: {
    name: 'By joint', short: 'joint',
    rule: 'The radius follows what the corner is: a join gets a full 1.1px fillet, a shoulder 1.0, the outside of a mass 0.6, the cut end of a line 0.35, a tip or a narrow notch 0.3.',
    personality: 'Strokes grow into each other: every join is filleted, as if the parts were cast or carved from one piece, while cut ends and tips stay crisp. The curve lives where strokes connect.',
    print: 'Closest to a carved or engraved block: the joins are shaped, the edges are cut.',
  },
  wear: {
    name: 'Even wear', short: 'wear',
    rule: 'Every outside corner is worn the same 0.38px deep, so the radius follows the angle: a 30° tip 0.2, a right angle 0.92, a 110° apex 1.7. Inside corners barely change (0.2).',
    personality: 'The outline is softened like a rubber stamp or a coin after years of use; strokes still meet in tight, clean joins. The curve lives on the silhouette.',
    print: 'Closest to a worn stamp or a screen stencil: the outer edge softens, the joins hold.',
  },
  press: {
    name: 'Pressed', short: 'press',
    rule: 'Outside corners 0.3px; inside corners fill 1.5px, as ink pools where two edges meet; a narrow notch 0.6, which still fills deepest because of its angle.',
    personality: 'Ink pools into every join and notch, so strokes look pressed together, webbed at the joins; outer edges stay sharp. The curve lives inside the corners.',
    print: 'Closest to letterpress "ink squeeze": ink pushed into the corners of the impression.',
  },
};

// ---- refit: the same skeleton redrawn larger, every line kept at 2px -------------------------
// k scales about (ox,oy) to (tx,ty), exactly (edges land on whole pixels in the drawing step).
// A rectangle side that is a 2px line keeps 2px, anchored on its edge nearest the centre (or its
// middle, if it straddles the centre), so lines that met still meet. Bars and rings keep their
// width; radii scale. An automatic first fit, to be tuned by hand in the drawing step.
function refit(prims, k, ox, oy, tx, ty) {
  const X = x => tx + (x - ox) * k, Y = y => ty + (y - oy) * k;
  const line = (a, F) => F(a + 1) - 1; // a 2px line keeps its width about its own centre
  // where the 2px lines' edges moved to, so a part that touched a line still touches it
  const MX = new Map(), MY = new Map();
  for (const q of prims) if (q.t === 'R') {
    if (Math.abs(q.w - 2) < 1e-6) { const x = line(q.x, X, ox); MX.set(q.x, x); MX.set(q.x + 2, x + 2); }
    if (Math.abs(q.h - 2) < 1e-6) { const y = line(q.y, Y, oy); MY.set(q.y, y); MY.set(q.y + 2, y + 2); }
  }
  const side = (a, w, F, c0, M) => {
    if (Math.abs(w - 2) < 1e-6) return [line(a, F, c0), 2];
    const a2 = M.has(a) ? M.get(a) : F(a), b2 = M.has(a + w) ? M.get(a + w) : F(a + w);
    return [a2, b2 - a2];
  };
  return prims.map(q => {
    const s = { ...q };
    if (q.t === 'R') { const [x, w] = side(q.x, q.w, X, ox, MX), [y, h] = side(q.y, q.h, Y, oy, MY); Object.assign(s, { x, y, w, h }); }
    if (q.t === 'C' || q.t === 'S' || q.t === 'O' || q.t === 'A') Object.assign(s, { cx: X(q.cx), cy: Y(q.cy), r: q.r * k });
    if (q.t === 'P') s.pts = q.pts.map(p => [X(p[0]), Y(p[1])]);
    if (q.t === 'B') Object.assign(s, { a: [X(q.a[0]), Y(q.a[1])], b: [X(q.b[0]), Y(q.b[1])] });
    return s;
  });
}

// ⌘ is built from its own parameters, not refit (its loops are too tight to round to half-pixels)
const { cmd } = require('./picks.js');

// sizes: badge24 (live Ø16 or Ø17), sel32 (the 24 refit x4/3: live Ø21.3 or Ø22.7), chip12
function prims(id, size, live = 16) {
  const k = live / 16;
  if (size === 'chip12') return X12[id];
  if (size === 'badge24') {
    if (id === 'landmark') return cmd(12, 12, 1.75 * k, 1.75 * k, 2);
    return k === 1 ? A24[id] : refit(A24[id], k, 12, 12, 12, 12);
  }
  if (size === 'sel32') {
    const kk = k * 4 / 3;
    if (id === 'landmark') return cmd(16, 16, 1.75 * kk, 1.75 * kk, 2);
    return refit(A24[id], kk, 12, 12, 16, 16);
  }
}
function glyph(id, size, law = 'joint', live = 16) {
  const info = [], centre = size === 'chip12' ? [6, 6] : size === 'sel32' ? [16, 16] : [12, 12];
  const r = E.build(prims(id, size, live), { law: LAWS[law], info, centre });
  return { ...r, curves: E.countCurves(r.d), info };
}

module.exports = { LAWS, LAW_INFO, NAMES, glyph, prims, refit };
