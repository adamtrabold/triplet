// City CRUD contact sheets: the raw phone frames (raw/*.png, 390x844 @3x) laid out with titles and plain
// captions, one sheet per moment, rendered @3x.
//   CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node design/city-crud/stills/sheet.js
const path = require('path'), fs = require('fs');
const P = require('../../add-tag-jam/p2/lib-p2.js');
const RAW = path.join(__dirname, 'raw');
const SHEETS = [
  ['1-today-and-address', '1 · Today, and the address line (every concept)', [
    ['T1-today', 'Today: the owner\'s add', 'Longwood Gardens gets NEW "East Marlborough Township". There is no way to say Philadelphia.'],
    ['S1-address-search', 'Type the address in ADDRESS', 'NAME and ADDRESS are two lines and each one searches. Address results open under the address.'],
    ['S2-address-picked', 'Name it what you call it', 'A pick fills the address; NAME is yours ("Rental, night 2"). The city is still guessed: NEW Wilmington.'],
  ]],
  ['2-B-file-a-stop', '2 · B City Labels (recommended): file a roadtrip stop under a city that isn\'t there yet', [
    ['B1-menu-name-a-city', 'Tap the city, name your own', 'The city menu keeps "+ Wilmington" (where it is) and adds a line to type any name: "Philadelphia".'],
    ['B2-filed-under-new', 'Filed under Philadelphia', 'NEW stamp until ADD makes it; the address still says Wilmington; the note says how far from Philadelphia.'],
  ]],
  ['3-B-city-label', '3 · B: a city has its own label (tap its name in the list)', [
    ['B3-label', 'Read', 'Its own tag, hung from the city\'s centre: name, where it is, places / visited / farthest. Rename, Move, Delete.'],
    ['B4-rename', 'Rename', 'Any name: a city is a part of a trip, not a boundary.'],
    ['B5-move', 'Move', 'The city\'s signpost stands still; drag the map under it. Go-to and distances use the new spot.'],
    ['B6-delete', 'Delete', 'Say where its places go (default: the nearest city), or delete them too. Here: the township the app made by mistake.'],
  ]],
  ['4-B-make-a-city-first', '4 · B: make a city before any place (title menu)', [
    ['B7-title-new-city', 'New city', 'Places side of the title menu gets "New city", like Plans has "New plan".'],
    ['B8-create-search', 'A blank City Label', 'Type a name; it searches towns so the centre is real. Nothing picked: it can still be made.'],
    ['B9-create-ready', 'Make city', 'Picked: Philadelphia, centred on City Hall. MAKE CITY.'],
  ]],
  ['5-A-write-on-the-line', '5 · A Write on the line (alternative)', [
    ['A1-type-the-city', 'Type the city', 'The city line itself becomes a text field; the menu filters your cities and offers what you typed as a new one.'],
    ['A2-edit-cities', 'Edit cities', 'The title menu gets an edit mode: each name is writable, each has a delete x. No centre to set: it follows the name.'],
    ['A3-delete-in-menu', 'Delete, in the menu', 'The row opens: where its places go, Cancel / Delete.'],
  ]],
  ['6-C-the-city-youre-in', '6 · C The city you\'re in (alternative)', [
    ['C1-new-city-in-menu', 'New city, typed in the menu', 'Like New plan: name it, Create. You are now in it.'],
    ['C2-working-city', 'You\'re in Philadelphia', 'Its section says what will happen; its foot has Rename, Move centre, Delete city (as a plan\'s foot does).'],
    ['C3-far-stop-files-here', 'A far stop files here', 'Cape Henlopen is 130 km out, nowhere near any city, so it goes to the city you\'re in, not a NEW Lewes.'],
  ]],
];
const FW = 300;   // frame width on the sheet, css px (900 px at 3x)
(async () => {
  const b = await P.lib.launch();
  const ctx = await b.newContext({ deviceScaleFactor: 3, viewport: { width: 800, height: 600 } });
  const page = await ctx.newPage();
  for (const [file, title, frames] of SHEETS) {
    const cells = frames.map(([f, h, c]) => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(RAW, f + '.png')).toString('base64')}"><figcaption><b>${h}</b><span>${c}</span></figcaption></figure>`).join('');
    const w = frames.length * FW + (frames.length + 1) * 20;
    await page.setViewportSize({ width: w, height: 600 });
    await page.setContent(`<!doctype html><html><head><style>
      body { margin: 0; padding: 20px; background: #F2EBDD; font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #12293F; width: ${w - 40}px; }
      h1 { font-size: 22px; line-height: 28px; margin: 0 0 16px; }
      .row { display: flex; gap: 20px; align-items: flex-start; }
      figure { margin: 0; width: ${FW}px; }
      img { width: ${FW}px; display: block; border: 1px solid #D8CEBA; border-radius: 6px; }
      figcaption { margin-top: 10px; font-size: 15px; line-height: 20px; color: #3a3a36; }
      figcaption b { display: block; font-size: 17px; line-height: 22px; color: #12293F; margin-bottom: 2px; }
    </style></head><body><h1>${title}</h1><div class="row">${cells}</div></body></html>`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, file + '.png'), fullPage: true });
    console.log('sheet', file);
  }
  await b.close();
})();
