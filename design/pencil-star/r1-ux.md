# Star action (star2), round 1: UX review of the Pencil Star

Reviewer: senior UX. I drove my own touch paths through CDP `Input.dispatchTouchEvent` against `r1-proto.html` at 390px, and compared against `/home/user/triplet/index.html` where a baseline matters.

- **Scripts:** `star2/ux-touch.js`, `ux-touch2.js`, `ux-touch3.js`, `ux-touch4.js`.
- **Also reviewed:** the designer's filmstrips (star, unstar, cancel, reduced).
- All numbers are Chromium's. What only WebKit can settle is listed at the end.

## Verdict

**Right concept. Approve the direction. It is not ready for the CD until S1–S3 are fixed.**

The Pencil Star is the best of the five concepts, and it meets the owner's bar:
- One stroke, with no chrome at rest.
- The feedback *is* the mark, drawn where it will live.
- A felt detent, plus the ability to back off and cancel.
- 0ms of added tap delay.
- A metaphor from this app's own world.

Three measured defects stand between it and "effortless", and none of them is conceptual:
- **S1:** a tap right after starring is swallowed.
- **S2:** there's a dark press-flash at the start of every stroke.
- **S3:** diagonal scrolls that the list handles today now go dead.

## Measured (my runs)

| Path | Result |
|---|---|
| Straight right-and-up drags of 100px at 20°, 25°, 30° and 33° from horizontal | star (these are horizontal swipes, so correct) |
| The same at 36° and 40° | **no star and no scroll (dead)** |
| The same at 50° | scrolls 70px |
| `main`, same drags at 36° / 40° / 45° | scrolls 0 / **58 / 65px** |
| Thumb arcs starting at 35°, 45° or 55° and bending to vertical (5 paths) | never star; the up-arcs scroll 156–161px |
| 12px sideways, then a 150px scroll up | proto **0px scroll** (the lock eats it); `main` 166px |
| Drag starting at x = 20 or 23 | inert |
| Drag starting at x = 25, 30 or 40 | stars |
| Drag starting 2, 6 or 10px left of the delete X, going right | nothing: no star, no delete (touch adjustment routes the touch to `.delete-btn`, which is excluded) |
| Stationary tap 3px left of the X | delete confirm. This is the pre-existing touch-adjust zone, not new. |
| Star, then tap a **different** row after 60ms | **no navigation** (`main` navigates at 60ms) |
| Star, then tap the **same** row after 60 / 250ms | **no navigation** (it navigates from about 450ms) |
| Press class during the stroke | `.active` stays on for finger travel 0–12px (about 50ms), then clears at the lock |
| Flick commits | 45–65px in 30–100ms all star. Unstar flicks are slightly inconsistent at the boundary (45px/60ms failed; 45/40 and 55/60 passed). |

## Answers to the ten questions

1. **Travel: 56px of content (66 of finger) is right.**
   - That is about 12mm on a 390pt iPhone: comfortably inside one thumb stroke for either hand, starting mid-row.
   - It is far less than a Mail full-swipe, and 6.6× the 10px lock.
   - Vertical scrolls and arcs never star. Only swipes flatter than about 34° star, which is intentional.
   - The problem is not accidental stars. It is **lost scrolls** (S3).
2. **Discoverability: needs one quiet teaching moment (S4).**
   - The owner knows the feature exists; Erica doesn't.
   - At rest there's nothing, which is correct.
3. **Undo and confirmation: good on a drag, risky on a flick (S5).**
   - The live eraser preview shows the result before release, and backing off cancels. That makes "same stroke unstars" clear.
   - A flick commits before the preview can be read.
