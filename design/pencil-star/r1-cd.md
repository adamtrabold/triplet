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

---

# Round 4 (the owner's iPhone feedback: too fast, too pointy, size/placement)

SCORE 8/10

## Verdict

**The diagnosis is excellent, and the main fix is right.** The per-frame harness shows why the owner couldn't see the star:
- On `main`, a natural swipe shows the sketch for **4 frames** (66ms); a brisk one for 2.
- The hand-speed pen gives **21 frames at every swipe speed** without giving up the finger's ownership of the name or the commit.

I read `r4-realtime-r4.png` frame by frame, 35 compositor frames of one natural swipe. For the first time, you can *watch a star being pencilled*: a tick, then a Λ, then a crossbar, then a star, and then the ink. That fixes the owner's complaint.

**It is not a 9 yet, for three reasons:**
1. **The commit is no longer felt.** UX's R4-S1 is real. The fix UX proposes would partly re-create the owner's complaint (ruling below).
2. **P1 creates a two-icon problem on exactly the rows the owner will star most.** I rendered it myself because the pack didn't include it (`cd4-rest-P1-*.png`, `cd4-rest-P0-*.png`):
   - A starred **restaurant** row in P1 shows an orange fork ring next to an 18px orange star. In Stockholm they are nearly the same colour, and read as one paired icon.
   - In **Copenhagen**, the red `--figure-deep` star sits next to the orange restaurant ring and clashes.
   - At 1x, the left edge becomes two icon columns.

   That is precisely the "next to the category icon… feels a little weird" the owner flagged.
3. **The ink-landing frame regressed in real time.** In `r4-realtime-r4.png`, frames 23 and 24 (+392 and +406ms) show a large, soft, blurred star. The 1.3× spread frame, scaled to an 18px star, overhangs by about 3px and now holds for **2 frames**. At 4x (`r4-4x-star-unstar.png`, frame 27) it reads as a tan sticker outline. My round-2 rule was that the ink frame must be the crispest frame, and at real timing it is now the softest.

## What's working

- **The hand-speed pen (option B).**
  - The finger owns the name and the 56px commit; the pen can't outrun a hand; backing off retracts it at once.
  - After a committed release, it finishes drawing and then inks.
  - UX's honesty matrix (55/62 never star; 68/72/90 star; fast to 90 then back to 40 does not star) holds.
  - Taps, press, diagonal scroll, edge and delete are all unchanged from `main`.
- **The order of the finish.** In real time, the name docks against the pencil sketch and *then* the ink lands. The ink becomes the last beat, like a stamp coming down. Keep this order.
- **Popup** at 72ms per stroke and ink at 380ms. State flips on the tap, so pace never blocks input. Approved.
- **S1, the soft star, is approved** at 4x and 1x in the row, popup and map pin. It is softened and still unmistakably a star. S2 goes blobby at 1x, as the designer found. Using one path for `#g-star`, `#g-star-open` and `STAR_D`, with capsule pencil strokes, keeps it one mark.
- **Graphite contrast improves** with the bigger star (≥4.67 at 3x, ≥4.06 at 1x). The hand-off stays 0/5,184 pixels.
- **Unstar** reads well at real time: colour, then grain, then erosion, then ghost, then dust, with no glitter.

## Ruling: the R4-S1 tension

**Rejected as written.** Finishing the pen within about 120ms of crossing 56 puts the fast-swipe sketch back to about 7–12 frames, which reintroduces the owner's exact complaint. UX is right, though, that the commit must be legible *before* lift-off.

