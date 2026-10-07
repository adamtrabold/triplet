# CD review: Hanging Tag v4 (round 6), stub colour and the Visited moment

Fresh CD, 2026-10-07. I did not author, suggest or score any of this work, and I
did not read any other review. This is a concept round: per the owner, I kill on
the idea, never on the mock. Mock flaws become fix notes.

## 0. Owner taste first (ledger rules that apply)

- "Colour with personality, on the thing that matters" / "Directions feels
  unnecessarily orange… a color focus would be better on starred" (2026-10-07).
- "Colour must communicate, or go neutral"; "color coding is not enough".
- "Whimsy, not average": character from form, paper and ink, not decoration.
- "Secondary marks never outrank content"; "so much information all visual
  hierarchy is starting to struggle".
- "Reduce information when marking state"; "Visited vs pin are not
  differentiated nearly enough".
- "Stamp, don't draw or slide… grow shrink that feels good".
- "No star unless it's been starred" (the unstarred segment is a labelled
  control, not a mark: fine).
- "Signed out: Directions stays tappable; greyed-out controls offer sign in."
- "Reuse existing control styles"; "A toggle must look like a toggle".
- "No heavy rules or boxes"; effects restrained.
- "Controls don't move or grow."

The reference tags (`design/inspo/luggage-tags/1-5`) get their personality from
four things: a printed colour FIELD as the ground of the card or of one band,
big confident type, physical edges (perforations, eyelet patches, torn stubs)
and stamped or handwritten marks. Colour on a real tag nearly always codes
something (an airline, a destination, a class of service).

## 1. Scores

### Colour

| Option | Concept | Execution | Evidence |
|---|---|---|---|
| **A. Starred carries the colour** | **8** | **6** | `star-busiest`, `star-typical`, `star-bare` |
| B. Stub in the pin's colour | **4 (kill)** | 6 | `cat-busiest`, `cat-typical` |
| C. Two-ink | 7 | 8 | `two-busiest`, `two-typical`, `two-bare` |

- **A, concept 8.** It is what the owner asked for, taken literally, and the
  colour means something ("I care about this one"). It also matches the
  shipped app, where starred already is `--figure-deep` (`index.html`, about
  line 1406). It is the only option that borrows the references' printed
  colour field and gives it a meaning. Unstarred, the stub is plain ink on
  paper (`star-typical`, the same as `two-typical`). That is correct: no mark
  without state.
- **A, execution 6 (hierarchy breach).** In `star-busiest-phone@1x` the solid
  rust slab is the loudest thing on the screen, louder than "VEGA Copenhagen".
  A secondary control outranks the content. The filled cell also drops the
  dashed dividers and the perforation notches (`star-busiest-crop@3x`
  compared with `two-busiest-crop@3x`). Without them, one filled cell in a
  three-cell strip reads as the *selected tab of a segmented control* (a
  mode switch), not as a colour printed on a stub. Fixable; the idea stands.
- **B, concept 4: kill on the idea.** The colour repeats what the pin already
  says (category), so it is "colour that communicates nothing", a rejected
  pattern, and it caps at 6 regardless. It is a full-width colour slab on
  every tag, so the stub outranks the name in `cat-typical`. It is
  inconsistent too: the VEGA plan-stop tag goes navy (`cat-busiest`) because
  the pin is a plan marker, so the "pin's colour" is not the category. And
  starred, where the owner pointed, gets no colour of its own.
- **C, concept 7, execution 8.** It is clean, correct and consistent with the
  list. But it does not answer "more personality": a small orange star and
  rust word are what the app already does on rows. The owner's likely read is
  "it's just the old one without the orange".

### Visited

| Option | Concept | Execution | Evidence |
|---|---|---|---|
| **1. Screen-back + stamp** | **8** | **6** | `screen-1/2/3`, `screen-busiest` |
| 2. Press and hold | **4 (kill)** | 6 | `hold-1/2/3`, `hold-busiest` |
| 3. Punch (baseline) | 5 | 3 | `punch-2`, `punch-3`, `punch-busiest` |

- **1, concept 8.** It is the owner's idea and it is one tap. It reuses the
  list's own VISITED stamp and filed paper, which satisfies the continuity
  rule. A claim check that gets stamped is the most tag-like moment in the
  whole concept, and the most whimsical. It is also the only option that
  makes a visited tag look clearly different from an unvisited one.
- **1, execution 6.**
  - **Redundant state marks.** On one tag, a visited place says VISITED twice:
    the stamp, and ✓ VISITED in navy on the segment (`screen-3`,
    `screen-busiest`). With the pin's check sticker there are three checks
    in one glance. That is "unnecessary variations" and the opposite of
    "reduce information when marking state", and it caps at 6.
  - **The stamp crowds its neighbours.** In `screen-busiest` it jams against
    the PLAN line and touches the tear line.
  - **The screen-back is invisible.** At 1x the paper only moves from raised
    to `--paper-filed` (`screen-busiest-phone@1x`). The owner asked for
    "screen it back" and won't see it happen.
- **2, concept 4: kill on the idea.**
  - It isn't one tap. A plain tap does nothing, so the gesture is hidden.
  - The label grows a "HOLD:" prefix, which is more copy.
  - Undo needs a hold too.
  - The progress ring is a new control the app doesn't use anywhere.
  - Its end state (`hold-busiest`) has no stamp, so a visited tag barely
    differs from an unvisited one.
  - It solves accidental taps, which the owner never raised. Undo is one tap
    away in option 1.
