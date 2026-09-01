# mochi — TODO / journal

Référence visuelle : `design/handoff/Mental free - Embossed.html` (ouvrir dans un navigateur).
Numéros d'écran = numéros d'artboard du canvas. Les écrans « v2 » du canvas ne sont pas à faire.

## Session du 1er sept 2026 — repasse de Jeanne (EN COURS, récap à faire en fin de session)
Modifs appliquées (commits `bedcf9e`, `dee3e3e`, `7fb6efa`) :
- **CTA global** : traversée du dégradé 500 → 800 ms, easing inOut (retour « ça bug ») — à valider au doigt.
- **06** : sous-titre retiré ; phrase « Ou continue sans… » retirée ; grande photo carrée arrondie centrée + pilule « Ajouter » façon Airbnb (2 itérations : rangée « Sélectionner une photo » puis version finale).
- **08** : sous-titre et phrase d'aide retirés ; légende porte tout : « j'aime · 1 tap / je déteste · 2 taps » ; écran aéré (chips plus larges) ; « Rappel quotidien » décollé.
- **09** : lien masqué (le bouton suffit) ; « Envoyer le lien » à la place exacte du CTA des écrans précédents ; QR · partage · « Inviter plus tard » regroupés au-dessus ; la place vide du binôme « respire » ; carte « Une place t'attend » remontée sous le titre.
- **09b** : animation restaurée (avatars qui glissent, Mochi en zoom, confettis) — elle avait été neutralisée le 26/08 avec mention « à retravailler ».
- **10** : minimum 3 tâches pour continuer + lien « Passer » retiré ; « + Ajouter » remonte l'écran en haut ; « pour tout le foyer » dans le sous-titre ; bug corrigé : tâches ajoutées affichées en double.
- **Plan des écrans** : entrée « 07 · rejouer l'animation d'intro » (la démo ne se joue qu'à la première visite, d'où l'impression d'animation disparue).

- **12** : cascade d'entrée plus perceptible (45 ms d'écart) ; barre d'équilibre animée (part de 50/50, glisse vers la vraie répartition, suit chaque bascule/réglage).

Réponses données pendant la repasse :
- **12 « données en dur »** : confirmé — l'écran ne reflète ni les 3 tâches cochées ni le reste (démo figée). Total ≈ 10 h = durées estimées du catalogue (vaisselle 15 min, cuisine 40, ménage 60…) × fréquences par défaut (quotidien, 2×/sem…) — estimations à faire valider par Jeanne, modifiables ensuite par foyer via la fiche tâche. Le n×/sem vient de ces défauts, réglable sur 12 (choix du 26/08 : pas de fréquence sur le 10).
- **Accueil « infos pas bonnes »** : même cause (démo). Prochaine étape logique quand la repasse visuelle est finie : brancher la chaîne réelle 06 → 12 → Accueil (Supabase + cache local offline-first) pour que l'app affiche ce que l'utilisateur a réellement saisi.
- **Animations « disparues »** : 07 = première visite seulement ; chips du 08 statiques = retour Jeanne du 26/08 ; 09b restaurée ce jour. Émojis : rétablis volontairement le 26/08 (annulation de la passe sobre).
- **Dispatch** : écrans 11/12 = données de démo figées ; le vrai algo (tasks + pénibilités + dispos par personne) sera branché avec Supabase après validation visuelle.
- **Choix des tâches** : une fois pour tout le foyer ; dispos (07) et préférences (08) par personne, le binôme remplit les siennes en acceptant.
- **Fréquence** : défaut du catalogue par tâche, ajustable sur l'écran 12 (− n×/sem +), pas sur le 10 (retour du 26/08).

- **21 · Balance** : titre aligné sur les autres onglets, pastille « Semaine n · x au y » à sa droite sur la même ligne.
- **17 · Accueil** : nouvelle **sheet Mission** — tap sur le titre/émoji d'une mission → pop-up : temps réel passé (− / +), « C'est fait » (coche la mission, temps compté), « Je n'aurai pas le temps » (reporter/repasser, démo), « Modifier la tâche » (→ fiche 14). Le rond coche toujours directement. Accessible aussi depuis /plan.
- **17 · Accueil** : bloc « Côté Julian » retiré (redondant avec le Planning).

Décision Jeanne (1er sept 2026) : **Budget = fonctionnalité payante (Duo+)** → prévoir l'état verrouillé de l'onglet Budget (paywall 37 pour les non-abonnés). Ajouté au backlog P4/P5 ; impacte la divulgation paywall et la description ASC.

Questions ouvertes (à trancher par Jeanne) :
- [ ] Restructuration du flux d'entrée (invitation d'abord, setup pendant l'attente, Home à états, profil façon Airbnb pour le 38) — discutée, « pas envie d'y toucher pour l'instant » ; place du foyer solo à clarifier si on y revient.
- [ ] 06 : un seul libellé « Ajouter » même quand une photo est déjà choisie — garder ou distinguer ?
- [ ] 08 : légende suffisante pour comprendre le cycle ? (le 3ᵉ tap = retour neutre n'est pas affiché)
- [ ] Voir la fréquence dès l'écran 10 ? (aujourd'hui : écran 12 seulement)
- [ ] Émojis maison (icônes custom) à la place des émojis système ? (question Jeanne 1er sept, « pas sûre que ce soit nécessaire ». Reco : garder les émojis pour la v1 — le champ `emoji` par tâche rend le remplacement par un set SVG facile plus tard ; un set custom ≈ 50 icônes à dessiner, à décider après le premier retour utilisateurs.)
- [ ] Bouton pour « écrire des malus » sur Balance ? (question Jeanne 1er sept — il n'y en a jamais eu : les malus naissent d'une tâche ratée. Reco : pas de malus manuel libre, plutôt une action « marquer comme ratée » sur la tâche, qui génère le malus — garde le système objectif.)

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
