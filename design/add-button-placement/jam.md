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

---

## Turn 3 -- design director

Read: context, owner.md, the taste ledger in full, `design/inspo/project/`,
`current/` stills, both turns, all eight sketches at 3x, and the sign-in
crew's owner.md. No scoring yet; this is steering.

### My random draws (real RNG)

Oblique: **"The inconsistency principle."** Fields: **cartography (map
margins)**, **camping gear**.

- *Inconsistency principle:* the header today is a perfectly consistent
  row of outline icons. The cheapest honest way to say "this one is the
  point of the app" is to break that consistency **exactly once** -- one
  filled thing among outlines. That's the visual designer's "only one of
  its kind", and it argues against making + merely bigger or oranger
  *in the same shape*.
- *Map margins:* a printed map has a neatline (the frame) and a margin
  where the title, legend and the publisher's working marks live. In this
  app the list header *is* the margin: it carries the title ("LA LIST")
  and the tools. A + that belongs to the margin reads as part of the
  document; a + floating over the map reads as UI laid on top of it. That
  is the real case for attaching + to the header, better than "it's low".
- *Camping gear:* the useful bit is the pull-cord / ripcord -- the one
  bright tab on a dun-coloured pack, there so you find it by feel. Same
  answer as "eyes closed": edge-bound, bright, unmistakable. It also warns
  me off the tab: on a sheet, a tab on the top edge reads as *the thing you
  pull to move the sheet*, not "add".

### Where the directions stand (my steer, not scores)

1. **Claim-check stub -- the lead. Take it all the way.** It answers both
   halves of the owner's sentence by structure: *prominent* (the one filled
   field, edge-bound, inconsistent on purpose) and *reachable* (the thumb
   band, in every state, at the screen edge). It costs no header height,
   leaves the attribution and the tag gap alone, survives the desktop rail,
   and it rhymes with two things the owner already approved: the tag's stub
   ("thinking of that area kind of like a claim check") and the form's own
   **ADD LOCATION** button, which is already an orange field with navy caps.
   The add starts and finishes on the same orange. That last point is the
   strongest systems argument we have -- lead with it.
   What it isn't yet: a *stub*. At 3x it reads as an orange toolbar slab
   with a faint dashed line. Push (visual designer):
   - The perforation has to be the tag stub's perforation exactly (same
     dash, same weight, same ink) or the rhyme doesn't land. Nothing else
     added -- no notches (they read as dots, agreed), no texture the tag's
     stub doesn't have, no shadow.
   - Its width vs. the 32px icons: is 68px the right footprint, or does a
     stub want to be squarer/narrower? Size it to the header's spacing
     system, and align the + optically with the rows' × column below it
     (they share an axis whether we like it or not -- make it intended).
   - The open state (below) and the press state.
2. **Index tab -- I'd kill it** unless the visual designer can answer one
   objection: a tab on a bottom sheet's top edge is the platform grammar for
   "pull me to move this sheet". People will drag it. On top of that it
   sits on the attribution, eats the tag's 48px gap, and has no home on the
   desktop rail. Three structural costs plus a misread; the stub has none of
   them. If you disagree, bring the misread answer, not a prettier tab.
3. **Seal -- baseline only.** It's the stock FAB in our costume, moved. Keep
   one frame of it as the "least change" reference when the owner compares;
   it is not a concept going forward. The owner has said "these all seem
   kinda average" before; I won't send him a moved badge as an option.
4. **Postage stamp -- killed.** Agree with all three reasons; the stamp
   metaphor belongs to VISITED.

"Fewer variations" (ledger) -- I'd rather the owner sees **one strong
answer plus the baseline** than three placements. If a second concept goes
forward it must differ *in kind*, not be a re-styled stub. Wildcard worth
**one quick frame** from systems, then keep or drop: **"One band"** -- the
map carries no chrome at all; every control lives in the header margin
(+ as the stub, and the question of where the account goes). It's the
cartography reading taken to its end. It almost certainly collides with the
sign-in crew's badge, so it's a sketch to learn from, not a proposal -- and
if it's better, that's a question for the owner and the orchestrator, not
something we decide around the other crew.

### Calls on the open questions

