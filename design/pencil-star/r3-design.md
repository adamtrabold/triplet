# Pencil Star, round 3

This round is finishing work only, with no new concepts. It covers the CD's round-2 list and UX's R2-S1 and N-b.

- The prototype is `r3-proto.html`, built by `build3.py` (round 2's build plus the patches below).
- `index.html` and the database were not touched.

## Fixes, in the CD's order

### 1. The name is clear before the first stroke

- At lock, `mountPencilStar()` measures two things:
  - the right edge of the leaned sketch's box;
  - the left edge of the name's first glyph box (a Range on the first character, via `textLeft()`).
- It sets `s0 = ceil(sketchRight + 3 − glyphLeft)`. On this layout that is **16px of content** for every name.
- The five strokes are remapped to start at `[s0, s0+4, s0+8, …, 50]`.
  - They are still front-loaded: the Λ is complete 8px after stroke 1 begins.
  - Stroke 1 still starts from its lower-left end, the point farthest from the name.
- **Tested** in 0.5px steps from content 0 to 56:
  - The first graphite appears at 16.5.
  - The minimum gap between the sketch box and the glyph box is **4.23px**, on "Café Pascal", "Järntorget" and "Ítalía".
- Stills: `r3-4x-clearance.png` (content 6/10/14/18/22 × 3 names). Content 6–14 shows no graphite at all.

### 2. No grain on orange

The unstar now runs in a fixed order, and each step is a function of travel, so a cancel plays it exactly backwards.

| Content (px) | What happens |
|---|---|
| 0–10 | **Colour only:** a smooth ink → `--ink-2` `color-mix`, with no filter |
| 10–16 | **Grain crossfades in**, only once the colour is 100% graphite (a second, grainy copy of the fill) |
| 16–50 | Erosion from the points inwards, and the smudge |

- **Popup rub** follows the same order: colour 0–72ms, then grain and erosion.
- Stills:
  - `r3-4x-unstar-4-8-12.png`
  - `r3-4x-popup.png`: unstar at +0 (orange), +20/+40 (browning, smooth), +70 (smooth graphite), +120 (grain).
- **There is no orange speckle in any frame.**

### 3. The rub-out is honest

- A **25% graphite ghost of the star** (`.sg-ghost`) rises over content 24–44 and holds until the commit.
- It **disappears, and the dust falls, on the 56px frame exactly.**
- Tested:
  - The ghost is 0.25 at 44, 50, 55 and 55.9, and 0 at 56.
  - The grain is 0 at 5, 9 and 10, and above 0 at 12.
- The dust now survives the settle: it is carried through the FLIP, so a release at 56 still shows it falling.
- Films:
  - `r3-film-unstar-honest.png`: 8 → 60, then the settle.
  - `r3-film-unstar-cancel50.png`: the ghost and ink fill back in, and the grain leaves before the orange returns.
  - 1x: `r3-1x-armslength.png`. The ghost is still a visible star at 44, 50 and 54.
- **Contrast.** The ghost is 1.41–1.51:1, so **it cannot clear 3:1.** That is intrinsic to "a faint remnant". It is a transient preview under the finger, not a state:
  - Both committed states still clear their bars: the printed star is at least 4.30:1, and "no star" is the name's own ink.
  - "Not yet committed" is also carried by the name slipped aside and by the missing dust.

### 4. Feathered edge

- The `clip-path` is gone. `.row-main` now uses an **8px `mask-image` linear gradient** on its trailing edge. The edge sits 12px before the stamp or X, so they are never under the mask.
- The feather **fades in with the first 8px of travel** (`--sg-fade-a`), so nothing changes at lock.
- The column borrows the 12px glyph gap on its left (a −12px margin and +12px padding, so there is no layout shift). That way the ink's 1.2× press-in isn't cut by the mask box.
- Films:
  - `r3-film-long-star.png` (long visited name)
  - `r3-film-long-unstar.png`
  - `r3-film-long-highlighted.png` (Stockholm `--figure-deep`)
- Letters now slip under the edge; nothing is sliced mid-glyph.

### 5. FLIP settle (R2-S1)

- On commit, `flipToFinal()` lays out the **final row on the release frame**: printed star in or out, final truncation, with the row's signature updated.
- It then slides the name and meta from the dragged offset to 0, using the first-glyph delta for the name and the box delta for the meta. The overlay star and the dust are moved over to the new row for the settle.
- **Tested:** the `h3` node at rest is the same node that existed at release+0, so nothing re-renders at rest. This holds for star and unstar, on long names.
- The last frames of `r3-film-long-*.png` (+170, +219 and settled) are glyph-identical.
- The teaching replay uses the same FLIP.

### 6. The popup has no empty slot on tap (N-b)

The hollow star stays in the button through the first 20ms of stroke 1: `r3-4x-popup.png`, star tap +0/+10/+20.

## Re-run

- **Touch suite: 88/88.** That is the round-2 cases plus FLIP ×2, clearance ×3 and honesty ×1, in both motion modes (`test2.js` with `PROTO=r3-proto.html` → `r3-test.log`).
- **UX's scripts** (`r3-ux2-touch.js`, `r3-ux2-flick.js`, `r3-ux2-popup.js` → `r3-ux2.log`):
  - S1: 6/6 touch and 3/3 mouse.
  - S2 press timeline: a 50ms tap presses on release for 100ms.
  - S3 matches `main` at every angle: 0/0/0/58/64/70px for 34/36/38/40/45/50°, 166px vs 165px for sideways-then-up, and 163px vs 160px for plain vertical.
  - A drag starting on or near the X never deletes.
  - `ux2-flick`'s real-time "flicks" are the 0.2 px/ms drags UX already flagged as untestable here.
  - Popup behaviour is unchanged.
- **Rows:** 56.00px at every drag step.
- **Tap delay: 0ms added.** Touchend → navigation measured 1.2–1.6ms, the same as baseline.
- **Contrast** (`r3-measure.json`, minimum across the 5 cities):

| Mark | Ratio |
|---|---|
| Graphite on paper / filed (token) | 6.17 / 5.53 |
| Graphite as rendered, 3x | ≥4.48 |
| Graphite as rendered, 1x | ≥3.67 |
| Ink on paper / filed | 4.79 / 4.30 |
| Highlighted row | 4.79 |
| Ghost | 1.41–1.51 (see §3) |

- **Hand-off: 0 of 2,916 pixels differ** on paper, filed and highlighted rows.
- **Impeccable:** exactly the 3 baseline findings.

## Only an iPhone can confirm

These carry forward, plus:

1. The `mask-image` feather under a transformed child doesn't flicker in WebKit.
2. The FLIP re-render on the release frame is invisible at 60/120Hz.
3. `color-mix()` in SVG fills.
4. `touchmove` stays cancelable, so the lock engages.
