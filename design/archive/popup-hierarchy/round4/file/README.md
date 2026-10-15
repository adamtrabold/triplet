# Popup round 4: Card File, developed (visual designer)

2026-10-05. Concept mockups only; `index.html` is untouched. This develops the
round-3 Card File (`../../round3/file/`), which the CD cut and the owner asked
to see more of. v2 had three variants. After `cd-review.md` and
`ux-review.md`, **two are carried: Rolodex and Dealt Out.** Stand-Up is not
carried; its v2 stills in `up/` are history.

## Owner words driving this (verbatim)

- "i also think the card file exploration is interesting, but i can't really
  see it... would like more there. the typewriter font is unnecessary."
- Address: "#1 since there's a directions button". This means store a proper
  short address, shown as street + number · neighbourhood.
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

## Which two, and why (the design call)

The reviews disagree. The CD keeps Rolodex, keeps Dealt Out only as a donor
and kills Stand-Up. UX ranks Dealt Out > Stand-Up > Rolodex.

- **Rolodex: carried.** It's the only variant where the owner can *see* a
  card file (CD), and that is the owner's own complaint. UX's two problems
  were sizing and affordance, not the idea, and both are fixed below.
- **Dealt Out: carried.** It's UX's first choice: the whole list stays live,
  the foot stays at one y, and Plans can go stop to stop in one tap. It also
  has the round's best pin link (the tab points at the pin). The CD's case
  against it was the heavy navy card and the empty row; both are fixed
  below. It's also the opposite answer to Rolodex: the card goes onto the
  map, not into the list. That makes the two a real choice for the owner.
- **Stand-Up: not carried.** As a still it reads as an expanded row (CD). It
  covers the header, locate included (UX). Near the end of a list its card
  lands on other rows. Its one good idea, the row stamp as the card's
  Visited control, now lives in both carried variants.

## What both carried variants share

- **The list is a card file before any tap** (`f1`). The list sits in a
  tray (#E2D9C7, one step below the filed paper, so visited cards still
  lift off it). The tray has soft inner walls. Each row is a round-topped
  card top, 10px in from the walls. A card's edge is its soft upward shadow
  plus a 1px light catching its top edge (the owner's allowed 1px definition
  edge). There are no hairlines. Row content, height and the left channel
  are unchanged.
- **Short address** under the name: `street number · neighbourhood`, from
  stored parts, never cut by length. It joins with " · ", the same form as
  Hanging Tag. Hand-derived for the mocks: "Rejsbygade · Humleby" (VEGA's
  stored string has no house number), "Fiskislóð 53 · Örfirisey",
  "Sibyllegatan 2 · Östermalm". Whether the full address is a tap away is
  UX's call, so no full-address state is drawn and the line carries no ›.
- **Notes always in full.** No fold, tab, flip or MORE.
- **The tab carries the type only.** The stop number lives once, on the
  card's lead (the cloned row lead: number + seal in Plans, seal
  elsewhere).
- **Visited is the shipped row stamp** in the foot's Visited slot, the same
  mark as the row. Marking visited brings it down (`v1` tap → `v2` the stamp
  big and faint, mid-strike) and the paper steps to the row's filed tone.
  The notch is gone (CD: it read as a dot).
- **The foot:** Directions · Star · Visited, with an even 24px (`--s6`) gap
  between hit boxes. Each target is 44px tall. In Plans the foot starts at
  the seal column so all three fit next to the wider number + seal lead.
- **Put back** (⌄ 44px, or a map tap) returns the list **exactly as it was
  left**. Nothing re-scrolls the list to stage the card (`f1` = `f5`).
- **Swap in one tap:** with a card open, a tap on a live row or a pin opens
  that place's card directly (`swap` → `stop3`).
- **Signed out:** Star and Visited at 0.4, Directions live (`signedout`,
  `signedout-unvisited`).

Stills are in `<variant>/<name>-phone@1x.png` (full phone, 1x) and
`<name>-crop@3x.png`. The **filmstrip** `<variant>/filmstrip.png` is one
phone-readable image of the main motion: the file, pull, open, put back,
then the Visited moment. Frames: `f1` the file + tap, `f2` and `f3` the
pull, `busiest` open, `f4` put back, `f5` back in the file. Pink dashed lines
and rings are annotations, not UI. To re-render, run `node render.js
[variant | variant/name]`, then `node filmstrip.js`.

States for each variant: busiest (VEGA, Plans stop 2, starred, visited,
5-line note) · typical (Aurora) · typvis (the same, visited) · approx
(Værnedamsvej, 8-line note in full) · bare (Perlan) · shape (Grandi
district) · plans (stop 1 of 3, long name) · signedout ·
signedout-unvisited · swap + stop3 · v1–v2.

---

## 1. Rolodex (`rolo/`)

