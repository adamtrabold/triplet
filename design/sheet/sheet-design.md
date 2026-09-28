# Sheet to the bottom edge: design and engineering notes

Base: `703fef5` (HEAD of /home/user/triplet). Deliverables: `sheet-proposed.diff`
(14 hunks, `git apply --check` clean on HEAD, and also clean on top of
`loop/visit/p8-proposed.diff`), `sheet-proto.html` (md5 `7c40cd51…`), and
`build.py` (regenerates the proto from `base.html`).

## Approach

This follows the pattern measured on the iPhone (viewport-test variant F):
`html, body { height: 100lvh }` with `body { position: relative }`, and the
bottom-anchored layers are `position: absolute` inside the body.

| Layer | Before | After | Why |
|---|---|---|---|
| `#locations` (sheet) | fixed, bottom 0, 300px | **absolute**, bottom 0, `300px + --chrome-bottom` | Reaches the physical bottom (956 standalone; behind the toolbar in a tab). The visible sheet stays 300px. |
| `#filtersPanel` | fixed, bottom 300 / 60+inset | **absolute**, bottom `300 + chrome` / `60 + sheet-under` | Must sit on the sheet's top edge, which is now in body coordinates. |
| `#authModal` scrim | fixed inset 0 | **absolute** inset 0, plus `padding-bottom: s4 + chrome` | A fixed scrim stops 62px short from the Home Screen and would leave the sheet unscrimmed. The padding centres the card above the toolbar. |
| `#mainContent` (map, `#controls`) | fixed, `bottom: 300px` (JS: `60px + inset`) | **stays fixed**, top 0, sized by **height** `100lvh − 300 − chrome` / `100lvh − 60 − sheet-under` | WebKit cuts short a fixed element's *bottom*; a fixed element's *top* is already correct (the map runs behind the status bar today). Keeping it fixed keeps Safari's tab status-bar tint sampled from the map (commit d64f446). |
| `#error`, `#floatingAddBtn`, `#accountBtn`, `#accountDropdown` | fixed, top | unchanged | These are top-anchored and already correct. Their safe-area-top offsets are untouched. |

There are no bottom toasts in the app.

The haptic switch (fixed, off-screen at −9999px) is untouched.

### Tokens

- **`--chrome-bottom`** is the toolbar allowance.
  - It is `0px` by default.
  - Under `@supports (height: 100lvh)` it becomes `max(0px, 100lvh − 100dvh)`, about 100px in a tab.
  - It is pinned to 0 by `@media (display-mode: standalone|fullscreen)` and by `:root.standalone`. That class is set by a one-line `<head>` script from `navigator.standalone`.
  - Why the pin: the Home Screen bug may make `100dvh` read short by the top inset. The formula would then mistake 62px for a toolbar.
- **`--sheet-under`** is `--chrome-bottom + env(safe-area-inset-bottom)`, which is everything the sheet runs under.
- **The collapse transform is unchanged** at `translateY(240px − inset)`. The extra height sits below the band it keeps on screen. The visible part is then `60 + chrome + inset`, so the 60px header band ends exactly at the top of the toolbar or home indicator.

### Collapse JS

The handler no longer writes an inline `bottom` computed from the removed
`--safe-area-inset-bottom` token. Instead it toggles
`#mainContent.sheet-collapsed`, and the geometry lives in CSS.

This also fixes a latent desync. Before, if you collapsed on a phone, resized
into the rail and back, the map sat at 300 while the sheet was still
collapsed. That path is now tested.

The rail listener's `style.bottom = ''` lines are left as harmless no-ops, so
this diff doesn't touch that block.

### No page scroll

- **Touch:**
  - body `overflow: hidden` propagates to the viewport, as it did before. iOS 16+ honours it for touch.
  - `overscroll-behavior: none` on html and body kills the rubber band.
