SCORE 8/10

# Swipe LEFT to mark visited, perfection round 1: CD review

## Verdict

**The mechanics are production-grade:**
- C1 delete safety is exact at 4px, with 0 deletes from any stroke.
- The impression moves 0.000px after contact.
- The hand-off is 0/44,352 px, so tilt is preserved.
- Starred and visited rows coexist; rapid strokes land across star and visit rows.
- Reduced motion, screen readers and popup sync are correct.
- Star gate "84 + 8 (+ N8-a)", visit gate 74/74, Impeccable baseline 3.

**The press works without haptics.** In `p1-visit-3x.png` (352ms) and `p1-visit-4x.png` (357/372/389ms), contact is one unmistakable event: full navy ink snaps on, the field washes in on the same frame, and the 3-frame squash settles. It reads as a thunk.

**Two things the owner will see stop it at 8.**

1. **The carry reads as a grey, disabled UI pill, not a stamp held above the page.** This is the longest-visible state of the gesture, about 200ms.
   - At 4x (`p1-visit-4x.png`, 138–306ms) the lifted stamp is a grey bevelled capsule with a heavy blurred halo, which is the look of a disabled iOS button.
   - The cause: the 55% face is translucent, so the dark blurred shadow shows *through* it and turns navy into grey.
   - Elevation is right; see-through elevation isn't. This is UX's P1-N2, and I'm promoting it to a must-fix.
2. **Letters change on a still name at release** (P1-N4). In `p1-visit-3x.png`, 569 → 682ms, "Art Mu" becomes "Art M…" with a new ellipsis, one frame after lift, on a name that never moves.
   - That breaks the rule I set for the star: glyphs change only under motion.
   - The 20px feather softens it but doesn't hide the new ellipsis.

## Rulings on UX's nits

- **P1-N1 (the stamp over the fading X for about 3 frames, "VISITED ×"): FIX.** Reveal the stamp only once the X's 80ms fade has finished, or clip the stamp at the X's left edge until then. "VISITED" must never be struck through.
- **P1-N2 (the lift reads as greyed out): must-fix.** See direction 1.
- **P1-N3 (un-visit fades before it lifts): FIX.**
  - In `p1-unvisit-3x.png` (201–302ms) it reads as dissolving.
  - Ramp the lift (scale and shadow) linearly from the lock, and delay the ink fade so it trails the lift by about 12px of travel.
  - "Picked straight up" means you see it rise *first*.
- **P1-N4 (the tail changes on a still name): must-fix.** See direction 2.
- **`DELETE_TAP_SLOP`: accept 4px** (dial 3–6), as an iPhone check.
  - A wobbled tap on the X doing nothing is the safe failure and matches the owner's mis-tap history.
  - Don't make a >4px wobble navigate either: an X touch must never do something unexpected.

## Directions for round 2 (ordered)

1. **An opaque, lifted stamp.**
   - Back the carried face with an opaque `--paper` fill inside the stamp's silhouette, so the shadow can never show through it.
   - Raise `CARRY_INK` to about 0.7 in **navy**, mixed with paper via `color-mix`, not opacity over the shadow.
   - Keep the shadow outside the silhouette only: tighter and lower-alpha, offset down about 3–4px. It should read as a cast shadow, not a halo.
   - Keep the 1.15× scale and the p² descent.
   - Show at 4x and 1x: at no frame should the face read grey. Measure the carried face's hue and chroma against the pressed navy: hue within 10°.
2. **Hide the re-truncation inside the press, not at release.**
   - Apply the final visited layout (the narrower truncation and ellipsis) **on the contact frame**. That is the one frame where the field, the ink and the scale all change at once, and that salient change is the motion that covers the glyph change.
   - If the finger backs off below the hysteresis (the stamp lifts), restore the old layout on that lift frame, for the same reason.
   - Un-visit: keep the post-release feather sweep. A widening reveal reads as text being uncovered, which is fine. Do make sure the ellipsis leaves under the feather, not at once.
   - **Rule and test:** 0 glyph or ellipsis changes on any frame except (a) the press or lift frame, or (b) frames where the name is under an active sweep. Deliver the long-name strip at 3x and 1x.
3. **P1-N1:** no stamp pixel over the X until its fade completes.
4. **P1-N3:** lift leads, fade trails. Show the un-visit strip at 3x.
5. **Re-run:** the star gate "84 + 8 (+ N8-a)", the visit gate (update V13 for the opaque face and V15 for the press-frame relayout), 0ms tap delay, rows 56.00px, and Impeccable baseline 3.

If 1 and 2 land (a crisp navy lifted face; no still-frame glyph change), round 2 gets my approval. The designer's proposed CLAUDE.md iPhone checks are the right basis. Add "the carried stamp is navy and opaque, never grey".
