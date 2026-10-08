# Un-visit transition: UX review (options 1–4)

UX agent, 2026-10-08, on `unvisit-concepts` @ `364f10b`. Brief:
`docs/ux-brief.md`. Evidence: the filmstrips (`stills/*-strip.png`), the
option CSS (`options.js`) and the shipped hooks in `index.html`.

Owner (verbatim): "we also need to iterate on the unvisited transition --
what's the best way for that to go away? just disappearing feels like kind
of a letdown"

## Ranking

| # | Option | Verdict | Reads as | Why |
|---|---|---|---|---|
| 1 | **2 Dry up** (380ms) | KEEP | "undone" | Closest to the row's own un-visit (erase pop, then it pales by opacity), so the list and the tag tell the same story. It is the visit bleed reversed: the same act, backwards. Calm, not a failure. |
| 2 | **1 Lift off** (340ms) | KEEP | "undone" (clearest "undo") | The stamp-in played backwards, so cause and reversal are obviously paired. It includes the family's erase pop. Its cost is a ghost over the arriving words and a stamp that grows past its segment. |
| 3 | 3 Rub out (400ms) | KILL | "erased / deleted" | Spends the pencil's verb on the stamp (grammar: pencilled = cared about, stamped = been). Crumbs and the half-erased stamp overlap "MARK VISITED" at 310ms, which breaks the hard rule "dust may never overlap text". Better timing can't fix the metaphor. |
| 4 | 4 Strike through (380ms) | KILL | "cancelled / error" | A cross-out through the stamp reads as a rejection or mistake, not a correction. It's the only option without the family's erase pop, and it adds a line for ~200ms (owner: no heavy rules). Negative tone is inherent to the idea. |

## Checks

**Reads as undone, not error or deleted.**
- Dry and Lift reverse the motion that put the stamp there, which is how
  "undo" reads.
- Rub (erasing) and Strike (cancelling) add a new destructive act, so
  they read as "removed" or "wrong".

**Timing against stamp-in (420ms) and the row un-visit.**
- All four are shorter than the stamp-in (340–400ms). That's right: undoing
  should be a touch quicker than doing.
- The row's un-visit uses the 240ms erase pop. Dry and Lift both include
  it.
- **Must-fix 1 (both keeps):** when the tag is open and the row is on
  screen, the tag's un-visit and the row's `vsReplay` must start in the
  same frame and use the same pop curve. They should read as one event in
  two places. That's also what the owner's "list-side changes animate on
  an open tag" needs in reverse: a row swipe-un-visit while the tag is open
  must play this same tag transition, not a hard swap.

**Quick re-tap mid-animation.**
- The leaving stamp is the `.tag-stamp-out` copy with `pointer-events:
  none` (`index.html` ~2009), and the button underneath stays the target
  for the whole motion. A re-tap re-renders the tag, which removes the
  leaving copy and plays the stamp-in (`popupStampId`).
- **Must-fix 2:** keep that. No option may add `pointer-events` to the
  leaving layer or disable the button while it animates.
- Test in the build: tap, tap again at ~150ms → stamp-in from rest, with no
  leftover ghost.
- `aria-pressed` flips at the tap, not at the end of the motion. Keep it
  that way.

**Reduced motion.**
- The shared 160ms crossfade is right, and better than shipped (which
  simply vanishes).
- It must still be shorter than the stamp-in's reduced version, and it
  must not scale.

**Overlaps (from the strips).**
- **Must-fix 3, Dry:** the 240ms frame ends on a cropped "VISITE"
  fragment. Use a fibrous or softer edge, or fade faster through the last
  20%, so no cropped word is ever left standing.
- **Must-fix 4, Lift:**
  - At 250ms the stamp's ghost and "MARK VISITED" overlap. Start the words
    only once the stamp is below ~20% opacity.
  - Clip the rise to the Visited segment, or cap the scale, so it never
    passes over the tag edge or the Star segment.
- **Both:** the arriving words fade in at the same position they rest at.
  Nothing moves (rule held).

## Recommendation

Show the owner **Dry up and Lift off** side by side. Dry up is the UX
lead, for its consistency with the row's un-visit. Lift off is the more
legible "undo" if the owner finds Dry still too quiet ("just disappearing
feels like kind of a letdown"). Fix 3 and 4 before showing.

## Not verified

Stills only. No real-time playback, no re-tap test, no WebKit run (mask
animation, blur on a masked element).
