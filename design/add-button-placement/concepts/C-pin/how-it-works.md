# C. Pencilled pin: how it works

This is the systems part of the concept: a rough structural pass, per the director's turn 7. The look belongs to the visual designer. The frames in `frames/` are rough on purpose (a dashed outline pin, a dashed blank tag) and are not owner stills.

**Bigger scope:** this concept changes the add form. Its fields move onto a blank tag on the map. The owner has to be told that plainly.

How the prototype is built: `index.html` here is a **copy** of the real file, with `concept.inc.html` injected before `</body>`. `render.js` rebuilds the copy and renders `frames/*.png` and `measure.json`. The prototype reuses the app's own add machinery, moved rather than rebuilt: `requireAuth()`, `#nameInput` + `selectAddress()` (search, city detection), the `#addForm` fields and `#submitBtn`'s handler (pins and shapes). A full add runs end to end: in `done_664` the place is added, the list switches to its city, and the new place's real tag opens.

## Director rulings applied (jam turn 10)

- **A tag is open → the blank pin steps aside, at every height.** It shows again when the tag closes. Adding means closing the tag first: one more tap, said plainly on the owner stills. One tag on screen at a time.
- **Filters are open → close the filters to add, at every height.** The pin doesn't ride the panel.
- **iOS 16px zoom: no viewport hack.** Each pencilled entry on the blank tag keeps its printed look over a transparent native `<select>` set at 16px. Notes and the search line are 16px. No `maximum-scale` or `user-scalable=no`, because pinch-zoom stays. This goes on the iPhone-check list.
- **Cancel keeps the draft in memory.** The pin is put back and no marker stays on the map. The next tap on the pin brings back the search text, the picked place, the type, the notes and the star.
- **After Add, the new row scrolls fully into view** in the list (not just selected), and the new place's tag is open.

## Structure

