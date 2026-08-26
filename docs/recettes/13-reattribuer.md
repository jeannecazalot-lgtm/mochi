# Recette écran 13 · Réattribuer (source : duo-embossed-setup.jsx › SetupReassign)

## Retours Jeanne 22 août 2026 — FUSION avec l'écran 12
L'écran 13 **n'existe plus dans le parcours** : la réattribution se fait directement sur
l'écran 12 (tap sur une tâche = bascule vers l'autre membre, totaux recalculés en direct —
voir docs/recettes/12-dispatch.md). Le fichier `app/(setup)/reattribuer.js` est conservé
comme simple redirection (`<Redirect href="/(setup)/dispatch" />`) pour ne pas casser les
liens existants (plan des écrans, anciens parcours). La recette ci-dessous décrit l'ancien
écran à deux colonnes et n'est gardée que pour mémoire.

---

1. Fond + GlowBg `soft`. En-tête embossed avec pastille « · » + « Passer ». Titre « Réattribuer. » + « Glisse une tâche d'une colonne à l'autre. ».
2. Deux colonnes flex 1 gap 8, padding 18 18 110 : Card radius 18 padding 13.
   En-tête colonne (tap = zone de dépôt) : Avatar 28 + prénom 15/600, marge basse 10.
   Tâche : fond crème 55 %, radius 10, padding 10, marge 6, rangée gap 6 : « ≡ » 11,5 muted · emoji · libellé 14/500.
3. Tâche « en cours de drag » (sélectionnée) : fond crème plein, bord 2 px pêche (`gradients.mochi[2]`), rotation −3°, 15/600,
   ombre 0 12 28 encre 22 % — seule ombre portée de l'écran. Au départ, « Sortie chien » (tâche partagée) est dans cet état chez Valentin.
4. Interaction démo : tap sur une tâche = la saisir (tap à nouveau = relâcher) ; tap sur l'avatar / prénom de l'autre colonne = déposer.
5. CTA « Valider → » sur le fond, bottom 24 → `router.replace('/(tabs)')`.
Écart : l'artboard montre la carte flottante au centre de l'écran (drag en cours) ; ici elle reste dans sa colonne, stylée « drag ».
