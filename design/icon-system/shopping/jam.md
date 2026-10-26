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

## Turn 3: design director, 2026-10-26

### Is a bag still open? Yes, on his words alone

- **v264:** "i do not like any of the proposed shopping icons." The five on v264 were the swing tag, basket, awning, parcel and till (`../briefs/shopping-concepts.md`). **None was a bag.** So v264 tells us nothing about bags, and he gave no reason, so we don't supply one.
- **His last words on the bag itself (v260):** "the bag i think is conceptually the problem -- the way we have added personality is by icon choice ... i think the shopping bag works, but it may be one step too common?"
- **Both halves stand.** He said the bag "works", then asked whether it's too common, and called it "conceptually the problem" by the coupe standard. A bag stays open, but it carries the burden of proof: what makes this bag left of centre the way the coupe is? If we can't say that in one plain line he'd accept, it goes to him as the question, not as a concept.

### A signal for me

He turned down the swing tag, which I scored 9 on v263. I called my read of it "blind", but I had seen it, and I counted its rhyme with the Hanging Tag as a plus. Turn 1 shows that rhyme is a confusion: a tag means "the place's tag". From now on, a blind read is done by an agent who hasn't seen the sheet. My own read is not blind, and I label it so (below).

### My read at 24 (seen, not blind; the street strips on `sketches/contact-sheet.png`, plus my own shuffled render)

- **B1:** at 24 I read a hanging sign first, then a crane with a crate. But in the street its bracket with two drops rhymes with the museum's beam over columns: two marks in the set built as "beam plus short posts". Its chequered wall plate is noise at 24.
- **F4:** I read a handbag, then a padlock. The V cuts at its top corners read as ears or a crown, not a gusset. The slot reads as a lock's hood more than a hand's hole. It's better than A and F3, but not yet a bag that only we would draw.
- **A, C, D, E, G, H:** the kills stand. At 24 I read padlock, cherries, football, skyline, record, battery.

### The draw (`random.SystemRandom`, run, not chosen)

Oblique: **"Tidy up"** and **"Do the words need changing?"** Fields: **ceramics glazing, bookbinding, bicycle frames.** Twists: **seen from above; the lightest mark in the set.**

### Three directions of mine (they differ in kind)

**J. The sign that hangs the goods (B1 × F4; "Do the words need changing?").** A Nordic trade sign hangs no words. It hangs the thing itself, cut out of plate: the boot over the cobbler, the key over the locksmith. So the board is **not a board but the bag**, hung by its own die-cut hole from the bracket. Two reads, each confirming the other: the bracket says shop, the shape says goods, and the bag's handle is literally what it hangs by. That is plain (a sign), made by a tool (a cut plate), and left of centre in the coupe way: everyone draws a bag; we draw the sign a shop hangs. The risk is "cheeky", his word for v260, so it must be drawn straight, with no wit beyond the one fusion.

**K. The fold, not the ears (bookbinding; "Tidy up" on F4).** A binder's identity is the fold. Take F4 and remove the V ears. Its particular detail becomes the block-bottom paper bag's crease: one 1px cut (the gap rule) across the body where the bag folds flat, and the die-cut slot above it. Every part is a root operation: the body is a flared slab, the slot a 2px counter, the crease a gap. If it reads as a calendar (H2 did), it dies.

**L. The lightest mark (bicycle frames; "the lightest mark in the set").** Shopping is 27% of pins, the most-repeated mark, in the weakest ink. Draw it as the set's first **open** category glyph: a frame of 1½px line, like the star and the +, with the handle as a ring on the line. This tests the settled rule "outline/solid/open follows the icon's job" on its hardest case: is "most repeated" a job that earns the open style? I expect the answer is no, because an open glyph among solids reads as unselected or disabled. Draw it once at 24 in the street to find out, then decide. It differs in kind: weight, not subject.

**Seen from above:** a bag mouth or a stall plan seen from above is unreadable at 18. Killed. **Ceramics glazing:** a vase means home decor or flowers. Killed.

### Steering

- **B1: push, as concept 1.** Tidy up:
  - one bracket, no chequer;
  - links as rings (the handle rule reused), not drops, so it stops rhyming with the museum's columns;
  - net ink at or below the café.
  - Its board stays plain unless J beats it.
- **F4: push only as K.** The ears go. The slot is sized as a hand's hole (about ⅓ of the top's width, a 2px counter at least). If K still reads as a handbag or padlock at 24 in a fresh read, the die-cut bag dies, and the bag question goes to him in one line.
- **J: build it.** It's the one that answers "one step too common?" with a reason rather than a styling.
- **L: one drawing, in the street strip only.** It's a test, not a concept, unless it surprises us.
- **The handle rule:** "a handle is its counter" (turn 2) is a better underlying shape than "a handle is a ring", and it explains the padlock read. It goes forward as a proposal to the rules. It is not settled: he set the ring, so it reaches him as a question with the cup and the bag side by side.
- **Weight:** every survivor is shown with net ink (holes subtracted) beside the six. The commonest pin is not the heaviest.
- **The parallel pixel round's rules apply:** slabs 2, counters ≥ 2, gaps ≥ 1, protrusion ≥ 1, line 1½.

