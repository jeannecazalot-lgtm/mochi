# Recette écran 09b · Duo formé (source : duo-v3-setup.jsx › DuoFormeV3)

1. Fond + GlowBg `strong` (0,9).
2. Contenu centré verticalement, padding 60 26 0, texte centré :
   - rangée : Avatar V 62 (sky) et Avatar J 62 (lavender), chacun avec anneau 3 px couleur fond `#FAFAF7` ; Mochi 84 entre les deux (marges −4, au-dessus) ;
   - `PillLabel` sage deep « DUO FORMÉ », marge basse 11 ;
   - titre 22/600 tracking −1,2 interligne 24 « Jeanne a rejoint / le duo. » (prénom du binôme autorisé : il a accepté) ;
   - sous-texte 14,5/400 muted, marge 10, interligne 22, largeur max 240.
3. CTA « Choisir nos tâches » sur le fond, bottom 26, marges 18.
Écart : le sous-texte de l'artboard genre le binôme (« Elle remplit… ») ; la copy est neutre (« Ses dispos… »).

## Retours Jeanne 22 août 2026
1. Animation « waouh » à l'arrivée (tout coupé si « réduire les animations » iOS) :
   - `Confetti` (motion.js) au-dessus de tout, palette du thème
     (coral, butter, sage, lavender, sky) ;
   - Mochi 84 en `ZoomIn.springify()` damping 14 ;
   - les deux avatars partent écartés de ±46 px et glissent l'un vers l'autre en
     spring (delay 200 ms) jusqu'au léger chevauchement du layout final,
     puis léger pulse 1 → 1,06 → 1 (delay 900 ms) ;
2. Copy réécrite (copy.json › setup) :
   - `duoTitle` : « Bravo, {name} a rejoint / le duo ! » (félicitation) ;
   - `duoSub` : « Prochaine étape : choisir ensemble les tâches de votre foyer. »
