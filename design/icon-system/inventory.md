# Triplet icon inventory (2026-10-13)

Every icon, glyph and mark in `index.html` today. Mechanical inventory: no design judgements, nothing in the app changed.

- Canvas (Design artifact, one artboard per group + real-app crops): https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW
- Static overview: `inventory-3x.png` (1170 px wide, phone-readable, tall)
- Every image: `inventory-png/<png>.png`, rendered from index.html's own sprite, marker functions and CSS in headless Chromium at deviceScaleFactor 12 (1 css px = 12 image px). Context screens: `inventory-png/context/` at 3x, 390 px wide.
- Source data for all three: `inventory-data.json`. Capture scripts: see "How it was made" below.
- Line numbers are `index.html` lines as of this commit; "CSS n" means the rule at line n.
- Colours: `--paper` #F2EBDD, `--paper-raised` #FAF5EA, `--hair` #D8CEBA, `--ink` #1A1A18, `--ink-2` #5A564C, `--navy` #12293F, `--brand-orange`/`--star` #EE7434, `--brand-orange-deep`/`--star-deep` #A8400C, sticker ink #3A4C5B; category inks in `CATEGORY_COLORS` (2818).

## Category glyphs (11)

11 sprite symbols (<symbol id="g-*">, viewBox 0 0 24 24). Filled silhouettes in currentColor, square corners; only district and street are stroked. Colour = the category ink (CATEGORY_COLORS). Shown alone in the ink, then at the three sizes they render at: 12 (filter chip), 18 (inside the 24px row badge and the 24px near map pin), 23 (inside the 32px selected pin). Far pins (16px) drop the glyph.

| Name | Where used | Drawing style | Renders at | Line(s) | PNG (css px) |
|---|---|---|---|---|---|
| g-restaurant | Filter chip, row badge, map pin | Fill, currentColor, square ends; ink wine #7A2436 | 12 / 18 / 23 px | 2495, ink 2819 | `cat-restaurant` (22x22) |
| g-cafe | Filter chip, row badge, map pin | Fill (3 paths); ink #6E4C22 | 12 / 18 / 23 px | 2496, ink 2820 | `cat-cafe` (22x22) |
| g-bar | Filter chip, row badge, map pin | Fill; ink #3D5A7A | 12 / 18 / 23 px | 2497, ink 2821 | `cat-bar` (22x22) |
| g-attraction | Filter chip, row badge, map pin | Fill (2 paths); ink moss #547326 | 12 / 18 / 23 px | 2498, ink 2822 | `cat-attraction` (22x22) |
| g-nature | Filter chip, row badge, map pin | Fill (2 paths); ink #1E3A2B | 12 / 18 / 23 px | 2499, ink 2823 | `cat-nature` (22x22) |
| g-shopping | Filter chip, row badge, map pin | Fill (2 paths); ink lavender #8A7AA8 | 12 / 18 / 23 px | 2500, ink 2824 | `cat-shopping` (22x22) |
| g-area | Filter chip, row badge, map pin | Fill (frame + 2 bars); ink #2B3F52 | 12 / 18 / 23 px | 2501, ink 2825 | `cat-area` (22x22) |
| g-hotel | Filter chip, row badge, map pin | Fill (path + circle); ink #2E2433 | 12 / 18 / 23 px | 2502, ink 2826 | `cat-hotel` (22x22) |
| g-other | Filter chip, row badge, map pin | Fill, one circle r5; ink #4F5450 | 12 / 18 / 23 px | 2503, ink 2827 | `cat-other` (22x22) |
| g-district | Filter chip, row badge (diamond shell), approx pin, plan shape stop | STROKE 2.5, dash 6 4, square caps, no fill; ink teal #328177 | 12 / 18 / 23 px | 2504, ink 2828 | `cat-district` (22x22) |
| g-street | Filter chip, row badge (diamond shell), approx pin, plan shape stop | STROKE 3, round caps, dash 2 8, no fill; ink #5E2C17 | 12 / 18 / 23 px | 2505, ink 2829 | `cat-street` (22x22) |

## Category badges and pins (badgeHtml) (5)

