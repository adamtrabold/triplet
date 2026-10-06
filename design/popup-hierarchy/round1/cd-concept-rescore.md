# Popup hierarchy, Round 1: CD concept rescore (ideas, not mocks)

Fresh CD, 2026-10-05. I did not author, suggest or previously score any of
this work, and I did not read `cd-review.md`. Role (owner): "cd on overall
adherence to project and brand goals and presence/identity".

## How this was scored

The owner's correction overrides the CD brief here:

- "we're trying to rate concepts here not execution — tell cd don't kill if
  the mock was bad kill if the idea was bad. Replacing list with info is a
  fine thing to explore."
- "Don't pay attention to old feedback ignore it. The type thing I mean."
  Type placement is open. "Type goes above the name" is **not** a criterion
  below, even though the ledger still lists it.
- "Type is actually tier 2 imo — or bottom of tier 1. Notes are tier 1".

So each score is for the structure, executed well. A rejected-pattern cap
(score 6 max) applies only when the pattern is inherent to the idea. Mock
slips are listed separately as fixes for the designer.

**Ledger rules that apply** (`docs/owner-taste.md`): simple, simple, simple;
no dots or decoration; no second row of text (where it adds a row); no heavy
rules or boxes; colour must communicate; secondary marks never outrank
content; busy views keep their hierarchy; no star unless starred; a measured
spacing system; one left channel and one centred axis; the same category
icon treatment on the map and in the popup; one visited language (a stamp
on rows, a sticker on pins); reuse existing controls; controls don't move or
grow; continuity between surfaces; fewer variations.

**Goal, restated as the test:** at first glance on a phone, show the
**name, the notes and your marks** (tier 1), with type light. Keep Directions
and Visited one tap away (tier 2). Keep the address available on demand
(tier 4). Hold up under real density (notes p90 = 109 chars, max 357;
addresses avg 103 chars). Don't hide the map neighbourhood. Feel like
Triplet (paper, ink, stamps, ledger rows), not a generic callout.

**Busiest state looked at first:** `<concept>/busiest-phone@1x.png` (VEGA:
starred, visited, Stop 2 of 3, 5-line note, 3-line OSM address), then
`busiest-crop@3x.png`, then `busiest-x-*` and `bare`/`shape` where the idea
depends on them. The map is a stand-in, so I only judged occlusion and the
label idea relative to it.

## Ranking

| # | Concept | Score (idea) | Verdict | One line |
|---|---|---|---|---|
| 1 | 3 Place Sheet | 8 | KEEP | Place info takes the list's slot. Leaves the map clear, gives notes room and reuses the header system. Best answer to density. |
| 2 | 4 Row Unfolds | 8 | KEEP | The row *is* the card. Strongest continuity and parity, and fixes the two-selection-states bug. |
| 3 | 1 Quiet Fix | 6 | KEEP (as baseline) | The right order and spacing, but it doesn't answer density. It's the floor the others must beat. |
| 4 | 2 Folded Note | 6 | KEEP (merge into 1) | A height ceiling for the in-map card. Only valid if the fold hides the long tail and the address, never the typical note. |
| 5 | 6 Map Label + Dock | 5 | KILL (donor) | Splits tier 1 across two surfaces and stacks a third layer on the sheet. The on-map name label is worth harvesting. |
| 6 | 7 Action Rail | 4 | KILL (donor) | Gives tier-1 width to tier-2 controls, its height is set by controls, and it's a column of tiles. The locality line is worth harvesting. |
| 7 | 8 Luggage Label | 4 | KILL | A colour block whose job is decoration, and a caps name band that outranks the notes. Strong brand idea in the wrong place. |
| 8 | 5 Side Tab | 3 | KILL | Hiding tier 1 (notes) behind a tab *is* the idea. Vertical caps, edge-swipe collisions, a drawer over the map. |

