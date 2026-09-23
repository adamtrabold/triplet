SCORE 7/10

# R1 — Creative Director review

## Verdict
The approach is right, and so are most of the numbers. A CSS double oval in one ink, set in the row's own type voice, placed in the fixed action column, is the correct structure. The craft is careful: 56px on every row, spacing on tokens, no new Impeccable findings. It is not shippable yet, for three reasons:
1. There is a real interaction blocker (UX B1).
2. The stamp is the loudest mark in the row, louder than the place name it annotates.
3. It is about 80% of the way to a passport stamp. It still reads partly as a very well-made UI pill: a crisp, fully opaque, machine-identical tag sitting *on* the row, rather than ink pressed *into* the paper. The inspo is printed ephemera, meaning single ink, sitting in the paper. That quality is the missing 20%.

## What's working (keep these)
- **Structure.** Light track outside, then a gap, then a heavier solid rule, then condensed bold caps. That is the Tokyo reference, correctly boiled down to the one-word scale Berlin's "DEPARTED" pill proves out.
- **Ring width.** A 2px ring that matches `badgeHtml()`'s rim, so the two stamped objects on a row share a weight.
- **Type.** Archivo at 75 width, 700, 10px, 0.08em, with no second typeface.
- **Colour.** Navy on paper and paper on `--figure-deep`. The highlighted state is the best-looking render in the set; it looks like the Savoy label reversed.
- **Size.** 72x32 is justified. The explore shots show 64 crowding V and D into the curve, so I am not reopening it.
- **Placement.** Placing it in `.location-actions` keeps the X at the same x on every row and needs no grid hack. The fixed-x column of stamps is the scan win the old inline dot never gave.

## Dotted vs dashed: **dotted**, plus UX's 1x fallback
Dotted is the brand answer. The Tokyo reference is perforation, and dashed reads as a coupon cut line, which belongs to a different object (retail, not border control). The owner is on a 3x iPhone, where dotted is clean, and WebKit draws round dots, which will only flatter it.

I accept UX's `@media (max-resolution: 1dppx) { .row-stamp { border-style: dashed; } }` as a *rendering* fallback, not a second design. At 1x the dotted track turns to haze that looks like an anti-aliasing fault (confirmed in `r1-crop-dotted-1x.png`), and one line fixes that. Comment it that way in the CSS. Use the `(max-resolution: 1dppx), (-webkit-max-device-pixel-ratio: 1)` pair so Safari on a 1x external monitor is covered as well.

## Direction for R2, in order

1. **Fix B1 (blocker).** In `createCard()`, change `!e.target.closest('.location-actions')` to `!e.target.closest('.delete-btn')`. Comment that only delete is excluded from row-press, because non-interactive decoration now lives in the cluster. Leave `createShapeCard()` alone. Re-run `ux-probe.js` and show the post-scroll stamp tap navigating.

2. **Make it ink, not a component. This is the main design move this round.**
   - (a) Render the stamp ink at reduced strength with `color: color-mix(in srgb, var(--navy) 82%, transparent)` and `mix-blend-mode: multiply` on paper rows. Token-derived, so no ad-hoc hex. The row's bottom rule and the paper tone should read *through* the stroke the way stamp ink sits in paper. On `.highlighted`, use paper at about 90%, with **no** multiply, since multiply on light-on-dark does nothing useful. Verify the text still clears 4.5:1 at 10px bold on `--paper`, `--paper-raised` and the lowest-contrast city's `--figure-deep` (Stockholm), and report the numbers.
   - (b) This also answers N1, the hierarchy problem. The name must win the first read and the stamp the scan. **Do not** thin the ring below 2px: it would break the rim match, and the 1.5px explore row read weak. Let ink strength carry the change. If 82% is not enough to get the h3 back on top at 390@3x, try 75% before touching geometry.
   - (c) Show a **side-by-side variant** of rotation: the current fixed −3°, and a deterministic per-row angle hashed from `loc.id` within **−1.5° to −3.5°**. The range is capped so the 1x jaggies the designer saw at −4° can't return. The same place always gets the same angle, with no randomness per render. A column of stamps at identical angles is what makes it look stamped by software. The owner picks; I lean toward per-row jitter if it holds the fixed-x scan column (centre x must not move, and rotation is about the centre, so it will not).
   - **Do not** add distress textures, SVG noise, masks or extra copy (stars, dates, a second word). The matchbook and label references are clean single-ink print. At 32px, extra glyphs turn into mud.

3. **Apply S1.** Add `margin-right: var(--s2)` on `.row-stamp` only, which gives about 11px from the stamp to the X hit box. The owner has already rebuilt this row once because of delete mis-taps, so this is not optional.

4. **Truncation against real data (S2).** Use the real long names, not the demo list. In the 375 and 390 renders, include at least "Swedish Museum of Performing Arts Scenkonstmuseet", "Stockholm Public Library Stadsbiblioteket", "The Handknitting Association of Iceland" and "Mother restaurant Copenhagen", both visited and unvisited. Report the name-column width after S1 (expected ~194/179px) and the character count that fits.
   - My read of the operator data: about 26% of names are over 20 characters, so roughly a fifth to a quarter of *visited* rows will truncate at 375. That is acceptable for a list whose rows open a map on tap. Keep 72px and do not shrink the stamp.
   - The redundant trailing city in names is out of scope. Mention it in one line to the owner as a data follow-up, because cleaning it would recover most of those truncations for free.

5. **Deliverables for R2.**
   - Crops at 3x and 1x for: paper row, highlighted row, pressed row, and a highlighted row in the lowest-contrast city.
   - Full-list 375@3x and 390@3x renders with real long names.
   - A crop that puts the h3 and the stamp together, to judge hierarchy.
   - Row heights re-measured, still 56px everywhere.
   - An Impeccable run.
   - The final proposed diff, updated to include the B1 change, the stale-comment cleanups (N4) and the media-query fallback.
   - Drop the dashed variant from the main mockup. Keep one small 1x-fallback crop only.

6. **Carry forward to implementation, not this round.** Log N2 in CLAUDE.md open items: a possible mini-stamp for the popup's visited state. No toggle animation (N5 agreed).