**Idea.** The list sheet is a card drawer. Its header stays put and stays
live. Tap a card (or its pin) and the drawer opens once, to one fixed height
(452px, the same for every place), and the card tips forward to face you.
**Behind it** stands one card edge: the card before it (in Plans, "1
Bæjarins Beztu"). The edge is a real 44px target that opens that card.
**In front of it**, the cards after it stay where they are, as the live rows
they are (stop 3, then the Add-from section).

**Motion** (`filmstrip.png`). `f1` tap → `f2` the drawer opens and the card
tips forward (rotating about its foot) → `f3` → `busiest` → `f4` it tips back
→ `f5` the drawer closes, with the list exactly as left.

**Inspo.** A card drawer / Rolodex, and the ledger rows as card tops.

**Tiers.** T1: name, short address, the whole note, the star/stamp state in
the foot. Type: the tab at the card's top right (it sits on the edge
behind, a full edge away from the header's locate icon) plus the seal. T2:
the foot. T3: ⌄. Stop order: the lead number, the edge behind and the rows
in front.

**Density.** The drawer is fixed, so the map edge (y=392) and the header
never move between places. The card is as tall as its content; the rows in
front fill the rest. Værnedamsvej (8 lines) fills the drawer down to one
row. A note longer than the drawer scrolls inside the card; no real row
needs it, and it isn't drawn.

**Pin link.** The pin and the card are one record. The map pans the pin
into the shorter map. The pin is unchanged.

**Truth list** (`docs/ux-brief.md` checklist; jobs from `../../ux-analysis.md`).
- J1: name, number + seal, the type tab.
- J2: the whole note.
- J3, J4, J5: one tap each, 44px.
- J6 Plans: number on the lead, stop 1's edge behind, stop 3's live row in
  front. One tap on either opens that stop (`hits`, `swap`, `stop3`).
- J7: ⌄ + map tap; the list returns as left.
- J9: dimmed edit actions, Directions live.
- J10: the tip-forward motion.
- Parity: header live and fixed; rows in front live; the card behind is a
  44px target.
- Hierarchy at 1x (busiest): name > note > foot > address > edge > tab.

**Weaknesses.**
- The open drawer is 452px, so the map shrinks to 392px for every place,
  even a name-only one.
- On a short card the rows in front fill the drawer. That's useful, but it
  means more list on screen while a place is open.
- The first card in a list has no edge behind it, only a strip of tray.
- The last card in a list has nothing in front, so the tray shows under it
  (`shape`).

## 2. Dealt Out (`out/`)

**Idea.** Tap a card and it's pulled out of the file and laid on the map
under its pin, slightly askew (−0.6°). Its index tab, carrying the type,
points up at the pin. For a district, the tab points at the district's label
point (`shapeAnchor`), the point its diamond marker uses. The file closes up
around **a narrow slot** (22px, the tray floor in shadow) where the card
goes back. It's no longer an empty numbered row. The list isn't scrolled and
stays fully live. If the card was opened from its pin and its row is
off-screen, the slot is simply off-screen.

**Visited.** The card keeps its paper, filed like the row. Only the **tab**,
the small part of the card that meets the pin, is inked in the visited pin
sticker's colours: dark ink, cream type and a cream check (`busiest`,
`typvis`). The foot carries the row stamp. The navy slab is gone.

**Motion** (`filmstrip.png`). `f1` tap → `f2` out of the file → `f3` laid
under its pin; the file closes to a slot → `busiest` → `f4` it slides home →
`f5` the list as left.

**Inspo.** A card dealt out of the file onto the table (the map). The
shipped visited sticker for the inked tab. Round 1's side tab for the
tab-as-pointer.

**Tiers.** As Rolodex. The tab doubles as the pointer to the pin.

**Density.** The card is 358px wide and as tall as its content; its foot
sits 14px above the file, at one y for every place. The pin is never pushed
under the top controls (it stays at y ≥ 110). A note that would need more
room than that scrolls inside the card; no real row reaches it, and it isn't
drawn.

**Pin link (bonus).** The tab points at the pin, and a visited tab wears the
pin's sticker ink.

**Truth list.**
- J1, J2: as Rolodex.
- J3, J4, J5: one tap each, 44px; the foot is at one y.
- J6 Plans: number on the lead, the slot in the file, all stops live. One
  tap on stop 3 swaps (`swap`, `stop3`).
- J7: ⌄, map tap, or the slot.
- J9: dimmed, Directions live.
- J10: the deal motion.
- Parity: the whole list and header live.
- Hierarchy (busiest): name > note > foot > inked tab > address.

**Weaknesses.**
- It covers the strip of map between the pin and the list.
- At a glance the card is still a callout on the map. The file shows in the
  motion and the slot, and in the stills only in the slot.
- The slot is 22px, too small to be a 44px target on its own, so put back
  relies on ⌄ and a map tap; the slot is a bonus target.

## Stand-Up (`up/`): not carried

Its stills are v2. They are not re-rendered and carry the old address form.
They're kept for the record.

## Shared limits held (UX hard limits)

- One-tap Directions and Visited, 44px targets: yes.
- Nothing moves on tap: toggles change state in place. The Rolodex drawer
  opens once per open, not per place.
- A typical note is readable without a tap: every note is shown in full.
- OSM credit: stays on the map's bottom edge.
- Safari edges and toolbar: nothing interactive in the 24px side edges. The
  `--chrome-bottom` inset is 0 in the harness, so the foot over Safari's
  toolbar is unverified.
- Gesture gate: no row-gesture change. The file look is background and
  shadow on rows; the card is a separate layer.

## Could not render / not verified

- Chromium stills only; no Safari or iPhone run. Motion is frames, not
  timing.
- Stand-in basemap.
- Swap and scroll-restore are shown as frames, not run.
- No full-address state is drawn (UX's call).
- A note too long for the space (scrolling inside the card) isn't drawn.
- `stop3` is a fixture row (no note, no stored short address).
- The district's diamond marker isn't drawn at the rendered zoom, so in
  Dealt Out's `shape` the tab points at the outline's label point.
- The short addresses are hand-derived for the three real rows shown;
  running the rule over all 201 addresses (UX must-fix) is build work.
