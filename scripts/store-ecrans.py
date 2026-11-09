# Captures App Store v4 (10 nov 2026, grille validée par Jeanne sur l'écran 1) :
# sticker « Mindpair » en haut · titre (textes « d'avant ») · la vraie pièce de Mochi (scene-capture, sans interface)
# · UN élément de l'app en grand, calé au même endroit · une phrase qui explique. Fond crème, pièce qui change d'ambiance.
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M='/Users/jeannecazalot/mochi/'; B=M+'design/app-store/brut/'; O=M+'design/app-store/'
W,H=1320,2868; INK=(31,42,88); CREAM=(245,241,234)
SF='/System/Library/Fonts/SFNS.ttf'
def font(sz,w):
    f=ImageFont.truetype(SF,sz); f.set_variation_by_name(w); return f
def rounded(img,r):
    m=Image.new('L',img.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,img.width-1,img.height-1),r,fill=255); return m
def shadow(im,box,r,a=90,blur=40,dy=22):
    sh=Image.new('RGBA',im.size,(0,0,0,0)); x0,y0,x1,y1=box
    ImageDraw.Draw(sh).rounded_rectangle((x0,y0+dy,x1,y1+dy),r,fill=(60,35,30,a))
    return Image.alpha_composite(im,sh.filter(ImageFilter.GaussianBlur(blur)))
def sticker(txt,size,fill,angle):
    f=font(size,'Heavy'); d0=ImageDraw.Draw(Image.new('RGB',(1,1))); w=int(d0.textlength(txt,font=f)); h=int(size*1.25)
    sw=int(size*0.13); pad=sw+30
    t=Image.new('RGBA',(w+2*pad,h+2*pad),(0,0,0,0)); ImageDraw.Draw(t).text((pad,pad),txt,font=f,fill=fill,stroke_width=sw,stroke_fill=(255,255,255,255))
    t=t.rotate(angle,expand=True,resample=Image.BICUBIC)
    sh=Image.new('RGBA',t.size,(0,0,0,0)); sh.paste((50,30,30,110),(0,0),t.split()[3]); sh=sh.filter(ImageFilter.GaussianBlur(14))
    out=Image.new('RGBA',(t.width+20,t.height+30),(0,0,0,0)); out.alpha_composite(sh,(10,24)); out.alpha_composite(t,(0,0)); return out
STICKER=sticker('Mindpair',220,INK+(255,),-4)
RY=820; CARD_BOTTOM=H-300; CAPTION_Y=H-210; CARD_MAX_H=450

def screen(out,title,scene,crop_file,crop_box,caption,card_bg=(250,247,242)):
    im=Image.new('RGBA',(W,H),CREAM+(255,))
    room=Image.open(B+f'{scene}.png').convert('RGBA').crop((0,741,1320,2067))
    mask=Image.new('L',room.size,255); md=ImageDraw.Draw(mask)
    for i in range(160): md.line((0,i,W,i),fill=int(255*i/160))
    for i in range(120): md.line((0,room.height-1-i,W,room.height-1-i),fill=int(255*i/120))
    im.paste(room,(0,RY),mask)
    im.alpha_composite(STICKER,((W-STICKER.width)//2,150))
    d=ImageDraw.Draw(im)
    def center(y,t,f,fill):
        w=d.textlength(t,font=f); d.text(((W-w)/2,y),t,font=f,fill=fill)
    for i,l in enumerate(title): center(560+108*i,l,font(84,'Bold'),INK)
    c=Image.open(B+crop_file).convert('RGBA').crop(crop_box)
    k=min(1.0,CARD_MAX_H/c.height,(W-140)/c.width); c=c.resize((int(c.width*k),int(c.height*k)),Image.LANCZOS)
    pad=34; card=Image.new('RGBA',(c.width+2*pad,c.height+2*pad),card_bg+(255,)); card.paste(c,(pad,pad),c)
    cx=(W-card.width)//2; cy=CARD_BOTTOM-card.height
    im=shadow(im,(cx,cy,cx+card.width,cy+card.height),48)
    im.paste(card,(cx,cy),rounded(card,48))
    d=ImageDraw.Draw(im); center(CAPTION_Y,caption,font(46,'Medium'),INK+(170,))
    im.convert('RGB').save(O+out+'.png')

S=[('v4-01',['Partagez la charge mentale,','en vous amusant.'],'scene','dispatch.png',(60,872,1260,1144),'Mochi répartit les tâches du foyer entre vous deux.'),
   ('v4-02',['Souvent, une seule','personne y pense.'],'scene-triste','onb1.png',(0,1800,1320,2250),'Le travail invisible du foyer, chiffré par l’Insee.',(46,33,64)),
   ('v4-03',['Vous listez tout ce qui','tourne dans vos têtes.'],'scene-surpris','taches.png',(56,848,1264,1240),'Chacun coche sur son téléphone, l’autre le voit en direct.'),
   ('v4-04',['Mochi répartit,','équitablement.'],'scene-clin','dispatch.png',(60,1320,1264,1860),'Selon vos dispos et ce que chacun préfère.'),
   ('v4-05',['Chacun ses missions.','Plus besoin de relancer.'],'scene-nuit','planning.png',(40,690,1290,1090),'Mindpair rappelle les missions. Pas l’autre.'),
   ('v4-06',['Et vous élevez Mochi,','ensemble.'],'scene-pleine','chambre.png',(60,1300,1264,1515),'Chaque mission cochée rapporte des perles pour sa pièce.')]
for s in S: screen(*s)
sc=0.25; w,h=int(W*sc),int(H*sc); g=24
P=Image.new('RGB',(6*w+7*g,h+2*g),(226,220,212))
for i,s in enumerate(S): P.paste(Image.open(O+s[0]+'.png').resize((w,h)),(g+i*(w+g),g))
P.save(O+'planche-v4.png')
