# Round 2: UX review of concepts A–D

UX agent, 2026-10-05, on the designer's `74cbefc`. Brief:
`docs/ux-brief.md` (verbatim in my first task). Jobs J1–J10 and constraints
C1–C10 are from `../ux-analysis.md`. I worked from the 1x phone stills
(busiest first), then the other states and the f1–f4 frames, plus the 3x
crops where 1x was unclear. Concepts are rated on the idea; mock flaws are
fix notes.

Standing owner words:
- "Type is actually tier 2 imo — or bottom of tier 1. Notes are tier 1"
- "Don't pay attention to old feedback ignore it. The type thing I mean."
- "Replacing list with info is a fine thing to explore."
- "we're trying to rate concepts here not execution"
- "Directions is fine." — settled. The "Get Directions" vs "Directions" copy
  question is closed; use "Directions".
- "Have them check this against the inspo / product philosophy…I like whimsy
  and these all seem kinda average. The most exciting ideas as far as whimsy
  have been cut" — see section 4.

## Ranking (UX)

| # | Concept | Verdict | Ready for the owner after the must-fixes? |
|---|---|---|---|
| 1 | **B Place Sheet** | KEEP | Yes. Best map visibility, one fixed action y, no drag to own. It also has the most room for a characterful container (section 4). |
| 2 | **C Row Becomes the Card** | KEEP | Yes, after the Plans-order fix and the × fix. Strongest list/map parity. |
| 3 | **A In-map Card** | KEEP as the control | Yes. Every job passes; it's the "smallest change" option, and a hanging tag would be a reskin of it. |
| 4 | D Fold + Dock | KILL | — Its one unique win (unboxed map plus the list visible) is covered by C with one layer fewer. It is A's card moved down. |

No concept has a job BLOCKER. "BLOCKER" below means a constraint failure
that must be fixed before building.

## Rulings on the designer's flagged questions

1. **C: actions above the note so they never move. Accepted.** "Controls
   don't move or grow" is the owner's rule. "Notes are tier 1" means the note
   is read at first glance, and in C it still is: busiest note at y≈700–750,
   typical fully visible, no scroll. Condition: in the default state a
   typical note must show whole without scrolling the sheet. Owner Q5 stays
   an owner question; my input is "OK".
2. **B: fixed height vs content-sized. UX recommends fixed.** Content-sized
   moves the action row and the map edge per place: Directions would land
   at a different y every tap, which runs into the owner's "I don't want it
   to grow height/for the button to change physical location after click".
   Empty paper on a bare place is a visual question (CD/designer), not an
   interaction one. Owner Q3 stays an owner question.
3. **Orange selected row next to an open card (A, D): interaction side
   only.** The row must show it is selected (U2: pin and row select
   together). It must
   stay tappable and swipeable. A swipe-star or swipe-visit on that row
   while the card is open must update the card (U1). Its loudness is the
   CD's call; any selected state that is clearly visible satisfies UX.
4. **Signed-out viewers (Q2):** stays an owner question.

## Checking the designer's "fixed" claims against the stills

| Claim | Concept | Verified? | Evidence |
|---|---|---|---|
| Action row never moves on More | A | **Yes**, with a caveat | Action y=434 in `busiest`, `busiest-open`, f1–f3. **Caveat (`f4-high`):** a pin panned high caps the card under the top controls. The note is cut mid-line ("Lake Street Dive w/ Røverdatter" sliced through), with no fade or "more" cue that the card scrolls. |
| Typical note whole; long note 3 lines + MORE | A, D | Yes | `typical` shows the whole Aurora note; `busiest` shows 3 lines plus "… MORE". |
| Fixed 300px | B | Yes | Header at y≈545 in busiest and bare; actions at y≈814 in both. |
| Toolbar inset | B | **Unverified** | The harness has no Safari toolbar (`--chrome-bottom` 0). In a tab, ~100px of the 300 sits behind the toolbar, which may leave ~3 note lines visible. Must be shown. |
| List restored as left | B, C | Yes (as drawn) | `f4-closed`: same list, VEGA row no longer highlighted. |
| Actions fixed | C | Yes | y=675 in `f2`/`f3`. |
| × present, sheet stays 300 | C | Yes | Card × at the top right; list header unchanged at y≈545. |
| Credit visible; name in dock | D | Yes | © OpenStreetMap band at y≈535 above the dock; dock carries badge, name and type. |
| Autopan above the dock | D | Yes | Pin at y≈300 above dock top ≈360; raised: pin ≈160 above dock top ≈225. |
| One star per surface | all | Yes | No leading star in any card; the control is the mark. |
| U1 open state survives a rebuild; U6 VoiceOver | all | Contract only | Can't be checked in stills. Must be tested in the build: star/visit tap in the open state, plus a 10s poll, never collapses or scrolls it. |

