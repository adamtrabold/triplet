# Shopping jam

See `../briefs/shopping-concepts.md`. Turns in order; each ends with `NEXT: <role> — <why>`.

## Turn 1 — product designer (systems), 2026-10-26

### The jobs first (full text in `jobs.md`)

- **Where and how big.** The badge is 24 but the drawing in it is **18px** (`badgeHtml()`: 2px rim, glyph 18). Selected: 24px, paper on lavender. Filter chip: **12px, bare** (not in the brief; it's a real size). Far zoom and visited pins show no glyph. Ink: lavender `#8A7AA8`, the weakest of the eleven (3.26:1), so shape has to do the work colour can't.
- **The most repeated mark.** 49 of 183 pins (27%). In a shopping street it's most of the map. It must stay quiet in a crowd: the bag of the last rounds was the darkest mark in the set, which is backwards for the commonest pin.
- **Told apart from:** the café cup (a handle is the same ring root in both), Museum and Landmark (any building), Venue (any paper slip), and UI meanings: padlock, briefcase, bell, gift, cart, wallet, and a tag (in this app a tag is the place's popup).
- **What the person is doing:** a free hour in a neighbourhood, scanning for "anything to browse near here", no labels, at 18px. Second: filtering for just shops at 12px. What's saved: records, ceramics, books, design (Svenskt Tenn), vintage, a farmers' market, Hornstulls Marknad. Something comes home with you.

### The draw (real randomness, `random.SystemRandom`)

Oblique: **"Look closely at the most embarrassing details and amplify them"**, **"Water"**. Fields: **semaphore, bell founding, Swedish runestones**. Twists: **something you hold in one hand; Nordic, not American; the ugliest honest answer**.

How I used each, seriously:
- *Embarrassing detail:* two of them. The bag's handle (he caught it differing from the cup's) and the category's name ("Shopping: shopping", the most generic word in the list). Amplified: direction A makes the handle question the subject; direction B answers the generic word with the most literal sign there is.
- *Ugliest honest answer:* the bag. The brief allows it back if we can say what makes it not "one step too common". Direction A is that attempt, kept honest as the control.
- *Water* (takes the shape of what holds it): the string bag, direction D.
- *Semaphore* (meaning by an arm held out at an angle) + *Nordic, not American*: the projecting shop sign of a Nordic old town (Gamla Stan, Malmö, Copenhagen's Strøget), direction B.
- *Something you hold in one hand*: the coin purse, direction C.
- *Bell founding:* the shop-door bell. Killed: a bell is notifications. Kept the method: a founder sizes the whole bell from one thickness (the sound bow). That's our 1.5px line; note for the rules, below.
- *Runestones:* ᚠ *fehu*, the first rune, literally "wealth, goods". Plain, Nordic, cut by a tool. Killed: at 18px it reads as an F.

### Five directions (they differ in kind: what Shopping *is*)

**A. The specific bag (the object, made particular).** Not "a bag" but one bag, the way the coupe is one glass: the gusseted paper shop bag of a design store or record shop, with its side folds. Its particular detail is made by the system's own move: the gusset is one **cut** at each top corner (a notch where the side folds in), so what makes it specific is a root operation, not decoration. Handle: a ring, the settled rule; the body hides the same share of it as the cup hides of its ear (the underlying shape of a handle is a ring partly hidden by what holds it). Risk: he may still see "a bag". The truest test of "can a bag be ours".

**B. The hanging shop sign (the place's sign, not its goods).** A blade sign hanging from a wall bracket, the old-town trade sign. Plain filter met literally: it *is* a sign. Built from a post (the bracket, an L of two posts), a slab (the board) and two links (rings: the handle rule, reused for hanging). Asymmetric, so in a crowd of symmetric glyphs it stands out by silhouette, not weight; it's also light (mostly line and one slab), right for the commonest pin. Risk: "a sign" in general, or a pub. Whether the board stays blank or carries a cut shape is the open design question.

**C. The coin purse (the act: paying, in one hand).** The kiss-lock frame purse: a mass body cut flat at the top, a slab frame, two bead clasps. Vintage and particular (the coupe move), no shackle so not a padlock, no top loop so not the cup. Risk: wallet, expenses, fashion; "spending" may be narrower than "browsing".

**D. The string bag (Water: shaped by what's in it).** The Nordic net bag. The mesh is made by cuts, so the holes are proportional root shapes by construction; one round thing inside could show it's carrying. Honest view: the weakest at a glance (a waffle, a basket at 18px), but it's the hardest test of the hole rule and the pixel round's 2px counters. Draw it to learn, expect to kill.

**E. Goods on the counter (the market stall, without the rejected awning).** A slab counter with three goods, one of each root kind: a jar (mass), a box (slab), a round (ring). The category's own words ("a shop or market stall") and the browsing job (many different things). Risk: a shelf, a kitchen; quietly self-referential (the system's roots for sale), which may tip into the "cheeky" he rejected.

Also killed, with reason: coat hanger (only vintage clothes; a cloakroom), shopping cart (online checkout), and everything already rejected (swing tag, basket, awning, parcel, till).

### For the rules (what Shopping could add, every later icon gets it)

- **The handle:** a handle is a ring partly hidden by what it's attached to; the share hidden is a proportion of the parent (halves to sixths). The cup's ear and a bag's loop are then the same rule with different shares, which answers "what's the underlying shape". B and C extend the ring to links and beads.
- **Weight by job** *(proposal)*: measure ink coverage of the six and set a band; the most-repeated categories sit at its light end. Shopping is the first icon where that matters.
- **The founder's unit** *(note only)*: every size a whole multiple or simple fraction of the 1.5px line. It overlaps the parallel pixel round; theirs to use or drop.

### Open, for the director (and the owner only if needed)

1. v264 "i do not like any of the proposed shopping icons" gave no reason. Directions B to E don't depend on it. A does: if he meant "no more bags", A dies. Worth one plain question if A survives the director.
2. Is 12px (the filter chip) a size he judges at? I'd test it anyway in the blind read.

### Strongest: B (the hanging sign), then A (the specific bag) as the honest control, C (the purse) as the wild card.

NEXT: product designer (visual focus) — give A to E their look at 18px beside the six, push or kill on how they'd draw, before the director steers.

## Turn 2 — product designer (visual focus), 2026-10-26

I drew all five of turn 1's directions and three of my own as finished icons, 15 drawings in all: `sketches/contact-sheet.png` (2x) and `sketches/contact-sheet-1x.png` (true size). Each card shows the icon at 72; at 24 in the badge (drawn 1:1, the system's rule 1); at 18 in the 24 ring (how `badgeHtml()` draws a glyph today); and at 12 bare (the chip). Below that, a street at 24 beside Café, Bar, Museum and Nature, then lavender as in the app, and reversed (selected). Source: `sketches/shapes.py` (the roots, rack rounds and whole-pixel rules from `grid/pixel-fit.md`: slabs 2, counters ≥ 2, gaps ≥ 1, protrusion ≥ 1, symmetric on x = 12), `sheet.py` and `shoot.js`. They are quick and hand-built, not engine output.

### The draw (`random.SystemRandom`)

Oblique: **"The inconsistency principle"**, **"Simple subtraction"**. Fields: **chess, beekeeping, numismatics**. Twists: **weightless: mostly air; must contain a hole that carries the meaning; must be drawn from the side only**. Constraint: **one root**.
- *Numismatics* → G, the holed Danish krone (one root, one hole). *Beekeeping* → the market's honey jar. Killed without drawing it: a jar is food, which is Restaurant's ground. *Chess* → nothing honest, so dropped.
- *A hole that carries the meaning* + *one root* + *simple subtraction* (take the handle away) → **F, the die-cut bag**: the record or design shop's bag, whose handle is a hole the die punched. Nothing is added to the body; the handle *is* a counter.
- *Simple subtraction* again (no handle at all) + *made by a tool* taken literally → H, the market paper bag with the serrated mouth the bag machine leaves.
- *Inconsistency principle* → B stays asymmetric on purpose: the one icon that stands off a wall.

### Turn 1's five, drawn: push or kill

- **A, gusseted bag: kill.** At 24 it is plainly a padlock, and at 18 a kettlebell. The gusset notches vanish below 72. The problem is structural, not styling: any ring standing on a box is a shackle. The handle-as-ring rule can't make a bag that doesn't read as a lock.
- **B, the blade sign: push (B1).** It is the only drawing whose silhouette nothing else in the set shares. In the street strip it is found first, by shape, not weight. It reads as a hanging sign at 24 and is still a sign at 12. B2 (oval board) reads as a face, and B3 (braced arm) as a crane or gallows: both killed. Its open risk is the one turn 1 named: it says "a sign", not "a shop". The board stays blank. Every mark I could cut into it (a bag, a key, a pretzel) is the cheeky move he rejected.
- **C, kiss-lock purse: kill.** At 24 it is a bowl with two cherries, or a face with ears. The beads are the only purse cue, and they read as ears.
- **D, string bag: kill.** A football at 24, as turn 1 expected. Diamonds at 2½px with the line between them don't survive 18.
- **E, goods on the counter: kill.** A factory skyline at every size. Three goods at 18 are three bumps.

### My three

- **F, the die-cut bag: push (F4, the strongest of the family).** F1 (square, LP proportions) is a phone or a fob at 24. F2 (outline) is a calendar or a floppy disk. Both killed. F3 and F5 (flared, no gusset) read as a kettlebell. **F4** (flared, the gusset as a V cut at each top corner, the die-cut slot) reads as a bag, and the cut corners stop the kettlebell read. It answers his handle question with a rule, not a shape: **a handle is the hole a hand goes through**. The cup's ear is that hole (a 2px counter) with the line around it. The bag's handle is the same hole cut straight through the body under a 2px band. Both come from one root, the counter, sized once. The risk: it is still "a bag", which he called "one step too common". The die-cut handle is the left-of-centre part (the boutique and record-shop bag, not the supermarket's), but he may not see it as far enough left.
- **G, holed krone: kill.** It reads as a record or a target. Nordic, and a nice story, but unreadable.
- **H, serrated paper bag: kill.** H1 reads as a crown or a battery, H2 (folded mouth) as a calendar. The tool's mark is a lovely idea that doesn't survive 24.

### Weight (measured; outline area, holes not subtracted)

The six run 34-63px² (the museum is 63). B1 is about 60 net and F4 about 71 net. Both sit at or above the museum, which is the wrong end for the most-repeated pin. Either can lose ink if it goes forward (B1's board 1px shorter; F4 8 wide, not 10).

### For the rules

- **A handle is its counter** (from F4): the hole is the root, and the ink around it is either the line (the cup) or the body (the bag). This also explains why A reads as a lock: a ring on a box is a shackle; a hole in a body is a handle.
- **A silhouette nothing else has** is how the commonest mark stays findable when its ink is the weakest (lavender, 3.26:1). That is B1's lesson, and worth a check on every new icon.

### Strongest

**B1, the blade sign**, then **F4, the die-cut bag**. Before anything goes to him, both need a blind read at 24 by someone who hasn't seen this sheet, and both need ink taken out.

NEXT: design director — two survivors (B1 sign, F4 die-cut bag) and a proposed handle rule; steer which go to concepts and whether "a bag" is still open after v264.
