# Claim-check stub: how it looks and feels (visual designer)

One concept. The + leaves the top-right corner, where it was the account
badge's twin, and becomes the **tear-off stub at the right end of the list
header**. The header is the band that's always under your thumb, list up or
down. The account badge keeps the corner to itself (today's badge is shown;
the sign-in crew is redesigning it).

## Owner stills (3x, real app from a copy of index.html, stub data)

| # | File | What it shows |
|---|---|---|
| 1 | `1-rest-today-vs-stub-3x.png` (also `1-rest-today-3x.png`, `1-rest-stub-3x.png`) | Rest, list up, 390x844: today next to the stub |
| 2 | `2-adding-664-3x.png` + `2-tap-strip-3x.png` | Adding at 390x664 (Safari tab): list dropped to its band, form sitting on the band, ADD LOCATION just above the ×. Strip: tap +, then mid-ride (navy ×, turning), then × at the bottom |
| 2b | `2-adding-844-3x.png` | The same at 390x844 (Home Screen): form on the band, map above it, Add at y 716-760, × at y 784 |
| 3 | `3-tag-open-3x.png` | Starred tag open, navy selected row, stub |
| 4 | `4-states-3x.png` | Rest / pressed / open, plus the open filters tile for comparison |
| 5 | `5-320-copenhagen-3x.png` (and `5b-390-copenhagen-3x.png`) | 320 wide: COPENHA… (at 390: COPENHAGEN (23)) |
| -- | `overview-sheet.png` | Everything on one page, today vs stub |

Re-render: `node render.js` (`ONLY=still2` etc.), then `node compose.js`.
The appendix (`appendix/`) is systems'.

## Look

- **Shape:** a full-height block, 60px wide (the tag stub's own height),
  flush to the screen's right edge. Its centre sits on the rows' × column
  at every width (x 360 at 390, x 290 at 320), and the + is on that axis.
  No radius, no shadow, no texture.
- **Perforation:** the tag stub's rule (1.5px dashed, 10px end insets),
  drawn 4px (`--s1`) inside the orange. At 1x the tag's `--hair` ink
  (1.87:1 on orange) was faint (`perf-1x-hair.png`). Per the director's
  ruling, the contrast is raised within the tag's own family to `--paper`
  (2.46:1, `perf-1x-paper.png`), which is the paper showing through the
  holes. Nothing is added: no notches (they read as dots).
- **Header:** the three icon tiles sit at `--s1` (4px) gaps, with `--s1` to
  the stub. When the title is short on space, " list" drops first, then the
  count, then the city ellipsizes (REYKJAVÍK LIST (23) still fits at 390).
  The same order applies to plan names.

## The form while open (director fix 1)

- **Anchored to the band.** The form's bottom sits on the band and it grows
  upward. The map shows above in whatever height is left. Its fields are
  unchanged.
- ADD LOCATION sits `--s6` above the band at every height (664: y 536-580;
  844: y 716-760), and the × is directly below.
- The 2px navy rule that used to close the form's bottom edge moves to its
  **top** edge, still at the boundary between form and map. There's no rule
  against the band.
- The form layers above the map and under the sheet, so the dropping sheet
  *uncovers* it.
- Top padding is `--s6`, because nothing up top overlaps it any more. At
  664 the form's top is at y 140 and the account badge ends at y 66: 74px
  clear. If the form is taller than the space, it scrolls inside itself.
- The OSM attribution moves up with it and sits on the form's top edge,
  bottom-right of the visible map (licence: it stays on the map).

## States (one system with the header and the form)

| State | Field | Glyph | Same as |
|---|---|---|---|
| Rest | `--brand-orange` | navy + | ADD LOCATION at rest |
| Pressed | `--brand-orange-deep` | paper + | ADD LOCATION pressed |
| Open | `--state-on-bg` (navy) | paper × | any open header tile (filters, sort) |
| Pressed while open | keeps the navy tile | paper × | header rule |

- Signed out it looks identical, because + is the one control that should
  invite a tap; tapping offers sign-in.
- **One open tile in the band at a time:** opening the form closes filters
  and sort, so the filters tile goes back to outline as the stub goes navy.

## Feel / motion

- **Colour never fades (director fix 2): it switches.**
  - Pressing gives deep orange with a paper + (the existing press).
  - On release the field is navy with a paper glyph, in one step.
  - No frame ever shows a blend of orange and navy.
- **Tap +, list up:** the sheet drops to its band with its own collapse
  motion (transform, 0.3s ease, no new curve). The stub rides with it, and
  over the same 0.3s the glyph rotates 45° from + to ×. Only the rotation
  is animated. It's one gesture: the control turns as it goes. The sheet
  uncovers the form as it drops.
- **Tap +, list already down:** nothing moves. The field switches and the +
  turns into × in place.
- **Close:** the reverse. Navy holds through the press. On release the
  field switches back to orange with a navy glyph, the × turns back to +,
  and the sheet returns to where it was.
- **Press:** instant tone step (deep orange, paper glyph), like ADD
  LOCATION. No scale, no pop, no grow.
- Every frame of this motion uses existing tokens and timings. The only new
  motion is the glyph's rotation.

## Open (owner, batched by the orchestrator, with still 2)

- The × riding down 240px when the list is up is the button moving after a
  click. The owner decides (jobs.md Q1); the stills show the team's
  recommendation.

- At 844 the map above the open form is often empty, because the pins sit
  under the form (the map doesn't move, per job 4). It reads as map, not as
  a gap. Whether the map should re-fit its pins into the visible area is a
  how-it-works question; I'm flagging it, not deciding it.

## Seams flagged, not ours

- Account badge *open* = orange field with navy glyph, which is the stub's
  rest colouring. This goes to the sign-in crew or the brand-token pass.
