-- 0009 · Seuils d'alerte du duo (retour Jeanne 8 sept 2026 : « seuils d'alerte, rien n'est
-- cliquable »). Communs au foyer, modifiables par ses membres (policy « foyer : modif membres »).
alter table households
  add column if not exists threshold_warn_pct  int not null default 10 check (threshold_warn_pct between 5 and 45),
  add column if not exists threshold_alert_pct int not null default 25 check (threshold_alert_pct between 10 and 50);
