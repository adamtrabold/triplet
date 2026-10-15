# Notes: product designer (visual focus)

## Where things stand (after jam turn 19): the v6 cards

**Director round 3 (turn 18, scores.md):**
- Scores: Rules 8, Specimen 8, Roundel 5 (dropped).
- **Constructed** is the new concept 2: Spot Pictogram led, built the way
  Aicher drew the Munich '72 pictograms, on a 2px grid.
- Specimen is now Cut Paper + Field Guide, with each cut made visible.
- Kill test: Specimen and Constructed must differ in how they're drawn,
  in the 24px strip and in a row.

**Built (turn 19), in `../concepts/sketches/`:**
- `v6-card-rules.png`
- `v6-card-0-today.png`
- `v6-card-1-specimen.png`
- `v6-card-2-constructed.png`
- `v6-card-3-side-by-side.png`
- `v6-card-4-dropped.png`

**Source:** `attitudes-v6.html`. To re-render:

```
NODE_PATH=/opt/node22/lib/node_modules node cards7.js <html> <outdir>
```

The render script was in the scratchpad. It's the same as cards6, but
names the cards `['rules','0-today','1-specimen','2-constructed',
'3-side-by-side','4-dropped']` with the prefix `v6-card-`. The v5 cards and
`attitudes-v5.html` stay as the record.

**New in the code:**
- `CO`: Constructed glyphs, integer rects/paths on a 24 grid.
  - `R_(x,y,w,h)` draws a rect.
  - `COFF` holds a centring offset per glyph, measured in `fitAll()` and
    snapped to 0.5.
  - `mark(set 'CO')` draws 1:1 at 24px and 1.25× in the 32px pin.
  - `bare('CO')` draws at 1.45× for 12px chips.
- `pairs()` draws the Today → Specimen strip.
- `gridFrame()` draws three glyphs over the 2px grid.
- The Roundel `RO` set is kept (the dropped card uses it).
- Specimen changes in `SP`:
  - bar + olive
  - bag with a pinked top
  - area as a folded map
  - hotel + a blanket line
  - flag with a swallowtail

**Kill-test read (mine):**
- Strip: about 8 of 11 are clearly different drawings. Cup, bed and map
  are siblings.
- Row: visible side by side, subtle alone.
- Ink: Specimen 28%, Constructed 29%. Size and mass aren't the
  difference.
- I said plainly that the difference is finish and method, not identity.

**Next:** systems coverage on v6, then the director scores.

## Update (after jam turn 17): the coverage fixes are applied

Systems' coverage run (turn 16, `../coverage.md`) found three blockers, and
all three are fixed on the re-rendered v5 cards:

1. **Job 8.** Each concept card has a "Made from" line naming Field Guide,
   Cut Paper and Spot Pictogram. It's the 4th argument of `three()`.
2. **Job 10, where outlines appear.** A new section on the rules card:
   only in the tag and the add form, and rows and pins show nothing until
   the place is marked.
3. **Job 10, Roundel's open pin.** I stated it rather than redrew it, in
   Roundel's "Costs" line and in the rules-table open-pin row. Every fix
   that makes it fill breaks the concept.

Also done:
- The row × is a 10px box at 2.00, set in `rX()`.
- The account is labelled "already 2.00, head goes solid".
- The rules-table icons sit inline (`.tb td:first-child svg` gets
  `!important`).
- `mark()` takes `{shell: 'diamond'}` for any set, so the dropped card
  shows Specimen's district and street in the diamond.

Next: the director scores all six.

## Where things stand (2026-10-15, round 3, after jam turn 15)

Director turn 14 ruled on the jam:
- **Law accepted:** "Outlined means you haven't marked it yet (Star,
  Visited). Nothing else in the app is an empty shape", plus "only your
  marks vary".
- **Killed / settled:** C is killed. Directions is the ring with a solid
  needle. Account is a solid head with open shoulders. District and street
  sit in the circle.
- **Weight and chips:** 2.00px on screen everywhere. Specimen's chips are
  bare.
- **Both concepts go forward,** with conditions 1–10.

I built the six v5 cards (turn 15), all in `../concepts/sketches/`, 390
wide at 3x:
- `v5-card-rules.png`
- `v5-card-0-today.png`
- `v5-card-1-specimen.png`
- `v5-card-2-roundel.png`
- `v5-card-3-side-by-side.png`
- `v5-card-4-dropped.png`

Source: `../concepts/sketches/attitudes-v5.html`. To re-render (the script
was in the scratchpad):

```
NODE_PATH=/opt/node22/lib/node_modules node cards6.js <html> <outdir>
```

