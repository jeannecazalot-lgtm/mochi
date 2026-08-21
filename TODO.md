# mochi — TODO / journal

Référence visuelle : `design/handoff/Mental free - Embossed.html` (ouvrir dans un navigateur).
Numéros d'écran = numéros d'artboard du canvas. Les écrans « v2 » du canvas ne sont pas à faire.

## Décisions prises
- **21 août 2026** — Stack : Expo SDK 57, JS (pas TS : CLAUDE.md prime sur le brief design), expo-router,
  reanimated 4, Supabase Auth + Postgres + Realtime + Storage, RevenueCat, expo-notifications.
- **21 août 2026** — Choix par défaut sur les options entre crochets du brief (à confirmer par Jeanne) :
  mode **partagé couple/foyer** (solo = foyer à 1), **expo-notifications** (rappels locaux),
  **freemium + abo Duo+ mensuel et annuel** (SPECS §9).
- **21 août 2026** — Bundle id proposé : `io.langora.mochi` (à confirmer avant création ASC).
- **21 août 2026** — Entitlement RevenueCat : `duoplus`, packages `$rc_monthly` / `$rc_annual`.

## Bloquants (actions Jeanne)
- [x] GitHub : repo privé `jeannecazalot-lgtm/mochi` en ligne, push OK — 21 août 2026
- [ ] Supabase : créer le projet, me donner URL + clé publishable dans `.env` (jamais dans le chat).
- [x] Modèle de données validé (16 tables, foyers 2→10, un foyer/personne, Duo+ par foyer, USD, planning hebdo) — 21 août 2026
- [x] EAS : connectée (jeannegourmande), projet lié `@jeannegourmande/mochi` — 21 août 2026
- [ ] Apple : confirmer le bundle id `io.langora.mochi` (avant le premier build production).

## Backlog priorisé (un item = un écran, validation explicite de Jeanne à chaque fois)
### P0 — chaîne technique
- [x] 1. Squelette Expo + git + .gitignore (.env ignoré) — 21 août 2026
- [x] 2. Proposition modèle de données (`supabase/migrations/0001_init.sql`) — 21 août 2026
- [x] 3. Squelette câblé : theme.js, ui.js, copy.json, purchases.js, supabase.js/auth.js, eas.json, legal/ — 21 août 2026
- [ ] 4. Migration appliquée sur le projet Supabase validé
- [x] 5a. Build dev simulateur EAS validé à l'écran (glow, tab bar, FAB, 4 onglets) — 21 août 2026
- [ ] 5b. App ASC + build 1 TestFlight — **reporté après l'audit visuel #1** (décision Jeanne, 21 août 2026) : `npx eas-cli build --platform ios --profile production` en interactif (Apple ID + 2FA)

### P1 — entrée dans l'app (setup)
- [ ] Connexion (Apple + e-mail) — pas d'artboard, style écran 06
- [ ] 06 · Setup A — Identité (prénom + photo)
- [ ] 07 · Setup B — Dispos & énergie (tap-cycle + slider temps/sem)
- [ ] 08 · Setup C — Préférences (aimées/détestées → pénibilité perso, heure de rappel → permission notifs)
- [ ] → audit cohérence visuelle #1 (titres, marges, boutons) · puis TestFlight (5b)
- [ ] 09 · Inviter son binôme (lien + QR, code 7 j)
- [ ] 09b · Duo formé
- [ ] 10 · Choisir les tâches (catalogue ~50 tâches en JSON + custom)
- [ ] 11 · Mochi calcule (algo dispatch SPECS §2, fonction pure testée)
- [ ] 12 · Proposition de dispatch
- [ ] 13 · Glisser pour réattribuer (drag & drop)
- [ ] → audit cohérence visuelle #2

### P2 — cœur quotidien
- [ ] 17 · Home cockpit (Mochi penche + phrase, missions du jour, côté binôme, streak)
- [ ] 14 · Fiche tâche
- [ ] 15 · Tâche mentale — planifier ≠ exécuter
- [ ] 16 · Détail tâche + historique (5 dernières fois)
- [ ] → audit #3
- [ ] 19 · Planning semaine (drag sur avatar)
- [ ] 20 · Liste À faire (compacte, swipe cocher / repasser-reporter)
- [ ] 21 · Tâche ratée (malus)
- [ ] FAB → sheet d'ajout (tâche / événement / dépense / pense-bête)
- [ ] Rappels locaux des tâches dues
- [ ] → audit #4

### P3 — balance & social
- [ ] 21 · Balance (calcul SPECS §3, seuils 10/25 %)
- [ ] 22 · Balance détail (déséquilibre > 25 %)
- [ ] 18 · Long press → Ping sheet
- [ ] 22 · Fil Activité (zéro texte libre)
- [ ] 23 · Point hebdo · malus (geste symbolique, remise à zéro)
- [ ] Realtime Supabase (les 2 téléphones se voient)
- [ ] → audit #5

### P4 — budget & moments
- [ ] 23 · Budget (solde, « On est à zéro », dépenses via tâche)
- [ ] 30 · Événement social (modal)
- [ ] 24 · Wrapped solo (push dim 20h, stories)
- [ ] 25 · Wrapped couple
- [ ] 26 · Bilan mensuel (badges)
- [ ] 28 · Streak célébration (confetti)
- [ ] 34 · Notifs lockscreen (contenu des notifs)
- [ ] → audit #6

### P5 — premium Duo+
- [ ] 37 · Paywall Duo+ (divulgation au-dessus du CTA, Restore/Privacy/EULA, priceString)
- [ ] 35 · Calendrier mois (Duo+)
- [ ] 36 · Analyse charge mentale (Duo+)
- [ ] 32 · Pense-bête partagé (Duo+)
- [ ] 33 · Mood check-in (Duo+)
- [ ] 38 · Profil & réglages (préférences perso / règles du duo, suppression de compte)

### Plus tard
- [ ] 01-05 · Onboarding (marqué « A FAIRE PLUS TARD » dans le canvas)
- [ ] Animations v1 (README handoff §Animations) : float/blink Mochi, lean spring, check, count-up, confetti
- [ ] Dashboard interne — quand le modèle de données est stable

## Fragile / à surveiller
- Build local impossible (pas de CocoaPods) : tous les builds passent par EAS (dev simulateur + production).
- `react-dom` pinné à 19.2.3 (expo-router tirait 19.2.8, incompatible avec react 19.2.3 du SDK 57).
- `src/store.js` = squelette offline-first ; la gestion de conflits se précisera avec les premiers écrans.
- Apple Sign-In : `expo-apple-authentication` installé, pas encore branché à Supabase.
