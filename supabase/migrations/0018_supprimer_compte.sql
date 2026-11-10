-- 0018 · Supprimer son compte depuis l'app (Apple 5.1.1(v), 10 nov 2026).
-- 1) les foyers où je suis seul(e) disparaissent (cascade sur tout leur contenu) ;
-- 2) dans un foyer partagé, ce qui doit rester (tâches créées, dépenses payées…) passe à l'autre membre,
--    les références facultatives deviennent vides ; mes lignes à moi (membre, pénibilités) partent en cascade ;
-- 3) mon compte d'authentification est supprimé (profil en cascade).
create or replace function delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
declare
  me uuid := auth.uid();
  r record;
  has_hid boolean;
begin
  if me is null then raise exception 'not_authenticated'; end if;

  delete from households h
   where h.id in (select household_id from household_members where user_id = me)
     and not exists (select 1 from household_members m where m.household_id = h.id and m.user_id <> me);

  for r in
    select c.conrelid::regclass as tbl, c.conrelid as relid, a.attname as col, a.attnotnull as notnull, c.confdeltype as deltype
      from pg_constraint c
      join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
     where c.contype = 'f' and c.confrelid = 'public.profiles'::regclass
  loop
    continue when r.deltype = 'c'; -- déjà en cascade (household_members, task_pains)
    select exists (select 1 from pg_attribute where attrelid = r.relid and attname = 'household_id' and not attisdropped) into has_hid;
    if not r.notnull then
      execute format('update %s set %I = null where %I = $1', r.tbl, r.col, r.col) using me;
    elsif r.tbl::text = 'households' then
      execute format('update households h set %I = (select m.user_id from household_members m where m.household_id = h.id and m.user_id <> $1 limit 1) where %I = $1', r.col, r.col) using me;
    elsif has_hid then
      execute format('update %s t set %I = (select m.user_id from household_members m where m.household_id = t.household_id and m.user_id <> $1 limit 1) where %I = $1', r.tbl, r.col, r.col) using me;
    else
      execute format('delete from %s where %I = $1', r.tbl, r.col) using me;
    end if;
  end loop;

  delete from auth.users where id = me;
end $$;

revoke all on function delete_my_account() from public;
grant execute on function delete_my_account() to authenticated;
