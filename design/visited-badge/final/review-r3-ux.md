# R3 — UX review (parallel-curve track, seam, text centring)

**Verdict: approve. No blockers.**

The fix fails safe and costs nothing measurable. It leaves click-to-navigate and the B1 tap fix untouched. The complexity is proportionate, because the owner saw these defects on a real device and there is no simpler technique that fixes both the parallelism and the seam. There are two should-fixes, both cheap. One of them matters for the owner: the text-centring diagnosis is Chromium-only, so the iPhone re-check needs to explicitly re-test all three reported defects.

My verification is in this folder:
- `ux-r3-probe.js`: 200 visited rows, a tap hit-test and scroll frame timing, R3 against R2.
- `ux-r3-badmask.png`: the failure-mode render.

---

## (a) Robustness of the startup-generated mask

| Concern | Finding |
|---|---|
| **Generation failure** | Both `var()`s fall back to a transparent gradient. I also tested a **corrupt** data-URI, not just a missing one (`ux-r3-badmask.png`): the dots vanish and the ring and "VISITED" render normally. That degrades to "stamp without perforation" and never to a solid block, and the visited signal is intact. |
| **Slow load / ordering** | There is no ordering risk. The mask lives in a custom property on `:root`, which is live, so any row that renders before `setProperty` runs picks up the dots the moment it is set. `renderCard()` only runs after the Supabase fetch in any case. |
| **Re-render** | `renderCard()` replaces `innerHTML`, while the track is pure CSS (`::before`) referencing one shared URL string. Nothing is regenerated per row or per render, and the decoded image is cached per URL. `cardSignature()` is unchanged. |
| **Perf / memory at ~200 rows** | Measured at 390@3x in mobile emulation with 200 visited rows. Inserting took 56ms (R3) against 50ms (R2). Scroll frames were p50 16.7 / p95 17.2 / max 18.6ms (R3) against 16.7 / 16.8 / 17.1 (R2), which is noise. Only two ~3.3KB strings exist. A 2D non-animated rotate plus a mask doesn't force a compositing layer per row. This is desktop Chromium, not an A-series phone, but the delta is the signal and it is about zero. |
| **Click-to-navigate / B1** | `pointer-events` is inherited, so `::before` computes to `none` (verified). `elementFromPoint` on the dotted track returns `location-actions` in both R2 and R3, the same target B1's `.delete-btn`-only exclusion already handles. There is no new hit target, and the stamp's outer box is unchanged at 72×32, so the delete-gap geometry from R2 still holds. |

## (b) iOS Safari

- **`mask`:**
  - Unprefixed `mask` shorthand needs Safari 15.4 or later.
  - `-webkit-mask` covers everything older and is declared first.
  - The 1x override sets both longhands.
  - `var()` inside the shorthand, with a comma-bearing fallback in parentheses, is valid.
  - The data-URI SVG has a `viewBox` that matches the 72×32 box. With `100% 100%` sizing there is no aspect-ratio letterboxing.
  - I know of no WebKit issue with masks on rotated, non-composited elements. It is still unverified on the device.
- **`text-box`:**
  - It needs iOS 18.2 or later. By Sept 2026 the owner is almost certainly on 18.x or 26, but that is not confirmed.
  - The fallback is the untrimmed line box, about 0.43px high by the designer's own measurement. That is under the 0.5 target and roughly half of R2's error. The fallback is acceptable, and it was right to add no engine-specific nudge.
- **Caveat on "VISITED isn't centred" (see S1).** The owner saw that on WebKit. R3's horizontal fix works because it removes the *Chromium* dotted-border snapping that pushed the ring off-centre, and that removal helps on any engine. But nobody has measured what WebKit's own offset was. WebKit's handling of trailing `letter-spacing` and of baseline snapping could differ.

## (c) 1x fallback
It holds. The same media-query pair now swaps the mask to 32 dashes on the same parallel curve, with the same no-seam rule. The designer verified the computed mask at 1x and 3x, and `r3-crop-r3-tilt-max-1x.png` reads as clean dashes with no haze. It is also more correct than R2's `border-style: dashed`, which carried the same pinch and seam.

## (d) Proportionality
It is proportionate. I would keep the generator.
- **Is there a pure-CSS alternative?** The designer is right that there isn't one that gets within noise. `50%`-radius insets, box-shadow spread and explicit radii all produce the same inset-ellipse math. The R2 gap spread was 1.6px, which is exactly what the owner saw, and R3's is 0.15px. The seam is inherent to `border-style: dotted`. The only exact pure-CSS answer is a pill, which changes the approved shape.
- **Could it be a static data-URI blob instead?** That would mean ~6.6KB of opaque coordinates in the CSS: no runtime JS, but unmaintainable, and any re-tune means regenerating it offscreen. It is not simpler.
- **It is not the "first JS-generated visual in the file".** `badgeHtml()` already builds SVG strings in JS (see the circle markup around l.3192). This follows an existing pattern and doesn't introduce a new one. Correct the designer's concern in the implementation notes.
- The generator itself is a ~50-line pure function over constants. It runs once, has no user data, no DOM reads and no dependencies, and fails soft. That is the right shape for a no-build single file.

---

## Should-fix

### S1. The iPhone re-check must retest all three reported defects explicitly
Every "fixed" number in R3 is Chromium pixels, and the text-centring root cause (border snapping) was diagnosed in Chromium. **Fix:** replace CLAUDE.md's "Needs the user's action → iPhone check of the visited stamp" item with:
- (1) The dotted and solid ovals look parallel all the way round.
- (2) There is no bunching of dots at top-centre.
- (3) "VISITED" looks centred, left to right and top to bottom.

