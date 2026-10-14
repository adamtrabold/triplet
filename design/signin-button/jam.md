# Jam: sign-in button

## Turn 1: product designer (systems focus)

### Jobs, written from the owner's words before reading any spec

Owner's words: "playground version ... when i share it people can play with it
non-destructively"; "it should just have a sign in button"; "we need a
secondary style for that button that is for signing in"; "a signed out person
themed icon, maybe smaller? but with "sign in" in the circle following a
circular path under it (like a U shape around the circular shape)".

| # | Job | Who | Source |
|---|-----|-----|--------|
| J1 | Find the way to sign in, and tell it's a sign-in, without opening anything first. | owner, Erica | stated ("just have a sign in button"; "sign in" written on it) |
| J2 | Tell at a glance that I am *not* signed in (the control looks signed-out, not like the signed-in account badge). | everyone | stated ("signed out person themed icon", "secondary style") |
| J3 | Sign in from the playground and end up in the real app, signed in. | owner, Erica | stated (the playground's sign in) |
| J4 | Play with everything without the sign-in control getting in the way or out-shouting the real controls (+, list, map). | visitor | stated ("secondary"; "play with it") |
| J5 | Once signed in, see the normal account control (email, Logout) in the same place. | owner, Erica | inferred (the slot is shared) |
| J6 | Know that what I do here won't stick (it's a playground, a reload wipes it). | visitor | inferred: "non-destructively" is the owner's goal, but nothing yet tells a visitor |
| J7 | Not lose my playground fiddling by accident when I tap Sign in, or at least not be surprised by it. | visitor | inferred |
| J8 | Sign in from the normal (non-playground) app without first having to try an edit. | owner, Erica (new phone, cleared Safari) | inferred: today the signed-out app has no account button at all |
| J9 | Tap it comfortably on a phone even if the drawn mark is "maybe smaller". | everyone | inferred (390px iPhone, 44px touch rule) |

J6 to J8 are scope questions for the owner, not things this round must solve.
I'm listing them so nobody quietly decides them.

### What's actually wrong with the rejected build (structure, not looks)

Looking at `current-rejected-menu-3x.png` and the code on this branch:

1. **The badge lies.** In the playground the button is the *signed-in* account
   badge (filled orange, person glyph). A visitor sees "you're logged in";
   the owner sees their own account. The state system says filled orange =
   signed in, so the signed-out state needs its own look (J2). This is the
   "secondary" the owner is asking for, and it's a state-system call, not a
   decoration call.
2. **Two taps for one action.** Badge, then a dropdown that holds one boxed
   button. "It should just have a sign in button" reads to me as: the badge
   *is* the sign-in. The owner's circular-text idea says the same thing
   structurally: the words go on the badge, so there is nothing left for a
   menu to say. **Proposal: in the signed-out state, no dropdown. One tap
   signs in.** (The dropdown comes back only when signed in, for
   email + Logout.)
3. **The tap leaves the page.** `logout()` in playground mode does
   `location.href = '?signin'`: a page load, the real app, then the modal.
   Fine for the owner; for a visitor it silently throws away what they built
   (J7), and they can't sign in anyway (RLS allows two emails). Flow options
   below.

### Structure

- **One slot, two states.** Top-right, left of `+`, same position in both
  states (owner: "Controls don't move or grow").
  - Signed out (playground always; normal app if J8 is a yes): the secondary
    sign-in badge. Tap = sign-in form.
  - Signed in (real app): today's filled orange badge. Tap = dropdown (email,
    Logout).
- **Hierarchy:** `+` (navy, primary action) > sign-in (secondary) on the map's
  chrome. Sign-in should read as quieter than `+` and quieter than the
  signed-in badge. Owner: "Secondary marks never outrank content."
- **Hit area vs drawn mark.** If the mark gets "maybe smaller" (say 40px
  drawn), the button stays ≥44px with transparent padding, and it keeps
  sharing the `+` badge's centre line so the pair stays aligned.
- **Words on the arc are a label, not the accessible name.** `aria-label="Sign in"`
  on the button; the arc text (SVG `textPath`) is `aria-hidden`.

### Flows

**F1: owner, in the playground, wants to edit for real.**
Today: tap badge, tap SIGN IN, page reloads to the real app, modal opens,
type, signed in. Options, from cheapest to nicest:

- **F1a, keep the hop, drop the dropdown:** tap the badge, go to `?signin`,
  modal. One fewer tap. Visitor work lost silently.
- **F1b, sign in in place:** tap opens the existing auth modal *over the
  playground*; on success, go to the real app (already signed in, so no
  second modal). Cancel = stay and keep playing, nothing lost. Failed
  password = error in the modal, still in the playground. I lean F1b: the
  only page change happens after a success, and a visitor who taps out of
  curiosity loses nothing. (Builder note: the playground client is built
  without the stored session, so sign-in would need the real auth client;
  that's a "can it be done" question for the builder, not a design blocker.)
- **F1c, already signed in on this device:** the owner opens their own shared
  link. The real session is sitting in localStorage. The badge could notice
  and offer "back to the real trip" instead of a sign-in form. Nice, but it's
  a third state. Parking it as an open question.

**F2: visitor taps Sign in out of curiosity.** With F1b they see the sign-in
form, and could see one line saying this is the trip's owners' sign-in (copy
TBD, could double as J6), then Cancel and keep playing. With F1a they get
kicked to the real app with an empty sign-in modal they can't use, and lose
their playground state. That's the failure I'd design away.

**F3: signed out in the normal app (J8, if the owner wants it).** Same badge,
same tap, same modal, and on success it inks in to the orange account badge
without reloading. Today's other routes (a modal when an edit is attempted;
the "sign in" slip under a tag) stay as they are.

