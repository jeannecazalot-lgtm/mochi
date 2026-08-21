# Recette écran 10 · Choisir les tâches (source : duo-embossed-setup.jsx › SetupTasks)

1. Fond + GlowBg `soft`. En-tête embossed « ÉTAPE 4/4 » + « Passer ». Titre « Choisis vos tâches. » + sous-titre.
2. Liste scrollable, padding 18 18 110 : une Card par tâche, radius 14, padding 11×14, marge basse 6, opacité 0,55 si désactivée.
   Rangée gap 13 : pastille emoji 38×38 radius 12 encre 6 % (emoji 19) · titre 16/500 + fréquence 13/400 muted marge 3 ·
   interrupteur 42×24 radius 12 (on : `darkPill` #332F2D, off : encre 10 %), bouton 20 crème à 2 px, ombre 0 1 3 noir 18 % (seule ombre).
3. Bas : deux CTA gap 8 sur le fond (bottom 24) — secondaire « + Ajouter » flex 1 crème (inactif en démo), primaire « Lancer » flex 1,6 gradient.
   « Lancer » désactivé si aucune tâche cochée.
Données : `catalogue` (src/demo-setup.js), fréquences formatées depuis copy (`freqDaily`, `freqPerWeek`, `freqPerDay`).
