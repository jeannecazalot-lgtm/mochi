# Recette écran 28 · Célébration streak (source : duo-creme-gamifies.jsx › StreakCelebrationCreme)

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg `strong` (0,9).
2. Confetti 1,5 s (`Confetti` de motion.js, 28 particules) aux couleurs palette : `#F5A89A`, butterLight, sage, lavender, sky.
   Les 8 pastilles rondes statiques de l'artboard sont remplacées par ce confetti animé (README §9).
3. Contenu centré (padding 40 haut, 26 côtés) :
   - Mochi happy 180 en ZoomIn spring (damping 14) à l'ouverture, puis float (`LiveMochi`) ; marge basse 19.
   - PillLabel sageDeep « STREAK » (marge basse 11).
   - Titre 34/600 tracking −1,5 lineHeight 36 « 14 jours équilibrés\nd'affilée. » (chiffre en CountUp).
   - Sous-titre 15/400 muted marge 10.
4. Card badge (marges 22, marge haute 21, radius 18, padding 17×18) avec bordure 1,5 butter (accent) : 🏅 24 + micro-label
   10,5/600 tracking 1,4 or `#8A6A1F` « BADGE DÉBLOQUÉ » (marge basse 6) + « Duo huilé » 19/600 tracking −0,4.
5. Pied (bottom 24, marges 18, gap 13, centré) : CTA gradient Mochi « Continuer » 16/600 → `router.back()` ;
   « Partager le badge » 14/500 muted (placeholder).
