# Systems designer notes: sign-in button

## Where things stand (after jam turn 1)
- Wrote jam turn 1 in `../jam.md`: jobs J1 to J9 (J6 to J8 inferred and marked
  as scope questions), structural critique of the rejected build, structure,
  flows F1 to F4 plus edge states, directions A to D, and questions.
- No `jobs.md` yet; that comes after the jam (two or three passes).
- Handed to the product designer (visual focus).

## Decisions / positions so far (mine, not yet agreed)
- **Signed-out state needs its own look.** The rejected build shows the
  signed-IN orange badge in the playground, so the badge contradicts the state.
- **No dropdown when signed out.** The badge itself is the sign-in, one tap.
  The dropdown exists only signed in (email, Logout).
- **Lean F1b:** the auth modal opens over the playground; the page only
  changes to the real app after a successful sign-in. Cancel loses nothing.
  The current code hops to `?signin` immediately (`logout()` in playground
  mode, about line 3056 of index.html on branch claude/elegant-galileo-1c5ntm).
  The builder must check feasibility: the playground client is built with
  `persistSession: false`, so sign-in may need the real client.
- Hit area ≥44px even if the drawn mark shrinks; same centre line as `+`;
  `aria-label="Sign in"`, arc text aria-hidden.
- Hierarchy: `+` > sign-in; sign-in quieter than the signed-in badge.
- State change on sign-in should animate (owner rule), ideally in the stamp/ink
  language.

## Directions on the table
A ring-lettered badge (owner's, mandatory) · B trail register (randomness draw;
"please sign in" on the trailhead box, form as a register sheet; scope risk) ·
C inked-in (blank die vs stamped orange; maybe the state model under A/B) ·
D discard the badge: a playground strip with Sign in (covers J6; risks
owner's no-extra-height / no-second-row rules). Parked: origami fold-corner
and hanging tag (meaning collisions with the visited sticker and the place
popup).

## Open questions
- Is F1b in scope or only the look? (director)
- J6 a visitor knows it's a playground; J8 sign-in in the normal signed-out
  app: owner scope calls.
- F1c: owner opens own share link while signed in on this device. Show
  "back to the real trip"? A third state, parked.
- Does the U arc stay legible at 50px / 320px-wide phones? Fallback: the glyph
  alone, never a truncated arc.

## Director objections
- None yet (first turn).

## Next
- Read the visual designer's and director's jam turns; reconcile; second pass;
  then write `jobs.md` (jobs + flows).

## Key files
- `../context.md`, `../owner.md`, `../current-rejected-menu-3x.png`
- index.html: CSS #accountBtn/#accountDropdown about lines 360 to 485;
  markup about 2561; updateAuthUI about 2983; PLAYGROUND about 2701; the
  ?signin handler about 9101.
- `docs/owner-taste.md` relevant rules: secondary marks never outrank;
  controls don't move or grow; state changes animate; no extra header height;
  no second row of text; whimsy that carries meaning; signed-out actions
  visible but disabled, and tapping one offers sign in.
