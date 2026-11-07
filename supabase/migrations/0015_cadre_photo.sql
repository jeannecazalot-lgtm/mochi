-- 7 nov 2026 : la photo du couple dans le « cadre photo de vous deux » (choisie dans la pièce de Mochi, visible chez les deux)
alter table mochi_state add column if not exists photo_url text;
