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
