# mochi — TODO / journal

Référence visuelle : `design/handoff/Mental free - Embossed.html` (ouvrir dans un navigateur).
Numéros d'écran = numéros d'artboard du canvas. Les écrans « v2 » du canvas ne sont pas à faire.

## Décisions prises
- **23 août 2026** — **Zéro émoji dans l'UI** (décision Jeanne : app sobre). Symboles graphiques ○ ● ✓ ‹ › et SVG conservés ; repères de rangée = pastille couleur du membre. Champs `emoji` conservés en données mais jamais affichés.
- **23 août 2026** — Écran 07 : proposition A (légende chips + « Tape une case ») + slider 2→8 h. Écran 08 : liste unique à bascule (neutre → j'aime → je déteste, 3 max par côté). Écrans 12+13 fusionnés. CTA taille Airbnb (52, marges 24), dégradé qui avance à l'appui. Flèche retour épinglée en haut.
- **21 août 2026 (soir)** — Jeanne demande **tous les écrans navigables + animations** avant la validation page par page. Méthode : tous les écrans construits avec des **données de démo** (`src/demo.js`, personnes **Ketley** (slot 1) et **Julian** (slot 2)), reliés selon la flow map, animations du brief ; la validation visuelle et le branchement Supabase se font ensuite écran par écran. Écran « Plan des écrans » (`/plan`) pour sauter partout.
- **21 août 2026** — Entrée dans l'app par **session anonyme Supabase** (pas de compte à créer avant le setup) ; le compte Apple/e-mail se relie ensuite à cette session (`linkIdentity`), sans perte de données. À confirmer par Jeanne.
- **21 août 2026** — Stack : Expo SDK 57, JS (pas TS : CLAUDE.md prime sur le brief design), expo-router,
  reanimated 4, Supabase Auth + Postgres + Realtime + Storage, RevenueCat, expo-notifications.
- **21 août 2026** — Choix par défaut sur les options entre crochets du brief (à confirmer par Jeanne) :
  mode **partagé couple/foyer** (solo = foyer à 1), **expo-notifications** (rappels locaux),
  **freemium + abo Duo+ mensuel et annuel** (SPECS §9).
- **21 août 2026** — Bundle id proposé : `io.langora.mochi` (à confirmer avant création ASC).
- **21 août 2026** — Entitlement RevenueCat : `duoplus`, packages `$rc_monthly` / `$rc_annual`.

## Bloquants (actions Jeanne)
- [x] GitHub : repo privé `jeannecazalot-lgtm/mochi` en ligne, push OK — 21 août 2026
- [x] Supabase : projet créé, `.env` rempli, 06 câblé → `profiles` + bucket `avatars` — 21 août 2026
- [ ] Supabase : activer **Anonymous sign-ins** (Authentication › Sign In / Providers) — nécessaire pour entrer dans l'app avant de créer un compte (liaison Apple/e-mail ensuite)
- [x] Modèle de données validé (16 tables, foyers 2→10, un foyer/personne, Duo+ par foyer, USD, planning hebdo) — 21 août 2026
- [x] EAS : connectée (jeannegourmande), projet lié `@jeannegourmande/mochi` — 21 août 2026
- [ ] Apple : confirmer le bundle id `io.langora.mochi` (avant le premier build production).

## Backlog priorisé (un item = un écran, validation explicite de Jeanne à chaque fois)
Légende : `[~]` = construit avec données de démo, **à valider visuellement par Jeanne puis à brancher sur Supabase** · `[x]` = validé et branché.
Entrée en dev : `/plan` (Plan des écrans). Écarts artboard/README à arbitrer : `docs/ECARTS.md`.
### P0 — chaîne technique
- [x] 1. Squelette Expo + git + .gitignore (.env ignoré) — 21 août 2026
- [x] 2. Proposition modèle de données (`supabase/migrations/0001_init.sql`) — 21 août 2026
- [x] 3. Squelette câblé : theme.js, ui.js, copy.json, purchases.js, supabase.js/auth.js, eas.json, legal/ — 21 août 2026
- [x] 4. Migration 0001 appliquée (projet `zdoqogsfmwpginolhtri`, Europe) ; 19 tables visibles, RLS vérifiée (insert anonyme refusé), RPC OK — 21 août 2026
- [x] 5a. Build dev simulateur EAS validé à l'écran (glow, tab bar, FAB, 4 onglets) — 21 août 2026
- [ ] 5b. App ASC + build 1 TestFlight — **reporté après l'audit visuel #1** (décision Jeanne, 21 août 2026) : `npx eas-cli build --platform ios --profile production` en interactif (Apple ID + 2FA)

### P1 — entrée dans l'app (setup)
- [~] Connexion (lien e-mail) — squelette ; Apple à brancher
- [~] 06 · Setup A — Identité (prénom + photo) — codé le 21 août 2026, **en attente de validation Jeanne** (écarts signalés : CTA 16/600 posé sur le fond, comme l'artboard, vs README 14/600 en footer blanc)
- [~] 07 · Setup B — Dispos & énergie (tap-cycle + slider temps/sem)
- [~] 08 · Setup C — Préférences (aimées/détestées → pénibilité perso, heure de rappel → permission notifs)
- [ ] → audit cohérence visuelle #1 (titres, marges, boutons) · puis TestFlight (5b)
- [~] 09 · Inviter son binôme (lien + QR, code 7 j)
- [~] 09b · Duo formé
- [~] 10 · Choisir les tâches (catalogue ~50 tâches en JSON + custom)
- [~] 11 · Mochi calcule (algo dispatch SPECS §2, fonction pure testée)
- [~] 12 · Proposition de dispatch
- [~] 13 · Glisser pour réattribuer (drag & drop)
- [ ] → audit cohérence visuelle #2

### P2 — cœur quotidien
- [~] 17 · Home cockpit (Mochi penche + phrase, missions du jour, côté binôme, streak)
- [~] 14 · Fiche tâche
- [~] 15 · Tâche mentale — planifier ≠ exécuter
- [~] 16 · Détail tâche + historique (5 dernières fois)
- [ ] → audit #3
- [~] 19 · Planning semaine (drag sur avatar)
- [~] 20 · Liste À faire (compacte, swipe cocher / repasser-reporter)
- [ ] 21 · Tâche ratée (malus)
- [~] FAB → sheet d'ajout (tâche / événement / dépense / pense-bête) + formulaire dépense
- [ ] Rappels locaux des tâches dues
- [ ] → audit #4

### P3 — balance & social
- [ ] 21 · Balance (calcul SPECS §3, seuils 10/25 %)
- [ ] 22 · Balance détail (déséquilibre > 25 %)
- [~] 18 · Long press → Ping sheet
- [ ] 22 · Fil Activité (zéro texte libre)
- [ ] 23 · Point hebdo · malus (geste symbolique, remise à zéro)
- [ ] Realtime Supabase (les 2 téléphones se voient)
- [ ] → audit #5

### P4 — budget & moments
- [ ] 23 · Budget (solde, « On est à zéro », dépenses via tâche)
- [~] 30 · Événement social (modal)
- [~] 24 · Wrapped solo (push dim 20h, stories)
- [~] 25 · Wrapped couple
- [~] 26 · Bilan mensuel (badges)
- [~] 28 · Streak célébration (confetti)
- [~] 34 · Notifs lockscreen (contenu des notifs)
- [ ] → audit #6

### P5 — premium Duo+
- [~] 37 · Paywall Duo+ (divulgation au-dessus du CTA, Restore/Privacy/EULA, priceString)
- [~] 35 · Calendrier mois (Duo+)
- [~] 36 · Analyse charge mentale (Duo+)
- [~] 32 · Pense-bête partagé (Duo+)
- [~] 33 · Mood check-in (Duo+)
- [~] 38 · Profil & réglages (préférences perso / règles du duo, suppression de compte)

### Plus tard
- [~] 01-05 · Onboarding (pager, count-up)
- [~] Animations v1 : float/blink/lean Mochi, check spring, count-up, barres, sheet FAB, confetti, stories — faites ; reste : swipe à valider au doigt, drag & drop réel (13, 19), ✓ dessiné (stroke)
- [ ] Dashboard interne — quand le modèle de données est stable

## Fragile / à surveiller
- **Modales (dépense, ping, événement, mood)** : présentées en form sheet native iOS (fond assombri, coins 26). Mon outil de pilotage du simulateur ne délivre pas les taps aux modales → **fermeture (×), choix, scrim à tester au doigt par Jeanne**. Le swipe des rangées « À faire » et le drag du Planning aussi.
- Écran 06 : la saisie du prénom n'a pas pu être testée par mes outils (clavier) → test Jeanne.
- `legal/privacy.html` non hébergé : lien « Politique de confidentialité » du paywall vide (bloquant Store) → GitHub Pages.
- Les extras des agents (tokens locaux dans `src/components/*/extra.js`, `src/demo-*.js`) sont à consolider dans theme.js / demo.js quand les écrans seront validés.
- Tous les builds passent par EAS (dev simulateur + production) ; pas de build local.
- `react-dom` pinné à 19.2.3 (expo-router tirait 19.2.8, incompatible avec react 19.2.3 du SDK 57).
- `src/store.js` = squelette offline-first ; la gestion de conflits se précisera avec les premiers écrans.
- Apple Sign-In : `expo-apple-authentication` installé, pas encore branché à Supabase.
