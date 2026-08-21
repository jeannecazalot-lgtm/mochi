# Recette écran 19 · Planning (source : duo-v3-core.jsx › PlanningV3)

1. Fond `#FAFAF7` + GlowBg `soft`.
2. Header (padding 14 23 0, marge basse 10, row space-between) : titre 22/600 tracking −1,1 ·
   Segment : conteneur crème radius 999 + hairline padding 11 ; option active = pill encre, texte card 13/600, padding 8 13 ;
   inactive 13/500 muted. « Mois » → `/calendrier` (Duo+).
3. Semainier compact (padding 0 18 12, row gap 5) : 7 chips flex 1 radius 12 padding 8 0, centrés ;
   jour 10,5/600 opacité 0,6 · numéro 15/700 · points 4 px gap 5 marge 3 = couleurs des assignés du jour
   (`weekDots`). Aujourd'hui : fond encre, texte card, points butterLight, ombre 0 4 12 encre 25 % (artboard).
   Semaine = lundi → dimanche contenant `today`.
4. Groupes par jour (padding 0 18) à partir d'aujourd'hui : micro 11,5/600 tracking 1,4 muted padding 0 4 7
   (« MAR 7 · AUJOURD'HUI » / « MER 8 »). Rangée = Card crème radius 14 padding 10 13 marge 6, row gap 10 :
   grip 13 (6 points, encre 25 %) · emoji 18 · titre 15,5/500 + sous-texte 12/400 muted marge 3
   (badge · `mental ×1,5` · `18h · 30 min` · `45 min · divisible`) · Avatar 24 de l'assigné, ou paire V/J
   (bord 2 card, chevauchement −7) si non assigné.
   Long press → état « saisi » : scale 1,02 + bordure 1,5 lavender (spring), relâcher = retour. Pas de drag réel.
5. Indice centré 11,5/400 muted ; quand une rangée est saisie, le texte devient copy planning.grabbed.
