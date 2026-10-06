# Round 1: UX review of the 8 popup concepts

> **Owner corrections, 2026-10-05 (supersede parts of this review):**
> "Type is actually tier 2 imo — or bottom of tier 1. Notes are tier 1";
> "Don't pay attention to old feedback ignore it. The type thing I mean."
> (type-above-name withdrawn); "we're trying to rate concepts here not
> execution ... Replacing list with info is a fine thing to explore."
> So: type placement is open (Concept 4's type-below-name is not a
> conflict); replacing the list (3 / H2) is not a concern or owner question
> in itself; mock flaws are fix notes, not kill reasons. Note-peek bar
> raised: see `../ux-analysis.md` §11.

UX agent, 2026-10-05, on the designer's `f3a0e58`. Brief: `docs/ux-brief.md`
(verbatim in the task). The jobs J1–J10 and constraints C1–C10 are from
`../ux-analysis.md`. I judged from the 1x phone stills (busiest first, then
bare, shape and the `-x` expanded states) and the 3x crops. This review covers
interaction, task and hierarchy only. Visual quality is the CD's call.

Owner (this task): "explore many and varied ideas using the loop process to
result in the best ones based on what this popup is supposed to do and the
heirarchy and purpose of information in the card."

## Ranking (UX)

| # | Concept | Verdict | One line |
|---|---|---|---|
| 1 | **2 Folded Note** | KEEP | Best balance of glance vs density; standard pattern. Must fix: the unfold moves the actions (seen in the stills). |
| 2 | **6 Map Label + Dock** | KEEP | The only concept where the glance hides no neighbours and actions sit in a fixed thumb spot. Must fix: OSM credit, identity in the dock, label collisions. |
| 3 | **1 Quiet Fix** | KEEP as control | Every job passes. Still covers ~55% of the map when busy, and density is ordered, not solved. |
| 4 | **3 Place Sheet** | KEEP, conditional | Strong convention. But it replaces the list, its height changes per place, and its bottom runs under Safari's toolbar. |
| 5 | 8 Luggage Label | KILL as a structure | Interaction is identical to 1. Its band is a skin for the CD to judge on 1/2. All-caps names hurt J1 on long names. |
| 6 | 4 Row Unfolds | KILL; salvage one idea | No ×, sheet grows to 480, type below name, puts the row-gesture gate at risk. Salvage: a map tap selects the row (fixes S1). |
| 7 | 7 Action Rail | KILL; salvage one idea | A name-only popup is ~210px tall, "GO" is unclear, and the locality needs data the app doesn't store. Salvage: a one-line address with "Full address ›". |
| 8 | 5 Side Tab | KILL | Notes hidden at glance (J2 costs a tap), the drawer covers 84% of the map, the pin goes to the Safari back-swipe edge, and the tab is 24px wide. |

No concept has a hard BLOCKER on a job. All "BLOCKER" marks below are
constraint failures that would block landing if left unfixed.

## Rulings on the designer's flags

1. **"Get Directions" → "Directions": accepted.** The compass and the word
   carry the meaning. The owner's quote ("the same text button not a new
   button style") was about the style, not the copy. The accessible name
   stays "Get directions". The owner sees it in the stills; if they object,
   revert. **"GO" (Concept 7): rejected.** On a map, "go" could just as well
   mean "go to it on the map".
2. **"Stop n of m" in the eyebrow: accepted.** I said "low if it moves"; the
   eyebrow is a quiet, zero-cost spot, and it's view context like the row's
   city. Conditions: only in Plans view, only for stops of the active plan
   (as today), and it must never push the type word off the line. With a
   long type and two-digit stops, check the eyebrow at 300px.
3. **Concept 4:**
   - Type below the name: a conflict with the owner's rule. As the row it is
     the row's convention, but it's still the owner's call, and I wouldn't
     spend the owner's time on it given the other problems.
   - No ×: **BLOCKER** (C6).
   - Sheet grows to 480px: **BLOCKER** under "controls don't move or grow".
     That quote was said about the Plans panel, but the principle is the
     owner's and it fits exactly: the list header jumps up under the finger.
4. **Concept 3, height per place: BLOCKER as drawn.** Directions sits at
   y≈728 for VEGA and y≈801 for Perlan, so the thumb target moves between
   places. Same owner quote. Fix: one fixed peek height for every place.
5. **Concept 6, dock covers the OSM credit: BLOCKER.** The © OpenStreetMap
   attribution must stay visible (licence). It needs a home that the dock
   never covers.
