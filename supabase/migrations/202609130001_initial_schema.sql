create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.day_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.profiles enable row level security;
alter table public.day_logs enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users can read their own logs"
  on public.day_logs for select using (auth.uid() = user_id);
create policy "Users can insert their own logs"
  on public.day_logs for insert with check (auth.uid() = user_id);
create policy "Users can update their own logs"
  on public.day_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own logs"
  on public.day_logs for delete using (auth.uid() = user_id);

create index if not exists day_logs_user_id_date_idx on public.day_logs(user_id, date);