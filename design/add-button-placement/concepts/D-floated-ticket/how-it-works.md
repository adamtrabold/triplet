# D. Floated ticket: how it works (systems, round 6, jam turn 22)

D is the visual designer's one rough frame. It's recommended for kill.

Structurally, D **is the Float**: the same element (`#floatingAddBtn`),
the same corner, and the same rulings:
- it rides the sheet's edge;
- the form rides down on tap;
- filters "under";
- the credit moves to bottom-left.

It's measured in `r6/measure.json`: box 298,480 – 370,524 (72x44), the
foot 20 above the list, and clash-clean.

- **`TAG_SHEET_GAP`** would be 64 + 12 = **76**, a little less than the
  Float's 88 because it's 16px shorter. So its tag-open cost sits between
  round 5's and round 6's Float (3 rows at 664, 1 at 320).
- **Job 1:** it inherits the Float's filters exception. A, the concept
  whose look it borrows, has no exception: A lives in the header.
- **Bearing on the kill:** D takes A's look and the Float's costs, and
  drops A's one structural strength (no job-1 exception). Its only
  structural gain over A is no title cost, and the Float has that too.
  Nothing structural argues for keeping it. Systems agrees with the kill.
- **Coverage:** the same as the Float's: job 1 yes, except with the filters
  open; jobs 3 to 6 yes.
