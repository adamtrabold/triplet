# Popup hierarchy, Round 1: CD review

CD (fresh, 2026-10-05). I did not author or suggest any of this work. Scored
against `docs/cd-brief.md`, `docs/owner-taste.md`, the owner's words for this
task, and `../ux-analysis.md`. Stills judged: `<concept>/busiest-phone@1x.png`
first, then `busiest-crop@3x.png`, then the opened (`busiest-x`), `bare` and
`shape` states. The map is a stand-in drawing; I judged the card, not the
geography. The stand-in is calmer than real OSM tiles, though, so anything
printed straight onto the map (Concept 6) will look better here than it
will on the phone.

## Step 1: ledger rules that apply (read before looking)

- "so much information all visual hierarchy is starting to struggle" / busy
  views must keep their hierarchy.
- "type should go back above the name".
- "icon is treated differently for category in the pop up than on the map".
- "No star unless it's been starred" (a mark only when it means something).
- "Spacing between things is insane and icons don't fill the same visual
  space" / measured spacing system everywhere.
- One left channel; one centred axis for left-column items; align optically.
- Simple simple simple; fewer variations; no second text rows; no dots; no
  heavy rules or boxes; colour must communicate or go neutral.
- Secondary marks never outrank content.
- Controls don't move or grow.
- Reuse existing control styles; don't change the owner's copy without
  asking ("Get Directions").
- Visited: a stamp on rows, a dark sticker with a cream check on pins.
  The navy "VISITED ●" dot is a retired third language.
- Owner, this task: "more ideas for displaying so *much* density", "things
  dont *have* to all be contained in the popup".

## Problems shared by all 8 (shared foundations)

These are in every concept, so I score them once. They also count against
each concept's execution, because the owner sees them in every frame.

- **S1. The star is drawn twice in one card.** A filled star leads the name
  AND a filled star + "STARRED" sits in the action row (`quiet/busiest-crop@3x`,
  `fold/…`, `sheet/…`, `tab/busiest-crop@3x` where the two stars are 1 cm
  apart with no label to tell them apart). The busiest Plans screen shows
  the same star **four** times (pin badge, card name, card control, list
  row: `dock/busiest-phone@1x`). This is an "unnecessary variation" and an
  "inconsistent state": two marks for one fact. **Rejected-pattern match:
  caps every execution score at 6.**
- **S2. Icon-to-word gaps differ inside the one action row.** The compass
  sits in the 28px badge column and DIRECTIONS starts on the text line, so
  there is a ~26px gap at 1x, while the star and the ring sit ~8px from their
  words (`quiet/bare-crop@3x`). Three actions, two spacings: this is exactly
  "spacing between things is insane", reintroduced by the spine rule.
- **S3. The badge floats.** It is centred on the eyebrow + name block, so on
  a 2-line name it drifts to the middle of three lines
  (`quiet/shape-crop@3x`, Grandi). This is the owner's "star looks weird when
  all the content is in it" problem, now happening to the badge. The badge
  column also costs 40px of text width for one mark.
- **S4. The busiest real states were not all rendered.** The approx pin
  (Værnedamsvej, 8-line note: the densest notes in the data) and the long
  name (Scenkonstmuseet, 2-line name + address) are in UX's set but not in
  round 1. Per the brief, a missing busiest state is a fail: render them in
  round 2. Also missing: a place with an address but no note (Fold's peek
  needs it).
- **S5. Copy change.** "Get Directions" → "Directions" is the owner's copy
  changed by a designer. It may well be right, but it goes to the owner as a
  question, not baked into every frame.
- **S6. The list's selected row is a solid figure-deep block** in Tab, Dock
  and Row (`dock/busiest-phone@1x`). That is the shipped highlight, but next
  to an open card it is the loudest thing on the screen and outranks the
  card's name. Any concept that keeps the list visible has to account for it.

## Per concept

Format: score (concept / execution), owner objections, noise count for the
busiest view, rejected-pattern matches, fixes.

### 1. Quiet Fix: concept 5, execution 5

Evidence: `quiet/busiest-phone@1x`, `quiet/busiest-crop@3x`, `quiet/bare-crop@3x`.

