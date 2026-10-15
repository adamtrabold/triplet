// Assembles the three self-contained mockup pages from the shared CSS
// token file + SVG sprite, so each output .html is a single file with
// no external @import/network dependency (safer for headless screenshot).
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const sharedCss = fs.readFileSync(path.join(dir, '_shared.css'), 'utf8');
const sprite = fs.readFileSync(path.join(dir, '_sprite.html'), 'utf8');

// ---- badge markup, matching badgeHtml()/index.html exactly for a 24px
// circle badge: rim 2, glyph 18x18 centred at offset 3,3. -------------
function badge(category, color, reversed) {
  const stroke = reversed ? 'var(--paper)' : color;
  const fill = reversed ? 'none' : 'var(--paper)';
  const glyphColor = reversed ? 'var(--paper)' : color;
  return `<div class="row-badge"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="${fill}" stroke="${stroke}" stroke-width="2"/><svg x="3" y="3" width="18" height="18" viewBox="0 0 24 24" style="color:${glyphColor}"><use href="#g-${category}"/></svg></svg></div>`;
}

const CATEGORY_COLORS = {
  restaurant: '#AC5019',
  attraction: '#A68018',
  shopping:   '#8A7AA8',
  hotel:      '#2E2433',
};

// ---- row-star-slot renderers, one per variant's glyph policy ---------
function starSlotSilent(starred, highlighted) {
  if (!starred) return '';
  return `<span class="row-star-slot"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#g-star"/></svg></span>`;
}
function starSlotAlways(starred) {
  const use = starred ? '#g-star' : '#g-star-open';
  const cls = starred ? ' row-star-slot--on' : '';
  return `<span class="row-star-slot${cls}"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="${use}"/></svg></span>`;
}

// ---- the 5 example rows, shared content across all 3 variants --------
const ROWS = [
  { name: 'Café Loki',                                    cat: 'restaurant', city: 'Reykjavík', starred: true,  highlighted: false },
  { name: 'Fjallkonan Guesthouse & Rooftop Bar Old Harbour', cat: 'hotel',     city: 'Reykjavík', starred: true,  highlighted: false },
  { name: 'Sjávarpakkhúsið Seafood Restaurant Old Harbour',  cat: 'restaurant', city: 'Reykjavík', starred: false, highlighted: false },
  { name: 'Hallgrímskirkja',                               cat: 'attraction', city: 'Reykjavík', starred: false, highlighted: false },
  { name: 'Kolaportið Flea Market',                        cat: 'shopping',   city: 'Reykjavík', starred: true,  highlighted: true  },
];

function rowHtml(row, starSlotFn, slotOutsideRowMain) {
  const color = CATEGORY_COLORS[row.cat];
  const cls = ['location-card'];
  if (row.highlighted) cls.push('highlighted');
  const slot = starSlotFn(row.starred, row.highlighted);
  const meta = `${row.cat.toUpperCase()} &middot; ${row.city.toUpperCase()}`;
  const srOnly = row.starred ? ', starred' : '';
  if (slotOutsideRowMain) {
    // Variant 3: slot is a PEER of row-badge/row-main/location-actions in
    // the outer grid -- row-main and location-actions need EXPLICIT
    // grid-column so they don't shift when the slot is simply absent from
    // the DOM on an unstarred row (auto-placement would otherwise slide
    // row-main left into the empty track).
    return `<div class="${cls.join(' ')}">
      ${badge(row.cat, color, row.highlighted)}
      ${slot}
      <div class="row-main"><h3>${row.name}<span class="sr-only">${srOnly}</span></h3><div class="row-meta">${meta}</div></div>
      <div class="location-actions"><button class="delete-btn" aria-label="Delete">&times;</button></div>
    </div>`;
  }
  return `<div class="${cls.join(' ')}">
    ${badge(row.cat, color, row.highlighted)}
    <div class="row-main">${slot}<h3>${row.name}<span class="sr-only">${srOnly}</span></h3><div class="row-meta">${meta}</div></div>
    <div class="location-actions"><button class="delete-btn" aria-label="Delete">&times;</button></div>
  </div>`;
}

function popupHtml(starred, slotFn) {
  const slot = slotFn(starred, false).replace('row-star-slot', 'row-star-slot popup-star-slot');
  return `<div class="popup-shell">
    <div class="popup-title-row">
      ${slot}
      <div class="popup-title">Café Loki</div>
      <div class="popup-addr">Baldursgata 10, 101 Reykjavík</div>
    </div>
    <a class="popup-directions" href="#"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#g-compass"/></svg>Get Directions</a>
    <div class="popup-actions">
      <div class="popup-cat"><svg viewBox="0 0 24 24" style="color:${CATEGORY_COLORS.restaurant}"><use href="#g-restaurant"/></svg>Restaurant</div>
      <button class="popup-visited">Mark Visited<span class="popup-visited-check"></span></button>
    </div>
  </div>`;
}

