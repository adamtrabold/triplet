# Visual designer notes: icon system

## Where things stand (2026-10-13, concept phase, report 1)

Jam closed. Director's rulings (jam.md "Pass 2: design director: rulings"):
A killed (thumbnail under "considered and dropped"); B, C, D go forward;
one stroke KEEP; two checks KEEP (Inked check upright, carrier tilts);
rim star KEEP with a TRUE cut-out (mask); selection REPLACES the rim;
clusters shown orange AND ink, never darker than an open pin (owner Q6);
district redrawn; seals glyph-only placeholders; plan numbers kept.

Built so far:
- `concepts/lib/marks.js`: shared drawing lib (today + new glyphs, Line,
  Inked, pins for today/B/C/D, clusters, stand-in basemap, phone screen,
  rows). `lib/measure.html` -> `lib/opt-measure.json` (optical-area
  factors, hardcoded as TM_OPT_DEFAULT). `lib/fixture-data.js` is
  generated from systems' `fixture/fixture.json`; regenerate if it changes.
- Grammar sheet 2: `concepts/grammar/grammar-board-2.html` ->
  `g2-s0..s4a-{3x,1x}.png`. All 74 entries, rulings applied, optical-area
  table (today 6.3x spread -> new 1.09x), stroke check (16s don't read
  heavier, they read small; proposed move to 18, director's call), 40%
  swatch beside every open control and the off chip.
- C near moments: `concepts/c/near-moments.html?model=C` ->
  `near-{today,C,Cpad}-{day0,halfway,lastDay}-{3x,1x}.png`, squint blurs
  `sq-near-*-squint-3x.png`, `c-poi-check-{3x,1x}.png`.
- Canvas (version 10): boards IconGrammar2 (x5400,y0) and C_near_day0 /
  C_near_halfway / C_near_lastDay / C_poi_check (row y4400). B row
  reserved at y~2200, D at y~6400, Dropped after. Every board labelled
  "DRAFT · NOT REVIEWED". Canvas folder copy:
  scratchpad/iconcanvas/project (re-read canvas.json before every publish).
- Render scripts (scratchpad, not committed): shootel.js (screenshots each
  `.wrap > div[id]` child at DSF 3 and 1), meas.js.

## Findings to steer on

1. C squint: halfway and lastDay pass J1/J8. On lastDay the 3 starred
   to-dos are found first. Day 0 is identical to today except for the
   grammar.
2. C's OSM look-alike risk is REAL: the visited café glyph and OSM's café
   POI are near twins at phone size; a 4 deg tilt doesn't separate them.
   C-prime (rim off, paper pad kept) does, at the cost of some texture
   (pads) on lastDay. Director's choice: C or C-prime as C's resting state
   (or more tilt or ink texture, untested).
3. Visited stars stay orange and still pull a little on lastDay (owner Q3).
4. D at ~12px: the peel reads as a notch ("A peel is a peel"); D probably
   needs ~14px minimum or a bigger flap.
5. C selected visited vs selected open look alike (navy rim, glyph);
   the tag tells them apart, but note it.
6. In-shell glyph went 15 -> 16 after looking at phone size (15 read small).

## Next

B, C, D per the director's list: legend (systems), state matrix, mid/far
frames (clusters orange vs ink), list (stamp kept vs concept row), tag
(Brauð & Co / Kaffibarinn), storyboards. Then the D near moments and B near
moments. Dropped board for A.

---


## Where things stand (2026-10-13, end of jam pass 2)

- Pass 2 written in `jam.md`. Grammar sheet 1 (rough) in
  `concepts/grammar/`: `grammar-board.html` -> `grammar-3x-s0..s4.png`
  (rules / Printed / Line / Inked / concept-dependent visited). All 74
  entries, TODAY from inventory-png at real size above NEW. Rendered with a
  playwright script in the scratchpad that screenshots each <section> at DSF 3.
- Coordinator context: signed out = playground, the tag has no signed-out
  state, and 40% opacity is the one 'unavailable' look (nothing open or
  visited may look like it). The director's three voices: Printed / Inked
  by you / Line.

### Pass 1 (kept for history)

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

## Director objections (pass 1 steer) and my answers (pass 2)

- A Blaze: hollow = unchecked; day 0 noisy. + mine: un-visit would have to
  "fill back in" (no dry-up subject). -> I recommend killing A; draw day 0
  first to show it.
- B Second run: reads disabled; guide's voice, not the traveller's. -> tint
  = mix with paper, never opacity; visible misregistration; shown beside
  the 40% swatch. Still the weakest on voice.
- C Shell off: may read as an OSM POI; rows heavier. -> visited glyph in the
  Inked voice (seeded tilt +-6 deg, category ink, hairline paper knock-out);
  rows at 15px tilted, no ring. Motion: shell peels off on visit; un-visit =
  glyph dries up by thickness (shipped motion intact). MY PICK.
- D Sticker: still darkest; check erases category. -> (a) ~12px + one step
  lighter face, (b) cream category glyph instead of check (owner Q5).
- V5 ghost stamp as open state: dropped (reads disabled). Open = Line, full
  ink; the ghost is only storyboard frame 1.


## Open questions

1. Owner OK with no fine detail on pins (whimsy to motion + tag)?
2. Does tint (V2) read "disabled" to him?
3. Category ink value pass for D1 (overlaps with the brand-tokens pass)?
4. District/street: solid redraw or keep the dashed mirror?
5. V4: may the category glyph replace the sticker's check?

## Grammar commitments (sheet 1)

24 grid, 20 live area, r~1. Line stroke 2 (2.5 on the 50px seals), round
caps/joins, one x / + / chevron / Line check, at most one solid point per
Line icon, no text glyphs. Inked check = the shipped filled check with a
lean (VISITED marks only). One star, no keyline; the rim star on the map.
Shell = place, rim = Line stroke; selected = navy ring at the same 24px.
Glyph redraws: fork, cup, other = flag, district = parcel (looks like a
hex nut at 12 -> redo), street = ribbon, area = hatched plot. Cluster =
stacked shells in ink, not orange (OWNER Q: CLAUDE.md lists clusters as
orange).

## Next (pass 2 onward)

1. Grammar sheet 2: optical-area pixel count, district redo, cluster on the
   stand-in basemap, 40% swatch beside open controls and visited marks.
2. Day 0 / halfway / last day on the fixture: C, then D, then B; A day 0 only.
3. C storyboard (peel-off; dry-up), 5 frames each, tag + pin.

## Next (pass 1, superseded)

Director steers. Then concepts with systems: sketch V2's misregistration
and V4 at real size; test D1 with 40+ pins; draw the three-voice grammar on
a few controls (sort/filters/locate/× set) next to today's.
