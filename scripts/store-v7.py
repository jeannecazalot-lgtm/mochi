# Captures App Store v7 (10 nov 2026) : écrans 3 à 6 avec chacun sa mise en scène (retour Jeanne : « plus surprenant,
# plus créatif »), les trois promesses dans les titres. Écrans 1 et 2 repris (v6-01, v6-02).
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M='/Users/jeannecazalot/mochi/'; B=M+'design/app-store/brut/'; O=M+'design/app-store/'
W,H=1320,2868; INK=(31,42,88); CARD=(250,247,242)
SF='/System/Library/Fonts/SFNS.ttf'
def font(sz,w):
    f=ImageFont.truetype(SF,sz); f.set_variation_by_name(w); return f
FELT=Image.open(M+'assets/splash/feutre.jpg').convert('RGB').resize((H,H))
def bg():
    base=Image.new('RGB',(W,H),(0xF3,0xEA,0xDF)); lay=base.copy(); lay.paste(FELT,((W-H)//2,0)); return Image.blend(base,lay,0.55).convert('RGBA')
def rounded(img,r):
    m=Image.new('L',img.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,img.width-1,img.height-1),r,fill=255); return m
def drop(im,img,x,y,a=95,blur=40,dy=26):
    sh=Image.new('RGBA',im.size,(0,0,0,0)); s=Image.new('RGBA',img.size,(60,35,30,a)); sh.paste(s,(x,y+dy),img.split()[3])
    im=Image.alpha_composite(im,sh.filter(ImageFilter.GaussianBlur(blur))); im.alpha_composite(img,(x,y)); return im
def phone(shot,pw):
    s=Image.open(B+shot).convert('RGBA'); sc=pw/s.width; ph=int(s.height*sc); s2=s.resize((pw,ph),Image.LANCZOS)
    bz=int(pw*0.014); r=int(pw*0.115); out=Image.new('RGBA',(pw+2*bz,ph+2*bz),(0,0,0,0))
    ImageDraw.Draw(out).rounded_rectangle((0,0,out.width-1,out.height-1),r+bz,fill=(24,24,30,255)); out.paste(s2,(bz,bz),rounded(s2,r))
    return out,sc,bz,s
def card(src,box,width,r=40,bgc=CARD):
    c=src.crop(box); k=width/c.width; c=c.resize((int(c.width*k),int(c.height*k)),Image.LANCZOS); pad=int(30*k/1.2)+20
    o=Image.new('RGBA',(c.width+2*pad,c.height+2*pad),bgc+(255,)); o.paste(c,(pad,pad),c); m=rounded(o,r); o.putalpha(m); return o
def sticker(path,w,angle):
    im=Image.open(path).convert('RGBA'); im=im.resize((w,int(w*im.height/im.width)),Image.LANCZOS)
    pad=24; base=Image.new('RGBA',(im.width+2*pad,im.height+2*pad),(0,0,0,0)); base.paste(im,(pad,pad),im)
    a=base.split()[3].point(lambda v:255 if v>40 else 0).filter(ImageFilter.MaxFilter(19)).filter(ImageFilter.GaussianBlur(1.5))
    white=Image.new('RGBA',base.size,(255,255,255,255)); white.putalpha(a); white.alpha_composite(base); return white.rotate(angle,expand=True,resample=Image.BICUBIC)
def titles(im,lines,sub,y0=230):
    d=ImageDraw.Draw(im); f=font(92,'Bold'); y=y0
    for l in lines: w=d.textlength(l,font=f); d.text(((W-w)/2,y),l,font=f,fill=INK); y+=110
    fs=font(50,'Medium'); w=d.textlength(sub,font=fs); d.text(((W-w)/2,y+18),sub,font=fs,fill=INK+(175,)); return y+100
FACE={'J':M+'design/app-store/visages/me.jpg','K':M+'design/app-store/visages/sam.jpg'}  # visages des captures iky
def avatar(im,cx,cy,r,col,letter):
    d=ImageDraw.Draw(im); d.ellipse((cx-r-9,cy-r-9,cx+r+9,cy+r+9),fill=(255,255,255))
    ph=Image.open(FACE[letter]).convert('RGB'); s_=min(ph.size); ph=ph.crop(((ph.width-s_)//2,0,(ph.width-s_)//2+s_,s_)).resize((2*r,2*r),Image.LANCZOS)
    m=Image.new('L',(2*r,2*r),0); ImageDraw.Draw(m).ellipse((0,0,2*r-1,2*r-1),fill=255); im.paste(ph,(cx-r,cy-r),m)

# ── 3 · Préparer à deux : deux téléphones, la même liste, en direct
im=bg(); top=titles(im,['Préparez vos missions','à deux.'],'Tout est listé : moins de charge mentale.')
pA,_,_,_=phone('taches.png',int(W*0.60)); pB=pA.copy()
pA=pA.rotate(6,expand=True,resample=Image.BICUBIC); pB=pB.rotate(-6,expand=True,resample=Image.BICUBIC)
y=top+170; im=drop(im,pA,-90,y+60); im=drop(im,pB,W-pB.width+90,y)
avatar(im,int(W*0.22),y+40,84,(125,179,213),'J'); avatar(im,int(W*0.78),y-10,84,(184,165,217),'K')
d=ImageDraw.Draw(im); pill='Synchronisé en direct'; f=font(46,'Semibold'); pw=int(d.textlength(pill,font=f))+80
pl=Image.new('RGBA',(pw,104),(0,0,0,0)); ImageDraw.Draw(pl).rounded_rectangle((0,0,pw-1,103),52,fill=INK+(255,)); ImageDraw.Draw(pl).text((40,26),pill,font=f,fill=(255,255,255))
im=drop(im,pl,(W-pw)//2,y+1250,a=80,blur=24,dy=12)
im.convert('RGB').save(O+'v7-03.png')

# ── 4 · Divisées équitablement : la carte Équilibré en géant, le téléphone qui sort par le bas
im=bg(); top=titles(im,['Partagées','équitablement.'],'Selon vos envies, vos besoins, vos dispos.')
ph,sc,bz,src=phone('dispatch.png',int(W*0.82)); px=(W-ph.width)//2; py=top+520
im=drop(im,ph,px,py)
c=card(src,(60,872,1260,1144),W-170); im=drop(im,c,(W-c.width)//2,top+170,a=110)
avatar(im,150,top+150,74,(125,179,213),'J'); avatar(im,W-150,top+150,74,(184,165,217),'K')
im.convert('RGB').save(O+'v7-04.png')

# ── 5 · Le jeu : le téléphone à gauche, Mochi géant qui déborde à droite, la jauge d'énergie qui ressort
im=bg(); top=titles(im,['Chaque mission cochée','nourrit Mochi.'],'Moins de prises de tête, vous avancez ensemble.')
ph,sc,bz,src=phone('accueil.png',int(W*0.64)); ph=ph.rotate(4,expand=True,resample=Image.BICUBIC); px=40; py=top+120
im=drop(im,ph,px,py)
c=card(src,(40,1170,1280,1260),W-140); im=drop(im,c,70,top+760,a=115)
m=Image.open(M+'assets/splash/mochi-happy.png').convert('RGBA'); mw=int(W*0.95); m=m.resize((mw,int(mw*m.height/m.width)),Image.LANCZOS)
im=drop(im,m,W-int(mw*0.66),H-int(m.height*0.92),a=70,blur=30)
im.convert('RGB').save(O+'v7-05.png')

# ── 6 · Mochi grandit : le téléphone au centre, les objets de la boutique en stickers autour
im=bg(); top=titles(im,['Mochi grandit','avec vous.'],'Chaque mission rapporte des perles pour sa pièce.')
ph,sc,bz,src=phone('chambre.png',int(W*0.66)); px=(W-ph.width)//2; py=top+150
im=drop(im,ph,px,py)
for (k,w,a,x,y) in [('montgolfiere',300,-8,10,top+90),('disco',230,10,W-250,top+120),('couronne',250,-12,0,top+900),('aquarium',290,8,W-300,top+820),('cheval',330,-6,-10,H-620),('lunettesrouges',260,12,W-290,H-560)]:
    s=sticker(M+f'assets/boutique/{k}.png',w,a); im=drop(im,s,x,y,a=70,blur=20,dy=12)
def pearl(r):
    # perle nacrée : dégradé crème → rose pâle, reflet blanc
    p=Image.new('RGBA',(2*r,2*r),(0,0,0,0)); dp=ImageDraw.Draw(p)
    for i in range(r,0,-1):
        t=i/r; col=(int(232+20*(1-t)),int(214+30*(1-t)),int(220+28*(1-t)),255); dp.ellipse((r-i,r-i,r+i,r+i),fill=col)
    dp.ellipse((int(r*0.45),int(r*0.35),int(r*0.95),int(r*0.8)),fill=(255,255,255,230))
    ring=Image.new('RGBA',p.size,(0,0,0,0)); ImageDraw.Draw(ring).ellipse((1,1,2*r-2,2*r-2),outline=(200,170,180,255),width=3); p.alpha_composite(ring); return p
f=font(88,'Bold'); d0=ImageDraw.Draw(Image.new('RGB',(1,1))); label='+3 perles'; tw=int(d0.textlength(label,font=f))
bw=tw+340; bh=170; badge=Image.new('RGBA',(bw,bh),(0,0,0,0)); db=ImageDraw.Draw(badge)
db.rounded_rectangle((0,0,bw-1,bh-1),85,fill=INK+(255,))
for i,x in enumerate([34,112,190]): pr=pearl(34); badge.alpha_composite(pr,(x,bh//2-34))
db.text((280,bh//2-56),label,font=f,fill=(255,255,255))
badge=badge.rotate(-5,expand=True,resample=Image.BICUBIC)
im=drop(im,badge,(W-badge.width)//2+60,top+40,a=100,blur=26,dy=14)
im.convert('RGB').save(O+'v7-06.png')

fs=['v6-01','v6-02','v7-03','v7-04','v7-05','v7-06']
k=0.25; w,h=int(W*k),int(H*k); g=24
P=Image.new('RGB',(6*w+7*g,h+2*g),(226,220,212))
for i,f in enumerate(fs): P.paste(Image.open(O+f+'.png').resize((w,h)),(g+i*(w+g),g))
P.save(O+'planche-v7.png')
