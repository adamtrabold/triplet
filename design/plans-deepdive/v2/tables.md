# Plans v2: rules, traceability, tap counts, build notes (revision after CD 8/10, round 2)

Frames live in `frames/` and on the two contact sheets. `NN` means `frames/NN-*.png`. `NN+` means that frame plus its whole-panel strip. Sheet 1 **leads with the panel comparison** (15 vs 02/15a).

## 0. Title rule and header (checklist 2, amended)

| List | Title | Count | Header controls |
|---|---|---|---|
| Places | The app's own "<City> list (N)" | N = rows shown (asserted) | collapse, ⇅, filters, locate (unchanged) |
| Plans | Exactly the plan's name | None; progress lives on the rows | collapse, filters, locate. **No ⇅**: plan order is the only order. |
| Edit mode | Exactly the plan's name | None | collapse, filters (**Places filters only**, with no switch or plans, so it can't flip you out of editing), ⇅ (**Y only**; hidden in X), and **DONE** in locate's slot |

- **Done is the ink-only word "DONE"** in locate's slot: no fill, no added height, 44px target. A word says "you're in a mode". A ✓ already means "selected plan" in the panel, and solid navy means NEXT. **Cost, disclosed to the owner: while editing you can't centre the map on yourself** (the Nearest sort still works).
- **Stated fit.** On a phone (390px), plan names of up to 20 characters are never truncated, in Plans or Edit. On the 360px rail in Edit, the limit is 16. Both are asserted by `check.js` ("Nørrebro afternoon" is 18 characters, across 30+ frames). Longer names truncate with an ellipsis.

## 1. Owner quotes → frames (checklist 13)

| Owner quote (verbatim) | Answer | Frames | Status |
|---|---|---|---|
| "Day agendas — ordered per-day route to plan and follow; scope the smallest v1." | A named list of stops in order. Plans = follow; Edit = change it. | 09, 12 | answered |
| "It shouldn't be as simple as today / tomorrow — … a certain neighborhood, etc. Too limiting." | Any name. Districts and streets can be stops (numbered on the map too). A plan can span cities. | 04, 07, 31, 19 | answered |
| "just separating them in the same view is confusing … plans / places may be good toggle labels" | A two-segment switch in the panel. Plans lists only the plan's stops. **Edit mode is the Places list in its own order**, with stops marked inline by their number, **never a stops-first list by default**. | 02+, 09, 32 | answered |
| "they should only be selectable from the panel not the list header" | Pick, create, rename and delete happen only in the panel. | 16+, 19+ | answered |
| "The header should show whatever the list is — either the place or the plan." | The city list or the plan's name. | 01, 09, 05 | answered |
| "toggle doesn't look like a toggle" | One joined navy track. | 02+ | answered |
| "need to be able to see everything in the map in the list to add to the plan" | Edit lists every place and shape, each with + or its number. | 05–07, 32 | answered |
| "whole UX is odd" | One job per mode: **Plans = follow**, **Edit = add, remove, reorder**. Controls are never on information. **Filled means NEXT only.** | 09, 32 | answered (the owner judges) |
| "simple simple simple" | Places is untouched. The Plans panel shows only what applies. There is no ⇅ in Plans. | 15+, 01 | answered |
| "Dots add an insane amount of visual noise absolutely not" | A stop pin shows its number **in place of** its glyph, in the same ring; nothing is added. A shape stop gets one numbered diamond (it has no pin). | 09, 24 | answered (owner confirms) |
| No extra header height and no second text rows | Header 57px and rows 56px (asserted). ✓ is 32px, the same as locate. | all | answered |
| "the filter panel examples are missing tons of stuff" | **Sheet 1 opens with this comparison:** the Places panel has every control (02+, 15a+); the Plans panel removes the chips on purpose (15+), and says why. | 15+, 02+, 15a+ | answered (owner confirms) |

## 2. Filters, city and sort (checklist 3)

