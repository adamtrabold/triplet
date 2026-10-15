# Jobs check 7: concept 5 (city buckets, trip tags)

A fresh checker read only `owner.md`, `jobs.md`,
`concepts/5-city-buckets-trip-tags.md`, `concepts/overview-3x.png` and
`jobs-check-6.md`. This is a model-only check. Nothing fails for lacking UI.
A check passes only if the concept file states the outcome.

## Verdict

Every check in jobs.md passes, and both check-6 contradictions are
resolved. There are no contradictions that block the model. Four small
points are listed at the end. One of them is a real gap in predictability:
a city with no places can't be guessed into.

## Check-6 contradictions

| # | Check 6 | Now | Result |
|---|---|---|---|
| 1 | The guess was described "as today", but today asks the new-city question. The pre-fill when no bucket is near was undefined. | Rule 1 says the guess is the nearest bucket within a day trip. If there is none, the guess is a new bucket named from the real town, made on ADD. The file says this replaces today's question (marked "we think"). "What changes from today" lists both changes. "Stays as today" and "exactly as today" are gone from the file and the overview. | **Resolved** |
| 2 | Hiding the only shown trip brought back everything. The shared-city case was undefined. | Rule 3 says hiding means deselecting, and deselecting the last trip returns to everything. There is no exclude mode (marked "we think" and grounded in CLAUDE.md). A city in two trips shows if either trip is selected. | **Resolved.** Hide now has a defined meaning. Under this reading, the only way to hide a single trip's places is to select other trips. The file says this openly. |

## The governing rule

| Check | Result | Where |
|---|---|---|
| **P** Log or see places immediately | **PASS** | Rule 1: "Nothing is asked and nothing blocks ADD". Rule 2: "Trips are optional: nothing needs one." |

## Model checks

| # | Result | Where |
|---|---|---|
| 1 No trip | **PASS** | Rule 2 makes trips optional. Rule 3: with no trip selected, "every place shows, whether or not its city is in a trip". |
| 2 Outside its real town | **PASS** | Rule 1 covers the guess (Blue Lagoon is about 40 km from Reykjavík, inside 60-80 km) and the pick ("the Blue Lagoon in Reykjavík"). |
| 3 Both truths | **PASS** | Rule 1 gives "Reykjavík · in Grindavík". The Prices section gives the 59/58/1 gap, which matches jobs.md. The old "always" claim is gone. |
| 4 Trips are tags | **PASS** | Rule 2 covers tagging after, optionally at city creation (A), never at place add (D), any number of trips, several trips per city, and joining automatically. |
| 5 Trip filter | **PASS** | Rule 3 covers none or any-of, list and map together, the last deselect, and a shared city. |
| 6 City filter under the trip | **PASS** | "The rest": with trips selected, the filter picks among their cities. With none, it picks among all. |
| 7 Plans | **PASS** | "The rest": stops can be in any city, and a trip shows plans with a stop in its cities. |
| 8 Repeat trip | **PASS** | Rule 2 says a repeat trip re-tags the same city and shows all its places under both trips. Prices: "A repeat trip never needs this". Check-6 break case B (Copenhagen 2028 as a second bucket) no longer applies. |
| 9 Nothing structural at add | **PASS** | Rule 1: the bucket is always pre-filled, either an existing bucket or a new one, and is never asked for. |
| 10 Wrong guess fixed | **PASS** | Rule 1 (Q-D): the place's city can be edited after adding, and never its city's trips from a place. Prices: this is new work. |
| C1 First open | **PASS** | "The rest": no buckets, no trips, worldwide search, and the first place makes its bucket. |
| T1 Øresund | **PASS** | Follows from rule 1 and rule 3. |
| T2 Airport | **PASS** | Keflavík goes to Reykjavík by the guess. Kastrup is in one bucket. Prices: "A trip tagging both cities shows it either way". |
| T3 Jönköping | **PASS** | No bucket is within reach, so the guess is a new bucket named "Jönköping". It joins a trip only when tagged. |
| T4 Copenhagen 2028 | **PASS** | Covered by rule 2's repeat-trip line. |

## Owner fidelity

Every owner answer is reflected, and quoted verbatim where the file quotes
it:

- reframe: buckets, trip tags, show/hide;
- A: optional and low prominence, at city creation;
- B: both truths, plus the guess;
- C: several trips at once;
- D: a place joins its city's trips automatically, and trips are never
  tagged while adding a place;
- Q-D: a place's city can be edited, never its city's trips from a place;
- repeat trips;
- many trips per city.

The many-trips answer is correctly labelled as the owner's "current
guess". The one open question (seeing the trip at add) is stated as open.
The team's additions are marked "(we think)": the 60-80 km figure, the
replacement of the new-city question, and no exclude mode.

Minor labelling points:

- **The rule for a new bucket named from the real town** isn't the
  owner's words. Only "this replaces today's new-city question" carries
  "(we think)". The rule follows from places-first and is very nearly
  covered by that label, so it doesn't need fixing. The overview states it
  with no label.
- **"Measured to the centre of that bucket's places" is credited to
  Q-B "Yes".** The wording of Q-B isn't recorded in `owner.md`, so this
  checker can't confirm the owner agreed to centre-of-places, as opposed
  to just "nearest". If the question said so, it's fine. If not, mark it
  "(we think)".
- **"Untagged" in rule 2** (a city can be removed from a trip) wasn't
  asked for. It is implied by tagging, so it is harmless.

## Predictability

A reader can predict where a place lands from rule 1. The guess is the
nearest bucket by distance to the centre of its places, up to about 60-80
km. Otherwise it's a new bucket named from the real town, and the pick
always overrides. The 60-80 km band is honestly marked as unmeasured.
Co-located buckets are priced ("pick by hand").

**One gap (real, unstated):** "the centre of that bucket's places" isn't
defined for a bucket with **no places**. That covers a city created on its
own (rule 2 / A allows it) and a seeded city with no pins yet. As written,
the guess can never choose such a city. A place near it would get a new
bucket named from its real town, which could duplicate the empty city. The
file should say what an empty bucket's centre is, for example its geocoded
point (we think).

## Overview at phone size

It reads well at phone size: one column, large body text, good contrast.
It agrees with the file on all of these:

- the pre-fill and the 60-80 km figure (now in both);
- never asked;
- tags afterwards;
- many trips, repeat trips;
- none picked shows everything;
- the 59/58 gap;
- the Costs section;
- the decisions A to D and Q-D;
- the one open question;
- the parked Q3/Q4.

Small differences, none of which contradict the file:

- The overview leaves out "hiding = deselecting; no exclude mode". That's
  acceptable for a summary.
- It states "A city can be in many trips" without "your current guess".

## Small wording tensions in the file (not blocking)

- **"What's stored" says the real town is "shown, never used for
  filing".** Rule 1 names new buckets from it. It doesn't choose among
  existing buckets, but "never used" overstates this. Suggested wording:
  "never used to pick a bucket".
- **"Unchanged: ... the city filter".** The filter now narrows to the
  selected trips' cities. That's an addition, not unchanged.
- **"What changes from today" leaves out C1:** worldwide search, and no
  seeded cities on a fresh start. Today seeds cities and widens search only
  on a miss.
