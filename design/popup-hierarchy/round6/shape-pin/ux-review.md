# Shape pin (district / street): UX review

UX agent, 2026-10-07, on `ff251f5`. Brief: `docs/ux-brief.md`. Evidence:
the 1x phone stills (`busy-z14` first), then the 3x crops and the states
boards.

Owner (verbatim): "Districts and streets need a map pin type." This was the
answer to "OK for a district to show a small diamond on the map while its
tag is open?" The tag hangs from the pin.

## Ranking (UX)

| # | Variant | Verdict | Ready for the owner? |
|---|---|---|---|
| 1 | **Trail blaze** | KEEP | **Yes.** It's centred on its point, so where you tap is where it is. It matches the list's diamond badge, and its states read clearly. |
| 2 | **Staked pennant** | KEEP | **Yes.** It's distinct, but the tap target sits up and to the right of the true point, and the flag is the smallest target (21×15). |
| 3 | **Tie-on tag** | KEEP | **Yes, with the cost named.** It hangs ~20px south of its point, so it lands on neighbouring pins most often (`tie-busy-z14`: on the restaurant pin). The visited state keeps its rim. |

No variant breaks a hard limit at the idea level. The must-fixes below are
shared system rules, and they apply to whichever variant wins.

## Jobs

| Job | Result | Evidence |
|---|---|---|
| Identify a district/street on the map | PASS, all three | Each silhouette differs from the round place seals (`*-busy-z14`). Blaze matches the list's diamond badge (`blaze-plan` list rows). |
| Open it | PASS | Tapping the pin or the shape opens the tag (README). You no longer have to aim at a dashed line. |
| List tap → map → tag | PASS (with a must-fix) | The existing `focusShape()` → `openPopupOnArrival()` path. The tag hangs from the pin (`*-district`, `*-street`). See must-fix 3 for big districts. |
| Star / visit / plan state at a glance | PASS | One mark carries all of them (`blaze-states`). |
| Follow a plan with shape stops | PASS | `blaze-plan`: stops 2 and 4 are numbered diamonds among the round place stops, and the order is readable on the map. |
| Signed out | PASS | The pins look identical, since a pin carries no control. The tag's own signed-out rules apply (round 6 tag review). |

## Checks

**Tap targets on a busy map.**
- The ink is ~24–26px (pennant's flag is 21×15). Like the shipped place
  pins, these are map markers, so the 44px rule is met with a padded hit
  area, not the ink.
- **Must-fix 1:** every shape pin gets a ≥44px hit area centred on its
  *visual* body. For the pennant that means the flag, not the staff foot;
  for the tie, the tag body. When hit areas overlap a place pin's, the
  nearer visual centre wins, the same rule as place pins.
- **Stacking.** Shape pins sit on the same rung (0) as place pins, so where
  they overlap (`blaze-busy-z14` diamond/fork pin; `tie` on the restaurant
  pin; `pennant` over the fork pin) the south-over-north order decides
  which shows. **Must-fix 2:** define the order explicitly. Place pins
  above unselected shape pins is my recommendation: a district is the
  bigger, easier target and its outline is also tappable, so it can yield.
  The selected, starred and plan-stop rungs stay as shipped.

**Placement rule.**
- **District at the label point:** yes, that's where people expect it. It's
  the visual centre of the area, and it never falls outside a concave
  district (`blaze-busy-z16` lands it in the open interior).
- **Street at its midpoint:** expected for a short street. For a long one
  the midpoint can be off screen while the line is visible. Since a tap on
  the line also opens the tag, the tag must still hang from the pin:
  **must-fix 3** below covers panning.
- **Must-fix 4: one point per shape.** Directions for a district today uses
  `shapeAnchor()` (the vertex centroid, or the nearest vertex). The pin uses
  the label point. Use the label point for both, so "go there" goes to the
  pin you see.

**Zoom and clustering.** The pin shows exactly when the outline does
(`mapVisibleNeighborhoodShapes()`). In Places the default min zoom is ≥ 14,
so it never meets a cluster. A hand-set lower min zoom clusters like a pin,
and Plans keeps its shipped rule. Correct, and the list is unaffected (the
CLAUDE.md split). There's no "pin with no outline" or "outline with no pin"
state.

**Replacing the separate shape star, sticker and numbered stop diamond with
one mark.** Nothing is lost:
- the star rides on the pin, as on place pins;
- visited is on the pin;
- in Plans the number replaces the glyph, as shipped for place stops
  (owner r18). The silhouette still says area vs place.

What it gains: one tap point instead of three separate decorations. One
edge case: a district's shipped star sat at `shapeAnchor()`; it moves to the
label point. That's fine, but it's part of must-fix 4.

**List tap → map → tag.** It works as for pins.
- **Must-fix 3:** `focusShape()` frames the whole outline (at its min zoom,
  possibly clipped). It must also make sure the **pin and the tag's drop
  space** are on screen before the tag opens. If the label point or a long
  street's midpoint is outside the framed view, pan to the pin. The same
  applies when the tag is opened by tapping the outline far from the pin.

## Per variant

- **Trail blaze:**
  - Centred, so the tap point equals the visual point.
  - Visited = a dark diamond sticker. It's clearly different (owner:
    "Visited vs pin are not differentiated nearly enough").
  - Plan stops keep the diamond.
  - Risk: the glyph is small (~9px ink). That's visual (CD) and doesn't
    affect finding it.
- **Staked pennant:**
  - The staff foot marks the point but the flag is the target, offset up
    and right. Must-fix 1 handles that.
  - The smallest ink of the three.
  - Visited = a filled flag with no peel. The state is still clear
    interaction-wise.
- **Tie-on tag:**
  - The body hangs ~20px south of its point and tilts per shape, so it
    covers south neighbours most often.
  - When open, a small tag hangs above the big one. That's not confusing to
    use, just redundant.
  - Visited keeps the rim, so it's the least different from unvisited.

## Must-fixes (shared)

1. A ≥44px hit area on the visual body, with nearest-centre resolution
   against place pins.
2. An explicit stacking order between shape pins and place pins.
3. A list tap or outline tap pans so the pin and the tag's drop space are
   visible before opening.
4. One point per shape: the pin's point is also the Directions target.

## Not verified

These are stills only, on a synthetic scene and a stand-in basemap. Real hit
testing, the overlap rate on real Reykjavík data, and the Safari toolbar are
unchecked.
