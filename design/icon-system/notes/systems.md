# Systems designer notes: icon system

## THE SYSTEM, one shot: the rest of the set (2026-10-30, canvas v293)

- **Owner:** "i want to see the rest of the icons we need built with these principles now"; "i think shopping needs more execution
  guidance than conceptual change. one shot them all." Done as declarations only (system.js DECL); every new shape is a general kind
  in system-make.js KINDS, none names an icon.
- **New kinds:** block (a mass, w and deep, at a root's end), ring, disc, spokes (n posts crossed through a ring's centre, turn),
  splay (two posts from a point, lean, to the bottom / past / reach; a pin from a centre, one band with a post from its foot),
  knot (a square, its sides running on into loops; loop 'square'), drape (a quarter ellipse hung from a slab's middle to the fall's
  inner face, then a post to the bottom; mirrored a cut apart), blocks (cols x rows a cut apart, turned), end post (a post flush with
  a root's end, rise a line over the top, h below it or to the bottom), leaning post (from under a disc, a cut apart along the post),
  loop at 'top' (half circle on the face, span; into: slots of its own width through the face past a band of the line, ending round),
  slab lines (thickness in lines).
- **New class:** DIAMOND (shapes): the class box is a diamond of the coin's area; the fit is by the ink's reach |x|+|y| (optics l1).
- **Rules added (designer settings, his to change):** Shapes in a diamond; A handle on a face; One band; Loops off a short straight;
  Curved parts on the grid; Turned parts. Shopping set to "a bag; execution".
- **Engine-level changes (general):** asOne: a curved part moving with a stretched straight root takes its scale across, evenly.
  landPrims: a curved root with no straight side on its box lands its outermost straights (the knot). Blocks turned off the grid are
  not mirrored (symD cut the axis corner rounds: 6 KNEEs). engine.js unchanged (an arcEase retry was tried for round loops and made
  36 faults; reverted).
- **Tried and dropped:** round ⌘ loops (16 faults: line-to-arc JUMPs on a 0.63 straight, too short to ease; the rack can't help);
  a bag handle on legs (read as a padlock, and the arch went ogee); the walker with arms (a dress); square share 2/5 (no ⌘ left);
  a Ferris X on 45-degree legs (a sawhorse); shallow hip turns (KINK: under 30 degrees is a knee), so the body and the back leg are
  one line (both 16 degrees).
- **Gate (247 pass, 4 fail, all Continuous curvature):** 24 Nordic loop (2 KNEEs: the notch floor between the top loops, two
  rounds nearly meeting); 24 Ferris wheel (1 KNEE); 24 walker (2 KNEEs at the feet: the outer foot corner is 74 degrees, a tip by
  the tip rule); 12 walker (2 KNEEs + a SHOULDER in the crotch). Every 18 passes; every approved icon is byte-identical at 18/24/12.
  Proposed fixes (not done): the rack steps down for two rounds that share a short floor (general); a splay's foot square to its
  post, or the tip threshold read against the foot (general). 12 Ferris closes its counters by rule (a disc on legs): an eye check.
- **Blind read** (`grid/blind-read-oneshot.md`): bed, bag, high; Ferris medium-high; ⌘ medium (the Mac key); curtain medium;
  walker low (an italic "i"); city blocks low (a waffle, an apps grid). The diamonds read as their own category but not what.
- **Bench:** now Park, a set member (no longer "the proof").
- Scratch: session scratchpad `os/` (b.sh builds, prev.js quick union preview, zoom.js, spot.js, stills.js, blindkit.js).

## THE SYSTEM, round 8 (2026-10-30, jam turn 218, canvas v292; knife shorter than the fork at 12)

- **Cause:** landing: tines' straight top snaps, the blade's curved top stays as drawn; the optical-centring offset decides the
  parting. **Fix** (end of `asOne`): a non-POST prim whose pre-landing top/bottom was within 1e-3 of a POST's is scaled along y
  about its other end to that POST's landed line (a translate put the blade's step off grid). Gate 158. Snap priority text
  amended (10-29). The owner refused a separate "groups share lines" rule: built, then removed.
- 12 residual 0.11px: the rack's round on the blade's nose after landing. Check tolerance 1/6px.

## THE SYSTEM, round 7 (2026-10-29, jam turn 217, canvas v291; his note: longer tines and blade at 12, only if necessary)

- **What carries the read** (`columns()` comb branch; system.js passes the 18's built meta.read as Z.master, READ_DRIFT 1/8):
  plain = post to the bottom under a comb + head; ratio plain/held vs the 18's; if over by more than 1/8, the comb's height takes
  back exactly enough to restore it (the blade follows headBot). Build order matters: 18 before 12/24 (an error prints otherwise).
- 12: ratio 0.999 -> 0.76, 0.498px given, slots 3px. 24: 0.824, kept. Check "What carries the read". Gate 155.
- Rejected: a fixed per-size share (forced on every icon; the coupe read as an anvil). Scratch `r7/`: look12.js, stills.js, idx.py.

## THE SYSTEM, round 6 (2026-10-28, jam turn 216, canvas v290; director turn 215: v289 a trident at 18)

- **Comb depth** (`asOne`, capY): the floor is where the inner circle (head rx less the wall, on the head's centre line) has
  turned 22.5 degrees: cy + ri sin(pi/8), nearest grid line, at most bottom less a line. Was 45 degrees (v289, 4px at 18).
- **By eye:** fixed floors 3 / 3.33 / 3.67 at 18 tried (a temporary override, removed); 3.33 chosen; 22.5 degrees lands it.
  Scratch `r6/`: look.js (candidates), stills.js (r6-1, r6-2), measure.js (board heights 647 / 703 / 2310, unchanged).
- **Result:** 18 3.33px (0.70 into the head), 24 4.33px, 12 2px square. Gate 153 pass.

## THE SYSTEM, round 5 (2026-10-28, jam turn 214, canvas v289; his note on v288's fork)

- **Cuts follow the curve** (`asOne`, the comb's slots): each slot = rect between the landed tines, from their foot to the floor, cut
  by (a circle of the head's rx less the wall, centred on the head's centre line) united with the part above that line. Wall = tine
  width. Floor = where the circle has turned 45 degrees, on the nearest grid line, and at most bottom less a line. The circle, not an
  inner ellipse: an inner ellipse has no constant curvature, so the engine's arcEase skipped it and left a JUMP at the tangent.
  Not followed when ri on screen <= the line (12: 1px): square, else 2 KNEE faults at 12.
- **Tried and rejected:** following the curve all the way down (a trident, slots 4.67px at 18).
- **Gate:** 153 checks pass. Scratch `r3/`: proto5.js (the cap variants drawn by eye), crop5.js (r5-2), final5.sh.

## THE SYSTEM, round 4 (2026-10-28, jam turn 213, canvas v288; his notes on v287: tine length, the star's points)

- **Comb depth** (`system-make.js` head branch + `asOne`): slots cut on into the head until one line is left under the outer slots;
  the cut is added after the comb lands (between the landed tines), its floor on the nearest iPhone pixel line; meta.combs gets
  slotDepth / past / bridge; check "Comb depth" (bridge within 1/6px of the line). 18: 4.12px slots, 1.43px left.
- **Points** (`apexBuild`, `isApex`, `crestAt`): apex = convex, under 75 degrees, its two edges equal length (within 3%); crest
  measured on the built outline; the apex round is scaled by bisection until the crest reads 1/5 line (within a tenth), and for a line
  mark (`mark(decl, { land })`) only as far as the landed outline stays fault-free (x1.75 kinked the star's counter after
  one-side landing; x1.70 is clean). Tips (unequal edges) untouched. make() runs apexBuild on its final build: the tree's top already
  0.29/0.386/0.193 at 18/24/12, left as drawn. Check "Points".
- **Why not "acute = rounder" for every corner** (the coordinator's first framing): the eaves are the most acute corners and he wants
  them sharp; the measured difference between the tree's top and the star was how the sides arrive, not the angle.
- **Gate:** 153 checks pass. Scratch `r3/`: crests.js, nose.js (crest and nose widths on screen), crop4.js (r4-2 still), measure.js.
- **Open (his):** outline/solid; novelty; Shopping. Mine to change: Comb depth (a line), the apex crest (1/5 line), parity, chamfer.

## THE SYSTEM, round 3 (2026-10-28, jam turn 212, canvas v285; director turn 211 scored v284 8, 9 after two fixes)

- **Done:** combs keep their count the way rows do (one `thinning()` helper, count first: part width, thinner a grid step at a time
  to the size's thinnest, then one part fewer); the fork keeps 3 tines at 12 (parts and slots 2/3px). "Restaurant at 12" left the
  board on its own (no declared count was lost). The bench: DECL `park` is now `name: 'Bench', proof: true`; the board labels it
  "The system's proof", puts it last, keeps it out of the row; the spec says so.
- **Found by the gate, fixed as rules:** parity: a part centred under another takes its parity, one iPhone pixel wider when they
  differ (designer setting "Centred under a part"; meta.parity records it; at 12 the fork handle is 4/3px against the knife grip's
  1px, worth an eye). A post into a head runs in past the head's curve at its sides (overlap from the ellipse), which removed a spur.
- **v264 proof:** re-run complete, all seven byte-identical (max 0, same at 7dp). `svg/system/v264/proof.json` unchanged.
- **Gate:** 146 checks pass. Scratch: session scratchpad `r3/` (batch.sh, faults.js, zoom.js, stills.js, canvas-pub.py).
- **Open (his):** outline/solid; novelty; Shopping. Mine to change: parity rule, 45 degree chamfer, rack scaling, thinnest at 12.
- **Next (director, not blocking):** fold `tiers`, `head`, `blade` into the vocabulary as fractions of a parent when the next icon
  needs them (the tree still carries raw heights and widths).

## THE SYSTEM, round 2 (2026-10-28, jam turn 210, canvas v284; director turn 209 scored v283 a 6)

- **Where:** `grid/src/system.js` (SETTINGS, SIZES, the rules `row`/`comb`, DECL as data, `words()`, `v264Box()`, the build),
  `grid/src/system-make.js` (the maker: KINDS, the rack, `chamfered()`, `layout()`, `make()`, `mark()`, `asOne()` landing groups),
  `system-land.js` (landPrims; now: a centred root stays centred; a curved root's straight sides land by the snap priority),
  `system-check.js` (reads meta: rows, combs, bands, protrusions, chamfers; box against v264 as landed), `system-board.js`,
  `system-spec.js`. Build one process per icon per size (`node src/system.js build <size> <id>`, 2-6 min each, run 4 in parallel; needs
  TOOLS=<dir with node_modules/paper>). Scratch scripts in the session scratchpad `r2/` (buildall.sh, batch2.sh, faults.js, look.js,
  stills.js, canvas-pub.py).
- **How a declaration drives geometry (museum):** `roof: gable of beam, pitch 1/3, ends 4/5` | cut | `beam: slab, w 1` | held |
  `columns: row n 4, h 1/3` | held | `plinth: slab of beam`. The maker lands the beam's width and the 1/3-line overhang (18: 2/3px),
  runs the row rule across the span left (posts 4/3, gaps filling it: 1.11px), draws both slabs with the 45 degree chamfer.
- **Decisions and why:** chamfer straight at 45 degrees (the v264 curve was eaten by the engine's rounds and left a line-end round right
  at the KNEE limit; a 63 degree cut turns under 30 degrees and fails KINK); chamfer size = the rule's overhang, never the row's slack;
  rows under a held slab fill their span exactly; the rack scales with the drawing at 24/12 (in px it exposed short off-grid straights at
  24); box = v264 landed at the size, ties outward (v264's edges were never on the grid; this gives the fork tines = slots at 4/3); the
  class fit uses only the sides that scale (the fork's width is all fixed widths); the fit's last test uses the full law (the fast build's
  knife tip poked up 0.25 and shrank the fork); widths land on the final drawing only (landing inside the fit stepped the museum down).
- **Open (his):** fork at 12, two tines or a bigger 12 box; outline/solid; novelty; Shopping. Mine to change: 45 degree chamfer, rack
  scaling, thinnest part at 12, plus the earlier ones (stroke 1 1/2 at 18, ring, star, +, rule order).
- **Known:** the bench is a proof icon, not a design proposal. The cafe at 12 closes its ear's counter (under 1px, by rule), as v283.
  `system-v264.js` was not re-run: the kernel files are untouched since 0b4d345e.
- **Next:** the director's score; then him.

## THE SYSTEM (2026-10-27, jam turn 208; icon designer carrying systems + visual)

- **Where:** `grid/src/system.js` is the system: SETTINGS (every decision point: name, setting, date; open ones with choices; `designer`
  marks the ones I set where asked), SIZES (18 master; 24 and 12 as their own builds; widths in px at that size), the general rules
  (`row`, `comb`, `protrusion`), DECL (each icon's roots, relations, joins), the build. `grid/THE-SYSTEM.md` is written from it
  (`node src/system.js spec`); the board from it too (`src/system-board.js`). Checks: `src/system-check.js` (`node src/system.js check`,
  exit 1 blocks publishing). Proof: `src/system-v264.js` (regenerates v264 from the kernel; `svg/system/v264/proof.json`).
  Landing: `src/system-land.js` (`landPrims`). Outputs `svg/system/<size>/<icon>.svg|json` (json: `drawn`, `d`, `meta`).
- **The kernel is v264's code, unchanged in behaviour:** engine, picks7, proportions, laws7, joins, construction, mix-curves, placement's
  rule. Hooks (all inert when unset, re-proved byte-identical): `global.SYSTEM_O` (construction's draw options per build: the museum's row),
  `global.SYSTEM_PRIMS` (construction and mix-curves: land the roots before the corner law), picks7 `o.cols` may be a function
  `(span, w, over) -> { n, w, span, over }`, one-side returns its `maps`.
- **How a size is built:** PROP.line.post / band / cut are set from SIZES before the kernel loads (one size per process); the kernel fits
  and draws in its 24 frame; the roots land on that size's iPhone grid (one-side's snap priority worked out on the plain union, applied
  to the roots: straight roots take the map; a curved root moves whole or scales evenly so its curves keep their shape); then the corner
  law and fairing run; at 12, holes under 1px close.
- **Why roots first:** landing a finished outline stretches curves between landed edges and breaks curvature at joins (museum gable 31
  faults); moving curve runs rigidly bent straight edges. Landing roots then rounding keeps every join fair.
- **Decisions I made where asked (marked on the board):** stroke at 18 stays 1½ (v264's weight; outer side lands, inner half an iPhone px
  soft); ring 1⅓ at 24 (whole px, lighter than the glyph); star = v264 at the 18 box (outline ≈1.35); + = v264 at 14 across, stroke 2,
  centred; museum 4 columns at 18 and 24, 3 at 12 (3 at 18 read as a bank); rule order: curvature, minimum widths, same role,
  protrusions, grid, box (the box may give way by one part for a row or comb).
- **Open (his):** cutter rack in the engine; outline/solid logic; novelty; Shopping. Also the director's 8 vs 10-11px question was never
  answered (the system keeps v264's 10-11px).
- **Next:** his read on the board; every change he makes goes into SETTINGS/rules first. The builder takes `svg/system/<size>/` into
  index.html when he says the look is good.

## Director fixes (2026-10-27, jam turn 199, canvas v276)

- `one-side.js`: STANDARD[12].close (short counters drop their hole contour); every width whole iPhone pixels at 18 and 12
  (`evenTie`, a tie within 1/50 px to the even count); an odd centred part moves the icon's centre ½ iPhone px (`shift`,
  `sym` returned per size and stored in build.json); maxMove is per axis. `back-to-drawings.js` museum3 columns `pw = 2`.

## Back to the drawings (2026-10-27, jam turn 197, canvas v275)

- **Structure:** `src/one-side.js` holds the rules (`land(d, {size, sym, symY})`, `report()`), `src/back-to-drawings.js`
  the set (`SET`, `BEFORE`; museum3 and restaurant2 roots through `mix-curves.js`, which now exports `capital`, `ink`, `LINE`),
  `src/back-check.js` the check, `src/back-shots.js` / `back-board-imgs.py` / `back-board.js` / `back-board-shot.js` the
  board, `back-zoom.js` and `back-look.py` for looking. `REUSE=1 node src/back-to-drawings.js` re-lands without rebuilding.
- **How land works:** findEdges (pixel-fit.js) per axis; stems paired; which side faces out by a flood fill of the empty space
  from the frame; per contour straight-line interpolation of every point between its controls, handles by the local slope,
  smooth nodes kept smooth. Order: the size's stroke (widths only), counters open, then landing at k = size/24 x 3.
- **Decisions:** the grid is the iPhone pixel because the drawings sit on fractional positions, so the nearest ⅓px moves an
  edge at most ⅙px (whole px moved edges up to ½ and changed the drawings: the v266-v274 lesson). Widths kept at 24 so the
  weight is v264's. A centred 1½ part stays centred, both sides ¼ iPhone pixel soft. Free posts (fork tines, knife) land
  whichever side is nearer.
- **Known:** fair-check marginal KNEEs from landing (museum capitals, coupe band ends); a free post counts one side.
- **Retired as the method:** `the-grid.js` and its rules (kept to rebuild boards).

## THE grid, round 3 (2026-10-27, jam turn 195, canvas v274; director turn 194 scored v273 8, 9 after one fix)

- **Why:** v273's give order rounded every proportion down before any detail gave, so the museum's columns (the subject) went
  2⅔ → 2 and read as two windows in a block. Fix as a rule: `give(name, parts, h)` with roles DETAIL (½ steps, floor ½) →
  PEAK (a point takes what is left, floor 1) → BODY (round down) → SUBJECT (round down last, floor; `GRID.subjectLong` 3).
- **Result:** museum columns 3, openings 1 × 3, 10 × 9.97, roof ends ½, peak 1½ (pitch 3/10), ink +9.4%. Others unchanged
  (byte-identical). Check 0 of 59 off; soft 0 / 11.
- **Measured and rejected:** ends 1 + peak 1 = +13% ink (gate); ends 0 = +1% but the triangle's eaves are eaten (lens).
- **Open:** museum ink sits near the top of the gate; fair-check flags the ½ eaves (0.2px round, invisible). Next: director
  looks at the museum in the row; then him.

## THE grid, round 2 (2026-10-27, jam turn 193, canvas v273; director turn 192 scored v272 a 6)

- **Why:** the six had grown and darkened (limit = class box; every part 2px). Fixes: limits = approved box rounded up;
  give order (round down, then details); weight gate ±10%; stroke-or-solid test (rims, handles, rings are 1½ strokes; their
  inner half-line edges are named in `meta.half` and the check accepts only those); capitals drop to half the slab.
- **Result:** 0 of 62 off; soft 0 / 11; café +9%, coupe +9% (10 × 9, drink 2½), museum +9% (10 × 9.62, columns 2), tree +5%.
- **Open:** museum columns 2 tall (squat); the + 11% lighter per area by his 1½ rule.

## THE grid (2026-10-27, jam turn 191, canvas v272; icon designer carrying systems + visual)

- **Where:** one grid defined and built: `grid/THE-GRID.md` (the spec), `grid/src/the-grid.js` (GRID numbers, rule functions
  whole/even/centred/row/counter/fits/place, the six), `grid/src/grid-check.js` (reads every edge; `--approved` for before),
  `grid/src/the-grid-shots.js` (2x/3x rasters), `grid/src/the-grid-board.js` (board; blobs in `the-grid-board-blobs.json`).
  Outlines `grid/svg/the-grid/` (+ build.json). Build: `node src/the-grid.js` (~1 min an icon, the star ~3).
- **Decisions and why:** solid 2 = the only whole px >= the 1½ floor (his "nothing should go that thin" + "if it's not a
  stroke it doesn't have to be 1.5"); gap 1 between parts, counter 1-2 across and >= 2 along (the café's 1 × 1 ear hole read
  as a dot, so the ear grew 5 → 6); boxes = approved cuts to whole px (centred widths even); a point may pass by ½; centred
  rows put an even thing on the centre (so three museum columns, not four); a centred 1½ stroke sits on k + ¼.
- **Result:** 0 of 60 edges off the grid; soft 0 / 6. Ink up on the badge icons (coupe +32%), down on the marks.
- **Tree:** built from `svg/g7/construction.json` nature parts (the approved roots) with the engine law; reproduces the
  approved byte-near when the trunk is unchanged; a 2px trunk lengthens the tips 0.16 (tip round = share of its edge).
- **Open:** his coupe question; fair-check KNEEs at the museum bevel (over 1 makes the capital curve longer) and the café's
  ear foot; the app must show the badge glyph 1:1 (it's at 18px) and the + button centre on k + ¼; fork and knife, bed,
  shopping not yet rewritten in the-grid.js.
- **Next:** director scores v272; then him; then port the other icons into the-grid.js and the app build.

## Shopping, round 2 (2026-10-26, jam turn 8)

- Round 1 failed the blind read (`shopping/blind-read-1.md`): K3 lampshade/toaster, J2 tap/pump, B1c reception.
  Director 7: K3 3, J2 3; "every left-of-centre move changes the object or hides what reads as a shop".
- Wrote `shopping/concepts/bag-plain.md`: the handle rule (counter = root, 2 deep, length = the grip; wall = line;
  body closes; ½ fillet), which covers the cup's ear and the bag and rules out the shackle. Anti-misread table.
  P1 ear turned up (~62), P2 square handle (~60.5), P3 cuffed paper bag (~62.5). Ceiling: museum 62.9.
- Process note: twice this session the worktree index went stale after a fetch (staged reversions of others' commits);
  fixed with `git reset --hard HEAD` (all my work was pushed) and then a merge. Check `git status` before merging.
- Next: visual draws P1-P3; a fresh blind read; director; if it passes, the owner gets the "too common?" question.

## Shopping, concepts (2026-10-26, jam turn 4)

- After turn 2 (visual: 15 sketches; B1 sign and F4 die-cut bag pushed, the rest killed) and turn 3 (director: B1
  tidied, F4 only as K, new J = sign hangs the bag, new L = open-glyph test; a bag is open only with a one-line
  left-of-centre reason).
- Wrote `shopping/concepts/` README, B1, J, K, L. Constructions on the 24 grid with the pixel round's minimums.
- Findings: two Ø5 ring links need centres 6 apart, so B1a (one ring) / B1b (two rings, 11x4 board); nothing threads
  a 2px hole, so J hangs on two drops with the handle clean; ring over a hole = padlock.
- Rules proposed: support = line, carried = mass (the six already do it); link is a ring; hole held, never threaded;
  fold is a cut (K).
- Ink estimates: K 66, B1a 62, B1b 82, J 84/72; museum B¼ 74.5. Open: the weight bar's wording.
- L proposed kill: owner-taste 10-14, place icons are solid; outline = not yet tapped.
- Flag: whole-pixel claims hold at 24 1:1; the app draws glyphs at 18 in the ring. Director to name the size.
- Next: visual draws K, B1a, B1b, J finished; a fresh blind read; director; then my coverage check per 9+ concept.

## Shopping (concept round, 2026-10-26, jam turn 1)

Brief: `briefs/shopping-concepts.md`. Work: `shopping/jam.md`, `shopping/jobs.md`. No drawings yet, no canvas.

- **Where things stand:** jobs written; five directions in the jam; visual designer next.
- **Jobs findings (load-bearing):** the "24 badge" holds an **18px** drawing (`badgeHtml()`); selected = 24px reversed;
  filter chip = **12px bare** (not in the brief: flagged); far zoom and visited pins show no glyph. Ink lavender
  `#8A7AA8`, weakest (3.26:1). Shopping is the **largest category, 49/183 pins (27%)**: the most repeated mark, so it
  should sit at the light end of the set's weight (the old bag was the darkest). Told apart from: cup (same ring root),
  Museum/Landmark (buildings), Venue (paper slips); padlock, briefcase, bell, gift, cart, wallet, tag (= the app's popup).
- **Draw:** Oblique "Look closely at the most embarrassing details and amplify them", "Water"; fields semaphore,
  bell founding, Swedish runestones; twists hold-in-one-hand, Nordic-not-American, ugliest-honest-answer.
- **Directions:** A gusseted paper shop bag (specific bag; gusset = one cut per top corner; the honest control);
  B hanging old-town shop sign on a bracket (post + slab + ring links; asymmetric, light) — my strongest;
  C kiss-lock coin purse (wild card); D string bag (tests holes/counters, expect to kill); E goods on a counter
  (three roots for sale; risk cheeky). Killed: shop bell (notifications), fehu rune (reads F), hanger, cart.
- **Rule proposals:** handle = a ring partly hidden by its parent, hidden share a proportion (cup ear and bag loop one
  rule); weight band from the six's ink coverage, frequent categories at the light end; line as the founder's unit
  (left to the pixel round).
- **Open:** the v264 rejection had no reason; only A depends on it. 12px chip as a judged size.
- **Live DB:** the Supabase MCP returned 502 twice; the shop list is from the 10-16 inventory, not re-read.
- **Next:** visual designer's turn; then director steer; then drawings at 18/24/72 beside the six, a blind read
  (including 12px), and the coverage check against `shopping/jobs.md` for every 9+ concept.

## Update 2026-10-26 (B and C tested, canvas v248, jam turn 166)

- Owner answers: holes = proportional root shapes keeping the wall right; "the brand should be built into the root
  calls"; "And b is good to test". My read: a mix (roots carrying their joins, proportional) fits best; B becomes it
  if root calls state thickness. Said in one line on the board; prototype is B.
- B prototype: `grid/src/castB.py` (+ `castlib.py`, `castB-sheet.py`, `castB-overlay.py`, `castB-stages.py`,
  `castB-row.py`). Re-run: `python3 -I src/castB.py` from `grid/` (needs scipy, scikit-image; pip-installed this
  session). Outputs `svg/castB/` (.npy masks are not committed; regenerate).
- Results: café/bar/+/star back within a hair (star points sharper); museum loses the capital drop; tree fails
  (notches fill, tips sharp). New icons get flares at their joins; bag still a dark padlock; fork light.
- C fingerprint (`src/fingerprint.py`) fails: nudged six 0-1.8, loaf bed 0.00, bag 0.26, heart-on 3.72. Judge stays
  a person.
- Next if the director passes it: fix tapers in the rule (one change, all icons); make the capital a root; then fit
  curves to the traced outlines (the engine's clean-curve standard) before any engine rewrite.

## Update 2026-10-26 (grid: how the system makes new icons, canvas v246; director 9 after edits, done in v247)

Task: think, don't build. Owner: "I think declarative is fine but I don't want
it to be so specific… it needs to be a flexible system that outputs coherent
consistent icons." Written up in `grid/flexible-system.md` and the board
"How the system makes new icons" (Grid page, row 1, x 2520).

- **Diagnosis I agree with (director, jam turn 164):** character lives in
  per-icon code (`picks7`); the engine rounds by geometry, not by anything the
  spec says. The director's fix (declared join kinds, one treatment each) is a
  catalogue, which is what the owner pushed back on.
- **Precedent finding:** flexible-but-coherent systems fix the tool or the
  process, not the outcomes (Metafont's pen, the broad nib, Lucide's
  renderer-made round ends, CAD/casting fillets by wall thickness). Catalogues
  of drawn details (Glyphs corner components) and human review (SF Symbols)
  are the other two routes.
- **Settled across all approaches:** roots joined or cut; the ratio scale and
  lattice; class by job.
- **Three approaches, differing in where character lives:** A, a kit of drawn
  parts (metal type / Lego Technic connection points); B, one casting rule over
  the filled, joined shape (fill inside corners where thin meets thick, more
  with bigger thickness contrast; inside corners tighter than outside; walls
  minimum; size/weight to slot), with thickness measured from the shape (a
  distance field / medial axis), so nothing needs to be told a join's kind; C,
  sketch, snap to scale/lattice, score against a measured fingerprint of the six.
- **Recommendation: B, with C as its judge.** Test C first (half a day: does a
  fingerprint of the six rank the blind icons the way the director's eye did?),
  then a separate B script (a day or two): rebuild the six from plain roots
  with no hand code (the misses = what the rule can't say), then Restaurant
  (blade, a new part), the bag and the bed. Fallback: A's kit from the six.
- **B's risks, stated:** softer/more uniform than the six; the museum's beam
  drop and the coupe's leaned flare may not emerge; fitting the traced result
  to few, clean curves ("minimal bezier curves with perfect architecture").
  Implementation idea, not yet told to the owner: SDF smooth-union with a blend
  radius from local thickness; it can't drop tangent roots (the heart failure).
- **Not resolved (owner's):** holes where shapes overlap (B does either, the
  even inset is cheaper); what makes a plain block ours (under B, only rounds).
- Randomness draw (role brief): "Use fewer notes"; joinery, Lego Technic,
  metal type.
- v247: added "what's new compared with today"; precedent cut to three lines; C's test ranks both blind rounds plus nudged six; B's test names the touches at stake (museum beam end, coupe leaned flare, the columns' and trunk's sweep; the cup claim was stale since g7p). Frame 5700. Row 2 moved +5540 (boards y 21580, note 21280).
- Was: Between (840, 300, h 20860) ran past
  y 16040 and overlaps row 2's Master (0, 16040, w 1600) in x 840-1600. Not
  mine to move; flagged.

Next: the owner picks (or not) an approach; then the cheap test, outside the
engine.

## Update 2026-10-13 (canvas v12 re-check)

- **C: all 10 jobs PASS, no blockers** (far/halfway proves J2 far; the
  gummed-ring peel `c-peel` proves J10 off-selection; the struck row is
  quieter). Its struck row touches the row-stamp markup and visit-drag code,
  so it needs the full gesture gate; listed in C §6a.
- **B: no blockers now.** The gate passes except "other" visited vs the off
  chip (ΔE 8, colour only), a nit since they're on different surfaces in
  different forms. J1 is weak: the halfway and lastDay squints look alike
  because done recedes by value only. The reverse pull is new motion. Cost:
  three app-wide category inks (owner call), touchpoints in B §6a
  (CATEGORY_COLORS, chips, the shape colour saved at add time,
  tools/neighborhood-shapes.html, CLAUDE.md's moss hex).
- D unchanged: J1/J8 blockers at 18px; honest-cost option.

## Update 2026-10-13 (jobs check on canvas v11 frames)

- **C (C′): every job PASS except far open-vs-done UNPROVEN.** The far
  lastDay frame has no open far pin, so far/halfway (27 open★) is needed.
  Send the far silhouette, not the dot. Nit: the row's visited glyph sits
  1.67px low.
- **C tag-peel finding folded into §3:** a selected pin's rim is navy, so a
  visit from the tag inks + tilts the glyph and doesn't peel. The peel plays on
  unselected pins (row swipes when that row's tag isn't open, Plans). No
  deferred peel on tag close (it would make selection look like a state).
  Open for the director: is "ink + tilt only" on the selected pin enough?
- **B: BLOCKER on J2/J1.** The gate shows shopping/district/attraction open ≈
  visited (L* 54/49/45 → 56) and the reprint close to the 40% look on several
  rows. The fix is darkening the open inks (brand-token pass = owner call).
  J10 unproven (the reverse pull isn't drawn). Recommend B → "considered and
  dropped" unless the owner wants the token change.
- **D: `S` = 18. BLOCKERs on J1/J8** (the stickers still win the lastDay
  squint) and J7 for D-main (D-alt passes). J10 unproven. Goes to the owner
  as the honest-cost option, per the director.
- Tables are in §7 of each `concepts/<b|c|d>/how-it-works.md`.

## Update 2026-10-13 (after the director's concept steer 1)

- **C is now C′** (rim off, paper disc kept with a warm 1px outer edge, glyph
  Inked + tilted ±6°; bare C dropped: OSM POI confusion). Rewrote
  `concepts/c/how-it-works.md`: legend (rim = state; disc = "a place"; edge =
  structure, and a DOUBLE if it reads as a ring), full matrix (far = disc +
  dot vs a 7–8px silhouette; selected = navy rim back on the disc; plan
  shape stops go round like the shipped sticker; **rows drop the disc**
  because paper on paper is invisible, and keep the bare tilted glyph on one
  centred axis), flows (rim peels; un-visit = ink dries on the shipped `DRY`
  clock with the printed rim and glyph returning from 300ms).
  - Flag to visual: `lib/marks.js` has `TILT = 4`; the director's ruling is ±6.
  - Alternative left open for visual: while selected, keep the navy rim and
    only tilt/ink the glyph (no peel + reprint of the selection ring).
- **D**: size `S` = the smallest of 14/16/18/20 where the peel reads at 1x
  (no 12px); no peel at far; the DOUBLEs stay as D's declared cost. If the
  lastDay squint at `S` still lands on stickers, D goes as the honest cost
  option.
- **B**: reverse pull specced frame by frame against `DRY` (pin holds 0–370;
  pull right→left 370–450 inside the snap, ease-in; glyph back into register
  450–490; reduced motion steps at 80ms; row swipe = 80 + 40ms standalone;
  forward pull 120–320 + jolt 320–360).
- **Line ladder accepted:** 14 in-row × / +, 18 menus, 20 header/tag, 24
  seals; no row or menu grows.
- **Jobs check:** only C has frames. Provisional: J1 PASS, J8 PASS with a
  note (visited★ full-orange stars compete as specks at lastDay, so Q3 matters).
  The rest are pending visual's full C′ set, B's gate strip + near frames and
  D's size strip + lastDay. §7 of each how-it-works holds the table.

## Update 2026-10-13 (concept phase, how-it-works written)

- Jam closed (director pass 2 rulings): **A Blaze killed**; B Second run, C
  Shell off, D Sticker re-weighted go forward. Grammar commitments kept
  (one 2px stroke, two checks, rim star as a mask cut-out, no keyline/halo).
  **Selection replaces the rim** (navy ring becomes the rim, same size, never
  a second outline). Clusters shown orange and ink (owner Q6). My cluster rule
  was accepted. Owner Qs 1-7 go with the first scored concepts.
- Wrote `concepts/b|c|d/how-it-works.md`: legend, full state matrix, the
  3 storyboard flows, the jobs table with proof frames and risks, and the
  index.html touchpoints.
- Systems calls made in them (director may overrule):
  - **Far selected pin shows the 12px glyph** (selection replaces the rim,
    so otherwise a far selected pin has no category). A far pin *can* be
    selected: `markerIcon()` computes far size + `MARKER_HI_DELTA`.
    Resolves my old open question; under the ruling `MARKER_HI_DELTA` -> 0.
  - **B's reprint = one target lightness for all 11 inks** (not one mix %),
    glyph >= 3:1 on paper, never opacity.
  - **D-main has a DOUBLE in the glyph slot** (category vs check) and spends
    size on state. Stated openly; D-alt (cream glyph) clears the glyph one.
  - **You-are-here stays** a navy target (different form from the selection
    ring); risk vs C's far dot in bar/area ink noted.
  - Un-visit: C = the inked glyph dries up (no reversal needed). B = no ink to
    dry on the pin, so a reverse pull timed to the stamp's snap (new motion).
    D = the sticker peels off (must not read as a pop).
- Touchpoint fact: there's **no `rowStampHtml()`**. The stamp markup is
  inline in `renderCard()` ~8198, `buildPopupHtml()` 5074/5077 and the visit
  drag 7811/7860. Any row-stamp change (Q2 b) touches gesture code, so it
  needs the full gesture gate (lane 3). Keeping the stamp doesn't.
- Local checkout now includes the playground (main merged in).

Next: check visual's grammar sheet 2 against the legends, then each concept's
frames against jobs.md (pass/fail per job) before the director scores.

## Where things stand (2026-10-13, end of jam pass 2)

- Jam pass 1 (jobs, diagnosis, families, state model, D1–D6) and pass 2 (the
  build plan) are in `jam.md`. `jobs.md` is written (10 jobs, J7–J10
  inferred, plus 8 "walks").
- Shared fixture built: `concepts/fixture/make-fixture.py` →
  `fixture.json`. It has 27 real Reykjavík places, 3 moments (day0 / halfway
  13 visited / lastDay 24 visited with the 3 left all starred), and 3 frames
  (near z14 solo, mid z13 with 3 clusters, far z11 with 4 clusters + 3 far
  pins) in a 390x545 map viewport. Clusters use the app's
  `clusterCellPxForZoom` grid-snap. Selected = id 2 (★ done) and id 8
  (open). Plan "Saturday" = 5, 3, 12, 16, 21, 7. Edit the script, not the
  JSON.
- Visual pass 1: sketches in `concepts/sketches/`. Finding: at 24px only fill
  / value / shell / size survive. Proposed V1–V5; three voices.
- Director pass 1 steer: concepts **A Blaze, B Second run, C Shell off, D
  Sticker re-weighted**, one shared grammar (Printed / Inked by you / Line),
  a legend per concept with no channel used twice (the weather-map rule), and
  five owner questions batched with the concepts.

## Decisions so far and why

- Concepts differ in the state model and share one grammar (director),
  so the comparison has one variable.
- Tag = two states per segment (open / done). There's no signed-out column:
  origin/main's playground gives signed-out visitors a live guest session
  (6df733a). The guard instead: nothing may look like `--state-off-alpha`
  0.4 (the app's one "unavailable" look). That's a risk for B's tint and
  V5's ghost stamp.
- Cluster rule (my call, director may overrule): the star shows only for an
  open starred member, and weight follows "any open member". Today a cluster
  stars if any member is starred, visited or not, and it's always solid
  orange.
- Real OSM tiles are unreachable (proxy 403 on OSM, Carto, Stadia). Use a
  stand-in basemap in OSM-Carto colours, always labelled. Optional ask
  for the owner: one phone screenshot at z14–15 near Hallgrímskirkja.
- Local checkout is behind origin/main. Read current behaviour via `git
  show origin/main:index.html`.

## Director objections (to carry into checks)

A: hollow = "unchecked" reading, day-0 noise. B: reads "disabled", or "not
differentiated enough". C: a bare glyph reads as an OSM POI; rows get
heavier. D: still the darkest mark, and the check erases the category.

## Open questions

- Owner batch (director's 5): resting peel → transition OK? Is the row stamp
  part of "too strong"? Should visited still show its star? Leaflet zoom
  restyle or remove? May the sticker check become the category glyph?
- Mine: can a far pin be selected without a zoom-in? (matrix cell n/a if
  not). For A/C, does "dries up" reverse, since done carries less ink?

## Next

Wait for visual's grammar board and A–D matrices. Then for each concept:
fill in its legend and "how it works" (cluster rule, selection, motion), and
run the jobs check (§6 of pass 2) before the director scores. After a
concept is approved: the handoff's "How it works" section.
