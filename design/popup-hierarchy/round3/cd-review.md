# Popup Round 3: CD review

Fresh CD, 2026-10-05. I did not author, suggest or score any of this work.
Brief: `docs/cd-brief.md`. Concept round, so per the owner's rule ("don't
kill if the mock was bad kill if the idea was bad") every KEEP/KILL is on
the idea, and mock flaws are fix notes. I read no review or rescore files.

Looked at: `design/inspo/project/` (Cortina, Casablanca and Savoy labels,
matchbooks, Yosemite scrapbook), `design/inspo/visited-badge/` (Tokyo
stamp), `ux-analysis.md` (tiers), the round 3 README, and for every concept
`busiest` first at 1x then 3x, then `typical`, `bare`, `approx`,
`longname`, `signedout` and the motion frames where rendered.

## 0. Ledger rules that apply (step 1)

- Whimsy, not average. Character must carry meaning and come from the inspo
  (labels, stamps, matchbooks, park posters, scrapbook); "kinda average" is a no.
- Bonus: the pin and what it opens are one idea (nice-to-have).
- Simple, simple, simple. No dots/decoration. No heavy rules or boxes. No
  second text row. No extra header height. Fewer variations.
- Notes are tier 1; type is tier 2 or the bottom of tier 1. Secondary marks
  never outrank content. Busy views keep their hierarchy.
- No empty states as marks ("No star unless it's been starred").
- Same category icon treatment on map and popup. Same icon drawing language.
- A measured spacing system; one left channel.
- Colour communicates or goes neutral.
- Signed out: actions visible but disabled (Directions stays live).
- Directions is the label. Reuse existing controls.
- Stamp, don't draw or slide: stamp with grow/shrink, ink bleeding in.
- Effects restrained; edges are shadows, not hard lines.

## 1. Scores and verdicts

| Rank | Concept | Concept | Execution | Pin bonus (0–2) | Verdict |
|---|---|---|---|---|---|
| 1 | Postcard (`post/`) | 8.5 | 7 | 2 | KEEP, finalist |
| 2 | Luggage Label (`label/`) | 8 | 7 | 1.5 | KEEP, finalist |
| 3 | Hanging Tag (`tag/`) | 7 | 6 | 2 | KEEP, finalist |
| 4 | Passport Stamp (`stamp/`) | 6 (capped) | 6 | 0.5 | KILL; donate the stamp-down motion |
| 5 | Card File (`file/`) | 5.5 | 5 (capped) | 1 | KILL; donate the row-lift motion |

Finalists for the owner: **Postcard, Luggage Label, Hanging Tag**. All three
are "show after these fixes" (below); none needs a re-think, and the fixes
are mock-level. Hybrid: **Postcard takes Passport Stamp's postmark motion**;
optionally **Luggage Label takes the Postcard's postmark** for its visited
state (section 8).

Gating: concepts only. Nothing is built and `index.html` is untouched. The
owner has not seen any of these looks; nothing may be built until the owner
picks one.

---

## 2. Postcard (`post/`): concept 8.5, execution 7, KEEP

**Object and fidelity.** The back of a picture postcard: message left of
the divide, postage stamp top right, address on ruled lines below it, the
postmark struck across the stamp's corner. This is the good version of the
object: every part of a real postcard back is present and every one holds
real content (note = message, seal = stamp, address = address, visited =
postmark). Nothing is added for decoration. The map above the sheet even
plays the picture side. It is the only concept whose whimsy is entirely
structural: you read it as a postcard before you read any word, and the
structure also solves the round's real problem (the address finally sits
as tier 4, off to the side, instead of being the heaviest block).

**Whimsy that carries meaning.** "Visited is the postmark" is the best idea
in the round. It is the shipped row stamp (same language as the list), and
a postmark is literally proof you were there. The pin's seal flying into the
stamp corner (`f2`) is the pin and the card being one idea.

**Busiest (`busiest-phone@1x`, `busiest-crop@3x`).** Name > message >
postmark > Directions > address > type. The 7-line VEGA note shows whole.
No orange selected row (the list is away). Hierarchy holds.

