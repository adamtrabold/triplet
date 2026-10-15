# Builds r3-proto.html = index.html + Pencil Star round 3. Reproducible; never edits index.html.
import pathlib, sys
src = pathlib.Path('/home/user/triplet/index.html').read_text()
out = src
def rep(old, new, count=1):
    global out
    n = out.count(old)
    if n != count: sys.exit(f'anchor count {n} != {count}: {old[:70]!r}')
    out = out.replace(old, new)

CSS = r'''
    /* =====================================================================
       PENCIL STAR -- printed = the guide's facts, stamped = where you've
       been, PENCILLED = what you care about. Stroke a row right: the name
       slides aside as one block and a star is pencilled -- five straight
       strokes, the way a hand draws one -- in the exact box where the
       printed Baedeker star will sit. At 56px the ink lands; let go and the
       name docks against it. The same stroke on a starred row lightens the
       ink to graphite and rubs it out, edges first. Left is inert.
       ===================================================================== */
    .location-card .row-main { position: relative; }
    /* The name moves as an OBJECT: transform, never re-truncation. It
       slips UNDER a feathered edge (8px mask, fading in with the first 8px
       of travel) at the content column's right edge -- 12px before the
       stamp/X, which are never under the mask. The column borrows the
       12px glyph gap on its left (margin/padding swap, zero layout shift)
       so the ink's 1.2x press-in isn't cut by the mask box. */
    .location-card.sg-live .row-main {
      margin-left: -12px; padding-left: 12px;
      -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 8px), rgba(0, 0, 0, var(--sg-fade-a, 1)));
      mask-image: linear-gradient(to right, #000 calc(100% - 8px), rgba(0, 0, 0, var(--sg-fade-a, 1)));
    }
    .location-card.sg-live .row-star { visibility: hidden; }
    .location-card.sg-live { transition: none; }   /* a held press snaps off when the stroke starts */
    .location-card.sg-live h3,
    .location-card.sg-live .row-meta { will-change: transform; }

    /* A drag is not a press. */
    .location-card.sg-live:not(.highlighted),
    .location-card.sg-live:not(.highlighted):active { background: var(--paper); }
    .location-card.is-visited.sg-live:not(.highlighted),
    .location-card.is-visited.sg-live:not(.highlighted):active { background: var(--paper-filed); }
    /* S2: touch presses are delayed 80ms (createCard()), so the bare
       :active pseudo-class must not paint the press instantly. */
    .location-card:not(.highlighted):not(.active):active { background: var(--paper); }
    .location-card.is-visited:not(.highlighted):not(.active):active { background: var(--paper-filed); }

    .sg-star {
      position: absolute;
      width: var(--s3);                    /* 12 = .row-star */
      height: var(--s3);
      overflow: visible;
      pointer-events: none;
    }
    /* Graphite: --ink-2 through a grain filter (feTurbulence alpha
       speckle + a 0.35px displacement wobble) with a pressure taper per
       stroke. Ink: the approved printed star, --figure-deep. */
    /* The sketch leans -7deg, as a hand does; the ink lands upright over
       it. The lean also keeps a half-drawn star (a Λ, then a Λ with a
       crossbar) from sitting on the type's baseline and reading as a letter. */
    .sg-star .sg-pencil,
    .sgp .sg-pencil { color: var(--ink-2); fill: currentColor;
                      transform-box: fill-box; transform-origin: 50% 55%; transform: rotate(-7deg); }
    .sg-star .sg-ink,
    .sgp .sg-ink { color: var(--figure-deep); fill: currentColor; opacity: 0;
                   transform-box: fill-box; transform-origin: 50% 55%; }
    .sg-spread { opacity: 0; transform-box: fill-box; transform-origin: 50% 55%; }
    .sg-smudge, .sg-ghost { fill: var(--ink-2); }
    .sg-inkg { opacity: 0; }
    .sg-star.inked .sg-ink, .sgp.inked .sg-ink { opacity: 1; }
    .sg-star.inked .sg-pencil, .sgp.inked .sg-pencil { opacity: 0; }
    .sg-crumb {
      position: absolute; width: 1.5px; height: 1.5px; border-radius: 1px;
      background: var(--ink-2); pointer-events: none;
    }
    .location-card.highlighted .sg-pencil,
    .location-card.highlighted .sg-ink { color: var(--paper); }
    .location-card.highlighted .sg-smudge,
    .location-card.highlighted .sg-ghost { fill: var(--paper); }
    .location-card.highlighted .sg-crumb { background: var(--paper); }

    /* Popup: the same material at 16px, played once on set (CSS only):
       five strokes x 40ms, then the ink lands at 220ms (one 17ms spread frame). */
    .popup-star .sgp { width: var(--s4); height: var(--s4); display: block; overflow: visible; }
    .popup-star .sgp.sgp-play .sg-rev {
      stroke-dasharray: var(--L) var(--L); stroke-dashoffset: var(--L);
      animation: sgpStroke 40ms linear var(--d) forwards;
    }
    .popup-star .sgp.sgp-play .sg-pencil { animation: sgpOff 1ms linear 220ms forwards; }
    /* N-b: the hollow star stays until stroke 1 is half drawn -- no empty slot on tap. */
    .sgp-hollow { display: none; }
    .popup-star .sgp.sgp-play .sgp-hollow { display: inline; color: var(--ink-2); animation: sgpOff 1ms linear 20ms forwards; }
    .popup-star .sgp.sgp-play .sg-ink { animation: sgpOn 1ms linear 220ms forwards, sgpPress 160ms cubic-bezier(.2, .8, .3, 1) 220ms backwards; }
    .popup-star .sgp.sgp-play .sg-spread { animation: sgpSpread 17ms steps(1, end) 220ms; }
    @keyframes sgpStroke { to { stroke-dashoffset: 0; } }
    @keyframes sgpOff    { to { opacity: 0; } }
    @keyframes sgpOn     { to { opacity: 1; } }
    @keyframes sgpPress  { from { transform: scale(1.2); } to { transform: scale(1); } }
    @keyframes sgpSpread { from { opacity: .45; transform: scale(1.3); } to { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) {
      .popup-star .sgp.sgp-play .sg-rev { animation: none; stroke-dashoffset: 0; }
      .popup-star .sgp.sgp-play .sg-pencil { animation: sgpOff 1ms linear 600ms forwards; }
      .popup-star .sgp.sgp-play .sg-ink { animation: sgpOn 1ms linear 600ms forwards; }
      .popup-star .sgp.sgp-play .sg-spread { animation: none; }
      .popup-star .sgp.sgp-play .sgp-hollow { display: none; }
    }
'''
rep('  </style>\n', CSS + '  </style>\n')

