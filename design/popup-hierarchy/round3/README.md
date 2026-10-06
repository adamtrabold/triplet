# Popup hierarchy: Round 3 concepts (visual designer)

Fresh designer, 2026-10-05. Brought in because the owner found rounds 1–2
"kinda average". Nothing here edits `index.html`.

**Contact sheet for the owner:** `index.html` ("Popup Concepts Round 3").

## Owner words driving this round (verbatim)

- "Directions is fine. Have them check this against the inspo / product
  philosophy…I like whimsy and these all seem kinda average. The most
  exciting ideas as far as whimsy have been cut"
- "Also we're trying to rate concepts here not execution — tell cd don't
  kill if the mock was bad kill if the idea was bad. Replacing list with info
  is a fine thing to explore."
- "Bonus points but not required if the map pin is conceptually aligned with
  whatever it "opens up" to"
- "If you're not logged in actions should be visible but disabled"
- "Type is actually tier 2 imo — or bottom of tier 1. Notes are tier 1"
- Standing: "so much information all visual hierarchy is starting to
  struggle"; "icon is treated differently for category in the pop up than on
  the map — why?"; "No star unless it's been starred."; "Spacing between
  things is insane and icons don't fill the same visual space"; "A measured
  spacing system should already exist - if not create it".

All four new quotes are in `docs/owner-taste.md` (Character section, and the
Controls section for "Directions" and signed-out).

## What I took from the inspo and the reviews

The inspo (`design/inspo/project/`, `design/inspo/visited-badge/`) is a
set of **objects**: luggage labels with a name lockup and an emblem
(Savoy oval, de la Poste and Guynemer bands), string tags, matchbooks with
one ink on paper, park posters with condensed caps titles, a trail scrapbook
with typed notes and a rope rule, passport stamps. Rounds 1–2 borrowed the
paper colour and the stamp and nothing else, which is why they read as "a
Google Maps card in beige" (CD). So each concept here is **one object** from
that set, and the object's own parts carry the place's content. The rule I
held: a part of the object only exists if it holds something real (the
stub holds the address, the postage stamp is the category seal, the
postmark is Visited, the tab exists only when there is more behind it). No
part is there to decorate.

Character comes from:
- **Form:** die-cut outlines (a chamfered tag with an eyelet, a perforated
  stub, a stamp frame with clipped corners, a perforated postage stamp, an
  index card with a tab), drawn as measured SVG behind the content.
- **Type:** one family, Archivo, but its width axis does the talking:
  62% condensed caps for label and stamp lettering, 112% for the postcard
  name, 75% caps for meta and buttons as today. One stand-in typewriter face
  in Card File (flagged).
- **Paper and ink:** `--paper-raised` card stock, soft natural shadows
  (two drop shadows at 10% and 8%; no hard edges), navy stamp ink at the
  row stamp's 82%, `--figure-deep` only where it says "this place".
- **Motion:** each object arrives the way the real thing would (a tag
  drops and swings, a label rises, a card is pulled from the file, a stamp
  comes down, a seal flies to the stamp corner). Shown as frames.

From the reviews (`../round2/ux-review.md`, `../round2/cd-review.md`):
- UX hard limits are held in every concept: one-tap Directions / Star /
  Visited, 44px targets, nothing moves on a tap, a typical note readable
  with no tap, the OSM credit visible, nothing parked at the screen edges.
