# Impeccable review report

sha256: b0e566e5e803db19f148e2769920dc6a5329232445b252074fab3058e4218afc
file: index.html
generated: 2026-10-07
commands: critique,audit

Scope: the Hanging Tag + brand-orange star build (`popup-hanging-tag`; `docs/shipped.md` "Hanging Tag + orange star"), reviewed against `CLAUDE.md`, `docs/owner-taste.md` and the owner's decisions, which override the skill's defaults. Evidence: this packet's `shots/`, the build's stills (`design/popup-hierarchy/build/stills/final/`), the source, and the gate's detector output (`gate.txt`: static 3/3, runtime 13/13 baseline, 0 new).

Disposition key: `fixed <file sha>` (applied in this file) · `accepted: <who> <why>` (already decided) · `backlog: <ref>` · `n/a: <why>`.

## critique

Status: done
Verdict: DEGRADED: single-context (no sub-agent tool exposed to the builder; Assessment A was written before reading the detector output). Product-specific, no blocking issue; heuristics 30/40 (Good). What remains is signal redundancy the owner has already ruled on, plus two list-follow details.

Design specificity: authored for this product -- a map callout recast as a printed luggage tag in the inspo's grammar (die-cut, eyelet, claim stub, rubber stamp, paper tooth). Detector: 0 new findings.

Heuristics (0-4): 1 Visibility 3 · 2 Real world 4 · 3 User control 3 (x, map tap, Esc, one-tap swap, re-tap undo, focus return) · 4 Consistency 3 · 5 Error prevention 3 · 6 Recognition 3 · 7 Flexibility 3 · 8 Minimalist 2 (starred shown 4x) · 9 Error recovery 3 · 10 Help 3. Total 30/40.

Questions skipped: the brief forbids critic questions; triage is by the builder against the owner's decisions.

| # | Severity | Finding | Where | Disposition |
|---|---|---|---|---|
| C1 | P2 | Starred is signalled four times on a starred place (pin star, band, orange star, pencil circle + STARRED): redundant state (heuristic 8). | tag band + Star segment | accepted: owner "orange for star / tag top all the way imo" + "Not sure on the circle we can keep for now" (circle provisional; count reported) |
| C2 | P2 | No address line on any real tag today (0/202 rows have short_address/address_details). | `tagAddress()` | accepted: owner/coordinator -- owner runs `tools/short-address-backfill.html`; no heuristic fallback; top of `docs/iphone-checks.md` |
| C3 | P2 | When the list is not lowered, a map-tapped pin's navy row is selected but may sit scrolled out of view (only a compressed list scrolls it in). | `tagOpened()` | backlog: docs/backlog.md Hanging Tag follow-ups (widening the owner's compressed-list rule is a UX call) |
| C4 | P3 | TYPE/PLAN label and value are both 11px, differing only by weight. | `.tag-lab`, `.tag-val` | accepted: CD "raise the 8px label" + the Impeccable 11px floor; shared `--ink-2` is the tier-2 colour by design |
| C5 | P3 | Visited dark stickers with orange stars are the heaviest pins ("checked stronger than open"). | map pins | backlog: icon-system revision (owner 2026-10-07, docs/backlog.md priority) |
| C6 | P3 | Two greens on the map (moss attraction, spruce nature), told apart by glyph only. | `CATEGORY_COLORS` | backlog: icon-system revision note (CD) |

## audit

Status: done
Verdict: 17/20 (Good) -- A11y 3, Performance 4, Responsive 3, Theming 3, Integrity 4. Integrity: pass (one brand-orange source; the shipped stamp and star reused; no decorative content). One a11y issue fixed in this file; the rest are minor.

| # | Severity | Finding | Where | Disposition |
|---|---|---|---|---|
| A1 | P2 | The Visited toggle's name flipped "Mark visited" -> "Visited" on top of `aria-pressed` (state announced twice); signed out, the Star's flipped "Star"/"Starred". A toggle keeps one name; `aria-pressed` carries the state. | `buildPopupHtml()` starName/visName | fixed b0e566e5 (names "Star" / "Visited"; ", sign in to use" when signed out) |
| A2 | P3 | The tag container takes focus on open (`tabindex=-1`, no outline): no visible ring until the first Tab. | `.tag` | accepted: a named group as the focus target (VoiceOver reads the place); inner controls have `:focus-visible`; a ring round the tag reads as a selection box (owner-taste "no heavy boxes") |
| A3 | P3 | Directions opens Apple Maps without an "opens Maps" hint. | `.popup-directions` | n/a: shipped behaviour; label is the owner's ("Directions is fine") |
| A4 | P3 | The list header's scroll shadow relies on `:has()`; without it the shadow just doesn't show. | `#locations:has(#locationsList.scrolling)` | accepted: degrades to no shadow, rows unaffected; iOS targets are 26.x |
| A5 | P3 | Literal rgba in the tag shadow / warm edge instead of tokens. | `.tag-shadow` | accepted: the shipped sticker edge/shadow literals (STICKER.EDGE); tokenising shadows is an app-wide pass |
| A6 | P3 | Segment labels can wrap at the 240px minimum tag width (screens < 272px). | `.tag-seg` | n/a: below every supported iPhone (320px+ gives a >= 288px tag) |
| A7 | P3 | Positive: the tag's drop-shadows live on a static layer, so animations inside never re-render a filter (curve8 popup 10/3). | `.tag-shadow` | n/a: positive finding |
