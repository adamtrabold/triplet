const fs = require('fs');
const path = require('path');
const { TOKENS, SYMBOLS, badge, tilt } = require('./_shared');

const BASE_CSS = `
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { background: var(--paper); }
  :root { ${TOKENS} }
  body { font-family: var(--font-ui); width: 390px; }
  h1 { font-family: var(--font-ui); font-size: 12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
       color: var(--ink-2); padding: 12px 16px 4px; background: var(--paper-raised); border-bottom:1px solid var(--hair); }
  .location-card {
    display: grid;
    grid-template-columns: var(--col-glyph) 1fr auto;
    column-gap: var(--gap);
    align-items: center;
    min-height: 56px;
    padding: var(--s2) var(--gutter);
    background: var(--paper);
    border-bottom: 1px solid var(--hair);
    position: relative;
  }
  .location-card.is-visited { background: var(--paper-filed); }
  .location-card.highlighted { background: var(--figure-deep); border-bottom-color: var(--figure-deep); }
  .location-card.highlighted h3 { color: var(--paper); }
  .location-card.highlighted .row-meta { color: var(--paper-warm); }
  .location-card.highlighted .delete-btn { color: var(--paper); border-color: var(--paper); }
  .row-badge { width: var(--col-glyph); height: var(--col-glyph); display:flex; align-items:center; justify-content:center; }
  .row-main { min-width: 0; position: relative; }
  .location-card h3 {
    font-size: 15px; line-height: 20px; font-weight: 600; letter-spacing: -0.005em; color: var(--ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .location-card .row-meta {
    font-stretch: 75%; text-transform: uppercase; font-size: 10px; line-height: 12px; letter-spacing: .1em;
    font-weight: 700; color: var(--ink-2); margin-top: var(--s1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .location-card.highlighted .row-meta { color: var(--paper-warm); }
  .row-stamp {
    position: relative; flex-shrink: 0; width: calc(var(--s6) * 3); height: var(--s8); margin-right: var(--s2);
    color: color-mix(in srgb, var(--navy) 82%, transparent);
    transform: rotate(var(--stamp-tilt, -3deg));
    display:flex; align-items:center; justify-content:center;
  }
  .row-stamp-ring {
    position: absolute; inset: var(--s1); border: 2px solid currentColor; border-radius: 50%;
    display:flex; align-items:center; justify-content:center; text-transform:uppercase; font-size:10px;
    letter-spacing:.08em; font-weight:700; font-stretch:75%;
  }
  .location-card.highlighted .row-stamp { color: var(--paper); }
  .location-actions { display:flex; gap: var(--s1); align-items:center; }
  .delete-btn { width: var(--col-action); height: var(--col-action); border:none; background:transparent; color: var(--ink-2);
                font-size:20px; line-height:1; display:flex; align-items:center; justify-content:center; }
`;

function row({ id, name, category, starred, visited, highlighted, extraClass = '', variantMarkup = {} }) {
  const ink = { restaurant: '#A8400C', attraction: '#12293F', shopping: '#5A564C', cafe: '#A8400C' }[category] || '#5A564C';
  const cls = ['location-card', highlighted ? 'highlighted' : '', visited ? 'is-visited' : '', extraClass].filter(Boolean).join(' ');
  const stamp = visited ? `<span class="row-stamp" style="--stamp-tilt:${tilt(id)}deg"><span class="row-stamp-ring">Visited</span></span>` : '';
  return `<div class="${cls}" data-starred="${!!starred}" style="${variantMarkup.cardStyle || ''}">
    ${variantMarkup.beforeBadge || ''}
    <div class="row-badge">${badge(category, ink)}</div>
    <div class="row-main">${variantMarkup.inMain ? variantMarkup.inMain(starred) : ''}
      <h3>${name}</h3>
      <div class="row-meta">${category.toUpperCase()}${category === 'restaurant' ? ' &middot; REYKJAVIK' : ' &middot; COPENHAGEN'}</div>
    </div>
    <div class="location-actions">${variantMarkup.inActions ? variantMarkup.inActions(starred) : ''}${stamp}<button class="delete-btn">&times;</button></div>
  </div>`;
}

const ROWS = [
  { id: 'a', name: 'Bæjarins Beztu', category: 'restaurant', starred: true },
  { id: 'b', name: 'Restaurant Mother Copenhagen Nyhavn Terrace', category: 'restaurant', starred: true },
  { id: 'c', name: 'Rundetaarn', category: 'attraction', starred: false },
  { id: 'd', name: 'Tivoli Gardens', category: 'attraction', starred: true, highlighted: true },
  { id: 'e', name: 'Illums Bolighus', category: 'shopping', starred: true, visited: true },
];

function page(title, variantCss, variantMarkup) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}${variantCss}</style></head>
  <body>${SYMBOLS}<h1>${title}</h1><div id="locations">
  ${ROWS.map(r => row({ ...r, variantMarkup })).join('\n')}
  </div></body></html>`;
}

// ---- Variant B: dog-ear fold -------------------------------------------
const B_CSS = `
  .location-card { overflow: hidden; }
  .dogear { position: absolute; top: 0; right: 0; width: 0; height: 0;
    border-style: solid; border-width: 0 16px 16px 0;
    border-color: transparent var(--figure-deep) transparent transparent; }
  .location-card.highlighted .dogear { border-color: transparent var(--paper) transparent transparent; }
`;
const B_MARK = { beforeBadge: (s) => '', inMain: null,
  cardStyle: '', };
function bRow(r) {
  const dogear = r.starred ? `<span class="dogear" aria-hidden="true"></span>` : '';
  return { ...r, variantMarkup: { beforeBadge: dogear } };
}

// ---- Variant C: left-edge spine stripe ----------------------------------
const C_CSS = `
  .location-card.stripe-starred::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--figure-deep);
  }
  .location-card.highlighted.stripe-starred::before { background: var(--paper); }
`;
function cRow(r) {
  return { ...r, extraClass: r.starred ? 'stripe-starred' : '' };
}

// ---- Variant D: star joins the action-cluster (trailing, with the stamp) -
const D_CSS = `
  .action-star { width: 18px; height: 18px; display:flex; align-items:center; justify-content:center; color: var(--ink); flex-shrink:0; }
  .location-card.highlighted .action-star { color: var(--paper); }
`;
function dRow(r) {
  const starMark = (starred) => starred
    ? `<span class="action-star" title="Starred"><svg width="16" height="16" viewBox="0 0 24 24"><use href="#g-star"/></svg></span>`
    : '';
  return { ...r, variantMarkup: { inActions: starMark } };
}

function build(name, rowsFn, css) {
  const rows = ROWS.map(rowsFn);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}${css}</style></head>
  <body>${SYMBOLS}<h1>${name}</h1><div id="locations">
  ${rows.map(r => row(r)).join('\n')}
  </div></body></html>`;
  fs.writeFileSync(path.join(__dirname, `${name}.html`), html);
}

build('variant-b-dogear', bRow, B_CSS);
build('variant-c-stripe', cRow, C_CSS);
build('variant-d-action-star', dRow, D_CSS);

console.log('built');
