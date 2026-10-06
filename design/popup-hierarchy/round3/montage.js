// Review helper: one strip of 1x phone stills per concept.  node montage.js <outdir> <concept> [name ...]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const [out, c, ...names] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const all = names.length ? names : fs.readdirSync(path.join(__dirname, c)).filter(f => f.endsWith('-phone@1x.png')).map(f => f.replace('-phone@1x.png', '')).sort();
for (let i = 0; i < all.length; i += 5) {
  const files = all.slice(i, i + 5).map(n => path.join(__dirname, c, `${n}-phone@1x.png`));
  execFileSync('convert', [...files, '+append', path.join(out, `${c}-${i / 5}.png`)]);
  console.log(`${c}-${i / 5}.png`, all.slice(i, i + 5).join(' '));
}
