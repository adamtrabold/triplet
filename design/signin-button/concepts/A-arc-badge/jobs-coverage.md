# Concept A (arc badge): jobs coverage check (systems)

Checked against `jobs.md`, using `A-arc-badge/sheet-3x.png`,
`A-arc-badge/how-it-works.md`, `A-arc-badge/looks-and-feels.md`,
`flow/sheet-3x.png`, `flow/how-it-works.md` and `flow/looks-and-feels.md`.

**Verdict: all 9 jobs and all 4 flows are supported. A can go to the owner.**
There are no gaps that send it back. The nits are at the bottom.

## Jobs

| # | Job | A | Where |
|---|-----|---|---|
| 1 | Find sign-in without opening anything | Supported | Sheet A "Real size" frames 1, 2 and "Up close: Sign in": SIGN IN is on the badge. Intro: "One tap opens the sign-in sheet; no menu." `flow/how-it-works` Structure: signed out, one tap, no dropdown. *Risk, not a gap:* the 8px arc on a real phone; the team fallback is in `team-fallback-3x.png`. |
| 2 | Tell at a glance you're signed out | Supported | Sheet A "Real size" frame 1 (paper badge) vs frame 3 (navy signed-in badge); "Up close" Sign in vs Signed in. |
| 3 | Sign in from the playground, end up in the real trip | Supported | Flow sheet frames 1–3 (tap → sheet → busy) and frame 5 (arrival → inked → signed in); sheet A "Signing in" strip (5 frames, 0–0.38s); `flow/how-it-works` steps 5–6 (session saved, one-shot marker, the arrival rules). Builder question open (a session-saving client in the playground; fallback F1a noted), not a design gap. |
| 4 | Keep it quiet: never louder than + | Supported | Sheet A "Real size": the cream map and the darkest map (water/park): a paper badge beside navy +; 320px frame too. |
| 5 | Signed in, the same account badge in the same spot | Supported | Sheet A "Real size" frame 3 ("today's account badge in the same spot (unchanged)"); `A/how-it-works` states table (signed in, dropdown open unchanged). The menu itself isn't drawn; it's unchanged except "Logout" → "Sign out" (see nits). |
| 6 | A visitor who taps it isn't stuck | Supported | Flow sheet frame 2: the line "Only the trip's owners can sign in. Your changes here won't be kept." plus Keep playing; the caption "Visitors read why they can't sign in, tap Keep playing, and lose nothing." |
| 7 | Nothing lost by surprise | Supported | Flow frame 1 ("Nothing behind it changes": the open tag is visible under the scrim); frame 2 (the warning line before success; tapping outside = Keep playing); frame 4 captions (wrong password / no connection: still in the playground, nothing lost). |
| 8 | Land where you were | Supported as a build note | No still, per the director's ruling. `flow/how-it-works` step 5: carry the map view if cheap; if not, flag it, don't drop it silently. The handoff must carry this; the build check verifies it. |
| 9 | Easy to tap | Supported | `A/how-it-works` states: a 50×50 hit area, the same as +; the drawing shrinks, not the button. |

## Flows

| Flow | A | Where |
|---|---|---|
| Sign in from the playground (incl. busy, wrong password, no connection) | Supported | Flow sheet frames 1–5 |
| Back out (Keep playing / tap outside / Esc) | Supported | Flow frame 2 caption; Esc in `flow/how-it-works` step 3 |
| Sign out (if Q1 yes) | Supported | Sheet A "Signing out" strip (0–0.54s, captioned "Only if sign-in also lives in the real app"); the Q1-no ending (dries to an empty slot) in `A/how-it-works`; the director's build note: drop `.active` without the transition, then dry from navy |
| Edit while signed out says "sign in" | Supported (words only) | `flow/how-it-works` words table (edit-triggered column); no still, as scoped |

Owner questions Q1 and Q2 are on the flow sheet ("Two questions for you"),
in plain words, with the recommendation on Q1.

## Nits (don't block; for the presentation pass or the handoff)
1. **"Sign out" is never shown.** The signed-in menu with the renamed item
   isn't in any still. The director sends it as a one-line fact. If anyone
   wants it visible, one crop of the open menu would do it.
2. **The empty-field error** ("Enter your email and password.") is in
   `flow/how-it-works` but not on the sheet. That's fine for the owner; the
   handoff should still list it.
3. **The flow sheet title says "both concepts" / "works the same with
   B".** The director already flagged it; it needs to describe A only once B
   is held back.
4. **The wrong-password frame doesn't show that the password field has
   focus.** That's a build detail (focus moves there); just carry it in the
   handoff.
5. **Job 5 in `jobs.md` reads awkwardly** ("email, and Logout, renamed Sign
   out"). I'll tidy it if the owner reads jobs.md; the meaning is right.
