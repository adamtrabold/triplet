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

---

## Turn 7 -- design director: new concepts

I'm taking over from the previous director. I started from its notes, and
I've looked again at the six stills the owner saw. The owner's reply,
verbatim: **"i want more than one concept."** We misread his "fewer
variations": he wants real alternatives to choose between. **The stub stays
in the set** (he didn't reject it, and Q1-Q3 are unanswered). This turn
opens a second concept round: **two new concepts, plus one quick frame to
keep or kill**. Each must differ from the stub *in kind*.

### What the stub is, so we know what "different in kind" means

The stub answers three questions one way:
- **Home:** the list header (the sheet). It rides the sheet.
- **Prominent by:** being the only filled thing in a row of outline icons.
  It has no words; it's a glyph.
- **The add happens in:** the existing form, which opens above the band.

So a new concept has to answer at least two of those three differently. A
re-coloured, re-sized or re-shaped stub doesn't count, and neither does
the stub moved to the header's left end.

### Draws (real RNG this turn)

Oblique: **"Abandon normal instruments"**, **"Remove specifics and convert
to ambiguities"**, **"Repetition is a form of change"**. Fields:
**sailing/rigging**, **surveying**, **bookbinding**. Twists: **"it appears
only when needed"**, **"it lives on the map, not the chrome"**.

What they gave me (I threw away my first idea, a bottom-centre FAB, before
drawing):
- *Lives on the map + surveying:* a surveyor doesn't fill in a form and then
  find the point. They drive a **stake** into the ground and write it up
  there. In this app the thing you make when you add is **a pin**. So the
  most honest + is the thing it creates (cf. the ledger's bonus: "the pin
  and what it opens are one idea").
- *Abandon normal instruments:* the + glyph is a normal instrument. What if
  the control is a **line you write on**, or **the pin itself**, rather than
  a + icon?
- *Bookbinding / rigging:* a book's sewn edge, a cleat on a gunwale. Both are
  **fixed parts of the frame** that the moving parts are made fast to. That
  is the opposite of the stub, which rides the moving part.
- *Repetition is a form of change:* the add starts and ends on the same
  object. The stub already gets this half-way (orange start, orange ADD
  LOCATION). One concept can take it all the way: **the control you tap to
  start is the control you tap to finish**.

### The set, after this round (up to four things for the owner, each a real choice)

| | Home | Prominent by | Where the add happens | Moves? |
|---|---|---|---|---|
| **Stub** (have) | the list header, rides the sheet | the one filled field among outline icons | today's form, anchored to the band | rides the sheet (owner Q1) |
| **B. Striker strip** (new) | **the screen's bottom edge, fixed** | **words and full width** | the form rises from the strip; **the strip becomes its own submit** | **never** |
| **C. Pencilled pin** (new) | **on the map** | **it is a pin, the thing you make** | **on the map**: you place a pin and its tag is the form | rides the map edge |
| D. Eyelet (one frame, keep/kill) | centre of the sheet's top edge | centred, the grommet the list hangs from | today's form | rides the sheet |

That gives the owner real choices: **a button in the band vs. a fixed strip
vs. adding on the map**, and "rides the sheet" vs. "never moves" as a visible
choice rather than only a question.

### B. Striker strip: settled vs. open

The name comes from the matchbook in the inspo: the striker is the strip
along a matchbook's bottom edge, the one part of it that's for *doing*
something. That's a reference, not a texture. **No striker grit**: the
ledger says no noise, and paper not clouds.

**Settled (this is the concept; don't trade it away):**
- A full-width strip **fixed to the screen's bottom edge**, below the list,
  in every state (list up, collapsed, a tag open, Plans, filters open). It
  **never moves**. This is the concept that answers "should the button never
  move?" with yes, and it doesn't depend on Q1.
- It **says what it does** in words (exact copy is the visual's call). It
  isn't an icon-only button. Prominence comes from width plus words, at the
  edge both thumbs can find with eyes closed. It's also **handedness-free**:
  two people use this app, and the stub serves a right thumb.
- **The same strip starts and finishes the add.** Tap it, the form rises
  from it, and the strip is now the form's submit. You tap the same place
  twice. (Repetition.)
- The account badge keeps the top-right corner alone, as with the stub.

**Open (the designers' calls, and I won't pre-resolve them):** colour and
height (orange field vs paper with orange words; whether it reads as a
generic CTA bar), where the close/cancel lives, how the strip and the
collapsed header band sit together without reading as two stacked toolbars,
how the form rises, and whether the list header loses anything.

**What I'll hold it to (likely owner objections):**
1. **"Extra height."** The strip is permanent chrome, and the owner has said
   "no extra header height". It isn't the header, but it costs list or map
   space all the time. Show the cost honestly at 390x664 (Safari tab): how
   many rows are visible today vs. with the stub vs. with the strip.
2. **"Average / a generic app CTA bar."** A full-width orange button at the
   bottom is the most stock answer there is. It only earns its place if it
   looks like Triplet's paper and ink, not like a checkout button.
3. **iOS:** the home-indicator inset (the strip must clear it, and its
   padding must look intended), and Safari's own bottom toolbar right
   underneath it in a tab. Show both.
4. **Keyboard:** check whether a fixed strip can ride above the iOS keyboard
   (`visualViewport`). If it can, submit is reachable *while typing*, which
   no other concept manages. If it can't, say so; don't fake it.

### C. Pencilled pin: settled vs. open

**Settled:**
- **+ lives on the map, as a pin.** It's a blank, not-yet-placed pin (the
  app's printed / stamped / **pencilled** grammar), resting at the map's
  lower edge in the thumb's reach. It is *not* a badge (that was the seal,
  killed as "the stock FAB in a costume"). The object you tap is the object
  you make.
- **Adding happens on the map.** Tap the pin and it goes to work: you find
  the place (search, then the map goes there), the pencilled pin stands on
  it, and the details you'd type into today's form are on **a blank Hanging
  Tag hanging from that pin**. Add inks the pin and the tag in place. The
  add ends exactly where the owner looks for places afterwards, so it covers
  owner Q2 by construction.
- This is the "form as a blank tag" idea that the jam parked for later. **I'm
  bringing it back as a full concept**, because "more than one concept"
  means he gets to see the bold one rather than read one line about it. It
  **changes the form**. The owner must see that labelled plainly as bigger
  scope (one line on the stills), not hidden.

**Open:** where exactly the blank pin rests (map bottom-right above the seam
vs. elsewhere at thumb height), what it looks like at rest so it reads as
"add" and not as another place, where search and the keyboard go (the tag
can't host a keyboard-height search at the top of the screen; the thumb
band probably holds the search line), how cancel works, and what the list
does meanwhile.

**What I'll hold it to:**
1. **"It's another pin, I don't get that it's add."** It has to read as add
   at rest, at 1x, with no tooltip, using the app's own pencilled marks and
   not a new badge.
2. **"That's the FAB again."** If it ends up as a round thing floating at
   the bottom-right with a + on it, it's dead.
3. **Collisions:** the OSM credit (it moves, but it must stay on the map),
   the 48px tag-sheet gap, pins at the map's bottom edge, and desktop.
4. **Cost of the tag-as-form:** City, Category, Address, Notes and Star all
   still have a home. Districts and streets (shape categories) still work
   ("same capabilities for every category"). No typewriter costume; it's
   the tag's own type.
5. **Low friction:** an add must not take more taps than today. Count them.

### D. Eyelet (one frame from the visual designer, keep or kill; not a concept unless it earns it)

+ as the **grommet** at the centre of the sheet's top edge: the list hangs
from it the way the tag hangs from its eyelet. It's centred, so either
thumb can reach it. **It was killed before in the shape of the index tab**,
because an object on a sheet's top edge reads as the drag handle. It comes
back only if one frame answers that misread *and* the tag gap. If it
doesn't, kill it in one line. No owner question.

### Same bar as the stub (each new concept, before I score)

- Real-app renders from **a copy of index.html in its own folder**
  (`concepts/strip/`, `concepts/pin/`, `concepts/eyelet/`). Stub data,
  real copy, 3x, 1170 wide, a full phone screen, phone-readable. Separate
  stills, no sheets.
- The owner set mirrors the stub's, so he can compare like for like:
  **(1) rest, list up, 390x844, today | concept; (2) the add, start to
  finish, as a strip of 3, at 390x664; (3) a tag open + navy selected row +
  the concept; (4) states; (5) 320 Copenhagen.** Plus whatever is unique to
  the concept: the strip's keyboard frame; the pin's finished add (inked
  pin + its tag).
- The appendix (me only): the director's six checks from turn 3 (34px safe
  area collapsed, filters open, 320, tag + row, signed out and playground,
  desktop rail).
- Each concept gets a `how-it-works.md` and a `looks-and-feels.md`, like the
  stub. jobs.md stays one file; systems adds the flows that differ per
  concept.
- The stub's stills are not re-rendered unless we change it. The owner has
  already seen them.

### Rules for this round

- **Differ in kind.** If B or C drifts back toward "a button in the
  header", I'll stop it at the next steer.
- **Kill early, in writing.** If a concept can't answer its first objection
  in one frame, say so and stop. Better that than polishing it to an 8.
- Only 9s go to the owner. If only one new concept reaches 9, he gets the
  stub plus that one, and I'll tell the orchestrator why the other died.
- The sign-in crew: B and C keep the top-right corner as the stub does, so
  nothing changes for them. Flag it if that turns out not to be true.

### Who goes first

**Systems goes first**: rough structural frames (not polished) from copies
of index.html for **B** (height budget at 844/664/320, safe area, Safari
toolbar, collapsed header + strip stacking, keyboard / `visualViewport`,
the strip-as-submit flow, cancel) and **C** (where the blank pin rests and
what it collides with, the place-then-tag flow, tap count vs. today, shape
categories, desktop), with measurements. Either one may come back "dead,
because..." with evidence. **Visual follows** with the look of both at
owner fidelity, plus the one eyelet frame. I'll steer after that pair.

NEXT: product designer (systems focus) -- B and C are both structural bets
(fixed chrome height and the keyboard for B; a map-side home and the
tag-as-form flow for C). Measure whether each can work in the real app
before visual spends time on how it looks.

---

## Turn 8 -- product designer (systems focus): B and C measured in the real app

I'm taking over from the previous systems designer. Both concepts are
prototyped in copies of `index.html` (`concepts/B-striker/`,
`concepts/C-pin/`, each with `render.js`, `frames/`, `measure.json` and
`how-it-works.md`; shared harness `concepts/lib-render.js`). Each copy is wired
to the app's own add code, and **both complete a real add end to end**. The
frames are rough on purpose: they settle structure, not the look.

Draw (real RNG): Oblique **"Reverse"**; field **air-traffic flight strips**.
What they gave me:
- **For B:** a flight strip is written while it's pending, then racked into
  the board. That's a possible motion for the visual designer: on Add, the
  strip "files" a new row up into the list.
- **For C, reversed:** a pin that stays fixed while the map pans under it
  (the ride-hail "set pickup" pin). That would give "add where I stand" and
  fine placement for free. It's a variant to note, not part of the concept.

### B. Striker strip: alive. Structure holds; the risk is taste and height.
- The strip is fixed at the bottom in every state, above Safari's toolbar,
  and holds the inset. Either thumb reaches it, and it sits in the same spot
  every time.
- **Strip-as-submit works:**
  - rest: "+ ADD A PLACE"
  - open: a paper field reading "PICK A PLACE FIRST" (inactive, which also
    guards against a double tap)
  - picked: "ADD HALLGRÍMSKIRKJA"
  - the app's submit then adds it (`done_664`).
- × is a 56px square at the strip's left end, using today's toggle, so the
  draft survives (`cancel_664`).
- The form rises from the strip over the list, and **the list never moves**.
  At 844 an open tag stays visible above the form.
- **Keyboard: yes, by script.** `visualViewport` puts the strip and form
  right on the keyboard (strip y 452-508 at 844, 4 results visible). That
  means ADD is reachable while typing Notes, and only B can do that. It's a
  Chromium emulation, so it's an iPhone check before anyone promises it.
  Worst case (664 + keyboard): only 2.5 results fit.
- **Cost, honestly:**
  - With the list up at 664, the map goes from 364 to 308 (-15%) if the map
    pays, or the list drops from 4 rows to 3 if the list pays.
  - Collapsed from the Home Screen, the bottom chrome goes from 94px to
    150px: two stacked bars (band and strip).
  - In a Safari tab, it's three stacked bars counting Safari's own toolbar.
  - The stub and C pay none of this.
- Coverage: all 6 jobs pass. Job 1 is the strongest in the set.

### C. Pencilled pin: alive, best flow, two structural failures at 664
- **Placement:** the blank dashed pin rests at the map's lower right, above
  the OSM credit, and rides the sheet edge.
- **Starting an add:** tap it, the list drops, and the band becomes the
  search line (autofocused). Results grow upward, so 4 are visible above the
  keyboard even at 664, the best of the set.
- **Picking a place:** the map flies there, a pencilled marker stands on the
  spot, and **a blank tag (the form) hangs low**, so ADD LOCATION lands at
  y 515-559 at 664 and y 695-739 at 844. At 320 the tag scrolls and Add
  stays sticky.
- **After Add:** that place's real tag opens and its row is selected. I
  found that if the place is in another city, the list must switch to it,
  or the new row is filtered out. Today that same case silently hides the
  new place. So Q2 is answered by construction.
- **Taps: 3** (pin, pick, Add) against today's 4, but only with autofocus.
  That needs an iPhone check, and B and the stub could have autofocus too.
- Shapes still work: the category on the tag re-hangs it, and the shape
  fetch runs on Add.
- No real pins sit under the blank pin at the default view in any of the 5
  cities.
- **FAIL 1, tag open at 664:**
  - The tag lowers the sheet, so the pin (y 312-376) covers the tag's
    VISITED segment (the tag foot is at y 346).
  - At 844 it clears.
  - Fix options for the director:
    - (a) `TAG_SHEET_GAP` goes from 48 to 96 on phones, costing a list row
      with a tag open.
    - (b) The pin hides under a tag, so you close the tag to add.
    - (c) The pin moves left while a tag is open.
- **FAIL 2, filters open at 664:** the panel leaves no map, and the pin would
  land at y -21. The honest rule is "close filters to add". At 844 it rides
  the panel's top and passes.
- **Smaller costs:**
  - Cancel drops the draft. B and the stub keep it.
  - Cancel must also restore the map view, since C moves the map.
  - "Bigger scope (the form changes)" must be stated to the owner.
- Coverage:
  - Job 1 is partial and job 5 fails at 664 with a tag open, until the
    director picks a fix.
  - Job 2 (reads as add at 1x) is the visual designer's to prove.

### For the director
- **Taste vs. structure:** B is structurally the safest of the set. Its open
  questions are taste: chrome height and "generic CTA bar".
- **Flow vs. reach:** C has the best flow, but its home gives way at 664 in
  two states. It needs your ruling on the tag-open fix and on "close filters
  to add" before it can reach 9.
- **Small things that would help all three concepts:**
  - search autofocus on open
  - switching to the new place's city after Add
- **Sign-in crew:** B and C both keep the top-right corner as it is. Nothing
  changes for them.

NEXT: product designer (visual focus) -- B and C are structurally sound
enough to draw at owner fidelity (B: strip look, the collapsed band + strip
stacking, an inactive state that isn't greyed-out web; C: a blank pin that
reads as "add" at 1x, and the blank tag in the tag's own type). Plus the
eyelet frame. Then the director rules on C's two 664 failures.

---

## Turn 9 -- product designer (visual focus): B and C at owner fidelity, D frame

I'm taking over from the previous visual designer and started from its notes.
B and C are drawn at owner fidelity from each folder's `index.html` copy (the
look is `visual.inc.html`, layered on systems' prototype in memory; their
files are untouched). Stills are at 3x, 1170 wide, mirroring the stub's set,
and each concept has a `looks-and-feels.md`. I looked at every still at
phone size.

Draws (real RNG): B: **"Only one element of each kind"** / laundry tickets /
"works with eyes closed". C: **"Work at a different speed"** / herbarium
sheets / **"it says its own name"**. D: "Fill every beat" / tide tables
(gave nothing; D dies on its own).

### B. Striker strip: drawn, reshaped
- **One seam, not a rule.** The 2px navy top rule is gone. The strip's only
  edge is the tag stub's perforation, in paper on orange. The strip is the
  list's tear-off, and with the list down the band sits straight on it as
  **one ticket (header + stub)**, not two toolbars (`7-collapsed`).
- **Printed, not plastic:** the orange carries the tag band's paper tooth
  (`--tex-flood`). That's my answer to "generic checkout bar": judge it on
  still 1.
- **The inactive state is a printed blank, not grey.** Open with nothing
  picked, the strip turns to the form's own paper and prints `ADD ______` in
  full navy (form + strip = one tag and its stub). Picking fills the blank,
  `ADD HALLGRÍMSKIRKJA`, and floods it orange. The paper-to-orange switch says
  "ready".
- Keyboard frame (`6-keyboard`): ADD on the keyboard while typing a note.
  Safari-tab frame (`8`): the honest height cost. No look removes 56px.

### C. Pencilled pin: drawn, reshaped
- **The blank pin says its own name:** a pencilled (dashed) ring, a straight
  string, and a small die-cut tag in brand orange printed **+ ADD**. It reads
  as add at 1x (`stills/st-pin-1x`). It isn't a disc, so it isn't the FAB.
  It's our pin and our tag. **I killed the dashed teardrop:** that isn't this
  app's pin, and it reads as a generic "drop location" tool.
- **The blank tag is the Hanging Tag itself** (die-cut, eyelet, string, stub,
  type). It's a herbarium label: printed captions, entries pencilled on
  dashed write-in rules (`CITY REYKJAVÍK ⌄ TYPE ATTRACTION ⌄`, "Add a note").
  **The stub is STAR | ADD LOCATION.** Starring prints the band, as on the
  real tag.
- **Add = inking:** the ring inks into the real category pin, TYPE is
  stamped, and the stub becomes DIRECTIONS | STAR | VISITED. Existing motion
  throughout (the tag's pop on a straight string, the stamp's ink-bleed).
  It's 270px tall at 390, against systems' 364.
- **664 failures:** drawn in the new look as `stills/pending-*` (not for the
  owner). My visual read on the tag-open case: the blank pin carries a tag, so
  with a real tag open there are two tags on screen. That argues for **(b),
  the blank pin steps aside while a tag is open**. It's the director's call.
- Flag: iOS zooms into 14px fields on focus (pencilled selects, notes); it
  needs an overlay/16px decision and an iPhone check.

### D. Eyelet: kill
One frame (`concepts/D-eyelet/`). Centred on the sheet's top edge it reads
as Material's docked FAB or a drag knob, covers the OSM credit, and crowds
the title. The tag gap is fine at 844, but that doesn't save it.

NEXT: design director -- score B and C as drawn, rule on C's two 664 failures
(my visual vote: (b) for tag-open; "close filters to add"), and decide which
of B/C join the stub for the owner.

---

## Turn 10 -- design director: rulings, scores, READY

I looked at all of these at phone size:
- B: `1-rest-today-vs-B`, `2-add-strip`, `4-states`, `6-keyboard`,
  `7-collapsed`, `8-safari-tab`, `stills/3-tag-open`
- C: `1-rest-today-vs-C`, `2-add-strip`, `2d-done`, `4-states`,
  `stills/pending-tag-664`
- D: `D-eyelet-rest`
- both `how-it-works.md` and both `looks-and-feels.md`

The scores are in `scores.md`, round 3.

### Rulings on what's open

1. **D (eyelet): killed.** At phone size it reads as a docked FAB or a drag
   knob, and it sits on the OSM credit. That's the misread it had to answer,
   and it doesn't answer it. No owner question.
2. **C, tag open at 664: (b). The blank pin steps aside whenever a tag is
   open, at every height.** (Not only at 664: "the same place every time"
   means it doesn't come and go by screen size.)
   - It's the visual designer's argument, and I agree: one tag at a time. A
     blank pin carries its own tag, and two tags on screen fight.
   - (a) is out. It changes the shipped tag-sheet gap for every tag in the
     app to protect one control, and it costs a list row against the owner's
     "show the list header, one item, half a second item".
   - (c) is out. A control that moves left when something else opens is
     exactly the owner's "controls don't move".
   - The cost is real, and the owner hears it plainly on C's stills: "with a
     place's tag open, close it to add". That includes `2d-done`: once the
     new place's tag opens, the blank pin isn't there.
3. **C, filters open: "close filters to add". Accepted, at every height.**
   Same reasoning: one rule, not a 664 special case.
4. **C, iOS 16px zoom: no zoom, and no viewport hack.** Don't use
   `maximum-scale` / `user-scalable=no`. That breaks pinch-zoom for people
   who need it, and this is a map app. Approved:
   - Each pencilled entry keeps its printed look over a transparent native
     `<select>` at 16px (the overlay visual proposed).
   - Notes and the search line are 16px.
   - That is one step above the real tag's notes. The blank tag isn't the
     real tag, so this is fine.
   - It goes on the iPhone-check list. It's a builder detail, not an owner
     question.
5. **C, the draft on cancel: keep it, in memory.** The pin is put back, but
   search text, the picked place, type, notes and star come back on the next
   tap. No marker stays on the map. The stub and B keep the draft, so C
   matches (job 4).
6. **B: the form's top stops below the account badge.** In `6-keyboard` the
   badge sits on the OSM credit and on the form's top rule. With the keyboard
   up (or on a short screen) the form scrolls inside itself and never runs
   under the badge. The credit sits clear of the badge.
7. **Small fixes that apply to every concept** (systems' turn 8: search
   autofocus on open, and switching to the new place's city after Add) are
   noted for the build of whichever concept wins. They don't change any
   concept. The city switch sits with the logged bug in `docs/backlog.md`.

### Scores (one pass; details in scores.md)

- **Stub: 9, standing.** Not re-scored; its work didn't change.
- **B. Striker strip: 9.** READY, once fix 6 is re-shot (a mechanical fix;
  I check the still before it goes).
- **C. Pencilled pin: 8.** One fix round, then I re-score. It's the bold
  option, the flow is the best of the set, and it's the only concept that
  ends on the place. What holds it under 9 is mostly finish in the owner
  stills, plus one prominence question (scores.md).

### What goes to the owner

Hold the send until C's re-score (one short round), so the owner gets one
message with every alternative. If C doesn't reach 9 in that round, send the
stub and B, plus one line on why C stopped.

READY: claim-check stub (already seen), B. Striker strip (after fix 6).
C pending one fix round.

NEXT: product designer (visual focus) -- re-shoot B `6-keyboard` with the
form clear of the badge, and C's fix list in scores.md round 3 (the blank
pin steps aside while a tag is open in every still incl. `2d-done`, search
frame clean of the top chrome, new row fully in view, a prominence/size
study of the pin, the plain-cost captions). Systems follows to update C's
how-it-works for rulings 2-5.

---

## Turn 11 -- product designer (visual focus): round-3 fixes

- **B fix 6:** the form stops below the account badge, with the OSM credit's
  row kept clear between them (keyboard up: form y 147, credit y 129-147,
  badge bottom y 113). `6-keyboard` is re-shot.
- **C fixes 1-5:**
  1. The blank pin steps aside whenever a tag (or the filters panel) is
     open: `3-tag-open`, `2d-done`.
  2. The search results are a full-width paper sheet capped below the zoom
     control and the badge: 3 results at 664 with the keyboard up.
  3. The new row is fully in view after Add.
  4. Size study `4b-size-3x.png`: chosen tag 55px wide, 15px words, tap area
     65x83.
  5. Still 1 carries both plain-cost lines.
- **Chrome check, now a script:** `concepts/chrome-check.js` runs on every
  frame (`clash` in each `stills/measure.json`). All owner frames are clean.

NEXT: design director -- re-score C (and check B's 6-keyboard); if C is a 9,
the owner gets stub + B + C in one message.

---

## Turn 12 -- director: C re-scored, the set is READY

- B's `6-keyboard` is clean: the form sits below the credit row, and the
  credit sits below the badge. B is confirmed at 9.
- All five of C's fixes landed. The tag at 55px reads as more prominent than
  today's badge, and the costs are told on still 1 and `3-tag-open`. **C:
  9.**
- `chrome-check.js` is clean on every owner frame. One desktop-only flag
  (`desktop-placed`: the search bar crosses the credit) goes to the builder.
- The stills list per concept is in scores.md round 4.

READY: claim-check stub, B. Striker strip, C. Pencilled pin. One message to
the owner, in the order stub → B → C, with one cost line each, plus jobs.md
Q1-3.

NEXT: orchestrator -- send the set to the owner (stills and cost lines in
scores.md round 4).

---

## Turn 13 -- design director (new director): round 5 steer after the owner turned the set down

I'm taking over. I started from `notes/director.md` (history, not argument)
and re-read owner.md, context, jobs.md, scores.md, every jam turn, all three
concepts' docs and the three rest stills the owner judged.

### The owner's reply (verbatim, 2026-10-13)

> The tag is novel but it doesn’t read like a plus button. The plus in the
> list header looks like an add button but is boring. The full width button
> at the bottom is way too much ui. I don’t want to just knee jerk to the
> standard — just floating the existing badge at either the left or right
> corner above the list — but nothing else has proved its weight yet. See if
> the team can push their concepts based on my feedback and also show me the
> best alignment with the existing badge

**This is rejection 1 of a set of 9s.** If the next set is turned down too,
we stop and bring the owner in to work with us. No third solo round.

### What his note tells us a 9 means to him (and what we got wrong)

1. **He judges stills as near-final craft at real size, not as ideas.** We
   scored "the idea" and he read the pixels. A 9 from now on means: it reads
   right at 1x on a phone in about one second, before any caption.
2. **"+" must be recognisable as a plus button.** C told you what it was in
   small words on a tag. To him that reads as a label, not a button. The +
   glyph is the sign, and words don't stand in for it.
3. **UI weight is a cost he feels straight away.** B's 56px orange bar got
   "way too much ui" on sight. "More prominent" never meant "bigger by
   area".
4. **Correct but plain loses as well.** A was read right ("looks like an add
   button") and still lost on "boring". Whimsy has to show at rest, through
   form, paper and ink. A perforation he can't see at 1x doesn't count.
5. **The baseline is the bar.** "Nothing else has proved its weight yet":
   every concept now has to beat *the existing badge, floated low*, not
   today's top-corner badge. Our stills compared each concept with today,
   which was the wrong comparison. In round 5, every owner still puts the
   concept beside the baseline.

Why we missed it: four rounds, each director 9, scored against our own
objections ("generic CTA bar", "the FAB in a costume") and never against
the simplest real alternative shown beside it. The seal was killed in turn 3
as "the stock FAB in a costume", so the owner never got to compare it. He
just asked for it himself.

### Draws (real RNG)

Oblique: **"Use an old idea"**, **"Go slowly all the way round the
outside"**. Fields: **road signs**, **field notebooks**. Twist: **"it
changes only when touched"**.

- *Use an old idea:* the old idea is the badge, and the owner just asked to
  see it. It is also a parts bin. The scallop and the navy-and-orange pairing
  are already "Triplet's +".
- *Road signs:* the symbol carries the meaning and the words come second. A
  road sign is recognised by its shape and glyph from a distance. That is
  C's fix and the test for every concept: blur the still, and "+" should
  still read.
- *Go slowly all the way round the outside:* for the baseline, walk every
  edge the badge touches: the sheet's top edge, the OSM credit, the tag's
  48px gap, the zoom, the safe area, the rows' × and icon columns.
- *Changes only when touched:* a warning for A. A tear-off on tap won't fix
  "boring", because he judged it at rest. The rest state has to carry the
  character. Motion is extra.
- *Field notebooks:* nothing for this round. Noted and dropped.

### The round-5 set (at most four things for the owner, each a real choice)

#### Baseline: Float, the existing badge just above the list (new, required)

This is not a strawman. It's the owner's own option, so it gets our best
work.

**Settled:**
- Today's badge, **unchanged in look**: 50px navy scallop, orange +, its
  states as today.
- It sits at the bottom-left or bottom-right corner of the map, just above
  the list sheet's top edge, and rides that edge (list up, collapsed, a tag
  lowering it).
- The account badge stays alone at top-right.
- A size step is **not** in scope. He said "the existing badge". If the team
  thinks a size change is the only way it works, show it as a second frame
  and say why. Never make it the pick.

**Open (the designers' calls):**
- **Alignment.** What it aligns to horizontally:
  - the screen gutter (`--s4`, today's top-right inset, mirrored);
  - the rows' column below it (right corner: the × axis, x 360 at 390;
    left corner: the category-icon axis, the owner's "one left channel" and
    "one centred axis for left-column items");
  - or something better.
- **Vertical gap above the sheet edge**, measured from the ink, not the box
  (owner: "align optically, by the rendered ink"). Its relation to the
  header's own spacing.
- **What gives way:**
  - the OSM credit at bottom-right (it must stay on the map);
  - the tag's 48px gap with a tag open;
  - pins under it.
- **Form open:**
  - where the form goes;
  - whether + turns × in place;
  - whether the sheet drops, which is the old Q1 (the badge riding the
    sheet is the owner's "controls don't move" question again; show it
    honestly).
- **Left vs right:** what each corner costs and gives. Right is the
  right-thumb reach and sits on the credit. Left is the left-thumb reach
  and sits under the zoom's column. Two people use this app.

**Owner stills:**
- both corners at rest (390x844, list up), side by side, with the team's
  alignment pick in each;
- then the picked corner across list up, list collapsed (34px inset), tag
  open (starred, navy row), form open, 320 Copenhagen and 390x664;
- one close-up of the alignment at 3x with the axes drawn (only on that
  one frame);
- a one-line pick and why.

#### A. Claim-check stub, pushed: keep "obviously add", lose "boring"

He accepted the read: it "looks like an add button". Keep the home (the
header's right end, thumb band, no header height) and the + glyph. What
failed is that at rest it's an orange rectangle. The claim-check idea lives
in a perforation he can't see at phone size.

**Push:**
- Character has to show at rest, at 1x, through **form, paper and ink**,
  never through added marks (no dots, no notches that read as dots, no
  second line of text).
- Dials, not instructions:
  - the stub's silhouette (a real die-cut edge, so it reads as a torn or
    cut ticket and not a slab);
  - the paper tooth on the flood (he liked texture on the tag band: "paper,
    not clouds");
  - how the + itself is printed or stamped (stamps are only for the clerk's
    entries, so be careful: the + is printed);
  - whether something from the badge (scallop, navy-and-orange) belongs on
    it ("use an old idea").
- Keep any effect restrained.

**Bar:** at 1x beside the baseline, he'd say "that's more interesting than
the badge", and it still reads as add before anything else. If it only gets
there with a caption, it isn't there.

#### C. Pencilled pin, pushed: it must read as a plus button

He liked the idea ("novel"). It failed on recognition.

**Push:**
- **The + is the sign.** At a glance it reads as a + button, with the
  pin-and-tag form carrying it, not a small tag that says "+ ADD".
- Take the road-sign test seriously:
  - the + glyph at least at today's badge glyph weight and size;
  - words optional or gone;
  - the shape simple enough that it doesn't read as a price label.
- The dashed ring with its string is three parts for one button. Question
  every part ("simple simple simple").
- It must still be our pin and our tag, never a disc (that's the baseline's
  lane now, so C has to differ from it in kind).

**Unchanged and still told plainly:**
- the add form becomes a tag on the map;
- "close the tag to add".

#### B. Striker strip: ruled out

- **Reason:** what made B different in kind was **full width plus words
  plus never moving**.
- Shrink it to a "much smaller" bottom-fixed control and you get a fixed
  bottom-corner button. That's the baseline without the badge's identity,
  or a second stub. Neither is a new choice.
- Kept at full width, it's the weight he just rejected.
- One line for the owner: "We dropped the bottom bar: smaller, it turns
  into the floated badge."

**Donor parts** (any surviving concept may use them, no owner question):
- the strip-as-submit idea: the blank `ADD ______` filled by the pick;
- the keyboard riding (`visualViewport`).

### Same bar for every round-5 owner still

- Real-app renders from each folder's copy of `index.html`, 3x, 1170 wide,
  full phone screen, phone-readable. **Plus a 1x crop of the + area for each
  concept.** I score from the 1x crop first.
- **Every still 1 is concept vs the baseline (picked corner),** not vs today.
  Today goes in one reference frame only.
- `chrome-check.js` clean on every owner frame.
- One plain cost line per concept, no more.
- No sheets.

### Who goes first

1. **Systems first: the baseline's structure.**
   - Prototype both corners in `concepts/E-float/` (copy of `index.html`).
   - Render the six states for each corner.
   - Measure the alignment candidates against the real axes: × column,
     category-icon column, gutter, ink edges.
   - Measure the collisions: credit, tag gap, pins, safe area, form-open
     behaviour, 320 and 664.
   - Bring rough frames and numbers, not a pick on looks.
   - Also: a structural sanity check on any C change that moves its footprint
     (credit, tag gap).
2. **Visual second:**
   - A pushed and C pushed, at owner fidelity, each with its 1x crop and
     still 1 beside the baseline;
   - the baseline's alignment pick and its owner stills at final craft. The
     look is today's badge, so this is alignment and optical spacing only.

Then I steer once and score all of it in one pass. Kill early in writing:
if A can't stop being "boring" without decoration, or C can't read as a +
without becoming a disc, say so in your turn. A smaller honest set beats
a padded one.

NEXT: product designer (systems focus) -- the baseline is the bar every
concept is now judged against, and its best alignment is mostly
measurement: both corners, six states, real axes and collisions in
`concepts/E-float/` before visual polishes it and pushes A and C.

## Turn 14 -- product designer (systems focus): the baseline Float, measured

I'm new on this seat and started from `notes/systems.md`. The prototype, the
frames and the numbers are in `concepts/E-float/`. The spec is
`how-it-works.md`, the data is `measure.json`. Today's badge, unchanged,
rides the sheet's top edge in either bottom corner.

**Pick: right corner, box 16 from the side and 16 above the edge (ink
19.9 both ways), `r-gutter-20`.**
- It's the right thumb's corner.
- It shares one ink line (x 370.1) with the account badge above it.
- It's the closest of the three alignments to the list's real ink: 2.9px
  outside the locate icon.

**Close second: the same rule at the left.**
- Its ink lands 0.9px from the category rings' ink: the owner's left
  channel, the best pure alignment.
- It never touches the credit.
- The cost is right-thumb reach, and Add loses the form's spine on its line.

**Centring on the row columns' axes (30 / 360) fails.** A 50px badge on a
28px column's axis sits 9px from the screen edge and reads as falling off.

**What the measuring found (each one needs a ruling):**
1. **The tag collides at today's `TAG_SHEET_GAP` of 48.** The tag is 316px
   wide, so it reaches both corners. A gap of 78 (the badge's top above the
   edge, plus 12) fixes it. At 664 the sheet lowers 64 instead of 34, and
   it's still 3 rows. No change at 844.
2. **The form: "stay" fails, "ride" works.**
   - Stay: the × lands on ADD LOCATION at 844, and Add is behind the list
     at 664.
   - Ride: the list drops, the × rides to the band, and Add sits on the
     ×'s line. Cancel restores the list, the tag (verified) and the draft.
   - The honest cost: + moves 240px on tap. It's owner Q1 again, sharper
     now.
3. **Filters open.** Riding the panel's top fails: y 107 at 844, y −1 at
   664. So the badge stays under the panel, which means "close filters to
   add", a job-1 exception (as C was given).
4. **The credit.** Right corner: it moves to bottom-left, which leaves only
   2.9px beside the badge at 320. Dropping the "Leaflet |" prefix wins about
   70px. Left corner: untouched.
5. **Builder:** `pinPopupTopPad()` must drop `#floatingAddBtn`, or tags open
   below a bottom badge.

**`chrome-check`:**
- Clean on every rest, collapsed, tag, 320 and ride-form frame.
- Its only flags are pre-existing: the credit under the open filters, and
  today's top-down form under the top controls.
- Pins: 0 under the badge, in 5 cities × list up and collapsed (sparse stub
  data).

C's footprint: the pencilled pin sat in this same bottom-right slot, so
findings 1, 3 and 4 apply to it as well. I'll do the structural check on C
once visual's pushed C lands.

NEXT: product designer (visual focus). The structure and the alignment
numbers are in. The baseline's owner stills at final craft come next (the
ink-gap dial, the two oranges with the form open), then A and C pushed,
each beside this baseline.

## Turn 15 -- product designer (visual focus): baseline stills, A and C pushed

New on this seat, started from `notes/visual.md`. Draws (real RNG):
**A:** "Remove specifics and convert to ambiguities" + coat check. **C:**
"What would your closest friend do?" + cartography.

**Baseline, Float** (`concepts/E-float/`, `E1`–`E8`, spec in its new
`looks-and-feels.md`). I keep systems' pick: **right corner, box 16/16, so
the ink sits 20px from the side and from the list**, on one line with the
account badge (E8 draws it). I checked the ink-gap dial against the 16 and
12 frames: at 12 the badge sits on the list's edge rather than in the
corner, so 19.9 stays. The look is today's, unchanged. Visual flag for E5:
the open × (today's orange ON) sits beside the orange ADD LOCATION, so two
oranges compete. Fixing it would change the badge's look, so it's the
owner's call if Float wins.

**A pushed: a ticket, not a slab** (`concepts/stub/A1`–`A8`). The stub's
torn-side corners are cut with **the Hanging Tag stub's own notches**
(concave 10px bites), so the perforation runs between them as on a real
coat-check ticket. The orange is on the band's paper tooth, and the + is
printed bolder (19px arms at 3px; the badge's are 12.8 at about 2.3). No
marks added. Dropped from the study: the scallop tear edge (reads as pinking
shears), postage perforation (a stamp stuck on the header) and the badge's
seal printed on the ticket (two marks, a smaller +, the badge in costume).
Not killing it: at 1x it's the more particular object beside the badge and
still says add first.

**C pushed: the + is the sign** (`concepts/C-pin/C1`–`C7`). No words. It's
a 60x48 die-cut orange tag (chamfers, a punched eyelet, paper tooth) printed
with a navy + heavier than the badge's (18.7px at 3.1). It hangs on the real
straight string from an 18px pencilled ring. Without the ring it reads as a
price label (variant `bare`, dropped), so the ring stays and the + is now
the loudest part. It's placed exactly where the floated badge sits, so C1
compares like for like. Not killing it: at 1x it reads as a + button that
is our pin and tag, and never a disc.

Every still 1 is beside the floated badge. Each has a 1x crop of the same
240x240 window. `chrome-check` is clean on every frame, and each concept
carries one cost line. Shared composer: `concepts/compose-r5.js`.

NEXT: product designer (systems focus) -- a structural check of C's new
footprint (60x84 at the Float's corner, the credit moved) before the
director scores the round-5 set in one pass.

## Turn 16 -- product designer (systems focus): structural check of C's footprint, A's title, coverage for all three

Script and numbers: `concepts/r5-check/` (`check.js`, `tap.js`,
`measure*.json`, `frames/`). Results are in each concept's
`how-it-works.md`.

**C ring (60x84, right 16, foot 20 above the edge): structurally sound.**
- Clean at 844, 664, 375 and collapsed with the 34px inset (band 750, pin to
  730). No pins under it in any city.
- It steps aside under a tag and under the filters panel, so it never
  collides there.
- Because it hides, **C keeps `TAG_SHEET_GAP` at 48.** The Float needs 78.
- The one tight spot is **320:** the moved credit runs 7px under the tag's
  column, 3.2px below its foot. It doesn't overlap, but it touches. Dropping
  the "Leaflet |" prefix fixes it, as it does for the Float (2.9px).
- The add flow still works on the new pin: `?play` focuses search at
  390/320; signed out opens sign-in.

**A ticket: the title pays 32px at every width** (60px stub, minus 28 won
back by tighter icon spacing).
- 375: " list" drops in 3 of 5 cities.
- 320: the count drops too, and COPENHA… and STOCKHO… still ellipsize, as
  today's 320 header already does for four cities.
- Add and × at 320 and 375 are fine.
- Cost line: "the list title gets 32px shorter: 'list' goes first, and at
  320 the count too."

**Jobs, supported or not:**

| Job | E Float | A ticket | C ring |
|---|---|---|---|
| 1 Reach | yes, except filters open | yes, no exceptions | yes, except filters open and tag open |
| 2 Main action | yes (position; look unchanged) | yes | yes |
| 3 Finish near the thumb | yes | yes | yes |
| 4 Don't lose my place | yes | yes | yes |
| 5 Never in the way | yes, with `TAG_SHEET_GAP` 78 | yes (costs the title) | yes |
| 6 Signed out / playground | yes | yes | yes |

There are no blockers, and no job goes unsupported in any of the three. Job
1's exceptions are the only differences in coverage. The Float's tag-gap and
credit rulings, and C's tag/filters exceptions, still need the director to
confirm them.

NEXT: design director -- the set is structurally checked and every job is
covered (exceptions named). Score A, C and the baseline in one pass, and rule
on the Float's `TAG_SHEET_GAP` 78, its filters "under", ride vs stay, and
the 320 credit fix.

---

## Turn 17 -- design director: round 5 scored

Owner, verbatim: "These are concepts so it’s normal for me to have
feedback". So it's feedback, not a rejection. **I'm dropping the "rejection
1 of 9s" framing from turn 13.** The lessons on what a 9 means stand.

I scored from the 1x crops first. The details are in scores.md, round 5.

**Scores:**
- **Float: 9**, after re-shooting E5 and E6.
- **A ticket: 9**, after a caption fix.
- **C ring: 8**, with one fix round.

**Rulings:**
1. Float, `TAG_SHEET_GAP` 78: accepted on phones, if Float wins. It costs
   no list row at 664.
2. Float with the filters open: the badge stays under the panel, so you
   close the filters to add (C's rule).
3. Float, form: ride, not stay. Stay is broken at both heights.
4. The credit drops "Leaflet |" at every width for Float and C. "©
   OpenStreetMap contributors" stays.
5. Two oranges: while the form is open, the Float's badge stays navy and
   only the + turns ×. ADD LOCATION is the one orange.

**Fixes (visual):**
- **E5:** re-shoot with the navy × badge.
- **E6:** re-shoot with the credit without "Leaflet |".
- **A1:** the cost line says 60px; the measured figure is 32px. Use
  systems' line.
- **C, the main one:** the dashed ring reads as a loading spinner (and as
  dots) at 1x. Find an unplaced-pin ring that isn't dashed and still says
  "not placed yet". Re-shoot C1, C2 and `2-add-strip` (whose frame a still
  shows the old "+ ADD" pin).
- **Before every handover:** a 1x pass on what each small mark *reads as*,
  plus a check that every caption matches the measurement.

After the fixes, the send is one message: Float → A → C. The exact stills
and cost lines are in scores.md. If C's ring doesn't reach 9, Float and A
go, with one line on C.

NEXT: product designer (visual focus) -- C's ring (the one real design fix)
plus the three mechanical re-shoots/caption fix; I check every re-shot still
and then release the set.

## Turn 18 -- product designer (visual focus): turn-17 fixes

**C's ring (the real fix).** The dashed ring is now an **empty pin**: the
map pin's own ring with nothing in it, solid 2px graphite (`--ink-2`) on
paper. I compared dashed, graphite, navy and hollow at 1x
(`C-pin/r5/ring-*`): navy competes with the +, hollow loses its head on the
map, and graphite reads as "a pin with nothing in it yet". The same ring
replaces the dashes on the placed marker. The search line's glyph became
ring-on-a-string (a pushpin), because a lone ring next to a field read as a
radio button. The credit lost "Leaflet |". Re-shot: C1–C7 and
`2-add-strip`, whose frame 1 now shows the current pin. C's still title is
"Blank pin" now that nothing is pencilled.

**Float.** The badge stays navy with the form open, and only its glyph turns
into a paper × (E5): ADD LOCATION is the one orange *button* (the account
badge's person glyph is also orange, so not "the one orange"). The credit is
"© OpenStreetMap contributors" in every frame (E1–E8 re-shot). At 320 it now
ends 68px from the badge.

**A1** carries systems' measured line: "The list title gets 32px shorter:
'list' drops first, and at 320 the count too."

**New checks, done.**
- 1x read of every small mark:
  - badge = an add badge;
  - ticket notches = cut corners;
  - perforation = a faint tear line;
  - empty ring = a pin head on a string;
  - eyelet = the string's end;
  - pushpin glyph = place search;
  - placed ring = the pin;
  - + = the loudest mark in each.
- Caption against `measure.json` on every still: the gaps (16 box / 20 ink),
  "same line" (Add and the × centres both at y 743), "nothing moves" (sheet
  top unchanged), results under the account badge (chrome-check clean), the
  320 title (`no-w no-c`). Two captions corrected (above).
- `chrome-check` is clean on every re-shot frame.

NEXT: design director -- check the re-shot stills (E5, E6, A1, C1, C2,
`2-add-strip`) and C's empty-pin ring against the 9 bar, then release the
set: Float, A, C.

---

## Turn 19 -- design director: re-shots checked, set released

- **Float: 9, confirmed.** E5's paper × on the navy badge is better than my
  orange-× ruling: it's the header's ON glyph, the same open state as A's
  stub. Accepted. E6's credit is 68px clear of the badge.
- **A: 9, confirmed.** The caption is fixed. A keeps "Leaflet |" on its own
  side, which is correct (ruling 4 is for Float and C only).
- **C. Blank pin: 8 → 9.** At 1x the empty graphite pin head reads as a pin
  on a string, not a spinner, and the + stays the loudest mark. The
  pushpin search glyph is the right call.
  - **One mechanical re-shoot:** `2-add-strip` frame 3 still carries
    "Leaflet |" (ruling 4).
  - Add a frame-vs-rulings check to the handover checks.

The final send list, in order, with cost lines, is in scores.md "round 5b".
If C's re-shoot is late, Float and A go first.

NEXT: product designer (visual focus) -- re-shoot C `2-add-strip` frame 3
with the credit ruling; then orchestrator sends Float → A → C per scores.md
round 5b.

---

## Turn 20 -- design director (new director): round 6 steer

I'm taking over from `notes/director.md`. I re-read owner.md, context,
jobs.md, scores.md, every jam turn and the three concepts' docs, and looked
at the round-5b owner stills again, 1x crops first: E1, E8, A1, A2, C1, C2,
C5.

### The owner on round 5b (verbatim, 2026-10-13)

> im not sold on any of the directions yet. i like them all for different
> reasons. the claim check feels fairly disconnected to the idea of a
> location, but maybe as a "ticket" it works if i think of it that way. my
> problem with the tag one is that the pin doesnt look like a pin and
> therefore the tag doesnt read as a tag (or a button for that matter).
> prominence is the problem on the badge... its the same weight and
> heirarchy as account, which it shouldnt be.

This is normal concept feedback, not a rejection. He likes all three. Each
note names **one** failure, and each one can be fixed. All three stay in
the set.

### What his notes have in common

Each note is about **what the object is, read at a glance**: a ticket for
*what*, a pin that isn't our pin, a badge that is the account's twin.
That's the same lesson as round 5 ("he reads the pixels, not the idea"),
one level up. Last round we fixed whether + reads as add. This round, the
**object carrying the +** has to read as the right thing, and rank above
the account.

Our own stills made two of these misses. Looking at them again:
- **E8 drew the Float's failure as its strength.** "Same vertical line as
  the account badge" plus the same shape, size and colour means **a pair**.
  We sold the pair; he read "same hierarchy". The alignment is fine; the
  sameness isn't.
- **C2: our "pin" is an 18px graphite ring on a stick.** At 1x it reads as
  a lollipop, a keyring or a balloon. The real pins in C5 are round
  category discs with a coloured ring and an icon (and visited ones are the
  dark sticker). Nothing in C's object looks like them, so the tag hangs
  from nothing he recognises.

### Draws (real RNG)

Oblique: **"Look at the order in which you do things"**, **"Change
instrument roles"**, **"Make a sudden, destructive unpredictable action;
incorporate"**. Fields: **railway ticketing**, **coat check**, **air
traffic control**. Twists: **"it is the only thing that is not navy"**,
**"it is torn"**.

- *Order of things / railway ticketing* (for A): a coat-check ticket is
  about a thing you left behind. A **rail or admission ticket is always a
  ticket to somewhere**: Reykjavík → Höfn, one entry to a museum or a
  park. That's the location link he's missing, and it's the ticket reading
  he offered us ("maybe as a 'ticket' it works"). The conductor's clipper
  is a die-cut hole in a shape. A ticket punched with *our pin's
  silhouette* would carry place through form (a hole, like the tag's
  eyelet), not through a printed mark. That's an idea to test, not an
  instruction.
- *Change instrument roles / "the only thing that is not navy"* (for
  Float): today + and account are both navy badges with orange glyphs. Swap
  one role and + becomes **the only filled orange object on the map**, with
  the account staying navy. Hierarchy then comes from kind and colour, not
  only from size.
- *Destructive action, incorporate* (for C): throw away C's hand-drawn pin.
  **Incorporate the app's real pin**, the one that is already on the map.
- *Coat check* came up again. It's what A already is, and it's the reading
  he called "disconnected", so I'm noting it and dropping it.
- *Air traffic control:* the useful part is that one thing gets cleared
  first. Primary ranks by being different in kind, not only by being
  louder. Same lesson as the Float.

### A. Ticket: make the ticket reading land, and connect it to place

**He gave the opening himself:** "maybe as a 'ticket' it works if i think
of it that way". Our job is to make him think of it that way at 1x,
without a caption.

**Settled:** the home (the header's right end, the thumb band, no header
height), the + as the sign, the die-cut notches, the paper tooth, the
states and the flow.

**Open (visual's call):** how the object says "a ticket **to a place**".
Routes to try (try at least two and kill fast):
- **Rail or admission ticket conventions instead of coat check:**
  proportion, the stub's tear side, how the edge is cut.
- **A punched hole in the pin's silhouette** (conductor's clipper), cut
  through the stock so the map or paper shows through.
  - Risk: at 1x a small hole reads as a **dot** (he said "absolutely not"
    to dots).
  - It has to be big enough to read as a pin shape, or it dies.
- **Continuity with the Hanging Tag's stub,** so the header's ticket and
  the place's tag read as one claim system: the ticket you hold, the tag
  you get.
  - This only counts if you can see it at rest. A caption doesn't count.

**Hard lines:**
- No second line of text.
- No city code printed on it: that's a label competing with the +.
- The + stays the loudest mark.
- If "location" only shows up through added marks, A stays a ticket for
  adding and we tell him so honestly, rather than decorating it.

**Bar:** at 1x beside the others, he'd say "a ticket" before "an orange
block", and it still says add first.

### C. Pin: it must look like this app's own map pin

**Settled:**
- C's idea: the add form becomes a tag on the map, and the object you tap
  is the object you make.
- The rules: close a tag or the filters to add; the pin steps aside under
  a tag; the credit ruling; one + (road-sign test).

**The fix: the pin is our map pin, drawn the way the map draws it.**
- Same disc, same ring weight, same size as the pins around it, with the
  "nothing placed yet" state shown inside that grammar.
- Compare it with the real pins in the same frame: C5's café, restaurant
  and park discs, and the visited sticker.
- The tag hangs from it the way the Hanging Tag hangs from a pin: popping
  out of the pin onto a straight string (owner rule), and ending in the
  tag's own band and eyelet patch. Right now it's an orange chamfered block
  that reads as a price label.

**Open (visual's call):**
- **Where the + lives:** in the pin's disc (where the category icon goes),
  on the tag, or split. One + only.
- **Whether the tag is the real tag in miniature** (cream body, orange
  band) or an orange tag. It has to read as a tag *and* as a button: he
  said both.
- **Size:** the real pin at map size may be too small to carry "primary".
  Show it honestly at 1x beside the account badge.

**Risk:** a real-looking pin can read as a place you can tap to see its
tag. I think that's close to the right affordance (you tap it and a tag
appears), but check whether it reads as *a place called "+"*.

**Bar:** at 1x he'd say "a pin with a tag" without being told, and it
ranks above the account badge.

### Float: + outranks the account

**Settled:**
- The home: right corner, riding the sheet's edge.
- The rulings: ride on form open, filters "under", `TAG_SHEET_GAP` 78 or
  whatever the new footprint needs, and the credit.
- It's still Triplet's own badge family. It must not become the stock
  FAB, and it must not be "way too much ui".

**Reopened by his note:**
- Last round's "a size step is not in scope" came from our reading of "the
  existing badge". His note now outranks that reading. He wants + above
  account in **weight and hierarchy**.

**Open (visual, then systems for the footprint):** break the twinship on
more than one axis. These are dials, not instructions:
- **Field:** orange field with a navy +, so it's the only filled orange
  object on screen.
  - Seam: the account badge's *open* state is an orange field. Flag it,
    don't fix it here (that's the sign-in crew's and the brand-token
    pass's).
- **Size:** a step up, measured against the account badge at 1x.
- **Silhouette:** same family, a different cut, so the pair stops reading
  as a pair.
- **The line:** keep the shared right ink line only if it still reads as
  "placed", not as "twins".
- Any shadow stays restrained (he's called shadows too harsh three times).

**Not ours to design:** a quieter account badge. That belongs to the
sign-in crew. If the team thinks + can only win by making the account
recede, show one labelled frame and flag it to the orchestrator.

**Bar:** blur the 1x crop and + is clearly first, account clearly second,
and it's still the badge he asked to see.

### A combined concept? Yes, one, at sketch fidelity, kill fast

He likes them for different reasons:
- the Float: the standard home, reach, simplicity;
- A: it reads as add;
- C: novel, and tied to place.

A merge is worth one frame only if it **differs in kind** from all three
and carries something from each. My candidate:

**D. Floated ticket:**
- A's ticket, freed from the header: no title cost.
- At the Float's corner, where his own instinct put +.
- Carrying place the C way: the punched pin hole, or the pin it hangs from.

It's a loose object in the map corner, not part of the header (unlike A),
not a badge (unlike the Float), and not a tag with a form-as-tag flow
(unlike C).

**Kill rules (say so in one line, and we drop it):**
- it reads as "A moved to the corner";
- it needs two marks to say "place";
- it loses the + at 1x.

The owner gets at most four things: Float, A, C, and D only if it scores 9
on its own. Never a merge in place of one of his three.

### Same bar as round 5, plus one change

- **Unchanged:**
  - 1x crop first, the same 240x240 window;
  - real-app renders at 3x;
  - `chrome-check` clean;
  - one cost line;
  - frames checked against the current rulings;
  - captions checked against the measurements;
  - a 1x "what does each mark read as" pass.
- **New:**
  - every still 1 and every 1x crop shows **the account badge in the same
    frame**, because hierarchy against it is now judged on every concept;
  - the "what it reads as" pass names the *object* first ("a ticket", "a
    map pin", "the add badge, ranked above account"), then the marks.

### Who goes first

1. **Visual first.** All three notes are about how an object reads, so this
   is UI and brand. Bring:
   - C's real-pin rebuild;
   - A's place link (at least two routes, kills named);
   - the Float's hierarchy dials;
   - D as one frame.

   Each at the 1x crop beside the account badge. Rough is fine for D.
2. **Systems second:**
   - the footprint of whatever the Float and D become (tag gap, credit,
     320, 664, collapsed with the inset);
   - whether C's real-pin size changes its slot.

Then I steer once and score all four in one pass.

NEXT: product designer (visual focus) -- every note this round is about what
an object reads as at 1x (ticket to a place, our own map pin, + ranked above
account), which is UI and brand; bring C's real-pin rebuild, A's place
routes, the Float's hierarchy dials and one D frame, each at 1x beside the
account badge, before systems measures the new footprints.

---

## Turn 21 -- product designer (visual focus): round 6 (new visual designer)

I took over from `notes/visual.md`. Draws (real RNG): Oblique **"Emphasize
differences"**, **"Remove specifics and convert to ambiguities"**; fields
**botanical specimen labels**, **beekeeping**; twist **"it is the first
thing printed"**. "Emphasize differences" drove the Float. The specimen
label (a pin goes through the label) became D's pinned cut, which died.

**One view for everything.** Every round-6 frame is the same zoomed view
of Reykjavík (zoom 14 over the stub's places), so 17 real map pins are in
shot beside every concept and the account badge is in every still 1 and
every 1x crop. The 1x window is the phone's right 240px, from the account
badge down into the list header (x150–390, y0–610). Next to it is a
**squint test**: the same crop, blurred.

### Float: + outranks the account on three axes
Each dial was rendered alone first (`R6-F3-dials-3x.png`):
- **Orange alone** looks *lighter* than the navy account badge at 1x.
- **Bigger alone** (60px) still reads as a pair.
- **Orange + 60px** wins the squint test outright.
- **Edge:** the pick is a **postage-stamp edge** (24 fine lobes), still the
  badge family's wavy cut but a different kind. 10 round lobes read as a
  flower or a gear (settings), so out.
- **The pick:** orange stock (the band's tooth), navy + at 3px, 60px,
  stamp edge.
  - Scaled about the scallop's lower-right ink corner, so the ink stays 20
    from the side and the list.
  - Pressed: deep orange, paper +.
  - Open: R17's navy with a paper ×.
- **The one account frame** (`R6-F4`, flagged): the account badge at 40px.
  Our read is that it isn't needed. Flag to the orchestrator only if the
  director disagrees.
- **Seam (flag, not fixed):** the account badge's *open* state is an
  orange field too. The clusters are deep orange discs, so "the only
  orange object" is true at street zoom but not at city zoom.

### A: five routes, two kept as readings, two killed (`R6-A3`)
- **Admission (pick).** The tear line moves inside the stock (15px), with
  half-round notches on it at top and bottom: a rail or museum ticket, and
  the Hanging Tag stub's own notch. It reads "a ticket" at 1x.
- **Tag cut.** The Hanging Tag's chamfers and eyelet, turned on its side.
  It reads "a place's tag", the only route that says place without an
  added mark, but it stops being a ticket. It's the director's call.
- **Killed:**
  - round punch: our pin is a disc, so its punch is a **dot**;
  - pin-teardrop punch: a water drop, and not our pin.
- **Honest line:** A is a ticket for adding. Rail conventions make "ticket"
  land; they don't say "place".

### C: rebuilt on the app's own pin (`R6-C3`)
- **How it's drawn.** The pin is drawn by `badgeHtml()`, the function that
  draws every map pin, with a `#g-add` + in the glyph slot.
  - The tag is the Hanging Tag in miniature: die-cut, orange band on the
    tooth, eyelet wash patch and grommet, cream stock, the tag's shadow,
    and the straight string to the eyelet on one axis.
- **Tried:** solid 24, dashed 24 (the app's existing "(approx.)" kind),
  orange-deep dashed, + on the tag (with an empty pin), and the selected
  pin.
- **The pick is the selected pin with a bigger tag.** That's the map's
  exact "pin with its tag open" grammar: a 32px filled navy disc with a
  paper +, and a 72x56 tag (object 72x94, 16 from the side, 20 above the
  list).
- **Why the others lost:**
  - The 24px pins read as pins but rank below the account badge.
  - A + on the tag empties the pin into the 5b ring again.
- **Risk:** in the squint test C is level with the account badge rather
  than clearly above it. It ranks by colour and position, not by mass.

### D: floated ticket, one rough frame: **kill**
- **Bare ticket (72x44 at the Float's corner):** it reads as "A moved to
  the corner" (kill rule 1).
- **Pinned with our pin:** two marks, and the empty pin reads as a
  placeholder (kill rule 2).
- It does outrank the account badge.

### Checks
- `chrome-check` plus the + object against the credit, tag, zoom, account,
  submit, sheet and pins: **clean on every frame** (`*/r6/measure.json`).
- Captions were checked against the measurements.
- **What each object reads as at 1x** (object first, then its marks):
  - **Float:** an orange stamp-edged badge, ranked above the account. The
    + is navy, the edge is perforated.
  - **A:** a ticket at the end of the header. Its marks: the notches on
    the tear line, the + on the stock.
  - **C:** a pin with its tag open. The pin is a selected pin with a + in
    it; the tag is the place tag, blank.
  - **D:** a ticket on the map.

NEXT: product designer (systems focus) -- measure the new footprints: the
Float's 60px stamp badge (`TAG_SHEET_GAP`, credit, 320, 664, collapsed
with the inset); C's 72x94 pin-and-tag slot; whether the tag-cut A route
changes anything structurally. Then the director scores Float, A, C (D
recommended killed) in one pass.

---

## Turn 22 -- product designer (systems focus): round-6 footprints

I took over from `notes/systems.md`. Everything is measured on fresh copies
of **today's main**, where signed out = the playground:
- scripts: `concepts/r6-check/` (`check.js`, `tag-rows.js`, `a-check.js`);
- numbers in its `measure*.json`;
- frames in `frames/`.

`chrome-check` is clean everywhere except the pre-existing filters flags.
Pins under either object: 0 in all 5 cities, list up and collapsed.

**Float (60px stamp badge, box 314.8,468.8 – 374.8,528.8 at 844).**
- The ink keeps 19.9 / 19.9 and the shared 370.1 line with the account
  badge. Collapsed with the 34px inset: 15.2px above the band.
- **`TAG_SHEET_GAP` 78 no longer clears.** At 664 the tag's foot is 6.8px
  from the badge's box. **88** (box top 75.2 above the edge + 12) gives
  16.8.
  - Cost: 664 and 375x667 keep 3 rows, the same as today.
  - **320x568 keeps 1 row, against today's 2.** 78 cost the same; it wasn't
    measured in round 5.
- **At 320 the "Leaflet |" prefix now overlaps the badge by 6.3px.**
  Dropping it is now required (C needs it too).
- **Ride form:** concept.inc's Add maths assumes 50px. As coded, Add stops
  2.8px from the × and sits 4.2px low. Read the rendered box and it's back
  to 12px short and centred (Add 56–302.8).
- **Builder:** draw it at 60, not `scale(1.2)`.

**C (72x94 slot, 302,430 – 374,524).**
- No structural change. The slot still steps aside under a tag, and that's
  load-bearing: at 664 its disc would sit on the tag's VISITED segment.
  `TAG_SHEET_GAP` stays 48; showing it under a tag would need 126.
- Costs:
  - the dead zone is +34% (3.2% of the map at 844);
  - the box's bare corners beside the disc tap + (builder: hit-test the
    parts only);
  - the tag's right edge is 3.9px off the account badge's ink line
    (visual).
- One good fit: real selection follows the open tag, and C hides under
  any tag. So C's selected pin never shares the screen with a real one.

**A's tag cut: same box, same title, same flows.** Its structural cost is
the promise:
- it moves A into C's object (a tag) while delivering a form panel, so A
  and C stop differing in kind;
- in the sort/filter row a tag shape reads as "tags" (a filter).

Admission keeps A distinct. That's the director's call.

**D: systems agrees with the kill.** Structurally it *is* the Float (same
element and rulings; `TAG_SHEET_GAP` would be 76). It takes A's look and
the Float's costs, and loses A's one structural strength: no job-1
exception.

**Job 6 now reads against the playground** (`jobs.md` updated). Signed out,
+ adds in every concept (verified on the Float, A and C). Only a stale
stored session still asks you to sign in, and then nothing moves.
- The account badge is now **always on screen** (it says "Sign in" in the
  playground), so "+ outranks account" holds in every state, not just
  signed in.
- Draw (real RNG): *"What would your closest friend do?"* A friend opening
  a shared link lands in the playground. The first thing they'll try is +,
  and "Sign in" is the one door they shouldn't need. The hierarchy matters
  most there.

**Coverage, round 6:**

| Job | Float | A (admission / tag cut) | C |
|---|---|---|---|
| 1 Reach | yes, except filters open | yes, no exceptions | yes, except tag open and filters open |
| 2 Main action | look + position (director's squint test) | yes | **open:** visual's squint test has it level with account |
| 3 Finish near the thumb | yes, with the scale-aware Add | yes | yes |
| 4 Don't lose my place | yes (verified: tag `rey10` reopens) | yes | yes |
| 5 Never in the way | yes, with **`TAG_SHEET_GAP` 88** + the prefix drop | yes; the title costs 32px | yes (it steps aside); prefix drop |
| 6 Signed out (playground) | yes | yes | yes |

No concept has an unsupported job.

NEXT: design director -- the footprints are measured and nothing blocks a
score. Rule on `TAG_SHEET_GAP` 88 (and the 320 one-row cost), on admission
vs tag cut, and on D's kill. Then score Float, A and C in one pass.

---

## Turn 23 -- design director: round 6 scored

I scored from the 1x crops and squint tests first (F2, A2, C2). Details and
the send list are in scores.md, "Concept round 6".

**Rulings:**
- **`TAG_SHEET_GAP` 88 on phones: yes.** At 320x568, `F-tag_320` still
  shows the selected row whole plus about 31px of the next 56px row, which
  meets the owner's "one list item, half second" floor.
- **A: admission, not the tag cut.** The tag cut's eyelet is a dot at 1x,
  it turns A into C's object, and it reads as a filter in the header row.
- **D: killed.** It gets one line to the owner.
- **The "Leaflet |" prefix** goes for the Float and C at every width.
- **The Float's edge:** caption it as "a finer cut of the badge's edge",
  never "postage stamp". Stamps belong to VISITED.
- **The account step-down:** not needed.

**Scores:**
- **Float: 9.** + is first and account second, on three axes, and it's
  still our badge.
- **A, admission: 9.** "Ticket" lands at 1x, and the place question is
  answered honestly with the five routes. He set the ticket condition
  himself.
- **C: 8.** The pin is now our pin and the tag reads as a tag, which
  answers his note. But in the squint test it's level with the account,
  and he made exactly that note about the badge this round. The cream
  tag body vanishes into the map.

**Fixes:**
- **C (visual, one round):**
  1. Rank above the account within the pin and tag grammar.
  2. Put the tag's right edge on the account's ink line (it's 3.9px off).
  3. Re-shoot tag-open and the add strip with the new pin and placed
     marker.
- **Float (mechanical):**
  - re-crop `R6-F5` (its Adding crop cuts off ADD LOCATION's label; its Tag
    crop shows no tag);
  - new full screens at 60px: tag open at 664, adding at 844, 320 with a
    tag;
  - fix the captions.

The send is one message, Float → A → C, once C is back. If C misses,
Float and A go, with a line on C.

NEXT: product designer (visual focus) -- C's rank fix (the one design
question left) plus the Float's re-crops and new full screens; then I check
every frame and release the send.

---

## Turn 24 -- design director: C re-scored, flags ruled, final send

The details and the final send list are in scores.md, "Concept round 6b".

- **The orange band on C's rest tag: drop it.** On a real tag the band
  means *starred* (`.tag-band` prints only when `loc.starred`), and the
  blank tag C opens into is unstarred (C6 frame 3). The tapped object has
  to be the object you get. The orange stays on the pin.
- **Orange disc vs the clusters: accepted.** A different shade (brand vs
  deep), a navy + against paper numbers, a hanging tag, always in the
  corner. C6 frame 1 shows both at city zoom, and they read apart. It's
  also the map's own selected-pin grammar (filled with its ink) in the
  action colour, and C7 resolves it into the place's colour.
- **C: 8 → 9.** It's our pin, the tag reads as a tag, and + clearly
  outranks the account in the squint test (the orange pin did that).
  **One mechanical re-shoot:** C1, C2, C4's pick and C6 frame 1 with the
  tag unbanded. I check that the squint still puts + first before C goes.
- **Float frames F5–F8: clean.** The captions are fixed. 9 confirmed.
- **Final send:** Float (F1, F2, F3, F5, F6, F7, F8) → A (A1, A2, A3) → C
  (C1*, C2*, C6*, C5, C7). Plus one cost line each, the D line, the
  tag-gap "just so you know", and Q2/Q3.

NEXT: product designer (visual focus) -- re-shoot C's rest tag without the
starred band (C1, C2, C4 pick, C6 frame 1); I check the 1x squint, then the
orchestrator sends Float → A → C.

---

## Turn 25 -- design director: round 7 steer (owner picked two to take further)

### The owner on round 6 (verbatim, 2026-10-14)

> As far as add buttons the badge is probably the most interesting to me
> right now. I like it in orange and bigger but maybe the plus should be on
> the left? Easier for me to reach.
>
> The tag shape in the list header is also interesting — not everything in
> these places is a ticketed thing so the tag ties better to the view state.
> Id like to see that mocked

**Settled by him:**
- The Float is orange, 60px, with the finer edge. That's liked, so it
  doesn't change.
- The left corner is his to try ("easier for me to reach"). We don't argue
  reach. Last round we read reach as right-thumb; he's told us his.
- The tag cut is the A to mock. His reason is that **a tag ties to the view
  state**: the tag is what a place opens into, and not everything on the
  list is a ticketed thing. That replaces the admission ticket.
- C is parked. It isn't in this round, and its pending re-shoot is off.

**Open, and ours:**
- the Float's best alignment and behaviour at the left;
- how the header tag answers the two objections I raised against it
  (below).

### Draws (real RNG)

- **"Mirror it"** (the Float): mirroring isn't free. Every right-corner
  decision was made for the right, and the left has its own neighbours.
  Walk them again; don't flip the numbers.
- **"Retrace your steps"** (A): the tag cut came out of round 6 as a route
  I ruled against. Go back to it, now with his reason, and answer my
  objections instead of inheriting them.
- **Library cards** (A): the card pocket and its tab. A tab or tag at the
  end of a row is a familiar "pull this out" object, not a filter chip.
  Use it only if it helps the "not a filter" problem.

### 1. Float, left corner (systems first, then visual)

**Settled:** the look as round 6, and the rulings that carry over:
- ride on form open;
- filters "under";
- **`TAG_SHEET_GAP` 88** (the 316px tag spans both corners, so the gap
  should hold; confirm it);
- the navy open state with a paper ×.

**Measure and decide (systems), at 60px:**
- **Alignment:**
  - `l-gutter-20` was the cleanest alignment at 50px (ink 0.9px from the
    category rings: the owner's "one left channel").
  - Re-measure at 60, scaled about the badge's lower-left ink, so it stays
    20 from the side and 20 from the list.
  - Check whether the ring channel still holds, and whether the + glyph
    centre or the ink edge is the right thing to align.
- **The OSM credit:**
  - With the badge at the left, the credit can go back to Leaflet's
    default bottom-right.
  - Measured at 50, it was 72.9px clear at 390. Check 320 at 60px.
  - Say whether the "Leaflet |" prefix can stay. If it fits, it stays:
    ruling 4 was made for the right corner.
- **The form line:**
  - Today ADD LOCATION would start at x 78, so the form loses its 56px
    spine on that one line.
  - Find the honest options and show them, e.g. Add beside the × as
    measured, or Add on the spine with the × on its own.
  - I'll rule after seeing them. "Small marks line up exactly" is in play.
- **The left column:**
  - The zoom control is at the top-left, so the + badge and the zoom's +
    share one side. Check at 1x that they don't read as one control family.
  - The back-swipe edge (16px from the left): an iPhone check, listed, not
    solved here.
- **The usual states:**
  - list up at 844 and 664;
  - collapsed with the 34px inset;
  - tag open at 664 and at 320;
  - adding at 844 and 664;
  - filters open;
  - desktop (the map column's left corner sits beside the rail).
- Pins under the badge in all 5 cities.

**Owner stills (visual, after systems):**
1. Right vs left at rest, side by side (so he sees the move, not a new
   object).
2. The 1x crop plus squint, with the account badge in frame. The account
   is now at the opposite corner, so check that hierarchy still reads
   with no shared line.
3. Tag open at 664.
4. Adding at 844 (the form line).
5. Collapsed with the inset.
6. 320 with a tag open.

### 2. A, the Hanging Tag cut in the list header (visual)

**Settled:**
- A's home: the header's right end, flush to the edge, the thumb band, no
  header height.
- The + is the sign and the loudest mark.
- Orange stock with the band's tooth.
- States, the flow and the cost: the title is 32px shorter.

**The mock must answer my two objections from round 6 (by showing, not by
caption):**
1. **The eyelet reads as a dot at 1x** (the owner's "no dots"). At 1x it
   must read as a punched hole with its patch, like the real tag's, or not
   be there.
   - Visual decides whether the tag reads as a tag with the chamfers alone.
2. **A tag shape in the sort/filter row reads as a "tags" filter.** It must
   read as an object at the end of the band, not a fourth icon.
   - The dials: scale against the 32px icons, being flush to the edge, the
     orange stock, and the + carrying the meaning.
   - The library-card tab draw may help.

**Plus one I'm adding now:**
3. **Orange on a tag means "starred" today** (the band). The header tag is
   all orange, as the action colour. Show that it reads as "add", the same
   orange as ADD LOCATION and the Float, not as "a starred tag".
   - This is the round-6b check: a borrowed part keeps its meaning in the
     state it's shown in.

**His reason has to show:**
- At least one still has a real place's tag open above the list, with the
  header tag at the band's end, so the "ties to the view state" rhyme can
  be seen.
- Also check that the two don't compete: the open tag is content and must
  win.

**Owner stills:**
1. The header tag vs the round-6 admission ticket at rest (the comparison
   he asked for).
2. The 1x crop plus squint, with the account badge in frame.
3. Rest / pressed / open.
4. A real tag open with the header tag (the rhyme and the hierarchy).
5. Adding.
6. 320.

**Systems:** a quick structural check only. The box is the same as A's,
so confirm the title cost and the hit area, and that the chamfered side
doesn't crowd the locate icon at 320.

### Bar (unchanged)
- 1x crop and squint first, account in frame.
- `chrome-check` clean.
- Captions checked against the measurements.
- Frames checked against the current rulings.
- The "reads as" pass names the object first.
- Borrowed parts keep their meaning.
- One cost line each.

### Who goes first

Systems, on the Float's left corner at 60px. It's mostly measurement, and
the form-line question needs options before visual polishes anything. Then
visual does both concepts' owner stills, the A tag mock being the main
design work, with systems' quick A check alongside. Then I score both in
one pass.

NEXT: product designer (systems focus) -- the Float's left corner is a
mirror that isn't free (alignment at 60px, the credit going back to the
right, the form line losing its spine, the zoom column, the usual states);
measure it and bring the form-line options before visual shoots the owner
stills and mocks A's Hanging Tag cut.

---

## Turn 26 -- product designer (systems focus): Float at the left, measured; A's tag cut checked

Measured on today's main:
- scripts: `concepts/r7-check/` (`float-left.js`, `a-tag.js`);
- numbers in `measure.json` and `measure-A.json`;
- frames in `frames/`.

`chrome-check` is clean apart from the pre-existing filters flags. 0 pins
under the badge in all 5 cities, list up and collapsed.

**Float, bottom-left at 60** (box 15.2,468.8 – 75.2,528.8 at 844):
- **Alignment.** Align the ink edge, not the glyph. The ink sits 19.9 from
  the side and the list, 0.9px from the category rings' ink: the "one left
  channel" holds at 60. Centring the + on the ring axis (30) puts the box
  flush with the screen edge.
- **The credit goes back to bottom-right.** "Leaflet |" fits at 390
  (63.7px clear) and 375 (48.7). **At 320 it overlaps by 6.3**, so: drop
  the prefix below about 338px of map width, keep it above.
- **`TAG_SHEET_GAP` 88 is confirmed.** 664: 16.8px clear, 3 rows. 320:
  13.8px clear, 1 row (today 2). These are the right corner's numbers
  exactly.
- **Zoom on the same side:** 7.9px off the badge's ink line and 395px
  above it at 844. They never touch. Whether two "+" on the left read as
  one family is for visual's 1x.
- **Form line: two honest options**, both with the × riding down at the
  left:
  - **A, beside:** Add 87.2–374 on the ×'s line. It's 286.8 wide, but it
    leaves the 56 spine by 31.2px.
  - **B, above:** Add 56–374 on the spine, 12 above the ×, with the × alone
    below. It's 64px further from the thumb and costs 64px of map (none
    left at 664).
  - Rejected: moving the × right on open (the button changes place on
    tap), and shrinking the × (a 28px target).
  - Both break no job. The open ×'s centre (45.2) is 15px off the band's ▲
    axis below it. That's for visual if "small marks line up" decides it.
- **States:** collapsed with the inset (15.2 clear of the band), tag →
  form → cancel (`rey10` reopens), filters "under", the playground adds, a
  stale session asks.
- **Desktop:** the map column's bottom-left at 375.2,724.8, 15.2px from the
  rail.
- **iPhone list:** the back-swipe edge (Safari tab only: the box starts at
  15.2).

**A, the Hanging Tag cut** (the same box as A):
- The title costs 32px, as before (COPENHA… at 320).
- The cut corners and the eyelet tap as +, and locate keeps its own edge.
- The chamfers *open* space beside locate (24px at the corners, 10 at
  mid-height), so the cut doesn't crowd it at 320.
- The flag: the eyelet hole is about 19.5px from locate's round crosshair.
  That's the strongest pull toward "a fourth round icon" and "a dot".
  Moving or dropping it is visual's call.

**Coverage:**
- Float-left: job 1 yes except with the filters open; jobs 3 to 6 yes
  (job 5 with 88 and the conditional prefix).
- A: all six as before.
- Nothing is unsupported.

NEXT: design director -- rule the form line (A beside vs B above) and the
prefix rule (drop it below about 338px), so visual can shoot the
Float-left owner stills and mock A's Hanging Tag cut with the eyelet flag
in hand.

---

## Turn 27 -- design director: round 7 rulings (short)

I looked at `r7-check/frames/F-formA_664` and `F-formB_664`.

1. **Form line: A, Add beside the ×.**
   - B leaves the × alone in a dead row, puts Add 64px further from the
     thumb, and leaves no map at 664. "Reachable" is the owner's word.
   - Add and × are one action row, so the 31px step off the 56 spine reads
     as that row's own start, not as a misalignment. Make it exact:
     - Add's left edge = the ×'s ink + 12, the same gap as the right corner
       had;
     - Add's right edge on the fields' right line (374).
2. **The "Leaflet |" prefix:** keep it at a map width of 338px or more and
   drop it below. "© OpenStreetMap contributors" always stays, verbatim.
3. **The open ×'s centre is 15px off the band's ▲: no change.** The badge
   aligns by its ink edge to the left channel (the owner's "one left
   channel"), the same rule that places it at rest. Moving it on open
   would be a control changing place on tap. Visual's 1x "reads as" pass
   confirms that the × over ▲ reads as intended. If it reads as a slip,
   flag it to me; don't fix it on your own.
4. **A's eyelet (19.5px from locate's crosshair): visual's call,** held to
   the bar from turn 25:
   - at 1x it must read as the tag's punched hole with its patch, never as
     a dot or a fourth round icon;
   - dropping it is fine if the chamfers alone say "tag";
   - show the call in the 1x crop.

The usual bar from turn 25 applies to everything.

NEXT: product designer (visual focus) -- shoot the Float-left owner stills
(form line A, the conditional prefix) and mock A's Hanging Tag cut at owner
fidelity, the eyelet and the dot, filter and starred-orange reads answered
in the 1x crops; then I score both in one pass.

---

## Turn 28 -- product designer (visual focus): round 7 stills (Float at the left, A as the tag cut)

Built on copies of today's main by `concepts/r7-stills.js`, using systems'
r7 patches plus the turn-27 rulings. Composed by `concepts/compose-r7.js`.
Every frame passes `chrome-check` plus the + object check (credit, tag,
zoom, account, submit, sheet, pins): see `E-float/r7/measure.json` and
`stub/r7/measure.json`.

### Float, bottom-left (60px orange, a finer cut of the badge's edge)
- **Rest:** box 15.2,468.8 – 75.2,528.8. The ink is 19.9 from the side
  and from the list, on the row icons' line.
- **Credit:** back at the bottom-right, "Leaflet |" kept at 390, dropped
  at 320.
- **Adding:** Add runs 82.5–374, which is the ×'s ink (70.5) + 12, out to
  374. Both are centred on y 738.8.
- **The other states:** tag 664 (3 rows); collapsed (ink 19.9 above the
  band); 320 tag (1 row whole plus about half the next).
- **Stills:** `E-float/R7-F1` to `R7-F6`.
- **1x reads (report, nothing fixed):**
  - **× vs ▲:** the × (centre 45.2) sits right of the band's ▲ (about
    x30), 15px off-axis, about 70px above it. At 1x the × reads as the
    start of the Add row, not as a slip. The ▲ is small and far enough
    below. Mild; no flag.
  - **Two +s on the left:** the zoom's + is a white boxed segment at the
    top and this one is an orange cut badge at the bottom. At 1x they
    don't read as one control family.
  - **Squint, with no shared line:** the orange + is clearly first and the
    account second (`R7-F2`).

### A, the Hanging Tag's cut in the list header
- **Eyelet: dropped** (`R7-A3` shows all three):
  - the two chamfers alone read as a tag;
  - a hole reads as a dot beside locate's crosshair;
  - a hole + patch reads as a little switch knob, a fourth control.
- **Not a filter:** at 1x it's an object at the band's end, not a fourth
  icon (`R7-A2`). It's 60x57, flush to the edge, orange, with a 28px +,
  against the 24px navy line icons.
- **Not "starred":**
  - On a real tag "starred" is a cream tag with an orange band. This one
    is all orange with a navy +, the same orange as ADD LOCATION.
  - With a starred place's tag open there are two oranges on screen
    (`R7-A5`, right), and the + is what keeps the header tag reading as
    add. Honest, mild.
- **The rhyme:** in `R7-A5` the open place tag's chamfers and the header
  tag's are visibly the same cut.
- **Hierarchy:** the open tag (316 wide) wins; the header tag is a small
  object at the band's end.
- **Stills:** `stub/R7-A1` to `R7-A7`:
  - vs ticket;
  - 1x + squint;
  - eyelet alternatives;
  - rest / pressed / open;
  - tag open (a place and a starred place);
  - adding;
  - 320.

NEXT: design director -- score Float-left and A's tag cut in one pass
(1x and squint first: `R7-F2`, `R7-A2`, `R7-A3`). Rule on the two mild
reads: the × vs ▲ offset, and two oranges with a starred tag open.

---

## Turn 29 -- design director: round 7 scored

Scored from the 1x and squint crops first (`R7-F2`, `R7-A2`, `R7-A3`).
Details and the exact send are in scores.md, "Concept round 7".

- **× vs ▲:** accepted. It reads as the start of the Add row, and moving it
  would be a move on tap.
- **Two oranges with a starred tag open:** accepted. One brand orange for
  star, band and action is the owner's own system, the navy + keeps the
  header tag reading as add, and the open tag wins.
- **Float, bottom-left: 9.**
- **A, Hanging Tag cut (no hole): 9.** `R7-A3` shows the hole options he
  can compare.
- **One mechanical re-crop:** `R7-A4`'s REST and PRESSED crops show the
  credit strip's edge as stray tick marks. Crop below it; I check it.

Send: Float (R7-F1 to F6) → A (R7-A1 to A7, A4 re-cropped), with a cost
line each, two "just so you know" lines and Q2.

NEXT: product designer (visual focus) -- re-crop R7-A4 below the credit
strip; I check it, then the orchestrator sends Float → A.

---

# Pass A — new direction: blank pin + blank-tag form (2026-10-14)

## Turn 30 -- product designer (systems focus): the package, jobs first

New systems designer. Jobs were written from the owner's words before I
opened jobs.md, C's files or the form code; then checked against them.

Owner, verbatim: "I actually want to come back to the blank pin version of
the add button — I also want to rev the add modal to be more like filling
out a blank tag…I feel like together that could be a cool package."
Plus (to the orchestrator): keep every direction open; this is the newest
idea, not the only one.

### Jobs (new scope: the + AND the form)

Jobs 1-6 in `jobs.md` stand for the + itself. New, for the package:

- **J7 Know what tapping + will give you.** The blank pin + blank tag at
  rest is a preview of the thing you're about to fill out; the tap "takes
  the blank tag". This is what makes the owner's two objections ("doesn't
  read like a plus button", "the pin doesnt look like a pin … the tag
  doesnt read as a tag (or a button)") answerable: the resting object
  earns its shape because the form IS that shape.
- **J8 Name the place** (search; the name line is the first thing you
  write on the tag).
- **J9 Put it in the right spot** — see where it will land before you
  commit.
- **J10 Say what kind of place it is** (TYPE), without a modal-looking
  dropdown.
- **J11 Star it and note why while adding** (STAR = the band, notes =
  the tag's notes line). *(inferred from today's form)*
- **J12 See exactly what you'll get.** The filled tag looks like the real
  tag will: same layout, same order, band if starred. *(inferred: "filling
  out a blank tag")*
- **J13 Districts and streets go through the same tag.** *(inferred:
  "Every category should have the same information and capabilities")*
- **J14 Don't be asked what the app can infer.** City (and, where OSM
  says, type) is pre-filled; you only touch it to correct it. *(inferred
  from "User should not have to select distance" / the taste ledger's
  "don't make the user pick settings the app can infer")*
- **J15 Watch the blank become the place.** Add ends on the real pin with
  its real tag open, in the list's right city. *(inferred; C already
  does this, and it fixes today's silent vanish into another city)*
- **J16 Recover:** no results, OSM shape missing ("(approx.)"), city
  ambiguous (shape-city / new-city confirm), save failed — all inside the
  tag, nothing lost. *(inferred)*
- **J17 (scope question, not a blocker) Mark it visited while adding** —
  you often add the place you're standing in. Today's form can't. The
  real tag's stub has VISITED; a blank tag's stub could too.
- **J18 (scope question) Fix a tag after adding.** Today nothing but
  star/visited is editable after Add (only `.update({[field]: next})`
  toggles exist). If the form is a tag, "edit" is the same tag with its
  entries pencilled again — the redesign gets edit nearly for free.

### Facts that shape it (from the code and C's record)

- Today's form order is City, Category, (shape hint / confirms), Search,
  Address, Notes, Star, Add. The real tag's order is band, eyelet, name,
  address, stamped TYPE, notes, stub. **The two orders disagree; the
  blank tag must follow the tag's**, which puts search (= name) first and
  City last — City demoted to a pre-filled entry is J14 anyway.
- Shapes never take city from the form (`resolveShapeCity()`), so on a
  District/Street tag the CITY entry is printed "auto" or absent.
- `selectAddress()` already gives name, address, lat/lng and
  addressDetails; that is everything the blank tag's top half needs.
- C's last flow (R6-C6): tap pin → the list's band becomes a search
  line → pick → the pin stands on the spot and the blank tag hangs from it
  → ADD LOCATION on the stub. Its gap against the new ask: **for the whole
  search step there is no tag** — you fill out a search bar, then a tag.
  "Filling out a blank tag" starts one step too late.

### Random draws (real RNG)

Fields: **bird-ringing** (you catch the bird, ring it where it is, write
the log) and **ski lift ticket** (a blank card clipped to you, validated
by a punch). Oblique: **"Look at the order in which you do things."**
Twist: **"nothing is typed."**

### Structures — four that differ in kind

**P1. Hang-then-write (C's flow, the tag moved earlier).** Tap the
blank pin; the blank tag it carries comes off it and grows to full size,
docked just above the keyboard / list band. Its name line is the search
field, autofocused, with results dropping as pencilled lines *on the tag*
under the name (results grow downward inside the tag, not over the map).
Pick → the map flies there, the blank pin stands on the spot and the tag
re-hangs from it on its string, rest of the fields now in reach. One
object the whole way: blank pin + blank tag at rest → blank tag in hand →
tag hanging on the place → real tag. Cost: the docked tag + keyboard at
664 leaves room for ~2-3 result lines (C's band gave 4); measure. Search
and tag share one surface, so "re-search" = tap the name line.

**P2. Ring it where it stands (order flipped: place before name;
"nothing is typed").** The blank pin is *placed*, not pressed: drag it
off its stand onto the map (or long-press the map), release, and the tag
hangs there with the name line offering **what's here** — the nearest
named places from a reverse lookup, as pencilled choices — plus "write a
name" as the fallback. Tap (no drag) falls back to P1. This is the
bird-ringer's order: the thing is located first, identified second. It
serves the on-the-trip moment ("this café, here") with zero typing;
search stays for planning from home. Costs: touch plumbing on the map
(gesture lane, full gate); drag needs a discoverable affordance (the tap
must still work alone); reverse lookup is Nominatim, untestable in the
sandbox; J17 (visited) pairs naturally with it.

**P3. No Add button: the pick IS the add (inversion).** Picking a result
creates the place at once, with type pre-filled from OSM's class where it
maps, city auto. What opens is the place's **real tag with its entries
still pencilled** (editable) and an Undo slip (Plans v3 already has one).
Stamp the entries — or just close the tag — and it's done. The form
disappears as a concept: there is only the tag, in pencil or in ink.
This is the one that gives J18 (edit later) as the same mechanism. Costs:
an accidental pick creates a row (Undo must be obvious and the
two-person shared DB means Erica can see it for those seconds); the
shape-city / new-city confirms interrupt *after* creation; shapes need
their OSM fetch before anything can be created, so District/Street keep
an explicit commit. Owner-scope question for sure; worth showing as a
frame because it differs in kind.

**P4. Lift ticket: the blank tag lives on the + and is written in two
sittings.** The blank tag rests on the + (as C's 6b), and a half-filled
draft *stays on it* — name pencilled on the little tag — when you cancel
or get interrupted. The resting + then shows "you've a tag in progress"
by its own content, not a badge or dot. Tap → resume. Already ruled for
C: cancel keeps the draft; this just makes the kept draft visible.
Small, and it's an add-on to P1/P2, not a direction of its own; it fails
"no dots/noise" only if the pencilled name reads as decoration — visual's
call.

### The blank tag itself (shared by every structure)

- **Order = the real tag's order.** Eyelet · NAME (write-in, = search) ·
  address (filled by the pick, printed small) · TYPE (pencilled entry;
  pre-filled when OSM's class maps, else the last-used or "Other";
  tapping opens a choice) · CITY (pre-filled, quiet, tap to correct;
  absent for shapes) · Notes (write-in line) · stub.
- **Stub = the real stub's segments, blank.** STAR (prints the band, as
  on the real tag) · ADD. Optional third segment VISITED (J17) — then the
  blank tag's stub matches the real stub one-for-one and every borrowed
  mark keeps its meaning. Scope question for the owner.
- **Pencil → ink is the state system.** Printed captions; your entries
  pencilled until Add; on Add the entries are stamped (the owner's
  "clerk's entries are stamped") — that stamp IS the confirmation (J15),
  and it's an existing motion family ("stamp with some grow shrink").
- **States to design:** blank (nothing picked — only NAME is live; the
  rest printed but unwritable, ADD inactive and saying why, e.g. "NAME IT
  FIRST"); searching (results on the tag / no results / search failed);
  picked; District/Street (address line becomes the hint; CITY absent;
  ADD reads "TRACE IT"?); confirms (new city, which city) rendered as a
  printed question on the tag with two stub-style answers; saving; failed
  (tag stays, error in pencil-red? — no new colour: ink-2 note);
  approximate fallback (the inked tag says "(approx.)" as today);
  signed-out playground (adds as signed in); stale session (sign-in
  sheet, nothing moves); 320 (tag scrolls inside, stub fixed); desktop
  (tag hangs in the map column).
- **Size discipline:** the real tag at 390 is ~232 tall; with fields C
  measured 364 (404 for shapes). Every field earns its line — CITY folding
  into the address line ("Hallgrímstorg 1 · Reykjavík ⌄") would save one.

### Does the blank-tag form pair with the other directions? Yes — it is
### trigger-agnostic. Build it as one surface with an entry point.

- **With C (blank pin):** the strongest metaphor: the pin and what it
  opens are one idea (the owner's own "bonus points"). Weakness stays the
  map-edge home: steps aside under a tag, close filters to add (ruled).
- **With A (tag cut in the list header):** arguably *as* strong: A is
  already a tag. Tap the header tag and it pulls up into the full blank
  tag (P1 docking) — and A keeps its no-exception job 1 (works with a tag
  open and filters open), which C can't. On pick, the tag flies to hang
  from the new point. This may be the best pairing; it deserves a frame.
- **With Float (orange badge, bottom-left):** works, metaphor looser — a
  stamp-shaped badge opening a tag. A reading that holds: the badge is
  the clerk's stamp; the tag is what it stamps. The tag would rise from
  the left corner (thumb side), which suits the form's thumb reach.
- So the owner could be shown: **one blank-tag form, three triggers**,
  instead of three unrelated packages. That keeps all directions open
  and makes the comparison fair (the form isn't a C-only bonus).

### Tensions to rule (director)

1. P1 (results on the tag) vs C's band search (results over the map):
   result count with the keyboard up vs. one surface throughout.
2. Is P2 (drag/long-press, gesture lane) in this package or a later
   accelerator? (It was parked in turn 1 as an owner question.)
3. Is P3 (no Add button) shown as a concept frame, or held as an owner
   question? It changes the DB story (Undo on a shared table).
4. Visited segment on the blank stub (J17) and edit-after-add (J18): show
   as options or ask after a concept is approved ("not going to give them
   until i approve a concept")? I'd show them *in* a still and ask
   alongside.
5. Whether C's resting tag still needs to exist once the form is a tag
   (it now means something) vs. the owner's "doesn't read like a plus
   button" — the + must stay the loudest mark on the resting object.

NEXT: product designer (visual focus) — how the blank tag looks as a form
(pencil vs print vs stamp, the blank stub, the inactive ADD) and how the
resting blank pin + tag answers both owner objections; and whether the
same form reads right under A and Float triggers.

## Turn 31 -- product designer (visual focus): the blank tag as a form, the resting object, the three triggers

New visual designer (previous notes read as history). Real draws this
turn: Oblique **"Honor thy error as a hidden intention"**; field
**library card catalogue** (the book pocket with a blank card standing in
it). Grounded in the real tag (`buildPopupHtml()`: band, eyelet, name,
stamped TYPE, stub = DIRECTIONS | STAR | VISITED, 1.5px dashed `--hair`
perforation with side notches) and C's R6 stills.

### 1. The blank tag as a form: three inks, one meaning each

The owner already gave us the system; I just apply it to an empty tag.
"Only the clerk's entries are stamped; the form's own words are printed."

- **Print (navy `--ink`, the app's small caps) = the form's own words.**
  Captions NAME · TYPE · NOTES, the stub labels, the write-on rules.
  Rules are a single hairline at the `--hair` weight (no boxes, no field
  outlines: "no heavy rules or boxes"). No placeholder text in the lines;
  the caption is the prompt.
- **Pencil (graphite = the Pencil Star's `--ink-2`, the app's own faces)
  = your entries before you commit.** The name goes on its line in the
  tag's display face, at the real tag's size, but in graphite with the
  pencil's tooth. TYPE pencils in when picked (or pre-fills in pencil from
  OSM). Pencil says "provisional, still yours to change" without one extra
  mark. No handwriting font ("no typewriter face"; same rule).
- **Stamp/ink = Add.** On ADD the pencil inks over: TYPE is rubber-stamped
  exactly as the real tag stamps it (seeded angle/texture, "ink is never
  identical twice"), the name goes graphite → navy with the visited
  stamp's ink-bleed family. That ink-over IS the confirmation (J15); no
  toast, no check. The tag you're holding *becomes* the real tag in place.
- **The blank tag is full size and the real tag's proportions,** not a
  shrunk sheet: an empty name line at display height so the blank looks
  like the tag it will be (J12). Paper always cream ("the tag's paper
  never changes"); no band until STAR is tapped.

### 2. The blank stub: one-for-one with the real stub

Real stub: DIRECTIONS | STAR | VISITED. Blank stub: **ADD | STAR |
VISITED** -- ADD sits in Directions' slot, because Directions is the one
thing a place that doesn't exist yet can't do. On ADD that segment
re-prints as DIRECTIONS (a quick print swap under the ink-over). Every
borrowed mark keeps its meaning: STAR on the blank stub prints the band
exactly as on the real tag; VISITED (J17) stamps exactly as on the real
tag. Nothing on the stub is new.

- **Inactive ADD: printed, not greyed-out-button.** The word ADD in
  `--ink-2` with a second printed line under it, caption size: NAME IT
  FIRST (wraps centred, the stub's wrap rule). No disabled-grey slab, no
  empty dotted ring ("don't show empty states as marks"; the dotted ring
  is visited's).
- **Active ADD: a navy ink flood in its segment, cream ADD.** Not orange:
  on a tag, orange already means *starred* (the band, the Star segment's
  colour focus). Navy is the other action colour the owner named ("navy or
  orange"). **Open, director:** CLAUDE.md lists "submit" as brand orange;
  on a tag I think navy wins on meaning. Flag it, don't assume.
- **Unvisited VISITED segment** shows what the real unvisited segment
  shows, nothing more.

### 3. The resting object vs the owner's two objections

"Honor thy error": take both objections as true, not as misreads to argue
with. Looking at R6-C1 again, the *pin* half is now the app's own pin
grammar and does sit right among the 17 real pins. What fails is the tag:
at 84x66 it's a cream rectangle with a hat -- the chamfers are 13px, the
stub, perforation and side notches are gone, so it reads as a price tag or
a box, and then the whole object reads as neither tag nor button. And the
+ sits on the pin, the tag carries nothing, so the eye doesn't link "tap
the tag" with "+".

Three answers that differ in kind (I'd take the first two forward):

**V1. Tag-first silhouette, + on the tag's name line.** Keep the small
real pin at the top (32px, orange face, empty -- no glyph, since the
place has no type yet: a *blank* pin is literally blank). The string drops
to a tag drawn with every luggage-tag signature exaggerated for its size:
deep chamfers (~22% of width), eyelet patch + grommet on the string's
axis, the stub's perforation and the two half-round side notches. The +
is printed big in navy on the NAME line, where you'll write. Read: "a blank
tag; write on it." The + is the loudest mark because it's the biggest ink
on the brightest object; the orange pin is the colour accent above it.
Cost: the tag must be big enough for notches to survive at 1x (my guess
~96 wide; systems to measure against the corner footprint and squint
rank vs the account badge).

**V2. Pin-first, no tag at rest.** The blank pin alone, at selected-pin
size, orange face, navy + where the category glyph will go. The tag
doesn't exist until you tap: it pops down out of the pin on its straight
string (the owner's own tag motion), blank. Answers "doesn't read like a
+" by removing the thing that confused it; answers "pin doesn't look like
a pin" by being exactly the map's pin. Loses J7's preview at rest -- but
the *motion* previews it the first time and every time. Simplest of the
three ("simple simple simple"). Risk: a 32px orange disc is close to a
deep-orange cluster at city zoom; needs the paper halo the starred pins
already use, and rank vs the 50px account badge was "about level" in R6.

**V3 (new, from the draw). The pocket: the list is the card catalogue.**
The blank tag stands *tucked behind the list sheet* like a card in a
library-book pocket: only its top third shows above the list header --
chamfered top, eyelet, string -- with the + printed on the showing paper,
at the left (thumb side). The pin stands on the map just above it, string
taut to the eyelet. Tap (or pull up) and the tag slides out of the pocket
into the full blank form, docked above the keyboard. Why it's different in
kind: the tag's most recognisable part (the die-cut top + eyelet) is the
only part shown, at full scale, so it can't read as a box; and it rides
the list, so it keeps A's one big advantage (works with a tag or filters
open, J1) without being a header cut. Costs: it overlaps the map's
bottom edge (J5: never on a pin or tag -- systems to check); it's one more
object at the list's edge; the sign-in badge stays top-right so rank vs
account should be easy. It is A and C merged; the director may rule it
replaces one of them rather than adds a fourth.

Dropped fast: a **pad of stacked blank tags** ("take one", deli
dispenser) -- reads "new" without a +, but the offset edges are two extra
lines of noise and it severs the pin; and a **dashed "placeholder" ring
pin** -- dashed/dotted rings are visited's stamp track, so it borrows a
mark and changes its meaning.

Lean on the "is it a pin" question: keep the app's round pin. A teardrop
would read as "map pin" faster, but it's a mark the app never draws, and
it was killed in round 6 as a water drop. If the owner still says "not a
pin" at V1/V2 quality, that is an owner question to put beside the
concept, not one to guess.

### 4. Does the same form read right behind A and Float?

The form is trigger-agnostic, agreed with systems. Visually:

- **C (V1/V2) and V3: strongest.** The trigger is the form folded/at
  rest; open and add are one object changing ink. Owner's "bonus points"
  in full.
- **Float: works, plainly.** The badge isn't a tag, so there's no metaphor
  to break and none to gain. Reading I'd use: the badge is a control, the
  tag is the paper it hands you -- the blank tag rises from the badge's
  corner on the left (thumb side), docked low. I'd NOT make the badge "the
  stamp that inks it": a stamp on a tag means visited.
- **A: needs one change once the form is a tag.** A's trigger is an
  *orange* tag cut. With a cream blank tag opening from it, the orange tag
  now sits one step from the real tag's band and reads as "starred tag".
  It was tolerable when the form was a sheet; beside a real-looking tag it
  borrows a mark and changes its meaning. Option: A's cut goes navy (the
  selected-row navy the header already sits beside) with a cream +, and
  the orange stays with the star. Director's call; I'd show A navy in the
  package frame.

### 5. Motion (sketch level)

- Open: the blank tag pops down out of the pin (C), slides out of the
  pocket (V3), or rises from the badge (Float) -- the existing tag pop
  timing, no new curve.
- Pick a result: the place name pencils onto the NAME line left to right
  (fast, the Pencil Star's stroke speed, once), the map flies, the tag
  re-hangs from the pin at the spot.
- ADD: stamp grow-shrink on TYPE, name inks over, ADD segment re-prints
  DIRECTIONS, the pin's face fills with the category glyph. All triggered
  by state change; nothing touches row gestures.
- Cancel: the tag goes back the way it came; a kept draft shows as the
  pencilled name on the resting tag (systems' P4) -- V1 and V3 can show it
  (graphite on the name line replaces the +? no: the + must stay; draft
  name sits under it small. Open), V2 can't.

### Open questions (plainly)

1. ADD's flood: navy (my lean, orange = starred on a tag) vs brand-orange
   submit.
2. V1's tag size at rest: can notches + perforation survive inside the
   corner footprint and still win the squint against the account badge?
   (systems measure)
3. V3's pocket vs J5 (map's bottom edge pins) and vs A -- replace or add?
4. P1's results on the tag: I'd print results (the app's search offers,
   not your entries) on a slip *below* the name line, in print not pencil;
   only the picked one becomes pencil. 2-3 lines at 664 with the keyboard
   is tight -- systems' numbers decide whether the slip may overhang the
   tag's bottom edge.
5. P3 (no ADD, pencil-then-ink as edit): visually it's the same three
   inks, so it costs me nothing; its risk is data, not look.

NEXT: design director -- rule on the three resting objects (V1 tag-first,
V2 pin-only, V3 pocket), ADD's colour on a tag, and A's trigger going navy
inside this package, so systems can measure the survivors.

## Turn 32 -- design director (new director): rulings for the package, one direction added

New director; my predecessor's notes read as history. Looked at R6-C1,
R6-C6 and R7-A5 again before ruling. Real draws: field **baggage
handling** (the check-in counter); Oblique **"What would your closest
friend do?"**

### The idea I'm holding everyone to

The owner asked for a *package*, so the test is one physical story told
without a break: **a blank pin carries a blank tag; you write on the tag;
the ink dries; the pin is now a place.** One object from rest to the real
tag. Two rules come out of it, and both bind every frame:

1. **The pin is always above the tag, on a straight string, at every
   step** (the owner's own "pop down out of the pin ... straight string").
   Docked above the keyboard, searching, picked, saving: if a frame shows
   the tag without its pin on top, or a pin without a string to the tag,
   the story broke there.
2. **Orange outside the paper = act; orange on the paper = starred.** The
   + trigger (pin, Float, A's cut) is orange, like account. On any tag,
   orange is the band and the Star segment only. This is the line that
   settles ADD and A below.

Closest-friend test (the draw): a friend hands you a tag and a pen and
says "write the name, I'll do the rest". So **the minimum add is: tap,
type, pick, ADD.** Everything else on the blank tag arrives pre-filled in
pencil (city, type where OSM maps, address); you touch a line only to
correct it. If a frame makes the user fill a second line to finish, that
frame is wrong.

Baggage-handling direction (for visual, not a new concept): at the bag
drop the agent tears a tag off a roll, writes nothing you didn't say,
loops it on, and the bag leaves on the belt. Borrow the *exit*, not the
props: on ADD the pencil inks, the pin's face fills with its category
glyph, the tag closes into the real place's tag on the spot -- and **a
fresh blank pin is already standing on its stand** (not animated in; just
there when you look back). Add is repeatable without a "done" screen. No
belts, rolls or airport codes on screen.

### Resting object: V2 and V3 go forward; V1 is dropped

- **V1 (small tag-first silhouette): drop.** It asks a ~96px tag to
  carry chamfers, eyelet, perforation and notches -- the exact shrink that
  made the owner say "the tag doesn't read as a tag" twice. Keep the lesson,
  not the frame.
- **V2 (the blank pin alone): forward, with a kill condition.** It's the
  owner's words taken literally ("the blank pin version of the add
  button") and the simplest. Its risk is the one he already named: an
  orange disc with a + is the Material FAB, his "knee jerk to the
  standard". It survives only if it reads as *a pin standing on the map*,
  not a button floating over it: map-pin grammar (paper halo, the
  real pins' ground contact), and the + exactly where the category glyph
  goes. Visual: put it beside a stock FAB at 1x; if they squint the same,
  V2 is dead. It also has to beat the account badge in the squint
  (round 5b: "same weight and hierarchy as account, which it shouldn't
  be") -- so not 32px; systems find the size that wins.
- **V3 (the pocket): forward, as C's other resting state, not a fourth
  concept.** It solves V1's problem the right way: crop, don't shrink --
  the tag's most recognisable part (die-cut top, eyelet, string to the
  pin) at full scale. It is the only resting object that previews the
  form (J7) without a miniature. Gate: J5 (never covers a pin or a tag
  near the map's bottom edge) and the credit.
- **Rest position: bottom-left** for both. The owner's last placement
  note ("maybe the plus should be on the left? Easier for me to reach")
  carries to whatever the + is.
- I'll pick V2 or V3 for the package in jobs.md, from systems' numbers and
  visual's 1x frames. One resting object goes to the owner, not two
  ("fewer variations").
- **P4 (draft name shown on the resting object): not at rest.** A kept
  draft shows when you open the tag again. At rest the + stays the only
  ink.

### ADD's colour on the tag: navy

Navy flood, cream ADD, in the stub's first segment (Directions' slot), as
visual proposed. Reason is rule 2 above: on a tag, orange already means
starred, and the owner named navy as the other action colour ("either
navy or orange"). The inactive ADD is print-only with a wrapped NAME IT
FIRST -- accepted, the stub's wrap rule covers it. This changes
CLAUDE.md's "submit = brand orange" for the tag only, so it goes to the
owner as a one-line "just so you know" with the concepts, not as a
decision we hide.

### A in this package: stays orange

No navy. A's orange cut is the + trigger -- chrome, not paper -- so rule
2 keeps it orange, like account. Navy would also merge with the navy
selected row directly under it (R7-A5). A is with the owner as scored;
we don't edit it under him. What we owe him is one frame: **the same
blank-tag form opened from A, and one from Float** -- "same form, other
trigger" -- so the form isn't a C-only bonus. Not two more packages.

### Systems' five questions

1. **P1 (results on the tag) over C's band search: yes.** "Filling out a
   blank tag" starts at the first keystroke. Results print on a slip below
   the name line (visual's Q4), print not pencil; only the picked one
   becomes pencil. Systems: at 664 with the keyboard up, how many result
   lines fit, and may the slip overhang the tag's foot? Floor: 3 results.
   Below 3, come back to me before falling back to the band.
2. **P2 (drag the pin / long-press the map): out of this package.** It's
   the gesture lane, Nominatim-only, untestable here, and the owner
   question about it is already queued. One line in the owner questions.
3. **P3 (the pick is the add, no ADD): not a concept frame.** Shared-table
   Undo and the post-create city confirms make it a data decision, not a
   look. It goes to the owner as a question. The closest-friend minimum
   (tap, type, pick, ADD) gets most of its speed anyway.
4. **J17 VISITED on the blank stub: in the stills.** The stub one-for-one
   with the real stub (ADD | STAR | VISITED) keeps every mark's meaning
   and costs nothing new. **J18 edit-after-add: one still, labelled as an
   option.** Both get asked alongside the concepts.
5. **The resting tag still exists only as V3.** V2 has no tag at rest by
   design. See above.

### Visual's open questions

1. Navy -- ruled. 2. V1 -- dropped. 3. V3 is C's other resting state; J5
   and the credit are systems' to check. 4. Print slip -- yes, measure.
5. P3 -- an owner question.

### Pushes for the next pass

- **Visual:** the full journey as one strip (rest, tap, typing, results
  slip, picked + flown, ink-over, back at rest with a fresh blank) at
  1x-honest size, so I can check rule 1 frame by frame. V2 beside a stock
  FAB and the account badge at 1x. V3 at 664 and 844, collapsed and with a
  tag open. Same blank tag, District/Street state (CITY gone, ADD wording).
- **Systems:** V2's diameter to win the squint vs the 50px account; V3's
  footprint vs J5, the credit and the 320 width; the slip's line count;
  where the docked tag + pin sit with the keyboard at 664, so the pin
  still clears the safe area above the tag.

### Owner questions, for the orchestrator to send WITH the concepts (not now)

1. While adding, mark it visited too (VISITED on the blank tag's stub)?
2. Fix a place after adding by opening its tag in pencil again?
3. Skip ADD: picking a result saves the place, with Undo?
4. Later, place a pin by dragging it onto the map or holding the map?
5. Just so you know: on the tag, ADD is navy, because orange on a tag
   means starred.
(Q2 from earlier, "land on the new place after Add", is answered by the
package itself: it ends on the real tag.)

NEXT: product designer (systems focus) -- measure the two survivors
(V2's size against the account, V3's footprint against pins/credit/320),
the result slip's line count at 664, and where the docked pin + tag sit
with the keyboard up, so visual can draw the journey to real numbers.

## Turn 33 -- product designer (systems focus): the survivors measured, the docked journey in numbers

Measured on a copy of **today's main** with the **real 202 pin positions**
(read from Supabase via the MCP, names dropped) instead of the stub's
grid, so "never covers a pin" is tested against the owner's actual trip.
Everything is in `concepts/pass-a-check/`:
- `probe.js`: every marker box per city × viewport × list up/collapsed,
  credit boxes with and without "Leaflet |", V2 squint frames, and
  result-row heights;
- `footprints.py`: the V2 and V3 footprints against the pins and the
  credit;
- `squint.py`: blurred colour-mass, V2 against the account badge;
- `geo.js`: the real tag's geometry with a tag open;
- json outputs, `frames/v2-*.png` and `frames/v2-sizes-crop.png`.

Placements assumed (from turns 31-32): bottom-left, ink 19.9 from the
side (the Float's line), foot 20 above the list.

### 1. V2 (the blank pin alone): the size that beats the account

Squint mass = the colour difference the object adds once blurred (σ 4
and 8 px), against the 50px navy account badge measured the same way.

| V2 disc (+2px paper halo) | 32 (R6) | 40 | 44 | 48 | **52** | 56 | 60 |
|---|---|---|---|---|---|---|---|
| mass vs account (σ4 / σ8) | 0.60 / 0.58 | 0.94 / 0.92 | 1.13 / 1.11 | 1.35 / 1.33 | **1.59 / 1.56** | 1.84 / 1.81 | 2.12 / 2.09 |

- **Parity is at about 42px.** R6's 32px pin was 0.6x the account,
  which is exactly why the owner read it as "same weight … as account" or
  below. **To clearly outrank, it needs at least 48 (1.35x); I'd call 52
  (1.6x) the floor for "the main action".**
- Peak contrast never beats the account (orange on cream 72-75 dE vs
  navy's 77), so V2 can win on mass only, never on darkness. Orange vs
  navy can't be fixed by size.
- **The catch for visual and the director:** every size that wins the
  squint (≥ 44) is 1.4-1.9x the selected pin (32) and 2-2.3x the normal
  pin (24). The kill test is "a pin, not a FAB", and at 52 the disc
  alone is a FAB (look at `frames/v2-sizes-crop.png`). **Size can't
  satisfy both conditions; only shape can.** Something in the pin grammar
  (a foot or point, ground contact) has to carry "pin" at a size no other
  pin has.
- Footprint at 52, real pins: **0 under and 0 within 6px**, in all 5
  cities, at 844, 664, 375x667 and 320x568, list up and collapsed. The
  credit is clear in every case, prefix kept (it's right-aligned and
  starts at x 139 / 124 / 69). At street zoom any corner object can sit
  on a place; panning frees it, as before.
- **With a tag open:** at 664, 375 and 320 the tag lowers the list so
  its foot is 52 above the list. V2-52's top sits 72 above the list, so
  the two overlap (the tag spans x 37-353, V2 x 18-74). The options are
  the same as C's and the Float's: step aside under a tag (C's ruling),
  or `TAG_SHEET_GAP` 84 (20 + 52 + 12), which costs one row at 664 and
  320. At 844 the gap is 198, so V2 clears.
- **Filters open:** V2 sits under the panel, so the rule is "close
  filters to add" (C's ruling).

### 2. V3 (the pocket): footprint vs pins, credit and 320

Variants: the visible tag crop is W wide × h tall at the left gutter, and
the pin sits over the crop's centre at the real `TAG_HANG` (pin top 60
above the tag top).

| Variant | Pins under (+within 6px), list up | Credit hit (prefix / no prefix) |
|---|---|---|
| W 120, h 44 | 0 everywhere; 320 Stockholm +2 near | 844 / 664: clear by **2.9px**; 375: **hit** / clear; 320: **hit / hit** |
| W 120, h 64 | 0; 320 Stockholm +3 near | same |
| W 160, h 44 | 320: Malmö 1 (+2), Stockholm **4** | hit at every width with the prefix; 320 hits without it |
| W full (316), h 44 | 664: Malmö 2, Stockholm 2; 320: up to 6 | **hit everywhere**, both ways |
| W full, h 64 | 664: Malmö 4; 320: Copenhagen **5 (+12)** | hit everywhere |

- **Full width is out:** it covers real pins at 664 and is always on the
  credit. "Crop, don't shrink" only works if the crop is narrow, so **W ≤
  120**: a pocket corner, not a pocket band. At 120 the chamfer, eyelet
  and string survive (visual to confirm).
- **The credit has to move for V3 at any width.** At 120 it's 2.9px from
  the tag at 390 (touching to the eye), it hits at 375 with the prefix,
  and at 320 it hits even without the prefix (credit x 134 against the
  tag's 136). Simplest: the credit goes up to sit on the pin's level at
  the right (it's right-aligned anyway). That is a placement decision, so
  it's the director's call.
- **V3 does not keep A's no-exception job 1, as visual hoped.** It rides
  the list's top edge, the same as C:
  - With a tag open at 664, 375 and 320 the tag's foot is 52 above the
    list. V3-120-44's crop clears it by 8px, but **its pin and string
    (60px above the crop) land on the tag's stub**, so it would need to
    step aside or need a gap of 116.
  - With filters open, the panel covers the list's top edge where the
    pocket lives, so "close filters to add" applies.
  - Both survivors carry C's two ruled exceptions; Float has the filters
    exception (gap 88) and only A is exception-free. **Say it plainly to
    the owner.**
- Collapsed: both clear (0 pins, safe area fine).

### 3. The docked journey at 664 with the keyboard up (the numbers to draw to)

Measured from the real tag:
- pin 32;
- pin top → tag top 60 (`TAG_HANG` 44 + 16);
- tag top → name top 48 (`.tag-in` padding);
- name 28;
- stub 60;
- tag 316 wide, x 37-353 at 390.

Today's result rows (`.autocomplete-item`, 12/16, padding 12) at the
tag's 284px content width are **56-57px each** (real Nominatim names wrap
to 2 lines). Search returns up to 10 (`limit: 10`), so the slip scrolls.

Keyboard: C's drawn 336pt, so 328px of the page is visible at 664.

- The binding limit at the top is **the account badge, not the pin**.
  The tag spans x 37-353 and the badge x 266-316 (or 324-374 if + leaves
  the corner). So **the tag's top can't go above y 74** (badge foot 66 +
  8). That puts the pin at **y 14-46** on the tag's axis (x 179-211):
  clear of zoom (x 10-44) and the account badge, with 14px of screen
  above it. Rule 1 holds at no cost.
- The stack is then:
  - tag top 74;
  - name 122-150;
  - the slip from y 158 to the keyboard (320, with 8 clear).
  - **That's 162px for results.**

| Rows in the slip at 664 | 56px rows (today) | 52px rows (padding 10) | 44px rows (one line) |
|---|---|---|---|
| Stub hidden under the keyboard | **2 (2.9)**: below the floor | **3** (6 spare) | **3** (+0.7) |
| Same, name pad 48 → 36 (no band on a blank tag) | **3** (174px, 6 spare) | 3 | 3-4 |
| Stub showing above the keyboard | 1 | 1 | 2 |

- **Floor 3 is met only if the stub drops behind the keyboard while you
  type.** This is my answer to "may the slip overhang the tag's foot?":
  the tag doesn't end at the keyboard; it runs on behind it, and its foot
  (with the inactive ADD) is simply below the fold. When you pick, the
  keyboard drops, the tag re-hangs on the place and the stub is there. It
  also matches C's ruling of no inactive Add in view while typing.
- **It also needs one of two things:**
  - (a) rows at 52px or less (padding 10, or one-line rows with the name
    in the tag's weight and the address truncated: visual's call);
  - (b) the blank tag's name starting 36 below the tag's top instead of
    48. The 48 exists to clear the 36px starred band, and a blank tag has
    no band until STAR is tapped (STAR only matters after the pick, when
    the keyboard is down).
  - With neither, today's rows give 2.9, and I'd come back to the
    director rather than drop to the band.
- **320x568:** the keyboard is about 260, so 308px are visible. The tag
  is x 16-304, so the account's foot still binds and the tag's top is 74.
  The slip runs y 158-300 = 142px: **2 rows at 56, 3 at 44-47.** **The
  floor of 3 needs (a) at 320 even with (b).**
- **844, Home Screen (47 inset):** the tag's top is 121 (badge foot 113 +
  8). The slip runs 205-500 = 295px, which is 5 rows. No issue.
- **After the pick (keyboard down, 664):** C's numbers hold. The list
  drops to its band and the blank tag (about 364 tall, 404 for a shape)
  hangs from the pin with **ADD at y 515-559**. The pin sits 60 above the
  tag's top, on the place. The tag is the real tag's width, so it covers
  the same map area as a real tag.

### 4. Still unsettled in jobs and flows (before I write jobs.md)

1. **The fresh blank pin after Add (director's baggage exit) contradicts
   the step-aside rule.** After Add the new place's tag is open, and
   under a tag V2 and V3 are hidden (at 664 and below). So the fresh
   blank can't "already be standing" while you look at the new tag; it
   appears when the tag closes. Unless the director wants `TAG_SHEET_GAP`
   84 (V2) or 116 (V3) on phones, which costs one row with a tag open. The
   director has to pick one.
2. **Job 1 has exceptions for both survivors** (tag open, filters open):
   one extra tap each. A is the only exception-free trigger. This belongs
   in the owner's cost line, not in small print.
3. **What a district or street inks into.** "The pin is now a place"
   breaks for shapes: the owner ruled that shapes have no map pin, just
   the outline, with the tag hanging from the anchor dot. Proposed flow:
   - the blank pin stands on the picked point while you fill the tag;
   - on ADD (TRACE IT?) the pin dissolves into the outline;
   - the tag re-hangs from the anchor dot.
   - If OSM has no shape, it inks as the "(approx.)" pin, as today.
   - Visual and the director should confirm.
4. **Pre-filled TYPE is a new behaviour and needs a source.** Search
   today returns no category mapping, and the select's default is
   Restaurant (its first option), so a "pre-filled in pencil" TYPE would
   be wrong most of the time. Options:
   - map OSM class/type (needs the search to ask for it; the builder's
     cost is small, but it can't be tested here: Nominatim is blocked);
   - default to the last-used type;
   - leave TYPE blank and required. That breaks the closest-friend rule
     "tap, type, pick, ADD".
   - The director has to choose.
5. **CITY on the blank tag.** It's auto (`maybeDetectCity`), with the
   new-city confirm when outside every city. I propose: CITY isn't a
   line; it folds into the address line ("Hallgrímstorg 1 · Reykjavík"),
   tap to correct, absent for shapes. That saves a line on the 364px tag.
   Needs confirming.
6. **Tap count.** The minimum is tap, (type), pick, ADD. The keyboard
   rising from the tap needs `focus()` inside the gesture after
   `requireAuth()`, which is still the iPhone check from C. If iOS
   refuses, it's one more tap on the name line.
7. **VISITED on the blank stub** means the insert carries `visited: true`.
   It's trivial in data, but the ink-over then runs two stamps at once
   (TYPE and VISITED): the order of the motion is visual's.
8. **Desktop (wide):** not measured this pass. The docked tag has no
   keyboard there; the tag can hang from the pin in the map column at
   once. That goes in jobs.md as a flow, and I'll measure it when the
   concept is built.
9. **Cancel with a picked place.** The draft is kept, there's no marker,
   and the view is restored (C's ruling). When you tap again, the tag
   re-hangs on the kept place with the keyboard down. That's the "draft
   shows when you open it" ruling, made concrete.

Not changed: jobs 1-6 in `jobs.md`, job 6 (playground adds as signed in,
a stale session asks) and the city switch after Add (C, J15).

NEXT: product designer (visual focus) — two things need a shape that
only visual can supply. V2 has to read as a pin, not a FAB, at 52px (the
smallest size that clearly beats the account in the squint). V3 has to
work as a 120-wide corner crop. Both get drawn into the docked journey at
the numbers above: the tag's top at 74, 162px of slip, rows of 52 or
less or the name 36 below the tag's top, and the stub behind the
keyboard. Then the director rules on items 1, 3, 4 and 5.

## Turn 34 -- product designer (visual focus): V2 made a pin, V3 cropped, the typing state drawn to the numbers

Sketches, labelled SKETCH, in `concepts/sketches/pass-a/` (`sketch.html`,
`typing.html`, `render.js`):
- `sketch-s1-3x.png`: V2, six shapes at the same squint mass, beside the
  account seal and real 24px pins;
- `sketch-s2-3x.png`: V3, two 120px crops;
- `typing-664-3x.png`: the typing state at systems' numbers.

They're for judging the idea, not owner stills.

### 1. V2 at 52: size can't say "pin", shape can. My pick: the lifted pin

Systems are right: at 52 a disc is a FAB, and cell 5 (R6's grammar, scaled
up) shows it. I drew five shapes against the stock FAB (cell 0):

- **1 Lifted, not yet placed: FORWARD.**
  - A 44px orange disc with a 2px paper halo (48 overall), deep-orange
    rim and navy +. It's the app's own round pin, raised.
  - Under it, a straight 1.6px navy string drops about 22px to a point on
    the map, with a small soft ground shadow (restrained: one ellipse,
    ~18% opacity).
  - It reads as a pin held above the map, about to go in. Every map app
    uses "lifted with a shadow" to mean "a pin you're placing", so the
    shape carries the meaning, not the size.
  - It's also rule 1 at rest. The string is already there, and the tag
    comes down it when you tap. The owner's "pop down out of the pin ...
    straight string" is the trigger's own anatomy.
  - It changes no shipped mark. The landed pin is the app's pin; only the
    lift is new.
- **3 Teardrop: dropped.** It's the strongest "pin" read, but it's the
  stock drop-a-pin icon, the owner's "knee jerk to the standard" in pin
  form. It's also a shape the app never draws, and the new place would
  become a different shape the moment it's added.
- **2 Push-pin: dropped.** It reads "pin" and has whimsy, but the angled
  needle is the only diagonal on a map of uprights, and its tip isn't
  where you'd trust the place to go.
- **4 Pin + empty string with a ring: dropped.** The ring at the bottom
  reads as a balloon or lollipop, and a ring is a dot (noise rule).
- **5 Big app disc: dropped.** It's the FAB.

**Kill test (the director's):** in the sketch, 1 does not squint like 0.
The vertical string and the ground point break the disc's "floating
button" silhouette. That needs confirming at real 1x in the app.
**Systems:** re-run `squint.py` on this shape (48 halo'd disc + string +
shadow, about 72 tall). I expect about 1.35x the account (the 48 row). If
it comes in under 1.3, grow the disc to 48 (52 halo'd) and keep the
string, not the reverse.

### 2. V3 at 120: "narrow, not small" draws; my vote is to drop it anyway

- **A, an eyelet-centred crop of the 316 tag: dropped.** With no
  chamfers it's a cream box with a patch. That's the failure the owner
  named.
- **B, narrow, not small: drawable.** It's a 120-wide tag top with 22px
  chamfers, but the eyelet patch (48x28), grommet, string and pin are full
  scale. Only the width changes, and tags do come in widths. It reads as a
  tag top.
- **Why I'd still drop V3:**
  - It needs the credit moved.
  - It's two objects (the paper and a 32px pin) at the list edge.
  - Its rank comes from the cream paper, not the +.
  - It has the same exceptions as V2 (tag open, filters open).
  - Lifted V2 already says "a tag comes down this string" with one
    object.
- If the director keeps V3, B is how it's drawn: pin 32 above, string 28
  to the grommet, 26px of paper showing above the list header.

### 3. The typing state at 664 (`typing-664-3x.png`)

These are systems' numbers, all met in the sketch:
- the pin 14-46 on the tag's axis, clear of zoom and the account badge;
- the tag top at 74 (28px chamfers, patch 4 below the top);
- **the name at 36 below the top (110-138)**, taking option (b): a blank
  tag has no band while you type;
- **result rows at 48px**: name 14/600 navy plus a one-line address in
  11px `--ink-2`, both truncated to one line;
- the stub running on behind the keyboard.

Result: **3 rows plus half of the 4th** from 150 to 320. That meets the
floor of 3, and the half row shows the list scrolls (the owner's own "half
second list item" rule). At 320 the same 48px rows give 2.9. **Systems:**
check whether 46px rows (a 13px name) clear 3 there. Visual sign-off:
13/11 stays legible.

Visual decisions in the typing state:
- **What you type is pencil.** It's graphite `--ink-2`, in the real tag's
  condensed display face at the real name size, with a graphite caret.
  The NAME caption is printed under the line, small caps navy. There's no
  placeholder.
- **The results are printed, on the tag itself, under the name.** They
  sit between hairlines (`--hair` softened), with no separate slip edge:
  a slip would add a second paper edge and a shadow for nothing. Print vs
  pencil makes the difference clear: the offers are print, and your
  entry is pencil.
- **The docked pin is 32px**, the real hanging-pin size, so the tag below
  reads at real scale. It's still orange with the navy + (the type isn't
  known yet). The lifted pin shrinks 48 → 32 as it rises to the dock.

### 4. The journey in looks (for the director's rule-1 check)

1. **Rest.** The pin is lifted bottom-left, on its string to a ground
   point.
2. **Tap.** The pin rises to the dock (14-46) and shrinks to 32. Its
   string lengthens, and the blank tag pops down it, using the existing
   tag-pop timing. The keyboard comes up.
3. **Typing.** As above.
4. **Pick.**
   - The keyboard drops and the map flies.
   - **The pin lands:** the lift and ground shadow go, and it sits on
     the spot like every other pin. The tag hangs from it at the real
     tag's position.
   - The name, address and CITY appear in pencil, and TYPE in pencil.
   - The stub shows **ADD (navy flood) | STAR | VISITED**.
5. **ADD.** The ink-over, in this order:
   - the name bleeds graphite → navy, while TYPE is stamped (seeded
     angle and texture);
   - if VISITED is on, its stamp lands about 150ms later as the final
     beat. Two stamps at once read as noise, one after the other as
     "done";
   - ADD reprints as DIRECTIONS;
   - the pin's face goes from orange-with-+ to the category ring and
     glyph, as a quick swap (no new motion family).
   The tag is now the real tag.
6. **Close the tag.** The fresh lifted pin is standing at bottom-left.

**Systems' item 1 (fresh blank vs step-aside):** "appears when the tag
closes" is the better look. A second orange object beside the new place's
tag would compete with it at the moment you read it. No gap change is
needed.

### 5. Visual takes on systems' items 3-5 (the director rules)

- **3 Shapes.**
  - While you fill the tag, the pin stays lifted over the picked point:
    a shape isn't a point, so it never "lands".
  - On ADD, the pin fades out as the outline appears, and the tag
    re-hangs from the anchor dot (the owner's "dot or something in the
    middle is fine").
  - The stub word is **ADD for shapes too**, not TRACE IT: one action,
    one word.
  - If OSM has no shape, the pin lands as the "(approx.)" pin, as
    today.
- **4 TYPE pre-fill.** A wrong entry in pencil is worse than none, but
  "blank and required" breaks tap-type-pick-ADD. My lean: the OSM class
  where it maps, else the last-used type. It's always pencil, so it's
  visibly provisional, and tapping it opens the choice. Data's call on
  the source.
- **5 CITY.** Folded into the address line, all pencil: "Hallgrímstorg 1
  · Reykjavík". Tapping the city corrects it. It's absent for shapes.
  That saves a line.

### Dropped this turn (final)

- V2 shapes: teardrop, push-pin, empty string with a ring, big disc.
- V3 crop A.
- My vote: V3 as a whole.
- A separate result slip.
- TRACE IT.

NEXT: design director -- rule V2-lifted vs V3-B for the package (and the
kill test once systems' squint is in), then systems' items 1 and 3-5,
so concepts can start.

## Turn 35 -- design director: the resting object picked, items ruled, the jam closed

Read turns 33-34, `sketch-s1-3x.png`, `typing-664-3x.png` and
`pass-a-check/`. I didn't want to hold the jam for one number, so I ran
the lifted-pin squint myself with systems' own `squint.py` functions. I
pasted each disc row's frame 28px higher and added a 2px navy string plus
the 18%-ish ground ellipse. These are **director estimates, not systems'
numbers**; systems re-runs them on the real render in concepts.

| Lifted pin, disc (+2 halo) | mass vs account σ4 / σ8 |
|---|---|
| 44 (visual's sketch) | about 1.15 (the 44 row plus a string; not run) |
| **48** | **1.39 / 1.35** |
| 52 | 1.62 / 1.58 |

The string and the shadow add almost nothing; the mass is the disc. **By
visual's own rule (grow the disc, keep the string), the lifted pin's disc
is 48 (52 with its halo).** That's the smallest size that clearly
outranks the account, and it's still well under the FAB-sized 56-60.

### 1. The package's resting object: the lifted pin (V2-lifted). V3 is dropped

- **The kill test passes, at sketch level.** Cell 1 doesn't squint like
  cell 0: the vertical string and the ground point turn "button floating
  over the map" into "pin held above the map, about to go in". The shape,
  not the size, carries "pin", which is what systems said had to happen.
- Lifting also makes rule 1 true at rest: the string the tag comes down
  is already there. It answers both of the owner's round-5b objections
  with one object and changes no shipped mark.
- **The re-test is in concepts, at real 1x in the app:** lifted pin
  beside a stock FAB and the account badge, and beside the real 24 and
  32px pins. Two failure reads to look for: "lollipop/balloon" (the
  string too long, or the ground point reading as a dot) and "FAB with a
  stick". If either shows at 1x, it comes back to me before the owner
  sees it. Keep the string short (~22) and the ground shadow quieter than
  the halo.
- **V3 dropped,** for visual's reasons, which systems' numbers back:
  - the credit has to move;
  - it's two objects at the list edge;
  - its rank comes from the paper, not the +;
  - it has the same exceptions as V2.
  Per the takeover rule ("keep a dropped route visible as a seen
  alternative"), V3-B gets **one small panel** in the package's rest
  still, labelled "also tried", not a concept.

### 2. Systems' items

- **1 Fresh blank after Add: it appears when the new tag closes.** No
  gap change. A second orange object beside the new place's tag would
  compete with the moment that matters. My "already standing" exit is
  amended to "already standing *when you close the tag*": still no done
  screen, still no fly-in.
- **2 Job 1 exceptions (tag open, filters open): plain cost line** on
  the package for the owner, not small print. It's also the main reason
  A goes forward as its own concept (below).
- **3 Shapes: visual's flow, accepted.**
  - While you fill the tag, the pin stays *lifted* over the picked point.
    It never lands, because a shape isn't a point.
  - On ADD it fades as the outline draws in, and the tag re-hangs from
    the anchor dot (owner: "dot or something in the middle is fine").
  - The stub says **ADD** for shapes too.
  - With no OSM shape, it lands as the "(approx.)" pin, as today.
  - Rule 1 holds: for a shape, the anchor dot *is* the pin.
- **4 TYPE pre-fill: the OSM class where it maps, else the last-used
  type, always in pencil.** Tapping it opens the choice.
  - Blank-and-required breaks the closest-friend minimum.
  - Pencil is the honest form of a guess: it says "provisional" with no
    extra mark.
  - The mapping table is the builder's, and it's Nominatim-only, so it's
    untestable here. That goes in the concept's cost line, plus an
    iPhone check later.
- **5 CITY folds into the address line, in pencil** ("Hallgrímstorg 1 ·
  Reykjavík"). Tapping the city corrects it; it's absent for shapes. The
  new-city confirm and the which-city confirm print as a question on the
  tag, with two stub-style answers (turn 30).
- **6 Focus on tap:** an iPhone check. The fallback is one more tap on
  the name line. Not a design change.
- **7 Two stamps:** visual's order stands (TYPE and the name ink first,
  VISITED about 150ms later as the last beat).
- **8 Desktop:** a flow in `jobs.md`; measure it at build.
- **9 Cancel with a pick:** accepted as written.
- **Typing state:** accepted as drawn.
  - The name sits 36 below the top: a blank tag has no band while you
    type.
  - Result rows are 48 (3 and a half rows at 664). At 320, systems check
    whether 46 rows clear 3; if they do, 46 everywhere, one row height.
  - Pencil entry, printed offers, no separate slip edge. Good: three
    inks, one meaning each.

### 3. The jam is closed. Concepts start from this

The owner said "i want more than one concept" and to keep every
direction open. Float and A are with him as R7. So the concept phase
builds **two packages that share one blank-tag form**, plus one frame:

1. **P · Blank pin.**
   - At rest: the lifted pin (disc 48, string, ground point) at
     bottom-left.
   - Tap: it rises to the dock and the blank tag drops down its string.
   - Then type → pick → it lands → ADD inks the tag. The pin becomes the
     place.
   - Exceptions: tag open, filters open (plain cost line).
2. **A · Header tag.** R7's orange tag cut at the list band's end (kept
   orange: rule 2), opening the **same** blank tag. On tap, the tag
   pulls up from the header cut into the dock, with the 32px blank pin
   above it on its string (rule 1 holds). On pick, it re-hangs on the
   place. It's the only trigger with no exceptions, and it "ties to the
   view state" (the owner's words). That's a real trade against P, not a
   variant, so it's a full concept.
3. **Float, one frame:** the same blank tag rising from the left badge.
   "Same form, other trigger." Not a package.

**Shared, built once (the blank-tag form):**
- **Order:** the real tag's order:
  - eyelet;
  - NAME (= search);
  - address · city (pencil);
  - TYPE (pencil);
  - NOTES;
  - stub.
- **Stub:** ADD (navy flood when ready; printed NAME IT FIRST when not) |
  STAR | VISITED.
- **Three inks:** print = the form's words and the offers; pencil = your
  entries; stamp/ink = on ADD.
- **Docked numbers at 664:** pin 14-46, tag top 74, name 36 below the
  top, rows 48 (or 46), and the stub behind the keyboard.

**Stills each package needs** (phone-readable, 3x, 1170 wide):
- rest beside today, with the + beside the account;
- the 1x close-up and squint;
- the journey strip;
- typing;
- picked;
- ink-over;
- a District/Street;
- a confirm (new city);
- 320;
- a tag open + the exception.
**P also needs:** the FAB/account comparison and the V3 "also tried"
panel.

### Owner questions, for the orchestrator to send WITH the concepts

1. While adding, mark it visited too (VISITED on the blank tag's stub)?
2. Fix a place after adding by opening its tag in pencil again?
3. Skip ADD: picking a result saves the place, with Undo?
4. Later, place a pin by dragging it onto the map or holding the map?
5. Just so you know: on the tag, ADD is navy, because orange on a tag
   means starred.
6. Just so you know: the blank pin can't be tapped while a place's tag
   or the filters are open (one extra tap); the header tag can.

### Likely owner objections I'll score against

- P: "a lollipop" or "still a FAB", and "bigger than every other pin".
  The answer is the lift: it's the pin you're holding, not one on the
  map.
- A: "the tag doesn't read as a +" (his round-4 line). The + is the
  loudest ink on it.
- The form: "too many lines"; "why isn't ADD orange?"; "a wrong type
  pre-filled".

NEXT: product designer (systems focus) -- write `jobs.md` for the two
packages and the shared blank-tag form, including the cost lines, the
shape and confirm flows, and desktop, and re-run the lifted-pin squint
on a real render, so the designers build concepts to settled jobs.

## Turn 36 -- design director: concept round 8, steer after the first pair (not READY yet)

Looked at every still at phone size first: P1-P6, A1-A5, T1-T8, plus
`raw/p-rest664`. Then the concept files, for visual's changes only.

**The package works.**
- One object the whole way: rule 1 holds in every frame I checked.
- Orange is the trigger, navy is ADD, the band is the star (rule 2).
- T3, T4 and T6 already look like the real tag.
- A4 makes A's trade plain.

I'm not scoring yet: four things would cost a 9, and all four are fixable
in one pass. One more visual turn, then I score.

### Fixes (one batch)

1. **Pencil reads as "greyed out", not pencil (T1, T3, T4, T6, T8).**
   - At phone size the graphite name and TYPE are flat grey. In this
     app, grey already means disabled: signed-out controls are greyed
     and offer sign-in.
   - This is the core of "filling out a blank tag". If the pencil
     doesn't read, the idea collapses into a form with placeholder text.
   - Make it graphite: the tooth/grain visible at 1x, a slightly cooler
     and slightly glossier grey than `--ink-2`, and the texture seeded
     per entry ("ink is never identical twice" covers pencil too). Keep
     the face and size; no handwriting font.
   - Prove it in one 1x frame. Put a pencilled name next to:
     - a signed-out greyed control;
     - the printed inactive ADD;
     - the inked name.
   - If it still says "disabled", it fails.
2. **Blank = a whole blank tag (T2).**
   - Right after the tap, the tag is a one-line card: NAME, then the
     stub. The owner's picture is a blank tag you fill out, so the first
     frame shows the full blank tag: NAME, the address line, NOTES and
     TYPE, all printed and empty.
   - The stub sits where it will be (at 664 that's behind the keyboard
     while typing, which matches T1). This also stops the stub jumping
     down as results arrive ("controls don't move").
   - How results print over the lower lines while you type is visual's
     call. The tag's outline and stub don't move.
3. **The journeys aren't phone-readable (P3, A3).**
   - Five panels at about 230px each put the tag text at about 6px on
     a phone.
   - Panels 3-5 are the same in P and A, and T5 already shows them at a
     readable size. So P3 and A3 become **two panels each**: rest, then
     tapped (docked, typing).
   - The shared "pick → ADD → after" is T3 and T5. Don't add stills.
4. **A crop sliver (T2).** A dotted cluster/sticker fragment runs along
   the bottom edge of both panels. Re-crop.
5. **P's needle has to carry "pin" at 1x (P2).**
   - It's the only thing that separates P from the stock FAB, and at
     1.6px it nearly goes in the blur.
   - Make it a 2px navy needle, the same length, with ground contact
     you can see at 1x (firmer, still quieter than the halo).
   - Re-shoot P2 only for this.

### Visual's changes to my rulings: all accepted

- **NOTES above TYPE:** right. It's the real tag's order (name, notes,
  type). I listed it wrong in turn 32.
- **VISITED not re-stamped at ADD:** right. A stamp lands when you
  stamp it.
- **Grey caption labels:** fine where they match the real tag's TYPE
  caption. Captions aren't entries (fix 1 is about entries).
- **Credit hidden while docked:** only while the keyboard is up, when
  it's covered anyway. Picked, questions and failed states show it, as
  T3 and T7 do.
- **Eyelet hole showing map:** keep it. It's the shipped tag's hole;
  changing it for the blank tag would make the blank not the real tag.
- **P vs clusters at city zoom (P5, raw/p-rest664):** it holds.
  Lighter, larger, a + not a number, and the needle. I'm keeping it as a
  likely owner objection, not a fix.

### Not changing

- A's + stays on the right. A1's cost line says so in his words.
- Float stays one frame (A5). It's good as is.

### Owner questions (unchanged from turn 35) go with the send.

NEXT: product designer (visual focus) -- fixes 1-5: pencil that reads as
pencil at 1x (with the comparison frame), the full blank tag, P3/A3 cut
to two panels, the T2 re-crop, P2's needle. Then I score round 8.

## Turn 37 -- product designer (systems focus): does the map have to move? (new direction, round count restarts)

Owner, verbatim (2026-10-14, on round 8b):
> Blank pin looks ugly. I wanted to explore the version where the pin+tag
> was the button and see if that could work with tweaks.
>
> Also i like the hang tag but some of the buttons aren't reading like
> buttons — specifically the add city one. That whole area sort of
> disappears.
>
> And I like the tag being pinned as you fill it out but I'm worried in
> order for it to make sense the map will have to move underneath as it
> gets filled out — which will make it all confusing. Have the agents
> reason about this and if it's too complicated just have the tag be
> what's filled out and the pin placed after creation.

New scripts in `concepts/pass-a-check/`: `pintag.js` (C's pin+tag
button, squint) and the shared `probe.json` / `geo.json`.

### 1. Pinned while filling: yes, the map has to move, 5 to 9 times

Walked on round 8b's own spec. I count every time the map moves under
the tag (pan, zoom or resize) for one ordinary add. Hanging tag at 664:
340-588, pin 280-312, the rows at 388 / 420 / 452 / 484, stub 528-588,
list at its band (604).

| # | Moment | What the map does | 664 | 320x568 | 844 Home Screen |
|---|---|---|---|---|---|
| 1 | Tap + | the list drops to its band, so the map's frame grows by 240 (Leaflet resize) | 364 → 604 | 268 → 508 | 544 → 784 |
| 2 | **Pick** | **flyTo**: pans across the city (up to its whole width) and zooms in 2-3 levels to ≥ 16, so the point lands under the pin at (195, 296) | yes | yes | yes |
| 3 | **Tap NOTES** | the keyboard rises over the NOTES line. To keep the tag pinned, **the map pans up** so the line clears the keyboard | **≥ 164** (NOTES foot 484 → 320) | ≥ 88 | ≥ 164 |
| 4 | Done with NOTES | the keyboard drops, **the map pans back** | 164 | 88 | 164 |
| 5 | STAR | the band adds 12 to the top; the foot is fixed, so **the map pans** 12 | 12 | 12 | 12 |
| 6 | A question appears (new city; which city) | the tag grows about 70 at the top, and **the map pans** about 70 | ~70 | ~70 | ~70 |
| 7 | It's answered | **pans back** | ~70 | ~70 | ~70 |
| 8 | ADD | the tag tightens to the real tag by its top, and **the map pans** 52 | 52 | 52 | 52 |
| 9 | Close the tag | the list rises, the map's frame shrinks | — | — | — |

- **Re-search** (a second pick) is another flyTo.
- **New city:** the pick's flyTo leaves the trip (Reykjavík → Lisbon is
  a zoom-out to country level and back in). Cancel flies home.
- **District / street:** on ADD the tag re-hangs from the area's centre
  dot, not the picked point. That's another pan of about 50-400px at
  zoom 16 (about 1 m/px at 64°N). If the outline is wider than the view,
  it also zooms out 1-2 levels (a 1 km district is about 950px at 16).

**So the owner's worry is right.** In a plain add with a note and a
star, the map moves 5 times (1, 2, 3, 4, 5). With a question it's 7,
and a district adds 1-2 more, while you're looking at the tag. Moves
3-7 aren't caused by the place at all; they only exist to keep a pinned
tag clear of the keyboard and of its own growth. The only alternative
is that the tag moves off its pin, which breaks "pinned". The flyTo on
pick (2) is the one move that carries meaning.

### 2. The owner's fallback: fill the tag, place the pin on ADD

The tag is a card in the screen's frame, not on the map:
- **Keyboard up:** it sits on the keyboard (docked: top 74 at 664).
- **Keyboard down:** it sits on the list's band, foot just above it
  (340-588 at 664), with ADD at the thumb.

| Moment | Map | The tag |
|---|---|---|
| Tap + | the list drops to its band (as every concept already does) | rises into the dock |
| Type, pick | **still** | the keyboard drops; the tag settles onto the band, the way a sheet follows the keyboard |
| NOTES | **still** | rides up with the keyboard, then back |
| STAR, a question | **still** | grows from the top; the foot (ADD) doesn't move |
| **ADD** | **one flight:** the place is brought to the tag's hanging point (195, 296 at 664), so the pin lands into the eyelet as the map arrives. The tag doesn't move. | inks over |
| District / street | one flight, framing the outline, with the centre dot at the hanging point (zoom-out included) | — |
| New city | one flight to the new city, and the list switches | — |
| Close | the list rises | — |

**One map move per add, after you've finished writing,** plus the list's
resize, which is the same in both models. What moves while you write is
the tag riding the keyboard: the ordinary iPhone form behaviour, not the
world behind it.

**What it costs: job 8, "see where it goes before you commit".** Two
partial answers:
- **(a) The words already say where.** Each result prints its address,
  and the picked tag prints "address · city" in pencil, plus "New city?"
  when it's outside the trip.
- **(b) On demand, not automatic.** Tapping the address line (or a small
  "show me" mark on it) flies the map once to put the spot under the
  hanging point. That's a move you asked for, not one that happens to
  you.
- **A wrong pick is then only seen on ADD,** which makes "fix a place
  after adding" (scope question 2) or an Undo slip after ADD (Plans v3
  has one) more valuable. One line for the director.

**Recommendation: the fallback, with (b).** The owner's bar is "if it's
too complicated". Five to nine moves under a form you're writing on is
too complicated. The pinned model's only real gain (seeing the spot) is
kept on request, and the ADD flight keeps the moment the owner likes
(the tag gets pinned, by the place coming to it). Job 8 becomes "see
where it goes on request before ADD, and always on ADD". That change
needs the director's sign-off.

### 3. The pin+tag as the button (C's R6b, "with tweaks")

**What's settled from R6b:**
- an orange 32 disc with a navy + (the selected-pin grammar);
- a 1.5px straight string;
- an 84x66 cream tag (15 chamfers, eyelet and patch, 1px warm edge, the
  tag's shadow, no band).

**Measured again at the owner's side (bottom-left, ink 19.9, foot 20
above the list), real render, real 202 pins:**

| Disc | Box at 390x844 | Squint mass vs account (σ4 / σ8) |
|---|---|---|
| 32 (R6b) | 19.9,412 – 103.9,524 (84x112) | **0.86 / 0.84**: below the account. This is his round-5b "same weight", measured |
| 40 | 84x120 | 1.20 / 1.17 |
| 48 | 84x128 | 1.61 / 1.57 |

- **Rank:** the cream tag adds almost nothing (cream on a cream map).
  The disc carries the rank, as with the lifted pin. **Tweak 1 for
  visual:** disc 40 for parity-plus, or 48 for the lifted pin's 1.6x.
  Alternatively, give the tag ink that counts (a navy + printed on the
  tag, not just the pin): that's visual's call.
- **Footprint:**
  - the credit is clear at every width (the credit is right-aligned);
  - real pins: 0 under, everywhere but **320 Stockholm, list up: 3
    under** (with the default fit). Panning frees them, but it's the one
    place it lands on the trip;
  - dead zone 84x120, about 2.9% of the map at 844.
- **Exceptions (the same kind as C and P):**
  - **Tag open:** at 664, 375 and 320 the tag's foot is 52 above the
    list, and the object's top is 132-148 above it. So: step aside
    (ruled before for C), or `TAG_SHEET_GAP` 152, which costs a row I
    wouldn't spend.
  - **Filters open:** under the panel; close them to add. A stays the
    only exception-free trigger.
- **States:**
  - rest;
  - pressed (deep orange disc; the tag goes `--paper`);
  - hidden (a tag open, the filters open, while adding, and after ADD
    until the new tag closes);
  - signed out (adds); stale sign-in (asks, nothing moves);
  - Plans (adds a place);
  - desktop (the map column's bottom-left).
- **Hand-off under the fallback (my lean):**
  - **The button's tag is the form's tag.** Tap: the small tag grows into
    the full blank tag, docked on the keyboard (84 → 316 wide, from the
    corner).
  - **The pin waits.** Two ways; visual and director choose:
    - **(i) The pin rides on top of the docked tag** (rule 1 from turn
      32). Risk: a pin above the map reads as *placed* on whatever's
      under it, which is false until ADD.
    - **(ii) The pin stays behind at the button's spot, and the tag's
      eyelet is empty while you fill it.** On ADD the map arrives and
      the pin drops into the eyelet on the place. That's the owner's
      "the pin placed after creation", word for word. It also makes the
      button's anatomy mean something: the pin and the tag are separate
      until ADD joins them.
    - I lean (ii), and it supersedes turn 32's rule 1 for the filling
      phase. The owner's words outrank our rule.
  - **After ADD:** the fresh pin+tag is at rest when the new tag closes,
    as before.
- **Under the pinned model** (if the director keeps it), the hand-off is
  C's R6 flow: the tag hangs from the pin on the picked spot, and §1's
  map moves apply.

### 4. For visual: the answer area (T7) disappears

The owner: "some of the buttons aren't reading like buttons —
specifically the add city one. That whole area sort of disappears."
- **As a job,** this is job 16 (a straight answer, with what to do next)
  and job 12 (finish near the thumb). When a question is up, its answers
  are the *only* way forward, so they must read as the next action more
  strongly than anything else on the tag.
- **What T7 does now:**
  - The answers are printed words on the same cream paper, separated
    only by dashed hairlines, so they read as text, not controls.
  - Meanwhile the real action slot (the stub) shows a disabled "ADD /
    ANSWER ABOVE". So the eye goes to the stub, finds nothing, and the
    area above it reads as fine print.
- **Structural option (not a look): put the question's answers in the
  stub.**
  - While a question is up, the stub's segments *are* the answers,
    where ADD lives and under the thumb: **ADD LISBON** (the primary,
    with ADD's ready treatment) | **PICK FROM MY LIST**.
  - The question's sentence prints just above the perforation.
  - Once it's answered, the stub returns to ADD | STAR | VISITED.
  - For the shape's "which city": NEW CITY | [runner-up], with "another
    city…" as a printed link above.
  - This also removes "ANSWER ABOVE".
- **Either way:** the primary answer gets the same treatment as a ready
  ADD (the one action control on a tag), and the secondary reads as a
  tappable segment, not a caption. The look is visual's.

### What changes in jobs.md (after the director rules)

- **Job 8** becomes "see where on request before ADD, and always on ADD"
  (if the fallback wins).
- **Job 3** for the pin+tag: what you tap *is* the tag you'll fill
  (stronger than P's string).
- **Job 2:** the pin+tag needs the disc at 40 or more (or ink on the
  tag) to beat the account.
- **Rule 1** (the director's "pin above the tag at every step") is
  superseded during filling if (ii) wins.

NEXT: design director — rule pinned vs fallback (with the job 8 change),
the pin's wait (i vs ii), and whether the answers go in the stub; then
visual draws the pin+tag button with the rank tweak.

## Turn 38 -- design director: round 9 steer (pin+tag button, the fallback filling model, answers that read as buttons)

Owner, verbatim (2026-10-14, on round 8b): see turn 37. The round count
restarts.

**What "Blank pin looks ugly" tells me about a 9.** I scored P a 9 on
evidence that a squint metric and a FAB comparison answered. They did,
and it was still ugly to him. **Rank solved by inflating a mark is not
a 9**, however the numbers come out. The object has to look at home
beside the app's own pins and badge first, and win rank second. I'm
scoring on that from now on, and it's in my notes.

### Rulings

1. **Filling model: the owner's fallback.**
   - Systems' count settles it: 5 map moves in a plain add, 7-9 with a
     question or a district. That's "too complicated" by the owner's own
     bar.
   - The tag is a card in the screen's frame: docked on the keyboard
     while you type, on the list's band when it's down. **The map stays
     still while you write.**
   - **On ADD, one flight:** the place comes to the tag's hanging point
     and the pin drops into the eyelet. That's the moment he liked ("the
     tag being pinned"), kept as the payoff instead of a process.
   - **Job 8 becomes "the words say where before ADD; the map shows it on
     ADD".**
   - **(b), the on-demand "show me", is out.** It's a second tap target
     on the address line that already corrects the city: one more
     control for a case the result row's address and the "New city?"
     question already cover. A wrong pick is fixed after the fact
     (owner question 2 stands).
2. **The pin's wait: (ii).**
   - Tapping the button takes the blank tag off the pin. The tag rises to
     the dock, and the pin stays at the button's spot (hidden while the
     tag or keyboard covers that corner).
   - **While you fill, the eyelet is empty.** On ADD the pin goes in.
   - That's the owner's "the pin placed after creation", word for word.
     **Turn 32's rule 1 is superseded during filling;** the owner's words
     outrank my rule.
   - A gets the identical ADD moment: its tag also fills with an empty
     eyelet and is pinned on ADD. **One form, one ending, two triggers.**
3. **The question's answers go in the stub: yes.**
   - While a question is up, the stub's segments *are* the answers
     (ADD LISBON, which gets ADD's ready navy treatment, | PICK FROM MY
     LIST as a plain tappable segment). The sentence prints just above
     the perforation.
   - "ANSWER ABOVE" goes. The stub returns to ADD | STAR | VISITED once
     it's answered.
   - Shapes' "which city": NEW CITY | the runner-up.
4. **His wider note: "some of the buttons aren't reading like buttons."**
   - He named the new-city area, but "some" is plural. **Visual audits
     every tappable thing on the blank tag at phone size:**
     - the TYPE pencil + ⌄;
     - the city ⌄;
     - the NOTES line;
     - ×;
     - STAR / MARK VISITED;
     - the answers.
   - Anything a stranger wouldn't tap gets the stub's segment treatment
     or a clearer affordance from the shipped tag's vocabulary. No new
     button style ("the same text button not a new button style").
5. **P (lifted pin) is dropped.** He called it ugly. It isn't shown as an
   alternative.

### The pin+tag button ("with tweaks"): direction for visual

His three past objections to this object, in order:
- R4: the tag "doesn't read like a plus button";
- R5b: "the pin doesnt look like a pin and therefore the tag doesnt read
  as a tag (or a button)";
- R5b, on the badge: "prominence … same weight and heirarchy as
  account".

Today R6b's 32 disc is 0.86x the account (systems).

The tweaks must answer all three without the P mistake:
- **The pin is the app's own pin, at the app's pin size.** At most 40
  (systems: 1.20x), not inflated past what a selected pin could be. If
  32 can't carry rank, the rank comes from the *tag*, not from a bigger
  disc.
- **The tag reads as the Hanging Tag at 1x.** Its die-cut, eyelet
  patch, stub perforation and side notches are drawn so they survive at
  its size (turn 31's V1 study). I dropped V1 in turn 32 because a
  shrunk tag fails; the owner is now asking for exactly this object, so
  the job is to make it *not* fail. A slightly larger tag is fine; a box
  with a hat is not.
- **One +, and the whole object reads as one button.** Where the + sits
  (the pin's face, where the glyph goes, or printed big on the tag where
  you'll write) is visual's call. Show the pick, plus at most one "also
  tried" panel.
- **Colour, rule 2:** orange off the paper (the pin face). The tag stays
  cream, with no band: orange paper means starred.
- **It has to look good beside the real pins and the account badge,
  before any squint number.** Then systems measures it: it must beat the
  account (≥ 1.2x) and clear the real pins (320 Stockholm is the known
  hit).
- **Position:** bottom-left, as he asked for the badge.
- **Exceptions:** step aside under a tag, close filters, as before. A
  stays the exception-free one.

### Concept set for round 9

Two concepts, still "more than one":
1. **C · Pin+tag.** The button (with the tweaks), then the shared form.
2. **A · Header tag.** Unchanged trigger, then the shared form.

**The shared form:**
- the fallback model;
- an empty eyelet while filling;
- pinned on ADD;
- answers in the stub;
- everything tappable reads as tappable.

Float stays one frame. The round-8b form stills carry over wherever the
model didn't change: typing, pencil, district (minus the hanging pin),
320.

**Re-draw what changed:**
- the picked tag on the band, with the map still and the eyelet empty;
- ADD's flight + pin-in, as a before/after;
- the new-city stub;
- the tappables audit;
- C's rest vs today;
- C at 1x vs the account and the real pins;
- C's tap (the tag comes off the pin).

### Owner questions (unchanged; send with the concepts)

The same six as round 8b. Q6 is reworded: "the pin+tag needs one extra
tap while a place's tag or the filters are open; the header tag doesn't."

NEXT: product designer (visual focus) -- draw the pin+tag button tweaks
(app-size pin, a tag that reads as the Hanging Tag at 1x, one +) beside
today's pins and the account, plus the new-city stub and the tappables
audit, so systems can measure rank and footprint on the real render.

## Turn 39 -- product designer (systems focus): round 10, the tag as the button; making the Float complete; + is global

Owner, verbatim (2026-10-14, on 9c): "…we're going to cut the header tag.
it isn't working and conflates that bar with list actions and global
actions (e.g. i could be adding to any city not just the one showing). i
am liking the badge version and the tag where the + is inside of it. the
badge one seems fairly complete if we go that way but i still want to
push the other one to make a final call. i think the tag itself needs to
be simplified … just the tag with the + in it, the dotted line, and the
"claim check" end. then the + would not need to be in any container, so
the tag itself becomes the button. explore that - don't assume a color
for the tag … don't only respond to my specific notes."

New measures are in `concepts/r10-check/`:
- `float.js`: the Float's squint, on the real render;
- `tag-footprints.json`: candidate tag sizes against the real 202 pins
  and the credit, plus z14 odds.

The looks are visual's (`C-tag-r10/`).

### 1. The tag as the button (no pin at rest): how it works

**What it is, structurally:** a loose tag, not yet pinned to anything.
That gives the whole package one sentence:
- **the button is an unpinned tag;**
- **you fill it in;**
- **ADD pins it to the place.**

The pin finally has one job and one moment. The ending is unchanged from
round 9: one flight, the place's pin into the eyelet.

- **Tap target:**
  - the tag's whole silhouette box, padded to at least 44 high if it's
    drawn smaller;
  - the + is ink on the tag, not a separate control;
  - no bare corners matter, because the box is nearly all tag.
- **Pressed:** the tag's own pressed state (one step on its fill, the
  shared grammar). The + doesn't move. The colour is visual's open
  question.
- **Hand-off:**
  - Tap → the small tag *is* the form. It grows (and turns upright, if
    it's drawn lying across) into the docked blank tag.
  - The button tag's chamfered end becomes the form's top, and its
    dotted line and claim-check end become the form's perforation and
    stub. Every part maps one-to-one, so nothing new appears and nothing
    vanishes.
  - The + becomes the empty NAME line (where you'll write). That is the
    one part that transforms.
- **Eyelet:**
  - the owner's list (tag, +, dotted line, claim-check end) has no hole;
  - if the button has none, the form's eyelet appears with the empty
    patch as it grows;
  - if it has a small one, it's the same hole, empty.
  - Either works structurally; it's visual's call. ADD's pin-in needs the
    eyelet on the form only.
- **Cancel:** the docked tag shrinks back into the button. The draft is
  kept. Whether a kept draft shows on the button (a pencil line instead
  of an empty tag) is parked; the director ruled no draft at rest in
  turn 32. I'd re-open it only if the owner asks.

**Footprint: the smaller tag fixes C's two costs.** Candidate sizes,
bottom-left, ink 19.9, foot 20 above the list (or 6 above the credit
where they meet):

| Size | Pins under, opening fit (40 scenes) | z14 odds: Copenhagen / Stockholm / Malmö / LA | Credit, horizontal clearance at 390 / 375 / 320 (no prefix) |
|---|---|---|---|
| **88 × 44** | 0 everywhere | **13 / 13 / 16 / 3%** | 31 / 16 / 26 |
| **104 × 52** | 0 everywhere | 15 / 16 / 19 / 4% | 15 / 0 / 10 |
| 120 × 56 | 320 Stockholm 1 | 17 / 18 / 21 / 5% | overlaps (−1 / −16 / −6), so the foot rises to 6 above the credit |
| 60 × 84, upright | 0 | 15 / 15 / 20 / 4% | 59 / 44 / 23 |
| Float 60 × 60 (ref) | 0 | 12 / 13 / 16 / 3% | 64 / 49 / 28 |
| C 9c 144 × 75 (ref) | 320: Malmö 4, Stockholm 6 | 21 / 22 / 28 / 7% | overlaps |

- **At ≤ 104 wide the tag button's footprint is Float-class:** no real pin
  at any opening view, and street-zoom odds within 1-4 points of the
  Float.
- **Up to 104 it stays left of the credit at 390 and 320; at 375 it just
  touches (0).** So **I'd cap it at about 96 wide** (8+ clear everywhere),
  or let the foot rule handle 375.
- **The tag-open exception can go.** A small tag (52 high, top 72 above
  the list) fits under an open tag with `TAG_SHEET_GAP` 84 (20 + 52 +
  12), the Float's own rule (88 for 60). That costs the same list row
  (at 320, 1 row with a tag open instead of 2; 664 keeps 3). C hid under
  tags only because the 9c object was 75-133 tall (gap 107-165).
  **Proposal:** both options stay tappable with a tag open, with the gap
  derived from the object (top + 12). Tapping closes the tag; cancel
  reopens it. The filters exception stays for both, because the panel
  covers that corner.
- **Rank:**
  - I can't measure it until visual picks a colour. The bar stays ≥ 1.2x
    the account (judged on the look first).
  - For scale: the Float is 1.34 / 1.33, and 9c's 144-wide tag with a
    40px pin was 1.24 / 1.19.
  - A small tag with no pin gets all its mass from the tag's fill and the
    +. That's why the colour question is real: a cream tag on a cream map
    will be near 0.5, and a filled tag can clear it.
  - I'll measure whatever visual picks.

### 2. The Float: what it needs to be "complete" under the shared form

It is nearly there. The gaps are hand-off and parity, not a redesign:
1. **Its state while adding.** Round 9's frame kept the badge visible as
   an open navy ×, which forced the card's foot up to 512, so ADD sat at
   452-512 instead of 521-581.
   - **Proposal: the badge hides while you add,** like C. The tag's × is
     the one cancel.
   - ADD then sits in exactly the same spot for both options (521-581 at
     664), so the owner compares the buttons, not two different forms.
2. **The hand-off motion:** the tag rises out of the badge (visual). One
   frame each: rest → docked.
3. **Tag open:** gap 88, already ruled in round 7. It stays tappable.
4. **Filters:** close to add (both).
5. **Numbers (on the real render now):**
   - squint **1.34 / 1.33** the account;
   - box 15.2,464 – 75.2,524 at 844;
   - 0 real pins at the opening fit;
   - z14 odds 12 / 13 / 16 / 3%;
   - the credit clear by 64 at 390, and 28 at 320 with the prefix
     dropped.
6. **Stills it lacks to match C's set:** tap → dock, the card with the
   map still, ADD (before / after), a tag open (still tappable), 320,
   and pressed. The form stills (T0-T9) are shared, unchanged.
7. **Job 3 is the one place it's weaker than C:** the badge hands you a
   tag rather than being one. That's the honest trade for the owner.

### 3. + is global (the owner's reason for cutting A) and the form

- **The rule** (jobs.md job 5, new): + is a trip-wide action. It never
  lives in the list's bar and never assumes the list's city, filters or
  plan. Both remaining options pass the first half by placement.
- **The form doesn't fully support "any city" today. I found a gap, and I
  introduced it.** Today's form puts City *first*, and that city scopes
  the search (`userOverrodeCity`). The blank tag moved CITY after the
  pick, so before you search there's no way to say "in Copenhagen".
  - The search scopes to the city the *map* is showing:
    `detectCityContext()`, a hard country filter.
  - It widens only when that returns **zero** results
    (`nominatimWithFallback`).
  - So from Reykjavík, "Tivoli" finds an Icelandic Tivoli, if there is
    one, before it ever looks in Copenhagen.
- **Fix (structural; the look is visual's):** the results' last line is
  always **"Search everywhere"**, a printed tappable row.
  - It re-runs the same text with the city scope dropped:
    `widenedSearchConfig`, the viewbox as a soft hint only.
  - The pick's city is detected as today (`maybeDetectCity`), with the
    new-city question if it's outside your trip.
  - That's one tap to any city, and no setting before you type: the
    default stays the city you're looking at, which is right most of the
    time ("don't make the user pick settings the app can infer").
  - **Alternative:** a scope chip on the NAME line ("in REYKJAVÍK ⌄").
    That's one more control on the tag, and the owner just asked to
    simplify, so I lean to the row.
- **After ADD** the list switches to the place's city (already job 15).
  In Plans, + adds a place, not a stop (already a flow).

### 4. Beyond the owner's notes

- **The two options now differ only at rest and on tap.** Same corner,
  same exceptions (if the gap proposal holds), same form, same ADD spot,
  same ending. That makes his final call a clean comparison of two
  buttons. I'd say so on the send.
- **An Undo slip after ADD.** With the map still until ADD, a wrong pick
  is first *seen* at ADD. Plans v3 has an Undo slip. One "Undo" on the
  inked tag's moment (about 5s) is cheaper than his "fix it after"
  question, and it covers the commonest mistake. Worth a director look,
  as a scope question.
- **Desktop:** the button sits at the map column's bottom-left; there's
  no keyboard dock, and the tag sits low in the map column. Unmeasured;
  it's the same for both options.
- **Rejected:** showing the kept draft on the button (noise at rest;
  turn 32).

### What changed in jobs.md

- A is removed.
- New **job 5:** "+ is for the whole trip" (the owner's words). The
  blank-tag jobs renumber to 7-18.
- Job 1: the exceptions are now the same for both (filters only; a tag
  open stays tappable), as proposed.
- Flows:
  - C is the tag as the button;
  - the Float is a full flow (it hides while adding);
  - "Search everywhere" goes on the results.
- The previous version is in `notes/jobs-r9c.md`.

NEXT: design director — rule on:
- the tag-open gap rule (both options stay tappable);
- the Float hiding while adding (ADD in the same spot for both);
- "Search everywhere" as the last result row;
- capping the tag at about 96 wide.

Then visual's round-10 tag looks get measured for rank.

### 5. Folded in: the owner's second note this round (verbatim in owner.md)

> re: the tag being filled out — i think it's too low on the screen. the
> content should feel visually weighted center in the open area, and the
> pin should probably get placed above it as the places are determined.
> i like the idea of it not being pinned, then as it's being filled out
> the background changes and it looks pinned once there's an address. the
> dropdowns are very awkward. … i do think editing a place is a future
> update for sure. and if someone adds something, for now it should not
> save until they click "add" … i may just be looking something up.
> holding a spot on the map … i could see this in the future …

and: "i want to be clear even though i said centered i meant *visually
centered... im not sure if mathematical center will feel like that."

**Settled by his answers:**
- edit after adding: later;
- nothing saves without an ADD-type tap (picking never saves; P3 is
  closed);
- hold to place: later (real maps).
- Visited while adding is still unanswered.

**How "pinned once there's an address" squares with turn 37, said
plainly: it works, and it costs one more map move than round 9 (two
instead of one).** Turn 37's five-to-nine moves came from the tag being
*fixed to the map*, so everything that moved or grew the tag dragged the
map with it. The owner's version keeps the tag fixed to the *screen*
(visually centred), and the map comes to it **once, at the pick**. That
holds if three rules hold:

1. **The tag never moves the map after the pick.** When the keyboard
   comes up for NOTES, the tag lifts off its pin to the dock and drops
   back under it on Done. The pin stays put on the place, the string
   hides while the tag is lifted, and the map doesn't move. A tag going
   up with the keyboard is ordinary phone behaviour; the place doesn't
   move.
2. **The tag never changes size while you fill it in.** Starring doesn't
   change the height: the picked card already has the real tag's 48 top
   that the band uses (the "+12 when starred" was only the docked 36 top).
   The question, the TYPE and city choices, and the save-failed line all
   print *inside* the tag's lower area, over NOTES and TYPE, the way the
   results do. **This replaces round 9's "the question grows the tag from
   the top"**: with the pin above the tag, growing from the top would move
   the pin, which means the map.
3. **ADD's settle is the second, small move.** The tag tightens to the
   real tag (264 → 196) by its top coming down, which moves the pin and
   so the map: a 68px pan in sync with the shrink (8b's mechanism, which
   the director has already accepted). Alternatively, keep the size until
   the tag closes, with no move at all.

**Map moves per add:**

| Model | Map moves |
|---|---|
| Pinned to the map (rounds 7-8) | 5-9 |
| Round 9 fallback | 1, at ADD |
| **This** | **1 at the pick (the moment it "looks pinned") + the ADD settle (68px, or 0 if the tag keeps its size)** |
| Re-search | one more flight; it's your own action |

His model also brings back job 9's "see where before ADD", which round 9
had given up. I recommend it, with the three rules.

**Visually centred, in numbers.** I'm using the optical centre at about
45% of the open area from its top. This is a starting point; visual judges
it on the phone (his words). The open area runs from the account badge's
foot to the list's band. The card is 264, the pin and string are 60 above
it, and the pin is on the tag's axis.

| Viewport | Open area | Card (optical) | Pin | ADD | Card (mathematical, for comparison) |
|---|---|---|---|---|---|
| 390x664 | 66-604 | **176-440** | 116-148 | **380-440** (57-66% down) | 203-467 |
| 320x568 | 66-508 | 133-397 | 73-105 | 337-397 | 155-419 |
| 844 Home Screen | 113-784 | 283-547 | 223-255 | 487-547 | 316-580 |

- **The pin clears the account badge and zoom at every size** (x 179-211
  at 390).
- **At 664 the NOTES row (about 296-328) ends right at the keyboard's top
  (328).** Rule 1 lifts the tag anyway; at the visual centre it barely
  needs to.
- **ADD rises from 521-581 to about 380-440 at 664.** That's still thumb
  reach on a 6.1" phone, but it's the trade for "too low on the screen":
  the owner's own call, now made. Two consequences:
  - The Float hiding while adding matters less (the card is far above
    the badge).
  - **The trigger no longer needs to hide while adding.** At 664 the
    Float badge (464-524 with the list up; it rides to the band while
    adding) and C's tag never meet the card. I'd still hide it: one
    cancel, the ×.

**Replacing the dropdowns** (structure; the look is visual's): **one
pattern for every choice on the tag.** Tapping TYPE or the city prints the
choices in the tag's lower area, the same area and the same printed rows
the search results use. Tap one and it pencils in; the area closes. There
are no native pickers and no popovers.
- **TYPE:** 11 choices (9 kinds plus District and Street). The area
  under NAME is about 124 × 284 at the card's fixed size. It holds a 4 ×
  3 grid of about 71 × 40 cells (glyph plus a short word), or it scrolls
  with a half row showing, as the results do.
- **City:** your cities (5 today), plus "New city…" as the last row,
  which uses the same new-city answer as a pick outside the trip.
- **Hit areas:** each choice is a full row or cell, at least 40 high (no
  chip-in-a-row overlaps; T9's issue goes away).
- **Search everywhere** (section 3) is the same pattern: the last
  printed row.

jobs.md is updated:
- job 7 (nothing saved before ADD);
- job 9 (pinned at the pick; the map still afterwards);
- job 13 (visually centred);
- job 14;
- job 15 (the district is framed at the pick);
- job 18 (no dropdowns);
- the "Later, not now" list;
- the flows.

NEXT (replaces the one above): design director — rule on:
- the three rules for "pinned at the pick" (the tag lifts for the
  keyboard without moving the map; the tag never changes size; ADD's
  settle or no settle);
- the choice pattern replacing the dropdowns;
- both triggers staying tappable with a tag open;
- "Search everywhere";
- the 96 cap.

Then visual draws round 10 at the optical-centre numbers.
