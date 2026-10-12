# Systems designer notes -- + placement

## Where things stand (2026-10-12, after jam turn 1)
- Jam turn 1 written (`jam.md`): jobs, current-state facts, a table of seven
  structurally different homes for + (A sheet edge, B in the list header,
  C screen bottom-right, D map bottom-right, E blank first list line,
  F gesture-only, G stays top + form comes down), ten flows every concept
  must survive, interaction ideas, tensions, questions.
- Current-state stills + render script: `current/` (rest, addform, tag,
  collapsed; 1x). Re-run: `OUT=<dir> node current/render-current.js`.
- No jobs.md yet (comes after the jam). No concepts.

## Jobs (draft, from owner's words; inferred ones marked in jam.md)
1 thumb reach in every state; 2 reads as the main action; 3 finish the add
near the thumb (inferred); 4 don't lose my place (inferred); 5 never over
pins/tag/row names/row delete x (inferred); 6 signed-out + playground make
sense (inferred); 7 same place every time (inferred; tension with the
moving sheet).

## Key facts measured
- + at x324-374, y16-66; account badge identical twin at x266-316.
- List header y544-600 (list up), bottom ~y784-844 collapsed; sort/filter/
  locate 32px icons at x254-374.
- Row delete x at x~360 on every row -> stock bottom-right FAB over the
  list is a mis-delete hazard.
- Leaflet attribution bottom-right above the sheet; filters panel slides up
  over the sheet's top edge.
- After Add the form closes; map does not go to the new place.
- Code reading +'s position: pinPopupTopPad() ~4927, planChrome()/
  planSafeBox() ~6718; TAG_SHEET_GAP 48 would need to count a low +.

## My lean (not a decision)
A (attached to the sheet's top edge) or B (the one big thing in the list
header): + belongs to the only always-low band; breaking the + / account
twinship makes + primary by structure. Form rising from where + is, x in
place, results growing upward over the keyboard.

## Open questions
- Director: is the form's position in scope, or only the button?
- Director: gesture accelerators (hold + = add where I stand; long-press
  map) in scope or parked for the owner?
- Owner scope: land on the new place after Add? one-gesture "add here"?
- Orchestrator: sign-in crew drew their badge as "left of +"; if + leaves
  the corner, tell them early.
- "Controls don't move or grow" vs a + riding the sheet -- name it to the
  owner, don't pre-decide.
- Desktop rail placement; 320px header crowding; keyboard covering a low
  form.

## Randomness used
Fields drawn: surveyor's theodolite (-> hold to add where I'm standing),
seed packet (-> form torn open from the bottom). Oblique: "Only one
element of each kind" (-> break the twin badges). Twists drawn: "operable
without looking" (-> fixed, edge-anchored spot; argues for C/A), "+ not
visible until needed" (rejected: contradicts "more prominent").

## Next
Visual designer's turn (how a primary + looks once attached to the
sheet/header). Then director steering. My next pass: react, narrow the
structure options, start drafting jobs.md flows per state.

---

## Pass 2 (2026-10-12) -- stub stress test

Director leads with the claim-check stub (visual's sketch: 68px orange field
at the list header's right end, dashed perforation, navy +; open = navy
field, orange x). Tab killed, seal = baseline only, stamp killed. Form
redesign, gesture shortcuts and landing on the new place are out of scope
or owner questions. One band was a one-frame wildcard.

Script `concepts/stub-stress/stress.js`, stills alongside it.

Results:
- Close+Add claim: holds at 390x844. **Below ~790px tall (Safari tab 664,
  SE 667) the list sheet covers ADD LOCATION.** This is pre-existing
  (`today-form664-3x.png`). My fix: the list drops to its band while the
  form is open and returns on close/cancel. Not yet agreed.
- Check 1, safe area collapsed: PASS (stub 38px above the screen bottom
  with a 34px inset).
- Check 2, filters: stub PASS. Pre-existing blocker: with the panel open,
  the form opens behind it. Rule: opening the form closes the filters
  panel and the sort menu.
- Check 3, 320px: FAIL ("COP..."). At 390 "Copenhagen List (112)" gets 118
  of 174px. Dials: stub 56px, tighter icon spacing.
- Check 4, tag + navy row + stub: PASS. CD to judge two orange fields
  (starred band and stub).
- Check 5, signed out / playground: PASS.
- Check 6, desktop: PASS.
- State system: open stub = navy field = the system's ON tile, so it needs
  no exception. The ON glyph should be paper, not orange (visual's call).
- One band: dropped. Kept the learning: a chrome-free map is calmer; the
  band holds 3 utilities + the stub, not 4.

Open: does the list drop while the form is open (vs. the form scrolling)?
Tag open + tap + (tag stays selected and re-opens on cancel?). Owner
question added: "Add is hidden behind the list in Safari today; fix it
here?"

Next: visual designer answers width/320, open state, x colour, the list-drop
motion; then the director. After the jam: write jobs.md from turns 1-4 (the
flows draft is in jam turn 4).

---

## Concept phase (2026-10-12) -- after director turn 6

Jam closed with one concept: the claim-check stub. Rulings:
- The list drops to its band while the form is open. The stub (×) rides
  down. Recommended, but it's owner Q1.
- Always drop, even at 844.
- Title drop order: " list" → count → name ellipsizes.
- Paper ×.
- Tag-open cancel restores everything.
- Two oranges pass.
- The account-open seam goes to the sign-in crew / brand-token pass.

Written:
- `jobs.md`: 6 jobs (2 stated, 4 inferred), flows, and the owner questions
  in the director's wording.
- `concepts/stub/how-it-works.md`: structure, states, flows 1-9, sizes,
  edge/error states, builder notes, coverage table (all 6 jobs supported).
- `concepts/stub/appendix/`: 9 frames plus `measure.json` and
  `render-appendix.js`, i.e. safe_rest, safe_form, filters_before,
  filters_after, signedout_rest, signedout_tap, play_tap, desktop_rest,
  desktop_form, and a cancel check (`play_cancel`). All pass. The stub is
  wired to the real add flow with the drop + restore + one-ON-tile logic.

Findings in the appendix:
- With the drop, Add sits at y ~470 (the form's own position), not just
  above the band. At 844 there's a map strip between them. Fine; noted in
  sizes.
- Signed-out tap: no drop, no ON tile. Correct, since nothing opened.

Open:
- Owner Q1 (does the button ride down at all).
- Director: confirm "opening filters/sort while the form is open closes the
  form" (keeps one ON tile).
- Escape-closes-form is new behaviour; small, flagged in the spec.

Next: check the visual designer's owner stills against the flows in
jobs.md once they land (the director split it this way). Then the director
scores.
