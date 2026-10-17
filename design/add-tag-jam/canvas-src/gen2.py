# Polish pass: every board rebuilt from the shipped elements (index.html), lifted exactly where the canvas format allows.
import sys, json
SP='/tmp/claude-0/-home-user-triplet/8820a84f-f895-59c8-8395-25892ff70eb6/scratchpad/'
ROOT=SP+'canvas/project/'
ADDPTS=open(SP+'addpts.txt').read().strip()
ACCTPTS=open(SP+'acctpts.txt').read().strip()
PAPER='#F2EBDD'; RAISED='#FAF5EA'; FILED='#E7DFD0'; INK='#1A1A18'; INK2='#5A564C'; NAVY='#12293F'; HAIR='#D8CEBA'
OR='#EE7434'; ODEEP='#A8400C'; GROUND='#F2EFE9'; NB='#2B6CB0'
C={'restaurant':'#7A2436','cafe':'#6E4C22','bar':'#3D5A7A','attraction':'#547326','nature':'#1E3A2B','shopping':'#8A7AA8','area':'#2B3F52','hotel':'#2E2433','other':'#4F5450','district':'#328177','street':'#5E2C17'}
# the app's #g-<category> symbols, verbatim
G={'restaurant':'<path d="M6 2h2v7h1V2h2v7h1V2h2v8a3 3 0 0 1-2 2.83V22h-4v-9.17A3 3 0 0 1 6 10V2z"/>',
'cafe':'<path d="M3 4h13v7a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V4z"/><path d="M17 6h2a3 3 0 0 1 0 6h-2V6z"/><path d="M2 19h16v2H2z"/>',
'bar':'<path d="M3 3h18l-8 9v7h4v2H7v-2h4v-7L3 3z"/>',
'attraction':'<path d="M12 2l3 6v11H9V8l3-6z"/><path d="M7 20h10v2H7z"/>',
'nature':'<path d="M12 2l4 6h-2.5l3 5H14l3.5 6h-11L10 13H7.5l3-5H8l4-6z"/><path d="M11 18h2v4h-2z"/>',
'shopping':'<path d="M12 1a4 4 0 0 0-4 4v2h2V5a2 2 0 0 1 4 0v2h2V5a4 4 0 0 0-4-4z"/><path d="M4 7h16l-1.5 15h-13L4 7z"/>',
'area':'<path d="M3 4h18v2H3zM3 18h18v2H3zM3 4h2v16H3zM19 4h2v16h-2z"/><path d="M8.5 18l6-12h2l-6 12h-2zM13.5 18l5-10v4l-3 6h-2z"/>',
'hotel':'<path d="M2 6h3v7h9a5 5 0 0 1 5 5v3h-3v-2H5v2H2V6z"/><circle cx="8.5" cy="9.5" r="2.5"/>',
'other':'<circle cx="12" cy="12" r="5"/>'}
STARD='M10.81 2.74A1.3 1.3 0 0 1 13.19 2.74L15.45 7.81A0.6 0.6 0 0 0 15.93 8.17L21.46 8.75A1.3 1.3 0 0 1 22.19 11.01L18.06 14.73A0.6 0.6 0 0 0 17.88 15.30L19.03 20.73A1.3 1.3 0 0 1 17.11 22.12L12.30 19.35A0.6 0.6 0 0 0 11.70 19.35L6.89 22.12A1.3 1.3 0 0 1 4.97 20.73L6.12 15.30A0.6 0.6 0 0 0 5.94 14.73L1.81 11.01A1.3 1.3 0 0 1 2.54 8.75L8.07 8.17A0.6 0.6 0 0 0 8.55 7.81Z'
ROWCHK='M0.75 12.09Q0.05 12.80 0.75 13.51L8.90 21.66Q9.61 22.36 10.28 21.62L23.28 7.33Q23.95 6.59 23.21 5.92L20.03 3.02Q19.29 2.35 18.62 3.09L10.06 12.50Q9.39 13.24 8.68 12.53L5.21 9.05Q4.50 8.35 3.79 9.05Z'
TRACK='M36 .75H37.5A33.75 14.75 0 0 1 71.25 15.5V16.5A33.75 14.75 0 0 1 37.5 31.25H34.5A33.75 14.75 0 0 1 .75 16.5V15.5A33.75 14.75 0 0 1 34.5 .75Z'
def glyph(cat,col):
    if cat=='district': return f'<path fill="none" stroke="{col}" stroke-width="2.5" stroke-dasharray="6 4" d="M4 5h16v14H4z"/>'
    if cat=='street': return f'<path fill="none" stroke="{col}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 8" d="M3 18C7 6 17 18 21 6"/>'
    return f'<g fill="{col}">{G[cat]}</g>'
# badgeHtml(category, 'circle', size, opts): rim, field, glyph sized max(18, field-4) capped at field-2
def rbadge(cat,size=24,fill=PAPER,mark=None,rim=2,show_glyph=True,ink=None):
    ink=ink or C[cat]; mark=mark or ink; c=size/2; r=c-rim/2
    g=''
    if show_glyph:
        field=size-rim*2; gs=min(field-2,max(18,field-4)); o=(size-gs)/2
        g=f'<svg x="{o}" y="{o}" width="{gs}" height="{gs}" viewBox="0 0 24 24">{glyph(cat,mark)}</svg>'
    return f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" aria-hidden="true" style="display:block;flex:none"><circle cx="{c}" cy="{c}" r="{r}" fill="{fill}" stroke="{ink}" stroke-width="{rim}"/>{g}</svg>'
# markerStarHtml(): a paper halo under the orange star on the seal's upper-right shoulder
def mstar(size,halo=3,out=0):
    s=size/2 if size>=24 else 10; c=size/2; r=c-1+out; import math
    x=c+r*math.sqrt(.5)-s/2; y=c-r*math.sqrt(.5)-s/2
    return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" aria-hidden="true" style="position:absolute;left:{x:.2f}px;top:{y:.2f}px;overflow:visible"><path d="{STARD}" fill="{PAPER}" stroke="{PAPER}" stroke-width="{halo*24/s:.2f}" stroke-linejoin="round"/><path d="{STARD}" fill="{OR}" stroke="{ODEEP}" stroke-width="1.5" stroke-linejoin="round" paint-order="stroke"/></svg>'
def pin(x,y,cat,star=False,size=24,glyph_=True):
    return f'<div style="position:absolute;left:{x-size/2}px;top:{y-size/2}px;width:{size}px;height:{size}px">{rbadge(cat,size,show_glyph=glyph_)}{mstar(size) if star else ""}</div>'
def cluster(x,y,n):   # clusterMarkerIcon(): 22px deep-orange disc, 2px paper ring, the count in paper
    return f'<svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" style="position:absolute;left:{x-11}px;top:{y-11}px"><circle cx="11" cy="11" r="10" fill="{ODEEP}" stroke="{PAPER}" stroke-width="2"/><text x="11" y="11" text-anchor="middle" dominant-baseline="central" font-family="Archivo" font-weight="700" font-size="10" fill="{PAPER}">{n}</text></svg>'
def tex(uid,w,h):   # --tex-flood, as inline SVG filters (same turbulence and colour matrices)
    return (f'<defs><filter id="tt{uid}" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="1" seed="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .98 0 0 0 0 .96 0 0 0 0 .92 0 0 1.3 0 -.79"/></filter>'
            f'<filter id="tf{uid}" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".07 .95" numOctaves="1" seed="9" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .98 0 0 0 0 .96 0 0 0 0 .92 0 0 1.2 0 -.76"/></filter></defs>'
            f'<rect width="{w}" height="{h}" filter="url(#tt{uid})"/><rect width="{w}" height="{h}" filter="url(#tf{uid})"/>')
ACCOUNT=f'<button aria-label="Account" style="position:absolute;z-index:6;right:16px;top:16px;width:50px;height:50px;filter:drop-shadow(0 1px 0 rgba(0,0,0,.25))"><svg width="50" height="50" viewBox="0 0 50 50" aria-hidden="true" style="display:block"><polygon points="{ACCTPTS}" fill="{NAVY}"/><g transform="translate(13 13)" fill="none" stroke="{OR}" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></g></svg></button>'
def addbadge(sheet_top):   # #floatingAddBtn: 60px, the fine 24-lobe die, brand orange on the paper tooth, the + at 26.4 / 1.8182
    return (f'<button aria-label="Add a place" style="position:absolute;z-index:6;left:15.2px;top:{sheet_top-15.2-60}px;width:60px;height:60px"><svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true" style="display:block">'
            f'<clipPath id="addclip"><polygon points="{ADDPTS}"/></clipPath><g clip-path="url(#addclip)"><rect width="60" height="60" fill="{OR}"/><g transform="translate(-23 -71)">{tex("a",160,160)}</g></g>'
            f'<g transform="translate(16.8 16.8) scale(1.1)" fill="none" stroke="{NAVY}" stroke-width="1.8182" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></g></svg></button>')
ZOOM=('<div style="position:absolute;z-index:6;left:10px;top:10px;border:2px solid rgba(0,0,0,.2);border-radius:4px;background:#fff;background-clip:padding-box">'
      '<button aria-label="Zoom in" style="display:block;width:30px;height:30px;line-height:30px;text-align:center;font:bold 18px \'Lucida Console\',Monaco,monospace;color:#000;border-bottom:1px solid #ccc">+</button>'
      '<button aria-label="Zoom out" style="display:block;width:30px;height:30px;line-height:30px;text-align:center;font:bold 18px \'Lucida Console\',Monaco,monospace;color:#000">&#8722;</button></div>')
def credit(bottom):
    return f'<div style="position:absolute;z-index:5;right:0;bottom:{bottom+24}px;background:rgba(255,255,255,.8);padding:0 5px;font:12px/1.4 \'Helvetica Neue\',Arial,Helvetica,sans-serif;color:#333"><span style="color:#0078A8">Leaflet</span> | © OpenStreetMap contributors</div>'
SORT=f'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="8" y1="8" x2="8" y2="21"/><path d="M8 2.5L12.5 9h-9z" fill="currentColor" stroke="none"/><line x1="16" y1="3" x2="16" y2="16"/><path d="M16 21.5L11.5 15h9z" fill="currentColor" stroke="none"/></svg>'
FILT=f'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="18" r="2" fill="currentColor"/></svg>'
LOCATE=f'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="3"/><line x1="12" y1="1" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="23"/><line x1="1" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="23" y2="12"/></svg>'
HB='width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:#12293F;flex-shrink:0'
def header(title_html, collapsed=False, icons=True):   # #locationsHeader
    ic=f'<button aria-label="Sort list" style="{HB}">{SORT}</button><button aria-label="Filters and plans" style="{HB}">{FILT}</button><button aria-label="Show my location" style="{HB}">{LOCATE}</button>' if icons else ''
    return (f'<div style="display:flex;align-items:center;gap:12px;min-height:52px;box-sizing:border-box;padding:9px 16px;background:{PAPER};color:{NAVY};border-bottom:1px solid {HAIR}">'
            f'{title_html}{ic}</div>')
def h2(t): return f'<h2 style="margin:0;flex:1;font-stretch:75%;text-transform:uppercase;font-size:18px;line-height:22px;letter-spacing:.08em;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{t}</h2>'
def rstamp(tilt=-3):   # .row-stamp at 1x
    return (f'<span aria-hidden="true" style="position:relative;flex-shrink:0;width:72px;height:32px;color:rgba(18,41,63,.82);transform:rotate({tilt}deg)"><svg width="72" height="32" viewBox="0 0 72 32" style="position:absolute;inset:0;display:block"><path d="{TRACK}" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" pathLength="166.29" stroke-dasharray="0 1.9797"/></svg>'
            f'<span style="position:absolute;inset:4px;border:2px solid currentColor;border-radius:50%;display:flex;align-items:center;justify-content:center;padding-left:.08em;font-stretch:75%;text-transform:uppercase;font-size:10px;line-height:1;letter-spacing:.08em;font-weight:700;white-space:nowrap"><svg width="8" height="8" viewBox="0 0 24 24" style="flex:none;margin-right:3px"><path d="{ROWCHK}" fill="currentColor"/></svg><span>Visited</span></span></span>')
ROWSTAR=f'<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style="position:absolute;left:0;top:50%;margin-top:-9px;overflow:visible"><path d="{STARD}" fill="{OR}" stroke="{ODEEP}" stroke-width="1.5" stroke-linejoin="round" paint-order="stroke"/></svg>'
def row(cat,name,meta,star=False,visited=False,tilt=-3,lead=None):   # .location-card
    bg=FILED if visited else PAPER
    leadh=lead if lead is not None else f'<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center">{rbadge(cat,24,fill="transparent" if visited else PAPER)}</div>'
    return (f'<div style="display:grid;grid-template-columns:28px 1fr auto;column-gap:12px;align-items:center;min-height:56px;box-sizing:border-box;padding:8px 16px;background:{bg};border-bottom:1px solid {HAIR}">{leadh}'
            f'<div style="position:relative;min-width:0;{"padding-left:26px;" if star else ""}">{ROWSTAR if star else ""}<h3 style="margin:0;font-size:15px;line-height:20px;font-weight:600;letter-spacing:-.005em;color:{INK};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{name}</h3>'
            f'<div style="font-stretch:75%;text-transform:uppercase;font-size:10px;line-height:12px;letter-spacing:.1em;font-weight:700;color:{INK2};margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{meta}</div></div>'
            f'<div style="display:flex;gap:4px;align-items:center">{rstamp(tilt) if visited else ""}<button aria-label="Delete" style="width:28px;height:28px;font-size:14px;line-height:1;color:{INK2}">&#215;</button></div></div>')
ROWS=[('restaurant','Bæjarins Beztu','restaurant · Reykjavík',False,False),('cafe','Brauð &amp; Co, the cinnamon bakery on Frakkastígur','cafe · Reykjavík',True,True),('nature','Blue Lagoon','nature · Reykjavík',False,False),('attraction','Hallgrímskirkja','attraction · Reykjavík',False,False),('attraction','Tivoli','attraction · Copenhagen',False,False),('restaurant','Torvehallerne','restaurant · Copenhagen',False,False)]
def rows(rs): return ''.join(row(*r) for r in rs)
def ktab(up=False):   # K2, decided (owner): the collapse tab on the sheet's edge, right-aligned, icon only
    g=f'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"{' style="transform:rotate(180deg)"' if up else ''}><line x1="4" y1="20" x2="20" y2="20"/><path d="M7 8l5 5 5-5"/></svg>'
    return f'<button aria-label="{"Raise" if up else "Lower"} the list" style="position:absolute;z-index:5;right:16px;top:-24px;width:44px;height:24px;display:flex;align-items:center;justify-content:center;color:{NAVY};background:{PAPER};border:1px solid {HAIR};border-bottom:0;border-radius:4px 4px 0 0;{NEWOUT}">{g}{NEWTAB}</button>'
