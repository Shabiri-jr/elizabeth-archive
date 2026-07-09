# A Story Called Elizabeth

A private cinematic birthday web app for Elizabeth, whose birthday archive is planned for August 19.

Build 1 created the soft lilac luxury frontend foundation. Build 2 added the Supabase backend foundation, auth setup, protected routes, storage bucket planning, and private contributor invite validation. Build 3 makes the private contributor link functional for birthday wishes and media uploads. Build 4 adds the admin moderation dashboard for submissions, media, contributor links, chapters, archive settings, and activity logs. Build 5 renders Elizabeth's protected final archive experience from approved content. Build 6 adds final polish, cinematic motion, accessibility/security hardening, and deployment preparation. Build 7 adds the premium launch pack: Elizabeth's invitation page, reveal mode, keepsake view, QR launch tools, export backups, and reminder copy. Build 8 adds the emotional interaction layer: Open When letters, animated word wall, trailer intro, Private From Me Room, favourites, and secret easter eggs. Build 9 upgrades the gallery into a cinematic memory system with a polaroid wall, film strip, timeline, floating memories, and click-to-reveal photo messages. Build 10 adds optional background music and a soft sound-atmosphere control system.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Storage

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in:

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

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code. In production, `ELIZABETH_SESSION_SECRET` must be set separately from `ELIZABETH_ACCESS_CODE`.

4. Run the app:

```bash
npm run dev
```

## Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL editor, then run `supabase/seed.sql`.

For an existing Build 6 database, also run `supabase/build-7-reveal-mode.sql` before using the Reveal mode toggle in `/admin/settings`.

For an existing Build 7 database, run `supabase/build-8-emotional-interactions.sql` before using Open When letters or favourites.

For an existing Build 8 database, run `supabase/build-9-emotional-gallery.sql` before using gallery captions, featured images, gallery modes, or moment labels.

For an existing Build 9 database, run `supabase/build-10-music-system.sql` before uploading background music or enabling the music prompt.

The schema creates:

- `profiles`
- `contributors`
- `birthday_submissions`
- `media_assets`
- `archive_chapters`
- `archive_settings`
- `music_tracks`
- `open_when_letters`
- `elizabeth_favourites`
- `admin_activity_logs`

It also enables RLS, creates updated-at triggers, seeds the archive chapters, and creates private storage buckets for photos, voice notes, and videos.

Detailed setup notes live in:

- [docs/build-2-supabase-setup.md](./docs/build-2-supabase-setup.md)
- [docs/build-3-contributor-submissions.md](./docs/build-3-contributor-submissions.md)
- [docs/build-4-admin-moderation.md](./docs/build-4-admin-moderation.md)
- [docs/build-5-elizabeth-archive.md](./docs/build-5-elizabeth-archive.md)
- [docs/build-7-premium-launch.md](./docs/build-7-premium-launch.md)
- [docs/build-8-emotional-interactions.md](./docs/build-8-emotional-interactions.md)
- [docs/build-9-emotional-gallery.md](./docs/build-9-emotional-gallery.md)
- [docs/build-10-music-system.md](./docs/build-10-music-system.md)
- [docs/deployment.md](./docs/deployment.md)
- [docs/final-qa-checklist.md](./docs/final-qa-checklist.md)
- [docs/elizabeth-launch-day-checklist.md](./docs/elizabeth-launch-day-checklist.md)

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Contributor Testing

After Supabase is configured and seeded, visit:

```text
/contribute/test-elizabeth-invite
```

The form saves pending rows to `birthday_submissions`, uploads media to private Supabase Storage buckets, and records metadata in `media_assets`.

## Admin Moderation

Admin access uses Supabase Auth plus `profiles.role = 'admin'`. After signing in at:

```text
/admin/login
```

the admin can use:

- `/admin` for moderation counts and recent activity
- `/admin/submissions` to approve, reject, restore, annotate, or delete submissions
- `/admin/media` to preview and moderate uploaded media
- `/admin/gallery` to shape approved photos into the emotional gallery
- `/admin/music` to upload and manage optional background music
- `/admin/contributors` to create, copy, update, and expire contributor links
- `/admin/chapters` to edit the chapter structure for Build 5
- `/admin/open-when` to create and edit Open When letters
- `/admin/settings` to control contribution and reveal settings

Admin mutations run server-side and log important actions to `admin_activity_logs`.

## Elizabeth Archive

Elizabeth enters the private access code at:

```text
/elizabeth/login
```

A valid code creates an HTTP-only signed archive session cookie and redirects to `/archive`. The archive only opens when:

- `elizabeth_access_enabled` is true
- `archive_live` is true or the current date is on/after the configured birthday date
- maintenance mode is false

Admins can preview the archive at:

```text
/archive/preview
```

The final archive reads only approved submissions, approved media, visible chapters, and visible Open When letters.

Build 6 adds a short skippable opening reveal, soft GSAP-powered scroll reveals, keyboard-friendly gallery lightbox controls, reduced-motion support, security headers, and final deployment documentation.

Build 8 adds:

- `/archive/open-when` for protected encouragement letters
- `/archive/from-me` for the private From Me room
- `/archive/favourites` for Elizabeth's saved archive moments
- a replayable birthday trailer intro
- heart buttons on approved archive moments
- tasteful local easter egg unlocks

Build 9 adds:

- a polaroid wall for approved gallery photos
- a horizontal film-strip memory reel
- a timeline gallery with moment labels
- a floating featured-photo memory section
- a photo detail modal that reveals linked memories, messages, and wishes beside each image
- `/admin/gallery` for captions, featured status, gallery modes, display order, moment labels, emotion tags, and image status

Build 10 adds:

- `/admin/music` for uploading and managing the active background track
- private `elizabeth-music` storage for mp3, m4a, wav, and webm files
- direct browser-to-Supabase music uploads using signed upload URLs
- an opt-in music permission prompt inside the archive
- a floating archive music player with play/pause, mute, volume, and track name
- local, non-sensitive preferences for music choice, volume, and muted state

## Premium Launch Pack

Build 7 adds:

- `/for-elizabeth` as the final private invitation link to send Elizabeth
- `/archive/keepsake` as a protected printable memory book view
- `/admin/launch` for the QR code, launch checklist, and final invite link
- `/admin/export` for admin-only JSON backups
- `/admin/reminders` for copy-paste contributor reminder messages

Music is optional and user-controlled. Only upload music you own, created yourself, or have permission to use.

Set `NEXT_PUBLIC_SITE_URL` or `APP_ORIGIN` in production so QR codes, reminders, and launch links use the deployed domain instead of a local request host.

## Deployment

Deployment notes live in [docs/deployment.md](./docs/deployment.md). The recommended release order is:

1. Keep contributions open while collecting wishes.
2. Moderate submissions and media.
3. Edit chapters and the final letter.
4. Preview `/archive/preview` as admin.
5. Check `/admin/open-when`, `/archive/from-me`, and `/archive/favourites`.
6. Enable `archive_live`.
7. Enable `elizabeth_access_enabled`.
8. Visit `/admin/launch`, copy or print the final invitation, and send Elizabeth `/for-elizabeth` with the private access code.

## Current Limitations

- Background music is intentionally not implemented; any future audio should stay user-initiated and off by default.
- The keepsake view is print-friendly HTML rather than generated PDF.
- Easter eggs are hardcoded tasteful surprises rather than admin-configurable settings.
- A full Lighthouse run should be repeated against the deployed production URL after real media is uploaded.
- Production readiness still depends on Supabase RLS, storage buckets, and Vercel environment variables being configured correctly.
