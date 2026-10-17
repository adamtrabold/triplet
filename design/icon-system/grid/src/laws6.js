// The three corner laws (g2, frame.js) at the decided 1.5px line: every radius and length
// threshold x 0.75 (they were set for a 2px line). Radii in screen px at the size drawn.
'use strict';
const K = 0.75;
const LAWS6 = {
  joint(c) {
    if (c.convex) {
      if (c.angle < 75) return 0.3 * K;
      if (c.angle > 105) return 1.0 * K;
      if (Math.min(c.lin, c.lout) <= 2.6 * K) return 0.35 * K;
      return 0.6 * K;
    }
    if (c.angle < 75) return 0.3 * K;
    return 1.1 * K;
  },
  wear(c) {
    const f = 1 / Math.sin((c.angle * Math.PI / 180) / 2) - 1;
    if (c.convex) return Math.min(2.5 * K, Math.max(0.2 * K, (0.38 * K) / f));
    return Math.min(0.6 * K, Math.max(0.15 * K, (0.08 * K) / f));
  },
  press(c) { return c.convex ? 0.3 * K : (c.angle < 75 ? 0.6 * K : 1.5 * K); },
};
const LAW_NAMES = { joint: 'By joint', wear: 'Even wear', press: 'Pressed' };
module.exports = { LAWS6, LAW_NAMES };
