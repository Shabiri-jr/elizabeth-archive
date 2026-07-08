# Deployment

This app is designed to deploy cleanly on Vercel as a private Next.js App Router project connected to Supabase.

## Required environment variables

Set these in Vercel Project Settings -> Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ELIZABETH_ACCESS_CODE=
ELIZABETH_SESSION_SECRET=
ADMIN_EMAILS=
NEXT_PUBLIC_SITE_URL=
APP_ORIGIN=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser-safe public Supabase values.
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only. Never prefix it with `NEXT_PUBLIC_`.
- `ELIZABETH_ACCESS_CODE` is the private code Elizabeth enters at `/elizabeth/login`.
- `ELIZABETH_SESSION_SECRET` must be a separate long random secret in production. The app will not fall back to the access code for production session signing.
- `ADMIN_EMAILS` is a comma-separated allowlist for admin setup and documentation clarity.
- `NEXT_PUBLIC_SITE_URL` is the canonical deployed site URL used for QR codes and admin launch copy.
- `APP_ORIGIN` is a server-side fallback for absolute launch/reminder URLs. Set it to the same deployed origin as `NEXT_PUBLIC_SITE_URL`.

## Supabase

1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. Run `supabase/seed.sql`.
3. For existing Build 6 projects, run `supabase/build-7-reveal-mode.sql`.
4. For existing Build 7 projects, run `supabase/build-8-emotional-interactions.sql`.
5. Create the first Supabase Auth admin user with email/password.
6. Insert or update that user's row in `profiles` with `role = 'admin'`.
7. Confirm the storage buckets exist:
   - `elizabeth-photos`
   - `elizabeth-voice-notes`
   - `elizabeth-videos`

## Vercel deployment

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables above for Production and Preview.
4. Keep the build command as:

```bash
npm run build
```

5. Deploy.
6. After deployment, test:
   - `/`
   - `/contribute/test-elizabeth-invite`
   - `/admin/login`
   - `/admin/launch`
   - `/for-elizabeth`
   - `/archive/locked`
   - `/archive/preview` while signed in as admin

## Release order

1. Keep `contributions_open = true` while collecting wishes.
2. Review submissions and media in `/admin`.
3. Edit chapters and final letter.
4. Preview `/archive/preview`.
5. Export a launch backup from `/admin/export`.
6. Set `archive_live = true`.
7. Set `elizabeth_access_enabled = true`.
8. Open `/admin/launch`, test the QR code, and send Elizabeth the production `/for-elizabeth` link with the private code.

## Security notes

- Admin and archive access are validated server-side.
- Elizabeth's archive session cookie is HTTP-only and signed.
- Pending and rejected submissions/media are filtered out of the archive.
- Private storage paths are not rendered directly in the archive; media URLs are signed server-side.
- Security headers are configured in `next.config.ts`.
- Admin export routes verify admin access server-side and send `no-store` JSON attachments.
- The QR code points to `/for-elizabeth`; it does not include Elizabeth's access code.
