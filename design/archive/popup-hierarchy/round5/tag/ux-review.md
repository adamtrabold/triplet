# Hanging Tag v3: UX review (Segmented stub vs Claim check)

UX agent, 2026-10-06, on `51b4bca`. Brief: `docs/ux-brief.md`. Jobs come
from `../../ux-analysis.md`, and hard limits from `../../round2/ux-review.md`
§4. I judged the 1x phone stills first (busiest), then the 3x crops.

Owner (verbatim): "the whole area down there being just for visited makes no
sense. thinking of that area kind of like a claim check maybe the directions
button gets put there centered? or maybe it's a segmented area with multiple
buttons? here are some more reference shots. i don't like the new palcement
of category type."

## Ranking (UX)

| # | Variant | Verdict | Ready for the owner? |
|---|---|---|---|
| 1 | **Segmented stub** | KEEP | **Yes, as is.** Three plain buttons, the same control language in every state. Lowest interaction risk. |
| 2 | **Claim check** | KEEP | **Yes, with two must-fixes noted.** It makes "go there" the clearest of the two, but Star and Visited become form fields whose copy changes meaning between states, and one of the three fields isn't a control. |

Both answer the owner's note: the stub is no longer Visited-only, and type
has left the header.

## Jobs (both variants)

| Job | Segmented | Claim check |
|---|---|---|
| J1 identify | PASS: name + "Rejsbygade · Humleby" (`busiest`). The address now reads street · neighbourhood ("Fiskislóð 53 · Örfirisey"), which fixes v2's line. | same |
| J2 decide | PASS: full note | same |
| **J3 go there** | PASS: the leftmost segment, the only colour, ~105×60 | **PASS, clearest:** a centred stub ~316×60, the only colour, alone in its band |
| J4 visit | PASS: the MARK VISITED segment, ~105×60 | PASS (friction): "☐ MARK" field, ~88×52 |
| J5 star | PASS: the STAR segment | PASS (friction): "☆ STAR" field |
| J6 plan stop | PASS: "PLAN STOP 2 OF 3" field line | PASS: "TYPE · PLAN / BAR · 2 OF 3" |
| J7 close | PASS: 44px × + map tap | same |
| J8 address | PASS: short form under the name | same |

## Checks

**Is "go there" one obvious tap?** Yes in both.
- Claim check makes it unmistakable: one centred stub with nothing else in
  its band.
- In Segmented, Directions leads the row and is the only coloured segment.
  At 1x (`seg-busiest`) it is the first thing in the stub the eye lands on.
- **Is Directions primary enough in Segmented?** Yes for the job. It doesn't
  need to be bigger, because there is no competing coloured action and it
  sits in the leading slot by convention. Equal size is a visual question
  (CD), not a findability one.

**Targets and spacing.**
- **Segmented:** three ~105×60 segments split only by dashed rules, with no
  dead band. This is the segmented-control convention. The ≥8px dead band
  I set as a hard limit was meant for small adjacent targets; with 105px
  segments the neighbour is never within touch slop. I'm amending the limit
  to "≥8px dead band **or** wide segments (≥ ~88px) whose whole area is the
  target".
- **Claim check:** the fields are ~88–110 wide × ~52 tall (3x crop, 1x
  units). That passes under the same amended rule. The ~16px between the
  field row and the stub's perforation keeps Visited and Directions apart.
  Pass.

**Claim check: can people find and use the "check here" fields?**
- **Find: yes.** Each field has a caps label and a verb or box ("STAR",
  "☐ MARK"), and the box comes from the Hawaiian Air tag the owner sent.
- **Use: three problems, all fixable in execution.**
  1. **Info and controls look identical.** TYPE sits in the same row,
     with the same rule and the same label-over-value form, but it isn't
     tappable. People will tap it, or will doubt that STARRED and VISITED
     are tappable because TYPE isn't. **Must-fix:** separate the read-only
     field from the two controls by form or position.
  2. **The copy flips between verb and value.** Unstarred shows "☆ STAR" (a
     verb); starred shows "★ YES" (a value, `claim-busiest`). "YES" doesn't
     say "tap to undo". "MARK" vs a stamp has the same issue, though the
     stamp is the shipped undo target, so it's familiar. **Must-fix:** one
     consistent pair for the control in both states, e.g. the label stays
     the question and the value stays a tappable state word. The designer
     chooses the words.
  3. **"MARK" alone is a vaguer verb than "MARK VISITED".** It's
     acceptable under the VISITED label, but it needs the label to make
     sense, and VoiceOver must read the label + value as one control name
     ("Visited, not marked, button").

**Signed out** (`seg-signedout`, `claim-signedout`).
- Star and Visited are at 0.4, Directions live. In Claim check the field
  labels dim too, which is right because they belong to the control.
- Same owner flag as before: Directions stays live (it edits nothing).
- Still open: what a tap on a dimmed control does. UX recommends offering
  sign-in.

## Control parity, state, hierarchy, convention

- **Parity:** star and visit stay one tap; the row swipes are untouched.
  Visited stays in one slot when toggled in both variants (the punch hole
  in Segmented, the stamp in Claim).
- **State:** unchanged from v2. The tag stays open across toggles and the
  poll, the list drops to its header (still unruled) and must restore on
  close, and swapping between pins is one tap.
- **Hierarchy at 1x (busiest):**
  - Segmented: name > note > Directions > star/visited > type field.
  - Claim check: name > note > Directions > fields.
  Both match the owner's tiers. Type is a quiet labelled field in both.
- **Convention:**
  - Segmented: a segmented control.
  - Claim check: a form + primary button. That's familiar, but form
    fields usually *edit*, and here two of them are toggles and one is
    read-only. Hence must-fixes 1 and 2.

## Must-fixes

- **Segmented:** none for showing the owner. For the build:
  - each segment's whole area is its hit target;
  - VoiceOver names = "Directions", "Star / Starred", "Mark visited /
    Visited".
- **Claim check:**
  1. Separate the read-only TYPE (·PLAN) field from the Star/Visited
     controls.
  2. Consistent control copy in both states (no "STAR" → "YES").
  3. VoiceOver reads label + value as one control.

## Not verified

Stills only. Hit-testing, VoiceOver, the punch/stamp motion timing and the
Safari toolbar are unchecked. The address extraction rule should be run
over all 201 rows (carried from the round 4 reviews).
