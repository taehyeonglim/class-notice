begin;

create table public.class_teachers (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table public.class_notices (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('notice', 'supplies', 'homework', 'schedule')),
  title text not null check (char_length(title) between 1 and 100 and title ~ '[^[:space:]]'),
  body text not null check (char_length(body) between 1 and 5000 and body ~ '[^[:space:]]'),
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create index class_notices_board_order
  on public.class_notices (pinned desc, created_at desc, id desc);

alter table public.class_teachers enable row level security;
alter table public.class_notices enable row level security;

revoke all on public.class_teachers, public.class_notices from public, anon, authenticated;
grant select on public.class_teachers to authenticated;
grant select on public.class_notices to anon, authenticated;
grant insert (category, title, body, pinned),
      update (category, title, body, pinned),
      delete on public.class_notices to authenticated;

create policy "Teachers read their own membership"
  on public.class_teachers for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Anyone can read class notices"
  on public.class_notices for select to anon, authenticated
  using (true);

create policy "Teachers can post notices"
  on public.class_notices for insert to authenticated
  with check (exists (
    select 1 from public.class_teachers where user_id = (select auth.uid())
  ));

create policy "Teachers can edit notices"
  on public.class_notices for update to authenticated
  using (exists (
    select 1 from public.class_teachers where user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.class_teachers where user_id = (select auth.uid())
  ));

create policy "Teachers can delete notices"
  on public.class_notices for delete to authenticated
  using (exists (
    select 1 from public.class_teachers where user_id = (select auth.uid())
  ));

commit;
