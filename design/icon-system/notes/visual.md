# Visual designer notes: icon system

## Where things stand (2026-10-13, end of jam pass 1)

- Jam turn written in `jam.md` ("Pass 1: product designer (visual focus)").
  No concepts, no scoring yet.
- Sketches (3x, phone-readable, NOT concepts) in `concepts/sketches/`:
  `pin-states.html` -> `pin-states-3x.png` (every direction x 5 states at
  real size on an OSM-like tile + a 9-pin half-done trip x 6 directions);
  `row-states.html` -> `row-states-3x.png` (4 rows x 4 directions).
  Rendered with playwright from /opt/node22/lib/node_modules, chromium at
  /opt/pw-browsers/chromium-1194 (script was in the scratchpad: goto file,
  DSF 3, viewport 390, fullPage). Tiles are fake OSM-like, not real tiles.
- Read: owner.md, inventory.md, inventory PNGs + all context screens,
  CLAUDE.md, owner-taste.md, inspo, systems jam turn. Did not open the
  shared canvas artifact (inventory.md mirrors it).

## Key finding

At 24px on tiles only four channels survive: fill vs hollow, value (tint),
shell vs no shell, size. Folds, holes, relief and resting peels read as
smudges or glitches. Proposed rule: pins speak in big channels; whimsy
lives in motion and on the tag.

## Verdicts so far (mine, pending director)

- D1 Trail blaze: keep (strongest hierarchy). Risks: light inks (lavender,
  teal) weak as solid fields; a fresh trip is heavy; selected needs size +
  navy keyline ring.
- D2 Blind emboss: drop (reads as missing/disabled; far = blank).
- D3 Dog-ear: drop for pins (smudge at 24px, reads as a notch).
- D4 One slot: keep. Visual form = rim star (star on the ring at 12
  o'clock, no halo/keyline, one element instead of three).
- D5 grammar: three voices. Printed solid = identity + star. Drawn line =
  controls (one stroke per size, round caps/joins). Stamped = recorded
  state (VISITED, tag entries). Redraw district/street as solids; replace
  "other" dot.
- D6: merged.
- V1 Conductor's punch: tested, dropped for pins (bite/notch); maybe a motion beat.
- V2 Second run: keep. Visited = half-strength reprint + slight
  misregistration so it reads re-printed, not disabled. Misregistration
  not yet sketched.
- V3 Shell off: keep. Visited = shell falls away, bare inked glyph (paper
  hairline knock-out); far = small dot. Peel moves into the transition.
  Rows: a bare glyph is HEAVIER than a ringed one, so it needs a smaller or
  tinted glyph in rows; the stamp becomes a light struck word.
- V4 Small sticker: the keep-shipped pole (sticker ~14px near). Not sketched.
- V5 Ghost stamp in the tag: open = uninked dotted ring, done = inked; star
  open = orange line, done = orange fill.

## Proposed concept set

A Blaze · B Second run · C Shell off (+ V4 Small sticker optional), all on
rim star + one slot + three-voice grammar.

## Director objections

None yet (first round).

## Open questions

1. Owner OK with no fine detail on pins (whimsy to motion + tag)?
2. Does tint (V2) read "disabled" to him?
3. Category ink value pass for D1 (overlaps with the brand-tokens pass)?
4. District/street: solid redraw or keep the dashed mirror?
5. V4: may the category glyph replace the sticker's check?

## Next

Director steers. Then concepts with systems: sketch V2's misregistration
and V4 at real size; test D1 with 40+ pins; draw the three-voice grammar on
a few controls (sort/filters/locate/× set) next to today's.
