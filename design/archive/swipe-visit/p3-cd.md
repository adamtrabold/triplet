SCORE 8/10

# Swipe LEFT to mark visited, p3 "stamp in place": CD review (perfection stage)

## Verdict

**The landing is right, and it is what the owner asked for.** The stamp no longer slides. It stamps in its own slot with the star's grow-shrink, and it settles to the place's own tilt.

**What I checked at real timing:**
- 3x (`p3-visit-3x.png`)
- ~4x (`p3-visit-4x.png`, 358–700ms)
- 1x (`p3-visit-1x.png`)

**What the landing does:**
- The press frame sets the stamp down at −12°.
- It swells and swings through by about 400ms, and holds a clear 1.2× from about 400 to 550ms.
- It dips at about 600–640ms and rests at the tilt.
- It reads as the same family as the star, in the stamp's own voice, and it is satisfying.
- The ink stays crisp at 4x on every frame.
- The field, the ellipsis and the ring closure all land on the press frame, and no letters change at rest.

**It isn't a 9 because of the ~300ms before the commit.** That is part of every stroke, and it is where the owner's thumb is.

- **What it shows:** a sparse dotted hairline traced round the empty slot.
  - For the first ~50ms (72–118ms) it is a lone 10px dash, which reads as a scratch.
  - From there it reads as a **progress spinner**. That is generic UI chrome, not ephemera.
- **The row around it is dead still.** In contrast, the star's pre-commit is the action itself: the name moves and the pencil draws.
- **It contradicts the grammar we set.** Tracing the outline progressively is the *pencil's* language. At the concept stage we rejected the roller for exactly that reason ("a stamp is instant").
- So the cue is both too weak (UX's risk) and in the wrong voice. **That makes it a design fix to make now, not an iPhone dial.**

## Rulings

**(a) The pre-commit cue: fix now.** The direction is the stamp *approaching its slot*, not being drawn.
- UX's P3-S1 (trace the heavier 2px ring) would make it livelier but more pencil-like, so it isn't the primary fix.
- Build it as described in direction 1 below.

**(b) The 1.2× peak: enough, keep it.**
- On a 72px oval, 1.2× is +14px wide, twice the star's absolute growth. At 4x it reads as a strong, deliberate swell.
- UX's clearance sweep settles it: 4.8px at 1.2×, 3.0px at 1.25× and 1.2px at 1.3× (1.4× touches). 1.2× is the ceiling, not a compromise.
- Keep the ×0.6 twist and the rest at `stampTilt()`.

**P3-N2 (the pop starts about 30ms after the press frame): accept as is.** The press frame shows the stamp set down twisted, then it swells. That reads as "down, then pressed".

**P3-N1 (the un-visit ghost goes grey): must-fix nit.**
- At 3x (237–340ms) the ghost reads as a disabled, greyed stamp: chroma 0.016, which is neutral.
- Fade the ring and word toward a **light navy tint at full opacity** (for example, `color-mix` of `--navy` toward `--paper-filed` in oklch, keeping hue fixed), so chroma stays at ≥0.04 until the ghost is gone at 56.
- Measure chroma per frame and deliver a 3x strip.

## Directions for p4 (ordered)

1. **Replace the dotted sweep with an approaching-stamp shadow in the slot.** Show it side by side with UX's solid-ring trace (P3-S1a) at 3x, 4x and 1x.

   **The shadow version:**
   - A soft oval shadow with the stamp's own silhouette, at the place's tilt, sits in the slot from the lock.
   - Nothing slides, and nothing about it is drawn progressively.
   - As travel goes from 0 to 56 it tightens: large (about 1.3×), diffuse and faint at first, then shrinking to the stamp's exact footprint, sharper and darker. Use the p1 height curve (1 − p²), so it closes fastest at the end. That is the "coming down onto this spot" pressure cue.
   - **No navy ink appears before the commit**, so it can never look done.
   - On the press frame, the shadow vanishes as the ink contacts, together with the field, the ring, the ellipsis and the pop.
   - Back-off widens it and fades it; a cancel fades it out.
   - Optionally, per P3-S1b, the name's tail feather tracks travel for the whole 0–56px, so there is movement outside the slot too.

   **Constraints:**
   - The shadow is multiply-dark, not grey-over-ink, so it doesn't repeat p1's grey.
   - It must read on paper, on the visited field and on highlighted rows (all 5 cities' `--figure-deep`).
   - It must not read as a smudge or dirt at 1x.
   - Measure "alive": changed pixels per frame across the pre-commit, so it is continuous change, not a hairline.

   I'll pick between the shadow and the ring trace from the frames. My expectation is the shadow.
2. **P3-N1:** fade to a light navy tint (chroma ≥0.04 until gone).
3. **Keep:** the pop exactly as p3 (1.2×, ×0.6 twist, rest at tilt, 380ms, the star's curve), the un-visit erase pop, and everything in "Kept".
4. **Gates:**
   - Rewrite V13 for the new cue: no navy before commit; the cue is monotonic with travel; it retracts on back-off.
   - Visit gate; star "84 + 8 (+ N8-a)"; curve8; popup-open; dust; D1–D10; the glyph rule (0 still-frame changes); Impeccable baseline 3.
   - Deliver `p4-proposed.diff`.

## iPhone checks (for when this ships; replaces p3's #1)

1. A left stroke shows the stamp coming down onto its spot: a shadow tightening under your thumb, with nothing sliding and nothing drawn. It feels alive, not dead.
2. The press lands with the star's grow-shrink and settles at the stamp's own tilt, never crowding the name or the X.
3. Un-visit lifts with the star's erase pop and fades as pale navy, never grey.
