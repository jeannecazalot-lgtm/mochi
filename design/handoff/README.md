# Handoff : Mental free — app complète (v3, DNA Crème)

## Overview
Mental free est une app mobile pour couples qui régule la charge mentale : les tâches du foyer sont réparties par une mascotte (Mochi) selon les dispos/pénibilités de chacun, une balance mesure l'équilibre en temps réel, un point hebdo règle les « malus » par un geste symbolique, et un module Budget (façon Tricount) suit les dépenses partagées.

## À propos des fichiers design
Les fichiers de ce dossier sont des **références design en HTML/JSX** (prototypes React inline transpilés par Babel). Ce ne sont PAS des fichiers de prod à copier. La tâche est de **recréer ces écrans dans la vraie codebase** (stack cible : React Native + Expo, voir `CLAUDE_CODE_BRIEF.md` à la racine) avec ses patterns. Ouvrir `Mental free - Embossed.html` dans un navigateur : c'est le canvas de référence, 15 sections, ~45 écrans annotés.

## Fidélité
**High-fidelity.** Couleurs, typo, espacements, radius et copies sont finaux. Recréer pixel-perfect. Deux exceptions : (1) les avatars « V »/« J » colorés seront des photos de profil (fallback initiale) ; (2) les écrans marqués « v2 » dans le canvas sont des références historiques, ne pas implémenter.

## Comment s'articulent les écrans (flow map)
```
Onboarding 01→05 (pitch, jamais revu)
  → Setup profil A Identité (06) → B Dispos & énergie (07) → C Préférences (08)
  → Inviter son binôme (09) → [l'autre accepte] → Duo formé (09b)
  → Choisir les tâches (10) → Mochi calcule (11) → Proposition dispatch (12) → Réattribuer (13)
  → APP PRINCIPALE

Tab bar (5 slots) : Accueil · Planning · [FAB +] · Balance · Budget
  Accueil (17) ── tap avatar → Profil & réglages (38)
              ── tap bulle 💬 → Fil Activité (22)
              ── long press tâche de l'autre → Ping sheet (18)
              ── tap tâche → Détail tâche (16)
  Planning (19) ── drag tâche sur avatar → réattribution
  FAB → sheet : ajouter tâche (fiche 14 / mentale 15) · événement (30) · dépense · pense-bête (32)
  Balance (21) ── si déséquilibre >25% → Balance détail (22 balance)
             ── dimanche → Point hebdo malus (23)
             ── fin de mois → Bilan mensuel (26) ; streak 14j → Célébration (28)
             ── dimanche 20h push → Wrapped solo (24) → Wrapped couple (25)
  Budget (23 budget) ← reçoit automatiquement les dépenses cochées via tâches
  Premium : Calendrier mois (35) & Analyse charge mentale (36) → Paywall Duo+ (37)
```
Chaque `DCSection` du canvas correspond à un groupe de ce flow ; les numéros d'artboard matchent.

## Système d'uniformisation (À RESPECTER STRICTEMENT dans le code)
Créer ces composants une seule fois et les réutiliser partout — c'est la réponse à « uniformiser les écrans et les boutons » :

### Tokens (theme.ts)
- Fond app : `#FAFAF7` + halos radiaux 4 coins (coral `rgba(245,168,154,.48)`, butter `rgba(251,228,154,.52)`, sage `rgba(201,224,197,.52)`, lavender `rgba(226,214,240,.55)`), opacité globale 0.5/0.7/0.9 selon intensité
- Card : fond `#FFFCF5`, radius 14–16, **AUCUNE ombre portée** — uniquement hairline `0 0 0 1px rgba(26,26,31,0.05)` (border 1px équivalente en RN)
- Sheets modales : séparation `0 -1px 0 rgba(26,26,31,0.08)`, radius haut 26
- Encre : `#1A1A1F` · secondaire `#8A857C` · lignes `rgba(26,26,31,0.06)`
- Accents : coral `#E97A6A` (+deep `#C75744`) · sage `#9FC9A8` (+deep `#4F7A57`) · butter `#F5C76E`/`#FBE49A` · lavender `#B8A5D9` (+deep `#9A7BC8`) · sky `#7DB3D5` (+deep `#4C7FA3`)
- Gradient Mochi (CTA + FAB) : `linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)`
- Personne A = sky, personne B = lavender (assignées automatiquement, pas choisies)

### Typographie (façon app Météo iOS)
- **SF Pro système** (`-apple-system` / San Francisco en RN : police par défaut iOS). Pas de font custom.
- `tabular-nums` sur tous les chiffres
- Graisses : 700 UNIQUEMENT gros chiffres héros (10h, 52/48…) · 600 titres d'écran et de card · 500 labels/rangées · 400 texte secondaire. Jamais tout en gras.
- Tailles (alignées Airbnb) : titres d'écran 22px/600/tracking −1 · titres de card 20px/600 · corps et rangées 15-16px/500 · secondaire 13-14px/400 · micro-labels 11-12px/600/uppercase/tracking 1.4, couleur `#8A857C`

