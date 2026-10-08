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
