# Recette écran 22 · Balance détail (source : duo-embossed-pings-balance-malus.jsx › BalanceDetailEmbossed)

Écran poussé depuis l'onglet Balance. SafeArea complète, ScrollView + CTA flottant.

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg `soft`.
2. ScreenHeader (padding 14 / 18) : bouton rond 38 crème + hairline avec flèche SVG (stroke 1,8) → `router.back()` ;
   titre « DÉTAIL » 11,5/600 tracking 1,6 uppercase centré ; à droite, espace 38 (le « ··· » de l'artboard n'a pas d'action).
3. En-tête (padding 14 / 23) : PillLabel d'état (sageDeep si équilibré, coral sinon) « DÉSÉQUILIBRE · 28% D'ÉCART »
   (ou « Équilibré · 4% d'écart »), puis titre 22/600 tracking −1 interligne 22 sur deux lignes
   (« Jeanne porte plus / cette semaine. » ou « Vous portez autant / cette semaine. »).
4. Card héros (padding top 17, marges 18, radius 20, padding 18) :
   - une colonne par membre : prénom 11,5/600 uppercase tracking 0,4 couleur deep du slot ; temps 22/600 tracking −1,2
     en count-up ; « 36% · 9 tâches » 13/400 muted ;
   - barre scindée 10 px radius 5, piste encre 6 % + hairline, segments couleur de slot animés 600 ms ;
   - si non équilibré : encart coral 10 % radius 10 padding 8/10 : ⚠️ 15 + « Si ça dure 2 semaines : » 13,5/500
     + « Mochi suggérera un re-dispatch. » en 700.
5. Bloc « 7 DERNIERS JOURS » / « en min/jour » (micro, padding 0 4 8) : Card radius 16 padding 14, zone 90 px ;
   7 colonnes flex 1 ; dans chacune, une barre verticale 8 px par membre (gap 5, hauteur max 70, coins hauts radius 3,
   couleur de slot, hauteur = minutes / max de la semaine, animée 600 ms, décalage 40 ms/jour) ; lettre 11,5/600 muted.
6. « CE QUI PÈSE » micro (padding 8 / 23) ; une OffsetCard par contributeur (marge basse 6) : aplat couleur d'accent
   décalé (3, 4) à 35 % sous une Card radius 14 padding 9/13 : emoji 19 · titre 15,5/500 · sous-titre 12/400 muted ·
   « +58 min » 13/600 coralDeep · Avatar 24 du membre concerné.
7. CTA flottant (bottom 26, marges 18) : gradient Mochi radius 14 padding 14/18, rangée ✨ 18 · « Rééquilibrer avec Mochi »
   15/600 · › 18 ; ombre `shadows.cta` (l'artboard met 0 4 16 pêche 32 %, hors système) → `/(setup)/dispatch`.
