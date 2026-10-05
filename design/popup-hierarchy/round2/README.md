# Popup hierarchy: Round 2 concepts (visual designer)

Designer, 2026-10-05. Builds on round 1 (`../round1/`), the UX review
(`../round1/ux-review.md`), UX's section 11 in `../ux-analysis.md`, the first
CD review (`../round1/cd-review.md`) and the CD concept rescore
(`../round1/cd-concept-rescore.md`, which supersedes the first CD review).

**Contact sheet for the owner:** `index.html` ("Popup Concepts Round 2").

## Owner input applied this round (verbatim)

- "Type is actually tier 2 imo — or bottom of tier 1. Notes are tier 1"
- "Don't pay attention to old feedback ignore it. The type thing I mean. Also
  we're trying to rate concepts here not execution — tell cd don't kill if
  the mock was bad kill if the idea was bad. Replacing list with info is a
  fine thing to explore."

What changed because of it, in every concept:

- **Notes are tier 1:** a typical note shows **whole** at first glance, in
  14/20 ink. A note only folds when it runs past 4 lines; then it shows 3
  lines, cut at a word, with "…" and a quiet MORE. The 90th-percentile note
  (109 characters) is 2–3 lines, so it never folds. Only VEGA (5 lines at
  popup width) and the approx pin (8 lines) fold in these stills.
- **Type is tier 2:** it moved **below the name**, in the list row's own meta
  voice (10px condensed caps, `--ink-2`): `BAR · STOP 2 OF 3`. That's the same
  line, in the same place, as the row's `BAR · REYKJAVÍK`. Type now reads lighter
  than both the name and the notes. Above the name it was the first thing the eye
  hit, which no longer matches its tier.
- **The list can be replaced:** Concept B is the full-replacement version,
  with no hedging.

## How the stills were made (same harness as round 1)

`render.js` loads the real app (`index.html`, unmodified) in the gesture
harness, patches real rows' text into fixture rows, injects `concepts.js`,
and draws one concept on the live page. That gives real markers, the real
list, real row badges (copied from the row DOM), the real stamp, tokens and
glyphs. The basemap is the round-1 stand-in drawing, because tiles are blocked.
The 1x stills are downscaled from 3x. Rendering is Chromium only.

States, all real data:

| State | Place | What it tests |
|---|---|---|
| busiest | VEGA Copenhagen | Starred, visited, Stop 2 of 3, 5-line note, 3-line address (Plans view) |
| typical | Aurora Reykjavík | 3-line note: the case most taps look like |
| approx | Værnedamsvej (approx.) | 8-line note with a paragraph break, dashed pin |
| longname | Swedish Museum of Performing Arts Scenkonstmuseet | 2-line name, short note |
| addronly | Reykjavík Maritime Museum | Address but no note (queried for this round; 50 of 202 places look like this) |
| bare | Perlan | Name only |
| shape | Grandi (Old Harbour creative district) | District |

Motion is shown as frames (`f1…f4`). Pink dashed lines and rings are
**annotations, not UI**: the action row's y, and the tap point.

Files: `<concept>/<state>-phone@1x.png` and `<state>-crop@3x.png`;
`_sheet/` holds the JPEGs for `index.html`. `render.js [concept]` re-renders,
`build-sheet.js` rebuilds the contact sheet, and `montage.js` makes review
strips.

## Shared fixes (every concept)

