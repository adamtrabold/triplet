// The type-line variants: CSS appended to a scratch copy of index.html. Only the field line
// (.tag-fields / .tag-f / .tag-lab / .tag-val) is restyled; markup and every other rule are the
// shipped ones. Existing tokens only. Text >= 11px everywhere.
// The shipped markup, for reference:
//   <div class="tag-fields">
//     <span class="tag-f"><span class="tag-lab">Type</span><span class="tag-val popup-cat">bar</span></span>
//     <span class="tag-f"><span class="tag-lab">Plan</span><span class="tag-val">Stop 3 of 3</span></span>
//   </div>
module.exports = {
  // The shipped line, for comparison: label 11px/700 caps, value 11px/500 caps, both --ink-2.
  shipped: { css: '' },

  // A. LEDGER (quiet). Told apart by case, colour and size together: the label is a printed
  // sentence-case word in --ink-2 at regular weight; the value is the filled-in entry, condensed
  // caps in --ink, one size up. Same single line, same place.
  ledger: { css: `
    .tag-fields { column-gap: var(--s6); margin-top: var(--s3); }
    .tag-f { gap: 6px; }
    .tag-lab { font-stretch: 100%; text-transform: none; font-weight: 400; font-size: 11px; line-height: 16px; letter-spacing: 0; color: var(--ink-2); }
    .tag-val { font-stretch: 75%; text-transform: uppercase; font-weight: 600; font-size: 13px; line-height: 16px; letter-spacing: .06em; color: var(--ink); }
  ` },

  // B. FIELD STACK (FLIGHT / 605). The tags' own field: a tiny printed caps label ABOVE its
  // entry, the entry set in the name's condensed letterform, a step down. Fields sit side by side
  // as columns, with no cells, rules or boxes between them.
  stack: { css: `
    .tag-fields { column-gap: var(--s8); row-gap: var(--s2); margin-top: var(--s3); padding-bottom: var(--s3); }
    .tag-f { flex-direction: column; align-items: flex-start; gap: 0; }
    .tag-lab { font-stretch: 75%; text-transform: uppercase; font-weight: 600; font-size: 11px; line-height: 14px; letter-spacing: .1em; color: var(--ink-2); }
    .tag-val { font-stretch: 62%; text-transform: uppercase; font-weight: 700; font-size: 17px; line-height: 20px; letter-spacing: .03em; color: var(--ink); }
  ` },

  // C. FORM BLANK ("To ____ Lodi, Cal"). The Southern Pacific check's printed blank: a
  // sentence-case label, then the entry written on a hairline writing line. The line is the
  // field; it is the only rule, under the value only, in --hair.
  blank: { css: `
    .tag-fields { column-gap: var(--s4); margin-top: var(--s3); padding-bottom: var(--s3); }
    .tag-f { flex: 0 1 calc(50% - var(--s2)); gap: 6px; align-items: baseline; }
    .tag-lab { flex: none; font-stretch: 100%; text-transform: none; font-weight: 400; font-size: 12px; line-height: 18px; letter-spacing: 0; color: var(--ink-2); }
    .tag-val { flex: 1; min-width: 0; font-stretch: 100%; text-transform: none; font-weight: 500; font-size: 14px; line-height: 18px; letter-spacing: 0; color: var(--ink);
      padding: 0 2px 1px; border-bottom: 1px solid var(--hair); overflow: hidden; text-overflow: ellipsis; }
    .tag-val.popup-cat { text-transform: capitalize; }
  ` },

  // D. RUBBER STAMP (bold, whimsical). The clerk's stamp in the From/To blanks (the purple
  // "MADERA, CALIF." on the Southern Pacific checks): the label is printed, the value is
  // stamped -- condensed bold caps, inked through the app's own paper-tooth mask (--tex-stamp,
  // as on the VISITED stamp), each at its own slight angle. Ink is --ink-2, the metadata
  // colour, so it never reads as the navy VISITED stamp.
  stamp: { css: `
    .tag-fields { column-gap: var(--s6); margin-top: var(--s3); padding-bottom: var(--s3); align-items: center; }
    .tag-f { gap: var(--s2); align-items: center; }
    .tag-lab { font-stretch: 75%; text-transform: uppercase; font-weight: 600; font-size: 11px; line-height: 14px; letter-spacing: .1em; color: var(--ink-2); }
    .tag-val { display: inline-block; font-stretch: 62%; text-transform: uppercase; font-weight: 700; font-size: 17px; line-height: 20px; letter-spacing: .06em; color: var(--ink-2);
      transform: rotate(-2.5deg) translateY(-1px);
      -webkit-mask: var(--tex-stamp) 0 0 / 90px 90px; mask: var(--tex-stamp) 0 0 / 90px 90px; }
    .tag-f + .tag-f .tag-val { transform: rotate(1.5deg); }
  ` },

  // E. DESTINATION CODE (bold). The big printed code of the Aloha "TO KAUAI" stubs: a tiny
  // label leading a large condensed value, both in the tier-2 colour so the size carries the
  // field and the colour keeps it under the name and the note.
  code: { css: `
    .tag-fields { column-gap: var(--s6); row-gap: var(--s1); margin-top: var(--s2); padding-bottom: var(--s2); }
    .tag-f { gap: 6px; align-items: baseline; }
    .tag-lab { font-stretch: 75%; text-transform: uppercase; font-weight: 600; font-size: 11px; line-height: 14px; letter-spacing: .1em; color: var(--ink-2); }
    .tag-val { font-stretch: 62%; text-transform: uppercase; font-weight: 700; font-size: 22px; line-height: 26px; letter-spacing: .02em; color: var(--ink-2); }
  ` },

  // F. MARGIN PRINT (placement). The fields leave the note's flow and print along the
  // perforation like the stock's own small type ("S-3943 ORIGINAL CHECK" / "Series 28" in the
  // check's corners): TYPE at the left, PLAN set flush right. Label sentence case in --ink-2,
  // value condensed caps in --ink one size up.
  margin: { css: `
    .tag-fields { justify-content: space-between; column-gap: var(--s4); margin-top: var(--s4); padding-bottom: var(--s2); }
    .tag-f { gap: 5px; }
    .tag-lab { font-stretch: 100%; text-transform: none; font-weight: 400; font-size: 11px; line-height: 16px; letter-spacing: 0; color: var(--ink-2); }
    .tag-val { font-stretch: 75%; text-transform: uppercase; font-weight: 700; font-size: 12px; line-height: 16px; letter-spacing: .08em; color: var(--ink); }
  ` },
};
