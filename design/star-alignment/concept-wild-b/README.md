# Star alignment — wildcard exploration B (concept stage)

Independent, parallel wildcard track to `concept-wild-a`. Owner's problem:
the shipped `.location-card.is-starred .row-main { padding-left: 26px }`
shifts the whole text block *only* on starred rows, with no visible grid
reason for the jump — "pushes all the content over," feels arbitrary.

Brief for this track: diverge hard from "leading glyph in a reserved
column" (that's what's already shipped, and presumably what a second
attempt converges on by default). All four variants below are built as
real, screenshotted mockups under `design/star-alignment/concept-wild-b/`,
reusing `index.html`'s actual tokens (`--paper`, `--ink`, `--figure-deep`,
the `--s*` spacing scale, `--font-ui`, `--col-glyph`/`--col-action`), at
390px, Reykjavík ink. Concept stage only — no pixel-perfect polish, no
`index.html` changes.

Rows shown in every variant: a short starred name (Café Loki), a long
starred name that truncates (Fisketorget Seafood Restaurant & Bar
Uptown), a plain unstarred row (Hallgrímskirkja), a starred +
`.highlighted` focus row (Sundhöllin Thermal Baths), and a plain visited
row (Kolaportið Flea Market) to check the field/stamp interplay.

---

## V1 — Corner badge

`v1-corner-badge.html` / `.png`

A small filled circle (15px, `--ink`, 2px `--paper`/`--paper-filed` ring)
pinned to the row's own top-right corner via `position: absolute`,
floating **over** the row rather than inside its box model. The grid
(`--col-glyph` | `1fr` | `auto`), the `h3`'s available width and the
`row-meta`'s available width are byte-identical whether the row is
starred or not — nothing reflows, because the badge isn't part of layout
at all.

**Rationale:** this is the most literal answer to "never shift the grid"
— the star genuinely isn't in the grid. It reads like a notification
badge on an app icon, which is a familiar enough pattern that it doesn't
need explaining.

**UX self-check:** the badge sits in the row's top ~15px while the
delete button is vertically centered in the 56px row, so their touch
targets don't overlap — confirmed in the screenshot, badge and X don't
collide even on the long-name row. Tap-to-navigate is untouched (badge is
`pointer-events` moot here since it's decorative and outside the
interactive elements). One real concern: on the long-name row the badge
sits close to where the ellipsis lands, and on a genuinely long name it
could visually crowd the truncated end — worth widening the `right:`
offset if that's confirmed on real names. A11y: `aria-hidden`, with the
existing `.sr-only` ", starred" suffix in `row-meta`/`h3` doing the real
announcement, same pattern as shipped.

---

## V2 — Starred section, no per-row glyph

`v2-starred-section.html` / `.png`

Drops the per-row mark entirely. Starred places live in a pinned cluster
at the top under a small rule ("★ STARRED · 2"); everything else follows
under a quieter "ALL OTHER PLACES" rule. A starred row is visually
**identical** to an unstarred one — no indent, no glyph, nothing.

This directly tests against
[`design/list-ordering/proposal.md`](../../list-ordering/proposal.md),
written independently for a different owner problem (list order reads as
arbitrary). That doc's §2 candidate C — **starred-first, then
unvisited-before-visited, then recency** — already proposes starring as
the primary sort key. If candidate C ships, per-row starred styling stops
carrying unique information (position already tells you), and this
section-header treatment is the natural display companion: the indent
question doesn't get *answered*, it gets *removed*.

**Rationale:** the cheapest possible fix is not fixing the per-row glyph
at all — solve a layout problem by deleting the thing that causes it,
once the ordering problem is solved anyway.

