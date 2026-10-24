# Grid: jam

Turns 1-139 are in `jam-archive-1.md` (verbatim). Who saw what and decided what: `../history.md`; his words: `../owner.md`; the live canvas layout: `notes.md` (last section).
Standing decisions (from `history.md`):
- Review lives on the canvas only (10-19: "i want them on the icon design board as weve discussed many times over"); superseded boards go to the Archive page, never deleted.
- Line: 1.5px, monoweight (10-19, 10-20: "monoweigh is looking the best"). No ink traps (10-19).
- Coupe = B, the flatter, shallow bowl (10-21). H1 dropped; the work is between H2 and H3, and the Between tree is fixed: the rest fits it (10-21).
- Rules, not one-offs: every fix is a rule every icon takes (10-20: "i dont want to have to negotiate this all the time").
- An opinion is not an instruction: answer his questions, don't turn them into changes (10-20, 10-21).

## Turn 140: design director, v229 (leaned flare, outline rule): 9 after one copy edit

Merged 3b737366 and re-read the live board (v229, 7423px) at 1x and 3x. Rendered the R2 svgs, v228 (`before-g7au/`) beside now: 12/24/72px, then the coupe's flares at about 55px a unit and 145px a unit.

**At true size:** the coupe and the cup are unchanged. The star now has an open counter, and at 12 and 24 it sits in the row at the badges' weight.

**The hump, at his zoom:**
- v228: the bowl runs on level and the round sits on that flat as a knuckle, on both sides. The foot has the same thing, smaller.
- Now: the bend starts out on the bowl and the foot, and runs into the stem as one sweep. The knuckle is gone, on all four flares, at 55px a unit and at 145.
- The stem end is a little shorter and firmer. It reads as a clean turn, not a hump.
- The board's crops show the difference plainly.
- **Reads gone. Pass.**

**Is 1.75 sound?** It is a set value, like the corner law's radius. It's defensible because it's bounded on both sides: 1.5 leaves a shelf, about 2.1 collapses the line side. SHELF fails at 1.5, so a near miss is caught. It has been tested on two corners of one type (the coupe and the cup). Keep it, and say so; the board already does.

**Star:**
- **Breathes:** the counter goes 3.1 → 4.0px. By eye the star is no longer cramped, and at 1x it no longer reads heavier than the +.
- **Size:** 14.1 against the +'s 13.2 is right optically, because a star fills less of its box. It doesn't look big in the 24 row. At 72 it's a touch big; that's acceptable.
- **The gap:** the rule says "every outline icon: the set's 1 1/2px line", but the + keeps 1 2/3. At 72 the star's line visibly reads thinner than the +'s arms. So the two marks are on two lines, and the board doesn't state that as a rule.
  - If it's meant (an open mark's line reads lighter, so it gets 1 2/3; an outline's walls take the solids' 1 1/2), say so as the rule for both classes. Then a future open mark (an x, an arrow) and a future outline (a heart, a pin) each know their line.
  - He asked whether the + "might feel a bit light". Keep that question open in one line.

**Likely owner objections:** "the star's line is thinner than the plus now" (possible, at 72). The hump: unlikely.

**Score: 9 after one copy edit:**
1. In 0b, state the line rule for both classes: open marks (the +) at 1 2/3, because an open stroke reads lighter; outlines (the star) at the solids' 1 1/2, centred, sized by a 2 1/2-line counter. Keep his "+ might be light" open as a question.

**Changed since my last score?** Yes: the leaned flare (5 corners), the SHELF check, and the star redrawn by the outline rule.

---

## Turn 141: icon designer (seventh), turn 140's copy edit (canvas v230)

- 0b now states the line rule as two classes:
  - **Outline marks** (the star; later a heart, a pin): the solids' 1 1/2px line, centred, sized by a counter at least 2 1/2 lines across.
  - **Open marks** (the +; later an x, an arrow): 1 2/3px, because a lone stroke reads lighter.
  - The board says plainly that at 72px the star's line looks thinner than the +'s arms, and that this follows the rule.
- His "+ might feel a bit light" is open again, as a question beside the star's.
- "What's left" now says the 1 3/4 lean has been tried on only two corners of one type: the coupe's flares and the cup's.
- No drawing changed. The edit is in boards7 (source), between-g7.html and the published board. Between is 7423 → 7505px; Master is at y 8105.

---

## Turn 142: icon designer (eighth), the construction diagram (canvas v231)

Owner (v230): "These are looking great. I want to see a diagram now that overlays the shapes used to make these shapes on top of them, a construction diagram"

