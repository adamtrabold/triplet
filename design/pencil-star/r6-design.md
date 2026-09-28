# Pencil Star, round 6: the dust never touches the text

**Scope:** one defect plus hygiene. Everything else from round 5 is unchanged.

- `r6-proto.html` is built by `build6.py` on top of `r5-proto.html`, with every anchor asserted.
- `r6-proposed.diff` is against `main` (`ab82197`): 26 hunks, 261 lines. It applies cleanly (`git apply`) and yields `r6-proto.html` byte-for-byte.
- `index.html` is untouched.

## The fix: the dust is brushed off the page

**I chose option (a), with one change to it.**
- The specks start at the star's lower-left inner corner.
- They are swept *left*, 11–13px, fast at first, into the 12px gutter between the category badge and the text column.
- No text ever enters that gutter: at rest and in every slide, text starts at the column edge.
- They fade as they go: 200–240ms, at 90% opacity at the 30% point.

**Why not the literal ≤2px drift:**
- With the star in P1's slot, the name reaches x≈8 about 40ms after the dust falls. A ≤2px speck would have to vanish in about 40ms, which is too fast to see.
- Brushing the crumbs off the page is the natural end of rubbing something out.

**Why not option (b)** (the name waits for the dust to clear): it pushes lift → name moving past 300ms, so it can't meet the ≤150ms target.

**Two supporting changes:**
- **The dust keeps its place when the live row hands back its borrowed 12px.** `releaseStarRow()` shifts any falling specks by the measured change in the box, so they can't jump 12px right into the text.
- **Lift → name moving ≤ 150ms.** After an unstar is released, the rub completes by lift+180ms at the latest (`RUB_AFTER_LIFT`; it has already been running during the drag). The name leaves at dust − 100ms, as in N4-b.

## Measurements

### Specks over text

`dust6.js` → `r6-dust.json`. Every rAF frame at 60Hz, counting any speck with opacity above 0.05 whose box overlaps the stroked row's `h3` or meta box.

**Coverage (100 runs):**
- Unstar: long and short names, visited and unvisited, all 5 cities, normal and highlighted rows, both motion modes, natural swipe.
- Unstar, brisk swipe: 5 cities × normal and highlighted.
- Star (it has no dust): 5 cities × normal and highlighted.

| Build | Frames with a speck over text | Worst lift → name moving |
|---|---|---|
| **r5** | **459** | 198ms |
| **r6** | **0** | **117ms** |

- r6's lift → name moving ranges from 11 to 117ms in full motion. Reduced motion lands in one frame.
- Every unstar still unstars, and every star stars.

### Real-time strips (CDP screencast, per-frame counts in each caption)

| Strip | Speck-over-text frames |
|---|---|
| `r6-realtime-unstar-long-3x.png` | **0** |
| `r6-realtime-unstar-long-1x.png` | **0** |
| `r6-realtime-unstar-short-3x.png` | **0** |
| `r6-realtime-unstar-long-4x.png` (the dust frames, next to the text) | **0** |
| r5 reference, same strips | **9** (`r5-realtime-unstar-*.png`) |

## N5-a: the FLIP proof, rewritten

`flip6.js` replaces `flip5.js` and is part of the suite. On every rAF frame of a real-time stroke it logs:
- the `h3` signature (node, text, `clientWidth`);
- the name's **measured** screen x (a Range on the first glyph, via `getBoundingClientRect`, not the transform string);
- the truncation edge against the mask's fade start.

**It asserts, in motion:**
- every swap is at least 3 motion frames before the last motion frame;
- any truncation-edge change has both the old and new edges at or past the fade start;
- the name moves on at least 3 frames after the swap.

**It asserts, under reduced motion:** the swap *is* the landing frame. The name is displaced before it, and still at its final x from then on.

**Results:**
- **8/8 pass**: star long visited, unstar long, star short and unstar short, in each motion mode. The swaps sit 12–13 frames before the last motion.
- **The negative control fails 4/4, as it should.** It re-times the swap to happen at rest and is reported as "swap within the last 3 motion frames; 0 motion frames after".

## Re-run on `r6-proto.html`

| Check | Result |
|---|---|
| Touch suite (`test6.js` = round 5's cases, with R2-S1 moved to `flip6.js`), both modes | **84/84**, plus `flip6.js` 8/8 (and its control failing as designed) |
| UX's `ux2-touch` / `ux2-flick` / `ux2-popup` | Match `main`: S1 6/6 and 3/3; S3 at 34–50° 0/0/0/58/64/65 vs 0/0/0/58/65/70 (run-to-run ±5); sideways 165 vs 166; delete safe; popup taps (`r6-ux2.log`) |
| Popup-open suite | **20/20** |
| Rows | 56.00px |
| Tap delay | **0ms added** (1.1–1.7ms) |
| Hand-off | **0/5,184 px** (paper, filed, highlighted Stockholm and Reykjavík) |
| Contrast, 5 cities | Unchanged from round 5: ink star 14.69 / 13.17 / 11.74; highlighted 4.79; pressed graphite 9.44 / 8.46; light graphite 6.17 / 5.53 (token); ghost 1.41–1.51 |
| Impeccable | **Exactly the 3 baseline findings** |

## Dials

Unchanged from round 5, plus two new ones:

| Dial | Default |
|---|---|
| `RUB_AFTER_LIFT` | 180ms |
| Dust sweep | 11–13px |

## Only an iPhone confirms

1. The swept dust reads as eraser crumbs brushed off the page, not as a glitch in the gutter beside the badge.
2. The name leaving within about 120ms of lift feels immediate.
