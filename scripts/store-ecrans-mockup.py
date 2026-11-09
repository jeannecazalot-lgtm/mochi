# Écrans App Store 2 à 6, version téléphone (Jeanne 10 nov 2026) + planche d'ensemble avec l'écran 1 validé (v4-01).
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M='/Users/jeannecazalot/mochi/'; B=M+'design/app-store/brut/'; O=M+'design/app-store/'
W,H=1320,2868; INK=(31,42,88); CREAM=(245,241,234)
SF='/System/Library/Fonts/SFNS.ttf'
def font(sz,w):
    f=ImageFont.truetype(SF,sz); f.set_variation_by_name(w); return f
def rounded(img,r):
    m=Image.new('L',img.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,img.width-1,img.height-1),r,fill=255); return m
def shadow(im,box,r,a=90,blur=44,dy=26):
    sh=Image.new('RGBA',im.size,(0,0,0,0)); x0,y0,x1,y1=box
    ImageDraw.Draw(sh).rounded_rectangle((x0,y0+dy,x1,y1+dy),r,fill=(60,35,30,a))
    return Image.alpha_composite(im,sh.filter(ImageFilter.GaussianBlur(blur)))
ICON=Image.open(M+'design/icone/H-meme-cadrage.png').convert('RGBA')
PW=int(W*0.74); PY=600; R=118; BZ=14

def screen(out,title,shot,pops,notif=None):
    im=Image.new('RGBA',(W,H),CREAM+(255,)); d=ImageDraw.Draw(im)
    for i,l in enumerate(title):
        f=font(96,'Bold'); w=d.textlength(l,font=f); d.text(((W-w)/2,250+116*i),l,font=f,fill=INK)
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
screen('v5-02',['Souvent, une seule','personne y pense.'],'onb1.png',[((40,1822,1280,1938),1.16,NUIT)])
screen('v5-03',['Vous listez tout ce qui','tourne dans vos têtes.'],'taches.png',[((56,848,1264,1040),1.14,CARD),((56,1052,1264,1240),1.14,CARD)])
screen('v5-04',['Mochi répartit,','équitablement.'],'dispatch.png',[((60,1330,1264,1600),1.14,CARD),((60,1610,1264,1880),1.14,CARD)])
screen('v5-05',['Chacun ses missions.','Plus besoin de relancer.'],'planning.png',[((40,960,1290,1080),1.16,CARD)],notif=('Vaisselle','C’est l’heure. 15 min suffisent.','20:30'))
screen('v5-06',['Et vous élevez Mochi,','ensemble.'],'chambre.png',[((1010,190,1270,300),1.9,CARD),((60,1300,1264,1515),1.16,CARD)])

fs=['v4-01','v5-02','v5-03','v5-04','v5-05','v5-06']
k=0.25; w,h=int(W*k),int(H*k); g=24
P=Image.new('RGB',(6*w+7*g,h+2*g),(226,220,212))
for i,f in enumerate(fs): P.paste(Image.open(O+f+'.png').resize((w,h)),(g+i*(w+g),g))
P.save(O+'planche-v5.png')
