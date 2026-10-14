# The blank-tag form: how it works (shared by P, A and the Float frame)

> **Round 8, visual's changes folded in by systems (2026-10-14).** Followed: 1 (a fixed blank tag, 316 with the stub, from the first frame; the stub never moves while you type), 2 (results overlay the lower lines), 3 (the taller hanging tag, ADD y 518-578 at 664), 4 (Float pan target 512), and NOTES before TYPE.
> Two changes, said plainly:
> - **(2) The results start under the name rule, not at 89.** At 664, starting at 89 gives 157px, or 3.3 rows of 48, which is fine. At 320x568, with a 260 keyboard, it gives 137px, or **2.85 rows, under the floor of 3**. Starting the results panel right under the NAME rule (72 below the tag's top, covering the NAME caption while you type, since the typed text is its own label) gives 3.6 at 664 and 3.2 at 320. Visual may keep 89 at 664 and above, and use 72 only on short screens; one rule everywhere is simpler.
> - **(5) The tag does not shrink while it's open.** On ADD the rules and captions fade, but the paper keeps its height until the tag closes. The real tag's height applies from the next opening. Shrinking a tag that hangs from its top moves the stub up 60-100px: the ADD you just tapped (now DIRECTIONS) changes place under your thumb. That breaks the owner's "I don't want … the button to change physical location after click". If visual prefers the shrink, it's the director's call, with that quote beside it.

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
| 4 | Results: an opaque panel inside the tag, from under the NAME rule to the stub, over lines 5-7 | while typing (≥ 2 chars, the current debounce) | the app's autocomplete, `limit: 10`, scrolls |
| 5 | **address · city**, pencil | printed and empty from the first frame; filled after a pick; hidden for a district or street | `addressInput`, `cityInput` (city auto from `maybeDetectCity`) |
| 6 | **NOTES** | printed and empty from the first frame; writable after a pick | `notesInput`, 16px |
| 7 | **TYPE**, pencil | printed and empty from the first frame; filled after a pick | `categoryInput` |
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
| **Blank, docked** | the **whole blank tag** (fixed: `.tag-in` ≥ 256, 316 with the stub): pin, eyelet, NAME, ADDRESS · CITY, NOTES and TYPE, all printed and empty; keyboard up | behind the keyboard at 664 and below (stub y 330-390 at 664); visible, printed NAME IT FIRST, at 844 Home Screen (377-437) | entered from a trigger tap |
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
| **Inking** | the name graphite → navy; TYPE stamped; ADD reprints as DIRECTIONS; the rules and captions fade; the pin takes its category. VISITED isn't re-stamped (it landed when you set it; turn 36). **The tag keeps its height until it closes** | — | then it's the real tag of the real place |
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
| 390x844, Home Screen (inset 47) | 61-93 | 121 | 157-185 | 193-377 (to the stub, which shows) | 3.8 |
| **390x664 (Safari)** | **14-46** | **74** | **110-138** | **146-320** | **3.6** |
| 375x667 | 14-46 | 74 | 110-138 | 146-323 | 3.7 |
| 320x568 | 14-46 | 74 | 110-138 | 146-300 | 3.2 |

The results start 72 below the tag's top. With visual's 89 it would be 3.3 at 664 and **2.85 at 320** (see the top note). The stub stays at the tag's fixed foot (top + 256) in every row of this table.

- The pin is 32 (the real hanging-pin size) in every docked state, on
  the tag's axis: x 179-211 at 390, clear of zoom (x 10-44) and the
  account badge.
- The floor of 3 holds everywhere with 48px rows. **46px rows aren't
  needed** at 320 under these assumptions (the director asked).
- **After a pick** (visual's round 8 numbers, checked against the band):
  - the hanging tag is 316 tall (about 338-358 with a question; +12 when starred);
  - the map pans so the tag's foot clears the list's band by 16;
  - **at 664: ADD at y 518-578, the tag's top 262, the pin 202-234**;
  - **at 320x568:** the tag's top is about 176 and the pin about 116-148. The worst case (question + starred, about 370) puts the tag's top at about 122 and the pin at about 62-94. The pin's x is 144-176 and the account badge's is 254-304, so it's clear. **It fits with no inner scroll;** the tag scrolls inside only below about 540 tall (landscape).
  - **Float frame:** the pan target for the tag's foot is 512 at 664, to clear the open badge (× at 524-584). That puts ADD at about 452-512, still in the thumb zone.

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
