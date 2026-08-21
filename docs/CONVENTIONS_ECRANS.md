# Conventions pour construire un écran mochi

Lis d'abord : `CLAUDE.md`, `design/handoff/README.md` (tokens, composants canoniques, animations), puis le JSX source de l'écran.

## Fidélité
Reproduire l'artboard **pixel-perfect** (tailles, graisses, espacements, rayons, couleurs, textes). Les écrans « v2 » ne sont pas à faire. Les avatars « V/J » colorés = `Avatar` (initiale, photo plus tard).

## Fichiers
- Écrans : `app/...` (expo-router, JS, pas TS). 1 écran = 1 fichier, **< 500 lignes** ; si plus, découper en composants dans `src/components/<ecran>/`.
- Tout style passe par `src/theme.js` (`colors`, `font`, `radius`, `space`, `alpha`, `gradients`, `slotColors`, `motion`, `shadows`). Pas de couleur hex dans un écran — si un token manque, l'ajouter dans theme.js (append, sans modifier les existants).
- Composants partagés existants dans `src/components/ui.js` : `GlowBg`, `Card`, `GlassRow`, `Divider`, `PillLabel`, `CTAPrimary` (+`big`), `CTASecondary`, `Footer`, `Avatar`, `ScreenTitle`, `Micro`, `Secondary`, `Mochi`, `SetupHeader`. Tab bar : `src/components/TabBar.js`. **Ne pas les redéfinir** ; si un composant manque et sert à ≥ 2 écrans, l'ajouter à la fin de ui.js (append uniquement).
- Animations : `src/components/motion.js` (`LiveMochi`, `CountUp`, `ProgressBar`, `useCheckPop`, `useFabRotation`, `Confetti`, + ré-exports `FadeIn`, `FadeInDown`, `FadeInUp`, `SlideInDown`, `SlideOutDown`, `ZoomIn`, `Animated`). Durées dans `theme.motion`.
- Données : uniquement depuis `src/demo.js` (`me`, `partner`, `members`, `byId`, `tasks`, `taskById`, `occurrences`, `myToday()`, `partnerToday()`, `balance`, `streak`, `malus`, `expenses`, `budget`, `activity`, `household`, `fmtMoney`, `fmtMin`, `today`). Ne jamais écrire un chiffre « métier » en dur dans un écran ; si la donnée manque, l'ajouter à demo.js (append, sans casser l'existant).
- Textes UI : **uniquement** `src/data/copy.json`, ajoutés via `python3 scripts/add-copy.py <section> '<json>'` (atomique, plusieurs agents en parallèle). Chaque section a un `_labels` qui explique chaque clé en français à Jeanne. Ensuite `import copy from '<chemin>/src/data/copy.json'`. Placeholders `{n}` remplacés en JS.
- Icônes : SVG inline via `react-native-svg` avec les `path` de l'artboard (stroke 1.7–2, outline). Pas de lib d'icônes.
- Recette : avant de coder, écrire `docs/recettes/<nn>-<slug>.md` (couches, tailles, rayons, ombres) à partir du JSX.

## Navigation (expo-router)
Routes réservées (ne pas en inventer d'autres) :
- onboarding : `app/onboarding/index.js` (pager 01→05, transitions horizontales) → `/(setup)/identite`
- setup : `app/(setup)/identite.js` (06, existe) → `dispos.js` (07) → `prefs.js` (08) → `invite.js` (09) → `duo-forme.js` (09b) → `taches.js` (10) → `calcul.js` (11) → `dispatch.js` (12) → `reattribuer.js` (13) → `/(tabs)`
- onglets : `app/(tabs)/index.js` (17 home), `planning.js` (19), `balance.js` (21), `budget.js` (23)
- tâches : `app/task/[id].js` (16 détail), `app/task/edit.js` (14 fiche, `?id=` optionnel), `app/task/mentale.js` (15)
- liste : `app/afaire.js` (20 + état 21 tâche ratée)
- social : `app/ping.js` (18, sheet), `app/activite.js` (22)
- balance : `app/balance-detail.js` (22), `app/point-hebdo.js` (23)
- ajout : `src/components/FabSheet.js` (sheet du FAB : tâche / événement / dépense / pense-bête), `app/depense.js` (formulaire dépense, pas d'artboard : même DNA que 30)
- modaux : `app/event.js` (30), `app/pense-bete.js` (32), `app/mood.js` (33), `app/notifs.js` (34, aperçu des notifs)
- moments : `app/wrapped.js` (24 solo + 25 couple, stories auto-advance), `app/bilan.js` (26), `app/celebration.js` (28)
- premium : `app/calendrier.js` (35), `app/analyse.js` (36), `app/paywall.js` (37), `app/profil.js` (38)
Navigation : `import { router } from 'expo-router'` → `router.push('/chemin')`, `router.back()`. Les présentations modales (sheet) sont déclarées dans `app/_layout.js` par l'intégrateur : **ne pas toucher `app/_layout.js` ni `app/(tabs)/_layout.js` ni `app/index.js`** ; dans un écran modal, prévoir un scrim + fermeture par `router.back()`.

## Vérification
- `node scripts/check-syntax.js <fichiers>` doit passer.
- **Ne pas lancer le simulateur ni Metro** (un seul simulateur, piloté par l'intégrateur). Ne pas faire de `git commit`.
- Terminer en listant : fichiers créés, clés copy ajoutées, données demo ajoutées, écarts artboard/README constatés, ce qui reste fragile.