That script is cards5.js plus a wait for `window.READY`, with names
`['rules','0-today','1-specimen','2-roundel','3-side-by-side','4-dropped']`
and the prefix `v5-card-`. It logs the measured ink cover per glyph.

Structure of the v5 block:
- `W = 2` is the one weight. `u(px, size)` converts on-screen px to
  viewBox units.
- `TL`: the tools under the law. `TT`: Today's tools as shipped.
- `SP`: the Specimen sources (CP silhouettes; FG district/street; a temple
  for attraction; a hatched square for area; a pennant for other).
- `RO`: the Roundel close-ups, clip r = 9.1 at 24px.
- `fitAll()` measures each glyph on a canvas, fits Specimen to the radius
  `innerR − 1.0px` around its bbox centre, then shrinks heavy glyphs toward
  the 60th-percentile area with exponent .35. It logs the coverage.
- `mark(set, cat, size, {sel: 'pin'|'row'})` is the one function for rows,
  pins, the tag's pin and chips. Today's district/street use the diamond.
  `denseMap(set, h)` places 19 pins (`PINS`) plus the selected pin,
  stickers, clusters and the tiles' district box. `farStrip()` and `tag()`
  hang the tag from its selected pin; the band turns orange when starred.

Findings:
- **Ink cover:** Specimen averages 28% (18–35%); Roundel 49%.
- **Roundel misreads:** area fails (a hatched coin), district is
  borderline (a beach ball). Shopping at 16px and hotel at 16px are
  borderline. Bar, attraction and hotel were redrawn.
- **Roundel is half "Specimen, bigger".** Tall, narrow objects (fork, tree,
  glass, flag, bed) only get their ends trimmed. On the map it's much
  heavier.
- **Roundel's selected pin inverts badly.** A crop that fills most of the
  field turns mostly cream, so the open café looks unselected.
- **Specimen is evolutionary**, close to Today in the row. I said so in
  the turn rather than dressing it up.

Next:
1. Systems runs coverage on the v5 cards.
2. The director scores all six in one pass, and rules on keeping Roundel
   or finding a second concept that differs in kind.
3. Then the fix pass. Known nits: the star icons stack in the rules
   table; the dropped card's diamond shows Today's dashed glyphs.

## Where things stand (2026-10-15, round 3, after jam turn 13)

I'm a new visual designer, picking up from these notes. The owner's reply
to v4 (see `../../owner.md`):

- **His rules:** places are solid and can sit in a stroked circle;
  outlined = "not yet tapped by me" (Star, Visited); Visited is unchanged.
- **His picks:** FG, CP and Spot work best. Timetable is off.
- **The +:** it's now in the project ("everything is inconsistent").

Systems opened round 3 in turn 12 (A outline reserved / B two registers /
C circle does the work). I took turn 13 with three jam sketches, which are
not owner cards:

- `../concepts/sketches/r3-jam-1-blanks.png`: the law, and A vs B in the
  tag strip and header.
- `../concepts/sketches/r3-jam-2-places.png`: Specimen vs Roundel, all 11,
  rows, map, chips, district/street circle vs diamond.
- `../concepts/sketches/r3-jam-3-weight.png`: every line, today vs 1.5 vs
  2.0.
- Source: `../concepts/sketches/jam-r3-visual.html`. It's the first 336
  lines of `attitudes-v4.html` (G sets + helpers) plus a round-3 block.

To re-render:

```
NODE_PATH=/opt/node22/lib/node_modules node cards5.js <html> <outdir>
```

`cards5.js` was in the scratchpad: it screenshots each `.card` at DSF 3
after `fonts.ready` plus 1.5s, and names the files `r3-jam-<n>-*.png`. The
scratchpad doesn't survive a session, so here is the whole script:

```
const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800},deviceScaleFactor:3});await p.goto('file://'+process.argv[2]);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);const n=['1-blanks','2-places','3-weight'];const c=await p.$$('.card');for(let i=0;i<c.length;i++)await c[i].screenshot({path:process.argv[3]+'/r3-jam-'+n[i]+'.png'});await b.close();})();
```

Round-3 code structure:
- `u(px,size)`: on-screen px to viewBox units.
- `TB` / `TA`: tool sets for B / A, drawn as `(size, px) => svg`.
- `P1`: Specimen place glyphs (picked from G.F / G.C).
- `P2`: Roundel close-ups, clipped by the rim at r = 12 − rim − 0.9.
- `mark(kind, cat, size, {sel, rim, shell, row, g})`: draws circle or
  diamond shells, the selected inversion (row → navy field, pin → ink
  field), and the clip.

