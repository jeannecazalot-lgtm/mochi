-- 0005 · Duo strict en v1 (décision 5 sept 2026, point 2 laissé à Claude par Jeanne) :
-- les écrans ne connaissent que « moi / le binôme », donc un foyer accueille au plus
-- 2 personnes. Le 3e reçoit 'household_full'. Réversible : remettre 10 ici et dans
-- check_household_size() quand les écrans sauront afficher n membres.
create or replace function accept_invitation(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare inv invitations; free_slot smallint; my_hid uuid; member_count int;
begin
  select * into inv from invitations where code = upper(p_code) and accepted_at is null and expires_at > now();
  if inv.id is null then raise exception 'invitation_invalid'; end if;

  select household_id into my_hid from household_members where user_id = auth.uid();
  if my_hid is not null then
    if my_hid = inv.household_id then raise exception 'already_in_household'; end if;
    select count(*) into member_count from household_members where household_id = my_hid;
    if member_count > 1 then raise exception 'household_not_empty'; end if;
    delete from household_members where user_id = auth.uid();
    delete from households where id = my_hid;
  end if;

  if (select count(*) from household_members where household_id = inv.household_id) >= 2 then raise exception 'household_full'; end if;
  select min(s) into free_slot from generate_series(1,2) s
    where not exists (select 1 from household_members where household_id = inv.household_id and slot = s);
  insert into household_members (household_id, user_id, slot) values (inv.household_id, auth.uid(), free_slot)
    on conflict do nothing;
  update invitations set accepted_by = auth.uid(), accepted_at = now() where id = inv.id;
  return inv.household_id;
end $$;

create or replace function check_household_size() returns trigger language plpgsql as $$
begin
  if (select count(*) from household_members where household_id = new.household_id) >= 2 then
    raise exception 'household_full';
  end if;
  return new;
end $$;
