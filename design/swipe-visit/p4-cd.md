SCORE 8/10

# Swipe LEFT to mark visited, p4 "wick" ink bleed: CD review (perfection stage)

## Verdict

**The mechanics are production-grade, and they are kept from p3:**
- No slide, and the press pop is the star's (1.2×, ×0.6 twist, rest at the tilt).
- The field, the ellipsis and the haptic land on the press frame; no letters change at rest.
- Delete safety D1–D10 passes.
- Honesty holds: a release at 40px dries away with no field change, no flag and no haptic.
- Gates: "84 + 8 (+ N8-a)", vtest 93/93, Impeccable baseline 3.
- P3-N1 is fixed: the un-visit ghost stays blue-navy (C ≥0.045).

**Blocker: wick doesn't look like "ink bleeding in". It looks like a lens.**

I checked `p4-bleed-compare.png` and `p4-visit-4x.png` at real timing:
- **81–129ms:** a blurred fragment ("-SITE-") floats in the slot. It reads as a smear.
- **145–312ms:** the whole stamp is uniformly soft, including the lettering, so "VISITED" comes *into focus*. That is a camera pull, not ink in paper. Soak has the same problem, only worse.

Real ink bleeding is the opposite distribution: **a dense, fairly sharp core with a soft, uneven, fibrous wick at the edges, spreading outward.**

The centre-out, feathered, capillary-curve spread *is* right; that part reads as soaking in. The per-frame `blur()` on the whole stamp is what makes it read as a lens. It is also the WebKit performance risk: a filter on a masked element is software-painted and re-rasterised every touchmove.

## Is UX's core + halo the direction?

**Yes, with two additions that make it ink rather than just "sharp plus glow".**

1. **Core.** The stamp is rendered **crisp** (no blur) in the pale navy tint, revealed by the growing centre-out mask. Its strength steps up with travel (oklch mix, hue held) and never exceeds about 45% of the pressed ink before the commit.
2. **Halo (the wick).** One copy behind the core, with **constant** blur (for example 1.4px, never animated).
   - Revealed by the same mask, but **leading the core by a few px**, so the front is always wet and soft while the letters behind it are dense.
   - **Addition 1, fibre.** Give the halo's edge a **static** paper-fibre texture: a small `feTurbulence` rendered once *as an image* (an SVG data-URI in `mask-image`), multiplied into the halo mask. It is an image, not a live filter, so it is WebKit-safe and gives the uneven, capillary edge that fibre got right at 3x, without fibre's 1x discontinuity or SVG-filter risk.
   - **Addition 2, the growth mechanism.** Drive the spread with `transform: scale()` on a wrapper that carries the radial mask. **Don't regenerate the gradient per frame, and don't animate any filter.** The per-frame work becomes compositor-only (this answers P4-S1 up front).
3. **Honesty with a crisp core.** A pale crisp stamp could read as a faint impression, which would look finished.
   - At 54px the oval's ends must still be soaking: the mask can't have fully reached the ring's ends.
   - The halo's wet edge must still be visible at the front.
   - The ring must never be a complete crisp oval before 56.
   - **The press is the only moment the ring closes crisp.** On the press frame, the halo drops, the core snaps to full navy, and the field and pop run.
   - That soft-edged-to-crisp snap is the payoff the owner asked for.
4. **The first frames.** No floating fragment. The first visible ink must be a small, dense core blot at the stamp's centre with its wick, reading as "ink touched here". Not a blurred piece of the word.

## Rulings on UX's items

- **P4-S1 (WebKit performance): resolved by design.** It is a requirement of the new build, not a conditional: a constant-blur halo, a static fibre image, and a scale-driven mask. Show a trace or rAF numbers under a 4× throttle on the long list.
- **P4-N1 (the one-frame chroma step at the un-visit lock): fix.** Ramp from the resting 82% alpha-mix ink to the oklch tint over the first 4px of travel, so there is no step on the lock frame.
- **P4-N2 (the word is legible from about 32px): accept.** Centre-first contact means the word inks first, which is physically right. Honesty comes from the unfinished ends and the wet front (point 3), not from hiding the word.

## Directions for p5 (ordered)

1. Build the core + wick-halo bleed exactly as above (crisp core, constant-blur halo leading it, static fibre edge, scale-driven mask). Keep the capillary curve and centre-out growth.
2. **Deliver:**
   - held frames at 8/16/24/32/40/48/54px and pressed, at 3x (shown ~4x) and 1x, next to the p4 wick;
   - real-time strips at 3x, 4x and 1x for a natural swipe, a slow drag and a release at 40px;
   - a highlighted row (paper ink on `--figure-deep`) and the visited field.

   **The test:** at no frame does "VISITED" look out of focus; it looks wet.
3. **Measure:**
   - Pre-commit ink contrast stays ≤ about 3:1, and the ring is never closed crisp before 56 (update V13: core unblurred, halo blur constant, mask never at full ellipse before commit).
   - Performance under throttle.
   - Everything in the p4 gate re-run.
4. P4-N1 ramp. Re-run V22.

p5 is approvable if the frames read as ink wicking into paper (dense core, soft fibrous front) and everything else is unchanged.
