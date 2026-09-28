# Swipe LEFT to mark visited — "carry and press", perfection round 1 (p1)

- Diff: `p1-proposed.diff`, index.html only, against main `741731a`.
  - 6 hunks, 278 changed lines. Nothing else in `index.html` changed through `35887d1`.
  - Verified with `git apply` + `cmp` against `p1-proto.html` (built by `buildp1.py` from main).

## What the stroke does

### Visit (unvisited pin row)

1. **Lock.** The stroke locks after 10px, flatter than ~34°, and must be cancelable.
   - The X fades out over 80ms and stops taking taps.
2. **Hand-over, first 12px of content travel.**
   - 0–6px: the name's tail feathers in and pulls back to 12px clear of where the stamp will be. The stamp is still invisible.
   - 6–12px: the stamp appears.
   - The two never overlap on any frame.
3. **Carry, 0–56px.**
   - The shipped `.row-stamp` rides in 1:1 under the thumb, starting 56px right of its slot.
   - It is LIFTED by elevation, not fade:
     - 1.15× and 3px up;
     - the stamp body casts one soft oval shadow (5px down, 4.5px blur);
     - the face stays crisp at 55% ink.
   - It lowers as it comes, with height = 1 − p². So it drops fastest at the end: the shadow tightens to a hair and the stamp hovers at 1.04×. This is the pressure cue.
4. **Press, on the 56px crossing, in the same event.**
   - Contact frame: shadow 0, 100% ink, one 1px ink-bleed frame.
   - The visited field appears on the same frame, with no fade.
   - Haptic tick.
   - Thunk (rAF curve): 1.04 → **0.93 at 31ms** (ease-in drop), held ~0.94 to 66ms, 1.015 at 121ms, rest 1 at 220ms. That is 3 frames at ≤0.97 at real timing.
