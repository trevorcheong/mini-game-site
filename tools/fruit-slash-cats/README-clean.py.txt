from PIL import Image
from collections import deque
src='/home/claude/mini-game-site/tools/fruit-slash-cats/'
def lum(p): return (p[0]+p[1]+p[2])/3
def sat(p): return max(p[:3])-min(p[:3])
for k in ['idle','wave','cheer','cheer2','shock','sad','cry','victory']:
    im=Image.open(k+'.png').convert('RGBA'); px=im.load(); w,h=im.size
    N4=((1,0),(-1,0),(0,1),(0,-1)); N8=[(dx,dy) for dx in (-1,0,1) for dy in (-1,0,1) if dx or dy]
    inb=lambda x,y:0<=x<w and 0<=y<h
    # 1) white background connected to the outside
    seen=set(); q=deque()
    for x in range(w):
        for y in range(h):
            if px[x,y][3]<20: seen.add((x,y)); q.append((x,y))
    while q:
        x,y=q.popleft()
        for dx,dy in N4:
            n=(x+dx,y+dy)
            if inb(*n) and n not in seen:
                seen.add(n); p=px[n]
                if p[3]>0 and min(p[:3])>200 and sat(p)<40: px[n]=(0,0,0,0); q.append(n)
    # 2) enclosed white patch behind the head (cheer poses)
    box={'cheer':(184,80,214,120),'cheer2':(186,74,214,120)}.get(k)
    if box:
        x0,y0,x1,y1=box
        for x in range(x0,x1):
            for y in range(y0,y1):
                p=px[x,y]
                if p[3] and lum(p)>150 and sat(p)<100: px[x,y]=(0,0,0,0)
    # 3) light / grey leftovers on the lower body (between arms, legs, feet, tail); eyes are higher up
    for x in range(w):
        for y in range(150,h):
            if k=='victory' and x<50: continue      # keep the sword
            p=px[x,y]
            if p[3] and lum(p)>115 and sat(p)<45: px[x,y]=(0,0,0,0)
    # 4) light, low-colour edge pixels (halo) -> transparent, a few passes
    for _ in range(3):
        kill=[]
        for x in range(w):
            for y in range(h):
                p=px[x,y]
                if p[3] and p[3]<255 and lum(p)>140 and sat(p)<70 and not (k=='victory' and x<50 and y<175):
                    if any(inb(x+dx,y+dy) and px[x+dx,y+dy][3]<30 for dx,dy in N8): kill.append((x,y))
        for x,y in kill: px[x,y]=(0,0,0,0)
    # 5) remaining soft edge pixels take the median colour of nearby solid pixels (no dark specks, no white tint)
    snap=im.copy().load()
    for x in range(w):
        for y in range(h):
            p=snap[x,y]
            if 0<p[3]<250:
                nb=[snap[x+dx,y+dy] for dx in (-2,-1,0,1,2) for dy in (-2,-1,0,1,2) if inb(x+dx,y+dy) and snap[x+dx,y+dy][3]>=250]
                if nb:
                    nb.sort(key=lum); m=nb[len(nb)//2]
                    px[x,y]=(m[0],m[1],m[2],p[3])
    im.save(src+k+'.webp','WEBP',quality=92,method=6); print(k,'ok')
