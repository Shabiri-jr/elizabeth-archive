-- Build 2 schema for "A Story Called Elizabeth"
-- Run this in the Supabase SQL editor before running supabase/seed.sql.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null check (role in ('admin', 'elizabeth')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contributors (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  name text,
  relationship text,
  email text,
  is_used boolean not null default false,
  max_submissions integer not null default 1 check (max_submissions > 0),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  notes text
);

create table if not exists public.birthday_submissions (
  id uuid primary key default gen_random_uuid(),
  contributor_id uuid references public.contributors(id) on delete set null,
  name text not null,
  relationship text not null,
  birthday_message text not null,
  memory text,
  one_word text,
  future_wish text,
  permission_given boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references public.birthday_submissions(id) on delete cascade,
  contributor_id uuid references public.contributors(id) on delete set null,
  type text not null check (type in ('image', 'audio', 'video')),
  bucket text not null,
  storage_path text not null,
  public_url text,
  caption text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  gallery_mode text check (gallery_mode in ('polaroid', 'film-strip', 'timeline', 'floating')),
  display_order integer,
  featured boolean not null default false,
  memory_date text,
  emotion_tag text,
  admin_caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.archive_chapters (
  id uuid primary key default gen_random_uuid(),
  chapter_number integer not null,
  slug text unique not null,
  title text not null,
  subtitle text,
  body text,
  sort_order integer not null,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.archive_settings (
  id uuid primary key default gen_random_uuid(),
  birthday_date date not null default '2026-08-19',
  archive_live boolean not null default false,
  contributions_open boolean not null default true,
  elizabeth_access_enabled boolean not null default false,
  reveal_mode_enabled boolean not null default false,
  music_prompt_enabled boolean not null default true,
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.music_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  bucket text not null,
  storage_path text not null,
  public_url text,
  is_active boolean not null default false,
  default_volume numeric not null default 0.25 check (default_volume >= 0 and default_volume <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists music_tracks_single_active_idx
on public.music_tracks ((is_active))
where is_active;

create table if not exists public.open_when_letters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  body text not null,
  mood text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.elizabeth_favourites (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('submission', 'memory', 'future_wish', 'media', 'open_when_letter')),
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (item_type, item_id)
);

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id),
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_birthday_submissions_updated_at on public.birthday_submissions;
create trigger set_birthday_submissions_updated_at
before update on public.birthday_submissions
for each row
execute function public.set_updated_at();

drop trigger if exists set_archive_chapters_updated_at on public.archive_chapters;
create trigger set_archive_chapters_updated_at
before update on public.archive_chapters
for each row
execute function public.set_updated_at();

drop trigger if exists set_archive_settings_updated_at on public.archive_settings;
create trigger set_archive_settings_updated_at
before update on public.archive_settings
for each row
execute function public.set_updated_at();

drop trigger if exists set_music_tracks_updated_at on public.music_tracks;
create trigger set_music_tracks_updated_at
before update on public.music_tracks
for each row
execute function public.set_updated_at();

drop trigger if exists set_open_when_letters_updated_at on public.open_when_letters;
create trigger set_open_when_letters_updated_at
before update on public.open_when_letters
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_elizabeth()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'elizabeth'
  );
$$;

alter table public.profiles enable row level security;
alter table public.contributors enable row level security;
alter table public.birthday_submissions enable row level security;
alter table public.media_assets enable row level security;
alter table public.archive_chapters enable row level security;
alter table public.archive_settings enable row level security;
alter table public.music_tracks enable row level security;
alter table public.open_when_letters enable row level security;
alter table public.elizabeth_favourites enable row level security;
alter table public.admin_activity_logs enable row level security;

drop policy if exists "Profiles can read own profile" on public.profiles;
create policy "Profiles can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage contributors" on public.contributors;
create policy "Admins can manage contributors"
on public.contributors
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read birthday submissions" on public.birthday_submissions;
create policy "Admins can read birthday submissions"
on public.birthday_submissions
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can manage birthday submissions" on public.birthday_submissions;
create policy "Admins can manage birthday submissions"
on public.birthday_submissions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read media assets" on public.media_assets;
create policy "Admins can read media assets"
on public.media_assets
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can manage media assets" on public.media_assets;
create policy "Admins can manage media assets"
on public.media_assets
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage archive chapters" on public.archive_chapters;
create policy "Admins can manage archive chapters"
on public.archive_chapters
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Elizabeth can read visible archive chapters" on public.archive_chapters;
create policy "Elizabeth can read visible archive chapters"
on public.archive_chapters
for select
to authenticated
using (
  is_visible
  and public.is_elizabeth()
  and exists (
    select 1
    from public.archive_settings
    where archive_live or elizabeth_access_enabled
  )
);

drop policy if exists "Public can read live visible archive chapters" on public.archive_chapters;
create policy "Public can read live visible archive chapters"
on public.archive_chapters
for select
to anon, authenticated
using (
  is_visible
  and exists (
    select 1
    from public.archive_settings
    where archive_live
  )
);

drop policy if exists "Admins can manage archive settings" on public.archive_settings;
create policy "Admins can manage archive settings"
on public.archive_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read safe archive settings" on public.archive_settings;
create policy "Public can read safe archive settings"
on public.archive_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage music tracks" on public.music_tracks;
create policy "Admins can manage music tracks"
on public.music_tracks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage open when letters" on public.open_when_letters;
create policy "Admins can manage open when letters"
on public.open_when_letters
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Elizabeth can read visible open when letters" on public.open_when_letters;
create policy "Elizabeth can read visible open when letters"
on public.open_when_letters
for select
to authenticated
using (is_visible and public.is_elizabeth());

drop policy if exists "Admins can read Elizabeth favourites" on public.elizabeth_favourites;
create policy "Admins can read Elizabeth favourites"
on public.elizabeth_favourites
for select
to authenticated
using (public.is_admin());

drop policy if exists "Elizabeth can manage favourites" on public.elizabeth_favourites;
create policy "Elizabeth can manage favourites"
on public.elizabeth_favourites
for all
to authenticated
using (public.is_elizabeth())
with check (public.is_elizabeth());

drop policy if exists "Admins can read activity logs" on public.admin_activity_logs;
create policy "Admins can read activity logs"
on public.admin_activity_logs
for select
to authenticated
using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.archive_settings to anon, authenticated;
grant select on public.archive_chapters to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

insert into public.archive_settings (
  id,
  birthday_date,
  archive_live,
  contributions_open,
  elizabeth_access_enabled,
  reveal_mode_enabled,
  music_prompt_enabled,
  maintenance_mode
)
values ('11111111-1111-1111-1111-111111111111', '2026-08-19', false, true, false, false, true, false)
on conflict (id) do update set
  birthday_date = excluded.birthday_date,
  archive_live = excluded.archive_live,
  contributions_open = excluded.contributions_open,
  elizabeth_access_enabled = excluded.elizabeth_access_enabled,
  reveal_mode_enabled = excluded.reveal_mode_enabled,
  music_prompt_enabled = excluded.music_prompt_enabled,
  maintenance_mode = excluded.maintenance_mode;

insert into public.archive_chapters (
  chapter_number,
  slug,
  title,
  subtitle,
  body,
  sort_order,
  is_visible
)
values
  (1, 'dear-elizabeth', 'Dear Elizabeth', 'Opening letter', 'A quiet beginning for the words that will welcome Elizabeth into her birthday archive.', 10, true),
  (2, 'the-girl-we-know', 'The Girl We Know', 'Portrait of her', 'A chapter for the details people notice and the love people keep for her.', 20, true),
  (3, 'messages-from-your-people', 'Messages From Your People', 'Birthday wishes', 'A cinematic wall of private wishes from the people who love her.', 30, true),
  (4, 'memories-with-you', 'Memories With You', 'Shared moments', 'Stories, inside jokes, soft recollections, and moments that still feel close.', 40, true),
  (5, 'the-gallery', 'The Gallery', 'Photo archive', 'A polished gallery foundation for future portraits, candids, and collected photo cards.', 50, true),
  (6, 'voices', 'Voices', 'Audio and video', 'A chapter reserved for voice notes and short videos that make the archive feel alive.', 60, true),
  (7, 'the-future-we-see-for-you', 'The Future We See For You', 'Prayers and wishes', 'A hopeful chapter for prayers, blessings, dreams, and the future people see opening for her.', 70, true),
  (8, 'from-me', 'From Me', 'Closing note', 'A final private chapter reserved for the personal message that closes the birthday story.', 80, true),
  (9, 'private-from-me-room', 'Private From Me Room', 'A little more personal', 'I built this because I wanted you to have something you could return to - not just on your birthday, but on days when you need to remember that your presence matters.', 90, true)
on conflict (slug) do update set
  chapter_number = excluded.chapter_number,
  title = excluded.title,
  subtitle = excluded.subtitle,
  body = excluded.body,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible;

insert into public.open_when_letters (
  slug,
  title,
  subtitle,
  body,
  mood,
  sort_order,
  is_visible
)
values
  ('feel-tired', 'Open when you feel tired', 'For the days that ask too much of you', 'Rest is not failure. You do not have to earn softness by carrying everything until you break. Breathe, eat something gentle, and remember that your worth is not measured by how much you can endure without pausing.', 'rest', 10, true),
  ('need-encouragement', 'Open when you need encouragement', 'A small push forward', 'You have made it through difficult rooms before. You have learned, defended, grown, and still kept a softness that people notice. Take the next step slowly if you need to, but do not forget that you are capable.', 'encouragement', 20, true),
  ('forget-loved', 'Open when you forget how loved you are', 'For the quiet doubt', 'There are people who carry your name with warmth. People remember your kindness, your style, your humour, your strength, and the way you make moments feel less ordinary. You are loved in more rooms than you know.', 'love', 30, true),
  ('need-smile', 'Open when you need to smile', 'A gentle little light', 'Somewhere in this archive is proof that you have made people laugh, feel seen, and hold onto moments with you. Let one of those memories find you today. You are allowed to smile before everything is perfect.', 'joy', 40, true),
  ('feel-unsure', 'Open when you feel unsure', 'For foggy days', 'You do not need to have the entire future solved to be moving toward it. Clarity often arrives after the first brave step. Trust the woman you are becoming, even while she is still unfolding.', 'clarity', 50, true),
  ('need-peace', 'Open when you need peace', 'A softer room', 'May your mind unclench. May your body feel safe. May the noise become small enough for you to hear your own heart again. You deserve calm that does not have to explain itself.', 'peace', 60, true),
  ('remember-worth', 'Open when you need to remember your worth', 'Because it is not negotiable', 'Your presence is not ordinary. Your dreams are not too much. Your tenderness is not weakness. You are allowed to take up space, receive love, and expect a life that treats you gently.', 'worth', 70, true),
  ('soft-life-ceo', 'Open when soft-life CEO needs motivation', 'Soft life, intentional life', 'Future Soft-Life CEO, please remember that ease and ambition can sit at the same table. Build the life, protect your peace, wear the outfit, send the invoice, and rest like someone who knows her future is already making room.', 'motivation', 80, true)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  body = excluded.body,
  mood = excluded.mood,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'elizabeth-photos',
    'elizabeth-photos',
    false,
    8388608,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'elizabeth-voice-notes',
    'elizabeth-voice-notes',
    false,
    26214400,
    array['audio/mpeg', 'audio/mp4', 'audio/mp3', 'audio/m4a', 'audio/x-m4a', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/webm']
  ),
  (
    'elizabeth-videos',
    'elizabeth-videos',
    false,
    83886080,
    array['video/mp4', 'video/quicktime', 'video/webm']
  ),
  (
    'elizabeth-music',
    'elizabeth-music',
    false,
    26214400,
    array['audio/mpeg', 'audio/mp4', 'audio/mp3', 'audio/m4a', 'audio/x-m4a', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/webm']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins can read Elizabeth storage objects" on storage.objects;
create policy "Admins can read Elizabeth storage objects"
on storage.objects
for select
to authenticated
using (
  bucket_id in ('elizabeth-photos', 'elizabeth-voice-notes', 'elizabeth-videos', 'elizabeth-music')
  and public.is_admin()
);

drop policy if exists "Admins can upload Elizabeth storage objects" on storage.objects;
create policy "Admins can upload Elizabeth storage objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('elizabeth-photos', 'elizabeth-voice-notes', 'elizabeth-videos', 'elizabeth-music')
  and public.is_admin()
);

drop policy if exists "Admins can update Elizabeth storage objects" on storage.objects;
create policy "Admins can update Elizabeth storage objects"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('elizabeth-photos', 'elizabeth-voice-notes', 'elizabeth-videos', 'elizabeth-music')
  and public.is_admin()
)
with check (
  bucket_id in ('elizabeth-photos', 'elizabeth-voice-notes', 'elizabeth-videos', 'elizabeth-music')
  and public.is_admin()
);

drop policy if exists "Admins can delete Elizabeth storage objects" on storage.objects;
create policy "Admins can delete Elizabeth storage objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('elizabeth-photos', 'elizabeth-voice-notes', 'elizabeth-videos', 'elizabeth-music')
  and public.is_admin()
);
