# Captures App Store en anglais (13 nov 2026) : mêmes mises en scène que les captures françaises
# (store-ecran1.py → écran 1, store-ecran2-insee.py → écran 2, store-v7.py → écrans 3 à 6),
# textes adaptés (pas traduits mot à mot), captures brutes de l'app en anglais dans design/app-store/brut-en/
# (Metro lancé avec EXPO_PUBLIC_CAPTURE=1 EXPO_PUBLIC_LANG=en). Sortie : design/app-store/en/en-01 … en-06.
import os, re
M = '/Users/jeannecazalot/mochi/'
os.makedirs(M + 'design/app-store/en', exist_ok=True)

COMMON = [
    ("B=M+'design/app-store/brut/'", "B=M+'design/app-store/brut-en/'"),
    ("O=M+'design/app-store/'", "O=M+'design/app-store/en/'"),
]
SCRIPTS = {
    'store-ecran1.py': [
        ("'Partagez la charge mentale,'", "'Share the mental load.'"),
        ("'en vous amusant.'", "'Have fun doing it.'"),
        ("'Mochi répartit les tâches du foyer entre vous deux.'", "'Mochi splits the chores between the two of you.'"),
        ("O+'v6-01.png'", "O+'en-01.png'"),
    ],
    'store-ecran2-insee.py': [
        ("'Dans la plupart des couples,'", "'In the U.S., women spend'"),
        ("'l’un des deux porte'", "'on average'"),
        ("c(430,'+1h26',font(330,'Bold'),INK)", "c(430,'+55 min',font(300,'Bold'),INK)"),
        ("'par jour, en plus.'", "'more a day than men.'"),
        ("('Chaque semaine','≈ 10 h')", "('Every week','≈ 6 hrs')"),
        ("('Sur l’année','≈ 260 h')", "('Over a year','≈ 335 hrs')"),
        ("'De tâches domestiques et d’organisation.'", "'Of housework and family care.'"),
        ("'Insee · Enquête emploi du temps'", "'U.S. Bureau of Labor Statistics · Time Use Survey 2024'"),
        ("O+'v6-02.png'", "O+'en-02.png'"),
    ],
    'store-v7.py': [
        ("['Préparez vos missions','à deux.'],'Tout est listé : moins de charge mentale.'", "['Plan your tasks','together.'],'Get it all down. Carry less in your head.'"),
        ("pill='Synchronisé en direct'", "pill='Synced live'"),
        ("['Partagées','équitablement.'],'Selon vos envies, vos besoins, vos dispos.'", "['Split','fairly.'],'Based on your likes, your needs, your time.'"),
        ("['Chaque mission cochée','nourrit Mochi.'],'Moins de prises de tête, vous avancez ensemble.'", "['Every task you check off','feeds Mochi.'],'Less nagging. More teamwork.'"),
        ("['Mochi grandit','avec vous.'],'Chaque mission rapporte des perles pour sa pièce.'", "['Mochi grows','with you.'],'Every task earns pearls for his room.'"),
        ("label='+3 perles'", "label='+3 pearls'"),
        ("O+'v7-03.png'", "O+'en-03.png'"), ("O+'v7-04.png'", "O+'en-04.png'"),
        ("O+'v7-05.png'", "O+'en-05.png'"), ("O+'v7-06.png'", "O+'en-06.png'"),
        ("fs=['v6-01','v6-02','v7-03','v7-04','v7-05','v7-06']", "fs=['en-01','en-02','en-03','en-04','en-05','en-06']"),
        ("P.save(O+'planche-v7.png')", "P.save(O+'planche-en.png')"),
    ],
}
for name, reps in SCRIPTS.items():
    src = open(M + 'scripts/' + name).read()
    src = re.sub(r"^.*scratchpad.*$", '', src, flags=re.M)  # aperçus temporaires des scripts d'origine
    for a, b in COMMON + reps:
        assert a in src, (name, a)
        src = src.replace(a, b)
    # la pièce sans interface (scene.png) est la même dans les deux langues
    src = src.replace("Image.open(B+'scene.png')", "Image.open(M+'design/app-store/brut/scene.png')")
    exec(compile(src, name, 'exec'), {'__name__': '__main__'})
    print('ok', name)
