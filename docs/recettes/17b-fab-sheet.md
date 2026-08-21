# Recette · Sheet du FAB (pas d'artboard ; README §Animations 6 + DNA sheets)

Composant `src/components/FabSheet.js`, rendu dans un `Modal` transparent (pour couvrir la tab bar).
1. Scrim : encre 35 %, fade 200 ms (`motion.micro`). Tap → fermeture.
2. Sheet collée en bas : fond card, radius haut 26 (`radius.sheet`), séparation 0 −1 encre 8 % (`sheetLine`),
   padding 10 18 + inset bas. Slide-up spring ~320 ms (`motion.screen`, dampingRatio 0,8) ; sortie 200 ms.
   Poignée 36×5 radius 999 encre 15 % centrée, marge basse 14. Titre « Ajouter » 20/600 tracking −0,6 marge basse 12.
3. 4 rangées (padding 12 0, séparées 1px `line`, gap 13) : pastille 40 ronde teinte 16 % avec icône 20 stroke 1,8
   (tâche sage · événement sky · dépense butter · pense-bête lavender) · label 16/500 + sous-texte 13/400 muted · › 16 muted.
   Tap → ferme puis `router.push` (`/task/edit`, `/event`, `/depense`, `/pense-bete`).
4. Réplique du FAB (54, gradient Mochi, anneau 4 blanc, ombre `shadows.fab`) posée par-dessus le scrim à la place du FAB
   de la tab bar (bottom = max(inset, 24) + 10), « + » tourné de 45° via `useFabRotation(open)` → ×. Tap → fermeture.
Branchement : `useFabSheet()` (état) + `<FabSheet open onClose />` dans (tabs)/_layout.js, `onFab={fab.toggle}` sur la TabBar.
