// Un-visit transition options for the tag's Visited segment. Each is CSS appended to a scratch copy
// of index.html; it restyles only the shipped un-visit hooks: the lifting copy of the stamp
// (.tag-stamp-out, rendered once per un-visit tap by buildPopupHtml()'s `unstampNow`) and the
// segment's resting content (outline check + "Mark visited", which is already laid out under it).
// No markup or JS changes. Existing tokens only.
//
// Shared pieces:
//  - S = the stamp's resting scale in the tag (--tag-stamp-scale, 1.1 / 1.0 / .85 by stub width).
//  - REST: the resting content inks back in at the end -- the button's colour runs transparent ->
//    --ink (the outline check strokes in currentColor, so check and words arrive together). The
//    lifting stamp sets its own navy, so it is unaffected.
//  - REDUCED: prefers-reduced-motion -> a plain 160ms crossfade (stamp out, rest in), no scale,
//    no rotation, no mask motion, no dust. The shipped rule hides .tag-stamp-out there; this
//    shows it for the crossfade.
const S = 'var(--tag-stamp-scale, 1.1)';
const TILT = 'var(--stamp-tilt, -3deg)';
const REST = (ms, from) => `
    .tag-seg.popup-visited:has(> .tag-stamp-out) { animation: uvRest ${ms}ms linear both; }
    @keyframes uvRest { 0%, ${from}% { color: transparent; } 100% { color: var(--ink); } }`;
const REDUCED = `
    @media (prefers-reduced-motion: reduce) {
      .tag-seg.popup-visited .row-stamp.tag-stamp-out { display: block; animation: uvFade 160ms linear forwards !important; }
      .tag-stamp-out .row-stamp-ring::after { display: none; }
      .tag-slot.vis:has(.tag-stamp-out)::after { display: none; }
      .tag-seg.popup-visited:has(> .tag-stamp-out) { animation: uvRest 160ms linear both !important; }
    }
    @keyframes uvFade { to { opacity: 0; } }`;
// The erase pop (Pencil Star unstar, row un-visit, popup unstar): 1.12x over the first ~240ms,
// no twist, cubic-bezier(.2,.9,.3,1) up then (.5,0,.4,1) back.
const POP = `
    @keyframes uvPop {
      0%   { transform: rotate(${TILT}) scale(${S}); animation-timing-function: cubic-bezier(.2, .9, .3, 1); }
      35%  { transform: rotate(${TILT}) scale(calc(${S} * 1.12)); animation-timing-function: cubic-bezier(.5, 0, .4, 1); }
      100% { transform: rotate(${TILT}) scale(${S}); }
    }`;

