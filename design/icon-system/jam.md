# Icon system: jam

## Pass 1: product designer (systems focus), 2026-10-13

### 0. Jobs, from the owner's words alone (written before reading anything else)

Owner, 2026-10-07: "they're too noisy, the approacah we're using the checked
items are stronger visually than the open ones. the icon system needs more
clarity... i need a full rev." 2026-10-13: "i want to see every icon in the
app up next to each other."

| # | Job | Source |
|---|---|---|
| J1 | **See what's still to do.** Glancing at the map or the list, the places I haven't been to yet come forward, and the ones I have done step back. | "checked items are stronger visually than the open ones" |
| J2 | **Tell open from done at a glance**, at every size and on every surface, without done winning the eye. | same, plus "clarity" |
| J3 | **Scan without noise.** Read the map and the list quickly; marks don't compete with the names or with each other. | "too noisy" |
| J4 | **Read every icon as one family.** Any icon I meet anywhere looks like it was drawn by the same hand, with the same weight and logic, so I learn it once. | "the icon system needs more clarity", "full rev" |
| J5 | **Judge the whole set side by side** (owner as reviewer): every icon and every state, today next to the proposal, on one canvas. | "see every icon in the app up next to each other" |
| J6 | **Choose between concepts.** More than one real option. | standing direction, "i want more than one concept." |
| J7 *(inferred)* | **Know what kind of place it is.** The category stays readable in every state, visited included. | taste rule "Preserve the category icon" |
| J8 *(inferred)* | **See what I starred**, and whether a starred place is still to do or done. | "checked items" covers starred as well as visited |
| J9 *(inferred)* | **Tell a control from a status mark.** Things I can tap look tappable, and status marks don't look like buttons. An *open* state that is also a button (the tag's Star / Visited segments) still invites the tap. | "clarity" |
| J10 *(inferred)* | **Change a state and see it land**: star or visit something and the mark confirms it without becoming the loudest thing on screen. | follows from J1 and J2 |

### 1. What I found (inventory, `inventory.md`, plus the context screens)

**The diagnosis, in one sentence: every state today adds ink, and the base
state is the lightest thing on screen.**

