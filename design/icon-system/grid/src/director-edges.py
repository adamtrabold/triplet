import re,sys,json
B=json.load(open(sys.argv[1]))
for name,v in B.items():
    d=v['d']; toks=re.findall(r'[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?',d)
    i=0;cur=None;start=None;segs=[];cmd=None
    while i<len(toks):
        t=toks[i]
        if t in 'MLCZ':
            cmd=t;i+=1
            if cmd=='Z':
                segs.append((cur,start));cur=start
            continue
        n={'M':2,'L':2,'C':6}[cmd]
        a=list(map(float,toks[i:i+n]));i+=n
        p=(a[-2],a[-1])
        if cmd=='M': start=p
        else: segs.append((cur,p))
        cur=p
    H=set();V=set();xs=[];ys=[]
    for p,q in segs:
        if p is None: continue
        xs.append(q[0]);ys.append(q[1])
        if abs(p[1]-q[1])<1e-3 and abs(p[0]-q[0])>=0.4: H.add((round(p[1],3),round(abs(p[0]-q[0]),2)))
        if abs(p[0]-q[0])<1e-3 and abs(p[1]-q[1])>=0.4: V.add((round(p[0],3),round(abs(p[1]-q[1]),2)))
    print(name,'box x %.3f..%.3f y %.3f..%.3f'%(min(xs),max(xs),min(ys),max(ys)))
    print('  H y:',sorted(H))
    print('  V x:',sorted(V))
