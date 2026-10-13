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

**Un-visit (reverse pull), frame by frame against the shipped dry-up.**
In B the done pin has *less* ink than open, so on the pin there's nothing to
dry. **The dry-up stays on the stamp** (shipped `dryUp()` + `.dry-out`,
`DRY = { MS 540, THR_MS 480, SNAP_FROM 370, SNAP_TO 450, SNAP_GAIN 0.3 }`,
untouched). The pin plays the **pull in reverse**, timed so that it happens
*inside the stamp's snap*, and the two read as one event: the stamp's last
cores go at the moment the pin returns to full value. This is new motion the
owner hasn't approved, so it's shown beside the shipped dry-up, moving
together (director).

Pull geometry: a straight sweep edge, 20° off vertical, with a 3px soft
edge (a moving mask), crossing the pin's full 24px. Behind the edge is the
target value, ahead of it the old one. The visit pull runs left → right, and
the reverse pull **right → left** (the screen goes back the way it came).

| t (ms, the tag's `dryClock`) | Tag stamp (shipped) | Pin (B) |
|---|---|---|
| 0 | dry starts (blur ramps 0 → 0.9px over the first 35%) | rest done: reprint value, glyph +0.8px out of register. **Holds still** while the stamp dries; the eye belongs to the tag |
| ~100 | track dots gone | holds |
| 160–300 | letters dry | holds |
| 300–370 | ring and check cores remain | holds (no anticipation: the owner rejected pops) |
| **370** | `SNAP_FROM`: the accelerating push begins | **reverse pull starts** at the pin's right edge, eased `cubic-bezier(.55,0,1,.45)` (ease-in, matching the snap's k² acceleration) |
| ~410 | the check is the last speck (~420) | the sweep edge at the pin's centre: left half reprint, right half full value |
| **430–450** | the copy clears (20ms) | **450 = `SNAP_TO`: the pull completes**, the pin at full value. The glyph is still out of register |
| 450–490 | segment waits (`.uv-leaving`) | **the glyph slips back into register** (0.8px up-left, 40ms, ease-out): the "flaw" undone, the last pin beat |
| 470–540 | MARK VISITED words ink in | rest open by 490 |
| 540 | clock ends; filter removed | — |

Five storyboard stills: **0** (rest done) · **250** (mid-dry; pin unchanged) ·
**410** (snap; pin half-pulled) · **450** (stamp gone; pin full value, still
misregistered) · **540** (rest open, both).

Other paths:
- **Row swipe un-visit** (finger-driven; no `dryClock` on the row in the
  gesture): after the gesture, as a separate step, the pin plays the pull
  alone with the same shape: 80ms sweep (the snap's length) + 40ms
  register = 120ms.
- **Popup → row replay** (`vsReplay()`, the row stamp gets `.dry-out`): the
  row's badge runs the same 370–490 pull as the pin, on the same clock. At
  450 the shipped row lift/settle runs as before.
- **Pin off screen:** nothing plays; the pin is at rest when it's next drawn.
- **Reduced motion:** with no filter and the stamp's `dryFadeRm` (pale by
  56ms, gone by 80, words 80–160), the pin steps to full value and into
  register at **80ms**, with no sweep.

**Visit (forward pull), for symmetry:** the tag's `tagStampIn` (420ms). The
pin's pull runs **left → right from 120 to 320ms** (ease-out, while the stamp
comes down), then the glyph slips 0.8px out of register at 320–360 (one
small jolt). Row swipe: after the gesture, the same 200 + 40ms.

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

### 6a. The darker inks: what they touch (added 2026-10-13)

shopping #8A7AA8 → **#665783**, district #328177 → **#146A60**, attraction
#547326 → **#436215** (`b-cost-1x`). These are app-wide, so not only B's pins:
- `CATEGORY_COLORS` (index.html ~2818–2829; comments with contrast ratios
  at 2822/2824/2828 to update) → `categoryInk()` 4483 → every badge, pin,
  plan pin and shape anchor.
- Filter chips: `--chip-ink` from `CATEGORY_COLORS` (~8352), chip CSS
  ~922–940 (the active chip's ink underline).
- The add form's district/street outline colour (~8760,
  `color: CATEGORY_COLORS[type]`) → the colour saved on new shapes
  (`nb.color`, read by `neighborhoodStyle()` 6553). **Existing shapes keep
  their stored colour** unless a data update re-inks them (DB, lane 3 + a
  Supabase migration if wanted).
- The duplicated port in `tools/neighborhood-shapes.html` (no build step) has
  its own copy of the colours.
- The new visited (reprint) inks: one derived token per category (11 new
  tokens), via the brand-token pass.
- Docs: CLAUDE.md names "attraction moss `#547326`" (line ~180), and
  `docs/shipped.md` records the ratios. Both change when this lands.

## 7. Jobs check (pass/fail with proof frames)

Re-checked 2026-10-13 on canvas v12 (`set/`), after the rebuild: shopping,
district and attraction darkened one step, reprint at L* 54 with its
chroma raised (×1.35, min 22), a paper mix, never opacity.

| Job | Verdict | Evidence |
|---|---|---|
| 1 See what's left | **PASS, weak** | `b-near-B-lastDay-1x`: the open★ 14, 20 and 10 are the darkest pins. But the squints (`b-near-B-halfway-squint-3x` vs `-lastDay-squint-3x`) are nearly identical: the visited reprints keep the pin's form and colour, so halfway and lastDay read alike. Done steps back by value only. C steps back further (compare `../c/set/c-near-C-lastDay-squint-3x`) |
| 2 Open vs done | **PASS** (one nit) | `b-gate-1x` re-run: every category's visited vs the 40% look ΔE ≥ 18, and vs the off chip ≥ 20, **except "other" visited vs the off chip, ΔE 8 on colour alone**. Not a job failure: the chip lives in the filter panel as a bare glyph in a dashed chip, never beside a ringed map pin. Far: `b-far-B-ink-halfway-1x`: the open 27 (dark ring + star) vs the visited reprint rings, distinct |
| 3 No noise | **PASS** | no added elements |
| 4 One family | **PASS** (shared) | `gx-*` |
| 5 / 6 | **PASS** | canvas v12; one of three |
| 7 Category kept | **PASS** | glyph + hue in every state (`b-gate-1x`) |
| 8 Find starred | **PASS** | `b-near-B-lastDay-1x` |
| 9 Buttons vs labels | **PASS** | `b-tag-B-8` |
| 10 See it land | **PASS (new motion)** | `b-sb-tag`, `b-sb-row`, `b-sb-dry`: the pin holds while the stamp dries, then the reverse pull runs inside the snap (370–450) and the glyph slips back into register. The owner hasn't approved this motion yet; it's shown beside the shipped dry-up as required |

**B's cost** (`b-cost-1x`): three category inks change **app-wide**, so it's an
owner call on brand colour (it also overlaps the brand-token pass).

No blockers left. B's weakness for the director's score is J1: done
recedes less than in C.
