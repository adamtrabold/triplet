# Phase 2 build check (CD + UX), add-tag-p2 @ ec265096, 2026-10-17

Lane 2's one combined check. Two fresh agents, run in parallel. Their reports are condensed below.
Renders are local to this session and not committed:
- CD renders: `/tmp/claude-0/-home-user-triplet/059e9216-ffb6-56b1-9102-5c38b9dc3fec/scratchpad/renders/`
- Approved boards rendered: `.../scratchpad/boards/`
- UX shots: `.../scratchpad/ux/shots/`
- UX drive scripts: `.../scratchpad/ux/drive.js`, `drive2.js`
- Impeccable packet (untracked): `/home/user/triplet/.claude/worktrees/agent-a8a17d06da901b24e/design/impeccable-gate/reviews/2026-10-17-15d553c50faf/REPORT.md`

## UX: BLOCKER on 3 inferred jobs; every job in jobs.md passes

Passed: J1 the city guess, no question; J2 both truths; J3 change city in one step; J4 NEW city made only on ADD; J6 TYPE select; J7–J9 star and visited at add; J11/J12 adding into a hidden city shows it; add near me; add a district; cancel restores the view and keeps the draft; recover from a failed save.

The 3 blockers share one cause. NAME is the search box, a picked result can't be renamed, and there is no edit after ADD.

- **W1, saving a place under my own name ("Sundhöllin").** Editing NAME after a pick drops the pick. The only name you can save is the OSM one ("Sundhöll Reykjavíkur"), and it is permanent.
- **W2, pasting an address.**
  - "Laugavegur 18, Reykjavík" saves as the name **"18"** with TYPE Restaurant. "Vesterbrogade 10" saves as **"10"**.
  - "Grettisgata 20" auto-switches TYPE to **Street**, so the shape flow would trace a street. Renaming it "Anna's flat" keeps Street.
  - Today's form keeps NAME and ADDRESS separate.
- **W3, a bare name in another of my cities, searched from another city's view.**
  - From the Reykjavík view, "Tivoli" returns no Tivoli Gardens and "Noma" returns no Noma. Nominatim doesn't return them at all, so re-ranking can't help.
  - Today's form found both through the city scope.

UX fix direction:
- **W1/W2:** editing NAME after a pick keeps the pick (location, address, city, type). It only re-runs the results; another tap changes the pick.
- **W2:** an unnamed address hit is named from what was typed (e.g. "Laugavegur 18"), never a bare house number.
- **W3:** when no result is near any of your cities, run one quiet extra search biased to your cities (blank-tag Round 12b's invisible local search, kept as a safety net).

UX rulings:
1. City rule unchanged until phase 3: accept.
2. No ADD animation: accept. (Nit: the list title stays "Reykjavík" after adding into Copenhagen; that is phase 1's go-to label, revisit in phase 3.)
3. Blank city line before the first pick: accept.
4. No District outline before ADD: accept for phase 2.
5. Fixed TYPE order and 16px NOTES: accept.
6. Can't rename after a pick: BLOCKER.
7. Ranking: accept. Hall is row 2, labelled "Theatre". Merge the duplicate "Harpa · Bus stop" rows. W3 is the real ranking problem.
8. iPhone checks to add: results usable above the keyboard; pasting an address from Notes/Maps.

State:
- **Should-fix:** a pick that maps to no TYPE leaves the default **Restaurant**, so the Blue Lagoon saves with the wine fork. UX ruling: a no-match pick resets a TYPE nobody set by hand to **Other** (the blank-tag spec's rule). Add leisure=resort and water=lake to the table.
- A TYPE set by hand before typing sticks across picks: per the spec; worth an iPhone check.
- **Nit:** with no pick, a hand-set District searches in the pre-pick city.

Hierarchy: the boxed TYPE trigger plus badge outweighs the city line (owner: "The text here is louder than the other dropdown"). A Street/District shows a pin on the string while adding (owner: "Districts and streets need no map pin").

a11y: the TYPE button's name is just "Restaurant". It should read "Type: …", like the city button.

## CD: execution 7/10, not ready

The look is faithful to the approved boards: NEW stamp = CityNew, TYPE open = TypeOpen, the stub and VISITED are untouched. The densest real state shows wrong content the owner can't fix before ADD.

Predicted owner objections:
1. "I asked for auto detect. Why is the Blue Lagoon a restaurant?"
2. "I typed Blue Lagoon, it renamed it Bláa lónið, and if I fix the name it throws away the place?"
3. "Reykjavíkurborg isn't a city, and why is a bus stop the first Harpa?"

Noise: about 20 marks and 7 colours; no rejected pattern. Watch the boxed TYPE trigger (likeliest "two dropdown styles" objection) and NOTES at 16px against the address at 1x.

CD rulings: 1 accept · 2 accept, backlog the ADD moment ("State changes animate wherever they come from") · 3 accept · **4 reject, the approved TypeDetected spec shows District "with its outline"; fetch it at pick time (Nominatim /lookup polygon) or get the owner's OK** · 5 accept, NOTES hierarchy P3 · **6 reject, blocks landing (a regression; main allowed editing)** · **7 fix before landing: within a distance tier, rank real places (importance) above bus stops etc.** · 8 accept.

Fixes:
1. **(P1)** After a pick, the name stays editable without dropping the pick. Send `accept-language` (English) so names, towns and countries aren't all local-language.
2. **(P1)** Extend `OSM_TYPE_TABLE` (water:*, leisure resort/beach_resort, spa…). A no-match pick must not silently keep Restaurant; what it shows is a UX/designer call.
3. **(P2)** "NAME IT FIRST" must not show when a name is typed but nothing picked; wording is the designer's.
4. **(P2)** Result rows say "Administrative" and "Hamlet" (raw OSM vocabulary, a cousin of "no codes"); they need human type words. The NEW-city name "Reykjavíkurborg" should be "Reykjavík".
5. **(P2)** The Harpa ranking (ruling 7).
6. **(P2)** District: show the outline before ADD, or get the owner's OK. Rethink the address slot, which shows the sentence "Traced from OpenStreetMap when you add it" styled as an address.
7. **(P2)** TYPE menu (11 rows) runs to 8px above the screen bottom, over the list bar, last row cut. District and Street are reachable only by scrolling. Fit it, or open it where it fits.
8. **(P3)** Notes hierarchy at 1x; the ADD moment.

Impeccable: gate PASSED (0 new). Review: critique ~29/40, audit ~16/20; a degraded single-context run.
- Critique P1s = fixes 1 and 2.
- Audit:
  - A1 (P2): NEW stamp is aria-hidden, and the city button doesn't say "new city".
  - A2 (P3): distance note not tied by aria-describedby.
  - A3 (P3): menu max height not re-fitted on keyboard/viewport change.
  - A4 (P3): the NEW word is 9px.
- `--check-review` BLOCKED until C1/C2 are fixed.

## Conflict resolved by the operator
District outline before ADD: CD rejects, UX accepts for phase 2. The approved spec (TypeDetected) shows the outline, so the build follows the spec. This is not a new design call.