4. **Delete safety: no new risk.**
   - Drags that start on or near the X do nothing, and drags ending on the X only star (the designer's test; consistent with a touch drag never producing a click on the X).
   - The only way to reach delete is still a stationary tap in its touch-adjust zone, which is pre-existing and backed by `confirm()`.
5. **Press darkening: real on every stroke.** See S2.
6. **Edge guard at 24px: correct.**
   - It is ≥ the 20px web convention and about 1.8× the reported 13pt system zone. It never `preventDefault`s, so Safari's back-swipe stays intact.
   - Starting inside the guard, the row simply doesn't respond. Since the natural start is on the name (x ≥ 56), almost nobody will feel it.
   - Don't add "give" there. Anything that moves the row would compete with Safari.
7. **Other interactions: fine, apart from S1 and S3.**
   - There is no sheet drag in `main`: the only row touch listeners are the passive press handlers, and the sheet collapses via a button.
   - The list sits outside the Leaflet container.
   - A row drag doesn't cancel a pending list-tap popup, which is fine.
   - Scroll-then-tap still navigates (the designer's case).
8. **Accessibility: acceptable.**
   - The popup star is a real toggle button with `aria-pressed`, so it is a complete non-gesture path. The web has no VoiceOver custom actions, so it has to be.
   - Reduced motion is handled correctly: motion the finger drives still follows the finger, and nothing moves on its own.
   - The `.sr-only` single source is unchanged.
9. **Map: 2 taps (pin, then star) is acceptable.**
   - After a list tap the popup is already open, so it's 1 tap there.
   - A map-side gesture (long-press on a pin) would fight Leaflet's drag and contextmenu for little gain.
10. **Rejected concepts: none beat it.**
    - **B** needs a second tap or a 234px swipe, and it reveals chrome.
    - **C** spends the stamp metaphor, which means *visited*, and is at least 450ms.
    - **D** costs +250ms on every tap, or mis-stars on re-taps.
    - **E** puts a target beside delete.
    - One thing to keep from the exploration: **leave the leftward stroke inert** (the 6px "no" give) and reserve it. Don't spend it on anything now.

## Findings

### Blockers

None.

### Should-fix

**S1. The next tap after a star is swallowed.**
- Measured:
  - A tap on another row 60ms after release does nothing, where `main` navigates.
  - A tap on the same row does nothing until somewhere between 250 and 450ms.
- "Star it, then open the next one" is the owner's exact flow, and a dead tap reads as "the app ignored me".
- **Two causes:**
  1. The 400ms `suppressClickUntil` window blocks the same row.
  2. Something during the settle/optimistic re-render blocks *other* rows; my guess is that a card touched mid-settle is re-rendered.
- **Fix:**
  - Replace the time window with a one-shot flag that eats only the drag's own click. Touch rows already drop it via `touchMoved`.
  - Make sure no row except the dragged one is replaced during the settle.
- **Re-test:** a star, then a tap at 0, 60 and 150ms on another row, and at 60 and 150ms on the same row, must all navigate.

**S2. A dark press flash starts every stroke.**
- `.active` (`--paper-pressed`) is on for the first ~12px (about 50ms) and then clears at the lock.
- So every star begins with a dark blink before the pencil appears.
- **Apply the 80ms press delay now, not as a fallback.**
  - Add `.active` after 80ms of no movement past the lock threshold.
  - If `touchend` arrives first, show the press for ~100ms on release, so quick taps still acknowledge.
- This also removes the same blink from flick-scrolls, which the owner's pending iPhone check asks about.

**S3. The dead zone for diagonal and sideways-starting scrolls.**
- `.location-card { touch-action: pan-y }` makes Chromium refuse any pan whose first movement is horizontal-dominant.
- Swipes at 36–45° now neither scroll nor star: `main` scrolls 58–65px at 40–45°, while the proto scrolls 0.
- A scroll that begins with 10–12px of sideways thumb travel is captured by the lock and goes nowhere (166px on `main` → 0).
- WebKit may behave differently, so **make this iPhone check #1.** Flick-scroll the list with a loose thumb 20 times; if even one sticks, fix it.
- **Fix (if needed):** drop `pan-y`; keep `touch-action: auto` and add a non-passive `touchmove` that calls `preventDefault()` only once the horizontal lock has engaged. This is the standard iOS-web swipe pattern.
  - **(a)** Also hand off to scroll whenever |dy| ≥ 8 before the lock, not only when |dy| ≥ |dx|, so the 34–45° band scrolls instead of dying.

**S4. Teach it once, in place.**
- The first 3 times a star is set **from the popup** while the list is visible, play a ~400ms ghost stroke on that place's (highlighted) row: the name eases 16px right, the graphite star traces, and it settles back.
- That demonstrates, on the actual row, "you can do this here".
  - It is gated by `prefers-reduced-motion`. Under reduced motion, show a one-line toast instead: "Tip: drag a place right to star it".
  - It runs per device (`localStorage`, try/catch).
  - After that, nothing: no permanent hint and no coach-mark.
- That covers Erica without cluttering any row.

**S5. Unstar requires the detent; a flick only stars.**
- The erase preview is what makes "same stroke unstars" safe, and a flick skips it.
- Removing something the owner "really cares about" is the costly direction, so let flick velocity commit **star** only.
- Unstar needs the full 56px, where the eraser dust has visibly happened.
- This asymmetry costs a few px on a rare action and removes the only unseen mis-unstar path.

### Nits

- **N1.** Mid-trace, the 12px pencil is a squiggle. That's fine while moving (it's under the thumb's motion and always resolves), but the CD should judge the 24–38px frames at arm's length.
- **N2.** Don't ship the pencil-tick sound. The owner didn't ask for it, and audio in a trip app used in quiet museums is a surprise. Revisit only if the detent doesn't read on-device.
- **N3.** Shape rows ignore the stroke entirely. That's correct (no column), but give them the same 6px "no" give as the wrong way, so a drag feels acknowledged rather than broken.
- **N4.** Mouse drags (desktop rail) have no edge guard. That's fine, but the one-shot click flag from S1 must cover mouse too.
- **N5.** Flick commit is slightly inconsistent at the boundary (see the table). It is acceptable, and moot for unstar once S5 lands.

## What only an iPhone can confirm

1. Diagonal and loose-thumb scrolling isn't sticky (S3). **This decides whether `pan-y` stays.**
2. A right drag starting at x ≈ 24–40 isn't claimed by Safari's back-swipe.
3. After S2, no dark blink at stroke start, and taps still visibly press.
4. After S1, star → immediate tap on the next place navigates.
5. The detent bloom reads beside a thumb in daylight, and the 1px graphite reads as pencil, not as a rendering fault.
6. The pencil-to-printed-star hand-off doesn't flicker (WebKit, `text-indent` plus dash animation).

---

# Round 2

Reviewer: senior UX. I verified `r2-proto.html` with my own CDP touch paths and mouse paths at 390px, comparing against `main` where a baseline matters.

- **Scripts:** `ux2-touch.js`, `ux2-flick.js`, `ux2-popup.js`.
- **Also reviewed:** the r2 filmstrips (star, unstar, teach, popup), the 4x mid-star/mid-unstar still, and the 1x strip.

## Verdict

**Ready for the CD. No blockers, and one should-fix.**

- All five round-1 findings (S1–S5) are fixed and hold up under my own paths.
- None of the regressions I checked for showed up.
- Mid-stroke direction is now readable in a single still.
- The one visible craft wart is the re-truncation "pop" on the final settle frame. See R2-S1.

## Verification (my runs)

| Check | Result |
|---|---|
| **S1**, touch: star then tap, 0 / 60 / 150ms, other row and same row | **6/6 navigate** |
| **S1**, mouse: drag-star then click another row, 0 / 60 / 150ms | **3/3 navigate** |
| **S2**, 50ms tap | Press shows on release at 71ms for about 100ms. Navigation fires at 73ms, so there is no delay. |
| **S2**, 300ms hold | Press at 113ms (80ms plus CDP latency) |
| **S2**, stroke | Never shows a press |
| **S3**, diagonal 34 / 36 / 38 / 40 / 45 / 50° | r2 scrolls 0 / 0 / 0 / 58 / 64 / 70px. **`main` is identical: 0 / 0 / 0 / 58 / 64 / 70.** None star. |
| **S3**, 12px sideways then up | r2 167px, `main` 156px |
| **S3**, plain vertical | r2 162px, `main` 161px |
| **S5**, full 80px stroke on a starred row | Unstars |
| Flicks | **Not testable in real time here.** CDP delivers a touchmove about every 45ms, so my "flicks" were really 0.2px/ms drags (`ux2-flick.js`). The designer's synthetic-timestamp cases are the only evidence. |
| Delete: drag starting 2 or 8px left of the X | No delete, no star |
| Delete: drag ending on the X | Stars, no delete |
| Plain tap on a row | Navigates |
| Popup-open fix, with the real `highlightMarker` | Row tap from z12 → Café Pascal's popup opens |
| Starring a row by stroke while its popup is open | The popup's star turns `aria-pressed=true` |
| Popup star rapid taps | 2 taps 120ms apart → the data follows each tap. 3 taps at 90ms → net one toggle. `aria-pressed` flips on the tap, not after the animation. |

## Answers

1. **The S1–S5 fixes:**
   - **Quick taps feel instant.** Navigation isn't delayed. The on-release press matches iOS table cells, where a short tap highlights on lift.
   - **The 80ms hold delay is right.**
   - **Diagonal scroll.** In my runs it matched `main` exactly; the designer's "up to 10px shorter" did not reproduce. Even 10px on a 60px fling is below what anyone would notice, and iOS momentum dominates. **Acceptable.**
   - **Teaching replay.** It is right: capped at 2 plays, only when the row is on screen, and it plays on the focus row (`r2-film-teach.png` shows it on highlighted Stockholm). The reduced-motion version (a static sketch, then the ink by opacity) is correct.
   - **Flick asymmetry.** It is clear enough. A flick on a starred row shows the rub starting and then springing back, which reads as "not far enough", not as "broken". The owner then drags a bit further. It is untestable in real time here, so it's an iPhone check.
2. **Direction mid-gesture: yes, it's clear.** Starring is crisp straight graphite strokes building an outline, which reads as a Λ by 12px. Unstarring is a *filled* star that greys, gets grainy and erodes inside a smudge. Outline versus fill separates them even at 1x (content 12–38 in `r2-1x-armslength.png`).
3. **Name slide:**
   - Moving the name as a block under a clip is the right fix: no per-frame re-truncation any more.
   - **The re-truncation on the last settle frame is visible** (R2-S1). In `r2-film-unstar.png`, "…of Pe…" becomes "…of Perfo…" between +170 and +220ms: three letters appear in the one frame where the eye has just come to rest. The star direction has the mirror effect, with letters vanishing at rest.
   - The hard clip also slices glyphs mid-air, 12px before the stamp or X (N-a).
4. **Graphite at 1x: 3.67 is legible enough.** By content 25–50 the 1x marks read as a star. The owner's iPhone is 3x (4.96–5.53), so 1x only matters on a desktop rail. Accept it.
5. **Popup star: doesn't slow repeated use.**
   - The state (`aria-pressed`, data) flips on the tap, the animation doesn't block further taps, and it plays once.
   - The only cost is visual: the ink lands at 220ms.
   - **Nit:** at tap +0 the hollow star vanishes and the slot is empty until the first stroke at 40ms (N-b).
6. **Regressions: none.**
   - Row tap navigates, the popup-open fix opens popups, and delete can't be triggered by a stroke.
   - There's still no sheet drag.
   - The scroll-then-tap behaviour is intact (S1 matrix).

## Findings

### Blockers

None.

### Should-fix

**R2-S1. Move the re-truncation to release, not to rest.**
- At `touchend`/commit, swap the row into its final layout straight away: printed star in or out, final truncation.
- Then animate the name from the dragged offset to 0 (FLIP: measure, invert, play).
- The text then changes on the frame the finger lifts, when the name is moving fastest, instead of on the settled frame.
- **Re-shoot `r2-film-unstar.png`.** The last 3 frames should show identical glyphs.

### Nits

- **N-a.** Feather the clip edge with an 8px `mask-image` gradient instead of a hard `clip-path`. The name should read as slipping *under* something, not being sliced in mid-air.
- **N-b.** Popup: keep the hollow star until the first graphite stroke appears, or start stroke 1 at 0ms, so there's no empty-slot frame on tap.
- **N-c.** The non-passive `touchmove` sits on every row. It is fine in Chromium (scroll distances match `main`). On iOS, confirm there's no scroll jank on a 190-row list.

## Carry-forward iPhone checks (additions)

1. `touchmove` stays cancelable for a horizontal stroke in iOS Safari, so the lock and `preventDefault` actually engage. This is **the #1 check**; if it fails, the gesture never arms.
2. A real flick (not a drag) stars, and a real flick on a starred row springs back.
3. After R2-S1, no letter pop at the end of the settle.
4. A quick tap's on-release press reads as a press, not a flash.

---

# Round 3

I re-ran my own scripts against `r3-proto.html`, as copies re-pointed at it (`me3-ux2-touch.js`, `me3-ux2-popup.js`), not the designer's `r3-ux2-*` copies. I also wrote a new FLIP and feather probe (`me3-flip.js` → `me3-flip-*.png`).

## Verdict

**Approve. No blockers and no should-fixes.** R2-S1 and N-b are fixed. N-a is fixed as the feathered mask.

## Verified

| Check | Result |
|---|---|
| **FLIP (R2-S1)** | Long visited names, star and unstar: the row crop at release +200ms and +260ms is **byte-identical** to +600ms. The final truncation ("…of Perfo…") is already in place by +120ms, while the name is still sliding, so no letters change at rest. The drag's `h3` is replaced on the release frame, as designed. |
| **Feather (N-a)** | `.row-main` computed `mask-image: linear-gradient(to right, #000 calc(100% − 8px), transparent)`. The +5ms frame shows the name fading under the edge, not sliced. |
| **Taps after a star (S1)** | Touch: other and same row at 0 / 60 / 150ms, **6/6 navigate**. Mouse: 0 / 60 / 150ms, **3/3 navigate**. |
| **Press (S2)** | A 50ms tap presses on release (58ms) for 100ms; navigation at 59ms. |
| **Diagonal (S3)** | 34–50°: r3 scrolls 0 / 0 / 0 / 58 / 64 / 70px; `main` 0 / 0 / 0 / 58 / 64 / 71px. Sideways-then-up: 166 vs 167px. Plain vertical: 156 vs 163px (run-to-run noise; round 2 measured 162 vs 161). No stars. |
| **Delete** | A drag starting 2 or 8px left of the X: no delete, no star. A drag ending on the X: stars, no delete. |
| **Popup** | Row tap → popup opens. A row stroke updates the popup star. Rapid taps each register. |
| **Flicks** | Still untestable in real time here (CDP delivers a touchmove about every 45ms). The designer's synthetic-timestamp cases stand. |

## The 16px clearance

**It isn't late or unresponsive.**
- The name starts moving 1:1 at the lock, so the row answers the finger immediately. The pencil is the *second* layer of feedback, not the first.
- The first graphite appears at content 16, which is about 26–31px of finger travel including the lock. That is under 40% of the way to the 56px commit. The Λ is complete by content 24.
- The clearance buys a clean first stroke that never collides with the name's first glyph (a 4.23px minimum gap). That's worth more than an earlier squiggle.

## The rub-out ghost at 1.41–1.51:1

**Not a usability problem.**
- It is a transient preview under a moving finger, not a state. Nothing has to be read from it to decide or complete anything.
- Its low contrast *is* its meaning: "almost gone".
- WCAG 1.4.11 is about the contrast of UI components and of graphics needed to understand content. Both resting states pass: the printed star is ≥ 4.30:1, and "no star" leaves only the name.
- One thing to confirm on the iPhone: that the unstar **commit moment** (the ghost vanishes and the dust falls at 56) is noticeable in daylight. The ghost going to nothing is a small visual change. The name's position and the dust carry it, and backing off still restores the ink, so a missed cue costs nothing.

## iPhone checks (additions)

1. No flicker from `mask-image` on a transformed child, and the FLIP swap on release is invisible at 120Hz.
2. The unstar commit cue (ghost to gone, plus dust) is noticeable in daylight.