| Item | Response |
|---|---|
| CD S1 / rescore 1, UX U3: star drawn twice | **Fixed.** One star per surface. The star control in the action row **is** the mark: filled with STARRED when starred, hollow with STAR when not. There is no leading star by the name. (The rescore suggested the opposite pairing: a leading mark plus a differently-shaped control. Control-as-mark is fewer marks, and the first CD review allowed either.) The list row and the pin keep their own star; that is one per surface. |
| Rescore 2: one visited mark per surface | **Fixed.** The visited control's "on" state is the row stamp, in a fixed slot. Concept C hides the row while its card is open, so the stamp appears once. |
| CD S2: different icon-to-word gaps | **Fixed.** Every action is icon + 6px + word. The compass no longer jumps to the text column. |
| CD S3: badge drifts on a 2-line name | **Fixed.** The badge sits on the **first name line** (grid row 1, top-aligned), never centred on a block. In-map cards have no badge: the pin under the tip is the icon (see rescore 5). |
| CD S4: missing dense states | **Fixed.** Approx (8-line note), long name, address-only, typical, busiest, bare and district are rendered for every concept. |
| CD S5 / rescore 10: copy | **Kept "Get Directions"** (the owner's copy) everywhere; all three actions fit at 316px. "Directions" is shown once (`sheet/copy-directions`) as an **owner question**. |
| CD S6: the selected row's figure-deep block is the loudest thing on screen | **Not fixed; owner/CD question.** It is the shipped highlight. A and D show it, because UX U2 requires the pin and the row to select together. C removes it (the row becomes the card). B hides the list. |
| Rescore 3, UX salvage: address | **Partly.** The address is cut to **one line** (truncating the stored string, with no parsing) plus "›". The full address is one tap away. The locality line "Rejsbygade · Vesterbro" needs stored `addressdetails` (schema + backfill, lane 3), so it is not drawn. There is no ADDRESS label anywhere. |
| Rescore 4: notes above actions | **Fixed** in A, B and D. **Not in C**, on purpose: its card grows *downward* into the sheet when it opens, so the actions sit above the note to keep them still. The trade-off is stated in C. |
| Rescore 5: seal = the pin | **Fixed.** The card badge is the list row's badge: the same seal as the pin (paper field, category rim, glyph; diamond for districts, dashed for approx). In-map cards drop the badge entirely, because the pin is right there. |
| Rescore 6: unboxed on-map name label | **Fixed** in B and C, where the detail is away from the pin. It flips left, or drops under the pin, at the screen edge. |
| Rescore 7, UX C9: draw the return path | **Fixed** for B and C (frames f1–f4). |
| Rescore 8: sheet height behaviour | **Decided: fixed detents, never size-to-content.** B always uses the list sheet's 300px box. C keeps the 300px sheet, and its card takes more of it. Bare places therefore leave empty paper in B (shown, not hidden). |
| Rescore 9: merge Quiet Fix + Fold | **Done** as Concept A. |
| Rescore 11: typical state | **Fixed** (Aurora). |
| UX U1: open state survives a rebuild | **Design contract, not provable in a still.** More/raised/open is view state keyed by place id, outside the popup HTML. A star or visit tap, or the 10s poll, re-renders the content inside the open state and never resets it. |
| UX U2: pin tap = row tap selection | **Fixed** in every concept: a pin tap selects the pin and the row exactly as a list tap does, and close clears it. |
| UX U4: 44px targets, ≥8px dead bands | **Held.** Every action is 44px tall; star and visited are separated by 12px, and the directions-to-star gap is wider. Popups are fixed at 316px wide, so the 240px minimum no longer applies. Must be measured in the build. |
| UX U5 / owner: signed-out viewers | **Owner question.** Rendered once (`sheet/signedout`): viewers see Get Directions only. Today they see Star/Visited, and tapping them opens sign-in. |
| UX U6: VoiceOver focus | **Contract:** focus moves into the place on open and back to the pin or row on close. Every star/visit target keeps the `hapticTap()` label. Not renderable. |
| UX U7: add/remove plan in the place | Not built (deferred, backlog). B and C have room for it in the action row. |

## Concepts

### A. In-map Card (Quiet Fix + Fold)

**One line:** the popup at the pin, now with a height ceiling. A typical note
shows whole; only a long note folds, and More unfolds it upward while the
action row stays put.

- **Where things live:** all at the pin. Name; type line under it; note
  (whole up to 4 lines, otherwise 3 lines + MORE); the address in the open
  state, or "FULL ADDRESS" when the note is whole; action row. No badge: the
  pin under the tip is the category icon.
- **Density:** opening pans the pin to **one fixed spot** low in the map
  strip (y≈470). The card therefore always has room to unfold upward, and the
  action row lands at the same y (434) for every place. If the user has panned
  the pin high before tapping More (`f4-high`), the card stops at the top
  controls and scrolls inside. It never autopans after opening.
- **Frames:** `f1-peek` → `f2-mid` → `f3-open` → `f4-high`, with the action
  row's y marked (434, 434, 434, 214 when the pin is high: the row is still
  exactly where it was before More).
- **Truth list.** J1 name first, type light under it; J2 the typical note
  whole, the long note 3 lines + one tap; J3/J4/J5 one tap each, fixed slots;
  J6 type line; J7 44px × and map tap; J8 More / FULL ADDRESS, one tap; J10
  unchanged. Parity: all three actions, and rows keep their swipes. Hierarchy
  at 1x (busiest): name ≈ note > stamp > Get Directions (the only colour) >
  type line > MORE. Convention: map callout with "more" truncation.
- **Review items:** UX "unfold moves the actions": **fixed** (fixed open
  position, grows upward, no autopan after open). UX "1-line peek": **fixed**
  (whole up to 4 lines). CD "two orange words": **fixed** (MORE is
  neutral). CD "fade under a half-word": **fixed** (cut at a word, "…").
  CD "ADDRESS label": **fixed** (removed). CD "pin high": **rendered**.
  UX "address-only peek": **rendered** (1-line address + FULL ADDRESS).
  UX "shape: no More": **rendered** (none).
