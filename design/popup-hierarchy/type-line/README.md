# Type line concepts (Hanging Tag field line)

Designer, 2026-10-07. Concept stills only. `index.html` is untouched.

## The ask

Impeccable review C4 (`design/impeccable-gate/reviews/2026-10-07-b0e566e5e803/REPORT.md`)
found that "TYPE · BAR / PLAN · STOP 3 OF 3" reads flat: label and value are
both 11px, both `--ink-2`, and differ only by weight. The owner's answer:
"yes this should run through the loop — there were some explorations of that
along the way based on tag inspo we should do some iteration there."

## Owner's words that bind this (verbatim)

- "Type is actually tier 2 imo — or bottom of tier 1. Notes are tier 1"
- "i don't like the new palcement of category type." (type in the band)
- "the whole area down there being just for visited makes no sense. thinking
  of that area kind of like a claim check ..."
- "I like whimsy and these all seem kinda average."
- "Keep in mind the brand color palette.. we should be using best practices
  around how to apply consistently and meaningfully"
- "i dont like that the tag background color changes. it shoudl be that same
  light cream always."
- From `docs/owner-taste.md`: no boxes or heavy rules, no dots, no loud
  numbers ("the numbers feel really egregiously attention grabbing"), no
  typewriter face ("the typewriter font is unnecessary"), and secondary marks
  never outrank content.

## Settled (held in every variant)

Cream paper always. Band, stub and short address untouched. Type sits below
the note. All text is at least 11px. Existing tokens only. The markup is the
shipped markup: every variant is CSS on `.tag-fields` / `.tag-f` / `.tag-lab`
/ `.tag-val` only (`variants.js`). So VoiceOver still reads "Type bar, Plan
stop 3 of 3" in every variant.

## Earlier explorations (history, not rules)

- Round 5 Claim check had a labelled field grid. The CD killed it for ruled
  cells, labels repeating values ("Starred: Yes, Visited: Visited") and an
  empty ☐ (`../round5/tag/cd-review.md`). None of the variants below has cells,
  checkboxes or a label that repeats its value. Only TYPE and PLAN are fields.
  Star and Visited stay in the stub.
- In round 5's fixes, the line became one quiet inline line. The build set it
  at 11px bold label against 11px medium value. That is the C4 finding.

## What the references do with fields (`design/inspo/luggage-tags/`)

- **Label above entry** (1.jpg: FLIGHT / 605, NYC FLIGHT / DATE; 4.webp
  Air Midwest FLIGHT / FINAL DEST). A tiny printed caps label, then a much
  larger entry.
- **Label then blank** (5.webp, Southern Pacific: "From ____", "To ____",
  "No. of Pieces ____"). A sentence-case printed word, then a writing line
  that holds the entry.
- **Stamped entry** (5.webp: the purple rubber-stamped "MADERA, CALIF." in the
  From blank). The entry is a different process from the print: inked, a
  little crooked, and textured.
- **Small label, big code** (2.webp: the Aloha stubs "TO KAUAI", Japan Air
  Lines "TO TOKYO"). The label is a whisper beside a huge condensed word.
- **Printer's marks in the margins** (5.webp: "S-3943 ORIGINAL CHECK",
  "Series 28"). Small type in the corners of the stock, apart from the
  content.

In every reference the label is the *printed* part and the value is the
*filled-in* part. They differ in process, not just weight. Each variant
picks one way of showing that.

## Variants

Stills: `stills/<variant>/{busiest,typical,district,signedout}-{phone@1x,crop@3x}.png`,
plus `stills/<variant>-sheet@1x.png` (the four 1x stills side by side, same
pixels). `shipped` is the current build, for comparison.

States:
- **busiest**: VEGA, starred, visited, Plans view, stop 3 of 3, selected.
- **typical**: Aurora, type only.
- **district**: Grandi, type only, no note.
- **signedout**: Aurora, starred, signed out.

### A. Ledger (`ledger`): quiet

- **Idea.** Label and value differ in case, colour and size together.
  - The label is a printed sentence-case word ("Type"), 11px regular,
    `--ink-2`.
  - The value is the filled-in entry: condensed caps, 13px semibold, `--ink`.
  - Same single line, same place as shipped.
- **Inspo.** The Southern Pacific checks' printed "From" / "To" against the
  entry, with the entry in the app's own condensed caps instead of
  handwriting.
- **Truth list.**
  - Hierarchy: name > note > the value (13px, but small and condensed) >
    label. The value now outranks the address colour-wise, which sits at
    bottom of tier 1, as the owner put it.
  - No new marks, rules or colours.
  - One line. Height is unchanged from shipped (+2px).
- **Weaknesses.**
  - The least whimsical option. It mainly fixes C4.
  - Value in `--ink` at caps can tie with the stub's labels (also ink caps)
    at 1x. See `ledger-sheet@1x`, busiest.

### B. Field stack (`stack`)

- **Idea.** The tags' own field. A tiny printed caps label sits ABOVE its
  entry. The entry is set in the name's condensed letterform (62% width,
  700) at 17px, `--ink`. Fields are columns side by side, with no cells or
  rules between them.
- **Inspo.** 1.jpg Transcontinental "FLIGHT / 605", the NYC tag's
  "FLIGHT / DATE".
- **Truth list.**
  - The label/value split is the clearest of the set: position + size + case.
  - Echoes the name's face, so the tag reads as one printed form.
  - No boxes or rules.
