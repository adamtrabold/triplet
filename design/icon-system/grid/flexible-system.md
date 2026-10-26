# How the system makes new icons

Product designer (systems), 2026-10-26. Thinking only: nothing in the engine, the picks or the six changed.
On the canvas as the board "How the system makes new icons" (Grid concepts page, row 1, right of "Every icon").

The question (owner): "I think declarative is fine but I don't want it to be so specific… it needs to be a flexible
system that outputs coherent consistent icons. Have someone think about how we might achieve that before rewriting
the system at all."

## The problem in one line

Today the family's look (the flares, the caps, the soft joins) is hand-written into each of the six icons. A new
icon gets none of it unless someone hand-writes it again. That's why both blind tests came out generic.

## What other systems do (precedent)

Systems that stay consistent without a catalogue mostly fix **the tool or the process**, and leave the drawing free.

- **Metafont (Knuth).** You describe each letter as a path; one set of shared settings (the pen, its widths, its
  slant) draws every letter. Change a setting and the whole family changes together. Letters nobody has drawn yet
  still match, because the pen gives the character. Cost: the letters looked mechanical unless the designer worked
  hard against the tool.
- **Writing tools (Noordzij, *The Stroke*).** A broad nib makes thick and thin in the same places on every letter. The
  consistency comes from the tool, not from rules about each letter.
- **Variable fonts and SF Symbols.** Designers draw a few extreme versions of each glyph (Apple's custom-symbol
  template asks for Ultralight, Regular and Black; the other weights are blended between them). Consistency comes from
  a strict template (margins, heights) and from people drawing every symbol to it. Honest note: SF Symbols is not
  generative. Its quality is skilled people plus a strict template plus review.
- **Lucide.** About fifteen short, measurable rules: a 24px canvas, a 2px line, round ends and joins, 2px corners on
  shapes 8px or larger (1px below), at least 2px between parts, keep reused shapes exactly as they are. Most of the
  character (the round ends) comes from the renderer, not from each drawing. Anyone can add an icon and it matches,
  but the look is deliberately plain.
- **Glyphs corner and cap components.** A detail (a serif, a flare) is drawn once and attached to any corner. It
  bends to the corner's angle. A kit of details, not a list of rules.
