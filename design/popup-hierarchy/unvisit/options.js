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
  erase_r3: { ms: 380, css: `
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

  // ===== ROUND 4 (owner, 2026-10-08, on live.html: "i dont think either should pop after clicking
  // unvisited -- that's muddying my feedback. but i'd also like to see a more dramatic easing curve on
  // the "dry up" (but maybe it takes slightly longer?) and erase to be more erratic -- like randomized
  // strokes brushing it away... it should take some work"). No pop in any of these.

  // DRY UP A -- "held, then rush". 520ms. The ink holds (only a slow 200 -> 185% creep of the dry edge
  // and the first paling) for 150ms, then rushes back to the centre on a hard ease-in
  // (cubic-bezier(.7,0,.84,0)), vanishing as the rush ends (420-460ms); words 470-520.
  // Why 520: the held beat (150ms) has to read as a held breath, and the rush needs ~300ms to be
  // seen as acceleration rather than a jump; plus the words. ~1.25x the 420ms stamp-in.
  dryA: { ms: 560, css: `
    ${SEL} {
      -webkit-mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px), radial-gradient(closest-side, #000 50%, transparent 100%) 50% 50% / 210% 210% no-repeat;
      -webkit-mask-composite: source-in;
      mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px), radial-gradient(closest-side, #000 50%, transparent 100%) 50% 50% / 210% 210% no-repeat;
      mask-composite: intersect;
      transform: rotate(${TILT}) scale(${S});
      animation: uvDryA 560ms linear forwards, uvDryAPale 560ms linear forwards; }
    @keyframes uvDryA {
      0%     { -webkit-mask-size: var(--ts, 90px) var(--ts, 90px), 210% 210%; mask-size: var(--ts, 90px) var(--ts, 90px), 210% 210%; animation-timing-function: linear; }
      35.7%  { -webkit-mask-size: var(--ts, 90px) var(--ts, 90px), 196% 196%; mask-size: var(--ts, 90px) var(--ts, 90px), 196% 196%; animation-timing-function: cubic-bezier(.55, 0, .85, .3); }
      85.7%, 100% { -webkit-mask-size: var(--ts, 90px) var(--ts, 90px), 40% 40%; mask-size: var(--ts, 90px) var(--ts, 90px), 40% 40%; }
    }
    ${PALE('uvDryAPale', 35.7, 83.9, 89.3)}
    ${REST(560, 91)} ${REDUCED}` },

  // DRY UP B -- "sharp in-out". 560ms. One continuous draw-back on a steep ease-in-out
  // (cubic-bezier(.87,0,.13,1)): it barely moves for the first ~150ms, crosses most of the distance
  // in the middle ~150ms, then glides to its end -- both the acceleration and the braking show.
  // Why 560: a steep in-out spends ~2/3 of its time near its ends, so it needs ~480ms of travel for
  // the fast middle to read; plus the words.
  dryB: { ms: 560, css: `
    ${SEL} {
      -webkit-mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px), radial-gradient(closest-side, #000 50%, transparent 100%) 50% 50% / 210% 210% no-repeat;
      -webkit-mask-composite: source-in;
      mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px), radial-gradient(closest-side, #000 50%, transparent 100%) 50% 50% / 210% 210% no-repeat;
      mask-composite: intersect;
      transform: rotate(${TILT}) scale(${S});
      animation: uvDryB 560ms linear forwards, uvDryBPale 560ms linear forwards; }
    @keyframes uvDryB {
      0%     { -webkit-mask-size: var(--ts, 90px) var(--ts, 90px), 210% 210%; mask-size: var(--ts, 90px) var(--ts, 90px), 210% 210%; animation-timing-function: cubic-bezier(.87, 0, .13, 1); }
      85.7%, 100% { -webkit-mask-size: var(--ts, 90px) var(--ts, 90px), 50% 50%; mask-size: var(--ts, 90px) var(--ts, 90px), 50% 50%; }
    }
    ${PALE('uvDryBPale', 21.4, 78.6, 85.7)}
    ${REST(560, 87.5)} ${REDUCED}` },

  // ERASE -- "randomized strokes brushing it away... it should take some work". 720ms.
  // 5-8 eraser strokes (ERASE_JS, seeded per place: seedRand(id, 'erase:...')), each a ragged swath of
  // paper (the tag's own --paper-raised, through the paper tooth so it leaves grit) drawn across the
  // stamp at its own angle (+-40deg), length, thickness and speed, in either direction, in a shuffled
  // order with uneven gaps: the stamp clears in patches over 20-560ms. Meanwhile the leftover ink
  // pales to the tint (from 340ms), gone 560-600ms; words 650-720. Crumbs of rubbed-off ink (in the
  // tint) drop into the segment's empty lower-right corner (245-560ms), gone before the words.
  // Why 720: 6-7 strokes at a real scrubbing rate (~8-11 a second, each 70-150ms, overlapping) is
  // ~550ms of visible effort; the rest is the pale-out and the words. 1.7x the 420ms stamp-in:
  // undoing it takes work, as asked. Strokes are paper over ink, identical to ink removed because the
  // tag's paper never changes colour (owner rule); they are clipped to the stamp's own box.
  erase: { ms: 720, strokes: true, css: `
    ${SEL} { overflow: hidden; transform: rotate(${TILT}) scale(${S}); animation: uvErasePale 720ms linear forwards; }
    ${SEL} .uv-stroke { position: absolute; left: 50%; top: 50%; background: var(--paper-raised); pointer-events: none; z-index: 3;
      -webkit-mask: var(--tex-stamp) 0 0 / 46px 46px; mask: var(--tex-stamp) 0 0 / 46px 46px; }
    ${PALE('uvErasePale', 47, 77.8, 83.3)}
    .tag-seg.popup-visited:has(> .tag-stamp-out)::after { content: ''; position: absolute; z-index: 2; left: calc(50% + 24px); top: calc(50% + 13px); width: 1.5px; height: 1.5px; border-radius: 1px;
      background: ${TINT}; box-shadow: 3px 1.5px 0 ${TINT}, -2.5px 3px 0 .2px ${TINT}, 4.5px 4px 0 ${TINT}, 7px 1px 0 ${TINT}; pointer-events: none;
      animation: uvCrumbs 720ms linear both; }
    @container (max-width: 299.98px) { .tag-seg.popup-visited:has(> .tag-stamp-out)::after { left: calc(50% + 21px); } }
    @container (max-width: 255.98px) { .tag-seg.popup-visited:has(> .tag-stamp-out)::after { left: calc(50% + 17px); top: calc(50% + 11px); } }
    @keyframes uvCrumbs {
      0%, 34% { opacity: 0; transform: translate(0, 0); }
      38%  { opacity: 1; transform: translate(0, 0); animation-timing-function: cubic-bezier(.2, .7, .4, 1); }
      78%, 100% { opacity: 0; transform: translate(8px, 6px); }
    }
    @media (prefers-reduced-motion: reduce) { .tag-seg.popup-visited:has(> .tag-stamp-out)::after { display: none; } }
    ${REST(720, 90.3)} ${REDUCED}` },

  // ===== ROUND 5 (owner picked Dry up B: "i like dry up B but it should dry up from the center and
  // edges inward like a real blot with that weight"). BLOT: B's weight and curve, a blot's shape.
  // 560ms. A real blot dries where the ink is thinnest: its outer edge retreats inward AND holes open
  // from the centre and spread outward, so the last ink sits in irregular patches between the two.
  // Driven by BLOT_JS: an SVG filter on the leaving copy thresholds two fields -- (centre-ness + noise)
  // for the edge front and (edge-ness + other noise) for the hole front -- with fractal noise seeded
  // per place (uvSeed(id, 'blot:*')), so both fronts are ragged and grain-driven, never two circles;
  // the paper tooth (--tex-stamp mask) still applies on top. Both fronts advance on B's
  // cubic-bezier(.87,0,.13,1) over 0-460ms (the last patches go ~360-420ms); ink pales to the tint
  // 56-350ms (so the patches are pale before the word breaks up), gone by 450; words 460-560. The word breaks up into blot patches (never a straight crop) while it is already pale.
  blot: { ms: 560, blot: true, css: `
    ${SEL} { transform: rotate(${TILT}) scale(${S}); animation: uvBlotPale 560ms linear forwards; }
    ${PALE('uvBlotPale', 10, 62, 80.4)}
    ${REST(560, 82.1)} ${REDUCED}` },

  // ===== ROUND 6 (owner, on the blot: "yeah this reads as it breaking up, not as it drying up. i
  // liked the dry up b i just think it needed to dry up from two directions"). DRY UP B, TWO
  // DIRECTIONS: B exactly (the soft radial mask drawing in from the edges, the pale, the curve, 560ms)
  // plus a second soft front: a clear area grows OUT from the centre on the same curve at the same
  // time. They meet; the last ink is a thin soft ring that pales away. No noise, no seeds.
  //   outer front: B's layer -- radial-gradient(#000 50%, transparent 100%) sized 210% -> 75%
  //   inner front: radial-gradient(30% ink var(--uvi), #000 var(--uvi) + 42%) over the stamp's box,
  //                --uvi -42% -> 40% (a registered <percentage>, so it animates smoothly). It thins the
  //                centre to 30% rather than clearing it, so the bold word -- the thickest ink -- is not
  //                cut through: it erodes and pales last (round 6b, "the thickest things should dry
  //                up slowest").
  //   both 0-480ms on cubic-bezier(.87,0,.13,1); ink pales to the tint 50-310ms (it is pale before
  //   the fronts reach the word, so the word thins and pales -- never a crisp cropped "VISITE"),
  //   gone by 480; words 490-560.
  dry2: { ms: 560, css: `
    @property --uvi { syntax: '<percentage>'; inherits: false; initial-value: -42%; }
    ${SEL} {
      --uvi: -42%;
      -webkit-mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px),
        radial-gradient(closest-side, #000 50%, transparent 100%) 50% 50% / 210% 210% no-repeat,
        radial-gradient(closest-side, rgba(0, 0, 0, .3) var(--uvi), #000 calc(var(--uvi) + 42%)) 50% 50% / 100% 100% no-repeat;
      -webkit-mask-composite: source-in, source-in;
      mask: var(--tex-stamp) var(--tx, 0) var(--ty, 0) / var(--ts, 90px) var(--ts, 90px),
        radial-gradient(closest-side, #000 50%, transparent 100%) 50% 50% / 210% 210% no-repeat,
        radial-gradient(closest-side, rgba(0, 0, 0, .3) var(--uvi), #000 calc(var(--uvi) + 42%)) 50% 50% / 100% 100% no-repeat;
      mask-composite: intersect, intersect;
      transform: rotate(${TILT}) scale(${S});
      animation: uvDry2 560ms linear forwards, uvDry2Pale 560ms linear forwards; }
    @keyframes uvDry2 {
      0%     { --uvi: -42%; -webkit-mask-size: var(--ts, 90px) var(--ts, 90px), 210% 210%, 100% 100%; mask-size: var(--ts, 90px) var(--ts, 90px), 210% 210%, 100% 100%; animation-timing-function: cubic-bezier(.87, 0, .13, 1); }
      85.7%, 100% { --uvi: 40%; -webkit-mask-size: var(--ts, 90px) var(--ts, 90px), 50% 50%, 100% 100%; mask-size: var(--ts, 90px) var(--ts, 90px), 75% 75%, 100% 100%; }
    }
    /* THICKEST DRIES SLOWEST (owner: "the thickest things should dry up slowest"): the thinnest marks
       go first, the heaviest last, inside the same curve and 560ms.
       1. the dotted outer track (1.1px dots): fades 9-45%;
       2. the ring's 2px stroke: fades 30-72%;
       3. the bold word and the filled check: they erode, not crop -- a paper-coloured stroke grows on
          their outlines (text-stroke 0 -> 1.3px; the check's path stroke 0 -> 4.5 units = 1.5px), which
          eats thin parts of each glyph first, while the two soft fronts and the pale finish them by 85.7%. */
    ${SEL}::before { animation: uvDry2Track 560ms linear forwards; }
    @keyframes uvDry2Track { 0%, 9% { opacity: 1; animation-timing-function: cubic-bezier(.45, 0, .55, 1); } 45%, 100% { opacity: 0; } }
    ${SEL} .row-stamp-ring { animation: uvDry2Ring 560ms linear forwards; }
    @keyframes uvDry2Ring { 0%, 30% { border-color: currentColor; animation-timing-function: cubic-bezier(.45, 0, .55, 1); } 72%, 100% { border-color: transparent; } }
    ${SEL} .row-stamp-word { -webkit-text-stroke: 0 var(--paper-raised); animation: uvDry2Word 560ms linear forwards; }
    @keyframes uvDry2Word { 0%, 40% { -webkit-text-stroke-width: 0; animation-timing-function: cubic-bezier(.4, 0, .6, 1); } 85.7%, 100% { -webkit-text-stroke-width: 1.3px; } }
    ${SEL} .row-stamp-check path { stroke: var(--paper-raised); stroke-width: 0; stroke-linejoin: round; animation: uvDry2Check 560ms linear forwards; }
    @keyframes uvDry2Check { 0%, 40% { stroke-width: 0; animation-timing-function: cubic-bezier(.4, 0, .6, 1); } 85.7%, 100% { stroke-width: 4.5; } }
    @media (prefers-reduced-motion: reduce) { ${SEL}::before, ${SEL} .row-stamp-ring, ${SEL} .row-stamp-word, ${SEL} .row-stamp-check path { animation: none !important; } }
    ${PALE('uvDry2Pale', 9, 60, 85.7)}
    ${REST(560, 87.5)} ${REDUCED}` },
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

// ERASE strokes (round 4): the seeded stroke pattern. uvSeed is the app's seedRand() verbatim
// (FNV-1a + murmur mix), so a place always gets the same pattern and places differ. In the build
// this is generated with the leaving copy in buildPopupHtml(), keyed on loc.id. Reduced motion: none.
module.exports.STROKES_FN = `
function uvSeed(id, item) { var h = 2166136261; var s = String(id) + '#' + item; for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; return (h >>> 0) / 4294967296; }
function uvStrokes(stamp, id) {
  if (!stamp || stamp.__uvStrokes || matchMedia('(prefers-reduced-motion: reduce)').matches) return; stamp.__uvStrokes = 1;
  var r = function (k) { return uvSeed(id, 'erase:' + k); };
  var n = 5 + Math.floor(r('n') * 4), order = [], i;
  for (i = 0; i < n; i++) order.push(i);
  for (i = n - 1; i > 0; i--) { var j = Math.floor(r('p' + i) * (i + 1)), t0 = order[i]; order[i] = order[j]; order[j] = t0; }
  var raw = [], t = 0;
  for (i = 0; i < n; i++) { var dur = 70 + 80 * r(i + 'd'); raw.push({ s: t, d: dur }); t += dur * (0.55 + 0.35 * r(i + 'o')) + 10 + 50 * r(i + 'g'); }
  var end = raw[n - 1].s + raw[n - 1].d, k = 540 / end;
  var EASE = ['cubic-bezier(.3,0,.2,1)', 'cubic-bezier(.6,0,.4,1)', 'cubic-bezier(.2,.6,.3,1)', 'cubic-bezier(.5,.1,.9,.6)'];
  for (i = 0; i < n; i++) {
    var slot = order[i], cx = -26 + 52 * (slot + 0.2 + 0.6 * r(i + 'x')) / n, cy = (r(i + 'y') - 0.5) * 14;
    var L = 30 + 34 * r(i + 'L'), H = 8 + 8 * r(i + 'H'), a = (r(i + 'a') - 0.5) * 80, fwd = r(i + 'r') < 0.5;
    var mx = (r(i + 'm') * 46).toFixed(0), my = (r(i + 'q') * 46).toFixed(0);
    var el = document.createElement('span'); el.className = 'uv-stroke';
    el.style.cssText = 'width:' + L.toFixed(1) + 'px;height:' + H.toFixed(1) + 'px;margin:' + (-H / 2).toFixed(1) + 'px 0 0 ' + (-L / 2).toFixed(1) + 'px;border-radius:' + (H / 2).toFixed(1) + 'px / ' + (H / 3).toFixed(1) + 'px;'
      + 'transform:translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) rotate(' + a.toFixed(1) + 'deg);-webkit-mask-position:' + mx + 'px ' + my + 'px;mask-position:' + mx + 'px ' + my + 'px';
    stamp.appendChild(el);
    el.animate([{ clipPath: fwd ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0)' }],
      { duration: raw[i].d * k, delay: 20 + raw[i].s * k, easing: EASE[Math.floor(r(i + 'e') * 4)], fill: 'both' });
  }
}`;
module.exports.ERASE_JS = `<script>${module.exports.STROKES_FN}
(function () { new MutationObserver(function () {
  var s = document.querySelector('.tag-popup .tag-stamp-out'); if (!s || s.__uvStrokes) return;
  var b = s.closest('.popup-visited'); uvStrokes(s, b && b.getAttribute('data-id'));
}).observe(document.documentElement, { childList: true, subtree: true }); })();</script>`;

// BLOT (round 5). uvBlot(stamp, id): gives the leaving copy its own SVG filter and drives the two
// drying fronts from the copy's own CSS animation clock (uvBlotPale), so pausing / seeking that
// animation (stills) or playing it (live) moves the fronts exactly. Field values, per pixel:
//   rad  = 1 at the stamp's centre .. 0 at its ellipse edge (a radial gradient, feImage)
//   edge front:  rad       + 0.6*n1  > t   -> ink stays      (the rim dries inward)
//   hole front:  (1 - rad) + 0.6*n2  > t   -> ink stays      (holes open from the centre)
// n1, n2 contrast-stretched x3.2; t runs 0.02 -> 0.92 on cubic-bezier(.87,0,.13,1) over the first 460ms; ink = both, so the last ink
// is the ragged ring of patches between the fronts. n1, n2: fractal noise (3 octaves, ~11px blotches
// with fine grain), seeds from uvSeed(id, 'blot:1' / 'blot:2'). Reduced motion: no filter (the CSS
// crossfade). In the build: the same filter, generated with the leaving copy in buildPopupHtml().
module.exports.BLOT_FN = `
function uvSeed(id, item) { var h = 2166136261; var s = String(id) + '#' + item; for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; return (h >>> 0) / 4294967296; }
var UV_RAD = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" preserveAspectRatio="none"><radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><rect width="100" height="100" fill="url(#g)"/></svg>');
var uvBlotN = 0, uvDefs = null;
function uvDefsEl() {
  if (uvDefs) return uvDefs;
  var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('width', '0'); s.setAttribute('height', '0'); s.setAttribute('aria-hidden', 'true');
  s.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  (document.body || document.documentElement).appendChild(s); uvDefs = s;
  var warm = new Image(); warm.src = UV_RAD;   // decode the radial field once, before the first un-visit
  return s;
}
function uvBez(x1, y1, x2, y2) {
  return function (x) { var lo = 0, hi = 1, t = x; for (var i = 0; i < 30; i++) { t = (lo + hi) / 2; var u = 1 - t, bx = 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t; if (bx < x) lo = t; else hi = t; }
    var v = 1 - t; return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t; };
}
var UV_EASE = uvBez(.87, 0, .13, 1);
function uvBlot(stamp, id) {
  if (!stamp || stamp.__uvBlot || matchMedia('(prefers-reduced-motion: reduce)').matches) return; stamp.__uvBlot = 1;
  var n = ++uvBlotN, fid = 'uvblot' + n, NS = 'http://www.w3.org/2000/svg', s1 = 1 + Math.floor(uvSeed(id, 'blot:1') * 900), s2 = 1 + Math.floor(uvSeed(id, 'blot:2') * 900);
  var f = document.createElementNS(NS, 'filter');
  f.setAttribute('id', fid); f.setAttribute('x', '0'); f.setAttribute('y', '0'); f.setAttribute('width', '1'); f.setAttribute('height', '1'); f.setAttribute('color-interpolation-filters', 'sRGB');
  f.innerHTML = '<feImage href="' + UV_RAD + '" preserveAspectRatio="none" result="rad"/>'
    + '<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="' + s1 + '" result="n1r"/>'
    + '<feColorMatrix in="n1r" type="matrix" values="3.2 0 0 0 -1.1  3.2 0 0 0 -1.1  3.2 0 0 0 -1.1  0 0 0 0 1" result="n1"/>'
    + '<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="' + s2 + '" result="n2r"/>'
    + '<feColorMatrix in="n2r" type="matrix" values="3.2 0 0 0 -1.1  3.2 0 0 0 -1.1  3.2 0 0 0 -1.1  0 0 0 0 1" result="n2"/>'
    + '<feComposite in="rad" in2="n1" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0.0" result="ov"/>'
    + '<feComposite in="rad" in2="n2" operator="arithmetic" k1="0" k2="-1" k3="0.6" k4="1" result="iv"/>'
    + '<feColorMatrix in="ov" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="oa"/>'
    + '<feColorMatrix in="iv" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="ia"/>'
    + '<feComponentTransfer in="oa" result="om"><feFuncA class="fo" type="linear" slope="14" intercept="0"/></feComponentTransfer>'
    + '<feComponentTransfer in="ia" result="im"><feFuncA class="fi" type="linear" slope="14" intercept="0"/></feComponentTransfer>'
    + '<feComposite in="om" in2="im" operator="in" result="m"/>'
    + '<feComposite in="SourceGraphic" in2="m" operator="in"/>';
  uvDefsEl().appendChild(f);
  var fo = f.querySelector('.fo'), fi = f.querySelector('.fi');
  // thresholds on rad + .6*n (n: the noise contrast-stretched x3.2 so the fronts are ragged, not circles)
  var set = function (p) { var t = 0.02 + 0.9 * UV_EASE(Math.min(1, Math.max(0, p))); /* the threshold: 0.02 (all ink) -> 0.92 (the last, thickest patches linger in the curve's slow tail) */ var ic = (-14 * t).toFixed(3); fo.setAttribute('intercept', ic); fi.setAttribute('intercept', ic); };
  set(0);
  stamp.style.filter = 'url(#' + fid + ')';
  var clock = function () { return stamp.getAnimations().filter(function (a) { return a.animationName && a.animationName.indexOf('uvBlotPale') === 0; })[0]; };
  var tick = function () {
    if (!stamp.isConnected) { f.remove(); return; }
    var a = clock(); if (a && a.currentTime !== null) set(a.currentTime / 460);
    requestAnimationFrame(tick);
  };
  tick();
}`;
module.exports.BLOT_JS = `<script>${module.exports.BLOT_FN}
uvDefsEl();
(function () { new MutationObserver(function () {
  var s = document.querySelector('.tag-popup .tag-stamp-out'); if (!s || s.__uvBlot) return;
  var b = s.closest('.popup-visited'); uvBlot(s, b && b.getAttribute('data-id'));
}).observe(document.documentElement, { childList: true, subtree: true }); })();</script>`;
