# Swipe LEFT to mark visited: p4 ("wick" ink bleed), UX verification

**How:** my own measurements in Chromium at 390px, using real CDP touch paths.

**Scripts:**
- **Bleed contrast and release-at-40 audit:** `visit/me-p4b.js`
- **Un-visit ink, pixels:** `me-p4c.js` (p4 compared with p3)
- **Un-visit ink, every frame:** `me-p4e.js` (OKLCH)
- **Performance:** `me-p4f.js` (rAF) and `me-p4g.js` (trace)
- **Reduced motion:** `me-p4h.js`
- **Delete, combinations, glyphs and haptics, re-pointed:** `me-p4xd.js`, `me-p4xe.js`, `me-p4xb.js`, `me-p4d.js`
- **Gates:** re-run by me

## Verdict

**Approve on function. On look, no blocker from UX:** the CD should make the "reads as ink" call. I lean towards the coordinator's read; see §6.

There are no blockers. One **iPhone-gated risk** is performance on WebKit (§3), and there are two nits.

## 1. Honesty

**Before 56px it never reads as done.** Darkest ink contrast in the slot at each hold:

| Finger position (x) | 335 | 325 | 315 | 305 | 295 | 291 (≈54px of content) |
|---|---|---|---|---|---|---|
| 3x | 1.34:1 | 1.75 | 1.83 | 2.07 | 2.46 | **2.55:1** |
| 1x | 1.39 | 1.80 | 1.88 | 2.07 | 2.61 | **2.69:1** |

- A pressed stamp is about 7:1, so the pre-commit bleed stays **clearly pale and soft**: blur never below 1.25px, and the mask still feathered.
- It is below 3:1 on purpose, as a transient preview. That is the same ruling as the star's ghost, not a state.

**A release at about 40px dries away** (87 frames sampled):
- The row field **never changed** (one colour on every frame).
- `is-visited` was never set, and `locations[0].visited` stayed false.
- The stamp ended at opacity 0 with no filter.
- There was no haptic (0 calls on cancel, in both motion modes).
- The strip `p4-release40-3x.png` agrees: it recedes to the centre and is gone by about 350ms.

## 2. Un-visit: distinct from the bleed, and never grey

Pixel ink at each hold, on the visited field:

| Travel | 16px | 30px | 40px | 48px | 54px |
|---|---|---|---|---|---|
| **p4** | hue 209 / C 0.176 | 211 / 0.184 | 211 / 0.192 | 210 / 0.196 | **210 / 0.196** |
| p3 | 209 / 0.129 | 205 / 0.094 | 198 / 0.051 | 180 / **0.016** | 75 / **0.016** |

**Grey is gone.** The ghost now pales toward a blue tint (for example RGB 168, 193, 218), not toward putty.

**Every frame, OKLCH, composited over the field** (43 frames, full motion and reduced):
- Every un-visit frame is **≥0.0448** chroma, with hue 245–250°.
- The only frames below 0.04 are the ~10 **before the lock**: that is the shipped resting stamp itself (82% navy, 0.034).
- **Nit P4-N1:** at the lock the ink steps from 0.034 (resting, alpha mix) to 0.050 (the full-opacity oklch mix). That is a small one-frame lightness/saturation step as the erase pop starts. It is probably masked by the pop; check it on the device.

**Distinct from the ghost:** yes.
- The ghost is crisp, whole-shaped and pale blue.
- The bleed is blurred, centre-out and partial.
- They are never on screen at the same time.

## 3. Performance (long list, 4× CPU throttle)

**Setup:** 200 rows, dsf 3, a slow pre-commit wiggle in the bleed zone and then a commit, 2 runs each.

**Main-thread rAF:**

| Build | p50 | p95 | Frames over 33ms | Frames over 50ms | Long tasks |
|---|---|---|---|---|---|
| p4 | 16.7 | 16.8 / 33.3 | 2 / 3 | 0 | 0 |
| p3 | 16.7 | 16.8 | 1 / 0 | 0 | 0 |
| `main` | 16.7 | 33.4 | 9 / 9 | 0 | 0 |

**Trace, over the same ~1.5s gesture:**
- Raster-worker time is **p4 46–47ms against p3 33–37ms (+~30%)**.
- Main-thread paint is equal: p4 260–284ms, p3 285–330ms.

**No measurable jank in Chromium**, even throttled.

**The WebKit risk is real but unmeasurable here.**
- Updating a `-webkit-mask-image` radial gradient *and* `filter: blur()` on the same element every touchmove re-rasterises the blurred, masked layer each frame.
- In WebKit, a filter on a masked element tends to be painted in software, not composited.
- On a 120Hz iPhone this is the one place the gesture could stutter.

