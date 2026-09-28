# Swipe LEFT to mark visited: round 5 (p5), core + wet halo ink bleed

**Direction:** this answers the CD's p4 blocker ("wick reads as a lens"), which asked for UX's core + halo, a static fibre edge and a scale-driven mask.

**Diff:** `p5-proposed.diff`, `index.html` only, against main `aa0445e`: 7 hunks, 303 changed lines. It is verified with `git apply` plus `cmp` against `p5-proto.html`, which `buildp6.py` builds from main.

**Kept exactly as p3/p4:**
- the p3 pop (1.2×, ×0.6 twist, rest at `stampTilt()`, 380ms, the star's curve);
- no slide;
- the field, final truncation and haptic on the press frame;
- delete safety D1–D10;
- honesty;
- reduced motion;
- the un-visit erase pop and the navy ghost (P3-N1).

## The bleed

The stamp sits in its slot at its tilt and never moves. The name's tail feathers out of the bleed's reach first. From 6px to 56px of content travel:

| Travel (content px) | What shows |
|---|---|
| 6–14 | **A dense blot**: a small, pooled, soft oval of ink at the stamp's centre, "ink touched here". No word fragment yet; the core waits. |
| 14–40 | **A crisp pale core** (ring, track and word, unblurred) revealed from the centre outward. A **wet halo** (the same stamp at a *constant* 1.4px blur) leads it by about 3px. The front of both is a **fibrous paper edge**. The blot fades back to 35%. |
| 40–54 | The core reaches the ring. The ring's sides ink in first; the **ends are still soaking**. The front stays wet and fibrous. The core ink steps up in three discrete steps: 20% → 26% → 32% navy in oklch toward a light navy tint, hue held. |
| **56 (press)** | The halo, blot and fibre edge drop. The ring closes **crisp at full ink** only now, with the field, the final truncation, the haptic and the p3 pop. Soft to crisp is the payoff. |
| release < 56 | The mask scales back toward the centre, so the bleed recedes to the blot and dries away. No ink, no field, no haptic (V21b). |

## How it's built: compositor-friendly, WebKit-safe

- **The mask is a static image.** `--vs-wick` is an SVG data-URI: a feathered ellipse displaced once by `feTurbulence` + `feDisplacementMap`, **inside the image**. It is used as `mask-image` on `.vs-rv` and rendered once. There is no live SVG filter on HTML.
- **The spread is a transform only.**
  - Each reveal carrier (`.vs-rv`, one for the halo and one for the core) gets `transform: scale(s)`.
  - Its content (`.vs-cs`) gets `scale(1/s)`, so the ink never moves or resizes (net scale 1).
  - Both are `will-change: transform`.
  - Per frame, the only writes are those transforms and the blot's `opacity`.
  - **Nothing regenerates per frame:** no per-frame gradient, blur or filter value. The halo's `blur(1.4px)` is constant. The core-strength step is a class change, so there are two repaints per stroke.
- A capillary curve (the core waits for the blot, then √p spread) and a halo lead of +0.10 scale (about 3px).
- The core mask **never reaches the full ellipse before the commit**: scale ≤ 0.98 at 54px (V13), so the ring's ends are still soaking.

## Measurements

- **The CD's test ("at no frame does VISITED look out of focus; it looks wet").** In the core, the letters are never blurred: the core filter is `none` on every frame (V13). Softness exists only in the halo and the fibre front.
  - Held frames: `p5-vs-p4-compare.png`, p4 against p5 at 8/16/24/32/40/48/54px and pressed, at 3x (shown ~4x) and 1x.
  - Highlighted row: paper ink on `--figure-deep`.
- **Honesty.** Pre-commit ink contrast is ≤ **2.93:1** against paper (the CD asked for about 3:1 or less). The ring is never closed crisp before 56.
- **P4-N1.** Un-visit now ramps from the resting ink (82% navy on the row's field) into the oklch navy path over the first 4px, so there is no lock-frame step. After the ramp, chroma is ≥0.045 on every frame, hue 249.2° (V22: the ramp is monotonic and at most 4 frames).
- **Alive.** Changed CSS pixels per move in the slot plus the tail, pre-commit, only between frames that had input:

  | Drag | Median | Minimum |
  |---|---|---|
  | Natural swipe | 662 | 326 |
  | Slow drag | 395 | 142 |

  p3's dotted arc was about 170 in total. p5 is lower than p4 (whose whole-stamp blur changed everywhere), because the ink behind the front stays still, as ink does.
- **Performance** (200 rows, dsf 3, 4× CPU throttle, a pre-commit wiggle and then a commit, 2 runs each; UX's harness, re-pointed). Logs: `p5-perf-*.log`.

  Trace, whole gesture:

  | Build | Raster worker | Main-thread paint | PrePaint |
  |---|---|---|---|
  | **p5** | **24–25ms** | **140–167ms** | 270–293ms |
  | p4 | 43–44ms | 254–255ms | 84–94ms |
  | main | 53–55ms | 269–311ms | 290–295ms |

  rAF, main thread: p50 16.7ms in every build.
  - p5 has 7–9 frames over 33ms; p4 has 2–5 and main has 5–9.
  - p5 has at most **one frame at ~50–67ms per gesture**, throttled. `perf5f3.js` places these frames **on the lock frame or the press frame** (setting up or tearing down the bleed layers, and the press relayout), never during the drag.
  - p4 showed the same lock-frame hit in one run. Unthrottled that is about 12–17ms, a single frame.
  - Raster-worker time is the lowest of the three builds.
  - Main-thread paint is about half of p4's and main's.
  - PrePaint is at main's own baseline (p4 happened to be lower).
  - An earlier p5 build (before the compositor tweaks) had raster 42–54ms; promoting `.vs-cs` and dropping the halo's promotion halved it.

## Gates (final `p5-proto.html`, md5 checked after the run)

- **Star gate:** "84 + 8 (+ N8-a)" passes. The touch suite is 84/84 and `flip6.js` is 8/8 (its control fails 4/4, as designed). N8-a passes on iOS, Android and reduced motion.
- **Other star checks:**
  - popup-open 20/20
  - dust: 0 frames over text; lift → move ≤116ms
  - rows 56.00px
  - tap delay 1.2–1.6ms
  - hand-off 0/5,184 in all four cases
  - `haptic8`: 0 focus frames, 0 document clicks, overlays open, reduced motion still ticks
  - `tap8`: 1 trusted toggle per tap
- **Star curve (`curve8.js`), 10 runs, `OUT=` set:**

  | Case | ≥1.3× frames |
  |---|---|
  | row | 11 in all 10 runs |
  | highlighted row | 11 in 9 runs, 10 in 1 |
  | popup | 9 in all 10 |

- **Visit gate (`vtest.js`): 93/93** in both motion modes.
  - V13 is rewritten. Before the commit: the stamp never moves; the core has no filter; the halo blur is a constant 1.4px; the core mask scale is ≤1 (0.10 → 0.97); the spread is monotonic; and the ink contrast is ≤2.93:1.
  - V22: the P4-N1 ramp and the chroma.
  - V1–V21 and D1–D10 are unchanged.
- **Impeccable: baseline 3.**

## Strips (real timing)

| Case | 3x | ~4x crop | 1x |
|---|---|---|---|
| Natural swipe | `p5-visit-3x.png` | `p5-visit-4x.png` | `p5-visit-1x.png` |
| Slow drag | `p5-slow-3x.png` | `p5-slow-4x.png` | `p5-slow-1x.png` |
| Release at ~40px | `p5-release40-3x.png` | `p5-release40-4x.png` | `p5-release40-1x.png` |

Also:
- `p5-reduced-3x.png`: reduced motion. The bleed is finger-driven and stays; there is no pop.
- `p5-unvisit-3x.png`
- `p5-ios-overlays-1x.png`
- `p5-vs-p4-compare.png`: held frames, p4 against p5, including the highlighted row.

## Dials

`VS_BLEED`:
- blot wait 0.14
- spread S0 0.10, S1 0.88 (√)
- halo lead 0.10
- blot rest 0.35

Other dials:
- halo blur 1.4px (constant)
- core steps 20/26/32%, with ≤3:1 as the ceiling
- fibre: `baseFrequency` .09/.16, scale 10

## iPhone-only checks

1. It reads as ink wicking into paper: a blot, then a crisp pale core under a wet fibrous front. It must not read as focus or fog, in daylight on the OLED.
2. WebKit renders the data-URI SVG mask (with its internal `feTurbulence`) and the transform-scaled mask carrier crisply, with no re-rasterisation shimmer as it scales. The counter-scaled content stays sharp.
3. There is no stutter at 120Hz on a long list.
4. At 54px the ends still look unfinished, and the press snaps the ring crisp.
5. A release dries away completely, with no stain.
