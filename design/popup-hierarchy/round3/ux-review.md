# Round 3: UX review of the five object concepts

UX agent, 2026-10-05, on the designer's `a2df37e`. Brief: `docs/ux-brief.md`.
Jobs J1–J10 come from `../ux-analysis.md`. Hard limits and soft defaults are
from `../round2/ux-review.md` §4. I judged the **idea**: a concept is killed
only for an idea-level interaction failure. Each must-fix below says whether
a better execution could fix it. Evidence comes from the 1x phone stills
(busiest first), then the 3x crops and the f-frames.

Owner words in play (verbatim): "Directions is fine." · "I like whimsy and
these all seem kinda average. The most exciting ideas as far as whimsy have
been cut" · "Bonus points but not required if the map pin is conceptually
aligned with whatever it "opens up" to" · "If you're not logged in actions
should be visible but disabled" · "Type is actually tier 2 imo — or bottom
of tier 1. Notes are tier 1" · "Replacing list with info is a fine thing to
explore." · "we're trying to rate concepts here not execution".

## Ranking (UX)

| # | Concept | Verdict | Ready for the owner? |
|---|---|---|---|
| 1 | **Luggage Label** | KEEP | **Yes, as is.** Its must-fixes are build-time checks. |
| 2 | **Card File** | KEEP | **Yes.** It resolves both round-2 C blockers (Plans order, × confusion). |
| 3 | **Postcard** | KEEP | **Yes, with one must-fix noted** (the back link vs Safari's back-swipe). |
| 4 | **Passport Stamp** | KEEP | **Yes.** Visited is findable; it needs a target-size rule. |
| 5 | **Hanging Tag** | KEEP | **After one fix:** the back must carry the actions. Not an idea failure. |

**No UX kills this round.** No concept breaks a hard limit at the idea
level; every failure I found is fixable in execution. They're ranked by how
much interaction risk the idea carries.

## Ruling: signed out (owner: "visible but disabled")

- **Directions live when signed out: correct as an interaction.** It edits
  nothing and needs no account. Disabling it would remove the only
  read-only action a viewer has. It differs from the owner's literal "actions
  should be visible but disabled", so **flag it to the owner** with that
  reason. Star and Visited are dimmed (0.4) as asked (`label/signedout`,
  `stamp/signedout`, `post/signedout`).
- **Owner question to surface:** what does a tap on a disabled Star/Visited
  do? A control with no response is a dead end. Today the tap opens sign-in.
  UX recommends that the disabled look still answers a tap with the sign-in
  sheet (or a one-line "Sign in to star"). This is the owner's call; the
  stills don't show it.
- The dimmed controls still show the editors' state (STARRED, VISITED at
  0.4), so viewers can read it. Good.

## 1. Luggage Label: KEEP (rank 1)

| Job | Result | Evidence (busiest) |
|---|---|---|
| J1 identify | PASS | Name in the band, seal = pin, `BAR · STOP 2 OF 3`. |
| J2 decide | PASS | Whole note under the band, map fully clear. |
| J3 / J4 / J5 | PASS | One row at y≈822 in busiest and bare: fixed. |
| J6 | PASS (friction) | Type line. Next stop = × then a row, or a map pin (as round 2 B). |
| J7 | PASS | × at the same spot in busiest and bare (y≈572). |
| J8 | PASS | One line + ›. |
| J10 | PASS | `f1`–`f4`: the seal flies to the band; × reverses it; the list returns. |

- The band height changes per place, but the × and the buttons don't. That
  meets "controls don't move".
- **Hierarchy at 1x:** the band name outranks the note. That's acceptable
  for J1, though the owner put notes in tier 1 with the name: the CD should
  judge whether the band drowns the note. Bare: poster lettering, no void.
- **Pin link (bonus):** strong. The seal travels from pin to label.
- **Must-fix (build-time):**
  1. The Safari-tab inset. Still unverified: the buttons at y≈822 must sit
     above the toolbar.
  2. Swapping when another pin is tapped while the label is open (carried
     from round 2 B).
  3. The note scrolls inside, with the header and buttons fixed.
  4. A long name falls back from caps (as stated).

## 2. Card File: KEEP (rank 2)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS | Heading with the stop number (2) on the spine, seal + type. |
| J2 | PASS | VEGA's note whole, 6 typed lines (busiest). Approx shows 5 lines + "…", with the rest behind the tab. |
| J3 / J4 / J5 | PASS | Fixed foot row, y≈822. |
| J6 | **PASS (round-2 blocker resolved)** | The card covers the whole sheet, so no other stop is shown out of order. The stop keeps its number. |
| J7 | PASS | "Put back" chevron, top right. |
| J8 | PASS (friction) | ADDRESS › tab. |
| J10 | PASS | `f1`–`f4`. |

- **Ruling: the put-back chevron instead of ×. Accepted.** It no longer
  shares a glyph with the rows' destructive ×, and chevron-down = lower/put
  away is an iOS sheet convention. It also matches the list header's ▼,
  which lowers the sheet (same meaning). Condition: a 44px target.
- **Ruling: Plans stop order. Resolved by covering the list.** The pulled
  card hides the whole list including its header, so order can't be
  misread. Put back must return the card to its numbered slot (`f4`).
- **The tab:** about 24px tall in the stills (`ADDRESS ›`, `REST OF NOTE ›`)
  and sits on the map edge above the sheet. Must be ≥44px tall in its hit
  area, and taps on it must not fall through to map pins underneath.
  Execution fix.
- **Pin link (bonus):** the card is the row the pin already belongs to.
- **Must-fix:**
  1. A 44px tab target.
  2. The Safari-tab inset (the foot row at y≈822).
  3. Pin-to-pin swapping while a card is pulled.
  4. Reduced motion: the pull becomes a cut.

