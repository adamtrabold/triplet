# Concept B, the hotel-label banner: how it works (systems)

Read `../flow/how-it-works.md` first. This file covers only what's specific
to B.

## What it is
A small die-cut paper label, flat on the right with a single notched tail
on the left (pointing away from `+`), reading **Sign in** in the app's
printed label caps with the small person leading. The same paper, navy
print, no rim beyond the warm edge and shadow. Signed out = the label;
signed in = today's round orange badge. **Two objects, a shape change.**

Geometry: drawn **28px tall** (director), centred vertically on `+`'s
centre line, inside a **44px-tall transparent hit box** that is as wide as
the label. The right edge sits where the round badge's right edge is
(`right: 74px`); it grows **leftward** only. The text size is fixed
in px, so it doesn't follow Dynamic Type. Type size and width are visual's
call within that height.

## States

| State | What it shows | Notes |
|---|---|---|
| Rest | paper label | the hit box is 44 tall; the drawing is 28 |
| Pressed | face → `--paper-pressed`, ink navy | the whole hit box presses, not just the drawing |
| Focus-visible | 2px navy outline ~3px out, following the notch | records only |
| Signed in | today's orange round badge, its right edge where the label's was | the label is gone; the area left of the badge is map |
| Signed in, dropdown | unchanged (hangs under the round badge) | |
| Auth not yet known | nothing painted | flow rule; it matters more here (a label flashing and then a different shape) |
| 320px | label left edge ≈ x154, clear of zoom | one frame on the sheet |
| Dark tiles | the biggest bright shape in the corner | scoring risk vs `+` (J4) |
| Accessible name | the button's real text "Sign in"; person `aria-hidden` | |

## Motion (two objects trading places)
- **Out → in:** the round orange badge is struck down over the label's
  right end (the same curve as A's strike: `STAR_POP` offsets, scale only,
  peak ~1.12) while the label's print dries off (`DRY`). It ends with only
  the round badge.
  Frames: 0 label · ~130 badge strikes · ~250 label mostly dry · 380 signed in.
- **In → out** (caption "if sign-in also lives in the real app
  (recommended)"): the badge dries up **to nothing**. There must be no paper
  disc left over the label (turn 4's sketch artifact). The label prints in
  beneath it, on the same `DRY` timing reversed in role. Ends with only the
  label.
- **If Q1 = no:** the badge dries to nothing and no label prints in.
- Build note: two elements (or one changing shape) means the two halves
  must share one clock. A half-dried badge over a half-printed label must
  never end up stuck if a tap or a re-render lands mid-motion. Taps are
  ignored until it ends.

## Risks to watch in scoring
- Dark-tile dominance over `+` (J4).
- The two-object motion glitching (more frames, more states).
- "That's just a button" (the banner's notch is what answers it).
