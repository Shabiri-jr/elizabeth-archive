# Build 2 Supabase Setup

This build connects the frontend foundation to a Supabase backend structure while keeping the UI, contributor submission flow, upload flow, and archive rendering intentionally incomplete.

## 1. Create a Supabase Project

1. Create a new Supabase project.
2. Copy the project URL and anon or publishable key.
3. Copy the service role or secret key for server-only operations.
4. Add these values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-or-secret-key
ELIZABETH_ACCESS_CODE=choose-a-private-code
ADMIN_EMAILS=admin@example.com
```

`SUPABASE_SERVICE_ROLE_KEY` must stay server-side only. It is used for controlled contributor token validation and future server actions.

## 2. Run Database Schema

Open the Supabase SQL editor and run:

```sql
-- contents of supabase/schema.sql
```

This creates the Build 2 tables:

- `profiles`
- `contributors`
- `birthday_submissions`
- `media_assets`
- `archive_chapters`
- `archive_settings`
- `admin_activity_logs`

It also creates:

- reusable `updated_at` trigger function
- admin and Elizabeth role helpers
- RLS policies for all tables
- seeded archive chapters
- private storage bucket definitions

## 3. Run Seed Data

After the schema succeeds, run:

```sql
-- contents of supabase/seed.sql
```

The seed file adds:

- the singleton archive settings row
- the eight placeholder archive chapters
- a safe local contributor token: `test-elizabeth-invite`
- commented instructions for creating the first admin profile

## 4. Create the First Admin User

1. In Supabase Auth, create an email/password user for the admin.
2. Copy that user's `auth.users.id`.
3. Run this SQL with the copied id:

```sql
insert into public.profiles (id, email, display_name, role)
values ('PASTE-AUTH-USER-ID-HERE', 'admin@example.com', 'Admin', 'admin')
on conflict (id) do update set
  email = excluded.email,
  display_name = excluded.display_name,
  role = excluded.role;
```

The `/admin` route checks `profiles.role = 'admin'`.

## 5. Storage Buckets

The schema creates private buckets:

- `elizabeth-photos`
- `elizabeth-voice-notes`
- `elizabeth-videos`

Recommended limits are already reflected in SQL and `lib/storage.ts`:

- Photos: 8MB, `jpg`, `png`, `webp`
- Voice notes: 25MB, `mp3`, `m4a`, `wav`, `webm`
- Videos: 80MB, `mp4`, `mov`, `webm`

Build 2 does not add contributor uploads yet. Later builds should use server-side validation and signed upload paths.

## 6. Test Admin Login

1. Start the app with `npm run dev`.
2. Visit `/admin`.
3. If not signed in, the app redirects to `/admin/login`.
4. Sign in with the Supabase admin account.
5. Confirm `/admin` loads backend-ready count cards.

If Supabase is not configured, `/admin` shows safe fallback counts instead of crashing.

## 7. Test Contributor Token

After running seed data, visit:

```text
/contribute/test-elizabeth-invite
```

Expected result:

- Valid invite screen with the existing emotional contributor placeholder form.
- No submission is saved yet.

Invalid links, expired links, used links, closed contributions, and unconfigured Supabase states show a polished invite error screen.

You can also test token validation with:

```bash
curl -X POST http://localhost:3000/api/contributor/validate-token \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"test-elizabeth-invite\"}"
```

## 8. Test Elizabeth Access

1. Set `ELIZABETH_ACCESS_CODE` in `.env.local`.
2. In Supabase, set `archive_settings.elizabeth_access_enabled = true` when you want code-based access enabled.
3. Visit `/elizabeth/login`.
4. Enter the access code.
5. The app sets an HTTP-only cookie and opens `/archive` if access is enabled.

Admins can preview `/archive` when signed in as admin.

## 9. Known Build 2 Limitations

- Contributor form fields are not saved yet.
- File uploads are not implemented yet.
- Admin approval screens are not implemented yet.
- Archive chapters still render placeholder content from local constants.
- Elizabeth access is a secure access-code cookie foundation, not full Supabase Auth.
- Public users cannot list contributors, submissions, or media.

## 10. Build 3 Will Add

- Real contributor submission saving.
- Server-side token validation during submission.
- Media upload flow using private buckets or signed paths.
- Submission status updates for admin moderation.
- Stronger form validation and contributor completion tracking.
