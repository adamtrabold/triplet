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

## Turn 16 (2026-10-13): structural check of round-5 A and C
- Visual's turn 15 kept my Float pick (r-gutter-20) and pushed A ("ticket")
  and C ("ring", 60x84 at the Float's corner).
- `concepts/r5-check/` has `check.js` (C footprint, A title), `tap.js`
  (flows), measure files and frames.
- C: sound. It hides under tag and filters, so `TAG_SHEET_GAP` stays 48. At
  320 the credit touches the tag's foot (3.2px); the "Leaflet |" prefix drop
  fixes it. Flows verified on the new pin.
- A: the title is 32px shorter at every width (84/139/154 vs 116/171/186).
  At 320 the count drops and COPENHA… still ellipsizes. Plans names aren't
  measured (no plans in the stub).
- Coverage: no unsupported job in any concept. Job-1 exceptions: Float
  (filters), C (filters and tag), A none.
- Next: the director scores. Then the final coverage check on whatever goes
  to the owner.

---

## Round 6 (2026-10-13): new systems designer, jam turn 22: footprints

I took over from these notes. Context change: the playground landed on main.
Signed out = the playground (no `?play` URL; it's the mode when there's no
stored supabase session). The account badge is always shown there, with the
menu reading "Sign in". `requireAuth()` only asks when a stored session is
stale.

Built: `concepts/r6-check/`
- `check.js`: Float and C copies of **today's main**, built in memory, with
  the round-6 includes.
  - Modes: signed in (the stub's token); `play` (the token removed via
    `js`); `stale` (`?signin`).
  - Patches only in the check:
    - `data-taggap="<n>|box"` pins `TAG_SHEET_GAP`;
    - `data-fix="rect"` makes the ride form's Add maths read the rendered
      box.
  - The scratch `.F.html`/`.C.html` files are deleted after the run.
- `tag-rows.js`: rows with a tag open, gap 48/78/88 at
  320/375/664/844.
- `a-check.js`: A's admission vs tag cut (box, title, hit area at the cut
  corner and the eyelet, playground and stale taps).
- Outputs: `measure.json`, `measure-tagrows.json`, `measure-A.json` and
  `frames/` (3x; desktop 1x).

Findings:
- **Float, 60px:**
  - Box 314.8,468.8 – 374.8,528.8. Ink 19.9/19.9 kept, the 370.1 line
    kept.
  - **`TAG_SHEET_GAP` 78 → 88** (6.8 → 16.8px clear at 664). It keeps 3
    rows at 664 and 375. **At 320 it's 1 row vs today's 2**; 78 cost the
    same.
  - **The prefix drop is required** (an overlap of 6.3 at 320 with the
    prefix).
  - The ride form's Add maths must be scale-aware (else 2.8px from the ×,
    4.2 low).
  - Draw it at 60, not `scale()`.
- **C, 72x94:**
  - Box 302,430 – 374,524. Nothing structural changes; the step-aside
    under a tag is load-bearing (the slot sits on VISITED at 664).
  - Dead zone +34%. The bare box corners tap + (builder: parts-only hit).
  - The tag's right edge is 3.9 off the account's ink line.
  - Selection follows the open tag and C hides under tags, so there's
    never a real selected pin and C's selected pin together.
