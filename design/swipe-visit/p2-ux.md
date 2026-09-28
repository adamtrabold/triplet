# Swipe LEFT to mark visited: p2 UX verification (scoped down)

**Context**
- p2 merged to `main` (1bca73e / 4c746e7); `index.html` is byte-identical to `p2-proto.html`.
- The owner then rejected the carry. Round 3 replaces it with a stamp-in-place pop.
- As instructed, this write-up covers only what carries into p3:
  - delete safety and the 4px slop;
  - the glyph/truncation rule;
  - the curve8 comparison between `main` and p2.
- The carry-specific checks were run but aren't written up as gates: an opaque face, navy ink hue, no inner shadow, the N1 X-clip and the N3 lift order. The short version is at the end, for the record only.

**Everything was measured independently** in Chromium at 390px, with real CDP touch paths.

**Scripts:** `visit/me-p2b.js` and `me-p2b2.js` (glyphs), `me-p2d.js` and `me-p2e.js` (delete and combinations), and `star2/curve8.js` for curve8. `star2/mainv.html` is a byte-copy of `main` at 741731a and `star2/p2v.html` a copy of `p2-proto.html`.

## Verdict

**For what carries into p3: approve.**
- Delete safety holds exactly at 4px.
- The glyph rule holds: 0 changes on still frames.
- Curve8 shows **no systematic regression**. p2 has a slightly heavier tail of 10-frame runs, which is worth watching in p3, not blocking.

## 1. Delete safety and the 4px slop

| Path, starting on the X (x = 346–374) of an unvisited row | Delete confirm | Other |
|---|---|---|
| Still tap | **yes** | — |
| Tap 3px left of the X | yes | pre-existing touch-adjust zone |
| Left 2px, then release | **yes** | — |
| Left 3px, then release | **yes** | — |
| Left **4px**, then release | **no** | — |
| Left 5 / 6 / 8 / 12 / 20 / 40px, then release | **no** | no visit |
| Left 90px (commit) | no | visits |
| Left 90px on a visited row | no | un-visits |
| Right stroke | no | refused |
| Vertical scroll | no | scrolled 127px |
| 40° diagonal | no | scrolled 58px |
| Mouse drag | no | visits |
| Start at x = 372 (EDGE 24), left 90 | no | inert |
| Start at x = 364, left 90 | no | visits |
| X tap 0ms after a stroke | no | navigates (the X is still fading) |
| X tap 100ms / 300ms after a stroke | **yes** / **yes** | X is back |
| Another row tapped 0 / 150ms after a visit stroke | — | navigates |

**The threshold sits exactly at 4px, and no swipe path raised the confirm.** Identical to p1.

**Combinations:**
- Starred + visited row: a left stroke un-visits and keeps the star, and a right stroke then unstars (`SV → S- → --`).
- Rapid strokes across rows (star↔visit, visit↔visit, at 0 and 100ms) all land.
- Scroll-then-tap navigates.
- Popup Mark Visited follows the stroke live (`aria-pressed` false → true, and the popup stays open).
- Reduced-motion visit: scale 1.000 on every frame, 0 movement.
- Star touch suite on p2 (`test6.js`, `PROTO=p2v.html`): **84/84**.

**Carries into p3 unchanged:**
- D1–D10 must be re-run on p3's pop.
- The 4px dial (3–6px) stays an iPhone check. A 4px-plus wobble on the X now does nothing at all, which is safe but could read as "the X ignores me".

## 2. The glyph and truncation rule

- Per-rAF sampling of the name's `clientWidth`, `scrollWidth` and right edge, alongside the stamp's transform and ink, the field colour and the text column's mask.
- A glyph change counts as "still" if none of those other properties changed on the same frame.
- Class-name changes were deliberately *excluded* as evidence of motion.

