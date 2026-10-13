# Claim-check stub: how it looks and feels (visual designer)

## Round 5 (2026-10-13): pushed so it isn't "boring" at rest

Owner: "The plus in the list header looks like an add button but is boring."
He read it right ("looks like an add button"); the failure was the rest
state: a flat orange rectangle, with the claim-check idea living in a dashed
rule he can't see at phone size. The home, the + and every behaviour below
are unchanged. Only the look at rest changes, through **the outline, the
paper and how the + is printed**. No marks are added.

### Owner stills (3x, 1170 wide; real app, real `index.html` read in memory + `r5.inc.html`; Reykjavík)

| # | File | What it shows |
|---|---|---|
| A1 | `A1-vs-float-3x.png` | Rest, beside the **floated badge** (the baseline pick), plus the cost line |
| A2 | `A2-close-up-1x.png` | The + area at 1x (the same 240x240 window as the baseline's), drawn pixel for pixel |
| A3 | `A3-rest-3x.png` | Full screen, list up |
| A4 | `A4-states-3x.png` | Rest / pressed / open, the header band only |
| A5 | `A5-adding-3x.png` | Form open (the drop; same flow as round 3) |
| A6 | `A6-tag-open-3x.png` | Starred tag open, navy row |
| A7 | `A7-list-down-3x.png` | List collapsed, Home Screen |
| A8 | `A8-320-3x.png` | 320 wide: COPENHA… |

Raw: `r5/*.png`, `r5/measure.json` (`clash` from `chrome-check.js`: **clean
on every frame**). Re-render: `node r5-stills.js` (`ONLY=`, `A=` for the
variant study), then `node ../compose-r5.js`.

### What changed (variant `ticket`, the pick)

- **Outline: a die-cut ticket, not a slab.** The stub's two corners on its
  torn side (left, top and bottom) are cut with concave quarter-round bites,
  10px radius. These are **the Hanging Tag stub's own notches** (the tag cuts
  5px half-rounds at both ends of its stub's perforation). On the stub they
  sit at the ends of its perforation, so it reads at 1x as a coat-check
  ticket torn off the band. Coat check was a real draw this round. The map
  and the header's paper show through the bites. No new colour, nothing
  drawn.
- **The perforation** keeps the tag's rule (1.5px dashed, paper ink on the
  orange), now 6px in and 14px short of each end, so it runs between the two
  bites like a real tear line.
- **Paper:** the orange is printed on the tag band's own paper tooth
  (`--tex-flood`, 160px tile), the owner-approved "paper, not clouds". The
  open (navy) and pressed (deep orange) stock carry the same tooth, because
  it's the same ticket.
- **The + is printed bolder:** navy, 28px box, 19px arms at a 3px stroke,
  round caps (the app's lightly rounded icon language). Today's badge: 12.8px
  at about 2.3px. Round 3: 14px at 2.75px. It's crisp, a printer's mark and
  not a clerk's stamp (stamps are for the clerk's entries only), and it's
  centred on the stock to the right of the perforation (4px optical shift).
- Width (60), place (the header's right end, flush to the screen edge),
  states, motion and form are as in round 3 below.

### Tried and dropped (the study: `r5/study-*-1x.png` / `-3x.png`)

- **wave**: the tear edge cut as the badge's own scallop, straightened (8px
  period, 3.5px deep). It reads at 1x, but as **pinking shears** (fabric),
  not a torn ticket.
- **postage**: perforated bites on all four edges, inset in the band. It
  reads as **a stamp stuck on the header**: more decoration, less "add", and
  stamps are already the visited mark's language.
- **seal** (draw: "use an old idea"): the ticket with today's navy scallop
  printed on it, an orange + inside. It ties to the badge, but it's **two
  marks for one button**, the + shrinks to 20px orange-on-navy, and it
  reads as "the badge in costume". Simple simple simple: dropped.

### Bar check

At 1x beside the floated badge (A2), the stub is the louder, more particular
object: a cut orange ticket with a heavy +. It still says "add" before
anything else, because the + is the biggest mark in the header. Whether it
beats the badge on the owner's "more interesting" is his call. I think it
clears "boring" without decoration. The cost line on A1 is systems'
measured one (turn 16; my first draft said 60px, the stub's width, but the
tighter icon spacing wins 28 back): "The list title gets 32px shorter:
'list' drops first, and at 320 the count too."

### Open (round 5)

- The open state's navy stock carries the paper tooth, unlike the header's
  other ON tiles (flat navy). I kept it because it's the same ticket; the
  brand-token pass may want ON tiles to stay flat.
- 320: the title loses "list" and the count, then shortens (COPENHA…), as in
  round 3.

---

## Round 3 (history)


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
