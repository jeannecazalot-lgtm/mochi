# Écran 2 App Store, version téléphone (Jeanne 10 nov 2026 : « je préfère avec mock up ») :
# la vraie diapo Insee de l'onboarding dans le téléphone, la ligne « +1h26 » qui ressort, même fond crème que l'écran 1.
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
im=Image.new('RGBA',(W,H),CREAM+(255,)); d=ImageDraw.Draw(im)
def center(y,t,f,fill):
    w=d.textlength(t,font=f); d.text(((W-w)/2,y),t,font=f,fill=fill)
center(250,'Souvent, une seule',font(96,'Bold'),INK); center(366,'personne y pense.',font(96,'Bold'),INK)
# téléphone : capture réelle, cadre fin, ombre douce
s=Image.open(B+'onb1.png').convert('RGBA'); PW=int(W*0.74); sc=PW/s.width; PH=int(s.height*sc); s=s.resize((PW,PH),Image.LANCZOS)
PX=(W-PW)//2; PY=600; R=118; BZ=14
im=shadow(im,(PX-BZ,PY-BZ,PX+PW+BZ,PY+PH+BZ),R+BZ)
bz=Image.new('RGBA',im.size,(0,0,0,0)); ImageDraw.Draw(bz).rounded_rectangle((PX-BZ,PY-BZ,PX+PW+BZ,PY+PH+BZ),R+BZ,fill=(24,24,30,255))
im=Image.alpha_composite(im,bz); im.paste(s,(PX,PY),rounded(s,R))
# la ligne « Chaque jour · +1h26 » qui ressort, agrandie, posée sur sa place
row=Image.open(B+'onb1.png').convert('RGBA').crop((40,1822,1280,1938)); k=sc*1.16
row=row.resize((int(row.width*k),int(row.height*k)),Image.LANCZOS); pad=34
card=Image.new('RGBA',(row.width+2*pad,row.height+2*pad),(46,33,64,255)); card.paste(row,(pad,pad),row)
cx=(W-card.width)//2; cy=int(PY+1880*sc-card.height/2)
im=shadow(im,(cx,cy,cx+card.width,cy+card.height),44,a=120,blur=34,dy=20); im.paste(card,(cx,cy),rounded(card,44))
im.convert('RGB').save(O+'v5-02.png')
im.convert('RGB').resize((440,956)).save('/private/tmp/claude-501/-Users-jeannecazalot-Desktop-mochi-kickoff/17a8d86e-cb64-456e-8b82-3e270de20b35/scratchpad/e2.png')
