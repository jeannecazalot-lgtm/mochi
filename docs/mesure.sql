-- ═════════════════════════════════════════════════════════════════
-- Mindpair · lire les chiffres (table app_events, migration 0020)
-- À coller dans Supabase › SQL Editor, une requête à la fois.
-- On exclut toujours : les builds de développement (dev = true) et le compte de démo App Review.
--
-- Moments mesurés :
--   app_open           1re ouverture du jour, par appareil
--   onboarding_done    fin des écrans d'accueil
--   household_created  foyer créé (setup terminé)
--   invite_shared      lien d'invitation partagé
--   partner_joined     le partenaire a rejoint avec le code
--   duo_formed         Mochi éclot (les deux sont là)
--   task_done          mission cochée (props : late, mental)
--   week_planned       « Préparer la semaine » (props : n tâches)
--   recap_opened       récap du dimanche ouvert (props : embedded = dans la Balance)
--   thanks_sent        « Dire merci » depuis le récap
--   paywall_viewed     écran Mochi+ vu (props : from = d'où)
--   purchase_done / purchase_cancelled / purchase_failed (props : offer = pass | month)
--   restore            « Restaurer » (props : success)
-- ═════════════════════════════════════════════════════════════════

-- 0 · base commune : les vrais événements (à créer une fois). Schéma `stats` : pas exposé par l'API de Supabase,
--     donc illisible depuis l'app (une vue dans `public` le serait).
create schema if not exists stats;
revoke all on schema stats from anon, authenticated;
create or replace view stats.v_events as
select e.*
from app_events e
where not e.dev
  and (e.user_id is null or e.user_id not in (select id from auth.users where email = 'review@mindpair.app'));

-- 1 · le tunnel : combien d'appareils / foyers à chaque étape
select
  count(distinct device_id) filter (where name = 'app_open')          as installs_ouverts,
  count(distinct device_id) filter (where name = 'onboarding_done')   as onboarding_fini,
  count(distinct household_id) filter (where name = 'household_created') as foyers_crees,
  count(distinct household_id) filter (where name = 'invite_shared')  as invitations_envoyees,
  count(distinct household_id) filter (where name = 'duo_formed')     as couples_formes,
  count(distinct household_id) filter (where name = 'week_planned')   as semaines_preparees,
  count(distinct household_id) filter (where name = 'purchase_done') as foyers_mochi_plus
from stats.v_events;

-- 2 · rétention : couples encore actifs N jours après leur formation
with duo as (
  select household_id, min(created_at)::date as d0 from stats.v_events where name = 'duo_formed' group by 1
), act as (
  select distinct household_id, created_at::date as d from stats.v_events where name in ('app_open', 'task_done') and household_id is not null
)
select
  count(*) as couples,
  count(*) filter (where exists (select 1 from act a where a.household_id = duo.household_id and a.d between d0 + 1 and d0 + 2)) as actifs_j1_j2,
  count(*) filter (where exists (select 1 from act a where a.household_id = duo.household_id and a.d between d0 + 7 and d0 + 13)) as actifs_semaine_2,
  count(*) filter (where exists (select 1 from act a where a.household_id = duo.household_id and a.d between d0 + 28 and d0 + 34)) as actifs_mois_1
from duo;

-- 3 · Mochi+ : d'où vient l'écran, et combien achètent
select props->>'from' as depuis, count(*) as vues,
  (select count(*) from stats.v_events p where p.name = 'purchase_done') as achats_total
from stats.v_events where name = 'paywall_viewed' group by 1 order by 2 desc;

-- 4 · achats par offre
select name, props->>'offer' as offre, count(*) from stats.v_events
where name in ('purchase_done', 'purchase_cancelled', 'purchase_failed') group by 1, 2 order by 1, 2;

-- 5 · activité par jour (30 derniers jours)
select created_at::date as jour,
  count(distinct device_id) filter (where name = 'app_open') as appareils_actifs,
  count(*) filter (where name = 'task_done') as missions_cochees,
  count(*) filter (where name = 'recap_opened') as recaps_ouverts
from stats.v_events where created_at > now() - interval '30 days' group by 1 order by 1 desc;
