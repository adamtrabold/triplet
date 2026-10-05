# Popup round 4: Card File, developed (visual designer)

2026-10-05. Concept mockups only. `index.html` is untouched. These develop the
round-3 Card File (`../../round3/file/`), which the CD cut and the owner asked
to see more of.

## Owner words driving this (verbatim)

- "i also think the card file exploration is interesting, but i can't really
  see it... would like more there. the typewriter font is unnecessary."
- From the Hanging Tag notes, which apply here too: "i wonder if the address
  shouldn't be closer to the place name (as sometimes the address *does*
  matter at a glance, if something has multiple locations or something)" ·
  "i also feel like theres some sort of unique thing we could do on the rip
  off area if visited is in there" · "long notes should just show full
  length - the flip over is meh."
- "If you're not logged in actions should be visible but disabled"
- "Bonus points but not required if the map pin is conceptually aligned with
  whatever it "opens up" to"
- "Directions is fine. Have them check this against the inspo / product
  philosophy…I like whimsy and these all seem kinda average. The most
  exciting ideas as far as whimsy have been cut"
- "Also we're trying to rate concepts here not execution … Replacing list
  with info is a fine thing to explore."
- "Type is actually tier 2 imo — or bottom of tier 1. Notes are tier 1"

"the typewriter font is unnecessary." is now in `docs/owner-taste.md`
(Character).

## What changed from round 3, and why

Round 3 never showed the file. The list looked like the shipped list, so the
card came out of nothing. Its character was a typewriter face and about ten
ruled hairlines (CD: "mostly ruled hairlines … kinda average"). Round 4
keeps the metaphor and drops both of those:

- **The list is drawn as a card file before any tap** (`f1` in every
  variant). Each row is the visible top of an index card standing in a tray.
  There's no rule between rows. A card's edge is the soft shadow it casts on
  the card behind it ("edges are shadows, not hard lines"), with the tray
  (`--paper`) showing 6px either side of the cards (`--paper-raised`).
  Visited cards keep the shipped filed paper (`--paper-filed`), so the
  file already says "filed" for visited. Row content, its 56px height and
  its left channel are unchanged.
- **No ruled lines on the card and no typewriter face.** Archivo throughout:
  the name 18/24 600, the note 14/20 `--ink`, and caps 75% for the tab and
  the buttons.
- **The index tab has a fixed job: it carries the card's sorting key, its
  type** (and "Stop n of m" in Plans, plus "approx. placement"). That's
  what tabs in a card file do. Type is tier 2, so it sits on the tab, small,
  outside the reading block. The seal in the lead column still shows the
  type's icon at a glance. Every card has a tab, so the tab no longer
  signals "there's more behind this card" as it did in round 3.
- **The address sits under the name.** One line at a glance: street, number
  and neighbourhood taken from the OSM string ("Rejsbygade, Humleby",
  "Fiskislóð 53, Örfirisey"). A tap shows the full string in place
  (`up/addr`): the card grows upward and the buttons stay put.
- **Notes always show in full**, with no fold, tab, flip or MORE (Værnedamsvej's
  8 lines and paragraph break included). The card grows to fit.
- **The card is the row.** It carries the row's own lead (the stop number
  and seal in Plans, the seal elsewhere) cloned from the live row, so the
  number and icon you tapped are the ones on the card.
- **Put back** is a 44px ⌄ (a card goes back down into the file, as UX
  ruled in round 3) plus a tap on the map.

The three variants differ in where the card goes when it's pulled, what
happens to the rest of the file, and how Visited marks the card.

Stills: `<variant>/<name>-phone@1x.png` (full phone, 1x) and
`<name>-crop@3x.png`. Frames `f1`–`f5` are the motion. `busiest` is the open
state between `f3` and `f4`. `v1`–`v2` are the Visited moment. Pink dashed
lines and rings are annotations, not UI. To re-render, run `node render.js
[variant | variant/name]` (real `index.html` in the gesture harness, real
rows' text, round 1's stand-in basemap).

