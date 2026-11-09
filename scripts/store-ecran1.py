# Écran App Store 1 (recette du 10 nov 2026) : la vraie pièce de Mochi (rendue par l'app, sans interface),
# le titre sur crème au-dessus, UN élément d'interface en grand : la carte « Équilibré » de la répartition.
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

im=Image.new('RGBA',(W,H),CREAM+(255,))
# la pièce, agrandie de 18 % et recadrée au centre (Mochi au milieu), fondue en haut et en bas dans le crème
room=Image.open(B+'scene.png').convert('RGBA').crop((0,741,1320,2067))
k=1.0; room=room.resize((int(room.width*k),int(room.height*k)),Image.LANCZOS)
x0=(room.width-W)//2; room=room.crop((x0,0,x0+W,room.height))
mask=Image.new('L',room.size,255); md=ImageDraw.Draw(mask)
for i in range(160): md.line((0,i,W,i),fill=int(255*i/160))
for i in range(120): md.line((0,room.height-1-i,W,room.height-1-i),fill=int(255*i/120))
RY=700; im.paste(room,(0,RY),mask)
d=ImageDraw.Draw(im)
def center(y,t,f,fill):
    w=d.textlength(t,font=f); d.text(((W-w)/2,y),t,font=f,fill=fill)
center(330,'Partagez la charge mentale,',font(96,'Bold'),INK)
center(450,'en vous amusant.',font(96,'Bold'),INK)
# « Mindpair » en sticker collé sur le mur de la pièce (Jeanne, 10 nov 2026 : « plus en avant, en mode stickers »)
def sticker(txt,size,fill,angle):
    f=font(size,'Heavy'); d0=ImageDraw.Draw(Image.new('RGB',(1,1))); w=int(d0.textlength(txt,font=f)); h=int(size*1.25)
    sw=int(size*0.13); pad=sw+30
    t=Image.new('RGBA',(w+2*pad,h+2*pad),(0,0,0,0)); dt=ImageDraw.Draw(t)
    dt.text((pad,pad),txt,font=f,fill=fill,stroke_width=sw,stroke_fill=(255,255,255,255))
    t=t.rotate(angle,expand=True,resample=Image.BICUBIC)
    sh=Image.new('RGBA',t.size,(0,0,0,0)); sh.paste((50,30,30,110),(0,0),t.split()[3]); sh=sh.filter(ImageFilter.GaussianBlur(14))
    out=Image.new('RGBA',(t.width+20,t.height+30),(0,0,0,0)); out.alpha_composite(sh,(10,24)); out.alpha_composite(t,(0,0)); return out
st=sticker('Mindpair',210,INK+(255,),6)
im.alpha_composite(st,((W-st.width)//2+70,RY+380))
# la carte « Équilibré » (capture réelle de « Mochi a réparti »), en grand, à cheval sur le bas de la pièce
c=Image.open(B+'dispatch.png').convert('RGBA').crop((60,872,1260,1144)); pad=34
card=Image.new('RGBA',(c.width+2*pad,c.height+2*pad),(250,247,242,255)); card.paste(c,(pad,pad),c)
cx=(W-card.width)//2; cy=RY+room.height+30
im=shadow(im,(cx,cy,cx+card.width,cy+card.height),48)
im.paste(card,(cx,cy),rounded(card,48))
d=ImageDraw.Draw(im)
center(cy+card.height+90,'Mochi répartit les tâches du foyer entre vous deux.',font(46,'Medium'),INK+(170,))
im.convert('RGB').save(O+'v4-01.png')
im.convert('RGB').resize((440,956)).save('/private/tmp/claude-501/-Users-jeannecazalot-Desktop-mochi-kickoff/17a8d86e-cb64-456e-8b82-3e270de20b35/scratchpad/v4.png')
