# Tag paper as state (round 7)

Designer, 2026-10-07. Concept stills only.

Owner (verbatim): "I'm also wondering if we couldn't play with the
background color of some or all of the tag in any or all states as part of
the approach to some or all of the actions. Looking at the inspo". The
references (`design/inspo/luggage-tags/`) print the whole tag on coloured
stock (JAL red, Aloha pink and green, the Delta and Braniff families), and
the colour says what kind of tag it is.

## Rules held

- One meaning per colour, from tokens:
  - **starred = `--star`** (see `../star-colour/`, lead A `#A3266F`);
  - **visited = filed paper** (`--paper-filed`, the visited list row's
    field) plus the stamp.
- The colours agree with the star colour: the starred paper is `--star`
  mixed into paper, so it never reads as the city accent or visited navy.
- New tokens, both derived (`color-mix`, 12%):
  - `--paper-starred` = 12% `--star` on `--paper-raised` (#F0DCDB);
  - `--paper-starred-filed` = 12% `--star` on `--paper-filed` (#DFC9C4).
- Notes stay full contrast (`contrast.txt`):

  | Paper | `--ink` | `--ink-2` | `--star` |
  |---|---|---|---|
  | `--paper-raised` | 16.03 | 6.73 | 6.30 |
  | `--paper-filed` | 13.17 | 5.53 | 5.18 |
  | `--paper-starred` | 13.25 | 5.56 | 5.21 |
  | `--paper-starred-filed` | 11.03 | 4.63 | 4.34 |
  | `--star` band, paper text | 5.78 | n/a | n/a |

- **Signed out never changes paper.** Paper shows the place's data, which
  viewers can read too. Signed out only greys the Star and Visited controls
  (`*-signedout`), so it can't be mistaken for a state colour.

## Options

1. **The stub carries the state** (`stub-*`).
   - The body stays `--paper-raised`, and only the claim stub takes the
     state paper: starred → `--paper-starred`, visited → `--paper-filed`,
     both → `--paper-starred-filed`.
   - It's the quietest option. Colour sits where the actions are, like a
     coloured claim stub.
   - Cost: the stub is small, so the state reads mostly from its marks.
2. **The whole tag carries the state** (`whole-*`, my lead).
   - The tag's own stock is the state, as on the references: plain,
     starred (blush), visited (filed), or both (blush on filed).
   - It extends v4's screen-back (visited = filed) to starred with the same
     logic.
   - Cost: four papers to learn. Starred + visited is the darkest, but
     notes still read at 11:1.
3. **A coloured band for starred** (`band-*`).
   - The eyelet band at the top prints solid `--star` when starred, like
     the coloured headers on the Delta and Braniff tags. Visited stays the
     filed whole paper.
   - Cost: a colour slab on every starred tag, which is the boldest option
     and the most likely to read as decoration.

## Stills (`stills/`, `phone@1x` + `crop@3x`)

For each option: `busiest` (VEGA, starred + visited) first, then `typical`
(neither), `visited`, `starred`, `both`, and `signedout` (starred, signed
out). The pin star uses `--star` throughout. `render.js` re-renders;
`tag5.js` is round 6's `tag4.js` plus `paperMode`.

## How it fits with the star colour

- `--star` is the only colour meaning "starred", whether it appears as ink
  (the star glyph: row, map, gesture, tag segment) or as paper (the 12%
  blush, or option 3's band).
- Visited never uses `--star`, and starred never uses navy or filed paper.
- The city accent isn't in the tag at all.
- The pencil circle stays, provisionally, in `--ink` graphite.

---

## After the UX and CD reviews

**Stub is dropped.** Band and Whole are shown side by side, like for like:
the same stub, dividers and pencil circle. The star is now pink ink
`#C0306E`.

**Band**
- At most 3 starred signals on the tag: the band, the pink star glyph and
  the provisional pencil circle. The STARRED word is ink now.
- The × has moved off the band, onto the name row in every option, so it
  never sits on a state colour.

**Whole**
- It's now a real rose stock: `--paper-starred` is 22% star on
  `--paper-raised` (#EDCACF).
- When a place is starred and visited, **starred wins the paper** and
  visited shows as the stamp, so there's no muddy blush-on-filed.
- Contrast on rose: `--ink` 11.58:1, `--ink-2` 4.86:1, star glyph 3.59:1.

**Pressed** (`*-pressed`)
- On raised paper a pressed segment uses `--state-press`, on filed paper
  `--state-press-filed`, and on rose a new `--paper-starred-press` (34%
  star, #E6B2C0; ink 9.54:1).
- The pink glyph on that press is 2.96:1. It's transient and the shape
  carries the state, so this is flagged rather than fixed.

**Signed out**
- The dimmed Star keeps its filled star in grey ink at the off alpha, with
  no pink on a disabled control.
- VoiceOver reads "Starred, sign in to change".
- The paper still shows the state.

**Figure/ground:** every tag carries the owner-approved 1px warm edge
(`STICKER.EDGE`, rgba(107,74,40,.22)) on its outline, plus the restrained
shadow, so filed paper still stands off the tan basemap. On real tiles this
is unchecked.

**Districts and streets** (`band-shape`, `band-street`)
- No pin (owner). While the tag is open, a small dot sits at the area's
  middle: the district's label point, or the street's midpoint. The string
  hangs from it.
- The dot is 8px in the shape's own ink on a 2px `--paper` ring, the same
  halo rule as the map star.
- The owner OK'd this dot: "Dot or something in the middle is fine". It's
  recorded in `docs/owner-taste.md` as an exception to the no-dots rule.

The owner page is `../index.html` ("Star Colour & Tag Paper"), built by
`../build.js`.
