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

- **One ON tile in the band at a time** (director, scores.md). Opening the
  form closes the filters panel (its tile returns to outline) and the sort
  menu in the same beat. **Opening filters or sort while the form is open
  closes the form**, because the draft survives: today's ×/+ toggle only
  hides the form (`#controls`/`#addForm` lose `.show`). The fields are
  cleared only by `closeAddForm()`, which runs after a successful Add. The
  next tap on + reopens the form with the draft. The builder must close it
  through the toggle path, never `closeAddForm()`. *Ruling's fallback:* if
  the draft would be lost, filters and sort are disabled while the form is
  open instead. Either way, the band never shows two ON tiles.
- **Motion:** the + to × change is a **clean switch** of the field (no
  orange/navy blend at any frame: rest orange → press orange-deep → navy
  the moment the ride starts). Only the glyph's 45° rotation animates
  (0.3s, on the collapse timing). Close plays the reverse.
- The perforation never changes between states.
- Accessibility: `aria-label` "Add a place" at rest and "Close add form"
  when open, `aria-expanded` true/false. The tap target is the whole
  60×57 stub.

## Flows (the rulings applied)

1. **Add, list up.** Tap the stub. If filters or sort are open, they close.
   The form opens (`requireAuth` first, as today). **The list drops to its
   collapsed band** with the existing collapse transform and timing. The
   stub rides down with it. Its field switches to navy as the ride starts and
   its + rotates into × during the ride (one gesture). The form sits on the
   band (ADD LOCATION directly above the ×), with the map above it. Search, pick, ADD
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
9. **Escape / back** *(new; today Escape does nothing to the form; approved by the director as a desktop nicety, not owner-facing)*. Escape closes the form like the ×, when no field menu
   is open. iOS back-swipe is untouched (the stub is not edge-armed).

## Sizes

**Fix 1 (director): the form is anchored to the band.** While the form is
open, its bottom edge sits on the band, ADD LOCATION sits directly above
the ×, and the form grows upward. The map shows above it in whatever height
is left, and the OSM credit rides to the form's top edge.

| Viewport | Stub (rest) | Form open: stub (×) | ADD LOCATION | Add reachable |
|---|---|---|---|---|
| 390x844 (Home Screen) | y 544-601 | y 784-841 | **y 716-760** | yes, directly above × |
| 390x664 (Safari tab) | y 364-421 | y 604-661 | **y 536-580** | yes (**today: covered by the list**) |
| 390x844 + 34px inset, list collapsed | y 750-807 | y 750-807 (no move) | directly above the band (same rule) | yes |
| 375x667 / 320x640 | right-edge anchored, same | the band | directly above the band | yes |
| 1280x800 rail | x 298-358, y 0-57 | no move | in the map column, as today | yes |

- Add and × are now one thumb reach apart at every phone height.
- Short screens: if the form is taller than the space above the band, the
  form's top scrolls under the top edge. Add stays on the band. The visual
  designer checks the account badge against the form's top at 664.

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
| 3 Finish near the thumb | yes | the form is anchored to the band: ADD LOCATION directly above the × (y 716-760 at 844, y 536-580 at 664; today covered at 664) |
| 4 Don't lose my place | yes | flows 2 and 5: the pre-open state is restored, `play_cancel` verified |
| 5 Never in the way | yes | the stub is in the header, not over pins, the tag, names or row ×; the map's top-right is freer |
| 6 Signed out / playground | yes | flows 7 and 8, `signedout_tap`, `play_tap` |

Open items: the owner's Q1 (does the button ride down at all).

---

## Round 5 systems check: the "ticket" and its title cost (jam turn 16)

The structure is unchanged from round 3/4 (a 60px stub at the header's right
end, the drop on open, one ON tile). Only the look changed. Measured with
`r5.inc.html` injected into the real index.html in memory.

Script: `../r5-check/check.js` and `tap.js`. Numbers:
`../r5-check/measure.json` (key `A`) and `measure-tap.json`. 1x title
crops: `../r5-check/frames/A-title-*.png`.

