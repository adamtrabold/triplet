# Pencil Star, round 4: the owner's iPhone feedback

> "It's a little fast I can't see it — also it feels a bit too pointy maybe it should be softened? Also maybe it should move both lines of text / be bigger? Not sure on that one with it next to the category icon but it does feel a little weird."

**Base:** the current `index.html` on `main` (Pencil Star live, `ab82197`). The working tree is identical to `main`, and `index.html` was not edited.

- **Proposal:** `star2/r4-proposed.diff` (15 hunks, 138 changed lines). `git apply` on a clean copy produces `r4-proto.html` exactly.
- **Fallback:** `r4-P0.html`, which has the same fixes but keeps today's 12px inline placement.
- **Builder:** `build4.py`, anchored and asserted, as in round 3.

## 1. "Too fast to see": which moment, measured

A per-frame harness (`frames-visible.js`) drives a frame-accurate touch stream in real time and logs, for every rendered frame, whether the pencil sketch is on screen. The swipe is 100px of finger travel.

| Build | Swipe speed | Frames with sketch visible (60Hz) | Sketch on screen | Ink lands |
|---|---|---|---|---|
| **main (shipped)** | slow 0.3 px/ms | 8 | 133ms | before release |
| **main (shipped)** | **natural 0.6 px/ms** | **4** | **66ms** | before release |
| **main (shipped)** | brisk 1.2 px/ms | **2** | 33ms | before release |
| **round 4** | 0.3 / 0.6 / 1.2 | **21 / 21 / 21** | **350ms** at every speed | 133 / 266 / 317ms after release |

- **The culprit is the drawing.** The sketch is tied to only about 34px of travel (content 16 → 50). A natural swipe crosses that in about 4 frames at 60Hz (about 8 at 120Hz), and a brisk one in 2.
- **The other moments are not the problem.**
  - The ink press (160ms) and the settle (220ms) are already about 10–13 frames.
  - The popup draw was fast (40ms per stroke, 200ms in all), and is slowed below for consistency.
- **Real-time evidence:** every compositor frame of one natural swipe, from CDP screencast, in `r4-realtime-main.png` vs `r4-realtime-r4.png` (and `r4-realtime-P0.png`).

**Options considered:**

- **A. Longer commit travel** (COMMIT 56 → 90). Rejected.
  - A brisk swipe still sees about 3 frames.
  - Every star costs 34px more finger travel.
  - It changes the gesture the owner has already learned.
- **B. A hand-speed pen. Recommended.**
  - The finger still owns the name (1:1) and the commit (56px), so the gesture is exactly as responsive as before.
  - The pencil can't outrun a hand. It follows the finger when the finger is slow, and trails at a drawing pace when it is fast: the whole sketch takes at least `HAND_MS` = 360ms, and the rub-out at least `RUB_MS` = 400ms.
  - It never runs ahead of the finger. Backing off retracts it at once, so a cancel is still honest.
  - If the finger has committed and lifted, the pen finishes the star after release and the ink lands then. The result was decided at 56px, so nothing is in doubt.
  - For an unstar, the name waits where the finger left it until the rub-out and the dust are done, and only then slides home. It never slides over a star being erased.
- **C. Draw only after release.** Rejected: no mark during the drag means no feedback about what the stroke is doing.

**B, in detail:**

- **Frames:** 21 at 60Hz, 42 at 120Hz, on every swipe (`r4-film-star.png` vs `r4-film-star-main.png`).
- **Brisk swipe:** released at 83ms, the pen keeps drawing, then inks (`r4-film-flick.png`).
- **Dial:** 280ms is the floor, below which it gets fast again; 440ms is the ceiling, above which it starts to feel like the app is catching up.
- **The same pace everywhere:**
  - Popup: 72ms per stroke, ink at 380ms (was 40ms and 220ms); `r4-film-popup.png`.
  - Teaching replay: draws over `HAND_MS`.
- **Reduced motion:** the pen is the finger (no autonomous timeline), and release lands at once (`r4-film-reduced.png`).
- **Known cost:** the ink now arrives up to about 320ms after a fast release.
  - Starring a second row inside that window won't arm until the first has settled.
  - A tap still navigates immediately.

## 2. "Too pointy": one softer star everywhere

`softstar.py` generates rounded stars that keep the old silhouette's extent (tips pushed out to compensate for the rounding). Compared in `r4-shape-options.png` (row at 4x and 1x, popup, and map pin):

| Option | Tip rounding | Inner corner rounding | Inner ratio | Verdict |
|---|---|---|---|---|
| S0 (shipped) | sharp | sharp | 0.46 | — |
| **S1 (recommended)** | 1.3 | 0.6 | 0.47 | Softened, and still unmistakably a star at 12px and 1x |
| S2 | 2.2 | 1.1 | 0.52 | Starts to read as a blob or flower at 1x |

**S1 is one path in three places:**
- the `#g-star` symbol (list, map pin, popup filled, add form);
- the `#g-star-open` symbol (popup and form, hollow);
- the gesture's `STAR_D`.

**The pencil softens to match:**
- Its five strokes are now tapered capsules with round ends, so where they meet at the points they meet round.
- `PENTA` moves to S1's tips, pulled in so they sit inside the rounded points.
- Map halo, contrast and colours are unchanged.

