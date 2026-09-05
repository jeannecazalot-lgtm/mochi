-- 0004 · Un seul malus « raté » par occurrence, même si les deux téléphones
-- balaient les retards en même temps (point fragile relevé par le bot couple,
-- 5 sept 2026). Les malus de décalage (occurrence_id null) restent libres.
-- Côté app, store.push() retombe sur un update après le 23505 : sans effet.
create unique index if not exists malus_une_fois_par_occurrence
  on malus (occurrence_id) where occurrence_id is not null;
