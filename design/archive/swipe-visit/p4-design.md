# Swipe LEFT to mark visited: round 4 (p4), the ink-bleed pre-commit cue

The owner's direction, taken from `BRIEF-visit-p3.md`, supersedes the A/B plan:
- "It shouldn't draw its a stamp it should fade or something have them figure it out"
- "It should look like ink bleeding in or something"

**Status:** a perfection-stage tweak.
- `p4-proposed.diff` changes `index.html` only, against main `aa0445e`: 7 hunks, 267 changed lines.
- It is verified with `git apply` then `cmp` against `p4-proto.html`, which `buildp5.py` builds with `VARIANT=2 OUTFILE=p4-proto.html`.

## Scope

**Kept exactly as p3:**
- the press pop: 1.2× peak, ×0.6 twist, rest at `stampTilt()`, 380ms, the star's curve;
- no slide;
- the field, the final truncation and the haptic all land on the press frame;
- delete safety, the X fade, the glyph rule, and everything else that p3 kept.

**Dropped:** variant B (the ring trace), all drawing or tracing, and variant A (the shadow), which the owner's fade direction superseded before it was judged.

## Pre-commit: three bleed treatments

All three share these rules:
- The stamp sits in its slot at its tilt and never moves.
- The name's tail feathers out of the slot's reach first.
- The ink colour is navy thinned toward a light navy tint in oklch (hue held, chroma ≥0.045). It is never alpha-thinned over paper, so it never goes grey.

See `p4-bleed-compare.png`: each treatment held at content travel 8, 16, 24, 32, 40, 48 and 54px, then pressed and settled, at 3x shown ~4x, and at 1x.

| Treatment | Technique | Reads as | Verdict |
|---|---|---|---|
| **1 Soak** | the whole stamp under `blur()` easing 3.2px → 1.1px, ink 25% → 70% | an out-of-focus stamp coming into focus, more lens than ink | Rejected. By 48–54px "VISITED" is legible and near-crisp, so it looks almost done. It is also blobby at 1x. |
| **2 Wick** | a feathered elliptical `mask-image` (radial gradient) growing from the stamp's centre on a capillary curve (fast, then slowing), with a gentle `blur()` 1.8px → 1.2px and ink 30% → 60% | ink soaking outward from where the stamp touches, feathered at its front | **Pick.** |
| **3 Fibre** | wick plus an SVG `feTurbulence`/`feDisplacementMap` paper-fibre edge (one shared filter, driven only for the dragged row) | the most "ink in paper" at 3x | Rejected. At 1x Chromium's filter rendering jumps to crisp at 54px (a discontinuity, not the design). CSS `filter: url(#svg)` on HTML is the WebKit path I trust least for per-frame updates. |

**Why wick.**
- It is the only one that *spreads*. Ink appears first where the stamp would touch, at the centre, and wicks outward, so the progress is the ink's own growth rather than a clean opacity ramp or a focus pull.
- At 54px it is still clearly soft and unfinished:
  - blur is never below 1.2px and ink never above 60%;
  - the oval's ends are still soaking in, because the feather edge reaches the ring's ends only partially.
- The press then snaps it to the crisp, full-ink stamp. That soft-to-crisp contrast is the payoff.
- A release before 56px makes the bleed recede toward the centre and dry away (`p4-release40-*.png`). No ink or field lands.
- It is cheap and Safari-safe:
  - one element on one row;
  - `mask-image` with the `-webkit-` prefix and a radial gradient;
  - `filter: blur()` and oklch `color-mix()`, all of which WebKit ships;
  - no SVG filter.

**How it differs from the un-visit ghost.**
- Both are pale navy on purpose: the same ink family, not grey.
- The ghost is a **crisp** stamp going away. It keeps full shape and sharp edges while it pales.
- The bleed is **soft, feathered and growing**: blur, a feathered front and partial coverage, never a full sharp shape.

## P3-N1 fix: kept from the p4 build

- Un-visit pales the ring and word toward `oklch(0.80 0.045 249.2)` at full opacity, mixing `color-mix(in oklch, var(--navy) k%, tint)`.
- Per-frame composited chroma ≥0.045 and hue 249.2° on every visible frame (V22).
- Highlighted rows keep their paper ink and thin by opacity (not navy there).

## Alive

Changed pixels per touchmove in the slot plus the name's tail, CSS px, pre-commit:

| Drag | Changed px per move | Unchanged frames |
|---|---|---|
| Natural swipe | median 1,420–1,564, minimum 918 | 0 with input |
| Slow drag (0.25px/ms) | median 656–681, minimum 407 | 0 with input |

For comparison, p3's dotted arc was about 170px, cumulative, at 1x. The unchanged frames in the counts only fall between harness inputs; CDP delivers moves at about 20Hz.

## Gates, on `p4-proto.html`

- **Visit gate (`vtest.js`): 93/93** in both motion modes.
  - V13 is rewritten for the bleed. On every visible pre-commit frame: blur ≥1.2px, feathered mask, ink ≤60%, spread and depth monotonic with travel, and the stamp never moves.
  - V22 covers the P3-N1 chroma.
  - The rest (V1–V21, D1–D10) is unchanged. It covers the glyph rule, pop frames, clearance, cancel, delete safety and reduced motion.
- **Star gate:** "84 + 8 (+ N8-a)" passes. The touch suite is 84/84 and `flip6.js` is 8/8 (its control fails 4/4, as designed). N8-a passes on iOS, Android and reduced motion.
- **Other star checks:**
  - popup-open 20/20
  - dust: 0 frames over text; lift → move ≤127ms
  - rows 56.00px, both modes
  - tap delay 1.6ms
  - hand-off 0/5,184 in all four cases
  - `haptic8`: 0 focus frames, 0 document clicks, overlays stay open, reduced motion still ticks
  - `tap8`: 1 trusted toggle per tap
- **Star curve (`curve8.js`), 10 runs, `OUT=` set:**

  | Case | ≥1.3× frames |
  |---|---|
  | row | 11 in 9 runs, 10 in 1 |
  | highlighted row | 11 in 7 runs, 10 in 3 |
  | popup | 9 in all 10 |

  This is within the jitter range UX recorded for main and p3.
- **Impeccable: baseline 3.**

## Strips (real timing)

| Case | 3x | ~4x crop | 1x |
|---|---|---|---|
| Natural swipe | `p4-visit-3x.png` | `p4-visit-4x.png` | `p4-visit-1x.png` |
| Slow drag | `p4-slow-3x.png` | `p4-slow-4x.png` | `p4-slow-1x.png` |
| Release at ~40px | `p4-release40-3x.png` | `p4-release40-4x.png` | `p4-release40-1x.png` |

Also:
- `p4-reduced-3x.png` (reduced motion; the bleed is finger-driven and stays, with no pop)
- `p4-unvisit-3x.png`
- `p4-ios-overlays-1x.png`
- `p4-bleed-compare.png` (all three treatments)

## Dials

- `VS_BLEED`: blur 1.8 → 1.2px (floor 1.0), ink 30 → 60% (ceiling 65), spread `R0` 0.18 + `R1` 0.97·√p, feather solid 40%

## iPhone-only checks

1. The bleed reads as ink soaking into paper, not fog or a focus pull, in daylight on OLED.
2. WebKit renders the per-frame `-webkit-mask-image` radial-gradient update and `blur()` smoothly on the one row, with no jank on a long list.
3. At 54px it still looks unfinished, and the press visibly snaps it crisp.
4. A release before 56px dries away with no stain left.
5. Un-visit stays navy, never grey.