- **Weaknesses.**
  - Adds a second text row (about +20px tag height). The owner rejected "two rows
    of text" for the sort control. This is a different context, but worth
    flagging.
  - "STOP 3 OF 3" at 17px condensed is the loudest number on the tag after
    the pin. Check it against "numbers ... egregiously attention grabbing".
  - The value in ink-bold competes with the note at 1x (busiest).

### C. Form blank (`blank`)

- **Idea.** The printed blank. A sentence-case label ("Type"), then the entry
  in sentence case, regular-width 14px `--ink`, sitting on a 1px `--hair`
  writing line. The line is the field. Each field takes half the width, so
  TYPE and PLAN share the row like From / To.
- **Inspo.** 5.webp, the Southern Pacific "To ____ Lodi, Cal" blanks.
- **Truth list.**
  - The value reads as "written in", the closest to the references' handwriting
    without a costume face.
  - Values are no longer shouted caps, which helps long categories.
  - The hairline is `--hair`, the token for 1px rules, and sits under the
    value only.
- **Weaknesses.**
  - It adds two short rules. The owner's rule is "no heavy rules or boxes".
    These are hairlines, but it's still lines, and it sits right above the
    dashed perforation (two line systems stacked).
  - Sentence-case "Bar" at 14px ink is close to note text. The line is what
    separates it.
  - Half-width blanks leave an empty half when only TYPE shows.

### D. Rubber stamp (`stamp`): bold, whimsical

- **Idea.** The label is printed and the value is *stamped*.
  - Condensed bold caps, 17px, inked through the app's own paper-tooth mask
    (`--tex-stamp`, the VISITED stamp's ink texture).
  - Each value has its own slight angle (−2.5°, +1.5°).
  - Ink is `--ink-2`, the metadata colour, NOT navy, so it never reads as
    the VISITED stamp's state colour.
- **Inspo.** The purple rubber-stamped "MADERA, CALIF." / "DAVIS" in the
  Southern Pacific From blanks (5.webp). The stamp is already an app motif
  (visited).
- **Truth list.**
  - Whimsy that carries meaning: the clerk stamped what kind of place this
    is. Paper/ink, not decoration.
  - No new colour, no box, no ring.
  - The text is still crisp at 3x (`stamp/busiest-crop@3x`).
- **Weaknesses.**
  - A second stamped thing on the tag next to the VISITED stamp. The CD
    should judge whether "stamp" must mean only visited.
  - The tilt needs a fixed per-place angle in build (like `stampTilt`). Here
    the angles are fixed.
  - The texture eats a little of the ink (contrast is lower than flat
    `--ink-2` at 6.5:1). It is readable at 1x, but this needs measuring.
  - At 1x the texture barely shows, and it reads close to E.

### E. Destination code (`code`): bold

- **Idea.** The big printed code. A whisper label (11px caps) leads a large
  condensed value (22px, 62% width, 700). Both are in `--ink-2`, so size
  carries the field while the tier-2 colour keeps it under the name (26px
  `--ink`) and the note.
- **Inspo.** The Aloha "TO KAUAI" stubs and JAL "TO TOKYO" (2.webp). Every
  tag's three-letter destination code.
- **Truth list.**
  - The most "luggage tag" read at 1x and the strongest character.
  - No marks, rules or colour added.
  - The label/value split is unmistakable.
- **Weaknesses.**
  - It inverts the owner's tiering. TYPE at 22px is the second-largest text
    on the tag. It visibly competes with the name in `code/typical` and
    `code/district`, and outranks the tier-1 note. The colour alone may not
    hold it at tier 2.
  - "STOP 3 OF 3" at 22px is a loud number (owner-taste: numbers must not
    grab attention).
  - Long categories ("ATTRACTION") get wide. Two big fields can wrap on a
    narrow tag.

### F. Margin print (`margin`): placement

- **Idea.** The fields leave the note's flow and print along the perforation
  like the stock's own small type.
  - TYPE sits at the left. PLAN is set flush right, so the two fields bracket
    the stub's top edge.
  - Label: sentence case, 11px regular, `--ink-2`. Value: condensed caps
    12px bold, `--ink`.
  - A larger gap after the note (16) and a tighter one to the perforation
    (8) make it belong to the stub, not the note.
- **Inspo.** The printer's marks on the Southern Pacific checks
  ("S-3943 ORIGINAL CHECK", "Series 28") and the "No. of Tickets / No. of
  Pieces" corner fields (5.webp).
- **Truth list.**
  - Type sits physically at the "claim check" end of the tag, as metadata of
    the stub, below the note (tier 2).
  - Quiet, with no new marks.
  - In Plans the two fields stop sitting as one run-on line.
- **Weaknesses.**
  - With TYPE only, the flush-right slot is empty. The line looks
    left-aligned like shipped, so the placement idea only shows in Plans.
  - It reads as close to the stub as to the note. The CD/UX should judge
    whether TYPE now looks like it belongs to Directions.
  - The value is only 1px larger than the label. Most of the split is case
    and colour.

## Not done

- Not built, and no Impeccable gate run, since `index.html` is unchanged. The
  gate runs at build time on the chosen variant.
- Chromium only, with the stand-in basemap.
- Long categories and the longest plan line ("Stop 12 of 14") are not shot.
- No scoring here. UX and CD review comes next.

## Files

- `variants.js`: the CSS per variant (all of the diff).
- `render.js`: re-renders.
  `node design/popup-hierarchy/type-line/render.js [variant|state ...]`
  makes a scratch copy of `index.html` per variant, with the variant's
  `<style>` appended, in the gesture harness. It shares fixtures with
  `../build/render.js`.
- `stills/`: as above.
