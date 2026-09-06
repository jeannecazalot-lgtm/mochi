-- 0007 · Catégories de dépense alignées sur l'app (6 sept 2026) : la sheet propose
-- Courses / Sorties / Maison / Enfants / Santé / Autre, l'enum n'en connaissait que 4
-- (« factures » reste, inutilisée par l'app). Sans ce script, une dépense « Maison »,
-- « Enfants » ou « Santé » est refusée (22P02) et jetée de la file de synchro.
alter type expense_cat add value if not exists 'maison';
alter type expense_cat add value if not exists 'enfants';
alter type expense_cat add value if not exists 'sante';