- **Is where the form opens in scope?** Partly. *In scope:* where the close
  (×) lives once + has moved, and how the form appears from the stub --
  because "reachable" is the owner's word and a close that jumps to the top
  breaks "controls don't move". *Out of scope unless the owner opts in:*
  redesigning the form (field order, a bottom sheet, the form as a blank
  tag). Note what `current/addform.png` already shows: the form opens
  *above* the header and its ADD LOCATION lands right above the header
  (y ~470 vs header 544). With the stub turning to × in place, **Close and
  Add are both in the thumb band with the form unchanged.** Designers:
  verify that in a render before proposing any form move; if it holds, the
  form stays put. Search being third field down is a real reach problem,
  but it's a form problem -- owner question 1.
  *Stretch idea, for the owner, not for this round:* the form as a **blank
  Hanging Tag** you fill in, which on Add becomes the new pin's tag (the
  owner's own "the pin and what it opens are one idea"). Lovely, and a
  separate project. One line in the questions, no frames.
- **Gesture shortcuts** (hold + for "here", long-press the map): out of
  this round. They're accelerators next to a visible +, they don't answer
  "more prominent", and the long-press-map one is a gesture on a surface
  that already has pan/zoom/tap meanings. Owner question 3, as later ideas.
- **Land on what you added** (fly to the new pin, open its tag, select its
  row): good UX and consistent with the app's list-tap rule, but it's a
  behaviour change the owner hasn't asked for. Owner question 2, with our
  recommendation yes. Concepts may show it as the end frame, labelled.
- **Leaflet attribution:** non-negotiable that it stays visible on the map
  (OSM licence); its position is a design detail. The stub doesn't touch it,
  which is another point for the stub. No concept hides it.
- **"Controls don't move or grow":** the owner's words were about a control
  changing place *after you click it*. A stub in the header moves only when
  its surface moves, exactly like sort/filters/locate do today -- and it
  never moves as a result of tapping it (+ becomes × in place). I read that
  as within the rule. The tab-pulls-out-a-card transition (tab travels with
  the form) is outside it; dropped. I'll put the reading to the owner as a
  one-line confirm, not an open question.
- **Orange at rest vs orange-means-open:** I don't accept "orange field =
  open" as *the* system -- it's the account badge's toggle state. The other
  orange field in the app is the **primary action** (ADD LOCATION). So:
  orange field = the primary action, at rest; that's already true in the
  form. The open state of the stub must then be distinct without relying on
  colour alone (ledger: "colour alone is not enough"): + turns × in place,
  and the field changes. "Swap ends" (navy field, orange ×) is the visual
  designer's to prove -- show me rest / pressed / open side by side with the
  account badge closed and open in the same frame, so the owner sees one
  state system, not two.

### Checks every stub frame must pass before I score

1. **iPhone safe area, list collapsed.** The stub sits in the bottom-right
   corner -- right on the home-indicator swipe zone. Show it at 390x844
   with a 34px bottom inset; the stub must sit above the inset, not run
   into it, or swipes home will catch it (and vice versa).
2. **Filters panel open** -- does the panel cover the stub, sit beside it,
   or does tapping + close the panel? Show it.
3. **320px with the longest real city name and a long plan name** -- the
   title truncates sooner; that's acceptable ("I don't care if the
   truncation happens sooner") but it must look intended.
4. **A tag open + the navy selected row + the stub**, at once: three strong
   marks in the lower half (orange band if starred, navy row, orange
   stub). Hierarchy must hold: the tag is content and wins.
5. **Signed out** (tap → sign in) and **playground** (`?play`, tap → add),
   with the sign-in crew's badge alone at top-right in the same frame.
6. **Desktop rail** (>= 900px): one frame.

### Likely owner objections I'm already holding the stub to

- "It's just a big orange rectangle" / "kinda average" -- the stub has to
  read as a *claim-check stub* at phone size, by form and perforation only.
- "Too loud next to the selected row" -- check 4.
- "Why did the + and the account split up?" -- the answer is the one-line
  rationale above (the + is the action, the account is a setting); keep it
  that short.

### Questions for the owner (orchestrator to batch; not blockers)

1. Is the add **form** itself part of this (e.g. putting Search first, or
   reshaping it), or only the button and where its close sits? Our default:
   button + close only; the form stays as it is.
