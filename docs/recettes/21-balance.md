# Recette écran 21 · Onglet Balance (source : duo-v2-iridescent-iter3.jsx › BalanceEmbossed + brief)

Écran héros, aéré. Onglet : pas de bouton retour, tab bar fournie par `app/(tabs)/_layout.js`.

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg intensité `soft`. SafeArea haut uniquement, ScrollView.
2. En-tête (padding 14 / 23, marge basse 14) : PillLabel sky « SEM. 28 · 6-12 JUIL » (calculée depuis `today`),
   puis titre « Balance » 22/600 tracking −1,2, interligne 22.
3. Mochi vivant 72 px centré, `lean` = (part B − part A) / 50 borné à ±1 → ±12° en spring (damping 14),
   mood `neutral` si déséquilibré sinon `happy`. Sous lui, l'état 13/500 muted : `copy.balance.balanced|leaning|unbalanced`
   (écart en points de % : < 10 équilibré, 10-25 légèrement, > 25 déséquilibré). Tap → `/balance-detail`.
4. Card héros (marges 18, radius 20, padding 18, crème + hairline, pas d'ombre), tap → `/balance-detail` :
   - une colonne par membre (`members`), gauche/droite : prénom 13/600 couleur deep du slot, temps en
     count-up 500 ms 32/600 tracking −1,4 (`fmtMin`), « 48% · 12 tâches » 13/400 muted ;
   - barre scindée 8 px radius 4, piste encre 6 %, un segment par membre couleur de slot (aplat),
     largeurs animées 600 ms ease-out depuis 0 ;
   - « Voir le détail › » 12,5/500 muted aligné à droite, marge 10.
5. Bloc « 7 DERNIERS JOURS » (micro 11,5/600 + « en min/jour » 11,5/500 muted, padding 0 4 8) :
   Card radius 16 padding 14 ; une rangée par jour (L…D) : lettre 11,5/600 muted largeur 14 + barre scindée 6 px,
   rangées espacées de 8, animation décalée de 40 ms par jour. Jour sans donnée = piste seule.
6. Card streak (radius 16, padding 14) : 🔥 24 · micro « STREAK » · « 6 jours » 20/600 en count-up ·
   « encore 1 jour pour « Première semaine fluide » » 13/400 muted · à droite « record 12 j » 12/500 muted.
7. Card malus en cours (radius 16, padding 14) : micro « MALUS EN COURS » ; une rangée par malus
   (emoji 19 · titre 15,5/500 · « 2 fois · importance 2 » 12/400 muted · pill sombre « +3 » encre / crème 13,5/600),
   séparées par un Divider 1 px ; lien « Point hebdo · dim. 12 › » 13/600 coralDeep à droite → `/point-hebdo`.
8. Au montage : si état `unbalanced` → push automatique `/balance-detail` (flow README).

Aucune ombre portée. Couleurs membres = `slotColors` (A sky, B lavender), pas les dégradés de l'artboard.