6. **Concept 7, structured address: not buildable in this round.** Saving
   Nominatim `addressdetails` at add time is a schema plus add-flow change
   (lane 3, migration), and the 202 existing rows would need backfilling via
   live OSM, which only runs in the owner's browser. Parsing the display
   string is unreliable: the parts vary by country and by OSM object. Use a
   "Full address ›" disclosure, or truncate the stored string, instead.

## Findings that apply to every concept

- **U1 Expanded state must survive a re-render.** Today the popup HTML is
  rebuilt on every signature change: star or visit toggles, the 10s poll,
  plan changes. Any More/Less, raised sheet, raised dock or open drawer state
  must persist across that (and across a star/visit tap made in the expanded
  state). Otherwise tapping Star collapses the note you were reading.
- **U2 One selected state (S1/S2).** A map tap and a list tap must produce
  the same selection: pin highlighted and row highlighted. Closing must
  clear it. Concepts 3, 4, 5x and 6 already show the row highlighted. 1, 2
  and 8 must say how they behave.
- **U3 Star shows twice when starred.** The leading mark beside the name and
  the "★ STARRED" control appear together. That's acceptable (mark = state,
  control = action, and the owner's rule is "no star unless starred" for
  marks), but the control's label must not change width so that Visited
  shifts. "STAR"→"STARRED" and "MARK VISITED"→stamp both change width; the
  slots must be fixed (the designer claims this; verify in the build).
- **U4 Three actions in one row.** Each target must be ≥44px tall with ≥8px
  dead bands at 300px wide. The stills look fine. Measure in the build, at
  the 240px minimum popup width too.
- **U5 Signed-out viewers.** None of the stills shows the signed-out state.
  Each concept must say whether Star and Visited show to viewers (today they
  do and open sign-in). This is an owner question, not a blocker.
- **U6 VoiceOver.** Sheets, docks and drawers need a focus move into the
  place on open and back to the origin (pin or row) on close. The
  `hapticTap()` label must cover every new star/visit target (C2).
- **U7 Plans parity opportunity (not a blocker).** None adds "add to /
  remove from plan" to the place. It's deferred in the backlog. Concepts 3
  and 6 have the room for it; note it, don't build it.

## Per-concept review

Evidence = what I saw in that concept's stills. A job marked PASS means it
can be done in one tap or less from the opened place.

### 2 Folded Note: KEEP (rank 1)

| Job | Result | Evidence |
|---|---|---|
| J1 identify | PASS | Eyebrow `BAR · STOP 2 OF 3`, then badge + name, read first (busiest). |
| J2 decide | PASS (friction) | The peek shows **one** line of note ending "Sat Sep… MORE", not the two the README claims. One line is too little to decide on. |
| J3 / J4 / J5 | PASS | One action row: Directions · Starred · stamp. |
| J6 | PASS | Eyebrow. |
| J7 | PASS | 44px ×. Popup 300×146, about a quarter of the map strip. |
| J8 | PASS | Address one tap (More), labelled ADDRESS. |
| J10 | PASS | Opens folded. |

- **Mode/state: BLOCKER.** The README says "the action row never moves", but
  in the stills the map autopans on unfold. The pin goes from y≈270 to
  y≈430, and the action row from y≈236 to y≈398. The thumb's targets jump
  about 160px. Either grow upward without autopan (cap the unfolded height
  to the space above the pin and scroll inside it), or accept the jump.
  The jump is not acceptable under "controls don't move".
- More/Less must be ≥44px targets with the U1 persistence.
- Hierarchy at 1x (peek): name > stamp > Directions (only colour) > note
  line > eyebrow > More. "More" is a second accent word; it's the CD's call
  whether that's too loud. Interaction-wise it's correctly placed at the end
  of the peek.
- Convention: standard truncation plus "more". Good.
- **Round 2 must fix:**
  - a 2-line peek (or a peek sized so the first sentence shows);
  - the unfold must not move the action row;
  - the peek for a place with an address but no note (50 of 202 real places
    have no note), and the shape case (no note, no address: More must not
    appear);
  - U1.

### 6 Map Label + Dock: KEEP (rank 2)

