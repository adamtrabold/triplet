# Star alignment — wildcard concepts (concept stage, track A)

> Note (2026-09-29): `CLAUDE.md`'s shipped-feature history and open items, cited below as "CLAUDE.md", now live in `docs/shipped.md` and `docs/backlog.md`.

Problem: `.location-card.is-starred .row-main { padding-left: 26px }` shifts the
whole text block only on starred rows, so the list's left text edge isn't a
clean grid — it jogs 26px depending on state. Owner: "pushes all the content
over," "looks weird either way."

Mandate for this track: skip the safe "leading glyph in a reserved column"
fix (that's the sibling track) and try genuinely different places/mechanisms
for "starred-ness" to live, while keeping the app's established grammar —
**printed = facts, stamped = visited, pencilled = what you care about** — and
leaving the swipe gesture itself untouched. Concept stage only: judged on the
idea, not polish.

All three reuse real tokens/markup lifted from `index.html` (`:root` custom
properties, `badgeHtml()`'s ring+glyph shape, the real `#g-star`/`#g-restaurant`
paths, the real `.row-stamp` visited badge). Rendered at 390px width with
headless Chromium. 5 rows per variant: short starred name, a long starred
name (truncation pressure), a plain unstarred row, a highlighted/focused
starred row, and a starred **+ visited** row (to stress-test collision with
the shipped stamp/field).

Rejected as seeds before building (for the record, not built): a full-row
background tint (already spoken for — that's exactly what `.is-visited`
means on this app, so reusing it for "starred" would blur the two states
this design system deliberately keeps orthogonal); folding the star into the
visited-stamp's own ring geometry (one mark trying to carry two independent
booleans reads as one state, not two — the CD's whole reason for scoring the
Pencil Star up was that stamped/pencilled stay separate marks).

---

## Variant B — Dog-ear fold

`variant-b-dogear.png`

A small triangular corner-fold at the row's top-right, in `--figure-deep`
(the same ink the printed star used before round 5 moved it to black) —
literally "I dog-eared this page." No padding change anywhere; it's a
`position:absolute` decoration with `overflow:hidden` on the row.

**Rationale:** the guidebook metaphor the app already leans on (Baedeker
stars, passport stamps) has a real physical analog for "I marked this one" —
folding the corner of a page — that's arguably a more legible piece of
"grammar" than a printed glyph, and it costs zero layout.

**UX self-check (concept-level only):**
- Tap-to-navigate: unaffected — decorative, `pointer-events` inert relative
  to the row's own click handler.
- Delete safety: **flag.** The fold sits in the same top-right corner the
  action column occupies, and CLAUDE.md already documents the delete X's
  touch-adjustment zone overspilling ~9–12px beyond its own box. A second
  visual element wedged into that same corner, even non-interactive, adds
  visual noise exactly where mis-taps are already the known risk. Not
  disqualifying at concept stage, but the corner would need to be measured
  against the real delete hit-box before this could ship.
- A11y: fine — decorative/aria-hidden, same as every other row mark; the
  `.sr-only` text stays the one source.

---

## Variant C — Left-edge spine stripe

`variant-c-stripe.png`

A 4px `--figure-deep` bar flush to the row's true left edge (not the 16px
gutter — the actual card boundary), full row height, present only when
starred. No text-column change at all: the stripe lives in space the text
never touched.

**Rationale:** this is the one closest to "make starred-ness a property of
the row, not the text" — same move the app already made for `.is-visited`
(a field-level cue) and `.highlighted` (a full-bleed background), just a
thinner, single-edge version of that same precedent. Reading down the list,
a column of stripes on the left edge is as scannable as a column of stars
would have been, without ever touching where the name starts.

**UX self-check:**
- Tap-to-navigate: unaffected.
- Delete safety: unaffected — opposite edge from the action column entirely.
- A11y: the stripe alone doesn't carry the "starred" state to a screen
  reader any more than the current star does (both are decorative; both
  rely on the existing `.sr-only` text) — no regression, but also note it's
  a genuinely faint cue in isolation (a colored line is a weaker glyph than
  a star-shape) — same open question the CD would ask at 9/10: is a stripe
  legible enough on its own, or does it need the printed-star-in-flow as a
  companion at close range (title bar / popup) while the stripe alone
  carries it at list-scan distance? Worth a real "does it read as
  *starred* vs. *just an accent*" gut-check with the owner before sinking a
  round into polish.
- One honest tension: CLAUDE.md's own comment on `.location-card.highlighted`
  calls full-bleed edge-breaking "the only element permitted to break the
  16px gutter." This stripe is a second, much smaller edge-break. Worth
  flagging to the CD explicitly rather than quietly setting a precedent.

---

## Variant D — Star joins the action cluster (the wildcard)

`variant-d-action-star.png`

Instead of leading the text, the star moves to the **trailing** action
column — the same side the visited stamp and delete button already live in
— rendered as a small solid 16px star sitting before the stamp (or before
delete, when unvisited). This is a structural inversion, not a cosmetic
tweak: right now the app splits its two non-interactive marks across two
edges (star leads the text on the left, the visited stamp trails on the
right). This collapses both into one column, so a starred+visited row reads
as two little badges lined up together — "everything that's true about
this place, in one place you can scan."

**Rationale:** genuinely the most surprising of the three, and it directly
answers "either way it looks weird" by removing the star from the text
column altogether rather than repositioning it within that column. It also
turns starred+visited into one legible cluster instead of two separate
signals on two edges of the row.

**UX self-check:**
- Tap-to-navigate: unaffected — still decorative.
- Delete safety: **real flag, the most serious of the three.** CLAUDE.md
  documents `--col-action` as deliberately "ONE control — delete is the
  row's only action," with the stamp already an exception living there as
  a passive mark. Adding a *second* passive mark to that column measurably
  crowds the one interactive control in the row, in the same column
  CLAUDE.md already flags as having a soft, overspilling hit-box. In the
  5th row (starred + visited) the screenshot shows star, stamp, and delete
  all within about 70px — tighter than today's stamp-only version. This
  doesn't disqualify the concept, but it's the one place where "concept
  wins on the merits" and "concept survives a real touch-target check" are
  most likely to pull apart, and that check needs to happen before this
  goes further than concept stage.
- A11y: fine at concept level — still one `.sr-only` source, still
  decorative marks.

---

## Top pick: Variant C (left-edge stripe)

It's the only one of the three that touches **neither** the text column
**nor** the action column — it solves the actual complaint (the text edge
jogging based on state) by moving the cue somewhere the text never
occupies, without creating a new crowding risk next to delete (unlike B and
especially D). It also has real precedent in this exact file
(`.highlighted`'s full-bleed edge-break), so it's not inventing a new kind
of move, just a quieter version of one the app already trusts.

Honest caveat: the stripe is the *least* stamp-like of the three — it's the
one idea here that's furthest from "printed/stamped/pencilled" as discrete
marks, and closer to a plain UI convention (flag/priority bar). If the CD or
owner wants the star to keep reading as an object with a shape (a star),
not just a strip of color, that's a real argument for a companion glyph
elsewhere (e.g. still shown in the popover/title, just not indenting the
list row) — worth raising explicitly rather than silently dropping the
star-as-shape idea.

D is the more interesting swing and is worth showing to the owner
specifically because it reframes the layout question ("where does starred
live") rather than just relocating the same glyph — but it's the one most
likely to need real touch-target measurement before it survives contact
with the delete-safety bar this app holds everything else to.