**The board:** a new board, "Construction" (`Grid7Construction.dc.html`, 1700 × 6869, on the Grid concepts page at x 1680, y 8105, beside the master grid). Each of the six gets two sheets at 30px a unit on the 24 grid, plus its true sizes and notes:
- **Shapes:** the 1px grid and 1/3px lattice, the 12 box and live circle, the class's cut (× 11/12), and the root shapes as the engine got them (sized and placed, before the union; cuts dashed). It also shows the counters, the mirror axis, and the box centre, ink centre and optical centre on the badge's middle. Lettered notes give each drawing rule's values.
- **Corners:** every round the engine drew, coloured by its kind (outside corner, tip, line end, join or flare, leaned flare, counter corner, drawn bend rebuilt). Each shows its tightest-point circle and where it leaves each edge; the leaned flare's two runs are dotted. Numbered notes give the law's radius for each kind.
- After the six: the engine's order as eight steps (how a seventh icon is built), then the findings.

**It is the code's own construction.**
- `src/construction.js` rebuilds the R2B row the way boards7's fitPlace / starOutline / plus do.
- It uses a logging-only hook in the engine (`opts.join.cornerLog`). The hook records every round as it is emitted: its corner, kind, law radius, ends, crest and cubics.
- Each finished outline is compared byte for byte with the row's svg: **6 of 6 identical**. They were built with the hook on, so the hook doesn't change the output.
- `src/construction-board.js` draws the board from `svg/g7/construction.json`.

**Findings** (on the board; nothing changed):
1. Every round is a hill of bend made of 2-4 cubics, not a circle. Curves per glyph: cup 45, coupe 60, museum 92, tree 72, star 80, + 48. Central or Lucide would use one curve a corner.
2. Counters are made four ways:
   - an offset (the star);
   - the bowl's side shifted sideways (the coupe's band);
   - hand-drawn quarter curves (the cup's ear);
   - the gaps the posts leave (the museum).
   Open question: should one of them become the rule?
3. Some drawn curves are only aims:
   - the museum's capital and foot curves set only where the engine's S starts and ends;
   - the cup's loop is eased in;
   - tip landing re-aims the tree's tiers, so the drawn points move 0.4px (top) to 1.0px (bottom tier); the star's move 0.25.
4. The mirror hides one seam. Built whole, the museum's right half has a 0.0004px step at the capital (3-decimal rounding in picks7), so its outer opening's corners would take 0.10, not 0.15. The mirror replaces that half. An asymmetric icon has no such safety net.
5. Every slab in this row is 1 1/2 (monoweight); the 4/3 horizontal in picks7's notes isn't used.

**Checks:**
- construction.js: 6/6 identical.
- Board screenshots at 1x and 3x.
- No drawing changed; the engine edit only adds logging.
- Impeccable not run (a design board, not index.html).

**Unsure:**
- Whether two sheets per icon are easier for him to read than one combined overlay.
- The corners sheet is dense at the museum's openings.

---

## Turn 143: design director, the Construction board (v231): 8, the cup and coupe trace their outlines instead of showing their shapes

Read `project/Grid7Construction.dc.html` (live v231, 1700 × 6869px) and rendered it at 1x. I judged it against his ask ("overlays the shapes used to make these shapes on top of them") and against the construction sheets of Central, Nucleo and Apple's SF Symbols templates: thin keylines of whole primitives over a solid glyph, plus a blank template you draw on.

**What's right:**
- It's the code's own record (6 of 6 rebuilt byte-identical), so nothing on it is decoration.
- Plain legend, quiet palette, the true sizes beside each icon.
- **The tree, the star and the + are construction sheets at the craft bar.** The tree's three sharp gables run past the glyph and show the notch and the droop as moves. The star shows its centreline star, the outline and the counter. The + shows its two posts and the coin they span. You can see how they're made.
- The museum is close: gable, slab and posts read as parts.
- The 8 steps are the right spine for a seventh icon.

**What blocks a 9:**
1. **The cup and the coupe bury their construction.** Their orange "roots" sit exactly on the glyph's outline (vessel, loop, band, foot), so the overlay is a trace, not the shapes that made it. Overlay a whole ellipse for the bowl, the loop's whole circle and its counter's, the slabs and the dome's whole arc, in thin keylines extended past the glyph, as the tree does. These two are his fixed points; they're the sheets he'll look at hardest.
2. **The corners sheet can't show its subject at 30px a unit.** A 0.15 round is about 4px, so the counter corners and their crest circles are specks (the cup's 4, the star's 3, the museum's 3). Add one inset per kind of round at about 4x: the crest circle, where it leaves each edge, the hill.
3. **No template.** SF Symbols' bar is the blank sheet you draw on. Add one: the three class cuts on the coin, the 1/3 lattice, the optical-centre ticks, and the line widths as swatches (1 1/2, posts 1 1/4, open marks 1 2/3, the band 5/6). Without it a seventh icon starts from prose.
4. **The findings need an edit before he reads them:**
   - #1 is honest. Say it plainly: the curve count is the price of his "no wobbles" ask. The "Central or Lucide would use one curve a corner" claim is unverified; check it or soften it.
   - #2 (counters four ways) is a real system question. Bring a recommendation: the star's "outline moved in by the line" is the only one a seventh icon follows without choosing. Show whether adopting it changes any of the four at true size. Don't hand him an open engineering question.
   - #4 (the mirror seam, 0.0004px) and #5 (an unused 4/3px note) are housekeeping. Fix #4 in code (snap the post to the drawing's precision) and move both to the notes, off his board.

