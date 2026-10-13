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

## Pass 1: product designer (visual focus), 2026-10-13

Read: owner.md, inventory.md, the inventory PNGs and all 10 context
screens, CLAUDE.md, docs/owner-taste.md, design/inspo (README, park
posters, labels, passport stamps), the systems turn above. Real random draw
(Python RNG): fields **railway ticket punching** and **screen printing**;
Oblique Strategy **"Emphasize the flaws"**; constraint **"all icons share one
silhouette"**.

Two sketches, rendered headless at 3x, phone-readable (sketches, not
concepts):

- `concepts/sketches/pin-states-3x.png`: every direction × open / open★ /
  visited / visited★ / selected, at **real size** (24 near, 16 far) on an
  OSM-like tile, then the same half-done trip (5 visited, 4 to do) drawn six
  ways. Source `pin-states.html`.
- `concepts/sketches/row-states-3x.png`: four list rows (2 visited, 2 to do)
  drawn four ways. Source `row-states.html`.

### 1. What the real-size test taught me (the one finding that matters)

At 24px on tiles, **only four visual channels survive**: fill vs hollow,
value (full ink vs tint), whether there's a shell or not, and size.
Everything finer (a fold, a punched hole, relief, a peel on a resting
mark, texture) turns into a smudge or reads as a rendering glitch. So the
systems principle "done differs in kind, not weight" is right, but at pin
size "kind" has to be one of those four big channels. The small-detail
whimsy has to live somewhere else: in the **transition** (motion), in the
**tag** (big, 240px), and in the **row** (the stamp has room).

That gives us a clean split I want to propose as a visual rule:
**pins speak in big channels; whimsy lives in motion and on the tag.**

### 2. Verdicts on the systems directions (looked at real size, not argued)

