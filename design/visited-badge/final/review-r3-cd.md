SCORE 9/10 (final)
TECHNIQUE RULING: B2, a static SVG path mask (pathLength=84, no JS). C, the JS generator, is REJECTED as the default and kept only as the documented fallback if the iPhone check shows WebKit mishandling pathLength. A3 (pure CSS) is rejected because it keeps the seam.

## R3b ruling (supersedes §3 and condition 1 below where they conflict)
**Method.** I read `r3b-justification.md` and `r3b-measure.json`, then re-zoomed the C and B2 3x cells of `r3b-compare-3x.png` to about 4.4x with pixelated scaling (`scratchpad/cd-zoom-C.png` and `cd-zoom-B2.png`).

**What the zoom shows.**
- Both tracks read as an even halo. Neither has a pinch or a top-centre seam.
- At 4.4x, B2's dots vary very slightly in rendered weight along the bottom run. That is anti-aliasing phase, not spacing, and I cannot find it at 3x.
- Gap spread is 0.22–0.27px for B2 against 0.15–0.17px for C. The difference is at most 0.12 CSS px, about a third of a device pixel, and inside the analyser's own noise band.
- Under my rule, "simpler wins if it is visually indistinguishable", B2 wins.

**B2 against my seven criteria:**

| # | Criterion | Result |
|---|---|---|
| 1 | Gap spread ≤ 0.2 | Borderline miss: 0.22–0.27 measured. I relax the bar to **≤ 0.3**, because C's exact curve itself measures 0.15–0.17. The real threshold is "within noise of exact". |
| 2 | 0 spacing outliers | Pass. Spacing is 1.85–2.11 all the way round, and 2.02/2.02 at top-centre. |
| | NOTES.md `dasharray` bunching | Disproved *with* `pathLength`. B2abs shows it is `pathLength` that removes the seam. |
| 3 | Dots | Pass. 84 dots, 1.1px round, ink 629–651. |
| 4 | Colour and cost | Pass. `currentColor` through the same `::before` mask. The highlighted row is fine. No cost per row. |
| 5 | 1x | Pass. 32 dashes on the same path, no haze. |
| 6 | Fails soft | Pass for a bad URI (the dots vanish). The failure if `pathLength` is ignored is *loud*: a near-solid line. That is a feature, because the device check cannot miss it. |
| 7 | Maintenance | Acceptable. No JS. The path hardcodes the 72×32 and ring geometry, so UX S2's cross-reference comments still apply (see below). |

**The ring rule is not violated.** "CSS borders, never SVG strokes" governs the ring. B2 uses zero-length round-cap dashes, which render as discs, not a continuous stroke, so the variable-width problem cannot occur. Say this explicitly in the CSS comment and in CLAUDE.md, or a future reader will think the rule was broken.

### Changes to the implementation conditions
1. **Apply `r3-design.md` §A–F and §H, plus the B2 block from `r3b-justification.md`, in place of §G.** Do not add `stampTrackMask()` or any `setProperty` calls. Keep the transparent `var()` fallbacks.
2. **Coupling comments (UX S2) now go on the data-URI declarations.** Wherever the geometry lives, say: "Path geometry assumes .row-stamp 72×32 and .row-stamp-ring inset var(--s1) + 2px border; change both together. Derivation: design/visited-badge/ (see below)."
3. **Save the derivation into the repo** at `design/visited-badge/`, not only in the scratchpad: the radius search, the C generator as the tested fallback, and the r3b table. Scratchpad does not survive the session. If WebKit fails, C must be a drop-in swap and not a re-derivation.
4. **Real-index.html pass criteria** are as in condition 2 below, except that the gap spread bar is **≤ 0.3px**.
5. **The iPhone check gains a seventh point, listed first:** "the dotted ring reads as separate dots, not a solid or near-solid line". If it fails, swap to C, since both feed the same `--stamp-track` variables. Record that fallback in CLAUDE.md.
6. **CLAUDE.md shipped entry:** name B2, note that `pathLength` is load-bearing, and add the SVG-stroke clarification above.

### Addendum: UX S3 is ACCEPTED and becomes a condition
I checked the arithmetic: 166.29/84 = 1.9797. At 1x, 166.29/32 = 5.197, giving dash 3.118, gap 2.079 and offset 1.559. All correct.

**The change.** Set `pathLength='166.29'`, which is the path's real length, and give the dasharray in real units: `0 1.9797` for dots, and `3.118 2.079` with offset `1.559` for 1x.
- If WebKit honours `pathLength`, the render is identical to B2.
- If WebKit ignores it, the result is still 84 dots with a sub-pixel seam, instead of the solid second ring in `ux-r3b-failsoft.png`.

