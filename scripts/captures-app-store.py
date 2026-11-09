# Captures App Store v3 (9 nov 2026) : une grille fixe, UN fond (le rose du mur de la pièce, en feutre) pour les six,
# titres courts et piquants, et ce qui ressort du téléphone raconte : vraies notifications de l'app, pensées en vrac, perles.
# Captures brutes : design/app-store/brut/ (simulateur iPhone 16 Pro Max, Metro avec EXPO_PUBLIC_CAPTURE=1).
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M='/Users/jeannecazalot/mochi/'; B=M+'design/app-store/brut/'; O=M+'design/app-store/'
W,H=1320,2868; INK=(31,42,88); CREAM=(250,244,236)
SF='/System/Library/Fonts/SFNS.ttf'
TITLE_Y=250; TITLES=['La charge mentale,','\u00e7a se partage.','Qui pense \u00e0 tout,','chez vous ?','Videz vos t\u00eates.','\u00c0 deux.','Mochi r\u00e9partit.','Sans d\u00e9bat.','Fini les','\u00ab t\u2019as pens\u00e9 \u00e0\u2026 ? \u00bb','Une mission coch\u00e9e,','une perle gagn\u00e9e.']; PHONE_Y=760; PHONE_W=int(W*0.80); MOCHI_W=270
def font(sz,w):
    f=ImageFont.truetype(SF,sz); f.set_variation_by_name(w); return f
