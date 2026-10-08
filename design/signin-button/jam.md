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
