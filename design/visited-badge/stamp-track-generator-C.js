// FALLBACK "C" for the visited stamp's perforated track -- NOT used by index.html.
// index.html ships "B2": a static SVG path mask in .row-stamp's --stamp-track /
// --stamp-track-1x custom properties. Swap this in only if the iPhone shows the
// B2 dots unevenly spaced (see README.md in this folder).
//
// Tested in Chromium 141 at 3x: 84 dots, gap spread 0.15-0.17px, spacing
// 1.91-2.05px, no seam (design loop r3, 2026-09-23).

// Perforated track for the visited stamp, drawn as a mask of evenly spaced
// dots on the TRUE parallel curve of the ring's outer edge. A second
// border-radius:50% box cannot do this: an ellipse inset from an ellipse
// is not a parallel curve, so the gap would swell and pinch around the
// shape. Built once at startup; every row shares it.
// Geometry (stamp box 72x32, CSS px): the ring's outer edge is the CSS
// ellipse RX x RY (ring box 64x24, border-radius:50%). Dot centres sit
// OFF px out from it along the normal, so the dots' outer tips land
// inside the 72x32 box edge (32 + 3.25 + 0.55 = 35.8).
function stampTrackMask(kind) {
  const RX = 32, RY = 12, OFF = 3.25, CX = 36, CY = 16, STEPS = 720;
  const pts = [], cum = [0];
  for (let i = 0; i <= STEPS; i++) {
    const t = -Math.PI / 2 + (2 * Math.PI * i) / STEPS;   // from top centre
    const c = Math.cos(t), s = Math.sin(t), k = Math.hypot(RY * c, RX * s);
    pts.push([CX + RX * c + OFF * RY * c / k, CY + RY * s + OFF * RX * s / k]);
    if (i) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const len = cum[STEPS];
  const at = (d) => {
    d = ((d % len) + len) % len;
    let i = 1; while (cum[i] < d) i++;
    const f = (d - cum[i - 1]) / (cum[i] - cum[i - 1]);
    return [pts[i - 1][0] + f * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + f * (pts[i][1] - pts[i - 1][1])];
  };
  const f2 = (n) => +n.toFixed(2);
  let body;
  if (kind === 'dots') {
    // Density and weight match the dotted border the owner approved
    // (Chromium drew 84 dots at a ~2px period; r=.55 matches its total
    // ink). N is a multiple of 4, so the pattern is symmetric on both
    // axes and there is no start/end seam.
    const N = 4 * Math.round(len / 8);
    body = Array.from({ length: N }, (_, k) => {
      const [x, y] = at((k * len) / N);
      return `<circle cx='${f2(x)}' cy='${f2(y)}' r='.55'/>`;
    }).join('');
  } else {
    // 1x fallback: dots this small rasterise to haze at 1 device px, so
    // draw short dashes on the same curve, same no-seam rule.
    const N = 4 * Math.round(len / 20), DASH = 3;
    body = Array.from({ length: N }, (_, k) => {
      const m = (k * len) / N;
      const p = [-0.5, -0.25, 0, 0.25, 0.5].map((f) => at(m + f * DASH).map(f2).join(' '));
      return `<polyline points='${p.join(' ')}'/>`;
    }).join('');
    body = `<g fill='none' stroke='#000' stroke-width='1.25'>${body}</g>`;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 32'>${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
document.documentElement.style.setProperty('--stamp-track', stampTrackMask('dots'));
document.documentElement.style.setProperty('--stamp-track-1x', stampTrackMask('dashes'));
