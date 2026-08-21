# Recette écran 35 · Calendrier mois (Duo+) — source : duo-creme-premium-profil.jsx › CalendrierMoisCreme

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg `soft`.
2. Header (padding 14 23 0, marge basse 11) : à gauche bouton retour rond 34 crème + hairline (ajout : l'artboard a une tab bar, pas de retour),
   puis PillLabel « DUO+ » butter (marge basse 6) et titre du mois 22/600 tracking −1,2 ; à droite deux ronds 34 crème hairline ‹ › (gap 6) qui changent de mois.
3. Bandeau gating (si `household.premium_until` null) : Card accent butter 1,5, titre 14,5/600 + sous-titre 12,5 muted, CTA « Découvrir Duo+ » → `/paywall`. Marge basse 11.
4. Grille 7 colonnes (padding 18, gap 5) : en-tête L M M J V S D 10,5/600 tracking 1 muted (marge basse 6) ;
   cases hauteur 44, radius 10, crème + hairline ; chiffre 14/600 ; sous le chiffre jusqu'à 2 points 4×4 (sky = Valentin, lavender = Jeanne, gap 5).
   Aujourd'hui : fond encre, texte crème, points butterLight, **ombre 0 6 14 encre 28 %** (artboard ; écart avec le README « aucune ombre » — on suit l'artboard).
   Jour raté : bordure 1,5 coral. Case sélectionnée (tap) : bordure 1,5 encre 22 %.
   Mois réel depuis `demo.today` (juillet 2026), points depuis `demo.occurrences` — l'avril fictif de l'artboard n'est pas repris.
5. Légende centrée (marge 10 0 12) : ● Valentin sky · ● Jeanne lavender · ◻ jour raté coral, 12/500 muted, gap 16.
6. Card du jour (padding 13 16, radius 16) : micro « DIM 28 · AUJOURD'HUI » 11,5/600 tracking 1,4 (marge 9) ;
   rangées emoji 17 + « Tâche · 20h » 14,5/500 + avatar 22 initiale, padding 7 0, séparateur 1px ligne entre rangées. Vide : texte secondaire.
Aucune ombre hors case « aujourd'hui ». Pas de tab bar (écran poussé depuis Balance/Planning, retour par ←).
