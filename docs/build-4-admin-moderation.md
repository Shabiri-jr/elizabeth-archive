# Build 4 Admin Moderation

Build 4 turns the admin area into the control room for Elizabeth's private birthday archive.

## Admin Dashboard Overview

The `/admin` page now shows live Supabase counts for:

- total, pending, approved, and rejected submissions
- total and pending media files
- total and used contributor links
- archive live status
- contributions open status

It also shows recent rows from `admin_activity_logs` so important moderation actions are visible.

## Submissions

Use `/admin/submissions` to review written birthday submissions.

Admins can:

- filter by `all`, `pending`, `approved`, or `rejected`
- search contributor name or relationship
- sort newest or oldest
- open a review panel for full message, memory, one word, future wish, permission state, media count, and linked media states
- approve a submission
- reject a submission
- restore a rejected or approved submission to pending
- save private admin notes
- delete a submission with confirmation

Approved submissions are prepared for the later archive. Rejected submissions remain out of the final archive unless restored.

## Media

Use `/admin/media` to review uploaded photos, voice notes, and videos.

Admins can:

- filter by media type and status
- preview images through short-lived signed Supabase Storage URLs
- play audio and video where the browser supports the file
- approve, reject, or restore media to pending
- delete media metadata
- optionally delete the private storage file at the same time

Media is moderated independently from written submissions. Build 5 should only render approved media where the linked submission is not rejected.

## Contributor Links

Use `/admin/contributors` to manage private invitation links.

Admins can:

- create secure random URL-safe tokens
- set optional name, relationship, email, expiry date, max submissions, and notes
- copy private links in the format `/contribute/{token}`
- update contributor metadata
- mark links used or disabled
- expire links immediately
- see submission count per link

New links work immediately with the existing `/contribute/[token]` validation flow.

## Chapters

Use `/admin/chapters` to edit the seeded archive chapters.

Admins can edit:

- title
- subtitle
- body
- sort order
- visibility

This prepares editable content for Build 5. It is not the final Elizabeth archive rendering yet.

## Archive Settings

Use `/admin/settings` to update the singleton `archive_settings` row.

Controls include:

- birthday date
- contributions open or closed
- archive live
- Elizabeth access enabled
- maintenance mode

The UI includes warning copy for reveal-sensitive toggles. Keep `archive_live` off until the final archive experience is ready.

## Activity Logs

Important admin actions insert into `admin_activity_logs`, including:

- `approve_submission`
- `reject_submission`
- `delete_submission`
- `approve_media`
- `reject_media`
- `delete_media`
- `create_contributor_link`
- `update_contributor_link`
- `update_chapter`
- `update_archive_settings`

Logs are best-effort. A moderation action should not expose admin data to public users even if log insertion fails.

## Security Notes

- Every admin route loads through server-side role checks.
- Admin access requires a Supabase session and `profiles.role = 'admin'`.
- Admin mutations are server actions and re-check the current admin before writing.
- The Supabase service-role key is used only server-side.
- Public users cannot list submissions, contributors, media, or admin logs.
- Media previews use short-lived signed URLs.
- Deleting a submission attempts to remove linked storage files and then removes the submission, letting the database cascade media rows.
- RLS policies remain intact; server-side admin actions use the service role only after the role check.

## Testing Checklist

1. Public user visiting `/admin` redirects to `/admin/login`.
2. Non-admin Supabase user is redirected with an unauthorized message.
3. Admin can access `/admin`.
4. Admin can view pending submissions.
5. Admin can approve a pending submission.
6. Admin can reject a pending submission.
7. Admin can restore a submission to pending.
8. Admin can add notes.
9. Admin can delete a submission with confirmation.
10. Admin can view uploaded media.
11. Admin can approve media.
12. Admin can reject media.
13. Admin can preview image, audio, and video files where supported.
14. Admin can create a contributor link.
15. Admin can copy a contributor link.
16. New contributor link works on `/contribute/[token]`.
17. Expired links no longer validate.
18. Admin can edit chapter text.
19. Admin can toggle chapter visibility.
20. Admin can open or close contributions.
21. Admin can toggle archive live.
22. Admin can toggle Elizabeth access enabled.
23. Important actions appear in admin activity logs.
24. `npm run lint` passes.
25. `npm run typecheck` passes.
26. `npm run build` passes.

## Known Limitations

- Final Elizabeth archive rendering will be built in Build 5.
- Advanced cinematic motion will be added later.
- Elizabeth's final login and reveal may still need polishing in Build 5 or 6.
- Admin pages are server-rendered forms, so mutation errors currently surface through the framework error boundary rather than a custom toast system.

## Build 5 Will Add

- Approved-content rendering for Elizabeth's final archive.
- Archive chapter layouts populated from Supabase.
- Final gallery, message, voice, and future-wish presentation.
- More polished reveal access for Elizabeth.
