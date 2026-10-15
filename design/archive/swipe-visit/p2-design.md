# Swipe LEFT to mark visited: perfection round 2 (p2)

**Diff:** `p2-proposed.diff`
- Scope: `index.html` only, against main `741731a`. `index.html` is unchanged through `35887d1`.
- Size: 6 hunks, 322 changed lines.
- Verified with `git apply` then `cmp` against `p2-proto.html`, which `buildp2.py` builds from main.

Everything in p1 stands except the items below.

## Blocker 1: the carried stamp read as a grey, disabled pill → now an opaque navy object

**Face**
- The carried (and lifting) stamp gets a `::after` fill in the row's own field colour (`--vs-fill`, read at lock). The fill uses `border-radius: 50%` and `inset: -0.5px`, so it covers the dotted track's outer edge.
- The fill sits under the ink inside the stamp's own stacking context. Nothing behind the stamp can show through it.

**Ink**
- `color-mix(in srgb, navy 70%, field)`. It is opaque, never alpha.
- Measured hue 242.3° against the pressed stamp's 245.4°, so Δh = 3.1° (V13; the target was ≤10°).
- Chroma is 0.025 against 0.034 for the pressed stamp, so the lifted stamp reads as the same navy, a touch lighter because it isn't printed yet.
- Highlighted rows mix `--paper` ink instead.

**Shadow**
- A `box-shadow` on that fill. It paints only OUTSIDE the silhouette, so it can never halo through the face.
- Tighter and lower-alpha than p1: offset 1–3.5px down, blur 1–3.5px, alpha 0.10–0.20.
- Scale 1.15× and the p² descent are unchanged.

**Appearance**
- The stamp is never a see-through ramp. It is whole and opaque from 6px, once the name's tail has feathered.
- While the X fades, the stamp slides out from behind the X's edge (see N1).

**At contact:** the fill and shadow are removed, and the ink returns to the CSS 82% navy. That is exactly the in-flow stamp, confirmed by the hand-off check (V8, 0/41,328 px).

**Strips:** `p2-carry-4x.png` and `p2-release-4x.png`.
- 136–302ms: the carried face is solid navy on paper with a cast shadow below it.
- No frame shows grey.

## Blocker 2: letters changed on a still name at release → now on the press frame

**Visit**
- On the contact frame, `.vs-reserve` gives `.location-actions` exactly the visited width. That width is `padding-left: 72+8+4 = 84px`, and the carried stamp is keyed to the X, so it doesn't move.
- The text column therefore re-truncates *inside the press*, on the same frame as full ink, the field wash and the squash.
- The name's feather is switched off on the same frame; the column already ends 12px before the stamp.
- A lift back below the hysteresis restores the old layout on that lift frame.
- Release then renders an identical row: `renderCard()` changes nothing, so there is no sweep and no clear.

**Un-visit**
- The post-release feather sweep is kept, and the ellipsis leaves under it.
- Under reduced motion there is no sweep, so the wider layout lands on the lift frame instead (the stamp and the field change on that frame).

**Strip:** `p2-release-4x.png`, long name. "Muse" becomes "Art M…" at 356ms, the press frame. Nothing changes from lift (668ms) to rest.

**Rule and test (V18).** A per-rAF sampler of the name's width across three cases: visit, press-then-back-off, and un-visit, all on long names, in both motion modes. Result: **0 still-frame changes**. Every change sits on a press or lift frame, or under the sweep. The flip rule for the star is unchanged (`flip6.js` 8/8).

## N1: no stamp over the fading X

- For the X's 80ms fade, the carried stamp is `clip-path`-clipped at the X's left edge, minus 1px.
- The clip is computed in the stamp's local, rotated and scaled space, then repainted once the fade ends.
- V19: 5 frames where both are visible, worst overlap −0.99px, so the stamp is always clear of the X.

## N3: on un-visit, the lift leads and the fade trails

- Scale and shadow ramp linearly from the lock.
- The ink lightens, opaquely, toward the field, trailing the lift by 12px: from 82% at 12px to a 30% ghost at 44px. It is gone at 56px.
- Strip: `p2-unvisit-3x.png`. It rises first (104–154ms), then pales (205–304ms).

## Delete threshold

`DELETE_TAP_SLOP` stays at 4px, as an iPhone check with a dial of 3–6px. A touch on the X that moves more than 4px does nothing at all: it neither deletes nor navigates.

## Gate

**Star gate**
- "84 + 8 (+ N8-a)"
- popup-open 20/20
- dust 0
- rows 56.00px
- tap delay ~1.6ms
- hand-off 0/5,184
- haptic and tap checks
- curve row 10/3, popup 9/3 (10–11 is frame-phase jitter; main alone also measured 10)
- **Impeccable: baseline 3**

The results are in `p2-gate.log`, `p2-test.log`, `p2-flip.log` and `p2-dust.log`.

**Visit gate `vtest.js`: 81/81 in both motion modes.** New or updated cases:
- V13: opaque navy face, Δh ≤ 10°
- V14: text ≥8px clear of the stamp's rotated, squashing box; measured 9.25px
- V15: pixel-identical text
- V17: contact detected by the face going transparent; 4 squash frames
- V18: the glyph rule
- V19: the X overlap
- D1–D10 unchanged

## Strips (real time)

- `p2-carry-4x.png`: stamp column at ~4x
- `p2-release-4x.png`: long name; text tail and stamp at ~4x
- `p2-visit-3x.png` and `p2-visit-1x.png`: long name
- `p2-unvisit-3x.png` and `p2-unvisit-4x.png`
- `p2-cancel-3x.png`
- `p2-ios-overlays-1x.png`: menu and suggestions stay open

## iPhone checks (add to the p1 list)

- The carried stamp is navy and opaque, never grey.
- On a long name the ellipsis lands with the press. Nothing changes when you let go.
- A wobbled tap on the X (3–6px dial) neither deletes nor navigates.

## Dials

- `CARRY_INK` 0.7 (0.65–0.8)
- shadow alpha 0.10–0.20
- `FADE_LAG` 12
- `DELETE_TAP_SLOP` 4 (3–6)
- p1's other dials are unchanged