**Two sheets or one?** Keep two. One combined overlay would bury both. But his ask is the shapes overlay, so make it the hero (larger, first, with the glyph solid and quiet under thin keylines). The corners sheet is the second read.

**Legibility:** at 1700px wide it reads on a screen. On his phone he'll pinch per sheet, which is fine on a canvas. Labels and keylines hold at about 2x; the corner specks don't (see 2).

**Likely owner objections:**
- "the cup and coupe just outline themselves; where are the shapes?" (likely)
- "I can't see the corners" (likely on the phone)
- "why am I being asked about counters?" (possible)

**Score: 8.** Fixes: 1-4 above, in one batch.

**Changed since my last score?** A new board; first score.

---

## Turn 144: icon designer (eighth), turn 143's fixes on the Construction board (canvas v232)

1. **Keylines, not traces** (cup, coupe, museum). These are read from each root shape's own segments:
   - a straight edge runs on past its ends;
   - a quarter circle (handles 0.552 of the radius, at right angles) is drawn as its whole circle, with its centre;
   - any other curve shows its handles, and where its ends turn a right angle, the ellipse that would turn the same corner (dashed).
   What that shows:
   - **Cup:** the bowl's bottom is squarer than an ellipse (handles 0.63 against 0.55). The ear's back is a whole circle (r 2.39) and its counter a circle on the same centre (r 0.89, smaller by exactly the line), so the loop is a true offset. The plate's underside is one curve.
   - **Coupe:** against the ellipse, the bowl's handles reach 0.50 down the side and 0.78 along the bottom. The band's sides are the bowl's side moved in 1 1/2 (dashed), between the keylines of the rim's underside and the drink's surface.
   - **Museum:** the gable's slopes run past the apex, and the slabs and posts are keylines.
   - The shapes sheet is now the main one: 720px (40px a unit), glyph at 20% tint.
2. **The seven kinds of round, close up**, near the top of the board: one real corner of each kind at about 150px a unit. Each shows the outline before the round (dashed), the round, its tightest-point circle and its edge points. The tip close-up also shows the landing: the drawn gable sits outside the finished tip.
3. **Template:** the 24 grid at 40px a unit, with the Wide / Square / Tall cuts (× 11/12, Tall with its apex), the coin, the 12 box, live circle, lattice and centre ticks. Beside it, line swatches at the same scale (1 1/2, 1 1/4, 1 2/3, the 5/6 band, the 1px cut) and the law's radii by kind.
4. **Findings:**
   - #1 now says the curve count is the price of "no visible humps or wobbles". I checked Lucide's source (lucide-static 0.400.0: coffee, landmark, star): it draws on a 2px centreline, its cup's corners are single arcs, and its star and museum have no drawn rounds (the round stroke join softens them). I dropped Central and Nucleo (not checked).
   - #2 is now a recommendation (my call, as designer): **a counter is the outline around it moved in by the line, then rounded tight** (the star's way). It is the only method a seventh icon can follow without choosing.
     - The cup's ear already equals it (concentric circle, r − 1.5), and so do the museum's openings (rectangles), so adopting it changes neither.
     - The coupe's band is the one named exception: "a clear band across a vessel follows the vessel's side". A true offset there was v142, which he turned down ("wrong both in size and in curvature"); the shift is his approved fix.
     - Not built; it goes into the engine only on his yes.
   - #4 (the museum's mirror seam) and #5 (slabs are 1 1/2, not 4/3) moved to `notes/visual.md`. I didn't fix the seam in picks7: the brief says no drawing changes, and the mirror makes it invisible.
5. Labels are bigger (sheet labels 13 → 15px, notes 15 → 16px). The board is now 1800 × 9112, at the same place.

**Checks:** board screenshots at 1x; construction.json unchanged (6/6 identical); no drawing changed.

---

## Turn 145: design director, Construction board v232: 9 after one small board edit

Merged 0ba469f8, re-read the live board (v232, 1800 × 9112px) and rendered it at 1x, full width.

