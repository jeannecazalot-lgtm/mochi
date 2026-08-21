# Recette écrans 01-05 · Onboarding (sources : duo-embossed-onboarding.jsx › OnbEmbossed01-04, duo-v2-iridescent-iter3.jsx › OnboardingEmbossed)

Un seul écran `app/onboarding/index.js` : FlatList horizontale paginée (1 slide = largeur écran),
en-tête et pied **fixes** par-dessus le pager, chaque slide porte son propre fond.

## Commun (toutes les slides)
1. Fond `#FAFAF7` + GlowBg : intensité `strong` (01, 03, 05) / `soft` (02, 04), comme l'artboard.
2. En-tête fixe (padding 14 23 0) : 5 barres 18×4 radius 2, gap 5, encre si ≤ slide courante sinon encre 10 % ;
   à droite « Passer » 13/500 muted (slides 1-4 seulement, zone de tap 44).
3. Pastille d'étape : `PillLabel` coral (uppercase 9,5/600 tracking 1,4, fond coral 16 %), marge basse 14.
4. Pied fixe : CTA gradient Mochi radius 14, padding vertical 17, texte 16/600 encre, ombre 0 1 2 encre 6 %,
   posé directement sur le fond (bottom = max(inset, 24), marges 18). Pas de footer blanc (comme l'artboard).
5. Ligne de source (01, 03) : 54 px au-dessus du CTA, marges 22 : tiret 14×1 muted 50 % + texte 11/500 uppercase tracking 1,2 muted.
6. Transition : scroll horizontal natif paginé ; chiffre héros de la slide courante en CountUp 500 ms (remonté à chaque passage).

## 01 · Le constat (padding 22 23 0)
- Card héros : ombre d'accent = rectangle plein `#F5A89A` (= 3e stop du gradient Mochi) opacité 0,55 radius 22 décalé (+6, +8) ;
  par-dessus Card crème radius 22 hairline, padding 22 23 18.
  - kicker 10,5/600 uppercase tracking 1,5 muted, marge 6 ;
  - chiffre 92/700 tracking −5 lineHeight 81 (0,88) + « /sem. » 20/500 italique coral, alignés baseline, gap 6 ;
  - séparateur 1 px ligne (marge 14, padding 12) puis barre 6 px radius 3 fond encre 5 % : 70 % gradient 90° `#F5A89A`→coral, 30 % encre 12 % ;
    à droite « +1h26/jour » 11,5/500 muted, gap 8.
- Titre 20/600 tracking −0,8 lineHeight 24, dernière ligne coral ; marge 10.
- Corps 14,5/400 inkSoft lineHeight 22, fin en italique.

## 02 · La charge mentale (padding 19 23 0)
- Titre 22/600 tracking −1 lineHeight 23, « Faire » et « Y penser » coral ; marge 16.
- Kicker 11,5/600 uppercase tracking 1,4 muted, marge 10.
- 5 bulles : Card crème radius 12 hairline, padding 11 13, rotation alternée +0,3° / −0,4°, gap 6 ;
  emoji 18, titre 15/500 tracking −0,1, heure 12/400 muted.
- Bulle fondue : fond crème 55 % radius 12 padding 8 13, emoji 16 opacité 0,5, texte 14/400 muted.
- « ··· » 19/600 tracking 4 muted 55 % centré, marge haute −2.
- Sortie 15/400 italique inkSoft, « la charge mentale. » 600 droit encre ; marge haute 11.

## 03 · À un an (padding 22 23 0)
- Card héros : ombre d'accent sage opacité 0,55 radius 22 décalée (−5, +7) ; Card crème radius 22 padding 22 23 18.
  - kicker idem 01 ; chiffre 80/700 tracking −4 lineHeight 70 + « /an » 21/500 italique coral ;
  - sous-texte 15/400 inkSoft lineHeight 20, « 11 jours pleins, » coral 600 ; marge haute 11.
- Kicker « Ça pourrait être : » 11,5/600 uppercase, marge 9.
- 3 rangées, gap 8 : ombre d'accent (butter / lavender / sky) opacité 0,4 radius 14 décalée (+3, +4) ;
  Card crème radius 14 padding 11 14 ; « ×100 » 20/700 italique coral tracking −0,8 largeur min 56 ; libellé 14,5/500 lineHeight 19.

## 04 · Au-delà du temps (padding 19 23 0)
- Titre 22/600 tracking −1 lineHeight 23, « épargne » coral ; marge 14.
- Registre : Card crème radius 18 padding 14 16 13.
  - en-tête « ÉVITÉ » / « ~ / AN » 10,5/600 tracking 1,4 encre, bord bas 1,5 encre, padding bas 8, marge 6 ;
  - 5 rangées padding 9 0, bord bas 1 px encre 8 % (dernière : 1,5 encre) ; libellé 14,5/400 ;
    valeur 19 tracking −0,4 : accent = 700 italique coral, sinon 500 muted ;
  - total : padding haut 12, « Couple qui respire » 15/600 italique, « +1 » 22/700 tracking −1 sage.
- Note 11/400 muted tracking 0,4 lineHeight 16, marge haute 10.

## 05 · Bienvenue
- Mochi vivant 210 centré (marge haute 24, marge basse 29).
- Card crème radius 22 padding 24, marges 22, centrée : PillLabel coral « BIENVENUE » (marge 14),
  titre 22/600 tracking −1,2 lineHeight 23 (marge 11), corps 15,5/400 inkSoft lineHeight 23.
- CTA « Commencer → » → `router.replace('/(setup)/identite')`.
- Écarts : pas de « Passer » ni de « DUO ● » en en-tête (les 5 barres servent de pagination) ;
  les 4 points bas de l'artboard (dessinés pour une slide 1/4) sont omis, redondants avec les barres.
