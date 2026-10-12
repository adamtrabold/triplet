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
