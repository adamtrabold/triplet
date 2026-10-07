// Hanging Tag v5 (round 7, tag paper as state). Built on round 6's tag4.js. Hanging Tag v4 (round 6): the Segmented stub, with colour that means something and a better Visited moment.
// Page-side; injected after round 3's concepts.js (helpers on window.K2).
//   color: 'star'  — STARRED CARRIES THE COLOUR. The stub is ink on paper; a starred place's Star segment is printed
//                    solid in the city accent (--figure-deep) with paper type, like the coloured fields on the tags.
//          'cat'   — THE STUB IS PRINTED IN THE PIN'S COLOUR. The whole stub strip is the pin's category ink with paper
//                    type: the tear-off you keep matches the pin you tapped (the coloured airline stubs).
//          'two'   — TWO-INK. Ink everywhere; colour only on state: a starred star in --figure, VISITED in stamp navy.
//   visit: 'screen' — tap Visited: the tag's paper turns the filed tone of a visited row and the list's VISITED stamp
//                     lands across the tag's top corner. The segment reads "Visited" (undo = tap it again).
//          'hold'   — press and hold the Visited segment: a ring fills as the stamp comes down; release early = nothing.
//          'punch'  — v3's punch, kept as the baseline.
(() => {
  const H = window.K2;
  const { esc, rowStamp, select, pinScreen, movePinTo, anno, tapAt, bg, SHADOW, growMap } = H;
  const CHECK = STICKER_CHECK.row.d;
  const ic = id => `<svg class="k-ic" viewBox="0 0 24 24" aria-hidden="true"><use href="#g-${id}"/></svg>`;
  const ochk = () => `<svg class="W-ochk" viewBox="-1 -1 26 26" aria-hidden="true"><path d="${CHECK}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>`;
  const fchk = () => `<svg class="W-ochk" viewBox="-1 -1 26 26" aria-hidden="true"><path d="${CHECK}" fill="currentColor"/></svg>`;
  const NAVY = 'color-mix(in srgb, var(--navy) 82%, transparent)';

  const CSS = `
  .W { position: absolute; z-index: 1100; width: 316px; }
  .W-head { position: relative; height: 40px; }
  .W-head .k-x { top: 34px; right: 0; z-index: 2; }
  .W-in { position: relative; padding: 0 var(--s4); }
  .W-name { font-stretch: 62%; font-weight: 700; font-size: 26px; line-height: 28px; color: var(--ink); padding-right: 40px; }
  .W-addr { margin-top: 2px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .W-in .k-notes { margin-top: var(--s2); }
  .W-lab { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 8px; line-height: 10px; letter-spacing: .14em; color: var(--ink-2); }
  .W-val { font-stretch: 75%; text-transform: uppercase; font-weight: 500; font-size: 11px; line-height: 14px; letter-spacing: .08em; color: var(--ink-2); white-space: nowrap; }
  .W-fline { display: flex; gap: var(--s6); margin-top: var(--s3); padding-bottom: var(--s3); }
  .W-fline .f { display: flex; align-items: baseline; gap: 6px; }
  .W-stub { position: relative; height: 60px; display: grid; grid-template-columns: 1fr 1fr 1fr; }
  .W-seg { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding-top: 4px;
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--ink); }
  .W-seg + .W-seg { border-left: 1px dashed var(--hair); }
  .W-seg .k-ic { width: 18px; height: 18px; }
  .W-seg.dir .k-ic { width: 20px; height: 20px; }
  .W-ochk { width: 17px; height: 17px; display: block; flex: none; }
  .W-seg.vis.on { color: ${NAVY}; }
  /* colour: starred */
  .c-star .W-seg.star.on { color: var(--ink); }
  .W-seg.star.on { color: var(--ink); }
  .W-seg.star.on .k-ic { color: var(--star); }
  .segfill-paper .W-seg.star.on, .segfill-paper .W-seg.star.on .k-ic { color: var(--paper); }
  .segfill-navy .W-seg.star.on, .segfill-navy .W-seg.star.on .k-ic { color: var(--navy); }
  .segfill-paper .W-seg.star, .segfill-navy .W-seg.star { border-left-color: transparent; }
  .segfill-paper .W-seg.star + .W-seg, .segfill-navy .W-seg.star + .W-seg { border-left-color: transparent; }
  .k-so.k-so .segfill-paper .W-seg.star.on .k-ic, .k-so.k-so .segfill-navy .W-seg.star.on .k-ic { color: inherit; }   /* pink = the glyph only; the word stays ink (fewer starred signals) */   /* star ON = the filled black glyph (state-system exception 2); the pencilled ring is drawn in the SVG */
  /* colour: category stub */
  .c-cat .W-stub { color: var(--paper); }
  .c-cat .W-seg { color: var(--paper); }
  .c-cat .W-seg + .W-seg { border-left: 1px dashed rgba(250,245,234,.45); }
  .c-cat .W-seg.vis.on { color: var(--paper); }
  /* colour: two-ink */
  .c-two .W-seg.star.on { color: var(--ink); }   /* no colour: the app's black star, filled */
  /* screen-back: the tag goes to the filed paper of a visited row; the stamp sits on top */
  .W-seg .row-stamp { display: block; }
  .W-stampover { position: absolute; z-index: 3; pointer-events: none; }
  .W-stampover .row-stamp { display: block; }
  .W-hold { position: absolute; left: 50%; top: 50%; width: 40px; height: 40px; margin: -24px 0 0 -20px; }
  .W-hint { position: absolute; left: 0; right: 0; bottom: 4px; text-align: center; font-size: 8px; letter-spacing: .14em; color: var(--ink-2); }
  .W-signin { position: absolute; z-index: 1104; width: 316px; height: 44px; display: flex; align-items: center; box-sizing: border-box; padding: 0 0 0 var(--s4);
              background: var(--paper-raised); border: 0 solid var(--hair); border-width: 1px 0; color: var(--navy);
              font-family: var(--font-ui); font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 11px; line-height: 12px; letter-spacing: .08em; }
  .W-signin span { flex: 1; }
  .W-signin b { align-self: stretch; min-width: 44px; display: flex; align-items: center; padding: 0 var(--s4) 0 var(--s3); border-left: 1px solid var(--hair); text-decoration: underline; text-underline-offset: 3px; font-weight: 700; }
  .W-knot, .W-chad { position: absolute; z-index: 1103; pointer-events: none; line-height: 0; }
  .k-so .W-seg.star, .k-so .W-seg.vis { opacity: var(--state-off-alpha); }
  .k-so .W-seg.star.on .k-ic { color: var(--ink); }   /* disabled: no colour on a control; the filled star stays (state is still readable) */
  `;

  function shortAddr(P) {
    if (!P.address) return '';
    let parts = P.address.split(',').map(s => s.trim()).filter(Boolean);
    const nm = String(P.name).replace(/\s*\(approx\.\)\s*/i, '').toLowerCase();
    if (parts.length > 2 && (nm.includes(parts[0].toLowerCase()) || parts[0].toLowerCase().includes(nm.split(' ')[0]))) parts.shift();
    if (/^\d+[a-z]?$/i.test(parts[0]) && parts[1]) parts = [parts[1] + ' ' + parts[0], ...parts.slice(2)];
    return parts.slice(0, 2).join(' · ');
  }
  function pinVisited(P, v) {
    if (P.shape) return;
    const e = markersById.get(P.id); if (!e) return;
    const l = locations.find(x => x.id === P.id); l.visited = v; e.loc = l;
    e.marker.setIcon(markerIcon(l, highlightedId === P.id));
  }
  const typeWord = P => P.shape ? (P.shape.type === 'street' ? 'Street' : 'District') : (/\(approx\.\)/i.test(P.name) ? `${P.category} · approx.` : P.category);

  // step: '' | press | mid | land  (visited motion)   signin: true shows the sign-in offer after a tap on a greyed control
  window.TAG5 = (P, { segFill = '', press = false, paperMode = 'whole', color = 'star', visit = 'screen', vis: visO, step = '', so = false, signin = false } = {}) => {
    if (!document.getElementById('w4-css')) { const s = document.createElement('style'); s.id = 'w4-css'; s.textContent = CSS; document.head.appendChild(s); }
    if (so) document.body.classList.add('k-so');
    select(P);
    document.getElementById('locations').classList.add('collapsed'); growMap(60);
    movePinTo(P, 195, 112);
    const vis = (visO === undefined ? !!P.visited : visO) && step !== 'press';
    pinVisited(P, vis && step !== 'mid');
    const s = pinScreen(P);
    // No pin for shapes (owner): while its tag is open, a small dot at the area's middle (district label point /
    // street midpoint) is what the string hangs from. Owner: "Dot or something in the middle is fine".
    // 8px, the shape's own ink, on a 2px --paper ring (the map star's halo rule), so it reads on any fill or line.
    if (P.shape) { const k = document.createElement('div'); k.className = 'W-knot';
      k.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="var(--paper)"/><circle cx="7" cy="7" r="4" fill="${P.ink}"/></svg>`;
      k.style.left = (s.x - 7) + 'px'; k.style.top = (s.y - 7) + 'px'; document.body.appendChild(k); }
    const addr = shortAddr(P);
    const t = document.createElement('div'); t.className = `k W ${segFill && P.starred ? 'segfill-' + segFill : ''} c-${color}${paperMode === 'band' && P.starred ? ' band-on' : ''}`;
    const landed = vis && step !== 'mid';
    const visLabel = landed ? rowStamp(P.id, -6) : (step === 'mid' ? '<span style="height:32px"></span>' : ochk() + 'Mark visited');
    t.innerHTML = `<div class="W-head"><span class="k-x">×</span></div><div class="W-in"><div class="W-name">${esc(P.name)}</div>${addr ? `<div class="W-addr">${esc(addr)}</div>` : ''}${P.notes ? `<div class="k-notes">${esc(P.notes)}</div>` : ''}
      <div class="W-fline"><div class="f"><span class="W-lab">Type</span><span class="W-val">${esc(typeWord(P))}</span></div>${P.stop ? `<div class="f"><span class="W-lab">Plan</span><span class="W-val">${esc(P.stop)}</span></div>` : ''}</div></div>
      <div class="W-stub"><div class="W-seg dir">${ic('compass')}Directions</div><div class="W-seg star ${P.starred ? 'on' : ''}">${ic(P.starred ? 'star' : 'star-open')}${P.starred ? 'Starred' : 'Star'}</div>
      <div class="W-seg vis ${landed ? 'on' : ''}" role="button" aria-pressed="${landed}" aria-label="${landed ? 'Visited' : 'Mark visited'}">${visLabel}</div></div>`;
    document.body.appendChild(t);
    const screened = landed;
    const restTop = s.y + 44;
    t.style.left = (s.x - 158) + 'px'; t.style.top = restTop + 'px';
    const w = 316, h = t.getBoundingClientRect().height, c = 28, stubY = h - 60;
    const d = `M${c},0 H${w - c} L${w},${c} V${h} H0 V${c} Z`;
    const hole = `M158,18 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 Z`;
    const notches = `M0,${stubY - 5} a5,5 0 0,1 0,10 Z M${w},${stubY - 5} a5,5 0 0,0 0,10 Z`;
    const st = !!P.starred, vv = screened;
    const statePaper = st ? 'var(--paper-starred)' : vv ? 'var(--paper-filed)' : 'var(--paper-raised)';   // starred wins the paper; visited is also the stamp
    const paper = paperMode === 'whole' ? statePaper : (paperMode === 'band' || paperMode === 'none') ? (vv ? 'var(--paper-filed)' : 'var(--paper-raised)') : 'var(--paper-raised)';
    const tr = t.getBoundingClientRect(); const phEl = t.querySelector('.ph');
    const punched = visit === 'punch' && vis && phEl;
    const pz = 17, sc = pz / 24;
    const px = phEl ? phEl.getBoundingClientRect().left - tr.left : 0, py = phEl ? phEl.getBoundingClientRect().top - tr.top : 0;
    const checkT = `translate(${px},${py}) scale(${sc})`;
    // the stub's printed field (category colour), and the starred field are drawn here so they follow the die-cut
    const stubPath = `M0,${stubY} H${w} V${h} H0 Z`;
    const third = w / 3;
    let svg = `<defs>${SHADOW}<filter id="w4soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".5"/></filter>`
      + `<mask id="w4m"><rect x="-20" y="-20" width="${w + 40}" height="${h + 40}" fill="#fff"/>${punched ? `<path d="${CHECK}" transform="${checkT}" fill="#000"/>` : ''}<path d="${hole}" fill="#000"/><path d="${notches}" fill="#000"/></mask>`
      + `<clipPath id="w4h"><path d="${CHECK}" transform="${checkT}"/></clipPath></defs>`
      + (punched ? `<g clip-path="url(#w4h)"><path d="${CHECK}" transform="${checkT}" fill="none" stroke="#1A1A18" stroke-opacity=".34" stroke-width="1.8" filter="url(#w4soft)"/></g>` : '')
      + `<g mask="url(#w4m)"><path d="${d}" fill="${paper}" filter="url(#kshadow)"/><path d="${d}" fill="none" stroke="rgba(107,74,40,.22)" stroke-width="1"/>`
      + (press ? (() => { const segPaper = paperMode === 'whole' ? statePaper : paper; const pc = segPaper.includes('starred') ? 'var(--paper-starred-press)' : segPaper.includes('filed') ? 'var(--state-press-filed)' : 'var(--state-press)'; return `<rect x="${third}" y="${stubY}" width="${third}" height="${h - stubY}" fill="${pc}"/>`; })() : '')
      + (paperMode === 'stub' ? `<path d="${stubPath}" fill="${statePaper}"/>` : '')
      + (segFill && st ? `<rect x="${third}" y="${stubY}" width="${third}" height="${h - stubY}" fill="var(--star)" opacity="${so ? 0.4 : 1}"/>` : '')
      + (paperMode === 'band' && st ? `<path d="M${c},0 H${w - c} L${w - 3},3 V3 L${w - 6},6 H6 L3,3 Z" fill="none"/><path d="M${c},0 H${w - c} L${w - 10},10 H10 Z" fill="var(--star)"/>` : '')
      + ''
      + `<path d="M138,6 H178 L182,10 V30 L178,34 H138 L134,30 V10 Z" fill="${screened ? 'var(--paper-pressed)' : 'var(--paper)'}"/></g>`
      + `<line x1="10" x2="${w - 10}" y1="${stubY}" y2="${stubY}" stroke="${color === 'cat' ? 'rgba(250,245,234,.6)' : 'var(--hair)'}" stroke-width="1.5" stroke-dasharray="4 3"/>`
      + `<circle cx="158" cy="18" r="8.5" fill="none" stroke="var(--hair)" stroke-width="3.5"/>`
      + (color === 'star' && P.starred ? (() => { const cx = third * 1.5, cy = stubY + 31, rx = 40, ry = 19;
          // a hand-drawn loop: starts at the upper right, goes round once, overshoots and lifts (graphite = --ink at pencil weight)
          const pt = (a, k) => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
          let d = ''; for (let i = 0; i <= 44; i++) { const a = -0.55 - i * (2 * Math.PI + 0.75) / 44; const k = 1 + 0.08 * Math.sin(i / 3.1) + 0.05 * Math.sin(i / 1.7) - 0.10 * (i / 44); let [x, y] = pt(a, k); const rt = -0.12, dx = x - cx, dy = y - cy; x = cx + dx * Math.cos(rt) - dy * Math.sin(rt); y = cy + dx * Math.sin(rt) + dy * Math.cos(rt); d += (i ? ' L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
          return `<path d="${d}" fill="none" stroke="${segFill ? 'var(--navy)' : 'var(--ink)'}" stroke-opacity="${segFill ? '.85' : '.6'}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`; })() : '');
    if (visit === 'hold' && step === 'mid') {   // the hold ring fills around the segment's check
      const sx = third * 2.5, sy = stubY + 22, r = 15, L = 2 * Math.PI * r;
      svg += `<circle cx="${sx}" cy="${sy}" r="${r}" fill="none" stroke="${color === 'cat' ? 'rgba(250,245,234,.35)' : 'var(--hair)'}" stroke-width="2.5"/><circle cx="${sx}" cy="${sy}" r="${r}" fill="none" stroke="${color === 'cat' ? 'var(--paper)' : NAVY}" stroke-width="2.5" stroke-dasharray="${L * 0.62} ${L}" transform="rotate(-90 ${sx} ${sy})"/>`;
    }
    bg(t, w, h, svg, 16);
    t.querySelectorAll(':scope > div').forEach(x => { x.style.position = 'relative'; x.style.zIndex = 1; });
    t.querySelector('.W-stampover') && (t.querySelector('.W-stampover').style.position = 'absolute');
    const str = document.createElement('div'); str.className = 'k-layer'; Object.assign(str.style, { left: 0, top: 0, width: '390px', height: '844px', zIndex: 1101 });
    str.innerHTML = `<svg width="390" height="844"><line x1="${s.x}" y1="${s.y + (P.shape ? 6 : 13)}" x2="${s.x}" y2="${restTop + 10}" stroke="var(--ink-2)" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    document.body.appendChild(str);

    const vseg = t.querySelector('.W-seg.vis'), r = vseg.getBoundingClientRect();
    if (step === 'press') tapAt(r.left + r.width / 2, r.top + r.height / 2 - 4);
    

    const seg = t.querySelector('.W-seg.vis').getBoundingClientRect();
    if (step === 'mid') {   // the stamp comes down over the Visited segment, big and faint
      const o = document.createElement('div'); o.className = 'W-stampover'; o.innerHTML = rowStamp(P.id, -6);
      document.body.appendChild(o); o.style.zIndex = 1105;
      Object.assign(o.style, { left: (seg.left + seg.width / 2 - 36) + 'px', top: (seg.top + seg.height / 2 - 18) + 'px' });
      const st = o.querySelector('.row-stamp'); st.style.transform = `rotate(-12deg) scale(${window.__mid || 2})`; st.style.opacity = String(window.__midOp || .3); st.style.filter = 'blur(.5px)';
    }
    if (step === 'land') { const st = t.querySelector('.W-seg.vis .row-stamp'); st.style.transform = 'rotate(-6deg) scale(.9)'; }

    if (signin) {   // a tap on a greyed control: a sign-in slip slides out under the stub (it does not move the tag)
      const sl = document.createElement('div'); sl.className = 'k W-signin';
      sl.setAttribute('role', 'status'); sl.setAttribute('aria-live', 'polite');
      sl.innerHTML = `<span>Sign in to star and mark visited</span><b>Sign in</b>`;
      document.body.appendChild(sl); sl.style.top = (tr.bottom + 6) + 'px'; sl.style.left = tr.left + 'px';
      const st = t.querySelector('.W-seg.star').getBoundingClientRect(); tapAt(st.left + st.width / 2, st.top + st.height / 2 - 4);
    }
    return ['.W', '.W-knot', '.W-signin'];
  };
})();
