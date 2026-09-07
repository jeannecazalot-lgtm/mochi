-- 0008 · notifications push entre les deux téléphones (7 sept 2026)
-- Chaque profil garde le jeton push Expo de son téléphone ; l'autre membre du foyer
-- (déjà autorisé à lire mon profil) l'utilise pour m'envoyer une notification
-- directement via le service push d'Expo — pas de serveur.
alter table profiles add column if not exists push_token text;