| Case (long names) | Full motion | Reduced motion |
|---|---|---|
| Visit | 1 change, on the **press frame** (stamp, ink, field and mask all change); **0 after lift** | 1 change, on the press frame (ink, field, mask); 0 after lift |
| Press, then back off below the hysteresis | 2 changes: the press frame, and the lift-back frame, each with stamp/ink/field/mask changing | same, 2 with motion |
| Un-visit | 1 change, on the **lift frame** (+5ms after `touchend`), with the stamp transform and ink changing | 1 change, on the commit frame, with everything changing |
| **Still-frame glyph changes** | **0** | **0** |

**Un-visit detail** (`me-p2b2.js`):
- On the lift frame the text column widens from 194 to 278px **under a mask that is opaque to 174px and clear by 194px**. The replaced ellipsis sits in that 20px feather.
- The feather then sweeps outward over about 180ms (edge 194 → 289px) while the tail letters fade in.
- So the swap happens under a partly transparent feather, on a frame where the stamp is also changing, **not** on a still name. This meets the rule.

**For p3:** the pop replaces the carry, so the press frame will look different. Keep the same test:
- 0 glyph changes on still frames, in both motion modes, for visit, back-off and un-visit.
- Re-point `me-p2b.js` and run it.

## 3. curve8: `main` vs p2 (the star landing)

Runs were sequential, not parallel; the second batch interleaved `main` and p2. Each cell is frames at ≥1.3×.

| Build | Row (10 runs) | Highlighted row (10 runs) | Popup (10 runs) |
|---|---|---|---|
| **`main` 741731a** | **11** ×10 | 11 ×9, **10 ×1** | 9 ×10 |
| **p2** | 11 ×7, **10 ×3** | 11 ×10 | 9 ×9, **1 ×1** (outlier, see below) |

Frames ≤0.97 were 3 in every run of both builds. Peak 100–117ms and rest 350–383ms in both.

- **The designer's "`main` also measures 10" is true, but rare.** It happened once in 20 row-type samples on `main`, against 3 in 20 on p2.
  - With these counts (1/20 vs 3/20), the difference is not statistically meaningful: Fisher's exact test gives p ≈ 0.6.
  - Both builds sit well above the ≥6-frame rule.
  - So this is **not a regression**, but the 10s cluster on p2's normal row. Re-run curve8 ×10 on p3; if p3 shows 10 in ≥5/10 row runs, flag it.
- **The popup "1" outlier (p2, run 8) is a harness artifact.** The sampler's first recorded frame was already past the peak (t0 = 1.302 and falling), so it missed the start.
  - A long-task probe on the popup-star tap (`lt.js`, 6 taps per build) found **0 long tasks, and the largest rAF gap was 17ms in both builds**.
- Side effect worth knowing: `curve8.js` writes `r8-curve.json` by default. My first 10 runs overwrote the round-8 copy in `star2/`. Set `OUT=` when re-running.

## For the record only (carry-specific, superseded by p3)

- **Carried face:**
  - 4x pixel check, with the row repainted magenta behind the stamp, at 9 travel points.
  - **0 magenta pixels inside the (rotated) silhouette.**
  - The face band equals the fill exactly (max deviation 0), so there is no inner shadow.
  - Ink RGB (85, 99, 110), HSL hue 206° / chroma 0.098, against the pressed stamp's 207° / 0.129. That is the same navy family.
- **N1:** a real-time screencast with the X painted magenta shows no stamp pixels inside the X's box while the X is visible, beyond X antialiasing that also appears in the reduced-motion control, where the stamp never nears the X.
- **N3:** the lift leads. Scale is 1.016 → 1.027 at 16–20px with the ink unchanged; the fade starts at 26px.
  - One observation for whatever replaces it: the fading ghost passes through **neutral grey** (chroma 0.012 at 48px), because navy mixed toward warm paper cancels out. If p3's un-visit fades the ink, fade opacity or mix toward a navy tint rather than toward the field, or it will read as the "disabled grey" the CD rejected.
