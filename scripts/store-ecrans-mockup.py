# Écrans App Store 2 à 6, version téléphone (Jeanne 10 nov 2026) + planche d'ensemble avec l'écran 1 validé (v4-01).
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M='/Users/jeannecazalot/mochi/'; B=M+'design/app-store/brut/'; O=M+'design/app-store/'
W,H=1320,2868; INK=(31,42,88); CREAM=(245,241,234)
SF='/System/Library/Fonts/SFNS.ttf'
def font(sz,w):
    f=ImageFont.truetype(SF,sz); f.set_variation_by_name(w); return f
FELT=Image.open(M+'assets/splash/feutre.jpg').convert('RGB').resize((H,H))
def felt_bg():
    base=Image.new('RGB',(W,H),(0xF3,0xEA,0xDF)); lay=base.copy(); lay.paste(FELT,((W-H)//2,0)); return Image.blend(base,lay,0.55).convert('RGBA')
def rounded(img,r):
    m=Image.new('L',img.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,img.width-1,img.height-1),r,fill=255); return m
def shadow(im,box,r,a=90,blur=44,dy=26):
    sh=Image.new('RGBA',im.size,(0,0,0,0)); x0,y0,x1,y1=box
    ImageDraw.Draw(sh).rounded_rectangle((x0,y0+dy,x1,y1+dy),r,fill=(60,35,30,a))
    return Image.alpha_composite(im,sh.filter(ImageFilter.GaussianBlur(blur)))
ICON=Image.open(M+'design/icone/H-meme-cadrage.png').convert('RGBA')
PW=int(W*0.74); PY=600; R=118; BZ=14

def screen(out,title,shot,pops,notif=None,kicker=None,sub=None):
    im=felt_bg(); d=ImageDraw.Draw(im)
    if sub is None:
        for i,l in enumerate(title):
            f=font(96,'Bold'); w=d.textlength(l,font=f); d.text(((W-w)/2,250+116*i),l,font=f,fill=INK)
    else:  # les trois piliers : repère numéroté, titre sur une ligne, bénéfice dessous
        if kicker:
            fk=font(46,'Semibold'); w=d.textlength(kicker,font=fk); d.text(((W-w)/2,205),kicker,font=fk,fill=(217,72,62))
        f=font(TSZ,'Bold'); w=d.textlength(title[0],font=f); d.text(((W-w)/2,250),title[0],font=f,fill=INK)
        fs=font(50,'Medium'); w=d.textlength(sub,font=fs); d.text(((W-w)/2,385),sub,font=fs,fill=INK+(175,))
    s=Image.open(B+shot).convert('RGBA'); sc=PW/s.width; PH=int(s.height*sc); s2=s.resize((PW,PH),Image.LANCZOS)
    PX=(W-PW)//2
    im=shadow(im,(PX-BZ,PY-BZ,PX+PW+BZ,PY+PH+BZ),R+BZ)
    bz=Image.new('RGBA',im.size,(0,0,0,0)); ImageDraw.Draw(bz).rounded_rectangle((PX-BZ,PY-BZ,PX+PW+BZ,PY+PH+BZ),R+BZ,fill=(24,24,30,255))
    im=Image.alpha_composite(im,bz); im.paste(s2,(PX,PY),rounded(s2,R))
    for (box,zoom,bg) in pops:
        c=s.crop(box); k=sc*zoom; c=c.resize((int(c.width*k),int(c.height*k)),Image.LANCZOS); pad=30
        card=Image.new('RGBA',(c.width+2*pad,c.height+2*pad),bg+(255,)); card.paste(c,(pad,pad),c)
        cx=int(PX+(box[0]+box[2])/2*sc-card.width/2); cy=int(PY+(box[1]+box[3])/2*sc-card.height/2)
        im=shadow(im,(cx,cy,cx+card.width,cy+card.height),44,a=115,blur=34,dy=20); im.paste(card,(cx,cy),rounded(card,44))
    if notif:
        t_,b_,when=notif; w=PW+120; x=(W-w)//2; y=PY+130; h=230
        card=Image.new('RGBA',(w,h),(0,0,0,0)); dc=ImageDraw.Draw(card); dc.rounded_rectangle((0,0,w-1,h-1),54,fill=(252,250,247,250))
        ic=ICON.resize((100,100),Image.LANCZOS); card.paste(ic,(34,(h-100)//2),rounded(ic,24))
        dc.text((164,48),t_,font=font(44,'Semibold'),fill=(20,20,24)); fw=font(34,'Regular'); tw=dc.textlength(when,font=fw); dc.text((w-40-tw,54),when,font=fw,fill=(120,120,128))
        dc.text((164,112),b_,font=font(42,'Regular'),fill=(30,30,36))
        im=shadow(im,(x,y,x+w,y+h),54,a=110,blur=34,dy=18); im.paste(card,(x,y),card)
    im.convert('RGB').save(O+out+'.png')

CARD=(250,247,242); NUIT=(46,33,64)
_d=ImageDraw.Draw(Image.new('RGB',(1,1))); TSZ=96
while max(_d.textlength(t,font=font(TSZ,'Bold')) for t in ['Préparez vos to-do à deux.', 'Partagées équitablement.', 'Un suivi qui se joue.', 'Mochi grandit avec vous.'])>W-150: TSZ-=2
# screen('v5-02',['Souvent, une seule','personne y pense.'],'onb1.png',[((40,1822,1280,1938),1.16,NUIT)])
screen('v6-03',['Pr\u00e9parez vos to-do \u00e0 deux.'],'taches.png',[((56,848,1264,1040),1.16,CARD),((56,1052,1264,1240),1.16,CARD)],kicker=None,sub='Tout est list\u00e9 : moins de charge mentale.')
screen('v6-04',['Partag\u00e9es \u00e9quitablement.'],'dispatch.png',[((60,872,1260,1144),1.32,CARD)],kicker=None,sub='Selon vos envies, vos besoins, vos dispos.')
screen('v6-05',['Un suivi qui se joue.'],'accueil.png',[((40,1170,1280,1260),1.18,CARD),((740,225,990,320),1.9,CARD)],kicker=None,sub='Moins de prises de t\u00eate, plus de missions faites.')
screen('v6-06',['Mochi grandit avec vous.'],'chambre.png',[((1010,190,1270,300),1.9,CARD),((60,1300,1264,1515),1.16,CARD)],kicker=None,sub='Chaque mission rapporte des perles pour sa pi\u00e8ce.')

fs=['v6-01','v6-02','v6-03','v6-04','v6-05','v6-06']
k=0.25; w,h=int(W*k),int(H*k); g=24
P=Image.new('RGB',(6*w+7*g,h+2*g),(226,220,212))
for i,f in enumerate(fs): P.paste(Image.open(O+f+'.png').resize((w,h)),(g+i*(w+g),g))
P.save(O+'planche-v6.png')