## 1. B Place Sheet: KEEP (rank 1)

| Job | Result | Evidence (busiest unless noted) |
|---|---|---|
| J1 identify | PASS | Header: badge, name, then `BAR · STOP 2 OF 3`. Unboxed name label beside the pin on the map. |
| J2 decide | PASS | Whole 5-line note at reading size. The map is fully clear for "what's near". |
| J3 / J4 / J5 | PASS | Actions at the foot, at one y for every place (814). |
| J6 follow plan | PASS (friction) | The type line says Stop 2 of 3. Going to stop 3 means × then tap its row, or tap its pin on the map. |
| J7 back | PASS | × in the header, plus map tap. |
| J8 address | PASS | One line + ›. |
| J10 from list | PASS | `f1`→`f2`: list tap flies the map and opens the sheet. |

- **Control parity:** chips, sort, city menu and row swipes are unreachable
  while a place is open. The owner said replacing the list is fine to
  explore. The hard part is that × must restore the list exactly (drawn in
  `f4`; must be tested: scroll, filters, Plans mode, selection cleared).
- **Mode/state:** a tap on another pin while the sheet is open must swap the
  place in place (no close/reopen flash, sheet height unchanged). That's not
  drawn; it must be specified.
- **Hierarchy at 1x:** name > note > stamp > Directions (only colour) >
  address > type. Matches the owner's tiers.
- **Convention:** Apple/Google Maps place sheet.
- **Must-fix:**
  1. Show the Safari-tab state. If the visible note area drops below ~3
     lines, say how the note reads (it scrolls inside, per `f3`).
  2. Specify pin-to-pin swapping while open.
  3. Following a plan (J6): moving to the next stop must not need a close.
     A map pin tap does it today when the pin is on screen; say what
     happens when it's off screen. (I'm not prescribing next/prev; it's a
     requirement.)
  4. Inner scroll (`f3`): the header and actions stay fixed and only the
     body scrolls. Verify a vertical drag in the body never moves the sheet
     or the map.

## 2. C Row Becomes the Card: KEEP (rank 2)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS | Card at the top of the list: badge, name, type line. Unboxed map label. |
| J2 | PASS | Typical note whole under the actions (`typical`); busiest 3 lines + MORE. |
| J3 / J4 / J5 | PASS | Fixed y 675. |
| J6 follow plan | **BLOCKER (Plans)** | `busiest`: stop 2's card sits **above** row "1 Bæjarins Beztu". In Plans the list's order *is* the content. Lifting a stop to the top shows the plan out of order, and stop 2's number (the drag handle) disappears. |
| J7 | PASS (risk) | The card × sits in the same column as the rows' × directly below. On rows that × means delete (Places) or remove from plan (Plans). One glyph in one column with two meanings, one of them destructive. |
| J8 | PASS | One line + ›. |
| J10 | PASS | A list tap does the same as a pin tap. |

- **Parity:** strongest. The card is the row's stand-in, the swipes stay on
  real rows, and the 56px row gate is untouched (the card is a separate
  element).
- **Mode/state:**
  - The sheet-collapsed case is still open: a pin tap with the sheet
    collapsed must either open the sheet to its normal height (not taller)
    or fall back. The designer must pick one.
  - The lifted row's slot closing up: acceptable, since close puts it back
    (`f4`).
- **Hierarchy:** name > note > stamp > Directions > type. OK.
- **Convention:** pinned list item; fine.
- **Must-fix:**
  1. Plans view must keep stop order and the stop number visible (open the
     card in place, or show the number). Places view can lift.
  2. The close control must not read as the rows' destructive ×: a
     different glyph, position or form (the designer chooses).
  3. Pick the collapsed-sheet behaviour.

## 3. A In-map Card: KEEP as the control (rank 3)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS | Name, then type line. The pin under the tip is the icon. |
| J2 | PASS | Typical whole; busiest 3 lines + MORE; open state shows all. |
| J3 / J4 / J5 | PASS | Fixed slots, y 434. |
| J6 | PASS | Type line. |
| J7 | PASS (friction) | 44px × and map tap. The busiest card covers ~180px of map, ~360 when open (`busiest-open`). |
| J8 | PASS | FULL ADDRESS or More. |
| J10 | PASS | Unchanged. |

