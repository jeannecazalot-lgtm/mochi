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
Données : `disposEmpty`, `weeklyTimeOptions` (src/demo-setup.js). Pas de persistance.

## Retours Jeanne 22 août 2026
- **Même DA que 06** : `LiveMochi` 96 px centré (View `alignItems:center`, paddingTop 18)
  AU-DESSUS du `SetupHeader` (points + titre + flèche retour intégrée). Titres inchangés.
- **Aucune valeur pré-remplie** : la grille démarre vide (`disposEmpty`, tous créneaux à 0)
  et aucun « temps dispo » sélectionné (`hours` = null, plus de `default` dans
  `weeklyTimeOptions`). Le CTA « Continuer » reste actif quoi qu'il arrive.
  `disposDefault` ne sert plus qu'à la démo de l'écran 11 (calcul).
- **Animation d'entrée** (désactivée si « réduire les animations ») :
  1. cellules de la grille en cascade `FadeInDown` 220 ms, délai 25 ms × index
     (matin 0-6 puis soir 7-13) ;
  2. ~700 ms après montage, la case **mardi soir** cycle 0 → ○ → ● → 0 (300 ms entre
     états) — purement visuel (état `demoV` local, la grille réelle reste vide), avec un
     pop d'échelle 0,9 → spring 1 à chaque bascule (`useTogglePop`, setup/extra.js) ;
     tout tap sur la grille annule la démo ;
  3. à 1600 ms, les 3 options de temps pulsent 1 → 1,04 → 1 (160+160 ms) en cascade
     (délai 120 ms × index) via `PulseView` (setup/extra.js).
- Le pop `useTogglePop` joue aussi à chaque tap réel sur une cellule.