**The answer: signal the commit with the pencil's weight, not its speed.** When finger travel crosses 56, all within the same frame:
1. **Pressure.** Every stroke already drawn, and every stroke still to come, steps from sketch weight to a heavier, darker graphite: about 1.4× width, 100% opacity instead of about 85%, and grain density up. The hand is visibly pressing harder: "this one counts".
   - A stroke that is backed off before 56 never gets heavy.
   - This is legible at a glance, even mid-sketch, and it belongs to the metaphor (you go over a pencil star harder once you've decided).
2. **The detent.** The name block takes a 3px catch at 56 (a short spring against the ×0.35 rubber-band), so the threshold is felt in the finger, not only seen.
3. **Pace.** After commit, the pen may speed up modestly: remaining strokes at no less than 55ms each, and the whole sketch visible for **at least 280ms** (the designer's own floor). Ink lands when the sketch completes. It does not jump.

**Unstar mirror:** at the crossing of 56, the first eraser speck drops at once (the commit cue). The rest of the dust falls when the rub completes.

**Measure:**
- Frames from crossing 56 to the first heavy-graphite frame: **≤1**.
- Time from crossing to ink: ≤250ms for a natural swipe.
- Sketch frames at a brisk swipe: ≥17 at 60Hz.
- A 3x/4x pair showing released-at-62 against released-at-72: mid-sketch, the two must be distinguishable.

## UX findings

- **R4-S2: ACCEPT.** When a new row locks, fast-forward the previous row. It must jump to its **ink** frame and still play the 160ms ink press-in; don't snap silently to the printed star, because the owner must see each star land. Then run the FLIP. Re-test 100/250ms: both must star.
- **N4-a: promoted.** It is the core of the placement ruling below.
- **N4-b: ACCEPT.** Start an unstar's name home 100ms before the dust falls. Today it freezes for about 300ms after lift-off (`r4-film-unstar.png`, frames 10–28), which is long enough to read as stuck.

## Ruling: P1 or P0

**P1 is the right *structure*.** It is what the owner reached for: both lines move, the star is a mark on the whole entry, and it gives the pencil room to be seen. P0 answers none of that. The ragged text edge on starred rows is acceptable *because* stars are scarce: it reads as a guidebook call-out.

**But P1 must not ship in `--figure-deep`.** Next to the category badge, a big accent-coloured star becomes a second badge, and on restaurant rows it merges with the badge (Stockholm) or clashes with it (Copenhagen).

**Direction: make the P1 printed star an ink star.** Use `--ink` for the list, the popup and the add form, which also matches the map, where the star is already `--ink` on a paper halo.
- This is historically right: Baedeker's stars were printed in black ink, next to the entry.
- It is metaphor-right: the pencil becomes *ink* when it commits.
- It separates the star from every category colour in every city, so the star reads as typography and the badge as a symbol. The one-mark-everywhere goal from S1 is then satisfied in colour as well as shape.
- Highlighted rows stay `--paper`.

Show P1 in `--figure-deep` against P1 in `--ink`:
- on starred restaurant, cafe and attraction rows, in all 5 cities;
- at 3x, 4x and 1x;
- with the contrast figures.

The ink landing (the press-in plus a trimmed spread) then lands in ink. If the ink star makes the list feel heavy, the fallback is `--ink-2` at 18px, not `--figure-deep`. P0 remains the one-file fallback only if the owner dislikes P1 on the device.

## Directions for round 5, in order

1. **Placement colour.** Build P1 with an `--ink` printed star everywhere (list, popup filled, add form; the map is already ink), and show the side-by-side above. Re-measure every contrast; ink on paper, filed and pressed will be well above 3:1.
2. **R4-S1 as ruled.** Pressure step plus the 3px detent at 56, pace floors as specified, and the unstar speck. Deliver the 62-vs-72 stills and a real-time compositor strip of a brisk swipe.
3. **Fix the ink-landing frame.**
   - The spread must hold for exactly **1 frame** at 60Hz. Scale it to the star, so it overhangs by ≤1.5px (about 1.15× at 18px), not 1.3×.
   - Show 5 real-time frames around the landing at 3x, plus the 4x peak. The peak frame must again be the crispest one.
4. **R4-S2** fast-forward (with the visible ink press-in) and **N4-b** overlap. Re-run UX's repeated-starring matrix.
5. **Re-run everything:** the suite in both motion modes, UX's scripts, the popup-open suite, rows 56.00px, 0ms tap delay, the hand-off, contrast in all 5 cities (now including the ink star), Impeccable baseline 3. Also produce `r5-proposed.diff` against `main`.

## Dials to carry to the iPhone

- **`HAND_MS`:** range 280–440, default 360.
- **Pressure step:** 1.3–1.5×.
- **Ghost opacity:** 0.35, ceiling 0.45.

---

# Round 5

SCORE 8/10

## Verdict

**All three of my round-4 blockers are fixed at real timing.** R4-S2 and N4-b are fixed too. This is now the best version of the gesture: you watch a pencil star being drawn, the stroke visibly presses harder when it counts, and a black ink star lands as the last beat.

**One new defect stops me from staking a 9 on it.** It is the same class of defect the owner and I have caught before: a mark that reads as a typo. N4-b now starts the unstarred name home 100ms *before* the eraser dust falls. In P1, the star's slot is where the text column begins at rest, so the name slides home **over the falling dust**. For about 100–250ms, the specks sit on the meta line and read as diacritics:
- "ÀTTRACTION" at 1x (`r5-1x.png`, unstar frame 27);
- a speck over the T (frame 30);
- a stray point before or above the "A" at 3x (`r5-film-unstar.png`, frames 26–32, 434–534ms).

This is round 2's "/Café" problem in reverse, and the owner will see it on their first unstar.

## My three blockers, verified at real timing

| # | Blocker | Evidence | Result |
|---|---|---|---|
| 1 | **Pressure, not speed** | `r5-62-vs-72.png`: light graphite at 62 vs heavy, darker, denser graphite at 72, distinguishable mid-sketch at 3x and 4x. `r5-realtime-brisk.png`: crossing at ~55ms, sketch frames #2 → #18 (17 frames, about 265ms), ink at +310ms. It never jumps: strokes keep their pace and weight changes at the crossing. UX confirmed `.sg-press` on the crossing event itself, and that a 62px stroke never goes heavy. Metrics: 0 frames to heavy; 17 sketch frames at brisk; crossing → ink 250ms (natural). Unstar speck at the crossing: 0 frames. | **Pass** |
| 2 | **Black ink in all 5 cities** | `r5-restaurant-5cities-3x.png`, normal and highlighted rows. The ink star is cleanly separate from the orange fork ring in every city. The Stockholm merge and Copenhagen clash are gone. The highlighted row shows a `--paper` star and reads by shape and the 12px gap. At 1x it reads as "★ Name", typography rather than a second badge. Contrast 14.69 / 13.17 / 11.74, highlighted ≥4.79. | **Pass** |
| 3 | **One 1.15× spread frame** | `r5-ink-landing-4x.png`: the +10ms frame is the only enlarged one, crisp-edged, with no halo band; +15ms is the 1.1× press-in, and the star is crisp and settled from +32ms. `r5-ink-landing-3x.png` is the same. The rAF show/hide can't straddle two frames. Measured: 1 frame at every speed. The peak is crisp again. | **Pass** |

**Also verified:**
- **R4-S2:** 4/4 at 0/100/250/400ms, and 3/3 rapid strokes, each visibly inking.
- **N4-b:** the name starts home 56ms after lift. The mechanism is right; only its collision with the dust is wrong.
- **Reduced-motion film:** no detent, the pen follows the finger, lands at once.
- **Popup:** 1.1 press, 1.15 spread, 16ms.
- Rows 56.00px, 0ms tap delay, hand-off 0/5,184 pixels, suite and UX scripts matching `main`, Impeccable baseline 3.

## Ruling on UX N5-a (the FLIP test)

**Accept and require it.**
- UX's skeptical frame log is the real evidence. The only unstar swap happens under the feathered mask (truncation edges at x = 314 and 340, fade starting at 242, text left edge unchanged), then 13 frames of motion.
- `flip5.js` must be rewritten to assert exactly that:
  - no `cardSignature`/`h3` change within the last 3 motion frames;
  - any change of `clientWidth` or truncation edge happens with the old and new edges both at or beyond the mask's fade start;
  - the name's measured screen x (from `getBoundingClientRect`, not the transform string) changes on at least 3 frames after the swap;
  - under reduced motion, it asserts the single-frame landing explicitly rather than passing trivially.

## Directions for round 6 (one defect plus hygiene; no new ideas)

1. **The dust must never touch text.** Pick whichever is cleanest, and show it at real timing:
   - **(a)** The dust falls *down and left*, away from the text column. It drifts ≤2px as before, but its origin is the star's lower-left inner corner, and it has faded to 0 before the name's left edge reaches the dust's x.
   - **(b)** Keep the dust where it is, and let the name's slide home begin at the dust fade-out minus about 40ms, not the dust fall minus 100ms. This keeps most of N4-b's benefit: measure lift → name-moving and keep it ≤150ms.

   **Measure** at 60Hz (both motion modes, long and short names, visited and unvisited):
   - frames in which any dust pixel with opacity >0.05 lies inside the `h3` or meta text box: **must be 0**;
   - lift → name moving: **≤150ms**.

   **Deliver** `r6-film-unstar.png` (3x), a 1x unstar strip, and a 4x crop of the dust frames next to the text.
2. **Rewrite `flip5.js`** per N5-a, and keep it in the suite.
3. **Re-run** the touch suite (both modes), UX's scripts, popup-open 20/20, rows, tap delay, hand-off, contrast and Impeccable. Produce `r6-proposed.diff` against `main`.

If item 1 measures 0 collision frames with a lift → move time ≤150ms, and nothing else moves, round 6 gets my approval. These are the integration conditions I will attach then:
- `CLAUDE.md`: update the Pencil Star entry with the pace, pressure, P1 and ink numbers;
- replace iPhone checks 5 and 7 with the round-5 checks;
- `flip5.js` as specified above.

---

# Round 6

SCORE 9/10

## Verdict

**Approved for integration.** The one round-5 defect is fixed, and nothing else moved.

I checked the real-time strips frame by frame at 3x, 1x and 4x (`r6-realtime-unstar-long-{3x,1x,4x}.png`, `-short-3x`):
- The first speck drops at the crossing (frame 7, +136ms) just left of the star.
- The rest fall after the rub and are swept 11–13px left into the gutter while the name is already sliding home.
- Everything has faded by about 530ms.
- There are **0 frames with a speck over text** (round 5 had 459 across the runs). UX reproduced this with an independent detector that does flag round 5.
- Lift → name moving: ≤117ms (12ms in UX's runs). The freeze is gone.

**Does it read as dirt left by the badge? No.**
- The specks are 1.5px, faint, and moving. They sit in the empty gutter for at most about 170ms, while the eye is tracking the name coming home, and they are gone before it lands.
- At rest, the gutter is clean in every strip.

**The one thing I watched most closely:** at 4x (frames 10–11), two specks briefly stack vertically about 5px left of "ATTRACTION" and could suggest a colon. At 3x and 1x at real speed they are sub-perceptual and in motion, so this doesn't block. It goes on the iPhone list with a dial, below.

**Regressions: none.**
- UX's full re-run matches `main` on taps, press, diagonal, edge, delete and popup.
- Pressure, R4-S2 and N4-b hold.
- Hand-off 0/5,184 px; contrast unchanged; rows 56.00px; 0ms tap delay; Impeccable baseline 3.
- The 88 → 84 drop is exactly the obsolete R2-S1 block (2 rows × 2 modes), replaced by a superset. `flip6.js` passes 8/8 and its at-rest-swap control fails 4/4, so it can detect the defect it guards against.

It is not a 10 only because feel, the grain, the pressure step and the dust can be judged only on the owner's iPhone.

## Integration conditions

1. **Apply `r6-proposed.diff`** to `index.html` on `main` (`ab82197`). It must apply cleanly and produce `r6-proto.html` byte-for-byte. If `main` has moved, re-anchor with `build6.py`'s asserted anchors; never hand-merge.
2. **Test gate: "84 + 8".** The touch suite (`test6.js`) must pass 84/84 in both motion modes, plus `flip6.js` 8/8 with its negative control failing 4/4.
   - Report the gate as **"84 + 8"** everywhere (commit message, `CLAUDE.md`, summaries), never as "84".
   - Also: the popup-open suite 20/20; UX's `ux2-*` scripts matching `main`; rows 56.00px; tap delay 0ms added; hand-off 0/5,184; the dust detector at 0 over-text frames; Impeccable exactly the 3 baseline findings.
   - Run all of this on the integrated `index.html` with injected rows, not only on the prototype.
3. **`CLAUDE.md`: rewrite the "Personal priority star — the Pencil Star" entry.** Keep its history and rulings, and add or replace:
   - **Display:**
     - P1: an 18px star in its own slot at the head of the text column, centred across both lines; starred rows indent both lines 26px.
     - The star is **black ink (`--ink`) everywhere** (list, popup filled, add form, gesture ink; the map already was); `--paper` on highlighted rows. `--figure-deep` was dropped because an 18px accent star became a second badge and merged with or clashed against restaurant rings (Stockholm, Copenhagen).
     - Contrast 14.69 / 13.17 / 11.74, highlighted ≥4.79.
     - The **S1 soft star**, one path for `#g-star`, `#g-star-open` and `STAR_D` (tip rounding 1.3, inner 0.6, ratio 0.47; S2 rejected as blobby at 1x).
     - The truncation cost from `r4-trunc.json`.
     - The accepted ragged text edge, which relies on stars staying scarce.
     - P0 (12px inline) as the recorded fallback.
   - **Pace:**
     - The pen is hand-speed: `HAND_MS` 360 (dial 280–440). The finger still owns the name and the 56px commit; the pen never runs ahead and retracts at once on back-off; a committed release finishes drawing, then inks.
     - The root cause the owner hit: on the old build a natural swipe showed the sketch for only 4 frames.
     - Unstar rub ≥400ms; `RUB_AFTER_LIFT` 180ms.
     - Popup: 72ms per stroke, ink at 380ms.
   - **Commit cue: pressure, not speed.**
     - At the 56px crossing, in the same event, every stroke goes heavier (about 1.4×, 85%→100% opacity, darker, denser grain). Back-off lightens it.
     - A 3px, 140ms detent on the name (not under reduced motion).
     - After commit, strokes are ≥55ms each and the sketch is visible for ≥280ms (`SKETCH_MIN`).
     - Unstar's first speck drops at the crossing.
     - Record the ruling: UX's "finish within 120ms" was rejected because it re-creates "too fast to see".
   - **Ink landing:** a 1.1→1 press-in over 140ms, plus exactly one rAF-driven 1.15× spread frame (the peak must be the crispest frame).
   - **Dust sweep:**
     - Specks start at the star's lower-left inner corner and are swept 11–13px left into the badge/text gutter, fading over 200–240ms.
     - `releaseStarRow()` compensates the box shift.
     - The name leaves at dust − 100ms (N4-b), lift → moving ≤150ms.
     - **Rule: dust may never overlap text: 0 frames**, guarded by the dust detector. Round 5's "ÀTTRACTION" is the example of why.
   - **R4-S2:** a new row's lock fast-forwards any finishing row to its visible ink landing (never refuses, never snaps silently).
   - **FLIP rule, re-specified:** glyph changes happen only while the name is moving, at least 3 motion frames before rest, and any truncation-edge change lies under the feathered mask. Replace the old "laid out on the release frame" wording. `flip6.js` is the proof.
   - **Dials:** `HAND_MS`, pressure step 0.5–0.9 units, light-graphite opacity 0.8–0.9, detent 2–4px, ghost 0.35 (ceiling 0.45), `RUB_AFTER_LIFT`, dust sweep.
   - Also update: the design record path (`design/pencil-star/`, with the r4–r6 decision frames and `r4-trunc.json`), and the "Starred first" note under list ordering (unchanged).
4. **`CLAUDE.md`: iPhone checks for the Pencil Star.** Replace items 5 and 7, and add new ones:
   - **(5, replaced)** At a natural swipe you can **watch** the star being pencilled stroke by stroke, and the ink landing after release feels like a finish, not a lag (dial `HAND_MS`).
   - **(7, replaced)** No flicker at the FLIP swap, the feathered edge, the pencil → ink hand-off, or the one-frame spread (at 120Hz it's 8ms: confirm it doesn't read as a flash). `color-mix()` renders in the SVG fills.
   - **(new)** The pressure step at 56 is visible under the thumb, and the 3px catch is felt, not seen as a glitch (dials: pressure 1.3–1.5×, detent 2–4px).
   - **(new)** The soft black star beside the category ring reads as one entry, "★ Name", not a second badge; it is softened but still a star in daylight. If it feels heavy, the fallback is `--ink-2`.
   - **(new)** The swept dust reads as eraser crumbs brushed off, not dirt beside the badge or a colon before the category. If it reads as punctuation, shorten the fade toward 160ms or trim to two specks.
   - **(new)** Three quick stars down the list all land, each visibly inking.
   - **(new)** On unstar, the name leaves at lift; nothing feels stuck.
   - Keep checks 1–4, 6 and 8–12 as they are. Check 6 (the ghost and dust commit) now reads "ghost vanishes and the first speck drops at the crossing".
5. **Commit hygiene.**
   - Make separate commits: the `index.html` change, then the docs (`CLAUDE.md` plus `design/pencil-star/`).
   - The commit message states the gate as "84 + 8", with the attribution lines.
   - No DB or RLS change.

---

# Round 7

SCORE 8/10

## Verdict

**C, the spin-stamp, is the right pick. A reads as "a bit bigger", and B's 8° swing is lost at 18px.**
- Landing twisted at −20°, swinging through +6° at 1.4× and settling upright is the one treatment that reads as *placed by a hand*, the way a stamp is pressed and turned home.
- It isn't cartoonish. The 26° swing is short, there's no bounce-back beyond one 0.95 undershoot, and at peak it is still a crisp black print mark, not a squash-and-stretch toy.
- The −12° sketch lean makes "drawn by hand, then set straight in ink" deliberate.
- The peak is crisp: at 3x and 1x the 1.4× frames (+39 and +56ms) have clean edges with no blur hang. Clearance holds: name ≥5.6px, badge ≥9.8px, popup title ≥3.06px on the axis-aligned box.

**Why it isn't a 9: the drama plays out in about 90ms, not 340ms.**
- `STAR_POP` puts the peak at offset 0.38 and the undershoot at 0.70. But the WAAPI effect easing, `cubic-bezier(.25,.8,.35,1)`, is applied to *overall* progress, and it is strongly ease-out.
- So in the real-time strips (`r7-C-landing-3x.png` and `-1x.png`):
  - the swell peaks at about 40–56ms;
  - it is back to about 1× by about 88–105ms;
  - the last about 240ms is a near-still, imperceptible 0.95 → 1 creep.
- Only about 2–3 frames sit above 1.3×.
- That is the round-4 failure mode again, "too fast, I can't see it", applied to the exact beat the owner just asked to see: *"getting slightly larger then going down to the correct size."*
- On an iPhone at arm's length, the swell will register as a flicker, not as a size shift.

**The popup is timed differently.** It uses CSS `sgpPress`, where the timing function applies *per keyframe segment*, so its curve differs from the row's WAAPI curve. "One mark" needs one curve.

## Rulings

- **R7-S1: ACCEPT.** Blur the hidden input if it took focus, then restore `prev` only if it is focusable and not `body`. Verify `activeElement` is never the switch after a tick, starting from body, a focused row, or the popup star.
- **R7-S2: ACCEPT.** Add a capture-phase `stopPropagation()` on the label for both the label click and the input's activation click. Verify **0** document-level clicks per tick, and that an open account dropdown and add-form autocomplete survive a star and an erase.
- **N7-a: APPLY NOW, not as a dial.** At 1x (`r7-C-popup.png`, +420–480ms) the 1.4× popup star crowds "Café" (3.06px). Use a 1.35× peak in the popup only; the row keeps 1.4×.
- **Haptics and reduced motion:** the tick still fires under reduced motion. Haptics aren't motion, and the click is the confirmation that replaces the pop there. Record that in the code comment.
- **Haptics on iOS 26.5+:** accepted as the platform limit (WebKit fc1ef83). Don't build the popup-tap label until the owner answers. The iPhone check must tell the owner to read their iOS version first, so a silent phone isn't reported as a bug.

## Directions for round 8 (timing only, plus the two should-fixes)

1. **Retime the pop so the size shift is seen.**
   - Use `easing: 'linear'` on the effect, with per-keyframe easings, and use the identical curve in the popup's CSS keyframes (translate them 1:1 so both paths share one curve).
   - Targets (row):
     - land at −20°, 1.0 at 0ms;
     - ease-out into the peak at **about 110–130ms** (+6°, 1.4×);
     - the undershoot (−2°, 0.95) at **about 220–240ms**;
     - rest at **340–380ms**.
   - **Measure** on real-time compositor frames at 60Hz:
     - **≥6 frames at ≥1.3×**;
     - ≥3 frames visibly below 1.0 (≤0.97);
     - the peak frame crisp at 3x, 4x and 1x.
   - Keep full ink on frame 1.
   - Re-check clearance per frame (the maximum scale is unchanged, so this should hold) and the 0/5,184 hand-off.
   - `STAR_POP_MS` plumbing (the hand-off, teaching and popup waits) follows whatever the final duration is.
2. **Fix R7-S1 and R7-S2.**
3. **Popup peak at 1.35×.** Re-measure title clearance (target ≥4px).
4. **Deliver:**
   - real-time strips at 3x and 1x, row and popup;
   - a per-frame scale and rotation table read from `getComputedStyle` (the matrix), so the ≥6/≥3 frame counts are shown, not asserted;
   - the "84 + 8" gate, dust 0, popup-open 20/20, 0ms tap delay, rows 56.00px, Impeccable baseline 3;
   - `r8-proposed.diff`.

If the swell is measurably held (≥6 frames ≥1.3×) with the same curve in both places, and the two haptic fixes verify, round 8 gets my approval.

---

# Round 8

SCORE 9/10

## Verdict

**Approved for integration.** The round-7 blocker is fixed at real timing, and I read the strips frame by frame (`r8-row-landing-{3x,1x}.png`, `r8-popup-landing-{3x,1x}.png`):
- The ink lands twisted and small (+7ms).
- It swells and swings through by about 40ms.
- It **holds the stamp at full swell with its slight +6° lean from about 40 to 205ms**, which is the beat the eye needs.
- It dips visibly (0.95, about 253–305ms) and settles upright by about 370ms.
- Measured: row 11 frames ≥1.3× and 3 frames ≤0.97; popup 8 and 3. Round 7 managed 2 frames above 1.3×.

It now reads as a deliberate stamp pressed and turned home. It is visible at arm's length and at 1x, and it stays in the print world rather than going cartoonish: one swell, one small give, no bounce train, no squash.

The peak frames are crisp at 3x and 1x with no blur hang. Row and popup now share one curve (a linear effect with per-keyframe easings). Clearance holds:
- row: name ≥4.68px, badge ≥8.91px;
- popup: title 4.41px, with the measured 70% origin and the 1.35× peak.

**Haptics.**
- R7-S1: the switch never holds focus (0 frames).
- R7-S2: 0 document clicks per tick; the dropdown and autocomplete survive.
- The owner-approved popup real-tap label is exactly the 44×44 target, adds no a11y node, gives 1 toggle per tap, and uses trusted events.

**Gate.** "84 + 8", popup-open 20/20, dust 0, rows 56.00px, 0ms tap delay, hand-off 0/5,184, Impeccable baseline 3. UX: no regressions.

It isn't a 10 because the haptic on iOS 26.5+ (via the label tap) and the feel of the ~160ms hang can only be judged on the owner's phone.

**Watch item (dial, not a blocker).** Because the 0.95 undershoot follows a long hang, it could read as a second small "drop" on the device. If the owner says it bounces, set the undershoot to 0.97.

## Rulings

- **N8-a: APPLY.** In `popupStarTap()`, when the forwarded tap came from `pointerType === 'mouse'`, call `btn.focus({preventScroll:true})`. That restores round 2's focus behaviour for desktop pointer users. Touch keeps focus on `body`, as now, so no focus ring flashes on iPhone. Add one test: mouse click → `activeElement` is the star button.
- **N8-b: accept as an iPhone check.** With VoiceOver on, a double-tap on the popup star toggles exactly once.

## Integration conditions

1. **Apply `r8-proposed.diff`** plus N8-a (one hunk).
   - It must apply cleanly to `main`, and `cmp` must match `r8-proto.html` plus the N8-a hunk.
   - Re-run the gate on the integrated `index.html`:
     - "84 + 8", plus the new N8-a case;
     - popup-open 20/20;
     - dust 0;
     - `curve8.js` (row ≥11/3, popup ≥8/3 frames);
     - `haptic8.js` and `tap8.js`;
     - rows 56.00px, 0ms tap delay, hand-off 0/5,184;
     - Impeccable exactly 3.
   - Report the gate as "84 + 8 (+ N8-a)".
2. **`CLAUDE.md`, the Pencil Star entry.** Add a "Round 7–8 (owner: more dramatic pop and angle; haptic click)" block that supersedes the ink-landing line of rounds 4–6:
   - **Spin-stamp ink landing.** One shared table (`STAR_POP`), `STAR_POP_MS` 380:

     | Offset | Rotation | Scale | Easing into the next segment |
     |---|---|---|---|
     | 0 | −20° | 1 | `(.2,.9,.3,1)` |
     | .34 | +6° | peak | `(.6,0,.85,.45)` |
     | .65 | −2° | 0.95 | `(.4,0,.3,1)` |
     | 1 | 0° | 1 | — |

     - The effect easing is **linear**, with per-keyframe easings, on both the row (WAAPI) and the popup (CSS `sgpPress`).
     - Row peak 1.4×; popup peak **1.35×** with `transform-origin` 70% 55% (measured for title clearance 4.41px).
     - Full ink on the first frame. The hand-off, teaching and popup waits follow `STAR_POP_MS` + 20.
     - Rule: **≥6 frames ≥1.3×** (measured 11 row / 8 popup).
     - Why: round 7's effect-level ease-out compressed the drama into about 90ms, which was "too fast to see" again.
     - A, the plain pop (reads as "a bit bigger"), and B, the 8° twist (lost at 18px), were rejected.
     - Remove the old "1.1→1 press-in plus one 1.15× spread frame" as current behaviour; keep it as history.
   - **Sketch lean −12°** (was −7°): "drawn by hand, then set straight in ink".
   - **Reduced motion:** no scale and no rotation; the ink just appears. Haptics still fire, because they aren't motion and are the only finish cue there.
   - **Haptics (`starHaptic(kind)`):**
     - Android: `navigator.vibrate`, 10ms for star and `[6,45,6]` for erase.
     - iOS: a hidden `<input type="checkbox" switch>` toggled via its label (the switch needs iOS 17.4+; the haptic needs 18+). It is lazy, fixed off-screen, clipped, `aria-hidden`, and `tabindex -1`.
     - Its clicks are stopped at window capture (`stopImmediatePropagation`, 0 document clicks).
     - It is blurred if it took focus; `prev` is restored only if focusable and not `body`.
     - Row swipe: the tick fires **on the ink landing** (star) and on the erase commit (unstar: 2 toggles, 60ms apart).
     - **Platform limit:** from iOS 26.5, WebKit fc1ef83 (bug 309082) makes a script `label.click()` untrusted, so it gives no haptic. **A swipe can never tick on iOS 26.5+.** That is not a bug and not fixable in timing. It works on iOS 18.0–26.4 and on Android.
   - **Popup real-tap path (owner-approved):**
     - `.popup-star-tap` is an `aria-hidden` `<label for="starHapticSwitch">` exactly over the 44×44 star target, at `z-index:202`.
     - The finger's trusted tap toggles the switch (it ticks on iOS 26.5+), and `popupStarTap()` forwards the click to the button one task later.
     - One tick at tap time, for star and unstar alike (a tap is one trusted event); Android vibrates on the tap.
     - Keyboard and VoiceOver go straight to the button and produce no tick.
     - The 8px dead band, `.popup-star` `z-index:201` and the accessibility tree (only `button "Star"`) are unchanged.
     - Mouse clicks refocus the button (N8-a).
   - **Dials:**
     - peak 1.3–1.45× (popup ≤1.35×);
     - twist −14° to −24°;
     - duration 340–400ms;
     - undershoot 0.95 → 0.97 if it reads as a bounce;
     - sketch lean −7° to −12°.
3. **`CLAUDE.md`, iPhone checks for the Pencil Star.** Add as 18–22 and amend 5:
   - **(5, amended)** "…the ink landing after release feels like a finish…" now reads: **the ink lands twisted, swells and holds, then turns upright to size in about ⅓s, and reads as a stamp pressed home, not a bounce.** If the dip after the swell reads as a second bounce, apply the undershoot dial (0.97).
   - **(18)** The −12° pencil lean looks hand-drawn, not broken (dial −7° to −10°).
   - **(19)** The popup star's swell never feels crowded against the title (dial ≤1.35×).
   - **(20) Haptic — first check Settings › General › About › iOS Version.**
     - **Popup star tap:** one click on every tap, star and unstar alike, on **any** iOS ≥18, including 26.5+.
     - **Row swipe:** on iOS 18.0–26.4, one click as the ink lands and a double click as the erase dust falls. **On 26.5+, expect no click from a swipe: this is the platform limit, not a bug.**
   - **(21)** No side effects: an open account menu or address suggestions stay open after a swipe-star or swipe-erase. Nothing flashes on screen, and focus never jumps.
   - **(22)** With VoiceOver on, double-tapping the popup star toggles it exactly once, and VoiceOver announces only "Star, toggle button"/"selected". No stray checkbox.
4. **Commits.** Code and docs go in separate commits, with the gate in the message and the attribution lines. No DB change.
