# Star colour (round 7)

Designer, 2026-10-07. Concept stills only; `index.html` is untouched.

Owner (verbatim): "Not sure on the circle we can keep for now. Stars should
be colored imo". Palette rule (verbatim): "Keep in mind the brand color
palette.. we should be using best practices around how to apply consistently
and meaningfully". Both are in `docs/owner-taste.md`. This reverses the
team's "black stars everywhere" ruling (`docs/shipped.md`, Pencil Star
rounds 4–6).

## The original problem, and the test

Rounds 4–6 dropped the coloured star because an 18px `--figure-deep` star
"became a second badge that merged with/clashed against orange category
rings (Stockholm, Copenhagen)". On the map `--figure-deep` means "cluster";
on a row it means "selected". So the new star colour:

- **must not be a city accent.** No `--figure`/`--figure-deep`, in any city.
- **must stand apart from every colour already in use,** measured as
  CIEDE2000 colour difference (ΔE). Higher means more different; 2–3 is
  "just noticeable", and the old clash pairs sit around 9–18. The colours
  checked are all 11 `CATEGORY_COLORS`, all five cities' `--figure` and
  `--figure-deep`, the visited ink `#3A4C5B`, `--navy` and `--ink`.
- **must clear ≥3:1 contrast** on `--paper`, `--paper-raised` (the tag and
  the map star's halo), `--paper-filed` and `--paper-pressed`.

All of this is in `contrast.py`, with results in `contrast.json`.

## Options

| | Hex | Min contrast on the papers | Nearest app colours (ΔE2000) | Verdict |
|---|---|---|---|---|
| **A Red-pencil magenta (lead)** | `#A3266F` | 4.62 (pressed) – 6.30 (raised) | shopping 24.6, Copenhagen `--figure-deep` 24.6, LA `--figure-deep` 25.3 | Farthest from every category and every city accent. Warm, so it sits in the brand's poster family. The editor's red pencil, which fits the app's "pencilled = what you care about". |
| **B Leaf green** | `#4E7A0E` | 3.44 (pressed) – 4.27 (raised) | district 24.0, attraction 24.5, other 25.4 | Clears the test, but green reads as "go" or "nature" next to spruce pins and park fills. It's the thinnest on contrast too. |
| Today: black `--ink` | `#1A1A18` | 11.7+ | n/a | The baseline, rendered as `ink-*`. |
| Rejected: carmine | `#B4233C` | 4.36 | Copenhagen `--figure-deep` **9.0**, LA 9.7 | The original clash again. |
| Rejected: ultramarine | `#3B3FA6` | 5.78 | bar **10.7**, visited ink **10.7** | Reads as visited or bar. |

**Highlighted row:** no star colour reaches 3:1 on the `--figure-deep`
block (A is 1.11–1.21:1). A highlighted row is reversed, so everything on it
is paper, and the star stays `--paper` there, as it does today (≥4.79:1).
That's the existing reversal rule, not an exception.

## Proposed token

`--star: #A3266F` ("starred", one meaning). It's used:
- by the list row star (`.row-star`);
- by the map star's ink (`.marker-star-ink`, still on its `--paper` halo,
  5.78:1);
- by the Pencil Star's landed ink (`.sg-ink`);
- on the tag's starred segment glyph and word;
- by the add form's STAR toggle when it's on.

The pencil graphite (the sketch before it lands) stays `--ink-2`: pencil is
grey, and the ink that lands is the colour.

## Colour map

| Colour | Means | Surfaces |
|---|---|---|
| `--star` magenta | starred, only | row star, map star, gesture ink, tag star + word, add-form STAR on |
| `--figure` / `--figure-deep` | city accent: buttons, selected row, cluster | unchanged; never on a star |
| stamp navy 82% / `STICKER.INK` #3A4C5B | visited | unchanged |
| `--ink` | text; the star's outline when unstarred | unchanged |
| `--paper` | the reversed star on a highlighted row; the map star's halo | unchanged |

## Stills (`stills/`, `phone@1x` + `crop@3x`)

For each option (`magenta-*`, `leaf-*`, `ink-*`), busiest first:
- `list-reykjavik`, `list-copenhagen`: lists full of starred and visited
  rows (restaurants starred), with one starred restaurant highlighted. Both
  cities have orange accents.
- `map-near`: starred pins next to orange restaurant pins (zoom 14).
- `map-far`: starred pins inside clusters (zoom 12).
- `tag`: the round 6 tag, pencil circle kept.
- `gesture`: the Pencil Star, one frame just after the ink lands.

`render.js [option]` re-renders in the real app; the basemap is a stand-in.

## Watch items

- The map star is 10–12px. At 1x magenta reads on the paper halo; green is
  weaker next to green pins.
- Shopping lavender is the nearest category to A (ΔE 24.6): a starred
  shopping pin shows a magenta star on a lavender ring. That's distinct, but
  the closest pair.