**Noise count, busiest:** back link + list name, name, meta line, message,
1 vertical divider, postage stamp (perforated edge + inner frame + seal),
postmark (dotted ring + check + word), 3 address lines + 3 hairline rules,
2 actions. ~14 marks; 4 inks (black, `--ink-2`, navy, Directions orange).
Lines: 4 hairlines (divider + 3 address rules). They are the postcard's own
structure and quiet at 1x, so no cap, but they are the first thing to thin
if the owner calls lines. No rejected-pattern match.

**Pin bonus: 2/2.** The pin's seal is the postage stamp and travels there.

**Problems seen.**
- The postage stamp washes out at 1x: the perforation and inner frame are
  near the paper colour, and the seal is ~24px. In `typical-phone@1x` and
  `bare-phone@1x` it reads as a smudge, not a stamp. The one object that
  makes it a postcard is the weakest mark on the card.
- `bare-phone@1x`: a name-only place is ~200px of empty paper between the
  name and the buttons. That is the "spacing is insane" void the owner
  already rejected.
- Visited sits top right, away from Directions and Star (UX's call on
  reach; I note it only because the owner will see three actions in two
  places).
- `signedout` was rendered only for a visited place. The unvisited
  signed-out corner (dimmed MARK VISITED) wasn't, and that's the case that
  tests the owner's rule.
- The 112% wide name is a third Archivo width on one surface (62/75/112).
  It reads fine; keep it if the designer wants the postcard heading voice,
  but don't add a fourth.

