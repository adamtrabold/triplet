# Baseline E, "Float": how it works (systems pass, round 5)

The owner's own option: "just floating the existing badge at either the left
or right corner above the list ... show me the best alignment with the
existing badge". Today's badge, **unchanged in look** (50px navy scallop,
orange +, today's states), floated to a bottom corner of the map just above
the list sheet. It rides the sheet's top edge. The account badge stays alone
at top-right, in today's + slot (`right: 16px`).

These are rough frames from a real-app prototype, for numbers and not for
looks. The owner stills and the final optical polish are the visual
designer's.

- Prototype: `concept.inc.html`, injected into a copy `index.html` by
  `render.js`. Config on `<html>`: corner, align, gap, form, filters,
  tag gap, credit.
- Frames: `frames/<variant>/<state>-3x.png`, plus
  `frames/{r,l}-gutter-20-overview.png`.
- Numbers: `measure.json`. It holds every variant. `node sum.js` prints a
  one-line summary per frame. `probe.js` measures today's axes.
- Re-run: `node render.js`, or
  `VARIANTS=r-gutter-20 ONLY=tag node render.js`.
- `chrome-check.js` runs on every frame. Its results are listed below.

## The pick

**Right corner, box 16px from the screen edge and 16px above the sheet
edge.** That puts the ink 19.9px from both edges. Variant `r-gutter-20`.

Why:
- **Reach.** It's the right thumb's corner. At 844 the button sits at y
  478-528, mid-height on the right, which is the easiest reach for a
  right-handed one-handed grip.
- **One right line with the account badge.** Both badges have their box 16px
  from the edge, so their scalloped ink sits on one vertical line (x 370.1)
  at the top and bottom of the map. Two identical badges on one line read as
  a set, which is the strongest alignment available here.
- **Closest to the list's real ink.** The scallop's ink edge (370.1) sits
  2.9px outside the locate icon's ink (367.2). That beats both
  alternatives:
  - ink-on-the-gutter puts it at 374, 6.8px outside;
  - centring on the × axis puts the badge 9px from the screen edge.
- **The form keeps its spine.** With the form open, ADD LOCATION starts at
  the form's own left line (x 56) and ends 12px short of the × (x 312 / 324).

**Close second: the left corner, same rule** (`l-gutter-20`). It has the
cleanest alignment of all. Its ink (19.9) lands 0.9px from the category
rings' ink (19.0), which is the owner's "one left channel". It also never
touches the OSM credit. What it costs:
- a stretch for a right thumb;
- ADD LOCATION has to start at x 78, so the form loses its 56px spine on
  that one line;
- it sits 16px from the left edge, where iOS starts the back swipe (a minor
  risk; it needs an iPhone check).

Two people use the app. If Erica holds her phone in her left hand, that
flips the reach argument, and only the owner knows.

## Alignment: what was measured (390x844, `probe.js`, the `axes_844` frames)

The scallop's ink runs from 3.9 to 46.1 of its 50px box on both axes, so the
ink sits 3.9px inside the box.

| Line in the app today | x |
|---|---|
| Row icon ring, ink | 19.0 – 41.0 (axis 30) |
| Collapse ▼ glyph | 23.1 – 36.9 (axis 30) |
| Row / header boxes | left 16, right 374 (gutter) |
| Locate icon, ink | 348.8 – 367.2 (axis 358) |
| Row × glyph, ink | 355.9 – 364.1 (axis 360) |
| Zoom control | box 10 – 44, buttons 12 – 42 (axis 27): Leaflet's default margin, on none of the lines above |
| Account badge (stays) | box 324 – 374 → ink 327.9 – 370.1 |

| Option (horizontal) | Left corner: box / ink edge / centre | Right corner: box / ink edge / centre | Verdict |
|---|---|---|---|
| **gutter**: box 16 from the edge | 16 – 66 / **19.9** / 41 | 324 – 374 / **370.1** / 349 | **Pick.** The ink lands on the rings' ink (left, 0.9px off) and on the account badge's ink line (right, exact), 2.9px from the locate ink |
| ink: ink 16 from the edge | 12.1 – 62.1 / 16 / 37 | 327.9 – 377.9 / 374 / 353 | Matches the box grid line but not any ink. On the right it breaks the line with the account badge by 3.9px |
| axis: centre on the column | 5 – 55 / 8.9 / 30 | 335 – 385 / 381.1 / 360 | A 50px badge on a 28px column's axis sits 9px from the edge. It reads as falling off (`axes_844`, l/r-axis-16) |

