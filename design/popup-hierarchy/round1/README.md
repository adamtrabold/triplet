# Popup hierarchy: Round 1 concepts (visual designer)

Designer, 2026-10-05, on top of the UX analysis in `../ux-analysis.md`
(read it first: tiers T1–T4, jobs J1–J10, constraints C1–C10 in its section 7).
Round 1 of the designer / UX / CD loop. Nothing here edits `index.html`.

Owner, this task: "i want to fix the design of the popup -- it has awkward
heirarchy and spacing and doesnt follow our standards in that way. i also need
more ideas for displaying so *much* ndensity ... note that things dont *have*
to all be contained in the popup, they could be outside, or attached to the
side via a tab, etc. etc. explore many and varied ideas".

**Contact sheet for the owner:** `index.html` (self-contained, phone-readable).

## How the stills were made

- `render.js` loads the real app (`index.html`, unmodified) in the gesture
  harness (stub Supabase, vendored Leaflet + Archivo), patches the real rows'
  text into fixture rows exactly as `../render.js` does, then injects
  `concepts.js` and draws one concept on top of the live page: real markers,
  real list sheet, real row badges (copied from the list row's DOM), real row
  stamp, real tokens and glyph sprite.
- States: **busiest** = VEGA Copenhagen (starred, visited, Stop 2 of 3 in
  Plans view, 3-line OSM address, 5-line note); **bare** = Perlan (name
  only); **shape** = Grandi (Old Harbour creative district);
  **busiest-x** = the concept's opened / expanded state, where it has one.
- Files per concept folder: `<state>-phone@1x.png` (full 390x844 screen),
  `<state>-crop@3x.png` (the card area at 3x).
- `node design/popup-hierarchy/round1/render.js [concept ...]` re-renders;
  `montage.js <dir>` makes one review strip per concept.

**Not faithful / limits**

- Map tiles are blocked in the sandbox. The map is a **stand-in basemap**
  (an SVG street grid, harbour, park, a few street names) under the real
  markers, with the app's own tile re-tone filter. It is not geographically
  real; it is there so occlusion and legibility over a busy map can be judged.
- The 1x phone stills are box-downscaled from the 3x render, not native 1x
  rasterisation.
- Chromium only; Safari/iPhone unverified. No gesture or animation is shown.
- VEGA's data is patched into a Reykjavík fixture row, so its list row reads
  "BAR · REYKJAVÍK" (same as UX's renders).
- Concept 7's short locality line ("Rejsbygade · Vesterbro") is hand-written:
  the app stores only the OSM display string. Building it needs Nominatim's
  structured `addressdetails` saved at add time, or a parser.
- Close × is drawn at 44x44 in every concept (today it is Leaflet's 24x24).

## Shared foundations (the same in all 8 concepts, so the structures can be compared)

These are my calls as designer, applying the settled owner rules. Each
concept varies **where things live**, not these.

| Rule (owner) | How it's applied |
|---|---|
| "type should go back above the name" | A caps eyebrow above the name, in the row-meta voice (10px condensed caps, `--ink-2`): `BAR · STOP 2 OF 3`. The eyebrow mirrors the list row's `BAR · REYKJAVÍK` line, moved above. Stop n of m rides on it (it describes the place in this view, like the city does in the row). |
| "icon is treated differently for category in the pop up than on the map" | The category mark is **the list row's badge itself** (24px seal in the 28px glyph column, copied from the row's DOM), so popup = row = pin seal. Concept 6 goes further and drops the card icon: the pin is the icon. |
| "No star unless it's been starred" | A filled ink star leads the name only when starred (the row rule). The star **control** sits in the action row, in a fixed slot, hollow or filled. It never changes place with state. |
| "A measured spacing system ... used everywhere" | Only `--s1..--s8`: card padding 12; 28px glyph column + 12 gap, so text starts 40px inside the card (the popup's version of the 56px spine: one left channel for badge, compass and text); visible gaps eyebrow→name 0, name→notes 8, notes→address 8, last text→action word 16 (the 44px target's own air), action word→bottom 16. |
| "one solid left channel", "align optically" | Badge, compass and (in the sheet/drawer) every left glyph are centred on one x (the 28px column's centre); all text starts on one x. |
| Visited language (stamp on rows, sticker on pins) | Visited **on** = the row's stamp itself (same component, same tilt per place), in the visited control's slot. Off = the shipped ring + MARK VISITED. One visited look in list and card; the navy "VISITED ●" dot is gone. (Concept 7 uses the pin sticker's dark disc + cream check instead, since its rail can't fit a 72px stamp.) |
| Notes are the user's own words | 14/20 roman `--ink`, line breaks kept (`pre-line`). Not italic, not grey. |
| Address is tier 4 | Last, 12/16 `--ink-2`, or folded away. |
| Directions | The shipped text button (compass + condensed caps, `--figure-deep`): the card's only colour. Copy shortened to **"Directions"** so three actions fit one 300px row; flagging, as the owner's copy was "Get Directions". |

Hierarchy aimed for (UX's intended order): name + type → your marks → notes →
actions → address.

## UX calls I'd question (input for the loop, not overrides)

- **Stop n of m** — UX lists it as tier 2 ("Plans only ... low if it moves").
  I put it in the eyebrow with the type: it costs no extra line, reads at
  type's volume (quiet), and it is the view's context, like the row's city.
  If UX or the CD wants it gone from the card, every concept still works.
- **Type "can be light, not absent"** because the pin shows it — agreed; I
  read that as licence for Concept 6 to remove the card's icon entirely.
- **Star toggle tier 3** — agreed. I kept it as a quiet text/icon button in the
  action row rather than a leading control, which is what made the star "look
  weird" (UX M6): the leading star is now a pure mark, so it can align to the
  name line and nothing else.

## The concepts

Measured popup heights are the card only (the busiest popup today: 327x282;
bare: 162 tall).

### 1. Quiet Fix (baseline)

**Idea:** today's popup, fixed: type above the name, measured spacing, notes
promoted, address last, one action row.

- **Where tiers live:** all in the popup. T1 eyebrow + name + leading star;
  T2 notes then the action row (Directions · Star · Visited stamp); T3 ×,
  star control; T4 full address under the notes.
- **Density:** none hidden. Busiest is ~300 x 300 (taller than today's 282,
  because notes went from 12px grey to 14px ink); bare drops to ~98 tall.
- **Truth list.** Jobs: J1 eyebrow + name first; J2 notes at reading size
  right under the name, star + stamp visible; J3/J4/J5 one tap each, 44px
  targets, ≥16px apart; J6 eyebrow; J7 44px ×, map tap; J8 address always
  shown; J10 unchanged. Control parity: star + visit + directions as today;
  rows keep swipe. Hierarchy by weight at 1x (busiest): name ≈ notes block >
  Visited stamp > Directions (colour) > address > eyebrow > ×. Convention:
  standard map callout; close top-right; actions in one bottom row like iOS
  Maps callouts.
- **Weak spots:** still covers ~55% of the map strip when busy; the notes slab
  now outweighs the name by mass (it's the user's words, but it competes);
  the stamp + "Starred" sit close together and both say state; nothing about
  density is solved, only ordered.

### 2. Folded Note

**Idea:** the popup shows a peek: type, name, two lines of notes with
"More", actions. More unfolds it upward in place; the action row never moves.

- **Where tiers live:** T1 + T2 actions always; notes as a 2-line peek; T4
  address only in the unfolded state (labelled ADDRESS); "Less" folds back.
- **Density:** busiest peek ~300 x 146 (half of today's); unfolded ~338 tall.
  The popup grows **up**, away from the pin, so the actions stay where the
  thumb found them.
- **Truth list.** J1 first glance; J2 the note's start is visible, full text
  one tap (C8); J3–J5 one tap; J6 eyebrow; J7 44px ×; J8 one tap (More);
  J10 opens folded. Parity as 1. Hierarchy (peek): name > Visited stamp >
  notes (2 lines) > Directions > eyebrow > More. Convention: "more" text
  truncation (iOS App Store / Messages pattern) inside a callout.
- **Weak spots:** an unfolded busy popup is as tall as Concept 1's; "More"
  is a second figure-deep word in the card (two colour accents); a place
  with an address but no note needs a different peek line (rendered: none of
  the three states has that case).

### 3. Place Sheet  *(content leaves the popup)*

**Idea:** no popup. Tapping a pin hands the bottom of the screen to the
place: a sheet in the list sheet's slot, header band like the list header,
an action strip, then notes. Drag/tap up for everything.

- **Where tiers live:** T1 in the sheet's header band (badge on the 28px
  spine, eyebrow, name, × in the header's action column, the list-header
  layout exactly); T2 the action strip (three equal 52px cells) + notes
  (3-line peek); T4 address in the raised state. The map keeps only the
  selected pin (no callout).
- **Density:** sized to content: busiest peek 214px, bare 141px, district 157px (2-line name)
  (the map gets the rest of the screen); raised busiest 334px with the full
  note and address. Nothing ever covers the map above the sheet.
- **Truth list.** J1 header; J2 notes in the sheet, map stays clear for
  "what's near"; J3–J5 one tap, big targets (130 x 52); J6 eyebrow; J7 ×
  in the header + map tap; J8 raise the sheet; J10 a list tap → map arrives
  → sheet opens (same item, no popup). Owner rule "The header should show
  whatever the list is" — the header names the place. Parity: the list is
  under the sheet; rows keep their gestures when it closes. Hierarchy:
  name > Visited stamp > notes > Directions > Star > eyebrow. Convention:
  Apple/Google Maps place sheet.
- **Weak spots:** the list disappears while a place is open (you can't
  glance at the next row) and must come back exactly as left (C9); the sheet
  height changes per place, so the map edge moves (owner: "controls don't
  move or grow" was about the Plans/Places panel, but it may apply); the
  action strip's hairlines are two more rules on screen.

### 4. Row Unfolds  *(content leaves the popup)*

**Idea:** the list row is the card. Tapping a pin selects its row (the
shipped figure-deep block), the sheet rises and the row unfolds notes,
address and actions under itself. The map keeps a small name flag.

- **Where tiers live:** T1 twice: a name flag on the map (identity at the
  pin) and the highlighted row (badge, name, stamp, eyebrow-free meta as
  today); T2 notes + action row in the unfold, on the row's text column;
  T4 address in the unfold.
- **Density:** the unfold is just paper under a row: busiest needs ~250px,
  so the sheet rises to 480 and the map strip shrinks to 364.
- **Truth list.** J1 flag + highlighted row; J2 notes in reading position;
  J3–J5 one tap; J6 the row's stop number; J7 tap the map/row (**no ×**, the
  row collapses: a gap against C6 unless a × is added); J8 visible; J10 the
  list tap simply unfolds the row (fixes UX S1/S2: map tap and list tap
  become one selected state). Parity: strongest of all — the row and the card
  are one object; swipe-star / swipe-visit stay on the row. Hierarchy:
  highlighted row block > notes > stamp > Directions > address. Convention:
  accordion / expanding list row.
- **Weak spots:** **type is not above the name** in the row (it's the
  row's meta line below, owner's rule unmet) unless the row layout changes;
  the sheet grows to 480 (against "controls don't move or grow"); a place
  that's filtered out of the list can't unfold; on a busy list the unfolded
  row may sit at the bottom (rendered: the shape row is last and can't
  scroll to the top).

### 5. Side Tab  *(content leaves the popup)*

**Idea:** the popup is the glance (type, name, three actions). A paper index
tab on its right edge, "NOTES", opens a side drawer with everything.

- **Where tiers live:** T1 + actions in a small popup; T2 notes and T4
  address in the drawer; the drawer repeats the header and actions so it
  stands alone. The tab only appears when there is a note or address (C10).
- **Density:** busiest popup ~268 x 98 (a third of today); drawer 318 wide,
  full map height, with the pin panned into the 60px strip left of it.
- **Truth list.** J1 + J3–J5 in the popup, one tap; J2 one tap (tab);
  J6 eyebrow; J7 × in both; J8 tab; J10 opens the small popup. Parity as 1.
  Hierarchy (popup): name > stamp > star > Directions > eyebrow > tab.
  Convention: index tab / side drawer (desktop maps, iPad), which is less
  common on a phone.
- **Weak spots:** the drawer covers ~84% of the map width, so "what's near"
  is lost while reading notes; the pin squeezed into the left strip is close
  to Safari's left-edge back-swipe zone; the 24px tab is a small target
  (76px tall, 24 wide: below 44 in width); a vertical caps word is slow to
  read.

### 6. Map Label + Dock  *(content leaves the popup)*

**Idea:** split by tier. Type and name are printed **on the map** next to
the pin, like a map label (no box). The rest docks as a card just above
the list sheet.

- **Where tiers live:** T1 on the map (eyebrow + name + star, paper halo
  text; the pin itself is the category icon, so map and "popup" icons
  are the same object); T2 notes (2-line peek) + action row in the dock;
  T4 address in the raised dock; × on the dock.
- **Density:** the map has no box over it at all except the dock (~110 tall
  busiest, ~60 bare); raised dock ~250.
- **Truth list.** J1 at the pin, nothing hides neighbours (UX M5); J2 peek
  + one tap; J3–J5 one tap, thumb zone; J6 eyebrow on the label; J7 × + map
  tap; J8 raise; J10 list tap → fly → label + dock. Parity as 1. Hierarchy:
  name label > notes > stamp > Directions. Convention: Google Maps' bottom
  card + map labels.
- **Weak spots:** the dock has no name in it, so it relies on the selected
  pin being on screen; the label can collide with other pins' labels or
  street names on a real basemap (stand-in map here is calmer than OSM);
  the dock covers the OSM attribution, which must stay visible (needs a new
  home); two pieces to look at instead of one.

### 7. Action Rail

**Idea:** two columns: content on the left; the three actions stacked in a
rail on the right (icon over word). The address shrinks to a street ·
neighbourhood line with "Full address".

- **Where tiers live:** T1 top-left; T2 notes in the column + the rail; T3
  ×  above the rail; T4 a locality line, full address one tap.
- **Density:** the address drops from 3–4 lines to 1 + a link; busiest ~312
  x 270. But the text column narrows (notes wrap to 8 lines).
- **Truth list.** J1 first; J2 notes; J3–J5 one tap, each a 64 x 56 tile;
  J6 eyebrow; J7 44px ×; J8 one tap; J10 unchanged. Parity as 1.
  Hierarchy: name > notes > rail glyphs (Go colour, star, sticker disc) >
  locality. Convention: vertical action rails (YouTube Shorts / TikTok,
  iPad toolbars); unusual in a map callout.
- **Weak spots:** the bare popup is tall for no content (the rail sets the
  height: ~210 for a name only); the rail's tinted field is a box (owner:
  no heavy boxes); "Go" is new copy; locality needs structured address data
  the app doesn't store.

### 8. Luggage Label  *(wildcard)*

**Idea:** the selected place is a hotel luggage label: a figure-deep band
with the map seal and the name in the condensed caps voice, paper below.

- **Where tiers live:** T1 in the band (seal = the map pin exactly: paper
  field, category rim and glyph; eyebrow; name in condensed caps); T2 notes
  + action row on paper; T4 address under the notes.
- **Density:** as Concept 1 (all shown); the band makes the name win at any
  density.
- **Truth list.** J1 the strongest first read of all eight; J2–J8 as
  Concept 1. Figure-deep is the colour the app already uses for "selected"
  (the highlighted row), so the colour says "this one". Hierarchy: band
  (name) >> notes > stamp > Directions > address. Convention: brand
  (inspo: Hotel de la Poste, Savoy labels), not a UI convention.
- **Weak spots:** a big block of colour (owner: colour must communicate; it
  does say "selected", but it's loud); long names run to 3 caps lines
  (Grandi); Directions in figure-deep under a figure-deep band loses its
  "only colour" signal; most likely to be called decoration.

## Files

- `concepts.js` — the eight concepts (page-side), shared parts, stand-in
  basemap.
- `render.js` — renders every concept/state; `montage.js` — review strips;
  `build-sheet.js` — builds `index.html` from `_sheet/`.
- `<concept>/<state>-phone@1x.png`, `<concept>/<state>-crop@3x.png`.
- `_sheet/` — the JPEGs embedded in `index.html`.
