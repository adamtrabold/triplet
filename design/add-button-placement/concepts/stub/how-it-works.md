# Claim-check stub: how it works

Systems part of the concept. The look is the visual designer's (stills in
this folder). The rulings come from the director's jam turn 6. Jobs and
flows are in `../../jobs.md`. Appendix renders: `appendix/` (script
`appendix/render-appendix.js`, numbers in `appendix/measure.json`).

## Structure

- **+ moves from the map's top-right corner into the list header.** It sits
  at the header's right end as a 60px tear-off stub that runs to the screen
  edge, with the full height of the header band.
- It belongs to the list sheet. It rides the sheet's existing motions
  (collapse, the tag-fit `--sheet-lower`) like sort, filters and locate do,
  and never moves on its own.
- **The floating `#floatingAddBtn` is removed.** The account badge stays
  alone at top-right, same position and size. Signed out in the real trip,
  that corner shows what the sign-in crew decides (their Q1).
- The header's order, left to right: collapse ▼, title, sort, filters,
  locate, **stub**. The three icon tiles are spaced `--s1` apart (were
  `--gap`). The stub's centre is on the rows' × axis at every width (x 360
  at 390, x 290 at 320).
- **Title drop order** when space is short: " list" goes first, then the
  count, then the city (or plan) name ellipsizes. LA LIST (23) shows in full;
  COPENHAGEN (112) at 390; COPENHA… at 320. The copy itself doesn't change.
- **Desktop rail (>= 900px):** the same stub at the right end of the rail's
  header (x 298-358, y 0-57 at 1280). There is no drop on the rail (it has
  no collapse). The form opens in the map column as today
  (`appendix/desktop_*`).

## States

| State | Look (visual spec) | Meaning |
|---|---|---|
| Rest | brand-orange field, navy + | the primary action, ready |
| Pressed | orange-deep field, paper + | same as ADD LOCATION's press |
| Open (form showing) | navy ON tile, paper × | the header's ON state, like filters/sort open |
| Pressed while open | keeps the navy tile | header rule |
| Signed out | **identical to rest** | tapping offers sign-in (ledger: "visible, tapping offers sign-in") |
| Playground | identical to rest | adds, as signed in |
| Busy (submit in flight) | stays open; ADD LOCATION shows its own busy text as today | the stub isn't a second spinner |

- **One ON tile in the band at a time.** Opening the form closes the
  filters panel (its tile returns to outline) and the sort menu, in the
  same beat. Opening filters or sort while the form is open: the form stays
  open and the panel/menu opens over the list as today. *(Open, builder:
  the simplest consistent rule is that opening filters/sort closes the form
  the same way. I'd adopt that so the band never shows two ON tiles. It
  wants a confirm from the director.)*
- The perforation never changes between states.
- Accessibility: `aria-label` "Add a place" at rest and "Close add form"
  when open, `aria-expanded` true/false. The tap target is the whole
  60×57 stub.

## Flows (the rulings applied)

1. **Add, list up.** Tap the stub. If filters or sort are open, they close.
   The form opens (`requireAuth` first, as today). **The list drops to its
   collapsed band** with the existing collapse transform and timing. The
   stub rides down with it, its + turning to × during the ride (one
   gesture). The form fills the screen above the band. Search, pick, ADD
   LOCATION. On success the form closes and the list comes back to its
   previous position (up). *Then (owner Q2, recommended):* fly to the new
   pin, open its tag, select its row.
2. **Cancel.** Tap × (the stub). The form closes and the list returns to
   exactly the position it had before the tap (up or collapsed), with its
   scroll, selection and any open tag unchanged. Verified: the playground at
   664, open then cancel, puts the list back up and the stub back at y 364
   (`appendix/measure.json`, `play_cancel`).
3. **Add, list already collapsed.** Tap the stub in the bottom band.
   Nothing moves: the form opens above, the stub turns × in place, and
   cancel leaves the list collapsed (`appendix/safe_rest`, `safe_form`; the
   stub at y 750-807 both times).
4. **Filters open → +.** The panel closes, the list drops, the form opens,
   and the stub is the only ON tile (`appendix/filters_before`,
   `filters_after`: `panelOpen:false`, `onTiles:["nb"]`, and Add
   hit-tests as Add). This fixes today's bug where the form opened behind
   the panel. Cancel does **not** reopen the panel (it was a transient
   view; the filters themselves are kept).
5. **Tag open → +.** The form opens and the list drops. The tag is hidden
   behind the form, but the place stays selected. Cancel restores the tag
   open on the same place and the list position it had (including any
   `--sheet-lower` the tag set). After Add: owner Q2.