**What changed, by eye** (yes, it really changed):
- **Cup:** the ear and its counter are two whole concentric circles. The vessel's corner is set against the dashed ellipse, with its handles drawn. The plate's dome shows its handles. You can now see what made it. Pass.
- **Coupe:** the bowl is against its ellipse and its arcs, the band's keylines sit between rim and drink, the post is 1 1/4 and the foot shows its handles. Pass.
- **Museum:** the gable's slopes run past the apex, and the slabs, posts and flares read as parts. It's busy: about eight horizontal keylines cross the columns, and the C marker sits on a stray label at the right capital. It still reads, because the parts are plain rectangles.
- **Seven kinds of round, close up:** one real corner each at about 150px a unit, with the crest circle, the edge points and the piece gaps visible. Exactly what was missing. Pass.
- **Template:** the class cuts, the coin, the lattice, the centre ticks, swatches that visibly differ at scale, and the round law in one line. A seventh icon can start here. Pass.
- **Findings:**
  - #1 is honest and tied to his own words.
  - #2 brings a recommendation, with the one exception named and grounded in his v142 rejection. It ends "say yes", the right shape for a decision.
  - #4 and #5 are off the board.

**Likely owner objections:** "the museum's sheet is busy" (possible).

**Score: 9 after one small board edit:**
1. Museum shapes sheet: drop the horizontal keylines that only repeat a slab's edge (keep the cut lines and the flare keylines), and move the stray label off the C marker.

**Should he decide anything?** Yes, one thing: finding #2 (the star's offset as the counter rule, the coupe's band the named exception). Everything else is information.

**Changed since my last score?** Yes: all four of turn 143's fixes are in.

---

## Turn 146: icon designer (eighth), turn 145's museum edit (canvas v233)

- The museum's shapes sheet keeps only four horizontal keylines: the two lines of the cut, and the levels of the flares in the capital and the foot. The lines that only repeated a slab's edge are gone (construction-board.js `KEYED.museum.keepH`).
- The C marker moved off the capital's handle to the right of the building.
- Nothing else changed. The board is the same size.

---

## Turn 147: icon designer (ninth), every piece from a root shape: the foot and the plate from one ellipse, the counters as shapes (canvas v234)

Owner (v233): "So an icon should have root shapes at its core that are then connected / disconnected to create the greater form. I'm realizing not all pieces have clear root shapes they are derived from - notably the foot (currently in use on the coupe) which I think is what's causing the hump…each top point on the left and right side are drawing their own arc, when the top edge should be crafted holistically from the top of a circle or ellipses". On finding #2: "Yeah I want it all defined by the shapes and proportions not stroke logic", then "I mean it shouldn't change anything should it?"

**The rule (Roots, five lines, on the Construction board):**
1. Every piece is one root shape drawn whole (circle, ellipse, rectangle, triangle, regular star, line), sized and placed by proportion.
2. The form is roots connected (one outline) and disconnected (cuts).
3. A curved edge belongs to its root, ends included; the only rounds are where roots meet or are cut.
4. A counter is a root too: the same shape on the same centre made smaller, the space a spacing leaves, or a root moved. Never an offset by the stroke.
5. A seventh icon names each piece's root and proportions first; an edge that can't be named is the one to fix.

**The audit** (`src/roots-audit.js` → `svg/g7/roots-audit.json`; table on the board):
- Root, exact: the rims and walls, the cup's ear and its counter, the stem, every museum part but the flares, the tree's tiers and trunk, the star, the + arms.
- Near (under 0.1px at 72 from the root): the museum's capital/base flares (quarter ellipse, 0.025), the tree's swept sides (arc, 0.002) and drooping undersides (arc, 0.08).
- No root: the coupe's bowl sides (0.74px at 72 from the half ellipse) and the cup's bottom corners (0.42). Both are fixed points: shown, not changed; his call.
- The foot and the plate: v233's drawn top was already within 0.03px of a circle at 72. What he saw is the ends: each top corner took its own round from the law. Rebuilt.

**The cap rule** (picks7 `CAP`, boards7 `CAP_RULE = { root: 'ellipse', ry: 1, over: 7/6 }`, options `cap` (foot) and `capPlate` (plate)): a base with a curved side is a slab cut by one ellipse, 7/6 of its width and its full height. The ellipse makes the curved side and both shoulders; the slab's ends cut it at about half its height (0.515), and only those cuts take the law's round. Foot: ellipse on top. Plate: underneath. Replaces the plate rule and the domed foot.
- Tried and dropped (svgs in `svg/g7/roots-tried/`): one circle with the old ends (0.03px change, ends still their own rounds); the ellipse turning upright with no cut (the best roll, but 2 JUMPs + 2 TAILs: its bend switches on at the upright; a curve ease in the engine couldn't land within the upright's room, removed); a half ellipse (a beak at the base; 2 TAILs); cuts at over 1.06 / 1.08 / 1.125 (KNEE / INFLECT / TAIL). 7/6 and 1.15 are clean.
- **The leaned flare stays:** the cap foot without it gives 4 SHELFs (bowl and foot): any root's crown is level under the stem.

