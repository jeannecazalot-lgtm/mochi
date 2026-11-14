-- 0019 · Synchro des tables de Mochi et des remboursements (14 nov 2026)
-- Constat (préparation du compte de démo App Review) : l'app tire les lignes « updated_at > dernier sync »
-- (src/store.js, pull), mais mochi_events, mochi_inventory, mochi_checkins et settlements n'ont jamais eu
-- cette colonne → la requête échoue en silence et ces tables ne descendent JAMAIS du serveur.
-- Effet chez les couples : un objet acheté, un moment, une humeur, un « on est à zéro » fait sur un
-- téléphone n'apparaît pas sur celui de l'autre. Vérifié en production le 14 nov (erreur 42703 sur les 4).
--
-- Correctif : la colonne + le déclencheur standard. Les lignes existantes reçoivent updated_at = now(),
-- donc le prochain lancement de chaque téléphone les récupère toutes (c'est voulu : la pièce devient commune).
-- Pour ne pas rejouer d'anciens moments plein écran chez l'autre (éclosion, palier, récap de la semaine),
-- les moments déjà existants sont marqués vus par tous les membres actuels du foyer.

alter table mochi_events    add column if not exists updated_at timestamptz not null default now();
alter table mochi_inventory add column if not exists updated_at timestamptz not null default now();
alter table mochi_checkins  add column if not exists updated_at timestamptz not null default now();
alter table settlements     add column if not exists updated_at timestamptz not null default now();

do $$
declare t text;
begin
  foreach t in array array['mochi_events', 'mochi_inventory', 'mochi_checkins', 'settlements'] loop
    execute format('drop trigger if exists %I_updated_at on %I', t, t);
    execute format('create trigger %I_updated_at before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- anciens moments : vus par tout le foyer (seen_by = membres actuels, sans doublon)
update mochi_events e
set seen_by = (
  select array(select distinct u from unnest(e.seen_by || array(select m.user_id from household_members m where m.household_id = e.household_id)) as u)
)
where e.type in ('hatch', 'stage_up', 'week_closed'); -- MOMENTS de src/mochi-state.js
