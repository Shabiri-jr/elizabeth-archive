-- Build 9: Emotional Gallery System
-- Run this after Build 8 on existing Supabase projects.

alter table public.media_assets
  add column if not exists gallery_mode text;

alter table public.media_assets
  add column if not exists display_order integer;

alter table public.media_assets
  add column if not exists featured boolean not null default false;

alter table public.media_assets
  add column if not exists memory_date text;

alter table public.media_assets
  add column if not exists emotion_tag text;

alter table public.media_assets
  add column if not exists admin_caption text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'media_assets_gallery_mode_check'
      and conrelid = 'public.media_assets'::regclass
  ) then
    alter table public.media_assets
      add constraint media_assets_gallery_mode_check
      check (gallery_mode in ('polaroid', 'film-strip', 'timeline', 'floating') or gallery_mode is null);
  end if;
end $$;

create index if not exists media_assets_gallery_sort_idx
on public.media_assets (type, status, featured desc, display_order nulls last, created_at);
