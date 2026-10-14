# The blank-tag form: how it works (shared by P, A and the Float frame)

> **Visual, round 8 (2026-10-14): changes that touch how it works. Systems, please check them and fold them in.**
> 1. **The blank tag has a fixed minimum height.** It is a ruled tag of NAME, ADDRESS · CITY, NOTES and TYPE (in the real tag's order: notes before type), `.tag-in` at least 256, so 316 with the stub, from the first frame (director fix 2). The stub never moves while you type. At 664 docked it's at y 330-390, behind the keyboard; the 844 Home Screen puts it at 377-437.
> 2. **Results overlay the lower lines.** They're an opaque panel inside the tag from 89px to the stub, 48px rows, giving 3 and a half rows at 664 (unchanged from your numbers).
> 3. **The hanging tag is taller.** It's 316 (more with a question: about 338-358), not about 220. At 664 that puts ADD at y 518-578, with the map panned so the tag's foot clears the list by 16. At 320 the map pans and the tag's top lands at about 176. Please re-check the fit and the tag-fit pan.
> 4. **Float only:** the tag's foot must clear the open badge (× at 524-584 at 664), so the pan target is 512. This is the same `TAG_SHEET_GAP`-style cost round 7 had.
> 5. **On ADD the rules and captions fade** as the tag tightens to the real tag's height. Nothing else changes in the flow.


Systems, concept turn 1 (2026-10-14). The rulings are from jam turns 30-35;
the jobs are numbered as in `../../jobs.md`. The look belongs to visual
(turns 31 and 34). Numbers come from `../pass-a-check/` unless marked
*estimate*.

The form is **one component with an entry point**. A trigger (P's pin,
A's header cut, the Float badge) only decides where the tag comes from
and where it goes back to on cancel. Everything below is the same for
all three.

## Structure

The blank tag is a `TagPopup`, the real tag's Leaflet popup, in a new
`blank` mode. It is not a sheet and not an absolute div, so the string,
the pan and the zoom behave like the real tag. It has two placements:
- **Docked.** While the keyboard is up, the tag is fixed to the visual
  viewport.
  - The pin is at the top on the tag's axis, and the tag hangs below it.
  - The tag runs on behind the keyboard, so the stub is below the fold.
- **Hanging.** After a pick, the tag is a normal popup on the picked
  point, and the pin stands on that point.

The parts, in the real tag's order:

| # | Part | Live when | Feeds |
|---|---|---|---|
| 1 | Pin + straight string | always (rule 1) | — |
| 2 | Eyelet + patch | always | — |
| 3 | **NAME**: the search input, 16px (iOS zoom rule) | always | `#nameInput` → `selectAddress()` |
| 4 | Results, printed on the tag under NAME | while typing (≥ 2 chars, the current debounce) | the app's autocomplete, `limit: 10`, scrolls |
| 5 | **address · city**, pencil | after a pick; hidden for a district or street | `addressInput`, `cityInput` (city auto from `maybeDetectCity`) |
| 6 | **TYPE**, pencil | after a pick | `categoryInput` |
| 7 | **NOTES** | after a pick | `notesInput`, 16px |
| 8 | Questions slot: new city / which city / error line | when raised | `newCityConfirm`, `shapeCityConfirm`, the errors |
| 9 | **Stub: ADD \| STAR \| VISITED** | after a pick (behind the keyboard while typing) | `submitBtn`, `starInput`, the new `visitedInput` |
| — | × close (the real tag's `.tag-x`) | always | cancel |

- The fields stay the real form's elements, moved and restyled. **The
  add machinery isn't rewritten:** `requireAuth()`, `selectAddress()`,
  the submit handler for pins and shapes, `resolveShapeCity()`,
  `findApproximatePoint()` and `closeAddForm()` are all reused.
- Selects (TYPE, the city correction) are a transparent native
  `<select>` at 16px over the printed or pencilled entry, so they get the
  iOS picker with no zoom (C's ruling).

## States

| State | What shows | ADD | Notes |
|---|---|---|---|
| **Blank, docked** | pin, eyelet, empty NAME line with its printed caption, keyboard up | behind the keyboard | entered from a trigger tap |
| **Typing** | results under NAME: 48px rows (name 14/600 plus a one-line address in 11px, both truncated), plus a half row when more follow | behind the keyboard | "Searching…" printed in the results area until the first answer |
| **No results / timeout** | a printed line in the results area ("No places called that — try another name." / "Search timed out — try again.") | — | keyboard stays up, entry kept |
| **Picked, hanging** | the pin on the spot; name in pencil; address · city, TYPE (pre-filled), NOTES line; stub | **navy flood** | the list drops to its band; ADD low on the screen |
| **Picked, not ready** | the same, while a question is open (new city) | printed **NAME IT FIRST** → here the question's wording instead ("ANSWER ABOVE") | see "Open" |
| **Starred** | the orange band prints across the top, exactly as on a starred real tag | — | the band pushes the name down 12 (36 → 48), the real tag's rule |
| **Visited set** | the VISITED segment shows its stamp, as on the real stub | — | the insert carries `visited: true` |
| **District / Street** | the address · city line hides, a one-line printed hint shows, and the pin stays **lifted** over the point | ADD (the same word) | — |
| **Saving** | ADD prints "ADDING…" and taps are ignored | — | shapes: the OSM fetch runs here |
| **Which city?** (shape under 60%) | the question prints in the questions slot: **NEW CITY** \| **[runner-up]**, then "another city…" (a native select over the line) and Cancel | hidden while asked | the answer resumes the save |
| **New city?** (a point outside every city, on the pick) | **"New city? Lisbon"**: **ADD CITY** \| **PICK FROM MY LIST** | not ready until answered | either answer fills the city in pencil |
| **Save failed** | the tag as it was, plus a printed line above the stub ("Couldn't save — try again") | ready | nothing is cleared |
| **No outline and no spot** (shapes, double miss) | a printed line ("Couldn't find [name] on OpenStreetMap") | ready (you can change the type to a pin category and add) | replaces today's `alert()` |
| **Inking** | the name graphite → navy; TYPE stamped; then VISITED about 150ms later; ADD reprints as DIRECTIONS; the pin takes its category | — | then it's the real tag of the real place |
| **Stale sign-in at ADD** | the sign-in sheet over everything; the tag waits | — | today's `requireAuth()` |

## Pre-fill (closest-friend rule: tap, type, pick, ADD)

- **City:** auto, as today (`maybeDetectCity`), in pencil, tap to
  correct. Not shown for shapes (`resolveShapeCity()` decides, as today).
- **TYPE:**
  - It comes from OSM's own kind for the place where that maps to a
    category; otherwise it's the type you used last (per device). It's
    always pencil.
  - The search needs the OSM class and type, which jsonv2 returns. The
    mapping is a small builder table.
  - It's untestable in the sandbox (Nominatim is blocked), so it goes on
    the iPhone checks.
  - If nothing maps and there's no last-used type, it's **Other**.
- **Address:** from the pick, as today.

## Numbers (phone, keyboard up, docked)

The keyboard is the drawn 336pt (390 wide) or 260 (320 wide). The account
badge's foot binds the tag's top, because the tag's width spans the
badge's x.

| Viewport | Pin | Tag top | NAME | Results area | 48px rows |
|---|---|---|---|---|---|
| 390x844, Home Screen (inset 47) | 61-93 | 121 | 157-185 | 193-500 | 6 |
| **390x664 (Safari)** | **14-46** | **74** | **110-138** | **146-320** | **3.6** |
| 375x667 | 14-46 | 74 | 110-138 | 146-323 | 3.7 |
| 320x568 | 14-46 | 74 | 110-138 | 146-300 | 3.2 |

- The pin is 32 (the real hanging-pin size) in every docked state, on
  the tag's axis: x 179-211 at 390, clear of zoom (x 10-44) and the
  account badge.
- The floor of 3 holds everywhere with 48px rows. **46px rows aren't
  needed** at 320 under these assumptions (the director asked).
- After a pick at 664, C's measured numbers hold:
  - the list drops to its band;
  - the tag (about 364 tall, 404 for a shape) hangs on the place;
  - **ADD at y 515-559**.
  - At 320 the tag scrolls inside itself and the stub stays put.

## Cancel and draft

- **× on the tag** (and the trigger's own cancel, if it has one; Esc on
  desktop) goes back to the state before the tap:
  - the list's position and scroll;
  - the map view;
  - a tag that was open reopens on the same place.
- **The draft is kept in memory:** the NAME text, the pick, TYPE, city,
  NOTES, STAR and VISITED.
  - The next trigger tap re-opens the tag filled in. With a pick, it
    hangs on the kept place with the keyboard down; without one, it's
    docked with the text.
  - No marker stays on the map in between.
  - `closeAddForm()` (the clear) runs only after a successful ADD.
- **Re-search:** tap NAME on a hanging tag. It re-docks with the keyboard
  up, and a new pick re-hangs it.

## After ADD

1. The ink-over.
2. If the place's city isn't the active one, the list switches to it.
3. The row is selected and scrolled fully into view.
4. The list comes back up.
5. The place's tag stays open (it is now that tag).
6. The draft is cleared.
7. The trigger comes back to rest:
   - P: the fresh lifted pin appears when this tag closes;
   - A: + on the header;
   - Float: the badge's +.

## Builder notes

- `pinPopupTopPad()` / `planChrome()` list `#floatingAddBtn`. Update them
  to whatever the trigger is (P: none at the top; A: none at the top).
- The docked tag follows `visualViewport` (resize and scroll), the same
  technique as B and C. The lag and focus-scroll go on the iPhone checks.
- Focus on the trigger tap must happen inside the tap. Whether
  `requireAuth()`'s microtask keeps the gesture is an iPhone check; the
  fallback is one tap on NAME.
- No row gesture is touched. The animations are triggered by state
  changes only (the animation-separation rule).
- One tag on screen at a time: opening the blank tag closes a real tag
  (and reopens it on cancel).
