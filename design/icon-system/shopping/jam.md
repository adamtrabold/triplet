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
