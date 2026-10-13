# Baseline E, "Float": how it looks and feels (visual designer, round 5)

The owner's own option: "just floating the existing badge at either the left or
right corner above the list ... show me the best alignment with the existing
badge". The look is **today's badge, unchanged**: a 50px navy scallop, an
orange +, and today's states. My part is only the alignment, the optical
spacing and the owner stills. Structure, positions and collisions are in
systems' `how-it-works.md` and `measure.json`.

## Owner stills (3x, 1170 wide, real app from this folder's `index.html` copy, stub data, Reykjavík)

| # | File | What it shows |
|---|---|---|
| E1 | `E1-left-or-right-3x.png` | Both corners at rest (390x844, list up), side by side, plus the one-line pick |
| E2 | `E2-right-list-up-3x.png` | The pick: list up |
| E3 | `E3-right-list-down-3x.png` | List collapsed, Home Screen (34px inset) |
| E4 | `E4-right-tag-open-3x.png` | A starred place's tag open, navy row; the badge stays, the tag clears it |
| E5 | `E5-right-adding-3x.png` | Form open ("ride"): the list drops, the badge rides down as ×, ADD LOCATION beside it. Carries the cost line |
| E6 | `E6-right-320-3x.png` | 320x568, Copenhagen |
| E7 | `E7-right-664-3x.png` | 390x664 (Safari tab) |
| E8 | `E8-alignment-3x.png` | The 3x close-up with the axes drawn (the only frame with axes) and the one-line pick |

Raw frames: `stills/*.png` and `stills/measure.json` (positions plus a
`clash` list per frame: `chrome-check.js` plus a check of the badge against
the credit, tag, zoom, account badge, ADD LOCATION, the sheet and pins).
**Every frame is clean.** The 1x crop used beside A and C is
`stills/crop1x-r-1x.png` (the same 240x240 window in all three).

Re-render: `node stills.js` (`ONLY=<prefix>`), then `node ../compose-r5.js`.
`stills.js` only sets systems' config on `<html>` (`r` / `l`, `gutter`, gap
19.9, ride, credit move, filters under, tag gap clear). Nothing of systems'
is edited.

## Director turn 17 rulings, applied (re-shot E1–E8)

- **Form open: the badge stays navy, and only its + turns into a paper ×**
  (`#floatingAddBtn.active`: navy field, `--paper` glyph; open + pressed:
  `--state-on-press`). ADD LOCATION is the one orange button (E5). This
  changes today's inverted-orange ON state for the Float only. It's in
  `stills.js` (`R17`), layered on systems' prototype.
- **The credit drops "Leaflet |"** at every width: "© OpenStreetMap
  contributors", at bottom-left (0–186 at every width). At 320 it now ends
  68px short of the badge (it was 2.9px).

## The alignment (my call): systems' pick holds

- **Right corner, box 16px from the side and 16px above the list's top
  edge.** The scallop's ink then sits **20px (19.9) from both the side and
  the list**, so the badge nests evenly in the corner.
- **One right line with the account badge.** Both ink edges are on x 370.1,
  top and bottom of the map. Two identical badges on one line read as a
  pair that was placed, not as two floats. That's the strongest alignment
  available, and you see it at 1x without being told (E8).
- **The ink gap dial (19.9 / 16 / 12): 19.9.** Compared at 3x on systems'
  `r-gutter-20`, `r-ink-16` and `r-ink-12` frames. At 12 the scallop's lowest
  lobes nearly touch the line of the credit strip's top, so the badge reads
  as sitting on the list's edge rather than in the map's corner. 16 sits in
  between and matches no other measure. 19.9 equals the side margin, which
  makes the corner read as a deliberate, even inset at a glance.
- **Left corner, same rule** (shown in E1): its ink lands on the row icons'
  ink, the owner's "one left channel". It's a real alternative and only
  loses on reach for a right thumb, and on the form line (ADD LOCATION has
  to start at x 78).
- Centring on a row column (x 30 / 360) was rejected on sight: the badge
  sits 9px from the screen edge and looks like it's falling off (systems'
  `axes` frames).

## States and motion (unchanged from today, placed low)

- Rest: navy scallop, orange +. Pressed: `--state-on-press` with a paper +.
  Open: **navy field, paper ×** (director ruling 5; today's is orange with a
  navy ×). Open + pressed: `--state-on-press`, paper ×.
- **Riding:** the badge moves with the sheet's own transform (0.3s ease), so
  it's never a separate motion. List up → collapsed, a tag lowering the
  sheet, and tap-to-add all use the same ride.
- **Tap +:** the + turns × as it rides down with the list. The rotation is
  today's state swap; no new motion.
- **Signed out:** identical; tapping opens sign-in, nothing moves.

## Open (visual)

- (Closed: two oranges with the form open. The director ruled the badge
  stays navy; see above.)
- The OSM credit at bottom-left sits under the zoom's column and reads fine.

## Round 6: + outranks the account (visual designer, turn 21)

Owner on 5b: "prominence is the problem on the badge... its the same weight
and heirarchy as account, which it shouldnt be." The badge stays in the
family; it now differs from the account on three axes.

- **Field:** brand orange (`--brand-orange`) on the band's paper tooth
  (`--tex-flood`, 160px, offset -23 -71), with a **navy + at 3px**.
  - Pressed: `--brand-orange-deep`, paper +.
  - Open (form): R17 unchanged, navy with a paper ×, so ADD LOCATION stays
    the one orange button.
- **Size:** 60px box (scale 1.2) about the scallop's lower-right ink
  corner. The ink stays 20px from the side and from the list; the footprint
  grows up and left. Measured box: 315,469 – 375,529 at 390x844.
- **Edge:** a postage-stamp cut, 24 fine lobes (depth 1.7px), instead of
  the account's 14-lobe scallop. It's still a wavy-edged badge, but a
  different kind.
  - 10 deep round lobes were rejected: a flower or a gear.
- **Account badge:** untouched. The one labelled frame with it at 40px
  (`R6-F4`) shows it isn't needed.
- **Squint test** (`R6-F2`): the orange 60px badge is clearly first and the
  account second. Navy 60px stays a pair; orange 50px looks lighter than
  the account.
- **Seams to flag:**
  - The account's own open state is an orange field (sign-in crew /
    brand-token pass).
  - Clusters are deep orange discs at city zoom.

Stills:
- `R6-F1-vs-account-3x.png`: the 5b twin beside the round-6 pick.
- `R6-F2-1x.png`: 1x + squint.
- `R6-F3-dials-3x.png`: each dial alone, then combined.
- `R6-F4-account-step-3x.png`: the flag frame.
- `R6-F5-states-3x.png`: pressed, tag open, adding.

Raw frames: `r6/` (`measure.json`, all clash-clean). Layer:
`r6.inc.html`, rendered by `../r6-stills.js`.
