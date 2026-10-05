# CD review: Hanging Tag v2 (round 4)

Fresh CD, 2026-10-05. I did not author, suggest or score any of this work.
Brief: `docs/cd-brief.md`, followed in full. Concept round: I kill on the
idea, not the mock, and mock flaws become fix notes.

## 0. Owner taste first (ledger rules that apply)

- The tag pops out of the pin and ends on a straight string (new today).
- Long notes show full length, with no flip-over (new today).
- The address can matter at a glance (new today).
- In the popup, notes are tier 1 and type is tier 2.
- Secondary marks never outrank content. Busy views keep their hierarchy.
- No star unless it's been starred. Don't show empty states as marks.
- No dots or decoration that adds noise. Colour must communicate or go neutral.
- Signed out: actions visible but disabled.
- Visited is a stamp on rows and a dark sticker with a cream check on pins. Continuity between surfaces.
- "Stamp, don't draw or slide." Motion must be visible.
- Controls don't move or grow.
- Measured spacing, and icons that fill the same visual space.
- Whimsy that carries meaning, not added decoration. Bonus: the pin and what it opens are one idea.
- Fewer variations.

## 1. Scores

| | Concept | Execution |
|---|---|---|
| **Hanging Tag v2 (overall)** | **8** | **6** (capped, see section 3) |
| A. Punched | 8 | 5 |
| B. Torn off | 4 | 6 |
| C. Stamped | 7 | 7 |

**The overall concept is 8.** The idea is right and the owner already likes it.
`busiest-phone@1x` is the strongest popup this project has produced at 1x. The
name leads, the whole note reads as one block, the address sits under the name,
and the type has dropped to a printed header band, which is where a real tag
prints its fixed fields. The cut corners and the eyelet make it read as a tag
without any ornament. It isn't a 9 because the stub, the part the owner
called "really interesting", is still the weakest area at 1x, and the shape
case (`shape-phone@1x`) breaks the core metaphor.

**Execution is 6.** It's capped by two rejected-pattern matches (section 3) and
two broken frames:

- In `pop1-phone@1x`, the shrunken tag is drawn on top of the pin instead of
  coming out of its foot.
- `pop1-crop@3x` is 288x390, so it isn't 3x and isn't phone-readable.

### How the owner's three notes landed

1. **Pop out of the pin, straight string: landed in the stills, not yet in
   the motion.** `pop2`–`pop4` and every rest frame show a taut vertical string
   from the pin's foot to the eyelet. That reads well and the swing is gone.
   But `pop1`, the frame that's supposed to show "out of the pin", shows a
   tiny tag sitting over the pin's head. The one frame that proves the note is
   the broken one. In `shape-phone@1x` the string hangs from empty map inside
   the district outline. There's no pin to come out of, so for shapes the
   note isn't met at all.
2. **Hierarchy: mostly landed.** The address is directly under the name (12px
   grey, one line, › for more). It answers "which VEGA" without competing
   with the name. Metadata is off the stub and in the header band (`BAR ·
   STOP 2 OF 3`), so type is clearly tier 2. The stub now holds Visited only,
   which is exactly the "unique thing on the rip off area" the owner asked
   for. The remaining weakness: in `busiest-phone@1x`, the filled black
   STARRED star is the second-heaviest mark after the name. That's acceptable
   because it's a real state, but it's worth a look.
3. **Long notes at full length: landed.** VEGA (`busiest`) and the 8-line
   approx note (`approx-phone@1x`, with its paragraph break) show in full with
   no turn-over. The approx tag ends around y≈555 with real map below it.
   Lowering the list to its header is an unruled call that the owner should
   see stated in one line, not discover.

### The stub variants

- **A. Punched (concept 8, execution 5).** This is the best idea. Only a
  paper tag can be punched, the check echoes the pin sticker and the row
  stamp, and it's the "unique thing" the owner asked for. As drawn it fails
  at 1x. In `busiest-phone@1x` and `stub-punch-crop@3x`, the hole reads as a
  pale grey outlined check, which looks like a disabled or empty icon and not
  like a hole. In `signedout-crop@3x` the punched visited state looks
  identical to the enabled one; only the label greys. The chad in `punch2` is
  a tiny white sliver, so the payoff moment is invisible. The idea is sound;
  the mock needs to sell it.
- **B. Torn off (concept 4).** Kill it on the idea. Tearing off the stub
  removes the slot it lives in, so the control has to jump into the button row
  as a third button (`tear3`). That breaks "controls don't move", adds a
  button exactly when we want less information, and the torn deckle edge is
  too quiet to carry the state.
- **C. Stamped (concept 7, execution 7).** It reads clearly at 1x, it's the
  app's own visited language, and it obeys "stamp, don't draw". It's the
  least new idea. In `stub-stamp-crop@3x` the stamp is drawn as a dotted
  **oval**. It must be the actual `.row-stamp` artwork (ring, dotted track,
  navy 82% ink, tilt), or it's a third visited mark.

**My pick is A, with C shown beside it as the safe option.** The owner asked
for "some sort of unique thing". Only A answers that, but only if fixes 1–3
make it legible. Show the owner two (A and C) and drop B. If A can't be made
to read as a hole at 1x, show C alone.

