-- 0002 · Le créateur d'un foyer peut le lire avant d'en être membre.
-- Corrige le deadlock RLS constaté le 1er sept 2026 : la policy d'insertion de
-- household_members (« je m'ajoute (créateur) ») vérifie EXISTS(households…),
-- mais la lecture de households exigeait d'être déjà membre → impossible de
-- s'ajouter à son propre foyer, la synchro du setup s'arrêtait là.
drop policy "foyer : lecture membres" on households;
create policy "foyer : lecture membres ou créateur" on households for select
  using (is_member(id) or created_by = auth.uid());
