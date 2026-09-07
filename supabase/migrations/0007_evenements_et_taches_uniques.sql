-- 0007 · retours du test humain n°2 (7 sept 2026)
--
-- 1. Événements réels (écran 30) : les détails structurés — lieu, heure affichée, budget,
--    tenue, liste « qui porte quoi » — vivent dans une colonne jsonb, sans nouvelle table.
alter table events add column if not exists details jsonb not null default '{}';

-- 2. Plus jamais deux fois la même tâche du catalogue dans un foyer (les deux téléphones
--    avaient chacun créé « Vaisselle » → deux séries d'occurrences le même jour).
--    L'app réutilise déjà la ligne existante ; cet index est le filet de sécurité serveur.
create unique index if not exists tasks_household_catalog_unique
  on tasks (household_id, catalog_key)
  where catalog_key is not null and deleted_at is null;
