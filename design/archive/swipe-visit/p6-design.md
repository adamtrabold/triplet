# Swipe LEFT to mark visited: round 6 (p6), UX's five p5 fixes

**Diff:** `p6-proposed.diff`, `index.html` only, against main `aa0445e`: 7 hunks, 316 changed lines.
- Verified with `git apply` then `cmp` against `p6-proto.html`, which `buildp7.py` builds from main.
- The md5 was re-checked after the gate run.

**Unchanged from p5:**
- the core + wet-halo bleed and its scale-driven static mask;
- the p3 pop;
- no slide;
- delete safety;
- honesty (release dries away);
- reduced motion;
- the un-visit erase pop.

All numbers below are pixel measurements. They come from UX's own scripts, re-pointed at p6 (`m6a.js` = `me-p5a.js`, `m6n.js` = `me-p5n.js`), at 3x, with the darkest ink pixel against the field.

## The five fixes, measured

### 1. P5-S1: the highlighted row is capped like the normal row

**Cause.** `.location-card.highlighted .row-stamp { color: paper }` (0,3,0) out-ranked the bleed copies' colour (0,2,0), so the focus row inked at the pressed strength. The copies' rule is now `.location-card .row-stamp.vs-copy`, and highlighted rows get paper mixed into their own field in three steps (34 / 42 / 50%).

| Highlighted row | 12–20px | 24–40px | 48–54px | Pressed |
|---|---|---|---|---|
| p5 contrast | 4.76–4.80 | 4.80–4.84 | 4.84 | 4.79:1 |
| **p6 contrast** | **1.86** | **2.11** | **2.40** | 4.79:1 |
| Ring coverage at 54px | p5: 92% | | **p6: 68%** | 100% |

### 2. P5-S2: un-visit only pales, never darkens

