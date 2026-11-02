# Visual designer notes: icons batch 2

## Where things stand (2026-11-02, after jam turn 2)
- Sketches are declarations in `batch2/sketches/sketch.js`, built by the system's maker (no drawing). Run: `TOOLS=<dir with node_modules/paper, clipper-lib> bash batch2/sketches/build.sh 18 <ids>`, then `node batch2/sketches/sheet.js <abs path>/contact-1.png` (Playwright Chromium). Builds take 1-17 min each on 4 cores. `at-wheel4` and `sh-carrier` hung for more than 30 min and were killed, so they show "missing".
- Contact sheet 1: `batch2/sketches/contact-1.png`.
- Strongest so far: Landmark lm-needle (camera pending the hole rule) · Attraction at-bigtop (wheel control) · Venue curtain control · Hotel ht-nofoot · Shopping bag control · Park pk-picnic · Street st-lamp · Neighborhood none yet (roofline N1 needs side-by-side roots).
- The four inks are set (categories-design-calls.md). Turn 1 was wrong to say they weren't.

## Leanings, and why
- Shapes: elevation, not plan. At 18 the plan pair (blocks/corridor) can't be told apart.
- Slab on legs goes to Park (the picnic table); the bed drops its legs.
- Drapes belong to one icon: Venue (curtain) or Attraction (big top). The director decides.

## Open questions
- The camera for Landmark: the owner's own words back it. Draw it once the hole rule exists.
- Why vn-stage lays out tall and narrow (the drape with a slab under it). A question for systems.
- Why the wheel4 and carrier builds hang.

## Next
Director steers the family calls. Systems adds rules 1-3 (jam.md turn 2). Round 2: needle vs camera, big top vs wheel, picnic side-on (A-frame), roofline + lamp pair, bed variants at 24 and 12.
