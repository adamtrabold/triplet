# Visual designer notes: icon system

## Update (2026-10-23, canvas v231, turn 142; eighth icon designer)

- **Owner on v230:** "These are looking great. I want to see a diagram now that overlays the shapes used to make these shapes on top of them, a construction diagram".
- **Done:** a new "Construction" board, `Grid7Construction.dc.html` (1700 × 6869, Grid page, x 1680 y 8105, right of Master). No drawing changes.
  - Per icon: a Shapes sheet (grid, cut, roots, counters, mirror, optical centre; lettered notes) and a Corners sheet (each round coloured by kind, with its crest circle and edge points; numbered notes). Then true sizes, the 8-step build order and five findings.
- **Proof:**
  - `src/construction.js` rebuilds R2B (values copied from boards7, so it runs in about 9 min, not 45). It writes `svg/g7/construction.json` and compares each glyph with `svg/g7/between/{cafe-r2,bar-r2b,museum-r2,nature-r2,star-r2,plus-r2}.svg`: 6/6 identical.
  - Engine hook `opts.join.cornerLog` (logging only; cs entries also carry `hole`, `end`, `flared`, `crest`, `kM`).
  - If boards7's R2B values change, update construction.js's copy, then re-run it and `construction-board.js <outdir>`.
- **Findings** (open, for the director and owner):
  1. Each round has 2-4 cubics (curve count vs "minimal bezier curves").
  2. Four counter methods.
  3. Drawn curves that are only aims (museum capital S, the cup's loop arc ease, tree and star tip landing: 0.4-1.0 / 0.25px).
  4. The mirror hides a 0.0004px seam in the museum's right half (picks7 rounding).
  5. Slabs are 1.5, not 4/3, in this row.
- **Board tooling** (scratchpad `d8/`): `shot.js` (full page or a clip at any scale), `mkpub.py` (adds the board to canvas.json with an overlap check), patch scripts `p*.py`. Marker placements are hand-set in `CORNER_AT` and `SH` in construction-board.js.
- **Open:**
  - Is two sheets per icon right for him?
  - Should one counter method become the rule?

## Update (2026-10-23, canvas v229, turn 139; seventh icon designer)

- **Owner on v228:** "almost perfect"; "an awkward hump on the bowl and foot on either side as a result of the round shape ... one more try"; "the problem with the star weight is the counter size now. I think the stroke is inner stroke ... find the right balance there for the outline icons."
- **The hump, named: a shelf.** The bowl and the foot meet the stem almost level (their bend 0.08-0.16, the corner turns ~80°). The hill round was even (each half ~0.72 units, crest on the bisector), so the bowl ran on level right up to the round and the round sat on it as a knuckle. fair-check measured how the bend changes (smooth), never where it sits.
- **Engine rule: the leaned flare** (engine.js `opts.join.flareLean`; boards7 `JOIN10 = { ...JOIN9, flareLean: 1.75, flareLog: [] }` on R2/R2B):
  - Type: a non-eased concave round between a straight line and a gentle curve bending the other way (|k| > 0.03 and under a quarter of the round's crest). In the set: the coupe's 4 flares and the cup's corner under its handle. The museum capitals (S-spans) and everything else are untouched (museum and tree byte-identical by the engine path; logs show no flare there).
  - The round's run on the curve = 1.75 x its run on the line; both scaled (secant) until its crest = the law's own radius (1/r; coupe 2.00, was 2.32). New hillRound mode `hillKeep: 'flare'`: both runs given, the crest point M free in 2D, reached from the plain hill by a 12-step continuation (`J.flareFrom`; the plain solve now returns `phi`).
  - Why 1.75: the two-half raised-cosine hill can lean to about 2.1:1 before the line-side half collapses; at 2 it was a 0.02-unit step on the stem (seen in L1). 1.5 left a faint shelf on the foot.
  - Tried and dropped: longer runs with depth free (the 'fit' path, F=2: a stout trumpet, stem looks thicker); equal ink (the knuckle stays: removing the shelf needs a little more ink along the curve); flareLine < 1 with a sideways-only crest (no solution).
- **Check:** fair-check **SHELF** (a crest between a line and a gentle opposite-bending curve; the run onto the curve must be >= 1.5 x the run onto the line, walking to where the bend crosses zero / meets the line). v228: 4 on the coupe + 1 on the cup; now 0. Also fixed INFLECT: its walk now stops 4 half-widths from the crest (it had walked from the rim's round down the whole bowl into the flare). It still fails v226's tree (7).
- **Outline rule** (boards7 `starOutline`, `starHoleRc`, `OUTLINE_HOLE = 2.5`, row tuple `outline: true`; mark-weight.js `starOutlineD`, `--outline` writes `outline-weight.json`):
  - His read was right: starAt fitted the star by its outside (points to the +'s arms, director turn 82) with the line marks' 1 2/3px, so the weight came out of the counter (3.1px across inscribed; starRc's class rule of 4px was never used by the row).
  - Rule: an outline mark is drawn like the solids: the set's 1 1/2px line centred on the drawn shape, sized by its counter, 2 1/2 lines across at the centre (valley to valley). The outside follows: star 13.2 -> 14.1px across (+ arms 13.2); counter 3.1 -> 4.0px across, +60% open area. Darkness (blur p80): star 53 -> 47, + 39.
  - Replaces the A/B/C darkness options (kept in mark-weight.json for the record). The + (open mark) is unchanged at 1 2/3.
  - Seen at 1x/3x/72: 2 lines (old) still cramped; 2 2/3 (g7s's 4px) makes the star 14.6px, visibly big; 2 1/2 chosen by eye. "Same size, thinner line" (1.44px) was close at 1x but makes the line differ per outline icon; rejected for one line across outline marks.
- **Board:** Between section 0 rewritten as "0 · The hump at the coupe's flares, and the star's counter" (+ "0b · Outline icons"). v228's board archived as `Archive-G7au-Between` (x 8400, y 148000). v228 svgs frozen in `svg/g7/before-g7au/`.
- **Turn 141 (v230):** 0b states the two-class line rule (outlines 1 1/2, open marks 1 2/3); "+ might feel light" is an open question; the lean is stated as tried on the coupe and cup only.
- **Open:**
  - Does the hump read gone at his zoom? The stem side of each flare is now short and firm.
  - flareLean 1.75 is set by eye on the coupe, checked on the cup only.
  - Is the star too big at 14.1px, and does it balance the + (39 vs 47 by blur; by eye it no longer reads heavier at 1x)?
  - Older open questions untouched (glass/plate, liquid style, tipSoft as geometry in code).
- **Tooling** (scratchpad `d7/`): `j9.sh` (one glyph by v.js with JOIN9 + extra json; env S=<scale> skips the size fit, ~20 s), `batch.sh`, `all.sh`, `star.js` (star variants: span, counter, darkness), `srow.js` (row + 72px sheet per star), `zr.js`, `prof.js`, `p*.py` patches. boards7 takes about 45 min (the flare continuation adds ~10).

## Update (2026-10-23, canvas v227, turn 136)

- **Director on v226 (turn 135), score 7.** One fault: the top tip pinched into a bulb on a neck. The cause was v223's peak bend and its depth held together, sitting on swept-in flanks (-0.10, about 30° of turn).
- **Done, as engine rules** (JOIN9 + mark-weight):
  - `noReverse`: in hillRound, `edgeAt` treats an edge that bends against a convex round as having no bend, so the round rises from 0 and the S sits at the joint.
  - `tipSoft 6`: a tip's kept crest is min(peak, peak²/6). Only the tree's top changes (4.4 → 3.2); the side tips and the star keep their points.
  - `tipPow 1`.
  - Tried and dropped:
    - tipSoft 8.8: the top became v225's dome.
    - depth-kept tips: knobs.
    - tipShare 0.5: the bottom tips became knobs.
- **fair-check:** a new **INFLECT** check. A sign change inside a curve of a round that turns toward the ink; ink side = the sign of the largest path's area. It fails all 7 of v226's tips and passes v223 and every other glyph.
- **Results:**
  - Shown row: 0 faults.
  - Tree: 6.98 × 11.46.
  - Weights unchanged: A 1.67 / 1.20, B 1.82 / 1.32, C 2.06 / 1.45.
- **Board:**
  - The tips are shown as rows (v223, v225, now, now with the comb), each with the tree at 12/24/72 and the top, side and bottom tips at about his zoom.
  - The band-end HUMP note is on the board.
  - v226 is archived as `Archive-G7at-Between` (x 7560, y 148000); its svgs are frozen in `svg/g7/before-g7at/`.
- **Turn 141 (v230):** 0b states the two-class line rule (outlines 1 1/2, open marks 1 2/3); "+ might feel light" is an open question; the lean is stated as tried on the coupe and cup only.
- **Open:**
  - tipSoft is calibrated on one tree.
  - The top is blunter than v223's bell.

## Update (2026-10-22, canvas v226, turn 134; sixth icon designer)

- **Director on v225 (turn 133), score 7:**
  - the tree's tips became knobs;
  - the bowl crops showed the foot;
  - the coupe looked the same before and after at his zoom;
  - the handle still had 4 faults;
  - the curve count;
  - the weight options.
- **Done, as engine rules.** boards7 `JOIN9 = { ...JOIN8, tipKeep: 'crest', tipLand: true, tipPow: 2, maxPieces: 2, arcEase: true, arcRamp: 0.3, arcLog: [] }`; mark-weight.js uses the same values.
  - **Tips** (an eased corner under `tipAngle` 75°):
    - They keep the eased tip's true peak bend.
    - Their hill rises as the square of the raised cosine.
    - `tipLand` re-aims the tip's two edges (a similarity about each edge's far end) so the short hill's apex lands on v223's apex. This is done in a pre-pass at the top of `corners()`: it probes on a clone, keeps each tip's target and crest from the drawing as drawn, and runs 3 passes.
    - Why: v223's tips crest at 19 / 11 / 7; the 'depth' hill gave 6.6 / 4.1 / 2.6, which read as knobs.
  - **arcEase** (`arcEase()` in engine.js): at a smooth node with a curvature jump onto a true arc, the bend ramps up over 3/10 of the half, holds a slightly tighter arc, and lands on the arc's middle. Newton 3x3, within the edge's room. The shift is at most 0.05 units.
  - **maxPieces 2**: the 3-6 piece loop is skipped. A relaxed two-piece fit is accepted up to `hillTol2` 0.02, with more restarts. The two-piece cost now includes how well the pieces follow the hill's curvature (`kv`, at 3% of the span), which removes the v225 star-valley stalls.
  - **hillRound fixes**: the turn residual is read unwrapped (no looped halves), and a kept crest seeds the hill's length.
- **fair-check**: a new **SHOULDER** check (a stall in the rate of bend inside a round's half, found by its own walk).
- **Results:**
  - Shown row (R2B): 0 faults (v223 178, v225 22).
  - Other row (R2): 2 TAILs (the domed foot).
  - join-check: 2 HUMPs at the band ends.
  - Curves: 189 → 396.
  - Tree: 6.96 × 11.46 → 6.98 × 11.46.
- **Bug fixed:** boards7 `shiftD` now writes 5 decimals; at 4 it put a knee in the star.
- **Board (Between, section 0, rewritten):**
  - his quote and the answer;
  - three joins, each with his crop, v223, now, a comb of the bend drawn on the outline (v223 beside now), the plot and "how large";
  - the rules table (5 rules) and the proof;
  - the rows;
  - the tree tips trio (v223 / v225 knobs / now) at 72px and 8x;
  - the handle;
  - the weight options at 1x and 72px. A keeps the +; the weight is solved at true size.
  - The v225 board is archived as `Archive-G7as-Between` (x 6720, y 148000). The v225 svgs are in `svg/g7/before-g7as/`.
- **Weight** (mark-weight.json, targets 39 / 43 / 47):
  - A: + 1.67, star 1.20.
  - B: + 1.82, star 1.32.
  - C: + 2.06, star 1.45; the + only reaches 46.
  - At 1x the star differences are small.
- **Turn 141 (v230):** 0b states the two-class line rule (outlines 1 1/2, open marks 1 2/3); "+ might feel light" is an open question; the lean is stated as tried on the coupe and cup only.
- **Open:**
  - Do the slimmer tip ends still read as his "perfect" tree?
  - The band-end HUMPs (old check).
  - Wider weight spacing if he can't see A/B/C at 1x.
  - His older open questions are untouched (Joins, Wide → Square, glass/plate, the liquid).
- **Tooling** (scratchpad `d6/`):
  - `v.js` (R2B glyph), `gen.sh` (with an EXTRA join json), `st.js` (star and + via mark-weight), `sr.js` (the star exactly as starAt builds it);
  - `zr.js` (crops relative to the box; comb; RATE=1 for a dk/ds comb), `crests.js` (every crest with its k and half-width), `kplot.js`, `sizes.js` (12/24/72 rows), `shot.js` (board screenshots).
  - Patch scripts `p*.py` (the sandbox refuses heredoc python, so patches go in files).
  - boards7 takes about 35 min.

## Update (2026-10-22, canvas v225, turn 132; fifth icon designer)

- **Owner on v223:**
  - "can you see the wobbliness ... further away from the point itself ... on the line coming out of it ... perfect on every icon ever created" (marks: `owner-marks/v223-tree-tip-wobble.png`, `v223-coupe-stem-foot-wobble.png`).
  - Then: "plus *might* feel a bit light ... the star feels heavy" (`v223-row-line-marks.png`).
- **Diagnosis:** G2 without G3.
  - Coupe flares: a linear curvature ramp and a V crest give knees where the line leaves the round.
  - Tree tip: one eased cubic. Its curvature creeps up over 2/3 of the flank, then spikes: a shoulder, then a nose.
  - join-check couldn't see either (it reads curvature, not its rate).
- **Done, as engine rules** (engine.js `opts.join.fair`; boards7 `JOIN8 = { ...JOIN7, fair: true, hillKeep: 'depth' }` on R2/R2B):
  - **Rounds.** `hillRound`: per half, a raised-cosine curvature spiral from the edge's own curvature to a crest, through the g7aq round's deepest point. Solved by 6x6 Newton. Fallbacks: 'fit', then 'law'.
  - **Room.** Two passes share each edge's room (no slivers).
  - **S-span.** A corner into a short opposite bend becomes one S (the museum capital).
  - **Fewest cubics.** `pieces`: one cubic, else two (Nelder-Mead with a dip penalty), else 3-6 on the hill. Accepted against the fair check's knee limit; signed monotone.
  - **Precision.** Output at 5 decimals in fair mode. symD takes a `dec` argument and rebuilds a seam crossing whose handles were dropped.
- **New check** `src/fair-check.js` (KNEE / TAIL / DIP / JUMP, with a rounding tolerance):
  - v223 row: 172 faults (it fails all three marks).
  - After, shown row: 4 (the cup's handle).
  - After, other row: 6 (+2 tails at the domed coupe foot's ends).
- **Tried and dropped:**
  - 'law' (the crest at the law radius): the tree's tips came out longer and spikier, +5.6% wide.
  - A ramp or smooth piece across drawn tangent joins: a circle can't be eased into a line without moving it (clothoid shift). Removed from the code.
- **Effects:**
  - Sizes kept (tree 6.96 -> 7.03 wide, same height); the tree's noses a touch rounder.
  - Curves in the row: 189 -> 393.
  - Svgs: before frozen in `svg/g7/before-g7ar/`.
- **Speed:** boards7 takes about 40 min now.
  - The class and the first 4 size passes use the g7aq rounds (`fast`).
  - starAt bisects on g7aq rounds, then takes 3 secant steps on the hill rounds.
  - R2/R2B skip `coupes` and `bar1` (unused).
- **Weight:** `src/mark-weight.js` gives blurred p80 darkness: star 53, + 39, a 1.5px line 37.
  - Rule proposed: line marks solved to one darkness T.
  - Board options: A 39 (+1.67 / star 1.19), B 42.5 (1.81 / 1.29), C 46 (2.06 / 1.41).
  - Not applied: waiting on his pick.
- **Board:** section "0 · The wobble on the line leaving a join" on Between (8558 tall); v224 archived as `Archive-G7ar-Between` (x 5880, y 148000); Master at y 9158. `sectionJoins` is kept in boards7 but unused.
- **Turn 141 (v230):** 0b states the two-class line rule (outlines 1 1/2, open marks 1 2/3); "+ might feel light" is an open question; the lean is stated as tried on the coupe and cup only.
- **Open:**
  - Does the tree still read as "perfect"?
  - Curve count vs "minimal bezier curves".
  - The cup's handle needs a drawing rule (a drawn bend meeting a line starts from no bend).
  - The domed coupe foot's end tails (other row).
  - The knee threshold is calibrated only on his marks.
  - His open questions from before are untouched (Joins, Wide -> Square, "glass ... plate", the liquid).
- **Tooling** (scratchpad `d5/`): `v.js` (R2B glyph; JOIN env), `gen.sh`, `zoom.js` (crops + curvature comb), `kplot.js` (curvature vs length), `prof.js`, `apex.sh`, `weigh.js`, `marks.js` (option rows at 1x/3x), `symtest.js`, `raw.js`, `mkpub.py`.

## Update (2026-10-22, canvas v223, turn 129; fourth icon designer)

- **Owner on v222:** optical vertical centring per icon, always; one join pattern for sharp corners (the tree's tiers looked like different approaches); no humps or wobbles at joins ("architectural and smooth ... impeccably constructed at every join"). Plus the coupe band: "the counter edge looks less curved than the exterior edge" (7th+ time; see owner.md v130-v147).
- **His marks** (`grid/owner-marks/v222-*`): tree-joins = tree left side; wobble-a = coupe foot end → foot top → stem; wobble-b = stem flare into the bowl's underside (same join as the museum capital); wobble-c = coupe rim corner into the side; coupe-band-edge = the band's left end.
- **Done, as engine rules** (engine.js `corners()` with `opts.join`; boards7 `JOIN7 = { ease: 2.3, trim: 1.4, ends2: 1.5 }`, `opticalY`, `shiftD`; HSETS tuple 8th element `{ join, optical }`, set on R2 and R2B only):
  - Ease by KIND (convex, not a counter, not a line end), not by edge length (the old `min(lin,lout) >= 3` split the tree).
  - Eased corners: handles solved for G2 (`g2Handles`), else handles to the tangents' crossing (curvature 0 at the ends).
  - Other corners: `joinRound` = two mirrored cubics through the law arc's deepest point, curvature rising monotonically to the bisector; trim 1.4x the arc's. If unsolvable: slide the ends along the curved edge (up to 3x), then a single even cubic, then an S through the chord's middle (`ss`, the museum capital).
  - Counter ends that are themselves curves (the band) merge into one curve (`ends2`); slot ends (straight) are untouched.
  - Output at 4 decimals in join mode (short handles lost their curvature at 3).
  - Optical centring: box centre pulled down by half of (box cy − ink cy) when positive; no lattice snap; the star and + too.
- **New check:** `src/join-check.js` (JUMP / HUMP / WOBBLE on the finished outline). Row before 37 faults, after 0. It doesn't flag curvature spikes at deliberate tips; I added a cusp guard in `g2Handles` (speed under a fifth of the chord) instead.
- **Board:** section 0 on the Between board; v222 board archived as `Archive-G7aq-Between` (x 5040, y 156200); Between 7592 tall after turn 131 (v224: director 9 after three copy edits, made: tree tips cost, centring measured against v222, band end by eye); Master moved to y 7992. Before svgs frozen in `svg/g7/before-g7aq/`.
- **Open / unsure:** the tree's upper tips are now eased like the bottom one (sharper, thinner): is that "one pattern" to him or a change to his "perfect" tree? The band's ends now curve (a true offset over 0.8px is straight; he never saw it as parallel). Star 0.37px lower. The rest of the HSETS rows still use the old engine (history). His open questions (Joins, Wide → Square, "glass … plate") untouched.
- **Tooling** (scratchpad `d4/`): `v.js` (one glyph by R2B; env JOIN, OPT, NOSYM, CORN), `big.js` (render at size; VB, RING), `prof.js` (curvature per segment in a box), `cen.js` (vertical centres), `nudge.js` (offset sheet), `shot.js` (board section screenshots), `mkpub.py`.

## Update (2026-10-21, canvas v221, turn 126)

- **Director, v220 (turn 125), scored 7:** keep A · Joins; cut B (it reads as a trapezoid or a furniture foot) and C (it reads as a pagoda, and it breaks Straight-lined buildings). His third fault was that the gable's ends were slivers (0.43).
- **Done:**
  - **The gable:** ends 1.2 units (1.02px). The room comes from the class: the temple is as tall as it is wide, so it is fitted to the SQUARE class (boards7 `STRUCT`, `STRUCT_CLS`, the fitPlace `cls` override). The columns keep their 2.8px.
  - **The row's museum** = the base plus Joins (`JOINS`).
  - **The rules table** has a Joins row.
  - **The section** shows the base and A only, with one question. B and C are in Archive-G7an-Between (the v220 board).
- **Turn 141 (v230):** 0b states the two-class line rule (outlines 1 1/2, open marks 1 2/3); "+ might feel light" is an open question; the lean is stated as tried on the coupe and cup only.
- **Open:**
  - The museum is about 3 blur points over the cup (31.7 against 28.4) because of the solid gable. "Sized by its weight" (his v207 pick) would level it; it is flagged on the board, not applied.
  - The plate question and the liquid style are unchanged.
- **B/C code** stays in picks7 `structMuseum` (batter/sweep, eave) for history; no row uses it.

## Update (2026-10-21, canvas v220, turn 124; third icon designer)

- **His question:** "it's the flaring effects that the museum and other structures like it aren't going to naturally make. How might we build some of that in?" "Connected" = to the systemic approach. He likes the separated gable (keep it).
- **Base museum now (row R2/R2B):** picks7 `structMuseum` (`o.struct`, boards7 `STRUCT = { gb: 4, ap: 1.333 }`): gable rests on the beam across the 1px cut; beam + 1 1/4 columns + plinth one piece; columns full height. Fixes turn 123 (comb, lost beam). Resting parts rule now has the limits written in.
- **Three approaches, each a rule at one place** (boards7 `MUSEUM_F`, R2.mus2[0..2]; [3] = v219 for the before):
  - A Joins: outer posts flare 1/2px into beam and base, outside only; beam/base ends 1px (`cap`, `foot`).
  - B Outline: outer posts' outsides sweep out 0.6px to the base (`batter`, `sweep`, `plOver 0.9`).
  - C Ends: roof overhangs the beam 0.9 unit, underside falls 0.4px to a 1px end (`eave`).
- **Weights:** all at the cup's (28.2-29.3 vs 28.4). Sizing by weight no longer needed; removed from the board.
- **Open, his call:** which (if any) of A/B/C; they combine (A+C, B+C). The "glass … plate" question and the liquid style are untouched.
- **Honest gaps:** at 12px the A/B/C differences are under a pixel and the cut greys out. Openings are 1.25-1.50 (columns 1 1/4). C's ends and B's sweep are new curve types on a building; check the director's tent/pagoda and trapezoid objections by eye.
- **Tooling:** `scratchpad/d3/v.js` (fit one glyph with the R2 row; `CLS=` env overrides the class), `view.js` (row + chip/24/72/8x PNG), `shot.js` (screenshot the museum section), `mkpub.py` (canvas publish folder).

## Update (2026-10-21, canvas v219, turn 122)

- **Score:** the director gave v218 an 8 (turn 121): the museum barely changed at true size. Fixed with the **Resting parts** rule. A load set on separate supports gets the 1px cut (cup on saucer, roof on columns); one-piece things join and flare. The museum now has a cut under its roof. Blur 27.9 against the cup's 28.4.
- **One museum section:** before, by these rules, and the "sized by its weight" option (his pick). Old part 2 now lives only in the archived v217 board.
- **Rule renamed:** "Built lines" → "Straight-lined buildings", which excludes plates and vessels.
- **Open:** his plate reading; whether the weight option is still needed; the liquid style.

## Update (2026-10-21, canvas v218, turn 120)

- **Score:** the director gave v217 a 7 (turn 119). The coupe, the drink and the tree passed. Fixed in one batch:
  - **"Glass … plate":** both readings are now in the row (R2 and R2B, coupe foot `dome: 0.5`), with the question to him.
  - **Museum:** the openings are square, by a new "Openings" rule (tight; flares never reach inside). The flared version is an option under his 10-19 pill quote.
  - **Pediment:** a new "Built lines" rule (built = ruled; sweep and droop are for living things). The swept roof is an option.
- **Board:** parts 1 and 2 and the tuned table were moved to the Archive as `Archive-G7ak-Between` (the whole v217 board). The live board is 5154 tall; row 2 is at 7000 and Master at 7300.
- **Open, his calls:** which plate he meant; museum sizing by weight; the liquid style (bar vs open). The museum is still 2 blur points over the cup.
- **Lesson:** don't tell him what he sees ("not pills"). Show the option beside his quote.

## Update (2026-10-21, canvas v217, turn 118; second icon designer)

- **Fixed points (owner):** "Coupe, after" and "Tree, after" in the tuned row are "perfect". The task is rules that make the rest belong. He named two failures: the plate ("the glass being on something so rounded as a plate feels off") and the museum ("completely disconnected"). He also wanted "slightly more drink".
- **Built:** row `Rules from the coupe and tree` (boards7 HSETS, handle `R2`) and section 2b on the Between board.
  - Five rules: plates drop 1/2px under, ends 1px (`o.plate`, cup only); every post that holds a mass up is 1 1/4, columns too (`o.colW`); flares 1/2 inside slots too (`capital` 0.5, `plainOuter`); gables sweep like tiers (`roofBow` -0.3); clear band 5/6.
  - Svgs: `svg/g7/between/*-r2.svg`.
- **Reading I chose:** plate = the cup's saucer. Stated on the board. If he meant the coupe's foot, the plate rule would need to reach the foot, and the coupe was declared perfect, so ask.
- **Costs shown:** the museum's slot corners soften (an earlier "no pills" example). The museum is still 1 blur point over the cup (it was 4). Monoweight's exception now covers the columns too.
- **Open, his calls:** museum sizing by weight; open glass vs bar (the coupe keeps the bar); whether the long Between board's older parts (1, 2, the tuned table) can go to the Archive. I asked the orchestrator rather than moving them.
- **Tooling:** `scratchpad/d2/v.js` fits one glyph with the tuned row's law and opts (quick variants). `view.py` renders a true-size + 8x sheet. `sec.js` screenshots one board section.

## Update (2026-10-21, canvas v215, turn 115)

- **Score:** the director gave v214 a 7 (turn 114). All five fixes are made as rules (jam turn 115).
  - **VESSEL_SIDE** (picks7) is now a shared rule.
  - **Plates and feet** is a rule in the table: sits-on is flat on top; rises-into-a-stem domes up; ground is flat.
  - **Line ends** are stated as a fifth of the width, 0.3 at most.
  - **The board says plainly** that the row is Between with H3's plates and foot.
  - **One rules table:** rule, H3, Between, this row, with a "Here:" line under each rule.
- **New check:** `src/curve-even.js`. Its numbers mirror picks7, so keep them in step.
- **Open question:** the domes run flat across the middle (2%, 5%). I flagged that, not fixed it. The coupe's rim corner still enters the side vertically, in Between too. If he still calls the sides straight, the eased rim corner, not the handles, is the next suspect.
- **Canvas layout:** the Between board is 7195 tall, and row 2 now starts at 7620.

## Where things stand (2026-10-21, grid round g7, canvas v214)

- **Where the work lives:**
  - Canvas: https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW, page "Grid concepts".
  - Code: `grid/src/`. `picks7.js` holds the drawings, `laws7.js` the corner laws (HUMAN included), `boards7.js` the boards.
  - Run: `TOOLS=<dir with paper@0.12.18 and clipper-lib> node src/boards7.js [out]`.
  - Checks: `check-svg.py`, `between-checks.js`, `blur-between.js`.
- **The stage** (owner): "building the underlying system for icon creation and using the first 6 icons as a test of those decisions". Every change is a rule value, never a one-off.
- **The tuned row** (Between board, "H3, saucer flipped, rules tuned to the tree"):
  - Turn 112 built it (v213). Turn 113 added the answer to "what does including the new tree do for the strategy" (v214).
  - The loved tree is H3's sweep and droop, plus HUMAN flare 0.5, plus tipShare 0.0877, plus `post: 1.25` (its trunk, via COUPE_S into `nature()`).
  - In this row those become row rules (flares 1/2, free posts 1 1/4, tips by their edge), and the tree comes out byte-identical.
  - They reach only the coupe (stem 1.25, flares 0.5) and the tree. The cup, museum, + and star are unchanged.
- **Open owner questions (not mine to resolve):**
  - H2, Between, H3 or tuned;
  - the liquid: open glass or clear glass;
  - the plate: rising or flipped;
  - the museum: sizing and architecture;
  - the line marks.
- **Honest gaps:**
  - None of the tree's rules acts on the museum. "looks completely out of place" is answered only by the museum approaches (sized by weight, cast soft).
  - Free posts at 1 1/4 are monoweight's one exception.
- **Lessons:**
  - A question is a question. Quote him; don't harden opinions into rules.
  - Fetch the branch and re-read the live canvas before building. Turn 113 first duplicated turn 112, which a parallel session had landed after the brief was written.

---

## Where things stand (2026-10-14): concept work stopped

Owner: "What the fuck is all of this stuff on the canvas all I want is every
icon side by side". The canvas (v16) now holds ONE board, Main.dc.html
"Every icon in the app today (74)": the 74 inventory renders
(inventory-png, from index.html, no new drawings) in one wrapping grid, all
at 4x real size, each with only its inventory name underneath. Every other
board (inventory groups, grammar, B, C, D, considered) was removed from the
canvas. Their files stay in the repo (concepts/, inventory-png/) and in the
canvas version history (v15 and earlier). Board 1440 x 4110; at phone width
the icons show at about real size and the names need a zoom.

---


## Where things stand (2026-10-13, final labels, canvas v14)

Director round 3: grammar 9, C 9, B 8 (value-only difference; its ceiling).
Canvas relabelled: grammar + C rows "for review"; B rows "considered ·
director 8 (value-only difference)"; D and the dropped board "considered".
Labels are changed both on the boards and inside the stills (the sheet
sources now print FOR REVIEW / CONSIDERED; re-rendered and re-uploaded).
`concepts/considered-{3x,1x}.png` replaces dropped-*: B first (b lastDay
beside C lastDay, "Fades visited places. The difference is value only,
which your 'colour alone is not enough' rule may reject."), then A and D as
before. PIL composites (gx-line18, gx-axis-overlay, c-q3, considered) are
rebuilt by scratchpad/composites.py (not committed).

---


## Where things stand (2026-10-13, B round 2)

Director round 2: C = 9 (don't relabel; the send waits for B), B = 7.
B fixes done: reprintB() is now a straight sRGB paper mix down to L* 50
(no chroma boost; chroma can only fall, and the warm paper keeps warm inks
dusty: restaurant #A2666E dusty wine, not pink; street and cafe dusty
browns). Visited vs 40% is dE 16-29 everywhere, so no full-ink rim or extra
offset was needed (the 0.8px misregistration stays). Open -> visited is
10-34 L*; shopping and district (40 -> 50) are the smallest steps. Re-shot:
gate, near day0/halfway/lastDay + squints, mid, far, list, tag,
storyboards. Canvas v13 (B boards repointed; layout unchanged). B's
last-day map at 1x is quieter than today and no pin changes colour family.

---


## Where things stand (2026-10-13, after steer 2 + the B ruling)

Round 1 scores: grammar 9, C 8, B 5 (then revived by the director with
three darker inks), D 4 (evidence only). Canvas version 12; all boards still
"DRAFT · NOT REVIEWED" (relabel "for review" only after the director
confirms 9).

C fixes done (`concepts/c/c-set.html` -> `c/set/`):
1. Far halfway frames (today / C ink / C orange) with the 8px silhouette;
   the dot frame is gone from the set and the send.
2. Peel redrawn as a gummed reinforcement ring (`ringPeel()` in
   c-set.html): the flap = an annulus segment reflected across its chord,
   cream gummed underside, soft shadow; stages rest / lifts / folds back /
   off-and-falling / done. `c-peel-*` + `c-sb-row-*` re-shot.
3. C rows = the lighter struck "✓ VISITED" word (solid #4E5D6C, rule
   #9AA3AC, slight seeded tilt; no alpha, so never the 40% look);
   `c-list-C-struck` is C, `c-list-C-stamp` the Q2 alternative. Near/mid/far
   phones use the struck word too. Note: the word replacing the stamp
   touches the row stamp markup -> gesture gate (said on the board).
4. Row visited glyph nudged up 0.8px (lib row()).
5. Q3 crop `c-q3-*` (visited star 9px vs 7px, lastDay).
6. `concepts/dropped-*`: A and D with one reason each (B removed: it's back).

B (director's ruling: second concept, darker inks shown as its cost):
- INKB: shopping #665783, district #146a60, attraction #436215 (hue
  kept; 5.4 / 5.4 / 5.9 : 1 on paper). Attraction moss #547326 is named in
  CLAUDE.md as a brand colour, so B changes a named colour (flagged).
- reprintB(): L* 54, chroma x1.35 (min 22), 'other' stays grey. The fix for
  "near the 40% look": the 40% wash loses chroma, the reprint keeps it.
- Gate re-run passes: visited vs 40% dE 18-45, vs chip-off 20-53; one
  exception, 'other' vs chip-off dE 8 (both grey; they differ by form and
  place). Open -> visited is now >= 14 L* everywhere.
- On navy: badges are reversed to paper, so no ink sits on navy (all inks,
  today's included, are 1.0-2.3:1 on navy).
- Full frame set in `concepts/b/b-set.html` -> `b/set/`: gate, cost strip,
  near x3 + squints, mid orange/ink, far halfway/lastDay, list (stamp kept
  = B's row; struck = Q2), tag x2, storyboards (pull from the tag, row,
  un-visit reverse pull beside the dry-up on the dryClock timings).
- Watch: boosted-chroma reprints (pink restaurant, teal district) are the
  loudest visited marks on lastDay. Still below open pins, but they're what
  the director will look at.

## Next

Director re-scores C (and scores B). After a 9: relabel C + grammar rows
"for review". Open for me: grammar sheet 3 folding in steer 1 (approx 3
segments, C labels), if wanted.

---


## Where things stand (2026-10-13, after concept steer 1)

Director steer 1 (jam.md "Concept steer 1"): C-prime became "C" (rim off,
paper disc kept, warm 1px low-alpha edge, inked tilted glyph, tilt +-6);
16->18 Line step accepted if nothing grows; D's size set by the peel; B gate
= 11 reprint inks vs 40% vs chip-off; approx tell to be quieter; measure the
row column axis.

Built (all draft, all on the canvas, version 11):
- lib v2 (`concepts/lib/marks.js`): C = disc + EDGE rgba(112,84,46,.22)
  (first try .34 read as a ring at 3x); TILT 6; B reprint() = CIELAB, every
  category to L* 56 (lightest with >= 3:1 on paper), hue kept, chroma
  clamped; D sticker() with the shipped flap geometry, face #52636F, flap
  underside #8E9DA9, size via o.dSize; approx = 3 long segments
  (window.TM_APPROX = 'dash' for the old look); world basemap for
  near/mid/far frames (FRAMES transform; coast covers Grandi and Grótta);
  phone(..., {frame, clusterStyle, farDot, dSize}); cluster per model;
  tag() mock.
- C full set: `concepts/c/c-set.html` -> `concepts/c/set/c-*` (edge
  check, near x3 + squints, mid halfway orange/ink, far lastDay
  orange/ink/dot + detail, list today / stamp kept / struck word + Plans,
  tag x4 + 40% board, storyboards tag / row / dry).
- B: `concepts/b/b-set.html` -> `b/set/` (gate strip, near halfway/lastDay + squints).
- D: `concepts/d/d-set.html?d=18` -> `d/set/` (size strip, near lastDay/halfway at 18 + squint).
- Grammar extras: `concepts/grammar/grammar-extras.html` -> `gx-*`; composite
  `gx-line18-*`, `gx-axis-overlay-*` made with PIL in Python (scratchpad script).
- Canvas rows: Grammar y0 (sheet 2 + GrammarExtras), B y2400, C y4400
  (near x3, edge, mid/far, list, tag, storyboards, POI check moved to the
  end, retitled as why C bare was dropped), D y7000, Dropped (A) y9200.

## Findings

1. C: passes the squint at halfway and lastDay; the disc edge reads as a
   coin edge, not a ring, after lowering the alpha. No OSM look-alike.
2. C storyboard finding: from the tag the pin is always selected (navy
   rim), so the peel of the printed rim can't show there; it shows from a
   row swipe and when the pin isn't selected. Director/systems: accept, or
   find a tag-side moment for the peel.
3. B gate: reprint vs 40% vs chip-off are told apart. But open vs done
   FAILS for shopping (L* 54 -> 56), and is weak for district (49) and
   attraction (45). B needs those open inks darkened first (brand-token
   pass), or it fails J2 for three categories.
4. D: 14 notch, 16 borderline, 18 = the smallest real peel. At 18 the
   lastDay squint still lands on stickers first. Fails its own premise; goes
   to the owner as the "cost of keeping it" option.
5. 18px Line step: sort rows stay 40, ledger rows 45; nothing grows.
6. Left column: every mark's ink centre is within 0.7px of the column
   centre horizontally; the cup sits 0.8px low (its saucer).
7. Approx: 3 long segments are quieter than the dashes; now on every map.
8. Grammar sheet 2's board still shows C-prime labels and approx dashes
   (history); sheet 3 should fold in steer 1 if the director wants it.

## Next

Systems' C legend/matrix and B reverse-pull spec; director's READY and
scoring. Open for me: B reverse-pull storyboard (once systems specs it),
D storyboards (place, peel-off), B/D list + tag boards, grammar sheet 3.

---


## Where things stand (2026-10-13, concept phase, report 1)

Jam closed. Director's rulings (jam.md "Pass 2: design director: rulings"):
A killed (thumbnail under "considered and dropped"); B, C, D go forward;
one stroke KEEP; two checks KEEP (Inked check upright, carrier tilts);
rim star KEEP with a TRUE cut-out (mask); selection REPLACES the rim;
clusters shown orange AND ink, never darker than an open pin (owner Q6);
district redrawn; seals glyph-only placeholders; plan numbers kept.

Built so far:
- `concepts/lib/marks.js`: shared drawing lib (today + new glyphs, Line,
  Inked, pins for today/B/C/D, clusters, stand-in basemap, phone screen,
  rows). `lib/measure.html` -> `lib/opt-measure.json` (optical-area
  factors, hardcoded as TM_OPT_DEFAULT). `lib/fixture-data.js` is
  generated from systems' `fixture/fixture.json`; regenerate if it changes.
- Grammar sheet 2: `concepts/grammar/grammar-board-2.html` ->
  `g2-s0..s4a-{3x,1x}.png`. All 74 entries, rulings applied, optical-area
  table (today 6.3x spread -> new 1.09x), stroke check (16s don't read
  heavier, they read small; proposed move to 18, director's call), 40%
  swatch beside every open control and the off chip.
- C near moments: `concepts/c/near-moments.html?model=C` ->
  `near-{today,C,Cpad}-{day0,halfway,lastDay}-{3x,1x}.png`, squint blurs
  `sq-near-*-squint-3x.png`, `c-poi-check-{3x,1x}.png`.
- Canvas (version 10): boards IconGrammar2 (x5400,y0) and C_near_day0 /
  C_near_halfway / C_near_lastDay / C_poi_check (row y4400). B row
  reserved at y~2200, D at y~6400, Dropped after. Every board labelled
  "DRAFT · NOT REVIEWED". Canvas folder copy:
  scratchpad/iconcanvas/project (re-read canvas.json before every publish).
- Render scripts (scratchpad, not committed): shootel.js (screenshots each
  `.wrap > div[id]` child at DSF 3 and 1), meas.js.

## Findings to steer on

1. C squint: halfway and lastDay pass J1/J8. On lastDay the 3 starred
   to-dos are found first. Day 0 is identical to today except for the
   grammar.
2. C's OSM look-alike risk is REAL: the visited café glyph and OSM's café
   POI are near twins at phone size; a 4 deg tilt doesn't separate them.
   C-prime (rim off, paper pad kept) does, at the cost of some texture
   (pads) on lastDay. Director's choice: C or C-prime as C's resting state
   (or more tilt or ink texture, untested).
3. Visited stars stay orange and still pull a little on lastDay (owner Q3).
4. D at ~12px: the peel reads as a notch ("A peel is a peel"); D probably
   needs ~14px minimum or a bigger flap.
5. C selected visited vs selected open look alike (navy rim, glyph);
   the tag tells them apart, but note it.
6. In-shell glyph went 15 -> 16 after looking at phone size (15 read small).

## Next

B, C, D per the director's list: legend (systems), state matrix, mid/far
frames (clusters orange vs ink), list (stamp kept vs concept row), tag
(Brauð & Co / Kaffibarinn), storyboards. Then the D near moments and B near
moments. Dropped board for A.

---


## Where things stand (2026-10-13, end of jam pass 2)

- Pass 2 written in `jam.md`. Grammar sheet 1 (rough) in
  `concepts/grammar/`: `grammar-board.html` -> `grammar-3x-s0..s4.png`
  (rules / Printed / Line / Inked / concept-dependent visited). All 74
  entries, TODAY from inventory-png at real size above NEW. Rendered with a
  playwright script in the scratchpad that screenshots each <section> at DSF 3.
- Coordinator context: signed out = playground, the tag has no signed-out
  state, and 40% opacity is the one 'unavailable' look (nothing open or
  visited may look like it). The director's three voices: Printed / Inked
  by you / Line.

### Pass 1 (kept for history)

- Jam turn written in `jam.md` ("Pass 1: product designer (visual focus)").
  No concepts, no scoring yet.
- Sketches (3x, phone-readable, NOT concepts) in `concepts/sketches/`:
  `pin-states.html` -> `pin-states-3x.png` (every direction x 5 states at
  real size on an OSM-like tile + a 9-pin half-done trip x 6 directions);
  `row-states.html` -> `row-states-3x.png` (4 rows x 4 directions).
  Rendered with playwright from /opt/node22/lib/node_modules, chromium at
  /opt/pw-browsers/chromium-1194 (script was in the scratchpad: goto file,
  DSF 3, viewport 390, fullPage). Tiles are fake OSM-like, not real tiles.
- Read: owner.md, inventory.md, inventory PNGs + all context screens,
  CLAUDE.md, owner-taste.md, inspo, systems jam turn. Did not open the
  shared canvas artifact (inventory.md mirrors it).

## Key finding

At 24px on tiles only four channels survive: fill vs hollow, value (tint),
shell vs no shell, size. Folds, holes, relief and resting peels read as
smudges or glitches. Proposed rule: pins speak in big channels; whimsy
lives in motion and on the tag.

## Verdicts so far (mine, pending director)

- D1 Trail blaze: keep (strongest hierarchy). Risks: light inks (lavender,
  teal) weak as solid fields; a fresh trip is heavy; selected needs size +
  navy keyline ring.
- D2 Blind emboss: drop (reads as missing/disabled; far = blank).
- D3 Dog-ear: drop for pins (smudge at 24px, reads as a notch).
- D4 One slot: keep. Visual form = rim star (star on the ring at 12
  o'clock, no halo/keyline, one element instead of three).
- D5 grammar: three voices. Printed solid = identity + star. Drawn line =
  controls (one stroke per size, round caps/joins). Stamped = recorded
  state (VISITED, tag entries). Redraw district/street as solids; replace
  "other" dot.
- D6: merged.
- V1 Conductor's punch: tested, dropped for pins (bite/notch); maybe a motion beat.
- V2 Second run: keep. Visited = half-strength reprint + slight
  misregistration so it reads re-printed, not disabled. Misregistration
  not yet sketched.
- V3 Shell off: keep. Visited = shell falls away, bare inked glyph (paper
  hairline knock-out); far = small dot. Peel moves into the transition.
  Rows: a bare glyph is HEAVIER than a ringed one, so it needs a smaller or
  tinted glyph in rows; the stamp becomes a light struck word.
- V4 Small sticker: the keep-shipped pole (sticker ~14px near). Not sketched.
- V5 Ghost stamp in the tag: open = uninked dotted ring, done = inked; star
  open = orange line, done = orange fill.

## Proposed concept set

A Blaze · B Second run · C Shell off (+ V4 Small sticker optional), all on
rim star + one slot + three-voice grammar.

## Director objections (pass 1 steer) and my answers (pass 2)

- A Blaze: hollow = unchecked; day 0 noisy. + mine: un-visit would have to
  "fill back in" (no dry-up subject). -> I recommend killing A; draw day 0
  first to show it.
- B Second run: reads disabled; guide's voice, not the traveller's. -> tint
  = mix with paper, never opacity; visible misregistration; shown beside
  the 40% swatch. Still the weakest on voice.
- C Shell off: may read as an OSM POI; rows heavier. -> visited glyph in the
  Inked voice (seeded tilt +-6 deg, category ink, hairline paper knock-out);
  rows at 15px tilted, no ring. Motion: shell peels off on visit; un-visit =
  glyph dries up by thickness (shipped motion intact). MY PICK.
- D Sticker: still darkest; check erases category. -> (a) ~12px + one step
  lighter face, (b) cream category glyph instead of check (owner Q5).
- V5 ghost stamp as open state: dropped (reads disabled). Open = Line, full
  ink; the ghost is only storyboard frame 1.


## Open questions

1. Owner OK with no fine detail on pins (whimsy to motion + tag)?
2. Does tint (V2) read "disabled" to him?
3. Category ink value pass for D1 (overlaps with the brand-tokens pass)?
4. District/street: solid redraw or keep the dashed mirror?
5. V4: may the category glyph replace the sticker's check?

## Grammar commitments (sheet 1)

24 grid, 20 live area, r~1. Line stroke 2 (2.5 on the 50px seals), round
caps/joins, one x / + / chevron / Line check, at most one solid point per
Line icon, no text glyphs. Inked check = the shipped filled check with a
lean (VISITED marks only). One star, no keyline; the rim star on the map.
Shell = place, rim = Line stroke; selected = navy ring at the same 24px.
Glyph redraws: fork, cup, other = flag, district = parcel (looks like a
hex nut at 12 -> redo), street = ribbon, area = hatched plot. Cluster =
stacked shells in ink, not orange (OWNER Q: CLAUDE.md lists clusters as
orange).

## Next (pass 2 onward)

1. Grammar sheet 2: optical-area pixel count, district redo, cluster on the
   stand-in basemap, 40% swatch beside open controls and visited marks.
2. Day 0 / halfway / last day on the fixture: C, then D, then B; A day 0 only.
3. C storyboard (peel-off; dry-up), 5 frames each, tag + pin.

## Next (pass 1, superseded)

Director steers. Then concepts with systems: sketch V2's misregistration
and V4 at real size; test D1 with 40+ pins; draw the three-voice grammar on
a few controls (sort/filters/locate/× set) next to today's.
