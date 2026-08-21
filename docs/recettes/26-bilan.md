# Recette écran 26 · Bilan mensuel (source : duo-creme-gamifies.jsx › BilanMensuelCreme)

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg `soft`.
2. Header (padding 14 haut, 23 côtés, marge basse 14) : bouton retour rond 36 glass (chevron ‹ encre, stroke 2) — absent de
   l'artboard, demandé par la mission — puis PillLabel butter « {MOIS} · CLÔTURE » (marge basse 6) et titre 22/600 tracking −1,2.
3. Card verdict (marges 22, radius 20, padding 18×20, centré) : « Mois équilibré. » 20/600 tracking −0,9 ;
   sous-titre 14/400 muted « 51 / 49 sur 30 jours · 21 jours équilibrés » (marges 6 / 11) ;
   barre 8 px radius 4 piste encre 6 % scindée : gauche gradient sky→lavender (me %), droite gradient `#F5A89A`→coral (partner %),
   largeurs animées 600 ms ease-out depuis 0 (`SplitBar`, extra.js).
4. Micro-label « BADGES DU MOIS » 11,5/600 tracking 1,5 muted (marge 4 / 8), grille 2 colonnes gap 8 (marge basse 14) :
   - débloqué : Card radius 14 padding 13×14, emoji 21 (marge 6), titre 15/600, sous-titre 12 muted « 7 jours · débloqué le 8 avr. ».
   - verrouillé : fond blanc 45 %, bord 1 pointillé encre 15 %, radius 14, opacité 0,7, 🔒, « 14 jours · plus que 2 jours ».
5. Micro-label « MALUS DU MOIS » (marge basse 8), Card radius 16 padding 14×16 en rangée gap 13 : ✓ 20, « Tout est réglé. » 16/600,
   sous-titre 13 muted.
6. CTA gradient Mochi « Clore {mois} → démarrer {mois+1} » 16/600 radius 14 posé sur le fond (bottom 24, marges 18) → `router.back()`.
Aucune ombre portée hors CTA.
