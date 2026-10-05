# Popup hierarchy, Round 2: CD review

Fresh CD, 2026-10-05. I did not author, suggest or score any of this work, and
I read no `*review*` or `*rescore*` file. Inputs: `docs/cd-brief.md`,
`docs/owner-taste.md`, `../ux-analysis.md`, this folder's README and stills,
`design/inspo/README.md` + `design/inspo/project/*`, and round 1's README and
stills (for the whimsy question only).

Folder → concept: `fold/` = **A** In-map Card, `sheet/` = **B** Place Sheet,
`pin/` = **C** Row Becomes the Card, `dock/` = **D** Fold + Dock.

This is a concept round (owner: "kill if the idea was bad", not the mock).
Mock flaws are fix notes.

## Owner words in force (verbatim)

- "i want to fix the design of the popup -- it has awkward heirarchy and
  spacing and doesnt follow our standards in that way. i also need more ideas
  for displaying so *much* ndensity."
- "Type is actually tier 2 imo — or bottom of tier 1. Notes are tier 1"
- "Don't pay attention to old feedback ignore it. The type thing I mean."
- "Replacing list with info is a fine thing to explore."
- "so much information all visual hierarchy is starting to struggle"; "icon
  is treated differently for category in the pop up than on the map — why?";
  "No star unless it's been starred."; "Spacing between things is insane and
  icons don't fill the same visual space"; "A measured spacing system should
  already exist - if not create it".
- **New, mid-review:** "Directions is fine. Have them check this against the
  inspo / product philosophy…I like whimsy and these all seem kinda average.
  The most exciting ideas as far as whimsy have been cut"

## 1. Ledger rules that apply

1. Simple, simple, simple; fewer variations.
2. Secondary marks never outrank content; busy views keep their hierarchy.
3. Notes are tier 1; type tier 2 / bottom of tier 1 (placement open).
4. No star unless starred (marks); the off-state star is a control.
5. A measured spacing system, used everywhere; icons fill the same visual
   space; one left channel; one centred axis for left-column items.