Owner objections:
1. "I asked for ideas for so much density and this is the same popup, just
   bigger." (busiest is ~300x300, taller than today's 282.)
2. "Why are there two stars?"
3. "The compass is floating miles away from Directions and the other icons
   aren't. Spacing is still insane."

Noise (busiest card): 7 marks (badge, name star, ×, compass, control star,
stamp ring + dotted track, tip); 3 hue accents (navy badge, figure-deep
Directions, navy stamp) plus ink and grey; 7 text runs (eyebrow, name,
notes, address, 3 action words); 1 box; 0 rules. The notes slab outweighs
the name by mass.

Rejected patterns: S1 (duplicate star).

Fixes: it solves ordering, not density; there is nothing it does that
Concept 2's unfolded state doesn't already do. **Kill as a candidate; use it
only as the reference for Concept 2's unfolded state.**

### 2. Folded Note: concept 7, execution 6 (capped)

Evidence: `fold/busiest-phone@1x` (half the height of today's busiest),
`fold/busiest-crop@3x`, `fold/busiest-x-crop@3x`.

Owner objections:
1. "Two orange words now: MORE and DIRECTIONS. Which one is the action?"
2. "When it opens it's as big as before, and there's an ADDRESS label
   now. That's another header row."
3. "Two stars again, and the compass gap."

Noise (peek): 7 marks, 3 hue accents + the figure-deep MORE (two figure-deep
items), 6 text runs, 1 box, a fade gradient across the end of line 2.
Opened: adds the ADDRESS label, the figure-deep LESS (three figure-deep items
across states).

Rejected patterns: S1; colour that doesn't communicate (MORE/LESS in the
action colour); an extra label row (ADDRESS).

Fixes:
1. Exactly one figure-deep element. More/Less use the neutral control voice,
   or the truncation itself is the affordance.
2. A clean truncation (ellipsis at a word), not a fade under a half-word
   ("Sat Sep").
3. No ADDRESS label; the address's position and tone already say what it is.
4. Define the peek line for address-only places and render it.
5. The opened state over the map: show it with the pin near the top of the
   map strip (autopan vs. the + / account controls). It grows upward, so
   this is the case that breaks.
6. S1–S4.

### 3. Place Sheet: concept 8, execution 6 (capped)

Evidence: `sheet/busiest-phone@1x` (the map is fully clear),
`sheet/busiest-crop@3x`, `sheet/busiest-x-phone@1x`, `sheet/bare-phone@1x`.

This is the only concept that actually changes the density problem rather
than shrinking it: the place gets a surface sized for content, the map is
never covered, and the header reuses the list header's layout and spine (a
system the owner already accepted). It is also the convention phone users
know from Apple and Google Maps.

Owner objections:
1. "Where did my list go? I'm in a plan; I want to see stop 3."
2. "The bottom edge jumps to a different height for every place." (214 /
   141 / 157 / 334: "controls don't move or grow".)
3. "Lines above and below the buttons. That's the box pattern again." And:
   "Which pin is it? Nothing on the map changed." (The selected pin looks
   like every other pin in `sheet/busiest-phone@1x`.)

Noise (busiest peek): 7 marks, 3 hue accents, 5 text runs, 2 full-width
hairlines making a box around the action strip, grabber, 0 cards over the
map. Lowest noise over the map of all 8; inside the sheet it's equal to
Concept 1.

