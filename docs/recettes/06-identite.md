# Recette écran 06 · Setup A — Identité (source : duo-v3-setup.jsx › SetupIdentiteV3)

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg intensité `soft` (opacité 0.5).
2. Header setup : 3 points d'étape centrés (actif 18×6 encre, passés 6×6 encre, à venir 6×6 encre 15 %), padding top 14.
   Titre 22/600 tracking −1,1 ; sous-titre 14/400 muted, marge 6. Padding horizontal 23.
3. Section « TON PRÉNOM » : micro-label 11,5/600 uppercase tracking 1,4 muted, marge basse 9.
   Card crème radius 16, hairline, padding 17×18 ; texte saisi 19/600 tracking −0,4 ; curseur coral 2×20.
   Marge basse 19.
4. Section « TA PHOTO » : même micro-label ; Card identique ; à gauche cercle 72 fond encre 4 % +
   pointillés 1,5 encre 22 % avec icône appareil photo 20 muted ; texte 15,5/600 + 13/400 muted ; chevron ›.
5. Mochi `wink` 88 px, coin bas droit (bottom 84, right −14), rotation −9°, opacité 0,95.
6. CTA « Continuer » : gradient Mochi, radius 14, posé **directement sur le fond** (bottom 26, marges 18) —
   l'artboard 06 ne met pas de footer blanc (contrairement au README) ; on suit l'artboard.
   Texte 16/600 (artboard) — écart avec le README (14/600) signalé à Jeanne.
Aucune ombre portée nulle part hors CTA (0 1 2 encre 6 %).
