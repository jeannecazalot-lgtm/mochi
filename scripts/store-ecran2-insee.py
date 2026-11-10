# Écran 2 App Store (Insee) : texte seul sur feutre, Mochi triste en bas, visage visible (Jeanne, 10 nov 2026).
from PIL import Image, ImageDraw, ImageFont
M='/Users/jeannecazalot/mochi/'; B=M+'design/app-store/brut/'; O=M+'design/app-store/'
W,H=1320,2868; INK=(31,42,88)
SF='/System/Library/Fonts/SFNS.ttf'
def font(sz,w):
    f=ImageFont.truetype(SF,sz); f.set_variation_by_name(w); return f
base=Image.new('RGB',(W,H),(0xF3,0xEA,0xDF)); felt=Image.open(M+'assets/splash/feutre.jpg').convert('RGB').resize((H,H))
lay=base.copy(); lay.paste(felt,((W-H)//2,0)); im=Image.blend(base,lay,0.55).convert('RGBA'); d=ImageDraw.Draw(im)
def c(y,t,f,fill):
    w=d.textlength(t,font=f); d.text(((W-w)/2,y),t,font=f,fill=fill)
c(220,'Dans la plupart des couples,',font(66,'Medium'),INK+(190,)); c(304,'l’un des deux porte',font(66,'Medium'),INK+(190,))
c(430,'+1h26',font(330,'Bold'),INK); c(800,'par jour, en plus.',font(92,'Bold'),INK)
y=1010
for t,v in [('Chaque semaine','≈ 10 h'),('Sur l’année','≈ 260 h')]:
    d.line((170,y,W-170,y),fill=INK+(40,),width=3); d.text((170,y+40),t,font=font(60,'Medium'),fill=INK+(190,))
    fv=font(60,'Bold'); w=d.textlength(v,font=fv); d.text((W-170-w,y+40),v,font=fv,fill=INK); y+=150
d.line((170,y,W-170,y),fill=INK+(40,),width=3)
c(y+60,'De tâches domestiques et d’organisation.',font(48,'Medium'),INK+(150,))
c(y+135,'Insee · Enquête emploi du temps',font(40,'Medium'),INK+(120,))
m=Image.open(M+'assets/splash/mochi-happy.png').convert('RGBA'); mw=int(W*1.3); m=m.resize((mw,int(mw*m.height/m.width)),Image.LANCZOS)
im.alpha_composite(m,((W-mw)//2,1660))  # Mochi géant qui monte du bas, comme l'écran d'ouverture (référence Jeanne 10 nov)
im.convert('RGB').save(O+'v6-02.png')
im.convert('RGB').resize((440,956)).save('/private/tmp/claude-501/-Users-jeannecazalot-Desktop-mochi-kickoff/17a8d86e-cb64-456e-8b82-3e270de20b35/scratchpad/e2.png')