States rendered for each variant: busiest (VEGA, Plans stop 2, starred,
visited, 5-line note in full, long OSM address) · typical (Aurora, not
visited) · typvis (the same place, visited) · approx (Værnedamsvej, 8-line
note in full) · bare (Perlan, name only) · shape (Grandi district) · plans
(stop 1 of 3, a long name, starred) · signedout (visited) ·
signedout-unvisited.

---

## 1. Stand-Up (`up/`)

**Idea.** A row is the top of a tall index card. The rest of the card is
hidden behind the cards in front of it. Tap the row (or its pin) and the
card is pulled straight up out of its slot, so its face slides out from
behind the card in front. The foot of the card never leaves its slot: it
ends exactly where the next card starts. The cards in front of it, and the
rest of the list, stay where they were and stay live. The card covers the
header and the cards behind it, and stands up over the bottom of the map.

**Motion.** `f1` the file; tap VEGA → `f2` pulled a third of the way: the
head shows and the note is still behind the card in front → `f3` nearly up:
the buttons come out last → `busiest` standing → `f4` put back (⌄ or tap the
map): it slides down behind the card in front → `f5` the list as left.
Reduced motion: a cut.

**Visited.** The row's own stamp moves into the card's foot and becomes the
Visited control, in the slot where Mark visited was. The card is the row,
so the row's stamp comes with it. Marking visited (`v1` tap → `v2`) brings the
stamp down in place (big and faint, then it lands, with the swipe-visit
stamp motion) and the card's paper steps to the row's filed tone. There's
one visited mark, not a stamp plus a button.

**Inspo.** The ledger rows (each row already reads as a card top), a library
card drawer, the trail scrapbook's paper-on-paper layering.

**Tiers.** T1: name, address line, the whole note, star/visited state in the
foot. Type (bottom of T1 / T2): the tab, plus the seal. T2: the foot buttons
(Directions, Star, Visited/stamp). T3: ⌄ put back. T4: the full address (a tap
on the address line).

**Density.** The card is as tall as its content and grows upward from its
slot. The opened row is scrolled to the first slot under the header, so the
foot is always at the same y (about 600–656 here). The busiest card reaches
y≈366 and Værnedamsvej reaches y≈330. The map pans the pin into the clear
strip above the card. A name-only card is about 120px.

**Pin link.** The pin and the row were already one record. Here the card
rises straight out of the list toward its pin, which the map has moved into
the strip above it. The pin itself is unchanged.

**Truth list** (`docs/ux-brief.md` checklist, jobs from `../../ux-analysis.md`).
- J1 identify: name at 18px, seal and number on the card, the tab gives the
  type.
- J2 decide: the whole note, with nothing folded, at every length rendered.
- J3, J4, J5: one tap each in the foot. They're 44px tall and keep one y
  for every place, because the foot is the slot.
- J6 Plans: the stop number stays on the card's lead, and the tab reads
  "STOP 2 OF 3". Stop 3 sits visibly in front in its slot (`busiest`,
  `plans`).
- J7: ⌄ (44px) plus a map tap. `f5` returns the list as left.
- J8: one line at a glance, the full address on one tap (`addr`).
- J9 signed out: Star and the stamp/Mark visited at 0.4, Directions live
  (`signedout`, `signedout-unvisited`).
- J10 list tap: this is the open motion itself.
- Control parity: the list rows in front stay live. The header (sort,
  filter, locate) is covered while a card is up and returns on put back.
- Hierarchy at 1x (busiest): name > note > stamp/Directions > address >
  tab.
- Convention: an expanding row / place sheet.

**Weaknesses.** The card covers the header, so the list's controls are out
of reach until put back. A long note stands the card tall over the map
(Værnedamsvej reaches y≈330). A shape or place near the end of the list
can't scroll to the first slot, so its card stands lower and covers the
cards behind it (`shape`). The 72px stamp in the foot is heavier than the
other two buttons. That's deliberate, because it's the visited moment, but
the CD flagged its mass in round 3.