**UX self-check:** tap-to-navigate and delete-tap-safety are completely
unaffected (rows are stock `.location-card`s). The real risk is
*legibility of "why is this starred"* — with the mark gone, only the
section a row lives in tells you it's starred, so a user scrolling mid-
list (past the section boundary) can't tell without scrolling back up.
That's an honest cost, not a defect: it only works if the section
boundary itself is the trusted source of truth, so this variant is a
package deal with the ordering change, not a standalone drop-in. Also:
the CLAUDE.md open item explicitly notes "Star… (batch) mode was
dropped… 'Starred first' remains a candidate ordering for this pass" —
this variant is one further step past that, arguing the ordering *plus*
this display change together might obsolete the whole "how do we mark a
starred row" question.

---

## V3 — Reserved margin (always-on column)

`v3-reserved-margin.html` / `.png`

A genuine 4th grid column, 18px wide, added to **every** row — empty on
an unstarred row, holding the star on a starred one. `.location-card`
becomes `grid-template-columns: var(--col-glyph) auto 1fr auto`, and that
`auto` (the star slot) never appears or disappears; only its contents do.

**Rationale:** this is the literal, no-tricks fix for the owner's actual
complaint. "Pushes all the content over" happens today because the
column is *conditional*; here the column is *unconditional*, so nothing
about a row's layout depends on its starred state. It's the closest
variant to "boring and correct" of the four — deliberately included
because sometimes the most surprising move after three rounds of clever
gesture/animation work is the plain grid fix nobody tried because it
"costs" 18px on every single row forever, starred or not.

**UX self-check:** cleanest of the four in the screenshot — 56px rows,
consistent alignment, no crowding even on the long-name row (it just
truncates a little earlier, same tradeoff CLAUDE.md already accepted for
the printed star and the visited stamp). Tap-to-navigate, delete safety,
a11y: no change from shipped. The one real cost is permanent: every row,
including ones that will never be starred, gives up 18px of name width
forever. Worth checking against how many places actually end up starred
in practice (CLAUDE.md's own visited-badge section already logs this
same tradeoff class: "~12 chars earlier… 17% of current names exceed
that").

---

## V4 — Typographic only, no icon

`v4-typographic.html` / `.png`

No icon anywhere. A starred name gets a small run-in label ("STAR —") in
`--figure-deep` plus a heavier weight (800 vs 600) on the name itself —
the star as an eyebrow on the word, not a separate mark.

**Rationale (and an honest reversal):** pushed hardest for "genuinely
different" per the brief — this is the only variant with zero glyph
anywhere, resting entirely on type. But looking at the rendered
screenshot, **it's weaker than expected**: "STAR —" reads as a small
label/tag, not a mark, and it's noisier next to the category glyph than
any of the icon-based variants. It also directly re-opens a decision
CLAUDE.md's Pencil Star Round 4 already made and justified in writing:
*"the star is the ENTRY's mark, not a character in the name" — because
ellipsis clips from the end, a trailing/inline mark can become the part
that's cut, and inline placement breaks the scannable column down the
list.* A run-in *prefix* (as here) survives truncation better than the
rejected suffix idea, but still gives up the "column of stars scanned
down the left edge" property the shipped design was built around. Filed
as a real, honestly-worse idea, not silently dropped.

---

## Top pick: V3 (reserved margin), with V2 as a "if ordering ships" companion

**V3** is the strongest standalone fix: it solves the exact stated
problem (the shift) with the smallest, most predictable mechanism (an
always-present grid column), at a known, already-accepted cost
(truncation), and it doesn't require any other change to ship. It reads
as "a grid that was always meant to have 4 columns," not a patch.

**V2** is the most interesting *if the owner is open to a bigger move* —
it doesn't just fix the star's alignment, it questions whether a per-row
mark is needed at all once starred-first ordering (already proposed,
independently, in `design/list-ordering/proposal.md`) ships. Worth
surfacing to the owner as a package: "we could stop fixing the star's
position and instead stop needing a position for it."

**V1** (corner badge) is a solid, safe middle ground if the owner wants
something visually lighter than V3's permanent margin, and doesn't want
to touch list ordering.

**V4** is included for completeness of the "genuine surprise" mandate,
but is the one idea in this set I'd actively recommend against — it
reopens a settled, documented decision for a weaker result.
