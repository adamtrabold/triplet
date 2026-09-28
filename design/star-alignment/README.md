# Star alignment — scope correction (owner, 2026-09-28)

The star's position — leading the text, before the name, in the list row
— is confirmed correct and NOT being relitigated. The only problem is the
reserved-space *mechanism*: `.location-card.is-starred .row-main {
padding-left: 26px }` only applies that indent on starred rows, so a
row's name starts at a different x depending on starred state. Fix the
grid, don't move the star.

Also grounded in `design/inspo/project/` (vintage travel labels, ledger-row
motifs) going forward — not just index.html's existing selectors.

## Surviving candidates (actually address the alignment problem)

- `concept-legacy/variant-1-nested-silent` — reserved 18px column inside
  `.row-main`'s own grid, ports the popup's existing `18px auto` pattern
  onto the list row. Silent (no glyph) when unstarred. **Top pick per the
  legacy-track agent.**
- `concept-legacy/variant-2-nested-always` — same column, but always shows
  a glyph (hollow/filled). Matches what the popup already does today;
  costs a small amount of always-on visual noise (the same tradeoff the
  owner already rejected once for the visited dot).
- `concept-legacy/variant-3-outer-column` — same idea promoted to the
  outer row grid, a peer of `.row-badge`. Needs explicit `grid-column`
  pins on neighboring cells to avoid an auto-placement bug; more
  structurally fragile than 1/2 for the same result.
- `concept-wild-b/v3-reserved-margin` — independently converged on the
  same fix (a genuine 4th grid column, always present). Corroborates 1/3
  above from a separately-run exploration.

## Off-scope (solved a different problem — relocating the star, not fixing its grid)

- `concept-wild-a/variant-b-dogear`, `variant-c-stripe`,
  `variant-d-action-star` — corner fold, edge stripe, and moving the star
  into the trailing action cluster.
- `concept-wild-b/v1-corner-badge`, `v2-starred-section`,
  `v4-typographic` — absolute-positioned badge, dropping the per-row mark
  entirely in favor of a starred-only section, and a text-label-only
  treatment.

Kept on file as record of the exploration, but not candidates to build
from — none of these were what was asked.
