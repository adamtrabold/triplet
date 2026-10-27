# Sharp at 2x and 3x

**Superseded 10-27 by `THE-GRID.md` (one side on the grid, `src/one-side.js`).** Rounds 1-8 below are history; their rules are retired or reconciled there (section 6).

## Round 8 (10-26, canvas v270, edited v271): the owner's answer to v269. Superseded by THE grid

**v271 (director turn 189, no drawing changed):** the museum lean is dropped and E (his "three cols") comes first; the board and question 1 say both options are about 1px taller than approved (E 10.7, D 10.8 vs 9.6; the slabs are now 2px). Soft counts in the trade box are given for both (with E: 5K 17, iPhone 23; with D: 5 / 15). Board 940 × 2336; v270 archived as `Archive-G7bm-Sharp.dc.html` (x 7800 y 210000); stills `stills/pixel-shapes/r8/sharp-v271-1..3.png`. The "Lean D" below is withdrawn.

Owner, verbatim: "re museum what does it look like if we just make it wide enough (and the grid pattern for whatever grid its aligning with) to support three cols with a 1px minimum counter space? that icon feels the most visually balanced with the rest. for the coupe, a b and c are all terrible -- the drink looks empty. re: the plus, i need to see it with all of the icons -- it should look visually the same weight, actual pixel is irrelevant. off center is not acceptable. the star in the row and the star in the tag are different stars -- they need to be the same star for me to judge them."

**Rule changes.** Rule 3: counters and gaps whole px, **at least 1px** (`PROP.px.counterMin`); the 2px floor and coupe C's 1½px exception are retired. A counter is what the drawing's proportions give, rounded whole. Rule 6: symmetric icons sit **exactly** on the centre line; a 1½px part on it goes soft instead; the ¼px offset (`centreOff`: museum B¼, the ¼-off +) is withdrawn. Rule 7: one drawing per line mark everywhere (the star 12px tall in the row and on the tag); a line mark's stroke is picked by eye beside the whole set, not by pixel count.

**Museum.** "That icon" isn't named; we read it as the approved one (most balanced in v269's rows; its three counters were under 1px). **D** = `museum({cols:4, open:1, openH:3})`: four 1½ columns, 1px openings, 9 colonnade + ½px bevel each side = **10 × 10.8** (approved 9.78 × 9.62), columns 3px (⅓ of the colonnade), ink 77.9 (+19%), 0 / 4 soft (the middle opening is centred at 1px: 11.5..12.5, sharp at 2x, soft at 3x). **E** (the literal "three cols" reading) = `museum({cols:3, openH:3})`: 9.5 × 10.7, 2px openings, ink 70.0 (+6%), 12 / 12 (middle column centred at 1½). D4 (openH 4, 11.8 tall) built and dropped: too tall. Lean D. fair: the 4 capital TAILs as every museum; join 0.

**Coupe.** Measured drink at x 11 (`pixel-shapes-drink.js`): approved 2.46, C 2.02, **D** `bar({band:1, footW:6})` 2.52 (band 1, bowl 10 × 5), **E** `bar({band:1, footW:6, rimTop:7.5, depth:5.5})` 3.02 (rim ½px higher, bowl 10 × 5½; rim top on a half px). Ink 48.1 / 52.7; soft 2 / 4 and 2 / 3; fair 0, join 0. The band at 1px is "a little thinner" than the 1½ rim (his 10-21 words). Lean E (fullest), D if ½px deeper is too far.

**The +.** Centred, arms equal, 14 across: 1½ (ink 39.6, 8 / 8 soft), 1¾ (45.8, 8 / 8), 2 (51.9, 0 / 0). Shown in a row with the five badges and the star at 24 and 72 (drawn at 72), and in its orange button in the app. Lean 2 (opinion): on the orange it carries the filled glyphs' weight; 1½ matches only the ring.

**Star.** `starMark({h:12})`: one star, 12.0 × 12.6, fair 0, join 0, ink 50.8 (outline), shown 1:1 in the row (starred, filled), the tag starred and the tag unstarred (app shots via `src/pixel-shapes-ctx.js`, now looping over any states in its glyph file). Before: row 12.1, tag 13.4; v269: 11 and 13.

**Soft straight edges, the set as it leans** (café, coupe E, museum D, tree, + 2): 5K 35 → 5, iPhone 47 → 15.

