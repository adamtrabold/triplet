# Hanging Tag v2 (round 4)

Designer, 2026-10-05. The owner picked Hanging Tag from the finalists
(`../../finalists/index.html`). This is v2, built from the owner's notes.
Concept stills only; `index.html` (the app) is untouched.

## Owner's notes (verbatim)

"i really like the hang tag with a few notes —

1. i think the tag should just pop down "out of" the pin but end with a
straight string.
2. the heirarchy of content is still imperfect. the rip off tag is really
interesting and it draws attention... i wonder if the address shouldn't be
closer to the place name (as sometimes the address *does* matter at a
glance, if something has multiple locations or something), and the hang tag
shouldn't be the "meta data".. i also feel like theres some sort of unique
thing we could do on the rip off area if visited is in there.
3. long notes should just show full length - the flip over is meh."

The three taste rules are in `docs/owner-taste.md` (2026-10-05).

## How each note was handled

**1. Pop out of the pin, straight string.** The swing is gone. The tag
grows out of the pin: it starts at about 18% size at the pin's foot, drops
about 14px past its rest so the string pulls taut, bounces back once and
hangs still. The whole move takes about 280ms. The string is a straight
vertical line from the pin's foot to the eyelet, about 32px long. See
`pop0`–`pop4`. Tap targets are live at their resting positions from the
first frame, and reduced motion shows the tag at rest with no drop.

**2. Hierarchy.**
- **The address sits right under the name.** It's one line (12px,
  `--ink-2`) with a › for the full string, so "which VEGA / which Aurora" is
  answered at a glance.
- **Metadata moved into the tag's printed header band.** The seal and type
  line (`BAR · STOP 2 OF 3`) sit in the band left of the eyelet, with the ×
  on the right. That's where a real tag prints its fixed fields, so type
  reads as tier 2 and stays off the content.
- **The stub holds Visited only.** It's the Mark visited button (44px+),
  and the visited state is the stub's "unique thing". There are three
  variants, each with motion:
  - **A. Punched** (`stub-punch`; motion `punch1`–`punch3`). A conductor's
    punch cuts a check-shaped hole through the stub, the map shows through
    it, and the check-shaped chad drops out. This is my lead pick. It's
    something only a paper tag can do, and it repeats the check from the
    pin's visited sticker and the row stamp, so it's one visited idea with a
    new physical act. Shown in `busiest`.
  - **B. Torn off** (`stub-tear`; motion `tear1`–`tear3`). The stub tears
    along the perforation and drops away. The visited mark is the tag's torn
    deckle edge, and a ✓ VISITED control joins the button row so you can
    undo it. Most dramatic, but it adds a third button when visited and loses
    the stub as a fixed slot.
  - **C. Stamped** (`stub-stamp`; motion `stamp1`–`stamp3`). The list's own
    VISITED stamp comes down on the stub (grow, then shrink). Most consistent
    with the list, and the least new.
- **No empty marks.** Not visited, the stub is a labelled control
  (○ MARK VISITED), not a ghost mark. The star is only filled when starred.

**3. Long notes at full length.** There's no turn-over and no fold. VEGA
(`busiest`) and the 8-line approx note with its paragraph break (`approx`)
show whole. The tension with covering the map is handled like this:
- While the tag is open, the list lowers to its header (the app's own
  collapsed state, unchanged since round 3; the owner hasn't ruled on it).
  The map is then about 780px tall.
- Opening pans the pin to near the top (y≈112), so the tag has the whole
  strip below it. The tallest real note (357 characters, the approx pin)
  makes a tag about 400px tall, which ends around y≈560 with about 220px of
  map still clear below.
- The tag is 316px wide, so a strip of map stays visible on each side.
- Only a tag taller than the space left would scroll inside, with a fade.
  No real row in the data does.

## Truth list (`docs/ux-brief.md`)

- **J1 identify:** the name in condensed lettering, with the address right
  under it and the type in the header band.
- **J2 decide:** the whole note at 14/20 ink, every length.
- **J3 Directions, J5 Star:** one tap each, in the button row.
- **J4 Visited:** one tap on the stub, which is a full-width target about
  52px tall.
- **J6 plan stop:** "STOP 2 OF 3" in the header band.
- **J7 close:** a 44px × in the header band, plus map tap. Closing restores
  the list sheet.
- **J8 address:** the line under the name, with the full address on tap.
- **J10 from the list:** list tap → fly → the tag pops out of the pin.
- **Signed out** (`signedout`, `signedout-unvisited`): Star and the stub
  are visible but disabled (state system off alpha). Directions stays live;
  the owner hasn't answered that one yet.
- **Hierarchy at 1x (busiest):** name > note > address ≈ Directions (the
  only colour) > stub > header band. Pins are unchanged.
- **Convention:** a map callout reshaped as a tag; the stub as a button is
  new and is labelled with a verb.

## Files

- `stills/<name>-phone@1x.png` and `<name>-crop@3x.png`.
- `_sheet/` has the JPEGs and `captions.json`.
- `render.js [name ...]` re-renders (real app in the gesture harness, real
  rows, stand-in basemap). `tag.js` draws the tag; the helpers come from
  `../../round3/concepts.js`.

States: `busiest`, `typical`, `approx`, `bare`, `shape`, `signedout`,
`signedout-unvisited`, `stub-off` / `stub-punch` / `stub-tear` /
`stub-stamp`. Motion: `pop0`–`pop4`, `punch1`–`punch3`, `tear1`–`tear3`,
`stamp1`–`stamp3`. Pink lines and rings are annotations.

## Tensions not resolved

- **Full-length notes vs map cover.** A long tag still covers the middle
  column of the map below the pin, up to about 400px. I chose the note
  (owner's rule) over the map (UX soft default). The neighbours either side
  stay visible.
- **Lowering the list while a tag is open** is still my call. The owner
  hasn't ruled on it. It's what keeps the orange selected row from
  outranking the tag.
- **Torn-off (B)** makes the visited control move into the button row once
  the stub is gone, which brushes against "controls don't move". Punched (A)
  and Stamped (C) keep one slot.
- **The punched hole shows the map through it,** so its contrast depends on
  the tiles under it. Real OSM tiles are unchecked; the basemap here is a
  stand-in.
- Chromium stills only; the motion timings are designed, not measured.
