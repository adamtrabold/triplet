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

---

## Turn 2 -- product designer (visual focus)

### What applies (from the ledger and records)

- "Simple, simple, simple"; no dots/decoration that adds noise; no second
  row of text; no extra header height; the header text is the city name,
  not a control.
- Whimsy that carries meaning through **form and paper**, not added marks;
  the inspo's grammar is labels, tags, claim stubs, matchbooks, park posters.
- Action colours are navy or brand orange; one accent; colour on the thing
  that matters. Effects restrained (registration offset, not blur).
- Controls don't move or grow. Reuse existing control styles. A clear,
  matching state system.
- Today's state system: these badges are navy at rest and **invert to an
  orange field when open** (`.active`). Any + that is orange at rest needs a
  new open state -- flag, not a blocker.

### Random draws (real RNG)

Oblique: **"Disconnect from desire"**, **"Consider transitions"**. Fields:
**postal service**, **clockmaking**. Twists: **"it is half hidden"**,
**"it must work with eyes closed"**.

- *Disconnect from desire:* the desire is "make + bigger and oranger". Turn
  it off and prominence has to come from **being the only one of its kind**
  -- the only filled shape in the low band, the only thing touching the
  screen edge. Size stays near today's.
- *Eyes closed:* the thumb finds a screen **edge** without looking (Fitts:
  an edge-bound target is effectively infinite in one direction). A + that
  runs to the right edge of the screen beats a + floating 16px in from it.
- *Half hidden:* a + that is partly *of* the sheet -- tucked into it or
  growing out of it -- reads as attached on purpose, not floated on top.
- *Postal:* an envelope's stamp goes top-right; a seal sits on the flap.
  *Clockmaking:* a watch crown sticks out of the case edge, under the thumb.

### Sketches (headless, 3x; injected into an in-memory copy of index.html)

All four put + on the list sheet (systems' A/B), and the account badge alone
top-right. Script: `concepts/sketches/render-sketches.js`
(`ONLY=<name> node render-sketches.js`); stills
`concepts/sketches/<name>-{rest,collapsed}-3x.png`.

1. **Seal** (`seal-*`) -- today's scalloped badge, 62px, orange field, navy
   +, straddling the sheet's top edge at right. The most continuous with
   the current brand. *But:* it is still a floating badge, just moved; it
   lands on the Leaflet attribution; it's the stock FAB in a costume. I'd
   keep it only as the "least change" baseline.
2. **Index tab** (`tab-*`) -- a brand-orange file-card tab growing up out of
   the sheet's top edge at right (76x36, soft die-cut shoulders), navy +
   printed on it. Half hidden: its base *is* the sheet. Takes **zero header
   width** (sort/filter/locate untouched, good at 320px) and moves only
   because its surface moves. Reads like a real divider tab; whimsy by form.
   *Costs:* sits over the attribution (attribution has to move left or into
   the sheet); pokes 36px into the tag's 48px bottom gap; on the desktop rail
   the sheet's top edge is the screen top, so the tab has nowhere to grow.
3. **Postage stamp** (`stamp-*`) -- perforated paper stamp, orange field, +
   and a tiny "ADD", tilted -4deg, in the "envelope's" top-right corner.
   Most whimsical. *I'd kill it:* a postage stamp next to the rubber
   VISITED stamp muddies the app's one stamp metaphor; "ADD" is a second
   line of text; perforations + tilt + shadow is three effects for one
   button.
4. **Claim-check stub** (`stub-*`) -- the list header is a ticket, and + is
   its **tear-off stub**: a full-height brand-orange block at the header's
   right end, running to the screen edge, separated from the header by the
   same dashed perforation the Hanging Tag's stub uses, navy +. My lead:
   - **Eyes-closed target**: bottom-right of the band, bound to the screen
     edge, 68x57 -- the biggest, easiest tap in the app, without growing.
   - **Prominent by being the only one of its kind**: the only filled block
     in the band; three outline icons beside it stay utility.
   - **One idea with the tag**: the tag's stub is where its actions live
     (owner: "thinking of that area kind of like a claim check"); the list's
     stub is where *its* action lives. Same grammar, two surfaces.
   - **No extra header height**, no new shape vocabulary, no shadow.
   - Works list up, collapsed (it becomes a dock corner), Plans (the header
     names the plan; the stub stays), and on the desktop rail (it's in the
     header, not hanging off an edge).
   - *Costs:* eats ~68px of header width (the title truncates sooner at
     320px; icons shift left); a big orange block bottom-right is loud next
     to a navy selected row -- worth a quieter paper-field version with an
     orange + as the dial, if the director wants it; and its column sits
     directly above the rows' delete × column (fine -- it's in the header,
     not over rows -- but the eye links them; check).
   - Tried claim-check notches at the perforation: on the map side the top
     notch reads as a **dot**. Dropped (ledger: no dots).

Considered, not sketched: a **watch crown** (a half-disc poking out of the
right screen edge at the sheet line) -- great eyes-closed target, but a new
shape the app has nowhere else, and half-off-screen reads as a bug.

### Transitions ("consider transitions")

- **Tab -> card.** Tap the tab and a fresh blank index card is pulled up out
  of the list by it -- the card *is* the add form, the tab on its top edge
  now carries ×. Lovely, and literal; but the tab travels with the card,
  which is exactly "controls don't move". Name to the owner, don't assume.
- **Stub -> torn off.** Tap the stub: it stays put and inverts (navy field,
  orange × -- today's rest look, so the state system just swaps ends), while
  the form rises from the header like a new tag. The control never moves;
  the close is where the open was (systems' flow 7). No tear animation -- a
  quick press (one tone deeper, glyph to paper, the existing press state)
  is enough; motion goes on the form, not the button.
- **Landing on what you added** (systems' idea): the new pin's tag pops out
  of the pin as usual, and the new row takes the navy selection. The stub
  is the start, the tag is the end -- both claim checks.

### What a primary + looks like once it isn't the account badge's twin

- **Shape**: no longer the scalloped badge (that shape stays the account's
  -- the sign-in crew's paper badge then owns the top corner alone, which
  helps their job 4 "never louder than +": + isn't next to it any more).
- **Fill**: + becomes the band's only orange *field*. Account stays navy.
- **Size**: big by footprint (edge-bound), not by scaling the glyph; glyph
  stays the app's 2.5-2.75 stroke so it matches the icon language.

### Open questions

- Director: is the **form's origin** in scope? The stub's case is strongest
  if the form rises from it; if the form stays at the top, the tab and stub
  still beat today, but the close moves.
- Director: does the **attribution** move (tab/seal both collide with it)?
- Orange field at rest vs orange-field-means-open in today's state system --
  my answer is "swap ends", but the CD should see it.
- Sign-in crew: their badge was drawn left of +; with + gone from the
  corner it stands alone at top-right. Orchestrator to tell them.

NEXT: product designer (systems focus) -- stub and tab are my two live
directions (seal as baseline, stamp proposed killed); the next useful move
is stress-testing them against the ten flows (filters panel over the
header, tag gap, 320px header width, desktop rail) before the director
steers.
