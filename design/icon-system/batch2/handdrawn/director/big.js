const fs=require('fs');const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const W='/home/user/la-trip-map/.claude/worktrees/agent-a2bc602b88e94ba39/design/icon-system/';
const rd=f=>fs.readFileSync(f,'utf8').match(/ d="([^"]+)"/)[1];
const sets=[['cafe','bar','museum','nature','restaurant'].map(k=>W+'grid/svg/system/18/'+k+'.svg'),['landmark','attraction','venue','hotel'].map(k=>W+'batch2/handdrawn/18/'+k+'.svg'),['shopping','park','neighbourhood','street'].map(k=>W+'batch2/handdrawn/18/'+k+'.svg')];
const grid=`<pattern id="g" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0H0V1" fill="none" stroke="#cbb" stroke-width="0.03"/></pattern>`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});
const p=await b.newPage({viewport:{width:1700,height:420}});
for(let i=0;i<3;i++){const html=sets[i].map(f=>`<svg width="320" height="320" viewBox="5 5 14 14"><defs>${grid}</defs><rect x="0" y="0" width="24" height="24" fill="url(#g)"/><line x1="0" x2="24" y1="17" y2="17" stroke="red" stroke-width="0.03"/><line x1="0" x2="24" y1="7" y2="7" stroke="red" stroke-width="0.03"/><path fill="#222" fill-opacity="0.9" fill-rule="evenodd" d="${rd(f)}"/></svg>`).join('');
await p.setContent(`<body style="margin:4px;background:#fff;display:flex;gap:6px">${html}</body>`);await p.screenshot({path:__dirname+`/big${i}.png`,clip:{x:0,y:0,width:sets[i].length*326+8,height:330}});}
await b.close();})();
