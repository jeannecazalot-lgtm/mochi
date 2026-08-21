# Recette écran 20 · À faire (+ état 21 « tâche ratée / malus » dans la même liste)
Sources : duo-v2-compare.jsx › CmpList variant="cream" (fait foi) + duo-v2-onglet-afaire.jsx › AFList (structure).
Densité compacte (paddings 10-13). Fond `#FAFAF7` + GlowBg `normal`.

1. Header (padding 10 18 0, marge basse 7) : bouton retour rond 36 crème + hairline (← SVG) à gauche ; puis titre
   « À faire » 22/600 tracking −1,2 lineHeight 22 + sous-titre 13/400 muted marge 3 « {n} tâches · dont {m} en retard ».
   (L'artboard met une loupe ⌕ à droite : pas de recherche spécifiée → remplacée par le bouton retour demandé.)
2. Filtres (padding 6 14 10, gap 5) : chips 13/500 padding 6×10 radius 999 + compteur 11,5/500 opacité 0,6.
   Actif = fond encre, texte crème, ombre 0 1 2 encre 10 % ; inactif = glass 55 % + hairline ;
   « En retard » inactif = crème + texte coralDeep. Filtres : Tout / Moi / {prénom binôme} / En retard.
3. Groupes (padding 0 18, marge basse 10) : en-tête (padding 0 4 8) label 11,5/600 tracking 1,4 muted
   (« EN RETARD », « AUJOURD'HUI · MAR », « DEMAIN · MER », « JEU 9 JUIL. ») + « {n} tâches » 11,5/500 muted.
4. Rangée (marge basse 4, radius 14, gap 10) :
   - normale : glass 55 % + bordure 0,5 encre 6 %, padding 7×11 ; faite → opacité 0,5 (0,45 animé au check).
   - mise en avant : Card crème padding 8×11 + bordure 1,5 : coral si ratée/en retard, sage si à faire maintenant (urgent).
   - contenu : cercle check 22 (bordure 2 encre 28 % / fait : fond + bordure sage, ✓ blanc 11, stroke 2,4) ·
     emoji 19 · titre 16/500 (fait : line-through muted) · sous-titre 13 marge 2 (« {heure} · {durée}ʼ » ;
     en retard : « En retard depuis {x} » coralDeep 600) · Avatar 26 de l'assigné (non assigné : « ? » muted).
   - état 21 (occurrence `missed`) : bordure coral + sous-titre coralDeep + PillLabel coral « +{points} malus »
     (points = demo.malus de la tâche).
5. Gestes (ReanimatedSwipeable, gesture-handler 2.32) :
   - glisser vers la gauche → action droite « ✓ » (fond sage, 72 px) ; passé le seuil → haptique légère, useCheckPop sur le cercle,
     titre line-through + rangée opacité 0,45 (200 ms), la rangée se referme (spring).
   - glisser vers la droite → révèle « ⇄ Repasser » et « ⏰ Reporter » (2 × 78 px, fond lavender 16 % / butter 16 %),
     labels 11/600 ; seuil 60, haptique, retour spring, overshoot désactivé.
   - tap rangée → `/task/<id>`.
Aucune ombre portée (hors chip de filtre active : 0 1 2 encre 10 %, artboard).
