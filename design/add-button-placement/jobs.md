# Adding a place: jobs and flows

What the design has to let you do, for the + and for the add form, which
becomes a blank tag you fill out. This covers both packages (P, the blank
pin; A, the header tag) and the Float frame. If anything here is wrong or
missing, say so. *(inferred)* marks a job we worked out rather than heard
from you.

Your words:
- "im also thinking about + placement — it should probably be more
  prominent + reachable on the phone"
- "I actually want to come back to the blank pin version of the add
  button — I also want to rev the add modal to be more like filling out a
  blank tag…I feel like together that could be a cool package."

(Earlier version, for the + only: `notes/jobs-pre-pass-a.md`.)

## Jobs: the + (where you start)

1. **Reach + with your thumb, one-handed.** Bottom-left is the easier side
   for you ("maybe the plus should be on the left? Easier for me to
   reach"). It should work whether the list is up or down, in Plans, and
   with a place's tag open or the filters open.
   - P can't be tapped while a tag or the filters are open (one extra tap
     to close them). A and the Float can (the Float only with a tag
     open).
   - That is a cost line on P, not a hidden exception.
2. **See + straight away as the main thing you do here.** It ranks above
   the account button, not beside it ("same weight and heirarchy as
   account, which it shouldn't be"). It reads as "add", and for P as a
   pin ("the pin doesnt look like a pin…").
3. **Know what you're about to fill out.** *(inferred)* What you tap
   already belongs to the tag you'll write on. P's pin has the string the
   tag comes down; A is the top of a tag.
4. **+ never gets in your way.** *(inferred)* It never sits on a pin, an
   open tag, a place's name, a row's delete ×, or the map credit.
5. **It works signed out.** *(inferred)* Signed out you're in the
   playground: + adds exactly as it does signed in, and nothing is kept
   after a reload. Only a stored sign-in that has gone stale asks you to
   sign in, and then nothing else moves.

## Jobs: the blank tag (how you finish)

6. **Write the name, and the app does the rest.** *(inferred from "filling
   out a blank tag")* The least you do is: tap +, type, pick a result,
   ADD.
   - Everything else is already filled in, in pencil (address, city, and
     the type where it can be guessed).
   - You touch a line only to correct it.
7. **Search right on the tag.** *(inferred)* The name line is the search.
   Results print on the tag under it, at least 3 with the keyboard up on
   a 664-tall Safari screen, and they scroll.
8. **See where it goes before you commit.** *(inferred)* After you pick,
   the map flies there and the pin stands on the spot with the tag
   hanging from it.
9. **Say what kind of place it is.** Type is pre-filled in pencil and can
   be changed with one tap. *(inferred: the source of the guess is OpenStreetMap's
   own kind for the place, else the type you used last.)*
10. **Star it and note why, while adding.** STAR on the tag prints the
    orange band, exactly as on a starred tag. NOTES is a line on the tag.
    *(inferred from today's form)*
11. **See exactly what you'll get.** *(inferred)* The filled-out blank tag
    has the real tag's layout and order. When it's starred it shows the
    band.
12. **Finish near your thumb.** *(inferred)* ADD is on the tag's stub,
    low on the screen at every phone height, including Safari with its
    toolbars showing.
13. **Watch the blank become the place.** *(inferred)*
    - ADD inks the tag: your pencil turns to ink and the type is stamped.
      The pin takes the place's kind and glyph, and the place's own tag
      is open.
    - The list switches to the place's city if it needs to. It stays down
      while the new tag is open, and when you close the tag it comes back
      up with the new row in view.
    - When you close the tag, a fresh blank + is waiting.
14. **Districts and streets go through the same tag.** *(inferred: "Every
    category should have the same information and capabilities")* Same
    tag, same ADD. On ADD the outline draws in and the tag hangs from the
    area's centre dot. If OpenStreetMap has no outline, the app saves an
    approximate pin, as today.
15. **Never lose what you wrote.** *(inferred)*
    - Cancel puts everything back as it was: the list, its scroll, the
      map view, and any tag that was open.
    - What you'd written is kept for the next time you tap +.
    - A failed save keeps the tag, and nothing you entered is lost.
16. **Get a straight answer when something's unclear or fails.**
    *(inferred)* No results, a slow search, a place outside your cities,
    a district that straddles two cities, a save that fails: each one is
    said on the tag, in its own words, with what to do next.

## Scope questions (jobs the owner should confirm, not blockers)

- **Mark it visited while adding.** You often add the place you're
  standing in. The blank tag's stub carries VISITED, as the real stub
  does.
- **Fix a place after adding it** by opening its tag in pencil again.
  Today only star and visited can be changed after adding.

## The blank tag (shared by P, A and the Float)

The blank tag is built from the real tag's parts and keeps their order:
- the pin above, on its straight string;
- the eyelet;
- **NAME** (the search line);
- **address · city** (pencil; tap the city to correct it; not shown for
  a district or street);
- **NOTES**;
- **TYPE** (pencil).

The tag is whole and blank from the first moment, every line printed and
empty. It doesn't change size while you fill it in; results print over
its lower lines while you type.
- the stub: **ADD | STAR | VISITED**.

How the parts behave:
- **Close:** the tag's own × at its top right is cancel.
- **Three inks, one meaning each:**
  - print is the form's own words and the search results;
  - pencil is your entries before ADD;
  - ink and stamp are what ADD does.
- **ADD:**
  - Before a pick, it's printed **NAME IT FIRST** (not a greyed button).
  - Once ready, it's a navy flood.
  - After ADD it reprints as DIRECTIONS.
  - On a tag, orange means starred, so ADD isn't orange.

## Flows

### Add a place: P, the blank pin (phone)

1. **Rest:** the lifted pin is at bottom-left, held above the map on its
   string.
2. **Tap it:**
   - If the filters are open, they're closed already: P is hidden under
     them (see Exceptions).
   - The pin rises to the top of the screen and the blank tag drops down
     its string, docked above the keyboard.
   - The keyboard comes up on NAME. If iPhone won't raise it, it's one
     tap on the name line.
3. **Type:** results print under the name, scroll, and show a half row
   to say so. The stub sits behind the keyboard.
4. **Pick:**
   - The keyboard drops, the list drops to its band, and the map flies to
     the place.
   - The pin lands on the spot and the tag hangs from it, filled in in
     pencil.
   - ADD (navy) is on the stub, low on the screen.
5. **Correct anything** (type, city, notes, star, visited). Then tap ADD.
6. **Ink-over:**
   - The name inks and TYPE is stamped. VISITED already stamped when you
     set it.
   - The tag tightens to the real tag's size from the top, with the map
     moving with it. ADD becomes DIRECTIONS in the very same spot under
     your thumb, and the pin becomes the place's own pin.
   - The place's tag stays open, and the list stays down (on the place's
     city).
7. **Close the tag:** the list comes back up with the new row in view,
   and the fresh lifted pin is at bottom-left.

### Add a place: A, the header tag (phone)

The orange tag cut at the right end of the list's header.

1. **Tap the header tag:**
   - If the filters are open, they close.
   - If a place's tag is open, it closes, and it comes back if you
     cancel.
   - The cut turns to its open state (navy, ×) and the blank tag pulls up
     out of it into the dock above the keyboard, with a 32px blank pin
     above it on its string.
2. **Steps 3-6 are as in P.** The list's band stays at the bottom with
   the header tag's × on it, and that × is a second cancel, where + was.
3. **After ADD the header tag is + again.**

### The Float frame

The same blank tag, rising from the orange badge at bottom-left.
Otherwise as in A.

### Exceptions (P only)

- **A place's tag is open** (Safari or smaller): P isn't shown. Close the
  tag (×, a tap on the map) and it's back. At 844 and up there's room,
  but it stays hidden so it's the same everywhere.
- **The filters are open:** P is under them. Close the filters to add.

### Cancel

- Use the tag's × (or A's × on the band, or Esc on a computer). The tag
  goes back the way it came.
- The list, its scroll, the map view and any tag that was open come back
  exactly.
- What you wrote is kept: tap + again and the tag returns filled in. If a
  place was picked, it hangs on that place with the keyboard down. No
  marker stays on the map meanwhile.
- The draft is cleared only by a successful ADD.

### Re-search

Tap the name line on a hanging tag. The keyboard comes up, the tag
re-docks, and a new pick re-hangs it on the new spot.

### District or street

1. Type and pick as usual, then set TYPE to District or Street.
2. The address · city line goes away and a one-line hint prints instead
   ("traced from OpenStreetMap").
3. The pin stays *lifted* over the picked point: a shape isn't a point,
   so it never lands.
4. On ADD the app fetches the outline (the tag shows it's working). The
   pin fades as the outline draws in, and the tag re-hangs from the
   area's centre dot.
5. **No outline in OpenStreetMap:** the app finds an approximate spot and
   the pin lands there as a "(approx.)" place, as today. If it finds
   nothing at all, the tag says so and keeps everything.
6. **The district straddles two cities** (under 60% in one): before the
   ink-over, the tag prints **"Which city?"** with two stub-style answers,
   **NEW CITY** and **[the runner-up]**, plus "another city…" (your list)
   and Cancel. The answer runs the ink-over.

### A place outside all your cities

- On the pick, the tag prints **"New city? [name]"** with two answers,
  **ADD CITY** and **PICK FROM MY LIST**.
- Either answer fills the city in pencil, and ADD becomes ready.

### Errors

- **No results:** printed on the tag where the results go: "No places
  called that — try another name." The keyboard stays up.
- **The search is slow or timed out:** "Searching…", then "Search timed
  out — try again." Nothing you typed is lost.
- **The save fails:** the tag stays as it was, in pencil, with a printed
  line above the stub ("Couldn't save — try again"). ADD stays ready.
- **A stale sign-in at ADD:** the sign-in sheet opens. The tag and
  everything on it wait behind it.

### Signed out (the playground)

Adding works exactly as signed in, and nothing is kept after a reload.

### Plans

+ adds a place to your places, as today. Adding it to a plan stays a
separate step.

### Computer (wide screen)

- P stands at the map column's bottom-left. A sits at the right end of
  the list panel's header.
- There's no dock: the blank tag hangs from the pin in the map column
  straight away, with the results on the tag.
- Esc cancels.
- Measured when the concept is built.

### Sizes

- **844 (Home Screen):** about 4 results show while typing, and the stub (ADD, not ready yet) shows below them.
- **664 (Safari):** 3 and a half results (48px rows).
- **320:** 3 results.
- **Rotated or very short screens:** the tag scrolls inside itself and
  the stub (ADD) stays put.