- **Weak spots:** the busiest card still covers ~180px of map, and the open
  one ~360. Every open pans the map (a fixed pan, but a pan). The row's
  figure-deep block below (CD S6) competes with the card. It is still a box
  over the map.

### B. Place Sheet (fixed height; UX H2)

**One line:** tapping a place swaps the list for the place, in the list
sheet's exact 300px box: name and type, the whole note, a one-line address,
and the actions pinned to the foot. × brings the list back exactly as it was.

- **Where things live:** the header uses the list-header layout (badge on the
  28px spine, on the first name line, with × in the action column). Type is
  under the name. The note, then the address, read top to bottom and scroll
  inside. Actions sit at the foot, at one fixed y (814 here; above
  `--sheet-under` in a Safari tab). The map keeps the selected pin and an
  unboxed name label beside it.
- **Density:** the map is never covered. The sheet never changes height (no
  per-place jump, no raise, no drag gesture to own), and a long note scrolls
  inside with a soft top fade (`f3-read`, approx).
- **Frames:** `f1-list` (Plans list, tap VEGA) → `f2-open` (map flies, sheet
  opens, pin selected and labelled) → `f3-read` (a long note scrolls; the
  buttons stay) → `f4-closed` (× gives back the list as left: same scroll,
  filters, Plans mode; selection cleared).
- **Truth list.** J1 header + map label; J2 the whole note, with the map
  fully visible for "what's near"; J3–J5 one tap, fixed y for every place;
  J6 type line; J7 × in the header + map tap; J8 one tap (›); J10 list tap
  → fly → sheet. Parity: the list's rows, chips and sort are unreachable while
  a place is open (the owner said this is fine to explore). Hierarchy:
  name > note > stamp > Get Directions > address > type. Convention: Apple /
  Google Maps place sheet.
- **Review items:** UX "height per place": **fixed** (always 300). UX
  "toolbar inset": **fixed** (actions padded by `--sheet-under`). UX "restore
  the list": **drawn** (f4); the contract is that the list DOM is kept and
  only covered. UX "drag ownership": **resolved** (there is no drag; content
  scrolls). CD "rules around the strip": **fixed** (none). CD "actions above
  notes": **fixed** (actions at the foot). CD "selected pin": **fixed**
  (shipped highlight + name label). CD "bare voids": **not fixed, by
  choice.** A bare place leaves ~180px of empty paper, the cost of a fixed
  height (owner question below). CD "thumb reach across 358px": the actions
  are spread; a right-hand thumb reaches Get Directions at the far left.
  Noted, not fixed.
- **Weak spots:** you can't see stop 3 while reading stop 2. Empty paper for
  bare and shape places. The map-to-sheet link depends on the pin being on
  screen (the label helps).

### C. Row Becomes the Card (Row Unfolds, pinned; CD rescore track 2)

**One line:** tapping a pin lifts its row out of the list to the top of the
sheet, where it opens into the card. The rest of the list stays below,
exactly where you left it. The sheet never grows.

