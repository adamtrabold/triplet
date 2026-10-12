# Jam: where + lives

Owner (verbatim, 2026-10-12): "im also thinking about + placement — it
should probably be more prominent + reachable on the phone give that to a
crew"

---

## Turn 1 -- product designer (systems focus)

### Jobs (written from the owner's words before reading anything)

1. **Reach + with my thumb, one-handed, without shifting my grip.** On the
   phone, in whatever state the screen is in (list up, list down, a tag
   open, Plans, filters open).
2. **See + straight away as the thing you do here.** No hunting; it reads
   as the app's main action, ahead of the small utility icons.
3. **Finish the add near my thumb too.** *(inferred)* Reaching + is half
   the job: the form's first field, its Add button and its close have to be
   reachable too, or we've moved the hard reach one step later.
4. **Add from wherever I am without losing my place.** *(inferred)* Map
   position, list scroll, open tag, Plans view all survive opening and
   cancelling the form.
5. **Prominent, but the trip stays the main thing.** *(inferred)* + never
   sits on the pins, the tag, a row's name, or (dangerous) a row's delete ×.
6. **Signed out and in the playground it still makes sense.** *(inferred)*
   Today signed-out + asks you to sign in; the playground lets visitors add.
7. **Find it in the same place every time.** *(inferred, and in tension
   with how the list sheet moves; see below)* The taste ledger: "Controls
   don't move or grow."

### What's there today (rendered at 390x844, 1x; stub data -- stills in `current/`, script `current/render-current.js`, run with `OUT=<dir> node`)

- + is a 50px navy scalloped badge at **x 324-374, y 16-66**: the
  top-right corner, the hardest spot on the screen for a right thumb
  (Hoober's reach zones put the top quarter of a 6.1" phone out of
  one-handed reach; you regrip or use two hands).
- The account badge is its **identical twin** 8px to its left. Same shape,
  same size, same navy, same orange glyph. So today nothing about + says
  "primary": it's one of a pair, and the pair is one of three top-corner
  clusters (zoom at top-left).
- The thumb band is the **list header**, y 544-600 (list up) or ~y 784-844
  (list collapsed). It already holds sort, filters and locate as 32px icons
  at x 254-374. It's the only part of the UI that is always on screen and
  always low.
- Every list row has a delete **×** at x ~360, and the VISITED stamp beside
  it. That's exactly where a stock bottom-right floating button would sit.
- Leaflet's attribution sits bottom-right of the map, just above the sheet.
- The filters panel slides up on top of the list sheet's top edge.
- Opening the form: + turns × in place (still top-right); the form takes
  the whole top of the screen (City, Category, Search, Address, Notes,
  Star, ADD LOCATION at y ~470), pushing the map away. The list stays below.
- After Add: the form closes. **The map doesn't go to the new place** and
  its tag doesn't open. (Probably a scope question; see the end.)
- Code that knows where + is: `pinPopupTopPad()` (~line 4927, tags open
  below the top controls) and `planChrome()`/`planSafeBox()` (~6718, plan
  fits avoid the chrome, and already handle chrome in the lower half). If +
  moves, both still work in principle; the tag-sheet gap (`TAG_SHEET_GAP`
  48px) would need to count a + that sits near the sheet edge.

### The structural question underneath

"Where does + go" is really **"what is + attached to?"** Today it's
attached to the screen corner. The candidates, differing in kind:

| # | Attached to | Moves with the sheet? | Thumb reach | Main risk |
|---|---|---|---|---|
| A | The **sheet's top edge** (a tab or badge hanging off / straddling the 2px rule, right side) | yes, it's part of the sheet | good, list up or down | sits over the locate icon or the map's attribution; competes with the tag's bottom gap; the filters panel covers that edge |
| B | **Inside the list header**, one of the row of icons but the one big one | yes | good | header crowding; the owner has said the header is the city name, and "no extra header height" |
| C | **The screen's bottom-right corner**, fixed, over the list | no | best, and findable without looking | covers the rows' delete × -- a mis-tap deletes a place. Needs the row layout to give way, which is a much bigger change |
| D | **The map's bottom-right corner** (above the sheet) | yes, indirectly | good | covers pins near the bottom; same spot as attribution; disappears when the sheet is lowered for a tag? |
| E | **The list itself** -- a blank first line, "the next line in the guest book", tap to write in | scrolls away | good when the list is up | none at all when the list is collapsed; costs 56px of list |
| F | **No button: a gesture** -- long-press the map to add a place there, pull the header up past the top to add | n/a | best | not discoverable; can only ever be an accelerator next to a visible + |
| G | **Stays top-right**, but the form and its actions come to the thumb | no | + still hard | doesn't answer "reachable" for the first tap |

