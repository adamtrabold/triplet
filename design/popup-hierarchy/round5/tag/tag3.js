// Hanging Tag v3 (round 5). Page-side; injected after round 3's concepts.js (helpers on window.K2).
// Two variants of the stub + type treatment, from the owner's luggage-tag references (design/inspo/luggage-tags/):
//   seg   — SEGMENTED CLAIM STUB: the stub is three labelled segments (Directions | Star | Visited); type is a small
//           labelled field line ("TYPE  Bar   PLAN  Stop 2 of 3") under the note, like a tag's FLIGHT / DATE fields.
//   claim — CLAIM CHECK: the stub is the claim check with Directions centred; above the perforation a row of labelled
//           fields holds TYPE, STAR and VISITED (the tag's "check here" boxes); Visited is stamped into its field.
(() => {
  const H = window.K2;
  const { esc, rowStamp, select, pinScreen, movePinTo, anno, tapAt, bg, SHADOW, growMap } = H;
  const CHECK = STICKER_CHECK.row.d;
  const ic = id => `<svg class="k-ic" viewBox="0 0 24 24" aria-hidden="true"><use href="#g-${id}"/></svg>`;

  const CSS = `
  .W { position: absolute; z-index: 1100; width: 316px; }
  .W-head { position: relative; height: 40px; }
  .W-head .k-x { top: 0; right: 0; }
  .W-in { position: relative; padding: 0 var(--s4); }
  .W-name { font-stretch: 62%; font-weight: 700; font-size: 26px; line-height: 28px; color: var(--ink); padding-right: 20px; }
  .W-addr { margin-top: 2px; font-size: 13px; line-height: 18px; color: var(--ink-2); }
  .W-in .k-notes { margin-top: var(--s2); }
  /* labelled fields (the tags' FLIGHT / DATE / TO grammar): a tiny caps label, then the value */
  .W-lab { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 8px; line-height: 10px; letter-spacing: .14em; color: var(--ink-2); }
  .W-val { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 11px; line-height: 14px; letter-spacing: .08em; color: var(--ink); white-space: nowrap; }
  .W-fline { display: flex; gap: var(--s6); margin-top: var(--s3); padding-bottom: var(--s3); }
  .W-fline .f { display: flex; align-items: baseline; gap: 6px; }
  /* seg: the segmented stub */
  .W-stub { position: relative; height: 60px; display: grid; grid-template-columns: 1fr 1fr 1fr; }
  .W-seg { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; padding-top: 4px;
           font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 10px; line-height: 12px; letter-spacing: .1em; color: var(--ink); }
  .W-seg + .W-seg { border-left: 1px dashed var(--hair); }
  .W-seg.dir { color: var(--figure-deep); }
  .W-seg.on.vis { color: color-mix(in srgb, var(--navy) 82%, transparent); }
  .W-seg .ph { width: 18px; height: 18px; }
  /* claim: fields row + claim-check stub */
  .W-fields { display: grid; grid-template-columns: 1.25fr 1fr 1fr; margin-top: var(--s3); border-top: 1px solid var(--hair); }
  .W-fields .c { position: relative; min-height: 52px; padding: 6px 8px 6px 0; display: flex; flex-direction: column; justify-content: space-between; }
  .W-fields .c + .c { border-left: 1px solid var(--hair); padding-left: 10px; }
  .W-fields .ctl { display: flex; align-items: center; gap: 6px; font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 11px; line-height: 14px; letter-spacing: .08em; color: var(--ink); }
  .W-box { width: 16px; height: 16px; border-radius: 2px; box-shadow: inset 0 0 0 1.33px currentColor; flex: none; }
  .W-fields .c.vis.on .ctl { color: color-mix(in srgb, var(--navy) 82%, transparent); }
  .W-fields .row-stamp { position: absolute; left: 4px; bottom: 2px; }
  .W-claim { position: relative; height: 60px; display: flex; align-items: center; justify-content: center; gap: 8px; padding-top: 4px;
             font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 13px; letter-spacing: .12em; color: var(--figure-deep); }
  .W-claim .k-ic { width: 20px; height: 20px; }
  .W .k-ring { width: 14px; height: 14px; margin: 1px; border-radius: 50%; box-shadow: inset 0 0 0 1.33px currentColor; flex: none; }
  .W-chad, .W-knot { position: absolute; z-index: 1103; pointer-events: none; line-height: 0; }
  .k-so .W-seg.star, .k-so .W-seg.vis, .k-so .W-fields .c.star, .k-so .W-fields .c.vis { opacity: var(--state-off-alpha); }
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
  const typeWord = P => P.shape ? 'District' : (/\(approx\.\)/i.test(P.name) ? `${P.category} · approx.` : P.category);
  const stopWord = P => P.stop ? P.stop.replace(/^Stop /, '') : '';

  // variant: seg | claim ; vis: undefined (data) | true | false ; step: '' | press | fly
  window.TAG3 = (P, { variant = 'seg', vis: visO, step = '', so = false } = {}) => {
    if (!document.getElementById('w-css')) { const s = document.createElement('style'); s.id = 'w-css'; s.textContent = CSS; document.head.appendChild(s); }
    if (so) document.body.classList.add('k-so');
    select(P);
    document.getElementById('locations').classList.add('collapsed'); growMap(60);
    movePinTo(P, 195, 112);
    const vis = (visO === undefined ? !!P.visited : visO) && step !== 'press';
    pinVisited(P, vis);
    const s = pinScreen(P);
    if (P.shape) { const k = document.createElement('div'); k.className = 'W-knot'; k.innerHTML = badgeHtml('district', 'diamond', 28, { ink: P.ink, fill: '#F2EBDD', mark: P.ink, rim: 2 }); k.style.left = (s.x - 14) + 'px'; k.style.top = (s.y - 14) + 'px'; document.body.appendChild(k); }
    const addr = shortAddr(P);
    const t = document.createElement('div'); t.className = 'k W';
    const top = `<div class="W-head"><span class="k-x">×</span></div><div class="W-in"><div class="W-name">${esc(P.name)}</div>${addr ? `<div class="W-addr">${esc(addr)}</div>` : ''}${P.notes ? `<div class="k-notes">${esc(P.notes)}</div>` : ''}`;
    if (variant === 'seg') {
      t.innerHTML = top + `<div class="W-fline"><div class="f"><span class="W-lab">Type</span><span class="W-val">${esc(typeWord(P))}</span></div>${P.stop ? `<div class="f"><span class="W-lab">Plan</span><span class="W-val">Stop ${esc(stopWord(P))}</span></div>` : ''}</div></div>
        <div class="W-stub"><div class="W-seg dir">${ic('compass')}Directions</div><div class="W-seg star">${ic(P.starred ? 'star' : 'star-open')}${P.starred ? 'Starred' : 'Star'}</div>
        <div class="W-seg vis ${vis ? 'on' : ''}">${vis ? '<span class="ph"></span>Visited' : '<span class="k-ring"></span>Mark visited'}</div></div>`;
    } else {
      t.innerHTML = top + `<div class="W-fields"><div class="c"><span class="W-lab">Type${P.stop ? ' · Plan' : ''}</span><span class="W-val">${esc(typeWord(P))}${P.stop ? ` · ${esc(stopWord(P))}` : ''}</span></div>
          <div class="c star"><span class="W-lab">Starred</span><span class="ctl">${ic(P.starred ? 'star' : 'star-open')}${P.starred ? 'Yes' : 'Star'}</span></div>
          <div class="c vis ${vis ? 'on' : ''}"><span class="W-lab">Visited</span>${vis ? rowStamp(P.id, -6) : '<span class="ctl"><span class="W-box"></span>Mark</span>'}</div></div></div>
        <div class="W-claim">${ic('compass')}Directions</div>`;
    }
    document.body.appendChild(t);
    const restTop = s.y + 44;
    t.style.left = (s.x - 158) + 'px'; t.style.top = restTop + 'px';
    const w = 316, h = t.getBoundingClientRect().height, c = 28, stubY = h - 60;
    const d = `M${c},0 H${w - c} L${w},${c} V${h} H0 V${c} Z`;
    const hole = `M158,18 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 Z`;
    const notches = `M0,${stubY - 5} a5,5 0 0,1 0,10 Z M${w},${stubY - 5} a5,5 0 0,0 0,10 Z`;
    // seg: Visited's moment is the conductor's punch, through the Visited segment (the map shows through)
    const punched = variant === 'seg' && vis;
    const pz = 22, px = w * 5 / 6 - pz / 2, py = stubY + 9, sc = pz / 24, checkT = `translate(${px},${py}) scale(${sc})`;
    const dim = so ? 0.4 : 1;
    let svg = `<defs>${SHADOW}<filter id="wsoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1"/></filter>`
      + `<mask id="wpunch"><rect x="-20" y="-20" width="${w + 40}" height="${h + 40}" fill="#fff"/>${punched ? `<path d="${CHECK}" transform="${checkT}" fill="#000"/>` : ''}<path d="${hole}" fill="#000"/><path d="${notches}" fill="#000"/></mask>`
      + `<clipPath id="whole"><path d="${CHECK}" transform="${checkT}"/></clipPath></defs>`
      + (punched ? `<g opacity="${dim}"><path d="${CHECK}" transform="${checkT}" fill="#1A1A18" fill-opacity=".26"/><g clip-path="url(#whole)"><path d="${CHECK}" transform="translate(${px},${py - 2}) scale(${sc})" fill="none" stroke="#1A1A18" stroke-opacity=".45" stroke-width="3" filter="url(#wsoft)"/></g></g>` : '')
      + `<path d="${d}" fill="var(--paper-raised)" filter="url(#kshadow)" mask="url(#wpunch)"/>`
      // the eyelet's reinforcement patch (the Southern Pacific tags): a quiet paper-tone patch, neutral grommet
      + `<path d="M138,6 H178 L182,10 V30 L178,34 H138 L134,30 V10 Z" fill="#EDE4D3" mask="url(#wpunch)"/>`
      + `<line x1="10" x2="${w - 10}" y1="${stubY}" y2="${stubY}" stroke="var(--hair)" stroke-width="1.5" stroke-dasharray="4 3"/>`
      + `<circle cx="158" cy="18" r="8.5" fill="none" stroke="#CFC5B1" stroke-width="3.5"/>`;
    if (step === 'press' && variant === 'seg') svg += `<path d="${CHECK}" transform="${checkT}" fill="#1A1A18" fill-opacity=".10"/>`;
    bg(t, w, h, svg, 16);
    t.querySelectorAll(':scope > div').forEach(x => { x.style.position = 'relative'; x.style.zIndex = 1; });
    const str = document.createElement('div'); str.className = 'k-layer'; Object.assign(str.style, { left: 0, top: 0, width: '390px', height: '844px', zIndex: 1101 });
    str.innerHTML = `<svg width="390" height="844"><line x1="${s.x}" y1="${s.y + 13}" x2="${s.x}" y2="${restTop + 10}" stroke="#7A6A55" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    document.body.appendChild(str);

    const vcell = t.querySelector(variant === 'seg' ? '.W-seg.vis' : '.W-fields .c.vis');
    if (step === 'press') { const r = vcell.getBoundingClientRect(); tapAt(r.left + r.width / 2, r.top + r.height / 2); }
    if (step === 'fly' && variant === 'seg') {
      const r = t.getBoundingClientRect(); const ch = document.createElement('div'); ch.className = 'W-chad';
      ch.innerHTML = `<svg width="26" height="26" viewBox="-1 -1 26 26"><path d="${CHECK}" fill="#FAF5EA" stroke="#7A6A55" stroke-opacity=".6" stroke-width=".8"/></svg>`;
      Object.assign(ch.style, { left: (r.left + px + 14) + 'px', top: (r.top + py + 44) + 'px', transform: 'rotate(34deg)', filter: 'drop-shadow(0 3px 3px rgba(26,26,24,.35))' });
      document.body.appendChild(ch); anno(r.bottom + 56, 'punched: the check-shaped chad drops out');
    }
    if (step === 'fly' && variant === 'claim') { const m = vcell.querySelector('.row-stamp'); m.style.transform = 'rotate(-12deg) scale(1.5)'; m.style.opacity = '.35'; m.style.filter = 'blur(.5px)'; anno(t.getBoundingClientRect().bottom + 30, 'the stamp comes down into the field (grow, faint), then lands with a shrink'); }
    return ['.W', '.W-chad', '.W-knot'];
  };
})();
