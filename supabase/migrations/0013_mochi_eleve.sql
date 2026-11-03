-- 0013 · « Mochi qu'on élève » (décision Jeanne 3 nov 2026) — recette docs/recettes/da-v2-mochi-eleve.md §1
-- Un Mochi par foyer. La vérité = mochi_events (journal) ; mochi_state = l'état courant (cache lisible d'un coup).
-- L'énergie du jour n'a PAS de table : dérivée des occurrences du jour (faites / prévues) comme la balance.
-- NON APPLIQUÉE tant que Jeanne n'a pas validé le modèle.

-- ── 1 · l'état courant de Mochi (une ligne par foyer, créée avec le foyer) ─────────────────────
create table if not exists mochi_state (
  household_id   uuid primary key references households(id) on delete cascade,
  name           text not null default 'Mochi',
  stage          text not null default 'egg' check (stage in ('egg','mini','mochi','maxi','dore')),
  hatched_at     timestamptz,                                   -- éclosion : chacun a coché sa 1re mission
  healthy_weeks  smallint not null default 0,                   -- semaines saines cumulées (jamais consécutives)
  hearts         smallint not null default 5 check (hearts between 1 and 5),   -- plancher 1 : il ne meurt pas
  pearls         integer  not null default 0 check (pearls >= 0),              -- perles communes au foyer (cache de la somme des événements)
  walk_status    text not null default 'home' check (walk_status in ('home','away')),
  walk_started_at timestamptz,
  walk_returns_at timestamptz,                                  -- + 2 h (petite balade : + 1 h)
  updated_at     timestamptz not null default now()
);
create trigger mochi_state_updated before update on mochi_state for each row execute function set_updated_at();

-- ── 2 · le journal : tout ce qui arrive à Mochi (vérité, et source des écrans plein écran) ─────
create table if not exists mochi_events (
  id             uuid primary key,
  household_id   uuid not null references households(id) on delete cascade,
  type           text not null check (type in (
                   'hatch',            -- éclosion
                   'walk_start',       -- jauge pleine → balade (payload.kind = 'full' | 'small')
                   'walk_return',      -- retour : payload.souvenir_key, payload.place, payload.pearls
                   'stage_up',         -- payload.from, payload.to
                   'heart_lost',       -- ratée : occurrence_id
                   'heart_gained',     -- rattrapage (occurrence_id) ou journée pleine
                   'pearls',           -- payload.delta (+3 mission, +4 mentale, +5 à deux, +12 balade, +1 check-in, +30 quête, −prix achat)
                   'week_closed',      -- payload.week_start, payload.healthy, payload.done_pct, payload.gap_pct, payload.sick
                   'sick',             -- cœurs = 1 : « Mochi a besoin de vous deux »
                   'quest_done')),     -- V3
  actor_id       uuid references profiles(id),                  -- null = Mochi lui-même
  occurrence_id  uuid references occurrences(id) on delete set null,
  payload        jsonb not null default '{}',
  seen_by        uuid[] not null default '{}',                  -- les moments plein écran sont montrés à CHACUN (hatch, walk_return, stage_up)
  created_at     timestamptz not null default now()
);
create index if not exists mochi_events_household_created on mochi_events (household_id, created_at desc);
create unique index if not exists mochi_events_one_week on mochi_events (household_id, (payload->>'week_start')) where type = 'week_closed';
create unique index if not exists mochi_events_one_heart_per_occ on mochi_events (occurrence_id, type) where type in ('heart_lost','heart_gained');

-- ── 3 · l'inventaire du foyer : souvenirs ramenés, objets et tenues achetés (le catalogue est dans l'app) ──
create table if not exists mochi_inventory (
  id             uuid primary key,
  household_id   uuid not null references households(id) on delete cascade,
  item_key       text not null,                                 -- clé du catalogue (data/mochi-items.json)
  kind           text not null check (kind in ('souvenir','object','outfit')),
  source         text not null check (source in ('walk','shop','gift')),
  placed         boolean not null default true,                 -- posé dans la pièce / rangé
  event_id       uuid references mochi_events(id) on delete set null,
  acquired_by    uuid references profiles(id),
  acquired_at    timestamptz not null default now(),
  unique (household_id, item_key)
);

-- ── 4 · le check-in d'humeur quotidien (remplace mood_checkins hebdo, qui reste en place sans usage) ──
create table if not exists mochi_checkins (
  id             uuid primary key,
  household_id   uuid not null references households(id) on delete cascade,
  user_id        uuid not null references profiles(id),
  day            date not null,
  moment         text not null default 'morning' check (moment in ('morning','evening')),
  mood           smallint not null check (mood between 1 and 3),   -- 1 chargé·e · 2 ça va · 3 léger·ère
  created_at     timestamptz not null default now(),
  unique (household_id, user_id, day, moment)
);

-- ── réglages : mode nuit par personne, heure de coucher du foyer (mode nuit automatique) ──────
alter table profiles   add column if not exists night_mode text not null default 'auto' check (night_mode in ('auto','on','off'));
alter table households add column if not exists bedtime time not null default '22:00';   -- 22 h : décision Jeanne 4 nov 2026 (appliqué en 0014)

-- ── sécurité : membres du foyer, comme partout ───────────────────────────────────────────────
alter table mochi_state     enable row level security;
alter table mochi_events    enable row level security;
alter table mochi_inventory enable row level security;
alter table mochi_checkins  enable row level security;
create policy "mochi_state : membres"     on mochi_state     for all using (is_member(household_id)) with check (is_member(household_id));
create policy "mochi_events : membres"    on mochi_events    for all using (is_member(household_id)) with check (is_member(household_id));
create policy "mochi_inventory : membres" on mochi_inventory for all using (is_member(household_id)) with check (is_member(household_id));
create policy "mochi_checkins : membres"  on mochi_checkins  for select using (is_member(household_id));
create policy "mochi_checkins : les miens" on mochi_checkins for insert with check (is_member(household_id) and user_id = auth.uid());
create policy "mochi_checkins : je modifie le mien" on mochi_checkins for update using (user_id = auth.uid());

-- ── temps réel : les deux téléphones voient Mochi bouger ────────────────────────────────────
alter publication supabase_realtime add table mochi_state;
alter publication supabase_realtime add table mochi_events;

-- ── l'œuf naît avec le foyer ───────────────────────────────────────────────────────────────
create or replace function create_mochi_for_household() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into mochi_state (household_id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger households_mochi after insert on households for each row execute function create_mochi_for_household();
insert into mochi_state (household_id) select id from households where deleted_at is null on conflict do nothing;