- **Shape grammars (Stiny and Gips, 1972; the Palladian villa grammar, 1978).** A few rules ("where you have this
  shape, you may add that one") generated new villa plans that experts accepted as Palladian. Cost: each grammar
  took years and only fits one style.
- **CAD with constraints.** You say "these two are tangent", "this is half of that", and the solver keeps it true
  as you edit. Fillets are one setting applied to every edge of one type. In cast parts the usual rule is that an
  inside corner's round grows with the wall's thickness. One rule, every part.
- **Design tokens.** Name a value once, use it everywhere. They keep the numbers consistent, not the shapes.

What they constrain: the tool, the template, the numbers. What they leave free: what you draw. Where character comes
from: the tool (Metafont, the nib, Lucide's round ends), reusable drawn details (Glyphs), or skilled people plus
review (SF Symbols).

## Already settled (the same in all three)

These are yours already, so no approach changes them:

- Every icon is root shapes, **joined or cut apart** (the 1px cut).
- **The scale:** every size is a simple ratio (1, 4/5, 2/3, 1/2, 1/3…) of the widest root or of the line, placed on
  the 1/3px lattice.
- **Outline, solid or open** follows the icon's job.

What's still open is only this: **where does the family's character live, so a new icon gets it for free?**

## Three approaches (they differ in where the character lives)

### A. A kit of parts: the character lives in a few drawn parts

Like metal type: a tray of parts is cast once, and every icon is set from it. The six are taken apart into about
eight to ten parts, each drawn once to the full standard: a post with its flared foot, a slab with its ends, a
vessel, a loop, a cap, a tip. Each part has fixed places where it can connect (at halves and thirds, like holes in a
Lego Technic beam). A part stretches only in its plain middle; its details stay the same size.

- **The bag:** a slab-ended body, a loop part plugged into its top at the 1/3 points. The loop's flared feet come
  with the part.
- **The bed:** a mattress slab, a headboard post (flared foot included), a leg post, a pillow cap.
- **The system decides:** every detail, how parts meet, the sizes from the scale. **The designer decides:** which
  parts and where.
- **An unforeseen part** (a knife's blade for Restaurant): someone draws it once, it's judged against the six, and it
  joins the kit. Every later icon gets it.
- **Cost and risk:** it is a catalogue, of shapes instead of join rules, and it only grows. Icons can look assembled,
  with the same flare everywhere. Every new kind of part needs a designer first.
- **Gives up:** "any shape at all". It gains the strongest guarantee of looking like the six.

### B. One casting rule: the character lives in a single law about how ink settles

Like casting in metal: you make the mould from plain shapes and the metal does the rest. The designer places only
plain root shapes. Then one rule runs over the whole joined shape, everywhere, with no idea what the parts are:

- where a thin part meets a thick one, the inside corner fills in, more where the difference is bigger (**the flare
  appears by itself** where a post meets a slab, a stem meets a bowl, a handle meets a bag);
- a tight inside corner rounds less than an outside one (your rule);
- every corner rounds by its angle and the thickness of what meets there;
- walls and gaps are kept at least a set width;
- the whole icon is sized and weighed against the slot.

The computer works on the filled shape, not on its outline, so shapes that only just touch (the heart that vanished)
can't fall apart, and holes behave the same everywhere.

- **The bag:** a rectangle and a ring. The rule finds the ring is thin and the body thick, so the handle's feet flare
  into the body. Nobody asked for it.
- **The bed:** a long rectangle, two posts, a cap. The posts flare into the mattress; the cap, cut free, only rounds.
- **The system decides:** every corner, flare, wall, end and the final size. **The designer decides:** the roots,
  their sizes on the scale, joined or cut.
- **An unforeseen part:** it's just another shape. The rule measures it like any other.
- **Cost and risk:** the six's hand-made touches may not all come out of one rule (the museum's dropped beam end, the
  coupe's leaned flare). Each one the rule can't make must either go or be added to the rule, for every icon. It
  could come out softer and more alike than the six. Tracing the result back into a few clean curves is real work.
- **Gives up:** per-icon touches. It gains "any part, any combination, same look".

### C. Sketch, then snap and score: the character lives in a measured fingerprint of the six

Like CAD plus a judge. The designer sketches freely. The system then:

1. snaps every size to the nearest ratio on the scale and every edge to the lattice, and keeps the relations
   ("tangent", "same wall") true;
2. measures the result against **a fingerprint of the six**: how round corners are at each angle, how thick parts are
   against each other, how dark the icon is, how tight the curves are, how open the holes are;
3. shows a score and points at what's off ("darker than the family", "no thick-to-thin change anywhere").

- **The bag:** sketched, snapped; the score says "darkest in the row, no joins with character". The designer fixes
  it and the score passes.
- **The system decides:** proportions, alignment and the pass/fail. **The designer decides:** the drawing, including
  the character.
- **An unforeseen part:** anything can be sketched, and the score judges it like everything else.
- **Cost and risk:** cheapest and most flexible, but it judges better than it makes. First-time-right still rests on
  the designer, which is what the blind tests showed doesn't hold.
- **Gives up:** "consistent by design". It gains a judge that never tires (it would have caught round 2 before the
  director did).

## How we'd test each one cheaply (before any rewrite, outside the engine)

The test icons are real batch-2 ones: **Restaurant** (its blade is a part the six don't have) and **Shopping** (the
bag that failed round 2), plus the bed. Any judge sees them beside the six at 24 and 72px, by eye first.

- **A:** draw the kit from the six (half a day). A fresh designer gets only the kit and builds Restaurant and the
  bag. Passes if both read as family by eye, and the blade only needed one new part.
- **B:** a small separate script (a day or two): plain roots in, the one rule, outline out. First rebuild the six
  from plain roots only, no hand code: the list of what doesn't come back is exactly what the rule can't say. Then
  Restaurant, the bag and the bed. Passes if the flares appear where nobody asked and the six come back close enough
  that you'd accept them.
- **C:** measure the fingerprint from the six (half a day) and score the round-1 and round-2 icons. Passes only if
  the score ranks them the way the director's eye did (the round-2 bag worst). If it can't tell the generic bag from
  the six, C is dead.

## Recommendation

**B, with C as its judge.** Test C's fingerprint first (it's the cheapest, and it's the yardstick for B), then
prototype B on the six, Restaurant and the bag.

Why:

- It's the only one where a part nobody listed gets the family's look with no one drawing it. A is a catalogue, and
  C relies on the designer.
- It's your own words. "Defined by the shapes and proportions, not stroke logic": the designer only places shapes, and
  the rule acts on the filled shape. "Root shapes connected / disconnected": that's the only thing the designer
  states about a join. It doesn't need the fixed list of join kinds you found too specific. And your feel ("a
  woodcut/metal cast type piece", "screened ink… settling a bit less sharp") becomes the rule itself rather than a
  per-icon finish.
- It fixes the engine faults the director found, because touching shapes and holes are handled on the filled shape.

The honest risk: B may come out softer and more uniform than the six you approved. Testing the six first measures
that before anything else. If it fails, A's kit is the fallback, built from the same six.

## Still yours to decide (not settled here)

- **Holes where shapes overlap:** B can do either answer. With "the outside moved in evenly" it's cheaper (an even
  wall falls out of the method); with "every hole its own shape", the hole shapes are cut out before the rule runs.
- **What makes a plain block ours:** under B, a plain block only gets its rounded corners unless the rule is told
  more. Whether that's fine is your call.

## Sources

- Knuth, "The Concept of a Meta-Font", *Visible Language* 16(1), 1982; *The METAFONTbook*, 1986.
- Gerrit Noordzij, *The Stroke: Theory of Writing*, 2005.
- OpenType Font Variations overview, learn.microsoft.com/typography/opentype/spec/otvaroverview
- Apple, WWDC21 "Create custom symbols" (developer.apple.com/videos/play/wwdc2021/10250) and the SF Symbols template
  (three sources: Ultralight, Regular, Black; other weights interpolated). Apple's pages weren't readable from this
  session, so this is from the session talk as I know it, not quoted.
- Lucide icon design guide, lucide.dev/contribute/icon-design-guide (read 2026-10-26).
- Glyphs, "Reusing shapes: corner components", glyphsapp.com/learn/reusing-shapes-corner-components (read 2026-10-26).
- Stiny and Gips, "Shape Grammars and the Generative Specification of Painting and Sculpture", 1972; Stiny and
  Mitchell, "The Palladian Grammar", *Environment and Planning B*, 1978.
- Sutherland, Sketchpad, 1963 (constraint drawing); casting design practice: inside fillets sized to wall thickness.
- W3C Design Tokens Community Group format, designtokens.org.
- Process note: the role brief asks for real randomness. The draw (`random.SystemRandom`) gave "Use fewer notes" and
  three fields: joinery, Lego Technic and metal type. Metal type and Lego Technic shaped A. "Use fewer notes" and
  your casting words shaped B (one rule instead of many).
