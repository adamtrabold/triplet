const {chromium}=require(process.env.PW);
const fs=require('fs');
const OUT=__dirname+'/';
const G='/home/user/la-trip-map/.claude/worktrees/agent-a574efee8dd757248/design/icon-system/grid/svg/pixel-shapes/';
const before=JSON.parse(fs.readFileSync(G+'before.json'));
const get=f=>fs.readFileSync(G+f,'utf8').match(/ d="([^"]+)"/g).map(s=>s.slice(4,-1));
const rows=[['cafe',[before.cafe],get('cafe.svg')],['bar',[before.bar],get('bar-A.svg'),get('bar-B.svg'),get('bar-C.svg')],['museum',[before.museum],get('museum-A.svg'),get('museum-B.svg'),get('museum-C.svg')],['nature',[before.nature],[before.nature]],['restaurant',[before.restaurant],get('restaurant.svg')]];
function svg(ds,s){return `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="#F3EBDD" stroke="#12293F" stroke-width="1.5"/>${ds.map(d=>`<path fill-rule="evenodd" fill="#12293F" d="${d}"/>`).join('')}</svg>`}
const html=s=>`<body style="margin:0;background:#FAF5EA;padding:4px">${rows.map(r=>`<div style="display:flex;gap:${s/3}px;margin-bottom:${s/3}px">${r.slice(1).map(d=>svg(d,s)).join('')}</div>`).join('')}</body>`;
(async()=>{const b=await chromium.launch();
for(const [s,dpr] of [[24,1],[24,2],[24,3],[72,2]]){const p=await b.newPage({deviceScaleFactor:dpr,viewport:{width:Math.round(s*5.6)+10,height:Math.round(s*6.8)}});await p.setContent(html(s));await p.screenshot({path:OUT+`out-${s}-${dpr}x.png`});}
await b.close();})();
