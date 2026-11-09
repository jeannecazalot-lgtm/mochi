# Écran 2 (le problème) : 3 pistes à comparer (10 nov 2026). Images de l'app uniquement (pictos feutre, Mochi, pièce).
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M='/Users/jeannecazalot/mochi/'; B=M+'design/app-store/brut/'; O=M+'design/app-store/'
W,H=1320,2868; INK=(31,42,88); CREAM=(245,241,234); SKY=(125,179,213); LAV=(184,165,217); CORAL=(232,112,96)
SF='/System/Library/Fonts/SFNS.ttf'
def font(sz,w):
    f=ImageFont.truetype(SF,sz); f.set_variation_by_name(w); return f
def center(d,y,t,f,fill):
    w=d.textlength(t,font=f); d.text(((W-w)/2,y),t,font=f,fill=fill)
def icon(name,size,angle=0):
    im=Image.open(M+f'assets/icones/{name}.png').convert('RGBA'); im=im.resize((size,size),Image.LANCZOS)
    return im.rotate(angle,expand=True,resample=Image.BICUBIC) if angle else im
def soft_shadow(im,img,x,y,a=80):
    sh=Image.new('RGBA',im.size,(0,0,0,0)); m=Image.new('RGBA',img.size,(60,35,30,a)); sh.paste(m,(x+6,y+18),img.split()[3])
    return Image.alpha_composite(im,sh.filter(ImageFilter.GaussianBlur(14)))
def avatar(im,cx,cy,r,col,letter):
    d=ImageDraw.Draw(im); d.ellipse((cx-r,cy-r,cx+r,cy+r),fill=col,outline=(255,255,255),width=10)
    f=font(int(r*0.95),'Semibold'); w=d.textlength(letter,font=f); d.text((cx-w/2,cy-r*0.62),letter,font=f,fill=(255,255,255))
def mochi(face,w):
    p=M+f'assets/splash/mochi-{face}.png'
    try: m=Image.open(p).convert('RGBA')
    except FileNotFoundError: m=Image.open(B+f'mochi-{face}.png').convert('RGBA')
    return m.resize((w,int(w*m.height/m.width)),Image.LANCZOS)
TASKS=['dish','basket','cart','calendar','baby','pan','trash','broom','pill','mail','gift','bed','shirt','car','dog','coins','file','phone']

# ── A · la pile : l'une croule, l'autre rien
random.seed(4)
im=Image.new('RGBA',(W,H),CREAM+(255,)); d=ImageDraw.Draw(im)
center(d,260,'Souvent, une seule',font(100,'Bold'),INK); center(d,385,'personne porte tout.',font(100,'Bold'),INK)
GY=2280  # le sol
L,R=430,960
for i,t in enumerate(TASKS[:18]):
    row=i//3; col=i%3; s=270
    x=L-s//2+(col-1)*210+random.randint(-30,30); y=GY-300-row*215-s+random.randint(-20,20)
    ic=icon(t,s,random.randint(-14,14)); im=soft_shadow(im,ic,x,y,60); im.alpha_composite(ic,(x,y))
avatar(im,L,GY-110,150,SKY,'J'); avatar(im,R,GY-110,150,LAV,'K')
d=ImageDraw.Draw(im); d.line((140,GY+60,W-140,GY+60),fill=INK+(60,),width=4)
center(d,GY+150,'+1h26 par jour pour la même personne.',font(56,'Bold'),INK)
center(d,GY+240,'Insee · Enquête emploi du temps',font(40,'Medium'),INK+(130,))
im.convert('RGB').save(O+'piste2-A-pile.png')

