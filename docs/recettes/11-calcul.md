# Recette écran 11 · Mochi calcule (source : duo-embossed-setup.jsx › SetupAnalysis)

1. Fond + GlowBg `strong`.
2. Colonne centrée, padding 90 24 0.
3. Halo **230×230**, marge basse 29 : 2 anneaux SVG 2 px —
   extérieur r 112 : piste butter 20 % + arc quart butter tourné 135° ; intérieur r 84 : piste sage 20 % + arc quart sage tourné 45°.
   Au centre **`LiveMochi` 150** (float + blink) qui **penche alternativement gauche/droite**
   (prop `lean` alternée −0,5 ↔ +0,5 toutes les 900 ms ; le spring damping 14 de LiveMochi fait la transition, ±6°).
4. Titre « Mochi calcule… » 22/600 tracking −1 centré ; sous-texte 15/400 muted marge 10, largeur max 240, interligne 22.
5. Card radius 14, largeur 260, padding 14×18, gap 8, marge haute 29 : **étapes qui défilent** —
   3 textes (copy `calcStep1/2/3` : « Je lis vos dispos… », « Je pèse chaque tâche… », « J'équilibre… »)
   apparaissent l'un après l'autre toutes les 1,3 s (FadeInDown 240 ms) ; l'étape en cours en coral 500
   préfixée « → », les faites en `inkSoft` préfixées « ✓ ».
   Dessous : barre `SetupProgress` 4 px coral sur piste encre 8 %, **lente : 3,6 s** (0 → 100 %).
6. Passage automatique à 12 après **4 s** (`router.replace`, pas de retour possible sur cet écran).
   Si « réduire les animations » : 1,2 s, étapes toutes affichées « ✓ » d'emblée, barre pleine immédiate, pas de penchement.

## Retours Jeanne 22 août 2026
5. Animation plus grosse et plus longue : Mochi 150 (>140) qui penche gauche/droite en boucle,
   étapes de calcul qui défilent via copy.json, barre plus lente, ~4 s au total avant dispatch,
   `prefersReducedMotion()` respecté (durée courte). Les compteurs « {n} tâches / {n} plages »
   (calcTasks/calcSlots) ne sont plus affichés.