6. Same category icon treatment on map and popup; preserve the icon.
7. Controls don't move or grow.
8. No heavy rules or boxes; restrained shadows.
9. Colour must communicate or go neutral.
10. Reuse existing control styles.
11. The header names the current list.
12. Owner sees a look before it is built; make sense before it reaches him.
13. **New: whimsy and character from the inspo are a goal, not decoration
    to be trimmed.** (Propose adding the owner's quote to the ledger.)

## 2. Scores and verdicts

The owner's new note changes the bar: a concept that only fixes hierarchy,
in the app's most generic voice, is now a partial answer. I scored concept
on idea + character, execution on the stills.

| Rank | Concept | Concept | Execution | Verdict |
|---|---|---|---|---|
| 1 | **B** Place Sheet | **7** | **6** (cap: void) | KEEP. Needs another design round |
| 2 | **C** Row Becomes the Card | **6** | **7** | KEEP. Needs another design round |
| 3 | **A** In-map Card | **5** | **6** (cap: selected block) | KEEP as the control only. Needs another design round |
| 4 | **D** Fold + Dock | **3** | **6** (cap: selected block) | **KILL** |

No concept is ready to show the owner as is: he has already looked and
called them "kinda average". The next round must add character to the
survivors (section 6), not only fix the notes below.

## 3. Busiest state first (VEGA: starred, visited, Stop 2 of 3, 5-line note)

All four rendered the busiest state, at 1x and 3x. Good.

### Noise count, busiest 1x

| | A `fold/busiest` | B `sheet/busiest` | C `pin/busiest` | D `dock/busiest` |
|---|---|---|---|---|
| Stamps on screen | 4 (card + 3 rows) | 1 | 2 (card + Café Loki off-screen; 1 visible) | 4 |
| Stars on screen | 4 (pin, card, 2 rows) | 2 (pin, sheet) | 2 (pin, card) | 4 |
| Boxes / layers in the lower half | card + tip + shadow, sheet, orange block | sheet | sheet, card band, 1 row | dock + shadow, sheet, orange block |
| Saturated fields | orange row block + orange Directions | Directions only | Directions only | orange row block + orange Directions |
| "VEGA Copenhagen" printed | 2 (card, row) | 2 (sheet, map label) | 2 (card, map label) | 2 (dock, row) |
| Distinct marks, whole screen (approx.) | ~42 | ~22 | ~26 | ~44 |

### Rejected-pattern matches (each caps execution at 6)

- **A, D: colour that communicates nothing new / a loud block.** The shipped
  figure-deep selected row (`fold/busiest`, `dock/busiest`, row 2) is the
  loudest thing on the screen at 1x: a full-width saturated block with cream
  text, out-weighing the card's name. It repeats what the open card already
  says ("this one"). Caps A and D at 6.
- **B: "Spacing between things is insane."** A fixed 300px box with actions
  pinned to the foot leaves a void between content and buttons on every
  place shorter than the box: ~150px in `sheet/busiest` (the *busiest*
  place), ~110px in `sheet/typical`, ~190px in `sheet/bare`. This is the
  exact thing the owner named. Caps B at 6.
- **All: icons don't fill the same visual space.** In the action row the
  14px compass, the 18px star and the ~70px-wide stamp ellipse sit side by
  side (`*/busiest-crop@3x`). The stamp is about 3x the ink of the other two
  and out-weighs "STARRED" and "GET DIRECTIONS" together. It is the right
  mark (continuity with the row), at the wrong size for an action row.
  This is a mock flaw, not a kill reason, but it is the owner's own sentence.

### Hierarchy (busiest, by weight at 1x)

- A: orange row block > name > note > stamp > Directions > star > type > MORE.
  The list beats the card.
- B: name > note > stamp > Directions > address > type. Correct.
- C: name > stamp > Directions/star row > note > address. The action row sits
  between the name and the tier-1 note, so the controls read before the
  reason you saved the place. Wrong for "Notes are tier 1".
- D: same as A.

## 4. Per concept

### A. In-map Card: KEEP (as the control), concept 5 / execution 6

**The idea:** today's popup, re-tiered, with a height ceiling and an upward
More. It is the hierarchy fix done well, and it is the most average of the
four: a cream map callout, plain sans name, caps meta, sans note, caps action
row. The inspo is absent except for the stamp. It still boxes ~180px of map
(and ~360 open, `fold/f3-open`) over the neighbours you are deciding between.
Keep it only as the baseline the others must beat, and as the shape a
character treatment could ride on (see Luggage Label, section 6).

Evidence: `fold/busiest`, `fold/f3-open`, `fold/f4-high`, `fold/bare`,
`fold/approx`.

Fixes:
1. Resolve the selected-row block next to an open card (section 7a). As
   drawn it out-shouts the card.
2. Category icon: in Plans view the pin is a number (`fold/busiest`: "2"), so
   the category glyph appears nowhere near the card. "No badge, the pin is the
   icon" only holds when the pin shows the glyph. Either always carry the seal
   or define the Plans case; today it is a third treatment, which is the
   owner's "why?".
3. `fold/f4-high`: the note is cut mid-line straight onto the action row,
   and the card's top crowds the zoom control. Give the clipped scroll a
   visible edge, or stop More short of the controls.
4. Action row: scale the stamp down to the star's visual mass (ledger:
   "icons fill the same visual space"; "mark size matches text weight").
5. Spread of the action row is uneven (Directions → star gap ≫ star →
   stamp gap, `fold/busiest-crop@3x`). Put the three on a measured rhythm.
6. Swap to "Directions" (owner-settled).
7. Add character (section 6), or this stays "average" by construction.

Verdict: **needs another design round.**

### B. Place Sheet: KEEP, rank 1, concept 7 / execution 6