- **A's tag cut:** same box, title and flows. Its structural cost is that
  it makes A a tag (C's object) while opening a form panel; plus "tag" in
  the sort/filter row reads as a tags filter. Admission keeps A distinct.
- **D:** structurally the Float (gap would be 76). It loses A's
  no-exception job 1. I agree with the kill.
- **Job 6** was rewritten in `jobs.md` against the playground. It's
  verified on Float, A and C.
- Each concept's `how-it-works.md` has a "Round 6" section. D got a short
  `how-it-works.md`.

Decisions (mine; the director can overrule):
- 88 rather than 78 (12px clearance kept as the rule; derive it from the
  box).
- Prefix drop at every width.
- Admission over tag cut on structural grounds; the look is visual's.

Open:
- Director: 88 and its 320 cost (1 row with a tag open); tag cut vs
  admission; D's kill; scores.
- Visual: C's right edge vs the account ink line; whether the Float's
  shared ink line still reads "placed" at 60 vs 50.
- iPhone, if the Float builds: a 60px masked stamp edge renders crisp; it
  rides in step with the sheet.

Next: the director scores Float, A and C. Then the final coverage check on
whatever goes to the owner. All three currently have no unsupported job.

## Round 6b (coordinator request): C re-measured at 84x104
The visual pick is hio/xl/edge/ink:
- box 286.1,420 – 370.1,524;
- the right edge on the account ink line (370.1; note 3 resolved);
- the foot 20 above the list.

All clean: 664, 375, collapsed inset, desktop, 0 pins, playground adds,
stale session asks.

Still required or still holding:
- 320: the credit is 30px clear without the prefix; the prefix drop stays
  required.
- The step-aside under a tag is still load-bearing (it would need a gap of
  136 to show); `TAG_SHEET_GAP` stays 48.

Costs:
- the dead zone is 4.1% of the map (+29%);
- the bare strips beside the disc (26x38 each) tap +;
- the orange disc vs the deep-orange clusters at city zoom (visual's call).

`check.js` now takes `CKEY`/`CATTR` and has a corner-hit probe. The
section is in C's how-it-works.

---

## Round 7 (2026-10-14), jam turn 26: Float at the left at 60, A's tag cut
The owner liked the orange 60px Float and wants it on the left. A becomes
the Hanging Tag cut. C is parked.

Built `concepts/r7-check/`:
- `float-left.js`: derived from `r6-check/check.js`.
  - Corner l, transform-origin at the lower-left ink.
  - R17's style is now separate from the prefix-drop script (`noprefix`).
  - `data-formline="beside|above"` patches the ride form.
  - Extra measures: inkFromLeft, centreX, zoom box, form box, map strip,
    Add vs × gaps.
- `a-tag.js`: the tag cut vs admission. Title, chamfer and eyelet hits,
  locate icon gap, at 320/375/390.

Findings:
- Box 15.2,468.8 – 75.2,528.8.
- Ink 19.9 from the side and the list, 0.9 off the rings' ink. Align ink,
  not glyph.
- Credit bottom-right: the prefix fits at 375 and wider, overlaps 6.3 at
  320. Rule: drop it below about 338.
- 88 is confirmed (664: 16.8 clear, 3 rows; 320: 13.8, 1 row).
- Zoom: 7.9 off the ink line, far above.
- Form A (beside, 87.2–374, off the spine) vs B (above, 56–374 on the
  spine, +64px up, the map strip gone at 664). C and D rejected.
- Desktop: 375.2,724.8.
- Cancel, filters, playground, stale and collapsed states verified.
- Back-swipe: an iPhone check (Safari tab).
- A tag cut: same box and title cost. Chamfers open space next to locate.
  The eyelet is about 19.5px from locate's round icon (the dot / "fourth
  icon" risk).

Decisions (mine): ink-edge alignment; the conditional prefix rule.
Open:
- Director: form line A vs B; the prefix rule.
- Visual: the zoom "+" vs the badge "+" at 1x; the open × vs the ▲ axis;
  the eyelet.

Next: the director rules. Then visual shoots the stills. Then the coverage
check on what goes to the owner.

---

## Pass A (2026-10-14), jam turn 30: new systems designer; blank pin + blank-tag form
Owner revived C as ONE package with the add form redesigned as a blank tag
you fill out; keep Float and A open (round 7 is with him, unanswered).

Done: jam turn 30 (under "Pass A" heading). No jobs.md change yet, no stills.
- New jobs J7-J16 (+ J17 visited-while-adding, J18 edit-after-add as scope
  questions). Jobs 1-6 stand for the + itself.
- Facts: today's form order (City, Category, Search, Address, Notes, Star,
  Add) disagrees with the tag's (name, address, TYPE, notes, stub); the
  blank tag follows the tag's. No edit-after-add exists in the code (only
  star/visited toggles). C's R6 flow has no tag during search — the gap vs.
  "filling out a blank tag".
