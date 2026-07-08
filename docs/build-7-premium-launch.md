# Build 7: Premium Launch Pack

Build 7 adds optional delivery features around the finished archive. It does not replace the Build 1-6 app structure.

## New routes

- `/for-elizabeth` - the private invitation page to send Elizabeth.
- `/archive/keepsake` - protected printable keepsake view.
- `/admin/launch` - launch dashboard, QR code, and checklist.
- `/admin/export` - admin-only JSON backup downloads.
- `/admin/reminders` - copy-paste reminder message generator.
- `/api/admin/export` - protected export endpoint used by `/admin/export`.

## Reveal mode

Build 7 adds `archive_settings.reveal_mode_enabled`.

For existing Supabase projects, run:

```sql
-- supabase/build-7-reveal-mode.sql
alter table public.archive_settings
add column if not exists reveal_mode_enabled boolean not null default false;
```

When reveal mode is enabled, Elizabeth sees the full cinematic opening once. The viewed state is stored in localStorage as a non-sensitive preference. Authentication still uses the HTTP-only archive session cookie.

## Final Elizabeth link

Send Elizabeth:

```text
/for-elizabeth
```

That page leads her to `/elizabeth/login`, where she enters the private access code.

Set `NEXT_PUBLIC_SITE_URL` or `APP_ORIGIN` in production so QR codes and reminder links use the correct domain.

Suggested message:

```text
Happy birthday, Elizabeth. I made something private for you.
Open this when you have a quiet moment: [link]
Use your private code when it asks.
```

## QR code

Go to `/admin/launch`.

You can:

- copy the final Elizabeth link
- download the QR code SVG
- print the QR card
- review launch readiness

QR destination:

```text
/for-elizabeth
```

## Keepsake view

Go to:

```text
/archive/keepsake
```

Access rules:

- Elizabeth can access after valid login and archive access rules pass.
- Admin can preview while authenticated.
- Public users are redirected to the locked archive state.

The keepsake view includes approved messages, approved memories, future wishes, selected approved photos, visible chapter context, and the final letter. It excludes admin notes, private contributor tokens, pending/rejected content, auth data, and internal contributor management details.

Use the `Print Keepsake` button to print or save as PDF.

Print behavior:

- navigation and action buttons are hidden
- page backgrounds become clean paper white
- message and photo cards avoid awkward page breaks where possible

## Export backup

Go to `/admin/export`.

Exports:

- Approved archive JSON
- All submissions JSON
- Launch backup JSON

Exports are admin-only and exclude contributor private tokens, admin notes, environment secrets, and Supabase Auth data.

## Reminder generator

Go to `/admin/reminders`.

Choose:

- Soft reminder
- Family respectful
- Friend casual
- Urgent final call

The tool generates copy-paste messages only. It does not send SMS, WhatsApp, email, or DMs.

## Launch settings

Before sending the link, use `/admin/settings`:

- close contributions if you are done collecting wishes
- turn `archive_live` on
- turn `elizabeth_access_enabled` on
- keep `maintenance_mode` off
- turn `reveal_mode_enabled` on if you want Elizabeth to see the premium opening moment

Then use `/admin/launch` to test the QR code and copy the final invite.

## Final safety checklist

Use [elizabeth-launch-day-checklist.md](./elizabeth-launch-day-checklist.md) before August 19.

## Known limitations

- QR card printing uses the browser print dialog.
- Export files are JSON backups, not designed PDF books.
- Reminder messages are copy-only.
- Run the Build 7 SQL migration before saving reveal mode from `/admin/settings`.