**The idea:** the list's own paper becomes the place. It is the strongest
structural answer to "so much density": the map is never boxed, the note gets
real width (`sheet/busiest` shows VEGA's 5-line note whole, no fold), there
is one stamp and one star on screen, and the selected-row conflict
disappears because the list is away. The header becomes the place, which
fits "the header names the current list". It is also the concept with the
biggest canvas for the inspo: a 390x300 piece of paper is a luggage label, a
matchbook cover or a trail sign waiting to happen. As drawn it is the plainest
version of that canvas.

Evidence: `sheet/busiest`, `sheet/typical`, `sheet/bare`, `sheet/f1-list` →
`f4-closed`, `sheet/f3-read`.

Fixes:
1. The void (section 3). Decide fixed vs content-sized (section 7b) and,
   whichever wins, the gap between content and actions must come from the
   spacing scale, not from "whatever is left of 300".
2. The void is also the opportunity: if the sheet stays fixed, the header
   should carry the place's identity at a scale that fills the paper on
   purpose (section 6), instead of a 17px name and a desert.
3. Action row: same stamp-scale and rhythm fixes as A (4, 5).
4. Map label beside the pin (`sheet/busiest`): keep it unboxed and quiet;
   check it against real OSM labels once tiles render.
5. Show how the user knows which list they will return to (Plans name
   gone from the header while a place is open). One quiet cue, no second row.
6. "Directions".

Verdict: **needs another design round** (character + the void), then it is
the one I would put first in front of the owner.

### C. Row Becomes the Card: KEEP, rank 2, concept 6 / execution 7

**The idea:** the ledger row lifts and opens into the card. This is the most
on-brand idea of the four, because the inspo's ledger rows *are* the app's
list, and continuity between row and card is a ledger rule ("continuity
between surfaces"). One stamp, one star, no orange block, the map unboxed.
Two problems with the idea as framed: the actions are deliberately placed
above the note (`pin/busiest`, `pin/f3-open`), inverting the owner's
"Notes are tier 1"; and with a busy card only ~1 list row is left visible
(`pin/busiest`), so "the rest of the list stays below" is barely true.

Evidence: `pin/busiest`, `pin/typical`, `pin/approx`, `pin/f1-list` →
`f4-closed`.

Fixes:
1. Note before actions. Keep "controls don't move" another way: e.g. More
   opens the note into the sheet *below* a fixed action row at the card's
   foot, or More hands the whole sheet to the card (which C already does),
   so the row only needs to hold still within one state.
2. Make the lift legible as a physical act (the row is pulled out of the
   ledger like a card from a file box) so the closed-up slot doesn't read as
   "it vanished". This is where C's whimsy lives; it is currently a cut.
3. Action row stamp scale and rhythm (A 4, 5).
4. Answer the open question: pin tap while the sheet is collapsed.
5. "Directions".

Verdict: **needs another design round.**

### D. Fold + Dock: KILL, concept 3 / execution 6

**Why the idea fails:** it is A detached from its pin and parked over the
bottom of the map (`dock/busiest` vs `fold/busiest`: the same card, the same
row of actions, the same orange block below). It adds a third stacked layer
(map, floating dock with shadow, sheet) to the lower half, it still covers
pins, it restates the selected place twice beside the orange row, and it has
the least character of the four. It is an unnecessary variation of A ("I
don't think we need this many variations"). Its one unique virtue (full list
visible with an unboxed map) is better delivered by C.

No fix list. Do not carry it into round 3.

## 5. Owner-objection prediction (his voice, 1x on a phone)

1. "These all look like a Google Maps card in beige. I like whimsy, where's
   the luggage label / the stamp / any of the inspo? These are average."
2. (B) "Why is there a huge empty gap between Perlan and the buttons?
   Spacing is insane." (A, D) "Why is the orange row the loudest thing when
   I'm reading the card?"
3. "The visited stamp is huge next to the other icons, they don't fill the
   same space." (C) "Notes are tier 1, why are the buttons above them?"

All three are plausible, so nothing goes to him as is.

## 6. Inspo and product-philosophy check

The inspo (`design/inspo/project/`): hotel luggage labels (Savoy, de la
Poste, Guynemer: die-cut ovals and lozenges, a name lockup that *is* the
label, one or two inks on a strong field), matchbooks (one ink on paper or
paper on one ink, the name as the hero, a striker band at the foot), national
park posters (big condensed caps title band, a listing of offerings in small
caps), the Yosemite trail scrapbook (an orange trail sign with a mileage
ledger, typewritten field notes, ranger badges, a tape/rope rule, two-ink
print). The app already speaks this through paper/ink tokens, ledger rows,
the seal badges and the VISITED stamp.

| | What it uses from the inspo | Where it is "average" | What it leaves on the table |
|---|---|---|---|
| A | paper colour, the stamp | a generic map callout; plain sans name; no lockup; no seal (pin-only) | the luggage label is literally a thing you stick on a place; the card could be one |
| B | ledger paper, seal badge, stamp | 17px name on a 300px sheet; the box's identity area is a single line; the rest is empty | park-poster title band / matchbook cover: the header could carry the name at poster scale; the action row could be the matchbook striker band |
| C | the ledger row itself (best fit), seal, stamp | the lift is a cut, not an act; once lifted it is a plain card | the "pull a card from the file" moment; a ticket-stub or tag edge on the lifted row |
| D | stamp | same as A | — |

Product philosophy (`CLAUDE.md`, ledger): simple marks, paper and ink,
stamps not drawings, physical metaphors that behave physically (peel is a
peel, stamp stamps). Every concept honours the restraint half and ignores
the physical-object half. The only object in any of them is the stamp, and
it is mis-scaled.

### Round 1 ideas with character: which should come back

Posed as opportunities, not designs.

1. **Luggage Label (round 1 #8) — bring back, onto B's sheet header (or A's
   card head).** Strongest first read of all twelve concepts (`round1/lug/
   busiest`), and the most direct use of the inspo. What killed it was
   weight, not idea. What could make it work:
   - The band only exists where the list's selected-row block is *not* on
     screen (B hides the list; C replaces the row), so the app still has
     one figure-deep "selected" field per screen and the colour communicates
     "this one" (ledger: colour must communicate).
   - It replaces the header, it doesn't add height ("no extra header
     height"); in B it *is* the header.
   - Long names: cap the condensed caps at 2 lines or let long names fall
     back to mixed case (`round1/lug/shape` runs to 3 caps lines).
   - Directions can't be the "only colour" under a coloured band; let the
     band own the colour and the action row go ink.
   - The seal in the band = the pin's seal (fixes "icon treated
     differently").
   - Shape is the open question for the designer: a die-cut edge, an oval
     seal, a lozenge — one shape, not ornament.
2. **Side Tab (round 1 #5) — bring back the metaphor, not the drawer.** A
   paper index tab is pure scrapbook/ledger. It died on a 24px-wide target,
   the drawer covering the map, and Safari's edge swipe. Opportunity: an
   index tab as the affordance for the long tail only (full address, a
   folded long note) on B's or C's paper, 44px, away from the edges. One tab,
   only when there is something behind it (no empty marks).
3. **Matchbook striker (new, from the inspo).** The action row as a band at
   the foot of B's sheet: it gives the fixed-height void a reason, and puts
   the three actions in one object. Risk: "heavy rules or boxes"; it has to
   read as printed paper, not a toolbar.
4. **Trail-sign ledger / typewritten field note (new, from the inspo).**
   Notes are the owner's own research, tier 1: they could be set as a field
   note (the trail scrapbook's typed list) rather than UI body text. Risk:
   legibility at 14px on a phone; one face change, not a costume.
5. **Row lift as a physical act (C).** The row pulled from the ledger like a
   card from a file box, the stamp travelling with it. Motion must be
   visible and symmetric (ledger), and must not touch row-gesture code (it
   is a state-change animation).
6. **Not worth reviving:** Action Rail (#7): no character, and its tinted
   rail is a box. Map Label + Dock (#6): lives on in B/C's map label already.

Constraint for all of the above: whimsy goes into *one* object per surface
(the label, the tab, the band), at the place's identity, never as extra
marks on every line. Busiest-state noise counts must not go up.

## 7. Designer's visual questions

**(a) Is the shipped orange selected row the loudest thing next to an open
card in A and D?** Yes (`fold/busiest`, `dock/busiest`). Costs:
- *Keep it as is:* the list out-shouts the card you're reading; caps A/D at 6.
- *Quiet it while a card is open:* a new selection variant that depends on a
  second surface's state ("fewer variations", "clear systems"), and a third
  look for the same row.
- *Avoid it structurally:* B and C don't have the conflict (list away, or
  the row is the card). This is one more reason they rank above A, and the
  reason D dies.

**(b) Fixed vs content-sized height in B.** Costs:
- *Fixed 300px, actions at the foot (as drawn):* buttons at one y for every
  place and the map edge never moves (ledger: "controls don't move or
  grow"); costs a void of 110–190px on most places, which is the owner's
  "spacing is insane".
- *Content-sized:* no void; costs a map edge and button y that jump per place
  and a bigger list↔place jump; for a 2-line place the sheet shrinks to
  ~140px, so the map grows and the pin re-centres.
- *Fixed box, actions follow the content:* no void between content and
  buttons, map edge still; costs a button y that moves per place, and empty
  paper below the buttons instead of above.
- *Fixed box, identity fills it on purpose (luggage-label/poster header):*
  keeps both stillness rules; costs a design that has to look right for a
  name-only place and for VEGA, which is real design work, not a toggle.

**(c) "Get Directions" vs "Directions".** Settled by the owner:
"Directions is fine." Use "Directions" everywhere. For the record, what it
buys: shorter, in the same noun voice as STARRED / VISITED, frees ~40px in the
action row for a measured rhythm. What it cost: nothing the owner minds.

## 7b. Bonus criterion: is the pin aligned with what it opens into?

Owner: "Bonus points but not required if the map pin is conceptually aligned
with whatever it "opens up" to". Not scored as a requirement; it does not
change the scores above, but it breaks ties toward B and C and toward the
Luggage Label.

| | Pin → opens into | One object / metaphor? |
|---|---|---|
| A | seal pin (or stop number) → cream callout with a tip, **no seal** | **Weak.** The tip links them physically, but the card shares no mark or shape with the pin; in Plans the pin is a number and the card a generic box. |
| B | seal pin → sheet whose header carries **the same seal**, plus a name label at the pin | **Partial.** Same seal on both ends, but the pin is a sticker and the sheet is a page; two objects that agree, not one. |
| C | seal pin → **its own ledger row** (same seal on the spine) lifting into the card | **Best of the four.** The pin and the row are already one record; the card is that record opened. The lift animation is where this could become explicit. |
| D | seal pin → detached dock with the seal | **Weak.** Same as B's agreement, minus the page; a floating box. |
| Luggage Label (revive) | seal pin → a label whose emblem **is** that seal | **Strong opportunity.** A seal is the emblem of a luggage label; opening the pin "unrolls" the sticker into the label it belongs to. Combining it with C's lift or B's header is the most aligned metaphor on the table. |
| Side Tab / index tab (revive) | — | No pin link; it is a property of the paper, neutral here. |
| Matchbook striker, field-note notes | — | No pin link; neutral. |

Watch item for any aligned idea: the visited pin is the dark peeled
**sticker** and the card's visited mark is the **stamp**. An "it's the same
object" metaphor makes that difference more visible; the designer should
say whether the label carries the sticker, the stamp, or explains the swap.

## 8. Gating

Nothing is built; these are stills. The owner has seen this round's contact
sheet and answered with the whimsy note, so no look is approved. **No
builder should start** until a round-3 look is in front of him and he says
yes.

## 9. Fix list for round 3 (team-wide)

1. Kill D. Carry B (rank 1), C (rank 2), A as the control.
2. Add one inspo object per surviving concept (section 6): Luggage Label on
   B's header first; C's physical lift; optionally an index tab for the long
   tail.
3. Re-render the busiest state first for every one, and the bare state
   (where whimsy and voids are most exposed).
4. Action row in every concept: "Directions"; stamp scaled to the star's
   visual mass; three actions on a measured rhythm from the spacing scale.
5. C: note before actions.
6. A: category seal when the pin shows a stop number.
7. Bonus (owner, not required): pin and card as one object. Favour C's
   lift and the Luggage Label's seal-to-label metaphor (section 7b).
8. Add the owner's whimsy and pin-alignment quotes to `docs/owner-taste.md`
   today.