JS = r'''
    // ---- PENCIL STAR ----------------------------------------------------------
    // Numbers (px of CONTENT travel, i.e. past the 10px lock):
    //   EDGE 24    touches starting this close to either screen edge never
    //              arm (Safari's back/forward swipe is a screen-edge pan).
    //   LOCK 10    horizontal travel that claims the stroke, only while
    //              |dx| > 1.5|dy| (flatter than ~34deg) AND |dy| < 8.
    //   SCROLL 8   any 8px of vertical travel before the lock hands the
    //              touch to the scroller for good (S3: 34-45deg scrolls).
    //   STROKES    the five pencil strokes start at 0/6/12/25/38 and the
    //              sketch is whole at 50: two strokes by 12px, so the mark
    //              reads as a star being drawn almost at once.
    //   COMMIT 56  the ink lands. A flick (>=32px at >=0.5px/ms) can STAR;
    //              only the full stroke can UNSTAR (S5).
    // A tap is never delayed; nothing is prevented until the lock.
    const STAR_SWIPE = { EDGE: 24, LOCK: 10, SCROLL: 8, UNLOCK_DY: 16, UNLOCK_MAX: 16,
                         COMMIT: 56, MAX: 104, FLICK_V: 0.5, FLICK_MIN: 32,
                         WRONG_MAX: 6, STAR_W: 16, STROKES: [0, 6, 12, 25, 38, 50], SETTLE: 220 };
    const STAR_D = 'M12 1.87L15.03 8.9L22.65 9.61L16.9 14.66L18.58 22.13L12 18.22L5.42 22.13L7.1 14.66L1.35 9.61L8.97 8.9Z';
    // One continuous line, as a hand draws it: lower-left, up to the top,
    // down right, across to the left arm, across to the right arm, home.
    const PENTA = [[5.42, 22.13], [12, 1.87], [18.58, 22.13], [1.35, 9.61], [22.65, 9.61], [5.42, 22.13]];
    let starGesture = null;               // { id } while a row's re-render is held
    let starUid = 0;

    function pencilStarMarkup(cls, { play = false } = {}) {
      const u = 'ps' + (++starUid);
      let masks = '', strokes = '', t = 0;
      for (let k = 0; k < 5; k++) {
        const [x1, y1] = PENTA[k], [x2, y2] = PENTA[k + 1];
        const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
        const wa = 1.35, wb = 0.8;          // half-widths: pressure lifts off along each stroke
        const p = [[x1 + nx * wa, y1 + ny * wa], [x2 + nx * wb, y2 + ny * wb], [x2 - nx * wb, y2 - ny * wb], [x1 - nx * wa, y1 - ny * wa]]
          .map(q => q.map(v => v.toFixed(2)).join(',')).join(' ');
        const L1 = (L + 1).toFixed(2);
        masks += `<mask id="${u}-m${k}" maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32"><line class="sg-rev" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="5" stroke-dasharray="${L1} ${L1}" stroke-dashoffset="${L1}" data-l="${L1}" style="--L:${L1};--d:${k * 40}ms"/></mask>`;
        strokes += `<polygon points="${p}" mask="url(#${u}-m${k})"/>`;
      }
      return `<svg class="${cls}${play ? ' sgp-play' : ''}" viewBox="0 0 24 24" aria-hidden="true" data-u="${u}"><defs>
        <filter id="${u}-gr" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="4" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="0.7" xChannelSelector="R" yChannelSelector="G" result="d"/>
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.4 0 0 0 -0.8" result="g"/>
          <feComposite in="d" in2="g" operator="in"/>
        </filter>
        <filter id="${u}-bl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="0.01"/></filter>
        <radialGradient id="${u}-rad" gradientUnits="userSpaceOnUse" cx="12" cy="13" r="11"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
        <filter id="${u}-rf" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="9"/>
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1" result="n"/>
          <feComposite in="SourceGraphic" in2="n" operator="arithmetic" k1="0" k2="0.7" k3="0.6" k4="0"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  20 0 0 0 -1"/>
        </filter>
        <mask id="${u}-rub" maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32"><rect x="-4" y="-4" width="32" height="32" fill="url(#${u}-rad)" filter="url(#${u}-rf)"/></mask>
        ${masks}</defs>
        <use class="sgp-hollow" href="#g-star-open" width="24" height="24"/>
        <path class="sg-smudge" d="${STAR_D}" filter="url(#${u}-bl)" opacity="0"/>
        <path class="sg-ghost" d="${STAR_D}" opacity="0"/>
        <g class="sg-pencil" filter="url(#${u}-gr)">${strokes}</g>
        <g class="sg-ink"><path class="sg-spread" d="${STAR_D}"/><path class="sg-inkp" d="${STAR_D}"/><path class="sg-inkg" d="${STAR_D}" filter="url(#${u}-gr)"/></g>
      </svg>`;
    }

    // Drive one pencil star. raw = content px of the stroke.
    function pencilStar(svg, strokes = STAR_SWIPE.STROKES) {
      const u = svg.dataset.u, revs = [...svg.querySelectorAll('.sg-rev')];
      const ink = svg.querySelector('.sg-ink'), inkp = svg.querySelector('.sg-inkp'), spread = svg.querySelector('.sg-spread');
      const smudge = svg.querySelector('.sg-smudge'), blur = svg.querySelector(`#${u}-bl feGaussianBlur`);
      const rubM = svg.querySelector(`#${u}-rf feColorMatrix:last-child`);
      const S = strokes, inkg = svg.querySelector('.sg-inkg'), ghost = svg.querySelector('.sg-ghost');
      return {
        draw(raw) {                        // the sketch, stroke by stroke
          revs.forEach((r, k) => {
            const f = Math.max(0, Math.min(1, (raw - S[k]) / (S[k + 1] - S[k])));
            r.setAttribute('stroke-dashoffset', (parseFloat(r.dataset.l) * (1 - f)).toFixed(2));
          });
        },
        ink(animate) {                     // the ink LANDS: full opacity on the
          svg.classList.add('inked');      // first frame, pressed in from 1.2x
          if (!animate || prefersReducedMotion()) return;
          ink.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 160, easing: 'cubic-bezier(.2,.8,.3,1)' });
          spread.animate([{ opacity: 0.45, transform: 'scale(1.3)' }, { opacity: 0, transform: 'scale(1)' }], { duration: 17, easing: 'steps(1, end)' });
        },
        unink() { svg.classList.remove('inked'); ink.getAnimations().forEach(a => a.cancel()); },
        // Rub-out, in this order, all as a function of travel (so a
        // cancel plays it backwards exactly):
        //   0-10   colour only: ink -> graphite, smooth (never grain on ink)
        //   10-16  grain fades in over the now-100%-graphite fill
        //   16-50  erased from the points inwards, unevenly; smudge widens
        //   24-44  a faint ghost of the star rises to 25% and HOLDS
        //   56     the ghost goes and the dust falls -- only at the commit.
        rub(raw) {
          const hi = !!svg.closest('.highlighted');
          if (raw <= 0) {                   // identical to the printed star until travel begins
            ink.removeAttribute('mask'); inkp.style.fill = ''; inkg.style.fill = '';
            inkp.style.opacity = ''; inkg.style.opacity = '';
            smudge.setAttribute('opacity', '0'); ghost.setAttribute('opacity', '0'); return;
          }
          const clamp = v => Math.max(0, Math.min(1, v));
          const m = clamp(raw / 10), q = clamp((raw - 10) / 6), t = clamp((raw - 16) / 34);
          const fill = hi ? '' : `color-mix(in srgb, currentColor ${Math.round(100 - 100 * m)}%, var(--ink-2))`;
          inkp.style.fill = fill; inkg.style.fill = fill;
          inkp.style.opacity = String(1 - q); inkg.style.opacity = String(q);
          if (t > 0) {
            ink.setAttribute('mask', `url(#${u}-rub)`);
            rubM.setAttribute('values', `0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  20 0 0 0 ${(-20 * (-0.05 + 1.3 * Math.pow(t, 1.6))).toFixed(3)}`);
          } else ink.removeAttribute('mask');
          const sm = clamp((raw - 12) / 40);
          smudge.setAttribute('opacity', (0.2 * Math.sin(Math.PI * sm)).toFixed(3));
          blur.setAttribute('stdDeviation', (0.5 + 1.6 * sm).toFixed(2));
          smudge.style.transformBox = 'fill-box'; smudge.style.transformOrigin = '50% 55%';
          smudge.style.transform = `scale(${(1 + 0.22 * sm).toFixed(3)})`;
          ghost.setAttribute('opacity', raw >= STAR_SWIPE.COMMIT ? '0' : (0.25 * clamp((raw - 24) / 20)).toFixed(3));
        },
      };
    }

    function attachStarGesture(el) {
      let g = null;
      let eatClick = false;                 // S1: eats only THIS drag's own click

      el.addEventListener('click', (e) => {
        if (eatClick) { eatClick = false; e.stopImmediatePropagation(); e.preventDefault(); }
      }, true);

      const start = (x, y, target, src) => {
        eatClick = false;
        if (starGesture || target.closest('.delete-btn')) { g = null; return; }
        if (src === 'touch' && (x < STAR_SWIPE.EDGE || x > window.innerWidth - STAR_SWIPE.EDGE)) { g = null; return; }
        g = { x0: x, y0: y, src, state: 'pending', samples: [] };
      };
      // returns true when the event must be prevented (the row owns it)
      const move = (x, y, ts, cancelable) => {
        if (!g) return false;
        const dx = x - g.x0, dy = y - g.y0;
        if (g.state === 'pending') {
          const flat = Math.abs(dx) >= STAR_SWIPE.LOCK && Math.abs(dx) > 1.5 * Math.abs(dy);
          if (!flat) {
            if (Math.abs(dy) >= STAR_SWIPE.SCROLL) { g = null; return false; }          // S3(a): the scroller's
            return false;
          }
          if (!cancelable || !beginStarDrag(el, g, dx > 0)) { g = null; return false; }  // the scroller already has it
          eatClick = true;
        } else if (g.raw < STAR_SWIPE.UNLOCK_MAX && Math.abs(dy) >= STAR_SWIPE.UNLOCK_DY && Math.abs(dy) > Math.abs(dx)) {
          abortStarDrag(el, g); g = null; return false;                                  // it was a scroll after all
        }
        g.samples.push([ts, x]);
        while (g.samples.length > 2 && ts - g.samples[0][0] > 80) g.samples.shift();
        paintStarDrag(g, dx);
        return true;
      };
      const end = (cancelled) => {
        const cur = g; g = null;
        if (!cur || cur.state !== 'drag') return;
        let commit = false;
        if (!cancelled && cur.forward) {
          const s = cur.samples, v = s.length > 1 ? (s[s.length - 1][1] - s[0][1]) / Math.max(1, s[s.length - 1][0] - s[0][0]) : 0;
          commit = cur.raw >= STAR_SWIPE.COMMIT ||
                   (!cur.starred && cur.raw >= STAR_SWIPE.FLICK_MIN && v >= STAR_SWIPE.FLICK_V);   // S5: flick stars, never unstars
        }
        settleStarDrag(el, cur, commit);
      };

      // Touch: touch-action stays AUTO (S3). touchmove is non-passive and
      // prevents ONLY after the lock, so every other touch scrolls natively.
      el.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) { if (g) end(true); return; }
        start(e.touches[0].clientX, e.touches[0].clientY, e.target, 'touch');
      }, { passive: true });
      el.addEventListener('touchmove', (e) => {
        if (!g) return;
        const t = e.touches[0];
        if (move(t.clientX, t.clientY, e.timeStamp, e.cancelable) && e.cancelable) e.preventDefault();
      }, { passive: false });
      el.addEventListener('touchend', () => end(false));
      el.addEventListener('touchcancel', () => end(true));
      // Mouse (desktop rail): pointer events, no edge guard.
      el.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' && e.button === 0) start(e.clientX, e.clientY, e.target, 'mouse'); });
      el.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse' || !g) return;
        if (move(e.clientX, e.clientY, e.timeStamp, true) && g && g.state === 'drag' && !g.cap) { g.cap = true; try { el.setPointerCapture(e.pointerId); } catch (_) {} }
      });
      el.addEventListener('pointerup', (e) => { if (e.pointerType === 'mouse') end(false); });
      el.addEventListener('pointercancel', (e) => { if (e.pointerType === 'mouse') end(true); });
    }

    // Left edge of the name's first glyph box (skips the printed star).
    function textLeft(h3) {
      const w = document.createTreeWalker(h3, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
      const n = w.nextNode();
      if (!n) return h3.getBoundingClientRect().left;
      const r = document.createRange(); r.setStart(n, 0); r.setEnd(n, 1);
      return r.getBoundingClientRect().left;
    }

    // Build the live overlay in the printed star's own box.
    function mountPencilStar(el, loc) {
      const h3 = el.querySelector('h3'), meta = el.querySelector('.row-meta'), main = el.querySelector('.row-main');
      if (!h3 || !meta || !main) return null;
      el.classList.add('sg-live');          // geometry first: the feather edge borrows 12px
      let probe = h3.querySelector('.row-star'), made = false;
      if (!probe) {
        probe = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        probe.setAttribute('class', 'row-star'); probe.style.visibility = 'hidden'; h3.prepend(probe); made = true;
      }
      const pr = probe.getBoundingClientRect(), mr = main.getBoundingClientRect();
      if (made) probe.remove();
      const wrap = document.createElement('div');
      wrap.innerHTML = pencilStarMarkup('sg-star');
      const svg = wrap.firstElementChild;
      svg.style.left = (pr.left - mr.left) + 'px';
      svg.style.top = (pr.top - mr.top) + 'px';
      main.appendChild(svg);
      // Clearance: no graphite until the name has moved >= 3px clear of
      // the WHOLE sketch (its leaned box vs the first glyph's box). The
      // five strokes are remapped into the travel that has clearance,
      // still front-loaded: the Λ is done 8px after stroke 1 starts.
      const pen = svg.querySelector('.sg-pencil').getBoundingClientRect();
      const gl = textLeft(h3);
      const s0 = Math.min(30, Math.max(0, Math.ceil(pen.right + 3 - gl)));
      const r3 = (50 - s0 - 8) / 3;
      const strokes = [s0, s0 + 4, s0 + 8, s0 + 8 + r3, s0 + 8 + 2 * r3, 50];
      const ps = pencilStar(svg, strokes);
      if (loc.starred) ps.ink(false);
      starGesture = { id: loc.id };
      return { h3, meta, main, svg, ps, strokes };
    }

    function beginStarDrag(el, g, forward) {
      const id = el.getAttribute('data-id');
      const loc = locations.find(l => l.id === id);
      if (!loc) return false;
      el.classList.remove('active');
      const m = mountPencilStar(el, loc);
      if (!m) return false;
      Object.assign(g, m, { state: 'drag', forward, id, starred: !!loc.starred, raw: 0, off: 0, armed: false });
      return true;
    }

    // Name + meta move as one block while the finger drives; on the settle
    // they part: the name docks against (or over the gap of) the star, the
    // meta line always returns home.
    function setSlip(g, off, metaOff = off) {
      g.off = off; g.metaOff = metaOff;
      g.h3.style.transform = off ? `translateX(${off}px)` : '';
      g.meta.style.transform = metaOff ? `translateX(${metaOff}px)` : '';
      g.main.style.setProperty('--sg-fade-a', String(Math.max(0, 1 - Math.max(Math.abs(off), Math.abs(metaOff)) / 8)));
    }

    // Paint the stroke at content travel `raw` (visual only).
    function paintStarVisual(g, raw) {
      if (g.starred) {
        g.ps.rub(raw);
        const armed = raw >= STAR_SWIPE.COMMIT;
        if (armed && !g.armed) starCrumbs(g);
        g.armed = armed;
      } else {
        g.ps.draw(raw);
        const armed = raw >= STAR_SWIPE.COMMIT;
        if (armed && !g.armed) g.ps.ink(true);
        if (!armed && g.armed) g.ps.unink();
        g.armed = armed;
      }
    }

    function paintStarDrag(g, dx) {
      if (!g.forward) {                    // wrong way: a little give, nothing else
        const give = Math.min(STAR_SWIPE.WRONG_MAX, Math.max(0, -(dx + STAR_SWIPE.LOCK)) * 0.12);
        g.main.style.transform = give ? `translateX(${-give}px)` : '';
        return;
      }
      const raw = Math.max(0, dx - STAR_SWIPE.LOCK);
      g.raw = raw;
      setSlip(g, raw <= STAR_SWIPE.COMMIT ? raw : Math.min(STAR_SWIPE.MAX, STAR_SWIPE.COMMIT + (raw - STAR_SWIPE.COMMIT) * 0.35));
      paintStarVisual(g, raw);
    }

    // Eraser dust: three graphite specks, <=2px of drift, gone in 200ms.
    function starCrumbs(g) {
      if (prefersReducedMotion()) return;
      const x = parseFloat(g.svg.style.left), y = parseFloat(g.svg.style.top);
      [[2, 9, -1], [6, 11, 0.5], [10, 8, 1]].forEach(([cx, cy, drift], i) => {
        const c = document.createElement('span');
        c.className = 'sg-crumb';
        c.style.left = (x + cx) + 'px'; c.style.top = (y + cy) + 'px';
        g.main.appendChild(c);
        c.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${drift}px, 2px)`, opacity: 0 }],
                  { duration: 140 + i * 30, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' })
          .finished.then(() => c.remove(), () => c.remove());
      });
    }

    function releaseStarRow(el, g, restore) {
      el.classList.remove('sg-live');
      if (restore) { g.svg.remove(); setSlip(g, 0); g.main.style.transform = ''; g.main.style.removeProperty('--sg-fade-a'); }
      if (starGesture && starGesture.id === g.id) starGesture = null;
    }

    function abortStarDrag(el, g) { releaseStarRow(el, g, true); }

    const easeOut = t => 1 - Math.pow(1 - t, 3);
    let sgNow = () => performance.now();   // one clock for every timeline (a test can step it)
    function runTimeline(ms, frame, done) {
      if (ms <= 0 || prefersReducedMotion()) { frame(1); done(); return; }
      const t0 = sgNow();
      const step = () => { const t = Math.min(1, (sgNow() - t0) / ms); frame(t); if (t < 1) requestAnimationFrame(step); else done(); };
      requestAnimationFrame(step);
    }

    // R2-S1: the FINAL row (printed star in or out, final truncation) is
    // laid out on the release frame; the name then FLIPs home from where
    // the finger left it. Letters change while the name is moving fastest,
    // never on the frame it comes to rest.
    function flipToFinal(el, g, nowStarred, ms, done) {
      const oldH = textLeft(g.h3);
      const oldMeta = g.meta.getBoundingClientRect().left;
      const loc = locations.find(l => l.id === g.id) || {};
      const fin = { ...loc, starred: nowStarred };
      const svg = g.svg; svg.remove();
      const dust = [...g.main.querySelectorAll('.sg-crumb')]; dust.forEach(c => c.remove());   // the dust keeps falling
      renderCard(el, fin);
      const entry = cardsById.get(g.id); if (entry) entry.signature = cardSignature(fin);
      g.h3 = el.querySelector('h3'); g.meta = el.querySelector('.row-meta'); g.main = el.querySelector('.row-main');
      g.main.appendChild(svg); dust.forEach(c => g.main.appendChild(c));
      const dH = oldH - textLeft(g.h3), dM = oldMeta - g.meta.getBoundingClientRect().left;
      setSlip(g, dH, dM);
      runTimeline(ms, t => { const e = easeOut(t); setSlip(g, dH * (1 - e), dM * (1 - e)); }, done);
    }

    function settleStarDrag(el, g, commit) {
      const nowStarred = commit ? !g.starred : g.starred;
      if (!commit) el.querySelectorAll('.sg-crumb').forEach(c => c.remove());   // a cancel takes its dust back
      const off0 = g.off, meta0 = g.metaOff || 0, raw0 = g.raw, give0 = g.main.style.transform;
      if (commit && !g.starred && !g.armed) { g.ps.draw(STAR_SWIPE.COMMIT); g.ps.ink(true); g.armed = true; }  // a flick inks on release
      if (commit) {
        toggleLocationFlag(g.id, 'starred');   // optimistic; this row's re-render is held -- we lay it out ourselves
        flipToFinal(el, g, nowStarred, STAR_SWIPE.SETTLE, () => { releaseStarRow(el, g, true); updateUI(); });
        return;
      }
      runTimeline(STAR_SWIPE.SETTLE, (t) => {
        const e = easeOut(t);
        if (give0) g.main.style.transform = `translateX(${(parseFloat(give0.slice(11)) * (1 - e)).toFixed(2)}px)`;
        if (!g.forward) return;
        setSlip(g, off0 * (1 - e), meta0 * (1 - e));
        paintStarVisual(g, raw0 * (1 - e));   // pencil retracts / ink returns, same function of travel
      }, () => releaseStarRow(el, g, true));
    }

    // N3: shape rows have no star -- a stroke gets the same 6px of give.
    function attachShapeGive(el) {
      let g = null;
      el.addEventListener('touchstart', (e) => { const t = e.touches[0]; g = t ? { x0: t.clientX, y0: t.clientY, lock: false } : null; }, { passive: true });
      el.addEventListener('touchmove', (e) => {
        if (!g) return; const t = e.touches[0], dx = t.clientX - g.x0, dy = t.clientY - g.y0;
        if (!g.lock) { if (Math.abs(dy) >= STAR_SWIPE.SCROLL) { g = null; return; } if (Math.abs(dx) < STAR_SWIPE.LOCK || Math.abs(dx) <= 1.5 * Math.abs(dy) || !e.cancelable) return; g.lock = true; }
        if (e.cancelable) e.preventDefault();
        const give = Math.sign(dx) * Math.min(STAR_SWIPE.WRONG_MAX, (Math.abs(dx) - STAR_SWIPE.LOCK) * 0.12);
        const main = el.querySelector('.row-main'); if (main) main.style.transform = `translateX(${give}px)`;
      }, { passive: false });
      const end = () => { if (!g || !g.lock) { g = null; return; } g = null; const main = el.querySelector('.row-main'); if (!main) return;
        const from = parseFloat((main.style.transform || '').slice(11)) || 0;
        runTimeline(160, t => { main.style.transform = `translateX(${(from * (1 - easeOut(t))).toFixed(2)}px)`; }, () => { main.style.transform = ''; }); };
      el.addEventListener('touchend', end); el.addEventListener('touchcancel', end);
    }

    // S4: teach the stroke, in place, at most twice per device -- only when
    // a star is set from the POPUP and that place's row is on screen.
    const STAR_TEACH_KEY = 'triplet.pencilStarTaught';
    function maybeTeachStar(id) {
      let n = 0; try { n = parseInt(localStorage.getItem(STAR_TEACH_KEY) || '0', 10) || 0; } catch (_) { return false; }
      if (n >= 2 || starGesture) return false;
      const entry = cardsById.get(id), list = document.getElementById('locationsList'), sheet = document.getElementById('locations');
      if (!entry || !list || !entry.el.isConnected || (sheet && sheet.classList.contains('collapsed'))) return false;
      const r = entry.el.getBoundingClientRect(), lr = list.getBoundingClientRect();
      if (r.top < lr.top || r.bottom > lr.bottom || r.height === 0) return false;     // not on screen: skip, don't count
      const loc = locations.find(l => l.id === id);
      if (!loc || loc.starred) return false;
      try { localStorage.setItem(STAR_TEACH_KEY, String(n + 1)); } catch (_) {}
      const el = entry.el, m = mountPencilStar(el, loc);
      if (!m) return false;
      const g = { ...m, id, starred: false, off: 0 };
      const done = () => { releaseStarRow(el, g, true); updateUI(); };
      if (prefersReducedMotion()) {        // static pencilled star for ~1s, then the ink by opacity only
        g.ps.draw(STAR_SWIPE.COMMIT);
        flipToFinal(el, g, true, 0, () => {});   // final row at once (reduced motion: no slip)
        setTimeout(() => {
          const pen = g.svg.querySelector('.sg-pencil'), ink = g.svg.querySelector('.sg-ink');
          pen.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
          ink.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' }).finished.then(done, done);
        }, 1000);
        return true;
      }
      // A ghost of the real stroke: slip out to 30px (clear of the sketch),
      // five strokes, ink, then FLIP into the final row. ~500ms.
      const t0 = sgNow(); let inked = false;
      const step = () => {
        const ms = sgNow() - t0;
        const out = Math.min(1, ms / 120);
        setSlip(g, 30 * (0.5 - 0.5 * Math.cos(Math.PI * out)), 30 * (0.5 - 0.5 * Math.cos(Math.PI * out)));
        const p = Math.max(0, Math.min(1, (ms - 120) / 180));
        g.ps.draw(g.strokes[0] + (50 - g.strokes[0]) * p);
        if (ms >= 310 && !inked) {
          inked = true; g.ps.draw(STAR_SWIPE.COMMIT); g.ps.ink(true);
          flipToFinal(el, g, true, 190, done);
          return;
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      return true;
    }

    // Popup rub-out (star removed from the popup): the same rub as the
    // row, over 240ms, then the hollow star.
    let popupRubId = null;
    function runPopupRub(tries = 0) {
      const svg = document.querySelector('.leaflet-popup .sgp.sgp-rub:not(.run)');
      if (!svg) { if (tries < 30) requestAnimationFrame(() => runPopupRub(tries + 1)); return; }
      svg.classList.add('run');
      const ps = pencilStar(svg);
      const finish = () => { const b = svg.closest('.popup-star'); if (b && svg.isConnected) b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#g-star-open"/></svg>'; };
      if (prefersReducedMotion()) { finish(); return; }
      runTimeline(240, t => ps.rub(t < 0.3 ? 10 * t / 0.3 : 10 + 45.9 * (t - 0.3) / 0.7), () => { ps.rub(STAR_SWIPE.COMMIT); finish(); });
    }

'''
rep('    // Deterministic per-place stamp angle', JS + '    // Deterministic per-place stamp angle')