_d=ImageDraw.Draw(Image.new('RGB',(10,10))); TITLE_SZ=118
while max(_d.textlength(l,font=font(TITLE_SZ,'Bold')) for l in TITLES)>W-200: TITLE_SZ-=2  # une seule taille pour les six titres
FELT=Image.open(M+'assets/splash/feutre.jpg').convert('L').resize((H,H)).crop(((H-W)//2,0,(H-W)//2+W,H))
def bg(col):
    base=Image.new('RGB',(W,H),col)
    # grain de feutre : on module la couleur par la texture (la DA « feutre mat »)
    tex=FELT.point(lambda v: int(128+(v-200)*0.9))
    return Image.blend(base,Image.merge('RGB',[Image.blend(Image.new('L',(W,H),c),tex.point(lambda v,c=c: max(0,min(255,c+(v-128)))),1) for c in col]),0.6).convert('RGBA')
def title(im,lines,col):
    d=ImageDraw.Draw(im); sz=TITLE_SZ
    f=font(sz,'Bold'); y=TITLE_Y
    for l in lines:
        w=d.textlength(l,font=f); d.text(((W-w)/2,y),l,font=f,fill=col); y+=int(sz*1.16)
    fw=font(40,'Semibold'); w=d.textlength('Mindpair',font=fw); d.text(((W-w)/2,120),'Mindpair',font=fw,fill=col+(150,))
def shadow(im,box,r,a=80,blur=40,dy=24):
    sh=Image.new('RGBA',im.size,(0,0,0,0)); x0,y0,x1,y1=box
    ImageDraw.Draw(sh).rounded_rectangle((x0,y0+dy,x1,y1+dy),r,fill=(40,25,30,a))
    return Image.alpha_composite(im,sh.filter(ImageFilter.GaussianBlur(blur)))
def rounded(img,r):
    m=Image.new('L',img.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,img.width-1,img.height-1),r,fill=255); return m
def phone(im,shot):
    s=Image.open(B+shot).convert('RGBA'); pw=PHONE_W; ph=int(pw*s.height/s.width); s=s.resize((pw,ph),Image.LANCZOS)
    px=(W-pw)//2; py=PHONE_Y; r=110
    im=shadow(im,(px-16,py-16,px+pw+16,py+ph+16),r+16)
    bz=Image.new('RGBA',im.size,(0,0,0,0)); ImageDraw.Draw(bz).rounded_rectangle((px-16,py-16,px+pw+16,py+ph+16),r+16,fill=(28,30,40,255))
    im=Image.alpha_composite(im,bz); im.paste(s,(px,py),rounded(s,r))
    return im,(px,py,pw/1320)
def pop(im,shot,box,geo,zoom=1.14,r=36):
    px,py,sc=geo; c=Image.open(B+shot).convert('RGBA').crop(box)
    k=sc*zoom; c=c.resize((int(c.width*k),int(c.height*k)),Image.LANCZOS)
    pad=18; card=Image.new('RGBA',(c.width+2*pad,c.height+2*pad),(0xF5,0xF1,0xEA,255)); card.paste(c,(pad,pad),c)
    cx=px+(box[0]+box[2])/2*sc; cy=py+(box[1]+box[3])/2*sc
    x=int(cx-card.width/2); y=int(cy-card.height/2)
    im=shadow(im,(x,y,x+card.width,y+card.height),r,a=110,blur=30,dy=16)
    im.paste(card,(x,y),rounded(card,r)); return im
def mochi(im,face):
    # Mochi assis sur le bord haut du téléphone, à droite — même place sur tous les écrans
    m=Image.open((M+f'assets/splash/mochi-{face}.png') if face in ('happy','neutral','sleeping') else (B+f'mochi-{face}.png')).convert('RGBA'); m=m.resize((MOCHI_W,int(MOCHI_W*m.height/m.width)),Image.LANCZOS)
    x=(W+PHONE_W)//2-MOCHI_W-40; y=PHONE_Y-16-m.height+30
    im.alpha_composite(m,(x,y)); return im

WALL=(244,206,199)
ICON=Image.open(M+'design/icone/H-meme-cadrage.png').convert('RGBA')
def notif(im,x,y,w,title_,body_,when='maintenant'):
    # bannière de notification iOS, textes réels de l'app (copy.push), corps sur 2 lignes au besoin
    fb=font(42,'Regular'); d0=ImageDraw.Draw(Image.new('RGB',(1,1))); fx=172; maxw=w-fx-40
    words=body_.split(' '); lines=['']
    for wd in words:
        t=(lines[-1]+' '+wd).strip()
        if d0.textlength(t,font=fb)<=maxw: lines[-1]=t
        else: lines.append(wd)
    h=190+56*len(lines); card=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(card)
    d.rounded_rectangle((0,0,w-1,h-1),56,fill=(252,250,247,250))
    ic=ICON.resize((104,104),Image.LANCZOS); card.paste(ic,(36,(h-104)//2),rounded(ic,24))
    d.text((fx,44),title_,font=font(44,'Semibold'),fill=(20,20,24))
    fw=font(34,'Regular'); tw=d.textlength(when,font=fw); d.text((w-40-tw,50),when,font=fw,fill=(120,120,128))
    for i,l in enumerate(lines): d.text((fx,108+56*i),l,font=fb,fill=(30,30,36))
    im=shadow(im,(x,y,x+w,y+h),56,a=110,blur=36,dy=20); im.paste(card,(x,y),card); return im
def chip(im,x,y,text,angle):
    f=font(50,'Medium'); d0=ImageDraw.Draw(Image.new('RGB',(1,1))); w=int(d0.textlength(text,font=f))+90; h=120
    c=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(c); d.rounded_rectangle((0,0,w-1,h-1),60,fill=(252,250,247,255))
    d.text((45,30),text,font=f,fill=INK); c=c.rotate(angle,expand=True,resample=Image.BICUBIC)
    im=shadow(im,(x+10,y+10,x+c.width-10,y+c.height-10),60,a=90,blur=26,dy=14); im.alpha_composite(c,(x,y)); return im

# 1 · la promesse
im=bg(WALL); title(im,['La charge mentale,','\u00e7a se partage.'],INK)
im,g=phone(im,'accueil.png'); im=pop(im,'accueil.png',(40,1170,1280,1260),g,zoom=1.16)
im=notif(im,90,PHONE_Y+1180,W-180,'Mindpair','Ketley a termin\u00e9 Vaisselle')
im.convert('RGB').save(O+'01-promesse.png')

# 2 · le problème : la carte Insee, et les pensées en vrac qui débordent
im=bg(WALL); title(im,['Qui pense \u00e0 tout,','chez vous ?'],INK)
px=(W-PHONE_W)//2; py=PHONE_Y; im=shadow(im,(px,py,px+PHONE_W,H+200),110)
card=Image.new('RGBA',(PHONE_W,H-py+200),(0xF5,0xF1,0xEA,255)); im.paste(card,(px,py),rounded(card,110))
d=ImageDraw.Draw(im)
def ctext(y,t,f,fill):
    w=d.textlength(t,font=f); d.text(((W-w)/2,y),t,font=f,fill=fill)
ctext(py+520,'+1h26',font(300,'Bold'),INK); ctext(py+860,'par jour, pour la m\u00eame personne.',font(56,'Bold'),INK)
ctext(py+960,'T\u00e2ches domestiques et organisation, dans la plupart des couples.',font(36,'Medium'),INK+(150,))
ctext(py+1020,'Insee \u00b7 Enqu\u00eate emploi du temps',font(36,'Medium'),INK+(120,))
for (x,y,t,a) in [(60,PHONE_Y+90,'RDV p\u00e9diatre \u00b7 mardi 14 h',-4),(460,PHONE_Y+300,'Racheter du caf\u00e9 \u00b7 avant demain',5),(110,PHONE_Y+1320,'Cadeau d\u2019anniversaire \u00b7 30 ans',3),(520,PHONE_Y+1560,'Appeler le plombier \u00b7 la fuite',-5),(90,PHONE_Y+1800,'Renouveler la carte Vitale',-2)]:
    im=chip(im,x,y,t,a)
im.convert('RGB').save(O+'02-probleme.png')

# 3 · vous listez à deux
im=bg(WALL); title(im,['Videz vos t\u00eates.','\u00c0 deux.'],INK)
im,g=phone(im,'taches.png'); im=pop(im,'taches.png',(56,848,1264,1040),g); im=pop(im,'taches.png',(56,1052,1264,1240),g)
im=notif(im,90,PHONE_Y+1500,W-180,'Mindpair','Ketley choisit vos missions. Viens les choisir avec elle ou lui.')
im.convert('RGB').save(O+'03-lister.png')

# 4 · Mochi répartit
im=bg(WALL); title(im,['Mochi r\u00e9partit.','Sans d\u00e9bat.'],INK)
im,g=phone(im,'dispatch.png'); im=pop(im,'dispatch.png',(60,872,1260,1144),g,zoom=1.2)
im=notif(im,90,PHONE_Y+1560,W-180,'Mindpair','Ketley a r\u00e9parti la semaine : 12 missions. Va voir le Planning.')
im.convert('RGB').save(O+'04-repartir.png')

# 5 · plus besoin de relancer : l'app relance à votre place
im=bg(WALL); title(im,['Fini les','\u00ab t\u2019as pens\u00e9 \u00e0\u2026 ? \u00bb'],INK)
im,g=phone(im,'planning.png')
im=notif(im,90,PHONE_Y+760,W-180,'Vaisselle','C\u2019est l\u2019heure. 15 min suffisent.','20:30')
im=notif(im,90,PHONE_Y+1060,W-180,'Mindpair','Ketley : c\u2019est ton tour pour \u00ab Lessive \u00bb')
im.convert('RGB').save(O+'05-chacun.png')

# 6 · le jeu
im=bg(WALL); title(im,['Une mission coch\u00e9e,','une perle gagn\u00e9e.'],INK)
im,g=phone(im,'chambre.png'); im=pop(im,'chambre.png',(1010,190,1270,300),g,zoom=2.0,r=60); im=pop(im,'chambre.png',(60,1300,1264,1515),g,zoom=1.18)
im.convert('RGB').save(O+'06-mochi.png')

fs=['01-promesse','02-probleme','03-lister','04-repartir','05-chacun','06-mochi']
s=0.25; w,h=int(W*s),int(H*s); gp=24
P=Image.new('RGB',(6*w+7*gp,h+2*gp),(236,232,226))
for i,f in enumerate(fs): P.paste(Image.open(O+f+'.png').resize((w,h)),(gp+i*(w+gp),gp))
P.save(O+'planche.png')