## 2. Rolodex (`rolo/`)

**Idea.** The list sheet is the drawer, and it keeps its header (live). Tap
a card and it tips forward to face you and fills the drawer. The cards
before it stay behind it as edges above, and the cards after it stay in
front as edges below, in list order. Each edge is an 18px card top with its
number (Plans) and its name in 11px. The drawer grows to fit the card and
the map gives way. You can see where you are in the file: in Plans, stop 1
is above and stop 3 below.

**Motion.** `f1` tap → `f2` the card tips forward (rotating about its foot)
while the rows fold down into edges → `f3` nearly up → `busiest` → `f4` put
back: it tips back and the edges open into rows → `f5` the list as left.

**Visited.** An **edge notch**, the mark of an edge-notched (McBee) card
file. A visited card has a half-round notch punched out of its top edge,
always at the same x. Every visited card in the file shows its notch in
that column, the edges above and below included (Brauð in `busiest`). It is
a reduction, not an added mark ("coloured in with reduction of
information"). Marking visited (`v1` → `v2`) punches the notch: the chad
drops and the paper is filed. The foot button reads ✓ VISITED.

**Inspo.** A Rolodex / card drawer, and the ledger rows as card tops. The
notch is borrowed from library and McBee card files. That's outside the
inspo folder, but it's the same paper-object family.

**Tiers.** As Stand-Up. The tab sits on the card's top edge at the right, so
it never collides with the edge names on the left.

**Density.** The drawer is header + up to 2 edges + card + up to 2 edges.
Busiest is about 340px. Værnedamsvej is about 455px and leaves the map from
the top down to y≈385 (`approx`). Name only is about 220px.

**Pin link.** Same as Stand-Up. The map pans the pin into the reduced map.

**Truth list.**
- J1, J2: as Stand-Up.
- J3, J4, J5: one tap each, 44px, in the foot. The foot's y follows the
  drawer, so it isn't fixed across places. The foot sits just above the
  bottom edges.
- J6 Plans: best of the three. The order shows above and below the card
  (edges 1 and 3 around stop 2, `busiest`; stop 1 has no edges above,
  `plans`).
- J7: ⌄ plus a map tap.
- J8: one address line. The full address is a tap away; it's drawn only in
  Stand-Up (`up/addr`), and behaves the same here.
- J9: dimmed edit buttons, Directions live.
- J10: the tip-forward motion.
- Parity: the header stays live (best of the three). The other rows become
  edges, which aren't tap targets (18px).
- Hierarchy (busiest): name > note > Directions > tab > edges.
- Convention: a sheet that replaces the list (owner: "fine to explore").

**Weaknesses.** The notch reads at 1x only as a small bite out of the top
edge. It's the quietest Visited of the three, and on its own it would fail
"visited must be clearly different". The filed paper and ✓ VISITED carry
the state; the notch is the moment. The edges add four more horizontal
edges to the drawer (they're soft, but there are four), and their names
are truncated. The drawer's height, and with it the map, changes per place.
The edges aren't tappable; making them 44px would cost the space they
exist to save.

## 3. Dealt Out (`out/`)

**Idea.** Tap a card and it's pulled all the way out of the file and laid on
the map under its pin, slightly askew (−0.6°). Its index tab, carrying the
type, points up at the pin, so the tab joins card to pin instead of a tip.
The file keeps the card's gap: an empty recessed slot, still numbered in
Plans. The gap is where the card goes back, and the whole list stays
visible and live below.

**Motion.** `f1` tap → `f2` out of its slot, tilted −2°, travelling up; the
gap opens → `f3` laid under its pin → `busiest` → `f4` put back (⌄, tap the
gap, or tap the map): it slides back toward its gap → `f5` in place, the list
as left.

**Visited.** **The card is inked in the visited pin sticker's colours**:
`STICKER.INK` #3A4C5B, with cream type and a cream check. The open card and
its pin then say "visited" the same way: you tap a dark-sticker pin and get
a dark card. Not visited, it's cream paper. Marking visited (`v1` → `v2`)
floods the ink out from the Visited button across the card. It's the most
distinctive Visited of the three, and the strongest pin link.

**Inspo.** A card dealt out of the file onto the table (the map). The
sticker colours are the shipped visited sticker. The tab-as-pointer comes
from the round-1 side tab.

**Tiers.** As Stand-Up. The tab doubles as the pointer.

**Density.** The card is 358px wide and as tall as its content. The map pans
so the card's foot sits 14px above the file, and the pin sits above the
tab. Værnedamsvej puts the pin at y≈180. A note long enough to push the pin
under the top controls would need the card to scroll inside (not drawn).

**Pin link (bonus).** The tab points at the pin. A visited card wears the
pin's sticker colours. The pin itself is unchanged.

**Truth list.**
- J1: name; the tab under the pin.
- J2: the whole note.
- J3, J4, J5: one tap each, 44px. The foot is 14px above the file, at one
  y for every place.
- J6 Plans: the stop number on the card plus the numbered gap in the file,
  with stops before and after visible and live (`plans`, `busiest`).
- J7: ⌄, a tap on the gap, or a map tap. Each is 44px or larger.
- J8: as Stand-Up.
- J9: dimmed, Directions live. On the ink card the dim reads as cream at
  0.4 (`signedout`).
- J10: the deal motion.
- Parity: the whole list is live, header included (best with Rolodex).
- Hierarchy (busiest, visited): the dark card > name > note > Directions >
  tab. Not visited: name > note > Directions > tab.
- Convention: a map callout, re-shaped as a card.

**Weaknesses.** It covers the most map: the strip between the pin and the
list. A dark card is a big block of ink. It reads well and it's a state, but
the owner may find it loud for a "done" place, and it inverts the rows'
"visited recedes" idea (the rows file visited places darker-but-quiet; this
card goes darker-and-louder). In-map cards have been called "average"
before. The deal motion and the gap are what make this one the file. A
district pin under the tab isn't visible at the rendered zoom (`shape`), so
the tab points at the district's outline.

---

## Shared limits held (UX hard limits)

- One-tap Directions and Visited, 44px targets: yes in all three. In Plans
  the foot row starts at the seal column, so all three buttons fit next to
  the wider number + seal lead.
- Nothing moves on tap: toggles change state in place. Opening the full
  address grows the card upward, and the foot doesn't move.
- A typical note is readable without a tap: every note is shown in full.
- OSM credit: it stays on the map's bottom edge, above the file or drawer.
  In Dealt Out the card's foot clears it by about 6px.
- Safari edges and toolbar: nothing sits in the 24px side edges except card
  paper (6px tray inset), which isn't a control. The `--chrome-bottom` inset
  is 0 in the harness, so the foot's position over Safari's toolbar is
  unverified.
- Gesture gate: no row-gesture change is proposed. The file look is a
  background/shadow change on rows, and the card is a separate layer.

## Could not render / not verified

- Chromium stills only. No Safari, no iPhone, and no real animation timing:
  the motion is frames.
- Stand-in basemap (tiles are blocked).
- The Rolodex and Dealt Out full-address state isn't drawn. It behaves as
  in `up/addr`.
- An extreme note that would overflow the screen (scroll inside the card) is
  not drawn; no real row needs it.
- Fixture rows fill the rest of the list. In `plans`, stop 2 shows a fixture
  name (Harpa), because only stop 1 carries real data.
- `shape`: the district's anchor badge isn't drawn at this zoom, so its pin
  is absent in that still.
- In `up/v2` the stand-in basemap drew at a slightly different scale; the
  map isn't part of that frame's point.