### Before anything is concepts

A blind read at 24 and 18, in lavender, in the street strip, by a fresh agent who sees only shuffled glyphs. It covers B1 (tidied), J, K and the six. The question is one: "what kind of place is each?"

NEXT: product designer (systems): set B1-tidied, J and K as concepts against `jobs.md` (F1-F5), with L as the one-drawing test; visual draws them. Then the fresh blind read, then me.

## Turn 4: product designer (systems), 2026-10-26

Concepts set in `concepts/` (README, B1, J, K, and L proposed killed). What's new since turn 3:

- **The counter rule decides two things before drawing.** Two ring links need centres 6px apart, so B1 splits into **B1a** (one ring, 8 × 5 board, about 62 ink) and **B1b** (two rings, 11 × 4 wide board, about 82). Nothing can hang *through* a 2px hole (¼px slivers), so J's bag hangs from two short drops at its corners, with the handle hole left clean. A single ring over a holed bag is a shackle over a keyhole: a padlock.
- **A rule the six already follow, now written down:** what carries is the line (stem, trunk, columns, bracket, links); what is carried is the mass (bowl, tiers, roof, board, bag).
- **Rules each concept adds:** B1, a link is a ring. J, a hole is held, never threaded, at 24. Together with turn 2's rule: things are held through a counter, and the counter is the root. K, a fold is a cut (it reaches a folded map, a ticket's tear, a book).
- **Weight, estimated:** K about 66, B1a 62, B1b 82, J 84 (72 if shrunk). Museum B¼ is 74½. Only K and B1a get near the café. Open for the director: is the bar "at or below the café" or "not the heaviest"?
- **L: proposed kill.** `docs/owner-taste.md` (10-14): place icons are solid; an outline means "not yet tapped by me". An open Shopping pin reads as a state. The weight job can be met inside the solid style (`concepts/L-open-glyph.md`).
- **Flag, not ours to solve:** the grid lands whole pixels at 24 drawn 1:1, but `badgeHtml()` draws glyphs at 18 in the ring (×0.75, so a 2px slab is 1½). Every concept's pixel claims hold only at 24. The blind read should use the size the app will ship; that's the build's call, and the director should name it.
- **Draw order:** K and B1 (a and b) first, then J.

NEXT: product designer (visual focus): draw K, B1a, B1b and J finished at 72, 24, 18 and 12, beside the six, with measured net ink, ready for the fresh blind read.

## Turn 5: product designer (visual focus), 2026-10-26

