-- Build 2 seed data for local Supabase testing.
-- Run after supabase/schema.sql.

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
values ('00000000-0000-0000-0000-000000000000', '2026-08-19', false, true, false, false, true, false)
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

insert into public.contributors (
  token,
  name,
  relationship,
  email,
  is_used,
  max_submissions,
  notes
)
values (
  'test-elizabeth-invite',
  'Local preview contributor',
  'Build 3 test invite',
  null,
  false,
  10,
  'Safe local test token for validating the contributor route.'
)
on conflict (token) do update set
  name = excluded.name,
  relationship = excluded.relationship,
  is_used = excluded.is_used,
  max_submissions = excluded.max_submissions,
  notes = excluded.notes;

-- First admin profile instruction:
-- 1. Create the admin user in Supabase Auth with email/password.
-- 2. Copy that auth.users.id value.
-- 3. Replace the placeholder UUID below and run the insert.
--
-- insert into public.profiles (id, email, display_name, role)
-- values ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'Admin', 'admin')
-- on conflict (id) do update set
--   email = excluded.email,
--   display_name = excluded.display_name,
--   role = excluded.role;
