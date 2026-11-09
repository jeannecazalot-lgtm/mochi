# Captures App Store v2 (9 nov 2026) : une grille fixe (titre au même endroit, téléphone même taille / même hauteur),
# une couleur franche de la pièce de Mochi par écran, Mochi qui réagit au titre, un élément qui ressort du téléphone.
# Captures brutes : design/app-store/brut/ (simulateur iPhone 16 Pro Max, Metro avec EXPO_PUBLIC_CAPTURE=1).
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M='/Users/jeannecazalot/mochi/'; B=M+'design/app-store/brut/'; O=M+'design/app-store/'
W,H=1320,2868; INK=(31,42,88); CREAM=(250,244,236)
SF='/System/Library/Fonts/SFNS.ttf'
TITLE_Y=250; TITLES=['Partagez la charge mentale,','en vous amusant.','Souvent, une seule','personne y pense.','Vous listez tout ce qui','tourne dans vos t\u00eates.','Mochi r\u00e9partit,','\u00e9quitablement.','Chacun ses missions.','Plus besoin de relancer.','Et vous \u00e9levez Mochi,','ensemble.']; PHONE_Y=760; PHONE_W=int(W*0.80); MOCHI_W=270
def font(sz,w):
    f=ImageFont.truetype(SF,sz); f.set_variation_by_name(w); return f
_d=ImageDraw.Draw(Image.new('RGB',(10,10))); TITLE_SZ=104
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

ROSE=(246,196,192); CIEL=(158,207,236); VERT=(166,206,128); JAUNE=(248,214,104); ROUGE=(214,74,64); NUIT=(31,42,88)

# 1 · la promesse
im=bg(ROSE); title(im,['Partagez la charge mentale,','en vous amusant.'],INK)
im,g=phone(im,'accueil.png'); im=pop(im,'accueil.png',(40,1170,1280,1260),g,zoom=1.16); im=mochi(im,'happy')
im.convert('RGB').save(O+'01-promesse.png')

# 2 · le problème : une « carte » à la place du téléphone, même gabarit
im=bg(CIEL); title(im,['Souvent, une seule','personne y pense.'],INK)
px=(W-PHONE_W)//2; py=PHONE_Y; im=shadow(im,(px,py,px+PHONE_W,H+200),110)
card=Image.new('RGBA',(PHONE_W,H-py+200),(0xF5,0xF1,0xEA,255)); im.paste(card,(px,py),rounded(card,110))
d=ImageDraw.Draw(im)
def ctext(y,t,f,fill):
    w=d.textlength(t,font=f); d.text(((W-w)/2,y),t,font=f,fill=fill)
ctext(py+170,'Dans la plupart des couples,',font(52,'Medium'),INK+(170,)); ctext(py+240,'l’un des deux porte en plus',font(52,'Medium'),INK+(170,))
ctext(py+360,'+1h26',font(300,'Bold'),INK); ctext(py+700,'par jour.',font(84,'Bold'),INK)
y=py+900; fr=font(54,'Medium'); fv=font(54,'Bold')
for t,v in [('Chaque semaine','≈ 10 h'),('Sur l’année','≈ 260 h')]:
    d.line((px+90,y,px+PHONE_W-90,y),fill=INK+(40,),width=3); d.text((px+90,y+38),t,font=fr,fill=INK+(180,))
    w=d.textlength(v,font=fv); d.text((px+PHONE_W-90-w,y+38),v,font=fv,fill=INK); y+=140
d.line((px+90,y,px+PHONE_W-90,y),fill=INK+(40,),width=3)
ctext(y+60,'De tâches domestiques et d’organisation.',font(44,'Medium'),INK+(150,))
ctext(y+130,'Insee · Enquête emploi du temps',font(38,'Medium'),INK+(120,))
im=mochi(im,'sad'); im.convert('RGB').save(O+'02-probleme.png')

# 3 · vous listez à deux
im=bg(VERT); title(im,['Vous listez tout ce qui','tourne dans vos têtes.'],INK)
im,g=phone(im,'taches.png'); im=pop(im,'taches.png',(56,848,1264,1040),g); im=pop(im,'taches.png',(56,1052,1264,1240),g); im=mochi(im,'surprised')
im.convert('RGB').save(O+'03-lister.png')

# 4 · Mochi répartit
im=bg(JAUNE); title(im,['Mochi répartit,','équitablement.'],INK)
im,g=phone(im,'dispatch.png'); im=pop(im,'dispatch.png',(60,872,1260,1144),g,zoom=1.16); im=mochi(im,'happy')
im.convert('RGB').save(O+'04-repartir.png')

# 5 · chacun ses missions
im=bg(ROUGE); title(im,['Chacun ses missions.','Plus besoin de relancer.'],CREAM)
im,g=phone(im,'planning.png'); im=pop(im,'planning.png',(40,960,1290,1080),g,zoom=1.16); im=mochi(im,'wink')
im.convert('RGB').save(O+'05-chacun.png')

# 6 · vous élevez Mochi
im=bg(NUIT); title(im,['Et vous élevez Mochi,','ensemble.'],CREAM)
im,g=phone(im,'chambre.png'); im=pop(im,'chambre.png',(60,1300,1264,1515),g,zoom=1.16); im=mochi(im,'happy')
im.convert('RGB').save(O+'06-mochi.png')

fs=['01-promesse','02-probleme','03-lister','04-repartir','05-chacun','06-mochi']
s=0.25; w,h=int(W*s),int(H*s); gp=24
P=Image.new('RGB',(6*w+7*gp,h+2*gp),(236,232,226))
for i,f in enumerate(fs): P.paste(Image.open(O+f+'.png').resize((w,h)),(gp+i*(w+gp),gp))
P.save(O+'planche.png')
