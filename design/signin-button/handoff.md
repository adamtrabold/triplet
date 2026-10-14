# Sign-in badge: handoff

**Status:** concept A, round 2e, approved by the owner on 2026-10-14:
"Sign in is great". Next step: build (lane 2: one builder, then one
combined CD + UX check).

**Settled before this handoff**
- Signed out, the app is the playground ("Playground becomes the signed-out
  app", `docs/shipped.md`). The mode is fixed at boot from the stored
  supabase-js session (`PLAYGROUND`), and signing in or out reloads into the
  other mode.
- Signed out, this badge sits in the account badge's corner. So Q1 is
  answered by the product: the badge shows whenever you're signed out.
- Signed out = V[14] in `concepts/A-arc-badge/round2/badge2.js`. Signed in =
  today's account badge, unchanged.

**Sources:** `owner.md` (the owner's words), `jobs.md` (jobs 1 to 9, the
flows), `scores.md` (rounds 2d and 2e), `concepts/A-arc-badge/round2/README.md`
(rounds 2d and 2e), and `concepts/A-arc-badge/round2/sheet-2e-3x.png` (the
stills the owner approved, motion included).

---

## How it works (systems)

### Structure
- **One slot, two states.** The badge is `#accountBtn`: one button, in the
  same place, in both states. Only its content and behaviour change.
  - **Signed out (the playground):** the sign-in badge (V[14]). A tap opens
    the sign-in sheet directly. There is no dropdown.
  - **Signed in (the real app):** today's account badge (navy, orange person)
    and today's dropdown (your email, then **Sign out**, renamed from Logout).
    It turns orange only while the dropdown is open (`.active`), as today.
- **Position:** `#accountBtn`'s spot (today `right: 74px`, left of `+`). The
  signed-in badge takes exactly the same spot, so nothing moves when the state
  changes. **Dependency:** the + is being redesigned by another team, and the
  owner may move it to the left corner. If + leaves the top-right, where this
  badge settles (stay at 74 or move to 16) is the + team's layout call, made
  with the visual designer. It is not a change to this spec: both states move
  together.
- **Taps:** the whole 50×50 button is the target in both states (job 9). The
  small drawing doesn't shrink the tap area.
- **Nothing else changes.** `+`, the zoom control, the list and the tag stay as
  they are. The dropdown is never shown while signed out.

### States

| State | When | What the slot shows | Tap / keys |
|---|---|---|---|
| **Auth unknown, real mode** | boot with a stored session, before `checkAuth()` resolves | **nothing** (the button stays hidden) | n/a |
| **Signed out, rest** | the playground, from first paint (the mode is known synchronously, so there's no wait) | the sign-in badge | tap / Enter / Space → opens the sheet |
| Signed out, pressed | touch-down / mouse-down | pressed face (visual), ink unchanged | sliding off before release cancels (native button) |
| Signed out, focus-visible | keyboard focus only | a visible focus ring (look: visual). **Builder:** the button is masked, so an `outline` or `box-shadow` on it is clipped away. Draw the ring outside the mask | Enter / Space opens the sheet |
| Signed out, hover (desktop) | pointer over | pointer cursor. Any hover look is the visual designer's call; systems needs none | |
| Signed out, sheet open | sheet showing | the badge at rest under the scrim | n/a (the scrim covers it) |
| **Signed out, real mode** (rare) | real mode, but `checkAuth()` resolves with no user and no reload follows (for example an expired session that can't refresh while offline) | the sign-in badge | opens the sheet in its real-app form; success happens **in place** (see Flows) |
| **Arrival** | real mode, first boot right after a playground sign-in | the sign-in badge → the Strike → the signed-in badge | see Flows. A tap during it finishes it at once, then acts as the account badge |
| **Signed in, rest** | real mode, user known | today's account badge | tap → dropdown |
| Signed in, dropdown open | | today's `.active` look | tap the badge or outside → closes |
| **Departure** | right after Sign out succeeds | the signed-in badge → the dry-up → the sign-in badge, then the reload | taps ignored (≤540ms) |

Accessible names:
- Signed out: `aria-label="Sign in"`, `aria-haspopup="dialog"`.
- Signed in: `aria-label="Account"`, `aria-haspopup="true"`, and `aria-expanded`
  that follows the dropdown (missing today, so add it).
- The drawing (person and arc) is `aria-hidden`. The label swaps when the state
  swaps: at the end of the Strike or the dry-up, never partway through.

### The sign-in sheet (`#authModal`: new words and behaviour; its look is unchanged)

| Part | Playground (from the badge) | Real app, from the badge (rare) | Real app, from an edit or the tag's slip (rare) |
|---|---|---|---|
| Title | Sign in | Sign in | Sign in |
| Line | Only the trip's owners can sign in. Your changes here won't be kept. | (none) | You need to sign in to make changes. Anyone can view places and plans. |
| Fields | Email, Password | same | same |
| Primary | Sign in | Sign in | Sign in |
| Secondary | Keep playing | Cancel | Cancel |

Everywhere: "Login Required" / "Login" / "Logout" / "log in" become "Sign in" /
"Sign out" / "sign in" (the modal, `#logoutBtn`, `#dropdownLogoutBtn`, and any
error or helper copy). The tag's slip already says "Sign in". UX may tune the
words, but the table's structure stays.

Behaviour (applies to all three forms):
- **Opening:** the scrim and the sheet show. Focus goes to Email, and iOS can
  offer saved passwords. Behind the sheet nothing changes: the map, the open
  tag, the filters and the playground edits all stay.
- **Dialog semantics:** `role="dialog"`, `aria-modal="true"`, labelled by the
  title. Tab stays inside the sheet. The error line is a polite live region.
- **Back out:** the secondary button, a tap on the scrim, or **Esc** (missing
  today, so add it) closes the sheet. Focus returns to the badge. The fields
  are cleared, as today. Nothing else is lost (job 6, job 7).
- **Submit:** the Sign in button, or Enter in Password.
  - Empty field: *"Enter your email and password."* Focus moves to the first
    empty field. No request is sent.
  - **Busy:** the primary reads **"Signing in…"** and is disabled. The fields
    become read-only, and the secondary, scrim and Esc do nothing while busy.
    A sign-in that's already in flight can't be abandoned: if it succeeds, the
    session is stored and the page reloads anyway, so offering "Keep playing"
    then would be a lie. Today there's no busy state, so a double tap submits
    twice.
  - **Wrong email or password** (Supabase "Invalid login credentials"):
    *"That email and password don't match."* Busy ends, the email is kept,
    and the password is cleared and focused. Never show the raw Supabase
    message (today `error.message` is shown).
  - **Can't reach the server** (a network error, or no answer within 15s):
    *"Can't reach the sign-in server. Check your connection."* Busy ends, both
    fields are kept, and the playground keeps working.
  - **Too many tries** (429): *"Too many tries. Wait a minute, then try
    again."* Fields kept.
  - **Anything else:** *"Sign-in didn't work. Try again."* Fields kept.
  - **The browser won't store the session** (the sign-in succeeds but the
    session key isn't in `localStorage` afterwards; storage is blocked): don't
    reload, because it would boot into the playground again and look like
    nothing happened. Show *"This browser isn't letting Triplet keep you
    signed in. Allow website data for this page, then try again."* Busy ends.
- **Success:** see the flows below.

### Flows

**1. Sign in from the playground (the main flow)**
1. Tap the badge → it shows pressed → on release the sheet opens (playground form).
2. Enter the email and password and submit → busy.
3. Success → write a **one-shot hop marker** to `sessionStorage`
   (`{ dir: 'in', view }`; for `view`, see "Land where you were") **before**
   the reload, then reload. **Builder:** the playground's own `SIGNED_IN`
   listener (`realSupabaseClient.auth.onAuthStateChange`) also reloads, and
   it can fire before `login()` continues. Write the marker before calling
   `signInWithPassword`, remove it on any failure, or let the listener skip
   when `login()` is in flight.
4. The page boots in real mode. Read the marker **and remove it at once**, so
   a reload, Back or a second tab never sees it. Restore the view (below).
5. `checkAuth()` resolves with a user → **arrival**:
   - Reduce Motion is on: paint the signed-in badge directly. Done.
   - Otherwise: paint the **sign-in badge** (the signed-out look) in the slot.
     Wait until the boot load (`Promise.all([fetchLocations(), ...])`) has
     resolved and the list has rendered, plus **~250ms**, so the eye has
     somewhere to land. Then play **the Strike** (380ms) and end on the
     signed-in badge, whose label is now "Account".
   - If the app hasn't settled within **3s** of the badge first painting,
     skip the Strike and paint signed-in: a late animation reads as a glitch,
     not a confirmation.
   - A tap on the badge during the hold or the Strike jumps to signed-in and
     opens the dropdown (the tap means "account", and it's true).
6. The Strike plays **only** when all of these hold: the marker said `in`,
   the mode is real, and a user is confirmed. It never plays on a plain
   reload, on a cold start, in a tab that reloaded because another tab signed
   in (that tab has no marker), or when the session didn't stick. If the
   session can't be confirmed, supabase-js signs out and the app reloads into
   the playground with no Strike. That one is a near-impossible case, because
   the session is seconds old.

**2. Back out (visitor, or you change your mind)**
Keep playing, a tap on the scrim, or Esc → the sheet closes and focus returns
to the badge. Everything in the playground is as it was. A visitor who tries
anyway gets the wrong-password error and stays in the sheet. No stranger can
succeed, because only two accounts exist.

**3. Sign out (the real app)**
1. Tap the badge → the dropdown (the badge turns orange) → **Sign out**.
2. The dropdown closes and the badge goes back to navy. The item reads
   "Signing out…" for the moment `signOut({ scope: 'local' })` takes. On an
   error, show the app's error banner "Couldn't sign out. Try again." and stay
   signed in.
3. Success → write the hop marker `{ dir: 'out', view }` → play **the
   dry-up** in place (540ms, the `DRY` constants): the navy dries away and the
   sign-in badge is left → reload into the playground. Under Reduce Motion,
   swap to the sign-in badge and reload, with no dry-up.
   **Builder:** the `SIGNED_OUT` listener reloads at once today. When this tab
   started the sign-out, it must wait for the dry-up. A `SIGNED_OUT` this tab
   didn't start (a rejected refresh token, or another tab signing out) still
   reloads at once, with no dry-up, because nobody here asked for it.
4. The playground boots with the sign-in badge already painted, so the badge
   you just watched arrive is the one you find. Restore the view from the
   marker, then remove it.

Why the Strike plays after the reload but the dry-up plays before it: see Why.

**4. Sign in inside the real app (rare: signed-out real mode)**
The same sheet in its real-app form (no line, Cancel). Success happens in
place: no reload, the sheet closes, and the Strike plays straight away with no
250ms hold, because your eye is already on the corner. Reduce Motion: swap
directly. This is today's `login()` non-playground branch, plus the Strike.

**5. Land where you were (job 8)**
The hop marker carries the view both ways: map centre and zoom, and the open
tag's key (`rowKey()`: a place id or `'shape:<id>'`). After the boot load, set
the view without animation. If the tag's place exists in the new mode's data,
reopen its tag (through the normal open path, with no extra pan). Places you
added in the playground don't exist in the real trip, so that tag just isn't
reopened, without any message. The city filter, the list view and the active
plan already survive the reload (they're in `localStorage`). A playground-only
city id falls back the way stale ids already do. This is cheap: about 15 lines
and one `sessionStorage` key.

### Motion: when it plays (the look of each frame belongs to the visual designer and the approved sheet)
- **The Strike:** 380ms, `STAR_POP`'s offsets and easings, scale only (no
  rotation), peak about 1.12. It is **one object changing ink**: it doesn't
  cross-fade between two buttons. It plays only in arrival (flow 1) and in the
  in-place sign-in (flow 4).
- **The dry-up:** 540ms with the snap, the `DRY` constants. It plays only in
  departure (flow 3). No pop.
- **Reduce Motion:** neither plays. The state swaps instantly, and the timing
  rules (the marker, Esc, the reload) are unchanged.
- **Never** re-use a constant as a literal (`STAR_POP_MS`, `DRY.MS`). No new
  curves.
- **Animation separation:** these are triggered by the auth state changing,
  never from inside gesture code.
- Haptics: none added. A real tap on the badge is a normal button click.

### Sizes and platforms
- **390px (iPhone):** the primary target. The badge is 50×50 at its slot.
- **320px:** identical. The badge doesn't shrink, and the top row (zoom at the
  left, two badges at the right) has no collision. The sheet is already
  `width: 100%` with a 16px gutter and fits. The dropdown (min-width 200px)
  starts 46px from the left edge, so it fits.
- **Desktop (≥900px rail):** the badge stays fixed top-right over the map,
  as today. Keyboard: Tab reaches it, and Enter or Space opens the sheet or
  the dropdown. Esc closes the sheet. Hover: a pointer cursor.
- **Larger text (iOS Dynamic Type):** the drawing's text is fixed SVG text
  and doesn't grow. The accessible name carries the meaning. The sheet's
  words grow as they do today.
- **Standalone (Home Screen):** the badge keeps using
  `--chrome-top-inset`, like `+`.
- **Chrome that measures the badge:** `pinPopupTopPad()` and `planChrome()`
  include `#accountBtn`. It's now shown in the playground too, so popups and
  plan fits already clear it. In real mode during auth-unknown its width is
  0, so it's ignored until it appears. That's acceptable, because it appears
  within a frame or two.

### For the builder: checks that cover this
- Impeccable gate (`design/impeccable-gate/run.sh index.html`).
- `design/signin-button/mode-test.js` (mode switching, no playground writes).
  It clicks `#dropdownLogoutBtn` in the playground, which goes away, so
  update it.
- New, small: the arrival rules. Sign in → the Strike plays once. A reload →
  no Strike. Reduce Motion → no Strike, signed in. Another tab's sign-in →
  no Strike. A double submit → one request. A wrong password → the message,
  with the email kept. Esc closes the sheet. Sign out → the dry-up, then the
  playground. Storage blocked → the message and no reload loop.
- Popup-open 20/20 (the badge's paint changed in the playground).

---

## How it looks and feels (visual: TO BE WRITTEN by the visual designer)

> Placeholder. The visual designer writes this section: the V[14] drawing as
> built (die, edge, shadow, person, arc, `centerArcs()`), pressed and the
> focus ring's look, the Strike and dry-up frames, the 0.13s blot fringe
> watch, and the side-by-side check with the new +.

---

## Why (systems reasoning)

- **One button, two states, one place.** Job 5 says "nothing moves", and
  job 2 says the states must be told apart at a glance. Keeping one element
  means the state change is a change of ink on one object (which is what the
  Strike draws), not a swap of two controls. It is also the cheapest build,
  because `#accountBtn`, its position and its measuring code are reused.
- **No dropdown while signed out** (job 1: "one tap away, with no menu
  first"). The owner's first build put Sign in inside the dropdown, and he
  turned it down.
- **The playground paints immediately, and real mode waits for auth.** The
  mode comes from `localStorage` synchronously, so the playground knows it's
  signed out before anything paints, and waiting would only add a gap. Real
  mode has a stored session that still has to be confirmed. Painting either
  look before that risks a flash: the account badge, then a reload into the
  playground, or the paper badge, then a jump to navy. An empty corner for a
  frame is honest. A wrong badge isn't.
- **The Strike plays after the reload, not before it.** Signing in has to
  reload, and the signed-in badge is only true once the real app has
  confirmed the session. Played before the reload, it would claim success the
  page then had to prove. The hold also lets the reloaded page settle, so your
  eye comes back to the corner in time to see it. The 3s cap and the
  tap-to-finish rule stop it from ever arriving late or getting in the way.
- **The dry-up plays before the reload.** Your eye is already on the corner
  at the moment you tap Sign out, and the sign-out has really happened (the
  key is gone) before it plays. After the reload the same paper badge is
  waiting, so the motion and the result agree. Playing it after the reload
  would make you wait for the page to boot just to see a goodbye.
- **One-shot marker in `sessionStorage`, removed on read.** This makes
  "only right after a sign-in" exact: it's per tab, it doesn't survive into
  a new tab, and it's gone before any reload could replay it. Another tab
  reloading because of a broadcast has no marker, so it gets no animation,
  which is right, because nobody signed in there.
- **No "Keep playing" while busy.** Once the request is out, a success
  reloads the page no matter what, so offering to back out would be false.
  Short busy states are normal, and the 15s cap stops it from hanging.
- **Plain-words errors with the email kept** (job 6): a mistyped password
  costs one field, not two. The storage-blocked case is caught because,
  without the check, it loops silently: you sign in, the page reloads, and
  you're back in the playground.
- **The view is carried both ways** (job 8): it costs one `sessionStorage`
  key, and a hop that drops you somewhere else on the map is exactly "lost by
  surprise" (job 7).
- **The rare signed-out real mode keeps the badge.** It's the same rule
  everywhere ("signed out shows this badge"), so there's no third state to
  design, and the in-place success reuses the Strike.
- **The other team's +:** this spec ties the badge to `#accountBtn`'s slot,
  not to an x coordinate, so the + redesign can't break it, only move it.

---

## Jobs check (against `jobs.md`)

| Job | Covered by | Status |
|---|---|---|
| 1. Find sign-in without opening anything | Signed-out tap opens the sheet; no dropdown; SIGN IN on the badge | covered |
| 2. Tell signed out at a glance | Paper and navy vs navy and orange, words vs none (V[14] vs today) | covered (look: visual) |
| 3. Sign in from the playground, end in the real trip, signed in | Flow 1: the reload into real mode, then the arrival | covered |
| 4. Keep it quiet (never louder than +) | Look only. Re-check side by side with the new + before the build (director's build watch) | **pending** the + redesign |
| 5. Signed in = today's badge, same spot, menu with Sign out | Structure; signed-in states; the rename | covered |
| 6. A visitor isn't stuck or punished | The playground line, Keep playing, Esc, scrim, the wrong-password error with the email kept | covered |
| 7. Nothing lost by surprise | Back out loses nothing; the line warns before sign-in; the view is carried | covered. Whether the one line is enough is **Q2** |
| 8. Land where you were | Flow 5: centre, zoom and open tag carried both ways | covered (cheap, so built, not flagged) |
| 9. Easy to tap | The 50×50 button is the target in both states | covered |

Flows in `jobs.md`: sign in from the playground (flow 1), back out (flow 2),
sign out (flow 3), and edit while signed out in the real app (flow 4 and the
sheet's third column) are all covered. One correction: `jobs.md`'s sign-out
line says "(That's if Q1 is yes.)". Q1 is now answered by the product, and
signing out lands in the playground.

## Open questions
- **Q2 (owner, still unanswered):** is the one line in the sign-in sheet
  ("Only the trip's owners can sign in. Your changes here won't be kept.")
  enough to tell visitors that changes aren't kept, or does he want something
  on the map too? Not decided here. `docs/shipped.md` also lists it as a
  known gap: nothing in the playground says changes aren't kept until
  someone opens the sheet.
- **The + side by side (team, before the build):** job 4 can't be signed off
  until the badge has been seen next to the redesigned +, and the badge's x
  position follows the + team's layout.
- **The busy rule (UX may object):** I chose to lock the sheet while a request
  is in flight, rather than the earlier "Keep playing stays live", because a
  success reloads anyway. If UX wants Keep playing to stay live, it must also
  stop the reload, which means changing the playground's `SIGNED_IN` listener.