| Control | Plans | Edit mode | Frame |
|---|---|---|---|
| City and category chips | **Hidden**: a plan always shows whole, so they'd do nothing. *(Decided by the team; the owner confirms.)* | Live (Edit is the Places list) | 15+, 02+, 15a+ |
| Sort ⇅ | Hidden (Plan order only) | **Opens in Places' own current sort** (A–Z here). "Plan order" is an optional item: stops first, with grips for reordering. **Session-only**: choosing a sort in Edit never writes Places' saved sort, and Places' order is restored on ✓ (tested). The six: A–Z, Category, Nearest, What's left, Starred, Newest. | 13, 14, 32 |

## 3. Where each job lives (checklists 6, 8)

| Job | How | Undo / confirm | Frame |
|---|---|---|---|
| Enter editing | **Edit stops is the first row of the plan's list** (an action row, exempt from tap-to-fly). No scrolling. | – | 09, 28 |
| Create | Panel › Plans › New plan › name › Create (or Cancel). Lands in Edit mode. | – | 03+, 04+, 05 |
| Add | Edit: + on any place or shape | tap its number | 06, 07 |
| Remove | Edit: tap the stop's number (**the same outline tile** as +). It turns to − while pressed. To find stops fast, use ⇅ › Plan order. | Undo 6s, multi-level, survives ✓, ends on leaving the plan | 08, 33, 34, 36 |
| Reorder | **Y:** Edit › ⇅ › Plan order, then hold the grip 250ms and drag. **X:** hold-drag straight away. Keyboard: ArrowUp/Down. | drag back | Y: 14, 11, 11b · X: X4 |
| Follow | Plans: the row flies and opens the popup; the filled tile is NEXT. | – | 09, 12 |
| Rename / Delete / Switch / Exit | Panel (⋯ inline) | Cancel / confirm | 16+–19+, 27+ |
| Swipes / delete × | Swipes unchanged from the row body. Edit grip and tile own their touches, and a vertical stroke still scrolls. The × only appears in Places. | – | griptest 21/21 |

**Tiles: three states, one meaning each.**

| Tile | Where | Means |
|---|---|---|
| Outline + | Edit | not in the plan; tap to add |
| **"In plan" tile**: 2px navy ink, light navy tint (12%), never solid, plus a quiet 3px leading-edge mark on the row | Edit | a stop; tap its number to remove it (− while pressed) |
| Outline number | Plans | a stop (information) |
| **Solid navy number** | Plans list **and map** (pin or diamond) | **NEXT, and nothing else.** Edit has no solid tile, no solid pin and a non-navy Done (all asserted). |

**Row marks (Plans).**
- Badge, name, meta and tile: **4**.
- +1 for a star or for the muted shared VISITED stamp.

**Map (decided: numbers ON, in Plans AND Edit).**
- **Pins:** a stop pin's number replaces its category glyph inside the same ring. In Edit you see the route build as you add; non-stops keep their glyph (32, X1).
- **NEXT** is filled on the map exactly as in the list: a navy pin or diamond with a paper numeral (09). Plans only; asserted.
- **Shapes:** a shape stop has no pin, so it gets **one numbered diamond**, the list's own shape badge, at the shape's centroid. It is tappable, like its row. So the map reads 1–6 with no gaps (09; `check.js` asserts every stop in view is numbered at zoom ≥14).
- Numbers only appear at zoom ≥ `GLYPH_MIN_ZOOM`. Clusters below `SOLO_MIN_ZOOM` keep their count (24). The star keeps its corner.
- **A stop pin or diamond always draws above any place pin it overlaps** (a z-index just under the highlighted pin; asserted: 0 violations in 51 frames).
- Against "no dots": pins gain nothing. The shape diamond is one new mark per shape stop; it stands in for the pin a shape doesn't have.
- **Cost (flagged): on stop pins the category glyph is lost.** Only the ring's ink keeps the category.

