# C · Pin+tag: how it works (round 9)

Systems, 2026-10-14. C is a trigger. The form is
`../blank-tag-form/how-it-works.md` ("Round 9" at its top overrides).
The look is visual's (`looks-and-feels.md`, `c.inc.html`). The numbers
are on the **real 202 pin positions**: `../r9-check/c-check.js`,
`c-check.json` and `deadzone.py`.

## Structure

- **The button is one object:**
  - **pin:** the app's selected pin, 32px, orange face, no glyph;
  - **string:** the real string, 14px;
  - **tag:** a 100 × 84 Hanging Tag with a navy + printed on the body
    and a three-segment stub whose first segment is ADD's navy;
  - **box:** 100 × 125.
- **Placement:** bottom-left. The tag's left edge is on the 19.9 ink line
  and its foot is 20 above the list's top edge. It rides the sheet edge
  (list up, collapsed, lowered for a tag).
- **Hit area:** the whole box (pin, string and tag). Its bare corners
  (beside the pin, 34 × 50 on each side) are inside it; it's one button.
- **`#floatingAddBtn` leaves the top-right.** The account badge sits alone
  (`right: var(--s4)`).
- **The credit:** stays bottom-right. The "Leaflet |" prefix drops below
  a 338px map (the Float's rule).

| Viewport, list up | Box | Gap to the credit |
|---|---|---|
| 390x844 | 19.9,399 – 119.9,524 | 19 |
| 390x664 | 19.9,219 – 119.9,344 | 19 |
| 375x667 | 19.9,222 – 119.9,347 | **4** (prefix kept above 338: tight) |
| 320x568 | 19.9,123 – 119.9,248 | 14 (prefix dropped) |

## Rank (job 2), on the real render

Squint mass against the 50px account badge, σ 4 / σ 8. The base frames
are the same page with the button hidden, and the account painted out.

| Variant | Opening fit (Reykjavík) | z14 (visual's CREST) |
|---|---|---|
| **Pick (ADD's navy third on the stub)** | **1.65 / 1.60** | **1.65 / 1.57** |
| Quiet (cream stub, "also tried") | 1.10 / 1.03 | 1.10 / 1.03 |

- The pick clears the director's ≥ 1.2. The quiet variant doesn't.
- My numbers sit above visual's rough ones (1.44 and 0.86): different
  background frames, same ranking.
- The pin is the app's 32, so the rank comes from the tag, as the
  director asked.

## Footprint (job 4): real pins

**At the opening fit** (5 cities × 4 viewports × list up / collapsed, 40
scenes):
- 0 pins under in 38 of 40 scenes.
- **320 list up:** Malmö 2 under; Stockholm **4 under** (+1 within 6px).
  It's the known 320 hit, and it's bigger now: the box is 100 wide.

**At street zoom (z14, random views over each city's pins, 390x664 list
up):** how often the corner object covers at least one real pin.

| City | C 100×125 | Float 60×60 | Lifted pin 52×78 (ref) |
|---|---|---|---|
| Copenhagen | 22% | 11% | 12% |
| Stockholm | 24% | 12% | 12% |
| Malmö | 29% | 15% | 16% |
| LA | 7% | 3% | 3% |
| Reykjavík | 0% (the city's spread includes Reykjanes) | 0% | 0% |

- **C covers a pin in about one street view in four in the dense cities:
  about twice the Float.** Panning frees it.
- **Cost line:** "the button covers a place in about 1 in 4 street views."
- **Dial if the director wants it:** visual's 88-wide tag. That's about
  12% less area, so roughly 20-26%; not measured.

## States

| State | C |
|---|---|
| Rest | shown at the sheet edge |
| Pressed | the face goes deep orange, the paper `--paper` |
| Tapped | the tag comes off the pin and grows into the docked blank tag (100 → 316 wide); the pin stays (hidden under the keyboard or the card) |
| While adding | hidden |
| A place's tag open | **hidden**, at every height. It's back on close. Ruled exception: +1 tap |
| Filters open | **hidden** under the panel. Close them to add. Ruled exception: +1 tap |
| Sort menu open | shown; the tap closes the sort menu first |
| After ADD | hidden while the new place's tag is open; the fresh pin+tag is there when it closes |
| Signed out (playground) | shown; adds as signed in |
| Stale stored sign-in | tap → the sign-in sheet, nothing moves |
| Plans view | shown; adds a place |
| Collapsed (Home Screen inset) | above the band; clear of the safe area |
| Desktop | the map column's bottom-left; the card sits low in the map column; not measured |

## Flows

1. **Add:**
   - tap; the tag comes off the pin and docks on the keyboard (the eyelet
     is empty);
   - type, then pick: the keyboard drops and the card settles on the
     band, 333-581 at 664, **with the map still**;
   - correct anything;
   - ADD (37-142 × 521-581): one flight brings the place to (195, 289),
     the pin drops into the eyelet, the ink-over runs, and ADD becomes
     DIRECTIONS in place;
   - close the tag: the list comes up with the row in view, and the
     fresh pin+tag is back.
2. **Cancel:** × → the card shrinks back onto the pin. Everything is
   restored and the draft is kept.
3. **A tag is open, or the filters are open:** close it, then flow 1.
4. **New city, district, errors:** as in the form spec (answers in the
   stub).

## Coverage against jobs.md (round 9)

| Job | C | Where |
|---|---|---|
| 1 Reach | **yes, with 2 ruled exceptions** (tag open, filters open: +1 tap); thumb side left | C1, C4 + its cost line |
| 2 Main action; reads as + and as a pin | yes: 1.65x the account, the app's own 32 pin | C2 (1x + squint), C5 |
| 3 Know what you'll fill out | **yes, strongest of the set**: the button is the tag | C3 (tap: the tag comes off the pin) |
| 4 Never in the way | **yes, with a cost**: 0 at the opening fit except 320 (Malmö 2, Stockholm 4); 22-29% of street views in dense cities | footprint |
| 5 Signed out | yes | states (spec) |
| 6-7 | yes | T1, T2, T8 |
| 8 Words say where; the map shows it on ADD | yes | T3 (the card, the map still), T5 (the flight + pin-in) |
| 9-11 | yes | T3, T4 |
| 12 Finish near the thumb | yes (ADD 521-581 at 664, 425-485 at 320) | T3, T8 |
| 13 Watch it become the place | yes | T5 |
| 14 Districts | yes | T6 |
| 15 Never lose it | yes | T7 (failed), T2 (no results); cancel in the spec |
| 16 Straight answers; answers are buttons | yes: the answers are in the stub | T7 |
| 17 Everything tappable looks it | **yes for the look; the hit areas need the row rule** (the × / city chip overlap) | T9; form spec "Round 9" flag 2 |

**No unsupported job.** Two costs are owner-visible:
- the exceptions (job 1);
- covering a pin in about 1 street view in 4 (job 4).

There's one builder rule: the hit areas.
