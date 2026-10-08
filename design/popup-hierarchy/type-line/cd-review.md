# CD review: type-line concepts (Hanging Tag field line)

Fresh CD, 2026-10-07. I did not author, suggest or score any of this work.
I followed `docs/cd-brief.md` step by step. This is a concept round, so the
owner's rule applies: "we're trying to rate concepts here not execution —
tell cd don't kill if the mock was bad kill if the idea was bad". Each KILL
below is about the idea. Mock flaws are listed as fixes.

## 1. Owner taste first (ledger rules that apply here)

- Tiering: "Type is actually tier 2 imo — or bottom of tier 1. Notes are
  tier 1". The type value must not outweigh the note.
- "i don't like the new palcement of category type." Type stays out of the
  band. All six variants respect this.
- "the numbers feel really egregiously attention grabbing". This bites on
  "STOP 3 OF 3".
- "I like whimsy and these all seem kinda average." The whimsy has to carry
  meaning through form, type or paper/ink, not added decoration.
- "Keep in mind the brand color palette.. consistently and meaningfully".
  Navy means visited/action and orange means star/action, so neither can be
  used for metadata.
- "i dont like that the tag background color changes. it shoudl be that same
  light cream always." All variants keep the paper cream.
- No heavy rules or boxes. No second row of text. No extra height. Fewer
  variations. Colour floods are "paper, not clouds". No typewriter face.
  "Secondary marks never outrank content."
- History: round 5's claim-check grid was killed for boxes, rules, labels
  that repeated their values, and an empty ☐.

## 2. Busiest state at 1x, then 3x

Order: `*/busiest-phone@1x` → `*/busiest-crop@3x` → `<variant>-sheet@1x`
(typical, district, signed out). The busiest state was rendered for every
variant, so this step passes.

Noise count, `shipped/busiest-phone@1x` tag: band, eyelet + reinforcement,
string, name, ×, address, 5-line note, 2 labels + 2 values, perforation (1
dashed rule + 2 notches), 2 dashed segment dividers, compass, star, pencil
circle, VISITED double-ring stamp, 3 stub labels. Colours: cream, ink,
ink-2, hair, orange, navy. Every variant adds 0 colours. Each variant adds
the following:

| Variant | Adds | Rejected-pattern match (each caps the score at 6) |
|---|---|---|
| A Ledger | nothing | none |
| B Field stack | a second text row, about +20px of tag height | **second text row / extra height**. **Loud number**: "STOP 3 OF 3" at 17px ink |
| C Form blank | 2 hairline rules sitting over the dashed perforation | **rules**, and two line systems stacked |
| D Rubber stamp | texture + 2 tilts | **loud number** (the 17px "STOP 3 OF 3" is the heaviest text below the name at 1x) |
| E Destination code | nothing new, but 22px values | **loud number** (22px). **Hierarchy inversion**: type outweighs the note |
| F Margin print | nothing | none, but the values copy the stub-label style (see F) |

## 3. Per variant: score, fidelity, verdict

### D. Rubber stamp: KEEP. Rank 1. Concept 8, execution 6 (capped)

- **Idea.** The label is printed and the value is stamped. Of the six, only
  this one shows the references' real distinction, which is that label and
  value are made by different processes. The README calls it "process, not
  just weight", and that is the right reading of `luggage-tags/5.webp`
  (purple "MADERA, CALIF." / "DAVIS"). It is whimsy that carries meaning: a
  clerk stamped what kind of place this is. Keeping the ink in `--ink-2`
  rather than the references' purple is the correct palette call. Navy
  already means visited and orange means star/action.
- **Fidelity.** It has the right process and the right placement (the
  stamped entry sits in a printed field). It is missing the thing that makes
  the reference stamp read from across a room: ink that differs visibly from
  the print. Here only texture and angle carry the difference.
  `stamp/busiest-crop@3x` shows that the texture reads as worn letterpress
  more than rubber-stamp ink, with no ink spread and no density variation.
- **Mock flaws.** At 1x (`stamp/busiest-phone@1x`, `stamp-sheet@1x`) the
  tilt and the texture almost disappear. It reads as "E but smaller": big
  grey condensed caps. Then "STOP 3 OF 3" at 17px becomes the loudest text
  under the name. If the stamp can't be seen at 1x, the owner won't see the
  idea.
- **Open identity question for the owner (not mine to settle).** This puts a
  second stamped thing on the tag, next to VISITED. The two stay apart
  because VISITED is ringed and navy (state) while the type stamp is bare
  grey letters (record). I think that holds, but the owner should be told
  about it, not left to find it.

### A. Ledger: KEEP. Rank 2. Concept 7, execution 7

- **Idea.** Case, colour and size change together: a printed sentence-case
  "Type" and a filled-in condensed-caps entry. It fixes C4 honestly, adds
  nothing, and costs no height. It's the quiet control to set beside D.
- **Fidelity.** The label matches the Southern Pacific "From" / "To". The
  entry is just bolder print, so the references' process difference is
  missing. That's why it reads as "average".
- **Mock flaw.** In `ledger/busiest-crop@3x`, "BAR" and "STOP 3 OF 3" are ink,
  bold, letter-spaced caps. That is the same style as DIRECTIONS / STARRED
  directly below them. The field line reads as another row of button labels.

### B. Field stack: KEEP (reserve, don't show). Rank 3. Concept 6 (capped), execution 5

- **Idea.** A label above the entry. Structurally this is the most faithful
  to the tags (`1.jpg` FLIGHT / 605, SEAT NO. / 17D; `4.webp` FINAL DEST).
  It's a legitimate tag idiom, so I'm not killing it. But the idea is the
  extra row, and that matches "no second row of text" and the owner's height
  complaints ("if the tag is so tall it forces a lot of list compression").
  The cap stands.
