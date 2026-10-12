# Scores

## Concept round 1 -- claim-check stub (director, 2026-10-12)

**Score: 8 / 10. Not READY yet: one short fix round, then re-score.**

Looked at: `concepts/stub/` owner stills 1-5 (`1-rest-today-vs-stub`,
`2-adding-664`, `2-tap-strip`, `3-tag-open`, `4-states`,
`5-320-copenhagen`), `overview-sheet.png`, `perf-1x-paper.png`, the appendix
(`filters_after` = the form at 390x844, `safe_*`, `signedout_*`, `play_tap`,
`desktop_*`, `measure.json`), `how-it-works.md`, `looks-and-feels.md`,
`jobs.md`.

### What earns the 8

- It answers both halves of the owner's sentence by structure, not by
  decoration. *Prominent*: the one filled field in a band of outline icons,
  and no longer the account badge's twin (still 1 makes the difference
  obvious at a glance). *Reachable*: it's in the thumb band in every state,
  including collapsed, with a tag open, Plans, and desktop.
- It fits the brand without adding anything. It uses the tag stub's
  perforation, ADD LOCATION's orange, and the header's own ON state. The
  four-state table is one system with the filters tile (`4-states`).
- The tag still wins on hierarchy (`3-tag-open`). The 320 drop order reads
  as intended (`5-320`). The 1x perforation on `--paper` is just legible.
- It fixes two real bugs on the way: Add hidden in Safari, and the form
  opening behind filters.

### Likely owner objections (strongest first)

1. **"What's that empty gap?"** At 390x844 (`appendix/filters_after`) the
   form sits at the top, then about 290px of blank map, then the band with
   the ×. ADD LOCATION is at y 450-494, mid-screen, and the × is 290px
   below it. It looks unfinished, and it undercuts "reachable": Add isn't in
   the thumb band at full height. The owner's phone may well be at 844
   (Home Screen), so he'll likely see it. **Likely.**
2. **"What's that grey?"** In `2-tap-strip`, mid-ride, the stub is a
   muddy dark grey, from crossfading orange into navy. That frame is in the
   still that goes with his decision question, and it reads as a glitch.
   **Likely.**
3. "The button moves." He's being asked this directly (Q1), honestly
   framed, so it isn't marked down here. It is the decision most likely to
   send the concept back.
4. "It's just an orange rectangle / average." The claim-check reading rests
   on one perforation. I'd defend it under "simple simple simple", and I'm
   not asking for marks. **Possible, not likely.**

(1) and (2) are likely, so the score is under 9.

### Fixes (numbered)

1. **Anchor the form to the band.** While the form is open, its bottom
   edge sits on the band (ADD LOCATION just above the ×), and the form
   grows upward from there. The map shows above it in whatever height is
   left. At 664 it looks the same as now (the form fills the space). At 844
   the 290px gap moves above the form, as map, and Add comes down to around
   y 700-740. That fixes the gap and puts Add in the thumb band, which is
   job 3 as the owner would read it. This is the form's *position*, not its
   fields, so it's inside my turn-6 scope ("how the form shares the
   screen"). Re-render still 2 at 664 **and add a 390x844 version** of it,
   so the owner sees both phone heights. Check that the account badge
   doesn't collide with the form's top at 664. Systems: update
   how-it-works sizes table + `jobs.md` step 2 wording if it changes.
2. **No muddy mid-state.** The field must never show a blend of orange and
   navy. Options, visual's call: the field switches cleanly at a single
   point (e.g. on the press, as the deep-orange press already does, then
   navy when the ride starts), or the navy wipes/fills rather than
   fades. The + to × rotation can stay at 0.3s. Re-shoot the strip's middle
   frame.
3. **Send stills, not the sheet.** `overview-sheet.png` at 2500 wide with
   four phones per row isn't phone-readable (the list text is a few px).
   Orchestrator: send owner stills 1, 2 (+ the 844 version), 3, 4 and 5 as
   separate images, and the sheet only as an index if at all.

### Steering on the designers' open items

- **Opening filters/sort while the form is open: yes, it closes the form**
  ("one ON tile in the band"), *provided the draft survives*. If the owner
  has typed a search or notes, tapping filters must not throw it away. The
  next tap on + reopens the form with the draft. If today's close
  discards the draft, then filters/sort stay disabled while the form is
  open, and nothing closes on its own. Builder verifies which applies;
  either way the band never shows two ON tiles.
- **Escape closes the form**: approved, as a desktop nicety. Not owner-facing.
- **Empty map below the form at 844** (systems' flag): resolved by fix 1.
- **The perforation on `--paper`**: approved (`perf-1x-paper.png`, just
  legible at 1x, nothing added).
- **Rotation at 0.3s on the collapse timing**: fine, once fix 2 lands.

### Did the work change since my last look?
First score; n/a.
