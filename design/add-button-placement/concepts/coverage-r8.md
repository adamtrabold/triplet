# Jobs coverage, round 8b: P (blank pin) and A (header tag)

Systems, 2026-10-14. Every job in `../jobs.md` is checked against each
concept.
- "Where" names the still that shows it, or the spec section that
  defines it.
- Specs:
  - `blank-tag-form/how-it-works.md` (FORM);
  - `P-blank-pin/how-it-works.md` (P);
  - `A-header-tag/how-it-works.md` (A).
- The stills were looked at as shot before visual's mechanical re-shoots
  (credit clearance, T4 note wrap, A3-tap pan). Those don't change
  behaviour.

**Verdict: no unsupported job on either concept. Both go forward.**
- P carries its ruled job-1 exceptions as a plain cost line, shown in
  P4.
- One spec item isn't in any still yet: the line that grows for a long
  note. The T4 re-shoot will show it.

## The + jobs

| # | Job | P | Where (P) | A | Where (A) |
|---|---|---|---|---|---|
| 1 | Reach with your thumb, every state | **Yes, with the ruled exceptions**: a tag open or the filters open costs +1 tap (close first). Thumb side: left | P1 (rest), P4 (tag open + the cost line); P "States of the trigger" | **Yes, no exceptions.** Thumb side: right (its cost line, in his words) | A1, A4 ("no extra step, here or with the filters open"); A "States" |
| 2 | Main action above the account; reads as + (and P as a pin) | Yes: 1.40x the account's squint mass; the needle and ground contact read "pin", not FAB | P2 (1x, pin or button), P5 (sizes); P "Rank" | Yes: the only orange object on the band, the whole map away from the account | A1, A2 (1x) |
| 3 | Know what you're about to fill out | Yes: the string the tag comes down is there at rest | P3-tap (rest → tapped) | Yes: a tag's cut end, the tag pulls out of it | A3-tap |
| 4 | + never in the way | Yes: 0 of the 202 real pins under it in 5 cities, at 4 sizes; hidden under a tag; the credit is clear (320 drops the prefix) | P "Collisions"; `pass-a-check/` | Yes: it lives in the band, no map dead zone | A "Collisions" |
| 5 | Works signed out | Yes: the playground adds as signed in; a stale sign-in asks and nothing moves | P "States" (spec) | Yes, the same | A "States" (spec) |

## The blank-tag jobs (shared form; the same for P and A)

| # | Job | P / A | Where |
|---|---|---|---|
| 6 | Write the name, the app does the rest (tap, type, pick, ADD) | Yes | T1 (typing), T3 (picked, all pre-filled in pencil); FORM "Pre-fill". The keyboard rising on the tap is an iPhone check; the fallback is +1 tap |
| 7 | Search on the tag, ≥ 3 results at 664 | Yes: 3.3 at 664/667, 3.5 at 844 Home Screen, 3.2 at 320 | T1, T8 (320 typing: 3 + a peek); FORM "Numbers". The 375x629 mini tab (2.9) is an iPhone check |
| 8 | See where it goes before committing | Yes | T3 (the pin on the spot, the tag hanging); P3-tap / A3-tap → T3 |
| 9 | Say the type: pre-filled in pencil, one tap to change | Yes | T3, T6 (TYPE with a chevron); FORM "Pre-fill". The OSM mapping is untestable here (cost line) |
| 10 | Star it and note why while adding | Yes | T4 (starred: the band; visited); NOTES line in T3 |
| 11 | See exactly what you'll get (the real tag's layout) | Yes | T3 → T5 (after = the real tag at once); T0 (pencil isn't "disabled") |
| 12 | Finish near your thumb | Yes: ADD is at the stub's foot (528-588 at 664; it moves to the credit's top − 6 in the re-shoot, still in the thumb zone) | T3, T5, T7; FORM "Numbers" |
| 13 | Watch the blank become the place | Yes: the ink-over, DIRECTIONS in the same spot, the pin takes its icon; the list stays down and comes up with the row in view on close (city switch if needed) | T5 (before / after); FORM "After ADD". The city switch and the row in view are spec only, and P4/A4 show the list state the row lands in |
| 14 | Districts and streets through the same tag | Yes | T6 (district: the hint line, the pin held above, the same ADD); FORM "District / Street", the shape states, "No outline and no spot". The after-ADD outline is spec only |
| 15 | Never lose what you wrote | Yes | T7 right (save failed, all kept); T2 right (no results, the text stays); FORM "Cancel and draft" (spec) |
| 16 | A straight answer when unclear or failing | Yes | T2 (no results), T7 (new city with two answers; couldn't save); FORM states (timeout, which-city, double miss, stale sign-in) |

## Scope questions (not blockers; with the director's send list)

| Job | Covered? |
|---|---|
| Mark it visited while adding | Built in: MARK VISITED on the blank stub (T3-T7, T4 stamped) |
| Fix a place after adding (the tag in pencil again) | Not built; one option still if he wants it (the director's owner question 2) |

## Notes for the builder (not job failures)

- **Lines grow:** `.bt-f` `height: 32px` → `min-height: 32px` (ruled).
  Shown once, in the T4 re-shoot.
- **The no-move rule after the credit fix:** the hanging tag's foot =
  the credit's top − 6. Shrink-by-the-top on ADD and the map pan keep it
  there.
- **The T7 "new city" question raises the picked tag's height.** The foot
  is held by the same pan rule, so ADD doesn't move when the question
  appears or is answered.
- **iPhone checks queued by this concept:**
  - the keyboard rising from the + tap;
  - the `visualViewport` dock;
  - `panBy` in step with the 300ms shrink;
  - the 375x629 row count;
  - the OSM type mapping.