**Vertical gap, measured from the ink.** The pick is a 16px box gap, which
is 19.9px of ink. That's the same as the side margin, so the badge nests
evenly in the corner. Below the edge, the header icons' ink starts 19px down
(the sort svg at y 563 with the edge at 544), so the ink gap is nearly
mirrored across the edge.

The alternatives:
- ink 16 (box 12.1): tighter;
- ink 12 (box 8.1, which mirrors the header's 12px box padding): crowds the
  credit strip.

All three are rendered (`*-ink-16`, `*-ink-12`). This is the visual
designer's dial. The structure doesn't care, except that `TAG_SHEET_GAP`
follows it (see below).

## Positions of the pick across states (box, x1,y1,x2,y2)

| State | Right (`r-gutter-20`) | Left (`l-gutter-20`) | Notes |
|---|---|---|---|
| List up, 390x844 | 324,478,374,528 | 16,478,66,528 | 4 rows visible, as today |
| List up, 390x664 (Safari tab) | 324,298,374,348 | 16,298,66,348 | |
| Collapsed, Home Screen (34px inset) | 324,684,374,734 | 16,684,66,734 | The band starts at y 750. Safe area clear |
| 320x568, Copenhagen | 254,202,304,252 | 16,202,66,252 | The credit sits 2.9px beside the badge (below) |
| Tag open (starred, navy row), 844 | 324,478,374,528 | same y | The tag's foot is 198px above the sheet. Nothing moves |
| Tag open, 664 | 324,362,374,412 | same y | The sheet lowers 64px (today 34). Rows 3 (today 3). Tag gap to the badge: 16px |
| Form open, 844 | 324,718,374,768 (×) | 16,718,66,768 | Add 56–312 / 78–374, y 721–765, centred on the × |
| Form open, 664 | 324,538,374,588 | 16,538,66,588 | Add y 541–585; it hit-tests as Add |
| Form open from collapsed (34px inset) | 324,684,374,734 (no move) | same | Add y 687–731 |
| Form open, 320x568 | 254,442,304,492 | 16,442,66,492 | The form scrolls. Add is sticky beside the × |
| Desktop rail 1280x800 | 1214,734,1264,784 | 376,734,426,784 | The map column's bottom corner (no sheet edge) |

## Collisions (each measured; `measure.json`)

- **OSM credit.** It must stay on the map.
  - Left corner: the credit stays at bottom-right and never meets the badge
    (72.9px apart at 390).
  - Right corner: the credit and the badge share the bottom-right strip, so
    the **credit moves to bottom-left** (`attributionControl.setPosition`).
    It ends up 72.9px from the badge at 390, but **only 2.9px at 320**
    (credit 0–251 against the badge at 254).
  - Builder option at 320, for either corner: drop Leaflet's "Leaflet |"
    prefix (`setPrefix(false)`) to win about 70px. Licence-wise only the OSM
    credit is required.
  - The other option: keep the credit at bottom-right and stack the badge
    above it (`r-ink-16-lift`). That costs a 33px ink gap, and the badge
    then visibly floats rather than riding the edge. Rejected.
- **The open tag.** **Today's `TAG_SHEET_GAP` of 48 collides**
  (`tag48_664`): the tag (316px wide, x 37–353, centred) overlaps either
  corner's badge at 664.
  - Ruling needed: the gap becomes the badge's box top above the edge plus
    12, which is **78** with the pick's 16px box gap.
  - Cost: at 844 nothing changes (the tag fits). At 664 the sheet lowers
    64px instead of 34px, and it's still 3 rows.
  - The longest-notes tag behaves the same (`tagtall_*`). In the stub data
    no tag gets tall enough to scroll.
- **Pins.** 0 pins under the badge in any city at its default view, list up
  or collapsed. That's 5 cities × 2 states, 3–6 markers each, and the stub
  data is sparse.
  - The map pans, so a pin can always end up under the badge, as it can
    under today's top-right badge.
  - Plan fits already avoid it: `planChrome()` includes `#floatingAddBtn`,
    and `planSafeBox()` uses chrome in the lower half as the fit's bottom.
- **Safe area.** Collapsed with the 34px inset, the badge's box ends 16px
  above the band (734 vs 750). Clear.
- **Zoom / account / form.** `chrome-check` is clean at rest, collapsed, tag,
  320 and rest_664 in both corners. The flags it raises elsewhere:
  - `credit×filters`, with the filters open: **pre-existing** (today the
    credit sits under the open panel too);
  - `badge×form`, `form×zoom`, with the form in "stay" mode: **pre-existing**
    (today's form runs under the top controls by design).
  - With the pick's form behaviour ("ride"), every form frame is clean.
- **The form's ADD LOCATION.** See "Form open".

## Form open: two behaviours, measured

1. **Stay** (today's form drops from the top, the list doesn't move, and the
   badge turns × in place). It **fails at both heights:**
   - 844: the × sits on ADD LOCATION (Add y 450–494, × y 478–528, both
     reaching x 374 at the right; 6px of overlap at the left);
   - 664: Add is behind the list (pre-existing) and a field runs under the
     × (`formstay_*`).
   - Making it work would mean the form ending above the badge and
     scrolling in about 300px at 664.
2. **Ride (recommended).**
   - Tap +, and the filters panel closes if it's open.
   - **The list drops to its band.** The badge rides down with it (the
     same 16px gap above the band edge) and turns × (today's ON state:
     orange field, navy ×).
   - The form sits on the band, and **ADD LOCATION shares the ×'s line**
     (centred on it, 12px short of it).
   - The OSM credit rides the form's top edge. It steps out where no map
     strip is left (320x568), as it does for the sort menu today.
   - A form taller than the room scrolls inside itself. Add is sticky, and
     the form's top never goes under the zoom/account row.
   - Cancel (the ×) puts everything back:
     - the list (up or collapsed);
     - the badge (verified: back to y 478);
     - **the open tag on the same place** (verified: `la10` re-opens, via
       the list's own row-tap path);
     - the draft, which survives as it does today (the toggle only hides
       the form).
   - From a collapsed list nothing moves (`formcol_safe`).

**Honest cost, for the owner (the old Q1, now sharper):** with the float,
the + **moves 240px on tap** (y 478 → 718 at 844; 298 → 538 at 664) and comes
back on cancel. Owner taste says "I don't want ... the button to change
physical location after click". The float rides the sheet already: it also
moves when the list collapses or a tag lowers the sheet. So this is the same
motion, with the list, not the badge on its own. The alternative that never
moves on tap is "stay", and it fails as shown.

## Filters panel open

The panel lies over the sheet's top edge (up to 40vh). Two options, both
rendered:

- **Ride the panel's top** (`filtersride_*`): **fails.** At 844 the badge
  jumps to y 107–157, a 370px move out of thumb reach and 41px under the
  account badge. At 664 it reaches y −1, into the top row and off-screen.
- **Under (recommended)** (`filters_844`): the badge stays at the sheet edge
  and the open panel covers it. So it's "close filters to add", the same
  rule C was given, and **a cost on job 1** (two taps with the filters
  open). The filters toggle sits in the same band, one reach away.

## Other states

- **Signed out.** The badge is identical. Tapping it opens the sign-in sheet,
  nothing moves and the badge doesn't go ON (`signedout_tap`).
- **Playground (`?play`).** It adds, as signed in (every form frame).
- **Plans.** Unchanged. + adds a place. Plan fits avoid the badge (see
  pins).
- **Loading.** Today's badge shows straight away. It's the same signed in or
  out.

## Builder notes (not for the owner)

- Position in CSS, not JS (the prototype uses a 30ms sync).
  - List up: `top: calc(100lvh - 300px - var(--chrome-bottom) + var(--sheet-lower) - 16px - 50px)`.
  - Collapsed: off `60px + var(--sheet-under)`.
  - Transition with the sheet's `transform 0.3s ease`, so it rides in step.
- `pinPopupTopPad()` (~4927): **remove `#floatingAddBtn`**. Otherwise a tag
  opens below a bottom badge. Done in the prototype copy.
- `planChrome()` (~6718): keep it. It now guards the bottom.
- `TAG_SHEET_GAP` (~4969): derive it from the badge. 78 with the pick.
- `#accountBtn` / `#accountDropdown`: `right: 74px` becomes `var(--s4)`.
  Tell the sign-in crew: the signed-out account badge now owns the top-right
  corner alone.
- Right corner: `map.attributionControl.setPosition('bottomleft')`.
- Ride mode: `#controls` becomes `position:absolute; bottom:0` inside
  `#mainContent`, with `max-height` clear of the top row and a sticky
  `#submitBtn`. Its paper backing should span the full row: at 320, a
  scrolled field shows beside the ×.

## Coverage against jobs.md (the pick, ride form, filters "under")

| Job | Supported? | Where |
|---|---|---|
| 1 Reach + one-handed | **Yes, with one exception:** filters open = close filters first | Mid-height right in every state; on the band when collapsed |
| 2 Reads as the main action | Yes, by position (alone, low, its own corner; no longer a twin of the account badge). The look is unchanged by design | |
| 3 Finish near the thumb | Yes | Add on the ×'s line at every height, sticky at 320 |
| 4 Don't lose my place | Yes | Cancel restores the list, the tag and the draft (verified) |
| 5 Never in the way | Yes, with the gap ruling (`TAG_SHEET_GAP` 78) and the credit move | Without the ruling the tag collides at 664 |
| 6 Signed out / playground | Yes | `signedout_tap`, every `?play` frame |

## Open questions

- Director: "ride" vs "stay" for the form. Stay fails as measured, so the
  owner question is really "may + move down with the list on tap?"
- Director: filters "under" (a job-1 exception) is acceptable?
- Visual: the ink gap dial (19.9 / 16 / 12). Two oranges side by side with
  the form open (the × in its ON state and ADD LOCATION): fine, or does the
  ON state need a look?
- Owner: which hand Erica uses. Right or left only changes the pick if
  reach decides it.
- iPhone checks, if this builds: the badge riding with the sheet's transform
  (no lag), the left-edge back swipe (left corner only), and the 320 credit
  next to the badge.

## Round 5: coverage beside A and C (systems, jam turn 16)

| Job | E Float (pick) | A ticket | C ring |
|---|---|---|---|
| 1 Reach | yes, except filters open | **yes, no exceptions** | yes, except filters open and tag open |
| 2 Main action | yes by position, the look unchanged | yes | yes |
| 3 Finish near the thumb | yes (Add on the ×'s line) | yes (Add above the ×) | yes (Add sticky in the blank tag) |
| 4 Don't lose my place | yes | yes | yes |
| 5 Never in the way | yes, **needs `TAG_SHEET_GAP` 78** + the credit move | yes; costs the title 32px | yes (steps aside under a tag); credit moved |
| 6 Signed out / playground | yes | yes | yes |

Shared, Float and C: at 320 the moved credit touches the corner control
(2.9px / 3.2px). Dropping the "Leaflet |" prefix fixes both.

---

## Round 6 (systems, jam turn 22): the 60px stamp badge's footprint

The visual pick (jam turn 21): orange stock, navy + at 3px, a 24-lobe stamp
edge, 60px, scaled about the scallop's lower-right ink corner. It's measured
on a fresh copy of **today's main** (signed out = the playground), with this
folder's `concept.inc.html`, R17 and `r6.inc.html` layered in memory.

- Script: `../r6-check/check.js`, `tag-rows.js`
- Numbers: `../r6-check/measure.json` (`F`), `measure-tagrows.json`
- Frames: `../r6-check/frames/F-*`

`chrome-check` is clean on every frame. The only flags are the
pre-existing ones with the filters open.

### Footprint across states (box x1,y1,x2,y2)

| State | Box | Finding |
|---|---|---|
| 390x844, list up | **314.8,468.8 – 374.8,528.8** | Ink 319.5–370.1 × 473.5–524.1. The ink stays **19.9 from the side and 19.9 above the list**, and the right ink line is still shared with the account badge (370.1). The box overhangs the 16px gutter by 0.8px; the ink doesn't. Hit-tests as itself. 4 rows |
| 390x664 | 314.8,288.8 – 374.8,348.8 | 4 rows. 222.8px below the account badge |
| 375x667 | 299.8,291.8 – 359.8,351.8 | Clean |
| 320x568, Copenhagen | 244.8,192.8 – 304.8,252.8 | **Credit:** without the "Leaflet \|" prefix (0–186) it's 58.7px clear. **With the prefix (0–251) it now overlaps the badge by 6.3px** (`cph_320_prefix`). Round 5's 2.9px "touch" became an overlap: the prefix drop is now **required**, not a builder option |
| Collapsed, 34px inset | 314.8,674.8 – 374.8,734.8 | The band starts at 750: 15.2px box / 19.9px ink clear. Safe area clear |
| Desktop 1280x800 | 1204.8,724.8 – 1264.8,784.8 | The map column's bottom-right |
| Pins under it | 0 in all 5 cities, list up and collapsed | The dead zone is 60x60, against 50x50 in round 5 (+44%). That's 1.7% of the map at 844 |

### `TAG_SHEET_GAP`: 78 no longer clears, so it's 88

The badge's box top now sits 75.2px above the list edge (it was 66), so
round 5's 78 no longer gives 12px of clearance.

| Gap | 664: tag foot → badge box | 664: sheet lowers | Rows, tag open (664 / 375x667 / 320x568 / 844) |
|---|---|---|---|
| 48 (today, no Float) | (collides) | 34 | 3 / 3 / **2** / 4 |
| 78 (round 5) | **6.8px** (about 11 to the ink); under the 12 rule | 64 | 3 / 3 / 1 / 4 |
| **88 (proposed)** | **16.8px** | 74 | 3 / 3 / **1** / 4 |

- **Rule:** the gap is the badge's rendered box top above the list edge,
  plus 12. Read it from the box, not from a constant. With the pick that's
  `ceil(75.2 + 12)` = 88.
- **Cost:**
  - At 844, nothing (the tag's foot is 198px clear).
  - At 664 and 375x667, the list lowers 40px more than today and keeps 3
    rows.
  - **At 320x568 the list keeps 1 row, against today's 2.** The lowering is
    capped at 156 there, so 78 cost the same in round 5; that just wasn't
    measured then.
  - The longest-notes tag behaves the same (`tagtall_664`).

### Form open (ride): Add has to read the badge's real box

- The badge (×: R17's navy and paper ×, also at 60) rides to 314.8,708.8 –
  374.8,768.8 at 844 and 314.8,528.8 – 374.8,588.8 at 664.
- From collapsed, nothing moves (Add 682.8–726.8 with the inset).
- **As coded for 50px,** ADD LOCATION stops **2.8px** from the × (not 12),
  and its centre sits 4.2px below the ×'s centre (`form_844`/`form_664`).
- **Scale-aware** (`formfix_*`, reading the rendered box):
  - Add runs 56–302.8, y 716.8–760.8 at 844 and y 536.8–580.8 at 664.
  - It sits 12px short of the ×, and the centres are equal.
  - Add loses 9.2px of width (256 → 246.8). At 320 it's 56–232.8, sticky,
    and hit-tests as Add.
- Tag open → + → cancel still restores everything: tag `rey10` reopens, the
  list is up, and the badge is back at 468.8.

### Filters, Plans, playground, signed out

- **Filters open:** the badge stays under the panel (the centre hit-tests
  as the panel), so it's still "close filters to add". Unchanged.
- **Plans:** `planChrome()`/`planSafeBox()` read the rendered box, so a 60px
  badge is guarded with no change.
- **Playground (today's signed-out app):** + opens the form and adds, as
  signed in. The account badge is **always on screen** now (its menu reads
  "Sign in"), where before it disappeared when signed out. So the hierarchy
  problem the owner named applies in every state, the playground included.
- **Stale stored session** (the only state left where `requireAuth()`
  asks): the sign-in sheet opens, nothing moves, and the badge doesn't go
  ON (`stale_tap`).

### Builder notes (round 6)

- Draw the badge at 60px. Don't use `transform: scale(1.2)` (the
  prototype's), so the edge isn't a scaled raster on iOS and layout code
  sees the real box.
- `TAG_SHEET_GAP` comes from the badge's box (88 with the pick).
- The ride form's Add stop and centre line come from the badge's rendered
  box.
- At every width, use `attributionControl.setPrefix(false)` (required below
  about 330px wide).

### Coverage (round 6)

Unchanged from round 5:
- Job 1: yes, except with the filters open.
- Job 3: yes, with the scale-aware Add.
- Job 4: yes.
- Job 5: yes, with `TAG_SHEET_GAP` **88** and the prefix drop.
- Job 6: yes, against the playground.

Job 2 is now carried by look as well as position (orange, 60, stamp edge).
The squint test is the director's.

---

## Round 7 (systems, jam turn 26): the 60px orange Float at the bottom-LEFT

The owner wants it on the left ("easier for me to reach"). The look is
round 6's: orange stock, navy +, stamp edge, 60px. It's scaled about the
**lower-left** ink corner, so the ink stays 19.9 from the side and from the
list. Measured on today's main.
- Script: `../r7-check/float-left.js`
- Numbers: `../r7-check/measure.json`
- Frames: `../r7-check/frames/F-*`

Rulings carried over: ride on open, filters "under", `TAG_SHEET_GAP` from
the box, navy open state with a paper ×.

`chrome-check` is clean on every frame. The only flags are the
pre-existing ones with the filters open.

### Alignment

| Line | x |
|---|---|
| Badge box / **ink left** / centre (+ glyph) | 15.2 – 75.2 / **19.9** / 45.2 |
| Category-ring ink (rows) | 19.0 – 41.0, axis 30 |
| Collapse ▼/▲ glyph | axis 30 |
| Zoom control (top-left) | box 10 – 44, buttons 12 – 42, axis 27 |
| Form fields' spine | 56 |

- **The ring channel holds:** the badge's ink is 0.9px from the rings'
  ink, the same as at 50px. **Align the ink edge, not the glyph.**
  Centring the + on the ring axis (30) puts the box at 0–60, flush against
  the screen edge, with ink 4.7px from it. That's the round-5 "falls off"
  failure again.
- **The zoom control on the same side:**
  - Zoom's left edge is 12 and the badge's ink is 19.9 (7.9px apart).
  - The axes are 27 vs 45.2.
  - It sits 395px above the badge at 844, 215 at 664 and 119 at 320.
  - They're on no shared line, and far apart vertically, but both are "+"
    on the left edge. Whether they read as one control family at 1x is
    visual's to show. Structurally they never touch.

### Positions (box x1,y1,x2,y2)

| State | Box | Finding |
|---|---|---|
| 390x844, list up | **15.2,468.8 – 75.2,528.8** | 4 rows. Hit-tests as itself. 0 pins under it in all 5 cities (list up and collapsed) |
| 390x664 | 15.2,288.8 – 75.2,348.8 | 4 rows |
| 375x667 | 15.2,291.8 – 75.2,351.8 | |
| Collapsed, 34px inset | 15.2,674.8 – 75.2,734.8 | The band starts at 750: 15.2 box / 19.9 ink clear |
| 320x568, Copenhagen | 15.2,192.8 – 75.2,252.8 | See the credit below |
| Desktop 1280x800 | 375.2,724.8 – 435.2,784.8 | The map column's bottom-left, 15.2px from the rail's edge (the column starts at 360). Zoom is above it at 370–404. The credit is at the column's bottom-right |

### OSM credit: back at Leaflet's default bottom-right

| Width | With "Leaflet \|" (credit width 251) | Without (186) |
|---|---|---|
| 390 | **63.7px clear** | — |
| 375 | **48.7px clear** | — |
| 320 | **overlaps the badge by 6.3px** | 58.7px clear |

**The prefix fits, and stays, at 375 and wider.** It has to drop below
about 338px wide (badge right 75.2 + 251 + 12). The rule:
`setPrefix(false)` when the map is narrower than 338. A simpler rule is to
always drop it, but ruling 4 says keep it where it fits.

### `TAG_SHEET_GAP` 88: confirmed at the left

The tag spans 37–353 at 390 and 16–304 at 320, so it covers both corners.

| State | Tag foot → badge box | Sheet lowers | Rows |
|---|---|---|---|
| Tag open, 844 | 122.8 | 0 | 4 |
| Tag open, 664 | **16.8** | 74 | 3 (today 3) |
| Longest-notes tag, 664 | 16.8 | 74 | 3 |
| Tag open, 320x568 | **13.8** | 156 (cap) | **1 (today 2)** |

These are the right corner's numbers exactly. 88 holds.

### Form line: ADD LOCATION with the × at the left. Options for the director

The badge rides down and turns × at 15.2–75.2. That box crosses the
fields' 56 spine, so Add can't keep both its spine and the ×'s line. The
×'s position and the ride are the same in every option.

| | **A. Beside** (Add on the ×'s line, right of it) | **B. Above** (Add on the spine, the × alone below it) |
|---|---|---|
| 844 | × 708.8–768.8; **Add 87.2–374 × 716.8–760.8**, centred on the ×, 12px right of it | × 708.8–768.8; **Add 56–374 × 652.8–696.8**, 12px above the × |
| 664 | Add 87.2–374 × 536.8–580.8 | Add 56–374 × 472.8–516.8 |
| 320x568 | Add 87.2–304 × 440.8–484.8 (sticky, hit = Add) | Add 56–304 × 376.8–420.8 (hit = Add) |
| Width | 286.8 (wider than the right corner's 246.8) | 318 (the full spine, as today) |
| Spine | **breaks:** Add starts 31.2px right of the 56 spine. Its right edge (374) matches the fields | **holds:** Add lines up exactly with every field (56–374) |
| Map strip above the form | 844: 251 / 664: 71 / 320: 12 | 844: **187** / 664: **12** (the credit steps out) / 320: 12 |
| Thumb | Add stays on the band line, the lowest it can be | Add is **64px higher**. The × stays on the band line |
| Pairing | Add and × on one line: "do / undo" side by side | The × reads as its own control under the form |

- **Neither breaks a job.** A costs the spine; B costs 64px of map (all
  of it at 664) and puts Add 64px further from the thumb.
- **Rejected:**
  - **C. Move the × to the right end while open.** It would mean the
    button changes place on tap, which is owner taste ("I don't want ...
    the button to change physical location after click").
  - **D. Shrink the open ×** to clear the spine. The badge would have to
    end at about 44: a 28px × (under the 44px tap minimum), which is still
    its own size change.
- **Note for visual:**
  - In both options the open ×'s centre (45.2) sits 15px off the band's
    ▲ axis (30) directly below it. "Small marks line up exactly" applies
    there too.
  - At rest the same is true of the ring axis. The ink edge is what lines
    up (above).

### Other states

- **Tag open → + → cancel:** tag `rey10` reopens, the list is up, and the
  badge is back at 468.8.
- **Filters open:** the badge is under the panel (the hit at its centre is
  a filter chip). "Close filters to add" is unchanged.
- **Playground:** + adds (the account menu reads "Sign in").
- **Stale session:** the sign-in sheet opens and nothing moves.
- **Collapsed:** + opens the form with nothing moving. Option A's Add is
  682.8–726.8.

### iPhone checks to list (not solved here)

- **The back-swipe edge.** The badge's box starts 15.2px from the left
  edge (ink 19.9). In a Safari tab an edge swipe goes back. Check that a
  tap on the badge's left third never starts a back navigation, and that a
  back swipe starting at x < 15 doesn't press the badge. The Home Screen
  app has no back swipe, so this is a Safari-tab check only.
- A 60px masked stamp edge renders crisp at the left.
- It rides in step with the sheet.

### Builder notes (round 7)

- `transform-origin` (or the drawn box) anchors at the lower-left ink.
- The credit stays at Leaflet's default `bottomright` (drop
  `setPosition('bottomleft')`).
- `setPrefix(false)` only below about 338px of map width.
- The form line follows the director's A/B ruling. For A, Add's left is
  the badge's rendered right + 12, centred on its rendered centre. For B,
  Add is full spine and the form's bottom padding is the badge's box top
  above the edge + 12.

### Coverage (round 7)

| Job | Float, left |
|---|---|
| 1 Reach | yes (his hand, his side), except with the filters open |
| 2 Main action | look as round 6, with the account at the opposite corner and no shared line. The squint test is visual's and the director's |
| 3 Finish near the thumb | yes in both options. A keeps Add on the band line; B puts it 64px higher |
| 4 Don't lose my place | yes (cancel verified) |
| 5 Never in the way | yes, with `TAG_SHEET_GAP` 88 and the prefix dropped below 338px |
| 6 Signed out (playground) | yes |

No job is unsupported.
