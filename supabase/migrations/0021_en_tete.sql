-- 0021 · « En tête » : la saisie express du « j'y ai pensé » (modèle validé par Jeanne le 15 nov 2026).
-- Une pensée = un texte court, qui y a pensé, quand. Cochée (done_at) ou transformée en tâche (task_id),
-- elle disparaît chez les deux. Lisible et modifiable par les membres du foyer seulement.
-- La Balance compte les pensées de la semaine par personne (ligne à part, hors pourcentages).

create table if not exists thoughts (
  id           uuid primary key,
  household_id uuid not null references households(id) on delete cascade,
  created_by   uuid not null references profiles(id) on delete cascade default auth.uid(),
  text         text not null check (char_length(text) between 1 and 140),
  done_by      uuid references profiles(id) on delete set null,
  done_at      timestamptz,
  task_id      uuid references tasks(id) on delete set null,   -- « en faire une tâche »
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()          -- synchro (src/store.js, pull)
);
create index if not exists thoughts_household_created on thoughts (household_id, created_at desc);

drop trigger if exists thoughts_updated_at on thoughts;
create trigger thoughts_updated_at before update on thoughts for each row execute function set_updated_at();

alter table thoughts enable row level security;
drop policy if exists "thoughts : membres" on thoughts;
create policy "thoughts : membres" on thoughts for all using (is_member(household_id)) with check (is_member(household_id));

alter publication supabase_realtime add table thoughts;
