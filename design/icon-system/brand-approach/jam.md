# Brand approach to icons: jam

Phase 1 only: the brand's attitude and ethos, and which visual and stylistic
approaches support or detract from it. No finished icons, no grid, no state
redesigns. Fixed: **"Visited should not change."**

---

## Turn 1: product designer (systems focus)

### 1. Jobs, from the owner's words alone (written before reading the records)

Owner, this phase:

- **O1** See the brand's attitude and ethos stated plainly, as the yardstick
  every icon gets judged against.
- **O2** See, for that ethos, which visual and stylistic approaches support
  it and which detract from it.
- **O3** Choose between more than one direction ("i want more than one
  concept"): approve one, several, or a mix.
- **O4** Give feedback and get a revised direction back. That's normal
  iteration, not a rejection.

Team, next phase (what phase 1 has to set up):

- **T1** Turn the approved direction into specific research questions on
  icon best practice.
- **T2** Derive a shared grid from it. That means a direction has to be
  concrete enough to constrain a grid: stroke or fill, corners, weight,
  keylines, colour. A mood alone isn't enough.
- **T3** Draw every icon as SVG on that grid, side by side, iterating as a
  team.
- **T4** Tell the owner whether another tool or MCP would be better for
  drawing.

End user (inferred: what the icons are ultimately for):

- **U1** Tell the categories apart at a glance, on the map and in the list.
- **U2** Recognise each action instantly (add, account, sort, filter,
  locate, close, directions, star, delete, plan controls).
- **U3** Read state (starred, visited, selected, open) without the state
  mark outranking the place's name, and without the "off" state vanishing.

Having read the records, I'd add one job (inferred):

- **O5** See each direction *next to the things that won't change*: the
  visited stamp and sticker, the scalloped account/+ buttons, the Hanging
  Tag, the app's type. A direction that only looks good on a blank page
  hasn't been tested.

### 2. What the brand is: attitude and ethos, from the records

Triplet is a **personal** trip map for two people (owner and Erica; RLS lets
exactly two emails write). It's not a product for strangers, so it can have
a point of view. Everything below is cited.

1. **A collector's keepsake, not a utility.** The visual language is
   "vintage travel labels (hotel luggage labels, matchbook collections) and
   vintage national/state park posters and trail ephemera"
   (`design/inspo/README.md`). These are all things you *pick up on a trip
   and keep*. A saved place is a souvenir to be.
2. **Printed matter: paper and ink.** "Character comes from form and paper,
   not a costume typeface" (owner-taste, Character). "Whimsy through paper
   and ink" (Color). The tag's paper is "that same light cream always".
3. **Two voices: the printed form and the clerk's hand.** "only the clerk's
   entries are stamped; the form's own words are printed" (2026-10-08). This
   is the deepest brand rule in the ledger, and nobody has applied it to
   icons yet. Today the app already speaks both ways: printed furniture
   (header, labels, tag fields) and hand-applied marks (stamp, sticker,
   Pencil Star, ink that's "never identical twice").
4. **Whimsy that carries meaning, never decoration.** "I like whimsy and
   these all seem kinda average" and, balanced against that, "simple simple
   simple", "Dots add an insane amount of visual noise absolutely not". The
   ledger's own synthesis: "whimsy that carries meaning (form, type,
   paper/ink, motion), not added decoration."
5. **Confident and reductive, like a poster.** Look at the inspo: the WPA
   park posters are flat shapes in a few spot inks with no outlines. The
   matchbooks are one green plus cream. The Yosemite scrapbook is two riso
   inks, orange and blue. The Savoy label is navy, orange and cream, which
   is *literally Triplet's palette*, and its little luggage icons (ski,
   racket, sun, snowflake) are single-ink cream silhouettes. Few inks, big
   shapes, no gradients.
6. **Restraint in effects.** Shadows were called too harsh three times
   ("default to subtle"). "No heavy rules or boxes."
7. **Every colour means something.** "Use the brand palette consistently and
   meaningfully"; "Colour must communicate, or go neutral"; one brand orange
   for action and star; "color coding is not enough", so the shape carries
   meaning on its own.
8. **Systematic underneath.** "we should have clear systems at this point";
   "Same icon drawing language everywhere"; "icons don't fill the same visual
   space"; "Align optically, by the rendered ink". Whimsy sits on top of a
   rigorous base.

One-line attitude, for discussion: **a well-travelled, slightly playful
keepsake, printed with care: confident shapes, few inks, and the user's own
marks applied by hand.**

### 3. Where icons sit and what they have to do (from `inventory.md`)

| Family | Count | Sizes | Job | Today's language |
|---|---|---|---|---|
| Category glyphs | 11 | 12 (chip), 18 (row badge, near pin), 23 (selected pin); dropped on 16px far pins | U1: identity at a glance on busy OSM tiles and in a 56px row | Filled silhouettes, square corners, own ink each. District and street are the outliers (dashed strokes) |
| Category containers | 5 kinds | 16 / 24 / 32 | Hold the glyph, carry the ink rim, invert when selected; diamond shell for shapes | Circle with a 2px rim, paper field |
| Controls / actions | 16 | 14 to 24 | U2: instant recognition, tap targets | Mostly stroke 2 to 2.5 with mixed caps (round on +, square on locate, none set on account). The × and ▼ are *system-font text*, and Leaflet's zoom is Lucida Console |
| State: star | several | 10 to 20 | U3: starred is orange, an action colour | Filled rounded star; the open star is a 2px outline |
| State: visited | fixed | | **Does not change** | Stamp (rows, tag) and peeled dark sticker (map); the check is a *filled* path with softened corners |
| Map marks | ~19 | 14 to 32 | Clusters, plan numbers, you-are-here, anchor dot | Discs and numerals |

What the owner already said is wrong (his words, not my reading):
"too noisy"; "the checked items are stronger visually than the open ones";
"icons don't fill the same visual space"; "Checkmark was only supposed to be
lightly rounded like the rest of the icons"; "icon is treated differently
for category in the pop up than on the map".

Structural facts a direction has to answer (from the inventory, no
judgement):

- **Fill vs stroke is split by family today.** Categories are fill,
  controls are stroke, stars are both, district/street are dashed strokes.
  This split is the main source of "not one drawing language".
- **On/off pairs have different mass.** Filled star vs 2px outline star;
  filled stamp check vs stroked "mark visited" check. The off state has
  roughly a third of the ink of the on state. That *is* "checked items are
  stronger than the open ones", measured.
- **Stated corner rule:** "lightly rounded". The category glyphs are
  square-cornered, the star and visited check are rounded, and the controls
  are mixed.
- **Some icons aren't drawn by us** (text ×, ▼, Leaflet +/−, the attribution
  flag), so they look different on iPhone. Any direction should bring them
  in.
- **The visited stamp and sticker are a fixed reference.** Whatever
  direction wins has to sit beside a navy CSS ring stamp with condensed caps
  and a filled, softened check. They're good evidence of the brand's hand
  voice.

### 4. Supports vs detracts: a first cut (for the visual designer to push)

Likely **supports** the ethos:

- One drawing language across every family, with mass equalised between
  on and off states.
- Few inks, flat colour, no gradients: spot-colour printing.
- Silhouettes confident enough to read at 12px and on map tiles: poster
  logic.
- Lightly rounded corners: the owner's stated corner, and the visited
  check's.
- Character in the *form*: a distinctive cut, proportion or detail that
  means something (the Savoy luggage icons, the PCT tree, the NPS
  arrowhead).
- A clear split between printed marks (furniture) and applied marks (the
  user's own state), following the stamped-vs-printed rule.

Likely **detracts**:

- A generic UI kit look (default Material, SF Symbols or Lucide strokes):
  the "kinda average" problem.
- Mixed stroke and fill, mixed caps, system-font glyphs.
- Hairline strokes: too timid for a poster-and-label brand, and they vanish
  on tiles.
- Texture or distress applied everywhere. That's noise ("clouds"), and a
  costume, like the rejected typewriter face.
- Illustrative detail that turns to mush at 12 to 18px.
- Effects: drop shadows, bevels, 3D, glossy.
- Colour that doesn't mean anything (a new hue per icon for variety).
- Decorative dots, frames or containers that add ink without meaning.

### 5. Creative directions for the brand approach

Process note: I drew from real randomness (python `secrets`). Oblique
Strategies: *"Remove specifics and convert to ambiguities"*, *"Emphasize
differences"*, *"Retrace your steps"*. Borrowed fields: **linocut, ISOTYPE
(Neurath/Arntz), enamel pin badges, ship signal flags.** I threw away the
obvious first idea ("a consistent 2px rounded line set in navy"), which is
the average answer and doesn't express the brand.

The directions differ in **what kind of object an icon is in Triplet's
world**, not in styling:

**A. Printed & Stamped (two voices).** *Retrace your steps*: the owner's
own printed/stamped rule, applied to icons. Every piece of the app's
furniture (categories, controls) is *printed*: crisp, flat, one weight,
lightly rounded, the press's voice. Only the user's own marks (star,
visited, plan numbers) are *applied*: ink, tilt, the hand. Visited already
lives here, and the star would join it as a stamped or inked mark.
*Supports:* it's the brand's own rule and gives a clear hierarchy. *Risk:*
it could make the "on" states stronger again, which is the owner's
complaint. To pass, the off state must be a full-strength printed mark (a
printed blank on the form, like an empty field on a tag), not a faint
outline.

**B. Spot-Colour Pictograms (ISOTYPE × park poster).** Every icon is a flat
silhouette built from a few geometric primitives, cut out of one spot ink,
with no outlines anywhere (controls included). Meaning comes from negative
space, like Arntz's pictograms and the Savoy label's cream luggage icons.
*Supports:* poster confidence, the fewest marks, strong at 12px and on
tiles, and it follows the category glyphs, which already lean this way.
*Risk:* with no outlines, "off" can't be an outline. The open star needs
another device (a ghost tint, a knockout or a paper inlay), and that has
to be solved, not hand-waved. Also: can a whole control set be solid
without getting heavy?

**C. Cut Block (linocut).** Icons look carved: chunky, slightly irregular
edges, the gouge visible in the *silhouette*, with no surface texture
inside. They feel made by hand, but every place gets the same cut, and the
irregularity is drawn once into the master, not randomised. *Supports:* the
most whimsy and the most "ours", and it's kin to the stamp. *Risk:* the
closest to noise and to "not following good design principles". Wobble at
12px reads as a rendering bug. It may only work as a *size-aware* idea:
the cut shows at 24px and up and straightens below that. Keep it as the
stretch direction and name its failure modes up front.

**D. Badge & Emblem (enamel pin / luggage label).** Each icon is a small
object with a die-cut silhouette: the shape of the container carries
meaning, as in the scalloped account/+ buttons, the tag, the stamp ring and
the NPS arrowhead. Categories become emblems (the outer shape says the
family: places round, shapes diamond, which is already true) with the
glyph inlaid. *Supports:* collector's ethos (pins and labels are what you
collect), and it builds on the scallop, the tag and the stamp. *Risk:*
containers are extra ink, and the owner wants less noise. It only works if
the emblem *replaces* today's rim plus glyph rather than adding to it, and
if the controls stay bare (only "things" get badges, not "actions").

**E. Code & Flag (wildcard).** *Remove specifics, convert to ambiguities*
plus ship signal flags and the luggage tags' big three-letter codes.
Categories become a compact *code*: a bold condensed letter or a simple
flag-like shape-and-colour sign, as tags code "LAX" or a ship signals with
a pennant. *Supports:* very low noise, very legible, airline-tag kin, and
it uses the app's own type. *Detracts, honestly:* the owner said to
"preserve the icon" and "color coding is not enough". A letter is not
colour, but it might read as replacing the icon. I'm offering it as a
deliberate inversion to test where the line is, and I expect it to lose.

What every direction must answer before it's comparable (this is what
makes T2, the grid, possible):

1. Stroke, fill, or a rule for when each is used.
2. Corner and terminal: is "lightly rounded" a radius, a cap, or both?
3. Weight relative to the type (the "mark size matches text weight" rule).
4. Ink count and which token each icon uses (category inks, navy, orange,
   ink-2).
5. **On/off parity:** how "off" stays as strong as "on" (the owner's
   complaint).
6. Where texture or hand is allowed (applied marks only? never? large
   sizes only?).
7. How it sits beside the fixed visited stamp and sticker and the scalloped
   buttons.
8. How the text glyphs (× ▼) and Leaflet's zoom are brought in.

### 6. Proposals for the visual designer and the director