The owner asked for "fewer variations". Round 2 should carry **three
tracks**: Place Sheet, Row Unfolds, and Quiet Fix + Folded Note merged as the
in-map control. The three donors (on-map label, locality line, seal = pin)
go into those tracks rather than surviving as concepts of their own.

---

## 1. Quiet Fix: 6, KEEP (baseline)

**Strongest version.** Can a single in-map card hold everything once
hierarchy and spacing are fixed? Today's problems are mostly order and
weight (address 2.4x the name, notes styled as fine print, air from
invisible tap boxes), not location. This concept tests how far order alone
gets.

**Idea-level risks.**
- It doesn't answer the owner's second ask ("more ideas for displaying so
  *much* density"). It only orders the density. The busiest card is ~300 px
  tall over a 544 px map strip (`quiet/busiest-phone@1x.png`), so neighbours
  are hidden while you decide.
- With everything in one box, the notes slab (rightly tier 1) and the
  address slab stack into one grey-and-ink block. The hierarchy then depends
  entirely on type styling, with no structural help.

**Why KEEP.** Every other concept needs a control to be measured against,
and it may still be the right answer for short notes. Merge it with 2.

**Mock flaws.**
1. Doubled star: a filled star before the name *and* a filled "★ STARRED"
   in the action row (`quiet/busiest-crop@3x.png`). One mark of state, and
   the control reads as a control.
2. The action row puts three different languages side by side: coloured
   Directions, a black star and word, and a navy stamp at a slight tilt. The
   stamp is the heaviest object in the row. Recheck its weight against the
   name.
3. The address runs 4 lines at full OSM length. Shorten it (see donor 7) or
   fold it, even in the baseline.
4. `quiet/bare-crop@3x.png`: an unexplained gap between the name and the
   action row (around 2 line heights) is still bigger than the gap from the
   badge to the name. Check it against the `--s*` scale.
5. The badge sits in the 28 px column, but the title text starts at 40 px
   while the action row's compass sits on the same axis. Confirm that one
   optical axis holds across the badge, compass and star.

## 2. Folded Note: 6, KEEP (merge into 1)

**Strongest version.** Is there a fixed height ceiling for the in-map card,
so that the long tail (8-line notes, 4-line addresses) never decides how
much map you lose, while the typical note is still read whole at a glance?

**Idea-level risks.**
- Folding is the mechanism, and notes are tier 1. If the fold ever bites
  into a typical note, it fails the owner's tier. As drawn (a 2-line peek),
  it does (`fold/busiest-crop@3x.png`, the note cut mid-word "Sat Sep").
  Folding is only safe at about 3 lines or more, collapsing the tail and the
  address.
- The card changes height on More and Less. Growing upward keeps the
  actions still, which is right. It is still a resize in place.

**Why KEEP.** As a ceiling on Quiet Fix, it is the cheapest real density
answer that keeps everything at the pin. Together they make one track.

**Mock flaws.**
1. The 2-line peek is too short. Peek a typical note whole and fold only the
   tail plus the address.
2. "MORE" in figure-deep makes a second coloured word next to Directions, so
   colour no longer means "the action". Make it neutral.
3. The fade-out clipping plus "MORE" on the same line reads as a cut-off
   word. Use a clean line end.
4. The "ADDRESS" caps label in the unfolded state adds a row of text. The
   address doesn't need a label (it is self-evident).
5. The same doubled star as 1.

## 3. Place Sheet: 8, KEEP

**Strongest version.** When you tap a place, the bottom slot (the list's
slot) becomes that place, in the same ledger and header language as the
list. The map above stays fully readable, so "where is it, what's near"
and "why did I save it" are both visible at once. The owner endorsed the
direction: "Replacing list with info is a fine thing to explore."

**Why it scores.**
- It is the only concept where density stops fighting the map. The notes
  get a full-width column (`sheet/busiest-x-phone@1x.png`), and nothing
  covers the map above the sheet (`sheet/busiest-phone@1x.png`).
- Identity: it reuses the list header (badge on the 28 px spine, name,
  action column), so it reads as Triplet's own surface rather than a
  Leaflet bubble. It is also the platform convention (Apple and Google Maps
  place sheets).
- It answers "Header names the current list ... either the place or the
  plan" naturally: now the header names the place.

**Idea-level risks.**
- **The list is gone while a place is open.** Coming from the list
  (J10), you tap a row and the list is replaced. Return must restore the
  scroll, the filters and the selection exactly (C9). Otherwise it reads as
  losing your place. This is the risk the owner will feel first.
- **Two things share one slot.** The list sheet and the place sheet need
  one clear rule for which is showing, and one dismiss gesture. Otherwise
  the "Plans / Places" mode metaphor grows a third mode.
- **The link from pin to info is weaker than a tip.** With no callout, only
  the selected pin connects the map to the sheet. If the pin is panned off
  or clustered, the sheet floats. A quiet on-map name label (donor from 6)
  fixes this.
- **Height varies by place,** so the map edge moves between places
  (`sheet/bare` vs `busiest`). Decide whether the sheet uses fixed detents
  rather than sizing to content ("controls don't move or grow").

**Mock flaws.**
1. The actions sit **above** the notes (`sheet/busiest-crop@3x.png`), so tier
   2 outranks tier 1 by position. Put the notes first or level with the
   actions, not behind them.
2. Two full-width hairlines box the action strip: a heavy rules-and-boxes
   pattern, which is execution, not idea. Drop them or space with `--s*`.
3. A 3-line peek truncating with "..." on a 5-line note. Fine for p90,
   but show the fold affordance as part of the sheet grab, not mid-sentence.
4. The doubled star again (the leading star plus "★ STARRED").
5. The "ADDRESS" label in the raised state adds a text row.
6. The three equal action cells push Directions to the far left and Visited
   to the far right, a 330 px reach across. Check thumb reach.

## 4. Row Unfolds: 8, KEEP

**Strongest version.** The list row and the place card should be one object.
Tapping a pin and tapping a row both lead to the same selected row, which
opens to show its notes and actions. That ends the two selection states
(UX S1/S2) and makes the list the only place-detail surface the app has.

**Why it scores.**
- Continuity, the owner's own rule, at its strongest. The badge, star and
  stamp are literally the row's own, so "icon is treated differently in the
  pop up than on the map" can't recur, because there's no second surface to
  drift.
- It reuses existing systems (the highlighted figure-deep row, the stamp,
  the 56 px text column) instead of inventing a card. That keeps the
  brand's ledger-row identity.
- The notes get the row's full text column at reading size
  (`row/busiest-phone@1x.png`).
- With the type rule withdrawn, its one rule conflict (type sits in the
  meta line under the name) is gone. Type in the row's meta line is "tier 2
  or bottom of tier 1", which is exactly right.

**Idea-level risks.**
- **The sheet must rise.** Busiest needs about 250 px of unfold, so the
  sheet height changes when you tap a pin. That runs into "controls don't
  move or grow" (said about the Plans/Places panel, but the owner will
  likely generalise it).
