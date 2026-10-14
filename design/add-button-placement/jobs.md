# Adding a place: jobs and flows

What the design has to let you do, for the + and for the add form, which
becomes a blank tag you fill out. This covers the two options left for
your final call (round 10): **C, the tag as the button** and **the
Float**, the orange badge at bottom-left. Both open the same blank tag.
The header tag (A) is cut. If anything here is wrong or missing, say so. *(inferred)* marks a job we worked out rather than heard
from you.

Your words:
- "im also thinking about + placement — it should probably be more
  prominent + reachable on the phone"
- "I actually want to come back to the blank pin version of the add
  button — I also want to rev the add modal to be more like filling out a
  blank tag…I feel like together that could be a cool package."

- (round 10, cutting the header tag) "it isn't working and conflates that
  bar with list actions and global actions (e.g. i could be adding to any
  city not just the one showing)"

(Earlier versions: `notes/jobs-pre-pass-a.md`, `notes/jobs-r9c.md`.)

## Jobs: the + (where you start)

1. **Reach + with your thumb, one-handed.** Bottom-left is the easier side
   for you ("maybe the plus should be on the left? Easier for me to
   reach"). It should work whether the list is up or down, in Plans, and
   with a place's tag open or the filters open.
   - With the filters open, neither option can be tapped: the panel
     covers that corner, so you close the filters first (one extra tap).
   - With a place's tag open, both stay tappable: the list leaves room
     for them. That costs a list row on small screens (320 shows 1 row
     with a tag open, not 2). Tapping closes the tag, and cancel brings it
     back.
2. **See + straight away as the main thing you do here.** It ranks above
   the account button, not beside it ("same weight and heirarchy as
   account, which it shouldn't be"). It reads as "add". C reads as a tag
   that is itself the button ("the tag itself becomes the button").
3. **Know what you're about to fill out.** *(inferred)* What you tap
   already belongs to the tag you'll write on. C's tag *is* the tag you'll
   fill; the Float's badge hands it to you.
4. **+ never gets in your way.** *(inferred)* It never sits on a pin, an
   open tag, a place's name, a row's delete ×, or the map credit.
5. **+ is for the whole trip, not the list you're looking at.** (Your
   words: "i could be adding to any city not just the one showing".)
   - + never lives in the list's own bar, and it never takes the list's
     city, filters or plan as given.
   - The search starts in the city you're looking at, and in one tap
     reaches any of your cities or anywhere.
   - After ADD the list switches to the place's city.
6. **It works signed out.** *(inferred)* Signed out you're in the
   playground: + adds exactly as it does signed in, and nothing is kept
   after a reload. Only a stored sign-in that has gone stale asks you to
   sign in, and then nothing else moves.

## Jobs: the blank tag (how you finish)

7. **Write the name, and the app does the rest.** *(inferred from "filling
   out a blank tag")* The least you do is: tap +, type, pick a result,
   ADD.
   - Everything else is already filled in, in pencil (address, city, and
     the type where it can be guessed).
   - You touch a line only to correct it.
8. **Search right on the tag.** *(inferred)* The name line is the search.
   Results print on the tag under it, at least 3 with the keyboard up on
   a 664-tall Safari screen, and they scroll.
9. **Know where it goes; see it on ADD.** *(inferred; changed in round 9:
   you were worried the map would move under the tag as you fill it, so
   it doesn't)* Before ADD, the words say where: each result's address,
   the tag's "address · city", and "New city?" when it's outside your
   trip. The map stays still while you write. On ADD the map makes one
   move to the place, and the pin goes into the tag's eyelet.
10. **Say what kind of place it is.** Type is pre-filled in pencil and can
   be changed with one tap. *(inferred: the source of the guess is OpenStreetMap's
   own kind for the place, else the type you used last.)*
11. **Star it and note why, while adding.** STAR on the tag prints the
    orange band, exactly as on a starred tag. NOTES is a line on the tag.
    *(inferred from today's form)*
12. **See exactly what you'll get.** *(inferred)* The filled-out blank tag
    has the real tag's layout and order. When it's starred it shows the
    band.
13. **Finish near your thumb.** *(inferred)* ADD is on the tag's stub,
    low on the screen at every phone height, including Safari with its
    toolbars showing.
14. **Watch the blank become the place.** *(inferred)*
    - ADD inks the tag: your pencil turns to ink and the type is stamped.
      The map brings the place to the tag, the pin drops into the eyelet
      with the place's kind and glyph, and the place's own tag is open.
    - The list switches to the place's city if it needs to. It stays down
      while the new tag is open, and when you close the tag it comes back
      up with the new row in view.
    - When you close the tag, a fresh blank + is waiting.
15. **Districts and streets go through the same tag.** *(inferred: "Every
    category should have the same information and capabilities")* Same
    tag, same ADD. On ADD the map frames the outline as it draws in and
    the tag hangs from the area's centre dot. If OpenStreetMap has no outline, the app saves an
    approximate pin, as today.
16. **Never lose what you wrote.** *(inferred)*
    - Cancel puts everything back as it was: the list, its scroll, the
      map view, and any tag that was open.
    - What you'd written is kept for the next time you tap +.
    - A failed save keeps the tag, and nothing you entered is lost.
17. **Get a straight answer when something's unclear or fails.**
    *(inferred)* No results, a slow search, a place outside your cities,
    a district that straddles two cities, a save that fails: each one is
    said on the tag, in its own words, with what to do next. **The
    answers are buttons that look like buttons** ("some of the buttons
    aren't reading like buttons — specifically the add city one"). They
    sit in the stub, where ADD is.
18. **Everything you can tap looks tappable.** (Your words, round 8b.) The
    city and the type look like the app's filter chips, NOTES is a
    write-on line, × is the tag's own, and the stub's segments are the
    tag's own segments. No new button style.

## Scope questions (jobs the owner should confirm, not blockers)

- **Mark it visited while adding.** You often add the place you're
  standing in. The blank tag's stub carries VISITED, as the real stub
  does.
- **Fix a place after adding it** by opening its tag in pencil again.
  Today only star and visited can be changed after adding.

## The blank tag (shared by C and the Float)

The blank tag is built from the real tag's parts and keeps their order:
- the eyelet, **empty while you fill it in** (the pin goes in on ADD);
- **NAME** (the search line);
- **address · city** (pencil; tap the city to correct it; not shown for
  a district or street);
- **NOTES**;
- **TYPE** (pencil).

The tag is a card in the screen's frame, not on the map: docked on the
keyboard while you type, then sitting on the list's band. The map behind
it doesn't move until ADD. The tag is whole and blank from the first
moment, every line printed and empty. It doesn't change size while you fill it in; results print over
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

### Add a place: C, the tag as the button (phone)

1. **Rest:** at bottom-left, a small tag with a + in it, its dotted line
   and its claim-check end. There's no pin: it isn't pinned to anything
   yet. (Its look is still being explored.)
2. **Tap it:**
   - If a place's tag is open, it closes (cancel brings it back).
   - The small tag grows into the blank tag, docked on the keyboard. Its
     eyelet is empty.
   - The keyboard comes up on NAME. If iPhone won't raise it, it's one
     tap on the name line.
3. **Type:** results print under the name, scroll, and show a half row
   to say so. They come from the city you're looking at first;
   "Search everywhere" is always the last line. The stub sits behind the
   keyboard.
4. **Pick:**
   - The keyboard drops and the tag settles onto the list's band (the
     list went down when you tapped).
   - Everything is filled in, in pencil, with ADD (navy) under your
     thumb. **The map doesn't move.**
5. **Correct anything** (type, city, notes, star, visited). Then tap ADD.
6. **ADD:**
   - The map makes one move: the place comes to the tag, and its pin goes
     into the eyelet. The tag is now pinned to the place.
   - The name inks and TYPE is stamped (VISITED already stamped when you
     set it).
   - The tag tightens to the real tag's size from the top. ADD becomes
     DIRECTIONS in the very same spot under your thumb.
   - The place's tag stays open, and the list stays down (on the place's
     city).
7. **Close the tag:** the list comes back up with the new row in view,
   and a fresh blank tag is at bottom-left.

### Add a place: the Float (phone)

The orange badge with a navy + at bottom-left.

1. **Tap it:** the blank tag rises out of the badge into the dock. The
   badge hides while you add (the tag's × is the cancel), so ADD sits in
   exactly the same place as with C.
2. **Steps 3-7 are as in C.** After ADD, the badge is back when the new
   tag closes.

### Exceptions (both)

- **The filters are open:** the + is under them. Close the filters to
  add (one extra tap).
- **A place's tag is open:** the + stays tappable (the list leaves it
  room). Tapping closes the tag, and cancel reopens it.

### Cancel

- Use the tag's × (or Esc on a computer). The tag goes back the way it
  came.
- The list, its scroll, the map view and any tag that was open come back
  exactly.
- What you wrote is kept: tap + again and the tag returns filled in (on
  the band with the keyboard down if a place was picked). No marker is
  ever on the map before ADD.
- The draft is cleared only by a successful ADD.

### Re-search

Tap the name line on the tag. The keyboard comes up, the tag re-docks,
and a new pick rewrites the lines. The map still doesn't move.

### District or street

1. Type and pick as usual, then set TYPE to District or Street.
2. The address · city line goes away and a one-line hint prints instead
   ("traced from OpenStreetMap").
3. On ADD the app fetches the outline (the tag shows it's working). The
   map's one move frames the outline as it draws in, and the tag hangs
   from the area's centre dot.
4. **No outline in OpenStreetMap:** the app finds an approximate spot and
   the pin goes in there as a "(approx.)" place, as today. If it finds
   nothing at all, the tag says so and keeps everything.
5. **The district straddles two cities** (under 60% in one): before the
   ink-over, the tag asks **"Which city?"**. The answers take over the
   stub: **NEW CITY** | **[the runner-up]**, with "another city…" (your
   list) above. Answering runs the ADD.

### A place outside all your cities

- On the pick, the tag prints **"New city? [name]"** just above its stub,
  and the stub's segments become the answers: **ADD [CITY]** (navy, like
  ADD) | **PICK FROM MY LIST**.
- Either answer fills the city in pencil, and the stub goes back to ADD |
  STAR | VISITED.

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

- C or the Float stands at the map column's bottom-left.
- There's no keyboard: the blank tag sits low in the map column, with the
  results on the tag. On ADD the map brings the place to it, as on the
  phone.
- Esc cancels.
- Measured when the concept is built.

### Sizes

- **844 (Home Screen):** about 4 results show while typing, and the stub (ADD, not ready yet) shows below them.
- **664 (Safari):** 3 and a half results (48px rows).
- **320:** 3 results.
- **Rotated or very short screens:** the tag scrolls inside itself and
  the stub (ADD) stays put.
