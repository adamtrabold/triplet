// Round 2 (after ux-review.md + cd-review.md): A Ledger and D Rubber stamp only.
// CSS appended to a scratch copy of index.html; the only markup change (D) is a per-place
// --type-tilt / --plan-tilt custom property on the two value spans, from typeTilt() below.
// Existing tokens only; text >= 11px.

// The printed label, shared by A and D: the tags' own printed caps ("FLIGHT", "TO"),
// light weight and wide tracking in the metadata grey -- print, not a control.
const LABEL = `.tag-lab { font-stretch: 75%; text-transform: uppercase; font-weight: 500; font-size: 11px; line-height: 16px; letter-spacing: .12em; color: var(--ink-2); }`;
// The written-in entry (A's value, and D's printed plan): sentence case, regular width,
// 13px medium ink -- the plan's own words "Stop 12 of 14", never caps, never a fraction.
// Not the stub's style (ink, bold, tracked, condensed caps), so it never reads as a button label.
const ENTRY = `font-stretch: 100%; text-transform: none; font-weight: 500; font-size: 13px; line-height: 16px; letter-spacing: 0; color: var(--ink);`;
// The stamp's ink: --ink-2 (metadata grey -- navy is visited, orange is star), condensed bold
// caps at 14px (the note is 14px regular INK; this is condensed grey), inked through the app's paper tooth (--tex-stamp, the VISITED stamp's mask) at a
// coarser 170px tile so the tooth shows at 1x, under a density falloff across the word (one end
// pressed harder -- a rubber stamp's uneven pressure), a 0.6px ink spread and a faint 0.6px
// second impression. Lifted 1.5px off the printed baseline. Tilted per
// place by --type-tilt (typeTilt(id)).
const STAMP = (v, caps = true) => `display: inline-block; font-stretch: 75%; text-transform: ${caps ? 'uppercase' : 'none'}; font-weight: 700; font-size: 14px; line-height: 16px; letter-spacing: ${caps ? '.09em' : '.02em'}; color: var(--ink-2);
      padding: 3px 5px; margin: -3px -5px; transform: translateY(-1.5px) rotate(var(${v}, -4deg)); transform-origin: 50% 60%;
      text-shadow: 0 0 .6px currentColor, .6px .3px 0 color-mix(in srgb, currentColor 30%, transparent);
      -webkit-mask: var(--tex-stamp) 7px 3px / 170px 170px, linear-gradient(98deg, #000 35%, rgba(0,0,0,.74) 100%);
      -webkit-mask-composite: source-in;
      mask: var(--tex-stamp) 7px 3px / 170px 170px, linear-gradient(98deg, #000 35%, rgba(0,0,0,.74) 100%);
      mask-composite: intersect;`;

module.exports = {
  // A. LEDGER, revised: printed caps label, written-in sentence-case entry.
  ledger: { css: `
    .tag-fields { column-gap: var(--s6); row-gap: var(--s1); margin-top: var(--s3); padding-bottom: var(--s3); align-items: baseline; }
    .tag-f { gap: 7px; align-items: baseline; }
    ${LABEL}
    .tag-val { ${ENTRY} }
    .tag-val.popup-cat { text-transform: capitalize; }
  ` },
  // D. RUBBER STAMP, revised: the TYPE entry is stamped; the PLAN entry is written in (A's
  // entry) -- the stop number is the app's running count, not a clerk's record, and stays quiet.
  stamp: { tilt: true, css: `
    .tag-fields { column-gap: var(--s4); row-gap: var(--s2); margin-top: var(--s3); padding-bottom: var(--s3); align-items: baseline; }
    .tag-f { gap: 8px; align-items: baseline; }
    ${LABEL}
    .tag-val { ${ENTRY} }
    .tag-val.popup-cat { ${STAMP('--type-tilt')} }
  ` },
  // D-alt: both entries stamped at the same quiet size (CD fix 3: "show both").
  stampboth: { tilt: true, css: `
    .tag-fields { column-gap: var(--s4); row-gap: var(--s2); margin-top: var(--s3); padding-bottom: var(--s3); align-items: baseline; }
    .tag-f { gap: 8px; align-items: baseline; }
    ${LABEL}
    .tag-val { ${STAMP('--plan-tilt', false)} }
    .tag-val.popup-cat { ${STAMP('--type-tilt')} }
  ` },
};

// typeTilt(id): a fixed per-place angle from an id hash (a different hash from stampTilt), so a
// re-render never wobbles; it never equals or mirrors the VISITED stamp's angle (>= 1deg apart
// both ways), so the two never read as a matched pair. Injected into the mock copies verbatim.
module.exports.TILT_JS = `
    const TYPE_TILTS = [-4.5, -3, 3, 4.5];
    function typeTilt(id, salt) {
      let h = 7 + (salt || 0);
      for (const ch of String(id)) h = (h * 37 + ch.charCodeAt(0)) | 0;
      const s = stampTilt(id);
      for (let k = 0; k < TYPE_TILTS.length; k++) {
        const t = TYPE_TILTS[(Math.abs(h) + k) % TYPE_TILTS.length];
        if (Math.abs(t - s) >= 1 && Math.abs(t + s) >= 1) return t;
      }
      return TYPE_TILTS[0];
    }
`;