**Board:** 940 × 2341 measured; v269's archived whole (`Archive-G7bl-Sharp.dc.html`, Archive x 6780 y 210000); Start item 6 rewritten. Script `src/pixel-shapes-board.py` (round 7's kept as `-r7.py` with `pixel-shapes-board-blobs-r7.json`); stills `stills/pixel-shapes/r8/` (phone stills `sharp-v270-1..3.png`); outlines `svg/pixel-shapes/{museum-D,museum-D4,museum-E,bar-D,bar-E,plus-15c,plus-175c,star-12}.svg`.

**Still can't land:** the 1½ line at 3x; museum D's 1px centred opening at 3x; the coupe's stem and the trunk (centred 1½); capital steps and bevel ends at 3x; curves, diagonals, tips.

---

## Round 7b (10-26, canvas v268): turn 184's three edits. Superseded by round 8

No drawing changed. The six at 72 rendered at 72 (`stills/pixel-shapes/r7/row72-*.png`) for approved, A, B¼, C. Museum sizes (outline boxes): approved 9.78 × 9.62, A 13 × 12.32, B¼ 9.5 × 11.74 (2px taller than approved), C 11 × 11.99. Museum B dropped (it was B¼, softer). The coupe's exception is dated (10-21) beside his v264 "maybe they could go up to 2px?"; C stated as ½px less drink than approved. Board 2373 tall; v267's archived as `Archive-G7bj-Sharp.dc.html`.

## Round 7 (10-26, canvas v267): the director's five fixes (jam turn 182)

Same rules as round 6, two amended; the drawings are round 6's except two new ones (museum B¼, the + at 1½). Board "Sharp at 2x and 3x" rewritten in place (940 × 2393, measured); v266's board archived whole as `Archive-G7bi-Sharp.dc.html` (Archive page, x 3720 y 210000). Script `src/pixel-shapes-board.py` (round 6's kept as `pixel-shapes-board-r6.py`), asset ids `src/pixel-shapes-board-blobs.json`, stills `stills/pixel-shapes/r7/`, app shots `src/pixel-shapes-ctx.js`.

**Rule changes.** Rule 3: one exception, a band directly under a rim may be the line (1½: `PROP.px.band`, the owner's "the empty part should be equal to the thickness of the stroke"), coupe C only, his to accept. Rule 6: a symmetric icon whose centred part is the line may sit ¼px off the centre line (`PROP.px.centreOff`), so that part keeps one whole edge like every line. Rule 5 clarified: a bevel is not a protrusion. The museum's ½px overhang is all curve (`joins.heldSlab`: the slab's end drops ½ and curves ½ into the post; no straight step), his "bevel of the plinth ends into the columns", so it stays ½px; its ends land on half px (sharp at 2x, soft at 3x).

**Fix 1, the museum in the six.** Five rows at 24 in their badges (approved, A, B, B¼, C), the same café, coupe C, tree and fork and knife in each. A (13 wide, ink +60%) crowds its ring and is the biggest in the row: our round-6 lean doesn't survive it. **B¼ is new:** B (three 1½ columns, 2px openings, 9½ wide) moved ¼px right (`museum({cols:3, openH:4, dx:0.25})`): columns at 8..9.5, 11.5..13, 15..16.5, each with one whole edge; 0 / 6 soft (B 12 / 12), ink 74.5 (+13%, as B), fair 4 TAILs (the capitals', as every museum), join 0. We lean B¼ (opinion). It is the director's ¼px + fix applied to the other centred line part, so it is one rule, not a one-off.

**Fix 2, the coupe.** Stated on the board: every option moves the rim's cut from ⅕ to ¼ of the ellipse's height (bowl 4.8 → 5 deep, bottom whole). Drink measured on the outlines (ink run under the band at x = 11, `src/pixel-shapes-drink.js`; +0.08 to the centre):

| | approved | A | B | C |
|---|---|---|---|---|
| drink | 2.46 (≈2½) | 1.52 | 2.54 | 2.02 |
| band | 0.75 | 2 | 2 | 1.5 |
| bowl w × depth | 10 × 4.8 | 10 × 5 | 12 × 6 | 10 × 5 |
| ink | 45.5 | 42.4 | 59.4 | 45.1 |
| soft 2x / 3x | 11 / 10 | 2 / 4 | 2 / 4 | 2 / 3 |

With a 2px band, 2½ of drink needs a 6px bowl: wider (B) or deeper (he ruled deeper out: "the shorter bowl i think is necessary"). C squared by the rule-3 exception. We lean C (opinion); if the band must be 2px, B.

**Fix 3, the +.** 2px (round 6) beside 1½px set ¼px off the arms' centre (`plusMark({span:14, stroke:1.5, off:0.25})`: strokes 11.5..13, ends 5 and 19): 0 / 4 soft (2px 0 / 0; before 6 / 8), ink 39.6 (2px 51.9, +31% on it; before at its 26.4 display ≈ 41). Cost: the arms are ½px unequal (6½ left and top, 6 right and bottom); not visible at true size to us. A 1½ stroke can never be centred on arms with whole ends (its centre is k + ¼ or k + ¾). Shown in the app's button at true size and per device pixel; asked, not decided. Found while shooting: round 6's in-app "now" + shots were 0.22px off (the button's transform transition was still running), so their pixels were soft; `pixel-shapes-ctx.js` now places the button by `left`/`top` with no transition (checked: every 2px edge a whole device pixel). Round 6's 0 / 0 was from the outline and stands.

**Fix 4:** the bevel line (rule 5 above). **Fix 5:** the board leads the star with "In the app the star was already about this size; our boards drew it 16px tall in a ring", and puts the iPhone's count near the top as one trade: the 1½px line he kept is 4½ iPhone px, one side ⅙px soft; sharp would need a 2px line or a per-screen pass, both turned down.

**Soft core edges, the six as the board leans** (café, coupe C, museum B¼, tree, the + at 1½, star): **5K 35 → 5, iPhone 47 → 21** (of 64 → 59). With the + at 2px: 5 / 17. Fork and knife 13 / 18 → 2 / 5 (unchanged).

**Still can't land:** the line at 3x; the coupe's stem and the trunk on the centre line (the ¼px rule would land them but soften their centred feet, so not applied); the capitals' ½px steps and the bevels' ends at 3x; curves, diagonals, tips.

---

## Round 6 (10-26, canvas v266): parts are shapes on whole pixels. Superseded in part by round 7 (rules 3, 5, 6; the leans)

Owner on v262's iPhone row (verbatim): "this should be a shape not a line" (the saucer, the beam); "nothing should be this small" (the coupe's ¾px band); "i think of the counters as shapes. they can go to (or be shortened to) a whole pixel"; "it is a hard pixel number wide, it should be the same hard pixel number tall?" (the +). On v264: "the museum and coupe counters are reading as too small now -- maybe they could go up to 2px? would the museum width need to account for that ..."; "the knife edge doesnt stick out far enough to be visible ... adjust that somehow mathematically in the fules"; "the star is way too fucking big -- it would never be in a circle. and the plus is never in a circle like that." Standing: "no i want the base grid to make great icons without extrawork"; keep the line weight; "nothing should go that thin".

