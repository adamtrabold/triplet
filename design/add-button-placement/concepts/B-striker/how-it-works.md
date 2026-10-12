# B. Striker strip: how it works

Systems part of the concept (rough structural pass, director turn 7). The look
is the visual designer's: the frames in `frames/` are deliberately rough
(plain orange field, the app's submit type) and are not owner stills.

Prototype: `index.html` here is a **copy** of the real file with
`concept.inc.html` injected before `</body>`. `render.js` rebuilds the copy and
renders `frames/*.png` and `measure.json` (`node render.js`, `ONLY=<prefix>`).
The strip is wired to the app's own add path: `#floatingAddBtn`'s handler for
auth, playground and the draft-keeping toggle, and `#submitBtn`'s handler for
pins and shapes. A full add runs end to end: `done_664` adds 1 place and
closes the form.

## Structure

- **A full-width strip fixed to the screen's bottom edge, in every state.** It
  sits above Safari's toolbar in a tab (`bottom: var(--chrome-bottom)`) and
  takes the home-indicator inset into its own height from the Home Screen
  (56 + 34 = 90px). It never moves, except to ride above the keyboard (see
  Keyboard below).
- **It says what it does.** At rest it reads "+ ADD A PLACE". The words and
  the full width make it the main action. Either thumb reaches it, so it
  works for both people.
- **`#floatingAddBtn` is removed** and the account badge is alone at top-right
  (`right: var(--s4)`), the same as with the stub. Nothing changes for the
  sign-in crew.
- **The list header doesn't change.** Sort, filters and locate keep their
  spacing, and the title doesn't need the stub's drop order. At 320 the title
  has the width it has today.
- **The sheet sits on the strip.** I prototyped option B2: the sheet keeps its
  300px and its 4 visible rows, and the map gives up the strip's height. The
  other way (B1) is in the height budget below. The collapse offset becomes a
  plain 240px, because the strip now holds the inset. `.location-list-spacer`
  goes to 0, and the filters panel's `bottom` adds `--strip-h`.
- **Desktop rail (>= 900px):** the strip is the rail's foot (x 0-360,
  y 744-800 at 1280x800), and the form rises from it over the rail's list.
  The rail loses one row (12 visible, was 13).

## The add: one strip starts it and finishes it

