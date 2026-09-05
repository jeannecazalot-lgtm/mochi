-- 0006 · Le garde-fou de taille ne doit compter que les NOUVEAUX membres.
-- Vu à l'écran le 5 sept 2026 : le rejoignant renvoie sa ligne membre (dispos du 07)
-- → INSERT idempotent → le trigger BEFORE INSERT lève 'household_full' avant même
-- la violation de clé primaire, la file de synchro se bloque.
create or replace function check_household_size() returns trigger language plpgsql as $$
begin
  if exists (select 1 from household_members where household_id = new.household_id and user_id = new.user_id) then
    return new; -- déjà membre : la clé primaire fera son travail (23505 → update côté app)
  end if;
  if (select count(*) from household_members where household_id = new.household_id) >= 2 then
    raise exception 'household_full';
  end if;
  return new;
end $$;
