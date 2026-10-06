// Inlines the renders into page.src.html as base64 -> ux-analysis.html.
//   node design/popup-hierarchy/build-page.js
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'page.src.html'), 'utf8');
const out = src.replace(/\{\{([^}]+)\}\}/g, (_, n) => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'current', n + '.png')).toString('base64'));
fs.writeFileSync(path.join(__dirname, 'ux-analysis.html'), out);
console.log('ux-analysis.html', (out.length / 1048576).toFixed(2), 'MB');
