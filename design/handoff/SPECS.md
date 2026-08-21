# Mental free — Spécifications produit & techniques

App React Native (Expo) pour réguler la charge mentale dans un couple.

---

## 1. Concepts de base

### Session
Un "binôme" entre 2 personnes (couple, coloc, parent/enfant adulte).
- 1 user = N sessions (mais 99% du temps = 1 seule)
- Une session a : 2 membres, des tâches, une balance, un streak, un wrapped hebdo, un Tricount

### Tâche
Unité de travail domestique/mental.
- `id`, `title`, `emoji`, `assignee` (userId), `frequency` (daily/weekly/biweekly/monthly/once)
- `duration` (minutes, médiane communauté ou custom)
- `pain` (pénibilité 1-5, choisie au setup)
- `importance` (1-5, choisie au setup) — pondère les malus
- `dueAt` (timestamp), `doneAt`, `status` (pending/done/missed/swapped)
- `mentalLoad` (boolean) — true pour tâches "invisibles" (RDV pédiatre, anniv belle-mère…)

### Catalogue de tâches préfaites
Lister ~50 tâches courantes avec durée/pénibilité moyennes pré-remplies (vaisselle 15min/p2, ménage 60min/p3, courses 45min/p3, lessive 30min/p2, sortir poubelles 5min/p1, RDV médecin 10min/p4 charge mentale…). User peut activer + ajuster.

---

## 2. Algo de dispatching (Mochi)

### Inputs
- Pour chaque user : créneaux dispos (jours × heures), durée moyenne dispo/semaine
- Pour chaque tâche : durée, fréquence, pénibilité

### Règle
1. Pour chaque tâche, calculer `effort = duration × frequency_per_week × (1 + pain × 0.2)`
2. Sommer l'effort total de la semaine → cible : 50/50
3. Allouer les tâches une par une, du plus gros effort au plus petit, à celui qui :
   - a la dispo nécessaire dans son créneau
   - a actuellement le moins d'effort accumulé
4. Tâches "communes" (sortie chien…) → splitable matin/soir
5. Si déséquilibre > 15% impossible à résoudre → afficher "Setup à revoir" avec suggestions

### Output
Liste de tâches assignées, **toujours modifiable** par drag & drop (écran 15 du canvas).

---

## 3. Calcul de la balance

### Formule
Pour une période donnée (jour / semaine / mois) et un user :
```
score = Σ (duration_minutes × (1 + pain × 0.15))
```
Ex : vaisselle 15min p2 = 15 × 1.30 = **19.5 pts**
Ménage 60min p3 = 60 × 1.45 = **87 pts**

### Affichage
- En **temps équivalent** ("4h30") : `score / (1 + pain_moyen × 0.15)` reconverti
- En balance : ratio user1/user2
- État :
  - `équilibré` si écart < 10%
  - `légèrement penché` si écart 10-25%
  - `déséquilibré` si écart > 25%

### Tâches mentales (mentalLoad: true)
Comptent ×1.5 sur le score (la charge mentale pèse plus que le temps brut).

---

## 4. Système de malus

### Trigger
Une tâche `status: missed` (non faite à dueAt + tolérance 2h pour quotidien, 1j pour hebdo).

### Calcul des points de malus
```
malus_points = importance × (1 + retard_en_jours × 0.5)
```
Ex : importance 3 + 0 jour de retard = 3 pts. Importance 5 + 2 jours = 5 × 2 = 10 pts.

### Conversion
À la fin du mois, les points de malus de chaque user se traduisent en :
- **Tâches en plus le mois suivant** (1 point = ~6 minutes de tâches en plus à allouer)
- OU **malus custom** négocié dans le couple :
  - "Massage 15 min" = 5 pts
  - "Cuisiner le repas du dimanche" = 8 pts
  - "Sortie surprise" = 10 pts
  - L'autre propose, l'accusé accepte/refuse → si accepté, les points sont effacés
  - Catalogue de malus customs prédéfinis + custom user