## 3. Size and placement

Compared in `r4-place-options.png` (3x list, ~4x crop, 1x list, all with S1). Truncation is from `r4-trunc.json`: 193 real names, measured as the worst case with every row starred.

| Option | What it is | Truncated at 375 (unvisited / visited) | Truncated at 390 (unvisited / visited) |
|---|---|---|---|
| none (unstarred) | — | 3 / 25 | 2 / 17 |
| **P0** (shipped) | 12px star inline before the name, first line only | 5 / 41 | 3 / 25 |
| **P1** (recommended) | 18px star in its own slot at the head of the text column, centred across both lines; both lines indent 26px | 7 / 49 | 5 / 35 |
| P2 | 13px star pinned to the category badge's shoulder, like a sticker | 3 / 25 | 2 / 17 |

**Recommendation: P1.** The reasons, for the owner:

- **It is exactly what the owner reached for.** The drag already moves both lines as one block. In P0 the meta line then snapped back while only the name stayed indented; in P1 the resting row matches the gesture, and the star is a mark on the whole entry, not a character typed into the name.
- **It fixes item 1 as well.** An 18px star gives the pencil about 2.25× the area to draw in, so each stroke is legible under a thumb.
- **It sits happily beside the category icon.** The badge is a coloured ring with a glyph inside; the star is an open, un-ringed shape in the city's accent colour. They read as two different kinds of mark (category vs "I care"), in the same order a guidebook uses: symbol, then star, then entry.
- **Cost:** 2 more truncated names at every width when unvisited, and 8 (375) or 10 (390) more of 193 when visited, if every row were starred. Stars are meant to be scarce, so the real cost is a handful of rows.

**P2 was rejected.**
- It reads as an iOS notification badge, not as a guidebook.
- It competes with the category glyph for the same 28px.
- It breaks the stroke → mark link: the drag would open a gap that the star never fills.

**P0 stays available** as `r4-P0.html` if the owner prefers the smaller mark once they see it softened and slowed.

**P1 mechanics:**
- `.row-star` is absolute in `.row-main` and centred vertically; the row gets `.is-starred` with `padding-left: 26px`.
- The live row borrows 12px on the left, and the star follows via `--sg-lead`.
- The overlay takes the printed star's measured size.
- The dust scales with the star.
- Clearance re-measures itself: first graphite at content 22.5, minimum gap 4.49px.

## Verification (on `r4-proto.html`)

| Check | Result |
|---|---|
| Touch suite (`test4.js`), both motion modes | **88/88.** Waits lengthened for the post-release pen; clearance 4.49px on all three names. |
| UX's `ux2-touch`, `ux2-flick`, `ux2-popup` | Unchanged from main: S1 6/6 touch and 3/3 mouse; S2 press timeline; S3 identical to main at 34–50° (0/0/0/58/64/70px), sideways-then-up 165 vs 169px; delete safe; popup taps (`r4-ux2.log`) |
| Popup-open suite | **20/20** (`../star/r4b-popupfix-test.js`) |
| Rows | **56.00px** at every drag step |
| Tap delay | **0ms added** (touchend → navigation 1.3–1.7ms, same as main) |
| Pencil → printed hand-off | **0/5,184 px** differ, max delta 1/255, on paper, filed, highlighted Stockholm and highlighted Reykjavík (`handoff4.js` → `r4-handoff.json`) |
| Contrast, 5 cities | Tokens unchanged: graphite 6.17/5.53, ink 4.79/4.30, highlighted 4.79, ghost 1.41–1.51 (CD-accepted). The rendered graphite is **stronger** because the star is bigger: ≥4.67 at 3x and ≥4.06 at 1x (was ≥4.48 / ≥3.67). `r4-measure.log`, `r4-measure.json`. |
| Impeccable | **Exactly the 3 baseline findings** |

(`r4-measure.log`'s hand-off lines use the old frozen-clock method, which can't see the timed pen. `r4-handoff.json` is the valid measurement.)

**Frames delivered:**
- Real timing at 3x, every 2nd frame at 60Hz: `r4-film-star.png` (recommended), `r4-film-star-P0.png`, `r4-film-star-main.png` (shipped), `r4-film-unstar.png`, `r4-film-long.png`, `r4-film-flick.png`, `r4-film-reduced.png`.
- ~4x: `r4-4x-star-unstar.png`.
- 1x: `r4-1x.png`.
- Popup: `r4-film-popup.png`.
- Real-time compositor frames: `r4-realtime-{main,P0,r4}.png`.
- Options: `r4-shape-options.png`, `r4-place-options.png`.
- Two capture artifacts to ignore: the popup's last frames show the one-frame spread rim held, and paused dust can linger a frame or two in the stepped films. Both are artifacts of seeking paused animations.

## Only the iPhone can confirm

1. At the owner's natural swipe, the star is now visibly drawn stroke by stroke, and the ink landing after release feels like a finish, not a lag. Dial `HAND_MS` 280–440 if needed.
2. S1 reads as softened but still a star at list size in daylight.
3. P1 beside the category glyph reads as one entry, not two competing icons. If not, ship `r4-P0.html`'s placement: same fixes, 12px inline.
4. Unstar: the name holding still until the dust falls feels deliberate, not stuck.
