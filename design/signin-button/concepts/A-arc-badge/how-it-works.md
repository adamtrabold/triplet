# Concept A, the arc badge: how it works (systems)

Read `../flow/how-it-works.md` first. This file covers only what's specific
to A.

## What it is
The signed-in badge's own scalloped shape, cut from paper and printed in
navy: a small person high in the circle, **SIGN IN** on a U-shaped arc
under it. No rim, no tilt, no texture (printed, not stamped). It is one
object in both states: signed out = paper with navy print, signed in =
orange with the full-size person.

Visual spec (from turn 4, for the sheet): 50px die, `--paper-raised` face,
warm 1px edge, the `+`'s 1px shadow; the person = the account glyph ×0.42,
1.4px stroke; SIGN IN in Archivo 700, 75% width, 8px, on a U arc of r 15.6.

## States

| State | What it shows | Notes |
|---|---|---|
| Rest | paper badge, navy print | same 50×50 footprint and centre line as `+` |
| Pressed | face → `--paper-pressed`, ink stays navy | on touch-down; sliding off cancels |
| Focus-visible | 2px navy outline ~3px out, following the scallop | keyboard only; records, not on the owner's sheet |
| Sheet open | rest look (it's under the scrim) | it doesn't stay "active", because there is no dropdown |
| Signed in | today's orange badge, unchanged | same spot |
| Signed in, dropdown open | today's `.active` inverse, unchanged | |
| Auth not yet known | nothing painted | flow rule |
| 320px | identical; the badge doesn't shrink | the corner has zoom on the left and two badges on the right; no collisions |
| Dark tiles | paper badge holds itself up | no change |
| Larger text (iOS) | the arc doesn't grow (fixed SVG text) | the `aria-label` carries the name |
| Accessible name | `aria-label="Sign in"`; the arc and person are `aria-hidden` | signed in: "Account" (as today) |

## Motion (one object changing ink)
- **Out → in, the strike:** about 380ms. `STAR_POP`'s offsets and easing,
  scale only (no rotation), peak ~1.12 (the badges are 8px apart).
  Orange floods from the centre on the press, the arc is overprinted away,
  and the person grows ×0.42 → ×1 and recentres.
  Frames: 0 paper · ~60 ink lands · ~130 peak · ~250 dip · 380 signed in.
- **In → out, the dry-up** (caption it "if sign-in also lives in the real
  app (recommended)"): the approved un-visit dry-up by thickness, using the
  `DRY` constants (540ms with the snap; turn 4's "~450" should read from
  `DRY`, not a new number). Thin lobes dry first, the centre last. The arc
  and small person underneath are revealed, not animated. No pop.
- **If Q1 = no:** the same dry-up with nothing printed underneath, so the
  slot ends empty.
- Taps during motion: ignored until it ends (≤540ms), so the state can't
  be double-toggled.

## Risks to watch in scoring
- The 8px arc at real size on a phone (decides J1). The fallback, for the
  team only: 8.5px with the person ×0.38.