module.exports = {
  // The shipped transition, for comparison: 220ms ease-out fade while growing 1.136x; the resting
  // check + words are there from the first frame, under the fading stamp.
  shipped: { ms: 220, css: '' },

  // 1. LIFT -- the stamp-in, reversed. The stamp first lifts with the family's erase pop (1.12x),
  // then rises off the paper along the path it came down: the angle returns toward the stamp-in's
  // -14deg start, the scale opens to 1.45x, the 0.6px blur of its approach comes back, and it
  // goes. The paper is left clean; the check + words ink back in under it.
  lift: { ms: 340, css: `
    .tag-seg.popup-visited .row-stamp.tag-stamp-out { animation: uvLift 340ms linear forwards; }
    @keyframes uvLift {
      0%   { transform: rotate(${TILT}) scale(${S}); opacity: 1; filter: blur(0); animation-timing-function: cubic-bezier(.2, .9, .3, 1); }
      26%  { transform: rotate(${TILT}) scale(calc(${S} * 1.12)); opacity: 1; filter: blur(0); animation-timing-function: cubic-bezier(.45, 0, .7, .7); }
      80%  { transform: rotate(-14deg) scale(calc(${S} * 1.45)); opacity: 0; filter: blur(.6px); }
      100% { transform: rotate(-14deg) scale(calc(${S} * 1.45)); opacity: 0; }
    }
    ${REST(340, 70)} ${REDUCED}` },

  // 2. DRY -- the bleed, reversed. The visit swipe inks the stamp by a bleed that soaks OUTWARD
  // through the paper's fibre; un-visit dries it back INWARD: the same erase pop, while the ink
  // retreats from the ring's ends toward its centre through the paper tooth (--tex-stamp) and
  // pales (opacity only -- the row's un-visit rule: lighter navy, never grey, never darker).
  dry: { ms: 380, css: `
    .tag-seg.popup-visited .row-stamp.tag-stamp-out {
      -webkit-mask: var(--tex-stamp) 0 0 / 90px 90px, radial-gradient(closest-side, #000 50%, transparent 100%) 50% 50% / 170% 170% no-repeat;
      -webkit-mask-composite: source-in;
      mask: var(--tex-stamp) 0 0 / 90px 90px, radial-gradient(closest-side, #000 50%, transparent 100%) 50% 50% / 170% 170% no-repeat;
      mask-composite: intersect;
      animation: uvPop 240ms linear forwards, uvDry 380ms forwards; }
    @keyframes uvDry {
      0%   { -webkit-mask-size: 90px 90px, 170% 170%; mask-size: 90px 90px, 170% 170%; opacity: 1; animation-timing-function: cubic-bezier(.35, 0, .65, 1); }
      100% { -webkit-mask-size: 90px 90px, 0% 0%; mask-size: 90px 90px, 0% 0%; opacity: .25; }
    }
    ${POP} ${REST(380, 70)} ${REDUCED}` },

  // 3. RUB OUT -- the Pencil Star's unstar. The erase pop, then the stamp is rubbed out in three
  // back-and-forth passes, each reaching further (an eraser's stroke), paling as it goes; a few
  // crumbs (the Pencil Star's 1.5px --ink-2 crumbs) are swept off the stamp's trailing end into
  // the segment's lower corner and fade (the dust sweep: 11-13px, ~200ms, never over text).
  rub: { ms: 400, css: `
    .tag-seg.popup-visited .row-stamp.tag-stamp-out {
      -webkit-mask: var(--tex-stamp) 0 0 / 90px 90px, linear-gradient(90deg, transparent 0 46%, #000 54% 100%) 100% 0 / 250% 100% no-repeat;
      -webkit-mask-composite: source-in;
      mask: var(--tex-stamp) 0 0 / 90px 90px, linear-gradient(90deg, transparent 0 46%, #000 54% 100%) 100% 0 / 250% 100% no-repeat;
      mask-composite: intersect;
      animation: uvPop 240ms linear forwards, uvRub 360ms linear 40ms both; }
    @keyframes uvRub {
      0%   { -webkit-mask-position: 0 0, 100% 0; mask-position: 0 0, 100% 0; opacity: 1; animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      28%  { -webkit-mask-position: 0 0, 66% 0;  mask-position: 0 0, 66% 0;  animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      42%  { -webkit-mask-position: 0 0, 80% 0;  mask-position: 0 0, 80% 0;  animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      68%  { -webkit-mask-position: 0 0, 36% 0;  mask-position: 0 0, 36% 0;  opacity: .8; animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      80%  { -webkit-mask-position: 0 0, 48% 0;  mask-position: 0 0, 48% 0;  animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
      100% { -webkit-mask-position: 0 0, 0% 0;   mask-position: 0 0, 0% 0;   opacity: .6; }
    }
    /* crumbs: four 1.5px specks, one box-shadow each, swept from the stamp's right end down-right */
    .tag-slot.vis:has(.tag-stamp-out)::after { content: ''; position: absolute; z-index: 6; left: calc(50% + 30px); top: calc(50% + 12px); width: 1.5px; height: 1.5px; border-radius: 1px;
      background: var(--ink-2); box-shadow: 3px 2px 0 var(--ink-2), -2px 4px 0 .2px var(--ink-2), 5px 5px 0 var(--ink-2); pointer-events: none;
      animation: uvDust 400ms linear both; }
    @keyframes uvDust {
      0%, 40% { opacity: 0; transform: translate(0, 0); }
      46%  { opacity: 1; transform: translate(0, 0); animation-timing-function: cubic-bezier(.2, .7, .4, 1); }
      78%, 100% { opacity: 0; transform: translate(12px, 10px); }
    }
    ${POP} ${REST(400, 74)} ${REDUCED}` },

  // 4. STRIKE -- a clerk cancels a stamp rather than removing it: one pencil stroke (--ink at the
  // Pencil Star's light-graphite weight) is drawn through the stamp in ~110ms, the way the Pencil
  // Star draws a stroke; then stamp and stroke pale away together, with no scale.
  strike: { ms: 380, css: `
    .tag-seg.popup-visited .row-stamp.tag-stamp-out { animation: uvStrikeFade 380ms linear forwards; }
    .tag-seg.popup-visited .tag-stamp-out .row-stamp-ring::after { content: ''; position: absolute; left: -9px; right: -9px; top: 50%; height: 1.6px; margin-top: -.8px; border-radius: 1px;
      background: var(--ink); opacity: .78; transform-origin: 0 50%; animation: uvStroke 380ms linear both; }
    @keyframes uvStroke {
      0%   { transform: rotate(-7deg) scaleX(0); animation-timing-function: cubic-bezier(.3, .1, .3, 1); }
      30%  { transform: rotate(-7deg) scaleX(1); }
      100% { transform: rotate(-7deg) scaleX(1); }
    }
    @keyframes uvStrikeFade {
      0%, 34% { opacity: 1; animation-timing-function: cubic-bezier(.4, 0, .7, .6); }
      85%, 100% { opacity: 0; }
    }
    .tag-seg.popup-visited .row-stamp.tag-stamp-out { transform: rotate(${TILT}) scale(${S}); }
    ${REST(380, 74)} ${REDUCED}` },
};