### Importance par défaut
- 1 (faible) : poubelles, vaisselle midi
- 2 : sortie chien soir, vaisselle soir
- 3 (moyen) : courses semaine, ménage
- 4 : RDV médecin, paiements
- 5 (critique) : anniversaire belle-mère, vaccin enfant

User peut override.

---

## 5. Streak

### Définition d'un jour équilibré
Un jour J est "équilibré" si :
- `tâches_dues_J_user1` toutes en `status: done` ET
- `tâches_dues_J_user2` toutes en `status: done`
- (autrement dit : tout le monde a fait ses missions du jour)

### Streak
Compteur de jours équilibrés consécutifs. Brisé dès qu'un user a une tâche `missed`.

### Récompenses (badges)
- 7 jours : "Première semaine fluide"
- 14 jours : "Duo huilé"
- 30 jours : "Mois pleinement équilibré"
- 100 jours : "Légende du quotidien"
- Affichés écran StreakCelebration + dans Bilan mensuel

---

## 6. Repassage de tâche

### Règle MVP (à valider sur usage)
- N'importe qui peut proposer un repassage de **n'importe quelle tâche assignée à lui**
- L'autre reçoit une notif + écran de validation
- L'autre peut **accepter** (la tâche change d'assignee, +1 malus pour le proposant) **ou refuser**
- **Max 3 repassages refusés / semaine** par user → au-delà, l'app suggère "Vos tâches sont mal réparties, refaites le setup"
- Une tâche **importance ≥ 4** ne peut PAS être repassée le jour même (ex : RDV médecin)

---

## 7. Tricount intégré (MVP — pas v2)

Module dépenses partagées pour le couple.
- Liste des dépenses : titre, montant, payé par, partagé entre, date
- Catégories : courses, sorties, factures, autre
- Calcul du solde : qui doit combien à qui
- Bouton "On est à zéro" : un user envoie le solde via virement (lien wise/lydia)
- **Pas d'OCR de ticket pour le MVP**, juste saisie manuelle

---

## 8. Wrapped hebdomadaire (MVP — pas v2)

### Trigger
Push notification dimanche soir 20h : "Votre semaine en chiffres 📊"

### Contenu (1 stories style Spotify Wrapped)
1. **Score balance** : "Cette semaine, 52% / 48%. Légèrement chez Valentin."
2. **Tâche championne** : "Jeanne a été reine de la lessive (3 fois cette semaine)"
3. **Streak** : "12 jours équilibrés, c'est votre record !"
4. **Tâche oubliée** : "Personne n'a sorti la poubelle mardi 😬"
5. **Total temps gagné** : "Sans Duo, vous auriez perdu ~2h à vous coordonner"
6. **CTA partage** : screenshot du wrapped → stories Insta

### Storage
Garder les 4 dernières wrapped en free, illimité en premium.

---

## 9. Modèle business

| | Free | Duo+ (4€/mois ou 35€/an) |
|---|---|---|
| Tâches illimitées | ✅ | ✅ |
| Balance + streak | ✅ | ✅ |
| Pings | ✅ | ✅ |
| Wrapped semaine | ✅ (4 dernières) | ✅ (illimité + export PDF) |
| Tricount | ✅ (10 dépenses/mois) | ✅ (illimité) |
| Calendrier vue mois | ❌ | ✅ |
| Analyse charge mentale détaillée | ❌ | ✅ |
| Multi-sessions | ❌ (1 max) | ✅ |
| Pense-bête partagé | ❌ | ✅ |
| Mood check-in | ❌ | ✅ |

---

## 10. MVP scope (ordre de build)

### Sprint 1 — Auth + setup (2 sem)
- Onboarding 5 écrans
- Création compte (email/Apple/Google)
- Création session + invitation partenaire (deeplink)
- Profil + dispos
- Setup tâches (catalogue + custom) avec durée/pénibilité/importance
- Algo dispatching v1 + écran proposition + réattribution drag & drop

### Sprint 2 — Cockpit + To-do (2 sem)
- Home cockpit (balance, ligne semaine, tâches du jour, activité)
- Onglet À faire (liste, filtres, swipe pour cocher/repasser)
- FAB + sheet ajout tâche/événement
- Notifs lockscreen (rappels tâche)

