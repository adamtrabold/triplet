// Hanging Tag v2 (round 4, after the UX + CD reviews). Page-side; injected into the REAL app by render.js after
// round 3's concepts.js (which supplies the helpers on window.K2). Draws one state of the tag.
(() => {
  const H = window.K2;
  const { esc, rowStamp, select, pinScreen, movePinTo, anno, tapAt, bg, SHADOW, growMap } = H;

  const CSS = `
  .V { position: absolute; z-index: 1100; width: 316px; }
  .V-head { position: relative; height: 40px; display: flex; align-items: center; padding: 0 0 0 24px; }
  .V-head .k-meta { max-width: 118px; }
  .V-head .k-x { top: 0; right: 0; }
  .V-in { position: relative; padding: 2px var(--s4) 0; }
  .V-name { font-stretch: 62%; font-weight: 700; font-size: 26px; line-height: 28px; color: var(--ink); }
  .V-addr { margin-top: 2px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .V-in .k-notes { margin-top: var(--s2); }
  .V-in .k-acts { margin-top: var(--s1); }
  .V-stub { position: relative; height: 52px; padding: 4px var(--s4) 0; display: flex; align-items: center; gap: 6px;
            font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 11px; letter-spacing: .1em; color: var(--ink); }
  .V-stub.on { color: color-mix(in srgb, var(--navy) 82%, transparent); }
  .V .k-ring { width: 14px; height: 14px; margin: 1px; box-shadow: inset 0 0 0 1.33px currentColor; }   /* = the star outline's 2/24 at 16px */
  .V-chad { position: absolute; z-index: 1102; pointer-events: none; }
  .V-knot { position: absolute; z-index: 1103; line-height: 0; pointer-events: none; }
  .k-so .V-stub, .k-so .k-btn.star { opacity: var(--state-off-alpha); }
  `;
  const CHECK = STICKER_CHECK.row.d;

  // Short address (owner: "#1 since there's a directions button"): street + number · neighbourhood. Same rule as
  // Card File's shortAddr() (round4/file/concepts.js), joined with the owner's "·": drop a leading segment that
  // repeats the place's name, join a bare house number to its street, keep the next segment as the neighbourhood.
  function shortAddr(P) {
    if (!P.address) return '';
    let parts = P.address.split(',').map(s => s.trim()).filter(Boolean);
    const nm = String(P.name).replace(/\s*\(approx\.\)\s*/i, '').toLowerCase();
    if (parts.length > 2 && (nm.includes(parts[0].toLowerCase()) || parts[0].toLowerCase().includes(nm.split(' ')[0]))) parts.shift();
    if (/^\d+[a-z]?$/i.test(parts[0]) && parts[1]) parts = [parts[1] + ' ' + parts[0], ...parts.slice(2)];
    return parts.slice(0, 2).join(' · ');
  }
  // the pin tells the same story as the stub: visited = the shipped dark sticker with the cream check
  function pinVisited(P, v) {
    if (P.shape) return;
    const e = markersById.get(P.id); if (!e) return;
    const l = locations.find(x => x.id === P.id); l.visited = v; e.loc = l;
    e.marker.setIcon(markerIcon(l, highlightedId === P.id));
  }

  // mode: rest | tap (before the pan) | settle (pan + list lowering) | pop1 | pop2 | pop3 | swap
  // stub: off | punch | stamp ; stubm: '' | 'press' | 'fly' (visited motion step)
  window.TAG2 = (P, { mode = 'rest', stub = null, stubm = '', so = false } = {}) => {
    if (!document.getElementById('v-css')) { const s = document.createElement('style'); s.id = 'v-css'; s.textContent = CSS; document.head.appendChild(s); }
    if (so) document.body.classList.add('k-so');
    select(P);
    if (mode === 'tap') { movePinTo(P, 195, 330); const s = pinScreen(P); tapAt(s.x, s.y); anno(s.y + 40, 'tap the pin (wherever it is)'); return ['body']; }
    document.getElementById('locations').classList.add('collapsed'); growMap(60);
    movePinTo(P, 195, 112);
    const vis = stub ? stub !== 'off' : !!P.visited;
    const kind = stub && stub !== 'off' ? stub : 'punch';
    const showVis = vis && stubm !== 'press';
    pinVisited(P, showVis || (!stub && !!P.visited));
    const s = pinScreen(P);
    // a district has no pin: while its tag is open its own diamond seal (the mark Plans uses for shape stops)
    // sits at the anchor as the knot the string comes out of
    if (P.shape) { const k = document.createElement('div'); k.className = 'V-knot'; k.innerHTML = badgeHtml('district', 'diamond', 28, { ink: P.ink, fill: '#F2EBDD', mark: P.ink, rim: 2 }); k.style.left = (s.x - 14) + 'px'; k.style.top = (s.y - 14) + 'px'; document.body.appendChild(k); }
    if (mode === 'settle') { anno(s.y + 60, 'the map pans the pin up and the list lowers (~250ms); nothing is tappable yet'); return ['body']; }
    const t = document.createElement('div'); t.className = 'k V';
    const addr = shortAddr(P);
    const stubInner = !showVis ? `<span class="k-ring"></span>Mark visited`
      : kind === 'stamp' ? rowStamp(P.id, -5)
      : `<span style="display:inline-block;width:30px"></span>Visited`;
    t.innerHTML = `<div class="V-head">${H.meta(P, false)}<span class="k-x">×</span></div>
      <div class="V-in"><div class="V-name">${esc(P.name)}</div>${addr ? `<div class="V-addr">${esc(addr)}</div>` : ''}${P.notes ? `<div class="k-notes">${esc(P.notes)}</div>` : ''}
        <div class="k-acts">${H.dirBtn()}${H.starBtn(P)}</div></div>
      <div class="V-stub ${showVis ? 'on' : ''}">${stubInner}</div>`;
    document.body.appendChild(t);
    if (!P.notes && !addr) t.querySelector('.k-acts').style.marginTop = '4px';
    const restTop = s.y + 44;
    t.style.left = (s.x - 158) + 'px'; t.style.top = restTop + 'px';
    const w = 316, h = t.getBoundingClientRect().height, c = 28, stubY = h - 52;
    const d = `M${c},0 H${w - c} L${w},${c} V${h} H0 V${c} Z`;
    const hole = `M158,18 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 Z`;
    const notches = `M0,${stubY - 5} a5,5 0 0,1 0,10 Z M${w},${stubY - 5} a5,5 0 0,0 0,10 Z`;
    // the punch: a 28px check-shaped HOLE. The map shows through it, in the tag's own shadow (darker), with a
    // soft shadow edge along the hole's upper rim. No outline.
    const punched = showVis && kind === 'punch';
    const pz = 28, px = 14, py = stubY + 4 + 24 - pz / 2 - 1, sc = pz / 24;
    const checkT = `translate(${px},${py}) scale(${sc})`;
    const dim = so ? 0.4 : 1;
    let svg = `<defs>${SHADOW}<filter id="vsoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.1"/></filter>`
      + `<mask id="vpunch"><rect x="-20" y="-20" width="${w + 40}" height="${h + 40}" fill="#fff"/>${punched ? `<path d="${CHECK}" transform="${checkT}" fill="#000"/>` : ''}<path d="${hole}" fill="#000"/><path d="${notches}" fill="#000"/></mask>`
      + `<clipPath id="vhole"><path d="${CHECK}" transform="${checkT}"/></clipPath></defs>`
      + (punched ? `<g opacity="${dim}"><path d="${CHECK}" transform="${checkT}" fill="#1A1A18" fill-opacity=".26"/><g clip-path="url(#vhole)"><path d="${CHECK}" transform="translate(${px},${py - 2.2}) scale(${sc})" fill="none" stroke="#1A1A18" stroke-opacity=".45" stroke-width="3" filter="url(#vsoft)"/></g></g>` : '')
      + `<path d="${d}" fill="var(--paper-raised)" filter="url(#kshadow)" mask="url(#vpunch)"/>`
      + `<line x1="10" x2="${w - 10}" y1="${stubY}" y2="${stubY}" stroke="var(--hair)" stroke-width="1.5" stroke-dasharray="4 3"/>`
      + `<circle cx="158" cy="18" r="8.5" fill="none" stroke="#CFC5B1" stroke-width="3.5"/>`;   // a neutral paper grommet
    if (stubm === 'press' && kind === 'punch') svg += `<path d="${CHECK}" transform="${checkT}" fill="#1A1A18" fill-opacity=".10"/>`;
    bg(t, w, h, svg, 16);
    t.querySelectorAll(':scope > div').forEach(x => { x.style.position = 'relative'; x.style.zIndex = 1; });

    // the string: straight, from the pin's foot (or the district's seal) to the eyelet
    const str = document.createElement('div'); str.className = 'k-layer'; Object.assign(str.style, { left: 0, top: 0, width: '390px', height: '844px', zIndex: 1101 });
    document.body.appendChild(str);
    const setString = (topY) => { str.innerHTML = `<svg width="390" height="844"><line x1="${s.x}" y1="${s.y + 13}" x2="${s.x}" y2="${topY + 10}" stroke="#7A6A55" stroke-width="1.5" stroke-linecap="round"/></svg>`; };
    setString(restTop);

    // pop-out: after the pan and the list have settled, the tag grows out of the pin's foot, drops past its rest so
    // the string pulls taut, bounces once, hangs still (~280ms). Targets go live at rest.
    t.style.transformOrigin = '158px 0';
    if (mode === 'pop1') { t.style.top = (s.y + 15) + 'px'; t.style.transform = 'scale(.22)'; setString(s.y + 15); anno(s.y + 120, 'grows out of the pin’s foot (0–80ms)'); }
    if (mode === 'pop2') { t.style.top = (restTop + 14) + 'px'; t.style.transform = 'scale(1, 1.02)'; setString(restTop + 14); anno(restTop + h + 30, 'drops past its rest; the string pulls straight (80–200ms)'); }
    if (mode === 'pop3') { t.style.top = (restTop - 3) + 'px'; setString(restTop - 3); anno(restTop + h + 30, 'bounces once and hangs still (200–280ms); taps go live'); }
    if (mode === 'swap') {   // one tap on any visible pin swaps to its tag
      const tr = t.getBoundingClientRect(); let best = null;
      markersById.forEach((e, id) => { if (id === P.id || !e.marker._icon) return; const r = e.marker._icon.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (cy < 140 || cy > 770 || cx < 30 || cx > 360) return; if (cx > tr.left - 8 && cx < tr.right + 8 && cy > tr.top - 8 && cy < tr.bottom + 8) return; if (!best || cy < best[1]) best = [cx, cy]; });
      if (best) { tapAt(best[0], best[1]); anno(best[1] + 30, 'one tap on another pin: its tag replaces this one'); }
    }

    // stub visited motions
    const st = t.querySelector('.V-stub');
    if (stubm === 'press') { const r = st.getBoundingClientRect(); tapAt(r.left + 40, r.top + r.height / 2); }
    if (stubm === 'fly' && kind === 'punch') {   // the check-shaped chad falls out of the punch
      const r = t.getBoundingClientRect(); const ch = document.createElement('div'); ch.className = 'V-chad';
      ch.innerHTML = `<svg width="30" height="30" viewBox="-1 -1 26 26"><path d="${CHECK}" fill="#FAF5EA" stroke="#7A6A55" stroke-opacity=".6" stroke-width=".8"/></svg>`;
      Object.assign(ch.style, { left: (r.left + px + 26) + 'px', top: (r.top + py + 44) + 'px', transform: 'rotate(34deg)', filter: 'drop-shadow(0 3px 3px rgba(26,26,24,.35))' });
      document.body.appendChild(ch); anno(r.bottom + 62, 'punched: the check-shaped chad drops out and fades');
    }
    if (stubm === 'fly' && kind === 'stamp') { const m = st.querySelector('.row-stamp'); m.style.transform = 'rotate(-11deg) scale(1.5)'; m.style.opacity = '.35'; m.style.filter = 'blur(.5px)'; anno(st.getBoundingClientRect().bottom + 30, 'the stamp comes down (grow, faint), then lands with a shrink'); }
    return ['.V', '.V-chad', '.V-knot'];
  };
})();