- **Where things live:** the card sits directly under the list header:
  badge on the spine, name, type line (the row's own meta line), ×, then the
  action row, the note, and the one-line address. The row it came from is
  hidden, so the stamp and star appear once. The rest of the list scrolls
  below it. More lets the card take the whole sheet (the list goes under).
  The map gets the unboxed name label.
- **Density:** the sheet stays 300px. A typical note leaves ~1.5 list rows
  visible below the card (`typical`); VEGA leaves ~1 (`busiest`).
- **Why actions sit above the note here:** the card opens downward into the
  sheet (`f3-open`). With the actions under the name they stay at y=675 in
  both states. With the note first they would drop ~150px when More is
  tapped. This trades the rescore's "notes above actions" for UX's "controls
  don't move". Flagged for UX and the CD.
- **Frames:** `f1-list` (tap the pin) → `f2-pinned` → `f3-open` →
  `f4-closed` (the row drops back into its place; the list is unchanged).
- **Truth list.** J1 card at the top of the list + map label; J2 note
  (whole if typical); J3–J5 one tap at a fixed y; J6 type line; J7 × on the
  card + map tap; J8 one tap; J10 a list tap does the same thing. Parity: the
  strongest. It is the row, and swipes stay on rows (the card is a separate
  element, so the 56px row gesture gate is untouched). Hierarchy: name >
  note > stamp > Get Directions > type. Convention: a pinned / expanded list
  item.
- **Review items:** UX "no ×": **fixed**. UX/CD "sheet grows to 480":
  **fixed** (300). CD "list scrolls under you": **fixed** (the list doesn't
  scroll; the row is lifted out instead). CD "two stamps, two stars":
  **fixed** (the row is hidden). CD "unfold and actions on different left
  edges": **fixed** (icons on the 28px axis, text on 56). CD "boxed map
  flag": **fixed** (unboxed label). CD "last row can't reach the top":
  **fixed** (it doesn't need to). UX "gesture-gate risk": the card is outside
  the row, by design. UX "sheet collapsed when a pin is tapped": open
  question (the card needs the sheet open).
- **Weak spots:** in a long list the lifted row's old slot simply closes up,
  which may read as "it vanished from the list". Only ~1 row of context
  remains below a busy card. Actions sit before the note (see above).

### D. Fold + Dock (UX H1)

**One line:** the place docks as a card just above the list. It carries its
own name and type, a typical note whole, and the actions. More raises it
upward while the action row stays at the same y. The map has no box over the
pin.

- **Where things live:** the dock holds the badge (= the pin's seal), name,
  type, note (folds past 4 lines), FULL ADDRESS, and the action row. It sits
  22px above the sheet, so the © OpenStreetMap credit keeps its own band.
  The pin and the row are selected.
- **Density:** typical dock ~170px, busiest ~180px; raised, up to the top
  controls, scrolling inside. On open and on raise, the map pans the pin
  above the dock.
- **Truth list.** J1 dock header; J2 note in the dock; J3–J5 one tap at a
  fixed y (498) in the thumb zone; J6 type line; J7 × + map tap; J8 one tap;
  J10 list tap → dock. Hierarchy: name > note > stamp > Get Directions.
  Convention: Google Maps bottom card.
- **Review items:** UX "credit": **fixed**. UX "orphan dock": **fixed**
  (name in the dock). UX "autopan above the dock": **fixed**. UX "2-line
  peek": **fixed** (whole up to 4 lines). CD rescore "tier 1 split across two
  surfaces": **fixed** (everything is in the dock; no map label). CD "third
  layer stacked on the sheet": **not fixed.** That is the idea, and the CD
  killed it for that reason. I carried it because UX proposed it, and it is
  the only concept that keeps the full list visible while the map stays
  unboxed.
- **Weak spots:** three layers in the lower half (map, dock, list). The dock
  plus the selected figure-deep row restate the same place twice (CD S6).
  Pins under the dock can't be tapped while it's open.

## Cut this round

- **Glance → Read** (my new direction, drafted and rendered, then cut):
  a small glance card at the pin, with reading moved into the sheet. It
  answered the CD's "glance and read are different jobs". The owner's
  re-tiering put notes in the glance, and once the typical note shows whole
  it is Concept A with a different home for the long tail. Not distinct
  enough to cost the owner a look.
- **Row Unfolds as drawn in round 1** (unfolding in place, with a growing
  sheet): replaced by C, which keeps the idea and drops the growth and the
  scroll-under.
- Side Tab, Action Rail, Luggage Label, and Map Label + Dock as drawn in
  round 1: killed as ideas by both reviewers. The donors (on-map label,
  one-line address, seal = pin) are in B, C and D.

## How the UX / CD disagreement was resolved

- **Quiet Fix:** UX wanted it kept as the control, the CD wanted it merged
  into Fold. I **merged** it (A). A's unfolded state is the Quiet Fix, and a
  typical note now shows whole, so A is the control for typical places.
- **Map Label + Dock:** UX kept it, the CD killed it (tier 1 split, third
  layer). I **tried UX's H1** (D) with the CD's main objection removed (the
  name lives in the dock; no map label). The third-layer objection stands
  and is listed as D's weak spot. The CD's donor label went to B and C
  instead.
- **Place Sheet:** both kept it. I built **UX's H2** (fixed height). The
  owner's "replacing list with info is a fine thing to explore" means I
  did not soften the list replacement.
- **Row Unfolds:** UX killed it, the CD's rescore revived it. **Rebuilt as C**
  to remove every blocker UX named (no ×, growth, scroll-under, gate risk).
- **"Get Directions" vs "Directions":** kept the owner's copy and showed the
  other once. This is the owner's call.

## Owner questions (not decided here)

1. "Get Directions" or "Directions"? (`sheet/copy-directions`)
2. Signed-out viewers: Get Directions only, or Star/Visited that open
   sign-in, as today? (`sheet/signedout`)
3. Place Sheet (B): is a fixed 300px sheet with empty paper for name-only
   places right, or should the sheet size to its content (which moves the
   map edge between places)?
4. The selected list row is a solid orange block (shipped). Next to an open
   card it is the loudest thing on screen (A, D). Keep it, or quiet it while
   a card is open?
5. Concept C puts the buttons above the note so they never move when the
   note opens. Is that OK, given notes are tier 1?

## Not verified

- Chromium stills only. No gesture, timing, re-render (U1) or VoiceOver
  behaviour was run.
- Stand-in basemap: label collisions on real OSM tiles are unjudged (B, C).
- The harness has no Safari toolbar (`--chrome-bottom` = 0), so the
  `--sheet-under` padding in B is in the CSS but not visible in the stills.
