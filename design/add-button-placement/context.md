# Context for the + (add a place) placement work (orchestrator; facts only, no solutions)

## The owner's words (verbatim) -- also in owner.md
"im also thinking about + placement — it should probably be more prominent + reachable on the phone give that to a crew"

## Confirmed facts
- Triplet: personal trip-planning app (Iceland/Scandinavia trip), one file `index.html`, no build step, used mostly on iPhone (390px viewport), often one-handed. Two people edit it (the owner and Erica). Map on top, a list of places below (the list sheet).
- `#floatingAddBtn` (+): 50px navy scalloped badge with an orange +, `position: fixed`, top-right (`top: var(--s4) + --chrome-top-inset`, `right: var(--s4)`), CSS around line 368-430 of `index.html`, markup around line 2575. It opens the add-a-place form. Signed out, tapping it asks you to sign in.
- `#accountBtn` sits just left of it (`right: 74px`), same badge shape; navy with orange person when signed in (orange only while its menu is open). Leaflet zoom +/- sits top-left.
- A separate crew is redesigning the account button's signed-out state (a paper "sign in" badge with SIGN IN curving under a person icon) for a shareable "playground" link (`index.html?play`). That work lives in `design/signin-button/` -- read its owner.md and jobs.md for context; don't design it. If + moves, the two crews' work must still fit together; flag conflicts to the orchestrator.
- Code that positions things around these controls: `index.html` ~line 4927 and ~6718 (lists of corner controls used for layout/avoidance) -- builders will care; designers should know + isn't free-floating.

## Open (belongs to the team)
- Everything about where + goes and how prominent it is.

## Records to read
- `CLAUDE.md`, `docs/owner-taste.md` (read fully), `design/inspo/README.md` + images in `design/inspo/project/`, `docs/ux-brief.md`, `docs/cd-brief.md`, relevant `docs/shipped.md` entries (search "floatingAddBtn", "add form", "list sheet"/"drawer").
- Render the real app headless: `OUT=<dir> node design/add-button-placement/signin-test.js` (Playwright + gesture-harness Supabase stub; Chromium at /opt/pw-browsers). Prototypes: copy `index.html` into your concept folder and change the copy, never the real `index.html`.
- Images for the owner: phone-readable, real size, 3x device scale (1170 wide).

## Work folder (shared; absolute path)
/home/user/la-trip-map/design/add-button-placement/ -- jam.md, jobs.md, concepts/, scores.md, owner.md, notes/<role>.md
