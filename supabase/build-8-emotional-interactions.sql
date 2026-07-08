-- Build 8 migration for existing Supabase projects.
-- Run this once before using Open When Letters and Elizabeth favourites.

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

drop trigger if exists set_open_when_letters_updated_at on public.open_when_letters;
create trigger set_open_when_letters_updated_at
before update on public.open_when_letters
for each row
execute function public.set_updated_at();

alter table public.open_when_letters enable row level security;
alter table public.elizabeth_favourites enable row level security;

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

insert into public.archive_chapters (
  chapter_number,
  slug,
  title,
  subtitle,
  body,
  sort_order,
  is_visible
)
values (
  9,
  'private-from-me-room',
  'Private From Me Room',
  'A little more personal',
  'I built this because I wanted you to have something you could return to - not just on your birthday, but on days when you need to remember that your presence matters.',
  90,
  true
)
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

