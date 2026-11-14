-- =====================================================================
-- Mindpair · App Review demo household ("Alex & Sam")
--
-- Run by hand in the Supabase SQL editor (role postgres, RLS bypassed),
-- right before each App Review / TestFlight submission. Idempotent:
-- re-running wipes ONLY the demo household (fixed id below) and rebuilds it,
-- with every date relative to "today" in c_tz.
--
-- Prerequisite: the auth user review@mindpair.app exists (Dashboard >
-- Authentication > Add user, password set, "Auto Confirm User" ticked).
--
-- What the reviewer (Alex) gets: Mochi hatched last Monday-week (12 days ago
-- when run on a Saturday), a full week of history + this week, both partners
-- active, 3 missions for Alex today (+ one late together task), one mission
-- done by Sam this morning, a pending hand-off request, a reminder from Sam,
-- expenses, an event, the next 7 days planned.
-- Last week is deliberately left UNCLOSED (c_preclose = false): the app
-- closes it itself on first open and shows the weekly recap once.
-- c_tz must be the reviewer's time zone; run it while it is daytime there.
-- =====================================================================
do $seed$
declare
  -- ── settings ────────────────────────────────────────────────────────
  c_tz           constant text    := 'America/Los_Angeles'; -- reviewer's device time zone (dates + times)
  c_preclose     constant boolean := false;  -- true = seed last week's week_closed (see report before switching)
  c_review_email constant text    := 'review@mindpair.app';
  c_hid          constant uuid    := '7e7e7e7e-0000-4000-8000-00000000a001'; -- demo household
  c_sam          constant uuid    := '7e7e7e7e-0000-4000-8000-00000000b002'; -- demo partner (anonymous auth user)
  c_ns           constant text    := 'mindpair-review-demo:';                 -- namespace of every derived uuid
  c_reserve      constant int     := 50;     -- pearls always left for the reviewer to buy something

  v_alex uuid;
  v_cap  timestamptz := now() - interval '2 minutes';  -- nothing is ever dated in the future
  d0 date; w0 int; mon_this date; mon_last date; d_created date; d_g date;
  v_created_ts timestamptz; v_join_ts timestamptz; v_hatch_ts timestamptz;
  v_occ_a uuid; v_occ_b uuid; v_occ_c uuid; v_occ_ped uuid; v_occ_trash uuid;
  v_lost_a_ts timestamptz; v_done_a_ts timestamptz; v_lost_b_ts timestamptz;
  v_exp_groc uuid;
  -- last-week figures (same formula as closeWeekIfNeeded in src/mochi-state.js)
  v_done int; v_missed int; v_ma numeric; v_ms numeric; v_mb numeric; v_np int;
  v_done_pct numeric; v_gap numeric; v_healthy boolean; v_counts boolean;
  v_hw int := 0; v_hearts int; v_pearls int; v_bal int; v_ev uuid;
  v_slot_ts timestamptz[]; v_slot_who uuid[];
  v_wish_key text[] := array['beret', 'chewinggum', 'cheval'];  -- all stage 'mini', non-Mochi+ items
  v_wish_kind text[] := array['outfit', 'object', 'object'];
  v_wish_price int[] := array[80, 40, 90];    -- prices from src/data/mochi-items.json
  v_owned text[] := '{}';
  i int; j int; r record; v_other uuid;
