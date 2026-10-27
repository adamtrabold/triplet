const C=require('/home/user/la-trip-map/.claude/worktrees/agent-aa87261f0af87c8cb/design/icon-system/grid/src/right-cells.js');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const OUT='/tmp/claude-0/-home-user-la-trip-map/e88b6fb0-7c93-5435-a682-b10a85f40e06/scratchpad/dir281';
const row=(h)=>`<div style="display:flex;align-items:center;gap:8px;padding:4px;background:${C.PAPER}">${h}</div>`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});
for(const dpr of [3,2]){const p=await b.newPage({viewport:{width:600,height:400},deviceScaleFactor:dpr});
for(const s of ['v280','now']){
 const html=row(C.BADGE.map(n=>C.badge(s,n,18)).join('')+C.star(s))+row(C.BADGE.map(n=>C.badge(s,n,24)).join(''))+row(C.BADGE.map(n=>C.chip(s,n)).join('')+C.plus(s));
 await p.setContent(`<body style="margin:0;background:#fff"><div id=r style="width:max-content">${html}</div></body>`);
 await (await p.$('#r')).screenshot({path:`${OUT}/${s}-${dpr}x.png`});}
await p.close();}
await b.close();})();
