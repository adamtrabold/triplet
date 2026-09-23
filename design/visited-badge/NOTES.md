# Visited-state "stamp" badge — design exercise notes

Status: **not yet implemented in `index.html`**. Everything here is scratch/mockup,
saved to the repo (not `/tmp`) because scratchpad doesn't survive a session end.

## Goal

A visual "VISITED" stamp badge on `.location-actions` in the sidebar list row,
next to the existing delete button (list rows are otherwise delete-only —
visited-toggle lives in the map popup, see CLAUDE.md's shipped-work log).
Styled like a passport/rubber ink stamp: an oval ring with "VISITED" text
inside, a dashed dot-track just outside it, rotated a few degrees off-axis.

## Files here

- `mockup11-oval-svg-rejected.html` — the SVG hand-built version. **Rejected.**
  Ring drawn as a filled compound path from two true perpendicular-offset
  curves around an ellipse (to fake a constant-width stroke), plus 41
  individually-placed `<circle>` dots for the outer track (computed via
  arc-length integration to get even spacing — `stroke-dasharray` bunches at
  the curve, confirmed empirically). Despite the offset-curve math, the ring
  still visually read as variable-width to the user. Root cause: SVG
  `stroke-width` (and any hand-built stroke substitute) follows the curve's
  local geometry in path-space, not screen-space — a non-circular curve
  (ellipse, oval path, whatever) will show width variance under stroking
  pretty much unavoidably at small sizes with polygon-approximated curves.
  Kept here only as a record of what was tried and why it didn't work — do
  not resume iterating on this approach.
- `mockup12-css-oval-current.html` — **the working direction.** Plain CSS:
  a `div` with `border-radius:50%` and `border: 2px solid var(--ink-2)` for
  the ring, another `div` with `border-radius:50%` and
  `border: 1.5px dashed var(--ink-2)` for the outer track, both inside a
  `.stamp` wrapper rotated `-3deg`. This is CSS's built-in constant-width-
  border primitive (two concentric rounded rects under the hood) — it has
  no variable-width problem by construction, and dashed-border spacing on a
  circle/ellipse has no corner-bunching issue either (no corners). Verified
  via Playwright screenshot at 500x400 — ring reads as uniform width at
  every angle, in both normal and `.highlighted` (dark background) row
  states. Screenshot: see chat history for `mockup12-css-oval.png` (not
  saved to repo — regenerate by opening the file in a browser or re-running
  the Playwright script if needed).

## Key finding (answers the open question from the user)

**Q: Does the ring have to be SVG? Could a `border-radius` box work instead?**
A: Yes — CSS border-radius is the right primitive here, not SVG. It sidesteps
the entire class of bug this exercise burned significant time on (SVG stroke
width scaling with local curve geometry). Do not go back to hand-built SVG
offset paths for this shape.

## What's still open / next steps for whoever picks this up

1. `mockup12-css-oval-current.html` is a rough prototype, not final sizing —
   it hasn't been through the sizing/spacing rigor `mockup11-oval` went
   through (ledger-row height-uniformity check against the real 56px row
   height, spacing-scale-token gap values, etc.). Needs that same rigor
   applied to the CSS version:
   - Confirm the `.stamp` wrapper's box (currently ad hoc `80x34`) doesn't
     grow `.location-card` past the app's real row height when dropped into
     actual `index.html` markup/CSS (not just this isolated mockup page).
   - Re-derive the ring/track gap and dot styling against the app's real
     spacing scale (`--s1`…`--s12`) rather than the arbitrary `inset: 6px`
     used here.
   - Decide: keep the outer track as a *dashed border* (simpler, no
     per-dot placement) vs. the individually-placed-dot look from the SVG
     version — the dashed border is visually different (continuous dashes,
     not distinct circular dots) and may not match what the user actually
     wants stylistically. Worth explicitly confirming with the user which
     they prefer before finalizing, since this was assumed rather than
     asked.
2. Per the project's standing process (see CLAUDE.md and the user's
   explicit instructions through this whole exercise): this needs to go
   through the Design → UX → CD agent review loop — using the `Agent` tool,
   not done directly — before being shown as a finished result, and every
   change gets checked with `npx --yes impeccable@4.1.0 detect <file>`
   before being presented. The user has repeatedly and explicitly said not
   to do design work directly ("You are not a designer don't design").
3. Only after the above is approved: port the chosen structure into the
   real `.location-actions` markup and CSS in `/home/user/triplet/index.html`,
   test row heights stay uniform for unvisited/visited/visited+highlighted
   states (screenshot via Playwright, since this sandbox can't reach the
   live Supabase-backed app), and get it committed on this feature branch.

## Environment note

This sandbox cannot reach Supabase/Nominatim/Overpass/live tiles (see
CLAUDE.md → Environment constraints), but can run a local static HTML file
through headless Chromium via Playwright
(`NODE_PATH=/opt/node22/lib/node_modules node -e "..."`, browser at
`/opt/pw-browsers/chromium`) — that's sufficient for this kind of CSS/layout
verification work, no live app connection needed.
