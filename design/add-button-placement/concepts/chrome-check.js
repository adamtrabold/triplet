// Director's recurring blocker: every state frame is checked against the top-right badge, the zoom control and
// the OSM credit. Returns the overlaps (element pairs whose visible boxes intersect by > 1px), [] when clean.
module.exports = page => page.evaluate(() => {
  const vis = e => { if (!e) return null; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return null;
    const r = e.getBoundingClientRect(); return r.width && r.height && r.bottom > 0 && r.top < innerHeight ? r : null; };
  const chrome = { badge: '#accountBtn', zoom: '.leaflet-control-zoom', credit: '.leaflet-control-attribution', pin: '#pencilPin' };
  const content = { form: '#controls', tag: '.tag-popup .tag-body', blankTag: '#blankTag', results: '#addressAutocomplete.show', pin: '#pencilPin', strip: '#strip', bar: '#pinBar', filters: '#filtersPanel.visible', stub: '#nb', ...chrome };
  const out = [];
  for (const [cn, cq] of Object.entries(chrome)) { const a = vis(document.querySelector(cq)); if (!a) continue;
    for (const [xn, xq] of Object.entries(content)) { if (xn === cn) continue; const b = vis(document.querySelector(xq)); if (!b) continue;
      const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (w > 1 && h > 1) out.push(`${cn}x${xn}`); } }
  return [...new Set(out.map(s => s.split('x').sort().join('x')))];
});
