# Brief pour Claude Code — Mental free

## Contexte

Tu vas coder **Mental free**, une app mobile React Native + Expo pour réguler la charge mentale dans un couple.

Avant de commencer, **lis intégralement** :
1. `design_handoff_mental_free/README.md` — flow map des écrans, système d'uniformisation (tokens, composants canoniques), animations v1. **C'est la source de vérité design.**
2. `SPECS.md` — règles métier (algo, balance, malus, streak, repassage…) — le README liste les décisions récentes qui priment
3. `Mental free - Embossed.html` — canvas des ~45 écrans (ouvre dans un navigateur)

## Stack imposée
- React Native + Expo SDK 51+
- Expo Router (file-based)
- Supabase (auth + DB + realtime)
- Zustand (state)
- Expo Notifications
- RevenueCat (paiement)
- Typo : **SF Pro système** (police par défaut iOS), pas de font custom
- react-native-reanimated (animations, cf README §Animations v1)
- Lucide-react-native pour les icônes

## Build dans cet ordre

### Étape 0 — Setup
- `npx create-expo-app mental-free --template tabs`
- Config Supabase (créer projet, copier les keys dans .env)
- Créer les tables (cf SPECS §11)
- Setup Expo Router avec 4 onglets + FAB : `(tabs)/index`, `planning`, `balance`, `budget`
- Tab bar custom façon Airbnb (blanche, hairline #EBEBEB, FAB central gradient) — cf README

### Étape 1 — Auth + onboarding
- 5 écrans onboarding + setup profil A/B/C (identité+photo, dispos tap-cycle, préférences)
- Login Apple/Google/email
- Création session + invitation via lien/QR + écran « Duo formé »
- Avant acceptation de l'invitation : dire « ton binôme », jamais un prénom

### Étape 2 — Setup tâches
- Catalogue de ~50 tâches préfaites (JSON statique)
- Écran setup d'une tâche : titre, emoji, fréquence, durée, pénibilité 1-5, importance 1-5
- Algo dispatching (cf SPECS §2) → écran proposition
- Drag & drop pour réattribuer

### Étape 3 — Cockpit + à faire
- Home 4 blocs (Mochi qui penche + phrase, missions du jour, côté binôme, streak discret)
- Onglet Planning (semaine, drag sur avatar pour réattribuer)
- Liste À faire compacte, swipe gauche (cocher) / droite (repasser/reporter)
- FAB → sheet d'ajout (tâche/événement/dépense/pense-bête)
- Fiche tâche complète : fenêtre d'exécution, assignation auto/fixe/alternance, divisible, dépense associée, note/checklist ; tâche mentale scindée planifier/exécuter
- Notifs locales pour les tâches dues

### Étape 4 — Balance + Activité
- Calcul balance temps réel (cf SPECS §3, seuils communs 10/25 %)
- Onglet Balance : chart hebdo, streak, point hebdo malus (geste symbolique, exemples piochés, remise à zéro)
- Fil Activité (bulle header) : pings préformatés + événements + moments Mochi, zéro texte libre

### Étape 5 — Budget + Wrapped
- Onglet Budget (CRUD dépenses + soldes + « On est à zéro ») ; les tâches cochées avec prix y arrivent automatiquement
- Wrapped hebdo : push dimanche 20h + stories + partage

### Étape 6 — Premium
- Paywall + RevenueCat
- Gating des features Duo+ (cf SPECS §9)

## Règles de code

- **Composants atomiques** : 1 fichier = 1 composant, max 200 lignes
- **Tokens** : tous les styles passent par `theme.ts` — valeurs exactes dans `design_handoff_mental_free/README.md` §Tokens (cards crème hairline SANS ombre, CTA radius 14 gradient, graisses 400–700)
- **Pas de magic numbers** dans les écrans, uniquement des tokens
- **Types stricts** : TypeScript partout, pas de `any`
- **Tests** : au minimum les fonctions pures (`calculateBalance`, `assignTasks`, `computeMalus`) avec Vitest
- **Pas de lib UI** (NativeBase, Tamagui…), on dessine tout from scratch pour matcher le design

## Livrable Claude Code

À la fin de chaque étape :
- App runnable sur Expo Go
- README avec ce qui marche / ce qui reste
- Migration SQL Supabase à jour
- Au moins 1 vidéo de démo (Loom ou MP4)

## Ce que tu NE fais PAS sans demander
- Changer la stack
- Ajouter une dépendance lourde non listée
- Inventer des règles métier non spécifiées (toujours demander)
- Modifier les couleurs / la typo

---

**Démarre par l'étape 0 et arrête-toi à la fin de chaque étape pour un review.**