**Title cost.** Today vs the ticket, header title width. All five cities;
stub data, so the count is (23).

| Width | Today | Ticket | What the ticket shows |
|---|---|---|---|
| 320 | 116px. Reykjavík, Copenhagen, Malmö and Stockholm already ellipsize ("…LIST (23)" cut) | **84px (−32)** | LA (23); Reykjavík; Malmö (both " list" and the count drop); **Copenhagen and Stockholm still ellipsize ("COPENHA…")** |
| 375 | 171px, everything in full | **139px (−32)** | " list" drops for Reykjavík, Copenhagen and Stockholm; LA and Malmö in full; no ellipsis |
| 390 | 186px, in full | **154px (−32)** | " list" drops for Copenhagen and Stockholm |

- The stub costs 60px, and the tighter icon spacing wins back 28, so the net
  is 32px at every width.
- At 320 the title loses its count in 4 of 5 cities. Two of them still cut
  the name, which today's header also does.
- Real counts go to 3 digits (Copenhagen 112), so the count drops sooner
  than shown here.
- Long plan names (Plans view) aren't measured: the stub data has no plans.
  The same drop order applies.
- **One cost line for the owner:** "the list title gets 32px shorter: 'list'
  goes first, and at 320 the count too."

**Other checks:**
- In `?play` the form opens with the drop.
  - 320x568: Add y 440–484, × y 508–565.
  - 375x667: Add y 539–583, × y 607–664.
  - Add hit-tests as itself at both.
- The visual designer's frames (`r5/measure.json`) are `chrome-check` clean:
  rest, open, tag, collapsed, 320.

**Job coverage (round 5): all six supported, no exceptions.**
1. Reach: yes in every state. Filters open: tapping it closes them. Tag open:
   it opens the form and cancel restores the tag.
2. Reads as the main action: yes (orange, the + printed heavier, in the
   thumb band).
3. Finish near the thumb: yes (Add directly above the ×).
4. Don't lose my place: yes (cancel restores the list, its scroll and the
   tag).
5. Never in the way: yes (it lives in the header, off the map). Its cost is
   the title, above.
6. Signed out / playground: yes (round 3/4 appendix).

---

## Round 6 (systems, jam turn 22): admission vs "tag cut", structurally

Checked on today's main (`../r6-check/a-check.js`, `measure-A.json`).

- **Same box, same cost.** Both routes are masks on the same `#nb`: 60x57
  at the header's right end (330,544 – 390,601 at 844; 260,268 – 320,325 at
  320). The title is unchanged: 154px at 390, and 84px at 320, where
  "Copenhagen" still ellipsizes. The cut corners and the eyelet still
  hit-test as the button, because a mask doesn't clip the hit area. That's
  good: no tap is lost to the die-cut.
- **The flows are unchanged.** In the playground the tap opens the form and
  adds. With a stale stored session it opens the sign-in sheet.
- **What the tag cut changes is the promise, not the plumbing:**
  1. **It moves A into C's object grammar.** The tag cut says "a place's
     tag", but tapping it opens a form panel, not a tag. The concept that
     actually turns + into a tag is C. Keep the tag cut and A and C share
     an object, with different flows behind it: they'd differ in look
     language less than in kind, which is the opposite of what the set
     needs.
  2. **"Tag" next to sort and filter icons reads as tags/labels**, a
     filter, in most apps. The tag cut sits in that exact row (sort,
     filters, locate, then the cut). The admission ticket has no such
     neighbour.
  3. **Two tags on screen:** with a starred tag open, the header's
     orange-banded tag shape and the place's orange-banded Hanging Tag are
     both visible. Tapping + closes the place's tag (the list drops), so
     they never clash in the form state. At rest, though, it's one tag that
     is a place and one that is a button.
- **Verdict (systems):** the tag cut is structurally sound but **costs A
  its difference in kind from C**. The admission route keeps A distinct.
  The director decides.
- **Coverage (round 6), unchanged:**
  - Job 1: yes, no exceptions.
  - Job 3: yes.
  - Job 4: yes.
  - Job 5: yes (title cost 32px).
  - Job 6: yes, against the playground.