**F4: sign-in succeeds, the badge changes state.** Owner: "State changes
animate wherever they come from." The swap from secondary to signed-in is a
state change, so it should *do* something, ideally in the app's own stamp
language (see direction D).

**Error/edge states to cover in concepts:** wrong password (modal error, the
badge doesn't change); offline / Supabase unreachable (the modal shows the
error, the playground keeps working off its copy); landscape and 320px-wide
phones (the arc text still has to be legible, and if not, it drops to just
the glyph plus the aria name, never a truncated arc); a long press does
nothing special; while the add form or a tag is open the badge stays where
it is.

### Creative directions (they differ in kind)

I drew real randomness for this turn: fields **trail register box, origami,
beekeeping**; Oblique Strategies **"Discard an axiom"** and **"Use fewer notes."**
The trail register was a gift: "sign in" is literally what you do at a
trailhead register box, and the trail scrapbook is in `design/inspo/project/`.

- **A. Ring-lettered badge (the owner's, must be explored).** A smaller
  signed-out person glyph sits high in the circle, with SIGN IN set on a U
  arc under it, inside the badge's edge, like the curved text on a hotel
  label or a park patch. The badge is the whole control, no menu. Questions
  for visual: does the arc fit at 50px (7 condensed caps on the lower half
  circle, about 60px of arc at r≈19), what makes it look "signed out" (an
  empty or outline person? a dashed head?), and what makes it "secondary"
  next to the navy `+`.
- **B. Trail register.** The same slot, but the metaphor is a trailhead
  register: the arc could read "PLEASE SIGN IN" the way the boxes do, and the
  sign-in form opens as a register sheet (name/password lines) rather than a
  generic modal. The whimsy carries meaning, which is the owner's test:
  signing in = signing the register. Risk: the form restyle is bigger scope
  than "a button".
- **C. Inked-in (the state system as the idea).** "Use fewer notes": the
  signed-out badge is the *same scalloped die* as the account badge but
  un-inked: cream paper with only a keyline, glyph and arc in navy ink. On
  sign-in it gets stamped orange (the stamp/ink-bleed motion the app already
  owns). Signed out = blank impression; signed in = inked. Could be the state
  model under A or B rather than a concept of its own; visual's call.
- **D. Discard the axiom "sign-in lives in a badge."** The playground shows
  a slim strip or a label tied to the map's corner: "PLAYGROUND, nothing
  here is saved · Sign in". It covers J6 and J1 together. Risk: added chrome
  and a second line of text, which the owner dislikes ("No extra header
  height", "two rows of text"). I'm keeping it as the wildcard that tests
  whether J6 deserves room at all.
- **Considered and parked:** *Origami / a folded corner* reading SIGN IN. The
  peel/flap is already the visited sticker's language on the map, so it
  would collide in meaning. *A hanging luggage tag* reading SIGN IN off the
  badge: a hanging tag already means "a place's popup", same collision.
  Beekeeping gave nothing I'd defend.

### Questions for the team
- Visual: what is "secondary" in this brand? Fill vs keyline vs paper with
  navy ink, and does it hold up next to the navy `+` without competing?
- Visual: can the U-arc text stay legible at 50px on a 390px phone, and how
  small can "maybe smaller" go before it doesn't?
- Director: is F1b (sign in in place, then hop) in scope, or is the
  button's look the whole job this round?
- Director/owner: J6 (a visitor knows it's a playground) and J8 (sign-in in
  the normal signed-out app): in or out?

NEXT: product designer (visual focus) — the open core is what "secondary" and the ring-lettered U arc look like at 50px, and whether A, B, C and D hold up visually before the director steers.

## Turn 2: product designer (visual focus)

Read: owner's three quotes, `context.md`, `docs/owner-taste.md` (all), the
rejected still, the inspo (`project/`: hotel labels, park posters,
matchbooks), the `#accountBtn` CSS, turn 1 above.

Randomness drawn this turn (`SystemRandom`): fields **letterpress, coin
minting, bookbinding**; Oblique Strategies **"Work at a different speed"**,
**"What would your closest friend do?"**; constraint **"text only, no
glyph"**.

### Sketches (real size, then enlarged)
`concepts/sketches/arc-badges.html` → `arc-badges-3x.png` (1170 wide,
phone-readable; re-render with `node concepts/sketches/shoot.js <html> <png>`).
Every badge uses the app's real 50-unit scallop die and sits beside the real
navy `+`. Round 1 (top half) = first guesses; Round 2 = corrected.

What the sketches settled (facts, not taste):
- **The U arc reads at 50px, but only if the person shrinks.** With the
  person at today's size, the arc type is forced down to 6.6px and it reads
  as a smudge at 1x. With the person at ~10px (0.4 of the 24-unit glyph)
  sitting high, SIGN IN fits at **8px**, Archivo 700, 75% width, baseline
  r≈15.6 inside the scallop's valleys, and reads at real size. 9px also
  fits but crowds the rim. I now read the owner's "maybe smaller?" as *the
  icon* gets smaller, not the button: a 42px die (A2+) drops the type to
  ~6.7px and fails. **Keep the 50px die; shrink the glyph.** (Bonus: the
  button doesn't move or change size, so "controls don't move or grow" is
  free, and it shares the `+` badge's centre line.)
- **Baseline must clear the scallop valleys** (≈r 20 minus keyline). At
  r 17.4 the letters touch the rim; 15.6 is the working radius.
- **Dashed "vacant" person (D) dies at 1x** — the dashes turn to grit at
  10px. Killed as a glyph treatment. "Signed out" has to come from the
  badge, not from a broken-up person.
- **Blind/unstruck impression (A5, from coin minting / letterpress)** is
  lovely as an object and unreadable as a control (fails J1; "colour must
  communicate"). Killed as a resting state; kept as an *idea* for motion
  (below).
- **Text-only roundel (C, the forced constraint)**: SIGN IN running the
  whole ring puts half the words upside down across the top; reads as a
  seal, not a button, and drops the owner's person. Killed. What survives
  of the constraint: the words carry the meaning, the glyph is now the
  minor partner.
- **Patch band (A3+)**, the park-patch roundel with the lower U filled navy
  and SIGN IN reversed out: very legible and very "park patch" at 1x, but
  it's half navy, so it reads nearly as heavy as `+` (fails "secondary").
  The flat cut where the band meets the paper also fights the scallop.
  Keep only as the bold alternate if the director wants one.
- **Orange ink (A4+)** reads as a faded version of the signed-in badge:
  same colour, different state. Orange means "you / the action" here
  (account, star, +). Weak; I'd keep orange for the signed-in state only.

### What "secondary" is in this brand (answering turn 1's question)
Primary controls are **solid dies**: navy `+`, orange account. The
secondary version is **the same die cut from paper, printed in navy ink**:
`--paper-raised` face, navy keyline on the scallop, navy glyph and arc.
That's the grammar the app already uses for the row stamp (navy ink on
paper), so it isn't a new style, it's the existing print language at a
lower volume. Against the `+` it's clearly the quieter of the pair (less
ink area), and it can't be mistaken for the signed-in badge (no orange).
Keyline weight is still open: 1.4 units looks right at 1x but may need to
come down toward the `+`'s visual weight on device.

### Directions (mine, differ in kind)
1. **A, the ring-lettered paper die (owner's).** As above: paper face,
   navy keyline, ~10px person high, SIGN IN 8px on the U. Best
   current version: `A1+` in the sketch. Small whimsy that carries
   meaning, from the owner's own rule "ink is never identical twice": the
   arc gets a ±2° seeded tilt per device, the way the row stamp gets
   `stampTilt`, so it looks printed, not typeset. (Very small; drop if
   it reads as a bug.)
2. **The Strike (coin minting × turn 1's C, state as motion).** "Work at a
   different speed": the badge sits still and quiet until the state
   changes, then does one fast, physical thing. Sign-in success = the
   blank is *struck*: a quick press (scale ~0.92, very short), orange ink
   floods the die from the centre (the app's ink-bleed language), the arc
   letters dry up and the person grows back to full size. Logout runs the
   owner's approved **dry-up by thickness** in reverse: the orange dries
   back to paper and SIGN IN prints in. Same vocabulary as Visited: ink
   in = on, dry up = off. This is how I'd satisfy "state changes animate
   wherever they come from" without inventing a new motion style. A coin
   *flip* (rotateY to an orange obverse) was the obvious version: rejected,
   it's a slide/turn, and the owner said "stamp, don't draw or slide".
3. **The friend's version (Oblique: "what would your closest friend
   do?").** A friend greets you by name. Two people sign in to this app,
   so the *signed-in* die could carry the initial (A / E) instead of the
   generic person, and the signed-out die is the generic person + SIGN IN.
   Then the generic person literally means "nobody yet". It touches the
   signed-in badge, so it's a scope question for the director, not a
   proposal for this round.
4. **Trail register (turn 1's B), relocated.** "PLEASE SIGN IN" does not
   fit the U at a readable size (14 characters needs ~6px). The register
   idea belongs in what the tap opens: the sign-in sheet styled as a
   register page (ruled NAME / PASSWORD lines, the app's printed labels,
   no typewriter face). The button stays A. Bigger scope; flag only.
5. **Playground strip (turn 1's D)**: visually I'm against a strip
   (owner: no extra header height, no second row of text). If J6 matters,
   the cheaper place for it is one printed line in the sign-in sheet, or
   in the share link's preview, not on the map's chrome.

Killed this turn: dashed person, blind emboss as a resting state,
text-only roundel, orange-ink paper die, 42px die, coin flip, a bookbinding
ribbon tail (collides with the tag's string), the ex-libris "this trip
belongs to ___" plate (a second row of text).

### States the concepts must draw (for the next pass)
Rest; pressed (paper → `--paper-pressed`, ink stays navy; mirrors how
filled buttons step); focus-visible ring; signed-out → in (the Strike);
signed-in → out (dry-up); signed in at rest (today's orange die) with its
dropdown; 320px-wide phone (the die doesn't shrink, so the arc survives;
needs a check that nothing else in the top bar collides); dark map tiles
(paper die stays legible: it carries its own face, unlike a transparent
outline).

### Open questions
- Director: is the Strike (motion) in scope this round, or only the resting
  look? It's what makes A feel like part of the app rather than a sticker.
- Director: the friend's initial on the signed-in badge: in or parked?
- Keyline weight and whether the person is outline (as today) or a solid
  silhouette at 10px; I need a device-real check, my 3x render is
  Chromium.
- Does the paper die read as a *button* on a pale map? The 1px offset
  shadow carries it in the sketch; the owner has said "the 1px hard edge
  to add shadow definition is fine".

NEXT: design director — four sketch-backed findings narrow A to one
workable size/type spec, and the open calls (motion in scope, the signed-in
initial, the register sheet) are steering calls, not design ones.

## Turn 3: design director

Read: owner's three quotes and `owner.md`, `context.md`, `docs/owner-taste.md`
(all), the rejected still, the inspo (`project/`, the Savoy label and park
posters especially), the arc sketch sheet, turns 1 and 2.

Randomness drawn this turn (`SystemRandom`): fields **theatre box office,
railway ticketing**; Oblique Strategy **"Remove specifics and convert to
ambiguities"**; constraint **"no text in the resting state"**. What they gave
is at the end (one kill, one keeper).

### The reading we're building on (say it once so nobody drifts)

"It should just have a sign in button" + "a secondary style for that button"
+ the person-with-arc idea: **the badge in the corner is the sign-in button.**
One control, one tap, no dropdown while signed out. Turn 1's structure (one
slot, two states, `+` never moves) is adopted. We are not asking the owner to
confirm this reading; the concepts show it and he reacts to pictures. If a
concept needs a menu, it has to earn it.

### Where the sketches are right, and where I'm pushing back

1. **Keep the 50px die, shrink the person, 8px arc type.** Agreed; it's the
   only version on the sheet that reads at 1x, and it gets "controls don't
   move or grow" for free. A1+ is the working base for A.
2. **"Secondary = the same die, paper face, navy ink."** Agreed as the
   grammar, and it is shared by every concept, not a concept of its own
   (turn 1's C folds in here). Orange stays the signed-in state only.
3. **Kill the ±2° seeded tilt.** This is the most important steer of the turn.
   A round navy-ink mark on paper with caps on an arc, slightly rotated, *is
   a rubber stamp*, and the app's navy rubber stamp already means VISITED.
   Owner, verbatim: "only the clerk's entries are stamped; the form's own
   words are printed." A sign-in button is the form's own words. It's
   **printed**: crisp, upright, untextured, no tilt, no dotted ring, no 82%
   ink. Whatever is done to the edge, it must not drift toward `.row-stamp`.
   (Visual: put the A1+ badge next to a real `.row-stamp` at 1x in the next
   sheet and prove they don't read as siblings.)
4. **The scalloped navy keyline is the noisiest thing on the sheet.** At 1x
   A1+ is ~150px of wiggling navy line around a small mark; next to the
   `+`, the sign-in badge has *more* edge activity than the primary. That
   breaks "secondary marks never outrank content" from the other direction:
   quiet in fill, loud in outline. Explore, on the same sheet: (a) a thinner
   keyline (≤1 unit) in navy at reduced weight, (b) no keyline, the paper die
   defined only by the 1px warm edge + the shadow the `+` already has (owner:
   "the 1px hard edge to add shadow definition is fine"), on both the cream
   map and a dark-tile map. My bet is (b) or something near it, but it's
   visual's call; I'll score what the pictures show.
5. **Glyph and arc are one drawing.** The 10px person and 8px caps must share
   one stroke weight and the "lightly rounded" icon language. The owner is
   about to do a full icon revision ("too noisy"); a new person glyph that
   looks like a different hand is the first thing he'll see. Draw the person
   as the existing account glyph scaled, then check the stroke reads at 1x;
   if it doesn't, a solid silhouette is allowed, but only if it still reads
   as the same person as the signed-in badge.
6. **The patch band (A3+) stays dead for A's resting state.** Half navy ≈ as
   heavy as `+`.

### Concepts going into the build pass: two, differing in kind

The owner asked for "some concepts" and also said "fewer variations". Two
strong ones beat five siblings.

- **A. The arc badge (owner's, must ship as a concept).** A1+ plus the
  steers above. Built to final-looking quality at 1x and 3x, beside the
  real `+` on the real map.
- **B. The printed label (the conventional benchmark, and it may win).** Not
  a badge at all: a small die-cut paper label to the left of the `+`, the
  height of the `+` or less, reading **Sign in** in the app's printed
  label type with the small person leading. Think the hotel labels' little
  secondary banners, not a web pill. Why it's here: it's the answer a good
  designer gives when the words matter most, and it's the honest test of
  whether the arc is whimsy that carries meaning or whimsy that costs
  legibility. Constraints: its right edge sits where the badge's does, it
  grows *leftward* only, `+` never moves; the swap to the round signed-in
  badge is a shape change, so B must show that change as a stamp-style
  state change, not a morph or a slide.

Not going forward as concepts: the register sheet, the patch band, the
playground strip, origami/tag variants, the text roundel (all as killed in
turns 1–2).

### Scope this round (decided)

- **In:** resting look; pressed; focus-visible; signed-in at rest (today's
  orange die, unchanged) beside it so the pair reads as one state system; 320px
  and 390px widths; cream map and a dark-tile map. **The tap's outcome as a
  flow (turn 1's F1b: the existing sign-in modal opens over the playground;
  cancel keeps everything; success then goes to the real app).** F1b is the
  structure for both concepts. Builder-feasibility is a later question; if
  F1b turns out impossible we fall back to F1a and it doesn't change the look.
- **In, as a 3–4 frame storyboard only (not built motion):** the state change
  out→in. Note where it actually plays: in the playground a successful
  sign-in leaves for the real app, so the visitor never sees the badge flip
  in place. It plays **on arrival** in the real app (paper die loads, then is
  struck orange) and, if the owner says yes to Q1 below, in place in the
  normal app. The Strike (turn 2) is the right family, but reuse the
  star/visited stamp grow-shrink timing; don't invent a new curve. The out
  direction is the owner's approved dry-up by thickness, reversed in role
  (orange dries off, the printed arc appears). Storyboard both directions,
  since the owner wants motion "both ways".
- **Out this round:** the register-styled sign-in sheet (bigger than a
  button, and the owner asked for a button); a playground notice; F1c
  ("you're already signed in on this device"); restyling the existing modal.
- **Parked, not proposed:** the friend's initial (A / E) on the signed-in
  badge. Good idea, and it would make the generic person mean "nobody yet",
  but it changes a shipped control the owner didn't raise. It goes in the
  owner message only as a one-line "later?" if he's otherwise happy.

### What the random draws gave
- **Theatre box office / railway ticketing:** a ticket you punch to get in.
  Killed: it would be a third paper object (tag, stamp/sticker, now ticket)
  and punch holes are a new mark language right before an icon revision.
- **"Remove specifics" + "no text at rest":** the inverted concept (a bare
  hollow person, words only on press) fails J1 and the owner's own "sign in"
  on the circle, so it's dead as a concept. What survives is a rule: **the
  signed-out person must be generic and faceless**, the least specific mark in
  the app. Specificity (orange, a name, an initial) is what signing in earns.
  That's the one-line story for both concepts: *blank paper until you're
  someone.*

### Questions for the owner (genuinely his; orchestrator to batch with the concepts, not send now)
1. When you're signed out of the **real** app (new phone, cleared Safari),
   should the same sign-in button sit in that corner? Today there's nothing
   there until you try to edit.
2. Should the playground tell visitors their changes aren't saved (one line
   somewhere), or is that unnecessary for the people you share with?

### Owner objections I'm already expecting (for the scoring pass)
- A: "the letters are too small / I can't read it" on his phone at 1x.
- A: "it looks like the visited stamp" (why the tilt is killed).
- Both: "why is sign-in louder than +" if the keyline stays heavy.
- B: "that's just a button" if it lacks the label character.
- Both: a visitor seeing SIGN IN they can't use; the modal copy must handle
  that gracefully, it's part of the flow frames.

NEXT: product designer (visual focus) — the steers (no tilt/printed not
stamped, keyline weight, one drawing language, concept B's label) are all
visual, and need a new sheet before systems maps the flow frames onto them.

## Turn 4: product designer (visual focus), pass 2

Steers taken from turn 3: printed not stamped (no tilt), the rim's
loudness, one drawing hand, concept B the printed label, the storyboard.
New sheets in `concepts/sketches/` (390 wide, 3x):
- `pass2-look-3x.png`: A edge study on a cream and a dark-tile map; A next
  to the real VISITED stamp (cropped from the app); glyph weights; B in
  three shapes on both maps and at 320px; states for both.
- `pass2-motion-3x.png`: storyboards out→in and in→out for A and B.
- Shared drawing code: `lib.js` (badge, label, map strip), `page.css`.

### A, the arc badge: what the sheet decides
- **Rim: none.** The navy keyline at any weight (1.4, 0.8, 0.7 at 50%) is
  ~150px of wiggling line, and it's the busiest thing in the corner. The
  thin and 50% versions are only quieter versions of the same noise. With
  **no keyline**, the paper die is held by the warm 1px edge
  (`rgba(107,74,40,.22)`, the sticker's approved edge) plus the same 1px
  offset shadow the `+` already has. That reads as a cut paper label on the
  cream map, and on dark tiles it reads clearly with no line at all. Turn
  3's bet (b) is right.
- **Printed, not stamped: it passes once the rim is gone.** Next to the
  real VISITED stamp at 1x they don't read as siblings. The stamp is
  an oval ring with a dotted track, slightly faded navy, tilted; A is a
  scalloped paper die, upright, flat full-strength navy print, no ring. The
  stamp-like part was the keyline (a ring of navy around caps); removing it
  also removed the family resemblance. No tilt, no texture, no 82% ink.
- **One drawing hand: an outline at 1.4px.** It's the account glyph scaled to
  0.42. At 1.4px rendered its stroke matches the 8px caps' stem; 1.15 looks
  a touch lighter than the letters, and 0.8 (pass 1) clearly so. The solid
  silhouette reads as a different person from the signed-in badge's
  outline person, so I'm killing it. Same person, smaller and lighter: that
  is the "blank paper until you're someone" story.
- Spec as it stands: 50px die, `--paper-raised` face, warm 1px edge, the
  `+`'s 1px shadow; person = account glyph ×0.42 at (25, 17.6), 1.4px
  stroke; SIGN IN Archivo 700 75% 8px, letter-spacing 0.5, on the U arc
  r 15.6; all navy, full strength.

### B, the printed label: three shapes, one killed
All three are 32px tall with the right edge where the badge's is, growing
leftward; `+` never moves. 12.5px label caps with a 12px person at the same
1.6px stroke.
- **Rounded rectangle: kill.** It's a web button with paper colour; it
  invites exactly "that's just a button".
- **Hotel-label banner (notched tail on the left): my pick for B.** One
  notch, calm straight edges, the most "label" of the three; the notch
  points away from `+`, so the label reads as attached to that corner.
  Hotel labels' small banners are the inspo for it.
- **Scalloped capsule** (same lobe pitch as the dies): family with the
  badges, but ~250px of wiggling edge; the same objection as the keyline,
  softer. Keep as B's alternate only if the director wants the family tie.
- 320px: fine; the label ends far from the zoom control.
- **Honest trade-off:** B's 12.5px caps are far easier to read than A's
  8px arc; that's the whole case for B. Against it: on dark tiles B is the
  biggest bright shape in the corner (92×32 of paper vs the `+`'s ~42 navy
  disc), so it risks outranking `+`. It's a candidate to shrink to 28px tall
  if it goes forward.

### States (both)
Pressed: face → `--paper-pressed`, ink stays navy (the sheet shows it
reads). Focus-visible: a 2px navy outline following the die/label at ~3px
out; it's heavy, but only shown on keyboard focus. Signed in: today's
orange die, unchanged.

### Storyboards (stills, not motion)
- **A in: the Strike.** STAR_POP's grow-shrink (380ms), scale only, no
  spin, peak capped ~1.12 (1.4 would touch `+`; 8px gap between the dies).
  Orange ink lands from the centre on the press, the printed arc is
  overprinted away, the person grows from ×0.42 to its signed-in size. One
  object changing its ink: it reads naturally.
- **A out: dry up by thickness** (the approved un-visit curve, ~450ms with
  the snap): thin lobes dry first, the centre last; the printed arc and the
  small person are underneath and simply revealed. No pop.
- **B in:** the label's print dries off while the round die is struck down
  over its right end. **B out:** the die dries up and the label prints back
  in beneath. Note: in my B-out frames the drying die leaves a paper disc
  over the label; that's a sketch artifact. In B the die must dry to
  *nothing*, because there's no paper die under it. Even fixed, B's motion
  is two objects swapping where A's is one object changing state. Point
  for A, for whoever scores.
- Where it plays (turn 3, agreed): on arrival in the real app after a
  playground sign-in; in place in the normal app only if the owner says yes
  to Q1.

### Open questions
- A's 8px arc on the owner's phone is still the expected objection. If he
  says "too small", the next move is 8.5px with the person at ×0.38, not a
  bigger die.
- B's height: 32 vs 28 (vs `+` dominance on dark tiles).
- Chromium-only renders; the 1.4px stroke and the warm edge want a phone
  look before the owner sees them.

NEXT: product designer (systems focus) — the look of both concepts is now
pinned enough to map the flow frames (F1b modal over the playground,
cancel, success → arrival strike, the visitor who can't sign in) onto A and B.

## Turn 5: product designer (systems focus), pass 2

Read: turns 2 to 4, `pass2-look-3x.png`, `pass2-motion-3x.png`, and the code as it
is now on this branch: `#authModal` markup (~l.2545), its scrim (~l.2119),
`checkAuth()`/`updateAuthUI()` (~l.2976), the playground `logout()` hop
(~l.3056), the `?signin` handler (~l.9101), and the modal handlers (~l.8472:
Login, Cancel, tap on the scrim closes, Enter in the password field submits).

Adopted from the director's turn: the badge in the corner *is* the sign-in;
no dropdown while signed out; F1b is the structure; the out→in strike plays
on arrival. Below, every state is mapped onto A (arc badge) and B (printed
label). Most of the flow is shared, so it comes first; then the places where
A and B differ. **Bold** = something the sketches or the current code don't
handle yet.

### 1. The control at rest and under the finger (shared unless noted)

| State | A, arc badge | B, printed label |
|---|---|---|
| Rest | 50px paper die left of `+`, same centre line | label 32 (or 28) tall, right edge at the die's, grows leftward |
| **Hit area** | 50×50, fine | **32px tall is under the 44px floor.** The button box must be 44 tall with the label drawn centred inside, otherwise it's a miss-prone strip on a phone. The extra height is transparent, so the look doesn't change. |
| Pressed | face → `--paper-pressed` on touch-down; ink stays navy | same |
| Press, then slide off | no action, face returns (standard button cancel) | same |
| Focus-visible | 2px navy outline ~3px out, keyboard only | same; follows the notch |
| Accessible name | `aria-label="Sign in"`, arc `aria-hidden` | the text is real text, no extra label needed |
| While a tag / add form / plan panel is open | control stays put and live; the modal opens over everything (scrim z 3000 > chrome 2000) | same |
| Before auth resolves (normal app) | **render nothing in the slot until `checkAuth()` returns** (today's behaviour). Otherwise every cold load of a signed-in app would flash the paper die and then strike or snap to orange. | same, and it matters more: B would flash a label and then swap shape |

### 2. The flow: playground tap → modal → outcome (shared)

```
[badge/label] --tap--> modal over the playground (map, open tag, filters, edits all intact)
   |-- Cancel / tap the scrim / Esc --> modal closes, focus back on the control, nothing lost
   |-- submit --> "Signing in…" (button disabled, fields locked)
          |-- success --> leave for the real app (?arrived) --> strike on arrival
          |-- wrong email/password --> inline error, stay in the modal, still in the playground
          |-- can't reach the server --> inline error, stay, the playground keeps working
```

**Modal copy (the current copy is wrong in this flow).** Today it says *"Login
Required. You need to log in to make changes. Anyone can view…"* In the
playground that's false (visitors *can* make changes) and it isn't
"required" (they chose to tap). It also says Login while the control says
SIGN IN. Restyling the modal is out of scope; its **words** aren't, because they
are the flow. Proposal for when it's opened from the control (the wording is
for visual/director to tune):

- Title: **Sign in** (not "Login Required"). The submit button reads **Sign in**.
- Playground body, one line: *"For the trip's owners. Signing in opens the
  real trip; nothing you changed here is kept."* That one line answers the
  visitor who can't sign in, and J6/J7 (that changes here aren't kept), with
  no new chrome on the map. It's not the playground notice the director
  ruled out; it's only seen by someone who asked.
- Playground cancel button: **Keep playing** (the visitor's real exit, said
  as what it does). Normal app: Cancel.
- The edit-triggered modal (someone signed out tries to edit in the normal
  app) keeps today's "you need to sign in to make changes" meaning, but says
  "sign in", not "log in".

**Success → arrival (the part the storyboard needs a plumbing note for).**
1. In the playground, sign-in has to go through a client that saves the
   session (the playground's own client has `persistSession: false`). That
   question is for the builder; if it can't be done, fall back to F1a (hop
   first, the modal opens in the real app), which looks the same.
2. Navigate to the real app with a one-shot marker (`?arrived`, or a
   sessionStorage flag). **Keep the map view across the hop** if it's cheap
   (centre/zoom, and the open tag if there is one): the owner tapped Sign in
   while looking at something, and should land looking at it.
3. The real app loads, `checkAuth()` resolves signed in, and the control
   first paints **in its signed-out look** (A: paper die; B: label). It
   holds for a beat (~250ms after the map's first paint, so the eye has
   landed), then the strike plays. Then drop the marker
   (`history.replaceState`), so a reload or Back never replays it.
4. `prefers-reduced-motion`: no strike; it paints signed-in directly.
5. If the marker is present but the session isn't (the sign-in expired
   during the hop, or storage is blocked in a private tab): paint
   signed-out, no strike, open the sign-in modal once. Never strike into
   a state that isn't true.

**Wrong password.** Inline error under the fields in plain words (*"That
email and password don't match."*, not Supabase's raw "Invalid login
credentials"). The email is kept, the password is cleared and focused.
The control behind doesn't change. **There is no busy state today**, so a
double tap on Login sends twice; the submit should disable while it's
waiting.

**Offline / server unreachable.** *"Can't reach the sign-in server. Check
your connection."* The modal stays open and the playground underneath keeps
working off its in-memory copy. (If the device was offline from the start
the playground never loaded, so that case belongs to the app's existing
load error, not here.)

**The visitor who can't sign in.** Taps it because it's there. Reads the one
line, taps Keep playing, and has lost nothing. If they type something anyway,
they get the wrong-password error. Only the two owners have accounts, so
there's no case where a stranger succeeds. (If a third Supabase account ever
existed, it would arrive in the real app "signed in" with every write refused
by RLS; that's out of scope, noted for the record.)

### 3. The normal app (all of this hangs on owner Q1)

- **If Q1 = yes (the control shows when signed out in the real app):** tap →
  the same modal (normal copy) → success **in place**, no hop → strike in
  place. Logout from the dropdown → the dropdown closes first, then the
  dry-up → the paper die/label. Both directions are visible, which is what
  the owner's "both ways" asks for.
- **If Q1 = no (today: nothing in the slot when signed out):** the in-place
  strike never happens, and **logout has nowhere to dry up to**. A's
  storyboard ends on a paper die that wouldn't exist; it would have to dry to
  *nothing*, which is the same "the die must dry to nothing" rule turn 4
  found for B. Director: the out storyboard in `pass2-motion` is only true
  if Q1 is yes. The owner's answer to Q1 decides which out-motion we show
  him, so it's worth asking with the concepts, not after.

### 4. Sizes and conditions

| Condition | A | B |
|---|---|---|
| 390px | fits; 8px arc is the known legibility risk | fits |
| 320px | same 50px die; corner layout unchanged (zoom left, two dies right); nothing collides | label left edge ~x154, clear of the zoom control |
| iOS larger text | arc is fixed SVG text and won't grow, which is fine since the aria name covers it | **label text would grow leftward with Dynamic Type; cap it** (the control's size is fixed; "controls don't move or grow") |
| Landscape / short viewport | unchanged; the modal scrolls if the keyboard covers it (existing modal behaviour, worth one check with the keyboard up) | same |
| Dark tiles | paper die holds itself up | biggest bright shape in the corner; the dominance risk turn 4 named |
| Standalone (home screen) | uses `--chrome-top-inset` like today | same |

### 5. Where A and B actually differ, systems-wise

- **One object vs two.** A changes ink on one object in both directions. B
  swaps a label for a disc, so it needs two objects in the DOM (or one that
  changes shape), its out-motion has to dry the disc to nothing while the
  label prints in, and the on-arrival paint has to start from the label.
  More states, more ways to glitch (a half-drawn label under a half-dried
  disc). Systems cost: A is lower.
- **The signed-in dropdown.** It hangs at `right: 74px`, `top: 74px` under
  the round die. With A the signed-in and signed-out controls share one
  footprint; with B the signed-out footprint is wider, but the dropdown only
  exists signed in, so it's unaffected. Neutral.
- **Legibility vs J1.** B wins outright: 12.5px words. A's 8px arc is the
  job risk. If the owner reads it on his phone, J1 passes; if not, the
  fallback turn 4 named (8.5px, person ×0.38) is the move, and I'd want it
  pre-rendered so the second round is fast.
- **J4 (doesn't out-shout `+`).** A passes on the sheet (less ink than `+`).
  B passes on cream; on dark tiles it's the open risk.

### Job coverage so far (jam-level, not the formal 9+ check)

| Job | A | B |
|---|---|---|
| J1 find it, see it's sign-in | yes, if 8px reads on device | yes |
| J2 looks signed out | yes (paper vs orange) | yes (label vs disc) |
| J3 playground → real app signed in | F1b + arrival, shared | same |
| J4 secondary to `+` | yes | cream yes; dark tiles at risk |
| J5 signed-in control in the same place | yes, same footprint | yes, the die sits at the label's right end |
| J6 know it's a playground | partial: only through the modal line | same |
| J7 don't lose work by surprise | yes: Cancel/Keep playing loses nothing; the line warns before success | same |
| J8 sign in from the normal app | waits on Q1 | waits on Q1 |
| J9 comfortable tap | yes (50px) | **only with the 44px hit box** |

### For the next turn
- Visual: the modal copy lines above, in your type, once. B's 44px hit
  box is invisible, so no new drawing, but check that the label still
  centres on the `+`'s centre line inside it.
- Director: (1) do the modal words come into scope with the flow (I think
  they have to: the visitor-who-can't case is carried entirely by them);
  (2) send the out-motion storyboard to the owner only after Q1, or show
  both endings; (3) keep-the-map-view-across-the-hop: in or later?

NEXT: design director — the flow mapping turned up three steering calls (modal copy in scope, the out-motion depends on owner Q1, keeping the map view across the hop) and an A-vs-B systems-cost read that belong to the director before the jam closes and I write `jobs.md`.

## Turn 6: design director, pass 2 (closes the jam)

Read: turns 4 and 5, `pass2-look-3x.png`, `pass2-motion-3x.png`.

### What I'm taking from the sheets
- **A's rim: none. Agreed.** On both maps the no-keyline die is the calmest
  thing in the corner, and it's held up by the warm edge and the `+`'s shadow
  without a navy ring. The thin and 50% rims were just quieter noise.
- **Printed, not stamped: passes.** Side by side at 1x, A and VISITED don't
  read as siblings once the ring is gone.
- **Person at 1.4px outline, solid killed: agreed.** The same person as the
  signed-in badge, smaller. Story intact.
- **B = hotel-label banner (notched tail).** The rounded rectangle and the
  scalloped capsule are dead. The capsule had the keyline's problem at
  250px of edge; the rectangle is "that's just a button".
- **B at 28px drawn, inside a 44px hit box** (turn 5 is right; 32 drawn on
  dark tiles is the biggest bright thing in the corner). Text size capped,
  so it can't grow with Dynamic Type.
- **The storyboards are in the right family.** A's strike reads as one
  object getting inked; its dry-up reads like the approved un-visit. B's
  motion is two objects trading places. It's legible, but that's a real cost:
  more frames, more ways to glitch. I'm noting it for scoring, not killing B
  for it. Fix the B-out artifact turn 4 named: the disc dries to nothing,
  with no paper disc left over the label.

### Rulings on turn 5's three calls
1. **Sign-in modal wording: in scope. Its look: still out.** The visitor
   who can't sign in is carried entirely by those words, so they're part of
   the flow, not a restyle. In scope: title **Sign in**, submit **Sign in**,
   the playground's one line, **Keep playing** as the playground cancel,
   the plain-words wrong-password and offline errors, and the busy state
   ("Signing in…", button disabled). Everywhere the app says "log in" it says
   "sign in". Tighten the line to one short sentence on a phone. Turn 5's
   draft is close: *"Only the trip's owners can sign in. Your changes here
   won't be kept."* Visual sets it in the modal's current type; UX/visual can
   tune the words. The edit-triggered modal in the normal app keeps its
   meaning, reworded to "sign in".
2. **Sign-out storyboard vs owner Q1: show one ending, and say which.** The
   team **recommends yes on Q1** (the same control in the corner when
   signed out of the real app). It's the "clear, matching state system" the
   owner keeps asking for: one slot, two states, everywhere, and it gives
   logout somewhere to dry up *to*. The out storyboard is drawn for that
   answer, captioned as such. If he says no, logout dries to an empty slot.
   That's the same motion with nothing printed under it, a one-line change,
   not a new concept. **So Q1 doesn't block concept work.** It goes with
   the concepts, phrased as our recommendation for him to confirm.
3. **Keep the map view across the jump: build, not concept.** It's right
   (land looking at what you tapped from) and invisible in a still. It goes
   in `jobs.md` and the eventual handoff as "do it if cheap; if it isn't,
   flag it, don't drop it silently". No stills for it.

### Other rulings
- **No paint until auth resolves** (turn 5): adopted for both concepts. A
  flash of the paper die before every signed-in load would be a bug that
  looks like design.
- **Arrival strike:** the ~250ms hold after first paint, the one-shot marker
  cleared with `replaceState`, no strike under reduced motion, and never
  striking into a state that isn't true: all adopted as written.
- **The double-submit busy state:** in (it's part of the wording ruling).
- **A's fallback (8.5px arc, person ×0.38):** render it for *us*, so round
  two is fast if the owner says "too small". **Don't** put it on the owner's
  sheet ("fewer variations").
- **The signed-in badge and its dropdown:** unchanged in both concepts. The
  initial (A/E) stays parked.
- **Owner questions that block concept work: none.** Q1 (with our
  recommendation) and Q2 (tell visitors changes aren't kept?) go with the
  concepts. Turn 5's modal line half-answers Q2 already. Ask Q2 as "is the
  line in the sign-in sheet enough, or do you want something on the map?"
  so he's reacting to something real.

### What the concept phase produces
Two concepts, **A arc badge** and **B hotel-label banner**, each on its own
phone-readable sheet (1170 wide, 3x, real-size crops first, enlargements
second), plus **one shared flow sheet** (the flow is identical for both;
don't draw it twice).

Per concept sheet, at final-looking fidelity for the control (exact spec,
real tokens, real `+`, real map):
1. The top of the real app at 390px: map, zoom, the control beside `+`.
   Cream tiles and dark tiles. Render the actual page with the concept
   applied to a copy of `index.html` via `signin-test.js`, not a redrawn
   mock, so what the owner sees is what gets built.
2. The control enlarged, next to the signed-in orange badge (the pair as
   one state system), with pressed under it. Focus-visible is for our
   records only, not the owner's sheet.
3. 320px, one frame.
4. The motion as stills: out→in (the arrival strike) and in→out (dry-up,
   captioned "if sign-in also lives in the real app (recommended)"). Five
   frames each at most, with timings in the captions.

Shared flow sheet, real app rendering with the new words:
the playground with the modal open over a tag (title, one line, Keep
playing / Sign in); the busy state; the wrong-password error; the arrival in
the real app, signed-out paint → struck. Four or five frames.

Owner-facing text on the sheets: plain, short, no team jargon ("F1b",
"J4", "die" mean nothing to him; say "badge", "label", "sign-in sheet").

Not produced: any variant of A or B beyond the one spec each; the register
sheet; a map notice; the map-view hop.

### For the scoring round (so nobody's surprised)
I'll score A and B against the objections I listed in turn 3, which still
stand: A's 8px arc at 1x on a phone (the deciding one), stamp
resemblance (now cleared), loud vs `+` (A cleared; B on dark tiles open),
B "just a button" (the banner helps), and the visitor who can't use it (now
carried by the wording). B also has to show its two-object motion doesn't
glitch.

NEXT: product designer (systems focus) — the jam is closed; write `jobs.md`
from turns 1–6 (jobs, the flow, the modal words, the build-only notes like
the map view and no-paint-until-auth) so the visual designer builds the
three sheets against an agreed list.
