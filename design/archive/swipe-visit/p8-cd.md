SCORE 9/10

# Visit p8 (revised): CD review, perfection stage

> **Historical record (note added 2026-09-29).** Instructions below to update `CLAUDE.md` were carried out at the time; those entries now live in `docs/shipped.md` (feature history/spec), `docs/iphone-checks.md` and `docs/backlog.md`. Don't re-apply them — later rounds may have superseded them.

## Verdict: approved for integration

Every owner ask is met, checked in the stills and the real-timing films.

- **Smaller visited pop (1.10×).** It holds its peak for 10 frames, the longest of the options, so it still reads as a thunk. 1.08 reads as a wobble; 1.20 was the shipped size.
- **Popup Mark Visited replays the stamp on the row, every time.** Same machinery as the swipe, once per tap, last one wins, held through refetches.
- **Popup layout** (`p8-popup-before-after.png`):
  - Get Directions is the shipped text button again, alone on its own line under the note. "GET DIRECTIONS" starts at x 24.00, the same x as the category word below it.
  - The bottom row has the category on the left and Mark Visited on the right, with the circle trailing. It reads as label then control.
  - Tab order now matches the visual order.
- **Popup star:** 18px, centred across two lines. Alignment is the next loop, as agreed.
- **Popup star fades and pops, with no pencil.** It is the row's 1.4× peak with 11 frames; the title is ≥4.68px clear.
- **Star replays from popup to row, both ways, every time** (`p8-star-replay-film.png`):
  - Star: the name steps aside, the five strokes pencil in, the ink lands with the spin-stamp, the name docks.
  - Unstar: the star lifts, is rubbed out, and the dust sweeps into the gutter, never onto letters (0 frames with dust over text, 64/64 correct end states).
  - The pencil is right on the row. A row star is always pencilled, and an ink-only star there would contradict the swipe.
- **Haptics wherever logical.** One `hapticTap()` covers the popup star, popup Mark Visited and the form STAR toggle.
  - Each gives 1 trusted tick, 0 document clicks, and no tick from a keyboard or VoiceOver.
  - The accessibility tree is identical to main's.
  - The skip list is correctly reasoned: navigation and chrome, delete behind `confirm()`, the async submit, and Directions leaving the app.
- **Autopan clears the top controls (R5, fixing UX S1).** The top padding is a getter over the real control edges, so the safe area comes for free.
  - The star target is blocked in 0 of 56 cases (main: up to 77%).
  - The title is under a control or the inset in 0 of 56 cases (main: 28 of 56).

**Gates:** 84 + 8 (+ N8-a, now on all 3 tap targets), vtest 113/113, popup-open 20/20, curve8 within jitter, and Impeccable baseline 3.

## Must-fix before integration

1. **Re-shoot `p8-popup-before-after.png` from the final build (md5 `591c7dca…`).** In the current long-name "after" frames, the zoom "−" and the "+" still sit over the popup. That is pre-R5 placement. The design record must show the shipped result: one long-name popup opened high on the map at 375px, with inset 0 and inset 59.
2. **Remove the stale claim.** Delete the "pre-existing harness artefact, same as main" line from section 3 of `p8-design.md`, since R5 disproved it, so it never reaches `CLAUDE.md`.

## Rulings on UX's nits

- **N1, 41px of air above Directions in the bare popup: defer to the next loop, by name.** It comes from the star target's 17px down-bias plus the 8px dead band, which is star-target geometry. The owner has already sent the star's alignment to the next loop. Put "bare popup: close the title → Directions gap to ≤ ~20px" in that loop's brief as a required item. Don't patch the target here and then redo it there.
- **N2, the commit pop (1.10) is now smaller than the un-visit lift (1.12): accept.**
  - The owner asked for the smaller pop.
  - 1.12 is the star's erase lift, and matching it across star and visit was an owner-approved consistency rule.
  - The two stay distinct in shape: the visit twists and dips, the lift only rises and pales (`p8-pop-compare.png`).
  - Keep it as an iPhone check. If the visit reads as the weaker of the two there, the dial is the visit peak (up to 1.12), not the lift.
- **N3, VoiceOver reads the category just before "Visited": accept as is.** The category and the button are separate swipe stops, so "Attraction", then "Mark Visited, toggle button" is accurate and matches the visual row. Adding separators would only add noise.
- **N4, touch focus now lands on `body`: accept.** It matches the star, and iOS doesn't focus on tap anyway.

## Integration notes (for the operator)

- Apply the diff to `0e5113f`, verify it with `cmp`, and re-run the scoped gates on the integrated file.
- `CLAUDE.md`:
  - Visit pop peak is 1.10×, with twist −10° → +3°.
  - Popup layout: Directions under the notes; category left and Mark Visited right, circle trailing.
  - Popup star: fade plus pop at 1.4×, no pencil.
  - Popup-to-row replays, both marks, both ways, every time. The teaching cap and `STAR_TEACH_KEY` are removed.
  - `hapticTap()`: its targets and the skip list with the reasons.
  - The `bindPinPopup()` autopan getter.
  - The N1 item goes into the next loop.
- iPhone checks: the designer's list, 0–11. Add the N2 check ("the visit pop doesn't feel weaker than the un-visit lift").
