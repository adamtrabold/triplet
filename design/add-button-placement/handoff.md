# Handoff: the + becomes the Float badge (button only)

Owner, verbatim (2026-10-15):
- "I think it's the badge for now. Conceptually it's stronger because
  the circle relates to the icon, the tag isn't really what you're
  adding it's the pin"
- "Just button for now"

**Scope.** This handoff covers the **button only**: the orange 60px badge
with a navy +, at the bottom-left of the map, opening **today's add form**.
The blank-tag form is still in design and is **not** part of this build.

## How it works

*Systems (product designer, systems focus), 2026-10-15.*

Numbers are from the real app (today's main):
- `concepts/r7-check/float-left.js` and `measure.json`;
- `concepts/r6-check/` (`TAG_SHEET_GAP`);
- `concepts/r10-check/` (rank and coverage on the real 202 pins).

Stills: `concepts/E-float/R7-F1`…`F6` (form open) and `F1`…`F7` (rest,
real size, squint, tag open, sizes, pressed). Ignore F4/F5 captions that
describe the blank-tag form; for this build the form is today's.

### Structure

- **One button, `#floatingAddBtn`, moves from the top-right to the
  bottom-left of the map.** It keeps its id, its handler (the `onclick`
  at ~8881: `requireAuth()`, `syncAddFormCity()`, toggling `#controls` /
  `#addForm` / `.active`) and its +/× glyph swap (`setAddBtnGlyph`).
- **The look is visual's (`concepts/E-float/looks-and-feels.md`):**
  - a 60 × 60 box with the badge's scalloped edge;
  - brand orange with a navy + (3px stroke);
  - drawn at 60px, **not** with `transform: scale()`, so layout code sees
    the real box and the edge is crisp on iOS.
- **Placement** (aligned by ink, not by box):
  - **the ink's left edge is 19.9px from the screen's left**, 0.9px from
    the list rows' category rings: the owner's "one left channel";
  - **the ink's bottom is 19.9px above the list's top edge.**
  - The box is 15.2–75.2 wide.
- **It rides the list's top edge.** It's positioned in CSS from the
  sheet's position, not by JS polling. It moves with the sheet's own
  `transform 0.3s ease`, so it's never a separate motion. That covers list
  up, collapsed, lowered for an open tag, and dropped for the form.
- **The account badge** (`#accountBtn`, `#accountDropdown`) moves from
  `right: 74px` to `right: var(--s4)` and owns the top-right corner alone.
  The sign-in crew should be told.

### Positions (box x1,y1 – x2,y2)

| State | Box |
|---|---|
| 390x844, list up | 15.2,468.8 – 75.2,528.8 |
| 390x664 (Safari tab), list up | 15.2,288.8 – 75.2,348.8 |
| 375x667 | 15.2,291.8 – 75.2,351.8 |
| 320x568 | 15.2,192.8 – 75.2,252.8 |
| List collapsed, Home Screen (34px inset) | 15.2,674.8 – 75.2,734.8 (the band starts at 750) |
| Desktop 1280x800 | 375.2,724.8 – 435.2,784.8 (the map column's bottom-left, 15.2 from the rail) |

### States

| State | What the badge does |
|---|---|
| **Rest** | Orange, navy +. Rides the sheet edge. |
| **Pressed** | `--brand-orange-deep`, paper +. |
| **Open (the form is showing)** | **Navy field, paper ×** (`.active`, director ruling 5): the one cancel. Open + pressed: `--state-on-press`, paper ×. |
| **List up / collapsed** | Rides the edge. From collapsed, tapping + moves nothing (the list is already down). |
| **A place's tag is open** | **Stays visible and tappable.** `TAG_SHEET_GAP` goes from 48 to **88** (the badge box's top above the list edge, 75.2, plus 12, rounded up; derive it from the box, not a constant). The tag's foot clears the badge by 16.8 at 664 and 13.8 at 320. List rows with a tag open: 844: 4; 664: 3; 375x667: 3; **320: 1 (today 2)**, the one cost. Tapping + closes the tag and opens the form; cancel reopens the same tag. |
| **Filters panel open** | **Under the panel, not tappable** (the panel lies over the sheet's top edge). Close the filters to add: one extra tap. It does **not** ride the panel's top: at 664 that lands off-screen. |
| **Sort menu open** | Tapping + closes the sort menu first (one overlay at a time). |
| **Signed out (the playground)** | The same badge. + opens the form and adds as signed in; nothing is kept after a reload. |
| **Stale stored sign-in** | Tapping + opens the sign-in sheet (`requireAuth()`). Nothing moves, and the badge doesn't go to its open state. |
| **Plans view** | The same badge; + adds a place (not a stop), as today. `planChrome()`/`planSafeBox()` read its rendered box. |
| **Keyboard up (typing in the form)** | The badge is the form's × and sits on the band, behind the keyboard while it's up, exactly like the form's other low controls today. Not a new state. |

### Interactions: tapping + opens today's form ("ride", form line A, both ruled in round 7)

1. Tap +:
   - a stale stored sign-in → the sign-in sheet, and stop;
   - otherwise, if the sort menu is open, it closes;
   - if a place's tag is open, it closes, remembered for cancel.
2. **The list drops to its band.** The badge rides down with it and turns
   × (navy, paper ×), at y 708.8–768.8 at 844 and 528.8–588.8 at 664.
3. **Today's form (`#controls` + `#addForm`) sits on the band**, not at
   the top. `#controls` becomes `position: absolute; bottom: 0` inside
   `#mainContent`.
   - Its `max-height` stops below the top row (zoom and account).
   - It scrolls inside itself when it's taller than the room.
   - `#submitBtn` is sticky.
   - Its paper backing spans the full row, so a scrolled field never
     shows beside the ×.
4. **ADD LOCATION shares the ×'s line (form line A):**
   - left edge = the ×'s rendered ink right + 12;
   - right edge = the fields' right line (374 at 390);
   - vertically centred on the ×'s rendered centre;
   - read from the badge's **rendered box**, not hard-coded 50px numbers
     (otherwise Add stops 2.8px from the × and sits 4.2px low);
   - result: x 87.2–374, y 716.8–760.8 at 844; 536.8–580.8 at 664; at
     320, 87.2–304 × 440.8–484.8, sticky.
   - The other fields keep their 56px spine. Add's 31px step off it is
     the action row's own start (director ruling).
5. **The OSM credit rides the form's top edge** while the form is open.
   Where no map strip is left (320x568) it steps out, as it does for the
   sort menu today (`body.sort-open` rule).
6. **Cancel (tap the ×)** puts everything back:
   - the list (up or collapsed) and its scroll;
   - the badge (back to its rest box);
   - **the tag that was open, on the same place** (via the list's own
     row-tap path);
   - **the draft, which survives** as today: the toggle only hides the
     form; `closeAddForm()` clears it only after a successful Add.
7. **Add succeeds:** `closeAddForm()` runs as today. The list comes back,
   and the badge returns to rest (+).
8. **Desktop:** Esc closes the form (approved earlier as a nicety). The
   ride there is unmeasured. The builder checks where today's form opens
   on wide screens, and keeps the badge in the map column, turning × in
   place.

This also fixes a pre-existing bug: today, below about 790px tall
(Safari tab, SE), the list covers ADD LOCATION. With the ride, Add is on
the band line at every height.

### What replaces today's top-right +

- `#floatingAddBtn` leaves the top-right corner. Nothing takes its slot;
  the account badge moves into it (`right: var(--s4)`).
- The `right: var(--s4)` positioning and `top: … --chrome-top-inset`
  rules for `#floatingAddBtn` (~371-400) go. The new position is
  bottom-left, sheet-relative.
- `#floatingAddBtn` and `#accountBtn` no longer share the twin-badge
  CSS block for position; they keep sharing the mask polygon, and the
  badge's look is visual's.

### Collisions and the code that knows about corner controls

| Thing | Rule | Measured |
|---|---|---|
| **OSM credit** (Leaflet's default `bottomright`; drop any `setPosition('bottomleft')`) | **`map.attributionControl.setPrefix(false)` when the map is narrower than 338px**; keep "Leaflet \|" at 338 and wider. "© OpenStreetMap contributors" always stays, verbatim. | Clear by 63.7 at 390 and 48.7 at 375. At 320 it overlaps by 6.3 with the prefix and is clear by 58.7 without it |
| **Account badge** | The opposite corner; no shared line. | 222.8px apart vertically at 664 |
| **Zoom control** (top-left) | The same side, never touching: zoom's left 12, the badge's ink 19.9. | 395 / 215 / 119px apart vertically at 844 / 664 / 320 |
| **Map pins** | A 60 × 60 dead zone on the map. | 0 real pins under it at every city's opening view (5 cities × 4 sizes × list up / collapsed, the real 202 pins). Street zoom: covers at least one pin in 12% / 13% / 16% / 3% of views (Copenhagen / Stockholm / Malmö / LA); panning frees it |
| **Row delete ×** | The badge is above the sheet edge, never over the list. | — |
| **`pinPopupTopPad()`** (~5402): the list at ~5406 | **Remove `#floatingAddBtn`** from the list. It's no longer a top control, and left in, a tag would open below a bottom badge. | |
| **`TAG_SHEET_GAP`** (~5448, today 48) | Make it a value derived from the badge's rendered box: box top above the list edge + 12, which is **88**. | rows above |
| **`planChrome()` / `planSafeBox()`** (~7195-7204): the list at ~7197 | **Keep `#floatingAddBtn` in it.** It now guards the bottom-left, and plan fits avoid it with no other change. | |
| **Filters panel** | Covers the badge (by design). | — |
| **iOS back swipe (Safari tab)** | The box starts 15.2px from the left edge. **iPhone check:** a tap on the badge's left third never starts a back navigation, and a back swipe from x < 15 doesn't press it. Not an issue in the Home Screen app. | — |

**Gates for the build:**
- the Impeccable gate;
- the gesture gate does **not** apply (no row gestures are touched);
- **iPhone checks** for `docs/iphone-checks.md`:
  - it rides in step with the sheet (no lag);
  - the 60px masked edge renders crisp;
  - the back-swipe edge;
  - the 320 credit without the prefix;
  - the form on the band with the keyboard up (sticky Add stays
    reachable).

### Check against jobs.md (the + jobs, 1-6)

| Job | Supported? | Where |
|---|---|---|
| 1 Reach with your thumb, every state | **Yes, with one exception: the filters open** (close them first, one tap). With a place's tag open it stays tappable (gap 88). The left is the owner's side. | States table; R7-F3, F5 |
| 2 Main action, above the account | **Yes:** 1.34 / 1.33x the account's squint weight on the real render; alone in its corner, opposite the account. | `r10-check/float.js`; F2, F3 |
| 3 Know what you're about to fill out *(inferred)* | **Partly, accepted by the owner.** The badge opens today's form, not a tag. His reason for choosing it is that the circle relates to the pin icon (what you add is a pin). That's the job read his way. | Owner's words above |
| 4 + never gets in your way | **Yes:** 0 pins at the opening views; the credit rule; the tag gap 88; never over rows or the delete ×. | Collisions table |
| 5 + is for the whole trip | **Yes:** + lives on the map, not in the list's bar. Today's form starts with City, which scopes the search, so adding to any city works as it does today. | Structure; today's `#cityInput` |
| 6 Works signed out | **Yes:** the playground adds; a stale sign-in asks, and nothing moves. | States table |

**No unsupported job.** Two costs go to the owner as they stand:
- the filters-open extra tap;
- 1 list row instead of 2 at 320 with a tag open.

## How it looks and feels

*Visual (product designer, visual focus), 2026-10-15.*

**Reference still:** `concepts/E-float/X1-build-spec-3x.png`. It shows the
build spec drawn natively at 60px (top row "Build" and the four states),
next to round 7's render, which it matches, and next to the account badge.

**Read this first: the stand-in.** The frames the owner saw last (round
10's `E-float/F1`-`F7` and round 11's `C-tag-r11/T3way-*`) drew a
**stand-in**: the account's own 14-lobe edge, flat orange and a 30px +.
**Build the round 6/7 badge**: the finer edge, the paper texture and a
26.4px +, which is what's specified below. The owner said in round 6 that
he liked the finer edge, and it was never retired. The difference is small
at real size (X1, top row).
- Open question for the owner, optional: if he prefers the stand-in's
  larger + and plainer edge, swap three values (the mask, `background-image:
  none`, and an svg size of 30). Nothing else changes.

### The badge (rest)

- **Box:** 60 × 60, drawn at 60. No `transform: scale()` (systems).
- **Edge:** a finer cut of the badge family's scallop.
  - 24 small round lobes, 2.04px deep.
  - The outer radius is 25.32 in a 60 box, centred, so the ink sits
    4.68px inside the box on every side. That's how systems' "ink 19.9"
    comes out of "box 15.2".
  - It's a CSS mask (`mask-size: 100% 100%`, no repeat), the same mechanism
    as today.
  - Formula, for the record: r(t) = 25.32 - 2.04·(1 - cos 24t)/2, 240
    points.
  - Precomputed, so there's no build step. Use this as the polygon's
    `points` in a `viewBox='0 0 60 60'` SVG data URI, for both
    `-webkit-mask-image` and `mask-image`:

    ```
    30.00,4.68 30.66,4.88 31.29,5.42 31.88,6.09 32.45,6.65 33.04,6.92 33.67,6.81 34.37,6.42 35.12,5.92 35.87,5.57 36.55,5.54 37.14,5.91 37.61,6.59 38.01,7.39 38.41,8.08 38.91,8.49 39.55,8.55 40.33,8.35 41.18,8.07 41.99,7.92 42.66,8.07 43.13,8.58 43.41,9.36 43.59,10.23 43.80,11.01 44.17,11.53 44.77,11.76 45.58,11.76 46.47,11.71 47.30,11.77 47.90,12.10 48.23,12.70 48.29,13.53 48.24,14.42 48.24,15.23 48.47,15.83 48.99,16.20 49.77,16.41 50.64,16.59 51.42,16.87 51.93,17.34 52.08,18.01 51.93,18.82 51.65,19.67 51.45,20.45 51.51,21.09 51.92,21.59 52.61,21.99 53.41,22.39 54.09,22.86 54.46,23.45 54.43,24.13 54.08,24.88 53.58,25.63 53.19,26.33 53.08,26.96 53.35,27.55 53.91,28.12 54.58,28.71 55.12,29.34 55.32,30.00 55.12,30.66 54.58,31.29 53.91,31.88 53.35,32.45 53.08,33.04 53.19,33.67 53.58,34.37 54.08,35.12 54.43,35.87 54.46,36.55 54.09,37.14 53.41,37.61 52.61,38.01 51.92,38.41 51.51,38.91 51.45,39.55 51.65,40.33 51.93,41.18 52.08,41.99 51.93,42.66 51.42,43.13 50.64,43.41 49.77,43.59 48.99,43.80 48.47,44.17 48.24,44.77 48.24,45.58 48.29,46.47 48.23,47.30 47.90,47.90 47.30,48.23 46.47,48.29 45.58,48.24 44.77,48.24 44.17,48.47 43.80,48.99 43.59,49.77 43.41,50.64 43.13,51.42 42.66,51.93 41.99,52.08 41.18,51.93 40.33,51.65 39.55,51.45 38.91,51.51 38.41,51.92 38.01,52.61 37.61,53.41 37.14,54.09 36.55,54.46 35.87,54.43 35.12,54.08 34.37,53.58 33.67,53.19 33.04,53.08 32.45,53.35 31.88,53.91 31.29,54.58 30.66,55.12 30.00,55.32 29.34,55.12 28.71,54.58 28.12,53.91 27.55,53.35 26.96,53.08 26.33,53.19 25.63,53.58 24.88,54.08 24.13,54.43 23.45,54.46 22.86,54.09 22.39,53.41 21.99,52.61 21.59,51.92 21.09,51.51 20.45,51.45 19.67,51.65 18.82,51.93 18.01,52.08 17.34,51.93 16.87,51.42 16.59,50.64 16.41,49.77 16.20,48.99 15.83,48.47 15.23,48.24 14.42,48.24 13.53,48.29 12.70,48.23 12.10,47.90 11.77,47.30 11.71,46.47 11.76,45.58 11.76,44.77 11.53,44.17 11.01,43.80 10.23,43.59 9.36,43.41 8.58,43.13 8.07,42.66 7.92,41.99 8.07,41.18 8.35,40.33 8.55,39.55 8.49,38.91 8.08,38.41 7.39,38.01 6.59,37.61 5.91,37.14 5.54,36.55 5.57,35.87 5.92,35.12 6.42,34.37 6.81,33.67 6.92,33.04 6.65,32.45 6.09,31.88 5.42,31.29 4.88,30.66 4.68,30.00 4.88,29.34 5.42,28.71 6.09,28.12 6.65,27.55 6.92,26.96 6.81,26.33 6.42,25.63 5.92,24.88 5.57,24.13 5.54,23.45 5.91,22.86 6.59,22.39 7.39,21.99 8.08,21.59 8.49,21.09 8.55,20.45 8.35,19.67 8.07,18.82 7.92,18.01 8.07,17.34 8.58,16.87 9.36,16.59 10.23,16.41 11.01,16.20 11.53,15.83 11.76,15.23 11.76,14.42 11.71,13.53 11.77,12.70 12.10,12.10 12.70,11.77 13.53,11.71 14.42,11.76 15.23,11.76 15.83,11.53 16.20,11.01 16.41,10.23 16.59,9.36 16.87,8.58 17.34,8.07 18.01,7.92 18.82,8.07 19.67,8.35 20.45,8.55 21.09,8.49 21.59,8.08 21.99,7.39 22.39,6.59 22.86,5.91 23.45,5.54 24.13,5.57 24.88,5.92 25.63,6.42 26.33,6.81 26.96,6.92 27.55,6.65 28.12,6.09 28.71,5.42 29.34,4.88
    ```

  - **The account keeps its own 14-lobe mask.** The shared mask rule in the
    `#floatingAddBtn, #accountBtn` block splits: each gets its own.
    `SCALLOP_PTS`' comment ("change both together") then only applies to
    the account. Update the comment.
  - In captions and comments call it "a finer cut of the badge's edge",
    never a "postage stamp" (stamps are VISITED's language; director
    ruling).
- **Field:** `background-color: var(--brand-orange)` (#EE7434) with the
  paper tooth `background-image: var(--tex-flood)`.
  - `background-size: 160px 160px; background-position: -23px -71px`.
  - That offset is the patch round 6 picked: no streak runs through the +.
  - The texture is the same one the place tag's orange band uses, which
    makes it the same printed stock.
- **Glyph:** the existing + SVG (viewBox 24, lines 12,5-12,19 and
  5,12-19,12, round caps).
  - Size `width="26.4" height="26.4"`, `stroke-width="3"` (about 3.3px on
    screen; arms about 15.4px).
  - `color: var(--navy)` (#12293F); the stroke is `currentColor`.
  - Centred in the box (flex centre, as today).
  - Navy on brand orange is the token pair's intended use (`--brand-orange`
    "carries NAVY type").
- **No shadow you can see.** The mask clips today's `box-shadow: 0 1px 0`.
  Leave it or drop it; it doesn't paint.
- **Same at every size and on desktop:** 60px and 26.4 +, at 320 too
  (systems' boxes; 1 row at 320 with a tag open is the known cost). It
  isn't scaled down for small screens.

### States

| State | Field | Glyph | Notes |
|---|---|---|---|
| Rest | `--brand-orange` + `--tex-flood` | navy + | |
| Pressed (`:active`, not open) | `--brand-orange-deep` (#A8400C), texture kept | **paper +** (`--paper` #F2EBDD) | Deep orange carries paper type (5.20:1), like the submit button's press. |
| Open (`.active`, the form is showing) | `--navy`, **no texture** (`background-image: none`) | **paper ×** (today's × SVG at the same 26.4 / stroke 3) | ADD LOCATION stays the one orange thing on screen (director ruling). This replaces today's inverted-orange `.active` for this button only. **`#accountBtn.active` keeps today's look**, so split the shared `.active` rules. |
| Open + pressed | `--state-on-press` (#2A4F73), no texture | paper × | |
| Keyboard focus | unchanged field | unchanged | A ring like the account's: a `#addFocus` sibling (2px `--navy` ink plus a 4px `--paper` halo), following this button's 24-lobe polygon at 1.16×, `pointer-events: none`. The mask would clip an outline drawn on the button itself. |
| Signed out (playground) | identical to rest | | No special look. |
| Stale sign-in | rest; the press shows while the finger is down | | It never turns navy. The sign-in sheet is the feedback. |
| Under the filters panel | unchanged, covered | | No dimming or hiding of its own: the panel simply lies over it. |
| Keyboard up | navy ×, behind the keyboard | | Nothing new to draw. |
| Desktop hover | none | | The pointer cursor only, the app's rule for badges (the account's hover is the pointer only). |

The glyph swap keeps `setAddBtnGlyph()`. Change only its two SVG strings
to `width/height 26.4` and `stroke-width 3`.

### Motion and feedback

- **Riding:** the badge has **no transition of its own on position.** It
  moves only as part of the sheet (`#locations`' `transform 0.3s ease`):
  list up / collapsed, a tag lowering the sheet, and the drop on tap.
  - However systems positions it (CSS from the sheet), it has to land on
    the **same frames as the sheet**, with no lag and no second curve.
  - If it isn't inside the sheet's transform, give it the identical
    `transform … 0.3s ease` driven by the same `--sheet-lower` value.
  - Reduce Motion: whatever the sheet does, the badge does.
- **Colour:** keep today's `transition: background 0.15s ease, color
  0.15s ease`.
  - Rest → pressed and back fades in 150ms.
  - Rest → open (orange to navy, + to ×) happens during the 300ms ride
    down. The colour settles in its first half, so the badge arrives
    already navy.
  - The texture isn't animatable, so it simply drops at the swap. That's
    invisible under the 150ms fade.
- **+ to ×:** an instant glyph swap, as today. **No rotation tween.** A
  spinning + would be the only spinning object in the app, and the ride is
  already the motion.
- **Haptics: none for the +.** `hapticTap()` is the app's **mark** tick:
  it fires when a finger sets or clears a mark (star, visited, the form's
  STAR) through the `HAPTIC_TAPS` labels.
  - Opening a form isn't a mark, and today's + doesn't tick either.
  - Adding it to `HAPTIC_TAPS` would also require reworking `hapticTap()`,
    which looks for a mark button.
  - If the owner later wants a tick on +, it's a separate ask.
- **Press feedback** is the colour step (deep orange, paper +) and nothing
  else: no scale bounce and no ink spread. This is the app's rule for
  filled buttons (submit, account).

### What doesn't change

- The account badge's look (navy, 14 lobes, 50px, its orange open state,
  sign-in die). Only its `right` moves (systems).
- Clusters stay deep-orange discs at city zoom. The badge is the only
  *bright*-orange filled object on the map at rest.

## Why

- **Bottom-left** is the owner's own call ("maybe the plus should be on
  the left? Easier for me to reach"). Aligning by the badge's *ink* puts
  it on the rows' left channel. Centring the + on the ring axis would push
  the box to the screen edge (it "falls off"), and aligning by box
  misses the channel by 4px.
- **It rides the sheet, rather than sitting at a fixed screen position,**
  because the sheet's top edge is the only band that's always low and
  always free of rows. A fixed corner would land on the list or float
  over rows when the sheet moves.
- **On tap the list drops and the form sits on the band ("ride"),**
  because the alternative, "stay" (today's form dropping from the top with
  the badge turning × in place), was measured to fail at both heights:
  the × lands on ADD LOCATION at 844, and Add is behind the list at 664.
  The badge does move on tap, against "controls don't move", but it moves
  *with the list*, the same motion it makes whenever the sheet moves, and
  never on its own.
- **`TAG_SHEET_GAP` 88, not "step aside":** at 60px the badge fits under
  an open tag for one list row at 320, so it stays reachable everywhere
  but under the filters panel.
- **The filters panel covers it** because riding the panel's top was
  measured to land off-screen at 664. One extra tap was the honest cost.
- **The account takes the top-right alone,** which breaks the twin-badge
  pairing the owner objected to ("same weight and heirarchy as account").

### Why it looks the way it does (visual)

- **Orange and 60, not the account's navy 50:** the owner's "prominence is
  the problem on the badge… same weight and heirarchy as account, which it
  shouldnt be". With two axes changed (field and size) the + reads as first
  and the account as second at a squint (R6-F2; systems measured 1.34 /
  1.33× the account, on round 10's render, i.e. the stand-in; the build's
  smaller + is not re-measured). The navy 60 still read as a pair.
- **The finer edge:** with a third axis changed, it's the same badge
  family, but a different cut. That means it isn't the account's twin (the
  objection) and doesn't leave the brand either. 10 deep lobes read as a
  flower or a gear and were rejected. The owner liked the orange, bigger,
  finer badge in round 6, and his approval reason, "the circle relates to
  the icon… it's the pin", is the round shape itself, which this keeps.
- **Paper tooth on the orange:** every flood of brand orange in the app is
  printed stock (the tag's band). A flat CSS orange would be the one
  digital-looking object on the map.
- **The navy × when open:** two oranges with the form open (the badge and
  ADD LOCATION) competed. Navy makes the badge recede into "cancel" and
  leaves Add as the one action (director ruling).
- **No new motion and no new haptic:** the + already moves more than any
  control (it rides the sheet). One shared motion reads as part of the
  sheet. A second animation would make it read as a separate floating
  thing. Haptics stay reserved for marks so a tick keeps meaning "you
  changed something".
