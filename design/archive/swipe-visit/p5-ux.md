# Swipe LEFT to mark visited: p5 (core + wet halo bleed), UX verification

**How:** my own measurements in Chromium at 390px, using real CDP touch paths.

**Scripts:**
- **Held frames** (DOM, pixel contrast, OKLCH, ring and word coverage; normal and highlighted rows): `visit/me-p5a.js`
- **Release at ~40px:** `me-p5r.js` (normal, highlighted, reduced)
- **Performance:** `me-p5g.js` (trace) and `me-p5f.js` (rAF)
- **Un-visit ink at the lock:** `me-p5n.js` (p5 against p4)
- **Delete, combinations, glyphs, haptics and chroma, re-pointed:** `me-p5xd.js`, `me-p5xe.js`, `me-p5xb.js`, `me-p5d.js`, `me-p5e.js`
- **Gates:** re-run by me

## Verdict

**The mechanics and performance are approved.** No blockers.

**Two should-fixes:**
- **P5-S1:** honesty is not applied on highlighted rows.
- **P5-S2:** P4-N1 is not fixed: un-visit still steps darker at the lock.

On your three observations, (b) and (c) are real and have concrete fixes; (a) is mostly lightness, not hue.

## 1. Honesty

**Normal row** (held frames, 3x, darkest pixel against the field):

| Content travel | 8px | 12px | 16px | 20px | 24px | 32px | 40px | 48px | 54px | pressed |
|---|---|---|---|---|---|---|---|---|---|---|
| Contrast | 1.30 | 2.33 | 2.33 | 2.30 | 2.58 | 2.58 | 2.58 | **2.93** | **2.93** | 6.90:1 |
| Ring coverage | 0% | 0% | 0% | 0% | 0% | 0% | 1% | 40% | **71%** | 100% |

- Contrast ≤2.93:1 is confirmed.
- The core mask scale is 0.959 at 54px (<1), so **the ring is never closed** before the press. Its ends are still soaking.

**P5-S1 (should-fix): on a highlighted row the pre-commit ink is at full pressed strength.**

| Content travel | 12px | 16px | 24–54px | pressed |
|---|---|---|---|---|
| Contrast | 4.76 | 4.79 | 4.80–4.84 | 4.79:1 |

- **Ring coverage reaches 92% at 54px**, where the normal row reaches 71%.
- So on the focus row, the pre-commit stamp is as strong as the finished one, and nearly closed. There, only the missing field and pop tell "not yet" from "done".
- **Fix:** apply the same ≤~3:1 cap to the highlighted row's paper ink. Mix paper toward `--figure-deep` in the same three steps (for example 45 / 55 / 62%). Then re-measure the ring coverage.

**Release at ~40px** (every frame sampled):

| Row | Field colours seen | Ever visited | Haptics | Bleed gone | Final state |
|---|---|---|---|---|---|
| Normal | 1 | no | none | 184ms after lift | not visited |
| Highlighted | 1 | no | none | 184ms after lift | not visited |
| Normal, reduced motion | 1 | no | none | on the lift frame | not visited |

**It dries away completely every time.**

## 2. Performance (200 rows, dsf 3, 4× CPU throttle, same gesture, 2 runs each)

**Trace, whole gesture:**

| Build | Raster worker | Main-thread paint | PrePaint |
|---|---|---|---|
| **p5** | **24–27ms** | **127–135ms** | 265–305ms |
| p4 | 43–48ms | 229–247ms | 79–85ms |
| `main` | 55–59ms | 293–317ms | 295–299ms |

**The designer's claim holds:** p5's raster time is the lowest of the three, below `main`, and its paint is about half.

**Main-thread rAF:**

| Build | p50 | Frames over 33ms | Maximum | Long tasks |
|---|---|---|---|---|
| p5 | 16.7 | 4 / 10 | 33.4 / 50ms | 0 |
| `main` | 16.7 | 4 / 12 | 50ms | 0 |

- Same distribution as `main`.
- No frame over 50ms in either build. I didn't reproduce the designer's 50–67ms lock or press frame, but I don't doubt it under different load.

**WebKit:** the build is exactly what the CD asked for: a static SVG data-URI mask, a scale-only carrier and a constant halo blur. **P4-S1 is resolved.** The remaining iPhone check is rendering crispness (mask scaling shimmer), not cost.

## 3. Kept behaviour

**Delete D1–D10:**
- 0 / 2 / 3px from the X deletes; 4–40px never does.
- 21 of 21 non-tap paths gave 0 deletes.
- An X tap at 0 or 100ms after a stroke navigates; at 300ms it deletes.
- A start at x = 372 (EDGE) is inert; a start at 364 visits.

**Glyph rule: 0 still-frame changes** in both modes (visit, back-off and un-visit on long names).

**Reduced motion:** scale 1.000 and no pop. The finger-driven bleed stays, and a release clears it on the lift frame.

**Other checks:**

| Check | Result |
|---|---|
| Haptics | visit → `ink`, un-visit → `erase`, cancel → none, in both modes |
| Starred + visited rows | `SV → S- → --` |
| Rapid strokes across rows | All land |
| Popup Mark Visited | Live sync; popup stays open |
| Scroll-then-tap | Navigates |

**Un-visit chroma:** every frame after the lock is ≥**0.0448** OKLCH, hue 245–250°. The only frames below that are the resting stamp before the lock (0.034).

**P5-S2 (should-fix): P4-N1 is not fixed in pixels; the un-visit darkens before it pales.** Pixel ink at 1px steps across the lock is identical in p5 and p4:

| | Rest | c4–c5 | **c6 (first locked frame)** | c16 | c24 |
|---|---|---|---|---|---|
| L / C | 0.401 / 0.035 | unchanged | **0.274 / 0.050** | 0.341 | 0.472 |

- The un-visit path starts from **full navy**, ΔL −0.13 **darker** than the resting stamp, and only then pales.
- In Chromium the 4px ramp completes inside the first delivered move, because moves inside the ~15px touch slop aren't reported. On an iPhone it will be a 4px darkening.
- Either way, the stamp **darkens as it's lifted**, which contradicts "lift" and is the opposite of the erase direction.
- **Fix:** start the oklch path *at the resting ink's lightness and chroma* (L ≈ 0.40, C ≈ 0.035, hue 247), and pale from there. Never pass through a darker value.
- V22 should assert that L is monotonically non-decreasing from rest.

## 4. Gates (re-run by me)

| Gate | Result |
|---|---|
| Star touch suite (`test6.js`, `PROTO=p5v.html`) | **84/84** |
| `flip6.js` | **8/8**; its at-rest control fails **4/4** |
| Visit gate (`vtest.js`) | **93/93** |
| Popup-open | **20/20** |
| Impeccable (`p5-proto.html`) | **exactly the 3 baseline findings** |

**curve8** (frames at ≥1.3×; 5 interleaved runs; `OUT` set):

| Build | Row | Highlighted row | Popup |
|---|---|---|---|
| `main` | 11 ×5 | 11, 11, 10, 11, 11 | 9 ×5 |
| p5 | 11, 11, 10, 11, 11 | 11 ×5 | 9 ×5 |

That is jitter only, **not a regression**.

**Not re-run by me:** `haptic8`, `tap8` and N8-a.

## 5. Your three observations

### (a) "Cornflower" pre-commit ink against the pressed navy

The pre-commit core ink, by pixel OKLCH (normal row):

| | L | C | h |
|---|---|---|---|
| Pre-commit core (12–54px) | **0.65–0.70** | **0.042–0.046** | 249 |
| Pressed stamp | **0.40** | **0.035** | 247 |

- **Hue is the same** (Δh = 2°).
- The difference is **lightness, ΔL ≈ +0.28**, plus **about 25% more chroma**.
- A light, slightly more chromatic blue on warm cream reads *brighter and bluer* than the dark slate, partly through simultaneous contrast with the warm field. That is what you're seeing, and it's strongest in the 12–24px blot and core, where it's lightest relative to its chroma.
- **Does it read as the same ink? Not quite.** It reads as a lighter blue ink, not navy that hasn't soaked in yet.
- It is also physically backwards: **wet ink reads darker and glossier** and lightens as it's absorbed.
- The ≤3:1 cap forces lightness, so fix it through chroma, not lightness. **Hold C at the pressed value (≈0.035), not 0.045.** At L 0.65–0.70 that keeps it "pale navy" rather than "cornflower".
- **The trade-off:** the un-visit ghost needed ≥0.045 to avoid grey at *lower* opacity, but the bleed is a different path with a different lightness. At C 0.035 and L 0.67 on cream it measures as desaturated blue, not grey; judge on the device.
- This is a dial, not a blocker.

### (b) "SIT" on the highlighted row at 16px

**Real, and the dense-blot-first rule is not met on every row type.**
- At 16px the core reveal is already at scale 0.332 on **both** rows. Word-band ink is 32% (normal) and 31% (highlighted).
- On the normal row the blot is the *same colour* as the core and fully opaque, so it hides the letters inside it. "Blot first" holds only by coincidence of colour.
- On the highlighted row the paper blot is feathered and the paper letters sit inside it at full strength (4.79:1), so "SIT" shows.
- **Fix:** hold the core reveal inside the blot's solid radius until the blot has fully formed. For example, clamp the core scale to ≤ the blot's 45% solid stop until about 18px, on every row type. Better, make it a rule in V13: the core mask radius stays ≤ the blot's solid radius while content is below about 18px.

### (c) Ring barely there while the word is strong: stamp soaking in, or floating text?

**Measured:** word-band ink is 53–59% from 24px onward, but **ring coverage is 0% until 40px**, then 40% at 48px and 71% at 54px.

**For 24–40px it reads as floating text, not a stamp soaking in.** The oval is the stamp's identity, and it's missing for most of the drag.

- **Physically,** a stamp's raised ring and letters meet the paper *at the same moment*. Ink wicks from every inked line at once; it doesn't spread from the centre outward.
- The centre-out mask was the CD's direction, and it's right for the *spread*. But the mask is an ellipse with the stamp's own aspect (2.25:1), so it reaches the ring's top and bottom arcs (only 11px from centre) at almost the same scale as the ends. The whole ring therefore arrives late, together.

**Cheapest fix, keeping centre-out:** make the reveal mask **rounder** (aspect about 1.3–1.5 instead of 2.25).
- The ring's **top and bottom arcs** then ink early (from about 24px), along with the word, while the **ends still soak** until the press.
- That reads as "a stamp soaking in from where it touched", keeps honesty (the ends are open at 54), and costs nothing in performance: it's the same static image with a different ellipse.

**Final call to the CD.**

## iPhone checks (additions)

1. The pre-commit ink reads as the stamp's navy, not as a brighter blue (dial: C 0.035–0.045).
2. On the focus (highlighted) row, the pre-commit stamp is visibly weaker than the pressed one (after P5-S1).
3. Un-visit never darkens at the lock; it only pales (after P5-S2).
4. The scaled data-URI mask renders crisply, with no shimmer while scaling.
