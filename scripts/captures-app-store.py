from PIL import Image, ImageDraw, ImageFont, ImageFilter
M='/Users/jeannecazalot/mochi/'; B=M+'design/app-store/brut/'; O=M+'design/app-store/'
W,H=1320,2868; INK=(31,42,88); CREAM=(0xF3,0xEA,0xDF)
SF='/System/Library/Fonts/SFNS.ttf'
def font(sz,w):
    f=ImageFont.truetype(SF,sz); f.set_variation_by_name(w); return f
def bg():
    base=Image.new('RGB',(W,H),CREAM); felt=Image.open(M+'assets/splash/feutre.jpg').convert('RGB').resize((H,H))
    lay=base.copy(); lay.paste(felt,((W-H)//2,0)); return Image.blend(base,lay,0.55).convert('RGBA')
def text_c(d,y,lines,f,fill,lh):
    for l in lines:
        w=d.textlength(l,font=f); d.text(((W-w)/2,y),l,font=f,fill=fill); y+=lh
    return y
def shadow(im,box,r,a=70,blur=40,dy=24):
    sh=Image.new('RGBA',im.size,(0,0,0,0)); x0,y0,x1,y1=box
    ImageDraw.Draw(sh).rounded_rectangle((x0,y0+dy,x1,y1+dy),r,fill=(70,45,30,a))
    return Image.alpha_composite(im,sh.filter(ImageFilter.GaussianBlur(blur)))
def rounded(img,r):
    m=Image.new('L',img.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,img.width-1,img.height-1),r,fill=255); return m
def header(im,title,sub=None,y=210):
    d=ImageDraw.Draw(im)
    y=text_c(d,y,title,font(104,'Bold'),INK,122)
    if sub: y=text_c(d,y+20,sub,font(50,'Medium'),INK+(165,),66)
    return y
def phone(im,shot,y,scale=0.78,crop_bottom=None):
    s=Image.open(B+shot).convert('RGBA'); pw=int(W*scale); ph=int(pw*s.height/s.width); s=s.resize((pw,ph),Image.LANCZOS)
    px=(W-pw)//2; py=y; r=104
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
    im=shadow(im,(x,y,x+card.width,y+card.height),r,a=95,blur=30,dy=16)
    im.paste(card,(x,y),rounded(card,r)); return im
def mochi(face,w):
    m=Image.open(M+f'assets/splash/mochi-{face}.png').convert('RGBA'); return m.resize((w,int(w*m.height/m.width)),Image.LANCZOS)

# 1 · branding
im=bg(); d=ImageDraw.Draw(im)
text_c(d,520,['Mindpair'],font(190,'Bold'),INK,0)
text_c(d,770,['La charge mentale,','à deux.'],font(78,'Medium'),INK+(190,),96)
m=mochi('happy',int(W*1.5)); im.alpha_composite(m,((W-m.width)//2,H-int(m.height*0.78)))
im.convert('RGB').save(O+'01-mindpair.png')

# 2 · Insee
im=bg(); d=ImageDraw.Draw(im)
text_c(d,330,['Dans la plupart des couples,','l’un des deux porte'],font(66,'Medium'),INK+(190,),84)
text_c(d,560,['+1h26'],font(330,'Bold'),INK,0)
text_c(d,930,['par jour, en plus.'],font(92,'Bold'),INK,0)
y=1160
rows=[('Chaque semaine','≈ 10 h'),('Sur l’année','≈ 260 h')]
fr=font(60,'Medium'); fv=font(60,'Bold')
for t,v in rows:
    d.line((170,y,W-170,y),fill=INK+(40,),width=3)
    d.text((170,y+40),t,font=fr,fill=INK+(190,)); w=d.textlength(v,font=fv); d.text((W-170-w,y+40),v,font=fv,fill=INK); y+=150
d.line((170,y,W-170,y),fill=INK+(40,),width=3)
text_c(d,y+70,['De tâches domestiques','et d’organisation.'],font(50,'Medium'),INK+(150,),66)
text_c(d,y+250,['Insee · Enquête emploi du temps'],font(40,'Medium'),INK+(120,),0)
m=mochi('neutral',int(W*0.9)); im.alpha_composite(m,((W-m.width)//2,H-int(m.height*0.42)))
im.convert('RGB').save(O+'02-insee.png')

# 3 · choix à deux
im=bg(); y=header(im,['Vous choisissez','vos missions.'],['Ensemble, chacun sur son téléphone.'])
im,g=phone(im,'taches.png',y+110)
im=pop(im,'taches.png',(56,848,1264,1040),g)
im=pop(im,'taches.png',(56,1052,1264,1240),g)
im.convert('RGB').save(O+'03-choix.png')

# 4 · répartition
im=bg(); y=header(im,['Mochi répartit.'],['Équitablement, selon vos dispos.'])
im,g=phone(im,'dispatch.png',y+110)
im=pop(im,'dispatch.png',(60,872,1260,1144),g,zoom=1.16)
im.convert('RGB').save(O+'04-repartition.png')

# 5 · jeu : l'accueil
im=bg(); y=header(im,['Chaque mission','cochée nourrit Mochi.'])
im,g=phone(im,'accueil.png',y+110)
im=pop(im,'accueil.png',(40,1170,1280,1260),g,zoom=1.16)
im=pop(im,'accueil.png',(740,225,990,320),g,zoom=1.5,r=50)
im.convert('RGB').save(O+'05-jeu.png')

# 6 · jeu : la pièce
im=bg(); y=header(im,['Gagnez des perles.','Décorez sa pièce.'])
im,g=phone(im,'chambre.png',y+110)
im=pop(im,'chambre.png',(60,2440,1264,2650),g,zoom=1.16)
im.convert('RGB').save(O+'06-piece.png')

# planche
fs=['01-mindpair','02-insee','03-choix','04-repartition','05-jeu','06-piece']
s=0.25; w,h=int(W*s),int(H*s); g=30
P=Image.new('RGB',(6*w+7*g,h+2*g),(232,226,216))
for i,f in enumerate(fs): P.paste(Image.open(O+f+'.png').resize((w,h)),(g+i*(w+g),g))
P.save(O+'planche.png')