**Owner objections (owner's voice, 1x phone).**
1. "What's that faint grey square? I can't tell it's a stamp."
2. "Why is Perlan's card mostly empty? Spacing is insane again."
3. "Why is Visited up in the corner and the other buttons at the bottom?"

## 3. Luggage Label (`label/`): concept 8, execution 7, KEEP

**Object and fidelity.** A hotel luggage label: Cortina's and Casablanca's
lettering band with two smaller spaced lines under the name, and Savoy's
emblem + name lockup. The good version of a label has a picture above
its band, and here **the map is the picture**: map above, band below is
literally the Cortina composition (`busiest-phone@1x`). That reading is
strong and the designer should say it out loud to the owner. The condensed
caps name is genuine label lettering, not a costume.

**Whimsy that carries meaning.** The band is the place's name, the seal is
the emblem, the spaced caps line is the type (the "DOLOMITI" line). It
means "this place, open". The weakness is that the label never changes:
visited/starred live only in the button row, so the object itself has no
moment.

**Busiest.** The cleanest and most readable busiest view of the five:
band/name > note (5 lines, whole) > buttons > address > type. No
rules, no boxes besides the band.

**Noise count, busiest:** band, seal, name, meta, ×, note, address + ›,
3 actions. ~10 marks; 4 inks (band orange, cream, black, navy). No
rejected-pattern match in `busiest`.

**Pin bonus: 1.5/2.** The seal lifts off the pin and lands as the emblem
(`f1`–`f3`). Good, but the label is not shaped like anything the pin is.

**Problems seen.**
- `bare-phone@1x`: the "label takes the slack" rule makes PERLAN a ~230px
  orange field with the lettering and seal at its foot. Half the sheet in
  one colour for a place with no content: colour communicating nothing and
  the loudest thing in the app. This is a plausible owner no.
- `longname-phone@1x`: the fallback to mixed case kills the label voice and
  leaves an empty orange area above the name.
- `approx-phone@1x`: "(APPROX.)" set in label lettering as part of the name.
  Provenance is tier 4; it should not be in the band.
- The seal moves: vertically centred in `busiest`, at the foot of the band
  in `bare` and `longname`. One position.
- During `f2` the orange selected row and the orange band are on screen
  together for a frame. Transient; fine if the row is gone before the band
  settles.

**Owner objections.**
1. "That huge orange block on Perlan is way too loud."
2. "Why does the name sometimes look like a label and sometimes not?"
3. "Nice, but it doesn't change when I've been there; where's the stamp?"

## 4. Hanging Tag (`tag/`): concept 7, execution 6, KEEP

**Object and fidelity.** A string luggage tag: eyelet, chamfered top,
perforated tear-off stub holding the address, turn it over for the back.
The stub and the turn-over are real tag behaviours used for real content
(address = tear-off, long note = the back). It's a good version of the
object in parts and less so in others: the chamfer is drawn on the top right
only in `busiest-crop@3x` (a real tag clips both corners symmetrically),
and at 1x the tag reads as "the old popup with a string" more than a tag.

**Whimsy that carries meaning.** The pin is the knot; the tag hangs from
it and swings (`f2`, `f3`). That is the strongest physical pin link in the
round and real motion character. Turn-over for the long tail is a nice
idea that also answers density.

**Busiest (`busiest-phone@1x`).** Fails tier 1: the VEGA note is cut at
3 lines with TURN OVER (README claims whole to 4). And the shipped orange
selected row in the list below is the loudest thing on screen, outranking
the tag. Hierarchy: orange row > name > note > Directions > ✓/★ > stub.

**Noise count, busiest:** string, eyelet ring, chamfer, card, ×, name,
seal, meta, note, TURN OVER, 3 actions, perforation rule + 2 notches,
address + ›, plus the orange row and 3 list stamps visible below.
~17 marks on the tag alone; 5 inks. The perforation is a dashed line but
it holds the stub's meaning; no cap. No rejected-pattern match, but it's
the busiest of the three finalists.

**Pin bonus: 2/2.** The pin is the knot, the eyelet carries the category
colour.

**Problems seen.** Note truncation above. The back
(`approx-back-phone@1x`) has no actions and an inner scroll. Every open
pans the map to the same spot. The tag still covers ~280px of map.

**Owner objections.**
1. "Why is my note cut off after three lines? Notes are tier 1."
2. "The orange row in the list is screaming over the tag."
3. "This is basically the old popup with a string on it."

## 5. Passport Stamp (`stamp/`): concept 6 (capped), execution 6, KILL

**Object and fidelity.** The Tokyo DEPARTED stamp is a faithful source:
the clipped frame, the rule, the band under it (`busiest-crop@3x`). The
"tap the band and the stamp comes down" motion (`f2`) is the owner's own
words ("stamp with some grow shrink", "ink bleeding in") and the best
motion in the round.

**Why it dies on the idea, not the mock.** Two parts of the idea itself
match rejected patterns, so it is capped at 6:
- **The unvisited ghost frame is a mark for an empty state.** A dashed
  `--hair` box on every unvisited place is the "No star unless it's been
  starred" pattern; it can't be removed without removing the concept,
  because the ghost is the button.
- **Box around the name, inside a box.** The stamp frame (solid + dotted
  track) sits inside the popup card: a box in a box at the pin
  (`typical-crop@3x`, `bare-phone@1x`). "No heavy rules or boxes."
It also centres the heading, which breaks the one left channel, cuts the
busiest note at 3 lines, and keeps the orange selected row as the loudest
thing on screen (`busiest-phone@1x`). Busiest noise count: card, outer
frame, dotted track, inner rule, seal, meta, name, check + word, note,
MORE, address + ›, 2 actions, ×, tip: ~16 marks plus the list.

**Pin bonus: 0.5/2.** The card agrees with the row stamp; the pin doesn't.

**Donate:** the stamp-comes-down motion (big and faint, then a shrink and
an ink bleed) to the Postcard postmark.

## 6. Card File (`file/`): concept 5.5, execution 5 (capped), KILL

**Object and fidelity.** An index card pulled from a card file, red line
under the heading, typed note on rules, an index tab when there's more. A
real object and a faithful one, and the pull-from-the-file motion (`f2`)
is lovely and true to the list.

**Why it dies.** It's the "kinda average" one: its character is a
typewriter stand-in and hairlines, and the designer's own note says it's
the quietest of the five. The ruled lines are the idea, and they are the
rejected pattern: ~9 full-width hairlines + the orange rule in
`busiest-phone@1x`, and an empty ruled card in `bare-phone@1x` (lines
drawing attention to the absence of content). Caps at 6. `approx-phone@1x`
shows the note cut with REST OF NOTE › while three empty ruled lines sit
below it, which tells the owner the system doesn't make sense. The
monospace note is slower to read for the one tier-1 text block. It
needs a new webfont.

**Pin bonus: 1/2.** It links the row to the card, not the pin.

**Donate:** "the row lifts into the sheet" as Postcard's or Luggage
Label's open motion when the place is opened from the list (J10), and
keeping the stop number visible on the open card.

---

## 7. Busiest-view noise summary

| Concept | Marks (busiest, object only) | Inks | Lines/boxes | Rejected-pattern matches |
|---|---|---|---|---|
| Postcard | ~14 | 4 | 4 hairlines | none |
| Luggage Label | ~10 | 4 | 1 band | none in busiest; `bare` band is colour carrying nothing (fix) |
| Hanging Tag | ~17 | 5 | 1 perforation | none; orange list row outranks it |
| Passport Stamp | ~16 | 5 | box in box + rule | empty-state mark (ghost frame), box around name: cap 6 |
| Card File | ~12 | 4 | ~10 rules | heavy rules / lines: cap 6 |

## 8. Hybrids

- **Postcard + Passport Stamp's motion (recommended).** When Mark Visited
  is tapped, the postmark comes down exactly as Stamp's `f2`–`f4`: big and
  faint, shrink, ink bleed. That is the owner's own stamp rule, applied to
  the only stamp in the round that doesn't need a ghost box. Use the row
  stamp's shipped animation timing so the list and the postcard stamp alike.
- **Luggage Label + the Postcard postmark (optional).** When visited, the
  row stamp strikes across the band's lower corner, the way hotel labels got
  hotel stamps. It gives the label the visited moment it lacks and keeps one
  visited language. Show only if the Label is the owner's pick.
- Card File's row-lift is a donor for whichever sheet concept wins (J10 open
  from the list).

