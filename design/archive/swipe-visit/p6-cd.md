SCORE 9/10

# Swipe LEFT to mark visited, p6 "ink bleed" (core + wet halo): CD review (perfection stage)

> **Historical record (note added 2026-09-29).** Instructions below to update `CLAUDE.md` were carried out at the time; those entries now live in `docs/shipped.md` (feature history/spec), `docs/iphone-checks.md` and `docs/backlog.md`. Don't re-apply them — later rounds may have superseded them.

## Verdict

**Approved for integration, with one must-fix before it ships.** This now reads as ink bleeding into paper. That is the owner's ask: no drawing, no slide, and a pop like the star's.

I checked it at real timing: `p6-visit-4x.png`, `-3x`, `-1x`, `p6-release40-3x.png`, and `p6-vs-p5-compare.png` (normal and highlighted rows, 3x and 1x).

**The drop lands (73–168ms).** The first ink is a small, dense blot in the stamp's centre. It darkens and widens: a drop of ink touching the paper. The p4 floating fragment is gone, and the core stays inside the blot until 18px on both row types.

**It soaks outward (203–309ms).**
- The word emerges from the blot with a wet, fibrous halo leading it.
- From about 32px the oval's top and bottom arcs arrive *with* the word. The ends are still soaking at 54px, and the ring is never closed (69% at most).
- The letters are dense at the core and soft only at the front. That is the difference between "wet ink" and p4's "out of focus", and it now reads as blotting paper, not a lens.
- The colour is the stamp's own navy at lower density (hue 247, chroma 0.028–0.035), not a brighter blue. So the bleed is visibly *the same ink, not yet pressed*.

**The press pays off (351ms).** The soft, pale, partial bleed snaps on one frame to the crisp, full-navy stamp, twisted at −12°. The field and ellipsis land with it, then the star-family pop: 1.2× swell, dip, rest at the tilt. The soft-to-crisp contrast is exactly the payoff the owner asked for, and it carries "done" with no haptic, which matters on iOS 27.

**It stays honest.**
- A release at 40px recedes back to the blot and dries away in about 180ms. There is no stain, no field change and no haptic.
- Pre-commit contrast is ≤2.92:1 on normal rows and ≤2.40:1 on highlighted rows, against 6.9:1 and 4.79:1 when pressed.
- Un-visit only pales, never darkens, and never goes grey.

**Nothing else regressed.**
- Star gate "84 + 8 (+ N8-a)" passes, and UX's independent re-run agrees; vtest 93/93.
- curve8: 11 frames at ≥1.3× on the row in 10 of 10 runs; highlighted row 11 in 10 of 10; popup 9 in 10 of 10.
- Delete D1–D10, glyph rule 0 (no letter changes on still frames), dust 0, rows 56.00px, tap delay ~2ms, hand-off 0/5,184, Impeccable baseline 3.

**Why it isn't a 10:** the feel of the bleed in daylight on an OLED, and WebKit's rendering of the scaled static mask, can only be proven on the owner's iPhone.

## Ruling on P6-N1 (a mid-drag long frame from the core-strength class step)

**MUST-FIX before integration. It is cheap and removes the only mid-drag hitch source `main` doesn't have.**
- **What it is:** the `vs-s2`/`vs-s3` class change repaints the core mid-drag. It hit a 50ms frame in 1 of 6 runs at 4× throttle, about 12ms unthrottled.
- **Why fix it now:** on a 120Hz iPhone (8.3ms budget) that is one or two dropped frames at the moment the ink darkens, which is the exact moment the eye is on.
- **Fix:** pre-render the three core strengths as stacked copies, and step between them with an **opacity crossfade** (compositor-only), or use one continuous opacity on the densest copy.
- **Measure:** under the same 200-row, 4× throttle harness, 0 mid-drag frames above 33.5ms in ≥6 runs. The lock, press and release frames stay as they are, since `main` has the same hits there.
- The ink pixel values at each held travel must be unchanged (±1 contrast step), re-checked with `p6-held`.

## Integration conditions

1. **Apply `p6-proposed.diff` plus the P6-N1 fix.** Verify with `git apply` then `cmp` against the rebuilt proto. Re-run on the integrated `index.html`:
   - star gate "84 + 8 (+ N8-a)" and curve8;
   - vtest 93/93, with a new case for P6-N1 (no class-driven repaint mid-drag);
   - popup-open 20/20, dust 0, D1–D10, the glyph rule, rows 56.00px, tap delay, hand-off;
   - the throttled perf run;
   - Impeccable baseline 3.