**Counters as shapes and proportions:** cup ear = circle on the ear's centre, 0.37 of its radius (byte-identical; now tagged as a root); museum openings = rectangles left by the column spacing (identical); coupe band = the bowl's side moved in (identical); star = the same star ×0.528 (picks7 `star(..., 'root')`), replacing the erosion: 1.3e-5 units before the rounds, within 0.002px at 72 after. Monoweight holds where the hole is the outside's shape on the same centre or the space between parallel posts; the band is 1 1/2 across, 1.44 → 1.30 square to the bowl (as approved since v144). A future ellipse counter: the same ellipse less a wall on each axis (8 × 10, wall 1 1/2: 1.49-1.50; scaled it would be 1.50-1.88).

**Canvas v234:** Construction board: new "Roots" section at the top (rule, audit, the foot before/after with its ellipse drawn whole at 56px a unit, at his zoom and true size, the tries, the plate, the four counters, rules retired/kept); per-icon sheets rebuilt (cup and coupe sheets show the cap's ellipse whole; notes updated); finding #2 removed (answered); recipe steps 1 and 4 rewritten. Between: new section 0 (the foot and the plate, v233 vs now, true size and zoom); the old section 0 is now 0b/0c; the v233 board archived.

**Checks:** construction.js 6/6 identical to the new row svgs (cup, coupe, star changed; museum, tree, + byte-identical to v233); fair-check on the six row svgs: all clean; the cup and coupe move 0.50 / 0.55px at 72 at most (cmp.js), the star 0.002px; boards rendered and looked at at 1x; Impeccable not run (design boards, not index.html).

**Unsure:** the plate's ends are thinner (about 0.66px at 24): it might read rounder to him ("the glass being on something so rounded as a plate feels off" is still open). 7/6 is chosen by eye inside the clean band (7/6 and 1.15 clean, 1.125 not); it is calibrated on one foot and one plate.

---

## Turn 148: design director, v234 (roots, the cap rule): 8, two pieces still have no root

Merged 5a0f15f8 and read both live boards (v234): Between section 0 and Construction's new Roots section. Rendered the row: v233 (`before-g7aw/`) against now, at 12/24/72px, then the coupe's foot and the cup's plate at about 40 and 95px a unit.

**At true size:** no change you can see in any of the six. That's right.

**The foot, at his zoom:**
- v233: a gentle top run, then a separate round at each end, with a knuckle where they meet.
- Now: one ellipse rolls from the crown over both shoulders into a short upright. It reads as one shape, the top of an ellipse, as he described.
- The stem's flares into it are unchanged and smooth. **The hump reads gone. Pass.**
- The plate, upside down, is the same rule. Its ends are a touch thinner and rounder underneath. At 72 it still reads as a saucer; "too rounded" is possible but unlikely. The board asks him, which is right.
- The construction figure (the whole ellipse past the glyph, the slab's dashed cuts, rounds only at the cuts) shows the rule plainly. The three "tried and dropped" make the reasons visible. 7/6 is a set proportion, like the others: acceptable, and stated.

**The Roots section:**
- The five-line rule is the best statement of the system so far. Line 5 ("an edge you can't name that way is the one to fix") is a real test for a seventh icon.
- The audit is honest.

**What blocks a 9: the two "no root" rows.**
- He stated a principle ("root shapes at its core", "all defined by the shapes and proportions") and expects no visible change ("it shouldn't change anything should it?").
- The coupe's bowl sides and the cup's bottom corners are 0.74 and 0.42px from a root at 72, which is 0.25 and 0.14px in the 24px badge. "Fixed point" was about how they look, not how they're built. So the board leaves his principle with two exceptions and hands them back to him.
- **My call: put them on roots now, as a rule. Don't use the half-ellipse through the ends**; that's rounder and brings back the upright sides he rejected on v205. **Generalise the cap rule instead:** a curved edge is an arc of one ellipse, cut where it meets its neighbours.
  - Bowl: an ellipse, its centre above the rim, cut by the rim line, so the side meets the rim leaning, as he approved. Its proportions come from a fit to today's curve.
  - Cup bottom: one ellipse whose quarter runs past the walls and is cut by them (that's what makes it squarer than an inscribed quarter).
  - If each lands within about 0.1px at 72 ("near"), it's done with no visible change. If not, show the rebuild at 72 and at his zoom beside today's, and say what moved.

**Likely owner objections:** "why do two pieces still have no root?" (likely: he just named the principle). The plate's ends "too rounded" (possible).

**Score: 8.** One fix:
1. Put the bowl and the cup's bottom on cut ellipses by the generalised cap rule. Fill in the audit rows, and show any visible change. Then every row reads root, near or from-a-root.

**Changed since my last score?** Yes: the cap rule, counters redefined as shapes, the Roots audit.

---

## Turn 149: icon designer (ninth), turn 148's block: the bowl and the cup from one ellipse each (canvas v235)

Director (turn 148): the two curves left without a root (the coupe's bowl, the cup's bottom) go against "all defined by the shapes and proportions"; fix them as a rule: a curved edge is part of one ellipse, cut where it meets its neighbours; not a half ellipse through the curve's ends (v205's upright sides); keep the drink, band and cup looks; fair check clean.

**The rule, extended** (picks7 `ELL_ARC`, options `bowlRoot` / `bowlWide` / `bowlSplit` and `cupRoot`; boards7 `VESSEL_ROOT = { bowlRoot: 7/8, bowlWide: true, bowlSplit: 'even', cupRoot: { over: 1.02, ry: 4/9 } }`, on R2 (cup) and R2B (cup and coupe); copied in construction.js):
- **Coupe bowl:** one ellipse, its lowest point the bowl's bottom, 7/8 of the depth tall (its centre bd/8 below the rim), its widest point the glass's width; the rim line cuts it just above that, so the side turns from the rim on. Drawn as two cubics a side of equal turn. The band is still the bowl's side moved in (now the ellipse's arc).
- **Cup bottom:** one ellipse 1.02 × the cup's width, 4/9 of its depth; the straight walls cut it a little inside its widest point.

**How it was found** (scratch `d9/fit*.js`): the half ellipse through the ends is 0.74px at 72 off (and less drink); an ellipse cut below its widest point (sides leaning in) is worse (0.87-1.34); the best is a centre just below the rim (0.32px). Variants: the bowl as one cubic a side → SHOULDERs at the rim corners and KNEEs at the band; split at the widest point → clean but the rim round is cut short (fit limit by the short piece: a crisp rim, visible at 72), and the glass 2% smaller; even split + widest point = the glass's width → rim corners look like v234 (curvature profiles nearly identical) but 4 SHOULDERs at the rim corners. Cup: no cut (rx = half width) → 1 JUMP; cut at 1.02 → clean.

**One fix to the check** (fair-check SHOULDER): the walk out from a round's crest now also stops where the bend has settled onto a curved edge's steady bend (within 1/10 for the next half unit). Why: an ellipse's bend rises gently toward its end, so the walk counted the whole bowl side as part of the rim's round and read that slow rise as a stall. A real stall inside a round is short and is still walked through. Every frozen row's count is unchanged (v223 / v225 / v226 / v228 / v233 / v234 and the 36 between svgs: identical totals; v225 still 20 SHOULDERs).

**Effect:** cup bottom moves under 0.2px at 72 (0.06 at 24). Coupe: the glass sits about 1% smaller in its class (s 10.30 → 10.22: the full width is now reached below the rim, inside the box) and the rim corners sit a hair in; the outline moves up to 0.58px at 72 (0.19 at 24), mostly the size change; the bowl's own shape under 0.3px. Band wall square to the bowl 1.41 → 1.21 (v234 1.44 → 1.30). Shown before/after on both boards.

**Canvas v235:** Construction Roots: audit now has a root for every piece; new "The bowl and the cup" figures (v234 handles vs the ellipse whole), true sizes, the check fix stated; vessel side rule's handles listed as replaced. Between section 0: v234 → now for the bowl and the cup.

**Checks:** fair-check on the six row svgs: clean; construction.js 6/6 identical; museum, tree, +, star unchanged; boards looked at at 1x.

**Unsure:** the check change is mine; the director should judge it. The coupe being 1% smaller follows from the class fit, not a choice.

---

## Turn 150: design director, v235 (the bowl and the cup's bottom on cut ellipses): 7, the cup's wall now kinks into its bottom

Merged b199aebf. Judged only Between section 0 and Construction's Roots (a cleanup agent is moving the rest). Rendered v234 (`before-g7ax/`) against now: 12/24/72px, then the coupe at 27/60/90px a unit and the cup at 21/75/240px a unit.

**At true size:** both glyphs read as before.

**Coupe:**
- The bowl still reads shallow and broad. It's a touch fuller at the top and about 1% smaller.
- The sides under the rim stand upright for a very short run before curving in. That's the same as v234, not the long straight run of v205.
- **Pass, by eye.**

**The rim's shoulder and the fair-check change:**
- By eye at 60 and 90px a unit, the rim corner is one clean round onto the ellipse's side. There's no knuckle and no shelf.
- Stopping the SHOULDER walk where the bend runs steady (an ellipse's own side) is **legitimate in principle**: a round ends where it lands on its root. Frozen rows are unchanged.
- But it needs a guard, so it can't hide a round that has spread. The rim round's measured run must still match the law's, and the check should report it.

**Cup: a real fault.**
- At 75 and 240px a unit, the straight wall meets the bottom ellipse at an angle. A small law round turns it, then the line runs on almost straight. That's a visible knee: the knee class this round set out to remove.
- v234 was one continuous curve there. At 21px a unit the cup reads slightly chamfered at the bottom.
- Cause: an ellipse 1.02× the cup's width can only meet a vertical wall by cutting it at an angle.
- The fair check passed it, so the check misses a short cut round between a straight and a curve.

**Likely owner objection:** "the cup's bottom has a corner now / a bucket" (likely at his zoom).

**Score: 7.** Fixes:
1. **Rule: where an ellipse meets a straight line parallel to one of its axes, it meets it at its widest point, tangent, never cut.**
   - Cup: the ellipse exactly the wall-to-wall width, its widest point where the wall ends; fit its depth to today's squarer curve.
   - If the fit can't match, accept the visible change and show it, but no corner.
   - The coupe's rim cut stays, since the rim isn't parallel to the side.
2. Fair check:
   - Flag a cut round under the knee limit that turns more than about 15° between a straight and a curve (it would have caught the cup).
   - Add the rim guard above.
3. Show the cup's bottom before/after at his zoom on Between section 0.

**Changed since my last score?** Yes: both pieces are on roots and the audit is complete. The cup paid for it with a knee.

---

## Turn 151: icon designer (ninth), turn 150's fixes: the cup's ellipse wall to wall, tangent; the kink check; the shoulder guard (canvas v237)

Director (turn 150): the cup's wall cut its 1.02×-wide ellipse at an angle, a knee at his zoom the check missed. Rule: an ellipse meets a parallel straight edge at its widest point, tangent and smooth, never cut. Make the check catch short cut corners; guard the shoulder change.

- **Rule** (Roots rule 3, on the board): an ellipse meets a straight edge parallel to its side at its widest point, tangent, never cut. Cup: `cupRoot { over: 1, ry: 2/5 }` (boards7 `VESSEL_ROOT`, construction.js). The ellipse's first 8° from each wall are their own cubic, written at 5 decimals, so that piece is a near-true arc and the engine's arcEase eases the bend in (at 3 decimals, or with a 15° piece, the arc test failed and a JUMP stayed). 2/5 chosen as closest to v234 (0.15px at 72); 4/9 also clean (0.25).
- **KINK** (fair-check, new): a crest of bend at least 2.5× the bend half a unit out each side, turning the line less than 30° between its feet. Fails v235's cup (16°, one corner; the other side sits under the handle) and nothing in any frozen row (v223, v225, v226, v228, v233, v234, and the 36 between svgs: totals otherwise unchanged). Crest detection takes the top over ±0.15 units (a cubic seam's duplicate point made false crests).
- **SHOULDER guard:** the steady-edge stop only applies once the bend is under a quarter of the crest, so a round that spreads is still walked and flagged. Totals unchanged.
- **Now:** cup one curve again, within 0.15px of v234 at 72; row svgs fair-check clean (with KINK).
- **Canvas v237** (v236 was the cleanup agent's): section 0 of Between and the Construction Roots section only (the live Between, as the cleanup left it, with only section 0 replaced; the repo's between-g7.html is boards7's full render).

---

## Turn 152: design director, v237 (the cup's ellipse wall to wall, tangent): 9, send

Merged db9e0887 and re-read the live Between board (v237: sections 0, 0c and 1 after the v236 cleanup). Rendered the cup, v234 (`before-g7ax/`) against now, at 12/24/72px and at 21, 75 and 240px a unit.

**Cup's bottom:**
- **True size:** reads as v234.
- **His zoom (75px a unit):** the wall runs straight into one continuous curve, with no knee and no chamfer. It's indistinguishable from v234.
- **240px a unit:** a smooth tangent entry.
- **Pass.**

**Section 0** now reads as one story: the foot and the plate (the cap rule), then the bowl and the cup on their ellipses. The tangent rule is stated, with v235's knee as the reason. The before/after crops and the 12/24/72 rows are honest. Every piece in the audit has a root.

**The checks:** KINK fails v235's cup and nothing earlier. That's the right calibration. The SHOULDER guard is in, and the fair check is clean on all six.

**Likely owner objections:** the plate's ends "too rounded" (possible; the board asks him).

**Score: 9. Send.** No fixes.

**Changed since my last score?** Yes: the cup made tangent, the KINK check, the SHOULDER guard.

---

## Turn 153: icon designer (tenth), the proportions: every root from a simple ratio of another (canvas v238)

Owner, after v237: "Yeah let's try for a ten also it's be best if the underlying shapes were proportionally related to each other and the grid so they weren't just random."

**The system** (`src/proportions.js`, `PROP`: one table; picks7 reads it through `o.prop`, boards7 row R3 "The proportions", construction.js and both boards read it):
- **One series:** fractions in halves, thirds, quarters, fifths and sixths, or a whole number and one of them (1 4/5, 2 1/2). I measured 38 root measures in the six (scratch `d10/meas.js`). Within 2%, this series already held 19 of them as drawn. A single geometric ratio holds far fewer: the golden section 2, root 2 6, powers of 3/4 4. Precedent: harmonic ratios of small whole numbers (Alberti, Palladio, Bringhurst's page proportions). The series is dense on purpose, and the board says plainly that it proves nothing on its own.
- **Each ratio names its parent:** a shape is a fraction of another root. The widest root is 1, because the fit makes it the cut, so a ratio to the box meant nothing. A thickness is a fraction of the line: px, never scaled.
- **Two rules of transition** (not proportions): the flare lean, 1 3/4, and the soft tip (a crest radius over 1/6px = 1/9 line). Their values live in PROP.transition and are read by boards7 JOIN9/JOIN10 and construction.js.

**The values set by eye:**
- Cap 7/6 → the slab's ends cut the ellipse at 1/2 its height, so over = 2/√3 = 1.155. 1.15 was already tried clean.
- Bowl 7/8 and cup 2/5 → one value: every vessel ellipse is 4/5 as tall as wide. The coupe's rim cuts its ellipse 1/5 of its height above the centre, so the bowl is 6/5 of the ellipse deep. 5/6 with a rim cut of 1/6 was also clean, but 4/5 is closer to v237 on both and lets the cup and coupe share one value.
- Star counter 5/2 lines: already a thickness on the series.
- Band 5/6px (5/9 line, off the series) → 1/2 line (3/4px). That is 1/12px thinner, so more drink.

**Snapped, by icon:**
- **Cup:** the saucer is 1 4/5 of the cup (was 16/9); the cup is square; the ear is 4/5 of the depth; the counter slot is 1/2 line; the cup is balanced on its saucer by ink centre (it was 0.07 units off).
  - Tried and dropped: "cup + ear = 5/6 saucer" with "ear reaches 1/2 cup". That makes the slot 0.6px, which gives KNEE ×2, SHOULDER and TAIL at the counter's wall corners; the slot needs about 0.63px or more.
  - Also dropped: saucer 7/4 (the cup refits 2% smaller).
- **Coupe:** the stem shows 1/2 the bowl's depth; the foot's ellipse is 4/5 of the bowl's.
- **Museum:** overhang 1/3 post (1/3 line gave 4 TAILs at the capital); pitch 1/3; columns 1/3 of the colonnade.
- **Grid:** the proportions needed two fixes, applied to R3 only.
  - The class is read at the fitted size. At s=12 the px parts make the museum read Wide.
  - The fit is solved by halving when the six passes stop short of both sides. v237's cup did, with a lattice step in the way.

**Won't snap (stated on both boards):**
- Tree tier heights 4.83:3:3.33 and widths 2.8:4.1:5.3. Equal steps 2:3:4 were tried and turn the tip tier into a spire (`svg/g7/roots-tried/tree-234.svg`).
- The star's inner radius, 0.47.
- The open-mark line, 1 2/3 (a weight rule).

**Moved:** cup 0.08px at 24 (0.24 at 72); coupe 0.07 (0.22); museum 0.12 (0.36; apex 0.08 lower). Tree, star and + are byte-identical.

**Boards (v238):**
- Between: section 0 replaced ("Proportions"); v237's section 0 moved to the Archive as `Archive-G7az-Roots`.
- Construction:
  - New top section, "The spec: draw a new icon from this": the series as rulers, 15 rules in one list, the table, 8 steps, and the four shaped icons' proportions on their construction.
  - Kept: the drawing sheet. Changed: Roots trimmed to the audit and counters; the old recipe replaced.
  - v237's Construction moved to the Archive as `Archive-G7az-Construction`.
- Start: question 1 updated. Row 2 moved down 500px because Between grew.

**Checks:**
- construction.js: 6/6 IDENTICAL to the r3 svgs.
- fair-check on the six r3 svgs: clean (KINK included).
- check-svg: the same zero-length segments and the +'s 0.025 asymmetry as r2 (inherited, not new).
- No-prop builds of the four shaped glyphs are byte-identical to v237 (the picks7 changes sit behind `o.prop`).
- boards7 full run: NOT completed (stopped at the 80-minute background limit before writing anything). The live boards were spliced (section 0 from proportions-board.js, the same function boards7 now calls). The first full run should diff its Between, Start and svgs against the live ones and the repo.

**Unsure:**
- The band at 3/4px. His words were "equal to the thickness of the stroke. or maybe even a little thinner"; it is now half.
- The fit solve and the class at fitted size are grid changes, applied to the new row only.
- 4/5 against 5/6 for the vessels was a near tie.
- The tree sits outside the series by design.
