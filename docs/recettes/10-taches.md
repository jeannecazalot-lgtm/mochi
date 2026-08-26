# Recette écran 10 · Choisir les tâches (source : duo-embossed-setup.jsx › SetupTasks)

1. Fond + GlowBg `soft`. **En-tête `SetupHeader` (points d'étape 4/4 + titre + sous-titre + flèche retour)**,
   lien « Passer » discret (`SkipLink`) aligné sur la flèche — plus de pastille « ÉTAPE 4/4 ».
2. Liste scrollable, padding 18 18 110 : une Card par tâche, radius 14, padding 11×14, marge basse 6, opacité 0,55 si décochée.
   Rangée gap 13 : pastille emoji 38×38 radius 12 encre 6 % (emoji 19) · titre 16/500 + méta 13/400 muted marge 3
   (« fréquence · {mins} min », suffixe « · mentale » pour les tâches mentales) ·
   **rond de sélection `CheckDot` 26** : anneau 1,5 `checkRing` décoché, plein `darkPill` + ✓ crème coché.
3. Catalogue en deux blocs : ~12 tâches **larges** d'abord, puis intertitre micro « Selon ton foyer »
   (`SectionLabel`, marge 14/9) et les spécifiques (Sortie chien, Plantes), décochées par défaut.
4. Bas : deux CTA gap 8 sur le fond (bottom 24) — secondaire « + Ajouter » (`AddButton`, état pressé
   visible : fond encre 6 % + échelle 0,97, inactif en démo), primaire « Lancer » flex 1,6 gradient,
   désactivé si aucune tâche cochée.

## Animations
- Entrée : rangées en cascade `FadeInDown`, délai croissant de 25 ms par rangée, durée `motion.screen` (320 ms).
- Cochage : le rond pop (`useCheckPop`, 0,8 → 1,1 → 1) + haptique légère (`Haptics.impactAsync(Light)`)
  au cochage uniquement. Rangée entière tapable (mêmes effets).
- Rien de tout ça si « réduire les animations » (iOS) est actif.

Données : `catalogue` (src/demo-setup.js — champs `mins`, `pain`, `mental`, `specific`),
fréquences formatées depuis copy (`freqDaily`, `freqPerWeek`, `freqPerDay`), intertitre `tasksSpecificLabel`,
suffixe `mentalTag`.

## Retours Jeanne 22 août 2026
1. DA uniformisée avec 06-08 : `SetupHeader total={4} step={4}`, plus de pastille « ÉTAPE 4/4 » ni d'en-tête embossed.
2. Catalogue révisé : ~12 tâches larges universelles (Vaisselle, Cuisine, Courses, Lessive, Ménage,
   Salle de bain, Poubelles, Rangement, Administratif & factures, Courrier & colis, Rendez-vous à prendre,
   Planification des repas — les 3 dernières « mentales ») ; les spécifiques (chien, plantes) en fin de
   liste sous « Selon ton foyer ». Durées/pénibilités réalistes dans demo-setup.js.
3. Interrupteur remplacé par le rond de sélection `CheckDot` qui pop + haptique légère ; « + Ajouter » a un état pressé visible.
4. Entrée en cascade (FadeInDown, ~25 ms d'écart).