**Change.** The ghost path starts **at** the resting ink (82% navy on the row's field) and mixes in oklch toward the light navy tint. Until 12px nothing changes at all.

Pixel L / C / h at 1px steps across the lock:

| | Rest | c4–c12 | c16 | c24 |
|---|---|---|---|---|
| p5 | 0.401 / 0.035 | **0.274 / 0.050** (darker) | 0.341 | 0.472 |
| **p6** | 0.401 / 0.035 / 247 | **0.401 / 0.035 / 247** (no step) | 0.451 / 0.035 / 244 | 0.550 / 0.038 / 247 |

V22 now asserts, on every frame: L starts at 0.401, L never drops, C never falls below 0.033, hue held.

### 3. Pre-commit colour: the same navy at lower density

Normal rows now use `oklch(0.70 | 0.665 | 0.632  0.035 247)`: the pressed stamp's own hue (247) and chroma (0.035), stepping lightness only. p5 used a lighter, bluer ink at C 0.042–0.046.

| Measure | Value |
|---|---|
| Pixel chroma, 12–54px | **0.028–0.035** (pressed 0.035) |
| Hue | 246–247 (pressed 247) |
| Contrast | 2.26–2.92:1 (pressed 6.90:1) |

### 4. First ink: the core stays inside the blot until 18px, on every row type

**Change.** The core reveal holds at scale 0.10, which is a 1.8 × 1.3px ellipse, inside the blot's solid 5.4 × 2.7px, until content 18px (`WAIT` 0.24). It is the same on every row type.

| | 12px | 16px | 20px |
|---|---|---|---|
| Core scale (both rows) | 0.10 | **0.10** | 0.456 |
| Word-band ink, normal | 9% (the blot) | 9% | 32% |
| Word-band ink, highlighted | 8% | 8% | 29% |

p5's core was 0.332 at 16px on both rows, which is where "SIT" came from. V13 now asserts core scale ≤ 0.1001 on every frame below 18px.

### 5. No floating text: a rounder reveal

**Change.** The reveal ellipse in the static mask is now aspect **1.4** (18.2 × 13px at scale 1), not the stamp's 2.25. The ring's top and bottom arcs ink with the word, and the ends soak until the press. Fibre displacement is 7, not 10, because the scale range is larger.

Normal row (the highlighted row is within 1–4 points):

| Travel | 24px | 32px | 40px | 48px | 54px | Pressed |
|---|---|---|---|---|---|---|
| p5 ring coverage | 0% | 0% | 1% | 40% | 71% | 100% |
| **p6 ring coverage** | 0% | **28%** | **42%** | **57%** | **69%** | 100% |
| p6 word band | 44% | 57% | 57% | 60% | 60% | — |

- The ring is never closed before the press: the reveal's half-width reaches at most 29.3px at 54px, against the ring's 32px and the track's 36px (V13).
- The ring now arrives with the word instead of 16px after it.

## Everything else, re-run on the final file

**Visit gate (`vtest.js`): 93/93** in both motion modes.
- V13 (bleed) additionally asserts:
  - core ≤ blot until 18px;
  - reveal half-width < ring end;
  - pre-commit ink ≤2.92:1.
- V22 is rewritten as in fix 2.

**Star gate:** "84 + 8 (+ N8-a)" passes.
- Touch suite 84/84, and `flip6.js` 8/8 (its control fails 4/4, as designed).
- N8-a passes on iOS, Android and reduced motion.

**Other star checks:**

| Check | Result |
|---|---|
| Popup-open | 20/20 |
| Dust | 0 frames over text; lift → move ≤117ms |
| Rows | 56.00px |
| Tap delay | 1.9–2.0ms |
| Hand-off | 0/5,184 in all four cases |
| `haptic8` | 0 focus frames, 0 document clicks, overlays open, reduced motion still ticks |
| `tap8` | 1 trusted toggle per tap |

**Star curve (`curve8.js`, 10 runs, `OUT=` set):** row 11 in all 10 runs; highlighted row 11 in all 10; popup 9 in all 10.

**Impeccable:** baseline 3.

## Performance (200 rows, dsf 3, 4× throttle; the p5 harness)

**Trace:** p6's raster is 30–36ms, against p5's 23–29ms and main's 54–59ms. Paint is 134–142ms against 153–155ms and 333–396ms.

The small rise over p5 is the larger scaled mask area (the rounder reveal scales further). It is still about half of main's.

**rAF:**
- p50 is 16.7ms in every build.
- In 4 of 5 p6 runs the worst frame is ≤50ms. One run showed 5 frames over 50ms (max 83ms).
- The attributed re-runs (`perf5f3.js`, 4 runs) put p6's only slow frame **on the lock frame**. Main shows the same lock-frame hit.
- It never happens mid-drag.

## Alive

Changed CSS px per move, pre-commit, only between frames that had input:

| Drag | Median | Minimum |
|---|---|---|
| Natural swipe | 1,014–1,044 | 173 |
| Slow drag | 714–733 | 52 |

That is up from p5's 662 and 395, because the ring now inks during the drag.

## Strips (real timing)

| Case | 3x | ~4x crop | 1x |
|---|---|---|---|
| Natural swipe | `p6-visit-3x.png` | `p6-visit-4x.png` | `p6-visit-1x.png` |
| Slow drag | `p6-slow-3x.png` | `p6-slow-4x.png` | `p6-slow-1x.png` |
| Release at ~40px | `p6-release40-3x.png` | `p6-release40-4x.png` | `p6-release40-1x.png` |

Also:
- `p6-reduced-3x.png`
- `p6-unvisit-3x.png`
- `p6-ios-overlays-1x.png`
- `p6-vs-p5-compare.png`: held frames 8–54px and pressed, p5 against p6, on normal and highlighted rows, at 3x and 1x.

**Logs:**
- `p6-held.log`: fixes 1, 3, 4 and 5
- `p6-unvisit-px.log`: fix 2
- `p6-perf-*.log`
- `p6-alive.log`
- `p6-gate.log`

## Dials

| Dial | Value | Range |
|---|---|---|
| Normal-row ink | L 0.70 / 0.665 / 0.632 at C 0.035 | C 0.035–0.045 on the device |
| Highlighted mix | 34 / 42 / 50% paper | keep ≤ ~3:1 |
| `WAIT` | 0.24 (18px) | — |
| Reveal aspect | 1.4 | 1.3–1.5 |
| `S1` | 1.55 | ≤1.75 keeps the ends open |
| Halo lead | 0.16 | — |
| Fibre displacement | 7 | — |

## iPhone-only checks (add to p5's)

1. The pre-commit ink reads as the stamp's navy, only thinner, not a brighter blue.
2. On the focus row, the pre-commit stamp is visibly weaker than the pressed one.
3. Un-visit never darkens at the lock; it only pales.
4. The ring's top and bottom ink with the word, with no floating "VISITED".
5. The scaled mask renders crisply, with no shimmer.