- Structures: P1 hang-then-write (tag docks, name line = search, results
  on the tag); P2 ring it where it stands (drag pin / long-press map,
  reverse lookup names; gesture lane); P3 no Add button (pick creates,
  pencilled real tag + Undo; inversion; owner-scope); P4 visible kept
  draft on the resting tag (add-on).
- Pairing: the form is trigger-agnostic; propose "one blank-tag form,
  three triggers" (C, A, Float). A + blank tag may be the best pairing
  (A keeps the no-exception job 1).
- Randomness: bird-ringing, ski lift ticket; Oblique "Look at the order in
  which you do things"; twist "nothing is typed".

Open (director): P1 vs C's band search; P2 in or later; P3 frame or
question; J17/J18 shown in a still or asked; whether C's resting tag
still fights "reads like a plus button".
Next: visual designer's turn; then director steer; then measure P1's
result count at 664 with keyboard, and the docked-tag heights.

## Jam turn 33 (2026-10-14): survivors measured (pass-a-check/)
- Real 202 pin positions from Supabase (MCP, names dropped) in `real-pins.txt`, injected over the stub.
- V2 squint mass vs account: 32 = 0.6x, parity about 42, 48 = 1.35x, 52 = 1.6x (my floor). Peak contrast never beats navy. Sizes that win the squint read as a FAB, so shape must carry "pin". 0 pins under at 52, credit clear.
- V3: full width is out (pins at 664 and 320; always on the credit). W ≤ 120 only. The credit must move at any width (2.9px at 390, hits at 375 with the prefix, at 320 without it).
- V2/V3 both keep C's job-1 exceptions (tag open at ≤ 664: gap 84 / 116 or step aside; filters: close to add). Only A is exception-free.
- Docked at 664 + keyboard 336: the account foot binds the tag top at 74; pin y 14-46; name 122-150; slip 158-320 = 162px. Today's rows are 56-57 → 2.9. Floor 3 needs the stub behind the keyboard AND (rows ≤ 52 OR name pad 36). 320: 142px → needs ≤ 47 rows. 844 HS: 5 rows.
- Unsettled list (turn 33 §4): fresh blank vs step-aside; job-1 exceptions; what a shape inks into; TYPE pre-fill source; CITY folded into address; autofocus; VISITED in the insert; desktop; cancel with a pick.
- Next: after visual turn 34 / director 35, write jobs.md (package jobs J7-J16 + flows), then the coverage per concept.

