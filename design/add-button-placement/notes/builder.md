# Builder notes: the + becomes the Float badge (button only)

Round 1, 2026-10-15. Branch `plus-badge-build` (from origin/main). Source: `../handoff.md`
(on `claude/elegant-galileo-1c5ntm`). Not landed: waits for the combined CD + UX check and the
owner's yes. Stills and measurements: `../build/` (re-shoot with `build/stills.js`, re-measure
with `build/measure.js`; both use the gesture-harness stub).

## What's built (index.html)

- **Look:** `#floatingAddBtn` has its own CSS block. The `#floatingAddBtn, #accountBtn` twin block
  is split, and the account keeps its 50px navy 14-lobe badge untouched. The add badge is 60x60,
  brand orange plus `--tex-flood` (160px, -23px -71px), with a navy + at 26.4 / stroke-width
  1.8182 (2.00px). Its mask is the 24-lobe polygon in a 60 viewBox: the handoff's points, checked
  against the formula (all 240 points identical). `ADD_SCALLOP_PTS` in JS holds the same polygon
  for the focus ring `#addFocus`, a sibling right after the button, like `#accountFocus`. States:
  - pressed: deep orange, paper +;
  - `.active`: navy, paper ×, no texture;
  - `.active:active`: `--state-on-press`.

  The box-shadow is dropped (the mask clipped it anyway).
- **Tokens:** `--add-size` 60, `--add-ink-inset` 4.68, `--add-ink-gap` 19.9, `--add-box-gap` =
  gap - inset (15.22). Everything that knows where the badge is derives from these (its position,
  and Add's margin and padding).
- **Riding:** the badge is `position: absolute` in the 100lvh body, exactly like `#locations`:
  - `bottom: calc(300px + var(--chrome-bottom) + var(--add-box-gap))`;
  - the same `translateY(var(--sheet-lower))`;
  - when collapsed, the same `translateY(calc(240px - env(safe-area-inset-bottom)))`;
  - `transition: transform 0.3s ease`.

  Collapse is read from `body.sheet-collapsed`, toggled in the collapse handler. That handler is
  now a named function, `toggleSheetCollapsed()`, and `#collapseBtn.onclick` calls it. The badge
  is deliberately not inside `#locations`: that would put it in the sheet's z 1000 stacking
  context, above the filters panel (999), which must cover it. The badge is z 998.
- **Desktop (>=900):** `left: calc(360px + gap)`, `bottom: gap`, no transform.
- **Account:** `--account-slot-right` = `var(--s4)`; the button, its ring and the dropdown follow.
- **`tagSheetGap()`** replaces the `TAG_SHEET_GAP` const. It reads the rendered box:
  `ceil(edge - badge.top + 12)` = 88, where edge is the `#locations` top on a phone or the map's
  bottom on the rail. Floor 48 (the old dial). Used by `tagFit()` and `tagSheetNeed()`.
- **`pinPopupTopPad()`** no longer lists `#floatingAddBtn`. `planChrome()` keeps it.
- **Ride:** `openAddForm()`, `rideBack(reopenTag)` and `showAddForm(open)` wrap the existing
  toggle.
  - `addRestore = { collapsed, scroll, tag }`. With a tag open, scroll is `tagSession.scroll`,
    the list's scroll from before the tag.
  - Cancel re-expands the list, restores its scroll, then, after the 300ms ride, clicks the row
    (`rowEntry(key).el.click()`, the list's own path).
  - `closeAddForm()` calls `rideBack(false)`, so no tag reopens after an Add.
  - Esc cancels. It's skipped while the autocomplete, the sign-in sheet, the sort menu or a tag
    owns Esc.
- **Form on the band** (`body.add-open #controls`):
  - absolute, bottom 0, in `#mainContent`;
  - padding-top `--s6`, with the navy 2px top rule from the round-7 prototype stills;
  - max-height `100% - 74 - 12 - --chrome-top-inset`, and it scrolls.

  ADD LOCATION:
  - sticky, bottom 0;
  - `margin-left` = box right + 12 - 56 (31.22);
  - padding-bottom centres it on the × (`gap + size/2 - 22`);
  - six paper box-shadows make the full-row backing (to the right edge, behind the ×, down to
    the foot) without covering the star row above.
- **Credit:** `syncAddCredit()` runs from a ResizeObserver on `#controls` and after collapse.
  - It lifts `.leaflet-bottom.leaflet-right` by the form's height.
  - It sets `body.add-credit-off` when less than 74 + 12 + 17 + inset of map is left.
  - Prefix: `setPrefix(false)` below 338px of map width (`map.on('resize')`); the original
    prefix comes back above that.

## Measured (Chromium, stub, 3x): all match the handoff

| State | Badge box | Other |
|---|---|---|
| 390x844 up | 15.2,468.8–75.2,528.8 | ink left 19.9, ink foot 19.9; credit clear 63.7 |
| 390x664 | 15.2,288.8–75.2,348.8 | |
| 375x667 | 15.2,291.8–75.2,351.8 | credit clear 48.7 |
| 320x568 | 15.2,192.8–75.2,252.8 | credit "© OpenStreetMap contributors", clear 58.7 |
| Collapsed, Home Screen | 15.2,674.8–75.2,734.8 | band 750 |
| Desktop 1280x800 | 375.2,724.8–435.2,784.8 | |
| Form 844 | 15.2,708.8–75.2,768.8 | Add 87.2,716.8–374,760.8, centre dy 0 |
| Form 664 | 15.2,528.8–75.2,588.8 | Add 87.2,536.8–374,580.8 |
| Form 320 | 15.2,432.8–75.2,492.8 | Add 87.2,440.8–304,484.8, credit stepped out |
| Tag open | gap 88 | foot clears the badge by 16.8 (664) and 12.8 (320; the handoff's 13.8 used a different tag height); rows 4 / 3 / 1 |

Other checks:
- **Ride in step:** the badge foot to the sheet edge, sampled every rAF through the drop, was
  15.22 on all 29 frames.
- **Cancel:** from a tag, the same tag (rey01) comes back with the list up. From scroll 200,
  scroll 200 comes back.
- **Stale sign-in:** the sign-in sheet opens and the badge stays at rest.
- **Filters open:** the panel is what's hit at the badge's centre.
- **Sort open:** the first tap closes the sort menu (the scrim takes it); the second opens the
  form.

## Decisions and why

- **Add's left edge.** The handoff's text says "the ×'s rendered ink right + 12", but its
  numbers (87.2, and "Add's 31px step") are the **box** right + 12. Built to the numbers (the
  approved stills). Ink right + 12 would be 82.5.
- **Keyboard open with the filters panel up.** Opening the form by keyboard closes the panel
  first (the prototype did). To a finger the panel covers the badge, so this only matters for
  keyboard.
- **Desktop.** It uses the same ride layout: the form sits at the bottom of the map column with
  Add on the ×'s line, and the badge turns × in place (nothing rides on the rail). Today's form
  opens at the top on desktop. FLAGGED for the designers / owner (still 17).

## Open gaps

- The desktop form position (above): a call for the designers.
- The handoff's "the sign-in crew should be told" (the account badge moved): not mine to send.
- iPhone checks are in `docs/iphone-checks.md`.
- The brief asked for these notes and the stills in the shared checkout's
  `design/add-button-placement/`. The isolated worktree's Write tool refused that path. The
  notes live here on `plus-badge-build`. The stills are in both places: the node render wrote
  them to the shared checkout, and copies are committed here.
