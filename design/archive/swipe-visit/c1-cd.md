SCORE 9/10 (concept)

# Swipe LEFT to mark visited, concept C1 "carry and press": CD review

## Verdict: ready for the owner

"Carry and press" is the right idea, and it is the true mirror of the Pencil Star rather than a copy of it:

| | Star | Stamp |
|---|---|---|
| How the mark is made | **Drawn** over time | **Carried** in and **pressed** in one instant |
| Stroke direction | Right | Left |
| Where it happens | The star's own slot, on the left | The stamp's own column, on the right |
| Material | Graphite | Rubber and ink |

Each gesture speaks its material's truth: a pencil mark accrues, a stamp is instant. That completes the app's grammar (printed = the guide's facts, pencilled = what you care about, stamped = where you've been) as intentionally as the star did.

The finger owns the approach, so you can watch it and back out of it. The commit is a single, honest event: the ink at 100%, a squash, and the visited field washing in on the same frame. That is exactly the kind of "done" the owner's iOS 27 phone needs, given that swipe haptics are silent there.

## The four questions

- **Does it complete the grammar as intentionally as the Pencil Star?** Yes.
  - The mark that lands is the shipped stamp: same geometry, per-place tilt and navy ink. So the gesture produces the thing the list already shows.
  - The row's two ends now each own one gesture and one mark: star on the left, stamp on the right.
- **Does un-visit (lift off) read?** Yes, as a reversal.
  - Physically you can't un-stamp ink, the way you can erase graphite. So "the stamp lifts back off the page" is best understood as time running backwards: the precise inverse of how it arrived.
  - That's the right call. A new metaphor (a VOID stamp, blotting) would make the rarer, corrective action louder than the primary one.
  - The honest hold (the ghost until 44, gone at 56) keeps it truthful, matching the star.
- **Is starting on the action column (over the X) right?** Yes.
  - It is where a right thumb lands, and where the stamp lives. The stamp literally comes out from under your thumb.
  - Refusing that zone would push the gesture onto the name and make it awkward.
  - Delete safety holds at the concept level: 0 deletes from any stroke. UX's C1 (only an almost-still tap may delete) makes it airtight, and it is a mandatory perfection-stage item.
- **Is any rejected idea better?** No.
  - The slam takes the mark away from the finger.
  - The roller borrows the pencil's progressive language and makes the text collide with the badge.
  - The long-press is slow, and it isn't a mirror of the right stroke.

## Execution notes (no points deducted; required in the perfection brief)

1. **UX C1:** a touch that starts on the X deletes only if it moved less than about 4px. Verify on the iPhone.
2. **An impression never moves once pressed.**
   - In `c1-visit-3x.png` (409 → 686 → 831ms) the pressed stamp drifts about 8px left past the commit, then comes back on release. On paper that is a smear.
   - After the commit, the stamp is fixed in its column, and extra finger travel goes into rubber-band resistance only.
3. **"Lifted" must read as raised, not faded.**
   - At 35% ink the carried stamp currently reads as a washed-out, disabled stamp.
   - Carry the lift with elevation instead: a shadow offset and a slight scale, with the impression faint but crisp. Don't rely on transparency alone.
4. **Make the press moment as emphatic as the star's landing, in the stamp's voice.**
   - This is a thunk, not a spin. For example, a firm one-frame ink bleed or overshoot, then crisp, with the field wash on the same frame.
   - It must read as "done" with no haptic, since the owner is on iOS 27.
5. **Rules the star already follows:**
   - FLIP for truncation;
   - a pressure or detent cue before commit;
   - decide whether the lifting stamp travels with the finger on un-visit;
   - a tuned ghost value;
   - reduced motion (no carry, the press appears, the haptic still fires);
   - the feathered edge on long names;
   - a starred and visited row where both marks and both gestures coexist;
   - an optional teaching replay from the popup's Mark Visited.

## For the owner (the one-line why)

**Swipe left and the VISITED stamp comes out from under your thumb, travels to its spot and presses down. It is the mirror of the pencil star: a stamp lands in one instant, where a pencil draws.**

Rejected alternatives:
- **Slam from above:** nothing follows your finger, so you can't watch it or back out.
- **Roller:** it inks progressively (the pencil's language), and the text runs into the badge.
- **Press-and-hold:** slow, and not a mirror of the right swipe.