6. **Plans view.** The same stub, adding a *place* as today. The header
   names the plan, with the same drop order.
7. **Signed out.** Tap the stub and the sign-in sheet opens. The list does
   **not** drop and the stub doesn't go ON (nothing opened yet:
   `appendix/signedout_tap`, `onTiles:[]`). After a successful sign-in the
   user taps + again (today's behaviour; no auto-continue).
8. **Playground (`?play`).** Tap the stub and the form opens, with the drop.
   At 664 (Safari tab) Add is at y 450-494 and hit-tests as Add
   (`appendix/play_tap`).
9. **Escape / back** *(new; today Escape does nothing to the form)*. Escape closes the form like the ×, when no field menu
   is open. iOS back-swipe is untouched (the stub is not edge-armed).

## Sizes

| Viewport | Stub (rest) | Form open: stub (×) | ADD LOCATION | Add reachable |
|---|---|---|---|---|
| 390x844 (Home Screen) | y 544-601 | y 784-841 | y 450-494 | yes |
| 390x844 + 34px inset, collapsed | y 750-807 | y 750-807 (no move) | y 497-541 | yes |
| 390x664 (Safari tab) | y 364-421 | y 604-661 | y 450-494 | yes (**today: covered by the list**) |
| 375x667 / 320x640 | right-edge anchored, same | same | same | yes (the form is above the band) |
| 1280x800 rail | x 298-358, y 0-57 | no move | in the map column | yes |

- With the drop, Add sits where the form puts it (y ~470), not "just above
  the band". At 844 there's a strip of map between the form and the band.
  That's fine (it's where the new pin will appear) and needs no fill.
- **Keyboard up** (typing in Search): the keyboard covers the band and Add
  on every phone, as it does today. Picking a result or tapping Done drops
  the keyboard, and Add is in reach again. Out of scope (form scope = no
  change).

## Edge and error states

- **Add fails** (network, a geocode miss): the form stays open, the stub
  stays ×, the error shows as today, and the list stays dropped. Nothing is
  lost.
- **Add succeeds while the user scrolled the form**: the list returns to its
  remembered position, not to the scroll it had at the moment of submit.
- **Rotation / resize across 900px while open**: the rail has no drop. On
  crossing back to phone width the list re-drops if the form is still open.
  Builder detail.
- **An empty list** (filters matching nothing, a new city): the header and
  stub are unchanged, so + is the obvious next step there.
- **Loading** (before the auth state is known): the stub shows at rest
  straight away. Unlike the sign-in badge it's the same signed in or out,
  so there's no flash to avoid.

## Builder notes (not for the owner)

- Remove `#floatingAddBtn` from `pinPopupTopPad()` (~4927) and
  `planChrome()` (~6718). The account badge keeps the same top band, so the
  tag-open top pad is unchanged. The stub lives in the sheet, so plan fits
  and `TAG_SHEET_GAP` are untouched.
- The drop reuses `#locations.collapsed`. Remember the pre-open state on
  open and restore it on close, cancel or success. Don't fight
  `setSheetLower()`: on cancel with a tag open, re-run the tag fit rather
  than restoring a stale pixel value.
- "One ON tile" extends the existing panel/sort-menu exclusivity
  (`closeSortMenu(false)` in the filters handler).
- `setAddBtnGlyph()` targets the stub. The + to × is one glyph rotating
  45°, not an innerHTML swap mid-animation (visual spec).
- Row gestures and touch plumbing are untouched. The stub is a header
  button, not a row. The gesture gate isn't needed unless the header's
  touch handling changes.

## Coverage against jobs.md

| Job | Supported | Where |
|---|---|---|
| 1 Thumb reach in every state | yes | the stub is in the band list up (y 544), collapsed (y 750-784), with a tag open (rides `--sheet-lower`), in Plans, with filters open (`filters_before`), and on the rail |
| 2 Reads as the main action | yes | the only filled field in the band; no longer the account's twin |
| 3 Finish near the thumb | yes | × always in the band; Add at y ~470 and never covered at 664 or 667 (today covered) |
| 4 Don't lose my place | yes | flows 2 and 5: the pre-open state is restored, `play_cancel` verified |
| 5 Never in the way | yes | the stub is in the header, not over pins, the tag, names or row ×; the map's top-right is freer |
| 6 Signed out / playground | yes | flows 7 and 8, `signedout_tap`, `play_tap` |

Open items: the owner's Q1 (does the button ride down at all), and the
director's confirm on "opening filters/sort while the form is open closes
the form".
