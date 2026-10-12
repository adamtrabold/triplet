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

## Concept round 2 -- claim-check stub (director, 2026-10-12)

**Score: 9 / 10. READY: claim-check stub goes to the owner.**

Looked at: `2-adding-844-3x.png` (new), `2-adding-664-3x.png`,
`2-tap-strip-3x.png`, `looks-and-feels.md` (updated). Stills 1, 3, 4, 5 are
unchanged since round 1.

### Did the work change? Yes, both blocking fixes landed

1. **The form is anchored to the band.** At 844, ADD LOCATION is at y
   716-760, directly above the × at y 784. The gap is gone and Add is in the
   thumb band, so job 3 now holds at both phone heights. At 664 the form
   fills the space with Search, Add and × all visible. The account badge
   clears the form's top edge at 664 (~80px of map between them).
2. **No blend.** The strip's middle frame shows a clean navy × mid-ride,
   with no grey. It reads as one control changing state as it travels.

### Rulings

- **Unasked change: the OSM credit rides to the form's top edge.**
  Approved. It stays visible on the map, which is the only hard rule, and
  sitting on the form's edge reads as on purpose.
- **Flag: the map above the open form shows no pins at 844. Re-fit? No.**
  - Re-fitting moves the user's map on open, and then again on cancel to
    restore it. That's two camera jumps for a glance, and it fights job 4
    ("add without losing your place").
  - The strip above the form is context, not a working view. In the real
    app it shows map tiles; it's only blank paper in our renders because
    tiles don't load headless. So it reads as map, not as emptiness.
  - If the owner says yes to Q2, Add then flies to the new pin anyway.
    That's the moment the map should move, not on open.
  - Orchestrator: caption still 2b with one line: "Map tiles don't load in
    our renders; on your phone the strip above the form shows the map."

### Likely owner objections (remaining)

- "The button moves": Q1 asks it directly, with the strip as evidence. It
  is the one decision that could send the concept back. That's his call,
  not a flaw I'm hiding.
- "It's just an orange rectangle": possible. I'd defend it as is: it's
  simple, it's the tag's stub, and it's ADD LOCATION's orange. No marks
  added.
- Neither is likely enough, as a *design* objection, to hold the score
  under 9.

### Stills for the owner (send these, separately, in this order)

All are in `concepts/stub/`:

1. `1-rest-today-vs-stub-3x.png`: today vs the stub, at rest.
2. `2-tap-strip-3x.png`: tap + → the list slides down → adding (390x664,
   Safari). **Q1 goes with this one.**
3. `2-adding-844-3x.png`: adding at full height, with the one-line tiles
   caption.
4. `3-tag-open-3x.png`: a tag open, the selected row and the stub.
5. `4-states-3x.png`: rest / pressed / open / filters open.
6. `5-320-copenhagen-3x.png`: a small phone, a long city name.

Don't send: `overview-sheet.png` (not phone-readable), `2-adding-664-3x.png`
(already covered by the strip's last frame), or the appendix.
Questions: `jobs.md` 1-3 verbatim, plus its "Just so you know" line. Q1 is
the only one that decides the concept.
