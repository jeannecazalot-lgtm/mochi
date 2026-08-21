# mochi — modèle de données Supabase (VALIDÉ par Jeanne le 21 août 2026)

SQL complet : `supabase/migrations/0001_init.sql`. Toute évolution passe par une nouvelle migration validée.

## Principes
1. **Un foyer (`households`) = l'unité de partage.** De **2 à 10 membres** (couple, famille, coloc).
   Chaque membre reçoit un `slot` 1→10 par ordre d'arrivée, qui fixe sa couleur (1 sky, 2 lavender,
   3 sage, 4 coral, 5 butter… palette de 10 dans `theme.js`), jamais choisie. Le max 10 est garanti en
   base ; le min 2 est une règle d'app : tant que le 2e membre n'a pas accepté, on reste sur l'écran 09.
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

## Tables (16)
| Table | Rôle | Écrans |
|---|---|---|
| `profiles` | prénom, photo, heure de rappel, rappel croisé opt-in | 06, 08, 38 |
| `households` | le foyer, jour/heure du point hebdo, **devise** (défaut USD, modifiable), **Duo+ du foyer** (un seul paie) | 09, 37, 38 |
| `household_members` | qui est dans le foyer, slot couleur, dispos (tap-cycle), temps/semaine | 07, 09b |
| `invitations` | code 6 caractères (lien + QR), expire 7 j, acceptation via RPC `accept_invitation` | 09 |
| `tasks` | fiche tâche : fréquence, durée, importance, mental, mode d'assignation, divisible, fenêtre, dépense associée, note, checklist | 10, 14, 15 |
| `task_pains` | pénibilité **par personne** (aimée/détestée) | 08, 14 |
| `week_plans` | une ligne par semaine planifiée ; `copied_from` = semaine source (pré-remplissage à l'identique) | 10, 19 |
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
  À N membres : part de chacun comparée à la part idéale 1/N (à 2, ça redonne le 50/50 du design).
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

## Réponses de Jeanne (21 août 2026)
1. Duo+ : **un seul paie, tout le foyer en profite** → `households.premium_until` / `premium_by`.
2. **Minimum 2 membres**, maximum 10 (pas de mode solo).
3. **Un seul foyer à la fois** par personne (`unique(user_id)`) ; pour en rejoindre un autre où l'on est invité, on quitte le sien (`leave_household()`), puis on accepte l'invitation.
4. Devise : **USD par défaut, modifiable par foyer** (`households.currency`), copiée dans chaque dépense.
5. **Planning hebdo** : le foyer choisit son jour de planning (`households.plan_weekday`). Première fois à la
   création du duo : saisie de toutes les tâches de la semaine. Chaque semaine suivante est **pré-remplie à
   l'identique de la précédente** (`week_plans.copied_from`), puis ajouts/suppressions libres.
   **Tâches ponctuelles** : ajout jusqu'à 7 jours à l'avance en gratuit, sans limite en Duo+ (règle d'app).

## Impact « jusqu'à 10 » sur le design (à trancher écran par écran)
Le canvas est dessiné pour 2 (« Côté Jeanne », balance à 2 plateaux, wrapped couple, point hebdo à deux).
À 3+ il faudra décider : liste « côté des autres », balance en barres par personne, geste du point hebdo
pour celui qui a le plus de malus. Je le signalerai à chaque écran concerné.
