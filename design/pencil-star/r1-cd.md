SCORE 6/10

# Star action (star2), round 1: CD review of the Pencil Star

Reviewed at 3x (filmstrips), at ~4x (`r1-crops-4x.png`, `r1-film-4x.png`) and at 1x-equivalent arm's-length reads. I also checked the prototype's CSS and JS (`r1-proto.html`, from line 1596 and from line 3833) against what the frames show. I cannot play the .webm files, so I judged motion from the filmstrips, the contact sheets and the code's timing values.

## Verdict

**The concept is right. The execution is not yet special.**

A right-stroke that writes a star into the guidebook margin is the correct answer to the owner's brief:
- It is one interaction.
- There is no chrome at rest.
- The feedback is the mark itself, drawn where the mark will live.
- The metaphor comes from this app's own world.

I would keep it, and none of the rejected concepts beats it.

But this prototype does not yet deliver what it promises. The owner will judge it frame by frame with their thumb on the glass. What they would see today:

- **"Pencil" is only a label.** The stroke is a uniform, round-joined 1px vector outline (`.sg-pencil`: `stroke-width:2`, round joins and caps, no texture). It reads as a thin UI icon being drawn, not as graphite. Nothing tells the eye "pencil" except the grey colour.
- **About 75% of the stroke shows an unreadable glyph.** At content 14, 28 and 42, the half-traced 12px star reads as a tick, a lightning bolt, then a broken star. The designer flagged this, and it is worse than "intended". The one legible frame is the finished star, so the "being drawn" narrative never lands at this size.
- **The reward frame is the weakest frame.** At the detent, the 90ms opacity crossfade overlaps the 1.33× bloom. At bloom peak, both layers are partly transparent, so the star shows as a pale tan fill inside a grey outline. You can see this in `r1-crops-4x.png` ("detent: inked, bloom peak") and in the reduced-motion content-56 frame. The moment of commitment looks faded rather than inked. On the Stockholm highlighted row it is a beige smudge.
- **Star and unstar look the same halfway through.** The rub-out is the trace run backwards: compare the star and unstar frames at content 28. The eraser is three 2px dots at the very end. Mid-stroke, the owner cannot tell "I'm adding" from "I'm removing" by looking. Only the direction of change tells them. That undercuts the claim that the live preview makes "same stroke unstars" safe.
- **The name reflows instead of moving.** Because the drag is driven by `text-indent`, a long name gets eaten live as you drag: "Swedish Museum of Pe…" → "Swedish Muse…" → "Swedish Mus…". That reads as text re-laying out, not as a physical slip moving. Clear's rows feel like objects because they translate. Ours looks like typing.
- **The unstar starts before any travel.** At content 0 (the 10px lock), the printed star already drops to a pale ghost. The row changes state before the user has committed to anything.

None of these defects is conceptual. All of them sit in exactly the craft layer the owner scores on. The previous 9 was rejected as "very average". Right now this is a good idea rendered averagely, so it is not a 9.

## Material: pencil, print, stamp or punch?

**Keep a hand-made mark. Don't use a stamp or a punch.**
- **The stamp already means *visited*.** A second stamp would blur the app's clearest symbol, and the owner has signed off on that stamp as the benchmark.
- **A punch** reads as "used/cancelled" (a ticket), which is closer to visited than to "I want this".
- **The traveller's own hand** is the one layer of this world that doesn't exist in the app yet. Printed = the guide's facts. Stamped = where you've been. Handwritten = what *you* care about. That three-way grammar is the intentional, unique part. Keep it and make it legible.

**Pencil-then-ink is right, but it has to *look* like that.**
- Graphite means "provisional while your finger is down". Ink means "committed".
- The committed state can stay the approved printed `--figure-deep` star. Inking over a pencil sketch is a real practice, so the hand-off is coherent. It only has to be visibly *ink arriving*, not a crossfade.

## What's working