- **Programmatic scroll:**
  - In a tab, the 100lvh root can be taller than `innerHeight`. Also, the collapsed sheet and the hidden filter panel now translate past the bottom in body coordinates. Before, they were fixed and didn't count.
  - So `focus()` on an off-screen filter chip *does* scroll the page. The control run without the guard measured a 205px jump, and 100px for a raw `scrollTo`.
  - `unscrollPage()` (on `scroll`, plus `focusout`) resets it to 0. It is skipped while an input, textarea, select or contenteditable has focus, so iOS can still lift a field above the keyboard.
- **Rejected: clipping at the root** (`html { overflow: hidden }` + body `overflow: clip`). It prevents the programmatic scroll structurally, but Impeccable then reports a 4th finding (`html clips a positioned child`).
- **Rejected: `contain: paint` on body.** It stops overflow propagation, which would make the viewport touch-scrollable. It also re-parents the fixed controls.

## Hunks (all layout/positioning CSS, the collapse handler, and layout JS; nothing in popup or row code)

1. `@@ -11` `<head>`: the `navigator.standalone` → `html.standalone` one-liner.
2. `@@ -141` `:root`: the `--safe-area-inset-bottom` token (only the collapse JS used it) is replaced by `--chrome-bottom` and `--sheet-under`, with a comment.
3. `@@ -202`:
   - The `@supports` formula, the standalone pins, and the layout-root comment.
   - `html { height: 100%/100lvh; overscroll-behavior: none }`.
   - `body`: `position: relative`, `overscroll-behavior: none`, and `height: 100vh/100lvh` (was `100vh/100dvh`).
4. `@@ -357` `#mainContent`: `bottom: 300px` becomes `height: calc(100vh|100lvh − 300px − chrome)`, plus the new `#mainContent.sheet-collapsed` rule.
5. `@@ -656` `#filtersPanel`: now absolute, with bottom and transform + chrome.
6. `@@ -674` `#filtersPanel.collapsed-mode`: `env(inset)` becomes `var(--sheet-under)`.
7. `@@ -797` `#locations`: now absolute, with height `300px + chrome`, and a comment.
8. `@@ -838` `.location-list-spacer`: height `var(--sheet-under)` (was `env(inset)`).
9. `@@ -1498` `#authModal`: now absolute, with a comment.
10. `@@ -1510` `#authModal`: `padding-bottom: s4 + chrome`.
11. `@@ -1619` rail `#locations`: `height: 100vh` becomes `auto` (top/bottom 0 in the 100lvh body).
12. `@@ -1627` rail `#mainContent`: adds `height: auto !important`.
13. `@@ -5238` collapse handler: the inline `bottom` code becomes a `classList.toggle('sheet-collapsed', …)`.
14. `@@ -5752` after the rail listener: the `unscrollPage` guard (`scroll` + `focusout`).

Considered and left out, to keep the diff off row code: `maybeTeachStar()`'s
"row on screen" test uses the list's rect. In a tab, a row fully behind the
toolbar would count as on screen. The one-line fix is
`lr.bottom - listSpacer.offsetHeight`. It is a follow-up for whoever next
touches the star code.

## Measured in Chromium (`geo.js`, 75/75)

