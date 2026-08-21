# Recette écran 30 · Événement social (source : duo-embossed-modaux.jsx › EventSocialEmbossed)

Présentation modale (sheet). Couches, de l'arrière vers l'avant :
1. Scrim : fond `#FAFAF7` + GlowBg `soft`, puis voile encre 35 % (l'artboard montre l'écran derrière dimmé à 0,35) ;
   tap sur le scrim = `router.back()`.
2. Sheet collée en bas : fond `#FAFAF7`, **radius haut 26** (README ; l'artboard dit 24), séparation `0 -1px encre 8 %`
   (rendue en RN par un trait 1 px `sheetLine` au-dessus), padding 12 0 28, hauteur max 82 %.
   Grabber 44×5 encre 18 %, radius 3, centré, marge basse 12. Contenu padding horizontal 22.
3. Ligne eyebrow : PillLabel lavender « ● ÉVÉNEMENT SOCIAL » à gauche, « Annuler » 14/600 muted à droite ; marge basse 11.
4. Hero card « embossed » : ombre décalée = rectangle lavender `#B8A5D9` opacité 0,45 translaté (4, 5) sous la card,
   card crème radius 20 hairline, padding 17×18. À gauche tuile 54×54 radius 16 fond `#E2D6F0` hairline avec emoji 22 ;
   à droite titre 20/600 tracking −0,7 (TextInput) + sous-titre 13,5/400 muted marge 4 (TextInput). Marge basse 14.
5. Micro-label « QUI PORTE QUOI » 11,5/600 tracking 1,4 muted uppercase, marge basse 9.
   Card crème radius 16 padding vertical 6 : rangées padding 11×16, gap 13, séparées 1 px encre 6 % ;
   avatar 24 (initiale 12/600 blanc, couleur du slot ; tap = bascule V/J), libellé 15/500 flex, durée 13/500 muted tabulaire.
   Marge basse 14.
6. Deux cards côte à côte (gap 8) : ombre décalée butter 0,40 / sky 0,35 translatée (3, 4), card radius 14 padding 13×14 ;
   micro-label 10,5/600 tracking 1,2 marge 6 ; « 40€ » 20/700 tracking −0,8 tabulaire (TextInput) + « → Budget » 11,5/400 muted marge 3 ;
   « Casual chic » 16/600 tracking −0,2 (TextInput) + note 11,5/400 muted italique marge 3 (TextInput). Marge basse 16.
7. CTA modal : pilule radius 999, gradient Mochi, padding 14×18, texte 15,5/600 encre, ombre `0 4 16 rgba(245,168,154,.32)`
   (variante propre aux modaux, ≠ CTAPrimary radius 14). Tap → `router.back()`.
Écarts : « → Tricount » devient « → Budget » (module de l'app) ; radius sheet 26 (README) au lieu de 24 ; champs saisissables
(la mission demande des champs locaux, l'artboard est statique).