### Sprint 3 — Balance + Pings (1.5 sem)
- Onglet Balance (chart + streak + malus en cours)
- Onglet Pings (chat + presets)
- Calcul balance temps réel
- Système de malus (calcul + conversion)

### Sprint 4 — Tricount + Wrapped (1.5 sem)
- Module Tricount complet
- Wrapped hebdo (notif + stories + partage)
- Streak célébrations + badges

### Sprint 5 — Premium + polish (1 sem)
- Paywall Duo+
- Stripe / IAP intégration
- Polish animations Mochi

**Total MVP : ~8 semaines pour 1 dev fullstack**

---

## 11. Stack technique recommandée

- **App** : React Native + Expo (SDK 51+)
- **Nav** : Expo Router (file-based routing)
- **State** : Zustand (simple) ou TanStack Query si beaucoup d'API
- **Backend** : Supabase (auth + Postgres + realtime + storage) — gratuit jusqu'à 500MB
- **Push** : Expo Notifications
- **Paiement** : RevenueCat (gère Apple/Google IAP)
- **Analytics** : PostHog (gratuit jusqu'à 1M events)
- **Fonts** : SF Pro système (police par défaut iOS) — aucune font custom

### Schéma DB minimal
```
users (id, email, name, color)
sessions (id, name, created_at)
session_members (session_id, user_id, role, joined_at)
tasks (id, session_id, title, emoji, assignee_id, frequency, duration, pain, importance, mental_load, due_at, done_at, status)
task_history (id, task_id, action, by_user, at, reason)
pings (id, session_id, from_user, to_user, message, about_task_id, sent_at, read_at)
malus (id, session_id, user_id, points, source_task_id, month, resolved_via)
expenses (id, session_id, title, amount, paid_by, split_with, category, date)
wraps (id, session_id, week_start, data_json, generated_at)
```

---

## 12. Design tokens

> **DNA retenue (juil. 2026) : « Embossed Crème » (Iter B)** — cards crème `#FFFCF5` cernées d'un hairline plat `0 0 0 1px rgba(26,26,31,0.05)` (aucune ombre portée, décision août 2026), pill labels colorés uppercase, couleur en petites doses (pills, bordures d'accent, avatars), fond `#FAFAF7` avec glow radial doux, glass `rgba(255,255,255,0.55)` pour les rangées secondaires, tab bar sombre pilule + FAB iridescent, Mochi iridescent. Réf : `Duo v2.1 - Sature vs Creme.html` (rangée Ⓑ) et `duo-v2-compare.jsx` / `AFSetup variant="cream"`.

### Couleurs
```js
cream: '#FBF7F2'
creamDeep: '#F0EBE1'
ink: '#1A1A1F'
inkSoft: '#3A3A42'
muted: '#8B8680'
line: '#E8E2D5'
card: '#FFFFFF'
sage: '#7BA982'
sageDeep: '#4F7B57'
coral: '#E89B85'
coralDeep: '#C75744'
butter: '#F5C76E'
sky: '#6FA7C4'           // Valentin
lavender: '#A084C8'      // Jeanne
dark: '#1A1A1F'
```

### Typo
- **SF Pro système** partout (`-apple-system` / défaut iOS), aucune font custom (décision août 2026)
- Graisses : 700 gros chiffres héros uniquement · 600 titres · 500 labels/rangées · 400 secondaire
- Tailles : titres d'écran 22 · titres de card 20 · corps/rangées 15-16 · secondaire 13-14 · micro-labels uppercase 11-12 (tracking 1.4) · chiffres en tabular-nums

### Espacements
- Padding cards : 12-16
- Border radius : 12 (cards), 14 (buttons), 99 (pills), 24 (sheets)
- Shadow cards : 0 1px 3px rgba(0,0,0,0.05)

### Mascotte Mochi
- Forme : blob arrondi avec yeux + bouche
- Inclinaison `lean` (-1 à 1) selon balance (penche vers celui qui charge)
- Mood : neutral / happy / sad / sleeping
- Animation : flottement vertical doux (3s ease-in-out infinite)
