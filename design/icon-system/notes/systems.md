# Systems designer notes: icon system

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