- **Map.** Open pin = 2px category ring on paper with a glyph (light; at far
  zoom it's a bare ring). Visited = a solid dark #3A4C5B disc with a peel,
  contact shadow and SVG filters, and it **erases the category glyph**. That
  makes it the heaviest mark on the map, and it breaks J7. Starred adds an
  orange star with a deep keyline *and* a paper halo on the shoulder. Selected
  inverts to a solid fill. Three of four states add mass. A trip that's half
  done reads as dark blots, and the to-do pins are the faint ones. That's
  the owner's complaint, literally (`ctx-map-near.png`).
- **List row.** Open = nothing (correct: "No star unless it's been starred").
  Visited = a 72x32 stamp, the widest mark in the row after the name. Starred
  = an orange star before the name. Done rows carry the most furniture.
- **Tag.** The Star and Visited segments are buttons. Open = black outlines
  (stroke star, stroke check). Done = orange filled star / the navy stamp.
  Here the open marks aren't too faint. The problem is that open and done are
  drawn in **different languages** (black stroke vs orange fill vs a stamp).
- **Drawing language is unsystematic** (J4): stroke weights 2 / 2.05 / 2.2 /
  2.25 / 2.5 / 3; square caps, round caps and no caps set; category glyphs are
  filled silhouettes except district/street (dashed strokes); **three
  different checks** (stroked square-cap sort/plan check, filled softened
  stamp/sticker check, stroked round-join tag check); **two ×s** (SVG close vs
  Arial text `&times;`); a **+ made by rotating ×**; ▼ as a text character;
  Leaflet's Lucida +/−. On iPhone the text glyphs are drawn by the system
  font, so we don't know what they look like there.
- **Optical mass varies wildly** among the category glyphs: shopping bag, tree
  and bed are big solid masses, "other" is a lone dot, district/street are
  thin dashes. This is the owner's "icons don't fill the same visual space".
  "other" (a dot) also collides with the tag anchor dot and you-are-here.
- **Stacking**: a starred + visited pin = sticker + peel + shadow + star +
  keyline + halo, which is six visual elements for two bits of state.

### 2. Structure: the families

| Family | Members | Carries state? | Must read as a set with |
|---|---|---|---|
| **A. Identity (category glyphs)** | 11 glyphs | no (it's who the place is) | each other, at 12 / 18 / 23px, in ink and reversed |
| **B. Place shells (containers)** | row badge (circle / diamond), map pin near / far / selected / approx, plan number pin, plan shape diamond | **yes: selected, approx, plan number, and today visited (by replacement)** | the row badge and the map pin are one object on two surfaces |
| **C. State marks** | star (filled / open / Pencil Star), visited (stamp / sticker / outline check / filled checks), selection | **this IS the state** | across row, pin, tag, add form, cluster, shape anchor |
| **D. Controls** | account, +/× add, sort, filters, locate, collapse ▼, close ×, delete ×, plan + / × / check / more / chevron, sort check, directions compass, Leaflet zoom | only toggle feedback (add open, sort current) | each other: one stroke, one cap, one size ladder |
| **E. Map furniture** | cluster (+ starred), you-are-here, tag anchor dot, shape star / visit anchors | cluster inherits star | must not look like a category pin (the "other" dot clash) |

Sets the owner will see **adjacent**, so they must match optically:
the list header trio (sort / filters / locate) with ▼; the top-right badges
(account + add, which touch both neighbouring crews); a row's lead badge + star
+ stamp + ×; the tag stub's three segments (compass / star / visited); a pin
with its star and sticker; the filter chips (12px glyphs next to caps type).

### 3. The state model (the heart of the brief)

There are three kinds of state, and today they're all drawn the same way, by
adding ink:

| Axis | Values | What it means to the user | Should it be loud? |
|---|---|---|---|
| **Progress** | open → visited | what's left to do (J1) | **open forward, visited back** |
| **Priority** | unstarred → starred | what I care about most (J8) | loud *while open*; open question once visited |
| **Focus** | – → selected | the thing I'm looking at right now | the only state allowed to add weight, because it's transient and singular |
| *(Metadata)* | approx, plan number | how sure / what order | quiet, structural |

Proposed principles to debate (not pre-decided; visual and director, push back):

1. **Weight follows what's left to do.** Ranking: open + starred > open >
   visited + starred ≥ visited. Selected sits outside the ranking.
2. **Done differs in kind, not in weight.** The owner also said "Visited must
   be clearly different from an unvisited pin". Different ≠ heavier. Change
   texture, fill logic or form, and keep the ink equal or lower. His own
   rule already points here: visited = "coloured in with reduction of
   information".
3. **State never erases identity.** The category glyph survives every state
   (J7). Today's sticker breaks this.
4. **One state, one mark, one place.** No state is drawn with more than one
   element (star + keyline + halo counts as three). On a pin, a stacked state
   gets one shoulder slot or a change to the shell, not both.
5. **Open-as-button vs open-as-absence.** In rows and pins open = absence
   (rule kept). In the tag, open is a *control*: it must invite the tap at the
   same weight as its done twin, and the two states are drawn in the same
   hand (J9, J10).

Tension to name plainly: **the shipped visited system** (stamp in rows, dark
sticker with cream check on pins) is owner-approved and has whimsy he liked
("Stamp, don't draw"; "A peel is a peel"). The "full rev" puts it in scope,
but a concept can keep the *idea* (stamp, sticker, peel) and fix the *weight*.
At least one concept should do that, so he isn't forced to give up something
he chose.

### 4. Creative directions (real random draw: braille, origami crease patterns, hiker trail blazes; Oblique Strategy "Discard an axiom"; constraint "every icon fits a 3x3 grid")

These differ in kind. Each is a *state model* plus a *drawing grammar*.

**D1 · Trail blazes: the map quiets as you go.** *(trail blazes, inspo:
Pacific Crest Trail diamond, park posters)* Invert the fill logic. The
*open* pin is the painted blaze: a solid category-ink disc, paper glyph (today's
"selected" look becomes the default). Visited becomes the faded or old blaze:
a hollow ring, glyph in ink, maybe a single over-painted stroke. At the start of
the trip the map is bold. As you travel it empties out, so what's left is
literally what stands out. Selected needs a new focus treatment (lift or
ring), since solid fill is taken. Risk: a fresh trip map is heavy. Question:
is that fine because it's the plan?

**D2 · Blind emboss: state as relief, not ink.** *(braille)* Visited = a
blind stamp, debossed into the paper the way a notary seal or letterpress blind
deboss is: no ink added, it shows only by a light edge / tooth change. The
category glyph is still there and the paper changes. The stamp idea survives
(it *is* a stamp) at near-zero weight. Rows: the VISITED stamp becomes a blind
impression. Risks: legibility at 16px and on OSM tiles, and the owner's
"restrained shadows" rule. Needs a fallback at far zoom (a hollow glyph?).

**D3 · Dog-ear: the crease, not the sticker.** *(origami crease patterns)*
Keep the paper pin, its rim and its glyph. Visited = the pin's own corner
folded over: a creased dog-ear, like a page you've read. It's the peel the
owner liked, but on the place itself instead of a dark sticker laid on
top. It's an *addition of form, not of ink*. Same move in rows: the badge
dog-ears and the stamp gets smaller or goes. Owner taste link: "A peel is a
peel", "the flap should be bottom left".

**D4 · One slot (Discard the axiom "each state gets its own mark").**
A place shows **at most one state mark, chosen by priority**: open + starred →
the star; visited → the visited mark (and the star goes quiet or
disappears); selected → the shell changes, no extra mark. No stacking, ever,
and the six-element starred + visited pin collapses to one idea. Pairs with
any of D1–D3. Open question for the owner: does a visited place still need to
say it was starred?

**D5 · The 3x3 grammar (the drawing language, pairs with any state model).**
Every icon in families A, D and E rebuilt on one 24 grid with a 3x3 module.
One stroke weight per size step, one cap/join (lightly rounded, per "lightly
rounded like the rest"), matched optical area across all 11 category glyphs,
**one check, one ×, one +** used everywhere, and no text-character icons. It's
the cure for J4 and for "don't fill the same visual space". Filled
silhouette vs line is a real fork the visual designer owns. My systems
suggestion: **identity = filled, actions = line, state = its own third
voice** (ink/stamp), so J9 is solved by grammar, not by colour.

**D6 (wildcard) · Ledger tick.** Borrowed from the inspo's trail-scrapbook
mileage tables: the visited mark moves *off* the place mark entirely into the
type: a printed tick or "✓ date" in the row's metadata line, and on the map
the visited pin just drops to the far-zoom size. Visited = smaller, never
darker. Cheap, very quiet, and loses the stamp. Included as the "invert"
pole so the set has a true opposite.

### 5. Requirements every concept must meet (systems)

- Every state of every family drawn at every real size: 12 chip / 16 far pin
  / 18 row / 20 tag / 24 near pin / 32 selected. Also on the navy selected
  row, on OSM tiles, and on paper.
- The full state matrix per place: open, starred, visited, starred + visited,
  each × selected, × approx, × plan-numbered, × far zoom.
- Shown **on the shared canvas, today next to proposal, every icon** (J5). The
  inventory canvas https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW is the
  baseline; concepts should be artboards beside it, plus phone-readable stills
  of real screens (map half-visited, list, tag both states).
- The motions already shipped (stamp ink bleed, Pencil Star, dry-up un-visit,
  sticker placement) must have a home in each concept: a new visited mark
  needs a "lands" and a "dries up" story.
- Colour stays the brand's: orange = star/action, navy = selection, category
  inks unchanged unless a concept argues otherwise.

### 6. Touchpoints with the neighbouring crews (context only, not designing their work)

- **Sign-in crew** (`design/signin-button/`): the signed-out "person" glyph
  and the arc-text badge belong to family D. Today's account glyph has no
  linecap set and doesn't match the other strokes. Whatever person icon they
  settle on should be drawn in this system's grammar, and their "icon
  centred / weighted low" notes are the same optical-centring rule we need.
- **+ crew** (`design/add-button-placement/`): the + glyph (stroke 2.5 round
  caps) and its × open state are family D. The owner's note "prominence is
  the problem on the badge... same weight and hierarchy as account" is an
  icon-hierarchy problem we share: two identical scalloped badges for
  unequal jobs. Our size/weight ladder should leave room for + to outrank
  account. Hand-off point: we define the glyphs, they define the container
  and placement.

### 7. Open questions (for the team, then the owner)

1. Is the shipped visited look (stamp + dark sticker) in scope for
   replacement, or only for weight? I read "full rev" as in scope, with at
   least one concept keeping it.
2. Does a visited place still show its star? (D4)
3. Do district/street glyphs stay stroked (they depict an outline / route) or
   join the filled family?
4. Leaflet's zoom control: restyle into our grammar, or hide (pinch exists)?
   It's the one icon in the app not drawn by us.
5. "other" = a dot collides with the anchor dot and you-are-here. Redraw?

NEXT: product designer (visual focus): the state model and the six directions
need your read on look and feel, especially the D5 fork (filled identity vs
line actions) and whether D1/D2/D3 can be drawn at 16px on OSM tiles without
breaking the noise rules.