| Strip state | Label (rough copy, visual's call) | Tap does |
|---|---|---|
| Rest | + ADD A PLACE | opens the form (sign-in sheet when signed out) |
| Open, nothing picked | PICK A PLACE FIRST, paper field, `aria-disabled` | nothing |
| Open, shape category, no name yet | TYPE A NAME TO TRACE | nothing |
| Open, ready | ADD HALLGRÍMSKIRKJA (the picked name, ellipsized) | submits through the app's own handler |
| Submitting | ADDING..., mirrors `#submitBtn` | nothing |
| After success | back to rest | — |

- **× is a 56px square at the strip's left end.** It appears only while the
  form is open. It uses today's toggle, so the draft survives:
  `cancel_664` shows a reopen still holds "Hallgrímskirkja" and the strip
  reads ADD HALLGRÍMSKIRKJA again.
- **The inactive state is the double-tap guard.** Because the start and finish
  are the same spot, a fast double tap opens the form and the second tap
  lands on an inactive strip. It never submits an empty draft. It also
  replaces today's `alert('Please provide name and address')`.
- The strip label names the place, so you can see what Add will do from the
  bottom edge without reading the form.
- `#submitBtn` is hidden, since the strip is the submit. The form's fields and
  their order are unchanged.

## The form rises from the strip

- `#controls` is moved to `body` so it stacks above the sheet. It is fixed,
  sits with its bottom on the strip, grows upward, and covers the list. **The
  list doesn't move**, so on cancel there's nothing to restore: scroll,
  selection and an open tag are untouched.
- Its height is capped so it never goes under the account badge. Measured:
  the form is 400px, at y 208-608 at 664 and y 388-788 at 844.
- At 844, **an open tag stays visible above the form** (`tagform_844`: tag
  y 114-346, form from y 388). At 664 the form covers the tag's foot.
- The OSM credit rides to the form's top edge so it stays on the visible map
  (y 191-208 at 664).
- Opening the form closes the filters panel and the sort menu first
  (`filters_844`: `panelOpen:false`).

## Keyboard (the director's check 4)

**Yes, it can ride the keyboard, by script.** iOS Safari doesn't resize the
layout viewport for the keyboard, and doesn't support
`interactive-widget=resizes-content`. So the strip and the form translate up
by `innerHeight - visualViewport.height - visualViewport.offsetTop` on the
`visualViewport` `resize` and `scroll` events. While the keyboard is up the
strip drops its inset padding (56px), and the form keeps Search at its top so
results drop into the form's own scroll.

- `kb_844` (Home Screen, keyboard drawn at 336pt): strip y 452-508, right on
  the keyboard. Results y 256-452, 4 rows visible.
- `kb_664` (worst case: a 664 layout with the keyboard on top): strip
  y 272-328, Search y 88. Only about 2.5 results are visible above the strip
  (y 141-272).
- **This is a Chromium emulation.** I faked `visualViewport` and drew the
  keyboard. Real iOS behaviour is unverified: the strip lags during the
  keyboard's slide-in (`visualViewport` fires after it), and Safari may
  scroll the page when the field gains focus. **This needs an iPhone check
  before anyone promises it.**
- **What's unique to B:** with a place picked, ADD is reachable while you're
  still typing Notes. No other concept does that.

## Height budget (the director's objection 1: "extra height")

| 390 wide | Today | Stub | B2 (prototyped: the map pays) | B1 (the list pays, computed) |
|---|---|---|---|---|
| 664 list up: map / rows | 364 / 4 | 364 / 4 | **308 (-15%)** / 4 | 364 / **3** |
| 844 list up: map / rows | 544 / 4 | 544 / 4 | 488 (-10%) / 4 | 544 / 3 |
| 844 Home Screen, collapsed: chrome at bottom | band + inset = 94 | 94 | **band 60 + strip 90 = 150** | 150 |
| 320x568 list up: map | 268 | 268 | 212 (-21%) | 268, rows 3 |

**The cost is real and permanent.** It's 56px in every state, and stacking is
the worst case: collapsed shows two bars, the band and the strip
(`collapsed_safe`), which is the director's "two stacked toolbars" read. In a
Safari tab it's three: band, strip, then Safari's toolbar (`tab_664`, with the
toolbar drawn). Neither the stub nor C pays any of this. Whether the strip and
the collapsed band can merge (say, the strip carries the band's controls when
collapsed) is open for the visual designer. It would need the strip to change
with the state, which goes against "never moves / never changes".

## Flows

1. **Add, any state.** Tap the strip. Filters and sort close, and the form
   rises from the strip while the list stays put. Search, pick: the strip
   names the place. Tap the strip again. The form closes, and the list is
   where it was. *(Owner Q2, flying to the new place, still applies; B
   doesn't answer it.)*
2. **Cancel:** tap ×. The form hides, the draft is kept, and nothing else
   moved.
3. **List collapsed:** the same. The form rises above the strip and covers
   the band.
4. **Tag open:** the form rises, and at 844 the tag stays visible above it.
   Cancel and nothing changed.
5. **Filters open:** the panel closes, then the form opens.
6. **Plans:** the same strip, adding a place.
7. **Signed out:** tap and the sign-in sheet opens (`signedout_tap`). The strip
   doesn't go to the open state.
8. **Playground:** adds (`done_664`).
9. **Desktop:** the strip at the rail's foot, and the form rises over the
   rail.
10. **Escape** closes the form like × (the stub's ruling applies).

## Edge and error states

- **Add fails** (geocode miss, network): the form stays, the strip returns from
  ADDING... to ADD <NAME>, and the error shows as today.
- **New-city prompt / shape-city confirm:** these show inside the risen form
  as today. The strip goes back to ADD <NAME> once the submit returns, and
  the confirm's own buttons finish it.
- **A long name:** the strip ellipsizes ("ADD HALLGRÍMSKIRKJA" fits at 320,
  `cph_320_open`).
- **Empty list / a new city:** the strip is unchanged.
- **Rotation across 900px:** the strip moves between the screen's foot and the
  rail's foot. Builder detail.

## Builder notes

- Remove `#floatingAddBtn` from `pinPopupTopPad()` and `planChrome()`.
- Add `--strip-h` to the sheet's `bottom`, `#mainContent`'s heights, the
  filters panel's `bottom`, and `tagSheetNeed()`'s under-allowance (it reads
  `listSpacer`, which is now 0).
- `TAG_SHEET_GAP` is unchanged, because the tag sits above the sheet and the
  strip is below it.
- The `visualViewport` handler is new code, and needs a debounce and an iPhone
  check.
- No row gestures are touched.

## Coverage against jobs.md

| Job | Supported | Where |
|---|---|---|
| 1 Thumb reach in every state | **yes, the strongest of the set** | the same spot in every state: list up or down, tag, filters, Plans, rail. Handedness-free |
| 2 Reads as the main action | yes | the only full-width, worded control |
| 3 Finish near the thumb | **yes** | finish = the same strip; with the keyboard up too (iPhone check) |
| 4 Don't lose my place | yes, trivially | the list never moves; the draft survives × |
| 5 Never in the way | yes, but it costs | it sits on nothing, yet it takes 56px of map (B2) or a row (B1) for good |
| 6 Signed out / playground | yes | `signedout_tap`, `done_664` |

**Verdict: alive.** It works in the real app, end to end. Its risk is taste,
not structure. The owner's "no extra header height" applies in spirit (+56px
of chrome, 150px of stacked chrome when collapsed), and so does "a generic
checkout bar". Both are for the visual designer and the director.