# createCard: S2 80ms press delay (touch), attach gesture
rep('''      const addActive = (e) => {
        if (!e.target.closest('.delete-btn')) {
          touchMoved = false;
          el.classList.add('active');
        }
      };
      const removeActive = () => el.classList.remove('active');
      const handleTouchMove = () => { touchMoved = true; removeActive(); };

      el.addEventListener('mousedown', addActive);
      el.addEventListener('touchstart', addActive, { passive: true });
      el.addEventListener('touchmove', handleTouchMove, { passive: true });
      el.addEventListener('mouseup', removeActive);
      el.addEventListener('mouseleave', removeActive);
      el.addEventListener('touchend', removeActive);
      el.addEventListener('touchcancel', removeActive);
''', '''      // S2: a TOUCH press shows after 80ms of stillness, so a stroke or a
      // flick-scroll never starts with a dark blink; a quicker tap still
      // acknowledges with a 100ms press on release. Mouse is immediate.
      let pressTimer = 0, lastTouch = -1e9;
      const addActive = (e) => {
        if (e.type === 'touchstart') lastTouch = performance.now();
        else if (performance.now() - lastTouch < 800) return;   // compat mouse events after a touch
        if (!e.target.closest('.delete-btn')) {
          touchMoved = false;
          clearTimeout(pressTimer);
          if (e.type === 'touchstart') {
            pressTimer = setTimeout(() => { pressTimer = 0; if (!touchMoved) el.classList.add('active'); }, 80);
          } else {
            el.classList.add('active');
          }
        }
      };
      const removeActive = () => { clearTimeout(pressTimer); pressTimer = 0; el.classList.remove('active'); };
      const handleTouchMove = () => { touchMoved = true; removeActive(); };
      const handleTouchEnd = () => {
        if (pressTimer && !touchMoved) {
          clearTimeout(pressTimer); pressTimer = 0;
          el.classList.add('active');
          setTimeout(() => el.classList.remove('active'), 100);
        } else removeActive();
      };

      el.addEventListener('mousedown', addActive);
      el.addEventListener('touchstart', addActive, { passive: true });
      el.addEventListener('touchmove', handleTouchMove, { passive: true });
      const mouseRemove = () => { if (performance.now() - lastTouch >= 800) removeActive(); };
      el.addEventListener('mouseup', mouseRemove);
      el.addEventListener('mouseleave', mouseRemove);
      el.addEventListener('touchend', handleTouchEnd);
      el.addEventListener('touchcancel', removeActive);
''')
rep('''        highlightMarker(id);
      });

      return el;''', '''        highlightMarker(id);
      });

      attachStarGesture(el);
      return el;''')
