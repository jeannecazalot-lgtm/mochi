-- 0020 · Mesure minimale (Jeanne, 15 nov 2026 : « savoir ce que font les gens une fois l'app sortie »)
-- Quelques moments clés (ouverture du jour, couple formé, récap ouvert, écran Mochi+ vu, achat…), dans une table
-- à nous : pas d'outil tiers, pas de publicité, rien de revendu. L'app ÉCRIT seulement ; personne ne lit depuis l'app.
-- Les chiffres se lisent dans l'éditeur SQL (docs/mesure.sql).
-- ⚠ Avant de publier la mise à jour qui écrit ici : déclarer « Product Interaction » (Analytics, lié, pas de pistage)
--   dans App Privacy.

create table if not exists app_events (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  name         text not null check (char_length(name) between 1 and 40),
  user_id      uuid references auth.users(id) on delete cascade default auth.uid(),  -- compte supprimé = ses événements aussi
  household_id uuid references households(id) on delete set null,
  device_id    uuid,                         -- identifiant d'installation tiré au hasard par l'app (pas l'IDFA)
  props        jsonb not null default '{}',
  app_version  text,
  platform     text,
  dev          boolean not null default false -- envoyés depuis un build de développement : à exclure des chiffres
);

alter table app_events enable row level security;

-- écrire : pour soi-même, ou sans compte (avant la connexion : onboarding, première ouverture)
drop policy if exists app_events_insert on app_events;
create policy app_events_insert on app_events for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
-- aucune politique de lecture : l'app ne relit jamais ces lignes

create index if not exists app_events_name_created on app_events (name, created_at);
create index if not exists app_events_household on app_events (household_id);