- **The list scrolls under you.** A pin tap must scroll its row into reach.
  The list moves and you lose your place in it, and a last row may not be
  able to reach the top (`row/shape-phone@1x.png`: Grandi is last and
  bottom-pinned).
- **Gesture surface.** An unfolded row still carries swipe-star and
  swipe-visit plus new buttons. That puts it in the gesture lane (full
  `run-all.sh`) and invites gesture/tap conflicts in the unfold area.
- **A neighbour row competes.** Tier-1 notes sit between other rows. The
  unfold must read as belonging to its row, not as a gap in the list.
- **Dismiss** needs an explicit control (C6). Tapping the row or the map
  isn't enough on its own.

**Mock flaws.**
1. Two VISITED stamps for the same place: one in the row and one in the
   unfold's action slot (`row/busiest-crop@3x.png`). One state mark only.
   The unfold's visit control should be the control, not a second stamp.
2. The same with the star: a cream star in the row plus "★ STARRED" in the
   unfold.
3. The unfold's text column and action row don't share one left edge
   (Directions starts left of the notes column). Use one left channel.
4. The map name flag is a boxed label with a tip, so it reads as a mini
   popup. Try unboxed halo text (donor from 6).
5. The address still runs 4 lines. Shorten it (donor from 7).
6. The selected row's gradient shading at its top edge is muddy at 1x.