| Job | Result | Evidence |
|---|---|---|
| J1 identify | PASS | Type + name printed beside the pin; no box over neighbours (busiest: the café and restaurant pins stay visible). |
| J2 decide | PASS (friction) | 2-line note peek in the dock; full note on raise. |
| J3 / J4 / J5 | PASS | Dock action row at a fixed y (≈512) in the thumb zone; same y in bare and busiest. Best of all eight. |
| J6 | PASS | Eyebrow on the label. |
| J7 | PASS | × on the dock, plus map tap. |
| J8 | PASS | Raise the dock. |
| J10 | PASS | Flies, then label + dock. |

- **BLOCKER:** the dock covers the © OpenStreetMap credit (busiest and bare
  stills).
- **BLOCKER-risk:** the dock has no name (bare: the dock is only "DIRECTIONS
  STAR MARK VISITED ×"). If the user pans the pin off screen, or the label
  lands under the sheet, the dock is an orphan: actions for an unnamed
  place. Either carry the name in the dock (it can be quiet) or close the
  dock when the pin leaves view.
- Label collisions with other pins' glyphs and OSM street names on real
  tiles: the stand-in map hides this. Also check a label at the screen edge
  and a label near the + / account buttons.
- Raised dock (x state): it grows upward over the map (≈250px). That's
  acceptable because the action row stays put at y≈512. Keep it that way.
- Pins under the dock (bottom 110px of the map) can't be tapped while it's
  open. Autopan must keep the selected pin above the dock, not just above
  the sheet.
- Hierarchy at 1x: the name label (bold on the map) > stamp > Directions >
  note > eyebrow. Good. The selected pin is the category icon (owner's
  "icon treated differently" is solved by construction).
- Convention: Google/Apple Maps bottom card + label.
- **Round 2 must fix:** the credit, identity in the dock, the collision
  rule, autopan above the dock, U1–U3.

### 1 Quiet Fix: KEEP as the control (rank 3)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS | Eyebrow + badge + name. |
| J2 | PASS | Full note in 14px ink, right under the name. |
| J3 / J4 / J5 | PASS | One action row. |
| J6 | PASS | Eyebrow. |
| J7 | PASS (friction) | 44px ×. But the busiest card is ~300×300 and hides the café/fork pins under it (busiest still), which hurts "what's near" (J2). |
| J8 | PASS | Address always shown, last. |
| J10 | PASS | Unchanged. |

- Hierarchy at 1x: notes block ≈ name > stamp > Directions > address >
  eyebrow. The order matches the intent; the note's mass still competes.
- Mode/state: nothing expands, so U1 is moot. U2 still open.
- Density is not solved. This stays as the control the others must beat,
  and as the fallback if the owner wants the smallest change.
- **Round 2:** nothing new; only shared fixes U2–U5.

### 3 Place Sheet: KEEP, conditional (rank 4)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS | Header band: badge, eyebrow, name, ×. |
| J2 | PASS | 3-line note peek; map fully clear above. |
| J3 / J4 / J5 | PASS | 130×52 cells. Biggest targets of all. |
| J6 | PASS (friction) | Eyebrow. But the plan's stop list is gone while the place is open, so "what's next" (following a plan) needs a close first. |
| J7 | PASS | × in the header, plus map tap. |
| J8 | PASS | Raise. |
| J10 | PASS (friction) | List tap → the list is replaced by the place. Going to the next row means close → list → tap: two extra taps per place when browsing the list. |

- **BLOCKER:** height per place (ruling 4).
- **BLOCKER:** Safari's tab toolbar. The stills run note text to the bottom
  pixel (busiest, x). In a Safari tab, `--sheet-under` (~100px) sits behind
  the translucent toolbar, so the peek's note lines would be unreadable.
  Content must stay above `--sheet-under`, as the list sheet's does.
- **Control parity:** the list's chips, sort and filters are unreachable
  while a place is open. Acceptable only if close restores the list exactly
  (scroll, filters, Plans/Places mode) (C9). Must be stated and tested.
- Gesture conflict: the drag-up handle sits in the list sheet's own drag
  area. One gesture can't mean "raise the place" and "raise the list".
  Define it.
- Hierarchy at 1x: name > stamp > Directions > Star > note > eyebrow. Good.
- Convention: Apple/Google Maps place sheet. The strongest convention here.
- **Round 2 must fix:** one fixed peek height; the toolbar inset; a
  restore-the-list contract; the drag ownership; U1/U6.
- Worth trying as hybrid H2.

### 8 Luggage Label: KILL as a structure (rank 5)

- Jobs: identical to Concept 1 (same parts, same places). J1 is loudest, but
  with a 3-line all-caps name for Grandi (shape still), long names read
  slower in caps. That's a J1 cost on 40-character names (real max 49).
- Hierarchy: band >> everything. The name wins, as intended, but at the
  cost of making Directions' colour no longer unique (two figure-deep
  areas).