- **D1 Trail blaze: KEEP, strongest hierarchy in the sketch.** The half-done
  map reads instantly: the solid discs are what's left, and the visited
  rings (which are simply today's open pin) step back but stay legible with
  their glyph. Also the most poster-like (WPA park posters are flat solid
  colour shapes). Risks I can see: (a) the light inks go weak as solid
  fields: lavender shopping and teal district discs lose authority next to
  wine and forest, so the category inks need a value pass if this goes
  ahead; (b) a fresh trip is a field of solid discs, so test 40+ pins before
  falling for it; (c) selected can't be "inverted" any more. In the sketch
  I tried a paper halo and it looks pale. Selected wants size plus a
  **navy keyline ring**, the same navy as the selected row, which is one
  selection colour on both surfaces.
- **D2 Blind emboss: DROP.** At near zoom it reads as a missing or disabled
  pin. At far zoom it's a blank paper disc with no information. Relief
  can't survive OSM tiles, and adding contrast to save it breaks the
  restrained-shadow rule.
- **D3 Dog-ear: DROP for pins.** At 24px the fold is a smudge on the lower
  left, and it reads as a notch. The owner already said "a notch looks
  stupid". The *idea* (the place itself is marked, not covered) survives in
  V3 below. A dog-ear might work on the 240px tag's corner, but that's tag
  work, not the icon system.
- **D4 One slot: KEEP as a rule.** And here's the visual version of it, the
  **rim star**: the star sits *on* the pin's rim at 12 o'clock, breaking the
  ring, with no halo and no keyline. That's one element instead of three
  (star + keyline + halo). In the sketch it reads at near zoom and holds at
  far. It also answers "all icons share one silhouette": the star becomes
  part of the token's outline instead of a second object stuck beside it.
- **D5 3x3 grammar: KEEP; my read on the fork is below (§4).**
- **D6 Ledger tick: merge.** "Visited = smaller, never darker" is right, but
  shrinking alone fights selection, which also uses size. Its quiet-row half
  lives on in V3's struck word.

### 3. My directions (from the draw)

**V1 · Conductor's punch** *(ticket punching)*: visited = a hole punched
through the pin, so the map shows through. It removes ink, keeps the glyph,
and is on-brand (claim checks, tickets). **TESTED, DROP:** at 24px the hole
reads as a bite or a broken ring, which is the notch problem again. I'm
keeping it on record so nobody re-proposes it for pins. As *motion* it's
alive: a visit could land with a one-frame "punch" before the resting state.

**V2 · Second run** *(screen printing)*: visited = the same pin printed
again at roughly half strength, a screen-print tint of its own category ink.
Same shell, same glyph, same colour family, but lower value. It's the most
literal answer to the owner ("checked items are stronger than the open
ones"): done is now visibly *weaker*. In the half-done map it's very calm,
and the to-do pins plus the starred ones own the eye. Rows: the badge and
the VISITED stamp drop to the same tint, so the row's heaviest mark is gone.
**Risk to name plainly:** tint reads "disabled" / "unavailable" to some eyes,
and "Visited must be clearly different" may want more than a value change.
"Emphasize the flaws" is the fix: the second run is **slightly
misregistered** (glyph offset ~0.75px from the ring, a print flaw), so it
reads as *re-printed*, not *greyed out*. I need to sketch that at real size
before I trust it.

**V3 · Shell off** *("all icons share one silhouette", inverted)*: the
shell (ring + paper) means "a place still in play". Visited = the shell
falls away and **only the category glyph stays, inked straight onto the
map** (with a hairline paper knock-out so it stays legible on tiles). Far
zoom: a small solid dot of the category ink. It's a change in *form* (no
container), it keeps identity (J7), and it carries less ink than an open pin
on the map. In the half-done sketch it's the most distinctive of all:
visited places read as "already absorbed into the map". **And it gives the
peel the owner chose a home:** on visit, the ring + paper *peel off* the
glyph like a sticker backing and fall away. The peel stops being a resting
decoration and becomes the moment. Un-visit: the ring dries back in (same
dry-up language, reversed). Caveat from the row sketch: **in rows a bare
glyph is heavier than a ringed one** (the filled glyph is bigger than the
ring's thin line), so in rows Shell off needs the glyph at a smaller size or
in tint, and the VISITED stamp becomes a light struck word rather than a
ringed seal. Rows and map may want different halves of a concept.

**V4 · Small sticker (the keep-what-he-chose pole)**: keep the shipped dark
sticker, cream check and peel, but make it **physically smaller than an open
pin** (about 14px at near zoom, 10px far), so its dark mass is no longer
bigger than the to-do pin's ring + glyph. This is the honest "fix the
weight, keep the idea" option the systems turn asked for. Not sketched yet.
My worry is that the check still erases the category (J7). A cream glyph
instead of the check would fix that but breaks his continuity rule ("visited
icon changes to a checkmark in the sticker"), so that's an owner call.

**V5 · Ghost stamp for the tag's open state** *(ties to the backlog idea
"Ghost VISITED stamp in the popup")*: today the tag's open Visited segment
is a stroked check and the done one is a stamp, two different languages
(systems §1). Open = the stamp's **empty dotted track and ring, uninked**
(a blank stamp box waiting for the clerk). Done = the same stamp, inked.
The star segment gets the same treatment: open = the star outline in **orange
line**, done = orange fill. Same object, two inkings. This is J9/J10 solved
by drawing, not colour, and it fits the claim-check grammar the owner
picked for the stub.

Dropped fast: tear-off half-badge for rows (same problem as the punch at
24px); misregistration as the *open* state (too noisy, the owner's first
complaint); halftone dots for visited (dots: "absolutely not").

### 4. The D5 fork (filled glyph vs line control): my read

**Three voices, each with one job, in one hand:**

| Voice | Who | How it's drawn | Why |
|---|---|---|---|
| **Printed** (solid) | identity: 11 category glyphs, the star | flat silhouettes, one corner radius (~1px at 24, "lightly rounded"), matched optical area | Solids hold at 12px on tiles, and line glyphs inside a 2px ring = two outlines = noise. WPA posters and hotel labels are flat printed shapes. |
| **Drawn** (line) | controls: sort, filters, locate, collapse, ×, +, check, chevron, more, compass, account | ONE stroke per size step (2 at 20–24, 1.75 at 16), round caps + round joins, one ×, one +, one check, no text-character icons | Line = "you can do something here" (J9). |
| **Stamped** (textured, tilted, seeded) | state that's been *recorded*: VISITED, the tag's type, plan numbers on the tag | the stamp language already shipped | The only voice allowed texture and tilt, so texture itself means "this was marked". |

So the check splits cleanly: the **drawn check** (sort/plan "current") is a
control mark, and the **stamped check** lives only inside VISITED. That's
two checks with two jobs, not three. District and street are the fork's hard
case. Their dashed strokes are the noisiest glyphs in the set
(`pins-near.png`) and the only line-drawn identities. I'd redraw them as
solids (district = a solid square with corner ticks knocked out; street = a
solid ribbon) so line means "control" without exception. Open question
whether the owner wants them to keep mirroring the map outlines.

"other" as a lone dot: agree it has to go (it clashes with the anchor dot,
you-are-here, and V3's far-zoom dot). A small solid pin-flag or asterisk.

### 5. What I think the concepts become (for the director to steer, not decided)

Three that differ in kind, each with rim star + one slot + the three-voice
grammar underneath:

- **A · Blaze**: open loud (solid), visited = hollow ring. The map empties as
  you travel.
- **B · Second run**: open as today, visited = misregistered half-strength
  reprint. Quietest; the closest to "same app, fixed".
- **C · Shell off**: open as today, visited = bare inked glyph; the peel
  moves into the transition.
- (+ V4 Small sticker as the keep-what-he-chose pole, if the director wants
  a fourth.)

### 6. Open questions

1. Does the owner accept that pins carry no fine detail (whimsy moves to
   motion + tag)? That's a rule shift from the sticker era.
2. Does "visited = weaker" (V2) read as "disabled" to him? Only he can
   answer. Show it, don't argue it.
3. Category ink values: D1 needs a value pass on lavender/teal. Is that in
   scope (it touches the brand colour-tokens pass)?
4. District/street glyphs: solid redraw, or keep the dashed mirror of the
   map outline?
5. V4: is the check in the sticker sacred, or may the category glyph replace
   it?

NEXT: design director: four live directions (A Blaze, B Second run,
C Shell off, + V4 Small sticker) and a proposed three-voice grammar, with
real-size sketches. Needs steering on which go to concepts and whether
"pins speak in big channels; whimsy lives in motion and on the tag" is a
rule we put to the owner.

## Pass 1: design director, 2026-10-13

Read: owner.md, inventory.md + the inventory PNGs and context screens
(map near, tag starred + visited), both sketch sheets, docs/owner-taste.md
in full, design/inspo (README, park posters), the shipped "Pencil Star",
"Stamp returns to rows" and star-colour entries. Real random draw (Python
`SystemRandom`): fields **weather-map symbols** and **hobo signs**; Oblique
Strategy **"Honor thy error as a hidden intention"**.

### 1. What the owner is actually asking for (my read, to steer by)

Two complaints and one review method, not one:

1. **Inverted hierarchy.** "the checked items are stronger visually than the
   open ones". This is about *state weight*, mostly on the map. In
   `ctx-map-near.png` the two dark stickers are the first thing the eye hits,
   above any place still to do.
2. **Noise / no family.** "too noisy… needs more clarity… full rev", plus his
   older "icons don't fill the same visual space" and "lightly rounded like
   the rest". This is about the *drawing language* across all ~74 marks: six
   stroke weights, three checks, two ×s, text-character icons, Leaflet's
   white Lucida box, a star wearing a keyline *and* a halo.
3. **"every icon in the app up next to each other."** He'll judge it as a
   *set*, on the canvas, today beside the proposal. So a concept that only
   fixes the visited pin hasn't answered him.

So every concept has **two layers**: a *state model* (how open, starred,
visited and selected relate) and a *grammar* (how every icon is drawn).
Concepts should **differ in the state model** and **share one grammar**.
That keeps the comparison readable (one variable at a time) and respects
"Fewer variations". The grammar is still fully shown and judged, just once.

### 2. The draw, applied seriously

- **Weather maps** put hundreds of symbols on one map and stay readable
  because of one discipline: **each variable gets exactly one visual
  channel, and the legend never reuses a channel.** Cloud cover = how full the
  station circle is; wind = the barb; temperature = a number in a fixed
  slot. That is the systems "one state, one mark" rule, and visual's "four
  channels survive at 24px" finding, from a field that has solved it for
  a century. So here's the rule I want every concept to state on its
  canvas as a **legend**: *channel → meaning*. Fill/hollow, value,
  shell/no shell, size, colour hue: each is spent on exactly one thing.
  Today, size is spent on both *selected* and *zoom*, dark fill on both
  *visited* and *selected*, and orange on star *and* clusters. That double
  spending is the noise. A concept that can't fill in its legend without a
  channel appearing twice isn't done.
- **Hobo signs** were marks left by travellers who'd been there, for the next
  traveller: a few scratched strokes, no decoration, readable at a glance.
  The lesson is about *voice*: the "been here" mark should look **left by
  the traveller**, not printed by the guide. That's already the shipped
  grammar ("printed = the guide's facts, stamped = where you've been,
  pencilled = what you care about"). It argues against any visited
  treatment that reads as the *system* graying things out (V2's risk), and
  for one that reads as *you* acting on the place. Killed on the spot: a
  scratched slash across the pin. At 24px a slash over a ring is the
  universal "no / prohibited" sign.
- **"Honor thy error as a hidden intention."** The error: done things are
  loud. What's the intention hidden in it? *Done things want to be
  celebrated.* That's real, and the owner liked it: the peel, the ink
  bleed, the dry-up. So celebration belongs to **the moment** (the
  transition) and **the big surfaces** (tag, row), not to the **resting
  map**, which is a to-do list. This is visual's rule, reached from the
  other side, and it's why I back it (with a sharper wording, §3).

### 3. Steering the open threads

**Visual's rule "pins use only the big differences; whimsy goes to motion
and the tag."** I back it, reworded so it's a rule the owner can check in a
second: **"At rest, a pin says one thing per channel. The character lives
in how it changes and in the tag."** It isn't "no whimsy on pins". A
whole-pin change of form (a shell that falls away, a blaze) *is* character.
What's ruled out is *small detail at rest* (fold, punch, relief, texture,
peel flap). It is a shift from the sticker era, and he chose the peel by
name ("A peel is a peel"), so **it goes to the owner as a question, shown,
not argued**: concept D keeps the resting peel, the others move it into the
transition. He decides by looking.

**The three-voice grammar.** Yes, and it's not new: it's the shipped
printed / stamped / pencilled grammar grown to cover every icon. I'd name
the voices by *who made the mark*, because that tells the user what kind of
thing it is:

| Voice | Who made it | Members | Drawn as |
|---|---|---|---|
| **Printed** | the guide | 11 category glyphs, plan numbers, cluster count | flat solid silhouettes, one corner radius, matched optical area |
| **Inked by you** | the traveller | visited (stamp), star (pencilled in, lands as printed orange) | the stamp/pencil language already shipped; the only voice allowed tilt and texture |
| **Line** | the tool | every control: sort, filters, locate, collapse, × , +, check, chevron, more, compass, account, zoom | one stroke per size step, round caps and joins, one ×, one +, one check, no text characters |

Two consequences the visual designer owns but should show explicitly:
the **sort/plan check** is a Line check and the **visited check** is an
Inked check. Two checks with two jobs, drawn so the difference is
obviously intended. And the **tag's open Star/Visited segments are
controls**, so their open state is Line-voiced and their done state is
Inked. That's the "same object, two inkings" idea (V5) and I want it in
every concept. One caution on V5's *ghost stamp* for open Visited: a dotted,
uninked stamp can read as **disabled**, and "actions visible but disabled"
is exactly how the signed-out tag looks. Open must invite the tap at full
ink. Draw the open segment and the signed-out segment side by side and
prove they differ.

**Is the shipped visited look in scope to replace, or only its weight?**
In scope. "full rev" plus a complaint that names the checked items
directly. But it was approved after many rounds, so the set **must include
a concept that keeps it and fixes only weight** (D below). That's not a
token gesture: it may honestly be the best answer, and I won't mark it down
for being conventional. The **row stamp** is a separate question. The
complaint reads as mostly the map, but a 72px VISITED stamp is the widest
mark in a row. Concepts show the row both ways (stamp kept vs. the
concept's row) and the owner says which (question 2).

**Selected.** Today selected *inverts* to category-ink fill, which spends
"dark fill" twice (visited also = dark). In every concept, **selection is
navy**: the selected row is already navy, so one selection colour across
surfaces is the brand rule ("keeps the meaning it has elsewhere"). Size
bump + navy ring, or navy field. The visual designer picks; navy is fixed.

**Star.** The rim star (one element, no halo, no keyline) is the right
move toward "one state, one mark". Two risks to test, not argue: at 16px
far zoom the star breaking the rim may read as a *bite* (the notch the
owner called stupid), and orange without any halo on busy OSM tiles
(orange roads!). Main roads on OSM are orange/yellow. Test it on a real tile
crop with an orange road under it.

**Visited + starred.** One slot is right for the resting map. Whether a
visited place still shows its star at all is the owner's call (question 3).
Until he answers, concepts keep the star on visited places at the visited
weight (the star steps back with its place).

**District / street.** Rows, chips and approx pins only (he said "no map
pin" for shapes). They're identity, so they join the Printed voice as
solids that keep their *idea*: a parcel with a knocked-out dashed edge, a
road ribbon. Dashes at 12px are the noisiest marks in the set. Designer's
call, not the owner's. Show today beside it and he'll react.

**"other".** Redraw. A dot collides with the anchor dot and you-are-here,
and it's the lightest glyph in the set. Designer's call.

**Leaflet zoom +/−.** It's the loudest *foreign* object on the map (white
box, grey border, Lucida). Concepts redraw it in the Line voice on paper.
Whether to remove it altogether (pinch exists; the locate button exists)
is the owner's call (question 4). Not blocking. The attribution flag
stays: it's licence text, not ours to restyle.

**Clusters.** Orange disc = the brand accent spent on "many places here",
next to an orange star. That's double spending again. Not a blocker, but
every concept's legend must say what a cluster is and show a starred
cluster at real size.

### 4. The concept set (four, differing in the state model; one shared grammar)

| | Concept | Open | Visited | Where the character lives |
|---|---|---|---|---|
| **A** | **Blaze** (systems D1) | solid category disc, paper glyph | hollow ring + glyph (today's open pin) | the map empties as you travel. The visit lands as the paint lifting off. |
| **B** | **Second run** (V2) | today's ring + glyph | the same pin reprinted at low value, slight misregistration | print craft. The visit lands as a second pass of the screen. |
| **C** | **Shell off** (V3) | today's ring + glyph | ring + paper gone; glyph inked straight on the map | the peel moves into the transition: the shell peels away like sticker backing; un-visit dries it back. |
| **D** | **Sticker, re-weighted** (V4) | today's ring + glyph, redrawn | the shipped dark sticker + peel + check, smaller and lighter than an open pin | keeps what he chose. Fixes weight only. |

Why these four: A changes **fill logic**, B changes **value**, C changes
**form**, D changes **size/weight inside the shipped idea**. Four kinds,
one each, which is the weather-map rule applied to our own concept set.

My strongest objections now, so the designers solve them in the concept
and not after a score:

- **A Blaze:** the hollow ring is the universal *unchecked* sign (empty box,
  open circle). Visited = hollow may read *backwards* in a second. And
  today's open pin literally becomes tomorrow's visited pin, so two users with
  muscle memory get flipped. Also a day-0 trip is a field of solid discs:
  "too noisy" again. To survive, visited must say *done* positively, not
  just "less", and day 0 must be calm. If it can't, kill it at the steer.
- **B Second run:** "disabled". The misregistration has to read as
  *printed twice* at 24px on a phone in one second, or it's a grey-out. Also
  check that it doesn't read as the "visited = same thing, less" the owner
  rejected as "not differentiated nearly enough".
- **C Shell off:** a bare glyph on OSM tiles may read as an *OSM POI icon*
  (OSM draws its own small glyphs for cafés and restaurants). That's the
  biggest risk, and only a real tile crop answers it. In rows, the bare glyph is
  heavier than the ring, so rows may need their own half.
- **D Sticker:** the dark mass is still the darkest mark on the map even at
  14px, and the check still erases the category (taste rule "Preserve the
  category icon"). It has to prove smaller is enough. The sticker's face
  *colour* is in scope (not only its size); the check vs. a cream glyph is
  question 5.

### 5. What each concept delivers (fidelity)

Real size, phone-readable (1170px-wide 3x stills, plus 1x), **today beside
proposal** on every frame, and on the shared canvas
https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW as new artboards beside
the inventory (don't edit the inventory boards).

1. **Shared grammar board (once, owned by visual, systems checks it):**
   every one of the 74 inventory entries redrawn, each next to its
   today version, grouped by voice; the stroke/size ladder; optical-area
   check of the 11 glyphs at 12/18/23px (same visual space, J4).
2. **Per concept:**
   - **Legend** (channel → meaning), showing no channel used twice.
   - **State matrix**: open / starred / visited / starred + visited × rest /
     selected / far zoom / approx / plan-numbered, at real sizes.
   - **The trip in three moments, full phone map screen, ~25 pins:** day 0
     (nothing visited), halfway, last day (90% visited). The hierarchy has
     to hold at all three. Day 0 is where A dies or lives, the last day is
     where D does.
   - **On a real OSM tile crop**, with an orange road under a starred pin
     and an OSM POI near a pin. If the sandbox can't reach tiles, say so on
     the board and use the closest honest substitute. Don't present the
     fake tile as real.
   - **List**: 4 rows (2 visited, 1 starred to-do, 1 plain), plus the navy
     selected row, row stamp kept vs. changed.
   - **Tag**: the stub in open, done and signed-out states, side by side.
   - **The transition**: a 4–6 frame storyboard of visit-lands and
     un-visit-dries-up (the dry-up must stay "by thickness"). Stills only at
     this stage, no build.
3. **Not in scope:** the + / account badges' containers and placement
   (their crews). We supply their glyphs in the Line voice and nothing else.

### 6. For the owner, batched (none block concept work: each is shown both ways)

1. **Pins at rest:** "a pin says one thing per channel; the character is in
   how it changes and in the tag". OK to move the resting peel into the
   transition? (Shown: D keeps it; A/B/C don't.)
2. **Rows:** is the VISITED stamp in the list part of "too strong", or is it
   just the map? (Shown: stamp kept vs. each concept's row.)
3. **Visited + starred:** once you've been, do you still need to see it was
   starred? (Default shown: yes, at the visited weight.)
4. **Leaflet zoom +/−:** restyle it into our icons, or remove it (pinch +
   locate)? (Shown: restyled.)
5. **Sticker check:** if the sticker stays (D), may its check become the
   cream category glyph, so the place keeps its identity? (Shown: both.)

I'd send these *with* the concepts, not ahead of them. He answers faster
looking at frames, and "make sure shit makes sense before bringing it to
me" argues for one message.

### 7. Next

Concept building starts on the shared grammar and A–D. First steer after the
designers' next pair of turns. I'll decide on a kill (most likely A, if
day 0 is noisy or visited reads "unchecked") at that steer, not now. I
haven't seen A's three trip moments yet.

NEXT: product designer (systems focus) — turn the steer into the build
plan: the legend template, the state matrix and the three-trip-moment
fixture (~25 places, one real tile crop), so both designers draw A–D
against the same frames.

## Pass 2: product designer (systems focus), 2026-10-13: the build plan

The director's steer stands as given: four concepts (A Blaze, B Second run,
C Shell off, D Sticker re-weighted), one shared grammar in three voices
(Printed / Inked by you / Line), and fidelity on the shared canvas. This turn
is the plan both designers draw against, so all four concepts are judged on
**the same frames, the same places and the same states**. Jobs are in
`jobs.md` (short, phone-readable); the checks below name them by J-number.

### 0. Two corrections to what we've been assuming

1. **"Signed out" is gone from the tag.** `origin/main` (6df733a "Playground
   is the signed-out app") boots signed-out visitors into the playground
   with a guest session (`createPlaygroundClient`, guest
   `{ id: 'playground' }`), so `currentUser` is set and the tag's Star and
   Visited segments are **live**. The greyed `.tag.is-off` + sign-in slip
   path still exists in code, but normal use never reaches it. So **the tag
   has two states per segment, open and done**. There's no third,
   signed-out column. The director's caution still applies, aimed at a
   different target: the app has one "unavailable" look,
   `--state-off-alpha: 0.4` (add-form submit disabled, sort loading, plan
   picker `aria-disabled`). **No open state and no visited state may look
   like 40% opacity.** That's the guard for B Second run's tint and for
   V5's ghost stamp. Every board carries a small "unavailable (today)"
   reference swatch next to the concept's visited and open-control marks.
   - This primary checkout is behind `origin/main` (no playground commits).
     Read `git show origin/main:index.html` for current behaviour. The icon
     inventory predates the playground. No icon changed with it except the
     account menu, which now holds only a Sign in button.
2. **Clusters ignore "visited" today.** `mapVisibleLocations()` gives a
   cluster a star if *any* member is starred, whether or not it's visited,
   and the disc is always solid brand orange. So on the last day a cluster of
   seven places with two visited stars and one open star still shouts as
   loudly as on day 0, which breaks J1 at the zoom the owner sees first.
   Every concept's legend must say what a cluster's star and weight mean
   (my default: **a cluster shows the star only for an open starred member,
   and its weight follows "any open member"**; an all-visited cluster
   recedes like a visited pin). It's a systems call for the concepts, and
   I'm making it so all four answer it the same way. Director, overrule if
   you disagree.

### 1. The shared fixture (`concepts/fixture/`)

`fixture.json`, generated by `make-fixture.py` (`python3 -I make-fixture.py`;
edit the script, not the JSON). 27 real Reykjavík places: 24 on the near
screen, all 11 categories, 2 approximate (a district and a street, which
get pins only as approx), 7 starred.

| Moment | Visited | What it tests |
|---|---|---|
| **day0** | none | Is a fresh trip calm? (A's risk) |
| **halfway** | 13 of 27 (incl. starred 1, 2, 5) | Does to-do outrank done when they're mixed? (J1 core) |
| **lastDay** | 24 of 27; the 3 left are all starred (10, 14, 20) | Can you find the last three among 24 done? (D's risk, J1) |

Frames (positions precomputed, CSS px in a **390 × 545 map viewport**, the
map area of a 390 × 844 phone above the list; the top 70px is under the
account/+ badges, and nothing is placed there):

| Frame | Zoom | Shows | Clusters (app rule, `clusterCellPxForZoom`) |
|---|---|---|---|
| **near** | 14 (= `SOLO_MIN_ZOOM`, all solo) | 24 near pins with glyphs | none. **Real overlaps kept on purpose**: 3/5 (8px), 2/24 (12px), 10/11 and 16/24 (~18px). Dense old towns do this, so judge stacking legibility here. |
| **mid** | 13 | 20 near pins + 3 clusters (3+5 ★, 8+10 ★, 12+22) | the boot-ish overview |
| **far** | 11 | 3 far pins (16px, no glyph) + 4 clusters | far pins + clusters with mixed states |

Selection: **2 Brauð & Co** (starred + visited at halfway; the same place as
today's context screen, so before/after line up) and **8 Kaffibarinn**
(open, plain). Plan: "Saturday", stops 5, 3, 12, 16, 21 (district, approx), 7.

### 2. The basemap: honest label

Real OSM tiles **can't be reached from the sandbox** (tile.openstreetmap.org,
Carto and Stadia all return a proxy 403, tested 2026-10-13). So:
- Draw a **stand-in basemap** in OSM-Carto colours: land #F2EFE9, water
  #AAD3DF, park #C8FACC, buildings #D9D0C9, and the three road
  classes that matter: **primary #FCD6A4, trunk #F9B29C, secondary #F7FABF**
  (OSM's orange/yellow roads, the director's star risk). Run a primary road
  under starred pin 1 (Bæjarins) and trunk under 14. Add 3 small OSM-style
  POI icons (café cup, fork, museum) in OSM's own brown/grey near pins 2, 8
  and 6 (C Shell off's risk: does a bare glyph read as an OSM POI?).
- Every frame on the stand-in carries the label **"stand-in basemap, not real
  OSM tiles"** in its corner. Never present it as real.
- **To get a real crop (optional, not blocking):** one phone screenshot from
  the owner of the live app around Frakkastígur / Hallgrímskirkja at zoom
  14–15. The pins can then be laid over a real tile crop. It goes in the
  director's owner batch as a small ask, not a question.

### 3. Legend template (every concept fills one, J2 + the director's weather-map rule)

One row per visual channel. Each channel has **at most one meaning**. Any
channel with two meanings is marked DOUBLE and the concept isn't done.
Filled in for **today** first, to show the owner the problem in one table:

| Channel | Today means | Concept means |
|---|---|---|
| Fill vs hollow (shell) | open pin = hollow ring + paper; **selected = solid; visited = solid (dark)**: DOUBLE | |
| Value (full ink vs tint) | (unused) | |
| Shell present / absent | approx = dashed shell; far = shell without glyph | |
| Size | **zoom (16/24) and selected (32)**: DOUBLE | |
| Hue: category inks | category | |
| Hue: brand orange | **star, cluster, + and account glyphs, tag band**: DOUBLE (triple) | |
| Hue: navy | selected row; controls | |
| Hue: dark sticker #3A4C5B | visited | |
| Glyph slot content | category; plan number replaces it; visited check replaces it (**erases identity**) | |
| Shoulder slot | star (+ keyline + halo = 3 elements) | |
| Texture / tilt (Inked voice) | visited stamp, Pencil Star, tag type stamp | |
| Motion | visit lands / dries up; star inks / rubs out; selected pulse | |

Plus one line per concept: **what a cluster says** (count, star rule, weight
rule).

### 4. State matrix (every concept, real sizes, one board)

Places: rows = **open · open★ · visited · visited★**. Columns:

| Surface | Columns |
|---|---|
| Map pin | near 24 rest · near selected · far 16 rest · far selected¹ · approx near · approx selected · plan-number near · plan-number selected · plan shape diamond |
| Map other | cluster (all open · mixed · all visited) × (no star · open★ member · only visited★ members) at 24; shape anchor star / visited (24 target); tag anchor dot; you-are-here |
| List row | Places row · Places row selected (navy) · Plans stop row · Plans non-stop row: badge + star + visited mark + × at real size |
| Tag stub | Star segment open / done · Visited segment open / done · Directions (one state) · the **unavailable reference** swatch beside them |
| Filter chip | active · inactive, all 11 glyphs at 12px |

¹ The inventory shows selected only at 32px. Check in the build whether a
far pin can be selected without a zoom-in. If it can't, mark the cell n/a
rather than drawing it.

Backgrounds: every map cell on stand-in tile (land, and once over a primary
road); every row cell on `--paper` and on the navy selected row. 1x and 3x.

### 5. The screens (per concept, today beside proposal, 1170px-wide 3x stills)

1. **Trip in three moments**: near frame at day0 / halfway / lastDay
   (full phone: map + list header + 3 rows). **Squint test**, J1: blur each
   at 4px and say in one line what the eye lands on first. It must be an
   open place at all three moments.
2. **mid frame, halfway, and far frame, lastDay** (clusters and far pins).
3. **List**: halfway, rows 1 Bæjarins (★ done), 2 Brauð & Co (★ done,
   selected/navy), 3 Café Loki (done), 8 Kaffibarinn (open), 22
   Skólavörðustígur (approx street, diamond). Shown twice where the concept
   changes the row: **row stamp kept vs. the concept's row** (owner Q2).
   Plus the Plans list for "Saturday".
4. **Tag**: 2 Brauð & Co (★ done) and 8 Kaffibarinn (open), side by side.
5. **Storyboard** (stills, 5 frames each, timings from `docs/shipped.md`,
   "dry up by thickness" kept as specified):
   - **Visit lands, from the tag**: rest open → tap → impact peak → settle →
     rest done, on the tag **and** its pin together (the pin is visible
     above the tag).
   - **Visit lands, from a row swipe**: same 5 beats on the row; the pin
     follows *after* the gesture as a separate step (animation separation
     rule; the owner's "State changes animate wherever they come from").
   - **Un-visit dries up**: rest done → tap → mid-dry (thickest parts last)
     → final snap → rest open, on the tag and the pin. For C Shell off and
     A Blaze, say what "dries up" means when the done state carries *less*
     ink than open (the ring/fill dries back *in*?). It's the one place
     the shipped motion may need reversing. Say so plainly.
6. **Shared grammar board** (once, visual owns, I check it): all 74 entries,
   today beside redraw, grouped Printed / Inked / Line; the stroke and size
   ladder; the 11 glyphs' optical-area check at 12/18/23; **one ×, one +,
   one Line check, one Inked check**, with no text-character icons left.
   Glyphs only for the + / account badges (their crews own the containers).

### 6. How I'll check each concept (before the director scores; full table in `jobs.md`)

Pass/fail per job, with the frame that proves it:
J1 squint test at all three moments · J2 legend has no DOUBLE, and open vs
done is distinguishable in grayscale **and** at far zoom · J3 count the
elements per pin (a starred + visited pin ≤ 2 elements) · J4 the grammar
board (one ×, one +, ≤ 2 checks with two jobs, one stroke per size step) ·
J7 the glyph is visible in every state cell · J8 a starred to-do is the
first thing found on lastDay · J9 the tag's open segments read as tappable
next to the unavailable swatch · J10 the storyboards exist and keep the
shipped motion character.

### 7. Ownership (so nobody waits)

- Systems (me): fixture, legend for today, matrix template, checks; the
  "how it works" part of each concept (the cluster rule, the motion
  reversal note, selection).
- Visual: the shared grammar board; drawing A–D in the matrix and screens.
  It's your call where each concept's character lives.
- Director: kill/keep at the next steer (A is on watch for day 0), the
  owner batch (+ the optional real-tile screenshot ask).

NEXT: product designer (visual focus): draw the shared grammar board first
(everything else depends on it), then A–D in the state matrix against
`concepts/fixture/fixture.json`. I'll fill in each concept's legend and
"how it works" as your matrices land.
