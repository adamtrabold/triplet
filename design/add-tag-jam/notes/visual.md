# Visual designer notes -- add tag + city jam

## 2026-10-15, Turn 2
- **Canvas:** https://claude.ai/artifact/6aSGgGczYGfWGP1UqTDGP3. Triplet
  DS installed (project/ds/triplet/tokens.json + designSystems record).
- 11 artboards (390x844) and 6 stickies.
- **Source:** generator in the scratchpad (gen.py → canvas/project/*.dc.html).
  Not in the repo.
- **Rows:**
  1. city: same / different / new / change / alternatives (routing label,
     arrow line);
  2. TYPE closed / open with icons / star + visited;
  3. go-to: header menu / city sections / map labels.
- **Calls (we think):**
  - CITY as a select row like TYPE, with "in <town>" at the right only
    when it differs;
  - a NEW CITY mark in brand-orange-deep;
  - icons in the TYPE list;
  - show/hide in the filter panel (1, 3) or on section headings (2);
  - the list title "ALL PLACES (202)".
- **Open:**
  - the owner's pick among the city treatments and go-to directions;
  - going to / adding into a hidden city;
  - the list title.
- Sketch fidelity: no pencil grain or paper texture; the account badge is
  a circle.

## 2026-10-16, the owner's canvas comments, one pass (canvas version 6)
- **Visited (owner: "we don't need to change how visited marking works at
  all. do not tuch"):**
  - the stamp-the-tag idea is removed;
  - mark-visited-at-add uses the shipped tag's own Visited segment
    unchanged: the row stamp, x1.1, -3deg, navy 82%;
  - star stays the segment plus the band.
  - **Do not propose visited changes in this work.**
- **Dropdown alignment:**
  - CITY and TYPE are one grid: label 40 | chip 150 | note;
  - chips are 32 tall, icon 20, chevron right-aligned in the chip.
  - The CITY chip gets a stroked pin glyph so the values align.
- **The tag matches the shipped die:**
  - 316 wide;
  - 28px chamfers;
  - a real 10px eyelet hole at (50%, 18px), with the paper patch and
    grommet;
  - real 5px stub notches (mask);
  - the string 1.5px ink-2 to the eyelet's centre;
  - a 60px stub, perforation inset 10;
  - padding-top 48, name 26/28;
  - the band 36.
  - Before this they were sketch shortcuts (282 wide, 24px chamfers, a
    painted eyelet, painted notches, a 58px stub, a 22px band, name line
    34).
- **NEW treatment** (one, used everywhere): a blue (#2B6CB0) dashed
  outline plus a NEW tab. NEW = new in this jam, not shipped and not the
  round-10 tag.
- **The TYPE open list:** a custom menu modelled on #sortMenu (24px
  caption, 40px rows, a check in a 16px gutter). Chosen over the native
  picker because a native picker can't show icons.
- **City treatment only on the add/edit tag** (owner). It's on the
  alternatives board and in sticky s1.
- **New boards:**
  - SectionHeaders: A, a row-grid heading; B, a printed rule; C, the
    header's voice;
  - PlansGoTo: Go to beside the plan name; Whole plan / the plan's
    cities in stop order / other cities.
- **GoToMap** is 1330 tall, with the badge variants below the phone:
  - A, the cluster disc;
  - B, a little tag;
  - C, your stamp;
  - plus an "after tap" note.
- **Naming** (city / trip / no label) is pending the owner; the canvas
  still says CITY.
- **2026-10-16, canvas v7:** the stub's marks are now the shipped markup.
  - **VISITED:** `.row-stamp` 72x32, navy 82%, the dotted track as an
    inline SVG path (pathLength 166.29, dasharray 0 1.9797), the 2px ring
    inset 4, the filled STICKER_CHECK.row 8px, VISITED 10px caps, x1.1, a
    -3.5deg tilt.
  - **Star:** `#g-star` / `#g-star-open` at 20px (viewBox -1 -1 26 26);
    starred = orange fill, 1.5px deep-orange stroke under it.
  - **Mark visited check:** `.tag-ochk` (STICKER_CHECK.row, stroke 2.05).
  - **Not carried:** the stamp's paper-tooth texture (`--tex-stamp`),
    like all texture on the canvas.

## 2026-10-16, polish pass (canvas v8) + talking to the owner in the canvas threads
- **Generator:** scratchpad gen2.py, which replaces gen.py. Every element
  is lifted from index.html:
  - the account (SCALLOP_PTS);
  - the + (the 24-lobe mask points, the tex-flood turbulence as inline
    SVG filters, the 1.8182 +);
  - Leaflet's zoom and credit;
  - the #locationsHeader icons;
  - the .location-card grid (badgeHtml 24, the row star, .row-stamp, the
    ×, the filed field);
  - markerIcon pins (24) with markerStarHtml;
  - the cluster disc (22, figure-deep);
  - the tag die, band texture, stub (real star, check, stamp);
  - the plan ledger as shipped.
- **Not reproducible:**
  - the OSM tiles (no network);
  - the pencil grain and --tex-stamp (would need data-URI masks);
  - the visited stickers on pins (not drawn).
- **The count rule (option 1, applied):** "(n)" after the name in its own
  type. Clusters are the exception. Option 2 (a quiet grey tally) is on
  SectionHeaders. The plan picker still says "3 STOPS" (shipped).
- **Menus:** the sort-menu voice, full width (gutter to gutter, or the
  tag's width), content on one left edge, the check at the right.
- **New boards:**
  - CityAsMetadata (destination print / routing box / eyebrow);
  - row 4, search: SearchWorld (place line), SearchNear (820, before and
    after), SearchMap (baseline).
- **Existing boards changed:**
  - CityNew: 1420 tall, three new-city marks (printed / little tag /
    rubber stamp; B in the phone);
  - GoToSections uses header A;
  - PlansGoTo is 820 wide (pick a plan vs Go to).
- "in Grindavík" is removed everywhere.
- **Threads:**
  - replied: all the listed ones;
  - resolved: b7f43313, d4ae20e8, 227789c4, 4fe3971b, 17947bde,
    c51d58ae, 809bd89e;
  - left open for the owner's pick: 20cd568d, a6b0be70, 5baf422c,
    03619be4, bd932962, 32791bc9 (naming), 1241f2b0.

- **2026-10-16, v9:** Go to uses the earlier ring + dot glyph everywhere (menus, header A, Plans chip and menu, the near chip). The crosshair stays only on the shipped "my location" button. Thread 82962a61 is resolved.
- **2026-10-16, v10:** section header A has no glyph. The name is the go-to button, its left edge at x 18 (the row badges' ink edge), with the eye on the right. The NEW tab moved off the text. Thread 2c2231cc is resolved.
- **2026-10-16, v11-12:**
  - Search 2 (the near chip) is greyed out and marked REJECTED, with a
    sticky (owner: "far too complex"). Search 1 and 3 remain.
  - New row 5, PlanCity1 (systems Turn 7, Option 1):
    - the title is the one picker (all places / plans / new plan);
    - the section headings (header A) are go to: cities, or a plan's
      legs;
    - show/hide stays in the filter panel.
    PlansGoTo is greyed out as SUPERSEDED. Option 2 is not drawn.
    Thread 91154dfc is left open.
  - **One dropdown spec** (threads c654c2fc and cdce28a5; I'd misread
    "full width" in b7f43313):
    - natural width (max-content, min 200);
    - dividers edge to edge;
    - content on one left edge, the check at the right;
    - opens 6px under its trigger, left-aligned to it.
    Applied to TYPE, City (now a menu under the chip, not in-tag rows),
    Go to and the title menu.
- **2026-10-16, v13:** the new-city mark is picked: C, the deep-orange rubber stamp (the VISITED build), reading just "NEW". It is on the CityNew tag; A and B are greyed "not picked". Stale stickies s1b and s2 are refreshed. Threads 8f910052 and a6b0be70 are resolved.
- **2026-10-16, v14, the final section header (owner picks):**
  - the city name in variant B's type (12px caps, .12em);
  - the count as a quiet tally;
  - the eye for show/hide.
- **The count rule, decided:** a quiet tally on the whole canvas (`cnt()`
  = .8em grey 700 tabular). Section headers fix it at 11px; the 15px top
  header's tally scales to 12px. Cluster discs are the exception.
- **New boards:**
  - TitleAndGoTo (row 5): the title picks, plus a small Go to chip and
    its menu. Thread 47b66098 is open.
  - Collapse (row 5): A grab handle (we think) / B last icon on the
    right / C a printed "Lower" tab. Thread 082ebef3 is open.
- **Resolved:** ac67b0fb, 7b50d2d8, c75967ec, 03619be4, d9def744.
- **2026-10-16, v15:** new row 6, PlacesPlansA (systems Turn 8, Option A). The shipped .seg Places | Plans switch sits at the sheet top, always visible. Places: city sections. Plans: a list of plans (route glyph, name, stops and cities, a ›, New plan last). One plan: a back chevron, legs as headings, numbered stops. Row 5 (PlanCity1, TitleAndGoTo) is greyed as superseded. Option B is not drawn. Threads 0d441a3b and 47b66098 are open.

## Canvas v16–v17 (2026-10-16)
- v16: CityNew: the NEW stamp sits right after the city dropdown (sel_row right slot justify-self:start), on all tags.
- v17: menus drop the "why" labels (nearest / hidden / km): name + tally only, one baseline; a hidden city stays greyed.
- v17: GoToMap fit button is now a labelled "All cities" (go-to ring + text) in the Leaflet control style.
- New boards: CityMetaRefined (R1 eyelet axis, R2 routing line; NEW stamp after the dropdown), SectionSeparate (S1 air above, S2 navy ledger rule + raised band), HiddenCity (H1 hidden header state with closed eye, H2 gone + filters dot), TagBadge (T1 small Hanging Tag, T2 sideways luggage label; tally rule; navy-edged shadow for legibility), CollapseRefined (K1 last icon after a hairline at 18px, K2 right-aligned icon-only sheet-edge tab, list up and lowered; credit lifted above the tab).
- Picked: tag direction for the map badge (bd932962 closed); B's collapse icon (082ebef3 closed).
- v18: canvas split into pages. "Now" (launch): live and decided boards in 6 topic rows (add tag; Places and Plans; section header, count and Go to; map city badge; collapse, with A first; search), a "Waiting on you" sticky (8 open decisions) and green "Decided" stickies. "Archive": CityAlternatives, CityAsMetadata, PlansGoTo, SearchNear, PlanCity1, TitleAndGoTo, plus split-out CityNewMarks, GoToMapBadges and SectionHeadersHistory (the unpicked variants moved off the live boards). GoToSections drops the "Hidden: Malmö / Show" row (H1/H2 replace it either way). Notes cleaned: no distance, no "(202)".

## Canvas v20 (2026-10-17)
- Decided from owner comments: R2 routing line (no rule) replaces the CITY row on every add tag (Main, CityDifferent, CityNew, CityChange, TYPE boards, StarVisited); city list drops from the routing line. TYPE chip value 12px caps .12em (was 14px, "louder"). Section header = S2 band (RAISED) + 1px hair, no navy rule, everywhere. Collapse = K2 tab on every sheet (sheet() draws it; header loses the left triangle; Leaflet credit lifted 24px). Search 1.
- Go to menu: a hidden city shows the closed eye at the right (and stays greyed).
- TagBadge: T2 dropped (gravity); T1 refined, short string (6px + eyelet), 5px dot: navy vs orange.
- New board ListHeaderType: L0 today (15/56), L1 tighter (15/48), L2 one step up (18/52).
- Archived: Collapse (A/B/C), SearchMap.
- v21 (systems Turn 9): new board CityDistance (row 1 right): "≈ 40 km from Reykjavík" in the routing line beside the city (12px INK2), outside the city only, on the add tag, the edit tag (stub "Save") and the place's Hanging Tag (city printed, Directions | Star | Mark visited); Sundhöllin (inside) gets nothing extra. PlacesPlansA redrawn: no switch on the sheet; the list title (with chevron) opens a two-entry menu, Places or Plans; plans list; one plan with back; K2 tab. Both waiting on the owner; sticky updated (6 items).
- v22: NEW marker off by default on every Now board (outline/tab driven by CSS vars; a "Show what's new" boolean tweak, section Review, turns it on). Distance note moved into the address: V1 "≈ 40 km" at the right end of the address line; V2 "≈ 40 km from Reykjavík" as a second address line; in-city case unchanged. NEW stamp centred on the routing line (align-items:center; centres measured equal), 8px gap after the chevron, on every board.
- v23 (systems Turn 10): new row-2 board PlacesPlansKinds — Option 1: title "Places · Reykjavík ⌄" / "Plans · Golden Circle ⌄"; menu with a Places | Plans toggle (shipped .seg look) on top and only that kind’s items (All cities + cities with tallies, hidden city greyed with closed eye; All plans + plans + New plan); Golden Circle stops by city; All plans list. Option 2 (two title buttons) as one phone. Turn 9 board archived.
- v24: section header = S1 everywhere (60px, air above, name on a 2px hair rule, paper, no band); decided. HiddenCity shortened so H1 Malmö shows.
- v25: sheet gets a 1px hair top border (the tab’s border); the tab overlaps it so they join seamlessly; every Now sheet.
- v26: map city badge = the boxed label (GoToMap), decided; TagBadge archived; waiting list down to 5.
