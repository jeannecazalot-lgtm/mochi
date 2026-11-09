-- 9 nov 2026 (Jeanne : « pourquoi moi je choisis pas les missions aussi ? ») : la répartition ne part que quand
-- les deux ont validé la liste. ready = uid de celles et ceux qui ont tapé « C'est bon pour moi ».
alter table setup_drafts add column if not exists ready jsonb not null default '[]'::jsonb;
