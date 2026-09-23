# R2 — UX review (visited passport stamp)

**Verdict: approve for implementation. No blockers.**

Every R1 finding is closed:
- B1 is fixed and I re-verified it.
- The S1 margin is applied.
- The dotted track has a 1x fallback.
- Truncation was tested against real names.

What remains is two should-fixes (one is a comment-accuracy fix and one is a CLAUDE.md log entry) plus nits, and all of them can be folded in during implementation.

My own verification is in this folder:
- `ux-r2-gap.js` and `ux-r2-gap.json`: a snap-zone re-probe at the extreme tilt, for `--s2` versus `--s3`.
- Contrast recomputed independently.
- Two read-only Supabase queries against the real `locations` table.

---

## (a) B1 fix and its proof: **verified**
- The proof in `r2-probe.json` is a real A/B, run with the actual `createCard()` listener logic. Scrolling and then tapping the stamp drops the tap under `.location-actions` (navs stays at 1) and navigates under `.delete-btn` (1→2, with `.active` set). A tap on the X still deletes and does not set `.active`, so the red-X press state keeps its meaning. Diff §5 is exactly the one-line change, and it has an accurate comment. `createShapeCard()` is correctly left alone.
- The row "afterScrollGapTap → delete" is the snap-zone behaviour, not a regression. See (b).

## (b) Delete snap zone

**It is pre-existing. Flag it and log it; don't fix it in this change. `--s2` is enough.**
- The designer's finding holds up. In Chromium, taps up to about 9–12px left of the X's 28px box resolve to delete, and that happens on unvisited rows today. It is not introduced by the stamp.
- My re-probe at the worst tilt (−3.5°):

  | Margin | Stamp→X gap | Snap zone |
  |---|---|---|
  | `--s2` | 11.1px | 9px |
  | `--s3` | 15.1px | 9px |

  With `--s2`, the whole visible stamp sits outside the snap zone. The designer's "≤0.7px overlap at the extremes" affects only the dotted track's outer edge, at a point nobody aims at. **Keep `--s2`.** Spending 4px of name width on `--s3` buys nothing measurable.
- Caveats:
  - The size of the zone depends on the touch radius. Playwright's synthetic taps are nearly points, and a real thumb contact is larger, so the true zone is probably bigger.
  - iOS WebKit does not use Chromium's touch adjustment at all.
  - Treat both numbers as indicative only.
- Why not fix it now: delete is protected by `confirm()`, so a mis-tap costs one dismissal and loses no data. The real fix would be a separate interaction change, either a narrower hit box or moving delete out of the row. That touches every row type, and the owner should decide it on its own merits.
- **Should-fix S1 (docs):** add a CLAUDE.md open item: *"Delete X's effective tap zone extends ~9–12px left of its 28px box via browser touch adjustment (measured in Chromium on today's unvisited rows; iOS unmeasured). `confirm()` is the backstop. If the owner still reports mis-deletes, the next move is shrinking/relocating delete, not more stamp margin."*

## (c) Contrast: **verified**
I recomputed with the sRGB composite, taking multiply into account:

| Stamp ink | On | Contrast |
|---|---|---|
| navy 82% + multiply | `--paper` | 7.81:1 |
| navy 82% + multiply | `--paper-raised` | 8.12:1 |
| navy 82%, blend dropped (fallback) | `--paper` | 7.48:1 |
| navy 82%, blend dropped (fallback) | `--paper-raised` | 7.94:1 |
| 100% paper (highlighted) | `--figure-deep`, all cities | 4.79–5.20:1 |
| 90% paper (rejected) | `--figure-deep` | fails AA in 4 of 5 cities |

- **The highlighted row stays at 100% paper.** That is the right deviation from the CD's 90%: accessibility beats the ink effect. It is also the h3's own pairing on that row, and there is only one focus row at a time, so its heavier stamp reads as emphasis, not inconsistency.
- **Nit N1:** multiply changes contrast by only about 0.3, and the stamp sits about 10px clear of the row's bottom rule, so there is almost nothing under it to blend with. Visually, multiply is nearly inert. Its failure mode is benign (7.48:1). It also forces a stacking context, which can promote a rotated composited layer on iOS. Keep it if the CD values the intent; dropping it would simplify the code and lose nothing a user can see. The CD decides.