Round 5 below is superseded (its board is archived whole: `Archive-G7bh-Sharp.dc.html`, Archive page x 2700 y 210000).

**Built into the system, not a pass.** `src/proportions.js` `PROP.px` holds the numbers; `src/pixel-shapes.js` is the root calls that follow them (in badge px at 1:1, through `mix-curves.js`'s root-based corner law and `engine.js`, unchanged); a new icon written with these roots inherits them. Run: `OUT=<dir> VARIANTS='{"name":{"icon":"museum","o":{...}}}' node src/pixel-shapes.js` (about 1 min an icon; the star 3 builds, ~10 min). Outputs `svg/pixel-shapes/` (`build.json` = each option's opts and outline; `before.json` = the round's before set), stills `stills/pixel-shapes/` (board crops; `ctx/` = the app shots), board `src/pixel-shapes-board.py`.

### The rules

1. **Shapes are whole px.** A solid part that is not the line has whole-px height and width, and its level and upright edges, a curve's flat side and its extreme, on whole px. A **slab** (beam, plinth, saucer, foot) is **2px**: the first whole px not thinner than the line.
2. **The line stays 1½px** (posts, walls, rims, stems, loops). The one width that can't be whole: one edge whole (the silhouette's side), the other on a half px. Sharp at 2x, half a pixel soft on one side at 3x.
3. **Counters are whole px, at least 2px** (openings, the coupe's band, the cup's ear). **Gaps** between parts (a cut, the fork's tines): whole, at least 1px.
4. **No ink part under 1½px.** A cap's ends are where its curve runs out, not a part: they keep the cap rule (half the crown), so a 2px cap ends at 1px and its flat side, the ends' foot and the crown all land whole. (Tried at 1½px ends: the saucer and foot read as planks.)
5. **Minimum protrusion 1px.** A feature that names the object by sticking out (the knife's edge past its handle, a step, a lip): the join's own round (the post flare, ½px) eats the first ½px, so ¾px showed ¼px (half a 5K pixel); at 1px, ½px of straight step survives: a whole device pixel at 2x, 1½ at 3x. The capital's ½px drop and flare are a bevel (read by the diagonal), not a protrusion, and stay.
6. **Symmetric icons stay on the badge's centre line.** A centred part lands whole only at an even width (a 2px opening lands 11..13); a 1½px part centred can't (11.25..12.75).
7. **Line marks are drawn 1:1 in their real slot**, sized by that slot and the type beside them, never by the badge's coin, never in a ring. Row star = the name's cap height (Archivo 600 15px: 11px, measured in the app) → **11px tall**; tag star = its neighbours' size (compass, check) → **13px tall** (the old rule gave 13.4 there; it already fit); **+ = 14px across, 2px stroke** (the one stroke near the line that centres whole both ways), in a 24 box at 1:1 in its 60px button.

### Soft core edges at the 24 badge (pixel-fit.js `edges`, off > 1/10 device px)

| icon | before 2x / 3x | now 2x / 3x | ink before → now (px²) |
|---|---|---|---|
| Café | 0 / 5 (12 edges) | 0 / 3 (13) | 55.5 → 63.1 |
| Bar, A (2px band, same glass) | 11 / 10 (11) | 2 / 4 (10) | 45.5 → 42.4 |
| Museum, A (four columns) | 15 / 19 (24) | 0 / 10 (23) | 65.7 → 105.3 |
| Nature (unchanged) | 3 / 5 | 3 / 5 | |
| + (in its button, 1:1) | 6 / 8 | 0 / 0 | 34.0 (at 26.4: ~41) → 51.9 |
| Star | no straight edges | | |
| **the six** | **35 / 47 of 64** | **5 / 22 of 63** | |
| Fork and knife | 13 / 18 | 2 / 5 | 54.2 → 57.8 |

Before = the latest of each: the café, star and + as placed on v262 (`svg/placement`), the bar, museum, tree and fork and knife with posts at the line (`svg/post-line`, not placed).

Options: Bar B (12 wide, 6 deep, drink 2½) 2 / 4, ink 59.4; Bar C (band 1½) 2 / 3, 45.1. Museum B (three columns, 9½ wide) 12 / 12, 74.5; Museum C (three columns, posts 2px, 11 wide) 0 / 6, 90.9.

Checks: join-check 0 on every new outline. fair-check: bar A/B/C, fork and knife, + clean; café 1 JUMP (was 1 KNEE); the museum's 4 TAILs are the capitals', the same 4 as before (the flare redraw carries them).

### The museum's width (his construction question)

Four 1½px columns with three 2px openings are 12px; the beam and plinth pass the outer columns by ½px (1/3 of a post), so the building is **13px wide** (was 9.8); columns 4px tall (1/3 of the colonnade, as before; 3px read as windows), slabs 2px, cut 1px, gable ends 1.2, pitch 1/3: 12.4 tall. **A** keeps four columns and grows (ink +60%, the biggest of the six; sharp at 2x). **B** three columns keeps the size (+13%) but its middle column sits on the centre line at 1½px: soft at both (12 / 12). **C** three columns with 2px posts lands every edge but the ½px capital steps (0 / 6), ink +38%, posts a third heavier than the line. We lean A (an opinion: it is the building he described).

### The coupe at a 2px band

One ellipse 4/5 as tall as wide, the rim cutting it ¼ of its height above its centre (was 1/5, so the bowl's bottom lands whole: depth 5), rim 1½, band 2: **A** drink 1½px at its deepest (was about 2½); **B** keeps the drink (2½) by growing the glass to 12 wide, 6 deep; **C** band at the line (1½), his "the empty part should be equal to the thickness of the stroke", drink 2. Foot a 2px cap, 6 wide (A, C; 4/5 of the bowl's width over the cap's 1.155), 8 (B).

### What still can't land

- The 1½px line at 3x (4½ device px): one side half a pixel soft. Most of the iPhone's 22.
- A 1½px stem on the centre line (coupe stem, trunk): 11.25..12.75, soft at both. 2px lands it (tried on the coupe B: sharp) but is heavier than the line.
- The capitals' ½px steps (soft at 3x); curves, diagonals and tips (by design).
- In the app, two slots sit off whole px today: the row star's 18px box at y +½ (top 675.5) and the + button at x 15.22. A CSS fix ships with the icons; the "now" shots apply it.
- Shopping: not in this round (open for its own concept round).

---

## Round 5 (10-26, canvas v262): vertical centring is optical, per icon. Superseded by round 6

Director, turn 178: symmetric icons were pinned vertically too, but "vertical centering should be optical always on a per-icon basis". Now every icon may move up or down (at most 1/4px); icons symmetric across x still stay on the centre line horizontally. Judged by eye at 72px and true size against the badge's centre line: none reads off-centre.
- **Add:** moves 0.23px **up** (the search found up, not down, sharpens its arm: its horizontal arm's top edge lands whole). Soft 8/8 → 6/8. Favours the 5K. Up is also the optical-centre side.
- **Bar:** unchanged (1/16px up already its best); 9/9. Both screens alike.
- **Nature:** unchanged (1/4px down); 4/2. Favours the iPhone.
- Café 0/5 favours the 5K; Museum 13/9 favours the iPhone.

**Totals:** soft core edges 5K 54 → 32, iPhone 53 → 33 (107 → 65 of 130). The board lists which screen each icon's sharpening favours.

## Round 4 (10-26, canvas v261): placement only, weights kept

Owner on the whole-pixel grids (verbatim): "lets just keep the line weight and stuff where it was and just opimize point placement as possible. the other options look like shit". His "no i want the base grid to make great icons without extrawork" still stands. Rounds 1 to 3 below are history; A, B and C are on the Archive page (row "Whole-pixel grids", `Archive-G7bf-WholeGrid`).

**What stays:** the 1.5px line, the 1.25px posts, the badge and ring, the sizes, the proportions, the six's look. **What moves:** positions only, once, in the drawings themselves (one outline for every screen, no per-screen pass). Code: `src/placement.js` (uses `pixel-fit.js` with `tie: 'keep'`: every width kept exactly). Outlines: `svg/placement/<icon>.svg` (the candidate six); numbers `svg/placement/measure.json`; renders `stills/placement/raw/`; board `src/placement-board.py`.

**How:** whole CSS px are the only positions sharp at both 2x and 3x. Per icon, the best of:
1. the whole icon moved (its optical centring snapped), at most 1/4px a side; icons symmetric across x stay on the badge's centre line (the + can't move at all);
2. its straight edges moved to a whole-px, 1/2px or 1/3px lattice with widths kept (a stem lands whichever edge moves less), accepted only if no point moves over 1/2px and ink changes under 2%.

**Result (soft core edges, 5K / iPhone, at the 24 badge):** 54 → 34 at 2x and 53 → 33 at 3x, of 65 each (107 → 67 of 130). No point moves more than 0.25px.

| icon | core edges | approved | whole icon moved only | placed | how | max move px | ink | fair / join |
|---|---|---|---|---|---|---|---|---|
| Café | 13 | 13 / 13 | 5 / 5 | 0 / 5 | 1/2px | 0.221 | -1.84% | 1 / 0 |
| Bar | 11 | 11 / 10 | 9 / 9 | 9 / 9 | moved whole | 0.063 | 0% | 0 / 0 |
| Museum | 24 | 17 / 17 | 17 / 17 | 13 / 9 | 1/3px | 0.114 | 1.76% | 0 / 0 |
| Nature | 5 | 5 / 5 | 4 / 2 | 4 / 2 | moved whole | 0.25 | 0% | 0 / 0 |
| Star | 0 | 0 / 0 | 0 / 0 | 0 / 0 | as drawn | 0 | 0% | 0 / 0 |
| Add | 12 | 8 / 8 | 8 / 8 | 8 / 8 | as drawn | 0 | 0% | 0 / 0 |

**Visible change:** at true size, none that we can see (board: approved and placed side by side). The museum's parts move up to 0.11px (ink +1.8%), the café's up to 0.22px (ink -1.8%); the tree moves 1/4px down, the bar 1/16px.

**What placement can't fix under his constraints:**
- A 1.5px line is 4.5 iPhone pixels: one edge can be whole, never both. At 2x (3 device px) both can.
- A 1.25px post is 2.5 / 3.75 device px: one edge whole at both, the other at neither.
- A stem centred on the badge (the +, the coupe's stem, the trunk) has its edges at centre ± 0.75 (or ± 0.625): neither is whole unless the icon leaves the centre. So the + stays exactly as approved, 8 / 8 soft.
- The bar's parts can't move enough within 1/2px and 2% ink, so only the whole icon moves (1/16px).
- The ring's inner edge at 3x (1.5px in from the badge edge), and every curve, diagonal and tip.

Checks on the placed six: join-check 0 faults on all six; fair-check 0 except café 1 (as in round 1, a marginal KNEE). Open: does the owner see them as the same six? If so, they replace the approved outlines.

---

## Round 3 (10-26, canvas v259, rejected): the grid itself, no fitting pass

Owner, on the fitting pass (comment on the board, verbatim): "no i want the base grid to make great icons without extrawork". This supersedes the fitting pass below (rounds 1 and 2 are kept as history) and the director's turn-174 fixes where they differ.

**The arithmetic.** A position is whole at 2x (his 5K) and at 3x (iPhone) only if it is a whole CSS px: x*2 and x*3 both whole means x is whole. 1/2px lands only at 2x, 1/3px only at 3x. So a grid that is sharp at both with no per-size or per-screen work must have:
- **Every core edge on a whole px**, so the line and every part are a whole number of px. **1.5px cannot satisfy the rule at any size it is drawn at 1:1.** "Weight wise 1.5" can survive only as a proportion: line : badge = 1/16.
- **A 1px lattice**, not 1/3px. Of the coin, halves, quarters and eighths come out whole; thirds and sixths round to the nearest px (the proportion series loses its exact thirds and sixths). Posts can't be 5/6 of the line, so a post equals the line (or 1px).
- **Optical centring in whole px.** A symmetric glyph centres exactly when its centred stem is an even width (2px is); an odd one needs a half-px centre, which fails at 3x.
- **Each glyph shown only at 1:1 (or 2x, 3x).** One drawing can't serve 24, 18 and 23: at 18 its edges would need to be every 4px of the 24 grid, at 23 every 24px. So 18 and 23 go: the selected pin grows its ring, not the glyph. The 12px chip can't reuse a 2px-line drawing (half of it is 1px, but every edge would need to be on even px): it needs its own drawing. 72 (a showcase) becomes a whole multiple.
- **Where no grid can satisfy it:** curves, diagonals and tips (the star, the pediment, the tree's tiers) never land whole. The owner's own words allow it ("subpixels are fine in some cases").

**The options** (src/whole-grid.js; previews: the approved six moved once onto each grid, not yet redrawn; the star keeps its drawn line). Every straight edge is sharp at 2x and 3x in all three (0 soft edges, against 41/40 of 50 today):
- **A: 24px badge, 2px line.** A third heavier than chosen (line : badge 1/12). Counters shrink (the cup's ear closes in the preview); posts drop to 1px. Ink +19% (café) to +29% (+).
- **B: 32px badge, 2px line. Recommended.** The approved proportion exactly (1/16); everything a third bigger. Costs size, not weight: badges 32 in rows and on the map, the selected pin 40 (ring grows, glyph 1:1). The chip at 16px with a 1px line keeps the proportion (its own drawing). Posts become the line.
- **C: 24px badge, 1px line.** A third lighter (1/24); the + loses 38% of its ink.
- Not offered: 1.5px on a 1/2px lattice (sharp on the 5K, soft on iPhone) and 4/3px on a 1/3px lattice (the reverse): each fails one screen.

Checks on the previews (fair / join): B is clean except the museum (12 fair faults, the capital flares, which go to the flare redraw) and the bar (2); A and C carry more because their snaps change widths in place. These are snaps, not redraws: the engine would redraw on the chosen grid.

Board: "Sharp at 2x and 3x" (`simplify/boards/Grid7Sharp.dc.html`, from `src/pixel-fit-board.py`), Start item 6. Images: `stills/wholegrid/raw/`; outlines `svg/wholegrid/`.

---

## Rounds 1 and 2 (superseded): the pixel fit

Owner, verbatim: "additionally, the long play is an iphone app, so we need to resolve the subpixel issue. subpixels are fine in some cases, but in core dimensions and core line landings the fuzziness is tough. and while i am also testing on iphone (even though you say nobody has looked) i am also using a 5k LG display on mac...so im seeing these in high res no matter where i am looking."

Standing decisions kept: the 1.5px monoweight line, optical centring per icon, the proportion system, the six as approved, programmatic only. Nothing in the drawings or the engine changed: the fit is a separate last pass.

Canvas board: "Sharp at 2x and 3x" (Grid concepts page). Code: `src/pixel-fit.js` (the pass), `src/pixel-fit-run.js` (measure + checks), `src/pixel-fit-crops.js` (Chromium crops), `src/pixel-fit-crop.py`, `src/pixel-fit-sheet.py`. Output: `svg/pixelfit/<icon>-<size>@<dpr>x.svg` (fitted, all six at 12, 18, 23, 24, 72 at 2x and 3x), `svg/pixelfit/measure-rank.json`, `stills/pixelfit/` (raw crops, glyph crops, `sheet.png`, `fuzz.json`).

## 1. What lands between device pixels (measured)

Densities: the 5K at its default ("looks like 2560x1440") is 2x; iPhones are 3x. A whole device pixel is 1/2px at 2x and 1/3px at 3x, so the only positions whole at both are whole CSS pixels. The six's paths are copied from the live Now board (the approved 24 row); sizes are the 24 drawing shown at 12, 18, 23, 24 and 72px.

Core edges: every straight upright or level edge (0.4px or longer) and the extremes of every round with a radius of 3/4px or more (the bottom of a bowl, the side of the cup's ear). 50 across the six (the star has none: it is all diagonals and tips).

| at | soft edges (over 1/10 device px off) | near half a pixel (1/3 or more off) |
|---|---|---|
| 24 @2x | 41 of 50 | 13 |
| 24 @3x | 40 of 50 | 9 |
| 12 @2x | 35 | 19 |
| 18 @3x | 41 | 19 |
| 23 @2x | 45 | 27 |
| 72 @2x | 43 | 28 |

Why, in one line each:
- **The line at 3x.** 1.5px is 4.5 device px: if one edge is whole the other is half. Every slab, rim and ring wall has one soft edge on an iPhone.
- **Posts at both.** 1.25px is 2.5 device px at 2x and 3.75 at 3x: never whole.
- **Optical centring.** Each glyph is moved by its own optical offset (Café 7.944, Bar 8.079 ...), which takes the whole 1/3px lattice off the device grid.
- **Solved sizes.** Positions scale until the outline meets its cut (to 1/1000), so interior edges land on arbitrary fractions.
- **Symmetric odd widths.** A 1.5px stem centred on 12 at 2x is 3 device px about a whole pixel: both edges at half.
- **The badge ring.** 1.5px with its outer edge on the badge's edge: the inner edge is half a pixel at 3x.

Worst offenders at 24 (device px off a whole pixel, longest runs first):
1. Museum, the plinth's bottom edge (9.6px long): 0.43 at 3x, 0.38 at 2x.
2. Bar, the foot's flat bottom: 0.49 at 2x; the clear band (3/4px) is 1.5 device px at 2x, so it prints as one grey row instead of a gap.
3. Add, both stems at 2x: 0.48 (a centred 3-device-px stem).
4. Museum, the columns (1.25px): 0.42 to 0.44 at both.
5. Café, the ear's counter, top and bottom: 0.43 at 2x.
6. Nature, the trunk's foot: 0.46 at 2x.

Read from real Chromium pixels (`fuzz.json`: of the pixels a glyph touches, the share that are neither ink nor paper): Café 33% at 2x / 24% at 3x, Bar 43 / 28, Museum 30 / 22, Nature 33 / 25, Star 34 / 23, Add 48 / 31.

## 2. The rule

A final fitting pass, per render size and per density (like an @2x and an @3x asset). In the order the pass runs:

1. **Line and part widths are whole device pixels per density.** Each width is read as its token (to 1/12px) and rounded: 1.5px is 3 device px at 2x and **5 at 3x (1 2/3px)**; a post (1.25px) is 2 at 2x, 4 at 3x. A tie (exactly half over) goes by rank: the line and heavier up, thinner parts down, so a post stays thinner than the line at both densities. Same token, same width, everywhere in the icon, and the badge ring takes the same width as the line.
2. **Every core edge lands on a whole device pixel.** A stem's first edge goes to the nearest pixel and its far edge is first + fitted width. A lone edge (an outside edge, a round's extreme) goes to the nearest pixel.
3. **Optical centring is itself snapped:** the whole glyph moves by under half a device pixel first (the run-weighted mean phase of its edges), so the drawing's own lattice comes back onto the grid.
4. **Symmetric stays symmetric:** a glyph drawn symmetric is fitted on its left half and mirrored. Its centre goes to the nearest whole or half pixel; a stem standing on the centre decides which (an odd device width needs a half-pixel centre).
5. **A step never closes:** a short step that would snap to nothing (a capital past its column, at a size where the step is under a device pixel) keeps one device pixel.
6. **Everything else stays subpixel and is carried:** curves, diagonals, the star's points, the tips, the rounds at corners. Per contour, each point moves by straight interpolation between the fitted edges on its own contour (TrueType's IUP), so a curve is stretched with its edges and never bent. Handles move with their node, and any node that ran on smooth runs on smooth again.

Which edges are core: straight uprights and levels (outer edges, posts, slabs, rims, a counter's sides) and big rounds' extremes. Which may stay subpixel: curves between those extremes, diagonals, tips, and corner rounds.

## 3. Before and after (built and measured)

All six at 24 (and 12, 18, 23, 72) at 2x and 3x. Soft core edges at 24: **0 of 50 at both densities** after the fit (from 41 and 40). From Chromium pixels, the grey share before → after (2x / 3x): Café 33→14 / 24→11, Bar 43→17 / 28→13, Museum 30→10 / 22→5, Add 48→2 / 31→3, Nature 33→27 / 25→23 (its tiers are diagonals, left soft by the rule), Star unchanged (no core edges). The bar's clear band reads as a gap again at 2x. Phone-readable sheet: `stills/pixelfit/sheet.png`.

What it costs, measured at 24:
- **The line weighs differently by density:** 1.5px at 2x, 1 2/3px at 3x (+11%). Ink area changes -7.5% to +7.3%.
- **Optical centring moves** (the ink centroid) by at most 0.35px at 2x (the +: centred on a half pixel, 1/4px across and 1/4px down) and 0.28px at 3x (Café).
- **Proportions drift by up to one device pixel:** the museum's capital step is 1 1/4 device px at 3x and becomes 1; the coupe's 3/4px band becomes 1/2px at 2x and 2/3px at 3x; a post at 2x is 1px (2/3 of the line, where the system says 5/6).
- **No point moves more than 1.2 device px** (0.4px at 3x, 0.6px at 2x).

### Checks on the fitted outlines (at 24)

- **join-check (the kink check): 0 faults** on all 12 (six icons x two densities).
- **fair-check:** Bar, Star, Add clean at both; Café 1 at 2x (a KNEE 2.08 against a limit of 2); Nature 2 at 2x (JUMP 0.36 against 0.35); Museum 4 at 2x and 6 at 3x, all at the capitals' flares: the flare's step can't keep its exact angle when the step becomes a whole number of device pixels, and its rounds were drawn for that angle. At 72 @3x everything is clean.
- **jitter (the fit itself; the input nudged up to 0.02px, 30 times):** the fitted shape is the same in every rebuild for 4 of 6 icons at both densities. Café at 2x (6 of 30) and Bar at 3x (4 of 30) flip where an interior edge sits within a twelfth of a device pixel of a half: both results are equally sharp, they differ in which pixel. For a frozen drawing the fit is deterministic (the assets are generated once from the approved outline).

## 4. What is still open

- **The 3x line: 5 device px (1 2/3px, chosen) or 4 (1 1/3px).** 4.5 has no sharp answer. 5 keeps posts visibly thinner (4) and suits a mark that already reads light; 4 matches the 2x weight's darkness more closely at small sizes. `fit(d, { tie: 'down' })` builds the other.
- **The museum's capitals.** Make the step a lattice length (1/3 or 2/3px) in the drawing and its rounds survive the fit at every size. Not done: the drawings are approved.
- **12px (the filter chip).** At 2x the line is 1.5 device px and goes to 2 (+33% darkness). A per-size line, or a separate drawing at 12, would serve it better than any fit.
- **Shipping:** iOS asset catalogs take @2x and @3x files, so the fitted outlines ship natively. On the web, inline SVG would pick the fit for the screen with a resolution media query; not built.

Not done on purpose: no change to the drawings, the engine, the canvas's other boards, or `index.html`.
