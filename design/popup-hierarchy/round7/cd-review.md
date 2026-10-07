# Round 7 CD review: star colour + tag paper

Fresh CD, 2026-10-07. I did not author, suggest or score any of this work.
Read: `docs/cd-brief.md`, `docs/owner-taste.md`, both round-7 READMEs,
`contrast.json`, `contrast.txt`, `index.html` `:root` + `CATEGORY_COLORS`,
the inspo (`design/inspo/luggage-tags/`, `design/inspo/project/`), the
round-6 tag stills and every round-7 still at 1x and 3x. This is a concept
round, so I kill on the idea, never on the mock (owner, 2026-10-05). Mock
flaws are fix notes.

## Step 1: ledger rules that apply

- "Stars should be colored imo": one starred colour on pin, row, tag and add form.
- "Use the brand palette consistently and meaningfully": every colour keeps one meaning.
- "Colour with personality, on the thing that matters… a color focus would be better on starred."
- "Colour must communicate, or go neutral."
- "Whimsy, not average", from the inspo, but it still has to pass the noise rules.
- "Reduce information when marking state" and "Fewer variations."
- "Secondary marks never outrank content" / "Busy views must keep their hierarchy."
- "Colour alone is not enough." Every state here also has a glyph and a word, so this holds.
- "Signed out: actions visible but disabled."
- "Effects must be restrained." This applies to any tint or band.

## Brand read: does magenta belong?

The brand is the WPA park-poster palette (`CATEGORY_COLORS` is named
Bryce/Zion/Yellowstone/McKinley), plus paper and ink, plus travel ephemera.
The references aren't magenta-free. They have Bryce's pink cliffs and
lavender, the pink and the Braniff/National colours among the luggage tags
(`3.webp`), and the crimson-pink bars on the Tomahawk Lodge and "Camping"
brochures. A deep pink ink is a printed-ephemera colour, so **magenta belongs,
not as an outsider.** It is also the only option with real distance from every
category and city accent (nearest ΔE 24.6), and it adds no new meaning to the
map.

Two caveats from the stills:

- `#A3266F` sits on the plum/berry side. At 1x it can read purple next to
  lavender shopping (`magenta-map-near-crop@3x`, the starred bag). It
  vibrates on the orange cluster discs (`magenta-list-reykjavik-phone@1x`,
  map half) and beside the orange restaurant rings in rows. A slightly
  rosier step would read more like printed pink ink and less like plum.
- The README calls it the "red pencil", but it isn't red. Pitch it as the
  pink ink of the reference tags, which is true and has more whimsy.

Green (B) is the matchbook green, so it is also in the inspo. In this app,
though, green already belongs to the categories (spruce nature, teal
district). On the map, a green star on spruce pins merges with them
(`leaf-map-near-crop@3x`), it reads as "go/park", and it is thinnest on
contrast (3.44 on pressed). That is an idea-level conflict with "one
meaning per colour".

## Tag paper: reference stock or decoration?

In the references, the colour is the stock. It's saturated, flat and
confident, and it says which kind of tag this is (the LGA, TPA and Braniff
tags have solid coloured headers, and the JAL tag is all red).

- **Whole tag (2):** the 12% blush reads as a tint, not stock. Starred
  (`whole-starred-phone@1x`) is a faint pink wash. Starred + visited
  (`whole-busiest-crop@3x`, `#DFC9C4`) is a muddy mauve-grey that looks like
  dirty paper. It also mixes two independent states into one four-way paper
  code (plain / blush / filed / blush-on-filed), which goes against "fewer
  variations", and "both" is the hardest one to read. It's a fair idea, but
  this version is the "average" one.
- **Band (3):** this is the one that looks like the reference tag stock: a
  printed coloured header with the eyelet patch in a deeper ink
  (`band-busiest-crop@3x`). It is also the clean system. **Starred owns the
  band, visited owns the paper (filed) plus the stamp**, so the two states
  are orthogonal and "both" needs no fifth colour. This is the "colour focus
  on starred" the owner asked for, and it has whimsy that carries meaning.
  Its risk is weight. A solid slab plus the magenta star, the magenta word,
  the pencil circle and the magenta pin star gives five "starred" signals for
  one bit.
- **Stub only (1):** this tints the whole action strip, so Directions and
  Mark Visited sit on "starred" paper. The colour lands on actions it
  doesn't describe (`stub-starred-phone@1x`), which breaks "colour must
  communicate". It is also the quietest and most "average" option.

## 1. Scores (concept / execution) and rankings

**Star colour**

| Rank | Option | Concept | Exec | Mark | Evidence |
|---|---|---|---|---|---|
| 1 | A magenta `#A3266F` | 8 | 7 | **KEEP** | `magenta-list-copenhagen-crop@3x` reads clearly beside the navy stamp. `magenta-map-near-crop@3x` separates from every ring. It's plum-leaning on lavender and orange (see fixes). |
| 2 | Today: black ink | n/a | n/a | **KILL** | The owner reversed it: "Stars should be colored". |
| 3 | B leaf green `#4E7A0E` | 4 | 6 | **KILL** | Green is the category language (nature, district). It merges on spruce pins (`leaf-map-near-crop@3x`) and is the weakest on contrast. |

**Tag paper**