def sheet(top,head,body='',tab=True): return f'<div style="position:absolute;z-index:4;left:0;right:0;top:{top}px;bottom:0;background:{PAPER};border-top:1px solid {HAIR}">{ktab(top>=BAND_TOP) if tab else ""}{head}{body}</div>'
# NEW marker (one treatment everywhere)
NEWTAB=f'<span aria-hidden="true" style="display:var(--nw-d);position:absolute;z-index:20;right:-4px;top:-11px;background:{NB};color:#fff;font-family:Archivo,sans-serif;font-stretch:75%;font-weight:700;font-size:9px;line-height:11px;letter-spacing:.1em;padding:1px 4px;border-radius:2px">NEW</span>'
NEWTAB_IN=NEWTAB.replace('top:-11px','top:4px').replace('right:-4px','right:52px')
NEWOUT='outline:var(--nw-o);outline-offset:2px;'   # the NEW marker, off unless the "Show what\'s new" tweak is on
def newwrap(h,inner=False): return f'<div style="position:relative;{NEWOUT}{"outline-offset:-2px;" if inner else ""}">{h}{NEWTAB_IN if inner else NEWTAB}</div>'
def newbox(x,y,w,h): return f'<div aria-hidden="true" style="position:absolute;z-index:30;left:{x}px;top:{y}px;width:{w}px;height:{h}px;{NEWOUT}pointer-events:none">{NEWTAB}</div>'
CHEV=lambda col=INK2: f'<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style="flex:none"><path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="{col}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CHECK16=f'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style="flex:none"><path d="M3 7.75l3.2 3.2L13 4.05" fill="none" stroke="{NAVY}" stroke-width="1.5"/></svg>'
# ---- the count, ONE treatment (option 1): "(n)" right after the name, in the name's own type -- the shipped header's way
# the count, decided (owner): a quiet tally -- a smaller grey figure after the name, no brackets
def cnt(n,px=None): return f'<span style="margin-left:.45em;font-size:{str(px)+"px" if px else ".8em"};font-weight:700;letter-spacing:.06em;color:{INK2};font-variant-numeric:tabular-nums">{n}</span>'
# ---- NEW menu: the sort menu's box and row voice; content left-aligned on one edge with the caption; the check at the right
def menu(cap,items,extra_style=''):
    extra_style+='width:max-content;min-width:200px;'
    rows_=''.join(f'''<button style="display:flex;align-items:center;gap:8px;width:100%;height:40px;padding:0 12px;box-sizing:border-box;border-bottom:1px solid {HAIR};text-align:left;{'opacity:.55;' if it.get('dim') else ''}">{it.get('icon','')}<span style="position:relative;top:1px;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;line-height:16px;letter-spacing:.05em;color:{NAVY};white-space:nowrap">{it['label']}</span><span style="flex:1"></span>{CHECK16 if it.get('on') else (EYE_OFF.replace(PAPER,RAISED).replace('width="20" height="20"','width="16" height="16" style="flex:none"') if it.get('dim') else '<span style="width:16px;flex:none"></span>')}</button>''' if not it.get('cap') else f'<div style="height:24px;display:flex;align-items:center;padding:0 12px;border-top:1px solid {HAIR};font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:10px;line-height:12px;letter-spacing:.12em;color:{INK2}">{it["cap"]}</div>' for it in items)
    return f'<div role="menu" style="position:absolute;z-index:25;background:{RAISED};border:1px solid {NAVY};box-shadow:2px 2px 0 {NAVY};border-radius:2px;overflow:hidden;{NEWOUT}{extra_style}"><div style="height:24px;display:flex;align-items:center;padding:0 12px;border-bottom:1px solid {NAVY};font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:10px;line-height:12px;letter-spacing:.12em;color:{INK2}">{cap}</div>{rows_}{NEWTAB}</div>'
# ---------------------------------------------------------------- the tag (round 10's blank tag on the shipped die)
CLIP='clip-path:polygon(28px 0,calc(100% - 28px) 0,100% 28px,100% 100%,0 100%,0 28px)'
MASKV='radial-gradient(circle 5px at 50% 18px,transparent 4.5px,#000 5px),radial-gradient(circle 5px at 0 calc(100% - 60px),transparent 4.5px,#000 5px),radial-gradient(circle 5px at 100% calc(100% - 60px),transparent 4.5px,#000 5px)'
DIE=f'{CLIP};-webkit-mask:{MASKV};-webkit-mask-composite:source-in,source-in;mask:{MASKV};mask-composite:intersect'
def patch(band=False):
    paper='rgba(242,235,221,.28)' if band else PAPER; grom='rgba(242,235,221,.65)' if band else HAIR
    return f'<div aria-hidden="true" style="position:absolute;z-index:1;left:50%;top:4px;width:48px;height:28px;margin-left:-24px;background:radial-gradient(circle at 50% 50%,transparent 4.5px,{grom} 5px,{grom} 8.25px,transparent 8.75px),{paper};clip-path:polygon(4px 0,calc(100% - 4px) 0,100% 4px,100% calc(100% - 4px),calc(100% - 4px) 100%,4px 100%,0 calc(100% - 4px),0 4px)"></div>'
XG=f'<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19" stroke="{INK}" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>'
PEN='color:#57534b'   # pencil (round 10's grey; the grain itself is not reproducible without a data-URI mask)
def tag(name,addr,rows_html,stub_html,cat,top=176,band=False,head='',pad=48,pre=''):
    b=f'<svg aria-hidden="true" width="316" height="36" style="position:absolute;z-index:0;left:0;top:0;display:block"><rect width="316" height="36" fill="{OR}"/>{tex("b",316,36)}</svg>' if band else ''
    pin_size=32; pin_top=top-92
    return (f'<div style="position:absolute;z-index:7;left:{195-pin_size/2}px;top:{pin_top}px">{rbadge(cat,pin_size,fill=C[cat],mark=PAPER,rim=2.5)}</div>'
            f'<div aria-hidden="true" style="position:absolute;z-index:8;left:194.25px;top:{pin_top+pin_size}px;width:1.5px;height:{top+18-(pin_top+pin_size)}px;background:{INK2};border-radius:1px"></div>'
            f'<div style="position:absolute;z-index:7;left:37px;top:{top}px;width:316px">'
            f'<div aria-hidden="true" style="position:absolute;inset:0;filter:drop-shadow(0 0 .5px rgba(107,74,40,.5)) drop-shadow(0 1px 1px rgba(26,26,24,.1)) drop-shadow(0 4px 6px rgba(26,26,24,.08))"><div style="position:absolute;inset:0;background:{RAISED};{DIE}"></div></div>'
            f'<div style="position:relative;z-index:1;background:{RAISED};{DIE}">{b}{patch(band)}{head}'
            f'<div style="position:relative;z-index:2;padding:{pad}px 16px 0 16px;display:flex;flex-direction:column">{pre}'
            f'<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:8px;padding-bottom:4px;border-bottom:1px solid {HAIR}"><h2 style="margin:0;font-size:26px;line-height:28px;font-weight:700;font-stretch:62%;{PEN}">{name}</h2><button aria-label="Cancel" style="padding:0 0 4px">{XG}</button></div>'
            f'<div style="min-height:40px;display:flex;align-items:flex-end;padding-bottom:4px;border-bottom:1px solid {HAIR};font-size:13px;line-height:18px"><span style="{PEN}">{addr}</span></div>'
            f'{rows_html}</div>{stub_html}</div></div>')
LAB='font-stretch:75%;text-transform:uppercase;font-weight:500;font-size:11px;line-height:16px;letter-spacing:.12em;color:#5A564C'   # .tag-lab
PINGLYPH=lambda col: f'<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style="flex:none;display:block"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" fill="none" stroke="{col}" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="{col}"/></svg>'
def sel_row(label,icon,value,caps=False,right='',open_=False,rule=True,navyedge=False):
    bg=NAVY if open_ else PAPER; fg=PAPER if open_ else '#57534b'; bd=NAVY if (open_ or navyedge) else HAIR
    vs='font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;letter-spacing:.12em;' if caps else 'font-weight:600;'
    return (f'<div style="min-height:44px;display:grid;grid-template-columns:40px 150px 1fr;column-gap:8px;align-items:center;padding:6px 0;{f"border-bottom:1px solid {HAIR};" if rule else ""}">'
            f'<span style="{LAB}">{label}</span><button style="height:32px;box-sizing:border-box;display:flex;align-items:center;gap:6px;border:1px solid {bd};border-radius:3px;padding:0 8px 0 6px;background:{bg}">{icon}<span style="font-size:14px;line-height:18px;{vs}color:{fg};white-space:nowrap">{value}</span><span style="flex:1"></span>{CHEV(PAPER if open_ else INK2)}</button>'
            f'<span style="justify-self:start;display:flex;align-items:center">{right}</span></div>')
NEWCITY_PLAIN=f'<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:10px;line-height:14px;letter-spacing:.1em;color:{ODEEP};border:1px solid {ODEEP};border-radius:2px;padding:1px 4px;white-space:nowrap">New city</span>'
def city_row(val,right='',open_=False): return newwrap(sel_row('City',PINGLYPH(PAPER if open_ else INK2),val,right=right,open_=open_))
def type_row(cat,open_=False): return newwrap(sel_row('Type',rbadge(cat,20),cat,caps=True,rule=False,navyedge=open_))
def notes_row(): return f'<div style="min-height:32px;display:flex;align-items:flex-end;padding-bottom:4px;border-bottom:1px solid {HAIR}"><span style="{LAB}">Notes</span></div>'
STAR_OPEN=f'<svg width="20" height="20" viewBox="-1 -1 26 26" aria-hidden="true" style="display:block;overflow:visible"><path d="{STARD}" fill="none" stroke="{INK}" stroke-width="2" stroke-linejoin="round"/></svg>'
STAR_ON=f'<svg width="20" height="20" viewBox="-1 -1 26 26" aria-hidden="true" style="display:block;overflow:visible"><path d="{STARD}" fill="{OR}" stroke="{ODEEP}" stroke-width="1.5" stroke-linejoin="round" paint-order="stroke"/></svg>'
OCHK=f'<svg width="20" height="20" viewBox="-1.5 -1.5 27 27" aria-hidden="true" style="display:block;overflow:visible"><path d="{ROWCHK}" fill="none" stroke="currentColor" stroke-width="2.05" stroke-linejoin="round"/></svg>'
PLUSI='<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
def stub(star=False,visited=False):
    seg='flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding-top:4px;height:60px;box-sizing:border-box;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:11px;line-height:12px;letter-spacing:.08em'
    vis=f'<span style="transform:scale(1.1);display:flex">{rstamp(-3.5)}</span>' if visited else f'{OCHK}<span>Mark visited</span>'
    return (f'<div style="position:relative;z-index:2;margin-top:8px;height:60px;display:flex"><div aria-hidden="true" style="position:absolute;z-index:3;left:10px;right:10px;top:-.75px;border-top:1.5px dashed {HAIR}"></div>'
            f'<button style="{seg};background:{NAVY};color:{PAPER}">{PLUSI}<span>Add</span></button>'
            f'<button aria-pressed="{str(star).lower()}" style="{seg};border-left:1px dashed {HAIR};color:{INK}">{STAR_ON if star else STAR_OPEN}<span>{"Starred" if star else "Star"}</span></button>'
            f'<button aria-pressed="{str(visited).lower()}" aria-label="Visited" style="{seg};border-left:1px dashed {HAIR};color:{INK};{"padding-top:0;" if visited else ""}">{vis}</button></div>')
