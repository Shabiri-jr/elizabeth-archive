-- Build 10: Background Music and Sound Atmosphere
-- Run this after Build 9 on existing Supabase projects.

alter table public.archive_settings
  add column if not exists music_prompt_enabled boolean not null default true;

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

drop trigger if exists set_music_tracks_updated_at on public.music_tracks;
create trigger set_music_tracks_updated_at
before update on public.music_tracks
for each row
execute function public.set_updated_at();

alter table public.music_tracks enable row level security;

drop policy if exists "Admins can manage music tracks" on public.music_tracks;
create policy "Admins can manage music tracks"
on public.music_tracks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select, insert, update, delete on public.music_tracks to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
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