function page(title, note, css, bodyRows, popup) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
${sharedCss}
${css}
</style>
</head>
<body>
${sprite}
<div class="page-label"><b>${title}</b></div>
<div class="variant-note">${note}</div>
<ul id="locationsList" style="list-style:none">
${bodyRows}
</ul>
${popup}
</body>
</html>`;
}

// =======================================================================
// VARIANT 1 -- nested grid inside .row-main, SILENT when unstarred
// (mirrors row-stamp's shipped "silence is the unvisited state" rule).
// =======================================================================
const v1css = `
.row-main {
  position: relative;
  display: grid;
  grid-template-columns: 18px 1fr;
  column-gap: var(--s2);
}
.row-main > :not(.row-star-slot) { grid-column: 2; min-width: 0; }
.row-main > h3 { grid-row: 1; }
.row-main > .row-meta { grid-row: 2; }
.row-star-slot {
  grid-column: 1;
  grid-row: 1 / span 2;
  align-self: center;
  width: 18px;
  height: 18px;
}
.row-star-slot svg { width: 18px; height: 18px; display: block; color: var(--ink); }
.location-card.highlighted .row-star-slot svg { color: var(--paper); }

.popup-title-row {
  display: grid;
  grid-template-columns: 18px auto;
  column-gap: var(--s2);
}
.popup-title-row > :not(.popup-star-slot) { grid-column: 2; }
.popup-star-slot { grid-column: 1; grid-row: 1 / span 2; align-self: center; }
`;
fs.writeFileSync(path.join(dir, 'variant-1-nested-silent.html'), page(
  'Variant 1 — Nested grid, silent',
  'Reserved 18px column lives <b>inside .row-main’s own grid</b> — the exact 18px/8px pattern the popup already ships (<code>.popup-title-row { grid-template-columns: 18px auto }</code>), ported onto the list row. Text always starts at the same x; the star renders only when starred (silence-by-default, as .row-stamp already does for visited). Outer 3-column ledger grid (glyph | content | action) is untouched.',
  v1css,
  ROWS.map(r => rowHtml(r, starSlotSilent, false)).join('\n'),
  popupHtml(true, starSlotSilent)
));

// =======================================================================
// VARIANT 2 -- same nested grid, but ALWAYS shows a star glyph (hollow
// when unstarred) -- an explicit, discoverable affordance on every row,
// matching Apple Mail's flag column / Todoist's priority dot, and also
// matching what the POPUP already ships today (buildPopupHtml() always
// renders #g-star or #g-star-open, never nothing).
// =======================================================================
const v2css = v1css + `
.row-star-slot svg { color: var(--ink-2); }              /* hollow, quiet */
.row-star-slot--on svg { color: var(--ink); }             /* filled, starred */
.location-card.highlighted .row-star-slot svg { color: var(--paper-warm); }
.location-card.highlighted .row-star-slot--on svg { color: var(--paper); }
`;
fs.writeFileSync(path.join(dir, 'variant-2-nested-always.html'), page(
  'Variant 2 — Nested grid, always-visible',
  'Same reserved 18px column as Variant 1, but the slot <b>always</b> holds a glyph: hollow (<code>--ink-2</code>) when unstarred, filled (<code>--ink</code>) when starred. Teaches the affordance from every row, the way Apple Mail’s flag column or Todoist’s priority dot always occupy their track. Also the option that matches what the popup <i>already</i> ships today, unlike Variant 1.',
  v2css,
  ROWS.map(r => rowHtml(r, starSlotAlways, false)).join('\n'),
  popupHtml(true, starSlotAlways) + popupHtml(false, starSlotAlways)
));

// =======================================================================
// VARIANT 3 -- reserved column at the OUTER ledger grid, a peer of
// .row-badge (the app's own "28px glyph is the alignment spine" pattern,
// literally extended with a second fixed-width peer column) rather than
// nested inside .row-main. Silent when unstarred.
// =======================================================================
const v3css = `
.location-card { grid-template-columns: var(--col-glyph) 18px 1fr auto; }
.row-star-slot {
  width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
}
.row-star-slot svg { width: 18px; height: 18px; display: block; color: var(--ink); }
.location-card.highlighted .row-star-slot svg { color: var(--paper); }
/* Because the slot can be ABSENT from the DOM on an unstarred row, the
   other two children must be pinned to their tracks explicitly -- CSS
   grid auto-placement would otherwise slide row-main into the empty
   star track and location-actions into row-main's old track. This is
   the exact class of bug CLAUDE.md's shape-card / grid-column:-1 history
   warns about; it is this variant's main added risk. */
.row-main { grid-column: 3; }
.location-actions { grid-column: 4; }
`;
fs.writeFileSync(path.join(dir, 'variant-3-outer-column.html'), page(
  'Variant 3 — Outer ledger column',
  'Extends the app’s own documented alignment spine — “28px glyph | 1fr content | action” — with a second fixed peer column, the same technique <code>.row-badge</code> already uses, rather than nesting inside <code>.row-main</code>. Structurally the most literal reading of the CLAUDE.md “fixed grid column” precedent, but it touches the shared row grid that shape-card rows and the action cluster also sit in, so it needs the explicit <code>grid-column</code> pins shown in this file’s CSS to stay safe.',
  v3css,
  ROWS.map(r => rowHtml(r, starSlotSilent, true)).join('\n'),
  ''
));

console.log('Built 3 variant pages.');
