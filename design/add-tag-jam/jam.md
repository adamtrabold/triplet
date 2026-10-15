# Add tag + city control jam

## Turn 1 -- product designer (systems focus): ideas at model level, and questions for visual

The owner (verbatim, `owner.md`): "today doesnt show one city at a time,
the filter panel just takes you to that city. it doesnt "hide" the other
things if i scroll over does it? if it does im not sure if i like that"
· "i think the "type" should be a select in the tag" · "im still no sure
how the city thing works in the tag here. i thin it would be better for
us to jam in a design canvas".

**The fact:** it does hide. Picking a city frames the map **and**
filters both the map and the list to that city (`setActiveCity()` sets
`filters.city`). So the owner's surprise is the finding: today's one
control does two jobs, and the owner wants them apart. Jobs in
`jobs.md`.

### Ideas (model level; how they look is visual's)

**The city in the tag (jobs 1-5).** The city has three states, and the
tag should make each one readable:
1. **Same:** the city is the real town (Sundhöllin → Reykjavík). Said
   once.
2. **Different:** filed under one, really in another (the Blue Lagoon →
   Reykjavík, in Grindavík). Both shown, plainly different roles.
3. **New:** no city within reach (Jönköping), so ADD will make
   "Jönköping". Visibly new before ADD.

Changing it reuses round 10b's path: the city is tappable, and your
cities print as rows plus "New city…". The pin never moves. The new-city
question goes.

**TYPE (job 6).** The closed tag shows one line: TYPE plus the picked
type's word (and, if visual wants, its pin). It opens to the full list,
icons allowed there. The pin above the tag still changes with the pick.
Round 10's row of pins goes (the owner).

**Star and visited (jobs 7-9).** Round 10's stub already has ADD | STAR
| MARK VISITED. The model change is small: visited is saved at insert
(today hard-coded false). Both are toggles until ADD.

**The city control (jobs 10-14): split it in two.**
- **Go to** (common): a list of your cities; a tap frames the map. It's
  navigation only, like a bookmark. It filters nothing, and the list
  keeps everything.
- **Show/hide** (rarer): a filter, the same kind of thing as the
  category chips, so **(we think)** it lives beside them, not beside
  go-to. Default all shown; any subset hidden; it persists.
- **(We think) two edge rules, owner to confirm:**
  - going to a hidden city shows it again (otherwise you fly to an empty
    map);
  - adding a place into a hidden city shows that city (otherwise the new
    place vanishes on ADD).
- **The list** holds every shown city's matching places. Its title can't
  be "Reykjavík list" any more (it isn't). **(We think)** going to a
  city may re-order the list to put that city first, which changes order
  but never membership.
- **Plans:** unchanged; a plan's stops still show even in a hidden city.

### Open questions for the visual designer

1. **Both truths in the address line:** how "filed under Reykjavík" and
   "in Grindavík" read without either looking like the other, at
   address-line size. Also how "new city" reads.
2. **The city as a control:** round 10b's tappable word with an
   underline, or something else. (Round 12 removed the underline;
   round 10b kept a tap.)
3. **TYPE closed:** word only, or word plus pin? **Open:** icons in the
   options or not (the owner: "may be helpful")?
4. **Go to:** where it lives, and how it lists cities (with place
   counts, nearest first?).
5. **Show/hide:** beside the category chips in the filter panel, or its
   own spot? How a hidden city reads in the go-to list.
6. **The list's title** once it holds several cities.
7. **The design system:** the owner asked for one "if not". One exists
   (Triplet, https://claude.ai/artifact/JXWsMZs32JyKdcEzakKrPW); the
   canvas is https://claude.ai/artifact/6aSGgGczYGfWGP1UqTDGP3.

NEXT: visual designer — the tag's city states and TYPE select on the
canvas, plus a first sketch of go-to vs. show/hide.
