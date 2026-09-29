# Swipe LEFT to mark visited: p7, the P6-N1 fix (compositor-only ink deepening)

> **Historical record (note added 2026-09-29).** Instructions below to update `CLAUDE.md` were carried out at the time; those entries now live in `docs/shipped.md` (feature history/spec), `docs/iphone-checks.md` and `docs/backlog.md`. Don't re-apply them — later rounds may have superseded them.

**Deliverables:**
- `p7-proposed.diff`: `index.html` only, against main `aa0445e`. It is the full change (p6 plus this fix): 7 hunks, 329 changed lines.
- `p7-proto.html`: built by `buildp8.py`, and matched by `git apply` then `cmp`.

**Scope:** nothing else from p6 changed.

## The fix

**1. The core-strength step is now an opacity crossfade.**
- The `vs-s2`/`vs-s3` class step (which re-coloured the core through `--vs-core-ink`) is gone.
- The core reveal now holds **three pre-rendered copies** of the stamp, one per ink strength (`--vs-ink-1..3`, the same p6 values), stacked.
- The upper two (`.vs-k2`, `.vs-k3`, `will-change: opacity`) fade in by opacity:
  - smoothstep over q 0.31–0.39;
  - smoothstep over q 0.66–0.74;
  - that is, around the old 0.35 and 0.70 steps.
- The halo and blot stay at the lightest ink, fixed.
- Mid-drag, the bleed now writes only transforms and opacities.

**2. The name's feather no longer moves mid-drag.** Found while measuring: the feather edge tracked the halo's growing reach, so `.row-main`'s mask gradient was rewritten on every move. That is a text repaint the class step was masking. It now sits at the bleed's full reach from the start. It is written only while it pulls in over the first 6px, then never again until the press.

## Performance

UX's harness: 200 rows, dsf 3, 4× CPU throttle, a pre-commit wiggle and then a commit, 6 runs.

**How a frame is counted as "mid-drag":** it starts after the lock and ends before the press (the `ink` marker). Frames at the lock, the press and the release are excluded. `perf7.js` = `me-p5f.js` plus markers.

| Build | Runs | Mid-drag frames >33.5ms | Other slow frames |
|---|---|---|---|
| **p7** | 6 | **0 / 0 / 0 / 0 / 0 / 0** | only the lock, press and release frames (50–67ms, same as `main`) |
| **p7** (second set) | 6 | **0 / 0 / 0 / 0 / 0 / 0** | |
| p6, same session | 6 | 0 in all 6 | |
| p6, earlier sets | 6 + 2 | 1 mid-drag frame in 1–2 runs | |

p6's hitch is intermittent, which fits the CD's "1 of 6". p7 had 0 in 12 of 12 runs. The structural cause is also removed: V23 asserts **0 class changes and 0 non-transform/opacity style writes** on the bleed mid-drag, plus feather writes only while it pulls in. A control run on p6 fails V23 (6 and 4 class changes, full and reduced motion).

Trace, whole gesture (`p7-perf-trace.log`, final file, 2 runs each):

| Build | Raster worker | Paint |
|---|---|---|
| **p7** | **20–21ms** | **74–84ms** |
| p6 | 26ms | 121–134ms |
| main | 45–51ms | 350–360ms |

One earlier trace set on this machine was noisy: p7 64–174ms and p6 32–103ms in the same pass. It was discarded, and the clean re-run is above.

## Ink values: re-measured with `p6-held`'s script (`m6a.js`) at 3x, darkest pixel

**Normal row:**

| | c12 | c24 | c32 | c40 | c48 | c54 | Pressed |
|---|---|---|---|---|---|---|---|
| p6 contrast | 2.27 | 2.57 | 2.57 | 2.57 | 2.92 | 2.92 | 6.90 |
| **p7 contrast** | 2.27 | 2.50 | 2.60 | 2.66 | 2.92 | **2.96** | 6.90 |
| p7 chroma | 0.035 | 0.034 | 0.030 | 0.032 | 0.034 | 0.034 | 0.035 |
| Ring, p6 → p7 | 0 | 0 → 0 | 28 → 26% | 42 → 42% | 57 → 57% | 69 → 69% | 100% |

**Highlighted row:**

| | c12 | c24 | c32 | c40 | c48 | c54 | Pressed |
|---|---|---|---|---|---|---|---|
| p6 contrast | 1.86 | 2.11 | 2.11 | 2.11 | 2.40 | 2.40 | 4.79 |
| **p7 contrast** | 1.86 | 2.02 | 2.11 | 2.15 | 2.40 | 2.40 | 4.79 |
| Ring, p6 → p7 | 0 | 0 | 25 → 25% | 42 → 42% | 56 → 56% | 68 → 67% | 100% |

- Every held value is within one contrast step of p6.
- The crossfade makes the transitions continuous (c24 and c40 fall mid-fade), and a stacked copy at full opacity darkens anti-aliased edges very slightly (c54 2.92 → 2.96, still ≤3:1).
- Un-visit is unchanged: pixel L stays at 0.401 to c12, then only rises (`p7-unvisit-px.log`).

## Gates (final `p7-proto.html`, md5 checked after the run)

- **Star gate:** "84 + 8 (+ N8-a)" passes. The touch suite is 84/84 and `flip6.js` is 8/8 (its control fails 4/4, as designed). N8-a passes on iOS, Android and reduced motion.
- **Other star checks:**
  - popup-open 20/20
  - dust: 0 frames over text; lift → move ≤127ms
  - rows 56.00px
  - tap delay 1.4–1.9ms
  - hand-off 0/5,184 in all four cases
  - `haptic8`: 0 focus frames, 0 document clicks, overlays open, reduced motion still ticks
  - `tap8`: 1 trusted toggle per tap
- **Star curve (`curve8.js`), 10 runs, `OUT=` set:**

  | Case | ≥1.3× frames |
  |---|---|
  | row | 11 in 9 runs, 10 in 1 |
  | highlighted row | 11 in 8 runs, 10 in 2 |
  | popup | 9 in all 10 |

  This is the jitter UX has recorded on `main`.
- **Visit gate (`vtest.js`): 95/95.** That is p6's 93 plus the new **V23** (P6-N1) in both motion modes.
  - V23: 0 class changes and 0 other style properties on the bleed mid-drag; feather writes only during the 0–6px pull-in (4 mutations).
  - Negative control: V23 fails on p6.
- **Impeccable:** baseline 3.

## Swipe-left visit: iPhone checks (for `CLAUDE.md`, replacing any p2 carry checks)

1. **(Gate)** A left stroke from the X or the row's right half visits. A 4–12px nudge on the X never raises delete; a still tap does.
2. The pre-commit reads as **ink bleeding into the paper**: a drop at the centre that soaks outward in the stamp's own navy, thinner. Not fog, not a focus pull, not a brighter blue.
3. At about 54px it still looks unfinished (the ends are soaking), and the press snaps it crisp with the grow-shrink, settling at the stamp's tilt.
4. Let go early: it dries away with no stain.
5. On the focus (highlighted) row the bleed is visibly weaker than the pressed stamp.
6. No hitch as the ink deepens mid-drag, on a long list.
7. Un-visit lifts with the star's erase pop, pales, and never darkens or goes grey.
8. The scaled mask and fibre edge render without shimmer.
9. **Haptics:**
   - Swipes are silent on iOS 26.5+, including your iOS 27. This is the platform limit: WebKit makes a script-driven switch toggle untrusted, so it can't tick. It is not a bug.
   - On Android, or on iOS ≤26.4, there is one tick on the press and a double tick on the lift.
