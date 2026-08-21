# Recette écran 32 · Pense-bête (source : duo-embossed-modaux.jsx › PenseBeteEmbossed)

Plein écran (route hors onglets → bouton retour à la place de la tab bar). Couches :
1. Fond `#FAFAF7` + GlowBg `soft`.
2. En-tête padding 14 23 0 : à gauche PillLabel lavender « LE CERVEAU EXTERNE » (marge 6) puis titre 22/600 tracking −1 ;
   à droite bouton « + » 36×36 rond encre, glyphe 21/300 crème, ombre `0 4 12 encre 20 %` (seule ombre de l'écran, artboard).
   Bouton retour « ‹ » 36×36 crème hairline placé avant le pill (ajout mission), pill Duo+ à côté du eyebrow.
3. Recherche padding 14 18 13 : pilule crème radius 999 hairline padding 10×14, loupe 15 à 60 %, TextInput 14,5/400 muted,
   compteur « N NOTES » 11/600 tracking 0,5 muted tabulaire.
4. Zone d'ajout (visible après « + ») : card crème radius 14, deux TextInput (titre 16/600, détail 12/400) + CTA modal « Ajouter ».
5. Grille 2 colonnes gap 10 padding horizontal 18 : sticky note fond pastel (butterLight / skyLight / lavenderLight / peach /
   sageLight en rotation), radius 14, padding 13×14, hauteur min 92, rotation −0,8° (pair) / +0,6° (impair), hairline ;
   « scotch » 28×10 blanc 50 % hairline, top −5, centré, rotation −2° ; titre 16/600 tracking −0,2 marge haute 4 ;
   détail 12/400 encre 65 % marge 4. Note cochée (tap) : opacité 0,45 + titre barré (animation check 350 ms).
Écarts : tab bar de l'artboard remplacée par un retour ; notes cochables + ajout local (mission) absents de l'artboard.
