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

## After the director's score of 8 (scores.md)
Fix 1 is rendered by visual: the form is anchored to the band (Add y 716-760
at 844, y 536-580 at 664, directly above the ×) and the OSM credit rides to
the form's top. Fix 2: a clean field switch, only the rotation animates.
Spec sizes, states/motion, coverage and jobs.md step 2 are updated.
Rulings recorded:
- Filters/sort while the form is open close it. The draft survives
  (verified: the toggle only hides the form; closeAddForm() clears it and
  runs after a successful Add), so the "disabled" fallback isn't needed.
- Escape approved as a desktop nicety.

---

## Concept round 2 (2026-10-12): B striker strip + C pencilled pin (new systems designer, jam turn 8)

The owner said "i want more than one concept". The director's turn 7 asked for
B (striker strip) and C (pencilled pin), with D (eyelet) as visual's one
frame. The stub stays in the set. Q1-Q3 go out with the next concept set; the
owner won't answer them until he approves a concept.

Built:
- `concepts/lib-render.js`: a shared harness. It serves a copy of the page with
  the Supabase stub; `inset` emulates the Home Screen (34/47px), and it
  includes `rowsVisible()` and `hit()`.
- `concepts/B-striker/`: `concept.inc.html` (CSS+JS injected into the copy
  `index.html`), `render.js`, `frames/`, `measure.json`, `how-it-works.md`.
- `concepts/C-pin/`: the same layout.
- Both are wired to the app's own add code. Nominatim is blocked, so search
  results are stand-ins put into the app's own dropdown via `selectAddress()`.
  The keyboard is a faked `visualViewport` plus a drawn 336pt block. The
  Safari tab is `--chrome-bottom:100px` plus a drawn toolbar at 390x764.

B findings:
- Alive. All 6 jobs pass.
- The strip is fixed in every state. It reads "PICK A PLACE FIRST" (inactive)
  until a place is picked, then "ADD <NAME>".
- × at the left end keeps the draft. The list never moves.
- The `visualViewport` keyboard ride works in emulation; that needs an iPhone
  check.
- Cost:
  - With the list up at 664, the map goes 364 → 308 (prototyped as B2), or
    the list drops 4 → 3 rows (B1).
  - Collapsed from the Home Screen, the bottom chrome goes 94 → 150.
  - In a tab, three bars stack (band, strip, Safari's toolbar).

C findings:
- Alive. Best flow:
  - 3 taps with autofocus
  - 4 search results above the keyboard at 664
  - Add at y 515-559 at 664
  - the add ends on the place's real tag
- The list must switch to the new place's city after Add.
- FAIL with a tag open at 664: the pin covers the VISITED segment. Fixes:
  (a) a gap of 96 (costs a row), (b) hide the pin under a tag, (c) move it
  left.
- FAIL with filters open at 664: there's no map, so the rule would be
  "close filters to add".
- Cancel drops the draft and must restore the map view.

Decisions so far (mine, the director can overrule):
- B2 rather than B1 for the prototype, because it keeps 4 rows; the numbers
  for both are in the spec.
- C's search line takes the band's slot, and its results grow upward.
- C's blank tag hangs low (foot 16px above the band) so Add is in the thumb
  zone, and its Add is sticky.

Open questions:
- Director: C's tag-open fix (a/b/c); "close filters to add" for C at 664;
  whether C keeps the draft on cancel.
- Director/visual: can B's collapsed band and strip merge without breaking
  "never changes"?
- Is autofocus on open part of every concept? If yes, the tap counts tie at
  3.
- Switching city after Add: applies to all concepts. It's arguably a bug
  today, so raise it with the orchestrator.
- iPhone checks to queue if B or C is chosen: `visualViewport` riding (lag,
  focus scroll), autofocus after `requireAuth()`.

Next: visual draws B and C at owner fidelity plus the eyelet frame; then the
director steers and scores. My next pass: answer the director's rulings,
update `jobs.md` with the per-concept flows once concepts reach 9, and run the
coverage check before the owner sees anything.

## After director turn 10 (rulings + scores)
- Killed: D. Scores: stub 9, B 9 (READY after fix 6), C 8 (one visual fix round).
- Applied to C's how-it-works:
  - the blank pin steps aside whenever a tag is open (every height);
  - close filters to add (every height);
  - iOS 16px: transparent native selects over printed entries, Notes/search at 16px, no viewport hack;
  - cancel keeps the draft in memory, with no marker left;
  - the new row scrolls fully into view after Add.
- Coverage: jobs 1 and 5 now "yes, with the ruled exceptions"; job 4 is yes.
- Applied to B's how-it-works: fix 6. The form's top stops below the account badge with the keyboard up or on short screens, scrolls inside itself, and the credit sits clear of the badge.
- My prototypes still clear C's draft on cancel and show the old pin-under-tag; the visual designer's stills carry the rulings. I didn't re-render.
- Autofocus and the city switch after Add are noted for whichever concept builds (the backlog has the bug).
- Next: re-check coverage when C's re-score lands; then the owner set goes out (stub, B, C if 9) with Q1-Q3.

---

## Round 5 (2026-10-13): new systems designer, baseline E "Float" (jam turn 14)

The owner turned down the A/B/C set (rejection 1 of a set). Director turn 13:
show the baseline, which is today's badge floated at a bottom corner riding
the sheet edge; push A and C; B ruled out. I went first, on the baseline's
structure.

Built: `concepts/E-float/`
- `concept.inc.html`: positioning, ride form, credit, tag gap and filters
  modes, all via `<html>` data-attributes.
- `render.js`: copies `index.html`, drops `#floatingAddBtn` from
  `pinPopupTopPad`, and makes `TAG_SHEET_GAP` a `let`.
- `frames/<variant>/`, `measure.json`, `sum.js` (summary), `probe.js`
  (today's axes).
- `how-it-works.md`.

Decisions (mine; the director can overrule):
- Pick: right corner, gutter (box 16), box gap 16 / ink 19.9
  (`r-gutter-20`). Second: the same at the left (`l-gutter-20`).
- Form: ride (the list drops, × on the band, Add on the ×'s line, sticky at
  320). Stay fails.
- Filters: under (close filters to add). Riding the panel fails.
- `TAG_SHEET_GAP` 78 while floated.
- Right corner: credit to bottom-left.
- Account badge to `right: var(--s4)`.

Key numbers: see `how-it-works.md` tables. Today's axes are:
- left ring ink 19.0, axis 30;
- locate ink right 367.2, × axis 360;
- the account badge's ink right 370.1;
- the scallop's ink inset 3.9.

Open:
- director: ride vs stay; the filters exception;
- visual: the ink-gap dial, two oranges side by side with the form open;
- owner: Erica's hand;
- iPhone: riding in step with the sheet, the back swipe on the left, the 320
  credit.

Next: the structural sanity check on visual's pushed C (it sits in the same
slot, so the tag gap, filters and credit apply), then the coverage check of
the round-5 set before the owner sees it.
