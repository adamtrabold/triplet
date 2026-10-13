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
