const fs=require('fs');const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const OUT=__dirname+'/';
const W='/home/user/la-trip-map/.claude/worktrees/agent-a2bc602b88e94ba39/design/icon-system/';
const INK={cafe:'#6E4C22',bar:'#3D5A7A',museum:'#523875',nature:'#1E3A2B',restaurant:'#7A2436',landmark:'#4889A8',attraction:'#547326',venue:'#AF4B82',hotel:'#2E2433',shopping:'#8A7AA8',park:'#3F925B',neighbourhood:'#328177',street:'#5E2C17'};
const E=['landmark','attraction','venue','hotel','shopping','park','neighbourhood','street'],A=['cafe','bar','museum','nature','restaurant'];
const rd=f=>fs.readFileSync(f,'utf8').match(/ d="([^"]+)"/)[1];
const D={};E.forEach(k=>D[k]=rd(W+'batch2/handdrawn/18/'+k+'.svg'));A.forEach(k=>D[k]=rd(W+'grid/svg/system/18/'+k+'.svg'));
const dia=k=>k==='neighbourhood'||k==='street';
function badge(k,sc,mono){const rw=4/3,c=12,I=mono?'#222':INK[k];const sh=dia(k)?`<polygon points="${c},${rw/2} ${24-rw/2},${c} ${c},${24-rw/2} ${rw/2},${c}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}" stroke-linejoin="round"/>`:`<circle cx="12" cy="12" r="${12-rw/2}" fill="#F2EBDD" stroke="${I}" stroke-width="${rw}"/>`;return `<svg width="${24*sc}" height="${24*sc}" viewBox="0 0 24 24">${sh}<path fill="${I}" fill-rule="evenodd" d="${D[k]}"/></svg>`;}
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});
for(const dsf of [3,2]){const p=await b.newPage({deviceScaleFactor:dsf,viewport:{width:420,height:120}});
await p.setContent(`<body style="margin:6px;background:#FAF5EA"><div style="display:flex;gap:6px">${A.map(k=>badge(k,1)).join('')}</div><div style="display:flex;gap:6px;margin-top:6px">${E.map(k=>badge(k,1)).join('')}</div><div style="display:flex;gap:6px;margin-top:6px">${[...A,...E].map(k=>badge(k,1,1)).join('')}</div></body>`);
await p.screenshot({path:OUT+`t${dsf}.png`,clip:{x:0,y:0,width:340,height:96}});}
const p=await b.newPage({deviceScaleFactor:1,viewport:{width:1400,height:600}});
await p.setContent(`<body style="margin:6px;background:#FAF5EA"><div style="display:flex;gap:8px">${A.map(k=>badge(k,6,1)).join('')}</div><div style="display:flex;gap:8px;margin-top:8px">${E.map(k=>badge(k,6,1)).join('')}</div></body>`);
await p.screenshot({path:OUT+'six.png',clip:{x:0,y:0,width:1230,height:310}});
const m=await p.evaluate((D)=>{const o={};for(const k in D){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');document.body.appendChild(s);const pa=document.createElementNS('http://www.w3.org/2000/svg','path');pa.setAttribute('d',D[k]);s.appendChild(pa);const bb=pa.getBBox();
const c=document.createElement('canvas');c.width=c.height=240;const x=c.getContext('2d');x.scale(10,10);x.fill(new Path2D(D[k]),'evenodd');const id=x.getImageData(0,0,240,240).data;let a=0;for(let i=3;i<id.length;i+=4)a+=id[i]/255;
o[k]={x:+bb.x.toFixed(2),y:+bb.y.toFixed(2),w:+bb.width.toFixed(2),h:+bb.height.toFixed(2),bot:+(bb.y+bb.height).toFixed(2),ink:+(a/100).toFixed(1),fill:+(a/100/(bb.width*bb.height)).toFixed(2)};}return o;},D);
for(const k in m)console.log(k,JSON.stringify(m[k]));await b.close();})();