- **One stroke, no chrome, 0ms tap delay** (measured). Leftward is inert and held in reserve.
- **The travel and threshold are right.** 56px of content (66px of finger, about 12mm) is inside one thumb stroke and 6.6× the lock. Rubber-banding past the detent at ×0.35 feels like the right resistance.
- **The settle is the best moment in the film.** The name glides back 40px and docks against the star it just made. That is the "result of the gesture" the brief asked for.
- **The hand-off is exact.** The pencil sits inside the printed star's box: 0 of 2,916 pixels differ, on both paper and highlighted rows.
- **Edge guard.** The 24px guard is researched from WebKit source, not assumed. It never calls `preventDefault` on touchstart, and a `pointercancel` reverts cleanly.
- **Reduced motion is modelled correctly.** Motion the finger drives still follows the finger; nothing moves on its own.
- **Contrast.** Every mark clears 3:1 in all 5 cities. The name stays ≥13:1. Rows stay 56.00px at every drag step.

## Rejected concepts

None is better. B (luggage tag) is the Mail baseline wearing a costume. C spends the stamp. D taxes every tap by 250ms. E sits next to delete.

## UX findings: rulings

- **S1 (a swallowed tap after a star): ACCEPT, blocker for round 2.**
  - Replace the 400ms `suppressClickUntil` with a one-shot flag that eats only that drag's own click, for touch and mouse alike (N4).
  - Guarantee that no row other than the dragged one is re-rendered during the settle.
  - "Star, then tap the next place" is the owner's core flow.
  - Re-test with UX's matrix: 0, 60 and 150ms on another row, and 60 and 150ms on the same row.
- **S2 (press flash at stroke start): ACCEPT.**
  - Apply the 80ms press delay now, with a release-time press of about 100ms so quick taps still acknowledge.
  - It also answers the pending flick-scroll blink check.
- **S3 (dead diagonal scrolls): ACCEPT, and fix it unconditionally. Don't wait for an iPhone.**
  - A measured 150px scroll going to 0 is a regression in the app's most frequent action.
  - Use `touch-action: auto`, plus a non-passive `touchmove` that calls `preventDefault()` only after the horizontal lock. Also hand off to scroll whenever |dy| ≥ 8 before the lock (fix (a)).
  - The iPhone check becomes confirmation, not decision.
- **S4 (teach the gesture): ACCEPT WITH CHANGES.**
  - Keep the ghost stroke on the row after a popup star, but cap it at **2** plays, not 3, and only when that row is actually on screen. Otherwise skip it and don't count it.
  - The ghost must use the round-2 rendering. A ghost of today's scribble would teach the wrong thing.
  - **No toast under reduced motion.** A toast is chrome. Instead, show the pencilled star statically in the gap for about 1s and fade it out. Opacity only is acceptable under reduced motion.
- **S5 (flick can star but not unstar): ACCEPT.** Removal must pass through the visible erase at the detent.
- **N2 (no sound): agreed.** **N3 (6px give on shape rows): accept.**

## Directions for round 2, in order

1. **Make the mid-stroke legible at 12px.** Stop tracing a 10-vertex outline progressively; a partial outline of a 12px star will never read. Pick one of these, and show both at 4x before choosing:
   - **(a) Stroke order a person would use.** The classic five-stroke pentagram, one straight line per ~11px of travel. Each partial state is a set of 1–4 clean straight strokes crossing at the star's points, recognisable as "a star being drawn" from stroke two. The final inked mark is still the approved filled star. Only the provisional sketch is a pentagram, which is exactly what someone pencils in a margin.
   - **(b) Use the gap as the canvas.** Draw at about 20px in the 56px of space the name has vacated. On release, the inked star shrinks into the 12px printed slot as the name docks. The shrink doubles as the "ink sets" beat.

   Either way: the first 10px of content must already show something recognisably starry, not a tick.
