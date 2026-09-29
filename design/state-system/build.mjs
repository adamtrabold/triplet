// Builds sheet.html + sheet.png (390px, 1x) from index.html's real <style>.
// Pressed is forced by rewriting :active -> .fa (force-active) in the copied CSS.
import { createRequire } from 'module';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '../../index.html'), 'utf8');
let css = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
css = css.replace(/:active/g, '.fa');

// PROPOSED: one rule per meaning, on existing tokens only. Scoped to .prop.
const proposed = `
.prop{
  --press-bg: var(--paper-pressed);            /* (a) pressed-in, everywhere paper */
  --on-bg: var(--navy); --on-fg: var(--paper); /* (b)(c) on / open / selected = reversed navy */
  --off-alpha: .4;                             /* (e)(f) unavailable / loading */
}
.prop #collapseBtn,.prop #sortBtn,.prop #toggleFiltersBtn,.prop #centerMeBtn{border-radius:3px;transition:background .12s ease,color .12s ease,opacity .15s ease}
.prop #collapseBtn.fa,.prop #sortBtn.fa,.prop #toggleFiltersBtn.fa,.prop #centerMeBtn.fa{opacity:1;background:var(--press-bg)}
.prop #sortBtn[aria-expanded="true"],.prop #toggleFiltersBtn.active{background:var(--on-bg);color:var(--on-fg);opacity:1}
.prop #centerMeBtn.loading,.prop #sortBtn.loading{opacity:var(--off-alpha)}
.prop .city-btn.fa:not(.active),.prop .filter-btn.fa{background:var(--press-bg)}
`;
const btnRow = (cls, label, states) => states.map(([s, c, attrs]) => `
  <div class="cell"><div class="hdr ${cls}">
    <button id="sortBtn" class="${c}" ${attrs||''}>${sortSvg}</button>
    <button id="toggleFiltersBtn" class="${c==='fa'?'fa':(s==='open'?'active':'')}">${filtSvg}</button>
    <button id="centerMeBtn" class="${c==='fa'?'fa':''}">${locSvg}</button></div><small>${s}</small></div>`).join('');
const sortSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="8" x2="8" y2="21"/><path d="M8 2.5L12.5 9h-9z" fill="currentColor" stroke="none"/><line x1="16" y1="3" x2="16" y2="16"/><path d="M16 21.5L11.5 15h9z" fill="currentColor" stroke="none"/></svg>`;
const filtSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="18" r="2" fill="currentColor"/></svg>`;
const locSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><line x1="12" y1="1" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="23"/><line x1="1" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="23" y2="12"/></svg>`;
// header: sort + filters shown in each state (idle / pressed / open); locate shows loading
const hdrCell = (state) => {
  const p = state==='pressed', o = state==='open';
  return `<div class="cell"><div class="hdr">
    <button id="sortBtn" class="${p?'fa':''}" aria-expanded="${o}">${sortSvg}</button>
    <button id="toggleFiltersBtn" class="${p?'fa':''}${o?' active':''}">${filtSvg}</button>
    <button id="centerMeBtn" class="${p?'fa':''}">${locSvg}</button></div><small>${state}</small></div>`;
};
const hdrGroup = (cls) => `<div class="col ${cls}">${['idle','pressed','open'].map(hdrCell).join('')}</div>`;
const chips = (cls) => `<div class="col ${cls}">
  <div class="cell"><div class="chips"><button class="city-btn">Reykjavik</button><button class="city-btn">Oslo</button><button class="filter-btn" style="--chip-ink:#B5532F"><span class="chip-glyph"><svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill="currentColor"/></svg></span>Food</button></div><small>idle</small></div>
  <div class="cell"><div class="chips"><button class="city-btn fa">Reykjavik</button><button class="city-btn">Oslo</button><button class="filter-btn fa" style="--chip-ink:#B5532F"><span class="chip-glyph"><svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill="currentColor"/></svg></span>Food</button></div><small>pressed</small></div>
  <div class="cell"><div class="chips"><button class="city-btn">Reykjavik</button><button class="city-btn active">Oslo</button><button class="filter-btn inactive"><span class="chip-glyph"><svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill="currentColor"/></svg></span>Food</button></div><small>selected / off</small></div></div>`;
const row = (extra) => `<div class="location-card ${extra}"><div class="row-badge" style="--row-ink:#B5532F"><svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/></svg></div><div class="row-main"><h3>Hallgrimskirkja</h3><div class="row-meta">Sight &middot; Reykjavik</div></div><div class="location-actions"></div></div>`;
const rows = (cls) => `<div class="${cls}">${['','fa','highlighted'].map((e,i)=>`<div class="rowcell">${row(e)}<small>${['idle','pressed','highlighted'][i]}</small></div>`).join('')}</div>`;

const html = `<!doctype html><meta charset=utf-8><style>${css}
html,body{margin:0;height:auto;overflow:visible;width:390px;background:var(--paper);position:static}
body{padding:16px 0}
.sh{font:700 11px/16px var(--font-ui);font-stretch:75%;text-transform:uppercase;letter-spacing:.12em;color:var(--ink-2);padding:12px 16px 6px}
.tt{display:grid;grid-template-columns:1fr 1fr;font:700 12px var(--font-ui);text-transform:uppercase;letter-spacing:.1em;padding:0 16px}
.tt span:last-child{color:var(--navy)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:0 8px;padding:0 16px}
.two .cell{padding:4px 0 8px}
.hdr{display:flex;gap:6px;padding:8px;background:var(--paper);border:1px solid var(--hair)}
.chips{display:flex;flex-wrap:wrap;gap:4px}
small{display:block;font:10px/14px var(--font-ui);color:var(--ink-2);text-transform:uppercase;letter-spacing:.08em;padding-top:2px}
.rowcell{border-top:1px solid var(--hair)}.rowcell small{padding:0 16px 4px}
.rowcell .location-card{position:relative}
${proposed}
</style>
<div class="sh">Header buttons</div><div class="tt"><span>Today</span><span>Proposed</span></div>
<div class="two">${hdrGroup('')}<div class="prop">${hdrGroup('')}</div></div>
<div class="sh">Chips (city + category)</div>
<div class="two">${chips('')}<div class="prop">${chips('')}</div></div>
<div class="sh">Rows: today (already the reference)</div>${rows('')}
<div class="sh">Rows: proposed (unchanged)</div><div class="prop">${rows('')}</div>
</html>`;
fs.writeFileSync(path.join(here, 'sheet.html'), html);
const exe = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium-'))[0];
const browser = await chromium.launch({ executablePath: `/opt/pw-browsers/${exe}/chrome-linux/chrome` });
const pg = await browser.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 1 });
await pg.goto('file://' + path.join(here, 'sheet.html'));
await pg.screenshot({ path: path.join(here, 'sheet.png'), fullPage: true });
await browser.close();
