SCORE 9/10

# R2 — Creative Director review

## Verdict
Approved for implementation, subject to the conditions below. Every R1 direction landed, and two of them were improved by evidence rather than followed blindly: the 100% paper exception on the highlighted row, and the snap-zone finding that re-grounds S1.

In `r2-hierarchy-row-3x.png` and `r2-list-hashed-3x.png` the place name now clearly wins the first read, and the stamp wins the scan. At 82% the navy settles into a slate that reads as stamp ink, a little faded and sitting in the paper, rather than as a saturated UI chip. That was the missing 20% in R1, and it is now there.

It is not a 10 for two reasons:
- The delicate points (WebKit dotted ellipses, rotated 10px text inside a composited layer, and iOS hit-testing) can only be settled on the owner's iPhone.
- The stamp still costs visited rows about 12 characters of name. The data backs that trade (17% truncate, zero ambiguous collisions per UX's live query), but it is a real cost, not a free one.

## (1) Did every R1 direction land?
Yes, all of them.

- **B1 (blocker):** fixed, with a genuine A/B probe against the real listener logic.
- **Ink and hierarchy:** fixed at 82%. 75% wasn't needed, which is correct because more fade would start to read as disabled.
- **Tilt:** both options shown, and the centre x is proven constant.
- **S1 margin:** applied.
- **Dotted track with a 1x fallback:** done and verified. At 1x, `r2-crop-paper-1x.png` renders clean dashes and the haze is gone.
- **Real long names:** tested.
- **Comments:** all rewritten.
- **"Don'ts":** respected; no texture and no extra copy.
- **Row height:** 56px everywhere. **Impeccable:** net 0 new findings.

## (2) Multiply blend: **DROP IT**
It was my suggestion, and the evidence says it does nothing.
- It changes contrast by about 0.3, and it sits about 10px clear of the only thing under it (the row rule). No viewer will ever see the difference.
- The ink effect comes entirely from the 82% alpha.
- Meanwhile multiply creates a stacking context and can promote the rotated stamp to its own composited layer on iOS. That is the likeliest cause of soft 10px caps, which is the one real quality risk left.

Paying a rendering risk for an invisible effect is bad craft, so remove `mix-blend-mode` from `.row-stamp` and the `mix-blend-mode: normal` reset from the highlighted override. Keep the solid `var(--navy)` line placed before `color-mix()` as the pre-iOS-16.2 fallback. Updated ratios: 7.48:1 on `--paper` and 7.94:1 on `--paper-raised`, both comfortably AA. Correct the CSS comment to match.

## (3) Fixed vs per-place tilt: **recommend per-place**
Show the owner both, and lead with per-place.
- The difference is subtle, and subtle is the point. A column of identical −3° stamps is the one tell of "applied by software". The 2° per-place spread in `r2-tilt-compare-3x.png` reads as the same rubber stamp pressed by hand, without ever looking misaligned.
- The column's centre x is measured constant, so the scan is untouched.
- It is deterministic from `loc.id`, so there is no wobble on re-render.
- The −3.5° cap keeps 1x crisp.
- The cost is an eight-line pure helper plus one inline custom property carrying a number, which is not an injection surface.
- If the owner prefers fixed, delete the helper and the inline style, and the CSS default of −3° takes over. Nothing else changes.

## (4) Highlighted row at 100% paper: **approved**
Correct deviation from my direction. My 90% suggestion fails AA in 4 of 5 cities, so accessibility wins. 100% paper is exactly the h3's own pairing on that row, and it reaches 4.79:1 in the worst city (Stockholm). There is only ever one focus row, so a full-strength stamp there reads as part of the focus emphasis, not as inconsistency. Visually it is the strongest state in the set (`r2-crop-highlighted-stockholm-3x.png`). Adopt UX's N2 wording so the comment gives both reasons: AA, and the focus-state emphasis.

## Conditions for the index.html implementation
1. **Apply the diff in `r2-design.md` §1–§7 as written, with these edits:**
   - (a) Drop `mix-blend-mode` from `.row-stamp` and from the highlighted override. Update the `.row-stamp` comment to say "navy at 82% (7.48:1 on --paper)" and remove the word "multiplied".
   - (b) Adopt UX S2: take the Chromium-specific "~12px" out of the CSS comment and use UX's browser-neutral wording.
   - (c) Adopt UX N2: the highlighted-override comment states both AA and focus-state emphasis.
2. **Ship per-place tilt (`stampTilt()`) as the default.** Tell the owner, in one line, that fixed −3° is a two-line revert if they prefer it. Show them `r2-tilt-compare-3x.png`.
3. **Keep the B1 fix exactly as specified in §5,** with its comment. Leave `createShapeCard()` untouched.
4. **After editing, verify in the real `index.html`, not the mockup.**
   - Render with Playwright by loading `index.html` and injecting fake rows: unvisited, visited, visited+highlighted, visited+pressed, and a shape row.
   - Row height must be exactly 56px for every state at 375 and 390.
   - `borderStyle` must be dotted at 3x and dashed at 1x.
   - Impeccable on `index.html` must return exactly the 3 baseline findings.
5. **Update CLAUDE.md in the same commit:**
   - Add a shipped-work entry. It must record: stamp replaces `.row-visited`; ink at 82% with no blend, and why multiply was dropped; the 100% paper exception; dotted with a 1x dashed fallback; per-place tilt; and the B1 root cause and fix.
   - Add the delete snap-zone open item, using UX S1's wording.
   - Add a follow-up for the popup mini-stamp (N2 from R1).
   - Add a one-line data follow-up: names that repeat the city.
   - Mark the entry "not yet checked on a real device".
6. **Hand the owner UX's three-step device smoke test.** Paste it as text in chat, because they are on a phone:
   - Scroll, then tap a stamp: the map should navigate.
   - Tap just left of the X: it should navigate, not raise the delete confirm.
   - Check that the stamp text is crisp at arm's length.

   If the text is soft on the device, the next lever is to try `rotate` with `backface-visibility` unset, or to reduce the tilt range. Multiply is already gone, so it is no longer a suspect.
7. No toggle animation. Don't restyle the popup in this change.
