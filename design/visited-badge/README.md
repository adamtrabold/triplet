# Visited stamp — shipped technique and fallback

`index.html` ships **B2**. The perforated track is a static SVG path mask, held in the
`--stamp-track` / `--stamp-track-1x` custom properties on `.row-stamp` and painted through
`.row-stamp::before`. The path is tuned to follow the ring's parallel curve, and there is no JS.
The measured comparison against CSS-only options and against the JS generator is in the design-loop notes (r3b). In summary:
- **B2:** gap spread 0.22–0.27px, no seam.
- **Best pure CSS:** 0.19–0.28px, but it keeps the dotted-border seam.
- **C:** 0.15–0.17px.

- `radius-search.py` — re-derives the path, its radii and its length (166.29). Run it if the
  stamp size or the ring inset ever changes, then update the path, `pathLength` and both dasharrays together.
- `stamp-track-generator-C.js` — the tested fallback **C**. It generates the same mask in JS from
  exact parallel-curve geometry.

## If the iPhone shows the B2 dots unevenly spaced (or bunched at top-centre)
Swap in C. Both feed the same custom properties, so none of the CSS changes except the two declarations:
1. Delete the `--stamp-track:` and `--stamp-track-1x:` declarations inside `.row-stamp { … }`.
2. Paste the body of `stamp-track-generator-C.js` into the main `<script>`, next to
   `stampTilt()`. The two `setProperty` calls at its end set the same variables on `:root`.
3. Update the `.row-stamp` comment to say the track is JS-generated.
