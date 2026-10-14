# The blank-tag form: how it looks and feels (shared by C and Float)

## Round 10 (owner: "too low on the screen … visually weighted center … not pinned, then as it's being filled out the background changes and it looks pinned once there's an address … the dropdowns are very awkward"; then "i meant *visually centered")

Frames `r10-*`; stills `R10-F1`-`F4`.

- **Unpinned until there's an address (R10-F1).**
  - While you type, and on a blank card with the keyboard down, the map is washed back: `--paper` at 78% over the map panes, under the credit and the controls (they stay readable).
  - The tag is a card on paper, not on a place: no pin, no string, an empty eyelet.
- **Pinned once there's an address (R10-F2).**
  - On the pick, the wash lifts, the map is the place, and **its pin stands above the tag on the real string**. It's the type's own pin (selected grammar), so it changes with TYPE.
  - The map moves once here; systems owns how. Nothing is saved until ADD.
- **Visually centred.** The tag's own centre (the heavy part; the pin and string above are light) sits at the open area's **optical centre, 45% down**: the open area runs from the account badge's foot + 8 to the credit − 6.
  - If the pin would leave the open area, the tag sits just low enough to keep it in.
  - At 664 that's tag top 154 (pin and string clamped); at 844 it's 216. The keyboard-up dock is unchanged (it's already at the top).
- **The dropdowns are gone.**
  - **TYPE = pick your pin:** a sideways row of the app's own pins at 32 (ring grammar). The guess comes first and is selected: filled, with a navy ring around it. The row scrolls, with a part pin at the edge saying there are more. The printed TYPE caption is followed by the picked name in pencil.
    - Choosing a type is choosing the pin you'll get, and the pin above the tag shows it.
  - **City** is plain pencil at the end of the address line ("Barónsstígur 45a · Reykjavík"). It isn't a control: it's inferred, and the new-city / which-city questions handle the rare wrong case.
    - **Open for systems:** a way to correct a wrong but known city. My lean is re-picking the result, or a long-press; not a visible control.
- **Kept from round 9:** the pencil, the 32 rhythm (TYPE's caption row 28 and the strip 40), questions in the stub, ADD navy.


## Round 9b (director round 9 fixes 5)
- **Control rows are 40:** address · city and TYPE (the chip rows), so tap areas never clip or overlap. NOTES stays 32. The filled card is 264 tall at 664 (foot 581).
- **The OSM credit is visible in every state.** The "hidden while docked" rule is gone: docked, the list has dropped to its band, so the credit is under the keyboard; carded, the foot clears it by 6.
- Re-shot: T0-T9, A3, A5.

## Round 9 (director turn 38). This overrides everything below where they differ.

- **The filled tag is a card in the screen's frame; the map stays still.**
  - Docked above the keyboard while you type (T1, T2), and on the list's band once the keyboard drops (T3). Its foot is 6 above the map credit (581 at 664, 485 at 320) and ADD is under the thumb.
  - There's no pin and no string while you fill it in. **The eyelet is empty**: the hole and patch are shown, the string is gone.
  - The map behind is whatever you were looking at, not moved.
- **ADD is the one map move (T5).** The map flies so the place lands at the tag's hanging point (the pin's spot above the eyelet). The pin drops in on the string, the pencil inks, TYPE is stamped, and the tag tightens to the real tag by its top while the stub stays put (round 8b).
  - Motion: the flight (the existing fly duration), then the pin drops 12px into place with the tag-pop's settle, then the ink-over.
- **Districts (T6):** same card; on ADD the map frames the outline and the tag hangs from the centre dot.
- **Questions: the answers ARE the stub (T7).**
  - The question prints just above the perforation: printed caps lead-in plus one sentence, 13/18.
  - The stub becomes two segments in the real segment style:
    - **ADD LISBON** (ADD's navy flood, cream + icon);
    - **PICK FROM MY LIST** (an ink segment with a list icon, the same build as STAR / MARK VISITED).
  - "ANSWER ABOVE" is gone. After the answer, the stub returns to ADD | STAR | VISITED.
  - Shapes' "which city": NEW CITY | the runner-up.
- **The tappables audit (T9).** Every tappable uses a control the app already has:
  1. **×**: the tag's own.
  2. **City** and 4. **TYPE**: **the filter chip** (`.filter-btn`): hair outline, 3px corners, caps.
     - The entry is in pencil, followed by a ⌄.
     - TYPE carries the category glyph and its ink rule, so it previews the pin.
     - The chip is 25px tall; its hit area should be padded to 44 (builder).
  3. **NOTES**: a write-on line with its caption. The whole 32px row is the target.
  5. **ADD**: the navy segment. 6. **STAR** / 7. **MARK VISITED**: the shipped segments.
  - The pencil chevron after a bare word is gone: it didn't read as a control.
- **The demo place's TYPE is ATTRACTION** (director's mapping row for pools and sports centres).


## Round 8b (visual, after the round-8 score). This overrides the round-8 section below where they differ.

- **One rhythm:** each line is a 32px row with the rule at its foot.
  - The entries sit on their rules in their inked faces: name 26/28, address 13/18, note 14/20, TYPE 14 caps.
  - An empty line's caption prints on its own line, small caps `--ink-2`, and the entry replaces it. Only NAME, while docked, keeps its caption under the rule, in its own 16px band.
  - The picked tag is 248 (the real tag with an address is 196, plus the NOTES row). There's no empty band (T3, T4, T6, T7).
- **ADD (T5, two panels):**
  - The pencil inks, TYPE is stamped, the pin turns to the place's icon, and the rules and captions go.
  - The tag tightens to the real tag by its top edge coming down, with the map moving with it, so the stub (ADD → DIRECTIONS) never moves. One 300ms ease for the shrink and the pan together.
  - The list stays at its band until you close the tag.
- **Demo place:** now Sundhöllin, the pool on Barónsstígur. At these pans nothing sits under the account badge in any frame the owner gets.
- **320 typing:** results start at 72 and NAME's caption is hidden; 3 rows and a peek (T8).

## Round 8 changes (visual, after director turn 36). These override anything below that disagrees.

- **Graphite, not grey (fix 1; `T0-pencil-vs-greyed-1x`).**
  - Pencil entries are a cool, dark graphite: `--graphite` #3F454E with `--graphite-hi` #6A717C as a faint sheen (a 172° gradient through `background-clip: text`).
  - The grain is visible at 1x: short streaks at a writing angle (fractal noise 0.05 × 0.95, rotated -28°) used as a mask over a 50% floor. It's seeded per entry (`pencilMask(seed)`), so no two entries share a grain.
  - The face and size are the inked entry's. The caret and the chevrons are graphite too.
  - Why it doesn't read as disabled: disabled in this app is the warm ink faded (signed-out Star and Visited, `--state-off-alpha`). Graphite is darker, cooler and textured.
  - Printed inactive ADD stays `--ink-2` small caps: that is print, and its meaning ("not yet") is right.
  - T0 puts the four side by side at 1x, blown up 3×.
- **A whole blank tag from the first frame (fix 2; `T2`, `T1`).**
  - The blank tag is a ruled tag: NAME, ADDRESS · CITY, NOTES and TYPE are printed rules with small-caps captions under them. The rules are spread evenly down the tag (flex `space-between`, 10px minimum gap).
  - `.tag-in` is at least 256 tall, so the tag is 316 with its stub, and **the stub sits where it will stay.** At 664 docked it is behind the keyboard (330-390).
  - While typing, the offers print over the lower lines: an opaque paper panel from 89px down to the stub, 48px rows. The tag's outline and stub don't move.
  - After a pick, the same ruled tag hangs on the place with the entries in pencil on their rules. The NAME and ADDRESS captions drop once those lines are written; NOTES keeps its caption while it's empty.
  - On ADD the rules and captions lift (a 200ms fade) as the tag tightens to the real tag. The real tag has no rules, and the blank must become exactly it.
- **Journeys cut to two panels** (fix 3). `P3-tap` and `A3-tap` show rest and tapped, at 575 each. Pick → ADD → after is T3 + T5.
- **Crops (fix 4).** T2 is now two whole phone frames. T7 and T0 are re-cropped clean.
- **The Float frame (A5)** now shows the tag clearing the badge: with the taller tag, the badge's navy × needs the map panned so the tag's foot is 12 above it. This is a Float cost, noted for systems.


Visual, concepts turn 1 (2026-10-14). The structure is in `how-it-works.md`; this file covers the look and the motion. Prototype: `blank.inc.html` is layered into a copy of today's main by `stills.js`. Run `node stills.js`, then `node compose.js`. The raw frames are in `raw/` and the owner stills are `T1`-`T8`.

The idea: the add form IS a place's tag, before it's real. The prototype doesn't draw a new tag. It opens the shipped tag and rewrites its contents, so the die-cut, eyelet, string, shadow, 1px warm edge, stub notches and stamps are exactly what you'll get (J11).

## Three inks, one meaning each

| Ink | What | How it looks |
|---|---|---|
| **Print** | the form's own words (NAME, NOTES, TYPE, the stub labels, questions) and the search offers | Captions use the tag's own label print: `.tag-lab`, 11px, 75% width, 500 weight, .12em tracking, `--ink-2`, caps. The offers use the app's row type: name 14/600 `--ink`, detail 11px `--ink-2`, one line each, ellipsized. |
| **Pencil** | your entries before ADD (name, address · city, TYPE, notes) | Each entry keeps the face and size it will have on the real tag. The colour is graphite `--pencil` = `--ink-2` 86% over `--paper`. The paper's tooth shows through faintly: a `--tex-stamp` mask at 120px over a 62% floor. That gives fine grain, never the stamp's broken ink. The caret is graphite too. |
| **Ink / stamp** | what ADD does | The name goes from graphite to `--ink` (the real tag's name colour). TYPE becomes the real stamped `.tag-stamp`. VISITED stays the real stamp. |

- **Change from my jam turns:** captions are `--ink-2`, not navy, because that's how the real tag prints its labels. Pencil and print are told apart by face and texture: entries are in the entry's face with tooth; captions are tracked small caps. A navy caption would be a mark the real tag doesn't have.
- **No placeholders.** The caption is the prompt. Empty lines are a 1px `--hair` rule. The name line stops 30px short of the right edge so it never runs under the ×.
- **Tap-to-correct entries** (city, TYPE) carry a small pencil chevron, 6px at 1.4 stroke, after the word. It's the only new mark.

## Parts and spacing (390 wide; the tag is 316)

- **Name line.**
  - It starts 36 below the tag's top when there's no band (blank tag), and 48 with the band (starred). That's the real rule: the band is 36.
  - The name is 26/28, 62% width, 700 weight, the same as `.tag-name`.
  - The NAME caption sits 3px under the rule (docked states only; once picked, the name stands alone like the real tag's).
- **Results** sit 8px under the caption.
  - Rows are 48px with no gaps, separated by `--hair` at 70% over the paper. They are full-bleed to the tag's 16px padding.
  - There's no slip edge, no shadow and no second paper.
  - At 664: 3 rows plus half a row above the keyboard (T1). At 320: 3 rows (T8). At 844 Home Screen: 6.
- **Picked** (T3), top to bottom:
  - the name (pencil);
  - address · city (pencil, 13/18, plus the chevron);
  - NOTES: a write-on rule with its caption, 24 tall;
  - the TYPE line: printed TYPE plus the pencilled entry and chevron;
  - the question slot, then the stub.
  - **Order pushed against the spec:** NOTES comes before TYPE, because that's the real tag's order (notes are tier 1, type tier 2, per the owner). The how-it-works table lists TYPE before NOTES. I'd ask systems to swap it, so the blank tag is the real tag line for line.
- **Stub: ADD | STAR | VISITED.** These are the real segments; ADD sits in Directions' slot.
  - **ADD, ready:** a navy flood (`--navy`) filling the segment, clipped by the die-cut, with a cream + glyph (18px, 2.6 stroke) above a cream ADD. It has the same icon-over-label layout as DIRECTIONS and STAR, so the stub stays one system.
  - **ADD, not ready:** printed. ADD is in `--ink-2`, with a second line in 9/11 500 weight: NAME IT FIRST, or ANSWER ABOVE while a question is open. There's no grey slab and no disabled look.
  - **ADD, saving:** the flood at 82% navy, reading ADDING…
  - STAR and VISITED are untouched. STAR prints the band; VISITED is the real stamp (T4).
- **Question slot (T7):**
  - it opens under a 1.5px dashed `--hair` perforation (the stub's own perforation);
  - a printed caps lead-in (NEW CITY? / WHICH CITY?) plus one sentence in 13/18 `--ink`;
  - then two stub-style answers on a 48px row split by a dashed rule;
  - ADD waits, printed ANSWER ABOVE.
- **Save failed:** one printed line above the stub ("COULDN'T SAVE — try again. Nothing is lost."). ADD stays navy. No red: the app has none, and the line is enough.
- **District / street (T6):** the address line becomes the printed hint "Traced from OpenStreetMap when you add it". TYPE is pencil DISTRICT, ADD is the same word, and the pin stays lifted (below).

## The pin, through the journey

- **Docked:** a 32px blank pin (the selected pin's size): orange face `--brand-orange`, 1.5 `--brand-orange-deep` rim, 2px paper halo, navy + at 0.22 × D and 2.4 stroke.
  - It sits at the top of the screen on the tag's axis (y 14-46 at 664).
  - The string is the real `.tag-string`.
  - The eyelet hole shows the map through it. It's a hole, so it does.
- **Picked:** the same pin, standing on the place (the selected marker swapped for it).
- **District:** the same pin, raised 8px, with the disc's soft drop shadow and a 14×4.4 ground ellipse at 16% under it. It's held over the area and never lands.
- **After ADD:** the place's own pin (category ring and glyph), as on every place.

## Motion (all triggered by state changes; nothing touches row gestures)

| Moment | Motion |
|---|---|
| Trigger tap → docked | The tag pops down its string, with the existing tag-pop timing and curve. The pin travels to the dock in the same beat. The keyboard rises on its own. |
| Typing | No motion on the tag. Results replace in place (no slide); the half row is the scroll cue. |
| Pick | The keyboard drops, the tag re-hangs on the place with the map's fly (the existing `openPopupOnArrival` path), and the pin lands with the tag-pop's settle. Pencil entries appear with the tag, with no write-on animation (it would slow every add). |
| STAR on the blank tag | The real Pencil Star / band ink, unchanged. |
| VISITED on the blank tag | The real stamp-in (grow-shrink, ink bleed), unchanged. |
| ADD | 1. The name inks: graphite → `--ink`, a 280ms colour ease with the visited stamp's ink-bleed softness (no new filter). 2. At the same moment TYPE is stamped: the real `.tag-stamp` lands with the star's grow-shrink (1.18 → 1). 3. If VISITED was set, its stamp is already on; nothing re-stamps (the stamp went on when you tapped it). 4. ADD reprints as DIRECTIONS in a 120ms crossfade. 5. The pin's face goes from orange to its category in a 160ms crossfade. Total about 450ms. |
| Cancel | The reverse of the open: the tag goes back up its string (P) or down into the header (A). The draft stays in memory with no visible mark. |

- **Change to the turn-34 order:** the VISITED stamp no longer lands "last at +150ms". The owner's rule is that a stamp lands when you stamp it, and you tapped VISITED before ADD. Re-stamping it at ADD would show the same event twice. The ADD moment is the ink and TYPE only.

## Edges and noise checks (owner-taste)

- Nothing new outside the tag's paper except the pin. No new shadows: the tag's shadow and edge are the shipped ones, and the lifted pin's shadow is the restrained one.
- One new mark (the pencil chevron), on tap-to-correct entries only.
- Colour: navy = action (ADD), orange = starred (band and star) or the trigger's pin face (off the paper, rule 2). There's no third colour.
- Crops: every still is cut clean, with no slivers of neighbouring chrome. The credit is hidden while the tag is docked (it would peek past the tag at 320).

## Open (visual)

1. **The orange pin vs clusters at city zoom** (`raw/p-rest664`): the blank pin's orange face is lighter and larger than the deep-orange cluster discs, and it has a + not a number. I think it holds, but the director should look.
2. **The eyelet hole while docked** shows whatever map is behind it (sometimes a pin's edge). It's honest, but at 3x a pin glyph can show in the hole. Option: back the docked tag's hole with paper. I'd leave it.
3. Should pencil entries write on at the pick (a left-to-right reveal at the Pencil Star's speed)? It's charming, but it adds about 300ms to every add. Left out.
