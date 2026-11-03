-- 0014 · Décision Jeanne (tableau de bord, 4 nov 2026) : coucher du foyer à 22 h par défaut (mode nuit automatique)
alter table households alter column bedtime set default '22:00';
update households set bedtime = '22:00' where bedtime = '22:30';