## 2. Owner-objection prediction (owner's voice, at 1x on a phone)

1. "The visited check on the stub looks greyed out, like it's disabled. I
   can't tell it's a punch at this size."
2. "There are three circles stacked at the top: the pin, the ring, and the
   little icon next to BAR. That's noise, and the ring colour doesn't mean
   anything."
3. "I marked it visited and the pin above it didn't change. And the district
   tag is hanging off nothing."

Each of these is plausible, so it isn't ready.

Lower-probability objection: "the stub is a big empty strip for one button".
In `typical-phone@1x` the stub is about 52px with roughly 70% of its width
empty.

## 3. Noise count (`busiest-phone@1x`)

There are 15 distinct marks in the tag and string:

| Mark | Count |
|---|---|
| tag body plus soft shadow | 1 |
| string | 1 |
| eyelet ring | 1 |
| type seal icon | 1 |
| type/stop caps | 1 |
| × | 1 |
| name | 1 |
| address line + › | 2 |
| note block | 1 |
| Directions icon + label | 1 |
| star + STARRED | 1 |
| perforation (dashed) plus two side notches | 2 |
| punched check + VISITED | 1 |

There are 6 colours:

- cream
- ink
- grey
- orange (Directions, the only accent)
- navy (pin, eyelet, seal, VISITED)
- the map's category colours to either side

There's one box (the tag) and one rule (the perforation, which carries
meaning).

Rejected-pattern matches (each one caps the score at 6):

- **Colour that communicates nothing, plus duplicated marks.** The eyelet
  ring is filled in the category colour, and the type seal repeats the pin's
  category icon about 20px from the pin itself. In every frame
  (`busiest`, `typical`, `stub-*`) the 60px column under the pin shows three
  category-coloured circles. That's decoration.
- **Inconsistent states.**
  - In `stub-punch`, `stub-tear`, `stub-stamp` and `punch3`, the place is
    visited but its pin stays the unvisited gold pin. The pin should be the
    dark sticker with the cream check.
  - In `signedout`, the punched visited stub looks the same enabled and
    disabled.

There are no dots, no second text row in the header band, no loud numbers
(STOP 2 OF 3 is quiet grey caps), no hard dark edges, and the shadow is
restrained. The perforation is light and meaningful, so it passes.

Hierarchy at 1x (busiest): name > note > STARRED star (heavy black fill) ≈
Directions (orange) > VISITED > address > header band. The content leads.

Consistency:

- The paper/ink, the shipping-tag cut corners and the perforation are true to
  the inspo (luggage labels, tickets).
- The action icons match in size.
- The ○ MARK VISITED circle is lighter in weight than the STAR outline, so
  they're two different empty-control styles.
- The stamp in C isn't the row stamp.

## 4. Gating

These are concept stills, and `index.html` is untouched, so the gating is
fine. The owner has seen v1 (round 3 and the finalists) but not this v2 or
any stub variant. Nothing gets built until the owner approves v2 and picks a
stub.

## Verdict: show after these fixes

1. **Make the punch read as a hole at 1x.** The map should show through it
   clearly. The cut should come from a subtle inner shadow on the paper edge,
   with no grey outline and no hard line. It needs to be big enough to read
   in `busiest-phone@1x`. Check it over a dark tile and a light tile.
2. **Show signed-out A as visibly disabled.** It must differ from the enabled
   state in more than the label. Re-shoot `signedout`.
3. **Make the chad moment visible.** In `punch2` the chad should be large
   enough and contrast enough to see falling, and the frames should be
   readable.
4. **Flip the pin when the place is visited.** In every visited frame
   (`stub-punch`, `stub-tear`, `stub-stamp`, `punch3`, `stamp3`, `tear3`),
   the pin should become the shipped dark sticker with the cream check. That
   way the pin and the tag say the same thing, which is the owner's bonus
   rule.
5. **De-noise the column under the pin.** The eyelet should be a neutral
   grommet (paper or ink, not the category colour). Either drop the type seal
   icon from the header band or make it ink-neutral. It must not be a third
   category circle.
6. **Fix the shapes.** The string needs to come out of something, such as the
   shape's own marker or label, or the shape needs a stated alternative. Right
   now `shape-phone@1x` hangs from empty map.
7. **Re-render `pop1`.** The tag should emerge from the pin's foot, not on
   top of the pin. Re-shoot `pop1-crop@3x` at true 3x.
8. **Fix stamp C.** It should use the exact `.row-stamp` artwork, not a new
   oval. Verify against `design/visited-system/stamp-first/`.
9. **Drop B (Torn off)** from what the owner sees.
10. **Match the empty controls.** The unvisited ○ MARK VISITED stroke weight
    should match the STAR outline icon, giving one empty-control language and
    the same visual size.
11. **Look at the stub's empty width.** In `typical` and `stub-off` the stub
    is mostly blank at 1x. The fix is the designer's call, but the CD flags
    it as "spacing is insane" bait.
12. **Tell the owner one line** saying the list lowers to its header while
    the tag is open. It's an unruled call, so the owner should see it stated,
    not find it.

When fixes 1–8 are done, show the owner A and C side by side in
`busiest-phone@1x`, with the punch and stamp motion strips.
