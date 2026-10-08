# Context for the sign-in button work (orchestrator; facts only, no solutions)

## The owner's words (verbatim) -- also in owner.md
1. "id like to have a "playground" version of this so that when i share it people can play with it non-destructively. it could be separate, or it could be faked until login, idk."
2. On the playground's account menu: "it should just have a sign in button"
3. On the first build (still: current-rejected-menu-3x.png): "no that button does not look good — we need a secondary style for that button that is for signing in -- lets get some concepts. one i'd like explored is a verson where there is a signed out person themed icon, maybe smaller? but with "sign in" in the circle following a circular path under it (like a U shape around the circular shape)"

The owner's circular-text idea MUST be explored as one concept. Other concepts are open.

## Confirmed facts
- Triplet: personal trip-planning app (Iceland/Scandinavia trip), one file `index.html`, no build step, used mostly on iPhone (390px-wide viewport). Two people edit it (the owner and Erica).
- Playground = `index.html?play`: a shareable copy visitors can poke at; all edits stay in their tab, a reload starts fresh. Visitors behave as if signed in (every control works).
- Built so far (on a branch, not live): in the playground the top-right account button (orange scalloped badge with a person glyph, `#accountBtn`) opens `#accountDropdown`, which holds only a boxed "SIGN IN" button. Tapping it goes to the real app (`index.html?signin`) with the sign-in modal open. The owner rejected how that looks (still above).
- Normal app today: signed in -> the same orange badge, dropdown shows email + Logout. Signed OUT -> no account button at all; sign-in only appears when an edit is attempted (a modal) or as a "sign in" slip under a place's popup.
- Top-right controls: `#accountBtn` (orange scalloped badge) and `#floatingAddBtn` (navy scalloped badge, orange +). CSS roughly lines 360-485 of `index.html`; markup around line 2560.

## Open (belongs to the team, not decided)
- Whether "sign in" is the account button itself, something in a menu, or elsewhere; what "secondary style" means here; whether the normal signed-out app should get the same control; anything else.

## Records to read
- `CLAUDE.md` (project rules), `docs/owner-taste.md` (the owner's taste rules, verbatim -- read fully), `design/inspo/README.md` and the images in `design/inspo/project/` (the app's visual language), `docs/shipped.md` sections "Hanging Tag + orange star" and the brand-orange entry (search "brand orange"), `docs/cd-brief.md`, `docs/ux-brief.md`.
- The live look: render the real app headless with `design/signin-button/signin-test.js` (Playwright + the gesture-harness Supabase stub; `OUT=<dir> node design/signin-button/signin-test.js` writes stills). Chromium is at /opt/pw-browsers. Prototypes: copy `index.html` into your concept folder and change the copy, never the real `index.html`.
- Images for the owner: phone-readable, real size, 3x device scale (1170 wide).

## Work folder (shared; absolute path)
/home/user/la-trip-map/design/signin-button/ -- jam.md, jobs.md, concepts/, scores.md, owner.md, notes/<role>.md