2. After you add a place, should the map **fly to it and open its tag**?
   (We'd recommend yes.)
3. Later ideas, not for now: **hold + to add where you're standing**;
   **long-press the map to add there**; the add form as a **blank Hanging
   Tag** that becomes the new pin's tag. Interested in any of these as
   separate pieces of work?
4. Confirm: a control that rides along when the list sheet moves (like the
   sort icon does today) is fine under "controls don't move or grow" -- the
   rule is about a control jumping after you tap it?

### Cross-crew flag (orchestrator)

With the stub, the account badge (and the sign-in crew's paper badge) owns
the top-right alone. That helps their job ("never louder than +": + is no
longer beside it), but their stills were drawn with + to the left. They
should re-shoot the corner without +. If the "one band" wildcard survives,
it affects them directly -- I'd raise it with them before anyone draws more
than a frame.

NEXT: product designer (systems focus) -- stress-test the stub against the
six checks above (safe area collapsed, filters panel, 320px, tag + selected
row, signed out/playground, desktop rail) and verify the "close and Add are
already in the thumb band" claim in a real render; plus one quick frame of
the "one band" wildcard to keep or drop.

---

## Turn 4 -- product designer (systems focus), pass 2

Stress test of the claim-check stub, using the visual designer's turn-2
sketch as it stands (68px orange field, dashed perforation, navy +). Its open
state is "swap ends" (navy field, orange ×). The stub is wired to the real
add button, so the form, auth and playground paths are the app's own code.
Script: `concepts/stub-stress/stress.js` (`ONLY=<scenario> node stress.js`).
Stills are at 3x (`desktop-1x.png` is 1x) in the same folder. Measurements
are CSS px at the named viewport.

### The claim: "Close and Add are both in the thumb band, form unchanged"

**It holds at full height and fails in a Safari tab.**

| Viewport | Add (y) | List sheet top | What a tap on Add hits | Still |
|---|---|---|---|---|
| 390x844 (Home Screen) | 450-494 | 544 | **Add** | `form844-3x.png` |
| 390x740 | 450-494 | 440 | the list (covered) | -- |
| 390x664 (Safari tab, toolbars showing) | 450-494 | 364 | **a list row** | `form664-3x.png` |
| 375x667 (SE-size) | 450-494 | 367 | **a list row** | `form667se-3x.png` |

- The × is in the band at every height. At 844 the stub's × (y 544-600) and
  Add (y 450-494) are 50px apart: both are thumb taps. That part is real.
- Below about 790px tall, **the list sheet covers ADD LOCATION**. The form
  sits in the page flow and the sheet sits on top of it. You have to scroll
  the page (it does scroll: Add comes up to y 294) or collapse the list.
  **This is not caused by the stub.** Today's app does exactly the same
  (`today-form664-3x.png`, same hit test on the unchanged page). It's a
  pre-existing bug on the phone in a Safari tab, and it lands on the exact
  job the owner named ("reachable on the phone").
- So the director's "the form stays put" is true for **where** the form is,
  but not for **how it shares the screen with the list**. Proposal, and it
  stays within the director's scope (no change to the form's fields): **while
  the form is open, the list sheet drops to its header band** (the collapsed
  position the app already has), so the form gets the whole screen above
  the band. Add then sits just above the band at any height, and the stub (×)
  stays in the band. Closing the form puts the sheet back where it was
  (job 4: don't lose my place). The stub never moves on the tap that opens
  the form. It only rides along when the band settles, the same reading the
  director gave "controls don't move".
  - Open question for the visual designer and the director: is the list
    dropping on open acceptable motion, or should the form simply scroll
    above the sheet? I prefer the drop: it's one existing state, and it says
    "you're adding now". The owner has said an open *tag* adjusts the list
    and doesn't close it; this is the form, not a tag, but name it to him.
- The keyboard is a separate matter, and it existed before. While you type
  in Search, the keyboard covers Add on every concept, today included. Once
  you pick a result and the keyboard drops, Add is low again. Not in scope.

### The director's six checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Safe area, list collapsed (34px bottom inset, Home Screen emulated) | **PASS** | The band is at y 750-806 and the stub sits inside it, with 38px of paper between the stub and the screen bottom. It stays clear of the home-indicator swipe strip. `safearea-3x.png` |
| 2 | Filters panel open | **Stub PASS, flow BLOCKER (pre-existing)** | The panel opens above the band and the stub stays visible and tappable (`filters-3x.png`). But tapping + with the panel open puts the form *behind* the panel: the tap on Add hits a filter chip (`filtersform-3x.png`). Today's + does the same. **Rule I'm adding: opening the form closes the filters panel** (and the sort menu). The code already has "one overlay at a time" for panel vs sort menu, so this extends it. |
| 3 | 320px, longest city / long title | **FAIL as sketched** | At 320 the title gets about 40px and reads "COP…" (`narrow-3x.png`). The header names the list (ledger: "the header should show whatever the list is"), and "COP…" names nothing. At 390, "Copenhagen List (112)" needs 174px and gets 118 (`title390`), so it truncates even on the owner's phone. Today, without the stub, it gets about 186 and fits. Truncating sooner is acceptable; truncating to nothing is not. Dials for the visual designer: a narrower stub (56px = one row height = 12px back), and tightening the three icons' spacing (their gaps are generous). Leave the copy alone, since the header text is the city name. |
| 4 | Tag open + navy selected row + stub | **PASS (hierarchy)**, with one note | `tag-3x.png` (starred place: orange band on the tag, navy row, orange stub). The tag is clearly the biggest, highest thing, so it wins. Note: that makes two orange fields on screen, the tag's starred band and the stub. They're far apart and say different things (starred / add). The CD should judge whether orange means "star" or "action" here. The ledger already makes the star the action orange, so I think it's consistent, but it's the CD's call. |
| 5 | Signed out / playground | **PASS** | Signed out: tap the stub and the sign-in sheet opens over everything (`signedout-3x.png`; it still says "Login Required", which the sign-in crew is renaming). Playground (`?play`): tap and the form opens, and Add is hittable at 844 (`play-3x.png`). In the signed-out real trip the top-right corner is empty today, which is the sign-in crew's Q1 (a sign-in badge there or not). Nothing collides either way. |
| 6 | Desktop rail (1280x800) | **PASS** | The stub sits at the rail header's right end (x 290-358, y 0-56), aligned with the rows' × column, with the map completely clear (`desktop-1x.png`). It works without a single desktop-only rule. |

### State-system observation (for the visual designer and the CD)

With the filters panel open, the filters icon becomes a **navy tile**, so the
band has two filled things: the orange stub and the navy filters tile.
With the form open, the stub's "swap ends" open state is *also* a navy field.
That is good news, not a clash. The app's state system already says **ON /
open = navy tile** (`--state-on-bg`), so a navy open stub obeys the system,
not an exception to it. Today's floating badges needed a named exception
("navy can't reverse to navy"); the stub doesn't. One catch: the system's ON
glyph is **paper** (`--state-on-fg`), not orange, so the open stub's × should
probably be paper to match the filters tile next to it. That's the visual
designer's call; I'm only reporting what the system says.

### Wildcard: "One band" (learning frame only)

`oneband-3x.png`: zoom gone (pinch zoom covers it on the phone), the account
as a fourth outline icon in the header, the stub at the end, no chrome on
the map at all.

- **Learned (keep):** a map with nothing in its top corners is noticeably
  calmer, and pins up there stop disappearing under badges. Today's account
  badge sits on a pin in `tag-3x.png`. This is evidence for the stub
  direction: every control removed from the map is a gain.
- **Learned (drop):** the band holds three utilities plus the stub, not
  four. With the account added, even "LA LIST (23)" truncates at 390 (74px
  of title). The account also reads as one more tool, when it's a setting.
  Desktop would still need zoom.
- **Verdict: drop as a concept.** It costs the title, collides head-on with
  the sign-in crew's corner, and buys calm the stub already mostly buys. No
  owner question.

### Flows, updated for the stub (draft for jobs.md)

1. **Add (rest)**: tap the stub. It turns × in place, the list drops to its
   band, and the form fills the screen above it. Search, pick, then Add
   (just above the band). The form closes, the list returns, and
   *(recommended, owner Q2)* the map flies to the new pin, opens its tag and
   selects its row.
2. **Cancel**: tap × (same spot). The list returns to where it was, with
   scroll, selection and any open tag unchanged.
3. **List collapsed**: the stub is in the bottom band. Same flow, nothing
   moves.
4. **Tag open**: tap the stub and the form opens. Does the tag close or
   stay? **Open question.** I'd keep the tag's pin selected and re-open its
   tag on cancel, since today the form covers the map and the tag is out of
   sight anyway. A builder detail, to confirm.
5. **Filters panel or sort menu open**: tapping + closes it, then opens the
   form (new rule; fixes the pre-existing blocker).
6. **Plans view**: the stub adds a *place*, as today, not a plan stop. The
   header names the plan, and long plan names get the same truncation as
   check 3.
7. **Signed out**: tap and the sign-in sheet opens; the stub looks the same
   as signed in ("visible, tapping offers sign-in", per the ledger).
   **Playground**: tap and the form opens.
8. **Desktop rail**: the stub is at the rail header's right end. The form
   opens as today.

### Builder-facing facts so far (not for the owner)

- `pinPopupTopPad()` (~4927) loses + from the top controls, and that's fine:
  the account badge is at the same height, so the tag-open top pad doesn't
  change.
- `planChrome()`/`planSafeBox()` (~6718) only count chrome over the map. The
  stub sits inside the sheet, so it adds nothing to plan fits.
  `TAG_SHEET_GAP` is untouched (the stub doesn't poke above the sheet).
- The stub is in `#locationsHeader`, so it rides `--sheet-lower` and the
  collapse transform for free.

### Questions this pass adds

- For the director and the visual designer: **does the list drop to its band
  while the form is open?** It's my fix for Add being covered below 790px.
  Alternative: the form scrolls.
- For the visual designer: what stub width and icon spacing leave
  "Copenhagen List (112)" readable at 390, and something better than "COP…"
  at 320?
- For the owner (orchestrator to batch), plain language: "On your phone in
  Safari, the Add button in the add form is hidden behind the list today.
  We'd fix that as part of this. OK?"

NEXT: product designer (visual focus) -- the stub passes 4 of 6 checks and
fails 320px on width. The two systems fixes (list drops while the form is
open; opening the form closes the filters panel) need a visual answer, and
so do the stub's width, its open state and the × colour against the state
system.

---

## Turn 5 -- product designer (visual focus), pass 2

Everything here was rendered headless at 3x. Script:
`concepts/sketches/pass2/render.js` (`ONLY=<prefix> node render.js`;
measurements go to `measure*.json`). Stills are in
`concepts/sketches/pass2/`. The real index.html is untouched.

### 1. The stub, resized to the system: 60px, centred on the rows' × column

- **Width: 60px**, the Hanging Tag stub's own height (60px). Not 56 or 68.
  At 390 the stub spans x 330-390, so its centre is **x 360, exactly the
  rows' × centre** (`.delete-btn` x 346-374, measured). This holds at every
  width, because both are anchored to the right edge: at 320 the stub runs
  260-320 and the × 276-304, so both centre on 290. The + glyph sits on the
  same axis, so the shared column is intended, not accidental.
- **Icon spacing:** the three 32px tiles go from `--gap` (12px) to
  **`--s1` (4px)**, and the stub sits `--s1` from the locate tile. The
  glyphs are 18-20px inside 32px tiles, so their own inset leaves about 14px
  of air between glyphs. Visually the trio still reads as evenly spaced. Tap
  targets stay 32px. The press/open tiles (3px radius) no longer touch,
  which I checked in `states-3x.png`. Result: the title gets **154px at 390**
  (was 118 in the turn-2 sketch, 186 today).
- **Intended truncation:** the drop order is "list", then the city
  ellipsizes; the count never truncates. (This is a structure change: the
  title becomes three spans: name / " list" / count. The copy itself is
  unchanged.)
  - 390: **COPENHAGEN (112)**, full name (`width-study-3x.png`, row 2;
    row 1 is today, with no stub).
  - 375: **COPENHAG… (112)**.
  - 320: **COP… (112)**, which is still poor. Proposal for the director:
    add the count to the drop order before the name ellipsizes, i.e.
    "list" → count → ellipsis, which gives **COPENHA…** at 320. The header
    names the list, so the name matters more than the count. This is a
    copy-behaviour call, so I'm flagging it and not deciding it.
  - Known nit: when the name ellipsizes, a sliver of space can sit between
    "…" and "(112)". That comes from ellipsis glyph rounding, and a builder
    can trim it (e.g. measure-and-clip instead of a flex basis).
- `LA LIST (23)` and every short city show in full, as today. "LIST" only
  goes when it doesn't fit.

### 2. The perforation: the tag stub's exactly, placed so it reads

- I copied the tag stub's perforation exactly: **1.5px dashed `var(--hair)`,
  inset 10px from both ends** (`.tag-stub::before`). Same weight, same dash,
  same ink. Nothing else is added: no notches, texture or shadow.
- Placement matters more than spec. **On the seam** (half on paper, half on
  orange) it read as a render glitch: hair-on-paper vanishes and a broken
  edge is left (tested at offsets -0.75 and 0). **4px (`--s1`) inside the
  orange**, the same hair dashes read as punched holes with paper showing
  through, which is what a perforation on a printed stub looks like. The
  colour runs a few px past the perforation, as print does. That's the
  version in every pass-2 still.
- On the navy open state the same hair dashes still read as holes, so the
  perforation never changes between states.

### 3. States: one system with the header and the form (`states-3x.png`)

Top row: rest, pressed. Middle row: open, plus the filters tile open beside
a resting stub. Bottom: the account badge closed and open, for comparison.

| State | Field | Glyph | Where it comes from |
|---|---|---|---|
| Rest | `--brand-orange` | navy + | the primary action: same as ADD LOCATION at rest |
| Pressed | `--brand-orange-deep` | paper + | ADD LOCATION's own press (`#submitBtn:active`) |
| Open | `--state-on-bg` (navy) | **paper ×** | the header's ON tile, the same as filters/sort open |
| Pressed while open | navy (keeps the tile) | paper × | the header rule "a press on an open button keeps the tile" |

- **× colour: paper, not orange.** The open stub is the header's ON state,
  and the ON glyph is `--state-on-fg` (paper). Next to an open filters tile
  it then reads as the same system. An orange × on navy would be the
  account badge's *rest* look, which re-twins the two controls I'm trying
  to split, and it would say "action available" rather than "this is open".
- **+ to × is one glyph turning.** The + rotates 45° into the × (same
  strokes, same 2.75 weight) while the field crossfades orange to navy,
  over 150ms. It reads as the same control changing state in place, not as
  a swap. It is not a pop and not a grow (ledger: "controls don't move or
  grow").
- **For the CD:** the account badge *open* is an orange field with a navy
  glyph, which is the stub's *rest* colouring. They differ in shape
  (scalloped circle vs stub), sit at opposite ends of the screen, and are
  never both "live" in a way that confuses: the menu is open, or the add
  is ready. But it's a seam in the colour system. Account-badge states
  belong to the sign-in crew's area, so this is flagged, not touched.

### 4. Systems' two proposals: my visual answer

**(a) List drops to its band while the form is open:** I back it. One
correction, though: it does move the control. Compare the two frames in
`form-664-A-vs-B-3x.png` (390x664, the Safari tab):

- **A (drop), left:** the whole form is visible: City, Category, Search,
  Address, Notes, Star, ADD LOCATION. Add sits just above the band and the
  × is in the band. This is a calm, complete screen: "you're adding now".
- **B (band holds, form scrolls above it with Add pinned), right:** at 664
  the form gets 364px. Search is scrolled out of view (the field you need
  first), Add sits pinned over Address, and the list rows stay on screen
  doing nothing. It looks broken, and it's worse the shorter the screen.
  B is dead visually.
- **But A moves the stub**: on the tap that opens the form, the × travels
  240px down with the band (from y 364 to 604 at 664; measured `nb2` in
  `measure.json`). That is literally "the button changes physical
  location after click", the owner's own words. Systems' turn 4 said the
  stub "never moves on the tap that opens the form"; with the drop, it
  does. I still prefer A, for three reasons:
  - It's honest. The *sheet* moves, using the collapse motion it already
    has, and the stub rides it like sort/filter/locate do.
  - Only in the list-up state does anything move. Collapsed, nothing moves.
  - The × lands at the bottom of the screen, the most reachable spot there
    is.
  But this has to go to the owner as a plain question, not under the
  director's reading of the rule. Suggested wording: "When you tap +, the
  list slides down out of the way and the + (now ×) rides down with it to
  the bottom edge. OK, or should the button never move?"
- Motion: the existing collapse transform and timing, with no new curve.
  The + to × turn (above) happens during the ride, so it reads as one
  gesture: the control turns as it goes. Close plays the reverse. Always
  drop, even at 844 where the form would fit: one behaviour, not a
  sometimes-moving button.

**(b) Opening the form closes filters/sort:** yes. The visual rule I'd
state is **"one ON tile in the band at a time."** In the same beat the
filters panel retracts into the band (with the drop), the filters tile goes
back to outline, and the stub goes navy. The band never shows two navy
tiles, and the open thing is always the one you just touched. The sort menu
just closes, as it does today when the filters panel opens.

### 5. Re: the director's checks, visually

- Check 4 (tag + navy row + stub): seen in systems' `tag-3x.png`. The tag
  wins on size and height. The two oranges (tag band = starred, stub = add)
  are 1,000px apart at 3x. The ledger already makes the star the action
  orange, so they're one family. The CD should confirm.
- Signed out: the stub looks identical (the ledger's "visible, tapping
  offers sign-in"). No greyed version, because + is the one control that
  *should* invite a tap.

### Open questions (new this pass)

- Director/owner: does the drop order add the count ("list" → count →
  ellipsis) so 320 shows COPENHA… rather than COP… (112)?
- Owner (via orchestrator): does the + riding down with the list when the
  form opens break "controls don't move"? See the wording above.
- CD: account-open (orange field) vs stub-rest (orange field). Flag for the
  sign-in crew's state work.

NEXT: design director -- the stub now has a spec-grade look
(60px on the × axis, the tag's perforation, a four-state table tied to
existing tokens), and the drop-vs-hold question has a visual answer plus an
honest flag on the owner's "controls don't move" rule. It needs steering:
is it ready to become the concept, and do the 320 drop order and the
moving-× question go to the owner?

---

## Turn 6 -- design director (closes the jam)

Looked at: `stub-stress/` (all of it, `tag-3x`, `safearea-3x`,
`filtersform-3x`, `narrow-3x`, `oneband-3x`) and `sketches/pass2/`
(`rest390`, `states`, `width-study`, `form-664-A-vs-B`). Still no scores --
concepts get scored when they exist.

### The concept: one, the claim-check stub

**The claim-check stub is the concept. Nothing else goes forward.** The
tab, the seal and the postage stamp are dead, and so is "One band" (agreed
with systems: it costs the title and buys calm the stub already buys). The
owner sees **today vs. the stub**, not a menu of placements ("I don't think
we need this many variations").

What pass 2 settled, and I'm keeping as the concept's spec:
- **60px stub**, centred on the rows' × axis at every width, icon gaps at
  `--s1`. Seen in `rest390-3x.png`: the + and the rows' × now share one
  column on purpose. Good.
- **The tag stub's perforation, 4px inside the orange.** Right call over the
  seam. My worry, for the concept stills: at 3x it reads, but it's a light
  hairline on a bright field, and it is the *only* thing that makes this a
  claim check rather than an orange toolbar button. Check it at 1x on a
  phone-size crop. If it disappears, raise its contrast within the tag's
  own ink family, don't add marks.
- **The four-state table** (rest orange / pressed orange-deep + paper glyph
  / open navy ON tile + paper × / pressed-while-open keeps the tile). It
  plugs the stub into the header's existing state system instead of
  inventing one. `states-3x.png` reads as one system next to the open
  filters tile. Approved as the concept's states.
- **"One ON tile in the band at a time"**, and opening the form closes
  filters/sort. Approved; it also fixes the pre-existing form-behind-panel
  bug.

### Rulings on what's open

1. **List drops to its band while the form is open, so the × rides 240px
   down: this is the owner's call, not mine.** The visual designer is right,
   and my turn-3 reading doesn't cover it: the owner's words are "I don't
   want ... the button to change physical location after click", and this
   is the button changing location after a click. I'm withdrawing the
   reading as a ruling. The team's recommendation stays **A (drop)**: B is
   visibly broken at 664 (Search scrolled away, Add pinned over Address),
   the motion is the sheet's own collapse, nothing moves when the list is
   already collapsed, and it fixes the hidden-Add bug on the phone in
   Safari. Concept stills show A, and the question rides with the concept
   (below). **It doesn't block concept work.** If the owner says "never
   move", that reopens the form's placement and we come back to it; nobody
   pre-builds a fallback.
   - "Always drop, even at 844" -- agreed: one behaviour.
   - The + turning to × *during* the ride -- agreed, as one gesture.
2. **Count vs city name at 320: decided, not an owner question.** The
   owner's rules already settle it: "the header should show whatever the
   list is", and secondary marks never outrank content. The name is the
   content and the count is secondary. Drop order: **" list" → the count →
   then the name ellipsizes.** COPENHA… at 320, COPENHAGEN (112) at 390.
   The same order applies to plan names in the Plans view. The
   "…  (112)" gap nit is a builder fix.
3. **× colour: paper**, the header's ON glyph. Decided. An orange × on navy
   would re-twin the stub with the account badge.
4. **Tag open, then +** (systems' flow 4): builder detail, not the owner's.
   Rule: cancel puts everything back as it was, including the open tag
   (job 4). What happens after Add rides on owner Q2.
5. **CD flags.**
   - *Two oranges on screen (starred tag band + stub)*: consistent. The
     owner made one brand orange for the star, the tag band and the +
     ("orange for star / tag top all the way"; "it's used on the account
     and + icon also"). In `tag-3x.png` the tag clearly wins. Pass.
   - *Account badge open = orange field, which is the stub's rest look*: a
     real seam. The account's "orange when open" predates the header's
     navy-ON system and now contradicts it. **Not ours to fix:** it belongs
     to the sign-in crew's state work, or the brand-token pass
     (`docs/backlog.md`). Orchestrator: pass it to them. Low risk in the
     meantime, because the two sit at opposite ends of the screen and the +
     is no longer the account's twin. Doesn't block.
   - *Pressed = orange-deep + paper glyph*: matches ADD LOCATION's press.
     Pass.

### What the concept phase produces

**One concept, "Claim-check stub", at concept fidelity: real-app renders**
(a copy of index.html, stub data, real copy, no mock-ups), 3x, 1170 wide,
each still a full phone screen readable on a phone. Plus a one-page
overview sheet that puts today and the stub side by side.

For the owner (five stills, no more):
1. **Rest, list up, 390x844**: today | stub.
2. **Adding, at 390x664** (the Safari-tab height the bug lives at): the form
   open, the list dropped to its band, × in the band, ADD LOCATION just
   above it. Plus a **3-frame strip** of the tap (+ at rest → mid-ride,
   glyph turning → × at the bottom), so he can see exactly what "the button
   moves" means before he answers.
3. **A tag open + navy selected row + stub** (`tag-3x` setup).
4. **States close-up**: rest / pressed / open, beside the open filters tile.
5. **320 wide, Copenhagen**: the drop order working.

Appendix, for me and the CD (not sent to the owner unless he asks):
collapsed + 34px safe area, filters open → tap + (panel closes), signed
out, playground, desktop rail. Systems turns flows 1-8 from turn 4 into
`jobs.md`, updated for these rulings.

Optional, and only if it's cheap: a tappable copy the owner can open on his
phone to feel the reach. Stills come first.

Split: the visual designer renders owner stills 1-5 and the sheet. The
systems designer writes `jobs.md`, renders the appendix, and checks the
stills against the flows. I steer after their first pair of turns, then
score.

### Owner questions, batched (orchestrator: send *with* the concept stills; none block concept work)

1. **(Decision, with still 2.)** "When you tap +, the list slides down out
   of the way and the + (now ×) rides down with it to the bottom edge, so
   the whole form and its Add button fit above it. That also fixes Add being
   hidden behind the list in Safari today. OK, or should the button never
   move?"
2. "After you add a place, should the map fly to it and open its tag?
   (We'd say yes.)"
3. (Optional, later ideas, no frames) "Interested later in: hold + to add
   where you're standing; long-press the map to add there; the add form as a
   blank luggage tag that becomes the new place's tag?"

Telling, not asking: the form's fields stay as they are, and the header
drops the word "LIST" before the count, and the count before the city
name, when space is tight. My turn-3 Q1 (form scope) and Q4 (rule
reading) are folded into Q1 above.

### Cross-crew (orchestrator)

- The account badge stands alone at top-right. The sign-in crew should shoot
  their corner without + beside it.
- The account-open orange-field seam (CD flag above) goes to them or to the
  brand-token pass.

NEXT: product designer (visual focus) -- render owner stills 1-5 and the
overview sheet for the one concept, at 3x from a copy of index.html, with
the rulings above (drop order, paper ×, perforation checked at 1x);
systems follows with jobs.md and the appendix frames.
