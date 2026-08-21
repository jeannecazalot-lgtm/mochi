# Recette écran 34 · Aperçu notifications « lockscreen » (source : duo-embossed-modaux.jsx › NotifLockEmbossed)

Écran de démonstration plein écran, fond sombre. Couches :
1. Fond radial centré (50 %, 30 %) : `#3A3A42` → `#1A1A1F` 65 % → `#0A0A0F` 100 % (SVG RadialGradient plein écran).
   Texte crème `#FFFCF5`.
2. Barre d'état fictive padding 54 24 0 : « 9:41 » 15/500 à gauche ; « 5G » 11,5 + « ▮▮▮▯ » 13 à droite.
3. Bloc centré marge haute 21 : « 🔒 Verrouillé » 13/400 crème 60 % ; date longue 15/400 crème 70 % marge 10 ;
   heure 88/200 tracking −3 lineHeight 88 marge 3.
4. Widget marge 24 14 0 : fond crème 10 %, radius 18, padding 13×14, bordure 0,5 crème 8 %.
   En-tête gap 8 marge 6 : icône app 18×18 radius 5 gradient Mochi (lettre « m » 13/600 encre), kicker 11,5/600 tracking 1,2 crème 55 %,
   « maintenant » 11,5/400 crème 45 % à droite. Corps : titre 16/600 tracking −0,2 + sous-titre 13/400 crème 55 % marge 3 ;
   à droite 7 barres 4 px radius 2 hauteurs [10,14,16,18,12,20,16], crème 35 %, dernière `#F5A89A`, alignées en bas (hauteur 22).
5. Pile de notifs padding 14 14 0 gap 8 : card crème 10 %, radius 16, padding 11×14, bordure 0,5 crème 6 % ;
   en-tête idem (kicker 11,5/500 tracking 1) ; titre 15,5/500 ; corps 14/400 crème 78 % marge 3 lineHeight 19.
   Notif streak : fond sage 18 %, bordure sage 30 %, icône fond sage, kicker sage 85 % 600, titre 600, corps crème 85 %.
6. Bas d'écran (bottom 30, padding horizontal 28) : deux ronds 46 crème 10 % avec 🔦 et 📷.
7. Bouton retour (ajout mission) : en haut à gauche, dans la barre d'état fictive, « ‹ » crème.
Écarts : `backdrop-filter: blur(20px)` impossible sans expo-blur (non installé) → fonds translucides seuls ;
le ping utilise le preset `pings.reminder` (décision « zéro texte libre ») au lieu de la phrase libre de l'artboard ;
« DUO » devient le nom de l'app (copy.common.mochi) ; chiffres (streak, écart, durée) depuis demo.js / demo-modaux.js.
