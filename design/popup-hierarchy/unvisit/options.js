// Un-visit transition, ROUND 2 (after ux-review.md + cd-review.md): Lift off (lead), Dry up (UX's
// alternate), Strike through (CD's alternate). CSS appended to a scratch copy of index.html, on
// the shipped hooks only: the leaving copy of the stamp (.tag-stamp-out, pointer-events:none as
// shipped -- untouched, so a re-tap still re-renders and stamps in) and the segment's resting
// content (outline check + "Mark visited"). No markup or JS change. Round 1: options-r1.js.
//
// Rules every option now keeps (the review fixes):
//  - SAME POP AS THE ROW, SAME FRAME. The row's un-visit replay (vsReplay -> runVisitPop(VISIT_LIFT,
//    240)) and the popup unstar both use STAR_ERASE_POP: 1.12x at 35% of 240ms, (.2,.9,.3,1) up,
//    (.5,0,.4,1) down. Every option opens with exactly that rise, from the tap's own render, so the
//    tag and the row leave together (measured: sync.js / sync.json).
//  - PALE TOWARD LIGHT NAVY, NEVER GREY. The stamp's ink runs from its resting 82% navy to the row's
//    own ghost tint VS_GHOST_TINT oklch(0.80 0.045 249.2) at FULL opacity (the row's P3-N1 rule:
//    lightness only rises, chroma >= 0.045); only then does it go, in ~40ms (the row: gone on the
//    lift frame). Opacity over cream is what turned it grey.
//  - NO CROSSING FRAME. "Mark visited" and its check start to ink only after the stamp is at
//    opacity 0; there is a beat of clean paper between them.
//  - Reduced motion: 160ms, no scale/rotate/mask: the stamp pales to the tint and goes (0-80ms), then
//    the words ink in (80-160ms) -- no crossing frame here either.
const S = 'var(--tag-stamp-scale, 1.1)';
const TILT = 'var(--stamp-tilt, -3deg)';
const REST_INK = 'color-mix(in srgb, var(--navy) 82%, transparent)';   // .row-stamp's own colour
const TINT = 'oklch(0.80 0.045 249.2)';                                  // VS_GHOST_TINT (index.html)
const SEL = '.tag-seg.popup-visited .row-stamp.tag-stamp-out';
const REST = (ms, from) => `
    .tag-seg.popup-visited:has(> .tag-stamp-out) { animation: uvRest ${ms}ms linear both; }
    @keyframes uvRest { 0%, ${from}% { color: transparent; } 100% { color: var(--ink); } }`;
const REDUCED = `
    @media (prefers-reduced-motion: reduce) {
      ${SEL} { display: block; animation: uvFade 160ms linear forwards !important; }
      ${SEL} .row-stamp-ring::after { animation: none !important; clip-path: none; }
      .tag-seg.popup-visited:has(> .tag-stamp-out) { animation: uvRestRm 160ms linear both !important; }
    }
    @keyframes uvFade { 0% { color: ${REST_INK}; } 35% { color: ${TINT}; opacity: 1; } 50%, 100% { color: ${TINT}; opacity: 0; } }
    @keyframes uvRestRm { 0%, 50% { color: transparent; } 100% { color: var(--ink); } }`;
// STAR_ERASE_POP, about the stamp's tilt and resting scale.
const POP = `
    @keyframes uvPop {
      0%   { transform: rotate(${TILT}) scale(${S}); animation-timing-function: cubic-bezier(.2, .9, .3, 1); }
      35%  { transform: rotate(${TILT}) scale(calc(${S} * 1.12)); animation-timing-function: cubic-bezier(.5, 0, .4, 1); }
      100% { transform: rotate(${TILT}) scale(${S}); }
    }`;
// The pale: resting ink -> the tint at full opacity, then gone. [paleFrom, paleTo, goneAt] in %.
const PALE = (name, a, b, c) => `
    @keyframes ${name} {
      0%, ${a}% { color: ${REST_INK}; opacity: 1; }
      ${b}% { color: ${TINT}; opacity: 1; }
      ${c}%, 100% { color: ${TINT}; opacity: 0; }
    }`;