- **Mock flaws.** `stack/busiest-phone@1x`: the 17px ink value is heavier
  than the tier-1 note, and "STOP 3 OF 3" is loud. `stack-sheet@1x` signed
  out: the list header sits about 4px lower than in the other states. Check
  whether that's a layout shift.

### F. Margin print: KILL. Rank 4. Concept 4

- **Why the idea fails.** The printer's marks in `5.webp` ("S-3943 ORIGINAL
  CHECK", "Series 28") are metadata about the stock, not entries about the
  bag. Putting the place's type in that role misreads the reference.
  Pushing the line onto the perforation also hands tier-2 content to the
  claim-check stub, which the owner set aside for actions. In
  `margin/busiest-crop@3x`, "STOP 3 OF 3" at 12px bold tracked caps sitting
  on the perforation reads as a stub label. The idea doesn't fix C4 either,
  because the value is 1px larger than the label. With type alone
  (`margin-sheet@1x`, typical and district) the idea is invisible. What's
  worth keeping, the sentence-case label, is already in A.

### C. Form blank: KILL. Rank 5. Concept 3

- **Why the idea fails.** The writing line is the idea, and on a phone an
  underlined blank holding text is a text input. The tag would appear to
  offer an edit it doesn't have. That's a lie about the UI, and no mock fix
  removes it. It also brings back the rules that killed round 5, stacked
  right on the dashed perforation (`blank/busiest-crop@3x`). In the
  reference, the blank exists because the entry is handwritten. With a
  typeset value the line has no job, so it's a form costume. The 14px
  sentence-case "Bar" also blends into the note at 1x.

### E. Destination code: KILL. Rank 6. Concept 3

- **Why the idea fails.** On every reference tag (`2.jpg` TYO / HNL / LIH,
  `3.webp` SFO / DFW, `4.webp` OMA / SGF) the big code is the destination,
  which is the tag's primary content. In this tag, the place name already
  plays that role. Giving type the code's size makes tier-2 metadata the
  second-loudest thing on the tag by design. That's in `code/typical-crop@3x`
  ("ATTRACTION" against the name) and `code-sheet@1x` district ("TYPE
  DISTRICT" against "Grandi (Old Harbour district)"). It also contradicts
  "Type is actually tier 2". Shrinking it removes the idea, and then it
  becomes D without the stamp. "STOP 3 OF 3" at 22px is the loud-number
  pattern outright. (The README cites `2.webp`; the file is `2.jpg`.)

## 4. Ranking

1. D Rubber stamp (KEEP)
2. A Ledger (KEEP)
3. B Field stack (KEEP, reserve)
4. F Margin print (KILL)
5. C Form blank (KILL)
6. E Destination code (KILL)

## 5. Owner-objection prediction (three each, owner's voice, 1x on a phone)

D, as mocked:
1. "I can't even tell it's stamped at this size, it's just big grey letters."
2. "STOP 3 OF 3 is grabbing attention again."
3. "Why is there a second stamp? I thought stamp meant visited."

A, as mocked:
1. "These all seem kinda average."
2. "BAR looks like another button label."
3. "Did anything actually change?"

Objections 1 and 2 on D, and 2 on A, are plausible and fixable, so the work
goes back before the owner sees it.

## 6. Numbered fixes

D, Rubber stamp:
1. Make the stamp readable at 1x, not only at 3x. Ink density should vary
   (a fuller centre, a lighter edge, a slight spread on the strokes), with a
   fine paper tooth. Owner's rule: "paper, not clouds", subtle, no blotches.
   The angle should be visible at 1x without looking crooked. Judge it on
   `busiest-phone@1x`. If it reads as "E but smaller" there, it isn't done.
2. Lower the value until the note (tier 1) clearly outweighs it at 1x
   busiest. The ladder is name > note > type value > label. The 17px value
   in the mock is over the line.
3. "STOP 3 OF 3" must not be the loudest text below the name. Either stamp
   the PLAN value at the same quieter size as TYPE, or try printing the plan
   value (A's treatment) and stamping only the type. Show both, so the
   number never grabs attention.
4. Take the per-place tilt from an id hash (like `stampTilt`) within a small
   range. Never mirror the VISITED stamp's angle, so the two don't read as a
   matched set.
5. Keep the `--ink-2` ink: no navy, no orange. Measure contrast after the
   mask and keep it at or above 4.5:1.
6. Shoot the cases the README lists as not done: the longest category, "Stop
   12 of 14", and two fields wrapping on a narrow tag (320px).
7. Add one frame of the busiest state with D next to the VISITED stamp at
   1x, so the owner judges the second-stamp question directly.

A, Ledger:
8. Stop the value from copying the stub-label style (ink, bold, tracked
   caps). The test: at 1x busiest, "BAR" must not read as a fifth button
   label. How to do it is the designer's call.
9. Check that the 11px label and the 13px value share an optical baseline,
   by the ink, in `ledger/busiest-crop@3x`.

B, Field stack (only if it's revived):
10. Value at 14px or below, in `--ink-2`, with the net height increase
    measured against list compression in the busiest state. Explain the 4px
    list-header offset in `stack/signedout`.

General:
11. README: fix the reference path `2.webp` → `2.jpg`.

## 7. What to show the owner, and verdict

Show **D Rubber stamp** (the whimsy pick) and **A Ledger** (the quiet
control). Two options, per "Fewer variations". Hold B in reserve and don't
show E, C or F.

**Verdict: after fixes.** D's idea is right, but the mock hides it at 1x and
lets the plan number get loud (fixes 1–3, 6–7). A needs the stub-label clash
resolved (fix 8). Once those are done, show D and A side by side at 1x
busiest, with D's second-stamp question stated plainly.