| Rank | Option | Concept | Exec | Mark | Evidence |
|---|---|---|---|---|---|
| 1 | 3 Band (starred) + filed paper (visited) | 8 | 6 | **KEEP** (my lead) | `band-busiest-crop@3x`, `band-starred-phone@1x`: reference-true, two orthogonal channels. Starred is over-signalled, and signed out shows a new pale pink. |
| 2 | 2 Whole tag | 6 | 5 | **KEEP** as the one alternate | `whole-busiest-crop@3x` is muddy and `whole-starred-phone@1x` is timid. The four-way paper code fails "fewer variations". |
| 3 | 1 Stub only | 4 | 6 | **KILL** | `stub-starred-phone@1x`: starred colour under Directions and Visited communicates the wrong thing, and it's the "average" pick. |

**Best combination:** a magenta `--star` (one rosier step, see fix 2) on
the row, map star, gesture ink, tag segment and add form, plus the **band**
for starred and **filed paper** for visited on the tag. Show the whole-tag
version as the single alternate and today's black as the "before".

## 2. Owner-objection prediction (at 1x, in the owner's voice)

1. "That's a lot of pink on one tag. The band, the star, the word, the
   circle and the pin all say starred. Pick one." (band)
2. "Is that purple? And it looks off next to the orange clusters and the
   restaurant icons." (magenta at 1x on Reykjavik's orange)
3. "The visited tag is the same colour as the map. It kind of disappears."
   (filed paper on the tan basemap, every option: `whole-visited-phone@1x`)

For the whole-tag alternate: "That pink-grey just looks dirty."

All three are plausible, so the work isn't ready to show yet.

## 3. Noise count, busiest views

- **Busiest list** (`magenta-list-copenhagen-phone@1x`): per row there are
  6 marks (ring, star, name, meta, stamp, ×). The list area has 4 hues
  (category brown/orange, magenta, stamp navy, the red selected row), one
  more than today's 3. The new hue communicates, so it isn't a
  rejected-pattern match. **The real busiest list wasn't rendered.** The
  sheet shows 4.5 rows under a half-height map. I need a full-height sheet.
- **Busiest tag, band** (`band-busiest-crop@3x`): about 16 marks (band,
  eyelet patch, ×, name, address, 5 note lines, 2 meta labels and values,
  the perforation, 2 dashed dividers, compass, star, circle, word, stamp)
  and 5 colours (magenta, navy, ink, filed paper, graphite). There are 5
  starred signals for one bit, which hits "reduce information when marking
  state". It isn't one of the capped patterns (no dots, no heavy rule, no
  added height: the band reuses the existing eyelet strip), so it isn't
  capped, but it is the first thing to cut.
- **Busiest tag, whole** (`whole-busiest-crop@3x`): the same marks with no
  band. This mock drops the stub's dashed dividers, so it isn't
  like-for-like with the band (fix 7).
- **Rejected-pattern matches:** none that cap at 6. The nearest is the
  band read as a "box", but it is a printed header that carries meaning, so
  I didn't cap it. Watch it at 1x.

## 4. Numbered fixes

1. **Render the busiest list properly:** a full-height sheet, 8 or more
   rows, mostly starred and visited, long names, and a selected row, for
   the chosen magenta. Do it for Reykjavík (orange accent) and for one
   cool-accent city.
2. **Tune the magenta one step rosier/warmer** so it reads as printed pink
   ink, not plum beside the shopping lavender, and holds up on orange
   cluster discs and restaurant rings at 1x. Keep ΔE2000 ≥ about 20 from
   every `--figure-deep` and ≥3:1 on `--paper-pressed`. The designer picks
   the hex and shows one, not a new spread.
3. **Cut the starred signals on the band tag.** With the band carrying
   starred, the segment needs its glyph, not a magenta word too. The pencil
   circle is the owner's provisional keep, so show it and name the count
   to the owner. The designer decides what goes; target 3 signals or fewer
   on the tag.
4. **Signed out:** the disabled star renders a new pale pink
   (`band-signedout-crop@3x`). Disabled controls use the same grey as the
   disabled Mark Visited, with no colour on a disabled control. The band
   (data) may stay.
5. **Visited paper vs the basemap:** filed paper nearly matches the tan
   blocks (`whole-visited-phone@1x`, `band-busiest-phone@1x`). Check it
   against the real basemap (the stills use a stand-in) and keep the tag's
   figure/ground with the existing restrained shadow or edge, not a new
   outline.
6. **Map at far zoom:** `map-far` shows overlapping glyph pins, not the real
   clustered zoom-12 view. Render true clusters with starred clusters
   wearing the star, since magenta on orange discs is the hardest case
   (seen only in the Reykjavík list still's map half).
7. **Like-for-like mocks:** render every tag option with the same stub
   (dividers present or absent consistently) so the owner compares colour
   only.
8. **Whole-tag alternate,** if it stays: a 12% tint reads as dirty paper,
   not stock. Either commit to a recognisable rose stock or show it as the
   rejected direction, and say which state wins in "both". Don't show the
   muddy blush-on-filed as is.
9. **Fewer variations to the owner:** one sheet with the combination
   (magenta across list, map, gesture and add form, plus the band tag in
   typical, starred, visited, both and signed out), then the whole-tag
   alternate in one frame, then today's black in one frame. Drop green and
   stub from the owner's sheet.
10. **Copy for the pitch:** call it the reference tags' pink ink (Braniff,
    Bryce), not a "red pencil", and keep "pencilled = what you care about"
    for the graphite sketch only.

## Verdict

**Show after these fixes.** Fixes 1–4 and 7 are needed before the owner
sees it, because objections 1–3 are each plausible at 1x. Fixes 5, 6, 8, 9
and 10 can go in the same batch.

Gating: these are concept stills only. Nothing is built, and `index.html`
is untouched. A `--star` token and baseline update must not land before the
owner approves the look.
