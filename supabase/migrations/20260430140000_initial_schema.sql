create extension if not exists "pgcrypto";

create table public.events (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  public_slug text not null unique,
  title text not null check (char_length(title) between 1 and 80),
  description text,
  admin_note text,
  timezone text not null default 'Asia/Tokyo',
  status text not null default 'open' check (status in ('open', 'closed', 'archived')),
  visibility text not null default 'private_result' check (visibility in ('public_result', 'private_result')),
  allow_maybe boolean not null default false,
  response_deadline_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.event_slots (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  label text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.respondents (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 30),
  edit_token_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.availabilities (
  id uuid primary key default gen_random_uuid(),
  respondent_id uuid not null references public.respondents(id) on delete cascade,
  slot_id uuid not null references public.event_slots(id) on delete cascade,
  status text not null check (status in ('available', 'maybe', 'unavailable')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (respondent_id, slot_id)
);

create index events_owner_user_id_idx on public.events(owner_user_id);
create index events_public_slug_idx on public.events(public_slug);
create index events_status_idx on public.events(status);
create index event_slots_event_id_idx on public.event_slots(event_id);
create index respondents_event_id_idx on public.respondents(event_id);
create index availabilities_respondent_id_idx on public.availabilities(respondent_id);
create index availabilities_slot_id_idx on public.availabilities(slot_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger respondents_set_updated_at
before update on public.respondents
for each row execute function public.set_updated_at();

create trigger availabilities_set_updated_at
before update on public.availabilities
for each row execute function public.set_updated_at();

alter table public.events enable row level security;
alter table public.event_slots enable row level security;
alter table public.respondents enable row level security;
alter table public.availabilities enable row level security;

create policy "admins can read own events"
on public.events
for select
to authenticated
using (owner_user_id = auth.uid() and deleted_at is null);

create policy "admins can create own events"
on public.events
for insert
to authenticated
with check (owner_user_id = auth.uid());

create policy "admins can update own events"
on public.events
for update
to authenticated
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

create policy "admins can read own event slots"
on public.event_slots
for select
to authenticated
using (
  exists (
    select 1
    from public.events
    where events.id = event_slots.event_id
      and events.owner_user_id = auth.uid()
      and events.deleted_at is null
  )
);

create policy "admins can manage own event slots"
on public.event_slots
for all
to authenticated
using (
  exists (
    select 1
    from public.events
    where events.id = event_slots.event_id
      and events.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.events
    where events.id = event_slots.event_id
      and events.owner_user_id = auth.uid()
  )
);

create policy "admins can read respondents for own events"
on public.respondents
for select
to authenticated
using (
  exists (
    select 1
    from public.events
    where events.id = respondents.event_id
      and events.owner_user_id = auth.uid()
      and events.deleted_at is null
  )
);

create policy "admins can read availabilities for own events"
on public.availabilities
for select
to authenticated
using (
  exists (
    select 1
    from public.respondents
    join public.events on events.id = respondents.event_id
    where respondents.id = availabilities.respondent_id
      and events.owner_user_id = auth.uid()
      and events.deleted_at is null
  )
);

