-- ═══════════════════════════════════════════════════════════════════
-- mochi · schéma initial — PROPOSITION À VALIDER (21 août 2026)
-- Ne pas appliquer avant validation de Jeanne (docs/MODELE_DONNEES.md).
-- Conventions :
--  · toutes les tables métier portent household_id → partage couple/foyer
--  · id uuid généré CÔTÉ CLIENT (offline-first : on crée hors ligne, on
--    upsert au retour réseau, idempotent)
--  · updated_at + deleted_at (soft delete) sur tout → synchro incrémentale
--  · RLS : un membre du foyer voit/écrit tout ce qui est dans son foyer
-- ═══════════════════════════════════════════════════════════════════
create extension if not exists pgcrypto;

-- ─── enums ──────────────────────────────────────────────────────────
create type frequency     as enum ('daily','weekly','biweekly','monthly','once');
create type assign_mode   as enum ('auto','fixed','alternate');
create type occ_status    as enum ('pending','done','missed','skipped');
create type occ_kind      as enum ('exec','plan');          -- tâche mentale : planifier ≠ exécuter
create type swap_status   as enum ('pending','accepted','refused');
create type activity_type as enum ('ping','ping_reply','task_done','task_missed','swap_requested',
                                   'swap_accepted','swap_refused','event_created','expense_added',
                                   'mochi_moment','weekly_review','badge_earned');
create type expense_cat   as enum ('courses','sorties','factures','autre');
create type member_slot   as enum ('a','b');                -- a = sky, b = lavender (auto)

-- ─── profils (1 ↔ 1 avec auth.users) ────────────────────────────────
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  first_name    text not null default '',
  avatar_url    text,                                        -- Storage bucket « avatars »
  reminder_time time,                                        -- heure de rappel perso (écran 08)
  cross_reminder_optin boolean not null default false,       -- rappel croisé (écran 38)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── foyers (« session » du SPECS) ──────────────────────────────────
