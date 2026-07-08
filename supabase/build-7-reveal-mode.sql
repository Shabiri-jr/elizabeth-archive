-- Build 7 migration for existing Supabase projects.
-- Run this once before using the Reveal mode toggle in /admin/settings.

alter table public.archive_settings
add column if not exists reveal_mode_enabled boolean not null default false;

update public.archive_settings
set reveal_mode_enabled = false
where reveal_mode_enabled is null;

