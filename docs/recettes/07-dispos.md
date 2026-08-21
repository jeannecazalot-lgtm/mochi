# Recette écran 07 · Setup B — Dispos & énergie (source : duo-v3-setup.jsx › SetupDisposV3)

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg `soft`.
2. `SetupHeader` étape 2/3 (mêmes cotes que 06) : titre « Tes dispos & ton énergie. », sous-titre explicatif du tap-cycle.
3. Bloc padding 18 23 0. Card crème radius 18, hairline, padding 14×16 :
   - grille 8 colonnes : colonne label 44 px + 7 jours flex 1, gap 5 ;
   - en-tête jours 10,5/600 tracking 1, muted sauf S et D en encre ;
   - lignes MATIN / SOIR (11/600 tracking 0,8 muted), cellules hauteur 34 radius 10 :
     · 0 = crème + bord intérieur 1,5 encre 10 % (vide) · 1 = sage 35 % + hairline, glyphe « ○ » sage deep
     · 2 = sage plein + hairline, glyphe « ● » encre · glyphes 14/700 ;
   - tap = cycle 0 → 1 → 2 → 0 (état local) ;
   - légende centrée gap 14, marge haute 11, 11,5/500 muted, glyphes colorés.
4. Micro-label « TEMPS DISPO PAR SEMAINE » marges 8/8. Card radius 16 padding 11×13, 3 options flex 1 gap 6 :
   radius 12, padding 13×10, centré, gros chiffre 19/700 tracking −0,4 tabulaire + sous-texte 11/500 opacité 0,6 marge 3.
   Option active : fond encre, texte crème, ombre 0 4 12 encre 25 % (seule ombre de l'écran avec le CTA).
5. CTA « Continuer » posé sur le fond (bottom 26, marges 18), gradient Mochi, 16/600 — comme 06 (pas de footer blanc).
Données : `disposDefault`, `weeklyTimeOptions` (src/demo-setup.js). Pas de persistance.
