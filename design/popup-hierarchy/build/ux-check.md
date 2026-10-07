# Hanging Tag + orange star: lane-2 UX check (finished build)

UX agent, 2026-10-07, branch `popup-hanging-tag` @ `6a046d0`. Brief:
`docs/ux-brief.md` (re-read in full).

**Method.** I drove the real `index.html` in the gesture harness (stub
Supabase, vendored Leaflet, blank tiles, real-timing CDP touch at 390×844
and 390×664). The probes live next to this file:
- `ux-probe.js`: list taps, targets, nothing-moves, drag, list adjust and
  restore, signed out;
- `ux-probe2.js`: selection, keyboard, tab order;
- `ux-probe3.js`: one-tap swap;
- `ux-probe4.js`: Esc and focus return.

Raw output is in `ux-probe.json` and the session log; screenshots are
`ux-probe-*.png`. Real-data counts come from read-only Supabase queries.

Owner (verbatim, since my last check): "let's try it with orange star and
selected row being navy" · "on the tag, let's try the orange background for
starred, but reveresed star (text stays navy). also i feel like the color
flood needs some texture (and the stamp too?... could probably be a bit
larger in the tag?)" · "i like the orange band across the top of the tag too
-- i want to see both (though note that the orange bar is not matching the
shape of the tag)" · "texture looks like clouds on the orange, should look
like paper and be somewhat subtler. visited is too big now. let's do band
still not sure on color" · "i dont like closing the list when a tag is open
now -- it should just adjust height if it needs to (with a good amount of
padding below the tag."

## Verdict

**One BLOCKER (data, not code), then six must-fixes.** Everything else I
drove passes.

## Jobs

| Job | Result | Evidence (real build) |
|---|---|---|
| Identify a place (name, type) | PASS | Name 26px condensed bold leads. TYPE field under the note. |
| **"Which one is it": the address at a glance** (owner: "sometimes the address *does* matter at a glance") | **BLOCKER on real data** | `tagAddress()` shows `short_address`, else something derived from `address_details`, else **nothing**. Live database: **0 of 202** places have either column (both null on all 202; 201 have only the full `address`). As built, **no real tag shows any address**, and the full address is no longer reachable anywhere. The harness rows have none either (`ux-probe-C2.png`, `-B1.png`: no address line). |
| Decide (read the whole note) | PASS | 8-line approx note in full at 844. At 664 the note area scrolls with a fade, only after the list has lowered to its minimum (B1). |
| Go there (Directions) | PASS | Leading segment, 105×60, live signed out (C5). |
| Star / Visit | PASS | 105×60 segments; tap labels on the same boxes. Toggling moves nothing: the tag rect and all three segment rects are identical before and after a star tap and a visited tap (A3). |
| List tap → fly → tag | PASS | Pin (A1), district (A6, anchor dot shown), street (A6), approx pin (A6), all opened with focus in the tag. |
| One-tap swap to another pin | **PASS** (the builder couldn't test it) | With Kaffi Vínyl open, one touch on a pin in the open map below the tag opened Þrír Frakkar (probe 3). Signed out with the slip showing, the first tap only dismisses the slip and the second swaps (by design). |
| Close / back to map | PASS (with must-fixes 2 and 3) | 44×44 × (A1 rects). Map tap closes. **Esc does not close** (probe 4). |
| Follow a plan (Stop n of m) | not driven | PLAN field present in code; Plans view not probed this round. |
| Signed-out viewer | PASS (with must-fix 5) | See below. |

## Specific checks

**List-height adjust and restore.** PASS.
- 844, the tallest real note: lowers 28px. The builder's entry says 0;
  that's a doc nit (the selected pin's radius).
- 664: lowers 184px to exactly header + one row (116px of list). The tag's
  foot sits exactly 32px above the list, and only the note area scrolls
  (B1).
- Close restores the lowering to 0 and the scroll (300 → 300; B2, B3).
- A list collapsed by the user stays collapsed through open and close (B4).
- Nit: at 664 the one remaining row can be cut in half by the restored
  scroll (`ux-probe-B1.png`).

**44px targets.**
- Segments 105×60, × 44×44: PASS.
- The slip's SIGN IN button is **68×42** (the slip is 44 with a border, and
  the button has no hit extension): must-fix 6.

**The changed `arrived()` rule.** PASS.
- A place already on screen at zoom ≥14 opens in **243ms** with no fly
  (A7), and the tag then pans it.
