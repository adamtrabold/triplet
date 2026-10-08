# Shared flow: how it works (systems)

Both concepts share this. Only the control in the corner differs (see
`../A-arc-badge/` and `../B-label/`). In this file, "the control" means
whichever of the two it is.

## Structure
- **One slot, two states**, top right, left of `+` (`#accountBtn`'s place).
  - **Signed out**: the control. One tap opens the sign-in sheet. There is
    no dropdown.
  - **Signed in**: today's orange account badge, with its dropdown (email,
    Logout). Unchanged.
- **Where the signed-out state shows:** in the playground always (it is
  never signed in). In the real app when signed out, **if the owner says
  yes to Q1** (the team recommends yes). If he says no, the real app keeps
  the slot empty when signed out, as it is today.
- `+` never moves, and neither does the control. The signed-in badge takes
  the same spot.
- **Nothing paints in the slot until `checkAuth()` resolves**, in both apps.
  So no paper badge or label flashes before a signed-in load.

## The sign-in sheet (the existing `#authModal`; its words change, not its look)

| Part | Playground | Real app, from the control (Q1 yes) | Real app, edit-triggered |
|---|---|---|---|
| Title | Sign in | Sign in | Sign in |
| Line | Only the trip's owners can sign in. Your changes here won't be kept. | (none) | You need to sign in to make changes. Anyone can view places and plans. |
| Fields | Email, Password | same | same |
| Primary | Sign in | Sign in | Sign in |
| Secondary | Keep playing | Cancel | Cancel |

Every "log in"/"Login"/"Logout" in the app becomes "sign in"/"Sign in"/"Sign
out". UX and visual may tune the words; the structure above stays.

## Flow: sign in from the playground
1. Tap the control → press state on touch-down → release → the sheet opens.
   The scrim covers everything (z 3000 over the chrome's 2000). Focus goes to
   Email; iOS can autofill.
2. Behind the sheet nothing changes: the map, the open tag, the filters, the
   playground edits.
3. **Back out:** Keep playing, tap the scrim, or Esc → the sheet closes and
   focus returns to the control. Nothing is lost, and the fields are cleared
   (as today).
4. **Submit** (the button, or Enter in Password) → **busy**: the button
   reads "Signing in…" and is disabled, the fields are read-only, and
   Keep playing stays live (it abandons the result).
5. **Success** → the session is saved for the real app → go to the real app
   carrying a one-shot marker (`?arrived` or sessionStorage) and, if it's
   cheap, the map view (centre/zoom, open tag). If it isn't cheap, flag
   that; don't drop it silently.
6. **Arrival** (real app): `checkAuth()` resolves signed in, the marker is
   present → paint the control in its **signed-out** look → hold ~250ms after
   the map's first paint → **the arrival strike** (per concept) → signed-in
   badge → clear the marker with `history.replaceState`.
   - Reduced motion: paint signed-in directly, no strike.
   - Marker present but no session (expired, or storage blocked): paint
     signed-out, no strike, open the sheet once. Never strike into a state
     that isn't true.
   - Reload or Back after arrival: no marker, no strike.

### Failure states (the sheet stays open, still in the playground)
- **Wrong email/password:** the error under the fields reads *"That email
  and password don't match."* (not the raw Supabase message). The email is
  kept, the password is cleared and focused, and the busy state ends.
- **Can't reach the server:** *"Can't reach the sign-in server. Check your
  connection."* Both fields are kept. The playground keeps running off its
  in-memory copy.
- **Empty field:** *"Enter your email and password."* (today's check,
  reworded).

### The visitor who can't sign in
They tap the control, read the one line, tap Keep playing, and lose nothing.
If they try anyway, they get the wrong-password error. No stranger can
succeed (only two accounts exist).

## Flow: the real app (Q1 yes)
- **Sign in from the control:** the same sheet (no line), success **in
  place**: no navigation, the strike plays right away (no 250ms hold; the eye
  is already there).
- **Sign out:** orange badge → dropdown → Sign out → the dropdown closes →
  **the dry-up** (per concept) → the control.
- **Q1 no:** sign-in only comes from edit attempts (today), and sign-out
  dries the badge to an **empty slot** (the same motion, nothing under it).

## Builder questions (not design blockers)
- Can the playground sign in through a client that saves the session (the
  playground's own client has `persistSession: false`)? If not, fall back:
  tap → go to the real app with `?signin` → the sheet opens there (today's
  hop). That loses the "back out loses nothing" property, so flag it.
- Motion reuses existing constants (`STAR_POP` easing/offsets with the
  rotation removed and the peak capped; `DRY` for the dry-up). No new curves.