- Changing the star colour is app-wide (lane 2): the list, map, gesture and
  add form all change together, and the Impeccable baselines will need the
  owner's approval to update.

---

## After the UX and CD reviews (`../ux-review.md`, `../cd-review.md`)

- **Leaf green is dropped.** Plum `#A3266F` read purple next to the shopping
  lavender, so there's one rosier step: **pink ink `#C0306E`** (the lead),
  framed as the pink ink of the reference tags (Braniff, Bryce), not a
  "red pencil". Graphite stays the pencil sketch.
  - Nearest app colours (ΔE2000): Copenhagen `--figure-deep` 20.4, LA 21.3,
    shopping 24.5. That holds the CD's ≥ ~20.
  - Contrast: 3.64:1 on `--paper-pressed`, 4.97:1 on `--paper-raised`.
  - Plum is shown once beside it.
- **Paper halo on every map star:** kept everywhere (pins, clusters, visited
  stickers), so colour is never the only cue. The `map-far` stills are now
  real clusters at zoom 11, with starred clusters wearing the star on their
  halo.
- **Busiest list:** a full-height sheet (12 or more rows, mostly starred
  and visited, long names, one selected row). The lists are Reykjavík and
  Malmö. No city has a cool accent; Malmö's ochre is the least orange.
- Stills: `pink-*`, `plum-*`, `ink-*` (today).

---

## Gold star + recoloured categories (owner, 2026-10-07)

Owner, verbatim:
- "Not sold on pink what about the orange?"
- "We can change the color of the category types that clash. Orange/yellow
  makes more sense to use on a star"
- "The band is cool did we try the segment background? Star could be
  reverse (white/cream) or navy on the orange"

### Why not the city orange (`orange.py` → `orange.json`)

The per-city `--figure-deep` *is* the cluster disc and the selected row
(ΔE 0). It also sits close to other colours:
- **Reykjavík** (#A8400C): 4.5 from restaurant.
- **Copenhagen and LA** (#B23A2C / #AE3A29): 1.1 from each other.
- **Stockholm and Malmö** (#995610 / #8A5A0E): 5.9 from each other, and
  Stockholm is 7.1 from restaurant.

A fixed amber (#B85C00) is still 6.6 from restaurant and only 3.10:1 on
paper.

**Orange can only mean "starred" if clusters and the selected row stop
being orange.** That's a bigger change than moving two categories, so it
isn't proposed.

### The star: gold `#F2B807` (`gold.py` → `gold.json`)

The yellow ink of the reference tags. Gold is light (1.22–1.66:1 on the
papers), so the mark is a **gold fill inside a 1px `--ink` keyline**. The
keyline carries the contrast: 11.74–16.03:1 on every paper (WCAG 1.4.11),
and gold against its keyline is 9.66:1. Colour is never the only cue,
since the star's shape and outline read alone.

ΔE2000 from the star:

| Against | Before | After |
|---|---|---|
| Nearest category | attraction 18.8 | attraction (moss) 38.1 |
| Cluster / selected, every city | 33.0–46.4 | same |
| Visited ink | 60.3 | same |
| Navy | 73.4 | same |

The **one close pair is Malmö's `--figure`** (#E0A22E, ΔE 7.5), the
ochre on that city's add/account buttons. Those are a different object
(a button, not a mark). **Owner option:** accept it, or nudge Malmö's
`--figure` warmer. The second is the smallest change if wanted.

### Category changes

| Category | Before | After | Why | Contrast on paper / filed |
|---|---|---|---|---|
| restaurant | #AC5019 burnt orange | **#972068 claret (Bryce pink)** | the orange family now belongs to the star and the city accent; claret is the farthest free hue from every colour in use | 6.50 / 5.83 |
| attraction | #A68018 gold | **#547326 moss (park-poster foliage)** | gold is now the star (ΔE was 18.8) | 4.59 / 4.11 |
| cafe, street, the rest | unchanged | unchanged | ≥42 from the star | n/a |

Closest category pairs:
- **Before:** bar–area 9.9, cafe–street 13.2, area–other 14.5,
  nature–other 15.2, restaurant–cafe 15.8.
- **After:** bar–area 9.9, cafe–street 13.2, area–other 14.5,
  nature–other 15.2, area–hotel 16.4.

The new colours make no pair closer than before; bar–area was already the
closest. Against the city accents, restaurant is 25.3 from Copenhagen's and
attraction 26.3 from Malmö's.

The highlighted row still shows a `--paper` star (the reversal rule).

### Stills

- `gold-list-reykjavik`, `gold-list-stockholm`: busiest, full height.
- `gold-map-near`: zoom 14.
- `gold-map-far`: real clusters at zoom 11, gold star on each cluster's
  halo.
- `gold-gesture`.
- `gold-oldcats-*`: gold with today's categories, for the before.
- Render: `render-gold.js`.