## 3. Postcard: KEEP (rank 3)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS | Name, type, postage stamp = seal. |
| J2 | PASS | The note as the message; VEGA whole in a ~210px column (7 lines). |
| J3 / J5 | PASS | Foot row, fixed. |
| J4 | PASS | Not visited: "○ MARK VISITED" under the stamp, labelled with a verb and a ring (`typical`). Visited: the postmark on the stamp (`busiest`). |
| J6 | PASS | Type line. |
| J7 | PASS (risk) | "‹ Gate Plan" back link. |
| J8 | PASS (friction) | Address on three ruled lines + tap. |
| J10 | PASS | Seal flies to the stamp corner. |

- **Ruling: finding Visited in the stamp corner. Findable.** The unvisited
  state carries a visible verb and the same ring as everywhere else, so
  it's no harder to find than today's button. Un-visiting means tapping the
  postmark, the same as today's "Visited" button. Must-fix: the whole
  stamp + label area (stated as 112×80) is the target, and visited must
  never be toggled by a tap on the address lines below it.
- **Risk: the iOS back link.** "‹ Gate Plan" at the top left teaches iOS
  "back", and the iOS back gesture is an edge swipe, which in Safari leaves
  the page. Must-fix (execution): push a history entry when the postcard
  opens, so a back-swipe or back button returns to the list. Or drop the
  back-link metaphor and use a close. This applies to Luggage Label and
  Card File too, but only Postcard invites it.
- **Splitting the address into ruled lines** chops the OSM string at commas
  ("Aurora Reykjavik Nor… / 53, Fiskislóð / Örfirisey …"). It reads as
  three broken fragments. It's an execution issue (show one line + ›), not
  the idea.
- Visited is apart from the other two actions (top right vs the foot). It's
  one tap and in the right-thumb zone, so fine.
- **Pin link (bonus):** strongest. The pin's seal is the postage stamp.

## 4. Passport Stamp: KEEP (rank 4)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS | Name in the stamp, type on its top line. |
| J2 | PASS | Typical whole (`typical`); busiest 3 lines + MORE. |
| J3 / J5 | PASS | Directions + Star below the note. |
| J4 | PASS | Not visited: "○ MARK VISITED" band in a dashed frame (`typical`). Visited: the inked band "✓ VISITED" (`busiest`). |
| J7 | PASS | 44px × + map tap. The busiest card covers ~260px of map at the pin. |
| J8 | PASS | One line + ›. |

- **Ruling: finding Visited in the stamp band. Findable.** It has a verb, a
  ring, and sits at the top of the card, consistent with visited being
  tier-1 state.
- **Must-fix (execution):** only the band is the target, never the name or
  the frame. Otherwise tapping the name, which people do to "open" things,
  toggles Visited. The band must be ≥44px tall, the tilted state keeps the
  hit area, and there must be an ≥8px dead band to the ×.
- A dashed "not yet" frame on every unvisited card is a mark for an empty
  state. The owner's "No star unless it's been starred" may extend to it.
  That's for the CD and owner, not an interaction failure.
- Carries round 2 A's must-fixes:
  - a "there's more" cue when the card is capped high;
  - a drag inside the card scrolls the card, not the map;
  - the open-pan settles before taps.
- **Pin link (bonus):** partial (stamp on paper, sticker on the map).

## 5. Hanging Tag: KEEP (rank 5)

| Job | Result | Evidence |
|---|---|---|
| J1 | PASS | Name in lettering, seal + type. |
| J2 | PASS | Typical whole; long note → TURN OVER. |
| J3 / J4 / J5 | PASS on the front | Front row (busiest). |
| J3–J5 from the back | **FAIL (execution)** | `approx-back`: the back has only TURN BACK. Acting after reading a long note takes 2 taps, against the one-tap hard limit. The back's note is also cut off at the foot with no scroll cue. |
| J7 | PASS (friction) | × on the front only. The back closes by map tap. |
| J8 | PASS | Stub, one tap. |

- **Ruling: does it never cover its pin? Yes.** In busiest, f2 and the back,
  the tag hangs below the pin with the string between them.
- **Ruling: does it settle before it can be tapped?** "Taps wait until it
  settles" is not enough. A tap during the swing should never be dropped
  silently. Must-fix:
  - the hit targets sit at their **settled** positions from the first frame,
    so a tap during the swing lands where the button will be;
  - the swing is short (about 300ms or less);
  - reduced motion has no swing (as stated).
- Every open pans the pin to y≈112. The tag then covers ~280px of map
  below the pin, which is where the neighbours are. That's soft (C7 is a
  default), but it's the in-map cost.
- The orange selected row stays next to the tag (CD's call, as round 2).
- **Must-fix:**
  1. The back carries the action row (or the actions stay visible during
     the turn).
  2. The back's note scrolls with a cue.
  3. The swing hit-target rule above.
  4. A drag on the tag never pans the map.
- **Pin link (bonus):** strong. The pin is the knot.

## Room for whimsy vs hard limits (recap for the loop)

None of the five breaks a hard limit as an idea. Every soft default broken
on purpose is fine by UX:
- the string instead of a tip;
- Visited inside the object;
- inner scroll;
- the list replaced.

The two interaction risks that come from the object metaphors themselves,
which need watching in any build:
- a large object face invites taps that aren't targets (Stamp's name,
  Postcard's address lines);
- iOS back-link metaphors invite the edge back-swipe (Postcard).

## Not verified

- Stills and frames only: no timing, hit-testing during motion, inner
  scroll, re-render or VoiceOver.
- No Safari toolbar in the harness, so the foot rows of the three sheet
  concepts are unchecked in a tab.
- Stand-in basemap.
