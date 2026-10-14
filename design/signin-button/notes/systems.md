# Systems designer notes: sign-in button

## Where things stand (2026-10-14, handoff written)
- Owner approved round 2e: "Sign in is great". Signed out = V[14] (badge2.js),
  signed in = today's account badge.
- `handoff.md` written: **How it works** (structure, states table, the sheet's
  words and behaviour, flows 1-5, motion timing rules, sizes, builder checks),
  **Why**, a jobs check, open questions. **How it looks and feels** is a
  marked placeholder for the visual designer.
- Next: visual writes its section; then the build (lane 2), then one combined
  CD + UX check.

## Decisions in the handoff (mine, with reasons in its Why)
- The architecture changed under the concepts: signed out IS the playground,
  mode fixed at boot from the stored session, sign in/out RELOADS. So:
  - Playground paints the badge from first paint (mode known synchronously);
    real mode paints nothing until checkAuth resolves (replaces the old
    "nothing until checkAuth in both apps").
  - Arrival: one-shot sessionStorage hop marker {dir:'in', view}, written
    before the reload, removed on read; Strike after the boot load + ~250ms;
    3s cap (skip); a tap during it finishes it and opens the dropdown. Never on
    reload / other-tab broadcast / Reduce Motion.
  - Sign out: dry-up plays IN PLACE after signOut succeeds, THEN reload (the
    SIGNED_OUT listener must defer when this tab started it). Unrequested
    SIGNED_OUT reloads at once, no animation.
  - Rare signed-out real mode (expired session offline): shows the badge;
    success in place with an immediate Strike.
- Busy locks the whole sheet (Keep playing/scrim/Esc too): a success reloads
  anyway. Reverses my earlier "Keep playing stays live". 15s timeout.
- New failure: storage blocked -> sign-in succeeds but the key isn't stored ->
  message, no reload (else a silent loop back into the playground).
- Errors mapped: invalid creds / network / 429 / other. Esc closes the sheet
  (missing today). Dialog semantics + focus return. aria-expanded on signed-in.
- Job 8 is built, not flagged: the marker carries centre/zoom/open tag both
  ways; playground-only places just don't reopen.
- Focus ring: the button is masked, so outline/box-shadow get clipped; the
  ring must be drawn outside the mask (look = visual).
- mode-test.js clicks #dropdownLogoutBtn in the playground; it needs updating.

## Builder race to remember
- The playground's realSupabaseClient SIGNED_IN listener reloads immediately,
  possibly before login() continues: write the marker before signInWithPassword
  (clear on failure) or have the listener skip while login() is in flight.

## Open questions
- Q2 (owner): is the sheet's one line enough to say changes aren't kept?
  Left open, not decided.
- Job 4 (quieter than +) is pending the + redesign side-by-side; the badge's
  x follows the + team's layout (it's tied to #accountBtn's slot).
- UX may object to the busy lock (see handoff open questions).
- jobs.md's sign-out line still says "(That's if Q1 is yes.)": stale; noted in
  the handoff's jobs check, jobs.md not edited.

## Handoff check (after visual's 9b35e4c)
- Two halves agree. Fixed in my part: sign-out keeps the dropdown open with
  "Signing out…" until signOut returns (row added); tap-to-finish/3s skip use
  visual's one-frame swap.
- Notes to visual (in handoff "Handoff check"): 1 busy/disabled looks for the
  sheet primary, read-only fields, "Signing out…" item (needed); 2 say the
  arrival hold paints V[14] mask-off in real mode; 3 dry-up starts after
  .active's 150ms close; 4 r21 blot differs from approved stills (build watch).
- Verdict: PASS pending visual note 1.

## Director objections
- None to the handoff yet.

---

# Earlier notes (before approval)

## Where things stood (jam closed by the director's turn 6; concept phase started)
- `jobs.md` is written: jobs 1 to 9 (6 to 9 inferred), the flows, Q1 (with
  the team's "yes" recommendation) and Q2, and builder notes. Short and
  plain, for the owner's phone.
- Concepts started, systems half written:
  - `concepts/flow/how-it-works.md`: shared structure, the sheet's words
    table, the playground flow, arrival, failure states, the visitor, the
    real-app flow under Q1 yes/no, builder questions.
  - `concepts/A-arc-badge/how-it-works.md`: spec, states table, the strike
    and dry-up (DRY constants: 540ms, not turn 4's "~450").
  - `concepts/B-label/how-it-works.md`: 28px drawn in a 44px hit box, right
    edge at right:74px, grows leftward; states; the two-object motion and the
    shared-clock glitch risk.
- Next: the visual designer renders the three sheets (A, B, shared flow) from
  a copy of index.html via signin-test.js. Then the director scores; then my
  job-coverage check on each 9+ concept against jobs.md.

## Concept round 1 result
- Director: A = 9, B = 7 (held back, not shown; the ready alternative if the
  owner rejects the arc idea). The flow sheet gets cut to about half before sending.
- My coverage check on A: `concepts/A-arc-badge/jobs-coverage.md`: all 9 jobs
  and 4 flows are supported, with 5 nits (Sign out never shown, the empty-field
  error isn't on the sheet, the flow title mentions B, password focus, job 5's
  wording). Job 8 (map view) is a build note only; the handoff must carry it.
- Next for me: after the owner approves, write the "How it works" section of
  handoff.md and check it against jobs.md.

## Correction (coordinator, after turn 6)
- The signed-in account badge AT REST is navy with an orange person; it is
  orange only while its dropdown is open (`.active`). jobs.md and all three
  how-it-works files are corrected: the strike floods NAVY and the person's
  ink turns orange; the dry-up dries navy. Turn 4's storyboards drew it orange
  and need redrawing (visual's sheets).

## Director rulings in turn 6 (now settled)
- A: no rim; printed not stamped; 1.4px outline person. B: hotel-label banner
  with a notched tail, 28px drawn, 44px hit box, text size capped.
- The sheet's words are in scope (not its look): title/submit "Sign in", the
  playground line "Only the trip's owners can sign in. Your changes here won't
  be kept.", "Keep playing", the plain errors, the busy state, log in → sign
  in everywhere.
- Q1 doesn't block: the out-storyboard is drawn for "yes" and captioned.
- Map view across the hop: build note, not concept ("flag it, don't drop it").
- No paint until auth resolves; the arrival strike rules: all adopted.
- A's fallback (8.5px, ×0.38) is rendered for the team only.
- I also renamed Logout → Sign out (follows "sign in everywhere"); the
  director may object.

## Earlier record (pass 2)
### Decided before turn 6
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
