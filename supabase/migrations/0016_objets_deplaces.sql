-- 8 nov 2026 : objets déplacés au doigt dans la pièce (fractions de la scène : centre de l'objet), partagés par le foyer
alter table mochi_inventory add column if not exists pos_x real, add column if not exists pos_y real;