Rejected patterns: S1; rules boxing a control strip ("heavy-handed
divider/select box pattern"): hairlines, not thick, but they make a box.

Fixes:
1. Drop the two rules around the action strip; separate the actions with
   measured space.
2. One sheet height for the peek, ideally the list sheet's own default
   height, so the map edge never moves on open. Content that doesn't fit
   scrolls or raises; the edge doesn't jump.
3. A visible selected state on the map pin (needed for "which one is it"
   and UX C4), drawn in the pin's own language, without adding a new mark
   type.
4. Show the full round trip in stills: list (Plans view) → tap pin → sheet →
   close → the list exactly as left (C9). Show a list tap → fly → sheet
   (C5/J10).
5. Order: UX's intended order is name → marks → notes → actions. Here the
   actions sit before the notes. Either justify it (thumb reach) in the
   README or render both.
6. Bare state (`sheet/bare-phone@1x`): the action strip's three cells
   spread across the full 390 width with large voids; check that spacing
   against the scale.
7. S1–S5.

### 4. Row Unfolds: concept 4, execution 4

Evidence: `row/busiest-phone@1x`, `row/busiest-crop@3x`, `row/shape-phone@1x`.

Owner objections:
1. "Two VISITED stamps on the same place, one on top of the other. And the
   star twice."
2. "Type is under the name again; I told you to put it back above."
3. "The whole screen is a giant orange bar and the list jumped up." (Sheet
   rises to 480; the selected row is the loudest thing on screen.)

Noise (busiest): the row stamp + the unfold stamp, the row star + the
unfold star, the map name flag (a second name), the figure-deep row block,
a gradient fade above it, 3 hue accents, no ×. Highest duplication of any
concept.

Rejected patterns: S1 (doubled), inconsistent/duplicated states, type
below the name (an explicit owner no), a control that grows (the sheet), a
loud colour block.

Fixes: structural, not fixable within the idea. **Kill.** One thing to
harvest: list tap and map tap ending in the same selected state (UX
S1/S2) is a real gain; carry it as a requirement into Concept 3.

### 5. Side Tab: concept 4, execution 5

Evidence: `tab/busiest-phone@1x`, `tab/busiest-crop@3x`, `tab/busiest-x-phone@1x`.

Owner objections:
1. "What is that sideways NOTES tab? I can't read it and I can't hit it."
2. "Two identical black stars right next to each other, and one is a
   button?"
3. "The drawer covers the whole map and it has a CLOSE tab and an ×."

Noise (glance): 6 marks, two identical unlabeled filled stars, a vertical
caps tab (a new control type), 1 box + 1 tab box. Drawer: 2 closes, a big
empty paper area under the actions.

Rejected patterns: S1 (worst instance: no label distinguishes the mark from
the control); a new control invented where an existing one would do; an
extra box (the tab).

Fixes: **Kill the tab and the drawer.** Harvest the glance card itself
(eyebrow, name, one action row at ~268x98, `tab/busiest-crop@3x`): it is the
best-proportioned popup in the round, and it is a good answer for the glance
tier in Concept 2 or as the map-side half of Concept 3.

### 6. Map Label + Dock: concept 5, execution 5

Evidence: `dock/busiest-phone@1x`, `dock/busiest-crop@3x`, `dock/bare-crop@3x`,
`dock/busiest-x-phone@1x`.

Owner objections:
1. "There are four stars on the screen for one place."
2. "The name is floating on the map and the notes are in a box at the
   bottom. Which thing am I supposed to look at?"
3. "Real map labels are going to collide with that name, and the card is
   sitting on top of the OSM credit."

Noise (busiest): 4 stars, 2 VISITED stamps (dock + list row), a figure-deep
row block, the floating dock box between the map and the sheet (a third
layer), the map label with its own eyebrow. The dock has no name in it.

Rejected patterns: S1 (four times); inconsistent states (stamp shown twice
on one screen); an extra box layer.

Fixes: **Kill as a structure** (two objects for one place; the label is
unproven on a real OSM basemap; attribution). Harvest: "the pin is the
category icon" answers the owner's icon-mismatch complaint more cleanly
than copying the badge into the card; consider it for Concept 3's header.

### 7. Action Rail: concept 3, execution 4

Evidence: `rail/busiest-crop@3x`, `rail/bare-phone@1x`.

Owner objections:
1. "There's a filled navy dot for visited. We got rid of that dot."
2. "Why is there a grey column down the side? And GO?"
3. "Perlan is just a name and the popup is huge and empty."

Noise (busiest): a tinted rail field (a box inside the card), a filled
navy disc + check (a dot, and a third visited look in a card that elsewhere
uses the stamp), new copy "GO", "FULL ADDRESS ›" link, notes wrapped to 8
lines in the narrowed column. Bare: ~210px tall for a name.

Rejected patterns: a dot (the retired "VISITED ●" in a new form); a box (the
rail field); inconsistent visited language; new copy.

Fixes: **Kill.** Harvest: shortening the address to a locality line
("Rejsbygade · Vesterbro") is the right instinct for tier 4. It needs stored
structured address data (a backlog/data question for the operator, not a
design one).

### 8. Luggage Label: concept 3, execution 4

Evidence: `lug/busiest-crop@3x`, `lug/shape-crop@3x`.

Owner objections:
1. "A giant orange slab. The colour isn't telling me anything; I already
   know I tapped it."
2. "GRANDI (OLD HARBOUR CREATIVE DISTRICT) in three lines of shouting caps."
3. "There's an orange outline around the whole card now." (A hard coloured
   edge.)

Noise (busiest): one large figure-deep block, a figure-deep outline on the
whole card, white-on-orange caps name, Directions in the same orange
(loses its meaning as the one coloured action), 3 hue accents.

Rejected patterns: colour that communicates nothing new; a hard line where
the card's shadow belongs; a loud element outranking content (the band
outranks the notes the user wrote).

