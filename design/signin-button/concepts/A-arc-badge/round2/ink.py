import sys, math, re
from PIL import Image
pts=[tuple(map(float,p.split(','))) for p in re.findall(r'const SCALLOP = "([^"]+)"',open('../../flow/proto/patch.js').read())[0].split()]
pol=sorted([(math.atan2(y-25,x-25),math.hypot(x-25,y-25)) for x,y in pts])
def R(a):
  for i in range(len(pol)):
    a0,r0=pol[i-1]; a1,r1=pol[i]
    if i==0: a0-=2*math.pi
    if a0<=a<=a1: return r0+(r1-r0)*(a-a0)/(a1-a0)
  return pol[-1][1]
for v in sys.argv[1].split(','):
  im=Image.open(f'/tmp/claude-0/-home-user-la-trip-map/04f8fb34-0476-5960-add5-8bd3d6d8820e/scratchpad/ink-{v}.png').convert('RGB'); W=im.size[0]; k=W/50; px=im.load()
  ys=[];xs=[];clear=99;rows={}
  for y in range(W):
    for x in range(W):
      r,g,b=px[x,y]
      if r<120 and g<120 and b<140 and abs(r-18)+abs(g-41)+abs(b-63)<150:
        X,Y=x/k,y/k; ys.append(Y); xs.append(X); rows.setdefault(y,0); rows[y]+=1
        a=math.atan2(Y-25,X-25); clear=min(clear,R(a)-math.hypot(X-25,Y-25))
  # split person vs text: person = ink near centre column above text; find the largest empty band
  ry=sorted(rows); gaps=[(ry[i+1]-ry[i],ry[i],ry[i+1]) for i in range(len(ry)-1)]
  gp=max(gaps)
  top,bot=min(ys),max(ys)
  col=sorted(set(round(Y*k) for X,Y in zip(xs,ys) if abs(X-25)<2.5))
  cg=max((col[i+1]-col[i],col[i],col[i+1]) for i in range(len(col)-1) if col[i]/k>22)
  gp=(cg[0],cg[1],cg[2])
  print(v, dict(inkTop=round(top,2), inkBottom=round(bot,2), bboxCentreY=round((top+bot)/2,2), centroidY=round(sum(ys)/len(ys),2),
        personBottom=round(gp[1]/k,2), textTop=round(gp[2]/k,2), personToTextGap=round((gp[0])/k,2), minRimClearance=round(clear,2), topRoom=round(top-(25-18.81),2), bottomRoom=round(25+18.81-bot,2)))
