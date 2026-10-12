# C. Pencilled pin: how it looks and feels (visual designer)

+ leaves the corner and becomes **a blank place on the map**: a pencilled pin
with a small luggage tag hanging from it that says **+ ADD**. Tap it, find the
place, and the pin stands on the spot with **a blank Hanging Tag, the form**,
hanging from it. ADD LOCATION inks the pin and the tag, and they become the
place's real pin and tag. The object you tap is the object you make. Structure
and measurements are in systems' `how-it-works.md`.

**Bigger scope, to tell the owner plainly:** this concept changes the add
form. Its fields move onto a tag on the map.

## Owner stills (3x, 1170 wide, real app from this folder's `index.html` copy, stub data, Reykjavík)

| # | File | What it shows |
|---|---|---|
| 1 | `1-rest-today-vs-C-3x.png` (raw `stills/1-rest-C-3x.png`) | Rest, list up, 390x844: today next to C |
| 2 | `2-add-strip-3x.png` (raw `stills/2a-tap-664`, `2b-search-664`, `2c-placed-664`) | The add at 390x664 (Safari): tap the blank pin, search (keyboard drawn), then the pin stands on the place with the blank tag |
| 2d | `2d-done-3x.png` (raw `stills/2d-done-844-3x.png`) | Added: the real pin and its real tag, row selected (844) |
| 3 | `stills/3-tag-open-3x.png` | Starred tag open, navy selected row, blank pin (844: clears) |
| 4 | `4-states-3x.png` | Blank pin at rest and pressed, at real 1x size, starring the blank tag (prints the band), District |
| 5 | `stills/5-320-copenhagen-3x.png`, `stills/5b-320-placed-3x.png` | 320 wide: rest, and the blank tag (fits without scrolling) |
| -- | `stills/7-collapsed-homescreen-3x.png`, `stills/2c-placed-844-3x.png`, `stills/desktop-*.png` | List down; adding at 844; desktop (appendix) |
| **pending** | `stills/pending-tag-664-3x.png`, `stills/pending-filters-664-3x.png`, `stills/2d-done-664-3x.png` | **Not for the owner.** Systems' two 664 failures, drawn in the new look for the director's ruling (the pin over the tag's VISITED segment; the pin above the screen with filters open) |

Re-render: `node stills.js` (`ONLY=<prefix>`), then `node ../compose-stills.js C`.
The look is `visual.inc.html`, layered on systems' `concept.inc.html`.

## The blank pin (rest): reads as "add" at 1x

- **Shape:** the app's own pin + Hanging Tag silhouette, in miniature. A 22px
  **pencilled ring** (2px navy, dashed 3.4/2.6 on `--paper-raised`) is a pin
  that hasn't been placed. A 1.5px `--ink-2` **straight string** runs down to
  a **44x31 die-cut tag**: the tag's chamfered top corners, a paper eyelet
  hole, `--brand-orange`. The tag says **+ ADD** in navy (Archivo 75% width,
  700, 12px, .06em). Box 52x66 at the map's lower right, above the OSM credit.
- **Why it reads as add:** it says so ("it says its own name": a real draw,
  and the director's objection 1). The words do the work, so no tooltip is
  needed. 1x check: `stills/st-pin-1x-1x.png`, "+ ADD" crisp at real size.
- **Why it isn't the FAB again:** it isn't a disc, it isn't filled, and it
  doesn't float with a heavy shadow. It's a tag on a string under an empty
  ring, a shape that only exists in Triplet. Its shadow is the tag's own
  restrained one (0.5px warm edge, 1px contact, 3px lift).
- **Colour:** orange = action (the owner: actions are navy or orange). The
  orange is on the tag, not on the pin, so it never reads as a starred pin or
  a cluster (both round).
- **Pressed:** the tag face goes `--brand-orange-deep` with paper words, an
  instant tone step, as ADD LOCATION.

## The search line (the band while adding)

- It takes the band's slot on the band's own paper, with a `--hair` line on
  top and no new navy rule. The left glyph is the same pencilled ring (24px)
  on the 56px spine. The field is the band: no input box and no orange focus
  ring; the caret and the keyboard show it's live. × is at the right end
  (cancel, the one cancel in this flow).
- Results are the app's existing dropdown, growing upward (unchanged).

## The blank tag (the form), in the tag's own type

The tag is built from the Hanging Tag's own parts: `.tag-shadow`/
`.tag-shape`/`.tag-stock` die-cut, eyelet patch and grommet, string, notches
and stub. It's the same width (316, or the screen less 32), the same paper
(`--paper-raised`) and the same shadow. It is a herbarium label (a real draw):
**printed captions, entries pencilled in until Add.**

| Part | Look |
|---|---|
| String | from the pencilled ring's foot to the eyelet's centre, 18px in (`--ink-2`, 1.5px), as the real tag |
| Name | `.tag-name` type: Archivo 62% width, 700, 26/28, `--ink` (from the pick) |
| Address | `.tag-addr`: 13/18 `--ink-2` (short form, street number + area) |
| CITY / TYPE | printed labels in the tag's `.tag-lab` (11px, 500, .12em caps, `--ink-2`). The entries are **pencilled**: the stamped TYPE's own type (75% width, 700, 14px, caps .09em, `--ink-2`) without the stamp's ink, on a **dashed write-in rule** (1.5px, `--ink-2` 55%) with a small caret. They sit on one line at 390 (`CITY REYKJAVÍK ⌄  TYPE ATTRACTION ⌄`) and wrap as whole fields when long (District) |
| Notes | a dashed write-in line, "Add a note" in `--ink-2` |
| Stub | the tag stub's perforation and notches, 60px. **STAR** (the tag's own segment: 20px star + 11px label) and **ADD LOCATION**, two segments wide, the brand-orange flood on the paper tooth (like the band), navy 15px. Paper perforation over the orange |
| Starred | tapping STAR prints the **orange band** across the top, exactly as on a starred real tag: the blank tag already shows what you'll get |

- "TYPE" replaces the form's "Category" label (the tag's word). The fields'
  values and options are unchanged.