- The map container ends at the list's top (544 = 544, A8), so a place
  hidden under the list never counts as arrived.
- `SOLO_MIN_ZOOM` is still the gate.

**Drag on the tag.** It doesn't pan the map (A4). PASS.

**Focus.**
- In: on every open, focus lands on `.tag` (`role="group"`, named). Tab
  order is Close → Directions → Star → Mark visited, then out to the map
  controls. PASS.
- **Out: FAIL.** Focus was on `#sortBtn`, the tag opened and then closed
  (by `closePopup()` and by Enter on ×), and focus went to `<body>`, not
  back to `#sortBtn` (probe 4). The shipped entry claims it returns.
  Must-fix 3.

**Signed out.**
- Star and Visited are `aria-disabled="true"` and focusable, named "Star,
  sign in to use" / "Mark visited, sign in to use" (C1).
- A greyed tap shows the slip without moving the tag (tag rect identical,
  C2). The slip is `role="status"`, `aria-live="polite"`.
- The first outside tap only dismisses (probe 3), and SIGN IN opens the
  auth sheet (C4). PASS, except the 42px button.

**Selection** (state audit). **FAIL, must-fix 1.**
- A **map pin tap** opens the tag but selects nothing: no highlighted pin,
  no navy row (probe 2).
- **Closing** leaves the previous list selection highlighted (A5).
- Combined: in B4 the navy row was Hlemmur Mathöll while the open tag was
  Kaffi Vínyl. Now that the owner made selection **navy** ("selected row
  being navy"), a navy row reads as "this is the open place", and here it's
  the wrong place.
- This is the old S1/S2 (`../ux-analysis.md` §8), now visible.

**Impeccable flags, as legibility.**
- **10px segment labels** ("Directions", "Mark visited"): acceptable. Each
  sits under a 16–18px icon in a 60px box; they're the same 10px bold
  condensed caps the shipped popup used and the owner has seen; and the
  icon carries the meaning at a glance. Accept with that reason (operator /
  owner to approve the baseline).
- **8px "TYPE" label: not acceptable.** 8px caps is below what reads at 1x
  on a phone at arm's length, and it's the only thing naming the field.
  Must-fix 4: ≥10px, or drop the label and let the type value (11px)
  stand. Which one is the CD's call.

**Full address no longer reachable: a ruling.**
- Acceptable **as a rule**. The owner chose "#1 since there's a directions
  button", and Directions opens Apple Maps at the pin, which shows the
  street address, so a bad geocode can still be checked.
- **But only once the short address exists.** Today nothing is shown at
  all; that's the BLOCKER above.

## Blocker and must-fixes

**BLOCKER (before landing).** Real tags show no address: 0/202 places have
`short_address` or `address_details`.
- Run `tools/short-address-backfill.html` (the owner's browser, since it
  needs live Nominatim) before or with the merge, **or** add a fallback that
  derives a short line from the stored full `address` string (drop leading
  segments that repeat the name; join a bare house number to its street).
  That fallback would show something for 201/202 today.
- Verify with a read-only count after.

Must-fixes:
1. **Selection follows the tag.** A pin tap selects the pin and its row as
   a list tap does. Closing clears the selection, or at least it never
   shows a different place's navy row while a tag is open.
2. **Esc closes the tag** (claimed in `docs/shipped.md`; doesn't today).
3. **Focus returns on close** to where it was (claimed; it goes to
   `<body>`).
4. **8px TYPE label** → ≥10px, or remove it.
5. Signed out: no further issue beyond 6. Keep the dimmed Star showing its
   filled state when starred, as built.
6. **SIGN IN** button ≥44px tall.

Nits:
- `docs/shipped.md` says the tallest tag needs no lowering at 844 (it needs
  28px).
- At 664 the remaining list row can sit half-cut under the header.

## Control parity, hierarchy, convention

- **Parity:** row swipes are untouched (gesture gate as reported by the
  builder; not re-run here). Star and Visit stay one tap in the tag.
  Delete stays row-only.
- **Hierarchy at 1x:** name > note > segment icons/labels > TYPE field.
  The orange star in rows (`ux-probe-C2.png`) reads as a mark, not a
  category, next to the new wine/moss category inks.
- **Convention:** a segmented control, a close at top right, and a sheet
  that only lowers, never jumps.

## Not verified

- Chromium only, no Safari/iPhone or VoiceOver speech.
- Plans view (PLAN field) not driven.
- Real tiles under the band and texture unchecked.
- The gesture gate wasn't re-run (the builder's numbers stand).
