# Mochi v2 — recette du personnage (14 sept 2026, proto `/proto-mochi`)

Suite à la revue ChatGPT du 14 sept (design/mochi-personnage/revue-2026-09-14). Objectif : un Mochi qui
appartient à l'univers Embossed Crème (mat, plat, filets fins), lisible à 34 px, dont l'inclinaison se voit.

## Couches (viewBox 220 × 220, base posée à y = 190)
1. **Corps** : un galet asymétrique, plus large en bas qu'en haut (largeur 160 à y = 150, 120 à y = 60), sommet
   arrondi, base légèrement aplatie. Path unique, pas de cercle.
2. **Matière** selon la variante :
   - **A · galet corail mat** : dégradé vertical `#F4B59F → #E89B85 → #DC8B75`, un seul reflet diffus (ellipse
     radiale blanche 22 % → 0) en haut à gauche. Pas de liseré, pas de point de brillance.
   - **B · perle crème** : dégradé vertical `#FFFBF4 → #F3E5D8`, teinte corail 18 % diffuse sur le flanc droit,
     filet `rgba(26,26,31,0.10)` de 1,5 pour se détacher du fond crème.
   - **C · élastique plat** : aplat `#EFA28C` sans reflet, bande d'ombre interne au pied (`#DC8B75` 35 % → 0).
     L'inclinaison déforme le corps (cisaillement) au lieu de le tourner.
3. **Visage** bas sur le corps : yeux ronds r = 4,6 à (90,118) et (130,118), bouche trait 3,4, encre `#1A1A1F`.
   Cinq états : content · neutre · triste · endormi · clin d'œil. Le visage glisse de 4 px du côté de l'inclinaison.
4. **Inclinaison** `lean` ∈ [−1, 1] : rotation de 10° autour du centre de la base (A, B) ; cisaillement de 10° + 4° de
   rotation (C). La base reste posée, le sommet bascule.

## Ce qui disparaît par rapport à v1
Sphère parfaite, halo externe, liseré arc-en-ciel, reflet dur + deux points blancs, rotation autour du centre.

## Validation
Captures simulateur à 120 px (3 inclinaisons) et 34 px (5 états) pour chaque variante, plus l'actuel en référence.

## Révision du 14 sept au soir — le dôme (image de référence envoyée par Jeanne)
Le galet « œuf » n'a pas plu (« ça me va pas en fait »). Nouvelle forme d'après son image : un mochi **posé**,
bien plus large que haut (≈ 176 × 106 dans la boîte 220), sommet en dôme, flancs bombés, **base plate à coins
arrondis (r ≈ 16)**. Visage petit et bas (yeux à y = 158, r 4,4 ; bouche à 174-181). Matière v1 conservée :
dégradé corail chaud centré en haut à gauche, un reflet net + un voile diffus, liseré sauge → beurre → corail.
Cadrage serré (viewBox 0 82 220 118) : la boîte du composant fait 118/220 de la largeur. Inclinaison :
cisaillement 10° + 3° de rotation depuis le centre de la base (le sommet bascule, la base reste posée).
Respiration : ±2,5 % en largeur, −4,5 % en hauteur, 1,6 s aller, depuis la base.