- **3, concept 5, execution 3.**
  - As a baseline it is honest, but it is what the owner already asked to
    move past.
  - The mock is broken: in `punch-3` and `punch-busiest` the punched check
    renders as a stray fragment colliding with the "VISITED" label.
  - There is no state change on the tag body, so it fails "Visited vs pin
    are not differentiated nearly enough".

### Best combination: **A + 1** (starred field + stamped claim check)

The two moves together give the stub two kinds of personality, each carrying
meaning: printed colour for "I care" and a rubber stamp for "I've been".
That is how the reference tags work.

### Did "more personality" land?

**Partly.** A and 1 point at the right reference language (a printed colour
field and a stamp). In these stills, though, A reads as UI selection rather
than print, and 1's stamp is crowded and duplicated. The tag body is
otherwise the same cream card as round 5. Compared with the references, the
stub still lacks the physical, printed feel: the perforation and notches
disappear exactly where the colour is. B borrows the references most
literally but with the wrong meaning. C adds no personality.

## 2. Owner-objection prediction (1x, phone)

1. "The starred block is the loudest thing on the tag. It looks like a
   selected tab, not a stamp of colour. Tone it down so the name still wins."
2. "Why does it say visited three times? Stamp, the button and the pin.
   Pick one. Also I can't see any screening back."
3. "That sign-in bar is a random dark toast with orange text. I literally
   just said the orange was unnecessary. It doesn't look like part of the
   tag."

All three are plausible, so this is not ready as is.

## 3. Noise count: busiest view (`star-busiest` = `screen-busiest`, A + 1)

- **Colours: 7.**
  - ink black
  - grey address
  - grey labels
  - navy (stamp and the segment ✓)
  - rust (the starred field)
  - tan filed paper
  - the tan eyelet patch
- **Marks and lines:**
  - pin plus its black star badge, and the string
  - the eyelet patch and ring
  - the close ×
  - the stamp (double ring, dotted track, check, word)
  - the dashed tear line
  - two notches, missing on the rust side
  - three icons and three labels
  - the rust slab
- **Visited said three times:** the stamp, the segment ✓ and the pin.
- **Starred said twice:** the pin badge and the stub. That's acceptable,
  because the pin is a different surface.

**Rejected-pattern matches (each caps at 6):**

1. **Colour that communicates nothing:** all of B, the stub repeating the
   category.
2. **Unnecessary variations / not reducing information:** the duplicate
   VISITED (stamp plus segment) in 1.
3. **Hierarchy (secondary outranking content):** the solid starred slab in A
   at 1x.
4. **Heavy box / colour that communicates nothing:** the sign-in slip
   (`star-signin`). It is a new dark navy toast, wider than the tag, with
   orange "SIGN IN". The app already has a slip pattern (`#planSlip`:
   `--paper-raised`, navy 11px caps, `--hair` rules), and "Reuse existing
   control styles" applies. The README says the slip "slides out under the
   stub". The render is a detached, full-width snackbar.

The signed-out state itself (`star-signedout`) is right: Directions stays
live, and Star and Visited are visibly greyed but still legible.

## 4. Numbered fixes (A + 1, before the owner sees it)

1. **Make the starred field print, not select.** Keep the dashed dividers
   and the perforation notches running through the rust cell, so the colour
   reads as ink on the stub, the way the references do. Then check
   `star-busiest-phone@1x`: the name must outrank the field. If it doesn't,
   reduce the field's weight (area or depth). Don't fall back to C.
2. **One visited mark on the tag.** Once the stamp lands, the Visited segment
   must stop restating it. Either the stamp lands *on* the claim-check stub
   (a stamped stub is what the references show, and tapping it undoes), or
   the segment goes quiet and serves only as the undo. That's the
   designer's call, but the result is one VISITED on the tag. Render it in
   `screen-busiest`.
3. **Give the stamp room.** In the busiest state it must not touch the PLAN
   line or the tear line. Re-render `screen-busiest` with a long note plus
   TYPE and PLAN, and confirm the stamp is clear of everything.
4. **Make the screen-back visible at 1x.** It should be a step the owner can
   see in `screen-busiest-phone@1x`, still with no dimming of the notes
   (they're tier 1). If the filed tone can't do that alone, say so in the
   README rather than shipping an invisible change.
5. **Rebuild the sign-in slip from the existing slip pattern** (`#planSlip`
   language: paper, navy caps, hairline), emerging from under the stub at the
   tag's width. No orange. The tag doesn't move.
6. **Drop B and option 2 from the owner's sheet.** "Fewer variations." Show
   A + 1 as the proposal, with C + 1 as the single quiet alternate, so the
   owner can say "more" or "less".
7. **Fix the punch glyph or drop punch.** If punch stays as a baseline
   reference, `punch-3` and `punch-busiest` must not show the broken check
   fragment. Otherwise drop it with fix 6.
8. **Render the stamp's motion as a filmstrip or video** for the owner
   (`screen-1`, `screen-2`, `screen-3` are stills). The rule is "stamp with
   some grow shrink that feels good… same as the star"; that can't be judged
   from one blurred frame.
9. **Show one non-Copenhagen starred tag.** `--figure-deep` is the city
   accent, and in Copenhagen it sits very close to the restaurant pin's
   burnt orange (#A8400C against #AC5019). Show a starred restaurant in
   another city so the owner can see starred and food side by side.

## Verdict

**Show after these fixes** (1-6 at minimum; 7-9 are quick). The direction is
right, A + 1. The stills as they stand would draw the three objections in
section 2.