Fixes: **Kill.** The brand impulse is legitimate: the inspo's luggage-label
and ledger language belongs somewhere. Express it through type and paper,
not a colour slab.

## Scores and loop decision

| Rank | Concept | Concept | Execution | Decision |
|---|---|---|---|---|
| 1 | 3 Place Sheet | 8 | 6 (S1, rules) | **KEEP** (lead) |
| 2 | 2 Folded Note | 7 | 6 (S1, accents) | **KEEP** |
| 3 | 1 Quiet Fix | 5 | 5 | Kill; it becomes Fold's opened state |
| 4 | 6 Map Label + Dock | 5 | 5 | Kill; harvest "pin is the icon" |
| 5 | 5 Side Tab | 4 | 5 | Kill; harvest the glance card |
| 6 | 4 Row Unfolds | 4 | 4 | Kill; harvest "one selected state" |
| 7 | 7 Action Rail | 3 | 4 | Kill; harvest the locality line (data question) |
| 8 | 8 Luggage Label | 3 | 4 | Kill |

Nothing in round 1 is ready for the owner as is: every frame carries the
doubled star (S1), so every execution is capped at 6. Nothing is built, and
no `index.html` change exists, so there's no gating violation. The owner
should see round 2's stills, not these, unless the operator wants to show
the spread of directions as context. In that case, call them
"explorations, not proposals" and fix S1 first.

### Round 2 must-fix, per kept concept

**3 Place Sheet**
1. No rules around the action strip.
2. A fixed peek height (match the list sheet's default); the edge never
   jumps.
3. A selected-pin state on the map.
4. Stills of the round trip: Plans list → pin → sheet → close → list as
   left; list tap → sheet.
5. Justify or render the order of actions vs. notes.
6. Bare-state action spacing on the scale.
7. All of S1–S5.

**2 Folded Note**
1. One figure-deep element only.
2. Clean ellipsis truncation.
3. No ADDRESS label.
4. An address-only peek.
5. The opened state with the pin high in the map strip.
6. All of S1–S5.

**Both**
- The four new busiest renders from S4: approx 8-line note, long name,
  address-only, plus a mostly-visited Plans list behind the card.
- One star (S1): pick whether the control's star *is* the mark when starred,
  or the card shows no leading mark. That's the designer's call, but there
  must be one star per surface.
- One icon-to-word gap for all three actions (S2).
- The badge aligned optically to the first name line, never centred on a
  wrapped block (S3).

### Open problems no concept took (for the designer, as problems)

- **The glance and the read are different jobs** (UX J1 vs J2), yet every
  concept gives them one surface at one size. A concept where tapping a pin
  costs almost no map, and reading costs a deliberate step, hasn't been
  shown cleanly. Tab's glance card and Sheet's surface are each half of it.
- **The card and the list say the same things twice on one screen** (state
  stamps and stars in the card and in the row right below, S6). Is there a
  way for the open place and its list row to stop competing, rather than
  each restating the same state?
- **Brand presence.** Round 1 reads as a well-ordered generic map callout,
  except for Concept 8, which overshoots. The inspo's paper/ink/label
  language (`design/inspo/project/`) can carry identity in the place view
  without a colour block: an open opportunity, stated as a problem rather
  than a design.
