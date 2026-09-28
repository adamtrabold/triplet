# Swipe LEFT to mark visited: concept stage (C1)

## The pick: "Carry and press"

**Stroke a row LEFT.**
- The shipped VISITED stamp comes out of the action column under your thumb. It uses the same geometry, per-place tilt and navy ink as the shipped stamp.
- It travels 1:1 with the finger and lowers as it comes. It is lifted: 1.3× larger, with a soft shadow and only 35% ink, meaning it is not yet touching the page.
- At the 56px commit it **presses**. The ink is at 100% on the first frame, with a small 0.94→1 squash and a haptic tick. In the same frame, the row's visited field washes in, so the tint and the stamp arrive as one event.
- On release the stamp simply stays; it was already pressed into its column.
- If you let go before 56, the stamp slides back out and nothing is inked. As with the star, a stamp that hasn't pressed never looks done.

**Why this one.** It is the true mirror of the Pencil Star:
- The star is *drawn* over time, in the printed star's own slot, pulled out from the left.
- The stamp is *carried in and pressed* in one instant, in the stamp's own column, from the right.

This completes the app's grammar: printed = the guide's facts, pencilled = what you care about, stamped = where you've been. Your finger's travel is spent on the approach, and the mark itself is instant, the way a real stamp is.

**Un-visit.** It is the same stroke on a visited row, and it is the exact inverse: the stamp **lifts off**.
- It rises to 1.3× and its shadow grows.
- The impression fades to a 25% ghost, held until 44px.
- At 56 the ghost is gone, the field drains, and you get the erase double tick.
- This mirrors the star's "honest rub": letting go early leaves the stamp down.

## How the constraints are answered

- **A swipe must never delete.**
  - A left stroke *may* start on the X. That is where a right thumb naturally lands.
  - The moment the stroke locks, the X fades out and stops taking taps.
  - The stroke's own click is eaten by the existing one-shot `eatClick`, a capture listener on the row that runs before the X's own listener.
  - A *right* stroke that starts on the X is still refused.
  - Prototype result: strokes starting on the X gave **0 deletes** in both directions of visited state.
- **Safari's forward-swipe edge.** The existing `EDGE` 24 guard already covers both screen edges. The X sits inside it (x ≈ 346–374 against a 366 cutoff), so a stroke from the X's outer third still goes to Safari. That is acceptable, and a dial for the perfection stage.
- **The mark that lands is the shipped stamp.** The prototype uses the same `.row-stamp` markup and `stampTilt()`, so the pressed state is pixel-identical to a rendered visited row.
- **Haptics are the star's.** `starHaptic('ink')` on the press and `starHaptic('erase')` on the lift. The iOS 26.5+ swipe limit applies unchanged.
- **The popup's Mark Visited is still the non-gesture path.** A teaching replay from the popup, like the star's, is an option for later.
- **The field tint stays consistent.** The tint rides the press (commit) frame, and `toggleLocationFlag('visited')` then renders the real `.is-visited` row.
- **No regressions.** The star touch suite ran against the prototype: **84/84**. Scroll-lock, edge guard and tap logic are all shared and untouched. The left stroke replaces the old "6px of give, inert" behaviour on pin rows only; shape rows stay inert.

## Rejected ideas

- **Slam from above:** nothing follows the finger until the commit. You can't watch it or back out of a half-done mark, and it breaks the gesture contract where your finger owns the mark.
- **Roll under the stamp:** the row slides left and a fixed stamp head inks progressively as the row passes, like a date roller. A progressive reveal is the *pencil's* language; a stamp is instant. Sliding the text left also collides with the badge.
- **Press-and-hold then lift:** a long press was already ruled out for the star, since it costs at least 450ms on every stroke and collides with tap-to-navigate. It also isn't a mirror of the right stroke.

## Filmstrips

Both are real-time compositor frames at 3x, from a left stroke starting ON the X at 0.6px/ms:
- `c1-visit-3x.png`: carry, press at about 390ms, field washes in, the X returns after lift.
- `c1-unvisit-3x.png`: lift, fade to ghost, gone at 56, field drains.

## Execution flaws

These are noted for stage 2 and deliberately not fixed now:
- The name's truncation changes when the rest state lands, so the FLIP rule is still needed.
- On un-visit the lifted stamp doesn't travel with the finger; decide whether it should.
- There is no pressure or detent cue before the press.
- The ghost value is untuned.
- On long names, the name slips under a feathered edge as the stamp nears; this was checked roughly only.
- Timing and contrast are unmeasured, and there is no reduced-motion pass. Under reduced motion the plan is: no carry motion, the press appears, and the haptic still fires.

Prototype: `c1-proto.html` (main plus `build1.py`).
