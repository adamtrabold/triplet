const {chromium}=require(process.env.PW);
const fs=require('fs');
const OUT=__dirname+'/';
const G='/home/user/la-trip-map/.claude/worktrees/agent-a574efee8dd757248/design/icon-system/grid/svg/pixel-shapes/';
const before=JSON.parse(fs.readFileSync(G+'before.json'));
const get=f=>fs.readFileSync(G+f,'utf8').match(/ d="([^"]+)"/g).map(s=>s.slice(4,-1));
const ap=k=>[before[k]];
const row=(bar,mus)=>[get('cafe.svg'),bar,mus,ap('nature'),get('restaurant.svg')];
const rows=[[ap('cafe'),ap('bar'),ap('museum'),ap('nature'),ap('restaurant')],row(get('bar-D.svg'),get('museum-D.svg')),row(get('bar-E.svg'),get('museum-E.svg'))];
const badge=(ds,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11.25" fill="#F3EBDD" stroke="#12293F" stroke-width="1.5"/>${ds.map(d=>`<path fill-rule="evenodd" fill="#12293F" d="${d}"/>`).join('')}</svg>`;
const bare=(ds,s,bg)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect width="24" height="24" fill="${bg}"/>${ds.map(d=>`<path fill-rule="evenodd" fill="#12293F" d="${d}"/>`).join('')}</svg>`;
const pl=[get('plus-15c.svg'),get('plus-175c.svg'),get('plus.svg')];
const html=s=>`<body style="margin:0;background:#FAF5EA;padding:4px">${rows.map(r=>`<div style="display:flex;gap:${s/4}px;margin-bottom:${s/4}px">${r.map(d=>badge(d,s)).join('')}</div>`).join('')}<div style="display:flex;gap:${s/4}px">${pl.map(d=>bare(d,s,'#EE7434')).join('')}${pl.map(d=>bare(d,s,'#FAF5EA')).join('')}</div></body>`;
(async()=>{const b=await chromium.launch();
for(const [s,dpr] of [[24,2],[24,3],[72,2]]){const p=await b.newPage({deviceScaleFactor:dpr,viewport:{width:Math.round(s*7.6)+10,height:Math.round(s*5.2)}});await p.setContent(html(s));await p.screenshot({path:OUT+`r8-${s}-${dpr}x.png`});}
await b.close();})();