- Interaction adds nothing over 1. Hand it to the CD as a possible header
  skin for 1/2/6; it's not a separate structure for the loop.

### 4 Row Unfolds: KILL; salvage the selection idea (rank 6)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS (friction) | A map flag with the name only, plus the highlighted row. Type is below the name (owner rule unmet). |
| J2 | PASS | Full note in the unfold. |
| J3 / J4 / J5 | PASS | Action row under the note. |
| J6 | PASS | The row's stop number. |
| J7 | **BLOCKER** | No ×. |
| J8 | PASS | Shown. |
| J10 | PASS | Row unfolds in place. |

- **BLOCKER:** the sheet grows to 480px. The map strip falls to 364 and the
  list header jumps.
- **BLOCKER-risk (gate):** the row-gesture gate asserts rows at 56.00px.
  The unfold must be a separate element after the row, never inside it, so
  that swipe-star and swipe-visit code is untouched (CLAUDE.md "Animation
  separation").
- **Shape still:** the unfolded last row (Grandi) sits at the bottom of the
  sheet. Its actions are visible, but the row can't scroll up, so the
  unfold is cut at the edge.
- If the user had the sheet collapsed, a map tap forces it open. That's an
  unrequested mode change (C9).
- **Salvage:** the map tap selects the row, so the map tap and list tap
  become one state. Carry this into every kept concept (U2).

### 7 Action Rail: KILL; salvage the address line (rank 7)

- Jobs pass (J3–J5 as 64×56 tiles).
- **J2 friction:** the narrow text column wraps the note to 8 lines
  (busiest).
- Bare popup: ~210px tall for a name (bare still), the rail sets the
  height, which reverses the bare-popup fix.
- "GO": rejected (ruling 1).
- The locality line is not buildable (ruling 6).
- The visited sticker disc is a fourth visited control look. The CD can
  judge that, but interaction-wise it's a new affordance to learn.
- Vertical action rails are not a map-callout convention. It also puts ×
  right above Go: two adjacent top-right targets, one destructive to
  context.
- **Salvage:** an address shortened to one line plus "Full address ›" (from
  the stored string: truncate, don't parse). It can go into 1, 2 or 6.

### 5 Side Tab: KILL (rank 8)

- **J2:** no note at a glance. Deciding always costs a tap on a 24×76 tab
  (below 44 wide).
- **J7 / J2 (x state):** the drawer covers ~84% of the map width. The
  selected pin is panned to x≈35 (busiest-x), inside or next to the 24px
  Safari back-swipe edge (`STAR_SWIPE` EDGE).
- The drawer repeats the header and actions, so the same controls appear in
  two places at once.
- The vertical caps word "NOTES" / "CLOSE" is slow to read.
- The tab shows for 201/202 places (any address), so the "only when there's
  more" rule never actually hides it.
- Convention: an iPad/desktop pattern, uncommon on a phone.

## Hybrids worth one round-2 try (interaction reasons)

- **H1 Fold + Dock** (2 × 6): the name and type as a map label at the pin;
  the dock carries a quiet name line, a 2-line note peek with More, and the
  action row. More raises the dock upward while the action row stays at
  its y.
  - Why: it fixes Fold's moving actions (the dock is anchored to the sheet,
    never autopanned), fixes Quiet's occlusion (no box over neighbours), and
    fixes the Dock's orphan problem (the name is in it).
  - Must keep: the credit visible, autopan above the dock.
- **H2 Fixed-height Place Sheet** (3, constrained): the place takes the list
  sheet's current height (never its own), swaps back to the list exactly as
  left on close, and keeps content above `--sheet-under`. The selected row
  stays highlighted underneath (from 4).
  - Why: the biggest targets and the clearest map, without the moving
    action strip or the height growth.
  - ~~Owner question: is losing the list OK?~~ Owner: "Replacing list with info is a fine thing to explore."
- **Into whichever wins:** the U2 single-selection rule (from 4) and the
  one-line address + "Full address ›" (from 7, truncation only).

## What I could not verify

- Everything is from stills: no gesture, autopan timing, re-render or
  VoiceOver behaviour was run. Fold's autopan movement is read off the two
  stills (pin and action row positions), not driven.
- A stand-in basemap means label collisions (6) are unjudged.
- 1x stills are downscaled from 3x, not native 1x.