## Concepts start (2026-10-14), after director turn 35
- **The lifted-pin squint, re-run on a real render** (`pass-a-check/lifted.js` + `lifted-squint.py`; real 202 pins, Reykjavík, 390x844 @1x; the same on 320x568). Mass vs the account at σ4 / σ8:
  - disc 44: 1.18 / 1.15;
  - **disc 48 (the pick): 1.40 / 1.37**;
  - disc 52: 1.64 / 1.61;
  - stock FAB 56: 1.92 / 1.91.
  - This confirms the director's estimate of 1.39 / 1.35.
  - The lifted box at 844 is 17.9,450 – 69.9,528. Real pins: 0 under / 0 near. At 320 it touches the credit by 0.9px, so the prefix drop is needed (the Float's rule).
- **The 320 rows:** with the name 36 below the top and a 260 keyboard there's 154px, so 48px rows give 3.2. 46px rows aren't needed.
- **`jobs.md` rewritten:**
  - the + jobs are 1-5, the blank-tag jobs 6-16;
  - scope questions: visited while adding, edit after adding;
  - the old file is in `notes/jobs-pre-pass-a.md`;
  - the flows: P, A, Float frame, exceptions, cancel, re-search, shapes, new city, errors, signed out, Plans, desktop, sizes.
- **Concept folders:**
  - `concepts/blank-tag-form/how-it-works.md`: shared structure, the states table, pre-fill, the docked numbers, cancel and draft, after ADD, builder notes;
  - `concepts/P-blank-pin/how-it-works.md`;
  - `concepts/A-header-tag/how-it-works.md`, with the Float frame at the end.
- **Decisions of mine** (the director can overrule):
  - P's hit area is the disc plus a 44 column (no bare corners);
  - P hides under a tag at every height (the same everywhere);
  - A with a tag open closes it, and cancel restores it;
  - the not-ready ADD wording while a question is open ("ANSWER ABOVE") is a placeholder for visual;
  - the TYPE fallback is Other.
- **Open:**
  - A on the band's left end (the owner's reach note);
  - desktop not measured;
  - the iPhone checks: focus in the gesture, `visualViewport` docking, the TYPE mapping (Nominatim).
- **Next:** visual builds P and A stills on these specs, then I run the coverage check per concept on the stills/prototype.

## Round 8 fold-in (2026-10-14), after director turn 36 + visual's changes
- Followed: the fixed 316 blank tag (stub 330-390 docked at 664, behind the keyboard; visible at 844 Home Screen, 377-437); results overlay the lower lines; the hanging tag 316 / ADD 518-578 at 664 (320: tag top about 176, worst case about 122, fits with no scroll; pin clear of the account); the Float pan target 512 (ADD about 452-512); NOTES before TYPE; VISITED not re-stamped at ADD; P's needle is 2px.
- Changed, said plainly in the form spec's top note:
  - results start under the NAME rule (72), not 89: at 320, 89 gives 2.85 rows (< 3); 72 gives 3.2, and 3.6 at 664;
  - the tag does NOT shrink on ADD while it's open (the stub, i.e. the ADD just tapped, would move up 60-100px, against "I don't want … the button to change physical location after click"). The rules fade; the height holds until close. Director's call if visual disagrees.
- `jobs.md`: the blank-tag order (NOTES before TYPE), the fixed whole blank tag, the ink-over wording, 844 sizes (about 4 results plus the visible stub).
- Re-check: all jobs hold on P and A (P keeps its 2 job-1 exceptions). A: the band's × (about 604-661) is 26px below ADD (578).

## Round 8b fold-in (2026-10-14)
- Followed (checked):
  - the picked tag is 248 (48 + 4x32 + 12 + 60);
  - ADD/DIRECTIONS fixed at 528-588 at 664: the tag's top comes down while the map pans by the same Δ, so the foot = pinY + TAG_HANG + h is constant. The tag is at 340-588, the pin at 280-312, and the foot 16 above the band;
  - the list stays at its band until the tag closes;
  - results at 89 or 72, the NAME caption docking, the lines under the results hidden.
- Changed: the 89/72 switch goes by room (3 rows = 152px below the start), not `innerHeight < 600`. It's the same on every measured screen. The 375x629 mini tab is under 3 either way (2.5 / 2.9): an iPhone check, keyboard height unverified.
- Found:
  - `.bt-f` has a fixed `height: 32px`, so long names and notes overflow. Use `min-height`.
  - The rule clash for the director: "controls don't move" vs "an open tag adjusts the list, it doesn't close it" (the list held at the band).
  - After close, the row is in view but not selected (selection follows the tag). jobs.md 13 was reworded.
- The iPhone check: `panBy` in sync with the 300ms CSS shrink (no stub jitter); the director's fallback exists.
- A: the band's × is now 16px under ADD (588 vs 604). Still distinct.
- All jobs hold on P and A, except the long-name/notes overflow (a builder/visual fix).
