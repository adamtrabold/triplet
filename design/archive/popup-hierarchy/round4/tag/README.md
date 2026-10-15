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
  - **B. Torn off** (dropped after review; no stills kept). The stub tears
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

## Fixes after `cd-review.md` and `ux-review.md`

- **B. Torn off is dropped.** Both reviewers killed it on the idea: the
  control moves. The owner sees **A. Punched** and **C. Stamped** side by
  side (`busiest` and `busiest-stamp`, plus the `punch*` and `stamp*`
  strips). The text above describing B is history.
- **The punch reads as a hole.** It's now 28px. The map shows through, in
  the tag's own shadow, with a soft shadow along the hole's upper rim and no
  outline (`stub-punch-crop@3x`: the street lines show through). If it still
  doesn't read as a hole to the owner at 1x, C goes alone.
- **Signed-out A looks disabled.** The hole's shadow and the stub dim to
  the state system's off alpha, as well as the label (`signedout`).
- **The chad is visible.** It's 30px, a paper check with a drop shadow,
  falling below the stub (`punch2`).
- **The pin matches the stub.** In every visited frame the pin is the
  shipped dark sticker with the cream check (`punch2`, `punch3`,
  `stub-punch`, `stub-stamp`, `stamp3`). Before the tap it is the
  unvisited pin.
- **Fewer circles under the pin.** The eyelet is a neutral paper grommet
  (`#CFC5B1`), and the header band's type icon is gone. The pin is the only
  category mark in that column.
- **Districts.** While a district's tag is open, its own diamond seal (the
  mark Plans uses for shape stops) sits at the anchor, and the string comes
  out of it (`shape`). This is a new transient map mark for shapes: an
  owner decision.
- **Stamp C is the real component.** It's the same `.row-stamp` DOM as the
  list rows (ring, dotted track, navy 82%, tilt), not new art.
- **One stroke for empty controls.** The ○ MARK VISITED ring is now 1.33px,
  the star outline's weight at 16px.
- **Address: the owner's short form.** "#1 since there's a directions
  button". It shows street + number · neighbourhood. The rule is the same
  as Card File's `shortAddr()`: drop a leading segment that repeats the
  name, join a bare house number to its street, keep the next segment. It
  never shows the place name, postcode, municipality or country. VEGA →
  "Rejsbygade · Humleby"; Aurora → "Fiskislóð 53 · Örfirisey". The only
  difference from Card File is the separator: "·" here, per the owner's
  example, and ", " in Card File. They should match; one designer will
  align. Whether the full string stays reachable by tap is UX's call, so
  the › is gone from the mock.
- **Motion order.** Tap (`pop0`), then the map pans and the list lowers
  with nothing tappable yet (`pop1`), then the tag grows out of the pin's
  foot (`pop2`), drops (`pop3`) and bounces (`pop4`, taps go live), then
  rest (`pop5`). Motion crops are a fixed 390×560 window at a true 3x.
- **Tall tags, the swap rule** (`swap`): a tap on any visible pin opens
  that pin's tag in one tap, replacing this one. The map stays draggable
  around the tag. A drag that starts on the tag moves nothing, and a pan
  doesn't close the tag.
- **The list while a tag is open.** Opening a tag lowers the list to its
  header. Closing the tag (× or a map tap) puts the list back at exactly
  the height and scroll it had; if you had collapsed it yourself, it stays
  collapsed. Tapping ▼ in the header while a tag is open closes the tag and
  raises the list, with the place's row still selected and scrolled into
  view. **For the owner, one line:** "while a tag is open, the list drops to
  its header."
- **Stub width.** It's still mostly empty to the right of one control. I
  left it: it's a single 52px full-width target. Filling it would mean
  adding information (a visited date isn't stored).

## Truth list (`docs/ux-brief.md`)

- **J1 identify:** the name in condensed lettering, with the address right
  under it and the type in the header band.
- **J2 decide:** the whole note at 14/20 ink, every length.
- **J3 Directions, J5 Star:** one tap each, in the button row.
- **J4 Visited:** one tap on the stub, which is a full-width target about
  52px tall. Undo is a tap on the same stub (A and C).
- **J6 plan stop:** "STOP 2 OF 3" in the header band.
- **J7 close:** a 44px × in the header band, plus map tap. Closing restores
  the list sheet.
- **J8 address:** the short form under the name. Full-string access is
  UX's call.
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
`signedout-unvisited`, `stub-off` / `stub-punch` /
`stub-stamp`, `busiest-stamp`, `swap`. Motion: `pop0`–`pop5`, `punch1`–`punch3`,
`stamp1`–`stamp3`. Pink lines and rings are annotations.

## Tensions not resolved

- **Full-length notes vs map cover.** A long tag still covers the middle
  column of the map below the pin, up to about 400px. I chose the note
  (owner's rule) over the map (UX soft default). The neighbours either side
  stay visible.
- **Lowering the list while a tag is open** is still my call. The owner
  hasn't ruled on it. It's what keeps the orange selected row from
  outranking the tag.
- **The punched hole shows the map through it,** so its contrast depends on
  the tiles under it. Real OSM tiles are unchecked; the basemap here is a
  stand-in.
- Chromium stills only; the motion timings are designed, not measured.
