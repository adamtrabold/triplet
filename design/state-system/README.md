# State system (concept stage)

Owner: "why are the active states not matching come on we should have clear systems at this point."
Sheet: `sheet.png` (390px, 1x; source `sheet.html`, built by `build.mjs` from index.html's real CSS, pressed forced via `.fa`).

**Found: 9 inconsistencies** (list below the table). Worst: pressed has 6 looks; the filters button's "open" is the same dim as "pressed"; sort's "open" is a navy tile.

**Proposal: one rule per meaning, existing tokens only, no new colours or dots.**
- Pressed (finger down) = `--paper-pressed` fill, pressed IN, never dimmed. Rows already do this; header buttons and chips join them.
- On / open / selected = reversed navy tile, paper glyph or text (`--navy` / `--paper`). City chip and sort-open already do this; filters-open joins.
- Unavailable or loading = opacity .4 (submit .6 becomes .4). Current item = row's figure-deep block, sort menu's check (unchanged).

**Deliberate exceptions:** category chips stay on-by-default (category rule = on, dashed hairline = off; navy x11 would shout). Glyph toggles (star, visited dot) keep filling their own glyph.

**Code change:** ~25 net lines, CSS only.
- Header buttons: replace lines 1036-1041 and 1058-1060 (:active / .active / .loading / aria-expanded) with the shared block; 3px radius on all four.
- Chips: add `:active` for `.city-btn:not(.active)` and `.filter-btn` (+4). `.popup-visited:active` .6 opacity becomes a paper-pressed tile (1). `#submitBtn:disabled` .6 to .4 (1). Three tokens on `:root` (+3).
- Gates: no row-gesture gates touched. Re-run popup-open 20/20 and popup/visited cases (visited press), and the sort-menu open/close smoke (`design/list-ordering/build/smoke.js`). Impeccable must stay at 3 findings (index.html unchanged here).
- Open: floating add/account buttons' press is a hard-coded `#1B3A57` (off-token); leave or map to a token.

## Appendix: audit (a pressed, b on/open, c selected, d current, e disabled, f loading)

| | Element | Look | index.html line |
|---|---|---|---|
| a | collapse, filters, locate, sort | opacity .55 | 1036, 1058 |
| a | popup Mark Visited | opacity .6 | 1679 |
| a | popup / form star | scale .85 | 607, 1630 |
| a | row | `--paper-pressed` fill | 1186, 2061 |
| a | sort option | `--paper-pressed` fill | 1105 |
| a | submit | figure-deep fill, paper text | 562 |
| a | floating add / account | literal `#1B3A57` | 382 |
| a | city + category chips | nothing | none |
| b | filters button, panel open | opacity .55 (= pressed) | 1040 |
| b | sort button, menu open | navy tile, paper glyph | 1059 |
| b | floating add / account, open | figure fill, navy glyph | 389 |
| b | popup star on | filled ink star | 1629 |
| b | popup visited on | navy text, filled navy dot | 1713 |
| b | form star on | ink glyph | 606 |
| c | city chip | navy fill, paper text | 844 |
| c | category chip on / off | 2px ink rule / dashed hairline | 887, 890 |
| c | sort option | check mark in gutter | 1110 |
| d | row highlighted | figure-deep block, paper text | 1406 |
| d | map marker highlighted | ink field, paper glyph, pulse | 3888, 1486 |
| e | submit disabled | opacity .6 | 563 |
| e | sort option off | ink-2 text | 1114 |
| f | locate, sort loading | opacity .4 | 1041, 1060 |
| hover | autocomplete / account menu | paper / paper-raised | 756, 441 |

Inconsistencies: (1) filters-open looks like pressed; (2) sort-open navy tile vs filters-open dim; (3) pressed has 6 treatments (opacity .55, opacity .6, scale, paper-pressed, figure-deep, hex); (4) chips have no pressed state; (5) selected: navy fill vs rule/dashed vs check; (6) disabled .6 vs loading .4 vs ink-2 text; (7) floating buttons' press is an off-token hex; (8) hover exists on 3 menu items only; (9) sort-button comment says "ink tile", code is navy.
