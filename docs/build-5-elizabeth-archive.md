# Build 5 Elizabeth Archive

Build 5 creates the protected final archive experience for Elizabeth.

## Elizabeth Access

Elizabeth signs in at:

```text
/elizabeth/login
```

The access code is checked only on the server against:

```text
ELIZABETH_ACCESS_CODE
```

When the code is valid, the app creates a signed HTTP-only cookie using:

```text
ELIZABETH_SESSION_SECRET
```

The code is never exposed to the browser, stored in localStorage, or logged. If `ELIZABETH_SESSION_SECRET` is missing locally, the app falls back to the access code as the signing secret so local testing still works, but production should set a long random session secret.

## Archive Access Rules

Elizabeth can access `/archive` only when:

- the signed archive session cookie is valid
- `archive_settings.elizabeth_access_enabled` is true
- `archive_settings.archive_live` is true or the current date is on/after the configured birthday date
- `archive_settings.maintenance_mode` is false

Public users are redirected to `/archive/locked`.

Admin users can preview the final archive at:

```text
/archive/preview
```

Admin preview shows a subtle `Admin preview` badge and uses the same approved-content rendering pipeline.

## Locked Archive Screen

The locked route is:

```text
/archive/locked
```

It shows a soft reveal screen with:

- title and message based on the access state
- countdown to the configured birthday date
- lilac glow and polaroid-style reveal card
- buttons back to Elizabeth login or home

Locked states do not fetch or render final archive content.

## Content Filtering

Archive data is loaded in `lib/archive/queries.ts` through server-side Supabase access after the access gate passes.

The archive only renders:

- `birthday_submissions.status = 'approved'`
- `media_assets.status = 'approved'`
- media attached to approved submissions
- `archive_chapters.is_visible = true`

It does not render:

- pending submissions
- rejected submissions
- pending or rejected media
- media attached to rejected or pending submissions
- contributor tokens
- admin notes
- internal storage paths

Media previews use server-generated signed Supabase Storage URLs.

## Archive Experience

The archive is chapter-based and cinematic:

- Opening Prelude
- Chapter 01 — Dear Elizabeth
- Chapter 02 — The Girl We Know
- Chapter 03 — Messages From Your People
- Chapter 04 — Memories With You
- Chapter 05 — The Gallery
- Chapter 06 — Voices
- Chapter 07 — The Future We See For You
- Special Milestone Section
- Fashion Empire / Future Card
- Pastry Babe Easter Egg
- Final Chapter — From Me

Visible chapter content comes from `archive_chapters`, with fallback copy when the admin has not edited content yet.

## Empty States

Each content area has a complete empty state:

- no words
- no messages
- no memories
- no photos
- no voice notes or videos
- no future wishes

The archive should still feel intentional even before much content is approved.

## Performance Notes

- Images use signed URLs and lazy-loading.
- Audio and video use native players with `preload="metadata"`.
- Videos are not eagerly loaded.
- Motion is limited to lightweight CSS and IntersectionObserver reveal classes.
- Advanced GSAP motion is reserved for Build 6.

## Security Notes

- Elizabeth session verification happens server-side.
- Admin preview verification happens server-side.
- The service-role key remains server-only.
- Final content is never fetched for locked users.
- Storage paths are not rendered to the browser.
- The archive avoids client-side-only access decisions.

## Testing Checklist

1. Public user visiting `/archive` redirects to `/archive/locked`.
2. Invalid Elizabeth code fails on `/elizabeth/login`.
3. Valid Elizabeth code creates a signed session cookie.
4. Elizabeth remains locked if `elizabeth_access_enabled = false`.
5. Elizabeth remains locked if `archive_live = false` before the reveal date.
6. Elizabeth can access `/archive` when access is enabled and the reveal rule passes.
7. Admin can preview through `/archive/preview`.
8. Maintenance mode blocks Elizabeth access.
9. Approved submissions appear.
10. Pending and rejected submissions do not appear.
11. Approved media appears.
12. Pending and rejected media does not appear.
13. Media linked to rejected submissions does not appear.
14. Visible chapters appear.
15. Hidden chapters do not appear.
16. Gallery image lightbox opens and closes.
17. Audio and video controls render for approved media.
18. Empty states look complete.
19. Pastry babe easter egg reveals the hidden message.
20. Chapter navigation jumps between sections.
21. `npm run lint` passes.
22. `npm run typecheck` passes.
23. `npm run build` passes.

## Known Limitations

- Advanced GSAP cinematic motion and final performance polish will be added in Build 6.
- Deployment and final production hardening will happen in Build 6.
- Background music, optional downloadable keepsake, and advanced transitions can be added later.
