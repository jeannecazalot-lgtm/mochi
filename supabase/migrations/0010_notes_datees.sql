-- 0010 · Pense-bête daté (retour Ketley 12 sept 2026 : « choisir la date en mode calendrier et qu'il
-- s'affiche dans notre planning… avec date, rappel, note ») : titre + détail séparés, date facultative,
-- rappel dans le récap du jour, teinte de la carte.
alter table notes
  add column if not exists title    text,
  add column if not exists due_date date,
  add column if not exists remind   boolean not null default false,
  add column if not exists tone     int not null default 0;