# ---------------------------------------------------------------- the map
STREETS=f'''<svg aria-hidden="true" width="390" height="844" viewBox="0 0 390 844" style="position:absolute;inset:0"><g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><path d="M-10 300 C 100 280 220 320 400 270"/><path d="M120 -10 C 140 200 110 420 160 860"/><path d="M-10 610 C 120 560 260 640 400 590"/></g><g fill="none" stroke="#E4DDD0" stroke-width="2"><path d="M-10 180 L 400 220"/><path d="M260 -10 L 230 860"/><path d="M-10 450 L 400 420"/><path d="M60 -10 L 40 860"/><path d="M330 -10 L 360 860"/></g><path d="M250 640 q60 -40 150 -20 v240 h-150z" fill="#D7E4EC"/></svg>'''
def mapbg(): return f'<div style="position:absolute;inset:0;background:{GROUND}">{STREETS}</div>'
MAPPINS=[(70,170,'bar',False),(270,140,'restaurant',True),(330,500,'attraction',False),(48,560,'nature',False),(300,610,'cafe',False),(150,650,'shopping',False)]
def mappins(ps=MAPPINS): return ''.join(pin(x,y,c,s) for x,y,c,s in ps)
# ---------------------------------------------------------------- page shells
FONT='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&amp;display=swap">'
CSS="body{margin:0;font-family:'Archivo',-apple-system,sans-serif;color:#1A1A18;-webkit-font-smoothing:antialiased}button{font-family:inherit;border:0;background:none;padding:0;color:inherit;cursor:pointer}h2,h3{font-family:inherit}"
def phone(body): return f'<div style="position:relative;width:390px;height:844px;overflow:hidden;background:{GROUND};flex:none">{body}</div>'
def page(title,inner,w=390,h=844):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONT}
<style>{CSS}</style>
</helmet>
<div style="position:relative;width:{w}px;height:{h}px;background:#E9E2D3;font-family:'Archivo',-apple-system,sans-serif;color:#1A1A18;--nw-o:{{{{nwo}}}};--nw-d:{{{{nwd}}}}">
{inner}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"showNew":{{"editor":"boolean","default":false,"section":"Review"}},"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{
const on = this.props.showNew ?? false;
return {{ nwo: on ? '1.5px dashed {NB}' : 'none', nwd: on ? 'inline' : 'none' }};
}}
}}
</script>
</body>
</html>
'''
def note(t,n,col=NB): return f'<div style="padding:0 0 8px"><span style="display:block;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:16px;letter-spacing:.08em;color:{col}">{t}</span><span style="display:block;font-size:12px;line-height:16px;color:{INK2}">{n}</span></div>'
# the add state: the list dropped to its band (header only), the map with its pins, the tag
BAND_TOP=844-56
def addscreen(tag_html,extra=''):
    return phone(mapbg()+mappins()+ZOOM+ACCOUNT+credit(56)+sheet(BAND_TOP,header(h2('All places'+cnt(202)),collapsed=True))+tag_html+extra)
# ---------------------------------------------------------------- boards
B={}
def tagrows(city='Reykjavík',cat='attraction',right='',open_city=False,open_type=False,mid=None):
    return city_row(city,right,open_city)+(mid if mid is not None else notes_row()+type_row(cat,open_type))
B['Main.dc.html']=('City: same as the real town',lambda: page('City: same as the real town',addscreen(rtag('Sundhöllin','Barónsstígur 45a · Miðborg','attraction'))))
B['CityDifferent.dc.html']=('City: different from the real town',lambda: page('City: different from the real town',addscreen(rtag('Blue Lagoon','Norðurljósavegur 9 · Grindavík','nature'))))
def citynew():
    # three versions of the "new city" mark, in the app's own language, below the phone
    def mk(v):
        if v=='a':   # printed: the tag's own label print, in the accent's deep step, with a printed plus -- the app prints
            return f'<span style="display:inline-flex;align-items:center;gap:3px;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:10px;line-height:12px;letter-spacing:.12em;color:{ODEEP};white-space:nowrap"><svg width="9" height="9" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" stroke="{ODEEP}" stroke-width="3.5" stroke-linecap="round"/></svg>New city</span>'
        if v=='b':   # a luggage-tag tab: the tag's die in miniature (chamfered, an eyelet), printed NEW
            return f'<span style="position:relative;display:inline-flex;align-items:center;height:20px;padding:0 6px 0 13px;background:{ODEEP};color:{PAPER};clip-path:polygon(6px 0,100% 0,100% 100%,6px 100%,0 50%);-webkit-mask:radial-gradient(circle 2px at 7px 50%,transparent 1.6px,#000 2px);mask:radial-gradient(circle 2px at 7px 50%,transparent 1.6px,#000 2px);font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:10px;line-height:12px;letter-spacing:.1em;white-space:nowrap">New</span>'
        if v=='c':   # rubber stamp: the VISITED stamp's construction, smaller, in deep orange
            return f'<span aria-hidden="true" style="position:relative;display:inline-block;width:48px;height:24px;color:rgba(168,64,12,.88);transform:rotate(-4deg)"><svg width="48" height="24" viewBox="0 0 72 32" preserveAspectRatio="none" style="position:absolute;inset:0"><path d="{TRACK}" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" pathLength="166.29" stroke-dasharray="0 1.9797"/></svg><span style="position:absolute;inset:3px;border:1.5px solid currentColor;border-radius:50%;display:flex;align-items:center;justify-content:center;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:9px;line-height:1;letter-spacing:.08em">New</span></span>'
        return NEWCITY_PLAIN
    scr=addscreen(rtag('Jönköpings slott','Slottsgatan 2 · Jönköping','attraction',city='Jönköping',new=True))
    def cell(v,t,n):
        dim='opacity:.4;' if v!='c' else ''
        t=t if v=='c' else t+' (not picked)'
        return f'<div style="flex:1;min-width:0;{dim}">{note(t,n)}<div style="background:{RAISED};border:1px solid {HAIR};padding:8px 10px">{newwrap(sel_row("City",PINGLYPH(INK2),"Jönköping",right=mk(v)).replace("grid-template-columns:40px 150px 1fr","grid-template-columns:40px 118px 1fr"))}</div></div>'
    below=(f'<div style="position:absolute;left:0;right:0;top:860px;padding:0 12px">{note("The “new city” mark: three versions","Picked: C, the rubber stamp, reading just “NEW” (owner). It’s on the tag on the Now page; A and B are greyed.", INK)}'
           f'<div style="display:flex;flex-direction:column;gap:12px">{cell("a","A · Printed","The app prints: the label’s own type in deep orange, with a printed plus. Quiet, like the tag’s labels.")}{cell("b","B · A little tag","The tag’s die in small: chamfered point, punched eyelet, NEW printed on deep orange. The luggage-label voice.")}{cell("c","C · Rubber stamp, picked","The VISITED stamp’s build in deep orange, reading NEW. It says “ADD will make this city”.")}</div></div>')
    return (page('City: a new one',phone(scr)), page('The new-city mark: three versions',below.replace('top:860px','top:16px'),390,600))
B['CityNew.dc.html']=('City: a new one',lambda: citynew()[0])
B['CityNewMarks.dc.html']=('New-city marks',lambda: citynew()[1])
def citychange():
    m=menu('City',[{'icon':PINGLYPH(INK2).replace('width="20" height="20"','width="16" height="16"'),'label':'Reykjavík','on':True},{'label':'Copenhagen','icon':'<span style="width:16px;flex:none"></span>'},{'label':'Malmö','icon':'<span style="width:16px;flex:none"></span>'},{'label':'Stockholm','icon':'<span style="width:16px;flex:none"></span>'},{'label':'Los Angeles','icon':'<span style="width:16px;flex:none"></span>'},{'cap':'New city'},{'label':'+ Grindavík','icon':'<span style="width:16px;flex:none"></span>'}],'left:45px;top:258px;')
    return page('Changing the city',addscreen(rtag('Blue Lagoon','Norðurljósavegur 9 · Grindavík','nature',open_city=True),m))
B['CityChange.dc.html']=('Changing the city',citychange)
def alternatives():
    def card(top,title,inner):
        return (f'<div style="position:absolute;left:37px;top:{top}px;width:316px">{note(title,"",NAVY)}<div style="filter:drop-shadow(0 0 .5px rgba(107,74,40,.5)) drop-shadow(0 1px 1px rgba(26,26,24,.1))">'
                f'<div style="position:relative;background:{RAISED};{CLIP};-webkit-mask:radial-gradient(circle 5px at 50% 18px,transparent 4.5px,#000 5px);mask:radial-gradient(circle 5px at 50% 18px,transparent 4.5px,#000 5px);padding:48px 16px 14px">{patch()}<div style="position:relative;z-index:2">{inner}</div></div></div></div>')
    nm=lambda n: f'<h2 style="margin:0;font-size:26px;line-height:28px;font-weight:700;font-stretch:62%;{PEN}">{n}</h2>'
    i1=(f'<div style="display:flex;justify-content:space-between;align-items:flex-start">{nm("Blue Lagoon")}<button style="position:relative;{NEWOUT}text-align:right;border:1.5px solid {NAVY};border-radius:2px;padding:3px 8px;color:{NAVY}"><span style="display:block;{LAB};font-size:9px;line-height:12px">Filed under</span><span style="display:block;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:16px;line-height:18px;letter-spacing:.08em">Reykjavík</span>{NEWTAB}</button></div>'
        f'<div style="margin-top:10px;padding-bottom:4px;border-bottom:1px solid {HAIR};font-size:13px;line-height:18px;{PEN}">Norðurljósavegur 9 · Grindavík</div>')
    def i2(n,a): return (f'{nm(n)}<div style="margin-top:10px;padding-bottom:4px;border-bottom:1px solid {HAIR};font-size:13px;line-height:18px;display:flex;gap:6px;align-items:baseline"><span style="{PEN}">{a}</span><span style="color:{INK2}">&#8594;</span>'
                         f'<button style="position:relative;{NEWOUT}display:inline-flex;align-items:center;gap:4px;border-bottom:1px dashed {INK2}"><span style="font-size:13px;font-weight:700;color:{NAVY}">Reykjavík</span>{CHEV()}{NEWTAB}</button></div>')
    head=f'<div style="position:absolute;left:37px;top:14px;right:37px">{note("Other ways to show the city","Only on the add/edit tag. A place’s normal tag keeps today’s address line, with no city treatment.",NAVY)}</div>'
    return page('Both truths: two other ways',phone(mapbg()+head+card(80,'A · A routing label',i1)+card(300,'B · One line, an arrow to the filed city',i2('Blue Lagoon','Norðurljósavegur 9 · Grindavík'))+card(510,'B, when the two are the same',i2('Sundhöllin','Barónsstígur 45a · Miðborg'))))
B['CityAlternatives.dc.html']=('Both truths: two other ways',alternatives)
B['TypeClosed.dc.html']=('TYPE as a select: closed',lambda: page('TYPE as a select: closed',addscreen(rtag('Sundhöllin','Barónsstígur 45a · Miðborg','attraction'))))
def typeopen():
    cats=['attraction','restaurant','cafe','bar','nature','shopping','area','hotel']
    m=menu('Type',[{'icon':rbadge(c,20),'label':c,'on':c=='attraction'} for c in cats],'left:101px;top:423px;')
    return page('TYPE as a select: open',addscreen(rtag('Sundhöllin','Barónsstígur 45a · Miðborg','attraction',open_type=True),m))
B['TypeOpen.dc.html']=('TYPE as a select: open',typeopen)
B['StarVisited.dc.html']=('Star and mark visited at add',lambda: page('Star and mark visited at add',addscreen(rtag('Sundhöllin','Barónsstígur 45a · Miðborg','attraction',star=True,visited=True,band=True))))
# ---- browsing screens: the list up (sheet top 400 at 844), the + riding its edge
SHEET_TOP=400
def browse(head,body,extra='',pins=MAPPINS):
    return phone(mapbg()+mappins(pins)+ZOOM+ACCOUNT+credit(844-SHEET_TOP)+addbadge(SHEET_TOP)+sheet(SHEET_TOP,head,body)+extra)
def title_go():
    return f'<button style="position:relative;flex:1;min-width:0;display:flex;align-items:center;gap:6px;text-align:left;{NEWOUT}">{h2("All places"+cnt(202)).replace("flex:1;","")}{CHEV(NAVY)}{NEWTAB}</button>'
GOTO_ITEMS=[{'label':'Reykjavík'+cnt(23)},{'label':'Copenhagen'+cnt(31)},{'label':'Malmö'+cnt(12),'dim':True},{'label':'Stockholm'+cnt(20)},{'label':'Los Angeles'+cnt(23)}]
# Go to's own mark (the earlier target: a ring and a dot), never the shipped "my location" crosshair (#centerMeBtn)
LOCSM=lambda sz=18,col=NAVY: f'<svg width="{sz}" height="{sz}" viewBox="0 0 24 24" aria-hidden="true" style="flex:none"><circle cx="12" cy="12" r="8" fill="none" stroke="{col}" stroke-width="2"/><circle cx="12" cy="12" r="2.5" fill="{col}"/></svg>'
def d1():
    m=menu('Go to',[dict(it,icon=LOCSM(16)) for it in GOTO_ITEMS],f'left:16px;top:{SHEET_TOP+44}px;')
    return page('Go to 1: menu under the list title',browse(header(title_go()),rows(ROWS[:5]),m))
B['GoToHeader.dc.html']=('Go to 1',d1)
EYE=f'<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none" stroke="{INK2}" stroke-width="2"/><circle cx="12" cy="12" r="2.8" fill="{INK2}"/></svg>'
def secA(city,n,count_style=1,new=True,first=False):   # header A, adopted: a row on the list's grid
    label=(city+cnt(n,11)) if count_style==1 else (f'{city} ({n})') if count_style==0 else f'{city}<span style="margin-left:8px;font-size:12px;letter-spacing:.08em;color:{INK2};font-variant-numeric:tabular-nums">{n}</span>'
    # no glyph (owner): the city name IS the go-to target; its left edge on the row icons' left edge (16 + (28-24)/2 = 18)
    h=(f'<div style="display:grid;grid-template-columns:1fr 28px;column-gap:12px;align-items:end;height:60px;box-sizing:border-box;padding:0 16px 6px 18px;background:{PAPER};border-bottom:2px solid {HAIR}">'
       f'<button aria-label="Go to {city}" style="height:32px;display:flex;align-items:flex-end;padding-bottom:4px;text-align:left"><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:14px;letter-spacing:.12em;color:{NAVY};white-space:nowrap">{label}</span></button>'
       f'<button aria-label="Hide {city}" style="width:28px;height:32px;display:flex;align-items:center;justify-content:center">{EYE}</button></div>')
    if first:   # the list's first section sits right under the list header: no extra air (owner)
        h=h.replace('align-items:end;height:60px;box-sizing:border-box;padding:0 16px 6px 18px','align-items:center;height:44px;box-sizing:border-box;padding:0 16px 0 18px').replace('height:32px;display:flex;align-items:flex-end;padding-bottom:4px','height:44px;display:flex;align-items:center').replace('width:28px;height:32px','width:28px;height:44px')
    return newwrap(h,inner=True) if new else h
def d2():
    hidden=newwrap(f'<div style="height:44px;display:flex;align-items:center;gap:8px;padding:0 16px 0 56px;color:{INK2};font-size:13px"><span>Hidden: Malmö</span><button style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:11px;letter-spacing:.1em;color:{NAVY}">Show</button></div>',inner=True)
    body=secA('Reykjavík',23,first=True)+rows([r for r in ROWS if 'Reykjav' in r[2]][:2])+secA('Copenhagen',31)+rows(ROWS[4:6])+sec_hidden('Malmö',12)
    return page('Go to 2: the list in city sections',browse(header(h2('All places'+cnt(202))),body))
B['GoToSections.dc.html']=('Go to 2',d2)
def d3():
    lbl=lambda x,y,n,c: f'<button style="position:absolute;z-index:6;left:{x}px;top:{y}px;display:flex;align-items:center;background:{RAISED};border:1.5px solid {NAVY};border-radius:2px;padding:5px 9px;box-shadow:2px 2px 0 {NAVY};{NEWOUT}"><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;letter-spacing:.08em;color:{NAVY};white-space:nowrap">{n}{cnt(c)}</span>{NEWTAB}</button>'
    land=f'<svg aria-hidden="true" width="390" height="400" viewBox="0 0 390 400" style="position:absolute;left:0;top:0"><rect width="390" height="400" fill="#D7E4EC"/><path d="M20 60 q50 -40 110 -15 q30 25 5 55 q-50 30 -110 10z" fill="{GROUND}"/><path d="M190 150 q30 -70 80 -70 q50 10 80 80 q10 70 -50 120 q-60 15 -95 -35z" fill="{GROUND}"/><path d="M150 260 q25 -25 50 0 q10 35 -25 50z" fill="{GROUND}"/></svg>'
    fit=f'<button aria-label="Show all my cities" style="position:absolute;z-index:6;left:10px;top:84px;height:34px;box-sizing:border-box;padding:0 9px 0 7px;background:#fff;background-clip:padding-box;border:2px solid rgba(0,0,0,.2);border-radius:4px;display:flex;align-items:center;gap:5px;{NEWOUT}">{LOCSM(16)}<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:11px;line-height:14px;letter-spacing:.1em;color:{NAVY};white-space:nowrap">All cities</span>{NEWTAB}</button>'
    scr=phone(land+ZOOM+ACCOUNT+fit+lbl(56,128,'Reykjavík',23)+lbl(230,180,'Stockholm',20)+lbl(150,280,'Copenhagen',31)+lbl(226,330,'Malmö',12)+credit(844-SHEET_TOP)+addbadge(SHEET_TOP)+sheet(SHEET_TOP,header(h2('All places'+cnt(202))),rows(ROWS[:5])))
    def mini(inner): return f'<div style="position:relative;height:130px;background:{GROUND};border:1px solid {HAIR};overflow:hidden"><span style="position:absolute;left:24px;top:100px;font-size:13px;font-style:italic;color:#8D877C">Reykjavík</span>{inner}</div>'
    A=f'<div style="position:absolute;left:14px;top:18px;display:flex;flex-direction:column;align-items:center;gap:4px;{NEWOUT}"><svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="16" fill="{ODEEP}" stroke="{PAPER}" stroke-width="2"/><text x="17" y="17" text-anchor="middle" dominant-baseline="central" font-family="Archivo" font-weight="700" font-size="13" fill="{PAPER}">23</text></svg><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:11px;letter-spacing:.1em;color:{NAVY};background:{RAISED};padding:1px 5px;border-radius:2px">Reykjavík</span>{NEWTAB}</div>'
    Bv=f'<div style="position:absolute;left:6px;top:8px;width:96px;height:84px;{NEWOUT}"><span style="position:absolute;left:44px;top:0;width:8px;height:8px;border-radius:50%;background:{NAVY}"></span><span style="position:absolute;left:47.25px;top:7px;width:1.5px;height:16px;background:{INK2}"></span><div style="position:absolute;left:2px;top:20px;width:92px;filter:drop-shadow(0 0 .5px rgba(107,74,40,.5)) drop-shadow(0 2px 3px rgba(26,26,24,.12))"><div style="background:{RAISED};clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 12px,100% 100%,0 100%,0 12px);-webkit-mask:radial-gradient(circle 3px at 50% 8px,transparent 2.5px,#000 3px);mask:radial-gradient(circle 3px at 50% 8px,transparent 2.5px,#000 3px);padding:16px 6px 8px;text-align:center"><span style="display:block;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:15px;letter-spacing:.06em;color:{NAVY}">Reykjavík{cnt(23)}</span></div></div>{NEWTAB}</div>'
    Cv=f'<div style="position:absolute;left:6px;top:26px;transform:rotate(-4deg);{NEWOUT}"><div style="border:2px solid rgba(18,41,63,.82);border-radius:999px;padding:4px 10px;color:rgba(18,41,63,.82);text-align:center"><span style="display:block;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:14px;letter-spacing:.08em">Reykjavík{cnt(23)}</span><span style="display:block;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:9px;line-height:11px;letter-spacing:.1em">8 visited</span></div>{NEWTAB}</div>'
    cell=lambda t,n,i: f'<div style="flex:1;min-width:0">{note(t,n)}{mini(i)}</div>'
    below=(f'<div style="position:absolute;left:0;right:0;top:860px;padding:0 12px">{note("The badge says “your places are here”","The grey italic word is the basemap’s own label; each badge adds what the map can’t.",INK)}'
           f'<div style="display:flex;gap:8px">{cell("A · The cluster disc","The app’s own cluster disc carries the count; the name is its caption.",A)}{cell("B · A little tag","The tag your places hang on, in small.",Bv)}{cell("C · Your stamp","Stamped like VISITED, with your progress.",Cv)}</div>'
           f'<div style="margin-top:12px;font-size:12px;line-height:16px;background:{RAISED};border:1px solid {HAIR};padding:8px 10px"><b style="font-stretch:75%;text-transform:uppercase;font-size:11px;letter-spacing:.1em;color:{NAVY}">After tap</b> · the map flies in and frames that city’s places (the same move as Go to). At city zoom the badge gives way to the pins. Nothing is hidden.</div></div>')
    return (page('Go to 3: city labels on the zoomed-out map',scr), page('Map city badge: first three',below.replace('top:860px','top:16px'),390,520))
B['GoToMap.dc.html']=('Go to 3',lambda: d3()[0])
B['GoToMapBadges.dc.html']=('Map badge variants',lambda: d3()[1])
def sections():
    sub=rows([ROWS[0]])
    blk=lambda t,n,h,col=NB: f'<div style="margin-bottom:16px">{note(t,n,col)}<div style="background:{PAPER}">{h}{sub}</div></div>'
    B_=f'<div style="height:36px;display:flex;align-items:flex-end;gap:8px;padding:0 16px 6px 56px;border-bottom:1px solid {NAVY}"><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:14px;letter-spacing:.12em;color:{NAVY}">Reykjavík</span><span style="font-size:12px;color:{INK2}">23</span><span style="flex:1"></span><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:11px;letter-spacing:.1em;color:{INK2}">Hide</span></div>'
    C_=f'<div style="height:44px;display:flex;align-items:center;gap:12px;padding:0 16px;background:{FILED};border-bottom:1px solid {HAIR}"><span style="width:28px"></span><span style="flex:1;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;letter-spacing:.1em;color:{NAVY}">Reykjavík (23)</span><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:11px;letter-spacing:.1em;color:{INK2}">Hide</span>{LOCSM()}</div>'
    inner=(f'<div style="padding:16px 0 0">'
           f'<div style="padding:0 16px">{note("The count, one rule for the whole app","Everywhere the app counts places: the list header, section headers, Go to, the map’s city badges, Plans. Cluster discs keep the number inside the disc: the number is the mark.",INK)}</div>'
           + blk('A, adopted · the count: a quiet tally (decided)','No icon: tap the name to go there; its left edge sits on the row icons’ edge. A smaller grey figure after the name, used for every count on this canvas.',secA('Reykjavík',23,1,False))
           +'</div>')
    hist=(f'<div style="padding:16px 0 0">'
           + blk('Not taken · count as (23)','The list header’s old way, in the name’s own type.',secA('Reykjavík',23,0,False),INK2)
           + f'<div style="padding:8px 16px 4px">{note("History (not taken)","",INK2)}</div>'
           + blk('B · A printed rule, no band','',B_,INK2)+blk('C · The list header’s voice, one step down','',C_,INK2)+'</div>')
    wrap=lambda x: phone(f'<div style="position:absolute;inset:0;background:#E9E2D3">{x}</div>')
    return (page('City section header',wrap(inner)), page('Section header: not taken',wrap(hist)))
B['SectionHeaders.dc.html']=('City section header',lambda: sections()[0])
B['SectionHeadersHistory.dc.html']=('Section header history',lambda: sections()[1])
# ---- Plans: picking a plan vs Go to
STOPS=[('1','nature','Þingvellir','nature · Reykjavík'),('2','nature','Geysir','nature · Reykjavík'),('3','nature','Gullfoss','nature · Reykjavík')]
def stoprows():
    return ''.join(row(c,t,m,lead=f'<div style="width:28px;text-align:center;font-stretch:85%;font-weight:700;font-size:15px;color:{INK2}">{n}</div>') for n,c,t,m in STOPS)
def plantitle():
    return f'<button style="flex:1;min-width:0;display:flex;align-items:center;gap:6px;text-align:left">{h2("Golden Circle day").replace("flex:1;","")}{CHEV(NAVY)}</button>'
def gochip():
    return f'<button style="position:relative;{NEWOUT}display:flex;align-items:center;gap:4px;height:32px;padding:0 8px;border:1px solid {HAIR};border-radius:3px;background:{RAISED}">{LOCSM(14)}<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:11px;letter-spacing:.1em;color:{NAVY}">Go to</span>{CHEV(NAVY)}{NEWTAB}</button>'
def plans(mode):
    head=f'<div style="display:flex;align-items:center;gap:10px;min-height:52px;box-sizing:border-box;padding:9px 16px;background:{PAPER};color:{NAVY};border-bottom:1px solid {HAIR}"><button style="width:28px;height:28px;flex:none;font-size:14px;color:{NAVY}">&#9660;</button>{plantitle()}{gochip()}</div>'
    if mode=='plan':   # the shipped #planLedger slip, as it is (check left, counts in the plan-count voice); here it drops from the title
        more=f'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="3.5" cy="8" r="1.4" fill="{INK2}"/><circle cx="8" cy="8" r="1.4" fill="{INK2}"/><circle cx="12.5" cy="8" r="1.4" fill="{INK2}"/></svg>'
        opt=lambda n,c,on: f'<div style="display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:center;height:45px;border-bottom:1px solid {HAIR}"><button style="display:grid;grid-template-columns:16px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:44px;padding:0 0 0 12px;text-align:left;color:{NAVY}">{CHECK16 if on else "<span></span>"}<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;line-height:16px;letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{n}</span><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:11px;line-height:12px;letter-spacing:.08em;color:{INK2}">{c}</span></button><button aria-label="Rename or delete {n}" style="height:44px;display:flex;align-items:center;justify-content:center">{more}</button></div>'
        newp=f'<div style="height:44px;display:flex;align-items:center;gap:8px;padding:0 12px;color:{INK2}"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="{INK2}" stroke-width="1.5"/></svg><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;letter-spacing:.05em">New plan</span></div>'
        m=f'<div style="position:absolute;z-index:25;left:16px;right:16px;top:{SHEET_TOP+52}px;background:{RAISED};border:1px solid {HAIR};border-radius:3px;box-shadow:0 2px 0 {HAIR}">{opt("Golden Circle day","3 stops",True)}{opt("Copenhagen weekend","6 stops",False)}{opt("Malmö day trip","4 stops",False)}{newp}</div>'+newbox(56,SHEET_TOP+16,190,24)
    else:
        m=menu('Go to',[{'icon':LOCSM(16),'label':'Whole plan'+cnt(3),'on':True},{'cap':'This plan, in stop order'},{'icon':LOCSM(16),'label':'Reykjavík'+cnt(3)},{'cap':'Other cities'},{'icon':LOCSM(16),'label':'Copenhagen'+cnt(31)},{'icon':LOCSM(16),'label':'Malmö'+cnt(12),'dim':True},{'icon':LOCSM(16),'label':'Stockholm'+cnt(20)}],f'left:16px;top:{SHEET_TOP+52}px;width:358px;box-sizing:border-box;')
    pp=[(120,210,'nature',False),(170,170,'nature',False),(250,200,'nature',False),(60,320,'cafe',False)]
    return browse(head,stoprows(),m,pins=pp)
def plans_pair():
    cap=lambda t,n: f'<div style="height:72px;padding:12px 4px 0;box-sizing:border-box">{note(t,n,NAVY)}</div>'
    col=lambda c,b: f'<div style="width:390px;flex:none">{c}{b}</div>'
    inner=(f'<div style="display:flex;gap:40px">{col(cap("1 · Pick a plan (the title)","Changes what the list shows: that plan’s stops, numbered. The map follows to frame them."),plans("plan"))}'
           f'{col(cap("2 · Go to (beside it)","Moves the map only. The list, the plan and every stop stay as they are."),plans("goto"))}</div>')
    sup=f'<div style="position:absolute;inset:0;z-index:100;background:rgba(233,226,211,.72);display:flex;align-items:flex-start;justify-content:center;padding-top:300px"><div style="background:{RAISED};border:2px solid {INK2};padding:10px 18px;text-align:center"><span style="display:block;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:22px;letter-spacing:.12em;color:{INK2}">Superseded</span><span style="display:block;font-size:13px;color:{INK2}">By row 5: the title is the one picker; sections are “go to”.</span></div></div>'
    return page('Plans: picking a plan vs Go to (superseded)',inner+sup,820,920)
B['PlansGoTo.dc.html']=('Plans',plans_pair)
# ---- search scope (systems' Turn 6): the docked, typing tag over the washed map, the keyboard up
def kb():
    keys=lambda s: ''.join(f'<span style="flex:1;height:42px;border-radius:5px;background:#fff;box-shadow:0 1px 0 #898A8D;display:flex;align-items:center;justify-content:center;font-size:22px;color:#000">{k}</span>' for k in s)
    return (f'<div aria-hidden="true" style="position:absolute;z-index:40;left:0;right:0;bottom:0;height:300px;background:#D2D5DB;padding:8px 3px 0;box-sizing:border-box;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">'
            f'<div style="display:flex;gap:6px;margin-bottom:11px">{keys("qwertyuiop")}</div><div style="display:flex;gap:6px;margin:0 18px 11px">{keys("asdfghjkl")}</div><div style="display:flex;gap:6px;margin:0 46px 11px">{keys("zxcvbnm")}</div>'
            f'<div style="display:flex;gap:6px"><span style="width:88px;height:42px;border-radius:5px;background:#ABB0BA"></span><span style="flex:1;height:42px;border-radius:5px;background:#fff;box-shadow:0 1px 0 #898A8D;display:flex;align-items:center;justify-content:center;font-size:15px">space</span><span style="width:88px;height:42px;border-radius:5px;background:#0A84FF;color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px">search</span></div></div>')
def typing_tag(text,results,chip='',note_line=''):
    caret=f'<span style="display:inline-block;width:2px;height:24px;background:{NAVY};vertical-align:-4px;margin-left:1px"></span>'
    res=''.join(f'<div style="height:48px;box-sizing:border-box;border-bottom:1px solid {HAIR};display:flex;flex-direction:column;justify-content:center"><b style="font-size:14px;line-height:18px;font-weight:600;color:{INK}">{n}</b><span style="display:flex;gap:4px;font-size:11px;line-height:15px;color:{INK2}">{t}{(" · "+newwrap(pl).replace("display:flex","display:inline")) if pl else ""}</span></div>' for n,t,pl in results)
    namefield=f'<div style="display:flex;align-items:flex-end;gap:8px;padding-bottom:4px;border-bottom:1px solid {HAIR}"><h2 style="margin:0;flex:1;font-size:26px;line-height:28px;font-weight:700;font-stretch:62%;{PEN}">{text}{caret}</h2>{chip}<button aria-label="Cancel" style="padding:0 0 4px">{XG}</button></div>'
    body=f'<div style="position:relative;z-index:2;padding:48px 16px 0">{namefield}{note_line}{res}</div>'
    return (f'<div style="position:absolute;z-index:8;left:37px;top:74px;width:316px;height:470px">'
            f'<div aria-hidden="true" style="position:absolute;inset:0;filter:drop-shadow(0 0 .5px rgba(107,74,40,.5)) drop-shadow(0 1px 1px rgba(26,26,24,.1)) drop-shadow(0 4px 6px rgba(26,26,24,.08))"><div style="position:absolute;inset:0;background:{RAISED};{DIE}"></div></div>'
            f'<div style="position:relative;z-index:1;height:100%;background:{RAISED};{DIE}">{patch()}{body}</div></div>')
WASH=f'<div aria-hidden="true" style="position:absolute;inset:0;z-index:5;background:rgba(242,235,221,.78)"></div>'
def searchscr(t): return phone(mapbg()+mappins()+ZOOM+ACCOUNT+WASH+t+kb())
def search_world():
    r=[('Tivoli Gardens','amusement park','København, Denmark'),('Tivoli Hotel','hotel','København, Denmark'),('Tivoli','shopping','Reykjavík, Iceland'),('Tivoli','theatre','Ljubljana, Slovenia')]
    t=typing_tag('Tivoli',r)
    return page('Search 1: worldwide, each result says where',searchscr(t))
B['SearchWorld.dc.html']=('Search 1',search_world)
def nearchip(label,open_=False):
    return f'<button style="position:relative;{NEWOUT}flex:none;display:flex;align-items:center;gap:4px;height:28px;margin-bottom:2px;padding:0 6px;border:1px solid {HAIR};border-radius:3px;background:{PAPER}">{LOCSM(12,INK2)}<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:10px;letter-spacing:.1em;color:{NAVY};white-space:nowrap">{label}</span>{CHEV(INK2)}{NEWTAB}</button>'
def search_near():
    r=[('Tivoli','shopping','',),('Tivolí','café',''),('Tivoli bakery','bakery','')]
    before=searchscr(typing_tag('Tivoli',[(n,t+' · Reykjavík','') for n,t,_ in r],chip=nearchip('Near Reykjavík')))
    after=addscreen(tag('Tivoli Gardens','Vesterbrogade 3 · København',tagrows('Copenhagen'),stub(),'attraction'))
    cap=lambda t,n: f'<div style="height:72px;padding:12px 4px 0;box-sizing:border-box">{note(t,n,NAVY)}</div>'
    inner=(f'<div style="display:flex;gap:40px"><div style="width:390px">{cap("Before the pick","A “near” chip in the NAME field scopes the search: the map’s city by default, tap for one of your cities, Near me or Anywhere.")}{before}</div>'
           f'<div style="width:390px">{cap("After the pick","The chip is gone. The place is filed by the CITY row, which is guessed from the pick.")}{after}</div></div>')
    rej=f'<div style="position:absolute;inset:0;z-index:100;background:rgba(233,226,211,.72);display:flex;align-items:flex-start;justify-content:center;padding-top:300px"><div style="background:{RAISED};border:2px solid {INK2};padding:10px 18px;text-align:center"><span style="display:block;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:22px;letter-spacing:.12em;color:{INK2}">Rejected</span><span style="display:block;font-size:13px;color:{INK2}">Owner: “no this is far too complex.”</span></div></div>'
    return page('Search 2: a near chip in the search field (rejected)',inner+rej,820,920)
B['SearchNear.dc.html']=('Search 2',search_near)
def search_map():
    r=[('Tivoli','shopping · Reykjavík',''),('Tivolí','café · Reykjavík',''),('Tivoli Gardens','amusement park · København','')]
    t=typing_tag('Tivoli',[(n,tt,'') for n,tt,_ in r],note_line=f'<div style="padding:8px 0 4px;font-size:11px;line-height:15px;color:{INK2}">Searching around the map’s view first; no hard country filter.</div>')
    return page('Search 3: the map view, softened (baseline)',searchscr(t))
B['SearchMap.dc.html']=('Search 3',search_map)

# ---- the city as metadata at the top of the tag (owner: "having it here feeling more like metadata is really clear")
def meta_board():
    nm=lambda n: f'<h2 style="margin:0;font-size:26px;line-height:28px;font-weight:700;font-stretch:62%;{PEN}">{n}</h2>'
    addr=lambda a: f'<div style="min-height:28px;display:flex;align-items:flex-end;padding-bottom:4px;border-bottom:1px solid {HAIR};font-size:13px;line-height:18px"><span style="{PEN}">{a}</span></div>'
    def crop(top,title,n,inner,head=''):
        return (f'<div style="position:absolute;left:37px;top:{top}px;width:316px">{note(title,n,NAVY)}<div style="filter:drop-shadow(0 0 .5px rgba(107,74,40,.5)) drop-shadow(0 1px 1px rgba(26,26,24,.1)) drop-shadow(0 4px 6px rgba(26,26,24,.08))">'
                f'<div style="position:relative;background:{RAISED};{CLIP};-webkit-mask:radial-gradient(circle 5px at 50% 18px,transparent 4.5px,#000 5px);mask:radial-gradient(circle 5px at 50% 18px,transparent 4.5px,#000 5px);padding:48px 16px 14px">{patch()}{head}<div style="position:relative;z-index:2">{inner}</div></div></div></div>')
    cv='font-stretch:75%;text-transform:uppercase;font-weight:700;letter-spacing:.08em;color:'+NAVY
    # 1: destination print -- the city printed big in the head, right of the eyelet, like a baggage tag's destination
    e1=f'<button style="position:absolute;z-index:3;right:30px;top:9px;display:flex;align-items:center;gap:4px;{NEWOUT}"><span style="{cv};font-size:15px;line-height:18px">Reykjavík</span>{CHEV(NAVY)}{NEWTAB.replace("right:-4px;top:-11px","right:0;top:26px")}</button>'
    # 2: a routing box -- the tag's printed hairline box (like a field on a label) in the head, right of the eyelet
    e2=f'<button style="position:absolute;z-index:3;right:30px;top:6px;height:26px;display:flex;align-items:center;gap:5px;padding:0 6px 0 8px;border:1px solid {HAIR};border-radius:2px;background:{PAPER};{NEWOUT}"><span style="{cv};font-size:12px;line-height:14px">Reykjavík</span>{CHEV()}{NEWTAB.replace("right:-4px;top:-11px","right:0;top:30px")}</button>'
    # 3: an eyebrow over the name -- the city printed as the name's first line, the way a ticket prints its destination over the passenger
    e3=lambda city,extra='': f'<button style="position:relative;display:inline-flex;align-items:center;gap:4px;margin-bottom:2px;{NEWOUT}"><span style="{cv};font-size:12px;line-height:16px;letter-spacing:.12em">{city}</span>{CHEV(NAVY)}{extra}{NEWTAB}</button>'
    head=f'<div style="position:absolute;left:37px;top:12px;right:37px">{note("The city as the tag’s metadata","Filled in from the pick, never asked before typing. No label (“City” / “Area” still open). Tap it to change: it opens the city list. Only on the add/edit tag.",INK)}</div>'
    newmk=f'<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:9px;letter-spacing:.1em;color:{ODEEP};margin-left:4px">· new</span>'
    inner=(head
      +crop(96,'1 · Destination print','The city printed large in the tag’s head, right of the eyelet, like a baggage tag’s destination.',nm('Blue Lagoon')+addr('Norðurljósavegur 9 · Grindavík'),e1)
      +crop(330,'2 · A routing box','A small printed box in the head: quieter, reads as a field you can tap.',nm('Blue Lagoon')+addr('Norðurljósavegur 9 · Grindavík'),e2)
      +crop(560,'3 · An eyebrow over the name','The city as the name’s first printed line; a new city says so in deep orange.',e3('Jönköping',newmk)+nm('Jönköpings slott')+addr('Slottsgatan 2 · Jönköping')))
    return page('The city as metadata',phone(mapbg()+inner))
B['CityAsMetadata.dc.html']=('City as metadata',meta_board)

# ---- plan vs city, simplified (systems Turn 7, Option 1): the title is the one picker; the sections are "go to"
def opt1():
    def ttl(t): return f'<button style="position:relative;flex:1;min-width:0;display:flex;align-items:center;gap:6px;text-align:left;{NEWOUT}">{h2(t).replace("flex:1;","")}{CHEV(NAVY)}{NEWTAB}</button>'
    stopn=lambda n: f'<div style="width:28px;text-align:center;font-stretch:85%;font-weight:700;font-size:15px;color:{INK2}">{n}</div>'
    # 1: the title menu open
    m=menu('Show',[{'label':'All places'+cnt(202),'on':True},{'cap':'Plans'},{'label':'Golden Circle day'+cnt(3)},{'label':'Copenhagen weekend'+cnt(6)},{'label':'Malmö day trip'+cnt(4)},{'label':'+ New plan'}],f'left:16px;top:{SHEET_TOP+44}px;')
    s1=browse(header(ttl('All places'+cnt(202))),secA('Reykjavík',23)+rows(ROWS[:3]),m)
    # 2: Places, in city sections: tap a heading = go to (header A)
    s2=browse(header(ttl('All places'+cnt(202))),secA('Reykjavík',23)+rows([r for r in ROWS if 'Reykjav' in r[2]][:3])+secA('Copenhagen',31)+rows(ROWS[4:6]))
    # 3: a plan open: the same headings are its legs, in stop order; numbered stops
    legs=(secA('Copenhagen',4)+''.join(row(c,t,mm,lead=stopn(n)) for n,c,t,mm in [('1','attraction','Tivoli','attraction · Copenhagen'),('2','restaurant','Torvehallerne','restaurant · Copenhagen'),('3','cafe','Atelier September','cafe · Copenhagen'),('4','attraction','Rundetaarn','attraction · Copenhagen')])
          +secA('Malmö',2)+''.join(row(c,t,mm,lead=stopn(n)) for n,c,t,mm in [('5','attraction','Malmöhus','attraction · Malmö'),('6','nature','Ribersborg beach','nature · Malmö')]))
    s3=browse(header(ttl('Copenhagen weekend'+cnt(6))),legs,pins=[(150,180,'attraction',False),(210,150,'restaurant',False),(260,230,'attraction',False)])
    cap=lambda t,n: f'<div style="height:72px;padding:12px 4px 0;box-sizing:border-box">{note(t,n,NAVY)}</div>'
    col=lambda c,b: f'<div style="width:390px;flex:none">{c}{b}</div>'
    inner=(f'<div style="display:flex;gap:40px">'
           f'{col(cap("1 · The title is the one picker","All places, or one of your plans, or New plan. It replaces the Places | Plans switch."),s1)}'
           f'{col(cap("2 · Places: tap a city heading to go there","The headings are “go to”. They move the map; they never filter."),s2)}'
           f'{col(cap("3 · A plan: the same headings are its legs","Cities in stop order, stops numbered. Tap a leg to frame it. Show/hide stays in the filter panel."),s3)}</div>')
    sup=f'<div style="position:absolute;inset:0;z-index:100;background:rgba(233,226,211,.72);display:flex;align-items:flex-start;justify-content:center;padding-top:300px"><div style="background:{RAISED};border:2px solid {INK2};padding:10px 18px;text-align:center"><span style="display:block;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:22px;letter-spacing:.12em;color:{INK2}">Superseded</span><span style="display:block;font-size:13px;color:{INK2}">By row 6: Places and Plans are two views.</span></div></div>'
    return page('Plan vs city, simplified: Option 1',inner+sup,1250,920)
B['PlanCity1.dc.html']=('Option 1',opt1)

# ---- both together: the title picks what you look at; a small Go to jumps within it (owner thread 47b66098)
def title_and_goto():
    def ttl(t): return f'<button style="position:relative;flex:1;min-width:0;display:flex;align-items:center;gap:6px;text-align:left;{NEWOUT}">{h2(t).replace("flex:1;","")}{CHEV(NAVY)}{NEWTAB}</button>'
    def head(t): return (f'<div style="display:flex;align-items:center;gap:10px;min-height:52px;box-sizing:border-box;padding:9px 16px;background:{PAPER};color:{NAVY};border-bottom:1px solid {HAIR}">'
                         f'<button aria-label="Collapse list" style="width:28px;height:28px;flex:none;font-size:14px;color:{NAVY}">&#9660;</button>{ttl(t)}{gochip()}<button aria-label="Sort list" style="{HB}">{SORT}</button><button aria-label="Filters" style="{HB}">{FILT}</button></div>')
    m1=menu('Show',[{'label':'All places'+cnt(202),'on':True},{'cap':'Plans'},{'label':'Golden Circle day'+cnt(3)},{'label':'Copenhagen weekend'+cnt(6)},{'label':'Malmö day trip'+cnt(4)},{'label':'+ New plan'}],f'left:16px;top:{SHEET_TOP+44}px;')
    m2=menu('Go to',[dict(it,icon=LOCSM(16)) for it in GOTO_ITEMS],f'left:206px;top:{SHEET_TOP+50}px;')
    s1=browse(head('All places'+cnt(202)),secA('Reykjavík',23)+rows(ROWS[:3]),m1)
    s2=browse(head('All places'+cnt(202)),secA('Reykjavík',23)+rows(ROWS[:3]),m2)
    cap=lambda t,n: f'<div style="height:72px;padding:12px 4px 0;box-sizing:border-box">{note(t,n,NAVY)}</div>'
    col=lambda c,b: f'<div style="width:390px;flex:none">{c}{b}</div>'
    inner=(f'<div style="display:flex;gap:40px">{col(cap("1 · The title picks what you look at","All places, one of your plans, or New plan."),s1)}'
           f'{col(cap("2 · Go to jumps within it","Go to 1’s menu, kept as a small chip: the cities (or a plan’s legs). It moves the map only."),s2)}</div>')
    sup=f'<div style="position:absolute;inset:0;z-index:100;background:rgba(233,226,211,.72);display:flex;align-items:flex-start;justify-content:center;padding-top:300px"><div style="background:{RAISED};border:2px solid {INK2};padding:10px 18px;text-align:center"><span style="display:block;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:22px;letter-spacing:.12em;color:{INK2}">Superseded</span><span style="display:block;font-size:13px;color:{INK2}">By row 6: Places and Plans are two views.</span></div></div>'
    return page('Title picks, Go to jumps',inner+sup,820,920)
B['TitleAndGoTo.dc.html']=('Both',title_and_goto)

# ---- where collapse lives (owner thread 082ebef3): never mistaken for the title's dropdown chevron
def collapse_board():
    def ttl(t,pad=''): return f'<button style="flex:1;min-width:0;display:flex;align-items:center;gap:6px;text-align:left;{pad}">{h2(t).replace("flex:1;","")}{CHEV(NAVY)}</button>'
    icons=f'<button aria-label="Sort list" style="{HB}">{SORT}</button><button aria-label="Filters" style="{HB}">{FILT}</button><button aria-label="Show my location" style="{HB}">{LOCATE}</button>'
    def hdr(left,right='',pl=16): return f'<div style="display:flex;align-items:center;gap:12px;min-height:52px;box-sizing:border-box;padding:9px 16px 12px {pl}px;background:{PAPER};color:{NAVY};border-bottom:1px solid {HAIR}">{left}{icons}{right}</div>'
    def block(top,title,n,sheet_extra,head):
        return (f'<div style="position:absolute;left:0;right:0;top:{top}px;height:250px">{note(title,n,NAVY).replace("padding:0 0 8px","padding:0 16px 8px")}'
                f'<div style="position:relative;height:200px;overflow:hidden;background:{GROUND}">{STREETS.replace("height=\"844\"","height=\"200\"")}'
                f'<div style="position:absolute;left:0;right:0;top:60px;bottom:0;background:{PAPER}">{sheet_extra}{head}{rows([ROWS[0]])}</div></div></div>')
    # A: a grab handle on the sheet's edge (tap or drag); the title moves onto the row icons' edge
    handle=f'<button aria-label="Collapse list" style="position:absolute;z-index:3;left:50%;top:-14px;margin-left:-30px;width:60px;height:28px;display:flex;align-items:center;justify-content:center;{NEWOUT}"><span style="width:36px;height:4px;border-radius:2px;background:{INK2}"></span>{NEWTAB}</button>'
    a=block(8,'A · A grab handle on the sheet’s edge','Tap or drag it. The title moves to the row icons’ edge, so the only chevron left in the header is the title’s.',handle,hdr(ttl('All places'+cnt(202)),pl=18))
    # B: collapse as the header's last icon, a line glyph in the header's family: a bar with the list going down under it
    cg=f'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="4" y1="20" x2="20" y2="20"/><path d="M7 8l5 5 5-5"/></svg>'
    b=block(282,'B · The last icon on the right','A line icon in the header’s own family (“lower the list to the bar”), apart from the title’s chevron.','',hdr(ttl('All places'+cnt(202)),f'<button aria-label="Collapse list" style="{HB};position:relative;{NEWOUT}">{cg}{NEWTAB}</button>',pl=18))
    # C: a printed tab on the sheet's edge, like a file or luggage tab
    tab=f'<button aria-label="Collapse list" style="position:absolute;z-index:3;left:16px;top:-22px;height:22px;padding:0 10px;display:flex;align-items:center;gap:4px;background:{PAPER};border:1px solid {HAIR};border-bottom:0;border-radius:3px 3px 0 0;{NEWOUT}"><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" fill="none" stroke="{NAVY}" stroke-width="1.8"/></svg><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:10px;letter-spacing:.12em;color:{NAVY}">Lower</span>{NEWTAB}</button>'
    c=block(556,'C · A printed tab on the sheet’s edge','A small paper tab, like a file or luggage tab, labelled in the app’s print. It reads as part of the sheet, not the title.',tab,hdr(ttl('All places'+cnt(202)),pl=18))
    return page('Where collapse lives',phone(f'<div style="position:absolute;inset:0;background:#E9E2D3">{a}{b}{c}</div>'))
B['Collapse.dc.html']=('Collapse',collapse_board)

# ---- places and plans are two kinds of thing (systems Turn 8, Option A): the shipped Places | Plans switch, moved to the top
def seg(on):   # .seg-wrap / .seg as shipped (36px track, hair edges, on = navy tile + paper text), now always visible on the sheet
    b=lambda t,o,first: f'<button role="radio" aria-checked="{str(o).lower()}" style="flex:1 1 0;height:36px;border:1px solid {NAVY if o else HAIR};{"" if first else "border-left:none;"}border-radius:{"3px 0 0 3px" if first else "0 3px 3px 0"};background:{NAVY if o else RAISED};color:{PAPER if o else NAVY};font-stretch:75%;text-transform:uppercase;font-size:12px;line-height:16px;letter-spacing:.08em;font-weight:700">{t}</button>'
    return f'<div style="position:relative;display:flex;padding:12px 16px;background:{PAPER};border-bottom:1px solid {HAIR};{NEWOUT}outline-offset:-2px"><div role="radiogroup" aria-label="List" style="display:flex;flex:1">{b("Places",on=="places",True)}{b("Plans",on=="plans",False)}</div>{NEWTAB_IN.replace("right:52px","right:20px").replace("top:4px","top:2px")}</div>'
def optA():
    icons=f'<button aria-label="Sort list" style="{HB}">{SORT}</button><button aria-label="Filters" style="{HB}">{FILT}</button><button aria-label="Show my location" style="{HB}">{LOCATE}</button>'
    def hdr(t,lead='',open_=False):
        tb=f'<button aria-haspopup="menu" aria-expanded="{str(open_).lower()}" style="position:relative;flex:1;min-width:0;display:flex;align-items:center;gap:6px;text-align:left;{NEWOUT}">{h2(t).replace("flex:1;","")}{CHEV(NAVY)}{NEWTAB}</button>'
        return f'<div style="display:flex;align-items:center;gap:12px;min-height:52px;box-sizing:border-box;padding:9px 16px 12px 16px;background:{PAPER};color:{NAVY};border-bottom:1px solid {HAIR}">{lead}{tb}{icons}</div>'
    back=f'<button aria-label="Back to plans" style="width:28px;height:28px;flex:none;display:flex;align-items:center;justify-content:center;position:relative;{NEWOUT}"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="{NAVY}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
    route=f'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.6" fill="none" stroke="{NAVY}" stroke-width="2"/><circle cx="18" cy="18" r="2.6" fill="none" stroke="{NAVY}" stroke-width="2"/><path d="M8.5 6h5a3 3 0 0 1 0 6h-3a3 3 0 0 0 0 6h5" fill="none" stroke="{NAVY}" stroke-width="2" stroke-linecap="round"/></svg>'
    lead_route=f'<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center">{route}</div>'
    def planrow(n,c,m): return row('other',n,m,lead=lead_route).replace('aria-label="Delete" style="width:28px;height:28px;font-size:14px;line-height:1;color:#5A564C">&#215;','aria-label="Open" style="width:28px;height:28px;font-size:16px;line-height:1;color:#5A564C">&#8250;')
    newplan=f'<div style="display:grid;grid-template-columns:28px 1fr;column-gap:12px;align-items:center;min-height:56px;padding:8px 16px;box-sizing:border-box;border-bottom:1px solid {HAIR}"><div style="text-align:center;color:{NAVY};font-size:20px">+</div><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;letter-spacing:.05em;color:{NAVY}">New plan</span></div>'
    plist=newwrap(planrow('Golden Circle day',3,'3 stops · Reykjavík')+planrow('Copenhagen weekend',6,'6 stops · Copenhagen → Malmö')+planrow('Malmö day trip',4,'4 stops · Malmö')+newplan,inner=True)
    stopn=lambda n: f'<div style="width:28px;text-align:center;font-stretch:85%;font-weight:700;font-size:15px;color:{INK2}">{n}</div>'
    legs=(secA('Copenhagen',4)+''.join(row(c,t,mm,lead=stopn(n)) for n,c,t,mm in [('1','attraction','Tivoli','attraction · Copenhagen'),('2','restaurant','Torvehallerne','restaurant · Copenhagen'),('3','cafe','Atelier September','cafe · Copenhagen')])
          +secA('Malmö',2)+''.join(row(c,t,mm,lead=stopn(n)) for n,c,t,mm in [('5','attraction','Malmöhus','attraction · Malmö')]))
    TOP=330
    def scr(on,head,body,pins=MAPPINS,extra=''): return phone(mapbg()+mappins(pins)+ZOOM+ACCOUNT+credit(844-TOP)+addbadge(TOP)+sheet(TOP,head,body)+extra)
    kinds=lambda on: menu('Show',[{'label':'Places'+cnt(202),'on':on=='places'},{'label':'Plans'+cnt(3),'on':on=='plans'}],f'left:16px;top:{TOP+50}px;')
    s0=scr('places',hdr('All places'+cnt(202),open_=True),secA('Reykjavík',23)+rows([r for r in ROWS if 'Reykjav' in r[2]][:3])+secA('Copenhagen',31)+rows(ROWS[4:5]),extra=kinds('places'))
    s1=scr('places',hdr('All places'+cnt(202)),secA('Reykjavík',23)+rows([r for r in ROWS if 'Reykjav' in r[2]][:3])+secA('Copenhagen',31)+rows(ROWS[4:5]))
    s2=scr('plans',hdr('Plans'+cnt(3)),plist,pins=[(150,180,'attraction',False),(210,150,'restaurant',False),(90,240,'nature',False)])
    s3=scr('plans',hdr('Copenhagen weekend'+cnt(6),back),legs,pins=[(150,180,'attraction',False),(210,150,'restaurant',False),(260,230,'cafe',False)])
    cap=lambda t,n: f'<div style="height:72px;padding:12px 4px 0;box-sizing:border-box">{note(t,n,NAVY)}</div>'
    col=lambda c,b: f'<div style="width:390px;flex:none">{c}{b}</div>'
    inner=(f'<div style="display:flex;gap:40px">'
           f'{col(cap("1 · Places","The title says what you’re looking at. Places runs in city sections; tap a heading to go there. No switch on the sheet."),s1)}'
           f'{col(cap("2 · Tap the title","A menu with exactly two entries: Places or Plans. Kinds, never items, so places and plans never share a list."),s0)}'
           f'{col(cap("3 · Plans: the list of plans","Each plan: name, stop count, its cities. Tap one to open it. New plan is the last row."),s2)}'
           f'{col(cap("4 · One plan","The title becomes its name; back returns to the plans list. Its legs are the headings; stops numbered. Collapse is the tab."),s3)}</div>')
    return page('Places and Plans: the title picks',inner,1680,920)
B['PlacesPlansA.dc.html']=('A',optA)
# ======================================================================= round 2026-10-16b: owner threads
NEWSTAMP=f'<span aria-hidden="true" style="position:relative;display:inline-block;width:48px;height:24px;color:rgba(168,64,12,.88);transform:rotate(-4deg)"><svg width="48" height="24" viewBox="0 0 72 32" preserveAspectRatio="none" style="position:absolute;inset:0"><path d="{TRACK}" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" pathLength="166.29" stroke-dasharray="0 1.9797"/></svg><span style="position:absolute;inset:3px;border:1.5px solid currentColor;border-radius:50%;display:flex;align-items:center;justify-content:center;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:9px;line-height:1;letter-spacing:.08em">New</span></span>'
def citybtn(city,size=12,open_=False,stamp=''):
    chev=CHEV(PAPER if open_ else NAVY).replace('style="flex:none"','style="flex:none;transform:rotate(180deg)"') if open_ else CHEV(NAVY)
    look=f'background:{NAVY};border-radius:3px;padding:0 6px 0 8px;margin-left:-8px;' if open_ else ''
    return f'<button aria-expanded="{str(open_).lower()}" style="position:relative;display:inline-flex;align-items:center;gap:4px;height:28px;{look}"><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:{size}px;line-height:14px;letter-spacing:.12em;color:{PAPER if open_ else NAVY};white-space:nowrap">{city}</span>{f'<span style="display:inline-flex;margin:0 -1px 0 3px">{stamp}</span>' if stamp else ''}{chev}</button>'
# R1: on the eyelet's axis -- centred under the hole, the way a hanging tag prints its destination; the stamp hangs right after the chevron
def r1_head(city,new=False):
    st=f'<span style="position:absolute;left:100%;top:50%;margin:-12px 0 0 6px">{NEWSTAMP}</span>' if new else ''
    return (f'<div style="position:absolute;z-index:2;left:0;right:0;top:34px;display:flex;justify-content:center">'
            f'<div style="position:relative;{NEWOUT}">{citybtn(city)}{st}{NEWTAB}</div></div>')
# R2: the routing line -- the tag's first ruled line, on the content edge, like the TO line on a printed label; the stamp right after the chevron
DIST=lambda t: f'<span style="display:flex;align-items:center;height:28px;font-size:12px;line-height:14px;color:{INK2};white-space:nowrap">{t}</span>'
def r2_pre(city,new=False,open_=False,dist='',printed=False):
    c=(f'<span style="display:inline-flex;align-items:center;height:28px;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:14px;letter-spacing:.12em;color:{NAVY};white-space:nowrap">{city}</span>' if printed else citybtn(city,open_=open_,stamp=NEWSTAMP if new else ''))
    return (f'<div style="position:relative;display:flex;align-items:center;gap:8px;min-height:28px;padding-bottom:2px;margin-bottom:4px;{NEWOUT}">'
            f'{c}{NEWSTAMP if (new and printed) else ""}{DIST(dist) if dist else ""}{NEWTAB}</div>')
def rtag(name,addr,cat,city='Reykjavík',new=False,open_city=False,open_type=False,star=False,visited=False,band=False,dist='',save=False):
    st=stub(star,visited)
    if save: st=st.replace('<span>Add</span>','<span>Save</span>')
    return tag(name,addr,notes_row()+type_row(cat,open_type),st,cat,band=band,pre=r2_pre(city,new,open_city,dist))
def metadie(v,city,new,name,addr):
    pad=68 if v==1 else 48
    head=r1_head(city,new) if v==1 else ''
    pre='' if v==1 else r2_pre(city,new)
    return (f'<div style="filter:drop-shadow(0 0 .5px rgba(107,74,40,.5)) drop-shadow(0 1px 1px rgba(26,26,24,.1)) drop-shadow(0 4px 6px rgba(26,26,24,.08))">'
            f'<div style="position:relative;background:{RAISED};{CLIP};-webkit-mask:radial-gradient(circle 5px at 50% 18px,transparent 4.5px,#000 5px);mask:radial-gradient(circle 5px at 50% 18px,transparent 4.5px,#000 5px);padding:{pad}px 16px 14px">{patch()}{head}'
            f'<div style="position:relative;z-index:2">{pre}<h2 style="margin:0;padding-bottom:4px;border-bottom:1px solid {HAIR};font-size:26px;line-height:28px;font-weight:700;font-stretch:62%;{PEN}">{name}</h2>'
            f'<div style="min-height:28px;display:flex;align-items:flex-end;padding-bottom:4px;border-bottom:1px solid {HAIR};font-size:13px;line-height:18px"><span style="{PEN}">{addr}</span></div></div></div></div>')
def meta_refined():
    def col(x,v,title,n):
        t=tag('Blue Lagoon','Norðurljósavegur 9 · Grindavík',notes_row()+type_row('nature'),stub(),'nature',
              head=r1_head('Reykjavík') if v==1 else '',pad=68 if v==1 else 48,pre='' if v==1 else r2_pre('Reykjavík'))
        return (f'<div style="position:absolute;left:{x}px;top:0">{phone(mapbg()+mappins()+ZOOM+ACCOUNT+credit(56)+sheet(BAND_TOP,header(h2("All places"+cnt(202)),collapsed=True))+t)}</div>'
                f'<div style="position:absolute;left:{x}px;top:864px;width:390px">{note(title,n,NAVY)}'
                f'<div style="padding:0 37px">{note("A new city","",INK2)}{metadie(v,"Jönköping",True,"Jönköpings slott","Slottsgatan 2 · Jönköping")}</div></div>')
    return page('City as metadata: two refinements',
        col(0,1,'On the eyelet’s axis','The city sits centred under the hole, where a hanging tag prints its destination. The CITY row is gone; tap the city to change it. The NEW stamp hangs right after it.')
        +col(430,2,'The routing line','The tag’s first line, on the same left edge as the name and address, like the TO line on a printed label. NEW sits inside the dropdown, before its chevron.'),820,1140)
B['CityMetaRefined.dc.html']=('City as metadata: R1, R2',meta_refined)

# ---- section header: separating it from the rows (header A kept: name, tally, eye)
def secV(city,n,v,first=False):
    lab=f'<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:14px;letter-spacing:.12em;color:{NAVY};white-space:nowrap">{city}{cnt(n,11)}</span>'
    if v==1:   # air above: taller, the name set down on its rule like a printed heading
        h=(f'<div style="display:grid;grid-template-columns:1fr 28px;column-gap:12px;align-items:end;height:60px;box-sizing:border-box;padding:0 16px 6px 18px;background:{PAPER};border-bottom:2px solid {HAIR}">'
                f'<button aria-label="Go to {city}" style="height:32px;display:flex;align-items:flex-end;padding-bottom:4px;text-align:left">{lab}</button>'
                f'<button aria-label="Hide {city}" style="width:28px;height:32px;display:flex;align-items:center;justify-content:center">{EYE}</button></div>')
        if first:
            h=h.replace('align-items:end;height:60px;box-sizing:border-box;padding:0 16px 6px 18px','align-items:center;height:44px;box-sizing:border-box;padding:0 16px 0 18px').replace('height:32px;display:flex;align-items:flex-end;padding-bottom:4px','height:44px;display:flex;align-items:center').replace('width:28px;height:32px','width:28px;height:44px')
        return h
    # v2: a navy ledger rule over a faint raised band
    return (f'<div style="display:grid;grid-template-columns:1fr 28px;column-gap:12px;align-items:center;height:44px;box-sizing:border-box;padding:0 16px 0 18px;background:{RAISED};border-bottom:1px solid {HAIR}">'
            f'<button aria-label="Go to {city}" style="height:42px;display:flex;align-items:center;text-align:left">{lab}</button>'
            f'<button aria-label="Hide {city}" style="width:28px;height:42px;display:flex;align-items:center;justify-content:center">{EYE}</button></div>')
def sep_board():
    rk=[r for r in ROWS if 'Reykjav' in r[2]][:3]
    def col(x,v,title,n):
        body=secV('Reykjavík',23,v,first=True)+rows(rk)+secV('Copenhagen',31,v)+rows(ROWS[4:6])
        return (f'<div style="position:absolute;left:{x}px;top:0">{browse(header(h2("All places"+cnt(202))),body)}</div>'
                f'<div style="position:absolute;left:{x}px;top:864px;width:390px">{note(title,n,NAVY)}</div>')
    return page('Section header: more separation',
        col(0,1,'Air above, picked','The header grows from 44 to 60: the space sits above the name, and the name rests on its light rule like a printed heading. No band (you: “the light bg draws too much attention”).')
        +col(430,2,'The faint band (not picked)','The header on a slightly lighter paper than the rows, with the rows’ own hairline.'),820,980)
B['SectionSeparate.dc.html']=('Section header: separation S1, S2',sep_board)

# ---- a hidden city in the sections list
EYE_OFF=f'<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none" stroke="{INK2}" stroke-width="2"/><circle cx="12" cy="12" r="2.8" fill="{INK2}"/><path d="M4 4l16 16" stroke="{PAPER}" stroke-width="4.5"/><path d="M4 4l16 16" stroke="{INK2}" stroke-width="2" stroke-linecap="round"/></svg>'
def sec_hidden(city,n):
    return newwrap(f'<div style="display:grid;grid-template-columns:1fr 28px;column-gap:12px;align-items:end;height:60px;box-sizing:border-box;padding:0 16px 6px 18px;background:{PAPER};border-bottom:2px solid {HAIR}">'
       f'<span style="padding-bottom:4px;opacity:.5;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:14px;letter-spacing:.12em;color:{NAVY};white-space:nowrap">{city}{cnt(n,11)}</span>'
       f'<button aria-label="Show {city}" style="width:28px;height:32px;display:flex;align-items:center;justify-content:center">{EYE_OFF}</button></div>',inner=True)
def hidden_board():
    rk=[r for r in ROWS if 'Reykjav' in r[2]][:2]
    base=secA('Reykjavík',23,new=False,first=True)+rows(rk)+secA('Copenhagen',31,new=False)+rows(ROWS[4:5])
    fb=f'<button aria-label="Filters and plans" style="{HB}">{FILT}</button>'
    fdot=f'<button aria-label="Filters and plans, 1 city hidden" style="{HB};position:relative;{NEWOUT}">{FILT}<span style="position:absolute;right:3px;top:3px;width:7px;height:7px;border-radius:50%;background:{OR};box-shadow:0 0 0 1.5px {PAPER}"></span>{NEWTAB}</button>'
    hd=header(h2('All places'+cnt(190)))
    assert fb in hd
    def col(x,scr,title,n):
        return (f'<div style="position:absolute;left:{x}px;top:0">{scr}</div><div style="position:absolute;left:{x}px;top:864px;width:390px">{note(title,n,NAVY)}</div>')
    return page('A hidden city in the list',
        col(0,browse(hd,base+sec_hidden('Malmö',12)),'The same header, hidden (decided)','Malmö keeps its header in its place, greyed, with its rows folded away and the eye closed. Tap the eye to show it. Nothing new: the header you picked, in its off state.')
        ,390,980)
def hidden_board_h2():
    rk=[r for r in ROWS if 'Reykjav' in r[2]][:2]
    base=secA('Reykjavík',23,new=False,first=True)+rows(rk)+secA('Copenhagen',31,new=False)+rows(ROWS[4:5])
    fb=f'<button aria-label="Filters and plans" style="{HB}">{FILT}</button>'
    fdot=f'<button aria-label="Filters and plans, 1 city hidden" style="{HB};position:relative;{NEWOUT}">{FILT}<span style="position:absolute;right:3px;top:3px;width:7px;height:7px;border-radius:50%;background:{OR};box-shadow:0 0 0 1.5px {PAPER}"></span>{NEWTAB}</button>'
    hd=header(h2('All places'+cnt(190)))
    assert fb in hd
    def col(x,scr,title,n):
        return (f'<div style="position:absolute;left:{x}px;top:0">{scr}</div><div style="position:absolute;left:{x}px;top:864px;width:390px">{note(title,n,NAVY)}</div>')
    return page('A hidden city: H2 (not picked)',
        col(0,browse(hd.replace(fb,fdot),base),'Gone from the list','Malmö isn’t in the list at all. The filters button carries an orange dot while anything is hidden; the filters panel is the only place to show it again.'),390,980)
B['HiddenCity.dc.html']=('Hidden city: H1',hidden_board)
B['HiddenCityH2.dc.html']=('Hidden city: H2',hidden_board_h2)

# ---- the map's city badge, the tag direction (owner picked): two refinements
LAND=f'<svg aria-hidden="true" width="390" height="400" viewBox="0 0 390 400" style="position:absolute;left:0;top:0"><rect width="390" height="400" fill="#D7E4EC"/><path d="M20 60 q50 -40 110 -15 q30 25 5 55 q-50 30 -110 10z" fill="{GROUND}"/><path d="M190 150 q30 -70 80 -70 q50 10 80 80 q10 70 -50 120 q-60 15 -95 -35z" fill="{GROUND}"/><path d="M150 260 q25 -25 50 0 q10 35 -25 50z" fill="{GROUND}"/></svg>'
CITYPTS=[(78,92,'Reykjavík',23),(236,150,'Stockholm',20),(200,212,'Copenhagen',31),(176,300,'Malmö',12)]
TAGSHADOW='filter:drop-shadow(0 0 .6px rgba(18,41,63,.55)) drop-shadow(0 1px 1px rgba(26,26,24,.18)) drop-shadow(0 3px 5px rgba(26,26,24,.12))'
def dot(x,y): return f'<span aria-hidden="true" style="position:absolute;z-index:7;left:{x-4}px;top:{y-4}px;width:8px;height:8px;border-radius:50%;background:{NAVY};box-shadow:0 0 0 2px {RAISED}"></span>'
LABEL=lambda n,c: f'<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:14px;letter-spacing:.08em;color:{NAVY};white-space:nowrap">{n}{cnt(c)}</span>'
def tag_hang(x,y,n,c,dotc=None,L=6):   # T1 refined (owner: string too long, dot too heavy): a short string, a small dot
    dotc=dotc or NAVY
    eye='radial-gradient(circle 2.6px at 50% 9px,transparent 2.2px,#000 2.6px)'
    grom=f'radial-gradient(circle at 50% 9px,transparent 2.6px,{HAIR} 3px,{HAIR} 4.6px,transparent 5px)'
    d=f'<span aria-hidden="true" style="position:absolute;z-index:7;left:{x-2.5}px;top:{y-2.5}px;width:5px;height:5px;border-radius:50%;background:{dotc};box-shadow:0 0 0 1.5px {RAISED}"></span>'
    return (f'<div style="position:absolute;z-index:6;left:{x}px;top:{y+L}px;transform:translateX(-50%);{TAGSHADOW}">'
            f'<button aria-label="Go to {n}" style="display:block;background:{grom},{RAISED};clip-path:polygon(9px 0,calc(100% - 9px) 0,100% 9px,100% 100%,0 100%,0 9px);-webkit-mask:{eye};mask:{eye};padding:19px 10px 7px;text-align:center">{LABEL(n,c)}</button></div>'
            f'<span aria-hidden="true" style="position:absolute;z-index:7;left:{x-.6}px;top:{y}px;width:1.2px;height:{L+9}px;background:{INK2};border-radius:1px"></span>{d}')
def tag_side(x,y,n,c):   # T2: the luggage label on its side -- the point and eyelet toward the city, a short string loop to the dot
    eye='radial-gradient(circle 2.6px at 11px 50%,transparent 2.2px,#000 2.6px)'
    grom=f'radial-gradient(circle at 11px 50%,transparent 2.6px,{HAIR} 3px,{HAIR} 4.6px,transparent 5px)'
    return (f'<div style="position:absolute;z-index:6;left:{x+12}px;top:{y-13}px;{TAGSHADOW}">'
            f'<button aria-label="Go to {n}" style="display:flex;align-items:center;height:26px;background:{grom},{RAISED};clip-path:polygon(8px 0,100% 0,100% 100%,8px 100%,0 50%);-webkit-mask:{eye};mask:{eye};padding:0 9px 0 20px">{LABEL(n,c)}</button></div>'
            f'<svg aria-hidden="true" width="26" height="14" viewBox="0 0 26 14" style="position:absolute;z-index:7;left:{x}px;top:{y-7}px;overflow:visible"><path d="M0 7 C 8 -1, 16 -1, 23 7" fill="none" stroke="{INK2}" stroke-width="1.5" stroke-linecap="round"/></svg>{dot(x,y)}')
def tagbadge_board():
    def cell(x,fn,title,n):
        m=f'<div style="position:relative;width:390px;height:400px;overflow:hidden;background:{GROUND}">{LAND}{ZOOM}{ACCOUNT}'+''.join(fn(*p) for p in CITYPTS)+'</div>'
        return f'<div style="position:absolute;left:{x}px;top:0;width:390px">{m}<div style="padding:14px 0 0">{note(title,n,NAVY)}</div></div>'
    return page('City badge: the tag, refined',
        cell(0,lambda *a: tag_hang(*a),'T1 · Navy dot','The Hanging Tag in small, hanging the way gravity says. The string is now a short drop into the eyelet, and the dot is a 5px navy point.')
        +cell(430,lambda *a: tag_hang(*a,dotc=OR),'T1 · Orange dot','The same, with the dot in brand orange: the one accent marks where your places are.'),820,560)
B['TagBadge.dc.html']=('City badge: tag T1, T2',tagbadge_board)

# ---- collapse: the picked icon (B), two placements/treatments
def collapse_refined():
    cg=lambda sz: f'<svg width="{sz}" height="{sz}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="4" y1="20" x2="20" y2="20"/><path d="M7 8l5 5 5-5"/></svg>'
    ttl=f'<button style="flex:1;min-width:0;display:flex;align-items:center;gap:6px;text-align:left">{h2("All places"+cnt(202)).replace("flex:1;","")}{CHEV(NAVY)}</button>'
    icons=f'<button aria-label="Sort list" style="{HB}">{SORT}</button><button aria-label="Filters" style="{HB}">{FILT}</button><button aria-label="Show my location" style="{HB}">{LOCATE}</button>'
    def hdr(right=''): return f'<div style="display:flex;align-items:center;gap:12px;min-height:52px;box-sizing:border-box;padding:9px 16px 12px 18px;background:{PAPER};color:{NAVY};border-bottom:1px solid {HAIR}">{ttl}{icons}{right}</div>'
    def block(top,title,n,extra,head):
        return (f'<div style="position:absolute;left:0;right:0;top:{top}px;height:300px">{note(title,n,NAVY).replace("padding:0 0 8px","padding:0 16px 8px")}'
                f'<div style="position:relative;height:220px;overflow:hidden;background:{GROUND}">{STREETS.replace("height=\"844\"","height=\"220\"")}'
                f'<div style="position:absolute;left:0;right:0;top:80px;bottom:0;background:{PAPER}">{extra}{head}{rows([ROWS[0]])}</div></div></div>')
    # K1: last in the icon row, at the row's 18px, set off by a hairline: a sheet control, not a list tool
    k1=f'<span aria-hidden="true" style="width:1px;height:24px;background:{HAIR};flex:none"></span><button aria-label="Collapse list" style="{HB};position:relative;{NEWOUT}">{cg(18)}{NEWTAB}</button>'
    # K2 (owner, d8a8f12a): C's tab with this icon, no text, right-aligned so it clears the + on the left
    def tab(top,up=False):
        g=cg(16).replace('aria-hidden="true"','aria-hidden="true" style="transform:rotate(180deg)"') if up else cg(16)
        return (f'<button aria-label="{"Raise" if up else "Lower"} the list" style="position:absolute;z-index:5;right:16px;top:{top-23}px;width:44px;height:24px;display:flex;align-items:center;justify-content:center;color:{NAVY};background:{PAPER};border:1px solid {HAIR};border-bottom:0;border-radius:4px 4px 0 0;{NEWOUT}">{g}{NEWTAB}</button>')
    exp=phone(mapbg()+mappins()+ZOOM+ACCOUNT+credit(844-SHEET_TOP)+addbadge(SHEET_TOP)+sheet(SHEET_TOP,hdr(),rows(ROWS[:5]),tab=False)+tab(SHEET_TOP))
    col_=phone(mapbg()+mappins()+ZOOM+ACCOUNT+credit(56)+addbadge(BAND_TOP)+sheet(BAND_TOP,hdr(),tab=False)+tab(BAND_TOP,True))
    cap=lambda x,t,n: f'<div style="position:absolute;left:{x}px;top:864px;width:390px">{note(t,n,NAVY)}</div>'
    return page('Collapse: the picked icon, placed',
        f'<div style="position:absolute;left:0;top:0">{phone(chr(10).join([f"<div style=\"position:absolute;inset:0;background:#E9E2D3\">",block(8,"Last in the row, set apart","The icons’ own 18px, after a hairline, so it reads as the sheet’s control, not another list tool.","",hdr(k1)),"</div>"]))}</div>'
        +f'<div style="position:absolute;left:430px;top:0">{exp}</div><div style="position:absolute;left:860px;top:0">{col_}</div>'
        +cap(430,'A tab on the sheet’s edge, list up','C’s paper tab with this icon and no text, on the right so it clears the +. Tap to lower the list. The map’s credit line moves up to sit above the tab.')
        +cap(860,'List lowered','The same tab, the icon turned up: tap to raise the list. The + stays bottom-left on its own.'),1250,980)
B['CollapseRefined.dc.html']=('Collapse: K1, K2',collapse_refined)

# ---- the list header's type (owner: "feels too small... maybe the padding")
def lh_board():
    def hd(fs,lh,minh,pad):
        t=f'<h2 style="margin:0;flex:1;font-stretch:75%;text-transform:uppercase;font-size:{fs}px;line-height:{lh}px;letter-spacing:.08em;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">All places{cnt(202)}</h2>'
        return header(t).replace('min-height:52px;box-sizing:border-box;padding:9px 16px;',f'min-height:{minh}px;box-sizing:border-box;padding:{pad}px 16px;')
    rk=[r for r in ROWS if 'Reykjav' in r[2]][:3]
    body=secA('Reykjavík',23,new=False,first=True)+rows(rk)+secA('Copenhagen',31,new=False)+rows(ROWS[4:6])
    def col(x,h,title,n): return f'<div style="position:absolute;left:{x}px;top:0">{browse(h,body)}</div><div style="position:absolute;left:{x}px;top:864px;width:390px">{note(title,n,NAVY)}</div>'
    return page('List header: type and padding',
        col(0,hd(15,20,56,12),'Today','15px caps, 56px tall (12 above and below).')
        +col(430,hd(15,20,48,8),'Same type, tighter','15px, the band 48px tall (8 above and below): the title fills more of it.')
        +col(860,hd(18,22,52,9),'One step up, picked','18px caps, 52px tall: the title clearly outranks the 12px section headers. Now the list header on every board.'),1250,960)
B['ListHeaderType.dc.html']=('List header: type and padding',lh_board)
# ---- systems Turn 9: the distance note (outside the city only)
COMPASS=f'<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor"/></svg>'
def dstub(star=False):   # the Hanging Tag's stub as shipped: Directions | Star | Mark visited
    seg='flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding-top:4px;height:60px;box-sizing:border-box;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:11px;line-height:12px;letter-spacing:.08em'
    return (f'<div style="position:relative;z-index:2;margin-top:8px;height:60px;display:flex"><div aria-hidden="true" style="position:absolute;z-index:3;left:10px;right:10px;top:-.75px;border-top:1.5px dashed {HAIR}"></div>'
            f'<a href="#" style="{seg};color:{INK};text-decoration:none">{COMPASS}<span>Directions</span></a>'
            f'<button style="{seg};border-left:1px dashed {HAIR};color:{INK}">{STAR_OPEN}<span>Star</span></button>'
            f'<button style="{seg};border-left:1px dashed {HAIR};color:{INK}">{OCHK}<span>Mark visited</span></button></div>')
def details_tag(name,addr,cat,city,dist=''):
    typ=f'<div style="display:flex;align-items:center;gap:10px;min-height:36px;padding-top:6px"><span style="{LAB}">Type</span><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;letter-spacing:.1em;color:{NAVY};transform:rotate(-2deg)">{cat}</span></div>'
    return tag(name,addr,typ,dstub(),cat,pre=r2_pre(city,dist=dist,printed=True))
def distance_board():
    A='Norðurljósavegur 9 · Grindavík'
    # decided (owner): under the address's rule, like a form field's helper note
    ad=A+f'</span></div><div style="padding:4px 0 0"><span style="display:block;font-size:11px;line-height:14px;color:{INK2}">≈ 40 km from Reykjavík'
    def col(x,scr,title,n): return f'<div style="position:absolute;left:{x}px;top:0">{scr}</div><div style="position:absolute;left:{x}px;top:864px;width:390px">{note(title,n,NAVY)}</div>'
    return page('The distance note',
        col(0,addscreen(rtag('Blue Lagoon',ad,'nature')),'Add tag · outside the city','Under the address line, like a form field’s helper note: “≈ 40 km from Reykjavík”, straight line, rounded. Nothing to set.')
        +col(430,addscreen(rtag('Blue Lagoon',ad,'nature',save=True)),'Edit tag','The same note when you edit the place.')
        +col(860,addscreen(details_tag('Blue Lagoon',ad,'nature','Reykjavík')),'The place’s Hanging Tag','The same on the place’s own tag. List rows never carry it.')
        +col(1290,addscreen(rtag('Sundhöllin','Barónsstígur 45a · Miðborg','attraction')),'Inside the city · nothing extra','Sundhöllin is inside Reykjavík’s area: no note. Most tags look like this.'),1680,980)
B['CityDistance.dc.html']=('The distance note',distance_board)
# ---- systems Turn 10: kind, then the item within it (Option 1: one title, one menu, the kind toggle inside it)
def kinds_board():
    import re
    icons=f'<button aria-label="Sort list" style="{HB}">{SORT}</button><button aria-label="Filters" style="{HB}">{FILT}</button><button aria-label="Show my location" style="{HB}">{LOCATE}</button>'
    def title(t,open_=False):
        return f'<button aria-haspopup="menu" aria-expanded="{str(open_).lower()}" style="position:relative;flex:1;min-width:0;display:flex;align-items:center;gap:6px;text-align:left;{NEWOUT}">{h2(t).replace("flex:1;","")}{CHEV(NAVY)}{NEWTAB}</button>'
    def hdr(inner): return f'<div style="display:flex;align-items:center;gap:12px;min-height:52px;box-sizing:border-box;padding:9px 16px;background:{PAPER};color:{NAVY};border-bottom:1px solid {HAIR}">{inner}{icons}</div>'
    def toggle(on):
        b=lambda t,o,first: f'<button role="radio" aria-checked="{str(o).lower()}" style="flex:1 1 0;height:36px;border:1px solid {NAVY if o else HAIR};{"" if first else "border-left:none;"}border-radius:{"3px 0 0 3px" if first else "0 3px 3px 0"};background:{NAVY if o else RAISED};color:{PAPER if o else NAVY};font-stretch:75%;text-transform:uppercase;font-size:12px;line-height:16px;letter-spacing:.08em;font-weight:700">{t}</button>'
        return f'<div style="padding:8px 12px;border-bottom:1px solid {NAVY}"><div role="radiogroup" aria-label="Show" style="display:flex">{b("Places",on=="places",True)}{b("Plans",on=="plans",False)}</div></div>'
    def kmenu(on,items,top):
        m=menu('@@CAP@@',items,f'left:16px;top:{top}px;min-width:248px;')
        return re.sub(r'<div style="height:24px;[^>]*>@@CAP@@</div>',toggle(on),m,count=1)
    sp='<span style="width:16px;flex:none"></span>'
    places_items=[{'label':'All cities'+cnt(202),'icon':sp},{'label':'Reykjavík'+cnt(23),'icon':LOCSM(16),'on':True},{'label':'Copenhagen'+cnt(31),'icon':LOCSM(16)},{'label':'Malmö'+cnt(12),'icon':LOCSM(16),'dim':True},{'label':'Stockholm'+cnt(20),'icon':LOCSM(16)},{'label':'Los Angeles'+cnt(23),'icon':LOCSM(16)}]
    route=lambda sz=16: f'<svg width="{sz}" height="{sz}" viewBox="0 0 24 24" aria-hidden="true" style="flex:none"><circle cx="6" cy="6" r="2.6" fill="none" stroke="{NAVY}" stroke-width="2"/><circle cx="18" cy="18" r="2.6" fill="none" stroke="{NAVY}" stroke-width="2"/><path d="M8.5 6h5a3 3 0 0 1 0 6h-3a3 3 0 0 0 0 6h5" fill="none" stroke="{NAVY}" stroke-width="2" stroke-linecap="round"/></svg>'
    plus=f'<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style="flex:none"><path d="M12 5v14M5 12h14" stroke="{NAVY}" stroke-width="2" stroke-linecap="round"/></svg>'
    plans_items=[{'label':'All plans'+cnt(3),'icon':sp},{'label':'Golden Circle'+cnt(3),'icon':route(),'on':True},{'label':'Copenhagen weekend'+cnt(6),'icon':route()},{'label':'Malmö day trip'+cnt(4),'icon':route()},{'label':'New plan','icon':plus}]
    TOP=400
    def scr(head,body,pins=MAPPINS,extra=''): return phone(mapbg()+mappins(pins)+ZOOM+ACCOUNT+credit(844-TOP)+addbadge(TOP)+sheet(TOP,head,body)+extra)
    rk=[r for r in ROWS if 'Reykjav' in r[2]][:4]
    places_body=secA('Reykjavík',23,new=False,first=True)+rows(rk)+secA('Copenhagen',31,new=False)
    stopn=lambda n: f'<div style="width:28px;text-align:center;font-stretch:85%;font-weight:700;font-size:15px;color:{INK2}">{n}</div>'
    gc_body=secA('Reykjavík',3,new=False,first=True)+''.join(row(c,t,mm,lead=stopn(n)) for n,c,t,mm in STOPS)
    lead_route=f'<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center">{route(22)}</div>'
    def planrow(n,m): return row('other',n,m,lead=lead_route).replace('aria-label="Delete" style="width:28px;height:28px;font-size:14px;line-height:1;color:#5A564C">&#215;','aria-label="Open" style="width:28px;height:28px;font-size:16px;line-height:1;color:#5A564C">&#8250;')
    newplan=f'<div style="display:grid;grid-template-columns:28px 1fr;column-gap:12px;align-items:center;min-height:56px;padding:8px 16px;box-sizing:border-box;border-bottom:1px solid {HAIR}"><div style="display:flex;justify-content:center">{plus}</div><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;letter-spacing:.05em;color:{NAVY}">New plan</span></div>'
    allplans=planrow('Golden Circle','3 stops · Reykjavík')+planrow('Copenhagen weekend','6 stops · Copenhagen → Malmö')+planrow('Malmö day trip','4 stops · Malmö')+newplan
    gcpins=[(120,190,'nature',False),(200,150,'nature',False),(260,210,'nature',False)]
    # the title reads just the city or plan (owner: "Places/plans does not need to be in the list header")
    s1=scr(hdr(title('Reykjavík')),places_body)
    s4=scr(hdr(title('Golden Circle')),gc_body,pins=gcpins)
    s5=scr(hdr(title('All plans')),allplans,pins=gcpins+[(300,120,'attraction',False),(60,260,'restaurant',False)])
    # the toggle, three ways (owner: "the toggle isn't right yet play with size and placement")
    def seg_small(on):
        b=lambda t,o,first: f'<button role="radio" aria-checked="{str(o).lower()}" style="height:28px;padding:0 12px;border:1px solid {NAVY if o else HAIR};{"" if first else "border-left:none;"}border-radius:{"3px 0 0 3px" if first else "0 3px 3px 0"};background:{NAVY if o else RAISED};color:{PAPER if o else NAVY};font-stretch:75%;text-transform:uppercase;font-size:11px;line-height:14px;letter-spacing:.1em;font-weight:700">{t}</button>'
        return f'<div style="padding:8px 12px;border-bottom:1px solid {NAVY}"><div role="radiogroup" aria-label="Show" style="display:inline-flex">{b("Places",on=="places",True)}{b("Plans",on=="plans",False)}</div></div>'
    def tabs(on):
        b=lambda t,o: f'<button role="tab" aria-selected="{str(o).lower()}" style="height:40px;padding:0 2px;margin-right:18px;border-bottom:2px solid {NAVY if o else "transparent"};color:{NAVY if o else INK2};font-stretch:75%;text-transform:uppercase;font-size:12px;line-height:14px;letter-spacing:.1em;font-weight:700">{t}</button>'
        return f'<div role="tablist" style="display:flex;align-items:flex-end;padding:0 12px;border-bottom:1px solid {NAVY}">{b("Places",on=="places")}{b("Plans",on=="plans")}</div>'
    def variant(v):
        if v=='footer':
            m=menu('Places',places_items,f'left:16px;top:{TOP+44}px;min-width:248px;')
            foot=(f'<button style="display:flex;align-items:center;gap:8px;width:100%;height:40px;padding:0 12px;box-sizing:border-box;border-top:1px solid {NAVY};text-align:left;background:{PAPER}">{route()}'
                  f'<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:14px;letter-spacing:.1em;color:{NAVY}">Switch to Plans</span><span style="flex:1"></span>{CHEV(NAVY).replace("<svg","<svg style=\"transform:rotate(-90deg)\"",1)}</button>')
            cut=m.rindex(NEWTAB)
            return m[:cut]+foot+m[cut:]
        import re
        m=menu('@@CAP@@',places_items,f'left:16px;top:{TOP+44}px;min-width:248px;')
        return re.sub(r'<div style="height:24px;[^>]*>@@CAP@@</div>',seg_small('places') if v=='seg' else tabs('places'),m,count=1)
    import re as _re
    def bare(extra_style=''):   # opens straight onto the items: no caption, no switch on top
        m=menu('@@CAP@@',places_items,f'left:16px;top:{TOP+44}px;min-width:248px;{extra_style}')
        return _re.sub(r'<div style="height:24px;[^>]*>@@CAP@@</div>','',m,count=1)
    def add_before_end(m,h):
        cut=m.rindex(NEWTAB); return m[:cut]+h+m[cut:]
    # I1 · the matchbook striker (matchbooks-collage-1/2): the other kind printed on the cover's base strip
    def i1():
        grit=f'repeating-linear-gradient(90deg,rgba(242,235,221,.18) 0 1px,transparent 1px 3px)'
        foot=(f'<button style="position:relative;display:flex;align-items:center;gap:8px;width:100%;height:40px;padding:0 12px;box-sizing:border-box;background:{NAVY};text-align:left">'
              f'<span aria-hidden="true" style="position:absolute;left:0;right:0;top:0;height:6px;background:{grit}"></span>'
              f'{route().replace(NAVY,PAPER)}<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:12px;line-height:14px;letter-spacing:.1em;color:{PAPER}">Plans</span>'
              f'<span style="margin-left:.45em;font-size:.8em;font-weight:700;color:rgba(242,235,221,.7);font-stretch:75%">3</span><span style="flex:1"></span>{CHEV(PAPER).replace("<svg","<svg style=\"transform:rotate(-90deg)\"",1)}</button>')
        return add_before_end(bare(),foot)
    # I2 · the hotel label (hotel-savoy-dolomiti-label): a round label stuck on the menu's corner
    def i2():
        lab=(f'<button aria-label="Show plans" style="position:absolute;z-index:3;right:-22px;top:-26px;width:62px;height:62px;border-radius:50%;background:{NAVY};box-shadow:0 0 0 2px {PAPER},0 2px 4px rgba(26,26,24,.25);transform:rotate(-10deg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px">'
             f'<span aria-hidden="true" style="position:absolute;inset:4px;border-radius:50%;border:1px solid rgba(242,235,221,.6)"></span>'
             f'<span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:10px;line-height:11px;letter-spacing:.1em;color:{PAPER}">Plans</span>'
             f'<span style="font-stretch:75%;font-weight:700;font-size:13px;line-height:14px;color:{OR}">3</span></button>')
        return add_before_end(bare().replace('overflow:hidden;','overflow:visible;',1),lab)
    # I3 · the brochure's turned corner (vintage-camping-brochures-collage): Plans is the menu's back; turn the corner
    def i3():
        flap=(f'<button aria-label="Turn over to plans" style="position:absolute;z-index:3;right:-1px;bottom:-1px;width:58px;height:58px">'
              f'<span aria-hidden="true" style="position:absolute;inset:0;background:{PAPER};clip-path:polygon(100% 0,100% 100%,0 100%)"></span>'
              f'<span aria-hidden="true" style="position:absolute;inset:0;background:{FILED};clip-path:polygon(0 0,100% 0,0 100%);filter:drop-shadow(1px 1px 1px rgba(26,26,24,.3))"></span>'
              f'<span style="position:absolute;left:3px;top:15px;transform:rotate(-45deg);font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:9px;line-height:10px;letter-spacing:.1em;color:{NAVY}">Plans</span></button>')
        return add_before_end(bare().replace('overflow:hidden;','overflow:visible;',1),flap)
    # the quiet last row (owner: "t3 UI I1 content"): a plain menu row, "Plans 3 ›" / "Places 202 ›"
    def other_row(kind,n):
        glyph=route() if kind=='Plans' else LOCSM(16)
        return (f'<button aria-label="Show {kind.lower()}" style="display:flex;align-items:center;gap:8px;width:100%;height:40px;padding:0 12px;box-sizing:border-box;border-bottom:1px solid {HAIR};text-align:left">'
                f'{glyph}<span style="position:relative;top:1px;font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;line-height:16px;letter-spacing:.05em;color:{NAVY};white-space:nowrap">{kind}{cnt(n)}</span><span style="flex:1"></span>'
                f'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style="flex:none"><path d="M6 3.5l4.5 4.5L6 12.5" fill="none" stroke="{NAVY}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>')
    def kind_menu(items,kind,n):
        m=menu('@@CAP@@',items,f'left:16px;top:{TOP+44}px;min-width:248px;')
        m=_re.sub(r'<div style="height:24px;[^>]*>@@CAP@@</div>','',m,count=1)
        return add_before_end(m,other_row(kind,n))
    mp=scr(hdr(title('Reykjavík',True)),places_body,extra=kind_menu(places_items,'Plans',3))
    mq=scr(hdr(title('Golden Circle',True)),gc_body,pins=gcpins,extra=kind_menu(plans_items,'Places',202))
    cap=lambda t,n: f'<div style="height:76px;padding:12px 4px 0;box-sizing:border-box">{note(t,n,NAVY)}</div>'
    col=lambda c,b: f'<div style="width:390px;flex:none">{c}{b}</div>'
    inner=(f'<div style="display:flex;gap:40px">'
      +col(cap('Places · the title is the city','“Reykjavík ⌄”: the full list, scrolled to Reykjavík; nothing hidden.'),s1)
      +col(cap('Places menu','Opens straight onto your cities. The last row, a plain row like the others, reads “Plans 3 ›”.'),mp)
      +col(cap('Plans menu','Opens straight onto your plans: All plans, each plan, New plan. The last row reads “Places 202 ›” to switch back.'),mq)
      +col(cap('A plan · the title is the plan','“Golden Circle ⌄”: its stops in stop order, grouped by city.'),s4)
      +col(cap('All plans','“All plans ⌄”: the plans list. Tap one to open it.'),s5)
      +'</div>')
    return page('Places and Plans: quiet bottom row',inner,2110,930)
def kinds_opt2():
    import re
    icons=f'<button aria-label="Sort list" style="{HB}">{SORT}</button><button aria-label="Filters" style="{HB}">{FILT}</button><button aria-label="Show my location" style="{HB}">{LOCATE}</button>'
    def title(t,open_=False):
        return f'<button aria-haspopup="menu" aria-expanded="{str(open_).lower()}" style="position:relative;flex:1;min-width:0;display:flex;align-items:center;gap:6px;text-align:left;{NEWOUT}">{h2(t).replace("flex:1;","")}{CHEV(NAVY)}{NEWTAB}</button>'
    def hdr(inner): return f'<div style="display:flex;align-items:center;gap:12px;min-height:52px;box-sizing:border-box;padding:9px 16px;background:{PAPER};color:{NAVY};border-bottom:1px solid {HAIR}">{inner}{icons}</div>'
    def toggle(on):
        b=lambda t,o,first: f'<button role="radio" aria-checked="{str(o).lower()}" style="flex:1 1 0;height:36px;border:1px solid {NAVY if o else HAIR};{"" if first else "border-left:none;"}border-radius:{"3px 0 0 3px" if first else "0 3px 3px 0"};background:{NAVY if o else RAISED};color:{PAPER if o else NAVY};font-stretch:75%;text-transform:uppercase;font-size:12px;line-height:16px;letter-spacing:.08em;font-weight:700">{t}</button>'
        return f'<div style="padding:8px 12px;border-bottom:1px solid {NAVY}"><div role="radiogroup" aria-label="Show" style="display:flex">{b("Places",on=="places",True)}{b("Plans",on=="plans",False)}</div></div>'
    def kmenu(on,items,top):
        m=menu('@@CAP@@',items,f'left:16px;top:{top}px;min-width:248px;')
        return re.sub(r'<div style="height:24px;[^>]*>@@CAP@@</div>',toggle(on),m,count=1)
    sp='<span style="width:16px;flex:none"></span>'
    places_items=[{'label':'All cities'+cnt(202),'icon':sp},{'label':'Reykjavík'+cnt(23),'icon':LOCSM(16),'on':True},{'label':'Copenhagen'+cnt(31),'icon':LOCSM(16)},{'label':'Malmö'+cnt(12),'icon':LOCSM(16),'dim':True},{'label':'Stockholm'+cnt(20),'icon':LOCSM(16)},{'label':'Los Angeles'+cnt(23),'icon':LOCSM(16)}]
    route=lambda sz=16: f'<svg width="{sz}" height="{sz}" viewBox="0 0 24 24" aria-hidden="true" style="flex:none"><circle cx="6" cy="6" r="2.6" fill="none" stroke="{NAVY}" stroke-width="2"/><circle cx="18" cy="18" r="2.6" fill="none" stroke="{NAVY}" stroke-width="2"/><path d="M8.5 6h5a3 3 0 0 1 0 6h-3a3 3 0 0 0 0 6h5" fill="none" stroke="{NAVY}" stroke-width="2" stroke-linecap="round"/></svg>'
    plus=f'<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style="flex:none"><path d="M12 5v14M5 12h14" stroke="{NAVY}" stroke-width="2" stroke-linecap="round"/></svg>'
    plans_items=[{'label':'All plans'+cnt(3),'icon':sp},{'label':'Golden Circle'+cnt(3),'icon':route(),'on':True},{'label':'Copenhagen weekend'+cnt(6),'icon':route()},{'label':'Malmö day trip'+cnt(4),'icon':route()},{'label':'New plan','icon':plus}]
    TOP=400
    def scr(head,body,pins=MAPPINS,extra=''): return phone(mapbg()+mappins(pins)+ZOOM+ACCOUNT+credit(844-TOP)+addbadge(TOP)+sheet(TOP,head,body)+extra)
    rk=[r for r in ROWS if 'Reykjav' in r[2]][:4]
    places_body=secA('Reykjavík',23,new=False,first=True)+rows(rk)+secA('Copenhagen',31,new=False)
    stopn=lambda n: f'<div style="width:28px;text-align:center;font-stretch:85%;font-weight:700;font-size:15px;color:{INK2}">{n}</div>'
    gc_body=secA('Reykjavík',3,new=False,first=True)+''.join(row(c,t,mm,lead=stopn(n)) for n,c,t,mm in STOPS)
    lead_route=f'<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center">{route(22)}</div>'
    def planrow(n,m): return row('other',n,m,lead=lead_route).replace('aria-label="Delete" style="width:28px;height:28px;font-size:14px;line-height:1;color:#5A564C">&#215;','aria-label="Open" style="width:28px;height:28px;font-size:16px;line-height:1;color:#5A564C">&#8250;')
    newplan=f'<div style="display:grid;grid-template-columns:28px 1fr;column-gap:12px;align-items:center;min-height:56px;padding:8px 16px;box-sizing:border-box;border-bottom:1px solid {HAIR}"><div style="display:flex;justify-content:center">{plus}</div><span style="font-stretch:75%;text-transform:uppercase;font-weight:700;font-size:13px;letter-spacing:.05em;color:{NAVY}">New plan</span></div>'
    allplans=planrow('Golden Circle','3 stops · Reykjavík')+planrow('Copenhagen weekend','6 stops · Copenhagen → Malmö')+planrow('Malmö day trip','4 stops · Malmö')+newplan
    gcpins=[(120,190,'nature',False),(200,150,'nature',False),(260,210,'nature',False)]
    seg2=lambda t: f'<button aria-haspopup="menu" style="position:relative;display:flex;align-items:center;gap:4px;{NEWOUT}">{h2(t).replace("flex:1;","")}{CHEV(NAVY)}{NEWTAB}</button>'
    o2=scr(hdr(f'<div style="flex:1;min-width:0;display:flex;align-items:center;gap:8px">{seg2("Places")}<span style="color:{INK2};font-weight:700">·</span>{seg2("Reykjavík")}</div>'),places_body)
    return page('Places and Plans: Option 2 (not picked)',f'<div style="position:relative">{o2}</div>',390,844)
B['PlacesPlansKinds.dc.html']=('Places and Plans: kind then item',kinds_board)
B['PlacesPlansOpt2.dc.html']=('Places and Plans: Option 2',kinds_opt2)
# ---- systems Turn 11: TYPE detected from the picked place
def type_detected():
    def col(x,scr,title,n): return f'<div style="position:absolute;left:{x}px;top:0">{scr}</div><div style="position:absolute;left:{x}px;top:864px;width:390px">{note(title,n,NAVY)}</div>'
    return page('TYPE detected from the pick',
        col(0,addscreen(rtag('Sundhöllin','Barónsstígur 45a · Miðborg','attraction')),'A swimming pool → Attraction','You pick Sundhöllin; the place says what it is, so TYPE is already Attraction, shown plainly, and the pin above the tag is Attraction’s. Change it in the select if it’s wrong.')
        +col(430,addscreen(rtag('Brauð &amp; Co','Frakkastígur 16 · Miðborg','cafe')),'A bakery → Cafe','Same for a bakery: Cafe, with the Cafe pin. A place the app can’t read keeps TYPE as it was, and a TYPE you set yourself is never overridden.'),820,980)
B['TypeDetected.dc.html']=('TYPE detected from the pick',type_detected)
if __name__=='__main__':
    for k in (sys.argv[1:] or B.keys()):
        open(ROOT+k,'w').write(B[k][1]()); print('wrote',k)