## 9. Numbered fixes before the owner sees them

**Postcard (show after these fixes)**
1. Make the postage stamp read as a stamp at 1x: a visible perforated edge
   (scalloped paper against a quiet shadow, not a grey outline), the seal at
   the pin's size or larger. Re-shoot `typical` and `bare` at 1x and check
   it.
2. Fix the `bare` void: the blank space must stay within the spacing scale
   (shorter sheet for short content, or the stamp/name lockup takes the
   slack). Show `bare` again.
3. Render `signedout` for an **unvisited** place (dimmed MARK VISITED in the
   corner, Directions live).
4. Show the postmark strike as motion frames using Passport Stamp's
   `f2`–`f4` (the hybrid).
5. Keep the four hairlines as light as they are now; don't add rules.

**Luggage Label (show after these fixes)**
6. Cap the band height to its content: the slack goes to paper (or the note
   area), not more orange. Re-shoot `bare` and `longname`.
7. Keep label lettering for long names (2 lines of condensed caps, smaller
   size) rather than falling back to mixed case; if it truly can't fit, say
   so in the README with the real name that breaks it.
8. Move "(approx.)" out of the band into the meta line or the tier-4
   address area.
9. One seal position (vertically centred on the name lockup) in every state.
10. Optional: one frame of the visited postmark on the band (hybrid).

**Hanging Tag (show after these fixes)**
11. Show the busiest note whole to at least 4 lines (as the README
    promises); TURN OVER only past that.
12. Chamfer both top corners symmetrically about the eyelet.
13. Answer the orange selected row: the stills must show what the list row
    looks like while the tag is open (the CD can't pass a view where the
    list outranks the card). This is a designer/owner call, not mine to
    pick.
14. Give the back one way to act without turning back (or say why not, for
    UX).

**All finalists**
15. Present the three as one-line ideas on the contact sheet: "the postcard
    you write to yourself", "the hotel label on the map's picture", "the
    tag hanging off the pin". Lead each with `busiest` at 1x, not the hero.
16. Drop Passport Stamp and Card File from the owner's sheet, or show them
    in a "cut, donated" strip only.
