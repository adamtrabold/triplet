# R3b — Why the dot track is drawn the way it is: measured options

**Verdict: I don't recommend the JS mask (C).** The measurements say the static SVG path mask (B2) is visually indistinguishable from C at 3x, needs no JS, and is about 4× less code. A static SVG wins over pure CSS because every CSS option still leaves the seam the owner circled.

## Method
The method is the same as R3. `r3/analyze-rows2.js` measures each option on `r3b-mockup.html`, which has 11 sections of real rows. Each option is tested on 5 visited rows: −1.5°, −1.75°, −3°, −3.25° and −3.5°, where −3° is the highlighted row in Stockholm's palette and −1.75° is the pressed row.

Each render is at 3x in real row context, with a test-colour override. For each dot the analysis measures:
- **Gap:** the sub-pixel Euclidean distance from the dot centroid to the ring's rendered outer edge.
- **Spacing:** the centroid-to-centroid distance, including the pair that wraps across the start point.
- **Ink:** the summed track coverage, compared against R2.

Raw data is in `r3b-measure.json`. The crops are in `r3b-compare-3x.png`: 3x shown at 2.2× pixelated, the highlighted row, and 1x.

**Noise floor.** C is mathematically exact (the analytic spread is 0), yet it measures a 0.15–0.17px gap spread. Anything within about 0.1px of C is within one third of a device pixel at 3x.

## Results (ranges across the 5 rows at 390px; 375px is identical)

| Option | What it is | Gap spread (all dots) | Gap spread (16 angles) | Dot spacing min–max | Across top-centre (the seam) | Ink vs R2 (≈660) |
|---|---|---|---|---|---|---|
| **C** | JS-generated parallel-curve dot mask | **0.15–0.17** | 0.10–0.16 | 1.91–2.05 | 1.95 / 1.96 | 629–647 |
| **B2** | Static SVG path mask: tuned rounded-rect path, `pathLength=84`, `dasharray 0 1`, round caps | **0.22–0.27** | 0.17–0.27 | 1.85–2.11 | **2.02 / 2.02** (no seam) | 629–651 |
| B2i | The same path as an inline `<svg>` in the markup | 0.22–0.27 | 0.17–0.23 | 1.85–2.11 | 2.04 / 2.03 | 629–648 |
| B2abs | The same path, absolute `dasharray` (no `pathLength`) | 0.21–0.28 | 0.12–0.27 | 1.69–2.14 | **1.75** / 1.94 (seam) | 631–648 |
| B1 | Static SVG `<ellipse>` 35.25×15.25, `pathLength=84` | 0.37–0.45 | 0.27–0.39 | 1.84–2.12 | 1.88 / 1.96 | 638–642 |
| **A3** | **Best pure CSS:** `::before` 1.5px dotted, `border-radius: 34.5px / 15.5px` (numerically optimised) | 0.19–0.28 | 0.17–0.25 | 1.75–2.33 | **2.27** / 1.94 (seam) | 656–665 |
| A2 | CSS dotted `::before`, `50%` | 0.39–0.47 | 0.34–0.38 | 1.29–2.62 | **2.61 / 2.58** (seam) | 651–667 |
| A4 | Dotted `outline` on the ring plus `outline-offset` | 0.32–0.40 | 0.25–0.32 | 1.28–2.61 | **2.52 / 2.53** (seam) | 626–642 |
| A5 | Solid CSS track plus a `repeating-conic-gradient` mask | 0.42–0.49 | 0.37–0.41 | **1.00–3.12** (angle-uniform, not length-uniform) | n/a | 646–660 |
| R2 | Shipped before | 1.56–1.65 | 1.42–1.50 | 1.29–2.62 | 2.61 / 2.58 | 652–666 |

### Findings
1. **No pure-CSS option removes the seam.**
   - Chromium places dotted-border dots itself. It starts at the top and absorbs the remainder there. Even the best tuned radii (A3) leave a 2.27px interval against a 1.94px norm (+17%), and spacing wanders by ±14%.
   - WebKit draws dotted borders with its own, different algorithm, so none of these CSS numbers carry over to the iPhone.
   - The conic mask (A5) spaces the cuts evenly by *angle*, and on a 2.25:1 oval that gives a 3:1 spread in *length*.
   - `box-shadow` cannot be dotted at all.
   - A `radial-gradient` mask tiles on a grid; it cannot follow a curve.
