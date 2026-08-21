# Recette écrans 24 + 25 · Wrapped solo & couple (source : duo-creme-gamifies.jsx › WrappedSoloCreme, WrappedCoupleCreme)

Un seul écran `app/wrapped.js`, stories plein écran sur fond sombre. Slides : 1 solo · 2 couple · 3 partage (CTA + fermer).

Couches, de l'arrière vers l'avant :
1. Fond encre `#1A1A1F` + 3 halos radiaux à 50 % d'opacité (coral 25 % en haut-gauche, lavender 22 % en bas-droite, butter 18 % en haut-droite) → `DarkBg` (extra.js). Status bar claire.
2. Barre stories : n segments (1 par slide) hauteur 3, radius 2, gap 5, marges 18, padding top 13 sous la safe area ;
   passés = crème `#FFFCF5`, courant = remplissage crème animé sur 5 s (withTiming linéaire), à venir = crème 25 %.
3. Zones tap : moitié gauche = slide précédente, moitié droite = slide suivante (sur la dernière → fermer). Pressable invisibles sous le contenu.
4. Slide solo (padding 26 haut, 26 côtés, centré) :
   - PillLabel butter « TA SEMAINE · SEM. {n} » (marge basse 11)
   - Mochi wink 110 (marge basse 9)
   - Héros 56/700 tracking −2,5, CountUp sur les minutes (fmtMin) ; l'artboard met un dégradé Mochi en texte →
     faute de MaskedView déclaré dans package.json, couleur pleine `#FBC9A4` (milieu du gradient Mochi).
   - Sous-titre 16/400 crème 70 %, marges 6 / 21.
   - Card crème radius 18 padding 17×18 (marges 22) : emoji 24 + titre 18/600 tracking −0,3 + sous-titre 13,5 muted.
   - 3 `DarkRow` (gap 6, marges 22) : fond crème 8 %, bord 0,5 crème 10 %, radius 14, padding 13×16 ;
     icône 19, label 15,5/500 crème 90 %, valeur 17/700 tracking −0,4 en CountUp.
   - Pied (bottom 28) : « Suite : votre semaine à deux → » 13/500 crème 50 %.
5. Slide couple (padding 31 haut) :
   - PillLabel lavender « VOTRE SEMAINE À DEUX » (marge basse 19)
   - Héros 54/700 : `{me}` sky · « / » crème 40 % 400 · `{partner}` lavender, chacun en CountUp.
   - Sous-titre 16/400 crème 70 % marges 9/9 ; légende « ● Prénom » 13/600 sky + lavender, gap 18, marge basse 20.
   - Card crème radius 18 : 🔥 + « {n} jours équilibrés » + record / prochain badge.
   - 3 DarkRow : lessive ×n · oubli −1 · coordination ≈2h.
   - Pied (bottom 24) : CTA gradient Mochi « Partager en stories » 16/600 radius 14 padding 17 (artboard) — dans cette
     implémentation le CTA de partage vit sur la slide 3 ; la slide 2 garde le pied « Suite : … » pour ne pas doubler.
6. Slide partage : Mochi happy 140, titre 22/600 crème, CTA « Partager en stories » (placeholder, pas d'action),
   « Fermer » 14/500 crème 60 % → `router.back()`.
Transitions : chaque slide entre en FadeIn 320 ms ; CountUp 500 ms relancé à chaque slide (clé = index).
