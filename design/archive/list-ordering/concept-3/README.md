# List order picker: round 3 (one row, 57px, city name untouched)

Contact sheet: `contact-sheet-1x.png` (true size), plus `contact-sheet-2x.png` for reading. Measured: adding one 32px icon leaves the city name 186px. The widest name needs 166 ("Copenhagen list (38)"), so there's no truncation. The icon's 44×56 tap zone just touches the filters button's zone without overlapping it, and sits 210px clear of the collapse button.

**1 · Sort icon + tiny menu (PICK)**
- A standard ⇅ sort icon sits beside the filters button. Tapping it opens a 3-row menu with 44px rows, styled like the map popup; the current order has a ✓.
- At rest it's one quiet icon, and the menu names each order in words, so there's nothing to decode.
- Trade-off: you can't see the current order at rest. The list itself shows it.

**2 · Cycling icon**
- The icon is the mode: a list icon whose first line is ○, ★ or a clock. Each tap moves to the next order, and a 1.4s label ("STARRED FIRST") names it.
- It takes one tap and shows the mode at rest, but the three glyphs need learning. At 20px they are hard to tell apart, and they look like the filters icon's lines.

**3 · Order in the filters panel**
- The header doesn't change at all. An order row (What's left / Starred / Newest) tops the panel the filters button already opens, and the current order is the filled chip.
- It's the simplest header possible, but ordering hides inside "filters", which it isn't, and it takes two taps.