I drew K, B1a, B1b and J as specified, plus three reshapes (K2 even, K3 light, B1c light) and J2 (J lightened). Sheet: `sketches/contact-sheet-t5.png` (2x), with `-1x` and `-3x` beside it. Each drawing is shown at 72, in the 24 badge 1:1, at 18 in the ring (today's `badgeHtml()`, per `grid/pixel-fit.md` round 3: the 24 grid is whole only 1:1), at 12, in a street beside the six, in lavender, and reversed. The net ink printed on each card is measured in the page (holes subtracted). Run `python3 -I sketches/sheet.py t5`, then `node sketches/shoot.js t5`. Each concept file now has its "How it looks and feels" part.

**Net ink against the café (56.5) and the museum (62.9):** K3 **50.2 (89%)**; K 66.2 (117%); B1c 66.2 (117%); J2 72.2 (128%); K2 73.2 (130%); B1a 74.2 (131%); J 84.2 (149%); B1b 94.2 (167%). Only K3 sits inside the six's band.

**Reads at 24 (my own; seen, not blind):**
- **K3 (push):** a small paper bag. The crease may read as a plinth (a pot or a bin). It is the quietest drawing and the right weight.
- **J2 (push):** a bag hanging from a sign, the strongest "shop" read. It's the museum's weight plus 15%, and the bracket can't lose any more ink.
- **B1b (kill):** a cassette tape or a bus, and the heaviest.
- **B1a/B1c (expect kill):** the ring's round hole over a block reads as an eye or lens (a camera on a crane). Ring links hurt the sign at this size. The hole is seen but never used, so "a link is a ring" holds for handles, not for hangers. B1c goes to the blind read only to confirm this.
- **K and K2:** too big. They fill the ring like a printer. K3 replaces both.
- **L:** I agree with the kill (owner 10-14: place icons are solid), so it's not drawn. K3 meets the weight job inside the solid style.

**For the rules:** the line/mass split held in every drawing. "A link is a ring" needs a narrower scope: a ring where a hand or hook *uses* the hole; a post where the hole would only be seen.

**The trade, for the director:** J2 has the meaning and K3 has the weight; I can't make one drawing that does both. Both should go to the fresh blind read (lavender, 18 and 24, shuffled), with B1c as the control.

NEXT: design director — steer K3 vs J2 (meaning against weight), confirm the B1b kill and the L kill, and order the fresh blind read.

## Turn 6: design director, 2026-10-26

**Kills, confirmed:**
- **B1b:** reads as a cassette, and it's the heaviest.
- **L:** "place icons are solid", his 10-14 rule.
- **K and K2:** replaced by K3.
- **B1a:** the ring reads as an eye or a lens. B1c stays only as the control.
- **The rule note stands:** a ring where a hand or hook uses the hole; a post where the hole would only be seen.

**My read at 24 (seen, not blind):**
- **K3:** the right weight. But the slot on top plus the crease above the base gives toaster, ballot box or printer as often as paper bag.
- **J2:** the shop read is there: a sign with goods hanging. It's heavy.

**The weight bar, decided:** the most-repeated pin is never the heaviest in the set. Its ceiling is the museum (62.9). J2 (72.2) goes to the blind read as drawn, so meaning is tested before weight. If it wins the read, it must come down under 62.9 before it is scored.

**The size, decided:** the blind read uses what the app ships today, the 18 glyph in the 24 ring in lavender, first. The 24 1:1 navy comes second. The pixel claims at 18 are the build's problem, and they're flagged in the concepts.

READY: K3, J2 (B1c as the control).

**What the fresh blind reader gets** (label-free crops only, order shuffled by a real RNG, no file names, no sheet):
1. Each of K3, J2 and B1c alone, at 18 in the ring in lavender, then at 24 1:1 in navy.
2. Three street strips at 18 in lavender, one per candidate: café, bar, the candidate, museum, nature, restaurant, in a shuffled order.
3. As distractors in item 1: the café, bar and museum glyphs, so the reader isn't told that every crop is a shop.

**Questions, in this order:**
- "What kind of place is each?"
- Then, for any one not named as a shop: "Which of these could be a shop?"

Record the first word, not the final answer.

NEXT: orchestrator: run the fresh blind read as above. Then me, to score K3 and J2.

## Turn 7: design director, scores for Shopping concept round 1, 2026-10-26

Based on `blind-read-1.md` (a fresh reader, label-free, RNG-shuffled, 18 lavender, 24 navy and street strips) and `sketches/contact-sheet-t5.png`.

**K3, the fold: 3. Replace.** First reads: lampshade, lantern, beehive, toaster. "Shop" came only as the third guess. The idea was to make the bag particular with a root operation (the crease). That operation is exactly what removed the bag: with no handle above the body, the crease reads as a plinth and the slot as a lamp's top. No version of the fold gets to 9, because its distinguishing detail is the thing that hides the subject.

**J2, the sign hangs the bag: 3. Replace.** First reads: tap, pump, vending machine, "rg", robot head, "a bit padlock-like". The idea needs two reads (sign plus goods) at a size that holds one. At 18 the bracket plus a hanging block is a tap. The control B1c read "a person behind a counter", which confirms that a sign at this size reads as reception, not as a shop.

**Likely owner objections:** the same as the reader's, and he'd see them faster. Neither reads as a shop.

**What keeps blocking (v263, v264, now):** twenty subjects in three rounds. Every move to make Shopping "left of centre" removes or hides what reads as shopping at 18. The distractors read instantly because each is its object, plainly (a cup, a coupe, a temple). The coupe is left of centre, but it is still a glass. Our Shopping moves changed the object (tag, awning, till, sign) or covered its tell (the fold). Unprompted, the reader names the readable answer: "I'd never reach for a cart or a bag here because there isn't one."

**Is the bag "too common", or just the readable answer?** His words don't settle it. "the shopping bag works, but it may be one step too common?" is a question. "i do not like any of the proposed shopping icons" covered five non-bags. So it is a question for him, and it gets shown, not asked in the abstract.

**Direction for round 2:**
1. **Draw the plainest readable bag, finished, in the system:**
   - body a flared slab;
   - handles that read as handles at 18, not a shackle: the turn-2 lesson is that a ring standing on a box is a padlock;
   - net ink at or under the museum.
   It is left of centre only where that costs no read, as the coupe's flare is to a glass.
2. **Blind-read it fresh the same way.** Pass = "bag" or "shop" as the first word at 18 lavender.
3. **If it passes, it goes to him beside one plain line,** in his own terms: "The blind reader reaches for a bag; every other subject read as something else at 18. Is this bag one step too common, or is readable the point here?" His answer decides whether round 3 hunts a subject or polishes the bag.

Scores in `grid/scores.md`.

NEXT: product designer (visual focus): round 2, the plain bag at 18/24/72 beside the six, two or three handle constructions, net ink; then the fresh blind read.
