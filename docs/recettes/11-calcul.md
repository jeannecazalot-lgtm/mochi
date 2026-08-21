# Recette écran 11 · Mochi calcule (source : duo-embossed-setup.jsx › SetupAnalysis)

1. Fond + GlowBg `strong`.
2. Colonne centrée, padding 114 24 0 (54 de barre vide + 60 de l'artboard).
3. Halo 200×200, marge basse 29 : 2 anneaux SVG 2 px —
   extérieur r 98 : piste butter 20 % + arc quart butter tourné 135° ; intérieur r 72 (inset 26) : piste sage 20 % + arc quart sage tourné 45°.
   Au centre `LiveMochi` 130 (float + blink).
4. Titre « Mochi calcule… » 22/600 tracking −1 centré ; sous-texte 15/400 muted marge 10, largeur max 240, interligne 22.
5. Card radius 14, largeur 260, padding 14×18, marge haute 29 : 3 lignes 13 encre douce `inkSoft` gap 8, tabulaires
   (« ✓ {n} tâches identifiées » / « ✓ {n} plages horaires » / « → Optimisation en cours… » en coral 500) +
   `ProgressBar` 4 px coral sur piste encre 8 % (600 ms).
6. Passage automatique à 12 après 2 s (`router.replace`, pas de retour possible sur cet écran).
Chiffres : calculés depuis `catalogue` (tâches cochées) et `disposDefault` (créneaux > 0) — l'artboard affichait 8 et 18 en dur.