- **Mode/state:** every open pans the map to a fixed spot (y≈470). On a
  map tap, the neighbouring pins jump under the finger, so a quick second
  tap on a neighbour can land on the wrong thing. Acceptable only if the
  pan is short and finishes before input is taken. Measure it in the
  build.
- **Must-fix:**
  1. `f4-high`: the clipped scroll needs a visible "there's more" cue. A
     note sliced mid-line reads as broken.
  2. Verify that a drag inside the card scrolls the card, not the map.
  3. The selected-row ruling (above).

## 4. D Fold + Dock: KILL

- Jobs all PASS: action y 498 in bare, busiest and open; credit visible;
  name in the dock.
- **Why kill on the idea:**
  - Three stacked layers in the lower half (map, dock, list). The dock and
    the orange row say the same thing twice.
  - Pins in the bottom ~160px of the map strip can't be tapped while it's
    open.
  - C gives the same "list stays visible, map unboxed" benefit with one
    layer fewer.
- There's no unique job win left. Not a mock problem.

## Section 4. Room for whimsy (owner: "I like whimsy ... these all seem kinda average")

Character is the designer's and CD's call. From the interaction side, these
patterns leave room for a characterful container:

- **A sheet with personality (B, and C's card): the most room.** A
  full-width box at a fixed height and fixed action y, with zero map
  occlusion. The whole surface can be an object: a luggage label, ticket,
  brochure page, scrapbook card (`design/inspo/project/`). The interaction
  constraints apply only to the action row, the × and the inner scroll.
- **A label or tag hanging off the pin (A's structure, new container):**
  interaction-wise the same as A, with the string or tag replacing the tip.
  It's fine if:
  - the tag never covers its own pin;
  - it settles before taps are taken (no swinging controls);
  - reduced motion skips the swing;
  - it keeps 44px targets;
  - a long note still has a one-tap overflow.
  Round 1's Luggage Label was **not** killed by UX on interaction (I called
  it a skin of Quiet Fix). It is free to come back as a container.
- **A tab:** the form is fine. What killed round 1's Side Tab was:
  - notes hidden at a glance (now a hard limit: notes are tier 1);
  - the pin pushed into the 24px Safari back-swipe edge (hard);
  - an 84% map cover (soft);
  - a 24px-wide tab (a mock flaw).
  A tab with the place name on the sheet's top edge, or a tab on a card
  that carries the note, would pass.

### Hard limits vs defaults (so a bold concept isn't killed on a soft one)

**Hard** (owner rule, platform, legal, or a job breaks):
- Directions, Mark Visited and Star each one tap from the open place.
  VoiceOver has no other star path.
- ≥44px targets with ≥8px dead bands.
- Controls don't move or grow on a tap (owner).
- A typical note is readable with no tap (owner: notes tier 1).
- Visible © OpenStreetMap credit.
- No horizontal drag gesture starts within 24px of the screen's left/right
  edges, and the selected pin isn't parked there (Safari back-swipe). Content stays above the Safari toolbar / home indicator.
- List tap → map flies → place opens; every kind (pin, district, street,
  approx) gets the same content and capabilities; the list shows every
  filter match (CLAUDE.md).
- Toggles never close the place or move the map. The open state survives
  re-renders.
- Row gesture code untouched, rows 56px (gate).
- No marks for empty data.
- The haptic tap label on every star/visit target.
- Some close plus map-tap-to-dismiss.

**Defaults** (mine; bend them if a concept earns it):
- The glance never covers the whole map (C7). A brief full-takeover is OK
  if dismissal is obvious.
- A boxed card with a tip as the pin link: any clear link works (string,
  label, highlight).
- Actions in one row, their order and side.
- Where type and "Stop n of m" sit (open).
- The one-line address + ›, and address placement.
- No inner scroll.
- Card width and position; sheet vs in-map.
- My ink-mass rankings: guidance, not limits.

## What I could not verify

- Stills only: no autopan timing, inner-scroll vs map-drag, re-render
  (U1), VoiceOver (U6) or haptics were run.
- No Safari toolbar in the harness, so B's inset is unchecked.
- Stand-in basemap: label collisions for B/C are unjudged.
