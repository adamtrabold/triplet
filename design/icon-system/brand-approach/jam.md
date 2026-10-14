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