Then keep the three existing checks: scroll then tap a stamp; tap just left of the X; text crisp at arm's length. If (3) still looks off on iOS, the next suspect is WebKit's trailing letter-spacing, not the ring.

### S2. The JS geometry silently depends on the CSS box; cross-reference both sides
`stampTrackMask()` hardcodes `72×32`, `RX 32 / RY 12` (from `inset: var(--s1)` plus the 2px border) and `OFF 3.25`. The mask is sized `100% 100%`, so if someone later changes `.row-stamp`'s width or height, or the ring inset, the dots stretch instead of breaking loudly, and the pinch the owner reported quietly returns. **Fix:** add a one-line comment on `.row-stamp` (the width/height), on `.row-stamp-ring` (inset/border) and on the JS constants: *"Geometry duplicated in stampTrackMask() / .row-stamp — change both together."* Don't derive the values from computed styles at runtime; the fixed constants are the robust choice.

## Nits
- **N1.** Put the two `setProperty` calls next to `stampTrackMask()` as top-level statements, not inside an async init. It works either way, because the property is live, but having them next to each other makes the "built once" claim obvious.
- **N2.** Update the CLAUDE.md shipped-work entry. The track is now a generated dot mask, not a `1.5px dotted` border. The existing bullet says "dotted 1.5px track", "Dotted track, dashed fallback at 1x" and "CSS borders, never SVG strokes", and the last of these needs "(ring only; the track is a mask of SVG *circles*, not strokes)", or a future reader will think the rule was broken.
- **N3.** R2's "−3° is a two-line revert" note still holds, because the mask rotates with the stamp. No change needed; just confirming.

---

# Addendum: R3b switches from the JS mask (C) to B2, a static SVG path mask

**Verdict: approve B2, with one should-fix (S3) that makes its only real iOS risk fail soft.** Everything outside the track source is the same CSS as C, so most of the R3 findings above carry over.

| Check | Result |
|---|---|
| **Failure mode: bad URI** | Same as C. A malformed or undecodable mask image is treated as transparent, so the dots vanish and the ring and word remain. The `var()` fallback is unchanged. |
| **Failure mode: `pathLength` ignored** | **Loud, as the designer says.** I rendered it in `ux-r3b-failsoft.png` ("b2_ignored"): `dasharray 0 1` becomes a dot every user unit, 1.1px dots at a 1px period, which reads as a **solid second ring**. That doesn't hide the "visited" signal, but it turns into a visibly different, heavier stamp. See S3. |
| **iOS Safari** | `mask`/`-webkit-mask` with a data-URI SVG is the same path as C, so R3 (b) stands. `pathLength` on `<path>` scaling `stroke-dasharray` is in SVG 1.1 and SVG 2, and WebKit's historical `pathLength` bugs concern basic shapes and `getTotalLength`, not `<path>` dashing. Choosing `<path>` over `<ellipse>` is right. I would put the likely risk at low, but it is **not verifiable here**, and S3 makes the question moot. |
| **1x fallback** | Holds in Chromium: 32 dashes on the same path. It has the same `pathLength` dependency (`pathLength=32`, `dasharray .6 .4`), so it gets the same S3 treatment. |
| **Tap-through / B1** | Unchanged. It is the same `::before` on a `pointer-events:none` parent, so the pseudo-element inherits `none` and hit-testing still resolves to `location-actions`, which the `.delete-btn`-only exclusion handles. Nothing in B2 touches the DOM or JS. |
| **Perf** | This one improves: there is no startup JS. The render cost is the same as C, which was already within noise of R2 at 200 rows. |
| **S2 (coupling)** | **It still applies, but it is now easier to handle.** The path coordinates (`viewBox 0 0 72 32`, arcs 33.75×14.75, 0.75 inset, all tuned against a 32×12 ring edge) assume `.row-stamp` is 72×32 and the ring is `inset: var(--s1)` plus a `2px` border. Because the mask is sized `100% 100%`, a size change stretches the dots rather than breaking loudly. **Fix:** the same one-line comment, now sitting in the same rule: *"Path geometry assumes the 72×32 box and the ring at inset --s1 + 2px border; re-derive the path if any of those change."* |

## S3 (should-fix). Make `pathLength` fail soft: use an absolute dasharray **and** a matching `pathLength`
Set `pathLength` to the path's real length and express the dasharray in real units:

| Engine behaviour | What renders |
|---|---|
| Honours `pathLength` | The engine rescales its own computed length to exactly 166.29, so you get exact B2 spacing with no seam. |
| Ignores `pathLength` | You get B2abs: 84 dots with at most a small seam (1.75 against 1.94 in Chromium). No solid ring. |

Verified in `ux-r3b-failsoft.png`: "fs" is indistinguishable from "b2", and "fs_ignored" is still clean dots. The path length I measured with `getTotalLength()` is **166.29**.

**3x track:**
```
stroke-dasharray='0 1.9797' pathLength='166.29'
```
**1x fallback:** scale by 166.29 / 32 = 5.197.
```
stroke-dasharray='3.118 2.079' stroke-dashoffset='1.559' pathLength='166.29'
```
The designer should re-run `analyze-rows2.js` on the fail-soft URIs to confirm the "honoured" case still measures 2.02 / 2.02 across the seam. It should, since the rendered dash positions are identical by construction. Then the iPhone check no longer gates the choice between B2 and C; it only confirms dot spacing.

**Recommendation:** ship B2 with S3, not C. It needs no JS, the failure is now soft in every case, and it is visually within noise of C at 3x.
