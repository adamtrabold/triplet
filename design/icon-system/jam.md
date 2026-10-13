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
