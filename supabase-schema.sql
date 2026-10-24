-- Run this once in Supabase Dashboard > SQL Editor.
-- Browser code uses only the publishable/anon key; never expose service_role keys.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'visitor' check (role in ('visitor', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  section_type text not null check (section_type in ('story', 'event', 'image', 'video', 'notice')),
  title text not null check (char_length(title) between 1 and 100),
  kicker text check (kicker is null or char_length(kicker) <= 60),
  body text check (body is null or char_length(body) <= 2000),
  button_text text check (button_text is null or char_length(button_text) <= 40),
  button_url text,
  media_url text,
  media_type text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_sections add column if not exists existing_key text;
create unique index if not exists site_sections_existing_key_unique
  on public.site_sections (existing_key) where existing_key is not null;

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  contributor_id uuid references auth.users(id) on delete set null,
  caption text not null check (char_length(caption) between 1 and 150),
  object_path text not null unique,
  media_type text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  published_path text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role) values (new.id, 'visitor')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.create_profile_for_new_user();

alter table public.profiles enable row level security;
alter table public.site_sections enable row level security;
alter table public.contributions enable row level security;

drop policy if exists "Profiles visible to self or admin" on public.profiles;
create policy "Profiles visible to self or admin" on public.profiles
for select to authenticated using (id = (select auth.uid()) or public.is_admin());
-- No client insert/update policy on profiles: users cannot grant themselves admin.

drop policy if exists "Published sections are public" on public.site_sections;
create policy "Published sections are public" on public.site_sections
for select to anon, authenticated using (published = true or public.is_admin());
drop policy if exists "Admins manage sections" on public.site_sections;
create policy "Admins manage sections" on public.site_sections
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Visitors submit contributions" on public.contributions;
create policy "Visitors submit contributions" on public.contributions
for insert to anon, authenticated
with check (
  status = 'pending'
  and published_path is null
  and (contributor_id is null or contributor_id = (select auth.uid()))
);
drop policy if exists "Visitors view own contributions or admins view all" on public.contributions;
create policy "Visitors view own contributions or admins view all" on public.contributions
for select to authenticated
using (contributor_id = (select auth.uid()) or public.is_admin());
drop policy if exists "Admins moderate contributions" on public.contributions;
create policy "Admins moderate contributions" on public.contributions
for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Public, published site assets and private, unapproved visitor uploads use separate buckets.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-media', 'site-media', true, 41943040,
   array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/ogg']),
  ('community-contributions', 'community-contributions', false, 41943040,
   array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/ogg'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public visitors can view site-media. Only admins can add or remove published media.
drop policy if exists "Published media is publicly readable" on storage.objects;
create policy "Published media is publicly readable" on storage.objects
for select to anon, authenticated using (bucket_id = 'site-media');
drop policy if exists "Admins upload site media" on storage.objects;
create policy "Admins upload site media" on storage.objects
for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "Admins delete site media" on storage.objects;
create policy "Admins delete site media" on storage.objects
for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());

-- Allow visitor uploads to enter a private moderation bucket. Only admins may read them.
drop policy if exists "Visitors submit private media" on storage.objects;
create policy "Visitors submit private media" on storage.objects
for insert to anon, authenticated with check (bucket_id = 'community-contributions');
drop policy if exists "Admins review private media" on storage.objects;
create policy "Admins review private media" on storage.objects
for select to authenticated using (bucket_id = 'community-contributions' and public.is_admin());
drop policy if exists "Admins remove private media" on storage.objects;
create policy "Admins remove private media" on storage.objects
for delete to authenticated using (bucket_id = 'community-contributions' and public.is_admin());

-- After creating/signing in with the chosen admin account, run this separately
-- in the SQL Editor, replacing the email with the exact admin email:
-- update public.profiles p set role = 'admin'
-- from auth.users u where p.id = u.id and lower(u.email) = lower('peddakottalapalli.official@gmail.com');
