# Jobs check 6: concept 5 (city buckets, trip tags)

A fresh checker read only `owner.md`, `jobs.md`,
`concepts/5-city-buckets-trip-tags.md` and `concepts/overview-3x.png`.
The check is strict: a check passes only if the concept file states the
outcome. "Q-x" marks a pass that depends on an open owner question.

## Verdict

The model is close, and it matches the owner's reframe. It has **two real
contradictions** to fix before it goes to the owner:

1. **The guess is "as today", but today's guess asks a question.** Rule 1
   says the bucket is "never asked and never blocks ADD". "Today vs. this
   model" says "the add form's guess and override ... stay as they are",
   and the overview says "Logging stays exactly as today". jobs.md
   ("Today, for reference") records that today a pin outside every city
   triggers the new-city question (`maybeDetectCity()`), and that today
   fails check 9 because of it. Both statements can't be true. The file
   also never says what the bucket is pre-filled with when no bucket is
   near: the first place on an empty start, Jönköping, or anything beyond
   Q-B's day-trip radius.
2. **"Hiding a trip hides its places" breaks when it's the only trip
   shown.** Rule 3 and the "city outside every trip" answer together say
   this: with no trip narrowing the view, every place shows. So hiding
   the only shown trip returns to the full view, and its places stay
   visible. Rule 3 needs to say what hide means: unselecting the filter
   or excluding the trip's places. When two trips share a city (Q-C),
   it also needs to say whether showing A and hiding B shows Copenhagen.

## The governing rule

| Check | Result | Why |
|---|---|---|
| **P** Log or see places immediately | **PASS, contradicted** | Rule 1: "never asked and never blocks ADD"; rule 2: "Trips are optional: nothing needs one." Contradiction 1 above undercuts this until the no-match case is stated. |

## Model checks

| # | Check | Result | Where it's stated / what's missing |
|---|---|---|---|
| 1 | Log a place with no trip | **PASS** | Rule 2 ("nothing needs one"). "A city outside every trip ... shows when no trip is narrowing the view." |
| 2 | A bucket holds a place outside its real town | **PASS** (by the pick); by the guess **only with Q-B** | Rule 1 names the Blue Lagoon in Reykjavík, with the pick at add. |
| 3 | Both truths | **PASS as a rule; the data claim doesn't hold** | Rule 1 says a place "**always** exposes" its real town. The Prerequisite says 59 of 202 places have no real town, and 1 of those has details but no town, so the backfill won't fix it. "Always" is false today, and "doesn't block anything" is false for check 3. Say "once the backfill runs, except where Nominatim has no town". |
| 4 | Trips are tags made after | **PASS** | Rule 2; "A city in more than one trip: yes"; Q5 "any number". |
| 5 | Showing trips | **PASS** for narrowing the list and the map together (rule 3; "The list and the map"); **several at once only with Q-C**; **hide is contradicted** (contradiction 2 above) | |
| 6 | City filter sits under the trip | **PASS** | "The city filter: stays ... showing a trip narrows the city filter to that trip's cities". |
| 7 | Plans | **PASS** | "A plan's stops can be in any city. A trip shows the plans with a stop in its cities." |
| 8 | Repeat trip | **PASS** | Prices: "unless the owner makes a separate bucket ("Copenhagen 2028")". See break case B for an unstated cost. |
| 9 | Nothing structural at add | **PASS as stated, contradicted** | Rule 1 states it. "Stay as they are" and the missing no-match pre-fill (contradiction 1) contradict it. |
| 10 | A wrong bucket can be fixed | **PASS only with Q-D; FAIL without it** | The gap is stated in Prices and in Q-D. Also unstated: whether a city can be removed from a trip. A wrong tag is the trip-side twin of a wrong bucket. |

## Creation moment

| # | Result | Why |
|---|---|---|
| C1 First open, empty | **FAIL (not stated)** | The file says no trip is needed. It never says that search is worldwide or what the first place's bucket is when none exists. It also keeps cities "as today: the `cities` registry", and jobs.md records that today fails C1 because cities are seeded before any place. |

## Test cases