# ── B · le chiffre, la nuit (l'ambiance de l'onboarding)
NUIT=(46,33,64)
im=Image.new('RGBA',(W,H),NUIT+(255,)); d=ImageDraw.Draw(im)
room=Image.open(B+'scene-nuit.png').convert('RGBA').crop((0,741,1320,2067))
mask=Image.new('L',room.size,255); md=ImageDraw.Draw(mask)
for i in range(300): md.line((0,room.height-1-i,W,room.height-1-i),fill=int(255*i/300))
im.paste(room,(0,0),mask)
d=ImageDraw.Draw(im)
center(d,1330,'Chez vous, qui porte tout ?',font(84,'Bold'),(244,239,232))
center(d,1520,'+1h26',font(330,'Bold'),CORAL)
center(d,1890,'par jour, en plus, pour l’un des deux.',font(56,'Medium'),(244,239,232))
y=2080
for t,v in [('Chaque semaine','≈ 10 h'),('Sur l’année','≈ 260 h')]:
    d.line((160,y,W-160,y),fill=(244,239,232,50),width=3); d.text((160,y+40),t,font=font(54,'Medium'),fill=(200,190,215))
    fv=font(60,'Bold'); w=d.textlength(v,font=fv); d.text((W-160-w,y+36),v,font=fv,fill=CORAL); y+=150
d.line((160,y,W-160,y),fill=(244,239,232,50),width=3)
center(d,y+70,'Insee · Enquête emploi du temps',font(40,'Medium'),(168,155,184))
im.convert('RGB').save(O+'piste2-B-chiffre.png')

# ── C · la tête pleine : Mochi triste, une bulle de pensée bourrée de tâches
random.seed(9)
im=Image.new('RGBA',(W,H),CREAM+(255,)); d=ImageDraw.Draw(im)
center(d,260,'Qui pense à tout,',font(100,'Bold'),INK); center(d,385,'chez vous ?',font(100,'Bold'),INK)
cx,cy,rx,ry=W//2,1180,560,470
bub=Image.new('RGBA',(W,H),(0,0,0,0)); bd=ImageDraw.Draw(bub)
for (x,y,r) in [(cx-330,cy-260,250),(cx+40,cy-330,290),(cx+330,cy-170,240),(cx-380,cy+60,230),(cx-40,cy+40,320),(cx+350,cy+130,230),(cx-150,cy+260,230),(cx+170,cy+280,220)]:
    bd.ellipse((x-r,y-r,x+r,y+r),fill=(255,255,255,255))
for (x,y,r) in [(cx-60,cy+620,70),(cx-120,cy+740,44)]: bd.ellipse((x-r,y-r,x+r,y+r),fill=(255,255,255,255))
sh=Image.new('RGBA',(W,H),(0,0,0,0)); sh.paste((60,35,30,60),(0,24),bub.split()[3]); im=Image.alpha_composite(im,sh.filter(ImageFilter.GaussianBlur(30))); im.alpha_composite(bub)
spots=[(cx-420,cy-330),(cx-170,cy-430),(cx+80,cy-420),(cx+320,cy-300),(cx-470,cy-60),(cx-220,cy-160),(cx+40,cy-150),(cx+300,cy-30),(cx-380,cy+190),(cx-120,cy+110),(cx+150,cy+170),(cx+390,cy+200),(cx-180,cy+360),(cx+80,cy+380)]
for i,(x,y) in enumerate(spots):
    ic=icon(TASKS[i],190,random.randint(-16,16)); im.alpha_composite(ic,(x-ic.width//2,y-ic.height//2))
m=mochi('sad',620); im=soft_shadow(im,m,(W-m.width)//2,2050,50); im.alpha_composite(m,((W-m.width)//2,2050))
d=ImageDraw.Draw(im)
center(d,2620,'+1h26 par jour pour la même personne · Insee',font(44,'Medium'),INK+(150,))
im.convert('RGB').save(O+'piste2-C-tete.png')

fs=['piste2-A-pile','piste2-B-chiffre','piste2-C-tete']
sc=0.3; w,h=int(W*sc),int(H*sc); g=30
P=Image.new('RGB',(3*w+4*g,h+2*g+60),(226,220,212)); pd=ImageDraw.Draw(P)
for i,f in enumerate(fs):
    P.paste(Image.open(O+f+'.png').resize((w,h)),(g+i*(w+g),g)); pd.text((g+i*(w+g)+6,g+h+14),['A · La pile','B · Le chiffre, la nuit','C · La tête pleine'][i],font=font(32,'Semibold'),fill=INK)
P.save(O+'planche-ecran2.png')