begin
  -- ── 0 · who and when ──────────────────────────────────────────────────
  select id into v_alex from auth.users where lower(email) = c_review_email limit 1;
  if v_alex is null then
    raise exception 'Demo seed: auth user % not found. Create it first (Dashboard > Authentication > Add user, Auto Confirm).', c_review_email;
  end if;
  select household_id into v_other from public.household_members where user_id = v_alex and household_id <> c_hid;
  if v_other is not null then
    raise exception 'Demo seed: % already belongs to household % (one household per person). Remove that membership by hand, then re-run.', c_review_email, v_other;
  end if;
  select household_id into v_other from public.household_members where user_id = c_sam and household_id <> c_hid;
  if v_other is not null then
    raise exception 'Demo seed: demo partner % is in household %. Aborting.', c_sam, v_other;
  end if;

  d0        := (now() at time zone c_tz)::date;          -- the reviewer's "today"
  w0        := extract(isodow from d0)::int - 1;         -- 0 = Monday … 6 = Sunday (app convention)
  mon_this  := d0 - w0;
  mon_last  := mon_this - 7;
  d_created := mon_last - 1;                             -- Alex created the household the Sunday before last week
  v_created_ts := ((d_created + time '20:10') at time zone c_tz);
  v_join_ts    := ((mon_last + time '07:28') at time zone c_tz);  -- Sam joined last Monday morning
  v_hatch_ts   := v_join_ts + interval '1 minute';       -- hatches when the duo is formed (Balance: "week 2")

  -- ── 1 · RESET: only the demo household (everything below cascades from it) ──
  delete from public.households where id = c_hid;

  -- ── 2 · people ────────────────────────────────────────────────────────
  -- Sam = anonymous auth user with a fixed id (profiles.id references auth.users)
  if not exists (select 1 from auth.users where id = c_sam) then
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
      raw_app_meta_data, raw_user_meta_data, is_anonymous, is_sso_user, created_at, updated_at, last_sign_in_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      email_change_token_current, phone_change, phone_change_token, reauthentication_token)
    values ('00000000-0000-0000-0000-000000000000', c_sam, 'authenticated', 'authenticated', null, '',
      '{"provider":"anonymous","providers":["anonymous"]}'::jsonb, '{"first_name":"Sam"}'::jsonb, true, false,
      v_created_ts, v_created_ts, v_join_ts,
      '', '', '', '', '', '', '', '');
  end if;
  -- profiles (normally created by on_auth_user_created; upsert to be safe)
  insert into public.profiles (id, first_name, reminder_time) values (v_alex, 'Alex', '20:00')
    on conflict (id) do update set first_name = 'Alex', reminder_time = '20:00';
  insert into public.profiles (id, first_name, avatar_url, reminder_time, push_token) values (c_sam, 'Sam', null, '19:30', null)
    on conflict (id) do update set first_name = 'Sam', avatar_url = null, reminder_time = '19:30', push_token = null;

  -- ── 3 · household, members, invitation (mochi_state row is created by trigger) ──
  insert into public.households (id, name, created_by, currency, bedtime, threshold_warn_pct, threshold_alert_pct, created_at)
    values (c_hid, 'Alex & Sam', v_alex, 'USD', '22:00', 10, 25, v_created_ts);
  insert into public.household_members (household_id, user_id, slot, availability, weekly_minutes, joined_at) values
    (c_hid, v_alex, 1, '{"morning":[1,0,1,0,1,2,2],"evening":[2,2,1,2,1,1,2]}'::jsonb, 300, v_created_ts),
    (c_hid, c_sam,  2, '{"morning":[0,1,0,1,0,2,1],"evening":[1,2,2,1,2,2,1]}'::jsonb, 300, v_join_ts);
  insert into public.invitations (id, household_id, code, created_by, expires_at, accepted_by, accepted_at, created_at)
    values (md5(c_ns || 'invite')::uuid, c_hid, 'RVW7DM', v_alex, v_created_ts + interval '7 days', c_sam, v_join_ts, v_created_ts + interval '4 minutes')
    on conflict (code) do nothing;

  -- ── 4 · tasks (English catalogue titles + catalogue emojis, src/demo-setup.js) ──
  -- rels = days relative to today (0 = today, 1 = tomorrow …, mod 7) so "today" always has the same content
  drop table if exists pg_temp._demo_tasks;
  create temp table _demo_tasks (
    key text primary key, id uuid, title text, emoji text, catalog_key text, freq text, dur int, mental boolean,
    owner text, rels int[], done_time time, pain_a smallint, pain_s smallint, has_expense boolean,
    slot_start time, slot_end time
  ) on commit drop;
  insert into _demo_tasks (key, title, emoji, catalog_key, freq, dur, mental, owner, rels, done_time, pain_a, pain_s, has_expense, slot_start, slot_end) values
    ('dishes',       'Dishes',                '🍽', 't-vaisselle', 'daily',  15, false, 'alt',  null,        '20:40', 2, 3, false, '17:00', null),
    ('trash',        'Trash',                 '🗑', 't-poubelles', 'weekly',  5, false, 'alex', '{0,3}',     '07:45', 1, 2, false, null,    '12:00'),
    ('laundry',      'Laundry',               '🧺', 't-lessive',   'weekly', 30, false, 'sam',  '{0,3}',     '18:50', 3, 2, false, null,    null),
    ('meal',         'Meal planning',         '📝', 't-repas',     'weekly', 20, true,  'alex', '{0}',       '18:15', 2, 3, false, null,    null),
    ('groceries',    'Groceries',             '🛒', 't-courses',   'weekly', 45, false, 'alex', '{1}',       '17:30', 2, 3, true,  null,    null),
    ('bathroom',     'Bathroom',              '🚿', 't-sdb',       'weekly', 30, false, 'sam',  '{2}',       '10:20', 4, 3, false, null,    null),
    ('cleaning',     'Cleaning',              '🧹', 't-menage',    'weekly', 60, false, 'both', '{4}',       '15:00', 3, 3, false, null,    null),
    ('paperwork',    'Paperwork & bills',     '📄', 't-admin',     'weekly', 20, true,  'alex', '{5}',       '21:05', 3, 4, false, null,    null),
    ('pediatrician', 'Book the pediatrician', '🩺', null,          'once',   15, true,  'sam',  null,        null,    3, 3, false, null,    null);
  update _demo_tasks set id = md5(c_ns || 'task:' || key)::uuid;

  insert into public.tasks (id, household_id, title, emoji, catalog_key, frequency, duration_min, importance, mental_load,
                            assign_mode, fixed_assignee, window_start, window_end, window_days, has_expense, created_by, created_at)
  select t.id, c_hid, t.title, t.emoji, t.catalog_key, t.freq::frequency, t.dur, 3, t.mental,
         (case t.owner when 'alt' then 'alternate' when 'both' then 'auto' else 'fixed' end)::assign_mode,
         case t.owner when 'alex' then v_alex when 'sam' then c_sam end,
         t.slot_start, t.slot_end,
         case when t.rels is null then null
              else (select array_agg(((w0 + x) % 7)::smallint order by (w0 + x) % 7) from unnest(t.rels) x) end, -- weekdays, Monday = 0
         t.has_expense,
         case when t.key = 'pediatrician' then c_sam else v_alex end,
         case when t.key = 'pediatrician' then least(((d0 - 1 + time '21:08') at time zone c_tz), v_cap)
              else v_created_ts + interval '20 minutes' end
  from _demo_tasks t;

  -- personal pain per task (balance weighting)
  insert into public.task_pains (task_id, user_id, pain)
  select t.id, v_alex, t.pain_a from _demo_tasks t
  union all
  select t.id, c_sam, t.pain_s from _demo_tasks t;

  -- the two-person task list the duo validated (setup screen 10, status done)
  insert into public.setup_drafts (household_id, tasks, status, ready, updated_by, updated_at)
  select c_hid,
         jsonb_agg(jsonb_build_object('id', t.catalog_key, 'label', t.title, 'emoji', t.emoji, 'duration_min', t.dur,
                   'per_week', case when t.freq = 'daily' then 7 else coalesce(cardinality(t.rels), 1) end,
                   'pain', 2, 'mental_load', t.mental, 'by', jsonb_build_array(v_alex, c_sam)) order by t.key),
         'done', jsonb_build_array(v_alex, c_sam), v_alex, v_join_ts + interval '8 minutes'
  from _demo_tasks t where t.catalog_key is not null;

  -- ── 5 · occurrences: from last Monday to today + 7 ──────────────────────
  insert into public.occurrences (id, household_id, task_id, kind, due_date, assignee_id, status, created_at)
  select md5(c_ns || 'occ:' || t.key || ':' || (g.d - d0))::uuid, c_hid, t.id,
         (case when t.mental then 'plan' else 'exec' end)::occ_kind, g.d,
         case t.owner when 'alex' then v_alex when 'sam' then c_sam
                      when 'alt' then (case when (d0 - g.d) % 2 = 0 then v_alex else c_sam end)  -- dishes alternate, Alex today
                      else null end,                                                          -- 'both' = together
         'pending'::occ_status,
         case when g.d < mon_this then v_join_ts + interval '10 minutes'                      -- split at setup
              else least(((mon_this - 1 + time '18:10') at time zone c_tz), v_cap) end         -- week relaunched on Sunday
  from _demo_tasks t
  cross join lateral (select gs::date as d from generate_series(mon_last::timestamp, (d0 + 7)::timestamp, interval '1 day') gs) g
  where t.freq <> 'once' and (t.freq = 'daily' or (((g.d - d0) % 7) + 7) % 7 = any (t.rels));

  -- one-off mental task added by Sam yesterday, due tomorrow (Sam then offers it to Alex)
  v_occ_ped := md5(c_ns || 'occ:pediatrician:1')::uuid;
  insert into public.occurrences (id, household_id, task_id, kind, due_date, assignee_id, status, created_at)
  values (v_occ_ped, c_hid, md5(c_ns || 'task:pediatrician')::uuid, 'plan', d0 + 1, c_sam, 'pending',
          least(((d0 - 1 + time '21:08') at time zone c_tz), v_cap));

  -- every past occurrence done by its assignee at a realistic time (+0-34 min jitter); together = alternate doer
  update public.occurrences o
     set status = 'done',
         done_by = coalesce(o.assignee_id, case when ((d0 - o.due_date) / 7) % 2 = 0 then c_sam else v_alex end),
         done_at = least(((o.due_date + t.done_time) at time zone c_tz)
                         + (get_byte(decode(md5(o.id::text), 'hex'), 0) % 35) * interval '1 minute', v_cap),
         duration_min = t.dur, mental_load = t.mental
    from _demo_tasks t
   where t.id = o.task_id and o.household_id = c_hid and o.due_date < d0;

  -- today: Sam did the laundry this morning
  update public.occurrences
     set status = 'done', done_by = c_sam, done_at = least(((d0 + time '07:40') at time zone c_tz), v_cap),
         duration_min = 30, mental_load = false
   where id = md5(c_ns || 'occ:laundry:0')::uuid;

  -- story A (last week): Alex missed Groceries, lost a heart next morning, caught up that evening (+1 heart back)
  d_g := mon_last + ((w0 + 1) % 7);
  v_occ_a := md5(c_ns || 'occ:groceries:' || (d_g - d0))::uuid;
  v_lost_a_ts := ((d_g + 1 + time '08:05') at time zone c_tz);
  v_done_a_ts := ((d_g + 1 + time '18:40') at time zone c_tz);
  update public.occurrences set done_at = v_done_a_ts where id = v_occ_a;

  -- story B (5 days ago): Sam missed Bathroom, lost a heart, moved it to the next day ("Today") and did it.
  -- Moving gives no heart back (app/retard.js doToday + src/occ-actions.js moveOccurrence).
  v_occ_b := md5(c_ns || 'occ:bathroom:-5')::uuid;
  v_lost_b_ts := ((d0 - 4 + time '08:10') at time zone c_tz);
  update public.occurrences
     set due_date = d0 - 4, done_at = ((d0 - 4 + time '19:25') at time zone c_tz)
   where id = v_occ_b;

  -- story C (3 days ago): the together Cleaning was missed. Deliberately left 'missed': it is the ONE late row
  -- on Alex's Home / Planning (together = no heart lost, no malus, per sweepHearts / sweepMissed).
  v_occ_c := md5(c_ns || 'occ:cleaning:-3')::uuid;
  update public.occurrences
     set status = 'missed', done_at = null, done_by = null, duration_min = null, pain = null, mental_load = null
   where id = v_occ_c;

  -- frozen pain = the doer's own pain (as toggleOccurrence does)
  update public.occurrences o set pain = p.pain
    from public.task_pains p
   where o.household_id = c_hid and o.status = 'done' and p.task_id = o.task_id and p.user_id = o.done_by;

  -- No malus row on purpose: story B would normally leave one, but Balance would then show the French-only
  -- header "− 1 cœur" (hard-coded in app/(tabs)/balance.js) to an English reviewer.

  -- ── 6 · Budget (Mochi+ tab; harmless if locked) ─────────────────────────
  v_exp_groc := md5(c_ns || 'exp:groceries')::uuid;
  insert into public.expenses (id, household_id, title, emoji, amount_cents, currency, paid_by, split_mode, category, spent_on, occurrence_id, created_by, created_at) values
    (v_exp_groc, c_hid, 'Groceries', '🛒', 8640, 'USD', v_alex, 'equal', 'courses',
       greatest(date_trunc('month', d0::timestamp)::date, d_g + 1), v_occ_a, v_alex, v_done_a_ts),
    (md5(c_ns || 'exp:soap')::uuid, c_hid, 'Dish soap & sponges', '🛒', 1290, 'USD', v_alex, 'equal', 'courses',
       greatest(date_trunc('month', d0::timestamp)::date, d0 - 5), null, v_alex, ((d0 - 5 + time '12:10') at time zone c_tz)),
    (md5(c_ns || 'exp:power')::uuid, c_hid, 'Electricity bill', '💡', 7215, 'USD', c_sam, 'equal', 'factures',
       greatest(date_trunc('month', d0::timestamp)::date, d0 - 2), null, c_sam, ((d0 - 2 + time '12:30') at time zone c_tz)),
    (md5(c_ns || 'exp:pizza')::uuid, c_hid, 'Pizza night', '🍕', 3450, 'USD', c_sam, 'equal', 'sorties',
       greatest(date_trunc('month', d0::timestamp)::date, d0 - 1), null, c_sam, ((d0 - 1 + time '20:05') at time zone c_tz));
  update public.occurrences set expense_id = v_exp_groc where id = v_occ_a;

  -- ── 7 · a social event in two days (Planning) ───────────────────────────
  insert into public.events (id, household_id, title, emoji, starts_at, who, details, created_by, created_at)
  values (md5(c_ns || 'event:dinner')::uuid, c_hid, 'Dinner at Jordan''s', '🎉', ((d0 + 2 + time '19:30') at time zone c_tz),
          array[v_alex, c_sam], '{"time":"7:30 PM","place":"Jordan''s place","note":"Bring dessert","items":[]}'::jsonb,
          v_alex, least(((d0 - 1 + time '19:00') at time zone c_tz), v_cap));

  -- ── 8 · Suivi: hand-off request, reminder, reactions, infos ────────────
  v_occ_trash := md5(c_ns || 'occ:trash:0')::uuid;
  -- Sam offers "Book the pediatrician" to Alex (Accept / Decline in "Waiting on you")
  insert into public.swap_requests (id, household_id, occurrence_id, from_user, to_user, status, created_at)
  values (md5(c_ns || 'swap:pediatrician')::uuid, c_hid, v_occ_ped, c_sam, v_alex, 'pending',
          least(((d0 + time '09:12') at time zone c_tz), v_cap));
  insert into public.activity (id, household_id, type, actor_id, target_id, occurrence_id, preset_key, payload, created_at) values
    -- reminder from Sam on Alex's trash today ("Waiting on you" + "Sam sent you a reminder" on the Home row)
    (md5(c_ns || 'act:reminder')::uuid, c_hid, 'ping', c_sam, v_alex, v_occ_trash, 'reminder',
       '{"task":"trash"}'::jsonb, least(((d0 + time '08:52') at time zone c_tz), v_cap)),
    -- Sam added the one-off task yesterday
    (md5(c_ns || 'act:taskcreated')::uuid, c_hid, 'ping', c_sam, v_alex, null, 'taskCreated',
       '{"task":"book the pediatrician"}'::jsonb, least(((d0 - 1 + time '21:08') at time zone c_tz), v_cap)),
    -- Sam logged an expense
    (md5(c_ns || 'act:expense')::uuid, c_hid, 'ping', c_sam, v_alex, null, 'expenseAdded',
       '{"title":"Electricity bill","amount":"$72.15"}'::jsonb, ((d0 - 2 + time '12:31') at time zone c_tz)),
    -- Alex added the dinner
    (md5(c_ns || 'act:event')::uuid, c_hid, 'ping', v_alex, c_sam, null, 'eventCreated',
       jsonb_build_object('event', 'Dinner at Jordan''s', 'day', to_char((d0 + 2)::timestamp, 'Dy, Mon FMDD')),
       least(((d0 - 1 + time '19:01') at time zone c_tz), v_cap)),
    -- Sam thanked Alex for the paperwork two days ago
    (md5(c_ns || 'act:react-sam')::uuid, c_hid, 'ping_reply', c_sam, v_alex, md5(c_ns || 'occ:paperwork:-2')::uuid, 'thanks',
       '{}'::jsonb, ((d0 - 2 + time '21:48') at time zone c_tz)),
    -- Alex cheered Sam's laundry four days ago
    (md5(c_ns || 'act:react-alex')::uuid, c_hid, 'ping_reply', v_alex, c_sam, md5(c_ns || 'occ:laundry:-4')::uuid, 'best',
       '{}'::jsonb, ((d0 - 4 + time '19:40') at time zone c_tz));

  -- ── 9 · Mochi journal (mochi_events) ────────────────────────────────────
  -- hatch: already seen by both (no full-screen replay)
  insert into public.mochi_events (id, household_id, type, actor_id, occurrence_id, payload, seen_by, created_at)
  values (md5(c_ns || 'ev:hatch')::uuid, c_hid, 'hatch', null, null, '{}'::jsonb, array[v_alex, c_sam], v_hatch_ts);

  -- pearls per mission done (pearlsFor: together 5, mental 4, else 3), at the moment it was ticked
  insert into public.mochi_events (id, household_id, type, actor_id, occurrence_id, payload, seen_by, created_at)
  select md5(c_ns || 'ev:pearls:' || o.id)::uuid, c_hid, 'pearls', o.done_by, o.id,
         jsonb_build_object('delta', case when o.assignee_id is null then 5 when t.mental then 4 else 3 end, 'reason', 'mission'),
         '{}'::uuid[], o.done_at
  from public.occurrences o join _demo_tasks t on t.id = o.task_id
  where o.household_id = c_hid and o.status = 'done';

  -- hearts: story A (lost, then regained on catch-up), story B (lost)
  insert into public.mochi_events (id, household_id, type, actor_id, occurrence_id, payload, seen_by, created_at) values
    (md5(c_ns || 'ev:lost-a')::uuid,   c_hid, 'heart_lost',   v_alex, v_occ_a, '{}'::jsonb, '{}', v_lost_a_ts),
    (md5(c_ns || 'ev:gained-a')::uuid, c_hid, 'heart_gained', v_alex, v_occ_a, '{"reason":"rattrapage"}'::jsonb, '{}', v_done_a_ts),
    (md5(c_ns || 'ev:lost-b')::uuid,   c_hid, 'heart_lost',   c_sam,  v_occ_b, '{}'::jsonb, '{}', v_lost_b_ts);

  -- full days (every mission due that day ticked that day): marker walk_start {kind: full_day} + 12 pearls (checkFullDay)
  for r in
    select o.due_date as day, max(o.done_at) as last_done
      from public.occurrences o
     where o.household_id = c_hid and o.status <> 'skipped' and o.due_date < d0
     group by o.due_date
    having bool_and(o.status = 'done' and (o.done_at at time zone c_tz)::date = o.due_date)
  loop
    continue when r.day = d0 - 5;  -- story B's day was not full (Bathroom was missed that day)
    insert into public.mochi_events (id, household_id, type, actor_id, occurrence_id, payload, seen_by, created_at) values
      (md5(c_ns || 'ev:fullday:' || r.day)::uuid, c_hid, 'walk_start', null, null, '{"kind":"full_day"}'::jsonb, '{}', r.last_done + interval '20 seconds'),
      (md5(c_ns || 'ev:fullday-pearls:' || r.day)::uuid, c_hid, 'pearls', null, null, '{"delta":12,"reason":"journee_pleine"}'::jsonb, '{}', r.last_done + interval '21 seconds');
  end loop;

  -- morning check-ins (+1 pearl each). Alex has none today, so the check-in row shows on Home.
  for i in 1 .. 5 loop
    insert into public.mochi_checkins (id, household_id, user_id, day, moment, mood, created_at)
      values (md5(c_ns || 'ck:alex:' || (i - 6))::uuid, c_hid, v_alex, d0 + (i - 6), 'morning',
              (array[2, 3, 1, 2, 3])[i], ((d0 + (i - 6) + time '07:55') at time zone c_tz));
    insert into public.mochi_events (id, household_id, type, actor_id, occurrence_id, payload, seen_by, created_at)
      values (md5(c_ns || 'ev:ck:alex:' || (i - 6))::uuid, c_hid, 'pearls', v_alex, null, '{"delta":1,"reason":"checkin"}'::jsonb, '{}',
              ((d0 + (i - 6) + time '07:55') at time zone c_tz));
    insert into public.mochi_checkins (id, household_id, user_id, day, moment, mood, created_at)
      values (md5(c_ns || 'ck:sam:' || (i - 5))::uuid, c_hid, c_sam, d0 + (i - 5), 'morning',
              (array[3, 2, 2, 3, 2])[i], least(((d0 + (i - 5) + time '07:35') at time zone c_tz), v_cap));
    insert into public.mochi_events (id, household_id, type, actor_id, occurrence_id, payload, seen_by, created_at)
      values (md5(c_ns || 'ev:ck:sam:' || (i - 5))::uuid, c_hid, 'pearls', c_sam, null, '{"delta":1,"reason":"checkin"}'::jsonb, '{}',
              least(((d0 + (i - 5) + time '07:35') at time zone c_tz), v_cap));
  end loop;

  -- shop: beret, gumball machine, rocking horse, bought in that order whenever the pearls allowed it
  -- (pearls = sum of events, never below c_reserve so the reviewer can still buy something)
  v_slot_ts  := array[((d0 - 6 + time '20:30') at time zone c_tz), ((d0 - 4 + time '21:00') at time zone c_tz),
                      ((d0 - 2 + time '21:20') at time zone c_tz), ((d0 - 1 + time '21:15') at time zone c_tz)];
  v_slot_who := array[v_alex, c_sam, v_alex, c_sam];
  for i in 1 .. array_length(v_slot_ts, 1) loop
    continue when v_slot_ts[i] <= v_hatch_ts;
    select coalesce(sum((payload->>'delta')::int), 0) into v_bal
      from public.mochi_events where household_id = c_hid and type = 'pearls' and created_at < v_slot_ts[i];
    for j in 1 .. array_length(v_wish_key, 1) loop
      continue when v_wish_key[j] = any (v_owned);
      exit when v_bal - v_wish_price[j] < c_reserve;  -- strictly in wishlist order
      v_ev := md5(c_ns || 'ev:shop:' || v_wish_key[j])::uuid;
      insert into public.mochi_events (id, household_id, type, actor_id, occurrence_id, payload, seen_by, created_at)
        values (v_ev, c_hid, 'pearls', v_slot_who[i], null,
                jsonb_build_object('delta', -v_wish_price[j], 'reason', 'shop', 'item_key', v_wish_key[j]), '{}',
                v_slot_ts[i] + j * interval '40 seconds');
      insert into public.mochi_inventory (id, household_id, item_key, kind, source, placed, event_id, acquired_by, acquired_at)
        values (md5(c_ns || 'inv:' || v_wish_key[j])::uuid, c_hid, v_wish_key[j], v_wish_kind[j], 'shop', true, v_ev,
                v_slot_who[i], v_slot_ts[i] + j * interval '40 seconds');
      v_owned := v_owned || v_wish_key[j];
      v_bal := v_bal - v_wish_price[j];
    end loop;
  end loop;

  -- two souvenirs on the shelf (walks were abandoned on 8 Nov 2026: source 'gift', no walk_return event)
  insert into public.mochi_inventory (id, household_id, item_key, kind, source, placed, event_id, acquired_by, acquired_at) values
    (md5(c_ns || 'inv:jardin-01')::uuid, c_hid, 'jardin-01', 'souvenir', 'gift', true, null, null, v_hatch_ts + interval '1 day'),
    (md5(c_ns || 'inv:jardin-05')::uuid, c_hid, 'jardin-05', 'souvenir', 'gift', true, null, null, v_hatch_ts + interval '6 days');

  -- ── 10 · last week, computed exactly like closeWeekIfNeeded ──────────────
  select count(*) filter (where o.status = 'done'),
         count(*) filter (where o.status = 'missed'),
         coalesce(sum(coalesce(o.duration_min, t.dur)) filter (where o.status = 'done' and o.assignee_id = v_alex), 0),
         coalesce(sum(coalesce(o.duration_min, t.dur)) filter (where o.status = 'done' and o.assignee_id = c_sam), 0),
         coalesce(sum(coalesce(o.duration_min, t.dur)) filter (where o.status = 'done' and o.assignee_id is null), 0),
         (count(*) filter (where o.status = 'done' and o.assignee_id = v_alex) > 0)::int
           + (count(*) filter (where o.status = 'done' and o.assignee_id = c_sam) > 0)::int
    into v_done, v_missed, v_ma, v_ms, v_mb, v_np
    from public.occurrences o join _demo_tasks t on t.id = o.task_id
   where o.household_id = c_hid and o.status <> 'skipped' and o.due_date >= mon_last and o.due_date < mon_this;
  v_done_pct := v_done::numeric / greatest(1, v_done + v_missed);
  v_gap := case when v_np >= 2 then abs(v_ma - v_ms) / greatest(1, v_ma + v_ms + v_mb) * 100 else 100 end;
  v_healthy := v_gap < 10 and v_done_pct >= 0.8;
  v_counts  := v_gap < 25 and v_done_pct >= 0.7;

  if c_preclose then
    -- optional: last week already closed on Sunday 20:00 (recap seen by both)
    insert into public.mochi_events (id, household_id, type, actor_id, occurrence_id, payload, seen_by, created_at)
    values (md5(c_ns || 'ev:week:' || mon_last)::uuid, c_hid, 'week_closed', null, null,
            jsonb_build_object('week_start', mon_last::text, 'healthy', v_healthy, 'counts', v_counts,
                               'done_pct', round(v_done_pct * 100), 'gap_pct', round(v_gap), 'sick', false),
            array[v_alex, c_sam], ((mon_this - 1 + time '20:01') at time zone c_tz));
    if v_counts then v_hw := 1; end if;
  end if;

  -- ── 11 · Mochi state = replay of the journal (hearts, pearls cache) ─────
  v_hearts := 5;
  for r in select type, payload from public.mochi_events
            where household_id = c_hid and type in ('heart_lost', 'heart_gained', 'week_closed') order by created_at
  loop
    if r.type = 'heart_lost' then v_hearts := greatest(1, v_hearts - 1);
    elsif r.type = 'heart_gained' then v_hearts := least(5, v_hearts + 1);
    elsif coalesce((r.payload->>'healthy')::boolean, false) then v_hearts := least(5, v_hearts + 1);
    end if;
  end loop;
  select coalesce(sum((payload->>'delta')::int), 0) into v_pearls
    from public.mochi_events where household_id = c_hid and type = 'pearls';

  insert into public.mochi_state (household_id, name, stage, hatched_at, healthy_weeks, hearts, pearls, walk_status, walk_started_at, walk_returns_at, photo_url)
  values (c_hid, 'Mochi', 'mini', v_hatch_ts, v_hw, v_hearts, v_pearls, 'home', null, null, null)
  on conflict (household_id) do update set
    name = excluded.name, stage = excluded.stage, hatched_at = excluded.hatched_at, healthy_weeks = excluded.healthy_weeks,
    hearts = excluded.hearts, pearls = excluded.pearls, walk_status = 'home', walk_started_at = null, walk_returns_at = null, photo_url = null;

  -- ── 12 · sanity checks + summary ─────────────────────────────────────────
  if exists (select 1 from public.occurrences where household_id = c_hid and due_date < d0 and status = 'pending') then
    raise exception 'Demo seed: a past occurrence is still pending (tick() would mark it missed).';
  end if;
  if v_pearls < 0 then raise exception 'Demo seed: negative pearls (%).', v_pearls; end if;

  raise notice 'Demo household % ready for % (Alex) + Sam %, today = % (%).', c_hid, c_review_email, c_sam, d0, c_tz;
  raise notice 'Mochi: stage mini, hearts %, pearls %, healthy_weeks %, bought: %.', v_hearts, v_pearls, v_hw, coalesce(nullif(array_to_string(v_owned, ', '), ''), 'nothing');
  raise notice 'Last week (from %): % done / % missed = % pct done, gap % pct -> healthy %, counts % (%).',
    mon_last, v_done, v_missed, round(v_done_pct * 100), round(v_gap), v_healthy, v_counts,
    case when c_preclose then 'already closed' else 'the app closes it on first open: +1 heart if healthy, healthy_weeks 1, recap shown' end;
end
$seed$;
