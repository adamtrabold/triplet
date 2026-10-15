# Notes: product designer (visual focus), icon concepts

## Update (after jam turn 4): build tests and the t4 cards

Director turn 3 steered. I ran the build tests and built the six t4 cards
from `../sketches/t4.html`:
- `t3-buildtests.png` (team only)
- `t4-card-0-strips.png`
- `t4-card-1-food-drink.png`
- `t4-card-2-sights-outdoors.png`
- `t4-card-3-places-of-town.png`
- `t4-card-4-tools.png`
- `t4-card-5-dropped.png`

To re-render:

```
NODE_PATH=/opt/node22/lib/node_modules node t4.js <html> <outdir>
```

`t4.js` was in the scratchpad: playwright at DSF 3, waiting for
`window.READY`, then each `.card` in order with the names above.

What's in `t4.html`:
- `D` holds every rough glyph.
- `badge()` draws the 24px circle; `bare()` draws the glyph alone.
- `concept()` draws the row, badge, chip and mini map, plus the Shows and
  Could-be lines.
- `COMMON` and `OURS` hold the two strips' sets.
- `DROP` is the dropped list.

Results:
- **Ticket:** failed all 5 builds, so attraction is camera / column
  front.
- **Coffee pot:** failed against the kettle, so café B is cup + bun.
- **Street B:** found. The pedestrian-street sign passes, so street is
  pedestrian sign / enamel plate.
- **Weakest seconds:** area B (fountain) and district B (solid parcel).

Next: the director scores the t4 cards in one pass.

## Where things stand (2026-10-15, after jam turn 2)

The owner picked **Constructed** (built on the 2px grid) on the v6 cards.
This step is the concept behind each icon: what it depicts, not the
drawing. Next comes the grid, then the drawings.

Owner direction, all in `../../owner.md`:
- Clarity first.
- Subtle rounding is *one* source of warmth.
- Hand-made is not ruled out. His examples ("construction method,
  textural approach, the inkblot thing, etc.") "are just examples. not
  exhaustive. again you are overstating my intent." Don't turn them into
  options or rules; quote him from owner.md. The hand-cut executions were
  cut on execution risk, not on idea.
- Whimsy is wanted ("built can still be whimsical"; "craft matters
  most").
- Novelty is open: does built still feel novel in the vintage-travel
  theme? Consider it, don't lock it.

**Turn 2 (mine)**, in `../jam.md`. Sketch: `../sketches/t2-concepts.png`,
from `../sketches/concepts-t2.html`. That file is standalone: `D` holds
rough 24-grid builds, `badge()` draws a 24px circle with the glyph at
0.82 scale, `bare()` draws 12px.

To re-render:

```
NODE_PATH=/opt/node22/lib/node_modules node one.js <html> <out-prefix>
```

`one.js` was in the scratchpad. It's playwright at DSF 3: it waits for
`window.READY` and screenshots each `.card`.

### My positions

- **Where the wit goes (the Swiss-clock rule):** one witty part per icon,
  part of the object (olive, note heads, sun, knife back, pillow head).
  Never an added dot.
- **Two drawers:** places = legend signs; states and empties = travel
  paperwork (tag, ticket, stamp). Price tag and flag are in the wrong
  drawer, so they're killed.
- **Keeps:** fork + knife, cup, bed, conifer, bag (square handle), blocks
  for area/district, crosshair, compass, ×, +, sort arrows, sliders.
- **Pushes:**
  - notes (if bar is renamed "music")
  - stemmed round-bowl glass (if it stays "bar")
  - shopfront with scalloped awning (rhymes with the scalloped badges)
  - enamel street-name plate
  - admission ticket (the concept is good; the build fails as a battery,
    so it needs a tilted-stub test)
  - coffee pot (wit; reads as a kettle)
  - peaks + sun (brand; reads as "image")
  - ♨ hot spring, as a new pools & hot springs category, not as nature
  - delete as a bin (a UX call)
  - ▸ pointer for the current choice
  - one wedge for disclosure
  - blank luggage tag for the empty list
- **Kills:** martini (funnel), kringle (an outline at 18px), jazz horn,
  glass + note, moon, column front, Michelin star, manicule ("tap here"),
  leaf, price tag, folded map, rooftops, the road (it failed as a pencil,
  a cone and an escalator), lamppost, room key, flag, passport as a
  button (record its story only), you-are-here as locate (a radio
  button), pin with +, funnel.
- **New:**
  - a two-strip novelty test (convention vs "our objects")
  - a pools & hot springs category (an owner question)
  - corners softened like ink spread: my own idea, one option among
    many for the drawing step, not a default

## Open

- Can the ticket be built to read at 18px?
- Is the peaks' "image" read fatal?
- Delete as a bin needs UX.
- Owner batch: turn 1's four questions (bar name; attraction/nature/area
  lines; area = district's twin; other) plus pools & hot springs, plus
  the two strips.

## Next

The director steers. Then build the convention vs "our objects" strips
(and the ticket test) if asked.