## 5. Side Tab: 3, KILL

**Strongest version.** Can the glance be tiny (identity + actions) while
the depth lives one reach away at the side, so the map is barely covered?

**Why KILL (idea, not mock).**
- The idea is "notes go behind the tab". The owner put notes in tier 1.
  You can't fix this without destroying the concept: put the notes back in
  the small popup and the tab holds only the address, which is too much
  mechanism for the rarest tier-4 content.
- The side drawer covers ~84% of the map width (`tab/busiest-x-phone@1x.png`)
  and pushes the pin into Safari's left-edge back-swipe zone. Those are
  structural to a side drawer on a 390 px phone.
- A vertical caps word on a narrow tab is slow to read and a weak target
  (24 px wide). An index tab is a desktop/iPad convention, not a phone one.

**Mock flaws (for the record).** The tab is detached from the card edge with
a gap. "CLOSE" sits on a second vertical tab. The selected row lights up
in the list behind the drawer, a third selection signal.

## 6. Map Label + Dock: 5, KILL (donor)

**Strongest version.** Can identity live where your eye already is (at the
pin, printed on the map like a map label) while the reading and acting
content docks in the thumb zone?

**Why KILL.**
- Tier 1 is split across two surfaces. The name is at the pin, the notes
  are in the dock (`dock/busiest-phone@1x.png`). The eye ping-pongs between
  the top and the bottom to read one place, and the dock has no name in it,
  so it can't stand alone.
- It stacks a third layer (map, dock, list sheet) in the bottom third,
  over the OSM attribution, which must stay visible.
- On a real OSM basemap, an unboxed label competes with street names and
  neighbouring labels. That is structural, not a stand-in artefact.

**Donor.** The **on-map name label with no box** (paper-halo text by the pin)
is the best pin-to-detail link in the round. Use it in Place Sheet and Row
Unfolds, where the detail is away from the pin.

**Mock flaws.** The dock peek is 2 lines (short of a typical note). The dock
× overlaps the note's first line. The dock is not aligned to the list
sheet's edges.

## 7. Action Rail: 4, KILL (donor)

**Strongest version.** Can the actions get out of the reading column so the
content runs uninterrupted top to bottom?

**Why KILL.**
- It hands tier-1 width to tier-2 controls. The note wraps to 8 lines in a
  narrowed column (`rail/busiest-crop@3x.png`). That is the wrong trade by
  the owner's tiers, and it's the idea, not the mock.
- The card's height is set by the controls, not the content. A name-only
  place gets a ~210 px box that is mostly empty (`rail/bare-crop@3x.png`).
- A stacked column of icon tiles in a tinted field is the box/tile pattern
  the ledger rejects, and it is inherent to the rail (cap 6, and it scores
  under that anyway). An icon-over-word rail is also unusual in a map
  callout.

**Donor.** The **short locality line ("Rejsbygade · Vesterbro") with the
full address one tap away** is the right answer to the heaviest-tier-4
problem (address 2.4x the name). Every surviving track should take it. It
needs structured address data saved at add time: a data question for the
backlog, not a design blocker.

**Mock flaws.** "GO" is new copy for Directions. The visited mark is a third
visited language (a navy disc), neither the stamp nor the sticker. The
tinted rail field.

## 8. Luggage Label: 4, KILL

**Strongest version.** Can the selected place have *presence*, a branded
object from the inspo (hotel labels, stamps) that no generic map app would
show, so that identity wins at any density?

