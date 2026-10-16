# Icon system: history

A dated timeline of the real moments in this project: rounds shown to the owner, decisions, reversals. One entry per moment, newest at the bottom. Each entry gives what he saw, his words (verbatim, from `owner.md`), what was decided, and where the evidence is. The orchestrator adds an entry at every such moment. This is the spine for a case study.

Evidence lives in the repo (git keeps every version; to see any stage, `git checkout <commit> -- design/icon-system`); the review canvas is https://claude.ai/artifact/SVKZ9PpaMCKUpk7Ks622jW (superseded rounds go to its Archive page).

---

### 2026-10-07: the ask
**Words:** "they're too noisy, the approacah we're using the checked items are stronger visually than the open ones. the icon system needs more clarity... i need a full rev."
**Outcome:** icon revision added to the priorities.

### 2026-10-13: crew and a shared canvas
**Words:** "could we get another crew up on that? and is it possible to use /design to have a shared canvas? i want to see every icon in the app up next to each other."
**Outcome:** an inventory of all 74 icons in the app went on the Design canvas.
**Evidence:** `inventory.md`, `inventory-png/`, `inventory-3x.png`.

### 2026-10-14: false start, then a reset
**Seen:** the crew's visited-state concepts and "grammar" boards, built from the old 10-07 backlog quote.
**Words:** "Visited should not change. Also I never told you what I wanted changed so what were these agents off doing", then on the canvas: "What the fuck is all of this stuff on the canvas all I want is every icon side by side"
**Outcome:** that work was superseded and the canvas cut back to one board of every icon. New scope: "First off I want the team to think of brand approach to icons conceptually … After I approve a direction or directions there, the team will research best practices … develop a shared grid system … These should be svgs".
**Lesson:** brief from the owner's current words, not old backlog lines.
**Evidence:** `concepts/` (superseded), `owner.md`.

### 2026-10-14: brand directions, round 1 (v4 cards)
**Seen:** the brand card ("Printed with care, marked by hand, kept like a souvenir"), Today, Field Guide, Timetable Sorts, side by side, and a dropped card.
**Words:** "I think the pin/place icons need to be solid and outlined icons should be used when something has yet to be tapped by me like Star and visited. So field guide, cut paper, spot pictograph are working best for me — and they can be inside a stroked circle"
**Outcome:** his rule became the system: places solid, outlined means not marked yet. He revived two directions the team had dropped (Cut Paper, Spot).
**Evidence:** `brand-approach/concepts/sketches/v4-card-*.png`.

### 2026-10-15: the + joins the project
**Words (relayed from the + session):** "Build the matched icon but we need to include this in the icon project everything is inconsistent"
**Outcome:** one line weight for everything, measured on screen: 2.00px.

### 2026-10-15: brand directions, round 3 (v6 cards): Constructed chosen
**Seen:** the rules card, Today, Specimen (cut), Constructed (built on a 2px grid), side by side, dropped (Roundel and others).
**Words:** "the clarity is best with built. i think through subtle rounding, etc. we can get some of the warmth / mimicry of the inspo / vintage roadtrip brochures/pamphlets/ etc. the rest risk feeling amateurish. its interesting that your calls have been the exact opposite of mine, i wonder why."
**Outcome:** Constructed was chosen. The team's bias (rewarding hand-made and novel) was named and corrected.
**Evidence:** `brand-approach/concepts/sketches/v6-card-*.png`, `brand-approach/scores.md`.

### 2026-10-15: whimsy, novelty, and not over-reading him
**Words:**
- "i do think whimsy is totally great; there is not one correct way to show whimsy though and the craft matters most … i do think built can still be whimsical."
- "im wondering if built in context of the rest of the app still feels novel … something to consider but not lock on."
- On a summary rule: "this is a bad rule … "never a hand made look" is bad … handmade can come from many angles -- construction method, textural approach, the inkblot thing, etc."
- Then: "these are just examples. not exhaustive. again you are overstating my intent."

**Outcome:** taste rules rewritten in `docs/owner-taste.md`.
**Lesson:** quote him; don't harden his words into rules.

### 2026-10-15: concept per icon, round 1 (t4)
**Seen:** six cards with the common sign vs "our objects", at least two concepts per icon, rough builds. He asked for a desktop review: "put these in the design canvas i dont need this mocked on a phone".
**Outcome:** the review moved to the Design canvas.
**Evidence:** `icon-concepts/sketches/t4-card-*.png`, `t4.html`.

### 2026-10-15: new inspo: US federal recreation signs
**Words:** "there are official icons from the us government for roadside attractions and such... we should use these as inspo … i dont want them to just use them outright, but this gives "built" more legs as a concept"
**Outcome:** the 129 MUTCD brown symbols went into `design/inspo/mutcd-recreation/`. Lessons: one frame and one ink make the system, and the wit comes from what the object is doing.
**Evidence:** `icon-concepts/sketches/t5-mutcd-tests.png`.

### 2026-10-15: canvas picks on t4
**Words (comments):** shopping "bag is easier to understand at a glance"; street "walker is the best here"; hotel "bed is the best here"; other "i like the asterisk"; restaurant and nature A. Café "need to push here", bar "not differentiated enough from cafe", attraction "i wonder if the nordic loop works the best here". On area: "area and district are not differentiated enough from each other conceptually".
**Outcome:** picks recorded. Area vs district opened a bigger question.

### 2026-10-15 to 16: the category model rethink
**Words:** "i actually think we're uncovering a flaw in the data model. things like squares are really not quite areas either … a street however is closer to a district (but not quite) and *should* have a box". Then a long pressure-test, including:
- "if i'd go there if there wasn't a show happening" (venue)
- "what about like plymouth rock" (landmark vs nature)
- "what if im with my kid and i just want to see what parks i marked" (park)
- "13 icons is just too many regardless"
- "sometimes i do just want to go to a museum"

**Outcome:** locked at 11 pins and 2 shapes: Restaurant, Café, Bar, Venue, Museum, Landmark, Attraction, Park, Nature, Shopping, Hotel, plus Neighbourhood and Street.
- The tests: "what am I doing there?" and "would I filter for just these?"
- Area and Other were dropped.
- The migration covers every place: 183 pins and 9 new shapes.

**Lesson:** an icon question can be a data-model question.
**Evidence:** `categories.md`, https://claude.ai/artifact/XANh5kcCLzEy4csb8pNYyt.

### 2026-10-16: concept per icon, round 2 (t6) on the canvas
**Seen:** all 13 side by side; the surviving options for café, bar, venue, museum, landmark, attraction, park and nature; one-ink neighbour comparisons; the dropped list.
**Asked:** "For each open icon — café, bar, venue, museum, landmark, attraction, park, nature — which one, or neither?" and whether the ⌘ loop moves to Landmark.
**Evidence:** `icon-concepts/sketches/t6.html`, the canvas "Icon concepts" page.

---

## Milestone commits

(Git tags can't be pushed from this environment, so these commits stand in for them.)

| Milestone | Commit |
|---|---|
| Inventory of every icon | 1360b50 |
| v4 brand cards shown | baec7a9 |
| v6 cards shown, Constructed chosen | a8a583f / ec6cc11 |
| t4 concept cards | 2717977 |
| Categories locked | db40060 |