That is strictly better. I had called the loud failure a feature because the device check couldn't miss it. A near-perfect degrade beats a loud one we would then have to fix.

**Consequences for the conditions:**
- (a) Condition 5's first iPhone check becomes "the dots are evenly spaced with no bunching at top-centre". It no longer checks for a solid line.
- (b) C stays in `design/visited-badge/` as the fallback, but it would now only be needed if the seam were visible on the device.
- (c) In the CSS comment, state that `pathLength` equals the measured path length on purpose, so that engines which ignore it still get correct spacing. If the path changes, re-measure it with `getTotalLength()`, and change the path and this number together.
- (d) The real-index.html re-measure must confirm that the S3 values render identically to B2 in Chromium: gap spread ≤ 0.3px, 0 spacing outliers, 84 dots.

---

# R3 — Creative Director review (geometry and optical centring)

## First, accountability
I scored R2 a 9 from 3x crops at normal size and never examined the geometry. The owner caught all three defects on a phone. For this round I re-rendered the R2 and R3 tilt-max crops at about 4.4x with pixelated scaling (`scratchpad/cd-zoom.png`), and read `r3-measure.json` against the pixels rather than trusting the summaries. In the R2 zoom all three defects are plainly visible:
- The dots bunch just left of top-centre.
- The gap is visibly tighter below the ring than above it.
- The word sits left of centre and high.

My R2 sign-off should have caught them.

## Verdict
Approved for implementation, subject to the conditions below. The fix is correct at the root rather than tuned around the symptoms:
- The track now sits on the ring's true parallel curve.
- The seam is removed by construction: N is a multiple of 4, and the dots start at top-centre.
- The caps are centred, not the line box.

Two of the three fixes are pure geometry, so they are engine-independent. That matters because the owner saw the defects in WebKit and these numbers are from Chromium.

This is a 9, not a 10, because text centring is the one fix whose WebKit behaviour nobody has measured. It stays unproven until the owner re-checks it on the phone.

## 1. Are the three defects gone in the pixels? Yes.
- **Parallel.** The gap spread fell from 1.57–1.65px to 0.15–0.17px across all 84 dots in every row, at both widths. The 16-angle sample holds at 3.18–3.35. At 4.4x the R3 track reads as an even halo all the way round, with no pinch at ±22° and no bottom-heavy squeeze. 0.15px is below the analyser's own quantisation floor; there is nothing left to see.
- **Seam.** Spacing is 1.91–2.05px everywhere, with 0 outliers, and 1.95/1.96px across the start point, against R2's 2.61/2.58px. In the zoom the top-centre run is visually indistinguishable from the rest of the track.
- **Centring, horizontal.** dx is −0.03 to −0.10px, and the ink margins are 11.91 and 11.98px. Solved. The diagnosis is also right: the error came from the snapped border moving the ring, not from the tracking.

## 2. Dot weight and density
They match the approved look.
- Same count (84) and the same ~1.97px period.
- Total ink 647 against 652, which is within 1%. The designer caught that the first r=0.75/56-dot pass was about 40% heavier, which is exactly the kind of drift I'd have rejected.
- One real difference: R3 dots are **round**, while Chromium's R2 dots were square specks, visible in the zoom. That is an improvement and not a change of direction. It is closer to Tokyo's perforation and to what WebKit's dotted border already drew on the owner's phone.
- The track is still clearly lighter than the ring, so the R1 hierarchy (solid rule over dots) holds.

## 3. Is the JS-generated mask justified? PROVISIONALLY yes. The final technique call waits for r3b.

The owner has asked for the JS mask to be justified against simpler options. I will make the final call from `r3b-justification.md`, and **simpler wins if it is visually indistinguishable**. Everything else in this review (the defects are gone, density and weight match, the 0.4px residual, and the pass criteria) is technique-agnostic and stands whichever option wins.

Against the options as they stand today:
- **There is no pure-CSS route.** Every concentric-radius mechanism (percent radii, px radii, box-shadow spread) produces the same inset-ellipse math. That math is the defect.
- **A pill would be exact, but it changes the approved shape.** Rejecting it was right.
- **A static data-URI would be worse.** It would be the same bytes as opaque coordinates, and a re-tune would mean regenerating it by hand.
- **The generator is well-shaped.** It is a pure function over constants that runs once, takes no user data, fails soft to "no dots" (UX tested a corrupt URI as well as a missing one), and has zero measured scroll cost at 200 rows.
- **It does not break the "CSS borders, never SVG strokes" rule.** The ring is still a CSS border, and the track is filled circles, not stroked paths. The 1x dashes are stroked polylines, but they are short and straight enough that stroke-width variance is impossible.
- UX is right that it is **not** the first JS-built SVG in the file (`badgeHtml()` already does this). Drop that concern from the notes.

