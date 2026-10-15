# Plans v2: Places | Plans, follow vs. Edit (spec for the build; the owner chose option X)
### Owner images: `owner-images/`, one phone screen per image at 2x (780px wide), captions built in
1. `owner-01-places-panel.png`: the Places-side filter panel, with every chip (unchanged).
2. `owner-02-plans-panel.png`: the Plans-side panel, with the chips hidden, and why.
3. `owner-03-following.png`: following a plan (the solid number is the next stop).
4. `owner-04-tap-edit-stops.png` → `owner-05-edit-stops-on-top.png` → `owner-06-add-a-place.png` → `owner-07-remove-with-undo.png` → `owner-08-hold-and-drag.png` → `owner-09-tap-done.png` → `owner-10-back-to-following.png`: the Edit flow, step by step.
5. `owner-11-map-numbers-next-solid.png`, `owner-12-map-numbers-while-editing.png`, `owner-13-map-district-diamond.png`: the map.
6. `owner-14-plan-list-and-actions.png` and `owner-15-delete-confirm.png`: managing plans.
### The model (as decided)
- **Places (default)** is today's app, unchanged.
- **Plans** is read-only, for following. **Edit stops** is its first row. Solid navy means the next stop, in the list and on the map. Every stop is numbered on the map: a pin in its ring, a district or street in one diamond. Stop pins draw above other pins. The chips are hidden in Plans.
- **Edit (option X)** has the header = the plan's name and the word **DONE**:
  - The stops lead the list, in order, with ≡ grips. A plain line follows, then every other place with +.
  - Tap a stop's number to remove it (Undo for 6s). Hold ≡ for 250ms, then drag, to reorder.
  - The filter panel shows only the Places filters. There's no ⇅.
  - **While editing, DONE takes the locate button's place.**
- **The switch** is a real segmented control at the top of the panel. Plans are picked, created, renamed and deleted only in the panel.
### Files and checks
- Files: `tables.md` (rules, tap counts, build notes, schema); `design/ACCEPTANCE-plans.md`; `contact-sheet-1/2` and `frames/` (51 frames, at 1x from the real index.html; the Y frames are kept for the record); `harness/` (all scripts; `ownerimgs.js` makes the owner images).
- `harness/check.js` **PASS 2225/2225, 51 frames**; `harness/griptest.js` **PASS 23/23** (Chromium touch emulation; unverified on iPhone; the full gesture gate applies at build).
### Still for the owner to confirm (images 01/02 and 11–13)
1. Plans hides the city and category chips.
2. Stop numbers replace the pin icon (the ring colour keeps the category).
3. Should choosing a plan close the panel? As drawn, it stays open.