## (d) Fixed vs per-place tilt: **either is fine for UX; per-place is endorsed**
- The scan rhythm is carried by the column's centre x, and that is measured constant: 298 at 390 and 283 at 375 in both options. Tilt does not touch it.
- A 2° spread (−1.5 to −3.5) is barely perceptible at 32px. In `r2-375-3x.png` the per-place column reads as the same stamp pressed by hand, not as misalignment. A spread large enough to look sloppy would also bring back the 1x jaggies, and the cap prevents that.
- The per-place angle is deterministic from `loc.id`, so a row never "wobbles" on re-render. That matters: a jitter that changed on every visited toggle would read as a bug. The design already handles this.

## (e) Real long names at 375: **acceptable, and checked against live data**
- Queried live data: 33 of 193 names (17%) are longer than 22 characters, which is roughly the point where a visited row at 375 starts truncating. So about one visited row in six will truncate. That is lower than the CD's estimate of about a quarter.
- Distinguishability is the real risk: two places in one city whose truncated names look the same. I queried for same-city pairs sharing their first 22 characters and found **zero**. Every truncated visited name stays unique within its city list. "Mother restaurant Cope…" and "Stockholm Public Librar…" are both unambiguous.
- The follow-up to trim names that repeat the city stays a one-line note to the owner. Agreed.

## (f) Safari/iOS reasoning (untestable here, so this is the device checklist)

1. **`color-mix()`** needs iOS 16.2 or later. The solid-`--navy` declaration placed first is the correct fallback. Older engines render the R1 look, with multiply making it marginally darker, which is still fine.
2. **`mix-blend-mode` in a scrolling list.** If WebKit isolates the layer, the stamp simply composites at 7.48:1. There is no broken state.
3. **Rotated 10px text inside a possibly composited layer** (transform plus blend). WebKit sometimes rasterises promoted rotated layers slightly soft. It should be fine at 3x. **Check on the device.** If "VISITED" looks blurry, dropping multiply (N1) is the first lever.
4. **Dotted border on an ellipse.** WebKit draws round dots. At 1.5px on 3x the dots are 4.5 device px, which is likely better than Chromium.
5. **`:active` on iOS** needs a touch listener on an ancestor, and `createCard()` already has one. `-webkit-tap-highlight-color: transparent` is already on the row, so iOS adds no grey flash on a stamp tap.
6. **Hit-testing.** iOS picks the best clickable node within its touch radius. The row itself is clickable (a click listener plus `cursor:pointer`), so iOS may favour the row more than Chromium does. That means the delete zone may be smaller on the owner's device. It is unmeasured, which is why S1 is only a log entry.

**Device smoke test (hand to the owner):**
- Scroll, then immediately tap a stamp. The map should navigate.
- Tap just left of the X on a visited row. It should navigate, not raise the delete confirm.
- Look at the stamp text at arm's length. It should be crisp, not soft.

## Should-fix

- **S1:** the CLAUDE.md open item about the delete snap zone. See (b).
- **S2: comment accuracy.** The `.row-stamp` CSS comment in diff §2 hardcodes "(~12px in Chromium)". A browser-specific pixel figure in a code comment will be wrong on the owner's iPhone and will go stale. Reword it to: *"margin-right keeps the stamp clear of the delete button's touch-adjustment zone, so a thumb on the stamp navigates, not deletes."* Put the measurement in CLAUDE.md (S1), not in the CSS.

## Nits

- **N1:** multiply is nearly inert. Keeping it or dropping it is the CD's call. See (c).
- **N2:** the highlighted-row override block should also say *why* it is exempt from the 82% ink: focus-state emphasis plus AA. The current comment covers AA only. It needs one clause.
- **N3:** carry forward the R1 items already scheduled for implementation: the popup mini-stamp (logged) and no toggle animation.
