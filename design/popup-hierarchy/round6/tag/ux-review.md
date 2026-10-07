# Hanging Tag v4: UX review (colour, Visited trigger, sign-in slip)

UX agent, 2026-10-07, on `515822a`. Brief: `docs/ux-brief.md`. Hard limits
are from `../../round2/ux-review.md` §4 (amended in round 5 for wide
segments). Evidence: the 1x phone stills, then the 3x crops.

Owner (verbatim): "1. Segmented stub is awesome. I now wonder about the
color application in there — should we give that more personality?
Directions feels unnecessarily orange and like maybe a color focus would be
better on starred. Also when visited is tapped should we screen it back with
the visited stamp on top? Or use another action method to trigger the stamp
that makes more sense? 2. Direction stays tappable, tapping greyed out
should offer sign in. 3. Let's try it idk yet. 4. Districts and streets need
a map pin type."

**Verdict:** ready to show the owner with Visited option 1 or 3. Kill
option 2 (hold). Colour: C ≥ A > B on meaning; the look is the CD's call.
The sign-in slip has three must-fixes.

## Jobs (unchanged from v3 unless noted)

J1, J2, J3, J5, J6, J7 and J8 PASS, the same as round 5:
- Directions is still the leading segment and one tap. In ink it is still
  the first segment and needs no colour to be found: "go there" stays one
  obvious tap.
- J4 depends on the trigger (below).
- Note 3 (list drops to its header): the owner will try it live. The
  restore-on-close contract from round 4 stands.

## 1. Visited triggers

| | 1 Screen-back + stamp | 2 Press and hold | 3 Punch |
|---|---|---|---|
| Discoverable | Yes: "MARK VISITED", the same as today | **Weak:** "HOLD: VISITED". A plain tap does nothing, so it's a dead tap the first time. | Yes: "MARK VISITED" |
| One tap | Yes | **No** (~450ms hold) | Yes |
| Undo | One tap on the ✓ VISITED segment, same slot | A hold again | One tap, same slot |
| Accidental marks | Same risk as today (one tap); one-tap undo makes it cheap | Prevented | Same as 1 |
| Visited marks on one tag | **Two:** the stamp on the body plus ✓ VISITED in the segment (`screen-busiest`), and the filed paper too | One | One (the hole) |
| a11y | The stamp is decorative (aria-hidden); the segment carries `aria-pressed`. Fine. | **Fails as is.** VoiceOver's double-tap, Switch Control and keyboard can't hold. It needs an alternative action, and then the hold protects nothing. | Fine; the hole is decorative |
| Controls stay put | Yes | Yes | Yes |

**Rank: 1 > 3 > 2.**
- **Kill 2 on the idea.** It breaks the one-tap Visited hard limit (J4),
  it needs a second path for assistive tech that defeats its purpose, and
  undo also costs a hold. Better execution can't fix this: the hold *is*
  the idea. The thing it guards against (an accidental mark) is already
  cheap to undo in one tap.
- **1 must-fixes:**
  1. The stamp needs a reserved landing area. In `screen-busiest` it sits
     beside the TYPE/PLAN line, at the end of a 5-line note. A longer note
     or a two-field line must never be overlapped (notes are tier 1).
  2. The ✓ VISITED segment must still read as the control that undoes it.
     Whether the second mark is too many is the CD's call; UX needs only
     the segment's pressed state.
  3. Screen-back tints only the paper, never the text. Contrast must stay
     at the note's normal level, and it must not look like the signed-out
     "disabled" dimming.
  4. Reduced motion: the stamp appears with no drop.
- **3:** carried from v3. The hole's contrast depends on the real tiles.

## 2. Colour: does it carry meaning and state? (look = CD)

| | Meaning | State legible without colour? | Conflicts |
|---|---|---|---|
| A Starred segment filled `--figure-deep` | Starred | Yes: filled star + "STARRED" | `--figure-deep` already means **selected** (the highlighted list row) and **cluster** on the map. The star is black ink on the pin and in the list, so one state would get two colours. |
| B Stub in the pin's category ink | Category, which the pin already shows | Yes | It carries no state. Bar's slate-blue stub (`cat-busiest`) is close to the visited sticker / stamp navy, so a bar's stub can read as "visited". Colour says the wrong thing here. |
| C Two-ink: orange star, navy VISITED | Starred, visited | Yes | Same black-vs-orange star question as A, but smaller. Navy for visited matches the stamp. |

**Rank on meaning: C ≥ A > B.**
- B adds colour that repeats category and can be mistaken for visited.
- A does what the owner asked and its state is clear. The cost is that
  orange means "selected" elsewhere in the app.
- **Must-fix for A or C (owner/CD decision):** if a starred star turns
  orange in the tag, either the list and pin stars follow, or the owner
  accepts that the tag's star differs. Don't let one state silently have
  two colours.

## 3. Signed-out sign-in slip (`star-signedout`, `star-signin`)

- **Moves anything?** No. The tag stays put and the slip appears below it
  over the map (y≈440–485). Good.
- **Directions live:** owner-confirmed.
- **Must-fixes:**
  1. **Dismiss:** "tapping anywhere" must only dismiss the slip on that
     first tap. It must not also close the tag or open the pin under the
     finger: the slip sits over the map, where a tap would normally hit a
     pin. Tapping the tag dismisses it and does the tapped thing. A second
     greyed tap while the slip is open leaves it open, with no stacking.
  2. **VoiceOver:**
     - Greyed controls must be `aria-disabled="true"`, not `disabled`, so
       they stay focusable and tappable.
     - Their names should say why: "Star, sign in to use".
     - The slip is announced (a polite live region), and SIGN IN is ≥44px
       and reachable by swipe.
     - No timed auto-dismiss while VoiceOver is on.
  3. **SIGN IN** opens the existing auth modal. After signing in, return to
     the same tag with the control live. Don't silently perform the star
     the user tapped earlier: they should tap it once more.
- The slip's own 44px target height: it's ~44px in the still. Check it in
  the build.

## Control parity, state, convention

- **Parity:** star and visit stay one tap (options 1 and 3), and the row
  swipes are untouched. Visited stays in one slot.
- **State:** as v3 (open across toggles and the poll, one-tap pin swap,
  list restore).
- **Convention:** a segmented control. The screen-back stamp is a
  confirmation flourish, not a new control.
- Note 4 (district/street pin) is out of scope: the diamond is a
  placeholder.

## Must-fixes (summary)

1. Kill the hold trigger (2).
2. Option 1: a reserved stamp area that never overlaps text; the segment
   stays the undo control; paper-only screen-back; reduced motion.
3. Colour A or C: one colour for "starred" across tag, list and pin (an
   owner/CD decision).
4. Slip: first tap only dismisses; aria-disabled with reasons and a
   live-region announcement; return to the tag after sign-in.

## Not verified

Stills only. Hit-testing, VoiceOver, timing, the punch hole on real tiles
and the Safari toolbar are unchecked.