rep('''        focusShape(id);
      });

      return el;''', '''        focusShape(id);
      });

      attachShapeGive(el);
      return el;''')
rep('''        if (signature !== entry.signature) {
          renderCard(entry.el, loc);''', '''        // Held while the pencil star owns this row (settleStarDrag() / maybeTeachStar()).
        if (signature !== entry.signature && !(starGesture && starGesture.id === loc.id)) {
          renderCard(entry.el, loc);''')

# Popup
rep('''<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#g-star${loc.starred ? '' : '-open'}"/></svg></button>''',
    '''${inkNow ? pencilStarMarkup('sgp', { play: true }) : rubNow ? pencilStarMarkup('sgp inked sgp-rub') : `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#g-star${loc.starred ? '' : '-open'}"/></svg>`}</button>''')
rep('    function buildPopupHtml(loc) {', '''    let popupInkId = null;   // popup star just set: play pencil -> ink ONCE (consumed on first render)
    function buildPopupHtml(loc) {
      const inkNow = !!loc.starred && popupInkId === loc.id;
      if (inkNow) popupInkId = null;
      const rubNow = !loc.starred && popupRubId === loc.id;
      if (rubNow) popupRubId = null;''')
rep('''      e.stopPropagation();
      toggleLocationFlag(loc.id, btn.classList.contains('popup-star') ? 'starred' : 'visited');''',
    '''      e.stopPropagation();
      const isStar = btn.classList.contains('popup-star');
      if (isStar && !loc.starred) { popupInkId = loc.id; maybeTeachStar(loc.id); }
      if (isStar && loc.starred) { popupRubId = loc.id; requestAnimationFrame(() => runPopupRub()); }
      toggleLocationFlag(loc.id, isStar ? 'starred' : 'visited');''')
pathlib.Path('r3-proto.html').write_text(out)
print('ok', len(out))
