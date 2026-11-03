// sheet2.js <out.png> [rows.png] : contact sheet 2. Every glyph a system build: approved set from grid/svg/system/<size>,
// concepts from batch2/concepts/svg/<size> (the one-shot controls fall back to grid/svg/system). Per concept: 18 in the 24 ring
// (diamond for shapes) at true size, 24 in the 32 ring, 12 bare (a chip), and the 18 badge 4x for reading. Inks as set.
// The second image: rows of pins, the strongest per category mixed with the approved set at 18, as on the map and in the list.
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const SYS = path.join(__dirname, '../../grid/svg/system'), CON = path.join(__dirname, '../concepts/svg');
const rdf = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1] : null;
const rd = (id, size) => rdf(path.join(CON, String(size), `${id}.svg`)) || rdf(path.join(SYS, String(size), `${id}.svg`));
const INK = { cafe: '#6E4C22', bar: '#3D5A7A', museum: '#523875', nature: '#1E3A2B', restaurant: '#7A2436', landmark: '#4889A8', attraction: '#547326', venue: '#AF4B82', hotel: '#2E2433', shopping: '#8A7AA8', park: '#3F925B', neighbourhood: '#328177', street: '#5E2C17' };
const GREY = process.env.GREY;   // one grey for the shape-first read
const ink = k => GREY || INK[k];
// a badge: ring px (24 or 32), its rim 4/3 or 5/3; glyphs are drawn in the ring's own 24 frame. 12: bare, 12px box (frame 16)
function badge(d, ringPx, k, diamond) {
  const rw = ringPx === 32 ? 5 / 3 : 4 / 3, c = ringPx / 2, I = ink(k);
  const shell = diamond ? `<polygon points="${c},${rw / 2} ${ringPx - rw / 2},${c} ${c},${ringPx - rw / 2} ${rw / 2},${c}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}" stroke-linejoin="round"/>`
    : `<circle cx="${c}" cy="${c}" r="${c - rw / 2}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}"/>`;
  return `<svg width="${ringPx}" height="${ringPx}" viewBox="0 0 ${ringPx} ${ringPx}">${shell}${d ? `<svg width="${ringPx}" height="${ringPx}" viewBox="0 0 24 24"><path fill="${I}" fill-rule="evenodd" d="${d}"/></svg>` : ''}</svg>`;
}
const big = (d, k, diamond, sc = 4) => `<div style="width:${24 * sc}px;height:${24 * sc}px">${badge(d, 24, k, diamond).replace(/^<svg width="24" height="24"/, `<svg width="${24 * sc}" height="${24 * sc}"`)}</div>`;
const bare = (d, k) => d ? `<svg width="16" height="16" viewBox="0 0 24 24"><path fill="${ink(k)}" fill-rule="evenodd" d="${d}"/></svg>` : '<span style="color:#a00;font-size:10px">no 12</span>';
const ROWS = JSON.parse(fs.readFileSync(path.join(__dirname, 'rows2.json'), 'utf8'));
const css = `body{margin:24px;background:#FAF5EA;font:15px/1.3 -apple-system,Helvetica,Arial,sans-serif;color:#12293F;width:1150px}
h1{font-size:24px;margin:0 0 4px} h2{font-size:18px;margin:20px 0 6px} .sub{color:#5A564C;margin-bottom:12px}
.r{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start} .c{width:270px} .b{display:flex;gap:12px;align-items:center}
.l{margin-top:4px;font-size:14px} .ap{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.set{background:#fff8ec;border:1px solid #e3d8c3;border-radius:8px;padding:10px 12px;margin-bottom:6px} .k{color:#a00;font-weight:600}`;
const appr = ['cafe', 'bar', 'museum', 'nature', 'restaurant'];
let html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><h1>Icons batch 2: contact sheet 2 (concepts finished, ${GREY ? 'one grey' : 'set inks'})</h1>
<div class="sub">Every glyph built by the system from concepts/decl.js. Each cell: 18 in the 24 ring · 24 in the 32 ring · 12 bare (chip) · the 18 badge 4x. <span class="k">KILL</span> = proposed kill (reasons in the concept file).</div>
<div class="set"><b>Approved set</b> (18 · 24 · 12)<div class="ap">${appr.map(a => badge(rd(a, 18), 24, a)).join('')}<span style="width:14px"></span>${appr.map(a => badge(rd(a, 24), 32, a)).join('')}<span style="width:14px"></span>${appr.map(a => bare(rd(a, 12), a)).join('')}</div></div>`;
for (const [key, name, items] of ROWS.cats) {
  const dia = key === 'neighbourhood' || key === 'street';
  html += `<h2>${name}</h2><div class="r">`;
  for (const [id, label, kill] of items)
    html += `<div class="c"><div class="b">${badge(rd(id, 18), 24, key, dia)}${badge(rd(id, 24), 32, key, dia)}${bare(rd(id, 12), key)}${big(rd(id, 18), key, dia)}</div><div class="l">${kill ? '<span class="k">KILL</span> ' : ''}<b>${id}</b> ${label}</div></div>`;
  html += `</div>`;
}
html += `</body></html>`;
// the rows-of-pins view: map-like strips (pins at 18 in the 24 ring, tight, mixed) and a list (rows 56px, badge + name)
let rows = `<!doctype html><html><head><meta charset="utf-8"><style>${css} .strip{display:flex;gap:6px;flex-wrap:wrap;background:#E9E2D0;padding:10px;border-radius:8px;width:380px}
.list{width:390px;background:#FAF5EA;border:1px solid #e3d8c3;border-radius:8px} .row{height:44px;display:flex;align-items:center;gap:12px;padding:0 16px;border-bottom:1px solid #eee3cf;font-size:16px}
.chips{display:flex;gap:6px;flex-wrap:wrap;width:390px} .chip{display:flex;gap:5px;align-items:center;border:1px solid #d9cfba;border-radius:14px;padding:4px 10px;font-size:13px;background:#fff8ec}</style></head><body>
<h1>Icons batch 2: pins in a row (${GREY ? 'one grey' : 'set inks'})</h1><div class="sub">Strongest per category (${ROWS.pick.map(p => p[1]).join(', ')}) mixed with the approved set. True size; screenshot at 3x.</div><div class="r" style="gap:28px">`;
const mix = ROWS.mixOrder.map(i => ROWS.pick[i] || [appr[i - ROWS.pick.length], appr[i - ROWS.pick.length]]);
const all = [...ROWS.pick, ...appr.map(a => [a, a])];
rows += `<div><b>Map, a crowd at 18</b><div class="strip">${[0, 1, 2].map(rep => ROWS.mixOrder.map(i => { const [k, id] = all[(i + rep * 5) % all.length]; return badge(rd(id, 18), 24, k, k === 'neighbourhood' || k === 'street'); }).join('')).join('')}</div>
<div style="margin-top:14px"><b>Chips at 12</b><div class="chips">${all.map(([k, id]) => `<span class="chip">${bare(rd(id, 12), k)}${k === "neighbourhood" ? "Neighborhood" : k === "cafe" ? "Café" : k[0].toUpperCase() + k.slice(1)}</span>`).join('')}</div></div>
<div style="margin-top:14px"><b>Selected at 24</b><div class="strip">${all.map(([k, id]) => badge(rd(id, 24), 32, k, k === 'neighbourhood' || k === 'street')).join('')}</div></div></div>`;
const names = { landmark: 'Hallgrímskirkja', attraction: 'Tivoli Gardens', venue: 'Jazzhus Montmartre', hotel: 'Hotel Borg', shopping: 'Rough Trade', park: 'Humlegården', neighbourhood: 'Gamla Stan', street: 'Laugavegur', cafe: 'Reykjavík Roasters', bar: 'Hotel Bar Kampen', museum: 'Moderna Museet', nature: 'Þingvellir', restaurant: 'Dill' };
rows += `<div><b>The list</b><div class="list">${all.map(([k, id]) => `<div class="row">${badge(rd(id, 18), 24, k, k === 'neighbourhood' || k === 'street')}<span>${names[k]}</span></div>`).join('')}</div></div></div></body></html>`;
const out = process.argv[2], out2 = process.argv[3];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
  for (const [o, h, dsf] of [[out, html, 2], [out2, rows, 3]]) { if (!o) continue;
    const tmp = o.replace(/\.png$/, '.html'); fs.writeFileSync(tmp, h);
    const p = await b.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: dsf }); await p.goto('file://' + tmp); await p.screenshot({ path: o, fullPage: true }); fs.unlinkSync(tmp); }
  await b.close();
})();
