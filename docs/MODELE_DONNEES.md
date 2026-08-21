# mochi — modèle de données Supabase (proposition du 21 août 2026, À VALIDER)

SQL complet : `supabase/migrations/0001_init.sql`. Rien n'est appliqué tant que tu n'as pas dit OK.

## Principes
1. **Un foyer (`households`) = l'unité de partage.** Solo = foyer à 1 membre ; couple = 2 membres max
   (slot `a` → sky, slot `b` → lavender, attribués automatiquement à l'arrivée, jamais choisis).
2. **Tout est relié au foyer** (`household_id`) et la RLS dit : *membre du foyer ⇒ lecture/écriture de
   tout ce qui est dans le foyer*, rien d'autre. Le profil d'une personne n'est visible que d'elle et
   de son binôme.
3. **Offline-first** : les `id` sont générés par le téléphone (uuid), chaque ligne a `updated_at`
   (synchro incrémentale) et `deleted_at` (suppression douce) → on peut créer/cocher hors ligne et
   rejouer au retour réseau sans doublon.
4. **La balance est calculée, jamais stockée** : elle dérive des `occurrences` cochées. Au moment du
   « done », on fige durée/pénibilité/mental dans l'occurrence pour que l'historique ne bouge pas si
   la fiche change ensuite.
5. **Zéro texte libre dans le fil Activité** : un ping = une clé de `copy.json` (`preset_key`).

## Tables (15)
| Table | Rôle | Écrans |
|---|---|---|
| `profiles` | prénom, photo, heure de rappel, rappel croisé opt-in, miroir premium | 06, 08, 38 |
| `households` | le foyer, jour/heure du point hebdo | 09, 38 |
| `household_members` | qui est dans le foyer, slot couleur, dispos (tap-cycle), temps/semaine | 07, 09b |
| `invitations` | code 6 caractères (lien + QR), expire 7 j, acceptation via RPC `accept_invitation` | 09 |
| `tasks` | fiche tâche : fréquence, durée, importance, mental, mode d'assignation, divisible, fenêtre, dépense associée, note, checklist | 10, 14, 15 |
| `task_pains` | pénibilité **par personne** (aimée/détestée) | 08, 14 |
| `occurrences` | instance datée d'une tâche ; `kind` = `plan`/`exec` pour les tâches mentales ; statut ; copie figée pour la balance | 17, 19, 20, 21 |
| `swap_requests` | repassage (proposé / accepté / refusé, max 3 refus/sem calculé) | 18, 20 |
| `activity` | fil : pings préformatés, réponses, tâches faites/ratées, événements, moments Mochi | 22 |
| `malus` | points par occurrence ratée, rattachés à la semaine | 21, 23 |
| `weekly_reviews` | le point hebdo : qui doit le geste, lequel, réglé quand | 23 |
| `expenses` + `settlements` | Budget Tricount ; `occurrence_id` = « via tâche » ; « On est à zéro » | 23 budget |
| `events` / `notes` | événement social (30) / pense-bête partagé (32, Duo+) | 30, 32 |
| `mood_checkins` | mood dimanche soir (33, Duo+) | 33 |
| `wraps` / `badges` | wrapped hebdo figé / badges de streak | 24-28 |

## Ce qui est dérivé (pas de table)
- **Balance** (score = Σ durée × (1 + pénibilité × 0,15), ×1,5 si mental), seuils 10 % / 25 %.
- **Streak** : jours consécutifs où toutes les occurrences dues des deux sont `done`.
- **Dispatch Mochi** : calcul côté app à partir de `tasks` + `task_pains` + `household_members.availability`,
  résultat écrit dans `occurrences.assignee_id`.
- **Compteur de refus de repassage** : `swap_requests` de la semaine.

## Sécurité
- RLS activée partout ; fonction `is_member(household_id)` en `security definer`.
- Un invité n'est pas membre tant qu'il n'a pas accepté → l'acceptation passe par la RPC
  `accept_invitation(code)`, qui vérifie code/expiration/place libre et attribue le slot.
- Photos de profil : bucket Storage `avatars`, chacun écrit uniquement dans son dossier `uid/`.
- Realtime activé sur les tables vivantes (tâches, occurrences, activité, dépenses…).

## Questions ouvertes (réponds par numéro)
1. **Duo+ : par personne ou par foyer ?** Proposé : si l'un des deux paie, le foyer est Duo+
   (`profiles.premium_until` + vérif côté app sur les deux membres). Sinon : gating individuel.
2. **Solo** : autorisé durablement (foyer à 1) ou seulement en attendant l'invitation ? Proposé :
   durable, l'app marche à 1, la balance s'affiche « en attente de ton binôme ».
3. **Multi-foyers** (Duo+ dans SPECS §9) : je le laisse possible en base (un user ↔ N foyers) mais
   l'app v1 n'en gère qu'un. OK ?
4. **Devise** : EUR par défaut, stockée par dépense. OK ?
5. **Occurrences générées à l'avance** : je propose 14 jours glissants, générés côté app à
   l'ouverture (pas de cron serveur — pas de serveur custom). OK ?