- District / Street: the hint shows as a small `--ink-2` note above the stub,
  and Address isn't shown. The tag re-hangs taller (still `4-states`).
- New-city / shape-city confirms show inside the tag, as today (styles
  unchanged, not redrawn).
- 320: the tag (y 204-474) fits without scrolling. If it doesn't, `.tag-in`
  scrolls and the stub (Add) stays put; it's the tag's own `scrolls` rule.

## Feel / motion

The owner's own tag rules lead: "the tag should just pop down out of the pin
but end with a straight string"; stamp, don't draw; "should look like ink
bleeding in". Everything reuses existing motion except the pin's ink-in.

- **Press:** the tag face tone step, instant.
- **Tap:** the blank pin goes as the list drops (the sheet's 0.3s), and the
  band becomes the search line in the same move. Nothing flies across the
  screen.
- **Pick:** the map moves to the place (the tag's own pan, `TAG_PAN_MS`). The
  pencilled ring appears on the spot, then **the blank tag pops down out of
  it on its straight string**: the real tag's `tag-pop` and `tagString`
  animation (280ms), unchanged. "Work at a different speed" (a draw): the add
  is the slow, deliberate moment, so it uses the tag's full pop rather than a
  snap.
- **Star:** the band prints with the real tag's star treatment (same motion
  as starring a place).
- **Add (the inking):** three steps, so you see the pencil become ink:
  1. The pencilled ring is replaced by the real category pin, which **inks in
     through the dashes** (the stamp's ink-bleed, `tag-stamp-in` timing).
  2. The TYPE entry is **stamped** (the existing stamp-in, per-place tilt and
     texture), and the dashed write-in rules go.
  3. The stub's STAR | ADD becomes DIRECTIONS | STAR | VISITED (a 150ms
     crossfade inside the stub; the tag doesn't move).
  The list comes back up with the new row selected (systems' flow).
- **Cancel (×):** the reverse of the pop. The tag pulls back up into the
  ring, the ring goes, the map returns, and the blank pin comes back.
- **Reduced motion:** no pop and no ink-in. States switch.

## Where I pushed or reshaped

- **Killed systems' dashed teardrop:** a teardrop isn't this app's pin (pins
  here are round, category-ringed), and a dashed teardrop with a + reads as
  "drop location", a generic map tool. The ring + string + mini tag is our
  pin and our tag, so the pin and what it opens are one idea (the owner's
  bonus).
- **The blank tag is the real tag's structure,** not a dashed box. Dashes
  only where an entry goes (write-in rules), not around the tag. A dashed
  outline round the whole tag read as "placeholder", not "a tag to fill".
- **Add moved onto the stub** (the claim-check area the owner wanted for
  actions), with STAR beside it as on the real tag. One cancel: the band's ×.
  The tag has no × of its own while blank.
- The blank tag is 270px tall at 390 (systems' rough one was 364), so it
  hangs lower and the map shows more.

## On the two 664 failures (director's ruling; my visual view only)

- **Tag open:** the blank pin carries its own little tag, so with a real tag
  open there are **two tags on screen**, and the small one sits on the real
  one's VISITED segment (`pending-tag-664`). That's a visual argument for
  option (b), **the blank pin steps aside while a tag is open**: one tag at a
  time. It costs a tap to add with a tag open, and the director weighs that
  against job 1.
- **Filters open:** the pin would be above the screen (`pending-filters-664`).
  Nothing I can draw fixes that without putting + in chrome. "Close filters
  to add" is honest.
- At 844 both clear (still 3).

## Open

- **iOS zoom:** iOS Safari zooms into a field whose text is under 16px when
  it gains focus. The pencilled selects (14px) and the note (14px) would
  zoom. Builder options: a native select laid transparent at 16px over the
  printed entry, and Notes at 16px (one step larger than the real tag's
  notes). Not decided; it needs an iPhone check.
- `field-sizing: content` sizes the pencilled selects in Chromium only. Safari
  needs the overlay above.
- The new row after Add can land half below the fold (`2d-done-844`). Systems
  should scroll it fully in view, as a list tap does.
