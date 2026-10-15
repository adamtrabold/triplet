# Hanging Tag v2: UX review

UX agent, 2026-10-05, on `4bab4c4`. Brief: `docs/ux-brief.md`. Jobs J1–J10
come from `../../ux-analysis.md`; the hard limits and defaults from
`../../round2/ux-review.md` §4. Evidence is the 1x phone stills first, then
the 3x crops and motion frames.

Owner (verbatim): "i really like the hang tag with a few notes — 1. i think
the tag should just pop down "out of" the pin but end with a straight
string. 2. the heirarchy of content is still imperfect. the rip off tag is
really interesting and it draws attention... i wonder if the address
shouldn't be closer to the place name (as sometimes the address *does*
matter at a glance, if something has multiple locations or something), and
the hang tag shouldn't be the "meta data".. i also feel like theres some
sort of unique thing we could do on the rip off area if visited is in there.
3. long notes should just show full length - the flip over is meh."

**Verdict: ready to show the owner**, with the stub ranked C ≈ A > B. There
is one data must-fix that the owner should hear about (the address line,
§2) and three build contracts.

## Jobs

| Job | Result | Evidence |
|---|---|---|
| J1 identify | PASS | Name in lettering, type in the header band (`busiest`, `typical`). |
| J1b "which one?" (owner, new) | **FAIL for ~half the places** | The address line is cut to one line, and the OSM string usually *starts with the place's own name*. In `typical` it reads "Aurora Reykjavik Northern Lights Center, 53, Fiski…": the street is cut off and the line repeats the name. Real data: 108 of 201 addresses begin with a segment containing the name's first word. See §2. |
| J2 decide | PASS | Whole note at every length. `approx` (8 lines + a paragraph break) and `busiest` show in full; no flip. |
| J3 / J5 | PASS | Directions and Star in one row. |
| J4 visit | PASS | The stub is a full-width labelled control, about 52px tall (`stub-off`: "○ MARK VISITED"). |
| J6 plan stop | PASS | "BAR · STOP 2 OF 3" in the header band. |
| J7 close | PASS | 44px × in the band, plus map tap. |
| J8 full address | PASS | › on the address line. |
| J10 from list | PASS | Flies, then the tag pops out of the pin. |

## 1. Stub Visited variants

| | A Punched | B Torn off | C Stamped |
|---|---|---|---|
| Find (not visited) | Same for all: "○ MARK VISITED" on the stub, a verb + ring, full width (`stub-off`). | same | same |
| Read the state | "VISITED" + a check-shaped hole. The hole's contrast depends on the tiles under it, but the word carries the state. | Deckle edge + ✓ VISITED in the button row. | The list's own VISITED stamp. One visited language with the rows. |
| Undo | Tap the stub again. Same slot, same target. | Tap ✓ VISITED in the button row. A **different** place from where you marked it. | Tap the stub again. Same slot. |
| Controls stay put | Yes | **No.** Visited jumps from the stub into the row, the row gains a third button, and the tag gets ~52px shorter (`stub-tear` vs `stub-off`). Undo grows it back. That's against the owner's "I don't want it to grow height/for the button to change physical location after click". It's inherent to tearing, so not fixable in execution. | Yes |
| Motion vs taps | A punch with a chad drop. The slot stays live. | The tear, then a reflow. | The stamp comes down. The slot stays live. |

**UX rank: C Stamped ≈ A Punched > B Torn off.**
- C wins on recognition (the mark the owner already sees in every row).
- A is just as sound as an interaction and gives the owner's "unique thing".
  Its only risk is the hole reading as a mark rather than a button for
  undo, which is the same as today's "Visited" button.
- B fails "controls don't move" as an idea.

Pick A or C on taste; both pass UX.

## 2. The address at a glance (owner: "sometimes the address *does* matter at a glance")

Putting it under the name is right: it's read with the name, at name +1
line. But the content of that one line doesn't serve the job yet:
- 108/201 addresses start with the venue's own name ("Vega, …", "Aurora
  Reykjavik Northern Lights Center, …").
- 34/201 start with a bare house number ("53, Fiskislóð, …").
- The street and neighbourhood, the part that answers "which branch", is
  often past the cut.

