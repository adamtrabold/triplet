# Systems designer notes: sign-in button

## Where things stand (after jam pass 2, my turn 5)
- jam.md has: turn 1 (me: jobs J1 to J9, structure, flows, directions), turn 2
  (visual: arc sketches, "secondary = paper die, navy ink"), turn 3
  (director: the badge IS the sign-in, no signed-out dropdown, F1b adopted,
  two concepts A arc badge + B printed label, scope), turn 4 (visual pass
  2: A has no rim, 1.4px outline person, 8px arc on r15.6; B is a hotel-label
  banner with a notched tail, 32px tall; storyboards), turn 5 (me: flows and
  states mapped onto A and B, jam-level job coverage).
- Sheets: concepts/sketches/arc-badges-3x.png, pass2-look-3x.png,
  pass2-motion-3x.png.
- No jobs.md yet: write it when the jam closes (jobs J1 to J9 + flows from
  turn 5 sections 2 and 3).

## Decided (by the director, or agreed)
- One slot, two states; `+` never moves; no dropdown while signed out.
- Secondary = the same die cut from paper, navy print, no orange; printed, not
  stamped (no tilt, no texture); A has no rim (warm 1px edge + the `+`'s 1px
  shadow).
- F1b: the modal opens over the playground; success → the real app; the strike
  plays on arrival. F1a is the fallback if the playground can't use a
  session-saving client (same look).
- Out of scope: the register sheet, a playground strip/notice, F1c, restyling
  the modal. Parked: the friend's initial (A/E) on the signed-in badge.
- Owner questions, to batch with the concepts: Q1 the same control in the
  normal signed-out app? Q2 should visitors be told changes aren't saved?

## My positions from turn 5 (not yet ruled on)
- **B needs a 44px-tall hit box** (the 32px label is under the floor);
  invisible, the look is unchanged.
- **Paint nothing in the slot until checkAuth resolves**, so a cold load
  doesn't flash the paper die and then strike.
- **Arrival:** a one-shot marker (`?arrived`/sessionStorage) → paint the
  signed-out look → ~250ms after the map paints → strike → replaceState.
  Reduced motion: no strike. Marker but no session: signed-out, no strike,
  the modal opens once. Keep the map view across the hop if it's cheap.
- **Modal words are part of the flow** (the current "Login Required / you
  need to log in to make changes" is false in the playground): title and
  button say Sign in; the playground line "For the trip's owners. Signing in
  opens the real trip; nothing you changed here is kept."; the playground
  cancel says "Keep playing". This covers the visitor who can't sign in and,
  partly, J6/J7.
- Wrong password: plain-words error, keep the email, clear and focus the
  password. **Add a busy state** (none today, so a double tap submits twice).
  Offline: an inline error, the playground keeps working.
- **The out-motion depends on Q1:** if no, logout has no paper die to dry up
  to, so A's out-storyboard is wrong and it must dry to nothing (as B's must).
- B: cap Dynamic Type growth; dark-tile dominance is still B's open risk.
- Systems cost: A (one object changing ink) < B (two objects, a shape swap,
  more glitch states). B wins J1 legibility outright.

## Open questions
- Director: modal copy in scope? Show the owner the out-storyboard only
  after Q1, or both endings? Keep the map view across the hop: now or later?
- Does A's 8px arc read on the owner's phone (Chromium-only so far)?
  Fallback: 8.5px with the person ×0.38; pre-render it.
- Builder: can the playground sign in via a client that saves the session?

## Director objections to me so far
- None directly; the director adopted turn 1's structure and F1b, and moved
  the register sheet / strip / F1c out of scope.

## Next
- Read the director's response; then write jobs.md (jobs + flows), then
  concepts with visual; then the coverage check for each 9+ concept.

## Key code (index.html on branch claude/elegant-galileo-1c5ntm)
- #accountBtn/#accountDropdown CSS ~360 to 485; #authModal CSS ~2119; modal
  markup ~2545; account markup ~2561; PLAYGROUND client ~2695; checkAuth/
  updateAuthUI ~2976; the playground logout() hop ~3056; handlers ~8472
  (scrim tap closes, Enter submits); ?signin on load ~9101.
