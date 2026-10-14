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
