# Batch 2: three ways to give the eight personality

Product designer (visual + systems), 2026-11-03. On the eight shown on canvas v295 (camera, Ferris wheel, curtain, bed, bag, picnic table, houses, walker).

## His words (verbatim)

> i think we need to iterate on ways of drawing them that give more personality -- they look very rigid and simplistic, no subtle details.

Standing: personality comes from the subject chosen and from how it's made ("made by a tool", machined rounds and joins), plain like signs and tags; no swoop, no bracket, nothing "cheeky"; "what it looks like is more important than letter of the law"; rules are general, never written for one icon.

## What gives the approved five their life

Each one has a part that isn't a rectangle and a relation that isn't flush:
- **The cup:** the ear (a loop) and the saucer's curve (a slab cut by one ellipse).
- **The coupe:** the flared bowl (an ellipse), the drink band (a cut inside the mass) and the stem flaring into its foot.
- **The tree:** tiers whose sides bow and whose undersides lift.
- **The museum:** the bevel where the beam overhangs its columns.
- **Fork and knife:** the knife standing past its handle.

In batch 2, by contrast, six of the eight are built from plain blocks, slabs and straight posts that meet flush. The three approaches go after three different gaps:
- **A:** the contour (the line between a part's ends).
- **B:** the second-order detail.
- **C:** the relation between parts.

## How they were found (real draws)

`secrets.randbelow` gave three Oblique Strategies, each paired with an unrelated field:
- "Decorate, decorate" + typeface ink traps and spurs. In type, personality lives in the line's own swelling and in its terminals (ink traps are banned here). That became **A**.
- "Look closely at the most embarrassing details and amplify them" + luggage-tag die-cutting. These are the small tells we've been leaving out, made as cut or added detail, the way a tag carries its eyelet. That became **B**.
- "Look at the order in which you do things" + stamped postage perforations. Making works in a set order: stock, then overhang, then edge. Every approved icon has the overhang step. That became **C**.

## The approaches

Each is a small set of declaration words in `grid/src/system-detail.js`, read by the maker `grid/src/system-make.js`. Nothing names an icon. A root that declares none of the words is drawn exactly as before.

### A: Contour (turned and pressed stock)

**Rule:** the line between a part's ends is the part's own curve, as a press or lathe would leave it. This is the move behind the saucer, the coupe's bowl and the tree's tiers.

| Word | What it does |
|---|---|
| `crown: {face: top, rise}` | A slab's or block's top is drawn from one ellipse, rising `rise` lines (the cap rule turned up). |
| `crown: {face: ends}` | The part's two ends are half ellipses. |
| `belly` | A flat-based vessel's walls bow out. |
| `taper` / `flare` | A splay's posts, or a drape's fall, widen or narrow towards their free end. Standing legs flare to the ground, as the coupe's stem does into its foot. A figure's limbs taper. |
| `ends` | A gable stands on upright ends (the museum's). |

**On the eight:**
- **Camera:** rounded ends (a rangefinder) and a crowned finder.
- **Wheel and table:** legs flare to the ground.
- **Curtain:** the falls flare at the floor.
- **Bed:** the mattress crowns, and the pillow takes the rounded ends.
- **Bag:** the walls belly.
- **Houses:** gables on upright ends.
- **Walker:** limbs taper.

**My read:**
- **Strongest:** the camera (it finally looks like a camera, not a box with a hole), the walker, the curtain.
- **Weakest:** the wheel and the picnic table, where the flare barely shows at 18.
- **Tried and dropped:** the tree's bow on house roofs (`bow`). The crest rule rounded the concave apex into domes and lids. The word stays in the vocabulary, but it needs a steep pitch.

### B: The tell (one detail drawn from memory)

**Rule:** each subject carries the one secondary detail a person would add if asked to draw it from memory. It is made from a few words, each clearing the protrusion or counter minimum, and closes at 12 where the size closes detail (as the cup's slots do).

| Word | What it is |
|---|---|
| `nub` | A disc or block added on a face or a post end, or a brim across a disc. |
| `band` | The coupe's band under a flat-based vessel's rim. |
| `door` | A cut from a block's base. |
| `cabins` | Discs hung straight down from pivots on a ring. |
| `seams` | Planks cut into a slab. |

**On the eight:**
- **Camera:** the shutter button.
- **Wheel:** six hanging cabins.
- **Curtain:** the stage lip under it (the existing slab).
- **Bed:** a bedpost knob.
- **Bag:** the folded top (the band).
- **Picnic table:** none. Its tell is its own A-frame.
- **Houses:** a door in each.
- **Walker:** a brimmed hat.

**My read:**
- **Strongest:** the bag's folded top (the best bag yet, and it reuses the coupe's own move), the doors, the shutter button, the stage.
- **Weak:** the bedpost knob is a joystick risk. The hat is charming, but check it against "cheeky".
- **Not working:**
  - **Wheel:** cabins on a ring still read as a ship's wheel or a gear at 18.
  - **Picnic table:** seams read as upright posts (3 planks), then as a "π" (2 planks), so it carries no tell.
  - **Curtain:** finials on the rail made a dumbbell, so the curtain uses the stage instead.

### C: The lip (the family move)

**Rule:** every icon has one part that runs past the part it meets by the protrusion minimum. This is the one relation all five approved icons share:
- saucer past cup;
- beam and plinth past the columns;
- each tier past the next;
- the knife past its handle;
- the coupe's foot past its stem.

There is one word, `lip`, and its effect depends on the part:
- a top lip (a slab a line thick across a part's top, running past it);
- a rail past the drapes it holds;
- a roof past its wall;
- a table top past its legs;
- a base past the feet on it;
- a figure's foot past its leg, in the stride.

Two general limits came out of building it:
- **A vessel's lip turns in.** A lip outside a rim made the bag a bin and the camera body a casserole, so on a vessel the lip is its band.
- **A lip stands only over a part at least 4 lines across.** Over the houses' 3-5px walls, eaves made arrowheads, so the houses carry none.

**On the eight:**
- **Camera:** a cap on the finder.
- **Wheel:** a base under its legs.
- **Curtain:** the rod past the drapes.
- **Bed:** a headboard cap.
- **Bag:** the band.
- **Picnic table:** the top runs past its legs.
- **Houses:** none.
- **Walker:** feet.

**My read:**
- **Strongest:** the wheel on its base, which for the first time reads as a ride standing somewhere rather than a crosshair or a helm, and the walker's feet (the old crossing-sign figure).
- **Quiet:** the rod and the table top, the same kind of quiet as the museum's bevel.
- **Weakest:** the bed's cap.

## A combination worth considering

The three don't conflict, so they could be combined as one rule each:
- **A:** contour on masses.
- **B:** a tell where the subject has one that clears its minimums.
- **C:** a lip as the family move.

A combination would be:

| Icon | From | Change |
|---|---|---|
| Camera | A | Rounded ends and crowned finder, plus B's button |
| Wheel | C | On its base |
| Curtain | A + C | Flared falls and the rod |
| Bed | A | Crown and pillow |
| Bag | B / C | The band |
| Picnic table | C | Top past legs |
| Houses | B | Doors, on A's upright gable ends |
| Walker | C + A | Feet and tapered limbs |

## Gates

- **Approved set byte-identical:** café, coupe, museum, tree, fork and knife (at 18, 24 and 12), plus the star and the + at 18, were rebuilt with the final code. Every SVG is unchanged, and the JSON differs only in build time.
- **System check:** `node grid/src/system.js check` (result in the commit message).
- **Not run:** the eight were not put through the system's checks, because they are concepts, not system builds.
- **Engine change:** in `engine.js`, a drawn root transformed twice now composes the two transforms instead of throwing. No approved icon reaches that path.
- **Readability at 18:** judged by eye from the true-size strip on each sheet. There has been no blind read yet; that is the next step before anything goes to the owner.

## Files

- **Declarations:** `batch2/personality/decl.js` (`TOOLS=<paper dir> node decl.js <A|B|C> [ids]`). Builds go to `batch2/personality/svg/<A|B|C>/18/`.
- **Words:** `grid/src/system-detail.js`. Hooks in `grid/src/system-make.js` are each marked with its approach letter.
- **Contact sheets:** `batch2/sketches/personality-{A,B,C}.png`. Each shows the eight at 18 in their badges beside the approved five, the v295 eight at the same size, and the 6x. Generator: `batch2/sketches/personality-sheet.js`.

## Open questions

1. Which approach, or which combination, should go to a blind read?
2. The Ferris wheel and its read: does C's base settle the subject question the director raised, or do we still bring other subjects?
3. At 24 and 12: only the 18s are built. A's crowns and B's tells need their 24s and 12s, and B's tells close at 12 by rule.