**Mitigation if the iPhone check fails (P4-S1, conditional):**
- Keep the blur **static** for the whole drag: pick one value, or step it in 2–3 discrete values, not per frame.
- Drive the spread by `transform: scale()` on a mask-carrying wrapper instead of regenerating the gradient.
- Then the per-frame work is compositor-only.

## 4. Kept behaviour

**Delete D1–D10:**
- 0–3px from the X still deletes; 4 / 5 / 6 / 8 / 12 / 20 / 40px never do.
- Visit, un-visit, right, vertical, diagonal and mouse strokes: 0 deletes.
- A start at x = 372 (EDGE) is inert.
- An X tap at 0ms or 100ms after a stroke navigates; at 300ms it deletes. The X stays away until the pop lands, as in p3.

**Glyph rule: 0 still-frame changes**, in both modes, for visit, back-off and un-visit on long names. Changes happen on the press frame, or on the lift frame under the feather.

**Reduced motion:** the bleed is finger-driven and stays.

| Finger travel | Blur | Mask radius |
|---|---|---|
| 20px | 1.75px | 18.8px |
| 35px | 1.57px | 32.2px |
| 50px | 1.39px | 40.6px |
| 62px | 1.25px | 46.0px |

- Scale stays 1.000 throughout. At the commit, the filter and mask are dropped and the stamp appears **with no pop**.
- This fits the app's rule that finger-driven motion stays and nothing moves on its own: the bleed doesn't *move*, it spreads under the finger.

**Other checks:**

| Check | Result |
|---|---|
| Haptics | visit → `ink`, un-visit → `erase`, cancel → none, in both motion modes |
| Starred + visited rows | `SV → S- → --`; marks clear of text (8px and ~98px) |
| Rapid strokes across rows | All land |
| Popup Mark Visited | `aria-pressed` false → true live; popup stays open |
| Scroll-then-tap | Navigates |

## 5. Gates (re-run by me)

| Gate | Result |
|---|---|
| Star touch suite (`test6.js`, `PROTO=p4v.html`) | **84/84** |
| `flip6.js` | **8/8**; its at-rest control fails **4/4** |
| Visit gate (`vtest.js`) | **93/93** |
| Popup-open | **20/20** |
| Impeccable (`p4-proto.html`) | **exactly the 3 baseline findings** |

**curve8** (frames at ≥1.3×; 5 interleaved runs; `OUT` set):

| Build | Row | Highlighted row | Popup |
|---|---|---|---|
| `main` | 11 ×5 | 11 ×5 | 9 ×5 |
| p4 | 11, 11, 10, 11, 11 | 11, 11, 11, 11, 10 | 9 ×5 |

That is the usual frame-phase jitter, **not a regression**.

**Not re-run by me:** `haptic8`, `tap8` and N8-a. That is the designer's gate; this change doesn't touch them.

## 6. Does wick read as ink? (opinion; the CD decides)

**I agree with the coordinator's read, at 24–40px.**
- Wick applies `blur()` to the *whole* stamp, including the lettering. A uniformly soft "VISITED" reads as **defocus**, a camera pulling focus, because the blur is the same across the glyph strokes and the ring.
- Ink bleeding into paper looks different: a **dark, fairly sharp core with a soft, uneven halo spreading outward**. The stroke centres stay dense; only the edges wick.
- The **centre-out feathered spread (the mask) is the part that does read as soaking in.** Keep it.
- **The blur is what reads as lens, not paper.**

**Cheapest change that should read as ink** (for the CD to judge, not UX-required):
1. Render the ink **crisp at low strength** (the pale navy tint, unblurred) inside the growing mask.
2. Add **one blurred copy behind it** as the halo. The halo spreads slightly ahead of the core, so the front is soft while the letters stay dense.

That is the classic bleed look: sharp core, soft wick. It also happens to fix the WebKit risk in §3, because the halo's blur can stay constant while only the mask grows.

- Fibre (treatment 3) reads most like paper at 3x, but its 1x discontinuity and WebKit SVG-filter risk make the designer's rejection sound.

## Nits

- **P4-N1:** the lock-frame chroma and lightness step on un-visit (§2).
- **P4-N2:** before the commit, "VISITED" becomes legible from about 32px, in pale, soft ink. It is still honest (2.5:1, blurred), but the word shows before the press. If the CD wants the word to *arrive* with the press, keep the word under the mask's inner radius only until about 48px.

## iPhone checks (additions)

1. **(Performance)** A slow drag on a long list stays smooth at 120Hz with the bleed updating. If it stutters, apply P4-S1.
2. The bleed reads as ink soaking in, not as out of focus (§6).
3. At about 54px it still looks unfinished, and the press snaps it crisp.
4. A release before 56 leaves no stain.
5. Un-visit stays blue-navy to the end, with no grey and no visible step at the lock.