- **+ is a blank, pencilled (dashed) pin with a + inside.** It rests on the map at the lower right: x 326-378, y 458-522 at 844, sitting above the OSM credit (it doesn't move the credit). It lives inside `#mainContent`, so it rides the sheet edge for free: list up, collapsed (y 664-728 at 844 + inset) and the tag-fit lowering.
- `#floatingAddBtn` is removed. The account badge sits alone at top-right, so nothing changes for the sign-in crew.
- **The add happens on the map:**
  - **The search line** takes the list's band slot. The list drops to its band, and the band shows "Where? Search for a place…" with an outline-pin glyph at the 56px spine and × at the right end.
  - **Results grow upward** from it, over the map.
  - **Once you pick a result,** the map goes there and a pencilled marker stands on the spot. **A blank Hanging Tag hangs from it.** The tag is the form: name, short address, City, Category, Notes, Star, ADD LOCATION.
- **The tag hangs low, so Add is in the thumb zone.** Its foot sits 16px above the band, and the pin goes wherever that puts it, clamped under the top controls. If the tag is taller than the room, it scrolls inside and ADD LOCATION stays pinned to its foot (sticky).
- **After Add, the pencilled pin becomes the place's real pin and its real tag opens.** If the place is in another city, the list switches to that city first. Without that, the new row is filtered out; I found this in the render. So this concept answers owner Q2 by construction.

## Measurements

| | 844 | 664 (Safari tab) | 320x568 | 1280 desktop |
|---|---|---|---|---|
| Blank pin, list up | y 458-522 | y 278-342 | y 182-246 | x 1216-1268, y 714-778 (map column) |
| Search line, keyboard up (drawn 336pt) | y 451-508; results y 239-451 (4 rows) | y 271-328; results y 59-271 (**4 rows**) | — | bottom bar |
| Blank tag (form) | y 386-752, 364 tall | y 206-572 | y 157-474 (scrolls) | in the map column |
| **ADD LOCATION** | **y 695-739** | **y 515-559** | **y 429-473** (sticky) | y 711-755 |
| Category hit-test | self | self | self | self |

- **The tag is 364px tall.** That's 232 for a real tag plus the fields. With District or Street it's 404, because the hint shows; it re-hangs when the category changes (`shape_664`).
- **The search is the best of the set with the keyboard up.** Results grow upward from a line that rides the keyboard. At 664 you see 4 results, against B's 2.5. This uses the same `visualViewport` technique as B and needs the same iPhone check.

## Tap count (the director's check 5)

| | Today | B | Stub | C |
|---|---|---|---|---|
| Open | + | strip | stub | pin |
| Get to Search | tap the field | tap the field | tap the field | **autofocus** (`focused: nameInput` in Chromium) |
| Pick | 1 | 1 | 1 | 1 |
| Finish | Add | strip | Add | Add on the tag |
| **Total (default category)** | **4** | 4 | 4 | **3** (4 if iOS won't autofocus) |

- Changing the category costs the same everywhere: 2 taps on the select.
- iOS only raises the keyboard from `focus()` inside the tap's own gesture. `requireAuth()` resolves in a microtask, and whether WebKit keeps the gesture across it is an iPhone check.
- Autofocus could be given to B and the stub too, so **C's 3 isn't a structural win.** The structural win is that the add ends on the place.

## Collisions (the director's check 3)

- **OSM credit:** it stays where it is and the pin sits above it. In the adding state the credit stays on the visible map. **Pass.**
- **Real pins under the blank pin:** none at the default view, in any of the 5 cities, list up or collapsed (`measure.json` `collisions`). It is still a 52x64 dead zone on the map, 1.6% of the map at 844. At street zoom a place can sit under it; panning frees it. **Pass, with a dead zone.**
- **An open tag** *(ruled: (b), at every height; the measurements below are kept as the reason)*. It was a FAIL at 664.
  - `tag_664`: the tag lowers the sheet to 398, which puts the pin at y 312-376 while the tag's foot is at 346. The pin covers the tag's VISITED segment by 27x34px.
  - `done_664` shows the same thing on the new place's own tag.
  - At 844 it clears: the pin is at y 458, the tag foot at 346.
  - Fix options:
    - (a) `TAG_SHEET_GAP` becomes 96 on phones. The pin needs 86, against today's 48. That costs one list row with a tag open (3 → 2 at 664).
    - (b) The pin hides while a tag is open. Job 1 is then partial: close the tag first, one extra tap.
    - (c) The pin goes to the left edge while a tag is open. That breaks "same place every time".
  - This is the director's call.
- **Filters open** *(ruled: close the filters to add, at every height)*. It was a FAIL at 664. The panel is 298px tall and leaves no map above it. If the pin rides the panel's top it lands at y -21 (`filters_664`), under the account badge. At 844 it rides to y 87-151 and passes. Any fix moves + into chrome, which is the stub's territory. The honest rule is: filters open, close them to add. That is one extra tap and job 1 partial.
- **Desktop:** pass. The pin sits in the map column's bottom-right and the tag hangs in the map column.

## Flows

1. **Add.**
   - Tap the pin. Signed out, the sign-in sheet opens and nothing moves (`signedout_tap`).
   - Signed in, filters close, the list drops to its band, and the band becomes the search line with the keyboard up.
   - Type, then pick. The keyboard drops, the map flies to the place (zoom ≥ 16), the pencilled marker stands there, and the blank tag hangs below it with ADD LOCATION above the band.
   - Fill in Category, Notes and Star if you want, then tap ADD LOCATION.
   - The tag and the pin are inked: the place's real tag opens, the list comes back up (switched to the place's city if needed), and its row is selected and **scrolled fully into view**. The blank pin isn't showing here, because a tag is open.
2. **Cancel.** Tap × on the search line. The marker and the blank tag go, and the list, the map view and any tag that was open come back (`canceltag_844`: tag `la01` reopened, list up). The map view is restored too, because C moves the map; the stub and B don't need that. **The draft is kept in memory** (ruling): the search text, the picked place, the type, the notes and the star come back on the next tap of the pin, which re-hangs the tag on the kept place. No marker stays on the map. The fields are cleared only after a successful Add (`closeAddForm()`). The prototype still clears on cancel; that's a builder change.
3. **Re-search.** With the tag hanging, the search line still holds the name. Tap it to search again; a new pick re-hangs the tag on the new spot (wired in the prototype, not rendered).
4. **A tag is open.** The blank pin isn't on the map. Close the tag (×, a map tap, or Esc) and the pin is back. Then follow flow 1.
5. **The filters are open.** The pin is under the panel, at every height. Close the filters to add.
6. **District / Street.** Search, pick a point, then set the category on the tag. Address hides, the hint shows, and the tag re-hangs. On ADD LOCATION the app's shape fetch runs as today. The outline (or the "(approx.)" pin fallback) is what gets inked. The shape-city confirm shows inside the tag. Every category keeps the same capabilities. Not rendered live: OSM is blocked in the sandbox.
7. **Plans:** the same pin adds a place.
8. **Playground:** adds (`done_664`).
9. **Desktop:** the pin is at the map column's bottom-right and the search line is a bar at the bottom of the screen. The bar's width is the visual designer's call; it is full width in the prototype.

## Edge and error states

- **Add fails:** the tag stays, the error shows as today, and nothing is lost.
- **No results / search failed:** the dropdown's own messages show, above the line.
- **New-city prompt:** it shows inside the tag, as it does in today's form.
- **A pick outside every city:** the map goes there and the tag hangs. City detection runs as today.
- **The tag doesn't fit (320x568):** it scrolls inside and Add stays visible.
- **Two pins at once:** while you're adding, the resting blank pin is hidden, so there is only ever one pencilled pin on screen.

## Builder notes

- The pin steps aside: hide it while `tagOpenNow()`, including while the new place's tag is open after an Add. Show it again on close. It doesn't animate sideways.
- 16px: a transparent native `<select>` (16px, opacity 0, full hit area) over each printed entry on the blank tag. Notes `<textarea>` and `#nameInput` are 16px. The viewport meta is unchanged.
- After Add: switch the city if needed, select the row, then scroll it fully into view, as a list tap does (`scrollIntoView({block:'nearest'})` within `#locationsList`).
- Draft on cancel: hide, don't clear. Keep the `selectedPlace` and the field values. Remove the marker.

- The blank tag should reuse `TagPopup` (a Leaflet popup) rather than the prototype's absolute div, so pan, zoom and the string behave like the real tag.
- `pinPopupTopPad()` drops `#floatingAddBtn`.
- A new rule is needed: after Add, switch to the place's city if it's filtered out. That's a behaviour change, and arguably a bug fix in its own right: today a place added in another city silently vanishes from the list.
- No row gestures are touched.

## Coverage against jobs.md

| Job | Supported | Where |
|---|---|---|
| 1 Thumb reach in every state | **yes, with two ruled exceptions** | list up, collapsed, Plans, desktop: yes. With a tag open or the filters open, close them first (one tap): the director's ruling, said to the owner plainly |
| 2 Reads as the main action | open | it's a pin among pins. Whether the blank, pencilled grammar reads as "add" at 1x is the visual designer's objection 1 |
| 3 Finish near the thumb | **yes** | Add y 515-559 at 664, y 695-739 at 844, sticky at 320 |
| 4 Don't lose my place | yes | list, tag and map view restored (`canceltag_844`); the draft kept in memory (ruling) |
| 5 Never in the way | yes | it steps aside while a tag is open, so it never covers one |
| 6 Signed out / playground | yes | `signedout_tap`, `done_664` |

**Verdict (after the turn-10 rulings): structurally sound. The director scored it 8 in round 3; the remaining fixes are for the visual designer (scores.md).** *Earlier verdict, kept for history:* alive, but not a 9 as it stands. The flow is the strongest of the set. It's the fewest taps, the best search with the keyboard up, and the add ends on the place. But its home, the map's lower edge, is exactly where the tag and the filters panel want room at 664. It reaches 9 only if the director accepts one of the tag-open fixes, plus "close filters to add". Both cost the job-1 promise a little.
