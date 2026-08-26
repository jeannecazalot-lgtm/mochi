# Recette écran 12 · Proposition de dispatch + réattribution directe (fusion 12+13)

Source : duo-embossed-setup.jsx › SetupDispatch, remaniée par les retours Jeanne du 22 août 2026
(fusion avec l'écran 13 : la réattribution se fait ICI, l'écran 13 n'est plus qu'une redirection).

1. Fond + GlowBg `soft`. **En-tête `SetupHeader` (points 4/4 + titre + flèche retour)** :
   « Mochi a réparti vos tâches. » + sous-titre `dispatchSubTap` (« Tout est ajustable : tape une tâche pour la passer à l'autre. »).
2. Bloc padding 18 23 0 : Card **accent 1,5** radius 20 (sage si équilibré, butter si ça penche), padding 17×18, marge basse 14, rangée gap 14 :
   - état 21/600 tracking −0,6 (« Équilibré » si écart < 10 %, sinon « Ça penche ») ;
   - sous-ligne 13/400 muted : charges hebdo en encre 600 tabulaire, rendues par `LiveCount`
     (count-up au montage, puis recomptage **depuis la valeur précédente** à chaque bascule) ;
   - barre 80×8 radius 4 piste encre 10 %, segments sky / lavender proportionnels (recalculés en direct).
3. Liste scrollable padding 0 18 110 : Card radius 12 padding 11×14 marge 6, rangée gap 10 :
   emoji 19 · titre 16/500 + « créneau · {min}min » 13/400 muted · **Avatar 26 de l'assigné** (plus d'état « partagé » : chaque tâche a toujours un assigné).
4. **Interaction** : tap sur l'avatar OU sur la rangée = la tâche bascule vers l'autre membre —
   pop d'échelle sur l'avatar (0,7 → 1,15 → 1, spring damping 10 puis `motion.spring`), totaux
   (temps par personne, état d'équilibre, barre) recalculés en direct.
5. Bas : CTA unique « C'est parti → » (primaire big, bottom 24) → `router.replace('/(tabs)')`.
   Plus de bouton « Modifier » (la modification se fait sur place).

## Animations
- Entrée : card d'état en FadeInDown, rangées en cascade FadeInDown (25 ms d'écart, 320 ms), totaux en count-up.
- Rien si « réduire les animations » est actif (`prefersReducedMotion`).

Chiffres calculés : `weeklyLoad` / `balanceState` (src/demo-setup.js) sur l'état local des bascules —
jamais écrits en dur. `dispatch` (demo-setup) reflète les tâches cochées par défaut du catalogue révisé.

## Retours Jeanne 22 août 2026
6. Fusion 12+13 : réattribution directement sur cet écran (tap avatar/rangée = bascule + petite
   animation spring/scale, totaux recalculés en direct), DA uniformisée `SetupHeader`, CTA
   « C'est parti » → `/(tabs)`. L'écran 13 devient une simple redirection.
7. Entrée : rangées en cascade, totaux en CountUp (variante `LiveCount` qui repart de la valeur
   précédente lors des bascules, pour ne pas re-compter depuis 0).