- UX soft defaults I broke on purpose: the box-with-a-tip (Hanging Tag uses
  a string; Luggage Label and Postcard use the sheet), the single button row
  (Passport Stamp and Postcard move Visited into the object), no inner
  scroll (Hanging Tag's back).
- CD: D killed and not carried. Every concept gets one inspo object. The
  action row is re-measured (below). The orange selected row is avoided
  structurally in the three sheet concepts; the two in-map ones still show
  it (open question 3).

## Shared parts (every concept)

| Item | Response |
|---|---|
| Notes tier 1 | A note shows **whole** up to 4 lines in the in-map objects, 6 in Luggage Label and 7 in Postcard / Card File (more room). Past that it cuts at a word with "…" and a quiet MORE (or the concept's own long-tail move). The p90 note never folds. |
| Type | The meta line under the name, 10px condensed caps `--ink-2`, with "· Stop n of m" in Plans. In-map concepts put a 14px seal before it, so the category icon is in the card even when the Plans pin shows a number (CD fix A2). |
| Category icon | Always the pin's own seal (`badgeHtml()`, paper field, category rim and glyph; diamond for districts, dashed for approx). Never the bare glyph. |
| Action row | **"Directions"** (owner). Icon 16px + 6px + word for all three; 16px (`--s4`) between actions; left-aligned on the content channel. Visited ON is the stamp's own check glyph + VISITED in stamp ink, the same mass as ★ STARRED, instead of the 72px stamp ring that was ~3x the other icons (CD). |
| Star | One per surface: the button is the mark (filled + STARRED when starred, outline + STAR otherwise). No star mark anywhere when not starred. |
| Signed out | Owner: "visible but disabled". Star and Visited render at `--state-off-alpha` (0.4), from the state system. **Directions stays live**: it edits nothing and needs no sign-in today. Rendered as `signedout` for Luggage Label, Hanging Tag, Passport Stamp and Postcard. |
| Spacing | Only `--s1…--s12`. Text starts on one channel per surface: the 56px spine on sheets (16 + 40 seal + 12 in Luggage Label, whose seal is larger), 16px inside in-map objects. |
| Pins | **Unchanged in every concept.** No concept proposes a new pin. |
| Close | ≥44px, plus map tap. Card File uses a "put back" chevron, not ×, so it never reads as the rows' delete ×. Postcard uses "‹ list name" at the top. |

## How the stills were made

`render.js` loads the real app (`index.html`, unmodified) in the gesture
harness, patches real rows' text into fixture rows (same data as rounds 1–2),
injects `concepts.js` and draws one concept on the live page: real markers,
real list, real seal and stamp code, tokens and glyphs. The basemap is round
1's stand-in drawing (tiles are blocked). 1x stills are box-downscaled from
3x. Chromium only.

States: **busiest** VEGA (starred, visited, Plans stop 2 of 3, 5-line note,
3-line OSM address), **typical** Aurora (3-line note), **approx**
Værnedamsvej (8-line note with a paragraph break, dashed pin), **bare**
Perlan (name only), **shape** Grandi district, plus **longname** where the
lettering is at risk. Motion frames `f1…f5`; pink dashed lines and rings
are annotations, not UI.

Files: `<concept>/<state>-phone@1x.png`, `<state>-crop@3x.png`; `_sheet/`
holds the JPEGs for `index.html`. `node render.js [concept | concept/state]`
re-renders; `node build-sheet.js` rebuilds the sheet.

---

## 1. Luggage Label (`label/`) — revives round 1's Luggage Label, on the sheet

**Idea.** Tapping a place turns the list sheet into that place's hotel
label. A `--figure-deep` band is the label: the pin's seal at 40px is its
emblem, the name is set as label lettering (Archivo 62% condensed caps, two
lines at most; a longer name falls back to mixed case), and the type line
is letter-spaced like "CORTINA D'AMPEZZO / DOLOMITI". The band ends in a
shallow die-cut point. Below, on paper: the note, a one-line address,
then the buttons in ink.

**Inspo.** `hotel-de-la-poste-cortina-label.jpg` (the name band and its
two smaller lines), `hotel-guynemer-casablanca-label.jpg` (the band and
the spaced caps), `hotel-savoy-dolomiti-label.jpg` (emblem + name lockup).

**Where the tiers live.** T1: name in the band, note under it, ★ / VISITED
state in the button row. Type: the spaced caps line under the name (bottom
of the lockup). T2: buttons at the sheet's foot, one fixed y for every
place. T4: one-line address + ›.

**Density.** The sheet is a fixed 300px (UX: fixed beats content-sized). The
CD's void problem is answered by the label taking the slack: the lettering
grows (2 lines max) until the lockup fills the band, so a name-only place
gets poster-scale lettering (`bare`: PERLAN) and VEGA gets a compact band.
The paper never shows a hole between content and buttons larger than the
spacing scale's own gaps.

**Pin link (bonus).** The seal lifts off the pin, flies down and lands as
the label's emblem (`f1`→`f3`); × reverses it and the list returns as left
(`f4`). The pin itself is unchanged. The pin's visited mark is the sticker;
the label's is the check in the button row, so there's no second visited
language on the label.

**Colour.** The band is the only colour on screen and it means "this place
is open": the list (and its orange selected row) is away, and Directions
goes ink so it doesn't compete (CD).

**Truth list** (`docs/ux-brief.md`). J1 identify: name in label lettering
at the top of the sheet, seal = pin. J2 decide: the whole note at reading
size, map fully clear. J3/J4/J5: one tap each, fixed y (y≈822 here). J6:
"STOP 2 OF 3" in the type line. J7: × in the band + map tap; the list
returns as left (`f4`). J8: one-line address + ›. J10: list tap → fly →
label. Parity: as round 2 B (list controls unreachable while open; owner
said fine). Hierarchy at 1x (busiest): band + name > note > buttons >
address > type. Convention: a place sheet (Apple/Google Maps), branded.

**Weak spots.** A big orange field; on a name-only place it is half the
sheet, which the owner may call loud. Condensed caps names are slower to
read than mixed case (long names fall back). You can't see the list while a
place is open. The "label takes the slack" rule means the band's height
differs per place (the buttons do not move).

## 2. Hanging Tag (`tag/`) — the label idea at the pin, as a string tag

**Idea.** The place hangs off its pin on a short string, as a luggage tag:
chamfered top, a punched eyelet ringed in the category's colour, the name in
condensed lettering, the note, the buttons, and a perforated tear-off stub
at the foot that holds the address. The tag hangs **below** the pin, never
over it. A long note ends in TURN OVER ↻: the tag turns on its string and
the back holds the whole note and the full address (read-only; TURN BACK to
act).

**Inspo.** `hotel-savoy-dolomiti-label.jpg` and the other labels (the
object you tie to luggage), `yosemite-trail-scrapbook-collage.jpg`
(paper, string/rope rule, paper tags).

**Where the tiers live.** T1: name, note (whole to 4 lines), star/visited
state in the buttons. Type: seal + meta line under the name. T2: buttons
on the tag. T4: the stub (one line + ›), the back (full).

**Density.** On open the map pans the pin to one spot near the top
(y≈112), so the tag always has the strip below it; a busy front is ~280px
tall. The long tail moves to the back instead of growing the front.

**Motion.** `f1` tap → `f2` drops and swings 9° → `f3` swings back −3° →
`f4` settled. Taps are taken only once it has settled; reduced motion skips
the swing (UX). `f5` is the turn-over.

**Pin link (bonus).** The pin is the knot; the string replaces the tip; the
eyelet ring carries the pin's category colour. Pin unchanged.

**Truth list.** J1: name in lettering under the pin. J2: note whole to 4
lines; long notes one tap (turn over). J3/J4/J5: one tap, 44px. J6: meta
line. J7: × on the tag (44px) + map tap. J8: stub, one tap. J10: list tap →
fly → tag. Parity: list visible and live below. Hierarchy (busiest): name >
note > Directions (the only colour) > ★ / ✓ > stub address > type.
Convention: map callout, re-shaped.

**Weak spots.** It still covers ~280px of map below the pin. The back has no
buttons (one more tap to act after reading a long note), and the shipped
orange selected row in the list is still the loudest thing on screen
(question 3). Every open pans the map to the same spot.

## 3. Card File (`file/`) — revives round 1's side tab and round 2's row lift

**Idea.** The list is a card file. Tapping a place pulls **its** card up out
of the file: it stands up at the front of the sheet, keeping its number (2)
or seal, its name and type. It is an index card: a thin `--figure-deep`
rule under the heading (the index card's red line), and the note typed on
the card's ruled lines. A small index tab sticks up over the map only when
something is behind the card (REST OF NOTE ›, ADDRESS ›); a bare place has
no tab. A "put back" chevron (not ×) returns it to its slot.

**Inspo.** The ledger rows (`design/inspo/README.md`), the typed notes in
`yosemite-trail-scrapbook-collage.jpg`, the printed forms in
`vintage-camping-brochures-collage.jpg`. The tab is round 1's Side Tab
brought back as an index tab, used only for the long tail (CD).

**Where the tiers live.** T1: name on the card, the typed note on its lines.
Type: meta under the name. T2: buttons at the card's foot (fixed y). T3/T4:
the tab.

**Density.** Fixed 300px; up to 7 typed lines show whole (VEGA whole), a
longer note shows 6 lines and the tab. The ruled lines fill the card, so a
short or bare card reads as a blank index card rather than a gap.

**Motion.** `f1` tap the row → `f2` the card is pulled up out of its slot,
tilting as it comes (its slot left as a recess) → `f3` it stands at the
front → `f4` put back: the list as left.

**Pin link (bonus).** The card is the place's own row (same number in Plans,
same seal); the pin and the row were already one record (CD). Pin unchanged.

**Truth list.** J1: card heading, number/seal on the spine. J2: whole typed
note on lines. J3/J4/J5: one tap, fixed y. J6: the stop number stays on the
card, and the meta line says "Stop 2 of 3" (fixes UX's C blocker: order
and number). J7: put-back chevron (not a delete ×) + map tap. J8: tab.
J10: list tap → pulled card. Parity: rows stay in the file under the card.
Hierarchy: name > typed note > buttons > tab > type. Convention: place
sheet / expanded row.

**Weak spots.** The typewriter face is a **stand-in** (Liberation Mono,
local); building it means adding a webfont such as Courier Prime (owner
question 4). Ruled lines are many hairlines: the owner may read them as
noise. It's the quietest of the five; its character is mostly in the motion.

## 4. Passport Stamp (`stamp/`) — new, bold

**Idea.** The card at the pin is an entry stamp. The place's name, type and
seal are set inside a stamp frame with clipped corners, like the Tokyo
"DEPARTED" stamp. **Not visited**, the frame is a dashed ghost in `--hair`,
a printed box waiting for ink, and its foot band reads ○ MARK VISITED: that
band is the Visited button. **Tap it** and the stamp comes down: the frame
and band ink in navy at the row stamp's 82%, the whole stamp takes the
place's stamp tilt, and the band reads ✓ VISITED. The button row is then
only Directions and Star.

**Inspo.** `passport-stamp-tokyo-annotated.jpg` and
`passport-stamps-grid.jpg` (frame, condensed caps, the band under a rule).
The motion is the owner's own: "it should stamp with some grow shrink …
ink bleeding in".

**Where the tiers live.** T1: name in the stamp, note under it (whole to 4
lines), state = the stamp itself. Type: the top line of the stamp. T2:
Visited is the stamp's band; Directions + Star below the note. T4: one-line
address + ›.

**Density.** As round 2 A (fixed open spot low in the strip, grows upward
on MORE), but one fewer button and the visited mark merged into the
heading.

**Motion.** `f1` ghost frame, tap → `f2` the stamp comes down big and faint
→ `f3` lands with a shrink, ink bleeds → `f4` settled.

**Pin link (bonus).** Partial: the card and the list row share one visited
language (the stamp); the pin keeps its sticker, as shipped. This concept
makes the sticker/stamp split explicit (stamp = paper, sticker = map), it
doesn't hide it. Pin unchanged.

**Truth list.** J1: name in the stamp. J2: note whole to 4 lines, state
read from the frame at a glance. J3/J5: buttons below. J4: the band, one
tap, 44px tall, fixed in the card. J6: stamp's top line. J7: × (44) + map
tap. J8: address line. J10: unchanged. Hierarchy (busiest): stamp (name +
inked frame) > note > Directions > ★ > address. Convention: none for the
button-in-a-stamp; the band must read as a button (it says MARK VISITED
with the ring).

**Weak spots.** The frame is a box around the name (ledger: no heavy boxes);
I think the ink earns it, the owner may not. Caps names wrap to 2 lines.
A dashed ghost on every unvisited card is a mark for "not yet" (close to
"no marks for empty data"). It's still a box at the pin. The boldest of the
five; it may read as a costume.

## 5. Postcard (`post/`) — new, bold

**Idea.** The list sheet becomes the back of a postcard. Left of the divide:
the name (Archivo 112%, the postcard's heading voice), type, and **your note
as the message**. Right: a perforated **postage stamp** carrying the pin's
seal, and below it the **address on ruled address lines** (three lines,
cut, full on tap). **Visited is the postmark**: the row stamp, struck across
the postage stamp's corner. Not visited, the space under the stamp says ○
MARK VISITED, and that corner is the button. "‹ Gate Plan" at the top goes
back to the list.

**Inspo.** The trail scrapbook (`yosemite-trail-scrapbook-collage.jpg`),
the passport stamps (postmark), the labels' perforated edges; a postcard is
the travel object for "a place and what I wrote about it".

**Where the tiers live.** T1: name, the message, the postmark/star state.
Type: under the name. T2: Directions + Star at the foot (fixed y); Visited
at the stamp corner (fixed). T4: the address lines (visible but quiet,
`--ink-2` 11px), the full address on tap.

**Density.** Fixed 300px. The message column is narrower (~210px), so the
note wraps to more lines; up to 7 show whole (VEGA whole), longer ones show
6 + MORE. The address finally has a home where it reads as tier 4.

**Motion.** `f1` tap the pin → `f2` the pin's seal flies down to the
postage-stamp corner as the postcard rises → `f3` Mark Visited: the postmark
is struck (grow, settle).

**Pin link (bonus).** Strong: the pin's seal **is** the postage stamp, and
it travels there. The visited postmark is the row stamp, so the postcard
and the list agree; the map keeps its sticker. Pin unchanged.

**Truth list.** J1: name + stamp. J2: the message, whole for VEGA. J3/J5:
foot buttons. J4: stamp corner, one tap, fixed (112×80 target). J6: meta.
J7: "‹ list" + map tap. J8: address lines + tap. J10: list tap → postcard.
Hierarchy (busiest): name > message > postmark > Directions > address >
type. Convention: none; the back link is iOS's.

**Weak spots.** The message column is narrower than any other concept's.
Visited sits in the top-right corner, away from the other two buttons
(still one tap, but a reach). The postage stamp's perforation is subtle on
paper. The list is away while a place is open.

## Cut this round

- **Pinned Note** (drafted, rendered, cut). The pin as a pushpin holding a
  note scrap to the map: the scrap's corner sits under the pin, so the pin
  is the card's leading glyph. Strongest pin link of all, but once drawn it
  was round 2's in-map card turned 1°: not more whimsical, so not worth the
  owner's look. Code kept in `concepts.js` (`C.note`) as a donor (the
  pin-as-glyph-column idea).
- **Tri-fold brochure** (row unfolding as a folded brochure panel): folded
  into Card File, which carries the row-lift with a clearer object.
- **Matchbook striker** for the button row (CD suggestion): not used,
  because each surface gets one object (CD's own constraint) and a striker
  band next to a label band is two.
- **Map name label**: not used. Every concept now carries the name on its
  object, and a second printed name was the doubling the CD counted.

## Open questions (owner / CD / UX, not decided here)

1. Which object has the character the owner wants?
2. Luggage Label and Postcard replace the list while a place is open (owner
   said fine to explore). Card File covers it with the pulled card.
3. The two in-map concepts (Hanging Tag, Passport Stamp) still sit next to
   the shipped orange selected row, which the CD calls the loudest thing on
   screen. The three sheet concepts avoid it.
4. Card File's typewriter face needs a new webfont. Yes or no?
5. Passport Stamp and Postcard move the Visited button into the object
   (the stamp band, the stamp corner). UX to check discoverability.

## Not verified

- Chromium stills only; no gesture, timing, re-render or VoiceOver run.
- Stand-in basemap; no Safari toolbar in the harness (`--chrome-bottom` 0).
- Motion is frames, not animation; timings are not designed yet.
- The typewriter face is a local stand-in.
- Signed-out renders only dim controls; sign-in flows are unchanged.

---

## Finalist fixes (after `ux-review.md` and `cd-review.md`)

The CD's finalists are Postcard, Luggage Label and Hanging Tag. Passport Stamp
and Card File were killed on the idea and are left as they were (their stills
above are unchanged). The owner's page is `../finalists/index.html` ("Popup
Finalists"), built by `../finalists/build.js` from this folder's renders.

**Both sheet concepts (Postcard, Luggage Label): the sheet sizes to its
content.** It is at most 300px and stays anchored to the bottom, so the
buttons keep one y for every place and a short place gets a short card
instead of empty paper or a big orange field. The cost is that the map's
bottom edge moves from place to place. The map grows to meet the sheet, and
the OSM credit sits on the sheet's top edge.

**Postcard**
- The postage stamp now reads at 1x: white stamp paper with a scalloped
  perforated edge and a soft shadow, a field tinted with the category ink,
  and the pin's seal at 40px.
- Name-only places: the card shrinks (`bare`), so there's no gap.
- Signed out, not visited: rendered (`signedout-unvisited`).
- The "‹ list" back link is gone, replaced by a 44px × at the top right, so
  nothing invites the iOS edge back-swipe.
- The address now flows across the ruled lines as one string (3 lines,
  "…"), instead of comma pieces. The full address is a tap away.
- The CD hybrid: Mark Visited strikes the postmark with Passport Stamp's
  motion (`f3`→`f6`: tap, comes down big and faint, lands with a shrink and
  an ink bleed, settles). The dashed box in `f3` is the target: the stamp
  and Mark visited, never the address lines.

**Luggage Label**
- The band hugs the lettering. Perlan is a ~90px band, not ~230px.
- Long names stay in label lettering: condensed caps shrink to fit 2 lines
  (minimum 18px). The 49-character Swedish museum name fits at about 20px.
- "(approx.)" is out of the band. The meta line reads "DISTRICT · APPROX.
  PLACEMENT".
- The seal is centred on the lockup in every state.
- Optional hybrid (`postmark`): when visited, the row stamp in paper ink is
  struck across the band's die-cut foot and becomes the Visited control; the
  button row drops to Directions + Star.

**Hanging Tag**
- The busiest note shows 4 lines, then TURN OVER ↻.
- Both top corners are chamfered symmetrically about the eyelet (28px).
- The orange selected row: **while a tag is open, the list lowers to its
  header** using the app's own collapsed state, and closing restores it. The
  row is still selected (pin and row select together), it's just off
  screen. The tag gets the whole map, and nothing outranks it. The cost is
  that the list changes position while a tag is open. UX should confirm
  that this counts as sheet state, not lost list state.
- The back carries the buttons and the ×, and the note scrolls with a fade
  at its foot. Acting after a long note is one tap (`busiest-back`,
  `approx-back`).
- Swing: 6°, then −2°, then settled, 300ms in total. The hit targets sit at
  their settled positions from the first frame, drawn as dashed boxes in
  `f2`. Reduced motion has no swing.

**Not fixed / still open**
- UX build-time checks (Safari toolbar inset, swapping pins while open, a
  drag inside a card never panning the map) can't be shown in stills.
- What a tap on a disabled Star or Visited does when signed out is the
  owner's call. UX suggests it opens sign-in.
- Card File's 44px tab and the Stamp's band target rule: those concepts were
  cut, so they weren't reworked.