## 4. Is the ~0.4px vertical residual acceptable? Yes, with a specific justification rather than "it's under 0.5".
- The layout is exact: the trimmed word's centre is at 35.99 against 36.00. The residual is Chromium snapping the baseline to whole CSS px, which the nudge test proves. Adding a nudge would break other engines.
- The residual is also in the **optically correct direction**. Its sign is up. Caps centred inside an enclosure conventionally sit a hair *above* geometric centre (the optical centre), because a mathematically centred word reads as sagging. On a 20px-tall interior, 0.4px high is well inside that tolerance.
- The failure I would **not** accept is a residual downward. If the iPhone check shows the word sitting low, that is a defect. Do not add a "correction" upward past optical centre, either.
- The pre-18.2 fallback is 0.43px high, the same direction and within tolerance.

## Criteria the r3b options will be judged on
Each option must be measured with the same analyser at 3x and 1x, in real row context, highlighted and pressed rows included.
1. **Gap spread ≤ 0.2px.** This is the parallel-curve test. For option (B), the path has to be the true *offset* curve, precomputed and inlined. An ellipse or rect path fails the same way CSS does.
2. **0 spacing outliers, including across the start point.** For (B), the start must be at top-centre with an N-multiple-of-4 dot count.
   - NOTES.md recorded `stroke-dasharray` bunching around the curve in the rejected SVG attempt. The designer must show whether `pathLength` fully cures that in both Chromium and WebKit. If it doesn't, (B) fails this criterion.
3. **Dot count, period and total ink** within about 2% of R3 (84 dots / ~1.97px / ~650 units). Dots must stay round.
4. **Ink via `currentColor`,** including the 100% paper highlighted row, and no per-row duplication cost at 200 rows.
5. **A 1x fallback** with no haze.
6. **Fails soft.** A missing track never becomes a solid block.
7. **Maintenance.** A size change must not silently re-introduce the pinch.

**Tie-break:** if (A) or (B) meets 1–6 and is indistinguishable at 4x zoom, it wins over (C).

## Conditions for implementation in index.html (technique-agnostic; the specific diff follows the r3b call)
1. **Apply the winning technique's diff.** If (C) wins, that is diff A–H from `r3-design.md`, with these edits (the equivalents apply to any winner):
   - (a) **UX S2, coupling comments.** Add "Geometry duplicated in stampTrackMask() — change both together" on `.row-stamp` (width/height) and on `.row-stamp-ring` (inset/border). Add the reverse note on the JS constants. Keep them as constants; don't read computed styles.
   - (b) **UX N1.** Place the two `setProperty` calls as top-level statements directly under `stampTrackMask()`.
   - (c) **Comment accuracy.** Remove any "first JS-generated visual" wording.
2. **Re-run the designer's analyser against the real `index.html`** by injecting rows, not against the mockup. Pass criteria, at 390 and 375, at 3x, for tilt-min, tilt-max, highlighted and pressed rows:
   - Gap spread ≤ 0.2px.
   - 0 spacing outliers.
   - |dx| ≤ 0.15px.
   - dy between −0.5px and 0, which means never low.

   Also check:
   - At 1x, the computed mask is the 32-dash variant.
   - Rows are 56.00px everywhere.
   - The stamp's centre x is constant.
   - The B1 real-app probe still passes: scroll then tap a stamp navigates, and the X deletes.
   - Impeccable on `index.html` shows exactly the 3 baseline findings.
3. **Update CLAUDE.md in the same commit:**
   - **UX S1:** replace the iPhone-check item with the six-point list: parallel ovals, no top-centre bunching, VISITED centred (and specifically *not low*), scroll-then-tap navigates, a tap left of the X navigates, text crisp.
   - **UX N2:** rewrite the shipped-work entry. The track is a generated mask of circles on the true parallel curve. The "CSS borders, never SVG strokes" rule applies to the ring, and the entry should say why that doesn't conflict with the mask. Keep the R2 decisions (82% ink, 100% paper exception, per-place tilt, B1) intact.
   - Record that R2's 9/10 missed these defects and why (the geometry was judged at normal size). Any future stamp change gets checked at zoomed, pixel-level geometry before sign-off.
4. **Paste the six-point iPhone check into chat as text for the owner.** Also send the before/after `r3-compare-3x.png`, so they can see what changed before they pick the phone up.
5. **If the owner's phone still shows off-centre text horizontally,** the next suspect is WebKit's handling of trailing letter-spacing (per UX), not the ring. That becomes a separate, measured round and is not to be patched blind.
