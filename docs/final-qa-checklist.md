# Final QA Checklist

Use this checklist after deployment and before sending Elizabeth the private link.

## General

- [ ] Homepage loads.
- [ ] Contributor link opens with a valid token.
- [ ] Invalid contributor link shows the unavailable invite screen.
- [ ] Contributor submission works without media.
- [ ] Contributor submission works with photos.
- [ ] Oversized or unsupported media fails gracefully.
- [ ] Admin login works.
- [ ] Admin dashboard counts load.
- [ ] Admin can create and copy contributor links.
- [ ] Admin can approve/reject submissions.
- [ ] Admin can approve/reject media.
- [ ] Admin can edit chapters and final letter.
- [ ] Admin can update archive settings.
- [ ] Admin launch page loads at `/admin/launch`.
- [ ] Admin export page loads at `/admin/export`.
- [ ] Admin reminders page loads at `/admin/reminders`.
- [ ] Admin Open When page loads at `/admin/open-when`.
- [ ] Admin can create/edit/toggle/delete Open When letters.
- [ ] Admin music page loads at `/admin/music`.
- [ ] Admin can upload, preview, activate, and delete a permitted music track.

## Elizabeth access

- [ ] Invalid access code fails.
- [ ] Valid access code creates a session when configured.
- [ ] Locked archive appears before reveal rules allow access.
- [ ] Maintenance mode blocks the archive.
- [ ] Admin preview works before live access.
- [ ] Public users cannot open `/archive` directly.
- [ ] `/for-elizabeth` opens and links to `/elizabeth/login`.
- [ ] Reveal mode shows the cinematic intro once when enabled.
- [ ] Reveal mode keeps the Skip intro button available.

## Archive

- [ ] Approved submissions appear.
- [ ] Pending submissions do not appear.
- [ ] Rejected submissions do not appear.
- [ ] Approved media appears.
- [ ] Pending/rejected media does not appear.
- [ ] Media attached to rejected submissions does not appear.
- [ ] Gallery lightbox opens and closes with Escape.
- [ ] Gallery lightbox supports keyboard previous/next.
- [ ] Audio players load metadata and play.
- [ ] Videos load metadata and play.
- [ ] Chapter navigation works.
- [ ] Final letter appears.
- [ ] Graduation milestone appears.
- [ ] Fashion empire card appears.
- [ ] Pastry easter egg works.
- [ ] Archive footer shows the privacy note.
- [ ] Keepsake view opens for Elizabeth/admin at `/archive/keepsake`.
- [ ] Keepsake view does not show pending, rejected, admin-note, token, or secret data.
- [ ] Keepsake print view hides nav and controls.
- [ ] `/archive/open-when` opens for Elizabeth/admin only.
- [ ] Hidden Open When letters do not appear.
- [ ] `/archive/from-me` opens for Elizabeth/admin only.
- [ ] `/archive/favourites` opens for Elizabeth/admin only.
- [ ] Trailer can be skipped.
- [ ] Replay opening works.
- [ ] Word wall combines duplicate words with frequency.
- [ ] Heart buttons save and remove favourites.
- [ ] Favourites page only shows approved/visible saved items.
- [ ] Pastry, lilac, fashion, graduation, and soft-life easter eggs show tasteful toasts.
- [ ] Music prompt appears when an active track exists and prompt setting is enabled.
- [ ] Continue quietly keeps the archive silent.
- [ ] Play music starts low-volume playback.
- [ ] Floating music player play/pause, mute, and volume controls work.
- [ ] Music controls do not appear on `/archive/locked`.

## Launch pack

- [ ] `/admin/launch` shows the final Elizabeth invite URL.
- [ ] QR code points to `/for-elizabeth` on the production domain.
- [ ] Copy Elizabeth Link works.
- [ ] Download QR Code works.
- [ ] Print QR Card opens the browser print flow.
- [ ] Launch checklist checkboxes persist in the current browser.
- [ ] `/admin/export` downloads approved archive JSON.
- [ ] `/admin/export` downloads launch backup JSON.
- [ ] `/admin/export` does not include secrets, private tokens, or admin notes.
- [ ] `/admin/reminders` generates soft, family, friend, and urgent reminder copy.
- [ ] Reminder links use the production domain.

## Responsive and accessibility

- [ ] No horizontal scrolling on mobile.
- [ ] Mobile contributor form is easy to complete.
- [ ] Mobile archive cards stack cleanly.
- [ ] Mobile admin cards are readable.
- [ ] Focus states are visible.
- [ ] Keyboard navigation reaches buttons, links, forms, and lightbox controls.
- [ ] Reduced motion mode does not show heavy motion.
- [ ] Important information is not conveyed by colour alone.

## Production quality

- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Browser console has no hydration errors.
- [ ] No secrets are present in client code or browser logs.
- [ ] Vercel environment variables are set for Production.
- [ ] `NEXT_PUBLIC_SITE_URL` or `APP_ORIGIN` points to the production origin.
- [ ] Supabase RLS policies are enabled.
- [ ] Storage buckets exist and uploads work.

## Before sending Elizabeth the link

- [ ] Close contributions if you are done collecting wishes.
- [ ] Review all pending submissions.
- [ ] Review all pending media.
- [ ] Edit the final chapter from you.
- [ ] Upload or disable background music.
- [ ] Preview the archive as admin.
- [ ] Export the launch backup.
- [ ] Test `/for-elizabeth` on mobile.
- [ ] Test the QR code with a phone camera.
- [ ] Turn `archive_live` on.
- [ ] Turn `elizabeth_access_enabled` on.
- [ ] Send Elizabeth `/for-elizabeth` and the private access code.
