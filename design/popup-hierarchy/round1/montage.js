// Review helper: one strip per concept of its 1x phone stills (state order as rendered).
//   node montage.js <outdir>
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const order = ['busiest', 'busiest-x', 'bare', 'shape'];
for (const c of ['quiet', 'fold', 'sheet', 'row', 'tab', 'dock', 'rail', 'lug']) {
  const dir = path.join(__dirname, c); if (!fs.existsSync(dir)) continue;
  const files = order.map(s => path.join(dir, `${s}-phone@1x.png`)).filter(f => fs.existsSync(f));
  execFileSync('convert', [...files, '+append', path.join(out, c + '.png')]);
}
