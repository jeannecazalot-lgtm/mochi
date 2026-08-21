# Recette écran 23 · Point hebdo · malus (source : duo-embossed-pings-balance-malus.jsx › MalusEmbossed)

Écran poussé (depuis le lien « Point hebdo » de l'onglet Balance). SafeArea complète, ScrollView + CTA flottant.

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg `soft`.
2. ScreenHeader : bouton rond 38 retour · « MALUS » 11,5/600 tracking 1,6 · espace 38 à droite.
3. En-tête (padding 14 / 23) : PillLabel coral « POINT HEBDO · DIM. 12 » (jour calculé depuis `household.review_weekday`),
   titre « Tes petits malus. » 20/600 tracking −1, sous-titre 13,5/400 muted marge 6 interligne 18.
4. Card héros (padding top 13, marges 18, marge basse 10) : radius 20, **bordure 1,5 coral** (action attendue),
   padding 14/18 : Mochi vivant 56 `sad` · micro « POINTS DE MALUS » 10,5/600 tracking 1,4 coralDeep ·
   score 36/600 tracking −1,4 en count-up + « pts » 15/600 muted (baseline) · « cette semaine » 13/500.
   Jauge : 10 segments (= seuil) 4 px radius 2 gap 5, coral si < total sinon encre 10 % ; sous la jauge « 0 » / « SEUIL · 10 »
   10,5/600 muted.
5. « DÉTAIL » micro (padding 8 / 23 / 6) ; une OffsetCard par malus (accent butter / lavender décalé 3,4 à 35 %) :
   Card radius 14 padding 11/14 : emoji 19 · « Vaisselle du soir · ratée » 15,5/500 · « 2 fois · importance 2 » 12/400 muted ·
   pill sombre « +3 ».
6. Proposition (padding top 4) : OffsetCard accent sage décalé (4, 5) à 45 %, Card radius 16 padding 13/16 :
   rangée 💡 18 · « JEANNE TE PROPOSE » 12/600 tracking 0,4 sageDeep · « et on efface tout » 12/600 muted (marge basse 9) ;
   citation « “Massage 10 min ce week-end…” » 16,5/600 italique tracking −0,2 interligne 21 (marge basse 10) ;
   boutons : « Accepter » flex 1,4 encre / crème 14,5/600 radius 999 padding 8/14 (sans l'ombre 0 4 12 de l'artboard) ·
   « Refuser » flex 1 crème + hairline 14,5/500. Après choix : texte d'état 14/600 (sageDeep si accepté).
7. « OU PIOCHE UNE IDÉE » 10,5/600 micro (padding 22) ; puces crème + hairline radius 999 padding 8/10, 13/500,
   gap 5 en wrap ; sélectionnée = fond encre texte crème (choix local, `useState`).
8. CTA flottant (bottom 26, marges 18) : CTAPrimary big « On repart à zéro » → `router.back()` (remise à zéro locale
   pour l'instant, en attendant la table malus).
