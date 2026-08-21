# Recette écran 36 · Analyse charge mentale (Duo+) — source : duo-creme-premium-profil.jsx › AnalyseChargeCreme

1. Fond `#FAFAF7` + GlowBg `soft`.
2. Header (padding 14 23 0, marge basse 11) : bouton retour rond 34 (ajout, artboard = tab bar) ; ligne de pills gap 8 : « CHARGE MENTALE » lavender + « DUO+ » butter (marge basse 6) ;
   titre 2 lignes 22/600 tracking −1,1 line-height 1,05 : « L'invisible pèse / sur {prénom} » (prénom = celui qui porte le plus, depuis `demo-premium.mentalLoad`).
3. Bandeau gating (si pas Duo+) : même composant que le 35. Marge basse 11.
4. Card parts (padding 17 18, radius 18, marge 0 22 11) : ligne 13,5/600 « Valentin · 36% » sky / « Jeanne · 64% » lavenderDeep (CountUp 500 ms) ;
   barre 10 radius 5 : piste lavender (part de Jeanne), remplissage sky animé de 0 → 36 % (ProgressBar 600 ms) ; texte 13,5/400 muted (×1,5).
5. Micro « QUI PORTE QUOI » 11,5/600 tracking 1,5 (padding 0 22, marge 9).
6. Rangées glass (fond blanc 55 %, hairline ligne, radius 14, padding 10 14, gap 13, gap vertical 6) : emoji 19 ; titre 15/500 (marge 6) ;
   mini-barre 4 radius 2, piste encre 7 %, remplissage couleur du porteur animé (délais échelonnés 80 ms) ; à droite prénom 12/600 en couleur deep.
7. Card suggestion accent sage 1,5 (padding 13 16, radius 16) : ✨ 21 ; « Mochi suggère » 15/600 + corps 13,5 muted (marge 3) ; « Appliquer » 13/600 sageDeep → bascule en « Appliqué » (local).
Aucune ombre. Pas de tab bar.