create table households (
  id              uuid primary key,
  name            text,
  created_by      uuid not null references profiles(id),
  review_weekday  smallint not null default 0 check (review_weekday between 0 and 6), -- 0 = dimanche
  review_time     time not null default '20:00',
  currency        text not null default 'USD',               -- modifiable par le foyer (écran 38)
  premium_until   timestamptz,                               -- Duo+ : un seul paie, tout le foyer en profite
  premium_by      uuid references profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

create table household_members (
  household_id    uuid not null references households(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,
  slot            smallint not null check (slot between 1 and 10), -- couleur auto par ordre d'arrivée (1 sky, 2 lavender, 3 sage…)
  availability    jsonb not null default '{}',               -- {"mon":[0,1,2,...]} tap-cycle 0/1/2 par créneau (écran 07)
  weekly_minutes  int not null default 300,                  -- slider temps/semaine (écran 07)
  joined_at       timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  primary key (household_id, user_id),
  unique (household_id, slot),
  unique (user_id)                                           -- UN SEUL foyer à la fois (décision Jeanne) : on quitte avant d'en rejoindre un autre
);
-- 2 à 10 membres : le max est garanti ici, le min (2) est une règle d'app (l'app attend le 2e membre)
create or replace function check_household_size() returns trigger language plpgsql as $$
begin
  if (select count(*) from household_members where household_id = new.household_id) >= 10 then
    raise exception 'household_full';
  end if;
  return new;
end $$;
create trigger household_size before insert on household_members for each row execute function check_household_size();

-- ─── invitations (écran 09 / 09b) ───────────────────────────────────
create table invitations (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  code          text not null unique,                        -- 6 car. lisibles, dans le lien + QR
  created_by    uuid not null references profiles(id),
  expires_at    timestamptz not null default now() + interval '7 days',
  accepted_by   uuid references profiles(id),
  accepted_at   timestamptz,
  created_at    timestamptz not null default now()
);

-- ─── tâches (catalogue actif du foyer, écran 14/15) ─────────────────
create table tasks (
  id              uuid primary key,
  household_id    uuid not null references households(id) on delete cascade,
  title           text not null,
  emoji           text not null default '•',
  catalog_key     text,                                      -- clé du catalogue préfait, null si custom
  frequency       frequency not null default 'weekly',
  duration_min    int not null default 15 check (duration_min > 0),
  importance      smallint not null default 3 check (importance between 1 and 5),
  mental_load     boolean not null default false,            -- ×1,5 sur le score
  assign_mode     assign_mode not null default 'auto',
  fixed_assignee  uuid references profiles(id),              -- si assign_mode = fixed
  divisible       boolean not null default false,            -- splitable matin/soir
  window_start    time,                                      -- fenêtre d'exécution
  window_end      time,
  window_days     smallint[] ,                               -- jours autorisés (0-6), null = tous
  has_expense     boolean not null default false,            -- coche → dépense → Budget
  note            text,
  checklist       jsonb not null default '[]',               -- [{"label":"...","done":false}]
  active          boolean not null default true,
  created_by      uuid not null references profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

-- pénibilité PAR PERSONNE (écran 08 : aimées / détestées)
create table task_pains (
  task_id   uuid not null references tasks(id) on delete cascade,
  user_id   uuid not null references profiles(id) on delete cascade,
  pain      smallint not null check (pain between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (task_id, user_id)
);

-- ─── occurrences (instances datées — c'est ici que vit la balance) ──
create table occurrences (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  task_id       uuid not null references tasks(id) on delete cascade,
  kind          occ_kind not null default 'exec',
  due_date      date not null,
  due_at        timestamptz,                                  -- fin de fenêtre (tolérance calculée côté client)
  assignee_id   uuid references profiles(id),                 -- null = commun/divisible non tranché
  status        occ_status not null default 'pending',
  done_at       timestamptz,
  done_by       uuid references profiles(id),
  -- copie figée au moment du « done » : la balance ne bouge pas si la fiche change après
  duration_min  int,
  pain          smallint,
  mental_load   boolean,
  expense_id    uuid,                                         -- fk posée après création d'expenses
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  unique (task_id, due_date, kind)
);
create index occurrences_household_due on occurrences (household_id, due_date);

-- ─── repassage (SPECS §6) ───────────────────────────────────────────
create table swap_requests (
  id              uuid primary key,
  household_id    uuid not null references households(id) on delete cascade,
  occurrence_id   uuid not null references occurrences(id) on delete cascade,
  from_user       uuid not null references profiles(id),
  to_user         uuid not null references profiles(id),
  status          swap_status not null default 'pending',
  created_at      timestamptz not null default now(),
  resolved_at     timestamptz,
  updated_at      timestamptz not null default now()
);

-- ─── fil Activité (pings préformatés + événements + moments Mochi) ──
create table activity (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  type          activity_type not null,
  actor_id      uuid references profiles(id),                -- null = Mochi
  target_id     uuid references profiles(id),
  occurrence_id uuid references occurrences(id) on delete set null,
  preset_key    text,                                        -- clé copy.json du message préformaté (zéro texte libre)
  payload       jsonb not null default '{}',
  read_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index activity_household_created on activity (household_id, created_at desc);

-- ─── malus + point hebdo (décision récente : réglés chaque semaine) ─
create table malus (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  user_id       uuid not null references profiles(id),
  occurrence_id uuid references occurrences(id) on delete set null,
  points        numeric(6,2) not null,                       -- importance × (1 + retard_j × 0.5)
  week_start    date not null,                               -- lundi de la semaine
  review_id     uuid,                                        -- null tant que non réglé
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table weekly_reviews (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  week_start    date not null,
  debtor_id     uuid references profiles(id),                -- celui qui a le plus de malus (null = égalité)
  gesture       text,                                        -- geste symbolique choisi (exemple suggéré ou saisi)
  settled_by    uuid references profiles(id),
  settled_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (household_id, week_start)
);
alter table malus add constraint malus_review_fk foreign key (review_id) references weekly_reviews(id) on delete set null;

-- ─── Budget (Tricount) ──────────────────────────────────────────────
create table expenses (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  title         text not null,
  emoji         text,
  amount_cents  int not null check (amount_cents > 0),
  currency      text not null,                               -- copiée du foyer au moment de la saisie
  paid_by       uuid not null references profiles(id),
  split_mode    text not null default 'equal' check (split_mode in ('equal','payer_only','custom')),
  split         jsonb,                                       -- custom : {"<user_id>": cents}
  category      expense_cat not null default 'autre',
  spent_on      date not null default current_date,
  occurrence_id uuid references occurrences(id) on delete set null, -- « via tâche »
  created_by    uuid not null references profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);
alter table occurrences add constraint occurrences_expense_fk foreign key (expense_id) references expenses(id) on delete set null;

create table settlements (                                   -- « On est à zéro »
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  from_user     uuid not null references profiles(id),
  to_user       uuid not null references profiles(id),
  amount_cents  int not null,
  settled_at    timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- ─── événements sociaux (écran 30) & pense-bête (écran 32, Duo+) ───
create table events (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  title         text not null,
  emoji         text,
  starts_at     timestamptz not null,
  ends_at       timestamptz,
  who           uuid[] not null default '{}',                -- participants
  note          text,
  created_by    uuid not null references profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create table notes (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  body          text not null,
  done          boolean not null default false,
  created_by    uuid not null references profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

-- ─── mood check-in (écran 33, Duo+) ─────────────────────────────────
create table mood_checkins (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  user_id       uuid not null references profiles(id),
  week_start    date not null,
  mood          smallint not null check (mood between 1 and 5),
  created_at    timestamptz not null default now(),
  unique (household_id, user_id, week_start)
);

-- ─── wrapped hebdo & badges ─────────────────────────────────────────
create table wraps (
  id            uuid primary key,
  household_id  uuid not null references households(id) on delete cascade,
  week_start    date not null,
  data          jsonb not null,                              -- chiffres figés (calculés depuis occurrences)
  generated_at  timestamptz not null default now(),
  unique (household_id, week_start)
);

create table badges (
  household_id  uuid not null references households(id) on delete cascade,
  key           text not null,                               -- streak_7, streak_14, streak_30, streak_100
  earned_at     timestamptz not null default now(),
  primary key (household_id, key)
);

-- ═══════════════════════════════════════════════════════════════════
-- updated_at automatique
-- ═══════════════════════════════════════════════════════════════════
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$ declare t text;
begin
  foreach t in array array['profiles','households','household_members','tasks','task_pains','occurrences',
    'swap_requests','activity','malus','weekly_reviews','expenses','events','notes']
  loop
    execute format('create trigger %I_updated_at before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- profil créé automatiquement à l'inscription
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, first_name) values (new.id, coalesce(new.raw_user_meta_data->>'first_name',''));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- ═══════════════════════════════════════════════════════════════════
-- RLS
-- ═══════════════════════════════════════════════════════════════════
create or replace function is_member(h uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from household_members where household_id = h and user_id = auth.uid());
$$;

-- quitter son foyer (pour en rejoindre un autre) : supprime sa ligne de membre
create or replace function leave_household() returns void
language sql security definer set search_path = public as $$
  delete from household_members where user_id = auth.uid();
$$;

create or replace function my_households() returns setof uuid
language sql stable security definer set search_path = public as $$
  select household_id from household_members where user_id = auth.uid();
$$;

alter table profiles enable row level security;
create policy "profil : moi + mes co-membres" on profiles for select
  using (id = auth.uid() or id in (select user_id from household_members where household_id in (select my_households())));
create policy "profil : je modifie le mien" on profiles for update using (id = auth.uid());

alter table households enable row level security;
create policy "foyer : lecture membres" on households for select using (is_member(id));
create policy "foyer : création par soi" on households for insert with check (created_by = auth.uid());
create policy "foyer : modif membres" on households for update using (is_member(id));

alter table household_members enable row level security;
create policy "membres : lecture co-membres" on household_members for select using (is_member(household_id));
create policy "membres : je m'ajoute (créateur)" on household_members for insert
  with check (user_id = auth.uid() and exists (select 1 from households where id = household_id and created_by = auth.uid()));
create policy "membres : je modifie ma ligne" on household_members for update using (user_id = auth.uid());
create policy "membres : je quitte" on household_members for delete using (user_id = auth.uid());

alter table invitations enable row level security;
create policy "invit : membres" on invitations for select using (is_member(household_id));
create policy "invit : création par membre" on invitations for insert with check (is_member(household_id) and created_by = auth.uid());

-- acceptation par code : RPC security definer (l'invité n'est pas encore membre)
create or replace function accept_invitation(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare inv invitations; free_slot smallint;
begin
  select * into inv from invitations where code = upper(p_code) and accepted_at is null and expires_at > now();
  if inv.id is null then raise exception 'invitation_invalid'; end if;
  if exists (select 1 from household_members where user_id = auth.uid()) then raise exception 'already_in_household'; end if;
  if (select count(*) from household_members where household_id = inv.household_id) >= 10 then raise exception 'household_full'; end if;
  select min(s) into free_slot from generate_series(1,10) s
    where not exists (select 1 from household_members where household_id = inv.household_id and slot = s);
  insert into household_members (household_id, user_id, slot) values (inv.household_id, auth.uid(), free_slot)
    on conflict do nothing;
  update invitations set accepted_by = auth.uid(), accepted_at = now() where id = inv.id;
  return inv.household_id;
end $$;

-- politique générique « membre du foyer = tous droits » pour les tables métier
do $$ declare t text;
begin
  foreach t in array array['tasks','task_pains','occurrences','swap_requests','activity','malus','weekly_reviews',
    'expenses','settlements','events','notes','mood_checkins','wraps','badges']
  loop
    execute format('alter table %I enable row level security', t);
    if t = 'task_pains' then
      execute 'create policy "pains : membres" on task_pains for all
        using (exists (select 1 from tasks where id = task_id and is_member(household_id)))
        with check (exists (select 1 from tasks where id = task_id and is_member(household_id)))';
    else
      execute format('create policy "%s : membres" on %I for all using (is_member(household_id)) with check (is_member(household_id))', t, t);
    end if;
  end loop;
end $$;

-- ─── Realtime : les 2 téléphones se voient ─────────────────────────
alter publication supabase_realtime add table tasks, occurrences, swap_requests, activity, malus, weekly_reviews, expenses, events, notes, household_members;

-- ─── Storage : avatars (bucket public en lecture, écriture par soi) ─
insert into storage.buckets (id, name, public) values ('avatars','avatars', true) on conflict do nothing;
create policy "avatar : upload par soi" on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar : modif par soi" on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatar : lecture publique" on storage.objects for select using (bucket_id = 'avatars');
