-- Nettoyage ponctuel (7 sept 2026) : fusionne les tâches en double d'un même foyer
-- (même catalog_key). On garde la plus ancienne ; les occurrences de la copie sont
-- rattachées à l'originale (sauf collision même jour → supprimées), puis la copie est effacée.
-- À exécuter UNE fois dans l'éditeur SQL, AVANT la migration 0007 (sinon l'index refuse).
with dup as (
  select id, household_id, catalog_key,
         first_value(id) over (partition by household_id, catalog_key order by created_at) as keep_id
  from tasks
  where catalog_key is not null and deleted_at is null
), copies as (
  select id as copy_id, keep_id from dup where id <> keep_id
)
-- 1. occurrences de la copie qui n'entrent pas en collision → rattachées à l'originale
, moved as (
  update occurrences o set task_id = c.keep_id
  from copies c
  where o.task_id = c.copy_id
    and not exists (select 1 from occurrences k where k.task_id = c.keep_id and k.due_date = o.due_date and k.kind = o.kind)
  returning o.id
)
-- 2. le reste (collisions) est supprimé avec la copie (cascade)
delete from tasks t using copies c where t.id = c.copy_id;
