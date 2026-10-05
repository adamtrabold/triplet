// Hanging Tag v2 (round 4). Page-side; injected into the REAL app by render.js after round 3's concepts.js
// (which supplies the helpers on window.K2). Draws one state of the tag.
(() => {
  const H = window.K2;
  const { esc, ic, rowStamp, seal, typeWord, acts0, addr1, select, pinScreen, movePinTo, anno, tapAt, bg, SHADOW, growMap } = H;

  const CSS = `
  .V { position: absolute; z-index: 1100; width: 316px; }
  .V-head { position: relative; height: 40px; display: flex; align-items: center; padding: 0 0 0 24px; }
  .V-head .k-meta { max-width: 118px; }
  .V-head .k-x { top: 0; right: 0; }
  .V-in { position: relative; padding: 2px var(--s4) 0; }
  .V-name { font-stretch: 62%; font-weight: 700; font-size: 26px; line-height: 28px; color: var(--ink); }
  .V-in .k-addr1 { margin-top: 2px; min-height: 20px; }
  .V-in .k-notes { margin-top: var(--s2); }
  .V-in .k-acts { margin-top: var(--s1); }
  .V-stub { position: relative; height: 52px; padding: 4px var(--s4) 0; display: flex; align-items: center; gap: 6px;
            font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 11px; letter-spacing: .1em; color: var(--ink); }
  .V-stub.on { color: color-mix(in srgb, var(--navy) 82%, transparent); }
  .V-stub .row-stamp-check { width: 16px; height: 16px; }
  .V-stub .row-stamp { transform: rotate(-6deg); }
  .V-chad { position: absolute; z-index: 1102; pointer-events: none; }
  .k-so .V-stub, .k-so .k-btn.star { opacity: var(--state-off-alpha); }
  `;
  const CHECK = STICKER_CHECK.row.d;

  // mode: rest | pop1 | pop2 | pop3   (pop-out motion)
  // stub: off | punch | tear | stamp  ; stubm: '' | 'press' | 'fly' (visited motion step)
  window.TAG2 = (P, { mode = 'rest', stub = null, stubm = '', so = false } = {}) => {
    if (!document.getElementById('v-css')) { const s = document.createElement('style'); s.id = 'v-css'; s.textContent = CSS; document.head.appendChild(s); }
    if (so) document.body.classList.add('k-so');
    select(P);
    document.getElementById('locations').classList.add('collapsed'); growMap(60);
    movePinTo(P, 195, 112);
    if (mode === 'tap') { const s = pinScreen(P); tapAt(s.x, s.y); return ['body']; }
    const s = pinScreen(P);
    const vis = stub ? stub !== 'off' : !!P.visited;
    const kind = stub && stub !== 'off' ? stub : 'punch';
    const torn = vis && kind === 'tear' && stubm !== 'press';
    const t = document.createElement('div'); t.className = 'k V';
    const name = String(P.name);
    const stubInner = !vis || stubm === 'press'
      ? `<span class="k-ring"></span>Mark visited`
      : kind === 'stamp' ? rowStamp(P.id, -6)
      : `<span style="display:inline-block;width:22px"></span>Visited`;
    const visBtn = torn ? `<button class="k-btn vis on">${stampCheckSvg()}Visited</button>` : '';
    t.innerHTML = `<div class="V-head">${H.meta(P, true)}<span class="k-x">×</span></div>
      <div class="V-in"><div class="V-name">${esc(name)}</div>${addr1(P)}${P.notes ? `<div class="k-notes">${esc(P.notes)}</div>` : ''}
        <div class="k-acts">${H.dirBtn()}${H.starBtn(P)}${visBtn}</div></div>
      ${torn ? '<div style="height:14px"></div>' : `<div class="V-stub ${vis && stubm !== 'press' ? 'on' : ''}">${stubInner}</div>`}`;
    document.body.appendChild(t);
    if (!P.notes && !P.address) t.querySelector('.k-acts').style.marginTop = '4px';
    const restTop = s.y + 44;
    t.style.left = (s.x - 158) + 'px'; t.style.top = restTop + 'px';
    const w = 316, h = t.getBoundingClientRect().height, c = 28;
    const stubY = torn ? null : h - 52;
    // outline: chamfered top corners; a torn (deckle) foot when the stub is gone
    let foot = `V${h} H0`;
    if (torn) { let z = `V${h - 6}`; let x = w; let i = 0; while (x > 0) { x -= 9 + (i * 7) % 5; z += ` L${Math.max(0, x)},${h - 6 + ((i * 5) % 7) - 1}`; i++; } foot = z; }
    const d = `M${c},0 H${w - c} L${w},${c} ${foot} V${c} Z`;
    const hole = `M158,18 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0 Z`;
    const notches = stubY ? `M0,${stubY - 5} a5,5 0 0,1 0,10 Z M${w},${stubY - 5} a5,5 0 0,0 0,10 Z` : '';
    // the punch: a check-shaped hole through the stub (the map shows through), with a faint edge
    const punched = vis && kind === 'punch' && stubm !== 'press';
    const px = 16, py = stubY + 4 + 26 - 11, sc = 22 / 24;
    const checkT = `translate(${px},${py}) scale(${sc})`;
    let svg = `<defs>${SHADOW}<mask id="vpunch"><rect x="-20" y="-20" width="${w + 40}" height="${h + 40}" fill="#fff"/>${punched ? `<path d="${CHECK}" transform="${checkT}" fill="#000"/>` : ''}<path d="${hole}" fill="#000"/>${notches ? `<path d="${notches}" fill="#000"/>` : ''}</mask></defs>`
      + `<path d="${d}" fill="var(--paper-raised)" filter="url(#kshadow)" mask="url(#vpunch)"/>`
      + (stubY ? `<line x1="10" x2="${w - 10}" y1="${stubY}" y2="${stubY}" stroke="var(--hair)" stroke-width="1.5" stroke-dasharray="4 3"/>` : '')
      + (punched ? `<path d="${CHECK}" transform="${checkT}" fill="#1A1A18" fill-opacity=".10"/><path d="${CHECK}" transform="${checkT}" fill="none" stroke="#1A1A18" stroke-opacity=".55" stroke-width="1.3"/>` : '')
      + `<circle cx="158" cy="18" r="8.5" fill="none" stroke="${P.ink}" stroke-width="3" opacity=".9"/>`;
    if (stubm === 'press' && kind === 'punch') svg += `<path d="${CHECK}" transform="${checkT}" fill="#1A1A18" fill-opacity=".14"/>`;
    bg(t, w, h, svg, 16);
    t.querySelectorAll(':scope > div').forEach(x => { x.style.position = 'relative'; x.style.zIndex = 1; });

    // the string: straight, from the pin's foot to the eyelet
    const str = document.createElement('div'); str.className = 'k-layer'; Object.assign(str.style, { left: 0, top: 0, width: '390px', height: '844px', zIndex: 1101 });
    document.body.appendChild(str);
    const setString = (topY) => { str.innerHTML = `<svg width="390" height="844"><line x1="${s.x}" y1="${s.y + 12}" x2="${s.x}" y2="${topY + 10}" stroke="#7A6A55" stroke-width="1.5" stroke-linecap="round"/></svg>`; };
    setString(restTop);

    // pop-out motion: the tag comes out of the pin (small, at the pin), drops past its rest on the string, settles
    t.style.transformOrigin = '158px 0';
    if (mode === 'pop1') { t.style.top = (s.y - 4) + 'px'; t.style.transform = 'scale(.18)'; t.style.opacity = '.9'; str.innerHTML = ''; anno(s.y + 40, 'pops out of the pin (0–80ms)'); }
    if (mode === 'pop2') { t.style.top = (restTop + 14) + 'px'; t.style.transform = 'scale(1.0, 1.02)'; setString(restTop + 14); anno(restTop + h + 30, 'drops past its rest; the string pulls straight (80–200ms)'); }
    if (mode === 'pop3') { t.style.top = (restTop - 3) + 'px'; setString(restTop - 3); anno(restTop + h + 30, 'bounces once and hangs still (200–280ms)'); }
    if (mode === 'rest' && window.__note) anno(restTop + h + 24, window.__note);

    // stub visited motions
    const st = t.querySelector('.V-stub');
    if (stubm === 'press') { const r = st.getBoundingClientRect(); tapAt(r.left + 44, r.top + r.height / 2); }
    if (stubm === 'fly' && kind === 'punch') {   // the chad falls out of the punch
      const r = t.getBoundingClientRect(); const ch = document.createElement('div'); ch.className = 'V-chad';
      ch.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24"><path d="${CHECK}" fill="#FAF5EA" stroke="#1A1A18" stroke-opacity=".25"/></svg>`;
      Object.assign(ch.style, { left: (r.left + px + 18) + 'px', top: (r.top + py + 34) + 'px', transform: 'rotate(38deg) scale(.9)', filter: 'drop-shadow(0 2px 2px rgba(26,26,24,.25))' });
      document.body.appendChild(ch); anno(r.bottom + 50, 'punched: the check-shaped chad drops out');
    }
    if (stubm === 'fly' && kind === 'tear') {   // the stub tears off along the perforation and falls
      const r = t.getBoundingClientRect(); const ss = document.createElement('div'); ss.className = 'V-chad';
      ss.innerHTML = `<svg width="316" height="52"><defs>${SHADOW}</defs><path d="M0,6 L9,4 L17,7 L28,5 L40,7 L316,5 V52 H0 Z" fill="var(--paper-raised)" filter="url(#kshadow)"/></svg>`
        + `<div style="position:absolute;left:16px;top:18px;display:flex;align-items:center;gap:6px;font:700 11px/1 var(--font-ui);font-stretch:75%;letter-spacing:.1em;text-transform:uppercase"><span class="k-ring"></span>Mark visited</div>`;
      Object.assign(ss.style, { left: r.left + 'px', top: (r.bottom + 10) + 'px', transform: 'rotate(7deg)', transformOrigin: '0 0', opacity: '.92' });
      document.body.appendChild(ss); anno(r.bottom + 90, 'torn off: the stub drops away');
    }
    if (stubm === 'fly' && kind === 'stamp') { const m = st.querySelector('.row-stamp'); m.style.transform = 'rotate(-12deg) scale(1.5)'; m.style.opacity = '.35'; m.style.filter = 'blur(.5px)'; anno(st.getBoundingClientRect().bottom + 30, 'the stamp comes down (grow, faint), then lands with a shrink'); }
    return ['.V', '.V-chad'];
  };
})();
