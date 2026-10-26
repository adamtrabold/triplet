const {chromium}=require(process.env.PW);
const fs=require('fs');
const OUT=__dirname+'/';
const G='/home/user/la-trip-map/.claude/worktrees/agent-a574efee8dd757248/design/icon-system/grid/svg/pixel-shapes/';
const before=JSON.parse(fs.readFileSync(G+'before.json'));
const get=f=>fs.readFileSync(G+f,'utf8').match(/ d="([^"]+)"/g).map(s=>s.slice(4,-1));
const six=m=>[get('cafe.svg'),get('bar-C.svg'),m,[before.nature],get('restaurant.svg')];
const rows=[[[before.cafe],[before.bar],[before.museum],[before.nature],[before.restaurant]],six(get('museum-A.svg')),six(get('museum-B.svg')),six(get('museum-B4.svg')),six(get('museum-C.svg'))];
function badge(ds,s){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="#F3EBDD" stroke="#12293F" stroke-width="1.5"/>${ds.map(d=>`<path fill-rule="evenodd" fill="#12293F" d="${d}"/>`).join('')}</svg>`}
function plus(ds,s){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect width="24" height="24" fill="#EE7434"/>${ds.map(d=>`<path fill-rule="evenodd" fill="#12293F" d="${d}"/>`).join('')}</svg>`}
const pl=[[before.plus],get('plus.svg'),get('plus-15.svg')];
const html=s=>`<body style="margin:0;background:#FAF5EA;padding:4px">${rows.map(r=>`<div style="display:flex;gap:${s/4}px;margin-bottom:${s/4}px">${r.map(d=>badge(d,s)).join('')}</div>`).join('')}<div style="display:flex;gap:${s/4}px">${pl.map(d=>plus(d,s)).join('')}</div></body>`;
(async()=>{const b=await chromium.launch();
for(const [s,dpr] of [[24,2],[24,3],[72,2]]){const p=await b.newPage({deviceScaleFactor:dpr,viewport:{width:Math.round(s*6.4)+10,height:Math.round(s*7.6)}});await p.setContent(html(s));await p.screenshot({path:OUT+`r7-${s}-${dpr}x.png`});}
await b.close();})();
