# Brand and Shopping (round 4, 2026-10-26, canvas v263)

Board "Brand and Shopping" on the Grid concepts page (`Grid7Signatures.dc.html`, renamed from "Brand signatures"; round 3's board, v260, is on the Archive page). Generator: `python3 -I src/brand-shopping-board.py <live Grid7Now.dc.html> <out>`; Shopping drawings in `src/shop_shapes.py`; posts-at-the-line rebuilds in `svg/post-line/`. Still: `stills/brand-shopping-board.png`. History: rounds 1-3 (swoop/flare/press 6; weight + shadow 7; weight as two tests + the machined rule 7) are in git and the director's turns 173-177.

## The owner's words (verbatim)

On v260: "some of these are too cheeky. i do think the prior straightforwardness is part of the allure considering the source inspiration. i dont think the swoop is working. i do think i like the machined rules a lot -- and maybe that is stronger than defining the rounds by a shape.. it's by underlying method of creation. i think all of these things together speak to the brand. the bag i think is conceptually the problem -- the way we have added personality is by icon choice -- the bar coupe is one of the specifically good ones. whereas other systems used a simple wine glass or something, we went slightly left-of-center. i think the shopping bag works, but it may be one step too common?"

On the posts measuring 1.24-1.25px: "ok yeah i must be viewing these too big then -- nothing should go that thin."

## The brand, in his words (three filters)

1. **Plain.** Straightforward forms, as plain as the road signs and tags they come from. Nothing cheeky.
2. **Made by a tool.** Every round and join is what a cutter would leave (the machined rule). The method makes the shape, not a shape rule.
3. **Left of centre.** Personality comes from what we choose to draw: the coupe, not a wine glass.

Dropped: the swoop, Weight as a named signature, "no circles" as a test (it stays his open note), the museum's swelling sides, both bags.

## The machined rule

- **The rack:** three cutters, ⅛, ¼ and ½ px (each double the last). Every round is one of them. Changed from round 3's 0.15 / 0.3 / 0.6 because the trunk, the coupe's stem and the fork's neck are all 0.5 fillets (construction.json, and 0.50 measured on the drawn tree): the half keeps them exactly. Round 3's "trunk 0.42" was a misreading; the trunk was never 0.42.
- **Continuous curvature:** every round ramps in from the straight (the engine's fairing already does).
- **Which cutter, by join:** a post under an overhang = a chamfer, its edges broken by the ¼ (the museum's bevel); a post into a face (curved or flat) = the ½ fillet; a part's own corners = ½ on a mass, ¼ on a slab or post, ⅛ on anything thinner and on every cut. Points sharper than 75° (tips and the notches between them) keep today's tip rule: a point is broken, not milled.
- **Nothing thinner than the line** (owner, 10-26): no ink part under 1.5px. Posts and loops 5/6 → 1 line (`proportions.js` line.post, `mix-curves.js` T.post / T.loop). Cuts, counters and the coupe's band are not ink and are unchanged.
- **On the six:** the tree keeps its trunk exactly. Every other round moves at most 0.04px at 24 (the cup's top corners, 0.6 -> ½) (nearest cutter on a doubling scale, outline move = Δr (1/sin(θ/2) − 1)); computed in the generator from `svg/g7/construction.json`. The rack is not yet built into the engine: the rebuilds below carry today's rounds.
- Shown on the board: eight real joins at 50px a unit (café ear and cup corner, coupe stem into bowl and onto foot, museum capital chamfer and an opening, the tree's trunk, the +'s crossing) with the cutter drawn as a ghost; museum keeps its approved drawing and its bevel.

## Posts at the line (before / after)

Rebuilt by `construction.js` (coupe, tree, museum; `CONS_OUT` to scratch, stored in `svg/post-line/*.json`), `mix-curves.js` (fork and knife) and the bed through `mix-curves.js` with its headboard and leg at 1.5 (outer edges kept; `blind.json` still has the 1.25 parts). Flags:
- **Museum:** with four columns at 1.5, the three openings narrow from 1.31 to 0.93px, now thinner than the columns; the colonnade darkens at 24. Open: three columns (two wider openings), or a wider building.
- **Coupe and tree:** a touch heavier, as expected. The fork's ¾px gaps between 1½px tines read denser at 24.
- **Still under the line, not changed (outside this note):** the saucer's and the coupe foot's ends taper to 0.75px (the cap root), and the tree's tier tips. His call whether "nothing that thin" covers tapers.

## Shopping, left of centre (five concepts, finished, in the badge at 24 and 72)

Real random draw: awning, tissue-wrapped parcel, weighing pan, till roll, string bag, basket; fields sailing knots and botany; Oblique "Emphasize the flaws" (the bag's flaw is that it's common: lean into what's particular about shopping on a trip).

1. **Swing tag:** the price tag on its string; kin to the inspo's luggage tags and the app's Hanging Tag. String busy at 24.
2. **Market basket:** the market's basket, not the mall's bag; the safe pick. Risk: bucket at 24.
3. **Shop awning:** the striped awning over a shopfront; the most common (Material's storefront).
4. **Tied parcel:** a box tied with string, knot as two leaves; reads as a gift first.
5. **Till:** the old register with its sale flag; the coupe move (a particular vintage object over a generic one).

**Recommended:** the till, then the tag. Hand-built from the roots and the rack; no ink under the line. A blind "what is this?" read at 24 is still owed.

## Open questions (on the board)

1. The brand as three filters: is that it?
2. The machined rule with the ⅛ / ¼ / ½ rack (tree kept): build it into the engine?
3. Shopping: the till, the tag, or another?
4. Museum with posts at the line: three columns, or a wider building?
