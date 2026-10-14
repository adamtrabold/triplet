# The blank-tag form: how it looks and feels (shared by P, A and the Float frame)

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