| Case | Result | Note |
|---|---|---|
| T1 Øresund | **PASS** | Follows from rule 1 and the pick. Malmö is its own bucket (Q8). |
| T2 Airport | **PASS** (Keflavík by the guess only with Q-B) | Stated: "Kastrup sits in Copenhagen or Malmö, not both. A trip tagging both cities shows it either way." |
| T3 Jönköping | **PASS by the pick / a new bucket; the guess is unpredictable** | No bucket is within a day trip, so rule 1's pre-fill is undefined. Today, this case asks the new-city question (contradiction 1). Joining the trip takes a manual tag, or Q-A if it is answered yes. |
| T4 Copenhagen 2028 | **PASS with Q-D**; without it, the 2026 leftovers stay in 2026's bucket | Matches the Prices section. |

## (a) Match to the owner's reframe

These parts match: cities "continue to operate as today" as buckets that
can hold outside places; a tag groups cities into a meta-trip; show/hide
by trip; the owner's "or somehow manually" maps to Q-D. Q-A and Q-B are
honestly marked "(We think)", and Q-A's risk is named.

These are not marked as the team's opinion, despite the header's "(We
think) marks the team's opinion; everything else is the owner's or
today's fact":

- **Both truths is presented as a rule (inside rule 1).** The owner
  didn't ask for it in the reframe, and it isn't today's fact (jobs.md:
  today fails 3, "the real town isn't shown"). The phrase "never pretends
  to be in Reykjavík" leans against the owner's wish that the Blue Lagoon
  *is* part of Reykjavík. Mark it "(We think)", or make it an owner
  question.
- **"The only new thing is the trip tag and its show/hide"** is false.
  Both truths is also new, the move edit is new if Q-D is answered yes,
  and "never asked" differs from today's new-city question.
- **"Show / hide on the map means that filter, not a map-only layer."**
  This is the team's reading of the owner's "show / hide on the map",
  grounded in CLAUDE.md. It is defensible, but it is an interpretation
  and is not marked as one.

## (b) Predict where a place lands from the numbered rules alone

Predictable **only when a bucket is near the pin**. The rules don't
cover three cases:

- **No bucket nearby:** the first place, Jönköping, or anything past Q-B's
  radius. The pre-fill is undefined.
- **Two buckets on the same ground:** "Copenhagen" and "Copenhagen
  2028". The rules don't say which one the guess picks.
- **The guess method itself:** today's box match or Q-B's nearest
  bucket. This is pending, so Blue Lagoon and Keflavík can't be
  predicted from the rules alone. The pick always overrides.

## (c) Overview at phone size, and agreement with the file

It reads at phone size: one column, body text at roughly 13–14pt
equivalent, and good contrast. It mostly agrees with the file. It has
these mismatches:

- **"Logging stays exactly as today"** carries contradiction 1 into the
  owner-facing summary.
- **Q-B says "(we think 60–80 km)".** The file gives no number, only
  "about a day trip". Either add the number to the file or drop it from
  the overview.
- **It doesn't mention the 59-place gap** behind "Both truths on every
  place".

## Break cases tried

- **A. Show one trip, then hide it.** It returns to "no trip narrowing",
  so its places show again. This is contradiction 2.
- **B. Copenhagen 2028.** After the owner makes the bucket, every new
  2028 place near Copenhagen gets a guess that isn't defined between two
  co-located buckets. Unless it is picked by hand each time, it likely
  lands in 2026's Copenhagen. Q-A doesn't help, because it only covers a
  city *created* while viewing a trip. The file prices the separate
  bucket but not the per-add pick. This is a real unstated cost, not a
  contradiction.

## Fixes needed before the owner sees it

1. State the pre-fill when no bucket matches, and remove "stay as they
   are" / "exactly as today" for the guess, or say the new-city question
   goes away.
2. Define hide in rule 3, including the shared-city case under Q-C.
3. Mark both truths as "(We think)", or turn it into an owner question.
   Soften "always" to match the 59 places that have no real town.
4. Line up the overview: the guess wording and the 60–80 km figure.
5. Optional: say how the guess picks between co-located buckets, and
   whether a city can be untagged from a trip.