**Must-fix (data, not visual).** The glance line must show street +
neighbourhood. Two routes:
- **(a) No schema change.** Drop leading segments that repeat the name,
  and join a bare number to the street that follows ("Fiskislóð 53,
  Örfirisey …"). This is a string rule, cheap, and right for most rows.
- **(b) Store Nominatim's structured `addressdetails` at add time** plus a
  one-time backfill (lane 3, migration; the backfill needs live OSM, so it
  runs in the owner's browser).

(a) is enough to show the owner; (b) is the durable fix. Owner/operator
call. The full string stays on ›.

## 3. Full-length notes vs the map (up to ~400px)

Measured on `approx`, the tallest real note:
- The tag spans y≈156–555 and x≈37–353. With the list lowered, the map runs
  to ~780.
- Clear map: the top strip (0–156, mostly top controls), ~225px below the
  tag, and two side strips **~37px wide**. The left one is mostly inside
  the 24px back-swipe edge.
- "Neighbours either side stay visible" overstates it. In practice, nearby
  pins within roughly the tag's width are under it and can't be tapped.
  `approx` shows a pin peeking out at the tag's foot (y≈560), and those
  just above it are covered.
- That's acceptable under the owner's notes rule: the map-cover limit was
  my soft default. But two interaction contracts make it workable:
  1. **One-tap swap:** tapping any visible pin while a tag is open opens
     that pin's tag directly. It must not just close the current one and
     need a second tap.
  2. **Map stays draggable** around the tag. A drag that starts on the tag
     moves nothing, and a pan doesn't close the tag (or, if it does, say
     so).

## 4. The list drops to its header (owner hasn't ruled)

- It's good for the job (more map for a tall tag; the orange selected row
  no longer competes). It's the app's existing collapsed state, so the
  header and its controls (▼, sort, filters, locate) stay live and
  reachable.
- **Must-fix (contract):** on close, the list returns to **its previous
  height and scroll** exactly as left. If the user had collapsed it
  themselves before opening, it stays collapsed after close.
- Tapping the header ▼ while a tag is open raises the list. Does the tag
  stay or close? Pick one and keep it.
- This is owner question 1; UX is fine with it.

## 5. Pop-out motion

- `pop0`–`pop4`: the pin is already panned to y≈112 and the list already
  lowered in `pop0`, then the tag grows out of the pin in ~280ms with one
  bounce. Taps live at rest from the first frame: stated. Reduced motion
  shows the tag at rest: stated.
- **Must-fix (contract):** order is pan → collapse → pop. Targets go live
  only once the pan and collapse have finished. Their resting positions
  aren't final until the map stops moving.
- The map tap that opened it lands nothing new during the ~280ms after the
  pop starts. Re-measure the whole open (pan + collapse + pop) and keep it
  short. On a tap of a low pin, the map jumps the pin ~400px; that's
  acceptable with reduced motion as a cut.
- On a real device a 14px overshoot is fine. The string never covers the
  pin (verified in every still).

## 6. Signed out

- `signedout-unvisited`: Star and the stub at 0.4, Directions live.
- As in round 3, flag to the owner that Directions stays live and why: it
  edits nothing.
- Owner question, still open: what a tap on a dimmed Star or stub does. UX
  recommends offering sign-in, not nothing.

## Control parity, state, hierarchy, convention

- **Parity:** star and visit stay one tap; row swipes still work in the
  list once it's raised.
- **State:** the tag stays open across toggles and the 10s poll (round 2's
  U1).
- **Hierarchy at 1x (busiest):** name > note > address line ≈ Directions >
  stub > band. That matches the owner's tiers (notes tier 1, type tier 2 in
  the band). Address under the name serves the "which one" job once §2's
  content fix is in.
- **Convention:** a callout reshaped as a tag. The stub-as-button is new
  but labelled with a verb.

## Must-fixes (summary)

1. The address glance line must show street + neighbourhood (§2: string
   rule now, `addressdetails` later).
2. One-tap pin-to-pin swap while a tag is open (§3).
3. The list restores its exact height and scroll on close; define what ▼
   does while a tag is open (§4).
4. Targets live only after the pan and collapse finish (§5).
5. Drop stub variant B.

## Not verified

Stills and frames only. Timing, hit-testing during motion, the hole's
contrast on real OSM tiles, and the Safari toolbar are unchecked.