C is the one people would pick first (the stock floating action button).
I'd keep it on the table only to say clearly why it loses: the row ×.

My lean, for the others to push on: **A or B** -- + belongs to the one
band that's always low. The header is the app's dock already; the list
header is where every other "do something with the trip" control lives.
"Only one element of each kind" (my Oblique Strategies draw): today there
are two identical badges up top and three identical icons below. Moving +
down and making it the *one* big thing in the band would make it primary by
structure, not just by colour. The account badge then has the top corner to
itself (rare, low-reach is fine for it).

### Flows to design for (every concept must survive all of them)

1. **Rest, list up** → tap + → form → Add → (where am I?).
2. **List collapsed** → tap + (the band is at the very bottom now).
3. **A tag open** → tap + → cancel → the tag is still open, same pin.
4. **Plans view** → tap + (today the form opens over Plans unchanged).
5. **Filters panel open** → is + covered, on top, or does it close the panel?
6. **Signed out** → tap + → sign-in sheet; and **playground** → tap + → add.
7. **Cancel** -- where is the × once + has moved? Today the × replaces the
   + in place. If + is low and the form opens at the top, the × either
   stays low (a close far from the form) or jumps up (a control that moves).
8. **Keyboard up** -- typing in Search, the keyboard covers the bottom
   ~300px. Anything we put low is hidden while typing.
9. **Desktop rail (>= 900px)** -- the sheet is a left rail; + can't hang
   off a bottom edge there. Needs a sensible place, not necessarily the
   same one.
10. **320px wide** -- the header icon row gets tighter.

### Interaction ideas

- **The form comes from where + is.** If + is low, the form rises as a
  sheet from the band (a seed packet torn open at the bottom, my random
  draw), not from the top. The + becomes × *where it already is*, so the
  close never moves. Add sits right above the keyboard/thumb.
- **Search results grow upward** from the search field when the field is
  low (iMessage-style), so the keyboard doesn't hide them.
- **Hold + to add where I'm standing** (surveyor sighting a point, the
  other random draw): a long-press uses your location, reverse-looks-up the
  nearest place and opens the form pre-filled. Tap still does the normal
  add. It's an accelerator, so it's fine that it's hidden. Probably a
  scope question for the owner, but it fits a trip app that's used *on* the
  trip.
- **Long-press the map to add there** -- same family; drop a pencilled pin,
  form pre-filled from the point. Fits the app's "pencilled" grammar
  (printed / stamped / pencilled).
- **Land on what you added.** After Add, fly to the new pin and open its
  tag (the app's own rule for list taps), so you see it worked. The newly
  added row could take the selection.
- **Signed out**: + stays visible and tappable and asks you to sign in
  (today's behaviour, and the ledger's "actions visible but disabled /
  tapping offers sign-in" pattern).

### Tensions I can see (not decisions)

- **"Controls don't move or grow" vs a + that rides the sheet.** The sheet
  collapses (moves ~240px) and lowers for tall tags. A + attached to the
  sheet moves with it. I think that's honest -- it moves *because its
  surface moves*, the way the sort icon does today -- but the owner's rule
  came from a toggle jumping after a tap. Worth naming to him, not
  pre-deciding.
- **Prominent vs secondary marks never outranking content.** + is an
  action, not content; bigger/orange in the thumb band is fine as long as
  it doesn't fight the selected row or the tag.
- **The sign-in crew's badge was designed as "left of +"**, and its job 4
  is "never looks louder than +". If + leaves the corner, that badge sits
  alone at top-right. Their design doesn't break, but the pair they drew
  goes away. Orchestrator should tell them early.
- **The add form's height** (~470px today) won't fit above a keyboard as
  a bottom sheet. Either it shortens (search first, the rest after a pick)
  or it scrolls. That's a form redesign, which may be beyond "placement".

### For the others

- **Product designer (visual focus):** what does a primary + look like when
  it's no longer the account badge's twin? Size, orange fill vs navy, a
  tab that belongs to the sheet's paper vs a badge on top of it. The inspo
  has luggage-tag tabs, ticket stubs, matchbook strikers -- something
  *attached* to the sheet rather than floating over it would make A read
  as on purpose.
- **Design director:** two calls I'd like steering on before concepts:
  (1) is the form's position (does it rise from the bottom?) in scope, or
  only the button? (2) are the gesture accelerators (hold for "here",
  long-press the map) in scope, or a separate idea for the owner later?

### Scope questions for the owner (not blockers)

- Should the map go to a place you just added and open its tag?
- Should adding "the place I'm standing at" be one gesture?
- Is moving the form itself (not just the button) part of this?

NEXT: product designer (visual focus) -- the structural options are laid
out; the next useful move is how a primary + looks once it's attached to
the sheet/header rather than twinned with the account badge, and whether
A/B can look on purpose.