- Show each direction on the **same stress set** of about six real Triplet
  icons, so they're compared like for like: cafe (detailed category),
  district (today's stroked outlier), star off and on (parity), filters
  (multi-part control), close × (tiny), + on the scalloped button. Show each
  at real sizes (12/18/24) and in a crop of a real row and the tag, *next to
  the visited stamp* (O5). Keep the boards phone-readable.
- The owner asked for an *approach*, not icons. The stress set is
  illustration, labelled as such ("sketch to show the attitude, not a
  drawing").
- My lean: **A** is the most on-brand idea; **B** is the most likely to fix
  "noisy"; A + B can combine (printed = B's flat pictograms, applied = the
  hand). C and D are worth seeing; E is a test of the boundary.

### Open questions

- Is the star a *printed* thing or an *applied* thing? The owner made it the
  "action orange", which suggests printed, and the Pencil Star is drawn by
  the hand, which suggests applied. The owner should decide this, not us.
- Should the category containers (rim circle, diamond) be in scope for the
  approach? The pin's look is "shipped; changing the pin itself is a
  separate decision". I'd say the approach must *cover* them but not
  change them without the owner's say.
- Tooling (T4) is a phase 2 question, noted for later: SVG authoring with a
  shared grid could be a Figma or Design canvas, or SVGs in the repo
  rendered to a contact sheet. The owner asked to be told if another tool
  is better.

NEXT: product designer (visual focus): take the ethos and the five
directions, push or kill any of them on brand and look (especially B's
off state and C's small-size problem), and propose how to show each one
on the stress set.

---

## Turn 2: product designer (visual focus)

Read: `owner.md`, `docs/owner-taste.md` (all of it), the inspo README plus
all 8 `project/` images, CLAUDE.md, `inventory.md`, the badge row and two
context screens, and turn 1. I didn't read the superseded `../concepts/`.

Real draws (python `secrets`). Oblique Strategies: **"Use fewer notes"** and
**"Repetition is a form of change"**. Borrowed fields: **Matisse paper
cut-outs** and **botanical field guides**. Twist: **"icons must survive
being photocopied."** All of them got used below.

Sketch: `concepts/sketches/attitudes-3x.png` (source `attitudes.html`, 390
wide at 3x). It shows today plus four attitudes on the same seven icons,
each in a real row beside the **real, unchanged** visited stamp, at 12px,
and photocopied to one ink. These are sketches of an attitude, not
drawings.

### 1. On the ethos: agree, with two corrections

Turn 1's eight points hold up. The one-liner is close. I'd tighten it to:

> **Printed with care, marked by hand, kept like a souvenir.** Few inks and
> confident shapes for the things the app prints; the user's own marks
> (visited, star) are the only things that look *applied*.

Two corrections from looking at the inspo itself rather than the README:

- **The inspo's icons are small and quiet. The poster is loud.** On the
  Savoy label the luggage pictograms (skis, racket, sun, snowflake) are tiny
  single-ink line-and-silhouette marks *inside* a loud composition. The NPS
  arrowhead and the PCT diamond are emblems, but each brochure has exactly
  one. The loud thing in every piece is the name and the picture, never the
  furniture. For Triplet the name is the place, and the "picture" is the map
  and the tag. **Icons are the furniture.** That cuts against reading "poster
  confidence" as "make every icon bold".
- **"Too noisy" is the headline complaint, and parity can make it worse.**
  Turn 1 reads "the checked items are stronger visually than the open ones"
  as "raise the off state to match". It could just as well mean the on
  states are too loud. Visited can't change, so if the on state is the
  problem, the fix has to come from everything *around* visited getting
  quieter, not from off states getting louder. **That's the owner's call.**
  See the open questions. The sketch shows the risk: in "spot pictogram" and
  "same die", raising the tools to full ink makes the filters glyph and the
  × the heaviest things in the row, heavier than the visited stamp. That
  breaks "secondary marks never outrank content" and "decorative marks sit
  tight".

### 2. Push / reshape / kill turn 1's directions

- **A Printed & Stamped: keep it, but as a law, not a look.** It's the
  brand's best idea and it answers *who made the mark*, not *how the press
  draws*. Every look below can honour it. It can't be shown to the owner on
  its own: it has no drawing style until it's paired with one. Proposal:
  state it once, at the top of the owner board, as the rule every direction
  follows ("the app prints; you stamp"). That leaves the open question of
  whether the star is printed or applied, which is for the owner, not us.
- **B Spot-Colour Pictograms: keep, and solve the off state with print
  logic.** Turn 1 asked for the off state to be solved. A printer has three
  honest ways to show "not yet":
  1. **Tint screen.** The same silhouette as a halftone of the ink.
     Sketched: at 24px it reads as "unprinted", and it survives the
     photocopy. At 12px the dots turn to mush. It may work only at 16px and
     up.
  2. **Keyline.** An outline: today's answer, and the one the owner called
     weaker.
  3. **Blind deboss.** Pressed with no ink. Lovely on paper, invisible on a
     screen. Kill it.

  Risk seen in the sketch: a fully flat control set is heavy. The filters
  glyph turns into a barcode. B probably needs a rule that **tools are
  thinner primitives than places**, which drifts towards "Specimen & Key"
  below.
- **C Cut Block (linocut): kill the gouge, keep the hand, and reshape it as
  "Cut Paper"** (the Matisse draw). The linocut puts the hand in the *edge*
  (wobble), and wobble at 12px reads as a rendering bug. Scissors put the
  hand in the *drawing* (a cup that flares, a strip cut slightly off true)
  and leave the edges clean. It passes the photocopy test at 12px (sketch).
  It's the most whimsical option that isn't noise, and it's kin to the
  sticker and the tag (things cut from paper). **Found in the sketch:** its
  natural off state, "uninked stock" (the same cut in plain tan), **vanishes
  when photocopied**. That means it's colour-only, which breaks "color coding
  is not enough". Cut Paper needs another off state, for example the cut
  *hole*: the shape missing from a small paper patch.
- **D Badge & Emblem: kill it as a direction, keep one idea.** Badges are
  containers, containers are ink, and the owner wants less ink. What survives
  is "the outer shape says the family" (round = place, diamond = area). It's
  already shipped, so it's a fact every direction keeps, not a direction.
- **E Code & Flag: kill it.** "Preserve the icon" is the owner's rule, and
  type already carries the category name in the row. The useful bit, that
  luggage tags are *typographic* objects, comes back below as "tools at type
  weight".

### 3. Two new directions (different in kind)

**F. Same Die: the fixed marks are the seed.** (*Repetition is a form of
change.*) The owner's two fixed things are visited (stamp, sticker, check)
and the shipped shapes (the tag's 45° die-cut, the scalloped buttons).
Turn every icon into their relative: draw with the visited check's bar
(about 3.2 of 24, square ends softened to the check's tiny radius, which is
literally "lightly rounded like the rest"), and use the tag's 45° clipped
corner wherever an icon has a corner (the knobs on filters, the district
outline, the cup's handle). The stamp then stops being the odd one out
without changing at all. *Supports:* continuity ("for continuity" is the
owner's own word), it makes visited fixed *and* at home, and it gives a
grid almost for free. *Detracts:* the sketch shows it's the heaviest
attitude: everything at the check's weight crowds the row. It may need two
bar weights (check weight for places, lighter for tools), and the 45°
corner can tip into gimmick if it's on everything. It's the closest to a
"consistent line set", so it must earn its whimsy through the die-cut, or
it's average.

**G. Specimen & Key: a hierarchy by role.** (*Use fewer notes* plus
**botanical field guides**.) A field guide has two registers: the
*specimen plate* (the rich, careful, coloured drawing of the thing) and the
*key* (small, plain type-weight marks that help you use the book). Triplet
maps onto it exactly. **Places are specimens:** category glyphs keep their
ink and gain one meaningful cut detail (steam on the cup, streets cut into
the district block). **Tools are key:** sort, filters, locate, ×, +, and the
open star drop to the stroke weight of the app's caps labels, in ink-2 grey,
so they read as part of the typography. *Supports:* "too noisy", "secondary
marks never outrank content", "mark size matches text weight", and "colour
must communicate, or go neutral". The visited stamp, unchanged, becomes
clearly the loudest mark in a row, as an achievement should be. In the
sketch it's the calmest row by a distance. *Detracts:* it risks two drawing
languages, against "same icon drawing language everywhere". It only passes
if both registers share one corner, terminal and construction grammar and
differ **only** in weight and ink. That's a grid rule to set in phase 2. The
open star at type weight also stays lighter than the filled star. That is
deliberate here (off is a key mark, on is a specimen), but it's the
opposite of turn 1's parity reading, so the owner's answer to Q1 below
decides whether G is even eligible.

**Whimsy budget, for every direction:** the character goes in the *place*
glyphs (the specimens: categories, the things you collect) and in the
user's own marks. Tools never carry whimsy. That's what keeps "whimsy, not
average" from turning into "noisy".

### 4. Supports and detracts: my additions to turn 1's list

Supports:
- **One-ink test.** Every icon has to survive a 1-bit photocopy at 12px, with
  on and off still distinguishable. It's a cheap check and it caught Cut
  Paper's off state in the sketch.
- The type is a reference: tool weight is measured against the caps labels
  (Archivo bold, about 10 to 12px), not invented.
- Character in proportion and silhouette (a flared cup, a cut strip), never
  in surface.

Detracts:
- **Mascots and faces.** The Savoy bellhop is charming on a label and fatal
  in a 12px glyph. Whimsy isn't cute.
- **Bubbly, super-round "friendly SaaS" caps.** The owner said *lightly*
  rounded, and the visited check's radius is tiny.
- **Duotone or outline-plus-fill hybrids** (the current icon-kit fashion).
  They're two inks on one small mark, and that's noise.
- **Ink texture or misregistration inside icons.** Texture already lives on
  the tag band and the stamp. Adding it to icons is the "clouds" mistake at
  a smaller size.
- **Tools heavier than the stamp.** The sketch shows how easily this
  happens (B, F).

### 5. How to show each direction to the owner

Agree with turn 1's stress set at real size beside the visited stamp. Changes:

- **One phone-width card per direction, all the same layout**, so he can
  compare by scrolling: the name and a one-sentence attitude; the seven
  icons at 24px; **a real row crop with the real stamp** (the place where
  noise actually gets judged); a 12px strip; and the one-ink strip. That's
  the format of `attitudes-3x.png`. Add the tag stub (Directions, Star,
  Visited segments) as a second crop, because star off and on lives there.
- **Put "Today" first** as the reference card. He reacts against something
  concrete.
- **At most four directions** ("I don't think we need this many
  variations"). My pick to show: **B Spot pictogram, C' Cut paper, F Same
  die, G Specimen & key**, with A stated once as the law over all four.
- Each card has three plain lines: what it says about the brand, what it
  risks, and the one thing he'd be choosing. No essays on the board.
- The sketches are labelled "sketch of an attitude, not a drawing", because
  he asked for an approach, not icons.

### Open questions (for the owner, via the director; not for us to resolve)

1. **Q1 "Checked stronger than open":** should the open states get
   stronger, or should everything else get quieter? It decides whether
   Specimen & Key is eligible, and how far B and F push weight.
2. **Is the star printed or applied?** (Carried over from turn 1.)
3. Does whimsy belong in the place glyphs only (my proposal), or in tools
   too?

NEXT: design director: four attitudes are on the table (B, C' Cut paper,
F Same die, G Specimen & key, with A as the governing law). Please steer
which go to the owner, and whether Q1 should be asked before or alongside
them.

---

## Turn 3: design director

Read: `owner.md`, `docs/owner-taste.md` (all), the inspo README plus the
Savoy label, the Yosemite scrapbook, matchbooks 1 and the park posters,
CLAUDE.md, `inventory.md` and the starred + visited tag context screen,
turns 1 and 2, and `attitudes-3x.png`. No scoring this turn.

Real draws (python `secrets`). Oblique Strategies: **"Is there something
missing?"** and **"Only one element of each kind"**. Borrowed fields:
**railway timetable typography** and **museum specimen labels**. All four
got used below.

### 1. The premise, set straight

Two things in turns 1 and 2 rest on the 2026-10-07 backlog quote ("the
checked items are stronger visually than the open ones"): turn 1's
must-answer **"On/off parity: how 'off' stays as strong as 'on'"**, and
turn 2's Q1. The owner has since said "I never told you what I wanted
changed". That quote is his, but it is not this phase's brief. So:

- **Parity isn't a requirement.** Item 5 on turn 1's list becomes "**On/off
  stance**: what this attitude does with an off state, and why." Each
  direction states its stance as a *consequence* of its attitude. None
  of them is built to fix a complaint we were never given.
- **Nothing gets judged by "does it fix noise".** Each gets judged by
  "does this look and feel like Triplet". The owner's standing taste rules
  (simple, no added decoration, secondary marks never outrank content, one
  drawing language, restrained effects) still apply. They're rules,
  not this task's problem statement.

### 2. The ethos: agreed, with one line added

I'm adopting turn 2's line and adding what the brand is **not**, because
the "not" is what separates the directions from costume:

> **Printed with care, marked by hand, kept like a souvenir.**
> *Vintage in method, not in costume:* few inks, cut shapes, printed vs
> stamped. No faux distress, no retro typeface, no mascots.

That last clause is the owner's own ("the typewriter font is unnecessary";
"texture looks like clouds"). The inspo agrees: every piece is loud in
its name and picture, and its furniture (the Savoy luggage pictograms, the
parks' bison roundel, the NPS arrowhead) is small, single-ink and quiet.
**Icons are the furniture. The place name is the hero.** I'm making that the
shared premise. All three directions below accept it. They differ in what
an icon *is*.

### 3. Push and decide on the directions

- **A Printed & Stamped: a law, stated once over everything.** Agreed with
  turn 2. One correction: the star doesn't need an owner question. The
  shipped Pencil Star is already the answer: drawn by hand, it "lands as the
  printed orange star". The star sits on the seam between the hand and the
  press, and that's correct. Q2 is dropped (see §6).
- **F Same Die: dropped as a direction, kept as a phase-2 grid seed.** Its
  insight, "derive bar weight and corner from the fixed visited check", is
  the right way to *start a grid* for whichever direction wins. It's a
  method, not an attitude: it doesn't say what the brand feels like. The
  sketch also shows it's the heaviest row. It goes on the "dropped" strip,
  so the owner can overrule.
- **B Spot-Colour Pictogram: merged into Cut Paper.** B and C' are built the
  same way (flat cut silhouette, no outlines). C' adds the character the
  owner asked for ("whimsy, not average"). B on its own is the solid
  version of an average set, and the sketch shows its tools turning into
  barcodes. It goes on the dropped strip.
- **D Badge, E Code, C linocut: kills confirmed** (turn 2's reasons). They
  go on the dropped strip, one line each.
- **G Specimen & Key: forward, renamed "Field Guide".** The specimen-label
  draw pushes it further. A museum label is printed small and plain *next
  to* the treasure, so the key never competes. It must show **one
  construction grammar** in two weights, or it breaks "same icon drawing
  language everywhere". The cut-detail rule has to be "one meaningful cut
  per place glyph, never two" (*only one element of each kind*). The steam
  on the cup is about the limit.
- **C' Cut Paper: forward.** It's the whimsy direction and the most "ours".
  It has to solve its off state *without colour* (it failed the 1-bit test).
  The "hole in a paper patch" idea adds a container, so try that last.
  First try the same cut as an *outline of the scissor path* in the same
  ink: the knife line before the piece is lifted. The asymmetry is drawn
  once into each master, never randomised (the "ink is never identical
  twice" rule is for textured ink, and Cut Paper has no texture).
- **NEW H Timetable Sorts: forward.** From the railway-timetable draw. Old
  Bradshaw and Nordic rail and ferry timetables carry their symbols *as
  characters of the typeface*: a cup for the buffet car, crossed knife and
  fork, an anchor for the ferry connection. They're cut at the type's
  weight, set in line and printed in the text ink. Here **every icon is a
  sort in Triplet's own type**: places, tools and the star all share the
  caps labels' stroke, sit on the cap height and use the text's ink or the
  category ink. The whimsy is the typographer's wit (a knife-and-fork sort
  that's clearly *cut*, not drawn in a vector app), not decoration. It
  fits "mark size matches text weight", "same drawing language" and the
  printed voice, and it takes back the one useful thing in E (luggage tags
  are typographic objects) without replacing the icon with a letter. It's
  *opposite in kind* to Field Guide. Field Guide has two registers, loud
  places and quiet tools. Timetable has one register, and everything is
  type. *Risk:* it's the closest of the three to "a consistent line set",
  the average answer. It only passes if the sorts read as *cut for this
  face*, with Archivo's proportions, terminals and stress. A generic
  2px-rounded set re-coloured doesn't pass. On map tiles a type-weight
  glyph is the thinnest option, so its pins need proving at near size.

**Going forward: three directions, different in kind**, each with A stated
over it:

| | What an icon *is* | Where the character lives | Off-state stance (consequence) |
|---|---|---|---|
| **Field Guide** | Places are specimens, tools are the key | One meaningful cut per place glyph | Off is a key mark: quieter by design |
| **Cut Paper** | A shape cut from the sheet | The asymmetry of the scissor path | Off is the cut line before the piece is lifted |
| **Timetable Sorts** | A character of the app's typeface | Typographic wit in the cut | On and off are two sorts of one weight |

Three, not four: "I don't think we need this many variations" and "i want
more than one concept" together mean a few that each count.

### 4. "Is there something missing?": yes, three tests the sketch skips

1. **The map.** Category glyphs live on OSM tiles in a 24px pin with an 18px
   glyph, and that's where most of the icons are seen. The sketch only shows
   rows. Every card gets a **map crop at 1x**: two near pins, a selected pin
   and one cluster on real-looking tiles.
2. **Reversal.** The selected row is navy and the selected pin is inverted
   (a paper glyph on an ink field). Every direction has to survive being
   reversed. Show the selected row in each card's row crop.
3. **The tag stub.** Directions, Star and Visited, side by side with the real
   stamp. That's the one place a tool icon, the star and visited share a
   single line. Turn 2 proposed it, and it's now required.

Also: the sketch's **district glyphs are the weakest drawings on the board**.
Spot's reads as a medical badge and Cut Paper's as a guitar pick. District
and street are today's outliers, and the owner will look straight at them.
Each card's district has to be a credible attempt, because the owner judges
stills as near-final craft even when they're labelled "sketch".

### 5. How each is shown (adopting turn 2's card, with changes)

One phone-width card per direction, all the same layout, **Today first**:

1. Name, plus one sentence of attitude in plain words (no field jargon:
   "places are drawn with care, tools are quiet like the small print").
2. The stress set at 24px: cafe, restaurant, district, star off, star on,
   filters, close, add, directions.
3. Row crop at 1x and 3x, including the selected (navy) row, beside the
   real stamp.
4. The tag-stub crop.
5. The map crop.
6. A 12px strip and the 1-bit strip.
7. Three lines: what it says about the brand, what it risks, and what he'd
   be choosing.

Then a **dropped strip**: F Same Die, B Spot pictogram, D Badge, E Code
and C linocut, each with one tiny sample and one line on why it was
dropped, so he can overrule. A stack of cards, not a canvas ("all I want is
every icon side by side" was about clutter: keep it plain).

### 6. The visual designer's three owner questions

- **Q1 (checked vs open): reframed, non-blocking.** It can't assume the
  2026-10-07 quote is the scope. Asked as a question, alongside the cards,
  not before them.
- **Q2 (is the star printed or applied?): dropped.** The shipped Pencil
  Star answers it (drawn by hand, lands as print). That's our call to
  record, not his to make.
- **Q3 (where whimsy lives): dropped as a question, made a default.** That
  call belongs to the design roles. The default is that whimsy lives in the
  place glyphs and the user's own marks, and tools carry none. It's stated
  on the board, and he can overrule it.

### 7. Owner questions (one batch, with the cards; none blocks concept work)

1. "On Oct 7 you wrote 'the checked items are stronger visually than the
   open ones.' Is that still something you want addressed? If so, is it
   that the open ones look too weak, or that the checked ones look too
   loud? (Visited stays as it is either way.)"
2. "Is anything else fixed besides Visited: the pin's round shell and
   rim, the scalloped account and + buttons, the category colours, the
   star's shape?" (It sets phase 2's scope. Each card shows the shells
   unchanged.)
3. "Should Leaflet's map zoom +/− and the text × and ▼ be redrawn into the
   set?" (Phase 2 scope. Turn 1 assumed yes.)

Tooling (the SVG tool or MCP) is a phase-2 question. It's noted, not asked
now.

### 8. Notes for the next turns

- The three cards are sketches of an attitude, but they're *crafted*: the
  owner reads a still at real size as near-final.
- Field Guide: show both registers in one grammar (the same corner, terminal
  and construction), so the "two languages" objection is answered on the
  board, not in prose.
- Timetable Sorts: set a line of real caps-label type in the card, with the
  sorts inline, so you can see they're cut for that face.
- Cut Paper: the knife-line off state, then the 1-bit test.

NEXT: product designer (visual focus): sketch Timetable Sorts as a new
card, rework Cut Paper's off state and every district glyph, and add the
map, reversal and tag-stub crops to all three plus Today. Retire the Spot
and Same Die cards to the dropped strip.

---

## Turn 4: product designer (visual focus), jam pass 2

I'm taking turn 3 as the steer: parity isn't the premise, there are three
directions, and every card shows the map, the reversed row and the tag stub,
with Today first.

**Sketch:** `concepts/sketches/attitudes-v2.html` gives one card per still,
3x and 390 wide, in Archivo (loaded from Google Fonts):
`v2-card-0-today.png`, `v2-card-1-field-guide.png`,
`v2-card-2-cut-paper.png`, `v2-card-3-timetable-sorts.png` and
`v2-card-4-dropped.png`. The whole board is in `attitudes-v2-3x.png`. Every
card has the same layout:
- the stress set at 24px: cafe, restaurant, district, star off, star on,
  filters, close, add, directions;
- a plain row and the **selected navy row**, with a starred row star;
- the **tag stub** (Directions / Star off / the real tag VISITED stamp);
- a **map crop** on OSM-toned tiles: four near pins, one selected
  (inverted) pin and a cluster;
- 12px and 1-bit strips;
- Says / Risks / Choosing.

The stamps are the real PNGs from `inventory-png/`, unchanged. The
`row-stamp-selected` and `tag-stamp` crops are new copies.

The 1x row crop the director asked for isn't there yet. Every still is a 3x
render of 1x geometry. For the owner board, I'd add a true 1x inset per
card, as a phone-readable "actual size" strip.

### Field Guide (was Specimen & Key)
- **One grammar, two weights, shown on the board.** Specimens are filled
  shapes with corner radius ~0.8. The key (tools) is a 1.8 stroke with round
  ends: the radius 0.9 matches the specimens' corners. So they share one
  corner and one terminal, and differ only in weight and ink (tools in ink-2).
- One detail per place: steam on the cup. The fork and knife need none.
  District is a solid parcel with **one** cream dashed boundary inside it,
  borrowed from how the map draws a district. It ties the glyph to the shape
  on the map.
- What I saw: the map pins read well. The tools in the tag stub look like
  part of the type. The district's inner dashes go to mush at 12px, so a
  solid inner line may be needed there. Phase 2 can settle that.
- The visited stamp is the loudest mark in both rows, as intended.

### Cut Paper (Spot merged in)
- **Off state reworked, not colour-only:** "not starred yet" is the dotted
  **cut-here line** in the tool ink, the way a coupon is marked. "Starred"
  is the piece cut out, in orange. It survives 1-bit (see the strip). The
  dots are spaced and few, but it is a dotted mark, so the owner's "dots add
  noise" rule is the risk to watch. The fallback is a solid knife line in the
  same ink.
- District is now **a block cut into four by two streets**: one off-true
  piece with two cream gaps, so it reads as city blocks. That replaces the
  guitar pick.
- Restaurant is a cut fork (tines as cuts) and a leaf-blade knife.
- Spot's contribution is its flat-cut, no-outline construction for tools.
  The sketch shows that the tools (filters, ×, +) stay the heaviest marks on
  the board. Phase 2 needs a rule that tool strips are thinner than place
  pieces.

### Timetable Sorts (new card)
- Every icon is a monoline **2-unit stroke** (≈1.5px at 18px, the stem of the
  caps labels), with **flat cut ends and mitred corners**, sitting on the
  baseline and cap height. The fill only shows up where a typeface would use
  it: ★ vs ☆, the knife blade, the compass needle.
- **On/off stance:** ☆ and ★ are two sorts of one weight and the same outer
  size, a typographic pair.
- There's an inline proof line: `REYKJAVÍK [cup] 08:15 · HÚSAVÍK [fork+knife] 13:40 [star]`,
  with the sorts set in the caps type. It reads as one voice.
- District is a parcel outline with one road curving through it (a map
  fragment).
- What I saw: it's the most coherent of the three and holds up on the map
  better than expected, because the pin's rim and the glyph share a weight.
  The risk is the director's: in places (×, +, filters) it's close to a
  generic line set. Next time, to make it *ours*, give it real Archivo cues:
  ink traps where strokes meet, and the slightly squarish curves of the
  face.

### Dropped strip
Same Die, Spot pictogram, Badge, Code and Linocut each get one tiny sample
and one plain line, under "Dropped (say if you want any back)".

### Open for the director
- Should Cut Paper's off state be the dotted cut-here line or a solid knife
  line? The dotted one carries more meaning, and the solid one is safer
  against "dots add noise". I'd show the dotted one, with the solid one
  named as the fallback.
- Cut Paper's tools are heavier than the other two directions' tools. Should
  I lighten them now, or leave that as an honest picture of the attitude?

NEXT: design director: the three cards plus Today and the dropped strip are
ready to steer. Please decide whether they go to the owner as they are
(after the 1x insets), or need one more pass on Cut Paper's tool weight
and Timetable's Archivo cues.

---

## Turn 5: product designer (systems focus), jam pass 2

I'm taking the director's turn 3 as settled. Parity is out: my turn 1's
"on/off parity" item and my O5 framing of the 10-07 quote are withdrawn.
Each direction states its on/off stance as a result of its attitude. Read:
turns 2 to 4, the three v2 cards, `notes/director.md`.

This turn: how each direction works across **every** icon family and state
in `inventory.md`, not only the nine-icon stress set: what stays fixed, what
changes, and what breaks. I'm not judging the look. That belongs to the
visual designer and the director.

### 1. What's fixed under all three directions

These hold whichever direction wins. A card that contradicts one of them is
wrong, not bold.

- **Visited:** the row and tag stamp, the map sticker (near, far, selected,
  starred), the stamp check, the sticker checks, and the visited plan pin.
  The owner: "Visited should not change."
- **Containers:** the pin's round shell and 2px rim, its sizes (16/24/32),
  the inverted selected pin, the diamond shell for district and street rows
  and plan stops, the far pin dropping its glyph below `GLYPH_MIN_ZOOM`,
  and the scalloped navy account and + buttons. "The pin's look is
  shipped; changing the pin itself is a separate decision"
  (owner-taste). That's director Q2, still open with the owner.
- **Colour meanings:** brand orange is action and star; navy is the selected
  row; each category keeps its ink; ink-2 grey is for secondary numbers.
- **Not icons, so out of scope:** cluster discs and counts, plan numerals,
  the you-are-here dot, the tag anchor dot, the map outlines of districts
  and streets, and the tag's furniture (band, eyelet, string).

### 2. Each direction, family by family

Rows use the inventory's families. "Shown" means it's on the v2 card.
"Unshown" means the card doesn't show it yet, and that's where surprises
will come from.

| Family (inventory) | Field Guide | Cut Paper | Timetable Sorts |
|---|---|---|---|
| 11 category glyphs: chip 12, badge/near pin 18, selected pin 23 | Specimens: filled, category ink, one cut detail each. **Shown:** 3 of 11 | Cut pieces, category ink, drawn off true once. **Shown:** 3 of 11 | Monoline sorts at the label stem, category ink. **Shown:** 3 of 11 |
| Selected pin (paper glyph on an ink field) and the selected navy row's badge | Holds: solid shapes reverse cleanly (map crop) | Holds (map crop) | Holds at 23px. At 18px on navy it's thin, but it reads in the row crop |
| Controls: account, +, sort, filters, locate, close, directions, plan check, plan +, more, chevron | Key register: 1.8 stroke, ink-2 | Flat strips, tool ink, heaviest of the three | Sorts at one weight, navy |
| Text glyphs (× ▼) and Leaflet zoom | Drawn into the key | Drawn as cut strips | Drawn as sorts |
| Star on/off: row 18, map 10/12/16 with halo, cluster, tag 20, add form 16 | On = specimen (orange fill), off = key outline. Off is quieter **by design** | On = cut piece, off = dotted cut-here line | ★/☆: one weight, one outer size |
| **Tag "mark visited" (not-yet-visited check)** | **Unshown** | **Unshown** | **Unshown** |
| Pencil Star (draws, then lands as the printed star) | Lands on the specimen star | Lands on an off-true star | Lands on a mitred star |
| Starred cluster's star cutout ("cutouts follow the star") | Follows | Follows the off-true shape | Follows |

### 3. Things that break, or that nobody has decided yet

1. **The "mark visited" check in the tag is unshown, and "Visited should not
   change" may or may not cover it.** The inventory lists it as its own
   icon: the tag's Visited segment *before* stamping, which is the stamp
   check's path stroked at 2.05. It's the direct sibling of the star's off
   state and sits beside it in the same tag stub. Either it's part of
   Visited (fixed, so every direction must sit next to an unchanged 2.05
   rounded outline check) or it's a tool (each direction redraws it). **Add
   it to the owner's scope questions alongside director Q2.** Until then,
   every card's tag stub should show the *unvisited* tag too (Directions,
   Star off, Mark visited off). That's the state a user sees most.
2. **Field Guide: grey has two meanings.** The key register puts tools in
   ink-2 grey. The filter chips already use a greyed glyph to mean "this
   category is *off*". Under Field Guide an active chip's glyph is a
   coloured specimen and an inactive one is grey, which is the same grey as
   the tools. It's "Colour must communicate" pulling two ways. The fix is
   either "grey = secondary" stated as one meaning and accepted for both,
   or "inactive chip = dashed hairline only" (the chip already has that) so
   the glyph keeps its ink. That's for the visual designer and the director
   to decide. I'm noting it so it doesn't surface in the build.
3. **Field Guide: the + and account buttons are tools, but they're loud on
   purpose.** They're orange on navy, the brand's action colour, on a
   scalloped badge. "Tools are quiet" has to read as "the *glyph* is drawn
   at key weight, the *button* keeps its loudness." Otherwise the
   direction contradicts a shipped colour rule. None of the cards shows the
   top-right buttons, so add them to the stress set for all three.
4. **Timetable Sorts: weight at 12px.** A 2-unit stroke on a 24 grid comes
   out at 1px in the 12px filter chip and about 0.75px for the 10px map star
   if it's ever outlined. A type-weight system has to define **optical
   masters** (a heavier 12px cut, like a caption size of a typeface), or the
   chips go grey. This is a grid requirement for phase 2, and it decides
   whether Timetable can work at all on 12px chips. Field Guide's district
   dashes have the same problem (turn 4 saw it). Cut Paper is the least
   exposed.
5. **Cut Paper: a tool outranks content in the row.** The delete × in the
   row crop is the heaviest mark after the stamp. Today it's a quiet
   ink-2 text ×. "Secondary marks never outrank content" and "closer to the
   X, it's not interactive" both point to keeping it light. The card should
   show the row × at its real weight, as Cut Paper would actually ship it.
   Otherwise the owner judges a row the direction wouldn't produce.
6. **The dotted cut-here star (Cut Paper)** only appears where the open star
   appears today: the tag (20px) and the add form (16px). It never appears
   on the map or in rows ("No star unless it's been starred"). So the dots
   live in two calm places, which caps the "dots add noise" risk. That's
   worth one line on the card, because the owner will picture dotted stars
   everywhere.
7. **Any new star shape reaches gesture-adjacent code.** The Pencil Star's
   five strokes trace the star's outline, and the starred-cluster cutout
   copies its shape. A direction that changes the star's silhouette (Cut
   Paper's off-true star, Timetable's mitred star) means re-authoring
   `pencilStarMarkup` and the cutout, and in phase 3 it trips the gesture
   gate (the "84 + 8 (+ N8-a)" star gate). Field Guide keeps today's star,
   so it costs nothing here. This isn't a reason to choose: it's a cost
   phase 2 should know about.
8. **Coverage: 8 of 11 categories, the street glyph and 7 tools are unshown.**
   Street (today's dashed oddball), hotel, nature, area and other are the
   ones most likely to break a direction: nature next to a tree emblem,
   and "other" as a bare dot in a type-weight system. The owner said
   "I want to see every icon in the app up next to each other." Before
   he sees the cards, each one needs an **all-categories strip at 18px**
   (11 glyphs) plus the street glyph next to district. The rest of the
   tools can wait for phase 2.

### 4. Each direction's off-state stance, in one line each (no parity)

- **Field Guide:** off is a key mark. It's quieter than on, deliberately,
  because the user's own mark is the treasure.
- **Cut Paper:** off is the dotted line *before the cut*. It's a different
  kind of mark from on, and it's 1-bit safe.
- **Timetable Sorts:** off and on are a typographic pair, ☆/★, at the same
  weight and outer size.

### 5. jobs.md

Written: `jobs.md`, short and plain, from his words for this phase. There's
no premise taken from the 10-07 note, and inferred jobs are marked.

### Open (for the director)

- The scope question on the mark-visited check (§3.1) should go into the
  owner batch alongside Q2 and Q3.
- I'd add these to every card before it reaches the owner: the unvisited
  tag stub, the top-right scalloped buttons, and an 11-category strip plus
  street. Without them, three of the jobs in `jobs.md` can't be checked.

NEXT: design director — fold the §3 structural items into the steer for
turn 6 (visual), decide on Field Guide's grey conflict, and add the
mark-visited scope question to the owner batch.

---

## Turn 6: design director, jam pass 2 (closes the jam)

Read: turns 4 and 5, `jobs.md`, `v2-card-1/2/3`. Still no scores. Scoring
comes on the built cards.

### 1. What I see on the v2 cards (steer, not scores)

- **The biggest risk is one nobody has named: in the rows and on the map,
  the three directions look almost the same.** The cup and fork badges in
  the row crops and the pins in the map crops are near twins on all three
  cards. The differences only show in the 24px stress row and in the tools.
  The owner looks at the row and the map first, so the likely reply is
  "what's different?". The fix is in the build list (§3): a side-by-side
  card, and the category glyphs shown big enough for the attitude to read.
  If a direction still looks like Today in a row, that's a finding about the
  direction, not a rendering problem, and the card should say so.
- **District is still the weakest drawing on every card.** Field Guide's
  dashed pentagon reads as a badge, and its dashes go to mush at 12px.
  Timetable's reads as a bowl or a hat. Cut Paper's block cut by two streets
  is the best of the three and the bar for the others. Street is still
  missing everywhere.
- **Timetable's proof line** (`REYKJAVÍK [cup] 08:15 · HÚSAVÍK [fork] 13:40`)
  is the most charming thing on the board. It *is* the attitude, so keep it.
  The tools in the stress row are still a generic line set. Add the Archivo
  cues from turn 4 (ink traps, squarish curves) now, not in phase 2,
  because "is it generic" is the very thing the owner will judge.
- **Cut Paper's "off true" doesn't show at row size.** If the hand only
  appears at 24px, the card should say "the hand shows at 24 and up", or
  push the cut further on the place glyphs.

### 2. Rulings on the open items

1. **The mark-visited check (the tag's not-yet-visited check): treat it as
   fixed, then ask.** The owner's "Visited should not change" plausibly
   covers the Visited segment's unvisited face. The conservative reading is
   fixed, unchanged and labelled "fixed" on every card. It goes into the
   owner batch as a yes/no.
2. **Field Guide's double grey: tools do not go grey.** Grey already means
   secondary numbers, inactive chips, and the signed-out disabled controls
   ("greyed out should offer sign in"). A grey tool would read as disabled.
   Field Guide's key is quiet **by weight only**, and drawn in the tools'
   current ink (navy, or the button's ink). Grey keeps its meaning: off.
   Inactive chips stay as they are (dashed hairline, grey glyph).
3. **The + and account buttons:** the button keeps its loudness (navy,
   scalloped, orange glyph, the brand's action colour). Only the glyph's
   drawing follows the direction. Add both buttons to every card. In Field
   Guide, check that a key-weight glyph at 24px in a 50px button isn't
   timid. If it is, the direction needs a "button sizes" rule, and the card
   shows it.
4. **Timetable at 12px:** the card shows a **12px caption cut** (one
   heavier optical master) in the chip strip, not the 24 master scaled down.
   If it still greys out, the card says so in Risks. The full set of
   optical masters is phase-2 grid work.
5. **Cut Paper's tools: lighten them now** (visual's question). The rule
   "tool strips are thinner than place pieces" is part of the attitude, so
   it belongs on the card. The row delete × in every direction is drawn as
   the direction would ship it, and stays quiet ("secondary marks never
   outrank content").
6. **Cut Paper's off star:** show the dotted cut-here line as the primary,
   with the solid knife line as a small inset beside it, labelled
   "fallback". Add one line on the card: "Only in the tag and add form.
   Rows and the map never show an unstarred star." The tag stub already has
   a dashed divider and a dotted stamp track. Look at all three dotted marks
   together in that crop. If they buzz, that's a strike against dotted, and
   the card says so.
7. **The star's shape:** directions may restyle it. The cost (the Pencil
   Star redrawn, the cluster cutout redrawn, and the full gesture gate
   rerun) goes into owner Q3 as one plain clause, so he can rule that the
   star's shape is fixed if he wants. Field Guide keeps today's star.
8. **Leaflet's zoom and the text × and ▼:** these are *in* by default and
   drawn on every card. That's a scope call we can make. It isn't an owner
   question, and he can overrule it.

### 3. What the concept phase builds (exact)

Six stills, all the same layout, 390 CSS px wide, rendered at 3x (1170 px),
so on his phone at full width every icon is at its real size. The real
Visited PNGs are used unchanged and labelled **FIXED**.

**Cards 0 to 3 (Today, Field Guide, Cut Paper, Timetable Sorts), each
with:**

1. Name, one line of attitude, then Says / Risks / Choosing (as v2).
2. **Full set at 24px**, in groups:
   - all 11 categories (restaurant, cafe, bar, attraction, nature,
     shopping, area, hotel, other, district, street);
   - star on and off, plus the mark-visited check (FIXED);
   - every control: account, +, add-open ×, sort, filters, locate, tag
     close, directions, sort/plan check, plan +, more, chevron, collapse ▼,
     row delete ×, plan + / ×, and Leaflet zoom +/−.
3. **Real-size strips, at the size each one ships:** categories at 12 (chip),
   18 (badge or near pin) and 23 (selected pin); tools at their inventory
   sizes; then the **1-bit strip** of the same.
4. **Context crops at real size:**
   - list header (▼, title, sort, filters, locate) plus the scalloped
     account and + buttons;
   - three rows: plain unvisited, visited (stamp), and selected navy
     starred;
   - the tag stub in **both** states: unvisited (Directions, Star off,
     Mark visited FIXED) and starred + visited;
   - the map crop: near pins of 4+ categories, one selected, one starred,
     one visited sticker (FIXED), and one district shape stop;
   - filter chips, active and inactive.
5. For Timetable, the proof line. For Cut Paper, the fallback inset.

**Card 4, side by side:** the same row, tag stub, map crop and 11-category
strip, stacked once per direction (Today, FG, CP, TS), on one phone-width
still. It answers "what's different?" and "every icon side by side".

**Card 5, dropped:** as v2 (Same Die, Spot, Badge, Code, Linocut), titled
"Dropped — say if you want any back".

These are concepts, but they're crafted. The owner reads a still at real
size as near-final. No canvas.

### 4. What goes to the owner, and when

- **`jobs.md` goes to the owner now**, as written. It takes no premise from
  the 10-07 note and marks what we inferred. I'd send it unchanged.
- The cards go to the owner only after I've scored them 9 or more.
- The questions below go to him now, with `jobs.md`. None of them blocks
  building the cards: each has a stated default the cards follow.

### 5. Owner questions (one batch)

1. "On Oct 7 you wrote 'the checked items are stronger visually than the
   open ones.' Is that still something you want addressed in this work? If
   so, is it that the open ones look too weak, or that the checked ones look
   too loud? Visited stays as it is either way." *(Default until he answers:
   no direction is built to fix it. Each one states its own stance.)*
2. "Does 'Visited should not change' include the outline check on the tag
   you tap to mark a place visited?" *(Default: yes, it's fixed.)*
3. "Is anything else fixed besides Visited: the pins' round shell and rim,
   the scalloped account and + buttons, the category colours, the star's
   shape? Changing the star's shape means redrawing the swipe-star animation
   and retesting the swipe." *(Default: the shells, buttons and colours are
   fixed; the star's shape is open.)*

Dropped as owner questions: is the star printed or applied (shipped answer),
where whimsy lives (our default, shown), and Leaflet zoom and the text
glyphs (in by default, shown).

NEXT: product designer (visual focus) — build the six stills in §3 (four
direction cards with full coverage, real-size and 1-bit strips and both tag
states, plus the side-by-side card and the dropped card), applying the
rulings in §2. Then I score all of them in one pass.

---

## Turn 7: product designer (visual focus): the six stills (built per turn 6 §3)

Stills, each 390 CSS px wide at 3x (1170 px), one PNG per card, in
`concepts/sketches/`. The source is `attitudes-v3.html` (Archivo from Google
Fonts):

- `v3-card-0-today.png`
- `v3-card-1-field-guide.png`
- `v3-card-2-cut-paper.png`
- `v3-card-3-timetable-sorts.png`
- `v3-card-4-side-by-side.png`
- `v3-card-5-dropped.png`

Each direction card shows:

- **Every icon at 24px**, labelled: 11 categories plus street; star off and
  on; the mark-visited check labelled FIXED; 18 control slots (account, add,
  add-open, sort, filters, locate, tag close, directions, check, plan +,
  more, chevron, collapse, row delete, plan add, plan remove, zoom + and
  zoom −).
- **Real-size strips:** categories at chip 12, pin 18 and selected 23; tools
  at their inventory sizes; then the same set in **1-bit**.
- **Context crops:**
  - the map strip with Leaflet zoom and the scalloped account and +
    buttons, plus the list header;
  - plain, visited and selected-navy starred rows;
  - the tag stub unvisited (with mark visited FIXED) and starred plus
    visited (with the stamp FIXED);
  - the map with near pins of 6 categories, one selected, one starred, a
    cluster, the real visited sticker (FIXED), a district outline and the
    district's approximate pin;
  - filter chips, active and inactive.

The visited images are the real PNGs from `inventory-png/`, unchanged.

**Rulings applied**
- **Field Guide:** tools are navy, never grey, and quiet by weight only (1.8
  round). Grey stays "off" (the inactive chip). The buttons keep their
  loudness and only the glyph changes. At 1.8 the account and + glyphs in
  the 50px scallop look slightly lighter than Today's but not timid, so no
  button-size rule is needed yet. Places keep one detail each.
- **Timetable:** it gets typeface cues now: flat cut ends, mitred corners,
  squarish curves, and **ink-trap gaps** wherever strokes meet (cup and
  handle, fork stem, stem and base on the bar and obelisk, the bag handle,
  the locate ticks). It also gets **optical masters**: 2.9 at 12px, 2.35 at
  18 and 2.0 at 24. The chip glyphs stay readable and don't go grey. "Other"
  is a squarish bullet. "More" is three squarish periods. The proof line
  stays.
- **Cut Paper:** tools are thinner strips (about 1.7) than the place pieces,
  and the row × is quiet (smaller, ink-2). The off star is dotted
  cut-here, with a **solid knife-line inset** labelled fallback, plus the
  line "only in the tag and add form: rows and the map never show an
  unstarred star". The place pieces now carry a fixed 3–5° lean (cafe,
  restaurant, bar, attraction, shopping, hotel) so the hand shows at row
  size.
- **District:** in every direction it is now **a block cut by streets**
  (Cut Paper's v2 idea, which turn 6 set as the bar). Each direction draws
  it its own way:
  - Field Guide: a solid block with two cream streets.
  - Cut Paper: an off-true block with two street gaps.
  - Timetable: an outline block with two street strokes.
- **Street (new everywhere):** each direction gets its own street icon:
  - Field Guide: a road in perspective with a cream centre line.
  - Cut Paper: a winding cut ribbon with a cream centre line.
  - Timetable: two converging road edges and a dashed centre, like a type
    sort.
- **The star on starred map pins** is each direction's own star. Today and
  Field Guide use the shipped star with the keyline. Cut Paper and
  Timetable use their own star with a paper halo and no keyline (that's
  sketch-level).

**Looked at, at phone size: what's actually different (the top risk)**
- **Honest finding, said on card 4:** in a row and on the map, **Field Guide
  and Cut Paper differ from Today only by one detail per glyph** (steam, a
  lean, cut streets). At 18px the place glyphs are still filled
  silhouettes. **Timetable is the only direction that reads differently at
  a glance** (outlined places), and it holds up on the map better than
  expected. That's because of the 2.35 cut at 18px, and because the pin's
  rim and the glyph now share a weight.
- In all three, the real difference is in the **district and street icons,
  the tools, and the tag stub**. Field Guide is the closest to Today in
  feel, and also the calmest.
- **Cut Paper's tag stub:** the dotted star sits among the dashed dividers
  and the dotted stamp ring. They don't buzz, but at 20px the dotted star is
  the faintest mark in the stub and reads as "missing" more than as "cut
  here". That's a mild strike against dotted, and the card says so through
  the fallback inset. My read: the solid knife line is the better shipping
  answer.
- The **thinner Cut Paper tools** make its account glyph in the scallop the
  most timid of the three. Its tools are now hard to tell from Field
  Guide's.
- **Timetable risks**, as named on its card: tools are close to a standard
  line set, and the character lives in the places, the proof line and the
  traps. On the map it's the lightest, but it passes.

**Not built (named)**
- Optical masters exist for Timetable only; the others are scaled.
- Cut Paper and Timetable stars on map pins have no `--star-deep` keyline.
- The Pencil Star and the cluster cutout aren't redrawn (cost noted in
  owner Q3).
- Leaflet's real Lucida glyphs render in the fallback font in Chromium, as
  they do in the inventory.

NEXT: design director: score the six stills in one pass (cards 0–5 at
`concepts/sketches/v3-card-*.png`). The point I most want judged is card 4:
is "Field Guide and Cut Paper are near-Today in rows" a reason to push them
further, or an honest result to show the owner as it is?

---

## Turn 8: product designer (systems focus): coverage check on the v3 cards

Full table in `coverage.md`. In short:

- **Jobs 3 to 7 pass on all three directions.** Rows (including the selected
  one), the tag in both states, the map, the 12/18/23 strips and the 1-bit
  strip, all 11 categories plus street, the dropped card, and the real
  Visited marks labelled FIXED.
- **Blocker: jobs 1 and 2 aren't on any still.** The owner's first ask was
  the brand's attitude and what supports or works against it. The cards
  show three *directions*, each with its own attitude, but the shared ethos
  ("printed with care, marked by hand, kept like a souvenir", printed vs
  stamped) and the supports/detracts list exist only in this jam. Fix: one
  card before card 0, "The brand, in plain words", with the ethos line, the
  printed/stamped rule, and supports vs works-against in about ten short
  lines. Its content is for the visual designer and director to set. Turn 1
  §4, turn 2 §4 and turn 3 §2 already have it.
- **Turn-5 structural items:** all resolved at sketch level. The star-shape
  cost is mostly moot: all three keep the shipped filled star, so the
  Pencil Star and the cluster cutout don't change. Only the off star
  differs, and it lives outside the gesture code.
- **New:**
  1. In Timetable's tag stub, its mitred star-off sits next to the fixed,
     round-jointed mark-visited check. That's two grammars in one strip.
  2. Field Guide's and Cut Paper's tools have converged. Their difference
     in kind is now only in the place glyphs.
- **Nit:** no district/street row in its diamond shell on any card.

NEXT: design director — score with the jobs 1–2 blocker in hand, and
decide whether "The brand, in plain words" card is added before the owner
sees anything.

---

## Turn 9: product designer (visual focus): round 2 stills (per scores.md round 1)

Source: `concepts/sketches/attitudes-v4.html`. The stills are 390 wide at
3x:

- `v4-card-brand.png` (new, goes in front)
- `v4-card-0-today.png`
- `v4-card-1-field-guide.png`
- `v4-card-2-cut-paper.png`
- `v4-card-3-timetable-sorts.png`
- `v4-card-4-side-by-side.png`
- `v4-card-5-dropped.png`

The v3 stills stay as history. Nothing went on the icon canvas.

**Brand card** (systems' words from `brand-card.md`, unchanged, and none
of the team-only source notes)
- Four statements, each followed by one plain sentence.
- "The app prints. You stamp.": a printed CAFE · REYKJAVÍK label beside the
  real tag VISITED stamp, marked FIXED.
- "Icons are the furniture": a crop of the Savoy label's luggage
  pictograms (`ref-savoy-luggage.jpg`, cropped from the inspo).
- Supports / Works against in two columns, six lines each, with two tiny
  examples: the fixed check next to "Lightly rounded corners", and Today's
  sort icon (line plus solid) next to "mixed at random".
- I changed the closing line to "The directions below are ways to live by
  this", so it doesn't commit to three (see Cut Paper).

**The core fix: each direction's tools now have their own grammar**
(terminal, corner, construction) with no added ink:
- **Field Guide:** square-cut ends with softened corners, like the visited
  check (butt caps plus a small rounding filter), and **inlaid knobs** (a
  navy disc with a cream centre) on filters and locate. The cream inlay ties
  the tools to the places.
- **Cut Paper:** **filled strips with angle-cut ends** (parallelograms, not
  strokes), about 1.6–2.0 wide, thinner than the place pieces.
- **Timetable:** the same type cut, now **lightly rounded** with the radius
  taken from the check (the rounding filter instead of mitres), plus
  **squarish rings** as the visible type trait: the account head, locate and
  directions are rounded squares. × and + are proportioned to the caps.

**Field Guide fixes**
- The **cream-inlay device is on all 11 places**, one inlay each:
  - restaurant: fork slots
  - cafe: steam inside the cup
  - bar: olive
  - attraction: band
  - nature: trunk line
  - shopping: fold line
  - area: hatch
  - hotel: blanket edge
  - other: ring
  - district: two streets
  - street: a dashed centre line
- Street is redrawn as a curved road band with a dashed cream centre line,
  not a cone.
- The copy says plainly: "The closest to Today: the evolutionary option",
  and "Choosing: Today, made into one printed family".

**Cut Paper fixes**
- The lean is gone. The scissors are in the silhouette:
  - a flared cup with a crescent-bite handle and a leaf saucer;
  - a flared bar glass;
  - an obelisk on a cut mound;
  - a three-tier scalloped tree;
  - a bag with a curved mouth;
  - area split by an S-cut;
  - a curved headboard;
  - "other" as a disc with a bite.
- Street is one tapered ribbon.
- The off star is the solid knife line. The dotted star has moved to card
  5 with one line.

**Timetable fixes**
- Lightly rounded throughout.
- District is redrawn as an outline block with a T-junction of streets, so
  the cross is gone.
- The tag stub's star, directions icon and the fixed check now share
  softened corners.
- The Risks line now reads "Outlined icons are the common modern default;
  its character depends entirely on the cut."

**Side-by-side card:** the editorial is trimmed to "This is how far apart
they are." Bug found and fixed while looking: the rounding filter had
erased zoom −, because a horizontal line has a zero-height bounding box.
The filter region is now in user space.

**Looked at, at phone size: the side-by-side verdict**
- **Timetable** is clearly different at a glance, as before. The rounding
  makes the star, the directions icon and the fixed check read as one
  family in the tag stub.
- **Field Guide vs Today:** the inlays show at 18px in the category strip
  and the row badge (steam, slots, olive). It now reads as "Today, as a
  printed family" rather than "Today, tidied". The tool trait (square-cut
  ends) shows at 24px, on ×, + and chevron. In the tag stub, at 20px, it's
  barely visible.
- **Cut Paper vs Field Guide:** the **category strip is now clearly
  different** (flares, bites, the S-cut, the ribbon). The angle-cut tool
  ends show at 24px. **But in the row, the tag stub and the map, it still
  sits near Field Guide.** Both are filled glyphs on the same badge, and
  directions and the off star look nearly identical in the stub. By the
  director's rule, **my read is that it moves to dropped.** I've kept the
  card built so the director can check it before ruling.

**Not built / named**
- Optical masters are still Timetable-only.
- On map pins, Cut Paper's and Timetable's stars have no keyline.
- The rounding filter is a sketch technique. Phase 2 draws real radii.

NEXT: design director: score round 2 (the brand card plus cards 0–5,
`v4-card-*.png`), and rule on Cut Paper. By your side-by-side test, I'd
move it to dropped and send the owner Field Guide plus Timetable, with
Today as the reference.

---

## Turn 11: product designer (visual focus): round-2 fixes applied (scores.md round 2)

The stills are re-rendered to the same `v4-card-*.png` paths.

- **Brand card:** the "app prints" sentence is replaced verbatim, and the
  printed example is now a printed "TYPE" label. Nothing else changed.
- **Timetable:**
  - The account head and the directions compass are circles again.
  - The off star in the tag strip is 23px, so its ink matches the fixed
    check.
  - District is redrawn as an outlined block cut by two streets (a masked
    channel, so the block reads as four outlined pieces).
- **Cut Paper:**
  - It's off the side-by-side card, which now shows Today, FG and TS.
  - The dropped card now has its 11-category strip at 18px, with "Its own
    shapes, but in rows, the tag and the map it looks like Field Guide."
  - Its card 2 still renders to `v4-card-2-cut-paper.png` as a record. It
    isn't for the owner.

Looked at, at phone size: the TS tag strip now reads as one family (the
star and the check are the same size). The TS district reads as city
blocks, not a cross.

---

## Turn 12: product designer (systems focus), round 3 opens

New this round (all in `../owner.md`): the owner's rule on the v4 cards
("the pin/place icons need to be solid and outlined icons should be used
when something has yet to be tapped by me like Star and visited. So field
guide, cut paper, spot pictograph are working best for me — and they can
be inside a stroked circle"), and the + joining the project ("Build the
matched icon but we need to include this in the icon project everything
is inconsistent"). `jobs.md` is updated: jobs 8–13 are new, and the later
jobs gain "the + takes the project's weight".

Real draws (python `secrets`). Oblique Strategies: **"Give way to your
worst impulse"** and **"Change instrument roles"**. Borrowed fields:
**library card catalogues** and **laundry care symbols**. All four are
used below.

### 1. What his rule settles (structure, not looks)

His rule is a state grammar, and it's the brand's own law made visible.
A library catalogue card is a printed form with empty boxes, and the clerk
fills them in. **The form prints the blank; you fill it in.** An outline is
the printed blank (an empty star, the outlined check). A solid mark is the
filled-in entry (the orange star, the stamp). The brand card already says
"The form is printed … What's filled in about a place is stamped". He has
now told us what that looks like in an icon.

It also answers three things we've been carrying:

- **The 10-07 note ("the checked items are stronger visually than the
  open ones").** He now wants exactly that difference, as the signal:
  outlined = waiting, solid = done. The old Q1 (should open get stronger,
  or checked get quieter?) is answered by his rule. I'd retire it from the
  owner batch. The director decides.
- **The mark-visited check** (the outlined check on the tag) already *is*
  his rule. Visited stays as it is, and now it has a reason. The old
  "fixed or redrawn?" question can be retired too.
- **District and street become solid.** Today they're dashed strokes (the
  inventory's outliers). FG, CP and Spot already draw them solid.

### 2. "Tapped by me": what the rule covers (job 10)

Every on/off icon in the inventory, sorted by what kind of state it is.
This is my proposal. The line between "a mark" and "a setting" is the
thing to check with him, if the director wants to.

| On/off icon | Kind of state | Under his rule |
|---|---|---|
| Star (tag, add form) | **A mark I put on a place** | Outline = not starred, solid = starred. Today already does this. |
| Visited (tag check → stamp; map sticker) | **A mark I put on a place** | Outline check → stamp. FIXED, and it already fits. |
| In a plan (Plans: + to add, × to remove, then a stop number) | **A mark I put on a place, inside a plan** | Open. A stop is "tapped by me". Today the not-yet state is a text + and the done state is a number: not outline vs solid, but it is blank vs filled in. I'd leave it alone this phase and name it. |
| Filter chips (active / inactive) | A view setting, not a mark on a place | **Out.** The place glyph stays solid either way; the chip shows the state (today a dashed hairline and a grey glyph). |
| Sort tick, current-plan tick | A choice in a menu | **Out.** |
| Selected pin (inverted, solid field) | Which place I'm looking at | **Out, but it agrees with the rule:** the pin I tapped fills. Worth one line on the card. It makes the rule feel deliberate. |
| Far pin (an empty 16px ring, no glyph) | Zoom level, not state | **Collision to watch.** An empty ring is literally an outlined shape, so under his rule it could read as "not tapped yet". The far pin sits beside the far sticker (visited), so "empty ring = not visited yet" is even *true*. I'd show it and say so, not change it. |
| Approximate pin (dashed rim) | Data quality | Out. The dash is on the circle, not the icon. |

Proposed definition, for the card in plain words: **"Outlined means a mark
you haven't made yet: Star and Visited. Everything else (filters, menus,
which pin is open) shows its state another way."**

### 3. The real structural question: does outline mean only one thing? (job 11)

If outlined means "not tapped yet", then **every other outlined icon
carries a second meaning**. Today, and in Field Guide, all the tools (sort,
filters, locate, account, directions, ×, +, chevron) are line drawings.
Line drawings aren't quite outlines (a + or × has no inside to fill), but
account, locate, directions and the off-star are closed shapes drawn as
edges. In the tag they sit side by side: Directions, Star off, Mark
visited. That strip is where a user could read "Directions: not tapped
yet".

The system can go two ways. They differ in kind, and the three liked
directions split along this line, which is why I think it's the right axis
for round 3:

- **A. Outline is reserved.** Solid is the default for *everything*:
  places, and tools too. The only outlined icons in the app are the blanks
  waiting for you (star off, mark visited). Tools are solid strips and
  shapes (Cut Paper's angle-cut strips, Spot's flat primitives; a solid
  compass disc with a cream needle, a solid person). One look and you know
  what's waiting. *Risk:* a solid toolbar gets heavy (Spot's "barcode"
  tools, turn 2), and solid tools compete with the solid places. Tools
  would need to be smaller or quieter in ink than places, not thinner.
- **B. Two registers, kept apart by kind.** Places solid. Tools are line
  drawings (Field Guide's key), made only from *open* strokes where they
  can be (+, ×, ticks, a chevron; the compass as a ring with a solid
  needle, which already has a solid part). The only *closed* outlines in
  the app are the blanks. *Risk:* open line vs closed outline is a real
  difference, but subtle at 20px. The tag strip is the test.

"Change instrument roles", pushed a step further, gives a third option,
which I offer as the wildcard: **C. The circle does the work.** The circle
becomes the "this is a place" signal: a solid glyph in a ring is a place,
and anything without a ring is a tool. Then the tools can be drawn any
way (line is fine), and outline vs solid only has to work *inside* the
state marks. It leans on the circle being used everywhere a place
appears, which is §4.

All three keep Visited exactly as it is. The visual designer should push
or kill any of them on look. I'd show A and B at least, because Field
Guide's tools are B, and Cut Paper's and Spot's are A.

### 4. The stroked circle as grammar, not ornament (job 12)

"Give way to your worst impulse": I tried putting *every* icon in a
stroked circle, tools included. It falls over at once. The toolbar becomes
a row of coins, the + becomes a circle inside a scallop, and the circle
stops meaning anything. That's the Badge direction we dropped ("containers
add ink"). So the impulse proves the rule by failing: **the circle has to
mean "a place", and only a place.**

Laundry care symbols work this way. The outer shape says the family (a
circle is dry cleaning, a square is the dryer, a triangle is bleach), the
inside says the detail, all at one line weight, readable at 5mm. For
Triplet:

- **Circle = a place.** The row badge and the map pin already are this (a
  2px rim, a solid glyph). The filter chip shows the glyph *bare*
  (`glyphHtml()`: "Bare glyph, no shell -- chips"). It's the one place a
  place glyph appears without its circle. Whether a 12px glyph can carry a
  circle (it grows to about 16px) is a drawing question for phase 2. For
  round 3 I'd show the chip both ways.
- **District and street: circle or diamond?** He wrote "circle". Today the
  shapes sit in a diamond shell (row, plan stop), which already says "an
  area, not a point" by family, the laundry way. My lean: the diamond is
  the shapes' version of the circle (same stroke, other shell). But he may
  mean circle for everything. Show both on the card, and say which we
  recommend.
- **The rim is a line, so it takes the line weight** (§5).
- **The selected pin fills its circle** (§2). That stays.

### 5. One weight: the + and "everything is inconsistent" (job 13)

The measured weights (account 2.00, row category rim 2.00, list toolbar
1.50, locate-me 2.08, + 2.00) look random, but they have one cause. Every
icon sets its stroke in its own **viewBox units** (24 wide), and they
render at different sizes, so the same number comes out at different
on-screen weights:

- sort and filters: stroke 2 drawn at 18px = **1.50px**
- locate: stroke 2.5 drawn at 20px = **2.08px**
- account: stroke 2 drawn at 24px = **2.00px**
- the +: stroke 1.8182 at 26.4px, back-calculated to hit **2.00px** (its
  own comment says so, `index.html` around line 2773)

So the fix is a rule, not a redraw: **line weight is set in on-screen
pixels, once, for the whole app**, and each icon is drawn (or scaled) to
hit it at the size it ships. Three of the five already sit at 2.00, so
2.00 is the obvious candidate. The visual designer and the director set
the number. It may need a heavier cut at 12px (Timetable's optical masters
showed that). Phase 2's grid owns it, and the + then takes it (one
attribute in `setAddBtnGlyph()` and in `#floatingAddBtn`).

For round 3, one still with every line in the app side by side (the +,
account, sort, filters, locate, the tag ×, the rims, the off-star and the
fixed check), first at today's weights and then at the one rule, shows him
the problem and the fix in one look. It's small, and it closes job 13.

This raises a question for the visual designer. The off-star and the fixed
mark-visited check are outlines (stroke 2 and 2.05 in a 24 box, about 1.7px
at 20px). If the system weight is 2.00, do the blanks go to 2.00 with
everything else? Visited's check is fixed, so the answer may be that the
blanks keep their weight and the system matches *them*. Measure first.

### 6. How Field Guide, Cut Paper and Spot combine (job 8)

Under his rule all three now share one structure: a solid place in a
circle, an outlined blank, a solid done mark. **What separates them is
only how the solid place is drawn:**

- Field Guide: a silhouette with **one cream detail printed into it**.
- Cut Paper: **the cut is in the outline** (flares, bites).
- Spot Pictogram: **built from a few geometric primitives**, no detail.

They aren't rival systems any more. They're three ways to draw one
system's places, and they can mix: for example, Spot's construction (the
grid), Cut Paper's one cut where the thing's own shape asks for it, and a
cream inlay only where a silhouette alone won't read. That's a drawing
call, so the visual designer and the director own it.

The tools are where they still differ in kind (§3: FG is B, CP and Spot
are A). So my proposal for round 3's concepts: **build them on the outline
question (A reserved, B two registers, maybe C), each drawn in whatever mix
of FG, CP and Spot the visual designer thinks best**, rather than three
cards that differ only in how a cup is cut. The round-2 lesson holds: if
two concepts look the same in a row, the tag and on the map, they're one
concept.

### 7. Revised directions, or ask to move to phase 2?

Not my call: the director decides. What I can say from structure: the
place-drawing question (§6) is already a phase-2 drawing question, and the
weight (§5) is a phase-2 grid rule. **What's still a phase-1 question is
§3 (is outline reserved?) and §4 (circle or diamond, and the chip).**
Those change what every icon *is*, and he hasn't seen them. One short
round showing A vs B (and the circle) on the tag strip, a row, the map and
the toolbar, plus the weight still, would let him approve a direction
*and* phase 2 in one reply.

### Open questions

1. Plan membership (+ → number): is it "tapped by me" under his rule? (I'd
   leave it as it is this phase.)
2. District and street: circle or diamond? (Show both.)
3. Do the blanks set the system weight, or follow it? (Measure the fixed
   check first.)
4. Retire owner Q1 (the 10-07 note) and the mark-visited question as
   answered by his rule? (Director.)

NEXT: product designer (visual focus) — push or kill the outline grammars
(A reserved, B two registers, C the circle does the work) on look, decide
how FG, CP and Spot mix in the place drawings, and say whether the
line-weight still is worth adding.

## Turn 13: product designer (visual focus), round 3

This turn answers turn 12's NEXT: push or kill A / B / C on how they look,
settle the FG / CP / Spot mix, and say whether the line-weight still is
worth adding. I drew all three at real size before deciding anything. The
sketches are 390 wide at 3x, so they're readable on a phone:

- `concepts/sketches/r3-jam-1-blanks.png`: the tag strip today, under B and
  under A, then starred, then the map buttons and list header in B and A.
- `concepts/sketches/r3-jam-2-places.png`: the two place concepts below,
  with all 11 at 24px, rows, the map, chips, and district/street in a
  circle and in a diamond.
- `concepts/sketches/r3-jam-3-weight.png`: every line at the size it
  ships. Today first, then one rule at 1.5px, then one rule at 2.0px.
- Source: `concepts/sketches/jam-r3-visual.html`. It has the v4 glyph sets
  and helpers plus a round-3 block. Strokes are set in on-screen px with
  `u()`.

Real draws (python `secrets`). Oblique Strategies: **"Cut a vital
connection"** and **"Use fewer notes"**. Borrowed fields: **road marking
paint** and **railway signalling**.

### 1. A and B are one concept. The law is "only blanks are empty"

Once A and B were drawn side by side, they turned out to differ in **three
icons**: account, locate and directions (plus how heavy the sort heads
are). The +, ×, chevron and filter lines look the same either way, because
a 2px bar and a 2px line are the same mark. By the round-2 rule ("if two
look the same in a row, the tag and on the map, they're one"), A vs B isn't
two concepts. It's one law with one question.

Here's the law, sharpened from B. "Cut a vital connection" became: cut the
link between *outlined* and *line*.

> **The only empty shapes in the app are the blanks you haven't filled**
> (star off, mark visited). Tools can be lines, but any closed shape in a
> tool has something solid inside it.

What that changes for the tools:

- Account: a solid head with an open shoulder line. Today the head is an
  empty ring.
- Locate: a solid centre dot. Today it's an empty ring, and Field Guide's
  version had a cream hole.
- Filter knobs: solid. Field Guide's inlaid knobs had holes, so they go.
- Directions: a ring with a solid needle. It already passes.
- +, ×, chevron and sort: open lines. They already pass.

Railway signalling backs this up from the other side. A signal lamp that
isn't lit is still there, as an empty hood the same shape and size as the
lit lamp. So a blank is **the exact hollow of its done state**: the same
outline at the same size. The star off already is the hollow of the star
on, and the mark-visited check is the hollow of the stamp's check. That's
how it should stay. A blank is never drawn smaller than its filled form,
so v4's Field Guide star off, scaled to .9, goes.

**One question is left: Directions.** In the tag strip it sits next to the
two blanks. There are two ways to draw it:

- B: a ring with a needle. It's the app's own compass, it's never empty,
  and it reads as a tool.
- A, from road paint (the arrows painted on a road are solid; the empty
  painted boxes are the bays waiting for a car): a solid turn arrow.

On sketch 1, A's arrow is clear, but it says "turn right", a literal
instruction, where the app means "get directions". It's also the only
solid navy thing beside a star that fills in solid when you tap it. I lean
B. A's solid account bust in the navy scallop does look good, though. I
think that's worth one line in front of the owner, not a concept of its
own. This is an opinion, not a fault in A.

### 2. Kill C as a standalone. Keep the circle as the place shell

The collision turn 12 found is in the tag strip: Directions, Star, Mark
visited. No place appears there, so a circle can't fix it. C's promise that
"tools can be anything" breaks exactly where it was needed. The circle
stays in every concept, because he said places "can be inside a stroked
circle", and the row badge and the pin already are one. I'd make
**circle = a place** (turn 12 §4) a rule.

### 3. Places: two concepts that differ in kind

Turn 12 asked that concepts not differ "only in how a cup is cut", and I
agree. FG, CP and Spot drawn as three cards would look like one card at
18px; the director already ruled that CP looks like FG in the row, the tag
and the map. Now that the circle is in, the thing that does differ in kind
is **how the place sits in its circle**.

**Concept 1: Specimen.** The solid place floats inside the rim, with paper
all round it. The mix follows "Use fewer notes": each glyph gets one note
of character, never two.

- **Base:** Cut Paper's silhouettes. The scissors are in the outline: the
  cup's flared lip, the scalloped tree, the bag's curved top.
- **Construction:** Spot's primitives as the phase-2 grid (circles,
  straight cuts, few nodes). That's how they get drawn, not a look.
- **Inlay:** Field Guide's cream inlay only where the object really has a
  second colour: the gaps in a fork, a road's centre line, a district's
  streets. Road paint again: an inlay is paint that's really there. The
  café's steam and the bag's rivets go.
- In the sketch: restaurant, district and street are FG; the other eight
  are CP; "other" is a plain solid dot.

**Concept 2: Roundel.** The circle is the scissors. Each place is a
close-up cropped by the rim, like a coin die or a porthole: the bowl of a
glass with its stem running out the bottom, a tree with its trunk cut off,
a district as a fragment of a street map. He has already said yes to the
crop ("I want it centered in the circle even if it's slightly cut off").
It's the purest form of "solid places inside a stroked circle", with the
frame doing Cut Paper's cutting.

What the sketch shows at phone size:

- Roundel's glyphs are about a third bigger at the same 24px, so they read
  better. Bar, nature, café, restaurant and street are the best icons on
  the page.
- It puts more ink in every pin. On the map that cuts against "too noisy".
- Some crops turn into other signs:
  - A diagonal slash for area read as "no entry". I redrew it as a hatched
    coin, which is better but still weak.
  - The first district looked like a crosshair, so I moved its streets
    off-centre.
  - The first hotel looked like a half-moon, so I zoomed it out.
- Every Roundel drawing has to pass a "what other sign is this?" test.
  Specimen doesn't carry that risk.
- Specimen is calm and closest to what he picked. Roundel has the most
  character.

I'd take **both** forward as round 3's "more than one concept". The law
(§1), the circle and the weight (§5) are shared. That way the two concepts
differ only in the drawing, which is where his choice really is.

One thing turned up in both: **"other" as a dot in a ring reads as a
selected radio button.** It does today too. It's a phase-2 drawing fix (an
asterisk or a solid diamond, for example). I'm naming it, not solving it.

### 4. District and street: circle (my lean, against turn 12's diamond)

Sketch 2's first strip shows district and street in the circle, then in
the diamond. To fit the diamond, the glyph has to shrink to about 0.6
scale, because the diamond's inscribed square is smaller. That makes them
the two hardest icons in the row to read. Why I lean circle:

- He wrote "circle".
- He asked for fewer variations.
- The drawing inside already says "area" (a block cut by streets, a road).
- Shapes have no map pin ("just the area box"), so the diamond only ever
  shows up in rows.

That's an opinion, so both stay in front of him, with the circle as our
recommendation. The plan-stop shell follows whichever wins.

### 5. Line weight: the still is worth it, and it argues for 2.00px

Sketch 3 shows every line at its ship size. Today they run from 1.28px
(the tag's ×) to 2.08px (locate). The surprise is the FIXED check. At
1.52px it's a hollow bar, with two edges close together, so **it reads as
heavy as a 2.0px single line**, not a 1.5px one.

- In the 1.5px column, the star off goes weaker than the check. That's the
  10-07 complaint ("checked stronger than open") all over again.
- In the 2.0px column, the star off, the check and the tools sit together
  as one family.

My proposal: **one line weight, 2.00px on screen, for every single line**:
tools, the +, the account, the rims, and the star off (1.67 → 2.00). The
check stays fixed and already matches by eye, so the blanks follow the
system rule and the check doesn't force it.

What moves:

| Icon | Today | Proposed |
|---|---|---|
| Sort, filters, chevron | 1.50px | 2.00px |
| Tag × | 1.28px | 2.00px |
| Locate | 2.08px | 2.00px |
| Directions | 1.90px | 2.00px |

The + and the account are already 2.00px, so they don't move. At 2.00px
the header tools are still lighter than its 14.5px bold caps title, so
"tools stay quiet" holds. One thing to watch: the tag × at 2.00px and 14px
gets louder. If it does, the fix is a smaller ×, not a thinner line. A
heavier cut for 12px (the chips) is phase 2.

### 6. Chips: bare (my lean)

The rim reads in a 16px chip, but a chip is already a box. A ring inside a
box is "containers add ink". A chip is a filter, not a place, so the chip
itself is the shell. Sketch 2's last block shows all three versions.
Roundel can't go bare, because the crop needs its frame, so in Roundel the
chip carries the 16px roundel. That's one more cost to put on its card.

### 7. Feel

Nothing new in motion. Star off → on is the same outline filling with ink
(the Pencil Star, shipped). Mark visited → the stamp (FIXED). The law in §1
is what makes the fill legible: only an empty shape can fill.

### Proposed round-3 set (for the director)

Today (for reference), **Specimen** and **Roundel**, plus one shared rules
card. The rules card holds:

- the law in plain words
- systems' "tapped by me" table
- the weight still (today → 2.00)
- the Directions question for the tag strip (ring or arrow)
- district/street in a circle vs a diamond

Each concept card covers jobs 5, 6, 9 and 11–13: all 11 categories, rows
(plain, visited, selected + starred), the tag strip, the map, chips and the
header.

### Open questions

1. Directions in the tag: ring + needle (B, my lean) or a solid arrow (A)?
2. District/street: circle (my lean) or diamond? Show both.
3. Chips: bare (my lean) or in a rim?
4. Roundel's "what other sign is this?" risk: carry it to the owner, or
   should the director kill it now? I'd carry it. It's the only concept
   that differs in kind from Specimen.
5. The tag × at 2.00px: make it smaller, or let it keep a lighter line?
   Measure in phase 2.

NEXT: design director — steer round 3. Take Specimen and Roundel forward
on the shared law ("only blanks are empty"), the circle and the 2.00px
weight. Rule on the Directions question and on district/street. Then
systems runs coverage against jobs 1–13 on the built cards.

---

## Turn 14: design director, round 3 steer

I read turns 12–13, the three r3 sketches at phone size (plus crops of the
24px strips and both maps), owner.md (newest at the bottom), jobs.md and
owner-taste.md. No scores this turn: it's a steer on the jam proposals.
I score the built cards in one pass.

My own real draw (python `secrets`): **"The inconsistency principle"** and
**herbarium sheets**. Both are used below (§1 and §3).

### 1. The law: "only blanks are empty". ACCEPTED, A and B merged

Visual is right: A and B differ in three icons, so they're one concept
with one law. It's also the cleanest reading of his rule: "outlined icons
should be used when something has yet to be tapped by me". The law, for
the rules card, in his terms:

> **Outlined means you haven't marked it yet (Star, Visited). Nothing else
> in the app is an empty shape.**

The tools that change: account (solid head, open shoulders, B's version),
locate (solid centre), filter knobs (solid). +, ×, chevron and sort are
open lines and pass. A blank is the exact hollow of its done state, at the
same size (the railway lamp). FG's star off at 0.9 scale goes.

I took "the inconsistency principle" seriously, and it gives a reason he
can hold us to. He said "everything is inconsistent". The brand already
has exactly one place where inconsistency is wanted: **your own marks**
(the stamp's tilt, the sticker's peel corner and size, the Pencil Star's
hand). So: **everything the app prints is perfectly consistent (one
weight, one grid, one shell); only your marks vary.** That's the law's
second line, and it's why the 2.00px rule (§6) isn't fussiness. Put it on
the rules card, one line, under the law.

The law has two collisions. Both stay as they are, and each goes on the
rules card as one line, not as a question:
- **Far pin (an empty 16px ring):** it's an empty shape, but what it stands
  for (a place you haven't visited) is "not marked yet", and it sits beside
  the far sticker. It agrees with the law. Show it.
- **Plans + → stop number:** that's blank → filled in, not outline →
  solid. Named, and left alone this phase.

Two questions are retired from the owner batch, because his rule answers
them: the 10-07 "checked vs open" question, and whether Visited includes
the mark-visited check (it does, and the check is already his outline).

### 2. C (the circle does the work): KILLED

Agreed, for visual's reason: the collision is in the tag strip, where no
place appears, so the circle can't fix it. It goes on the dropped strip.

### 3. Specimen vs Roundel: BOTH FORWARD, with conditions

They differ in kind, in how the place sits in its circle. The herbarium
draw names it. A herbarium sheet mounts the **whole** specimen with paper
all round it, never cropped. A coin die **fills** its field and lets the
rim cut. Specimen is the herbarium and Roundel is the coin. That's a real
choice, and it's his to make: "centered in the circle even if it's
slightly cut off" points one way, "too noisy" the other. Use the
herbarium/coin line on the cards if it reads in plain words; drop it if it
needs explaining.

Before I score either, these must hold. I can see the owner's objections
from here:

**Both:**
1. **Size must not be the difference.** In the sketch Roundel reads "a
   third bigger", so the honest objection is "Roundel is just Specimen
   zoomed in". Draw Specimen at the **largest size that still floats**
   (paper all round, but not a thumbnail). Then the difference has to be
   float vs crop, not small vs big.
2. **Equal visual mass across all 11** ("icons don't fill the same visual
   space"). Herbarium logic: every specimen gets the same optical weight on
   its sheet. Today the Specimen café and tree are heavy, and the
   attraction and cocktail are light. Balance by eye, and show the 11 in
   one strip so he can check it.
3. **"Other" can't be a dot in a ring.** It reads as a radio button, and
   under the law it reads as a selected option. Draw something solid that
   isn't a control (the designer's call). The owner reads stills as
   near-final, so a radio button is an objection, not polish.
4. **Lightly rounded**, like the fixed check ("Checkmark was only supposed
   to be lightly rounded like the rest of the icons"). Solids get the same
   light corner: no sharp mitres, no pillowy blobs.
5. **The same icon on the map, in the row and in the tag** ("icon is
   treated differently for category in the pop up than on the map —
   why?"). Show the tag stub's category circle on each card, next to the
   row and the pin.
6. **A dense map.** Noise is his original complaint, and three pins in a
   park won't show it. One map crop at a realistic density: 15–20 pins, a
   cluster, the selected pin, a starred pin, two stickers and a district,
   plus a far-zoom strip (rings and far stickers). Use the same crop for
   Today, Specimen and Roundel.

**Specimen:**
7. At 24px the attraction (the obelisk reads as a bell or a bullet) and
   the area (two slabs) don't say what they are. Redraw them.

**Roundel:**
8. The bar reads as a funnel, the attraction as a bottle, the area as a
   barber pole or no-entry sign, the hotel as a blob. Every Roundel glyph
   has to pass "what other sign is this?" before it goes on a card. Write
   the misread for each of the 11 in your turn (not on the card), and fix
   the ones that fail.
9. Show the ink cost; don't explain it. The dense map does that.
10. The chip carries the 16px roundel (it can't go bare). State the cost in
    one line.

If Roundel still reads as "Specimen, bigger" on the side-by-side card
after fixes 1 and 8, I'll say so when I score, and it goes to the dropped
strip with Timetable. Then we find a second concept that differs in kind.
We don't send him one.

### 4. Directions in the tag: RING + NEEDLE. Not an owner question

B's compass. The arrow says "turn right" where the app means "get
directions". A solid navy arrow would also be the loudest thing in a strip
whose job is to show two blanks. The ring passes the law because the
needle is solid. This is a UI call, so it's ours, and it doesn't go to him
as a question. The arrow goes on the dropped strip with one line.

The account is ruled the same way: B's solid head with open shoulders.
A's full solid bust is handsome, but it adds mass beside the orange +, and
the law doesn't need it.

### 5. District and street: CIRCLE. Not an owner question

He wrote "inside a stroked circle". The diamond shrinks the glyph to about
0.6 scale, which makes these the two hardest icons in the row to read.
Shapes have no map pin, so the diamond's "area" signal only ever showed in
rows, and the drawing inside already says "area". The plan-stop shell
follows. The diamond goes on the dropped strip, small, with one line.

### 6. Line weight: 2.00px ACCEPTED

One weight, set in on-screen px, for every line: the rims, the +, the
account, the tools and the star off (1.67 → 2.00). The fixed check (1.52,
a hollow bar) matches a 2.00px line by eye, as sketch 3 shows. The 1.5
column shows why not to go lighter: the star off goes weaker than the
check, which is the 10-07 complaint again. The + and the account already
sit at 2.00, so "build the matched icon" is met without moving them.

- On the rules card, show **Today vs 2.00 only**. Drop the 1.5 column, and
  keep the one sentence on why 1.5 fails.
- Show the tag × at 2.00 in the tag crop. If it shouts, make it smaller,
  not thinner. The rule: **weight never varies; size does.**
- The rims on the map pins and in the 16px chip are lines too, so give
  their on-screen measure on the card. The 12px optical cut is phase 2.

### 7. Chips: bare for Specimen (accepted). Roundel: a 16px roundel, with its cost stated

A chip is already a container. His "can be inside a stroked circle" is
permission, not a rule.

### 8. The shared rules card: YES

One card, phone-readable, in this order:
1. The law in his words (§1), with the "only your marks vary" line.
2. "Tapped by me": a short table of 5–6 rows. Star and Visited follow the
   rule. Filter chips, the sort and plan ticks, and the selected pin show
   their state another way. The far pin and the Plans + get one line each.
   Plain words, no jargon.
3. One weight: today vs 2.00, every line at its ship size, with the + and
   the account marked "already 2.00".
4. Settled by the team (no question): a circle for districts and streets,
   the ring-and-needle Directions, bare chips (Specimen).
5. Staying as is, in one line: Visited (the stamp, the sticker, the
   mark-visited check), the pin shell, the scalloped buttons and the
   category colours.

### 9. Phase 2: YES, this round asks for it

What's left between the two concepts is a drawing question, and phase 2
(research, one grid, SVGs, the tool recommendation) is where drawing gets
done. The law, the circle and the weight are structural, and they're on
the rules card. So the send asks him two things, and only two:

1. "Specimen or Roundel (or a mix)?"
2. "OK to move to phase 2 with that and the rules card? That's research,
   one shared grid, every icon redrawn as SVG, the + and the account set to
   the project weight, and a recommendation on the drawing tool."

Nothing else goes to him. The send only goes if both concept cards and
the rules card score 9.

### 10. What to build (all 390 wide at 3x, phone-readable, crafted)

- `v5-card-rules.png`: the shared rules card (§8).
- `v5-card-0-today.png`: Today, with the dense-map crop added (otherwise
  reuse v4).
- `v5-card-1-specimen.png` and `v5-card-2-roundel.png`, each with:
  - the 11 at 24px in one strip (equal mass), plus a 12px strip and 1-bit
  - rows: plain, visited (the real stamp), selected + starred (navy)
  - the tag stub: unstarred and unvisited, then starred + visited, with
    its category circle, Directions, the star off/on and the FIXED check
  - the header: the account, the + and the list toolbar at 2.00
  - the dense map and the far-zoom strip (§3.6)
  - chips
  - three plain lines: what it is, what it's good at, what it costs
- `v5-card-3-side-by-side.png`: Today / Specimen / Roundel in the same
  row, tag strip and dense map crop. I check this card first.
- `v5-card-4-dropped.png`: Timetable Sorts (not on his list), C, the solid
  Directions arrow, the diamond shell and A's solid bust, one line each.

No editorial boxes arguing for a concept: let the frames do it. Quote his
words exactly.

### Open questions (mine, not the owner's)

- Is the starred tag (orange band, filled star) clearly the done state
  beside the hollow star of the other state? Stack both tag states on each
  card.
- On the map, the stars' paper halo and `--star-deep` keyline stay. Check
  that they hold up next to a Roundel pin.

NEXT: product designer (visual focus) — build the six v5 cards in §10 with
fixes 1–10. Then systems runs coverage against jobs 1–13 on the built
cards, and I score all of them in one pass.

## Turn 15: product designer (visual focus), the v5 cards (built per turn 14 §10)

The six cards are built. Each is 390 wide at 3x, in
`concepts/sketches/`:
- `v5-card-rules.png`
- `v5-card-0-today.png`
- `v5-card-1-specimen.png`
- `v5-card-2-roundel.png`
- `v5-card-3-side-by-side.png`
- `v5-card-4-dropped.png`

The source is `concepts/sketches/attitudes-v5.html`. It's the v4 glyph sets
and helpers plus a v5 block. It measures the ink first, then renders and
sets `window.READY`. The new sticker refs, with transparent backgrounds so
they sit on the map tiles, are `ref-sticker-near-t.png`,
`ref-sticker-starred-t.png` and `ref-sticker-far-t.png`.

### The turn-14 rulings, as applied

- **The law.** It's on the rules card in his quote and in plain words, with
  the "only your marks vary" line under it. The tools follow it: the
  account has a solid head with open shoulders, locate a solid centre, the
  filter knobs are solid, and Directions is a ring with a solid needle.
  The star off is the full-size hollow of the star on (no 0.9 scale).
- **One weight.** Every line is set in on-screen px through `u()`, at 2.00
  everywhere: tools, the +, the account, the tag ×, the star off, and
  every place rim (row 24px, pin 24 and 32px, chip roundel 16px). Only the
  check stays at 1.52 (FIXED). The rules card shows Today vs 2.00 only,
  with the + and the account marked "already 2.00", and the one sentence
  on why not 1.5.
- **Shapes.** District and street sit in the circle on both concept cards.
  The diamond, C, the solid arrow, A's solid bust and Timetable are on the
  dropped card, one line each.
- **Chips.** Specimen's chips are bare at 12px. Roundel's carry a 16px
  roundel, with the cost stated in its "Costs" line.

### Fixes 1–10

1. **Size isn't the difference.** Specimen is drawn at the largest size
   that still floats: 1.0px of paper inside the rim, fitted by measured
   ink radius, so nothing touches the rim. Roundel is clipped 0.9px inside
   the rim. Measured ink cover of the 20px field: Specimen averages 28%,
   Roundel 49%. See the honest read below.
2. **Equal mass.** Specimen is balanced by measured ink area: heavy glyphs
   are shrunk toward the 60th percentile, light ones grow until they reach
   the fit radius. The spread is 18–35%. The thin glyphs (restaurant, bar,
   flag, street) can't grow further without touching the rim. They look
   balanced by eye in the 24px strip, though bar and the flag are the
   lightest. Roundel can't be balanced the same way: full-field crops
   (café, district, area) sit at 55–61%, the fork at 39%.
3. **"Other"** is now a solid pennant on a pole: a marked spot, not a
   control, in both concepts.
4. **Lightly rounded.** Every place glyph goes through the `#soft` filter
   (about 0.5 corner, as on the check). For phase 2 that becomes real radii.
5. **Same icon everywhere.** Each card shows the tag hanging from its
   selected pin, the row badge (plain and navy-selected) and the pins, all
   drawn by one `mark()` function.
6. **The busy map.** One crop on every card: 19 near pins, the selected
   pin, a starred pin, a visited sticker and a starred sticker, two
   clusters and the district's area box (no pin, as he asked). There's a
   far-zoom strip (empty rings, far stickers, a cluster) on every concept
   card. The side-by-side card uses the same crop at the same height.
7. **Specimen attraction and area redrawn.** Attraction is a temple front:
   the gaps between the columns are the cream inlay, which really is there.
   Area is a hatched square, the way a map legend draws an area.
8. **The Roundel misread test** (below). Bar, attraction, hotel and
   shopping were redrawn.
9. **Ink cost** is shown, not explained. The busy map does it, plus one
   "Costs" line.
10. **The chip cost** is one line on the Roundel card.

### Roundel: "what other sign is this?" (not on the card)

| | Reads as | Verdict |
|---|---|---|
| Restaurant | Fork and knife, cut at the handles | Passes |
| Café | A cup on a cropped saucer, maybe a soup bowl at 16px | Passes |
| Bar | Was a funnel. Now the bowl, an olive, the stem and the foot: a martini | Passes |
| Attraction | Was a bottle. Now a temple front with the columns cut. Could be a bank or courthouse, but that's the same family | Passes |
| Nature | Tree, trunk cut | Passes |
| Shopping | A bag with a narrow handle. At 16px it's still near a padlock or basket | Borderline |
| Area | A hatched coin, a barber pole, a striped ball. It says nothing about "area" | **Fails** |
| Hotel | Was a blob. Now a bed (headboard, pillow, mattress, a fold, a leg). Reads at 24px, smudges at 16px | Borderline |
| Other | A pennant, "flag a spot". Could read as "report", but in a map pin it's a waypoint | Passes |
| District | A field cut by three streets. Reads as a beach ball or a globe as often as a map | **Borderline / fails** |
| Street | A road with a dashed centre line | Passes |

Two fail or nearly fail, and both are areas. A crop of a flat field has no
silhouette left to read, so the crop loses exactly the shapes that need
an edge.

### Honest read: is Roundel "Specimen, bigger"?

**Partly, yes.** In the side-by-side strip and rows:
- Café, attraction, area, district, street and shopping read as cropped,
  a different kind of picture.
- Restaurant, nature, bar, other and hotel are tall, narrow objects. The
  crop only trims their ends, so they read as Specimen at a larger size.
  That's about half the set.

On the map it is clearly a different, much heavier page (49% vs 28% ink):
the busy-map crop shows Roundel as the noisiest of the three, which is
his original complaint.

It also turned up a problem the director didn't list: **the selected pin
inverts badly in Roundel.** A crop that fills 61% of the field turns mostly
cream when inverted, so the open café pin looks like a cream pin with a
brown rim instead of a filled one. The tag card shows it. "The open pin
fills with its colour" (rules card) holds for Specimen and is weak for
Roundel.

So the director's condition ("If Roundel still reads as 'Specimen,
bigger'…") is half met by the drawings, and the map and the selected pin
count against it. I'd score it as a real but costly alternative. If the
director drops it, we need a second concept that differs in kind. I don't
have one ready, and I won't pretend Roundel is more different than it is.

### Specimen vs Today, also honestly

Specimen is close to Today in the row: still a solid glyph floating in a
2px ring. What changes:
- District and street are solid and in the circle.
- Every place is lightly rounded and mass-balanced.
- "Other" is a flag, not a radio button.
- The attraction is a temple, not a bullet.
- The tools follow the law at 2.00.
- The weight is one number.

That's the evolutionary option again (v4's Field Guide "risk", still
true). The owner should see it named that way, not dressed up.

### Open questions

1. Roundel: keep it as the second concept with its costs stated, or drop
   it and look for another that differs in kind? (Director.)
2. Area and district in Roundel fail the misread test. If Roundel stays,
   should areas be the one family drawn whole (floating) inside the
   coin? That would break the concept's one rule.
3. The rules card's "tapped by me" table stacks the two star icons
   vertically (a layout nit). Fix in the fix pass if the director wants
   it.
4. Specimen's light glyphs (bar, flag, street) are fit-limited. Should
   they be redrawn wider, or is that phase-2 grid work?

NEXT: product designer (systems focus) — coverage run on the six v5 cards
against jobs 1–13 (the tag stub's category circle, the "tapped by me"
table and the weight table are the new parts), then the director scores
all of them in one pass.

---

## Turn 16: product designer (systems focus), coverage on the v5 cards

The full table is in `coverage.md` (round 3, at the top). In short:

- **Jobs 3, 5, 6, 7, 9, 11, 12 and 13 pass** on both concepts and the
  rules card. Jobs 1–2 pass through the v4 brand card he's already seen.
  The law holds in every tag strip and header: every tool now has a solid
  part, and the star off is the full-size hollow of the star on.
- **BLOCKER, job 8 (both cards).** He named Field Guide, Cut Paper and Spot
  Pictogram. No v5 card uses those names, so he can't see what became of
  them. The concepts *are* the combination, but nothing says so. One line
  fixes it.
- **BLOCKER, job 10 (rules card).** The "tapped by me" table never says
  *where* outlines appear. Rows and the map show nothing until you mark a
  place. Outlines live only in the tag and the add form. Without that line
  he'll picture an outlined star on every row and pin.
- **BLOCKER, job 10 (Roundel only).** The rules card says "The open pin
  fills with its colour". Roundel's open pin is a cream disc with a brown
  rim, so the card is false for it. Either redraw it or say it differs.
- **Not blocking:** the row × at 2.00 is now bold on every row (make it
  smaller, per the director's own rule). The account's "already 2.00"
  hides that its head goes solid. Roundel's hotel reads as a mug, so with
  area and district failing too, only 7 of 11 tell apart at a glance.

NEXT: product designer (visual focus) — the three one-line or
one-drawing fixes (job 8 line, job 10 "where outlines appear" line,
Roundel's open pin or its caveat), plus the row × size; then the director
scores all six in one pass.

## Turn 17: product designer (visual focus), coverage fixes on the v5 cards

All six `v5-card-*.png` are re-rendered from `attitudes-v5.html`.

**Blockers:**

1. **Job 8.** Each concept card has a "Made from" line above "What it
   is", naming his three directions:
   - **Specimen:** Cut Paper = the outlines (the scissors in each shape),
     Field Guide = the cream detail only where the thing has one, Spot
     Pictogram = few simple shapes as the drawing grid.
   - **Roundel:** Spot Pictogram = flat simple shapes drawn big, Cut Paper
     = the cut made by the circle itself, Field Guide = the cream detail
     (the columns, the road line, the olive).
2. **Job 10, where outlines appear.** A new section on the rules card,
   before the table: "Only in the tag and the add form, where you can mark
   a place. Rows and pins show nothing until you've marked it; then the
   orange star and the stamp or sticker appear." It matches his "No star
   unless it's been starred".
3. **Job 10, Roundel's open pin.** I said it rather than redrew it.
   - Roundel's "Costs" line now says the open pin can't simply fill with
     its colour: a close-up turns mostly cream when reversed (see the café
     pin over the starred tag), so Roundel would need its own open-pin
     design.
   - The rules card's open-pin row adds: "(Roundel can't do this as drawn:
     see its card.)"
   - Why not redraw it: every way of making it fill breaks the concept.
     Showing the glyph whole when open is Specimen. Shrinking the crop is
     inconsistent. Tinting the glyph adds a third ink. That's a real cost
     of Roundel, and the director should weigh it, not have it hidden.

**Also:**

- **The row ×** is smaller (10px box, arms about 4.6px), still at 2.00px:
  the weight stays, the size goes down.
- **The account** is labelled "2.00px today · already 2.00, head goes
  solid".
- **The rules-table star icons** sit side by side, not stacked.
- **The dropped card's diamond** now shows Specimen's district and street
  inside the diamond, not Today's dashed glyphs. It shows the shrink
  honestly.

**Not changed:** Roundel's hotel. Turn 16 says it reads as a mug. With
area and district, that makes 7 of 11 that tell apart at a glance. That's
the director's scoring input, and it doesn't need another redraw before he
scores.

NEXT: design director — score all six v5 cards in one pass (rules, Today,
Specimen, Roundel, side by side, dropped), and rule on whether Roundel
stays as the second concept.

---

## Turn 18: design director, round 3 scores

Not ready. The full scores and fixes are in `scores.md` (round 3). Rules 8
(9 after two copy edits). Specimen 8. Roundel 5, **dropped**: it reads as
"Specimen, bigger" for half the set, it's the noisiest map, the open pin
can't fill, and 7 of 11 tell apart.

The new concept 2 is **Constructed** (Spot Pictogram led, Aicher's method):
places built from circles, bars and 0/45/90 cuts on a grid whose unit is
the 2.00px line. Specimen becomes Cut Paper + Field Guide, with its cut
made visible. They split along his own named directions: cut vs built.

NEXT: product designer (visual focus) — Specimen fixes 1–6, rules edits
7–8, a new Constructed card (with a grid frame), side by side rebuilt
(Today / Specimen / Constructed), Roundel added to the dropped card; then
systems coverage; then I score in one pass.

## Turn 19: product designer (visual focus), v6 cards: Specimen cut, Constructed built

Built per turn 18 and scores.md (round 3). The new set is `v6-card-*.png`
in `concepts/sketches/`, 390 wide at 3x:

| Card | File |
|---|---|
| Rules | `v6-card-rules.png` |
| 0 Today | `v6-card-0-today.png` |
| 1 Specimen | `v6-card-1-specimen.png` |
| 2 Constructed | `v6-card-2-constructed.png` |
| 3 Side by side | `v6-card-3-side-by-side.png` |
| 4 Dropped | `v6-card-4-dropped.png` |

The source is `concepts/sketches/attitudes-v6.html`. The v5 files stay as
the record of round 3's first build.

### Specimen fixes 1–6

1. **A visible cut or a real cream detail on each of the 11.** The card
   says plainly which ones keep Today's shape (restaurant, café, tree).
   The other eight are new:
   - Cut Paper (a cut you can see at 24px):
     - the bag's pinked top (5 teeth)
     - the flag's snipped swallowtail
     - the map's folds (area)
   - Field Guide (a cream detail the thing really has):
     - the olive in the glass
     - the columns of the temple
     - the blanket's edge on the bed
     - the district's streets
     - the road's centre line
2. **A Today → Specimen pair strip,** 11 pairs at 24px, right under the
   strip.
3. **"Made from" now names Cut Paper and Field Guide only,** each with the
   frames that back it. Spot Pictogram has moved to Constructed.
4. **Area is a folded map,** three panels with fold gaps. It reads as
   "a piece of map". The hatched square is gone. Constructed draws the
   same idea in its own way.
5. **"Costs" is rewritten against Constructed:** drawn by eye, not on a
   grid, so balance takes judgement; softer and less exact.
6. **Bar and flag:**
   - The flag gained mass with the swallowtail (28%, from 20%).
   - The bar is still the lightest (19%). The olive knocks some ink out
     of it. I left the bar for phase 2.

### Rules edits 7–8

- The Roundel note is gone from the open-pin row.
- "Filter chips show the icon on its own" now covers both concepts.
- Nothing else changed.

### Constructed (new card 2)

Spot Pictogram, built the way Aicher drew the Munich 1972 pictograms.
Every place is drawn 1:1 at 24px on a 2px grid: bars 2, 4 or 6px wide,
circles, and cuts at 0°, 45° or 90°, lightly rounded by the same `#soft`
filter as the check. Cream appears only as gaps the grid leaves (the
fork's tines, the road's dashes, the district's streets).

How each place is built:

| Place | Parts |
|---|---|
| Fork and knife | Two 2px tines, a 45°-cut blade |
| Cup | A rounded body, a squared handle, a 2px saucer bar |
| Bar | A 45° triangle bowl, a 2px stem, a 2px foot |
| Temple | A 45° pediment, three 2px columns, a 2px base |
| Tree | Three 45° tiers |
| Bag | A slightly tapered body, a squared handle |
| Area | A folded map from three 45° panels |
| Bed | Headboard, mattress and post bars, a circle head |
| Flag | A pole, and a flag with a 45° notch |
| District | A block cut by one straight street and one 45° street |
| Street | A 6px road turning at 45°, with 2px cream dashes |

The card has the same frames as Specimen's, plus a grid frame: the café,
the bar and the tree at 104px over the 2px grid, with one sentence
explaining it.

Measured ink cover: Constructed averages 29% (20–41%), Specimen 28%
(18–35%). So mass isn't the difference.

Misreads I caught and fixed before rendering:
- The bag with a round handle was a padlock. It now has a squared handle
  and a tapered body.
- The plain triangle flag was a play button. It now has a notch.
- The perspective road was a traffic cone. It's now a road turning at 45°.
- The 2×2 district was an app-launcher grid. It's now one block cut by
  two streets.
- Three upright bars for area were a bar chart. They're now panels
  zig-zagging at 45°.

### Side by side and dropped

- **Side by side** is Today / Specimen: cut / Constructed: built, each with
  the same strip, two rows, the tag strip and the busy map at the same
  height.
- **Dropped** adds Roundel, with its 11 at 24px and the director's line
  word for word.

### The kill test, honestly

**In the 24px strip: they differ in how they're drawn.**
- Specimen is curves, a flared lip, tiered scallops, a pinked edge and a
  free-drawn road.
- Constructed is straight bars, 45° triangles, square handles and a
  6px road.
- At a glance, about 8 of 11 are clearly different drawings: fork and
  knife, bar, temple, tree, bag, flag, district and street.
- The other three are siblings. The cup, the bed and the folded map share
  the same idea and differ only in finish.

**In a row: visible side by side, subtle alone.**
- The café row is a curved cup on a lens saucer vs a square cup on a bar
  saucer. You see it on the side-by-side card.
- In one row on its own you'd notice "rounder" vs "squarer", not a
  different system.

**On the map:** same mass, same pin. Constructed reads a little crisper.

So the test passes in the strip and passes only weakly in the row. The
real difference is finish and method (cut vs built), not identity, because
both obey the same law, the same circle and the same weight. That's
honest, and probably right: they are two ways of drawing one system. If
the director needs them apart *in the row at a glance*, I don't think any
drawing-only difference will do that without breaking the shared rules.
I'd say that to the owner in one line rather than force it.

### Open questions

1. Is "visible in the strip, subtle in the row" enough for the kill test?
   (Director.)
2. Should the 3 sibling glyphs (cup, bed, map) be pushed further apart in
   Constructed (for example a cup that's one 2px ring plus a bar), or is
   that phase 2?
3. Constructed's selected pin draws the glyph at 1.25× (32px pin). That
   breaks "1 grid unit = 2px" in that one place. Alternatively keep it
   1:1 with more paper. (Phase 2.)

NEXT: product designer (systems focus) — coverage run on the six v6 cards
against jobs 1–13, then the director scores in one pass.

---

## Turn 20: product designer (systems focus), coverage on the v6 cards

The full table is in `coverage.md` (round 3b, at the top). **No blockers.**
Every job from 1 to 13 is supported on Specimen, Constructed and the rules
card. Jobs 1–2 are covered by the v4 brand card he already has.

- **The v5 blockers are closed.** Job 8: Specimen names Cut Paper and Field
  Guide, Constructed names Spot Pictogram, so all three of his directions
  are accounted for and the frames back each claim. Job 10: "Where outlines
  appear" is on the rules card, and the open-pin row is now true for both
  concepts.
- **Structure:** the two concepts share the law, the circle, the 2.00px
  weight and every tool, and differ only in how a place is made (cut vs
  built). On the job side that's right: one system, two drawing methods,
  which is the choice he's being asked to make. Constructed's grid frame
  also makes the weight rule and the drawing rule visibly one rule. That's
  the strongest phase-2 seed on the board.
- **One copy fix:** the rules card's weight table still says "place
  circles: rows, pins, 16px chips". That's left over from Roundel, and it
  contradicts its own "Filter chips show the icon on its own". Make it
  "rows and pins".
- **For the score, not blockers:** in Constructed, the restaurant reads as
  "Y4", the street as a pencil (which means "edit"), and the district's 45°
  street renders as a blur rather than a cut.

On my structural question from turn 19's open point 3 (Constructed's
selected pin at 1.25×): it doesn't affect any job, and it belongs in the
phase-2 grid rules for optical sizes. I'll carry it into the handoff.

NEXT: design director — score the v6 cards in one pass (coverage is clean;
one copy fix on the rules card and the three Constructed drawing findings
are in `coverage.md`).