2. **`CLAUDE.md`: replace the "Swipe LEFT to mark visited" Priority item with a Shipped entry.** Keep the history short: concept "carry and press" 9/10; the owner then redirected in three steps (no slide, then stamp with grow-shrink, then no drawing, "ink bleeding in"). Record:
   - **Pre-commit bleed:**
     - a dense centre blot first, with the core held inside it until 18px (`WAIT` 0.24);
     - then a crisp core in the stamp's own navy at lower density (L 0.70/0.665/0.632, C 0.035, h 247), revealed by a **scale-driven static mask** (aspect 1.4, `S1` 1.55), with a **constant-blur halo** leading it (lead 0.16) and a **static fibre mask** (an SVG data-URI image, displacement 7);
     - no per-frame filter or gradient work, and no class-driven repaint mid-drag (the P6-N1 rule);
     - the ring is never closed before the press (reveal half-width < ring end);
     - pre-commit contrast ≤ about 3:1 (normal) and ≤2.4:1 (highlighted, paper mix 34/42/50%);
     - a release before 56 dries away.
   - **Press:**
     - one frame for everything: crisp full ink, field, final truncation, haptic;
     - then `VISIT_POP`: the star's `STAR_POP` table and 380ms, peak **1.2×** (the clearance ceiling: 4.8px at 1.2×, 3.0px at 1.25×, touching at 1.4×), twist ×0.6 (−12° → +4° → −1.5° → 0°), resting exactly at `stampTilt()`.
   - **Un-visit:** `STAR_ERASE_POP` (1.12×, no twist) at the lock, then pale only (starting at the resting ink, L never drops, C ≥0.033, hue held) to a ghost, gone at 56 with the erase double tick.
   - **Delete safety:** `DELETE_TAP_SLOP` 4px (dial 3–6). The X fades at the lock and returns only after the pop lands (`VISIT_POP_MS` + 20).
   - **Rules inherited from the star:** glyph changes only on press or lift frames or under a sweep; EDGE 24; reduced motion (the bleed is finger-driven and stays; no pop or lift; haptics still fire); starred + visited rows; popup Mark Visited in sync.
   - **Dials:**
     - normal-row ink C 0.035–0.045;
     - highlighted mix ≤ ~3:1;
     - `WAIT`;
     - reveal aspect 1.3–1.5;
     - `S1` ≤1.75;
     - halo lead;
     - fibre displacement;
     - pop peak 1.15–1.2×;
     - twist ×0.5–0.8;
     - ghost;
     - `DELETE_TAP_SLOP` 3–6.
   - **Test gate:** "84 + 8 (+ N8-a)" plus vtest (93 + the P6-N1 case) plus the throttled mid-drag perf check.
   - Design record: the p3–p6 decision frames (`p6-vs-p5-compare.png`, `p4-bleed-compare.png`) under `design/`.
3. **`CLAUDE.md` iPhone checks: a new "Swipe-left visit" block**, replacing any p2 carry checks:
   1. **(Gate)** A left stroke from the X or the row's right half visits. A 4–12px nudge on the X never raises delete; a still tap does.
   2. The pre-commit reads as **ink bleeding into the paper**: a drop at the centre that soaks outward in the stamp's own navy, thinner. Not fog, not a focus pull, not a brighter blue.
   3. At about 54px it still looks unfinished (the ends are soaking), and the press snaps it crisp with the grow-shrink, settling at the stamp's tilt.
   4. Let go early: it dries away with no stain.
   5. On the focus (highlighted) row the bleed is visibly weaker than the pressed stamp.
   6. No hitch as the ink deepens mid-drag, on a long list.
   7. Un-visit lifts with the star's erase pop, pales, and never darkens or goes grey.
   8. The scaled mask and fibre edge render without shimmer.
   9. **Haptics:** swipes are silent on iOS 26.5+ (your iOS 27; the platform limit). On Android or iOS ≤26.4 there's a tick on the press and a double tick on the lift.
4. **Commits:** code and docs in separate commits, with the gate stated. No DB change.
