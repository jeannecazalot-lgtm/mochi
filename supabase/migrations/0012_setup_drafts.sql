-- 0012 · Choix des tâches À DEUX en temps réel (décision Jeanne 15 sept 2026) : la liste en cours de
-- sélection vit dans le foyer, chaque téléphone la voit bouger. status 'done' quand l'un a validé.
create table if not exists setup_drafts (
  household_id  uuid primary key references households(id) on delete cascade,
  tasks         jsonb not null default '[]'::jsonb,   -- [{ id, label, emoji, duration_min, per_week, pain, mental_load, by: [uid] }]
  status        text not null default 'open' check (status in ('open','done')),
  updated_by    uuid references profiles(id),
  updated_at    timestamptz not null default now()
);
alter table setup_drafts enable row level security;
create policy "setup_drafts : membres" on setup_drafts for all using (is_member(household_id)) with check (is_member(household_id));
alter publication supabase_realtime add table setup_drafts;