### Composants canoniques
- **Card** : crème + hairline (voir tokens). Variante accent : `border 1.5px` couleur d'accent, réservée aux éléments demandant une action (retard, proposition à accepter) — jamais décorative.
- **CTAPrimary** : rectangle arrondi radius 14, gradient Mochi, texte 14/600 `#1A1A1F`, ombre quasi nulle `0 1px 2px rgba(26,26,31,0.06)`. Posé dans un **footer blanc** : fond `#FFFFFF`, borderTop 1px `#EBEBEB`, padding 12 18 26.
- **CTASecondary** : card crème radius 14, texte 14/500.
- **TabBar (façon Airbnb)** : barre blanche pleine largeur collée en bas, borderTop 1px `#EBEBEB`, 4 onglets icône outline 22px + label 9.5px (actif : coral 600, inactif `#717171` 500), **FAB central** 54px gradient Mochi, détouré 4px blanc, marginTop −34.
- **PillLabel** : uppercase 9px/600 tracking 1.4, fond `couleur28` (16% alpha), radius 999.
- **Rangée de liste** : glass `rgba(255,255,255,0.55)` + hairline, radius 14 ; ou rangées dans une card unique séparées par 1px `rgba(26,26,31,0.06)`.
- **Densité** : écrans listes (À faire, fiche tâche) compacts (paddings ~10–13px, rangées serrées) ; écrans héros (home, balance, onboarding) aérés.

## Animations v1 (toutes à implémenter avec react-native-reanimated)
1. **Mochi idle** : float vertical ±5px, 3.2s ease-in-out infini ; blink toutes les 4–6s (aléatoire).
2. **Mochi balance** : rotation continue −12°…+12° proportionnelle au déséquilibre, spring doux (damping 14) à chaque mise à jour. C'est LA signature de l'app.
3. **Check de tâche** : cercle → remplissage sage avec spring (scale 0.8→1.1→1, ~350ms) + ✓ dessiné (stroke animé 200ms) + rangée qui passe en line-through/opacity 0.45 (200ms) ; haptique légère.
4. **Progress bars** (balance, calories du jour) : width animée à l'apparition de l'écran, 600ms ease-out, départ 0.
5. **Gros chiffres héros** : count-up 500ms à l'apparition (10h, 52/48…).
6. **FAB sheet** : scrim fade 200ms + sheet slide-up 320ms spring ; FAB tourne 45° (+ devient ×).
7. **Swipe rangée tâche** : révélation actions repasser/reporter, seuils avec haptique, retour spring.
8. **Navigation** : push iOS standard ; les modaux (fiche tâche, ping sheet) en présentation sheet.
9. **Streak / badge** : confetti 1.5s (particules aux couleurs de la palette) + Mochi scale-in spring à l'ouverture de la célébration (28).
10. **Wrapped** : stories auto-advance 5s, barre de progression en haut, tap zones gauche/droite ; chiffres en count-up par slide.
11. **Onboarding** : transitions horizontales, gros chiffre de la slide courante en count-up.
Durées : micro-interactions 150–350ms, transitions d'écran 300–350ms, célébrations ≤1.5s. Respecter `prefers-reduced-motion` (désactiver float/confetti).

## State management (minimum)
- `session` (duo, membres, photos, couleurs auto) · `tasks` (catalogue actif + config fiche) · `occurrences` (instances datées, statut, dépense associée) · `balance` (calcul dérivé temps réel, cf SPECS §3) · `malus` (points semaine courante, reset au point hebdo) · `streak` · `expenses` (Budget, alimenté par occurrences cochées avec prix + ajouts manuels) · `activity` (fil : pings, événements, moments Mochi) · `premium` (gating Duo+)
- Realtime : toute action d'un membre doit apparaître chez l'autre (Supabase realtime).

## Règles métier
Tout est dans `SPECS.md` (copié dans ce dossier) : algo de dispatch (§2), calcul balance et seuils communs 10 %/25 % (§3), malus = point hebdo avec geste symbolique (décision récente, §ajustée), repassage (max 3 refus/sem), streak et badges, gating Duo+ (§9), schéma DB (§11). **Décisions récentes qui priment sur le reste de SPECS.md** : pas d'onglet Pings ni Profil (Activité via bulle header, Profil via avatar) ; malus réglés chaque semaine, pas de catalogue de gages configurables ; tâches mentales scindées planifier/exécuter ; dépense associée à une tâche → Budget ; photo de profil plutôt que couleur choisie ; avant l'acceptation de l'invitation, dire « ton binôme », jamais un prénom.

## Fichiers de ce dossier
- `Mental free - Embossed.html` — canvas de référence (ouvrir dans un navigateur)
- `tokens.js` — tokens source
- `SPECS.md` — règles métier
- `design-canvas.jsx`, `duo-v2-stubs.jsx` — infrastructure du canvas + primitives partagées (Mochi, cards, tab bar)
- `duo-v3-*.jsx` — écrans v3 (setup, core, fiche, social) — **la référence principale**
- `duo-embossed-*.jsx` — onboarding, setup tâches, balance/malus, modaux
- `duo-creme-*.jsx` — moments gamifiés, premium, profil
- `duo-v2-compare.jsx`, `duo-v2-onglet-afaire.jsx`, `duo-v2-iridescent-iter3.jsx` — liste À faire (compacte) + écrans référencés
