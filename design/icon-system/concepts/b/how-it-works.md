# B · Second run: how it works (systems)

**Idea:** a visited place is the same pin printed again at lower value: a
screen-print second run, slightly out of register. Same shell, same glyph,
same hue family, **lower value**. It's the most literal answer to "the
checked items are stronger visually than the open ones": done is now
visibly weaker. On the map it's the guide's copy marked done, so **your**
mark stays where there's room: the inked VISITED stamp on the row and the
tag (director's rescue for B's voice problem).

Shared by B, C and D (not a variable): the grammar (Printed / Inked by
you / Line), rim star (mask-cut, no keyline/halo), **selection replaces the
rim** (navy ring becomes the rim, same size, one outline, the pulse stays),
the cluster rule, and the tag (§4). Fixture: `../fixture/fixture.json`.

## 1. Legend (one channel, one meaning)

| Channel | Means in B | Notes |
|---|---|---|
| **Value (full ink vs reprint)** | **open vs visited** | the state channel. A **paper mix, never opacity**: the tile never shows through, so it can't read as the app's 40% "unavailable" (`--state-off-alpha`) |
| **Misregistration** (glyph ~0.8px down-right of its ring) | visited (the same meaning, a second cue so value isn't alone) | it's what makes the reprint read *printed twice*, not *greyed out* |
| Shell present / absent | a place (always present in B) | |
| Shell line style | approx (dashed), in every state | B keeps the shell, so approx survives visiting |
| Fill vs hollow | (not spent) | |
| Size | **zoom only** (24 / 16) | `MARKER_HI_DELTA` → 0 |
| Hue: category ink | category | visited = the same hue, lighter |
| Hue: brand orange | star (+ action glyphs) | clusters: Q6. If they stay orange, that's a DOUBLE, shown both ways |
| Hue: navy (place marks) | selection (ring) | you-are-here = navy target (disc + paper ring): a different form, kept |
| Glyph slot | category; plan numeral | never a check |
| Rim 12 o'clock | star | |
| Tilt + texture | marked by you: **only the VISITED stamp** (rows, tag) | not on the map in B |
| Motion | visit = second pull of the screen; selected = pulse | un-visit: §3 |

**Systems rule for the reprint value:** don't use one mix percentage for all
11 inks. A fixed % leaves lavender shopping (#8A7AA8) almost invisible and
forest nature (#1E3A2B) still dark. **Each category's visited ink goes to the
same lightness** (one target L*, hue kept, chroma clamped so it never goes
grey), so all visited pins step back by the same amount. Minimum: the
reprinted glyph ≥ 3:1 against `--paper` (non-text contrast), so it's
receded, not gone. The visual designer picks the target, and the board shows
all 11 at it beside the 40% swatch.

**Cluster:** drawn open if any member is open, as a reprint if all are
visited; star only for an open starred member; never darker than an open pin.

## 2. State matrix

| Surface | open | open★ | visited | visited★ |
|---|---|---|---|---|
| **Pin near (24)** | ring 2px full ink, paper field, glyph 18 | + rim star (mask cut) | ring + glyph in the reprint ink; glyph misregistered ~0.8px | + rim star at the visited weight (orange at the same lightness step, Q3) |
| **Pin near, selected** | navy ring replaces the rim; glyph full ink; pulse | + star | navy ring (full value, it's selection); glyph stays reprint + misregistered | + star |
| **Pin far (16)** | ring full ink | + rim star | ring in reprint ink | + reprint star |
| **Pin far, selected** | navy ring + glyph 12px (the category moves into the glyph, since the rim is navy) | + star | navy ring + reprint glyph 12px | + star |
| **Approx** | dashed rim full ink | + star | dashed rim reprint | + star |
| **Plan stop** | ring + Printed numeral (`--ink-2`) | + star | ring reprint, numeral reprint (lighter than `--ink-2`, ≥ 3:1) | + star |
| **Plan shape stop** | diamond + numeral | + star | diamond reprint + numeral | + star |
| **Shape anchor** | none | star 12px | the district/street glyph in reprint at the anchor (replaces `shapeVisitIcon()`'s sticker) | + star |
| **Cluster** | ring/disc per Q6, full | + star | all visited: reprint | no star |
| **Row badge** | ringed badge, full | + orange star before the name | badge reprint + misregistered | + star (row star full orange, Q3) |
| **Row, selected (navy)** | badge paper ink | star | badge paper ink at a lower value (paper mixed toward navy) | star |
| **Row visited mark** | — | — | **(a) the inked VISITED stamp, kept** (B's main version: your mark lives here); (b) the stamp at reduced size (Q2) | same |
| **Filter chip** | inactive greyed glyph shown beside the 40% swatch, and beside a visited reprint glyph: **all three must be told apart** | | | |

Z-order: keep `Z_PIN_VISITED_DROP` (to-do above visited).

## 3. Flows (5 beats each)

**Visit from the tag** (Kaffibarinn):
1. Rest open (pin selected, navy rim). 2. Tap Visited (Line check).
3. Impact: tag stamp comes down (`tagStampIn`, shipped). At the same
moment the pin gets **the second pull**: a paper-coloured pass sweeps
across the pin in one direction (squeegee, ~200ms), leaving the reprint
value behind it. 4. Settle: at the end of the pull the glyph slips ~0.8px
out of register (one small, visible jolt; the "flaw" is the moment).
5. Rest done.

**Visit from a row swipe:** beats 1–4 are the shipped gesture with the stamp,
untouched. 5: **after** the gesture, as a separate step, the row badge gets
the pull, then the pin (if on screen) on the state change in `syncMarkers()`.

**Un-visit:** in B the done pin has *less* ink than open, so on the pin
there's nothing to dry. Said plainly: **the dry-up lives on the tag's and
row's stamp** (shipped `dryUp()`, untouched). The pin plays the **pull in
reverse** (the pass sweeps back, the glyph slips back into register, full
value returns), timed to the stamp's final snap (`DRY.SNAP_FROM`..`SNAP_TO`),
so the two read as one event. This is the one place B adds motion the owner
hasn't approved yet. Show it as frames.

Reduced motion: values change in one step; the stamp's shipped 160ms
crossfade.

## 4. Tag (shared)

Directions = Line compass. Star: open = Line star full ink; done = orange
star + band. Visited: open = Line check + label, full ink; done = inked
stamp 1.1x. Two states per segment; no signed-out state. The 40% swatch
sits beside the open segments.

## 5. Jobs

| Job | How | Proof frame | Risk |
|---|---|---|---|
| 1 See what's left | open = full value; visited = reprint | squint at day0/halfway/lastDay | lastDay: 24 pale pins = a pale haze; does it read as "done" or as "faded map"? |
| 2 Open vs done | value + misregistration | grayscale copy; far frame | **far (16px, no glyph): value only, no misregistration possible** → weakest cell in B |
| 3 No noise | no added elements at all | matrix | — |
| 4 One family | grammar board | sheet 2 | — |
| 5 Side by side | canvas row "B · …" | canvas | — |
| 6 Choose | B value / C form / D weight | — | — |
| 7 Category kept | glyph + hue in every state | matrix | light inks at the reprint step |
| 8 Find starred | open★ = full rim star | lastDay 10, 14, 20 | reprint orange star may read as a different colour |
| 9 Buttons vs labels | tag Line at full ink | tag + 40% swatch | — |
| 10 See it land | tag stamp (shipped) + second pull on the pin | storyboards | un-visit's reverse pull is new motion |

Owner objections the director is scoring against: "looks disabled", "not
differentiated nearly enough". The 1x-on-a-phone 40% swatch test decides B
at its first score.

## 6. What it would touch in index.html

- `CATEGORY_COLORS` (~2818) / `categoryInk()` 4483: a derived visited ink
  per category (also touches the brand-token pass, so coordinate with it).
- `badgeHtml()` 4517: reprint variant (ink, glyph offset); navy rim on
  selected.
- `markerIcon()` 4850: visited path stops using `stickerPinParts()`;
  `MARKER_HI_DELTA` → 0; far selected shows the glyph.
- `markerStarHtml()` 4559: rim star; reprint star.
- `placeStickerPin()` 7712 → the pull animation (map pin), triggered from
  `syncMarkers()` 6948.
- `clusterMarkerIcon()` 6877 + `mapVisibleLocations()` 6827 (cluster rule;
  cluster id carries the new flags), `syncClusterMarkers()`.
- `planNumberIcon()` 5630, `planLead()` 5597, `shapeVisitIcon()` 6596.
- `renderCard()` 8183: row badge reprint. The stamp is kept, so the inline
  stamp markup (8198, 5074/5077, 7811/7860) and gesture code stay
  untouched: **no gesture gate** unless Q2 (b) is chosen.
- `buildPopupHtml()` 5047: Line star / Line check open segments.
- Line icons: `rowActionHtml()` 5602, collapse ▼, plan +, header icons,
  Leaflet zoom (Q4), you-are-here (~4297).