**Why KILL.**
- A full-width saturated band (`lug/busiest-phone@1x.png`) is colour as
  decoration and a heavy box. It's inherent to the idea, so it is capped,
  and it lands well under the cap. "Colour must communicate": it says
  "selected", but the tip and the pin already say that.
- A caps name in a coloured band makes the name dominate everything. Notes
  are tier 1 alongside the name, and here they are clearly subordinate.
- Long names become 3 lines of caps (`lug/shape-crop@3x.png`), and the band
  then eats the card. That is structural to "name in the band".
- It doesn't address density (everything is shown, as in Quiet Fix).

**What to keep from it.** The brand intent is right, and it is the CD's
remit: the surviving tracks should feel like Triplet's paper-and-ink objects,
not a Leaflet bubble. The **seal = the map pin exactly** idea (paper field,
category rim, glyph) is the cleanest answer to "icon is treated differently
in the pop up than on the map". Carry that seal into the surviving tracks.

**Mock flaws.** Directions in figure-deep under a figure-deep band (colour
loses its meaning). The band's dark outline around the card. A white star
in the band plus a black "★ STARRED".

---

## Owner-objection prediction (on the round as a whole, owner's voice, 1x)

1. "Why is the star there twice? I said no star unless it's starred. Now
   it's starred twice." (every concept, the leading star plus "★ STARRED")
2. "The address is still this huge grey block in most of these. Nobody needs
   'Capital Region of Denmark' to find a bar." (1, 2-raised, 3-raised, 4, 8)
3. "If the list goes away when I tap a place, how do I get back to where I
   was?" (3 and 4, the two I'd bring to you)

All three are plausible. Objections 1 and 2 are cross-concept mock fixes.
Objection 3 is the question Round 2 must answer on screen, with a
back-to-list state drawn.

## Noise count, busiest view (`quiet/busiest-phone@1x.png`, the in-map baseline)

Card: badge ring, eyebrow, leading star, name, notes slab, address slab,
compass + DIRECTIONS (the only colour), star + STARRED, stamp (navy, double
ring, dotted), ×, card edge, tip. That's **12 distinct marks and 4 inks**
(near-black, grey, figure-deep, navy). Rejected-pattern matches **inherent to
an idea**: 7 (tinted rail = box), 8 (colour block = decoration / heavy box).
Execution-only matches, which don't cap the idea: the hairline boxes around
3's action strip, and the doubled star everywhere.

## Fixes for Round 2 (numbered, cross-concept)

1. **One star.** A leading filled star only when starred. The star
   *control* needs a form that doesn't read as a second mark of the same
   state.
2. **One visited mark per surface.** Never a stamp in the row *and* a stamp
   in the card/unfold (4). The control in the card is a control.
3. **Address → locality line + full address on demand** (donor from 7) in
   every track. Drop the "ADDRESS" caps label.
4. **Notes above the actions** in every track (3 currently inverts this).
   Peek a typical note whole (about 3 lines). Fold only the tail.
5. **Seal = the pin** (donor from 8) wherever a category mark appears.
6. **On-map name label without a box** (donor from 6) as the pin link for
   3 and 4.
7. **Draw the return path** for 3 and 4: list → tap → place → back, with the
   list's scroll, filters and selection restored, at 1x.
8. **Draw sheet height behaviour** for 3 and 4 across bare / typical /
   busiest. Decide between detents and size-to-content.
9. **Merge 1 and 2** into one in-map track with a height ceiling, and use
   it as the control.
10. **Keep "Get Directions"** as the owner's copy unless the owner agrees to
    "Directions". Don't change copy silently.
11. Render a **typical** state (Aurora, ~3-line note) alongside busiest and
    bare. Most real taps look like that, and it's where a peek either holds
    or fails.

## Gating

Nothing here is built and nothing should be. These are concept stills for
the owner. Round 2 goes back to the designer with the fixes above, then to
the owner before any build (lane 2).