| Mode | Emulation | Sheet bottom | Visible sheet | Expanded map bottom = sheet top | Collapsed band bottom | Collapsed map = sheet top | Last row bottom (scrolled to end) |
|---|---|---|---|---|---|---|---|
| Phone | 390×844 | 844 | 300 | 544 = 544 | 844 | 784 = 784 | 844 |
| Standalone | 440×956, CDP safe-area top 62 / bottom 34 | 956 | 300 | 656 = 656 | 922 (956 − 34) | 862 = 862 | 922 (clears the home indicator) |
| Tab | 440×836, `--chrome-bottom: 100px` | 836 | 300 above the toolbar | 436 = 436 | 736 (the toolbar's top) | 676 = 676 | 736 (clears the toolbar) |
| Desktop | 1280×800 | rail 0–800, 360 wide | | map 360..1280 × 0..800; Leaflet 920×800 | | | 800 |

All three phone-width modes also pass these checks:
- Filters panel bottom = sheet top, expanded and collapsed.
- The hidden filters panel is fully off-screen.
- The Leaflet size equals `#mainContent` after the collapse's `invalidateSize()`.
- The `.scrolling` mask comes on.
- Re-expand returns to the exact geometry.
- The auth scrim covers 0..H, and `elementFromPoint` at the bottom hits the scrim.
- The auth card is centred on `(H − chrome)/2`.
- scrollY stays 0.
- No page errors.

Formula checks:
- Raw `max(0px, 100lvh − 100dvh)` = 0 in Chromium, which covers desktop.
- `.standalone` pins a forced 62px to 0.
- In standalone, `--chrome-bottom` = 0 and `--sheet-under` = 34.

Other checks:
- Rail → phone while collapsed: the map still meets the band.
- Tall root (html/body 836 in a 736 viewport): wheel over the list, map and header never scrolls the page. The guard resets `scrollTo(0,100)` and a focused off-screen chip to 0. The no-guard control fails both, so the check has teeth.

What Chromium can't show is Safari's real lvh/dvh split. The tab row above
tests the math with the variable overridden. It doesn't show that Safari
reports that value.

## Scoped gate (per the owner's decision)

- **op-check:** proto result is identical to base: 56px rows, visited toggle, stamp tap navigates, delete deletes.
- **geo.js:** 75/75.
- **smoke.js:** 12/12. In phone, standalone and tab modes it checks that a list tap navigates, a star swipe commits, a visit swipe from the X side commits with 0 deletes, and a vertical list drag scrolls the list (~194px) with the page at 0.
- **popup-open:** 20/20, via `loop/star/sheet-popup-test.js` (the p8 popup-open test repointed to this proto), both motion modes.
- **Impeccable:** exactly 3 findings: 2× clipped-overflow-container and 1× cream-palette.
- **Extra, from an earlier iteration** with the same sheet CSS plus the since-dropped teach hunk:
  - Touch suite `test6.js` 84/84. The first run was 83/84, with a 0.1ms timing flake on S2; the rerun was 84/84.
  - `flip6` 8/8, with the control failing 4/4.
  - `vtest.js` gives identical results on base and proto. Both crash at `ssReplay` and fail V17/V24/V26, because that suite targets the in-flight p8 proto, not HEAD.

Coverage: no gesture, popup or row code changed. The smoke test proves that
the touch plumbing (EDGE guard, lock, `preventDefault`) still works inside the
re-parented sheet, in all three geometries.

## iPhone checklist (only a device can confirm)

1. **Home Screen:** the sheet reaches the very bottom, with no paper band. The collapsed header band sits just above the home indicator. The map still runs behind the clock.
2. **Home Screen:** collapse and expand. The map's bottom edge meets the sheet with no sliver of beige or overlap, at rest and after the animation.
3. **Safari tab:** list rows scroll *behind* the translucent toolbar. At the end of the list, the last row sits fully above the toolbar.
4. **Safari tab:** the collapsed band sits right on top of the toolbar, not under it and not floating above it. If it floats about 100px high, `100lvh − 100dvh` isn't the toolbar there; report the band's gap.
5. **Safari tab:** the status-bar strip still reads map-beige.
6. **Both modes:** dragging the header band, the map edge or the list end never moves the page and never rubber-bands the background.
7. **Both modes:** open the filters, expanded and collapsed. The panel sits flush on the sheet.
8. **Both modes:** the login modal's scrim covers the whole screen, including behind the toolbar. The card is centred. Focusing the password field lifts it above the keyboard. Dismissing the keyboard returns the page to 0 with no offset left behind.
9. **Rotate or resize,** and minimise the Safari toolbar if iOS ever does. The band follows the toolbar (dvh updates live), and the map re-meets the sheet.
10. **Regression spot checks:** a star swipe, a visit swipe and a list tap work. Popups open. The add form in `#controls` still clears the status bar.
