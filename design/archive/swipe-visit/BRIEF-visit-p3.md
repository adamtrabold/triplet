# Visit p3 — owner feedback after trying it live (main aa0445e), 2026-09-28
Verbatim: "I don't think it should slide it should stamp with some grow shrink that feels good…maybe the same as the star"

Owner direction (perfection stage, tweak to shipped design — no concept stage):
- The stamp must NOT be carried/slide in under the thumb. It STAMPS in its own slot.
- The landing is a grow→shrink pop that feels good — starting point: the star's spin-stamp landing
  (`STAR_POP` / `STAR_POP_MS` 380: −20° → +6° at 1.4× peak → −2° at 0.95 → 0°/1, linear effect easing
  with per-keyframe easings). "Maybe the same as the star" = strong preference for consistency; deviate only
  with a measured reason (e.g. rotation must settle to the place's `stampTilt()`, not 0°; the 72×32 stamp
  at 1.4× may crowd the name/X — measure clearance; a wide oval may need a smaller twist).
- Decide what the finger's travel shows before the 56px commit now that nothing is carried (mirror of the
  star: the row content moves with the finger? a ghost/pressure cue in the slot?). It must still read as
  honest progress toward a commit, and letting go before 56 must never look done.
- Un-visit: same stroke; decide the mirror (e.g. the star's erase pop inverse) — keep it consistent with
  the star's erase pop (1.12× lift, no twist).
- Keep: delete safety (DELETE_TAP_SLOP 4, D1–D10), X fade, glyph changes only on the press frame or while
  moving (0 still-frame changes), visited field on the press frame, haptics, reduced motion (no scale/rotate,
  haptics still fire), popup Mark Visited in sync, starred+visited rows, EDGE 24, rows 56px.
- Gates: star "84 + 8 (+ N8-a)", vtest (update cases that assumed a carry), curve-style frame counts for the
  stamp pop (≥6 frames at ≥1.3× if it uses the star's peak), Impeccable baseline 3.

## Owner direction on the pre-commit cue (2026-09-28, after p3 CD 8/10)
Verbatim: "It shouldn't draw its a stamp it should fade or something have them figure it out"
- NO drawing/tracing of any kind before the commit (kills the dotted arc AND UX's solid-ring trace, variant B).
- The stamp should FADE in (or similar non-drawn cue) as the finger travels — team decides the exact treatment.
- Still: no slide, honest (release <56 retracts, never looks done), the press at 56 stays the moment of ink.
Owner, follow-up (same day): "It should look like ink bleeding in or something"
- The pre-commit cue = INK BLEEDING INTO THE PAPER: soft, wicking, feathered ink spreading/soaking in as the finger
  travels — not a clean opacity ramp, not drawn/traced.
- At 56 the press snaps it to the crisp, full-ink stamp + the existing pop (the contrast soft→crisp is the payoff).
- Honesty: before 56 it must stay visibly soft/unfinished; a release <56 retracts (the bleed recedes/dries away).