## 3b. How Edit opens: **the owner chose X** ("Do x I mean"). X is the prototype default and the build spec; Y is kept below for the record.

| | **Y (current)**: Places' own order, stops marked inline | **X (the CD's)**: stops first with grips, a plain rule, then everything else A–Z |
|---|---|---|
| Frames (filmstrips `owner-option-Y.png` / `owner-option-X.png`; step-by-step X in `owner-images/`) | 32, Ya, Yb, Yc, Yd, Ye | X1, Xa, X3, X4, Xd (+ X2) |
| Add 3 | 5 (Edit stops, + + +, DONE); finding each place is the same scroll as in Places | 5, same |
| Remove | 3 + scroll (or 5 via ⇅ › Plan order) | **3** (stops are at the top) |
| Reorder | 5 (Edit stops, ⇅, Plan order, drag, ✓) | **3** (Edit stops, drag, ✓) |
| Sort menu | Plan order is an optional item | ⇅ hidden (the stops lead; the rest is A–Z) |
| Against the owner's "separating them in the same view is confusing" | one list by default; **reordering switches to stops-first (frames 14 / Yd)** | stops-first always, split from the rest by a plain line |

**Tradeoff for the owner, one line each.**
- **Y:** your usual list while editing; to reorder you switch it to stops-first (2 extra taps), and to remove you find the stop.
- **X:** your stops on top while editing (remove 1 tap, drag to reorder), but stops and places share one list, split by a line.

**Recommendation: X.** The owner's "confusing" quote was about the main selector, where Places and Plans stay separate views in both options. Edit is a short-lived tool mode where seeing the plan on top of the places is the job itself. The rule keeps the two parts visibly apart.

## 4. Tap counts (from Places, panel closed; checklist 12; scrolls counted)

| Task | v2 now | 91b4c97 | Rev 6.1 | C (Maps Save) |
|---|---|---|---|---|
| Create a plan | 4 + name | 4 + name | ≥3 + name | 4 + name |
| Add 3 places | 4 right after Create; 5 from the plan (Edit stops is first; finding each place is the usual Places scroll, in Y or X) | 4 / 5 | ~8 | 9 |
| Reorder a stop | **Y 5** (Edit stops, ⇅, Plan order, hold-drag, ✓) · **X 3** | 3 | not possible | 1 |
| Follow (open, first stop's directions) | 6 | 6 | 6 | 6 |
| Remove a stop | **Y 3 + a scroll**, or 5 via ⇅ › Plan order · **X 3** | 3 + scroll | 5 | 3 |
| Delete a plan | 5 | 5 | ~5 | 5 |
| Switch plan | 3 | 3 | 3 | 2 |
| Exit to Places | 3 | 3 | 3 | 3 |

Under Y, reorder costs 2 more taps than before, because Plan order is a choice rather than Edit's default (audit A1). X removes that cost, at the price in §3b.

## 5. Build notes (stage 2; not in the prototype)

- **Schema.**
  - `plans(id, name, created_by, created_at)`.
  - `plan_stops(id, plan_id → plans ON DELETE CASCADE, location_id text NULL → locations ON DELETE CASCADE, shape_id bigint NULL → neighborhood_shapes ON DELETE CASCADE, position numeric, created_at)`, with `CHECK (num_nonnulls(location_id, shape_id) = 1)`.
  - Positions are last-write-wins. RLS matches `locations`.
- **Drag.** Hold `starHeld` and the `syncLocationCards` re-render while armed; the poll and Undo re-renders apply on drop.
- **Gesture gate.** The Edit grip and tile touch the row plumbing: run the full gate plus iPhone checks. Unverified on iOS Safari.
- **Accessibility.**
  - ✓ is `aria-label="Done editing"`.
  - Plans tiles are `role="img"` ("Stop 2, next").
  - The grip names the stop and the arrow keys.
  - The switch is a radiogroup.
- **Coordination.** The shared VISITED stamp and the popup line follow their own redesign threads.