One function draws the row badge and the map pin: a paper field (#F2EBDD), a 2px category-ink rim, the glyph inside. Pins below are rendered by markerIcon() itself, on the harness's blank map tone (#E8E4DA; the real app shows OSM tiles).

| Name | Where used | Drawing style | Renders at | Line(s) | PNG (css px) |
|---|---|---|---|---|---|
| Row badge, all 11 | List rows (Places and Plans) | Circle, rim 2 stroke, paper field; district/street rows use the DIAMOND shell | 24 px in a 28px column | badgeHtml 4517, planLead 5598 | `badges-row` (336x36) |
| Map pin, near (all 11) | Map, zoom 12 and closer | Circle, rim 2, glyph 18 | 24 px | markerIcon 4850 | `pins-near` (332x32) |
| Map pin, far (all 11) | Map, below zoom 12 (GLYPH_MIN_ZOOM) | Circle, rim 2, NO glyph; 24px tap area | 16 px | 4851-4852 | `pins-far` (332x32) |
| Map pin, selected (all 11) | Map, the open tag's pin | Inverted: ink field, rim 2.5, paper glyph 23 | 32 px | 4864-4870 | `pins-selected` (340x78) |
| Map pin, approximate (all 11) | Map, places saved as "(approx.)" | Circle rim 2, dashed 3 3 | 24 px | markerKind 4499, 4530 | `pins-approx` (332x32) |

## Actions and controls (16)

Inline SVGs in the markup and in JS strings. Mostly stroked line icons in currentColor, stroke 2 to 2.5, square caps unless noted.

| Name | Where used | Drawing style | Renders at | Line(s) | PNG (css px) |
|---|---|---|---|---|---|
| Account (person) | Top right floating button (signed in) | Stroke 2, no linecap set; glyph orange on navy; button edge is the scalloped CSS mask | glyph 24 in a 50px button | 2554-2558, mask 385 | `ctl-account` (56x56) |
| Add (+) | Top right floating button | Stroke 2.5, round caps; orange on navy, scalloped mask | glyph 22 in a 50px button | 2568-2570 | `ctl-add` (56x56) |
| Add, open (x) | Same button while the add form is open | Stroke 2.5, round caps; navy on orange (inverted) | glyph 22 in a 50px button | 8424-8425 | `ctl-add-open` (56x56) |
| Sort (up/down arrows) | List header | Stroke 2 shafts + filled triangle heads | 18 px | 2645-2650 | `ctl-sort` (22x22) |
| Filters (sliders) | List header | Stroke 2 lines + three filled r2 knobs | 18 px | 2653-2660 | `ctl-filters` (22x22) |
| Locate (crosshair) | List header | Stroke 2.5, circle r3 + 4 ticks, square caps | 20 px | 2663-2669 | `ctl-locate` (24x24) |
| Close tag (x) | Hanging Tag, top right | Stroke 2.2, round caps, path M5 5L19 19M19 5L5 19 | 14 px in a 44px target | 5078, CSS 1932 | `tag-x` (18x18) |
| Directions (g-compass) | Hanging Tag, Directions segment | Circle stroke 2 + filled needle; viewBox cropped to 1.5 1.5 21 21 | 20 px | 2512, 5090 | `tag-directions` (24x24) |
| Empty list (g-compass) | "Nothing here yet." list state | Same symbol, full viewBox, colour --hair | 28 px | 9124, CSS 1513 | `empty-compass` (34x34) |
| Sort menu check | Sort menu, the current option | Stroke 2.25, square caps, M3.5 12.5l5.5 5.5L20.5 6 | 16 px | 5364, CSS 1176 | `sort-check` (20x20) |
| Plan check | Plans ledger, the current plan | Same path as the sort check, stroke 2.25 | 16 px | 5541, CSS 1591 | `plan-check` (20x20) |
| New plan (+) | Plans ledger, "New plan" | Stroke 2.25, square caps | 16 px | 5542 | `plan-plus` (20x20) |
| Plan more (three dots) | Plans ledger, rename/delete | Fill, three circles r1.9 | 18 px | 5543, CSS 1608 | `plan-more` (22x22) |
| Plan picker chevron | Plans: the plan picker | Stroke 2.25, square caps, M5 9l7 7 7-7 | 16 px | 6335, CSS 1558 | `plan-chev` (20x20) |
| Leaflet zoom + / - | Map, top left (Leaflet's own control) | Text glyphs, Lucida Console 22px bold, black on white | 30 x 30 per button | Leaflet default | `ctl-zoom` (40x70) |
| Leaflet attribution flag | Map attribution, bottom right (Leaflet's own) | Leaflet's built-in Ukraine-flag SVG | 12 x 8 px | Leaflet default | `ctl-attrib-flag` (16x12) |

## States: star, open star, stamp, check (15)

The star is one path (g-star / g-star-open, rounded joins). Visited is the passport stamp in lists and the tag, the sticker on the map.

| Name | Where used | Drawing style | Renders at | Line(s) | PNG (css px) |
|---|---|---|---|---|---|
| g-star (symbol) | Every star: row, map, cluster, tag, add form | Fill, rounded points (arc corners in the path); orange --star #EE7434 | 10-20 px | 2510 | `g-star` (22x22) |
| g-star-open (symbol) | Tag Star segment (unstarred), add form | Stroke 2, round joins, no fill | 16-20 px | 2511 | `g-star-open` (22x22) |
| Row star | List row, before the name (starred places) | g-star fill --star + --star-deep keyline | 18 px | 8202, CSS 1437 | `row-star` (22x22) |
| Row star, selected row | Selected (navy) row | g-star fill --star, no keyline | 18 px | CSS 1497 | `row-star-selected` (22x22) |
| Tag star, starred | Hanging Tag, Star segment (band style) | g-star; segment reads STARRED | 20 px | 5066, CSS 2018-2029 | `tag-star-starred-svg` (24x24) |
| Tag star, open | Hanging Tag, Star segment (unstarred) | g-star-open, stroke 2, --ink | 20 px | 5066, CSS 2019 | `tag-star-open-svg` (24x24) |
| Add-form star (open) | Add form, Star toggle | g-star-open, stroke 2 | 16 px | 2622, CSS 643 | `form-star-svg` (18x18) |
| Pencil Star, drawing | List row, mid swipe-right (transient) | Five tapered graphite strokes with grain filter (generated) | 18 px (the row star's box) | pencilStarMarkup 7221 | `pencil-star-drawing` (24x24) |
| Pencil Star, ink landed | List row at 56px of swipe, before release | Lands as the printed orange star | 18 px | 7221, 7427 | `pencil-star` (24x24) |
| Visited stamp | List row action column (visited places) | CSS: 2px ring border + dotted SVG-mask track (pathLength 166.29), check + VISITED 10px/700, navy at 82%, per-place tilt | 72 x 32 px | 8198, CSS 1316-1390 | `row-stamp` (81.72x44.08) |
| Visited stamp, selected row | Selected (navy) row | Same stamp, paper ink | 72 x 32 px | CSS 1496 | `row-stamp-selected` (81.72x44.08) |
| Stamp check | Inside the visited stamp | FILLED path (STICKER_CHECK.row), softened square corners | 8 px | stampCheckSvg 8132, 4634 | `row-stamp-check` (10.45x10.45) |
| Mark visited check (outline) | Hanging Tag, Visited segment (not visited) | Same check path, STROKED 2.05, round joins, no fill | 20 px | 5076 | `tag-ochk` (24x24) |
| Visited segment, stamped | Hanging Tag, Visited segment (visited) | The row stamp at 1.1x | 79 x 35 px | 5074, CSS 2039 | `tag-stamp` (105.34x60) |
| Sticker checks near / far / row | Map sticker face (near 9px, far 6.2px); row size 8px | FILLED paths, cream on sticker ink #3A4C5B | 9 / 6.2 / 8 px | 4631-4635 | `sticker-checks` (55.19x21) |

## Map marks: stars, stickers, plans, clusters (19)

All rendered by the app's own marker functions on the blank harness map tone.

| Name | Where used | Drawing style | Renders at | Line(s) | PNG (css px) |
|---|---|---|---|---|---|
| Map star sizes | On pins: far 16, near 24, selected 32 | g-star, --star fill, 1.5 --star-deep keyline, paper halo stroke | 10 / 12 / 16 px | markerStarHtml 4559, CSS 1782 | `map-star-sizes` (104x48) |
| Starred pin, near | Map | Badge + star on the upper-right shoulder | 24 px pin | 4876 | `pin-star-near` (40x40) |
| Starred pin, far | Map | Ring only + 10px star | 16 px pin | 4876 | `pin-star-far` (40x40) |
| Starred pin, selected | Map | Inverted badge + 16px star | 32 px pin | 4876 | `pin-star-selected` (48x48) |
| Visited sticker, near | Map, visited places | Dark sticker #3A4C5B, cream filled check, peeled flap, soft contact shadow (SVG filters) | 24 px | stickerPinParts 4832 | `sticker-near` (40x40) |
| Visited sticker, far | Map, below zoom 12 | Same, check 6.2px | 16 px | 4832 | `sticker-far` (40x40) |
| Visited sticker, selected | Map, open tag's pin | Same + cream ring printed on the face | 32 px | 4832 | `sticker-selected` (48x48) |
| Visited + starred sticker | Map | Sticker + star with thin halo, set out on the shoulder | 24 px | stickerStarHtml 4849 | `sticker-starred` (40x40) |
| Sticker flap per place | Map: corner, angle and size hashed from the place id | Six real places side by side | 24 px | stickerCorner 4645 | `sticker-corners` (200x40) |
| Plan stop pin | Map, Plans view | Category ring, number in place of the glyph (13px/700 --ink-2) | 24 px | planNumberIcon 5630 | `plan-pin` (40x40) |
| Plan stop pin, selected | Map, Plans view | Ink field, paper numeral | 32 px | 5630 | `plan-pin-selected` (48x48) |
| Plan stop pin, visited | Map, Plans view | Dark sticker, cream number, no check | 24 px | 5630 | `plan-pin-visited` (40x40) |
| Plan shape stop (diamond) | Map, a district/street stop | Diamond shell, rim 2, two-digit numeral 12px | 24 px | 5661 | `plan-pin-shape` (40x40) |
| Cluster | Map, 2+ pins sharing a cell | Disc --figure-deep #A8400C, 2px paper rim, paper count 10px/700 | 22 px | clusterMarkerIcon 6877 | `cluster` (70x38) |
| Cluster, starred | Map | Cluster + star with 2.5 halo, set out 4px | 22 px | 6884 | `cluster-starred` (38x38) |
| Shape star | Map, a starred district/street's anchor | g-star with paper halo | 12 px in 24 target | shapeStarIcon 6578 | `shape-star` (32x32) |
| Shape visited sticker | Map, a visited district/street's anchor | Near sticker | 24 px | shapeVisitIcon 6596 | `shape-visit` (36x36) |
| Tag anchor dot | Map, under an open shape tag | Paper circle r6 + ink dot r4 | 14 px | 8997 | `tag-dot` (26x26) |
| You are here | Map, after Locate | CSS div: navy disc, paper inner ring (box-shadow insets) | 16 px | 4297 | `you-are-here` (28x28) |

## Text glyphs and in-row controls (8)

Characters used as icons. They render in the button's font: Chromium shows Arial here; on iPhone the system font draws them, so their shape there is unverified.

| Name | Where used | Drawing style | Renders at | Line(s) | PNG (css px) |
|---|---|---|---|---|---|
| Collapse (▼) | List header, leading; rotates 180deg when collapsed (mobile only) | Text U+25BC, 14px, navy | 14px glyph in 28px | 2642, CSS 1087 | `ctl-collapse` (32x32) |
| Delete (×) | List row action column (Places) | Text &times; 14px, --ink-2 | 28 px button | 5603 | `ctl-delete` (28x28) |
| Remove from plan (×) | Plans view, a stop row | Text &times; (same as delete) | 28 px button | 5606 | `plan-x` (28x28) |
| Add to plan (+) | Plans view, a non-stop row | Text &times; rotated 45deg by CSS | 28 px button | 5607, CSS 1672 | `plan-add` (28x28) |
| Stop number | Plans view, row lead | Text numeral, grey (--ink-2) | 16 px tall in 28 column | numSpan 5593, CSS 1659 | `row-n` (32x20) |
| Filter chip glyph | Filters panel chips (active / inactive) | Category glyph 12px; inactive chip greys it | 12 px | 8353, CSS 922-940 | `chip-glyph` (14x14) |
| Filter chip, active | Filters panel | Glyph + caps label, 2px ink underline | chip | 8353 | `chip-active` (121.02x39) |
| Filter chip, inactive | Filters panel | Dashed hairline, grey glyph | chip | CSS 934-940 | `chip-inactive` (72.08x39) |

## In context (10 screens)

| Screen | PNG |
|---|---|
| Start screen: clusters, top controls, list header, rows | `context/ctx-base.png` |
| Map at zoom 15: near pins, stickers, stars | `context/ctx-map-near.png` |
| Map at zoom 12: near-size pins, clusters | `context/ctx-map-far.png` |
| Hanging Tag: starred + visited, selected row and sticker pin | `context/ctx-tag-starred-visited.png` |
| Hanging Tag: plain place | `context/ctx-tag-plain.png` |
| Filters panel: category chips | `context/ctx-filters.png` |
| Sort menu | `context/ctx-sort.png` |
| Add form: open (x) button, Star toggle | `context/ctx-addform.png` |
| Plans ledger: check, more, new plan, picker; plan cluster tag on the map | `context/ctx-plans-panel.png` |
| Plans list and map: numbers, x / + and plan pins | `context/ctx-plans-list.png` |

## Close-up crops (not separate icons)

`row-lead`, `row-badge-real`, `row-badge-selected`, `pin-live-selected`, `tag-star-starred`, `tag-star-open`, `tag-mark-visited`, `tag-x-btn`, `plan-more-btn`, `form-star`, `form-star-on`, `pencil-star-row`: whole buttons/segments/rows around icons already listed above, cropped from the live app.

## Shown only in context, or not rendered on its own

- **Plan cluster tag** (`.stop-tag`, CSS 1740; the "1–3" pill beside a cluster in Plans): visible in `context/ctx-plans-panel.png` only.
- **District/street outlines on the map** (`neighborhoodStyle()` 6553: district dashed 2.5 `6 4`, street 6 wide round `2 8`): map geometry, not an icon; the fixture shapes are off-screen in the context shots.
- **Hanging Tag furniture** (`.tag-band` 1917, `.tag-patch`/grommet 1910, `.tag-string` 1880, punched hole mask 1891): CSS-drawn parts of the tag, visible in the two tag context screens.
- **Tag star ink/rub animation** (`sgp` svg, 5065): transient animation of the same g-star/g-star-open; not captured.
- **Visit swipe live stamp and sticker placing animations**: transient; the landed states are captured.
- **`rowStickerHtml()`** and the `#stk-row-clip` def (2513-2530): referenced in comments only; rows show the stamp, so no row sticker renders today.
- Typographic characters in copy (`·` separator 3437, `…`, `–` in "A–Z"): punctuation, not icons.

## Fidelity notes

- Map marks were rendered by the app's own functions (`markerIcon`, `planNumberIcon`, `clusterMarkerIcon`, `shapeStarIcon`, `shapeVisitIcon`) into a specimen box on #E8E4DA, the harness's blank tile tone; in the app they sit on OSM tiles. Pins for categories the fixture lacks (hotel, other, approx pins) use synthetic place objects.
- Category glyph specimens are `glyphHtml()` output coloured with `CATEGORY_COLORS`; the 12 px chip glyph is also cropped from the live filter panel.
- Text glyphs (▼, ×) render in the button's default font: Arial in this Chromium; on iPhone the system font draws them, so their real shape is unverified. Leaflet's zoom +/− render in Lucida Console fallback.
- The selected-pin pulse was frozen with reduced motion. Pencil Star crops come from a real emulated-touch swipe (non-reduced).
- Chromium only; Safari/iPhone rendering unverified.

## How it was made

Scripts lived in the session scratchpad (not committed): load index.html with `design/gesture-harness/lib.js` `openProto()` (Supabase stub, `gh.plans` fixture plan, 390x844), then (a) inject specimens built by the app's functions and screenshot them, (b) crop live elements (header, rows, tag, filters, sort menu, add form, Plans), (c) swipe a row with `drag()` for the Pencil Star, (d) take full screens at DSF 3.
