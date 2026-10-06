// One phone-readable filmstrip per carried variant: the main pull, the open card, the put-back, and the Visited
// moment, in order, two frames per row, each captioned. Built from the 1x phone stills.
//   node design/popup-hierarchy/round4/file/filmstrip.js   ->  <variant>/filmstrip.png
const path = require('path'), { execFileSync } = require('child_process');
const D = __dirname;
const S = {
  rolo: ['Rolodex', [['f1', '1  The list is a card drawer. Tap VEGA (stop 2)'], ['f2', '2  The drawer opens; the card tips forward'],
    ['busiest', '3  Open: stop 1 stands behind, stop 3 in front'], ['f4', '4  Put back: it tips back into its place'],
    ['v1', '5  Another place: tap Mark visited'], ['v2', '6  The row’s stamp comes down in its slot']]],
  out: ['Dealt Out', [['f1', '1  The list is a card file. Tap VEGA (stop 2)'], ['f2', '2  Pulled out of the file'],
    ['busiest', '3  Laid under its pin; the file keeps a slot'], ['f4', '4  Put back: it slides home to its slot'],
    ['v1', '5  Another place: tap Mark visited'], ['v2', '6  Stamp comes down; the tab inks like the pin']]],
};
for (const [v, [title, frames]] of Object.entries(S)) {
  const tiles = frames.map(([n, cap], i) => {
    const out = path.join('/tmp', `fs-${v}-${i}.png`);
    execFileSync('convert', [path.join(D, v, `${n}-phone@1x.png`), '-bordercolor', '#D8CEBA', '-border', '1',
      '-background', '#FAF5EA', '-fill', '#1A1A18', '-font', 'DejaVu-Sans', '-pointsize', '17', '-size', '392x', `caption:${cap}`,
      '-gravity', 'West', '-append', '-bordercolor', '#FAF5EA', '-border', '10', out]);
    return out;
  });
  const rows = [];
  for (let i = 0; i < tiles.length; i += 2) { const r = path.join('/tmp', `fs-${v}-row${i}.png`); execFileSync('convert', [tiles[i], tiles[i + 1], '+append', r]); rows.push(r); }
  execFileSync('convert', ['-background', '#FAF5EA', '-fill', '#1A1A18', '-font', 'DejaVu-Sans-Bold', '-pointsize', '28', '-size', '824x', `caption:  Card File: ${title}, in motion`,
    ...rows, '-append', '+repage', '-depth', '8', path.join(D, v, 'filmstrip.png')]);
  console.log(v, 'filmstrip.png');
}