5. **After contact the impression NEVER moves.** Extra travel moves nothing (a stamp can't smear). Measured: centre drift 0.000px x, 0.000px y over an overtravel to 150px.
   - Backing off 4px below 56 lifts it again (hysteresis). Releasing then is a cancel.
6. **Release.**
   - The final row is laid out, and the stamp in flow is **pixel-identical** to the pressed one: 0/44,352 px differ at 3x. So the per-place `stampTilt()` is kept exactly.
   - The narrower truncation lands under the name's feather, which then clears over 160ms.
   - The X fades back over 120ms and is tappable only once it is back.
   - A flick (≥32px at ≥0.5px/ms) visits: the stamp finishes its carry, then presses.

### Un-visit (same stroke on a visited row)

- The stamp is picked **straight up**; it doesn't travel.
  - It rises to 1.15× and 3px up, and its body shadow grows.
  - The impression fades to a 30% ghost by 44px.
- At 56 the ghost is gone, the field drains, and the erase double tick fires.
- On release, the wider row is revealed by the feather sweeping out to the new edge over 200ms.
- A flick never un-visits.

### Cancel

- The stamp is carried back out and nothing is inked. The name's feather and the X return.

## Constraints

1. **Delete safety (UX C1).**
   - Only a near-still tap on the X deletes: under `DELETE_TAP_SLOP` = 4px between down and up.
   - The release point is read from `touchend`, which always arrives, so sub-slop moves that Chromium never reports as `touchmove` are still caught.
   - Mouse uses pointerdown/up. Keyboard activation (Enter, `detail` 0) is unaffected.
   - A stroke's own click is still eaten by `eatClick`.
   - A right stroke from the X is refused.
   - Tested: D1–D10.
2. **The impression never moves:** 0 drift (V7).
3. **Lifted reads raised:** every carried frame is scaled >1.03, casts a body shadow, and has no line-art filter (V13).
   - The first pass used a line-art `drop-shadow`, which doubled every line and read as blur at 4x. It is now a single blurred oval `::after` behind the face.
4. **Thunk without haptics:** the contact frame has no shadow and full ink, the field changes on the same frame, and there are 3 squash frames. See `p1-visit-4x.png` at 357/372/389ms.
   - It is driven by rAF on the main thread. A WAAPI (compositor) transform rasterised the stamp soft at 4x and snapped crisp ~250ms later.
   - Haptics are kept: ink tick on press, erase double tick on lift. The clicks never reach document, so the account menu and suggestions stay open (checked on a visit stroke via the iOS path).
5. **The star's rules.**
   - **FLIP equivalent:** letters never change at full ink. V15 pixel-diffs everything left of the feather before and after the final layout: 0 differing for visit and for un-visit.
     - The name doesn't move in this gesture, so the rule is carried by a **20px** feather, wide enough to cover an ellipsis plus the widest glyph it replaces. It clears (160ms) or sweeps (200ms) after release, so nothing changes on the frame the row comes to rest.
   - **Pressure cue:** the height curve.
   - **Detent:** hysteresis.
   - **Reduced motion:** no carry, lift or squash. The stamp waits at its slot as a 55% impression with a static shadow, and the press simply appears. Haptics still fire, and the X is still live only after 120ms.
   - **0ms tap delay:** 1.5–1.6ms, same as main.
   - **Ink never over text:** visible text stays ≥10.5px clear of the stamp's scaled box on every frame (V14).
   - **Rapid strokes (R4-S2):** fast-forward, both ways between star and visit rows (V10, V10b).
6. **Starred + visited rows:** both gestures work on one row, and both marks coexist (V9 a–d).
7. **Per-place tilt kept:** pixel-identical hand-off (V8).
8. **Popup Mark Visited** is unchanged and stays the non-gesture path. The row field and stamp stay in sync (V16).

## Gate

Star gate:
- "84 + 8 (+ N8-a)": touch suite 84/84 in both motion modes, and `flip6.js` 8/8 (its control fails 4/4, as it should). The N8-a mouse refocus passes, iOS/Android/reduced.
- `curve8`: row 11/3, highlighted 11/3, popup 9/3.
- Popup-open 20/20.
- Dust: 0 frames over text; worst lift→move 117ms (a parallel-load run gave 187; re-run alone 117).
- Rows 56.00px; tap delay 1.6ms; hand-off 0/5,184 (4/4).
- Haptic: 0 focus frames and 0 document clicks; overlays stay open; reduced motion still ticks.
- `tap8`: 1 toggle per tap.
- **Impeccable baseline 3.**

**Visit gate (`vtest.js`): 74/74** in both motion modes. Covers:
- V1–V17: visit, un-visit, cancel, back-off, flick, flick-never-unvisits, impression fixed, hand-off, starred+visited, rapid strokes, tap-after-stroke, tap delay, raised, ink-over-text, letters, popup sync, thunk.
- D1–D10 (delete safety):
  - still tap and 3px deletes;
  - 4/6/8/12/20/40px hesitant strokes don't;
  - right, vertical and full visit strokes don't;
  - an X tap at 0ms after a stroke doesn't, and once the X is back it does;
  - a mouse 8px drag doesn't, a mouse still click does;
  - keyboard Enter does;
  - the EDGE 24 stroke from x=372 is inert.

## Strips

- `p1-visit-3x.png`, `p1-visit-4x.png` (stamp column), `p1-visit-1x.png`
- `p1-unvisit-3x.png`, `p1-unvisit-1x.png`
- `p1-cancel-3x.png`
- `p1-ios-overlays-1x.png`

## Dials

- `LIFT_SCALE` 1.15 (1.1–1.2)
- `CARRY_INK` 0.55 (0.45–0.7)
- shadow alpha 0.16–0.30
- squash 0.93 (0.92–0.95)
- `PRESS_MS` 220
- `GHOST` 0.3
- `HYST` 4
- `DELETE_TAP_SLOP` 4 (3–6)
- feather 20px

## For the iPhone checks (proposed text for CLAUDE.md)

1. **(Gate)** A left stroke from the X or the row's right half stamps. A hesitant 4–12px nudge on the X never raises the delete confirm, and a still tap still does.
2. The carried stamp reads as held above the page (shadow and size), not as a faded stamp.
3. The press reads as a thunk with no haptic (iOS 27): contact, squash, field, all in one beat.
4. The pressed stamp never slides with the finger.
5. Un-visit reads as the stamp picked straight up.
6. Long names: the tail feathers ahead of the stamp. There is no letter pop at release, and there is no pop when the wider row is revealed on un-visit.
7. A stroke from the X's outer third belongs to Safari's forward swipe, as expected (EDGE 24).
8. On Android or iOS ≤26.4, you get a tick on the press and a double tick on the lift. On iOS 26.5+ a swipe is silent (the platform limit).

## Not done (optional per the CD)

- A teaching replay from the popup's Mark Visited.
