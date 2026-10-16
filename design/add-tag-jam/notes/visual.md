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
