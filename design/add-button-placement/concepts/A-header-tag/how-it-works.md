# A · Header tag: how it works

Systems, concept turn 1 (2026-10-14). A is the trigger. The form is
`../blank-tag-form/how-it-works.md`. A's own records for its look and
round-7 measures are `../stub/` (`looks-and-feels.md` "Round 7",
`how-it-works.md`) and `../r7-check/a-tag.js` / `measure-A.json`.

## Structure

- **The header tag:** R7's orange cut at the right end of the list band:
  - x 330-390 (flush to the right edge) and y 544-601 at 390x844, list
    up;
  - both corners at the left end chamfered 14px, no eyelet;
  - orange tooth stock with a navy 28px +;
  - kept orange: it's the trigger, chrome not paper (rule 2).
- `#floatingAddBtn` leaves the top-right. The account badge sits alone
  (`right: var(--s4)`).
- **It is part of the band,** so it is wherever the band is: list up,
  collapsed (above the safe area), lowered for a tag, and in Plans. The
  band is always on screen, so A has **no exceptions**.
- **Title cost (from round 7):**
  - 32px shorter at every width (84 / 139 / 154 at 320 / 375 / 390);
  - at 320 the title drops " list", then the count, then ellipsizes
    ("COPENHA…");
  - the chamfers give locate room (svg to cut: 10px).

## States of the trigger

| State | A |
|---|---|
| Rest | orange cut, navy + |
| Pressed | deep orange, paper + |
| **Open (adding)** | the navy ON colour with a paper × (round 7). It's a second cancel, on the band. |
| A place's tag open | shown and tappable. Tapping closes the tag and opens the form; cancel reopens the tag |
| Filters open | the panel sits above the band; A stays tappable; tapping closes the filters first (as the stub was checked) |
| Sort menu open | tapping closes it first |
| After ADD | back to + while the new place's tag is open; nothing waits on a tag close |
| Signed out / stale | adds as signed in / the sign-in sheet, nothing moves |
| Plans | shown; adds a place |
| Desktop | at the right end of the side panel's header; the tag hangs in the map column |

## Flows

1. **Add:**
   - tap the header tag; it turns ×, and the blank tag pulls up out of
     the cut into the dock, with the 32px blank pin above it on its
     string (rule 1: the pin is drawn the moment the tag leaves the cut);
   - type, then pick: the keyboard drops, the list drops to its band with
     the × still on it, the map flies, the pin lands and the tag hangs;
   - ADD, then the ink-over;
   - the header tag is + again, on the band. The list stays at its band
     while the new tag is open, and comes up with the row in view when it
     closes.
2. **Cancel:** the tag's × or the band's ×. The tag goes back down into
   the cut, and everything is restored; the draft is kept.
3. **A tag is open:** tap the header tag → the open tag closes and the
   form opens. Cancel → the tag reopens. No extra tap.
4. **Filters open:** tap the header tag → the filters close and the form
   opens. No extra tap.
5. **District / street:** as in the form spec.

## Round 8 (visual's changes, folded in)

- A uses the shared form unchanged:
  - the fixed 316 blank tag;
  - results over its lower lines from under the NAME rule;
  - ADD at y 528-588 at 664 after the pick (round 8b), with the list on its band
    and A's × on it.
- The × on the band (at 664, y about 604-664, at the right) and ADD
  (528-588) are 16px apart vertically (round 8b), so there's no mis-tap
  overlap.

## Collisions (job 4)

- A lives in the band, not on the map, so there's 0 map dead zone and no
  credit conflict.
- Risks checked in round 7: locate's round icon is about 19.5px from the
  cut, and the cut hit-tests as itself at the corner and in the middle.
- With a starred tag open, two oranges (the tag's band and A): accepted
  by the director in round 7.

## Coverage against jobs.md

| Job | A | Where |
|---|---|---|
| 1 Reach | **yes, no exceptions**; but **on the right**, against your "on the left? Easier for me to reach" (the band's left end is the collapse ▲ and the title) | structure |
| 2 Main action | yes: the only orange object in the band, separated from the account (top) by the whole map | rest |
| 3 Know what you'll fill out | yes: it's a tag's cut end, and the tag comes out of it | flow 1 |
| 4 Never in the way | yes | collisions |
| 5 Signed out | yes | states |
| 6-16 | yes, via the shared form | `../blank-tag-form/how-it-works.md` |

## The trade against P (for the owner's cost lines)

| | P (blank pin) | A (header tag) |
|---|---|---|
| Thumb side | left | **right** |
| Exceptions | tag open, filters open (+1 tap each) | none |
| Map dead zone | 52 x 78 at bottom-left | none |
| Title length | unchanged | 32px shorter |
| The story | pin → tag → place, one object | tag → pin + tag → place |

## Open

- Whether A could sit at the band's **left** end (the owner's reach
  note). The ▲ and the title are there, so it's a structure change.
  Director's call; I'd measure it if asked.
- The "pull up out of the cut" motion is visual's.

---

## The Float frame (one frame, no package)

- The same form, rising from the 60px orange badge at bottom-left (R7:
  box 15.2,468.8 – 75.2,528.8 at 844). The badge turns to its open state
  (navy, ×) as a second cancel.
- Its exceptions:
  - filters open: close them to add (round 7);
  - tag open: `TAG_SHEET_GAP` is 88, so it stays tappable; the tag closes
    on tap.
- **Round 8:** after a pick, the hanging tag's foot pans to 512 at 664,
  to clear the open badge (× at 524-584). That puts ADD at about 452-512.
  It's the same kind of cost as round 7's gap of 88.
- Otherwise as A.