module.exports = {
  // Today, for contrast.
  shipped: { ms: 220, css: '' },

  // 1. LIFT OFF (lead; both reviews). 360ms. The stamp-in, answered.
  //   0-84ms     the erase pop up to 1.12x -- the same curve and frame as the row's
  //   84-130ms   a held beat at the top (the CD's "one beat of character": the stamp-in's settle,
  //              mirrored -- the hand has the stamp, then pulls)
  //   130-290ms  it lifts: tilts 6deg back toward the stamp-in's approach angle, rises 2px, softens
  //              (0.4px blur), pales to the tint; gone 250-290ms
  //   300-360ms  the check + words ink in on clean paper
  //   No growth past the pop's 1.12x: the rise is tilt + lift + blur, so the stamp stays inside its
  //   segment at every --tag-stamp-scale (measured per frame: geometry in sync.json).
  lift: { ms: 360, css: `
    ${SEL} { animation: uvLift 360ms linear forwards, uvLiftPale 360ms linear forwards; }
    @keyframes uvLift {
      0%     { transform: translateY(0) rotate(${TILT}) scale(${S}); filter: blur(0); animation-timing-function: cubic-bezier(.2, .9, .3, 1); }
      23.3%  { transform: translateY(0) rotate(${TILT}) scale(calc(${S} * 1.12)); filter: blur(0); animation-timing-function: linear; }
      36.1%  { transform: translateY(0) rotate(${TILT}) scale(calc(${S} * 1.12)); filter: blur(0); animation-timing-function: cubic-bezier(.45, 0, .7, .6); }
      80.5%, 100% { transform: translateY(-2px) rotate(calc(${TILT} - 6deg)) scale(calc(${S} * 1.12)); filter: blur(.4px); }
    }
    ${PALE('uvLiftPale', 23.3, 69.4, 80.5)}
    ${REST(360, 83.3)} ${REDUCED}` },

  // 2. DRY UP (UX's alternate: the row's own story). 360ms.
  //   0-240ms    the erase pop (exactly the row's)
  //   60-290ms   the ink draws back toward the ring's centre through the paper tooth, on a SOFT
  //              radial edge (no cropped letters), while it pales to the tint; gone 250-290ms
  //   300-360ms  the check + words ink in
  dry: { ms: 360, css: `
    ${SEL} {
      -webkit-mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px), radial-gradient(closest-side, #000 55%, transparent 100%) 50% 50% / 200% 200% no-repeat;
      -webkit-mask-composite: source-in;
      mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px), radial-gradient(closest-side, #000 55%, transparent 100%) 50% 50% / 200% 200% no-repeat;
      mask-composite: intersect;
      animation: uvPop 240ms linear forwards, uvDry 360ms linear forwards, uvDryPale 360ms linear forwards; }
    @keyframes uvDry {
      0%, 16.7% { -webkit-mask-size: var(--ts, 90px) var(--ts, 90px), 200% 200%; mask-size: var(--ts, 90px) var(--ts, 90px), 200% 200%; animation-timing-function: cubic-bezier(.35, 0, .65, 1); }
      80.5%, 100% { -webkit-mask-size: var(--ts, 90px) var(--ts, 90px), 70% 70%; mask-size: var(--ts, 90px) var(--ts, 90px), 70% 70%; }
    }
    ${PALE('uvDryPale', 11, 69.4, 80.5)}
    ${POP} ${REST(360, 83.3)} ${REDUCED}` },

  // 3. STRIKE THROUGH (CD's alternate: correct the record). 380ms.
  //   0-240ms    the erase pop (exactly the row's) -- the struck stamp now leaves by the family's word
  //   20-130ms   one pencil stroke is drawn through the word, left to right: a tapered, slightly bowed
  //              graphite stroke (--ink at the light-graphite ~.6, through the paper tooth), a few
  //              degrees off the stamp's tilt, starting and ending inside the ring -- no overrun
  //   150-320ms  stamp and stroke pale to the tint together; gone 280-320ms
  //   320-380ms  the check + words ink in
  strike: { ms: 380, css: `
    ${SEL} { animation: uvPop 240ms linear forwards, uvStrikePale 380ms linear forwards; }
    ${SEL} .row-stamp-ring::after { content: ''; position: absolute; left: 4px; right: 4px; top: 50%; height: 6px; margin-top: -3px;
      background: var(--ink); opacity: .62; transform: rotate(-3deg);
      -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8' preserveAspectRatio='none'%3E%3Cpath d='M1 5.7C22 5 40 4.2 58 3.6S86 2.7 99 2.3L99 3.4C86 3.9 72 4.6 58 5.3S24 6.6 1 6.5Z'/%3E%3C/svg%3E") 0 0 / 100% 100% no-repeat, var(--tex-stamp) 0 0 / 60px 60px;
      -webkit-mask-composite: source-in;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8' preserveAspectRatio='none'%3E%3Cpath d='M1 5.7C22 5 40 4.2 58 3.6S86 2.7 99 2.3L99 3.4C86 3.9 72 4.6 58 5.3S24 6.6 1 6.5Z'/%3E%3C/svg%3E") 0 0 / 100% 100% no-repeat, var(--tex-stamp) 0 0 / 60px 60px;
      mask-composite: intersect;
      clip-path: inset(0 100% 0 0); animation: uvStroke 380ms linear forwards; }
    @keyframes uvStroke {
      0%, 5.3% { clip-path: inset(0 100% 0 0); animation-timing-function: cubic-bezier(.3, .1, .3, 1); }
      34.2%, 100% { clip-path: inset(0 0 0 0); }
    }
    ${PALE('uvStrikePale', 39.5, 73.7, 84.2)}
    ${POP} ${REST(380, 84.2)} ${REDUCED}` },

  // 4. ERASE (owner, 2026-10-08: "dry up is the best -- what about erase? i'd like to see both of
  // those"). Round 1's Rub out, rebuilt with the round-2 rules, and recast as an INK eraser: the
  // gritty, abrasive kind that takes ink off paper by wearing the surface -- so it is still the
  // stamp's own world (ink on paper), not the pencil's rub. 380ms.
  //   0-240ms    the erase pop (exactly the row's)
  //   40-300ms   three abrasive passes, left to right, each reaching further; the worn edge is the
  //              paper tooth itself (the ramp runs through --tex-stamp, so it breaks up into grit,
  //              not a soft wipe); meanwhile the ink pales to the tint; gone 250-300ms
  //   115-290ms  a few eraser crumbs -- the rubbed-off ink, so in the TINT, not graphite -- drop from
  //              the stamp's trailing end into the segment's empty lower-right corner and fade; they
  //              are gone before the words start, so they never sit over text
  //   310-380ms  the check + words ink in
  erase: { ms: 380, css: `
    ${SEL} {
      -webkit-mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px), linear-gradient(100deg, transparent 0 38%, #000 62% 100%) 100% 0 / 250% 100% no-repeat;
      -webkit-mask-composite: source-in;
      mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px), linear-gradient(100deg, transparent 0 38%, #000 62% 100%) 100% 0 / 250% 100% no-repeat;
      mask-composite: intersect;
      animation: uvPop 240ms linear forwards, uvErase 380ms linear forwards, uvErasePale 380ms linear forwards; }
    @keyframes uvErase {
      0%, 10.5% { -webkit-mask-position: var(--tx, 0) var(--ty, 0), 100% 0; mask-position: var(--tx, 0) var(--ty, 0), 100% 0; animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      26%  { -webkit-mask-position: var(--tx, 0) var(--ty, 0), 70% 0; mask-position: var(--tx, 0) var(--ty, 0), 70% 0; animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      37%  { -webkit-mask-position: var(--tx, 0) var(--ty, 0), 84% 0; mask-position: var(--tx, 0) var(--ty, 0), 84% 0; animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      55%  { -webkit-mask-position: var(--tx, 0) var(--ty, 0), 46% 0; mask-position: var(--tx, 0) var(--ty, 0), 46% 0; animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      66%  { -webkit-mask-position: var(--tx, 0) var(--ty, 0), 58% 0; mask-position: var(--tx, 0) var(--ty, 0), 58% 0; animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      79%, 100% { -webkit-mask-position: var(--tx, 0) var(--ty, 0), 0% 0; mask-position: var(--tx, 0) var(--ty, 0), 0% 0; }
    }
    ${PALE('uvErasePale', 10.5, 66, 79)}
    .tag-seg.popup-visited:has(> .tag-stamp-out)::after { content: ''; position: absolute; z-index: 2; left: calc(50% + 24px); top: calc(50% + 13px); width: 1.5px; height: 1.5px; border-radius: 1px;
      background: ${TINT}; box-shadow: 3px 1.5px 0 ${TINT}, -2.5px 3px 0 .2px ${TINT}, 4.5px 4px 0 ${TINT}; pointer-events: none;
      animation: uvCrumbs 380ms linear both; }
    @container (max-width: 299.98px) { .tag-seg.popup-visited:has(> .tag-stamp-out)::after { left: calc(50% + 21px); } }
    @container (max-width: 255.98px) { .tag-seg.popup-visited:has(> .tag-stamp-out)::after { left: calc(50% + 17px); top: calc(50% + 11px); } }
    @keyframes uvCrumbs {
      0%, 30% { opacity: 0; transform: translate(0, 0); }
      34%  { opacity: 1; transform: translate(0, 0); animation-timing-function: cubic-bezier(.2, .7, .4, 1); }
      76%, 100% { opacity: 0; transform: translate(8px, 6px); }
    }
    @media (prefers-reduced-motion: reduce) { .tag-seg.popup-visited:has(> .tag-stamp-out)::after { display: none; } }
    ${POP} ${REST(380, 81.6)} ${REDUCED}` },
};
module.exports.TINT = TINT;

// SYNC (UX must-fix 1). Measured without this: the row's pop (rAF, t0 = the tap) leads the tag's
// CSS animation by 2-3 frames (~40ms), because the tag's leaving copy only exists from the
// re-render after the toggle. The build fix, shown here as a mock shim injected into the scratch
// copy: when the leaving copy appears, every animation on it (and the segment's words) is given
// startTime = the tap's timeline time, so the tag joins the row's pop where it already is. In the
// build this belongs in the same click handler that sets popupUnstampId (no new timing source).
module.exports.SYNC_JS = `<script>(function () {
  var tap = null;
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.tag-popup .popup-visited')) tap = document.timeline.currentTime; }, true);
  new MutationObserver(function () {
    var s = document.querySelector('.tag-popup .tag-stamp-out'); if (!s || s.__uvSynced || tap === null) return; s.__uvSynced = 1;
    var seg = s.closest('.tag-seg'), slot = s.closest('.tag-slot');
    s.getAnimations({ subtree: true }).concat(seg ? seg.getAnimations() : [], slot ? slot.getAnimations() : [])
      .forEach(function (a) { a.startTime = tap; });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();</script>`;
