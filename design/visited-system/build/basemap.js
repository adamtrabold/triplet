// The stamp-first mockup's stand-in basemap (the sandbox has no tiles), shared by stills.js and anim.js.
const BASEMAP = (W, H, far) => {
  const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const R = rng(far ? 77 : 42);
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="#F2EFE9"/>`;
  const water = () => `<path d="M0 ${H * .75} C ${W * .23} ${H * .71}, ${W * .41} ${H * .84}, ${W * .67} ${H * .81} S ${W} ${H * .84}, ${W} ${H * .84} L${W} ${H} L0 ${H}Z" fill="#AAD3DF"/><path d="M${W * .77} 0 C ${W * .74} ${H * .14}, ${W * .85} ${H * .25}, ${W * .82} ${H * .37} S ${W * .92} ${H * .54}, ${W} ${H * .57} L${W} 0Z" fill="#AAD3DF"/><path d="M20 60 l90 -10 l12 70 l-95 12z" fill="#CDEBB0"/><path d="M${W * .54} ${H * .54} l70 6 l-6 60 l-72 -8z" fill="#CDEBB0"/>`;
  s += water();
  const bsz = far ? 6 : 13;
  for (let y = 0; y < H; y += bsz + (far ? 4 : 7)) for (let x = 0; x < W; x += bsz + (far ? 4 : 7)) {
    if (R() < 0.3) continue; const w = bsz * (0.6 + R() * 0.8), h = bsz * (0.6 + R() * 0.7);
    s += `<rect x="${x + R() * 3}" y="${y + R() * 3}" width="${w}" height="${h}" fill="#D9D0C9" stroke="#C4B6AB" stroke-width="0.5"/>`; }
  s += water();
  const road = (d, w, fill, casing) => `<path d="${d}" fill="none" stroke="${casing}" stroke-width="${w + 1.5}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;
  for (let i = 0; i < Math.ceil(H / 52); i++) { const y = 20 + i * 52 + R() * 10; s += road(`M0 ${y} L${W} ${y + (R() - 0.5) * 40}`, far ? 2 : 5, '#FFFFFF', '#CFC5BA'); }
  for (let i = 0; i < Math.ceil(W / 58); i++) { const x = 15 + i * 58 + R() * 10; s += road(`M${x} 0 L${x + (R() - 0.5) * 50} ${H}`, far ? 2 : 5, '#FFFFFF', '#CFC5BA'); }
  s += road(`M0 ${H * .45} C ${W * .3} ${H * .41}, ${W * .5} ${H * .5}, ${W} ${H * .43}`, far ? 4 : 8, '#FCD6A4', '#D6A86C');
  s += road(`M${W * .36} 0 C ${W * .38} ${H * .32}, ${W * .31} ${H * .57}, ${W * .44} ${H}`, far ? 3 : 7, '#F7FABF', '#C6C88A');
  const poi = ['#734A08', '#AC39AC', '#0092DA', '#C77400', '#666666'];
  for (let i = 0; i < (far ? 14 : 34); i++) { const x = R() * W, y = R() * H, c = poi[Math.floor(R() * poi.length)];
    s += `<circle cx="${x}" cy="${y}" r="${far ? 2 : 3.2}" fill="${c}"/>`;
    if (!far && R() < 0.6) s += `<text x="${x + 6}" y="${y + 3}" font-size="9" fill="${c}" font-family="sans-serif">${['Café', 'Museum', 'Bank', 'Bakeri', 'Kiosk', 'Apotek'][i % 6]}</text>`; }
  return s + '</svg>';
};
// Paint the stand-in under the markers, in the tile pane (so the app's re-tone filter applies), at the current view.
const paintBase = (page, far) => page.evaluate(([html]) => {
  document.querySelectorAll('.__base').forEach(e => e.remove());
  const pane = document.querySelector('.leaflet-tile-pane'), p = map.containerPointToLayerPoint([0, 0]);
  const d = document.createElement('div'); d.className = '__base'; d.style.cssText = `position:absolute;left:${p.x}px;top:${p.y}px;z-index:500;pointer-events:none`;
  d.innerHTML = html; pane.appendChild(d);
}, [BASEMAP(390, 844, far)]);
module.exports = { BASEMAP, paintBase };