2. **The claim that `dasharray` bunches on curves is not supported here.** With `pathLength`, the spacing is 1.85–2.11px with no bunching and no seam, in both B1 and B2. Without `pathLength` (B2abs) a seam appears: 1.75 against 1.98, because the engine's own path-length calculation differs slightly from mine. **`pathLength` is what makes B work.**
3. **Your estimate of ~0.275px non-parallel error for an SVG ellipse was right** (analytic 0.307). It measures 0.37–0.45px with pixel noise, which is visibly worse than C.
4. **Tuning the shape closes most of the gap.** The rounded-rect path from the A3 optimisation cuts the analytic error to 0.108px, measured 0.22–0.27px. That is within 0.05–0.12px of C, or 0.15–0.35 device px at 3x. At 3x in `r3b-compare-3x.png`, B2 and C cannot be told apart.
5. **All options fit the layout.** Every row is 56.00px at 1x and 3x, with 0 page errors. Dot ink matches R2 within about 5% for every option.

## Cost and risk

| | Lines added to index.html (track only) | JS | Failure mode | iOS risk |
|---|---|---|---|---|
| **C** | ~64 (a 49-line generator, 2 `setProperty` calls, ~13 CSS) | yes | Generator throws or the variable is unset → transparent fallback → the dots vanish, but the ring and word remain (tested). | Low. Plain `<circle>`s in an SVG mask. The mask-in-a-rotated-element path is untested. |
| **B2** | **~16 CSS, 0 JS.** It uses C's exact `::before`/`var()` CSS and replaces the generator with two custom-property declarations holding static data URIs. | no | A malformed URI → the mask image fails → it is treated as transparent → the dots vanish. If `pathLength` were ignored, `dasharray "0 1"` would give a dot every 1 user unit (~166 dots, a near-solid line). That is **loud**, so the device check would catch it at once. | **Medium, and the one thing to verify.** WebKit's handling of `pathLength` with `stroke-dasharray` inside a mask image. I believe it is supported: it is spec'd on `<path>`, and I used `<path>` rather than `<ellipse>` because WebKit's history of `pathLength` bugs is on basic shapes. This is not verifiable here. |
| A3 | ~10 CSS | no | None structural. | **High for the goal.** WebKit's dotted algorithm and seam are its own, so nothing measured here carries over, and the seam is present even in Chromium. |

**1x:**
- C and B2 both swap to a dashed version of the same curve (B2's is a static URI: `pathLength=32`, `dasharray .6 .4`). Both render cleanly (right-hand column).
- A3's fallback is `border-style: dashed`, which keeps the CSS seam.

## Recommendation
**Ship B2: a static SVG path mask, with no JS.** It is the simplest option that measures within noise of C at 3x and has no seam. The Chromium-verified spacing across the start point is 2.02 / 2.02.

**Make it conditional on the one iPhone check:** the track should read as about 84 evenly spaced dots, not a solid line. If WebKit mishandles `pathLength`, fall back to C. That swap is a drop-in replacement, because both feed the same `--stamp-track` variables and the same CSS.

## index.html diff for B2 (supersedes r3-design.md §G; §A–F and §H stand)
- **Delete:** the whole `stampTrackMask()` function and its two `setProperty` calls (r3-design §G, ~51 lines).
- **Add:** the declarations below inside the existing `.row-stamp { … }` rule. Custom properties inherit, so `::before` resolves them.

```css
      /* Perforated track: 84 round dots on a rounded-rect path tuned to
         the ring's parallel curve (max deviation 0.108px vs 0.307px for a
         concentric ellipse). pathLength=84 + dasharray "0 1" spaces the
         dots by true arc length with no start/end seam. 1x: 32 dashes on
         the same path. Static -- no JS. */
      --stamp-track: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 32'%3E%3Cpath d='M36 .75H37.5A33.75 14.75 0 0 1 71.25 15.5V16.5A33.75 14.75 0 0 1 37.5 31.25H34.5A33.75 14.75 0 0 1 .75 16.5V15.5A33.75 14.75 0 0 1 34.5 .75Z' fill='none' stroke='%23000' stroke-width='1.1' stroke-linecap='round' stroke-dasharray='0 1' pathLength='84'/%3E%3C/svg%3E");
      --stamp-track-1x: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 32'%3E%3Cpath d='M36 .75H37.5A33.75 14.75 0 0 1 71.25 15.5V16.5A33.75 14.75 0 0 1 37.5 31.25H34.5A33.75 14.75 0 0 1 .75 16.5V15.5A33.75 14.75 0 0 1 34.5 .75Z' fill='none' stroke='%23000' stroke-width='1.25' pathLength='32' stroke-dasharray='.6 .4' stroke-dashoffset='.3'/%3E%3C/svg%3E");
```

**How the path was derived.** It is the midline of a 1.5px border on a 72×32 box with `border-radius: 34.5px / 15.5px`. Inset 0.75 gives arcs of 33.75×14.75, with 3px straights top and bottom and 1px straights at the sides. The radii came from a numerical search minimising the deviation from the true 3.25px offset of the ring's 32×12 edge; the search is at the top of the R3b turn. Dot tips reach 35.8, inside the 72×32 box.