### Turn-13 positions (mine, for the director)

1. **A and B are one concept.** They differ in three icons only (account,
   locate, directions). The law: **"the only empty shapes in the app are
   the blanks you haven't filled"**. Tools can be lines, but any closed
   shape in a tool has something solid inside it (solid account head,
   solid locate dot, solid filter knobs, compass ring with its needle).
   - A blank is the exact hollow of its done state: same silhouette, same
     size, never scaled down. That's the railway-lamp logic.
   - The open question: Directions as ring + needle (B, my lean) or a
     solid turn arrow (A, "road paint"). The arrow says "turn right"
     literally.
2. **Kill C as a standalone.** The collision is in the tag strip, where no
   place appears. Circle = a place stays as the shared rule.
3. **Two place concepts that differ in kind:**
   - **Specimen:** floats in the rim. Mix:
     - CP silhouettes as the base.
     - Spot primitives as the construction grid.
     - FG cream inlay only where the object really has a second colour
       (fork gaps, road centre line, district streets).
     - One note of character per glyph.
   - **Roundel:** the rim crops a close-up, like a coin or a porthole.
     The owner has said yes to the crop elsewhere ("centered in the circle
     even if it's slightly cut off").
     - It's about 1/3 larger and the best-reading at 24px, but it's more
       ink per pin.
     - Some crops become other signs: area as "no entry" (redrawn as a
       hatched coin, still weak), district as a crosshair (streets moved
       off-centre), hotel as a half-moon (zoomed out).
4. **District/street: circle, my lean** (against systems' diamond). In the
   diamond the glyph shrinks to 0.6 and is the hardest to read. He wrote
   "circle". Show both.
5. **Weight: 2.00px on screen for every single line.** The FIXED check is
   1.52px, but as a hollow bar it reads like a 2.0px line. At 1.5px the
   star off goes weaker than the check, which is the 10-07 complaint
   again.
   - What moves: sort/filters/chevron 1.5 → 2, tag × 1.28 → 2, locate
     2.08 → 2, directions 1.90 → 2, star off 1.67 → 2.
   - The + and the account already sit at 2.00.
   - Watch the tag × at 14px. If it gets loud, make it smaller, not
     thinner.
6. **Chips: bare, my lean.** The chip is the shell. Roundel's chip has to
   carry a 16px roundel.
7. **"Other" (a dot in a ring) reads as a selected radio button**, today
   too. It's a phase-2 drawing fix.

### Next

The director steers turn 14. If Specimen and Roundel go forward, build
the round-3 cards:
- Today, Specimen and Roundel, plus a shared rules card (the law, systems'
  "tapped by me" table, the weight still, the Directions question,
  district/street circle vs diamond).
- Each concept card covers jobs 5, 6, 9 and 11–13 (all 11, rows
  plain/visited/selected + starred, tag strip, map, chips, header).

Fix before the owner sees them:
- Roundel's area and hotel drawings.
- The "other" glyph.
- An optional 12px cut.

Then systems runs coverage.

## Where things stand (2026-10-14, after turn 11)

Director round 2: FG 9, TS 8, brand card 8 (9 with the copy change), CP 7, so CP is dropped. Applied: the brand-card sentence and the TYPE label; TS account and directions are circles again; the TS tag off star is 23px; TS district is an outlined block cut by two streets (mask + clipPath in G.S.district); CP is off the side-by-side and onto the dropped card. Owner set = brand card, cards 0, 1, 3, 4, 5 (v4). v4-card-2 is a record only.

## Round 2 build (after jam turn 9)

Director round 1 scores: FG 7, CP 6, TS 8. Nothing has gone to the owner.
Round 2 is built in `../concepts/sketches/attitudes-v4.html` and renders
to the `v4-card-*.png` stills:
- `v4-card-brand` (new, goes in front)
- `v4-card-0-today` through `v4-card-5-dropped`

Re-render with `cards4.js` in the scratchpad (the same as cards3, plus the
brand card name). New reference image: `ref-savoy-luggage.jpg`, cropped
from `design/inspo/project/hotel-savoy-dolomiti-label.jpg` at
(120,460,800,900). Nothing goes on the icon canvas: these are stills only.

How the round-2 overrides are built: the `ROUND 2 OVERRIDES` block,
inserted before `CAT`, patches `G.F`, `G.C` and `G.S`.
- `SOFT()` wraps glyphs in the `#soft` filter: a blur of .42 plus an alpha
  ramp, which gives about a 0.5 corner radius, as on the check. Its
  filterUnits must stay userSpaceOnUse, or horizontal-only paths vanish.
- `sq()` draws butt/miter strokes.
- `strip()` draws angle-cut parallelogram strips.

Tool grammars:
- FG: square-cut softened ends, inlaid knobs.
- CP: filled angle-cut strips.
- TS: lightly rounded type cut, squarish rings, ×/+ proportioned to the
  caps.

Places:
- FG: one cream inlay on all 11.
- CP: no lean; the scissors are in the silhouette (flares, bites, S-cut);
  street is a single tapered ribbon; the off star is solid.
- TS: district is a T-junction block.

Verdict at phone size: TS is distinct. FG now reads as "Today, as a
printed family". CP is distinct in the category strip but still near FG in
the row, tag stub and map, so I recommend moving it to dropped. The
director rules on that.

## Earlier (after jam turn 7: six stills built)

The jam is closed (director turn 6). I built the six stills per §3 in
`../concepts/sketches/attitudes-v3.html`. They render to `v3-card-0-today`,
`v3-card-1-field-guide`, `v3-card-2-cut-paper`, `v3-card-3-timetable-sorts`,
`v3-card-4-side-by-side` and `v3-card-5-dropped` (.png, 1170 wide, 3x).

How to re-render: playwright from `npm root -g`. The scratchpad script
`cards3.js` loads the page, waits for `document.fonts.ready` plus 1.5s, then
takes an element screenshot of each `.card` at DSF 3. The real visited PNGs
are `ref-row-stamp`, `ref-row-stamp-selected`, `ref-tag-stamp` and
`ref-sticker-near`. The map land colour is #E8E4DA, so the sticker PNG's
background blends in.

Builder-relevant structure: `G[dir][name]` holds the inner SVG markup for
every glyph (dirs T, F, C, S). Knockouts use `var(--ko)`, so selected pins
and rows can invert them. Timetable strokes use `var(--sw)`, set per size by
`swFor()`: 12px = 2.9, 18px = 2.35, 24px = 2.

Turn-6 rulings, as applied:
- Field Guide: tools are navy at 1.8 round (never grey). Buttons keep their
  loudness; at 1.8 the glyph isn't timid.
- Timetable: ink traps, squarish curves, flat ends, mitred corners, and the
  optical masters. It's the only direction that looks different at a
  glance in rows and on the map.
- Cut Paper: tools are about 1.7 strips; the row × is quiet; the off star
  is dotted with a solid fallback inset; places get a fixed 3–5° lean.
- District = a block cut by streets in every direction. Street = FG a
  perspective road, CP a winding ribbon, TS converging edges with a dashed
  centre.
- Mark-visited check: FIXED, unchanged, on every card.

Findings:
- In rows and on the map, Field Guide and Cut Paper are near-Today: one
  detail per glyph. Card 4 says so.
- The dotted star is the faintest mark in its stub; I'd ship the solid
  fallback.
- Cut Paper's account glyph in the scallop looks timid, and its tools
  converge with Field Guide's.

Open for the director: push FG and CP further at 18px, or show them as
they are.

## Earlier (after jam turn 4 = pass 2)

Pass 2 is done. Board: `../concepts/sketches/attitudes-v2.html`, with one
PNG per card (`v2-card-0-today` … `v2-card-4-dropped`) plus
`attitudes-v2-3x.png`. Rendered with the scratchpad scripts `shot.js` (full
page) and `cards.js` (per-card element shots, DSF 3, waiting on
`document.fonts.ready` so Archivo loads from Google Fonts). Directions
going forward (director, turn 3): **Field Guide, Cut Paper (with Spot
merged in), Timetable Sorts**. Dropped strip: Same Die (kept as the grid
seed), Spot, Badge, Code, Linocut. Parity is NOT a premise: each card
states its own on/off stance.

Pass-2 decisions:
- Field Guide: specimens are filled with corner radius ~0.8; tools are a 1.8
  stroke with round ends (radius 0.9), in ink-2. One grammar, two weights.
  District is a solid parcel with a cream dashed inner boundary, and the
  dashes mush at 12px.
- Cut Paper: off = the dotted cut-here line in tool ink (passes 1-bit);
  the fallback is a solid knife line. District is one off-true block cut
  into 4 by two cream street gaps. Its tools are still the heaviest marks
  on the board.
- Timetable Sorts: a 2-unit monoline with flat ends and mitred joins,
  filled only where a typeface would fill (star, knife blade, needle).
  ☆/★ are a typographic pair. There is an inline proof line in caps
  type. Next: real Archivo cues (ink traps, squarish curves).
- Every card: a plain + selected navy row, the tag stub with the real
  stamp, a map crop (near pins, a selected inverted pin, a cluster),
  12px and 1-bit strips, and Says / Risks / Choosing. Still to add:
  true 1x insets.

## Earlier (after jam turn 2)

Phase 1 (brand approach to icons: conceptual attitude, not drawings). I took
jam turn 2 in `../jam.md`. No concepts, no scoring, no grid. Next: the
design director steers.

Fixed: **"Visited should not change."** The owner wants more than one
direction. Feedback is normal iteration.

## Read

`../../owner.md`, `docs/owner-taste.md` (all of it), the inspo README and all
8 `design/inspo/project/` images, CLAUDE.md, `../../inventory.md`, the badge
row and the starred+visited context screen, and turn 1. NOT read: the
superseded `design/icon-system/concepts/`, the old jam, scores and notes.

## Sketch

`../concepts/sketches/attitudes.html` produces `attitudes-3x.png` (1170 wide,
3x, headless Chromium via global playwright; the script was in the
scratchpad: load the file, then a fullPage screenshot at DSF 3, viewport
390). It shows Today, Spot pictogram, Cut paper, Same die and Specimen &
key. Each one has the same 7 icons (cafe, district, star off, star on,
filters, ×, +) at 24px, a real row crop with the REAL visited stamp
(`ref-row-stamp.png`, copied from inventory-png), a 12px strip, and a
one-ink strip (an SVG threshold filter at 67% grey). These are sketches of
an attitude, not drawings.

What the sketch showed:
- With full-ink tools (Spot pictogram, Same die), filters and × end up
  heavier than the visited stamp. Tools outrank content.
- Cut paper's "uninked stock" off star vanishes in one ink, so it's
  colour-only. It needs another off state (the cut hole).
- The tint-screen off star (Spot pictogram) survives one ink at 24px, but
  turns to mush at 12px.
- Specimen & key is the calmest row; the stamp reads as the loudest mark.

## Decisions so far and why

- Ethos one-liner: "Printed with care, marked by hand, kept like a
  souvenir." The inspo's icons are quiet furniture inside loud compositions
  (the Savoy pictograms), so icons are the furniture, not the poster.
- A (Printed & Stamped) is a governing law over all the directions, not a
  look of its own.
- Kept B (Spot pictogram), with print-logic off states: tint screen,
  keyline, and blind deboss (killed).
- C reshaped from linocut to **Cut paper** (Matisse draw): the hand goes in
  the drawing, not the edge.
- D killed as a direction. "Outer shape = family" is already shipped, so
  every direction keeps it.
- E killed ("preserve the icon").
- New **F Same die**: draw with the visited check's bar and the tag's 45°
  die-cut corner, so the fixed marks become family.
- New **G Specimen & key**: places are specimens with character; tools are
  at the weight of the caps type, in ink-2. It must share one grammar and
  differ only in weight and ink.
- Whimsy budget: place glyphs and the user's own marks only, never tools.
- Show the owner at most 4 cards, Today first, the same layout as the
  sketch, plus a tag-stub crop.

## Director's objections

Turn 3: parity rested on an old note, so it was dropped as a premise. The
sketch's districts were weak ("medical badge", "guitar pick"). The
sketch was missing the map, the reversal and the tag stub. Same Die is a
method, not an attitude. Q2 (is the star printed or applied?) was answered
by the Pencil Star. Q3 (whimsy for places only) is now a team default.
Turn 6: the three directions look near-identical in rows and on the map
(the top risk). District was still weak and street was missing. No grey
tools in FG. Buttons keep their loudness. Timetable needs its typeface cues
and a 12px cut now. Cut Paper's tools should be lighter and its row ×
quiet. Mark visited is treated as FIXED.
Round 1 scores (scores.md): FG 7 ("Today, tidied"; anonymous tools), CP 6
(the lean reads as an error; the tools became strokes; the dotted star reads
as missing), TS 8 (breaks "lightly rounded"; the check looks foreign; the
tools are stock). Shared fix: each direction's tools get their own grammar.
The brand card was missing.

## Open questions (owner's calls)

1. "Checked stronger than open": should off get stronger, or everything
   else get quieter? This decides whether G is eligible, and the weight
   for B and F.
2. Is the star printed or applied?
3. Is whimsy for place glyphs only, or for tools too?

## Next

The director's steering. Then build the concept cards with the systems
designer: for each chosen direction, how it looks and feels on the stress
set plus the tag stub, beside the unchanged visited stamp. Fix Cut paper's
off state first. Try a two-weight version of Same die.