2. **Make graphite look like graphite.**
   - Give the pencil stroke a grain: a static SVG `feTurbulence` + `feDisplacementMap` (or a mask), no JS. Keep a slight pressure taper and ~85% opacity, so it reads as soft pencil beside the crisp printed type.
   - Verify it at 3x OLED-equivalent and at 1x (the visited stamp's 1x lesson). It must still clear 3:1.
3. **Rebuild the ink moment so the peak frame is the strongest frame.**
   - The fill reaches 100% opacity at or before the scale peak. Snap it, or complete it in ≤30ms.
   - Then a short press-in: scale 1.2 → 1, with a single 1-frame ink "spread" (a slightly larger fill that contracts). This is an ink landing, not a bouncy UI bloom.
   - Show me the bloom-peak frame at 4x on paper, filed and highlighted Stockholm. No crossfade mud anywhere.
4. **Give unstar its own material.**
   - The printed star must not change at lock. It starts to go only as travel begins.
   - Then the ink visibly lightens to graphite and gets **rubbed**: the grain density drops unevenly, and a smudge (a low-opacity blur of the star) widens slightly. The fragments disappear from the star's edges inwards, not in trace order.
   - Mid-unstar must be distinguishable from mid-star in a single still frame. That is the test.
   - The eraser crumbs land at the end, drift at most 2px, and are gone within 200ms. Under reduced motion they simply aren't drawn.
5. **Move the name as an object, not as reflowing text.**
   - Translate the name/meta block with `transform` and clip it at the stamp's or X's left edge, so the ellipsis position is fixed for the whole drag (the words slide under a mask; they are not re-truncated).
   - If you keep `text-indent` for some reason, prove in a filmstrip that a long visited name doesn't visibly re-truncate on every frame.
6. **Land S1, S2, S3, S5, S4-as-amended and N3.** Re-run the full suite, plus UX's diagonal and arc matrix. The 34–45° band must scroll.
7. **Popup star.**
   - Use the same new pencil → ink rendering at the popup's 20px, where legibility is easier. It must play exactly once and not replay on the refetch.
   - Show a filmstrip of it.
8. **Deliverables.**
   - Filmstrips at 3x: star, unstar, cancel at 20 and 50, flick, highlighted Stockholm, visited row, and reduced motion.
   - A side-by-side still of mid-star and mid-unstar at 4x.
   - The bloom-peak frames at 4x.
   - A 1x arm's-length strip.
   - A 6-frame contact sheet from the real-time video at 16ms spacing around the detent, so I can see whether the peak is crisp in motion and not only in the stills.
   - Impeccable: exactly the 3 baseline findings.

The bar for a 9: every frame of the stroke reads as a person pencilling a star into a guidebook; the commit looks like ink landing; the rub-out looks like rubbing out. The owner should want to do it twice just to watch it.

## What only an iPhone can confirm (carry forward)

1. Loose-thumb flick scrolls never stick, after S3.
2. Right-drags starting at x = 24–40 aren't claimed by Safari's back-swipe.
3. The graphite grain reads as pencil, not as a rendering fault, on a 3x OLED.
4. The ink landing reads beside a thumb in daylight.
5. No flicker at the pencil → printed hand-off in WebKit (transform plus mask).

---

# Round 2

SCORE 8/10

## Verdict

**A big step up.** This now looks like a person pencilling a star into a guidebook, and the ink landing is right. Every round-1 direction was taken seriously, and the core craft has landed:
- The five-stroke sketch reads as a star from stroke two.
- The grain reads as graphite at 3x and 4x.
- The ink peak is the crispest frame. The real-time screencast shows frame 1 at 100% ink, 1.2×, with no mud.
- Mid-star and mid-unstar are unmistakable in one still (outline strokes vs a filled, greying blot).

**It is not a 9 yet.** Checked frame by frame at 4x, 3x and 1x, I found five visible defects, two of which the owner would hit on nearly every stroke:
1. The first stroke collides with the name and reads as a character.
2. The hard clip slices letters on every long name.

None of them needs a new idea. All are finishing. The owner has twice caught what reviewers waved through at normal zoom, so I am not approving with these on screen.

## Round-1 directions, checked frame by frame

| # | Direction | Result |
|---|---|---|
| 1 | Star reads at every stage | **Mostly.** Content 18–50 is excellent: a Λ, then a Λ with a crossbar, then a star, and the −7° lean is a lovely human touch. **But content 6–12 fails.** The first stroke is drawn 1–2px from the name's first glyph, so it reads as typography: "/Café Pascal" (`r2-film-star.png` at 8; `r2-film-teach.png` at +60ms; `r2-film-cancel50.png` at release +120ms), and "ΛCafé" at 1x (`r2-1x-armslength.png`, content 12). A slash or lambda glued to a word is a typo, not a sketch. |
| 2 | Real grain | **Yes** on the graphite. **No** in the first unstar frames: the grain is applied while the ink is still orange, so it reads as **glitter or sequins**. See `r2-4x-mid-star-vs-unstar.png` (unstar, content 8) and, most clearly, `r2-film-popup.png` at unstar +0ms. Glitter is the one material this world must never have. |
| 3 | Crisp ink arrival | **Yes.** It is the best frame of the gesture on paper, filed and highlighted Stockholm. The 17ms spread rim is subtle and reads as ink wicking. Approved as is. |
| 4 | Rub-out distinct from the draw | **Distinct, yes. Honest, no.** The star is visually gone by content 44–50 (`r2-film-unstar.png`; the 1x strip at 50 is empty), but the commit is at 56. Let go at 50 and a star you watched disappear comes back. The preview lies in the costly direction, which is exactly what S5 was protecting. |
| 5 | Name slides as a block | **Correct mechanism, raw edge.** The hard `clip-path` guillotines glyphs mid-letter on every long name ("Museum of Pe.", "Museum o(", "Museur"), and at 3x that looks like a rendering bug. Also the settle pop (UX R2-S1). |
| 6 | UX fixes | **All verified** by UX's own paths: S1 6/6 and 3/3; S2 timings; S3 matches `main` exactly; S5; S4 teaching as I amended it; N3. |
| 7 | Popup matches | **Yes**, with two defects: the empty slot at tap +0 (N-b), and the glitter at unstar +0. |

## Rulings on UX round 2

- **R2-S1: ACCEPT.** Apply the final layout at release and FLIP from the dragged offset. The glyph change must happen on the release frame, never on the rest frame.
- **N-a: PROMOTE to must-fix.** At 3x it is the second most visible defect in the film.
- **N-b: ACCEPT.** Start stroke 1 at 0ms, or hold the hollow star until the first stroke.
- **N-c: accept as an iPhone check.**
- **The "up to 10px shorter scroll": closed.** UX measured parity with `main`.

## Directions for round 3, in order

1. **Clear the name before the first stroke.**
   - Measure the gap between the sketch's bounding box and the name's first glyph box at every content px.
   - No graphite may render until that gap is ≥ 3px. Remap the five strokes into the travel that has clearance: about 14 → 50 instead of 0 → 50, keeping the front-loading (Λ within about 8px of the first stroke).
   - Stroke 1 also starts from its lower-left end, farthest from the name.
   - Deliver 4x frames at content 6, 10, 14 and 18, plus the 1x strip, on "Café Pascal" and on a name starting with a tall capital and a narrow glyph ("Järntorget", "Ítalía"). Nothing may touch or kiss a letter.
2. **Kill the glitter.**
   - On unstar, colour goes first: ink → `--ink-2` graphite over content 0–10, with no grain.
   - Grain fades in only once the colour is at least 80% graphite.
   - The popup rub follows the same order within its 240ms: colour for about 70ms, then grain and erosion.
   - Deliver 4x stills of unstar content 4, 8 and 12, and popup unstar at +0, 20 and 40ms. No orange speckle in any frame.
3. **Make the rub-out honest about the detent.**
   - Remap the erosion so a recognisable ghost remains up to the detent: star silhouette at ≤25% coverage, still visibly a star at 1x.
   - The last remnant goes, and the dust appears, **on the 56px frame**, and not before.
   - Symmetric with starring: the sketch is whole before the detent, and the ink *is* the commit.
   - Deliver unstar frames at 44, 50, 54, 56 and 60 at 3x and 1x, plus cancel-at-50 on a starred row (the ghost fills back in).
4. **Feather the clip (N-a).**
   - Use an 8px `mask-image` linear gradient on the name/meta block's trailing edge, so the words slip under the edge rather than being cut.
   - Keep the edge 12px before the stamp or X. The stamp and the X are never under the mask.
   - Check at 4x on the long visited name, and on highlighted Stockholm (the fade has to work on `--figure-deep` too).
5. **R2-S1: FLIP the settle.**
   - Re-shoot `r2-film-unstar.png`, plus a long-name *star* film. The last three frames must be glyph-identical, and the glyph change must be on the release+0 frame.
6. **N-b in the popup.** No empty frame at tap +0.
7. **Re-run everything.** Suite 76/76, Impeccable baseline 3, rows 56.00px, contrast in all 5 cities (including the unstar ghost at ≤25%, which must still clear 3:1 wherever it carries meaning; if it can't, say so), and a 1x strip.

**No new concepts, no extra motion, no sound.** If items 1–6 land exactly as specified and the frames show it, round 3 is where I expect to approve.

## What only an iPhone can confirm (updated)

1. `touchmove` stays cancelable for a horizontal stroke, so the lock engages (UX #1). If this fails, the gesture never arms.
2. Loose-thumb flick scrolls never stick. No jank on a long list with non-passive listeners.
3. Right-drags starting at x = 24–40 aren't claimed by Safari's back-swipe.
4. A real flick stars; a real flick on a starred row springs back.
5. `feTurbulence` grain in a mask under WebKit reads as graphite, not noise, on a 3x OLED.
6. The ink landing reads beside a thumb in daylight.
7. No flicker at the FLIP settle or the hand-off. `color-mix()` works in an SVG fill.
8. The 80ms press delay feels like a press, and the on-release press reads as a press, not a flash.

---

# Round 3

SCORE 9/10

## Verdict

**Approved.** This is the interaction I would stake my reputation on:
- One stroke across a row pencils a star into your own guidebook: the name steps aside, graphite becomes a sketch, and ink lands at the detent.
- The same stroke rubs it out: the colour fades to graphite, the grain comes in, the star erodes to a ghost, and the dust falls on the commit.
- Nothing sits on the row at rest, and taps are never delayed.
- It belongs to this app's world and no other: printed facts, stamped visits, pencilled wishes.

It clears the owner's bar for the right reasons: it is intentional, effortless, considered, and it has quiet whimsy in the right material.

It is not a 10, for two reasons. The unstar commit cue and the WebKit rendering of the grain and feather can only be proven on the owner's iPhone. And the first 16px of a star stroke show movement without a mark. That is acceptable (see below), but it is the one beat that isn't quite perfect.

## Round-2 directions, verified frame by frame

| # | Direction | 4x | 3x | 1x | Result |
|---|---|---|---|---|---|
| 1 | Name clear before the first stroke | `r3-4x-clearance.png`: no graphite at 6/10/14 on all three names; a clean stroke-1 tick at 18; a Λ at 22 with visible air; minimum gap 4.23px measured | long-highlighted at 20: a lone tick well clear of "Stockholm" | `r3-1x-armslength.png` 6/8/12: no "/Café", no "ΛCafé" | **Landed** |
| 2 | No glitter | `r3-4x-unstar-4-8-12.png`: smooth ink → brown → graphite with no speckle; `r3-4x-popup.png` +0/20/40 smooth, +70 flat graphite, grain only from +120 | honest film 8–12 smooth | — | **Landed** |
| 3 | Honest rub-out | ghost is a legible star at 44 and 50; dust only at 56 | ghost visible at 44/50/54, gone plus dust at 56, empty at 60 | ghost still reads as a star at 44/50/54 | **Landed** (contrast ruling below) |
| 4 | Feather, not slice | — | long unstar at 80 ("Museur", "STOCKHOLM" fading under); long highlighted at 56–80 fades on `--figure-deep`; stamp and X never under the mask | — | **Landed** |
| 5 | FLIP settle | — | long-unstar: final "Perfo…" is in place by +120 while the name is still sliding; +170/+219/settled identical; highlighted star the same; UX byte-identical at +200/+260 vs +600 | same | **Landed** |
| 6 | Popup: no empty slot | +0/+10/+20 keep the hollow star, and stroke 1 takes over at 40 | — | — | **Landed** |

Also rechecked:
- The ink peak (4x, content 56) is still the crispest frame.
- The handover to the printed star is 0 of 2,916 pixels.
- Rows stay 56.00px; the suite passes 88/88; Impeccable shows the 3 baseline findings.
- UX's independent reruns of S1, S2, S3 and delete safety all match `main`.

## On the 16px of motion without a mark

The name moves 1:1 from the lock, so the row answers the finger immediately. The sketch appears at about 26–31px of finger travel and is a Λ by content 24, under half-way to commit. A clean first stroke beats an early smudge on the name, which is exactly what round 2 got wrong. **Accepted.** Don't claw it back by overlapping the name.

## Ruling: ghost contrast (1.41–1.51:1)

**Accepted as a transient preview. It is not a 3:1 mark, and I no longer require 3:1 of it.**
- My round-2 "must clear 3:1 wherever it carries meaning; if it can't, say so" is answered: the designer said so, with reasons.
- The meaning, "almost gone, not yet committed", is carried redundantly by the name held aside and the absent dust.
- Both resting states pass: the printed star is ≥4.30:1, and "no star" is simply the name.
- Its faintness is the message.

**Dial, if the owner's daylight check fails:** raise the ghost to 0.35 opacity, with 0.45 as the ceiling. Past about 0.5 it stops reading as "almost gone" and starts to read as a state. Don't add any other cue.

## Implementation conditions

This goes into `index.html` on branch `claude/visited-state-badge-list-yultpy`. It replaces the previous popup-only star *interaction* while keeping the approved *display*.

1. **Port, don't re-author.**
   - Apply `build3.py`'s anchored patches (the round-2 build plus the round-3 patches) to the current `index.html`, with the same assertions. Every anchor must match exactly once; if one doesn't, stop and re-anchor rather than hand-merging.
   - What comes across:
     - CSS: the PENCIL STAR block (grain filter, ghost, feather mask, dust, press delay).
     - JS: `STAR_SWIPE`, `attachStarGesture`/`beginStarDrag`/`paintStarDrag`/`settleStarDrag`, `mountPencilStar()` with `textLeft()` clearance, `flipToFinal()`, and the teaching replay.
     - The dragged-row-only hold in `syncLocationCards()`.
     - `popupInkId` (plays once).
   - Constants stay as shipped: EDGE 24, LOCK 10 at more than 1.5× vertical, SCROLL 8, COMMIT 56, MAX 104 at ×0.35, FLICK 32px at ≥0.5px/ms (**star only**), clearance ≥3px measured per row, ghost 0.25 over 24–44, dust on the 56 frame.
2. **What stays:**
   - The printed 12px `--figure-deep` list star and its `.sr-only` ", starred".
   - The popup star button (`aria-pressed`, the 44×44 target, the 8px dead band). It is the **non-gesture and accessible path**, and only its animation changes: draw on star, rub on unstar.
   - The map pin star (ink on a paper halo), the cluster star rule and the stacking ladder.
   - `toggleLocationFlag()` (optimistic, `flagWritesInFlight`), which the gesture calls on commit.
   - The list-tap → popup-open fix (`openPopupOnArrival()`).
   - The add-form STAR toggle, unchanged.
   - No DB or RLS change.
3. **What goes:**
   - "Star…" mode leaves the Priority list.
   - The "Starring from the list — decided" ruling in `CLAUDE.md` is replaced by this one: a row stroke, with no per-row control, no batch mode, no long-press.
4. **Press behaviour changes app-wide:**
   - Touch rows now press after 80ms, or for 100ms on release for a quick tap. Mouse presses stay immediate.
   - This *applies* the "~80ms press delay" fallback that the press entry in `CLAUDE.md` listed as not pre-applied. Update that entry to say it shipped, and why.
5. **Touch plumbing:**
   - `touch-action: auto`, with a non-passive `touchmove` that calls `preventDefault()` only after the lock and only when the event is cancelable.
   - Never `preventDefault` on touchstart.
   - Only `.delete-btn` is excluded from arming.
   - The one-shot `eatClick` flag, never a time window.
   - Shape rows: a 6px give and spring back, and they never star.
   - Reduced motion: the finger-driven motion stays; release lands in 0ms; no dust; the teaching replay becomes a static sketch then opacity ink, with no toast.
   - `localStorage` for the 2-play teaching cap, wrapped in try/catch.
6. **Re-verify on the integrated `index.html`, not on the prototype:**
   - The 88-case suite with injected rows, plus UX's S1 and S3 matrices against the pre-change `main`.
   - Rows 56.00px; hand-off 0/2,916 pixels.
   - Contrast in all 5 cities.
   - Impeccable: exactly the 3 baseline findings.
   - Re-shoot one 3x film each of star, unstar and a long-name settle from the integrated build, and diff them against the r3 frames.
7. **`CLAUDE.md`:**
   - A new Shipped entry covering the design, the numbers above, the ghost-contrast ruling and its dial, the clearance rule, the colour-before-grain order, and the FLIP-at-release rule.
   - Update the star entry's toggle description and Needs-the-user's-action, with the iPhone checks below replacing the popup-only star checks that no longer apply.
   - Commit the design artifacts' paths.

## iPhone checks for the owner (the release list)

1. **(Gate)** A horizontal stroke on a row engages: `touchmove` is cancelable in iOS Safari. If it isn't, the gesture never arms, so report back before anything else.
2. Loose-thumb flick scrolls never stick or catch a row; 34–45° drags scroll; no jank on a long list.
3. A stroke starting at x ≈ 24–40 isn't taken by Safari's back-swipe, and one from the very edge still goes back.
4. A real quick flick stars; a flick on a starred row springs back without unstarring.
5. The pencil grain reads as graphite (not noise or a rendering fault) on the 3x OLED; the ink landing reads beside the thumb in daylight.
6. The unstar commit (the ghost vanishing and the dust falling at 56) is noticeable in daylight. If not, apply the ghost dial (0.35, ceiling 0.45).
7. There's no flicker at the release frame (FLIP), from the feathered mask during the slide, or at the pencil → printed hand-off; `color-mix()` renders in the SVG fills.
8. The 80ms press feels like a press, not lag, and the quick-tap press on release reads as a press, not a flash.
9. Star a place, then immediately tap the next one: it navigates.
10. Popup star: one tap draws, then inks; one tap rubs out to hollow; with the popup open it plays once and doesn't replay on refetch.
11. The first two popup stars replay the stroke on the on-screen row; after that it never replays.
12. Carry-over checks from before this work (visited stamp, visited field, list-tap popup) that are still open stay on the list.
